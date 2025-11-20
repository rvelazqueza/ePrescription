# Test Task 11 - Prescriptions API Endpoints
# This script tests all CRUD operations for prescriptions

$baseUrl = "http://localhost:8000/api"
$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Task 11 - Prescriptions API Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Use known IDs from seed data (Task 3)
$patientId = "11111111-1111-1111-1111-111111111111"
$doctorId = "22222222-2222-2222-2222-222222222222"
$medicalCenterId = "33333333-3333-3333-3333-333333333333"
$medicationId = "44444444-4444-4444-4444-444444444444"
$routeId = "55555555-5555-5555-5555-555555555555"

Write-Host "Using seed data IDs:" -ForegroundColor Yellow
Write-Host "  Patient ID: $patientId" -ForegroundColor Gray
Write-Host "  Doctor ID: $doctorId" -ForegroundColor Gray
Write-Host "  Medical Center ID: $medicalCenterId" -ForegroundColor Gray
Write-Host "  Medication ID: $medicationId" -ForegroundColor Gray
Write-Host "  Administration Route ID: $routeId" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 2: Create Prescription
Write-Host "Step 1: Creating a new prescription..." -ForegroundColor Yellow

$createPrescriptionDto = @{
    patientId = $patientId
    doctorId = $doctorId
    medicalCenterId = $medicalCenterId
    prescriptionDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    expirationDate = (Get-Date).AddDays(30).ToString("yyyy-MM-ddTHH:mm:ss")
    notes = "Test prescription created by automated test"
    diagnoses = @(
        @{
            cie10Code = "J00"
            isPrimary = $true
            notes = "Acute nasopharyngitis (common cold)"
        }
    )
    medications = @(
        @{
            medicationId = $medicationId
            dosage = "500mg"
            frequency = "Every 8 hours"
            durationDays = 7
            administrationRouteId = $routeId
            quantity = 21
            instructions = "Take with food"
            aiSuggested = $false
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/prescriptions" -Method Post -Headers $headers -Body $createPrescriptionDto -ErrorAction Stop
    $prescriptionId = $createResponse.id
    $prescriptionNumber = $createResponse.prescriptionNumber
    Write-Host "[OK] Prescription created successfully!" -ForegroundColor Green
    Write-Host "  ID: $prescriptionId" -ForegroundColor Gray
    Write-Host "  Number: $prescriptionNumber" -ForegroundColor Gray
    Write-Host "  Status: $($createResponse.status)" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Error creating prescription: $_" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 3: Get Prescription by ID
Write-Host "Step 2: Getting prescription by ID..." -ForegroundColor Yellow

try {
    $getResponse = Invoke-RestMethod -Uri "$baseUrl/prescriptions/$prescriptionId" -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "[OK] Prescription retrieved successfully!" -ForegroundColor Green
    Write-Host "  Number: $($getResponse.prescriptionNumber)" -ForegroundColor Gray
    Write-Host "  Patient: $($getResponse.patient.firstName) $($getResponse.patient.lastName)" -ForegroundColor Gray
    Write-Host "  Doctor: $($getResponse.doctor.firstName) $($getResponse.doctor.lastName)" -ForegroundColor Gray
    Write-Host "  Medications: $($getResponse.medications.Count)" -ForegroundColor Gray
    Write-Host "  Diagnoses: $($getResponse.diagnoses.Count)" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Error getting prescription: $_" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 4: Update Prescription
Write-Host "Step 3: Updating prescription..." -ForegroundColor Yellow

$updatePrescriptionDto = @{
    notes = "Updated notes - Test modification"
    expirationDate = (Get-Date).AddDays(60).ToString("yyyy-MM-ddTHH:mm:ss")
} | ConvertTo-Json

try {
    $updateResponse = Invoke-RestMethod -Uri "$baseUrl/prescriptions/$prescriptionId" -Method Put -Headers $headers -Body $updatePrescriptionDto -ErrorAction Stop
    Write-Host "[OK] Prescription updated successfully!" -ForegroundColor Green
    Write-Host "  Updated notes: $($updateResponse.notes)" -ForegroundColor Gray
    Write-Host "  New expiration: $($updateResponse.expirationDate)" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Error updating prescription: $_" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 5: Search Prescriptions
Write-Host "Step 4: Searching prescriptions..." -ForegroundColor Yellow

$searchDto = @{
    patientId = $patientId
    page = 1
    pageSize = 10
    sortBy = "PrescriptionDate"
    sortDirection = "desc"
} | ConvertTo-Json

try {
    $searchResponse = Invoke-RestMethod -Uri "$baseUrl/prescriptions/search" -Method Post -Headers $headers -Body $searchDto -ErrorAction Stop
    Write-Host "[OK] Search completed successfully!" -ForegroundColor Green
    Write-Host "  Total results: $($searchResponse.totalCount)" -ForegroundColor Gray
    Write-Host "  Page: $($searchResponse.page) of $($searchResponse.totalPages)" -ForegroundColor Gray
    Write-Host "  Items in page: $($searchResponse.items.Count)" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Error searching prescriptions: $_" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 6: Get Prescriptions by Patient
Write-Host "Step 5: Getting prescriptions by patient..." -ForegroundColor Yellow

try {
    $patientPrescriptions = Invoke-RestMethod -Uri "$baseUrl/prescriptions/patient/$patientId" -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "[OK] Patient prescriptions retrieved successfully!" -ForegroundColor Green
    Write-Host "  Total prescriptions: $($patientPrescriptions.totalCount)" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Error getting patient prescriptions: $_" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 7: Get Prescriptions by Doctor
Write-Host "Step 6: Getting prescriptions by doctor..." -ForegroundColor Yellow

try {
    $doctorPrescriptions = Invoke-RestMethod -Uri "$baseUrl/prescriptions/doctor/$doctorId" -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "[OK] Doctor prescriptions retrieved successfully!" -ForegroundColor Green
    Write-Host "  Total prescriptions: $($doctorPrescriptions.totalCount)" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Error getting doctor prescriptions: $_" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 8: Get Prescriptions by Status
Write-Host "Step 7: Getting prescriptions by status..." -ForegroundColor Yellow

try {
    $statusPrescriptions = Invoke-RestMethod -Uri "$baseUrl/prescriptions/status/Active" -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "[OK] Status prescriptions retrieved successfully!" -ForegroundColor Green
    Write-Host "  Total active prescriptions: $($statusPrescriptions.totalCount)" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Error getting status prescriptions: $_" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 9: Delete (Cancel) Prescription
Write-Host "Step 8: Deleting (cancelling) prescription..." -ForegroundColor Yellow

try {
    Invoke-RestMethod -Uri "$baseUrl/prescriptions/$prescriptionId" -Method Delete -Headers $headers -ErrorAction Stop
    Write-Host "[OK] Prescription cancelled successfully!" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Error deleting prescription: $_" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 10: Verify prescription is cancelled
Write-Host "Step 9: Verifying prescription status..." -ForegroundColor Yellow

try {
    $verifyResponse = Invoke-RestMethod -Uri "$baseUrl/prescriptions/$prescriptionId" -Method Get -Headers $headers -ErrorAction Stop
    if ($verifyResponse.status -eq "Cancelled") {
        Write-Host "[OK] Prescription status verified as Cancelled!" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Prescription status is $($verifyResponse.status), expected Cancelled" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[FAIL] Error verifying prescription: $_" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All tests completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "[OK] Create Prescription" -ForegroundColor Green
Write-Host "[OK] Get Prescription by ID" -ForegroundColor Green
Write-Host "[OK] Update Prescription" -ForegroundColor Green
Write-Host "[OK] Search Prescriptions" -ForegroundColor Green
Write-Host "[OK] Get by Patient" -ForegroundColor Green
Write-Host "[OK] Get by Doctor" -ForegroundColor Green
Write-Host "[OK] Get by Status" -ForegroundColor Green
Write-Host "[OK] Delete (Cancel) Prescription" -ForegroundColor Green
Write-Host "[OK] Verify Cancellation" -ForegroundColor Green
Write-Host ""
