# Script de Testing Completo para Task 10
# Prueba WHO API, CIE-10, Traducción y Asistente de IA

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TESTING TASK 10 - SISTEMA COMPLETO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"
$testsPassed = 0
$testsFailed = 0

# Función para hacer requests
function Invoke-ApiTest {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    
    try {
        $params = @{
            Uri = "$baseUrl$Endpoint"
            Method = $Method
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "✓ PASSED: $Name" -ForegroundColor Green
        Write-Host "Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Gray
        Write-Host ""
        $script:testsPassed++
        return $response
    }
    catch {
        Write-Host "✗ FAILED: $Name" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
        Write-Host ""
        $script:testsFailed++
        return $null
    }
}

Write-Host "Verificando que la API esté corriendo..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✓ API está corriendo" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "✗ ERROR: La API no está corriendo en $baseUrl" -ForegroundColor Red
    Write-Host "Por favor, inicia la API primero con: dotnet run --project eprescription-API/src/ePrescription.API" -ForegroundColor Yellow
    exit 1
}

# ============================================
# 1. TESTS DE WHO API
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  1. TESTS DE WHO API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1.1 Obtener token de WHO API
Invoke-ApiTest -Name "WHO API - Obtener Token" -Method "POST" -Endpoint "/api/whoapi/token"

# 1.2 Sincronizar catálogo CIE-10 desde WHO
Write-Host "Iniciando sincronización de catálogo CIE-10 (esto puede tardar varios minutos)..." -ForegroundColor Yellow
Invoke-ApiTest -Name "WHO API - Sincronizar Catálogo CIE-10" -Method "POST" -Endpoint "/api/whoapi/sync"

# 1.3 Verificar estado de sincronización
Invoke-ApiTest -Name "WHO API - Estado de Sincronización" -Method "GET" -Endpoint "/api/whoapi/sync-status"

# ============================================
# 2. TESTS DE BÚSQUEDA CIE-10
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  2. TESTS DE BÚSQUEDA CIE-10" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 2.1 Buscar por código
Invoke-ApiTest -Name "CIE-10 - Buscar por Código (A09)" -Method "GET" -Endpoint "/api/cie10/search?query=A09"

# 2.2 Buscar por descripción en español
Invoke-ApiTest -Name "CIE-10 - Buscar 'diabetes'" -Method "GET" -Endpoint "/api/cie10/search?query=diabetes"

# 2.3 Buscar hipertensión
Invoke-ApiTest -Name "CIE-10 - Buscar 'hipertensión'" -Method "GET" -Endpoint "/api/cie10/search?query=hipertensión"

# 2.4 Obtener detalles de un código específico
Invoke-ApiTest -Name "CIE-10 - Obtener Detalles de E11" -Method "GET" -Endpoint "/api/cie10/E11"

# ============================================
# 3. TESTS DE TRADUCCIÓN
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  3. TESTS DE TRADUCCIÓN (DeepL)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 3.1 Traducir español a inglés
$translateBody = @{
    text = "Paciente presenta fiebre alta, dolor de cabeza y náuseas"
    sourceLanguage = "ES"
    targetLanguage = "EN"
}
Invoke-ApiTest -Name "Traducción - ES → EN" -Method "POST" -Endpoint "/api/aiassistant/translate" -Body $translateBody

# 3.2 Traducir inglés a español
$translateBody2 = @{
    text = "Patient has high fever, headache and nausea"
    sourceLanguage = "EN"
    targetLanguage = "ES"
}
Invoke-ApiTest -Name "Traducción - EN → ES" -Method "POST" -Endpoint "/api/aiassistant/translate" -Body $translateBody2

# ============================================
# 4. TESTS DE ASISTENTE DE IA
# ============================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  4. TESTS DE ASISTENTE DE IA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 4.1 Análisis clínico simple
$analysisBody1 = @{
    clinicalDescription = "Paciente de 45 años con fiebre alta de 39°C, dolor de cabeza intenso, náuseas y vómitos. Presenta diarrea acuosa desde hace 2 días."
}
Write-Host "Analizando descripción clínica (esto puede tardar 10-15 segundos)..." -ForegroundColor Yellow
Invoke-ApiTest -Name "IA - Análisis Clínico (Gastroenteritis)" -Method "POST" -Endpoint "/api/aiassistant/analyze" -Body $analysisBody1

# 4.2 Análisis de diabetes
$analysisBody2 = @{
    clinicalDescription = "Paciente de 55 años con poliuria, polidipsia, pérdida de peso no intencional. Glucosa en ayunas de 180 mg/dL."
}
Write-Host "Analizando descripción clínica de diabetes..." -ForegroundColor Yellow
Invoke-ApiTest -Name "IA - Análisis Clínico (Diabetes)" -Method "POST" -Endpoint "/api/aiassistant/analyze" -Body $analysisBody2

# 4.3 Análisis de hipertensión
$analysisBody3 = @{
    clinicalDescription = "Paciente de 60 años con presión arterial elevada 160/100 mmHg, dolor de cabeza occipital, mareos ocasionales."
}
Write-Host "Analizando descripción clínica de hipertensión..." -ForegroundColor Yellow
Invoke-ApiTest -Name "IA - Análisis Clínico (Hipertensión)" -Method "POST" -Endpoint "/api/aiassistant/analyze" -Body $analysisBody3

# 4.4 Verificar interacciones medicamentosas
$interactionsBody = @{
    medicationIds = @(1, 2, 3)
}
Invoke-ApiTest -Name "IA - Verificar Interacciones Medicamentosas" -Method "POST" -Endpoint "/api/aiassistant/check-interactions" -Body $interactionsBody

# 4.5 Validar contraindicaciones
$contraindicationsBody = @{
    medicationId = 1
    patientConditions = @("diabetes", "hipertensión")
    patientAllergies = @("penicilina")
}
Invoke-ApiTest -Name "IA - Validar Contraindicaciones" -Method "POST" -Endpoint "/api/aiassistant/validate-contraindications" -Body $contraindicationsBody

# ============================================
# RESUMEN DE RESULTADOS
# ============================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUMEN DE RESULTADOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tests Pasados: $testsPassed" -ForegroundColor Green
Write-Host "Tests Fallidos: $testsFailed" -ForegroundColor Red
Write-Host "Total: $($testsPassed + $testsFailed)" -ForegroundColor Cyan
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "✓ TODOS LOS TESTS PASARON!" -ForegroundColor Green
    Write-Host ""
    Write-Host "El sistema está completamente funcional:" -ForegroundColor Green
    Write-Host "  ✓ WHO API conectada y sincronizando" -ForegroundColor Green
    Write-Host "  ✓ Catálogo CIE-10 disponible" -ForegroundColor Green
    Write-Host "  ✓ Traducción ES ↔ EN funcionando" -ForegroundColor Green
    Write-Host "  ✓ Análisis clínico con IA operativo" -ForegroundColor Green
    Write-Host "  ✓ Validación de interacciones activa" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✗ ALGUNOS TESTS FALLARON" -ForegroundColor Red
    Write-Host "Revisa los errores arriba para más detalles" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
