# Test script for Task 12.9-12.11 - Pharmacies CRUD API
# Tests all pharmacy endpoints without authentication

$baseUrl = "http://localhost:8000/api"
$pharmaciesUrl = "$baseUrl/pharmacies"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Task 12.9-12.11 - Pharmacies API Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Store created pharmacy ID for later tests
$createdPharmacyId = $null

# Test 1: Create Pharmacy
Write-Host "Test 1: POST /api/pharmacies - Create Pharmacy" -ForegroundColor Yellow
$createPharmacyDto = @{
    licenseNumber = "PHARM-TEST-$(Get-Random -Maximum 9999)"
    name = "Farmacia Test Central"
    address = "123 Main Street"
    city = "Springfield"
    state = "Illinois"
    zipCode = "62701"
    phone = "+1-555-0100"
    email = "info@farmaciatest.com"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $pharmaciesUrl -Method Post -Body $createPharmacyDto -ContentType "application/json"
    Write-Host "SUCCESS: Pharmacy created successfully" -ForegroundColor Green
    Write-Host "  ID: $($response.id)" -ForegroundColor Gray
    Write-Host "  License: $($response.licenseNumber)" -ForegroundColor Gray
    Write-Host "  Name: $($response.name)" -ForegroundColor Gray
    Write-Host "  Full Address: $($response.fullAddress)" -ForegroundColor Gray
    $createdPharmacyId = $response.id
} catch {
    Write-Host "FAILED: Could not create pharmacy" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 2: Get Pharmacy by ID
if ($createdPharmacyId) {
    Write-Host "Test 2: GET /api/pharmacies/{id} - Get Pharmacy by ID" -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$pharmaciesUrl/$createdPharmacyId" -Method Get
        Write-Host "SUCCESS: Pharmacy retrieved successfully" -ForegroundColor Green
        Write-Host "  ID: $($response.id)" -ForegroundColor Gray
        Write-Host "  License: $($response.licenseNumber)" -ForegroundColor Gray
        Write-Host "  Name: $($response.name)" -ForegroundColor Gray
        Write-Host "  City: $($response.city)" -ForegroundColor Gray
        Write-Host "  State: $($response.state)" -ForegroundColor Gray
        Write-Host "  Phone: $($response.phone)" -ForegroundColor Gray
        Write-Host "  Email: $($response.email)" -ForegroundColor Gray
        Write-Host "  IsActive: $($response.isActive)" -ForegroundColor Gray
    } catch {
        Write-Host "FAILED: Could not get pharmacy" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 3: Update Pharmacy
if ($createdPharmacyId) {
    Write-Host "Test 3: PUT /api/pharmacies/{id} - Update Pharmacy" -ForegroundColor Yellow
    $updatePharmacyDto = @{
        address = "456 New Avenue"
        city = "Springfield"
        state = "Illinois"
        zipCode = "62702"
        phone = "+1-555-0200"
        email = "nuevo@farmaciatest.com"
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$pharmaciesUrl/$createdPharmacyId" -Method Put -Body $updatePharmacyDto -ContentType "application/json"
        Write-Host "SUCCESS: Pharmacy updated successfully" -ForegroundColor Green
        Write-Host "  New Address: $($response.address)" -ForegroundColor Gray
        Write-Host "  New City: $($response.city)" -ForegroundColor Gray
        Write-Host "  New Phone: $($response.phone)" -ForegroundColor Gray
        Write-Host "  New Email: $($response.email)" -ForegroundColor Gray
        Write-Host "  Full Address: $($response.fullAddress)" -ForegroundColor Gray
    } catch {
        Write-Host "FAILED: Could not update pharmacy" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 4: Search Pharmacies (no filters)
Write-Host "Test 4: GET /api/pharmacies - Search All Pharmacies" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri ($pharmaciesUrl + '?pageNumber=1&pageSize=10') -Method Get
    Write-Host "SUCCESS: Pharmacies retrieved successfully" -ForegroundColor Green
    Write-Host "  Total Count: $($response.totalCount)" -ForegroundColor Gray
    Write-Host "  Page: $($response.page)" -ForegroundColor Gray
    Write-Host "  Page Size: $($response.pageSize)" -ForegroundColor Gray
    Write-Host "  Items in page: $($response.items.Count)" -ForegroundColor Gray
    if ($response.items.Count -gt 0) {
        Write-Host "  First pharmacy: $($response.items[0].name) - $($response.items[0].city)" -ForegroundColor Gray
    }
} catch {
    Write-Host "FAILED: Could not search pharmacies" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Search by City
Write-Host "Test 5: GET /api/pharmacies?city=Springfield - Search by City" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri ($pharmaciesUrl + '?city=Springfield&pageNumber=1&pageSize=10') -Method Get
    Write-Host "SUCCESS: Pharmacies filtered by city successfully" -ForegroundColor Green
    Write-Host "  Total Count: $($response.totalCount)" -ForegroundColor Gray
    Write-Host "  Items found: $($response.items.Count)" -ForegroundColor Gray
    foreach ($pharmacy in $response.items) {
        Write-Host "  - $($pharmacy.name) in $($pharmacy.city), $($pharmacy.state)" -ForegroundColor Gray
    }
} catch {
    Write-Host "FAILED: Could not search by city" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: Search by State
Write-Host "Test 6: GET /api/pharmacies?state=Illinois - Search by State" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri ($pharmaciesUrl + '?state=Illinois&pageNumber=1&pageSize=10') -Method Get
    Write-Host "SUCCESS: Pharmacies filtered by state successfully" -ForegroundColor Green
    Write-Host "  Total Count: $($response.totalCount)" -ForegroundColor Gray
    Write-Host "  Items found: $($response.items.Count)" -ForegroundColor Gray
    foreach ($pharmacy in $response.items) {
        Write-Host "  - $($pharmacy.name) in $($pharmacy.city), $($pharmacy.state)" -ForegroundColor Gray
    }
} catch {
    Write-Host "FAILED: Could not search by state" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7: Search by Term
Write-Host "Test 7: GET /api/pharmacies?searchTerm=Test - Search by Term" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri ($pharmaciesUrl + '?searchTerm=Test&pageNumber=1&pageSize=10') -Method Get
    Write-Host "SUCCESS: Pharmacies filtered by search term successfully" -ForegroundColor Green
    Write-Host "  Total Count: $($response.totalCount)" -ForegroundColor Gray
    Write-Host "  Items found: $($response.items.Count)" -ForegroundColor Gray
    foreach ($pharmacy in $response.items) {
        Write-Host "  - $($pharmacy.name) - License: $($pharmacy.licenseNumber)" -ForegroundColor Gray
    }
} catch {
    Write-Host "FAILED: Could not search by term" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 8: Search Active Pharmacies
Write-Host "Test 8: GET /api/pharmacies?isActive=true - Search Active Pharmacies" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri ($pharmaciesUrl + '?isActive=true&pageNumber=1&pageSize=10') -Method Get
    Write-Host "SUCCESS: Active pharmacies retrieved successfully" -ForegroundColor Green
    Write-Host "  Total Count: $($response.totalCount)" -ForegroundColor Gray
    Write-Host "  Items found: $($response.items.Count)" -ForegroundColor Gray
} catch {
    Write-Host "FAILED: Could not search active pharmacies" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 9: Delete Pharmacy
if ($createdPharmacyId) {
    Write-Host "Test 9: DELETE /api/pharmacies/{id} - Delete Pharmacy" -ForegroundColor Yellow
    try {
        Invoke-RestMethod -Uri "$pharmaciesUrl/$createdPharmacyId" -Method Delete
        Write-Host "SUCCESS: Pharmacy deleted successfully" -ForegroundColor Green
    } catch {
        Write-Host "FAILED: Could not delete pharmacy" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""

    # Test 10: Verify deletion
    Write-Host "Test 10: Verify Pharmacy Deletion" -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$pharmaciesUrl/$createdPharmacyId" -Method Get
        Write-Host "FAILED: Pharmacy still exists (should have been deleted)" -ForegroundColor Red
    } catch {
        if ($_.Exception.Response.StatusCode -eq 404) {
            Write-Host "SUCCESS: Pharmacy successfully deleted (404 Not Found)" -ForegroundColor Green
        } else {
            Write-Host "FAILED: Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    Write-Host ""
}

# Test 11: Validation - Empty License Number
Write-Host "Test 11: Validation - Empty License Number" -ForegroundColor Yellow
$invalidDto = @{
    licenseNumber = ""
    name = "Test Pharmacy"
    address = "123 Test St"
    city = "Test City"
    state = "Test State"
    zipCode = "12345"
    phone = "+1234567890"
    email = "test@test.com"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $pharmaciesUrl -Method Post -Body $invalidDto -ContentType "application/json"
    Write-Host "FAILED: Should have failed validation" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "SUCCESS: Validation correctly rejected empty license number" -ForegroundColor Green
        if ($_.ErrorDetails.Message) {
            $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "  Validation errors:" -ForegroundColor Gray
            foreach ($error in $errorObj.errors) {
                Write-Host "    - $($error.property): $($error.error)" -ForegroundColor Gray
            }
        }
    } else {
        Write-Host "FAILED: Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 12: Validation - Invalid Email
Write-Host "Test 12: Validation - Invalid Email" -ForegroundColor Yellow
$invalidDto = @{
    licenseNumber = "PHARM-INVALID-$(Get-Random -Maximum 9999)"
    name = "Test Pharmacy"
    address = "123 Test St"
    city = "Test City"
    state = "Test State"
    zipCode = "12345"
    phone = "+1234567890"
    email = "invalid-email"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $pharmaciesUrl -Method Post -Body $invalidDto -ContentType "application/json"
    Write-Host "FAILED: Should have failed validation" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "SUCCESS: Validation correctly rejected invalid email" -ForegroundColor Green
        if ($_.ErrorDetails.Message) {
            $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "  Validation errors:" -ForegroundColor Gray
            foreach ($error in $errorObj.errors) {
                Write-Host "    - $($error.property): $($error.error)" -ForegroundColor Gray
            }
        }
    } else {
        Write-Host "FAILED: Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Tests Completed" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
