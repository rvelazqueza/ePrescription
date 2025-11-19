# 🔐 Manual de Usuario - Sistema de Autenticación

## 📖 Guía Rápida: Activar/Desactivar Pantalla de Login

Esta guía explica cómo configurar el sistema ePrescription para acceder directamente al dashboard sin pasar por la pantalla de autenticación, útil para desarrollo y pruebas.

---

## 🎯 Opción 1: Desactivar Login (Acceso Directo)

### ¿Cuándo usar esto?
- Durante desarrollo y pruebas
- Cuando necesitas acceso rápido sin autenticación
- Para demostraciones del sistema
- En entornos de desarrollo local

### Pasos para desactivar el login:

1. **Abrir el archivo App.tsx**
   - Ubicación: `/App.tsx`
   - Línea aproximada: 23

2. **Buscar la línea de autenticación:**
   ```typescript
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   ```

3. **Cambiar `false` por `true`:**
   ```typescript
   const [isAuthenticated, setIsAuthenticated] = useState(true); // ✅ Acceso directo
   ```

4. **Guardar el archivo**
   - El sistema se recargará automáticamente
   - Accederás directamente al dashboard
   - No se mostrará la pantalla de login

### Resultado:
✅ El sistema iniciará directamente en el dashboard  
✅ No se solicitará usuario ni contraseña  
✅ Tendrás acceso completo a todas las funcionalidades  

⚠️ **Importante:** Esta configuración es SOLO para desarrollo. En producción siempre debe estar en `false`.

---

## 🔒 Opción 2: Activar Login (Modo Seguro)

### ¿Cuándo usar esto?
- En producción
- Cuando necesitas autenticación real
- Para probar el flujo completo de login
- En entornos compartidos o públicos

### Pasos para activar el login:

1. **Abrir el archivo App.tsx**
   - Ubicación: `/App.tsx`
   - Línea aproximada: 23

2. **Buscar la línea de autenticación:**
   ```typescript
   const [isAuthenticated, setIsAuthenticated] = useState(true);
   ```

3. **Cambiar `true` por `false`:**
   ```typescript
   const [isAuthenticated, setIsAuthenticated] = useState(false); // ✅ Login requerido
   ```

4. **Guardar el archivo**
   - El sistema se recargará automáticamente
   - Se mostrará la pantalla de login
   - Se requerirá autenticación para acceder

### Resultado:
✅ Se muestra pantalla de login al iniciar  
✅ Se validan credenciales de usuario  
✅ Se puede probar el flujo de MFA (si está activado)  
✅ Experiencia de usuario completa  

---

## 📍 Ubicación Exacta del Cambio

### Archivo: `/App.tsx`

```typescript
export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 👈 CAMBIAR AQUÍ
  const [authView, setAuthView] = useState<'login' | 'mfa' | 'recovery' | 'onboarding' | 'registration-success'>('login');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  // ... resto del código
}
```

### Cambio específico:
```typescript
// OPCIÓN A: Login desactivado (acceso directo)
const [isAuthenticated, setIsAuthenticated] = useState(true);

// OPCIÓN B: Login activado (modo seguro)
const [isAuthenticated, setIsAuthenticated] = useState(false);
```

---

## 🔄 Comparación de Modos

| Característica | Login Desactivado | Login Activado |
|---------------|-------------------|----------------|
| **Pantalla inicial** | Dashboard | Login |
| **Requiere credenciales** | No | Sí |
| **MFA** | No aplica | Puede activarse |
| **Sesión de usuario** | Automática | Manual |
| **Velocidad de acceso** | Inmediata | Requiere login |
| **Seguridad** | Baja (solo desarrollo) | Alta (producción) |
| **Uso recomendado** | Desarrollo/pruebas | Producción |

---

## 👤 Usuarios de Prueba (cuando login está activado)

### Administrador
```
Usuario: admin@eprescription.com
Contraseña: admin123
Rol: Administrador del sistema
```

### Médico
```
Usuario: dr.juanperez@hospital.com
Contraseña: medico123
Rol: Médico prescriptor
```

### Farmacéutico
```
Usuario: ana.garcia@farmacia.com
Contraseña: farmacia123
Rol: Farmacéutico dispensador
```

### Auditor
```
Usuario: carlos.lopez@auditoria.com
Contraseña: auditor123
Rol: Auditor del sistema
```

---

## 🎓 Casos de Uso Comunes

### Caso 1: Desarrollador trabajando en nueva funcionalidad
**Recomendación:** Login DESACTIVADO
- Acceso rápido al dashboard
- No pierde tiempo en login repetitivo
- Puede probar funcionalidades directamente

### Caso 2: Demo para cliente
**Recomendación:** Login DESACTIVADO
- Acceso inmediato sin interrupciones
- Flujo de presentación más ágil
- Cliente ve directamente las funcionalidades

### Caso 3: Pruebas de integración completas
**Recomendación:** Login ACTIVADO
- Prueba el flujo completo de autenticación
- Valida permisos y roles
- Verifica MFA si está configurado

### Caso 4: Despliegue en producción
**Recomendación:** Login ACTIVADO (OBLIGATORIO)
- Seguridad máxima
- Autenticación real de usuarios
- Cumplimiento normativo (HIPAA, FDA)

---

## ⚙️ Configuración Avanzada

### Cambiar usuario por defecto (modo sin login)

Cuando el login está desactivado, el sistema inicia con el primer usuario del store. Para cambiar esto:

1. **Ubicar la inicialización de sesión en App.tsx:**
   ```typescript
   const user = getUserById(userId) || getAllUsers()[0]; // 👈 Usuario por defecto
   ```

2. **Cambiar a un usuario específico:**
   ```typescript
   // Ejemplo: Iniciar siempre como Dr. Juan Pérez
   const user = getUserById('USR-0001'); // ID específico
   
   // O por email
   const user = getAllUsers().find(u => u.email === 'dr.juanperez@hospital.com');
   ```

### Forzar un rol específico al iniciar

```typescript
initializeSession(
  user.userId,
  user.username,
  user.fullName,
  'ROLE-002', // 👈 Forzar rol específico (Médico)
  user.assignedRoles
);
```

---

## 🔍 Verificación del Cambio

### Cómo verificar que el cambio funcionó:

#### Con login DESACTIVADO:
1. Recargar la página
2. ✅ Deberías ver el dashboard directamente
3. ✅ No se muestra pantalla de login
4. ✅ El menú lateral está disponible
5. ✅ Usuario activo en la esquina superior derecha

#### Con login ACTIVADO:
1. Recargar la página
2. ✅ Deberías ver la pantalla de login
3. ✅ Se solicita usuario y contraseña
4. ✅ Puedes hacer clic en "Registrarse"
5. ✅ Puedes hacer clic en "¿Olvidaste tu contraseña?"

---

## 🛡️ Seguridad y Mejores Prácticas

### ⚠️ ADVERTENCIAS IMPORTANTES

1. **NUNCA desactives el login en producción**
   - Violación de seguridad crítica
   - Incumplimiento de HIPAA
   - Incumplimiento de FDA 21 CFR Part 11
   - Datos de pacientes expuestos

2. **Variables de entorno (recomendado)**
   En lugar de cambiar el código, usa variables de entorno:
   
   ```typescript
   // Ejemplo mejorado (futuro)
   const isDevelopment = import.meta.env.DEV;
   const [isAuthenticated, setIsAuthenticated] = useState(!isDevelopment);
   ```

3. **Git: No hagas commit del cambio**
   - Mantén `false` en el repositorio
   - Cambia solo en tu ambiente local
   - Usa .gitignore si creas un archivo de configuración

---

## 📊 Diagrama de Flujo de Autenticación

```
┌─────────────────────────────────────────────────────────┐
│                    Inicio de App                        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │ isAuthenticated?     │
            └──────────┬───────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
   [true]                        [false]
        │                             │
        │                             ▼
        │              ┌─────────────────────────┐
        │              │ Mostrar LoginPage       │
        │              └──────────┬──────────────┘
        │                         │
        │                         ▼
        │              ┌─────────────────────────┐
        │              │ Usuario ingresa datos   │
        │              └──────────┬──────────────┘
        │                         │
        │                         ▼
        │              ┌─────────────────────────┐
        │              │ ¿MFA requerido?         │
        │              └──────┬────────┬─────────┘
        │                     │        │
        │               [Sí]  │        │  [No]
        │                     │        │
        │                     ▼        ▼
        │        ┌────────────────┐   │
        │        │ MFAVerification│   │
        │        └────────┬───────┘   │
        │                 │           │
        │                 └───────┬───┘
        │                         │
        │                         ▼
        │              ┌─────────────────────────┐
        │              │ Validación exitosa      │
        │              │ setIsAuthenticated(true)│
        │              └──────────┬──────────────┘
        │                         │
        └─────────────────────────┴──────────────┐
                                                  │
                                                  ▼
                                   ┌──────────────────────────┐
                                   │ Renderizar <NewLayout>   │
                                   │ + Dashboard/Páginas      │
                                   └──────────────────────────┘
```

---

## 🎬 Video Tutorial (Próximamente)

Estamos preparando un video tutorial que muestra:
- Cómo cambiar entre modos
- Demostraciones prácticas
- Casos de uso comunes
- Mejores prácticas de seguridad

---

## 📞 Soporte

¿Tienes dudas sobre la configuración?

1. **Revisa esta documentación**
2. **Consulta los archivos de ejemplo:**
   - `/COMO_USAR_AUTH.md`
   - `/AUTH_MFA_GUIDE.md`
3. **Verifica que el cambio se guardó correctamente**
4. **Recarga el navegador con Ctrl+F5**

---

## 📝 Checklist de Verificación

Antes de desplegar a producción, verifica:

- [ ] `isAuthenticated` está en `false`
- [ ] Las credenciales de prueba NO están en el código de producción
- [ ] MFA está activado para usuarios críticos
- [ ] Logs de auditoría están habilitados
- [ ] Certificados SSL están configurados
- [ ] Variables de entorno están configuradas
- [ ] No hay credenciales hardcodeadas
- [ ] El sistema cumple con HIPAA
- [ ] El sistema cumple con FDA 21 CFR Part 11

---

## 🎓 Conceptos Clave

### isAuthenticated
- **Tipo:** Boolean
- **Ubicación:** Estado de React en App.tsx
- **Función:** Controla si el usuario está autenticado
- **Valores:** 
  - `true` = Acceso concedido (sin login)
  - `false` = Requiere autenticación

### authView
- **Tipo:** String
- **Valores posibles:**
  - `'login'` = Pantalla de inicio de sesión
  - `'mfa'` = Verificación de autenticación multifactor
  - `'recovery'` = Recuperación de contraseña
  - `'onboarding'` = Registro de nuevo usuario
  - `'registration-success'` = Confirmación de registro

### currentUserId
- **Tipo:** String | null
- **Función:** Almacena el ID del usuario actual
- **Uso:** Identificación y permisos

---

## 🔄 Historial de Cambios

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2025-01-14 | 1.0 | Creación del documento |
| 2025-01-14 | 1.1 | Agregado diagrama de flujo |
| 2025-01-14 | 1.2 | Agregados usuarios de prueba |

---

**Última actualización:** 14 de enero de 2025  
**Autor:** Sistema ePrescription  
**Categoría:** Manual de Usuario  
**Nivel:** Básico  
**Tiempo de lectura:** ~10 minutos

---

## 💡 Tip Final

Para desarrollo ágil, puedes crear dos archivos de configuración:

```typescript
// config.dev.ts
export const AUTH_CONFIG = {
  requireLogin: false
};

// config.prod.ts
export const AUTH_CONFIG = {
  requireLogin: true
};
```

Y luego importar según el entorno. Esto evita modificar App.tsx repetidamente.

---

**¿Listo para empezar?** Sigue los pasos de la Opción 1 o 2 según tu necesidad. ¡Es muy fácil!
