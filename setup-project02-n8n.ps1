param(
    [string]$EnvFile = "",
    [string]$N8nBaseUrl = ""
)

$ErrorActionPreference = 'Stop'

function Import-DotEnv {
    param([Parameter(Mandatory=$true)][string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) { throw "Environment file not found: $Path" }

    Get-Content -LiteralPath $Path | ForEach-Object {
        $line = $_.Trim()
        if (-not $line -or $line.StartsWith('#')) { return }
        if ($line.StartsWith('export ')) { $line = $line.Substring(7).Trim() }
        $eq = $line.IndexOf('=')
        if ($eq -lt 1) { return }

        $name = $line.Substring(0, $eq).Trim()
        $value = $line.Substring($eq + 1).Trim()
        if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
            $value = $value.Substring(1, $value.Length - 2)
        }
        if ($name) { [Environment]::SetEnvironmentVariable($name, $value, 'Process') }
    }
}

function Find-EnvFile {
    $candidates = @(
        (Join-Path (Get-Location) '.env'),
        (Join-Path $PSScriptRoot '.env'),
        (Join-Path $HOME '.env'),
        (Join-Path $HOME 'Downloads\.env'),
        (Join-Path $HOME 'Desktop\.env'),
        (Join-Path $HOME 'Documents\.env')
    )
    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate) { return $candidate }
    }

    foreach ($folder in @('Downloads','Desktop','Documents')) {
        $root = Join-Path $HOME $folder
        if (-not (Test-Path -LiteralPath $root)) { continue }
        $match = Get-ChildItem -LiteralPath $root -File -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -eq '.env' -or $_.Extension -eq '.env' } |
            Select-Object -First 1
        if ($match) { return $match.FullName }
    }
    return $null
}

function Get-ErrorBody {
    param($ErrorRecord)
    try {
        if ($ErrorRecord.ErrorDetails -and $ErrorRecord.ErrorDetails.Message) {
            return $ErrorRecord.ErrorDetails.Message
        }
        $response = $ErrorRecord.Exception.Response
        if ($null -eq $response) { return $null }
        $stream = $response.GetResponseStream()
        if ($null -eq $stream) { return $null }
        $reader = New-Object System.IO.StreamReader($stream)
        return $reader.ReadToEnd()
    } catch { return $null }
}

function Invoke-N8n {
    param(
        [Parameter(Mandatory=$true)][string]$Method,
        [Parameter(Mandatory=$true)][string]$Uri,
        [object]$Body = $null
    )
    $params = @{
        Method = $Method
        Uri = $Uri
        Headers = $script:Headers
    }
    if ($null -ne $Body) {
        $params.ContentType = 'application/json'
        $params.Body = $Body
    }
    Invoke-RestMethod @params
}

Write-Host "Project 02 n8n deployment" -ForegroundColor Cyan
Write-Host "-------------------------"

if (-not $env:N8N_API_KEY) {
    if (-not $EnvFile) { $EnvFile = Find-EnvFile }
    if ($EnvFile) {
        Import-DotEnv -Path $EnvFile
        Write-Host "Loaded local environment file: $EnvFile"
    }
}

$apiKey = $env:N8N_API_KEY
if (-not $apiKey) { $apiKey = $env:N8N_APIKEY }
if (-not $apiKey) { $apiKey = $env:N8N_KEY }
if (-not $apiKey) {
    throw "No n8n API key found. Add N8N_API_KEY=... to a local .env file or set N8N_API_KEY in this PowerShell session."
}

if (-not $N8nBaseUrl) { $N8nBaseUrl = $env:N8N_BASE_URL }
if (-not $N8nBaseUrl) { $N8nBaseUrl = $env:N8N_URL }
if (-not $N8nBaseUrl) { $N8nBaseUrl = 'https://herta-unbedabbled-unsynchronously.ngrok-free.dev' }
$N8nBaseUrl = $N8nBaseUrl.TrimEnd('/')

$script:Headers = @{
    'X-N8N-API-KEY' = $apiKey
    'ngrok-skip-browser-warning' = 'true'
}

Write-Host "n8n endpoint: $N8nBaseUrl"
Write-Host "API key: loaded (value hidden)"

try {
    $list = Invoke-N8n -Method GET -Uri "$N8nBaseUrl/api/v1/workflows?limit=100"
    Write-Host "Connection/authentication check: OK" -ForegroundColor Green
} catch {
    $body = Get-ErrorBody $_
    if ($body) { Write-Host "n8n response: $body" -ForegroundColor Red }
    throw "Could not authenticate to the n8n Public API through the configured tunnel."
}

$workflowUrl = 'https://raw.githubusercontent.com/dbauto/danicaboton.github.io/main/n8n-workflows/01-enterprise-operations-workspace.json'
Write-Host "Downloading latest Project 02 state engine from GitHub..."
$workflowRaw = (Invoke-WebRequest -UseBasicParsing -Uri $workflowUrl).Content
$workflow = $workflowRaw | ConvertFrom-Json

# Compatibility payload: some self-hosted n8n Public API versions reject optional
# workflow properties such as description and pinData. Keep create/update to the
# stable core fields accepted across versions.
$payloadObject = [ordered]@{
    name = $workflow.name
    nodes = $workflow.nodes
    connections = $workflow.connections
    settings = $workflow.settings
}
$payload = $payloadObject | ConvertTo-Json -Depth 100

$all = @()
if ($list -and $list.data) { $all = @($list.data) }
elseif ($list) { $all = @($list) }

$knownNames = @(
    'Portfolio - Project 02 Operations State Engine',
    'Portfolio - Monday.com Project Operations Control Center'
)
$existing = $all | Where-Object { $knownNames -contains $_.name } | Select-Object -First 1

try {
    if ($existing) {
        Write-Host "Existing Project 02 workflow found: $($existing.id)"
        $deployed = Invoke-N8n -Method PUT -Uri "$N8nBaseUrl/api/v1/workflows/$($existing.id)" -Body $payload
        $verb = 'updated'
    } else {
        $deployed = Invoke-N8n -Method POST -Uri "$N8nBaseUrl/api/v1/workflows" -Body $payload
        $verb = 'created'
    }

    Write-Host ""
    Write-Host "SUCCESS: Project 02 workflow $verb." -ForegroundColor Green
    Write-Host "Workflow name: $($deployed.name)"
    Write-Host "Workflow ID:   $($deployed.id)"
    Write-Host "Webhook path:  portfolio-enterprise-operations"

    $published = $false
    if ($deployed.PSObject.Properties.Name -contains 'activeVersionId') {
        $published = -not [string]::IsNullOrWhiteSpace([string]$deployed.activeVersionId)
    } elseif ($deployed.PSObject.Properties.Name -contains 'active') {
        $published = [bool]$deployed.active
    }

    if ($published) {
        Write-Host "Publication status: published" -ForegroundColor Green
        try {
            $healthBody = @{
                action = 'health.check'
                project = 'monday-project-ops'
                clientId = 'deployment-health-check'
                requestId = "deploy-$([Guid]::NewGuid())"
                payload = @{}
            } | ConvertTo-Json -Depth 10
            $health = Invoke-RestMethod -Method POST -Uri "$N8nBaseUrl/webhook/portfolio-enterprise-operations" -ContentType 'application/json' -Body $healthBody
            if ($health.ok) { Write-Host "Production webhook health check: OK" -ForegroundColor Green }
        } catch {
            Write-Host "Workflow is published, but the production webhook health check did not complete. Open the workflow execution log for details." -ForegroundColor Yellow
        }
    } else {
        Write-Host "Publication status: draft" -ForegroundColor Yellow
        Write-Host "Open this workflow in n8n and click Publish once to register the production webhook." -ForegroundColor Yellow
    }

    Write-Host ""
    Write-Host "Implemented families:"
    Write-Host "  - Task integrity and source-field sync"
    Write-Host "  - Append-only Start / Pause / Resume / Stop work sessions"
    Write-Host "  - Original vs revision/rework effort rollups"
    Write-Host "  - Revision creation and resolution"
    Write-Host "  - Timesheet build / submit / return / reject / approve"
    Write-Host "  - Effective-dated labor rate resolution"
    Write-Host "  - Locked Approved Work Ledger posting on approval"
    Write-Host "  - Escalation create / clear and dynamic overdue detection"
    Write-Host "  - Project/task KPI recalculation"
    Write-Host "  - Idempotency, audit logs, and 15-minute reconciliation"
} catch {
    $body = Get-ErrorBody $_
    Write-Host ""
    Write-Host "Project 02 deployment failed." -ForegroundColor Red
    if ($body) { Write-Host "n8n response: $body" -ForegroundColor Yellow }
    throw
}
