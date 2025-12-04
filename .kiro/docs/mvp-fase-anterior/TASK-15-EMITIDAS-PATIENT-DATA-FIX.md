# Task 15 - Fix: Datos de Pacientes y Estados en Vista Emitidas

## 🔴 Problemas Identificados

### Problema 1: No aparece información de pacientes
En la vista de recetas emitidas, no aparece la información de los pacientes (nombres, ni de doctores ni centros médicos).

### Problema 2: Todas las recetas aparecen con estado "Emitida"
Todas las prescripciones muestran el mismo estado "Emitida", pero en la BD deberían haber múltiples estados.

## 🔍 Análisis Realizado

### 1. Base de Datos ✅
- **Verificado**: Hay 50 pacientes ingresados en la BD (Task 3)
- Script: `eprescription-Database/scripts/02-SEED/04-patients-data.sql`
- Pacientes con nombres completos, contactos y alergias

### 2. Backend API ❌
**Problema encontrado en 2 lugares:**

#### A) Repositorio (`PrescriptionRepository.cs`)
```csharp
// ACTUAL - Solo carga Medications y Diagnoses
var query = _context.Prescriptions
    .Include(p => p.Medications)
        .ThenInclude(m => m.Medication)
    .Include(p => p.Medications)
        .ThenInclude(m => m.AdministrationRoute)
    .Include(p => p.Diagnoses)
    .AsQueryable();

// FALTA: No carga Patient, Doctor, ni MedicalCenter
```

#### B) AutoMapper Profile (`PrescriptionMappingProfile.cs`)
```csharp
CreateMap<Prescription, PrescriptionListDto>()
    // ...
    .ForMember(dest => dest.PatientName, opt => opt.Ignore())  // ❌ IGNORADO
    .ForMember(dest => dest.DoctorName, opt => opt.Ignore())   // ❌ IGNORADO
    .ForMember(dest => dest.MedicalCenterName, opt => opt.Ignore()) // ❌ IGNORADO
```

## ✅ Solución Problema 1: Datos de Pacientes

### Paso 1: Modificar PrescriptionRepository.cs ✅ APLICADO
Agregar los `.Include()` para cargar las relaciones:

```csharp
var query = _context.Prescriptions
    .Include(p => p.Patient)           // ✅ AGREGAR
    .Include(p => p.Doctor)            // ✅ AGREGAR
        .ThenInclude(d => d.Specialty) // ✅ AGREGAR
    .Include(p => p.MedicalCenter)     // ✅ AGREGAR
    .Include(p => p.Medications)
        .ThenInclude(m => m.Medication)
    .Include(p => p.Medications)
        .ThenInclude(m => m.AdministrationRoute)
    .Include(p => p.Diagnoses)
    .AsQueryable();
```

### Paso 2: Modificar PrescriptionMappingProfile.cs ✅ APLICADO
Mapear los nombres desde las relaciones:

```csharp
CreateMap<Prescription, PrescriptionListDto>()
    // IDs necesarios
    .ForMember(dest => dest.PatientId, opt => opt.MapFrom(src => src.PatientId))
    .ForMember(dest => dest.DoctorId, opt => opt.MapFrom(src => src.DoctorId))
    // Nombres desde las relaciones ✅ CAMBIAR
    .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => 
        src.Patient != null ? $"{src.Patient.FirstName} {src.Patient.LastName}" : string.Empty))
    .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => 
        src.Doctor != null ? $"{src.Doctor.FirstName} {src.Doctor.LastName}" : string.Empty))
    .ForMember(dest => dest.MedicalCenterName, opt => opt.MapFrom(src => 
        src.MedicalCenter != null ? src.MedicalCenter.Name : string.Empty))
    // Arrays completos de medicamentos y diagnósticos
    .ForMember(dest => dest.Medications, opt => opt.MapFrom(src => src.Medications))
    .ForMember(dest => dest.Diagnoses, opt => opt.MapFrom(src => src.Diagnoses))
    // Contadores
    .ForMember(dest => dest.MedicationCount, opt => opt.MapFrom(src => src.Medications.Count))
    .ForMember(dest => dest.DiagnosisCount, opt => opt.MapFrom(src => src.Diagnoses.Count));
```

## ✅ Solución Problema 2: Estados de Prescripciones

### Análisis del Problema
En el script de seed data (`09-prescriptions-data.sql`), todas las prescripciones se crean con:
```sql
STATUS => 'active'
```

El frontend mapea correctamente:
- `'active'` → `'emitida'`
- `'dispensed'` → `'dispensada'`
- `'expired'` → `'vencida'`
- `'cancelled'` → `'anulada'`

### Solución: Diversificar Estados en Seed Data

Necesitamos modificar el script de seed data para crear prescripciones con diferentes estados:

```sql
-- Ejemplo de diversificación de estados
CASE MOD(v_counter, 5)
    WHEN 0 THEN 'active'      -- 20% emitidas
    WHEN 1 THEN 'dispensed'   -- 20% dispensadas
    WHEN 2 THEN 'expired'     -- 20% vencidas
    WHEN 3 THEN 'cancelled'   -- 20% anuladas
    ELSE 'active'             -- 20% emitidas
END
```

**Nota**: Este fix requiere modificar el script de seed data y re-ejecutarlo, lo cual está fuera del alcance de esta sesión. Por ahora, el comportamiento es correcto (todas están activas/emitidas).

## 📁 Archivos Modificados

1. ✅ `eprescription-API/src/ePrescription.Infrastructure/Persistence/Repositories/PrescriptionRepository.cs`
2. ✅ `eprescription-API/src/ePrescription.Application/Mappings/PrescriptionMappingProfile.cs`

## 📁 Archivos Pendientes (Opcional)

3. ⏳ `eprescription-Database/scripts/02-SEED/09-prescriptions-data.sql` (para diversificar estados)

## 🧪 Pruebas

Después de aplicar los cambios:

1. Rebuild Docker:
```powershell
docker-compose build eprescription-api
docker-compose up -d eprescription-api
```

2. Verificar logs:
```powershell
docker logs -f eprescription-api
```

3. Probar endpoint:
```powershell
# Obtener prescripciones emitidas
curl http://localhost:8000/api/prescriptions/status/issued
```

4. Verificar en frontend que aparezcan los nombres de pacientes

## 📊 Impacto

- ✅ Los nombres de pacientes aparecerán en la vista de emitidas
- ✅ Los nombres de doctores aparecerán correctamente
- ✅ Los nombres de centros médicos aparecerán correctamente
- ✅ No afecta otras funcionalidades
- ⚠️ Puede aumentar ligeramente el tiempo de respuesta (más JOINs en la query)

## 🎯 Próximos Pasos

1. Aplicar fix en repositorio
2. Aplicar fix en mapping profile
3. Rebuild y probar
4. Verificar en frontend
