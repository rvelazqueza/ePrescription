# 🚀 Instrucciones Rápidas para Probar Keycloak

## 1. Acceder a Keycloak Admin Console

**URL**: http://localhost:8080

**Credenciales**:
- Username: `admin`
- Password: `admin123`

## 2. Configurar Keycloak (Si no lo has hecho)

Sigue la guía completa en: `docs/KEYCLOAK_CONFIGURATION.md`

O sigue estos pasos rápidos:

### Crear Realm
1. Click en dropdown "master" (arriba izquierda)
2. Click "Create Realm"
3. Realm name: `eprescription`
4. Click "Create"

### Crear Client
1. Ir a "Clients" → "Create client"
2. Client ID: `eprescription-api`
3. Client authentication: ON
4. Next → Next → Save
5. **IMPORTANTE**: Ir a pestaña "Credentials" y copiar el "Client Secret"

### Crear Roles
1. Ir a "Realm roles" → "Create role"
2. Crear estos roles:
   - `admin`
   - `doctor`
   - `pharmacist`
   - `patient`
   - `auditor`

### Crear Usuario de Prueba
1. Ir a "Users" → "Add user"
2. Username: `doctor.test`
3. Email: `doctor@test.com`
4. Email verified: ON
5. Create
6. Ir a pestaña "Credentials" → "Set password"
   - Password: `Test123!`
   - Temporary: OFF
7. Ir a pestaña "Role mapping" → "Assign role"
   - Seleccionar rol `doctor`

## 3. Actualizar Client Secret en Backend

Edita el archivo: `eprescription-API/src/ePrescription.API/appsettings.json`

Reemplaza:
```json
"ClientSecret": "REPLACE_WITH_YOUR_CLIENT_SECRET"
```

Con el Client Secret que copiaste de Keycloak.

## 4. Probar con Postman

### Obtener Token

**Request**:
```http
POST http://localhost:8080/realms/eprescription/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=password
&client_id=eprescription-api
&client_secret=<TU_CLIENT_SECRET>
&username=doctor.test
&password=Test123!
```

**Ejemplo con curl**:
```bash
curl -X POST http://localhost:8080/realms/eprescription/protocol/openid-connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=eprescription-api" \
  -d "client_secret=<TU_CLIENT_SECRET>" \
  -d "username=doctor.test" \
  -d "password=Test123!"
```

**Response esperado**:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer"
}
```

## 5. Verificar Tablas en Oracle

### Opción A: Oracle SQL Developer
1. Conectar con:
   - Username: `keycloak_user`
   - Password: `KeycloakPass123!`
   - Hostname: `localhost`
   - Port: `1521`
   - Service: `XEPDB1`

2. Ejecutar:
```sql
SELECT COUNT(*) FROM user_tables;
-- Deberías ver ~100+ tablas de Keycloak
```

### Opción B: Docker CLI
```bash
docker exec -it eprescription-oracle-db sqlplus keycloak_user/KeycloakPass123!@XEPDB1
```

Luego:
```sql
SELECT table_name FROM user_tables WHERE ROWNUM <= 10;
```

## 6. Probar Backend API (Cuando esté corriendo)

### Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "doctor.test",
  "password": "Test123!"
}
```

### Get User Info
```http
GET http://localhost:5000/api/auth/userinfo
Authorization: Bearer <ACCESS_TOKEN>
```

## 🔍 Troubleshooting

### No puedo acceder a http://localhost:8080
```bash
# Verificar que Keycloak está corriendo
docker ps | grep keycloak

# Ver logs
docker logs eprescription-keycloak --tail 50

# Reiniciar si es necesario
docker-compose restart keycloak
```

### Error "Invalid client credentials"
- Verifica que el Client Secret en appsettings.json sea correcto
- Verifica que el client_id sea "eprescription-api"

### Error "Invalid user credentials"
- Verifica que el usuario existe en Keycloak
- Verifica que la contraseña sea correcta
- Verifica que el usuario esté en el realm "eprescription"

## 📚 Documentación Completa

Para más detalles, consulta:
- `docs/KEYCLOAK_CONFIGURATION.md` - Guía completa paso a paso
- `TASK-7-SUMMARY.md` - Resumen del Task 7
- `TASK-7-VALIDATION.md` - Validación de implementación
