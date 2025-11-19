# Script para diagnosticar y arreglar problemas con Vite

Write-Host "=== Diagnóstico de Vite ===" -ForegroundColor Cyan

# 1. Verificar que estamos en el directorio correcto
Write-Host "`n1. Verificando directorio..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✓ package.json encontrado" -ForegroundColor Green
} else {
    Write-Host "✗ package.json NO encontrado. Asegúrate de estar en ePrescription-react/" -ForegroundColor Red
    exit 1
}

# 2. Verificar node_modules
Write-Host "`n2. Verificando node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ node_modules existe" -ForegroundColor Green
} else {
    Write-Host "✗ node_modules NO existe. Ejecutando npm install..." -ForegroundColor Red
    npm install
}

# 3. Verificar archivos críticos
Write-Host "`n3. Verificando archivos críticos..." -ForegroundColor Yellow
$criticalFiles = @("index.html", "vite.config.ts", "src")
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file encontrado" -ForegroundColor Green
    } else {
        Write-Host "✗ $file NO encontrado" -ForegroundColor Red
    }
}

# 4. Instalar dependencias faltantes de TypeScript
Write-Host "`n4. Instalando dependencias de TypeScript..." -ForegroundColor Yellow
npm install --save-dev typescript @types/react @types/react-dom

# 5. Limpiar caché de Vite
Write-Host "`n5. Limpiando caché de Vite..." -ForegroundColor Yellow
if (Test-Path "node_modules/.vite") {
    Remove-Item -Recurse -Force "node_modules/.vite"
    Write-Host "✓ Caché limpiado" -ForegroundColor Green
}

# 6. Intentar iniciar Vite
Write-Host "`n6. Intentando iniciar Vite..." -ForegroundColor Yellow
Write-Host "Ejecutando: npm run dev" -ForegroundColor Cyan
Write-Host "`nSi hay errores, cópialos y compártelos conmigo.`n" -ForegroundColor Yellow

npm run dev
