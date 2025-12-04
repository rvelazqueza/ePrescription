# Test Task 13.12 - Inventory API
# Script automatizado para probar todos los endpoints de Inventory

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Task 13.12 - Inventory API Tests" -ForegroundColor Cyan
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

# Get existing Pharmacy and Medication IDs from database
Write-Host "=== SETUP - Getting Test Data IDs ===" -ForegroundColor Cyan

# Get Pharmacy ID
$pharmacyHex = docker exec eprescription-oracle-db bash -c "echo 'SET PAGESIZE 0 FEEDBACK OFF VERIFY OFF HEADING OFF ECHO OFF
SELECT RAWTOHEX(PHARMACY_ID) FROM PHARMACIES WHERE ROWNUM = 1;
EXIT;' | sqlplus -S eprescription_user/EprescriptionPass123!@XEPDB1"
$pharmacyHex = $pharmacyHex.Trim()

# Convert HEX to GUID format (add hyphens)
$pharmacyId = $pharmacyHex.Insert(8, "-").Insert(13, "-").Insert(18, "-").Insert(23, "-").ToLower()
Write-Host "Pharmacy ID: $pharmacyId" -ForegroundColor Gray

# Get Medication ID
$medicationHex = docker exec eprescription-oracle-db bash -c "echo 'SET PAGESIZE 0 FEEDBACK OFF VERIFY OFF HEADING OFF ECHO OFF
SELECT RAWTOHEX(MEDICATION_ID) FROM MEDICATIONS WHERE ROWNUM = 1;
EXIT;' | sqlplus -S eprescription_user/EprescriptionPass123!@XEPDB1"
$medicationHex = $medicationHex.Trim()

# Convert HEX to GUID format
$medicationId = $medicationHex.Insert(8, "-").Insert(13, "-").Insert(18, "-").Insert(23, "-").ToLower()
Write-Host "Medication ID: $medicationId" -ForegroundColor Gray
Write-Host ""

# INVENTORY OPERATIONS
Write-Host "=== INVENTORY OPERATIONS ===" -ForegroundColor Cyan

# 1. Add Stock
$randomBatch = "BATCH-" + (Get-Random -Minimum 1000 -Maximum 9999)
$expirationDate = (Get-Date).AddMonths(12).ToString("yyyy-MM-dd")

$addStockBody = @{
    pharmacyId = $pharmacyId
    medicationId = $medicationId
    quantity = 100
    batchNumber = $randomBatch
    expirationDate = $expirationDate
    unitCost = 5.50
}

$inventoryId = Test-Endpoint `
    -Name "Add Stock to Inventory" `
    -Method "POST" `
    -Url "$baseUrl/api/inventory/add-stock" `
    -Body $addStockBody `
    -ExpectedStatus 201 `
    -Validation { param($data) 
        $data -match '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    }

if (-not $inventoryId) {
    Write-Host "Cannot proceed without inventory ID" -ForegroundColor Red
    exit 1
}

Write-Host "Created Inventory ID: $inventoryId" -ForegroundColor Green
Write-Host ""

# 2. Get Inventory by ID
$inventory = Test-Endpoint `
    -Name "Get Inventory by ID" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/$inventoryId" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data.id -and $data.pharmacyId -and $data.medicationId
    }

# 3. Adjust Stock (Increase)
$adjustIncreaseBody = @{
    inventoryId = $inventoryId
    quantityAdjustment = 50
    reason = "Restock from supplier"
}

Test-Endpoint `
    -Name "Adjust Stock - Increase" `
    -Method "PUT" `
    -Url "$baseUrl/api/inventory/adjust-stock" `
    -Body $adjustIncreaseBody `
    -ExpectedStatus 200

# 4. Adjust Stock (Decrease)
$adjustDecreaseBody = @{
    inventoryId = $inventoryId
    quantityAdjustment = -20
    reason = "Damaged items removed"
}

Test-Endpoint `
    -Name "Adjust Stock - Decrease" `
    -Method "PUT" `
    -Url "$baseUrl/api/inventory/adjust-stock" `
    -Body $adjustDecreaseBody `
    -ExpectedStatus 200

# 5. Get Pharmacy Inventory
Test-Endpoint `
    -Name "Get Pharmacy Inventory" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/pharmacy/$pharmacyId" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array]
    }

# 6. Get Pharmacy Inventory - Low Stock Only
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

# 7. Get Low Stock Alerts - All Pharmacies
Test-Endpoint `
    -Name "Get Low Stock Alerts - All Pharmacies" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/alerts/low-stock" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array]
    }

# 8. Get Low Stock Alerts - Specific Pharmacy
Test-Endpoint `
    -Name "Get Low Stock Alerts - Specific Pharmacy" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/alerts/low-stock?pharmacyId=$pharmacyId" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array]
    }

# 9. Get Expiring Stock Alerts - Default (30 days)
Test-Endpoint `
    -Name "Get Expiring Stock Alerts - 30 days" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/alerts/expiring" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array]
    }

# 10. Get Expiring Stock Alerts - Custom days
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

# 11. Search Inventory - By Pharmacy
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

# 12. Search Inventory - Low Stock Only
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

# VALIDATION TESTS
Write-Host "=== VALIDATION TESTS ===" -ForegroundColor Cyan

# 13. Add Stock - Invalid Quantity (Negative)
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

# 14. Add Stock - Invalid Expiration Date (Past)
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

# 15. Adjust Stock - Invalid Inventory ID
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

# 16. Get Non-existent Inventory
Test-Endpoint `
    -Name "Get Non-existent Inventory" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/00000000-0000-0000-0000-000000000000" `
    -ExpectedStatus 404

# 17. Get Inventory for Non-existent Pharmacy
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
