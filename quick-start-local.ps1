# Script de inicio rapido para desarrollo local
# Hace todo automaticamente

Write-Host "=== INICIO RAPIDO - DESARROLLO LOCAL ===" -ForegroundColor Cyan
Write-Host ""

# Fix PATH
$env:PATH = "C:\Program Files\dotnet;" + $env:PATH

# 1. Verificar .NET
Write-Host "[1/6] Verificando .NET..." -ForegroundColor Yellow
try {
    $dotnetVersion = & dotnet --version
    Write-Host "      .NET $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "      ERROR: .NET no encontrado" -ForegroundColor Red
    Write-Host "      Ejecuta: winget install Microsoft.DotNet.SDK.8" -ForegroundColor Yellow
    exit 1
}

# 2. Verificar Docker
Write-Host "[2/6] Verificando Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "      Docker OK" -ForegroundColor Green
} catch {
    Write-Host "      ERROR: Docker no encontrado" -ForegroundColor Red
    exit 1
}

# 3. Iniciar infraestructura
Write-Host "[3/6] Iniciando infraestructura..." -ForegroundColor Yellow
docker-compose up -d oracle-db keycloak | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "      Infraestructura iniciada" -ForegroundColor Green
} else {
    Write-Host "      ERROR iniciando infraestructura" -ForegroundColor Red
    exit 1
}

# 4. Esperar servicios
Write-Host "[4/6] Esperando servicios (15s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15
Write-Host "      Servicios listos" -ForegroundColor Green

# 5. Detener API en Docker si existe
Write-Host "[5/6] Verificando puerto 5000..." -ForegroundColor Yellow
$apiContainer = docker ps --filter "name=eprescription-backend-api" --format "{{.Names}}"
if ($apiContainer) {
    docker stop eprescription-backend-api | Out-Null
    Write-Host "      API Docker detenido" -ForegroundColor Green
} else {
    Write-Host "      Puerto libre" -ForegroundColor Green
}

# 6. Compilar
Write-Host "[6/6] Compilando proyecto..." -ForegroundColor Yellow
Set-Location "eprescription-API"
dotnet build EPrescription.sln --configuration Debug --verbosity quiet | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "      Compilacion exitosa" -ForegroundColor Green
} else {
    Write-Host "      ERROR compilando" -ForegroundColor Red
    Set-Location ".."
    exit 1
}

# Configurar ambiente
$env:ASPNETCORE_ENVIRONMENT = "Local"

Write-Host ""
Write-Host "=== INICIANDO API ===" -ForegroundColor Green
Write-Host ""
Write-Host "Ambiente: Local" -ForegroundColor Gray
Write-Host ""
Write-Host "URLs:" -ForegroundColor Cyan
Write-Host "  API:     http://localhost:5000" -ForegroundColor White
Write-Host "  Swagger: http://localhost:5000/swagger" -ForegroundColor White
Write-Host "  Health:  http://localhost:5000/health" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Gray
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

# Iniciar API con hot reload
dotnet watch run --project src/ePrescription.API --urls http://localhost:5000

# Cleanup
Set-Location ".."
