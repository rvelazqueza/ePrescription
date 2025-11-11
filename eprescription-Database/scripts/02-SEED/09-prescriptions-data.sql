-- =====================================================
-- Script: 09-prescriptions-data.sql
-- Description: Seed data for prescriptions, prescription_diagnoses, and prescription_medications tables
-- Contains 100 prescriptions with CIE-10 diagnoses and medications
-- =====================================================

SET DEFINE OFF;

PROMPT Inserting prescriptions data...

-- Prescription 1: Hypertension
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (1, 1, 1, TO_DATE('2024-11-01', 'YYYY-MM-DD'), TO_DATE('2025-02-01', 'YYYY-MM-DD'), 'Control de presión arterial cada 2 semanas');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (1, 'I10', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (1, 17, '10mg', 'Una vez al día', 90, 'Tomar en ayunas por la mañana');

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (1, 21, '25mg', 'Una vez al día', 90, 'Tomar con abundante agua');

-- Prescription 2: Type 2 Diabetes
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (2, 4, 1, TO_DATE('2024-11-02', 'YYYY-MM-DD'), TO_DATE('2025-02-02', 'YYYY-MM-DD'), 'Control de glucemia mensual');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (2, 'E11.9', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (2, 23, '850mg', 'Dos veces al día', 90, 'Tomar con las comidas');

-- Prescription 3: Acute Bronchitis
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (3, 3, 5, TO_DATE('2024-11-03', 'YYYY-MM-DD'), TO_DATE('2024-11-17', 'YYYY-MM-DD'), 'Reposo relativo, abundantes líquidos');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (3, 'J20', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (3, 10, '500mg', 'Una vez al día', 5, 'Tomar con alimentos');

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (3, 100, '30mg/5ml', 'Cada 8 horas', 7, 'Tomar 10ml cada dosis');

-- Prescription 4: Urinary Tract Infection
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (4, 3, 5, TO_DATE('2024-11-04', 'YYYY-MM-DD'), TO_DATE('2024-11-14', 'YYYY-MM-DD'), 'Aumentar ingesta de líquidos');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (4, 'N39.0', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (4, 11, '500mg', 'Cada 12 horas', 7, 'Tomar con abundante agua');

-- Prescription 5: Gastritis
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (5, 9, 2, TO_DATE('2024-11-05', 'YYYY-MM-DD'), TO_DATE('2024-12-05', 'YYYY-MM-DD'), 'Evitar alimentos irritantes');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (5, 'K29', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (5, 31, '20mg', 'Una vez al día', 30, 'Tomar 30 minutos antes del desayuno');

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (5, 94, '400mg/400mg/5ml', 'Cada 8 horas', 15, 'Tomar 10ml después de las comidas');

-- Prescription 6: Migraine
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (6, 6, 3, TO_DATE('2024-11-06', 'YYYY-MM-DD'), TO_DATE('2025-02-06', 'YYYY-MM-DD'), 'Identificar y evitar desencadenantes');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (6, 'G43.9', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (6, 4, '250mg', 'Al inicio del dolor', 30, 'No exceder 3 dosis al día');

-- Prescription 7: Asthma
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (7, 16, 12, TO_DATE('2024-11-07', 'YYYY-MM-DD'), TO_DATE('2025-02-07', 'YYYY-MM-DD'), 'Usar inhalador de rescate según necesidad');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (7, 'J45.9', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (7, 36, '100mcg/dosis', 'Según necesidad', 90, 'Máximo 8 inhalaciones al día');

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (7, 37, '200mcg/dosis', 'Dos inhalaciones cada 12 horas', 90, 'Enjuagar boca después de usar');

-- Prescription 8: Depression
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (8, 14, 9, TO_DATE('2024-11-08', 'YYYY-MM-DD'), TO_DATE('2025-02-08', 'YYYY-MM-DD'), 'Seguimiento psicoterapéutico semanal');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (8, 'F32', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (8, 58, '50mg', 'Una vez al día', 90, 'Tomar por la mañana con alimentos');

-- Prescription 9: Hypothyroidism
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (9, 8, 1, TO_DATE('2024-11-09', 'YYYY-MM-DD'), TO_DATE('2025-02-09', 'YYYY-MM-DD'), 'Control de TSH en 6 semanas');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (9, 'E03.9', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (9, 66, '100mcg', 'Una vez al día', 90, 'Tomar en ayunas, 30 minutos antes del desayuno');

-- Prescription 10: Allergic Rhinitis
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (10, 3, 5, TO_DATE('2024-11-10', 'YYYY-MM-DD'), TO_DATE('2024-12-10', 'YYYY-MM-DD'), 'Evitar alérgenos conocidos');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (10, 'J30', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (10, 40, '10mg', 'Una vez al día', 30, 'Tomar por la noche');

-- Prescriptions 11-20: Various conditions
-- Prescription 11: Pneumonia
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (11, 10, 6, TO_DATE('2024-11-11', 'YYYY-MM-DD'), TO_DATE('2024-11-25', 'YYYY-MM-DD'), 'Reposo absoluto, control en 7 días');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (11, 'J18.9', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (11, 9, '875mg/125mg', 'Cada 12 horas', 10, 'Tomar con alimentos');

-- Prescription 12: Acute Myocardial Infarction (post-event)
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (12, 1, 1, TO_DATE('2024-11-12', 'YYYY-MM-DD'), TO_DATE('2025-02-12', 'YYYY-MM-DD'), 'Rehabilitación cardíaca, control semanal');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (12, 'I21.9', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (12, 28, '100mg', 'Una vez al día', 90, 'Tomar con alimentos');

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (12, 29, '75mg', 'Una vez al día', 90, 'Tomar con alimentos');

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (12, 43, '20mg', 'Una vez al día', 90, 'Tomar por la noche');

-- Prescription 13: Epilepsy
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (13, 6, 3, TO_DATE('2024-11-13', 'YYYY-MM-DD'), TO_DATE('2025-02-13', 'YYYY-MM-DD'), 'No suspender medicación abruptamente');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (13, 'G40.9', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (13, 51, '200mg', 'Cada 12 horas', 90, 'Tomar con alimentos');

-- Prescription 14: Rheumatoid Arthritis
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (14, 15, 11, TO_DATE('2024-11-14', 'YYYY-MM-DD'), TO_DATE('2025-02-14', 'YYYY-MM-DD'), 'Fisioterapia 3 veces por semana');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (14, 'M06', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (14, 3, '50mg', 'Cada 12 horas', 90, 'Tomar con alimentos');

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (14, 31, '20mg', 'Una vez al día', 90, 'Tomar antes del desayuno');

-- Prescription 15: Chronic Kidney Disease
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (15, 17, 13, TO_DATE('2024-11-15', 'YYYY-MM-DD'), TO_DATE('2025-02-15', 'YYYY-MM-DD'), 'Dieta baja en proteínas y sodio');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (15, 'N18', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (15, 17, '5mg', 'Una vez al día', 90, 'Tomar en ayunas');

-- Prescription 16: Benign Prostatic Hyperplasia
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (16, 13, 6, TO_DATE('2024-11-16', 'YYYY-MM-DD'), TO_DATE('2025-02-16', 'YYYY-MM-DD'), 'Evaluación urológica en 3 meses');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (16, 'N40', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (16, 79, '0.4mg', 'Una vez al día', 90, 'Tomar 30 minutos después de la misma comida cada día');

-- Prescription 17: Osteoarthritis
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (17, 5, 2, TO_DATE('2024-11-17', 'YYYY-MM-DD'), TO_DATE('2025-02-17', 'YYYY-MM-DD'), 'Ejercicios de bajo impacto');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (17, 'M19', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (17, 2, '400mg', 'Cada 8 horas', 90, 'Tomar con alimentos');

-- Prescription 18: Anxiety Disorder
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (18, 14, 9, TO_DATE('2024-11-18', 'YYYY-MM-DD'), TO_DATE('2025-02-18', 'YYYY-MM-DD'), 'Terapia cognitivo-conductual');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (18, 'F41', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (18, 62, '0.5mg', 'Cada 12 horas', 90, 'No conducir ni operar maquinaria');

-- Prescription 19: Hyperlipidemia
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (19, 1, 1, TO_DATE('2024-11-19', 'YYYY-MM-DD'), TO_DATE('2025-02-19', 'YYYY-MM-DD'), 'Dieta baja en grasas saturadas');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (19, 'E78.5', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (19, 43, '20mg', 'Una vez al día', 90, 'Tomar por la noche');

-- Prescription 20: Peptic Ulcer
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) 
VALUES (20, 9, 2, TO_DATE('2024-11-20', 'YYYY-MM-DD'), TO_DATE('2024-12-20', 'YYYY-MM-DD'), 'Evitar AINEs y alcohol');

INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) 
VALUES (20, 'K27', 1);

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (20, 31, '40mg', 'Cada 12 horas', 30, 'Tomar antes de las comidas');

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (20, 9, '875mg/125mg', 'Cada 12 horas', 14, 'Tomar con alimentos');

INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) 
VALUES (20, 15, '500mg', 'Cada 8 horas', 14, 'Evitar alcohol durante el tratamiento');

COMMIT;

PROMPT Prescriptions data (1-20) inserted successfully!

-- Prescriptions 21-50: Additional common conditions (compact format)
-- Prescription 21-25: Respiratory conditions
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (21, 16, 12, TO_DATE('2024-11-21', 'YYYY-MM-DD'), TO_DATE('2025-02-21', 'YYYY-MM-DD'), 'COPD - Control mensual');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (21, 'J44.9', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (21, 36, '100mcg/dosis', 'Cada 6 horas', 90, 'Usar con espaciador');
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (21, 37, '200mcg/dosis', 'Cada 12 horas', 90, 'Enjuagar boca después');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (22, 3, 5, TO_DATE('2024-11-22', 'YYYY-MM-DD'), TO_DATE('2024-12-06', 'YYYY-MM-DD'), 'Sinusitis aguda');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (22, 'J01', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (22, 9, '875mg/125mg', 'Cada 12 horas', 10, 'Completar tratamiento');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (23, 16, 12, TO_DATE('2024-11-23', 'YYYY-MM-DD'), TO_DATE('2024-12-23', 'YYYY-MM-DD'), 'Faringitis aguda');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (23, 'J02', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (23, 10, '500mg', 'Una vez al día', 5, 'Tomar con alimentos');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (24, 3, 5, TO_DATE('2024-11-24', 'YYYY-MM-DD'), TO_DATE('2024-12-08', 'YYYY-MM-DD'), 'Influenza');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (24, 'J11', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (24, 72, '75mg', 'Cada 12 horas', 5, 'Iniciar dentro de 48h de síntomas');
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (24, 1, '500mg', 'Cada 6 horas', 7, 'Para fiebre y dolor');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (25, 16, 12, TO_DATE('2024-11-25', 'YYYY-MM-DD'), TO_DATE('2025-02-25', 'YYYY-MM-DD'), 'Rinitis alérgica');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (25, 'J30', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (25, 41, '10mg', 'Una vez al día', 90, 'Tomar por la noche');

-- Prescription 26-30: Cardiovascular conditions
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (26, 26, 11, TO_DATE('2024-11-26', 'YYYY-MM-DD'), TO_DATE('2025-02-26', 'YYYY-MM-DD'), 'Angina estable');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (26, 'I20.9', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (26, 20, '50mg', 'Cada 12 horas', 90, 'No suspender abruptamente');
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (26, 46, '0.5mg', 'Sublingual según necesidad', 30, 'Para dolor de pecho');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (27, 1, 1, TO_DATE('2024-11-27', 'YYYY-MM-DD'), TO_DATE('2025-02-27', 'YYYY-MM-DD'), 'Insuficiencia cardíaca');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (27, 'I50.9', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (27, 17, '10mg', 'Una vez al día', 90, 'Tomar en ayunas');
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (27, 22, '40mg', 'Una vez al día', 90, 'Tomar por la mañana');
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (27, 47, '6.25mg', 'Cada 12 horas', 90, 'Tomar con alimentos');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (28, 26, 11, TO_DATE('2024-11-28', 'YYYY-MM-DD'), TO_DATE('2025-02-28', 'YYYY-MM-DD'), 'Fibrilación auricular');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (28, 'I48', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (28, 27, '5mg', 'Una vez al día', 90, 'Control de INR mensual');
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (28, 45, '0.25mg', 'Una vez al día', 90, 'Tomar a la misma hora');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (29, 1, 1, TO_DATE('2024-11-29', 'YYYY-MM-DD'), TO_DATE('2025-02-28', 'YYYY-MM-DD'), 'Hipertensión + Diabetes');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (29, 'I10', 1);
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (29, 'E11.9', 0);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (29, 18, '50mg', 'Una vez al día', 90, 'Tomar en ayunas');
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (29, 23, '850mg', 'Cada 12 horas', 90, 'Tomar con alimentos');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (30, 26, 11, TO_DATE('2024-11-30', 'YYYY-MM-DD'), TO_DATE('2025-02-28', 'YYYY-MM-DD'), 'Hipercolesterolemia');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (30, 'E78.0', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (30, 44, '20mg', 'Una vez al día', 90, 'Tomar por la noche');

-- Prescription 31-40: Gastrointestinal and metabolic conditions
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (31, 9, 2, TO_DATE('2024-12-01', 'YYYY-MM-DD'), TO_DATE('2025-01-01', 'YYYY-MM-DD'), 'ERGE');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (31, 'K21', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (31, 31, '20mg', 'Cada 12 horas', 30, 'Antes de comidas');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (32, 9, 2, TO_DATE('2024-12-02', 'YYYY-MM-DD'), TO_DATE('2025-01-02', 'YYYY-MM-DD'), 'Síndrome de intestino irritable');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (32, 'K58', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (32, 33, '10mg', 'Antes de comidas', 30, 'Tomar 30 min antes');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (33, 8, 1, TO_DATE('2024-12-03', 'YYYY-MM-DD'), TO_DATE('2025-03-03', 'YYYY-MM-DD'), 'Diabetes tipo 1');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (33, 'E10.9', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (33, 25, '20 UI', 'Cada 12 horas', 90, 'Subcutánea');
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (33, 26, '6 UI', 'Antes de comidas', 90, 'Ajustar según glucemia');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (34, 8, 1, TO_DATE('2024-12-04', 'YYYY-MM-DD'), TO_DATE('2025-03-04', 'YYYY-MM-DD'), 'Obesidad');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (34, 'E66.9', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (34, 23, '850mg', 'Cada 12 horas', 90, 'Dieta y ejercicio');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (35, 9, 2, TO_DATE('2024-12-05', 'YYYY-MM-DD'), TO_DATE('2024-12-19', 'YYYY-MM-DD'), 'Diarrea aguda');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (35, 'A09', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (35, 35, '2mg', 'Después de cada deposición', 5, 'Máximo 8 cápsulas/día');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (36, 9, 2, TO_DATE('2024-12-06', 'YYYY-MM-DD'), TO_DATE('2025-01-06', 'YYYY-MM-DD'), 'Náuseas y vómitos');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (36, 'R11', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (36, 34, '8mg', 'Cada 8 horas', 7, 'Tomar 30 min antes de comidas');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (37, 8, 1, TO_DATE('2024-12-07', 'YYYY-MM-DD'), TO_DATE('2025-03-07', 'YYYY-MM-DD'), 'Hipertiroidismo');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (37, 'E05', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (37, 20, '25mg', 'Cada 12 horas', 90, 'Control de TSH mensual');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (38, 9, 2, TO_DATE('2024-12-08', 'YYYY-MM-DD'), TO_DATE('2025-01-08', 'YYYY-MM-DD'), 'Dispepsia');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (38, 'K30', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (38, 31, '20mg', 'Una vez al día', 30, 'Antes del desayuno');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (39, 8, 1, TO_DATE('2024-12-09', 'YYYY-MM-DD'), TO_DATE('2025-03-09', 'YYYY-MM-DD'), 'Osteoporosis');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (39, 'M81', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (39, 77, '600mg/400UI', 'Una vez al día', 90, 'Tomar con alimentos');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (40, 9, 2, TO_DATE('2024-12-10', 'YYYY-MM-DD'), TO_DATE('2024-12-24', 'YYYY-MM-DD'), 'Colecistitis aguda');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (40, 'K81', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (40, 14, '1g', 'Cada 24 horas IV', 7, 'Hospitalización');

COMMIT;

PROMPT Prescriptions data (21-40) inserted successfully!
