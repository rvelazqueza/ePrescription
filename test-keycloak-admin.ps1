# Test Keycloak Admin Access
Write-Host "=== Testing Keycloak Admin Access ===" -ForegroundColor Cyan
Write-Host ""

$keycloakUrl = "http://localhost:8080"

# Test 1: Get admin token
Write-Host "1. Getting Keycloak Admin Token..." -ForegroundColor Yellow
$adminTokenUrl = "$keycloakUrl/realms/master/protocol/openid-connect/token"
$adminBody = @{
    grant_type = "password"
    client_id = "admin-cli"
    username = "admin"
    password = "admin123"
}

try {
    $adminToken = Invoke-RestMethod -Uri $adminTokenUrl -Method Post -Body $adminBody -ContentType "application/x-www-form-urlencoded"
    Write-Host "  SUCCESS: Admin token obtained" -ForegroundColor Green
    $token = $adminToken.access_token
} catch {
    Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Trying with 'admin' password..." -ForegroundColor Yellow
    
    $adminBody.password = "admin"
    try {
        $adminToken = Invoke-RestMethod -Uri $adminTokenUrl -Method Post -Body $adminBody -ContentType "application/x-www-form-urlencoded"
        Write-Host "  SUCCESS: Admin token obtained with 'admin' password" -ForegroundColor Green
        $token = $adminToken.access_token
    } catch {
        Write-Host "  FAILED: Cannot authenticate as admin" -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

# Test 2: List clients in eprescription realm
Write-Host "2. Listing clients in eprescription realm..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
}

try {
    $clients = Invoke-RestMethod -Uri "$keycloakUrl/admin/realms/eprescription/clients" -Method Get -Headers $headers
    Write-Host "  SUCCESS: Found $($clients.Count) clients" -ForegroundColor Green
    foreach ($client in $clients) {
        Write-Host "    - $($client.clientId)" -ForegroundColor Gray
    }
} catch {
    Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: List users in eprescription realm
Write-Host "3. Listing users in eprescription realm..." -ForegroundColor Yellow
try {
    $users = Invoke-RestMethod -Uri "$keycloakUrl/admin/realms/eprescription/users" -Method Get -Headers $headers
    Write-Host "  SUCCESS: Found $($users.Count) users" -ForegroundColor Green
    foreach ($user in $users) {
        Write-Host "    - $($user.username) (enabled: $($user.enabled))" -ForegroundColor Gray
    }
} catch {
    Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== Summary ===" -ForegroundColor Cyan
Write-Host "Keycloak is accessible and admin credentials work" -ForegroundColor Green
Write-Host ""
