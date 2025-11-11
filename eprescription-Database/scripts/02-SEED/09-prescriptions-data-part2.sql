-- =====================================================
-- Script: 09-prescriptions-data-part2.sql
-- Description: Seed data for prescriptions (Part 2: 41-100)
-- =====================================================

SET DEFINE OFF;

PROMPT Inserting prescriptions data (41-100)...

-- Prescriptions 41-60: Neurological, Dermatological, and Urological conditions
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (41, 6, 3, TO_DATE('2024-12-11', 'YYYY-MM-DD'), TO_DATE('2025-03-11', 'YYYY-MM-DD'), 'Parkinson');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (41, 'G20', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (41, 49, '250mg/25mg', 'Cada 8 horas', 90, 'Aumentar gradualmente');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (42, 6, 3, TO_DATE('2024-12-12', 'YYYY-MM-DD'), TO_DATE('2025-03-12', 'YYYY-MM-DD'), 'Alzheimer');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (42, 'G30.9', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (42, 53, '300mg', 'Cada 8 horas', 90, 'Supervisión familiar');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (43, 7, 4, TO_DATE('2024-12-13', 'YYYY-MM-DD'), TO_DATE('2025-01-13', 'YYYY-MM-DD'), 'Dermatitis atópica');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (43, 'L20', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (43, 85, '0.1%', 'Dos veces al día', 30, 'Aplicar en áreas afectadas');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (44, 7, 4, TO_DATE('2024-12-14', 'YYYY-MM-DD'), TO_DATE('2024-12-28', 'YYYY-MM-DD'), 'Infección fúngica cutánea');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (44, 'B35', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (44, 86, '1%', 'Dos veces al día', 14, 'Aplicar y extender más allá del área afectada');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (45, 13, 6, TO_DATE('2024-12-15', 'YYYY-MM-DD'), TO_DATE('2025-03-15', 'YYYY-MM-DD'), 'Prostatitis crónica');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (45, 'N41', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (45, 11, '500mg', 'Cada 12 horas', 30, 'Completar tratamiento');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (46, 11, 8, TO_DATE('2024-12-16', 'YYYY-MM-DD'), TO_DATE('2025-01-16', 'YYYY-MM-DD'), 'Glaucoma');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (46, 'H40', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (46, 88, '0.5%', 'Una gota cada 12 horas', 30, 'En ambos ojos');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (47, 18, 11, TO_DATE('2024-12-17', 'YYYY-MM-DD'), TO_DATE('2024-12-31', 'YYYY-MM-DD'), 'Otitis media aguda');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (47, 'H66', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (47, 9, '875mg/125mg', 'Cada 12 horas', 10, 'Completar tratamiento');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (48, 14, 9, TO_DATE('2024-12-18', 'YYYY-MM-DD'), TO_DATE('2025-03-18', 'YYYY-MM-DD'), 'Trastorno bipolar');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (48, 'F31', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (48, 52, '500mg', 'Cada 12 horas', 90, 'Control de niveles séricos');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (49, 14, 9, TO_DATE('2024-12-19', 'YYYY-MM-DD'), TO_DATE('2025-03-19', 'YYYY-MM-DD'), 'Esquizofrenia');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (49, 'F20', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (49, 64, '2mg', 'Cada 12 horas', 90, 'No suspender abruptamente');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (50, 2, 2, TO_DATE('2024-12-20', 'YYYY-MM-DD'), TO_DATE('2025-01-20', 'YYYY-MM-DD'), 'Bronquiolitis (pediátrica)');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (50, 'J21', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (50, 36, '100mcg/dosis', 'Cada 6 horas', 7, 'Con nebulizador');

-- Prescriptions 51-100: Additional varied conditions (compact format)
-- Using patient IDs 1-50 again with different doctors and conditions
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (1, 15, 11, TO_DATE('2024-12-21', 'YYYY-MM-DD'), TO_DATE('2025-03-21', 'YYYY-MM-DD'), 'Gota');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (51, 'M10', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (51, 2, '400mg', 'Cada 8 horas', 90, 'Durante crisis');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (2, 12, 7, TO_DATE('2024-12-22', 'YYYY-MM-DD'), TO_DATE('2025-03-22', 'YYYY-MM-DD'), 'Anemia ferropénica');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (52, 'D50.9', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (52, 78, '325mg', 'Una vez al día', 90, 'Con vitamina C');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (3, 23, 8, TO_DATE('2024-12-23', 'YYYY-MM-DD'), TO_DATE('2025-01-06', 'YYYY-MM-DD'), 'Celulitis');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (53, 'L03', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (53, 13, '500mg', 'Cada 6 horas', 10, 'Completar tratamiento');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (4, 29, 9, TO_DATE('2024-12-24', 'YYYY-MM-DD'), TO_DATE('2025-01-24', 'YYYY-MM-DD'), 'Embarazo - suplementación');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (54, 'Z34', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (54, 75, '5mg', 'Una vez al día', 90, 'Durante todo el embarazo');
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (54, 78, '325mg', 'Una vez al día', 90, 'Con alimentos');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (5, 30, 14, TO_DATE('2024-12-25', 'YYYY-MM-DD'), TO_DATE('2025-01-08', 'YYYY-MM-DD'), 'Fractura de tibia');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (55, 'S82', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (55, 6, '50mg', 'Cada 8 horas', 10, 'Para dolor');
