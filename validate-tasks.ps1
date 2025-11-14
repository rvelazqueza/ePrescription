# Script de validacion integral para Tasks 1-8
Write-Host "========================================"
Write-Host "  VALIDACION DE TASKS 1-8"
Write-Host "========================================"
Write-Host ""

$allTestsPassed = $true

# Task 1-3: Validar contenedores Docker
Write-Host "Task 1-3: Validando contenedores Docker..."
$containers = docker ps --format "{{.Names}},{{.Status}}"
$requiredContainers = @("eprescription-oracle-db", "eprescription-keycloak", "eprescription-backend-api")

foreach ($container in $requiredContainers) {
    $found = $containers | Select-String $container
    if ($found -and $found -match "healthy|Up") {
        Write-Host "  OK: $container esta corriendo" -ForegroundColor Green
    } else {
        Write-Host "  ERROR: $container NO esta corriendo" -ForegroundColor Red
        $allTestsPassed = $false
    }
}
Write-Host ""

# Task 5: Validar Backend API - Health Check
Write-Host "Task 5: Validando Backend API..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "  OK: API Health endpoint responde" -ForegroundColor Green
    }
} catch {
    Write-Host "  ERROR: API no responde" -ForegroundColor Red
    $allTestsPassed = $false
}
Write-Host ""

# Task 5: Validar Swagger
Write-Host "Task 5: Validando Swagger UI..."
try {
    $swaggerResponse = Invoke-WebRequest -Uri "http://localhost:5000/swagger/index.html" -UseBasicParsing
    if ($swaggerResponse.StatusCode -eq 200) {
        Write-Host "  OK: Swagger UI esta disponible" -ForegroundColor Green
    }
} catch {
    Write-Host "  ERROR: Swagger UI no esta disponible" -ForegroundColor Red
    $allTestsPassed = $false
}
Write-Host ""

# Task 6-7: Validar Keycloak
Write-Host "Task 6-7: Validando Keycloak..."
try {
    $keycloakResponse = Invoke-WebRequest -Uri "http://localhost:8080/" -UseBasicParsing
    if ($keycloakResponse.StatusCode -eq 200) {
        Write-Host "  OK: Keycloak esta respondiendo" -ForegroundColor Green
    }
} catch {
    Write-Host "  ERROR: Keycloak no responde" -ForegroundColor Red
    $allTestsPassed = $false
}
Write-Host ""

# Task 8: Validar endpoint publico
Write-Host "Task 8: Validando endpoint publico..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/examples/public" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "  OK: Endpoint publico es accesible" -ForegroundColor Green
    }
} catch {
    Write-Host "  ERROR: Endpoint publico no es accesible" -ForegroundColor Red
    $allTestsPassed = $false
}
Write-Host ""

# Task 8: Validar endpoint protegido
Write-Host "Task 8: Validando endpoints protegidos..."
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/examples/authenticated" -UseBasicParsing -ErrorAction Stop
    Write-Host "  ERROR: Endpoint protegido NO requiere autenticacion" -ForegroundColor Red
    $allTestsPassed = $false
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "  OK: Endpoint protegido requiere autenticacion" -ForegroundColor Green
    } else {
        Write-Host "  WARNING: Endpoint protegido responde con codigo inesperado" -ForegroundColor Yellow
    }
}
Write-Host ""

# Resumen final
Write-Host "========================================"
if ($allTestsPassed) {
    Write-Host "  TODAS LAS VALIDACIONES PASARON" -ForegroundColor Green
} else {
    Write-Host "  ALGUNAS VALIDACIONES FALLARON" -ForegroundColor Red
}
Write-Host "========================================"
Write-Host ""
Write-Host "URLs importantes:"
Write-Host "  - Swagger UI: http://localhost:5000"
Write-Host "  - Keycloak Admin: http://localhost:8080"
Write-Host "  - API Health: http://localhost:5000/health"
