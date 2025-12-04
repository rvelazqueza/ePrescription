-- =====================================================
-- Script: 01-cie10-catalog.sql
-- Descripción: Crear tabla de catálogo CIE-10 con índices
-- Autor: ePrescription Team
-- Fecha: 2024-11-11
-- =====================================================

-- Conectar como eprescription_user
CONNECT eprescription_user/EprescriptionPass123!@localhost:1521/XEPDB1

-- Crear tabla CIE10_CATALOG
CREATE TABLE CIE10_CATALOG (
    cie10_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    code VARCHAR2(10) UNIQUE NOT NULL,
    description VARCHAR2(500) NOT NULL,
    description_english VARCHAR2(500),
    category VARCHAR2(100),
    subcategory VARCHAR2(100),
    is_active NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1)),
    source VARCHAR2(20) DEFAULT 'MANUAL' CHECK (source IN ('MANUAL', 'WHO_API')),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_code_format CHECK (REGEXP_LIKE(code, '^[A-Z][0-9]{2}(\.[0-9]{1,2})?$'))
);

-- Crear índices para búsqueda rápida
CREATE INDEX idx_cie10_code ON CIE10_CATALOG(code);
CREATE INDEX idx_cie10_description ON CIE10_CATALOG(UPPER(description));
CREATE INDEX idx_cie10_category ON CIE10_CATALOG(category);
CREATE INDEX idx_cie10_active ON CIE10_CATALOG(is_active);

-- Crear índice de texto completo para búsqueda avanzada
CREATE INDEX idx_cie10_desc_text ON CIE10_CATALOG(description) 
    INDEXTYPE IS CTXSYS.CONTEXT
    PARAMETERS ('SYNC (ON COMMIT)');

-- Comentarios de la tabla
COMMENT ON TABLE CIE10_CATALOG IS 'Catálogo oficial de diagnósticos CIE-10 (ICD-10)';
COMMENT ON COLUMN CIE10_CATALOG.cie10_id IS 'Identificador único del diagnóstico';
COMMENT ON COLUMN CIE10_CATALOG.code IS 'Código CIE-10 (ej: A00.0, B15.9)';
COMMENT ON COLUMN CIE10_CATALOG.description IS 'Descripción en español';
COMMENT ON COLUMN CIE10_CATALOG.description_english IS 'Descripción en inglés (WHO API)';
COMMENT ON COLUMN CIE10_CATALOG.category IS 'Categoría principal (ej: Enfermedades infecciosas)';
COMMENT ON COLUMN CIE10_CATALOG.subcategory IS 'Subcategoría';
COMMENT ON COLUMN CIE10_CATALOG.is_active IS 'Indica si el código está activo (1) o deprecado (0)';
COMMENT ON COLUMN CIE10_CATALOG.source IS 'Origen del registro: MANUAL o WHO_API';
COMMENT ON COLUMN CIE10_CATALOG.last_updated IS 'Fecha de última actualización';

-- Insertar algunos códigos CIE-10 comunes para testing
INSERT INTO CIE10_CATALOG (code, description, category, subcategory) VALUES 
('A00.0', 'Cólera debido a Vibrio cholerae 01, biotipo cholerae', 'Enfermedades infecciosas y parasitarias', 'Enfermedades intestinales infecciosas');

INSERT INTO CIE10_CATALOG (code, description, category, subcategory) VALUES 
('E11.9', 'Diabetes mellitus no insulinodependiente, sin mención de complicación', 'Enfermedades endocrinas, nutricionales y metabólicas', 'Diabetes mellitus');

INSERT INTO CIE10_CATALOG (code, description, category, subcategory) VALUES 
('I10', 'Hipertensión esencial (primaria)', 'Enfermedades del sistema circulatorio', 'Enfermedades hipertensivas');

INSERT INTO CIE10_CATALOG (code, description, category, subcategory) VALUES 
('J06.9', 'Infección aguda de las vías respiratorias superiores, no especificada', 'Enfermedades del sistema respiratorio', 'Infecciones respiratorias agudas');

INSERT INTO CIE10_CATALOG (code, description, category, subcategory) VALUES 
('K29.7', 'Gastritis, no especificada', 'Enfermedades del sistema digestivo', 'Enfermedades del esófago, estómago y duodeno');

COMMIT;

-- Verificar creación
SELECT COUNT(*) as total_codes FROM CIE10_CATALOG;
SELECT * FROM CIE10_CATALOG ORDER BY code;

EXIT;
