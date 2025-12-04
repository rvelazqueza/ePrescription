# Modelo Entidad-Relación (ERD) - ePrescription System

## Diagrama Simplificado por Módulos

Este documento presenta el modelo de datos organizado por módulos funcionales para mejor comprensión.

---

## 1. Módulo de Seguridad y Usuarios

```mermaid
erDiagram
    USERS {
        guid Id PK
        string Username
        string Email
        string KeycloakId
        datetime CreatedAt
        datetime UpdatedAt
    }
    
    ROLES {
        guid Id PK
        string Name
        string Description
    }
    
    PERMISSIONS {
        guid Id PK
        string Name
        string Resource
        string Action
    }
    
    USER_ROLES {
        guid UserId FK
        guid RoleId FK
    }
    
    ROLE_PERMISSIONS {
        guid RoleId FK
        guid PermissionId FK
    }
    
    USERS ||--o{ USER_ROLES : "tiene"
    ROLES ||--o{ USER_ROLES : "asignado"
    ROLES ||--o{ ROLE_PERMISSIONS : "posee"
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : "otorgado"
```


## 2. Módulo de Entidades Médicas

```mermaid
erDiagram
    USERS {
        guid Id PK
        string Username
        string Email
        string KeycloakId
        guid AddressId FK
    }
    
    ADDRESSES {
        guid Id PK
        string Street
        string City
        string State
        string PostalCode
        string Country
    }
    
    PATIENTS {
        guid Id PK
        guid UserId FK
        string FirstName
        string LastName
        string IdentificationNumber
        date DateOfBirth
        string Gender
        string BloodType
    }
    
    PATIENT_CONTACTS {
        guid Id PK
        guid PatientId FK
        string ContactType
        string ContactValue
    }
    
    PATIENT_ALLERGIES {
        guid Id PK
        guid PatientId FK
        string AllergyType
        string Description
        string Severity
    }
    
    DOCTORS {
        guid Id PK
        guid UserId FK
        string FirstName
        string LastName
        string MedicalLicense
        guid SpecialtyId FK
    }
    
    SPECIALTIES {
        guid Id PK
        string Name
        string Description
    }
    
    MEDICAL_CENTERS {
        guid Id PK
        string CenterName
        guid AddressId FK
        string Phone
        string Email
    }
    
    DOCTOR_MEDICAL_CENTERS {
        guid DoctorId FK
        guid MedicalCenterId FK
    }
    
    PHARMACISTS {
        guid Id PK
        guid UserId FK
        guid PharmacyId FK
        string LicenseNumber
    }
    
    USERS ||--o| ADDRESSES : "vive en"
    USERS ||--o| PATIENTS : "es"
    USERS ||--o| DOCTORS : "es"
    USERS ||--o| PHARMACISTS : "es"
    PATIENTS ||--o{ PATIENT_CONTACTS : "tiene"
    PATIENTS ||--o{ PATIENT_ALLERGIES : "tiene"
    SPECIALTIES ||--o{ DOCTORS : "especializa"
    DOCTORS ||--o{ DOCTOR_MEDICAL_CENTERS : "trabaja en"
    MEDICAL_CENTERS ||--o{ DOCTOR_MEDICAL_CENTERS : "emplea"
    MEDICAL_CENTERS ||--o| ADDRESSES : "ubicado en"
```


## 3. Módulo de Prescripciones

```mermaid
erDiagram
    PRESCRIPTIONS {
        guid Id PK
        guid PatientId FK
        guid DoctorId FK
        string Status
        datetime PrescriptionDate
        datetime ExpirationDate
        string Notes
    }
    
    PRESCRIPTION_DIAGNOSES {
        guid Id PK
        guid PrescriptionId FK
        guid CIE10Id FK
        string ClinicalNotes
        bool IsPrimary
    }
    
    PRESCRIPTION_MEDICATIONS {
        guid Id PK
        guid PrescriptionId FK
        guid MedicationId FK
        guid RouteId FK
        string Dosage
        string Frequency
        int DurationDays
        string Instructions
    }
    
    CIE10_CATALOG {
        guid Id PK
        string Code
        string Description
        string Category
        string WHOVersion
    }
    
    MEDICATIONS {
        guid Id PK
        string Name
        string ActiveIngredient
        string Presentation
        string Concentration
        string Manufacturer
    }
    
    ADMINISTRATION_ROUTES {
        guid Id PK
        string Name
        string Description
    }
    
    DRUG_INTERACTIONS {
        guid Id PK
        guid Medication1Id FK
        guid Medication2Id FK
        string Severity
        string Description
        string Recommendation
    }
    
    PATIENTS ||--o{ PRESCRIPTIONS : "recibe"
    DOCTORS ||--o{ PRESCRIPTIONS : "crea"
    PRESCRIPTIONS ||--o{ PRESCRIPTION_DIAGNOSES : "contiene"
    PRESCRIPTIONS ||--o{ PRESCRIPTION_MEDICATIONS : "incluye"
    CIE10_CATALOG ||--o{ PRESCRIPTION_DIAGNOSES : "clasifica"
    MEDICATIONS ||--o{ PRESCRIPTION_MEDICATIONS : "prescrito"
    ADMINISTRATION_ROUTES ||--o{ PRESCRIPTION_MEDICATIONS : "vía"
    MEDICATIONS ||--o{ DRUG_INTERACTIONS : "interactúa con"
    MEDICATIONS ||--o{ DRUG_INTERACTIONS : "afectado por"
```


## 4. Módulo de Farmacia y Dispensación

```mermaid
erDiagram
    PHARMACIES {
        guid Id PK
        string Name
        string LicenseNumber
        guid AddressId FK
        string Phone
        string Email
    }
    
    PHARMACISTS {
        guid Id PK
        guid UserId FK
        guid PharmacyId FK
        string LicenseNumber
    }
    
    INVENTORY {
        guid Id PK
        guid PharmacyId FK
        guid MedicationId FK
        int Quantity
        string BatchNumber
        datetime ExpirationDate
        decimal UnitPrice
    }
    
    DISPENSATIONS {
        guid Id PK
        guid PrescriptionId FK
        guid PharmacyId FK
        guid PharmacistId FK
        datetime DispensationDate
        string Status
        string Notes
    }
    
    DISPENSATION_ITEMS {
        guid Id PK
        guid DispensationId FK
        guid InventoryId FK
        int QuantityDispensed
        decimal UnitPrice
        decimal TotalPrice
    }
    
    PHARMACIES ||--o| ADDRESSES : "ubicada en"
    PHARMACIES ||--o{ PHARMACISTS : "emplea"
    PHARMACIES ||--o{ INVENTORY : "gestiona"
    MEDICATIONS ||--o{ INVENTORY : "almacenado"
    PHARMACIES ||--o{ DISPENSATIONS : "realiza"
    PHARMACISTS ||--o{ DISPENSATIONS : "dispensa"
    PRESCRIPTIONS ||--o{ DISPENSATIONS : "cumplido por"
    DISPENSATIONS ||--o{ DISPENSATION_ITEMS : "contiene"
    INVENTORY ||--o{ DISPENSATION_ITEMS : "desde stock"
```


## 5. Módulo de Auditoría y AI

```mermaid
erDiagram
    AUDIT_LOGS {
        guid Id PK
        guid UserId FK
        string Action
        string EntityType
        string EntityId
        string Changes
        datetime Timestamp
        string IPAddress
    }
    
    AI_ANALYSIS_LOGS {
        guid Id PK
        guid UserId FK
        guid PrescriptionId FK
        string AnalysisType
        string InputData
        string OutputData
        string Model
        datetime Timestamp
        int ProcessingTimeMs
    }
    
    USERS ||--o{ AUDIT_LOGS : "realiza"
    USERS ||--o{ AI_ANALYSIS_LOGS : "solicita"
    PRESCRIPTIONS ||--o{ AI_ANALYSIS_LOGS : "analiza"
```

---

## Diagrama Completo Integrado

```mermaid
erDiagram
    %% SEGURIDAD
    USERS ||--o{ USER_ROLES : ""
    ROLES ||--o{ USER_ROLES : ""
    ROLES ||--o{ ROLE_PERMISSIONS : ""
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : ""
    
    %% COMPARTIDO
    USERS ||--o| ADDRESSES : ""
    MEDICAL_CENTERS ||--o| ADDRESSES : ""
    PHARMACIES ||--o| ADDRESSES : ""
    
    %% RELACIÓN USERS CON ROLES
    USERS ||--o| PATIENTS : ""
    USERS ||--o| DOCTORS : ""
    USERS ||--o| PHARMACISTS : ""
    
    %% ENTIDADES MÉDICAS
    PATIENTS ||--o{ PATIENT_CONTACTS : ""
    PATIENTS ||--o{ PATIENT_ALLERGIES : ""
    SPECIALTIES ||--o{ DOCTORS : ""
    DOCTORS ||--o{ DOCTOR_MEDICAL_CENTERS : ""
    MEDICAL_CENTERS ||--o{ DOCTOR_MEDICAL_CENTERS : ""
    
    %% PRESCRIPCIONES
    PATIENTS ||--o{ PRESCRIPTIONS : ""
    DOCTORS ||--o{ PRESCRIPTIONS : ""
    PRESCRIPTIONS ||--o{ PRESCRIPTION_DIAGNOSES : ""
    PRESCRIPTIONS ||--o{ PRESCRIPTION_MEDICATIONS : ""
    CIE10_CATALOG ||--o{ PRESCRIPTION_DIAGNOSES : ""
    MEDICATIONS ||--o{ PRESCRIPTION_MEDICATIONS : ""
    ADMINISTRATION_ROUTES ||--o{ PRESCRIPTION_MEDICATIONS : ""
    MEDICATIONS ||--o{ DRUG_INTERACTIONS : ""
    
    %% FARMACIA
    PHARMACIES ||--o{ PHARMACISTS : ""
    PHARMACIES ||--o{ INVENTORY : ""
    MEDICATIONS ||--o{ INVENTORY : ""
    PHARMACIES ||--o{ DISPENSATIONS : ""
    PHARMACISTS ||--o{ DISPENSATIONS : ""
    PRESCRIPTIONS ||--o{ DISPENSATIONS : ""
    DISPENSATIONS ||--o{ DISPENSATION_ITEMS : ""
    INVENTORY ||--o{ DISPENSATION_ITEMS : ""
    
    %% AUDITORÍA
    USERS ||--o{ AUDIT_LOGS : ""
    USERS ||--o{ AI_ANALYSIS_LOGS : ""
    PRESCRIPTIONS ||--o{ AI_ANALYSIS_LOGS : ""
```

---

## Resumen de Entidades

| Módulo | Entidades | Total |
|--------|-----------|-------|
| Seguridad | USERS, ROLES, PERMISSIONS, USER_ROLES, ROLE_PERMISSIONS | 5 |
| Compartido | ADDRESSES | 1 |
| Médicas | PATIENTS, PATIENT_CONTACTS, PATIENT_ALLERGIES, DOCTORS, SPECIALTIES, MEDICAL_CENTERS, DOCTOR_MEDICAL_CENTERS, PHARMACISTS | 8 |
| Prescripciones | PRESCRIPTIONS, PRESCRIPTION_DIAGNOSES, PRESCRIPTION_MEDICATIONS, CIE10_CATALOG, MEDICATIONS, ADMINISTRATION_ROUTES, DRUG_INTERACTIONS | 7 |
| Farmacia | PHARMACIES, INVENTORY, DISPENSATIONS, DISPENSATION_ITEMS | 4 |
| Auditoría | AUDIT_LOGS, AI_ANALYSIS_LOGS | 2 |
| **TOTAL** | | **27** |

### Lista Completa de Entidades

**Módulo de Seguridad (5)**:
1. USERS
2. ROLES
3. PERMISSIONS
4. USER_ROLES
5. ROLE_PERMISSIONS

**Módulo Compartido (1)**:
6. ADDRESSES

**Módulo Médico (8)**:
7. PATIENTS
8. PATIENT_CONTACTS
9. PATIENT_ALLERGIES
10. DOCTORS
11. SPECIALTIES
12. MEDICAL_CENTERS
13. DOCTOR_MEDICAL_CENTERS
14. PHARMACISTS

**Módulo de Prescripciones (7)**:
15. PRESCRIPTIONS
16. PRESCRIPTION_DIAGNOSES
17. PRESCRIPTION_MEDICATIONS
18. CIE10_CATALOG (Catálogo CIE-10)
19. MEDICATIONS
20. ADMINISTRATION_ROUTES
21. DRUG_INTERACTIONS

**Módulo de Farmacia (4)**:
22. PHARMACIES
23. INVENTORY
24. DISPENSATIONS
25. DISPENSATION_ITEMS

**Módulo de Auditoría (2)**:
26. AUDIT_LOGS
27. AI_ANALYSIS_LOGS

---

## Notas de Diseño

### Normalización
- Todas las tablas están en 4NF/5NF
- No hay redundancia de datos
- Integridad referencial garantizada con FKs

### Índices Principales
- Todos los IDs son GUIDs (Primary Keys)
- Índices en campos de búsqueda frecuente (nombres, códigos, fechas)
- Índices compuestos en tablas de relación many-to-many

### Auditoría
- Todas las entidades principales tienen auditoría automática
- AUDIT_LOGS es inmutable (trigger en BD)
- Retención de 7 años según normativas

### Catálogo CIE-10
- Sincronización diaria con WHO API
- Búsqueda por código y descripción
- Versionado según WHO



---

## ACTUALIZACIÓN IMPORTANTE: Talonarios de Prescripciones

### Entidad Faltante Crítica: PRESCRIPTION_PADS (Talonarios)

Los talonarios son fundamentales para el control regulatorio de prescripciones. Un médico NO puede emitir prescripciones sin tener talonarios asignados y disponibles.

```mermaid
erDiagram
    PRESCRIPTION_PADS {
        guid Id PK
        guid DoctorId FK
        string PadNumber
        int StartNumber
        int EndNumber
        int CurrentNumber
        datetime IssuedDate
        datetime ExpirationDate
        string Status
        string IssuingAuthority
    }
    
    PRESCRIPTIONS {
        guid Id PK
        guid PatientId FK
        guid DoctorId FK
        guid PrescriptionPadId FK
        int PrescriptionNumber
        string Status
        datetime PrescriptionDate
    }
    
    DOCTORS ||--o{ PRESCRIPTION_PADS : "tiene asignados"
    PRESCRIPTION_PADS ||--o{ PRESCRIPTIONS : "genera"
```

### Campos de PRESCRIPTION_PADS:

- **Id**: Identificador único del talonario
- **DoctorId**: Médico al que se le asignó el talonario
- **PadNumber**: Número del talonario (ej: "TAL-2024-001234")
- **StartNumber**: Número inicial del rango (ej: 1)
- **EndNumber**: Número final del rango (ej: 50)
- **CurrentNumber**: Número actual/siguiente a usar
- **IssuedDate**: Fecha de emisión del talonario
- **ExpirationDate**: Fecha de vencimiento
- **Status**: Estado (Active, Exhausted, Expired, Cancelled)
- **IssuingAuthority**: Autoridad que emitió el talonario

### Reglas de Negocio:

1. **Control de Numeración**: Cada prescripción debe tener un número único del talonario
2. **Validación Pre-Prescripción**: Antes de crear una prescripción, validar:
   - El médico tiene talonarios activos
   - El talonario no está vencido
   - Quedan números disponibles (CurrentNumber <= EndNumber)
3. **Incremento Automático**: Al crear una prescripción, incrementar CurrentNumber
4. **Estado Exhausted**: Cuando CurrentNumber > EndNumber, marcar como agotado
5. **Auditoría**: Registrar todas las asignaciones y usos de talonarios

### Impacto en PRESCRIPTIONS:

La tabla PRESCRIPTIONS debe agregar:
- **PrescriptionPadId**: FK al talonario usado
- **PrescriptionNumber**: Número específico dentro del talonario

---

## Resumen Actualizado con Talonarios

### Total de Entidades: 28 (no 27)

| Módulo | Entidades | Total |
|--------|-----------|-------|
| Seguridad | USERS, ROLES, PERMISSIONS, USER_ROLES, ROLE_PERMISSIONS | 5 |
| Compartido | ADDRESSES | 1 |
| Médicas | PATIENTS, PATIENT_CONTACTS, PATIENT_ALLERGIES, DOCTORS, SPECIALTIES, MEDICAL_CENTERS, DOCTOR_MEDICAL_CENTERS, PHARMACISTS | 8 |
| **Prescripciones** | PRESCRIPTIONS, **PRESCRIPTION_PADS**, PRESCRIPTION_DIAGNOSES, PRESCRIPTION_MEDICATIONS, CIE10_CATALOG, MEDICATIONS, ADMINISTRATION_ROUTES, DRUG_INTERACTIONS | **8** |
| Farmacia | PHARMACIES, INVENTORY, DISPENSATIONS, DISPENSATION_ITEMS | 4 |
| Auditoría | AUDIT_LOGS, AI_ANALYSIS_LOGS | 2 |
| **TOTAL** | | **28** |

### Lista Completa Actualizada:

**Módulo de Prescripciones (8)**:
15. PRESCRIPTIONS
16. **PRESCRIPTION_PADS** ← **NUEVA**
17. PRESCRIPTION_DIAGNOSES
18. PRESCRIPTION_MEDICATIONS
19. CIE10_CATALOG
20. MEDICATIONS
21. ADMINISTRATION_ROUTES
22. DRUG_INTERACTIONS

---

## Diagrama Completo Actualizado con Talonarios

```mermaid
erDiagram
    %% SEGURIDAD
    USERS ||--o{ USER_ROLES : ""
    ROLES ||--o{ USER_ROLES : ""
    ROLES ||--o{ ROLE_PERMISSIONS : ""
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : ""
    
    %% COMPARTIDO
    USERS ||--o| ADDRESSES : ""
    MEDICAL_CENTERS ||--o| ADDRESSES : ""
    PHARMACIES ||--o| ADDRESSES : ""
    
    %% RELACIÓN USERS CON ROLES
    USERS ||--o| PATIENTS : ""
    USERS ||--o| DOCTORS : ""
    USERS ||--o| PHARMACISTS : ""
    
    %% ENTIDADES MÉDICAS
    PATIENTS ||--o{ PATIENT_CONTACTS : ""
    PATIENTS ||--o{ PATIENT_ALLERGIES : ""
    SPECIALTIES ||--o{ DOCTORS : ""
    DOCTORS ||--o{ DOCTOR_MEDICAL_CENTERS : ""
    MEDICAL_CENTERS ||--o{ DOCTOR_MEDICAL_CENTERS : ""
    
    %% TALONARIOS - CRÍTICO
    DOCTORS ||--o{ PRESCRIPTION_PADS : "tiene asignados"
    
    %% PRESCRIPCIONES
    PATIENTS ||--o{ PRESCRIPTIONS : ""
    DOCTORS ||--o{ PRESCRIPTIONS : ""
    PRESCRIPTION_PADS ||--o{ PRESCRIPTIONS : "genera"
    PRESCRIPTIONS ||--o{ PRESCRIPTION_DIAGNOSES : ""
    PRESCRIPTIONS ||--o{ PRESCRIPTION_MEDICATIONS : ""
    CIE10_CATALOG ||--o{ PRESCRIPTION_DIAGNOSES : ""
    MEDICATIONS ||--o{ PRESCRIPTION_MEDICATIONS : ""
    ADMINISTRATION_ROUTES ||--o{ PRESCRIPTION_MEDICATIONS : ""
    MEDICATIONS ||--o{ DRUG_INTERACTIONS : ""
    
    %% FARMACIA
    PHARMACIES ||--o{ PHARMACISTS : ""
    PHARMACIES ||--o{ INVENTORY : ""
    MEDICATIONS ||--o{ INVENTORY : ""
    PHARMACIES ||--o{ DISPENSATIONS : ""
    PHARMACISTS ||--o{ DISPENSATIONS : ""
    PRESCRIPTIONS ||--o{ DISPENSATIONS : ""
    DISPENSATIONS ||--o{ DISPENSATION_ITEMS : ""
    INVENTORY ||--o{ DISPENSATION_ITEMS : ""
    
    %% AUDITORÍA
    USERS ||--o{ AUDIT_LOGS : ""
    USERS ||--o{ AI_ANALYSIS_LOGS : ""
    PRESCRIPTIONS ||--o{ AI_ANALYSIS_LOGS : ""
```

---

## Nota Importante para Implementación

⚠️ **CRÍTICO**: La tabla PRESCRIPTION_PADS debe implementarse ANTES de permitir la creación de prescripciones en producción. Es un requisito regulatorio para:

1. **Trazabilidad**: Cada prescripción debe tener un número único rastreable
2. **Control**: Limitar la cantidad de prescripciones que un médico puede emitir
3. **Auditoría**: Cumplimiento con normativas de salud
4. **Seguridad**: Prevenir falsificación de prescripciones

### Validación Requerida en CreatePrescriptionCommand:

```csharp
// Pseudo-código de validación
1. Verificar que el doctor tiene talonarios activos
2. Verificar que el talonario no está vencido
3. Verificar que quedan números disponibles
4. Asignar número de prescripción del talonario
5. Incrementar CurrentNumber del talonario
6. Si CurrentNumber > EndNumber, marcar talonario como Exhausted
```
