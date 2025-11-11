-- =====================================================
-- Script: 06-prescriptions.sql
-- Descripción: Crear tablas de prescripciones
-- Autor: ePrescription Team
-- Fecha: 2024-11-11
-- =====================================================

CONNECT eprescription_user/EprescriptionPass123!@localhost:1521/XEPDB1

-- Crear tabla PRESCRIPTIONS
CREATE TABLE PRESCRIPTIONS (
    prescription_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    prescription_number VARCHAR2(50) UNIQUE NOT NULL,
    patient_id RAW(16) NOT NULL,
    doctor_id RAW(16) NOT NULL,
    medical_center_id RAW(16) NOT NULL,
    prescription_date TIMESTAMP NOT NULL,
    expiration_date TIMESTAMP NOT NULL,
    status VARCHAR2(20) DEFAULT 'draft' NOT NULL CHECK (status IN ('draft', 'active', 'dispensed', 'expired', 'cancelled')),
    notes CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES PATIENTS(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES DOCTORS(doctor_id),
    FOREIGN KEY (medical_center_id) REFERENCES MEDICAL_CENTERS(center_id),
    CONSTRAINT chk_prescription_dates CHECK (expiration_date > prescription_date)
);

-- Crear tabla PRESCRIPTION_DIAGNOSES (4NF - múltiples diagnósticos por prescripción)
CREATE TABLE PRESCRIPTION_DIAGNOSES (
    prescription_diagnosis_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    prescription_id RAW(16) NOT NULL,
    cie10_id RAW(16) NOT NULL,
    diagnosis_code VARCHAR2(10) NOT NULL,
    diagnosis_description VARCHAR2(500) NOT NULL,
    is_primary NUMBER(1) DEFAULT 0 CHECK (is_primary IN (0, 1)),
    ai_suggested NUMBER(1) DEFAULT 0 CHECK (ai_suggested IN (0, 1)),
    ai_confidence_score NUMBER(5,4) CHECK (ai_confidence_score BETWEEN 0 AND 1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES PRESCRIPTIONS(prescription_id) ON DELETE CASCADE,
    FOREIGN KEY (cie10_id) REFERENCES CIE10_CATALOG(cie10_id)
);

-- Índices para PRESCRIPTIONS
CREATE INDEX idx_prescription_number ON PRESCRIPTIONS(prescription_number);
CREATE INDEX idx_prescription_patient ON PRESCRIPTIONS(patient_id);
CREATE INDEX idx_prescription_doctor ON PRESCRIPTIONS(doctor_id);
CREATE INDEX idx_prescription_center ON PRESCRIPTIONS(medical_center_id);
CREATE INDEX idx_prescription_date ON PRESCRIPTIONS(prescription_date);
CREATE INDEX idx_prescription_status ON PRESCRIPTIONS(status);
CREATE INDEX idx_prescription_expiration ON PRESCRIPTIONS(expiration_date);

-- Índices para PRESCRIPTION_DIAGNOSES
CREATE INDEX idx_diagnosis_prescription ON PRESCRIPTION_DIAGNOSES(prescription_id);
CREATE INDEX idx_diagnosis_cie10 ON PRESCRIPTION_DIAGNOSES(cie10_id);
CREATE INDEX idx_diagnosis_code ON PRESCRIPTION_DIAGNOSES(diagnosis_code);
CREATE INDEX idx_diagnosis_primary ON PRESCRIPTION_DIAGNOSES(prescription_id, is_primary);
CREATE INDEX idx_diagnosis_ai ON PRESCRIPTION_DIAGNOSES(ai_suggested);

-- Comentarios
COMMENT ON TABLE PRESCRIPTIONS IS 'Prescripciones médicas';
COMMENT ON TABLE PRESCRIPTION_DIAGNOSES IS 'Diagnósticos por prescripción (4NF - múltiples diagnósticos)';
COMMENT ON COLUMN PRESCRIPTIONS.prescription_number IS 'Número único de prescripción';
COMMENT ON COLUMN PRESCRIPTIONS.status IS 'Estado: draft, active, dispensed, expired, cancelled';
COMMENT ON COLUMN PRESCRIPTION_DIAGNOSES.diagnosis_code IS 'Código CIE-10 (desnormalizado para performance)';
COMMENT ON COLUMN PRESCRIPTION_DIAGNOSES.is_primary IS 'Indica si es el diagnóstico principal';
COMMENT ON COLUMN PRESCRIPTION_DIAGNOSES.ai_suggested IS 'Indica si fue sugerido por IA';
COMMENT ON COLUMN PRESCRIPTION_DIAGNOSES.ai_confidence_score IS 'Score de confianza de la IA (0-1)';

COMMIT;

EXIT;
