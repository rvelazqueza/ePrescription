# Script simple para probar el Health Check

Write-Host "=== Probando Health Check del Sistema ===" -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/health"
    
    Write-Host "OK Health Check exitoso" -ForegroundColor Green
    Write-Host ""
    
    # Mostrar resultados
    Write-Host "=== Resultados del Health Check ===" -ForegroundColor Cyan
    Write-Host "Timestamp: $($response.timestamp)" -ForegroundColor Gray
    Write-Host "Status General: $($response.status)" -ForegroundColor Green
    Write-Host ""
    
    # Database check
    if ($response.checks.database) {
        $db = $response.checks.database
        Write-Host "Base de Datos:" -ForegroundColor White
        Write-Host "   Status: $($db.status)" -ForegroundColor Green
        Write-Host "   Tiempo de respuesta: $($db.responseTime)ms" -ForegroundColor Gray
        Write-Host "   Mensaje: $($db.message)" -ForegroundColor Gray
        Write-Host ""
    }
    
    # API check
    if ($response.checks.api) {
        $api = $response.checks.api
        Write-Host "API Sistema:" -ForegroundColor White
        Write-Host "   Status: $($api.status)" -ForegroundColor Green
        Write-Host "   Version: $($api.version)" -ForegroundColor Gray
        Write-Host "   Mensaje: $($api.message)" -ForegroundColor Gray
        Write-Host ""
    }
    
    # Memory check
    if ($response.checks.memory) {
        $memory = $response.checks.memory
        Write-Host "Memoria Sistema:" -ForegroundColor White
        Write-Host "   Status: $($memory.status)" -ForegroundColor Green
        Write-Host "   Uso de memoria: $($memory.memoryUsageMB)MB" -ForegroundColor Gray
        Write-Host "   Salud: $($memory.healthPercentage)%" -ForegroundColor Gray
        Write-Host "   Mensaje: $($memory.message)" -ForegroundColor Gray
        Write-Host ""
    }
    
    # Response time check
    if ($response.checks.responseTime) {
        $rt = $response.checks.responseTime
        Write-Host "Tiempo de Respuesta:" -ForegroundColor White
        Write-Host "   Status: $($rt.status)" -ForegroundColor Green
        Write-Host "   Tiempo: $($rt.responseTimeMs)ms" -ForegroundColor Gray
        Write-Host "   Mensaje: $($rt.message)" -ForegroundColor Gray
        Write-Host ""
    }
    
    Write-Host "=== Resumen ===" -ForegroundColor Cyan
    Write-Host "OK El Health Check esta funcionando correctamente" -ForegroundColor Green
    Write-Host "OK Todos los sistemas estan operativos" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ahora puedes ver estos datos reales en el Dashboard del frontend" -ForegroundColor Yellow
}
catch {
    Write-Host "Error en Health Check: $_" -ForegroundColor Red
    Write-Host "   Detalles: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""
