# Script simple para arreglar .NET PATH
Write-Host "=== ARREGLANDO .NET PATH ===" -ForegroundColor Cyan

$dotnetPath = "C:\Program Files\dotnet"

# Verificar que existe
if (Test-Path "$dotnetPath\dotnet.exe") {
    Write-Host "✅ .NET encontrado en: $dotnetPath" -ForegroundColor Green
    
    # Mostrar versión
    $version = & "$dotnetPath\dotnet.exe" --version
    Write-Host "   Versión: $version" -ForegroundColor White
} else {
    Write-Host "❌ .NET NO encontrado" -ForegroundColor Red
    exit 1
}

# Agregar al PATH del usuario
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$dotnetPath*") {
    Write-Host "📝 Agregando al PATH del usuario..." -ForegroundColor Yellow
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$dotnetPath", "User")
    Write-Host "✅ Agregado al PATH del usuario" -ForegroundColor Green
} else {
    Write-Host "✅ Ya está en el PATH del usuario" -ForegroundColor Green
}

# Intentar agregar al PATH del sistema (requiere admin)
$systemPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($systemPath -notlike "*$dotnetPath*") {
    Write-Host "📝 Intentando agregar al PATH del sistema..." -ForegroundColor Yellow
    try {
        [Environment]::SetEnvironmentVariable("Path", "$systemPath;$dotnetPath", "Machine")
        Write-Host "✅ Agregado al PATH del sistema" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ No se pudo agregar al PATH del sistema (requiere admin)" -ForegroundColor Yellow
        Write-Host "   Pero el PATH del usuario es suficiente" -ForegroundColor Gray
    }
} else {
    Write-Host "✅ Ya está en el PATH del sistema" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 COMPLETADO" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️ IMPORTANTE: Debes REINICIAR PowerShell" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para usar .NET en ESTA sesión sin reiniciar:" -ForegroundColor Cyan
Write-Host '  $env:PATH = "C:\Program Files\dotnet;" + $env:PATH' -ForegroundColor White
Write-Host "  dotnet --version" -ForegroundColor White
Write-Host ""
