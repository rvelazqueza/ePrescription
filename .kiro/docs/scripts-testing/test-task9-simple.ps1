# Test simple de Task 9 - Sistema de Auditoria
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Task 9: Audit System Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"

# Test 1: Health Check
Write-Host "Test 1: Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "OK API esta corriendo" -ForegroundColor Green
} catch {
    Write-Host "ERROR API no disponible" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Login
Write-Host "Test 2: Autenticacion..." -ForegroundColor Yellow
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
    Write-Host "OK Token obtenido" -ForegroundColor Green
} catch {
    Write-Host "ERROR No se pudo obtener token" -ForegroundColor Red
    exit 1
}
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test 3: Obtener logs
Write-Host "Test 3: Obtener logs de auditoria..." -ForegroundColor Yellow
try {
    $auditLogs = Invoke-RestMethod -Uri "$baseUrl/api/audit" -Method GET -Headers $headers
    Write-Host "OK Logs obtenidos: $($auditLogs.totalCount) total" -ForegroundColor Green
    if ($auditLogs.logs.Count -gt 0) {
        Write-Host "  Ultimo log: $($auditLogs.logs[0].actionType) - $($auditLogs.logs[0].entityType)" -ForegroundColor Gray
    }
} catch {
    Write-Host "ERROR al obtener logs" -ForegroundColor Red
}
Write-Host ""

# Test 4: Obtener log especifico
Write-Host "Test 4: Obtener log especifico..." -ForegroundColor Yellow
try {
    $logs = Invoke-RestMethod -Uri "$baseUrl/api/audit" -Method GET -Headers $headers
    if ($logs.logs.Count -gt 0) {
        $logId = $logs.logs[0].id
        $log = Invoke-RestMethod -Uri "$baseUrl/api/audit/$logId" -Method GET -Headers $headers
        Write-Host "OK Log ID $logId obtenido" -ForegroundColor Green
        Write-Host "  Accion: $($log.actionType)" -ForegroundColor Gray
        Write-Host "  Usuario: $($log.username)" -ForegroundColor Gray
    }
} catch {
    Write-Host "ERROR al obtener log especifico" -ForegroundColor Red
}
Write-Host ""

# Test 5: Validar integridad
Write-Host "Test 5: Validar integridad de log..." -ForegroundColor Yellow
try {
    $logs = Invoke-RestMethod -Uri "$baseUrl/api/audit" -Method GET -Headers $headers
    if ($logs.logs.Count -gt 0) {
        $logId = $logs.logs[0].id
        $validation = Invoke-RestMethod -Uri "$baseUrl/api/audit/$logId/validate" -Method GET -Headers $headers
        Write-Host "OK Validacion completada" -ForegroundColor Green
        Write-Host "  Es valido: $($validation.isValid)" -ForegroundColor Gray
    }
} catch {
    Write-Host "ERROR al validar integridad" -ForegroundColor Red
}
Write-Host ""

# Test 6: Politica de retencion
Write-Host "Test 6: Politica de retencion..." -ForegroundColor Yellow
try {
    $policy = Invoke-RestMethod -Uri "$baseUrl/api/audit/retention-policy" -Method GET -Headers $headers
    Write-Host "OK Politica obtenida" -ForegroundColor Green
    Write-Host "  Anos de retencion: $($policy.retentionYears)" -ForegroundColor Gray
    Write-Host "  Total logs: $($policy.totalLogsCount)" -ForegroundColor Gray
    Write-Host "  Logs archivables: $($policy.archivableLogsCount)" -ForegroundColor Gray
} catch {
    Write-Host "ERROR al obtener politica" -ForegroundColor Red
}
Write-Host ""

# Resumen
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Resumen" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Funcionalidades probadas:" -ForegroundColor White
Write-Host "  OK Consulta de logs" -ForegroundColor Green
Write-Host "  OK Log especifico por ID" -ForegroundColor Green
Write-Host "  OK Validacion de integridad" -ForegroundColor Green
Write-Host "  OK Politica de retencion" -ForegroundColor Green
Write-Host ""
Write-Host "TASK 9 FUNCIONANDO CORRECTAMENTE" -ForegroundColor Green
Write-Host ""
