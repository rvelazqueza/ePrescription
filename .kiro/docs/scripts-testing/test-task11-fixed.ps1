# Test Task 11 - Prescription API con IDs reales

Write-Host "🧪 Probando Task 11 - Prescription Management API" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Convertir IDs hexadecimales a GUIDs
function ConvertFrom-OracleHex {
    param([string]$hex)
    $bytes = [System.Convert]::FromHexString($hex)
    return [System.Guid]::new($bytes)
}

# IDs reales de la base de datos
$patientId = ConvertFrom-OracleHex "4369F7709F0C0E43E063020016AC882B"
$doctorId = ConvertFrom-OracleHex "4369F774BDC70E4DE063020016ACEA9D"
$centerId = ConvertFrom-OracleHex "4369F774BDB80E4DE063020016ACEA9D"
$medicationId = ConvertFrom-OracleHex "4369F778D33E0E57E063020016ACDCD9"
$routeId = ConvertFrom-OracleHex "4369A7EE05820B3CE063020016AC10FF"

Write-Host "📋 IDs convertidos:" -ForegroundColor Yellow
Write-Host "Patient: $patientId"
Write-Host "Doctor: $doctorId"
Write-Host "Center: $centerId"
Write-Host "Medication: $medicationId"
Write-Host "Route: $routeId"
Write-Host ""

# Crear prescripción
$prescription = @{
    patientId = $patientId.ToString()
    doctorId = $doctorId.ToString()
    medicalCenterId = $centerId.ToString()
    prescriptionDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    expirationDate = (Get-Date).AddDays(30).ToString("yyyy-MM-ddTHH:mm:ss")
    notes = "Prescripción de prueba - Task 11 con IDs reales"
    medications = @(@{
        medicationId = $medicationId.ToString()
        dosage = "500mg"
        frequency = "Cada 8 horas"
        durationDays = 7
        administrationRouteId = $routeId.ToString()
        quantity = 21
        instructions = "Tomar con alimentos, completar tratamiento"
    })
    diagnoses = @(@{
        cie10Code = "A00"
        isPrimary = $true
        notes = "Diagnóstico de prueba"
    })
} | ConvertTo-Json -Depth 3

Write-Host "🔄 Creando prescripción..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/prescriptions" -Method POST -Body $prescription -ContentType "application/json"
    
    Write-Host "✅ PRESCRIPCIÓN CREADA EXITOSAMENTE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 Detalles de la prescripción:" -ForegroundColor Cyan
    Write-Host "ID: $($response.id)"
    Write-Host "Número: $($response.prescriptionNumber)"
    Write-Host "Estado: $($response.status)"
    Write-Host "Fecha: $($response.prescriptionDate)"
    Write-Host "Expira: $($response.expirationDate)"
    Write-Host "Paciente ID: $($response.patientId)"
    Write-Host "Doctor ID: $($response.doctorId)"
    Write-Host "Medicamentos: $($response.medications.Count)"
    Write-Host "Diagnósticos: $($response.diagnoses.Count)"
    Write-Host ""
    
    $global:prescriptionId = $response.id
    Write-Host "💾 ID guardado en variable global" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Error al crear prescripción" -ForegroundColor Red
    Write-Host "Mensaje: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Detalles: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
    exit 1
}

Write-Host ""
Write-Host "🎉 Task 11 funcionando correctamente!" -ForegroundColor Green
