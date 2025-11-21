# Script para habilitar Direct Access Grants en el cliente eprescription-api
# Esto permite obtener tokens JWT usando username/password para pruebas automatizadas

$KEYCLOAK_URL = "http://localhost:8080"
$REALM = "eprescription"
$ADMIN_USER = "admin"
$ADMIN_PASSWORD = "admin123"
$CLIENT_ID = "eprescription-api"

Write-Host "=== Configurando Keycloak para Pruebas Automatizadas ===" -ForegroundColor Cyan
Write-Host ""

# 1. Obtener token de administrador
Write-Host "1. Obteniendo token de administrador..." -ForegroundColor Yellow
try {
    $adminTokenResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" `
        -Method Post `
        -ContentType "application/x-www-form-urlencoded" `
        -Body @{
            username = $ADMIN_USER
            password = $ADMIN_PASSWORD
            grant_type = "password"
            client_id = "admin-cli"
        }
    
    $adminToken = $adminTokenResponse.access_token
    Write-Host "   ✓ Token obtenido exitosamente" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error obteniendo token de admin: $_" -ForegroundColor Red
    exit 1
}

# 2. Obtener ID interno del cliente
Write-Host ""
Write-Host "2. Buscando cliente '$CLIENT_ID'..." -ForegroundColor Yellow
try {
    $clients = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients?clientId=$CLIENT_ID" `
        -Method Get `
        -Headers @{
            Authorization = "Bearer $adminToken"
        }
    
    if ($clients.Count -eq 0) {
        Write-Host "   ✗ Cliente '$CLIENT_ID' no encontrado" -ForegroundColor Red
        exit 1
    }
    
    $clientUuid = $clients[0].id
    Write-Host "   ✓ Cliente encontrado (ID: $clientUuid)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error buscando cliente: $_" -ForegroundColor Red
    exit 1
}

# 3. Obtener configuración actual del cliente
Write-Host ""
Write-Host "3. Obteniendo configuración actual..." -ForegroundColor Yellow
try {
    $clientConfig = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients/$clientUuid" `
        -Method Get `
        -Headers @{
            Authorization = "Bearer $adminToken"
        }
    
    Write-Host "   ✓ Configuración obtenida" -ForegroundColor Green
    Write-Host "   - Direct Access Grants actual: $($clientConfig.directAccessGrantsEnabled)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Error obteniendo configuración: $_" -ForegroundColor Red
    exit 1
}

# 4. Habilitar Direct Access Grants
Write-Host ""
Write-Host "4. Habilitando Direct Access Grants..." -ForegroundColor Yellow
try {
    $clientConfig.directAccessGrantsEnabled = $true
    
    $body = $clientConfig | ConvertTo-Json -Depth 10
    
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients/$clientUuid" `
        -Method Put `
        -Headers @{
            Authorization = "Bearer $adminToken"
            "Content-Type" = "application/json"
        } `
        -Body $body | Out-Null
    
    Write-Host "   ✓ Direct Access Grants habilitado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error actualizando cliente: $_" -ForegroundColor Red
    Write-Host "   Detalles: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 5. Verificar cambios
Write-Host ""
Write-Host "5. Verificando cambios..." -ForegroundColor Yellow
try {
    $updatedConfig = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients/$clientUuid" `
        -Method Get `
        -Headers @{
            Authorization = "Bearer $adminToken"
        }
    
    if ($updatedConfig.directAccessGrantsEnabled -eq $true) {
        Write-Host "   ✓ Configuración verificada correctamente" -ForegroundColor Green
    } else {
        Write-Host "   ✗ La configuración no se aplicó correctamente" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ✗ Error verificando cambios: $_" -ForegroundColor Red
    exit 1
}

# 6. Probar autenticación con un usuario
Write-Host ""
Write-Host "6. Probando autenticación con usuario 'doctor1'..." -ForegroundColor Yellow
try {
    $testTokenResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/$REALM/protocol/openid-connect/token" `
        -Method Post `
        -ContentType "application/x-www-form-urlencoded" `
        -Body @{
            username = "doctor1"
            password = "Doctor123!"
            grant_type = "password"
            client_id = $CLIENT_ID
            scope = "openid profile email"
        }
    
    Write-Host "   ✓ Autenticación exitosa!" -ForegroundColor Green
    Write-Host "   - Token obtenido: $($testTokenResponse.access_token.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "   - Expira en: $($testTokenResponse.expires_in) segundos" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Error en autenticación de prueba: $_" -ForegroundColor Red
    Write-Host "   Esto puede ser normal si las credenciales no son correctas" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Configuración Completada ===" -ForegroundColor Green
Write-Host ""
Write-Host "Ahora puedes obtener tokens usando:" -ForegroundColor Cyan
Write-Host ""
Write-Host "curl -X POST http://localhost:8080/realms/eprescription/protocol/openid-connect/token \" -ForegroundColor White
Write-Host "  -H 'Content-Type: application/x-www-form-urlencoded' \" -ForegroundColor White
Write-Host "  -d 'username=doctor1' \" -ForegroundColor White
Write-Host "  -d 'password=Doctor123!' \" -ForegroundColor White
Write-Host "  -d 'grant_type=password' \" -ForegroundColor White
Write-Host "  -d 'client_id=eprescription-api' \" -ForegroundColor White
Write-Host "  -d 'scope=openid profile email'" -ForegroundColor White
Write-Host ""
