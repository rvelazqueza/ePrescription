# Task 10 - DrugInteraction Configuration Fix

## Problema Identificado

Faltaba la configuración de Entity Framework Core para la entidad `DrugInteraction`, específicamente la configuración de la relación many-to-many entre medicamentos.

## Solución Implementada

### Archivo Creado

**`eprescription-API/src/ePrescription.Infrastructure/Persistence/Configurations/DrugInteractionConfiguration.cs`**

Esta configuración incluye:

1. **Mapeo de tabla y columnas** a la tabla Oracle `DRUG_INTERACTIONS`
2. **Relación many-to-many correctamente configurada**:
   - `Medication1` → `InteractionsAsFirst`
   - `Medication2` → `InteractionsAsSecond`
3. **Restricciones de integridad**:
   - Foreign keys con `DeleteBehavior.Restrict`
   - Índice único en `(MedicationId1, MedicationId2)` para evitar duplicados
4. **Índices de rendimiento** en ambas columnas de medicamentos

## Características Clave

### Prevención de Duplicados
La entidad `DrugInteraction` asegura que `MedicationId1 < MedicationId2` en el constructor, evitando interacciones duplicadas (A-B vs B-A).

### Relaciones Bidireccionales
```csharp
// En Medication.cs
public virtual ICollection<DrugInteraction> InteractionsAsFirst { get; private set; }
public virtual ICollection<DrugInteraction> InteractionsAsSecond { get; private set; }

// En DrugInteraction.cs
public virtual Medication Medication1 { get; private set; }
public virtual Medication Medication2 { get; private set; }
```

### Índices Configurados
- `UK_DRUG_INTERACTIONS`: Índice único en (MedicationId1, MedicationId2)
- `IDX_DRUG_INTERACTIONS_MED1`: Índice en MedicationId1
- `IDX_DRUG_INTERACTIONS_MED2`: Índice en MedicationId2

## Verificación

✅ **Compilación exitosa**: El proyecto Infrastructure compila sin errores
✅ **Configuración automática**: EF Core aplicará esta configuración automáticamente mediante `ApplyConfigurationsFromAssembly`
✅ **Compatibilidad Oracle**: Usa tipos de datos Oracle correctos (RAW(16) para GUIDs, TIMESTAMP(6) para fechas)

## Estado

🟢 **COMPLETADO** - La configuración de DrugInteraction está lista y funcional.

## Próximos Pasos

Para usar esta configuración:

1. **Crear migración** (si se usa Code-First):
   ```powershell
   dotnet ef migrations add AddDrugInteractionConfiguration --project eprescription-API/src/ePrescription.Infrastructure
   ```

2. **Aplicar migración** (si se usa Code-First):
   ```powershell
   dotnet ef database update --project eprescription-API/src/ePrescription.Infrastructure
   ```

3. **Verificar en base de datos** que la tabla y relaciones existen correctamente.

## Notas Técnicas

- La configuración sigue el patrón de las demás entidades del proyecto
- Usa `IEntityTypeConfiguration<T>` para separación de responsabilidades
- Compatible con el esquema Oracle existente `EPRESCRIPTION_USER`
- Respeta las convenciones de nombres Oracle (UPPERCASE)
