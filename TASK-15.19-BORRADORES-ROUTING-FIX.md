# Task 15.19 - Borradores Routing Fix

## Problema Identificado

El frontend estaba recibiendo error 400 al intentar buscar borradores:
```
GET /api/prescriptions/search?status=draft
Error: The value 'search' is not valid
```

## Causa Raíz

Había DOS problemas:

### 1. Routing Order Issue
El endpoint `[HttpGet("{id}")]` estaba definido ANTES que `[HttpGet("search")]` en el controller. ASP.NET Core procesa las rutas en orden, por lo que intentaba matchear "search" como un GUID para el endpoint `{id}`.

### 2. Validation Issue
El validador `SearchPrescriptionsValidator` no incluía "draft" como un status válido. Solo aceptaba: active, dispensed, expired, cancelled.

## Solución Implementada

### 1. Reordenamiento de Endpoints en PrescriptionsController.cs

Movimos todos los endpoints específicos ANTES del endpoint genérico `{id}`:

**Orden correcto:**
1. `[HttpGet("search")]` - Más específico
2. `[HttpGet("patient/{patientId}")]` - Más específico
3. `[HttpGet("doctor/{doctorId}")]` - Más específico
4. `[HttpGet("status/{status}")]` - Más específico
5. `[HttpGet("{id}")]` - Genérico (debe ir al final)

### 2. Actualización de Validadores

Agregamos "draft" a la lista de status válidos en:

**SearchPrescriptionsValidator:**
```csharp
RuleFor(x => x.Status)
    .Must(status => string.IsNullOrEmpty(status) || 
                  new[] { "draft", "active", "dispensed", "expired", "cancelled" }.Contains(status))
    .WithMessage("Status must be one of: draft, active, dispensed, expired, cancelled");
```

**UpdatePrescriptionValidator:**
```csharp
RuleFor(x => x.Status)
    .Must(status => string.IsNullOrEmpty(status) || 
                  new[] { "draft", "active", "dispensed", "expired", "cancelled" }.Contains(status))
    .WithMessage("Status must be one of: draft, active, dispensed, expired, cancelled");
```

## Archivos Modificados

1. `eprescription-API/src/ePrescription.API/Controllers/PrescriptionsController.cs`
   - Reordenamiento de métodos para priorizar rutas específicas

2. `eprescription-API/src/ePrescription.Application/Validators/PrescriptionValidators.cs`
   - Agregado "draft" a SearchPrescriptionsValidator
   - Agregado "draft" a UpdatePrescriptionValidator

## Pruebas Realizadas

### Test 1: Endpoint sin autenticación
```powershell
GET http://localhost:8000/api/prescriptions/search?status=draft
```

**Resultado:** ✅ Success
```json
{
    "items": [],
    "totalCount": 0,
    "page": 1,
    "pageSize": 10,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
}
```

## Estado Actual

✅ El endpoint GET /api/prescriptions/search?status=draft funciona correctamente
✅ El routing está corregido
✅ La validación acepta "draft" como status válido
✅ El API está compilado y desplegado en Docker

## Próximos Pasos

1. Probar desde el frontend Angular para confirmar que la integración funciona
2. Verificar que otros status también funcionan correctamente
3. Continuar con la eliminación de mock data en otros componentes

## Notas Técnicas

### Lección Aprendida: Routing Order
En ASP.NET Core, el orden de los endpoints importa. Las rutas más específicas deben definirse ANTES que las genéricas para evitar conflictos de matching.

**Incorrecto:**
```csharp
[HttpGet("{id}")]  // Genérico primero
[HttpGet("search")] // Específico después - nunca se alcanza
```

**Correcto:**
```csharp
[HttpGet("search")] // Específico primero
[HttpGet("{id}")]   // Genérico después
```

### Status Válidos
Los status de prescripción ahora incluyen:
- `draft` - Borrador (nuevo)
- `active` - Activa
- `dispensed` - Dispensada
- `expired` - Expirada
- `cancelled` - Cancelada
