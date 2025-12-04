# Script para iniciar todo el stack con Docker
# Esto evita problemas de configuración local de .NET

Write-Host "=== Iniciando ePrescription Stack con Docker ===" -ForegroundColor Cyan
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

# Detener contenedores existentes
Write-Host "`nDeteniendo contenedores existentes..." -ForegroundColor Yellow
docker-compose down

# Construir imágenes
Write-Host "`nConstruyendo imágenes Docker..." -ForegroundColor Yellow
docker-compose build --no-cache backend-api

# Iniciar servicios
Write-Host "`nIniciando servicios..." -ForegroundColor Yellow
docker-compose up -d

# Esperar a que los servicios estén listos
Write-Host "`nEsperando a que los servicios estén listos..." -ForegroundColor Yellow
Write-Host "  - Oracle Database (puede tardar 1-2 minutos)..." -ForegroundColor Cyan
Start-Sleep -Seconds 60

Write-Host "  - Keycloak (puede tardar 1-2 minutos)..." -ForegroundColor Cyan
Start-Sleep -Seconds 60

Write-Host "  - Backend API (puede tardar 30 segundos)..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

# Verificar estado de los servicios
Write-Host "`n=== Estado de los Servicios ===" -ForegroundColor Cyan
docker-compose ps

Write-Host "`n=== URLs de Acceso ===" -ForegroundColor Cyan
Write-Host "  - Backend API: http://localhost:5000" -ForegroundColor Green
Write-Host "  - Swagger UI: http://localhost:5000/swagger" -ForegroundColor Green
Write-Host "  - Keycloak Admin: http://localhost:8080 (admin/admin123)" -ForegroundColor Green
Write-Host "  - Oracle Database: localhost:1521/XEPDB1" -ForegroundColor Green

Write-Host "`n=== Comandos Útiles ===" -ForegroundColor Cyan
Write-Host "  Ver logs del API: docker-compose logs -f backend-api" -ForegroundColor Yellow
Write-Host "  Ver logs de Keycloak: docker-compose logs -f keycloak" -ForegroundColor Yellow
Write-Host "  Ver logs de Oracle: docker-compose logs -f oracle-db" -ForegroundColor Yellow
Write-Host "  Detener todo: docker-compose down" -ForegroundColor Yellow
Write-Host "  Reiniciar API: docker-compose restart backend-api" -ForegroundColor Yellow

Write-Host "`n=== Probando Backend API ===" -ForegroundColor Cyan
Start-Sleep -Seconds 5
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Backend API está respondiendo correctamente" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ Backend API aún no está listo. Verifica los logs con: docker-compose logs backend-api" -ForegroundColor Yellow
}

Write-Host "`n¡Stack iniciado! Ahora puedes ejecutar las pruebas de autorización." -ForegroundColor Green
