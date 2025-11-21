# Script para iniciar el API para Task 11 - Prescriptions Testing
# Este script maneja la configuración de .NET correctamente

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Iniciando API para Task 11" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que Docker esté corriendo
Write-Host "Verificando servicios Docker..." -ForegroundColor Yellow
$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker no está corriendo!" -ForegroundColor Red
    Write-Host "Por favor inicia Docker Desktop primero" -ForegroundColor Yellow
    exit 1
}

# Verificar Oracle
$oracleRunning = docker ps | Select-String "oracle"
if (-not $oracleRunning) {
    Write-Host "Oracle no está corriendo. Iniciando..." -ForegroundColor Yellow
    docker-compose up -d oracle-db
    Write-Host "Esperando a que Oracle esté listo..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}
else {
    Write-Host "Oracle está corriendo" -ForegroundColor Green
}

# Verificar Keycloak
$keycloakRunning = docker ps | Select-String "keycloak"
if (-not $keycloakRunning) {
    Write-Host "Keycloak no está corriendo. Iniciando..." -ForegroundColor Yellow
    docker-compose up -d keycloak
    Write-Host "Esperando a que Keycloak esté listo..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
}
else {
    Write-Host "Keycloak está corriendo" -ForegroundColor Green
}

Write-Host ""
Write-Host "Servicios Docker listos!" -ForegroundColor Green
Write-Host ""

# Navegar al proyecto API
Write-Host "Navegando al proyecto API..." -ForegroundColor Yellow
Set-Location "eprescription-API/src/ePrescription.API"

# Verificar que el proyecto existe
if (-not (Test-Path "ePrescription.API.csproj")) {
    Write-Host "No se encontró el proyecto API!" -ForegroundColor Red
    Set-Location "../../.."
    exit 1
}

Write-Host "Proyecto encontrado" -ForegroundColor Green
Write-Host ""

# Configurar variables de entorno para .NET
Write-Host "Configurando variables de entorno..." -ForegroundColor Yellow
$env:DOTNET_ROOT = "C:\Program Files\dotnet"
$env:PATH = "C:\Program Files\dotnet;$env:PATH"

# Verificar versión de .NET
Write-Host "Verificando versión de .NET..." -ForegroundColor Yellow
$dotnetVersion = dotnet --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Versión de .NET: $dotnetVersion" -ForegroundColor Green
}
else {
    Write-Host "No se pudo detectar .NET. Intentando con ruta completa..." -ForegroundColor Yellow
    $dotnetVersion = & "C:\Program Files\dotnet\dotnet.exe" --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Versión de .NET: $dotnetVersion" -ForegroundColor Green
    }
    else {
        Write-Host "Error: No se pudo ejecutar dotnet" -ForegroundColor Red
        Set-Location "../../.."
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Iniciando API..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "El API se iniciará en:" -ForegroundColor Yellow
Write-Host "  HTTP:  http://localhost:5000" -ForegroundColor White
Write-Host "  HTTPS: https://localhost:5001" -ForegroundColor White
Write-Host "  Swagger: http://localhost:5000/swagger" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el API" -ForegroundColor Yellow
Write-Host ""

# Intentar iniciar con dotnet run
try {
    dotnet run --project ePrescription.API.csproj
}
catch {
    Write-Host "Error al iniciar el API con 'dotnet run'" -ForegroundColor Red
    Write-Host "Intentando con ruta completa..." -ForegroundColor Yellow
    & "C:\Program Files\dotnet\dotnet.exe" run --project ePrescription.API.csproj
}
finally {
    Set-Location "../../.."
}
