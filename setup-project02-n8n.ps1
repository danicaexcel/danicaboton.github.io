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
        $response = $ErrorRecord.Exception.Response
        if ($null -eq $response) { return $null }
        $stream = $response.GetResponseStream()
        if ($null -eq $stream) { return $null }
        $reader = New-Object System.IO.StreamReader($stream)
        return $reader.ReadToEnd()
    } catch { return $null }
}

Write-Host "Project 02 n8n setup" -ForegroundColor Cyan
Write-Host "--------------------"

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
    throw "No n8n API key found. Add N8N_API_KEY=... to a local .env file or set the N8N_API_KEY environment variable."
}

if (-not $N8nBaseUrl) { $N8nBaseUrl = $env:N8N_BASE_URL }
if (-not $N8nBaseUrl) { $N8nBaseUrl = $env:N8N_URL }
if (-not $N8nBaseUrl) { $N8nBaseUrl = 'https://herta-unbedabbled-unsynchronously.ngrok-free.dev' }
$N8nBaseUrl = $N8nBaseUrl.TrimEnd('/')

$headers = @{
    'X-N8N-API-KEY' = $apiKey
    'ngrok-skip-browser-warning' = 'true'
}

Write-Host "n8n endpoint: $N8nBaseUrl"
Write-Host "API key: loaded (value hidden)"

try {
    $null = Invoke-RestMethod -Method GET -Uri "$N8nBaseUrl/api/v1/workflows?limit=1" -Headers $headers
    Write-Host "Connection/authentication check: OK" -ForegroundColor Green
} catch {
    $body = Get-ErrorBody $_
    if ($body) { Write-Host "n8n response: $body" -ForegroundColor Red }
    throw "Could not authenticate to the n8n Public API through the configured tunnel."
}

$workflowUrl = 'https://raw.githubusercontent.com/dbauto/danicaboton.github.io/main/n8n-workflows/01-enterprise-operations-workspace.json'
Write-Host "Downloading latest Project 02 workflow from GitHub..."
$workflowRaw = (Invoke-WebRequest -UseBasicParsing -Uri $workflowUrl).Content
$workflow = $workflowRaw | ConvertFrom-Json

# Build an API-safe create payload. Read-only fields from exported n8n workflows are intentionally excluded.
$payloadObject = [ordered]@{
    name = $workflow.name
    nodes = $workflow.nodes
    connections = $workflow.connections
    settings = $workflow.settings
}
if ($workflow.description) { $payloadObject.description = $workflow.description }
if ($null -ne $workflow.pinData) { $payloadObject.pinData = $workflow.pinData }

$payload = $payloadObject | ConvertTo-Json -Depth 100

try {
    $created = Invoke-RestMethod `
        -Method POST `
        -Uri "$N8nBaseUrl/api/v1/workflows" `
        -Headers $headers `
        -ContentType 'application/json' `
        -Body $payload

    Write-Host "" 
    Write-Host "SUCCESS: Project 02 workflow created in n8n." -ForegroundColor Green
    Write-Host "Workflow name: $($created.name)"
    Write-Host "Workflow ID:   $($created.id)"
    Write-Host "Webhook path:  portfolio-enterprise-operations"
    Write-Host "" 
    Write-Host "Next: open n8n, review the created workflow, then we can attach the real Monday.com workflow families and board mappings."
} catch {
    $body = Get-ErrorBody $_
    Write-Host "" 
    Write-Host "Workflow creation failed." -ForegroundColor Red
    if ($body) { Write-Host "n8n response: $body" -ForegroundColor Yellow }
    throw
}
