# Test to see detailed error
Write-Host "Testing search endpoint..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/prescriptions/search?status=draft" -Method Get
    Write-Host "Success!" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
} catch {
    Write-Host "Error!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    
    $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $responseBody = $reader.ReadToEnd()
    Write-Host "Response Body:" -ForegroundColor Yellow
    Write-Host $responseBody
    
    try {
        $errorJson = $responseBody | ConvertFrom-Json
        Write-Host "`nFormatted Error:" -ForegroundColor Yellow
        $errorJson | ConvertTo-Json -Depth 5
    } catch {
        # Not JSON
    }
}
