# Script para obtener Specialty IDs de la base de datos Oracle
Write-Host "Obteniendo Specialty IDs de la base de datos..." -ForegroundColor Cyan

# Ejecutar consulta SQL en el contenedor
$query = @"
SET LINESIZE 200
SET PAGESIZE 100
COL ID FORMAT A40
COL SPECIALTY_NAME FORMAT A30
SELECT RAWTOHEX(SPECIALTY_ID) as ID, SPECIALTY_NAME 
FROM SPECIALTIES 
WHERE ROWNUM <= 5
ORDER BY SPECIALTY_NAME;
EXIT;
"@

# Guardar query en archivo temporal
$query | Out-File -FilePath "temp-query.sql" -Encoding ASCII

# Ejecutar en el contenedor
Write-Host "Ejecutando consulta..." -ForegroundColor Yellow
docker cp temp-query.sql eprescription-oracle-db:/tmp/query.sql
docker exec eprescription-oracle-db bash -c "sqlplus -S eprescription_user/EprescriptionPass123!@//localhost:1521/XEPDB1 @/tmp/query.sql"

# Limpiar
Remove-Item temp-query.sql -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Copia uno de los IDs de arriba y actualiza el script test-task12-doctors.ps1" -ForegroundColor Green
