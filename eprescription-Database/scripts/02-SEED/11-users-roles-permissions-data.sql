-- =====================================================
-- Script: 11-users-roles-permissions-data.sql
-- Description: Seed data for users, roles, permissions, user_roles, and role_permissions tables
-- =====================================================

SET DEFINE OFF;

PROMPT Inserting roles data...

-- System Roles
INSERT INTO roles (role_name, description) 
VALUES ('ADMIN', 'Administrador del sistema con acceso completo');

INSERT INTO roles (role_name, description) 
VALUES ('DOCTOR', 'Médico con permisos para crear prescripciones');

INSERT INTO roles (role_name, description) 
VALUES ('PHARMACIST', 'Farmacéutico con permisos para dispensar medicamentos');

INSERT INTO roles (role_name, description) 
VALUES ('PATIENT', 'Paciente con acceso a su información médica');

INSERT INTO roles (role_name, description) 
VALUES ('AUDITOR', 'Auditor con acceso de solo lectura a logs y auditoría');

COMMIT;

PROMPT Inserting permissions data...

-- System Permissions
INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('VIEW_ALL_PATIENTS', 'Ver todos los pacientes', 'patients', 'read');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('CREATE_PATIENT', 'Crear nuevo paciente', 'patients', 'create');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('UPDATE_PATIENT', 'Actualizar información de paciente', 'patients', 'update');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('DELETE_PATIENT', 'Eliminar paciente', 'patients', 'delete');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('VIEW_OWN_PATIENT_DATA', 'Ver propia información médica', 'patients', 'read_own');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('CREATE_PRESCRIPTION', 'Crear prescripción médica', 'prescriptions', 'create');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('VIEW_PRESCRIPTION', 'Ver prescripciones', 'prescriptions', 'read');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('UPDATE_PRESCRIPTION', 'Actualizar prescripción', 'prescriptions', 'update');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('DELETE_PRESCRIPTION', 'Eliminar prescripción', 'prescriptions', 'delete');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('DISPENSE_MEDICATION', 'Dispensar medicamentos', 'dispensations', 'create');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('VIEW_DISPENSATION', 'Ver dispensaciones', 'dispensations', 'read');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('MANAGE_INVENTORY', 'Gestionar inventario de farmacia', 'inventory', 'manage');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('VIEW_AUDIT_LOGS', 'Ver logs de auditoría', 'audit_logs', 'read');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('MANAGE_USERS', 'Gestionar usuarios del sistema', 'users', 'manage');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('MANAGE_ROLES', 'Gestionar roles y permisos', 'roles', 'manage');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('USE_AI_ASSISTANT', 'Usar asistente de IA para análisis clínico', 'ai_assistant', 'use');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('VIEW_MEDICATIONS', 'Ver catálogo de medicamentos', 'medications', 'read');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('MANAGE_MEDICATIONS', 'Gestionar catálogo de medicamentos', 'medications', 'manage');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('VIEW_DRUG_INTERACTIONS', 'Ver interacciones medicamentosas', 'drug_interactions', 'read');

INSERT INTO permissions (permission_name, description, resource_name, action_name) 
VALUES ('VIEW_CIE10_CATALOG', 'Ver catálogo CIE-10', 'cie10_catalog', 'read');

COMMIT;

PROMPT Inserting role_permissions data...

-- ADMIN role permissions (all permissions)
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 1);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 2);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 3);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 4);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 6);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 7);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 8);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 9);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 10);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 11);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 12);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 13);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 14);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 15);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 16);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 17);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 18);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 19);
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 20);

-- DOCTOR role permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES (2, 1);  -- VIEW_ALL_PATIENTS
INSERT INTO role_permissions (role_id, permission_id) VALUES (2, 2);  -- CREATE_PATIENT
INSERT INTO role_permissions (role_id, permission_id) VALUES (2, 3);  -- UPDATE_PATIENT
INSERT INTO role_permissions (role_id, permission_id) VALUES (2, 6);  -- CREATE_PRESCRIPTION
INSERT INTO role_permissions (role_id, permission_id) VALUES (2, 7);  -- VIEW_PRESCRIPTION
INSERT INTO role_permissions (role_id, permission_id) VALUES (2, 8);  -- UPDATE_PRESCRIPTION
INSERT INTO role_permissions (role_id, permission_id) VALUES (2, 16); -- USE_AI_ASSISTANT
INSERT INTO role_permissions (role_id, permission_id) VALUES (2, 17); -- VIEW_MEDICATIONS
INSERT INTO role_permissions (role_id, permission_id) VALUES (2, 19); -- VIEW_DRUG_INTERACTIONS
INSERT INTO role_permissions (role_id, permission_id) VALUES (2, 20); -- VIEW_CIE10_CATALOG

-- PHARMACIST role permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES (3, 7);  -- VIEW_PRESCRIPTION
INSERT INTO role_permissions (role_id, permission_id) VALUES (3, 10); -- DISPENSE_MEDICATION
INSERT INTO role_permissions (role_id, permission_id) VALUES (3, 11); -- VIEW_DISPENSATION
INSERT INTO role_permissions (role_id, permission_id) VALUES (3, 12); -- MANAGE_INVENTORY
INSERT INTO role_permissions (role_id, permission_id) VALUES (3, 17); -- VIEW_MEDICATIONS
INSERT INTO role_permissions (role_id, permission_id) VALUES (3, 19); -- VIEW_DRUG_INTERACTIONS

-- PATIENT role permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES (4, 5);  -- VIEW_OWN_PATIENT_DATA
INSERT INTO role_permissions (role_id, permission_id) VALUES (4, 7);  -- VIEW_PRESCRIPTION (own)
INSERT INTO role_permissions (role_id, permission_id) VALUES (4, 11); -- VIEW_DISPENSATION (own)

-- AUDITOR role permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES (5, 1);  -- VIEW_ALL_PATIENTS
INSERT INTO role_permissions (role_id, permission_id) VALUES (5, 7);  -- VIEW_PRESCRIPTION
INSERT INTO role_permissions (role_id, permission_id) VALUES (5, 11); -- VIEW_DISPENSATION
INSERT INTO role_permissions (role_id, permission_id) VALUES (5, 13); -- VIEW_AUDIT_LOGS

COMMIT;

PROMPT Inserting users data...

-- Admin user
INSERT INTO users (username, email, password_hash, is_active) 
VALUES ('admin', 'admin@eprescription.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1);

-- Doctor users (linked to doctors table)
INSERT INTO users (username, email, password_hash, is_active, doctor_id) 
VALUES ('roberto.andrade', 'roberto.andrade@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, 1);

INSERT INTO users (username, email, password_hash, is_active, doctor_id) 
VALUES ('patricia.salinas', 'patricia.salinas@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, 2);

INSERT INTO users (username, email, password_hash, is_active, doctor_id) 
VALUES ('carlos.mendoza', 'carlos.mendoza@clinica.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, 3);

-- Pharmacist users
INSERT INTO users (username, email, password_hash, is_active) 
VALUES ('maria.gonzalez', 'maria.gonzalez@farmacia.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1);

INSERT INTO users (username, email, password_hash, is_active) 
VALUES ('carlos.perez', 'carlos.perez@farmacia.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1);

-- Patient users (linked to patients table)
INSERT INTO users (username, email, password_hash, is_active, patient_id) 
VALUES ('juan.perez', 'juan.perez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, 1);

INSERT INTO users (username, email, password_hash, is_active, patient_id) 
VALUES ('maria.gonzalez.p', 'maria.gonzalez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, 2);

-- Auditor user
INSERT INTO users (username, email, password_hash, is_active) 
VALUES ('auditor', 'auditor@eprescription.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1);

COMMIT;

PROMPT Inserting user_roles data...

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1); -- admin -> ADMIN
INSERT INTO user_roles (user_id, role_id) VALUES (2, 2); -- roberto.andrade -> DOCTOR
INSERT INTO user_roles (user_id, role_id) VALUES (3, 2); -- patricia.salinas -> DOCTOR
INSERT INTO user_roles (user_id, role_id) VALUES (4, 2); -- carlos.mendoza -> DOCTOR
INSERT INTO user_roles (user_id, role_id) VALUES (5, 3); -- maria.gonzalez -> PHARMACIST
INSERT INTO user_roles (user_id, role_id) VALUES (6, 3); -- carlos.perez -> PHARMACIST
INSERT INTO user_roles (user_id, role_id) VALUES (7, 4); -- juan.perez -> PATIENT
INSERT INTO user_roles (user_id, role_id) VALUES (8, 4); -- maria.gonzalez.p -> PATIENT
INSERT INTO user_roles (user_id, role_id) VALUES (9, 5); -- auditor -> AUDITOR

COMMIT;

PROMPT Users, roles, and permissions data insertion completed successfully!
PROMPT Total roles inserted: 5
PROMPT Total permissions inserted: 20
PROMPT Total users inserted: 9
PROMPT Total role-permission assignments: 40+
PROMPT Total user-role assignments: 9

PROMPT 
PROMPT NOTE: All users have the same password hash for testing purposes
PROMPT Default password: 'password123' (hashed with bcrypt)
PROMPT 

SET DEFINE ON;
