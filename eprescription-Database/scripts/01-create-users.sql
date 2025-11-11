-- =====================================================
-- Script: 01-create-users.sql
-- Descripción: Crear usuarios para la aplicación y Keycloak
-- Autor: ePrescription Team
-- Fecha: 2024
-- =====================================================

-- Conectar como SYSDBA
WHENEVER SQLERROR EXIT SQL.SQLCODE

-- Crear usuario para la aplicación ePrescription
CREATE USER eprescription_user IDENTIFIED BY "EprescriptionPass123!"
  DEFAULT TABLESPACE USERS
  TEMPORARY TABLESPACE TEMP
  QUOTA UNLIMITED ON USERS;

-- Otorgar privilegios al usuario de la aplicación
GRANT CONNECT, RESOURCE TO eprescription_user;
GRANT CREATE SESSION TO eprescription_user;
GRANT CREATE TABLE TO eprescription_user;
GRANT CREATE VIEW TO eprescription_user;
GRANT CREATE SEQUENCE TO eprescription_user;
GRANT CREATE TRIGGER TO eprescription_user;
GRANT CREATE PROCEDURE TO eprescription_user;
GRANT CREATE SYNONYM TO eprescription_user;

-- Crear usuario para Keycloak
CREATE USER keycloak_user IDENTIFIED BY "KeycloakPass123!"
  DEFAULT TABLESPACE USERS
  TEMPORARY TABLESPACE TEMP
  QUOTA UNLIMITED ON USERS;

-- Otorgar privilegios al usuario de Keycloak
GRANT CONNECT, RESOURCE TO keycloak_user;
GRANT CREATE SESSION TO keycloak_user;
GRANT CREATE TABLE TO keycloak_user;
GRANT CREATE VIEW TO keycloak_user;
GRANT CREATE SEQUENCE TO keycloak_user;
GRANT CREATE TRIGGER TO keycloak_user;
GRANT CREATE PROCEDURE TO keycloak_user;
GRANT CREATE SYNONYM TO keycloak_user;

-- Confirmar creación
COMMIT;

-- Mostrar usuarios creados
SELECT username, account_status, default_tablespace 
FROM dba_users 
WHERE username IN ('EPRESCRIPTION_USER', 'KEYCLOAK_USER');

EXIT;
