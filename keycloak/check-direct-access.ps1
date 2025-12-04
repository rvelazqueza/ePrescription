# Script para verificar si Direct Access Grants esta habilitado

$KEYCLOAK_URL = "http://localhost:8080"
$REALM = "eprescription"
$CLIENT_ID = "eprescription-api"

Write-Host "=== Verificando Configuracion de Direct Access Grants ===" -ForegroundColor Cyan
Write-Host ""

# Obtener token de admin
Write-Host "Obteniendo token de administrador..." -ForegroundColor Yellow
try {
    $adminTokenResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" `
        -Method Post `
        -ContentType "application/x-www-form-urlencoded" `
        -Body @{
            username = "admin"
            password = "admin123"
            grant_type = "password"
            client_id = "admin-cli"
        }
    
    $adminToken = $adminTokenResponse.access_token
    Write-Host "Token obtenido exitosamente" -ForegroundColor Green
} catch {
    Write-Host "Error obteniendo token: $_" -ForegroundColor Red
    exit 1
}

# Buscar cliente
Write-Host ""
Write-Host "Buscando cliente '$CLIENT_ID'..." -ForegroundColor Yellow
try {
    $clients = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients?clientId=$CLIENT_ID" `
        -Method Get `
        -Headers @{
            Authorization = "Bearer $adminToken"
        }
    
    if ($clients.Count -eq 0) {
        Write-Host "Cliente no encontrado" -ForegroundColor Red
        exit 1
    }
    
    $client = $clients[0]
    Write-Host "Cliente encontrado" -ForegroundColor Green
} catch {
    Write-Host "Error buscando cliente: $_" -ForegroundColor Red
    exit 1
}

# Mostrar configuracion
Write-Host ""
Write-Host "=== Configuracion Actual ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Cliente ID: $($client.clientId)" -ForegroundColor White
Write-Host "UUID: $($client.id)" -ForegroundColor Gray
Write-Host ""
Write-Host "Configuracion de Grants:" -ForegroundColor Yellow
Write-Host "  - Standard Flow Enabled: $($client.standardFlowEnabled)" -ForegroundColor White
Write-Host "  - Implicit Flow Enabled: $($client.implicitFlowEnabled)" -ForegroundColor White
Write-Host "  - Direct Access Grants Enabled: $($client.directAccessGrantsEnabled)" -ForegroundColor $(if ($client.directAccessGrantsEnabled) { "Green" } else { "Red" })
Write-Host "  - Service Accounts Enabled: $($client.serviceAccountsEnabled)" -ForegroundColor White
Write-Host ""

if ($client.directAccessGrantsEnabled) {
    Write-Host "Direct Access Grants esta HABILITADO" -ForegroundColor Green
    Write-Host "  Puedes obtener tokens con username/password" -ForegroundColor Gray
} else {
    Write-Host "Direct Access Grants esta DESHABILITADO" -ForegroundColor Red
    Write-Host "  Ejecuta el script enable-direct-access.ps1 para habilitarlo" -ForegroundColor Yellow
}

Write-Host ""
