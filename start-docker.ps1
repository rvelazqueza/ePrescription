# ePrescription - Script de Inicio Rápido con Docker
# Este script inicia todos los servicios del sistema usando Docker Compose

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ePrescription - Inicio con Docker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que Docker esté corriendo
Write-Host "Verificando Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker está corriendo" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker no está corriendo. Por favor inicia Docker Desktop." -ForegroundColor Red
    exit 1
}

# Verificar que existe el archivo .env
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "⚠️  Archivo .env no encontrado" -ForegroundColor Yellow
    Write-Host "Creando .env desde .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host ""
    Write-Host "✓ Archivo .env creado" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANTE: Edita el archivo .env y configura tus API keys antes de continuar." -ForegroundColor Yellow
    Write-Host "Presiona Enter cuando hayas configurado el archivo .env..."
    Read-Host
}

Write-Host ""
Write-Host "Iniciando servicios con Docker Compose..." -ForegroundColor Yellow
Write-Host ""

# Iniciar servicios
docker-compose up -d

Write-Host ""
Write-Host "Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar estado de los servicios
Write-Host ""
Write-Host "Estado de los servicios:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Servicios Disponibles" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Oracle Database:" -ForegroundColor Green
Write-Host "  Host: localhost:1521" -ForegroundColor White
Write-Host "  Service: XEPDB1" -ForegroundColor White
Write-Host "  Usuario: eprescription_user" -ForegroundColor White
Write-Host "  Password: EprescriptionPass123!" -ForegroundColor White
Write-Host ""
Write-Host "Keycloak Admin Console:" -ForegroundColor Green
Write-Host "  URL: http://localhost:8080" -ForegroundColor White
Write-Host "  Usuario: admin" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Backend API:" -ForegroundColor Green
Write-Host "  URL: http://localhost:8000" -ForegroundColor White
Write-Host "  Swagger: http://localhost:8000/swagger" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Comandos Útiles" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ver logs de todos los servicios:" -ForegroundColor Yellow
Write-Host "  docker-compose logs -f" -ForegroundColor White
Write-Host ""
Write-Host "Ver logs de un servicio específico:" -ForegroundColor Yellow
Write-Host "  docker-compose logs -f oracle-db" -ForegroundColor White
Write-Host "  docker-compose logs -f keycloak" -ForegroundColor White
Write-Host "  docker-compose logs -f eprescription-api" -ForegroundColor White
Write-Host ""
Write-Host "Detener todos los servicios:" -ForegroundColor Yellow
Write-Host "  docker-compose down" -ForegroundColor White
Write-Host ""
Write-Host "Reiniciar un servicio:" -ForegroundColor Yellow
Write-Host "  docker-compose restart eprescription-api" -ForegroundColor White
Write-Host ""
Write-Host "Reconstruir y reiniciar:" -ForegroundColor Yellow
Write-Host "  docker-compose build eprescription-api" -ForegroundColor White
Write-Host "  docker-compose up -d eprescription-api" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Sistema iniciado correctamente" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
