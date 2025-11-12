@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Ejecutando scripts de base de datos
echo ========================================
echo.

set ORACLE_USER=EPRESCRIPTION_USER
set ORACLE_PASS=EprescriptionPass123!
set ORACLE_CONN=localhost:1521/XEPDB1

echo Conectando a Oracle como %ORACLE_USER%...
echo.

REM Crear tablas faltantes
echo [1/15] Creando tablas faltantes...
docker exec -i eprescription-oracle-db sqlplus -S %ORACLE_USER%/%ORACLE_PASS%@//%ORACLE_CONN% < fix-complete-database.sql
if errorlevel 1 (
    echo ERROR: No se pudieron crear las tablas
    pause
    exit /b 1
)

REM Ejecutar scripts de datos
echo [2/15] Insertando datos CIE-10...
docker exec -i eprescription-oracle-db sqlplus -S %ORACLE_USER%/%ORACLE_PASS%@//%ORACLE_CONN% < eprescription-Database\scripts\02-SEED\01-cie10-catalog-data.sql

echo [3/15] Insertando direcciones...
docker exec -i eprescription-oracle-db sqlplus -S %ORACLE_USER%/%ORACLE_PASS%@//%ORACLE_CONN% < eprescription-Database\scripts\02-SEED\02-addresses-data.sql

echo [4/15] Insertando especialidades y rutas...
docker exec -i eprescription-oracle-db sqlplus -S %ORACLE_USER%/%ORACLE_PASS%@//%ORACLE_CONN% < eprescription-Database\scripts\02-SEED\03-specialties-routes-data.sql

echo [5/15] Insertando pacientes...
docker exec -i eprescription-oracle-db sqlplus -S %ORACLE_USER%/%ORACLE_PASS%@//%ORACLE_CONN% < eprescription-Database\scripts\02-SEED\04-patients-data.sql

echo [6/15] Insertando centros medicos y doctores...
docker exec -i eprescription-oracle-db sqlplus -S %ORACLE_USER%/%ORACLE_PASS%@//%ORACLE_CONN% < eprescription-Database\scripts\02-SEED\05-medical-centers-doctors-data.sql

echo [7/15] Insertando medicamentos...
docker exec -i eprescription-oracle-db sqlplus -S %ORACLE_USER%/%ORACLE_PASS%@//%ORACLE_CONN% < eprescription-Database\scripts\02-SEED\06-medications-data.sql

echo [8/15] Insertando interacciones medicamentosas...
docker exec -i eprescription-oracle-db sqlplus -S %ORACLE_USER%/%ORACLE_PASS%@//%ORACLE_CONN% < eprescription-Database\scripts\02-SEED\07-drug-interactions-data.sql

echo [9/15] Insertando farmacias e inventario...
docker exec -i eprescription-oracle-db sqlplus -S %ORACLE_USER%/%ORACLE_PASS%@//%ORACLE_CONN% < eprescription-Database\scripts\02-SEED\08-pharmacies-inventory-data.sql

echo [10/15] Insertando prescripciones parte 1...
docker exec -i eprescription-oracle-db sqlplus -S %ORACLE_USER%/%ORACLE_PASS%@//%ORACLE_CONN% < eprescription-Database\scripts\02-SEED\09-prescriptions-data.sql

echo [11/15] Insertando prescripciones parte 2...
docker exec -i eprescription-oracle-db sqlplus -S %ORACLE_USER%/%ORACLE_PASS%@//%ORACLE_CONN% < eprescription-Database\scripts\02-SEED\09-prescriptions-data-part2.sql

echo [12/15] Insertando prescripciones parte 3...
docker exec -i eprescription-oracle-db sqlplus -S %ORACLE_USER%/%ORACLE_PASS%@//%ORACLE_CONN% < eprescription-Database\scripts\02-SEED\09-prescriptions-data-part3.sql

echo [13/15] Insertando dispensaciones...
docker exec -i eprescription-oracle-db sqlplus -S %ORACLE_USER%/%ORACLE_PASS%@//%ORACLE_CONN% < eprescription-Database\scripts\02-SEED\10-dispensations-data.sql

echo [14/15] Insertando usuarios, roles y permisos...
docker exec -i eprescription-oracle-db sqlplus -S %ORACLE_USER%/%ORACLE_PASS%@//%ORACLE_CONN% < eprescription-Database\scripts\02-SEED\11-users-roles-permissions-data.sql

echo [15/15] Insertando logs de auditoria...
docker exec -i eprescription-oracle-db sqlplus -S %ORACLE_USER%/%ORACLE_PASS%@//%ORACLE_CONN% < eprescription-Database\scripts\02-SEED\12-audit-ai-logs-data.sql

echo.
echo ========================================
echo Proceso completado
echo ========================================
echo.
echo Verificando datos insertados...
docker exec -i eprescription-oracle-db sqlplus -S %ORACLE_USER%/%ORACLE_PASS%@//%ORACLE_CONN% << EOF
SELECT 'Pharmacies: ' || COUNT(*) FROM pharmacies;
SELECT 'Inventory: ' || COUNT(*) FROM inventory;
SELECT 'Patients: ' || COUNT(*) FROM patients;
SELECT 'CIE10: ' || COUNT(*) FROM cie10_catalog;
EXIT;
EOF

pause
