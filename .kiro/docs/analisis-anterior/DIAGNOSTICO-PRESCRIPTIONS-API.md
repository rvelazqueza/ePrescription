# Diagnóstico: API de Prescripciones

## Problema Reportado

El usuario reportó que el endpoint `/api/prescriptions/status/Active` retorna una lista vacía, pero al hacer un SELECT directo en Oracle hay 30 prescripciones con status "active".

## Investigación Realizada

### 1. Verificación de Base de Datos ✅

```sql
SELECT COUNT(*) FROM PRESCRIPTIONS;
-- Resultado: 30 prescripciones

SELECT STATUS, COUNT(*) FROM PRESCRIPTIONS GROUP BY STATUS;
-- Resultado: 30 prescripciones con status "active" (minúsculas)
```

**Conclusión**: Los datos SÍ existen en la base de datos.

### 2. Verificación de Autenticación ✅

- Tokens JWT se obtienen correctamente
- El API responde a peticiones autenticadas
- El endpoint retorna 200 OK (no hay error de autenticación)

**Conclusión**: La autenticación funciona correctamente.

### 3. Análisis del Código ⚠️

#### SearchPrescriptionsQueryHandler.cs
```csharp
public async Task<PaginatedResult<PrescriptionListDto>> Handle(
    SearchPrescriptionsQuery request, 
    CancellationToken cancellationToken)
{
    _logger.LogInformation("Searching prescriptions - returning empty result for now");

    // Simplified implementation - return empty result
    var result = new PaginatedResult<PrescriptionListDto>
    {
        Items = new List<PrescriptionListDto>(),
        TotalCount = 0,
        Page = request.SearchCriteria.Page,
        PageSize = request.SearchCriteria.PageSize
    };

    return result;
}
```

**Problema Encontrado**: El handler está implementado como un stub que SIEMPRE retorna una lista vacía, sin importar los filtros o datos en la BD.

#### PrescriptionRepository.cs
El repositorio no tiene métodos de búsqueda/filtrado implementados. Solo tiene:
- `GetByIdAsync` - Obtener por ID específico
- `AddAsync` - Crear
- `UpdateAsync` - Actualizar
- `DeleteAsync` - Eliminar

**Problema Encontrado**: No hay método para buscar/filtrar prescripciones.

## Causa Raíz

El **Task 11** implementó las operaciones CRUD básicas pero dejó la funcionalidad de búsqueda/filtrado como un stub (implementación temporal). Los endpoints que dependen de búsqueda siempre retornan listas vacías:

- `GET /api/prescriptions/status/{status}` ❌
- `GET /api/prescriptions/patient/{patientId}` ❌
- `GET /api/prescriptions/doctor/{doctorId}` ❌
- `POST /api/prescriptions/search` ❌

## Endpoints que SÍ Funcionan

- `POST /api/prescriptions` ✅ - Crear prescripción
- `GET /api/prescriptions/{id}` ✅ - Obtener por ID específico
- `PUT /api/prescriptions/{id}` ✅ - Actualizar
- `DELETE /api/prescriptions/{id}` ✅ - Eliminar (soft delete)

## Solución Requerida

Para que los endpoints de búsqueda funcionen, se necesita:

### 1. Implementar método de búsqueda en el repositorio

```csharp
// En IPrescriptionRepository
Task<(IEnumerable<Prescription> Items, int TotalCount)> SearchAsync(
    Guid? patientId = null,
    Guid? doctorId = null,
    string? status = null,
    DateTime? startDate = null,
    DateTime? endDate = null,
    int page = 1,
    int pageSize = 10,
    CancellationToken cancellationToken = default);
```

### 2. Implementar el método en PrescriptionRepository

```csharp
public async Task<(IEnumerable<Prescription> Items, int TotalCount)> SearchAsync(...)
{
    var query = _context.Prescriptions
        .Include(p => p.Medications)
        .Include(p => p.Diagnoses)
        .AsQueryable();

    // Aplicar filtros
    if (patientId.HasValue)
        query = query.Where(p => p.PatientId == patientId.Value);
    
    if (doctorId.HasValue)
        query = query.Where(p => p.DoctorId == doctorId.Value);
    
    if (!string.IsNullOrEmpty(status))
        query = query.Where(p => p.Status.ToLower() == status.ToLower());
    
    // ... más filtros
    
    var totalCount = await query.CountAsync(cancellationToken);
    
    var items = await query
        .OrderByDescending(p => p.CreatedAt)
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync(cancellationToken);
    
    return (items, totalCount);
}
```

### 3. Actualizar SearchPrescriptionsQueryHandler

```csharp
public async Task<PaginatedResult<PrescriptionListDto>> Handle(...)
{
    var (items, totalCount) = await _prescriptionRepository.SearchAsync(
        patientId: request.SearchCriteria.PatientId,
        doctorId: request.SearchCriteria.DoctorId,
        status: request.SearchCriteria.Status,
        startDate: request.SearchCriteria.StartDate,
        endDate: request.SearchCriteria.EndDate,
        page: request.SearchCriteria.Page,
        pageSize: request.SearchCriteria.PageSize,
        cancellationToken: cancellationToken);

    var dtos = _mapper.Map<List<PrescriptionListDto>>(items);

    return new PaginatedResult<PrescriptionListDto>
    {
        Items = dtos,
        TotalCount = totalCount,
        Page = request.SearchCriteria.Page,
        PageSize = request.SearchCriteria.PageSize
    };
}
```

## Workaround Temporal

Para probar que el API funciona, usa el endpoint que SÍ está implementado:

```powershell
# Obtener una prescripción específica por ID
# Primero necesitas un ID válido de la BD
.\test-single-endpoint.ps1 -Endpoint "/api/prescriptions/{GUID-AQUI}" -Method "GET"
```

## Recomendación

Crear un nuevo task o subtask para implementar la funcionalidad de búsqueda/filtrado de prescripciones. Esto debería incluir:

1. Agregar método `SearchAsync` a `IPrescriptionRepository`
2. Implementar el método en `PrescriptionRepository`
3. Actualizar `SearchPrescriptionsQueryHandler` para usar el nuevo método
4. Probar todos los endpoints de búsqueda
5. Verificar que los filtros funcionen correctamente

## Estado Actual

- ✅ Keycloak configurado y funcionando
- ✅ Autenticación JWT funcionando
- ✅ API respondiendo correctamente
- ✅ Operaciones CRUD básicas implementadas
- ❌ Funcionalidad de búsqueda/filtrado NO implementada
- ✅ Datos existen en la base de datos (30 prescripciones)

---

**Fecha**: 2025-11-20
**Investigado por**: Kiro
**Conclusión**: El problema NO es de autenticación ni de datos. Es una funcionalidad que quedó pendiente de implementar en el Task 11.
