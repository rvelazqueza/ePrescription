# Script para configurar .NET 8 como versión por defecto

Write-Host "=== Configuración de .NET 8 ===" -ForegroundColor Cyan
Write-Host ""

$dotnetPath = "C:\Program Files\dotnet\dotnet.exe"

Write-Host "Versiones instaladas:" -ForegroundColor Yellow
& $dotnetPath --list-sdks

Write-Host ""
Write-Host "Versión actual:" -ForegroundColor Yellow
& $dotnetPath --version

Write-Host ""
Write-Host "Configurando variable DOTNET_ROOT..." -ForegroundColor Yellow
[System.Environment]::SetEnvironmentVariable("DOTNET_ROOT", "C:\Program Files\dotnet", [System.EnvironmentVariableTarget]::User)
Write-Host "OK" -ForegroundColor Green

Write-Host ""
Write-Host "Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Para usar .NET 8 en este proyecto, el global.json ya está configurado." -ForegroundColor Cyan
Write-Host "Reinicia PowerShell y ejecuta:" -ForegroundColor Yellow
Write-Host '  cd eprescription-API' -ForegroundColor White
Write-Host '  & "C:\Program Files\dotnet\dotnet.exe" build' -ForegroundColor White
