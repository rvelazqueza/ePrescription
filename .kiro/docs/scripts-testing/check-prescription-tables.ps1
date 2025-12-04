# Script para verificar estructura de tablas de prescripciones

Write-Host "=== Verificando Estructura de Tablas ===" -ForegroundColor Cyan
Write-Host ""

$sqlScript = @"
SET PAGESIZE 100
SET LINESIZE 200
SET FEEDBACK OFF

PROMPT === Columnas de PRESCRIPTIONS ===
SELECT COLUMN_NAME, DATA_TYPE, NULLABLE 
FROM USER_TAB_COLUMNS 
WHERE TABLE_NAME = 'PRESCRIPTIONS'
ORDER BY COLUMN_ID;

PROMPT
PROMPT === Columnas de PRESCRIPTION_MEDICATIONS ===
SELECT COLUMN_NAME, DATA_TYPE, NULLABLE 
FROM USER_TAB_COLUMNS 
WHERE TABLE_NAME = 'PRESCRIPTION_MEDICATIONS'
ORDER BY COLUMN_ID;

PROMPT
PROMPT === Columnas de PRESCRIPTION_DIAGNOSES ===
SELECT COLUMN_NAME, DATA_TYPE, NULLABLE 
FROM USER_TAB_COLUMNS 
WHERE TABLE_NAME = 'PRESCRIPTION_DIAGNOSES'
ORDER BY COLUMN_ID;

EXIT;
"@

$sqlScript | Out-File -FilePath "temp_check_tables.sql" -Encoding ASCII

docker cp temp_check_tables.sql eprescription-oracle-db:/tmp/check_tables.sql
docker exec eprescription-oracle-db bash -c "sqlplus -s eprescription_user/EprescriptionPass123!@//localhost:1521/XEPDB1 < /tmp/check_tables.sql"

Remove-Item "temp_check_tables.sql" -ErrorAction SilentlyContinue

Write-Host ""
