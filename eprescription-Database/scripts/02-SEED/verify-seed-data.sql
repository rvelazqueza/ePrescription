-- =====================================================
-- Script: verify-seed-data.sql
-- Description: Quick verification of all seed data
-- Shows record counts and sample data from each table
-- =====================================================

SET PAGESIZE 100
SET LINESIZE 150
SET SERVEROUTPUT ON

PROMPT ========================================
PROMPT SEED DATA VERIFICATION REPORT
PROMPT ========================================
PROMPT 

-- Record counts for all tables
PROMPT Table Record Counts:
PROMPT ========================================

SELECT 
    RPAD(table_name, 40) as TABLE_NAME,
    LPAD(TO_CHAR(num_rows), 10) as RECORDS
FROM user_tables
WHERE table_name IN (
    'CIE10_CATALOG', 'ADDRESSES', 'SPECIALTIES', 'ADMINISTRATION_ROUTES',
    'PATIENTS', 'PATIENT_EMERGENCY_CONTACTS', 'PATIENT_ALLERGIES',
    'MEDICAL_CENTERS', 'DOCTORS', 'DOCTOR_MEDICAL_CENTER',
    'MEDICATIONS', 'DRUG_INTERACTIONS',
    'PHARMACIES', 'INVENTORY',
    'PRESCRIPTIONS', 'PRESCRIPTION_MEDICATIONS', 'PRESCRIPTION_DIAGNOSES',
    'DISPENSATIONS', 'DISPENSATION_ITEMS',
    'USERS', 'ROLES', 'PERMISSIONS', 'USER_ROLES', 'ROLE_PERMISSIONS',
    'AUDIT_LOGS', 'AI_ANALYSIS_LOGS'
)
ORDER BY table_name;

PROMPT 
PROMPT ========================================
PROMPT Sample Data from Key Tables
PROMPT ========================================

PROMPT 
PROMPT [1] CIE-10 Diagnoses (Sample):
SELECT CODE, DESCRIPTION_ES 
FROM CIE10_CATALOG 
FETCH FIRST 3 ROWS ONLY;

PROMPT 
PROMPT [2] Patients (Sample):
SELECT FIRST_NAME, LAST_NAME, IDENTIFICATION_NUMBER
FROM PATIENTS 
FETCH FIRST 3 ROWS ONLY;

PROMPT 
PROMPT [3] Doctors (Sample):
SELECT FIRST_NAME, LAST_NAME, LICENSE_NUMBER
FROM DOCTORS 
FETCH FIRST 3 ROWS ONLY;

PROMPT 
PROMPT [4] Medications (Sample):
SELECT GENERIC_NAME, MEDICATION_CODE
FROM MEDICATIONS 
FETCH FIRST 3 ROWS ONLY;

PROMPT 
PROMPT [5] Prescriptions (Sample):
SELECT PRESCRIPTION_NUMBER, STATUS
FROM PRESCRIPTIONS 
FETCH FIRST 3 ROWS ONLY;

PROMPT 
PROMPT [6] Pharmacies (Sample):
SELECT PHARMACY_NAME, PHONE
FROM PHARMACIES 
FETCH FIRST 3 ROWS ONLY;

PROMPT 
PROMPT [7] Users (Sample):
SELECT USERNAME, EMAIL
FROM USERS 
FETCH FIRST 3 ROWS ONLY;

PROMPT 
PROMPT [8] Audit Logs (Sample):
SELECT ACTION_TYPE, ENTITY_TYPE, USERNAME
FROM AUDIT_LOGS 
FETCH FIRST 3 ROWS ONLY;

PROMPT 
PROMPT ========================================
PROMPT Data Quality Checks
PROMPT ========================================

PROMPT 
PROMPT UTF-8 Characters Check (should show tildes correctly):
SELECT FIRST_NAME, LAST_NAME 
FROM PATIENTS 
WHERE FIRST_NAME LIKE '%í%' OR FIRST_NAME LIKE '%á%'
FETCH FIRST 3 ROWS ONLY;

PROMPT 
PROMPT Foreign Key Integrity Check:
PROMPT (All counts should match - no orphaned records)

SELECT 'Prescriptions with valid Patient' as CHECK_TYPE,
       COUNT(*) as COUNT
FROM PRESCRIPTIONS p
WHERE EXISTS (SELECT 1 FROM PATIENTS pt WHERE pt.PATIENT_ID = p.PATIENT_ID)
UNION ALL
SELECT 'Prescriptions with valid Doctor',
       COUNT(*)
FROM PRESCRIPTIONS p
WHERE EXISTS (SELECT 1 FROM DOCTORS d WHERE d.DOCTOR_ID = p.DOCTOR_ID)
UNION ALL
SELECT 'Dispensations with valid Prescription',
       COUNT(*)
FROM DISPENSATIONS d
WHERE EXISTS (SELECT 1 FROM PRESCRIPTIONS p WHERE p.PRESCRIPTION_ID = d.PRESCRIPTION_ID);

PROMPT 
PROMPT ========================================
PROMPT Compliance Checks
PROMPT ========================================

PROMPT 
PROMPT Audit Logs Status (should be immutable):
SELECT 'Total Audit Logs' as METRIC, COUNT(*) as VALUE
FROM AUDIT_LOGS
UNION ALL
SELECT 'Unique Sessions', COUNT(DISTINCT SESSION_ID)
FROM AUDIT_LOGS
UNION ALL
SELECT 'Unique Users', COUNT(DISTINCT USERNAME)
FROM AUDIT_LOGS;

PROMPT 
PROMPT AI Analysis Logs Status:
SELECT 'Total AI Logs' as METRIC, COUNT(*) as VALUE
FROM AI_ANALYSIS_LOGS
UNION ALL
SELECT 'Accepted Analyses', SUM(CASE WHEN WAS_ACCEPTED = 1 THEN 1 ELSE 0 END)
FROM AI_ANALYSIS_LOGS
UNION ALL
SELECT 'Avg Confidence Score', ROUND(AVG(CONFIDENCE_SCORE), 4)
FROM AI_ANALYSIS_LOGS;

PROMPT 
PROMPT ========================================
PROMPT VERIFICATION COMPLETED
PROMPT ========================================
PROMPT 
PROMPT If all tables show records and samples display correctly,
PROMPT the seed data is properly loaded!
PROMPT 
PROMPT ========================================

EXIT;
