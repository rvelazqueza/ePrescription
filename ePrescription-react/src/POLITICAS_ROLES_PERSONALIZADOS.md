# 📋 Políticas de Restricción de Roles Personalizados

## 🎯 Resumen Ejecutivo

El sistema ePrescription implementa un **modelo de roles personalizados con asignación específica por usuario**, basado en principios de seguridad de HIPAA, FDA 21 CFR Part 11 y estándares HL7 FHIR.

**Estado actual:**
- ✅ 3 roles personalizados creados
- ⚠️ Problema: Roles NO se muestran al editar otros usuarios
- 🔍 Causa: Filtrado restrictivo basado en `userId`

---

## 📊 Roles Personalizados Actuales

### 1. Admin Respaldo TI
```typescript
ID: CUSTOM-001
Usuario asignado: USR-0042 (Carlos Rojas Méndez)
Basado en: Administrador (ROLE-001)
Permisos removidos:
  - users.delete (No puede eliminar usuarios)
  - system.restore (No puede restaurar sistema)
Justificación: "Administrador de soporte técnico nivel 2. No requiere 
                acceso a funciones críticas de eliminación"
Estado: Activo, Permanente
```

### 2. Médico Jefe ER
```typescript
ID: CUSTOM-002
Usuario asignado: USR-0089 (Dra. Ana Vargas Solís)
Basado en: Médico Jefe (ROLE-004)
Permisos agregados:
  - clinical_alerts.override (Puede anular alertas críticas)
Justificación: "Médico jefe de sala de emergencias requiere capacidad 
                de anular alertas en situaciones de vida o muerte"
Estado: Activo, Permanente
Requiere aprobación: SÍ (Aprobado por Director Médico)
```

### 3. Farmacéutico Investigador
```typescript
ID: CUSTOM-003
Usuario asignado: USR-0123 (Lic. Marco Solís Castro)
Basado en: Farmacéutico (ROLE-003)
Permisos agregados:
  - reports.export (Exportar reportes completos)
  - interoperability.export (Exportar datos FHIR)
Permisos removidos:
  - prescriptions.dispense (No dispensa medicamentos)
  - inventory.adjust (No ajusta inventario)
Justificación: "Farmacéutico de investigación clínica. No dispensa 
                pero requiere exportación para estudios"
Estado: Activo, Temporal (hasta 2025-12-31)
Requiere aprobación: SÍ (Aprobado por Director de Investigación)
```

---

## 🔐 Modelo de Seguridad Actual

### Arquitectura: **Asignación Específica por Usuario**

```
┌─────────────────────────────────────────────────────┐
│         ROLES BASE (Predefinidos, Inmutables)       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │Administrador│  │   Médico    │  │Farmacéutico ││
│  │  (ROLE-001) │  │  (ROLE-002) │  │  (ROLE-003) ││
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘│
│         │                │                │        │
└─────────┼────────────────┼────────────────┼────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────┐
│      ROLES PERSONALIZADOS (Derivados + Específicos) │
│  ┌──────────────────────────────────────────────┐  │
│  │ Admin Respaldo TI (CUSTOM-001)               │  │
│  │ ├─ Basado en: Administrador                  │  │
│  │ ├─ Usuario: USR-0042 (Carlos Rojas)          │  │
│  │ └─ Permisos: Base - {delete, restore}        │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Médico Jefe ER (CUSTOM-002)                  │  │
│  │ ├─ Basado en: Médico Jefe                    │  │
│  │ ├─ Usuario: USR-0089 (Dra. Ana Vargas)       │  │
│  │ └─ Permisos: Base + {override alerts}        │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Farmacéutico Investigador (CUSTOM-003)       │  │
│  │ ├─ Basado en: Farmacéutico                   │  │
│  │ ├─ Usuario: USR-0123 (Marco Solís)           │  │
│  │ └─ Permisos: Base + {export} - {dispense}    │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Característica clave:** Cada rol personalizado tiene un `userId` específico.

---

## 🔍 Problema Actual: Filtrado Restrictivo

### Código Implementado (UserEditDialog.tsx)

```tsx
// Línea ~335
const availableCustomRoles = useMemo(() => 
  customRoles.filter(role => !role.userId || role.userId === user.id),
  [customRoles, user.id]
);
```

### Lógica del Filtro

```
Para cada rol personalizado:
  SI (rol NO tiene userId) O (userId del rol === ID del usuario que se edita)
    → MOSTRAR el rol
  SINO
    → OCULTAR el rol
```

### Resultado

**Ejemplo: Editar usuario Dr. Juan Pérez (USR-0023)**

```
┌──────────────────────────────────────────────────────┐
│ Roles Personalizados Disponibles                     │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ℹ️ No hay roles personalizados disponibles.         │
│     Puede crear roles personalizados desde la        │
│     página de Roles y Permisos.                      │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**¿Por qué?**
- ❌ `Admin Respaldo TI` tiene `userId: USR-0042` ≠ `USR-0023`
- ❌ `Médico Jefe ER` tiene `userId: USR-0089` ≠ `USR-0023`
- ❌ `Farmacéutico Investigador` tiene `userId: USR-0123` ≠ `USR-0023`

**Resultado:** Ningún rol cumple el filtro → Lista vacía

---

## 📚 Fundamentos y Estándares

### 1. HIPAA (Health Insurance Portability and Accountability Act)

**Principio:** Minimum Necessary Rule
> "Solo se debe otorgar el mínimo acceso necesario para cumplir funciones laborales"

**Aplicación en ePrescription:**
```
✅ CORRECTO: Roles personalizados específicos por usuario
   - Cada usuario tiene permisos exactos que necesita
   - No hay sobre-privilegios (privilege creep)
   - Auditoría granular de quién tiene qué permiso

❓ CUESTIONABLE: Roles personalizados compartidos
   - Varios usuarios con mismo rol personalizado
   - Dificulta la auditoría individual
   - Riesgo de privilege creep si no se revisa
```

**Referencia:** 45 CFR § 164.514(d)(3)

---

### 2. FDA 21 CFR Part 11 (Electronic Records; Electronic Signatures)

**Principio:** Individual Accountability
> "El sistema debe garantizar responsabilidad individual sobre acciones críticas"

**Aplicación en ePrescription:**
```
✅ CORRECTO: Asignación 1:1 (Usuario → Rol Personalizado)
   § 11.10(g) Use of authority checks: Verificación de autoridad individual
   § 11.10(i) Record retention: Trazabilidad completa de permisos por usuario
   § 11.300(d) Non-repudiation: No puede negar acciones (firmeza jurídica)

❌ PROBLEMÁTICO: Roles compartidos sin diferenciación
   - Dificulta la no-repudiación
   - Varios usuarios con mismos permisos críticos
   - Auditoría menos específica
```

**Referencia:** 21 CFR § 11.10 y 21 CFR § 11.300

---

### 3. HL7 FHIR Security

**Estándar:** SMART on FHIR Authorization
> "El acceso a recursos debe ser específico por usuario y contexto"

**Aplicación en ePrescription:**
```
✅ FHIR Security Label: Roles personalizados con etiquetas únicas
   - Cada rol tiene 'userId' que actúa como security label
   - Permite control de acceso basado en atributos (ABAC)
   - Compatible con FHIR Consent resources

FHIR Resource: Practitioner
  ├─ identifier: userId
  ├─ role: custom roleId
  └─ securityLabel: CUSTOM-001, CUSTOM-002, etc.
```

**Referencia:** HL7 FHIR R4 - Security and Privacy Module

---

### 4. ISO 27001 (Information Security Management)

**Control:** A.9.2.3 Management of privileged access rights
> "La asignación y uso de derechos de acceso privilegiados debe estar restringida y controlada"

**Aplicación en ePrescription:**
```
✅ CORRECTO según ISO 27001:
   - Asignación individual de privilegios especiales
   - Justificación obligatoria (campo 'justification')
   - Aprobación requerida para roles críticos
   - Revisión periódica (campo 'lastReviewed')
   - Temporalidad definida (campo 'validUntil')

Ejemplo: Médico Jefe ER
  ├─ Privilegio especial: Override alertas críticas
  ├─ Justificación: Situaciones de vida o muerte
  ├─ Aprobación: Director Médico (USR-0003)
  ├─ Revisión: Cada 60 días
  └─ Auditoría: Cada uso registrado
```

**Referencia:** ISO/IEC 27001:2013 - Annex A.9.2.3

---

### 5. NIST 800-53 (Security and Privacy Controls)

**Control:** AC-2 Account Management
> "Identificar tipos de cuentas, asignar administradores y especificar condiciones"

**Aplicación en ePrescription:**
```
AC-2(7) Role-Based Schemes:
  ✅ Roles base predefinidos (5 roles base)
  ✅ Roles derivados para casos especiales (custom roles)
  ✅ Asignación explícita por usuario
  ✅ Revisión periódica de asignaciones

AC-2(12) Account Monitoring / Atypical Usage:
  ✅ Campo 'lastModified' en cada rol
  ✅ Auditoría en 'rolesAuditLog'
  ✅ Alertas para uso atípico de permisos especiales
```

**Referencia:** NIST SP 800-53 Rev. 5

---

## 🎭 Modelos de Asignación de Roles Personalizados

### Modelo A: **Asignación Específica (ACTUAL)**

```typescript
interface CustomRoleDefinition {
  userId: string;  // ← Usuario ÚNICO al que se asigna
  userName: string;
  userEmail: string;
  // ...
}
```

**Pros:**
- ✅ Máxima trazabilidad (1 rol = 1 usuario)
- ✅ Cumplimiento estricto de FDA 21 CFR Part 11
- ✅ No-repudiación total (el usuario no puede negar)
- ✅ Auditoría granular y específica
- ✅ Fácil identificar quién tiene qué permiso especial

**Contras:**
- ❌ Roles NO reutilizables entre usuarios
- ❌ Si 10 usuarios necesitan mismo rol → 10 roles personalizados
- ❌ Gestión administrativa más compleja
- ❌ Duplicación de definiciones similares

**Ejemplo:**
```
Situación: 3 médicos de emergencias necesitan override de alertas

Solución Modelo A:
├─ CUSTOM-002: Médico Jefe ER → USR-0089 (Dra. Ana Vargas)
├─ CUSTOM-004: Médico Jefe ER → USR-0091 (Dr. Pedro Sánchez)
└─ CUSTOM-005: Médico Jefe ER → USR-0095 (Dr. Luis Mora)

Total: 3 roles personalizados (uno por usuario)
```

**¿Cuándo usar?**
- Permisos críticos que requieren aprobación individual
- Situaciones temporales o excepcionales
- Roles con alta responsabilidad legal
- Cumplimiento estricto de regulaciones

---

### Modelo B: **Roles Compartidos**

```typescript
interface CustomRoleDefinition {
  userId?: string;  // ← Opcional, si está vacío es compartible
  assignedUsers?: string[];  // ← Lista de usuarios asignados
  // ...
}
```

**Pros:**
- ✅ Reutilizable entre múltiples usuarios
- ✅ Menos duplicación de configuración
- ✅ Gestión administrativa más simple
- ✅ Escalable para equipos grandes

**Contras:**
- ❌ Trazabilidad menos específica
- ❌ Requiere auditoría adicional (quién hizo qué)
- ❌ Riesgo de privilege creep si no se revisa
- ❌ Puede NO cumplir FDA 21 CFR Part 11 estrictamente

**Ejemplo:**
```
Situación: 3 médicos de emergencias necesitan override de alertas

Solución Modelo B:
└─ CUSTOM-002: Médico Jefe ER (COMPARTIDO)
   ├─ assignedUsers: [USR-0089, USR-0091, USR-0095]
   └─ Total: 1 rol personalizado compartido
```

**¿Cuándo usar?**
- Equipos con mismas funciones (ej: farmacéuticos del mismo turno)
- Permisos de bajo-medio riesgo
- Sin regulaciones estrictas de no-repudiación
- Contextos donde la auditoría por acción es suficiente

---

### Modelo C: **Híbrido (RECOMENDADO)**

```typescript
interface CustomRoleDefinition {
  userId?: string;  // Opcional
  sharingPolicy: 'exclusive' | 'shared';  // ← Nueva política
  maxAssignments?: number;  // Límite de usuarios si es shared
  assignedUsers?: string[];
  // ...
}
```

**Característica:** Combina ambos modelos según criticidad

```
ROLES CRÍTICOS (sharingPolicy: 'exclusive'):
  - userId obligatorio
  - Asignación 1:1
  - Requiere aprobación individual
  - Ejemplos: Override alertas, Eliminar usuarios, Restaurar sistema

ROLES NO CRÍTICOS (sharingPolicy: 'shared'):
  - userId opcional
  - Puede asignarse a múltiples usuarios
  - Aprobación puede ser grupal
  - Ejemplos: Exportar reportes, Consultar inventario ampliado
```

**Ejemplo Completo:**
```typescript
// ROL CRÍTICO - Exclusivo
{
  id: 'CUSTOM-002',
  name: 'Médico Jefe ER - Override Alertas',
  sharingPolicy: 'exclusive',
  userId: 'USR-0089',  // Solo Dra. Ana Vargas
  permissionAdjustments: {
    added: ['clinical_alerts.override']  // CRÍTICO
  },
  approvalRequired: true,
  securityLevel: 'critical'
}

// ROL NO CRÍTICO - Compartido
{
  id: 'CUSTOM-006',
  name: 'Farmacéutico - Consulta Ampliada',
  sharingPolicy: 'shared',
  userId: undefined,  // Compartible
  assignedUsers: ['USR-0150', 'USR-0151', 'USR-0152'],  // 3 farmacéuticos
  maxAssignments: 10,  // Máximo 10 usuarios
  permissionAdjustments: {
    added: ['reports.read']  // NO CRÍTICO
  },
  approvalRequired: false,
  securityLevel: 'medium'
}
```

---

## 🚀 Opciones de Implementación

### Opción 1: **Mantener Modelo A (Sin cambios)**

**Política:** Roles personalizados son SIEMPRE específicos de un usuario.

**Código:** Ya implementado (actual)

```tsx
// UserEditDialog.tsx
const availableCustomRoles = useMemo(() => 
  customRoles.filter(role => role.userId === user.id),
  [customRoles, user.id]
);
```

**Flujo de Trabajo:**
```
1. Administrador identifica que Dr. Juan Pérez (USR-0023) 
   necesita permisos especiales

2. Administrador va a "Roles y Permisos"

3. Click en "Crear Rol Personalizado"

4. Seleccionar:
   - Rol base: Médico
   - Usuario: Dr. Juan Pérez (USR-0023)
   - Agregar permiso: clinical_alerts.override
   - Justificación: "Médico de guardia con necesidad de..."

5. Aprobar el rol

6. Ahora al editar USR-0023, el rol personalizado aparece
```

**Pros:**
- ✅ Cumplimiento total de regulaciones
- ✅ Máxima seguridad
- ✅ No requiere cambios de código

**Contras:**
- ❌ Requiere crear rol nuevo para cada usuario
- ❌ Más trabajo administrativo

---

### Opción 2: **Migrar a Modelo B (Compartidos)**

**Política:** Roles personalizados pueden asignarse a múltiples usuarios.

**Cambios Requeridos:**

**A. Modificar interface en rolesStore.ts:**
```typescript
export interface CustomRoleDefinition {
  id: string;
  name: string;
  // ...
  
  // CAMBIAR de campo único a array
  assignedUserIds: string[];  // Array de usuarios asignados
  assignedUsers: Array<{      // Detalles de usuarios
    userId: string;
    userName: string;
    userEmail: string;
    assignedDate: string;
    assignedBy: string;
  }>;
  
  // DEPRECAR estos campos
  // userId: string;  ← REMOVER
  // userName: string;  ← REMOVER
  // userEmail: string;  ← REMOVER
}
```

**B. Actualizar roles existentes:**
```typescript
// rolesStore.ts
let customRolesDatabase: CustomRoleDefinition[] = [
  {
    id: 'CUSTOM-001',
    name: 'Admin Respaldo TI',
    // ...
    assignedUserIds: ['USR-0042'],  // Puede crecer a ['USR-0042', 'USR-0050']
    assignedUsers: [{
      userId: 'USR-0042',
      userName: 'Carlos Rojas Méndez',
      userEmail: 'carlos.rojas@hospital.com',
      assignedDate: '2024-08-15',
      assignedBy: 'USR-0001'
    }]
  }
];
```

**C. Modificar filtro en UserEditDialog.tsx:**
```tsx
const availableCustomRoles = useMemo(() => 
  customRoles.filter(role => 
    // Mostrar si el rol NO está asignado a nadie (nuevo)
    role.assignedUserIds.length === 0 ||
    // O si YA está asignado a este usuario
    role.assignedUserIds.includes(user.id)
  ),
  [customRoles, user.id]
);
```

**Flujo de Trabajo:**
```
1. Administrador crea "Médico Jefe ER" sin asignar a nadie

2. Al editar Dr. Juan Pérez (USR-0023):
   ✅ Aparece "Médico Jefe ER" como disponible
   ✅ Checkbox para asignarlo

3. Al marcar checkbox:
   - Se agrega USR-0023 a assignedUserIds
   - Se actualiza assignedUsers con datos del usuario

4. Ahora el rol está en:
   - Dra. Ana Vargas (USR-0089) - Original
   - Dr. Juan Pérez (USR-0023) - Nuevo
```

**Pros:**
- ✅ Roles reutilizables
- ✅ Menos duplicación
- ✅ Gestión más simple

**Contras:**
- ❌ Requiere refactorización significativa
- ❌ Puede NO cumplir FDA 21 CFR Part 11 estrictamente
- ❌ Auditoría menos granular

---

### Opción 3: **Implementar Modelo C (Híbrido) ⭐ RECOMENDADO**

**Política:** Roles críticos son exclusivos, roles no críticos son compartibles.

**Cambios Requeridos:**

**A. Extender interface:**
```typescript
export interface CustomRoleDefinition {
  id: string;
  name: string;
  // ...
  
  // NUEVA política de compartición
  sharingPolicy: 'exclusive' | 'shared';
  
  // Para roles exclusivos
  userId?: string;
  userName?: string;
  userEmail?: string;
  
  // Para roles compartidos
  assignedUserIds?: string[];
  assignedUsers?: Array<{
    userId: string;
    userName: string;
    userEmail: string;
    assignedDate: string;
    assignedBy: string;
  }>;
  maxAssignments?: number;  // Límite si es compartido
}
```

**B. Clasificar roles existentes:**
```typescript
// EXCLUSIVO - Crítico
{
  id: 'CUSTOM-002',
  name: 'Médico Jefe ER',
  sharingPolicy: 'exclusive',  // Solo 1 usuario
  userId: 'USR-0089',
  permissionAdjustments: {
    added: ['clinical_alerts.override']  // CRÍTICO
  },
  securityLevel: 'critical'
}

// COMPARTIDO - No crítico
{
  id: 'CUSTOM-004',
  name: 'Médico - Reportes Ampliados',
  sharingPolicy: 'shared',  // Múltiples usuarios
  assignedUserIds: ['USR-0089', 'USR-0091'],
  maxAssignments: 20,
  permissionAdjustments: {
    added: ['reports.export']  // NO CRÍTICO
  },
  securityLevel: 'medium'
}
```

**C. Filtro inteligente en UserEditDialog.tsx:**
```tsx
const availableCustomRoles = useMemo(() => 
  customRoles.filter(role => {
    if (role.sharingPolicy === 'exclusive') {
      // Roles exclusivos: solo si está asignado a este usuario
      return role.userId === user.id;
    } else {
      // Roles compartidos: si no está asignado a nadie O ya lo tiene
      return (
        !role.assignedUserIds ||
        role.assignedUserIds.length === 0 ||
        role.assignedUserIds.includes(user.id) ||
        (role.maxAssignments && role.assignedUserIds.length < role.maxAssignments)
      );
    }
  }),
  [customRoles, user.id]
);
```

**Flujo de Trabajo:**
```
ROLES CRÍTICOS (exclusive):
├─ Solo aparecen si YA están asignados al usuario
├─ Requieren creación individual desde "Roles y Permisos"
├─ Aprobación obligatoria
└─ Auditoría estricta

ROLES NO CRÍTICOS (shared):
├─ Aparecen como disponibles para cualquier usuario
├─ Se asignan con checkbox en "Editar Usuario"
├─ Aprobación puede ser opcional
└─ Auditoría normal
```

**Pros:**
- ✅ Mejor de ambos mundos
- ✅ Cumplimiento regulatorio para lo crítico
- ✅ Flexibilidad para lo no crítico
- ✅ Escalable y mantenible

**Contras:**
- ⚠️ Requiere refactorización moderada
- ⚠️ Lógica más compleja
- ⚠️ Necesita documentación clara

---

## 📋 Matriz de Comparación

| Característica | Modelo A<br>(Exclusivo) | Modelo B<br>(Compartido) | Modelo C<br>(Híbrido) |
|---|---|---|---|
| **Cumplimiento FDA 21 CFR Part 11** | ✅ Completo | ⚠️ Limitado | ✅ Completo (críticos) |
| **Cumplimiento HIPAA Minimum Necessary** | ✅ Óptimo | ⚠️ Requiere revisión | ✅ Óptimo |
| **Trazabilidad individual** | ✅ 100% | ⚠️ 70% | ✅ 100% (críticos) |
| **Reutilización de roles** | ❌ No | ✅ Sí | ✅ Sí (no críticos) |
| **Escalabilidad** | ⚠️ Media | ✅ Alta | ✅ Alta |
| **Complejidad administrativa** | ⚠️ Alta | ✅ Baja | ⚠️ Media |
| **Complejidad técnica** | ✅ Baja | ⚠️ Media | ⚠️ Alta |
| **Auditoría** | ✅ Granular | ⚠️ Requiere trabajo | ✅ Granular |
| **Duplicación de configuración** | ❌ Alta | ✅ Baja | ⚠️ Media |
| **Cambios de código requeridos** | ✅ Ninguno | ⚠️ Moderados | ⚠️ Significativos |

---

## 🎯 Recomendación Final

### **Opción Recomendada: Modelo C (Híbrido)**

**Razones:**

1. **Cumplimiento Regulatorio:**
   - Roles críticos (override, delete, restore) → Exclusivos → ✅ FDA 21 CFR Part 11
   - Roles no críticos (reportes, consultas) → Compartidos → ✅ Eficiencia

2. **Balance Seguridad/Usabilidad:**
   - Máxima seguridad donde importa (permisos críticos)
   - Flexibilidad donde es seguro (permisos no críticos)

3. **Escalabilidad:**
   - Equipo pequeño (5-10 usuarios) → Roles exclusivos manejables
   - Equipo grande (50+ usuarios) → Roles compartidos para lo común

4. **Auditoría:**
   - Acciones críticas → Trazabilidad 1:1 con usuario
   - Acciones normales → Auditoría por acción (suficiente)

### **Clasificación de Permisos por Criticidad**

```
CRÍTICO (exclusive):
├─ clinical_alerts.override
├─ users.delete
├─ system.restore
├─ patients.delete
├─ prescriptions.delete
└─ audit.configure

ALTO (exclusive o shared según contexto):
├─ users.manage_roles
├─ inventory.adjust
├─ patients.export
└─ reports.configure

MEDIO-BAJO (shared):
├─ reports.export
├─ interoperability.export
├─ prescriptions.update
└─ inventory.read (ampliado)
```

---

## 🛠️ Plan de Implementación

### Fase 1: Análisis (2 horas)
- [ ] Revisar todos los permisos del sistema
- [ ] Clasificar por nivel de criticidad
- [ ] Definir cuáles son `exclusive` vs `shared`
- [ ] Documentar justificación de cada clasificación

### Fase 2: Refactorización del Modelo (4 horas)
- [ ] Actualizar `CustomRoleDefinition` interface
- [ ] Agregar campo `sharingPolicy`
- [ ] Migrar roles existentes al nuevo formato
- [ ] Actualizar funciones helper de rolesStore.ts

### Fase 3: Actualizar UI (3 horas)
- [ ] Modificar filtro en `UserEditDialog.tsx`
- [ ] Agregar indicador visual (badge) para tipo de rol
- [ ] Mostrar usuarios asignados en roles compartidos
- [ ] Validaciones de maxAssignments

### Fase 4: Testing (2 horas)
- [ ] Probar asignación de roles exclusivos
- [ ] Probar asignación de roles compartidos
- [ ] Verificar límites y validaciones
- [ ] Probar auditoría y logs

### Fase 5: Documentación (1 hora)
- [ ] Actualizar guías de usuario
- [ ] Documentar políticas de asignación
- [ ] Crear matriz de permisos por rol

**Total estimado: 12 horas**

---

## 📞 Siguiente Paso

**Decisión requerida:**

```
PREGUNTA: ¿Qué modelo prefieres implementar?

A. Modelo A - Mantener actual (exclusivo siempre)
   ├─ Pros: Sin cambios, máxima seguridad
   └─ Contras: Requiere crear rol por cada usuario

B. Modelo B - Migrar a compartido (siempre reutilizable)
   ├─ Pros: Más fácil de gestionar
   └─ Contras: Puede no cumplir regulaciones estrictamente

C. Modelo C - Híbrido (críticos exclusivos, normales compartidos) ⭐
   ├─ Pros: Balance óptimo
   └─ Contras: Requiere refactorización moderada

RESPONDE CON: A, B o C
```

Si eliges **C (recomendado)**, necesito que:
1. Revises la clasificación de permisos críticos
2. Confirmes cuáles roles actuales deben ser `exclusive` vs `shared`
3. Apruebo comenzar la refactorización

---

**Fecha:** 2025-10-10  
**Versión:** 1.0  
**Autor:** Sistema ePrescription  
**Referencias:** HIPAA, FDA 21 CFR Part 11, HL7 FHIR R4, ISO 27001, NIST 800-53
