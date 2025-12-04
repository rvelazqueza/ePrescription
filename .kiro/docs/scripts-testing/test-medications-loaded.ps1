$prescriptionId = "6a306a43-cec9-7710-e063-020016ac555e"
$url = "http://localhost:8000/api/prescriptions/$prescriptionId"

Write-Host "=== Probando Carga de Medicamentos ===" -ForegroundColor Green
Write-Host "URL: $url" -ForegroundColor Yellow

Start-Sleep -Seconds 2

try {
    $response = Invoke-RestMethod -Uri $url -Method GET -ContentType "application/json"
    Write-Host "`n✅ Respuesta exitosa!" -ForegroundColor Green
    
    Write-Host "`n=== Medicamentos Cargados ===" -ForegroundColor Cyan
    if ($response.medications -and $response.medications.Count -gt 0) {
        Write-Host "Total de medicamentos: $($response.medications.Count)" -ForegroundColor White
        
        foreach ($med in $response.medications) {
            Write-Host "`n📋 Medicamento:" -ForegroundColor Yellow
            Write-Host "  - ID: $($med.id)" -ForegroundColor White
            Write-Host "  - Medication ID: $($med.medicationId)" -ForegroundColor White
            Write-Host "  - Dosage: $($med.dosage)" -ForegroundColor White
            Write-Host "  - Frequency: $($med.frequency)" -ForegroundColor White
            Write-Host "  - Duration Days: $($med.durationDays)" -ForegroundColor White
            Write-Host "  - Quantity: $($med.quantity)" -ForegroundColor White
            
            if ($med.medication) {
                Write-Host "  ✅ Medication Object Loaded:" -ForegroundColor Green
                Write-Host "    - Commercial Name: $($med.medication.commercialName)" -ForegroundColor White
                Write-Host "    - Generic Name: $($med.medication.genericName)" -ForegroundColor White
            } else {
                Write-Host "  ❌ Medication Object is NULL" -ForegroundColor Red
            }
            
            if ($med.administrationRoute) {
                Write-Host "  ✅ Administration Route Loaded:" -ForegroundColor Green
                Write-Host "    - Name: $($med.administrationRoute.name)" -ForegroundColor White
            } else {
                Write-Host "  ⚠️ Administration Route is NULL" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "❌ No medications found" -ForegroundColor Red
    }
    
    Write-Host "`n=== Respuesta Completa ===" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "`n❌ Error en la petición:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "`nRespuesta del servidor:" -ForegroundColor Yellow
        Write-Host $responseBody -ForegroundColor White
    }
}

Write-Host "`n=== Fin de la Prueba ===" -ForegroundColor Green
