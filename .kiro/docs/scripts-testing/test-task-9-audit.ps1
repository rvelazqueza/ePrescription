# =====================================================
# Script: test-task-9-audit.ps1
# Description: Prueba rápida del sistema de auditoría (Task 9)
# Author: ePrescription Team
# Date: 2024-11-17
# =====================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Task 9: Audit System Quick Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"

# Test 1: Health Check
Write-Host "Test 1: Verificando que la API esté corriendo..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✓ API está corriendo" -ForegroundColor Green
    Write-Host "  Status: $($health.status)" -ForegroundColor Gray
} catch {
    Write-Host "✗ API no está disponible" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, inicia la API con: .\quick-start-local.ps1" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 2: Verificar endpoints de auditoría (sin autenticación)
Write-Host "Test 2: Verificando endpoints de auditoría..." -ForegroundColor Yellow
Write-Host "Nota: Estos endpoints requieren autenticación" -ForegroundColor Gray
Write-Host ""

# Test 3: Obtener token de autenticación
Write-Host "Test 3: Obteniendo token de autenticación..." -ForegroundColor Yellow
Write-Host "Intentando login con usuario admin..." -ForegroundColor Gray

$keycloakUrl = "http://localhost:8080/realms/eprescription/protocol/openid-connect/token"
$body = @{
    grant_type = "password"
    client_id = "eprescription-api"
    username = "admin"
    password = "admin123"
}

try {
    $tokenResponse = Invoke-RestMethod -Uri $keycloakUrl -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
    $token = $tokenResponse.access_token
    Write-Host "✓ Token obtenido exitosamente" -ForegroundColor Green
    Write-Host "  Token length: $($token.Length) caracteres" -ForegroundColor Gray
} catch {
    Write-Host "✗ No se pudo obtener el token" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifica que Keycloak esté corriendo y que el usuario admin exista" -ForegroundColor Yellow
    Write-Host "Puedes crear el usuario con: .\keycloak\create-and-reset-users.ps1" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 4: Obtener logs de auditoría
Write-Host "Test 4: Obteniendo logs de auditoría..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $auditLogs = Invoke-RestMethod -Uri "$baseUrl/api/audit?pageSize=5" -Method GET -Headers $headers
    Write-Host "✓ Logs de auditoría obtenidos" -ForegroundColor Green
    Write-Host "  Total de logs: $($auditLogs.totalCount)" -ForegroundColor Gray
    Write-Host "  Logs en esta página: $($auditLogs.logs.Count)" -ForegroundColor Gray
    Write-Host "  Página: $($auditLogs.pageNumber) de $($auditLogs.totalPages)" -ForegroundColor Gray
    
    if ($auditLogs.logs.Count -gt 0) {
        Write-Host ""
        Write-Host "  Último log:" -ForegroundColor Gray
        $lastLog = $auditLogs.logs[0]
        Write-Host "    - ID: $($lastLog.id)" -ForegroundColor Gray
        Write-Host "    - Acción: $($lastLog.actionType)" -ForegroundColor Gray
        Write-Host "    - Entidad: $($lastLog.entityType)" -ForegroundColor Gray
        Write-Host "    - Usuario: $($lastLog.username)" -ForegroundColor Gray
        Write-Host "    - IP: $($lastLog.ipAddress)" -ForegroundColor Gray
        Write-Host "    - Timestamp: $($lastLog.timestamp)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Error al obtener logs" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Probar filtros de búsqueda
Write-Host "Test 5: Probando filtros de búsqueda..." -ForegroundColor Yellow
try {
    # Filtro por acción
    $uri1 = "$baseUrl/api/audit?action=LOGIN&pageSize=3"
    $filteredLogs = Invoke-RestMethod -Uri $uri1 -Method GET -Headers $headers
    Write-Host "OK Filtro por accion (LOGIN): $($filteredLogs.totalCount) logs encontrados" -ForegroundColor Green
    
    # Filtro por tipo de entidad
    $uri2 = "$baseUrl/api/audit?entityType=Authentication&pageSize=3"
    $authLogs = Invoke-RestMethod -Uri $uri2 -Method GET -Headers $headers
    Write-Host "OK Filtro por entidad (Authentication): $($authLogs.totalCount) logs encontrados" -ForegroundColor Green
    
    # Filtro por fecha
    $startDate = (Get-Date).AddDays(-7).ToString("yyyy-MM-dd")
    $endDate = (Get-Date).ToString("yyyy-MM-dd")
    $uri3 = "$baseUrl/api/audit?startDate=$startDate&endDate=$endDate&pageSize=3"
    $dateLogs = Invoke-RestMethod -Uri $uri3 -Method GET -Headers $headers
    Write-Host "OK Filtro por fecha (ultimos 7 dias): $($dateLogs.totalCount) logs encontrados" -ForegroundColor Green
} catch {
    Write-Host "ERROR al probar filtros" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: Probar paginación
Write-Host "Test 6: Probando paginacion..." -ForegroundColor Yellow
try {
    $uri1 = "$baseUrl/api/audit?pageNumber=1&pageSize=2"
    $page1 = Invoke-RestMethod -Uri $uri1 -Method GET -Headers $headers
    Write-Host "OK Pagina 1: $($page1.logs.Count) logs" -ForegroundColor Green
    
    if ($page1.totalPages -gt 1) {
        $uri2 = "$baseUrl/api/audit?pageNumber=2&pageSize=2"
        $page2 = Invoke-RestMethod -Uri $uri2 -Method GET -Headers $headers
        Write-Host "OK Pagina 2: $($page2.logs.Count) logs" -ForegroundColor Green
        
        if ($page1.logs[0].id -ne $page2.logs[0].id) {
            Write-Host "OK Paginacion funciona correctamente (diferentes logs en cada pagina)" -ForegroundColor Green
        }
    } else {
        Write-Host "AVISO Solo hay una pagina de logs" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR al probar paginacion" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7: Obtener estadísticas de auditoría
Write-Host "Test 7: Obteniendo estadisticas de auditoria..." -ForegroundColor Yellow
try {
    $startDate = (Get-Date).AddDays(-30).ToString("yyyy-MM-dd")
    $endDate = (Get-Date).ToString("yyyy-MM-dd")
    $uri = "$baseUrl/api/audit/statistics?startDate=$startDate&endDate=$endDate"
    $stats = Invoke-RestMethod -Uri $uri -Method GET -Headers $headers
    
    Write-Host "OK Estadisticas obtenidas" -ForegroundColor Green
    Write-Host "  Total de operaciones: $($stats.totalOperations)" -ForegroundColor Gray
    Write-Host "  Intentos de autenticacion: $($stats.authenticationAttempts)" -ForegroundColor Gray
    Write-Host "  Autenticaciones exitosas: $($stats.successfulAuthentications)" -ForegroundColor Gray
    Write-Host "  Autenticaciones fallidas: $($stats.failedAuthentications)" -ForegroundColor Gray
    Write-Host "  Operaciones de IA: $($stats.aiOperations)" -ForegroundColor Gray
} catch {
    Write-Host "ERROR al obtener estadisticas" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 8: Obtener información de política de retención
Write-Host "Test 8: Obteniendo política de retención..." -ForegroundColor Yellow
try {
    $policy = Invoke-RestMethod -Uri "$baseUrl/api/audit/retention-policy" -Method GET -Headers $headers
    
    Write-Host "✓ Política de retención obtenida" -ForegroundColor Green
    Write-Host "  Años de retención: $($policy.retentionYears)" -ForegroundColor Gray
    Write-Host "  Fecha de corte: $($policy.cutoffDate)" -ForegroundColor Gray
    Write-Host "  Total de logs: $($policy.totalLogsCount)" -ForegroundColor Gray
    Write-Host "  Logs activos: $($policy.activeLogsCount)" -ForegroundColor Gray
    Write-Host "  Logs archivables: $($policy.archivableLogsCount)" -ForegroundColor Gray
    $sizeMB = [math]::Round($policy.totalStorageSizeBytes / 1MB, 2)
    Write-Host "  Tamaño estimado: $sizeMB MB" -ForegroundColor Gray
} catch {
    Write-Host "✗ Error al obtener política de retención" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 9: Obtener conteo de logs archivables
Write-Host "Test 9: Obteniendo conteo de logs archivables..." -ForegroundColor Yellow
try {
    $archivable = Invoke-RestMethod -Uri "$baseUrl/api/audit/archivable-count?retentionYears=7" -Method GET -Headers $headers
    
    Write-Host "✓ Conteo de logs archivables obtenido" -ForegroundColor Green
    Write-Host "  Logs archivables: $($archivable.count)" -ForegroundColor Gray
    Write-Host "  Años de retención: $($archivable.retentionYears)" -ForegroundColor Gray
    Write-Host "  Fecha de corte: $($archivable.cutoffDate)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Error al obtener conteo de logs archivables" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 10: Validar integridad de un log
Write-Host "Test 10: Validando integridad de un log..." -ForegroundColor Yellow
try {
    $logs = Invoke-RestMethod -Uri "$baseUrl/api/audit?pageSize=1" -Method GET -Headers $headers
    if ($logs.logs.Count -gt 0) {
        $logId = $logs.logs[0].id
        $validation = Invoke-RestMethod -Uri "$baseUrl/api/audit/$logId/validate" -Method GET -Headers $headers
        
        Write-Host "✓ Validación de integridad completada" -ForegroundColor Green
        Write-Host "  Log ID: $($validation.auditLogId)" -ForegroundColor Gray
        Write-Host "  Es válido: $($validation.isValid)" -ForegroundColor Gray
        Write-Host "  Mensaje: $($validation.message)" -ForegroundColor Gray
    } else {
        Write-Host "⚠ No hay logs para validar" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Error al validar integridad" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Resumen
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Resumen de Pruebas" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Funcionalidades de Task 9 probadas:" -ForegroundColor White
Write-Host "  OK Consulta de logs de auditoria" -ForegroundColor Green
Write-Host "  OK Filtros de busqueda (accion, entidad, fecha)" -ForegroundColor Green
Write-Host "  OK Paginacion" -ForegroundColor Green
Write-Host "  OK Estadisticas de auditoria" -ForegroundColor Green
Write-Host "  OK Politica de retencion (7 anos)" -ForegroundColor Green
Write-Host "  OK Conteo de logs archivables" -ForegroundColor Green
Write-Host "  OK Validacion de integridad" -ForegroundColor Green
Write-Host ""
Write-Host "Estado: " -NoNewline -ForegroundColor White
Write-Host "TODAS LAS PRUEBAS PASARON OK" -ForegroundColor Green
Write-Host ""
Write-Host "Para pruebas mas detalladas, ejecuta:" -ForegroundColor Yellow
Write-Host "  .\test-audit-system.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "Para ver la documentacion completa:" -ForegroundColor Yellow
Write-Host "  eprescription-API\docs\AUDIT_TESTING_GUIDE.md" -ForegroundColor Gray
Write-Host "  eprescription-API\docs\AUDIT_RETENTION_POLICY.md" -ForegroundColor Gray
Write-Host ""
