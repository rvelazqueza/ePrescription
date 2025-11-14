# Script para verificar la configuracion de Keycloak

$KEYCLOAK_URL = "http://localhost:8080"
$ADMIN_USER = "admin"
$ADMIN_PASSWORD = "admin123"
$REALM_NAME = "eprescription"

Write-Host "Verificando configuracion de Keycloak..." -ForegroundColor Cyan
Write-Host ""

# Obtener token
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
} catch {
    Write-Host "ERROR: No se pudo obtener token" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $ACCESS_TOKEN"
}

# Verificar Realm
Write-Host "1. Verificando Realm..." -ForegroundColor Yellow
try {
    $realm = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME" -Method Get -Headers $headers
    Write-Host "   [OK] Realm '$($realm.realm)' existe" -ForegroundColor Green
    Write-Host "   - Display Name: $($realm.displayName)" -ForegroundColor Gray
    Write-Host "   - Enabled: $($realm.enabled)" -ForegroundColor Gray
} catch {
    Write-Host "   [ERROR] Realm no encontrado" -ForegroundColor Red
}

# Verificar Client
Write-Host ""
Write-Host "2. Verificando Client..." -ForegroundColor Yellow
try {
    $clients = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients" -Method Get -Headers $headers
    $client = $clients | Where-Object { $_.clientId -eq "eprescription-api" }
    
    if ($client) {
        Write-Host "   [OK] Client 'eprescription-api' existe" -ForegroundColor Green
        Write-Host "   - Client ID: $($client.clientId)" -ForegroundColor Gray
        Write-Host "   - Enabled: $($client.enabled)" -ForegroundColor Gray
        Write-Host "   - Public Client: $($client.publicClient)" -ForegroundColor Gray
        Write-Host "   - Direct Access Grants: $($client.directAccessGrantsEnabled)" -ForegroundColor Gray
        
        # Obtener Client Secret
        $secretResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/clients/$($client.id)/client-secret" `
            -Method Get -Headers $headers
        Write-Host "   - Client Secret: $($secretResponse.value)" -ForegroundColor Gray
    } else {
        Write-Host "   [ERROR] Client no encontrado" -ForegroundColor Red
    }
} catch {
    Write-Host "   [ERROR] No se pudo verificar client" -ForegroundColor Red
}

# Verificar Roles
Write-Host ""
Write-Host "3. Verificando Roles..." -ForegroundColor Yellow
$expectedRoles = @("admin", "doctor", "pharmacist", "patient", "auditor")
$rolesOk = 0

foreach ($roleName in $expectedRoles) {
    try {
        $role = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles/$roleName" `
            -Method Get -Headers $headers
        Write-Host "   [OK] Rol '$roleName' existe" -ForegroundColor Green
        $rolesOk++
    } catch {
        Write-Host "   [ERROR] Rol '$roleName' no encontrado" -ForegroundColor Red
    }
}

Write-Host "   Total: $rolesOk/$($expectedRoles.Count) roles creados" -ForegroundColor $(if ($rolesOk -eq $expectedRoles.Count) { "Green" } else { "Yellow" })

# Verificar Usuarios
Write-Host ""
Write-Host "4. Verificando Usuarios..." -ForegroundColor Yellow
$expectedUsers = @(
    @{username="admin.user"; role="admin"},
    @{username="doctor.smith"; role="doctor"},
    @{username="pharmacist.jones"; role="pharmacist"},
    @{username="patient.doe"; role="patient"}
)

$usersOk = 0
$usersWithRoles = 0

foreach ($user in $expectedUsers) {
    try {
        $users = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?username=$($user.username)" `
            -Method Get -Headers $headers
        
        if ($users.Count -gt 0) {
            $userId = $users[0].id
            Write-Host "   [OK] Usuario '$($user.username)' existe" -ForegroundColor Green
            $usersOk++
            
            # Verificar roles del usuario
            try {
                $userRoles = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users/$userId/role-mappings/realm" `
                    -Method Get -Headers $headers
                
                $hasRole = $userRoles | Where-Object { $_.name -eq $user.role }
                if ($hasRole) {
                    Write-Host "      - Rol asignado: $($user.role)" -ForegroundColor Gray
                    $usersWithRoles++
                } else {
                    Write-Host "      [WARN] Rol '$($user.role)' NO asignado" -ForegroundColor Yellow
                    Write-Host "      - Roles actuales: $($userRoles.name -join ', ')" -ForegroundColor Gray
                }
            } catch {
                Write-Host "      [WARN] No se pudieron verificar roles" -ForegroundColor Yellow
            }
        } else {
            Write-Host "   [ERROR] Usuario '$($user.username)' no encontrado" -ForegroundColor Red
        }
    } catch {
        Write-Host "   [ERROR] Usuario '$($user.username)' no encontrado" -ForegroundColor Red
    }
}

Write-Host "   Total: $usersOk/$($expectedUsers.Count) usuarios creados" -ForegroundColor $(if ($usersOk -eq $expectedUsers.Count) { "Green" } else { "Yellow" })
Write-Host "   Con roles: $usersWithRoles/$($expectedUsers.Count) usuarios con roles asignados" -ForegroundColor $(if ($usersWithRoles -eq $expectedUsers.Count) { "Green" } else { "Yellow" })

# Probar autenticacion
Write-Host ""
Write-Host "5. Probando Autenticacion..." -ForegroundColor Yellow

$testUser = "doctor.smith"
$testPassword = "Doctor123!"

try {
    $authBody = @{
        grant_type = "password"
        client_id = "eprescription-api"
        client_secret = "Q7frqJfqjUaU73rKni061qpE9KDrbGL0"
        username = $testUser
        password = $testPassword
    }
    
    $authResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/$REALM_NAME/protocol/openid-connect/token" `
        -Method Post -Body $authBody -ContentType "application/x-www-form-urlencoded"
    
    Write-Host "   [OK] Autenticacion exitosa para '$testUser'" -ForegroundColor Green
    Write-Host "   - Access Token recibido: $(($authResponse.access_token).Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "   - Expires in: $($authResponse.expires_in) segundos" -ForegroundColor Gray
    Write-Host "   - Token Type: $($authResponse.token_type)" -ForegroundColor Gray
    
    # Decodificar token para ver roles
    $tokenParts = $authResponse.access_token.Split('.')
    if ($tokenParts.Length -eq 3) {
        $payload = $tokenParts[1]
        # Agregar padding si es necesario
        while ($payload.Length % 4 -ne 0) {
            $payload += "="
        }
        $payloadJson = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($payload))
        $payloadObj = $payloadJson | ConvertFrom-Json
        
        if ($payloadObj.realm_access.roles) {
            Write-Host "   - Roles en token: $($payloadObj.realm_access.roles -join ', ')" -ForegroundColor Gray
        }
    }
    
} catch {
    Write-Host "   [ERROR] Autenticacion fallida" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Resumen
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE VERIFICACION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

if ($realm) {
    Write-Host "[OK] Realm configurado correctamente" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Realm tiene problemas" -ForegroundColor Red
    $allGood = $false
}

if ($client) {
    Write-Host "[OK] Client configurado correctamente" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Client tiene problemas" -ForegroundColor Red
    $allGood = $false
}

if ($rolesOk -eq $expectedRoles.Count) {
    Write-Host "[OK] Todos los roles creados" -ForegroundColor Green
} else {
    Write-Host "[WARN] Faltan algunos roles" -ForegroundColor Yellow
    $allGood = $false
}

if ($usersOk -eq $expectedUsers.Count) {
    Write-Host "[OK] Todos los usuarios creados" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Faltan algunos usuarios" -ForegroundColor Red
    $allGood = $false
}

if ($usersWithRoles -lt $expectedUsers.Count) {
    Write-Host "[WARN] Algunos usuarios no tienen roles asignados" -ForegroundColor Yellow
    Write-Host "       Esto puede causar problemas de autorizacion" -ForegroundColor Yellow
    Write-Host "       Solucion: Asignar roles manualmente en Keycloak Admin Console" -ForegroundColor Yellow
}

if ($authResponse) {
    Write-Host "[OK] Autenticacion funciona correctamente" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Autenticacion tiene problemas" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""
if ($allGood -and $usersWithRoles -eq $expectedUsers.Count) {
    Write-Host "ESTADO GENERAL: TODO CORRECTO" -ForegroundColor Green
    Write-Host "El sistema esta listo para usar" -ForegroundColor Green
} elseif ($authResponse) {
    Write-Host "ESTADO GENERAL: FUNCIONAL CON ADVERTENCIAS" -ForegroundColor Yellow
    Write-Host "El sistema funciona pero algunos roles pueden no estar asignados" -ForegroundColor Yellow
    Write-Host "Recomendacion: Verificar roles en Keycloak Admin Console" -ForegroundColor Yellow
} else {
    Write-Host "ESTADO GENERAL: REQUIERE ATENCION" -ForegroundColor Red
    Write-Host "Hay problemas que deben resolverse" -ForegroundColor Red
}
Write-Host ""
