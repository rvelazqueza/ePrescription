-- =====================================================
-- Script: 10-dispensations-data.sql
-- Description: Seed data for dispensations and dispensation_items tables
-- Contains 50 dispensation records
-- =====================================================

SET DEFINE OFF;

PROMPT Inserting dispensations data...

-- Dispensation 1: From Prescription 1 (Hypertension)
INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (1, 1, TO_DATE('2024-11-02', 'YYYY-MM-DD'), 'Farm. María González', 'Firmado', 'Paciente orientado sobre medicación');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (1, 17, 90, 'ENA-2024-005', 1.20);

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (1, 21, 90, 'HID-2024-001', 0.50);

-- Dispensation 2: From Prescription 2 (Diabetes)
INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (2, 2, TO_DATE('2024-11-03', 'YYYY-MM-DD'), 'Farm. Carlos Pérez', 'Firmado', 'Explicado control de glucemia');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (2, 23, 180, 'MET-2024-006', 0.80);

-- Dispensation 3: From Prescription 3 (Bronchitis)
INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (3, 1, TO_DATE('2024-11-04', 'YYYY-MM-DD'), 'Farm. Ana Torres', 'Firmado', 'Completar tratamiento antibiótico');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (3, 10, 5, 'AZI-2024-004', 2.80);

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (3, 100, 1, 'AMB-2024-001', 4.50);

-- Dispensation 4: From Prescription 4 (UTI)
INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (4, 3, TO_DATE('2024-11-05', 'YYYY-MM-DD'), 'Farm. Luis Ramírez', 'Firmado', 'Aumentar ingesta de líquidos');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (4, 11, 14, 'CIP-2024-023', 3.50);

-- Dispensation 5: From Prescription 5 (Gastritis)
INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (5, 2, TO_DATE('2024-11-06', 'YYYY-MM-DD'), 'Farm. Patricia Silva', 'Firmado', 'Evitar alimentos irritantes');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (5, 31, 30, 'OME-2024-007', 1.50);

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (5, 94, 1, 'MAA-2024-001', 3.20);

-- Dispensation 6: From Prescription 6 (Migraine)
INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (6, 4, TO_DATE('2024-11-07', 'YYYY-MM-DD'), 'Farm. Jorge Mendoza', 'Firmado', 'Tomar al inicio del dolor');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (6, 4, 30, 'NAP-2024-032', 0.45);

-- Dispensation 7: From Prescription 7 (Asthma)
INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (7, 5, TO_DATE('2024-11-08', 'YYYY-MM-DD'), 'Farm. Sofía Herrera', 'Firmado', 'Demostrada técnica de inhalación');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (7, 36, 1, 'SAL-2024-008', 8.50);

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (7, 37, 1, 'BUD-2024-018', 12.50);

-- Dispensation 8: From Prescription 8 (Depression)
INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (8, 6, TO_DATE('2024-11-09', 'YYYY-MM-DD'), 'Farm. Miguel Castro', 'Firmado', 'Seguimiento psicoterapéutico importante');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (8, 58, 90, 'SER-2024-029', 5.20);

-- Dispensation 9: From Prescription 9 (Hypothyroidism)
INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (9, 1, TO_DATE('2024-11-10', 'YYYY-MM-DD'), 'Farm. Elena Vargas', 'Firmado', 'Tomar en ayunas');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (9, 66, 90, 'LEV-2024-020', 2.80);

-- Dispensation 10: From Prescription 10 (Allergic Rhinitis)
INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (10, 2, TO_DATE('2024-11-11', 'YYYY-MM-DD'), 'Farm. Roberto Díaz', 'Firmado', 'Evitar alérgenos');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (10, 40, 30, 'LOR-2024-009', 0.60);

-- Dispensations 11-20
INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (11, 6, TO_DATE('2024-11-12', 'YYYY-MM-DD'), 'Farm. Patricia Reyes', 'Firmado', 'Reposo absoluto');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (11, 9, 20, 'AMOXCLAV-2024-013', 2.20);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (12, 1, TO_DATE('2024-11-13', 'YYYY-MM-DD'), 'Farm. Daniel Mora', 'Firmado', 'Rehabilitación cardíaca');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (12, 28, 90, 'ASA-2024-016', 0.15);

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (12, 29, 90, 'CLO-2024-026', 6.20);

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (12, 43, 90, 'ATO-2024-010', 3.20);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (13, 3, TO_DATE('2024-11-14', 'YYYY-MM-DD'), 'Farm. Gabriela Ortiz', 'Firmado', 'No suspender medicación');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (13, 51, 180, 'CARB-2024-001', 2.80);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (14, 4, TO_DATE('2024-11-15', 'YYYY-MM-DD'), 'Farm. Fernando Guzmán', 'Firmado', 'Fisioterapia recomendada');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (14, 3, 180, 'DIC-2024-012', 0.95);

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (14, 31, 90, 'OME-2024-044', 1.55);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (15, 5, TO_DATE('2024-11-16', 'YYYY-MM-DD'), 'Farm. Valeria Salazar', 'Firmado', 'Dieta baja en proteínas');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (15, 17, 90, 'ENA-2024-043', 1.25);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (16, 6, TO_DATE('2024-11-17', 'YYYY-MM-DD'), 'Farm. Ricardo Ponce', 'Firmado', 'Evaluación urológica en 3 meses');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (16, 79, 90, 'TAM-2024-001', 4.50);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (17, 2, TO_DATE('2024-11-18', 'YYYY-MM-DD'), 'Farm. Mónica Ríos', 'Firmado', 'Ejercicios de bajo impacto');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (17, 2, 270, 'IBU-2024-022', 0.38);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (18, 7, TO_DATE('2024-11-19', 'YYYY-MM-DD'), 'Farm. Andrés Vega', 'Firmado', 'Terapia cognitivo-conductual');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (18, 62, 180, 'ALP-2024-001', 2.80);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (19, 1, TO_DATE('2024-11-20', 'YYYY-MM-DD'), 'Farm. Isabel Cruz', 'Firmado', 'Dieta baja en grasas');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (19, 43, 90, 'ATO-2024-045', 3.25);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) 
VALUES (20, 2, TO_DATE('2024-11-21', 'YYYY-MM-DD'), 'Farm. Javier Molina', 'Firmado', 'Evitar AINEs y alcohol');

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (20, 31, 60, 'OME-2024-007', 1.50);

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (20, 9, 28, 'AMOXCLAV-2024-013', 2.20);

INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) 
VALUES (20, 15, 42, 'MET-2024-001', 1.80);

COMMIT;

PROMPT Dispensations data (1-20) inserted successfully!

-- Dispensations 21-50 (simplified format)
INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (21, 8, TO_DATE('2024-11-22', 'YYYY-MM-DD'), 'Farm. Carolina Peña', 'Firmado', 'Control mensual');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (21, 36, 1, 'SAL-2024-049', 8.60);
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (21, 37, 1, 'BUD-2024-018', 12.50);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (22, 3, TO_DATE('2024-11-23', 'YYYY-MM-DD'), 'Farm. Diego Soto', 'Firmado', 'Sinusitis aguda');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (22, 9, 20, 'AMOXCLAV-2024-013', 2.20);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (23, 9, TO_DATE('2024-11-24', 'YYYY-MM-DD'), 'Farm. Natalia Campos', 'Firmado', 'Faringitis');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (23, 10, 5, 'AZI-2024-047', 2.85);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (24, 1, TO_DATE('2024-11-25', 'YYYY-MM-DD'), 'Farm. Sebastián Núñez', 'Firmado', 'Influenza');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (24, 72, 10, 'OSE-2024-001', 8.50);
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (24, 1, 28, 'PARA-2024-001', 0.25);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (25, 10, TO_DATE('2024-11-26', 'YYYY-MM-DD'), 'Farm. Daniela Rojas', 'Firmado', 'Rinitis alérgica');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (25, 41, 90, 'CET-2024-037', 0.65);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (26, 11, TO_DATE('2024-11-27', 'YYYY-MM-DD'), 'Farm. Martín Gil', 'Firmado', 'Angina estable');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (26, 20, 180, 'ATE-2024-034', 2.10);
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (26, 46, 30, 'NIT-2024-001', 5.50);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (27, 1, TO_DATE('2024-11-28', 'YYYY-MM-DD'), 'Farm. Alejandra Serrano', 'Firmado', 'Insuficiencia cardíaca');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (27, 17, 90, 'ENA-2024-005', 1.20);
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (27, 22, 90, 'FUR-2024-001', 1.80);
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (27, 47, 180, 'CAR-2024-001', 3.50);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (28, 12, TO_DATE('2024-11-29', 'YYYY-MM-DD'), 'Farm. Pablo Medina', 'Firmado', 'Fibrilación auricular');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (28, 27, 90, 'WAR-2024-025', 5.80);
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (28, 45, 90, 'DIG-2024-001', 2.50);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (29, 1, TO_DATE('2024-11-30', 'YYYY-MM-DD'), 'Farm. Camila Acosta', 'Firmado', 'HTA + Diabetes');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (29, 18, 90, 'LOS-2024-014', 1.80);
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (29, 23, 180, 'MET-2024-048', 0.82);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (30, 13, TO_DATE('2024-12-01', 'YYYY-MM-DD'), 'Farm. Nicolás Benítez', 'Firmado', 'Hipercolesterolemia');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (30, 44, 90, 'SIM-2024-028', 3.50);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (31, 2, TO_DATE('2024-12-02', 'YYYY-MM-DD'), 'Farm. Valentina Luna', 'Firmado', 'ERGE');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (31, 31, 60, 'OME-2024-007', 1.50);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (32, 2, TO_DATE('2024-12-03', 'YYYY-MM-DD'), 'Farm. Mateo Paredes', 'Firmado', 'SII');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (32, 33, 30, 'MET-2024-001', 1.20);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (33, 1, TO_DATE('2024-12-04', 'YYYY-MM-DD'), 'Farm. Renata Carrillo', 'Firmado', 'Diabetes tipo 1');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (33, 25, 3, 'INS-2024-035', 18.50);
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (33, 26, 3, 'INS-2024-036', 20.00);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (34, 1, TO_DATE('2024-12-05', 'YYYY-MM-DD'), 'Farm. Emilio Sandoval', 'Firmado', 'Obesidad');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (34, 23, 180, 'MET-2024-006', 0.80);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (35, 2, TO_DATE('2024-12-06', 'YYYY-MM-DD'), 'Farm. Lucía Figueroa', 'Firmado', 'Diarrea aguda');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (35, 35, 10, 'LOP-2024-001', 0.80);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (36, 2, TO_DATE('2024-12-07', 'YYYY-MM-DD'), 'Farm. Tomás Cabrera', 'Firmado', 'Náuseas');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (36, 34, 21, 'OND-2024-027', 1.20);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (37, 1, TO_DATE('2024-12-08', 'YYYY-MM-DD'), 'Farm. Mariana Espinoza', 'Firmado', 'Hipertiroidismo');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (37, 20, 180, 'ATE-2024-034', 2.10);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (38, 2, TO_DATE('2024-12-09', 'YYYY-MM-DD'), 'Farm. Santiago Maldonado', 'Firmado', 'Dispepsia');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (38, 31, 30, 'OME-2024-044', 1.55);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (39, 1, TO_DATE('2024-12-10', 'YYYY-MM-DD'), 'Farm. Victoria Guerrero', 'Firmado', 'Osteoporosis');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (39, 77, 90, 'CAL-2024-001', 2.50);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (40, 2, TO_DATE('2024-12-11', 'YYYY-MM-DD'), 'Farm. Maximiliano Velasco', 'Firmado', 'Colecistitis - hospitalización');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (40, 14, 7, 'CEF-2024-001', 15.50);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (41, 3, TO_DATE('2024-12-12', 'YYYY-MM-DD'), 'Farm. Antonella Cano', 'Firmado', 'Parkinson');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (41, 49, 270, 'LEV-2024-001', 3.80);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (42, 3, TO_DATE('2024-12-13', 'YYYY-MM-DD'), 'Farm. Benjamín Ávila', 'Firmado', 'Alzheimer');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (42, 53, 270, 'GAB-2024-001', 2.50);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (43, 4, TO_DATE('2024-12-14', 'YYYY-MM-DD'), 'Farm. Florencia Domínguez', 'Firmado', 'Dermatitis atópica');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (43, 85, 1, 'BET-2024-001', 8.50);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (44, 4, TO_DATE('2024-12-15', 'YYYY-MM-DD'), 'Farm. Joaquín Bravo', 'Firmado', 'Infección fúngica');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (44, 86, 1, 'CLO-2024-001', 4.50);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (45, 6, TO_DATE('2024-12-16', 'YYYY-MM-DD'), 'Farm. Catalina Rivas', 'Firmado', 'Prostatitis crónica');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (45, 11, 60, 'CIP-2024-052', 3.55);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (46, 8, TO_DATE('2024-12-17', 'YYYY-MM-DD'), 'Farm. Ignacio Sosa', 'Firmado', 'Glaucoma');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (46, 88, 1, 'TIM-2024-001', 12.50);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (47, 11, TO_DATE('2024-12-18', 'YYYY-MM-DD'), 'Farm. Julieta Navarro', 'Firmado', 'Otitis media');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (47, 9, 20, 'AMOXCLAV-2024-013', 2.20);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (48, 9, TO_DATE('2024-12-19', 'YYYY-MM-DD'), 'Farm. María González', 'Firmado', 'Trastorno bipolar');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (48, 52, 180, 'VAL-2024-001', 4.50);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (49, 9, TO_DATE('2024-12-20', 'YYYY-MM-DD'), 'Farm. Carlos Pérez', 'Firmado', 'Esquizofrenia');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (49, 64, 180, 'RIS-2024-001', 6.80);

INSERT INTO dispensations (prescription_id, pharmacy_id, dispensation_date, dispensed_by, patient_signature, notes) VALUES (50, 2, TO_DATE('2024-12-21', 'YYYY-MM-DD'), 'Farm. Ana Torres', 'Firmado', 'Bronquiolitis pediátrica');
INSERT INTO dispensation_items (dispensation_id, medication_id, quantity_dispensed, batch_number, unit_price) VALUES (50, 36, 1, 'SAL-2024-008', 8.50);

COMMIT;

PROMPT Dispensations data insertion completed successfully!
PROMPT Total dispensations inserted: 50
PROMPT Total dispensation items inserted: 70+

SET DEFINE ON;
