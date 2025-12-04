# Sistema de Roles Híbrido - ePrescription

## 🎯 Arquitectura de Dos Niveles

### Nivel 1: Roles Base (Templates)
**Características:**
- ✅ Predefinidos e inmutables
- ✅ Certificados para cumplimiento normativo
- ✅ No se pueden eliminar del sistema
- ✅ Sirven como plantillas para roles personalizados

**Roles Base del Sistema:**
1. **Administrador** - Control total del sistema
2. **Médico** - Prescripción estándar
3. **Farmacéutico** - Dispensación y verificación
4. **Médico Jefe** - Prescripción + supervisión
5. **Administrativo** - Gestión de pacientes y reportes

### Nivel 2: Roles Personalizados (Instancias)
**Características:**
- ✅ Derivados de un rol base
- ✅ Permisos ajustables por usuario específico
- ✅ Requieren justificación para creación
- ✅ Sujetos a aprobación (para permisos críticos)
- ✅ Totalmente auditables

**Ejemplos de Roles Personalizados:**

```typescript
// Caso 1: Administrador de Respaldo
{
  baseRole: "Administrador",
  customName: "Admin Respaldo TI",
  userId: "USR-0042",
  userName: "Carlos Rojas",
  permissionAdjustments: {
    removed: ["users.delete", "system.restore"],
    reason: "Administrador de soporte técnico sin acceso a funciones críticas de eliminación"
  },
  approvedBy: "USR-0001",
  validUntil: "2026-12-31"
}

// Caso 2: Médico de Emergencias
{
  baseRole: "Médico Jefe",
  customName: "Médico Jefe ER",
  userId: "USR-0089",
  userName: "Dra. Ana Vargas",
  permissionAdjustments: {
    added: ["clinical_alerts.override", "prescriptions.emergency_override"],
    reason: "Médico jefe de sala de emergencias requiere capacidad de anular alertas en situaciones críticas"
  },
  approvedBy: "USR-0001",
  validUntil: null, // Permanente
  restrictions: {
    requiresJustification: true,
    auditsEachUse: true
  }
}

// Caso 3: Farmacéutico de Investigación
{
  baseRole: "Farmacéutico",
  customName: "Farmacéutico Investigador",
  userId: "USR-0123",
  userName: "Lic. Marco Solís",
  permissionAdjustments: {
    added: ["reports.export", "interoperability.export"],
    removed: ["prescriptions.dispense", "inventory.adjust"],
    reason: "Farmacéutico dedicado a investigación clínica, no realiza dispensación directa"
  },
  approvedBy: "USR-0004",
  validUntil: "2025-12-31",
  department: "Investigación Clínica"
}
```

## 🔒 Reglas de Seguridad

### 1. Validaciones Obligatorias

**Para Roles Base:**
- ❌ No se pueden modificar permisos
- ❌ No se pueden eliminar
- ✅ Solo se pueden asignar "as-is"

**Para Roles Personalizados:**
- ✅ Deben derivar de un rol base
- ✅ Solo pueden QUITAR o AGREGAR permisos individuales
- ❌ No pueden violar SoD (Separación de Funciones)
- ✅ Requieren justificación escrita
- ✅ Permisos críticos agregados requieren aprobación

### 2. Matriz de Aprobaciones

| Cambio | Requiere Aprobación | Aprobador |
|--------|---------------------|-----------|
| Quitar permisos no críticos | ❌ No | Automático |
| Quitar permisos críticos | ⚠️ Recomendado | Jefe directo |
| Agregar permisos no críticos | ⚠️ Recomendado | Jefe directo |
| Agregar permisos críticos | ✅ Obligatorio | Director + Seguridad |
| Crear rol con SoD exception | ✅ Obligatorio | Comité de seguridad |

### 3. Separación de Funciones (SoD)

**Reglas Inmutables (incluso en roles personalizados):**

```typescript
// ❌ NUNCA permitido (ni en roles personalizados)
{
  prescriptions: ["sign", "dispense"] // Quien prescribe NO puede dispensar
}

// ❌ NUNCA permitido
{
  users: ["create", "manage_roles", "delete"],
  security: ["manage"] // Quien crea usuarios no puede gestionar toda la seguridad
}

// ✅ Permitido con justificación especial
{
  baseRole: "Administrador",
  permissionAdjustments: {
    removed: ["prescriptions.sign", "prescriptions.dispense"] // Admin sin acceso clínico
  }
}
```

## 📋 Flujo de Trabajo

### Escenario 1: Asignar Rol Base (Común)

```
1. Admin selecciona usuario
2. Admin asigna rol base (ej: "Médico")
3. Usuario recibe permisos estándar del rol
4. ✅ Listo - Sin aprobaciones necesarias
```

### Escenario 2: Crear Rol Personalizado (Especial)

```
1. Admin identifica necesidad especial
2. Admin crea rol personalizado:
   - Selecciona rol base
   - Ajusta permisos (+ o -)
   - Escribe justificación
   - Especifica usuario objetivo
3. Sistema valida:
   - ¿Viola SoD? → ❌ Rechaza
   - ¿Permisos críticos agregados? → Requiere aprobación
4. Si requiere aprobación:
   - Notifica a aprobadores
   - Queda en estado "Pendiente"
   - Aprobador revisa y decide
5. Una vez aprobado:
   - Se asigna al usuario
   - Se registra en auditoría
   - Usuario recibe notificación
```

### Escenario 3: Modificar Rol Personalizado Existente

```
1. Admin accede a rol personalizado activo
2. Admin ajusta permisos
3. Sistema compara cambios:
   - ¿Más restrictivo? → Aprobación opcional
   - ¿Más permisivo? → Aprobación obligatoria
4. Se crea nuevo registro de auditoría
5. Usuario recibe notificación de cambio
```

## 🎨 Interfaz de Usuario

### Vista de Roles Base

```
┌─────────────────────────────────────────────┐
│  ROLES BASE DEL SISTEMA                     │
├─────────────────────────────────────────────┤
│                                             │
│  [🛡️] Administrador                         │
│  └─ 82 usuarios · CRÍTICO                   │
│  └─ [Ver permisos] [Asignar a usuario]      │
│                                             │
│  [👨‍⚕️] Médico                                │
│  └─ 345 usuarios · ALTO                     │
│  └─ [Ver permisos] [Asignar a usuario]      │
│     [⭐ Crear versión personalizada]         │
│                                             │
└─────────────────────────────────────────────┘
```

### Vista de Roles Personalizados

```
┌─────────────────────────────────────────────┐
│  ROLES PERSONALIZADOS                       │
├─────────────────────────────────────────────┤
│                                             │
│  [⭐] Admin Respaldo TI                      │
│  └─ Base: Administrador                     │
│  └─ Usuario: Carlos Rojas (USR-0042)        │
│  └─ Ajustes:                                │
│     • ➖ Eliminar usuarios                   │
│     • ➖ Restaurar sistema                   │
│  └─ [Ver detalles] [Modificar] [Revocar]    │
│                                             │
│  [⭐] Médico Jefe ER                         │
│  └─ Base: Médico Jefe                       │
│  └─ Usuario: Dra. Ana Vargas (USR-0089)     │
│  └─ Ajustes:                                │
│     • ➕ Anular alertas (emergencias)        │
│  └─ ⚠️ Requiere justificación en cada uso   │
│  └─ [Ver detalles] [Modificar] [Revocar]    │
│                                             │
└─────────────────────────────────────────────┘
```

### Diálogo: Crear Rol Personalizado

```
┌─────────────────────────────────────────────┐
│  ⭐ Crear Rol Personalizado                  │
├─────────────────────────────────────────────┤
│                                             │
│  1. Seleccionar rol base:                   │
│     [Dropdown] Médico ▼                     │
│                                             │
│  2. Asignar a usuario:                      │
│     [Search] Dra. Ana Vargas ▼              │
│     USR-0089 · Médico · Emergencias         │
│                                             │
│  3. Nombre del rol personalizado:           │
│     [Input] Médico Jefe ER                  │
│                                             │
│  4. Ajustar permisos:                       │
│                                             │
│     Permisos del rol base:                  │
│     ✓ Crear recetas                         │
│     ✓ Firmar recetas                        │
│     ✓ Ver pacientes                         │
│     ... (ver todos)                         │
│                                             │
│     [+ Agregar permiso adicional]           │
│     [- Quitar permiso existente]            │
│                                             │
│     Permisos agregados:                     │
│     ✓ Anular alertas críticas ⚠️ CRÍTICO    │
│                                             │
│  5. Justificación (obligatoria):            │
│     [Textarea]                              │
│     "Médico jefe de sala de emergencias     │
│      requiere capacidad de anular alertas   │
│      en situaciones críticas de vida o      │
│      muerte donde el juicio clínico         │
│      prevalece sobre alertas automatizadas" │
│                                             │
│  6. Vigencia:                               │
│     [Radio] ○ Permanente                    │
│            ● Temporal hasta: [Date picker]  │
│                                             │
│  ⚠️ Este rol incluye permisos críticos      │
│     Requiere aprobación de:                 │
│     • Director Médico                       │
│     • Oficial de Seguridad                  │
│                                             │
│     [Cancelar] [Solicitar aprobación] ✓     │
│                                             │
└─────────────────────────────────────────────┘
```

## 🔍 Consultas Comunes

### ¿Cuándo usar Rol Base?
✅ **Para el 90% de usuarios**
- Médicos estándar
- Farmacéuticos regulares
- Personal administrativo típico
- Nuevos empleados

### ¿Cuándo crear Rol Personalizado?
✅ **Solo cuando necesario**
- Casos especiales (ER, UCI, Oncología)
- Investigadores clínicos
- Consultores temporales
- Roles híbridos departamentales

### ¿Cómo mantener seguridad?
✅ **Revisión periódica**
- Auditar roles personalizados mensualmente
- Verificar justificaciones siguen vigentes
- Revocar roles de usuarios inactivos
- Actualizar cuando cambia el puesto

## 📊 Reportes de Cumplimiento

### Reporte 1: Roles Personalizados Activos
```sql
Lista de todos los roles personalizados
├─ Usuario asignado
├─ Rol base origen
├─ Permisos ajustados
├─ Justificación
├─ Aprobador y fecha
└─ Última revisión
```

### Reporte 2: Desviaciones de SoD
```sql
Alertas de potenciales conflictos
├─ Usuarios con múltiples roles
├─ Roles que combinan permisos sensibles
├─ Excepciones temporales próximas a vencer
└─ Roles sin revisión en 6+ meses
```

### Reporte 3: Auditoría de Uso
```sql
Uso real de permisos especiales
├─ Permisos críticos utilizados
├─ Frecuencia de uso
├─ Justificaciones proporcionadas
└─ Alertas de uso inusual
```

## 🎯 Implementación Técnica

### Estructura de Datos

```typescript
interface BaseRole {
  id: string;
  name: string;
  code: string;
  type: 'base'; // Inmutable
  description: string;
  permissions: RolePermissions;
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  canBeCustomized: boolean;
  usersCount: number; // Usuarios con este rol exacto
  createdDate: string;
}

interface CustomRole {
  id: string;
  name: string;
  code: string;
  type: 'custom'; // Personalizado
  baseRoleId: string;
  baseRoleName: string;
  userId: string; // Usuario específico
  userName: string;
  description: string;
  
  permissionAdjustments: {
    added: string[]; // Permisos agregados al rol base
    removed: string[]; // Permisos quitados del rol base
  };
  
  effectivePermissions: RolePermissions; // Calculado automáticamente
  
  justification: string;
  createdBy: string;
  createdByName: string;
  createdDate: string;
  
  approvalRequired: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  
  validFrom: string;
  validUntil?: string; // null = permanente
  
  lastReviewed?: string;
  reviewedBy?: string;
  
  status: 'active' | 'suspended' | 'expired' | 'revoked';
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface RoleAssignment {
  userId: string;
  userName: string;
  roleType: 'base' | 'custom';
  roleId: string;
  roleName: string;
  assignedDate: string;
  assignedBy: string;
  expiresAt?: string;
}
```

## 🚀 Migración del Sistema Actual

### Paso 1: Identificar Roles Base
```typescript
// Los roles actuales se convierten en roles base
const baseRoles = [
  'Administrador',
  'Médico',
  'Farmacéutico',
  'Médico Jefe',
  'Administrativo'
];
```

### Paso 2: Permitir Personalización
```typescript
// Nueva opción en UI: "Crear versión personalizada"
// Disponible al asignar rol a usuario
```

### Paso 3: Migración Suave
```typescript
// Usuarios existentes mantienen sus roles base
// Nuevas asignaciones pueden ser personalizadas
// Sin romper funcionalidad existente
```

## ✅ Beneficios del Sistema Híbrido

### Para el Hospital
- ✅ Flexibilidad operativa
- ✅ Cumplimiento normativo garantizado
- ✅ Reducción de roles "especiales" sin control
- ✅ Auditoría completa de excepciones

### Para Seguridad
- ✅ Trazabilidad de cambios
- ✅ Justificación obligatoria
- ✅ Aprobaciones documentadas
- ✅ Revisión periódica facilitada

### Para Usuarios
- ✅ Permisos ajustados a sus necesidades reales
- ✅ Sin "sobre-permisos" innecesarios
- ✅ Claridad sobre sus capacidades
- ✅ Proceso transparente

## 📚 Referencias

**Estándares Implementados:**
- ✅ NIST SP 800-53 (Control de Acceso)
- ✅ ISO 27001 (Gestión de Seguridad)
- ✅ HIPAA (Mínimo Privilegio)
- ✅ FDA 21 CFR Part 11 (Separación de Funciones)

**Basado en prácticas de:**
- Mayo Clinic (Minnesota, USA)
- Johns Hopkins Hospital (Maryland, USA)
- Cleveland Clinic (Ohio, USA)
- Kaiser Permanente (California, USA)
- NHS Digital (UK)

---

**Conclusión:** El sistema híbrido de dos niveles (Roles Base + Roles Personalizados) es el estándar de la industria hospitalaria internacional y proporciona el balance perfecto entre seguridad, cumplimiento normativo y flexibilidad operativa.
