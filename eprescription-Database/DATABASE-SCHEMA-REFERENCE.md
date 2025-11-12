# Database Schema Reference - FUENTE DE VERDAD

**Fecha:** 2024-11-12 | **BD:** Oracle 21c XE | **Esquema:** EPRESCRIPTION_USER

Este documento es la **FUENTE DE VERDAD** extraída directamente de Oracle. Todos los scripts de datos mock deben seguir esta estructura exacta.

---

## 🎯 REGLAS CRÍTICAS PARA SCRIPTS DE MOCK DATA

1. **Usar nombres de columnas EXACTOS** como aparecen aquí
2. **Respetar tipos de datos** (RAW(16) para IDs, VARCHAR2, NUMBER, etc.)
3. **Seguir orden de dependencias** (tablas sin FK primero)
4. **Generar IDs con SYS_GUID()** para columnas RAW(16)
5. **Registrar en AUDIT_LOGS** las operaciones críticas
6. **País por defecto:** 'Costa Rica' (no Ecuador)

---

## 📊 TABLAS BASE (Sin Foreign Keys)

### CIE10_CATALOG
Catálogo de diagnósticos CIE-10 (OMS/WHO)

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| CIE10_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| CODE | VARCHAR2(10) | NO | - | Código CIE-10 (ej: J00) |
| DESCRIPTION_ES | VARCHAR2(500) | NO | - | Descripción en español |
| DESCRIPTION_EN | VARCHAR2(500) | YES | - | Descripción en inglés |
| CATEGORY | VARCHAR2(100) | YES | - | Categoría del diagnóstico |
| CHAPTER | VARCHAR2(200) | YES | - | Capítulo CIE-10 |
| IS_ACTIVE | NUMBER(1,0) | YES | 1 | Activo (1) o inactivo (0) |
| SOURCE | VARCHAR2(20) | YES | 'MANUAL' | Origen: MANUAL o WHO_API |
| LAST_UPDATED | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Última actualización |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |

**Índices:** UNIQUE(CODE)

---

### ADDRESSES
Direcciones físicas compartidas por múltiples entidades

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| ADDRESS_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| STREET_ADDRESS | VARCHAR2(200) | NO | - | Dirección completa |
| CITY | VARCHAR2(100) | NO | - | Ciudad o cantón |
| STATE_PROVINCE | VARCHAR2(100) | NO | - | Provincia o estado |
| POSTAL_CODE | VARCHAR2(20) | YES | - | Código postal |
| COUNTRY | VARCHAR2(100) | NO | 'Costa Rica' | País |
| LATITUDE | NUMBER(10,7) | YES | - | Latitud GPS |
| LONGITUDE | NUMBER(10,7) | YES | - | Longitud GPS |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |
| UPDATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Última actualización |

**⚠️ IMPORTANTE:** Usar `STREET_ADDRESS` y `STATE_PROVINCE` (NO `street` ni `state`)


### SPECIALTIES
Especialidades médicas

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| SPECIALTY_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| SPECIALTY_CODE | VARCHAR2(20) | NO | - | Código de especialidad |
| SPECIALTY_NAME | VARCHAR2(200) | NO | - | Nombre de la especialidad |
| DESCRIPTION | VARCHAR2(500) | YES | - | Descripción |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |

**Índices:** UNIQUE(SPECIALTY_CODE)

---

### ADMINISTRATION_ROUTES
Rutas de administración de medicamentos

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| ROUTE_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| ROUTE_CODE | VARCHAR2(20) | NO | - | Código de ruta (ej: ORAL, IV) |
| ROUTE_NAME | VARCHAR2(100) | NO | - | Nombre de la ruta |
| DESCRIPTION | VARCHAR2(500) | YES | - | Descripción |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |

**Índices:** UNIQUE(ROUTE_CODE)

---

## 👥 TABLAS DE ENTIDADES PRINCIPALES

### PATIENTS
Pacientes del sistema

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| PATIENT_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| IDENTIFICATION_NUMBER | VARCHAR2(50) | NO | - | Cédula o identificación |
| FIRST_NAME | VARCHAR2(100) | NO | - | Nombre |
| LAST_NAME | VARCHAR2(100) | NO | - | Apellidos |
| DATE_OF_BIRTH | DATE | NO | - | Fecha de nacimiento |
| GENDER | VARCHAR2(10) | NO | - | Género (M/F/Otro) |
| BLOOD_TYPE | VARCHAR2(5) | YES | - | Tipo de sangre |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |
| UPDATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Última actualización |

**Índices:** UNIQUE(IDENTIFICATION_NUMBER)

---

### PATIENT_CONTACTS
Contactos de pacientes (4NF - normalización)

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| CONTACT_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| PATIENT_ID | RAW(16) | NO | - | FK a PATIENTS |
| CONTACT_TYPE | VARCHAR2(20) | NO | - | Tipo: email, phone, address |
| CONTACT_VALUE | VARCHAR2(500) | NO | - | Valor del contacto |
| IS_PRIMARY | NUMBER(1,0) | YES | 0 | Contacto principal (1/0) |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |

**FK:** PATIENT_ID → PATIENTS(PATIENT_ID)


### PATIENT_ALLERGIES
Alergias de pacientes (4NF - normalización)

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| ALLERGY_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| PATIENT_ID | RAW(16) | NO | - | FK a PATIENTS |
| ALLERGEN_TYPE | VARCHAR2(50) | NO | - | Tipo de alérgeno |
| ALLERGEN_NAME | VARCHAR2(200) | NO | - | Nombre del alérgeno |
| SEVERITY | VARCHAR2(20) | NO | - | Severidad (mild/moderate/severe) |
| NOTES | CLOB | YES | - | Notas adicionales |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |

**FK:** PATIENT_ID → PATIENTS(PATIENT_ID)

---

### DOCTORS
Médicos del sistema

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| DOCTOR_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| IDENTIFICATION_NUMBER | VARCHAR2(50) | NO | - | Cédula o identificación |
| FIRST_NAME | VARCHAR2(100) | NO | - | Nombre |
| LAST_NAME | VARCHAR2(100) | NO | - | Apellidos |
| SPECIALTY_ID | RAW(16) | NO | - | FK a SPECIALTIES |
| LICENSE_NUMBER | VARCHAR2(50) | NO | - | Número de licencia médica |
| EMAIL | VARCHAR2(200) | YES | - | Email |
| PHONE | VARCHAR2(20) | YES | - | Teléfono |
| IS_ACTIVE | NUMBER(1,0) | YES | 1 | Activo (1) o inactivo (0) |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |
| UPDATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Última actualización |

**Índices:** UNIQUE(IDENTIFICATION_NUMBER), UNIQUE(LICENSE_NUMBER)  
**FK:** SPECIALTY_ID → SPECIALTIES(SPECIALTY_ID)

---

### MEDICAL_CENTERS
Centros médicos

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| CENTER_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| CENTER_NAME | VARCHAR2(200) | NO | - | Nombre del centro |
| CENTER_TYPE | VARCHAR2(50) | NO | - | Tipo (hospital/clinic/etc) |
| ADDRESS_ID | RAW(16) | YES | - | FK a ADDRESSES |
| PHONE | VARCHAR2(20) | YES | - | Teléfono |
| EMAIL | VARCHAR2(200) | YES | - | Email |
| IS_ACTIVE | NUMBER(1,0) | YES | 1 | Activo (1) o inactivo (0) |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |
| UPDATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Última actualización |

**FK:** ADDRESS_ID → ADDRESSES(ADDRESS_ID)

---

### MEDICATIONS
Medicamentos

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| MEDICATION_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| MEDICATION_CODE | VARCHAR2(50) | NO | - | Código del medicamento |
| COMMERCIAL_NAME | VARCHAR2(200) | NO | - | Nombre comercial |
| GENERIC_NAME | VARCHAR2(200) | NO | - | Nombre genérico |
| ACTIVE_INGREDIENT | VARCHAR2(200) | YES | - | Principio activo |
| PRESENTATION | VARCHAR2(100) | YES | - | Presentación |
| CONCENTRATION | VARCHAR2(100) | YES | - | Concentración |
| REQUIRES_PRESCRIPTION | NUMBER(1,0) | YES | 1 | Requiere receta (1/0) |
| IS_ACTIVE | NUMBER(1,0) | YES | 1 | Activo (1) o inactivo (0) |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |
| UPDATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Última actualización |
| ADMINISTRATION_ROUTE_ID | RAW(16) | YES | - | FK a ADMINISTRATION_ROUTES |

**Índices:** UNIQUE(MEDICATION_CODE)  
**FK:** ADMINISTRATION_ROUTE_ID → ADMINISTRATION_ROUTES(ROUTE_ID)


### PHARMACIES
Farmacias

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| PHARMACY_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| PHARMACY_NAME | VARCHAR2(200) | NO | - | Nombre de la farmacia |
| LICENSE_NUMBER | VARCHAR2(50) | NO | - | Número de licencia |
| ADDRESS_ID | RAW(16) | YES | - | FK a ADDRESSES |
| PHONE | VARCHAR2(20) | YES | - | Teléfono |
| EMAIL | VARCHAR2(200) | YES | - | Email |
| IS_ACTIVE | NUMBER(1,0) | YES | 1 | Activo (1) o inactivo (0) |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |
| UPDATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Última actualización |
| CITY | VARCHAR2(100) | YES | - | Ciudad (denormalizado) |

**Índices:** UNIQUE(LICENSE_NUMBER)  
**FK:** ADDRESS_ID → ADDRESSES(ADDRESS_ID)

---

## 🔗 TABLAS DE RELACIONES (5NF)

### DOCTOR_MEDICAL_CENTERS
Asignaciones de médicos a centros médicos (5NF - relación temporal)

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| ASSIGNMENT_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| DOCTOR_ID | RAW(16) | NO | - | FK a DOCTORS |
| MEDICAL_CENTER_ID | RAW(16) | NO | - | FK a MEDICAL_CENTERS |
| START_DATE | DATE | NO | - | Fecha de inicio |
| END_DATE | DATE | YES | - | Fecha de fin |
| IS_ACTIVE | NUMBER(1,0) | YES | 1 | Activo (1) o inactivo (0) |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |

**FK:** DOCTOR_ID → DOCTORS(DOCTOR_ID), MEDICAL_CENTER_ID → MEDICAL_CENTERS(CENTER_ID)

---

### PRESCRIPTIONS
Prescripciones médicas

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| PRESCRIPTION_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| PRESCRIPTION_NUMBER | VARCHAR2(50) | NO | - | Número de prescripción |
| PATIENT_ID | RAW(16) | NO | - | FK a PATIENTS |
| DOCTOR_ID | RAW(16) | NO | - | FK a DOCTORS |
| MEDICAL_CENTER_ID | RAW(16) | NO | - | FK a MEDICAL_CENTERS |
| PRESCRIPTION_DATE | TIMESTAMP(6) | NO | - | Fecha de prescripción |
| EXPIRATION_DATE | TIMESTAMP(6) | NO | - | Fecha de expiración |
| STATUS | VARCHAR2(20) | NO | 'draft' | Estado (draft/active/dispensed/expired/cancelled) |
| NOTES | CLOB | YES | - | Notas adicionales |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |
| UPDATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Última actualización |

**Índices:** UNIQUE(PRESCRIPTION_NUMBER)  
**FK:** PATIENT_ID → PATIENTS, DOCTOR_ID → DOCTORS, MEDICAL_CENTER_ID → MEDICAL_CENTERS

---

### PRESCRIPTION_DIAGNOSES
Diagnósticos por prescripción (4NF)

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| DIAGNOSIS_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| PRESCRIPTION_ID | RAW(16) | NO | - | FK a PRESCRIPTIONS |
| CIE10_CODE | VARCHAR2(10) | NO | - | Código CIE-10 |
| IS_PRIMARY | NUMBER(1,0) | YES | 0 | Diagnóstico principal (1/0) |
| NOTES | VARCHAR2(1000) | YES | - | Notas adicionales |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |

**FK:** PRESCRIPTION_ID → PRESCRIPTIONS(PRESCRIPTION_ID)  
**⚠️ IMPORTANTE:** CIE10_CODE debe existir en CIE10_CATALOG.CODE


### PRESCRIPTION_MEDICATIONS
Medicamentos por prescripción (4NF)

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| PRESCRIPTION_MEDICATION_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| PRESCRIPTION_ID | RAW(16) | NO | - | FK a PRESCRIPTIONS |
| MEDICATION_ID | RAW(16) | NO | - | FK a MEDICATIONS |
| DOSAGE | VARCHAR2(100) | NO | - | Dosificación |
| FREQUENCY | VARCHAR2(100) | NO | - | Frecuencia |
| DURATION_DAYS | NUMBER(5,0) | NO | - | Duración en días |
| ADMINISTRATION_ROUTE_ID | RAW(16) | NO | - | FK a ADMINISTRATION_ROUTES |
| QUANTITY | NUMBER(10,2) | NO | - | Cantidad |
| INSTRUCTIONS | CLOB | YES | - | Instrucciones |
| AI_SUGGESTED | NUMBER(1,0) | YES | 0 | Sugerido por IA (1/0) |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |

**FK:** PRESCRIPTION_ID → PRESCRIPTIONS, MEDICATION_ID → MEDICATIONS, ADMINISTRATION_ROUTE_ID → ADMINISTRATION_ROUTES

---

### DRUG_INTERACTIONS
Interacciones medicamentosas (5NF)

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| INTERACTION_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| MEDICATION_ID_1 | RAW(16) | NO | - | FK a MEDICATIONS |
| MEDICATION_ID_2 | RAW(16) | NO | - | FK a MEDICATIONS |
| INTERACTION_SEVERITY | VARCHAR2(20) | NO | - | Severidad (mild/moderate/severe) |
| INTERACTION_DESCRIPTION | CLOB | NO | - | Descripción de la interacción |
| CLINICAL_EFFECTS | CLOB | YES | - | Efectos clínicos |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |

**FK:** MEDICATION_ID_1 → MEDICATIONS, MEDICATION_ID_2 → MEDICATIONS  
**⚠️ CHECK:** MEDICATION_ID_1 < MEDICATION_ID_2 (evita duplicados)

---

### INVENTORY
Inventario de farmacias

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| INVENTORY_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| PHARMACY_ID | RAW(16) | NO | - | FK a PHARMACIES |
| MEDICATION_ID | RAW(16) | NO | - | FK a MEDICATIONS |
| BATCH_NUMBER | VARCHAR2(50) | NO | - | Número de lote |
| QUANTITY_AVAILABLE | NUMBER(10,2) | NO | - | Cantidad disponible |
| EXPIRATION_DATE | DATE | NO | - | Fecha de vencimiento |
| UNIT_COST | NUMBER(10,2) | YES | - | Costo unitario |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |
| UPDATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Última actualización |

**Índices:** UNIQUE(PHARMACY_ID, MEDICATION_ID, BATCH_NUMBER)  
**FK:** PHARMACY_ID → PHARMACIES, MEDICATION_ID → MEDICATIONS

---

### DISPENSATIONS
Dispensaciones de medicamentos

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| DISPENSATION_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| PRESCRIPTION_ID | RAW(16) | NO | - | FK a PRESCRIPTIONS |
| PHARMACY_ID | RAW(16) | NO | - | FK a PHARMACIES |
| PHARMACIST_ID | RAW(16) | YES | - | FK a USERS (farmacéutico) |
| DISPENSATION_DATE | TIMESTAMP(6) | NO | - | Fecha de dispensación |
| STATUS | VARCHAR2(20) | NO | 'pending' | Estado (pending/verified/completed/rejected) |
| NOTES | CLOB | YES | - | Notas adicionales |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |
| UPDATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Última actualización |

**FK:** PRESCRIPTION_ID → PRESCRIPTIONS, PHARMACY_ID → PHARMACIES, PHARMACIST_ID → USERS


### DISPENSATION_ITEMS
Items dispensados (4NF)

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| DISPENSATION_ITEM_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| DISPENSATION_ID | RAW(16) | NO | - | FK a DISPENSATIONS |
| PRESCRIPTION_MEDICATION_ID | RAW(16) | NO | - | FK a PRESCRIPTION_MEDICATIONS |
| INVENTORY_ID | RAW(16) | NO | - | FK a INVENTORY |
| QUANTITY_DISPENSED | NUMBER(10,2) | NO | - | Cantidad dispensada |
| BATCH_NUMBER | VARCHAR2(50) | YES | - | Número de lote |
| EXPIRATION_DATE | DATE | YES | - | Fecha de vencimiento |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |

**FK:** DISPENSATION_ID → DISPENSATIONS, PRESCRIPTION_MEDICATION_ID → PRESCRIPTION_MEDICATIONS, INVENTORY_ID → INVENTORY

---

## 🔐 TABLAS DE SEGURIDAD

### USERS
Usuarios del sistema

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| USER_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| USERNAME | VARCHAR2(100) | NO | - | Nombre de usuario |
| EMAIL | VARCHAR2(200) | NO | - | Email |
| KEYCLOAK_USER_ID | VARCHAR2(100) | YES | - | ID de usuario en Keycloak |
| IS_ACTIVE | NUMBER(1,0) | YES | 1 | Activo (1) o inactivo (0) |
| LAST_LOGIN | TIMESTAMP(6) | YES | - | Último login |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |
| UPDATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Última actualización |

**Índices:** UNIQUE(USERNAME), UNIQUE(EMAIL), UNIQUE(KEYCLOAK_USER_ID)

---

### ROLES
Roles de usuario

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| ROLE_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| ROLE_NAME | VARCHAR2(100) | NO | - | Nombre del rol |
| DESCRIPTION | VARCHAR2(500) | YES | - | Descripción |
| KEYCLOAK_ROLE_ID | VARCHAR2(100) | YES | - | ID del rol en Keycloak |
| IS_ACTIVE | NUMBER(1,0) | YES | 1 | Activo (1) o inactivo (0) |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |

**Índices:** UNIQUE(ROLE_NAME)

---

### PERMISSIONS
Permisos del sistema

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| PERMISSION_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| PERMISSION_NAME | VARCHAR2(100) | NO | - | Nombre del permiso |
| RESOURCE_NAME | VARCHAR2(100) | NO | - | Recurso (ej: prescriptions) |
| ACTION | VARCHAR2(50) | NO | - | Acción (create/read/update/delete) |
| DESCRIPTION | VARCHAR2(500) | YES | - | Descripción |
| CREATED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de creación |

**Índices:** UNIQUE(PERMISSION_NAME)

---

### USER_ROLES
Asignación de roles a usuarios (5NF)

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| USER_ROLE_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| USER_ID | RAW(16) | NO | - | FK a USERS |
| ROLE_ID | RAW(16) | NO | - | FK a ROLES |
| ASSIGNED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de asignación |
| ASSIGNED_BY | RAW(16) | YES | - | FK a USERS (quien asignó) |

**Índices:** UNIQUE(USER_ID, ROLE_ID)  
**FK:** USER_ID → USERS, ROLE_ID → ROLES, ASSIGNED_BY → USERS


### ROLE_PERMISSIONS
Asignación de permisos a roles (5NF)

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| ROLE_PERMISSION_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| ROLE_ID | RAW(16) | NO | - | FK a ROLES |
| PERMISSION_ID | RAW(16) | NO | - | FK a PERMISSIONS |
| GRANTED_AT | TIMESTAMP(6) | YES | CURRENT_TIMESTAMP | Fecha de concesión |

**Índices:** UNIQUE(ROLE_ID, PERMISSION_ID)  
**FK:** ROLE_ID → ROLES, PERMISSION_ID → PERMISSIONS

---

## 📝 TABLAS DE AUDITORÍA (INMUTABLES)

### AUDIT_LOGS
Logs de auditoría del sistema (FDA 21 CFR Part 11 compliance)

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| AUDIT_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| TIMESTAMP | TIMESTAMP(6) | NO | CURRENT_TIMESTAMP | Timestamp del evento |
| USER_ID | RAW(16) | YES | - | FK a USERS |
| USERNAME | VARCHAR2(100) | YES | - | Nombre de usuario (denormalizado) |
| IP_ADDRESS | VARCHAR2(50) | YES | - | Dirección IP |
| ACTION_TYPE | VARCHAR2(100) | NO | - | Tipo de acción |
| ENTITY_TYPE | VARCHAR2(100) | NO | - | Tipo de entidad afectada |
| ENTITY_ID | VARCHAR2(100) | YES | - | ID de la entidad |
| BEFORE_VALUE | CLOB | YES | - | Valor antes (JSON) |
| AFTER_VALUE | CLOB | YES | - | Valor después (JSON) |
| METADATA | CLOB | YES | - | Metadata adicional (JSON) |
| SESSION_ID | VARCHAR2(100) | YES | - | ID de sesión |
| CREATED_AT | TIMESTAMP(6) | NO | CURRENT_TIMESTAMP | Fecha de creación |

**⚠️ INMUTABLE:** Trigger previene UPDATE y DELETE  
**FK:** USER_ID → USERS

**Acciones críticas que DEBEN auditarse:**
- CREATE_PRESCRIPTION
- UPDATE_PRESCRIPTION
- DELETE_PRESCRIPTION
- DISPENSE_MEDICATION
- CREATE_PATIENT
- UPDATE_PATIENT
- LOGIN
- LOGOUT
- AI_ANALYSIS

---

### AI_ANALYSIS_LOGS
Logs de análisis de IA

| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| ANALYSIS_ID | RAW(16) | NO | SYS_GUID() | PK - ID único |
| TIMESTAMP | TIMESTAMP(6) | NO | CURRENT_TIMESTAMP | Timestamp del análisis |
| USER_ID | RAW(16) | YES | - | FK a USERS |
| PRESCRIPTION_ID | RAW(16) | YES | - | FK a PRESCRIPTIONS |
| ANALYSIS_TYPE | VARCHAR2(50) | NO | - | Tipo (diagnosis/medication/interaction) |
| INPUT_DATA | CLOB | NO | - | Datos de entrada (JSON) |
| OUTPUT_DATA | CLOB | NO | - | Datos de salida (JSON) |
| AI_PROVIDER | VARCHAR2(100) | YES | - | Proveedor de IA (HuggingFace/OpenAI) |
| PROCESSING_TIME_MS | NUMBER(10,0) | YES | - | Tiempo de procesamiento |
| CONFIDENCE_SCORE | NUMBER(5,4) | YES | - | Score de confianza (0-1) |
| WAS_ACCEPTED | NUMBER(1,0) | YES | 0 | Sugerencia aceptada (1/0) |
| CREATED_AT | TIMESTAMP(6) | NO | CURRENT_TIMESTAMP | Fecha de creación |

**FK:** USER_ID → USERS, PRESCRIPTION_ID → PRESCRIPTIONS

---

## 📊 ORDEN DE DEPENDENCIAS PARA SCRIPTS DE MOCK DATA

**Nivel 1 - Sin dependencias:**
1. CIE10_CATALOG
2. ADDRESSES
3. SPECIALTIES
4. ADMINISTRATION_ROUTES
5. ROLES
6. PERMISSIONS

**Nivel 2 - Dependen de Nivel 1:**
7. PATIENTS
8. DOCTORS (→ SPECIALTIES)
9. MEDICAL_CENTERS (→ ADDRESSES)
10. MEDICATIONS (→ ADMINISTRATION_ROUTES)
11. PHARMACIES (→ ADDRESSES)
12. USERS
13. ROLE_PERMISSIONS (→ ROLES, PERMISSIONS)

**Nivel 3 - Dependen de Nivel 2:**
14. PATIENT_CONTACTS (→ PATIENTS)
15. PATIENT_ALLERGIES (→ PATIENTS)
16. DOCTOR_MEDICAL_CENTERS (→ DOCTORS, MEDICAL_CENTERS)
17. DRUG_INTERACTIONS (→ MEDICATIONS)
18. INVENTORY (→ PHARMACIES, MEDICATIONS)
19. USER_ROLES (→ USERS, ROLES)

**Nivel 4 - Dependen de Nivel 3:**
20. PRESCRIPTIONS (→ PATIENTS, DOCTORS, MEDICAL_CENTERS)

**Nivel 5 - Dependen de Nivel 4:**
21. PRESCRIPTION_DIAGNOSES (→ PRESCRIPTIONS, CIE10_CATALOG)
22. PRESCRIPTION_MEDICATIONS (→ PRESCRIPTIONS, MEDICATIONS, ADMINISTRATION_ROUTES)
23. DISPENSATIONS (→ PRESCRIPTIONS, PHARMACIES, USERS)

**Nivel 6 - Dependen de Nivel 5:**
24. DISPENSATION_ITEMS (→ DISPENSATIONS, PRESCRIPTION_MEDICATIONS, INVENTORY)

**Nivel 7 - Logs (pueden insertarse en cualquier momento):**
25. AUDIT_LOGS (→ USERS)
26. AI_ANALYSIS_LOGS (→ USERS, PRESCRIPTIONS)

---

## ✅ CHECKLIST DE VALIDACIÓN PARA SCRIPTS DE MOCK DATA

- [ ] Usar nombres de columnas EXACTOS de este documento
- [ ] Generar IDs con SYS_GUID() para columnas RAW(16)
- [ ] Respetar tipos de datos (VARCHAR2, NUMBER, DATE, TIMESTAMP, CLOB)
- [ ] Seguir orden de dependencias (Nivel 1 → Nivel 7)
- [ ] Validar que todos los FK existan antes de insertar
- [ ] Usar 'Costa Rica' como país por defecto
- [ ] Insertar en AUDIT_LOGS para operaciones críticas
- [ ] Verificar que CIE10_CODE exista en CIE10_CATALOG
- [ ] Usar STATUS válidos según tabla
- [ ] Incluir CREATED_AT y UPDATED_AT donde aplique

---

**Documento generado:** 2024-11-12  
**Última actualización:** 2024-11-12  
**Versión:** 1.0
