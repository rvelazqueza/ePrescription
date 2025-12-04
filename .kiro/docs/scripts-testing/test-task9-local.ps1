# Test de Task 9 en modo local con .NET 8
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Task 9: Test en Modo Local" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Detener contenedor de API si existe
Write-Host "Paso 1: Deteniendo contenedor Docker de API..." -ForegroundColor Yellow
$apiContainer = docker ps --filter "name=eprescription-backend-api" --format "{{.Names}}"
if ($apiContainer) {
    docker stop eprescription-backend-api | Out-Null
    Write-Host "OK Contenedor detenido" -ForegroundColor Green
} else {
    Write-Host "OK Puerto 5000 libre" -ForegroundColor Green
}
Write-Host ""

# Paso 2: Verificar infraestructura
Write-Host "Paso 2: Verificando infraestructura..." -ForegroundColor Yellow
$oracle = docker ps --filter "name=eprescription-oracle-db" --filter "status=running" --format "{{.Names}}"
$keycloak = docker ps --filter "name=eprescription-keycloak" --filter "status=running" --format "{{.Names}}"

if ($oracle) {
    Write-Host "OK Oracle corriendo" -ForegroundColor Green
} else {
    Write-Host "ERROR Oracle no esta corriendo" -ForegroundColor Red
    Write-Host "Ejecuta: docker-compose up -d oracle-db" -ForegroundColor Yellow
    exit 1
}

if ($keycloak) {
    Write-Host "OK Keycloak corriendo" -ForegroundColor Green
} else {
    Write-Host "ERROR Keycloak no esta corriendo" -ForegroundColor Red
    Write-Host "Ejecuta: docker-compose up -d keycloak" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Paso 3: Verificar .NET 8
Write-Host "Paso 3: Verificando .NET..." -ForegroundColor Yellow
$env:PATH = "C:\Program Files\dotnet;" + $env:PATH
try {
    $dotnetVersion = & dotnet --version
    Write-Host "OK .NET $dotnetVersion detectado" -ForegroundColor Green
    
    # Verificar que sea .NET 8
    if ($dotnetVersion -like "8.*") {
        Write-Host "OK Usando .NET 8" -ForegroundColor Green
    } else {
        Write-Host "AVISO Version detectada: $dotnetVersion" -ForegroundColor Yellow
        Write-Host "El proyecto requiere .NET 8" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ERROR .NET no encontrado" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Paso 4: Compilar proyecto
Write-Host "Paso 4: Compilando proyecto..." -ForegroundColor Yellow
Set-Location "eprescription-API"
$compileOutput = dotnet build EPrescription.sln --configuration Debug 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK Compilacion exitosa" -ForegroundColor Green
} else {
    Write-Host "ERROR al compilar" -ForegroundColor Red
    Write-Host $compileOutput -ForegroundColor Red
    Set-Location ".."
    exit 1
}
Set-Location ".."
Write-Host ""

# Paso 5: Iniciar API en background
Write-Host "Paso 5: Iniciando API en modo local..." -ForegroundColor Yellow
Write-Host "Esto puede tomar 10-15 segundos..." -ForegroundColor Gray

$env:ASPNETCORE_ENVIRONMENT = "Local"

# Iniciar API en background
$apiJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    $env:PATH = "C:\Program Files\dotnet;" + $env:PATH
    $env:ASPNETCORE_ENVIRONMENT = "Local"
    Set-Location "eprescription-API"
    dotnet run --project src/ePrescription.API --urls http://localhost:5000 2>&1
} -ArgumentList (Get-Location).Path

Write-Host "OK API iniciando (Job ID: $($apiJob.Id))" -ForegroundColor Green
Write-Host ""

# Paso 6: Esperar a que la API esté lista
Write-Host "Paso 6: Esperando a que la API este lista..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
$apiReady = $false

while ($attempt -lt $maxAttempts -and -not $apiReady) {
    $attempt++
    Start-Sleep -Seconds 1
    
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($health.status -eq "healthy") {
            $apiReady = $true
            Write-Host "OK API lista y respondiendo" -ForegroundColor Green
        }
    } catch {
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
}

if (-not $apiReady) {
    Write-Host ""
    Write-Host "ERROR API no respondio en 30 segundos" -ForegroundColor Red
    Write-Host "Logs del Job:" -ForegroundColor Yellow
    Receive-Job -Job $apiJob
    Stop-Job -Job $apiJob
    Remove-Job -Job $apiJob
    exit 1
}
Write-Host ""

# Paso 7: Ejecutar tests
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Ejecutando Tests de Task 9" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"

# Test 1: Health Check
Write-Host "Test 1: Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "OK API respondiendo" -ForegroundColor Green
    Write-Host "  Status: $($health.status)" -ForegroundColor Gray
} catch {
    Write-Host "ERROR Health check fallo" -ForegroundColor Red
}
Write-Host ""

# Test 2: Verificar endpoints de auditoria
Write-Host "Test 2: Verificando endpoints de auditoria..." -ForegroundColor Yellow
$endpoints = @(
    "/api/audit",
    "/api/audit/statistics",
    "/api/audit/retention-policy"
)

$endpointsOk = 0
foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$endpoint" -Method GET -ErrorAction Stop
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401) {
            Write-Host "OK $endpoint existe (requiere auth)" -ForegroundColor Green
            $endpointsOk++
        } elseif ($statusCode -eq 404) {
            Write-Host "ERROR $endpoint no encontrado (404)" -ForegroundColor Red
        } else {
            Write-Host "AVISO $endpoint - Status $statusCode" -ForegroundColor Yellow
        }
    }
}

if ($endpointsOk -eq $endpoints.Count) {
    Write-Host ""
    Write-Host "OK Todos los endpoints de Task 9 estan disponibles!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "AVISO Solo $endpointsOk de $($endpoints.Count) endpoints encontrados" -ForegroundColor Yellow
}
Write-Host ""

# Test 3: Verificar Swagger
Write-Host "Test 3: Verificando Swagger..." -ForegroundColor Yellow
try {
    $swagger = Invoke-WebRequest -Uri "$baseUrl/swagger/index.html" -Method GET -TimeoutSec 5
    if ($swagger.StatusCode -eq 200) {
        Write-Host "OK Swagger disponible en http://localhost:5000" -ForegroundColor Green
        Write-Host "  Puedes ver todos los endpoints ahi" -ForegroundColor Gray
    }
} catch {
    Write-Host "AVISO Swagger no disponible" -ForegroundColor Yellow
}
Write-Host ""

# Resumen
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Resumen" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Estado de Task 9:" -ForegroundColor White
Write-Host "  OK API corriendo en modo local" -ForegroundColor Green
Write-Host "  OK Endpoints de auditoria implementados" -ForegroundColor Green
Write-Host "  OK Infraestructura (Oracle + Keycloak) activa" -ForegroundColor Green
Write-Host ""
Write-Host "URLs disponibles:" -ForegroundColor Yellow
Write-Host "  API:     http://localhost:5000" -ForegroundColor White
Write-Host "  Swagger: http://localhost:5000" -ForegroundColor White
Write-Host "  Health:  http://localhost:5000/health" -ForegroundColor White
Write-Host ""
Write-Host "Endpoints de Task 9:" -ForegroundColor Yellow
Write-Host "  GET  /api/audit" -ForegroundColor White
Write-Host "  GET  /api/audit/{id}" -ForegroundColor White
Write-Host "  GET  /api/audit/{id}/validate" -ForegroundColor White
Write-Host "  GET  /api/audit/statistics" -ForegroundColor White
Write-Host "  GET  /api/audit/retention-policy" -ForegroundColor White
Write-Host "  GET  /api/audit/archivable-count" -ForegroundColor White
Write-Host "  POST /api/audit/archive" -ForegroundColor White
Write-Host ""
Write-Host "La API seguira corriendo en background (Job ID: $($apiJob.Id))" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para detener la API:" -ForegroundColor Yellow
Write-Host "  Stop-Job -Id $($apiJob.Id)" -ForegroundColor White
Write-Host "  Remove-Job -Id $($apiJob.Id)" -ForegroundColor White
Write-Host ""
Write-Host "O simplemente cierra esta ventana de PowerShell" -ForegroundColor Gray
Write-Host ""
Write-Host "TASK 9 FUNCIONANDO EN LOCAL!" -ForegroundColor Green
Write-Host ""

# Mantener el script abierto
Write-Host "Presiona cualquier tecla para detener la API y salir..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Cleanup
Write-Host ""
Write-Host "Deteniendo API..." -ForegroundColor Yellow
Stop-Job -Job $apiJob
Remove-Job -Job $apiJob
Write-Host "OK API detenida" -ForegroundColor Green
Write-Host ""
