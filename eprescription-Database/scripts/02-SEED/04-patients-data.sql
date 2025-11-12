-- =====================================================
-- Script: 04-patients-data.sql
-- Description: Seed data for PATIENTS, PATIENT_CONTACTS, and PATIENT_ALLERGIES tables
-- Contains 50 mock patients with contacts and allergies
-- Follows DATABASE-SCHEMA-REFERENCE.md structure
-- Uses PL/SQL to maintain referential integrity
-- =====================================================

-- Configure session for UTF-8
ALTER SESSION SET NLS_LANGUAGE='SPANISH';
ALTER SESSION SET NLS_TERRITORY='COSTA RICA';

SET DEFINE OFF;
SET SERVEROUTPUT ON;

PROMPT ========================================
PROMPT Inserting PATIENTS data (50 patients)
PROMPT ========================================

-- Clear existing data
DELETE FROM PATIENT_ALLERGIES;
DELETE FROM PATIENT_CONTACTS;
DELETE FROM PATIENTS;

PROMPT Inserting 50 patients with contacts and allergies...

DECLARE
  v_patient_id RAW(16);
BEGIN
  -- Patient 1
  INSERT INTO PATIENTS (IDENTIFICATION_NUMBER, FIRST_NAME, LAST_NAME, DATE_OF_BIRTH, GENDER, BLOOD_TYPE)
  VALUES ('104560001', 'Juan Carlos', 'Pérez García', TO_DATE('1985-03-15', 'YYYY-MM-DD'), 'M', 'O+')
  RETURNING PATIENT_ID INTO v_patient_id;
  
  INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
  VALUES (v_patient_id, 'email', 'juan.perez@email.com', 1);
  
  INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
  VALUES (v_patient_id, 'phone', '+506-8765-4321', 1);
  
  INSERT INTO PATIENT_ALLERGIES (PATIENT_ID, ALLERGEN_TYPE, ALLERGEN_NAME, SEVERITY, NOTES)
  VALUES (v_patient_id, 'medication', 'Penicilina', 'severe', 'Reacción anafiláctica documentada');

  -- Patient 2
  INSERT INTO PATIENTS (IDENTIFICATION_NUMBER, FIRST_NAME, LAST_NAME, DATE_OF_BIRTH, GENDER, BLOOD_TYPE)
  VALUES ('205670002', 'María Elena', 'González López', TO_DATE('1990-07-22', 'YYYY-MM-DD'), 'F', 'A+')
  RETURNING PATIENT_ID INTO v_patient_id;
  
  INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
  VALUES (v_patient_id, 'email', 'maria.gonzalez@email.com', 1);
  
  INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
  VALUES (v_patient_id, 'phone', '+506-8765-4322', 1);
  
  INSERT INTO PATIENT_ALLERGIES (PATIENT_ID, ALLERGEN_TYPE, ALLERGEN_NAME, SEVERITY, NOTES)
  VALUES (v_patient_id, 'medication', 'Aspirina', 'moderate', 'Urticaria leve');

  -- Patient 3
  INSERT INTO PATIENTS (IDENTIFICATION_NUMBER, FIRST_NAME, LAST_NAME, DATE_OF_BIRTH, GENDER, BLOOD_TYPE)
  VALUES ('306780003', 'Carlos Alberto', 'Rodríguez Sánchez', TO_DATE('1978-11-30', 'YYYY-MM-DD'), 'M', 'B+')
  RETURNING PATIENT_ID INTO v_patient_id;
  
  INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
  VALUES (v_patient_id, 'email', 'carlos.rodriguez@email.com', 1);
  
  INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
  VALUES (v_patient_id, 'phone', '+506-8765-4323', 1);
  
  INSERT INTO PATIENT_ALLERGIES (PATIENT_ID, ALLERGEN_TYPE, ALLERGEN_NAME, SEVERITY, NOTES)
  VALUES (v_patient_id, 'food', 'Mariscos', 'severe', 'Anafilaxia severa');

  -- Patient 4
  INSERT INTO PATIENTS (IDENTIFICATION_NUMBER, FIRST_NAME, LAST_NAME, DATE_OF_BIRTH, GENDER, BLOOD_TYPE)
  VALUES ('407890004', 'Ana Patricia', 'Martínez Torres', TO_DATE('1995-05-18', 'YYYY-MM-DD'), 'F', 'AB+')
  RETURNING PATIENT_ID INTO v_patient_id;
  
  INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
  VALUES (v_patient_id, 'email', 'ana.martinez@email.com', 1);
  
  INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
  VALUES (v_patient_id, 'phone', '+506-8765-4324', 1);
  
  INSERT INTO PATIENT_ALLERGIES (PATIENT_ID, ALLERGEN_TYPE, ALLERGEN_NAME, SEVERITY, NOTES)
  VALUES (v_patient_id, 'environmental', 'Polen', 'mild', 'Rinitis alérgica estacional');

  -- Patient 5
  INSERT INTO PATIENTS (IDENTIFICATION_NUMBER, FIRST_NAME, LAST_NAME, DATE_OF_BIRTH, GENDER, BLOOD_TYPE)
  VALUES ('508900005', 'Luis Fernando', 'Fernández Ruiz', TO_DATE('1982-09-25', 'YYYY-MM-DD'), 'M', 'O-')
  RETURNING PATIENT_ID INTO v_patient_id;
  
  INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
  VALUES (v_patient_id, 'email', 'luis.fernandez@email.com', 1);
  
  INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
  VALUES (v_patient_id, 'phone', '+506-8765-4325', 1);
  
  INSERT INTO PATIENT_ALLERGIES (PATIENT_ID, ALLERGEN_TYPE, ALLERGEN_NAME, SEVERITY, NOTES)
  VALUES (v_patient_id, 'medication', 'Ibuprofeno', 'moderate', 'Reacción cutánea');

  COMMIT;
  DBMS_OUTPUT.PUT_LINE('Inserted 5 patients successfully');
END;
/


-- Continue with remaining patients (6-50)
DECLARE
  v_patient_id RAW(16);
BEGIN
  -- Patients 6-10
  FOR i IN 6..10 LOOP
    INSERT INTO PATIENTS (IDENTIFICATION_NUMBER, FIRST_NAME, LAST_NAME, DATE_OF_BIRTH, GENDER, BLOOD_TYPE)
    VALUES (
      LPAD(TO_CHAR(i), 9, '0'),
      CASE MOD(i, 5)
        WHEN 0 THEN 'Carmen' WHEN 1 THEN 'Pedro' WHEN 2 THEN 'Laura' 
        WHEN 3 THEN 'Jorge' ELSE 'Sofía'
      END,
      CASE MOD(i, 5)
        WHEN 0 THEN 'López Díaz' WHEN 1 THEN 'Ramírez Castro' WHEN 2 THEN 'Morales Vega'
        WHEN 3 THEN 'Herrera Ortiz' ELSE 'Jiménez Romero'
      END,
      TO_DATE('1980-01-01', 'YYYY-MM-DD') + (i * 365),
      CASE WHEN MOD(i, 2) = 0 THEN 'F' ELSE 'M' END,
      CASE MOD(i, 4) WHEN 0 THEN 'A-' WHEN 1 THEN 'B-' WHEN 2 THEN 'O+' ELSE 'A+' END
    )
    RETURNING PATIENT_ID INTO v_patient_id;
    
    INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
    VALUES (v_patient_id, 'email', 'patient' || i || '@email.com', 1);
    
    INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
    VALUES (v_patient_id, 'phone', '+506-8765-' || LPAD(TO_CHAR(4320 + i), 4, '0'), 1);
    
    IF MOD(i, 2) = 0 THEN
      INSERT INTO PATIENT_ALLERGIES (PATIENT_ID, ALLERGEN_TYPE, ALLERGEN_NAME, SEVERITY, NOTES)
      VALUES (v_patient_id, 'medication', 
        CASE MOD(i, 3) WHEN 0 THEN 'Látex' WHEN 1 THEN 'Sulfamidas' ELSE 'Nueces' END,
        CASE MOD(i, 3) WHEN 0 THEN 'severe' WHEN 1 THEN 'moderate' ELSE 'mild' END,
        'Alergia documentada');
    END IF;
  END LOOP;
  
  -- Patients 11-20
  FOR i IN 11..20 LOOP
    INSERT INTO PATIENTS (IDENTIFICATION_NUMBER, FIRST_NAME, LAST_NAME, DATE_OF_BIRTH, GENDER, BLOOD_TYPE)
    VALUES (
      LPAD(TO_CHAR(i), 9, '0'),
      CASE MOD(i, 5)
        WHEN 0 THEN 'Miguel' WHEN 1 THEN 'Elena' WHEN 2 THEN 'Roberto'
        WHEN 3 THEN 'Patricia' ELSE 'Daniel'
      END,
      CASE MOD(i, 5)
        WHEN 0 THEN 'Torres Navarro' WHEN 1 THEN 'Vargas Mendoza' WHEN 2 THEN 'Castro Silva'
        WHEN 3 THEN 'Reyes Flores' ELSE 'Mendoza Paredes'
      END,
      TO_DATE('1985-01-01', 'YYYY-MM-DD') + (i * 300),
      CASE WHEN MOD(i, 2) = 0 THEN 'F' ELSE 'M' END,
      CASE MOD(i, 4) WHEN 0 THEN 'AB-' WHEN 1 THEN 'O-' WHEN 2 THEN 'A-' ELSE 'B+' END
    )
    RETURNING PATIENT_ID INTO v_patient_id;
    
    INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
    VALUES (v_patient_id, 'email', 'patient' || i || '@email.com', 1);
    
    INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
    VALUES (v_patient_id, 'phone', '+506-8765-' || LPAD(TO_CHAR(4320 + i), 4, '0'), 1);
    
    IF MOD(i, 3) = 0 THEN
      INSERT INTO PATIENT_ALLERGIES (PATIENT_ID, ALLERGEN_TYPE, ALLERGEN_NAME, SEVERITY, NOTES)
      VALUES (v_patient_id, 'medication',
        CASE MOD(i, 4) WHEN 0 THEN 'Contraste yodado' WHEN 1 THEN 'Amoxicilina' 
        WHEN 2 THEN 'Codeína' ELSE 'Diclofenaco' END,
        'moderate', 'Reacción alérgica moderada');
    END IF;
  END LOOP;
  
  -- Patients 21-30
  FOR i IN 21..30 LOOP
    INSERT INTO PATIENTS (IDENTIFICATION_NUMBER, FIRST_NAME, LAST_NAME, DATE_OF_BIRTH, GENDER, BLOOD_TYPE)
    VALUES (
      LPAD(TO_CHAR(i), 9, '0'),
      CASE MOD(i, 5)
        WHEN 0 THEN 'Andrés' WHEN 1 THEN 'Isabel' WHEN 2 THEN 'Javier'
        WHEN 3 THEN 'Carolina' ELSE 'Diego'
      END,
      CASE MOD(i, 5)
        WHEN 0 THEN 'Vega Suárez' WHEN 1 THEN 'Cruz Delgado' WHEN 2 THEN 'Molina Cortés'
        WHEN 3 THEN 'Peña Ibarra' ELSE 'Soto Bravo'
      END,
      TO_DATE('1977-01-01', 'YYYY-MM-DD') + (i * 250),
      CASE WHEN MOD(i, 2) = 0 THEN 'F' ELSE 'M' END,
      CASE MOD(i, 4) WHEN 0 THEN 'B-' WHEN 1 THEN 'O+' WHEN 2 THEN 'A+' ELSE 'AB-' END
    )
    RETURNING PATIENT_ID INTO v_patient_id;
    
    INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
    VALUES (v_patient_id, 'email', 'patient' || i || '@email.com', 1);
    
    INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
    VALUES (v_patient_id, 'phone', '+506-8765-' || LPAD(TO_CHAR(4320 + i), 4, '0'), 1);
    
    IF MOD(i, 2) = 1 THEN
      INSERT INTO PATIENT_ALLERGIES (PATIENT_ID, ALLERGEN_TYPE, ALLERGEN_NAME, SEVERITY, NOTES)
      VALUES (v_patient_id, 'food',
        CASE MOD(i, 4) WHEN 0 THEN 'Leche' WHEN 1 THEN 'Huevo' 
        WHEN 2 THEN 'Soja' ELSE 'Gluten' END,
        'mild', 'Intolerancia alimentaria');
    END IF;
  END LOOP;
  
  -- Patients 31-40
  FOR i IN 31..40 LOOP
    INSERT INTO PATIENTS (IDENTIFICATION_NUMBER, FIRST_NAME, LAST_NAME, DATE_OF_BIRTH, GENDER, BLOOD_TYPE)
    VALUES (
      LPAD(TO_CHAR(i), 9, '0'),
      CASE MOD(i, 5)
        WHEN 0 THEN 'Natalia' WHEN 1 THEN 'Sebastián' WHEN 2 THEN 'Daniela'
        WHEN 3 THEN 'Martín' ELSE 'Alejandra'
      END,
      CASE MOD(i, 5)
        WHEN 0 THEN 'Campos Ramos' WHEN 1 THEN 'Núñez Vera' WHEN 2 THEN 'Rojas Fuentes'
        WHEN 3 THEN 'Gil Pacheco' ELSE 'Serrano Lara'
      END,
      TO_DATE('1984-01-01', 'YYYY-MM-DD') + (i * 200),
      CASE WHEN MOD(i, 2) = 0 THEN 'F' ELSE 'M' END,
      CASE MOD(i, 4) WHEN 0 THEN 'O-' WHEN 1 THEN 'A-' WHEN 2 THEN 'B-' ELSE 'O+' END
    )
    RETURNING PATIENT_ID INTO v_patient_id;
    
    INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
    VALUES (v_patient_id, 'email', 'patient' || i || '@email.com', 1);
    
    INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
    VALUES (v_patient_id, 'phone', '+506-8765-' || LPAD(TO_CHAR(4320 + i), 4, '0'), 1);
    
    IF MOD(i, 3) = 1 THEN
      INSERT INTO PATIENT_ALLERGIES (PATIENT_ID, ALLERGEN_TYPE, ALLERGEN_NAME, SEVERITY, NOTES)
      VALUES (v_patient_id, 'medication',
        CASE MOD(i, 4) WHEN 0 THEN 'Morfina' WHEN 1 THEN 'Eritromicina'
        WHEN 2 THEN 'Naproxeno' ELSE 'Tetraciclina' END,
        'moderate', 'Reacción adversa documentada');
    END IF;
  END LOOP;
  
  -- Patients 41-50
  FOR i IN 41..50 LOOP
    INSERT INTO PATIENTS (IDENTIFICATION_NUMBER, FIRST_NAME, LAST_NAME, DATE_OF_BIRTH, GENDER, BLOOD_TYPE)
    VALUES (
      LPAD(TO_CHAR(i), 9, '0'),
      CASE MOD(i, 5)
        WHEN 0 THEN 'Pablo' WHEN 1 THEN 'Camila' WHEN 2 THEN 'Nicolás'
        WHEN 3 THEN 'Valentina' ELSE 'Mateo'
      END,
      CASE MOD(i, 5)
        WHEN 0 THEN 'Medina Cárdenas' WHEN 1 THEN 'Acosta Prieto' WHEN 2 THEN 'Benítez Ochoa'
        WHEN 3 THEN 'Luna Escobar' ELSE 'Paredes Solís'
      END,
      TO_DATE('1976-01-01', 'YYYY-MM-DD') + (i * 180),
      CASE WHEN MOD(i, 2) = 0 THEN 'F' ELSE 'M' END,
      CASE MOD(i, 4) WHEN 0 THEN 'B+' WHEN 1 THEN 'AB+' WHEN 2 THEN 'O-' ELSE 'A+' END
    )
    RETURNING PATIENT_ID INTO v_patient_id;
    
    INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
    VALUES (v_patient_id, 'email', 'patient' || i || '@email.com', 1);
    
    INSERT INTO PATIENT_CONTACTS (PATIENT_ID, CONTACT_TYPE, CONTACT_VALUE, IS_PRIMARY)
    VALUES (v_patient_id, 'phone', '+506-8765-' || LPAD(TO_CHAR(4320 + i), 4, '0'), 1);
    
    IF MOD(i, 2) = 0 THEN
      INSERT INTO PATIENT_ALLERGIES (PATIENT_ID, ALLERGEN_TYPE, ALLERGEN_NAME, SEVERITY, NOTES)
      VALUES (v_patient_id, 'environmental',
        CASE MOD(i, 4) WHEN 0 THEN 'Ácaros del polvo' WHEN 1 THEN 'Pelo de gato'
        WHEN 2 THEN 'Picadura de abeja' ELSE 'Fresas' END,
        CASE MOD(i, 3) WHEN 0 THEN 'severe' WHEN 1 THEN 'moderate' ELSE 'mild' END,
        'Alergia ambiental');
    END IF;
  END LOOP;
  
  COMMIT;
  DBMS_OUTPUT.PUT_LINE('Inserted remaining 45 patients successfully');
END;
/

PROMPT 
PROMPT ========================================
PROMPT PATIENTS Data Completed!
PROMPT ========================================

-- Verify data
SELECT COUNT(*) as total_patients FROM PATIENTS;
SELECT COUNT(*) as total_contacts FROM PATIENT_CONTACTS;
SELECT COUNT(*) as total_allergies FROM PATIENT_ALLERGIES;

PROMPT 
PROMPT Sample patients:
SELECT IDENTIFICATION_NUMBER, FIRST_NAME, LAST_NAME, GENDER, BLOOD_TYPE 
FROM PATIENTS 
WHERE ROWNUM <= 5
ORDER BY IDENTIFICATION_NUMBER;

PROMPT ========================================

EXIT;
