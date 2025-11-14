# Script temporal para comentar configuraciones problemáticas
# Esto permite que el proyecto compile para Docker

Write-Host "Comentando configuraciones problemáticas temporalmente..." -ForegroundColor Yellow

$configsToComment = @(
    "eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/DoctorMedicalCenterConfiguration.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/InventoryConfiguration.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/PharmacyConfiguration.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/PrescriptionDiagnosisConfiguration.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/PrescriptionConfiguration.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/DoctorConfiguration.cs"
)

foreach ($file in $configsToComment) {
    if (Test-Path $file) {
        # Crear backup
        Copy-Item $file "$file.backup" -Force
        
        # Leer contenido
        $content = Get-Content $file -Raw
        
        # Comentar todo el metodo Configure
        $content = $content -replace '(public void Configure\([^)]+\)\s*\{)', '$1/*'
        $content = $content -replace '(\}\s*\})$', '*/$1'
        
        # Guardar
        Set-Content $file $content -NoNewline
        Write-Host "  Comentado: $file" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Configuraciones comentadas. El proyecto deberia compilar ahora." -ForegroundColor Green
Write-Host "Para restaurar: copia los archivos .backup" -ForegroundColor Cyan
