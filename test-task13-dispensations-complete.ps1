# Test Task 13.6 - Dispensations API
# Script automatizado completo para probar todos los endpoints de Dispensations

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
    $health = Invoke-WebRequest -Uri "$baseUrl/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "API is running" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "API is not responding. Please start Docker:" -ForegroundColor Red
    Write-Host "  docker-compose up -d eprescription-api" -ForegroundColor Yellow
    exit 1
}

# Setup: Create test data
Write-Host "=== SETUP: CREATING TEST DATA ===" -ForegroundColor Cyan

# 1. Create Patient
$randomNum = Get-Random -Minimum 1000 -Maximum 9999
$patientBody = @{
    identificationNumber = "TEST-$randomNum"
    firstName = "Juan"
    lastName = "Perez Test"
    dateOfBirth = "1990-01-01T00:00:00Z"
    gender = "M"
    bloodType = "O+"
    contacts = @(
        @{
            contactType = "email"
            contactValue = "juan.test$randomNum@test.com"
            isPrimary = $true
        },
        @{
            contactType = "phone"
            contactValue = "+506-8888-$randomNum"
            isPrimary = $true
        }
    )
    allergies = @()
}

$patient = Test-Endpoint `
    -Name "Create Test Patient" `
    -Method "POST" `
    -Url "$baseUrl/api/patients" `
    -Body $patientBody `
    -ExpectedStatus 201 `
    -Validation { param($data) $data.id }

if (-not $patient) {
    Write-Host "Cannot proceed without patient" -ForegroundColor Red
    exit 1
}
$patientId = $patient.id
Write-Host "Created Patient ID: $patientId" -ForegroundColor Green

# 2. Get existing specialty (we need this for doctor)
Write-Host "Getting existing specialty..." -ForegroundColor Yellow
try {
    $specialtiesResponse = Invoke-WebRequest -Uri "$baseUrl/api/specialties" -UseBasicParsing
    $specialties = $specialtiesResponse.Content | ConvertFrom-Json
    if ($specialties -and $specialties.Count -gt 0) {
        $specialtyId = $specialties[0].id
        Write-Host "  OK Using Specialty ID: $specialtyId" -ForegroundColor Green
    } else {
        Write-Host "  FAIL No specialties found" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "  FAIL Could not get specialties" -ForegroundColor Red
    exit 1
}

# 3. Create Doctor
$doctorBody = @{
    identificationNumber = "ID-$randomNum"
    medicalLicenseNumber = "MED-TEST-$randomNum"
    firstName = "Carlos"
    lastName = "Rodriguez"
    specialtyId = $specialtyId
    phone = "+506-7777-$randomNum"
    email = "carlos.test$randomNum@hospital.com"
}

$doctor = Test-Endpoint `
    -Name "Create Test Doctor" `
    -Method "POST" `
    -Url "$baseUrl/api/doctors" `
    -Body $doctorBody `
    -ExpectedStatus 201 `
    -Validation { param($data) $data.id }

if (-not $doctor) {
    Write-Host "Cannot proceed without doctor" -ForegroundColor Red
    exit 1
}
$doctorId = $doctor.id
Write-Host "Created Doctor ID: $doctorId" -ForegroundColor Green

# 4. Create Pharmacy
$pharmacyBody = @{
    licenseNumber = "PHARM-TEST-$randomNum"
    name = "Farmacia Test Dispensaciones"
    address = "456 Pharmacy Ave"
    city = "San Jose"
    state = "San Jose"
    zipCode = "10102"
    phone = "+506-6666-$randomNum"
    email = "farmacia.test$randomNum@test.com"
}

$pharmacy = Test-Endpoint `
    -Name "Create Test Pharmacy" `
    -Method "POST" `
    -Url "$baseUrl/api/pharmacies" `
    -Body $pharmacyBody `
    -ExpectedStatus 201 `
    -Validation { param($data) $data.id }

if (-not $pharmacy) {
    Write-Host "Cannot proceed without pharmacy" -ForegroundColor Red
    exit 1
}
$pharmacyId = $pharmacy.id
Write-Host "Created Pharmacy ID: $pharmacyId" -ForegroundColor Green

# 5. Use generic IDs that should exist in database
Write-Host "Using generic medication and route IDs..." -ForegroundColor Yellow
$medicationId = "11111111-1111-1111-1111-111111111111"  # Generic medication ID
$administrationRouteId = "22222222-2222-2222-2222-222222222222"  # Generic route ID
$medicalCenterId = "33333333-3333-3333-3333-333333333333"  # Generic medical center ID
Write-Host "  Using Medication ID: $medicationId" -ForegroundColor Gray
Write-Host "  Using Administration Route ID: $administrationRouteId" -ForegroundColor Gray
Write-Host "  Using Medical Center ID: $medicalCenterId" -ForegroundColor Gray

# 6. Create Prescription
$prescriptionBody = @{
    patientId = $patientId
    doctorId = $doctorId
    medicalCenterId = $medicalCenterId
    prescriptionDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
    notes = "Test prescription for dispensation testing"
    medications = @(
        @{
            medicationId = $medicationId
            dosage = "500mg"
            frequency = "Every 8 hours"
            durationDays = 7
            administrationRouteId = $administrationRouteId
            quantity = 21
        }
    )
    diagnoses = @(
        @{
            cie10Code = "Z00.0"
            isPrimary = $true
            notes = "General medical examination"
        }
    )
}

$prescription = Test-Endpoint `
    -Name "Create Test Prescription" `
    -Method "POST" `
    -Url "$baseUrl/api/prescriptions" `
    -Body $prescriptionBody `
    -ExpectedStatus 201 `
    -Validation { param($data) $data.id -and $data.medications -and $data.medications.Count -gt 0 }

if (-not $prescription) {
    Write-Host "Cannot proceed without prescription" -ForegroundColor Red
    exit 1
}
$prescriptionId = $prescription.id
$prescriptionMedicationId = $prescription.medications[0].id
Write-Host "Created Prescription ID: $prescriptionId" -ForegroundColor Green
Write-Host "Prescription Medication ID: $prescriptionMedicationId" -ForegroundColor Green

# 7. Get or create inventory (mock for now since we don't have inventory creation endpoint)
$inventoryId = "99999999-9999-9999-9999-999999999999"
Write-Host "Using mock Inventory ID: $inventoryId" -ForegroundColor Yellow

Write-Host ""
Write-Host "=== TEST DATA READY ===" -ForegroundColor Green
Write-Host ""

# DISPENSATION TESTS
Write-Host "=== DISPENSATION OPERATIONS ===" -ForegroundColor Cyan

# 8. Register Dispensation
$dispensationBody = @{
    prescriptionId = $prescriptionId
    pharmacyId = $pharmacyId
    notes = "Test dispensation - automated test script"
    items = @(
        @{
            prescriptionMedicationId = $prescriptionMedicationId
            inventoryId = $inventoryId
            quantityDispensed = 21
            batchNumber = "BATCH-TEST-$randomNum"
            expirationDate = "2025-12-31T00:00:00Z"
        }
    )
}

$dispensation = Test-Endpoint `
    -Name "Register Dispensation" `
    -Method "POST" `
    -Url "$baseUrl/api/dispensations" `
    -Body $dispensationBody `
    -ExpectedStatus 201 `
    -Validation { param($data) 
        $data.id -and $data.status -eq "pending" -and $data.items -and $data.items.Count -gt 0
    }

if (-not $dispensation) {
    Write-Host "Dispensation creation failed - this might be due to inventory validation" -ForegroundColor Yellow
    Write-Host "Continuing with other tests..." -ForegroundColor Yellow
    
    # Try to get an existing dispensation for remaining tests
    try {
        $existingResponse = Invoke-WebRequest -Uri "$baseUrl/api/dispensations?pageNumber=1&pageSize=1" -UseBasicParsing
        $existing = $existingResponse.Content | ConvertFrom-Json
        if ($existing.items -and $existing.items.Count -gt 0) {
            $dispensation = $existing.items[0]
            $dispensationId = $dispensation.id
            Write-Host "Using existing Dispensation ID: $dispensationId" -ForegroundColor Yellow
        } else {
            Write-Host "No existing dispensations found - skipping remaining tests" -ForegroundColor Yellow
            $dispensationId = $null
        }
    } catch {
        Write-Host "Could not get existing dispensations" -ForegroundColor Yellow
        $dispensationId = $null
    }
} else {
    $dispensationId = $dispensation.id
    Write-Host "Created Dispensation ID: $dispensationId" -ForegroundColor Green
}

# Only continue if we have a dispensation ID
if ($dispensationId) {
    # 9. Get Dispensation by ID
    $getDispensation = Test-Endpoint `
        -Name "Get Dispensation by ID" `
        -Method "GET" `
        -Url "$baseUrl/api/dispensations/$dispensationId" `
        -ExpectedStatus 200 `
        -Validation { param($data) 
            $data.id -eq $dispensationId -and $data.prescription -and $data.pharmacy
        }

    # 10. Verify Dispensation
    $verifyBody = @{
        notes = "Verified by pharmacist - automated test"
    }

    $verifiedDispensation = Test-Endpoint `
        -Name "Verify Dispensation" `
        -Method "POST" `
        -Url "$baseUrl/api/dispensations/$dispensationId/verify" `
        -Body $verifyBody `
        -ExpectedStatus 200 `
        -Validation { param($data) 
            $data.status -eq "verified"
        }

    # 11. Get Dispensation After Verification
    $finalDispensation = Test-Endpoint `
        -Name "Get Dispensation After Verification" `
        -Method "GET" `
        -Url "$baseUrl/api/dispensations/$dispensationId" `
        -ExpectedStatus 200 `
        -Validation { param($data) 
            $data.status -eq "verified"
        }
}

# Error Handling Tests
Write-Host "=== ERROR HANDLING TESTS ===" -ForegroundColor Cyan

# 12. Get Non-existent Dispensation
Test-Endpoint `
    -Name "Get Non-existent Dispensation (404)" `
    -Method "GET" `
    -Url "$baseUrl/api/dispensations/00000000-0000-0000-0000-000000000000" `
    -ExpectedStatus 404

# 13. Invalid Dispensation Data
$invalidBody = @{
    prescriptionId = ""
    pharmacyId = ""
    items = @()
}

Test-Endpoint `
    -Name "Validation - Invalid Dispensation Data (400)" `
    -Method "POST" `
    -Url "$baseUrl/api/dispensations" `
    -Body $invalidBody `
    -ExpectedStatus 400

# Not Implemented Endpoints
Write-Host "=== NOT IMPLEMENTED ENDPOINTS ===" -ForegroundColor Cyan

# 14. Get by Prescription (Not Implemented)
Test-Endpoint `
    -Name "Get by Prescription (501)" `
    -Method "GET" `
    -Url "$baseUrl/api/dispensations/by-prescription/$prescriptionId" `
    -ExpectedStatus 501

# 15. Get by Pharmacy (Not Implemented)
Test-Endpoint `
    -Name "Get by Pharmacy (501)" `
    -Method "GET" `
    -Url "$baseUrl/api/dispensations/by-pharmacy/$pharmacyId" `
    -ExpectedStatus 501

# Cleanup
Write-Host "=== CLEANUP ===" -ForegroundColor Cyan

# Delete test data in reverse order
if ($prescriptionId) {
    Test-Endpoint `
        -Name "Delete Test Prescription" `
        -Method "DELETE" `
        -Url "$baseUrl/api/prescriptions/$prescriptionId" `
        -ExpectedStatus 204
}

if ($pharmacyId) {
    Test-Endpoint `
        -Name "Delete Test Pharmacy" `
        -Method "DELETE" `
        -Url "$baseUrl/api/pharmacies/$pharmacyId" `
        -ExpectedStatus 204
}

if ($doctorId) {
    Test-Endpoint `
        -Name "Delete Test Doctor" `
        -Method "DELETE" `
        -Url "$baseUrl/api/doctors/$doctorId" `
        -ExpectedStatus 204
}

if ($patientId) {
    Test-Endpoint `
        -Name "Delete Test Patient" `
        -Method "DELETE" `
        -Url "$baseUrl/api/patients/$patientId" `
        -ExpectedStatus 204
}

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
    Write-Host ""
    Write-Host "Task 13.6 - Dispensations API is working correctly!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "SOME TESTS FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Note: Some failures may be expected if inventory validation is strict" -ForegroundColor Yellow
    exit 1
}
