-- =====================================================
-- Script: 03-specialties-routes-data.sql
-- Description: Seed data for specialties and administration_routes tables
-- =====================================================

SET DEFINE OFF;

PROMPT Inserting specialties data...

-- Medical Specialties
INSERT INTO specialties (name, description) 
VALUES ('Medicina General', 'Atención médica general y preventiva');

INSERT INTO specialties (name, description) 
VALUES ('Cardiología', 'Especialidad médica que se ocupa de las enfermedades del corazón y del aparato circulatorio');

INSERT INTO specialties (name, description) 
VALUES ('Dermatología', 'Especialidad médica que se ocupa de las enfermedades de la piel');

INSERT INTO specialties (name, description) 
VALUES ('Endocrinología', 'Especialidad médica que estudia las hormonas y las glándulas que las producen');

INSERT INTO specialties (name, description) 
VALUES ('Gastroenterología', 'Especialidad médica que se ocupa del aparato digestivo y sus enfermedades');

INSERT INTO specialties (name, description) 
VALUES ('Ginecología y Obstetricia', 'Especialidad médica que trata las enfermedades del sistema reproductor femenino y el embarazo');

INSERT INTO specialties (name, description) 
VALUES ('Hematología', 'Especialidad médica que estudia la sangre y sus enfermedades');

INSERT INTO specialties (name, description) 
VALUES ('Infectología', 'Especialidad médica que se dedica al estudio, diagnóstico y tratamiento de las enfermedades infecciosas');

INSERT INTO specialties (name, description) 
VALUES ('Medicina Interna', 'Especialidad médica que se dedica a la atención integral del adulto');

INSERT INTO specialties (name, description) 
VALUES ('Nefrología', 'Especialidad médica que estudia las enfermedades del riñón');

INSERT INTO specialties (name, description) 
VALUES ('Neumología', 'Especialidad médica que se ocupa de las enfermedades del aparato respiratorio');

INSERT INTO specialties (name, description) 
VALUES ('Neurología', 'Especialidad médica que trata los trastornos del sistema nervioso');

INSERT INTO specialties (name, description) 
VALUES ('Oftalmología', 'Especialidad médica que estudia las enfermedades de los ojos');

INSERT INTO specialties (name, description) 
VALUES ('Oncología', 'Especialidad médica que estudia y trata el cáncer');

INSERT INTO specialties (name, description) 
VALUES ('Ortopedia y Traumatología', 'Especialidad médica dedicada al diagnóstico y tratamiento de lesiones del sistema musculoesquelético');

INSERT INTO specialties (name, description) 
VALUES ('Otorrinolaringología', 'Especialidad médica que trata las enfermedades del oído, nariz y garganta');

INSERT INTO specialties (name, description) 
VALUES ('Pediatría', 'Especialidad médica que estudia al niño y sus enfermedades');

INSERT INTO specialties (name, description) 
VALUES ('Psiquiatría', 'Especialidad médica dedicada al estudio y tratamiento de los trastornos mentales');

INSERT INTO specialties (name, description) 
VALUES ('Reumatología', 'Especialidad médica que se ocupa de las enfermedades del aparato locomotor y del tejido conectivo');

INSERT INTO specialties (name, description) 
VALUES ('Urología', 'Especialidad médica que se ocupa del estudio del aparato urinario y reproductor masculino');

INSERT INTO specialties (name, description) 
VALUES ('Cirugía General', 'Especialidad médica que se ocupa de procedimientos quirúrgicos del aparato digestivo y otros órganos');

INSERT INTO specialties (name, description) 
VALUES ('Anestesiología', 'Especialidad médica dedicada a la anestesia y el manejo del dolor');

INSERT INTO specialties (name, description) 
VALUES ('Radiología', 'Especialidad médica que utiliza imágenes para diagnosticar y tratar enfermedades');

INSERT INTO specialties (name, description) 
VALUES ('Medicina de Emergencia', 'Especialidad médica que se ocupa de la atención de urgencias y emergencias');

INSERT INTO specialties (name, description) 
VALUES ('Geriatría', 'Especialidad médica que se ocupa de la salud de las personas mayores');

COMMIT;

PROMPT Inserting administration routes data...

-- Administration Routes for Medications
INSERT INTO administration_routes (route_name, description) 
VALUES ('Oral', 'Administración por vía oral (boca)');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Sublingual', 'Administración debajo de la lengua');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Intravenosa (IV)', 'Administración directa en vena');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Intramuscular (IM)', 'Administración en músculo');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Subcutánea (SC)', 'Administración bajo la piel');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Tópica', 'Aplicación sobre la piel');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Transdérmica', 'Absorción a través de la piel (parches)');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Inhalatoria', 'Administración por inhalación');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Nasal', 'Administración por vía nasal');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Oftálmica', 'Aplicación en los ojos');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Ótica', 'Aplicación en los oídos');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Rectal', 'Administración por vía rectal');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Vaginal', 'Administración por vía vaginal');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Intradérmica (ID)', 'Administración en la dermis');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Intraperitoneal', 'Administración en la cavidad peritoneal');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Intratecal', 'Administración en el espacio subaracnoideo');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Epidural', 'Administración en el espacio epidural');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Intraarticular', 'Administración dentro de una articulación');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Bucal', 'Administración entre la mejilla y la encía');

INSERT INTO administration_routes (route_name, description) 
VALUES ('Parenteral', 'Administración que evita el tracto gastrointestinal');

COMMIT;

PROMPT Specialties and administration routes data insertion completed successfully!
PROMPT Total specialties inserted: 25
PROMPT Total administration routes inserted: 20

SET DEFINE ON;
