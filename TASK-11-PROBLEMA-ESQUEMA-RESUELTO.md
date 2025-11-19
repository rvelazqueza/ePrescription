# Task 11: Problema de Esquema - RESUELTO ✅

**Fecha:** 2025-11-19
**Estado:** Problema de compilación resuelto, pendiente validar endpoint

## Problema Identificado

### Error Original
```
ORA-00904: "UpdatedAt": invalid identifier
'Prescription' does not contain a definition for 'PrescriptionDiagnoses'
'Prescription' does not contain a definition for 'PrescriptionMedications'
```

### Causa Raíz
1. **Nombres de propiedades de navegación incorrectos** en las configuraciones de EF Core
   - La entidad `Prescription` tiene propiedades `Medications` y `Diagnoses`
   - Las configuraciones usaban `PrescriptionMedications` y `PrescriptionDiagnoses`

2. **Columna UpdatedAt faltante** en tablas de Oracle
   - `PRESCRIPTION_MEDICATIONS` solo tiene `CREATED_AT` (no `UPDATED_AT`)
   - `PRESCRIPTION_DIAGNOSES` solo tiene `CREATED_AT` (no `UPDATED_AT`)

3. **Método GetUserIdFromClaims() faltante** en PrescriptionsController

## Soluciones Implementadas

### 1. Corrección de Configuraciones EF Core ✅

**PrescriptionMedicationConfiguration.cs:**
```csharp
// ANTES:
builder.HasOne(pm => pm.Prescription)
    .WithMany(p => p.PrescriptionMedications)  // ❌ Incorrecto
    .HasForeignKey(pm => pm.PrescriptionId)
    .OnDelete(DeleteBehavior.Cascade);

// DESPUÉS:
builder.HasOne(pm => pm.Prescription)
    .WithMany(p => p.Medications)  // ✅ Correcto
    .HasForeignKey(pm => pm.PrescriptionId)
    .OnDelete(DeleteBehavior.Cascade);

// Ya tenía:
builder.Ignore(pm => pm.UpdatedAt);  // ✅ Correcto
```

**PrescriptionDiagnosisConfiguration.cs:**
```csharp
// ANTES:
builder.HasOne(pd => pd.Prescription)
    .WithMany(p => p.PrescriptionDiagnoses)  // ❌ Incorrecto
    .HasForeignKey(pd => pd.PrescriptionId)
    .OnDelete(DeleteBehavior.Cascade);

// DESPUÉS:
builder.HasOne(pd => pd.Prescription)
    .WithMany(p => p.Diagnoses)  // ✅ Correcto
    .HasForeignKey(pd => pd.PrescriptionId)
    .OnDelete(DeleteBehavior.Cascade);

// Ya tenía:
builder.Ignore(pd => pd.UpdatedAt);  // ✅ Correcto
```

**PrescriptionConfiguration.cs:**
```csharp
// ANTES:
builder.HasMany(p => p.PrescriptionMedications)  // ❌ Incorrecto
    .WithOne(pm => pm.Prescription)
    .HasForeignKey(pm => pm.PrescriptionId)
    .OnDelete(DeleteBehavior.Cascade);

builder.HasMany(p => p.PrescriptionDiagnoses)  // ❌ Incorrecto
    .WithOne(pd => pd.Prescription)
    .HasForeignKey(pd => pd.PrescriptionId)
    .OnDelete(DeleteBehavior.Cascade);

// DESPUÉS:
builder.HasMany(p => p.Medications)  // ✅ Correcto
    .WithOne(pm => pm.Prescription)
    .HasForeignKey(pm => pm.PrescriptionId)
    .OnDelete(DeleteBehavior.Cascade);

builder.HasMany(p => p.Diagnoses)  // ✅ Correcto
    .WithOne(pd => pd.Prescription)
    .HasForeignKey(pd => pd.PrescriptionId)
    .OnDelete(DeleteBehavior.Cascade);
```

### 2. Método GetUserIdFromClaims() Agregado ✅

**PrescriptionsController.cs:**
```csharp
private Guid GetUserIdFromClaims()
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                     ?? User.FindFirst("sub")?.Value;

    if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
    {
        _logger.LogWarning("Could not extract user ID from claims");
        return Guid.Empty;
    }

    return userId;
}
```

### 3. Compilación Exitosa ✅

```
Build succeeded.
    39 Warning(s)
    0 Error(s)
```

## Estado Actual

✅ **Compilación:** Exitosa
✅ **Docker Build:** Exitoso
✅ **API Iniciando:** Sin errores
⚠️ **Endpoint POST /api/prescriptions:** Retorna 400 Bad Request

## Problema Pendiente

El endpoint retorna 400 Bad Request pero no hay errores en los logs. Posibles causas:

1. **Validación de FluentValidation** rechazando el request
2. **Formato de IDs** - Los GUIDs de Oracle están en formato hexadecimal
3. **Campos faltantes o incorrectos** en el DTO

## IDs Reales de la Base de Datos

```
PATIENT:    4369F7709F0C0E43E063020016AC882B
DOCTOR:     4369F774BDC70E4DE063020016ACEA9D
CENTER:     4369F774BDB80E4DE063020016ACEA9D
MEDICATION: 4369F778D33E0E57E063020016ACDCD9
CIE10:      4369F75D33010E25E063020016ACA369
ROUTE:      4369A7EE05820B3CE063020016AC10FF
```

## Próximos Pasos

### 1. Investigar Error 400
- Habilitar logging detallado en el controller
- Verificar qué validación está fallando
- Revisar el formato del request body

### 2. Verificar Validadores
- Revisar `CreatePrescriptionValidator` en `PrescriptionValidators.cs`
- Verificar que todos los campos requeridos estén presentes
- Verificar rangos y formatos

### 3. Probar con Swagger
- Acceder a http://localhost:8000/swagger
- Usar la interfaz de Swagger para ver el schema esperado
- Probar directamente desde Swagger UI

### 4. Alternativa: Deshabilitar Validación Temporalmente
- Comentar la validación en el controller para aislar el problema
- Ver si el error es de validación o de otro tipo

## Archivos Modificados

1. ✅ `PrescriptionMedicationConfiguration.cs` - Corregido nombre de propiedad de navegación
2. ✅ `PrescriptionDiagnosisConfiguration.cs` - Corregido nombre de propiedad de navegación
3. ✅ `PrescriptionConfiguration.cs` - Corregido nombres de propiedades de navegación
4. ✅ `PrescriptionsController.cs` - Agregado método `GetUserIdFromClaims()`

## Comandos Útiles

### Rebuild y Reiniciar
```powershell
docker-compose build eprescription-api
docker-compose up -d eprescription-api
```

### Ver Logs
```powershell
docker logs eprescription-api --tail 50
docker logs -f eprescription-api
```

### Probar Endpoint
```powershell
.\test-task11-fixed.ps1
```

### Acceder a Swagger
```
http://localhost:8000/swagger
```

## Notas Importantes

- El `[Authorize]` está comentado en el controller, no se requiere autenticación
- El método `GetUserIdFromClaims()` retorna `Guid.Empty` si no hay usuario autenticado
- Las configuraciones de EF Core ya tienen `builder.Ignore(UpdatedAt)` para las tablas que no tienen esa columna
- El API compila y arranca sin errores

---

**Conclusión:** El problema de esquema y compilación está resuelto. El API arranca correctamente. Solo falta resolver el error 400 en el endpoint POST, que probablemente sea un problema de validación o formato de datos.
