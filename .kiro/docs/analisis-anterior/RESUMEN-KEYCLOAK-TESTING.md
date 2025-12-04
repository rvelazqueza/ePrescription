# Resumen: Keycloak Configurado para Pruebas Automatizadas ✅

## Estado Final

✅ **Keycloak configurado completamente**
✅ **Direct Access Grants habilitado**
✅ **Tokens JWT funcionando correctamente**
✅ **API respondiendo a peticiones autenticadas**
✅ **Scripts de prueba automatizados creados**

## Lo que se Logró

### 1. Configuración de Keycloak
- ✅ Direct Access Grants habilitado en cliente `eprescription-api`
- ✅ Client Secret configurado: `Q7frqJfqjUaU73rKni061qpE9KDrbGL0`
- ✅ Contraseñas de usuarios reseteadas a valores conocidos

### 2. Usuarios Disponibles

| Usuario | Contraseña | Rol | Estado |
|---------|-----------|-----|--------|
| doctor1 | doctor123 | Doctor | ✅ Probado |
| admin.user | admin123 | Admin | ✅ Probado |
| pharmacist1 | pharmacist123 | Pharmacist | ✅ Probado |
| patient1 | patient123 | Patient | ✅ Disponible |
| auditor1 | auditor123 | Auditor | ✅ Disponible |

### 3. Scripts Creados

#### `keycloak/check-direct-access.ps1`
Verifica la configuración de Direct Access Grants.
```powershell
.\keycloak\check-direct-access.ps1
```

#### `keycloak/enable-direct-access.ps1`
Habilita Direct Access Grants (ya está habilitado).
```powershell
.\keycloak\enable-direct-access.ps1
```

#### `test-api-with-auth.ps1`
Pruebas automatizadas completas del API.
```powershell
.\test-api-with-auth.ps1
```

#### `test-single-endpoint.ps1`
Prueba un endpoint específico con autenticación.
```powershell
# Ejemplos:
.\test-single-endpoint.ps1 -Endpoint "/api/prescriptions/status/Active" -Method "GET"
.\test-single-endpoint.ps1 -Endpoint "/api/prescriptions/patient/123" -Method "GET"
.\test-single-endpoint.ps1 -Username "admin.user" -Password "admin123" -Endpoint "/api/audit" -Method "GET"
```

## Pruebas Realizadas

### ✅ Autenticación
```
- Keycloak disponible: ✅
- API disponible: ✅
- Tokens obtenidos para 3 usuarios: ✅
- Tokens válidos por 300 segundos (5 minutos): ✅
```

### ✅ Endpoints Probados
```
GET /api/prescriptions/status/Active
- Status: 200 OK ✅
- Respuesta: Lista vacía (normal, no hay datos)
- Autenticación: Funcionando correctamente
```

## Cómo Obtener un Token

### PowerShell
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:8080/realms/eprescription/protocol/openid-connect/token" `
    -Method Post `
    -ContentType "application/x-www-form-urlencoded" `
    -Body @{
        username = "doctor1"
        password = "doctor123"
        grant_type = "password"
        client_id = "eprescription-api"
        client_secret = "Q7frqJfqjUaU73rKni061qpE9KDrbGL0"
        scope = "openid profile email"
    }

$token = $response.access_token
```

### cURL
```bash
curl -X POST http://localhost:8080/realms/eprescription/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=doctor1" \
  -d "password=doctor123" \
  -d "grant_type=password" \
  -d "client_id=eprescription-api" \
  -d "client_secret=Q7frqJfqjUaU73rKni061qpE9KDrbGL0" \
  -d "scope=openid profile email"
```

## Cómo Usar el Token

### PowerShell
```powershell
$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

# GET
$result = Invoke-RestMethod -Uri "http://localhost:8000/api/prescriptions/status/Active" `
    -Method Get `
    -Headers $headers

# POST
$body = @{
    patientId = "123"
    doctorId = "456"
    diagnosis = "Test"
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:8000/api/prescriptions" `
    -Method Post `
    -Headers $headers `
    -Body $body
```

## Endpoints Disponibles

### Prescriptions Controller
```
POST   /api/prescriptions                    - Crear prescripción
GET    /api/prescriptions/{id}               - Obtener por ID
PUT    /api/prescriptions/{id}               - Actualizar
DELETE /api/prescriptions/{id}               - Eliminar (soft delete)
POST   /api/prescriptions/search             - Buscar con filtros
GET    /api/prescriptions/patient/{id}       - Por paciente
GET    /api/prescriptions/doctor/{id}        - Por doctor
GET    /api/prescriptions/status/{status}    - Por estado
```

### Otros Controllers
```
GET    /api/audit                            - Logs de auditoría (admin)
GET    /health                               - Health check (público)
GET    /swagger                              - Documentación API (público)
```

## Probar desde Swagger UI

1. Abre http://localhost:8000/swagger
2. Click en **"Authorize"** (candado arriba a la derecha)
3. Ingresa credenciales:
   - Username: `doctor1`
   - Password: `doctor123`
4. Click **"Authorize"**
5. Prueba cualquier endpoint

## Verificar Logs de Auditoría

### Después de ejecutar operaciones CRUD autenticadas:

```powershell
# Conectar a Oracle
docker exec -it oracle-db sqlplus eprescription/eprescription@//localhost:1521/XEPDB1

# Ver logs recientes
SELECT * FROM AUDIT_LOGS 
ORDER BY CREATED_AT DESC 
FETCH FIRST 10 ROWS ONLY;

# Contar logs de hoy
SELECT COUNT(*) FROM AUDIT_LOGS 
WHERE CREATED_AT > SYSDATE - 1;
```

## Información del Token JWT

El token incluye:
- **sub**: ID del usuario en Keycloak
- **preferred_username**: Nombre de usuario (ej: "doctor1")
- **email**: Email del usuario
- **realm_access.roles**: Roles del usuario (ej: ["doctor"])
- **exp**: Timestamp de expiración (5 minutos)
- **name**: Nombre completo del usuario

## Próximos Pasos Sugeridos

1. **Crear datos de prueba en Oracle**
   - Insertar pacientes, doctores, medicamentos
   - Crear algunas prescripciones de prueba

2. **Probar operaciones CRUD completas**
   - Crear prescripción con POST
   - Leer con GET
   - Actualizar con PUT
   - Eliminar con DELETE

3. **Verificar logs de auditoría**
   - Confirmar que se generan logs en Oracle
   - Verificar que contienen la información correcta

4. **Probar diferentes roles**
   - Doctor: puede crear/editar prescripciones
   - Pharmacist: puede dispensar
   - Admin: acceso completo
   - Patient: solo lectura de sus propias prescripciones

## Troubleshooting

### Token expirado
Los tokens expiran en 5 minutos. Obtén uno nuevo:
```powershell
.\test-single-endpoint.ps1 -Endpoint "/api/prescriptions/status/Active"
```

### Credenciales inválidas
Resetea las contraseñas:
```powershell
.\keycloak\reset-passwords-simple.ps1
```

### API no responde
Verifica que Docker esté corriendo:
```powershell
docker ps
docker logs eprescription-api
```

## Documentación Adicional

- **KEYCLOAK-AUTOMATED-TESTING-READY.md**: Guía completa de configuración
- **docs/KEYCLOAK_CONFIGURATION.md**: Configuración de Keycloak
- **eprescription-API/docs/TASK-11-TESTING-GUIDE.md**: Guía de pruebas Task 11

---

**Fecha**: 2025-11-20
**Estado**: ✅ Completado y probado exitosamente
**Problema resuelto**: Keycloak ahora permite pruebas automatizadas con username/password
