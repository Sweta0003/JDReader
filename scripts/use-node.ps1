# Adds portable Node.js to PATH for this PowerShell session.
# Install location: %USERPROFILE%\.local\nodejs\node-v22.19.0-win-x64
$nodeHome = Join-Path $env:USERPROFILE ".local\nodejs\node-v22.19.0-win-x64"
if (-not (Test-Path (Join-Path $nodeHome "node.exe"))) {
  Write-Error "Node not found at $nodeHome. See README Prerequisites."
  exit 1
}
$env:Path = "$nodeHome;$env:Path"
Write-Host "Using Node $(node -v) and npm $(npm -v)"
