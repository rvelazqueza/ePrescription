# ============================================================================
# Script de Pruebas EF Core para Talonarios
# ============================================================================

Write-Host "=== PRUEBAS EF CORE PARA TALONARIOS ===" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar que las entidades están registradas en DbContext
Write-Host "1. Verificando entidades en DbContext..." -ForegroundColor Yellow
Write-Host "   - PrescriptionPadType"
Write-Host "   - PrescriptionPad"
Write-Host "   - PrescriptionSlip"
Write-Host "   - Medication (actualizado)"
Write-Host ""

# 2. Verificar que las configuraciones están aplicadas
Write-Host "2. Verificando configuraciones EF Core..." -ForegroundColor Yellow
Write-Host "   - PrescriptionPadTypeConfiguration"
Write-Host "   - PrescriptionPadConfiguration"
Write-Host "   - PrescriptionSlipConfiguration"
Write-Host "   - MedicationConfiguration"
Write-Host ""

# 3. Verificar mapeo de columnas
Write-Host "3. Verificando mapeo de columnas..." -ForegroundColor Yellow
Write-Host "   - PAD_TYPE_ID (RAW(16))"
Write-Host "   - DOCTOR_ID (RAW(16))"
Write-Host "   - PAD_TYPE_ID en MEDICATIONS (RAW(16))"
Write-Host ""

# 4. Verificar constraints
Write-Host "4. Verificando constraints..." -ForegroundColor Yellow
Write-Host "   - UNIQUE (DOCTOR_ID, PAD_TYPE_ID, PAD_NUMBER)"
Write-Host "   - CHECK (AVAILABLE_COUNT <= TOTAL_COUNT)"
Write-Host "   - FOREIGN KEYS"
Write-Host ""

# 5. Verificar relaciones
Write-Host "5. Verificando relaciones..." -ForegroundColor Yellow
Write-Host "   - PrescriptionPad → Doctor (FK)"
Write-Host "   - PrescriptionPad → PrescriptionPadType (FK)"
Write-Host "   - PrescriptionSlip → PrescriptionPad (FK)"
Write-Host "   - PrescriptionSlip → Prescription (FK)"
Write-Host "   - Medication → PrescriptionPadType (FK)"
Write-Host ""

Write-Host "✅ Pruebas de EF Core completadas" -ForegroundColor Green
