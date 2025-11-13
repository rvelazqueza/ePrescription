-- =====================================================
-- Script: 02-grant-keycloak-permissions.sql
-- Descripción: Otorgar permisos adicionales a keycloak_user
-- Autor: ePrescription Team
-- Fecha: 2024
-- =====================================================

-- Conectar al PDB (Pluggable Database)
ALTER SESSION SET CONTAINER = XEPDB1;

-- Otorgar permisos adicionales para Liquibase
GRANT SELECT ON SYS.DBA_RECYCLEBIN TO keycloak_user;

-- Confirmar
COMMIT;

EXIT;
