-- =====================================================
-- Script: 09-security.sql
-- Descripción: Crear tablas de seguridad (usuarios, roles, permisos)
-- Autor: ePrescription Team
-- Fecha: 2024-11-11
-- =====================================================

CONNECT eprescription_user/EprescriptionPass123!@localhost:1521/XEPDB1

-- Crear tabla USERS
CREATE TABLE USERS (
    user_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    username VARCHAR2(100) UNIQUE NOT NULL,
    email VARCHAR2(200) UNIQUE NOT NULL,
    keycloak_user_id VARCHAR2(100) UNIQUE,
    is_active NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1)),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_email CHECK (REGEXP_LIKE(email, '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'))
);

-- Crear tabla ROLES
CREATE TABLE ROLES (
    role_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    role_name VARCHAR2(100) UNIQUE NOT NULL,
    description VARCHAR2(500),
    keycloak_role_id VARCHAR2(100),
    is_active NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla PERMISSIONS
CREATE TABLE PERMISSIONS (
    permission_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    permission_name VARCHAR2(100) UNIQUE NOT NULL,
    resource_name VARCHAR2(100) NOT NULL,
    action VARCHAR2(50) NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'execute')),
    description VARCHAR2(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_resource_action UNIQUE (resource_name, action)
);

-- Crear tabla USER_ROLES (5NF - relación pura usuario-rol)
CREATE TABLE USER_ROLES (
    user_role_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    user_id RAW(16) NOT NULL,
    role_id RAW(16) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by RAW(16),
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES ROLES(role_id),
    FOREIGN KEY (assigned_by) REFERENCES USERS(user_id),
    CONSTRAINT uq_user_role UNIQUE (user_id, role_id)
);

-- Crear tabla ROLE_PERMISSIONS (5NF - relación pura rol-permiso)
CREATE TABLE ROLE_PERMISSIONS (
    role_permission_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    role_id RAW(16) NOT NULL,
    permission_id RAW(16) NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES ROLES(role_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES PERMISSIONS(permission_id),
    CONSTRAINT uq_role_permission UNIQUE (role_id, permission_id)
);

-- Índices para USERS
CREATE INDEX idx_user_username ON USERS(UPPER(username));
CREATE INDEX idx_user_email ON USERS(UPPER(email));
CREATE INDEX idx_user_keycloak ON USERS(keycloak_user_id);
CREATE INDEX idx_user_active ON USERS(is_active);

-- Índices para ROLES
CREATE INDEX idx_role_name ON ROLES(UPPER(role_name));
CREATE INDEX idx_role_keycloak ON ROLES(keycloak_role_id);
CREATE INDEX idx_role_active ON ROLES(is_active);

-- Índices para PERMISSIONS
CREATE INDEX idx_permission_name ON PERMISSIONS(permission_name);
CREATE INDEX idx_permission_resource ON PERMISSIONS(resource_name);
CREATE INDEX idx_permission_action ON PERMISSIONS(action);

-- Índices para USER_ROLES
CREATE INDEX idx_user_role_user ON USER_ROLES(user_id);
CREATE INDEX idx_user_role_role ON USER_ROLES(role_id);

-- Índices para ROLE_PERMISSIONS
CREATE INDEX idx_role_perm_role ON ROLE_PERMISSIONS(role_id);
CREATE INDEX idx_role_perm_permission ON ROLE_PERMISSIONS(permission_id);

-- Comentarios
COMMENT ON TABLE USERS IS 'Usuarios del sistema (sincronizados con Keycloak)';
COMMENT ON TABLE ROLES IS 'Roles del sistema';
COMMENT ON TABLE PERMISSIONS IS 'Permisos granulares del sistema';
COMMENT ON TABLE USER_ROLES IS 'Asignación usuario-rol (5NF)';
COMMENT ON TABLE ROLE_PERMISSIONS IS 'Asignación rol-permiso (5NF)';
COMMENT ON COLUMN USERS.keycloak_user_id IS 'UUID del usuario en Keycloak';
COMMENT ON COLUMN ROLES.keycloak_role_id IS 'ID del rol en Keycloak';
COMMENT ON COLUMN PERMISSIONS.resource_name IS 'Nombre del recurso (ej: prescriptions, patients)';
COMMENT ON COLUMN PERMISSIONS.action IS 'Acción: create, read, update, delete, execute';

-- Insertar roles básicos
INSERT INTO ROLES (role_name, description) VALUES 
('admin', 'Administrador del sistema con acceso completo');

INSERT INTO ROLES (role_name, description) VALUES 
('doctor', 'Médico con permisos para crear prescripciones');

INSERT INTO ROLES (role_name, description) VALUES 
('pharmacist', 'Farmacéutico con permisos para dispensar medicamentos');

INSERT INTO ROLES (role_name, description) VALUES 
('patient', 'Paciente con acceso a sus propias prescripciones');

INSERT INTO ROLES (role_name, description) VALUES 
('auditor', 'Auditor con acceso de solo lectura a logs');

-- Insertar permisos básicos
INSERT INTO PERMISSIONS (permission_name, resource_name, action, description) VALUES 
('prescriptions.create', 'prescriptions', 'create', 'Crear prescripciones');

INSERT INTO PERMISSIONS (permission_name, resource_name, action, description) VALUES 
('prescriptions.read', 'prescriptions', 'read', 'Leer prescripciones');

INSERT INTO PERMISSIONS (permission_name, resource_name, action, description) VALUES 
('prescriptions.update', 'prescriptions', 'update', 'Actualizar prescripciones');

INSERT INTO PERMISSIONS (permission_name, resource_name, action, description) VALUES 
('prescriptions.delete', 'prescriptions', 'delete', 'Eliminar prescripciones');

INSERT INTO PERMISSIONS (permission_name, resource_name, action, description) VALUES 
('dispensations.create', 'dispensations', 'create', 'Crear dispensaciones');

INSERT INTO PERMISSIONS (permission_name, resource_name, action, description) VALUES 
('audit_logs.read', 'audit_logs', 'read', 'Leer logs de auditoría');

COMMIT;

EXIT;
