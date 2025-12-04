# Test Borradores Endpoint - Simple version
Write-Host "Testing Borradores Endpoint" -ForegroundColor Cyan

# Get token
$loginBody = @{
    username = "doctor"
    password = "doctor123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token
Write-Host "Token obtained" -ForegroundColor Green

# Test search endpoint
$headers = @{
    "Authorization" = "Bearer $token"
}

Write-Host "`nTesting GET /api/prescriptions/search?status=draft" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "http://localhost:8000/api/prescriptions/search?status=draft" -Method Get -Headers $headers

Write-Host "Success!" -ForegroundColor Green
Write-Host "Total items: $($response.totalItems)"
Write-Host "Page: $($response.page)"
Write-Host "Items count: $($response.items.Count)"

if ($response.items.Count -gt 0) {
    Write-Host "`nFirst item:" -ForegroundColor Cyan
    $response.items[0] | Format-List
}
