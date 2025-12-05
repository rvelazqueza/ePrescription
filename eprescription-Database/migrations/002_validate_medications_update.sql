-- ============================================================================
-- Tarea 0.2: Validar Actualización de Tabla MEDICATIONS
-- ============================================================================
-- Fecha: 2025-12-04
-- Descripción: Validar que MEDICATIONS tiene columna PAD_TYPE_ID
-- ============================================================================

-- 1. Verificar que la columna PAD_TYPE_ID existe
SELECT COLUMN_NAME, DATA_TYPE, NULLABLE 
FROM USER_TAB_COLUMNS 
WHERE TABLE_NAME = 'MEDICATIONS' AND COLUMN_NAME = 'PAD_TYPE_ID';

-- 2. Verificar que el foreign key existe
SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE 
FROM USER_CONSTRAINTS 
WHERE TABLE_NAME = 'MEDICATIONS' AND CONSTRAINT_NAME LIKE '%PAD_TYPE%';

-- 3. Verificar que medicamentos existentes tienen PAD_TYPE_ID = NULL
SELECT COUNT(*) as TOTAL_MEDICAMENTOS, 
       SUM(CASE WHEN PAD_TYPE_ID IS NULL THEN 1 ELSE 0 END) as CON_PAD_TYPE_NULL
FROM MEDICATIONS;

-- 4. Verificar integridad referencial
SELECT m.MEDICATION_ID, m.COMMERCIAL_NAME, m.PAD_TYPE_ID, ppt.PAD_TYPE_NAME
FROM MEDICATIONS m
LEFT JOIN PRESCRIPTION_PAD_TYPES ppt ON m.PAD_TYPE_ID = ppt.PAD_TYPE_ID
WHERE m.PAD_TYPE_ID IS NOT NULL;

-- ============================================================================
-- FIN: Validación Tarea 0.2
-- ============================================================================
