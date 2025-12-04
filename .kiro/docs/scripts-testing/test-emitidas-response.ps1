# Script para probar la respuesta del endpoint de prescripciones

Write-Host "=== Probando Endpoint de Prescripciones ===" -ForegroundColor Cyan

# URL del endpoint
$url = "http://localhost:8000/api/prescriptions/search?status=active&pageSize=10"

Write-Host "`nURL: $url" -ForegroundColor Yellow

try {
    # Hacer la petición
    $response = Invoke-RestMethod -Uri $url -Method Get -ContentType "application/json"
    
    Write-Host "`n✅ Respuesta exitosa!" -ForegroundColor Green
    
    # Mostrar estructura de la respuesta
    Write-Host "`n=== Estructura de la Respuesta ===" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 10
    
    # Analizar items
    if ($response.items) {
        Write-Host "`n=== Total de Items: $($response.items.Count) ===" -ForegroundColor Cyan
        
        if ($response.items.Count -gt 0) {
            Write-Host "`n=== Primer Item (Detalle) ===" -ForegroundColor Cyan
            $firstItem = $response.items[0]
            
            Write-Host "`nCampos del Item:" -ForegroundColor Yellow
            $firstItem.PSObject.Properties | ForEach-Object {
                Write-Host "  - $($_.Name): $($_.Value)" -ForegroundColor White
            }
            
            # Verificar campos específicos
            Write-Host "`n=== Verificación de Campos ===" -ForegroundColor Cyan
            
            Write-Host "PatientId: " -NoNewline
            if ($firstItem.patientId) {
                Write-Host "$($firstItem.patientId)" -ForegroundColor Green
            } else {
                Write-Host "❌ FALTA" -ForegroundColor Red
            }
            
            Write-Host "Medications: " -NoNewline
            if ($firstItem.medications) {
                Write-Host "$($firstItem.medications.Count) medicamentos" -ForegroundColor Green
                $firstItem.medications | ForEach-Object {
                    Write-Host "  - $($_.medicationName)" -ForegroundColor White
                }
            } else {
                Write-Host "❌ FALTA" -ForegroundColor Red
            }
            
            Write-Host "Diagnoses: " -NoNewline
            if ($firstItem.diagnoses) {
                Write-Host "$($firstItem.diagnoses.Count) diagnósticos" -ForegroundColor Green
                $firstItem.diagnoses | ForEach-Object {
                    Write-Host "  - $($_.description) ($($_.cie10Code))" -ForegroundColor White
                }
            } else {
                Write-Host "❌ FALTA" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "`n❌ No hay items en la respuesta" -ForegroundColor Red
    }
    
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

Write-Host "`n=== Fin de la Prueba ===" -ForegroundColor Cyan
