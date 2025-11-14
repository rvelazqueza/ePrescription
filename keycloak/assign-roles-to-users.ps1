# Assign Roles to Users in Keycloak
$KeycloakUrl = "http://localhost:8080"
$Realm = "eprescription"

Write-Host "Keycloak Role Assignment" -ForegroundColor Cyan
Write-Host ""

# Get admin token
$tokenUrl = "$KeycloakUrl/realms/master/protocol/openid-connect/token"
$tokenBody = @{
    grant_type = "password"
    client_id = "admin-cli"
    username = "admin"
    password = "admin123"
}

Write-Host "Getting admin token..." -NoNewline
$tokenResponse = Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $tokenBody -ContentType "application/x-www-form-urlencoded"
$token = $tokenResponse.access_token
Write-Host " OK" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host ""
Write-Host "Assigning roles..." -ForegroundColor Yellow

# Get all realm roles
$rolesUrl = "$KeycloakUrl/admin/realms/$Realm/roles"
$allRoles = Invoke-RestMethod -Uri $rolesUrl -Method Get -Headers $headers

# Get all users
$usersUrl = "$KeycloakUrl/admin/realms/$Realm/users"
$allUsers = Invoke-RestMethod -Uri $usersUrl -Method Get -Headers $headers

# User-Role mapping
$userRoles = @{
    "admin.user" = "admin"
    "doctor1" = "doctor"
    "patient1" = "patient"
    "pharmacist1" = "pharmacist"
    "auditor1" = "auditor"
}

foreach ($username in $userRoles.Keys) {
    Write-Host "  $username -> $($userRoles[$username])..." -NoNewline
    
    $user = $allUsers | Where-Object { $_.username -eq $username }
    $roleName = $userRoles[$username]
    $role = $allRoles | Where-Object { $_.name -eq $roleName }
    
    if ($user -and $role) {
        $userId = $user.id
        $assignRoleUrl = "$KeycloakUrl/admin/realms/$Realm/users/$userId/role-mappings/realm"
        
        $roleData = @(
            @{
                id = $role.id
                name = $role.name
            }
        ) | ConvertTo-Json
        
        try {
            Invoke-RestMethod -Uri $assignRoleUrl -Method Post -Headers $headers -Body $roleData -ContentType "application/json"
            Write-Host " OK" -ForegroundColor Green
        } catch {
            Write-Host " Already assigned" -ForegroundColor Yellow
        }
    } else {
        Write-Host " User or Role not found" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done! Test with:" -ForegroundColor Green
Write-Host ".\test-keycloak-auth.ps1 -Username 'doctor1' -Password 'doctor123'" -ForegroundColor White
