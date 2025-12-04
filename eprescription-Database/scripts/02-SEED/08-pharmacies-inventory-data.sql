-- =====================================================
-- Script: 08-pharmacies-inventory-data.sql
-- Description: Seed data for PHARMACIES and INVENTORY tables
-- Contains 20 pharmacies with inventory for medications
-- Follows DATABASE-SCHEMA-REFERENCE.md structure
-- Uses proper UTF-8 encoding for Spanish characters
-- =====================================================

-- Configure session for UTF-8
ALTER SESSION SET NLS_LANGUAGE='SPANISH';
ALTER SESSION SET NLS_TERRITORY='COSTA RICA';

SET DEFINE OFF;
SET SERVEROUTPUT ON;

PROMPT ========================================
PROMPT Inserting PHARMACIES and INVENTORY data
PROMPT ========================================

-- Clear existing data
DELETE FROM INVENTORY;
DELETE FROM PHARMACIES;

PROMPT Inserting 20 pharmacies across Costa Rica...

DECLARE
    v_pharmacy_id RAW(16);
    v_address_id RAW(16);
    v_medication_id RAW(16);
    v_counter NUMBER := 0;
    v_inv_counter NUMBER := 0;
BEGIN
    -- Get addresses for pharmacies (use remaining addresses after medical centers)
    FOR addr IN (
        SELECT ADDRESS_ID, CITY, STATE_PROVINCE 
        FROM ADDRESSES 
        WHERE ADDRESS_ID NOT IN (SELECT ADDRESS_ID FROM MEDICAL_CENTERS WHERE ADDRESS_ID IS NOT NULL)
        AND ROWNUM <= 20
        ORDER BY CREATED_AT
    ) LOOP
        v_counter := v_counter + 1;
        
        INSERT INTO PHARMACIES (
            PHARMACY_NAME,
            LICENSE_NUMBER,
            ADDRESS_ID,
            PHONE,
            EMAIL,
            IS_ACTIVE,
            CITY
        ) VALUES (
            CASE v_counter
                WHEN 1 THEN 'Farmacia Fischel'

                WHEN 2 THEN 'Farmacia Clínica Católica'
                WHEN 3 THEN 'Farmacia San Jorge'
                WHEN 4 THEN 'Farmacia Sucre'
                WHEN 5 THEN 'Farmacia La Bomba'
                WHEN 6 THEN 'Farmacia Chavarría'
                WHEN 7 THEN 'Farmacia Farmacenter'
                WHEN 8 THEN 'Farmacia Farmacia 2000'
                WHEN 9 THEN 'Farmacia Farmanova'
                WHEN 10 THEN 'Farmacia Farmacoop'
                WHEN 11 THEN 'Farmacia Farmacia Económica'
                WHEN 12 THEN 'Farmacia San Rafael'
                WHEN 13 THEN 'Farmacia Santa Lucía'
                WHEN 14 THEN 'Farmacia Farmacia Moderna'
                WHEN 15 THEN 'Farmacia Farmacia Central'
                WHEN 16 THEN 'Farmacia Farmacia del Pueblo'
                WHEN 17 THEN 'Farmacia Farmacia Salud'
                WHEN 18 THEN 'Farmacia Farmacia Vida'
                WHEN 19 THEN 'Farmacia Farmacia Bienestar'
                ELSE 'Farmacia Farmacia Comunitaria'
            END,
            'FARM-CR-' || TO_CHAR(2020 + MOD(v_counter, 5)) || '-' || LPAD(v_counter, 4, '0'),
            addr.ADDRESS_ID,
            '+506-' || (2200 + v_counter) || '-' || (1000 + v_counter),
            'farmacia' || v_counter || '@farmacia.cr',
            1,
            addr.CITY
        ) RETURNING PHARMACY_ID INTO v_pharmacy_id;
        
        -- Add inventory for each pharmacy (5-10 random medications per pharmacy)
        FOR med IN (
            SELECT MEDICATION_ID, MEDICATION_CODE, GENERIC_NAME
            FROM MEDICATIONS
            WHERE MOD(v_counter + ROWNUM, 4) = 0
            AND ROWNUM <= 8
        ) LOOP
            v_inv_counter := v_inv_counter + 1;
            
            INSERT INTO INVENTORY (
                PHARMACY_ID,
                MEDICATION_ID,
                BATCH_NUMBER,
                QUANTITY_AVAILABLE,
                EXPIRATION_DATE,
                UNIT_COST
            ) VALUES (
                v_pharmacy_id,
                med.MEDICATION_ID,
                'LOTE-' || TO_CHAR(SYSDATE, 'YYYY') || '-' || LPAD(v_inv_counter, 6, '0'),
                ROUND(DBMS_RANDOM.VALUE(50, 500), 0),
                ADD_MONTHS(SYSDATE, ROUND(DBMS_RANDOM.VALUE(6, 36))),
                ROUND(DBMS_RANDOM.VALUE(500, 15000), 2)
            );
        END LOOP;
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('Inserted ' || v_counter || ' pharmacies');
    DBMS_OUTPUT.PUT_LINE('Inserted ' || v_inv_counter || ' inventory items');
    
    COMMIT;
END;
/

PROMPT 
PROMPT ========================================
PROMPT PHARMACIES and INVENTORY Data Completed!
PROMPT ========================================

-- Verify data
SELECT COUNT(*) as TOTAL_PHARMACIES FROM PHARMACIES;
SELECT COUNT(*) as TOTAL_INVENTORY_ITEMS FROM INVENTORY;

SELECT 'Sample pharmacies:' as INFO FROM DUAL;
SELECT PHARMACY_NAME, LICENSE_NUMBER, CITY, PHONE
FROM PHARMACIES
FETCH FIRST 5 ROWS ONLY;

SELECT 'Inventory summary by pharmacy:' as INFO FROM DUAL;
SELECT p.PHARMACY_NAME,
       COUNT(i.INVENTORY_ID) as MEDICATIONS_COUNT,
       SUM(i.QUANTITY_AVAILABLE) as TOTAL_UNITS
FROM PHARMACIES p
LEFT JOIN INVENTORY i ON p.PHARMACY_ID = i.PHARMACY_ID
GROUP BY p.PHARMACY_NAME
ORDER BY MEDICATIONS_COUNT DESC
FETCH FIRST 5 ROWS ONLY;

SELECT 'Sample inventory with medications:' as INFO FROM DUAL;
SELECT p.PHARMACY_NAME,
       m.GENERIC_NAME,
       i.BATCH_NUMBER,
       i.QUANTITY_AVAILABLE,
       i.EXPIRATION_DATE
FROM INVENTORY i
JOIN PHARMACIES p ON i.PHARMACY_ID = p.PHARMACY_ID
JOIN MEDICATIONS m ON i.MEDICATION_ID = m.MEDICATION_ID
FETCH FIRST 5 ROWS ONLY;

PROMPT ========================================

EXIT;
