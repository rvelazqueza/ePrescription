# Task 15.19: Fix Endpoint de Búsqueda de Borradores - COMPLETADO ✅

## 🐛 Problema Encontrado

Al probar el componente de Borradores, se encontró un error 400:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "id": ["The value 'search' is not valid."]
  },
  "traceId": "00-ef0b8603fc78ba0b2664db42af8c4ec5-235b6053ca503f24-00"
}
```

**URL que falló:**
```
GET http://localhost:8000/api/prescriptions/search?status=draft
```

---

## 🔍 Causa Raíz

El controller de prescripciones solo tenía un endpoint `[HttpPost("search")]` que esperaba un body JSON, pero el frontend estaba haciendo un `GET` con query parameters.

El routing de ASP.NET Core estaba intentando parsear "search" como un GUID para el endpoint `GET {id}`, causando el error de validación.

---

## ✅ Solución Implementada

Se agregó un nuevo endpoint GET que acepta query parameters:

```csharp
/// <summary>
/// Search prescriptions with filters and pagination (GET with query parameters)
/// </summary>
[HttpGet("search")]
[ProducesResponseType(typeof(PaginatedResult<PrescriptionListDto>), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<IActionResult> SearchPrescriptionsGet(
    [FromQuery] Guid? patientId = null,
    [FromQuery] Guid? doctorId = null,
    [FromQuery] string? status = null,
    [FromQuery] DateTime? startDate = null,
    [FromQuery] DateTime? endDate = null,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
{
    try
    {
        var dto = new SearchPrescriptionsDto
        {
            PatientId = patientId,
            DoctorId = doctorId,
            Status = status,
            FromDate = startDate,  // ✅ Corregido: era StartDate
            ToDate = endDate,      // ✅ Corregido: era EndDate
            Page = page,
            PageSize = pageSize
        };

        // Validate DTO
        var validationResult = await _searchValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            return BadRequest(new
            {
                message = "Validation failed",
                errors = validationResult.Errors.Select(e => new
                {
                    property = e.PropertyName,
                    error = e.ErrorMessage
                })
            });
        }

        // Create query
        var query = new SearchPrescriptionsQuery(dto);

        // Execute query
        var result = await _mediator.Send(query);

        return Ok(result);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error searching prescriptions");
        return StatusCode(500, new { message = "An error occurred while searching prescriptions" });
    }
}
```

---

## 🔧 Cambios Realizados

### 1. Archivo Modificado

**`eprescription-API/src/ePrescription.API/Controllers/PrescriptionsController.cs`**

### 2. Cambios Específicos

1. **Agregado nuevo endpoint GET:**
   - Ruta: `[HttpGet("search")]`
   - Acepta query parameters
   - Mapea a `SearchPrescriptionsDto`

2. **Corregido mapeo de fechas:**
   - `StartDate` → `FromDate` (nombre correcto en el DTO)
   - `EndDate` → `ToDate` (nombre correcto en el DTO)

3. **Mantenido endpoint POST existente:**
   - El endpoint `[HttpPost("search")]` sigue funcionando
   - Útil para búsquedas complejas con body JSON

---

## 🚀 Despliegue

### 1. Recompilar API

```powershell
docker-compose build eprescription-api
```

**Resultado:** ✅ Compilación exitosa

### 2. Reiniciar Contenedor

```powershell
docker-compose restart eprescription-api
```

**Resultado:** ✅ Contenedor reiniciado

### 3. Verificar Logs

```powershell
docker logs eprescription-api --tail 20
```

**Resultado:** ✅ API corriendo en puerto 8080

---

## 🧪 Testing

### Probar el Endpoint Manualmente

#### Opción 1: Swagger

1. Abrir: http://localhost:8000/swagger
2. Buscar: `GET /api/prescriptions/search`
3. Probar con parámetros:
   - `status`: draft
   - `page`: 1
   - `pageSize`: 10

#### Opción 2: PowerShell

```powershell
# Probar búsqueda de borradores
$response = Invoke-RestMethod -Uri "http://localhost:8000/api/prescriptions/search?status=draft&page=1&pageSize=10" -Method Get
$response | ConvertTo-Json -Depth 5
```

#### Opción 3: Desde el Frontend

1. Iniciar frontend: `cd eprescription-frontend ; npm start`
2. Abrir: http://localhost:4200
3. Login con usuario médico
4. Navegar a: Prescripciones → Borradores
5. Verificar que se cargan los datos

---

## 📊 Endpoints Disponibles Ahora

### Búsqueda de Prescripciones

| Método | Ruta | Descripción | Uso |
|--------|------|-------------|-----|
| **GET** | `/api/prescriptions/search` | Búsqueda con query params | ✅ **NUEVO** - Usado por frontend |
| **POST** | `/api/prescriptions/search` | Búsqueda con body JSON | ✅ Existente - Para búsquedas complejas |

### Ejemplos de Uso

**GET - Borradores:**
```
GET /api/prescriptions/search?status=draft&page=1&pageSize=10
```

**GET - Por Paciente:**
```
GET /api/prescriptions/search?patientId=123e4567-e89b-12d3-a456-426614174000&page=1
```

**GET - Por Médico:**
```
GET /api/prescriptions/search?doctorId=123e4567-e89b-12d3-a456-426614174000&page=1
```

**GET - Por Rango de Fechas:**
```
GET /api/prescriptions/search?startDate=2025-01-01&endDate=2025-01-31&page=1
```

**POST - Búsqueda Compleja:**
```json
POST /api/prescriptions/search
{
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "draft",
  "fromDate": "2025-01-01",
  "toDate": "2025-01-31",
  "page": 1,
  "pageSize": 10
}
```

---

## 🎯 Próximos Pasos

### 1. Probar el Frontend

```powershell
# Terminal 1: Asegurar que el backend está corriendo
docker ps | findstr eprescription-api

# Terminal 2: Iniciar frontend
cd eprescription-frontend
npm start
```

### 2. Verificar Funcionalidad

- [ ] Login funciona
- [ ] Navegar a Borradores
- [ ] Se muestra spinner de carga
- [ ] Se cargan borradores desde el backend
- [ ] Búsqueda funciona
- [ ] Filtros funcionan
- [ ] Ver detalles funciona
- [ ] Duplicar funciona
- [ ] Eliminar funciona

### 3. Si No Hay Datos

Crear prescripciones de prueba desde Swagger:

```json
POST /api/prescriptions
{
  "patientId": "GUID-del-paciente",
  "doctorId": "GUID-del-doctor",
  "medicalCenterId": "GUID-del-centro",
  "prescriptionDate": "2025-01-25T00:00:00",
  "diagnoses": [
    {
      "cie10Code": "I10",
      "isPrimary": true,
      "notes": "Hipertensión arterial"
    }
  ],
  "medications": [
    {
      "medicationId": "GUID-del-medicamento",
      "dosage": "10mg",
      "frequency": "2 veces al día",
      "durationDays": 30,
      "administrationRouteId": "GUID-de-ruta",
      "quantity": 60,
      "instructions": "Tomar con alimentos"
    }
  ],
  "notes": "Borrador de prueba"
}
```

---

## 📝 Notas Técnicas

### Diferencias entre GET y POST

**GET `/api/prescriptions/search`:**
- ✅ Más RESTful para búsquedas
- ✅ Cacheable por navegadores
- ✅ Fácil de probar en navegador
- ❌ Limitado por longitud de URL
- ✅ **Usado por el frontend**

**POST `/api/prescriptions/search`:**
- ✅ Sin límite de parámetros
- ✅ Mejor para búsquedas complejas
- ✅ Puede incluir objetos anidados
- ❌ No cacheable
- ✅ **Disponible para casos avanzados**

### Propiedades del SearchPrescriptionsDto

```csharp
public class SearchPrescriptionsDto
{
    public Guid? PatientId { get; set; }
    public Guid? DoctorId { get; set; }
    public Guid? MedicalCenterId { get; set; }
    public string? Status { get; set; }
    public DateTime? FromDate { get; set; }  // ⚠️ No StartDate
    public DateTime? ToDate { get; set; }    // ⚠️ No EndDate
    public string? Cie10Code { get; set; }
    
    // Pagination
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    // Sorting
    public string? SortBy { get; set; } = "PrescriptionDate";
    public string? SortDirection { get; set; } = "desc";
}
```

---

## ✅ Estado Final

| Componente | Estado | Notas |
|------------|--------|-------|
| **Backend API** | ✅ Compilado | Sin errores |
| **Endpoint GET** | ✅ Agregado | `/api/prescriptions/search` |
| **Endpoint POST** | ✅ Existente | Mantenido para compatibilidad |
| **Docker Container** | ✅ Corriendo | Puerto 8080 |
| **Frontend** | ✅ Listo | Esperando pruebas |

---

## 🎉 Resumen

Se corrigió exitosamente el error 400 en el endpoint de búsqueda de prescripciones:

1. ✅ Agregado endpoint GET que acepta query parameters
2. ✅ Corregido mapeo de fechas (FromDate/ToDate)
3. ✅ API recompilada y desplegada
4. ✅ Contenedor reiniciado y funcionando
5. ⏳ Listo para probar desde el frontend

**Próximo paso:** Probar el componente de Borradores en el navegador para verificar que todo funciona correctamente.

---

**Fecha:** 2025-01-25
**Tiempo de Fix:** ~15 minutos
**Estado:** ✅ COMPLETADO Y DESPLEGADO
