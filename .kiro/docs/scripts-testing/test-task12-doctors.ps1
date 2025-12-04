# Test Task 12.8 - Doctors API - Automated Tests
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Task 12.8 - Doctors API Tests" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"
$testsPassed = 0
$testsFailed = 0

function Test-Endpoint {
    param([string]$Name, [string]$Method, [string]$Url, [object]$Body = $null, [int]$ExpectedStatus, [scriptblock]$Validation = $null)
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    try {
        $params = @{Uri = $Url; Method = $Method; Headers = @{"Content-Type" = "application/json"}}
        if ($Body) { $params.Body = ($Body | ConvertTo-Json -Depth 10) }
        $response = Invoke-WebRequest @params -UseBasicParsing
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "  OK Status: $($response.StatusCode)" -ForegroundColor Green
            $content = $response.Content | ConvertFrom-Json
            if ($Validation -and -not (& $Validation $content)) {
                Write-Host "  FAIL Validation" -ForegroundColor Red
                $script:testsFailed++
                return $null
            }
            $script:testsPassed++
            return $content
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "  OK Status: $statusCode" -ForegroundColor Green
            $script:testsPassed++
        } else {
            Write-Host "  FAIL: $statusCode" -ForegroundColor Red
            $script:testsFailed++
        }
    }
    Write-Host ""
    return $null
}

# Check API
Write-Host "Checking API..." -ForegroundColor Cyan
try {
    Invoke-WebRequest -Uri "$baseUrl/api/pharmacies?pageNumber=1&pageSize=1" -UseBasicParsing -TimeoutSec 5 | Out-Null
    Write-Host "API OK" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "API NOT RUNNING (trying anyway...)" -ForegroundColor Yellow
    Write-Host ""
}

# Setup - Use existing specialty ID from database
Write-Host "=== SETUP ===" -ForegroundColor Cyan
# Using a known specialty GUID from the database (Medicina General)
# Format: 4369F5BD2DDA0E0FE063020016ACF8B0 -> 4369f5bd-2dda-0e0f-e063-020016acf8b0
$specialtyId = "bdf56943-da2d-0f0e-e063-020016acf8b0"
Write-Host "Using Specialty ID: bdf56943-da2d-0f0e-e063-020016acf8b0 (Medicina General)" -ForegroundColor Green
Write-Host ""

# CRUD Tests
Write-Host "=== CRUD OPERATIONS ===" -ForegroundColor Cyan
$randomNum = Get-Random -Minimum 1000 -Maximum 9999
$createBody = @{
    identificationNumber="ID-$randomNum"
    medicalLicenseNumber="DOC-TEST-$randomNum"
    firstName="Juan"
    lastName="Perez"
    specialtyId=$specialtyId
    phone="+506-8888-9999"
    email="dr.juan@hospital.com"
}
$doctor = Test-Endpoint -Name "1. Create Doctor" -Method "POST" -Url "$baseUrl/api/doctors" -Body $createBody -ExpectedStatus 201 -Validation { param($d) $d.id -and $d.isActive }
if (-not $doctor) { Write-Host "CREATE FAILED" -ForegroundColor Red; exit 1 }
$doctorId = $doctor.id
Write-Host "Doctor ID: $doctorId" -ForegroundColor Green
Write-Host ""

Test-Endpoint -Name "2. Get Doctor by ID" -Method "GET" -Url "$baseUrl/api/doctors/$doctorId" -ExpectedStatus 200 -Validation { param($d) $d.id -eq $doctorId }

$updateBody = @{phone="+506-7777-8888"; email="dr.juan.updated@hospital.com"}
Test-Endpoint -Name "3. Update Doctor" -Method "PUT" -Url "$baseUrl/api/doctors/$doctorId" -Body $updateBody -ExpectedStatus 200 -Validation { param($d) $d.phone -eq "+506-7777-8888" }

# Search Tests
Write-Host "=== SEARCH & FILTERS ===" -ForegroundColor Cyan
Test-Endpoint -Name "4. Search All Doctors" -Method "GET" -Url "$baseUrl/api/doctors?pageNumber=1&pageSize=10" -ExpectedStatus 200 -Validation { param($d) $d.items }
Test-Endpoint -Name "5. Search by Name" -Method "GET" -Url "$baseUrl/api/doctors?searchTerm=Juan&pageNumber=1&pageSize=10" -ExpectedStatus 200 -Validation { param($d) $d.items }
Test-Endpoint -Name "6. Search Active Only" -Method "GET" -Url "$baseUrl/api/doctors?isActive=true&pageNumber=1&pageSize=10" -ExpectedStatus 200 -Validation { param($d) $d.items }

# Validation Tests
Write-Host "=== VALIDATION TESTS ===" -ForegroundColor Cyan
$invalidBody1 = @{identificationNumber="ID-INV1"; medicalLicenseNumber=""; firstName="Test"; lastName="Doctor"; specialtyId=$specialtyId; phone="+506-8888-9999"; email="test@test.com"}
Test-Endpoint -Name "7. Empty License" -Method "POST" -Url "$baseUrl/api/doctors" -Body $invalidBody1 -ExpectedStatus 400

$invalidBody2 = @{identificationNumber="ID-INV2"; medicalLicenseNumber="DOC-INV-9999"; firstName="Test"; lastName="Doctor"; specialtyId=$specialtyId; phone="+506-8888-9999"; email="invalid-email"}
Test-Endpoint -Name "8. Invalid Email" -Method "POST" -Url "$baseUrl/api/doctors" -Body $invalidBody2 -ExpectedStatus 400

# Cleanup
Write-Host "=== CLEANUP ===" -ForegroundColor Cyan
Test-Endpoint -Name "9. Delete Doctor" -Method "DELETE" -Url "$baseUrl/api/doctors/$doctorId" -ExpectedStatus 204
Test-Endpoint -Name "10. Verify Deletion" -Method "GET" -Url "$baseUrl/api/doctors/$doctorId" -ExpectedStatus 404

# Summary
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Passed: $testsPassed" -ForegroundColor Green
Write-Host "Failed: $testsFailed" -ForegroundColor $(if ($testsFailed -eq 0) { "Green" } else { "Red" })
Write-Host "Total: $($testsPassed + $testsFailed)" -ForegroundColor Cyan
Write-Host ""
if ($testsFailed -eq 0) {
    Write-Host "ALL TESTS PASSED!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "SOME TESTS FAILED" -ForegroundColor Red
    exit 1
}

