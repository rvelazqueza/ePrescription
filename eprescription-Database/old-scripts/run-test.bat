@echo off
echo ========================================
echo Ejecutando test de INSERT
echo ========================================
echo.

docker exec -i eprescription-oracle-db sqlplus -S EPRESCRIPTION_USER/EprescriptionPass123!@//localhost:1521/XEPDB1 << EOF
SET SERVEROUTPUT ON
SET FEEDBACK ON
SET ECHO ON

-- Test simple de INSERT
PROMPT Insertando datos de prueba...

-- 1. Insert en ADDRESSES
INSERT INTO ADDRESSES (COUNTRY, PROVINCE, CANTON, CITY) 
VALUES ('Ecuador', 'Pichincha', 'Quito', 'Quito');

-- 2. Insert en SPECIALTIES
INSERT INTO SPECIALTIES (SPECIALTY_CODE, SPECIALTY_NAME) 
VALUES ('MG', 'Medicina General');

-- 3. Insert en ADMINISTRATION_ROUTES
INSERT INTO ADMINISTRATION_ROUTES (ROUTE_CODE, ROUTE_NAME) 
VALUES ('ORAL', 'Via Oral');

-- 4. Insert en CIE10_CATALOG
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, CATEGORY, CHAPTER) 
VALUES ('J00', 'Rinofaringitis aguda (resfriado comun)', 'Infecciones respiratorias agudas', 'Enfermedades del sistema respiratorio');

-- 5. Insert en PHARMACIES
INSERT INTO PHARMACIES (PHARMACY_NAME, LICENSE_NUMBER, CITY) 
VALUES ('Farmacia Test', 'TEST-001', 'Quito');

COMMIT;

PROMPT 
PROMPT Verificando datos insertados...
SELECT 'ADDRESSES: ' || COUNT(*) as result FROM ADDRESSES;
SELECT 'SPECIALTIES: ' || COUNT(*) as result FROM SPECIALTIES;
SELECT 'ROUTES: ' || COUNT(*) as result FROM ADMINISTRATION_ROUTES;
SELECT 'CIE10: ' || COUNT(*) as result FROM CIE10_CATALOG;
SELECT 'PHARMACIES: ' || COUNT(*) as result FROM PHARMACIES;

EXIT;
EOF

echo.
echo ========================================
echo Test completado
echo ========================================
pause
