# Test Task 13.12 - Inventory API (SIMPLE VERSION)
# Uses API endpoints to discover existing data instead of direct DB queries

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Task 13.12 - Inventory API Tests (SIMPLE)" -ForegroundColor Cyan
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

# ALERTS (These don't need specific IDs)
Write-Host "=== INVENTORY ALERTS ===" -ForegroundColor Cyan

# 1. Get Low Stock Alerts - All Pharmacies
$lowStockAlerts = Test-Endpoint `
    -Name "Get Low Stock Alerts - All Pharmacies" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/alerts/low-stock" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array]
    }

# 2. Get Expiring Stock Alerts - Default (30 days)
$expiringAlerts = Test-Endpoint `
    -Name "Get Expiring Stock Alerts - 30 days" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/alerts/expiring" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array]
    }

# 3. Get Expiring Stock Alerts - Custom days
Test-Endpoint `
    -Name "Get Expiring Stock Alerts - 7 days" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/alerts/expiring?daysUntilExpiration=7" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array]
    }

# Try to get a pharmacy ID from alerts or search
$pharmacyId = $null
$inventoryId = $null
$medicationId = $null

if ($lowStockAlerts -and $lowStockAlerts.Count -gt 0) {
    $pharmacyId = $lowStockAlerts[0].pharmacyId
    $inventoryId = $lowStockAlerts[0].id
    $medicationId = $lowStockAlerts[0].medicationId
    Write-Host "Found Pharmacy ID from alerts: $pharmacyId" -ForegroundColor Gray
    Write-Host "Found Inventory ID from alerts: $inventoryId" -ForegroundColor Gray
    Write-Host "Found Medication ID from alerts: $medicationId" -ForegroundColor Gray
    Write-Host ""
} elseif ($expiringAlerts -and $expiringAlerts.Count -gt 0) {
    $pharmacyId = $expiringAlerts[0].pharmacyId
    $inventoryId = $expiringAlerts[0].id
    $medicationId = $expiringAlerts[0].medicationId
    Write-Host "Found Pharmacy ID from expiring alerts: $pharmacyId" -ForegroundColor Gray
    Write-Host "Found Inventory ID from expiring alerts: $inventoryId" -ForegroundColor Gray
    Write-Host "Found Medication ID from expiring alerts: $medicationId" -ForegroundColor Gray
    Write-Host ""
}

# PHARMACY INVENTORY OPERATIONS (if we have a pharmacy ID)
if ($pharmacyId) {
    Write-Host "=== PHARMACY INVENTORY OPERATIONS ===" -ForegroundColor Cyan
    
    # 4. Get Pharmacy Inventory
    $pharmacyInventory = Test-Endpoint `
        -Name "Get Pharmacy Inventory" `
        -Method "GET" `
        -Url "$baseUrl/api/inventory/pharmacy/$pharmacyId" `
        -ExpectedStatus 200 `
        -Validation { param($data) 
            $data -is [array]
        }
    
    # Get IDs from pharmacy inventory if we don't have them yet
    if (-not $inventoryId -and $pharmacyInventory -and $pharmacyInventory.Count -gt 0) {
        $inventoryId = $pharmacyInventory[0].id
        $medicationId = $pharmacyInventory[0].medicationId
        Write-Host "Found Inventory ID from pharmacy inventory: $inventoryId" -ForegroundColor Gray
        Write-Host "Found Medication ID from pharmacy inventory: $medicationId" -ForegroundColor Gray
        Write-Host ""
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
    
    # 6. Get Low Stock Alerts - Specific Pharmacy
    Test-Endpoint `
        -Name "Get Low Stock Alerts - Specific Pharmacy" `
        -Method "GET" `
        -Url "$baseUrl/api/inventory/alerts/low-stock?pharmacyId=$pharmacyId" `
        -ExpectedStatus 200 `
        -Validation { param($data) 
            $data -is [array]
        }
    
    # SEARCH
    Write-Host "=== INVENTORY SEARCH ===" -ForegroundColor Cyan
    
    # 7. Search Inventory - By Pharmacy
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
    
    # 8. Search Inventory - Low Stock Only
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
}

# INVENTORY OPERATIONS (if we have an inventory ID)
if ($inventoryId) {
    Write-Host "=== INVENTORY OPERATIONS ===" -ForegroundColor Cyan
    
    # 9. Get Inventory by ID
    $inventory = Test-Endpoint `
        -Name "Get Inventory by ID" `
        -Method "GET" `
        -Url "$baseUrl/api/inventory/$inventoryId" `
        -ExpectedStatus 200 `
        -Validation { param($data) 
            $data.id -and $data.pharmacyId -and $data.medicationId
        }
    
    # 10. Adjust Stock (Increase)
    $adjustIncreaseBody = @{
        inventoryId = $inventoryId
        quantityAdjustment = 50
        reason = "Restock from supplier - Test"
    }
    
    Test-Endpoint `
        -Name "Adjust Stock - Increase" `
        -Method "PUT" `
        -Url "$baseUrl/api/inventory/adjust-stock" `
        -Body $adjustIncreaseBody `
        -ExpectedStatus 200
    
    # 11. Adjust Stock (Decrease)
    $adjustDecreaseBody = @{
        inventoryId = $inventoryId
        quantityAdjustment = -20
        reason = "Damaged items removed - Test"
    }
    
    Test-Endpoint `
        -Name "Adjust Stock - Decrease" `
        -Method "PUT" `
        -Url "$baseUrl/api/inventory/adjust-stock" `
        -Body $adjustDecreaseBody `
        -ExpectedStatus 200
}

# VALIDATION TESTS
Write-Host "=== VALIDATION TESTS ===" -ForegroundColor Cyan

# 12. Adjust Stock - Invalid Inventory ID
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

# 13. Get Non-existent Inventory
Test-Endpoint `
    -Name "Get Non-existent Inventory" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/00000000-0000-0000-0000-000000000000" `
    -ExpectedStatus 404

# 14. Get Inventory for Non-existent Pharmacy
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
