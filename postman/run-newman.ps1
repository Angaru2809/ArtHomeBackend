$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$collection = Join-Path $PSScriptRoot 'ArtHome.postman_collection.json'
$envFile = Join-Path $PSScriptRoot 'ArtHome.postman_environment.json'

if (-not (Test-Path $collection)) { throw "No existe: $collection" }
if (-not (Test-Path $envFile)) { throw "No existe: $envFile" }

$outDir = Join-Path $PSScriptRoot 'results'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$jsonOut = Join-Path $outDir "newman-$timestamp.json"

Write-Host "Ejecutando Newman..."
Write-Host "Collection: $collection"
Write-Host "Environment: $envFile"
Write-Host "Reporte JSON: $jsonOut"

Push-Location $root
try {
  # En PowerShell, "cli,json" sin comillas puede interpretarse como lista/array.
  npx -y newman run $collection -e $envFile -r 'cli,json' --reporter-json-export $jsonOut
} finally {
  Pop-Location
}

Write-Host "OK. Reporte generado: $jsonOut"

