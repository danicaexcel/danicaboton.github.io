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
        (Join-Path $HOME 'Downloads\project02.env'),
        (Join-Path $HOME 'Downloads\.env'),
        (Join-Path $HOME 'Desktop\project02.env'),
        (Join-Path $HOME 'Documents\project02.env')
    )
    foreach ($candidate in $candidates) { if (Test-Path -LiteralPath $candidate) { return $candidate } }
    return $null
}

function Get-ErrorBody {
    param($ErrorRecord)
    try {
        if ($ErrorRecord.ErrorDetails -and $ErrorRecord.ErrorDetails.Message) { return $ErrorRecord.ErrorDetails.Message }
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
    $params = @{ Method=$Method; Uri=$Uri; Headers=$script:Headers }
    if ($null -ne $Body) {
        $params.ContentType = 'application/json'
        $params.Body = $Body
    }
    Invoke-RestMethod @params
}

function Publish-N8nWorkflow {
    param($Workflow)
    if (-not $Workflow.id) { return $false }
    if (($Workflow.PSObject.Properties.Name -contains 'active') -and [bool]$Workflow.active) { return $true }
    if (($Workflow.PSObject.Properties.Name -contains 'activeVersionId') -and -not [string]::IsNullOrWhiteSpace([string]$Workflow.activeVersionId)) { return $true }

    $activateUri = "$script:N8nBaseUrl/api/v1/workflows/$($Workflow.id)/activate"
    try {
        $activated = Invoke-N8n -Method POST -Uri $activateUri
        return $true
    } catch {
        if ($Workflow.versionId) {
            try {
                $body = @{ versionId = $Workflow.versionId } | ConvertTo-Json
                $activated = Invoke-N8n -Method POST -Uri $activateUri -Body $body
                return $true
            } catch {}
        }
        try {
            $publishUri = "$script:N8nBaseUrl/api/v1/workflows/$($Workflow.id)/publish"
            $published = Invoke-N8n -Method POST -Uri $publishUri
            return $true
        } catch {
            return $false
        }
    }
}

function Deploy-Workflow {
    param(
        [Parameter(Mandatory=$true)][string]$RelativePath,
        [Parameter(Mandatory=$true)][string[]]$KnownNames
    )

    $rawUrl = "https://raw.githubusercontent.com/dbauto/danicaboton.github.io/main/$RelativePath"
    Write-Host "  Downloading $RelativePath"
    $workflowRaw = (Invoke-WebRequest -UseBasicParsing -Uri $rawUrl).Content
    $workflow = $workflowRaw | ConvertFrom-Json

    # Compatibility payload for the user's n8n Public API version.
    # description, pinData, active, versionId, meta and tags are intentionally omitted.
    $payloadObject = [ordered]@{
        name = $workflow.name
        nodes = $workflow.nodes
        connections = $workflow.connections
        settings = $workflow.settings
    }
    $payload = $payloadObject | ConvertTo-Json -Depth 100

    $existing = $script:AllWorkflows | Where-Object { $KnownNames -contains $_.name } | Select-Object -First 1
    if ($existing) {
        Write-Host "  Updating: $($workflow.name) [$($existing.id)]"
        $deployed = Invoke-N8n -Method PUT -Uri "$script:N8nBaseUrl/api/v1/workflows/$($existing.id)" -Body $payload
        $verb = 'updated'
    } else {
        Write-Host "  Creating: $($workflow.name)"
        $deployed = Invoke-N8n -Method POST -Uri "$script:N8nBaseUrl/api/v1/workflows" -Body $payload
        $verb = 'created'
        $script:AllWorkflows += $deployed
    }

    $published = Publish-N8nWorkflow -Workflow $deployed
    $status = if ($published) { 'published' } else { 'draft' }
    Write-Host "  OK: $verb / $status" -ForegroundColor Green
    return [PSCustomObject]@{ Name=$deployed.name; Id=$deployed.id; Verb=$verb; Published=$published }
}

Write-Host "Project 02 full n8n deployment" -ForegroundColor Cyan
Write-Host "-------------------------------"

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
if (-not $apiKey) { throw "No n8n API key found. Add N8N_API_KEY=... to a local env file." }

if (-not $N8nBaseUrl) { $N8nBaseUrl = $env:N8N_BASE_URL }
if (-not $N8nBaseUrl) { $N8nBaseUrl = $env:N8N_URL }
if (-not $N8nBaseUrl) { $N8nBaseUrl = 'https://herta-unbedabbled-unsynchronously.ngrok-free.dev' }
$script:N8nBaseUrl = $N8nBaseUrl.TrimEnd('/')
$script:Headers = @{ 'X-N8N-API-KEY'=$apiKey; 'ngrok-skip-browser-warning'='true' }

Write-Host "n8n endpoint: $script:N8nBaseUrl"
Write-Host "API key: loaded (value hidden)"

try {
    $list = Invoke-N8n -Method GET -Uri "$script:N8nBaseUrl/api/v1/workflows?limit=100"
    Write-Host "Connection/authentication check: OK" -ForegroundColor Green
} catch {
    $body = Get-ErrorBody $_
    if ($body) { Write-Host "n8n response: $body" -ForegroundColor Red }
    throw "Could not authenticate to n8n through the configured tunnel."
}

$script:AllWorkflows = @()
if ($list -and $list.data) { $script:AllWorkflows = @($list.data) }
elseif ($list) { $script:AllWorkflows = @($list) }

$specs = @(
    @{ Path='n8n-workflows/01-enterprise-operations-workspace.json'; Names=@('Portfolio - Project 02 Operations State Engine','Portfolio - Monday.com Project Operations Control Center') },
    @{ Path='n8n-workflows/project-02/01-task-integrity.json'; Names=@('Project 02 - 01 Task Integrity & Project Sync') },
    @{ Path='n8n-workflows/project-02/02-work-session-lifecycle.json'; Names=@('Project 02 - 02 Work Session Lifecycle') },
    @{ Path='n8n-workflows/project-02/03-effort-rollup.json'; Names=@('Project 02 - 03 Effort Rollup Engine') },
    @{ Path='n8n-workflows/project-02/04-revision-rework.json'; Names=@('Project 02 - 04 Revision & Rework Control') },
    @{ Path='n8n-workflows/project-02/05-escalation-overdue.json'; Names=@('Project 02 - 05 Escalation & Overdue Engine') },
    @{ Path='n8n-workflows/project-02/06-timesheet-builder.json'; Names=@('Project 02 - 06 Timesheet Builder & Submission') },
    @{ Path='n8n-workflows/project-02/07-approval-ledger.json'; Names=@('Project 02 - 07 Timesheet Approval & Ledger Posting') },
    @{ Path='n8n-workflows/project-02/08-rate-resolver.json'; Names=@('Project 02 - 08 Effective-Dated Rate Resolver') },
    @{ Path='n8n-workflows/project-02/09-kpi-dashboard.json'; Names=@('Project 02 - 09 Project KPI & Dashboard Recalculation') },
    @{ Path='n8n-workflows/project-02/10-reconciliation-audit.json'; Names=@('Project 02 - 10 Reconciliation & Audit') }
)

$results = @()
try {
    foreach ($spec in $specs) {
        $results += Deploy-Workflow -RelativePath $spec.Path -KnownNames $spec.Names
    }
} catch {
    $body = Get-ErrorBody $_
    Write-Host ""
    Write-Host "Project 02 deployment failed." -ForegroundColor Red
    if ($body) { Write-Host "n8n response: $body" -ForegroundColor Yellow }
    throw
}

Write-Host ""
Write-Host "Deployment summary" -ForegroundColor Cyan
Write-Host "------------------"
foreach ($r in $results) {
    $pub = if ($r.Published) { 'published' } else { 'draft' }
    Write-Host ("{0,-62} {1,-8} {2}" -f $r.Name, $r.Verb, $pub)
}

try {
    $healthBody = @{
        action='health.check'; project='monday-project-ops'; clientId='deployment-health-check'; requestId="deploy-$([Guid]::NewGuid())"; payload=@{}
    } | ConvertTo-Json -Depth 10
    $health = Invoke-RestMethod -Method POST -Uri "$script:N8nBaseUrl/webhook/portfolio-enterprise-operations" -ContentType 'application/json' -Body $healthBody
    if ($health.ok) { Write-Host ""; Write-Host "Core production webhook health check: OK" -ForegroundColor Green }
} catch {
    Write-Host ""; Write-Host "Core workflow deployed, but production webhook health check did not complete. If any item above says draft, publish that workflow in n8n." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Project 02 now contains 1 central state engine + 10 visible functional workflow families." -ForegroundColor Green
Write-Host "No Monday.com connection is required."
