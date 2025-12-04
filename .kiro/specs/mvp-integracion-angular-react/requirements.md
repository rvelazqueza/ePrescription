# MVP - Integración Angular + React

## Introducción

Este documento especifica los requisitos para el MVP de ePrescription, que integra servicios backend con vistas frontend en Angular y React. El objetivo es tener 9 vistas completamente funcionales con datos reales, incluyendo la migración del asistente de IA, integración de talonarios, y manejo de dispensaciones.

Las vistas se priorizan por criticidad: Nueva Receta, Recetas Emitidas, Dispensación, Pacientes, Perfil Paciente, Médicos, Auditoría, Centros Médicos, y Farmacias.

**Orden de Implementación (por dependencias):**
1. **Fase 0 - Base de Datos de Talonarios** (Requisitos 10, 11, 12)
   - Crear tablas: PRESCRIPTION_PAD_TYPES, PRESCRIPTION_PADS, PRESCRIPTION_SLIPS
   - Actualizar MEDICATIONS con PAD_TYPE_ID
   - Crear servicios backend para gestión de talonarios

2. **Fase 1 - Nueva Receta** (Requisito 1)
   - Depende de: Talonarios backend

3. **Fase 2 - Recetas Emitidas** (Requisito 2)
   - Depende de: Nueva Receta

4. **Fase 3 - Dispensación** (Requisito 3)
   - Depende de: Recetas Emitidas

5. **Fase 4 - Vistas de Gestión** (Requisitos 4-9)
   - Pacientes, Médicos, Auditoría, Centros, Farmacias
   - Independientes entre sí

## Glosario

- **Talonario (Prescription Pad)**: Documento autorizado que permite a un médico emitir recetas. Tiene número de serie, cantidad de recetas disponibles, y fecha de vencimiento. Asociado a un tipo específico.
- **Tipo de Talonario (Pad Type)**: Categoría de talonario que define qué medicamentos pueden prescribirse. Tipos: Libre/Normal, Antimicrobianos, Psicotrópicos, Estupefacientes.
- **Receta (Prescription)**: Documento médico que contiene medicamentos prescritos a un paciente.
- **Borrador (Draft)**: Receta no emitida, guardada en estado temporal.
- **Dispensación**: Acto de entregar medicamentos en una farmacia según una receta.
- **EF Core**: Entity Framework Core, ORM para .NET que puede tener limitaciones con Oracle.
- **IA Assistant**: Asistente de inteligencia artificial que ayuda en la creación de recetas.
- **Auditoría**: Registro de todas las acciones realizadas en el sistema.
- **Boleta (Prescription Slip)**: Unidad individual de un talonario con ID único. Cada talonario tiene 50 boletas por defecto. Cada boleta tiene un número secuencial único.

## Requisitos

### Requisito 1: Nueva Receta con Talonarios e IA

**User Story:** Como médico, quiero crear una nueva receta seleccionando un talonario válido e integrando un asistente de IA, para que pueda emitir recetas de forma rápida y precisa.

#### Criterios de Aceptación

1. WHEN a doctor accesses the new prescription form THEN the system SHALL display a dropdown with available prescription pads for that doctor
2. WHEN a doctor selects a prescription pad THEN the system SHALL validate that the pad has available prescriptions remaining and is not expired
3. WHEN a doctor creates a prescription THEN the system SHALL decrement the available count on the selected prescription pad
4. WHEN a doctor uses the AI assistant THEN the system SHALL suggest medications based on diagnosis and patient history
5. WHEN a prescription is created THEN the system SHALL persist it to the database immediately with status "draft"
6. WHEN a doctor submits a draft prescription THEN the system SHALL change its status to "issued" and assign a prescription number

---

### Requisito 2: Recetas Emitidas

**User Story:** Como médico, quiero ver todas mis recetas emitidas con opciones para duplicar, anular o descargar, para que pueda gestionar mi historial de prescripciones.

#### Criterios de Aceptación

1. WHEN a doctor views issued prescriptions THEN the system SHALL display all prescriptions with status "issued" or "dispensed"
2. WHEN a doctor filters prescriptions THEN the system SHALL return only prescriptions matching the selected criteria (date range, patient, status)
3. WHEN a doctor clicks duplicate on a prescription THEN the system SHALL create a new draft with the same medications and diagnoses
4. WHEN a doctor clicks cancel on a prescription THEN the system SHALL change its status to "cancelled" and prevent further dispensation
5. WHEN a doctor downloads a prescription THEN the system SHALL generate a PDF with all prescription details

---

### Requisito 3: Registrar Dispensación

**User Story:** Como farmacéutico, quiero registrar la dispensación de medicamentos según una receta, para que pueda mantener un registro de medicamentos entregados.

#### Criterios de Aceptación

1. WHEN a pharmacist searches for a prescription THEN the system SHALL return prescriptions by prescription number or patient name
2. WHEN a pharmacist selects a prescription THEN the system SHALL display all medications and quantities prescribed
3. WHEN a pharmacist registers dispensation THEN the system SHALL record which medications were dispensed and in what quantities
4. WHEN a pharmacist completes dispensation THEN the system SHALL change the prescription status to "dispensed"
5. WHEN a pharmacist attempts to dispense more than prescribed THEN the system SHALL prevent the action and show an error

---

### Requisito 4: Listado de Pacientes

**User Story:** Como médico, quiero ver un listado de todos los pacientes registrados con búsqueda y filtros, para que pueda encontrar rápidamente a un paciente específico.

#### Criterios de Aceptación

1. WHEN a doctor views the patient list THEN the system SHALL display all patients with name, ID number, age, and gender
2. WHEN a doctor searches for a patient THEN the system SHALL return patients matching the search term in name or ID number
3. WHEN a doctor filters patients THEN the system SHALL return patients matching the selected criteria (age range, gender, specialty)
4. WHEN a doctor clicks on a patient THEN the system SHALL navigate to the patient profile view
5. WHEN the patient list loads THEN the system SHALL display pagination with 10 patients per page

---

### Requisito 5: Perfil del Paciente

**User Story:** Como médico, quiero ver el perfil completo de un paciente incluyendo su historial de recetas, para que pueda tomar decisiones informadas al prescribir.

#### Criterios de Aceptación

1. WHEN a doctor views a patient profile THEN the system SHALL display patient demographics (name, ID, age, gender, contact)
2. WHEN a doctor views a patient profile THEN the system SHALL display all prescriptions issued to that patient
3. WHEN a doctor views a patient profile THEN the system SHALL display medication history and allergies if registered
4. WHEN a doctor clicks on a prescription in the history THEN the system SHALL show prescription details
5. WHEN a doctor is on a patient profile THEN the system SHALL provide a button to create a new prescription for that patient

---

### Requisito 6: Listado de Médicos

**User Story:** Como administrador, quiero ver un listado de todos los médicos registrados con sus especialidades, para que pueda gestionar el acceso al sistema.

#### Criterios de Aceptación

1. WHEN an admin views the doctor list THEN the system SHALL display all doctors with name, license number, specialty, and status
2. WHEN an admin searches for a doctor THEN the system SHALL return doctors matching the search term in name or license number
3. WHEN an admin filters doctors THEN the system SHALL return doctors matching the selected specialty
4. WHEN an admin clicks on a doctor THEN the system SHALL show doctor details and prescription statistics
5. WHEN the doctor list loads THEN the system SHALL display pagination with 10 doctors per page

---

### Requisito 7: Log de Auditoría

**User Story:** Como administrador, quiero ver un registro completo de todas las acciones realizadas en el sistema, para que pueda auditar y detectar anomalías.

#### Criterios de Aceptación

1. WHEN an admin views the audit log THEN the system SHALL display all actions with timestamp, user, action type, and affected resource
2. WHEN an admin filters the audit log THEN the system SHALL return actions matching the selected criteria (date range, user, action type)
3. WHEN an admin searches the audit log THEN the system SHALL return actions matching the search term
4. WHEN an admin views an audit entry THEN the system SHALL show before/after values for modified records
5. WHEN the audit log loads THEN the system SHALL display pagination with 20 entries per page

---

### Requisito 8: Centros Médicos

**User Story:** Como administrador, quiero ver un listado de centros médicos registrados, para que pueda gestionar las ubicaciones donde operan los médicos.

#### Criterios de Aceptación

1. WHEN an admin views the medical centers list THEN the system SHALL display all centers with name, address, phone, and status
2. WHEN an admin searches for a center THEN the system SHALL return centers matching the search term in name or address
3. WHEN an admin clicks on a center THEN the system SHALL show center details and associated doctors
4. WHEN the centers list loads THEN the system SHALL display pagination with 10 centers per page
5. WHEN an admin views a center THEN the system SHALL display the number of doctors and prescriptions associated

---

### Requisito 9: Farmacias Registradas

**User Story:** Como administrador, quiero ver un listado de farmacias registradas en el sistema, para que pueda gestionar las ubicaciones de dispensación.

#### Criterios de Aceptación

1. WHEN an admin views the pharmacy list THEN the system SHALL display all pharmacies with name, address, phone, and status
2. WHEN an admin searches for a pharmacy THEN the system SHALL return pharmacies matching the search term in name or address
3. WHEN an admin clicks on a pharmacy THEN the system SHALL show pharmacy details and dispensation statistics
4. WHEN the pharmacy list loads THEN the system SHALL display pagination with 10 pharmacies per page
5. WHEN an admin views a pharmacy THEN the system SHALL display the number of dispensations and inventory status

---

### Requisito 10: Creación de Tablas de Talonarios

**User Story:** Como arquitecto de BD, quiero crear tablas para gestionar talonarios con tipos y cantidades configurables, para que el sistema pueda controlar la emisión de recetas según el tipo de medicamento.

#### Criterios de Aceptación

1. WHEN creating the PRESCRIPTION_PAD_TYPES table THEN the system SHALL include types: Libre/Normal, Antimicrobianos, Psicotrópicos, Estupefacientes with configurable default quantities (default: 50)
2. WHEN creating the PRESCRIPTION_PADS table THEN the system SHALL include columns: PRESCRIPTION_PAD_ID, DOCTOR_ID, PAD_TYPE_ID, PAD_NUMBER, AVAILABLE_COUNT, TOTAL_COUNT, EXPIRATION_DATE, IS_ACTIVE, CREATED_AT, UPDATED_AT
3. WHEN creating PRESCRIPTION_PADS THEN the system SHALL add foreign key constraints to DOCTORS(DOCTOR_ID) and PRESCRIPTION_PAD_TYPES(PAD_TYPE_ID)
4. WHEN creating PRESCRIPTION_PADS THEN the system SHALL add a unique constraint on (DOCTOR_ID, PAD_TYPE_ID, PAD_NUMBER)
5. WHEN a doctor attempts to create a prescription THEN the system SHALL validate that the doctor has available pads of the required type and SHALL prevent creation if insufficient pads exist
6. WHEN a prescription is issued THEN the system SHALL decrement AVAILABLE_COUNT on the associated PRESCRIPTION_PAD

---

### Requisito 11: Relación entre Medicamentos y Tipos de Talonarios

**User Story:** Como farmacólogo, quiero que cada medicamento esté asociado con el tipo de talonario requerido, para que el sistema valide automáticamente que se use el talonario correcto.

#### Criterios de Aceptación

1. WHEN updating the MEDICATIONS table THEN the system SHALL add a column PAD_TYPE_ID to link each medication to its required prescription pad type
2. WHEN a doctor prescribes a medication THEN the system SHALL validate that the selected prescription pad type matches the medication's required pad type
3. WHEN a doctor attempts to prescribe a medication requiring a specific pad type THEN the system SHALL prevent the action if the doctor lacks available pads of that type
4. WHEN displaying available medications THEN the system SHALL filter medications based on the doctor's available pad types
5. WHEN a medication requires a specific pad type THEN the system SHALL display this requirement in the medication details

---

### Requisito 12: Consistencia con Estructura de Base de Datos

**User Story:** Como arquitecto de software, quiero que todos los endpoints respeten la estructura de la base de datos Oracle, para que el sistema sea mantenible y evite errores de mapeo.

#### Criterios de Aceptación

1. WHEN creating any endpoint THEN the system SHALL validate all field names against the actual database schema using direct SQL queries
2. WHEN mapping database columns to DTOs THEN the system SHALL use exact column names from the database (case-sensitive)
3. WHEN creating relationships between entities THEN the system SHALL verify foreign keys exist in the database
4. WHEN using EF Core THEN the system SHALL validate that shadow properties match database constraints
5. WHEN encountering EF Core issues THEN the system SHALL fall back to raw SQL queries to ensure data integrity

---

## Notas Técnicas

- Todas las vistas deben conectarse a endpoints REST del backend
- Las vistas deben usar datos reales de la base de datos Oracle
- Se debe implementar paginación en todas las listas
- Se debe implementar búsqueda y filtros en todas las listas
- Se debe mantener consistencia visual entre Angular y React
- Se debe implementar manejo de errores y validaciones en cliente y servidor
- Se requiere un diagrama de arquitectura completo del sistema que incluya:
  - Flujo de talonarios (creación, validación, decremento)
  - Relaciones entre medicamentos y tipos de talonarios
  - Flujo de emisión de recetas
  - Integración con IA Assistant
  - Flujo de dispensación

## Referencias de Base de Datos

**Ubicación del esquema:** `eprescription-Database/DATABASE-SCHEMA-REFERENCE.md`

**Tablas principales:**
- PRESCRIPTIONS (id, prescription_number, patient_id, doctor_id, status, created_at, etc.)
- PRESCRIPTION_PADS (id, doctor_id, pad_number, available_count, expiration_date, etc.)
- PATIENTS (id, name, id_number, age, gender, etc.)
- DOCTORS (id, name, license_number, specialty_id, etc.)
- MEDICATIONS (id, name, active_ingredient, etc.)
- PHARMACIES (id, name, address, phone, etc.)
- AUDIT_LOGS (id, user_id, action, resource_type, timestamp, etc.)

**Validaciones críticas:**
- Todos los IDs son GUID (RAW(16) en Oracle)
- Las fechas se almacenan en UTC
- Los estados de receta son: draft, issued, dispensed, cancelled, expired
- Los talonarios tienen validación de cantidad disponible y fecha de vencimiento
