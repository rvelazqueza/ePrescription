# Reset Keycloak User Passwords
$KeycloakUrl = "http://localhost:8080"
$Realm = "eprescription"

Write-Host "Keycloak Password Reset" -ForegroundColor Cyan
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

# Get all users
$usersUrl = "$KeycloakUrl/admin/realms/$Realm/users"
$allUsers = Invoke-RestMethod -Uri $usersUrl -Method Get -Headers $headers

Write-Host ""
Write-Host "Resetting passwords..." -ForegroundColor Yellow

# Reset passwords
$passwords = @{
    "admin.user" = "admin123"
    "doctor1" = "doctor123"
    "patient1" = "patient123"
    "pharmacist1" = "pharmacist123"
    "auditor1" = "auditor123"
}

foreach ($username in $passwords.Keys) {
    Write-Host "  $username..." -NoNewline
    
    $user = $allUsers | Where-Object { $_.username -eq $username }
    
    if ($user) {
        $userId = $user.id
        $resetUrl = "$KeycloakUrl/admin/realms/$Realm/users/$userId/reset-password"
        
        $pwdData = @{
            type = "password"
            value = $passwords[$username]
            temporary = $false
        } | ConvertTo-Json
        
        Invoke-RestMethod -Uri $resetUrl -Method Put -Headers $headers -Body $pwdData
        Write-Host " OK" -ForegroundColor Green
    } else {
        Write-Host " NOT FOUND" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Done! Test with:" -ForegroundColor Green
Write-Host ".\test-keycloak-auth.ps1 -Username 'doctor1' -Password 'doctor123'"
