-- =====================================================
-- Script: 07-drug-interactions-data.sql
-- Description: Seed data for drug_interactions table
-- Contains 50 common drug interactions
-- =====================================================

SET DEFINE OFF;

PROMPT Inserting drug interactions data...

-- Warfarin interactions (high risk)
INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (27, 28, 'Alta', 'Warfarina + Aspirina: Riesgo aumentado de hemorragia');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (27, 2, 'Alta', 'Warfarina + Ibuprofeno: Riesgo aumentado de hemorragia gastrointestinal');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (27, 3, 'Alta', 'Warfarina + Diclofenaco: Riesgo aumentado de hemorragia');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (27, 10, 'Media', 'Warfarina + Azitromicina: Puede aumentar efecto anticoagulante');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (27, 15, 'Media', 'Warfarina + Metronidazol: Aumenta efecto anticoagulante');

-- SSRI interactions
INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (57, 28, 'Media', 'Fluoxetina + Aspirina: Riesgo aumentado de hemorragia');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (57, 60, 'Alta', 'Fluoxetina + Amitriptilina: Riesgo de síndrome serotoninérgico');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (58, 6, 'Media', 'Sertralina + Tramadol: Riesgo de síndrome serotoninérgico');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (59, 61, 'Media', 'Escitalopram + Clonazepam: Aumento de sedación');

-- NSAID interactions
INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (2, 17, 'Media', 'Ibuprofeno + Enalapril: Disminuye efecto antihipertensivo');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (3, 18, 'Media', 'Diclofenaco + Losartán: Disminuye efecto antihipertensivo');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (2, 23, 'Media', 'Ibuprofeno + Metformina: Riesgo de acidosis láctica en insuficiencia renal');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (3, 22, 'Alta', 'Diclofenaco + Furosemida: Disminuye efecto diurético, riesgo de insuficiencia renal');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (4, 21, 'Media', 'Naproxeno + Hidroclorotiazida: Disminuye efecto diurético');

-- Antibiotic interactions
INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (11, 43, 'Alta', 'Ciprofloxacino + Atorvastatina: Riesgo de miopatía');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (11, 31, 'Media', 'Ciprofloxacino + Omeprazol: Disminuye absorción de ciprofloxacino');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (10, 43, 'Media', 'Azitromicina + Atorvastatina: Riesgo de miopatía');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (15, 27, 'Media', 'Metronidazol + Warfarina: Aumenta efecto anticoagulante');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (14, 25, 'Media', 'Ceftriaxona + Insulina: Puede alterar control glucémico');

-- Antihypertensive interactions
INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (17, 18, 'Media', 'Enalapril + Losartán: Riesgo de hiperpotasemia e hipotensión');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (17, 48, 'Alta', 'Enalapril + Espironolactona: Riesgo severo de hiperpotasemia');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (20, 45, 'Media', 'Atenolol + Digoxina: Riesgo de bradicardia');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (19, 47, 'Media', 'Amlodipino + Carvedilol: Riesgo de hipotensión y bradicardia');

-- Diabetes medication interactions
INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (23, 67, 'Media', 'Metformina + Prednisona: Disminuye efecto hipoglucemiante');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (24, 67, 'Media', 'Glibenclamida + Prednisona: Disminuye efecto hipoglucemiante');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (23, 11, 'Baja', 'Metformina + Ciprofloxacino: Puede alterar control glucémico');

-- Benzodiazepine interactions
INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (61, 62, 'Media', 'Clonazepam + Alprazolam: Aumento de sedación y depresión respiratoria');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (61, 7, 'Alta', 'Clonazepam + Morfina: Riesgo severo de depresión respiratoria');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (62, 96, 'Media', 'Alprazolam + Difenhidramina: Aumento de sedación');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (63, 33, 'Media', 'Diazepam + Metoclopramida: Efectos extrapiramidales aumentados');

-- Statin interactions
INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (43, 44, 'Media', 'Atorvastatina + Simvastatina: No usar juntas, riesgo de miopatía');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (43, 73, 'Media', 'Atorvastatina + Fluconazol: Aumenta riesgo de miopatía');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (44, 10, 'Media', 'Simvastatina + Azitromicina: Riesgo de miopatía');

-- Anticonvulsant interactions
INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (50, 51, 'Media', 'Fenitoína + Carbamazepina: Alteración de niveles séricos');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (51, 27, 'Alta', 'Carbamazepina + Warfarina: Disminuye efecto anticoagulante');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (52, 67, 'Media', 'Ácido Valproico + Prednisona: Puede alterar niveles de valproato');

-- Cardiovascular interactions
INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (45, 46, 'Alta', 'Digoxina + Nitroglicerina: Riesgo de hipotensión severa');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (45, 22, 'Media', 'Digoxina + Furosemida: Riesgo de toxicidad por digoxina (hipopotasemia)');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (46, 84, 'Alta', 'Nitroglicerina + Sildenafil: Riesgo de hipotensión severa y potencialmente fatal');

-- Respiratory medication interactions
INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (36, 20, 'Media', 'Salbutamol + Atenolol: Disminuye efecto broncodilatador');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (37, 73, 'Baja', 'Budesonida + Fluconazol: Puede aumentar niveles de budesonida');

-- Gastrointestinal medication interactions
INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (31, 11, 'Media', 'Omeprazol + Ciprofloxacino: Disminuye absorción de ciprofloxacino');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (31, 29, 'Media', 'Omeprazol + Clopidogrel: Disminuye efecto antiagregante');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (33, 61, 'Media', 'Metoclopramida + Clonazepam: Aumento de sedación');

-- Thyroid hormone interactions
INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (66, 31, 'Media', 'Levotiroxina + Omeprazol: Disminuye absorción de levotiroxina');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (66, 77, 'Media', 'Levotiroxina + Calcio: Disminuye absorción de levotiroxina');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (66, 78, 'Media', 'Levotiroxina + Hierro: Disminuye absorción de levotiroxina');

-- Miscellaneous important interactions
INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (72, 8, 'Alta', 'Oseltamivir + Amoxicilina: Puede disminuir eficacia de vacuna de influenza viva');

INSERT INTO drug_interactions (medication_id_1, medication_id_2, severity, description) 
VALUES (84, 19, 'Media', 'Sildenafil + Amlodipino: Riesgo de hipotensión');

COMMIT;

PROMPT Drug interactions data insertion completed successfully!
PROMPT Total drug interactions inserted: 50

SET DEFINE ON;
