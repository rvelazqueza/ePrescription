# Test Script for Task 11 - Prescriptions API Endpoints
# This script tests all CRUD operations for prescriptions

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Task 11: Testing Prescriptions API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$baseUrl = "http://localhost:5000"
$apiUrl = "$baseUrl/api"

# Test results
$testResults = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [object]$Body = $null,
        [hashtable]$Headers = @{},
        [int]$ExpectedStatus = 200
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "  Method: $Method" -ForegroundColor Gray
    Write-Host "  URL: $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
            Write-Host "  Body: $($params.Body)" -ForegroundColor Gray
        }
        
        $response = Invoke-RestMethod @params -ErrorAction Stop
        
        Write-Host "  SUCCESS - Status: $ExpectedStatus" -ForegroundColor Green
        Write-Host "  Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Gray
        Write-Host ""
        
        return @{
            Name = $Name
            Status = "PASS"
            Response = $response
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorMessage = $_.Exception.Message
        
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "  SUCCESS - Expected status: $ExpectedStatus" -ForegroundColor Green
            return @{
                Name = $Name
                Status = "PASS"
                Response = $null
            }
        }
        else {
            Write-Host "  FAILED - Status: $statusCode" -ForegroundColor Red
            Write-Host "  Error: $errorMessage" -ForegroundColor Red
            Write-Host ""
            
            return @{
                Name = $Name
                Status = "FAIL"
                Error = $errorMessage
                StatusCode = $statusCode
            }
        }
    }
}

# Step 1: Check if API is running
Write-Host "Step 1: Checking if API is running..." -ForegroundColor Cyan
try {
    $healthCheck = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get -ErrorAction Stop
    Write-Host "API is running!" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "API is not running!" -ForegroundColor Red
    Write-Host "Please start the API first:" -ForegroundColor Yellow
    Write-Host "  cd eprescription-API/src/ePrescription.API" -ForegroundColor Gray
    Write-Host "  dotnet run" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# Step 2: Get authentication token
Write-Host "Step 2: Getting authentication token..." -ForegroundColor Cyan
Write-Host "Note: You need to have Keycloak running and configured" -ForegroundColor Yellow
Write-Host ""

$token = $null
$headers = @{}

# Step 3: Test GET /api/prescriptions/{id} - Should return 401 without auth
Write-Host "Step 3: Testing GET endpoint (without authentication)..." -ForegroundColor Cyan
$testId = [Guid]::NewGuid()
$result = Test-Endpoint `
    -Name "GET Prescription (No Auth)" `
    -Method "GET" `
    -Url "$apiUrl/prescriptions/$testId" `
    -ExpectedStatus 401
$testResults += $result

# Step 4: Test POST /api/prescriptions - Should return 401 without auth
Write-Host "Step 4: Testing POST endpoint (without authentication)..." -ForegroundColor Cyan
$createDto = @{
    patientId = [Guid]::NewGuid()
    doctorId = [Guid]::NewGuid()
    prescriptionDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    validUntil = (Get-Date).AddMonths(1).ToString("yyyy-MM-ddTHH:mm:ss")
    diagnoses = @(
        @{
            cie10Code = "J00"
            description = "Acute nasopharyngitis [common cold]"
            isPrimary = $true
        }
    )
    medications = @(
        @{
            medicationId = [Guid]::NewGuid()
            dosage = "500mg"
            frequency = "Every 8 hours"
            duration = "7 days"
            administrationRoute = "Oral"
            instructions = "Take with food"
        }
    )
    notes = "Test prescription"
}

$result = Test-Endpoint `
    -Name "POST Prescription (No Auth)" `
    -Method "POST" `
    -Url "$apiUrl/prescriptions" `
    -Body $createDto `
    -ExpectedStatus 401
$testResults += $result

# Step 5: Test PUT /api/prescriptions/{id} - Should return 401 without auth
Write-Host "Step 5: Testing PUT endpoint (without authentication)..." -ForegroundColor Cyan
$updateDto = @{
    notes = "Updated notes"
    status = "Active"
}

$result = Test-Endpoint `
    -Name "PUT Prescription (No Auth)" `
    -Method "PUT" `
    -Url "$apiUrl/prescriptions/$testId" `
    -Body $updateDto `
    -ExpectedStatus 401
$testResults += $result

# Step 6: Test DELETE /api/prescriptions/{id} - Should return 401 without auth
Write-Host "Step 6: Testing DELETE endpoint (without authentication)..." -ForegroundColor Cyan
$result = Test-Endpoint `
    -Name "DELETE Prescription (No Auth)" `
    -Method "DELETE" `
    -Url "$apiUrl/prescriptions/$testId" `
    -ExpectedStatus 401
$testResults += $result

# Step 7: Test POST /api/prescriptions/search - Should return 401 without auth
Write-Host "Step 7: Testing SEARCH endpoint (without authentication)..." -ForegroundColor Cyan
$searchDto = @{
    page = 1
    pageSize = 10
    status = "Active"
}

$result = Test-Endpoint `
    -Name "POST Search Prescriptions (No Auth)" `
    -Method "POST" `
    -Url "$apiUrl/prescriptions/search" `
    -Body $searchDto `
    -ExpectedStatus 401
$testResults += $result

# Step 8: Test GET /api/prescriptions/patient/{patientId} - Should return 401 without auth
Write-Host "Step 8: Testing GET by Patient endpoint (without authentication)..." -ForegroundColor Cyan
$patientId = [Guid]::NewGuid()
$result = Test-Endpoint `
    -Name "GET Prescriptions by Patient (No Auth)" `
    -Method "GET" `
    -Url "$apiUrl/prescriptions/patient/$patientId" `
    -ExpectedStatus 401
$testResults += $result

# Step 9: Test GET /api/prescriptions/doctor/{doctorId} - Should return 401 without auth
Write-Host "Step 9: Testing GET by Doctor endpoint (without authentication)..." -ForegroundColor Cyan
$doctorId = [Guid]::NewGuid()
$result = Test-Endpoint `
    -Name "GET Prescriptions by Doctor (No Auth)" `
    -Method "GET" `
    -Url "$apiUrl/prescriptions/doctor/$doctorId" `
    -ExpectedStatus 401
$testResults += $result

# Step 10: Test GET /api/prescriptions/status/{status} - Should return 401 without auth
Write-Host "Step 10: Testing GET by Status endpoint (without authentication)..." -ForegroundColor Cyan
$result = Test-Endpoint `
    -Name "GET Prescriptions by Status (No Auth)" `
    -Method "GET" `
    -Url "$apiUrl/prescriptions/status/Active" `
    -ExpectedStatus 401
$testResults += $result

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$passed = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count
$total = $testResults.Count

Write-Host "Total Tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host ""

if ($failed -eq 0) {
    Write-Host "All tests passed!" -ForegroundColor Green
}
else {
    Write-Host "Some tests failed:" -ForegroundColor Red
    $testResults | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "  - $($_.Name): $($_.Error)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Start Keycloak if not running" -ForegroundColor Yellow
Write-Host "2. Get authentication token" -ForegroundColor Yellow
Write-Host "3. Update this script with the token" -ForegroundColor Yellow
Write-Host "4. Run tests again with authentication" -ForegroundColor Yellow
Write-Host ""
