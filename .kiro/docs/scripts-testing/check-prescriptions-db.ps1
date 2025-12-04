# Script para verificar prescripciones en la base de datos Oracle

Write-Host "=== Verificando Prescripciones en Oracle ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Ejecutando queries..." -ForegroundColor Yellow
Write-Host ""

# Crear archivo SQL temporal
$sqlScript = @"
SET PAGESIZE 50
SET LINESIZE 200
SET FEEDBACK OFF
SET HEADING ON

PROMPT === Total de Prescripciones ===
SELECT COUNT(*) as "Total" FROM PRESCRIPTIONS;

PROMPT
PROMPT === Distribucion por Estado ===
SELECT STATUS, COUNT(*) as "Count" FROM PRESCRIPTIONS GROUP BY STATUS;

PROMPT
PROMPT === Muestra de Datos (primeras 5) ===
SELECT ID, PRESCRIPTION_NUMBER, STATUS FROM PRESCRIPTIONS WHERE ROWNUM <= 5;

EXIT;
"@

# Guardar en archivo temporal
$sqlScript | Out-File -FilePath "temp_check.sql" -Encoding ASCII

# Copiar al contenedor y ejecutar
docker cp temp_check.sql eprescription-oracle-db:/tmp/check.sql
docker exec eprescription-oracle-db bash -c "sqlplus -s eprescription_user/EprescriptionPass123!@//localhost:1521/XEPDB1 < /tmp/check.sql"

# Limpiar
Remove-Item "temp_check.sql" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=== Instrucciones ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para verificar manualmente:" -ForegroundColor Yellow
Write-Host "  docker exec -it eprescription-oracle-db sqlplus eprescription_user/EprescriptionPass123!@//localhost:1521/XEPDB1" -ForegroundColor White
Write-Host "  SELECT * FROM PRESCRIPTIONS WHERE ROWNUM <= 10;" -ForegroundColor White
Write-Host ""
