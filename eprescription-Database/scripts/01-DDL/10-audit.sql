-- =====================================================
-- Script: 10-audit.sql
-- Descripción: Crear tablas de auditoría (INMUTABLES)
-- Autor: ePrescription Team
-- Fecha: 2024-11-11
-- PRIORIDAD ALTA - Compliance FDA 21 CFR Part 11
-- =====================================================

CONNECT eprescription_user/EprescriptionPass123!@localhost:1521/XEPDB1

-- Crear tabla AUDIT_LOGS (INMUTABLE)
CREATE TABLE AUDIT_LOGS (
    audit_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id RAW(16),
    username VARCHAR2(100),
    ip_address VARCHAR2(50),
    action_type VARCHAR2(100) NOT NULL,
    entity_type VARCHAR2(100) NOT NULL,
    entity_id VARCHAR2(100),
    before_value CLOB,
    after_value CLOB,
    metadata CLOB,
    session_id VARCHAR2(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

-- Crear tabla AI_ANALYSIS_LOGS (INMUTABLE)
CREATE TABLE AI_ANALYSIS_LOGS (
    analysis_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id RAW(16),
    prescription_id RAW(16),
    analysis_type VARCHAR2(50) NOT NULL CHECK (analysis_type IN ('diagnosis', 'medication', 'interaction', 'contraindication')),
    input_data CLOB NOT NULL,
    output_data CLOB NOT NULL,
    ai_provider VARCHAR2(100),
    processing_time_ms NUMBER(10),
    confidence_score NUMBER(5,4) CHECK (confidence_score BETWEEN 0 AND 1),
    was_accepted NUMBER(1) DEFAULT 0 CHECK (was_accepted IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    FOREIGN KEY (prescription_id) REFERENCES PRESCRIPTIONS(prescription_id)
);

-- Índices para AUDIT_LOGS
CREATE INDEX idx_audit_timestamp ON AUDIT_LOGS(timestamp);
CREATE INDEX idx_audit_user ON AUDIT_LOGS(user_id);
CREATE INDEX idx_audit_action ON AUDIT_LOGS(action_type);
CREATE INDEX idx_audit_entity ON AUDIT_LOGS(entity_type, entity_id);
CREATE INDEX idx_audit_session ON AUDIT_LOGS(session_id);
CREATE INDEX idx_audit_ip ON AUDIT_LOGS(ip_address);

-- Índices para AI_ANALYSIS_LOGS
CREATE INDEX idx_ai_timestamp ON AI_ANALYSIS_LOGS(timestamp);
CREATE INDEX idx_ai_user ON AI_ANALYSIS_LOGS(user_id);
CREATE INDEX idx_ai_prescription ON AI_ANALYSIS_LOGS(prescription_id);
CREATE INDEX idx_ai_type ON AI_ANALYSIS_LOGS(analysis_type);
CREATE INDEX idx_ai_provider ON AI_ANALYSIS_LOGS(ai_provider);
CREATE INDEX idx_ai_accepted ON AI_ANALYSIS_LOGS(was_accepted);

-- Particionamiento por rango de fechas (para tablas grandes)
-- Nota: Se puede implementar después si el volumen de datos lo requiere
-- ALTER TABLE AUDIT_LOGS MODIFY PARTITION BY RANGE (timestamp) INTERVAL (NUMTOYMINTERVAL(1, 'MONTH'));

-- Comentarios
COMMENT ON TABLE AUDIT_LOGS IS 'Registro de auditoría completo (INMUTABLE - FDA 21 CFR Part 11)';
COMMENT ON TABLE AI_ANALYSIS_LOGS IS 'Logs de análisis de IA (INMUTABLE - trazabilidad)';
COMMENT ON COLUMN AUDIT_LOGS.action_type IS 'Tipo de acción: CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, etc.';
COMMENT ON COLUMN AUDIT_LOGS.entity_type IS 'Tipo de entidad: PRESCRIPTION, PATIENT, MEDICATION, etc.';
COMMENT ON COLUMN AUDIT_LOGS.before_value IS 'Valor antes del cambio (JSON)';
COMMENT ON COLUMN AUDIT_LOGS.after_value IS 'Valor después del cambio (JSON)';
COMMENT ON COLUMN AUDIT_LOGS.metadata IS 'Metadatos adicionales (JSON)';
COMMENT ON COLUMN AI_ANALYSIS_LOGS.analysis_type IS 'Tipo: diagnosis, medication, interaction, contraindication';
COMMENT ON COLUMN AI_ANALYSIS_LOGS.was_accepted IS 'Indica si el médico aceptó la sugerencia de IA';

COMMIT;

-- Nota: El trigger de inmutabilidad se creará en un script separado (11-triggers.sql)

EXIT;
