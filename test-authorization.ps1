# Test Authorization System - Task 8
# This script tests all authorization endpoints with different user roles

param(
    [string]$ApiUrl = "http://localhost:5000",
    [string]$KeycloakUrl = "http://localhost:8080"
)

Write-Host "=== Task 8 - Authorization System Test ===" -ForegroundColor Cyan
Write-Host ""

# Test users with different roles
$testUsers = @{
    admin = @{ Username = "admin.user"; Password = "admin123"; Role = "admin" }
    doctor = @{ Username = "doctor1"; Password = "doctor123"; Role = "doctor" }
    pharmacist = @{ Username = "pharmacist1"; Password = "pharmacist123"; Role = "pharmacist" }
    patient = @{ Username = "patient1"; Password = "patient123"; Role = "patient" }
    auditor = @{ Username = "auditor1"; Password = "auditor123"; Role = "auditor" }
}

$tokens = @{}
$testResults = @()

# Function to add test result
function Add-TestResult {
    param($Test, $Expected, $Actual, $Passed, $Details = "")
    
    $script:testResults += [PSCustomObject]@{
        Test = $Test
        Expected = $Expected
        Actual = $Actual
        Passed = $Passed
        Details = $Details
    }
    
    if ($Passed) {
        Write-Host "  ✓ $Test" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $Test" -ForegroundColor Red
        if ($Details) {
            Write-Host "    Details: $Details" -ForegroundColor Yellow
        }
    }
}

# Step 1: Authenticate all users
Write-Host "Step 1: Authenticating users..." -ForegroundColor Yellow
Write-Host ""

foreach ($userType in $testUsers.Keys) {
    $user = $testUsers[$userType]
    Write-Host "  Authenticating $($user.Username)..." -NoNewline
    
    try {
        $loginUrl = "$KeycloakUrl/realms/eprescription/protocol/openid-connect/token"
        $body = @{
            grant_type = "password"
            client_id = "eprescription-api"
            username = $user.Username
            password = $user.Password
        }
        
        $response = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $body -ContentType "application/x-www-form-urlencoded"
        $tokens[$userType] = $response.access_token
        
        Write-Host " ✓" -ForegroundColor Green
        Add-TestResult -Test "Authenticate $userType" -Expected "Success" -Actual "Success" -Passed $true
    }
    catch {
        Write-Host " ✗" -ForegroundColor Red
        Add-TestResult -Test "Authenticate $userType" -Expected "Success" -Actual "Failed" -Passed $false -Details $_.Exception.Message
    }
}

Write-Host ""

# Step 2: Test GET /api/roles (should work for all authenticated users)
Write-Host "Step 2: Testing GET /api/roles (all users should access)..." -ForegroundColor Yellow
Write-Host ""

foreach ($userType in $testUsers.Keys) {
    if (-not $tokens[$userType]) { continue }
    
    try {
        $headers = @{ "Authorization" = "Bearer $($tokens[$userType])" }
        $response = Invoke-RestMethod -Uri "$ApiUrl/api/roles" -Method Get -Headers $headers
        
        Add-TestResult -Test "GET /api/roles as $userType" -Expected "200 OK" -Actual "200 OK" -Passed $true
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Add-TestResult -Test "GET /api/roles as $userType" -Expected "200 OK" -Actual "$statusCode" -Passed $false
    }
}

Write-Host ""

# Step 3: Test POST /api/roles (only admin should succeed)
Write-Host "Step 3: Testing POST /api/roles (only admin should succeed)..." -ForegroundColor Yellow
Write-Host ""

$newRole = @{
    name = "test-role-$(Get-Random)"
    description = "Test role for authorization"
} | ConvertTo-Json

foreach ($userType in @("admin", "doctor", "patient")) {
    if (-not $tokens[$userType]) { continue }
    
    try {
        $headers = @{ 
            "Authorization" = "Bearer $($tokens[$userType])"
            "Content-Type" = "application/json"
        }
        $response = Invoke-RestMethod -Uri "$ApiUrl/api/roles" -Method Post -Headers $headers -Body $newRole
        
        $shouldSucceed = ($userType -eq "admin")
        Add-TestResult -Test "POST /api/roles as $userType" -Expected $(if($shouldSucceed){"200 OK"}else{"403 Forbidden"}) -Actual "200 OK" -Passed $shouldSucceed
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $shouldFail = ($userType -ne "admin")
        $passed = ($shouldFail -and $statusCode -eq 403)
        Add-TestResult -Test "POST /api/roles as $userType" -Expected $(if($shouldFail){"403"}else{"200"}) -Actual "$statusCode" -Passed $passed
    }
}

Write-Host ""

# Step 4: Test Example Endpoints
Write-Host "Step 4: Testing authorization examples..." -ForegroundColor Yellow
Write-Host ""

# Test 4.1: Create Prescription (only doctor should succeed)
Write-Host "  4.1: POST /api/examples/create-prescription" -ForegroundColor Cyan
foreach ($userType in @("doctor", "pharmacist", "patient")) {
    if (-not $tokens[$userType]) { continue }
    
    try {
        $headers = @{ "Authorization" = "Bearer $($tokens[$userType])" }
        $response = Invoke-RestMethod -Uri "$ApiUrl/api/examples/create-prescription" -Method Post -Headers $headers
        
        $shouldSucceed = ($userType -eq "doctor")
        Add-TestResult -Test "Create prescription as $userType" -Expected $(if($shouldSucceed){"200"}else{"403"}) -Actual "200" -Passed $shouldSucceed
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $shouldFail = ($userType -ne "doctor")
        $passed = ($shouldFail -and $statusCode -eq 403)
        Add-TestResult -Test "Create prescription as $userType" -Expected $(if($shouldFail){"403"}else{"200"}) -Actual "$statusCode" -Passed $passed
    }
}

Write-Host ""

# Test 4.2: Dispense Medication (only pharmacist should succeed)
Write-Host "  4.2: POST /api/examples/dispense-medication" -ForegroundColor Cyan
foreach ($userType in @("doctor", "pharmacist", "patient")) {
    if (-not $tokens[$userType]) { continue }
    
    try {
        $headers = @{ "Authorization" = "Bearer $($tokens[$userType])" }
        $response = Invoke-RestMethod -Uri "$ApiUrl/api/examples/dispense-medication" -Method Post -Headers $headers
        
        $shouldSucceed = ($userType -eq "pharmacist")
        Add-TestResult -Test "Dispense medication as $userType" -Expected $(if($shouldSucceed){"200"}else{"403"}) -Actual "200" -Passed $shouldSucceed
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $shouldFail = ($userType -ne "pharmacist")
        $passed = ($shouldFail -and $statusCode -eq 403)
        Add-TestResult -Test "Dispense medication as $userType" -Expected $(if($shouldFail){"403"}else{"200"}) -Actual "$statusCode" -Passed $passed
    }
}

Write-Host ""

# Test 4.3: View Audit Logs (only auditor should succeed)
Write-Host "  4.3: GET /api/examples/audit-logs" -ForegroundColor Cyan
foreach ($userType in @("auditor", "doctor", "patient")) {
    if (-not $tokens[$userType]) { continue }
    
    try {
        $headers = @{ "Authorization" = "Bearer $($tokens[$userType])" }
        $response = Invoke-RestMethod -Uri "$ApiUrl/api/examples/audit-logs" -Method Get -Headers $headers
        
        $shouldSucceed = ($userType -eq "auditor")
        Add-TestResult -Test "View audit logs as $userType" -Expected $(if($shouldSucceed){"200"}else{"403"}) -Actual "200" -Passed $shouldSucceed
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $shouldFail = ($userType -ne "auditor")
        $passed = ($shouldFail -and $statusCode -eq 403)
        Add-TestResult -Test "View audit logs as $userType" -Expected $(if($shouldFail){"403"}else{"200"}) -Actual "$statusCode" -Passed $passed
    }
}

Write-Host ""

# Step 5: Test My Permissions endpoint
Write-Host "Step 5: Testing GET /api/examples/my-permissions..." -ForegroundColor Yellow
Write-Host ""

foreach ($userType in $testUsers.Keys) {
    if (-not $tokens[$userType]) { continue }
    
    try {
        $headers = @{ "Authorization" = "Bearer $($tokens[$userType])" }
        $response = Invoke-RestMethod -Uri "$ApiUrl/api/examples/my-permissions" -Method Get -Headers $headers
        
        Write-Host "  $userType permissions:" -ForegroundColor Cyan
        Write-Host "    Roles: $($response.roles -join ', ')" -ForegroundColor White
        Write-Host "    Permissions: $($response.permissions.Count) permissions" -ForegroundColor White
        
        Add-TestResult -Test "Get permissions for $userType" -Expected "Success" -Actual "Success" -Passed $true
    }
    catch {
        Add-TestResult -Test "Get permissions for $userType" -Expected "Success" -Actual "Failed" -Passed $false
    }
}

Write-Host ""

# Summary
Write-Host "=== Test Summary ===" -ForegroundColor Cyan
Write-Host ""

$totalTests = $testResults.Count
$passedTests = ($testResults | Where-Object { $_.Passed }).Count
$failedTests = $totalTests - $passedTests
$successRate = [math]::Round(($passedTests / $totalTests) * 100, 2)

Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $failedTests" -ForegroundColor $(if($failedTests -eq 0){"Green"}else{"Red"})
Write-Host "Success Rate: $successRate%" -ForegroundColor $(if($successRate -ge 80){"Green"}elseif($successRate -ge 60){"Yellow"}else{"Red"})
Write-Host ""

# Show failed tests
if ($failedTests -gt 0) {
    Write-Host "Failed Tests:" -ForegroundColor Red
    $testResults | Where-Object { -not $_.Passed } | ForEach-Object {
        Write-Host "  - $($_.Test): Expected $($_.Expected), Got $($_.Actual)" -ForegroundColor Yellow
        if ($_.Details) {
            Write-Host "    $($_.Details)" -ForegroundColor Gray
        }
    }
    Write-Host ""
}

# Export results
$testResults | Export-Csv -Path "authorization-test-results.csv" -NoTypeInformation
Write-Host "Results exported to: authorization-test-results.csv" -ForegroundColor Cyan

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
