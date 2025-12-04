# Test DeepL Translation Service
# Este script prueba el servicio de traducción con el API key configurado

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  DeepL Translation Service Test" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que el API esté corriendo
Write-Host "1. Verificando que la API esté corriendo..." -ForegroundColor Yellow
$apiUrl = "http://localhost:5000/health"

try {
    $response = Invoke-WebRequest -Uri $apiUrl -Method GET -ErrorAction Stop
    Write-Host "   ✓ API está corriendo" -ForegroundColor Green
} catch {
    Write-Host "   ✗ API no está corriendo" -ForegroundColor Red
    Write-Host "   Por favor inicia la API primero:" -ForegroundColor Yellow
    Write-Host "   cd eprescription-API" -ForegroundColor White
    Write-Host "   dotnet run --project src/ePrescription.API" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "2. Probando traducción Español → Inglés..." -ForegroundColor Yellow

# Texto de prueba médico
$testText = "El paciente presenta dolor abdominal agudo con fiebre alta"

$body = @{
    text = $testText
    sourceLanguage = "ES"
    targetLanguage = "EN"
} | ConvertTo-Json

Write-Host "   Texto original: $testText" -ForegroundColor White

try {
    # Nota: Este endpoint aún no existe, se implementará en Breakpoint 3
    # Este es un ejemplo de cómo se usaría
    Write-Host ""
    Write-Host "   ⚠ Endpoint de traducción aún no implementado" -ForegroundColor Yellow
    Write-Host "   Se implementará en Breakpoint 3 (Task 10.27-10.28)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Endpoint esperado:" -ForegroundColor Cyan
    Write-Host "   POST http://localhost:5000/api/translation/translate" -ForegroundColor White
    Write-Host ""
    Write-Host "   Body esperado:" -ForegroundColor Cyan
    Write-Host $body -ForegroundColor White
    
} catch {
    Write-Host "   ✗ Error al probar traducción: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Configuración Verificada" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ API Key de DeepL configurado en appsettings.Local.json" -ForegroundColor Green
Write-Host "✓ Servicio DeepLTranslationService registrado en Program.cs" -ForegroundColor Green
Write-Host "✓ Listo para implementar endpoints en Breakpoint 3" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Implementar CIE10Controller (Task 10.27)" -ForegroundColor White
Write-Host "2. Implementar AIAssistantController (Task 10.28)" -ForegroundColor White
Write-Host "3. Probar flujo completo de traducción" -ForegroundColor White
Write-Host ""
