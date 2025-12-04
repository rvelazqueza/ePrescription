# Guía de Gestión de Usuarios - ePrescription

## 📋 Flujo Completo de Gestión de Usuarios según Estándares Hospitalarios

**Versión:** 1.0  
**Fecha:** Octubre 2025  
**Cumplimiento:** FHIR, FDA 21 CFR Part 11, HIPAA, OMS, ISO 27001

---

## 🎯 Principios de Diseño

### 1. **Separación de Concerns**
- **Creación de usuarios:** Solo mediante procesos controlados de registro
- **Gestión de usuarios:** Modificación de usuarios existentes únicamente
- **Aprobación:** Proceso de validación de identidad obligatorio

### 2. **Trazabilidad Total**
- Cada acción sobre un usuario debe quedar registrada
- Auditoría completa según HIPAA
- Cumplimiento FDA 21 CFR Part 11 para firmas electrónicas

### 3. **Seguridad por Diseño**
- Principio de menor privilegio
- Separación de roles críticos
- Doble verificación para acciones sensibles

---

## 🔄 Flujo de Creación de Usuarios

### **Opción 1: Auto-Registro (OnboardingPage.tsx)**

**Caso de uso:** Profesionales médicos/farmacéuticos que se registran desde fuera del sistema

**Proceso:**
1. Usuario accede a la pantalla de registro desde login
2. Completa formulario con datos personales y profesionales
3. Acepta términos y condiciones + política de privacidad
4. Verifica email (OTP o link de confirmación)
5. **Estado inicial:** `pending` (Pendiente de aprobación)
6. Sistema genera solicitud de registro en cola de aprobaciones
7. Usuario recibe confirmación de solicitud recibida
8. **NO puede acceder al sistema** hasta aprobación

**Datos requeridos:**
- Identificación personal (cédula/DIMEX/pasaporte)
- Email profesional
- Teléfono
- Código profesional (médico/farmacéutico)
- Tipo de práctica médica
- Método de autenticación preferido
- Declaración de medicamentos controlados que prescribe

**Validaciones:**
- Email único en el sistema
- Identificación única
- Email profesional verificado
- Código profesional válido (opcional según rol)

---

### **Opción 2: Registro por Administrador (RegistroUsuariosPage.tsx)**

**Caso de uso:** Administrador/RRHH crea usuarios internos directamente

**Proceso:**
1. Administrador accede a "Registro de Usuarios"
2. Completa formulario completo del usuario
3. Asigna rol inicial (puede cambiarse después)
4. Asigna permisos base según rol
5. **Estado inicial:** `approved` o `pending` según política
6. Sistema genera credenciales temporales
7. Envía email al usuario con link de activación
8. Usuario debe cambiar contraseña en primer acceso

**Datos requeridos:**
- Todos los datos del auto-registro
- Rol inicial asignado
- Departamento/área
- Centro médico
- Permisos específicos (si difieren del rol estándar)

**Ventajas:**
- Proceso más rápido para empleados internos
- Control directo del administrador
- Asignación inmediata de rol y permisos

---

### **Opción 3: Proceso de Aprobación (UserApprovalsPage.tsx)**

**Caso de uso:** Validación de solicitudes pendientes de auto-registro

**Proceso:**
1. Administrador/Aprobador revisa cola de solicitudes
2. Verifica identidad del solicitante:
   - Código profesional
   - Cédula/identificación
   - Email profesional
   - Referencias institucionales
3. Evalúa riesgo de seguridad (risk score)
4. **Decisión:**
   - **Aprobar:** Usuario pasa a estado `approved`, recibe credenciales
   - **Rechazar:** Usuario pasa a estado `rejected`, recibe notificación
   - **Solicitar info:** Requiere documentación adicional

**Criterios de aprobación:**
- Identidad verificada
- Código profesional válido
- Email institucional válido
- Sin alertas de seguridad
- Documentos de soporte (si requeridos)

**Post-aprobación:**
- Sistema genera credenciales
- Envía email con link de activación
- Usuario debe configurar MFA en primer acceso
- Estado cambia a `active` tras primera autenticación

---

## 🛠️ Gestión de Usuarios Existentes (UsuariosPage.tsx)

### **Funcionalidades Principales**

#### 1. **Visualización y Búsqueda**
- Lista completa de usuarios con filtros
- Búsqueda por nombre, email, usuario, código
- Filtros por rol, estado, departamento
- Paginación obligatoria
- Exportación a PDF/CSV/Excel

#### 2. **Edición de Perfil de Usuario**

**NO se puede crear usuarios aquí - solo modificar existentes**

**Datos editables:**
- ✅ Información de contacto (email, teléfono)
- ✅ Departamento/área
- ✅ Centro médico asignado
- ✅ Especialidad médica
- ❌ Identificación personal (inmutable)
- ❌ Email principal (requiere proceso especial)
- ❌ Nombre completo (requiere proceso especial)

**Proceso de edición:**
1. Doble clic en usuario o botón "Editar"
2. Abre panel lateral con datos completos
3. Modifica campos permitidos
4. Guardar registra cambio en auditoría
5. Notifica al usuario de cambios (si aplica)

---

#### 3. **Gestión de Roles**

**Principio:** Un usuario puede tener UNO o MÚLTIPLES roles

**Roles disponibles:**
- `Administrador` - Acceso total
- `Médico` - Prescripción y consultas
- `Farmacéutico` - Dispensación e inventario
- `Médico Jefe` - Supervisión médica
- `Administrativo` - Gestión administrativa
- `Auditor` - Solo lectura y auditoría
- `Técnico` - Soporte técnico

**Cambio de rol:**
1. Seleccionar usuario
2. Abrir sección "Roles y Permisos"
3. Seleccionar rol(es) del dropdown
4. Sistema muestra permisos que se otorgarán/revocarán
5. Confirmar cambio (requiere justificación)
6. Auditoría registra cambio completo

**Restricciones:**
- Administrador no puede quitarse a sí mismo rol de admin (debe haber al menos 2 admins)
- Cambio de rol requiere doble confirmación para roles críticos
- Usuario recibe notificación de cambio de permisos

---

#### 4. **Gestión de Permisos Granulares**

**Permisos por módulo:**

```typescript
{
  prescriptions: {
    create: boolean,
    read: boolean,
    update: boolean,
    delete: boolean,
    sign: boolean,
    approve: boolean,
    view_all: boolean  // Ver recetas de otros médicos
  },
  patients: {
    create: boolean,
    read: boolean,
    update: boolean,
    delete: boolean,
    export: boolean,
    view_sensitive: boolean  // Datos sensibles
  },
  users: {
    create: boolean,
    read: boolean,
    update: boolean,
    delete: boolean,
    manage_roles: boolean,
    approve_requests: boolean
  },
  inventory: {
    create: boolean,
    read: boolean,
    update: boolean,
    adjust: boolean,
    approve_orders: boolean
  },
  reports: {
    create: boolean,
    read: boolean,
    export: boolean,
    configure: boolean,
    view_all: boolean
  },
  security: {
    read: boolean,
    update: boolean,
    audit: boolean,
    manage_sessions: boolean
  },
  system: {
    configure: boolean,
    backup: boolean,
    restore: boolean,
    maintenance: boolean
  }
}
```

**Asignación de permisos:**
1. Al asignar rol, se cargan permisos base del rol
2. Administrador puede personalizar permisos específicos
3. Sistema valida que no se quiten permisos críticos sin reemplazos
4. Permisos personalizados se marcan visualmente
5. Cambios quedan registrados en auditoría

**Validaciones:**
- No se puede quitar último usuario con permiso crítico
- Permisos de firma requieren certificación digital activa
- Permisos de medicamentos controlados requieren código profesional válido

---

#### 5. **Gestión de Estados de Usuario**

**Estados disponibles:**

1. **`pending`** - Pendiente de aprobación
   - Usuario registrado pero no aprobado
   - No puede acceder al sistema
   - En cola de aprobaciones

2. **`approved`** - Aprobado pero no activado
   - Identidad verificada
   - Esperando primera autenticación
   - Credenciales enviadas

3. **`active`** - Activo
   - Usuario completamente funcional
   - Puede acceder según permisos
   - Estado normal de operación

4. **`inactive`** - Inactivo
   - Temporal (vacaciones, licencia)
   - No puede acceder
   - Datos y permisos preservados
   - Reversible sin re-aprobación

5. **`blocked`** - Bloqueado
   - Bloqueo por seguridad o disciplinario
   - No puede acceder
   - Requiere proceso de desbloqueo
   - Auditoría obligatoria

6. **`suspended`** - Suspendido temporalmente
   - Investigación en curso
   - Acceso revocado temporalmente
   - Requiere aprobación para reactivar

7. **`rejected`** - Rechazado
   - Solicitud de registro denegada
   - No puede volver a registrarse sin proceso especial

**Transiciones de estado permitidas:**

```
pending -> approved -> active
pending -> rejected

active -> inactive -> active
active -> blocked -> active (con aprobación)
active -> suspended -> active (con aprobación)

inactive -> blocked
```

**Proceso de cambio de estado:**
1. Seleccionar usuario
2. Clic en estado actual
3. Seleccionar nuevo estado
4. **Requiere justificación obligatoria**
5. Confirmación de administrador
6. Sistema valida transición permitida
7. Auditoría registra cambio con justificación
8. Usuario recibe notificación (si aplica)

**Validaciones especiales:**
- Bloquear usuario requiere motivo documentado
- Reactivar usuario bloqueado requiere aprobación de superior
- Cambiar a inactivo más de 90 días genera alerta
- No se puede bloquear al último administrador activo

---

#### 6. **Autenticación Multi-Factor (MFA)**

**Gestión desde UsuariosPage:**
- Ver si usuario tiene MFA habilitado
- Forzar habilitación de MFA para roles específicos
- Resetear MFA si usuario perdió dispositivo
- Ver métodos de MFA configurados

**Métodos soportados:**
- `webauthn` - Llave de seguridad física / biometría
- `totp` - Aplicación autenticadora (Google/Microsoft Authenticator)
- `sms` - Código por SMS (solo backup)
- `email` - Código por email (solo backup)

**Políticas:**
- Administradores: MFA obligatorio
- Médicos con firma digital: MFA obligatorio
- Otros roles: MFA opcional pero recomendado

---

#### 7. **Vinculación de Firma Digital**

**Gestión:**
- Ver estado de vinculación con BCCR/GAUDI
- Iniciar proceso de vinculación
- Desvincular firma (requiere aprobación)
- Ver certificados vinculados
- Estado de vigencia del certificado

**Proceso:**
1. Usuario debe tener firma digital activa de BCCR
2. Desde UsuariosPage, admin puede iniciar vinculación
3. Usuario completa flujo de autenticación con GAUDI
4. Sistema valida certificado
5. Vinculación queda registrada
6. Usuario puede prescribir medicamentos controlados

---

## 📊 Auditoría y Cumplimiento

### **Registro de Auditoría Obligatorio**

**Cada acción sobre usuarios registra:**
- Fecha y hora exacta
- Usuario que realizó la acción
- Usuario afectado
- Tipo de acción (crear, editar, bloquear, etc.)
- Campos modificados (antes/después)
- Justificación (si aplica)
- IP y dispositivo
- Resultado de la acción

**Retención:**
- Mínimo 7 años según HIPAA
- Inmutable (no se puede editar ni borrar)
- Exportable para auditorías externas
- Cifrado en reposo

### **Cumplimiento Normativo**

#### **HIPAA (Health Insurance Portability and Accountability Act)**
- ✅ Control de acceso basado en roles
- ✅ Auditoría completa de accesos
- ✅ Encriptación de datos sensibles
- ✅ Políticas de contraseñas robustas
- ✅ MFA para acceso a PHI (Protected Health Information)

#### **FDA 21 CFR Part 11**
- ✅ Validación de identidad de usuarios
- ✅ Firmas electrónicas trazables
- ✅ Auditoría inmutable
- ✅ Control de acceso estricto
- ✅ Fecha y hora sincronizada

#### **FHIR (Fast Healthcare Interoperability Resources)**
- ✅ Identificadores únicos de usuarios (Practitioner.identifier)
- ✅ Roles codificados según SNOMED CT
- ✅ Provenance de todas las acciones
- ✅ Consentimientos documentados

#### **OMS - Directrices de Prescripción Electrónica**
- ✅ Identificación unívoca de prescriptores
- ✅ Trazabilidad completa
- ✅ Seguridad en acceso a medicamentos controlados
- ✅ Registro de autorizaciones

---

## 🚀 Mejores Prácticas

### **1. Creación de Usuarios**
- ✅ Usar OnboardingPage para auto-registro externo
- ✅ Usar RegistroUsuariosPage para empleados internos
- ❌ NO crear usuarios directamente desde UsuariosPage
- ✅ Todo usuario nuevo pasa por proceso de validación

### **2. Asignación de Roles**
- ✅ Asignar rol mínimo necesario (menor privilegio)
- ✅ Revisar permisos periódicamente
- ✅ Documentar roles custom
- ❌ NO dar permisos de admin sin justificación

### **3. Gestión de Permisos**
- ✅ Usar roles estándar cuando sea posible
- ✅ Permisos custom solo cuando sea necesario
- ✅ Auditar permisos trimestralmente
- ✅ Revocar permisos no utilizados

### **4. Estados de Usuario**
- ✅ Cambiar a inactivo si usuario no accede en 90 días
- ✅ Bloquear inmediatamente en caso de incidente de seguridad
- ✅ Documentar SIEMPRE la razón de bloqueos
- ✅ Revisar usuarios bloqueados mensualmente

### **5. Seguridad**
- ✅ Forzar MFA para roles críticos
- ✅ Cambio de contraseña cada 90 días
- ✅ Bloqueo tras 3 intentos fallidos
- ✅ Sesiones con timeout de inactividad
- ✅ Notificar cambios sensibles al usuario

---

## 📋 Checklist de Implementación

### **Funcionalidades Básicas**
- [x] Visualización de lista de usuarios
- [x] Búsqueda y filtros
- [x] Paginación
- [x] Exportación (PDF/CSV/Excel)
- [x] Panel de edición de usuario
- [x] Gestión de estados
- [x] Gestión de roles
- [x] Gestión de permisos

### **Seguridad**
- [x] Validación de permisos del admin
- [x] Doble confirmación para acciones críticas
- [x] Auditoría de todas las acciones
- [x] Notificaciones de cambios
- [x] Encriptación de datos sensibles

### **Cumplimiento**
- [x] HIPAA - Control de acceso
- [x] FDA 21 CFR Part 11 - Auditoría
- [x] FHIR - Identificadores estándar
- [x] OMS - Trazabilidad

### **UX/UI**
- [x] Panel lateral para edición
- [x] Confirmaciones para acciones destructivas
- [x] Mensajes de error claros
- [x] Tooltips informativos
- [x] Feedback visual de estados
- [x] Responsive design

---

## 🔐 Escenarios de Uso

### **Escenario 1: Nuevo médico se registra**
1. Médico accede a OnboardingPage desde login
2. Completa formulario de auto-registro
3. Verifica email
4. Estado: `pending`
5. Administrador revisa en UserApprovalsPage
6. Aprueba solicitud
7. Médico recibe credenciales
8. Primera autenticación: configura MFA
9. Estado: `active`

### **Escenario 2: Empleado de farmacia contratado**
1. RRHH accede a RegistroUsuariosPage
2. Crea usuario con rol "Farmacéutico"
3. Asigna permisos base
4. Estado: `approved`
5. Sistema envía credenciales temporales
6. Empleado activa cuenta y cambia contraseña
7. Estado: `active`

### **Escenario 3: Médico es promovido a Jefe**
1. Admin accede a UsuariosPage
2. Busca y selecciona médico
3. Abre panel de edición
4. Cambia rol de "Médico" a "Médico Jefe"
5. Sistema muestra permisos adicionales
6. Admin confirma cambio con justificación
7. Médico recibe notificación
8. Auditoría registra cambio

### **Escenario 4: Usuario bloqueado por seguridad**
1. Detectado intento de acceso sospechoso
2. Admin accede a UsuariosPage
3. Selecciona usuario
4. Cambia estado a `blocked`
5. Ingresa motivo: "Múltiples intentos fallidos desde IP desconocida"
6. Confirma bloqueo
7. Usuario recibe notificación
8. Sesiones activas se cierran inmediatamente
9. Auditoría completa registrada

### **Escenario 5: Usuario olvidó dispositivo MFA**
1. Usuario reporta pérdida de dispositivo
2. Admin verifica identidad del usuario
3. Accede a UsuariosPage
4. Selecciona usuario
5. Resetea MFA
6. Usuario recibe link para configurar nuevo MFA
7. Auditoría registra reseteo

---

## 📞 Soporte y Mantenimiento

### **Tareas Periódicas**
- **Diario:** Revisar usuarios pendientes de aprobación
- **Semanal:** Revisar usuarios bloqueados
- **Mensual:** Auditar permisos y roles
- **Trimestral:** Revisar usuarios inactivos
- **Anual:** Auditoría completa de seguridad

### **Métricas a Monitorear**
- Tiempo promedio de aprobación de usuarios
- Usuarios activos vs total
- Porcentaje con MFA habilitado
- Intentos fallidos de autenticación
- Cambios de permisos por periodo

---

**Documento mantenido por:** Equipo de Desarrollo ePrescription  
**Última actualización:** Octubre 2025  
**Versión:** 1.0
