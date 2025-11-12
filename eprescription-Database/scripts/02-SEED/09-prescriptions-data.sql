-- =====================================================
-- Script: 09-prescriptions-data.sql
-- Description: Seed data for PRESCRIPTIONS, PRESCRIPTION_DIAGNOSES, and PRESCRIPTION_MEDICATIONS
-- Creates 30 realistic prescriptions with CIE-10 diagnoses and ATC medications
-- Follows DATABASE-SCHEMA-REFERENCE.md structure
-- Compatible with HL7 FHIR R4, uses WHO standards (CIE-10, ATC)
-- =====================================================

-- Configure session for UTF-8
ALTER SESSION SET NLS_LANGUAGE='SPANISH';
ALTER SESSION SET NLS_TERRITORY='COSTA RICA';

SET DEFINE OFF;
SET SERVEROUTPUT ON;

PROMPT ========================================
PROMPT Inserting PRESCRIPTIONS data
PROMPT ========================================

-- Clear existing data
DELETE FROM PRESCRIPTION_MEDICATIONS;
DELETE FROM PRESCRIPTION_DIAGNOSES;
DELETE FROM PRESCRIPTIONS;

PROMPT Creating 30 prescriptions with diagnoses and medications...

DECLARE
    v_prescription_id RAW(16);
    v_patient_id RAW(16);
    v_doctor_id RAW(16);
    v_center_id RAW(16);
    v_medication_id RAW(16);
    v_route_id RAW(16);
    v_counter NUMBER := 0;
    v_year NUMBER := EXTRACT(YEAR FROM SYSDATE);
BEGIN
    -- Create prescriptions for different patients
    FOR patient_rec IN (
        SELECT PATIENT_ID, FIRST_NAME, LAST_NAME
        FROM PATIENTS
        WHERE ROWNUM <= 30
        ORDER BY CREATED_AT
    ) LOOP
        v_counter := v_counter + 1;
        
        -- Get a random doctor
        SELECT DOCTOR_ID, MEDICAL_CENTER_ID 
        INTO v_doctor_id, v_center_id
        FROM (
            SELECT d.DOCTOR_ID, dmc.MEDICAL_CENTER_ID
            FROM DOCTORS d
            JOIN DOCTOR_MEDICAL_CENTERS dmc ON d.DOCTOR_ID = dmc.DOCTOR_ID
            WHERE dmc.IS_ACTIVE = 1
            ORDER BY DBMS_RANDOM.VALUE
        )
        WHERE ROWNUM = 1;

        
        -- Create prescription
        INSERT INTO PRESCRIPTIONS (
            PRESCRIPTION_NUMBER,
            PATIENT_ID,
            DOCTOR_ID,
            MEDICAL_CENTER_ID,
            PRESCRIPTION_DATE,
            EXPIRATION_DATE,
            STATUS,
            NOTES
        ) VALUES (
            'RX-CR-' || v_year || '-' || LPAD(v_counter, 6, '0'),
            patient_rec.PATIENT_ID,
            v_doctor_id,
            v_center_id,
            SYSTIMESTAMP,
            SYSTIMESTAMP + INTERVAL '30' DAY,
            'active',
            'Prescripción generada para tratamiento ambulatorio'
        ) RETURNING PRESCRIPTION_ID INTO v_prescription_id;
        
        -- Add diagnosis based on prescription number (different scenarios)
        CASE MOD(v_counter, 10)
            WHEN 1 THEN
                -- Hipertensión
                INSERT INTO PRESCRIPTION_DIAGNOSES (PRESCRIPTION_ID, CIE10_CODE, IS_PRIMARY, NOTES)
                VALUES (v_prescription_id, 'I10', 1, 'Hipertensión arterial esencial');
                
                -- Prescribe Enalapril
                SELECT MEDICATION_ID INTO v_medication_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'C09AA02';
                SELECT ROUTE_ID INTO v_route_id FROM ADMINISTRATION_ROUTES WHERE ROUTE_CODE = 'ORAL';
                INSERT INTO PRESCRIPTION_MEDICATIONS (PRESCRIPTION_ID, MEDICATION_ID, DOSAGE, FREQUENCY, DURATION_DAYS, ADMINISTRATION_ROUTE_ID, QUANTITY, INSTRUCTIONS, AI_SUGGESTED)
                VALUES (v_prescription_id, v_medication_id, '10mg', 'Una vez al día', 30, v_route_id, 30, 'Tomar en ayunas por la mañana', 0);
                
            WHEN 2 THEN
                -- Diabetes tipo 2
                INSERT INTO PRESCRIPTION_DIAGNOSES (PRESCRIPTION_ID, CIE10_CODE, IS_PRIMARY, NOTES)
                VALUES (v_prescription_id, 'E11.9', 1, 'Diabetes mellitus tipo 2 sin complicaciones');
                
                -- Prescribe Metformina
                SELECT MEDICATION_ID INTO v_medication_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'A10BA02';
                SELECT ROUTE_ID INTO v_route_id FROM ADMINISTRATION_ROUTES WHERE ROUTE_CODE = 'ORAL';
                INSERT INTO PRESCRIPTION_MEDICATIONS (PRESCRIPTION_ID, MEDICATION_ID, DOSAGE, FREQUENCY, DURATION_DAYS, ADMINISTRATION_ROUTE_ID, QUANTITY, INSTRUCTIONS, AI_SUGGESTED)
                VALUES (v_prescription_id, v_medication_id, '850mg', 'Dos veces al día', 30, v_route_id, 60, 'Tomar con las comidas principales', 0);

                
            WHEN 3 THEN
                -- Infección respiratoria
                INSERT INTO PRESCRIPTION_DIAGNOSES (PRESCRIPTION_ID, CIE10_CODE, IS_PRIMARY, NOTES)
                VALUES (v_prescription_id, 'J06', 1, 'Infección aguda de las vías respiratorias superiores');
                
                -- Prescribe Amoxicilina
                SELECT MEDICATION_ID INTO v_medication_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'J01CA04';
                SELECT ROUTE_ID INTO v_route_id FROM ADMINISTRATION_ROUTES WHERE ROUTE_CODE = 'ORAL';
                INSERT INTO PRESCRIPTION_MEDICATIONS (PRESCRIPTION_ID, MEDICATION_ID, DOSAGE, FREQUENCY, DURATION_DAYS, ADMINISTRATION_ROUTE_ID, QUANTITY, INSTRUCTIONS, AI_SUGGESTED)
                VALUES (v_prescription_id, v_medication_id, '500mg', 'Cada 8 horas', 7, v_route_id, 21, 'Completar tratamiento aunque mejoren síntomas', 0);
                
            WHEN 4 THEN
                -- Dolor e inflamación
                INSERT INTO PRESCRIPTION_DIAGNOSES (PRESCRIPTION_ID, CIE10_CODE, IS_PRIMARY, NOTES)
                VALUES (v_prescription_id, 'I25', 1, 'Enfermedad isquémica crónica del corazón');
                
                -- Prescribe Ibuprofeno
                SELECT MEDICATION_ID INTO v_medication_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'M01AE01';
                SELECT ROUTE_ID INTO v_route_id FROM ADMINISTRATION_ROUTES WHERE ROUTE_CODE = 'ORAL';
                INSERT INTO PRESCRIPTION_MEDICATIONS (PRESCRIPTION_ID, MEDICATION_ID, DOSAGE, FREQUENCY, DURATION_DAYS, ADMINISTRATION_ROUTE_ID, QUANTITY, INSTRUCTIONS, AI_SUGGESTED)
                VALUES (v_prescription_id, v_medication_id, '400mg', 'Cada 8 horas', 5, v_route_id, 15, 'Tomar con alimentos', 0);
                
            WHEN 5 THEN
                -- Depresión
                INSERT INTO PRESCRIPTION_DIAGNOSES (PRESCRIPTION_ID, CIE10_CODE, IS_PRIMARY, NOTES)
                VALUES (v_prescription_id, 'I50', 1, 'Insuficiencia cardíaca');
                
                -- Prescribe Fluoxetina
                SELECT MEDICATION_ID INTO v_medication_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'N06AB03';
                SELECT ROUTE_ID INTO v_route_id FROM ADMINISTRATION_ROUTES WHERE ROUTE_CODE = 'ORAL';
                INSERT INTO PRESCRIPTION_MEDICATIONS (PRESCRIPTION_ID, MEDICATION_ID, DOSAGE, FREQUENCY, DURATION_DAYS, ADMINISTRATION_ROUTE_ID, QUANTITY, INSTRUCTIONS, AI_SUGGESTED)
                VALUES (v_prescription_id, v_medication_id, '20mg', 'Una vez al día', 30, v_route_id, 30, 'Tomar por la mañana', 1);

                
            WHEN 6 THEN
                -- Asma
                INSERT INTO PRESCRIPTION_DIAGNOSES (PRESCRIPTION_ID, CIE10_CODE, IS_PRIMARY, NOTES)
                VALUES (v_prescription_id, 'J45.9', 1, 'Asma no especificada');
                
                -- Prescribe Salbutamol
                SELECT MEDICATION_ID INTO v_medication_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'R03AC02';
                SELECT ROUTE_ID INTO v_route_id FROM ADMINISTRATION_ROUTES WHERE ROUTE_CODE = 'INHAL';
                INSERT INTO PRESCRIPTION_MEDICATIONS (PRESCRIPTION_ID, MEDICATION_ID, DOSAGE, FREQUENCY, DURATION_DAYS, ADMINISTRATION_ROUTE_ID, QUANTITY, INSTRUCTIONS, AI_SUGGESTED)
                VALUES (v_prescription_id, v_medication_id, '100mcg', '2 inhalaciones cada 6 horas', 30, v_route_id, 1, 'Usar según necesidad para crisis', 0);
                
            WHEN 7 THEN
                -- Gastritis
                INSERT INTO PRESCRIPTION_DIAGNOSES (PRESCRIPTION_ID, CIE10_CODE, IS_PRIMARY, NOTES)
                VALUES (v_prescription_id, 'K29', 1, 'Gastritis y duodenitis');
                
                -- Prescribe Omeprazol
                SELECT MEDICATION_ID INTO v_medication_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'A02BC01';
                SELECT ROUTE_ID INTO v_route_id FROM ADMINISTRATION_ROUTES WHERE ROUTE_CODE = 'ORAL';
                INSERT INTO PRESCRIPTION_MEDICATIONS (PRESCRIPTION_ID, MEDICATION_ID, DOSAGE, FREQUENCY, DURATION_DAYS, ADMINISTRATION_ROUTE_ID, QUANTITY, INSTRUCTIONS, AI_SUGGESTED)
                VALUES (v_prescription_id, v_medication_id, '20mg', 'Una vez al día', 30, v_route_id, 30, 'Tomar 30 minutos antes del desayuno', 0);
                
            WHEN 8 THEN
                -- Hipercolesterolemia
                INSERT INTO PRESCRIPTION_DIAGNOSES (PRESCRIPTION_ID, CIE10_CODE, IS_PRIMARY, NOTES)
                VALUES (v_prescription_id, 'E78.0', 1, 'Hipercolesterolemia pura');
                
                -- Prescribe Atorvastatina
                SELECT MEDICATION_ID INTO v_medication_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'C10AA05';
                SELECT ROUTE_ID INTO v_route_id FROM ADMINISTRATION_ROUTES WHERE ROUTE_CODE = 'ORAL';
                INSERT INTO PRESCRIPTION_MEDICATIONS (PRESCRIPTION_ID, MEDICATION_ID, DOSAGE, FREQUENCY, DURATION_DAYS, ADMINISTRATION_ROUTE_ID, QUANTITY, INSTRUCTIONS, AI_SUGGESTED)
                VALUES (v_prescription_id, v_medication_id, '20mg', 'Una vez al día', 30, v_route_id, 30, 'Tomar por la noche', 0);

                
            WHEN 9 THEN
                -- Ansiedad
                INSERT INTO PRESCRIPTION_DIAGNOSES (PRESCRIPTION_ID, CIE10_CODE, IS_PRIMARY, NOTES)
                VALUES (v_prescription_id, 'J20', 1, 'Bronquitis aguda');
                
                -- Prescribe Clonazepam
                SELECT MEDICATION_ID INTO v_medication_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'N05BA02';
                SELECT ROUTE_ID INTO v_route_id FROM ADMINISTRATION_ROUTES WHERE ROUTE_CODE = 'ORAL';
                INSERT INTO PRESCRIPTION_MEDICATIONS (PRESCRIPTION_ID, MEDICATION_ID, DOSAGE, FREQUENCY, DURATION_DAYS, ADMINISTRATION_ROUTE_ID, QUANTITY, INSTRUCTIONS, AI_SUGGESTED)
                VALUES (v_prescription_id, v_medication_id, '0.5mg', 'Dos veces al día', 15, v_route_id, 30, 'No conducir ni operar maquinaria', 0);
                
            ELSE
                -- Cefalea
                INSERT INTO PRESCRIPTION_DIAGNOSES (PRESCRIPTION_ID, CIE10_CODE, IS_PRIMARY, NOTES)
                VALUES (v_prescription_id, 'K30', 1, 'Dispepsia');
                
                -- Prescribe Paracetamol
                SELECT MEDICATION_ID INTO v_medication_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'N02BE01';
                SELECT ROUTE_ID INTO v_route_id FROM ADMINISTRATION_ROUTES WHERE ROUTE_CODE = 'ORAL';
                INSERT INTO PRESCRIPTION_MEDICATIONS (PRESCRIPTION_ID, MEDICATION_ID, DOSAGE, FREQUENCY, DURATION_DAYS, ADMINISTRATION_ROUTE_ID, QUANTITY, INSTRUCTIONS, AI_SUGGESTED)
                VALUES (v_prescription_id, v_medication_id, '500mg', 'Cada 6 horas según necesidad', 5, v_route_id, 20, 'No exceder 4 gramos al día', 0);
        END CASE;
        
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('Inserted ' || v_counter || ' prescriptions with diagnoses and medications');
    COMMIT;
END;
/

PROMPT 
PROMPT ========================================
PROMPT PRESCRIPTIONS Data Completed!
PROMPT ========================================

-- Verify data
SELECT COUNT(*) as TOTAL_PRESCRIPTIONS FROM PRESCRIPTIONS;
SELECT COUNT(*) as TOTAL_DIAGNOSES FROM PRESCRIPTION_DIAGNOSES;
SELECT COUNT(*) as TOTAL_MEDICATIONS FROM PRESCRIPTION_MEDICATIONS;

SELECT 'Prescriptions by status:' as INFO FROM DUAL;
SELECT STATUS, COUNT(*) as COUNT
FROM PRESCRIPTIONS
GROUP BY STATUS;

SELECT 'Sample prescriptions with CIE-10 codes:' as INFO FROM DUAL;
SELECT p.PRESCRIPTION_NUMBER,
       pat.FIRST_NAME || ' ' || pat.LAST_NAME as PATIENT,
       pd.CIE10_CODE,
       c.DESCRIPTION_ES as DIAGNOSIS
FROM PRESCRIPTIONS p
JOIN PATIENTS pat ON p.PATIENT_ID = pat.PATIENT_ID
JOIN PRESCRIPTION_DIAGNOSES pd ON p.PRESCRIPTION_ID = pd.PRESCRIPTION_ID
JOIN CIE10_CATALOG c ON pd.CIE10_CODE = c.CODE
FETCH FIRST 5 ROWS ONLY;

SELECT 'Sample prescriptions with ATC medications:' as INFO FROM DUAL;
SELECT p.PRESCRIPTION_NUMBER,
       m.MEDICATION_CODE as ATC_CODE,
       m.GENERIC_NAME,
       pm.DOSAGE,
       pm.FREQUENCY
FROM PRESCRIPTIONS p
JOIN PRESCRIPTION_MEDICATIONS pm ON p.PRESCRIPTION_ID = pm.PRESCRIPTION_ID
JOIN MEDICATIONS m ON pm.MEDICATION_ID = m.MEDICATION_ID
FETCH FIRST 5 ROWS ONLY;

PROMPT ========================================

EXIT;
