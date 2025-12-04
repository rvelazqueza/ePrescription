# Test Keycloak Doctor Login
Write-Host "=== Testing Keycloak Doctor Login ===" -ForegroundColor Cyan

$keycloakUrl = "http://localhost:8080"
$realm = "eprescription"

# Test 1: Verify Keycloak is accessible
Write-Host "`n1. Verificando Keycloak..." -ForegroundColor Yellow
try {
    $realmInfo = Invoke-RestMethod -Uri "$keycloakUrl/realms/$realm" -Method GET
    Write-Host "✅ Keycloak realm '$realm' accesible" -ForegroundColor Green
} catch {
    Write-Host "❌ Keycloak no accesible: $_" -ForegroundColor Red
    exit 1
}

# Test 2: Try direct login with Keycloak
Write-Host "`n2. Intentando login directo con Keycloak..." -ForegroundColor Yellow
$loginData = @{
    username = "doctor"
    password = "doctor123"
    grant_type = "password"
    client_id = "eprescription-client"
}

try {
    $tokenResponse = Invoke-RestMethod -Uri "$keycloakUrl/realms/$realm/protocol/openid-connect/token" `
        -Method POST `
        -Body $loginData `
        -ContentType "application/x-www-form-urlencoded"
    
    Write-Host "✅ Login exitoso con Keycloak!" -ForegroundColor Green
    Write-Host "Token recibido: $($tokenResponse.access_token.Substring(0, 50))..." -ForegroundColor Gray
    
    # Test 3: Try login through API
    Write-Host "`n3. Intentando login a través del API..." -ForegroundColor Yellow
    $apiLoginData = @{
        username = "doctor"
        password = "doctor123"
    } | ConvertTo-Json
    
    try {
        $apiResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login" `
            -Method POST `
            -Body $apiLoginData `
            -ContentType "application/json"
        
        Write-Host "✅ Login exitoso a través del API!" -ForegroundColor Green
        Write-Host "User: $($apiResponse.user.username)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Login falló a través del API" -ForegroundColor Red
        Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        Write-Host "Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Login falló con Keycloak directamente" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "`nEl usuario 'doctor' probablemente no existe o la contraseña es incorrecta" -ForegroundColor Yellow
    Write-Host "Ejecuta: ./keycloak/create-and-reset-users.ps1" -ForegroundColor Cyan
}
