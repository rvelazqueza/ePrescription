# Script simplificado para configurar Keycloak automaticamente

$KEYCLOAK_URL = "http://localhost:8080"
$ADMIN_USER = "admin"
$ADMIN_PASSWORD = "admin123"
$REALM_NAME = "eprescription"
$CLIENT_ID = "eprescription-api"

Write-Host "Iniciando configuracion automatica de Keycloak..." -ForegroundColor Green

# Esperar a que Keycloak este listo
Write-Host "Esperando a que Keycloak este disponible..." -ForegroundColor Yellow
$ready = $false
$attempts = 0
while (-not $ready -and $attempts -lt 10) {
    try {
        $response = Invoke-WebRequest -Uri "$KEYCLOAK_URL" -Method Get -ErrorAction SilentlyContinue -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            $ready = $true
        }
    } catch {
        Write-Host "Esperando... intento $($attempts + 1)" -ForegroundColor Gray
        Start-Sleep -Seconds 3
        $attempts++
    }
}

if (-not $ready) {
    Write-Host "ERROR: Keycloak no esta disponible despues de esperar" -ForegroundColor Red
    Write-Host "Verifica que Keycloak este corriendo con: docker ps | Select-String keycloak" -ForegroundColor Yellow
    exit 1
}

Write-Host "Keycloak esta listo!" -ForegroundColor Green

# Obtener token de administrador
Write-Host "Obteniendo token de administrador..." -ForegroundColor Cyan
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
    Write-Host "Token obtenido exitosamente" -ForegroundColor Green
} catch {
    Write-Host "ERROR: No se pudo obtener el token de acceso" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $ACCESS_TOKEN"
    "Content-Type" = "application/json"
}

# Crear Realm
Write-Host "Creando realm '$REALM_NAME'..." -ForegroundColor Cyan
try {
    $realmExists = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME" `
        -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "Realm ya existe" -ForegroundColor Yellow
} catch {
    $realmData = @{
        realm = $REALM_NAME
        enabled = $true
        displayName = "ePrescription System"
        registrationAllowed = $false
        loginWithEmailAllowed = $true
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms" `
        -Method Post -Headers $headers -Body $realmData | Out-Null
    Write-Host "Realm creado exitosamente" -ForegroundColor Green
}

# Crear Client
Write-Host "Creando client '$CLIENT_ID'..." -ForegroundColor Cyan
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
        standardFlowEnabled = $true
        redirectUris = @("http://localhost:5000/*", "http://localhost:4200/*")
        webOrigins = @("http://localhost:5000", "http://localhost:4200")
    } | ConvertTo-Json -Depth 10
    
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients" `
        -Method Post -Headers $headers -Body $clientData | Out-Null
    Write-Host "Client creado exitosamente" -ForegroundColor Green
} else {
    Write-Host "Client ya existe" -ForegroundColor Yellow
}

# Obtener Client Secret
Write-Host "Obteniendo Client Secret..." -ForegroundColor Cyan
$clients = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients" `
    -Method Get -Headers $headers
$client = $clients | Where-Object { $_.clientId -eq $CLIENT_ID }

if ($client) {
    $CLIENT_UUID = $client.id
    $secretResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients/$CLIENT_UUID/client-secret" `
        -Method Get -Headers $headers
    $CLIENT_SECRET = $secretResponse.value
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "IMPORTANTE - Client Secret:" -ForegroundColor Yellow
    Write-Host $CLIENT_SECRET -ForegroundColor White
    Write-Host ""
    Write-Host "Actualiza appsettings.json:" -ForegroundColor Yellow
    Write-Host "`"ClientSecret`": `"$CLIENT_SECRET`"" -ForegroundColor White
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
}

# Crear Roles
Write-Host "Creando roles..." -ForegroundColor Cyan
$roles = @("admin", "doctor", "pharmacist", "patient", "auditor")

foreach ($roleName in $roles) {
    try {
        Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles/$roleName" `
            -Method Get -Headers $headers -ErrorAction Stop | Out-Null
        Write-Host "  Rol '$roleName' ya existe" -ForegroundColor Yellow
    } catch {
        $roleData = @{
            name = $roleName
            description = "Role for $roleName"
        } | ConvertTo-Json
        
        Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles" `
            -Method Post -Headers $headers -Body $roleData | Out-Null
        Write-Host "  Rol '$roleName' creado" -ForegroundColor Green
    }
}

# Crear usuarios
Write-Host "Creando usuarios de prueba..." -ForegroundColor Cyan

$users = @(
    @{username="admin.user"; email="admin@eprescription.com"; firstName="Admin"; lastName="User"; password="Admin123!"; role="admin"},
    @{username="doctor.smith"; email="doctor.smith@eprescription.com"; firstName="John"; lastName="Smith"; password="Doctor123!"; role="doctor"},
    @{username="pharmacist.jones"; email="pharmacist.jones@eprescription.com"; firstName="Mary"; lastName="Jones"; password="Pharmacist123!"; role="pharmacist"},
    @{username="patient.doe"; email="patient.doe@eprescription.com"; firstName="Jane"; lastName="Doe"; password="Patient123!"; role="patient"}
)

foreach ($user in $users) {
    try {
        $existingUsers = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?username=$($user.username)" `
            -Method Get -Headers $headers
        
        if ($existingUsers.Count -gt 0) {
            Write-Host "  Usuario '$($user.username)' ya existe" -ForegroundColor Yellow
            continue
        }
    } catch {}
    
    # Crear usuario
    $userData = @{
        username = $user.username
        email = $user.email
        firstName = $user.firstName
        lastName = $user.lastName
        enabled = $true
        emailVerified = $true
        credentials = @(
            @{
                type = "password"
                value = $user.password
                temporary = $false
            }
        )
    } | ConvertTo-Json -Depth 10
    
    Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" `
        -Method Post -Headers $headers -Body $userData | Out-Null
    
    # Obtener User ID
    $createdUsers = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?username=$($user.username)" `
        -Method Get -Headers $headers
    $userId = $createdUsers[0].id
    
    # Asignar rol
    if ($userId) {
        $roleData = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles/$($user.role)" `
            -Method Get -Headers $headers
        
        $roleMapping = @($roleData) | ConvertTo-Json -Depth 10
        
        Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users/$userId/role-mappings/realm" `
            -Method Post -Headers $headers -Body $roleMapping | Out-Null
    }
    
    Write-Host "  Usuario '$($user.username)' creado con rol '$($user.role)'" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Configuracion completada exitosamente!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Resumen:" -ForegroundColor Cyan
Write-Host "  Realm: $REALM_NAME"
Write-Host "  Client ID: $CLIENT_ID"
Write-Host "  Client Secret: $CLIENT_SECRET"
Write-Host ""
Write-Host "Usuarios creados:" -ForegroundColor Cyan
Write-Host "  - admin.user / Admin123! (rol: admin)"
Write-Host "  - doctor.smith / Doctor123! (rol: doctor)"
Write-Host "  - pharmacist.jones / Pharmacist123! (rol: pharmacist)"
Write-Host "  - patient.doe / Patient123! (rol: patient)"
Write-Host ""
Write-Host "Acceso a Admin Console:" -ForegroundColor Cyan
Write-Host "  URL: $KEYCLOAK_URL"
Write-Host "  Username: $ADMIN_USER"
Write-Host "  Password: $ADMIN_PASSWORD"
Write-Host ""
