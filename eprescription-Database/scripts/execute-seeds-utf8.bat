@echo off
REM =====================================================
REM Script: execute-seeds-utf8.bat
REM Description: Execute all seed scripts with proper UTF-8 encoding
REM =====================================================

echo ========================================
echo Executing Seed Scripts with UTF-8
echo ========================================

REM Set UTF-8 encoding for Oracle
set NLS_LANG=SPANISH_COSTA RICA.AL32UTF8

REM Execute each script in order
echo.
echo [1/5] Executing CIE10 Catalog...
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus -S EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 @/docker-entrypoint-initdb.d/startup/02-SEED/01-cie10-catalog-data.sql"

echo.
echo [2/5] Executing Addresses...
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus -S EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 @/docker-entrypoint-initdb.d/startup/02-SEED/02-addresses-data.sql"

echo.
echo [3/5] Executing Specialties and Routes...
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus -S EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 @/docker-entrypoint-initdb.d/startup/02-SEED/03-specialties-routes-data.sql"

echo.
echo [4/5] Executing Patients...
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus -S EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 @/docker-entrypoint-initdb.d/startup/02-SEED/04-patients-data.sql"

echo.
echo [5/6] Executing Medical Centers and Doctors...
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus -S EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 @/docker-entrypoint-initdb.d/startup/02-SEED/05-medical-centers-doctors-data.sql"

echo.
echo [6/6] Executing Medications...
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus -S EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 @/docker-entrypoint-initdb.d/startup/02-SEED/06-medications-data.sql"

echo.
echo ========================================
echo All seed scripts executed!
echo ========================================
echo.
echo Verifying data...
docker exec eprescription-oracle-db bash -c "export NLS_LANG='SPANISH_COSTA RICA.AL32UTF8' && sqlplus -S EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 <<EOF
SELECT 'Total records:' as info FROM DUAL;
SELECT 'CIE10_CATALOG' as tabla, COUNT(*) as registros FROM CIE10_CATALOG
UNION ALL SELECT 'ADDRESSES', COUNT(*) FROM ADDRESSES
UNION ALL SELECT 'SPECIALTIES', COUNT(*) FROM SPECIALTIES
UNION ALL SELECT 'PATIENTS', COUNT(*) FROM PATIENTS
UNION ALL SELECT 'DOCTORS', COUNT(*) FROM DOCTORS
UNION ALL SELECT 'MEDICATIONS', COUNT(*) FROM MEDICATIONS
ORDER BY 1;
EXIT;
EOF"

pause
