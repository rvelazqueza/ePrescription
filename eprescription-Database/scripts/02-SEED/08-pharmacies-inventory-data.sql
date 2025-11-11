-- =====================================================
-- Script: 08-pharmacies-inventory-data.sql
-- Description: Seed data for pharmacies and inventory tables
-- Contains 20 pharmacies with inventory data
-- =====================================================

SET DEFINE OFF;

PROMPT Inserting pharmacies data...

-- Pharmacies in Quito
INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Farmacia Cruz Azul Centro', 'ARCSA-FARM-QUI-001', 6, '022950100', 'quito.centro@cruzazul.com.ec', 'Lun-Vie: 8:00-20:00, Sáb: 8:00-18:00');

INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Fybeca La Carolina', 'ARCSA-FARM-QUI-002', 7, '023827100', 'carolina@fybeca.com', 'Lun-Dom: 7:00-22:00');

INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Pharmacys Quito Norte', 'ARCSA-FARM-QUI-003', 8, '022470200', 'quitonorte@pharmacys.com.ec', 'Lun-Vie: 8:00-19:00, Sáb: 8:00-17:00');

INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Sana Sana El Bosque', 'ARCSA-FARM-QUI-004', 9, '023334400', 'elbosque@sanasana.com.ec', 'Lun-Vie: 8:00-20:00, Sáb-Dom: 9:00-18:00');

INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Medicity Quicentro', 'ARCSA-FARM-QUI-005', 10, '023827200', 'quicentro@medicity.com.ec', 'Lun-Dom: 9:00-21:00');

-- Pharmacies in Guayaquil
INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Farmacia Cruz Azul Kennedy', 'ARCSA-FARM-GYE-001', 16, '042289700', 'kennedy@cruzazul.com.ec', 'Lun-Vie: 8:00-20:00, Sáb: 8:00-18:00');

INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Fybeca Mall del Sol', 'ARCSA-FARM-GYE-002', 17, '042643200', 'malldelsol@fybeca.com', 'Lun-Dom: 9:00-21:00');

INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Pharmacys Urdesa', 'ARCSA-FARM-GYE-003', 18, '042881500', 'urdesa@pharmacys.com.ec', 'Lun-Vie: 8:00-19:00, Sáb: 8:00-17:00');

INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Sana Sana Alborada', 'ARCSA-FARM-GYE-004', 19, '042240300', 'alborada@sanasana.com.ec', 'Lun-Vie: 8:00-20:00, Sáb-Dom: 9:00-18:00');

INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Medicity San Marino', 'ARCSA-FARM-GYE-005', 20, '042643300', 'sanmarino@medicity.com.ec', 'Lun-Dom: 9:00-21:00');

-- Pharmacies in Cuenca
INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Farmacia Cruz Azul Cuenca', 'ARCSA-FARM-CUE-001', 24, '072831200', 'cuenca@cruzazul.com.ec', 'Lun-Vie: 8:00-19:00, Sáb: 8:00-17:00');

INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Fybeca Mall del Río', 'ARCSA-FARM-CUE-002', 25, '072885100', 'malldelrio@fybeca.com', 'Lun-Dom: 9:00-21:00');

INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Pharmacys Centro Histórico', 'ARCSA-FARM-CUE-003', 22, '072831300', 'centrohistorico@pharmacys.com.ec', 'Lun-Vie: 8:00-18:00, Sáb: 8:00-16:00');

INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Sana Sana Cuenca', 'ARCSA-FARM-CUE-004', 23, '072885200', 'cuenca@sanasana.com.ec', 'Lun-Vie: 8:00-20:00, Sáb: 9:00-18:00');

-- Pharmacies in other cities
INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Farmacia Cruz Azul Ambato', 'ARCSA-FARM-AMB-001', 27, '032421800', 'ambato@cruzazul.com.ec', 'Lun-Vie: 8:00-19:00, Sáb: 8:00-17:00');

INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Fybeca Ambato', 'ARCSA-FARM-AMB-002', 28, '032824100', 'ambato@fybeca.com', 'Lun-Sáb: 8:00-20:00, Dom: 9:00-18:00');

INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Farmacia Cruz Azul Manta', 'ARCSA-FARM-MAN-001', 32, '052927500', 'manta@cruzazul.com.ec', 'Lun-Vie: 8:00-19:00, Sáb: 8:00-17:00');

INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Fybeca Manta', 'ARCSA-FARM-MAN-002', 33, '052620100', 'manta@fybeca.com', 'Lun-Sáb: 8:00-20:00, Dom: 9:00-18:00');

INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Farmacia Cruz Azul Loja', 'ARCSA-FARM-LOJ-001', 37, '072570100', 'loja@cruzazul.com.ec', 'Lun-Vie: 8:00-19:00, Sáb: 8:00-17:00');

INSERT INTO pharmacies (name, license_number, address_id, phone, email, operating_hours) 
VALUES ('Fybeca Loja', 'ARCSA-FARM-LOJ-002', 38, '072571200', 'loja@fybeca.com', 'Lun-Sáb: 8:00-20:00, Dom: 9:00-18:00');

COMMIT;

PROMPT Inserting inventory data...

-- Inventory for Pharmacy 1 (Farmacia Cruz Azul Centro)
INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (1, 1, 500, 100, 0.25, 'PARA-2024-001', TO_DATE('2025-12-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (1, 2, 300, 80, 0.35, 'IBU-2024-002', TO_DATE('2025-11-30', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (1, 8, 200, 50, 1.50, 'AMOX-2024-003', TO_DATE('2025-10-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (1, 10, 150, 40, 2.80, 'AZI-2024-004', TO_DATE('2025-09-30', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (1, 17, 180, 50, 1.20, 'ENA-2024-005', TO_DATE('2026-01-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (1, 23, 220, 60, 0.80, 'MET-2024-006', TO_DATE('2025-12-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (1, 31, 250, 70, 1.50, 'OME-2024-007', TO_DATE('2025-11-30', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (1, 36, 100, 30, 8.50, 'SAL-2024-008', TO_DATE('2026-02-28', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (1, 40, 120, 35, 0.60, 'LOR-2024-009', TO_DATE('2025-10-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (1, 43, 90, 25, 3.20, 'ATO-2024-010', TO_DATE('2026-03-31', 'YYYY-MM-DD'));

-- Inventory for Pharmacy 2 (Fybeca La Carolina)
INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (2, 1, 600, 120, 0.28, 'PARA-2024-011', TO_DATE('2026-01-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (2, 3, 250, 70, 0.95, 'DIC-2024-012', TO_DATE('2025-12-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (2, 9, 180, 50, 2.20, 'AMOXCLAV-2024-013', TO_DATE('2025-11-30', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (2, 18, 200, 55, 1.80, 'LOS-2024-014', TO_DATE('2026-02-28', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (2, 24, 140, 40, 1.50, 'GLI-2024-015', TO_DATE('2025-10-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (2, 28, 300, 80, 0.15, 'ASA-2024-016', TO_DATE('2026-03-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (2, 32, 160, 45, 0.80, 'RAN-2024-017', TO_DATE('2025-12-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (2, 37, 80, 25, 12.50, 'BUD-2024-018', TO_DATE('2026-01-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (2, 57, 110, 30, 4.50, 'FLU-2024-019', TO_DATE('2025-11-30', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (2, 66, 130, 35, 2.80, 'LEV-2024-020', TO_DATE('2026-02-28', 'YYYY-MM-DD'));

-- Inventory for Pharmacy 6 (Farmacia Cruz Azul Kennedy - Guayaquil)
INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (6, 1, 550, 110, 0.26, 'PARA-2024-021', TO_DATE('2025-12-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (6, 2, 320, 85, 0.38, 'IBU-2024-022', TO_DATE('2026-01-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (6, 11, 170, 45, 3.50, 'CIP-2024-023', TO_DATE('2025-11-30', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (6, 19, 190, 50, 1.40, 'AML-2024-024', TO_DATE('2026-02-28', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (6, 27, 75, 20, 5.80, 'WAR-2024-025', TO_DATE('2025-10-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (6, 29, 140, 40, 6.20, 'CLO-2024-026', TO_DATE('2026-03-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (6, 34, 200, 60, 1.20, 'OND-2024-027', TO_DATE('2025-12-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (6, 44, 95, 25, 3.50, 'SIM-2024-028', TO_DATE('2026-01-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (6, 58, 105, 30, 5.20, 'SER-2024-029', TO_DATE('2025-11-30', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (6, 67, 180, 50, 1.80, 'PRE-2024-030', TO_DATE('2026-02-28', 'YYYY-MM-DD'));

-- Inventory for Pharmacy 11 (Farmacia Cruz Azul Cuenca)
INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (11, 1, 450, 100, 0.27, 'PARA-2024-031', TO_DATE('2026-01-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (11, 4, 200, 55, 0.45, 'NAP-2024-032', TO_DATE('2025-12-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (11, 12, 130, 35, 4.20, 'LEV-2024-033', TO_DATE('2025-11-30', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (11, 20, 160, 45, 2.10, 'ATE-2024-034', TO_DATE('2026-02-28', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (11, 25, 60, 15, 18.50, 'INS-2024-035', TO_DATE('2025-10-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (11, 38, 140, 40, 2.50, 'MON-2024-036', TO_DATE('2026-03-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (11, 41, 170, 50, 0.65, 'CET-2024-037', TO_DATE('2025-12-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (11, 61, 85, 25, 3.80, 'CLO-2024-038', TO_DATE('2026-01-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (11, 71, 100, 30, 6.50, 'ACI-2024-039', TO_DATE('2025-11-30', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (11, 75, 120, 35, 0.40, 'FOL-2024-040', TO_DATE('2026-02-28', 'YYYY-MM-DD'));

-- Inventory for remaining pharmacies (simplified - 5 medications each)
-- Pharmacy 3
INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (3, 1, 400, 90, 0.25, 'PARA-2024-041', TO_DATE('2025-12-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (3, 8, 180, 45, 1.55, 'AMOX-2024-042', TO_DATE('2025-11-30', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (3, 17, 150, 40, 1.25, 'ENA-2024-043', TO_DATE('2026-01-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (3, 31, 200, 60, 1.55, 'OME-2024-044', TO_DATE('2025-12-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (3, 43, 80, 20, 3.25, 'ATO-2024-045', TO_DATE('2026-02-28', 'YYYY-MM-DD'));

-- Pharmacy 4
INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (4, 2, 350, 90, 0.36, 'IBU-2024-046', TO_DATE('2025-12-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (4, 10, 140, 35, 2.85, 'AZI-2024-047', TO_DATE('2025-11-30', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (4, 23, 210, 55, 0.82, 'MET-2024-048', TO_DATE('2026-01-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (4, 36, 95, 28, 8.60, 'SAL-2024-049', TO_DATE('2026-02-28', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (4, 57, 100, 28, 4.55, 'FLU-2024-050', TO_DATE('2025-12-31', 'YYYY-MM-DD'));

-- Pharmacy 5
INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (5, 1, 500, 100, 0.26, 'PARA-2024-051', TO_DATE('2026-01-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (5, 11, 160, 42, 3.55, 'CIP-2024-052', TO_DATE('2025-11-30', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (5, 18, 190, 50, 1.82, 'LOS-2024-053', TO_DATE('2026-02-28', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (5, 28, 280, 75, 0.16, 'ASA-2024-054', TO_DATE('2025-12-31', 'YYYY-MM-DD'));

INSERT INTO inventory (pharmacy_id, medication_id, quantity_available, minimum_stock, unit_price, batch_number, expiration_date) 
VALUES (5, 66, 125, 33, 2.85, 'LEV-2024-055', TO_DATE('2026-01-31', 'YYYY-MM-DD'));

COMMIT;

PROMPT Pharmacies and inventory data insertion completed successfully!
PROMPT Total pharmacies inserted: 20
PROMPT Total inventory records inserted: 60

SET DEFINE ON;
