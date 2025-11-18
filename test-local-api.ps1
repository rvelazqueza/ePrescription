# Script para probar el API local
Write-Host "=== PROBANDO API LOCAL ===" -ForegroundColor Cyan
Write-Host ""

# Fix PATH
$env:PATH = "C:\Program Files\dotnet;" + $env:PATH

# Verificar que la infraestructura esté corriendo
Write-Host "Verificando infraestructura Docker..." -ForegroundColor Yellow

$oracleRunning = docker ps --filter "name=eprescription-oracle-db" --filter "status=running" --format "{{.Names}}"
$keycloakRunning = docker ps --filter "name=eprescription-keycloak" --filter "status=running" --format "{{.Names}}"

if (-not $oracleRunning) {
    Write-Host "  ERROR: Oracle no esta corriendo" -ForegroundColor Red
    Write-Host "  Ejecuta: docker-compose up -d oracle-db" -ForegroundColor Yellow
    exit 1
}

if (-not $keycloakRunning) {
    Write-Host "  ERROR: Keycloak no esta corriendo" -ForegroundColor Red
    Write-Host "  Ejecuta: docker-compose up -d keycloak" -ForegroundColor Yellow
    exit 1
}

Write-Host "  Oracle: Corriendo" -ForegroundColor Green
Write-Host "  Keycloak: Corriendo" -ForegroundColor Green

# Verificar conectividad a Oracle
Write-Host ""
Write-Host "Probando conexion a Oracle..." -ForegroundColor Yellow
try {
    $oracleTest = Test-NetConnection -ComputerName localhost -Port 1521 -WarningAction SilentlyContinue
    if ($oracleTest.TcpTestSucceeded) {
        Write-Host "  Oracle puerto 1521: Accesible" -ForegroundColor Green
    } else {
        Write-Host "  Oracle puerto 1521: No accesible" -ForegroundColor Red
    }
} catch {
    Write-Host "  No se pudo probar Oracle" -ForegroundColor Yellow
}

# Verificar conectividad a Keycloak
Write-Host ""
Write-Host "Probando conexion a Keycloak..." -ForegroundColor Yellow
try {
    $keycloakTest = Invoke-WebRequest -Uri "http://localhost:8080" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($keycloakTest.StatusCode -eq 200) {
        Write-Host "  Keycloak: Accesible" -ForegroundColor Green
    } else {
        Write-Host "  Keycloak: No responde correctamente" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  Keycloak: No accesible" -ForegroundColor Red
}

# Compilar proyecto
Write-Host ""
Write-Host "Compilando proyecto..." -ForegroundColor Yellow
Set-Location "eprescription-API"
$buildOutput = dotnet build EPrescription.sln --configuration Debug --verbosity quiet 2>&1
$buildExitCode = $LASTEXITCODE

if ($buildExitCode -eq 0) {
    Write-Host "  Compilacion: Exitosa" -ForegroundColor Green
} else {
    Write-Host "  Compilacion: Fallida" -ForegroundColor Red
    Write-Host $buildOutput
    Set-Location ".."
    exit 1
}

# Verificar archivo de configuracion
Write-Host ""
Write-Host "Verificando configuracion..." -ForegroundColor Yellow
if (Test-Path "src/ePrescription.API/appsettings.Local.json") {
    Write-Host "  appsettings.Local.json: Existe" -ForegroundColor Green
} else {
    Write-Host "  appsettings.Local.json: No existe" -ForegroundColor Red
}

Set-Location ".."

Write-Host ""
Write-Host "=== RESUMEN ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Todo listo para iniciar el API local" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar:" -ForegroundColor Yellow
Write-Host "  .\start-dev-local.ps1" -ForegroundColor White
Write-Host ""
