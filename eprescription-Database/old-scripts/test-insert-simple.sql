-- Test simple de INSERT
-- Probar que podemos insertar datos en las tablas principales

-- 1. Insert en ADDRESSES
INSERT INTO ADDRESSES (COUNTRY, PROVINCE, CANTON, CITY) 
VALUES ('Ecuador', 'Pichincha', 'Quito', 'Quito');

-- 2. Insert en SPECIALTIES
INSERT INTO SPECIALTIES (SPECIALTY_CODE, SPECIALTY_NAME) 
VALUES ('MG', 'Medicina General');

-- 3. Insert en ADMINISTRATION_ROUTES
INSERT INTO ADMINISTRATION_ROUTES (ROUTE_CODE, ROUTE_NAME) 
VALUES ('ORAL', 'Vía Oral');

-- 4. Insert en CIE10_CATALOG
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, CATEGORY, CHAPTER) 
VALUES ('J00', 'Rinofaringitis aguda (resfriado común)', 'Infecciones respiratorias agudas', 'Enfermedades del sistema respiratorio');

-- 5. Insert en PHARMACIES
INSERT INTO PHARMACIES (PHARMACY_NAME, LICENSE_NUMBER, CITY) 
VALUES ('Farmacia Test', 'TEST-001', 'Quito');

COMMIT;

-- Verificar
SELECT COUNT(*) as addresses_count FROM ADDRESSES;
SELECT COUNT(*) as specialties_count FROM SPECIALTIES;
SELECT COUNT(*) as routes_count FROM ADMINISTRATION_ROUTES;
SELECT COUNT(*) as cie10_count FROM CIE10_CATALOG;
SELECT COUNT(*) as pharmacies_count FROM PHARMACIES;
