# TASK 10 - PLAN DE CORRECCIÓN COMPLETO

**Fecha:** 2024-11-19
**Estado:** 30 ERRORES DE COMPILACIÓN

## PROBLEMA RAÍZ

El código de Task 10 usa clases que **NUNCA FUERON CREADAS**:

1. ❌ `ICD10CodeDetails` - NO EXISTE
2. ❌ `DrugInteraction` (DTO) - NO EXISTE  
3. ❌ Propiedades incorrectas en entidades existentes

## ANÁLISIS DETALLADO

### 1. ICD10CodeDetails - NO EXISTE (16 errores)

**Dónde se usa:**
- `CIE10CatalogService.cs` - líneas 83-86, 273-276, 390-393
- `IWHOApiService.cs` - retorno de `GetICD10CodeDetailAsync()`

**Qué se intenta acceder:**
- `details.Title` ❌
- `details.Definition` ❌
- `details.Chapter` ❌

**SOLUCIÓN:** Crear la clase `ICD10CodeDetails` con las propiedades correctas

### 2. PrescriptionDiagnosis.Cie10CatalogId - NO EXISTE (4 errores)

**Entidad real:**
```csharp
public class PrescriptionDiagnosis {
    public Guid PrescriptionId { get; private set; }
    public string Cie10Code { get; private set; } // ✅ ESTO existe
    public bool IsPrimary { get; private set; }
    public string? Notes { get; private set; }
}
```

**Dónde se usa incorrectamente:**
- `CIE10CatalogService.cs` - líneas 285, 344, 446

**Código incorrecto:**
```csharp
diagnosis.Cie10CatalogId // ❌ NO EXISTE
```

**SOLUCIÓN:** Cambiar a `diagnosis.Cie10Code`

### 3. LogOperationAsync - Tipo Incorrecto (3 errores)

**Firma correcta:**
```csharp
Task LogOperationAsync(
    string operation,
    string entityType,
    string entityId,  // ← Espera STRING
    ...
)
```

**Código incorrecto:**
```csharp
await _auditService.LogOperationAsync(
    "CIE10_SEARCH",
    "CIE10Catalog",
    prescriptionId,  // ← Es Guid, no string
    ...
);
```

**SOLUCIÓN:** Convertir `Guid` a `string` con `.ToString()`

### 4. AIAnalysisLog Constructor - Parámetros Incorrectos (3 errores)

**Constructor correcto:**
```csharp
public AIAnalysisLog(
    string analysisType,      // 1
    string inputData,         // 2
    string outputData,        // 3
    Guid? userId = null,      // 4
    Guid? prescriptionId = null,  // 5
    string? aiProvider = null,    // 6
    int? processingTimeMs = null, // 7
    decimal? confidenceScore = null, // 8
    bool wasAccepted = false  // 9
)
```

**Código incorrecto (líneas 99-103):**
```csharp
var log = new AIAnalysisLog(
    patientId,        // ❌ Guid? → debería ser string analysisType
    analysisType,     // ❌ string → debería ser string inputData
    inputData,        // ❌ string → debería ser string outputData
    outputData,       // ❌ string → debería ser Guid? userId
    confidenceScore   // ❌ decimal → debería ser Guid? prescriptionId
);
```

**SOLUCIÓN:** Reordenar parámetros correctamente

### 5. DrugInteraction - Ambigüedad (4 errores)

**Problema:** Existe en dos lugares:
- `EPrescription.Domain.Entities.DrugInteraction` (entidad)
- `ePrescription.Application.Interfaces.DrugInteraction` (¿DTO?)

**Dónde se usa:**
- `HuggingFaceAIService.cs` - líneas 209, 229, 234, 253

**SOLUCIÓN:** Usar namespace completo o crear alias

### 6. Patient.PatientAllergies - NO EXISTE (1 error)

**Propiedad correcta:**
```csharp
public class Patient {
    public virtual ICollection<PatientAllergy> Allergies { get; private set; }  // ✅ ESTO
}
```

**Código incorrecto (línea 295):**
```csharp
patient.PatientAllergies  // ❌ NO EXISTE
```

**SOLUCIÓN:** Cambiar a `patient.Allergies`

### 7. AIAnalysisLog.PatientId - NO EXISTE (1 error)

**Propiedades reales:**
```csharp
public class AIAnalysisLog {
    public Guid? UserId { get; private set; }  // ✅
    public Guid? PrescriptionId { get; private set; }  // ✅
    // NO HAY PatientId
}
```

**Código incorrecto (línea 377):**
```csharp
PatientId = log.PatientId  // ❌ NO EXISTE
```

**SOLUCIÓN:** Eliminar o cambiar lógica

### 8. Object Casting - Propiedades Perdidas (3 errores)

**Código incorrecto (líneas 489-492):**
```csharp
var stats = await _context.Cie10Catalog
    .GroupBy(c => c.Category)
    .Select(g => new {  // ← Tipo anónimo
        Category = g.Key,
        ...
    })
    .ToListAsync();

// Luego se intenta acceder:
stat.Category  // ❌ stat es 'object'
```

**SOLUCIÓN:** Mantener tipo anónimo o crear DTO

## PLAN DE CORRECCIÓN PASO A PASO

### PASO 1: Crear DTOs Faltantes (30 min)

#### 1.1 Crear `ICD10CodeDetails`
**Archivo:** `eprescription-API/src/ePrescription.Application/DTOs/WHOApiDtos.cs`

```csharp
public class ICD10CodeDetails
{
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Definition { get; set; } = string.Empty;
    public string Chapter { get; set; } = string.Empty;
    public string? Category { get; set; }
    public List<string> Synonyms { get; set; } = new();
    public List<string> Exclusions { get; set; } = new();
    public List<string> Inclusions { get; set; } = new();
}
```

#### 1.2 Crear `DrugInteractionDto`
**Archivo:** `eprescription-API/src/ePrescription.Application/DTOs/AIAssistantDtos.cs`

```csharp
public class DrugInteractionDto
{
    public string Drug1 { get; set; } = string.Empty;
    public string Drug2 { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Recommendation { get; set; }
}
```

### PASO 2: Corregir CIE10CatalogService.cs (1 hora)

#### 2.1 Corregir acceso a ICD10CodeDetails (16 errores)
- Líneas 83-86: Usar propiedades correctas
- Líneas 273-276: Usar propiedades correctas
- Líneas 390-393: Usar propiedades correctas

#### 2.2 Corregir PrescriptionDiagnosis (4 errores)
- Líneas 285, 344, 446: Cambiar `Cie10CatalogId` → `Cie10Code`

#### 2.3 Corregir LogOperationAsync (1 error)
- Línea 317: Agregar `.ToString()` al Guid

#### 2.4 Corregir Object Casting (3 errores)
- Líneas 489-492: Crear DTO o mantener tipo anónimo correctamente

### PASO 3: Corregir HuggingFaceAIService.cs (1 hora)

#### 3.1 Corregir AIAnalysisLog Constructor (3 errores)
- Líneas 99-103: Reordenar parámetros correctamente

#### 3.2 Corregir LogOperationAsync (2 errores)
- Líneas 115, 354: Agregar `.ToString()` al Guid

#### 3.3 Corregir DrugInteraction (4 errores)
- Líneas 209, 229, 234, 253: Usar `DrugInteractionDto` o namespace completo

#### 3.4 Corregir Patient.Allergies (1 error)
- Línea 295: Cambiar `PatientAllergies` → `Allergies`

#### 3.5 Corregir AIAnalysisLog.PatientId (1 error)
- Línea 377: Eliminar o cambiar lógica

### PASO 4: Verificar Compilación (15 min)

```powershell
cd eprescription-API
dotnet clean
dotnet build
```

**CRITERIO DE ÉXITO:** 0 errores de compilación

### PASO 5: Verificar que API Inicia (15 min)

```powershell
dotnet run --project src/ePrescription.API
```

**CRITERIO DE ÉXITO:** API inicia sin errores

## TIEMPO ESTIMADO TOTAL

- Crear DTOs: 30 min
- Corregir CIE10CatalogService: 1 hora
- Corregir HuggingFaceAIService: 1 hora
- Verificar compilación: 15 min
- Verificar API: 15 min

**TOTAL: 3 horas**

## COMPROMISO

✅ Voy a corregir TODOS los errores
✅ Voy a verificar compilación después de CADA corrección
✅ NO voy a decir "completado" hasta que `dotnet build` pase al 100%
✅ Voy a documentar cada paso

---

**Estado:** LISTO PARA INICIAR CORRECCIÓN
**Próximo paso:** Crear DTOs faltantes
