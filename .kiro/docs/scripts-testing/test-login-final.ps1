# Test final del login
Write-Host "=== Test Final de Login ===" -ForegroundColor Cyan

$apiLoginData = @{
    username = "doctor"
    password = "doctor123"
} | ConvertTo-Json

Write-Host "`nProbando login con el API..." -ForegroundColor Yellow
Write-Host "URL: http://localhost:8000/api/auth/login" -ForegroundColor Gray
Write-Host "Payload: $apiLoginData" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/auth/login" `
        -Method POST `
        -Body $apiLoginData `
        -ContentType "application/json"
    
    Write-Host "`n✅ Login exitoso!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Cyan
    Write-Host "`nRespuesta:" -ForegroundColor Yellow
    $responseObj = $response.Content | ConvertFrom-Json
    $responseObj | ConvertTo-Json -Depth 5
    
    Write-Host "`n=== ✅ TODO FUNCIONA ===" -ForegroundColor Green
    Write-Host "`nAhora puedes hacer login desde el frontend Angular con:" -ForegroundColor Yellow
    Write-Host "  Username: doctor" -ForegroundColor White
    Write-Host "  Password: doctor123" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ Login falló" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
}
