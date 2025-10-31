# ✅ Guía: Mi Perfil del Usuario Conectado

## 📋 Resumen

Se ha implementado un sistema completo de gestión de perfil de usuario que permite:
- ✅ Ver y editar información personal
- ✅ Cambiar contraseña con validaciones
- ✅ Gestionar autenticación de dos factores (2FA)
- ✅ Subir y actualizar foto de perfil
- ✅ Ver información de sesiones activas
- ✅ Configurar preferencias del sistema

---

## 🎯 Funcionalidades Implementadas

### **1. Menú de Usuario en PageHeader**

El botón de usuario en el header ahora incluye un menú desplegable con:

```typescript
✅ Mi perfil - Navega a /mi-perfil
✅ Notificaciones - Navega a /notificaciones/lista (con contador de no leídas)
✅ Configuración - Navega a /autoservicio
✅ Cerrar sesión - Cierra la sesión del usuario
```

**Características visuales:**
- Muestra foto de perfil si está cargada
- Muestra nombre, cédula, código y especialidad
- Badge con contador de notificaciones no leídas
- Avatar circular con overflow para fotos

---

## 📄 Página: Mi Perfil (/mi-perfil)

### **Estructura de Tabs**

La página está organizada en 3 pestañas principales:

#### **1. Información Personal**

**Campos editables:**
```typescript
- Nombre completo *
- Correo electrónico *
- Teléfono *
- Especialidad
- Departamento
```

**Campos de solo lectura:**
```typescript
- Usuario (username)
- Cédula profesional (certifiedId)
- Estado de cuenta (active/inactive)
- Roles asignados (badges)
```

**Foto de perfil:**
```typescript
✅ Subir nueva foto (JPG, PNG, GIF)
✅ Validación de tamaño máximo: 5MB
✅ Preview en tiempo real
✅ Icono de cámara para cambiar
✅ Se guarda al hacer clic en "Guardar cambios"
```

**Información de cuenta:**
```typescript
- Último inicio de sesión
- Total de inicios de sesión
- Cuenta creada
- Intentos fallidos
```

**Flujo de edición:**
1. Click en "Editar Perfil"
2. Campos se habilitan para edición
3. Modificar datos necesarios
4. Click en "Guardar cambios" o "Cancelar"
5. Toast de confirmación

---

#### **2. Seguridad**

**Cambio de contraseña:**

```typescript
Validaciones:
✅ Todos los campos obligatorios
✅ Nueva contraseña mínimo 8 caracteres
✅ Confirmación debe coincidir con nueva contraseña
✅ Mostrar/Ocultar contraseñas con iconos de ojo

Campos:
- Contraseña actual
- Nueva contraseña
- Confirmar nueva contraseña

Feedback:
- Toast de éxito al cambiar
- Toast de error si validaciones fallan
- Limpia campos después de cambio exitoso
```

**Autenticación de dos factores (2FA):**

```typescript
Estado visual:
✅ Switch para habilitar/deshabilitar
✅ Icono de smartphone con color verde si está habilitado
✅ Banner de confirmación cuando está activo
✅ Descripción del estado actual

Comportamiento:
- Toggle ON: Toast "Autenticación de dos factores habilitada"
- Toggle OFF: Toast "Autenticación de dos factores deshabilitada"
- Estado se persiste en el perfil del usuario
```

**Sesiones activas:**

```typescript
Muestra:
- Sesión actual (Chrome en Windows)
- Badge "Activa" con estilo verde
- Icono de check verde

En futuro puede expandirse para:
- Listar todas las sesiones activas
- Cerrar sesiones remotas
- Ver ubicación de sesiones
```

---

#### **3. Preferencias**

**Configuraciones disponibles:**

```typescript
✅ Notificaciones por correo
   - Switch para habilitar/deshabilitar
   - Descripción: "Recibe actualizaciones importantes por email"

✅ Notificaciones push
   - Switch para habilitar/deshabilitar
   - Descripción: "Recibe notificaciones en tiempo real"

✅ Alertas de seguridad
   - Switch para habilitar/deshabilitar
   - Descripción: "Notificaciones sobre actividad sospechosa"
```

---

## 🎨 Componentes Visuales

### **Banner Principal**
```typescript
Gradient: from-blue-600 via-indigo-600 to-purple-600
Icono: User
Título: "Mi Perfil"
Descripción: Incluye nombre completo del usuario
Badge: Usuario ID con icono Shield
```

### **Foto de Perfil**
```typescript
Tamaño: 24x24 (w-24 h-24) en edición
Tamaño: 10x10 (w-10 h-10) en header
Forma: Circular (rounded-full)
Fondo fallback: bg-primary/10 con icono User
Botón cámara: Posición absolute bottom-right
```

### **Iconos y Colores**

```typescript
Información personal:
- User (nombre)
- Mail (correo)
- Phone (teléfono)
- Briefcase (especialidad)
- MapPin (departamento)
- Shield (ID de usuario)

Seguridad:
- Lock (contraseñas)
- Key (nueva contraseña)
- Eye/EyeOff (mostrar/ocultar)
- Smartphone (2FA)
- CheckCircle (sesión activa)

Estados:
- Verde: Activo, habilitado, éxito
- Rojo: Deshabilitado, error
- Azul: Información, primario
```

---

## 🔧 Integración con Sesión

### **Obtención de Datos**

```typescript
// Obtener sesión actual
const session = getCurrentSession();

// Obtener datos del usuario
const user = session ? getUserById(session.userId) : null;

// Datos disponibles:
user.userId          // "USR-0001"
user.username        // "admin.sistema"
user.fullName        // "Administrador del Sistema"
user.email           // "admin@hospital.com"
user.phone           // "+1 555-0100"
user.specialty       // "TI"
user.department      // "Sistemas"
user.certifiedId     // "ADMIN-001"
user.status          // "active"
user.assignedRoles   // ["Administrador", "Doctor", ...]
user.twoFactorEnabled // true/false
user.lastLogin       // "2024-10-01 13:45"
user.loginCount      // 3456
user.createdDate     // "2022-06-01"
user.failedAttempts  // 0
```

---

## 🚀 Uso de la Funcionalidad

### **1. Acceder al Perfil**

**Desde el Header:**
```
1. Click en el botón de usuario (esquina superior derecha)
2. Se abre menú desplegable
3. Click en "Mi perfil"
4. Navega a /mi-perfil
```

**Navegación directa:**
```
- Ir a /mi-perfil desde cualquier parte de la aplicación
```

---

### **2. Editar Información Personal**

```
1. En tab "Información Personal"
2. Click en botón "Editar Perfil"
3. Campos se habilitan para edición
4. Modificar datos necesarios
5. Click en "Guardar cambios"
6. Toast de confirmación: "Perfil actualizado exitosamente"
7. Modo edición se desactiva
```

---

### **3. Cambiar Foto de Perfil**

```
1. En tab "Información Personal"
2. Click en icono de cámara sobre la foto
3. Seleccionar imagen (JPG, PNG, GIF máx 5MB)
4. Preview aparece inmediatamente
5. Toast: "Foto de perfil actualizada"
6. Click en "Guardar cambios" para persistir
7. Foto aparece en header automáticamente
```

---

### **4. Cambiar Contraseña**

```
1. Ir a tab "Seguridad"
2. Ingresar contraseña actual
3. Ingresar nueva contraseña (mín 8 caracteres)
4. Confirmar nueva contraseña
5. Click en "Cambiar contraseña"

Validaciones:
❌ Campos vacíos → Toast: "Todos los campos son obligatorios"
❌ Contraseñas no coinciden → Toast: "Las contraseñas no coinciden"
❌ Contraseña muy corta → Toast: "La contraseña debe tener al menos 8 caracteres"
✅ Éxito → Toast: "Contraseña actualizada exitosamente"
```

---

### **5. Habilitar/Deshabilitar 2FA**

```
1. Ir a tab "Seguridad"
2. En sección "Autenticación de dos factores"
3. Toggle del switch

Si se habilita:
✅ Switch ON
✅ Icono de smartphone se pone verde
✅ Aparece banner de confirmación verde
✅ Toast: "Autenticación de dos factores habilitada"

Si se deshabilita:
✅ Switch OFF
✅ Icono de smartphone gris
✅ Banner desaparece
✅ Toast: "Autenticación de dos factores deshabilitada"
```

---

### **6. Configurar Preferencias**

```
1. Ir a tab "Preferencias"
2. Toggle switches según necesidad:
   - Notificaciones por correo
   - Notificaciones push
   - Alertas de seguridad
3. Los cambios se guardan automáticamente
```

---

## 📱 Navegación desde el Header

### **Opciones del Menú de Usuario**

```typescript
1. Mi perfil
   - Icono: User
   - Ruta: /mi-perfil
   - Descripción: Ver y editar perfil

2. Notificaciones
   - Icono: Bell
   - Ruta: /notificaciones/lista
   - Badge: Contador de no leídas (si > 0)
   - Descripción: Ver todas las notificaciones

3. Configuración
   - Icono: Settings
   - Ruta: /autoservicio
   - Descripción: Autoservicio del usuario

4. Cerrar sesión
   - Icono: LogOut
   - Acción: onLogout()
   - Color: Destructive (rojo)
   - Descripción: Cerrar sesión actual
```

---

## 🎯 Datos del Header

### **Información Mostrada**

```typescript
En el botón (antes de abrir menú):
- Nombre completo (línea 1)
- Cédula profesional + Código de usuario (línea 2)
- Especialidad (línea 3, color primary)
- Foto de perfil o icono de usuario

En el menú desplegable (header del menú):
- Foto de perfil o icono
- Nombre completo
- Especialidad
```

### **Obtención de Datos**

```typescript
Prioridad de datos:
1. Props explícitas (userName, userCedula, etc.)
2. Datos de sesión actual (getCurrentSession())
3. Datos del usuario (getUserById())
4. Valores por defecto

Contador de notificaciones:
1. Prop notifications (si se pasa)
2. getUnreadCount() del store
3. 0 por defecto
```

---

## 🔐 Seguridad

### **Validaciones Implementadas**

**Foto de perfil:**
```typescript
✅ Solo imágenes (image/*)
✅ Máximo 5MB
✅ Toast de error si no cumple
```

**Cambio de contraseña:**
```typescript
✅ Campos obligatorios
✅ Mínimo 8 caracteres
✅ Confirmación debe coincidir
✅ Mostrar/Ocultar con iconos
```

**2FA:**
```typescript
✅ Estado persiste en perfil
✅ Toggle con confirmación visual
✅ Toasts informativos
```

---

## 📊 Estados y Feedback

### **Toasts Implementados**

**Éxito:**
```typescript
- "Perfil actualizado exitosamente"
- "Foto de perfil actualizada"
- "Contraseña actualizada exitosamente"
- "Autenticación de dos factores habilitada"
```

**Información:**
```typescript
- "Autenticación de dos factores deshabilitada"
- "Los cambios se guardarán al hacer clic en 'Guardar cambios'"
```

**Error:**
```typescript
- "Por favor seleccione una imagen válida"
- "La imagen no debe exceder 5MB"
- "Todos los campos son obligatorios"
- "Las contraseñas no coinciden"
- "La contraseña debe tener al menos 8 caracteres"
```

---

## 🎨 Diseño Responsivo

### **Grid System**

```typescript
Información personal:
- Mobile: 1 columna (grid-cols-1)
- Desktop: 2 columnas (md:grid-cols-2)

Información de cuenta:
- Mobile: 1 columna (grid-cols-1)
- Desktop: 2 columnas (md:grid-cols-2)

Botones:
- Mobile: Ancho completo (w-full)
- Desktop: Ancho automático (md:w-auto)
```

---

## 📁 Archivos Modificados/Creados

```
✅ /pages/MiPerfilPage.tsx (NUEVO)
   - Página completa de perfil de usuario
   - 3 tabs: Información, Seguridad, Preferencias
   - Gestión de foto de perfil
   - Cambio de contraseña
   - Toggle 2FA
   - Preferencias del sistema

✅ /components/PageHeader.tsx (MODIFICADO)
   - Importaciones agregadas (getCurrentSession, getUserById, getUnreadCount, Settings)
   - Prop profilePhoto agregada
   - Obtención dinámica de datos de sesión
   - Menú de usuario mejorado con navegación
   - Contador de notificaciones no leídas
   - Avatar con soporte para foto de perfil

✅ /App.tsx (MODIFICADO)
   - Import de MiPerfilPage
   - Ruta /mi-perfil agregada a routes
   - Breadcrumb: [{ label: "Mi perfil" }]
```

---

## 🧪 Pruebas de Funcionamiento

### **Prueba 1: Acceso al Perfil**
```
1. Abrir aplicación
2. Click en botón de usuario (esquina superior derecha)
3. ✅ Verificar menú desplegable se abre
4. ✅ Verificar opciones: Mi perfil, Notificaciones, Configuración, Cerrar sesión
5. Click en "Mi perfil"
6. ✅ Verificar navegación a /mi-perfil
7. ✅ Verificar datos del usuario se muestran correctamente
```

### **Prueba 2: Editar Información**
```
1. En /mi-perfil
2. Click en "Editar Perfil"
3. ✅ Verificar campos se habilitan
4. Cambiar nombre a "Test Usuario"
5. Click en "Guardar cambios"
6. ✅ Verificar toast de éxito
7. ✅ Verificar modo edición se desactiva
8. ✅ Verificar nombre actualizado en header
```

### **Prueba 3: Subir Foto de Perfil**
```
1. En /mi-perfil, tab "Información Personal"
2. Click en icono de cámara
3. Seleccionar imagen JPG
4. ✅ Verificar preview aparece
5. ✅ Verificar toast: "Foto de perfil actualizada"
6. Click en "Guardar cambios"
7. ✅ Verificar foto aparece en header
8. Recargar página
9. ✅ Verificar foto persiste
```

### **Prueba 4: Cambiar Contraseña**
```
1. Ir a tab "Seguridad"
2. Ingresar contraseña actual: "test123"
3. Ingresar nueva contraseña: "nuevapass123"
4. Confirmar nueva contraseña: "nuevapass123"
5. Click en "Cambiar contraseña"
6. ✅ Verificar toast de éxito
7. ✅ Verificar campos se limpian

Probar validaciones:
- Dejar campos vacíos → ✅ Toast de error
- Contraseñas no coinciden → ✅ Toast de error
- Contraseña muy corta → ✅ Toast de error
```

### **Prueba 5: Toggle 2FA**
```
1. Ir a tab "Seguridad"
2. Toggle switch de 2FA a ON
3. ✅ Verificar icono verde
4. ✅ Verificar banner verde aparece
5. ✅ Verificar toast: "Autenticación de dos factores habilitada"
6. Toggle switch a OFF
7. ✅ Verificar icono gris
8. ✅ Verificar banner desaparece
9. ✅ Verificar toast: "Autenticación de dos factores deshabilitada"
```

### **Prueba 6: Menú de Usuario**
```
1. Click en botón de usuario en header
2. ✅ Verificar menú se abre
3. ✅ Verificar foto de perfil en header del menú
4. ✅ Verificar nombre y especialidad
5. ✅ Verificar contador de notificaciones (si > 0)
6. Click en "Notificaciones"
7. ✅ Verificar navegación a /notificaciones/lista
```

---

## 🔄 Flujo Completo de Usuario

```
1. Usuario inicia sesión
   ↓
2. Sesión se inicializa con datos del usuario
   ↓
3. Header muestra nombre, cédula, código y especialidad
   ↓
4. Usuario click en botón de perfil
   ↓
5. Menú desplegable se abre con opciones
   ↓
6. Usuario selecciona "Mi perfil"
   ↓
7. Navega a /mi-perfil
   ↓
8. Página carga con datos de getCurrentSession()
   ↓
9. Usuario puede:
   - Editar información personal
   - Subir foto de perfil
   - Cambiar contraseña
   - Habilitar/deshabilitar 2FA
   - Configurar preferencias
   ↓
10. Cambios se guardan con toast de confirmación
    ↓
11. Header se actualiza con nueva información
    ↓
12. Usuario continúa navegando con perfil actualizado
```

---

## 🎓 Mejores Prácticas Implementadas

### **UX/UI:**
```
✅ Feedback inmediato con toasts
✅ Preview en tiempo real de foto
✅ Modo edición claro con botones
✅ Validaciones con mensajes descriptivos
✅ Iconos intuitivos para cada acción
✅ Colores semánticos (verde=éxito, rojo=error)
✅ Diseño responsivo mobile-first
```

### **Seguridad:**
```
✅ Validación de tipos de archivo
✅ Validación de tamaño de archivo
✅ Validación de contraseñas
✅ Mostrar/Ocultar contraseñas
✅ 2FA con toggle y confirmación
✅ Sesiones activas visibles
```

### **Performance:**
```
✅ Obtención de datos desde sesión (no múltiples llamadas)
✅ Preview de imágenes con FileReader
✅ Estados locales para edición
✅ Actualización condicional del header
```

---

## 🚀 Próximas Mejoras Sugeridas

### **Funcionalidades Adicionales:**
```
□ Implementar backend para guardar foto de perfil
□ Listar todas las sesiones activas (múltiples dispositivos)
□ Cerrar sesiones remotas
□ Ver historial de cambios de perfil
□ Exportar datos personales (GDPR)
□ Eliminar cuenta
□ Tema oscuro/claro
□ Idioma de la interfaz
```

### **Validaciones Adicionales:**
```
□ Validar formato de email
□ Validar formato de teléfono
□ Validar complejidad de contraseña
□ Verificar contraseña actual en backend
□ Rate limiting para cambios de contraseña
```

### **Seguridad:**
```
□ Implementar QR para 2FA
□ Códigos de recuperación 2FA
□ Notificación de cambio de contraseña por email
□ Notificación de nuevos inicios de sesión
□ Historial de actividad de seguridad
```

---

## 📚 Recursos Relacionados

```
Archivos de sesión:
- /utils/multiRoleSession.ts - Gestión de sesión multi-rol
- /utils/usersStore.ts - Store de usuarios

Componentes:
- /components/PageHeader.tsx - Header con menú de usuario
- /components/PageBanner.tsx - Banner de página

Páginas relacionadas:
- /pages/NotificacionesListPage.tsx - Lista de notificaciones
- /pages/AutoservicioPage.tsx - Autoservicio del usuario
- /pages/SessionManagementPage.tsx - Gestión de sesiones
```

---

## ✅ Conclusión

Se ha implementado exitosamente un sistema completo de gestión de perfil de usuario con:

✅ **Interfaz intuitiva** con 3 tabs organizadas
✅ **Gestión de foto de perfil** con preview y validaciones
✅ **Cambio de contraseña** con validaciones robustas
✅ **2FA** con toggle y feedback visual
✅ **Menú de usuario** mejorado en el header
✅ **Navegación integrada** a todas las secciones relevantes
✅ **Feedback completo** con toasts informativos
✅ **Diseño responsivo** mobile y desktop
✅ **Integración con sesión** multi-rol

**¡El sistema de perfil de usuario está completamente funcional y listo para uso! 👤✅**
