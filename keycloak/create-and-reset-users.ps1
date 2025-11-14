# Create and Reset Keycloak Users
$KeycloakUrl = "http://localhost:8080"
$Realm = "eprescription"

Write-Host "Keycloak User Setup" -ForegroundColor Cyan
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
Write-Host "Creating/Updating users..." -ForegroundColor Yellow

# Users to create/update
$users = @{
    "doctor1" = @{ Password = "doctor123"; FirstName = "Doctor"; LastName = "One"; Email = "doctor1@eprescription.com"; Role = "doctor" }
    "patient1" = @{ Password = "patient123"; FirstName = "Patient"; LastName = "One"; Email = "patient1@eprescription.com"; Role = "patient" }
    "pharmacist1" = @{ Password = "pharmacist123"; FirstName = "Pharmacist"; LastName = "One"; Email = "pharmacist1@eprescription.com"; Role = "pharmacist" }
    "auditor1" = @{ Password = "auditor123"; FirstName = "Auditor"; LastName = "One"; Email = "auditor1@eprescription.com"; Role = "auditor" }
}

foreach ($username in $users.Keys) {
    Write-Host "  $username..." -NoNewline
    
    $userInfo = $users[$username]
    $existingUser = $allUsers | Where-Object { $_.username -eq $username }
    
    if ($existingUser) {
        # User exists, just reset password
        $userId = $existingUser.id
        $resetUrl = "$KeycloakUrl/admin/realms/$Realm/users/$userId/reset-password"
        
        $pwdData = @{
            type = "password"
            value = $userInfo.Password
            temporary = $false
        } | ConvertTo-Json
        
        Invoke-RestMethod -Uri $resetUrl -Method Put -Headers $headers -Body $pwdData
        Write-Host " Password Reset" -ForegroundColor Green
    } else {
        # Create new user
        $newUserData = @{
            username = $username
            enabled = $true
            emailVerified = $true
            firstName = $userInfo.FirstName
            lastName = $userInfo.LastName
            email = $userInfo.Email
            credentials = @(
                @{
                    type = "password"
                    value = $userInfo.Password
                    temporary = $false
                }
            )
        } | ConvertTo-Json -Depth 10
        
        Invoke-RestMethod -Uri $usersUrl -Method Post -Headers $headers -Body $newUserData -ContentType "application/json"
        Write-Host " Created" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Done! All users are ready." -ForegroundColor Green
Write-Host ""
Write-Host "Test authentication:" -ForegroundColor Yellow
Write-Host ".\test-keycloak-auth.ps1 -Username 'doctor1' -Password 'doctor123'" -ForegroundColor White
