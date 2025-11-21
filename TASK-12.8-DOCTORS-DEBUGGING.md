# Task 12.8 - Doctors API Debugging

## Problema Encontrado

El endpoint POST /api/doctors retorna 400 Bad Request.

## Análisis de Discrepancias

### 1. Estructura de Base de Datos (Task 2 - DDL)

Tabla DOCTORS en Oracle:
```sql
CREATE TABLE DOCTORS (
    doctor_id RAW(16) DEFAULT SYS_GUID() PRIMARY KEY,
    identification_number VARCHAR2(50) UNIQUE NOT NULL,  -- ✅ Campo requerido
    first_name VARCHAR2(100) NOT NULL,
    last_name VARCHAR2(100) NOT NULL,
    specialty_id RAW(16) NOT NULL,
    license_number VARCHAR2(50) UNIQUE NOT NULL,         -- ✅ Campo requerido
    email VARCHAR2(200),
    phone VARCHAR2(20),
    is_active NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Entidad C# (Domain)

```csharp
public class Doctor : BaseEntity
{
    public string IdentificationNumber { get; private set; }      // ✅ Existe
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string MedicalLicenseNumber { get; private set; }      // ⚠️ Nombre diferente!
    public Guid SpecialtyId { get; private set; }
    public string Email { get; private set; }
    public string Phone { get; private set; }
    public bool IsActive { get; private set; }
}
```

### 3. DTO (Application)

```csharp
public class CreateDoctorDto
{
    public string IdentificationNumber { get; set; }              // ✅ Correcto
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string MedicalLicenseNumber { get; set; }              // ✅ Correcto
    public Guid SpecialtyId { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
}
```

### 4. Script de Prueba (INCORRECTO)

```powershell
$doctorBody = @{
    licenseNumber="DOC-TEST-$randomNum"          # ❌ INCORRECTO - debe ser medicalLicenseNumber
    firstName="Dr. Juan"                          # ✅ Correcto
    lastName="Perez"                              # ✅ Correcto
    specialtyId="1"                               # ✅ Correcto
    phone="+506-8888-9999"                        # ✅ Correcto
    email="dr.juan@hospital.com"                  # ✅ Correcto
    # ❌ FALTA: identificationNumber
}
```

## Problemas Identificados

### Problema 1: Campo `licenseNumber` vs `medicalLicenseNumber`
- **Script envía:** `licenseNumber`
- **API espera:** `medicalLicenseNumber`
- **Resultado:** Validación falla porque `medicalLicenseNumber` está vacío

### Problema 2: Falta campo `identificationNumber`
- **Script NO envía:** `identificationNumber`
- **API requiere:** `identificationNumber` (campo obligatorio)
- **Resultado:** Validación falla

### Problema 3: Validación de formato
El validador requiere:
- `IdentificationNumber`: Solo mayúsculas, números y guiones (`^[A-Z0-9-]+$`)
- `MedicalLicenseNumber`: Solo mayúsculas, números y guiones (`^[A-Z0-9-]+$`)
- `FirstName/LastName`: Solo letras y espacios (incluyendo acentos)
- `Email`: Formato de email válido
- `Phone`: Números, espacios y símbolos telefónicos

## Comparación con Pharmacies (Funcional)

### Pharmacies DTO:
```csharp
public class CreatePharmacyDto
{
    public string LicenseNumber { get; set; }    // ✅ Nombre simple
    public string Name { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string ZipCode { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }
}
```

### Pharmacies Script (Funcional):
```powershell
$pharmBody = @{
    licenseNumber="PHARM-TEST-$randomNum"        # ✅ Coincide con DTO
    name="Farmacia Test"
    address="123 Main St"
    city="San Jose"
    state="San Jose"
    zipCode="10101"
    phone="+506-2222-3333"
    email="info@farmacia.com"
}
```

**Diferencia clave:** Pharmacies usa `LicenseNumber` (simple), Doctors usa `MedicalLicenseNumber` (compuesto).

## Solución

### Opción 1: Corregir el Script de Prueba (RECOMENDADO)
Actualizar el script para enviar los campos correctos:

```powershell
$doctorBody = @{
    identificationNumber="ID-$randomNum"          # ✅ Agregar
    firstName="Dr. Juan"
    lastName="Perez"
    medicalLicenseNumber="DOC-TEST-$randomNum"    # ✅ Corregir nombre
    specialtyId="1"
    phone="+506-8888-9999"
    email="dr.juan@hospital.com"
}
```

### Opción 2: Cambiar el DTO (NO RECOMENDADO)
Cambiar `MedicalLicenseNumber` a `LicenseNumber` en el DTO, pero esto requeriría:
- Cambiar el DTO
- Cambiar el Command
- Cambiar el CommandHandler
- Cambiar la entidad Domain
- Cambiar la configuración EF Core
- Cambiar el mapping profile

## Configuración EF Core

Verificar que DoctorConfiguration mapea correctamente:

```csharp
builder.Property(d => d.MedicalLicenseNumber)
    .HasColumnName("LICENSE_NUMBER")  // ✅ Debe mapear a LICENSE_NUMBER en DB
    .HasMaxLength(50)
    .IsRequired();

builder.Property(d => d.IdentificationNumber)
    .HasColumnName("IDENTIFICATION_NUMBER")  // ✅ Debe mapear a IDENTIFICATION_NUMBER en DB
    .HasMaxLength(50)
    .IsRequired();
```

## Acción Requerida

1. ✅ Corregir script de prueba para usar campos correctos
2. ✅ Verificar DoctorConfiguration mapea correctamente
3. ✅ Re-ejecutar pruebas
4. ✅ Documentar diferencias entre Doctors y Pharmacies para consistencia futura

## Lección Aprendida

**Consistencia en nombres de campos:**
- Pharmacies: `LicenseNumber` (simple)
- Doctors: `MedicalLicenseNumber` (descriptivo)
- Patients: `IdentificationNumber` (descriptivo)

Considerar estandarizar nombres en futuras iteraciones para evitar confusión.
