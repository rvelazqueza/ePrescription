# Fase 1 - Tarea 1.3: Crear MedicationsService

## Fecha: 2025-12-05
## Estado: INICIANDO

---

## Objetivo

Implementar validaciones de medicamentos y talonarios en un servicio centralizado que permita:
- Obtener medicamentos por tipo de talonario
- Validar que un medicamento es compatible con un tipo de talonario
- Verificar interacciones entre medicamentos
- Obtener detalles de medicamentos

---

## Descripción de la Tarea

Crear `MedicationsService` que centralice la lógica de negocio relacionada con medicamentos, especialmente las validaciones de compatibilidad con tipos de talonarios y detección de interacciones.

---

## Métodos a Implementar

### 1. GetMedicationsByPadType(Guid padTypeId)
**Descripción:** Obtiene todos los medicamentos que pueden ser prescritos con un tipo de talonario específico.

**Parámetros:**
- `padTypeId`: ID del tipo de talonario

**Retorna:** `IEnumerable<MedicationDto>`

**Lógica:**
- Obtener el tipo de talonario
- Obtener todos los medicamentos activos
- Filtrar medicamentos que tienen `PAD_TYPE_ID` igual al tipo de talonario
- Retornar lista ordenada por nombre

**Ejemplo:**
```csharp
// Obtener medicamentos para talonario "Antimicrobianos"
var antimicrobialMeds = await _medicationsService.GetMedicationsByPadType(antimicrobialPadTypeId);
// Retorna: Amoxicilina, Azitromicina, Ciprofloxacino, etc.
```

---

### 2. ValidateMedicationPadType(Guid medicationId, Guid padTypeId)
**Descripción:** Valida que un medicamento puede ser prescrito con un tipo de talonario específico.

**Parámetros:**
- `medicationId`: ID del medicamento
- `padTypeId`: ID del tipo de talonario

**Retorna:** `bool`

**Lógica:**
- Obtener el medicamento
- Obtener el tipo de talonario
- Verificar que el medicamento tiene `PAD_TYPE_ID` igual al tipo de talonario
- Retornar true si es válido, false si no

**Ejemplo:**
```csharp
// Validar que Amoxicilina puede ser prescrita con talonario Antimicrobianos
bool isValid = await _medicationsService.ValidateMedicationPadType(amoxicillinId, antimicrobialPadTypeId);
// Retorna: true

// Validar que Amoxicilina puede ser prescrita con talonario Psicotrópicos
bool isValid = await _medicationsService.ValidateMedicationPadType(amoxicillinId, psychotropicPadTypeId);
// Retorna: false
```

---

### 3. CheckDrugInteractions(List<Guid> medicationIds)
**Descripción:** Verifica si hay interacciones entre los medicamentos en la lista.

**Parámetros:**
- `medicationIds`: Lista de IDs de medicamentos

**Retorna:** `DrugInteractionResult`

**Estructura de DrugInteractionResult:**
```csharp
public class DrugInteractionResult
{
    public bool HasInteractions { get; set; }
    public List<DrugInteraction> Interactions { get; set; }
    public string Severity { get; set; } // "none", "mild", "moderate", "severe"
    public string Recommendation { get; set; }
}

public class DrugInteraction
{
    public Guid MedicationId1 { get; set; }
    public Guid MedicationId2 { get; set; }
    public string MedicationName1 { get; set; }
    public string MedicationName2 { get; set; }
    public string Severity { get; set; }
    public string Description { get; set; }
}
```

**Lógica:**
- Obtener todos los medicamentos de la lista
- Verificar todas las combinaciones de pares de medicamentos
- Buscar interacciones conocidas en la BD o en una tabla de referencia
- Calcular la severidad máxima
- Retornar resultado con lista de interacciones

**Ejemplo:**
```csharp
// Verificar interacciones entre Amoxicilina y Warfarina
var result = await _medicationsService.CheckDrugInteractions(new List<Guid> { amoxicillinId, warfarinId });
// Retorna:
// {
//   HasInteractions: true,
//   Interactions: [
//     {
//       MedicationId1: amoxicillinId,
//       MedicationId2: warfarinId,
//       MedicationName1: "Amoxicilina",
//       MedicationName2: "Warfarina",
//       Severity: "moderate",
//       Description: "Amoxicilina puede aumentar el efecto anticoagulante de Warfarina"
//     }
//   ],
//   Severity: "moderate",
//   Recommendation: "Monitorear INR más frecuentemente"
// }
```

---

### 4. GetMedicationDetails(Guid medicationId)
**Descripción:** Obtiene detalles completos de un medicamento.

**Parámetros:**
- `medicationId`: ID del medicamento

**Retorna:** `MedicationDetailDto`

**Estructura de MedicationDetailDto:**
```csharp
public class MedicationDetailDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string ActiveIngredient { get; set; }
    public string Dosage { get; set; }
    public string AdministrationRoute { get; set; }
    public string Contraindications { get; set; }
    public string SideEffects { get; set; }
    public string Interactions { get; set; }
    public string Precautions { get; set; }
    public string PadTypeName { get; set; }
    public bool IsActive { get; set; }
}
```

**Lógica:**
- Obtener el medicamento
- Obtener el tipo de talonario asociado
- Obtener información adicional (contraindicaciones, efectos secundarios, etc.)
- Retornar DTO con todos los detalles

**Ejemplo:**
```csharp
// Obtener detalles de Amoxicilina
var details = await _medicationsService.GetMedicationDetails(amoxicillinId);
// Retorna: {
//   Id: amoxicillinId,
//   Name: "Amoxicilina",
//   ActiveIngredient: "Amoxicilina trihidratada",
//   Dosage: "500mg",
//   AdministrationRoute: "Oral",
//   Contraindications: "Alergia a penicilinas",
//   SideEffects: "Náuseas, diarrea, reacciones alérgicas",
//   Interactions: "Warfarina, Methotrexate",
//   Precautions: "Usar con cuidado en pacientes con insuficiencia renal",
//   PadTypeName: "Antimicrobianos",
//   IsActive: true
// }
```

---

## Archivos a Crear/Modificar

### Crear:
1. `eprescription-API/src/ePrescription.Application/Services/MedicationsService.cs`
2. `eprescription-API/src/ePrescription.Application/DTOs/MedicationDetailDto.cs`
3. `eprescription-API/src/ePrescription.Application/DTOs/DrugInteractionResult.cs`
4. `eprescription-API/src/ePrescription.Application/DTOs/DrugInteraction.cs`

### Modificar:
1. `eprescription-API/src/ePrescription.Application/DTOs/MedicationDto.cs` (si es necesario)

---

## Dependencias

- `IMedicationRepository` - Para acceder a medicamentos
- `IPrescriptionPadTypeRepository` - Para acceder a tipos de talonarios
- `IRepository<DrugInteraction>` - Para acceder a interacciones conocidas (si existe)
- `ILogger<MedicationsService>` - Para logging
- `IMapper` - Para mapeo de DTOs

---

## Validaciones y Errores

### Errores a Manejar:
1. **Medicamento no encontrado** → Lanzar `KeyNotFoundException`
2. **Tipo de talonario no encontrado** → Lanzar `KeyNotFoundException`
3. **Lista de medicamentos vacía** → Retornar resultado sin interacciones
4. **Medicamento inactivo** → Incluir en validación

---

## Logging

Registrar:
- Búsquedas de medicamentos por tipo de talonario
- Validaciones de compatibilidad (éxito y fallo)
- Detección de interacciones (especialmente las severas)
- Errores y excepciones

**Ejemplo:**
```csharp
_logger.LogInformation("Getting medications for pad type: {PadTypeId}", padTypeId);
_logger.LogWarning("Drug interaction detected: {Med1} + {Med2}, Severity: {Severity}", 
    med1Name, med2Name, severity);
```

---

## Estimación de Tiempo

- **Optimista:** 2 horas
- **Realista:** 3 horas
- **Pesimista:** 5 horas

**Riesgos principales:**
- Lógica de interacciones medicamentosas compleja
- Falta de datos de interacciones en BD
- Necesidad de integración con tabla de referencia

---

## Próximos Pasos

1. Crear la estructura de DTOs
2. Crear la clase MedicationsService
3. Implementar cada método
4. Probar en Swagger
5. Crear tests unitarios (opcional)

---

## Notas Importantes

- Los medicamentos deben tener un `PAD_TYPE_ID` asignado
- Las interacciones medicamentosas deben estar en una tabla de referencia
- El servicio debe ser inyectado en los handlers de comandos
- Usar logging para auditoría de validaciones

