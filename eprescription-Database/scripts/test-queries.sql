-- =====================================================
-- Script: test-queries.sql
-- Description: Advanced test queries to demonstrate database functionality
-- =====================================================
SET SERVEROUTPUT ON;
SET PAGESIZE 30;
SET LINESIZE 150;

PROMPT ========================================
PROMPT Advanced Database Test Queries
PROMPT ========================================

-- 1. Buscar prescripciones de un paciente específico con todos los detalles
PROMPT 
PROMPT 1. Prescripciones completas de Juan Pérez García:
PROMPT ========================================
SELECT 
    p.prescription_id,
    p.prescription_date,
    d.first_name || ' ' || d.last_name as doctor,
    s.name as specialty,
    pd.cie10_code,
    c.description_es as diagnosis,
    pm.medication_id,
    m.generic_name,
    pm.dosage,
    pm.frequency,
    pm.duration_days,
    pm.instructions
FROM prescriptions p
JOIN patients pat ON p.patient_id = pat.patient_id
JOIN doctors d ON p.doctor_id = d.doctor_id
JOIN specialties s ON d.specialty_id = s.specialty_id
JOIN prescription_diagnoses pd ON p.prescription_id = pd.prescription_id
JOIN cie10_catalog c ON pd.cie10_code = c.code
JOIN prescription_medications pm ON p.prescription_id = pm.prescription_id
JOIN medications m ON pm.medication_id = m.medication_id
WHERE pat.first_name = 'Juan' AND pat.last_name = 'Pérez García'
ORDER BY p.prescription_date DESC, pm.medication_id;

-- 2. Verificar interacciones medicamentosas en una prescripción
PROMPT 
PROMPT 2. Verificar interacciones medicamentosas en prescripción #1:
PROMPT ========================================
SELECT DISTINCT
    m1.generic_name as medication_1,
    m2.generic_name as medication_2,
    di.severity,
    di.description as interaction_description
FROM prescription_medications pm1
JOIN prescription_medications pm2 ON pm1.prescription_id = pm2.prescription_id 
    AND pm1.medication_id < pm2.medication_id
JOIN medications m1 ON pm1.medication_id = m1.medication_id
JOIN medications m2 ON pm2.medication_id = m2.medication_id
LEFT JOIN drug_interactions di ON 
    (di.medication_id_1 = pm1.medication_id AND di.medication_id_2 = pm2.medication_id)
    OR (di.medication_id_1 = pm2.medication_id AND di.medication_id_2 = pm1.medication_id)
WHERE pm1.prescription_id = 1
ORDER BY di.severity DESC NULLS LAST;

-- 3. Historial médico completo de un paciente
PROMPT 
PROMPT 3. Historial médico completo de María González López:
PROMPT ========================================
SELECT 
    p.prescription_date,
    d.first_name || ' ' || d.last_name as doctor,
    mc.name as medical_center,
    pd.cie10_code,
    c.description_es as diagnosis,
    COUNT(DISTINCT pm.medication_id) as num_medications
FROM prescriptions p
JOIN patients pat ON p.patient_id = pat.patient_id
JOIN doctors d ON p.doctor_id = d.doctor_id
JOIN doctor_medical_centers dmc ON d.doctor_id = dmc.doctor_id AND dmc.is_primary = 1
JOIN medical_centers mc ON dmc.medical_center_id = mc.medical_center_id
JOIN prescription_diagnoses pd ON p.prescription_id = pd.prescription_id
JOIN cie10_catalog c ON pd.cie10_code = c.code
LEFT JOIN prescription_medications pm ON p.prescription_id = pm.prescription_id
WHERE pat.first_name = 'María' AND pat.last_name = 'González López'
GROUP BY p.prescription_date, d.first_name, d.last_name, mc.name, pd.cie10_code, c.description_es
ORDER BY p.prescription_date DESC;

-- 4. Alergias del paciente vs medicamentos prescritos (verificación de seguridad)
PROMPT 
PROMPT 4. Verificación de alergias - Paciente Juan Pérez García:
PROMPT ========================================
SELECT 
    pa.allergen,
    pa.severity as allergy_severity,
    p.prescription_id,
    p.prescription_date,
    m.generic_name,
    CASE 
        WHEN UPPER(m.generic_name) LIKE '%' || UPPER(pa.allergen) || '%' 
        OR UPPER(m.brand_name) LIKE '%' || UPPER(pa.allergen) || '%'
        THEN '⚠️ ALERTA: POSIBLE ALERGIA'
        ELSE '✓ Sin conflicto aparente'
    END as safety_check
FROM patient_allergies pa
JOIN patients pat ON pa.patient_id = pat.patient_id
CROSS JOIN prescriptions p
JOIN prescription_medications pm ON p.prescription_id = pm.prescription_id
JOIN medications m ON pm.medication_id = m.medication_id
WHERE pat.first_name = 'Juan' 
  AND pat.last_name = 'Pérez García'
  AND p.patient_id = pat.patient_id
ORDER BY pa.severity DESC, p.prescription_date DESC;

-- 5. Inventario bajo en farmacias (alertas de stock)
PROMPT 
PROMPT 5. Alertas de inventario bajo (stock < mínimo):
PROMPT ========================================
SELECT 
    ph.name as pharmacy,
    ph.city,
    m.generic_name,
    m.brand_name,
    i.quantity_available,
    i.minimum_stock,
    (i.minimum_stock - i.quantity_available) as units_needed,
    i.expiration_date,
    CASE 
        WHEN i.expiration_date < SYSDATE + 30 THEN '⚠️ EXPIRA PRONTO'
        ELSE 'OK'
    END as expiration_status
FROM inventory i
JOIN pharmacies ph ON i.pharmacy_id = ph.pharmacy_id
JOIN medications m ON i.medication_id = m.medication_id
WHERE i.quantity_available < i.minimum_stock
ORDER BY (i.minimum_stock - i.quantity_available) DESC, i.expiration_date;

-- 6. Estadísticas de prescripciones por especialidad médica
PROMPT 
PROMPT 6. Estadísticas de prescripciones por especialidad:
PROMPT ========================================
SELECT 
    s.name as specialty,
    COUNT(DISTINCT p.prescription_id) as total_prescriptions,
    COUNT(DISTINCT p.patient_id) as unique_patients,
    COUNT(DISTINCT pm.medication_id) as different_medications,
    ROUND(AVG(pm.duration_days), 1) as avg_treatment_days
FROM prescriptions p
JOIN doctors d ON p.doctor_id = d.doctor_id
JOIN specialties s ON d.specialty_id = s.specialty_id
LEFT JOIN prescription_medications pm ON p.prescription_id = pm.prescription_id
GROUP BY s.name
ORDER BY total_prescriptions DESC;

-- 7. Top 10 medicamentos más prescritos
PROMPT 
PROMPT 7. Top 10 medicamentos más prescritos:
PROMPT ========================================
SELECT 
    m.generic_name,
    m.brand_name,
    COUNT(*) as times_prescribed,
    COUNT(DISTINCT pm.prescription_id) as unique_prescriptions,
    ar.route_name,
    CASE WHEN m.requires_prescription = 1 THEN 'Sí' ELSE 'No' END as requires_rx
FROM prescription_medications pm
JOIN medications m ON pm.medication_id = m.medication_id
JOIN administration_routes ar ON m.administration_route_id = ar.route_id
GROUP BY m.generic_name, m.brand_name, ar.route_name, m.requires_prescription
ORDER BY times_prescribed DESC
FETCH FIRST 10 ROWS ONLY;

-- 8. Diagnósticos más comunes (Top 10 códigos CIE-10)
PROMPT 
PROMPT 8. Top 10 diagnósticos más comunes:
PROMPT ========================================
SELECT 
    pd.cie10_code,
    c.description_es,
    c.category,
    COUNT(*) as frequency,
    COUNT(DISTINCT pd.prescription_id) as unique_prescriptions
FROM prescription_diagnoses pd
JOIN cie10_catalog c ON pd.cie10_code = c.code
GROUP BY pd.cie10_code, c.description_es, c.category
ORDER BY frequency DESC
FETCH FIRST 10 ROWS ONLY;

-- 9. Análisis de dispensaciones por farmacia
PROMPT 
PROMPT 9. Análisis de dispensaciones por farmacia:
PROMPT ========================================
SELECT 
    ph.name as pharmacy,
    ph.city,
    COUNT(DISTINCT d.dispensation_id) as total_dispensations,
    COUNT(DISTINCT d.prescription_id) as unique_prescriptions,
    SUM(di.quantity_dispensed * di.unit_price) as total_revenue,
    ROUND(AVG(di.quantity_dispensed * di.unit_price), 2) as avg_dispensation_value
FROM dispensations d
JOIN pharmacies ph ON d.pharmacy_id = ph.pharmacy_id
JOIN dispensation_items di ON d.dispensation_id = di.dispensation_id
GROUP BY ph.name, ph.city
ORDER BY total_revenue DESC;

-- 10. Auditoría de actividad por usuario
PROMPT 
PROMPT 10. Auditoría de actividad por usuario (últimos 20 registros):
PROMPT ========================================
SELECT 
    al.timestamp,
    u.username,
    r.role_name,
    al.action,
    al.entity_type,
    al.entity_id,
    SUBSTR(al.details, 1, 50) as details_preview
FROM audit_logs al
LEFT JOIN users u ON al.user_id = u.user_id
LEFT JOIN user_roles ur ON u.user_id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.role_id
ORDER BY al.timestamp DESC
FETCH FIRST 20 ROWS ONLY;

-- 11. Análisis de uso del asistente de IA
PROMPT 
PROMPT 11. Análisis de uso del asistente de IA:
PROMPT ========================================
SELECT 
    aal.analysis_type,
    COUNT(*) as total_analyses,
    ROUND(AVG(aal.confidence_score), 3) as avg_confidence,
    ROUND(AVG(aal.processing_time_ms), 0) as avg_processing_ms,
    MIN(aal.processing_time_ms) as min_processing_ms,
    MAX(aal.processing_time_ms) as max_processing_ms
FROM ai_analysis_logs aal
GROUP BY aal.analysis_type
ORDER BY total_analyses DESC;

-- 12. Médicos más activos
PROMPT 
PROMPT 12. Top 10 médicos más activos:
PROMPT ========================================
SELECT 
    d.first_name || ' ' || d.last_name as doctor_name,
    d.medical_license,
    s.name as specialty,
    COUNT(DISTINCT p.prescription_id) as total_prescriptions,
    COUNT(DISTINCT p.patient_id) as unique_patients,
    COUNT(DISTINCT mc.medical_center_id) as medical_centers
FROM doctors d
JOIN specialties s ON d.specialty_id = s.specialty_id
LEFT JOIN prescriptions p ON d.doctor_id = p.doctor_id
LEFT JOIN doctor_medical_centers dmc ON d.doctor_id = dmc.doctor_id
LEFT JOIN medical_centers mc ON dmc.medical_center_id = mc.medical_center_id
GROUP BY d.first_name, d.last_name, d.medical_license, s.name
ORDER BY total_prescriptions DESC
FETCH FIRST 10 ROWS ONLY;

-- 13. Búsqueda de diagnósticos relacionados con diabetes
PROMPT 
PROMPT 13. Prescripciones con diagnósticos de diabetes:
PROMPT ========================================
SELECT 
    pat.first_name || ' ' || pat.last_name as patient,
    p.prescription_date,
    pd.cie10_code,
    c.description_es as diagnosis,
    d.first_name || ' ' || d.last_name as doctor,
    COUNT(pm.medication_id) as num_medications
FROM prescriptions p
JOIN patients pat ON p.patient_id = pat.patient_id
JOIN doctors d ON p.doctor_id = d.doctor_id
JOIN prescription_diagnoses pd ON p.prescription_id = pd.prescription_id
JOIN cie10_catalog c ON pd.cie10_code = c.code
LEFT JOIN prescription_medications pm ON p.prescription_id = pm.prescription_id
WHERE UPPER(c.description_es) LIKE '%DIABETES%'
GROUP BY pat.first_name, pat.last_name, p.prescription_date, pd.cie10_code, c.description_es, d.first_name, d.last_name
ORDER BY p.prescription_date DESC;

-- 14. Contactos de emergencia de pacientes
PROMPT 
PROMPT 14. Contactos de emergencia (primeros 10 pacientes):
PROMPT ========================================
SELECT 
    p.first_name || ' ' || p.last_name as patient,
    p.phone as patient_phone,
    pc.contact_name,
    pc.relationship,
    pc.phone as emergency_phone,
    pc.email as emergency_email
FROM patients p
JOIN patient_contacts pc ON p.patient_id = pc.patient_id
WHERE pc.is_emergency_contact = 1
ORDER BY p.last_name, p.first_name
FETCH FIRST 10 ROWS ONLY;

-- 15. Resumen general del sistema
PROMPT 
PROMPT 15. Resumen general del sistema:
PROMPT ========================================
SELECT 'Pacientes' as entity, COUNT(*) as total FROM patients
UNION ALL
SELECT 'Médicos', COUNT(*) FROM doctors
UNION ALL
SELECT 'Farmacias', COUNT(*) FROM pharmacies
UNION ALL
SELECT 'Medicamentos', COUNT(*) FROM medications
UNION ALL
SELECT 'Prescripciones', COUNT(*) FROM prescriptions
UNION ALL
SELECT 'Dispensaciones', COUNT(*) FROM dispensations
UNION ALL
SELECT 'Códigos CIE-10', COUNT(*) FROM cie10_catalog
UNION ALL
SELECT 'Usuarios del sistema', COUNT(*) FROM users
UNION ALL
SELECT 'Registros de auditoría', COUNT(*) FROM audit_logs
UNION ALL
SELECT 'Análisis de IA', COUNT(*) FROM ai_analysis_logs
ORDER BY entity;

PROMPT 
PROMPT ========================================
PROMPT Test Queries Completed Successfully!
PROMPT ========================================
