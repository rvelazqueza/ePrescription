-- =====================================================
-- Script: 12-audit-ai-logs-data.sql
-- Description: Seed data for audit_logs and ai_analysis_logs tables
-- =====================================================

SET DEFINE OFF;

PROMPT Inserting audit_logs data...

-- User login/logout events
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (2, 'LOGIN', 'USER', 2, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Usuario roberto.andrade inició sesión');

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (2, 'LOGOUT', 'USER', 2, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Usuario roberto.andrade cerró sesión');

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (5, 'LOGIN', 'USER', 5, '192.168.1.105', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Usuario maria.gonzalez inició sesión');

-- Prescription creation events
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (2, 'CREATE', 'PRESCRIPTION', 1, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Prescripción creada para paciente ID 1 - Hipertensión');

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (3, 'CREATE', 'PRESCRIPTION', 2, '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Prescripción creada para paciente ID 2 - Diabetes tipo 2');

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (4, 'CREATE', 'PRESCRIPTION', 3, '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Prescripción creada para paciente ID 3 - Bronquitis aguda');

-- Prescription view events
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (7, 'VIEW', 'PRESCRIPTION', 1, '192.168.1.107', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)', 'Paciente consultó su prescripción');

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (5, 'VIEW', 'PRESCRIPTION', 1, '192.168.1.105', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Farmacéutico consultó prescripción para dispensación');

-- Dispensation events
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (5, 'CREATE', 'DISPENSATION', 1, '192.168.1.105', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Dispensación realizada - Prescripción ID 1, Farmacia ID 1');

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (6, 'CREATE', 'DISPENSATION', 2, '192.168.1.106', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Dispensación realizada - Prescripción ID 2, Farmacia ID 2');

-- Patient data access
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (2, 'VIEW', 'PATIENT', 1, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Médico consultó historial del paciente');

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (7, 'VIEW', 'PATIENT', 1, '192.168.1.107', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)', 'Paciente consultó su propia información');

-- Patient data modification
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (2, 'UPDATE', 'PATIENT', 1, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Actualización de información de contacto del paciente');

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (4, 'CREATE', 'PATIENT', 51, '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Nuevo paciente registrado en el sistema');

-- Inventory management
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (5, 'UPDATE', 'INVENTORY', 1, '192.168.1.105', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Actualización de inventario - Medicamento ID 17, Cantidad: -90');

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (5, 'UPDATE', 'INVENTORY', 2, '192.168.1.105', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Actualización de inventario - Medicamento ID 21, Cantidad: -90');

-- Failed login attempts
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (NULL, 'LOGIN_FAILED', 'USER', NULL, '192.168.1.200', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Intento de login fallido - usuario: unknown_user');

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (NULL, 'LOGIN_FAILED', 'USER', NULL, '192.168.1.200', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Intento de login fallido - usuario: admin, contraseña incorrecta');

-- System administration
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (1, 'CREATE', 'USER', 10, '192.168.1.99', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Nuevo usuario creado por administrador');

INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent, details) 
VALUES (1, 'UPDATE', 'ROLE', 2, '192.168.1.99', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Permisos de rol DOCTOR actualizados');

COMMIT;

PROMPT Inserting ai_analysis_logs data...

-- AI Assistant usage for prescription creation
INSERT INTO ai_analysis_logs (user_id, prescription_id, analysis_type, input_data, output_data, model_used, confidence_score, processing_time_ms) 
VALUES (2, 1, 'CLINICAL_ANALYSIS', 
'Paciente masculino 39 años con presión arterial elevada 150/95 mmHg, sin antecedentes de enfermedad cardiovascular', 
'Diagnóstico sugerido: Hipertensión arterial esencial (I10). Recomendación: Iniciar tratamiento con IECA + diurético. Monitoreo cada 2 semanas.', 
'gpt-4-medical', 0.92, 1250);

INSERT INTO ai_analysis_logs (user_id, prescription_id, analysis_type, input_data, output_data, model_used, confidence_score, processing_time_ms) 
VALUES (3, 2, 'CLINICAL_ANALYSIS', 
'Paciente femenina 34 años con glucemia en ayunas 180 mg/dL, HbA1c 8.5%, poliuria y polidipsia', 
'Diagnóstico sugerido: Diabetes mellitus tipo 2 (E11.9). Recomendación: Iniciar metformina 850mg BID, dieta y ejercicio. Control glucémico mensual.', 
'gpt-4-medical', 0.95, 1180);

INSERT INTO ai_analysis_logs (user_id, prescription_id, analysis_type, input_data, output_data, model_used, confidence_score, processing_time_ms) 
VALUES (4, 3, 'CLINICAL_ANALYSIS', 
'Paciente masculino 46 años con tos productiva, fiebre 38.5°C, dolor torácico al toser, 5 días de evolución', 
'Diagnóstico sugerido: Bronquitis aguda (J20). Recomendación: Azitromicina 500mg QD x 5 días, antitusivo, reposo. Rx tórax si no mejora en 7 días.', 
'gpt-4-medical', 0.88, 1320);

-- Drug interaction checks
INSERT INTO ai_analysis_logs (user_id, prescription_id, analysis_type, input_data, output_data, model_used, confidence_score, processing_time_ms) 
VALUES (2, 12, 'DRUG_INTERACTION', 
'Medicamentos: Aspirina 100mg, Clopidogrel 75mg, Atorvastatina 20mg', 
'ADVERTENCIA: Aspirina + Clopidogrel aumenta riesgo de hemorragia. Monitoreo recomendado. Atorvastatina compatible.', 
'drug-interaction-checker-v2', 0.98, 450);

INSERT INTO ai_analysis_logs (user_id, prescription_id, analysis_type, input_data, output_data, model_used, confidence_score, processing_time_ms) 
VALUES (2, 20, 'DRUG_INTERACTION', 
'Medicamentos: Omeprazol 40mg, Amoxicilina/Clavulánico 875/125mg, Metronidazol 500mg', 
'ADVERTENCIA: Metronidazol + Alcohol contraindicado. Omeprazol puede reducir absorción de algunos antibióticos pero compatible en este caso.', 
'drug-interaction-checker-v2', 0.96, 520);

-- Contraindication checks
INSERT INTO ai_analysis_logs (user_id, prescription_id, analysis_type, input_data, output_data, model_used, confidence_score, processing_time_ms) 
VALUES (2, 1, 'CONTRAINDICATION_CHECK', 
'Paciente: Alergias: Penicilina. Medicamentos propuestos: Enalapril, Hidroclorotiazida', 
'Sin contraindicaciones detectadas. Medicamentos seguros para el paciente.', 
'contraindication-analyzer-v1', 0.99, 380);

INSERT INTO ai_analysis_logs (user_id, prescription_id, analysis_type, input_data, output_data, model_used, confidence_score, processing_time_ms) 
VALUES (3, 2, 'CONTRAINDICATION_CHECK', 
'Paciente: Alergias: Aspirina. Medicamentos propuestos: Metformina', 
'Sin contraindicaciones detectadas. Metformina segura para el paciente.', 
'contraindication-analyzer-v1', 0.99, 350);

-- Dosage recommendations
INSERT INTO ai_analysis_logs (user_id, prescription_id, analysis_type, input_data, output_data, model_used, confidence_score, processing_time_ms) 
VALUES (2, 1, 'DOSAGE_RECOMMENDATION', 
'Paciente: 39 años, 75kg, Función renal normal. Medicamento: Enalapril', 
'Dosis recomendada: Enalapril 10mg QD. Puede ajustarse hasta 20mg según respuesta. Monitoreo de presión arterial y función renal.', 
'dosage-calculator-v1', 0.94, 280);

INSERT INTO ai_analysis_logs (user_id, prescription_id, analysis_type, input_data, output_data, model_used, confidence_score, processing_time_ms) 
VALUES (3, 2, 'DOSAGE_RECOMMENDATION', 
'Paciente: 34 años, 68kg, Función renal normal. Medicamento: Metformina', 
'Dosis recomendada: Metformina 850mg BID con alimentos. Iniciar con 850mg QD y aumentar gradualmente para minimizar efectos GI.', 
'dosage-calculator-v1', 0.93, 290);

-- CIE-10 code suggestions
INSERT INTO ai_analysis_logs (user_id, prescription_id, analysis_type, input_data, output_data, model_used, confidence_score, processing_time_ms) 
VALUES (2, 1, 'CIE10_SUGGESTION', 
'Descripción clínica: Hipertensión arterial esencial sin complicaciones', 
'Código CIE-10 sugerido: I10 - Hipertensión esencial (primaria). Confianza: Alta', 
'cie10-classifier-v1', 0.97, 420);

INSERT INTO ai_analysis_logs (user_id, prescription_id, analysis_type, input_data, output_data, model_used, confidence_score, processing_time_ms) 
VALUES (3, 2, 'CIE10_SUGGESTION', 
'Descripción clínica: Diabetes mellitus tipo 2 sin complicaciones', 
'Código CIE-10 sugerido: E11.9 - Diabetes mellitus no insulinodependiente, sin mención de complicación. Confianza: Alta', 
'cie10-classifier-v1', 0.96, 410);

INSERT INTO ai_analysis_logs (user_id, prescription_id, analysis_type, input_data, output_data, model_used, confidence_score, processing_time_ms) 
VALUES (4, 3, 'CIE10_SUGGESTION', 
'Descripción clínica: Bronquitis aguda con tos productiva y fiebre', 
'Código CIE-10 sugerido: J20 - Bronquitis aguda. Confianza: Alta', 
'cie10-classifier-v1', 0.94, 430);

-- Translation service logs (Spanish to English for AI processing)
INSERT INTO ai_analysis_logs (user_id, prescription_id, analysis_type, input_data, output_data, model_used, confidence_score, processing_time_ms) 
VALUES (2, 1, 'TRANSLATION', 
'Paciente con presión arterial elevada y cefalea', 
'Patient with elevated blood pressure and headache', 
'azure-translator-v3', 0.99, 150);

INSERT INTO ai_analysis_logs (user_id, prescription_id, analysis_type, input_data, output_data, model_used, confidence_score, processing_time_ms) 
VALUES (3, 2, 'TRANSLATION', 
'Paciente con sed excesiva y micción frecuente', 
'Patient with excessive thirst and frequent urination', 
'azure-translator-v3', 0.99, 145);

COMMIT;

PROMPT Audit and AI analysis logs data insertion completed successfully!
PROMPT Total audit_logs inserted: 20+
PROMPT Total ai_analysis_logs inserted: 15+

PROMPT 
PROMPT NOTE: Audit logs are immutable and protected by database trigger
PROMPT AI analysis logs demonstrate usage of AI assistant for clinical decision support
PROMPT 

SET DEFINE ON;
