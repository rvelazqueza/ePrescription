# Script para descargar el driver JDBC de Oracle para Keycloak

$driverUrl = "https://download.oracle.com/otn-pub/otn_software/jdbc/233/ojdbc11.jar"
$providersDir = "providers"
$driverPath = "$providersDir/ojdbc11.jar"

# Crear directorio providers si no existe
if (-not (Test-Path $providersDir)) {
    New-Item -ItemType Directory -Path $providersDir | Out-Null
    Write-Host "[OK] Directorio 'providers' creado"
}

# Verificar si el driver ya existe
if (Test-Path $driverPath) {
    Write-Host "[OK] El driver JDBC de Oracle ya existe en $driverPath"
    exit 0
}

# Descargar el driver
Write-Host "Descargando driver JDBC de Oracle..."
try {
    Invoke-WebRequest -Uri $driverUrl -OutFile $driverPath
    Write-Host "[OK] Driver JDBC de Oracle descargado exitosamente en $driverPath"
} catch {
    Write-Host "[ERROR] Error al descargar el driver: $_"
    exit 1
}
