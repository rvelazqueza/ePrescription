# Script para volver a desarrollo con Docker
# Inicia todo en Docker (infraestructura + API)

Write-Host "=== DESARROLLO DOCKER - EPRESCRIPTION ===" -ForegroundColor Cyan
Write-Host ""

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

# Iniciar todos los servicios
Write-Host ""
Write-Host "Iniciando servicios Docker..." -ForegroundColor Yellow
Write-Host "  - Oracle Database" -ForegroundColor Gray
Write-Host "  - Keycloak" -ForegroundColor Gray
Write-Host "  - API Backend" -ForegroundColor Gray

docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR iniciando Docker" -ForegroundColor Red
    exit 1
}

Write-Host "  Servicios iniciados" -ForegroundColor Green

# Esperar servicios
Write-Host ""
Write-Host "Esperando servicios (15 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Verificar estado
Write-Host ""
Write-Host "Estado de servicios:" -ForegroundColor Cyan
docker ps --filter "name=eprescription" --format "  {{.Names}}: {{.Status}}"

Write-Host ""
Write-Host "=== LISTO ===" -ForegroundColor Green
Write-Host ""
Write-Host "URLs disponibles:" -ForegroundColor Yellow
Write-Host "  API: http://localhost:5000" -ForegroundColor White
Write-Host "  Swagger: http://localhost:5000/swagger" -ForegroundColor White
Write-Host "  Keycloak: http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "Ver logs del API:" -ForegroundColor Cyan
Write-Host "  docker logs -f eprescription-backend-api" -ForegroundColor White
Write-Host ""
