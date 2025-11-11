-- =====================================================
-- Script: 05-medical-centers.sql
-- Descripción: Crear tablas de centros médicos
-- Autor: ePrescription Team
-- Fecha: 2024-11-11
-- =====================================================

CONNECT eprescription_user/EprescriptionPass123!@localhost:1521/XEPDB1

-- Crear tabla MEDICAL_CENTERS
CREATE TABLE MEDICAL_CENTERS (
    center_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    center_name VARCHAR2(200) NOT NULL,
    center_type VARCHAR2(50) NOT NULL CHECK (center_type IN ('hospital', 'clinic', 'private_practice', 'health_center')),
    address_id RAW(16),
    phone VARCHAR2(20),
    email VARCHAR2(200),
    is_active NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (address_id) REFERENCES ADDRESSES(address_id)
);

-- Crear tabla DOCTOR_MEDICAL_CENTERS (5NF - relación temporal many-to-many)
CREATE TABLE DOCTOR_MEDICAL_CENTERS (
    assignment_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    doctor_id RAW(16) NOT NULL,
    medical_center_id RAW(16) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES DOCTORS(doctor_id),
    FOREIGN KEY (medical_center_id) REFERENCES MEDICAL_CENTERS(center_id),
    CONSTRAINT chk_assignment_dates CHECK (end_date IS NULL OR end_date > start_date),
    CONSTRAINT uq_doctor_center_active UNIQUE (doctor_id, medical_center_id, is_active)
);

-- Índices para MEDICAL_CENTERS
CREATE INDEX idx_center_name ON MEDICAL_CENTERS(UPPER(center_name));
CREATE INDEX idx_center_type ON MEDICAL_CENTERS(center_type);
CREATE INDEX idx_center_active ON MEDICAL_CENTERS(is_active);
CREATE INDEX idx_center_address ON MEDICAL_CENTERS(address_id);

-- Índices para DOCTOR_MEDICAL_CENTERS
CREATE INDEX idx_assignment_doctor ON DOCTOR_MEDICAL_CENTERS(doctor_id);
CREATE INDEX idx_assignment_center ON DOCTOR_MEDICAL_CENTERS(medical_center_id);
CREATE INDEX idx_assignment_active ON DOCTOR_MEDICAL_CENTERS(is_active);
CREATE INDEX idx_assignment_dates ON DOCTOR_MEDICAL_CENTERS(start_date, end_date);

-- Comentarios
COMMENT ON TABLE MEDICAL_CENTERS IS 'Centros médicos (hospitales, clínicas, consultorios)';
COMMENT ON TABLE DOCTOR_MEDICAL_CENTERS IS 'Asignaciones de médicos a centros médicos (5NF - temporal)';
COMMENT ON COLUMN DOCTOR_MEDICAL_CENTERS.start_date IS 'Fecha de inicio de la asignación';
COMMENT ON COLUMN DOCTOR_MEDICAL_CENTERS.end_date IS 'Fecha de fin de la asignación (NULL si está activa)';

COMMIT;

EXIT;
