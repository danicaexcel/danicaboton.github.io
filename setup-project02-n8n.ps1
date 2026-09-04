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
    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate) { return $candidate }
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
    } catch {
        return $null
    }
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

function Set-ObjectProperty {
    param(
        [Parameter(Mandatory=$true)]$Object,
        [Parameter(Mandatory=$true)][string]$Name,
        [Parameter(Mandatory=$true)]$Value
    )

    if ($Object.PSObject.Properties.Name -contains $Name) {
        $Object.$Name = $Value
    } else {
        $Object | Add-Member -NotePropertyName $Name -NotePropertyValue $Value -Force
    }
}

function New-CodeNode {
    param(
        [string]$Id,
        [string]$Name,
        [string]$Code,
        [int]$X,
        [int]$Y,
        [string]$Notes = ''
    )

    return [PSCustomObject]@{
        parameters = [PSCustomObject]@{ jsCode = $Code }
        id = $Id
        name = $Name
        type = 'n8n-nodes-base.code'
        typeVersion = 2
        position = @($X,$Y)
        notesInFlow = $true
        notes = $Notes
    }
}

function New-SwitchNode {
    param(
        [string]$Id,
        [string]$Name,
        [string]$OutputExpression,
        [int]$NumberOutputs,
        [int]$X,
        [int]$Y,
        [string]$Notes = ''
    )

    return [PSCustomObject]@{
        parameters = [PSCustomObject]@{
            mode = 'expression'
            numberOutputs = $NumberOutputs
            output = $OutputExpression
        }
        id = $Id
        name = $Name
        type = 'n8n-nodes-base.switch'
        typeVersion = 3.2
        position = @($X,$Y)
        notesInFlow = $true
        notes = $Notes
    }
}

function New-SingleLink {
    param([Parameter(Mandatory=$true)][string]$Target)
    $edge = [PSCustomObject]@{ node=$Target; type='main'; index=0 }
    return @{ main = @(, @($edge)) }
}

function New-MultiOutputLink {
    param([Parameter(Mandatory=$true)][string[]]$Targets)
    $outputs = @()
    foreach ($target in $Targets) {
        $edge = [PSCustomObject]@{ node=$target; type='main'; index=0 }
        $outputs += ,@($edge)
    }
    return @{ main = $outputs }
}

function Test-WorkflowStructure {
    param([Parameter(Mandatory=$true)]$Workflow)

    $names = @($Workflow.nodes | ForEach-Object { $_.name })
    $duplicates = @($names | Group-Object | Where-Object { $_.Count -gt 1 })
    if ($duplicates.Count -gt 0) {
        throw "Duplicate n8n node name(s): $($duplicates.Name -join ', ')"
    }

    $connectionKeys = @()
    if ($Workflow.connections -is [System.Collections.IDictionary]) {
        $connectionKeys = @($Workflow.connections.Keys)
    } else {
        $connectionKeys = @($Workflow.connections.PSObject.Properties.Name)
    }

    foreach ($source in $connectionKeys) {
        if ($names -notcontains [string]$source) {
            throw "Connection source references missing node: $source"
        }

        if ($Workflow.connections -is [System.Collections.IDictionary]) {
            $entry = $Workflow.connections[$source]
        } else {
            $entry = $Workflow.connections.$source
        }

        foreach ($output in @($entry.main)) {
            foreach ($edge in @($output)) {
                if ($edge -and $edge.node -and $names -notcontains [string]$edge.node) {
                    throw "Connection from '$source' references missing node '$($edge.node)'"
                }
            }
        }
    }

    $webhooks = @($Workflow.nodes | Where-Object { $_.type -eq 'n8n-nodes-base.webhook' })
    if ($webhooks.Count -ne 1) {
        throw "Unified Project 02 workflow must contain exactly one webhook trigger; found $($webhooks.Count)."
    }

    $actionRouter = $Workflow.nodes | Where-Object { $_.name -eq '02 - ACTION ROUTER' } | Select-Object -First 1
    if (-not $actionRouter -or $actionRouter.type -ne 'n8n-nodes-base.switch') {
        throw 'Unified Project 02 workflow must use a true Switch node for the main action router.'
    }
}

function Build-UnifiedWorkflow {
    param([Parameter(Mandatory=$true)]$Workflow)

    $Workflow.name = 'Portfolio - Project 02 Unified Operations Control Center'

    $webhook = $Workflow.nodes | Where-Object { $_.name -eq 'Project 02 Webhook' } | Select-Object -First 1
    $normalize = $Workflow.nodes | Where-Object { $_.name -eq 'Normalize Request' } | Select-Object -First 1
    $engine = $Workflow.nodes | Where-Object { $_.name -eq 'Project 02 State Engine' } | Select-Object -First 1
    $respond = $Workflow.nodes | Where-Object { $_.name -eq 'Respond to Portfolio' } | Select-Object -First 1
    $schedule = $Workflow.nodes | Where-Object { $_.name -eq '15 Minute Reconciliation' } | Select-Object -First 1
    $scheduledProcessor = $Workflow.nodes | Where-Object { $_.name -eq 'Scheduled Reconciliation' } | Select-Object -First 1

    if (-not $webhook -or -not $normalize -or -not $engine -or -not $respond -or -not $schedule -or -not $scheduledProcessor) {
        throw 'Base Project 02 workflow is missing a required core or reconciliation node.'
    }

    $webhook.position = @(-1940,0)
    Set-ObjectProperty $webhook 'notesInFlow' $true
    Set-ObjectProperty $webhook 'notes' 'Single public ingress for all Project 02 portfolio actions.'

    $normalize.position = @(-1690,0)
    Set-ObjectProperty $normalize 'notesInFlow' $true
    Set-ObjectProperty $normalize 'notes' 'Normalize action, client, request, correlation and payload metadata.'

    $engine.position = @(650,0)
    $engine.name = 'Unified State + Business Rules Engine'
    Set-ObjectProperty $engine 'notesInFlow' $true
    Set-ObjectProperty $engine 'notes' 'Authoritative state and business-rule engine for webhook-driven operations.'

    $respond.position = @(950,0)
    Set-ObjectProperty $respond 'notesInFlow' $true
    Set-ObjectProperty $respond 'notes' 'HTTP response terminal used only by webhook-triggered executions.'

    $schedule.position = @(-1940,1030)
    Set-ObjectProperty $schedule 'notesInFlow' $true
    Set-ObjectProperty $schedule 'notes' 'Independent 15-minute trigger for scheduled integrity reconciliation.'

    $scheduledProcessor.position = @(-80,1030)
    $scheduledProcessor.name = '10B - Execute Scheduled Reconciliation'
    Set-ObjectProperty $scheduledProcessor 'notesInFlow' $true
    Set-ObjectProperty $scheduledProcessor 'notes' 'Scans every stored demo client, applies safe repairs, and writes reconciliation audit evidence.'

    $actionRouterExpression = @'
={{
  ($json.action || '').startsWith('task.') || $json.action === 'project.sync' ? 1 :
  ($json.action || '').startsWith('session.') ? 2 :
  ($json.action || '').startsWith('revision.') ? 3 :
  ($json.action || '').startsWith('escalation.') ? 4 :
  ['timesheet.build','timesheet.submit','timesheet.return','timesheet.reject'].includes($json.action) ? 5 :
  ['timesheet.approve','ledger.post'].includes($json.action) ? 6 :
  $json.action === 'rate.resolve' ? 7 :
  $json.action === 'dashboard.refresh' ? 8 :
  $json.action === 'reconciliation.run' ? 9 : 0
}}
'@
    $actionRouter = New-SwitchNode 'p02-action-router' '02 - ACTION ROUTER' $actionRouterExpression 10 -1420 0 'True 10-output router. Each webhook request leaves through exactly one action-family output.'

    function Section([string]$id,[string]$name,[string]$label,[string]$routeKey,[int]$y,[string]$notes) {
        $code = "return [{json:{...`$json,invocationSource:`$json.invocationSource||'webhook',routeKey:'$routeKey',routeTrace:[...(`$json.routeTrace||[]),'$label'],workflowSection:'$label'}}];"
        return New-CodeNode $id $name $code -1030 $y $notes
    }

    $sSystem = Section 'p02-section-system' '00 - System / State Control' '00 System / State' 'system' -720 'Health, state read/reset, retry metadata and invalid-request handling.'
    $sTask = Section 'p02-section-task' '01 - Task Integrity & Project Sync' '01 Task Integrity & Project Sync' 'task' -570 'Task/project validation and controlled source-field synchronization.'
    $sSession = Section 'p02-section-session' '02 - Work Session Lifecycle' '02 Work Session Lifecycle' 'session' -420 'Start, Pause, Resume and Stop with append-only session evidence.'
    $sRollup = Section 'p02-section-rollup' '03 - Effort Rollup Engine' '03 Effort Rollup Engine' 'rollup' -285 'Recompute original, revision, total recorded and remaining effort.'
    $sRevision = Section 'p02-section-revision' '04 - Revision & Rework Control' '04 Revision & Rework Control' 'revision' -140 'Revision creation/resolution and rework evidence.'
    $sEsc = Section 'p02-section-escalation' '05 - Escalation & Overdue Engine' '05 Escalation & Overdue Engine' 'escalation' 10 'Escalation create/clear and dynamic overdue/risk inputs.'
    $sTs = Section 'p02-section-timesheet' '06 - Timesheet Builder & Submission' '06 Timesheet Builder & Submission' 'timesheet' 160 'Build from CLOSED sessions and control submit/return/reject.'
    $sApproval = Section 'p02-section-approval' '07 - Timesheet Approval Boundary' '07 Timesheet Approval & Ledger Posting' 'approval' 310 'Approval is the authoritative cost-posting boundary.'
    $sRate = Section 'p02-section-rate' '08 - Effective-Dated Rate Resolver' '08 Effective-Dated Rate Resolver' 'rate' 460 'Resolve historical labor rates by work date.'
    $sLedger = Section 'p02-section-ledger' '07B - Approved Work Ledger Posting' '07B Approved Work Ledger Posting' 'ledger' 365 'Approval path freezes rate evidence and creates locked ledger cost lines.'
    $sKpi = Section 'p02-section-kpi' '09 - Project KPI & Dashboard Recalculation' '09 Project KPI & Dashboard Recalculation' 'kpi' 610 'Recompute source-derived hours, costs, budget, overdue, progress and health.'
    $sRecon = Section 'p02-section-reconciliation' '10 - Reconciliation & Audit' '10 Reconciliation & Audit' 'reconciliation' 760 'Shared reconciliation entry point for manual/API and scheduled executions.'

    $rateRouterExpression = @'
={{ ['timesheet.approve','ledger.post'].includes($json.action) ? 0 : 1 }}
'@
    $rateRouter = New-SwitchNode 'p02-rate-router' '08B - RATE / COST ROUTER' $rateRouterExpression 2 -610 430 'Approval continues to locked ledger posting; standalone rate lookup returns to the shared engine.'

    $prepareScheduledCode = @'
return [{json:{
  action:'reconciliation.run',
  project:'monday-project-ops',
  clientId:'scheduled-all-clients',
  requestId:`scheduled-${$execution.id}`,
  correlationId:`scheduled-${$execution.id}`,
  payload:{scheduled:true},
  invocationSource:'schedule',
  routeKey:'reconciliation',
  routeTrace:['15 Minute Reconciliation'],
  receivedAt:new Date().toISOString()
}}];
'@
    $prepareScheduled = New-CodeNode 'p02-prepare-scheduled-reconciliation' 'Build Scheduled Reconciliation Request' $prepareScheduledCode -1680 1030 'Convert the schedule trigger into the same reconciliation request contract.'

    $reconRouterExpression = @'
={{ $json.invocationSource === 'schedule' ? 1 : 0 }}
'@
    $reconRouter = New-SwitchNode 'p02-reconciliation-source-router' '10A - RECONCILIATION SOURCE ROUTER' $reconRouterExpression 2 -610 790 'Manual/API reconciliation goes to the shared engine; scheduled reconciliation goes to the all-client scheduled processor.'

    $scheduledSummaryCode = @'
return [{json:{
  status:$json.ok ? 'completed' : 'warning',
  trigger:'15-minute schedule',
  executionId:$execution.id,
  clientsChecked:Number($json.clients||0),
  issuesFound:Number($json.issues||0),
  safeRepairs:Number($json.repairs||0),
  completedAt:$json.at||new Date().toISOString()
}}];
'@
    $scheduledSummary = New-CodeNode 'p02-scheduled-audit-summary' 'Scheduled Audit Summary' $scheduledSummaryCode 220 1030 'Normal non-HTTP terminal for scheduled runs. The output remains in n8n execution history.'

    $Workflow.nodes = @(
        $webhook,$normalize,$actionRouter,
        $sSystem,$sTask,$sSession,$sRollup,$sRevision,$sEsc,$sTs,$sApproval,$sRate,$rateRouter,$sLedger,$sKpi,$sRecon,$reconRouter,
        $engine,$respond,
        $schedule,$prepareScheduled,$scheduledProcessor,$scheduledSummary
    )

    $c = [ordered]@{}
    $c[$webhook.name] = New-SingleLink $normalize.name
    $c[$normalize.name] = New-SingleLink $actionRouter.name
    $c[$actionRouter.name] = New-MultiOutputLink @(
        $sSystem.name,
        $sTask.name,
        $sSession.name,
        $sRevision.name,
        $sEsc.name,
        $sTs.name,
        $sApproval.name,
        $sRate.name,
        $sKpi.name,
        $sRecon.name
    )

    $c[$sSystem.name] = New-SingleLink $engine.name
    $c[$sTask.name] = New-SingleLink $engine.name

    $c[$sSession.name] = New-SingleLink $sRollup.name
    $c[$sRevision.name] = New-SingleLink $sRollup.name
    $c[$sRollup.name] = New-SingleLink $engine.name

    $c[$sEsc.name] = New-SingleLink $engine.name
    $c[$sTs.name] = New-SingleLink $engine.name

    $c[$sApproval.name] = New-SingleLink $sRate.name
    $c[$sRate.name] = New-SingleLink $rateRouter.name
    $c[$rateRouter.name] = New-MultiOutputLink @($sLedger.name,$engine.name)
    $c[$sLedger.name] = New-SingleLink $engine.name

    $c[$sKpi.name] = New-SingleLink $engine.name

    $c[$schedule.name] = New-SingleLink $prepareScheduled.name
    $c[$prepareScheduled.name] = New-SingleLink $sRecon.name
    $c[$sRecon.name] = New-SingleLink $reconRouter.name
    $c[$reconRouter.name] = New-MultiOutputLink @($engine.name,$scheduledProcessor.name)
    $c[$scheduledProcessor.name] = New-SingleLink $scheduledSummary.name

    $c[$engine.name] = New-SingleLink $respond.name

    $Workflow.connections = $c
    Test-WorkflowStructure $Workflow
    return $Workflow
}

function Publish-N8nWorkflow {
    param([Parameter(Mandatory=$true)]$Workflow)

    if (-not $Workflow.id) { return $false }
    if (($Workflow.PSObject.Properties.Name -contains 'active') -and [bool]$Workflow.active) { return $true }
    if (($Workflow.PSObject.Properties.Name -contains 'activeVersionId') -and -not [string]::IsNullOrWhiteSpace([string]$Workflow.activeVersionId)) { return $true }

    $activateUri = "$script:N8nBaseUrl/api/v1/workflows/$($Workflow.id)/activate"
    try {
        $null = Invoke-N8n -Method POST -Uri $activateUri
        return $true
    } catch {}

    if ($Workflow.versionId) {
        try {
            $body = @{ versionId=$Workflow.versionId } | ConvertTo-Json
            $null = Invoke-N8n -Method POST -Uri $activateUri -Body $body
            return $true
        } catch {}
    }

    try {
        $null = Invoke-N8n -Method POST -Uri "$script:N8nBaseUrl/api/v1/workflows/$($Workflow.id)/publish"
        return $true
    } catch {
        return $false
    }
}

function Remove-N8nWorkflow {
    param([Parameter(Mandatory=$true)]$Workflow)

    Write-Host "Removing legacy Project 02 workflow: $($Workflow.name) [$($Workflow.id)]" -ForegroundColor DarkYellow
    try {
        try { $null = Invoke-N8n -Method POST -Uri "$script:N8nBaseUrl/api/v1/workflows/$($Workflow.id)/deactivate" } catch {}
        $null = Invoke-N8n -Method DELETE -Uri "$script:N8nBaseUrl/api/v1/workflows/$($Workflow.id)"
        Write-Host '  removed' -ForegroundColor Green
        return $true
    } catch {
        $body = Get-ErrorBody $_
        if ($body) { Write-Host "  could not remove automatically: $body" -ForegroundColor Yellow }
        else { Write-Host '  could not remove automatically' -ForegroundColor Yellow }
        return $false
    }
}

Write-Host 'Project 02 unified n8n deployment' -ForegroundColor Cyan
Write-Host '----------------------------------'

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
if (-not $apiKey) { throw 'No n8n API key found. Add N8N_API_KEY=... to a local env file.' }

if (-not $N8nBaseUrl) { $N8nBaseUrl = $env:N8N_BASE_URL }
if (-not $N8nBaseUrl) { $N8nBaseUrl = $env:N8N_URL }
if (-not $N8nBaseUrl) { $N8nBaseUrl = 'https://herta-unbedabbled-unsynchronously.ngrok-free.dev' }

$script:N8nBaseUrl = $N8nBaseUrl.TrimEnd('/')
$script:Headers = @{
    'X-N8N-API-KEY' = $apiKey
    'ngrok-skip-browser-warning' = 'true'
}

Write-Host "n8n endpoint: $script:N8nBaseUrl"
Write-Host 'API key: loaded (value hidden)'

try {
    $list = Invoke-N8n -Method GET -Uri "$script:N8nBaseUrl/api/v1/workflows?limit=100"
    Write-Host 'Connection/authentication check: OK' -ForegroundColor Green
} catch {
    $body = Get-ErrorBody $_
    if ($body) { Write-Host "n8n response: $body" -ForegroundColor Red }
    throw 'Could not authenticate to n8n through the configured tunnel.'
}

$all = @()
if ($list -and $list.data) { $all = @($list.data) }
elseif ($list) { $all = @($list) }

$splitNames = @(
    'Project 02 - 01 Task Integrity & Project Sync',
    'Project 02 - 02 Work Session Lifecycle',
    'Project 02 - 03 Effort Rollup Engine',
    'Project 02 - 04 Revision & Rework Control',
    'Project 02 - 05 Escalation & Overdue Engine',
    'Project 02 - 06 Timesheet Builder & Submission',
    'Project 02 - 07 Timesheet Approval & Ledger Posting',
    'Project 02 - 08 Effective-Dated Rate Resolver',
    'Project 02 - 09 Project KPI & Dashboard Recalculation',
    'Project 02 - 10 Reconciliation & Audit'
)
$legacySplit = @($all | Where-Object { $splitNames -contains $_.name })

Write-Host 'Downloading unified Project 02 source...'
$rawUrl = 'https://raw.githubusercontent.com/dbauto/danicaboton.github.io/main/n8n-workflows/01-enterprise-operations-workspace.json'
$workflow = ((Invoke-WebRequest -UseBasicParsing -Uri $rawUrl).Content | ConvertFrom-Json)
$workflow = Build-UnifiedWorkflow -Workflow $workflow

$payloadObject = [ordered]@{
    name = $workflow.name
    nodes = $workflow.nodes
    connections = $workflow.connections
    settings = $workflow.settings
}
$payload = $payloadObject | ConvertTo-Json -Depth 100
Write-Host "Unified workflow built and structurally validated: $($workflow.nodes.Count) nodes" -ForegroundColor Green

$knownNames = @(
    'Portfolio - Project 02 Unified Operations Control Center',
    'Portfolio - Project 02 Operations State Engine',
    'Portfolio - Monday.com Project Operations Control Center'
)
$matches = @($all | Where-Object { $knownNames -contains $_.name })
$existing = $matches | Sort-Object @{Expression={if($_.name -eq 'Portfolio - Project 02 Unified Operations Control Center'){0}else{1}}} | Select-Object -First 1

try {
    if ($existing) {
        Write-Host "Updating unified workflow: $($existing.id)"
        $deployed = Invoke-N8n -Method PUT -Uri "$script:N8nBaseUrl/api/v1/workflows/$($existing.id)" -Body $payload
        $verb = 'updated'
    } else {
        Write-Host 'Creating unified workflow...'
        $deployed = Invoke-N8n -Method POST -Uri "$script:N8nBaseUrl/api/v1/workflows" -Body $payload
        $verb = 'created'
    }

    $published = Publish-N8nWorkflow -Workflow $deployed
    $status = if ($published) { 'published' } else { 'draft' }

    Write-Host ''
    Write-Host "SUCCESS: unified Project 02 workflow $verb / $status" -ForegroundColor Green
    Write-Host "Workflow name: $($deployed.name)"
    Write-Host "Workflow ID:   $($deployed.id)"
    Write-Host 'Webhook path:  portfolio-enterprise-operations'
    Write-Host 'Routing:       true Switch outputs; one request -> one operational branch'
    Write-Host 'Scheduled path: Schedule -> Build Request -> Reconciliation -> Source Switch -> Scheduled Processor -> Summary'

    foreach ($old in $legacySplit) {
        [void](Remove-N8nWorkflow -Workflow $old)
    }
    foreach ($extra in @($matches | Where-Object { $_.id -ne $deployed.id })) {
        [void](Remove-N8nWorkflow -Workflow $extra)
    }

    try {
        $healthBody = @{
            action='health.check'
            project='monday-project-ops'
            clientId='deployment-health-check'
            requestId="deploy-$([Guid]::NewGuid())"
            payload=@{}
        } | ConvertTo-Json -Depth 10
        $health = Invoke-RestMethod -Method POST -Uri "$script:N8nBaseUrl/webhook/portfolio-enterprise-operations" -ContentType 'application/json' -Body $healthBody
        if ($health.ok) {
            Write-Host 'Production webhook health check: OK' -ForegroundColor Green
        }
    } catch {
        Write-Host 'Production webhook health check did not complete. If status above is draft, publish the unified workflow once in n8n.' -ForegroundColor Yellow
    }
} catch {
    $body = Get-ErrorBody $_
    Write-Host ''
    Write-Host 'Unified Project 02 deployment failed.' -ForegroundColor Red
    if ($body) { Write-Host "n8n response: $body" -ForegroundColor Yellow }
    throw
}

Write-Host ''
Write-Host 'Project 02 is intentionally ONE routed n8n workflow.' -ForegroundColor Cyan
Write-Host 'Main routing now uses actual multi-output Switch nodes rather than broadcast/filter gates.'
Write-Host 'No Monday.com connection is required.'
