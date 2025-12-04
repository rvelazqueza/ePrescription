# Script para arreglar .NET PATH
Write-Host "Arreglando .NET PATH..." -ForegroundColor Cyan

$dotnetPath = "C:\Program Files\dotnet"

# Verificar instalacion
if (Test-Path "$dotnetPath\dotnet.exe") {
    Write-Host "OK: .NET encontrado" -ForegroundColor Green
    & "$dotnetPath\dotnet.exe" --list-sdks
} else {
    Write-Host "ERROR: .NET no encontrado" -ForegroundColor Red
    exit 1
}

# Agregar al PATH del usuario
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$dotnetPath*") {
    Write-Host "Agregando al PATH del usuario..." -ForegroundColor Yellow
    $newPath = "$currentPath;$dotnetPath"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "OK: Agregado al PATH" -ForegroundColor Green
} else {
    Write-Host "OK: Ya esta en el PATH" -ForegroundColor Green
}

# Actualizar PATH en sesion actual
$env:Path = "$env:Path;$dotnetPath"

Write-Host "`nProbando dotnet en esta sesion..." -ForegroundColor Cyan
dotnet --version

Write-Host "`nLISTO! Ahora puedes usar 'dotnet' en esta sesion" -ForegroundColor Green
Write-Host "Para otras sesiones, reinicia PowerShell" -ForegroundColor Yellow
