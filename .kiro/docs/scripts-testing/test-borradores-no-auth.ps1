# Test Borradores Endpoint - No Auth
Write-Host "Testing Borradores Endpoint (No Auth)" -ForegroundColor Cyan

Write-Host "`nTesting GET /api/prescriptions/search?status=draft" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/prescriptions/search?status=draft" -Method Get
    
    Write-Host "Success!" -ForegroundColor Green
    Write-Host "Total items: $($response.totalItems)"
    Write-Host "Page: $($response.page)"
    Write-Host "Items count: $($response.items.Count)"
    
    if ($response.items.Count -gt 0) {
        Write-Host "`nFirst item:" -ForegroundColor Cyan
        $response.items[0] | Format-List
    }
} catch {
    Write-Host "Error!" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)"
    }
}
