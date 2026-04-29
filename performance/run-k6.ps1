$ErrorActionPreference = 'Stop'

# Prueba de carga k6 para el backend ArtHome
# Requisito: backend corriendo en http://localhost:4000 (o define $env:K6_BASE_URL)

$k6 = 'C:\Tools\k6\k6.exe'
if (-not (Test-Path $k6)) {
  throw "No se encontró k6 en $k6. Ejecuta primero: c:\Users\angie\sonarqube-docker\install-k6.ps1"
}

$script = Join-Path $PSScriptRoot 'k6-api-loadtest.js'
$outDir = Join-Path $PSScriptRoot 'results'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$jsonOut = Join-Path $outDir "k6-summary-$timestamp.json"

Write-Host "Ejecutando k6..."
Write-Host "BASE_URL=$($env:K6_BASE_URL)"

# Exporta un resumen en JSON (sirve como evidencia para la rúbrica)
& $k6 run $script --summary-export $jsonOut

Write-Host "Reporte generado: $jsonOut"

