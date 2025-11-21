# Script para probar creacion de prescripcion y verificar logs de auditoria

$KEYCLOAK_URL = "http://localhost:8080"
$API_URL = "http://localhost:8000"
$REALM = "eprescription"
$CLIENT_ID = "eprescription-api"
$CLIENT_SECRET = "Q7frqJfqjUaU73rKni061qpE9KDrbGL0"

Write-Host "=== Prueba Completa: Prescripcion + Auditoria ===" -ForegroundColor Cyan
Write-Host ""

# 1. Obtener token de doctor
Write-Host "1. Obteniendo token de doctor1..." -ForegroundColor Yellow
try {
    $tokenResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/$REALM/protocol/openid-connect/token" `
        -Method Post `
        -ContentType "application/x-www-form-urlencoded" `
        -Body @{
            username = "doctor1"
            password = "doctor123"
            grant_type = "password"
            client_id = $CLIENT_ID
            client_secret = $CLIENT_SECRET
            scope = "openid profile email"
        }
    
    $token = $tokenResponse.access_token
    Write-Host "   Token obtenido exitosamente" -ForegroundColor Green
} catch {
    Write-Host "   Error obteniendo token: $_" -ForegroundColor Red
    exit 1
}

# 2. Crear una prescripcion
Write-Host ""
Write-Host "2. Creando prescripcion de prueba..." -ForegroundColor Yellow

$prescription = @{
    patientId = 1
    doctorId = 1
    prescriptionDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    diagnosis = "Prueba automatizada - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    notes = "Esta es una prescripcion de prueba para verificar auditoria"
    medications = @(
        @{
            medicationId = 1
            dosage = "500mg"
            frequency = "Cada 8 horas"
            duration = "7 dias"
            instructions = "Tomar con alimentos"
        }
    )
    diagnoses = @(
        @{
            cie10Code = "J00"
            description = "Resfriado comun"
            isPrimary = $true
        }
    )
} | ConvertTo-Json -Depth 5

try {
    $headers = @{
        Authorization = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $created = Invoke-RestMethod -Uri "$API_URL/api/prescriptions" `
        -Method Post `
        -Headers $headers `
        -Body $prescription
    
    Write-Host "   Prescripcion creada exitosamente!" -ForegroundColor Green
    Write-Host "   ID: $($created.id)" -ForegroundColor Gray
    Write-Host "   Numero: $($created.prescriptionNumber)" -ForegroundColor Gray
    
    $prescriptionId = $created.id
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "   Error creando prescripcion: Status $statusCode" -ForegroundColor Red
    
    try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Detalles: $errorBody" -ForegroundColor Red
    } catch {}
    
    exit 1
}

# 3. Leer la prescripcion creada
Write-Host ""
Write-Host "3. Leyendo prescripcion creada..." -ForegroundColor Yellow
try {
    $retrieved = Invoke-RestMethod -Uri "$API_URL/api/prescriptions/$prescriptionId" `
        -Method Get `
        -Headers $headers
    
    Write-Host "   Prescripcion leida exitosamente" -ForegroundColor Green
    Write-Host "   Diagnostico: $($retrieved.diagnosis)" -ForegroundColor Gray
} catch {
    Write-Host "   Error leyendo prescripcion" -ForegroundColor Red
}

# 4. Actualizar la prescripcion
Write-Host ""
Write-Host "4. Actualizando prescripcion..." -ForegroundColor Yellow

$update = @{
    diagnosis = "Diagnostico actualizado - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    notes = "Notas actualizadas"
} | ConvertTo-Json

try {
    $updated = Invoke-RestMethod -Uri "$API_URL/api/prescriptions/$prescriptionId" `
        -Method Put `
        -Headers $headers `
        -Body $update
    
    Write-Host "   Prescripcion actualizada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "   Error actualizando prescripcion" -ForegroundColor Red
}

# 5. Verificar logs de auditoria en Oracle
Write-Host ""
Write-Host "5. Verificando logs de auditoria en Oracle..." -ForegroundColor Yellow

$query = @"
SELECT 
    ACTION_TYPE,
    TABLE_NAME,
    USER_ID,
    TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') as CREATED_AT
FROM EPRESCRIPTION.AUDIT_LOGS
WHERE CREATED_AT > SYSDATE - 1/24
ORDER BY CREATED_AT DESC
FETCH FIRST 10 ROWS ONLY;
"@

try {
    Write-Host "   Ejecutando query en Oracle..." -ForegroundColor Gray
    
    # Nota: Este comando puede no funcionar en Windows PowerShell
    # Es mejor verificar manualmente con SQL Developer
    Write-Host "   Para verificar manualmente, ejecuta:" -ForegroundColor Yellow
    Write-Host "   docker exec -it oracle-db sqlplus eprescription/eprescription@//localhost:1521/XEPDB1" -ForegroundColor White
    Write-Host "   Luego ejecuta:" -ForegroundColor Yellow
    Write-Host "   $query" -ForegroundColor White
} catch {
    Write-Host "   No se pudo ejecutar query automaticamente" -ForegroundColor Yellow
}

# 6. Intentar obtener logs desde el API
Write-Host ""
Write-Host "6. Intentando obtener logs desde el API..." -ForegroundColor Yellow

# Obtener token de admin
try {
    $adminTokenResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/$REALM/protocol/openid-connect/token" `
        -Method Post `
        -ContentType "application/x-www-form-urlencoded" `
        -Body @{
            username = "admin.user"
            password = "admin123"
            grant_type = "password"
            client_id = $CLIENT_ID
            client_secret = $CLIENT_SECRET
            scope = "openid profile email"
        }
    
    $adminToken = $adminTokenResponse.access_token
    
    $adminHeaders = @{
        Authorization = "Bearer $adminToken"
    }
    
    $auditLogs = Invoke-RestMethod -Uri "$API_URL/api/audit?page=1&pageSize=10" `
        -Method Get `
        -Headers $adminHeaders
    
    Write-Host "   Logs de auditoria obtenidos:" -ForegroundColor Green
    Write-Host "   Total: $($auditLogs.totalCount)" -ForegroundColor Gray
    
    if ($auditLogs.items.Count -gt 0) {
        Write-Host ""
        Write-Host "   Ultimos logs:" -ForegroundColor Cyan
        foreach ($log in $auditLogs.items | Select-Object -First 5) {
            Write-Host "   - $($log.actionType) en $($log.tableName) por usuario $($log.userId)" -ForegroundColor Gray
        }
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "   Error obteniendo logs: Status $statusCode" -ForegroundColor Red
    Write-Host "   El endpoint de auditoria puede no estar implementado aun" -ForegroundColor Yellow
}

# Resumen
Write-Host ""
Write-Host "=== Resumen ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Operaciones realizadas:" -ForegroundColor Green
Write-Host "  1. Token obtenido" -ForegroundColor White
Write-Host "  2. Prescripcion creada (ID: $prescriptionId)" -ForegroundColor White
Write-Host "  3. Prescripcion leida" -ForegroundColor White
Write-Host "  4. Prescripcion actualizada" -ForegroundColor White
Write-Host ""
Write-Host "Estas operaciones deberian haber generado logs de auditoria en Oracle." -ForegroundColor Yellow
Write-Host "Verifica manualmente con SQL Developer o sqlplus." -ForegroundColor Yellow
Write-Host ""
Write-Host "Para ver logs en Oracle:" -ForegroundColor Cyan
Write-Host "  docker exec -it oracle-db sqlplus eprescription/eprescription@//localhost:1521/XEPDB1" -ForegroundColor White
Write-Host "  SELECT * FROM AUDIT_LOGS ORDER BY CREATED_AT DESC FETCH FIRST 10 ROWS ONLY;" -ForegroundColor White
Write-Host ""
