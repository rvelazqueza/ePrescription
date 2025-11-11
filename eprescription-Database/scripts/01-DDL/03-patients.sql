-- =====================================================
-- Script: 03-patients.sql
-- Descripción: Crear tablas de pacientes
-- Autor: ePrescription Team
-- Fecha: 2024-11-11
-- =====================================================

CONNECT eprescription_user/EprescriptionPass123!@localhost:1521/XEPDB1

-- Crear tabla PATIENTS
CREATE TABLE PATIENTS (
    patient_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    identification_number VARCHAR2(50) UNIQUE NOT NULL,
    first_name VARCHAR2(100) NOT NULL,
    last_name VARCHAR2(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR2(10) NOT NULL CHECK (gender IN ('M', 'F', 'Otro')),
    blood_type VARCHAR2(5) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_patient_age CHECK (date_of_birth < SYSDATE)
);

-- Crear tabla PATIENT_CONTACTS (4NF)
CREATE TABLE PATIENT_CONTACTS (
    contact_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    patient_id RAW(16) NOT NULL,
    contact_type VARCHAR2(20) NOT NULL CHECK (contact_type IN ('email', 'phone', 'mobile', 'address')),
    contact_value VARCHAR2(500) NOT NULL,
    is_primary NUMBER(1) DEFAULT 0 CHECK (is_primary IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES PATIENTS(patient_id) ON DELETE CASCADE
);

-- Crear tabla PATIENT_ALLERGIES
CREATE TABLE PATIENT_ALLERGIES (
    allergy_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    patient_id RAW(16) NOT NULL,
    allergen_type VARCHAR2(50) NOT NULL CHECK (allergen_type IN ('medication', 'food', 'environmental', 'other')),
    allergen_name VARCHAR2(200) NOT NULL,
    severity VARCHAR2(20) NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe', 'life-threatening')),
    notes CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES PATIENTS(patient_id) ON DELETE CASCADE
);

-- Índices para PATIENTS
CREATE INDEX idx_patient_identification ON PATIENTS(identification_number);
CREATE INDEX idx_patient_name ON PATIENTS(UPPER(last_name), UPPER(first_name));
CREATE INDEX idx_patient_dob ON PATIENTS(date_of_birth);

-- Índices para PATIENT_CONTACTS
CREATE INDEX idx_contact_patient ON PATIENT_CONTACTS(patient_id);
CREATE INDEX idx_contact_type ON PATIENT_CONTACTS(contact_type);
CREATE INDEX idx_contact_primary ON PATIENT_CONTACTS(patient_id, is_primary);

-- Índices para PATIENT_ALLERGIES
CREATE INDEX idx_allergy_patient ON PATIENT_ALLERGIES(patient_id);
CREATE INDEX idx_allergy_type ON PATIENT_ALLERGIES(allergen_type);

-- Comentarios
COMMENT ON TABLE PATIENTS IS 'Información básica de pacientes';
COMMENT ON TABLE PATIENT_CONTACTS IS 'Contactos de pacientes (4NF - separados por tipo)';
COMMENT ON TABLE PATIENT_ALLERGIES IS 'Alergias y contraindicaciones de pacientes';

COMMIT;

EXIT;
