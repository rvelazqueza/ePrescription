-- =====================================================
-- Script: fix-inventory.sql
-- Description: Fix inventory data by re-executing the insert script
-- =====================================================

SET SERVEROUTPUT ON;

PROMPT ========================================
PROMPT Fixing Inventory Data
PROMPT ========================================

-- First, check current state
PROMPT Current inventory count:
SELECT COUNT(*) as current_count FROM inventory;

PROMPT Current pharmacies count:
SELECT COUNT(*) as pharmacies_count FROM pharmacies;

-- Delete existing inventory data (if any)
PROMPT 
PROMPT Deleting existing inventory data...
DELETE FROM inventory;
COMMIT;

PROMPT Inventory cleared. Count after delete:
SELECT COUNT(*) as count_after_delete FROM inventory;

-- Re-execute the inventory data script
PROMPT 
PROMPT Re-inserting inventory data...
@@02-SEED/08-pharmacies-inventory-data.sql

PROMPT 
PROMPT Verification after re-insert:
SELECT COUNT(*) as final_count FROM inventory;

PROMPT 
PROMPT Sample inventory records:
SELECT 
    i.inventory_id,
    ph.name as pharmacy,
    m.generic_name,
    i.quantity_available,
    i.minimum_stock
FROM inventory i
JOIN pharmacies ph ON i.pharmacy_id = ph.pharmacy_id
JOIN medications m ON i.medication_id = m.medication_id
WHERE ROWNUM <= 10;

PROMPT ========================================
PROMPT Inventory Fix Completed!
PROMPT ========================================
