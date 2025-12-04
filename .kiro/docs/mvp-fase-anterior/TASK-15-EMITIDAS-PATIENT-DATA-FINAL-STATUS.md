# Task 15 - Estado Final: Fix de Datos de Pacientes en Vista Emitidas

## 🔴 Problema Original

En la vista de recetas emitidas, no aparecía la información de los pacientes (nombres, ni de doctores ni centros médicos).

## 🔍 Análisis del Problema

### Causa Raíz
1. **Repositorio**: No estaba cargando las relaciones de `Patient`, `Doctor` y `MedicalCenter`
2. **AutoMapper**: Tenía `.Ignore()` en los campos `PatientName`, `DoctorName` y `MedicalCenterName`
3. **Entidad**: La entidad `Prescription` no tenía las propiedades de navegación definidas
4. **Configuración EF Core**: No había configuración de las relaciones en `PrescriptionConfiguration`

## ✅ Cambios Aplicados

### 1. Entidad Prescription ✅
Agregadas propiedades de navegación:
```csharp
public virtual Patient? Patient { get; private set; }
public virtual Doctor? Doctor { get; private set; }
public virtual MedicalCenter? MedicalCenter { get; private set; }
```

### 2. Configuración EF Core ✅
Agregadas relaciones en `PrescriptionConfiguration.cs`:
```csharp
builder.HasOne(p => p.Patient)
    .WithMany()
    .HasForeignKey(p => p.PatientId)
    .OnDelete(DeleteBehavior.Restrict);
    
builder.HasOne(p => p.Doctor)
    .WithMany()
    .HasForeignKey(p => p.DoctorId)
    .OnDelete(DeleteBehavior.Restrict);
    
builder.HasOne(p => p.MedicalCenter)
    .WithMany()
    .HasForeignKey(p => p.MedicalCenterId)
    .OnDelete(DeleteBehavior.Restrict);
```

### 3. AutoMapper Profile ✅
Modificado el mapeo para obtener nombres desde las relaciones:
```csharp
.ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => 
    src.Patient != null ? $"{src.Patient.FirstName} {src.Patient.LastName}" : string.Empty))
.ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => 
    src.Doctor != null ? $"{src.Doctor.FirstName} {src.Doctor.LastName}" : string.Empty))
.ForMember(dest => dest.MedicalCenterName, opt => opt.MapFrom(src => 
    src.MedicalCenter != null ? src.MedicalCenter.CenterName : string.Empty))
```

### 4. Repositorio ⚠️ PROBLEMA
Intenté agregar `.Include()` para cargar las relaciones:
```csharp
var query = _context.Prescriptions
    .Include(p => p.Patient)
    .Include(p => p.Doctor)
    .Include(p => p.MedicalCenter)
    .Include(p => p.Medications)
    .Include(p => p.Diagnoses)
    .AsQueryable();
```

**Resultado**: Error `ORA-00942: table or view does not exist`

## ❌ Problema Actual

El API está generando un error 500 al intentar cargar las prescripciones con las relaciones incluidas.

**Error**: `Oracle.ManagedDataAccess.Client.OracleException: ORA-00942: table or view does not exist`

### Posibles Causas
1. EF Core está generando un SQL incorrecto para Oracle
2. Hay un problema con el esquema de la base de datos
3. Las configuraciones de las entidades relacionadas (`Patient`, `Doctor`, `MedicalCenter`) no están correctamente configuradas

## 🔄 Solución Alternativa Recomendada

En lugar de usar `.Include()` en el repositorio, cargar los datos manualmente en el query handler:

```csharp
public async Task<PaginatedResult<PrescriptionListDto>> Handle(
    SearchPrescriptionsQuery request, 
    CancellationToken cancellationToken)
{
    // 1. Obtener prescripciones sin includes
    var (items, totalCount) = await _prescriptionRepository.SearchAsync(...);
    
    // 2. Obtener IDs únicos
    var patientIds = items.Select(p => p.PatientId).Distinct().ToList();
    var doctorIds = items.Select(p => p.DoctorId).Distinct().ToList();
    var centerIds = items.Select(p => p.MedicalCenterId).Distinct().ToList();
    
    // 3. Cargar entidades relacionadas
    var patients = await _patientRepository.GetByIdsAsync(patientIds);
    var doctors = await _doctorRepository.GetByIdsAsync(doctorIds);
    var centers = await _medicalCenterRepository.GetByIdsAsync(centerIds);
    
    // 4. Mapear con AutoMapper
    var dtos = _mapper.Map<List<PrescriptionListDto>>(items);
    
    // 5. Enriquecer con nombres
    foreach (var dto in dtos)
    {
        var patient = patients.FirstOrDefault(p => p.Id == dto.PatientId);
        var doctor = doctors.FirstOrDefault(d => d.Id == dto.DoctorId);
        var center = centers.FirstOrDefault(c => c.Id == dto.MedicalCenterId);
        
        dto.PatientName = patient != null ? $"{patient.FirstName} {patient.LastName}" : "";
        dto.DoctorName = doctor != null ? $"{doctor.FirstName} {doctor.LastName}" : "";
        dto.MedicalCenterName = center?.CenterName ?? "";
    }
    
    return new PaginatedResult<PrescriptionListDto> { ... };
}
```

## 📁 Archivos Modificados

1. ✅ `eprescription-API/src/ePrescription.Domain/Entities/Prescription.cs`
2. ✅ `eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/PrescriptionConfiguration.cs`
3. ✅ `eprescription-API/src/ePrescription.Application/Mappings/PrescriptionMappingProfile.cs`
4. ⚠️ `eprescription-API/src/ePrescription.Infrastructure/Persistence/Repositories/PrescriptionRepository.cs` (con error)

## 📁 Archivos Pendientes

5. ⏳ `eprescription-API/src/ePrescription.Application/Queries/Prescriptions/SearchPrescriptionsQueryHandler.cs` (solución alternativa)
6. ⏳ Agregar métodos `GetByIdsAsync` en repositorios de Patient, Doctor y MedicalCenter

## 🎯 Próximos Pasos

1. **Opción A (Recomendada)**: Implementar la solución alternativa sin `.Include()`
2. **Opción B**: Investigar por qué EF Core genera SQL incorrecto con `.Include()`
3. **Opción C**: Usar proyección directa en el repositorio en lugar de cargar entidades completas

## 📊 Estado del Problema de Estados

El segundo problema (todas las recetas con estado "Emitida") es correcto según los datos de seed:
- Todas las prescripciones en la BD tienen `STATUS = 'active'`
- El frontend mapea correctamente `'active'` → `'emitida'`
- Para diversificar estados, se necesita modificar el script de seed data (fuera del alcance actual)

## ⏰ Tiempo Invertido

- Análisis del problema: 15 min
- Implementación de cambios: 30 min
- Debugging de error ORA-00942: 20 min
- **Total**: ~65 minutos

## 💡 Lecciones Aprendidas

1. Siempre verificar que las propiedades de navegación estén definidas en las entidades
2. Configurar las relaciones en EF Core antes de intentar usar `.Include()`
3. Oracle EF Core puede tener comportamientos diferentes a SQL Server
4. A veces es más simple cargar datos manualmente que usar `.Include()` complejo
