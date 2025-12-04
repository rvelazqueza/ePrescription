# Test login con client secret
Write-Host "=== Testing Login con Client Secret ===" -ForegroundColor Cyan

$keycloakUrl = "http://localhost:8080"
$realm = "eprescription"
$clientId = "eprescription-api"
$clientSecret = "Q7frqJfqjUaU73rKni061qpE9KDrbGL0"

# Test 1: Login directo con Keycloak usando client secret
Write-Host "`n1. Probando login directo con Keycloak..." -ForegroundColor Yellow
$loginData = @{
    username = "doctor"
    password = "doctor123"
    grant_type = "password"
    client_id = $clientId
    client_secret = $clientSecret
}

try {
    $tokenResponse = Invoke-RestMethod -Uri "$keycloakUrl/realms/$realm/protocol/openid-connect/token" `
        -Method POST `
        -Body $loginData `
        -ContentType "application/x-www-form-urlencoded"
    
    Write-Host "✅ Login exitoso con Keycloak!" -ForegroundColor Green
    Write-Host "Token: $($tokenResponse.access_token.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "Expira en: $($tokenResponse.expires_in) segundos" -ForegroundColor Gray
    
    # Test 2: Login a través del API
    Write-Host "`n2. Probando login a través del API..." -ForegroundColor Yellow
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
        Write-Host "Usuario: $($apiResponse.user.username)" -ForegroundColor Cyan
        Write-Host "Rol: $($apiResponse.user.role)" -ForegroundColor Cyan
        Write-Host "Token: $($apiResponse.token.Substring(0, 50))..." -ForegroundColor Gray
        
        Write-Host "`n=== ✅ TODO FUNCIONA CORRECTAMENTE ===" -ForegroundColor Green
        Write-Host "`nAhora puedes hacer login desde el frontend con:" -ForegroundColor Yellow
        Write-Host "  Username: doctor" -ForegroundColor White
        Write-Host "  Password: doctor123" -ForegroundColor White
        
    } catch {
        Write-Host "❌ Login falló a través del API" -ForegroundColor Red
        Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
        
        # Ver logs del API
        Write-Host "`nVerificando logs del API..." -ForegroundColor Yellow
        docker logs --tail 20 eprescription-api
    }
    
} catch {
    Write-Host "❌ Login falló con Keycloak" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "`nPosibles causas:" -ForegroundColor Yellow
    Write-Host "1. El usuario 'doctor' no existe" -ForegroundColor White
    Write-Host "2. La contraseña es incorrecta" -ForegroundColor White
    Write-Host "3. El client secret no coincide" -ForegroundColor White
    Write-Host "`nEjecuta: ./keycloak/diagnose-and-fix-login.ps1" -ForegroundColor Cyan
}
