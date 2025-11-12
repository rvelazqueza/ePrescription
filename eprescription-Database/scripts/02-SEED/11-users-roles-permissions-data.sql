-- =====================================================
-- Script: 11-users-roles-permissions-data.sql
-- Description: Seed data for USERS, ROLES, PERMISSIONS, and relationship tables
-- Creates roles, permissions, and sample users for the system
-- Integrates with Keycloak for authentication
-- Follows DATABASE-SCHEMA-REFERENCE.md structure
-- =====================================================

-- Configure session for UTF-8
ALTER SESSION SET NLS_LANGUAGE='SPANISH';
ALTER SESSION SET NLS_TERRITORY='COSTA RICA';

SET DEFINE OFF;
SET SERVEROUTPUT ON;

PROMPT ========================================
PROMPT Inserting USERS, ROLES, and PERMISSIONS data
PROMPT ========================================

-- Clear existing data
DELETE FROM USER_ROLES;
DELETE FROM ROLE_PERMISSIONS;
DELETE FROM USERS;
DELETE FROM PERMISSIONS;
DELETE FROM ROLES;

PROMPT Creating roles...

DECLARE
    v_role_id RAW(16);
    v_perm_id RAW(16);
    v_user_id RAW(16);
    v_doctor_id RAW(16);
    v_patient_id RAW(16);
BEGIN
    -- Create Roles
    INSERT INTO ROLES (ROLE_NAME, DESCRIPTION, IS_ACTIVE)
    VALUES ('ADMIN', 'Administrador del sistema con acceso completo', 1)
    RETURNING ROLE_ID INTO v_role_id;
    
    INSERT INTO ROLES (ROLE_NAME, DESCRIPTION, IS_ACTIVE)
    VALUES ('DOCTOR', 'Médico con capacidad de crear prescripciones', 1);
    
    INSERT INTO ROLES (ROLE_NAME, DESCRIPTION, IS_ACTIVE)
    VALUES ('PHARMACIST', 'Farmacéutico con capacidad de dispensar medicamentos', 1);
    
    INSERT INTO ROLES (ROLE_NAME, DESCRIPTION, IS_ACTIVE)
    VALUES ('PATIENT', 'Paciente con acceso a sus propias prescripciones', 1);
    
    INSERT INTO ROLES (ROLE_NAME, DESCRIPTION, IS_ACTIVE)
    VALUES ('NURSE', 'Enfermero con acceso de lectura a prescripciones', 1);
    
    DBMS_OUTPUT.PUT_LINE('Created 5 roles');
    
    -- Create Permissions
    -- Prescription permissions
    INSERT INTO PERMISSIONS (PERMISSION_NAME, RESOURCE_NAME, ACTION, DESCRIPTION)
    VALUES ('prescription.create', 'prescriptions', 'create', 'Crear nuevas prescripciones')
    RETURNING PERMISSION_ID INTO v_perm_id;
    
    INSERT INTO PERMISSIONS (PERMISSION_NAME, RESOURCE_NAME, ACTION, DESCRIPTION)
    VALUES ('prescription.read', 'prescriptions', 'read', 'Ver prescripciones');
    
    INSERT INTO PERMISSIONS (PERMISSION_NAME, RESOURCE_NAME, ACTION, DESCRIPTION)
    VALUES ('prescription.update', 'prescriptions', 'update', 'Actualizar prescripciones');
    
    INSERT INTO PERMISSIONS (PERMISSION_NAME, RESOURCE_NAME, ACTION, DESCRIPTION)
    VALUES ('prescription.delete', 'prescriptions', 'delete', 'Eliminar prescripciones');

    
    -- Dispensation permissions
    INSERT INTO PERMISSIONS (PERMISSION_NAME, RESOURCE_NAME, ACTION, DESCRIPTION)
    VALUES ('dispensation.create', 'dispensations', 'create', 'Crear dispensaciones');
    
    INSERT INTO PERMISSIONS (PERMISSION_NAME, RESOURCE_NAME, ACTION, DESCRIPTION)
    VALUES ('dispensation.read', 'dispensations', 'read', 'Ver dispensaciones');
    
    -- Patient permissions
    INSERT INTO PERMISSIONS (PERMISSION_NAME, RESOURCE_NAME, ACTION, DESCRIPTION)
    VALUES ('patient.read', 'patients', 'read', 'Ver información de pacientes');
    
    INSERT INTO PERMISSIONS (PERMISSION_NAME, RESOURCE_NAME, ACTION, DESCRIPTION)
    VALUES ('patient.update', 'patients', 'update', 'Actualizar información de pacientes');
    
    -- Medication permissions
    INSERT INTO PERMISSIONS (PERMISSION_NAME, RESOURCE_NAME, ACTION, DESCRIPTION)
    VALUES ('medication.read', 'medications', 'read', 'Ver catálogo de medicamentos');
    
    -- AI permissions
    INSERT INTO PERMISSIONS (PERMISSION_NAME, RESOURCE_NAME, ACTION, DESCRIPTION)
    VALUES ('ai.execute', 'ai', 'execute', 'Usar asistente de IA para sugerencias');
    
    DBMS_OUTPUT.PUT_LINE('Created 10 permissions');
    
    -- Assign permissions to roles
    -- ADMIN role gets all permissions
    FOR perm IN (SELECT PERMISSION_ID FROM PERMISSIONS) LOOP
        INSERT INTO ROLE_PERMISSIONS (ROLE_ID, PERMISSION_ID)
        SELECT r.ROLE_ID, perm.PERMISSION_ID
        FROM ROLES r
        WHERE r.ROLE_NAME = 'ADMIN';
    END LOOP;
    
    -- DOCTOR role
    INSERT INTO ROLE_PERMISSIONS (ROLE_ID, PERMISSION_ID)
    SELECT r.ROLE_ID, p.PERMISSION_ID
    FROM ROLES r, PERMISSIONS p
    WHERE r.ROLE_NAME = 'DOCTOR'
    AND p.PERMISSION_NAME IN ('prescription.create', 'prescription.read', 'prescription.update', 
                               'patient.read', 'patient.update', 'medication.read', 'ai.execute');
    
    -- PHARMACIST role
    INSERT INTO ROLE_PERMISSIONS (ROLE_ID, PERMISSION_ID)
    SELECT r.ROLE_ID, p.PERMISSION_ID
    FROM ROLES r, PERMISSIONS p
    WHERE r.ROLE_NAME = 'PHARMACIST'
    AND p.PERMISSION_NAME IN ('prescription.read', 'dispensation.create', 'dispensation.read', 
                               'patient.read', 'medication.read');
    
    -- PATIENT role
    INSERT INTO ROLE_PERMISSIONS (ROLE_ID, PERMISSION_ID)
    SELECT r.ROLE_ID, p.PERMISSION_ID
    FROM ROLES r, PERMISSIONS p
    WHERE r.ROLE_NAME = 'PATIENT'
    AND p.PERMISSION_NAME IN ('prescription.read', 'dispensation.read');
    
    -- NURSE role
    INSERT INTO ROLE_PERMISSIONS (ROLE_ID, PERMISSION_ID)
    SELECT r.ROLE_ID, p.PERMISSION_ID
    FROM ROLES r, PERMISSIONS p
    WHERE r.ROLE_NAME = 'NURSE'
    AND p.PERMISSION_NAME IN ('prescription.read', 'patient.read', 'medication.read');
    
    DBMS_OUTPUT.PUT_LINE('Assigned permissions to roles');
    
    -- Create sample users
    -- Admin user
    INSERT INTO USERS (USERNAME, EMAIL, IS_ACTIVE)
    VALUES ('admin', 'admin@eprescription.cr', 1)
    RETURNING USER_ID INTO v_user_id;
    
    INSERT INTO USER_ROLES (USER_ID, ROLE_ID)
    SELECT v_user_id, ROLE_ID FROM ROLES WHERE ROLE_NAME = 'ADMIN';
    
    -- Create users for first 5 doctors
    FOR doc IN (
        SELECT d.DOCTOR_ID, d.FIRST_NAME, d.LAST_NAME, d.EMAIL, ROWNUM as RN
        FROM DOCTORS d
        WHERE ROWNUM <= 5
    ) LOOP
        INSERT INTO USERS (USERNAME, EMAIL, IS_ACTIVE)
        VALUES ('doctor' || doc.RN, doc.EMAIL, 1)
        RETURNING USER_ID INTO v_user_id;
        
        INSERT INTO USER_ROLES (USER_ID, ROLE_ID)
        SELECT v_user_id, ROLE_ID FROM ROLES WHERE ROLE_NAME = 'DOCTOR';
    END LOOP;
    
    -- Create users for first 5 patients
    FOR pat IN (
        SELECT p.PATIENT_ID, p.FIRST_NAME, p.LAST_NAME, p.IDENTIFICATION_NUMBER, ROWNUM as RN
        FROM PATIENTS p
        WHERE ROWNUM <= 5
    ) LOOP
        INSERT INTO USERS (USERNAME, EMAIL, IS_ACTIVE)
        VALUES ('patient' || pat.RN, 
                'patient' || pat.RN || '@eprescription.cr', 1)
        RETURNING USER_ID INTO v_user_id;
        
        INSERT INTO USER_ROLES (USER_ID, ROLE_ID)
        SELECT v_user_id, ROLE_ID FROM ROLES WHERE ROLE_NAME = 'PATIENT';
    END LOOP;
    
    DBMS_OUTPUT.PUT_LINE('Created 11 users (1 admin + 5 doctors + 5 patients)');
    
    COMMIT;
END;
/

PROMPT 
PROMPT ========================================
PROMPT USERS, ROLES, and PERMISSIONS Completed!
PROMPT ========================================

-- Verify data
SELECT COUNT(*) as TOTAL_ROLES FROM ROLES;
SELECT COUNT(*) as TOTAL_PERMISSIONS FROM PERMISSIONS;
SELECT COUNT(*) as TOTAL_USERS FROM USERS;

SELECT 'Roles:' as INFO FROM DUAL;
SELECT ROLE_NAME, DESCRIPTION FROM ROLES ORDER BY ROLE_NAME;

SELECT 'Permissions by role:' as INFO FROM DUAL;
SELECT r.ROLE_NAME, COUNT(rp.PERMISSION_ID) as PERMISSION_COUNT
FROM ROLES r
LEFT JOIN ROLE_PERMISSIONS rp ON r.ROLE_ID = rp.ROLE_ID
GROUP BY r.ROLE_NAME
ORDER BY PERMISSION_COUNT DESC;

SELECT 'Sample users:' as INFO FROM DUAL;
SELECT u.USERNAME, u.EMAIL, r.ROLE_NAME
FROM USERS u
JOIN USER_ROLES ur ON u.USER_ID = ur.USER_ID
JOIN ROLES r ON ur.ROLE_ID = r.ROLE_ID
FETCH FIRST 5 ROWS ONLY;

PROMPT ========================================

EXIT;
