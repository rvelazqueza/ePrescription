# Diagnóstico completo y solución del problema de login
Write-Host "=== Diagnóstico y Solución de Login ===" -ForegroundColor Cyan

$KEYCLOAK_URL = "http://localhost:8080"
$REALM = "eprescription"
$ADMIN_USER = "admin"
$ADMIN_PASSWORD = "admin123"

# 1. Obtener token de administrador
Write-Host "`n1. Obteniendo token de administrador..." -ForegroundColor Yellow
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
    Write-Host "✅ Token obtenido" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "Verifica que Keycloak esté corriendo y las credenciales de admin sean correctas" -ForegroundColor Yellow
    exit 1
}

# 2. Listar todos los clientes
Write-Host "`n2. Listando clientes en realm '$REALM'..." -ForegroundColor Yellow
try {
    $clients = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients" `
        -Method Get `
        -Headers @{ Authorization = "Bearer $adminToken" }
    
    Write-Host "Clientes encontrados:" -ForegroundColor Green
    foreach ($client in $clients) {
        if ($client.clientId -like "*eprescription*") {
            Write-Host "  - $($client.clientId) (ID: $($client.id))" -ForegroundColor Cyan
            Write-Host "    Direct Access: $($client.directAccessGrantsEnabled)" -ForegroundColor Gray
            Write-Host "    Public Client: $($client.publicClient)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ Error listando clientes: $_" -ForegroundColor Red
}

# 3. Verificar/Habilitar Direct Access en eprescription-client
Write-Host "`n3. Configurando cliente 'eprescription-client'..." -ForegroundColor Yellow
try {
    $clientsFiltered = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients?clientId=eprescription-client" `
        -Method Get `
        -Headers @{ Authorization = "Bearer $adminToken" }
    
    if ($clientsFiltered.Count -eq 0) {
        Write-Host "⚠️  Cliente 'eprescription-client' no existe" -ForegroundColor Yellow
        Write-Host "Intentando con 'eprescription-api'..." -ForegroundColor Yellow
        
        $clientsFiltered = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients?clientId=eprescription-api" `
            -Method Get `
            -Headers @{ Authorization = "Bearer $adminToken" }
    }
    
    if ($clientsFiltered.Count -gt 0) {
        $client = $clientsFiltered[0]
        $clientUuid = $client.id
        $clientId = $client.clientId
        
        Write-Host "✅ Cliente encontrado: $clientId" -ForegroundColor Green
        
        # Obtener configuración completa
        $clientConfig = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients/$clientUuid" `
            -Method Get `
            -Headers @{ Authorization = "Bearer $adminToken" }
        
        # Habilitar Direct Access si no está habilitado
        if (-not $clientConfig.directAccessGrantsEnabled) {
            Write-Host "Habilitando Direct Access Grants..." -ForegroundColor Yellow
            $clientConfig.directAccessGrantsEnabled = $true
            
            $body = $clientConfig | ConvertTo-Json -Depth 10
            Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients/$clientUuid" `
                -Method Put `
                -Headers @{
                    Authorization = "Bearer $adminToken"
                    "Content-Type" = "application/json"
                } `
                -Body $body | Out-Null
            
            Write-Host "✅ Direct Access Grants habilitado" -ForegroundColor Green
        } else {
            Write-Host "✅ Direct Access Grants ya estaba habilitado" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "❌ Error configurando cliente: $_" -ForegroundColor Red
}

# 4. Verificar si el usuario 'doctor' existe
Write-Host "`n4. Verificando usuario 'doctor'..." -ForegroundColor Yellow
try {
    $users = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/users?username=doctor&exact=true" `
        -Method Get `
        -Headers @{ Authorization = "Bearer $adminToken" }
    
    if ($users.Count -eq 0) {
        Write-Host "⚠️  Usuario 'doctor' no existe. Creándolo..." -ForegroundColor Yellow
        
        # Crear usuario
        $newUser = @{
            username = "doctor"
            enabled = $true
            emailVerified = $true
            firstName = "Dr. Juan"
            lastName = "Pérez"
            email = "doctor@eprescription.com"
            credentials = @(
                @{
                    type = "password"
                    value = "doctor123"
                    temporary = $false
                }
            )
        } | ConvertTo-Json -Depth 10
        
        Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/users" `
            -Method Post `
            -Headers @{
                Authorization = "Bearer $adminToken"
                "Content-Type" = "application/json"
            } `
            -Body $newUser | Out-Null
        
        Write-Host "✅ Usuario 'doctor' creado" -ForegroundColor Green
        
        # Obtener el usuario recién creado para asignar roles
        $users = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/users?username=doctor&exact=true" `
            -Method Get `
            -Headers @{ Authorization = "Bearer $adminToken" }
    } else {
        Write-Host "✅ Usuario 'doctor' existe" -ForegroundColor Green
        
        # Resetear contraseña por si acaso
        $userId = $users[0].id
        $passwordReset = @{
            type = "password"
            value = "doctor123"
            temporary = $false
        } | ConvertTo-Json
        
        Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/users/$userId/reset-password" `
            -Method Put `
            -Headers @{
                Authorization = "Bearer $adminToken"
                "Content-Type" = "application/json"
            } `
            -Body $passwordReset | Out-Null
        
        Write-Host "✅ Contraseña reseteada a 'doctor123'" -ForegroundColor Green
    }
    
    $userId = $users[0].id
    
    # Asignar rol 'doctor' si existe
    Write-Host "Asignando rol 'doctor'..." -ForegroundColor Yellow
    try {
        $roles = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/roles" `
            -Method Get `
            -Headers @{ Authorization = "Bearer $adminToken" }
        
        $doctorRole = $roles | Where-Object { $_.name -eq "doctor" }
        
        if ($doctorRole) {
            $roleAssignment = @($doctorRole) | ConvertTo-Json -Depth 10 -AsArray
            
            Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/users/$userId/role-mappings/realm" `
                -Method Post `
                -Headers @{
                    Authorization = "Bearer $adminToken"
                    "Content-Type" = "application/json"
                } `
                -Body $roleAssignment | Out-Null
            
            Write-Host "✅ Rol 'doctor' asignado" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Rol 'doctor' no existe en Keycloak" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠️  No se pudo asignar rol: $_" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error con usuario: $_" -ForegroundColor Red
}

# 5. Probar login
Write-Host "`n5. Probando login..." -ForegroundColor Yellow

# Determinar qué cliente usar
$testClientId = "eprescription-client"
$clientsTest = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM/clients?clientId=$testClientId" `
    -Method Get `
    -Headers @{ Authorization = "Bearer $adminToken" }

if ($clientsTest.Count -eq 0) {
    $testClientId = "eprescription-api"
    Write-Host "Usando cliente: $testClientId" -ForegroundColor Gray
}

try {
    $loginResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/$REALM/protocol/openid-connect/token" `
        -Method Post `
        -ContentType "application/x-www-form-urlencoded" `
        -Body @{
            username = "doctor"
            password = "doctor123"
            grant_type = "password"
            client_id = $testClientId
        }
    
    Write-Host "✅ Login exitoso con Keycloak!" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.access_token.Substring(0, 50))..." -ForegroundColor Gray
    
    # Probar con el API
    Write-Host "`n6. Probando login con el API..." -ForegroundColor Yellow
    $apiLogin = @{
        username = "doctor"
        password = "doctor123"
    } | ConvertTo-Json
    
    try {
        $apiResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login" `
            -Method Post `
            -Body $apiLogin `
            -ContentType "application/json"
        
        Write-Host "✅ Login exitoso con el API!" -ForegroundColor Green
        Write-Host "Usuario: $($apiResponse.user.username)" -ForegroundColor Gray
        Write-Host "Rol: $($apiResponse.user.role)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Login falló con el API" -ForegroundColor Red
        Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "❌ Login falló con Keycloak" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "`n=== Diagnóstico Completado ===" -ForegroundColor Cyan
Write-Host "`nCredenciales para probar:" -ForegroundColor Yellow
Write-Host "  Username: doctor" -ForegroundColor White
Write-Host "  Password: doctor123" -ForegroundColor White
Write-Host "  Client ID: $testClientId" -ForegroundColor White
