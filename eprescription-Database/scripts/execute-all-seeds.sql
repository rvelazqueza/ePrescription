-- =====================================================
-- Script: execute-all-seeds.sql
-- Description: Master script to execute all seed data scripts in correct order
-- Follows dependency order from DATABASE-SCHEMA-REFERENCE.md
-- =====================================================

SET SERVEROUTPUT ON;
SET DEFINE OFF;

PROMPT ========================================
PROMPT EXECUTING ALL SEED DATA SCRIPTS
PROMPT Following dependency order
PROMPT ========================================

-- NIVEL 1: Tablas sin dependencias
PROMPT 
PROMPT [1/12] Executing CIE10 Catalog data...
@@02-SEED/01-cie10-catalog-data.sql

PROMPT 
PROMPT [2/12] Executing Addresses data...
@@02-SEED/02-addresses-data.sql

PROMPT 
PROMPT [3/12] Executing Specialties and Routes data...
@@02-SEED/03-specialties-routes-data.sql

-- NIVEL 2: Dependen de Nivel 1
PROMPT 
PROMPT [4/12] Executing Patients data...
@@02-SEED/04-patients-data.sql

PROMPT 
PROMPT [5/12] Executing Medical Centers and Doctors data...
@@02-SEED/05-medical-centers-doctors-data.sql

PROMPT 
PROMPT [6/12] Executing Medications data...
@@02-SEED/06-medications-data.sql

PROMPT 
PROMPT [7/12] Executing Drug Interactions data...
@@02-SEED/07-drug-interactions-data.sql

PROMPT 
PROMPT [8/12] Executing Pharmacies and Inventory data...
@@02-SEED/08-pharmacies-inventory-data.sql

-- NIVEL 3: Dependen de Nivel 2
PROMPT 
PROMPT [9/12] Executing Prescriptions data...
@@02-SEED/09-prescriptions-data.sql

PROMPT 
PROMPT [10/12] Executing Dispensations data...
@@02-SEED/10-dispensations-data.sql

-- NIVEL 4: Seguridad y Auditoría
PROMPT 
PROMPT [11/12] Executing Users, Roles and Permissions data...
@@02-SEED/11-users-roles-permissions-data.sql

PROMPT 
PROMPT [12/12] Executing Audit and AI Logs data...
@@02-SEED/12-audit-ai-logs-data.sql

PROMPT 
PROMPT ========================================
PROMPT ALL SEED DATA SCRIPTS COMPLETED!
PROMPT ========================================
PROMPT 
PROMPT Verifying data counts...

SELECT 'CIE10_CATALOG' as tabla, COUNT(*) as registros FROM CIE10_CATALOG
UNION ALL SELECT 'ADDRESSES', COUNT(*) FROM ADDRESSES
UNION ALL SELECT 'SPECIALTIES', COUNT(*) FROM SPECIALTIES
UNION ALL SELECT 'ADMINISTRATION_ROUTES', COUNT(*) FROM ADMINISTRATION_ROUTES
UNION ALL SELECT 'PATIENTS', COUNT(*) FROM PATIENTS
UNION ALL SELECT 'DOCTORS', COUNT(*) FROM DOCTORS
UNION ALL SELECT 'MEDICAL_CENTERS', COUNT(*) FROM MEDICAL_CENTERS
UNION ALL SELECT 'MEDICATIONS', COUNT(*) FROM MEDICATIONS
UNION ALL SELECT 'DRUG_INTERACTIONS', COUNT(*) FROM DRUG_INTERACTIONS
UNION ALL SELECT 'PHARMACIES', COUNT(*) FROM PHARMACIES
UNION ALL SELECT 'INVENTORY', COUNT(*) FROM INVENTORY
UNION ALL SELECT 'PRESCRIPTIONS', COUNT(*) FROM PRESCRIPTIONS
UNION ALL SELECT 'DISPENSATIONS', COUNT(*) FROM DISPENSATIONS
UNION ALL SELECT 'USERS', COUNT(*) FROM USERS
UNION ALL SELECT 'ROLES', COUNT(*) FROM ROLES
UNION ALL SELECT 'AUDIT_LOGS', COUNT(*) FROM AUDIT_LOGS
ORDER BY 1;

PROMPT 
PROMPT ========================================
PROMPT Database is ready for development!
PROMPT ========================================

EXIT;
