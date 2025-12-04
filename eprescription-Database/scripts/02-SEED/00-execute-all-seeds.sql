-- =====================================================
-- Script: 00-execute-all-seeds.sql
-- Description: Master script to execute all seed data scripts in order
-- Executes all 12 seed scripts sequentially
-- =====================================================

SET SERVEROUTPUT ON;
SET DEFINE OFF;

PROMPT ========================================
PROMPT EPRESCRIPTION DATABASE - SEED DATA
PROMPT Master Script - Executing All Seeds
PROMPT ========================================
PROMPT 
PROMPT This will populate the database with:
PROMPT - 50 CIE-10 diagnoses
PROMPT - 50 addresses (Costa Rica)
PROMPT - 20 medical specialties
PROMPT - 50 patients
PROMPT - 10 medical centers + 30 doctors
PROMPT - 35 medications (ATC codes)
PROMPT - 30 drug interactions
PROMPT - 10 pharmacies with inventory
PROMPT - 50 prescriptions
PROMPT - 5 dispensations
PROMPT - Users, roles and permissions
PROMPT - Audit and AI logs (compliance)
PROMPT 
PROMPT ========================================
PROMPT Starting seed data execution...
PROMPT ========================================

PROMPT 
PROMPT [1/12] Loading CIE-10 Catalog...
@@01-cie10-catalog-data.sql

PROMPT 
PROMPT [2/12] Loading Addresses...
@@02-addresses-data.sql

PROMPT 
PROMPT [3/12] Loading Specialties and Routes...
@@03-specialties-routes-data.sql

PROMPT 
PROMPT [4/12] Loading Patients...
@@04-patients-data.sql

PROMPT 
PROMPT [5/12] Loading Medical Centers and Doctors...
@@05-medical-centers-doctors-data.sql

PROMPT 
PROMPT [6/12] Loading Medications...
@@06-medications-data.sql

PROMPT 
PROMPT [7/12] Loading Drug Interactions...
@@07-drug-interactions-data.sql

PROMPT 
PROMPT [8/12] Loading Pharmacies and Inventory...
@@08-pharmacies-inventory-data.sql

PROMPT 
PROMPT [9/12] Loading Prescriptions...
@@09-prescriptions-data.sql

PROMPT 
PROMPT [10/12] Loading Dispensations...
@@10-dispensations-data.sql

PROMPT 
PROMPT [11/12] Loading Users, Roles and Permissions...
@@11-users-roles-permissions-data.sql

PROMPT 
PROMPT [12/12] Loading Audit and AI Logs...
@@12-audit-ai-logs-data.sql

PROMPT 
PROMPT ========================================
PROMPT SEED DATA EXECUTION COMPLETED!
PROMPT ========================================
PROMPT 
PROMPT Database is now populated with sample data
PROMPT Ready for development and testing
PROMPT 
PROMPT ========================================

-- Final verification
PROMPT 
PROMPT Final Data Summary:
PROMPT ========================================

SELECT 'CIE-10 Diagnoses' as TABLE_NAME, COUNT(*) as RECORD_COUNT FROM CIE10_CATALOG
UNION ALL
SELECT 'Addresses', COUNT(*) FROM ADDRESSES
UNION ALL
SELECT 'Specialties', COUNT(*) FROM SPECIALTIES
UNION ALL
SELECT 'Administration Routes', COUNT(*) FROM ADMINISTRATION_ROUTES
UNION ALL
SELECT 'Patients', COUNT(*) FROM PATIENTS
UNION ALL
SELECT 'Medical Centers', COUNT(*) FROM MEDICAL_CENTERS
UNION ALL
SELECT 'Doctors', COUNT(*) FROM DOCTORS
UNION ALL
SELECT 'Medications', COUNT(*) FROM MEDICATIONS
UNION ALL
SELECT 'Drug Interactions', COUNT(*) FROM DRUG_INTERACTIONS
UNION ALL
SELECT 'Pharmacies', COUNT(*) FROM PHARMACIES
UNION ALL
SELECT 'Inventory Items', COUNT(*) FROM INVENTORY
UNION ALL
SELECT 'Prescriptions', COUNT(*) FROM PRESCRIPTIONS
UNION ALL
SELECT 'Prescription Medications', COUNT(*) FROM PRESCRIPTION_MEDICATIONS
UNION ALL
SELECT 'Dispensations', COUNT(*) FROM DISPENSATIONS
UNION ALL
SELECT 'Dispensation Items', COUNT(*) FROM DISPENSATION_ITEMS
UNION ALL
SELECT 'Users', COUNT(*) FROM USERS
UNION ALL
SELECT 'Roles', COUNT(*) FROM ROLES
UNION ALL
SELECT 'Permissions', COUNT(*) FROM PERMISSIONS
UNION ALL
SELECT 'Audit Logs', COUNT(*) FROM AUDIT_LOGS
UNION ALL
SELECT 'AI Analysis Logs', COUNT(*) FROM AI_ANALYSIS_LOGS
ORDER BY TABLE_NAME;

PROMPT 
PROMPT ========================================
PROMPT All seed data loaded successfully!
PROMPT ========================================

EXIT;
