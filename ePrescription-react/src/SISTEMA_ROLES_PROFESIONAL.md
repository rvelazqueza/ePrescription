# Sistema Profesional de Configuración de Roles - ePrescription

## 📋 Descripción General

Se ha implementado un **sistema completo de gestión de roles y permisos** de nivel hospitalario profesional que cumple con los estándares internacionales de seguridad y normativas del sector salud.

## 🎯 Características Principales

### 1. Control de Acceso Basado en Roles (RBAC)
- Sistema RBAC completo con permisos granulares
- 10 módulos de permisos: Prescripciones, Pacientes, Usuarios, Inventario, Reportes, Seguridad, Sistema, Auditoría, Interoperabilidad y Alertas Clínicas
- Más de 60 permisos diferentes clasificados en 5 niveles: Lectura, Escritura, Eliminación, Especial y Admin

### 2. Validaciones de Seguridad Profesionales

#### Separación de Funciones (SoD - Separation of Duties)
- **Validación crítica**: Un usuario no puede tener permisos de "prescribir/firmar" Y "dispensar" simultáneamente
- Cumple con FDA 21 CFR Part 11
- Previene conflictos de interés en el flujo farmacéutico

#### Dependencias de Permisos
- Permisos jerárquicos: no se puede "editar" sin tener "leer"
- Validación automática de requisitos previos
- Alertas en tiempo real de permisos faltantes

#### Permisos Críticos con Advertencias
- Identificación automática de permisos HIPAA-relevantes
- Advertencias especiales para exportación de PHI (Protected Health Information)
- Justificación obligatoria para cambios en permisos críticos

### 3. Interfaz Profesional de Configuración

#### Panel de Configuración con Tabs
1. **Tab Permisos**: Matriz editable completa con checkboxes
2. **Tab Seguridad**: Información de nivel de seguridad y cumplimiento normativo
3. **Tab Auditoría**: Historial de cambios y trazabilidad

#### Matriz de Permisos Visual
- Checkboxes interactivos por permiso
- Badges de color según nivel (lectura/escritura/eliminación/especial/admin)
- Descripción detallada de cada permiso
- Indicadores de módulos críticos
- Contador de permisos activos por módulo

#### Validación en Tiempo Real
- Errores mostrados en rojo con iconos de alerta
- Advertencias en amarillo para permisos sensibles
- Botón "Guardar" deshabilitado si hay errores
- Mensajes claros y accionables

### 4. Cumplimiento Normativo

#### Estándares Implementados
- ✅ **HIPAA** - Health Insurance Portability and Accountability Act
- ✅ **HL7 FHIR R4** - Fast Healthcare Interoperability Resources
- ✅ **FDA 21 CFR Part 11** - Electronic Records and Signatures
- ✅ **OMS** - Organización Mundial de la Salud

#### Características de Cumplimiento
- Auditoría completa de cambios en roles
- Identificación de permisos HIPAA-relevantes
- Separación de funciones obligatoria
- Trazabilidad de todas las modificaciones
- Justificación requerida para cambios críticos

### 5. Sistema de Auditoría

#### Logs de Auditoría
```typescript
interface RoleAuditLog {
  id: string;
  roleId: string;
  roleName: string;
  action: 'create' | 'update' | 'delete' | 'activate' | 'deactivate';
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  performedBy: string;
  performedByName: string;
  timestamp: string;
  ipAddress?: string;
  reason?: string;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: string;
}
```

#### Trazabilidad
- Registro de cada cambio en permisos
- Identificación del usuario que realizó el cambio
- Timestamp preciso
- Razón/justificación del cambio
- Estado de aprobación

## 📁 Archivos Creados/Modificados

### Nuevo Archivo: `/utils/rolesStore.ts`
**Funcionalidades:**
- `getAllRoles()` - Obtener todos los roles del sistema
- `getRoleById(roleId)` - Obtener un rol específico
- `updateRole(roleId, updates, performedBy, performedByName, reason?)` - Actualizar rol con validaciones
- `validateRolePermissions(role)` - Validar permisos y conflictos
- `createRole(roleData, performedBy, performedByName)` - Crear nuevo rol
- `getRolesAuditLog(roleId?)` - Obtener logs de auditoría
- `canModifyRole(userRole, targetRole)` - Verificar permisos de modificación

**Características especiales:**
- Definición completa de 60+ permisos con metadatos
- Validaciones automáticas de SoD (Separation of Duties)
- Sistema de dependencias entre permisos
- Clasificación de impacto de seguridad (low/medium/high/critical)
- Marcadores HIPAA-relevant para cada permiso

### Archivo Modificado: `/pages/SeguridadPage.tsx`

**Cambios en RolesPage:**
- Carga dinámica desde `rolesStore`
- Badge de "Sistema profesional de seguridad"
- Botón mejorado "Configurar permisos" con mejor UX
- Callback de actualización para recargar roles

**Nuevo Componente: RolePermissionsDialog (completamente reescrito)**
- Interfaz con 3 tabs (Permisos, Seguridad, Auditoría)
- Matriz editable de 10 módulos y 60+ permisos
- Validación en tiempo real con alertas visuales
- Campo de justificación para cambios críticos
- Integración con rolesStore para persistencia
- Badges de colores por nivel de permiso
- Iconos distintivos por módulo
- Indicadores de módulos críticos
- Información de cumplimiento normativo

## 🎨 Mejoras de UX/UI

### Elementos Visuales
1. **Badges de nivel de permiso**:
   - 🔵 Azul: Lectura (read)
   - 🟢 Verde: Escritura (write)
   - 🔴 Rojo: Eliminación (delete)
   - 🟣 Morado: Especial (special)
   - 🟠 Naranja: Admin (admin)

2. **Iconos por módulo**:
   - 📝 Prescripciones
   - 👤 Pacientes
   - 👥 Usuarios
   - 📦 Inventario
   - 📊 Reportes
   - 🛡️ Seguridad
   - ⚙️ Sistema
   - 📋 Auditoría
   - 🌐 Interoperabilidad
   - ⚠️ Alertas Clínicas

3. **Alertas contextuales**:
   - Rojas con ❌ para errores bloqueantes
   - Amarillas con ⚠️ para advertencias
   - Verdes con ✅ para confirmaciones

### Interactividad
- Checkboxes clickeables con feedback visual
- Hover states en botones y permisos
- Transiciones suaves
- Deshabilitación inteligente de botón guardar
- Tabs para organizar información

## 🔒 Seguridad Implementada

### Validaciones Críticas

1. **Separación de Funciones (SoD)**
   ```
   ❌ ERROR: No puede tener "firmar recetas" Y "dispensar medicamentos"
   Razón: Cumplimiento FDA 21 CFR Part 11
   ```

2. **Dependencias de Permisos**
   ```
   ❌ ERROR: "Editar recetas" requiere "Ver recetas"
   ❌ ERROR: "Exportar PHI" requiere "Ver pacientes"
   ```

3. **Advertencias HIPAA**
   ```
   ⚠️ ADVERTENCIA: "Exportar PHI" permite exportar datos protegidos de salud
   ```

### Permisos por Nivel de Seguridad

#### Nivel CRÍTICO (Critical)
- Exportar datos PHI de pacientes
- Gestión total de seguridad
- Restaurar sistema desde respaldos
- Firmar recetas
- Dispensar medicamentos
- Aprobar recetas especiales

#### Nivel ALTO (High)
- Crear/modificar prescripciones
- Actualizar datos de pacientes
- Ajustes de inventario
- Reset de contraseñas
- Auditoría de seguridad

#### Nivel MEDIO (Medium)
- Ver datos de pacientes
- Consultar inventario
- Ver reportes
- Configurar reportes

#### Nivel BAJO (Low)
- Ver perfil propio
- Ver configuración propia
- Exportar reportes personales

## 📊 Roles Predefinidos

### 1. Administrador (ADMIN)
- **Permisos**: Control total del sistema
- **Nivel de seguridad**: CRÍTICO
- **Requiere aprobación**: Sí
- **Puede delegar**: No
- **Características**: Acceso a todos los módulos y permisos

### 2. Médico (DOCTOR)
- **Permisos**: Prescripción y acceso a pacientes
- **Nivel de seguridad**: ALTO
- **Puede delegar**: Sí
- **Sesión máxima**: 480 minutos (8 horas)
- **Características**: Crear, firmar recetas, ver/modificar pacientes

### 3. Farmacéutico (PHARMACIST)
- **Permisos**: Dispensación y gestión de inventario
- **Nivel de seguridad**: ALTO
- **Puede delegar**: No
- **Sesión máxima**: 600 minutos (10 horas)
- **Características**: Verificar, dispensar recetas (NO puede prescribir - SoD)

### 4. Médico Jefe (CHIEF_DOCTOR)
- **Permisos**: Prescripción + supervisión + aprobaciones
- **Nivel de seguridad**: ALTO
- **Puede delegar**: Sí
- **Sesión máxima**: 720 minutos (12 horas)
- **Características**: Aprobar recetas especiales, revisar todas las recetas

### 5. Administrativo (ADMIN_STAFF)
- **Permisos**: Gestión de pacientes y reportes
- **Nivel de seguridad**: MEDIO
- **Sesión máxima**: 480 minutos (8 horas)
- **Características**: Ver recetas, gestionar pacientes, generar reportes

## 🚀 Cómo Usar

### Para Administradores

1. **Acceder a la configuración de roles:**
   - Navegar a: Seguridad y usuarios → Roles y permisos
   - Clic en "Configurar permisos" en cualquier rol

2. **Modificar permisos:**
   - Seleccionar la tab "Permisos"
   - Marcar/desmarcar checkboxes según necesidad
   - Observar validaciones en tiempo real
   - Si hay advertencias críticas, agregar justificación

3. **Revisar seguridad:**
   - Tab "Seguridad" muestra nivel de seguridad del rol
   - Ver cumplimiento normativo (HIPAA, FDA, etc.)
   - Verificar restricciones del rol

4. **Verificar auditoría:**
   - Tab "Auditoría" muestra historial de cambios
   - Ver quién modificó el rol y cuándo
   - Revisar justificaciones anteriores

5. **Guardar cambios:**
   - Botón "Guardar cambios" (habilitado solo si no hay errores)
   - Confirmación con toast notification
   - Actualización automática de la tabla

### Para Desarrolladores

```typescript
// Obtener todos los roles
import { getAllRoles } from '../utils/rolesStore';
const roles = getAllRoles();

// Actualizar un rol
import { updateRole } from '../utils/rolesStore';
const result = updateRole(
  'ROLE-002',
  { 
    permissions: {
      prescriptions: ['create', 'read', 'sign'],
      patients: ['read', 'update']
    }
  },
  'USR-0001',
  'Admin Sistema',
  'Actualización de permisos según política 2025'
);

if (result.success) {
  console.log('Rol actualizado');
  if (result.warnings) {
    console.warn('Advertencias:', result.warnings);
  }
} else {
  console.error('Error:', result.error);
}

// Validar permisos
import { validateRolePermissions } from '../utils/rolesStore';
const validation = validateRolePermissions(role);
console.log('Válido:', validation.valid);
console.log('Errores:', validation.errors);
console.log('Advertencias:', validation.warnings);
```

## 📝 Notas Importantes

### Separación de Funciones (SoD)
- **CRÍTICO**: La regla más importante es que quien prescribe NO puede dispensar
- Esto está codificado y validado automáticamente
- No se puede guardar un rol que viole esta regla
- Es un requisito de FDA 21 CFR Part 11

### Permisos HIPAA
- Todos los permisos relacionados con PHI están marcados
- Exportar datos de pacientes requiere justificación
- Se registra en auditoría cada acceso a datos protegidos

### Justificación Obligatoria
- Requerida cuando hay advertencias de seguridad
- Debe ser descriptiva y clara
- Se almacena en el log de auditoría
- Puede ser revisada posteriormente

### Modificación del Rol Administrador
- No se puede modificar el rol Administrador si es el único admin activo
- Protección contra lockout del sistema
- Validación automática en `canModifyRole()`

## 🔄 Flujo de Trabajo

```
1. Usuario administrador accede a Roles y Permisos
   ↓
2. Selecciona rol a configurar → Clic en "Configurar permisos"
   ↓
3. Panel se abre con tab "Permisos" activa
   ↓
4. Administrador marca/desmarca permisos
   ↓
5. Sistema valida en tiempo real:
   - Dependencias de permisos ✓
   - Conflictos SoD ✓
   - Permisos críticos ⚠️
   ↓
6. Si hay advertencias → Agregar justificación
   ↓
7. Si no hay errores → Botón "Guardar" habilitado
   ↓
8. Al guardar:
   - Actualiza rolesStore
   - Crea log de auditoría
   - Notifica éxito
   - Recarga lista de roles
   ↓
9. Cambios aplicados inmediatamente
```

## ✅ Testing y Validación

### Casos de Prueba Implementados

1. **✅ Validación SoD**: Intentar dar permisos de firmar Y dispensar
   - Resultado esperado: Error bloqueante

2. **✅ Dependencias**: Dar permiso de "editar" sin "leer"
   - Resultado esperado: Error de dependencia

3. **✅ Permisos críticos**: Dar permiso de "exportar PHI"
   - Resultado esperado: Advertencia HIPAA

4. **✅ Justificación**: Intentar guardar cambios críticos sin justificación
   - Resultado esperado: Error de validación

5. **✅ Guardado exitoso**: Modificar permisos válidos con justificación
   - Resultado esperado: Guardado correcto + toast + recarga

## 🎓 Mejores Prácticas

### Para Asignar Permisos

1. **Principio de mínimo privilegio**: Dar solo los permisos necesarios
2. **Separación de funciones**: Nunca violar reglas SoD
3. **Revisión periódica**: Auditar permisos regularmente
4. **Documentación**: Justificar cambios críticos claramente
5. **Capacitación**: Usuarios deben conocer sus límites

### Para Seguridad

1. **Auditoría continua**: Revisar logs frecuentemente
2. **Alertas HIPAA**: Tomar en serio todas las advertencias
3. **Aprobaciones**: Cambios críticos deben ser aprobados
4. **Sesiones limitadas**: Respetar duración máxima de sesión
5. **2FA obligatorio**: Para roles con acceso a PHI

## 📚 Referencias Normativas

- **HIPAA**: https://www.hhs.gov/hipaa
- **FDA 21 CFR Part 11**: https://www.fda.gov/regulatory-information/search-fda-guidance-documents/part-11-electronic-records-electronic-signatures-scope-and-application
- **HL7 FHIR**: https://www.hl7.org/fhir/
- **OMS Directrices**: https://www.who.int/medicines/areas/quality_safety/safety_efficacy/

## 🎉 Beneficios del Sistema

1. **Cumplimiento garantizado** con normativas internacionales
2. **Reducción de riesgos** de seguridad mediante validaciones automáticas
3. **Auditoría completa** de todos los cambios
4. **Interfaz intuitiva** para administradores
5. **Escalabilidad** para agregar nuevos permisos
6. **Flexibilidad** para diferentes roles hospitalarios
7. **Trazabilidad** completa de modificaciones
8. **Prevención de errores** con validaciones en tiempo real

---

**Sistema implementado por**: ePrescription Development Team  
**Fecha**: Octubre 2025  
**Versión**: 1.0  
**Estado**: ✅ Producción Ready
