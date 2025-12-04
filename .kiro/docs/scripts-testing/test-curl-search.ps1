# Test with curl to see exact error
Write-Host "Testing with curl..." -ForegroundColor Cyan

$url = "http://localhost:8000/api/prescriptions/search?status=draft"
Write-Host "URL: $url" -ForegroundColor Yellow

curl -v $url 2>&1 | Write-Host
