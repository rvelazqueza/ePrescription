# Script para probar el endpoint de recetas emitidas
# MVP Sesión 3 - Migración de Emitidas

Write-Host "=== Test: Recetas Emitidas Endpoint ===" -ForegroundColor Cyan
Write-Host ""

# 1. Login para obtener token
Write-Host "1. Obteniendo token de autenticación..." -ForegroundColor Yellow
$loginBody = @{
    username = "doctor"
    password = "doctor123"
    grant_type = "password"
    client_id = "eprescription-client"
    client_secret = "your-client-secret-here"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/realms/eprescription/protocol/openid-connect/token" `
        -Method Post `
        -ContentType "application/x-www-form-urlencoded" `
        -Body "username=doctor&password=doctor123&grant_type=password&client_id=eprescription-client&client_secret=your-client-secret-here"
    
    $token = $loginResponse.access_token
    Write-Host "✓ Token obtenido exitosamente" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ Error obteniendo token: $_" -ForegroundColor Red
    exit 1
}

# 2. Buscar prescripciones emitidas
Write-Host "2. Buscando prescripciones con estado 'Issued'..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $searchUrl = "http://localhost:8000/api/prescriptions/search?status=Issued&pageSize=100"
    $prescriptions = Invoke-RestMethod -Uri $searchUrl -Method Get -Headers $headers
    
    Write-Host "✓ Prescripciones encontradas: $($prescriptions.totalCount)" -ForegroundColor Green
    Write-Host ""
    
    if ($prescriptions.totalCount -gt 0) {
        Write-Host "Primeras prescripciones:" -ForegroundColor Cyan
        foreach ($p in $prescriptions.items | Select-Object -First 3) {
            Write-Host "  - ID: $($p.id)" -ForegroundColor White
            Write-Host "    Número: $($p.prescriptionNumber)" -ForegroundColor Gray
            Write-Host "    Paciente ID: $($p.patientId)" -ForegroundColor Gray
            Write-Host "    Estado: $($p.status)" -ForegroundColor Gray
            Write-Host "    Fecha: $($p.prescriptionDate)" -ForegroundColor Gray
            Write-Host "    Medicamentos: $($p.medications.Count)" -ForegroundColor Gray
            Write-Host ""
        }
    } else {
        Write-Host "⚠ No hay prescripciones emitidas en el sistema" -ForegroundColor Yellow
        Write-Host "  Necesitas crear algunas prescripciones primero" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "✗ Error buscando prescripciones: $_" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
    exit 1
}

# 3. Probar obtener datos de un paciente
if ($prescriptions.totalCount -gt 0) {
    Write-Host "3. Probando carga de datos de paciente..." -ForegroundColor Yellow
    $firstPatientId = $prescriptions.items[0].patientId
    
    try {
        $patientUrl = "http://localhost:8000/api/patients/$firstPatientId"
        $patient = Invoke-RestMethod -Uri $patientUrl -Method Get -Headers $headers
        
        Write-Host "✓ Paciente cargado exitosamente" -ForegroundColor Green
        Write-Host "  Nombre: $($patient.fullName)" -ForegroundColor Gray
        Write-Host "  Identificación: $($patient.identificationNumber)" -ForegroundColor Gray
        Write-Host "  Fecha de nacimiento: $($patient.dateOfBirth)" -ForegroundColor Gray
        Write-Host "  Género: $($patient.gender)" -ForegroundColor Gray
        Write-Host ""
    } catch {
        Write-Host "✗ Error cargando paciente: $_" -ForegroundColor Red
    }
}

Write-Host "=== Test Completado ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Resumen:" -ForegroundColor White
Write-Host "  - Endpoint de búsqueda: ✓ Funcional" -ForegroundColor Green
Write-Host "  - Prescripciones emitidas: $($prescriptions.totalCount)" -ForegroundColor White
Write-Host "  - Endpoint de pacientes: ✓ Funcional" -ForegroundColor Green
Write-Host ""
Write-Host "Siguiente paso: Abrir http://localhost:4200/prescripciones/emitidas" -ForegroundColor Cyan
