# Análisis de Multi-Rol en Sistemas Médicos Hospitalarios

## 📊 **Análisis de Opciones**

### **Contexto Hospitalario Real**

En hospitales, es común que profesionales tengan múltiples roles:

1. **Médico Jefe de Cardiología**
   - Rol 1: Médico (prescribe)
   - Rol 2: Médico Jefe (supervisa, aprueba)
   - Necesidad: Ambos roles en diferentes momentos del día

2. **Farmacéutico Jefe**
   - Rol 1: Farmacéutico (dispensa)
   - Rol 2: Administrativo (reportes, gestión)
   - Necesidad: Cambiar entre roles según tarea

3. **Médico con Guardia**
   - Rol 1: Cardiólogo (consultas especializadas)
   - Rol 2: Médico General (guardias nocturnas)
   - Necesidad: Permisos diferentes según contexto

4. **Director Médico**
   - Rol 1: Administrador (gestión del hospital)
   - Rol 2: Médico Jefe (supervisión clínica)
   - Rol 3: Médico (práctica clínica)
   - Necesidad: Los 3 roles en diferentes contextos

---

## 🔍 **Evaluación de Opciones**

### **OPCIÓN 1: Selección de Rol al Login**

**Descripción:**
Usuario selecciona UN rol al hacer login. Para cambiar de rol, debe cerrar sesión y volver a autenticarse.

**Flujo:**
```
1. Login (usuario + contraseña + MFA)
2. Sistema muestra: "Seleccione rol"
   - Médico
   - Médico Jefe
3. Usuario selecciona "Médico"
4. Trabaja SOLO con permisos de Médico
5. Para cambiar a "Médico Jefe" → Logout + Login
```

#### **✅ Ventajas:**
- ✅ **Máxima seguridad**: Principio de menor privilegio estricto
- ✅ **Auditoría clara**: Cada sesión = un rol específico
- ✅ **Separación de funciones**: Imposible mezclar responsabilidades
- ✅ **Cumplimiento FDA**: Firma electrónica vinculada a rol específico
- ✅ **Simplicidad**: Fácil de implementar y mantener

#### **❌ Desventajas:**
- ❌ **Fricción UX extrema**: Requiere logout/login para cambiar rol
- ❌ **Productividad baja**: Médico que prescribe Y supervisa pierde tiempo
- ❌ **No apto para roles complementarios**: Farmacéutico que también hace admin
- ❌ **Frustración del usuario**: Múltiples autenticaciones por día
- ❌ **No refleja realidad hospitalaria**: Profesionales cambian contextos constantemente

#### **Casos de uso válidos:**
- Sistemas con roles MUY separados
- Usuarios que NUNCA necesitan más de un rol
- Ambientes de alta seguridad (militar, nuclear)

#### **Veredicto para ePrescription:**
⚠️ **NO RECOMENDADO** - Demasiada fricción para uso hospitalario real

---

### **OPCIÓN 2: Suma de Todos los Permisos**

**Descripción:**
Usuario tiene todos los permisos de TODOS sus roles asignados simultáneamente.

**Flujo:**
```
1. Login (usuario + contraseña + MFA)
2. Sistema carga TODOS los permisos:
   - Permisos de Médico
   - Permisos de Médico Jefe
   - Permisos de Administrador
3. Usuario puede hacer TODO lo que permiten sus roles
4. NO hay distinción de "bajo qué rol actuó"
```

#### **✅ Ventajas:**
- ✅ **UX fluido**: Sin fricción, trabaja libremente
- ✅ **Productividad alta**: Acceso instantáneo a todas las funciones
- ✅ **Simplicidad conceptual**: "Tienes todos tus permisos"
- ✅ **Flexibilidad máxima**: Usuario decide qué hacer cuando

#### **❌ Desventajas:**
- ❌ **VIOLACIÓN de menor privilegio**: Usuario siempre tiene MÁS permisos de los necesarios
- ❌ **Auditoría ambigua**: ¿Bajo qué rol firmó esta receta?
- ❌ **Mayor superficie de ataque**: Compromiso de sesión = acceso a TODOS los permisos
- ❌ **Conflictos de responsabilidad**: ¿Actuó como médico o como supervisor?
- ❌ **NO CUMPLE FDA 21 CFR Part 11**: Firma debe estar vinculada a rol específico
- ❌ **NO CUMPLE HIPAA**: Acceso debe ser mínimo necesario
- ❌ **Riesgo de abuso**: Usuario podría hacer acciones fuera de contexto
- ❌ **No repudio**: Usuario puede negar haber actuado en cierto rol

#### **Problemas específicos:**

**Ejemplo 1: Auditoría comprometida**
```
Dr. García tiene roles: Médico + Médico Jefe + Administrador

Acción: Aprobó su propia receta de medicamento controlado
Pregunta: ¿Lo aprobó como Médico Jefe o se auto-aprobó como Admin?
Respuesta: No se puede determinar → Auditoría fallida
```

**Ejemplo 2: Violación de segregación de funciones**
```
Farmacéutico + Administrador
- Como Farmacéutico: Dispensa medicamentos
- Como Administrador: Ajusta inventario

Con suma de permisos:
1. Dispensa 50 unidades de morfina (Farmacéutico)
2. Ajusta inventario +50 unidades (Administrador)
3. Repite proceso
→ Robo sistemático sin detección
```

#### **Veredicto para ePrescription:**
🚫 **RECHAZADO COMPLETAMENTE** - Inseguro, no cumple normativas

---

### **OPCIÓN 3: Sistema de Rol Activo con Contexto (RECOMENDADO)**

**Descripción:**
Usuario tiene múltiples roles asignados, pero trabaja con UN rol activo a la vez. Puede cambiar de rol durante la sesión SIN re-autenticarse, con auditoría del cambio.

**Arquitectura:**
```typescript
interface UserSession {
  userId: string;
  primaryRole: string;        // Rol principal/por defecto
  assignedRoles: string[];    // Todos los roles asignados
  activeRole: string;         // Rol activo AHORA
  activeContext: string;      // Contexto actual
  effectivePermissions: Permissions; // Permisos del rol activo
  roleHistory: RoleChange[];  // Historial de cambios de rol
}

interface RoleChange {
  timestamp: string;
  previousRole: string;
  newRole: string;
  reason?: string;           // Opcional: razón del cambio
  triggeredBy: 'user' | 'system' | 'context';
}
```

**Flujo:**
```
1. Login (usuario + contraseña + MFA)
2. Sistema carga:
   - Rol Primario: "Médico" (por defecto)
   - Roles Asignados: ["Médico", "Médico Jefe"]
   - Rol Activo: "Médico"
3. Usuario trabaja como "Médico"
4. Necesita supervisar → Clic en "Cambiar rol"
5. Selecciona "Médico Jefe"
6. Sistema:
   - Audita el cambio
   - Cambia permisos efectivos
   - Actualiza interfaz (badge, menú)
7. Usuario ahora trabaja como "Médico Jefe"
8. Todas las acciones se auditan con rol activo
```

**Características clave:**

1. **Principio de Menor Privilegio**
   - Usuario solo tiene permisos del rol activo
   - No acumulación de permisos

2. **Auditoría Clara**
   - Cada acción registra rol activo
   - Historial de cambios de rol
   - Trazabilidad total

3. **UX Óptimo**
   - Cambio de rol sin re-login
   - Interfaz muestra rol activo claramente
   - Proceso rápido (2 clics)

4. **Separación de Funciones**
   - Roles críticos requieren cambio explícito
   - Previene acciones accidentales
   - Consciente de responsabilidad

5. **Contexto Automático**
   - Sistema puede sugerir rol según ubicación
   - Ej: En Farmacia → Sugerir "Farmacéutico"
   - Usuario siempre puede cambiar manualmente

#### **✅ Ventajas:**
- ✅ **Cumple HIPAA**: Acceso mínimo necesario en cada momento
- ✅ **Cumple FDA 21 CFR Part 11**: Firma vinculada a rol activo específico
- ✅ **Cumple FHIR**: PractitionerRole representa rol en contexto
- ✅ **Auditoría perfecta**: Cada acción → rol específico
- ✅ **UX excelente**: Sin re-login, cambio rápido
- ✅ **Seguridad alta**: Solo permisos del rol activo
- ✅ **Flexibilidad**: Cambio de rol cuando sea necesario
- ✅ **Prevención de fraude**: Segregación de funciones preservada
- ✅ **Trazabilidad**: Historial completo de roles usados
- ✅ **No repudio**: No puede negar haber usado cierto rol

#### **❌ Desventajas (mínimas):**
- ⚠️ Requiere cambio manual de rol (pero sin re-login)
- ⚠️ Implementación más compleja
- ⚠️ Necesita UI para indicar rol activo

#### **Implementación de Seguridad:**

**1. Cambio de Rol Auditado**
```typescript
function changeRole(newRole: string, reason?: string) {
  // Validar que el rol está asignado
  if (!session.assignedRoles.includes(newRole)) {
    throw new Error('Rol no asignado');
  }
  
  // Auditoría ANTES del cambio
  auditLog({
    action: 'ROLE_CHANGE',
    userId: session.userId,
    previousRole: session.activeRole,
    newRole: newRole,
    reason: reason,
    timestamp: new Date().toISOString(),
    ipAddress: getUserIP(),
    device: getUserDevice()
  });
  
  // Cambiar rol
  session.activeRole = newRole;
  session.effectivePermissions = getRolePermissions(newRole);
  
  // Actualizar UI
  updateRoleBadge(newRole);
  refreshMenu();
  
  // Notificar
  toast.success(`Rol cambiado a: ${newRole}`);
}
```

**2. Validación de Permisos**
```typescript
function hasPermission(action: string): boolean {
  // Solo verifica permisos del ROL ACTIVO
  return session.effectivePermissions[action] === true;
}

function requirePermission(action: string) {
  if (!hasPermission(action)) {
    throw new SecurityError(
      `Acción '${action}' no permitida para rol '${session.activeRole}'`
    );
  }
}
```

**3. Auditoría de Acciones**
```typescript
function logAction(action: string, details: any) {
  auditLog({
    action: action,
    userId: session.userId,
    activeRole: session.activeRole,  // ← ROL ACTIVO
    primaryRole: session.primaryRole,
    timestamp: new Date().toISOString(),
    details: details,
    ipAddress: getUserIP(),
    sessionId: session.id
  });
}
```

**4. Sugerencia Contextual de Rol**
```typescript
function suggestRoleByContext() {
  const currentRoute = window.location.pathname;
  
  // Mapeo de rutas a roles sugeridos
  const contextMap = {
    '/prescripciones': 'Médico',
    '/dispensacion': 'Farmacéutico',
    '/inventario': 'Farmacéutico',
    '/seguridad': 'Administrador',
    '/reportes': 'Médico Jefe'
  };
  
  for (const [route, role] of Object.entries(contextMap)) {
    if (currentRoute.startsWith(route)) {
      if (session.assignedRoles.includes(role) && session.activeRole !== role) {
        // Sugerir cambio
        showNotification({
          message: `¿Cambiar a rol ${role}?`,
          action: () => changeRole(role, 'Contexto automático')
        });
      }
      break;
    }
  }
}
```

#### **Ejemplos Prácticos:**

**Escenario 1: Dr. García - Médico Jefe de Cardiología**

```
08:00 - Login
       - Rol Primario: Médico Jefe
       - Rol Activo: Médico Jefe
       - Permisos: Supervisión, aprobación, reportes

08:15 - Ronda de supervisión (como Médico Jefe)
       ✓ Revisa recetas de residentes
       ✓ Aprueba medicamentos controlados
       
09:00 - Cambia a "Médico" (clic en selector)
       - Rol Activo: Médico
       - Permisos: Prescripción, consulta
       - Auditoría: ROLE_CHANGE registrado

09:00-12:00 - Consultas (como Médico)
       ✓ Atiende pacientes
       ✓ Prescribe medicamentos
       [Todas las recetas firmadas como "Médico"]

12:00 - Cambia a "Médico Jefe"
       - Rol Activo: Médico Jefe
       
12:00-13:00 - Supervisión (como Médico Jefe)
       ✓ Revisa casos complejos
       ✓ Aprueba tratamientos especiales

Auditoría: Clara distinción de responsabilidades
```

**Escenario 2: Lcda. Mora - Farmacéutica Jefe**

```
07:00 - Login
       - Rol Primario: Farmacéutico
       - Rol Activo: Farmacéutico
       
07:00-10:00 - Dispensación (como Farmacéutico)
       ✓ Dispensa medicamentos
       ✓ Verifica recetas
       
10:00 - Cambia a "Administrativo"
       - Rol Activo: Administrativo
       - Razón: "Generación de reportes"
       
10:00-11:00 - Reportes (como Administrativo)
       ✓ Genera reportes de farmacia
       ✓ Exporta datos
       ❌ NO puede dispensar (no tiene permisos activos)
       
11:00 - Vuelve a "Farmacéutico"
       - Rol Activo: Farmacéutico
       
11:00-14:00 - Dispensación continúa

Auditoría: Segregación de funciones preservada
```

---

## 🏆 **RECOMENDACIÓN FINAL**

### **Implementar Opción 3: Sistema de Rol Activo con Contexto**

**Justificación:**

1. **Cumplimiento Normativo Total**
   - ✅ HIPAA - Acceso mínimo necesario
   - ✅ FDA 21 CFR Part 11 - Firma vinculada a rol
   - ✅ FHIR - PractitionerRole estándar
   - ✅ ISO 27001 - Control de acceso basado en roles

2. **Seguridad Óptima**
   - Principio de menor privilegio mantenido
   - Segregación de funciones preservada
   - Auditoría clara e inmutable
   - Prevención de fraude

3. **UX Profesional**
   - Sin fricción innecesaria
   - Cambio rápido de rol
   - Interfaz clara del contexto actual
   - Productividad mantenida

4. **Casos de Uso Reales**
   - Usado en Epic, Cerner, Meditech
   - Estándar de la industria hospitalaria
   - Validado por miles de hospitales

---

## 📐 **Especificaciones de Implementación**

### **Interfaz de Usuario**

**1. Selector de Rol (Top Bar)**
```
┌─────────────────────────────────────────────────┐
│  [👤 Dr. Carlos García]  [🏥 Rol: Médico ▼]    │
│                                                 │
│  Clic en dropdown:                              │
│  ┌─────────────────────────────────┐           │
│  │ ● Médico (Activo)               │           │
│  │ ○ Médico Jefe                   │           │
│  │ ─────────────────────────────   │           │
│  │ Cambiar rol                     │           │
│  └─────────────────────────────────┘           │
└─────────────────────────────────────────────────┘
```

**2. Badge Visual del Rol Activo**
```
Siempre visible en esquina superior derecha:
┌──────────────────┐
│ 🩺 Médico        │  ← Verde = Rol clínico
└──────────────────┘

┌──────────────────┐
│ 👔 Administrativo│  ← Azul = Rol admin
└──────────────────┘

┌──────────────────┐
│ 💊 Farmacéutico  │  ← Naranja = Rol farmacia
└──────────────────┘
```

**3. Confirmación de Cambio de Rol**
```
┌─────────────────────────────────────────┐
│  Confirmar Cambio de Rol                │
├─────────────────────────────────────────┤
│                                         │
│  De:  🩺 Médico                        │
│  A:   👔 Médico Jefe                   │
│                                         │
│  Los permisos cambiarán a:              │
│  ✓ Supervisar recetas                   │
│  ✓ Aprobar medicamentos controlados     │
│  ✓ Ver reportes completos               │
│                                         │
│  ⚠️ Este cambio quedará registrado      │
│      en auditoría                       │
│                                         │
│  [ Cancelar ]  [ Cambiar Rol ]         │
└─────────────────────────────────────────┘
```

**4. Notificación Contextual**
```
Al entrar a /inventario siendo Médico:

┌─────────────────────────────────────────┐
│  💡 Sugerencia                          │
├─────────────────────────────────────────┤
│  Esta sección normalmente requiere      │
│  rol de Farmacéutico.                   │
│                                         │
│  ¿Cambiar a rol Farmacéutico?          │
│                                         │
│  [ Ahora no ]  [ Cambiar a Farmacéutico]│
└─────────────────────────────────────────┘
```

---

### **Base de Datos**

**Tabla: users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  primary_role VARCHAR(50) NOT NULL,
  assigned_roles JSON NOT NULL, -- Array de roles
  -- Ejemplo: ["Médico", "Médico Jefe"]
  ...
);
```

**Tabla: user_sessions**
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  active_role VARCHAR(50) NOT NULL,
  active_context VARCHAR(100),
  effective_permissions JSON NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW(),
  ...
);
```

**Tabla: role_change_audit**
```sql
CREATE TABLE role_change_audit (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  session_id UUID REFERENCES user_sessions(id),
  previous_role VARCHAR(50) NOT NULL,
  new_role VARCHAR(50) NOT NULL,
  reason TEXT,
  triggered_by VARCHAR(20), -- 'user', 'system', 'context'
  timestamp TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  route VARCHAR(200) -- Ruta donde cambió
);
```

**Tabla: action_audit**
```sql
CREATE TABLE action_audit (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  session_id UUID REFERENCES user_sessions(id),
  active_role VARCHAR(50) NOT NULL, -- ← ROL ACTIVO al momento
  primary_role VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(100),
  details JSON,
  timestamp TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  ...
);
```

---

### **Reglas de Negocio**

1. **Asignación de Roles**
   - Usuario puede tener 1 a N roles asignados
   - Mínimo 1 rol (primary_role)
   - Administrador asigna roles

2. **Rol Primario**
   - Definido al crear usuario
   - Rol por defecto al hacer login
   - Puede cambiarse desde administración

3. **Cambio de Rol en Sesión**
   - Solo a roles asignados
   - Cambio auditado siempre
   - Sin límite de cambios (pero todos registrados)
   - Opcional: Razón del cambio

4. **Permisos Efectivos**
   - SOLO del rol activo
   - NO acumulación
   - Cambio inmediato al cambiar rol

5. **Firma Electrónica**
   - Vinculada a rol activo
   - No se puede firmar sin rol adecuado
   - Auditoría incluye rol activo

6. **Validaciones**
   - Acción requiere permiso del rol activo
   - Error claro si permiso insuficiente
   - Sugerencia de cambiar a rol adecuado

---

## 🔒 **Consideraciones de Seguridad**

### **Prevención de Abuso**

1. **Rate Limiting de Cambios de Rol**
   ```typescript
   // Máximo 10 cambios de rol por hora
   if (getRecentRoleChanges(userId, 1 hour) > 10) {
     throw new Error('Demasiados cambios de rol. Contacte soporte.');
   }
   ```

2. **Alertas de Patrones Sospechosos**
   ```typescript
   // Alerta si cambia rol y vuelve inmediatamente
   if (changeToRoleAndBackInLessThan(5 minutes)) {
     alertSecurityTeam('Patrón sospechoso de cambio de rol');
   }
   ```

3. **Bloqueo de Acciones Críticas con Rol Inadecuado**
   ```typescript
   // Firmar medicamento controlado requiere Médico o Médico Jefe
   if (action === 'SIGN_CONTROLLED_DRUG' && 
       !['Médico', 'Médico Jefe'].includes(activeRole)) {
     throw new SecurityError('Rol inadecuado para esta acción');
   }
   ```

4. **Timeout de Sesión por Inactividad**
   ```typescript
   // Si inactivo por 30 min, vuelve a rol primario
   if (sessionInactive > 30 minutes) {
     changeRole(primaryRole, 'Timeout por inactividad');
   }
   ```

---

## 📊 **Casos de Uso Completos**

### **Caso 1: Médico que también es Jefe de Servicio**

**Usuario:** Dr. Ramírez
**Roles Asignados:**
- Médico (Primario)
- Médico Jefe

**Día típico:**

| Hora | Rol Activo | Acción | Auditoría |
|------|-----------|--------|-----------|
| 08:00 | Médico | Prescribe receta #001 | role: Médico |
| 08:30 | Médico | Prescribe receta #002 | role: Médico |
| 09:00 | **Médico Jefe** | Revisa receta de residente | role: Médico Jefe |
| 09:15 | Médico Jefe | Aprueba medicamento controlado | role: Médico Jefe |
| 10:00 | **Médico** | Consulta paciente | role: Médico |
| 10:30 | Médico | Prescribe receta #003 | role: Médico |

**Auditoría:**
- Clara distinción de responsabilidades
- Firma electrónica vinculada a rol específico
- Cumplimiento FDA/HIPAA

---

### **Caso 2: Farmacéutico con Tareas Administrativas**

**Usuario:** Lcda. Solís
**Roles Asignados:**
- Farmacéutico (Primario)
- Administrativo

**Escenario:**

1. **07:00 - Dispensación (Farmacéutico)**
   ```
   Rol Activo: Farmacéutico
   - Dispensa 20 medicamentos
   - Verifica 35 recetas
   - Todas las acciones bajo "Farmacéutico"
   ```

2. **11:00 - Reporte Mensual (Necesita rol Admin)**
   ```
   Intenta acceder a /reportes/exportar
   Sistema: "Esta acción requiere rol Administrativo"
   
   Usuario: Cambia a "Administrativo"
   Rol Activo: Administrativo
   - Genera reporte mensual
   - Exporta a Excel
   - NO puede dispensar (sin permisos activos)
   ```

3. **12:00 - Vuelve a Dispensación**
   ```
   Cambia a "Farmacéutico"
   Rol Activo: Farmacéutico
   - Continúa dispensación normal
   ```

**Seguridad Preservada:**
- Como Farmacéutico NO tiene permisos admin
- Como Administrativo NO puede dispensar
- Segregación de funciones mantenida

---

## ✅ **Checklist de Implementación**

### **Backend**
- [ ] Tabla users con assigned_roles (JSON array)
- [ ] Tabla user_sessions con active_role
- [ ] Tabla role_change_audit
- [ ] API endpoint: POST /api/session/change-role
- [ ] Middleware de validación de permisos
- [ ] Auditoría automática de cambios
- [ ] Rate limiting de cambios de rol

### **Frontend**
- [ ] Selector de rol en TopBar
- [ ] Badge visual de rol activo
- [ ] Modal de confirmación de cambio
- [ ] Notificaciones contextuales
- [ ] Actualización de menú según rol
- [ ] Indicadores de permisos insuficientes

### **Seguridad**
- [ ] Validación de rol asignado antes de cambio
- [ ] Auditoría de cada cambio de rol
- [ ] Alerta de patrones sospechosos
- [ ] Timeout de sesión
- [ ] Logging de acciones con rol activo

### **UX**
- [ ] Transiciones suaves
- [ ] Feedback visual inmediato
- [ ] Mensajes claros de error
- [ ] Tutorial de cambio de rol
- [ ] Documentación para usuarios

---

## 📚 **Referencias**

1. **HIPAA Security Rule** - Minimum Necessary Standard
2. **FDA 21 CFR Part 11** - Electronic Signatures
3. **FHIR PractitionerRole** - HL7 Standard
4. **ISO 27001** - Access Control
5. **NIST 800-53** - Role-Based Access Control

---

**Documento creado:** Octubre 2025  
**Versión:** 1.0  
**Recomendación:** Implementar Opción 3 (Sistema de Rol Activo)
