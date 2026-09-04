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
        $name = $line.Substring(0,$eq).Trim()
        $value = $line.Substring($eq+1).Trim()
        if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
            $value = $value.Substring(1,$value.Length-2)
        }
        if ($name) { [Environment]::SetEnvironmentVariable($name,$value,'Process') }
    }
}

function Find-EnvFile {
    $candidates = @(
        (Join-Path (Get-Location) '.env'),
        (Join-Path $HOME 'Downloads\project02.env'),
        (Join-Path $HOME 'Downloads\.env'),
        (Join-Path $HOME '.env'),
        (Join-Path $HOME 'Desktop\project02.env'),
        (Join-Path $HOME 'Documents\project02.env')
    )
    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate) { return $candidate }
    }
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
    $params = @{Method=$Method;Uri=$Uri;Headers=$script:Headers}
    if ($null -ne $Body) {
        $params.ContentType = 'application/json'
        $params.Body = $Body
    }
    Invoke-RestMethod @params
}

function Set-Property {
    param($Object,[string]$Name,$Value)
    if ($Object.PSObject.Properties.Name -contains $Name) { $Object.$Name = $Value }
    else { $Object | Add-Member -NotePropertyName $Name -NotePropertyValue $Value -Force }
}

Write-Host 'Project 02 role-based backend update' -ForegroundColor Cyan
Write-Host '------------------------------------'

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
if (-not $apiKey) { throw 'No n8n API key found.' }

if (-not $N8nBaseUrl) { $N8nBaseUrl = $env:N8N_BASE_URL }
if (-not $N8nBaseUrl) { $N8nBaseUrl = $env:N8N_URL }
if (-not $N8nBaseUrl) { $N8nBaseUrl = 'https://herta-unbedabbled-unsynchronously.ngrok-free.dev' }
$script:N8nBaseUrl = $N8nBaseUrl.TrimEnd('/')
$script:Headers = @{'X-N8N-API-KEY'=$apiKey;'ngrok-skip-browser-warning'='true'}

Write-Host "n8n endpoint: $script:N8nBaseUrl"
Write-Host 'API key: loaded (value hidden)'

try {
    $list = Invoke-N8n -Method GET -Uri "$script:N8nBaseUrl/api/v1/workflows?limit=100"
    Write-Host 'Connection/authentication check: OK' -ForegroundColor Green
} catch {
    $body = Get-ErrorBody $_
    if ($body) { Write-Host "n8n response: $body" -ForegroundColor Yellow }
    throw
}

$all = if ($list.data) { @($list.data) } else { @($list) }
$workflow = $all | Where-Object { $_.name -eq 'Portfolio - Project 02 Unified Operations Control Center' } | Select-Object -First 1
if (-not $workflow) {
    throw 'Unified Project 02 workflow was not found. Run setup-project02-n8n.ps1 first.'
}

Write-Host "Found workflow: $($workflow.name) [$($workflow.id)]"
$full = Invoke-N8n -Method GET -Uri "$script:N8nBaseUrl/api/v1/workflows/$($workflow.id)"

$normalize = $full.nodes | Where-Object { $_.name -eq 'Normalize Request' } | Select-Object -First 1
$engine = $full.nodes | Where-Object { $_.name -eq 'Unified State + Business Rules Engine' -or $_.name -eq 'Project 02 State Engine' } | Select-Object -First 1
$router = $full.nodes | Where-Object { $_.name -eq '02 - ACTION ROUTER' } | Select-Object -First 1
$taskSection = $full.nodes | Where-Object { $_.name -eq '01 - Task Integrity & Project Sync' } | Select-Object -First 1
$timesheetSection = $full.nodes | Where-Object { $_.name -eq '06 - Timesheet Builder & Submission' } | Select-Object -First 1
$approvalSection = $full.nodes | Where-Object { $_.name -eq '07 - Timesheet Approval Boundary' } | Select-Object -First 1

if (-not $normalize -or -not $engine -or -not $router) {
    throw 'Unified workflow is missing Normalize Request, State Engine, or ACTION ROUTER.'
}

Write-Host 'Downloading role-aware engine sources...'
$normalizeCode = (Invoke-WebRequest -UseBasicParsing -Uri 'https://raw.githubusercontent.com/dbauto/danicaboton.github.io/main/n8n-workflows/project02-normalize-request.js').Content
$engineCode = (Invoke-WebRequest -UseBasicParsing -Uri 'https://raw.githubusercontent.com/dbauto/danicaboton.github.io/main/n8n-workflows/project02-state-engine.js').Content

$normalize.parameters.jsCode = $normalizeCode
$engine.parameters.jsCode = $engineCode
Set-Property $engine 'notesInFlow' $true
Set-Property $engine 'notes' 'Role-aware authoritative state/business-rules engine: project/task creation, My Work, review queues, revision re-approval, timesheet approval, ledger posting, KPI and audit.'

$router.parameters.mode = 'expression'
$router.parameters.numberOutputs = 10
$router.parameters.output = @'
={{
  ($json.action || '').startsWith('project.') || ($json.action || '').startsWith('task.') ? 1 :
  ($json.action || '').startsWith('session.') ? 2 :
  ($json.action || '').startsWith('revision.') ? 3 :
  ($json.action || '').startsWith('escalation.') ? 4 :
  ['timesheet.approve','timesheet.reviewQueue','ledger.post'].includes($json.action) ? 6 :
  ($json.action || '').startsWith('timesheet.') ? 5 :
  $json.action === 'rate.resolve' ? 7 :
  $json.action === 'dashboard.refresh' ? 8 :
  $json.action === 'reconciliation.run' ? 9 : 0
}}
'@
Set-Property $router 'notesInFlow' $true
Set-Property $router 'notes' 'True 10-output router. Project/task creation and role queues route to Task Control; timesheet review/approval routes to the Approval boundary.'

if ($taskSection) {
    Set-Property $taskSection 'notes' 'Project/task creation and integrity, My Work queue, reviewer queue, submission, quality approval, and controlled source-field synchronization.'
}
if ($timesheetSection) {
    Set-Property $timesheetSection 'notes' 'Build worker-period timesheets from CLOSED sessions and control draft/submission/return/reject states.'
}
if ($approvalSection) {
    Set-Property $approvalSection 'notes' 'Timesheet approval queue and authoritative cost-posting boundary. Quality/task approval remains separate in Task Control.'
}

$payload = [ordered]@{
    name = $full.name
    nodes = $full.nodes
    connections = $full.connections
    settings = $full.settings
} | ConvertTo-Json -Depth 100

try {
    Write-Host 'Updating unified workflow in place...'
    $updated = Invoke-N8n -Method PUT -Uri "$script:N8nBaseUrl/api/v1/workflows/$($full.id)" -Body $payload
    Write-Host "Workflow updated: $($updated.id)" -ForegroundColor Green
} catch {
    $body = Get-ErrorBody $_
    if ($body) { Write-Host "n8n response: $body" -ForegroundColor Yellow }
    throw
}

try {
    $healthBody = @{
        action='health.check';project='monday-project-ops';clientId='role-backend-validation';requestId="role-$([Guid]::NewGuid())";payload=@{}
    } | ConvertTo-Json -Depth 10
    $health = Invoke-RestMethod -Method POST -Uri "$script:N8nBaseUrl/webhook/portfolio-enterprise-operations" -ContentType 'application/json' -Body $healthBody
    if ($health.ok) { Write-Host 'health.check: OK' -ForegroundColor Green }

    $workBody = @{
        action='task.workQueue';project='monday-project-ops';clientId='role-backend-validation';requestId="work-$([Guid]::NewGuid())";payload=@{worker='Carlo Mendoza'}
    } | ConvertTo-Json -Depth 10
    $work = Invoke-RestMethod -Method POST -Uri "$script:N8nBaseUrl/webhook/portfolio-enterprise-operations" -ContentType 'application/json' -Body $workBody
    if ($work.ok) { Write-Host 'task.workQueue: OK' -ForegroundColor Green }

    $reviewBody = @{
        action='task.reviewQueue';project='monday-project-ops';clientId='role-backend-validation';requestId="review-$([Guid]::NewGuid())";payload=@{reviewer='Maria Santos'}
    } | ConvertTo-Json -Depth 10
    $review = Invoke-RestMethod -Method POST -Uri "$script:N8nBaseUrl/webhook/portfolio-enterprise-operations" -ContentType 'application/json' -Body $reviewBody
    if ($review.ok) { Write-Host 'task.reviewQueue: OK' -ForegroundColor Green }

    $tsBody = @{
        action='timesheet.reviewQueue';project='monday-project-ops';clientId='role-backend-validation';requestId="ts-$([Guid]::NewGuid())";payload=@{approver='Maria Santos'}
    } | ConvertTo-Json -Depth 10
    $ts = Invoke-RestMethod -Method POST -Uri "$script:N8nBaseUrl/webhook/portfolio-enterprise-operations" -ContentType 'application/json' -Body $tsBody
    if ($ts.ok) { Write-Host 'timesheet.reviewQueue: OK' -ForegroundColor Green }
} catch {
    Write-Host 'Workflow updated, but one or more production webhook smoke tests did not complete. If the workflow shows a pending Publish button, publish it once and rerun this updater.' -ForegroundColor Yellow
}

Write-Host ''
Write-Host 'Project 02 role backend update complete.' -ForegroundColor Cyan
Write-Host 'New actions: project.create, task.create, task.workQueue, task.reviewQueue, timesheet.reviewQueue.'
Write-Host 'Revision resolution now resubmits the task to For Review; task approval is required again.'
