# Design Document

## Overview

Este documento describe el diseño técnico completo para la migración del sistema ePrescription a una arquitectura empresarial moderna. El sistema constará de tres componentes principales organizados en carpetas separadas:

1. **eprescription-frontend**: Aplicación Angular 18 existente
2. **eprescription-API**: Backend .NET 8 LTS con Clean Architecture
3. **eprescription-Database**: Scripts Oracle SQL y datos mock

### Key Design Decisions

1. **Clean Architecture**: Separación en 4 capas (Domain, Application, Infrastructure, API)
2. **Keycloak with Oracle**: Keycloak usa Oracle como base de datos (esquema KEYCLOAK) - centralización de datos
3. **Oracle 4NF/5NF**: Normalización avanzada para integridad de datos
4. **AI Migration**: Asistente de IA migrado de React (PorMigrar) al backend .NET
5. **Secure API Keys**: Claves de Hugging Face movidas de frontend a backend
6. **Audit-First Approach**: Sistema de auditoría implementado desde el inicio (Task 6) y usado en todas las operaciones
7. **Immutable Audit Logs**: Logs de auditoría inmutables para HIPAA/FDA compliance
8. **Full Containerization**: Docker Compose con Oracle (compartido por app y Keycloak) y Backend API

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│              Angular Frontend (Port 4200)                            │
│              eprescription-frontend/                                 │
│  - Components, Services, Guards, Interceptors                       │
│  - Español UI/UX                                                     │
└──────────────────────┬───────────────────────────────────────────────┘
                       │ HTTPS/REST + JWT (Keycloak Token)
                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│           .NET 8 Backend API (Ports 5000/5001)                      │
│              eprescription-API/                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  API Layer                                                      │ │
│  │  - Controllers (Prescriptions, AI, CIE-10, FHIR, WHO)         │ │
│  │  - Middleware (Auth, Audit, Error Handling)                    │ │
│  ├────────────────────────────────────────────────────────────────┤ │
│  │  Application Layer                                              │ │
│  │  - Use Cases, Commands, Queries (MediatR)                     │ │
│  │  - DTOs, Validators (FluentValidation)                        │ │
│  ├────────────────────────────────────────────────────────────────┤ │
│  │  Domain Layer                                                   │ │
│  │  - Entities, Value Objects, Business Rules                    │ │
│  │  - Interfaces (Repository, Services)                          │ │
│  ├────────────────────────────────────────────────────────────────┤ │
│  │  Infrastructure Layer                                           │ │
│  │  - EF Core (Oracle), Repositories                             │ │
│  │  - External Services (AI, WHO API, Translation, Keycloak)    │ │
│  │  - Audit Service, FHIR Service                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
└───────┬──────────┬──────────┬──────────┬──────────┬────────────────┘
        │          │          │          │          │
        ▼          ▼          ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│ Oracle   │ │Keycloak  │ │ Hugging  │ │ WHO API  │ │ Translation  │
│ Database │ │Port 8080 │ │ Face API │ │ (ICD-10) │ │   Service    │
│Port 1521 │ │          │ │          │ │          │ │ (Azure/GCP)  │
│          │ │(Uses     │ │          │ │          │ │              │
│Schemas:  │ │ Oracle)  │ │ Medical  │ │ Official │ │ ES ↔ EN      │
│- APP     │ └────┬─────┘ │ NLP      │ │ CIE-10   │ │ Medical      │
│- KEYCLOAK│      │       │ (English)│ │ Catalog  │ │ Terms        │
│- CIE10   │      │       │          │ │ (ES/EN)  │ │              │
│          │      │       │          │ │          │ │              │
│Tables:   │      │       └──────────┘ └──────────┘ └──────────────┘
│- Patients│      │              ▲          ▲              ▲
│- Doctors │      │              │          │              │
│- Rx      │      │              └──────────┴──────────────┘
│- CIE10   │      │                   API Calls
│- Audit   │      │              (Secured with API Keys)
└────┬─────┘      │
     │            │
     └────────────┘
      Shared DB

┌─────────────────────────────────────────────────────────────────────┐
│                    AI Analysis Flow (Español)                        │
│                                                                      │
│  1. User enters clinical description (Español)                      │
│  2. TranslationService: ES → EN                                     │
│  3. HuggingFaceAI: Analyze (English)                               │
│  4. TranslationService: EN → ES                                     │
│  5. CIE10Service: Validate codes against WHO catalog               │
│  6. AuditService: Log operation                                     │
│  7. Return results to user (Español)                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    Compliance & Standards                            │
│                                                                      │
│  ✓ HL7 FHIR R4 - Healthcare interoperability                        │
│  ✓ FDA 21 CFR Part 11 - Electronic records & signatures            │
│  ✓ OMS/WHO ICD-10 - Official diagnosis catalog                     │
│  ✓ HIPAA - Patient data privacy & security                         │
│  ✓ Audit Trail - Complete immutable logging                        │
└─────────────────────────────────────────────────────────────────────┘
```

### Project Folder Structure

```
ePrescription/
├── eprescription-frontend/          # Angular 18 application
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── ...
├── eprescription-API/               # .NET 8 Backend
│   ├── EPrescription.Domain/
│   ├── EPrescription.Application/
│   ├── EPrescription.Infrastructure/
│   ├── EPrescription.API/
│   ├── EPrescription.Tests/
│   ├── Dockerfile
│   └── EPrescription.sln
├── eprescription-Database/          # Oracle scripts
│   ├── schemas/
│   ├── mock-data/
│   ├── migrations/
│   └── docker/
├── docs/                            # Documentation
│   ├── BRANCHING_STRATEGY.md
│   ├── architecture-diagrams/
│   └── api-documentation/
├── docker-compose.yml
└── README.md
```


## Clean Architecture Layers

### 1. Domain Layer (EPrescription.Domain)

**Purpose**: Core business logic, entities, and interfaces. No dependencies on other layers.

**Components**:
- **Entities**: Patient, Doctor, Prescription, Medication, Pharmacy, Dispensation, AuditLog, AIAnalysisLog
- **Value Objects**: Address, PhoneNumber, MedicalLicense, Email, IdentificationNumber
- **Domain Events**: PrescriptionCreated, MedicationDispensed, AIAnalysisCompleted
- **Interfaces**: IRepository<T>, IUnitOfWork, IAuditService, IAIAssistantService, IAuthenticationService
- **Enums**: PrescriptionStatus, DispensationStatus, UserRole, PermissionType
- **Business Rules**: Prescription validation, drug interaction checks, expiration logic

### 2. Application Layer (EPrescription.Application)

**Purpose**: Use cases, application logic, DTOs, and validation. Orchestrates domain objects.

**Components**:
- **Commands**: CreatePrescriptionCommand, DispenseMedicationCommand, AnalyzeDiagnosisCommand
- **Queries**: GetPrescriptionQuery, SearchPatientsQuery, GetInventoryQuery
- **Command Handlers**: Implement business workflows using domain entities
- **Query Handlers**: Retrieve and transform data into DTOs
- **DTOs**: PrescriptionDto, PatientDto, DiagnosisDto, MedicationDto
- **Validators**: FluentValidation rules for all commands and DTOs
- **Mappers**: AutoMapper profiles for entity-DTO conversion
- **Interfaces**: IEmailService, INotificationService

### 3. Infrastructure Layer (EPrescription.Infrastructure)

**Purpose**: External concerns - database, external APIs, file system, etc.

**Components**:
- **Data Access**: 
  - EPrescriptionDbContext (EF Core)
  - Entity configurations (Fluent API)
  - Repositories implementation
  - Unit of Work implementation
- **External Services**:
  - KeycloakAuthenticationService (OAuth 2.0/OpenID Connect)
  - HuggingFaceAIService (migrated from PorMigrar folder)
  - EmailService (SMTP)
- **Persistence**:
  - Oracle provider configuration
  - Database migrations
  - Seed data
- **Caching**: Redis integration (optional)
- **Logging**: Serilog configuration

### 4. API Layer (EPrescription.API)

**Purpose**: HTTP endpoints, middleware, and application configuration.

**Components**:
- **Controllers**: 
  - AuthController, PrescriptionsController, PatientsController
  - DoctorsController, PharmaciesController, InventoryController
  - DispensationsController, AIAssistantController
- **Middleware**:
  - ExceptionHandlerMiddleware
  - AuthenticationMiddleware
  - AuditLoggingMiddleware
- **Filters**: AuthorizationFilter, ValidationFilter
- **Configuration**: Program.cs, appsettings.json, Startup logic
- **Swagger**: OpenAPI documentation


## Components and Interfaces

### Keycloak Authentication Service

```csharp
public interface IAuthenticationService
{
    Task<AuthenticationResult> AuthenticateAsync(string username, string password);
    Task<AuthenticationResult> RefreshTokenAsync(string refreshToken);
    Task<bool> ValidateTokenAsync(string token);
    Task<UserInfo> GetUserInfoAsync(string token);
    Task RevokeTokenAsync(string token);
    Task<List<string>> GetUserRolesAsync(string userId);
    Task<List<string>> GetUserPermissionsAsync(string userId);
}

public class AuthenticationResult
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public int ExpiresIn { get; set; }
    public string TokenType { get; set; }
    public UserInfo UserInfo { get; set; }
}

public class UserInfo
{
    public string UserId { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public List<string> Roles { get; set; }
    public List<string> Permissions { get; set; }
}
```

**Keycloak Configuration**:
- Realm: eprescription
- Client ID: eprescription-api
- Client Secret: (stored in environment variables)
- Token Endpoint: http://keycloak:8080/realms/eprescription/protocol/openid-connect/token
- UserInfo Endpoint: http://keycloak:8080/realms/eprescription/protocol/openid-connect/userinfo

### WHO API Integration Service

```csharp
public interface IWHOApiService
{
    Task<List<CIE10Entry>> FetchCIE10CatalogAsync(string language = "es");
    Task<CIE10Entry> SearchCIE10ByCodeAsync(string code, string language = "es");
    Task<List<CIE10Entry>> SearchCIE10ByTermAsync(string searchTerm, string language = "es");
    Task SyncCatalogToLocalDatabaseAsync();
}
```

**WHO API Configuration**:
- Base URL: https://icd.who.int/icdapi
- Authentication: OAuth 2.0 with client credentials
- API Key: Stored in environment variables
- Languages: Spanish (es), English (en)
- Sync Strategy: Daily sync to local CIE10_CATALOG table
- Fallback: Use local catalog if WHO API is unavailable

### CIE-10 Catalog Service

```csharp
public interface ICIE10CatalogService
{
    // Local database operations
    Task<List<CIE10Entry>> SearchByCodeAsync(string code);
    Task<List<CIE10Entry>> SearchByDescriptionAsync(string description, int maxResults = 20);
    Task<CIE10Entry> GetByIdAsync(Guid cie10Id);
    Task<CIE10Entry> GetByCodeAsync(string code);
    Task<List<CIE10Entry>> GetByCategoryAsync(string category);
    Task<bool> ValidateCodeAsync(string code);
    
    // WHO API integration
    Task<bool> SyncFromWHOApiAsync();
    Task<DateTime?> GetLastSyncDateAsync();
}

public class CIE10Entry
{
    public Guid CIE10Id { get; set; }
    public string Code { get; set; }
    public string Description { get; set; }
    public string DescriptionEnglish { get; set; }  // For WHO API compatibility
    public string Category { get; set; }
    public string Subcategory { get; set; }
    public bool IsActive { get; set; }
    public DateTime LastUpdated { get; set; }
    public string Source { get; set; }  // "WHO_API" or "MANUAL"
}
```

### Translation Service (Español ↔ Inglés)

```csharp
public interface ITranslationService
{
    Task<string> TranslateToEnglishAsync(string spanishText);
    Task<string> TranslateToSpanishAsync(string englishText);
    Task<List<TranslatedText>> TranslateBatchAsync(List<string> texts, string targetLanguage);
}

public class TranslatedText
{
    public string OriginalText { get; set; }
    public string TranslatedText { get; set; }
    public string SourceLanguage { get; set; }
    public string TargetLanguage { get; set; }
    public double ConfidenceScore { get; set; }
}
```

**Translation Service Options**:
1. **Azure Translator API** (Recommended)
   - High quality medical translations
   - Supports Spanish ↔ English
   - API Key stored in environment variables
   
2. **Google Cloud Translation API** (Alternative)
   - Good quality translations
   - Medical terminology support
   
3. **LibreTranslate** (Self-hosted option)
   - Open source
   - Can be deployed in Docker
   - Lower cost but may need fine-tuning for medical terms
```

### AI Assistant Service (Migrated from PorMigrar)

```csharp
public interface IAIAssistantService
{
    Task<DiagnosisAnalysisResult> AnalyzeClinicalDescriptionAsync(
        string clinicalDescription, 
        string patientId);
    
    Task<List<MedicationRecommendation>> GenerateMedicationRecommendationsAsync(
        List<string> diagnosisCodes, 
        string patientId);
    
    Task<DrugInteractionResult> CheckDrugInteractionsAsync(
        List<string> medicationIds);
    
    Task<ContraindicationResult> ValidateContraindicationsAsync(
        string patientId, 
        List<string> medicationIds);
}

public class DiagnosisAnalysisResult
{
    public List<DiagnosisSuggestion> Suggestions { get; set; }
    public int ProcessingTimeMs { get; set; }
    public string AIProvider { get; set; }
}

public class DiagnosisSuggestion
{
    public Guid CIE10Id { get; set; }  // Reference to CIE10_CATALOG
    public string CIE10Code { get; set; }
    public string Description { get; set; }
    public double ConfidenceScore { get; set; }
    public string Reasoning { get; set; }
}

public class MedicationRecommendation
{
    public string MedicationId { get; set; }
    public string MedicationName { get; set; }
    public string RecommendedDosage { get; set; }
    public string Frequency { get; set; }
    public double ConfidenceScore { get; set; }
    public string Reasoning { get; set; }
}
```

**AI Service Configuration** (migrated from PorMigrar):
- Hugging Face API Key: Stored in environment variables
- Model: Medical NLP model (supports English)
- Endpoint: https://api-inference.huggingface.co/models/{model-name}
- Timeout: 30 seconds
- Retry Policy: 3 attempts with exponential backoff
- CIE-10 Integration: AI suggestions validated against CIE10_CATALOG table
- Translation Flow:
  1. User enters clinical description in Spanish
  2. TranslationService translates to English
  3. Hugging Face analyzes English text
  4. Results translated back to Spanish
  5. CIE-10 codes validated against local catalog

**WHO API Integration** (CIE-10 Catalog):
- API Endpoint: https://icd.who.int/icdapi
- Authentication: OAuth 2.0 client credentials
- API Key: Stored in environment variables (WHO_API_CLIENT_ID, WHO_API_CLIENT_SECRET)
- Languages: Spanish (es) and English (en)
- Sync Strategy: Daily automatic sync at 2 AM
- Manual Sync: Available via admin endpoint
- Fallback: Local CIE10_CATALOG table if WHO API unavailable
- Cache: CIE-10 entries cached for 24 hours
- Compliance: WHO ICD-10 official source ensures OMS compliance

**Translation Service Configuration**:
- Provider: Azure Translator API (recommended) or Google Cloud Translation
- API Key: Stored in environment variables
- Supported Languages: Spanish (es) ↔ English (en)
- Medical Terminology: Enabled for accurate medical translations
- Cache: Common medical terms cached for performance
- Fallback: Basic translation dictionary for common medical terms

### Audit Service

```csharp
public interface IAuditService
{
    Task LogOperationAsync(AuditLogEntry entry);
    Task<PagedResult<AuditLogEntry>> QueryAuditLogsAsync(AuditLogQuery query);
    Task<AuditLogEntry> GetAuditLogByIdAsync(Guid auditId);
}

public class AuditLogEntry
{
    public Guid AuditId { get; set; }
    public DateTime Timestamp { get; set; }
    public string UserId { get; set; }
    public string Username { get; set; }
    public string IpAddress { get; set; }
    public string ActionType { get; set; }
    public string EntityType { get; set; }
    public string EntityId { get; set; }
    public string BeforeValue { get; set; }  // JSON
    public string AfterValue { get; set; }   // JSON
    public Dictionary<string, object> Metadata { get; set; }
}

public class AuditLogQuery
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string UserId { get; set; }
    public string ActionType { get; set; }
    public string EntityType { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}
```


## Data Models - Oracle Database Schema (4NF/5NF)

### Core Entity Tables

**PATIENTS**
```sql
CREATE TABLE PATIENTS (
    patient_id RAW(16) PRIMARY KEY,
    identification_number VARCHAR2(50) UNIQUE NOT NULL,
    first_name VARCHAR2(100) NOT NULL,
    last_name VARCHAR2(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR2(10) NOT NULL,
    blood_type VARCHAR2(5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**PATIENT_CONTACTS** (4NF - separate contact types)
```sql
CREATE TABLE PATIENT_CONTACTS (
    contact_id RAW(16) PRIMARY KEY,
    patient_id RAW(16) NOT NULL,
    contact_type VARCHAR2(20) NOT NULL, -- email, phone, address
    contact_value VARCHAR2(500) NOT NULL,
    is_primary NUMBER(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES PATIENTS(patient_id)
);
```

**PATIENT_ALLERGIES**
```sql
CREATE TABLE PATIENT_ALLERGIES (
    allergy_id RAW(16) PRIMARY KEY,
    patient_id RAW(16) NOT NULL,
    allergen_type VARCHAR2(50) NOT NULL,
    allergen_name VARCHAR2(200) NOT NULL,
    severity VARCHAR2(20) NOT NULL,
    notes CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES PATIENTS(patient_id)
);
```

**DOCTORS**
```sql
CREATE TABLE DOCTORS (
    doctor_id RAW(16) PRIMARY KEY,
    identification_number VARCHAR2(50) UNIQUE NOT NULL,
    first_name VARCHAR2(100) NOT NULL,
    last_name VARCHAR2(100) NOT NULL,
    specialty_id RAW(16) NOT NULL,
    license_number VARCHAR2(50) UNIQUE NOT NULL,
    email VARCHAR2(200),
    phone VARCHAR2(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (specialty_id) REFERENCES SPECIALTIES(specialty_id)
);
```

**SPECIALTIES**
```sql
CREATE TABLE SPECIALTIES (
    specialty_id RAW(16) PRIMARY KEY,
    specialty_code VARCHAR2(20) UNIQUE NOT NULL,
    specialty_name VARCHAR2(200) NOT NULL,
    description VARCHAR2(500)
);
```

**DOCTOR_MEDICAL_CENTERS** (5NF - many-to-many with temporal data)
```sql
CREATE TABLE DOCTOR_MEDICAL_CENTERS (
    assignment_id RAW(16) PRIMARY KEY,
    doctor_id RAW(16) NOT NULL,
    medical_center_id RAW(16) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active NUMBER(1) DEFAULT 1,
    FOREIGN KEY (doctor_id) REFERENCES DOCTORS(doctor_id),
    FOREIGN KEY (medical_center_id) REFERENCES MEDICAL_CENTERS(center_id)
);
```

**MEDICAL_CENTERS**
```sql
CREATE TABLE MEDICAL_CENTERS (
    center_id RAW(16) PRIMARY KEY,
    center_name VARCHAR2(200) NOT NULL,
    center_type VARCHAR2(50) NOT NULL,
    address_id RAW(16),
    phone VARCHAR2(20),
    email VARCHAR2(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (address_id) REFERENCES ADDRESSES(address_id)
);
```

**PRESCRIPTIONS**
```sql
CREATE TABLE PRESCRIPTIONS (
    prescription_id RAW(16) PRIMARY KEY,
    prescription_number VARCHAR2(50) UNIQUE NOT NULL,
    patient_id RAW(16) NOT NULL,
    doctor_id RAW(16) NOT NULL,
    medical_center_id RAW(16) NOT NULL,
    prescription_date TIMESTAMP NOT NULL,
    expiration_date TIMESTAMP NOT NULL,
    status VARCHAR2(20) NOT NULL, -- draft, active, dispensed, expired, cancelled
    notes CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES PATIENTS(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES DOCTORS(doctor_id),
    FOREIGN KEY (medical_center_id) REFERENCES MEDICAL_CENTERS(center_id)
);
```

**CIE10_CATALOG** (Catálogo completo de CIE-10)
```sql
CREATE TABLE CIE10_CATALOG (
    cie10_id RAW(16) PRIMARY KEY,
    code VARCHAR2(10) UNIQUE NOT NULL,
    description VARCHAR2(500) NOT NULL,
    category VARCHAR2(100),
    subcategory VARCHAR2(100),
    is_active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cie10_code ON CIE10_CATALOG(code);
CREATE INDEX idx_cie10_description ON CIE10_CATALOG(UPPER(description));
```

**PRESCRIPTION_DIAGNOSES** (4NF - separate diagnoses)
```sql
CREATE TABLE PRESCRIPTION_DIAGNOSES (
    prescription_diagnosis_id RAW(16) PRIMARY KEY,
    prescription_id RAW(16) NOT NULL,
    cie10_id RAW(16) NOT NULL,
    diagnosis_code VARCHAR2(10) NOT NULL, -- CIE-10 code (denormalized for performance)
    diagnosis_description VARCHAR2(500) NOT NULL,
    is_primary NUMBER(1) DEFAULT 0,
    ai_suggested NUMBER(1) DEFAULT 0,
    ai_confidence_score NUMBER(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES PRESCRIPTIONS(prescription_id),
    FOREIGN KEY (cie10_id) REFERENCES CIE10_CATALOG(cie10_id)
);
```

**MEDICATIONS**
```sql
CREATE TABLE MEDICATIONS (
    medication_id RAW(16) PRIMARY KEY,
    medication_code VARCHAR2(50) UNIQUE NOT NULL,
    commercial_name VARCHAR2(200) NOT NULL,
    generic_name VARCHAR2(200) NOT NULL,
    active_ingredient VARCHAR2(200),
    presentation VARCHAR2(100),
    concentration VARCHAR2(100),
    requires_prescription NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**PRESCRIPTION_MEDICATIONS** (4NF - separate medications per prescription)
```sql
CREATE TABLE PRESCRIPTION_MEDICATIONS (
    prescription_medication_id RAW(16) PRIMARY KEY,
    prescription_id RAW(16) NOT NULL,
    medication_id RAW(16) NOT NULL,
    dosage VARCHAR2(100) NOT NULL,
    frequency VARCHAR2(100) NOT NULL,
    duration_days NUMBER(5) NOT NULL,
    administration_route_id RAW(16) NOT NULL,
    quantity NUMBER(10,2) NOT NULL,
    instructions CLOB,
    ai_suggested NUMBER(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES PRESCRIPTIONS(prescription_id),
    FOREIGN KEY (medication_id) REFERENCES MEDICATIONS(medication_id),
    FOREIGN KEY (administration_route_id) REFERENCES ADMINISTRATION_ROUTES(route_id)
);
```

**ADMINISTRATION_ROUTES**
```sql
CREATE TABLE ADMINISTRATION_ROUTES (
    route_id RAW(16) PRIMARY KEY,
    route_code VARCHAR2(20) UNIQUE NOT NULL,
    route_name VARCHAR2(100) NOT NULL,
    description VARCHAR2(500)
);
```

**DRUG_INTERACTIONS** (5NF - pure relationship table)
```sql
CREATE TABLE DRUG_INTERACTIONS (
    interaction_id RAW(16) PRIMARY KEY,
    medication_id_1 RAW(16) NOT NULL,
    medication_id_2 RAW(16) NOT NULL,
    interaction_severity VARCHAR2(20) NOT NULL, -- mild, moderate, severe
    interaction_description CLOB NOT NULL,
    clinical_effects CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medication_id_1) REFERENCES MEDICATIONS(medication_id),
    FOREIGN KEY (medication_id_2) REFERENCES MEDICATIONS(medication_id),
    CHECK (medication_id_1 < medication_id_2) -- Prevent duplicates
);
```


### Pharmacy and Dispensation Tables

**PHARMACIES**
```sql
CREATE TABLE PHARMACIES (
    pharmacy_id RAW(16) PRIMARY KEY,
    pharmacy_name VARCHAR2(200) NOT NULL,
    license_number VARCHAR2(50) UNIQUE NOT NULL,
    address_id RAW(16),
    phone VARCHAR2(20),
    email VARCHAR2(200),
    is_active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (address_id) REFERENCES ADDRESSES(address_id)
);
```

**DISPENSATIONS**
```sql
CREATE TABLE DISPENSATIONS (
    dispensation_id RAW(16) PRIMARY KEY,
    prescription_id RAW(16) NOT NULL,
    pharmacy_id RAW(16) NOT NULL,
    pharmacist_id RAW(16) NOT NULL,
    dispensation_date TIMESTAMP NOT NULL,
    status VARCHAR2(20) NOT NULL, -- pending, verified, completed, rejected
    notes CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES PRESCRIPTIONS(prescription_id),
    FOREIGN KEY (pharmacy_id) REFERENCES PHARMACIES(pharmacy_id),
    FOREIGN KEY (pharmacist_id) REFERENCES USERS(user_id)
);
```

**DISPENSATION_ITEMS** (4NF - separate items)
```sql
CREATE TABLE DISPENSATION_ITEMS (
    dispensation_item_id RAW(16) PRIMARY KEY,
    dispensation_id RAW(16) NOT NULL,
    prescription_medication_id RAW(16) NOT NULL,
    quantity_dispensed NUMBER(10,2) NOT NULL,
    batch_number VARCHAR2(50),
    expiration_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispensation_id) REFERENCES DISPENSATIONS(dispensation_id),
    FOREIGN KEY (prescription_medication_id) REFERENCES PRESCRIPTION_MEDICATIONS(prescription_medication_id)
);
```

**INVENTORY**
```sql
CREATE TABLE INVENTORY (
    inventory_id RAW(16) PRIMARY KEY,
    pharmacy_id RAW(16) NOT NULL,
    medication_id RAW(16) NOT NULL,
    batch_number VARCHAR2(50) NOT NULL,
    quantity_available NUMBER(10,2) NOT NULL,
    expiration_date DATE NOT NULL,
    unit_cost NUMBER(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pharmacy_id) REFERENCES PHARMACIES(pharmacy_id),
    FOREIGN KEY (medication_id) REFERENCES MEDICATIONS(medication_id),
    UNIQUE (pharmacy_id, medication_id, batch_number)
);
```

### Security and User Management Tables

**USERS**
```sql
CREATE TABLE USERS (
    user_id RAW(16) PRIMARY KEY,
    username VARCHAR2(100) UNIQUE NOT NULL,
    email VARCHAR2(200) UNIQUE NOT NULL,
    keycloak_user_id VARCHAR2(100) UNIQUE, -- Keycloak UUID
    is_active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**ROLES**
```sql
CREATE TABLE ROLES (
    role_id RAW(16) PRIMARY KEY,
    role_name VARCHAR2(100) UNIQUE NOT NULL,
    description VARCHAR2(500),
    keycloak_role_id VARCHAR2(100), -- Keycloak role mapping
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**USER_ROLES** (5NF - pure relationship)
```sql
CREATE TABLE USER_ROLES (
    user_role_id RAW(16) PRIMARY KEY,
    user_id RAW(16) NOT NULL,
    role_id RAW(16) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    FOREIGN KEY (role_id) REFERENCES ROLES(role_id),
    UNIQUE (user_id, role_id)
);
```

**PERMISSIONS**
```sql
CREATE TABLE PERMISSIONS (
    permission_id RAW(16) PRIMARY KEY,
    permission_name VARCHAR2(100) UNIQUE NOT NULL,
    resource VARCHAR2(100) NOT NULL,
    action VARCHAR2(50) NOT NULL, -- create, read, update, delete
    description VARCHAR2(500)
);
```

**ROLE_PERMISSIONS** (5NF - pure relationship)
```sql
CREATE TABLE ROLE_PERMISSIONS (
    role_permission_id RAW(16) PRIMARY KEY,
    role_id RAW(16) NOT NULL,
    permission_id RAW(16) NOT NULL,
    FOREIGN KEY (role_id) REFERENCES ROLES(role_id),
    FOREIGN KEY (permission_id) REFERENCES PERMISSIONS(permission_id),
    UNIQUE (role_id, permission_id)
);
```

### Audit and AI Logging Tables

**AUDIT_LOGS** (Immutable)
```sql
CREATE TABLE AUDIT_LOGS (
    audit_id RAW(16) PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    user_id RAW(16),
    username VARCHAR2(100),
    ip_address VARCHAR2(50),
    action_type VARCHAR2(100) NOT NULL,
    entity_type VARCHAR2(100) NOT NULL,
    entity_id VARCHAR2(100),
    before_value CLOB,
    after_value CLOB,
    metadata CLOB, -- JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id)
);

-- Prevent updates and deletes
CREATE TRIGGER prevent_audit_modification
BEFORE UPDATE OR DELETE ON AUDIT_LOGS
FOR EACH ROW
BEGIN
    RAISE_APPLICATION_ERROR(-20001, 'Audit logs are immutable');
END;
```

**AI_ANALYSIS_LOGS**
```sql
CREATE TABLE AI_ANALYSIS_LOGS (
    analysis_id RAW(16) PRIMARY KEY,
    user_id RAW(16) NOT NULL,
    patient_id RAW(16),
    clinical_description CLOB NOT NULL,
    suggested_diagnoses CLOB, -- JSON array
    selected_diagnoses CLOB, -- JSON array
    suggested_medications CLOB, -- JSON array
    ai_provider VARCHAR2(100) NOT NULL,
    confidence_scores CLOB, -- JSON
    processing_time_ms NUMBER(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id),
    FOREIGN KEY (patient_id) REFERENCES PATIENTS(patient_id)
);
```

**ADDRESSES** (Shared by multiple entities)
```sql
CREATE TABLE ADDRESSES (
    address_id RAW(16) PRIMARY KEY,
    country VARCHAR2(100) NOT NULL,
    province VARCHAR2(100) NOT NULL,
    canton VARCHAR2(100),
    district VARCHAR2(100),
    street_address VARCHAR2(500),
    postal_code VARCHAR2(20),
    latitude NUMBER(10,8),
    longitude NUMBER(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes for Performance

```sql
-- Patient indexes
CREATE INDEX idx_patients_identification ON PATIENTS(identification_number);
CREATE INDEX idx_patients_name ON PATIENTS(last_name, first_name);

-- Prescription indexes
CREATE INDEX idx_prescriptions_patient ON PRESCRIPTIONS(patient_id);
CREATE INDEX idx_prescriptions_doctor ON PRESCRIPTIONS(doctor_id);
CREATE INDEX idx_prescriptions_date ON PRESCRIPTIONS(prescription_date);
CREATE INDEX idx_prescriptions_status ON PRESCRIPTIONS(status);
CREATE INDEX idx_prescriptions_number ON PRESCRIPTIONS(prescription_number);

-- Dispensation indexes
CREATE INDEX idx_dispensations_prescription ON DISPENSATIONS(prescription_id);
CREATE INDEX idx_dispensations_pharmacy ON DISPENSATIONS(pharmacy_id);
CREATE INDEX idx_dispensations_date ON DISPENSATIONS(dispensation_date);

-- Inventory indexes
CREATE INDEX idx_inventory_pharmacy ON INVENTORY(pharmacy_id);
CREATE INDEX idx_inventory_medication ON INVENTORY(medication_id);
CREATE INDEX idx_inventory_expiration ON INVENTORY(expiration_date);

-- Audit indexes
CREATE INDEX idx_audit_timestamp ON AUDIT_LOGS(timestamp);
CREATE INDEX idx_audit_user ON AUDIT_LOGS(user_id);
CREATE INDEX idx_audit_entity ON AUDIT_LOGS(entity_type, entity_id);
CREATE INDEX idx_audit_action ON AUDIT_LOGS(action_type);

-- AI logs indexes
CREATE INDEX idx_ai_logs_user ON AI_ANALYSIS_LOGS(user_id);
CREATE INDEX idx_ai_logs_patient ON AI_ANALYSIS_LOGS(patient_id);
CREATE INDEX idx_ai_logs_created ON AI_ANALYSIS_LOGS(created_at);
```


## Error Handling

### Exception Hierarchy

```csharp
public class EPrescriptionException : Exception
{
    public string ErrorCode { get; set; }
    public Dictionary<string, object> Metadata { get; set; }
    
    public EPrescriptionException(string message, string errorCode = null) 
        : base(message)
    {
        ErrorCode = errorCode;
        Metadata = new Dictionary<string, object>();
    }
}

public class ValidationException : EPrescriptionException
{
    public List<ValidationError> Errors { get; set; }
    
    public ValidationException(string message, List<ValidationError> errors) 
        : base(message, "VALIDATION_ERROR")
    {
        Errors = errors;
    }
}

public class NotFoundException : EPrescriptionException
{
    public NotFoundException(string entityType, string entityId) 
        : base($"{entityType} with ID {entityId} not found", "NOT_FOUND")
    {
        Metadata["EntityType"] = entityType;
        Metadata["EntityId"] = entityId;
    }
}

public class UnauthorizedException : EPrescriptionException
{
    public UnauthorizedException(string message = "Unauthorized access") 
        : base(message, "UNAUTHORIZED") { }
}

public class BusinessRuleException : EPrescriptionException
{
    public BusinessRuleException(string message, string ruleCode) 
        : base(message, ruleCode) { }
}

public class ExternalServiceException : EPrescriptionException
{
    public string ServiceName { get; set; }
    
    public ExternalServiceException(string serviceName, string message) 
        : base($"External service error: {serviceName} - {message}", "EXTERNAL_SERVICE_ERROR")
    {
        ServiceName = serviceName;
    }
}
```

### Global Exception Handler Middleware

```csharp
public class ExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlerMiddleware> _logger;
    private readonly IAuditService _auditService;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        _logger.LogError(exception, "Unhandled exception occurred");

        var response = exception switch
        {
            ValidationException validationEx => new ErrorResponse
            {
                StatusCode = 400,
                ErrorCode = validationEx.ErrorCode,
                Message = validationEx.Message,
                Errors = validationEx.Errors
            },
            NotFoundException notFoundEx => new ErrorResponse
            {
                StatusCode = 404,
                ErrorCode = notFoundEx.ErrorCode,
                Message = notFoundEx.Message
            },
            UnauthorizedException unauthorizedEx => new ErrorResponse
            {
                StatusCode = 401,
                ErrorCode = unauthorizedEx.ErrorCode,
                Message = "Unauthorized"
            },
            BusinessRuleException businessEx => new ErrorResponse
            {
                StatusCode = 422,
                ErrorCode = businessEx.ErrorCode,
                Message = businessEx.Message
            },
            ExternalServiceException externalEx => new ErrorResponse
            {
                StatusCode = 503,
                ErrorCode = externalEx.ErrorCode,
                Message = "External service unavailable"
            },
            _ => new ErrorResponse
            {
                StatusCode = 500,
                ErrorCode = "INTERNAL_ERROR",
                Message = "An internal error occurred"
            }
        };

        // Log to audit system
        await _auditService.LogOperationAsync(new AuditLogEntry
        {
            ActionType = "ERROR",
            EntityType = "System",
            Metadata = new Dictionary<string, object>
            {
                ["ErrorCode"] = response.ErrorCode,
                ["StatusCode"] = response.StatusCode,
                ["ExceptionType"] = exception.GetType().Name
            }
        });

        context.Response.StatusCode = response.StatusCode;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(response);
    }
}
```


## Testing Strategy

### Unit Testing

**Framework**: xUnit with FluentAssertions and Moq

**Test Projects**:
- EPrescription.Domain.Tests
- EPrescription.Application.Tests
- EPrescription.Infrastructure.Tests

**Coverage Areas**:
1. Domain entities and business rules (80%+ coverage)
2. Application use cases and command handlers
3. Validators (FluentValidation)
4. Services (AI, Audit, Authentication)
5. Repositories (with in-memory database)

**Example Unit Test**:
```csharp
public class CreatePrescriptionCommandHandlerTests
{
    private readonly Mock<IPrescriptionRepository> _mockRepo;
    private readonly Mock<IAuditService> _mockAudit;
    private readonly Mock<IPatientRepository> _mockPatientRepo;
    private readonly CreatePrescriptionCommandHandler _handler;

    public CreatePrescriptionCommandHandlerTests()
    {
        _mockRepo = new Mock<IPrescriptionRepository>();
        _mockAudit = new Mock<IAuditService>();
        _mockPatientRepo = new Mock<IPatientRepository>();
        _handler = new CreatePrescriptionCommandHandler(
            _mockRepo.Object, 
            _mockAudit.Object,
            _mockPatientRepo.Object);
    }

    [Fact]
    public async Task Handle_ValidRequest_CreatesPrescription()
    {
        // Arrange
        var command = new CreatePrescriptionCommand
        {
            PatientId = Guid.NewGuid(),
            DoctorId = Guid.NewGuid(),
            MedicalCenterId = Guid.NewGuid(),
            Diagnoses = new List<DiagnosisDto>
            {
                new() { Code = "J00", Description = "Resfriado común" }
            },
            Medications = new List<PrescriptionMedicationDto>
            {
                new() { MedicationId = Guid.NewGuid(), Dosage = "500mg" }
            }
        };

        _mockPatientRepo.Setup(r => r.GetByIdAsync(command.PatientId))
            .ReturnsAsync(new Patient { PatientId = command.PatientId });

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.PrescriptionId.Should().NotBeEmpty();
        _mockRepo.Verify(r => r.AddAsync(It.IsAny<Prescription>()), Times.Once);
        _mockAudit.Verify(a => a.LogOperationAsync(It.Is<AuditLogEntry>(
            e => e.ActionType == "CREATE_PRESCRIPTION")), Times.Once);
    }

    [Fact]
    public async Task Handle_PatientNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var command = new CreatePrescriptionCommand
        {
            PatientId = Guid.NewGuid()
        };

        _mockPatientRepo.Setup(r => r.GetByIdAsync(command.PatientId))
            .ReturnsAsync((Patient)null);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => _handler.Handle(command, CancellationToken.None));
    }
}
```

### Integration Testing

**Framework**: WebApplicationFactory with Testcontainers

**Test Project**: EPrescription.API.IntegrationTests

**Coverage Areas**:
1. API endpoints (full request/response cycle)
2. Database operations (with test Oracle container)
3. Authentication and authorization flows
4. External service integrations (with mocks)

**Example Integration Test**:
```csharp
public class PrescriptionApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public PrescriptionApiTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Replace Oracle with test container
                services.AddDbContext<EPrescriptionDbContext>(options =>
                    options.UseOracle(TestContainers.OracleConnectionString));
            });
        });
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task CreatePrescription_ValidData_ReturnsCreated()
    {
        // Arrange
        var token = await GetAuthTokenAsync();
        _client.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", token);

        var request = new CreatePrescriptionRequest
        {
            PatientId = TestData.PatientId,
            DoctorId = TestData.DoctorId,
            MedicalCenterId = TestData.MedicalCenterId,
            Diagnoses = new List<DiagnosisDto>
            {
                new() { Code = "J00", Description = "Resfriado común" }
            },
            Medications = new List<PrescriptionMedicationDto>
            {
                new() { MedicationId = TestData.MedicationId, Dosage = "500mg" }
            }
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/prescriptions", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var prescription = await response.Content.ReadFromJsonAsync<PrescriptionDto>();
        prescription.Should().NotBeNull();
        prescription.PrescriptionId.Should().NotBeEmpty();
        prescription.Status.Should().Be("draft");
    }

    [Fact]
    public async Task GetPrescription_Unauthorized_Returns401()
    {
        // Act
        var response = await _client.GetAsync($"/api/prescriptions/{Guid.NewGuid()}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
```


## Docker Configuration

### Backend API Dockerfile

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["EPrescription.API/EPrescription.API.csproj", "EPrescription.API/"]
COPY ["EPrescription.Application/EPrescription.Application.csproj", "EPrescription.Application/"]
COPY ["EPrescription.Domain/EPrescription.Domain.csproj", "EPrescription.Domain/"]
COPY ["EPrescription.Infrastructure/EPrescription.Infrastructure.csproj", "EPrescription.Infrastructure/"]
RUN dotnet restore "EPrescription.API/EPrescription.API.csproj"

# Copy source code and build
COPY . .
WORKDIR "/src/EPrescription.API"
RUN dotnet build "EPrescription.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "EPrescription.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EPrescription.API.dll"]
```

### Docker Compose Configuration

```yaml
version: '3.8'

services:
  # Oracle Database
  oracle-db:
    image: container-registry.oracle.com/database/express:21.3.0-xe
    container_name: eprescription-oracle
    environment:
      - ORACLE_PWD=OraclePassword123!
      - ORACLE_CHARACTERSET=AL32UTF8
    ports:
      - "1521:1521"
      - "5500:5500"
    volumes:
      - oracle-data:/opt/oracle/oradata
      - ./eprescription-Database/scripts:/docker-entrypoint-initdb.d/startup
      - ./eprescription-Database/mock-data:/docker-entrypoint-initdb.d/mock
    healthcheck:
      test: ["CMD-SHELL", "echo 'SELECT 1 FROM DUAL;' | sqlplus -s sys/OraclePassword123!@//localhost:1521/XE as sysdba"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s
    networks:
      - eprescription-network

  # Keycloak (usando Oracle como base de datos)
  keycloak:
    image: quay.io/keycloak/keycloak:23.0
    container_name: eprescription-keycloak
    environment:
      - KEYCLOAK_ADMIN=admin
      - KEYCLOAK_ADMIN_PASSWORD=admin123
      - KC_DB=oracle
      - KC_DB_URL=jdbc:oracle:thin:@oracle-db:1521/XE
      - KC_DB_USERNAME=keycloak_user
      - KC_DB_PASSWORD=KeycloakPass123!
      - KC_DB_SCHEMA=KEYCLOAK
      - KC_HOSTNAME=localhost
      - KC_HTTP_ENABLED=true
    ports:
      - "8080:8080"
    command: start-dev
    depends_on:
      oracle-db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health/ready"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s
    networks:
      - eprescription-network

  # Backend API
  backend-api:
    build:
      context: ./eprescription-API
      dockerfile: Dockerfile
    container_name: eprescription-api
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ASPNETCORE_URLS=http://+:80;https://+:443
      - ConnectionStrings__OracleDb=Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle-db)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=XE)));User Id=eprescription_user;Password=EprescriptionPass123!;
      - Authentication__Keycloak__Authority=http://keycloak:8080/realms/eprescription
      - Authentication__Keycloak__Audience=eprescription-api
      - Authentication__Keycloak__ClientId=eprescription-api
      - Authentication__Keycloak__ClientSecret=${KEYCLOAK_CLIENT_SECRET}
      - HuggingFace__ApiKey=${HUGGINGFACE_API_KEY}
      - HuggingFace__ModelEndpoint=https://api-inference.huggingface.co/models/medical-ner-es
      - Logging__LogLevel__Default=Information
      - Logging__LogLevel__Microsoft.AspNetCore=Warning
    ports:
      - "5000:80"
      - "5001:443"
    depends_on:
      oracle-db:
        condition: service_healthy
      keycloak:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - eprescription-network

volumes:
  oracle-data:
    driver: local

networks:
  eprescription-network:
    driver: bridge

# Notas:
# - Keycloak usa Oracle como base de datos (esquema KEYCLOAK)
# - Todos los datos están centralizados en Oracle
# - Simplifica la arquitectura (un solo motor de BD)
# - Facilita backups y administración
```

### Environment Variables (.env file)

```env
# Keycloak
KEYCLOAK_CLIENT_SECRET=your-keycloak-client-secret-here

# Hugging Face API (migrated from PorMigrar folder)
HUGGINGFACE_API_KEY=your-huggingface-api-key-here

# WHO API (ICD-10 Catalog)
WHO_API_CLIENT_ID=your-who-api-client-id-here
WHO_API_CLIENT_SECRET=your-who-api-client-secret-here
WHO_API_BASE_URL=https://icd.who.int/icdapi

# Translation Service (Azure Translator or Google Cloud Translation)
TRANSLATION_API_KEY=your-translation-api-key-here
TRANSLATION_API_ENDPOINT=https://api.cognitive.microsofttranslator.com
TRANSLATION_REGION=eastus

# Oracle Database
ORACLE_PASSWORD=OraclePassword123!
EPRESCRIPTION_DB_PASSWORD=EprescriptionPass123!
KEYCLOAK_DB_PASSWORD=KeycloakPass123!

# Development settings
ASPNETCORE_ENVIRONMENT=Development
```

### Docker Commands

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f backend-api
docker-compose logs -f oracle-db
docker-compose logs -f keycloak

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Access Oracle SQL Developer
# Host: localhost
# Port: 1521
# Service Name: XE
# Username: eprescription_user
# Password: EprescriptionPass123!

# Access Keycloak Admin Console
# URL: http://localhost:8080
# Username: admin
# Password: admin123

# Test Backend API with Postman
# Base URL: http://localhost:5000
# HTTPS URL: https://localhost:5001
```


## Frontend Integration

### Angular HTTP Interceptor for JWT

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();
    
    if (token) {
      req = this.addToken(req, token);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired, try to refresh
          return this.authService.refreshToken().pipe(
            switchMap((newToken: string) => {
              req = this.addToken(req, newToken);
              return next.handle(req);
            }),
            catchError((refreshError) => {
              // Refresh failed, logout user
              this.authService.logout();
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
```

### Angular Auth Service (Keycloak Integration)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  userInfo: UserInfo;
}

export interface UserInfo {
  userId: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/api/auth/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        this.storeTokens(response);
        this.currentUserSubject.next(response.userInfo);
      })
    );
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post<AuthResponse>(`${this.API_URL}/api/auth/refresh`, {
      refreshToken
    }).pipe(
      tap(response => {
        this.storeTokens(response);
      }),
      map(response => response.accessToken)
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refresh_token');
    this.http.post(`${this.API_URL}/api/auth/logout`, { refreshToken }).subscribe();
    this.clearTokens();
    this.currentUserSubject.next(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token !== null && !this.isTokenExpired(token);
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles.includes(role) ?? false;
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.permissions.includes(permission) ?? false;
  }

  private storeTokens(response: AuthResponse): void {
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
    localStorage.setItem('user_info', JSON.stringify(response.userInfo));
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
  }

  private loadUserFromStorage(): void {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      this.currentUserSubject.next(JSON.parse(userInfo));
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
```

### Angular AI Assistant Service (Backend Integration)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DiagnosisAnalysisRequest {
  clinicalDescription: string;
  patientId: string;
}

export interface DiagnosisAnalysisResponse {
  suggestions: DiagnosisSuggestion[];
  processingTimeMs: number;
  aiProvider: string;
}

export interface DiagnosisSuggestion {
  cie10Code: string;
  description: string;
  confidenceScore: number;
  reasoning: string;
}

export interface MedicationRecommendationRequest {
  diagnosisCodes: string[];
  patientId: string;
}

export interface MedicationRecommendation {
  medicationId: string;
  medicationName: string;
  recommendedDosage: string;
  frequency: string;
  confidenceScore: number;
  reasoning: string;
}

@Injectable({
  providedIn: 'root'
})
export class AIAssistantService {
  private readonly API_URL = `${environment.apiUrl}/api/ai`;

  constructor(private http: HttpClient) {}

  analyzeClinicalDescription(request: DiagnosisAnalysisRequest): Observable<DiagnosisAnalysisResponse> {
    return this.http.post<DiagnosisAnalysisResponse>(
      `${this.API_URL}/analyze`,
      request
    );
  }

  generateMedicationRecommendations(request: MedicationRecommendationRequest): Observable<MedicationRecommendation[]> {
    return this.http.post<MedicationRecommendation[]>(
      `${this.API_URL}/medications`,
      request
    );
  }

  checkDrugInteractions(medicationIds: string[]): Observable<DrugInteractionResult> {
    return this.http.post<DrugInteractionResult>(
      `${this.API_URL}/interactions`,
      { medicationIds }
    );
  }

  validateContraindications(patientId: string, medicationIds: string[]): Observable<ContraindicationResult> {
    return this.http.post<ContraindicationResult>(
      `${this.API_URL}/contraindications`,
      { patientId, medicationIds }
    );
  }
}
```

### Environment Configuration

```typescript
// environment.ts (Development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000',
  keycloakUrl: 'http://localhost:8080'
};

// environment.prod.ts (Production)
export const environment = {
  production: true,
  apiUrl: 'https://api.eprescription.com',
  keycloakUrl: 'https://auth.eprescription.com'
};
```


## Security and Compliance

### Medical Standards and Regulatory Compliance

#### HL7 FHIR Compliance

**HL7 FHIR Resources Mapping**:
- Patient → FHIR Patient resource
- Practitioner (Doctor) → FHIR Practitioner resource
- MedicationRequest (Prescription) → FHIR MedicationRequest resource
- MedicationDispense (Dispensation) → FHIR MedicationDispense resource
- Condition (Diagnosis) → FHIR Condition resource with ICD-10 coding

**FHIR Implementation**:
```csharp
public interface IFHIRService
{
    Task<FHIRPatient> ConvertToFHIRPatientAsync(Patient patient);
    Task<FHIRMedicationRequest> ConvertToFHIRMedicationRequestAsync(Prescription prescription);
    Task<string> ExportToFHIRJsonAsync(object resource);
    Task<bool> ValidateFHIRResourceAsync(string fhirJson);
}
```

**HL7 Standards**:
- Message format: HL7 v2.x for legacy systems integration
- FHIR R4 for modern interoperability
- CDA (Clinical Document Architecture) for prescription documents
- Terminology: LOINC, SNOMED CT, ICD-10 (CIE-10)

#### FDA 21 CFR Part 11 Compliance

**Electronic Records**:
1. **Audit Trail**: Complete immutable audit logs for all operations
2. **Electronic Signatures**: Keycloak authentication serves as electronic signature
3. **System Validation**: Comprehensive test suite validates system functionality
4. **Access Controls**: Role-based access control with Keycloak
5. **Data Integrity**: Database constraints and validation at all layers

**Implementation**:
- All prescription creation/modification logged with user ID and timestamp
- Audit logs cannot be modified or deleted (trigger enforcement)
- User authentication required before any prescription operation
- Digital signatures using Keycloak JWT tokens
- System validation documented in test reports

#### OMS (WHO) Compliance

**ICD-10 (CIE-10) Standards**:
- Official WHO ICD-10 catalog via WHO API
- Daily synchronization with WHO ICD API
- Spanish and English language support
- Validation of all diagnosis codes against official WHO catalog
- Audit trail of all ICD-10 codes used

**WHO API Integration**:
- Endpoint: https://icd.who.int/icdapi
- OAuth 2.0 authentication
- ICD-10 version tracking
- Automatic updates when WHO releases new versions

#### Additional Medical Standards

**Prescription Standards**:
- Drug nomenclature: Generic and commercial names
- Dosage standardization: Metric units
- Administration routes: Standardized codes
- Drug interactions: Evidence-based database

**Data Privacy**:
- Patient data encryption at rest and in transit
- Anonymization for research/analytics
- Consent management
- Right to be forgotten (GDPR-like)

### Keycloak Configuration

**Realm Setup**:
1. Create realm: `eprescription`
2. Create client: `eprescription-api`
   - Client Protocol: openid-connect
   - Access Type: confidential
   - Valid Redirect URIs: http://localhost:4200/*, http://localhost:5000/*
   - Web Origins: http://localhost:4200, http://localhost:5000

**Roles**:
- `admin`: Full system access
- `doctor`: Create and manage prescriptions
- `pharmacist`: Dispense medications, manage inventory
- `patient`: View own prescriptions
- `auditor`: Read-only access to audit logs

**Client Scopes**:
- `eprescription-api`: Custom scope with user roles and permissions

### HIPAA Compliance Measures

1. **Data Encryption**:
   - TLS 1.2+ for all communications
   - Oracle Transparent Data Encryption (TDE) for data at rest
   - Encrypted backups

2. **Access Control**:
   - Role-based access control (RBAC)
   - Minimum necessary access principle
   - Session timeouts (15 minutes idle)

3. **Audit Logging**:
   - All PHI access logged
   - Immutable audit logs
   - 7-year retention period
   - Regular audit log reviews

4. **Data Integrity**:
   - Database constraints and foreign keys
   - Transaction management
   - Validation at multiple layers

5. **Authentication**:
   - Strong password policies (Keycloak)
   - Multi-factor authentication support
   - Account lockout after failed attempts

### FDA 21 CFR Part 11 Compliance

1. **Electronic Signatures**:
   - User authentication before prescription creation
   - Audit trail of all prescription modifications
   - Non-repudiation through Keycloak authentication

2. **Electronic Records**:
   - Immutable audit logs
   - Timestamp all records
   - Secure storage with access controls

3. **System Validation**:
   - Comprehensive test suite (unit + integration)
   - Documented validation protocols
   - Change control procedures

## Performance Optimization

### Caching Strategy

```csharp
public class CachingService : ICachingService
{
    private readonly IDistributedCache _cache;
    private readonly ILogger<CachingService> _logger;

    public async Task<T> GetOrSetAsync<T>(
        string key, 
        Func<Task<T>> factory, 
        TimeSpan? expiration = null)
    {
        var cachedValue = await _cache.GetStringAsync(key);
        
        if (cachedValue != null)
        {
            return JsonSerializer.Deserialize<T>(cachedValue);
        }

        var value = await factory();
        var serialized = JsonSerializer.Serialize(value);
        
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromMinutes(30)
        };
        
        await _cache.SetStringAsync(key, serialized, options);
        return value;
    }
}
```

**Cached Data**:
- Medication catalog (1 hour)
- User permissions (15 minutes)
- Specialty list (1 day)
- Administration routes (1 day)
- Drug interactions (1 hour)

### Database Optimization

1. **Indexing Strategy**:
   - Primary keys on all tables
   - Foreign key indexes
   - Composite indexes for common queries
   - Full-text indexes for search fields

2. **Query Optimization**:
   - Use of stored procedures for complex queries
   - Pagination for large result sets
   - Projection (select only needed columns)
   - Eager loading for related entities

3. **Connection Pooling**:
   - Min pool size: 5
   - Max pool size: 100
   - Connection timeout: 30 seconds

4. **Partitioning**:
   - Partition AUDIT_LOGS by month
   - Partition PRESCRIPTIONS by year
   - Archive old data to separate tablespace

### API Performance

1. **Response Compression**: gzip/brotli
2. **Async/Await**: Throughout the application
3. **Background Jobs**: For heavy AI operations
4. **Rate Limiting**: 100 requests per minute per user
5. **Response Caching**: Cache-Control headers

## Monitoring and Logging

### Structured Logging with Serilog

```csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithEnvironmentName()
    .WriteTo.Console()
    .WriteTo.File("logs/eprescription-.txt", rollingInterval: RollingInterval.Day)
    .WriteTo.Elasticsearch(new ElasticsearchSinkOptions(new Uri("http://elasticsearch:9200"))
    {
        AutoRegisterTemplate = true,
        IndexFormat = "eprescription-logs-{0:yyyy.MM.dd}"
    })
    .CreateLogger();
```

### Health Checks

```csharp
builder.Services.AddHealthChecks()
    .AddDbContextCheck<EPrescriptionDbContext>("database")
    .AddUrlGroup(new Uri("http://keycloak:8080/health"), "keycloak")
    .AddCheck<HuggingFaceHealthCheck>("huggingface-api");

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
```

### Metrics and Monitoring

- **Application Metrics**: Request count, response time, error rate
- **Database Metrics**: Connection pool usage, query performance
- **External Service Metrics**: Keycloak response time, Hugging Face API latency
- **Business Metrics**: Prescriptions created, dispensations completed, AI analyses performed

## Deployment Strategy

### Development Environment
- Docker Compose with all services
- Hot reload enabled
- Debug logging
- Mock external services (optional)
- Direct port access for tools (SQL Developer, Postman)

### Staging Environment
- Kubernetes cluster (optional)
- Production-like configuration
- Real Keycloak and Hugging Face integration
- Performance testing
- Load testing

### Production Environment
- Kubernetes with high availability
- Auto-scaling (HPA)
- Load balancing
- SSL/TLS certificates
- Monitoring and alerting
- Automated backups
- Disaster recovery plan

## Migration from PorMigrar Folder

### AI Assistant Migration Steps

1. **Identify API Keys**:
   - Locate Hugging Face API key in PorMigrar React code
   - Document all AI service endpoints used

2. **Extract Business Logic**:
   - Clinical description analysis logic
   - Diagnosis suggestion algorithm
   - Medication recommendation rules
   - Drug interaction checking

3. **Migrate to Backend**:
   - Create IAIAssistantService interface
   - Implement HuggingFaceAIService
   - Store API keys in appsettings.json (encrypted) or environment variables
   - Add comprehensive error handling and retry logic

4. **Security Improvements**:
   - Remove API keys from frontend code
   - Implement rate limiting for AI endpoints
   - Add request validation
   - Log all AI operations for audit

5. **Testing**:
   - Unit tests for AI service
   - Integration tests with mocked Hugging Face API
   - Performance testing for AI operations
   - Validate accuracy of migrated logic

### Frontend Updates

1. Remove AI logic from React components in PorMigrar
2. Update Angular services to call backend AI endpoints
3. Update UI components to handle async AI responses
4. Add loading states and error handling
5. Remove Hugging Face API key from frontend environment files


- Digital signatures using Keycloak JWT tokens
- System validation documented in test reports

#### OMS (WHO) Compliance

**ICD-10 (CIE-10) Standards**:
- Official WHO ICD-10 catalog via WHO API
- Daily synchronization with WHO ICD API
- Spanish and English language support
- Validation of all diagnosis codes against official WHO catalog
- Audit trail of all ICD-10 codes used

**WHO API Integration**:
- Endpoint: https://icd.who.int/icdapi
- OAuth 2.0 authentication
- ICD-10 version tracking
- Automatic updates when WHO releases new versions

## Docker Configuration

### Docker Compose Complete Setup

```yaml
version: '3.8'

services:
  # Oracle Database (compartido por aplicación y Keycloak)
  oracle-db:
    image: container-registry.oracle.com/database/express:21.3.0-xe
    container_name: eprescription-oracle
    environment:
      - ORACLE_PWD=${ORACLE_PASSWORD}
      - ORACLE_CHARACTERSET=AL32UTF8
    ports:
      - "1521:1521"  # Puerto para Oracle SQL Developer y aplicaciones
      - "5500:5500"  # Enterprise Manager
    volumes:
      - oracle-data:/opt/oracle/oradata
      - ./eprescription-Database/scripts:/docker-entrypoint-initdb.d/startup
      - ./eprescription-Database/mock-data:/docker-entrypoint-initdb.d/mock
    healthcheck:
      test: ["CMD-SHELL", "echo 'SELECT 1 FROM DUAL;' | sqlplus -s sys/${ORACLE_PASSWORD}@//localhost:1521/XE as sysdba"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s
    networks:
      - eprescription-network

  # Keycloak (usando Oracle como base de datos)
  keycloak:
    image: quay.io/keycloak/keycloak:23.0
    container_name: eprescription-keycloak
    environment:
      - KEYCLOAK_ADMIN=admin
      - KEYCLOAK_ADMIN_PASSWORD=${KEYCLOAK_ADMIN_PASSWORD}
      - KC_DB=oracle
      - KC_DB_URL=jdbc:oracle:thin:@oracle-db:1521/XE
      - KC_DB_USERNAME=keycloak_user
      - KC_DB_PASSWORD=${KEYCLOAK_DB_PASSWORD}
      - KC_DB_SCHEMA=KEYCLOAK
      - KC_HOSTNAME=localhost
      - KC_HTTP_ENABLED=true
      - KC_HEALTH_ENABLED=true
    ports:
      - "8080:8080"  # Puerto para Keycloak Admin Console y API
    command: start-dev
    depends_on:
      oracle-db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health/ready"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s
    networks:
      - eprescription-network

  # Backend API (.NET 8)
  backend-api:
    build:
      context: ./eprescription-API
      dockerfile: Dockerfile
    container_name: eprescription-api
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ASPNETCORE_URLS=http://+:80;https://+:443
      - ConnectionStrings__OracleDb=Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle-db)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=XE)));User Id=eprescription_user;Password=${EPRESCRIPTION_DB_PASSWORD};
      - Authentication__Keycloak__Authority=http://keycloak:8080/realms/eprescription
      - Authentication__Keycloak__Audience=eprescription-api
      - Authentication__Keycloak__ClientId=eprescription-api
      - Authentication__Keycloak__ClientSecret=${KEYCLOAK_CLIENT_SECRET}
      - HuggingFace__ApiKey=${HUGGINGFACE_API_KEY}
      - HuggingFace__ModelEndpoint=https://api-inference.huggingface.co/models/medical-ner-es
      - WHO__ApiClientId=${WHO_API_CLIENT_ID}
      - WHO__ApiClientSecret=${WHO_API_CLIENT_SECRET}
      - WHO__ApiBaseUrl=https://icd.who.int/icdapi
      - Translation__ApiKey=${TRANSLATION_API_KEY}
      - Translation__Endpoint=${TRANSLATION_API_ENDPOINT}
      - Translation__Region=${TRANSLATION_REGION}
      - Logging__LogLevel__Default=Information
      - Logging__LogLevel__Microsoft.AspNetCore=Warning
    ports:
      - "5000:80"   # HTTP para desarrollo y Postman
      - "5001:443"  # HTTPS
    depends_on:
      oracle-db:
        condition: service_healthy
      keycloak:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - eprescription-network

  # Frontend Angular (opcional para desarrollo)
  frontend:
    build:
      context: ./eprescription-frontend
      dockerfile: Dockerfile
    container_name: eprescription-frontend
    ports:
      - "4200:80"
    depends_on:
      - backend-api
    networks:
      - eprescription-network
    profiles:
      - with-frontend  # Solo se inicia si se especifica el profile

volumes:
  oracle-data:
    driver: local

networks:
  eprescription-network:
    driver: bridge

# Notas de uso:
# - Iniciar todos los servicios: docker-compose up -d
# - Iniciar con frontend: docker-compose --profile with-frontend up -d
# - Ver logs: docker-compose logs -f [service-name]
# - Detener: docker-compose down
# - Limpiar todo: docker-compose down -v
```

### Dockerfiles

#### Backend API Dockerfile

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore
COPY ["EPrescription.API/EPrescription.API.csproj", "EPrescription.API/"]
COPY ["EPrescription.Application/EPrescription.Application.csproj", "EPrescription.Application/"]
COPY ["EPrescription.Domain/EPrescription.Domain.csproj", "EPrescription.Domain/"]
COPY ["EPrescription.Infrastructure/EPrescription.Infrastructure.csproj", "EPrescription.Infrastructure/"]
RUN dotnet restore "EPrescription.API/EPrescription.API.csproj"

# Copy source code and build
COPY . .
WORKDIR "/src/EPrescription.API"
RUN dotnet build "EPrescription.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "EPrescription.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "EPrescription.API.dll"]
```

#### Frontend Dockerfile (Production)

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build --configuration=production

# Runtime stage with nginx
FROM nginx:alpine
COPY --from=build /app/dist/eprescription-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables (.env file)

```env
# Keycloak
KEYCLOAK_ADMIN_PASSWORD=admin123
KEYCLOAK_CLIENT_SECRET=your-keycloak-client-secret-here
KEYCLOAK_DB_PASSWORD=KeycloakPass123!

# WHO API (ICD-10 Catalog)
WHO_API_CLIENT_ID=your-who-api-client-id-here
WHO_API_CLIENT_SECRET=your-who-api-client-secret-here

# Hugging Face API (AI Analysis)
HUGGINGFACE_API_KEY=your-huggingface-api-key-here

# Translation Service (Azure Translator or Google Cloud Translation)
TRANSLATION_API_KEY=your-translation-api-key-here
TRANSLATION_API_ENDPOINT=https://api.cognitive.microsofttranslator.com
TRANSLATION_REGION=eastus

# Oracle Database
ORACLE_PASSWORD=OraclePassword123!
EPRESCRIPTION_DB_PASSWORD=EprescriptionPass123!
```

### Docker Commands

```bash
# Desarrollo local
docker-compose up -d                    # Iniciar backend y base de datos
docker-compose --profile with-frontend up -d  # Incluir frontend

# Ver logs
docker-compose logs -f backend-api      # Logs del backend
docker-compose logs -f keycloak         # Logs de Keycloak
docker-compose logs -f oracle-db        # Logs de Oracle

# Detener servicios
docker-compose down                     # Detener sin eliminar volúmenes
docker-compose down -v                  # Detener y eliminar volúmenes (limpieza completa)

# Reconstruir imágenes
docker-compose build                    # Reconstruir todas las imágenes
docker-compose build backend-api        # Reconstruir solo backend

# Acceso a servicios
# - Backend API: http://localhost:5000
# - Swagger: http://localhost:5000/swagger
# - Keycloak: http://localhost:8080 (admin/admin123)
# - Oracle: localhost:1521 (SID: XE)
# - Frontend: http://localhost:4200 (si se inició con profile)
```

### Generación de Imágenes Docker para Distribución

Para facilitar el despliegue en servidores o equipos de otros desarrolladores:

```bash
# Construir imágenes con tags
docker build -t eprescription-api:1.0.0 ./eprescription-API
docker build -t eprescription-frontend:1.0.0 ./eprescription-frontend

# Guardar imágenes como archivos tar
docker save -o eprescription-api-1.0.0.tar eprescription-api:1.0.0
docker save -o eprescription-frontend-1.0.0.tar eprescription-frontend:1.0.0

# Cargar imágenes en otro equipo
docker load -i eprescription-api-1.0.0.tar
docker load -i eprescription-frontend-1.0.0.tar

# O publicar en Docker Hub / Registry privado
docker tag eprescription-api:1.0.0 your-registry/eprescription-api:1.0.0
docker push your-registry/eprescription-api:1.0.0
```

### Docker Registry Privado (Opcional)

Para equipos que necesiten un registry privado:

```yaml
# Agregar al docker-compose.yml
  registry:
    image: registry:2
    container_name: eprescription-registry
    ports:
      - "5050:5000"
    volumes:
      - registry-data:/var/lib/registry
    networks:
      - eprescription-network
```

