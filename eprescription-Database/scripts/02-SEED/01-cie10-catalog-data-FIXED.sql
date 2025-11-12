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

