-- =====================================================
-- Script: 00-clean-all-data.sql
-- Description: Clean all seed data from database
-- WARNING: This will delete ALL data from all tables
-- Use before re-running seed scripts
-- =====================================================

SET SERVEROUTPUT ON;

PROMPT ========================================
PROMPT WARNING: CLEANING ALL DATA
PROMPT This will delete all records from all tables
PROMPT ========================================

-- Disable foreign key constraints temporarily
BEGIN
    FOR c IN (SELECT constraint_name, table_name 
              FROM user_constraints 
              WHERE constraint_type = 'R') LOOP
        EXECUTE IMMEDIATE 'ALTER TABLE ' || c.table_name || 
                         ' DISABLE CONSTRAINT ' || c.constraint_name;
    END LOOP;
END;
/

-- Delete data in reverse dependency order
PROMPT Deleting data...

-- Level 7 - AI Analysis Logs (no FK dependencies, but references prescriptions)
DELETE FROM AI_ANALYSIS_LOGS;
PROMPT Deleted AI_ANALYSIS_LOGS

-- Level 6 - Dispensations and related
DELETE FROM DISPENSATION_ITEMS;
DELETE FROM DISPENSATIONS;
PROMPT Deleted DISPENSATIONS and DISPENSATION_ITEMS

-- Level 5 - Prescriptions and related
DELETE FROM PRESCRIPTION_DIAGNOSES;
DELETE FROM PRESCRIPTION_MEDICATIONS;
DELETE FROM PRESCRIPTIONS;
PROMPT Deleted PRESCRIPTIONS and related tables

-- Level 4 - Inventory, User roles, etc
DELETE FROM INVENTORY;
DELETE FROM USER_ROLES;
DELETE FROM ROLE_PERMISSIONS;
PROMPT Deleted INVENTORY, USER_ROLES, ROLE_PERMISSIONS

-- Level 3 - Pharmacies, Users, Roles, Permissions
DELETE FROM PHARMACIES;
DELETE FROM USERS;
DELETE FROM PERMISSIONS;
DELETE FROM ROLES;
PROMPT Deleted PHARMACIES, USERS, ROLES, PERMISSIONS

-- Level 3 - Drug Interactions
DELETE FROM DRUG_INTERACTIONS;
PROMPT Deleted DRUG_INTERACTIONS

-- Level 2 - Medications, Doctors, Patients
DELETE FROM MEDICATIONS;
DELETE FROM DOCTOR_MEDICAL_CENTER;
DELETE FROM DOCTORS;
DELETE FROM PATIENT_ALLERGIES;
DELETE FROM PATIENT_EMERGENCY_CONTACTS;
DELETE FROM PATIENTS;
DELETE FROM MEDICAL_CENTERS;
PROMPT Deleted MEDICATIONS, DOCTORS, PATIENTS, MEDICAL_CENTERS

-- Level 1 - Base catalogs
DELETE FROM ADMINISTRATION_ROUTES;
DELETE FROM SPECIALTIES;
DELETE FROM ADDRESSES;
DELETE FROM CIE10_CATALOG;
PROMPT Deleted base catalogs

-- Note: AUDIT_LOGS is immutable and cannot be deleted (FDA compliance)
PROMPT Note: AUDIT_LOGS is immutable (FDA 21 CFR Part 11) - cannot be deleted

-- Re-enable foreign key constraints
BEGIN
    FOR c IN (SELECT constraint_name, table_name 
              FROM user_constraints 
              WHERE constraint_type = 'R') LOOP
        EXECUTE IMMEDIATE 'ALTER TABLE ' || c.table_name || 
                         ' ENABLE CONSTRAINT ' || c.constraint_name;
    END LOOP;
END;
/

COMMIT;

PROMPT ========================================
PROMPT Data cleaning completed!
PROMPT ========================================

-- Verify
SELECT 'CIE10_CATALOG' as TABLE_NAME, COUNT(*) as RECORDS FROM CIE10_CATALOG
UNION ALL
SELECT 'ADDRESSES', COUNT(*) FROM ADDRESSES
UNION ALL
SELECT 'PATIENTS', COUNT(*) FROM PATIENTS
UNION ALL
SELECT 'DOCTORS', COUNT(*) FROM DOCTORS
UNION ALL
SELECT 'MEDICATIONS', COUNT(*) FROM MEDICATIONS
UNION ALL
SELECT 'PRESCRIPTIONS', COUNT(*) FROM PRESCRIPTIONS
UNION ALL
SELECT 'DISPENSATIONS', COUNT(*) FROM DISPENSATIONS
UNION ALL
SELECT 'USERS', COUNT(*) FROM USERS
UNION ALL
SELECT 'AUDIT_LOGS (immutable)', COUNT(*) FROM AUDIT_LOGS
ORDER BY TABLE_NAME;

PROMPT ========================================
PROMPT Ready for fresh seed data insertion
PROMPT Run: 00-execute-all-seeds.sql
PROMPT ========================================

EXIT;
