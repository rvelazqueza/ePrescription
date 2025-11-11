-- =====================================================
-- Script: 02-create-schemas.sql
-- Descripción: Crear esquemas para la aplicación
-- Autor: ePrescription Team
-- Fecha: 2024
-- =====================================================

-- Conectar como eprescription_user al PDB
CONNECT eprescription_user/EprescriptionPass123!@localhost:1521/XEPDB1

-- Crear tabla de verificación del esquema EPRESCRIPTION
CREATE TABLE schema_info (
    schema_name VARCHAR2(100) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version VARCHAR2(20) DEFAULT '1.0.0',
    description VARCHAR2(500)
);

-- Insertar información del esquema
INSERT INTO schema_info (schema_name, description) 
VALUES ('EPRESCRIPTION', 'Esquema principal de la aplicación ePrescription');

COMMIT;

-- Conectar como keycloak_user al PDB
CONNECT keycloak_user/KeycloakPass123!@localhost:1521/XEPDB1

-- Crear tabla de verificación del esquema KEYCLOAK
CREATE TABLE schema_info (
    schema_name VARCHAR2(100) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version VARCHAR2(20) DEFAULT '1.0.0',
    description VARCHAR2(500)
);

-- Insertar información del esquema
INSERT INTO schema_info (schema_name, description) 
VALUES ('KEYCLOAK', 'Esquema para Keycloak Identity and Access Management');

COMMIT;

-- Verificar esquemas creados
CONNECT sys/OraclePassword123!@localhost:1521/XEPDB1 as sysdba

SELECT username, account_status, created 
FROM dba_users 
WHERE username IN ('EPRESCRIPTION_USER', 'KEYCLOAK_USER')
ORDER BY username;

EXIT;
