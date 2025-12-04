# Guía de Configuración de Keycloak para ePrescription

## Requisitos Previos

- Docker y Docker Compose instalados
- Contenedores de Oracle y Keycloak corriendo
- Acceso a http://localhost:8080

## Paso 1: Acceder a Keycloak Admin Console

1. Abrir navegador en: **http://localhost:8080**
2. Hacer clic en "Administration Console"
3. Iniciar sesión con:
   - **Username**: `admin`
   - **Password**: `admin123`

## Paso 2: Crear Realm "eprescription"

1. En el menú superior izquierdo, hacer clic en el dropdown que dice "master"
2. Hacer clic en "Create Realm"
3. Configurar:
   - **Realm name**: `eprescription`
   - **Enabled**: ON
4. Hacer clic en "Create"

## Paso 3: Crear Client "eprescription-api"

1. En el menú lateral, ir a **Clients**
2. Hacer clic en "Create client"
3. En la pestaña "General Settings":
   - **Client type**: OpenID Connect
   - **Client ID**: `eprescription-api`
4. Hacer clic en "Next"
5. En la pestaña "Capability config":
   - **Client authentication**: ON (para confidential client)
   - **Authorization**: OFF
   - **Authentication flow**:
     - ✅ Standard flow
     - ✅ Direct access grants
     - ❌ Implicit flow
     - ❌ Service accounts roles
6. Hacer clic en "Next"
7. En la pestaña "Login settings":
   - **Root URL**: `http://localhost:5000`
   - **Home URL**: `http://localhost:5000`
   - **Valid redirect URIs**: 
     - `http://localhost:5000/*`
     - `http://localhost:4200/*`
   - **Valid post logout redirect URIs**: `+`
   - **Web origins**: 
     - `http://localhost:5000`
     - `http://localhost:4200`
8. Hacer clic en "Save"

### Obtener Client Secret

1. Ir a la pestaña "Credentials" del client
2. Copiar el **Client Secret** (lo necesitaremos para el backend)
3. Guardar este valor en un lugar seguro

**Ejemplo de Client Secret**: `xxxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

## Paso 4: Crear Roles

1. En el menú lateral, ir a **Realm roles**
2. Hacer clic en "Create role"
3. Crear los siguientes roles uno por uno:

### Role: admin
- **Role name**: `admin`
- **Description**: `Administrator with full system access`
- Hacer clic en "Save"

### Role: doctor
- **Role name**: `doctor`
- **Description**: `Medical doctor who can create prescriptions`
- Hacer clic en "Save"

### Role: pharmacist
- **Role name**: `pharmacist`
- **Description**: `Pharmacist who can dispense medications`
- Hacer clic en "Save"

### Role: patient
- **Role name**: `patient`
- **Description**: `Patient who can view their prescriptions`
- Hacer clic en "Save"

### Role: auditor
- **Role name**: `auditor`
- **Description**: `Auditor who can view audit logs`
- Hacer clic en "Save"

## Paso 5: Crear Usuarios de Prueba

### Usuario 1: Admin
1. En el menú lateral, ir a **Users**
2. Hacer clic en "Add user"
3. Configurar:
   - **Username**: `admin.user`
   - **Email**: `admin@eprescription.com`
   - **First name**: `Admin`
   - **Last name**: `User`
   - **Email verified**: ON
   - **Enabled**: ON
4. Hacer clic en "Create"
5. Ir a la pestaña "Credentials"
6. Hacer clic en "Set password"
   - **Password**: `Admin123!`
   - **Temporary**: OFF
7. Hacer clic en "Save"
8. Ir a la pestaña "Role mapping"
9. Hacer clic en "Assign role"
10. Seleccionar el rol `admin`
11. Hacer clic en "Assign"

### Usuario 2: Doctor
1. Hacer clic en "Add user"
2. Configurar:
   - **Username**: `doctor.smith`
   - **Email**: `doctor.smith@eprescription.com`
   - **First name**: `John`
   - **Last name**: `Smith`
   - **Email verified**: ON
   - **Enabled**: ON
3. Hacer clic en "Create"
4. Ir a la pestaña "Credentials"
5. Hacer clic en "Set password"
   - **Password**: `Doctor123!`
   - **Temporary**: OFF
6. Hacer clic en "Save"
7. Ir a la pestaña "Role mapping"
8. Hacer clic en "Assign role"
9. Seleccionar el rol `doctor`
10. Hacer clic en "Assign"

### Usuario 3: Pharmacist
1. Hacer clic en "Add user"
2. Configurar:
   - **Username**: `pharmacist.jones`
   - **Email**: `pharmacist.jones@eprescription.com`
   - **First name**: `Mary`
   - **Last name**: `Jones`
   - **Email verified**: ON
   - **Enabled**: ON
3. Hacer clic en "Create"
4. Ir a la pestaña "Credentials"
5. Hacer clic en "Set password"
   - **Password**: `Pharmacist123!`
   - **Temporary**: OFF
6. Hacer clic en "Save"
7. Ir a la pestaña "Role mapping"
8. Hacer clic en "Assign role"
9. Seleccionar el rol `pharmacist`
10. Hacer clic en "Assign"

### Usuario 4: Patient
1. Hacer clic en "Add user"
2. Configurar:
   - **Username**: `patient.doe`
   - **Email**: `patient.doe@eprescription.com`
   - **First name**: `Jane`
   - **Last name**: `Doe`
   - **Email verified**: ON
   - **Enabled**: ON
3. Hacer clic en "Create"
4. Ir a la pestaña "Credentials"
5. Hacer clic en "Set password"
   - **Password**: `Patient123!`
   - **Temporary**: OFF
6. Hacer clic en "Save"
7. Ir a la pestaña "Role mapping"
8. Hacer clic en "Assign role"
9. Seleccionar el rol `patient`
10. Hacer clic en "Assign"

## Paso 6: Verificar Tablas en Oracle

Ahora vamos a verificar que Keycloak creó sus tablas en Oracle correctamente.

### Opción A: Usando Oracle SQL Developer

1. Abrir Oracle SQL Developer
2. Crear nueva conexión:
   - **Connection Name**: Keycloak Schema
   - **Username**: `keycloak_user`
   - **Password**: `KeycloakPass123!`
   - **Hostname**: `localhost`
   - **Port**: `1521`
   - **Service name**: `XEPDB1`
3. Conectar
4. Ejecutar query:
```sql
SELECT table_name 
FROM user_tables 
ORDER BY table_name;
```

### Opción B: Usando Docker CLI

```bash
docker exec -it eprescription-oracle-db sqlplus keycloak_user/KeycloakPass123!@XEPDB1
```

Luego ejecutar:
```sql
SELECT COUNT(*) as total_tables 
FROM user_tables;

SELECT table_name 
FROM user_tables 
WHERE ROWNUM <= 10
ORDER BY table_name;
```

### Tablas Esperadas de Keycloak

Deberías ver tablas como:
- `DATABASECHANGELOG`
- `DATABASECHANGELOGLOCK`
- `REALM`
- `CLIENT`
- `USER_ENTITY`
- `ROLE_ENTITY`
- `USER_ROLE_MAPPING`
- `CREDENTIAL`
- Y muchas más (aproximadamente 100+ tablas)

## Resumen de Configuración

### Realm
- **Name**: `eprescription`
- **Enabled**: Yes

### Client
- **Client ID**: `eprescription-api`
- **Client Type**: Confidential
- **Root URL**: `http://localhost:5000`
- **Valid Redirect URIs**: `http://localhost:5000/*`, `http://localhost:4200/*`

### Roles
- `admin` - Administrador del sistema
- `doctor` - Médico que crea prescripciones
- `pharmacist` - Farmacéutico que dispensa medicamentos
- `patient` - Paciente que consulta prescripciones
- `auditor` - Auditor que revisa logs

### Usuarios de Prueba
| Username | Password | Role | Email |
|----------|----------|------|-------|
| admin.user | Admin123! | admin | admin@eprescription.com |
| doctor.smith | Doctor123! | doctor | doctor.smith@eprescription.com |
| pharmacist.jones | Pharmacist123! | pharmacist | pharmacist.jones@eprescription.com |
| patient.doe | Patient123! | patient | patient.doe@eprescription.com |

## Endpoints de Keycloak

### Token Endpoint
```
POST http://localhost:8080/realms/eprescription/protocol/openid-connect/token
```

### UserInfo Endpoint
```
GET http://localhost:8080/realms/eprescription/protocol/openid-connect/userinfo
```

### Logout Endpoint
```
POST http://localhost:8080/realms/eprescription/protocol/openid-connect/logout
```

### Well-Known Configuration
```
GET http://localhost:8080/realms/eprescription/.well-known/openid-configuration
```

## Probar Autenticación con Postman

### 1. Obtener Token

**Request**:
```http
POST http://localhost:8080/realms/eprescription/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=password
&client_id=eprescription-api
&client_secret=<TU_CLIENT_SECRET>
&username=doctor.smith
&password=Doctor123!
```

**Response esperado**:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "not-before-policy": 0,
  "session_state": "...",
  "scope": "profile email"
}
```

### 2. Validar Token

**Request**:
```http
GET http://localhost:8080/realms/eprescription/protocol/openid-connect/userinfo
Authorization: Bearer <ACCESS_TOKEN>
```

**Response esperado**:
```json
{
  "sub": "...",
  "email_verified": true,
  "name": "John Smith",
  "preferred_username": "doctor.smith",
  "given_name": "John",
  "family_name": "Smith",
  "email": "doctor.smith@eprescription.com"
}
```

## Siguiente Paso

Una vez completada esta configuración, estarás listo para:
1. Implementar `IAuthenticationService` en el backend .NET
2. Configurar JWT authentication en `Program.cs`
3. Crear `AuthController` con endpoints de login/logout
4. Integrar el frontend Angular con Keycloak

## Notas Importantes

- **Client Secret**: Guarda el client secret de forma segura. Lo necesitarás en `appsettings.json`
- **Passwords**: Los passwords de prueba son simples para desarrollo. En producción usa políticas más estrictas
- **Roles**: Los roles se pueden extender según necesidades del negocio
- **Oracle**: Keycloak está usando Oracle como base de datos, todas las configuraciones se persisten allí

## Troubleshooting

### Problema: No puedo acceder a http://localhost:8080
**Solución**: Verificar que el contenedor esté corriendo:
```bash
docker ps | grep keycloak
docker logs eprescription-keycloak
```

### Problema: Error al crear usuario
**Solución**: Verificar que el realm "eprescription" esté seleccionado en el dropdown superior

### Problema: No veo las tablas en Oracle
**Solución**: Verificar que estás conectado con el usuario `keycloak_user` y no con `sys` o `system`
