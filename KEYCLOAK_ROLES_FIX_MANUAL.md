# Cómo Hacer que los Roles Aparezcan en el Token JWT

## Problema:
Los roles están asignados a los usuarios, pero no aparecen en el token JWT.

## Solución Manual (5 minutos):

### Paso 1: Acceder a Keycloak Admin Console
1. Ve a: http://localhost:8080
2. Login: admin / admin123

### Paso 2: Configurar el Client
1. En el menú lateral, haz clic en **"Clients"**
2. Busca y haz clic en **"eprescription-api"**

### Paso 3: Agregar Client Scope
1. Ve a la pestaña **"Client scopes"**
2. Haz clic en **"Add client scope"**
3. Selecciona **"roles"** de la lista
4. Haz clic en **"Add"** → **"Default"**

### Paso 4: Configurar Mapper (Alternativa si lo anterior no funciona)
1. Dentro del client "eprescription-api"
2. Ve a la pestaña **"Client scopes"**
3. Haz clic en **"eprescription-api-dedicated"** (o el scope dedicado del client)
4. Ve a la pestaña **"Mappers"**
5. Haz clic en **"Add mapper"** → **"By configuration"**
6. Selecciona **"User Realm Role"**
7. Configura:
   - **Name**: realm-roles
   - **Token Claim Name**: realm_access.roles
   - **Claim JSON Type**: String
   - **Add to ID token**: ON
   - **Add to access token**: ON
   - **Add to userinfo**: ON
   - **Multivalued**: ON
8. Haz clic en **"Save"**

### Paso 5: Verificar
Ejecuta el test de autenticación:
```powershell
.\test-keycloak-auth.ps1 -Username 'doctor1' -Password 'doctor123'
```

Ahora deberías ver el rol "doctor" en la lista de roles.

## Verificación Rápida:

Si ves esto en los roles:
```
Roles:
  - offline_access
  - default-roles-eprescription
  - doctor              ← Este es el rol que queremos ver
  - uma_authorization
```

¡Entonces está funcionando correctamente!

## Nota:
Esta configuración es necesaria solo una vez. Una vez configurado, todos los tokens incluirán los roles del realm automáticamente.
