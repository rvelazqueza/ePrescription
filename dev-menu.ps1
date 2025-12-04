# Menu interactivo para desarrollo
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EPRESCRIPTION - MENU DE DESARROLLO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Fix PATH
$env:PATH = "C:\Program Files\dotnet;" + $env:PATH

# Mostrar estado actual
Write-Host "Estado actual:" -ForegroundColor Yellow
Write-Host ""

# .NET
try {
    $dotnetVersion = & dotnet --version 2>$null
    Write-Host "  .NET: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "  .NET: No encontrado" -ForegroundColor Red
}

# Docker
$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Docker: Corriendo" -ForegroundColor Green
} else {
    Write-Host "  Docker: No disponible" -ForegroundColor Red
}

# Servicios
$oracleRunning = docker ps --filter "name=eprescription-oracle-db" --filter "status=running" --format "{{.Names}}" 2>$null
$keycloakRunning = docker ps --filter "name=eprescription-keycloak" --filter "status=running" --format "{{.Names}}" 2>$null
$apiDockerRunning = docker ps --filter "name=eprescription-backend-api" --filter "status=running" --format "{{.Names}}" 2>$null

if ($oracleRunning) {
    Write-Host "  Oracle: Corriendo" -ForegroundColor Green
} else {
    Write-Host "  Oracle: Detenido" -ForegroundColor Gray
}

if ($keycloakRunning) {
    Write-Host "  Keycloak: Corriendo" -ForegroundColor Green
} else {
    Write-Host "  Keycloak: Detenido" -ForegroundColor Gray
}

if ($apiDockerRunning) {
    Write-Host "  API (Docker): Corriendo" -ForegroundColor Yellow
} else {
    Write-Host "  API (Docker): Detenido" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Menu
Write-Host "Opciones:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  [1] Desarrollo Local (Rapido)" -ForegroundColor White
Write-Host "      Inicia API localmente con hot reload" -ForegroundColor Gray
Write-Host ""
Write-Host "  [2] Desarrollo Docker" -ForegroundColor White
Write-Host "      Inicia todo en Docker" -ForegroundColor Gray
Write-Host ""
Write-Host "  [3] Verificar Configuracion" -ForegroundColor White
Write-Host "      Prueba que todo este listo" -ForegroundColor Gray
Write-Host ""
Write-Host "  [4] Reiniciar Infraestructura" -ForegroundColor White
Write-Host "      Reinicia Oracle y Keycloak" -ForegroundColor Gray
Write-Host ""
Write-Host "  [5] Detener Todo" -ForegroundColor White
Write-Host "      Detiene todos los servicios" -ForegroundColor Gray
Write-Host ""
Write-Host "  [6] Ver Logs" -ForegroundColor White
Write-Host "      Muestra logs de servicios" -ForegroundColor Gray
Write-Host ""
Write-Host "  [7] Ayuda / Documentacion" -ForegroundColor White
Write-Host "      Muestra guias disponibles" -ForegroundColor Gray
Write-Host ""
Write-Host "  [0] Salir" -ForegroundColor White
Write-Host ""

$opcion = Read-Host "Selecciona una opcion"

switch ($opcion) {
    "1" {
        Write-Host ""
        Write-Host "Iniciando desarrollo local..." -ForegroundColor Green
        .\quick-start-local.ps1
    }
    "2" {
        Write-Host ""
        Write-Host "Iniciando desarrollo Docker..." -ForegroundColor Green
        .\start-dev-docker.ps1
    }
    "3" {
        Write-Host ""
        .\test-local-api.ps1
    }
    "4" {
        Write-Host ""
        Write-Host "Reiniciando infraestructura..." -ForegroundColor Yellow
        docker-compose restart oracle-db keycloak
        Write-Host ""
        Write-Host "Esperando servicios (30s)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
        Write-Host "Infraestructura reiniciada" -ForegroundColor Green
    }
    "5" {
        Write-Host ""
        Write-Host "Deteniendo servicios..." -ForegroundColor Yellow
        docker-compose down
        Write-Host "Servicios detenidos" -ForegroundColor Green
    }
    "6" {
        Write-Host ""
        Write-Host "Logs disponibles:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  [1] Oracle" -ForegroundColor White
        Write-Host "  [2] Keycloak" -ForegroundColor White
        Write-Host "  [3] API (Docker)" -ForegroundColor White
        Write-Host ""
        $logOpcion = Read-Host "Selecciona servicio"
        
        switch ($logOpcion) {
            "1" { docker logs -f eprescription-oracle-db }
            "2" { docker logs -f eprescription-keycloak }
            "3" { docker logs -f eprescription-backend-api }
            default { Write-Host "Opcion invalida" -ForegroundColor Red }
        }
    }
    "7" {
        Write-Host ""
        Write-Host "Documentacion disponible:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  README-DESARROLLO-LOCAL.md" -ForegroundColor White
        Write-Host "    Guia rapida de inicio" -ForegroundColor Gray
        Write-Host ""
        Write-Host "  GUIA-DESARROLLO.md" -ForegroundColor White
        Write-Host "    Guia completa de desarrollo" -ForegroundColor Gray
        Write-Host ""
        Write-Host "  RESUMEN-DESARROLLO-LOCAL.md" -ForegroundColor White
        Write-Host "    Resumen detallado del setup" -ForegroundColor Gray
        Write-Host ""
        Write-Host "  TROUBLESHOOTING-LOCAL.md" -ForegroundColor White
        Write-Host "    Solucion de problemas" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Scripts disponibles:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  quick-start-local.ps1" -ForegroundColor White
        Write-Host "    Inicio rapido (recomendado)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "  start-dev-local.ps1" -ForegroundColor White
        Write-Host "    Inicio con mas detalles" -ForegroundColor Gray
        Write-Host ""
        Write-Host "  start-dev-docker.ps1" -ForegroundColor White
        Write-Host "    Desarrollo en Docker" -ForegroundColor Gray
        Write-Host ""
        Write-Host "  test-local-api.ps1" -ForegroundColor White
        Write-Host "    Verificar configuracion" -ForegroundColor Gray
        Write-Host ""
    }
    "0" {
        Write-Host ""
        Write-Host "Hasta luego!" -ForegroundColor Green
        exit 0
    }
    default {
        Write-Host ""
        Write-Host "Opcion invalida" -ForegroundColor Red
    }
}
