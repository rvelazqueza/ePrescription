-- =====================================================
-- Diagnostic Queries for Oracle SQL Developer
-- Run these queries to diagnose the inventory issue
-- =====================================================

-- 1. Check if inventory table exists
SELECT table_name 
FROM user_tables 
WHERE table_name = 'INVENTORY';

-- 2. Check table structure
DESC inventory;

-- 3. Count records in inventory
SELECT COUNT(*) as inventory_count FROM inventory;

-- 4. Count records in related tables
SELECT 'pharmacies' as table_name, COUNT(*) as count FROM pharmacies
UNION ALL
SELECT 'medications', COUNT(*) FROM medications
UNION ALL
SELECT 'inventory', COUNT(*) FROM inventory;

-- 5. Check if there are any records at all
SELECT * FROM inventory WHERE ROWNUM <= 5;

-- 6. Check for any constraints that might be preventing inserts
SELECT constraint_name, constraint_type, status, search_condition
FROM user_constraints
WHERE table_name = 'INVENTORY';

-- 7. Check if the seed script was executed (check audit logs)
SELECT action, entity_type, details, timestamp
FROM audit_logs
WHERE entity_type = 'INVENTORY'
ORDER BY timestamp DESC;

-- 8. Verify pharmacies exist (needed for FK)
SELECT pharmacy_id, name FROM pharmacies ORDER BY pharmacy_id;

-- 9. Verify medications exist (needed for FK)
SELECT medication_id, generic_name FROM medications WHERE ROWNUM <= 10;

-- 10. Try to manually insert a test record
-- (Run this separately to see if there's an error)
/*
INSERT INTO inventory (
    pharmacy_id, 
    medication_id, 
    quantity_available, 
    minimum_stock, 
    unit_price, 
    batch_number, 
    expiration_date
) VALUES (
    1, 
    1, 
    100, 
    20, 
    0.50, 
    'TEST-2024-001', 
    TO_DATE('2025-12-31', 'YYYY-MM-DD')
);
COMMIT;
*/

-- 11. Check if data was rolled back
SELECT COUNT(*) FROM inventory;
