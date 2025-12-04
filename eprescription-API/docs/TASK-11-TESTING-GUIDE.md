# Task 11: Prescriptions API - Testing Guide

## 📋 Overview

Esta guía te ayudará a probar todos los endpoints de la API de Prescripciones (Task 11).

## 🚀 Prerequisitos

### 1. Base de Datos Oracle
```bash
# Verificar que Oracle esté corriendo
docker ps | grep oracle

# Si no está corriendo, iniciar Docker Compose
docker-compose up -d oracle-db
```

### 2. Keycloak
```bash
# Verificar que Keycloak esté corriendo
docker ps | grep keycloak

# Si no está corriendo, iniciar Docker Compose
docker-compose up -d keycloak
```

### 3. Backend API
```bash
# Navegar al proyecto API
cd eprescription-API/src/ePrescription.API

# Compilar el proyecto
dotnet build

# Ejecutar el proyecto
dotnet run
```

El API debería estar disponible en:
- HTTP: http://localhost:5000
- HTTPS: https://localhost:5001
- Swagger: http://localhost:5000/swagger

## 🔐 Autenticación

### Obtener Token de Keycloak

#### Opción 1: Usando PowerShell
```powershell
$loginBody = @{
    username = "doctor@test.com"
    password = "Test123!"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -Body $loginBody `
    -ContentType "application/json"

$token = $response.accessToken
Write-Host "Token: $token"
```

#### Opción 2: Usando cURL
```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "doctor@test.com",
    "password": "Test123!"
  }'
```

#### Opción 3: Usando Postman
1. Crear nueva request POST
2. URL: `http://localhost:5000/api/auth/login`
3. Body (raw JSON):
```json
{
  "username": "doctor@test.com",
  "password": "Test123!"
}
```
4. Copiar el `accessToken` de la respuesta

## 📝 Endpoints de Prescripciones

### 1. Crear Prescripción

**POST** `/api/prescriptions`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "patientId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "doctorId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "prescriptionDate": "2024-11-19T10:00:00",
  "validUntil": "2024-12-19T10:00:00",
  "diagnoses": [
    {
      "cie10Code": "J00",
      "description": "Acute nasopharyngitis [common cold]",
      "isPrimary": true
    }
  ],
  "medications": [
    {
      "medicationId": "3fa85f64-5717-4562-b3fc-2c963f66afa8",
      "dosage": "500mg",
      "frequency": "Every 8 hours",
      "duration": "7 days",
      "administrationRoute": "Oral",
      "instructions": "Take with food"
    }
  ],
  "notes": "Patient has mild symptoms"
}
```

**Expected Response:** `201 Created`
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa9",
  "prescriptionNumber": "RX-2024-001",
  "patientId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "doctorId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "prescriptionDate": "2024-11-19T10:00:00",
  "validUntil": "2024-12-19T10:00:00",
  "status": "Active",
  "diagnoses": [...],
  "medications": [...],
  "notes": "Patient has mild symptoms",
  "createdAt": "2024-11-19T10:00:00",
  "updatedAt": "2024-11-19T10:00:00"
}
```

### 2. Obtener Prescripción por ID

**GET** `/api/prescriptions/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response:** `200 OK`

### 3. Actualizar Prescripción

**PUT** `/api/prescriptions/{id}`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "notes": "Updated notes - patient improving",
  "status": "Active"
}
```

**Expected Response:** `200 OK`

### 4. Eliminar (Cancelar) Prescripción

**DELETE** `/api/prescriptions/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response:** `204 No Content`

**Nota:** Esto realiza un soft delete cambiando el estado a "Cancelled"

### 5. Buscar Prescripciones

**POST** `/api/prescriptions/search`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "patientId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "doctorId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
  "status": "Active",
  "startDate": "2024-01-01T00:00:00",
  "endDate": "2024-12-31T23:59:59",
  "page": 1,
  "pageSize": 10
}
```

**Expected Response:** `200 OK`
```json
{
  "items": [...],
  "totalCount": 100,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10
}
```

### 6. Obtener Prescripciones por Paciente

**GET** `/api/prescriptions/patient/{patientId}?page=1&pageSize=10`

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response:** `200 OK` (paginado)

### 7. Obtener Prescripciones por Doctor

**GET** `/api/prescriptions/doctor/{doctorId}?page=1&pageSize=10`

**Headers:**
```
Authorization: Bearer {token}
```

**Expected Response:** `200 OK` (paginado)

### 8. Obtener Prescripciones por Estado

**GET** `/api/prescriptions/status/{status}?page=1&pageSize=10`

**Headers:**
```
Authorization: Bearer {token}
```

**Estados válidos:** `Active`, `Dispensed`, `Cancelled`, `Expired`

**Expected Response:** `200 OK` (paginado)

## 🧪 Script de Pruebas Automatizado

Ejecuta el script de PowerShell para probar todos los endpoints:

```powershell
.\test-task11-prescriptions.ps1
```

Este script:
1. Verifica que el API esté corriendo
2. Prueba todos los endpoints sin autenticación (espera 401)
3. Muestra un resumen de resultados

Para probar con autenticación, edita el script y descomenta la sección de login.

## 📊 Validaciones Implementadas

### CreatePrescriptionDto
- `PatientId`: Requerido, debe ser un GUID válido
- `DoctorId`: Requerido, debe ser un GUID válido
- `PrescriptionDate`: Requerido, no puede ser futuro
- `ValidUntil`: Requerido, debe ser después de PrescriptionDate
- `Diagnoses`: Requerido, al menos 1 diagnóstico
  - `CIE10Code`: Requerido, formato válido
  - `Description`: Requerido
  - Al menos 1 diagnóstico debe ser primario
- `Medications`: Requerido, al menos 1 medicamento
  - `MedicationId`: Requerido
  - `Dosage`: Requerido
  - `Frequency`: Requerido
  - `Duration`: Requerido
  - `AdministrationRoute`: Requerido

### UpdatePrescriptionDto
- `Notes`: Opcional
- `Status`: Opcional, valores válidos: Active, Dispensed, Cancelled, Expired

### SearchPrescriptionsDto
- `Page`: Mínimo 1
- `PageSize`: Entre 1 y 100
- Todos los filtros son opcionales

## 🔒 Autorización

### Roles Requeridos

- **Crear Prescripción:** `doctor` o `admin`
- **Leer Prescripción:** Cualquier usuario autenticado
- **Actualizar Prescripción:** `doctor` o `admin`
- **Eliminar Prescripción:** `doctor` o `admin`
- **Buscar Prescripciones:** Cualquier usuario autenticado

## 📝 Auditoría

Todas las operaciones de prescripciones son auditadas automáticamente:
- Creación de prescripción
- Actualización de prescripción
- Eliminación (cancelación) de prescripción

Los logs de auditoría incluyen:
- Usuario que realizó la acción
- Timestamp
- Acción realizada
- Entidad afectada
- Datos antes y después (para updates)

## 🐛 Troubleshooting

### Error: API is not running
**Solución:** Iniciar el API con `dotnet run` en `eprescription-API/src/ePrescription.API`

### Error: 401 Unauthorized
**Solución:** Obtener un token válido de Keycloak y agregarlo al header Authorization

### Error: 403 Forbidden
**Solución:** El usuario no tiene los permisos necesarios. Verificar roles en Keycloak.

### Error: 404 Not Found
**Solución:** Verificar que el ID de la prescripción existe en la base de datos

### Error: 400 Bad Request
**Solución:** Revisar el body de la request. Verificar validaciones en la respuesta.

### Error: 500 Internal Server Error
**Solución:** Revisar logs del API. Verificar conexión a base de datos.

## 📚 Recursos Adicionales

- **Swagger UI:** http://localhost:5000/swagger
- **Health Check:** http://localhost:5000/health
- **Logs del API:** Consola donde se ejecutó `dotnet run`
- **Logs de Auditoría:** Tabla `audit_logs` en Oracle

## ✅ Checklist de Pruebas

- [ ] API está corriendo
- [ ] Keycloak está corriendo
- [ ] Token de autenticación obtenido
- [ ] POST /api/prescriptions - Crear prescripción
- [ ] GET /api/prescriptions/{id} - Obtener prescripción
- [ ] PUT /api/prescriptions/{id} - Actualizar prescripción
- [ ] DELETE /api/prescriptions/{id} - Eliminar prescripción
- [ ] POST /api/prescriptions/search - Buscar prescripciones
- [ ] GET /api/prescriptions/patient/{patientId} - Por paciente
- [ ] GET /api/prescriptions/doctor/{doctorId} - Por doctor
- [ ] GET /api/prescriptions/status/{status} - Por estado
- [ ] Validaciones funcionando correctamente
- [ ] Autorización funcionando correctamente
- [ ] Auditoría registrando operaciones
- [ ] Paginación funcionando correctamente

## 🎯 Próximos Pasos

Después de completar las pruebas:
1. Documentar resultados
2. Crear tests de integración (Subtarea 11.13)
3. Hacer commit y push (Subtarea 11.14)
4. Continuar con Task 12 (Pacientes, Médicos, Farmacias)
