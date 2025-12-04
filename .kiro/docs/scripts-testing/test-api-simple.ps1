# Simple API Test - Task 11
Write-Host "=== Testing Prescriptions API ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "SUCCESS: Health check passed" -ForegroundColor Green
    Write-Host "  Status: $($response.status)" -ForegroundColor Gray
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Check Swagger
Write-Host "2. Testing Swagger UI..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "SUCCESS: Swagger UI is accessible" -ForegroundColor Green
        Write-Host "  URL: $baseUrl/" -ForegroundColor Gray
    }
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Get Authentication Token
Write-Host "3. Getting Authentication Token..." -ForegroundColor Yellow
$tokenUrl = "http://localhost:8080/realms/eprescription/protocol/openid-connect/token"
$tokenBody = @{
    grant_type = "password"
    client_id = "eprescription-api"
    username = "doctor1"
    password = "Doctor123!"
}

try {
    $tokenResponse = Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $tokenBody -ContentType "application/x-www-form-urlencoded"
    $token = $tokenResponse.access_token
    Write-Host "SUCCESS: Token obtained" -ForegroundColor Green
    Write-Host "  Token length: $($token.Length) characters" -ForegroundColor Gray
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Note: Make sure Keycloak is running and user exists" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 4: Test CIE-10 endpoint
Write-Host "4. Testing CIE-10 Search..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $cie10Response = Invoke-RestMethod -Uri "$baseUrl/api/cie10/search?query=diabetes" -Method Get -Headers $headers
    Write-Host "SUCCESS: CIE-10 search working" -ForegroundColor Green
    Write-Host "  Results found: $($cie10Response.Count)" -ForegroundColor Gray
    if ($cie10Response.Count -gt 0) {
        Write-Host "  First result: $($cie10Response[0].code) - $($cie10Response[0].description)" -ForegroundColor Gray
    }
} catch {
    Write-Host "WARNING: CIE-10 search failed" -ForegroundColor Yellow
    Write-Host "  $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

# Test 5: Test Prescriptions endpoint (GET)
Write-Host "5. Testing Prescriptions Search..." -ForegroundColor Yellow
try {
    $searchResponse = Invoke-RestMethod -Uri "$baseUrl/api/prescriptions/search?page=1&pageSize=10" -Method Get -Headers $headers
    Write-Host "SUCCESS: Prescriptions search working" -ForegroundColor Green
    Write-Host "  Total prescriptions: $($searchResponse.totalCount)" -ForegroundColor Gray
    Write-Host "  Page: $($searchResponse.page) of $($searchResponse.totalPages)" -ForegroundColor Gray
} catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Summary
Write-Host "=== Test Summary ===" -ForegroundColor Cyan
Write-Host "API is running and responding to requests" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Open Swagger UI: http://localhost:8000/" -ForegroundColor Gray
Write-Host "  2. Test prescription creation manually" -ForegroundColor Gray
Write-Host "  3. Verify shadow properties are resolved" -ForegroundColor Gray
Write-Host ""
