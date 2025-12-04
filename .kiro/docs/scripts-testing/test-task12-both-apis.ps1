# Test Tasks 12.8 & 12.12 - Doctors & Pharmacies APIs
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Tasks 12.8 & 12.12 - API Tests" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"
$passed = 0
$failed = 0

function Test-API {
    param([string]$Name, [string]$Method, [string]$Url, [object]$Body, [int]$Expected)
    Write-Host "Test: $Name" -ForegroundColor Yellow
    try {
        $params = @{Uri=$Url; Method=$Method; Headers=@{"Content-Type"="application/json"}; UseBasicParsing=$true}
        if ($Body) { $params.Body = ($Body | ConvertTo-Json -Depth 10) }
        $response = Invoke-WebRequest @params
        if ($response.StatusCode -eq $Expected) {
            Write-Host "  PASS ($($response.StatusCode))" -ForegroundColor Green
            $script:passed++
            return ($response.Content | ConvertFrom-Json)
        } else {
            Write-Host "  FAIL (Expected $Expected, got $($response.StatusCode))" -ForegroundColor Red
            $script:failed++
        }
    } catch {
        $code = $_.Exception.Response.StatusCode.value__
        if ($code -eq $Expected) {
            Write-Host "  PASS ($code)" -ForegroundColor Green
            $script:passed++
        } else {
            Write-Host "  FAIL (Expected $Expected, got $code)" -ForegroundColor Red
            $script:failed++
        }
    }
    Write-Host ""
    return $null
}

Write-Host "=== PHARMACIES API (Task 12.12) ===" -ForegroundColor Cyan
Write-Host ""

# Create Pharmacy
$randomNum = Get-Random -Minimum 1000 -Maximum 9999
$pharmBody = @{
    licenseNumber="PHARM-TEST-$randomNum"
    name="Farmacia Test"
    address="123 Main St"
    city="San Jose"
    state="San Jose"
    zipCode="10101"
    phone="+506-2222-3333"
    email="info@farmacia.com"
}
$pharmacy = Test-API "1. Create Pharmacy" "POST" "$baseUrl/api/pharmacies" $pharmBody 201

if ($pharmacy) {
    $pharmId = $pharmacy.id
    Write-Host "Created Pharmacy ID: $pharmId" -ForegroundColor Green
    Write-Host ""
    
    # Get Pharmacy
    Test-API "2. Get Pharmacy" "GET" "$baseUrl/api/pharmacies/$pharmId" $null 200
    
    # Update Pharmacy
    $updatePharm = @{phone="+506-9999-8888"; email="updated@farmacia.com"}
    Test-API "3. Update Pharmacy" "PUT" "$baseUrl/api/pharmacies/$pharmId" $updatePharm 200
    
    # Search Pharmacies
    Test-API "4. Search All" "GET" "$baseUrl/api/pharmacies?pageNumber=1&pageSize=10" $null 200
    Test-API "5. Search by City" "GET" "$baseUrl/api/pharmacies?city=San Jose&pageNumber=1&pageSize=10" $null 200
    Test-API "6. Search Active" "GET" "$baseUrl/api/pharmacies?isActive=true&pageNumber=1&pageSize=10" $null 200
    
    # Validation Tests
    $invalidPharm1 = @{licenseNumber=""; name="Test"; address="123"; city="Test"; state="Test"; zipCode="123"; phone="+506-1111"; email="test@test.com"}
    Test-API "7. Empty License" "POST" "$baseUrl/api/pharmacies" $invalidPharm1 400
    
    $invalidPharm2 = @{licenseNumber="PHARM-INV"; name="Test"; address="123"; city="Test"; state="Test"; zipCode="123"; phone="+506-1111"; email="invalid"}
    Test-API "8. Invalid Email" "POST" "$baseUrl/api/pharmacies" $invalidPharm2 400
    
    # Delete Pharmacy
    Test-API "9. Delete Pharmacy" "DELETE" "$baseUrl/api/pharmacies/$pharmId" $null 204
    Test-API "10. Verify Deletion" "GET" "$baseUrl/api/pharmacies/$pharmId" $null 404
}

Write-Host ""
Write-Host "=== DOCTORS API (Task 12.8) ===" -ForegroundColor Cyan
Write-Host ""

# Create Doctor
$randomNum = Get-Random -Minimum 1000 -Maximum 9999
$doctorBody = @{
    identificationNumber="ID-$randomNum"
    firstName="Juan"
    lastName="Perez"
    medicalLicenseNumber="DOC-TEST-$randomNum"
    specialtyId="4369f5bd-2dda-0e0f-e063-020016acf8b0"  # Medicina General
    phone="+506-8888-9999"
    email="dr.juan@hospital.com"
}
$doctor = Test-API "1. Create Doctor" "POST" "$baseUrl/api/doctors" $doctorBody 201

if ($doctor) {
    $doctorId = $doctor.id
    Write-Host "Created Doctor ID: $doctorId" -ForegroundColor Green
    Write-Host ""
    
    # Get Doctor
    Test-API "2. Get Doctor" "GET" "$baseUrl/api/doctors/$doctorId" $null 200
    
    # Update Doctor
    $updateDoc = @{phone="+506-7777-8888"; email="dr.juan.updated@hospital.com"}
    Test-API "3. Update Doctor" "PUT" "$baseUrl/api/doctors/$doctorId" $updateDoc 200
    
    # Search Doctors
    Test-API "4. Search All" "GET" "$baseUrl/api/doctors?pageNumber=1&pageSize=10" $null 200
    Test-API "5. Search by Name" "GET" "$baseUrl/api/doctors?searchTerm=Juan&pageNumber=1&pageSize=10" $null 200
    Test-API "6. Search Active" "GET" "$baseUrl/api/doctors?isActive=true&pageNumber=1&pageSize=10" $null 200
    
    # Validation Tests
    $invalidDoc1 = @{identificationNumber="ID-TEST"; medicalLicenseNumber=""; firstName="Test"; lastName="Doctor"; specialtyId="4369f5bd-2dda-0e0f-e063-020016acf8b0"; phone="+506-8888-9999"; email="test@test.com"}
    Test-API "7. Empty License" "POST" "$baseUrl/api/doctors" $invalidDoc1 400
    
    $invalidDoc2 = @{identificationNumber="ID-TEST2"; medicalLicenseNumber="DOC-INV"; firstName="Test"; lastName="Doctor"; specialtyId="4369f5bd-2dda-0e0f-e063-020016acf8b0"; phone="+506-8888-9999"; email="invalid"}
    Test-API "8. Invalid Email" "POST" "$baseUrl/api/doctors" $invalidDoc2 400
    
    # Delete Doctor
    Test-API "9. Delete Doctor" "DELETE" "$baseUrl/api/doctors/$doctorId" $null 204
    Test-API "10. Verify Deletion" "GET" "$baseUrl/api/doctors/$doctorId" $null 404
}

# Summary
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "Total: $($passed + $failed)" -ForegroundColor Cyan
Write-Host ""

if ($failed -eq 0) {
    Write-Host "ALL TESTS PASSED!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "SOME TESTS FAILED" -ForegroundColor Red
    exit 1
}
