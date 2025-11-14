# Script de validación integral para Tasks 1-8
# Valida que toda la infraestructura y funcionalidad básica esté funcionando

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VALIDACIÓN DE TASKS 1-8" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allTestsPassed = $true

# Task 1-3: Validar contenedores Docker
Write-Host "[Task 1-3] Validando contenedores Docker..." -ForegroundColor Yellow
$containers = docker ps --format "{{.Names}},{{.Status}}"
$requiredContainers = @("eprescription-oracle-db", "eprescription-keycloak", "eprescription-backend-api")

foreach ($container in $requiredContainers) {
    $found = $containers | Select-String $container
    if ($found -and $found -match "healthy|Up") {
        Write-Host "  ✓ $container está corriendo" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $container NO está corriendo o no está healthy" -ForegroundColor Red
        $allTestsPassed = $false
    }
}
Write-Host ""

# Task 4: Validar Oracle Database
Write-Host "[Task 4] Validando Oracle Database..." -ForegroundColor Yellow
try {
    $oracleTest = docker exec eprescription-oracle-db bash -c "echo 'SELECT 1 FROM DUAL;' | sqlplus -s sys/OraclePassword123!@//localhost:1521/XEPDB1 as sysdba" 2>&1
    if ($oracleTest -match "1") {
        Write-Host "  ✓ Oracle Database responde correctamente" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Oracle Database no responde" -ForegroundColor Red
        $allTestsPassed = $false
    }
} catch {
    Write-Host "  ✗ Error al conectar con Oracle: $_" -ForegroundColor Red
    $allTestsPassed = $false
}
Write-Host ""

# Task 5: Validar Backend API - Health Check
Write-Host "[Task 5] Validando Backend API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        $content = $response.Content | ConvertFrom-Json
        if ($content.status -eq "healthy") {
            Write-Host "  ✓ API Health endpoint responde: $($content.status)" -ForegroundColor Green
        } else {
            Write-Host "  ✗ API Health endpoint responde pero status no es healthy" -ForegroundColor Red
            $allTestsPassed = $false
        }
    }
} catch {
    Write-Host "  ✗ API no responde en http://localhost:5000/health" -ForegroundColor Red
    $allTestsPassed = $false
}
Write-Host ""

# Task 5: Validar Swagger
Write-Host "[Task 5] Validando Swagger UI..." -ForegroundColor Yellow
try {
    $swaggerResponse = Invoke-WebRequest -Uri "http://localhost:5000/swagger/index.html" -UseBasicParsing
    if ($swaggerResponse.StatusCode -eq 200) {
        Write-Host "  ✓ Swagger UI está disponible" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Swagger UI no está disponible" -ForegroundColor Red
    $allTestsPassed = $false
}
Write-Host ""

# Task 6-7: Validar Keycloak
Write-Host "[Task 6-7] Validando Keycloak..." -ForegroundColor Yellow
try {
    $keycloakResponse = Invoke-WebRequest -Uri "http://localhost:8080/" -UseBasicParsing
    if ($keycloakResponse.StatusCode -eq 200) {
        Write-Host "  ✓ Keycloak está respondiendo" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Keycloak no responde" -ForegroundColor Red
    $allTestsPassed = $false
}

# Validar health endpoint de Keycloak
try {
    $keycloakHealth = Invoke-WebRequest -Uri "http://localhost:9000/health/ready" -UseBasicParsing
    if ($keycloakHealth.StatusCode -eq 200) {
        Write-Host "  ✓ Keycloak health endpoint responde" -ForegroundColor Green
    }
} catch {
    Write-Host "  ⚠ Keycloak health endpoint no responde (puede ser normal)" -ForegroundColor Yellow
}
Write-Host ""

# Task 7: Validar endpoints de autenticación
Write-Host "[Task 7] Validando endpoints de autenticación..." -ForegroundColor Yellow
$authEndpoints = @(
    "/api/auth/login",
    "/api/auth/refresh",
    "/api/auth/logout",
    "/api/auth/user-info"
)

foreach ($endpoint in $authEndpoints) {
    try {
        # Intentar acceder sin autenticación (debería dar 401)
        $response = Invoke-WebRequest -Uri "http://localhost:5000$endpoint" -Method POST -UseBasicParsing -ErrorAction SilentlyContinue
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401 -or $_.Exception.Response.StatusCode -eq 400) {
            Write-Host "  ✓ Endpoint $endpoint existe y requiere autenticación" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Endpoint $endpoint responde con código inesperado" -ForegroundColor Yellow
        }
    }
}
Write-Host ""

# Task 8: Validar endpoints de autorización
Write-Host "[Task 8] Validando endpoints de autorización..." -ForegroundColor Yellow
$authzEndpoints = @(
    "/api/roles",
    "/api/permissions"
)

foreach ($endpoint in $authzEndpoints) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000$endpoint" -UseBasicParsing -ErrorAction SilentlyContinue
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "  ✓ Endpoint $endpoint existe y requiere autenticación" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Endpoint $endpoint responde con código: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        }
    }
}
Write-Host ""

# Task 8: Validar ejemplos de autorización
Write-Host "[Task 8] Validando endpoints de ejemplos..." -ForegroundColor Yellow
$exampleEndpoints = @(
    "/api/examples/public",
    "/api/examples/authenticated",
    "/api/examples/admin-only",
    "/api/examples/doctor-or-pharmacist",
    "/api/examples/prescribe-medication"
)

foreach ($endpoint in $exampleEndpoints) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000$endpoint" -UseBasicParsing -ErrorAction SilentlyContinue
        if ($endpoint -eq "/api/examples/public") {
            Write-Host "  ✓ Endpoint público $endpoint es accesible" -ForegroundColor Green
        }
    } catch {
        if ($endpoint -ne "/api/examples/public" -and $_.Exception.Response.StatusCode -eq 401) {
            Write-Host "  ✓ Endpoint protegido $endpoint requiere autenticación" -ForegroundColor Green
        } elseif ($endpoint -eq "/api/examples/public") {
            Write-Host "  ✗ Endpoint público $endpoint no es accesible" -ForegroundColor Red
            $allTestsPassed = $false
        }
    }
}
Write-Host ""

# Validar estructura de archivos críticos
Write-Host "[Estructura] Validando archivos críticos..." -ForegroundColor Yellow
$criticalFiles = @(
    "docker-compose.yml",
    "eprescription-API/Dockerfile",
    "eprescription-API/src/ePrescription.API/Program.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Persistence/EPrescriptionDbContext.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Authentication/KeycloakAuthenticationService.cs",
    "eprescription-API/src/ePrescription.Infrastructure/Authorization/AuthorizationService.cs"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file existe" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file NO existe" -ForegroundColor Red
        $allTestsPassed = $false
    }
}
Write-Host ""

# Resumen final
Write-Host "========================================" -ForegroundColor Cyan
if ($allTestsPassed) {
    Write-Host "  ✓ TODAS LAS VALIDACIONES PASARON" -ForegroundColor Green
    Write-Host "  Las Tasks 1-8 están funcionando correctamente" -ForegroundColor Green
} else {
    Write-Host "  ✗ ALGUNAS VALIDACIONES FALLARON" -ForegroundColor Red
    Write-Host "  Revisa los errores arriba" -ForegroundColor Red
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Información adicional
Write-Host "Información adicional:" -ForegroundColor Cyan
Write-Host "  - Swagger UI: http://localhost:5000" -ForegroundColor White
Write-Host "  - Keycloak Admin: http://localhost:8080" -ForegroundColor White
Write-Host "  - API Health: http://localhost:5000/health" -ForegroundColor White
Write-Host ""
