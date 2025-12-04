# Task 15 - Resumen de Correcciones al Backend

## 🎯 Problema Identificado

El backend está devolviendo un DTO simplificado (`PrescriptionListDto`) que **NO incluye**:
- ❌ `patientId` - Solo devuelve `patientName` (vacío)
- ❌ `doctorId` - Solo devuelve `doctorName` (vacío)
- ❌ `medications` - Solo devuelve `medicationCount` (0)
- ❌ `diagnoses` - Solo devuelve `diagnosisCount` (0)

## ✅ Correcciones Aplicadas

### 1. Actualizado `PrescriptionListDto.cs`
**Archivo**: `eprescription-API/src/ePrescription.Application/DTOs/PrescriptionDtos.cs`

**Agregado**:
```csharp
public Guid PatientId { get; set; }
public Guid DoctorId { get; set; }
public List<PrescriptionMedicationDto> Medications { get; set; } = new();
public List<PrescriptionDiagnosisDto> Diagnoses { get; set; } = new();
public DateTime? UpdatedAt { get; set; }
```

### 2. Actualizado AutoMapper Profile
**Archivo**: `eprescription-API/src/ePrescription.Application/Mappings/PrescriptionMappingProfile.cs`

**Agregado mapeo**:
```csharp
.ForMember(dest => dest.PatientId, opt => opt.MapFrom(src => src.PatientId))
.ForMember(dest => dest.DoctorId, opt => opt.MapFrom(src => src.DoctorId))
.ForMember(dest => dest.Medications, opt => opt.MapFrom(src => src.Medications))
.ForMember(dest => dest.Diagnoses, opt => opt.MapFrom(src => src.Diagnoses))
```

### 3. Actualizado Repository para Incluir Relaciones
**Archivo**: `eprescription-API/src/ePrescription.Infrastructure/Persistence/Repositories/PrescriptionRepository.cs`

**Agregado `.Include()`**:
```csharp
var query = _context.Prescriptions
    .Include(p => p.Medications)
        .ThenInclude(m => m.Medication)
    .Include(p => p.Medications)
        .ThenInclude(m => m.AdministrationRoute)
    .Include(p => p.Diagnoses)
    .AsQueryable();
```

### 4. Recompilado y Reiniciado Docker
```powershell
docker-compose build eprescription-api
docker-compose restart eprescription-api
```

## ⚠️ Problema Actual

Después de las correcciones, el endpoint **TODAVÍA** devuelve el mismo DTO sin los campos nuevos.

### Posibles Causas:

1. **AutoMapper no está mapeando correctamente**
   - Los campos `Medications` y `Diagnoses` podrían estar vacíos en la BD
   - El mapeo podría tener un problema de configuración

2. **Serialización JSON**
   - Los campos podrían estar siendo omitidos por el serializador JSON
   - Configuración de `JsonIgnore` o similar

3. **Datos vacíos en la Base de Datos**
   - Las prescripciones podrían no tener `PatientId`, `Medications`, o `Diagnoses` asignados
   - Los datos de prueba están incompletos

## 🔍 Próximos Pasos para Diagnosticar

### Paso 1: Verificar si hay datos en la BD

```sql
-- Verificar una prescripción específica
SELECT * FROM PRESCRIPTIONS WHERE ID = HEXTORAW('6A306A43CEC97710E063020016AC555E');

-- Verificar si tiene PatientId
SELECT PATIENT_ID FROM PRESCRIPTIONS WHERE ID = HEXTORAW('6A306A43CEC97710E063020016AC555E');

-- Verificar si tiene medicamentos
SELECT * FROM PRESCRIPTION_MEDICATIONS WHERE PRESCRIPTION_ID = HEXTORAW('6A306A43CEC97710E063020016AC555E');

-- Verificar si tiene diagnósticos
SELECT * FROM PRESCRIPTION_DIAGNOSES WHERE PRESCRIPTION_ID = HEXTORAW('6A306A43CEC97710E063020016AC555E');
```

### Paso 2: Agregar Logs de Debugging en el Backend

Agregar logs en `SearchPrescriptionsQueryHandler.cs`:

```csharp
public async Task<PaginatedResult<PrescriptionListDto>> Handle(...)
{
    var (items, totalCount) = await _prescriptionRepository.SearchAsync(...);
    
    // DEBUG: Log lo que devuelve el repositorio
    _logger.LogInformation("Repository returned {Count} items", items.Count());
    if (items.Any())
    {
        var first = items.First();
        _logger.LogInformation("First item - PatientId: {PatientId}, Medications: {MedCount}, Diagnoses: {DiagCount}",
            first.PatientId, first.Medications?.Count ?? 0, first.Diagnoses?.Count ?? 0);
    }
    
    var dtos = _mapper.Map<List<PrescriptionListDto>>(items);
    
    // DEBUG: Log lo que devuelve AutoMapper
    _logger.LogInformation("Mapped to {Count} DTOs", dtos.Count);
    if (dtos.Any())
    {
        var firstDto = dtos.First();
        _logger.LogInformation("First DTO - PatientId: {PatientId}, Medications: {MedCount}, Diagnoses: {DiagCount}",
            firstDto.PatientId, firstDto.Medications?.Count ?? 0, firstDto.Diagnoses?.Count ?? 0);
    }
    
    return result;
}
```

### Paso 3: Verificar Configuración de JSON

En `Program.cs`, verificar la configuración del serializador:

```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.Never;
        // Asegurar que no se ignoren propiedades null o vacías
    });
```

## 💡 Solución Temporal

Mientras investigamos, podemos usar el endpoint de detalle individual para cada prescripción:

```
GET /api/prescriptions/{id}
```

Este endpoint probablemente devuelve el DTO completo (`PrescriptionDto`) en lugar del simplificado.

## 📝 Archivos Modificados

1. `eprescription-API/src/ePrescription.Application/DTOs/PrescriptionDtos.cs`
2. `eprescription-API/src/ePrescription.Application/Mappings/PrescriptionMappingProfile.cs`
3. `eprescription-API/src/ePrescription.Infrastructure/Persistence/Repositories/PrescriptionRepository.cs`

## ⏭️ Siguiente Acción Recomendada

**Verificar la base de datos** para confirmar si las prescripciones tienen datos:

```powershell
# Conectar a Oracle y ejecutar queries de verificación
docker exec -it eprescription-oracle sqlplus system/oracle@//localhost:1521/XEPDB1
```

O crear datos de prueba completos con:
- PatientId válido
- Al menos 1 medicamento
- Al menos 1 diagnóstico

