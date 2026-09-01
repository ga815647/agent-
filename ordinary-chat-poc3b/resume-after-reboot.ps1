[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$launcher = Join-Path $PSScriptRoot 'persistent-host.ps1'

& $launcher start
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

& $launcher status
exit $LASTEXITCODE

