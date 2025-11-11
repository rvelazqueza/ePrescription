-- =====================================================
-- Script: 07-medications.sql
-- Descripción: Crear tablas de medicamentos
-- Autor: ePrescription Team
-- Fecha: 2024-11-11
-- =====================================================

CONNECT eprescription_user/EprescriptionPass123!@localhost:1521/XEPDB1

-- Crear tabla ADMINISTRATION_ROUTES
CREATE TABLE ADMINISTRATION_ROUTES (
    route_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    route_code VARCHAR2(20) UNIQUE NOT NULL,
    route_name VARCHAR2(100) NOT NULL,
    description VARCHAR2(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla MEDICATIONS
CREATE TABLE MEDICATIONS (
    medication_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    medication_code VARCHAR2(50) UNIQUE NOT NULL,
    commercial_name VARCHAR2(200) NOT NULL,
    generic_name VARCHAR2(200) NOT NULL,
    active_ingredient VARCHAR2(200),
    presentation VARCHAR2(100),
    concentration VARCHAR2(100),
    requires_prescription NUMBER(1) DEFAULT 1 CHECK (requires_prescription IN (0, 1)),
    is_active NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla PRESCRIPTION_MEDICATIONS (4NF - múltiples medicamentos por prescripción)
CREATE TABLE PRESCRIPTION_MEDICATIONS (
    prescription_medication_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    prescription_id RAW(16) NOT NULL,
    medication_id RAW(16) NOT NULL,
    dosage VARCHAR2(100) NOT NULL,
    frequency VARCHAR2(100) NOT NULL,
    duration_days NUMBER(5) NOT NULL CHECK (duration_days > 0),
    administration_route_id RAW(16) NOT NULL,
    quantity NUMBER(10,2) NOT NULL CHECK (quantity > 0),
    instructions CLOB,
    ai_suggested NUMBER(1) DEFAULT 0 CHECK (ai_suggested IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES PRESCRIPTIONS(prescription_id) ON DELETE CASCADE,
    FOREIGN KEY (medication_id) REFERENCES MEDICATIONS(medication_id),
    FOREIGN KEY (administration_route_id) REFERENCES ADMINISTRATION_ROUTES(route_id)
);

-- Crear tabla DRUG_INTERACTIONS (5NF - relación pura entre medicamentos)
CREATE TABLE DRUG_INTERACTIONS (
    interaction_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    medication_id_1 RAW(16) NOT NULL,
    medication_id_2 RAW(16) NOT NULL,
    interaction_severity VARCHAR2(20) NOT NULL CHECK (interaction_severity IN ('mild', 'moderate', 'severe', 'contraindicated')),
    interaction_description CLOB NOT NULL,
    clinical_effects CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medication_id_1) REFERENCES MEDICATIONS(medication_id),
    FOREIGN KEY (medication_id_2) REFERENCES MEDICATIONS(medication_id),
    CONSTRAINT chk_different_medications CHECK (medication_id_1 != medication_id_2),
    CONSTRAINT uq_drug_interaction UNIQUE (medication_id_1, medication_id_2)
);

-- Índices para ADMINISTRATION_ROUTES
CREATE INDEX idx_route_code ON ADMINISTRATION_ROUTES(route_code);

-- Índices para MEDICATIONS
CREATE INDEX idx_medication_code ON MEDICATIONS(medication_code);
CREATE INDEX idx_medication_commercial ON MEDICATIONS(UPPER(commercial_name));
CREATE INDEX idx_medication_generic ON MEDICATIONS(UPPER(generic_name));
CREATE INDEX idx_medication_active ON MEDICATIONS(is_active);

-- Índices para PRESCRIPTION_MEDICATIONS
CREATE INDEX idx_presc_med_prescription ON PRESCRIPTION_MEDICATIONS(prescription_id);
CREATE INDEX idx_presc_med_medication ON PRESCRIPTION_MEDICATIONS(medication_id);
CREATE INDEX idx_presc_med_route ON PRESCRIPTION_MEDICATIONS(administration_route_id);
CREATE INDEX idx_presc_med_ai ON PRESCRIPTION_MEDICATIONS(ai_suggested);

-- Índices para DRUG_INTERACTIONS
CREATE INDEX idx_interaction_med1 ON DRUG_INTERACTIONS(medication_id_1);
CREATE INDEX idx_interaction_med2 ON DRUG_INTERACTIONS(medication_id_2);
CREATE INDEX idx_interaction_severity ON DRUG_INTERACTIONS(interaction_severity);

-- Comentarios
COMMENT ON TABLE ADMINISTRATION_ROUTES IS 'Catálogo de vías de administración de medicamentos';
COMMENT ON TABLE MEDICATIONS IS 'Catálogo de medicamentos';
COMMENT ON TABLE PRESCRIPTION_MEDICATIONS IS 'Medicamentos por prescripción (4NF)';
COMMENT ON TABLE DRUG_INTERACTIONS IS 'Interacciones medicamentosas (5NF - relación pura)';
COMMENT ON COLUMN MEDICATIONS.requires_prescription IS 'Indica si requiere prescripción médica';
COMMENT ON COLUMN PRESCRIPTION_MEDICATIONS.ai_suggested IS 'Indica si fue sugerido por IA';
COMMENT ON COLUMN DRUG_INTERACTIONS.interaction_severity IS 'Severidad: mild, moderate, severe, contraindicated';

-- Insertar vías de administración comunes
INSERT INTO ADMINISTRATION_ROUTES (route_code, route_name, description) VALUES 
('ORAL', 'Oral', 'Administración por vía oral');

INSERT INTO ADMINISTRATION_ROUTES (route_code, route_name, description) VALUES 
('IV', 'Intravenosa', 'Administración intravenosa');

INSERT INTO ADMINISTRATION_ROUTES (route_code, route_name, description) VALUES 
('IM', 'Intramuscular', 'Administración intramuscular');

INSERT INTO ADMINISTRATION_ROUTES (route_code, route_name, description) VALUES 
('SC', 'Subcutánea', 'Administración subcutánea');

INSERT INTO ADMINISTRATION_ROUTES (route_code, route_name, description) VALUES 
('TOPICAL', 'Tópica', 'Aplicación tópica en la piel');

COMMIT;

EXIT;
