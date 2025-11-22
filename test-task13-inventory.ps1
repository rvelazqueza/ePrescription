# Test Script for Task 13.7-13.11: Inventory Management API
# Tests all inventory endpoints with authentication

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Task 13.7-13.11: Inventory API Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"
$username = "pharmacist"
$password = "pharmacist123"

# Test counters
$totalTests = 0
$passedTests = 0
$failedTests = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [object]$Body = $null,
        [hashtable]$Headers = @{},
        [int]$ExpectedStatus = 200
    )
    
    $global:totalTests++
    Write-Host "Test $global:totalTests : $Name" -ForegroundColor Yellow
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-WebRequest @params -UseBasicParsing
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "  ✓ PASSED - Status: $($response.StatusCode)" -ForegroundColor Green
            $global:passedTests++
            
            if ($response.Content) {
                $content = $response.Content | ConvertFrom-Json
                return $content
            }
            return $true
        } else {
            Write-Host "  ✗ FAILED - Expected: $ExpectedStatus, Got: $($response.StatusCode)" -ForegroundColor Red
            $global:failedTests++
            return $false
        }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq $ExpectedStatus) {
            Write-Host "  ✓ PASSED - Status: $statusCode (Expected error)" -ForegroundColor Green
            $global:passedTests++
            return $true
        } else {
            Write-Host "  ✗ FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "  Status Code: $statusCode" -ForegroundColor Red
            $global:failedTests++
            return $false
        }
    }
}

# Step 1: Login
Write-Host "`n=== Step 1: Authentication ===" -ForegroundColor Cyan
$loginBody = @{
    username = $username
    password = $password
}

$loginResult = Test-Endpoint `
    -Name "Login as pharmacist" `
    -Method "POST" `
    -Url "$baseUrl/api/auth/login" `
    -Body $loginBody `
    -ExpectedStatus 200

if (-not $loginResult) {
    Write-Host "`n❌ Authentication failed. Cannot continue tests." -ForegroundColor Red
    exit 1
}

$token = $loginResult.accessToken
$authHeaders = @{
    "Authorization" = "Bearer $token"
}

Write-Host "  Token obtained: $($token.Substring(0, 20))..." -ForegroundColor Gray

# Step 2: Get test data IDs
Write-Host "`n=== Step 2: Get Test Data ===" -ForegroundColor Cyan

# Get a pharmacy
$pharmacies = Test-Endpoint `
    -Name "Get pharmacies list" `
    -Method "GET" `
    -Url "$baseUrl/api/pharmacies?pageSize=1" `
    -Headers $authHeaders

$pharmacyId = $pharmacies[0].id
Write-Host "  Using Pharmacy ID: $pharmacyId" -ForegroundColor Gray

# Get a medication
$medications = Invoke-RestMethod -Uri "$baseUrl/api/medications?pageSize=1" -Headers $authHeaders -Method GET
$medicationId = $medications[0].id
Write-Host "  Using Medication ID: $medicationId" -ForegroundColor Gray

# Step 3: Test Add Stock
Write-Host "`n=== Step 3: Add Stock ===" -ForegroundColor Cyan

$addStockBody = @{
    pharmacyId = $pharmacyId
    medicationId = $medicationId
    batchNumber = "LOT-$(Get-Date -Format 'yyyyMMdd')-001"
    quantity = 100
    expirationDate = (Get-Date).AddYears(2).ToString("yyyy-MM-ddTHH:mm:ss")
    unitCost = 15.50
}

$inventoryId = Test-Endpoint `
    -Name "Add stock to inventory" `
    -Method "POST" `
    -Url "$baseUrl/api/inventory/add-stock" `
    -Body $addStockBody `
    -Headers $authHeaders `
    -ExpectedStatus 201

Write-Host "  Created Inventory ID: $inventoryId" -ForegroundColor Gray

# Step 4: Get Inventory by ID
Write-Host "`n=== Step 4: Get Inventory ===" -ForegroundColor Cyan

$inventory = Test-Endpoint `
    -Name "Get inventory by ID" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/$inventoryId" `
    -Headers $authHeaders

if ($inventory) {
    Write-Host "  Batch: $($inventory.batchNumber)" -ForegroundColor Gray
    Write-Host "  Quantity: $($inventory.quantityAvailable)" -ForegroundColor Gray
    Write-Host "  Expiration: $($inventory.expirationDate)" -ForegroundColor Gray
}

# Step 5: Adjust Stock (Increase)
Write-Host "`n=== Step 5: Adjust Stock (Increase) ===" -ForegroundColor Cyan

$adjustStockBody = @{
    inventoryId = $inventoryId
    quantityAdjustment = 50
    reason = "Restock from supplier"
}

Test-Endpoint `
    -Name "Increase stock by 50 units" `
    -Method "PUT" `
    -Url "$baseUrl/api/inventory/adjust-stock" `
    -Body $adjustStockBody `
    -Headers $authHeaders

# Step 6: Adjust Stock (Decrease)
Write-Host "`n=== Step 6: Adjust Stock (Decrease) ===" -ForegroundColor Cyan

$adjustStockBody = @{
    inventoryId = $inventoryId
    quantityAdjustment = -20
    reason = "Damaged items removed"
}

Test-Endpoint `
    -Name "Decrease stock by 20 units" `
    -Method "PUT" `
    -Url "$baseUrl/api/inventory/adjust-stock" `
    -Body $adjustStockBody `
    -Headers $authHeaders

# Step 7: Get Pharmacy Inventory
Write-Host "`n=== Step 7: Get Pharmacy Inventory ===" -ForegroundColor Cyan

$pharmacyInventory = Test-Endpoint `
    -Name "Get all inventory for pharmacy" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/pharmacy/$pharmacyId" `
    -Headers $authHeaders

Write-Host "  Total items in pharmacy: $($pharmacyInventory.Count)" -ForegroundColor Gray

# Step 8: Get Low Stock Items
Write-Host "`n=== Step 8: Get Low Stock Items ===" -ForegroundColor Cyan

$lowStockInventory = Test-Endpoint `
    -Name "Get low stock items for pharmacy" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/pharmacy/$pharmacyId`?lowStockOnly=true" `
    -Headers $authHeaders

Write-Host "  Low stock items: $($lowStockInventory.Count)" -ForegroundColor Gray

# Step 9: Get Low Stock Alerts
Write-Host "`n=== Step 9: Get Low Stock Alerts ===" -ForegroundColor Cyan

$lowStockAlerts = Test-Endpoint `
    -Name "Get low stock alerts" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/alerts/low-stock?pharmacyId=$pharmacyId" `
    -Headers $authHeaders

if ($lowStockAlerts) {
    Write-Host "  Total alerts: $($lowStockAlerts.Count)" -ForegroundColor Gray
    foreach ($alert in $lowStockAlerts | Select-Object -First 3) {
        Write-Host "    - $($alert.medicationName): $($alert.currentQuantity) units ($($alert.alertLevel))" -ForegroundColor Gray
    }
}

# Step 10: Get Expiring Stock Alerts
Write-Host "`n=== Step 10: Get Expiring Stock Alerts ===" -ForegroundColor Cyan

$expiringAlerts = Test-Endpoint `
    -Name "Get expiring stock alerts (30 days)" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/alerts/expiring?pharmacyId=$pharmacyId&daysUntilExpiration=30" `
    -Headers $authHeaders

if ($expiringAlerts) {
    Write-Host "  Total expiring items: $($expiringAlerts.Count)" -ForegroundColor Gray
    foreach ($alert in $expiringAlerts | Select-Object -First 3) {
        Write-Host "    - $($alert.medicationName): Expires in $($alert.daysUntilExpiration) days ($($alert.alertLevel))" -ForegroundColor Gray
    }
}

# Step 11: Search Inventory
Write-Host "`n=== Step 11: Search Inventory ===" -ForegroundColor Cyan

$searchBody = @{
    pharmacyId = $pharmacyId
    isLowStock = $false
    pageNumber = 1
    pageSize = 10
}

$searchResults = Test-Endpoint `
    -Name "Search inventory with filters" `
    -Method "POST" `
    -Url "$baseUrl/api/inventory/search" `
    -Body $searchBody `
    -Headers $authHeaders

Write-Host "  Search results: $($searchResults.Count)" -ForegroundColor Gray

# Step 12: Test Validation - Invalid Batch Number
Write-Host "`n=== Step 12: Validation Tests ===" -ForegroundColor Cyan

$invalidBatchBody = @{
    pharmacyId = $pharmacyId
    medicationId = $medicationId
    batchNumber = "invalid batch!"  # Contains invalid characters
    quantity = 50
    expirationDate = (Get-Date).AddYears(1).ToString("yyyy-MM-ddTHH:mm:ss")
}

Test-Endpoint `
    -Name "Add stock with invalid batch number (should fail)" `
    -Method "POST" `
    -Url "$baseUrl/api/inventory/add-stock" `
    -Body $invalidBatchBody `
    -Headers $authHeaders `
    -ExpectedStatus 400

# Step 13: Test Validation - Expired Date
$expiredDateBody = @{
    pharmacyId = $pharmacyId
    medicationId = $medicationId
    batchNumber = "LOT-EXPIRED-001"
    quantity = 50
    expirationDate = (Get-Date).AddDays(-10).ToString("yyyy-MM-ddTHH:mm:ss")  # Past date
}

Test-Endpoint `
    -Name "Add stock with past expiration date (should fail)" `
    -Method "POST" `
    -Url "$baseUrl/api/inventory/add-stock" `
    -Body $expiredDateBody `
    -Headers $authHeaders `
    -ExpectedStatus 400

# Step 14: Test Validation - Negative Adjustment
$negativeAdjustBody = @{
    inventoryId = $inventoryId
    quantityAdjustment = -10000  # More than available
    reason = "Test negative adjustment"
}

Test-Endpoint `
    -Name "Adjust stock to negative (should fail)" `
    -Method "PUT" `
    -Url "$baseUrl/api/inventory/adjust-stock" `
    -Body $negativeAdjustBody `
    -Headers $authHeaders `
    -ExpectedStatus 400

# Final Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $failedTests" -ForegroundColor Red
Write-Host ""

if ($failedTests -eq 0) {
    Write-Host "✓ All tests passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Inventory API is working correctly!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "✗ Some tests failed" -ForegroundColor Red
    exit 1
}
