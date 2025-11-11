-- =====================================================
-- Script: init.sql
-- Descripción: Script maestro de inicialización de base de datos
-- Autor: ePrescription Team
-- Fecha: 2024-11-11
-- =====================================================
-- Este script ejecuta todos los scripts DDL en el orden correcto
-- para crear el esquema completo de la base de datos ePrescription
-- =====================================================

SET ECHO ON
SET SERVEROUTPUT ON
SPOOL init_log.txt

PROMPT =====================================================
PROMPT Iniciando creación del esquema ePrescription
PROMPT Fecha: 
SELECT TO_CHAR(SYSDATE, 'DD-MON-YYYY HH24:MI:SS') FROM DUAL;
PROMPT =====================================================

PROMPT
PROMPT [1/11] Creando tabla CIE10_CATALOG...
@@01-DDL/01-cie10-catalog.sql

PROMPT
PROMPT [2/11] Creando tabla ADDRESSES...
@@01-DDL/02-addresses.sql

PROMPT
PROMPT [3/11] Creando tablas de PATIENTS...
@@01-DDL/03-patients.sql

PROMPT
PROMPT [4/11] Creando tablas de DOCTORS y SPECIALTIES...
@@01-DDL/04-doctors-specialties.sql

PROMPT
PROMPT [5/11] Creando tablas de MEDICAL_CENTERS...
@@01-DDL/05-medical-centers.sql

PROMPT
PROMPT [6/11] Creando tablas de PRESCRIPTIONS...
@@01-DDL/06-prescriptions.sql

PROMPT
PROMPT [7/11] Creando tablas de MEDICATIONS...
@@01-DDL/07-medications.sql

PROMPT
PROMPT [8/11] Creando tablas de PHARMACIES e INVENTORY...
@@01-DDL/08-pharmacies-inventory.sql

PROMPT
PROMPT [9/11] Creando tablas de SECURITY...
@@01-DDL/09-security.sql

PROMPT
PROMPT [10/11] Creando tablas de AUDIT...
@@01-DDL/10-audit.sql

PROMPT
PROMPT [11/11] Creando TRIGGERS...
@@01-DDL/11-triggers.sql

PROMPT
PROMPT =====================================================
PROMPT Verificando tablas creadas...
PROMPT =====================================================

SELECT 'Total de tablas creadas: ' || COUNT(*) as resultado
FROM user_tables;

PROMPT
PROMPT Listado de tablas:
SELECT table_name, num_rows 
FROM user_tables 
ORDER BY table_name;

PROMPT
PROMPT =====================================================
PROMPT Verificando triggers creados...
PROMPT =====================================================

SELECT 'Total de triggers creados: ' || COUNT(*) as resultado
FROM user_triggers;

PROMPT
PROMPT Listado de triggers:
SELECT trigger_name, table_name, status 
FROM user_triggers 
ORDER BY table_name, trigger_name;

PROMPT
PROMPT =====================================================
PROMPT Verificando constraints...
PROMPT =====================================================

SELECT 'Total de constraints: ' || COUNT(*) as resultado
FROM user_constraints;

PROMPT
PROMPT Constraints por tipo:
SELECT constraint_type, COUNT(*) as total
FROM user_constraints
GROUP BY constraint_type
ORDER BY constraint_type;

PROMPT
PROMPT =====================================================
PROMPT Verificando índices...
PROMPT =====================================================

SELECT 'Total de índices: ' || COUNT(*) as resultado
FROM user_indexes;

PROMPT
PROMPT =====================================================
PROMPT Inicialización completada exitosamente
PROMPT Fecha: 
SELECT TO_CHAR(SYSDATE, 'DD-MON-YYYY HH24:MI:SS') FROM DUAL;
PROMPT =====================================================

SPOOL OFF

EXIT;
