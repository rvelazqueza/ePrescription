# Test script for Task 12 - Patients API with Keycloak Authentication

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Task 12 - Patients API with Auth Tests" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$keycloakUrl = "http://localhost:8080"
$realm = "eprescription"
$clientId = "eprescription-api"
$apiUrl = "http://localhost:8000"

$doctorUser = @{
    username = "doctor1"
    password = "doctor123"
}

function Get-KeycloakToken {
    param([string]$username, [string]$password)
    
    $tokenUrl = "$keycloakUrl/realms/$realm/protocol/openid-connect/token"
    $body = @{
        grant_type = "password"
        client_id = $clientId
        username = $username
        password = $password
    }
    
    try {
        $response = Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $body -ContentType "application/x-www-form-urlencoded"
        return $response.access_token
    }
    catch {
        Write-Host "Error getting token: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host "Test 1: Authenticating as doctor..." -ForegroundColor Yellow
$doctorToken = Get-KeycloakToken -username $doctorUser.username -password $doctorUser.password

if ($doctorToken) {
    Write-Host "OK Doctor authenticated" -ForegroundColor Green
} else {
    Write-Host "FAIL Authentication failed" -ForegroundColor Red
    exit 1
}

Write-Host "`nTest 2: Creating patient with auth..." -ForegroundColor Yellow
$createBody = '{"identificationNumber":"AUTH-TEST-001","firstName":"Carlos","lastName":"Authenticated","dateOfBirth":"1990-05-15","gender":"M","bloodType":"A+","contacts":[{"contactType":"email","contactValue":"carlos.auth@test.com","isPrimary":true}],"allergies":[{"allergenType":"medication","allergenName":"Penicilina","severity":"severe","notes":"Reaccion alergica"}]}'

try {
    $headers = @{ "Authorization" = "Bearer $doctorToken"; "Content-Type" = "application/json" }
    $patient = Invoke-RestMethod -Uri "$apiUrl/api/patients" -Method Post -Body $createBody -Headers $headers
    Write-Host "OK Patient created - ID: $($patient.id)" -ForegroundColor Green
    Write-Host "   Contacts: $($patient.contacts.Count), Allergies: $($patient.allergies.Count)" -ForegroundColor Gray
    $patientId = $patient.id
}
catch {
    Write-Host "FAIL Create failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`nTest 3: Getting patient with auth..." -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $doctorToken" }
    $retrieved = Invoke-RestMethod -Uri "$apiUrl/api/patients/$patientId" -Method Get -Headers $headers
    Write-Host "OK Patient retrieved" -ForegroundColor Green
    Write-Host "   Name: $($retrieved.firstName) $($retrieved.lastName)" -ForegroundColor Gray
    Write-Host "   Contacts: $($retrieved.contacts.Count), Allergies: $($retrieved.allergies.Count)" -ForegroundColor Gray
}
catch {
    Write-Host "FAIL Get failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest 4: Updating patient with auth..." -ForegroundColor Yellow
$updateBody = '{"firstName":"Carlos Updated","lastName":"Authenticated Martinez","bloodType":"AB+"}'
try {
    $headers = @{ "Authorization" = "Bearer $doctorToken"; "Content-Type" = "application/json" }
    $updated = Invoke-RestMethod -Uri "$apiUrl/api/patients/$patientId" -Method Put -Body $updateBody -Headers $headers
    Write-Host "OK Patient updated - New name: $($updated.firstName) $($updated.lastName)" -ForegroundColor Green
}
catch {
    Write-Host "FAIL Update failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest 5: Searching patients with auth..." -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $doctorToken" }
    $searchResults = Invoke-RestMethod -Uri "$apiUrl/api/patients/search?searchTerm=Carlos&page=1&pageSize=10" -Method Get -Headers $headers
    Write-Host "OK Search completed - Found: $($searchResults.totalCount)" -ForegroundColor Green
}
catch {
    Write-Host "FAIL Search failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest 6: Testing without authentication (should fail)..." -ForegroundColor Yellow
try {
    $result = Invoke-RestMethod -Uri "$apiUrl/api/patients/$patientId" -Method Get
    Write-Host "FAIL Request succeeded without auth (SECURITY ISSUE!)" -ForegroundColor Red
}
catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "OK Correctly rejected (401 Unauthorized)" -ForegroundColor Green
    } else {
        Write-Host "FAIL Unexpected error" -ForegroundColor Red
    }
}

Write-Host "`nTest 7: Deleting patient with auth..." -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $doctorToken" }
    Invoke-RestMethod -Uri "$apiUrl/api/patients/$patientId" -Method Delete -Headers $headers | Out-Null
    Write-Host "OK Patient deleted" -ForegroundColor Green
}
catch {
    Write-Host "FAIL Delete failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest 8: Verifying deletion..." -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $doctorToken" }
    $result = Invoke-RestMethod -Uri "$apiUrl/api/patients/$patientId" -Method Get -Headers $headers
    Write-Host "FAIL Patient still exists" -ForegroundColor Red
}
catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 404) {
        Write-Host "OK Patient successfully deleted (404)" -ForegroundColor Green
    } else {
        Write-Host "FAIL Unexpected error" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "All tests completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
