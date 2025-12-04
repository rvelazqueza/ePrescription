# Script para iniciar desarrollo local
# Inicia infraestructura Docker y API .NET localmente

Write-Host "=== DESARROLLO LOCAL - EPRESCRIPTION ===" -ForegroundColor Cyan
Write-Host ""

# Fix PATH para .NET en esta sesión
$env:PATH = "C:\Program Files\dotnet;" + $env:PATH

# Verificar .NET
Write-Host "Verificando .NET SDK..." -ForegroundColor Yellow
try {
    $dotnetVersion = & dotnet --version
    Write-Host "  .NET SDK: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: .NET no encontrado" -ForegroundColor Red
    Write-Host "  Ejecuta: winget install Microsoft.DotNet.SDK.8" -ForegroundColor Yellow
    exit 1
}

# Verificar Docker
Write-Host "Verificando Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "  Docker disponible" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Docker no encontrado" -ForegroundColor Red
    Write-Host "  Inicia Docker Desktop" -ForegroundColor Yellow
    exit 1
}

# Verificar puerto 5000
Write-Host ""
Write-Host "Verificando puerto 5000..." -ForegroundColor Yellow
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    Write-Host "  Puerto 5000 esta en uso" -ForegroundColor Yellow
    
    # Verificar si es el contenedor Docker
    $apiContainer = docker ps --filter "name=eprescription-backend-api" --format "{{.Names}}"
    if ($apiContainer) {
        Write-Host "  Deteniendo API en Docker..." -ForegroundColor Yellow
        docker stop eprescription-backend-api | Out-Null
        Write-Host "  API en Docker detenido" -ForegroundColor Green
        Start-Sleep -Seconds 2
    } else {
        Write-Host "  ADVERTENCIA: Otro proceso esta usando el puerto 5000" -ForegroundColor Red
        Write-Host "  Detener el proceso o cambiar el puerto" -ForegroundColor Yellow
    }
} else {
    Write-Host "  Puerto 5000 disponible" -ForegroundColor Green
}

# Iniciar infraestructura Docker
Write-Host ""
Write-Host "Iniciando infraestructura Docker..." -ForegroundColor Yellow
Write-Host "  - Oracle Database" -ForegroundColor Gray
Write-Host "  - Keycloak" -ForegroundColor Gray

docker-compose up -d oracle-db keycloak

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR iniciando Docker" -ForegroundColor Red
    exit 1
}

Write-Host "  Infraestructura iniciada" -ForegroundColor Green

# Esperar servicios
Write-Host ""
Write-Host "Esperando servicios (15 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Compilar proyecto
Write-Host ""
Write-Host "Compilando proyecto..." -ForegroundColor Yellow
Set-Location "eprescription-API"
dotnet build EPrescription.sln --configuration Debug --verbosity quiet

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR compilando" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

Write-Host "  Proyecto compilado" -ForegroundColor Green

# Configurar ambiente para desarrollo local
$env:ASPNETCORE_ENVIRONMENT = "Local"

# Iniciar API
Write-Host ""
Write-Host "=== INICIANDO API ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ambiente: Local" -ForegroundColor Gray
Write-Host "Configuracion: appsettings.Local.json" -ForegroundColor Gray
Write-Host ""
Write-Host "URLs disponibles:" -ForegroundColor Yellow
Write-Host "  API: http://localhost:5000" -ForegroundColor White
Write-Host "  Swagger: http://localhost:5000/swagger" -ForegroundColor White
Write-Host "  Health: http://localhost:5000/health" -ForegroundColor White
Write-Host "  Keycloak: http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Gray
Write-Host ""

# Ejecutar API con hot reload
dotnet watch run --project src/ePrescription.API --urls http://localhost:5000

# Cleanup al salir
Set-Location ".."
