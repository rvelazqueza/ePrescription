# 🚀 Cómo usar el flujo de Autenticación

## 📍 Estado actual de la aplicación

Por defecto, la aplicación ahora inicia en la **pantalla de Login** (no autenticada).

---

## 🔐 Flujo de Login

### **Opción 1: Usuario + Contraseña + MFA**

1. **Pantalla de Login** aparece automáticamente al cargar la app
2. Usa la pestaña **"Usuario y Contraseña"**
3. Ingresa credenciales demo:
   ```
   Email: dr.martinez@hospital.cr
   Contraseña: Demo123!
   ```
4. Click en **"Ingresar"**
5. Como este usuario tiene MFA habilitado, pasarás a la **verificación MFA**
6. Ingresa cualquier código de 6 dígitos (ej: `123456`)
7. Accederás al dashboard

### **Opción 2: Firma Digital BCCR (GAUDI)**

1. En la pantalla de Login, selecciona la pestaña **"Firma Digital"**
2. Ingresa una cédula válida:
   ```
   Cédula: 1-0456-0789
   ```
3. Click en **"Continuar con GAUDI"**
4. Se simulará la validación del certificado digital
5. Si es exitosa, accederás directamente (sin MFA adicional)

---

## 📝 Flujo de Registro (Onboarding)

1. En la pantalla de Login, click en **"Crear cuenta"**
2. **Paso 1: Datos básicos**
   - Nombre completo
   - Tipo y número de identificación
   - Correo electrónico
   - Teléfono (opcional)
   - Método de autenticación preferido:
     - **Usuario + Contraseña**: Crea una contraseña (mín. 12 caracteres)
     - **Firma Digital**: Usarás tu certificado BCCR
   - Acepta términos y privacidad

3. **Paso 2: Verificación de contacto**
   - **Email**: Click "Enviar código" → Ingresa código de 6 dígitos (ej: `123456`)
   - **Teléfono** (opcional): Click "Enviar código" → Ingresa OTP

4. **Paso 3: MFA (opcional)**
   - **Configurar ahora**: Escanea QR o ingresa secret, verifica con código
   - **Configurar más tarde**: Continúa (se forzará en primer login)

5. **Paso 4: Confirmación**
   - Revisa tu información
   - Click "Enviar solicitud"
   - Verás pantalla de **"Solicitud enviada"** con próximos pasos

6. **Espera aprobación** (1-2 días hábiles simulados en demo)

---

## 🔑 Recuperación de Contraseña

1. En Login, click en **"Olvidé mi contraseña"**
2. Ingresa tu email
3. Click "Enviar enlace de recuperación"
4. Recibirás confirmación (mensaje neutral - no revela si existe cuenta)
5. En producción: recibirías email con enlace válido por 15 minutos
6. Podrás crear nueva contraseña con validación de fortaleza

---

## 👨‍💼 Panel Administrativo - Aprobación de Usuarios

### Para acceder (una vez autenticado):

1. Menú lateral → **"Seguridad y usuarios"**
2. Click en **"Aprobación de usuarios"**

### Funcionalidades:

- **Ver solicitudes pendientes** con badges de estado
- **Filtrar** por: Todas / Pendientes / Aprobadas / Rechazadas
- **Buscar** por nombre, email o identificación
- **Ver detalles** completos de cada solicitud:
  - Información personal
  - Verificaciones (email, teléfono, términos)
  - Puntuación de riesgo (0-1)
  - Método de autenticación preferido

### Aprobar una solicitud:

1. Click en **"Aprobar"** (botón verde)
2. Confirma la acción
3. Se envía email automático al usuario
4. Usuario puede iniciar sesión

### Rechazar una solicitud:

1. Click en **"Rechazar"** (botón rojo)
2. Ingresa un **motivo claro** (obligatorio)
   - Ejemplo: "Documentación incompleta - No se pudo verificar número de colegiado"
3. Confirma el rechazo
4. Se envía email con el motivo al usuario

---

## 🖥️ Gestión de Sesiones Activas

### Para acceder:

1. Menú lateral → **"Seguridad y usuarios"**
2. Click en **"Mis sesiones"**

### Funcionalidades:

- **Sesión actual**: Información del dispositivo donde estás ahora
- **Otras sesiones**: Lista de dispositivos activos
- **Dispositivos confiables** vs **nuevos** (badge visual)
- **Información detallada**:
  - Nombre del dispositivo
  - IP y ubicación
  - Última actividad
  - Fecha de inicio y expiración

### Acciones:

- **Cerrar sesión individual**: Click en el botón de sesión específica
- **Cerrar todas las sesiones**: Botón rojo al final (excepto la actual)

---

## 🔐 Cerrar Sesión

### Opción 1: Desde el menú de usuario

1. Click en tu **nombre/avatar** en la esquina superior derecha
2. Se abre dropdown menu
3. Click en **"Cerrar sesión"** (icono rojo)

### Opción 2: Cambiar manualmente

En `/App.tsx` línea ~586:
```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false);
```
- `false` = Muestra flujo de login
- `true` = Salta directo al dashboard (para desarrollo rápido)

---

## 📊 Datos de Demo

### Usuarios existentes:

```javascript
// Usuario 1 - Con MFA
Email: dr.martinez@hospital.cr
Password: Demo123!
Tiene: TOTP + WebAuthn
Cédula: 1-0234-0567

// Usuario 2 - Con Firma Digital
Email: dra.rojas@clinica.cr
Password: Demo123!
Tiene: TOTP
Cédula: 1-0456-0789
Firma Digital: ✓ Vinculada
```

### Solicitudes de registro pendientes:

```javascript
// Solicitud 1
Nombre: Dr. Luis Hernández Quesada
Cédula: 1-0678-0901
Email: luis.hernandez@medico.cr
Estado: Pendiente
Verificaciones: Email ✓, Teléfono ✓

// Solicitud 2
Nombre: Dra. María Céspedes Mora
Cédula: 1-0789-0123
Email: maria.cespedes@clinica.cr
Estado: Pendiente
Verificaciones: Email ✓

// Solicitud 3 (rechazada)
Nombre: Dr. Roberto Alvarado Soto
Cédula: 1-0890-0234
Estado: Rechazada
Motivo: "Documentación incompleta - No se pudo verificar número de colegiado"
```

### Códigos de verificación (todos aceptan):

```
MFA/TOTP: Cualquier código de 6 dígitos (ej: 123456)
Email OTP: Cualquier código de 6 dígitos
Phone OTP: Cualquier código de 6 dígitos
```

---

## 🎨 Rutas del Sistema

### Autenticación (no requiere login):
- `/` → Login Page
- (Flujo interno) → MFA Verification
- (Flujo interno) → Password Recovery
- (Flujo interno) → Onboarding (4 pasos)
- (Flujo interno) → Registration Success

### Seguridad (requiere login + permisos admin):
- `/seguridad/usuarios` → Gestión de usuarios
- `/seguridad/aprobaciones` → **Aprobación de solicitudes** ⭐
- `/seguridad/registro` → Registro de usuarios (legacy)
- `/seguridad/roles` → Roles y permisos
- `/seguridad/parametros` → Parámetros de seguridad
- `/seguridad/bloqueos` → Bloqueos y desbloqueos
- `/seguridad/sesiones` → Sesiones de usuario (admin)
- `/seguridad/mis-sesiones` → **Mis sesiones activas** ⭐

---

## 🛡️ Seguridad Implementada

✅ **Contraseñas robustas** (12+ caracteres, 3+ tipos)  
✅ **MFA adaptativo** por riesgo  
✅ **Firma Digital BCCR** (GAUDI)  
✅ **Gestión de sesiones** con device fingerprinting  
✅ **Mensajes neutros** (no revelan existencia de cuentas)  
✅ **Rate limiting** simulado  
✅ **Auditoría completa** de eventos  
✅ **Validación en tiempo real**  

---

## 📚 Documentación Completa

Para detalles técnicos completos, ver:
- **[AUTH_MFA_GUIDE.md](/AUTH_MFA_GUIDE.md)** - Guía técnica completa

---

## 🐛 Troubleshooting

### "No veo la pantalla de login"
→ Verifica que en `/App.tsx` línea ~586 esté:
```typescript
const [isAuthenticated, setIsAuthenticated] = useState(false);
```

### "No encuentro las opciones en el menú"
→ Debes estar **autenticado** para ver el menú del sidebar.  
→ **Seguridad y usuarios** → Despliega el submenú con las opciones.

### "El login no funciona"
→ Usa las credenciales de demo exactas:
```
Email: dr.martinez@hospital.cr
Password: Demo123!
```

### "No aparece la verificación MFA"
→ Es correcto! El usuario `dr.martinez@hospital.cr` tiene MFA habilitado.  
→ Ingresa cualquier código de 6 dígitos.

---

## 🎯 Flujo Recomendado para Demo

1. **Iniciar app** → Verás Login
2. **Registrar nuevo usuario**:
   - Click "Crear cuenta"
   - Completa los 4 pasos
   - Observa pantalla de éxito
3. **Volver a Login** → Click "Volver al inicio de sesión"
4. **Login como admin**:
   - Email: `dr.martinez@hospital.cr`
   - Password: `Demo123!`
   - Código MFA: `123456`
5. **Ir a Aprobaciones**:
   - Menú → Seguridad y usuarios → Aprobación de usuarios
   - Ver solicitudes pendientes (incluida la que acabas de crear)
   - Aprobar o rechazar solicitudes
6. **Ver tus sesiones**:
   - Menú → Seguridad y usuarios → Mis sesiones
   - Observa dispositivos activos
7. **Cerrar sesión**:
   - Click en avatar → Cerrar sesión
   - Vuelve a Login

---

**¡Listo!** El sistema completo de autenticación está funcionando.
