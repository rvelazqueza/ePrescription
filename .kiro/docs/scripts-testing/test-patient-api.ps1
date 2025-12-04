# Test simple del API de pacientes

$patientId = "70f76943-b49f-430e-e063-020016ac882b"
$url = "http://localhost:8000/api/patients/$patientId"

Write-Host "Probando API de pacientes..." -ForegroundColor Cyan
Write-Host "URL: $url" -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $url -Method Get
    Write-Host "Respuesta exitosa:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
