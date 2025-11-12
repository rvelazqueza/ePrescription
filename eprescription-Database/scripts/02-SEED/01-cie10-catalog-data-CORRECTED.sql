-- =====================================================
-- Script: 01-cie10-catalog-data.sql
-- Description: Seed data for CIE10_CATALOG table
-- Contains 500+ most common ICD-10 codes
-- Follows DATABASE-SCHEMA-REFERENCE.md structure
-- =====================================================

SET DEFINE OFF;
SET SERVEROUTPUT ON;

PROMPT ========================================
PROMPT Inserting CIE10_CATALOG data
PROMPT ========================================

-- Clear existing data
DELETE FROM CIE10_CATALOG;

PROMPT Inserting 500+ most common ICD-10 codes...

-- =====================================================
-- CHAPTER I: Certain infectious and parasitic diseases (A00-B99)
-- =====================================================

-- Intestinal infectious diseases (A00-A09)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A00', 'Cólera', 'Cholera', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A00.0', 'Cólera debido a Vibrio cholerae 01, biotipo cholerae', 'Cholera due to Vibrio cholerae 01, biovar cholerae', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A00.1', 'Cólera debido a Vibrio cholerae 01, biotipo El Tor', 'Cholera due to Vibrio cholerae 01, biovar eltor', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A00.9', 'Cólera, no especificado', 'Cholera, unspecified', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A01', 'Fiebres tifoidea y paratifoidea', 'Typhoid and paratyphoid fevers', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A01.0', 'Fiebre tifoidea', 'Typhoid fever', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A02', 'Otras infecciones debidas a Salmonella', 'Other salmonella infections', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A02.0', 'Enteritis debida a Salmonella', 'Salmonella enteritis', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A03', 'Shigelosis', 'Shigellosis', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A04', 'Otras infecciones intestinales bacterianas', 'Other bacterial intestinal infections', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A04.0', 'Infección debida a Escherichia coli enteropatógena', 'Enteropathogenic Escherichia coli infection', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A04.7', 'Enterocolitis debida a Clostridium difficile', 'Enterocolitis due to Clostridium difficile', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A05', 'Otras intoxicaciones alimentarias bacterianas', 'Other bacterial foodborne intoxications', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A06', 'Amebiasis', 'Amoebiasis', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A07', 'Otras enfermedades intestinales debidas a protozoarios', 'Other protozoal intestinal diseases', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A08', 'Infecciones intestinales debidas a virus y otros organismos especificados', 'Viral and other specified intestinal infections', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A09', 'Diarrea y gastroenteritis de presunto origen infeccioso', 'Diarrhoea and gastroenteritis of presumed infectious origin', 'Intestinal infectious diseases', 'Certain infectious and parasitic diseases');

COMMIT;

-- Tuberculosis (A15-A19)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A15', 'Tuberculosis respiratoria, confirmada bacteriológica e histológicamente', 'Respiratory tuberculosis, bacteriologically and histologically confirmed', 'Tuberculosis', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A16', 'Tuberculosis respiratoria, no confirmada bacteriológica o histológicamente', 'Respiratory tuberculosis, not confirmed bacteriologically or histologically', 'Tuberculosis', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A17', 'Tuberculosis del sistema nervioso', 'Tuberculosis of nervous system', 'Tuberculosis', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A18', 'Tuberculosis de otros órganos', 'Tuberculosis of other organs', 'Tuberculosis', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A19', 'Tuberculosis miliar', 'Miliary tuberculosis', 'Tuberculosis', 'Certain infectious and parasitic diseases');

-- Bacterial zoonoses (A20-A28)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A20', 'Peste', 'Plague', 'Bacterial zoonoses', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A21', 'Tularemia', 'Tularaemia', 'Bacterial zoonoses', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A22', 'Carbunco [ántrax]', 'Anthrax', 'Bacterial zoonoses', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A23', 'Brucelosis', 'Brucellosis', 'Bacterial zoonoses', 'Certain infectious and parasitic diseases');

-- Other bacterial diseases (A30-A49)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A30', 'Lepra [enfermedad de Hansen]', 'Leprosy [Hansen disease]', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A31', 'Infecciones debidas a otras micobacterias', 'Infection due to other mycobacteria', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A32', 'Listeriosis', 'Listeriosis', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A33', 'Tétanos neonatal', 'Tetanus neonatorum', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A34', 'Tétanos obstétrico', 'Obstetrical tetanus', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A35', 'Otros tétanos', 'Other tetanus', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A36', 'Difteria', 'Diphtheria', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A37', 'Tos ferina', 'Whooping cough', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A38', 'Escarlatina', 'Scarlet fever', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A39', 'Infección meningocócica', 'Meningococcal infection', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A39.0', 'Meningitis meningocócica', 'Meningococcal meningitis', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A40', 'Septicemia estreptocócica', 'Streptococcal sepsis', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A41', 'Otras septicemias', 'Other sepsis', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A41.0', 'Septicemia debida a Staphylococcus aureus', 'Sepsis due to Staphylococcus aureus', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A41.9', 'Septicemia, no especificada', 'Sepsis, unspecified', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A42', 'Actinomicosis', 'Actinomycosis', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A43', 'Nocardiosis', 'Nocardiosis', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A44', 'Bartonelosis', 'Bartonellosis', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A46', 'Erisipela', 'Erysipelas', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A48', 'Otras enfermedades bacterianas, no clasificadas en otra parte', 'Other bacterial diseases, not elsewhere classified', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('A49', 'Infección bacteriana de sitio no especificado', 'Bacterial infection of unspecified site', 'Other bacterial diseases', 'Certain infectious and parasitic diseases');

COMMIT;

-- =====================================================
-- CHAPTER II: Neoplasms (C00-D48)
-- =====================================================

-- Malignant neoplasms of lip, oral cavity and pharynx (C00-C14)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C00', 'Tumor maligno del labio', 'Malignant neoplasm of lip', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C01', 'Tumor maligno de la base de la lengua', 'Malignant neoplasm of base of tongue', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C02', 'Tumor maligno de otras partes y de las no especificadas de la lengua', 'Malignant neoplasm of other and unspecified parts of tongue', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C15', 'Tumor maligno del esófago', 'Malignant neoplasm of oesophagus', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C16', 'Tumor maligno del estómago', 'Malignant neoplasm of stomach', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C18', 'Tumor maligno del colon', 'Malignant neoplasm of colon', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C19', 'Tumor maligno de la unión rectosigmoidea', 'Malignant neoplasm of rectosigmoid junction', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C20', 'Tumor maligno del recto', 'Malignant neoplasm of rectum', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C22', 'Tumor maligno del hígado y de las vías biliares intrahepáticas', 'Malignant neoplasm of liver and intrahepatic bile ducts', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C25', 'Tumor maligno del páncreas', 'Malignant neoplasm of pancreas', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C34', 'Tumor maligno de los bronquios y del pulmón', 'Malignant neoplasm of bronchus and lung', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C43', 'Melanoma maligno de la piel', 'Malignant melanoma of skin', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C44', 'Otros tumores malignos de la piel', 'Other malignant neoplasms of skin', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C50', 'Tumor maligno de la mama', 'Malignant neoplasm of breast', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C53', 'Tumor maligno del cuello del útero', 'Malignant neoplasm of cervix uteri', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C54', 'Tumor maligno del cuerpo del útero', 'Malignant neoplasm of corpus uteri', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C56', 'Tumor maligno del ovario', 'Malignant neoplasm of ovary', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C61', 'Tumor maligno de la próstata', 'Malignant neoplasm of prostate', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C64', 'Tumor maligno del riñón, excepto de la pelvis renal', 'Malignant neoplasm of kidney, except renal pelvis', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C67', 'Tumor maligno de la vejiga urinaria', 'Malignant neoplasm of bladder', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C71', 'Tumor maligno del encéfalo', 'Malignant neoplasm of brain', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C73', 'Tumor maligno de la glándula tiroides', 'Malignant neoplasm of thyroid gland', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C78', 'Tumor maligno secundario de los órganos respiratorios y digestivos', 'Secondary malignant neoplasm of respiratory and digestive organs', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C79', 'Tumor maligno secundario de otros sitios', 'Secondary malignant neoplasm of other sites', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C80', 'Tumor maligno de sitios no especificados', 'Malignant neoplasm without specification of site', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C81', 'Enfermedad de Hodgkin', 'Hodgkin disease', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C82', 'Linfoma no Hodgkin, folicular [nodular]', 'Follicular [nodular] non-Hodgkin lymphoma', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C83', 'Linfoma no Hodgkin difuso', 'Diffuse non-Hodgkin lymphoma', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C91', 'Leucemia linfoide', 'Lymphoid leukaemia', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('C92', 'Leucemia mieloide', 'Myeloid leukaemia', 'Malignant neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D10', 'Tumor benigno de la boca y de la faringe', 'Benign neoplasm of mouth and pharynx', 'Benign neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D12', 'Tumor benigno del colon, recto, conducto anal y ano', 'Benign neoplasm of colon, rectum, anus and anal canal', 'Benign neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D22', 'Nevos melanocíticos', 'Melanocytic naevi', 'Benign neoplasms', 'Neoplasms');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D25', 'Leiomioma del útero', 'Leiomyoma of uterus', 'Benign neoplasms', 'Neoplasms');

COMMIT;

-- =====================================================
-- CHAPTER III: Diseases of the blood and blood-forming organs (D50-D89)
-- =====================================================

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D50', 'Anemia por deficiencia de hierro', 'Iron deficiency anaemia', 'Nutritional anaemias', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D50.0', 'Anemia por deficiencia de hierro secundaria a pérdida de sangre (crónica)', 'Iron deficiency anaemia secondary to blood loss (chronic)', 'Nutritional anaemias', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D50.9', 'Anemia por deficiencia de hierro, sin otra especificación', 'Iron deficiency anaemia, unspecified', 'Nutritional anaemias', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D51', 'Anemia por deficiencia de vitamina B12', 'Vitamin B12 deficiency anaemia', 'Nutritional anaemias', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D52', 'Anemia por deficiencia de folato', 'Folate deficiency anaemia', 'Nutritional anaemias', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D53', 'Otras anemias nutricionales', 'Other nutritional anaemias', 'Nutritional anaemias', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D55', 'Anemia debida a trastornos enzimáticos', 'Anaemia due to enzyme disorders', 'Haemolytic anaemias', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D56', 'Talasemia', 'Thalassaemia', 'Haemolytic anaemias', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D57', 'Trastornos falciformes', 'Sickle-cell disorders', 'Haemolytic anaemias', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D58', 'Otras anemias hemolíticas hereditarias', 'Other hereditary haemolytic anaemias', 'Haemolytic anaemias', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D59', 'Anemia hemolítica adquirida', 'Acquired haemolytic anaemia', 'Haemolytic anaemias', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D60', 'Aplasia adquirida, exclusiva de la serie roja [eritroblastopenia]', 'Acquired pure red cell aplasia [erythroblastopenia]', 'Aplastic and other anaemias', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D61', 'Otras anemias aplásticas', 'Other aplastic anaemias', 'Aplastic and other anaemias', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D62', 'Anemia aguda posthemorrágica', 'Acute posthaemorrhagic anaemia', 'Aplastic and other anaemias', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D64', 'Otras anemias', 'Other anaemias', 'Aplastic and other anaemias', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D65', 'Coagulación intravascular diseminada [síndrome de desfibrinación]', 'Disseminated intravascular coagulation', 'Coagulation defects', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D66', 'Deficiencia hereditaria del factor VIII', 'Hereditary factor VIII deficiency', 'Coagulation defects', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D67', 'Deficiencia hereditaria del factor IX', 'Hereditary factor IX deficiency', 'Coagulation defects', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D68', 'Otros defectos de la coagulación', 'Other coagulation defects', 'Coagulation defects', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D69', 'Púrpura y otras afecciones hemorrágicas', 'Purpura and other haemorrhagic conditions', 'Coagulation defects', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D70', 'Agranulocitosis', 'Agranulocytosis', 'Other diseases of blood', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D72', 'Otros trastornos de los glóbulos blancos', 'Other disorders of white blood cells', 'Other diseases of blood', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D73', 'Enfermedades del bazo', 'Diseases of spleen', 'Other diseases of blood', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D75', 'Otras enfermedades de la sangre y de los órganos hematopoyéticos', 'Other diseases of blood and blood-forming organs', 'Other diseases of blood', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D80', 'Inmunodeficiencia con predominio de defectos de los anticuerpos', 'Immunodeficiency with predominantly antibody defects', 'Immune disorders', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D84', 'Otras inmunodeficiencias', 'Other immunodeficiencies', 'Immune disorders', 'Diseases of the blood and blood-forming organs');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('D86', 'Sarcoidosis', 'Sarcoidosis', 'Immune disorders', 'Diseases of the blood and blood-forming organs');

COMMIT;

-- =====================================================
-- CHAPTER IV: Endocrine, nutritional and metabolic diseases (E00-E90)
-- =====================================================

-- Disorders of thyroid gland (E00-E07)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E00', 'Síndrome congénito de deficiencia de yodo', 'Congenital iodine-deficiency syndrome', 'Thyroid disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E01', 'Trastornos tiroideos relacionados con deficiencia de yodo y afecciones aliadas', 'Iodine-deficiency-related thyroid disorders', 'Thyroid disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E02', 'Hipotiroidismo subclínico por deficiencia de yodo', 'Subclinical iodine-deficiency hypothyroidism', 'Thyroid disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E03', 'Otros hipotiroidismos', 'Other hypothyroidism', 'Thyroid disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E03.9', 'Hipotiroidismo, no especificado', 'Hypothyroidism, unspecified', 'Thyroid disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E04', 'Otro bocio no tóxico', 'Other nontoxic goitre', 'Thyroid disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E05', 'Tirotoxicosis [hipertiroidismo]', 'Thyrotoxicosis [hyperthyroidism]', 'Thyroid disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E06', 'Tiroiditis', 'Thyroiditis', 'Thyroid disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E07', 'Otros trastornos de la glándula tiroides', 'Other disorders of thyroid', 'Thyroid disorders', 'Endocrine, nutritional and metabolic diseases');

-- Diabetes mellitus (E10-E14)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E10', 'Diabetes mellitus insulinodependiente', 'Type 1 diabetes mellitus', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E10.0', 'Diabetes mellitus insulinodependiente, con coma', 'Type 1 diabetes mellitus with coma', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E10.1', 'Diabetes mellitus insulinodependiente, con cetoacidosis', 'Type 1 diabetes mellitus with ketoacidosis', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E10.2', 'Diabetes mellitus insulinodependiente, con complicaciones renales', 'Type 1 diabetes mellitus with renal complications', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E10.3', 'Diabetes mellitus insulinodependiente, con complicaciones oftálmicas', 'Type 1 diabetes mellitus with ophthalmic complications', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E10.4', 'Diabetes mellitus insulinodependiente, con complicaciones neurológicas', 'Type 1 diabetes mellitus with neurological complications', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E10.5', 'Diabetes mellitus insulinodependiente, con complicaciones circulatorias periféricas', 'Type 1 diabetes mellitus with peripheral circulatory complications', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E10.9', 'Diabetes mellitus insulinodependiente, sin mención de complicación', 'Type 1 diabetes mellitus without complications', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E11', 'Diabetes mellitus no insulinodependiente', 'Type 2 diabetes mellitus', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E11.0', 'Diabetes mellitus no insulinodependiente, con coma', 'Type 2 diabetes mellitus with coma', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E11.1', 'Diabetes mellitus no insulinodependiente, con cetoacidosis', 'Type 2 diabetes mellitus with ketoacidosis', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E11.2', 'Diabetes mellitus no insulinodependiente, con complicaciones renales', 'Type 2 diabetes mellitus with renal complications', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E11.3', 'Diabetes mellitus no insulinodependiente, con complicaciones oftálmicas', 'Type 2 diabetes mellitus with ophthalmic complications', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E11.4', 'Diabetes mellitus no insulinodependiente, con complicaciones neurológicas', 'Type 2 diabetes mellitus with neurological complications', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E11.5', 'Diabetes mellitus no insulinodependiente, con complicaciones circulatorias periféricas', 'Type 2 diabetes mellitus with peripheral circulatory complications', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E11.6', 'Diabetes mellitus no insulinodependiente, con otras complicaciones especificadas', 'Type 2 diabetes mellitus with other specified complications', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E11.9', 'Diabetes mellitus no insulinodependiente, sin mención de complicación', 'Type 2 diabetes mellitus without complications', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E12', 'Diabetes mellitus asociada con desnutrición', 'Malnutrition-related diabetes mellitus', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E13', 'Otras diabetes mellitus especificadas', 'Other specified diabetes mellitus', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E14', 'Diabetes mellitus, no especificada', 'Unspecified diabetes mellitus', 'Diabetes mellitus', 'Endocrine, nutritional and metabolic diseases');

-- Other endocrine disorders
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E15', 'Coma hipoglucémico no diabético', 'Nondiabetic hypoglycaemic coma', 'Other endocrine disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E16', 'Otros trastornos de la secreción pancreática interna', 'Other disorders of pancreatic internal secretion', 'Other endocrine disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E20', 'Hipoparatiroidismo', 'Hypoparathyroidism', 'Other endocrine disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E21', 'Hiperparatiroidismo y otros trastornos de la glándula paratiroides', 'Hyperparathyroidism and other disorders of parathyroid gland', 'Other endocrine disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E22', 'Hiperfunción de la glándula hipófisis', 'Hyperfunction of pituitary gland', 'Other endocrine disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E23', 'Hipofunción y otros trastornos de la glándula hipófisis', 'Hypofunction and other disorders of pituitary gland', 'Other endocrine disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E24', 'Síndrome de Cushing', 'Cushing syndrome', 'Other endocrine disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E25', 'Trastornos adrenogenitales', 'Adrenogenital disorders', 'Other endocrine disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E26', 'Hiperaldosteronismo', 'Hyperaldosteronism', 'Other endocrine disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E27', 'Otros trastornos de la glándula suprarrenal', 'Other disorders of adrenal gland', 'Other endocrine disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E28', 'Disfunción ovárica', 'Ovarian dysfunction', 'Other endocrine disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E29', 'Disfunción testicular', 'Testicular dysfunction', 'Other endocrine disorders', 'Endocrine, nutritional and metabolic diseases');

COMMIT;

-- Nutritional deficiencies (E40-E64)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E40', 'Kwashiorkor', 'Kwashiorkor', 'Nutritional deficiencies', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E41', 'Marasmo nutricional', 'Nutritional marasmus', 'Nutritional deficiencies', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E42', 'Kwashiorkor marasmático', 'Marasmic kwashiorkor', 'Nutritional deficiencies', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E43', 'Desnutrición proteicocalórica severa, no especificada', 'Unspecified severe protein-energy malnutrition', 'Nutritional deficiencies', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E44', 'Desnutrición proteicocalórica de grado moderado y leve', 'Protein-energy malnutrition of moderate and mild degree', 'Nutritional deficiencies', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E45', 'Retardo del desarrollo debido a desnutrición proteicocalórica', 'Retarded development following protein-energy malnutrition', 'Nutritional deficiencies', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E46', 'Desnutrición proteicocalórica, no especificada', 'Unspecified protein-energy malnutrition', 'Nutritional deficiencies', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E50', 'Deficiencia de vitamina A', 'Vitamin A deficiency', 'Nutritional deficiencies', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E51', 'Deficiencia de tiamina', 'Thiamine deficiency', 'Nutritional deficiencies', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E52', 'Deficiencia de niacina [pelagra]', 'Niacin deficiency [pellagra]', 'Nutritional deficiencies', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E53', 'Deficiencia de otras vitaminas del grupo B', 'Deficiency of other B group vitamins', 'Nutritional deficiencies', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E54', 'Deficiencia de ácido ascórbico', 'Ascorbic acid deficiency', 'Nutritional deficiencies', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E55', 'Deficiencia de vitamina D', 'Vitamin D deficiency', 'Nutritional deficiencies', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E56', 'Otras deficiencias de vitaminas', 'Other vitamin deficiencies', 'Nutritional deficiencies', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E58', 'Deficiencia de calcio de la dieta', 'Dietary calcium deficiency', 'Nutritional deficiencies', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E61', 'Deficiencia de otros elementos nutricionales', 'Deficiency of other nutrient elements', 'Nutritional deficiencies', 'Endocrine, nutritional and metabolic diseases');

-- Obesity and other hyperalimentation (E65-E68)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E65', 'Adiposidad localizada', 'Localized adiposity', 'Obesity', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E66', 'Obesidad', 'Obesity', 'Obesity', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E66.0', 'Obesidad debida a exceso de calorías', 'Obesity due to excess calories', 'Obesity', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E66.1', 'Obesidad inducida por drogas', 'Drug-induced obesity', 'Obesity', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E66.2', 'Obesidad extrema con hipoventilación alveolar', 'Extreme obesity with alveolar hypoventilation', 'Obesity', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E66.8', 'Otras obesidades', 'Other obesity', 'Obesity', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E66.9', 'Obesidad, no especificada', 'Obesity, unspecified', 'Obesity', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E67', 'Otras formas de hiperalimentación', 'Other hyperalimentation', 'Obesity', 'Endocrine, nutritional and metabolic diseases');

-- Metabolic disorders (E70-E90)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E70', 'Trastornos del metabolismo de los aminoácidos aromáticos', 'Disorders of aromatic amino-acid metabolism', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E71', 'Trastornos del metabolismo de los aminoácidos de cadena ramificada y de los ácidos grasos', 'Disorders of branched-chain amino-acid metabolism and fatty-acid metabolism', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E72', 'Otros trastornos del metabolismo de los aminoácidos', 'Other disorders of amino-acid metabolism', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E73', 'Intolerancia a la lactosa', 'Lactose intolerance', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E74', 'Otros trastornos del metabolismo de los carbohidratos', 'Other disorders of carbohydrate metabolism', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E75', 'Trastornos del metabolismo de los esfingolípidos y otros trastornos por almacenamiento de lípidos', 'Disorders of sphingolipid metabolism and other lipid storage disorders', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E76', 'Trastornos del metabolismo de los glucosaminoglicanos', 'Disorders of glycosaminoglycan metabolism', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E77', 'Trastornos del metabolismo de las glucoproteínas', 'Disorders of glycoprotein metabolism', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E78', 'Trastornos del metabolismo de las lipoproteínas y otras lipidemias', 'Disorders of lipoprotein metabolism and other lipidaemias', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E78.0', 'Hipercolesterolemia pura', 'Pure hypercholesterolaemia', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E78.1', 'Hipergliceridemia pura', 'Pure hyperglyceridaemia', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E78.2', 'Hiperlipidemia mixta', 'Mixed hyperlipidaemia', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E78.5', 'Hiperlipidemia, no especificada', 'Hyperlipidaemia, unspecified', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E79', 'Trastornos del metabolismo de las purinas y de las pirimidinas', 'Disorders of purine and pyrimidine metabolism', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E79.0', 'Hiperuricemia sin signos de artritis inflamatoria y enfermedad tofácea', 'Hyperuricaemia without signs of inflammatory arthritis and tophaceous disease', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E80', 'Trastornos del metabolismo de la porfirina y de la bilirrubina', 'Disorders of porphyrin and bilirubin metabolism', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E83', 'Trastornos del metabolismo de los minerales', 'Disorders of mineral metabolism', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E84', 'Fibrosis quística', 'Cystic fibrosis', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E85', 'Amiloidosis', 'Amyloidosis', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E86', 'Depleción del volumen', 'Volume depletion', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E87', 'Otros trastornos del equilibrio de los líquidos, de los electrolitos y del equilibrio ácido-básico', 'Other disorders of fluid, electrolyte and acid-base balance', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('E88', 'Otros trastornos metabólicos', 'Other metabolic disorders', 'Metabolic disorders', 'Endocrine, nutritional and metabolic diseases');

COMMIT;

-- =====================================================
-- CHAPTER VI: Diseases of the nervous system (G00-G99)
-- =====================================================

-- Inflammatory diseases of the central nervous system (G00-G09)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G00', 'Meningitis bacteriana, no clasificada en otra parte', 'Bacterial meningitis, not elsewhere classified', 'Inflammatory CNS diseases', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G01', 'Meningitis en enfermedades bacterianas clasificadas en otra parte', 'Meningitis in bacterial diseases classified elsewhere', 'Inflammatory CNS diseases', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G02', 'Meningitis en otras enfermedades infecciosas y parasitarias clasificadas en otra parte', 'Meningitis in other infectious and parasitic diseases classified elsewhere', 'Inflammatory CNS diseases', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G03', 'Meningitis debida a otras causas y a las no especificadas', 'Meningitis due to other and unspecified causes', 'Inflammatory CNS diseases', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G04', 'Encefalitis, mielitis y encefalomielitis', 'Encephalitis, myelitis and encephalomyelitis', 'Inflammatory CNS diseases', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G05', 'Encefalitis, mielitis y encefalomielitis en enfermedades clasificadas en otra parte', 'Encephalitis, myelitis and encephalomyelitis in diseases classified elsewhere', 'Inflammatory CNS diseases', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G06', 'Absceso y granuloma intracraneales e intrarraquídeos', 'Intracranial and intraspinal abscess and granuloma', 'Inflammatory CNS diseases', 'Diseases of the nervous system');

-- Systemic atrophies primarily affecting the central nervous system (G10-G14)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G10', 'Enfermedad de Huntington', 'Huntington disease', 'Systemic atrophies', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G11', 'Ataxia hereditaria', 'Hereditary ataxia', 'Systemic atrophies', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G12', 'Atrofia muscular espinal y síndromes afines', 'Spinal muscular atrophy and related syndromes', 'Systemic atrophies', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G13', 'Atrofias sistémicas que afectan primariamente al sistema nervioso central en enfermedades clasificadas en otra parte', 'Systemic atrophies primarily affecting central nervous system in diseases classified elsewhere', 'Systemic atrophies', 'Diseases of the nervous system');

-- Extrapyramidal and movement disorders (G20-G26)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G20', 'Enfermedad de Parkinson', 'Parkinson disease', 'Extrapyramidal disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G21', 'Parkinsonismo secundario', 'Secondary parkinsonism', 'Extrapyramidal disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G23', 'Otras enfermedades degenerativas de los ganglios basales', 'Other degenerative diseases of basal ganglia', 'Extrapyramidal disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G24', 'Distonía', 'Dystonia', 'Extrapyramidal disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G25', 'Otros trastornos extrapiramidales y del movimiento', 'Other extrapyramidal and movement disorders', 'Extrapyramidal disorders', 'Diseases of the nervous system');

-- Other degenerative diseases of the nervous system (G30-G32)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G30', 'Enfermedad de Alzheimer', 'Alzheimer disease', 'Degenerative diseases', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G30.0', 'Enfermedad de Alzheimer de inicio temprano', 'Alzheimer disease with early onset', 'Degenerative diseases', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G30.1', 'Enfermedad de Alzheimer de inicio tardío', 'Alzheimer disease with late onset', 'Degenerative diseases', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G30.9', 'Enfermedad de Alzheimer, no especificada', 'Alzheimer disease, unspecified', 'Degenerative diseases', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G31', 'Otras enfermedades degenerativas del sistema nervioso, no clasificadas en otra parte', 'Other degenerative diseases of nervous system, not elsewhere classified', 'Degenerative diseases', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G32', 'Otros trastornos degenerativos del sistema nervioso en enfermedades clasificadas en otra parte', 'Other degenerative disorders of nervous system in diseases classified elsewhere', 'Degenerative diseases', 'Diseases of the nervous system');

-- Demyelinating diseases of the central nervous system (G35-G37)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G35', 'Esclerosis múltiple', 'Multiple sclerosis', 'Demyelinating diseases', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G36', 'Otras desmielinizaciones diseminadas agudas', 'Other acute disseminated demyelination', 'Demyelinating diseases', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G37', 'Otras enfermedades desmielinizantes del sistema nervioso central', 'Other demyelinating diseases of central nervous system', 'Demyelinating diseases', 'Diseases of the nervous system');

-- Episodic and paroxysmal disorders (G40-G47)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G40', 'Epilepsia', 'Epilepsy', 'Episodic disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G40.0', 'Epilepsia y síndromes epilépticos idiopáticos relacionados con localizaciones (focales) (parciales) con ataques de inicio localizado', 'Localization-related (focal) (partial) idiopathic epilepsy and epileptic syndromes with seizures of localized onset', 'Episodic disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G40.1', 'Epilepsia y síndromes epilépticos sintomáticos relacionados con localizaciones (focales) (parciales) con ataques parciales simples', 'Localization-related (focal) (partial) symptomatic epilepsy and epileptic syndromes with simple partial seizures', 'Episodic disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G40.2', 'Epilepsia y síndromes epilépticos sintomáticos relacionados con localizaciones (focales) (parciales) con ataques parciales complejos', 'Localization-related (focal) (partial) symptomatic epilepsy and epileptic syndromes with complex partial seizures', 'Episodic disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G40.3', 'Epilepsia y síndromes epilépticos generalizados idiopáticos', 'Generalized idiopathic epilepsy and epileptic syndromes', 'Episodic disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G40.9', 'Epilepsia, tipo no especificado', 'Epilepsy, unspecified', 'Episodic disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G41', 'Estado de mal epiléptico', 'Status epilepticus', 'Episodic disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G43', 'Migraña', 'Migraine', 'Episodic disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G43.0', 'Migraña sin aura [migraña común]', 'Migraine without aura [common migraine]', 'Episodic disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G43.1', 'Migraña con aura [migraña clásica]', 'Migraine with aura [classical migraine]', 'Episodic disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G43.9', 'Migraña, no especificada', 'Migraine, unspecified', 'Episodic disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G44', 'Otros síndromes de cefalea', 'Other headache syndromes', 'Episodic disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G45', 'Ataques de isquemia cerebral transitoria y síndromes afines', 'Transient cerebral ischaemic attacks and related syndromes', 'Episodic disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G46', 'Síndromes vasculares encefálicos en enfermedades cerebrovasculares', 'Vascular syndromes of brain in cerebrovascular diseases', 'Episodic disorders', 'Diseases of the nervous system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('G47', 'Trastornos del sueño', 'Sleep disorders', 'Episodic disorders', 'Diseases of the nervous system');

COMMIT;

-- =====================================================
-- CHAPTER IX: Diseases of the circulatory system (I00-I99)
-- =====================================================

-- Acute rheumatic fever (I00-I02)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I00', 'Fiebre reumática sin mención de complicación cardíaca', 'Rheumatic fever without mention of heart involvement', 'Acute rheumatic fever', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I01', 'Fiebre reumática con complicación cardíaca', 'Rheumatic fever with heart involvement', 'Acute rheumatic fever', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I02', 'Corea reumática', 'Rheumatic chorea', 'Acute rheumatic fever', 'Diseases of the circulatory system');

-- Chronic rheumatic heart diseases (I05-I09)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I05', 'Enfermedades reumáticas de la válvula mitral', 'Rheumatic mitral valve diseases', 'Chronic rheumatic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I06', 'Enfermedades reumáticas de la válvula aórtica', 'Rheumatic aortic valve diseases', 'Chronic rheumatic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I07', 'Enfermedades reumáticas de la válvula tricúspide', 'Rheumatic tricuspid valve diseases', 'Chronic rheumatic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I08', 'Enfermedades valvulares múltiples', 'Multiple valve diseases', 'Chronic rheumatic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I09', 'Otras enfermedades reumáticas del corazón', 'Other rheumatic heart diseases', 'Chronic rheumatic heart diseases', 'Diseases of the circulatory system');

-- Hypertensive diseases (I10-I15)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I10', 'Hipertensión esencial (primaria)', 'Essential (primary) hypertension', 'Hypertensive diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I11', 'Enfermedad cardíaca hipertensiva', 'Hypertensive heart disease', 'Hypertensive diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I12', 'Enfermedad renal hipertensiva', 'Hypertensive renal disease', 'Hypertensive diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I13', 'Enfermedad cardíaca y renal hipertensiva', 'Hypertensive heart and renal disease', 'Hypertensive diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I15', 'Hipertensión secundaria', 'Secondary hypertension', 'Hypertensive diseases', 'Diseases of the circulatory system');

-- Ischaemic heart diseases (I20-I25)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I20', 'Angina de pecho', 'Angina pectoris', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I20.0', 'Angina inestable', 'Unstable angina', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I20.1', 'Angina de pecho con espasmo documentado', 'Angina pectoris with documented spasm', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I20.8', 'Otras formas de angina de pecho', 'Other forms of angina pectoris', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I20.9', 'Angina de pecho, no especificada', 'Angina pectoris, unspecified', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I21', 'Infarto agudo del miocardio', 'Acute myocardial infarction', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I21.0', 'Infarto transmural agudo del miocardio de la pared anterior', 'Acute transmural myocardial infarction of anterior wall', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I21.1', 'Infarto transmural agudo del miocardio de la pared inferior', 'Acute transmural myocardial infarction of inferior wall', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I21.2', 'Infarto transmural agudo del miocardio de otros sitios', 'Acute transmural myocardial infarction of other sites', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I21.3', 'Infarto transmural agudo del miocardio, de sitio no especificado', 'Acute transmural myocardial infarction of unspecified site', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I21.4', 'Infarto subendocárdico agudo del miocardio', 'Acute subendocardial myocardial infarction', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I21.9', 'Infarto agudo del miocardio, sin otra especificación', 'Acute myocardial infarction, unspecified', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I22', 'Infarto subsecuente del miocardio', 'Subsequent myocardial infarction', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I23', 'Ciertas complicaciones presentes posteriores al infarto agudo del miocardio', 'Certain current complications following acute myocardial infarction', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I24', 'Otras enfermedades isquémicas agudas del corazón', 'Other acute ischaemic heart diseases', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I25', 'Enfermedad isquémica crónica del corazón', 'Chronic ischaemic heart disease', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I25.0', 'Enfermedad cardiovascular aterosclerótica, así descrita', 'Atherosclerotic cardiovascular disease, so described', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I25.1', 'Enfermedad aterosclerótica del corazón', 'Atherosclerotic heart disease', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I25.2', 'Infarto antiguo del miocardio', 'Old myocardial infarction', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I25.5', 'Cardiomiopatía isquémica', 'Ischaemic cardiomyopathy', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I25.9', 'Enfermedad isquémica crónica del corazón, no especificada', 'Chronic ischaemic heart disease, unspecified', 'Ischaemic heart diseases', 'Diseases of the circulatory system');

-- Pulmonary heart disease and diseases of pulmonary circulation (I26-I28)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I26', 'Embolia pulmonar', 'Pulmonary embolism', 'Pulmonary heart disease', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I27', 'Otras enfermedades cardiopulmonares', 'Other pulmonary heart diseases', 'Pulmonary heart disease', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I28', 'Otras enfermedades de los vasos pulmonares', 'Other diseases of pulmonary vessels', 'Pulmonary heart disease', 'Diseases of the circulatory system');

-- Other forms of heart disease (I30-I52)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I30', 'Pericarditis aguda', 'Acute pericarditis', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I31', 'Otras enfermedades del pericardio', 'Other diseases of pericardium', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I33', 'Endocarditis aguda y subaguda', 'Acute and subacute endocarditis', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I34', 'Trastornos no reumáticos de la válvula mitral', 'Nonrheumatic mitral valve disorders', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I35', 'Trastornos no reumáticos de la válvula aórtica', 'Nonrheumatic aortic valve disorders', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I36', 'Trastornos no reumáticos de la válvula tricúspide', 'Nonrheumatic tricuspid valve disorders', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I37', 'Trastornos de la válvula pulmonar', 'Pulmonary valve disorders', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I38', 'Endocarditis, válvula no especificada', 'Endocarditis, valve unspecified', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I40', 'Miocarditis aguda', 'Acute myocarditis', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I42', 'Cardiomiopatía', 'Cardiomyopathy', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I44', 'Bloqueo auriculoventricular y de rama izquierda del haz', 'Atrioventricular and left bundle-branch block', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I45', 'Otros trastornos de la conducción', 'Other conduction disorders', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I46', 'Paro cardíaco', 'Cardiac arrest', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I47', 'Taquicardia paroxística', 'Paroxysmal tachycardia', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I48', 'Fibrilación y aleteo auricular', 'Atrial fibrillation and flutter', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I49', 'Otras arritmias cardíacas', 'Other cardiac arrhythmias', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I50', 'Insuficiencia cardíaca', 'Heart failure', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I50.0', 'Insuficiencia cardíaca congestiva', 'Congestive heart failure', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I50.1', 'Insuficiencia ventricular izquierda', 'Left ventricular failure', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I50.9', 'Insuficiencia cardíaca, no especificada', 'Heart failure, unspecified', 'Other heart diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I51', 'Complicaciones y descripciones mal definidas de enfermedad cardíaca', 'Complications and ill-defined descriptions of heart disease', 'Other heart diseases', 'Diseases of the circulatory system');

COMMIT;

-- Cerebrovascular diseases (I60-I69)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I60', 'Hemorragia subaracnoidea', 'Subarachnoid haemorrhage', 'Cerebrovascular diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I61', 'Hemorragia intraencefálica', 'Intracerebral haemorrhage', 'Cerebrovascular diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I62', 'Otras hemorragias intracraneales no traumáticas', 'Other nontraumatic intracranial haemorrhage', 'Cerebrovascular diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I63', 'Infarto cerebral', 'Cerebral infarction', 'Cerebrovascular diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I64', 'Accidente vascular encefálico agudo, no especificado como hemorrágico o isquémico', 'Stroke, not specified as haemorrhage or infarction', 'Cerebrovascular diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I65', 'Oclusión y estenosis de las arterias precerebrales sin ocasionar infarto cerebral', 'Occlusion and stenosis of precerebral arteries, not resulting in cerebral infarction', 'Cerebrovascular diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I66', 'Oclusión y estenosis de las arterias cerebrales sin ocasionar infarto cerebral', 'Occlusion and stenosis of cerebral arteries, not resulting in cerebral infarction', 'Cerebrovascular diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I67', 'Otras enfermedades cerebrovasculares', 'Other cerebrovascular diseases', 'Cerebrovascular diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I68', 'Trastornos cerebrovasculares en enfermedades clasificadas en otra parte', 'Cerebrovascular disorders in diseases classified elsewhere', 'Cerebrovascular diseases', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I69', 'Secuelas de enfermedad cerebrovascular', 'Sequelae of cerebrovascular disease', 'Cerebrovascular diseases', 'Diseases of the circulatory system');

-- Diseases of arteries, arterioles and capillaries (I70-I79)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I70', 'Aterosclerosis', 'Atherosclerosis', 'Diseases of arteries', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I71', 'Aneurisma y disección aórticos', 'Aortic aneurysm and dissection', 'Diseases of arteries', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I72', 'Otros aneurismas', 'Other aneurysm', 'Diseases of arteries', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I73', 'Otras enfermedades vasculares periféricas', 'Other peripheral vascular diseases', 'Diseases of arteries', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I74', 'Embolia y trombosis arteriales', 'Arterial embolism and thrombosis', 'Diseases of arteries', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I77', 'Otros trastornos de las arterias y de las arteriolas', 'Other disorders of arteries and arterioles', 'Diseases of arteries', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I78', 'Enfermedades de los capilares', 'Diseases of capillaries', 'Diseases of arteries', 'Diseases of the circulatory system');

-- Diseases of veins, lymphatic vessels and lymph nodes (I80-I89)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I80', 'Flebitis y tromboflebitis', 'Phlebitis and thrombophlebitis', 'Diseases of veins', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I81', 'Trombosis de la vena porta', 'Portal vein thrombosis', 'Diseases of veins', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I82', 'Otra embolia y trombosis venosas', 'Other venous embolism and thrombosis', 'Diseases of veins', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I83', 'Várices de los miembros inferiores', 'Varicose veins of lower extremities', 'Diseases of veins', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I84', 'Hemorroides', 'Haemorrhoids', 'Diseases of veins', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I85', 'Várices esofágicas', 'Oesophageal varices', 'Diseases of veins', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I86', 'Várices de otros sitios', 'Varicose veins of other sites', 'Diseases of veins', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I87', 'Otros trastornos de las venas', 'Other disorders of veins', 'Diseases of veins', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I88', 'Linfadenitis inespecífica', 'Nonspecific lymphadenitis', 'Diseases of lymphatic vessels', 'Diseases of the circulatory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('I89', 'Otros trastornos no infecciosos de los vasos linfáticos y de los ganglios linfáticos', 'Other noninfective disorders of lymphatic vessels and lymph nodes', 'Diseases of lymphatic vessels', 'Diseases of the circulatory system');

COMMIT;

-- =====================================================
-- CHAPTER X: Diseases of the respiratory system (J00-J99)
-- =====================================================

-- Acute upper respiratory infections (J00-J06)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J00', 'Rinofaringitis aguda [resfriado común]', 'Acute nasopharyngitis [common cold]', 'Acute upper respiratory infections', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J01', 'Sinusitis aguda', 'Acute sinusitis', 'Acute upper respiratory infections', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J02', 'Faringitis aguda', 'Acute pharyngitis', 'Acute upper respiratory infections', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J03', 'Amigdalitis aguda', 'Acute tonsillitis', 'Acute upper respiratory infections', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J04', 'Laringitis y traqueítis agudas', 'Acute laryngitis and tracheitis', 'Acute upper respiratory infections', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J05', 'Laringitis obstructiva aguda [crup] y epiglotitis', 'Acute obstructive laryngitis [croup] and epiglottitis', 'Acute upper respiratory infections', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J06', 'Infecciones agudas de las vías respiratorias superiores, de sitios múltiples o no especificados', 'Acute upper respiratory infections of multiple and unspecified sites', 'Acute upper respiratory infections', 'Diseases of the respiratory system');

-- Influenza and pneumonia (J09-J18)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J09', 'Influenza debida a ciertos virus de la influenza identificados', 'Influenza due to certain identified influenza viruses', 'Influenza and pneumonia', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J10', 'Influenza debida a otro virus de la influenza identificado', 'Influenza due to other identified influenza virus', 'Influenza and pneumonia', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J11', 'Influenza debida a virus no identificado', 'Influenza, virus not identified', 'Influenza and pneumonia', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J12', 'Neumonía viral, no clasificada en otra parte', 'Viral pneumonia, not elsewhere classified', 'Influenza and pneumonia', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J13', 'Neumonía debida a Streptococcus pneumoniae', 'Pneumonia due to Streptococcus pneumoniae', 'Influenza and pneumonia', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J14', 'Neumonía debida a Haemophilus influenzae', 'Pneumonia due to Haemophilus influenzae', 'Influenza and pneumonia', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J15', 'Neumonía bacteriana, no clasificada en otra parte', 'Bacterial pneumonia, not elsewhere classified', 'Influenza and pneumonia', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J16', 'Neumonía debida a otros microorganismos infecciosos, no clasificados en otra parte', 'Pneumonia due to other infectious organisms, not elsewhere classified', 'Influenza and pneumonia', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J17', 'Neumonía en enfermedades clasificadas en otra parte', 'Pneumonia in diseases classified elsewhere', 'Influenza and pneumonia', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J18', 'Neumonía, organismo no especificado', 'Pneumonia, organism unspecified', 'Influenza and pneumonia', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J18.0', 'Bronconeumonía, no especificada', 'Bronchopneumonia, unspecified', 'Influenza and pneumonia', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J18.1', 'Neumonía lobar, no especificada', 'Lobar pneumonia, unspecified', 'Influenza and pneumonia', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J18.9', 'Neumonía, no especificada', 'Pneumonia, unspecified', 'Influenza and pneumonia', 'Diseases of the respiratory system');

-- Other acute lower respiratory infections (J20-J22)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J20', 'Bronquitis aguda', 'Acute bronchitis', 'Acute lower respiratory infections', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J21', 'Bronquiolitis aguda', 'Acute bronchiolitis', 'Acute lower respiratory infections', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J22', 'Infección aguda no especificada de las vías respiratorias inferiores', 'Unspecified acute lower respiratory infection', 'Acute lower respiratory infections', 'Diseases of the respiratory system');

-- Other diseases of upper respiratory tract (J30-J39)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J30', 'Rinitis alérgica y vasomotora', 'Vasomotor and allergic rhinitis', 'Other upper respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J31', 'Rinitis, rinofaringitis y faringitis crónicas', 'Chronic rhinitis, nasopharyngitis and pharyngitis', 'Other upper respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J32', 'Sinusitis crónica', 'Chronic sinusitis', 'Other upper respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J33', 'Pólipo nasal', 'Nasal polyp', 'Other upper respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J34', 'Otros trastornos de la nariz y de los senos paranasales', 'Other disorders of nose and nasal sinuses', 'Other upper respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J35', 'Enfermedades crónicas de las amígdalas y de las adenoides', 'Chronic diseases of tonsils and adenoids', 'Other upper respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J36', 'Absceso periamigdalino', 'Peritonsillar abscess', 'Other upper respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J37', 'Laringitis y laringotraqueítis crónicas', 'Chronic laryngitis and laryngotracheitis', 'Other upper respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J38', 'Enfermedades de las cuerdas vocales y de la laringe, no clasificadas en otra parte', 'Diseases of vocal cords and larynx, not elsewhere classified', 'Other upper respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J39', 'Otras enfermedades de las vías respiratorias superiores', 'Other diseases of upper respiratory tract', 'Other upper respiratory diseases', 'Diseases of the respiratory system');

-- Chronic lower respiratory diseases (J40-J47)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J40', 'Bronquitis, no especificada como aguda o crónica', 'Bronchitis, not specified as acute or chronic', 'Chronic lower respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J41', 'Bronquitis crónica simple y mucopurulenta', 'Simple and mucopurulent chronic bronchitis', 'Chronic lower respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J42', 'Bronquitis crónica no especificada', 'Unspecified chronic bronchitis', 'Chronic lower respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J43', 'Enfisema', 'Emphysema', 'Chronic lower respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J44', 'Otras enfermedades pulmonares obstructivas crónicas', 'Other chronic obstructive pulmonary disease', 'Chronic lower respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J44.0', 'Enfermedad pulmonar obstructiva crónica con infección aguda de las vías respiratorias inferiores', 'Chronic obstructive pulmonary disease with acute lower respiratory infection', 'Chronic lower respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J44.1', 'Enfermedad pulmonar obstructiva crónica con exacerbación aguda, no especificada', 'Chronic obstructive pulmonary disease with acute exacerbation, unspecified', 'Chronic lower respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J44.9', 'Enfermedad pulmonar obstructiva crónica, no especificada', 'Chronic obstructive pulmonary disease, unspecified', 'Chronic lower respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J45', 'Asma', 'Asthma', 'Chronic lower respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J45.0', 'Asma predominantemente alérgica', 'Predominantly allergic asthma', 'Chronic lower respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J45.1', 'Asma no alérgica', 'Nonallergic asthma', 'Chronic lower respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J45.8', 'Asma mixta', 'Mixed asthma', 'Chronic lower respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J45.9', 'Asma, no especificada', 'Asthma, unspecified', 'Chronic lower respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J46', 'Estado asmático', 'Status asthmaticus', 'Chronic lower respiratory diseases', 'Diseases of the respiratory system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('J47', 'Bronquiectasia', 'Bronchiectasis', 'Chronic lower respiratory diseases', 'Diseases of the respiratory system');

COMMIT;

-- =====================================================
-- CHAPTER XI: Diseases of the digestive system (K00-K93)
-- =====================================================

-- Diseases of oral cavity, salivary glands and jaws (K00-K14)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K00', 'Trastornos del desarrollo y de la erupción de los dientes', 'Disorders of tooth development and eruption', 'Oral cavity diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K01', 'Dientes incluidos e impactados', 'Embedded and impacted teeth', 'Oral cavity diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K02', 'Caries dental', 'Dental caries', 'Oral cavity diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K03', 'Otras enfermedades de los tejidos duros de los dientes', 'Other diseases of hard tissues of teeth', 'Oral cavity diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K04', 'Enfermedades de la pulpa y de los tejidos periapicales', 'Diseases of pulp and periapical tissues', 'Oral cavity diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K05', 'Gingivitis y enfermedades periodontales', 'Gingivitis and periodontal diseases', 'Oral cavity diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K06', 'Otros trastornos de la encía y de la zona edéntula', 'Other disorders of gingiva and edentulous alveolar ridge', 'Oral cavity diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K08', 'Otros trastornos de los dientes y de sus estructuras de sostén', 'Other disorders of teeth and supporting structures', 'Oral cavity diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K11', 'Enfermedades de las glándulas salivales', 'Diseases of salivary glands', 'Oral cavity diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K12', 'Estomatitis y lesiones afines', 'Stomatitis and related lesions', 'Oral cavity diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K13', 'Otras enfermedades de los labios y de la mucosa bucal', 'Other diseases of lip and oral mucosa', 'Oral cavity diseases', 'Diseases of the digestive system');

-- Diseases of oesophagus, stomach and duodenum (K20-K31)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K20', 'Esofagitis', 'Oesophagitis', 'Oesophagus, stomach and duodenum diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K21', 'Enfermedad del reflujo gastroesofágico', 'Gastro-oesophageal reflux disease', 'Oesophagus, stomach and duodenum diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K22', 'Otras enfermedades del esófago', 'Other diseases of oesophagus', 'Oesophagus, stomach and duodenum diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K25', 'Úlcera gástrica', 'Gastric ulcer', 'Oesophagus, stomach and duodenum diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K26', 'Úlcera duodenal', 'Duodenal ulcer', 'Oesophagus, stomach and duodenum diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K27', 'Úlcera péptica, de sitio no especificado', 'Peptic ulcer, site unspecified', 'Oesophagus, stomach and duodenum diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K28', 'Úlcera gastroyeyunal', 'Gastrojejunal ulcer', 'Oesophagus, stomach and duodenum diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K29', 'Gastritis y duodenitis', 'Gastritis and duodenitis', 'Oesophagus, stomach and duodenum diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K30', 'Dispepsia', 'Dyspepsia', 'Oesophagus, stomach and duodenum diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K31', 'Otras enfermedades del estómago y del duodeno', 'Other diseases of stomach and duodenum', 'Oesophagus, stomach and duodenum diseases', 'Diseases of the digestive system');

-- Diseases of appendix (K35-K38)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K35', 'Apendicitis aguda', 'Acute appendicitis', 'Diseases of appendix', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K36', 'Otras formas de apendicitis', 'Other appendicitis', 'Diseases of appendix', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K37', 'Apendicitis, no especificada', 'Unspecified appendicitis', 'Diseases of appendix', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K38', 'Otras enfermedades del apéndice', 'Other diseases of appendix', 'Diseases of appendix', 'Diseases of the digestive system');

-- Hernia (K40-K46)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K40', 'Hernia inguinal', 'Inguinal hernia', 'Hernia', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K41', 'Hernia femoral', 'Femoral hernia', 'Hernia', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K42', 'Hernia umbilical', 'Umbilical hernia', 'Hernia', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K43', 'Hernia ventral', 'Ventral hernia', 'Hernia', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K44', 'Hernia diafragmática', 'Diaphragmatic hernia', 'Hernia', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K45', 'Otras hernias de la cavidad abdominal', 'Other abdominal hernia', 'Hernia', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K46', 'Hernia no especificada de la cavidad abdominal', 'Unspecified abdominal hernia', 'Hernia', 'Diseases of the digestive system');

-- Noninfective enteritis and colitis (K50-K52)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K50', 'Enfermedad de Crohn [enteritis regional]', 'Crohn disease [regional enteritis]', 'Noninfective enteritis and colitis', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K51', 'Colitis ulcerativa', 'Ulcerative colitis', 'Noninfective enteritis and colitis', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K52', 'Otras gastroenteritis y colitis no infecciosas', 'Other noninfective gastroenteritis and colitis', 'Noninfective enteritis and colitis', 'Diseases of the digestive system');

-- Other diseases of intestines (K55-K63)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K55', 'Trastornos vasculares de los intestinos', 'Vascular disorders of intestine', 'Other intestinal diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K56', 'Íleo paralítico y obstrucción intestinal sin hernia', 'Paralytic ileus and intestinal obstruction without hernia', 'Other intestinal diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K57', 'Enfermedad diverticular del intestino', 'Diverticular disease of intestine', 'Other intestinal diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K58', 'Síndrome del colon irritable', 'Irritable bowel syndrome', 'Other intestinal diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K59', 'Otros trastornos funcionales del intestino', 'Other functional intestinal disorders', 'Other intestinal diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K60', 'Fisura y fístula de las regiones anal y rectal', 'Fissure and fistula of anal and rectal regions', 'Other intestinal diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K61', 'Absceso de las regiones anal y rectal', 'Abscess of anal and rectal regions', 'Other intestinal diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K62', 'Otras enfermedades del ano y del recto', 'Other diseases of anus and rectum', 'Other intestinal diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K63', 'Otras enfermedades de los intestinos', 'Other diseases of intestine', 'Other intestinal diseases', 'Diseases of the digestive system');

-- Diseases of peritoneum (K65-K67)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K65', 'Peritonitis', 'Peritonitis', 'Diseases of peritoneum', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K66', 'Otros trastornos del peritoneo', 'Other disorders of peritoneum', 'Diseases of peritoneum', 'Diseases of the digestive system');

-- Diseases of liver (K70-K77)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K70', 'Enfermedad alcohólica del hígado', 'Alcoholic liver disease', 'Diseases of liver', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K71', 'Enfermedad tóxica del hígado', 'Toxic liver disease', 'Diseases of liver', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K72', 'Insuficiencia hepática, no clasificada en otra parte', 'Hepatic failure, not elsewhere classified', 'Diseases of liver', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K73', 'Hepatitis crónica, no clasificada en otra parte', 'Chronic hepatitis, not elsewhere classified', 'Diseases of liver', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K74', 'Fibrosis y cirrosis del hígado', 'Fibrosis and cirrhosis of liver', 'Diseases of liver', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K75', 'Otras enfermedades inflamatorias del hígado', 'Other inflammatory liver diseases', 'Diseases of liver', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K76', 'Otras enfermedades del hígado', 'Other diseases of liver', 'Diseases of liver', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K77', 'Trastornos del hígado en enfermedades clasificadas en otra parte', 'Liver disorders in diseases classified elsewhere', 'Diseases of liver', 'Diseases of the digestive system');

-- Disorders of gallbladder, biliary tract and pancreas (K80-K87)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K80', 'Colelitiasis', 'Cholelithiasis', 'Gallbladder and pancreas diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K81', 'Colecistitis', 'Cholecystitis', 'Gallbladder and pancreas diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K82', 'Otras enfermedades de la vesícula biliar', 'Other diseases of gallbladder', 'Gallbladder and pancreas diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K83', 'Otras enfermedades de las vías biliares', 'Other diseases of biliary tract', 'Gallbladder and pancreas diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K85', 'Pancreatitis aguda', 'Acute pancreatitis', 'Gallbladder and pancreas diseases', 'Diseases of the digestive system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('K86', 'Otras enfermedades del páncreas', 'Other diseases of pancreas', 'Gallbladder and pancreas diseases', 'Diseases of the digestive system');

COMMIT;

-- =====================================================
-- CHAPTER XIV: Diseases of the genitourinary system (N00-N99)
-- =====================================================

-- Glomerular diseases (N00-N08)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N00', 'Síndrome nefrítico agudo', 'Acute nephritic syndrome', 'Glomerular diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N01', 'Síndrome nefrítico rápidamente progresivo', 'Rapidly progressive nephritic syndrome', 'Glomerular diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N02', 'Hematuria recurrente y persistente', 'Recurrent and persistent haematuria', 'Glomerular diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N03', 'Síndrome nefrítico crónico', 'Chronic nephritic syndrome', 'Glomerular diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N04', 'Síndrome nefrótico', 'Nephrotic syndrome', 'Glomerular diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N05', 'Síndrome nefrítico no especificado', 'Unspecified nephritic syndrome', 'Glomerular diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N06', 'Proteinuria aislada con lesión morfológica especificada', 'Isolated proteinuria with specified morphological lesion', 'Glomerular diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N07', 'Nefropatía hereditaria, no clasificada en otra parte', 'Hereditary nephropathy, not elsewhere classified', 'Glomerular diseases', 'Diseases of the genitourinary system');

-- Renal tubulo-interstitial diseases (N10-N16)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N10', 'Nefritis tubulointersticial aguda', 'Acute tubulo-interstitial nephritis', 'Renal tubulo-interstitial diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N11', 'Nefritis tubulointersticial crónica', 'Chronic tubulo-interstitial nephritis', 'Renal tubulo-interstitial diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N12', 'Nefritis tubulointersticial, no especificada como aguda o crónica', 'Tubulo-interstitial nephritis, not specified as acute or chronic', 'Renal tubulo-interstitial diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N13', 'Uropatía obstructiva y por reflujo', 'Obstructive and reflux uropathy', 'Renal tubulo-interstitial diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N14', 'Afecciones tubulares y tubulointersticiales inducidas por drogas y metales pesados', 'Drug- and heavy-metal-induced tubulo-interstitial and tubular conditions', 'Renal tubulo-interstitial diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N15', 'Otras enfermedades renales tubulointersticiales', 'Other renal tubulo-interstitial diseases', 'Renal tubulo-interstitial diseases', 'Diseases of the genitourinary system');

-- Renal failure (N17-N19)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N17', 'Insuficiencia renal aguda', 'Acute renal failure', 'Renal failure', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N18', 'Enfermedad renal crónica', 'Chronic kidney disease', 'Renal failure', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N19', 'Insuficiencia renal no especificada', 'Unspecified kidney failure', 'Renal failure', 'Diseases of the genitourinary system');

-- Urolithiasis (N20-N23)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N20', 'Cálculo del riñón y del uréter', 'Calculus of kidney and ureter', 'Urolithiasis', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N21', 'Cálculo de las vías urinarias inferiores', 'Calculus of lower urinary tract', 'Urolithiasis', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N22', 'Cálculo de las vías urinarias en enfermedades clasificadas en otra parte', 'Calculus of urinary tract in diseases classified elsewhere', 'Urolithiasis', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N23', 'Cólico renal, no especificado', 'Unspecified renal colic', 'Urolithiasis', 'Diseases of the genitourinary system');

-- Other disorders of kidney and ureter (N25-N29)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N25', 'Trastornos resultantes de la función tubular renal alterada', 'Disorders resulting from impaired renal tubular function', 'Other kidney disorders', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N26', 'Riñón contraído, no especificado', 'Unspecified contracted kidney', 'Other kidney disorders', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N27', 'Hipoplasia renal de causa desconocida', 'Small kidney of unknown cause', 'Other kidney disorders', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N28', 'Otros trastornos del riñón y del uréter, no clasificados en otra parte', 'Other disorders of kidney and ureter, not elsewhere classified', 'Other kidney disorders', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N29', 'Otros trastornos del riñón y del uréter en enfermedades clasificadas en otra parte', 'Other disorders of kidney and ureter in diseases classified elsewhere', 'Other kidney disorders', 'Diseases of the genitourinary system');

-- Other diseases of urinary system (N30-N39)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N30', 'Cistitis', 'Cystitis', 'Other urinary system diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N31', 'Disfunción neuromuscular de la vejiga, no clasificada en otra parte', 'Neuromuscular dysfunction of bladder, not elsewhere classified', 'Other urinary system diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N32', 'Otros trastornos de la vejiga', 'Other disorders of bladder', 'Other urinary system diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N34', 'Uretritis y síndrome uretral', 'Urethritis and urethral syndrome', 'Other urinary system diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N35', 'Estrechez uretral', 'Urethral stricture', 'Other urinary system diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N36', 'Otros trastornos de la uretra', 'Other disorders of urethra', 'Other urinary system diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N39', 'Otros trastornos del sistema urinario', 'Other disorders of urinary system', 'Other urinary system diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N39.0', 'Infección de vías urinarias, sitio no especificado', 'Urinary tract infection, site not specified', 'Other urinary system diseases', 'Diseases of the genitourinary system');

-- Diseases of male genital organs (N40-N51)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N40', 'Hiperplasia de la próstata', 'Hyperplasia of prostate', 'Male genital organ diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N41', 'Enfermedades inflamatorias de la próstata', 'Inflammatory diseases of prostate', 'Male genital organ diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N42', 'Otros trastornos de la próstata', 'Other disorders of prostate', 'Male genital organ diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N43', 'Hidrocele y espermatocele', 'Hydrocele and spermatocele', 'Male genital organ diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N44', 'Torsión del testículo', 'Torsion of testis', 'Male genital organ diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N45', 'Orquitis y epididimitis', 'Orchitis and epididymitis', 'Male genital organ diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N46', 'Infertilidad masculina', 'Male infertility', 'Male genital organ diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N47', 'Prepucio redundante, fimosis y parafimosis', 'Redundant prepuce, phimosis and paraphimosis', 'Male genital organ diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N48', 'Otros trastornos del pene', 'Other disorders of penis', 'Male genital organ diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N49', 'Trastornos inflamatorios de órganos genitales masculinos, no clasificados en otra parte', 'Inflammatory disorders of male genital organs, not elsewhere classified', 'Male genital organ diseases', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N50', 'Otros trastornos de los órganos genitales masculinos', 'Other disorders of male genital organs', 'Male genital organ diseases', 'Diseases of the genitourinary system');

-- Disorders of breast (N60-N64)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N60', 'Displasia mamaria benigna', 'Benign mammary dysplasia', 'Disorders of breast', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N61', 'Trastornos inflamatorios de la mama', 'Inflammatory disorders of breast', 'Disorders of breast', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N62', 'Hipertrofia de la mama', 'Hypertrophy of breast', 'Disorders of breast', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N63', 'Masa no especificada en la mama', 'Unspecified lump in breast', 'Disorders of breast', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N64', 'Otros trastornos de la mama', 'Other disorders of breast', 'Disorders of breast', 'Diseases of the genitourinary system');

-- Inflammatory diseases of female pelvic organs (N70-N77)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N70', 'Salpingitis y ooforitis', 'Salpingitis and oophoritis', 'Inflammatory diseases of female pelvic organs', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N71', 'Enfermedad inflamatoria del útero, excepto del cuello uterino', 'Inflammatory disease of uterus, except cervix', 'Inflammatory diseases of female pelvic organs', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N72', 'Enfermedad inflamatoria del cuello uterino', 'Inflammatory disease of cervix uteri', 'Inflammatory diseases of female pelvic organs', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N73', 'Otras enfermedades inflamatorias pélvicas femeninas', 'Other female pelvic inflammatory diseases', 'Inflammatory diseases of female pelvic organs', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N74', 'Trastornos inflamatorios de la pelvis femenina en enfermedades clasificadas en otra parte', 'Female pelvic inflammatory disorders in diseases classified elsewhere', 'Inflammatory diseases of female pelvic organs', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N75', 'Enfermedades de la glándula de Bartholin', 'Diseases of Bartholin gland', 'Inflammatory diseases of female pelvic organs', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N76', 'Otras afecciones inflamatorias de la vagina y de la vulva', 'Other inflammation of vagina and vulva', 'Inflammatory diseases of female pelvic organs', 'Diseases of the genitourinary system');

-- Noninflammatory disorders of female genital tract (N80-N98)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N80', 'Endometriosis', 'Endometriosis', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N81', 'Prolapso genital femenino', 'Female genital prolapse', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N82', 'Fístulas que afectan el tracto genital femenino', 'Fistulae involving female genital tract', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N83', 'Trastornos no inflamatorios del ovario, de la trompa de Falopio y del ligamento ancho', 'Noninflammatory disorders of ovary, fallopian tube and broad ligament', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N84', 'Pólipo del tracto genital femenino', 'Polyp of female genital tract', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N85', 'Otros trastornos no inflamatorios del útero, excepto del cuello uterino', 'Other noninflammatory disorders of uterus, except cervix', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N86', 'Erosión y ectropión del cuello uterino', 'Erosion and ectropion of cervix uteri', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N87', 'Displasia del cuello uterino', 'Dysplasia of cervix uteri', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N88', 'Otros trastornos no inflamatorios del cuello uterino', 'Other noninflammatory disorders of cervix uteri', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N89', 'Otros trastornos no inflamatorios de la vagina', 'Other noninflammatory disorders of vagina', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N90', 'Otros trastornos no inflamatorios de la vulva y del perineo', 'Other noninflammatory disorders of vulva and perineum', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N91', 'Menstruación ausente, escasa o rara', 'Absent, scanty and rare menstruation', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N92', 'Menstruación excesiva, frecuente e irregular', 'Excessive, frequent and irregular menstruation', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N93', 'Otras hemorragias uterinas o vaginales anormales', 'Other abnormal uterine and vaginal bleeding', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N94', 'Dolor y otras afecciones relacionadas con los órganos genitales femeninos y con el ciclo menstrual', 'Pain and other conditions associated with female genital organs and menstrual cycle', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N95', 'Trastornos menopáusicos y otros trastornos perimenopáusicos', 'Menopausal and other perimenopausal disorders', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N96', 'Aborto habitual', 'Habitual aborter', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('N97', 'Infertilidad femenina', 'Female infertility', 'Noninflammatory disorders of female genital tract', 'Diseases of the genitourinary system');

COMMIT;

-- =====================================================
-- CHAPTER XIX: Injury, poisoning and certain other consequences of external causes (S00-T98)
-- =====================================================

-- Injuries to the head (S00-S09)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S00', 'Traumatismo superficial de la cabeza', 'Superficial injury of head', 'Injuries to the head', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S01', 'Herida de la cabeza', 'Open wound of head', 'Injuries to the head', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S02', 'Fractura de huesos del cráneo y de la cara', 'Fracture of skull and facial bones', 'Injuries to the head', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S03', 'Luxación, esguince y torcedura de articulaciones y ligamentos de la cabeza', 'Dislocation, sprain and strain of joints and ligaments of head', 'Injuries to the head', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S04', 'Traumatismo de nervios craneales', 'Injury of cranial nerves', 'Injuries to the head', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S05', 'Traumatismo del ojo y de la órbita', 'Injury of eye and orbit', 'Injuries to the head', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S06', 'Traumatismo intracraneal', 'Intracranial injury', 'Injuries to the head', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S07', 'Traumatismo por aplastamiento de la cabeza', 'Crushing injury of head', 'Injuries to the head', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S08', 'Amputación traumática de parte de la cabeza', 'Traumatic amputation of part of head', 'Injuries to the head', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S09', 'Otros traumatismos y los no especificados de la cabeza', 'Other and unspecified injuries of head', 'Injuries to the head', 'Injury, poisoning and certain other consequences of external causes');

-- Injuries to the neck (S10-S19)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S10', 'Traumatismo superficial del cuello', 'Superficial injury of neck', 'Injuries to the neck', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S11', 'Herida del cuello', 'Open wound of neck', 'Injuries to the neck', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S12', 'Fractura del cuello', 'Fracture of neck', 'Injuries to the neck', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S13', 'Luxación, esguince y torcedura de articulaciones y ligamentos del cuello', 'Dislocation, sprain and strain of joints and ligaments at neck level', 'Injuries to the neck', 'Injury, poisoning and certain other consequences of external causes');

-- Injuries to the thorax (S20-S29)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S20', 'Traumatismo superficial del tórax', 'Superficial injury of thorax', 'Injuries to the thorax', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S21', 'Herida del tórax', 'Open wound of thorax', 'Injuries to the thorax', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S22', 'Fractura de costilla(s), esternón y columna torácica', 'Fracture of rib(s), sternum and thoracic spine', 'Injuries to the thorax', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S23', 'Luxación, esguince y torcedura de articulaciones y ligamentos del tórax', 'Dislocation, sprain and strain of joints and ligaments of thorax', 'Injuries to the thorax', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S24', 'Traumatismo de nervios y de la médula espinal a nivel del tórax', 'Injury of nerves and spinal cord at thorax level', 'Injuries to the thorax', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S25', 'Traumatismo de vasos sanguíneos del tórax', 'Injury of blood vessels of thorax', 'Injuries to the thorax', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S26', 'Traumatismo del corazón', 'Injury of heart', 'Injuries to the thorax', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S27', 'Traumatismo de otros órganos intratorácicos y de los no especificados', 'Injury of other and unspecified intrathoracic organs', 'Injuries to the thorax', 'Injury, poisoning and certain other consequences of external causes');

-- Injuries to the abdomen, lower back, lumbar spine and pelvis (S30-S39)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S30', 'Traumatismo superficial del abdomen, de la región lumbosacra y de la pelvis', 'Superficial injury of abdomen, lower back and pelvis', 'Injuries to the abdomen', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S31', 'Herida del abdomen, de la región lumbosacra y de la pelvis', 'Open wound of abdomen, lower back and pelvis', 'Injuries to the abdomen', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S32', 'Fractura de la columna lumbar y de la pelvis', 'Fracture of lumbar spine and pelvis', 'Injuries to the abdomen', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S33', 'Luxación, esguince y torcedura de articulaciones y ligamentos de la columna lumbar y de la pelvis', 'Dislocation, sprain and strain of joints and ligaments of lumbar spine and pelvis', 'Injuries to the abdomen', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S34', 'Traumatismo de los nervios y de la médula espinal lumbar, a nivel del abdomen, de la región lumbosacra y de la pelvis', 'Injury of nerves and lumbar spinal cord at abdomen, lower back and pelvis level', 'Injuries to the abdomen', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S35', 'Traumatismo de vasos sanguíneos a nivel del abdomen, de la región lumbosacra y de la pelvis', 'Injury of blood vessels at abdomen, lower back and pelvis level', 'Injuries to the abdomen', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S36', 'Traumatismo de órganos intraabdominales', 'Injury of intra-abdominal organs', 'Injuries to the abdomen', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S37', 'Traumatismo de los órganos pélvicos', 'Injury of pelvic organs', 'Injuries to the abdomen', 'Injury, poisoning and certain other consequences of external causes');

-- Injuries to the shoulder and upper arm (S40-S49)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S40', 'Traumatismo superficial del hombro y del brazo', 'Superficial injury of shoulder and upper arm', 'Injuries to the shoulder and upper arm', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S41', 'Herida del hombro y del brazo', 'Open wound of shoulder and upper arm', 'Injuries to the shoulder and upper arm', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S42', 'Fractura del hombro y del brazo', 'Fracture of shoulder and upper arm', 'Injuries to the shoulder and upper arm', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S43', 'Luxación, esguince y torcedura de articulaciones y ligamentos de la cintura escapular', 'Dislocation, sprain and strain of joints and ligaments of shoulder girdle', 'Injuries to the shoulder and upper arm', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S44', 'Traumatismo de nervios a nivel del hombro y del brazo', 'Injury of nerves at shoulder and upper arm level', 'Injuries to the shoulder and upper arm', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S45', 'Traumatismo de vasos sanguíneos a nivel del hombro y del brazo', 'Injury of blood vessels at shoulder and upper arm level', 'Injuries to the shoulder and upper arm', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S46', 'Traumatismo de tendón y músculo a nivel del hombro y del brazo', 'Injury of muscle and tendon at shoulder and upper arm level', 'Injuries to the shoulder and upper arm', 'Injury, poisoning and certain other consequences of external causes');

-- Injuries to the elbow and forearm (S50-S59)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S50', 'Traumatismo superficial del antebrazo', 'Superficial injury of forearm', 'Injuries to the elbow and forearm', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S51', 'Herida del antebrazo', 'Open wound of forearm', 'Injuries to the elbow and forearm', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S52', 'Fractura del antebrazo', 'Fracture of forearm', 'Injuries to the elbow and forearm', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S53', 'Luxación, esguince y torcedura de articulaciones y ligamentos del codo', 'Dislocation, sprain and strain of joints and ligaments of elbow', 'Injuries to the elbow and forearm', 'Injury, poisoning and certain other consequences of external causes');

-- Injuries to the wrist and hand (S60-S69)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S60', 'Traumatismo superficial de la muñeca y de la mano', 'Superficial injury of wrist and hand', 'Injuries to the wrist and hand', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S61', 'Herida de la muñeca y de la mano', 'Open wound of wrist and hand', 'Injuries to the wrist and hand', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S62', 'Fractura a nivel de la muñeca y de la mano', 'Fracture at wrist and hand level', 'Injuries to the wrist and hand', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S63', 'Luxación, esguince y torcedura de articulaciones y ligamentos a nivel de la muñeca y de la mano', 'Dislocation, sprain and strain of joints and ligaments at wrist and hand level', 'Injuries to the wrist and hand', 'Injury, poisoning and certain other consequences of external causes');

-- Injuries to the hip and thigh (S70-S79)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S70', 'Traumatismo superficial de la cadera y del muslo', 'Superficial injury of hip and thigh', 'Injuries to the hip and thigh', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S71', 'Herida de la cadera y del muslo', 'Open wound of hip and thigh', 'Injuries to the hip and thigh', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S72', 'Fractura del fémur', 'Fracture of femur', 'Injuries to the hip and thigh', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S73', 'Luxación, esguince y torcedura de la articulación y de los ligamentos de la cadera', 'Dislocation, sprain and strain of joint and ligaments of hip', 'Injuries to the hip and thigh', 'Injury, poisoning and certain other consequences of external causes');

-- Injuries to the knee and lower leg (S80-S89)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S80', 'Traumatismo superficial de la pierna', 'Superficial injury of lower leg', 'Injuries to the knee and lower leg', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S81', 'Herida de la pierna', 'Open wound of lower leg', 'Injuries to the knee and lower leg', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S82', 'Fractura de la pierna, inclusive el tobillo', 'Fracture of lower leg, including ankle', 'Injuries to the knee and lower leg', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S83', 'Luxación, esguince y torcedura de articulaciones y ligamentos de la rodilla', 'Dislocation, sprain and strain of joints and ligaments of knee', 'Injuries to the knee and lower leg', 'Injury, poisoning and certain other consequences of external causes');

-- Injuries to the ankle and foot (S90-S99)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S90', 'Traumatismo superficial del tobillo y del pie', 'Superficial injury of ankle and foot', 'Injuries to the ankle and foot', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S91', 'Herida del tobillo y del pie', 'Open wound of ankle and foot', 'Injuries to the ankle and foot', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S92', 'Fractura del pie, excepto del tobillo', 'Fracture of foot, except ankle', 'Injuries to the ankle and foot', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('S93', 'Luxación, esguince y torcedura de articulaciones y ligamentos del tobillo y del pie', 'Dislocation, sprain and strain of joints and ligaments at ankle and foot level', 'Injuries to the ankle and foot', 'Injury, poisoning and certain other consequences of external causes');

-- Poisoning by drugs, medicaments and biological substances (T36-T50)
INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('T36', 'Envenenamiento por antibióticos sistémicos', 'Poisoning by systemic antibiotics', 'Poisoning', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('T37', 'Envenenamiento por otros antiinfecciosos y antiparasitarios sistémicos', 'Poisoning by other systemic anti-infectives and antiparasitics', 'Poisoning', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('T38', 'Envenenamiento por hormonas y sus sustitutos sintéticos y antagonistas, no clasificados en otra parte', 'Poisoning by hormones and their synthetic substitutes and antagonists, not elsewhere classified', 'Poisoning', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('T39', 'Envenenamiento por analgésicos no narcóticos, antipiréticos y antirreumáticos', 'Poisoning by nonopioid analgesics, antipyretics and antirheumatics', 'Poisoning', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('T40', 'Envenenamiento por narcóticos y psicodislépticos [alucinógenos]', 'Poisoning by narcotics and psychodysleptics [hallucinogens]', 'Poisoning', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('T41', 'Envenenamiento por anestésicos y gases terapéuticos', 'Poisoning by anaesthetics and therapeutic gases', 'Poisoning', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('T42', 'Envenenamiento por antiepilépticos, sedantes-hipnóticos y drogas antiparkinsonianas', 'Poisoning by antiepileptic, sedative-hypnotic and antiparkinsonism drugs', 'Poisoning', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('T43', 'Envenenamiento por drogas psicotrópicas, no clasificadas en otra parte', 'Poisoning by psychotropic drugs, not elsewhere classified', 'Poisoning', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('T44', 'Envenenamiento por drogas que afectan primariamente el sistema nervioso autónomo', 'Poisoning by drugs primarily affecting the autonomic nervous system', 'Poisoning', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('T45', 'Envenenamiento por agentes primariamente sistémicos y hematológicos, no clasificados en otra parte', 'Poisoning by primarily systemic and haematological agents, not elsewhere classified', 'Poisoning', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('T46', 'Envenenamiento por agentes que afectan primariamente el sistema cardiovascular', 'Poisoning by agents primarily affecting the cardiovascular system', 'Poisoning', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('T47', 'Envenenamiento por agentes que afectan primariamente el sistema gastrointestinal', 'Poisoning by agents primarily affecting the gastrointestinal system', 'Poisoning', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('T48', 'Envenenamiento por agentes que actúan primariamente sobre los músculos lisos y esqueléticos y sobre el sistema respiratorio', 'Poisoning by agents primarily acting on smooth and skeletal muscles and the respiratory system', 'Poisoning', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('T49', 'Envenenamiento por agentes tópicos que afectan primariamente la piel y las membranas mucosas y por drogas oftalmológicas, otorrinolaringológicas y dentales', 'Poisoning by topical agents primarily affecting skin and mucous membrane and by ophthalmological, otorhinolaryngological and dental drugs', 'Poisoning', 'Injury, poisoning and certain other consequences of external causes');

INSERT INTO CIE10_CATALOG (CODE, DESCRIPTION_ES, DESCRIPTION_EN, CATEGORY, CHAPTER) 
VALUES ('T50', 'Envenenamiento por diuréticos y otras drogas, medicamentos y sustancias biológicas, y los no especificados', 'Poisoning by diuretics and other and unspecified drugs, medicaments and biological substances', 'Poisoning', 'Injury, poisoning and certain other consequences of external causes');

COMMIT;

-- Final message
PROMPT CIE-10 catalog data insertion completed successfully!
PROMPT Total records inserted: 500+
PROMPT 
SET DEFINE ON;


COMMIT;

PROMPT 
PROMPT ========================================
PROMPT CIE10_CATALOG Data Completed!
PROMPT ========================================

-- Verify data
SELECT COUNT(*) as total_codes FROM CIE10_CATALOG;
SELECT CHAPTER, COUNT(*) as count FROM CIE10_CATALOG GROUP BY CHAPTER ORDER BY count DESC;

PROMPT ========================================

EXIT;
