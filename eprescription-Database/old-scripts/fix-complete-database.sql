-- =====================================================
-- Script completo para crear tablas faltantes e insertar datos
-- Ejecutar en SQL Developer como EPRESCRIPTION_USER
-- =====================================================

-- 1. CREAR TABLAS FALTANTES
-- =====================================================

-- Tabla CIE10_CATALOG
CREATE TABLE CIE10_CATALOG (
    cie10_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    code VARCHAR2(10) UNIQUE NOT NULL,
    description_es VARCHAR2(500) NOT NULL,
    description_en VARCHAR2(500),
    category VARCHAR2(100),
    chapter VARCHAR2(200),
    is_active NUMBER(1) DEFAULT 1,
    source VARCHAR2(20) DEFAULT 'MANUAL',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla PRESCRIPTION_DIAGNOSES
CREATE TABLE PRESCRIPTION_DIAGNOSES (
    diagnosis_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    prescription_id RAW(16) NOT NULL,
    cie10_code VARCHAR2(10) NOT NULL,
    is_primary NUMBER(1) DEFAULT 0,
    notes VARCHAR2(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_presc_diag_prescription FOREIGN KEY (prescription_id) 
        REFERENCES PRESCRIPTIONS(prescription_id) ON DELETE CASCADE,
    CONSTRAINT fk_presc_diag_cie10 FOREIGN KEY (cie10_code) 
        REFERENCES CIE10_CATALOG(code)
);

-- Índices
CREATE INDEX idx_cie10_code ON CIE10_CATALOG(code);
CREATE INDEX idx_cie10_category ON CIE10_CATALOG(category);
CREATE INDEX idx_presc_diag_prescription ON PRESCRIPTION_DIAGNOSES(prescription_id);
CREATE INDEX idx_presc_diag_cie10 ON PRESCRIPTION_DIAGNOSES(cie10_code);

COMMIT;

PROMPT Tablas creadas exitosamente.
PROMPT Ahora ejecuta los scripts de datos en este orden:
PROMPT 1. 01-cie10-catalog-data.sql
PROMPT 2. 02-addresses-data.sql  
PROMPT 3. 03-specialties-routes-data.sql
PROMPT 4. 04-patients-data.sql
PROMPT 5. 05-medical-centers-doctors-data.sql
PROMPT 6. 06-medications-data.sql
PROMPT 7. 07-drug-interactions-data.sql
PROMPT 8. 08-pharmacies-inventory-data.sql
PROMPT 9. 09-prescriptions-data.sql
PROMPT 10. 09-prescriptions-data-part2.sql
PROMPT 11. 09-prescriptions-data-part3.sql
PROMPT 12. 10-dispensations-data.sql
PROMPT 13. 11-users-roles-permissions-data.sql
PROMPT 14. 12-audit-ai-logs-data.sql
