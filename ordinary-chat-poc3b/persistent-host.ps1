[CmdletBinding()]
param(
  [Parameter(Position = 0)]
  [ValidateSet('start', 'open', 'status', 'stop', 'send-test', 'dispatch', 'checkpoint', 'set-worker-project')]
  [string]$Action = 'status'
)

$ErrorActionPreference = 'Stop'
$nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue

if (-not $nodeCommand) {
  $runtimeRoot = Join-Path $env:USERPROFILE '.cache\codex-runtimes'
  $nodeCommand = Get-ChildItem -LiteralPath $runtimeRoot -Filter node.exe -File -Recurse -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -like '*\dependencies\node\bin\node.exe' } |
    Select-Object -First 1
}

if (-not $nodeCommand) {
  throw 'Node.js was not found. Install Node.js 22+ or run from a Codex desktop environment.'
}

$nodePath = if ($nodeCommand.Source) { $nodeCommand.Source } else { $nodeCommand.FullName }

if ($Action -eq 'dispatch') {
  $cleanup = Join-Path $PSScriptRoot 'stale-tab-cleanup.mjs'
  if (Test-Path -LiteralPath $cleanup) {
    try {
      & $nodePath $cleanup *> $null
    }
    catch {
      # Operational hygiene is fail-open and must not block Worker dispatch.
    }
  }
}

$controllerName = if ($Action -eq 'dispatch') { 'persistent-host-dispatch.mjs' } else { 'persistent-host.mjs' }
$controller = Join-Path $PSScriptRoot $controllerName

if (-not (Test-Path -LiteralPath $controller)) {
  throw "Persistent-host controller was not found: $controller"
}

Push-Location $PSScriptRoot
try {
  & $nodePath $controller $Action
  exit $LASTEXITCODE
}
finally {
  Pop-Location
}
