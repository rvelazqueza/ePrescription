# Script para comentar temporalmente configuraciones problemáticas
# Esto permitirá que el proyecto compile para probar la autorización

Write-Host "Comentando configuraciones problemáticas temporalmente..." -ForegroundColor Yellow

# Lista de archivos de configuración con errores
$problematicConfigs = @(
    "eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/AIAnalysisLogConfiguration.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/DoctorMedicalCenterConfiguration.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/InventoryConfiguration.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/PharmacyConfiguration.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/PrescriptionMedicationConfiguration.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/PrescriptionDiagnosisConfiguration.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/PrescriptionConfiguration.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/DoctorConfiguration.cs"
)

foreach ($config in $problematicConfigs) {
    if (Test-Path $config) {
        $backupFile = "$config.backup"
        Copy-Item $config $backupFile -Force
        Write-Host "  Backup creado: $backupFile" -ForegroundColor Green
        
        # Comentar el contenido del método Configure
        $content = Get-Content $config -Raw
        $content = $content -replace '(public void Configure\(.*?\)\s*\{)', '$1/*'
        $content = $content -replace '(\}\s*\})$', '*/$1'
        Set-Content $config $content
        Write-Host "  Comentado: $config" -ForegroundColor Yellow
    }
}

Write-Host "`nConfiguraciones comentadas. El proyecto debería compilar ahora." -ForegroundColor Green
Write-Host "Para restaurar: ejecuta restore-configurations.ps1" -ForegroundColor Cyan
