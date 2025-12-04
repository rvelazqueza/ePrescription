# Script para iniciar el API para Task 11 con fix de .NET
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Task 11: Iniciando API de Prescripciones" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Configurar .NET PATH para esta sesión
Write-Host "Paso 1: Configurando .NET..." -ForegroundColor Yellow
$dotnetPath = "C:\Program Files\dotnet"

if (Test-Path "$dotnetPath\dotnet.exe") {
    $env:PATH = "$dotnetPath;$env:PATH"
    $env:DOTNET_ROOT = $dotnetPath
    
    $version = & "$dotnetPath\dotnet.exe" --version
    Write-Host "  .NET Version: $version" -ForegroundColor Green
    Write-Host ""
}
else {
    Write-Host "  ERROR: .NET no encontrado en $dotnetPath" -ForegroundColor Red
    Write-Host "  Por favor instala .NET 8 SDK" -ForegroundColor Yellow
    exit 1
}

# Paso 2: Verificar Docker
Write-Host "Paso 2: Verificando servicios Docker..." -ForegroundColor Yellow

$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Docker no está corriendo" -ForegroundColor Red
    Write-Host "  Por favor inicia Docker Desktop" -ForegroundColor Yellow
    exit 1
}

$oracleRunning = docker ps | Select-String "oracle"
if ($oracleRunning) {
    Write-Host "  Oracle: Running" -ForegroundColor Green
}
else {
    Write-Host "  Oracle: Not running" -ForegroundColor Yellow
    Write-Host "  Iniciando Oracle..." -ForegroundColor Yellow
    docker-compose up -d oracle-db
    Start-Sleep -Seconds 10
}

$keycloakRunning = docker ps | Select-String "keycloak"
if ($keycloakRunning) {
    Write-Host "  Keycloak: Running" -ForegroundColor Green
}
else {
    Write-Host "  Keycloak: Not running" -ForegroundColor Yellow
    Write-Host "  Iniciando Keycloak..." -ForegroundColor Yellow
    docker-compose up -d keycloak
    Start-Sleep -Seconds 15
}

Write-Host ""

# Paso 3: Compilar el proyecto
Write-Host "Paso 3: Compilando el proyecto..." -ForegroundColor Yellow
Push-Location "eprescription-API"

try {
    $buildOutput = & "$dotnetPath\dotnet.exe" build --configuration Release 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Compilación exitosa" -ForegroundColor Green
        Write-Host ""
    }
    else {
        Write-Host "  ERROR en la compilación:" -ForegroundColor Red
        Write-Host $buildOutput -ForegroundColor Red
        Pop-Location
        exit 1
    }
}
catch {
    Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Pop-Location
    exit 1
}

# Paso 4: Iniciar el API
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Iniciando API..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "El API estará disponible en:" -ForegroundColor Yellow
Write-Host "  HTTP:    http://localhost:5000" -ForegroundColor White
Write-Host "  HTTPS:   https://localhost:5001" -ForegroundColor White
Write-Host "  Swagger: http://localhost:5000/swagger" -ForegroundColor White
Write-Host "  Health:  http://localhost:5000/health" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el API" -ForegroundColor Yellow
Write-Host ""
Write-Host "Logs del API:" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray

try {
    Push-Location "src/ePrescription.API"
    & "$dotnetPath\dotnet.exe" run --no-build --configuration Release
}
catch {
    Write-Host ""
    Write-Host "API detenido" -ForegroundColor Yellow
}
finally {
    Pop-Location
    Pop-Location
}
