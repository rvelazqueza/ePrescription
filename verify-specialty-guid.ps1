# Verificar el formato exacto del GUID en la base de datos
Write-Host "Verificando formato de GUID en la base de datos..." -ForegroundColor Cyan

$query = @"
SET LINESIZE 300
SET PAGESIZE 100
COL GUID_FORMAT1 FORMAT A40
COL GUID_FORMAT2 FORMAT A40
COL SPECIALTY_NAME FORMAT A30

SELECT 
    RAWTOHEX(SPECIALTY_ID) as GUID_FORMAT1,
    LOWER(
        SUBSTR(RAWTOHEX(SPECIALTY_ID), 1, 8) || '-' ||
        SUBSTR(RAWTOHEX(SPECIALTY_ID), 9, 4) || '-' ||
        SUBSTR(RAWTOHEX(SPECIALTY_ID), 13, 4) || '-' ||
        SUBSTR(RAWTOHEX(SPECIALTY_ID), 17, 4) || '-' ||
        SUBSTR(RAWTOHEX(SPECIALTY_ID), 21, 12)
    ) as GUID_FORMAT2,
    SPECIALTY_NAME
FROM SPECIALTIES
WHERE SPECIALTY_NAME = 'Medicina General';
EXIT;
"@

$query | Out-File -FilePath "temp-verify.sql" -Encoding ASCII
docker cp temp-verify.sql eprescription-oracle-db:/tmp/verify.sql
docker exec eprescription-oracle-db bash -c "sqlplus -S eprescription_user/EprescriptionPass123!@//localhost:1521/XEPDB1 @/tmp/verify.sql"
Remove-Item temp-verify.sql -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "El GUID_FORMAT2 es el formato correcto para usar en el API" -ForegroundColor Green
