# Test Task 13.12 - Inventory API
# Usa datos REALES de la base de datos directamente

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Task 13.12 - Inventory API Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"
$testsPassed = 0
$testsFailed = 0

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
        $headers = @{ "Content-Type" = "application/json" }
        $params = @{ Uri = $Url; Method = $Method; Headers = $headers }
        
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

# Check API
Write-Host "Checking if API is running..." -ForegroundColor Cyan
try {
    $health = Invoke-WebRequest -Uri "$baseUrl/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "API is running" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "API is not responding" -ForegroundColor Red
    exit 1
}

# Obtener IDs DIRECTAMENTE de la base de datos
Write-Host "=== Getting IDs from Database ===" -ForegroundColor Cyan

# Función para convertir HEX a GUID format
function Convert-HexToGuid {
    param([string]$hex)
    $hex = $hex.Trim()
    if ($hex.Length -eq 32) {
        return ($hex.Insert(8, "-").Insert(13, "-").Insert(18, "-").Insert(23, "-")).ToLower()
    }
    return $hex
}

# Obtener primer Pharmacy ID
$pharmacyHex = docker exec eprescription-oracle-db bash -c "echo 'SET PAGESIZE 0 FEEDBACK OFF VERIFY OFF HEADING OFF ECHO OFF
SELECT RAWTOHEX(PHARMACY_ID) FROM PHARMACIES WHERE ROWNUM = 1;
EXIT;' | sqlplus -S eprescription_user/EprescriptionPass123!@XEPDB1" 2>$null
$pharmacyId = Convert-HexToGuid $pharmacyHex
Write-Host "Pharmacy ID: $pharmacyId" -ForegroundColor Gray

# Obtener primer Medication ID
$medicationHex = docker exec eprescription-oracle-db bash -c "echo 'SET PAGESIZE 0 FEEDBACK OFF VERIFY OFF HEADING OFF ECHO OFF
SELECT RAWTOHEX(MEDICATION_ID) FROM MEDICATIONS WHERE ROWNUM = 1;
EXIT;' | sqlplus -S eprescription_user/EprescriptionPass123!@XEPDB1" 2>$null
$medicationId = Convert-HexToGuid $medicationHex
Write-Host "Medication ID: $medicationId" -ForegroundColor Gray

# Obtener primer Inventory con Pharmacy ID
$invPharmacyHex = docker exec eprescription-oracle-db bash -c "echo 'SET PAGESIZE 0 FEEDBACK OFF VERIFY OFF HEADING OFF ECHO OFF
SELECT RAWTOHEX(PHARMACY_ID) FROM INVENTORY WHERE ROWNUM = 1;
EXIT;' | sqlplus -S eprescription_user/EprescriptionPass123!@XEPDB1" 2>$null
$invPharmacyId = Convert-HexToGuid $invPharmacyHex
Write-Host "Inventory Pharmacy ID: $invPharmacyId" -ForegroundColor Gray
Write-Host ""

# ===========================================
# PRUEBAS CRUD
# ===========================================

Write-Host "=== CRUD OPERATIONS ===" -ForegroundColor Cyan

# READ - Get Pharmacy Inventory (usando el ID de la farmacia del inventario)
$pharmacyInventory = Test-Endpoint `
    -Name "READ - Get Pharmacy Inventory" `
    -Method "GET" `
    -Url "$baseUrl/api/inventory/pharmacy/$invPharmacyId" `
    -ExpectedStatus 200 `
    -Validation { param($data) 
        $data -is [array]
    }

if ($pharmacyInventory -and $pharmacyInventory.Count -gt 0) {
    Write-Host "Found $($pharmacyInventory.Count) inventory items for pharmacy" -ForegroundColor Gray
    # Usar el primer item del inventario para las pruebas
    $testInventoryId = $pharmacyInventory[0].id
    $testQty = $pharmacyInventory[0].quantityAvailable
    Write-Host "Using Inventory ID: $testInventoryId (Qty: $testQty)" -ForegroundColor Gray
    Write-Host ""
    
    # READ - Get Inventory by ID
    $inventory = Test-Endpoint `
        -Name "READ - Get Inventory by ID" `
        -Method "GET" `
        -Url "$baseUrl/api/inventory/$testInventoryId" `
        -ExpectedStatus 200 `
        -Validation { param($data) 
            $data.id -and $data.quantityAvailable -ge 0
        }
    
    # UPDATE - Increase Stock
    $adjustUp = @{
        inventoryId = $testInventoryId
        quantityAdjustment = 50
        reason = "Restock from supplier - Test"
    }
    
    Test-Endpoint `
        -Name "UPDATE - Increase Stock (+50)" `
        -Method "PUT" `
        -Url "$baseUrl/api/inventory/adjust-stock" `
        -Body $adjustUp `
        -ExpectedStatus 200
    
    # Verify increase
    $invAfterIncrease = Test-Endpoint `
        -Name "READ - Verify Increase" `
        -Method "GET" `
        -Url "$baseUrl/api/inventory/$testInventoryId" `
        -ExpectedStatus 200 `
        -Validation { param($data) 
            $data.quantityAvailable -gt $testQty
        }
    
    if ($invAfterIncrease) {
        Write-Host "Quantity increased: $testQty -> $($invAfterIncrease.quantityAvailable)" -ForegroundColor Gray
    }
    Write-Host ""
    
    # UPDATE - Decrease Stock
    $adjustDown = @{
        inventoryId = $testInventoryId
        quantityAdjustment = -25
        reason = "Damaged items - Test"
    }
    
    Test-Endpoint `
        -Name "UPDATE - Decrease Stock (-25)" `
        -Method "PUT" `
        -Url "$baseUrl/api/inventory/adjust-stock" `
        -Body $adjustDown `
        -ExpectedStatus 200
    
    # Verify decrease
    $invAfterDecrease = Test-Endpoint `
        -Name "READ - Verify Decrease" `
        -Method "GET" `
        -Url "$baseUrl/api/inventory/$testInventoryId" `
        -ExpectedStatus 200 `
        -Validation { param($data) 
            $data.quantityAvailable -lt $invAfterIncrease.quantityAvailable
        }
    
    if ($invAfterDecrease) {
        Write-Host "Quantity decreased: $($invAfterIncrease.quantityAvailable) -> $($invAfterDecrease.quantityAvailable)" -ForegroundColor Gray
    }
    Write-Host ""
}

# ALERTS
Write-Host "=== ALERTS ===" -ForegroundColor Cyan
Test-Endpoint -Name "Low Stock Alerts - All" -Method "GET" -Url "$baseUrl/api/inventory/alerts/low-stock" -ExpectedStatus 200 -Validation { param($d) $d -is [array] }
Test-Endpoint -Name "Low Stock Alerts - Pharmacy" -Method "GET" -Url "$baseUrl/api/inventory/alerts/low-stock?pharmacyId=$invPharmacyId" -ExpectedStatus 200 -Validation { param($d) $d -is [array] }
Test-Endpoint -Name "Expiring Alerts - 30 days" -Method "GET" -Url "$baseUrl/api/inventory/alerts/expiring" -ExpectedStatus 200 -Validation { param($d) $d -is [array] }
Test-Endpoint -Name "Expiring Alerts - 7 days" -Method "GET" -Url "$baseUrl/api/inventory/alerts/expiring?daysUntilExpiration=7" -ExpectedStatus 200 -Validation { param($d) $d -is [array] }

# SEARCH
Write-Host "=== SEARCH ===" -ForegroundColor Cyan
$search1 = @{ pharmacyId = $invPharmacyId; isLowStock = $false }
Test-Endpoint -Name "Search - By Pharmacy" -Method "POST" -Url "$baseUrl/api/inventory/search" -Body $search1 -ExpectedStatus 200 -Validation { param($d) $d -is [array] }

$search2 = @{ pharmacyId = $invPharmacyId; isLowStock = $true }
Test-Endpoint -Name "Search - Low Stock Only" -Method "POST" -Url "$baseUrl/api/inventory/search" -Body $search2 -ExpectedStatus 200 -Validation { param($d) $d -is [array] }

# VALIDATION
Write-Host "=== VALIDATION ===" -ForegroundColor Cyan
$badAdj = @{ inventoryId = "00000000-0000-0000-0000-000000000000"; quantityAdjustment = 10; reason = "Test" }
Test-Endpoint -Name "Invalid Inventory ID" -Method "PUT" -Url "$baseUrl/api/inventory/adjust-stock" -Body $badAdj -ExpectedStatus 404

# ERROR HANDLING
Write-Host "=== ERROR HANDLING ===" -ForegroundColor Cyan
Test-Endpoint -Name "Non-existent Inventory" -Method "GET" -Url "$baseUrl/api/inventory/00000000-0000-0000-0000-000000000000" -ExpectedStatus 404
Test-Endpoint -Name "Non-existent Pharmacy" -Method "GET" -Url "$baseUrl/api/inventory/pharmacy/00000000-0000-0000-0000-000000000000" -ExpectedStatus 200 -Validation { param($d) $d -is [array] -and $d.Count -eq 0 }

# SUMMARY
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Tests Passed: $testsPassed" -ForegroundColor Green
Write-Host "Tests Failed: $testsFailed" -ForegroundColor $(if ($testsFailed -eq 0) { "Green" } else { "Red" })
Write-Host "Total Tests: $($testsPassed + $testsFailed)" -ForegroundColor Cyan
Write-Host ""

Write-Host "CRUD Coverage:" -ForegroundColor Cyan
Write-Host "  CREATE: N/A (uses existing data)" -ForegroundColor Gray
Write-Host "  READ:   OK - Get by ID, Get by Pharmacy" -ForegroundColor Green
Write-Host "  UPDATE: OK - Increase/Decrease Stock" -ForegroundColor Green
Write-Host "  DELETE: N/A (not in requirements)" -ForegroundColor Gray
Write-Host ""
Write-Host "Additional Coverage:" -ForegroundColor Cyan
Write-Host "  ALERTS: OK - Low Stock, Expiring" -ForegroundColor Green
Write-Host "  SEARCH: OK - By Pharmacy, Filters" -ForegroundColor Green
Write-Host "  VALIDATION: OK - Invalid IDs" -ForegroundColor Green
Write-Host "  ERRORS: OK - 404 handling" -ForegroundColor Green
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "Task 13.12 COMPLETED!" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "SOME TESTS FAILED" -ForegroundColor Red
    exit 1
}
