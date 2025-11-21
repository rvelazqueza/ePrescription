# Task 11.12: Instrucciones para Probar Endpoints de Prescripciones

## 🎯 Objetivo
Probar todos los endpoints CRUD de la API de Prescripciones para verificar que funcionan correctamente.

## 📋 Pasos a Seguir

### Paso 1: Iniciar Servicios Necesarios

#### 1.1 Iniciar Oracle Database
```powershell
docker-compose up -d oracle-db
```

#### 1.2 Iniciar Keycloak
```powershell
docker-compose up -d keycloak
```

#### 1.3 Iniciar Backend API
```powershell
cd eprescription-API/src/ePrescription.API
dotnet run
```

**Verificar que el API esté corriendo:**
- Abrir navegador en: http://localhost:5000/swagger
- O ejecutar: `Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get`

### Paso 2: Ejecutar Script de Pruebas Básicas

```powershell
# Volver a la raíz del proyecto
cd ../../../

# Ejecutar script de pruebas
.\test-task11-prescriptions.ps1
```

**Resultado esperado:**
- Todos los tests deberían pasar con status 401 (Unauthorized)
- Esto confirma que los endpoints existen y requieren autenticación

### Paso 3: Obtener Token de Autenticación

#### Opción A: Usando PowerShell
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
Write-Host "Token obtenido: $token"
```

#### Opción B: Usando Postman
1. Crear nueva request POST
2. URL: `http://localhost:5000/api/auth/login`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "username": "doctor@test.com",
  "password": "Test123!"
}
```
5. Enviar request
6. Copiar el `accessToken` de la respuesta

### Paso 4: Probar Endpoints con Autenticación

#### 4.1 Crear Prescripción (POST)

**PowerShell:**
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    patientId = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    doctorId = "3fa85f64-5717-4562-b3fc-2c963f66afa7"
    prescriptionDate = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    validUntil = (Get-Date).AddMonths(1).ToString("yyyy-MM-ddTHH:mm:ss")
    diagnoses = @(
        @{
            cie10Code = "J00"
            description = "Acute nasopharyngitis [common cold]"
            isPrimary = $true
        }
    )
    medications = @(
        @{
            medicationId = "3fa85f64-5717-4562-b3fc-2c963f66afa8"
            dosage = "500mg"
            frequency = "Every 8 hours"
            duration = "7 days"
            administrationRoute = "Oral"
            instructions = "Take with food"
        }
    )
    notes = "Test prescription"
} | ConvertTo-Json -Depth 10

$response = Invoke-RestMethod `
    -Uri "http://localhost:5000/api/prescriptions" `
    -Method POST `
    -Headers $headers `
    -Body $body

Write-Host "Prescripción creada:"
$response | ConvertTo-Json -Depth 5

# Guardar el ID para pruebas posteriores
$prescriptionId = $response.id
```

**Postman:**
1. Crear nueva request POST
2. URL: `http://localhost:5000/api/prescriptions`
3. Headers:
   - `Authorization: Bearer {tu_token}`
   - `Content-Type: application/json`
4. Body: Ver ejemplo en la guía completa
5. Enviar request
6. Guardar el `id` de la respuesta

#### 4.2 Obtener Prescripción (GET)

**PowerShell:**
```powershell
$response = Invoke-RestMethod `
    -Uri "http://localhost:5000/api/prescriptions/$prescriptionId" `
    -Method GET `
    -Headers $headers

Write-Host "Prescripción obtenida:"
$response | ConvertTo-Json -Depth 5
```

**Postman:**
1. Crear nueva request GET
2. URL: `http://localhost:5000/api/prescriptions/{id}`
3. Headers: `Authorization: Bearer {tu_token}`
4. Enviar request

#### 4.3 Actualizar Prescripción (PUT)

**PowerShell:**
```powershell
$updateBody = @{
    notes = "Updated notes - patient improving"
    status = "Active"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "http://localhost:5000/api/prescriptions/$prescriptionId" `
    -Method PUT `
    -Headers $headers `
    -Body $updateBody

Write-Host "Prescripción actualizada:"
$response | ConvertTo-Json -Depth 5
```

**Postman:**
1. Crear nueva request PUT
2. URL: `http://localhost:5000/api/prescriptions/{id}`
3. Headers:
   - `Authorization: Bearer {tu_token}`
   - `Content-Type: application/json`
4. Body:
```json
{
  "notes": "Updated notes - patient improving",
  "status": "Active"
}
```
5. Enviar request

#### 4.4 Buscar Prescripciones (POST /search)

**PowerShell:**
```powershell
$searchBody = @{
    page = 1
    pageSize = 10
    status = "Active"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "http://localhost:5000/api/prescriptions/search" `
    -Method POST `
    -Headers $headers `
    -Body $searchBody

Write-Host "Resultados de búsqueda:"
$response | ConvertTo-Json -Depth 5
```

**Postman:**
1. Crear nueva request POST
2. URL: `http://localhost:5000/api/prescriptions/search`
3. Headers:
   - `Authorization: Bearer {tu_token}`
   - `Content-Type: application/json`
4. Body:
```json
{
  "page": 1,
  "pageSize": 10,
  "status": "Active"
}
```
5. Enviar request

#### 4.5 Eliminar Prescripción (DELETE)

**PowerShell:**
```powershell
Invoke-RestMethod `
    -Uri "http://localhost:5000/api/prescriptions/$prescriptionId" `
    -Method DELETE `
    -Headers $headers

Write-Host "Prescripción eliminada (cancelada) exitosamente"
```

**Postman:**
1. Crear nueva request DELETE
2. URL: `http://localhost:5000/api/prescriptions/{id}`
3. Headers: `Authorization: Bearer {tu_token}`
4. Enviar request
5. Debería retornar 204 No Content

### Paso 5: Verificar Auditoría

Verificar que las operaciones fueron auditadas:

```powershell
# Conectar a Oracle
docker exec -it eprescription-oracle-db sqlplus eprescription_user/EprescriptionPass123!@XE

# Consultar logs de auditoría
SELECT * FROM audit_logs 
WHERE entity_name = 'Prescription' 
ORDER BY timestamp DESC 
FETCH FIRST 10 ROWS ONLY;
```

## ✅ Checklist de Pruebas

Marca cada prueba completada:

- [ ] Servicios iniciados (Oracle, Keycloak, API)
- [ ] Script básico ejecutado (401 responses)
- [ ] Token de autenticación obtenido
- [ ] POST /api/prescriptions - Crear prescripción ✓
- [ ] GET /api/prescriptions/{id} - Obtener prescripción ✓
- [ ] PUT /api/prescriptions/{id} - Actualizar prescripción ✓
- [ ] DELETE /api/prescriptions/{id} - Eliminar prescripción ✓
- [ ] POST /api/prescriptions/search - Buscar prescripciones ✓
- [ ] GET /api/prescriptions/patient/{patientId} - Por paciente
- [ ] GET /api/prescriptions/doctor/{doctorId} - Por doctor
- [ ] GET /api/prescriptions/status/{status} - Por estado
- [ ] Validaciones probadas (datos inválidos)
- [ ] Autorización probada (sin token, token inválido)
- [ ] Auditoría verificada en base de datos

## 📊 Resultados Esperados

### Respuestas Exitosas
- **POST /api/prescriptions:** 201 Created + objeto creado
- **GET /api/prescriptions/{id}:** 200 OK + objeto
- **PUT /api/prescriptions/{id}:** 200 OK + objeto actualizado
- **DELETE /api/prescriptions/{id}:** 204 No Content
- **POST /api/prescriptions/search:** 200 OK + resultados paginados

### Respuestas de Error
- **Sin token:** 401 Unauthorized
- **Token inválido:** 401 Unauthorized
- **Sin permisos:** 403 Forbidden
- **ID no existe:** 404 Not Found
- **Datos inválidos:** 400 Bad Request + detalles de validación

## 📝 Documentar Resultados

Después de completar las pruebas, documenta:

1. **Endpoints probados:** Lista de todos los endpoints
2. **Resultados:** Exitoso/Fallido para cada uno
3. **Problemas encontrados:** Bugs o errores
4. **Capturas de pantalla:** De Postman o respuestas
5. **Logs de auditoría:** Verificar que se registraron

## 🎯 Próximos Pasos

Una vez completadas las pruebas:

1. ✅ Marcar subtarea 11.12 como completada
2. ➡️ Continuar con subtarea 11.13 (Tests de integración)
3. ➡️ Continuar con subtarea 11.14 (Commit y push)

## 📚 Recursos

- **Guía completa:** `eprescription-API/docs/TASK-11-TESTING-GUIDE.md`
- **Script de pruebas:** `test-task11-prescriptions.ps1`
- **Swagger UI:** http://localhost:5000/swagger
- **Health Check:** http://localhost:5000/health

---

**¿Necesitas ayuda?**
- Revisa la guía completa en `eprescription-API/docs/TASK-11-TESTING-GUIDE.md`
- Verifica logs del API en la consola
- Verifica logs de Keycloak: `docker logs eprescription-keycloak`
- Verifica logs de Oracle: `docker logs eprescription-oracle-db`
