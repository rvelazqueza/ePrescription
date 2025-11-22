# Test Task 13.12 - Inventory API (FIXED VERSION)
# Script automatizado que usa IDs EXISTENTES de la base de datos

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Task 13.12 - Inventory API Tests (FIXED)" -ForegroundColor Cyan
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

# Get existing IDs from database
Write-Host "=== SETUP - Getting Existing IDs from Database ===" -ForegroundColor Cyan

# Get first Pharmacy ID
$pharmacyHex = docker exec eprescription-oracle-db bash -c "echo 'SET PAGESIZE 0 FEEDBACK OFF VERIFY OFF HEADING OFF ECHO OFF
SELECT RAWTOHEX(PHARMACY_ID) FROM PHARMACIES WHERE ROWNUM = 1;
EXIT;' | sqlplus -S eprescription_user/EprescriptionPass123!@XEPDB1" 2>$null
$pharmacyHex = $pharmacyHex.Trim()

if ([string]::IsNullOrWhiteSpace($pharmacyHex)) {
    Write-Host "ERROR: Could not get Pharmacy ID from database" -ForegroundColor Red
    exit 1
}

$pharmacyId = $pharmacyHex.Insert(8, "-").Insert(13, "-").Insert(18, "-").Insert(23, "-").ToLower()
Write-Host "Pharmacy ID: $pharmacyId" -ForegroundColor Gray

# Get first Medication ID
$medicationHex = docker exec eprescription-oracle-db bash -c "echo 'SET PAGESIZE 0 FEEDBACK OFF VERIFY OFF HEADING OFF ECHO OFF
SELECT RAWTOHEX(MEDICATION_ID) FROM MEDICATIONS WHERE ROWNUM = 1;
EXIT;' | sqlplus -S eprescription_user/EprescriptionPass123!@XEPDB1" 2>$null
$medicationHex = $medicationHex.Trim()

if ([string]::IsNullOrWhiteSpace($medicationHex)) {
    Write-Host "ERROR: Could not get Medication ID from database" -ForegroundColor Red
    exit 1
}

$medicationId = $medicationHex.Insert(8, "-").Insert(13, "-").Insert(18, "-").Insert(23, "-").ToLower()
Write-Host "Medication ID: $medicationId" -ForegroundColor Gray

# Get EXISTING Inventory ID (this is the key fix!)
$inventoryHex = docker exec eprescription-oracle-db bash -c "echo 'SET PAGESIZE 0 FEEDBACK OFF VERIFY OFF HEADING OFF ECHO OFF
SELECT RAWTOHEX(INVENTORY_ID) FROM INVENTORY WHERE ROWNUM = 1;
EXIT;' | sqlplus -S eprescription_user/EprescriptionPass123!@XEPDB1" 2>$null
$inventoryHex = $inventoryHex.Trim()

if ([string]::IsNullOrWhiteSpace($inventoryHex)) {
    Write-Host "ERROR: Could not get Inventory ID from database" -ForegroundColor Red
    Write-Host "Make sure seed data has been loaded (Task 3)" -ForegroundColor Yellow
    exit 1
}

$existingInventoryId = $inventoryHex.Insert(8, "-").Insert(13, "-").Insert(18, "-").Insert(23, "-").ToLower()
Write-Host "Existing Inventory ID: $existingInventoryId" -ForegroundColor Gray
Write-Host ""

# INVENTORY OPERATIONS
Write-Host "=== INVENTORY OPERATIONS ===" -ForegroundColor Cyan

# 1. Get Existing Inventory by ID
$inventory = Test-Endpoint `
    -Name "Get Existing Inventory by ID" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/$existingInventoryId" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data.id -and $data.pharmacyId -and $data.medicationId
    }

if (-not $inventory) {
    Write-Host "Cannot proceed without valid inventory" -ForegroundColor Red
    exit 1
}

Write-Host "Found Inventory: Pharmacy=$($inventory.pharmacyId), Medication=$($inventory.medicationId), Qty=$($inventory.quantityAvailable)" -ForegroundColor Green
Write-Host ""

# 2. Adjust Stock (Increase)
$adjustIncreaseBody = @{
    inventoryId = $existingInventoryId
    quantityAdjustment = 50
    reason = "Restock from supplier - Test"
}

Test-Endpoint `
    -Name "Adjust Stock - Increase" `
    -Method "PUT" `
    -Url "$baseUrl/api/inventory/adjust-stock" `
    -Body $adjustIncreaseBody `
    -ExpectedStatus 200

# 3. Adjust Stock (Decrease)
$adjustDecreaseBody = @{
    inventoryId = $existingInventoryId
    quantityAdjustment = -20
    reason = "Damaged items removed - Test"
}

Test-Endpoint `
    -Name "Adjust Stock - Decrease" `
    -Method "PUT" `
    -Url "$baseUrl/api/inventory/adjust-stock" `
    -Body $adjustDecreaseBody `
    -ExpectedStatus 200

# 4. Get Pharmacy Inventory
Test-Endpoint `
    -Name "Get Pharmacy Inventory" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/pharmacy/$pharmacyId" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array]
    }

# 5. Get Pharmacy Inventory - Low Stock Only
Test-Endpoint `
    -Name "Get Pharmacy Inventory - Low Stock Only" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/pharmacy/$pharmacyId`?lowStockOnly=true" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array]
    }

# ALERTS
Write-Host "=== INVENTORY ALERTS ===" -ForegroundColor Cyan

# 6. Get Low Stock Alerts - All Pharmacies
Test-Endpoint `
    -Name "Get Low Stock Alerts - All Pharmacies" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/alerts/low-stock" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array]
    }

# 7. Get Low Stock Alerts - Specific Pharmacy
Test-Endpoint `
    -Name "Get Low Stock Alerts - Specific Pharmacy" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/alerts/low-stock?pharmacyId=$pharmacyId" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array]
    }

# 8. Get Expiring Stock Alerts - Default (30 days)
Test-Endpoint `
    -Name "Get Expiring Stock Alerts - 30 days" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/alerts/expiring" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array]
    }

# 9. Get Expiring Stock Alerts - Custom days
Test-Endpoint `
    -Name "Get Expiring Stock Alerts - 7 days" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/alerts/expiring?daysUntilExpiration=7" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array]
    }

# SEARCH
Write-Host "=== INVENTORY SEARCH ===" -ForegroundColor Cyan

# 10. Search Inventory - By Pharmacy
$searchBody = @{
    pharmacyId = $pharmacyId
    isLowStock = $false
}

Test-Endpoint `
    -Name "Search Inventory - By Pharmacy" `
    -Method "POST" `
    -Url "$baseUrl/api/inventory/search" `
    -Body $searchBody `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array]
    }

# 11. Search Inventory - Low Stock Only
$searchLowStockBody = @{
    pharmacyId = $pharmacyId
    isLowStock = $true
}

Test-Endpoint `
    -Name "Search Inventory - Low Stock Only" `
    -Method "POST" `
    -Url "$baseUrl/api/inventory/search" `
    -Body $searchLowStockBody `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array]
    }

# ADD NEW STOCK (This should work now)
Write-Host "=== ADD NEW STOCK ===" -ForegroundColor Cyan

$randomBatch = "TEST-BATCH-" + (Get-Random -Minimum 1000 -Maximum 9999)
$expirationDate = (Get-Date).AddMonths(12).ToString("yyyy-MM-dd")

$addStockBody = @{
    pharmacyId = $pharmacyId
    medicationId = $medicationId
    quantity = 100
    batchNumber = $randomBatch
    expirationDate = $expirationDate
    unitCost = 5.50
}

$newInventoryId = Test-Endpoint `
    -Name "Add New Stock to Inventory" `
    -Method "POST" `
    -Url "$baseUrl/api/inventory/add-stock" `
    -Body $addStockBody `
    -ExpectedStatus 201 `
    -Validation { param($data) 
        $data -match '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    }

if ($newInventoryId) {
    Write-Host "Created New Inventory ID: $newInventoryId" -ForegroundColor Green
    Write-Host ""
}

# VALIDATION TESTS
Write-Host "=== VALIDATION TESTS ===" -ForegroundColor Cyan

# 12. Add Stock - Invalid Quantity (Negative)
$invalidQuantityBody = @{
    pharmacyId = $pharmacyId
    medicationId = $medicationId
    quantity = -10
    batchNumber = "INVALID-BATCH"
    expirationDate = $expirationDate
    unitCost = 5.50
}

Test-Endpoint `
    -Name "Validation - Negative Quantity" `
    -Method "POST" `
    -Url "$baseUrl/api/inventory/add-stock" `
    -Body $invalidQuantityBody `
    -ExpectedStatus 400

# 13. Add Stock - Invalid Expiration Date (Past)
$pastDate = (Get-Date).AddMonths(-6).ToString("yyyy-MM-dd")
$invalidExpirationBody = @{
    pharmacyId = $pharmacyId
    medicationId = $medicationId
    quantity = 50
    batchNumber = "BATCH-EXPIRED"
    expirationDate = $pastDate
    unitCost = 5.50
}

Test-Endpoint `
    -Name "Validation - Past Expiration Date" `
    -Method "POST" `
    -Url "$baseUrl/api/inventory/add-stock" `
    -Body $invalidExpirationBody `
    -ExpectedStatus 400

# 14. Adjust Stock - Invalid Inventory ID
$invalidAdjustBody = @{
    inventoryId = "00000000-0000-0000-0000-000000000000"
    quantityAdjustment = 10
    reason = "Test adjustment"
}

Test-Endpoint `
    -Name "Validation - Invalid Inventory ID" `
    -Method "PUT" `
    -Url "$baseUrl/api/inventory/adjust-stock" `
    -Body $invalidAdjustBody `
    -ExpectedStatus 404

# ERROR HANDLING
Write-Host "=== ERROR HANDLING ===" -ForegroundColor Cyan

# 15. Get Non-existent Inventory
Test-Endpoint `
    -Name "Get Non-existent Inventory" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/00000000-0000-0000-0000-000000000000" `
    -ExpectedStatus 404

# 16. Get Inventory for Non-existent Pharmacy
Test-Endpoint `
    -Name "Get Inventory for Non-existent Pharmacy" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/pharmacy/00000000-0000-0000-0000-000000000000" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array] -and $data.Count -eq 0
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
    Write-Host "Inventory API is working correctly!" -ForegroundColor Green
    Write-Host "- Stock management: OK" -ForegroundColor Green
    Write-Host "- Alerts system: OK" -ForegroundColor Green
    Write-Host "- Search functionality: OK" -ForegroundColor Green
    Write-Host "- Validation: OK" -ForegroundColor Green
    Write-Host "- Error handling: OK" -ForegroundColor Green
    Write-Host ""
    Write-Host "Task 13.12 can now be marked as COMPLETED!" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "SOME TESTS FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check the errors above and:" -ForegroundColor Yellow
    Write-Host "1. Verify Docker is running: docker ps" -ForegroundColor Yellow
    Write-Host "2. Check API logs: docker logs eprescription-api" -ForegroundColor Yellow
    Write-Host "3. Verify database has seed data from Tasks 2 and 3" -ForegroundColor Yellow
    exit 1
}
