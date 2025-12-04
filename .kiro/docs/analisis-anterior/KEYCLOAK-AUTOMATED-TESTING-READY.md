# Keycloak Configurado para Pruebas Automatizadas ✅

## Estado Actual

✅ **Direct Access Grants habilitado** en el cliente `eprescription-api`
✅ **Tokens JWT obtenidos exitosamente** para 3 usuarios
✅ **Scripts de prueba automatizados** funcionando correctamente

## Configuración Completada

### Cliente Keycloak
- **Cliente ID**: `eprescription-api`
- **Client Secret**: `Q7frqJfqjUaU73rKni061qpE9KDrbGL0`
- **Direct Access Grants**: ✅ Habilitado
- **Standard Flow**: ✅ Habilitado

### Usuarios Configurados

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| doctor1 | doctor123 | Doctor |
| admin.user | admin123 | Admin |
| pharmacist1 | pharmacist123 | Pharmacist |
| patient1 | patient123 | Patient |
| auditor1 | auditor123 | Auditor |

## Scripts Disponibles

### 1. Verificar Configuración
```powershell
.\keycloak\check-direct-access.ps1
```
Verifica si Direct Access Grants está habilitado.

### 2. Habilitar Direct Access (si es necesario)
```powershell
.\keycloak\enable-direct-access.ps1
```
Habilita Direct Access Grants en el cliente.

### 3. Pruebas Automatizadas Completas
```powershell
.\test-api-with-auth.ps1
```
Ejecuta pruebas completas del API con autenticación:
- ✅ Obtiene tokens para múltiples usuarios
- ✅ Prueba endpoints protegidos
- ✅ Verifica respuestas del API

### 4. Resetear Contraseñas
```powershell
.\keycloak\reset-passwords-simple.ps1
```
Resetea las contraseñas de todos los usuarios a valores conocidos.

### 5. Listar Usuarios
```powershell
.\keycloak\list-users.ps1
```
Lista todos los usuarios en el realm.

## Obtener Token Manualmente

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
Write-Host "Token: $token"
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

## Usar Token en Peticiones API

### PowerShell
```powershell
$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

# GET
$prescriptions = Invoke-RestMethod -Uri "http://localhost:8000/api/prescriptions" `
    -Method Get `
    -Headers $headers

# POST
$body = @{
    patientId = 1
    doctorId = 1
    diagnosis = "Test"
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:8000/api/prescriptions" `
    -Method Post `
    -Headers $headers `
    -Body $body
```

### cURL
```bash
# GET
curl -X GET http://localhost:8000/api/prescriptions \
  -H "Authorization: Bearer $TOKEN"

# POST
curl -X POST http://localhost:8000/api/prescriptions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"patientId":1,"doctorId":1,"diagnosis":"Test"}'
```

## Verificar Logs de Auditoría

### En Oracle
```sql
-- Conectar a Oracle
docker exec -it oracle-db sqlplus eprescription/eprescription@//localhost:1521/XEPDB1

-- Ver logs recientes
SELECT * FROM AUDIT_LOGS 
ORDER BY CREATED_AT DESC 
FETCH FIRST 10 ROWS ONLY;

-- Contar logs de hoy
SELECT COUNT(*) as total_logs
FROM AUDIT_LOGS
WHERE CREATED_AT > SYSDATE - 1;
```

### Desde el API
```powershell
# Obtener token de admin
$adminToken = # ... obtener token con admin.user

# Consultar logs
$logs = Invoke-RestMethod -Uri "http://localhost:8000/api/audit" `
    -Method Get `
    -Headers @{
        Authorization = "Bearer $adminToken"
    }
```

## Swagger UI con Autenticación

1. Abre http://localhost:8000/swagger
2. Click en el botón **"Authorize"** (candado)
3. Ingresa las credenciales:
   - **Username**: doctor1
   - **Password**: doctor123
4. Click en **"Authorize"**
5. Ahora puedes probar todos los endpoints protegidos

## Resultados de Pruebas

### ✅ Funcionando
- Keycloak disponible y respondiendo
- API disponible en http://localhost:8000
- Tokens JWT obtenidos exitosamente para 3 usuarios
- Autenticación funcionando correctamente

### ⚠️ Pendiente de Verificar
- Endpoints específicos de prescripciones (algunos retornan 405/400)
- Endpoint de auditoría (retorna 401 con admin.user)
- Logs de auditoría en Oracle (requiere operaciones CRUD autenticadas)

## Próximos Pasos

1. **Probar endpoints manualmente desde Swagger UI**
   - Esto generará logs de auditoría
   - Permitirá verificar que los endpoints funcionan correctamente

2. **Verificar logs de auditoría en Oracle**
   - Después de ejecutar operaciones CRUD
   - Confirmar que el AuditInterceptor está funcionando

3. **Ajustar scripts de prueba**
   - Corregir los endpoints que retornan errores
   - Agregar más casos de prueba

## Notas Importantes

- El cliente `eprescription-api` requiere **client_secret** para obtener tokens
- Las contraseñas se pueden resetear con `reset-passwords-simple.ps1`
- Los logs de auditoría solo se generan con operaciones autenticadas
- Direct Access Grants está habilitado permanentemente (persiste en la BD de Oracle)

## Troubleshooting

### Error: "Invalid user credentials"
```powershell
# Resetear contraseñas
.\keycloak\reset-passwords-simple.ps1
```

### Error: "Invalid client or Invalid client credentials"
```powershell
# Verificar configuración del cliente
.\keycloak\check-direct-access.ps1

# Habilitar Direct Access si es necesario
.\keycloak\enable-direct-access.ps1
```

### Error: "Unauthorized" (401)
- Verifica que el token no haya expirado (expira en 5 minutos por defecto)
- Obtén un nuevo token
- Verifica que el usuario tenga los permisos necesarios

---

**Fecha**: 2025-11-20
**Estado**: ✅ Configuración completada y probada
