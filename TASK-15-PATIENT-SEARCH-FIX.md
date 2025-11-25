# Task 15 - Corrección de Patient Search API - COMPLETADO

## Fecha: 2025-11-24

## Problema Identificado

En la vista de nueva prescripción, el frontend estaba generando errores 400 (Bad Request) al intentar cargar pacientes:

```
GET http://localhost:8000/api/patients/search?pageSize=15 400 (Bad Request)
Error: One or more validation errors occurred
```

## Análisis del Problema

### Causa Raíz
El backend tiene el endpoint `/api/patients/search` configurado como **POST** con un body JSON, pero el frontend estaba haciendo peticiones **GET** con query parameters.

**Backend (C#):**
```csharp
[HttpPost("search")]
public async Task<IActionResult> SearchPatients([FromBody] SearchPatientsDto dto)
```

**Frontend (TypeScript) - ANTES:**
```typescript
this.http.get<PatientDto[]>(`${this.apiUrl}/search`, {
  params: new HttpParams().set('pageSize', '15')
})
```

### Métodos Afectados
1. `getRecentPatients()` - Carga pacientes recientes
2. `searchPatients()` - Búsqueda de pacientes por criterio
3. `getAllPatients()` - Obtiene todos los pacientes

## Solución Implementada

### 1. Corrección de `getRecentPatients()`

**ANTES:**
```typescript
return this.http.get<PatientDto[]>(`${this.apiUrl}/search`, {
  params: new HttpParams().set('pageSize', '15')
}).pipe(
```

**DESPUÉS:**
```typescript
const searchDto = {
  pageSize: 15,
  page: 1
};

return this.http.post<any>(`${this.apiUrl}/search`, searchDto).pipe(
  map(response => response.items || response),
  map((patients: PatientDto[]) => patients.map((patient: PatientDto) => this.mapPatientDtoToPatientData(patient))),
```

### 2. Corrección de `searchPatients()`

**ANTES:**
```typescript
let params = new HttpParams();
switch (criteria) {
  case 'name':
    params = params.set('searchTerm', query);
    break;
  // ...
}
return this.http.get<PatientDto[]>(`${this.apiUrl}/search`, { params }).pipe(
```

**DESPUÉS:**
```typescript
const searchDto: any = {
  page: 1,
  pageSize: 50
};

switch (criteria) {
  case 'name':
    searchDto.searchTerm = query;
    break;
  case 'idNumber':
    searchDto.identificationNumber = query;
    break;
  // ...
}

return this.http.post<any>(`${this.apiUrl}/search`, searchDto).pipe(
  map(response => (response.items || response).map((patient: PatientDto) => this.mapPatientDtoToPatientData(patient))),
```

### 3. Corrección de `getAllPatients()`

**ANTES:**
```typescript
return this.http.get<PatientDto[]>(`${this.apiUrl}/search`).pipe(
```

**DESPUÉS:**
```typescript
const searchDto = {
  page: 1,
  pageSize: 1000
};

return this.http.post<any>(`${this.apiUrl}/search`, searchDto).pipe(
  map(response => (response.items || response).map((patient: PatientDto) => this.mapPatientDtoToPatientData(patient))),
```

### 4. Corrección de Tipos TypeScript

Agregué tipos explícitos para evitar errores de compilación:

```typescript
map((patients: PatientDto[]) => patients.map((patient: PatientDto) => ...))
map((patients: PatientData[]) => patients.map((patient: PatientData) => ...))
map((recentPatients: any[]) => recentPatients.sort((a: any, b: any) => ...))
```

## Cambios en el Código

### Archivo Modificado
- `eprescription-frontend/src/app/services/patient.service.ts`

### Cambios Realizados
1. ✅ Cambió `http.get()` a `http.post()` en 3 métodos
2. ✅ Cambió query parameters a body JSON
3. ✅ Agregó manejo de respuesta paginada (`response.items || response`)
4. ✅ Agregó tipos explícitos a todos los callbacks
5. ✅ Mapeó correctamente los nombres de campos del DTO

## Mapeo de Campos

| Frontend (searchDto) | Backend (SearchPatientsDto) |
|---------------------|----------------------------|
| `searchTerm` | `SearchTerm` |
| `identificationNumber` | `IdentificationNumber` |
| `phone` | `Phone` |
| `email` | `Email` |
| `page` | `Page` |
| `pageSize` | `PageSize` |

## Verificación

### Compilación Angular
```bash
npm start
```

**Resultado**: ✅ Compilación exitosa
- Build time: 4040ms
- Hash: 143fb007f16b3615
- No errors

### Endpoints Corregidos
- ✅ `POST /api/patients/search` - Búsqueda general
- ✅ `POST /api/patients/search` - Pacientes recientes
- ✅ `POST /api/patients/search` - Todos los pacientes

## Respuesta Esperada del Backend

El backend devuelve una respuesta paginada:

```json
{
  "items": [
    {
      "id": "guid",
      "firstName": "string",
      "firstLastName": "string",
      "identificationNumber": "string",
      ...
    }
  ],
  "totalCount": 100,
  "page": 1,
  "pageSize": 15,
  "totalPages": 7
}
```

El frontend maneja ambos formatos:
- `response.items` - Respuesta paginada
- `response` - Array directo (fallback)

## Estado Final

✅ **COMPLETADO** - Todos los métodos de búsqueda de pacientes ahora usan POST correctamente
✅ **COMPILACIÓN EXITOSA** - Angular compila sin errores
✅ **TIPOS CORRECTOS** - Todos los parámetros tienen tipos explícitos
✅ **SERVIDOR CORRIENDO** - http://localhost:4200/

## Próximos Pasos

1. Probar la vista de nueva prescripción
2. Verificar que la búsqueda de pacientes funcione correctamente
3. Confirmar que los pacientes recientes se carguen sin errores
4. Probar todos los criterios de búsqueda (nombre, cédula, teléfono, email)

## Notas Técnicas

- El backend usa FluentValidation para validar el DTO
- El endpoint requiere un body JSON válido, no acepta query parameters
- La respuesta puede ser paginada o un array directo
- El frontend tiene fallback a datos mock en caso de error
