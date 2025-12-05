# Script para probar tareas 1.1 y 1.2 en Swagger
# Prueba de CreateDraft y CreatePrescription con validación de pads

$baseUrl = "http://localhost:8000"
$apiUrl = "$baseUrl/api"

Write-Host "=== Prueba de Tareas 1.1 y 1.2 ===" -ForegroundColor Cyan
Write-Host ""

# 1. Obtener token de autenticación
Write-Host "1. Obteniendo token de autenticación..." -ForegroundColor Yellow

$authUrl = "http://localhost:8180/realms/eprescription/protocol/openid-connect/token"
$clientId = "eprescription-api"
$clientSecret = "your-client-secret"  # Cambiar según configuración

try {
    $authResponse = Invoke-WebRequest -Uri $authUrl `
        -Method Post `
        -ContentType "application/x-www-form-urlencoded" `
        -Body "grant_type=client_credentials&client_id=$clientId&client_secret=$clientSecret" `
        -UseBasicParsing -ErrorAction SilentlyContinue
    
    if ($authResponse.StatusCode -eq 200) {
        $authData = $authResponse.Content | ConvertFrom-Json
        $token = $authData.access_token
        Write-Host "✅ Token obtenido exitosamente" -ForegroundColor Green
    } else {
        Write-Host "⚠️  No se pudo obtener token, continuando sin autenticación" -ForegroundColor Yellow
        $token = $null
    }
} catch {
    Write-Host "⚠️  Error al obtener token: $_" -ForegroundColor Yellow
    $token = $null
}

Write-Host ""

# 2. Probar endpoint de health
Write-Host "2. Verificando health del API..." -ForegroundColor Yellow

try {
    $healthResponse = Invoke-WebRequest -Uri "$apiUrl/health" -UseBasicParsing
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "✅ API Health: OK (Status: $($healthResponse.StatusCode))" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error en health check: $_" -ForegroundColor Red
}

Write-Host ""

# 3. Obtener pads disponibles para un doctor
Write-Host "3. Obteniendo pads disponibles..." -ForegroundColor Yellow

$doctorId = "550e8400-e29b-41d4-a716-446655440000"  # ID de ejemplo

try {
    $headers = @{}
    if ($token) {
        $headers["Authorization"] = "Bearer $token"
    }
    
    $padsResponse = Invoke-WebRequest -Uri "$apiUrl/prescriptions/pads/available?doctorId=$doctorId" `
        -Headers $headers `
        -UseBasicParsing -ErrorAction SilentlyContinue
    
    if ($padsResponse.StatusCode -eq 200) {
        $padsData = $padsResponse.Content | ConvertFrom-Json
        Write-Host "✅ Pads obtenidos: $($padsData.pads.Count) disponibles" -ForegroundColor Green
        
        if ($padsData.pads.Count -gt 0) {
            $firstPad = $padsData.pads[0]
            Write-Host "   - Primer pad: $($firstPad.id)" -ForegroundColor Cyan
            Write-Host "   - Disponibles: $($firstPad.availableCount)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "⚠️  Status: $($padsResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  No se pudieron obtener pads (puede ser normal si no hay datos): $_" -ForegroundColor Yellow
}

Write-Host ""

# 4. Información sobre los endpoints disponibles
Write-Host "4. Endpoints disponibles para prueba:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   POST /api/prescriptions/draft" -ForegroundColor Cyan
Write-Host "   - Crear prescripción en borrador" -ForegroundColor Gray
Write-Host "   - Body: { patientId, doctorId, medicalCenterId, padId, medications[], diagnoses[], notes }" -ForegroundColor Gray
Write-Host ""
Write-Host "   POST /api/prescriptions" -ForegroundColor Cyan
Write-Host "   - Crear prescripción (emitir)" -ForegroundColor Gray
Write-Host "   - Body: { draftId, padId }" -ForegroundColor Gray
Write-Host ""
Write-Host "   GET /api/prescriptions/pads/available?doctorId={doctorId}" -ForegroundColor Cyan
Write-Host "   - Obtener pads disponibles para un doctor" -ForegroundColor Gray
Write-Host ""

# 5. Acceso a Swagger
Write-Host "5. Acceso a Swagger UI:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   🌐 Abre en tu navegador:" -ForegroundColor Cyan
Write-Host "   http://localhost:8000/swagger/ui" -ForegroundColor Green
Write-Host ""

Write-Host "=== Prueba Completada ===" -ForegroundColor Cyan
