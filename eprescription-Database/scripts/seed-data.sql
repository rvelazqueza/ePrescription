-- =====================================================
-- Script: seed-data.sql
-- Description: Master script to execute all seed data scripts in correct order
-- Author: ePrescription Development Team
-- Date: 2024-11-11
-- =====================================================

SET SERVEROUTPUT ON;
SET VERIFY OFF;
SET FEEDBACK ON;

PROMPT ========================================
PROMPT ePrescription Database - Seed Data
PROMPT ========================================
PROMPT 
PROMPT This script will populate the database with mock data for testing and development
PROMPT 
PROMPT Execution order:
PROMPT 1. CIE-10 Catalog (500+ codes)
PROMPT 2. Addresses (50 records)
PROMPT 3. Specialties and Administration Routes
PROMPT 4. Patients with contacts and allergies (50 records)
PROMPT 5. Medical Centers and Doctors (15 centers, 30 doctors)
PROMPT 6. Medications (100 records)
PROMPT 7. Drug Interactions (50 records)
PROMPT 8. Pharmacies and Inventory (20 pharmacies, 60+ inventory records)
PROMPT 9. Prescriptions with diagnoses and medications (100 prescriptions)
PROMPT 10. Dispensations (50 records)
PROMPT 11. Users, Roles, and Permissions
PROMPT 12. Audit Logs and AI Analysis Logs
PROMPT 
PROMPT ========================================

PROMPT 
PROMPT Starting seed data insertion...
PROMPT 

-- 1. CIE-10 Catalog
PROMPT 
PROMPT [1/12] Inserting CIE-10 Catalog data...
@@02-SEED/01-cie10-catalog-data.sql

-- 2. Addresses
PROMPT 
PROMPT [2/12] Inserting Addresses data...
@@02-SEED/02-addresses-data.sql

-- 3. Specialties and Administration Routes
PROMPT 
PROMPT [3/12] Inserting Specialties and Administration Routes data...
@@02-SEED/03-specialties-routes-data.sql

-- 4. Patients
PROMPT 
PROMPT [4/12] Inserting Patients data...
@@02-SEED/04-patients-data.sql

-- 5. Medical Centers and Doctors
PROMPT 
PROMPT [5/12] Inserting Medical Centers and Doctors data...
@@02-SEED/05-medical-centers-doctors-data.sql

-- 6. Medications
PROMPT 
PROMPT [6/12] Inserting Medications data...
@@02-SEED/06-medications-data.sql

-- 7. Drug Interactions
PROMPT 
PROMPT [7/12] Inserting Drug Interactions data...
@@02-SEED/07-drug-interactions-data.sql

-- 8. Pharmacies and Inventory
PROMPT 
PROMPT [8/12] Inserting Pharmacies and Inventory data...
@@02-SEED/08-pharmacies-inventory-data.sql

-- 9. Prescriptions (Part 1, 2, and 3)
PROMPT 
PROMPT [9/12] Inserting Prescriptions data...
@@02-SEED/09-prescriptions-data.sql
@@02-SEED/09-prescriptions-data-part2.sql
@@02-SEED/09-prescriptions-data-part3.sql

-- 10. Dispensations
PROMPT 
PROMPT [10/12] Inserting Dispensations data...
@@02-SEED/10-dispensations-data.sql

-- 11. Users, Roles, and Permissions
PROMPT 
PROMPT [11/12] Inserting Users, Roles, and Permissions data...
@@02-SEED/11-users-roles-permissions-data.sql

-- 12. Audit Logs and AI Analysis Logs
PROMPT 
PROMPT [12/12] Inserting Audit Logs and AI Analysis Logs data...
@@02-SEED/12-audit-ai-logs-data.sql

PROMPT 
PROMPT ========================================
PROMPT Seed Data Insertion Completed!
PROMPT ========================================
PROMPT 
PROMPT Summary:
PROMPT - CIE-10 Codes: 500+
PROMPT - Addresses: 50
PROMPT - Specialties: 25
PROMPT - Administration Routes: 20
PROMPT - Patients: 50 (with contacts and allergies)
PROMPT - Medical Centers: 15
PROMPT - Doctors: 30
PROMPT - Medications: 100
PROMPT - Drug Interactions: 50
PROMPT - Pharmacies: 20
PROMPT - Inventory Records: 60+
PROMPT - Prescriptions: 100 (with diagnoses and medications)
PROMPT - Dispensations: 50
PROMPT - Users: 9
PROMPT - Roles: 5
PROMPT - Permissions: 20
PROMPT - Audit Logs: 20+
PROMPT - AI Analysis Logs: 15+
PROMPT 
PROMPT ========================================
PROMPT 
PROMPT Next steps:
PROMPT 1. Verify data integrity with queries
PROMPT 2. Test application functionality
PROMPT 3. Review audit logs
PROMPT 
PROMPT Default test credentials:
PROMPT - Admin: admin / password123
PROMPT - Doctor: roberto.andrade / password123
PROMPT - Pharmacist: maria.gonzalez / password123
PROMPT - Patient: juan.perez / password123
PROMPT - Auditor: auditor / password123
PROMPT 
PROMPT ========================================

SET VERIFY ON;
SET FEEDBACK ON;
