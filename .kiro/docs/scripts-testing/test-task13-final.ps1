# Test Task 13.6 - Dispensations API
# Script automatizado para probar endpoints de Dispensations

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Task 13.6 - Dispensations API Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"
$testsPassed = 0
$testsFailed = 0

# Function to test endpoint
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [object]$Body = $null,
        [int]$ExpectedStatus,
        [scriptblock]$Validation = $null
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $headers
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-WebRequest @params -UseBasicParsing
        $statusCode = $response.StatusCode
        $content = $response.Content | ConvertFrom-Json
        
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "  OK Status: $statusCode" -ForegroundColor Green
            
            if ($Validation) {
                $validationResult = & $Validation $content
                if ($validationResult) {
                    Write-Host "  OK Validation passed" -ForegroundColor Green
                    $script:testsPassed++
                    return $content
                } else {
                    Write-Host "  FAIL Validation failed" -ForegroundColor Red
                    $script:testsFailed++
                    return $null
                }
            } else {
                $script:testsPassed++
                return $content
            }
        } else {
            Write-Host "  FAIL Expected $ExpectedStatus but got $statusCode" -ForegroundColor Red
            $script:testsFailed++
            return $null
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "  OK Status: $statusCode (Expected error)" -ForegroundColor Green
            $script:testsPassed++
            return $null
        } else {
            Write-Host "  FAIL Request failed: $($_.Exception.Message)" -ForegroundColor Red
            if ($statusCode) {
                Write-Host "  FAIL Status Code: $statusCode" -ForegroundColor Red
            }
            $script:testsFailed++
            return $null
        }
    }
    
    Write-Host ""
}

# Check if API is running
Write-Host "Checking if API is running..." -ForegroundColor Cyan
try {
    $health = Invoke-WebRequest -Uri "$baseUrl/api/pharmacies?pageNumber=1&pageSize=1" -UseBasicParsing -TimeoutSec 5
    Write-Host "API is running" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "API is not responding. Please start Docker:" -ForegroundColor Red
    Write-Host "  docker-compose up -d eprescription-api" -ForegroundColor Yellow
    exit 1
}

# CRUD Operations
Write-Host "=== CRUD OPERATIONS ===" -ForegroundColor Cyan

# 1. Create Pharmacy
$randomNum = Get-Random -Minimum 1000 -Maximum 9999
$createBody = @{
    licenseNumber = "PHARM-TEST-$randomNum"
    name = "Farmacia Test Central"
    address = "123 Main Street"
    city = "San José"
    state = "San José"
    zipCode = "10101"
    phone = "+506-2222-3333"
    email = "info@farmaciatest.com"
}

$pharmacy = Test-Endpoint `
    -Name "Create Pharmacy" `
    -Method "POST" `
    -Url "$baseUrl/api/pharmacies" `
    -Body $createBody `
    -ExpectedStatus 201 `
    -Validation { param($data) 
        $data.id -and $data.licenseNumber -and $data.name -and $data.isActive -eq $true
    }

if (-not $pharmacy) {
    Write-Host "Cannot proceed without pharmacy ID" -ForegroundColor Red
    exit 1
}

$pharmacyId = $pharmacy.id
Write-Host "Created Pharmacy ID: $pharmacyId" -ForegroundColor Green
Write-Host ""

# 2. Get Pharmacy by ID
$getPharmacy = Test-Endpoint `
    -Name "Get Pharmacy by ID" `
    -Method "GET" `
    -Url "$baseUrl/api/pharmacies/$pharmacyId" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data.id -eq $pharmacyId -and $data.fullAddress
    }

# 3. Update Pharmacy
$updateBody = @{
    address = "456 Updated Street"
    city = "San José"
    state = "San José"
    zipCode = "10102"
    phone = "+506-9999-8888"
    email = "updated@farmaciatest.com"
}

$updatedPharmacy = Test-Endpoint `
    -Name "Update Pharmacy Contact Info" `
    -Method "PUT" `
    -Url "$baseUrl/api/pharmacies/$pharmacyId" `
    -Body $updateBody `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $phoneMatch = $data.phone -eq "+506-9999-8888"
        $emailMatch = $data.email -eq "updated@farmaciatest.com"
        $addressMatch = $data.address -eq "456 Updated Street"
        if (-not $phoneMatch) { Write-Host "    Phone mismatch: expected '+506-9999-8888', got '$($data.phone)'" -ForegroundColor Yellow }
        if (-not $emailMatch) { Write-Host "    Email mismatch: expected 'updated@farmaciatest.com', got '$($data.email)'" -ForegroundColor Yellow }
        if (-not $addressMatch) { Write-Host "    Address mismatch: expected '456 Updated Street', got '$($data.address)'" -ForegroundColor Yellow }
        $phoneMatch -and $emailMatch -and $addressMatch
    }

# Search & Filters
Write-Host "=== SEARCH & FILTERS ===" -ForegroundColor Cyan

# 4. Search All Pharmacies
$allPharmacies = Test-Endpoint `
    -Name "Search All Pharmacies" `
    -Method "GET" `
    -Url "$baseUrl/api/pharmacies?pageNumber=1&pageSize=10" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data.items -and $data.totalCount -ge 0
    }

# 5. Search by City
$cityPharmacies = Test-Endpoint `
    -Name "Search Pharmacies by City" `
    -Method "GET" `
    -Url "$baseUrl/api/pharmacies?city=San José&pageNumber=1&pageSize=10" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data.items -is [array]
    }

# 6. Search by State
$statePharmacies = Test-Endpoint `
    -Name "Search Pharmacies by State" `
    -Method "GET" `
    -Url "$baseUrl/api/pharmacies?state=San José&pageNumber=1&pageSize=10" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data.items -is [array]
    }

# 7. Search Active Only
$activePharmacies = Test-Endpoint `
    -Name "Search Active Pharmacies Only" `
    -Method "GET" `
    -Url "$baseUrl/api/pharmacies?isActive=true&pageNumber=1&pageSize=10" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data.items | ForEach-Object { $_.isActive -eq $true }
    }

# Validation Tests
Write-Host "=== VALIDATION TESTS ===" -ForegroundColor Cyan

# 8. Empty License Number
$invalidBody1 = @{
    licenseNumber = ""
    name = "Test Pharmacy"
    address = "123 Test St"
    city = "Test City"
    state = "Test State"
    zipCode = "12345"
    phone = "+506-1111-2222"
    email = "test@test.com"
}

Test-Endpoint `
    -Name "Validation - Empty License Number" `
    -Method "POST" `
    -Url "$baseUrl/api/pharmacies" `
    -Body $invalidBody1 `
    -ExpectedStatus 400

# 9. Invalid Email
$invalidBody2 = @{
    licenseNumber = "PHARM-INVALID-9999"
    name = "Test Pharmacy"
    address = "123 Test St"
    city = "Test City"
    state = "Test State"
    zipCode = "12345"
    phone = "+506-1111-2222"
    email = "invalid-email"
}

Test-Endpoint `
    -Name "Validation - Invalid Email" `
    -Method "POST" `
    -Url "$baseUrl/api/pharmacies" `
    -Body $invalidBody2 `
    -ExpectedStatus 400

# Cleanup
Write-Host "=== CLEANUP ===" -ForegroundColor Cyan

# 10. Delete Pharmacy
Test-Endpoint `
    -Name "Delete Pharmacy" `
    -Method "DELETE" `
    -Url "$baseUrl/api/pharmacies/$pharmacyId" `
    -ExpectedStatus 204

# 11. Verify Deletion
Test-Endpoint `
    -Name "Verify Pharmacy Deletion" `
    -Method "GET" `
    -Url "$baseUrl/api/pharmacies/$pharmacyId" `
    -ExpectedStatus 404

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Tests Passed: $testsPassed" -ForegroundColor Green
Write-Host "Tests Failed: $testsFailed" -ForegroundColor $(if ($testsFailed -eq 0) { "Green" } else { "Red" })
Write-Host "Total Tests: $($testsPassed + $testsFailed)" -ForegroundColor Cyan
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "ALL TESTS PASSED!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "SOME TESTS FAILED" -ForegroundColor Red
    exit 1
}
