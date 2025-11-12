-- =====================================================
-- Script: 05-medical-centers-doctors-data.sql
-- Description: Seed data for MEDICAL_CENTERS, DOCTORS, and DOCTOR_MEDICAL_CENTERS tables
-- Contains 15 medical centers and 30 doctors with specialty assignments
-- Follows DATABASE-SCHEMA-REFERENCE.md structure
-- Uses PL/SQL to maintain referential integrity with ADDRESSES and SPECIALTIES
-- =====================================================

-- Configure session for UTF-8
ALTER SESSION SET NLS_LANGUAGE='SPANISH';
ALTER SESSION SET NLS_TERRITORY='COSTA RICA';

SET DEFINE OFF;
SET SERVEROUTPUT ON;

PROMPT ========================================
PROMPT Inserting MEDICAL_CENTERS and DOCTORS
PROMPT ========================================

-- Clear existing data
DELETE FROM DOCTOR_MEDICAL_CENTERS;
DELETE FROM DOCTORS;
DELETE FROM MEDICAL_CENTERS;

PROMPT Inserting 15 medical centers...

DECLARE
  v_center_id RAW(16);
  v_address_id RAW(16);
  v_counter NUMBER := 0;
BEGIN
  -- Get first 15 addresses for medical centers
  FOR addr IN (SELECT ADDRESS_ID FROM ADDRESSES WHERE ROWNUM <= 15 ORDER BY CREATED_AT) LOOP
    v_counter := v_counter + 1;
    
    INSERT INTO MEDICAL_CENTERS (
      CENTER_NAME, 
      CENTER_TYPE, 
      ADDRESS_ID, 
      PHONE, 
      EMAIL
    ) VALUES (
      CASE v_counter
        WHEN 1 THEN 'Hospital San Juan de Dios'
        WHEN 2 THEN 'Hospital Clínica Bíblica'
        WHEN 3 THEN 'Hospital CIMA'
        WHEN 4 THEN 'Hospital México'
        WHEN 5 THEN 'Clínica Católica'
        WHEN 6 THEN 'Hospital Calderón Guardia'
        WHEN 7 THEN 'Hospital San Rafael de Alajuela'
        WHEN 8 THEN 'Hospital Max Peralta Cartago'
        WHEN 9 THEN 'Hospital San Vicente de Paúl Heredia'
        WHEN 10 THEN 'Clínica Santa María'
        WHEN 11 THEN 'Centro Médico Momentum'
        WHEN 12 THEN 'Hospital Metropolitano'
        WHEN 13 THEN 'Clínica Integrada'
        WHEN 14 THEN 'Hospital Monseñor Sanabria'
        ELSE 'Centro Médico del Este'
      END,
      CASE WHEN v_counter <= 9 THEN 'hospital' WHEN v_counter <= 13 THEN 'clinic' ELSE 'health_center' END,
      addr.ADDRESS_ID,
      '+506-' || LPAD(TO_CHAR(2200 + v_counter), 4, '0') || '-' || LPAD(TO_CHAR(1000 + v_counter), 4, '0'),
      'contacto.centro' || v_counter || '@hospital.cr'
    );
  END LOOP;
  
  COMMIT;
  DBMS_OUTPUT.PUT_LINE('Inserted ' || v_counter || ' medical centers');
END;
/

PROMPT Inserting 30 doctors with specialty assignments...

DECLARE
  v_doctor_id RAW(16);
  v_specialty_id RAW(16);
  v_center_id RAW(16);
  v_counter NUMBER := 0;
  TYPE specialty_array IS TABLE OF RAW(16);
  v_specialties specialty_array;
  TYPE center_array IS TABLE OF RAW(16);
  v_centers center_array;
BEGIN
  -- Load all specialty IDs into array
  SELECT SPECIALTY_ID BULK COLLECT INTO v_specialties FROM SPECIALTIES ORDER BY SPECIALTY_CODE;
  
  -- Load all center IDs into array
  SELECT CENTER_ID BULK COLLECT INTO v_centers FROM MEDICAL_CENTERS ORDER BY CREATED_AT;
  
  -- Create 30 doctors
  FOR i IN 1..30 LOOP
    v_counter := v_counter + 1;
    
    -- Assign specialty (cycle through available specialties)
    v_specialty_id := v_specialties(MOD(i - 1, v_specialties.COUNT) + 1);
    
    INSERT INTO DOCTORS (
      IDENTIFICATION_NUMBER,
      FIRST_NAME,
      LAST_NAME,
      SPECIALTY_ID,
      LICENSE_NUMBER,
      EMAIL,
      PHONE
    ) VALUES (
      LPAD(TO_CHAR(100000 + i), 9, '0'),
      CASE MOD(i, 10)
        WHEN 0 THEN 'Roberto' WHEN 1 THEN 'Patricia' WHEN 2 THEN 'Carlos'
        WHEN 3 THEN 'María' WHEN 4 THEN 'Fernando' WHEN 5 THEN 'Ana'
        WHEN 6 THEN 'Luis' WHEN 7 THEN 'Carmen' WHEN 8 THEN 'Jorge'
        ELSE 'Laura'
      END,
      CASE MOD(i, 10)
        WHEN 0 THEN 'Andrade Morales' WHEN 1 THEN 'Salinas Vega' WHEN 2 THEN 'Mendoza Torres'
        WHEN 3 THEN 'Castillo Ruiz' WHEN 4 THEN 'Paredes Sánchez' WHEN 5 THEN 'Rojas Campos'
        WHEN 6 THEN 'Vargas Solís' WHEN 7 THEN 'Jiménez Castro' WHEN 8 THEN 'Mora Villalobos'
        ELSE 'Hernández Quesada'
      END,
      v_specialty_id,
      'MED-CR-' || LPAD(TO_CHAR(2020 + MOD(i, 5)), 4, '0') || '-' || LPAD(TO_CHAR(i), 4, '0'),
      'doctor' || i || '@hospital.cr',
      '+506-' || LPAD(TO_CHAR(8800 + i), 4, '0') || '-' || LPAD(TO_CHAR(1000 + i), 4, '0')
    )
    RETURNING DOCTOR_ID INTO v_doctor_id;
    
    -- Assign to primary medical center (cycle through centers)
    v_center_id := v_centers(MOD(i - 1, v_centers.COUNT) + 1);
    
    INSERT INTO DOCTOR_MEDICAL_CENTERS (
      DOCTOR_ID,
      MEDICAL_CENTER_ID,
      START_DATE,
      IS_ACTIVE
    ) VALUES (
      v_doctor_id,
      v_center_id,
      TO_DATE('2020-01-01', 'YYYY-MM-DD') + (i * 30),
      1
    );
    
    -- Some doctors work in 2 centers (every 3rd doctor)
    IF MOD(i, 3) = 0 AND v_centers.COUNT > 1 THEN
      v_center_id := v_centers(MOD(i, v_centers.COUNT) + 1);
      
      INSERT INTO DOCTOR_MEDICAL_CENTERS (
        DOCTOR_ID,
        MEDICAL_CENTER_ID,
        START_DATE,
        IS_ACTIVE
      ) VALUES (
        v_doctor_id,
        v_center_id,
        TO_DATE('2021-01-01', 'YYYY-MM-DD') + (i * 20),
        1
      );
    END IF;
  END LOOP;
  
  COMMIT;
  DBMS_OUTPUT.PUT_LINE('Inserted ' || v_counter || ' doctors with center assignments');
END;
/

PROMPT 
PROMPT ========================================
PROMPT MEDICAL_CENTERS and DOCTORS Completed!
PROMPT ========================================

-- Verify data
SELECT COUNT(*) as total_centers FROM MEDICAL_CENTERS;
SELECT COUNT(*) as total_doctors FROM DOCTORS;
SELECT COUNT(*) as total_assignments FROM DOCTOR_MEDICAL_CENTERS;

PROMPT 
PROMPT Sample medical centers:
SELECT CENTER_NAME, CENTER_TYPE, PHONE 
FROM MEDICAL_CENTERS 
WHERE ROWNUM <= 5
ORDER BY CENTER_NAME;

PROMPT 
PROMPT Sample doctors with specialties:
SELECT d.FIRST_NAME, d.LAST_NAME, d.LICENSE_NUMBER, s.SPECIALTY_NAME
FROM DOCTORS d
JOIN SPECIALTIES s ON d.SPECIALTY_ID = s.SPECIALTY_ID
WHERE ROWNUM <= 5
ORDER BY d.LICENSE_NUMBER;

PROMPT 
PROMPT Doctors per specialty:
SELECT s.SPECIALTY_NAME, COUNT(d.DOCTOR_ID) as doctor_count
FROM SPECIALTIES s
LEFT JOIN DOCTORS d ON s.SPECIALTY_ID = d.SPECIALTY_ID
GROUP BY s.SPECIALTY_NAME
HAVING COUNT(d.DOCTOR_ID) > 0
ORDER BY doctor_count DESC;

PROMPT ========================================

EXIT;
