# Test script for Task 12 - Patients API Endpoints
# Tests all CRUD operations and search functionality

$baseUrl = "http://localhost:8000/api"
$patientsUrl = "$baseUrl/patients"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Patients API Endpoints" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Create a new patient
Write-Host "Test 1: Creating a new patient..." -ForegroundColor Yellow
$newPatient = @{
    identificationNumber = "TEST-$(Get-Random -Maximum 99999)"
    firstName = "Juan"
    lastName = "Pérez"
    dateOfBirth = "1985-05-15T00:00:00Z"
    gender = "M"
    bloodType = "O+"
    contacts = @(
        @{
            contactType = "email"
            contactValue = "juan.perez@example.com"
            isPrimary = $true
        },
        @{
            contactType = "phone"
            contactValue = "+1-555-0123"
            isPrimary = $true
        }
    )
    allergies = @(
        @{
            allergenType = "medication"
            allergenName = "Penicilina"
            severity = "severe"
            notes = "Reacción alérgica severa"
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $createResponse = Invoke-RestMethod -Uri $patientsUrl -Method Post -Body $newPatient -ContentType "application/json"
    Write-Host "✓ Patient created successfully!" -ForegroundColor Green
    Write-Host "  Patient ID: $($createResponse.id)" -ForegroundColor Gray
    Write-Host "  Name: $($createResponse.firstName) $($createResponse.lastName)" -ForegroundColor Gray
    Write-Host "  Identification: $($createResponse.identificationNumber)" -ForegroundColor Gray
    Write-Host "  Age: $($createResponse.age) years" -ForegroundColor Gray
    Write-Host "  Contacts: $($createResponse.contacts.Count)" -ForegroundColor Gray
    Write-Host "  Allergies: $($createResponse.allergies.Count)" -ForegroundColor Gray
    $patientId = $createResponse.id
    Write-Host ""
} catch {
    Write-Host "✗ Failed to create patient" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    Write-Host ""
    exit 1
}

# Test 2: Get patient by ID
Write-Host "Test 2: Getting patient by ID..." -ForegroundColor Yellow
try {
    $getResponse = Invoke-RestMethod -Uri "$patientsUrl/$patientId" -Method Get
    Write-Host "✓ Patient retrieved successfully!" -ForegroundColor Green
    Write-Host "  Name: $($getResponse.firstName) $($getResponse.lastName)" -ForegroundColor Gray
    Write-Host "  Blood Type: $($getResponse.bloodType)" -ForegroundColor Gray
    Write-Host "  Primary Email: $($getResponse.contacts | Where-Object { $_.contactType -eq 'email' -and $_.isPrimary } | Select-Object -ExpandProperty contactValue)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get patient" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 3: Update patient
Write-Host "Test 3: Updating patient..." -ForegroundColor Yellow
$updatePatient = @{
    firstName = "Juan Carlos"
    lastName = "Pérez García"
    bloodType = "O+"
    contacts = @(
        @{
            contactType = "email"
            contactValue = "juancarlos.perez@example.com"
            isPrimary = $true
        },
        @{
            contactType = "mobile"
            contactValue = "+1-555-9999"
            isPrimary = $true
        }
    )
    allergies = @(
        @{
            allergenType = "medication"
            allergenName = "Penicilina"
            severity = "severe"
            notes = "Reacción alérgica severa - actualizado"
        },
        @{
            allergenType = "food"
            allergenName = "Maní"
            severity = "moderate"
            notes = "Alergia alimentaria"
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $updateResponse = Invoke-RestMethod -Uri "$patientsUrl/$patientId" -Method Put -Body $updatePatient -ContentType "application/json"
    Write-Host "✓ Patient updated successfully!" -ForegroundColor Green
    Write-Host "  Updated Name: $($updateResponse.firstName) $($updateResponse.lastName)" -ForegroundColor Gray
    Write-Host "  Contacts: $($updateResponse.contacts.Count)" -ForegroundColor Gray
    Write-Host "  Allergies: $($updateResponse.allergies.Count)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Failed to update patient" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 4: Search patients (get all with pagination)
Write-Host "Test 4: Searching all patients (paginated)..." -ForegroundColor Yellow
try {
    $searchResponse = Invoke-RestMethod -Uri "$patientsUrl`?page=1`&pageSize=5" -Method Get
    Write-Host "✓ Search completed successfully!" -ForegroundColor Green
    Write-Host "  Total patients: $($searchResponse.totalCount)" -ForegroundColor Gray
    Write-Host "  Page: $($searchResponse.page) of $($searchResponse.totalPages)" -ForegroundColor Gray
    Write-Host "  Patients in this page: $($searchResponse.items.Count)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Failed to search patients" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 5: Advanced search with filters
Write-Host "Test 5: Advanced search with filters..." -ForegroundColor Yellow
$searchCriteria = @{
    searchTerm = "Juan"
    page = 1
    pageSize = 10
    sortBy = "LastName"
    sortDirection = "asc"
} | ConvertTo-Json

try {
    $advancedSearchResponse = Invoke-RestMethod -Uri "$patientsUrl/search" -Method Post -Body $searchCriteria -ContentType "application/json"
    Write-Host "✓ Advanced search completed!" -ForegroundColor Green
    Write-Host "  Found: $($advancedSearchResponse.totalCount) patients" -ForegroundColor Gray
    if ($advancedSearchResponse.items.Count -gt 0) {
        Write-Host "  First result: $($advancedSearchResponse.items[0].firstName) $($advancedSearchResponse.items[0].lastName)" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "✗ Failed advanced search" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 6: Search by identification number
Write-Host "Test 6: Search by identification number..." -ForegroundColor Yellow
try {
    $identificationNumber = $createResponse.identificationNumber
    $idSearchResponse = Invoke-RestMethod -Uri "$patientsUrl/identification/$identificationNumber" -Method Get
    Write-Host "✓ Search by identification completed!" -ForegroundColor Green
    Write-Host "  Found: $($idSearchResponse.totalCount) patient(s)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Failed to search by identification" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 7: Search by name
Write-Host "Test 7: Search by name..." -ForegroundColor Yellow
try {
    $nameSearchResponse = Invoke-RestMethod -Uri "$patientsUrl/name/Juan" -Method Get
    Write-Host "✓ Search by name completed!" -ForegroundColor Green
    Write-Host "  Found: $($nameSearchResponse.totalCount) patient(s)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Failed to search by name" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 8: Delete patient
Write-Host "Test 8: Deleting patient..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$patientsUrl/$patientId" -Method Delete
    Write-Host "✓ Patient deleted successfully!" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "✗ Failed to delete patient" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 9: Verify deletion
Write-Host "Test 9: Verifying deletion..." -ForegroundColor Yellow
try {
    $verifyResponse = Invoke-RestMethod -Uri "$patientsUrl/$patientId" -Method Get
    Write-Host "✗ Patient still exists (should have been deleted)" -ForegroundColor Red
    Write-Host ""
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "OK Patient successfully deleted (404 Not Found)" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "ERROR Unexpected error" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

# Test 10: Validation test - Try to create patient with invalid data
Write-Host "Test 10: Validation test (invalid gender)..." -ForegroundColor Yellow
$invalidPatient = @{
    identificationNumber = "INVALID-TEST"
    firstName = "Test"
    lastName = "Invalid"
    dateOfBirth = "1990-01-01T00:00:00Z"
    gender = "INVALID"  # Invalid gender
    bloodType = "O+"
    contacts = @()
    allergies = @()
} | ConvertTo-Json

try {
    $invalidResponse = Invoke-RestMethod -Uri $patientsUrl -Method Post -Body $invalidPatient -ContentType "application/json"
    Write-Host "ERROR Validation should have failed but did not" -ForegroundColor Red
    Write-Host ""
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "OK Validation correctly rejected invalid data (400 Bad Request)" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "ERROR Unexpected error" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All tests completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
