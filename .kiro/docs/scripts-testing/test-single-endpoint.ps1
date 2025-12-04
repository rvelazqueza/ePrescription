# Script simple para probar un endpoint especifico con autenticacion

param(
    [string]$Username = "doctor1",
    [string]$Password = "doctor123",
    [string]$Endpoint = "/api/prescriptions",
    [string]$Method = "GET"
)

$KEYCLOAK_URL = "http://localhost:8080"
$API_URL = "http://localhost:8000"
$REALM = "eprescription"
$CLIENT_ID = "eprescription-api"
$CLIENT_SECRET = "Q7frqJfqjUaU73rKni061qpE9KDrbGL0"

Write-Host "=== Prueba de Endpoint Individual ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Usuario: $Username" -ForegroundColor Gray
Write-Host "Endpoint: $Method $Endpoint" -ForegroundColor Gray
Write-Host ""

# 1. Obtener token
Write-Host "1. Obteniendo token..." -ForegroundColor Yellow
try {
    $tokenResponse = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/$REALM/protocol/openid-connect/token" `
        -Method Post `
        -ContentType "application/x-www-form-urlencoded" `
        -Body @{
            username = $Username
            password = $Password
            grant_type = "password"
            client_id = $CLIENT_ID
            client_secret = $CLIENT_SECRET
            scope = "openid profile email"
        }
    
    $token = $tokenResponse.access_token
    Write-Host "   Token obtenido exitosamente" -ForegroundColor Green
    Write-Host "   Expira en: $($tokenResponse.expires_in) segundos" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "   Error obteniendo token: $_" -ForegroundColor Red
    exit 1
}

# 2. Llamar al endpoint
Write-Host "2. Llamando al endpoint..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$API_URL$Endpoint" `
        -Method $Method `
        -Headers $headers
    
    Write-Host "   Respuesta exitosa!" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== Respuesta ===" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 5
    Write-Host ""
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "   Error: Status $statusCode" -ForegroundColor Red
    Write-Host "   Detalles: $($_.Exception.Message)" -ForegroundColor Red
    
    # Intentar leer el cuerpo de la respuesta de error
    try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $errorBody = $reader.ReadToEnd()
        Write-Host ""
        Write-Host "=== Cuerpo del Error ===" -ForegroundColor Yellow
        Write-Host $errorBody
    } catch {
        # No hay cuerpo de error
    }
}

Write-Host ""
Write-Host "=== Token para uso manual ===" -ForegroundColor Cyan
Write-Host $token
Write-Host ""
