# Script Simple para Testing de Task 10
Write-Host "=== QUICK TEST - TASK 10 ===" -ForegroundColor Cyan
Write-Host ""

$env:PATH = "C:\Program Files\dotnet;" + $env:PATH
$baseUrl = "http://localhost:5000"

# Verificar API
Write-Host "Verificando API..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get -TimeoutSec 2
    Write-Host "✓ API corriendo" -ForegroundColor Green
}
catch {
    Write-Host "✗ API no está corriendo" -ForegroundColor Red
    Write-Host "Inicia la API primero: .\start-dev-local.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
$passed = 0
$failed = 0

# TEST 1: WHO API Token
Write-Host "1. WHO API Token..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/whoapi/token" -Method POST -ContentType "application/json"
    Write-Host "✓ PASSED" -ForegroundColor Green
    $passed++
}
catch {
    Write-Host "✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# TEST 2: Búsqueda CIE-10
Write-Host "2. Búsqueda CIE-10..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/cie10/search?query=diabetes" -Method GET
    Write-Host "✓ PASSED - Encontrados: $($response.Count) resultados" -ForegroundColor Green
    $passed++
}
catch {
    Write-Host "✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# TEST 3: Traducción
Write-Host "3. Traducción..." -ForegroundColor Yellow
try {
    $body = @{
        text = "Paciente con fiebre"
        sourceLanguage = "ES"
        targetLanguage = "EN"
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/api/aiassistant/translate" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✓ PASSED - Traducido: $($response.translatedText)" -ForegroundColor Green
    $passed++
}
catch {
    Write-Host "✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# TEST 4: Análisis IA
Write-Host "4. Análisis IA (puede tardar 15 seg)..." -ForegroundColor Yellow
try {
    $body = @{
        clinicalDescription = "Paciente con fiebre alta y diarrea"
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/api/aiassistant/analyze" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 60
    Write-Host "✓ PASSED - Diagnósticos sugeridos: $($response.suggestedDiagnoses.Count)" -ForegroundColor Green
    $passed++
}
catch {
    Write-Host "✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

# Resumen
Write-Host ""
Write-Host "=== RESUMEN ===" -ForegroundColor Cyan
Write-Host "Pasados: $passed" -ForegroundColor Green
Write-Host "Fallidos: $failed" -ForegroundColor Red

if ($failed -eq 0) {
    Write-Host ""
    Write-Host "✓ TODOS LOS TESTS PASARON!" -ForegroundColor Green
}

Write-Host ""
Read-Host "Presiona Enter para salir"
