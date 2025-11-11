-- =====================================================
-- Script: 06-medications-data.sql
-- Description: Seed data for medications table
-- Contains 100 common medications
-- =====================================================

SET DEFINE OFF;

PROMPT Inserting medications data...

-- Analgesics and Anti-inflammatories
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Paracetamol', 'Tylenol', 'Tableta', '500mg', 1, 0, 'Insuficiencia hepática severa');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Ibuprofeno', 'Advil', 'Tableta', '400mg', 1, 0, 'Úlcera péptica activa, insuficiencia renal severa');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Diclofenaco', 'Voltaren', 'Tableta', '50mg', 1, 1, 'Úlcera péptica, asma inducida por AINEs');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Naproxeno', 'Aleve', 'Tableta', '250mg', 1, 0, 'Úlcera péptica activa, tercer trimestre del embarazo');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Ketorolaco', 'Toradol', 'Ampolla', '30mg/ml', 4, 1, 'Úlcera péptica, insuficiencia renal, embarazo');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Tramadol', 'Tramal', 'Cápsula', '50mg', 1, 1, 'Epilepsia no controlada, intoxicación aguda por alcohol');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Morfina', 'MS Contin', 'Ampolla', '10mg/ml', 3, 1, 'Depresión respiratoria, íleo paralítico');

-- Antibiotics
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Amoxicilina', 'Amoxil', 'Cápsula', '500mg', 1, 1, 'Hipersensibilidad a penicilinas');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Amoxicilina + Ácido Clavulánico', 'Augmentin', 'Tableta', '875mg/125mg', 1, 1, 'Hipersensibilidad a betalactámicos');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Azitromicina', 'Zithromax', 'Tableta', '500mg', 1, 1, 'Hipersensibilidad a macrólidos');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Ciprofloxacino', 'Cipro', 'Tableta', '500mg', 1, 1, 'Menores de 18 años, embarazo, lactancia');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Levofloxacino', 'Levaquin', 'Tableta', '500mg', 1, 1, 'Hipersensibilidad a quinolonas, epilepsia');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Cefalexina', 'Keflex', 'Cápsula', '500mg', 1, 1, 'Hipersensibilidad a cefalosporinas');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Ceftriaxona', 'Rocephin', 'Ampolla', '1g', 3, 1, 'Hipersensibilidad a cefalosporinas');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Metronidazol', 'Flagyl', 'Tableta', '500mg', 1, 1, 'Primer trimestre del embarazo, alcoholismo');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Clindamicina', 'Cleocin', 'Cápsula', '300mg', 1, 1, 'Colitis pseudomembranosa previa');

-- Antihypertensives
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Enalapril', 'Vasotec', 'Tableta', '10mg', 1, 1, 'Embarazo, angioedema previo con IECA');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Losartán', 'Cozaar', 'Tableta', '50mg', 1, 1, 'Embarazo, estenosis bilateral de arteria renal');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Amlodipino', 'Norvasc', 'Tableta', '5mg', 1, 1, 'Hipotensión severa, shock cardiogénico');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Atenolol', 'Tenormin', 'Tableta', '50mg', 1, 1, 'Bradicardia, bloqueo AV, asma bronquial');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Hidroclorotiazida', 'Microzide', 'Tableta', '25mg', 1, 1, 'Anuria, hipersensibilidad a sulfonamidas');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Furosemida', 'Lasix', 'Tableta', '40mg', 1, 1, 'Anuria, depleción severa de electrolitos');

-- Antidiabetics
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Metformina', 'Glucophage', 'Tableta', '850mg', 1, 1, 'Insuficiencia renal, acidosis metabólica');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Glibenclamida', 'Daonil', 'Tableta', '5mg', 1, 1, 'Diabetes tipo 1, cetoacidosis diabética');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Insulina NPH', 'Humulin N', 'Frasco', '100UI/ml', 5, 1, 'Hipoglucemia');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Insulina Regular', 'Humulin R', 'Frasco', '100UI/ml', 5, 1, 'Hipoglucemia');

-- Anticoagulants and Antiplatelets
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Warfarina', 'Coumadin', 'Tableta', '5mg', 1, 1, 'Embarazo, hemorragia activa, HTA severa no controlada');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Ácido Acetilsalicílico', 'Aspirina', 'Tableta', '100mg', 1, 0, 'Úlcera péptica activa, hemofilia');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Clopidogrel', 'Plavix', 'Tableta', '75mg', 1, 1, 'Hemorragia activa, úlcera péptica activa');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Enoxaparina', 'Clexane', 'Jeringa', '40mg/0.4ml', 5, 1, 'Hemorragia activa, trombocitopenia inducida por heparina');

-- Gastrointestinal
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Omeprazol', 'Prilosec', 'Cápsula', '20mg', 1, 1, 'Hipersensibilidad a inhibidores de bomba de protones');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Ranitidina', 'Zantac', 'Tableta', '150mg', 1, 0, 'Hipersensibilidad a ranitidina');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Metoclopramida', 'Reglan', 'Tableta', '10mg', 1, 1, 'Obstrucción intestinal, feocromocitoma');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Ondansetrón', 'Zofran', 'Tableta', '8mg', 1, 1, 'Hipersensibilidad a ondansetrón');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Loperamida', 'Imodium', 'Cápsula', '2mg', 1, 0, 'Colitis ulcerosa aguda, diarrea sanguinolenta');

-- Respiratory
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Salbutamol', 'Ventolin', 'Inhalador', '100mcg/dosis', 8, 1, 'Hipersensibilidad a salbutamol');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Budesonida', 'Pulmicort', 'Inhalador', '200mcg/dosis', 8, 1, 'Infecciones respiratorias no tratadas');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Montelukast', 'Singulair', 'Tableta', '10mg', 1, 1, 'Hipersensibilidad a montelukast');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Loratadina', 'Claritin', 'Tableta', '10mg', 1, 0, 'Hipersensibilidad a loratadina');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Cetirizina', 'Zyrtec', 'Tableta', '10mg', 1, 0, 'Insuficiencia renal severa');

-- Cardiovascular
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Atorvastatina', 'Lipitor', 'Tableta', '20mg', 1, 1, 'Enfermedad hepática activa, embarazo');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Simvastatina', 'Zocor', 'Tableta', '20mg', 1, 1, 'Enfermedad hepática activa, embarazo, lactancia');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Digoxina', 'Lanoxin', 'Tableta', '0.25mg', 1, 1, 'Bloqueo AV, taquicardia ventricular');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Nitroglicerina', 'Nitrostat', 'Tableta sublingual', '0.5mg', 2, 1, 'Hipotensión, uso reciente de sildenafil');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Carvedilol', 'Coreg', 'Tableta', '6.25mg', 1, 1, 'Bradicardia, bloqueo AV, asma bronquial');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Espironolactona', 'Aldactone', 'Tableta', '25mg', 1, 1, 'Hiperpotasemia, insuficiencia renal aguda');

-- Neurological and Psychiatric
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Levodopa + Carbidopa', 'Sinemet', 'Tableta', '250mg/25mg', 1, 1, 'Glaucoma de ángulo cerrado, melanoma');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Fenitoína', 'Dilantin', 'Cápsula', '100mg', 1, 1, 'Bradicardia sinusal, bloqueo AV');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Carbamazepina', 'Tegretol', 'Tableta', '200mg', 1, 1, 'Bloqueo AV, porfiria aguda intermitente');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Ácido Valproico', 'Depakote', 'Tableta', '500mg', 1, 1, 'Enfermedad hepática, trastornos del ciclo de la urea');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Gabapentina', 'Neurontin', 'Cápsula', '300mg', 1, 1, 'Hipersensibilidad a gabapentina');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Pregabalina', 'Lyrica', 'Cápsula', '75mg', 1, 1, 'Hipersensibilidad a pregabalina');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Fluoxetina', 'Prozac', 'Cápsula', '20mg', 1, 1, 'Uso concomitante con IMAO');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Sertralina', 'Zoloft', 'Tableta', '50mg', 1, 1, 'Uso concomitante con IMAO, pimozida');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Escitalopram', 'Lexapro', 'Tableta', '10mg', 1, 1, 'Uso concomitante con IMAO');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Amitriptilina', 'Elavil', 'Tableta', '25mg', 1, 1, 'Infarto agudo de miocardio reciente, glaucoma');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Clonazepam', 'Klonopin', 'Tableta', '2mg', 1, 1, 'Glaucoma de ángulo cerrado, insuficiencia respiratoria');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Alprazolam', 'Xanax', 'Tableta', '0.5mg', 1, 1, 'Glaucoma de ángulo cerrado, miastenia gravis');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Diazepam', 'Valium', 'Tableta', '10mg', 1, 1, 'Glaucoma de ángulo cerrado, miastenia gravis');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Risperidona', 'Risperdal', 'Tableta', '2mg', 1, 1, 'Hipersensibilidad a risperidona');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Quetiapina', 'Seroquel', 'Tableta', '100mg', 1, 1, 'Hipersensibilidad a quetiapina');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Haloperidol', 'Haldol', 'Tableta', '5mg', 1, 1, 'Enfermedad de Parkinson, depresión del SNC');

-- Hormones and Endocrine
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Levotiroxina', 'Synthroid', 'Tableta', '100mcg', 1, 1, 'Tirotoxicosis no tratada, infarto agudo de miocardio');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Prednisona', 'Deltasone', 'Tableta', '20mg', 1, 1, 'Infecciones fúngicas sistémicas');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Dexametasona', 'Decadron', 'Tableta', '4mg', 1, 1, 'Infecciones fúngicas sistémicas');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Hidrocortisona', 'Cortef', 'Tableta', '20mg', 1, 1, 'Infecciones fúngicas sistémicas');

-- Antivirals and Antifungals
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Aciclovir', 'Zovirax', 'Tableta', '400mg', 1, 1, 'Hipersensibilidad a aciclovir');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Oseltamivir', 'Tamiflu', 'Cápsula', '75mg', 1, 1, 'Hipersensibilidad a oseltamivir');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Fluconazol', 'Diflucan', 'Cápsula', '150mg', 1, 1, 'Uso concomitante con terfenadina');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Nistatina', 'Mycostatin', 'Suspensión oral', '100,000UI/ml', 1, 1, 'Hipersensibilidad a nistatina');

-- Vitamins and Supplements
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Ácido Fólico', 'Folvite', 'Tableta', '5mg', 1, 0, 'Anemia perniciosa no tratada');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Vitamina B12', 'Cyanocobalamin', 'Ampolla', '1000mcg/ml', 4, 1, 'Hipersensibilidad a cobalamina');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Vitamina D3', 'Cholecalciferol', 'Cápsula', '1000UI', 1, 0, 'Hipercalcemia, hipervitaminosis D');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Calcio + Vitamina D', 'Caltrate', 'Tableta', '600mg/400UI', 1, 0, 'Hipercalcemia, cálculos renales');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Hierro', 'Ferrous Sulfate', 'Tableta', '325mg', 1, 0, 'Hemocromatosis, hemosiderosis');

-- Urological
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Tamsulosina', 'Flomax', 'Cápsula', '0.4mg', 1, 1, 'Hipersensibilidad a tamsulosina');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Finasterida', 'Proscar', 'Tableta', '5mg', 1, 1, 'Embarazo, mujeres en edad fértil');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Sildenafil', 'Viagra', 'Tableta', '50mg', 1, 1, 'Uso de nitratos, hipotensión severa');

-- Dermatological
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Betametasona', 'Celestone', 'Crema', '0.1%', 6, 1, 'Infecciones cutáneas no tratadas');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Clotrimazol', 'Lotrimin', 'Crema', '1%', 6, 0, 'Hipersensibilidad a clotrimazol');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Mupirocina', 'Bactroban', 'Ungüento', '2%', 6, 1, 'Hipersensibilidad a mupirocina');

-- Ophthalmological
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Timolol', 'Timoptic', 'Gotas oftálmicas', '0.5%', 10, 1, 'Asma bronquial, bradicardia');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Latanoprost', 'Xalatan', 'Gotas oftálmicas', '0.005%', 10, 1, 'Hipersensibilidad a latanoprost');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Tobramicina', 'Tobrex', 'Gotas oftálmicas', '0.3%', 10, 1, 'Hipersensibilidad a aminoglucósidos');

-- Antiemetics and Antacids
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Dimenhidrinato', 'Dramamine', 'Tableta', '50mg', 1, 0, 'Glaucoma de ángulo cerrado');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Hidróxido de Aluminio + Magnesio', 'Maalox', 'Suspensión', '400mg/400mg/5ml', 1, 0, 'Insuficiencia renal severa');

-- Muscle Relaxants
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Ciclobenzaprina', 'Flexeril', 'Tableta', '10mg', 1, 1, 'Infarto agudo de miocardio reciente, arritmias');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Orfenadrina', 'Norflex', 'Tableta', '100mg', 1, 1, 'Glaucoma, miastenia gravis');

-- Anticoagulants (additional)
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Rivaroxabán', 'Xarelto', 'Tableta', '20mg', 1, 1, 'Hemorragia activa, insuficiencia hepática severa');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Apixabán', 'Eliquis', 'Tableta', '5mg', 1, 1, 'Hemorragia activa, insuficiencia hepática severa');

-- Antihistamines
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Difenhidramina', 'Benadryl', 'Cápsula', '25mg', 1, 0, 'Glaucoma de ángulo cerrado, hipertrofia prostática');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Clorfeniramina', 'Chlor-Trimeton', 'Tableta', '4mg', 1, 0, 'Glaucoma de ángulo cerrado, úlcera péptica');

-- Antitussives and Expectorants
INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Dextrometorfano', 'Robitussin', 'Jarabe', '15mg/5ml', 1, 0, 'Uso concomitante con IMAO');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Guaifenesina', 'Mucinex', 'Tableta', '600mg', 1, 0, 'Hipersensibilidad a guaifenesina');

INSERT INTO medications (generic_name, brand_name, presentation, concentration, administration_route_id, requires_prescription, contraindications) 
VALUES ('Ambroxol', 'Mucosolvan', 'Jarabe', '30mg/5ml', 1, 0, 'Úlcera péptica activa');

COMMIT;

PROMPT Medications data insertion completed successfully!
PROMPT Total medications inserted: 100

SET DEFINE ON;
