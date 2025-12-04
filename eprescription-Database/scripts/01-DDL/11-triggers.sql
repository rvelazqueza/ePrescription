-- =====================================================
-- Script: 11-triggers.sql
-- Descripción: Crear triggers para auditoría e inmutabilidad
-- Autor: ePrescription Team
-- Fecha: 2024-11-11
-- =====================================================

CONNECT eprescription_user/EprescriptionPass123!@localhost:1521/XEPDB1

-- =====================================================
-- TRIGGER: Prevenir modificación de AUDIT_LOGS (INMUTABLE)
-- =====================================================
CREATE OR REPLACE TRIGGER trg_audit_immutable
BEFORE UPDATE OR DELETE ON AUDIT_LOGS
FOR EACH ROW
BEGIN
    RAISE_APPLICATION_ERROR(-20001, 'AUDIT_LOGS es inmutable. No se permiten UPDATE ni DELETE para cumplimiento FDA 21 CFR Part 11');
END;
/

-- =====================================================
-- TRIGGER: Prevenir modificación de AI_ANALYSIS_LOGS (INMUTABLE)
-- =====================================================
CREATE OR REPLACE TRIGGER trg_ai_logs_immutable
BEFORE UPDATE OR DELETE ON AI_ANALYSIS_LOGS
FOR EACH ROW
BEGIN
    RAISE_APPLICATION_ERROR(-20002, 'AI_ANALYSIS_LOGS es inmutable. No se permiten UPDATE ni DELETE para trazabilidad');
END;
/

-- =====================================================
-- TRIGGER: Actualizar updated_at automáticamente
-- =====================================================
CREATE OR REPLACE TRIGGER trg_patients_update_timestamp
BEFORE UPDATE ON PATIENTS
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_doctors_update_timestamp
BEFORE UPDATE ON DOCTORS
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_prescriptions_update_timestamp
BEFORE UPDATE ON PRESCRIPTIONS
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_medications_update_timestamp
BEFORE UPDATE ON MEDICATIONS
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_pharmacies_update_timestamp
BEFORE UPDATE ON PHARMACIES
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_inventory_update_timestamp
BEFORE UPDATE ON INVENTORY
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_dispensations_update_timestamp
BEFORE UPDATE ON DISPENSATIONS
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_users_update_timestamp
BEFORE UPDATE ON USERS
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_medical_centers_update_timestamp
BEFORE UPDATE ON MEDICAL_CENTERS
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_addresses_update_timestamp
BEFORE UPDATE ON ADDRESSES
FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

-- =====================================================
-- TRIGGER: Validar fechas de prescripción
-- =====================================================
CREATE OR REPLACE TRIGGER trg_validate_prescription_dates
BEFORE INSERT OR UPDATE ON PRESCRIPTIONS
FOR EACH ROW
BEGIN
    -- Validar que la fecha de expiración sea posterior a la fecha de prescripción
    IF :NEW.expiration_date <= :NEW.prescription_date THEN
        RAISE_APPLICATION_ERROR(-20003, 'La fecha de expiración debe ser posterior a la fecha de prescripción');
    END IF;
    
    -- Validar que la fecha de prescripción no sea futura
    IF :NEW.prescription_date > CURRENT_TIMESTAMP THEN
        RAISE_APPLICATION_ERROR(-20004, 'La fecha de prescripción no puede ser futura');
    END IF;
END;
/

-- =====================================================
-- TRIGGER: Generar número de prescripción automáticamente
-- =====================================================
CREATE SEQUENCE seq_prescription_number START WITH 1000 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER trg_generate_prescription_number
BEFORE INSERT ON PRESCRIPTIONS
FOR EACH ROW
WHEN (NEW.prescription_number IS NULL)
BEGIN
    :NEW.prescription_number := 'RX-' || TO_CHAR(SYSDATE, 'YYYYMMDD') || '-' || LPAD(seq_prescription_number.NEXTVAL, 6, '0');
END;
/

-- =====================================================
-- TRIGGER: Actualizar inventario al dispensar
-- =====================================================
CREATE OR REPLACE TRIGGER trg_update_inventory_on_dispense
AFTER INSERT ON DISPENSATION_ITEMS
FOR EACH ROW
BEGIN
    -- Reducir cantidad en inventario
    UPDATE INVENTORY
    SET quantity_available = quantity_available - :NEW.quantity_dispensed,
        updated_at = CURRENT_TIMESTAMP
    WHERE inventory_id = :NEW.inventory_id;
    
    -- Verificar que no quede negativo
    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20005, 'Inventario no encontrado');
    END IF;
END;
/

-- Comentarios
COMMENT ON TRIGGER trg_audit_immutable IS 'Previene modificación de AUDIT_LOGS (FDA 21 CFR Part 11)';
COMMENT ON TRIGGER trg_ai_logs_immutable IS 'Previene modificación de AI_ANALYSIS_LOGS (trazabilidad)';
COMMENT ON TRIGGER trg_validate_prescription_dates IS 'Valida fechas de prescripción';
COMMENT ON TRIGGER trg_generate_prescription_number IS 'Genera número de prescripción automáticamente';
COMMENT ON TRIGGER trg_update_inventory_on_dispense IS 'Actualiza inventario al dispensar medicamentos';

COMMIT;

-- Verificar triggers creados
SELECT trigger_name, table_name, status 
FROM user_triggers 
WHERE table_name IN ('AUDIT_LOGS', 'AI_ANALYSIS_LOGS', 'PRESCRIPTIONS', 'INVENTORY')
ORDER BY table_name, trigger_name;

EXIT;
