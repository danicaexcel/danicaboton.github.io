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
    param([string]$Method,[string]$Uri,[object]$Body=$null)
    $params = @{ Method=$Method; Uri=$Uri; Headers=$script:Headers }
    if ($null -ne $Body) { $params.ContentType='application/json'; $params.Body=$Body }
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
    param([string]$Id,[string]$Name,[string]$Code,[int]$X,[int]$Y,[string]$Notes='')
    [PSCustomObject]@{
        parameters=[PSCustomObject]@{jsCode=$Code}; id=$Id; name=$Name;
        type='n8n-nodes-base.code'; typeVersion=2; position=@($X,$Y);
        notesInFlow=$true; notes=$Notes
    }
}

function New-SingleLink {
    param([string]$Target)
    $edge = [PSCustomObject]@{node=$Target;type='main';index=0}
    return @{ main = @(, @($edge)) }
}

function Build-UnifiedWorkflow {
    param([Parameter(Mandatory=$true)]$Workflow)

    $Workflow.name='Portfolio - Project 02 Unified Operations Control Center'
    $webhook=$Workflow.nodes|Where-Object{$_.name -eq 'Project 02 Webhook'}|Select-Object -First 1
    $normalize=$Workflow.nodes|Where-Object{$_.name -eq 'Normalize Request'}|Select-Object -First 1
    $engine=$Workflow.nodes|Where-Object{$_.name -eq 'Project 02 State Engine'}|Select-Object -First 1
    $respond=$Workflow.nodes|Where-Object{$_.name -eq 'Respond to Portfolio'}|Select-Object -First 1
    $schedule=$Workflow.nodes|Where-Object{$_.name -eq '15 Minute Reconciliation'}|Select-Object -First 1
    $scheduled=$Workflow.nodes|Where-Object{$_.name -eq 'Scheduled Reconciliation'}|Select-Object -First 1
    if(-not $webhook -or -not $normalize -or -not $engine -or -not $respond){throw 'Base Project 02 workflow is missing a required core node.'}

    $webhook.position=@(-1900,0)
    $normalize.position=@(-1660,0)
    $engine.position=@(560,0)
    $engine.name='Unified State + Business Rules Engine'
    Set-ObjectProperty $engine 'notesInFlow' $true
    Set-ObjectProperty $engine 'notes' 'Authoritative shared state and business-rule engine. Visible domain branches converge here after routing.'
    $respond.position=@(840,0)
    if($schedule){$schedule.position=@(-1660,980)}
    if($scheduled){
        $scheduled.position=@(-1260,980)
        Set-ObjectProperty $scheduled 'notesInFlow' $true
        Set-ObjectProperty $scheduled 'notes' 'Scheduled reconciliation and integrity repair.'
    }

    $classifierCode=@'
const a=$json.action;
let routeKey='system';
if(a?.startsWith('task.')||a==='project.sync') routeKey='task';
else if(a?.startsWith('session.')) routeKey='session';
else if(a?.startsWith('revision.')) routeKey='revision';
else if(a?.startsWith('escalation.')) routeKey='escalation';
else if(['timesheet.build','timesheet.submit','timesheet.return','timesheet.reject'].includes(a)) routeKey='timesheet';
else if(['timesheet.approve','ledger.post'].includes(a)) routeKey='approval';
else if(a==='rate.resolve') routeKey='rate';
else if(a==='dashboard.refresh') routeKey='kpi';
else if(a==='reconciliation.run') routeKey='reconciliation';
return [{json:{...$json,routeKey,routeTrace:['01 API Ingress','02 Action Router']}}];
'@
    $classifier=New-CodeNode 'p02-action-router' '02 · ACTION ROUTER · Classify Request' $classifierCode -1420 0 'Route every request to exactly one visible operational domain.'

    function Gate([string]$key,[string]$id,[string]$name,[int]$y){
        $code="if(`$json.routeKey!='$key') return []; return [{json:`$json}];"
        New-CodeNode $id $name $code -1160 $y "Router gate for $key actions."
    }
    function Section([string]$id,[string]$name,[string]$label,[int]$y,[string]$notes){
        $code="return [{json:{...`$json,routeTrace:[...(`$json.routeTrace||[]),'$label'],workflowSection:'$label'}}];"
        New-CodeNode $id $name $code -880 $y $notes
    }

    $gSystem=Gate 'system' 'p02-route-system' 'ROUTE · System / State' -720
    $sSystem=Section 'p02-section-system' '00 · System / State Control' '00 System / State' -720 'Health, state read/reset, retry metadata and invalid-request handling.'
    $gTask=Gate 'task' 'p02-route-task' 'ROUTE · Task Control' -570
    $sTask=Section 'p02-section-task' '01 · Task Integrity & Project Sync' '01 Task Integrity & Project Sync' -570 'Task/project validation and controlled source-field synchronization.'
    $gSession=Gate 'session' 'p02-route-session' 'ROUTE · Work Sessions' -420
    $sSession=Section 'p02-section-session' '02 · Work Session Lifecycle' '02 Work Session Lifecycle' -420 'Start, Pause, Resume and Stop with append-only session evidence.'
    $sRollup=Section 'p02-section-rollup' '03 · Effort Rollup Engine' '03 Effort Rollup Engine' -285 'Recompute original, revision, total recorded and remaining effort.'
    $gRevision=Gate 'revision' 'p02-route-revision' 'ROUTE · Revisions / Rework' -140
    $sRevision=Section 'p02-section-revision' '04 · Revision & Rework Control' '04 Revision & Rework Control' -140 'Revision creation/resolution and rework evidence.'
    $gEsc=Gate 'escalation' 'p02-route-escalation' 'ROUTE · Escalation / Overdue' 10
    $sEsc=Section 'p02-section-escalation' '05 · Escalation & Overdue Engine' '05 Escalation & Overdue Engine' 10 'Escalation create/clear and dynamic overdue/risk inputs.'
    $gTs=Gate 'timesheet' 'p02-route-timesheet' 'ROUTE · Timesheets' 160
    $sTs=Section 'p02-section-timesheet' '06 · Timesheet Builder & Submission' '06 Timesheet Builder & Submission' 160 'Build from CLOSED sessions and control submit/return/reject.'
    $gApproval=Gate 'approval' 'p02-route-approval' 'ROUTE · Approval / Ledger' 310
    $sApproval=Section 'p02-section-approval' '07 · Timesheet Approval Boundary' '07 Timesheet Approval & Ledger Posting' 310 'Approval is the authoritative cost-posting boundary.'
    $gRate=Gate 'rate' 'p02-route-rate' 'ROUTE · Labor Rate' 460
    $sRate=Section 'p02-section-rate' '08 · Effective-Dated Rate Resolver' '08 Effective-Dated Rate Resolver' 460 'Resolve the historical rate by work date and freeze it into approval evidence.'
    $sLedger=Section 'p02-section-ledger' '07B · Approved Work Ledger Posting' '07B Approved Work Ledger Posting' 360 'Create locked approval/cost lines; direct arbitrary posting stays blocked.'
    $gKpi=Gate 'kpi' 'p02-route-kpi' 'ROUTE · KPI / Dashboard' 610
    $sKpi=Section 'p02-section-kpi' '09 · Project KPI & Dashboard Recalculation' '09 Project KPI & Dashboard Recalculation' 610 'Recompute source-derived hours, costs, budget, overdue, progress and health.'
    $gRecon=Gate 'reconciliation' 'p02-route-reconciliation' 'ROUTE · Reconciliation' 760
    $sRecon=Section 'p02-section-reconciliation' '10 · Reconciliation & Audit' '10 Reconciliation & Audit' 760 'Detect/repair integrity issues and preserve audit evidence.'

    $Workflow.nodes=@($webhook,$normalize,$classifier,$gSystem,$sSystem,$gTask,$sTask,$gSession,$sSession,$sRollup,$gRevision,$sRevision,$gEsc,$sEsc,$gTs,$sTs,$gApproval,$sApproval,$gRate,$sRate,$sLedger,$gKpi,$sKpi,$gRecon,$sRecon,$engine,$respond)
    if($schedule){$Workflow.nodes+=@($schedule)}
    if($scheduled){$Workflow.nodes+=@($scheduled)}

    $fanout=@(
        [PSCustomObject]@{node=$gSystem.name;type='main';index=0},[PSCustomObject]@{node=$gTask.name;type='main';index=0},
        [PSCustomObject]@{node=$gSession.name;type='main';index=0},[PSCustomObject]@{node=$gRevision.name;type='main';index=0},
        [PSCustomObject]@{node=$gEsc.name;type='main';index=0},[PSCustomObject]@{node=$gTs.name;type='main';index=0},
        [PSCustomObject]@{node=$gApproval.name;type='main';index=0},[PSCustomObject]@{node=$gRate.name;type='main';index=0},
        [PSCustomObject]@{node=$gKpi.name;type='main';index=0},[PSCustomObject]@{node=$gRecon.name;type='main';index=0}
    )

    $c=[ordered]@{}
    $c[$webhook.name]=New-SingleLink $normalize.name
    $c[$normalize.name]=New-SingleLink $classifier.name
    $c[$classifier.name]=@{main=@(,$fanout)}
    $c[$gSystem.name]=New-SingleLink $sSystem.name;$c[$sSystem.name]=New-SingleLink $engine.name
    $c[$gTask.name]=New-SingleLink $sTask.name;$c[$sTask.name]=New-SingleLink $engine.name
    $c[$gSession.name]=New-SingleLink $sSession.name;$c[$sSession.name]=New-SingleLink $sRollup.name
    $c[$gRevision.name]=New-SingleLink $sRevision.name;$c[$sRevision.name]=New-SingleLink $sRollup.name;$c[$sRollup.name]=New-SingleLink $engine.name
    $c[$gEsc.name]=New-SingleLink $sEsc.name;$c[$sEsc.name]=New-SingleLink $engine.name
    $c[$gTs.name]=New-SingleLink $sTs.name;$c[$sTs.name]=New-SingleLink $engine.name
    $c[$gApproval.name]=New-SingleLink $sApproval.name;$c[$sApproval.name]=New-SingleLink $sRate.name
    $c[$gRate.name]=New-SingleLink $sRate.name;$c[$sRate.name]=New-SingleLink $sLedger.name;$c[$sLedger.name]=New-SingleLink $engine.name
    $c[$gKpi.name]=New-SingleLink $sKpi.name;$c[$sKpi.name]=New-SingleLink $engine.name
    $c[$gRecon.name]=New-SingleLink $sRecon.name;$c[$sRecon.name]=New-SingleLink $engine.name
    $c[$engine.name]=New-SingleLink $respond.name
    if($schedule -and $scheduled){$c[$schedule.name]=New-SingleLink $scheduled.name}
    $Workflow.connections=$c
    return $Workflow
}

function Publish-N8nWorkflow {
    param($Workflow)
    if(-not $Workflow.id){return $false}
    if(($Workflow.PSObject.Properties.Name -contains 'active') -and [bool]$Workflow.active){return $true}
    if(($Workflow.PSObject.Properties.Name -contains 'activeVersionId') -and -not [string]::IsNullOrWhiteSpace([string]$Workflow.activeVersionId)){return $true}
    $activateUri="$script:N8nBaseUrl/api/v1/workflows/$($Workflow.id)/activate"
    try{$null=Invoke-N8n POST $activateUri;return $true}catch{}
    if($Workflow.versionId){try{$null=Invoke-N8n POST $activateUri (@{versionId=$Workflow.versionId}|ConvertTo-Json);return $true}catch{}}
    try{$null=Invoke-N8n POST "$script:N8nBaseUrl/api/v1/workflows/$($Workflow.id)/publish";return $true}catch{return $false}
}

function Remove-N8nWorkflow {
    param($Workflow)
    Write-Host "Removing old Project 02 workflow: $($Workflow.name) [$($Workflow.id)]" -ForegroundColor DarkYellow
    try{
        try{$null=Invoke-N8n POST "$script:N8nBaseUrl/api/v1/workflows/$($Workflow.id)/deactivate"}catch{}
        $null=Invoke-N8n DELETE "$script:N8nBaseUrl/api/v1/workflows/$($Workflow.id)"
        Write-Host '  removed' -ForegroundColor Green
        return $true
    }catch{
        $body=Get-ErrorBody $_
        if($body){Write-Host "  could not remove automatically: $body" -ForegroundColor Yellow}else{Write-Host '  could not remove automatically' -ForegroundColor Yellow}
        return $false
    }
}

Write-Host 'Project 02 unified n8n deployment' -ForegroundColor Cyan
Write-Host '----------------------------------'
if(-not $env:N8N_API_KEY){if(-not $EnvFile){$EnvFile=Find-EnvFile};if($EnvFile){Import-DotEnv $EnvFile;Write-Host "Loaded local environment file: $EnvFile"}}
$apiKey=$env:N8N_API_KEY;if(-not $apiKey){$apiKey=$env:N8N_APIKEY};if(-not $apiKey){$apiKey=$env:N8N_KEY}
if(-not $apiKey){throw 'No n8n API key found. Add N8N_API_KEY=... to a local env file.'}
if(-not $N8nBaseUrl){$N8nBaseUrl=$env:N8N_BASE_URL};if(-not $N8nBaseUrl){$N8nBaseUrl=$env:N8N_URL};if(-not $N8nBaseUrl){$N8nBaseUrl='https://herta-unbedabbled-unsynchronously.ngrok-free.dev'}
$script:N8nBaseUrl=$N8nBaseUrl.TrimEnd('/');$script:Headers=@{'X-N8N-API-KEY'=$apiKey;'ngrok-skip-browser-warning'='true'}
Write-Host "n8n endpoint: $script:N8nBaseUrl";Write-Host 'API key: loaded (value hidden)'
try{$list=Invoke-N8n GET "$script:N8nBaseUrl/api/v1/workflows?limit=100";Write-Host 'Connection/authentication check: OK' -ForegroundColor Green}catch{$body=Get-ErrorBody $_;if($body){Write-Host "n8n response: $body" -ForegroundColor Red};throw 'Could not authenticate to n8n through the configured tunnel.'}
$all=if($list.data){@($list.data)}else{@($list)}
$splitNames=@('Project 02 - 01 Task Integrity & Project Sync','Project 02 - 02 Work Session Lifecycle','Project 02 - 03 Effort Rollup Engine','Project 02 - 04 Revision & Rework Control','Project 02 - 05 Escalation & Overdue Engine','Project 02 - 06 Timesheet Builder & Submission','Project 02 - 07 Timesheet Approval & Ledger Posting','Project 02 - 08 Effective-Dated Rate Resolver','Project 02 - 09 Project KPI & Dashboard Recalculation','Project 02 - 10 Reconciliation & Audit')
$legacySplit=@($all|Where-Object{$splitNames -contains $_.name})

Write-Host 'Downloading unified Project 02 source...'
$workflow=((Invoke-WebRequest -UseBasicParsing 'https://raw.githubusercontent.com/dbauto/danicaboton.github.io/main/n8n-workflows/01-enterprise-operations-workspace.json').Content|ConvertFrom-Json)
$workflow=Build-UnifiedWorkflow $workflow
$payload=([ordered]@{name=$workflow.name;nodes=$workflow.nodes;connections=$workflow.connections;settings=$workflow.settings}|ConvertTo-Json -Depth 100)
Write-Host "Unified workflow built locally: $($workflow.nodes.Count) nodes" -ForegroundColor Green
$known=@('Portfolio - Project 02 Unified Operations Control Center','Portfolio - Project 02 Operations State Engine','Portfolio - Monday.com Project Operations Control Center')
$matches=@($all|Where-Object{$known -contains $_.name})
$existing=$matches|Sort-Object @{Expression={if($_.name -eq 'Portfolio - Project 02 Unified Operations Control Center'){0}else{1}}}|Select-Object -First 1
try{
    if($existing){Write-Host "Updating unified workflow: $($existing.id)";$deployed=Invoke-N8n PUT "$script:N8nBaseUrl/api/v1/workflows/$($existing.id)" $payload;$verb='updated'}else{Write-Host 'Creating unified workflow...';$deployed=Invoke-N8n POST "$script:N8nBaseUrl/api/v1/workflows" $payload;$verb='created'}
    $published=Publish-N8nWorkflow $deployed;$status=if($published){'published'}else{'draft'}
    Write-Host '';Write-Host "SUCCESS: unified Project 02 workflow $verb / $status" -ForegroundColor Green
    Write-Host "Workflow name: $($deployed.name)";Write-Host "Workflow ID:   $($deployed.id)";Write-Host 'Webhook path:  portfolio-enterprise-operations'
    Write-Host 'Canvas:        one webhook + action router + 10 operational sections + shared state engine + scheduled reconciliation'

    foreach($old in $legacySplit){[void](Remove-N8nWorkflow $old)}
    foreach($extra in @($matches|Where-Object{$_.id -ne $deployed.id})){[void](Remove-N8nWorkflow $extra)}

    try{$healthBody=@{action='health.check';project='monday-project-ops';clientId='deployment-health-check';requestId="deploy-$([Guid]::NewGuid())";payload=@{}}|ConvertTo-Json -Depth 10;$health=Invoke-RestMethod -Method POST -Uri "$script:N8nBaseUrl/webhook/portfolio-enterprise-operations" -ContentType 'application/json' -Body $healthBody;if($health.ok){Write-Host 'Production webhook health check: OK' -ForegroundColor Green}}catch{Write-Host 'Production webhook health check did not complete. If status above is draft, publish the unified workflow once in n8n.' -ForegroundColor Yellow}
}catch{$body=Get-ErrorBody $_;Write-Host '';Write-Host 'Unified Project 02 deployment failed.' -ForegroundColor Red;if($body){Write-Host "n8n response: $body" -ForegroundColor Yellow};throw}
Write-Host '';Write-Host 'Project 02 is now intentionally ONE routed n8n workflow.' -ForegroundColor Cyan;Write-Host 'No Monday.com connection is required.'
