# Script para configurar Keycloak automáticamente
# Configura realm, client, roles y usuarios de prueba

$KEYCLOAK_URL = "http://localhost:8080"
$ADMIN_USER = "admin"
$ADMIN_PASSWORD = "admin123"
$REALM_NAME = "eprescription"
$CLIENT_ID = "eprescription-api"

Write-Host "[INFO] Iniciando configuracion automatica de Keycloak..." -ForegroundColor Green

# Esperar a que Keycloak este listo
Write-Host "[WAIT] Esperando a que Keycloak este disponible..." -ForegroundColor Yellow
$ready = $false
while (-not $ready) {
    try {
        $response = Invoke-WebRequest -Uri "$KEYCLOAK_URL/health/ready" -Method Get -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $ready = $true
        }
    } catch {
        Write-Host "   Keycloak no está listo aún, esperando..." -ForegroundColor Gray
        Start-Sleep -Seconds 5
    }
}
Write-Host "✅ Keycloak está listo" -ForegroundColor Green

# Obtener token de administrador
Write-Host "🔑 Obteniendo token de administrador..." -ForegroundColor Cyan
$tokenBody = @{
    username = $ADMIN_USER
    password = $ADMIN_PASSWORD
    grant_type = "password"
    client_id = "admin-cli"
}

try {
    $tokenResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" `
        -Method Post -Body $tokenBody -ContentType "application/x-www-form-urlencoded"
    $ACCESS_TOKEN = $tokenResponse.access_token
    Write-Host "✅ Token obtenido" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: No se pudo obtener el token de acceso" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $ACCESS_TOKEN"
    "Content-Type" = "application/json"
}

# Crear Realm
Write-Host "🏗️  Creando realm '$REALM_NAME'..." -ForegroundColor Cyan
try {
    $realmExists = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME" `
        -Method Get -Headers $headers -ErrorAction SilentlyContinue
    Write-Host "ℹ️  Realm ya existe" -ForegroundColor Yellow
} catch {
    $realmData = @{
        realm = $REALM_NAME
        enabled = $true
        displayName = "ePrescription System"
        registrationAllowed = $false
        loginWithEmailAllowed = $true
        duplicateEmailsAllowed = $false
        resetPasswordAllowed = $true
        editUsernameAllowed = $false
        bruteForceProtected = $true
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms" `
        -Method Post -Headers $headers -Body $realmData
    Write-Host "✅ Realm creado" -ForegroundColor Green
}

# Crear Client
Write-Host "🔧 Creando client '$CLIENT_ID'..." -ForegroundColor Cyan
$clients = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients" `
    -Method Get -Headers $headers

$clientExists = $clients | Where-Object { $_.clientId -eq $CLIENT_ID }

if (-not $clientExists) {
    $clientData = @{
        clientId = $CLIENT_ID
        enabled = $true
        protocol = "openid-connect"
        publicClient = $false
        directAccessGrantsEnabled = $true
        serviceAccountsEnabled = $false
        standardFlowEnabled = $true
        implicitFlowEnabled = $false
        redirectUris = @("http://localhost:5000/*", "http://localhost:4200/*")
        webOrigins = @("http://localhost:5000", "http://localhost:4200")
        attributes = @{
            "access.token.lifespan" = "300"
        }
    } | ConvertTo-Json -Depth 10
    
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients" `
        -Method Post -Headers $headers -Body $clientData
    Write-Host "✅ Client creado" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Client ya existe" -ForegroundColor Yellow
}

# Obtener Client UUID y Secret
Write-Host "🔍 Obteniendo Client Secret..." -ForegroundColor Cyan
$clients = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients" `
    -Method Get -Headers $headers
$client = $clients | Where-Object { $_.clientId -eq $CLIENT_ID }

if ($client) {
    $CLIENT_UUID = $client.id
    $secretResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients/$CLIENT_UUID/client-secret" `
        -Method Get -Headers $headers
    $CLIENT_SECRET = $secretResponse.value
    
    Write-Host "✅ Client Secret obtenido" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 IMPORTANTE - Guarda este Client Secret:" -ForegroundColor Yellow
    Write-Host "   $CLIENT_SECRET" -ForegroundColor White
    Write-Host ""
    Write-Host "   Actualiza appsettings.json con este valor:" -ForegroundColor Yellow
    Write-Host "   `"ClientSecret`": `"$CLIENT_SECRET`"" -ForegroundColor White
    Write-Host ""
}

# Crear Roles
Write-Host "👥 Creando roles..." -ForegroundColor Cyan
$roles = @("admin", "doctor", "pharmacist", "patient", "auditor")

foreach ($roleName in $roles) {
    try {
        $roleExists = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles/$roleName" `
            -Method Get -Headers $headers -ErrorAction SilentlyContinue
        Write-Host "   ℹ️  Rol '$roleName' ya existe" -ForegroundColor Yellow
    } catch {
        $roleData = @{
            name = $roleName
            description = "Role for $roleName"
        } | ConvertTo-Json
        
        Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles" `
            -Method Post -Headers $headers -Body $roleData
        Write-Host "   ✅ Rol '$roleName' creado" -ForegroundColor Green
    }
}

# Función para crear usuarios
function Create-KeycloakUser {
    param(
        [string]$Username,
        [string]$Email,
        [string]$FirstName,
        [string]$LastName,
        [string]$Password,
        [string]$Role
    )
    
    try {
        $userExists = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?username=$Username" `
            -Method Get -Headers $headers
        
        if ($userExists.Count -gt 0) {
            Write-Host "   ℹ️  Usuario '$Username' ya existe" -ForegroundColor Yellow
            return
        }
    } catch {}
    
    # Crear usuario
    $userData = @{
        username = $Username
        email = $Email
        firstName = $FirstName
        lastName = $LastName
        enabled = $true
        emailVerified = $true
        credentials = @(
            @{
                type = "password"
                value = $Password
                temporary = $false
            }
        )
    } | ConvertTo-Json -Depth 10
    
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" `
        -Method Post -Headers $headers -Body $userData
    
    # Obtener User ID
    $users = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?username=$Username" `
        -Method Get -Headers $headers
    $userId = $users[0].id
    
    # Asignar rol
    if ($userId) {
        $roleData = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles/$Role" `
            -Method Get -Headers $headers
        
        $roleMapping = @($roleData) | ConvertTo-Json -Depth 10
        
        Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users/$userId/role-mappings/realm" `
            -Method Post -Headers $headers -Body $roleMapping
    }
    
    Write-Host "   ✅ Usuario '$Username' creado con rol '$Role'" -ForegroundColor Green
}

# Crear Usuarios de Prueba
Write-Host "👤 Creando usuarios de prueba..." -ForegroundColor Cyan
Create-KeycloakUser -Username "admin.user" -Email "admin@eprescription.com" -FirstName "Admin" -LastName "User" -Password "Admin123!" -Role "admin"
Create-KeycloakUser -Username "doctor.smith" -Email "doctor.smith@eprescription.com" -FirstName "John" -LastName "Smith" -Password "Doctor123!" -Role "doctor"
Create-KeycloakUser -Username "pharmacist.jones" -Email "pharmacist.jones@eprescription.com" -FirstName "Mary" -LastName "Jones" -Password "Pharmacist123!" -Role "pharmacist"
Create-KeycloakUser -Username "patient.doe" -Email "patient.doe@eprescription.com" -FirstName "Jane" -LastName "Doe" -Password "Patient123!" -Role "patient"

Write-Host ""
Write-Host "🎉 ¡Configuración de Keycloak completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Resumen:" -ForegroundColor Cyan
Write-Host "   Realm: $REALM_NAME"
Write-Host "   Client ID: $CLIENT_ID"
Write-Host "   Client Secret: $CLIENT_SECRET"
Write-Host ""
Write-Host "👥 Usuarios creados:" -ForegroundColor Cyan
Write-Host "   - admin.user / Admin123! (rol: admin)"
Write-Host "   - doctor.smith / Doctor123! (rol: doctor)"
Write-Host "   - pharmacist.jones / Pharmacist123! (rol: pharmacist)"
Write-Host "   - patient.doe / Patient123! (rol: patient)"
Write-Host ""
Write-Host "🔗 Acceso:" -ForegroundColor Cyan
Write-Host "   Admin Console: $KEYCLOAK_URL"
Write-Host "   Username: $ADMIN_USER"
Write-Host "   Password: $ADMIN_PASSWORD"
Write-Host ""
