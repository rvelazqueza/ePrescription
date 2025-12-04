# Script para probar el Health Check del sistema

Write-Host "=== Probando Health Check del Sistema ===" -ForegroundColor Cyan
Write-Host ""

# Función para obtener token
function Get-AuthToken {
    try {
        Write-Host "Obteniendo token de autenticación..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "http://localhost:8080/realms/eprescription/protocol/openid-connect/token" `
            -Method Post `
            -ContentType "application/x-www-form-urlencoded" `
            -Body "grant_type=password&client_id=eprescription-app&client_secret=your-client-secret&username=doctor1&password=Doctor123!"
        
        Write-Host "✓ Token obtenido exitosamente" -ForegroundColor Green
        return $response.access_token
    }
    catch {
        Write-Host "✗ Error obteniendo token: $_" -ForegroundColor Red
        return $null
    }
}

# Función para probar health check
function Test-HealthCheck {
    param($token)
    
    try {
        Write-Host "Probando endpoint de Health Check..." -ForegroundColor Yellow
        
        $headers = @{ "Authorization" = "Bearer $token" }
        $response = Invoke-RestMethod -Uri "http://localhost:8000/api/health" -Headers $headers
        
        Write-Host "✓ Health Check exitoso" -ForegroundColor Green
        Write-Host ""
        
        # Mostrar resultados
        Write-Host "=== Resultados del Health Check ===" -ForegroundColor Cyan
        Write-Host "Timestamp: $($response.timestamp)" -ForegroundColor Gray
        Write-Host "Status General: $($response.status)" -ForegroundColor $(if($response.status -eq 'healthy') {'Green'} else {'Red'})
        Write-Host ""
        
        # Database check
        if ($response.checks.database) {
            $db = $response.checks.database
            Write-Host "📊 Base de Datos:" -ForegroundColor White
            Write-Host "   Status: $($db.status)" -ForegroundColor $(if($db.status -eq 'healthy') {'Green'} else {'Red'})
            Write-Host "   Tiempo de respuesta: $($db.responseTime)ms" -ForegroundColor Gray
            Write-Host "   Mensaje: $($db.message)" -ForegroundColor Gray
            Write-Host ""
        }
        
        # API check
        if ($response.checks.api) {
            $api = $response.checks.api
            Write-Host "🔌 API Sistema:" -ForegroundColor White
            Write-Host "   Status: $($api.status)" -ForegroundColor $(if($api.status -eq 'healthy') {'Green'} else {'Red'})
            Write-Host "   Versión: $($api.version)" -ForegroundColor Gray
            Write-Host "   Mensaje: $($api.message)" -ForegroundColor Gray
            Write-Host ""
        }
        
        # Memory check
        if ($response.checks.memory) {
            $memory = $response.checks.memory
            Write-Host "💾 Memoria Sistema:" -ForegroundColor White
            Write-Host "   Status: $($memory.status)" -ForegroundColor $(if($memory.status -eq 'healthy') {'Green'} elseif($memory.status -eq 'warning') {'Yellow'} else {'Red'})
            Write-Host "   Uso de memoria: $($memory.memoryUsageMB)MB" -ForegroundColor Gray
            Write-Host "   Salud: $($memory.healthPercentage)%" -ForegroundColor Gray
            Write-Host "   Mensaje: $($memory.message)" -ForegroundColor Gray
            Write-Host ""
        }
        
        # Response time check
        if ($response.checks.responseTime) {
            $rt = $response.checks.responseTime
            Write-Host "⚡ Tiempo de Respuesta:" -ForegroundColor White
            Write-Host "   Status: $($rt.status)" -ForegroundColor $(if($rt.status -eq 'healthy') {'Green'} elseif($rt.status -eq 'warning') {'Yellow'} else {'Red'})
            Write-Host "   Tiempo: $($rt.responseTimeMs)ms" -ForegroundColor Gray
            Write-Host "   Mensaje: $($rt.message)" -ForegroundColor Gray
            Write-Host ""
        }
        
        return $true
    }
    catch {
        Write-Host "✗ Error en Health Check: $_" -ForegroundColor Red
        Write-Host "   Detalles: $($_.Exception.Message)" -ForegroundColor Gray
        return $false
    }
}

# Ejecutar prueba
$token = Get-AuthToken

if ($token) {
    Write-Host ""
    Test-HealthCheck $token
} else {
    Write-Host "No se pudo obtener el token. Verifica que Keycloak esté funcionando." -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Instrucciones ===" -ForegroundColor Cyan
Write-Host "1. Si ves errores, verifica que el backend esté corriendo" -ForegroundColor Gray
Write-Host "2. El Health Check ahora se muestra en tiempo real en el Dashboard" -ForegroundColor Gray
Write-Host "3. Los datos se actualizan automáticamente cada vez que cargas el Dashboard" -ForegroundColor Gray
Write-Host ""
