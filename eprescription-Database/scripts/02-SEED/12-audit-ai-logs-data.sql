-- =====================================================
-- Script: 12-audit-ai-logs-data.sql
-- Description: Seed data for AUDIT_LOGS and AI_ANALYSIS_LOGS tables
-- Creates comprehensive audit trail and AI interaction logs for compliance
-- Critical for FDA, HIPAA, and regulatory requirements
-- Follows DATABASE-SCHEMA-REFERENCE.md structure
-- Uses proper UTF-8 encoding for Spanish characters
-- =====================================================

-- Configure session for UTF-8
ALTER SESSION SET NLS_LANGUAGE='SPANISH';
ALTER SESSION SET NLS_TERRITORY='COSTA RICA';
SET DEFINE OFF;
SET SERVEROUTPUT ON;

PROMPT ========================================
PROMPT Inserting AUDIT_LOGS data
PROMPT ========================================

-- Note: AUDIT_LOGS is immutable (FDA 21 CFR Part 11 compliance)
-- Cannot delete existing records - they are append-only

PROMPT Creating comprehensive audit trail...

DECLARE
    v_counter NUMBER := 0;
    v_user_id RAW(16);
    v_action_type VARCHAR2(100);
    v_entity_type VARCHAR2(100);
    v_ip_address VARCHAR2(50);
    
BEGIN
    -- Get sample user ID
    SELECT USER_ID INTO v_user_id FROM USERS WHERE ROWNUM = 1;
    
    -- Create 50 audit log entries
    FOR i IN 1..50 LOOP
        v_counter := v_counter + 1;
        
        -- Select action type
        v_action_type := CASE MOD(i, 10)
            WHEN 0 THEN 'LOGIN'
            WHEN 1 THEN 'LOGOUT'
            WHEN 2 THEN 'CREATE'
            WHEN 3 THEN 'UPDATE'
            WHEN 4 THEN 'DELETE'
            WHEN 5 THEN 'VIEW'
            WHEN 6 THEN 'APPROVE'
            WHEN 7 THEN 'REJECT'
            WHEN 8 THEN 'DISPENSE'
            ELSE 'CANCEL'
        END;
        
        -- Select entity type
        v_entity_type := CASE MOD(i, 7)
            WHEN 0 THEN 'PRESCRIPTION'
            WHEN 1 THEN 'PATIENT'
            WHEN 2 THEN 'MEDICATION'
            WHEN 3 THEN 'DISPENSATION'
            WHEN 4 THEN 'USER'
            WHEN 5 THEN 'PHARMACY'
            ELSE 'DOCTOR'
        END;
        
        -- Select IP address
        v_ip_address := CASE MOD(i, 6)
            WHEN 0 THEN '192.168.1.101'
            WHEN 1 THEN '192.168.1.102'
            WHEN 2 THEN '192.168.1.103'
            WHEN 3 THEN '10.0.0.50'
            WHEN 4 THEN '10.0.0.51'
            ELSE '172.16.0.10'
        END;
        
        INSERT INTO AUDIT_LOGS (
            TIMESTAMP,
            USER_ID,
            USERNAME,
            IP_ADDRESS,
            ACTION_TYPE,
            ENTITY_TYPE,
            ENTITY_ID,
            BEFORE_VALUE,
            AFTER_VALUE,
            METADATA,
            SESSION_ID
        ) VALUES (
            SYSTIMESTAMP - INTERVAL '1' DAY + (DBMS_RANDOM.VALUE * 30),
            v_user_id,
            'user' || MOD(i, 10) || '@eprescription.cr',
            v_ip_address,
            v_action_type,
            v_entity_type,
            'ENTITY-' || LPAD(i, 6, '0'),
            CASE 
                WHEN MOD(i, 3) = 0 THEN '{"status":"pending","quantity":20}'
                ELSE NULL
            END,
            CASE 
                WHEN MOD(i, 3) = 0 THEN '{"status":"approved","quantity":20,"approver":"Dr. García"}'
                ELSE NULL
            END,
            '{"browser":"Chrome","os":"Windows","device":"Desktop","compliance":"HIPAA"}',
            'SESSION-' || LPAD(MOD(i, 20), 8, '0')
        );
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('Inserted ' || v_counter || ' audit log entries');
    COMMIT;
END;
/

PROMPT 
PROMPT ========================================
PROMPT Inserting AI_ANALYSIS_LOGS data
PROMPT ========================================

PROMPT Creating AI interaction logs for compliance...

DECLARE
    v_counter NUMBER := 0;
    v_user_id RAW(16);
    v_analysis_type VARCHAR2(50);
    v_provider VARCHAR2(100);
    
BEGIN
    -- Get sample user ID
    SELECT USER_ID INTO v_user_id FROM USERS WHERE ROWNUM = 1;
    
    -- Create AI analysis logs for each prescription
    FOR presc_rec IN (
        SELECT p.PRESCRIPTION_ID, p.PRESCRIPTION_NUMBER,
               pt.FIRST_NAME || ' ' || pt.LAST_NAME as PATIENT_NAME,
               d.FIRST_NAME || ' ' || d.LAST_NAME as DOCTOR_NAME
        FROM PRESCRIPTIONS p
        JOIN PATIENTS pt ON p.PATIENT_ID = pt.PATIENT_ID
        JOIN DOCTORS d ON p.DOCTOR_ID = d.DOCTOR_ID
        WHERE ROWNUM <= 20
    ) LOOP
        v_counter := v_counter + 1;
        
        -- Select analysis type (must match constraint values)
        v_analysis_type := CASE MOD(v_counter, 4)
            WHEN 0 THEN 'diagnosis'
            WHEN 1 THEN 'medication'
            WHEN 2 THEN 'interaction'
            ELSE 'contraindication'
        END;
        
        -- Select AI provider
        v_provider := CASE MOD(v_counter, 5)
            WHEN 0 THEN 'OpenAI GPT-4'
            WHEN 1 THEN 'Azure OpenAI'
            WHEN 2 THEN 'AWS HealthLake'
            WHEN 3 THEN 'Google Healthcare API'
            ELSE 'IBM Watson Health'
        END;
        
        INSERT INTO AI_ANALYSIS_LOGS (
            TIMESTAMP,
            USER_ID,
            PRESCRIPTION_ID,
            ANALYSIS_TYPE,
            INPUT_DATA,
            OUTPUT_DATA,
            AI_PROVIDER,
            PROCESSING_TIME_MS,
            CONFIDENCE_SCORE,
            WAS_ACCEPTED
        ) VALUES (
            SYSTIMESTAMP - INTERVAL '1' DAY + (DBMS_RANDOM.VALUE * 5),
            v_user_id,
            presc_rec.PRESCRIPTION_ID,
            v_analysis_type,
            '{' ||
            '"prescription_number":"' || presc_rec.PRESCRIPTION_NUMBER || '",' ||
            '"patient":"' || presc_rec.PATIENT_NAME || '",' ||
            '"doctor":"' || presc_rec.DOCTOR_NAME || '",' ||
            '"medications":["Paracetamol 500mg"],' ||
            '"patient_allergies":[],' ||
            '"current_medications":[]' ||
            '}',
            '{' ||
            '"analysis_result":"No interactions detected",' ||
            '"risk_level":"low",' ||
            '"recommendations":["Continue as prescribed"],' ||
            '"warnings":[],' ||
            '"confidence":' || TO_CHAR(0.85 + (DBMS_RANDOM.VALUE * 0.14), '0.9999') || ',' ||
            '"processing_time_ms":' || TO_CHAR(TRUNC(100 + DBMS_RANDOM.VALUE * 400)) ||
            '}',
            v_provider,
            TRUNC(100 + DBMS_RANDOM.VALUE * 400),
            0.85 + (DBMS_RANDOM.VALUE * 0.14),
            CASE WHEN MOD(v_counter, 10) = 0 THEN 0 ELSE 1 END
        );
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('Inserted ' || v_counter || ' AI analysis logs');
    COMMIT;
END;
/

PROMPT 
PROMPT ========================================
PROMPT AUDIT and AI LOGS Data Completed!
PROMPT ========================================

-- Verify data
SELECT COUNT(*) as TOTAL_AUDIT_LOGS FROM AUDIT_LOGS;
SELECT COUNT(*) as TOTAL_AI_LOGS FROM AI_ANALYSIS_LOGS;

SELECT 'Audit logs by action type:' as INFO FROM DUAL;
SELECT ACTION_TYPE, COUNT(*) as COUNT
FROM AUDIT_LOGS
GROUP BY ACTION_TYPE
ORDER BY COUNT DESC;

SELECT 'Audit logs by entity type:' as INFO FROM DUAL;
SELECT ENTITY_TYPE, COUNT(*) as COUNT
FROM AUDIT_LOGS
GROUP BY ENTITY_TYPE
ORDER BY COUNT DESC;

SELECT 'AI analysis by type:' as INFO FROM DUAL;
SELECT ANALYSIS_TYPE, COUNT(*) as COUNT
FROM AI_ANALYSIS_LOGS
GROUP BY ANALYSIS_TYPE
ORDER BY COUNT DESC;

SELECT 'AI analysis by provider:' as INFO FROM DUAL;
SELECT AI_PROVIDER, COUNT(*) as COUNT
FROM AI_ANALYSIS_LOGS
GROUP BY AI_PROVIDER
ORDER BY COUNT DESC;

SELECT 'AI analysis acceptance rate:' as INFO FROM DUAL;
SELECT 
    SUM(CASE WHEN WAS_ACCEPTED = 1 THEN 1 ELSE 0 END) as ACCEPTED,
    SUM(CASE WHEN WAS_ACCEPTED = 0 THEN 1 ELSE 0 END) as REJECTED,
    ROUND(SUM(CASE WHEN WAS_ACCEPTED = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as ACCEPTANCE_RATE_PCT
FROM AI_ANALYSIS_LOGS;

SELECT 'Average AI processing time:' as INFO FROM DUAL;
SELECT 
    ROUND(AVG(PROCESSING_TIME_MS), 2) as AVG_MS,
    MIN(PROCESSING_TIME_MS) as MIN_MS,
    MAX(PROCESSING_TIME_MS) as MAX_MS
FROM AI_ANALYSIS_LOGS;

SELECT 'Average AI confidence score:' as INFO FROM DUAL;
SELECT 
    ROUND(AVG(CONFIDENCE_SCORE), 4) as AVG_CONFIDENCE,
    ROUND(MIN(CONFIDENCE_SCORE), 4) as MIN_CONFIDENCE,
    ROUND(MAX(CONFIDENCE_SCORE), 4) as MAX_CONFIDENCE
FROM AI_ANALYSIS_LOGS;

SELECT 'Sample audit logs:' as INFO FROM DUAL;
SELECT 
    TO_CHAR(TIMESTAMP, 'DD/MM/YYYY HH24:MI:SS') as TIMESTAMP,
    USERNAME,
    ACTION_TYPE,
    ENTITY_TYPE,
    IP_ADDRESS
FROM AUDIT_LOGS
FETCH FIRST 5 ROWS ONLY;

SELECT 'Sample AI analysis logs:' as INFO FROM DUAL;
SELECT 
    TO_CHAR(TIMESTAMP, 'DD/MM/YYYY HH24:MI:SS') as TIMESTAMP,
    ANALYSIS_TYPE,
    AI_PROVIDER,
    PROCESSING_TIME_MS,
    ROUND(CONFIDENCE_SCORE, 4) as CONFIDENCE,
    CASE WHEN WAS_ACCEPTED = 1 THEN 'Yes' ELSE 'No' END as ACCEPTED
FROM AI_ANALYSIS_LOGS
FETCH FIRST 5 ROWS ONLY;

PROMPT ========================================
PROMPT Compliance Note: All audit and AI logs
PROMPT are stored for FDA and HIPAA compliance
PROMPT ========================================

EXIT;
