# Test Borradores Endpoint
Write-Host "=== Testing Borradores (Drafts) Endpoint ===" -ForegroundColor Cyan

# Get token first
Write-Host "`nStep 1: Getting authentication token..." -ForegroundColor Yellow
$loginBody = @{
    username = "doctor"
    password = "doctor123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json"
    
    $token = $loginResponse.token
    Write-Host "✓ Token obtained successfully" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get token: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test GET search endpoint with status=draft
Write-Host "`nStep 2: Testing GET /api/prescriptions/search?status=draft" -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/prescriptions/search?status=draft" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✓ Request successful!" -ForegroundColor Green
    Write-Host "`nResponse:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 5
    
    Write-Host "`nTotal items: $($response.totalItems)" -ForegroundColor Yellow
    Write-Host "Page: $($response.page) of $($response.totalPages)" -ForegroundColor Yellow
    
} catch {
    Write-Host "✗ Request failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody" -ForegroundColor Red
    }
    exit 1
}

Write-Host "`n=== Test completed successfully ===" -ForegroundColor Green
