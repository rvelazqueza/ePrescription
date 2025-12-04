# Test script para verificar que los nombres de pacientes aparecen en las prescripciones emitidas

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test: Nombres de Pacientes en Emitidas" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Endpoint
$endpoint = "http://localhost:8000/api/prescriptions/status/active"

Write-Host "Endpoint: $endpoint" -ForegroundColor Yellow
Write-Host ""

try {
    Write-Host "Obteniendo prescripciones emitidas..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri $endpoint -Method Get -ContentType "application/json"
    
    Write-Host "Respuesta recibida" -ForegroundColor Green
    Write-Host ""
    
    # Mostrar informacion general
    Write-Host "Resumen:" -ForegroundColor Cyan
    Write-Host "  - Total de prescripciones: $($response.totalCount)" -ForegroundColor White
    Write-Host "  - Items en esta pagina: $($response.items.Count)" -ForegroundColor White
    Write-Host ""
    
    if ($response.items.Count -gt 0) {
        Write-Host "Verificando datos de pacientes..." -ForegroundColor Cyan
        Write-Host ""
        
        $conNombres = 0
        $sinNombres = 0
        
        foreach ($item in $response.items) {
            $prescriptionNumber = $item.prescriptionNumber
            $patientName = $item.patientName
            $doctorName = $item.doctorName
            $medicalCenterName = $item.medicalCenterName
            
            if ([string]::IsNullOrWhiteSpace($patientName)) {
                $sinNombres++
                Write-Host "  X $prescriptionNumber - SIN NOMBRE DE PACIENTE" -ForegroundColor Red
            } else {
                $conNombres++
                Write-Host "  OK $prescriptionNumber" -ForegroundColor Green
                Write-Host "     Paciente: $patientName" -ForegroundColor White
                Write-Host "     Doctor: $doctorName" -ForegroundColor White
                Write-Host "     Centro: $medicalCenterName" -ForegroundColor White
            }
        }
        
        Write-Host ""
        Write-Host "Resultados:" -ForegroundColor Cyan
        Write-Host "  - Con nombres: $conNombres" -ForegroundColor Green
        Write-Host "  - Sin nombres: $sinNombres" -ForegroundColor $(if ($sinNombres -gt 0) { "Red" } else { "Green" })
        Write-Host ""
        
        if ($sinNombres -eq 0) {
            Write-Host "EXITO! Todas las prescripciones tienen nombres de pacientes" -ForegroundColor Green
        } else {
            Write-Host "ADVERTENCIA: Algunas prescripciones no tienen nombres de pacientes" -ForegroundColor Yellow
        }
        
        # Mostrar una muestra completa
        Write-Host ""
        Write-Host "Muestra de la primera prescripcion:" -ForegroundColor Cyan
        $response.items[0] | ConvertTo-Json -Depth 3
        
    } else {
        Write-Host "No se encontraron prescripciones emitidas" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "Error al obtener prescripciones:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Detalles del error:" -ForegroundColor Yellow
    Write-Host $_ -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
