-- Quick test queries
SET PAGESIZE 20;
SET LINESIZE 120;

-- 1. Resumen general
SELECT 'Pacientes' as entity, COUNT(*) as total FROM patients
UNION ALL
SELECT 'Médicos', COUNT(*) FROM doctors
UNION ALL
SELECT 'Prescripciones', COUNT(*) FROM prescriptions
UNION ALL
SELECT 'Medicamentos', COUNT(*) FROM medications
UNION ALL
SELECT 'Farmacias', COUNT(*) FROM pharmacies
UNION ALL
SELECT 'Códigos CIE-10', COUNT(*) FROM cie10_catalog;

-- 2. Top 5 medicamentos más prescritos
SELECT 
    m.generic_name,
    COUNT(*) as times_prescribed
FROM prescription_medications pm
JOIN medications m ON pm.medication_id = m.medication_id
GROUP BY m.generic_name
ORDER BY times_prescribed DESC
FETCH FIRST 5 ROWS ONLY;

-- 3. Prescripciones recientes
SELECT 
    p.prescription_id,
    pat.first_name || ' ' || pat.last_name as patient,
    d.first_name || ' ' || d.last_name as doctor,
    p.prescription_date
FROM prescriptions p
JOIN patients pat ON p.patient_id = pat.patient_id
JOIN doctors d ON p.doctor_id = d.doctor_id
ORDER BY p.prescription_date DESC
FETCH FIRST 5 ROWS ONLY;

EXIT;
