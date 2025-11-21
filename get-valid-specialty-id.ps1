# Script para obtener un Specialty ID válido desde el API
Write-Host "Obteniendo Specialty ID válido desde el API..." -ForegroundColor Cyan

try {
    # Verificar que el API esté corriendo
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/specialties" -UseBasicParsing -TimeoutSec 5
    
    if ($response.StatusCode -eq 200) {
        $specialties = ($response.Content | ConvertFrom-Json)
        
        if ($specialties.Count -gt 0) {
            $firstSpecialty = $specialties[0]
            Write-Host "✅ Specialty encontrado:" -ForegroundColor Green
            Write-Host "   ID: $($firstSpecialty.id)" -ForegroundColor Yellow
            Write-Host "   Nombre: $($firstSpecialty.name)" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Actualizando script de pruebas..." -ForegroundColor Cyan
            
            # Actualizar el script de doctors con el ID válido
            $scriptContent = Get-Content "test-task12-doctors.ps1" -Raw
            $newContent = $scriptContent -replace '\$specialtyId = "[^"]*"', "`$specialtyId = ""$($firstSpecialty.id)"""
            $newContent = $newContent -replace 'Using Specialty ID: [^)]*\)', "Using Specialty ID: $($firstSpecialty.id) ($($firstSpecialty.name))"
            
            Set-Content "test-task12-doctors.ps1" -Value $newContent
            
            Write-Host "✅ Script actualizado con ID válido: $($firstSpecialty.id)" -ForegroundColor Green
            Write-Host "Ahora ejecuta: .\test-task12-doctors.ps1" -ForegroundColor Yellow
        } else {
            Write-Host "❌ No se encontraron specialties" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "❌ Error conectando al API: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Asegúrate de que el API esté corriendo: docker-compose up -d eprescription-api" -ForegroundColor Yellow
}
