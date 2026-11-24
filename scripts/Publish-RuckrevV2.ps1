# Publishes this package ONLY to ruishinor/ruckrev-revisited.
# The original ruishinor/rucking-revolution is never cloned or changed.
[CmdletBinding()]
param(
  [string]$Repo = 'ruishinor/ruckrev-revisited',
  [string]$Destination = (Join-Path $env:USERPROFILE 'Documents\ruckrev-revisited')
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
if ($Repo -ne 'ruishinor/ruckrev-revisited') { throw 'Safety stop: only ruishinor/ruckrev-revisited is an allowed destination.' }
foreach ($Tool in @('gh','git','node','npm')) {
  if (-not (Get-Command $Tool -ErrorAction SilentlyContinue)) { throw "Missing tool: $Tool" }
}
if (Test-Path -LiteralPath $Destination) { throw "Destination already exists: $Destination. Select a new directory to avoid overwriting local work." }
$Source = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
& gh auth status
if ($LASTEXITCODE -ne 0) { throw 'Sign in with: gh auth login' }
& gh repo clone $Repo $Destination
if ($LASTEXITCODE -ne 0) { throw 'Clone failed. Check GitHub permissions and repository access.' }
Get-ChildItem -LiteralPath $Source -Force | Where-Object { $_.Name -notin @('.git','contact.png') } | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination $Destination -Recurse -Force
}
Push-Location -LiteralPath $Destination
try {
  & npm test
  if ($LASTEXITCODE -ne 0) { throw 'Unit tests failed. Nothing was pushed.' }
  & npm run build
  if ($LASTEXITCODE -ne 0) { throw 'Build failed. Nothing was pushed.' }
  & node scripts/check-site.mjs
  if ($LASTEXITCODE -ne 0) { throw 'Static checks failed. Nothing was pushed.' }
  & git add --all
  if ($LASTEXITCODE -ne 0) { throw 'Git staging failed.' }
  & git commit -m 'feat: build civilian-first Rucking Revolution v2 testing library'
  if ($LASTEXITCODE -ne 0) { throw 'Git commit failed. Configure your git name/email and retry from the checkout.' }
  & git push -u origin main
  if ($LASTEXITCODE -ne 0) { throw 'Git push failed. Verify your GitHub token has Contents write access.' }
  Write-Host "Pushed v2 to https://github.com/$Repo" -ForegroundColor Green
} finally { Pop-Location }
