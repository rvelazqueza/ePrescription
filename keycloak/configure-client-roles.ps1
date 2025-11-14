# Configure Keycloak Client to Include Realm Roles in Token
$KeycloakUrl = "http://localhost:8080"
$Realm = "eprescription"
$ClientId = "eprescription-api"

Write-Host "=== Keycloak Client Role Configuration ===" -ForegroundColor Cyan
Write-Host ""

# Get admin token
Write-Host "1. Getting admin token..." -ForegroundColor Yellow
$tokenUrl = "$KeycloakUrl/realms/master/protocol/openid-connect/token"
$tokenBody = @{
    grant_type = "password"
    client_id = "admin-cli"
    username = "admin"
    password = "admin123"
}

$tokenResponse = Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $tokenBody -ContentType "application/x-www-form-urlencoded"
$token = $tokenResponse.access_token
Write-Host "   ✓ Token obtained" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Get client
Write-Host ""
Write-Host "2. Finding client '$ClientId'..." -ForegroundColor Yellow
$clientsUrl = "$KeycloakUrl/admin/realms/$Realm/clients"
$clients = Invoke-RestMethod -Uri $clientsUrl -Method Get -Headers $headers
$client = $clients | Where-Object { $_.clientId -eq $ClientId }

if (-not $client) {
    Write-Host "   ✗ Client not found!" -ForegroundColor Red
    exit 1
}

$clientUuid = $client.id
Write-Host "   ✓ Client found (ID: $clientUuid)" -ForegroundColor Green

# Get client scopes
Write-Host ""
Write-Host "3. Getting client scopes..." -ForegroundColor Yellow
$scopesUrl = "$KeycloakUrl/admin/realms/$Realm/client-scopes"
$scopes = Invoke-RestMethod -Uri $scopesUrl -Method Get -Headers $headers

# Find or create 'roles' scope
$rolesScope = $scopes | Where-Object { $_.name -eq "roles" }

if ($rolesScope) {
    $rolesScopeId = $rolesScope.id
    Write-Host "   ✓ 'roles' scope found (ID: $rolesScopeId)" -ForegroundColor Green
} else {
    Write-Host "   ℹ 'roles' scope not found, using default" -ForegroundColor Cyan
    $rolesScopeId = $null
}

# Add realm roles mapper to client
Write-Host ""
Write-Host "4. Configuring realm roles mapper..." -ForegroundColor Yellow

$mappersUrl = "$KeycloakUrl/admin/realms/$Realm/clients/$clientUuid/protocol-mappers/models"

# Check if mapper already exists
$existingMappers = Invoke-RestMethod -Uri $mappersUrl -Method Get -Headers $headers
$realmRolesMapper = $existingMappers | Where-Object { $_.name -eq "realm-roles" }

if ($realmRolesMapper) {
    Write-Host "   ℹ Realm roles mapper already exists, updating..." -ForegroundColor Cyan
    $mapperId = $realmRolesMapper.id
    $updateMapperUrl = "$mappersUrl/$mapperId"
    
    $mapperConfig = @{
        id = $mapperId
        name = "realm-roles"
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
    
    Invoke-RestMethod -Uri $updateMapperUrl -Method Put -Headers $headers -Body $mapperConfig
    Write-Host "   ✓ Mapper updated" -ForegroundColor Green
} else {
    Write-Host "   ℹ Creating new realm roles mapper..." -ForegroundColor Cyan
    
    $mapperConfig = @{
        name = "realm-roles"
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
    
    Invoke-RestMethod -Uri $mappersUrl -Method Post -Headers $headers -Body $mapperConfig
    Write-Host "   ✓ Mapper created" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Configuration Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Now test authentication again:" -ForegroundColor Yellow
Write-Host ".\test-keycloak-auth.ps1 -Username 'doctor1' -Password 'doctor123'" -ForegroundColor White
Write-Host ""
Write-Host "The token should now include realm roles!" -ForegroundColor Cyan
