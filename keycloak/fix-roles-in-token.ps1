# Fix: Make roles appear in JWT token
$KeycloakUrl = "http://localhost:8080"
$Realm = "eprescription"

Write-Host "Fixing Roles in Token Configuration" -ForegroundColor Cyan
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
try {
    $tokenResponse = Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $tokenBody -ContentType "application/x-www-form-urlencoded"
    $token = $tokenResponse.access_token
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)"
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Get client ID
Write-Host "Finding client..." -NoNewline
$clientsUrl = "$KeycloakUrl/admin/realms/$Realm/clients"
$clients = Invoke-RestMethod -Uri $clientsUrl -Method Get -Headers $headers
$client = $clients | Where-Object { $_.clientId -eq "eprescription-api" }

if (-not $client) {
    Write-Host " NOT FOUND" -ForegroundColor Red
    exit 1
}

$clientUuid = $client.id
Write-Host " OK" -ForegroundColor Green

# Add protocol mapper
Write-Host "Adding realm roles mapper..." -NoNewline
$mappersUrl = "$KeycloakUrl/admin/realms/$Realm/clients/$clientUuid/protocol-mappers/models"

$mapperConfig = @{
    name = "realm-roles-mapper"
    protocol = "openid-connect"
    protocolMapper = "oidc-usermodel-realm-role-mapper"
    consentRequired = $false
    config = @{
        "claim.name" = "realm_access.roles"
        "jsonType.label" = "String"
        "multivalued" = "true"
        "access.token.claim" = "true"
        "id.token.claim" = "true"
        "userinfo.token.claim" = "true"
    }
} | ConvertTo-Json -Depth 10

try {
    Invoke-RestMethod -Uri $mappersUrl -Method Post -Headers $headers -Body $mapperConfig
    Write-Host " OK" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*Conflict*" -or $_.Exception.Message -like "*409*") {
        Write-Host " Already exists" -ForegroundColor Yellow
    } else {
        Write-Host " FAILED" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)"
    }
}

Write-Host ""
Write-Host "Done! Now test:" -ForegroundColor Green
Write-Host ".\test-keycloak-auth.ps1 -Username 'doctor1' -Password 'doctor123'" -ForegroundColor White
