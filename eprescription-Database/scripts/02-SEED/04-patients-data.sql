-- =====================================================
-- Script: 04-patients-data.sql
-- Description: Seed data for patients, patient_contacts, and patient_allergies tables
-- Contains 50 mock patients with contacts and allergies
-- =====================================================

SET DEFINE OFF;

PROMPT Inserting patients data...

-- Patient 1
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1712345678', 'CI', 'Juan', 'Pérez García', TO_DATE('1985-03-15', 'YYYY-MM-DD'), 'M', 'O+', 1, 'juan.perez@email.com', '0987654321');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (1, 'María Pérez', 'Esposa', '0987654322', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (1, 'Penicilina', 'Alta', 'Reacción anafiláctica documentada');

-- Patient 2
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1723456789', 'CI', 'María', 'González López', TO_DATE('1990-07-22', 'YYYY-MM-DD'), 'F', 'A+', 2, 'maria.gonzalez@email.com', '0987654323');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (2, 'Carlos González', 'Padre', '0987654324', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (2, 'Aspirina', 'Media', 'Urticaria leve');

-- Patient 3
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1734567890', 'CI', 'Carlos', 'Rodríguez Sánchez', TO_DATE('1978-11-30', 'YYYY-MM-DD'), 'M', 'B+', 3, 'carlos.rodriguez@email.com', '0987654325');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (3, 'Ana Rodríguez', 'Esposa', '0987654326', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (3, 'Mariscos', 'Alta', 'Anafilaxia severa');

-- Patient 4
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1745678901', 'CI', 'Ana', 'Martínez Torres', TO_DATE('1995-05-18', 'YYYY-MM-DD'), 'F', 'AB+', 4, 'ana.martinez@email.com', '0987654327');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (4, 'Luis Martínez', 'Hermano', '0987654328', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (4, 'Polen', 'Baja', 'Rinitis alérgica estacional');

-- Patient 5
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1756789012', 'CI', 'Luis', 'Fernández Ruiz', TO_DATE('1982-09-25', 'YYYY-MM-DD'), 'M', 'O-', 5, 'luis.fernandez@email.com', '0987654329');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (5, 'Carmen Fernández', 'Madre', '0987654330', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (5, 'Ibuprofeno', 'Media', 'Reacción cutánea');

-- Patient 6
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1767890123', 'CI', 'Carmen', 'López Díaz', TO_DATE('1988-12-10', 'YYYY-MM-DD'), 'F', 'A-', 6, 'carmen.lopez@email.com', '0987654331');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (6, 'Pedro López', 'Esposo', '0987654332', 1);

-- Patient 7
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1778901234', 'CI', 'Pedro', 'Ramírez Castro', TO_DATE('1975-04-08', 'YYYY-MM-DD'), 'M', 'B-', 7, 'pedro.ramirez@email.com', '0987654333');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (7, 'Laura Ramírez', 'Hija', '0987654334', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (7, 'Látex', 'Alta', 'Dermatitis de contacto severa');

-- Patient 8
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1789012345', 'CI', 'Laura', 'Morales Vega', TO_DATE('1992-08-14', 'YYYY-MM-DD'), 'F', 'O+', 8, 'laura.morales@email.com', '0987654335');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (8, 'Jorge Morales', 'Padre', '0987654336', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (8, 'Sulfamidas', 'Alta', 'Síndrome de Stevens-Johnson previo');

-- Patient 9
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1790123456', 'CI', 'Jorge', 'Herrera Ortiz', TO_DATE('1980-01-20', 'YYYY-MM-DD'), 'M', 'A+', 9, 'jorge.herrera@email.com', '0987654337');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (9, 'Sofía Herrera', 'Esposa', '0987654338', 1);

-- Patient 10
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1701234567', 'CI', 'Sofía', 'Jiménez Romero', TO_DATE('1987-06-05', 'YYYY-MM-DD'), 'F', 'B+', 10, 'sofia.jimenez@email.com', '0987654339');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (10, 'Miguel Jiménez', 'Hermano', '0987654340', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (10, 'Nueces', 'Alta', 'Anafilaxia documentada');

-- Patient 11
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0912345678', 'CI', 'Miguel', 'Torres Navarro', TO_DATE('1993-10-12', 'YYYY-MM-DD'), 'M', 'AB-', 11, 'miguel.torres@email.com', '0987654341');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (11, 'Elena Torres', 'Madre', '0987654342', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (11, 'Contraste yodado', 'Media', 'Reacción alérgica moderada');

-- Patient 12
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0923456789', 'CI', 'Elena', 'Vargas Mendoza', TO_DATE('1991-02-28', 'YYYY-MM-DD'), 'F', 'O-', 12, 'elena.vargas@email.com', '0987654343');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (12, 'Roberto Vargas', 'Esposo', '0987654344', 1);

-- Patient 13
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0934567890', 'CI', 'Roberto', 'Castro Silva', TO_DATE('1984-07-16', 'YYYY-MM-DD'), 'M', 'A-', 13, 'roberto.castro@email.com', '0987654345');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (13, 'Patricia Castro', 'Esposa', '0987654346', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (13, 'Amoxicilina', 'Alta', 'Urticaria generalizada');

-- Patient 14
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0945678901', 'CI', 'Patricia', 'Reyes Flores', TO_DATE('1989-11-03', 'YYYY-MM-DD'), 'F', 'B-', 14, 'patricia.reyes@email.com', '0987654347');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (14, 'Daniel Reyes', 'Hermano', '0987654348', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (14, 'Ácaros del polvo', 'Baja', 'Asma leve');

-- Patient 15
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0956789012', 'CI', 'Daniel', 'Mendoza Paredes', TO_DATE('1986-04-21', 'YYYY-MM-DD'), 'M', 'O+', 15, 'daniel.mendoza@email.com', '0987654349');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (15, 'Gabriela Mendoza', 'Esposa', '0987654350', 1);

-- Patient 16
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0967890123', 'CI', 'Gabriela', 'Ortega Campos', TO_DATE('1994-09-07', 'YYYY-MM-DD'), 'F', 'A+', 16, 'gabriela.ortega@email.com', '0987654351');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (16, 'Fernando Ortega', 'Padre', '0987654352', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (16, 'Codeína', 'Media', 'Náuseas y vómitos severos');

-- Patient 17
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0978901234', 'CI', 'Fernando', 'Guzmán Rojas', TO_DATE('1981-12-19', 'YYYY-MM-DD'), 'M', 'B+', 17, 'fernando.guzman@email.com', '0987654353');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (17, 'Valeria Guzmán', 'Hija', '0987654354', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (17, 'Huevo', 'Media', 'Reacción gastrointestinal');

-- Patient 18
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0989012345', 'CI', 'Valeria', 'Salazar Mora', TO_DATE('1996-05-26', 'YYYY-MM-DD'), 'F', 'AB+', 18, 'valeria.salazar@email.com', '0987654355');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (18, 'Ricardo Salazar', 'Padre', '0987654356', 1);

-- Patient 19
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0990123456', 'CI', 'Ricardo', 'Ponce León', TO_DATE('1983-08-11', 'YYYY-MM-DD'), 'M', 'O-', 19, 'ricardo.ponce@email.com', '0987654357');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (19, 'Mónica Ponce', 'Esposa', '0987654358', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (19, 'Diclofenaco', 'Alta', 'Broncoespasmo severo');

-- Patient 20
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0901234567', 'CI', 'Mónica', 'Ríos Aguilar', TO_DATE('1990-03-04', 'YYYY-MM-DD'), 'F', 'A-', 20, 'monica.rios@email.com', '0987654359');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (20, 'Andrés Ríos', 'Hermano', '0987654360', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (20, 'Leche', 'Baja', 'Intolerancia a la lactosa');

-- Patient 21
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0102345678', 'CI', 'Andrés', 'Vega Suárez', TO_DATE('1977-01-15', 'YYYY-MM-DD'), 'M', 'B-', 21, 'andres.vega@email.com', '0987654361');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (21, 'Isabel Vega', 'Esposa', '0987654362', 1);

-- Patient 22
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0113456789', 'CI', 'Isabel', 'Cruz Delgado', TO_DATE('1992-06-22', 'YYYY-MM-DD'), 'F', 'O+', 22, 'isabel.cruz@email.com', '0987654363');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (22, 'Javier Cruz', 'Padre', '0987654364', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (22, 'Metronidazol', 'Media', 'Reacción cutánea');

-- Patient 23
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0124567890', 'CI', 'Javier', 'Molina Cortés', TO_DATE('1985-11-08', 'YYYY-MM-DD'), 'M', 'A+', 23, 'javier.molina@email.com', '0987654365');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (23, 'Carolina Molina', 'Esposa', '0987654366', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (23, 'Picadura de abeja', 'Alta', 'Anafilaxia severa');

-- Patient 24
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0135678901', 'CI', 'Carolina', 'Peña Ibarra', TO_DATE('1988-04-17', 'YYYY-MM-DD'), 'F', 'B+', 24, 'carolina.pena@email.com', '0987654367');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (24, 'Diego Peña', 'Hermano', '0987654368', 1);

-- Patient 25
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0146789012', 'CI', 'Diego', 'Soto Bravo', TO_DATE('1979-09-30', 'YYYY-MM-DD'), 'M', 'AB-', 25, 'diego.soto@email.com', '0987654369');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (25, 'Natalia Soto', 'Esposa', '0987654370', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (25, 'Ciprofloxacino', 'Media', 'Tendinitis');

-- Patient 26
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0157890123', 'CI', 'Natalia', 'Campos Ramos', TO_DATE('1991-12-25', 'YYYY-MM-DD'), 'F', 'O-', 26, 'natalia.campos@email.com', '0987654371');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (26, 'Sebastián Campos', 'Esposo', '0987654372', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (26, 'Soja', 'Baja', 'Reacción gastrointestinal leve');

-- Patient 27
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0168901234', 'CI', 'Sebastián', 'Núñez Vera', TO_DATE('1986-07-13', 'YYYY-MM-DD'), 'M', 'A-', 27, 'sebastian.nunez@email.com', '0987654373');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (27, 'Daniela Núñez', 'Esposa', '0987654374', 1);

-- Patient 28
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0179012345', 'CI', 'Daniela', 'Rojas Fuentes', TO_DATE('1993-02-09', 'YYYY-MM-DD'), 'F', 'B-', 28, 'daniela.rojas@email.com', '0987654375');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (28, 'Martín Rojas', 'Padre', '0987654376', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (28, 'Morfina', 'Alta', 'Depresión respiratoria');

-- Patient 29
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0180123456', 'CI', 'Martín', 'Gil Pacheco', TO_DATE('1982-10-27', 'YYYY-MM-DD'), 'M', 'O+', 29, 'martin.gil@email.com', '0987654377');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (29, 'Alejandra Gil', 'Esposa', '0987654378', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (29, 'Gluten', 'Media', 'Enfermedad celíaca');

-- Patient 30
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0191234567', 'CI', 'Alejandra', 'Serrano Lara', TO_DATE('1995-05-14', 'YYYY-MM-DD'), 'F', 'A+', 30, 'alejandra.serrano@email.com', '0987654379');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (30, 'Pablo Serrano', 'Hermano', '0987654380', 1);

-- Patient 31
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1302345678', 'CI', 'Pablo', 'Medina Cárdenas', TO_DATE('1984-08-06', 'YYYY-MM-DD'), 'M', 'B+', 31, 'pablo.medina@email.com', '0987654381');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (31, 'Camila Medina', 'Esposa', '0987654382', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (31, 'Eritromicina', 'Baja', 'Náuseas leves');

-- Patient 32
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1313456789', 'CI', 'Camila', 'Acosta Prieto', TO_DATE('1989-01-23', 'YYYY-MM-DD'), 'F', 'AB+', 32, 'camila.acosta@email.com', '0987654383');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (32, 'Nicolás Acosta', 'Esposo', '0987654384', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (32, 'Fresas', 'Baja', 'Urticaria leve');

-- Patient 33
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1324567890', 'CI', 'Nicolás', 'Benítez Ochoa', TO_DATE('1976-11-11', 'YYYY-MM-DD'), 'M', 'O-', 33, 'nicolas.benitez@email.com', '0987654385');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (33, 'Valentina Benítez', 'Hija', '0987654386', 1);

-- Patient 34
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1335678901', 'CI', 'Valentina', 'Luna Escobar', TO_DATE('1994-06-29', 'YYYY-MM-DD'), 'F', 'A-', 34, 'valentina.luna@email.com', '0987654387');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (34, 'Mateo Luna', 'Hermano', '0987654388', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (34, 'Naproxeno', 'Media', 'Gastritis severa');

-- Patient 35
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1346789012', 'CI', 'Mateo', 'Paredes Solís', TO_DATE('1987-03-18', 'YYYY-MM-DD'), 'M', 'B-', 35, 'mateo.paredes@email.com', '0987654389');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (35, 'Renata Paredes', 'Esposa', '0987654390', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (35, 'Cacahuates', 'Alta', 'Anafilaxia documentada');

-- Patient 36
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1357890123', 'CI', 'Renata', 'Carrillo Montes', TO_DATE('1990-09-02', 'YYYY-MM-DD'), 'F', 'O+', 36, 'renata.carrillo@email.com', '0987654391');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (36, 'Emilio Carrillo', 'Padre', '0987654392', 1);

-- Patient 37
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1368901234', 'CI', 'Emilio', 'Sandoval Arias', TO_DATE('1983-12-16', 'YYYY-MM-DD'), 'M', 'A+', 37, 'emilio.sandoval@email.com', '0987654393');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (37, 'Lucía Sandoval', 'Esposa', '0987654394', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (37, 'Tetraciclina', 'Media', 'Fotosensibilidad');

-- Patient 38
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1379012345', 'CI', 'Lucía', 'Figueroa Zamora', TO_DATE('1996-04-10', 'YYYY-MM-DD'), 'F', 'B+', 38, 'lucia.figueroa@email.com', '0987654395');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (38, 'Tomás Figueroa', 'Hermano', '0987654396', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (38, 'Pelo de gato', 'Baja', 'Rinitis alérgica');

-- Patient 39
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1380123456', 'CI', 'Tomás', 'Cabrera Duarte', TO_DATE('1981-07-24', 'YYYY-MM-DD'), 'M', 'AB-', 39, 'tomas.cabrera@email.com', '0987654397');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (39, 'Mariana Cabrera', 'Esposa', '0987654398', 1);

-- Patient 40
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('1391234567', 'CI', 'Mariana', 'Espinoza Barrios', TO_DATE('1992-10-31', 'YYYY-MM-DD'), 'F', 'O-', 40, 'mariana.espinoza@email.com', '0987654399');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (40, 'Santiago Espinoza', 'Padre', '0987654400', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (40, 'Vancomicina', 'Alta', 'Síndrome del hombre rojo');

-- Patient 41
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0702345678', 'CI', 'Santiago', 'Maldonado Chávez', TO_DATE('1978-02-14', 'YYYY-MM-DD'), 'M', 'A-', 41, 'santiago.maldonado@email.com', '0987654401');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (41, 'Victoria Maldonado', 'Esposa', '0987654402', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (41, 'Trigo', 'Media', 'Intolerancia al gluten');

-- Patient 42
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0713456789', 'CI', 'Victoria', 'Guerrero Palacios', TO_DATE('1991-05-20', 'YYYY-MM-DD'), 'F', 'B-', 42, 'victoria.guerrero@email.com', '0987654403');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (42, 'Maximiliano Guerrero', 'Hermano', '0987654404', 1);

-- Patient 43
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0724567890', 'CI', 'Maximiliano', 'Velasco Ibáñez', TO_DATE('1985-08-07', 'YYYY-MM-DD'), 'M', 'O+', 43, 'maximiliano.velasco@email.com', '0987654405');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (43, 'Antonella Velasco', 'Esposa', '0987654406', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (43, 'Ketoprofeno', 'Media', 'Reacción cutánea');

-- Patient 44
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0735678901', 'CI', 'Antonella', 'Cano Méndez', TO_DATE('1993-11-19', 'YYYY-MM-DD'), 'F', 'A+', 44, 'antonella.cano@email.com', '0987654407');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (44, 'Benjamín Cano', 'Padre', '0987654408', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (44, 'Chocolate', 'Baja', 'Migraña');

-- Patient 45
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0746789012', 'CI', 'Benjamín', 'Ávila Santana', TO_DATE('1980-01-28', 'YYYY-MM-DD'), 'M', 'B+', 45, 'benjamin.avila@email.com', '0987654409');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (45, 'Florencia Ávila', 'Esposa', '0987654410', 1);

-- Patient 46
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0757890123', 'CI', 'Florencia', 'Domínguez Peña', TO_DATE('1988-06-12', 'YYYY-MM-DD'), 'F', 'AB+', 46, 'florencia.dominguez@email.com', '0987654411');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (46, 'Joaquín Domínguez', 'Hermano', '0987654412', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (46, 'Clindamicina', 'Media', 'Colitis pseudomembranosa');

-- Patient 47
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0768901234', 'CI', 'Joaquín', 'Bravo Cortez', TO_DATE('1986-09-26', 'YYYY-MM-DD'), 'M', 'O-', 47, 'joaquin.bravo@email.com', '0987654413');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (47, 'Catalina Bravo', 'Esposa', '0987654414', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (47, 'Anestesia local', 'Alta', 'Reacción anafiláctica');

-- Patient 48
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0779012345', 'CI', 'Catalina', 'Rivas Quintero', TO_DATE('1994-12-05', 'YYYY-MM-DD'), 'F', 'A-', 48, 'catalina.rivas@email.com', '0987654415');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (48, 'Ignacio Rivas', 'Padre', '0987654416', 1);

-- Patient 49
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0780123456', 'CI', 'Ignacio', 'Sosa Villalobos', TO_DATE('1982-03-21', 'YYYY-MM-DD'), 'M', 'B-', 49, 'ignacio.sosa@email.com', '0987654417');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (49, 'Julieta Sosa', 'Esposa', '0987654418', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (49, 'Propofol', 'Media', 'Hipotensión severa');

-- Patient 50
INSERT INTO patients (identification_number, identification_type, first_name, last_name, date_of_birth, gender, blood_type, address_id, email, phone) 
VALUES ('0791234567', 'CI', 'Julieta', 'Navarro Hidalgo', TO_DATE('1997-07-08', 'YYYY-MM-DD'), 'F', 'O+', 50, 'julieta.navarro@email.com', '0987654419');

INSERT INTO patient_contacts (patient_id, contact_name, relationship, phone, is_emergency_contact) 
VALUES (50, 'Agustín Navarro', 'Hermano', '0987654420', 1);

INSERT INTO patient_allergies (patient_id, allergen, severity, notes) 
VALUES (50, 'Kiwi', 'Baja', 'Síndrome de alergia oral');

COMMIT;

PROMPT Patients data insertion completed successfully!
PROMPT Total patients inserted: 50
PROMPT Total patient contacts inserted: 50
PROMPT Total patient allergies inserted: 35

SET DEFINE ON;
