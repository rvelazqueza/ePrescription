# Task 11 - Plan de Regeneración de EF Core

## Problema Actual

Las configuraciones de EF Core no coinciden con el esquema real de Oracle, causando errores de shadow properties (`PATIENT_ID1`, `Cie10CatalogId`).

## Esquema Real de Oracle (Tasks 2 y 3)

### PRESCRIPTIONS
```sql
CREATE TABLE PRESCRIPTIONS (
    prescription_id RAW(16) PRIMARY KEY,
    prescription_number VARCHAR2(50) UNIQUE NOT NULL,
    patient_id RAW(16) NOT NULL,  -- FK a PATIENTS
    doctor_id RAW(16) NOT NULL,   -- FK a DOCTORS
    medical_center_id RAW(16) NOT NULL,  -- FK a MEDICAL_CENTERS
    prescription_date TIMESTAMP NOT NULL,
    expiration_date TIMESTAMP NOT NULL,
    status VARCHAR2(20) DEFAULT 'draft' NOT NULL,
    notes CLOB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### PRESCRIPTION_DIAGNOSES
```sql
CREATE TABLE PRESCRIPTION_DIAGNOSES (
    prescription_diagnosis_id RAW(16) PRIMARY KEY,
    prescription_id RAW(16) NOT NULL,  -- FK a PRESCRIPTIONS
    cie10_id RAW(16) NOT NULL,  -- FK a CIE10_CATALOG
    diagnosis_code VARCHAR2(10) NOT NULL,  -- Desnormalizado
    diagnosis_description VARCHAR2(500) NOT NULL,  -- Desnormalizado
    is_primary NUMBER(1) DEFAULT 0,
    ai_suggested NUMBER(1) DEFAULT 0,
    ai_confidence_score NUMBER(5,4),
    created_at TIMESTAMP
);
```

### PRESCRIPTION_MEDICATIONS
```sql
CREATE TABLE PRESCRIPTION_MEDICATIONS (
    prescription_medication_id RAW(16) PRIMARY KEY,
    prescription_id RAW(16) NOT NULL,  -- FK a PRESCRIPTIONS
    medication_id RAW(16) NOT NULL,  -- FK a MEDICATIONS
    dosage VARCHAR2(100) NOT NULL,
    frequency VARCHAR2(100) NOT NULL,
    duration_days NUMBER(5) NOT NULL,
    administration_route_id RAW(16) NOT NULL,  -- FK a ADMINISTRATION_ROUTES
    quantity NUMBER(10,2) NOT NULL,
    instructions CLOB,
    ai_suggested NUMBER(1) DEFAULT 0,
    created_at TIMESTAMP
);
```

## Problemas Identificados

1. **PrescriptionDiagnosis**: 
   - ❌ Entidad actual solo tiene `Cie10Code` (string)
   - ✅ Esquema real tiene `cie10_id` (FK) + `diagnosis_code` + `diagnosis_description`

2. **Patient.Prescriptions**:
   - ❌ Navegación causa shadow property `PATIENT_ID1`
   - ✅ Solución: Eliminar navegación

3. **Cie10Catalog.PrescriptionDiagnoses**:
   - ❌ Navegación causa shadow property `Cie10CatalogId`
   - ✅ Solución: Eliminar navegación

## Plan de Corrección

### 1. Actualizar Entidad PrescriptionDiagnosis
```csharp
public class PrescriptionDiagnosis : BaseEntity
{
    public Guid PrescriptionId { get; private set; }
    public Guid Cie10Id { get; private set; }  // ✅ AGREGAR
    public string DiagnosisCode { get; private set; } = string.Empty;  // ✅ RENOMBRAR
    public string DiagnosisDescription { get; private set; } = string.Empty;  // ✅ AGREGAR
    public bool IsPrimary { get; private set; }
    public bool AiSuggested { get; private set; }  // ✅ AGREGAR
    public decimal? AiConfidenceScore { get; private set; }  // ✅ AGREGAR
    
    // Navigation
    public virtual Prescription Prescription { get; private set; } = null!;
    // NO navigation to Cie10Catalog to avoid shadow properties
}
```

### 2. Actualizar Configuración PrescriptionDiagnosisConfiguration
```csharp
builder.Property(pd => pd.Cie10Id)
    .HasColumnName("CIE10_ID")
    .HasColumnType("RAW(16)")
    .IsRequired();

builder.Property(pd => pd.DiagnosisCode)
    .HasColumnName("DIAGNOSIS_CODE")
    .HasMaxLength(10)
    .IsRequired();

builder.Property(pd => pd.DiagnosisDescription)
    .HasColumnName("DIAGNOSIS_DESCRIPTION")
    .HasMaxLength(500)
    .IsRequired();

builder.Property(pd => pd.AiSuggested)
    .HasColumnName("AI_SUGGESTED")
    .HasDefaultValue(false);

builder.Property(pd => pd.AiConfidenceScore)
    .HasColumnName("AI_CONFIDENCE_SCORE")
    .HasColumnType("NUMBER(5,4)");

// NO configurar relación con Cie10Catalog
```

### 3. Actualizar Entidad PrescriptionMedication
```csharp
public class PrescriptionMedication : BaseEntity
{
    public Guid PrescriptionId { get; private set; }
    public Guid MedicationId { get; private set; }
    public string Dosage { get; private set; } = string.Empty;
    public string Frequency { get; private set; } = string.Empty;
    public int DurationDays { get; private set; }
    public Guid AdministrationRouteId { get; private set; }
    public decimal Quantity { get; private set; }
    public string? Instructions { get; private set; }
    public bool AiSuggested { get; private set; }
    
    // Navigation
    public virtual Prescription Prescription { get; private set; } = null!;
    // NO navigation to Medication or AdministrationRoute
}
```

### 4. Eliminar Navegaciones Problemáticas
- ❌ Patient.Prescriptions
- ❌ Cie10Catalog.PrescriptionDiagnoses
- ❌ Doctor.Prescriptions (si existe)
- ❌ MedicalCenter.Prescriptions (si existe)

### 5. Actualizar DTOs y Handlers
- Actualizar `CreatePrescriptionDiagnosisDto` para incluir `Cie10Id`
- Actualizar handlers para buscar el `Cie10Id` basándose en el código
- Actualizar mappers

## Beneficios

1. ✅ Coincide 100% con el esquema de Oracle
2. ✅ Elimina todos los shadow properties
3. ✅ Más fácil de mantener
4. ✅ Mejor performance (datos desnormalizados)
5. ✅ Soporte completo para AI suggestions

## Próximos Pasos

1. Actualizar entidades
2. Actualizar configuraciones
3. Actualizar DTOs
4. Actualizar handlers
5. Rebuild Docker
6. Probar endpoints
