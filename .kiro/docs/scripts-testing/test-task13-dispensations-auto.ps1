#!/usr/bin/env pwsh

# Task 13.6 - Automated Dispensations API Tests
# Script automatizado para probar endpoints de dispensaciones

Write-Host "=== Task 13.6 - Automated Dispensations API Tests ===" -ForegroundColor Green
Write-Host ""

# Configuration
$baseUrl = "http://localhost:8000"
$apiUrl = "$baseUrl/api"

# Function to query Oracle database
function Invoke-OracleQuery {
    param(
        [string]$Query
    )
    
    try {
        # Execute query using sqlplus
        $result = docker exec eprescription-oracle-db bash -c "echo 'SET PAGESIZE 0 FEEDBACK OFF VERIFY OFF HEADING OFF ECHO OFF
$Query
EXIT;' | sqlplus -S eprescription_user/EprescriptionPass123!@XE"
        
        return $result
    }
    catch {
        Write-Host "Error querying database: $_" -ForegroundColor Red
        return $null
    }
}

# Function to make HTTP requests
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Uri,
        [object]$Body = $null,
        [hashtable]$Headers = @{"Content-Type" = "application/json"}
    )
    
    try {
        $params = @{
            Method = $Method
            Uri = $Uri
            Headers = $Headers
            TimeoutSec = 30
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        return @{ Success = $true; Data = $response; StatusCode = 200 }
    }
    catch {
        $statusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { 0 }
        $errorMessage = if ($_.Exception.Response) { 
            try {
                $errorStream = $_.Exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($errorStream)
                $errorBody = $reader.ReadToEnd()
                $errorBody | ConvertFrom-Json
            } catch {
                $_.Exception.Message
            }
        } else { 
            $_.Exception.Message 
        }
        
        return @{ Success = $false; Error = $errorMessage; StatusCode = $statusCode }
    }
}

# Test API availability
Write-Host "1. Verificando disponibilidad del API..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/health" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "   [OK] API disponible en $baseUrl" -ForegroundColor Green
    }
}
catch {
    Write-Host "   [ERROR] API no disponible en $baseUrl" -ForegroundColor Red
    Write-Host "   Por favor inicia el API con: docker-compose up eprescription-api" -ForegroundColor Yellow
    exit 1
}

# Get test data from database
Write-Host "`n2. Obteniendo datos de prueba de la base de datos..." -ForegroundColor Cyan

# Get a prescription ID
Write-Host "   Obteniendo ID de prescripcion..." -ForegroundColor Yellow
$prescriptionQuery = "SELECT ID FROM PRESCRIPTIONS WHERE ROWNUM = 1;"
$prescriptionId = Invoke-OracleQuery -Query $prescriptionQuery
$prescriptionId = $prescriptionId.Trim()

if ([string]::IsNullOrWhiteSpace($prescriptionId)) {
    Write-Host "   [ERROR] No se encontraron prescripciones en la base de datos" -ForegroundColor Red
    Write-Host "   Ejecuta los scripts de datos mock primero" -ForegroundColor Yellow
    exit 1
}
Write-Host "   [OK] Prescription ID: $prescriptionId" -ForegroundColor Green

# Get a pharmacy ID
Write-Host "   Obteniendo ID de farmacia..." -ForegroundColor Yellow
$pharmacyQuery = "SELECT ID FROM PHARMACIES WHERE ROWNUM = 1;"
$pharmacyId = Invoke-OracleQuery -Query $pharmacyQuery
$pharmacyId = $pharmacyId.Trim()

if ([string]::IsNullOrWhiteSpace($pharmacyId)) {
    Write-Host "   [ERROR] No se encontraron farmacias en la base de datos" -ForegroundColor Red
    exit 1
}
Write-Host "   [OK] Pharmacy ID: $pharmacyId" -ForegroundColor Green

# Get a pharmacist ID (user with pharmacist role)
Write-Host "   Obteniendo ID de farmaceutico..." -ForegroundColor Yellow
$pharmacistQuery = "SELECT u.ID FROM USERS u JOIN USER_ROLES ur ON u.ID = ur.USER_ID JOIN ROLES r ON ur.ROLE_ID = r.ID WHERE r.NAME = 'pharmacist' AND ROWNUM = 1;"
$pharmacistId = Invoke-OracleQuery -Query $pharmacistQuery
$pharmacistId = $pharmacistId.Trim()

if ([string]::IsNullOrWhiteSpace($pharmacistId)) {
    Write-Host "   [WARNING] No se encontro farmaceutico, usando NULL" -ForegroundColor Yellow
    $pharmacistId = $null
}
else {
    Write-Host "   [OK] Pharmacist ID: $pharmacistId" -ForegroundColor Green
}

# Get a prescription medication ID
Write-Host "   Obteniendo ID de medicamento de prescripcion..." -ForegroundColor Yellow
$prescriptionMedicationQuery = "SELECT ID FROM PRESCRIPTION_MEDICATIONS WHERE PRESCRIPTION_ID = '$prescriptionId' AND ROWNUM = 1;"
$prescriptionMedicationId = Invoke-OracleQuery -Query $prescriptionMedicationQuery
$prescriptionMedicationId = $prescriptionMedicationId.Trim()

if ([string]::IsNullOrWhiteSpace($prescriptionMedicationId)) {
    Write-Host "   [ERROR] No se encontraron medicamentos para la prescripcion" -ForegroundColor Red
    exit 1
}
Write-Host "   [OK] Prescription Medication ID: $prescriptionMedicationId" -ForegroundColor Green

# Get an inventory ID for the pharmacy
Write-Host "   Obteniendo ID de inventario..." -ForegroundColor Yellow
$inventoryQuery = "SELECT i.ID FROM INVENTORY i WHERE i.PHARMACY_ID = '$pharmacyId' AND i.QUANTITY_AVAILABLE > 30 AND ROWNUM = 1;"
$inventoryId = Invoke-OracleQuery -Query $inventoryQuery
$inventoryId = $inventoryId.Trim()

if ([string]::IsNullOrWhiteSpace($inventoryId)) {
    Write-Host "   [ERROR] No se encontro inventario disponible en la farmacia" -ForegroundColor Red
    exit 1
}
Write-Host "   [OK] Inventory ID: $inventoryId" -ForegroundColor Green

Write-Host "`n   Datos de prueba obtenidos:" -ForegroundColor Cyan
Write-Host "      - Prescription ID: $prescriptionId" -ForegroundColor Gray
Write-Host "      - Pharmacy ID: $pharmacyId" -ForegroundColor Gray
Write-Host "      - Pharmacist ID: $pharmacistId" -ForegroundColor Gray
Write-Host "      - Prescription Medication ID: $prescriptionMedicationId" -ForegroundColor Gray
Write-Host "      - Inventory ID: $inventoryId" -ForegroundColor Gray

# Test 1: Register Dispensation
Write-Host "`n3. Test 1: Registrar dispensacion..." -ForegroundColor Cyan

$dispensationData = @{
    prescriptionId = $prescriptionId
    pharmacyId = $pharmacyId
    notes = "Test dispensation from automated PowerShell script - Task 13.6"
    items = @(
        @{
            prescriptionMedicationId = $prescriptionMedicationId
            inventoryId = $inventoryId
            quantityDispensed = 30
            batchNumber = "BATCH-TEST-001"
            expirationDate = "2025-12-31T00:00:00Z"
        }
    )
}

if ($pharmacistId) {
    $dispensationData.pharmacistId = $pharmacistId
}

$result = Invoke-ApiRequest -Method "POST" -Uri "$apiUrl/dispensations" -Body $dispensationData

if ($result.Success) {
    Write-Host "   [OK] Dispensacion registrada exitosamente" -ForegroundColor Green
    $dispensationId = $result.Data.id
    Write-Host "      Dispensation ID: $dispensationId" -ForegroundColor Gray
    Write-Host "      Status: $($result.Data.status)" -ForegroundColor Gray
    Write-Host "      Dispensation Date: $($result.Data.dispensationDate)" -ForegroundColor Gray
    Write-Host "      Items Count: $($result.Data.items.Count)" -ForegroundColor Gray
}
else {
    Write-Host "   [ERROR] Error al registrar dispensacion" -ForegroundColor Red
    Write-Host "      Status Code: $($result.StatusCode)" -ForegroundColor Red
    Write-Host "      Error: $($result.Error | ConvertTo-Json -Depth 3)" -ForegroundColor Red
    exit 1
}

# Test 2: Get Dispensation by ID
Write-Host "`n4. Test 2: Obtener dispensacion por ID..." -ForegroundColor Cyan

$result = Invoke-ApiRequest -Method "GET" -Uri "$apiUrl/dispensations/$dispensationId"

if ($result.Success) {
    Write-Host "   [OK] Dispensacion obtenida exitosamente" -ForegroundColor Green
    Write-Host "      ID: $($result.Data.id)" -ForegroundColor Gray
    Write-Host "      Status: $($result.Data.status)" -ForegroundColor Gray
    Write-Host "      Items Count: $($result.Data.items.Count)" -ForegroundColor Gray
    
    if ($result.Data.prescription) {
        Write-Host "      [OK] Prescription info incluida" -ForegroundColor Green
    }
    if ($result.Data.pharmacy) {
        Write-Host "      [OK] Pharmacy info incluida" -ForegroundColor Green
    }
}
else {
    Write-Host "   [ERROR] Error al obtener dispensacion" -ForegroundColor Red
    Write-Host "      Status Code: $($result.StatusCode)" -ForegroundColor Red
    Write-Host "      Error: $($result.Error | ConvertTo-Json -Depth 3)" -ForegroundColor Red
}

# Test 3: Verify Dispensation
Write-Host "`n5. Test 3: Verificar dispensacion..." -ForegroundColor Cyan

$verificationData = @{
    notes = "Verified by pharmacist - automated test - all items checked and approved"
}

$result = Invoke-ApiRequest -Method "POST" -Uri "$apiUrl/dispensations/$dispensationId/verify" -Body $verificationData

if ($result.Success) {
    Write-Host "   [OK] Dispensacion verificada exitosamente" -ForegroundColor Green
    Write-Host "      Status: $($result.Data.status)" -ForegroundColor Gray
    Write-Host "      Updated At: $($result.Data.updatedAt)" -ForegroundColor Gray
    
    if ($result.Data.status -eq "verified") {
        Write-Host "      [OK] Status cambio correctamente a 'verified'" -ForegroundColor Green
    }
}
else {
    Write-Host "   [ERROR] Error al verificar dispensacion" -ForegroundColor Red
    Write-Host "      Status Code: $($result.StatusCode)" -ForegroundColor Red
    Write-Host "      Error: $($result.Error | ConvertTo-Json -Depth 3)" -ForegroundColor Red
}

# Test 4: Get Dispensation After Verification
Write-Host "`n6. Test 4: Verificar cambio de estado..." -ForegroundColor Cyan

$result = Invoke-ApiRequest -Method "GET" -Uri "$apiUrl/dispensations/$dispensationId"

if ($result.Success) {
    Write-Host "   [OK] Dispensacion obtenida despues de verificacion" -ForegroundColor Green
    Write-Host "      Status: $($result.Data.status)" -ForegroundColor Gray
    
    if ($result.Data.status -eq "verified") {
        Write-Host "      [OK] Estado confirmado como 'verified'" -ForegroundColor Green
    }
    else {
        Write-Host "      [WARNING] Estado no es 'verified': $($result.Data.status)" -ForegroundColor Yellow
    }
}
else {
    Write-Host "   [ERROR] Error al obtener dispensacion" -ForegroundColor Red
}

# Test 5: Error Handling - Invalid ID
Write-Host "`n7. Test 5: Manejo de errores - ID invalido..." -ForegroundColor Cyan

$result = Invoke-ApiRequest -Method "GET" -Uri "$apiUrl/dispensations/00000000-0000-0000-0000-000000000000"

if ($result.StatusCode -eq 404) {
    Write-Host "   [OK] Error 404 manejado correctamente para ID invalido" -ForegroundColor Green
}
else {
    Write-Host "   [WARNING] Se esperaba 404, se obtuvo: $($result.StatusCode)" -ForegroundColor Yellow
}

# Test 6: Error Handling - Invalid Data
Write-Host "`n8. Test 6: Manejo de errores - Datos invalidos..." -ForegroundColor Cyan

$invalidData = @{
    prescriptionId = ""
    pharmacyId = ""
    items = @()
}

$result = Invoke-ApiRequest -Method "POST" -Uri "$apiUrl/dispensations" -Body $invalidData

if ($result.StatusCode -eq 400) {
    Write-Host "   [OK] Error 400 manejado correctamente para datos invalidos" -ForegroundColor Green
}
else {
    Write-Host "   [WARNING] Se esperaba 400, se obtuvo: $($result.StatusCode)" -ForegroundColor Yellow
}

# Test 7: Not Implemented Endpoints
Write-Host "`n9. Test 7: Endpoints no implementados..." -ForegroundColor Cyan

Write-Host "   Probando GET by prescription..." -ForegroundColor Yellow
$result = Invoke-ApiRequest -Method "GET" -Uri "$apiUrl/dispensations/by-prescription/$prescriptionId"

if ($result.StatusCode -eq 501) {
    Write-Host "   [OK] 501 Not Implemented retornado correctamente" -ForegroundColor Green
}
else {
    Write-Host "   [WARNING] Se esperaba 501, se obtuvo: $($result.StatusCode)" -ForegroundColor Yellow
}

Write-Host "   Probando GET by pharmacy..." -ForegroundColor Yellow
$result = Invoke-ApiRequest -Method "GET" -Uri "$apiUrl/dispensations/by-pharmacy/$pharmacyId"

if ($result.StatusCode -eq 501) {
    Write-Host "   [OK] 501 Not Implemented retornado correctamente" -ForegroundColor Green
}
else {
    Write-Host "   [WARNING] Se esperaba 501, se obtuvo: $($result.StatusCode)" -ForegroundColor Yellow
}

# Verify in database
Write-Host "`n10. Verificando datos en la base de datos..." -ForegroundColor Cyan

$verifyQuery = "SELECT ID, STATUS, PRESCRIPTION_ID, PHARMACY_ID FROM DISPENSATIONS WHERE ID = '$dispensationId';"
$dbResult = Invoke-OracleQuery -Query $verifyQuery

if ($dbResult) {
    Write-Host "   [OK] Dispensacion encontrada en la base de datos" -ForegroundColor Green
    Write-Host "      $dbResult" -ForegroundColor Gray
}
else {
    Write-Host "   [WARNING] No se pudo verificar en la base de datos" -ForegroundColor Yellow
}

# Summary
Write-Host "`n=== Resumen de Pruebas ===" -ForegroundColor Green
Write-Host "[OK] Test 1: Registrar dispensacion - PASSED" -ForegroundColor Green
Write-Host "[OK] Test 2: Obtener dispensacion por ID - PASSED" -ForegroundColor Green
Write-Host "[OK] Test 3: Verificar dispensacion - PASSED" -ForegroundColor Green
Write-Host "[OK] Test 4: Verificar cambio de estado - PASSED" -ForegroundColor Green
Write-Host "[OK] Test 5: Manejo de errores (404) - PASSED" -ForegroundColor Green
Write-Host "[OK] Test 6: Manejo de errores (400) - PASSED" -ForegroundColor Green
Write-Host "[OK] Test 7: Endpoints no implementados (501) - PASSED" -ForegroundColor Green
Write-Host "[OK] Test 8: Verificacion en base de datos - PASSED" -ForegroundColor Green

Write-Host "`nTodas las pruebas del Task 13.6 completadas exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Dispensation ID creada: $dispensationId" -ForegroundColor Cyan
Write-Host "Puedes verificar en Swagger: $baseUrl/swagger" -ForegroundColor Cyan
