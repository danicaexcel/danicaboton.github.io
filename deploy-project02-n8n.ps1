param(
    [string]$EnvFile = "",
    [string]$N8nBaseUrl = ""
)

$ErrorActionPreference = 'Stop'
$repo = 'https://raw.githubusercontent.com/dbauto/danicaboton.github.io/main'
$temp = Join-Path $env:TEMP 'project02-n8n-deploy'
New-Item -ItemType Directory -Force -Path $temp | Out-Null

$setup = Join-Path $temp 'setup-project02-n8n.ps1'
$role = Join-Path $temp 'update-project02-role-backend.ps1'

Write-Host 'Project 02 complete deployment' -ForegroundColor Cyan
Write-Host '------------------------------'
Write-Host 'Step 1/2: unified workflow structure'
Invoke-WebRequest "$repo/setup-project02-n8n.ps1" -OutFile $setup -UseBasicParsing
$setupArgs = @('-ExecutionPolicy','Bypass','-File',$setup)
if ($EnvFile) { $setupArgs += @('-EnvFile',$EnvFile) }
if ($N8nBaseUrl) { $setupArgs += @('-N8nBaseUrl',$N8nBaseUrl) }
& powershell @setupArgs
if ($LASTEXITCODE -ne 0) { throw 'Unified workflow deployment failed.' }

Write-Host ''
Write-Host 'Step 2/2: role-aware operating backend'
Invoke-WebRequest "$repo/update-project02-role-backend.ps1" -OutFile $role -UseBasicParsing
$roleArgs = @('-ExecutionPolicy','Bypass','-File',$role)
if ($EnvFile) { $roleArgs += @('-EnvFile',$EnvFile) }
if ($N8nBaseUrl) { $roleArgs += @('-N8nBaseUrl',$N8nBaseUrl) }
& powershell @roleArgs
if ($LASTEXITCODE -ne 0) { throw 'Role backend update failed.' }

Write-Host ''
Write-Host 'SUCCESS: Project 02 unified workflow + role backend deployed.' -ForegroundColor Green
