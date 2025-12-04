# MVP - Integración Angular + React - Design Document

## Overview

This design document specifies the architecture and implementation strategy for the MVP of ePrescription, integrating backend services with Angular and React frontends. The system manages prescription workflows including prescription pads (talonarios), medications, dispensations, and audit logging.

**Key Components:**
- Backend REST API (.NET/C# with EF Core)
- Frontend (Angular + React)
- Oracle Database
- Docker containerization
- AI Assistant integration

**Critical Path:** Prescription Pads → New Prescription → Issued Prescriptions → Dispensation

---

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                           │
├──────────────────────────┬──────────────────────────────────┤
│   Angular (eprescription-frontend)  │  React (ePrescription-react)  │
│   - Existing views                  │  - Nueva Receta               │
│   - Pacientes, Médicos, etc.        │  - Recetas Emitidas           │
│   - Dispensación                    │  - Borradores                 │
└──────────────────────────┴──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  REST API Layer (.NET)                       │
├─────────────────────────────────────────────────────────────┤
│  Controllers → Services → Repositories → EF Core/Raw SQL    │
│  - PrescriptionPadsController                               │
│  - PrescriptionsController                                  │
│  - PatientsController                                       │
│  - DoctorsController                                        │
│  - PharmaciesController                                     │
│  - AuditController                                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Data Access Layer                           │
├─────────────────────────────────────────────────────────────┤
│  EF Core DbContext + Raw SQL Queries (for complex ops)      │
│  - Migrations                                               │
│  - Seed Data                                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Oracle Database                             │
├─────────────────────────────────────────────────────────────┤
│  Tables: PRESCRIPTION_PAD_TYPES, PRESCRIPTION_PADS,          │
│          PRESCRIPTION_SLIPS, MEDICATIONS, PRESCRIPTIONS,     │
│          PATIENTS, DOCTORS, PHARMACIES, DISPENSATIONS,       │
│          AUDIT_LOGS, etc.                                   │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose                            │
├──────────────────┬──────────────────┬──────────────────────┤
│  eprescription-  │  eprescription-  │  eprescription-db    │
│  api (port 8000) │  frontend        │  (Oracle 21c XE)     │
│  (.NET 8)        │  (port 4200)     │  (port 1521)         │
└──────────────────┴──────────────────┴──────────────────────┘
```

---

## Components and Interfaces

### Backend Components

#### 1. Prescription Pads Service
**Responsibility:** Manage prescription pads (talonarios) for doctors

**Key Methods:**
- `GetAvailablePadsForDoctor(doctorId)` → List<PrescriptionPadDto>
- `ValidatePadAvailability(padId)` → bool
- `DecrementPadCount(padId)` → void
- `CreatePrescriptionSlips(padId, count)` → List<PrescriptionSlipDto>
- `GetAvailableSlips(padId)` → List<PrescriptionSlipDto>

**Dependencies:**
- PrescriptionPadRepository
- PrescriptionSlipRepository
- AuditService

#### 2. Prescriptions Service
**Responsibility:** Manage prescription lifecycle (draft → issued → dispensed)

**Key Methods:**
- `CreateDraft(createDraftCommand)` → PrescriptionDto
- `IssuePrescription(prescriptionId)` → PrescriptionDto
- `DuplicatePrescription(prescriptionId)` → PrescriptionDto
- `CancelPrescription(prescriptionId, reason)` → PrescriptionDto
- `GetIssuedPrescriptions(doctorId, filters)` → PagedResult<PrescriptionDto>

**Dependencies:**
- PrescriptionRepository
- PrescriptionPadsService
- MedicationsService
- AuditService
- AIAssistantService

#### 3. Medications Service
**Responsibility:** Manage medications and validate pad type requirements

**Key Methods:**
- `GetMedicationsByPadType(padTypeId)` → List<MedicationDto>
- `ValidateMedicationPadType(medicationId, padTypeId)` → bool
- `GetMedicationDetails(medicationId)` → MedicationDto
- `CheckDrugInteractions(medicationIds)` → List<InteractionDto>

**Dependencies:**
- MedicationRepository
- DrugInteractionRepository

#### 4. Dispensation Service
**Responsibility:** Manage dispensation of medications

**Key Methods:**
- `SearchPrescriptions(searchTerm)` → List<PrescriptionDto>
- `RegisterDispensation(dispensationCommand)` → DispensationDto
- `ValidateDispensationQuantities(dispensationItems)` → bool
- `CompletDispensation(dispensationId)` → DispensationDto

**Dependencies:**
- DispensationRepository
- PrescriptionRepository
- InventoryRepository
- AuditService

#### 5. Audit Service
**Responsibility:** Log all system actions

**Key Methods:**
- `LogAction(auditLog)` → void
- `GetAuditLogs(filters)` → PagedResult<AuditLogDto>
- `GetAuditLogDetails(auditId)` → AuditLogDetailDto

**Dependencies:**
- AuditLogRepository

#### 6. AI Assistant Service
**Responsibility:** Suggest medications based on diagnosis and history

**Key Methods:**
- `SuggestMedications(diagnosis, patientHistory)` → List<MedicationSuggestionDto>
- `AnalyzeDrugInteractions(medicationIds)` → InteractionAnalysisDto
- `LogAnalysis(analysisLog)` → void

**Dependencies:**
- AIProvider (HuggingFace/OpenAI)
- MedicationRepository
- DrugInteractionRepository
- AIAnalysisLogRepository

### Frontend Components

#### Angular Components
- PatientListComponent
- PatientProfileComponent
- DoctorListComponent
- AuditLogComponent
- MedicalCenterListComponent
- PharmacyListComponent
- DispensationComponent

#### React Components
- NewPrescriptionComponent
- IssuedPrescriptionsComponent
- PrescriptionDraftsComponent
- PrescriptionPadSelectorComponent
- AIAssistantComponent
- MedicationSelectorComponent

---

## Data Models

### Core Entities

#### PrescriptionPadType
```csharp
public class PrescriptionPadType
{
    public Guid PadTypeId { get; set; }
    public string PadTypeName { get; set; }
    public string PadTypeCode { get; set; }
    public int DefaultQuantity { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation
    public ICollection<PrescriptionPad> PrescriptionPads { get; set; }
    public ICollection<Medication> Medications { get; set; }
}
```

#### PrescriptionPad
```csharp
public class PrescriptionPad
{
    public Guid PrescriptionPadId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid PadTypeId { get; set; }
    public string PadNumber { get; set; }
    public int AvailableCount { get; set; }
    public int TotalCount { get; set; }
    public DateTime ExpirationDate { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation
    public Doctor Doctor { get; set; }
    public PrescriptionPadType PadType { get; set; }
    public ICollection<PrescriptionSlip> PrescriptionSlips { get; set; }
}
```

#### PrescriptionSlip
```csharp
public class PrescriptionSlip
{
    public Guid SlipId { get; set; }
    public Guid PrescriptionPadId { get; set; }
    public int SlipNumber { get; set; }
    public string Status { get; set; } // available, used, cancelled
    public Guid? UsedByPrescriptionId { get; set; }
    public DateTime? UsedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation
    public PrescriptionPad PrescriptionPad { get; set; }
    public Prescription UsedByPrescription { get; set; }
}
```

#### Medication (Updated)
```csharp
public class Medication
{
    public Guid MedicationId { get; set; }
    public string MedicationCode { get; set; }
    public string CommercialName { get; set; }
    public string GenericName { get; set; }
    public string ActiveIngredient { get; set; }
    public string Presentation { get; set; }
    public string Concentration { get; set; }
    public bool RequiresPrescription { get; set; }
    public bool IsActive { get; set; }
    public Guid? AdministrationRouteId { get; set; }
    public Guid? PadTypeId { get; set; } // NEW: Link to pad type
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation
    public AdministrationRoute AdministrationRoute { get; set; }
    public PrescriptionPadType PadType { get; set; }
    public ICollection<PrescriptionMedication> PrescriptionMedications { get; set; }
}
```

#### Prescription
```csharp
public class Prescription
{
    public Guid PrescriptionId { get; set; }
    public string PrescriptionNumber { get; set; }
    public Guid PatientId { get; set; }
    public Guid DoctorId { get; set; }
    public Guid MedicalCenterId { get; set; }
    public DateTime PrescriptionDate { get; set; }
    public DateTime ExpirationDate { get; set; }
    public string Status { get; set; } // draft, issued, dispensed, cancelled, expired
    public string Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation
    public Patient Patient { get; set; }
    public Doctor Doctor { get; set; }
    public MedicalCenter MedicalCenter { get; set; }
    public ICollection<PrescriptionMedication> PrescriptionMedications { get; set; }
    public ICollection<PrescriptionDiagnosis> PrescriptionDiagnoses { get; set; }
    public ICollection<PrescriptionSlip> PrescriptionSlips { get; set; }
    public ICollection<Dispensation> Dispensations { get; set; }
}
```

---

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Prescription Pad Availability Validation
*For any* doctor and prescription pad type, when attempting to create a prescription, the system should validate that the doctor has at least one available pad of the required type.
**Validates: Requirements 10.5, 11.3**

### Property 2: Prescription Pad Count Decrement
*For any* prescription pad, when a prescription is issued using that pad, the available count should decrease by exactly 1.
**Validates: Requirements 10.6, 1.3**

### Property 3: Medication Pad Type Validation
*For any* medication with a required pad type, when a doctor attempts to prescribe it, the system should validate that the selected pad type matches the medication's required type.
**Validates: Requirements 11.2**

### Property 4: Prescription Status Transition
*For any* prescription, the status should transition through valid states only: draft → issued → dispensed or cancelled.
**Validates: Requirements 1.6, 2.4, 3.4**

### Property 5: Prescription Duplication Consistency
*For any* prescription, when duplicated, the new draft should contain identical medications, diagnoses, and quantities as the original.
**Validates: Requirements 2.3**

### Property 6: Dispensation Quantity Validation
*For any* dispensation, the quantity of each medication dispensed should not exceed the quantity prescribed.
**Validates: Requirements 3.5**

### Property 7: Prescription Persistence
*For any* prescription created, querying the database should return the same prescription with status "draft".
**Validates: Requirements 1.5**

### Property 8: Prescription Number Uniqueness
*For any* issued prescription, the prescription number should be unique across all prescriptions.
**Validates: Requirements 1.6**

### Property 9: Audit Log Immutability
*For any* audit log entry, the entry should not be modifiable or deletable after creation.
**Validates: Requirements 7.1**

### Property 10: Patient List Pagination
*For any* patient list with more than 10 patients, pagination should display exactly 10 patients per page.
**Validates: Requirements 4.5**

### Property 11: Doctor List Filtering
*For any* doctor list filtered by specialty, all returned doctors should have the selected specialty.
**Validates: Requirements 6.3**

### Property 12: Medication Filtering by Pad Type
*For any* doctor with available pads of type X, when displaying medications, only medications requiring type X or no specific type should be shown.
**Validates: Requirements 11.4**

### Property 13: Prescription Pad Type Catalog Completeness
*For any* system initialization, all four prescription pad types (Libre/Normal, Antimicrobianos, Psicotrópicos, Estupefacientes) should exist in the database.
**Validates: Requirements 10.1**

### Property 14: Foreign Key Integrity
*For any* prescription pad, the referenced doctor and pad type should exist in their respective tables.
**Validates: Requirements 10.3**

### Property 15: Unique Constraint Enforcement
*For any* doctor, there should be at most one prescription pad per pad type with the same pad number.
**Validates: Requirements 10.4**

### Property 16: AI Suggestion Relevance
*For any* diagnosis and patient history, AI suggestions should return medications that are clinically relevant to the diagnosis.
**Validates: Requirements 1.4**

### Property 17: Drug Interaction Detection
*For any* set of medications, the system should detect and report all known interactions between them.
**Validates: Requirements 1.4**

### Property 18: Dispensation Status Update
*For any* completed dispensation, the associated prescription status should change to "dispensed".
**Validates: Requirements 3.4**

### Property 19: Prescription Search Accuracy
*For any* search term, the system should return prescriptions matching the term in prescription number or patient name.
**Validates: Requirements 3.1**

### Property 20: Audit Log Filtering
*For any* audit log filter criteria, all returned entries should match the specified criteria (date range, user, action type).
**Validates: Requirements 7.2**

---

## Error Handling

### Backend Error Handling Strategy

**HTTP Status Codes:**
- 200 OK - Successful operation
- 201 Created - Resource created
- 400 Bad Request - Validation error
- 404 Not Found - Resource not found
- 409 Conflict - Business logic violation
- 500 Internal Server Error - Unexpected error

**Error Response Format:**
```json
{
  "error": {
    "code": "INSUFFICIENT_PADS",
    "message": "Doctor does not have available prescription pads of type Antimicrobianos",
    "details": {
      "doctorId": "uuid",
      "padTypeRequired": "Antimicrobianos",
      "availableCount": 0
    }
  }
}
```

**Common Business Errors:**
- INSUFFICIENT_PADS - Doctor lacks available pads
- INVALID_PAD_TYPE - Medication requires different pad type
- EXPIRED_PAD - Prescription pad has expired
- INVALID_DISPENSATION_QUANTITY - Dispensing more than prescribed
- PRESCRIPTION_ALREADY_DISPENSED - Cannot modify dispensed prescription
- INVALID_STATUS_TRANSITION - Invalid prescription status change

### Frontend Error Handling Strategy

**User-Facing Error Messages:**
- Display error messages in toast notifications
- Highlight invalid form fields
- Provide actionable guidance (e.g., "Please purchase prescription pads before creating a new prescription")
- Log errors to console for debugging

---

## Testing Strategy

### Unit Testing

**Scope:** Individual services and repositories

**Examples:**
- PrescriptionPadsService.DecrementPadCount() - Verify count decreases by 1
- MedicationsService.ValidateMedicationPadType() - Verify validation logic
- PrescriptionsService.IssuePrescription() - Verify status transition
- DispensationService.ValidateDispensationQuantities() - Verify quantity validation

**Framework:** xUnit with Moq

### Property-Based Testing

**Framework:** fast-check (JavaScript) for frontend, QuickCheck-style for backend

**Minimum Iterations:** 100 per property

**Property Test Examples:**

```csharp
// Property 1: Prescription Pad Availability Validation
[Property]
public void PrescriptionPadAvailabilityValidation(
    Guid doctorId, 
    Guid padTypeId, 
    int availableCount)
{
    // Generate random doctor with pads
    var doctor = GenerateDoctor(doctorId);
    var pad = GeneratePrescriptionPad(doctor, padTypeId, availableCount);
    
    // Attempt to create prescription
    var result = _prescriptionService.ValidatePadAvailability(pad.PrescriptionPadId);
    
    // Property: If availableCount > 0, validation should pass
    Assert.Equal(availableCount > 0, result);
}

// Property 2: Prescription Pad Count Decrement
[Property]
public void PrescriptionPadCountDecrement(
    Guid padId, 
    int initialCount)
{
    // Generate pad with initial count
    var pad = GeneratePrescriptionPad(padId, initialCount);
    var countBefore = pad.AvailableCount;
    
    // Issue prescription
    _prescriptionService.IssuePrescription(CreatePrescriptionCommand(padId));
    
    // Verify count decreased by 1
    var padAfter = _repository.GetPrescriptionPad(padId);
    Assert.Equal(countBefore - 1, padAfter.AvailableCount);
}
```

### Integration Testing

**Scope:** API endpoints with real database

**Examples:**
- POST /api/prescription-pads - Create pad and verify in database
- POST /api/prescriptions - Create prescription and verify pad count decremented
- PATCH /api/prescriptions/{id}/cancel - Cancel prescription and verify status

**Framework:** xUnit with TestContainers (Docker)

### End-to-End Testing

**Scope:** Complete workflows from frontend to database

**Examples:**
- Create prescription pad → Create prescription → Issue prescription → Verify in database
- Create prescription → Duplicate → Verify medications copied
- Register dispensation → Verify prescription status changed

**Framework:** Selenium/Cypress for frontend, REST client for backend

---

## Deployment and DevOps

### Docker Workflow

**Build:**
```powershell
docker-compose build eprescription-api
```

**Run:**
```powershell
docker-compose up -d eprescription-api
```

**Logs:**
```powershell
docker logs -f eprescription-api
```

**Database Validation:**
```powershell
docker exec eprescription-db sqlplus eprescription_user/password@XE
```

### Database Migrations

**EF Core Migrations:**
```powershell
dotnet ef migrations add CreatePrescriptionPadTables
dotnet ef database update
```

**Seed Data:**
```sql
INSERT INTO PRESCRIPTION_PAD_TYPES VALUES (SYS_GUID(), 'Libre/Normal', 'LIBRE', 50, ...);
```

---

## References

- Requirements: `.kiro/specs/mvp-integracion-angular-react/requirements.md`
- Database Schema: `.kiro/specs/mvp-integracion-angular-react/database-schema-reference.md`
- Docker Workflow: `docker-development-workflow.md`
- API Documentation: Swagger at `http://localhost:8000/swagger`
