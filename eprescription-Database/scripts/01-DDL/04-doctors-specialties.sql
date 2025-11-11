-- =====================================================
-- Script: 04-doctors-specialties.sql
-- Descripción: Crear tablas de médicos y especialidades
-- Autor: ePrescription Team
-- Fecha: 2024-11-11
-- =====================================================

CONNECT eprescription_user/EprescriptionPass123!@localhost:1521/XEPDB1

-- Crear tabla SPECIALTIES
CREATE TABLE SPECIALTIES (
    specialty_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    specialty_code VARCHAR2(20) UNIQUE NOT NULL,
    specialty_name VARCHAR2(200) NOT NULL,
    description VARCHAR2(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla DOCTORS
CREATE TABLE DOCTORS (
    doctor_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    identification_number VARCHAR2(50) UNIQUE NOT NULL,
    first_name VARCHAR2(100) NOT NULL,
    last_name VARCHAR2(100) NOT NULL,
    specialty_id RAW(16) NOT NULL,
    license_number VARCHAR2(50) UNIQUE NOT NULL,
    email VARCHAR2(200),
    phone VARCHAR2(20),
    is_active NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (specialty_id) REFERENCES SPECIALTIES(specialty_id),
    CONSTRAINT chk_doctor_email CHECK (REGEXP_LIKE(email, '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'))
);

-- Índices para SPECIALTIES
CREATE INDEX idx_specialty_code ON SPECIALTIES(specialty_code);
CREATE INDEX idx_specialty_name ON SPECIALTIES(UPPER(specialty_name));

-- Índices para DOCTORS
CREATE INDEX idx_doctor_identification ON DOCTORS(identification_number);
CREATE INDEX idx_doctor_license ON DOCTORS(license_number);
CREATE INDEX idx_doctor_specialty ON DOCTORS(specialty_id);
CREATE INDEX idx_doctor_name ON DOCTORS(UPPER(last_name), UPPER(first_name));
CREATE INDEX idx_doctor_active ON DOCTORS(is_active);

-- Comentarios
COMMENT ON TABLE SPECIALTIES IS 'Catálogo de especialidades médicas';
COMMENT ON TABLE DOCTORS IS 'Información de médicos registrados';
COMMENT ON COLUMN DOCTORS.license_number IS 'Número de licencia médica (código médico)';
COMMENT ON COLUMN DOCTORS.is_active IS 'Indica si el médico está activo en el sistema';

-- Insertar especialidades comunes
INSERT INTO SPECIALTIES (specialty_code, specialty_name, description) VALUES 
('MED-GEN', 'Medicina General', 'Atención médica general y primaria');

INSERT INTO SPECIALTIES (specialty_code, specialty_name, description) VALUES 
('CARDIO', 'Cardiología', 'Especialidad en enfermedades del corazón y sistema cardiovascular');

INSERT INTO SPECIALTIES (specialty_code, specialty_name, description) VALUES 
('PEDIATRIA', 'Pediatría', 'Atención médica de niños y adolescentes');

INSERT INTO SPECIALTIES (specialty_code, specialty_name, description) VALUES 
('GINECO', 'Ginecología y Obstetricia', 'Salud reproductiva femenina y embarazo');

INSERT INTO SPECIALTIES (specialty_code, specialty_name, description) VALUES 
('DERMATO', 'Dermatología', 'Enfermedades de la piel');

COMMIT;

EXIT;
