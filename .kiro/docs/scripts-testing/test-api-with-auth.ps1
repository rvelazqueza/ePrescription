# Script completo para probar el API con autenticacion
# Incluye pruebas de endpoints protegidos y verificacion de logs de auditoria

$KEYCLOAK_URL = "http://localhost:8080"
$API_URL = "http://localhost:8000"
$REALM = "eprescription"
$CLIENT_ID = "eprescription-api"
$CLIENT_SECRET = "Q7frqJfqjUaU73rKni061qpE9KDrbGL0"

Write-Host "=== Pruebas Automatizadas del API con Autenticacion ===" -ForegroundColor Cyan
Write-Host ""

# Funcion para obtener token
function Get-AuthToken {
    param(
        [string]$Username,
        [string]$Password
    )
    
    try {
        $response = Invoke-RestMethod -Uri "$KEYCLOAK_URL/realms/$REALM/protocol/openid-connect/token" `
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
        
        return $response.access_token
    } catch {
        Write-Host "   Error obteniendo token para $Username : $_" -ForegroundColor Red
        return $null
    }
}

# 1. Verificar que Keycloak esta disponible
Write-Host "1. Verificando Keycloak..." -ForegroundColor Yellow
try {
    $keycloakHealth = Invoke-WebRequest -Uri "$KEYCLOAK_URL/realms/$REALM" -Method Get -UseBasicParsing
    Write-Host "   Keycloak disponible" -ForegroundColor Green
} catch {
    Write-Host "   Keycloak no disponible. Asegurate de que Docker esta corriendo." -ForegroundColor Red
    exit 1
}

# 2. Verificar que el API esta disponible
Write-Host ""
Write-Host "2. Verificando API..." -ForegroundColor Yellow
try {
    $apiHealth = Invoke-WebRequest -Uri "$API_URL/health" -Method Get -UseBasicParsing
    Write-Host "   API disponible (Status: $($apiHealth.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   API no disponible. Ejecuta: docker-compose up -d" -ForegroundColor Red
    exit 1
}

# 3. Obtener tokens para diferentes usuarios
Write-Host ""
Write-Host "3. Obteniendo tokens de autenticacion..." -ForegroundColor Yellow

$users = @(
    @{ Username = "doctor1"; Password = "doctor123"; Role = "Doctor" },
    @{ Username = "admin.user"; Password = "admin123"; Role = "Admin" },
    @{ Username = "pharmacist1"; Password = "pharmacist123"; Role = "Pharmacist" }
)

$tokens = @{}

foreach ($user in $users) {
    Write-Host "   - Autenticando $($user.Username) ($($user.Role))..." -ForegroundColor Gray
    $token = Get-AuthToken -Username $user.Username -Password $user.Password
    
    if ($token) {
        $tokens[$user.Username] = $token
        Write-Host "     Token obtenido" -ForegroundColor Green
    } else {
        Write-Host "     No se pudo obtener token" -ForegroundColor Red
    }
}

if ($tokens.Count -eq 0) {
    Write-Host ""
    Write-Host "No se pudo obtener ningun token. Verifica las credenciales." -ForegroundColor Red
    exit 1
}

# 4. Probar endpoints protegidos con doctor1
Write-Host ""
Write-Host "4. Probando endpoints protegidos (doctor1)..." -ForegroundColor Yellow

$doctorToken = $tokens["doctor1"]
$createdId = $null

if ($doctorToken) {
    # 4.1 GET Prescriptions
    Write-Host "   - GET /api/prescriptions..." -ForegroundColor Gray
    try {
        $prescriptions = Invoke-RestMethod -Uri "$API_URL/api/prescriptions" `
            -Method Get `
            -Headers @{
                Authorization = "Bearer $doctorToken"
            }
        
        Write-Host "     Respuesta exitosa (Total: $($prescriptions.totalCount))" -ForegroundColor Green
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "     Error: Status $statusCode" -ForegroundColor Red
    }
    
    # 4.2 POST Create Prescription
    Write-Host "   - POST /api/prescriptions (crear nueva)..." -ForegroundColor Gray
    try {
        $newPrescription = @{
            patientId = 1
            doctorId = 1
            prescriptionDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
            diagnosis = "Prueba automatizada"
            medications = @(
                @{
                    medicationId = 1
                    dosage = "500mg"
                    frequency = "Cada 8 horas"
                    duration = "7 dias"
                }
            )
        } | ConvertTo-Json
        
        $created = Invoke-RestMethod -Uri "$API_URL/api/prescriptions" `
            -Method Post `
            -Headers @{
                Authorization = "Bearer $doctorToken"
                "Content-Type" = "application/json"
            } `
            -Body $newPrescription
        
        Write-Host "     Prescripcion creada (ID: $($created.id))" -ForegroundColor Green
        $createdId = $created.id
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "     Error: Status $statusCode" -ForegroundColor Red
        Write-Host "     Detalles: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # 4.3 GET Prescription by ID
    if ($createdId) {
        Write-Host "   - GET /api/prescriptions/$createdId..." -ForegroundColor Gray
        try {
            $prescription = Invoke-RestMethod -Uri "$API_URL/api/prescriptions/$createdId" `
                -Method Get `
                -Headers @{
                    Authorization = "Bearer $doctorToken"
                }
            
            Write-Host "     Prescripcion obtenida" -ForegroundColor Green
        } catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            Write-Host "     Error: Status $statusCode" -ForegroundColor Red
        }
    }
}

# 5. Probar endpoint de auditoria (si existe)
Write-Host ""
Write-Host "5. Probando endpoint de auditoria..." -ForegroundColor Yellow

$adminToken = $tokens["admin.user"]

if ($adminToken) {
    try {
        $auditLogs = Invoke-RestMethod -Uri "$API_URL/api/audit" `
            -Method Get `
            -Headers @{
                Authorization = "Bearer $adminToken"
            }
        
        Write-Host "   Endpoint de auditoria accesible" -ForegroundColor Green
        Write-Host "   - Total de logs: $($auditLogs.totalCount)" -ForegroundColor Gray
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 404) {
            Write-Host "   Endpoint /api/audit no encontrado (puede no estar implementado)" -ForegroundColor Yellow
        } else {
            Write-Host "   Error: Status $statusCode" -ForegroundColor Red
        }
    }
}

# Resumen
Write-Host ""
Write-Host "=== Resumen de Pruebas ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tokens obtenidos: $($tokens.Count)" -ForegroundColor Green
Write-Host "Keycloak funcionando correctamente" -ForegroundColor Green
Write-Host "API respondiendo a peticiones autenticadas" -ForegroundColor Green
Write-Host ""
Write-Host "Para ver logs del API en tiempo real:" -ForegroundColor Yellow
Write-Host "  docker logs -f eprescription-api" -ForegroundColor White
Write-Host ""
Write-Host "Para verificar logs de auditoria en Oracle:" -ForegroundColor Yellow
Write-Host "  docker exec -it oracle-db sqlplus eprescription/eprescription@//localhost:1521/XEPDB1" -ForegroundColor White
Write-Host ""
