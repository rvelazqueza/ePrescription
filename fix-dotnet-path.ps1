# Script para arreglar .NET PATH permanentemente
# Ejecutar como Administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ARREGLANDO .NET PATH" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$dotnetPath = "C:\Program Files\dotnet"

# Verificar que .NET existe
if (Test-Path "$dotnetPath\dotnet.exe") {
    Write-Host "✓ .NET encontrado en: $dotnetPath" -ForegroundColor Green
    
    # Verificar versiones instaladas
    Write-Host "`nVersiones instaladas:" -ForegroundColor Yellow
    & "$dotnetPath\dotnet.exe" --list-sdks
    
} else {
    Write-Host "✗ .NET NO encontrado en $dotnetPath" -ForegroundColor Red
    Write-Host "Por favor instala .NET 8 desde: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Verificar PATH actual
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -like "*$dotnetPath*") {
    Write-Host "✓ .NET ya está en el PATH del usuario" -ForegroundColor Green
} else {
    Write-Host "⚠ .NET NO está en el PATH del usuario" -ForegroundColor Yellow
    Write-Host "Agregando al PATH..." -ForegroundColor Yellow
    
    # Agregar al PATH del usuario
    $newPath = "$currentPath;$dotnetPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    
    Write-Host "✓ .NET agregado al PATH del usuario" -ForegroundColor Green
}

# Verificar PATH del sistema
$systemPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($systemPath -like "*$dotnetPath*") {
    Write-Host "✓ .NET ya está en el PATH del sistema" -ForegroundColor Green
} else {
    Write-Host "⚠ .NET NO está en el PATH del sistema" -ForegroundColor Yellow
    Write-Host "Intentando agregar al PATH del sistema (requiere permisos de admin)..." -ForegroundColor Yellow
    
    try {
        $newSystemPath = "$systemPath;$dotnetPath"
        [Environment]::SetEnvironmentVariable("Path", $newSystemPath, "Machine")
        Write-Host "✓ .NET agregado al PATH del sistema" -ForegroundColor Green
    } catch {
        Write-Host "✗ No se pudo agregar al PATH del sistema (requiere ejecutar como Administrador)" -ForegroundColor Red
        Write-Host "Pero el PATH del usuario es suficiente" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACION COMPLETADA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "IMPORTANTE: Debes REINICIAR PowerShell para que los cambios surtan efecto" -ForegroundColor Yellow
Write-Host ""
Write-Host "Después de reiniciar, ejecuta:" -ForegroundColor Cyan
Write-Host "  dotnet --version" -ForegroundColor White
Write-Host ""
Write-Host "Debería mostrar: 8.0.101 o 10.0.100" -ForegroundColor White
Write-Host ""

# Crear alias temporal para esta sesión
Write-Host "Para usar .NET en ESTA sesión (sin reiniciar), ejecuta:" -ForegroundColor Cyan
Write-Host '  Set-Alias dotnet "C:\Program Files\dotnet\dotnet.exe"' -ForegroundColor White
Write-Host ""
