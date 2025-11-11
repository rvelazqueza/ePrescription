-- =====================================================
-- Script: 05-medical-centers-doctors-data.sql
-- Description: Seed data for medical_centers, doctors, and doctor_medical_centers tables
-- Contains medical centers and 30 mock doctors with specialty assignments
-- =====================================================

SET DEFINE OFF;

PROMPT Inserting medical centers data...

-- Medical Centers in Quito
INSERT INTO medical_centers (name, center_type, address_id, phone, email) 
VALUES ('Hospital Metropolitano', 'Hospital', 1, '023998000', 'info@hospitalmetropolitano.org');

INSERT INTO medical_centers (name, center_type, address_id, phone, email) 
VALUES ('Hospital de los Valles', 'Hospital', 2, '022976900', 'contacto@hospitaldelosvalles.com');

INSERT INTO medical_centers (name, center_type, address_id, phone, email) 
VALUES ('Hospital Vozandes Quito', 'Hospital', 3, '022262142', 'info@hospitalvozandes.org');

INSERT INTO medical_centers (name, center_type, address_id, phone, email) 
VALUES ('Clínica Pichincha', 'Clínica', 4, '022999000', 'contacto@clinicapichincha.com');

INSERT INTO medical_centers (name, center_type, address_id, phone, email) 
VALUES ('Centro Médico Meditrópoli', 'Centro Médico', 5, '023827000', 'info@meditropoli.com');

-- Medical Centers in Guayaquil
INSERT INTO medical_centers (name, center_type, address_id, phone, email) 
VALUES ('Hospital Clínica Kennedy', 'Hospital', 11, '042289666', 'info@hospitalkenned.med.ec');

INSERT INTO medical_centers (name, center_type, address_id, phone, email) 
VALUES ('Hospital Luis Vernaza', 'Hospital', 12, '042560300', 'contacto@hlvernaza.org');

INSERT INTO medical_centers (name, center_type, address_id, phone, email) 
VALUES ('Clínica Guayaquil', 'Clínica', 13, '042563555', 'info@clinicaguayaquil.com');

INSERT INTO medical_centers (name, center_type, address_id, phone, email) 
VALUES ('Hospital Alcívar', 'Hospital', 14, '042380300', 'contacto@hospitalalcivar.com');

INSERT INTO medical_centers (name, center_type, address_id, phone, email) 
VALUES ('Centro Médico Omnihospital', 'Centro Médico', 15, '042109200', 'info@omnihospital.com');

-- Medical Centers in Cuenca
INSERT INTO medical_centers (name, center_type, address_id, phone, email) 
VALUES ('Hospital Monte Sinaí', 'Hospital', 21, '074885595', 'info@montesinai.org.ec');

INSERT INTO medical_centers (name, center_type, address_id, phone, email) 
VALUES ('Hospital Santa Inés', 'Hospital', 22, '072817888', 'contacto@hospitalsantaines.org');

INSERT INTO medical_centers (name, center_type, address_id, phone, email) 
VALUES ('Clínica Santa Ana', 'Clínica', 23, '072888181', 'info@clinicasantaana.com');

-- Medical Centers in other cities
INSERT INTO medical_centers (name, center_type, address_id, phone, email) 
VALUES ('Hospital IESS Ambato', 'Hospital', 26, '032421777', 'contacto@iessambato.gob.ec');

INSERT INTO medical_centers (name, center_type, address_id, phone, email) 
VALUES ('Hospital IESS Manta', 'Hospital', 31, '052927400', 'info@iessmanta.gob.ec');

COMMIT;

PROMPT Inserting doctors data...

-- Doctor 1 - Cardiología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('1710234567', 'CI', 'Roberto', 'Andrade Morales', 'MSP-CARD-2015-001', 2, 'roberto.andrade@hospital.com', '0991234567');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (1, 1, 1);

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (1, 4, 0);

-- Doctor 2 - Pediatría
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('1720345678', 'CI', 'Patricia', 'Salinas Vega', 'MSP-PED-2016-002', 17, 'patricia.salinas@hospital.com', '0991234568');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (2, 2, 1);

-- Doctor 3 - Medicina General
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('1730456789', 'CI', 'Carlos', 'Mendoza Torres', 'MSP-MG-2017-003', 1, 'carlos.mendoza@clinica.com', '0991234569');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (3, 5, 1);

-- Doctor 4 - Ginecología y Obstetricia
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('1740567890', 'CI', 'María', 'Castillo Ruiz', 'MSP-GO-2015-004', 6, 'maria.castillo@hospital.com', '0991234570');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (4, 1, 1);

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (4, 3, 0);

-- Doctor 5 - Traumatología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('1750678901', 'CI', 'Fernando', 'Paredes Sánchez', 'MSP-TRAUM-2018-005', 15, 'fernando.paredes@hospital.com', '0991234571');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (5, 2, 1);

-- Doctor 6 - Neurología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('1760789012', 'CI', 'Ana', 'Guerrero López', 'MSP-NEURO-2016-006', 12, 'ana.guerrero@hospital.com', '0991234572');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (6, 3, 1);

-- Doctor 7 - Dermatología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('1770890123', 'CI', 'Luis', 'Ramírez Castro', 'MSP-DERM-2017-007', 3, 'luis.ramirez@clinica.com', '0991234573');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (7, 4, 1);

-- Doctor 8 - Endocrinología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('1780901234', 'CI', 'Carmen', 'Flores Díaz', 'MSP-ENDO-2015-008', 4, 'carmen.flores@hospital.com', '0991234574');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (8, 1, 1);

-- Doctor 9 - Gastroenterología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('1791012345', 'CI', 'Jorge', 'Moreno Vega', 'MSP-GASTRO-2018-009', 5, 'jorge.moreno@hospital.com', '0991234575');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (9, 2, 1);

-- Doctor 10 - Medicina Interna
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0910123456', 'CI', 'Sofía', 'Herrera Ortiz', 'MSP-MI-2016-010', 9, 'sofia.herrera@hospital.com', '0991234576');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (10, 6, 1);

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (10, 10, 0);

-- Doctor 11 - Oftalmología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0920234567', 'CI', 'Miguel', 'Torres Navarro', 'MSP-OFTAL-2017-011', 13, 'miguel.torres@clinica.com', '0991234577');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (11, 8, 1);

-- Doctor 12 - Oncología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0930345678', 'CI', 'Elena', 'Vargas Mendoza', 'MSP-ONCO-2015-012', 14, 'elena.vargas@hospital.com', '0991234578');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (12, 7, 1);

-- Doctor 13 - Urología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0940456789', 'CI', 'Roberto', 'Castro Silva', 'MSP-URO-2018-013', 20, 'roberto.castro@hospital.com', '0991234579');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (13, 6, 1);

-- Doctor 14 - Psiquiatría
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0950567890', 'CI', 'Patricia', 'Reyes Flores', 'MSP-PSI-2016-014', 18, 'patricia.reyes@clinica.com', '0991234580');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (14, 9, 1);

-- Doctor 15 - Reumatología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0960678901', 'CI', 'Daniel', 'Mendoza Paredes', 'MSP-REUMA-2017-015', 19, 'daniel.mendoza@hospital.com', '0991234581');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (15, 11, 1);

-- Doctor 16 - Neumología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0970789012', 'CI', 'Gabriela', 'Ortega Campos', 'MSP-NEUMO-2015-016', 11, 'gabriela.ortega@hospital.com', '0991234582');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (16, 12, 1);

-- Doctor 17 - Nefrología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0980890123', 'CI', 'Fernando', 'Guzmán Rojas', 'MSP-NEFRO-2018-017', 10, 'fernando.guzman@clinica.com', '0991234583');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (17, 13, 1);

-- Doctor 18 - Otorrinolaringología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0990901234', 'CI', 'Valeria', 'Salazar Mora', 'MSP-ORL-2016-018', 16, 'valeria.salazar@hospital.com', '0991234584');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (18, 11, 1);

-- Doctor 19 - Cirugía General
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0901012345', 'CI', 'Ricardo', 'Ponce León', 'MSP-CG-2017-019', 21, 'ricardo.ponce@hospital.com', '0991234585');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (19, 6, 1);

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (19, 7, 0);

-- Doctor 20 - Anestesiología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0102123456', 'CI', 'Mónica', 'Ríos Aguilar', 'MSP-ANES-2015-020', 22, 'monica.rios@hospital.com', '0991234586');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (20, 1, 1);

-- Doctor 21 - Medicina de Emergencia
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0113234567', 'CI', 'Andrés', 'Vega Suárez', 'MSP-EMERG-2018-021', 24, 'andres.vega@hospital.com', '0991234587');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (21, 2, 1);

-- Doctor 22 - Hematología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0124345678', 'CI', 'Isabel', 'Cruz Delgado', 'MSP-HEMAT-2016-022', 7, 'isabel.cruz@hospital.com', '0991234588');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (22, 7, 1);

-- Doctor 23 - Infectología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0135456789', 'CI', 'Javier', 'Molina Cortés', 'MSP-INFEC-2017-023', 8, 'javier.molina@clinica.com', '0991234589');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (23, 8, 1);

-- Doctor 24 - Radiología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0146567890', 'CI', 'Carolina', 'Peña Ibarra', 'MSP-RAD-2015-024', 23, 'carolina.pena@hospital.com', '0991234590');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (24, 6, 1);

-- Doctor 25 - Geriatría
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0157678901', 'CI', 'Diego', 'Soto Bravo', 'MSP-GERIA-2018-025', 25, 'diego.soto@hospital.com', '0991234591');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (25, 12, 1);

-- Doctor 26 - Cardiología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0168789012', 'CI', 'Natalia', 'Campos Ramos', 'MSP-CARD-2016-026', 2, 'natalia.campos@hospital.com', '0991234592');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (26, 11, 1);

-- Doctor 27 - Pediatría
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0179890123', 'CI', 'Sebastián', 'Núñez Vera', 'MSP-PED-2017-027', 17, 'sebastian.nunez@clinica.com', '0991234593');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (27, 13, 1);

-- Doctor 28 - Medicina General
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0180901234', 'CI', 'Daniela', 'Rojas Fuentes', 'MSP-MG-2015-028', 1, 'daniela.rojas@hospital.com', '0991234594');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (28, 14, 1);

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (28, 15, 0);

-- Doctor 29 - Ginecología y Obstetricia
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('0191012345', 'CI', 'Martín', 'Gil Pacheco', 'MSP-GO-2018-029', 6, 'martin.gil@hospital.com', '0991234595');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (29, 9, 1);

-- Doctor 30 - Traumatología
INSERT INTO doctors (identification_number, identification_type, first_name, last_name, medical_license, specialty_id, email, phone) 
VALUES ('1302123456', 'CI', 'Alejandra', 'Serrano Lara', 'MSP-TRAUM-2016-030', 15, 'alejandra.serrano@clinica.com', '0991234596');

INSERT INTO doctor_medical_centers (doctor_id, medical_center_id, is_primary) 
VALUES (30, 14, 1);

COMMIT;

PROMPT Medical centers and doctors data insertion completed successfully!
PROMPT Total medical centers inserted: 15
PROMPT Total doctors inserted: 30
PROMPT Total doctor-medical center assignments: 35

SET DEFINE ON;
