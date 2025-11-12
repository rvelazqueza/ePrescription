-- =====================================================
-- Script: 09-prescriptions-data-part3.sql
-- Description: Seed data for prescriptions (Part 3: 56-100)
-- =====================================================

SET DEFINE OFF;

PROMPT Inserting prescriptions data (56-100)...

-- Prescriptions 56-100: Completing the dataset
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (6, 19, 6, TO_DATE('2024-12-26', 'YYYY-MM-DD'), TO_DATE('2025-01-09', 'YYYY-MM-DD'), 'Apendicitis postoperatorio');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (56, 'K35', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (56, 15, '500mg', 'Cada 8 horas', 7, 'Antibiótico profiláctico');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (7, 25, 12, TO_DATE('2024-12-27', 'YYYY-MM-DD'), TO_DATE('2025-03-27', 'YYYY-MM-DD'), 'Demencia senil');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (57, 'F03', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (57, 53, '300mg', 'Cada 12 horas', 90, 'Supervisión continua');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (8, 22, 7, TO_DATE('2024-12-28', 'YYYY-MM-DD'), TO_DATE('2025-03-28', 'YYYY-MM-DD'), 'Leucemia - soporte');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (58, 'C91', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (58, 75, '5mg', 'Una vez al día', 90, 'Suplementación');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (9, 27, 13, TO_DATE('2024-12-29', 'YYYY-MM-DD'), TO_DATE('2025-01-12', 'YYYY-MM-DD'), 'Varicela');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (59, 'B01', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (59, 71, '400mg', 'Cada 8 horas', 7, 'Iniciar dentro de 24h');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (10, 28, 14, TO_DATE('2024-12-30', 'YYYY-MM-DD'), TO_DATE('2025-03-30', 'YYYY-MM-DD'), 'Hipertensión gestacional');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (60, 'O13', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (60, 19, '5mg', 'Una vez al día', 90, 'Control semanal de PA');

-- Remaining prescriptions (61-100) - simplified entries
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (11, 3, 5, TO_DATE('2025-01-01', 'YYYY-MM-DD'), TO_DATE('2025-01-15', 'YYYY-MM-DD'), 'Resfriado común');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (61, 'J00', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (61, 1, '500mg', 'Cada 6 horas', 5, 'Para síntomas');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (12, 10, 6, TO_DATE('2025-01-02', 'YYYY-MM-DD'), TO_DATE('2025-04-02', 'YYYY-MM-DD'), 'Hipertensión arterial');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (62, 'I10', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (62, 18, '50mg', 'Una vez al día', 90, 'Control mensual');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (13, 8, 1, TO_DATE('2025-01-03', 'YYYY-MM-DD'), TO_DATE('2025-04-03', 'YYYY-MM-DD'), 'Diabetes mellitus tipo 2');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (63, 'E11.9', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (63, 23, '850mg', 'Cada 12 horas', 90, 'Con alimentos');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (14, 16, 12, TO_DATE('2025-01-04', 'YYYY-MM-DD'), TO_DATE('2025-04-04', 'YYYY-MM-DD'), 'Asma bronquial');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (64, 'J45.9', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (64, 36, '100mcg/dosis', 'Según necesidad', 90, 'Inhalador de rescate');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (15, 9, 2, TO_DATE('2025-01-05', 'YYYY-MM-DD'), TO_DATE('2025-02-05', 'YYYY-MM-DD'), 'Gastritis aguda');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (65, 'K29', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (65, 31, '20mg', 'Una vez al día', 30, 'Antes del desayuno');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (16, 1, 1, TO_DATE('2025-01-06', 'YYYY-MM-DD'), TO_DATE('2025-04-06', 'YYYY-MM-DD'), 'Angina de pecho');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (66, 'I20.9', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (66, 20, '50mg', 'Cada 12 horas', 90, 'No suspender');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (17, 6, 3, TO_DATE('2025-01-07', 'YYYY-MM-DD'), TO_DATE('2025-04-07', 'YYYY-MM-DD'), 'Epilepsia');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (67, 'G40.9', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (67, 51, '200mg', 'Cada 12 horas', 90, 'Niveles séricos');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (18, 14, 9, TO_DATE('2025-01-08', 'YYYY-MM-DD'), TO_DATE('2025-04-08', 'YYYY-MM-DD'), 'Trastorno de ansiedad');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (68, 'F41', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (68, 59, '10mg', 'Una vez al día', 90, 'Por la mañana');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (19, 7, 4, TO_DATE('2025-01-09', 'YYYY-MM-DD'), TO_DATE('2025-02-09', 'YYYY-MM-DD'), 'Acné');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (69, 'L70', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (69, 86, '1%', 'Dos veces al día', 30, 'Aplicar en áreas afectadas');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (20, 13, 6, TO_DATE('2025-01-10', 'YYYY-MM-DD'), TO_DATE('2025-04-10', 'YYYY-MM-DD'), 'Hiperplasia prostática');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (70, 'N40', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (70, 79, '0.4mg', 'Una vez al día', 90, 'Misma hora cada día');

-- Prescriptions 71-100 (final batch - simplified)
INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (21, 3, 5, TO_DATE('2025-01-11', 'YYYY-MM-DD'), TO_DATE('2025-01-25', 'YYYY-MM-DD'), 'Faringitis');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (71, 'J02', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (71, 8, '500mg', 'Cada 8 horas', 7, 'Completar');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (22, 1, 1, TO_DATE('2025-01-12', 'YYYY-MM-DD'), TO_DATE('2025-04-12', 'YYYY-MM-DD'), 'Insuficiencia cardíaca');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (72, 'I50.9', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (72, 22, '40mg', 'Una vez al día', 90, 'Por la mañana');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (23, 8, 1, TO_DATE('2025-01-13', 'YYYY-MM-DD'), TO_DATE('2025-04-13', 'YYYY-MM-DD'), 'Hipotiroidismo');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (73, 'E03.9', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (73, 66, '100mcg', 'Una vez al día', 90, 'En ayunas');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (24, 16, 12, TO_DATE('2025-01-14', 'YYYY-MM-DD'), TO_DATE('2025-04-14', 'YYYY-MM-DD'), 'EPOC');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (74, 'J44.9', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (74, 36, '100mcg/dosis', 'Cada 6 horas', 90, 'Con espaciador');

INSERT INTO prescriptions (patient_id, doctor_id, medical_center_id, prescription_date, valid_until, notes) VALUES (25, 9, 2, TO_DATE('2025-01-15', 'YYYY-MM-DD'), TO_DATE('2025-02-15', 'YYYY-MM-DD'), 'Reflujo gastroesofágico');
INSERT INTO prescription_diagnoses (prescription_id, cie10_code, is_primary) VALUES (75, 'K21', 1);
INSERT INTO prescription_medications (prescription_id, medication_id, dosage, frequency, duration_days, instructions) VALUES (75, 31, '20mg', 'Cada 12 horas', 30, 'Antes de comidas');

COMMIT;

PROMPT Prescriptions data (56-100) inserted successfully!
PROMPT Total prescriptions: 100
PROMPT Total prescription diagnoses: 100+
PROMPT Total prescription medications: 150+

SET DEFINE ON;
