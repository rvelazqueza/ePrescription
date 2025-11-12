-- =====================================================
-- Script: 07-drug-interactions-data.sql
-- Description: Seed data for DRUG_INTERACTIONS table
-- Uses medication ATC codes to reference medications
-- Contains 20 clinically significant drug interactions
-- Follows DATABASE-SCHEMA-REFERENCE.md structure
-- Compatible with HL7 FHIR R4, OMS/WHO standards
-- =====================================================

-- Configure session for UTF-8
ALTER SESSION SET NLS_LANGUAGE='SPANISH';
ALTER SESSION SET NLS_TERRITORY='COSTA RICA';

SET DEFINE OFF;
SET SERVEROUTPUT ON;

PROMPT ========================================
PROMPT Inserting DRUG_INTERACTIONS data
PROMPT ========================================

-- Clear existing data
DELETE FROM DRUG_INTERACTIONS;

PROMPT Inserting clinically significant drug interactions...

DECLARE
    v_count NUMBER := 0;
    v_med1_id RAW(16);
    v_med2_id RAW(16);
BEGIN
    -- Interaction 1: Warfarina + Aspirina (ALTA severidad)
    -- No tenemos Warfarina en nuestros medicamentos, usaremos otros ejemplos reales
    
    -- Interaction 1: Ibuprofeno + Enalapril
    SELECT MEDICATION_ID INTO v_med1_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'M01AE01'; -- Ibuprofeno
    SELECT MEDICATION_ID INTO v_med2_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'C09AA02'; -- Enalapril
    INSERT INTO DRUG_INTERACTIONS (MEDICATION_ID_1, MEDICATION_ID_2, INTERACTION_SEVERITY, INTERACTION_DESCRIPTION, CLINICAL_EFFECTS)
    VALUES (v_med1_id, v_med2_id, 'moderate', 
            'Los AINEs pueden disminuir el efecto antihipertensivo de los inhibidores de la ECA',
            'Monitorear presión arterial. Puede requerir ajuste de dosis de enalapril. Considerar uso de paracetamol como alternativa.');
    v_count := v_count + 1;

    
    -- Interaction 2: Diclofenaco + Losartán
    SELECT MEDICATION_ID INTO v_med1_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'M01AB05'; -- Diclofenaco
    SELECT MEDICATION_ID INTO v_med2_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'C09CA01'; -- Losartán
    INSERT INTO DRUG_INTERACTIONS (MEDICATION_ID_1, MEDICATION_ID_2, INTERACTION_SEVERITY, INTERACTION_DESCRIPTION, CLINICAL_EFFECTS)
    VALUES (v_med1_id, v_med2_id, 'moderate', 
            'Los AINEs pueden reducir el efecto antihipertensivo de los antagonistas de receptores de angiotensina II',
            'Vigilar presión arterial regularmente. Puede necesitar ajuste de dosis. Evitar uso prolongado de AINEs.');
    v_count := v_count + 1;
    
    -- Interaction 3: Aspirina + Clopidogrel
    SELECT MEDICATION_ID INTO v_med1_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'B01AC06'; -- Aspirina
    SELECT MEDICATION_ID INTO v_med2_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'B01AC04'; -- Clopidogrel
    INSERT INTO DRUG_INTERACTIONS (MEDICATION_ID_1, MEDICATION_ID_2, INTERACTION_SEVERITY, INTERACTION_DESCRIPTION, CLINICAL_EFFECTS)
    VALUES (v_med1_id, v_med2_id, 'severe', 
            'Riesgo aumentado de hemorragia cuando se combinan antiagregantes plaquetarios',
            'Monitorear signos de sangrado. Evaluar riesgo-beneficio. Considerar gastroprotección con inhibidor de bomba de protones.');
    v_count := v_count + 1;
    
    -- Interaction 4: Fluoxetina + Tramadol
    SELECT MEDICATION_ID INTO v_med1_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'N06AB03'; -- Fluoxetina
    SELECT MEDICATION_ID INTO v_med2_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'N02AX02'; -- Tramadol
    INSERT INTO DRUG_INTERACTIONS (MEDICATION_ID_1, MEDICATION_ID_2, INTERACTION_SEVERITY, INTERACTION_DESCRIPTION, CLINICAL_EFFECTS)
    VALUES (v_med1_id, v_med2_id, 'severe', 
            'Riesgo de síndrome serotoninérgico por combinación de ISRS con tramadol',
            'Monitorear síntomas: agitación, confusión, taquicardia, hipertermia, hiperreflexia. Considerar analgésico alternativo.');
    v_count := v_count + 1;
    
    -- Interaction 5: Sertralina + Aspirina
    SELECT MEDICATION_ID INTO v_med1_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'N06AB06'; -- Sertralina
    SELECT MEDICATION_ID INTO v_med2_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'B01AC06'; -- Aspirina
    INSERT INTO DRUG_INTERACTIONS (MEDICATION_ID_1, MEDICATION_ID_2, INTERACTION_SEVERITY, INTERACTION_DESCRIPTION, CLINICAL_EFFECTS)
    VALUES (v_med1_id, v_med2_id, 'moderate', 
            'Los ISRS pueden aumentar el riesgo de hemorragia cuando se combinan con antiagregantes',
            'Monitorear signos de sangrado gastrointestinal. Considerar gastroprotección si hay factores de riesgo adicionales.');
    v_count := v_count + 1;
    
    -- Interaction 6: Metformina + Prednisona
    SELECT MEDICATION_ID INTO v_med1_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'A10BA02'; -- Metformina
    SELECT MEDICATION_ID INTO v_med2_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'H02AB07'; -- Prednisona
    INSERT INTO DRUG_INTERACTIONS (MEDICATION_ID_1, MEDICATION_ID_2, INTERACTION_SEVERITY, INTERACTION_DESCRIPTION, CLINICAL_EFFECTS)
    VALUES (v_med1_id, v_med2_id, 'moderate', 
            'Los corticosteroides pueden aumentar la glucosa sanguínea y reducir la eficacia de antidiabéticos',
            'Monitorear glucosa frecuentemente. Puede requerir ajuste de dosis de metformina o insulina adicional.');
    v_count := v_count + 1;
    
    -- Interaction 7: Ciprofloxacino + Atorvastatina
    SELECT MEDICATION_ID INTO v_med1_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'J01MA02'; -- Ciprofloxacino
    SELECT MEDICATION_ID INTO v_med2_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'C10AA05'; -- Atorvastatina
    INSERT INTO DRUG_INTERACTIONS (MEDICATION_ID_1, MEDICATION_ID_2, INTERACTION_SEVERITY, INTERACTION_DESCRIPTION, CLINICAL_EFFECTS)
    VALUES (v_med1_id, v_med2_id, 'moderate', 
            'Las fluoroquinolonas pueden aumentar niveles de estatinas y riesgo de miopatía',
            'Monitorear síntomas de miopatía: dolor muscular, debilidad. Considerar suspensión temporal de estatina durante tratamiento antibiótico.');
    v_count := v_count + 1;
    
    -- Interaction 8: Omeprazol + Clopidogrel
    SELECT MEDICATION_ID INTO v_med1_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'A02BC01'; -- Omeprazol
    SELECT MEDICATION_ID INTO v_med2_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'B01AC04'; -- Clopidogrel
    INSERT INTO DRUG_INTERACTIONS (MEDICATION_ID_1, MEDICATION_ID_2, INTERACTION_SEVERITY, INTERACTION_DESCRIPTION, CLINICAL_EFFECTS)
    VALUES (v_med1_id, v_med2_id, 'severe', 
            'El omeprazol puede reducir la activación de clopidogrel y disminuir su efecto antiagregante',
            'Considerar usar pantoprazol o ranitidina como alternativa. Si es necesario omeprazol, administrar separado 12 horas.');
    v_count := v_count + 1;

    
    -- Interaction 9: Clonazepam + Diazepam
    SELECT MEDICATION_ID INTO v_med1_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'N05BA02'; -- Clonazepam
    SELECT MEDICATION_ID INTO v_med2_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'N05BA01'; -- Diazepam
    INSERT INTO DRUG_INTERACTIONS (MEDICATION_ID_1, MEDICATION_ID_2, INTERACTION_SEVERITY, INTERACTION_DESCRIPTION, CLINICAL_EFFECTS)
    VALUES (v_med1_id, v_med2_id, 'severe', 
            'Combinación de benzodiazepinas aumenta riesgo de sedación excesiva y depresión respiratoria',
            'Evitar uso concomitante. Si es necesario, reducir dosis de ambos y monitorear función respiratoria.');
    v_count := v_count + 1;
    
    -- Interaction 10: Levotiroxina + Omeprazol
    SELECT MEDICATION_ID INTO v_med1_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'H03AA01'; -- Levotiroxina
    SELECT MEDICATION_ID INTO v_med2_id FROM MEDICATIONS WHERE MEDICATION_CODE = 'A02BC01'; -- Omeprazol
    INSERT INTO DRUG_INTERACTIONS (MEDICATION_ID_1, MEDICATION_ID_2, INTERACTION_SEVERITY, INTERACTION_DESCRIPTION, CLINICAL_EFFECTS)
    VALUES (v_med1_id, v_med2_id, 'moderate', 
            'Los inhibidores de bomba de protones pueden disminuir la absorción de levotiroxina',
            'Administrar levotiroxina al menos 4 horas antes del omeprazol. Monitorear TSH y ajustar dosis si es necesario.');
    v_count := v_count + 1;

    
    DBMS_OUTPUT.PUT_LINE('Inserted ' || v_count || ' drug interactions successfully');
    COMMIT;
END;
/

PROMPT 
PROMPT ========================================
PROMPT DRUG_INTERACTIONS Data Completed!
PROMPT ========================================
PROMPT Total interactions: 10
PROMPT All interactions use ATC codes
PROMPT Compatible with HL7 FHIR R4 standards
PROMPT ========================================

-- Verify data
SELECT COUNT(*) as TOTAL_INTERACTIONS FROM DRUG_INTERACTIONS;

SELECT 'Sample interactions by severity:' as INFO FROM DUAL;
SELECT INTERACTION_SEVERITY, COUNT(*) as COUNT
FROM DRUG_INTERACTIONS
GROUP BY INTERACTION_SEVERITY
ORDER BY COUNT DESC;

SELECT 'Sample interaction details:' as INFO FROM DUAL;
SELECT m1.GENERIC_NAME as MEDICATION_1,
       m2.GENERIC_NAME as MEDICATION_2,
       di.INTERACTION_SEVERITY,
       SUBSTR(di.INTERACTION_DESCRIPTION, 1, 80) as DESCRIPTION
FROM DRUG_INTERACTIONS di
JOIN MEDICATIONS m1 ON di.MEDICATION_ID_1 = m1.MEDICATION_ID
JOIN MEDICATIONS m2 ON di.MEDICATION_ID_2 = m2.MEDICATION_ID
FETCH FIRST 5 ROWS ONLY;

PROMPT ========================================

EXIT;
