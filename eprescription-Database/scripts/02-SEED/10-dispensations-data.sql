-- =====================================================
-- Script: 10-dispensations-data.sql
-- Description: Seed data for DISPENSATIONS table
-- Creates 20 dispensations linking prescriptions to pharmacies
-- Follows DATABASE-SCHEMA-REFERENCE.md structure
-- Compatible with HL7 FHIR R4 (MedicationDispense resource)
-- =====================================================

-- Configure session for UTF-8
ALTER SESSION SET NLS_LANGUAGE='SPANISH';
ALTER SESSION SET NLS_TERRITORY='COSTA RICA';

SET DEFINE OFF;
SET SERVEROUTPUT ON;

PROMPT ========================================
PROMPT Inserting DISPENSATIONS data
PROMPT ========================================

-- Clear existing data
DELETE FROM DISPENSATIONS;

PROMPT Creating 20 dispensations for prescriptions...

DECLARE
    v_counter NUMBER := 0;
    v_pharmacy_id RAW(16);
BEGIN
    -- Create dispensations for first 20 prescriptions
    FOR presc_rec IN (
        SELECT p.PRESCRIPTION_ID, 
               p.PRESCRIPTION_NUMBER,
               p.PRESCRIPTION_DATE,
               pat.FIRST_NAME || ' ' || pat.LAST_NAME as PATIENT_NAME
        FROM PRESCRIPTIONS p
        JOIN PATIENTS pat ON p.PATIENT_ID = pat.PATIENT_ID
        WHERE ROWNUM <= 20
        ORDER BY p.PRESCRIPTION_DATE
    ) LOOP
        v_counter := v_counter + 1;
        
        -- Get a random pharmacy
        SELECT PHARMACY_ID INTO v_pharmacy_id
        FROM (
            SELECT PHARMACY_ID
            FROM PHARMACIES
            WHERE IS_ACTIVE = 1
            ORDER BY DBMS_RANDOM.VALUE
        )
        WHERE ROWNUM = 1;
        
        -- Create dispensation
        INSERT INTO DISPENSATIONS (
            PRESCRIPTION_ID,
            PHARMACY_ID,
            PHARMACIST_ID,
            DISPENSATION_DATE,
            STATUS,
            NOTES
        ) VALUES (
            presc_rec.PRESCRIPTION_ID,
            v_pharmacy_id,
            NULL, -- No pharmacist data yet
            presc_rec.PRESCRIPTION_DATE + INTERVAL '2' HOUR, -- Dispensed 2 hours after prescription
            CASE 
                WHEN MOD(v_counter, 5) = 0 THEN 'pending'
                WHEN MOD(v_counter, 8) = 0 THEN 'verified'
                WHEN MOD(v_counter, 10) = 0 THEN 'rejected'
                ELSE 'completed'
            END,
            CASE 
                WHEN MOD(v_counter, 5) = 0 THEN 'Dispensación pendiente - Esperando verificación del farmacéutico'
                WHEN MOD(v_counter, 8) = 0 THEN 'Dispensación verificada - Lista para entrega al paciente'
                WHEN MOD(v_counter, 10) = 0 THEN 'Dispensación rechazada - Prescripción vencida o inválida'
                ELSE 'Dispensación completada exitosamente. Paciente recibió instrucciones de uso.'
            END
        );
        
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('Inserted ' || v_counter || ' dispensations');
    COMMIT;
END;
/

PROMPT 
PROMPT ========================================
PROMPT DISPENSATIONS Data Completed!
PROMPT ========================================

-- Verify data
SELECT COUNT(*) as TOTAL_DISPENSATIONS FROM DISPENSATIONS;

SELECT 'Dispensations by status:' as INFO FROM DUAL;
SELECT STATUS, COUNT(*) as COUNT
FROM DISPENSATIONS
GROUP BY STATUS
ORDER BY COUNT DESC;

SELECT 'Sample dispensations:' as INFO FROM DUAL;
SELECT p.PRESCRIPTION_NUMBER,
       ph.PHARMACY_NAME,
       d.DISPENSATION_DATE,
       d.STATUS
FROM DISPENSATIONS d
JOIN PRESCRIPTIONS p ON d.PRESCRIPTION_ID = p.PRESCRIPTION_ID
JOIN PHARMACIES ph ON d.PHARMACY_ID = ph.PHARMACY_ID
FETCH FIRST 5 ROWS ONLY;

SELECT 'Dispensations with medications:' as INFO FROM DUAL;
SELECT p.PRESCRIPTION_NUMBER,
       ph.PHARMACY_NAME,
       m.GENERIC_NAME,
       pm.DOSAGE,
       d.STATUS
FROM DISPENSATIONS d
JOIN PRESCRIPTIONS p ON d.PRESCRIPTION_ID = p.PRESCRIPTION_ID
JOIN PHARMACIES ph ON d.PHARMACY_ID = ph.PHARMACY_ID
JOIN PRESCRIPTION_MEDICATIONS pm ON p.PRESCRIPTION_ID = pm.PRESCRIPTION_ID
JOIN MEDICATIONS m ON pm.MEDICATION_ID = m.MEDICATION_ID
FETCH FIRST 5 ROWS ONLY;

PROMPT ========================================

EXIT;
