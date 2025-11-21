# Task 12: Comparación Base de Datos vs Código

## Análisis Crítico Antes de Implementar

Este documento compara la estructura de la base de datos (Task 2 y 3) con las entidades del código para evitar los problemas que tuvimos en el Task 11.

## 🔴 PROBLEMAS ENCONTRADOS

### 1. Configuraciones de EF Core Faltantes

**FALTA**: `DoctorConfiguration.cs`  
**FALTA**: `PharmacyConfiguration.cs`

Estas configuraciones son **CRÍTICAS** y deben crearse antes de implementar los endpoints.

### 2. Entidades Relacionadas Faltantes

**FALTA**: `PatientContact.cs` (entidad)  
**FALTA**: `PatientAllergy.cs` (entidad)  
**FALTA**: `Specialty.cs` (entidad)  
**FALTA**: `DoctorMedicalCenter.cs` (entidad)  
**FALTA**: `Inventory.cs` (entidad)  
**FALTA**: `Dispensation.cs` (entidad)

## Comparación Detallada

### PATIENTS

#### Base de Datos (SQL)
```sql
CREATE TABLE PATIENTS (
    patient_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    identification_number VARCHAR2(50) UNIQUE NOT NULL,
    first_name VARCHAR2(100) NOT NULL,
    last_name VARCHAR2(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR2(10) NOT NULL CHECK (gender IN ('M', 'F', 'Otro')),
    blood_type VARCHAR2(5) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Código (C#)
```csharp
public class Patient : BaseEntity
{
    public string IdentificationNumber { get; private set; }
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public DateTime DateOfBirth { get; private set; }
    public string Gender { get; private set; }
    public string? BloodType { get; private set; }
    
    // Navigation properties
    public virtual ICollection<PatientContact> Contacts { get; private set; }
    public virtual ICollection<PatientAllergy> Allergies { get; private set; }
}
```

#### Configuración EF Core
✅ **EXISTE**: `PatientConfiguration.cs`

**Estado**: ✅ **CORRECTO** - Mapeo coincide con BD

---

### PATIENT_CONTACTS

#### Base de Datos (SQL)
```sql
CREATE TABLE PATIENT_CONTACTS (
    contact_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    patient_id RAW(16) NOT NULL,
    contact_type VARCHAR2(20) NOT NULL CHECK (contact_type IN ('email', 'phone', 'mobile', 'address')),
    contact_value VARCHAR2(500) NOT NULL,
    is_primary NUMBER(1) DEFAULT 0 CHECK (is_primary IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES PATIENTS(patient_id) ON DELETE CASCADE
);
```

#### Código (C#)
❌ **FALTA**: Entidad `PatientContact.cs`

**Acción Requerida**: Crear entidad y configuración

---

### PATIENT_ALLERGIES

#### Base de Datos (SQL)
```sql
CREATE TABLE PATIENT_ALLERGIES (
    allergy_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    patient_id RAW(16) NOT NULL,
    allergen_type VARCHAR2(50) NOT NULL CHECK (allergen_type IN ('medication', 'food', 'environmental', 'other')),
    allergen_name VARCHAR2(200) NOT NULL,
    severity VARCHAR2(20) NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe', 'life-threatening')),
    notes CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES PATIENTS(patient_id) ON DELETE CASCADE
);
```

#### Código (C#)
❌ **FALTA**: Entidad `PatientAllergy.cs`

**Acción Requerida**: Crear entidad y configuración

---

### DOCTORS

#### Base de Datos (SQL)
```sql
CREATE TABLE DOCTORS (
    doctor_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    identification_number VARCHAR2(50) UNIQUE NOT NULL,
    first_name VARCHAR2(100) NOT NULL,
    last_name VARCHAR2(100) NOT NULL,
    specialty_id RAW(16) NOT NULL,
    license_number VARCHAR2(50) UNIQUE NOT NULL,
    email VARCHAR2(200),
    phone VARCHAR2(20),
    is_active NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (specialty_id) REFERENCES SPECIALTIES(specialty_id)
);
```

#### Código (C#)
```csharp
public class Doctor : BaseEntity
{
    public string IdentificationNumber { get; private set; }
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string MedicalLicenseNumber { get; private set; }  // ⚠️ Nombre diferente
    public Guid SpecialtyId { get; private set; }
    public string Email { get; private set; }
    public string Phone { get; private set; }
    public bool IsActive { get; private set; }
    
    // Navigation properties
    public virtual Specialty Specialty { get; private set; }
    public virtual ICollection<DoctorMedicalCenter> MedicalCenters { get; private set; }
    public virtual ICollection<Prescription> Prescriptions { get; private set; }
}
```

#### Configuración EF Core
❌ **FALTA**: `DoctorConfiguration.cs`

**Problemas**:
1. Propiedad `MedicalLicenseNumber` en código vs `license_number` en BD
2. Falta configuración de EF Core
3. Falta entidad `Specialty`
4. Falta entidad `DoctorMedicalCenter`

**Acción Requerida**: Crear configuración que mapee correctamente

---

### SPECIALTIES

#### Base de Datos (SQL)
```sql
CREATE TABLE SPECIALTIES (
    specialty_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    specialty_code VARCHAR2(20) UNIQUE NOT NULL,
    specialty_name VARCHAR2(200) NOT NULL,
    description VARCHAR2(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Código (C#)
❌ **FALTA**: Entidad `Specialty.cs`

**Acción Requerida**: Crear entidad y configuración

---

### PHARMACIES

#### Base de Datos (SQL)
```sql
CREATE TABLE PHARMACIES (
    pharmacy_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    pharmacy_name VARCHAR2(200) NOT NULL,
    license_number VARCHAR2(50) UNIQUE NOT NULL,
    address_id RAW(16),
    phone VARCHAR2(20),
    email VARCHAR2(200),
    is_active NUMBER(1) DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (address_id) REFERENCES ADDRESSES(address_id)
);
```

#### Código (C#)
```csharp
public class Pharmacy : BaseEntity
{
    public string PharmacyName { get; private set; }
    public string LicenseNumber { get; private set; }
    public Guid? AddressId { get; private set; }
    public string? Phone { get; private set; }
    public string? Email { get; private set; }
    public string? City { get; private set; }  // ⚠️ NO EXISTE EN BD
    public bool IsActive { get; private set; }
    
    // Navigation properties
    public virtual Address? Address { get; private set; }
    public virtual ICollection<Inventory> Inventory { get; private set; }
    public virtual ICollection<Dispensation> Dispensations { get; private set; }
}
```

#### Configuración EF Core
❌ **FALTA**: `PharmacyConfiguration.cs`

**Problemas**:
1. Propiedad `City` en código NO existe en BD (campo desnormalizado)
2. Falta configuración de EF Core
3. Falta entidad `Inventory`
4. Falta entidad `Dispensation`

**Acción Requerida**: Crear configuración y decidir qué hacer con `City`

---

## 📋 PLAN DE ACCIÓN ANTES DE TASK 12

### Fase 0: Crear Entidades y Configuraciones Faltantes

#### 0.1 Crear Entidades Relacionadas

1. **PatientContact.cs**
   - Mapear a tabla `PATIENT_CONTACTS`
   - Propiedades: ContactId, PatientId, ContactType, ContactValue, IsPrimary

2. **PatientAllergy.cs**
   - Mapear a tabla `PATIENT_ALLERGIES`
   - Propiedades: AllergyId, PatientId, AllergenType, AllergenName, Severity, Notes

3. **Specialty.cs**
   - Mapear a tabla `SPECIALTIES`
   - Propiedades: SpecialtyId, SpecialtyCode, SpecialtyName, Description

4. **DoctorMedicalCenter.cs** (si existe tabla)
   - Verificar si existe en BD
   - Crear entidad si es necesaria

5. **Inventory.cs** (opcional para Task 12)
   - Mapear a tabla `INVENTORY`
   - Puede posponerse para Task 13

6. **Dispensation.cs** (opcional para Task 12)
   - Mapear a tabla `DISPENSATIONS`
   - Puede posponerse para Task 13

#### 0.2 Crear Configuraciones de EF Core

1. **DoctorConfiguration.cs**
   ```csharp
   builder.Property(d => d.MedicalLicenseNumber)
       .HasColumnName("LICENSE_NUMBER")  // ⚠️ IMPORTANTE
       .HasMaxLength(50)
       .IsRequired();
   ```

2. **PharmacyConfiguration.cs**
   ```csharp
   // Ignorar City si no existe en BD
   builder.Ignore(p => p.City);
   
   // O mapear a columna si existe
   builder.Property(p => p.City)
       .HasColumnName("CITY")
       .HasMaxLength(100);
   ```

3. **PatientContactConfiguration.cs**
4. **PatientAllergyConfiguration.cs**
5. **SpecialtyConfiguration.cs**

#### 0.3 Actualizar DbContext

Agregar DbSets faltantes en `EPrescriptionDbContext.cs`:

```csharp
public DbSet<PatientContact> PatientContacts { get; set; }
public DbSet<PatientAllergy> PatientAllergies { get; set; }
public DbSet<Specialty> Specialties { get; set; }
public DbSet<DoctorMedicalCenter> DoctorMedicalCenters { get; set; }
```

#### 0.4 Verificar Repositorios

Verificar que existan interfaces y repositorios:
- `IPatientRepository` / `PatientRepository`
- `IDoctorRepository` / `DoctorRepository`
- `IPharmacyRepository` / `PharmacyRepository`

---

## ⚠️ LECCIONES DEL TASK 11

### Problema Principal
En Task 11 tuvimos problemas porque:
1. Las entidades tenían propiedades que no existían en BD
2. Las configuraciones de EF Core no mapeaban correctamente
3. Los nombres de columnas no coincidían

### Solución
Antes de implementar endpoints:
1. ✅ Verificar que TODAS las entidades existan
2. ✅ Verificar que TODAS las configuraciones existan
3. ✅ Verificar que los nombres de columnas coincidan
4. ✅ Probar queries básicas antes de implementar CRUD

---

## 🎯 RECOMENDACIÓN

**NO COMENZAR Task 12 hasta completar Fase 0**

Orden sugerido:
1. Crear todas las entidades faltantes
2. Crear todas las configuraciones faltantes
3. Compilar y verificar que no hay errores
4. Probar queries básicas en cada entidad
5. **ENTONCES** comenzar con Task 12.1

---

## 📊 Checklist de Verificación

Antes de comenzar Task 12, verificar:

- [ ] Entidad `PatientContact` creada
- [ ] Entidad `PatientAllergy` creada
- [ ] Entidad `Specialty` creada
- [ ] Configuración `DoctorConfiguration` creada
- [ ] Configuración `PharmacyConfiguration` creada
- [ ] Configuración `PatientContactConfiguration` creada
- [ ] Configuración `PatientAllergyConfiguration` creada
- [ ] Configuración `SpecialtyConfiguration` creada
- [ ] DbContext actualizado con DbSets
- [ ] Compilación exitosa
- [ ] Query básico de Patient funciona
- [ ] Query básico de Doctor funciona
- [ ] Query básico de Pharmacy funciona

---

**Fecha**: 2025-11-20  
**Estado**: ⚠️ BLOQUEADO - Completar Fase 0 primero  
**Próximo**: Crear entidades y configuraciones faltantes

