# Script para asignar roles a usuarios en Keycloak

$KEYCLOAK_URL = "http://localhost:8080"
$ADMIN_USER = "admin"
$ADMIN_PASSWORD = "admin123"
$REALM_NAME = "eprescription"

Write-Host "Asignando roles a usuarios..." -ForegroundColor Cyan

# Obtener token
$tokenBody = @{
    username = $ADMIN_USER
    password = $ADMIN_PASSWORD
    grant_type = "password"
    client_id = "admin-cli"
}

$tokenResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" `
    -Method Post -Body $tokenBody -ContentType "application/x-www-form-urlencoded"
$ACCESS_TOKEN = $tokenResponse.access_token

$headers = @{
    "Authorization" = "Bearer $ACCESS_TOKEN"
    "Content-Type" = "application/json"
}

# Usuarios y sus roles
$userRoles = @(
    @{username="admin.user"; role="admin"},
    @{username="doctor.smith"; role="doctor"},
    @{username="pharmacist.jones"; role="pharmacist"},
    @{username="patient.doe"; role="patient"}
)

foreach ($mapping in $userRoles) {
    Write-Host ""
    Write-Host "Procesando usuario: $($mapping.username)" -ForegroundColor Yellow
    
    # Obtener User ID
    $users = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users?username=$($mapping.username)" `
        -Method Get -Headers $headers
    
    if ($users.Count -eq 0) {
        Write-Host "  [ERROR] Usuario no encontrado" -ForegroundColor Red
        continue
    }
    
    $userId = $users[0].id
    Write-Host "  User ID: $userId" -ForegroundColor Gray
    
    # Obtener datos del rol
    $role = Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/roles/$($mapping.role)" `
        -Method Get -Headers $headers
    
    Write-Host "  Role ID: $($role.id)" -ForegroundColor Gray
    
    # Asignar rol (usando array con un solo elemento)
    $roleArray = @(
        @{
            id = $role.id
            name = $role.name
        }
    )
    
    $roleJson = $roleArray | ConvertTo-Json -Depth 10 -Compress
    
    try {
        Invoke-RestMethod -Uri "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users/$userId/role-mappings/realm" `
            -Method Post -Headers $headers -Body $roleJson | Out-Null
        Write-Host "  [OK] Rol '$($mapping.role)' asignado exitosamente" -ForegroundColor Green
    } catch {
        Write-Host "  [ERROR] No se pudo asignar rol: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Proceso completado. Ejecuta verify-keycloak-setup.ps1 para verificar" -ForegroundColor Cyan
