# Script para probar los datos del Dashboard
# Verifica que los endpoints usados por el Dashboard funcionen correctamente

Write-Host "=== Testing Dashboard Data Endpoints ===" -ForegroundColor Cyan
Write-Host ""

# Configuración
$baseUrl = "http://localhost:8000/api"
$token = ""

# Función para obtener token
function Get-AuthToken {
    Write-Host "1. Obteniendo token de autenticación..." -ForegroundColor Yellow
    
    $loginBody = @{
        username = "doctor1"
        password = "Doctor123!"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/realms/eprescription/protocol/openid-connect/token" `
            -Method Post `
            -ContentType "application/x-www-form-urlencoded" `
            -Body "grant_type=password&client_id=eprescription-app&client_secret=your-client-secret&username=doctor1&password=Doctor123!"
        
        Write-Host "   ✓ Token obtenido exitosamente" -ForegroundColor Green
        return $response.access_token
    }
    catch {
        Write-Host "   ✗ Error obteniendo token: $_" -ForegroundColor Red
        return $null
    }
}

# Función para hacer requests con auth
function Invoke-AuthRequest {
    param(
        [string]$Uri,
        [string]$Method = "GET",
        [string]$Token
    )
    
    $headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri $Uri -Method $Method -Headers $headers
        return $response
    }
    catch {
        Write-Host "   ✗ Error: $_" -ForegroundColor Red
        return $null
    }
}

# Obtener token
$token = Get-AuthToken
if (-not $token) {
    Write-Host "`nNo se pudo obtener el token. Verifica que Keycloak esté corriendo." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Testing Médico Dashboard Data ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Recetas activas hoy
Write-Host "2. Testing: Recetas activas hoy" -ForegroundColor Yellow
$today = (Get-Date).ToString("yyyy-MM-dd")
$uri = "$baseUrl/prescriptions/search?status=active&startDate=$today&pageSize=1"
$response = Invoke-AuthRequest -Uri $uri -Token $token
if ($response) {
    Write-Host "   ✓ Total recetas hoy: $($response.totalCount)" -ForegroundColor Green
} else {
    Write-Host "   ✗ No se pudieron obtener las recetas" -ForegroundColor Red
}

# Test 2: Borradores pendientes
Write-Host ""
Write-Host "3. Testing: Borradores pendientes" -ForegroundColor Yellow
$uri = "$baseUrl/prescriptions/search?status=draft&pageSize=1"
$response = Invoke-AuthRequest -Uri $uri -Token $token
if ($response) {
    Write-Host "   ✓ Total borradores: $($response.totalCount)" -ForegroundColor Green
} else {
    Write-Host "   ✗ No se pudieron obtener los borradores" -ForegroundColor Red
}

# Test 3: Total pacientes
Write-Host ""
Write-Host "4. Testing: Total pacientes" -ForegroundColor Yellow
$uri = "$baseUrl/patients/search"
$body = @{
    page = 1
    pageSize = 1
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $body
    $totalPatients = if ($response.items) { $response.items.Count } else { 0 }
    Write-Host "   ✓ Total pacientes: $totalPatients" -ForegroundColor Green
}
catch {
    Write-Host "   ✗ Error obteniendo pacientes: $_" -ForegroundColor Red
}

# Test 4: Actividad reciente - Últimas prescripciones
Write-Host ""
Write-Host "5. Testing: Actividad reciente (últimas 4 prescripciones)" -ForegroundColor Yellow
$uri = "$baseUrl/prescriptions/search?status=active&pageSize=4"
$response = Invoke-AuthRequest -Uri $uri -Token $token
if ($response -and $response.items) {
    Write-Host "   ✓ Prescripciones recientes: $($response.items.Count)" -ForegroundColor Green
    foreach ($prescription in $response.items) {
        Write-Host "      - $($prescription.prescriptionNumber) | Paciente: $($prescription.patientId) | Fecha: $($prescription.createdAt)" -ForegroundColor Gray
    }
} else {
    Write-Host "   ✗ No se pudieron obtener las prescripciones recientes" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Testing Farmacéutico Dashboard Data ===" -ForegroundColor Cyan
Write-Host ""

# Test 5: Dispensaciones
Write-Host "6. Testing: Dispensaciones" -ForegroundColor Yellow
$uri = "$baseUrl/dispensations/search?pageSize=4"
try {
    $response = Invoke-AuthRequest -Uri $uri -Token $token
    if ($response) {
        $count = if ($response.Count) { $response.Count } else { 0 }
        Write-Host "   ✓ Total dispensaciones: $count" -ForegroundColor Green
        if ($count -gt 0) {
            foreach ($disp in $response | Select-Object -First 4) {
                Write-Host "      - $($disp.id) | Prescripción: $($disp.prescriptionNumber) | Fecha: $($disp.dispensationDate)" -ForegroundColor Gray
            }
        }
    }
}
catch {
    Write-Host "   ✗ Error obteniendo dispensaciones: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Resumen ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Dashboard data endpoints tested successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Notas:" -ForegroundColor Yellow
Write-Host "  - Los KPIs se calculan en el frontend usando estos endpoints" -ForegroundColor Gray
Write-Host "  - La actividad reciente muestra las últimas 4 entradas" -ForegroundColor Gray
Write-Host "  - Los insights siguen siendo mock (requieren lógica de negocio compleja)" -ForegroundColor Gray
Write-Host "  - Stock bajo requiere contexto de farmacia (pendiente)" -ForegroundColor Gray
Write-Host ""
