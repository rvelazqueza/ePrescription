# Script de validacion completa de Tasks 1-8
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VALIDACION COMPLETA TASKS 1-8" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$passed = 0
$failed = 0

function Test-Item {
    param($name, $test)
    Write-Host "Probando: $name" -NoNewline
    if ($test) {
        Write-Host " [OK]" -ForegroundColor Green
        $script:passed++
        return $true
    } else {
        Write-Host " [FALLO]" -ForegroundColor Red
        $script:failed++
        return $false
    }
}

# TASK 1-3: Docker Compose y Contenedores
Write-Host "`n=== TASK 1-3: Infraestructura Docker ===" -ForegroundColor Yellow
$containers = docker ps --format "{{.Names}},{{.Status}}"
Test-Item "Oracle DB corriendo" ($containers -match "eprescription-oracle-db.*healthy")
Test-Item "Keycloak corriendo" ($containers -match "eprescription-keycloak.*healthy")
Test-Item "Backend API corriendo" ($containers -match "eprescription-backend-api.*healthy")

# TASK 4: Oracle Database
Write-Host "`n=== TASK 4: Oracle Database ===" -ForegroundColor Yellow
try {
    $oracleTest = docker exec eprescription-oracle-db bash -c "echo 'SELECT 1 FROM DUAL;' | sqlplus -s sys/OraclePassword123!@//localhost:1521/XEPDB1 as sysdba" 2>&1
    Test-Item "Oracle responde a queries" ($oracleTest -match "1")
} catch {
    Test-Item "Oracle responde a queries" $false
}

# TASK 5: Backend API Basico
Write-Host "`n=== TASK 5: Backend API Basico ===" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health"
    Test-Item "Health endpoint" ($health.status -eq "healthy")
} catch {
    Test-Item "Health endpoint" $false
}

try {
    $swagger = Invoke-RestMethod -Uri "http://localhost:5000/swagger/v1/swagger.json"
    Test-Item "Swagger JSON" ($swagger.openapi -eq "3.0.1")
    Test-Item "Swagger UI" ($swagger.info.title -eq "EPrescription API")
} catch {
    Test-Item "Swagger JSON" $false
    Test-Item "Swagger UI" $false
}

# TASK 6-7: Keycloak y Autenticacion
Write-Host "`n=== TASK 6-7: Keycloak y Autenticacion ===" -ForegroundColor Yellow
try {
    $keycloak = Invoke-WebRequest -Uri "http://localhost:8080/" -UseBasicParsing
    Test-Item "Keycloak web UI" ($keycloak.StatusCode -eq 200)
} catch {
    Test-Item "Keycloak web UI" $false
}

try {
    $keycloakHealth = Invoke-WebRequest -Uri "http://localhost:9000/health/ready" -UseBasicParsing
    Test-Item "Keycloak health endpoint" ($keycloakHealth.StatusCode -eq 200)
} catch {
    Test-Item "Keycloak health endpoint" $false
}

# Verificar endpoints de autenticacion
$authEndpoints = @("/api/Auth/login", "/api/Auth/refresh", "/api/Auth/logout", "/api/Auth/userinfo")
foreach ($endpoint in $authEndpoints) {
    try {
        Invoke-WebRequest -Uri "http://localhost:5000$endpoint" -Method POST -UseBasicParsing -ErrorAction Stop | Out-Null
        Test-Item "Endpoint $endpoint existe" $false
    } catch {
        Test-Item "Endpoint $endpoint existe" ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 400)
    }
}

# TASK 8: Sistema de Autorizacion
Write-Host "`n=== TASK 8: Sistema de Autorizacion ===" -ForegroundColor Yellow

# Verificar endpoints de roles
try {
    Invoke-WebRequest -Uri "http://localhost:5000/api/Roles" -UseBasicParsing -ErrorAction Stop | Out-Null
    Test-Item "Endpoint /api/Roles protegido" $false
} catch {
    Test-Item "Endpoint /api/Roles protegido" ($_.Exception.Response.StatusCode -eq 401)
}

# Verificar endpoints de permisos
try {
    Invoke-WebRequest -Uri "http://localhost:5000/api/Permissions" -UseBasicParsing -ErrorAction Stop | Out-Null
    Test-Item "Endpoint /api/Permissions protegido" $false
} catch {
    Test-Item "Endpoint /api/Permissions protegido" ($_.Exception.Response.StatusCode -eq 401)
}

# Verificar endpoints de ejemplos
$exampleEndpoints = @(
    "/api/Examples/system-config",
    "/api/Examples/patient-record/123",
    "/api/Examples/view-prescription/456",
    "/api/Examples/create-prescription",
    "/api/Examples/dispense-medication"
)

foreach ($endpoint in $exampleEndpoints) {
    try {
        Invoke-WebRequest -Uri "http://localhost:5000$endpoint" -UseBasicParsing -ErrorAction Stop | Out-Null
        Test-Item "Endpoint $endpoint protegido" $false
    } catch {
        Test-Item "Endpoint $endpoint protegido" ($_.Exception.Response.StatusCode -eq 401)
    }
}

# Verificar archivos criticos
Write-Host "`n=== Archivos Criticos ===" -ForegroundColor Yellow
$files = @(
    "docker-compose.yml",
    "eprescription-API/Dockerfile",
    "eprescription-API/src/ePrescription.API/Program.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Persistence/EPrescriptionDbContext.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Authentication/KeycloakAuthenticationService.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Authorization/AuthorizationService.cs",
    "eprescription-API/src/ePrescription.API/Controllers/AuthController.cs",
    "eprescription-API/src/ePrescription.API/Controllers/RolesController.cs",
    "eprescription-API/src/ePrescription.API/Controllers/PermissionsController.cs",
    "eprescription-API/src/ePrescription.API/Controllers/ExamplesController.cs"
)

foreach ($file in $files) {
    Test-Item "Archivo $file" (Test-Path $file)
}

# Resumen
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE VALIDACION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pruebas pasadas: $passed" -ForegroundColor Green
Write-Host "Pruebas fallidas: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($failed -eq 0) {
    Write-Host "EXITO: Todas las tasks 1-8 estan funcionando correctamente!" -ForegroundColor Green
} else {
    Write-Host "ATENCION: Algunas pruebas fallaron. Revisa los detalles arriba." -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "URLs IMPORTANTES:" -ForegroundColor Cyan
Write-Host "  Swagger UI:     http://localhost:5000" -ForegroundColor White
Write-Host "  API Health:     http://localhost:5000/health" -ForegroundColor White
Write-Host "  Keycloak Admin: http://localhost:8080" -ForegroundColor White
Write-Host "  Oracle DB:      localhost:1521/XEPDB1" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
