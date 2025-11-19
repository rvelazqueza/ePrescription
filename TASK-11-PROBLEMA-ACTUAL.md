# Task 11: Problema Actual - EF Core Shadow Properties

**Fecha:** 2025-11-19
**Estado:** ❌ NO FUNCIONA

## 🔴 Problema Principal

EF Core está generando **shadow properties** (columnas fantasma) que no existen en la base de datos Oracle, causando errores al intentar INSERT.

### SQL Generado (INCORRECTO)
```sql
INSERT INTO "PRESCRIPTIONS" (
  "PRESCRIPTION_ID", "CREATED_AT", "DOCTOR_ID", "EXPIRATION_DATE",
  "MEDICAL_CENTER_ID", "NOTES", 
  "PATIENT_ID1",  -- ❌ NO EXISTE EN BD
  "PATIENT_ID",   -- ✅ EXISTE
  "PRESCRIPTION_DATE", "PRESCRIPTION_NUMBER", "STATUS", "UPDATED_AT"
)

INSERT INTO "PRESCRIPTION_DIAGNOSES" (
  "DIAGNOSIS_ID", 
  "Cie10CatalogId",  -- ❌ NO EXISTE EN BD
  "CIE10_CODE",      -- ✅ EXISTE
  "CREATED_AT", "IS_PRIMARY", "NOTES", "PRESCRIPTION_ID"
)
```

### Estructura Real de la BD (Task 2 y 3)
```sql
-- PRESCRIPTIONS
PRESCRIPTION_ID      RAW(16)
PATIENT_ID           RAW(16)  -- Solo esta columna existe
DOCTOR_ID            RAW(16)
MEDICAL_CENTER_ID    RAW(16)
...

-- PRESCRIPTION_DIAGNOSES  
DIAGNOSIS_ID         RAW(16)
CIE10_CODE           VARCHAR2(10)  -- Solo esta columna existe (es string, no FK)
PRESCRIPTION_ID      RAW(16)
...
```

## 🔍 Causa Raíz

EF Core está detectando propiedades de navegación en las entidades del dominio y creando automáticamente shadow properties para las FK:

**En `Prescription.cs`:**
```csharp
public virtual Patient Patient { get; private set; } = null!;  
// EF Core crea "PATIENT_ID1" como shadow property
```

**En `PrescriptionDiagnosis.cs`:**
```csharp
// No hay propiedad de navegación a Cie10Catalog
// Pero EF Core detecta "Cie10Code" y asume que debe haber una relación
```

## 🛠️ Intentos de Solución

### 1. ✅ Agregar `[NotMapped]` a las entidades
```csharp
[System.ComponentModel.DataAnnotations.Schema.NotMapped]
public virtual Patient Patient { get; private set; } = null!;
```
**Resultado:** Compiló pero sigue generando shadow properties

### 2. ✅ Usar `builder.Ignore()` en configuraciones
```csharp
builder.Ignore(p => p.Patient);
builder.Ignore(p => p.Doctor);
```
**Resultado:** Sigue generando shadow properties

### 3. ✅ Mover `Ignore` al principio de configuraciones
**Resultado:** Sin cambio

### 4. ❌ Eliminar shadow properties en `OnModelCreating`
```csharp
foreach (var property in entityType.GetProperties())
{
    if (property.IsShadowProperty())
        entityType.RemoveProperty(property.Name);
}
```
**Resultado:** Crashea el API al iniciar

## 📋 Archivos Modificados

1. `Prescription.cs` - Agregado `[NotMapped]` a Patient, Doctor, MedicalCenter, Dispensations
2. `PrescriptionMedication.cs` - Agregado `[NotMapped]` a Medication, AdministrationRoute, DispensationItems
3. `PrescriptionConfiguration.cs` - Removidos `Ignore` (confiando en `[NotMapped]`)
4. `PrescriptionMedicationConfiguration.cs` - Removidos `Ignore`

## 🎯 Soluciones Posibles

### Opción A: Eliminar propiedades de navegación del dominio
Remover completamente las propiedades `Patient`, `Doctor`, `MedicalCenter`, etc. de las entidades.

**Pros:**
- Solución definitiva
- Mantiene el dominio limpio

**Contras:**
- Modifica las entidades del dominio
- Puede afectar otros usos de las entidades

### Opción B: Configurar explícitamente TODAS las relaciones
Configurar cada FK explícitamente sin navegación:

```csharp
builder.Property(p => p.PatientId)
    .HasColumnName("PATIENT_ID")
    .IsRequired();
// NO configurar HasOne/WithMany para Patient
```

### Opción C: Deshabilitar convenciones de EF Core
Deshabilitar la detección automática de relaciones en el DbContext.

### Opción D: Usar Fluent API más explícita
Configurar que las FK NO tienen navegación:

```csharp
modelBuilder.Entity<Prescription>()
    .HasOne<Patient>()  // Sin propiedad de navegación
    .WithMany()
    .HasForeignKey(p => p.PatientId)
    .HasConstraintName("FK_PRESCRIPTIONS_PATIENTS");
```

## 📊 Estado de Scripts Task 2 y 3

Los scripts de seed data SÍ funcionaron porque:
- Insertan directamente con SQL
- No pasan por EF Core
- Usan los nombres de columnas correctos

**Ejemplo del script que funciona:**
```sql
INSERT INTO PRESCRIPTION_DIAGNOSES (
  PRESCRIPTION_ID, 
  CIE10_CODE,  -- String directo, no FK
  IS_PRIMARY, 
  NOTES
) VALUES (
  v_prescription_id, 
  'I10',  -- Código CIE-10 como string
  1, 
  'Hipertensión arterial esencial'
);
```

## 🔄 Próximos Pasos Recomendados

1. **Revisar si hay otras entidades con el mismo problema**
2. **Decidir estrategia:** ¿Eliminar navegaciones o configurar explícitamente?
3. **Implementar solución elegida**
4. **Probar con un caso simple primero**
5. **Verificar que el SQL generado sea correcto**

## 💡 Nota Importante

El problema NO es con la base de datos ni con los scripts. La base de datos está correcta. El problema es SOLO con cómo EF Core está mapeando las entidades.

---

**Siguiente acción:** Decidir cuál de las opciones A, B, C o D implementar.
