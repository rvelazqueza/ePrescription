-- Verificar estado actual
SELECT 'Pharmacies' as entity, COUNT(*) as count FROM pharmacies
UNION ALL
SELECT 'Medications', COUNT(*) FROM medications
UNION ALL
SELECT 'Inventory', COUNT(*) FROM inventory;

-- Ver qué farmacias tienen inventario
SELECT 
    ph.pharmacy_id,
    ph.name,
    COUNT(i.inventory_id) as inventory_count
FROM pharmacies ph
LEFT JOIN inventory i ON ph.pharmacy_id = i.pharmacy_id
GROUP BY ph.pharmacy_id, ph.name
ORDER BY ph.pharmacy_id;

-- Ver farmacias SIN inventario
SELECT 
    ph.pharmacy_id,
    ph.name,
    ph.city
FROM pharmacies ph
WHERE ph.pharmacy_id NOT IN (SELECT DISTINCT pharmacy_id FROM inventory)
ORDER BY ph.pharmacy_id;
