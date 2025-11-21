# Script para rebuild y reiniciar API en Docker
Write-Host "=== Rebuild API en Docker ===" -ForegroundColor Cyan

# 1. Build imagen
Write-Host "`n1. Building imagen..." -ForegroundColor Yellow
docker-compose build eprescription-api

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build falló" -ForegroundColor Red
    exit 1
}

# 2. Reiniciar contenedor
Write-Host "`n2. Reiniciando contenedor..." -ForegroundColor Yellow
docker-compose up -d eprescription-api

# 3. Esperar 10 segundos
Write-Host "`n3. Esperando que inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 4. Ver logs
Write-Host "`n4. Logs del API:" -ForegroundColor Yellow
docker logs --tail 50 eprescription-api

# 5. Verificar health
Write-Host "`n5. Verificando health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/swagger/index.html" -TimeoutSec 5 -UseBasicParsing
    Write-Host "✅ API respondiendo: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "`nSwagger: http://localhost:8000/swagger" -ForegroundColor Cyan
} catch {
    Write-Host "❌ API no responde aún" -ForegroundColor Red
    Write-Host "Ver logs: docker logs -f eprescription-api" -ForegroundColor Yellow
}
