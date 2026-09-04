param(
    [string]$EnvFile = "",
    [string]$N8nBaseUrl = ""
)
$ErrorActionPreference='Stop'
function Import-DotEnv([string]$Path){
    Get-Content -LiteralPath $Path | ForEach-Object {
        $line=$_.Trim(); if(-not $line -or $line.StartsWith('#')){return};
        $eq=$line.IndexOf('='); if($eq -lt 1){return};
        $name=$line.Substring(0,$eq).Trim(); $value=$line.Substring($eq+1).Trim();
        if(($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))){$value=$value.Substring(1,$value.Length-2)};
        [Environment]::SetEnvironmentVariable($name,$value,'Process')
    }
}
if(-not $env:N8N_API_KEY){
    if(-not $EnvFile){$candidate=Join-Path $HOME 'Downloads\project02.env';if(Test-Path $candidate){$EnvFile=$candidate}}
    if($EnvFile){Import-DotEnv $EnvFile}
}
$key=$env:N8N_API_KEY;if(-not $key){$key=$env:N8N_APIKEY};if(-not $key){$key=$env:N8N_KEY};if(-not $key){throw 'No n8n API key found.'}
if(-not $N8nBaseUrl){$N8nBaseUrl=$env:N8N_BASE_URL};if(-not $N8nBaseUrl){$N8nBaseUrl=$env:N8N_URL};if(-not $N8nBaseUrl){$N8nBaseUrl='https://herta-unbedabbled-unsynchronously.ngrok-free.dev'}
$base=$N8nBaseUrl.TrimEnd('/');$headers=@{'X-N8N-API-KEY'=$key;'ngrok-skip-browser-warning'='true'}
$list=Invoke-RestMethod -Method GET -Uri "$base/api/v1/workflows?limit=100" -Headers $headers
$all=if($list.data){@($list.data)}else{@($list)}
$wf=$all|Where-Object{$_.name -eq 'Portfolio - Project 02 Unified Operations Control Center'}|Select-Object -First 1
if(-not $wf){throw 'Unified Project 02 workflow not found.'}
$published=$false
try{Invoke-RestMethod -Method POST -Uri "$base/api/v1/workflows/$($wf.id)/activate" -Headers $headers|Out-Null;$published=$true}catch{}
if(-not $published){try{Invoke-RestMethod -Method POST -Uri "$base/api/v1/workflows/$($wf.id)/publish" -Headers $headers|Out-Null;$published=$true}catch{}}
if($published){Write-Host 'Project 02 workflow published/activated.' -ForegroundColor Green}else{Write-Host 'Could not publish automatically. Open the workflow and click Publish once.' -ForegroundColor Yellow}
