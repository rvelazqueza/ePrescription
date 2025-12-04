# Ejemplos de Uso - RolesStore

## 📚 Guía para Desarrolladores

Este documento proporciona ejemplos prácticos de cómo usar el sistema de roles y permisos en ePrescription.

## 🔧 Importaciones

```typescript
import { 
  getAllRoles,
  getRoleById,
  updateRole,
  validateRolePermissions,
  createRole,
  getRolesAuditLog,
  canModifyRole,
  type RoleDefinition,
  type RoleAuditLog,
  AVAILABLE_PERMISSIONS
} from '../utils/rolesStore';
```

## 📖 Ejemplos Básicos

### 1. Obtener todos los roles

```typescript
// Obtener lista completa de roles
const roles = getAllRoles();

console.log(`Total de roles: ${roles.length}`);

roles.forEach(role => {
  console.log(`- ${role.name} (${role.code}): ${role.usersCount} usuarios`);
});

// Salida:
// Total de roles: 5
// - Administrador (ADMIN): 2 usuarios
// - Médico (DOCTOR): 45 usuarios
// - Farmacéutico (PHARMACIST): 12 usuarios
// - Médico Jefe (CHIEF_DOCTOR): 5 usuarios
// - Administrativo (ADMIN_STAFF): 18 usuarios
```

### 2. Obtener un rol específico

```typescript
// Por ID
const doctorRole = getRoleById('ROLE-002');

if (doctorRole) {
  console.log(`Rol: ${doctorRole.name}`);
  console.log(`Descripción: ${doctorRole.description}`);
  console.log(`Nivel de seguridad: ${doctorRole.securityLevel}`);
  console.log(`Puede delegar: ${doctorRole.canDelegate ? 'Sí' : 'No'}`);
  console.log(`Duración máxima de sesión: ${doctorRole.maxSessionDuration || 'Sin límite'} minutos`);
}
```

### 3. Verificar permisos de un rol

```typescript
const role = getRoleById('ROLE-002'); // Médico

// Verificar si tiene permiso específico
const canPrescribe = role?.permissions.prescriptions?.includes('create');
const canDispense = role?.permissions.prescriptions?.includes('dispense');

console.log(`¿Puede prescribir?: ${canPrescribe}`);  // true
console.log(`¿Puede dispensar?: ${canDispense}`);    // false (SoD)

// Verificar acceso a PHI (datos protegidos)
const canAccessPHI = role?.permissions.patients?.includes('read');
console.log(`¿Acceso a datos de pacientes?: ${canAccessPHI}`);  // true
```

## 🔄 Actualización de Roles

### 4. Actualizar permisos de un rol

```typescript
// Datos del usuario que realiza el cambio
const currentUser = {
  id: 'USR-0001',
  name: 'Admin del Sistema'
};

// Actualizar permisos del rol Médico
const result = updateRole(
  'ROLE-002',  // ID del rol
  {
    permissions: {
      prescriptions: ['create', 'read', 'update', 'sign'],
      patients: ['create', 'read', 'update'],
      users: ['read_self'],
      inventory: ['read'],
      reports: ['read', 'export_own'],
      security: ['read_self'],
      system: [],
      audit: [],
      interoperability: ['read'],
      clinical_alerts: ['read', 'create']
    }
  },
  currentUser.id,
  currentUser.name,
  'Actualización de permisos según política 2025'
);

if (result.success) {
  console.log('✅ Rol actualizado correctamente');
  
  if (result.warnings && result.warnings.length > 0) {
    console.warn('⚠️ Advertencias:');
    result.warnings.forEach(w => console.warn(`  - ${w}`));
  }
} else {
  console.error('❌ Error:', result.error);
}
```

### 5. Manejo de errores de validación

```typescript
// Intento de crear conflicto SoD (Separación de Funciones)
const badResult = updateRole(
  'ROLE-002',
  {
    permissions: {
      prescriptions: ['create', 'sign', 'dispense'],  // ❌ Conflicto!
      // ... otros permisos
    }
  },
  'USR-0001',
  'Admin Sistema'
);

if (!badResult.success) {
  console.error('Error de validación:');
  console.error(badResult.error);
  // Salida: "VIOLACIÓN SoD: Un rol no puede tener permisos de prescribir Y dispensar..."
}
```

## 🆕 Creación de Roles

### 6. Crear un nuevo rol personalizado

```typescript
const newRoleData = {
  name: 'Supervisor de Farmacia',
  code: 'PHARM_SUPERVISOR',
  description: 'Supervisión de farmacia con permisos de auditoría y reportes',
  usersCount: 0,
  status: 'active' as const,
  permissions: {
    prescriptions: ['read', 'verify'],
    patients: ['read'],
    users: ['read_self'],
    inventory: ['read', 'update', 'adjust', 'transfer'],
    reports: ['read', 'create', 'export', 'configure'],
    security: ['read_self', 'audit'],
    system: [],
    audit: ['read'],
    interoperability: [],
    clinical_alerts: ['read']
  },
  securityLevel: 'high' as const,
  requiresApproval: false,
  canDelegate: true,
  maxSessionDuration: 600
};

const createResult = createRole(
  newRoleData,
  'USR-0001',
  'Admin Sistema'
);

if (createResult.success) {
  console.log(`✅ Rol creado con ID: ${createResult.roleId}`);
  
  if (createResult.warnings) {
    console.warn('⚠️ Advertencias de seguridad:');
    createResult.warnings.forEach(w => console.warn(`  - ${w}`));
  }
} else {
  console.error('❌ Error al crear rol:', createResult.error);
}
```

## ✅ Validación de Permisos

### 7. Validar permisos antes de guardar

```typescript
const roleToValidate: RoleDefinition = {
  id: 'ROLE-TEST',
  name: 'Test Role',
  code: 'TEST',
  description: 'Rol de prueba',
  usersCount: 0,
  status: 'active',
  permissions: {
    prescriptions: ['update', 'delete'],  // ❌ Falta 'read'
    patients: ['export'],  // ❌ Falta 'read'
    users: [],
    inventory: [],
    reports: [],
    security: [],
    system: [],
    audit: [],
    interoperability: [],
    clinical_alerts: []
  },
  createdDate: '2025-10-09',
  lastModified: '2025-10-09',
  securityLevel: 'medium',
  requiresApproval: false,
  canDelegate: false
};

const validation = validateRolePermissions(roleToValidate);

console.log(`¿Válido?: ${validation.valid}`);

if (!validation.valid) {
  console.error('Errores encontrados:');
  validation.errors.forEach(err => console.error(`  ❌ ${err}`));
}

if (validation.warnings.length > 0) {
  console.warn('Advertencias:');
  validation.warnings.forEach(warn => console.warn(`  ⚠️ ${warn}`));
}

// Salida:
// ¿Válido?: false
// Errores encontrados:
//   ❌ Permiso "Editar recetas" requiere "read" en módulo "prescriptions"
//   ❌ Permiso "Eliminar recetas" requiere "read" en módulo "prescriptions"
//   ❌ Permiso "Exportar PHI" requiere "read" en módulo "patients"
```

### 8. Validar permisos individuales

```typescript
// Obtener definición de un permiso específico
const dispensePermission = AVAILABLE_PERMISSIONS.prescriptions.find(
  p => p.code === 'dispense'
);

if (dispensePermission) {
  console.log(`Permiso: ${dispensePermission.name}`);
  console.log(`Descripción: ${dispensePermission.description}`);
  console.log(`Categoría: ${dispensePermission.category}`);
  console.log(`Impacto de seguridad: ${dispensePermission.securityImpact}`);
  console.log(`Relevante para HIPAA: ${dispensePermission.hipaaRelevant}`);
  console.log(`Requiere auditoría: ${dispensePermission.auditRequired}`);
  
  if (dispensePermission.conflictsWith) {
    console.log('⚠️ Conflictos con:', dispensePermission.conflictsWith);
  }
}

// Salida:
// Permiso: Dispensar medicamentos
// Descripción: Permite registrar dispensación de medicamentos
// Categoría: write
// Impacto de seguridad: critical
// Relevante para HIPAA: true
// Requiere auditoría: true
// ⚠️ Conflictos con: ['create', 'sign']
```

## 📊 Auditoría

### 9. Obtener logs de auditoría

```typescript
// Obtener todos los logs de auditoría
const allLogs = getRolesAuditLog();

console.log(`Total de eventos de auditoría: ${allLogs.length}`);

allLogs.slice(0, 5).forEach(log => {
  console.log(`
    ID: ${log.id}
    Acción: ${log.action}
    Rol: ${log.roleName} (${log.roleId})
    Realizado por: ${log.performedByName}
    Fecha: ${new Date(log.timestamp).toLocaleString()}
    Cambios: ${log.changes.length}
    Aprobado: ${log.approved ? 'Sí' : 'Pendiente'}
  `);
});

// Obtener logs de un rol específico
const doctorLogs = getRolesAuditLog('ROLE-002');

console.log(`\nHistorial del rol Médico: ${doctorLogs.length} eventos`);
```

### 10. Analizar cambios específicos

```typescript
const logs = getRolesAuditLog('ROLE-002');

// Último cambio
const lastChange = logs[logs.length - 1];

if (lastChange) {
  console.log('Último cambio en rol Médico:');
  console.log(`  Acción: ${lastChange.action}`);
  console.log(`  Por: ${lastChange.performedByName}`);
  console.log(`  Fecha: ${new Date(lastChange.timestamp).toLocaleDateString()}`);
  
  if (lastChange.reason) {
    console.log(`  Razón: ${lastChange.reason}`);
  }
  
  console.log('  Cambios detallados:');
  lastChange.changes.forEach(change => {
    console.log(`    - Campo: ${change.field}`);
    console.log(`      Antes: ${JSON.stringify(change.oldValue)}`);
    console.log(`      Después: ${JSON.stringify(change.newValue)}`);
  });
}
```

## 🔒 Verificación de Permisos

### 11. Verificar si un usuario puede modificar un rol

```typescript
// Verificar si un administrador puede modificar el rol de Médico
const canModify = canModifyRole('Administrador', getRoleById('ROLE-002')!);

console.log(`¿Puede modificar?: ${canModify}`);  // true

// Intentar modificar rol de Administrador siendo el único admin
const adminRole = getRoleById('ROLE-001')!;
const canModifyAdmin = canModifyRole('Administrador', adminRole);

console.log(`¿Puede modificar Admin?: ${canModifyAdmin}`);
// false si es el único administrador (protección contra lockout)
```

## 🔍 Casos de Uso Avanzados

### 12. Clonar un rol con modificaciones

```typescript
const originalRole = getRoleById('ROLE-002')!;  // Médico

const clonedRoleData = {
  name: 'Médico Residente',
  code: 'RESIDENT',
  description: 'Médico en formación con permisos limitados',
  usersCount: 0,
  status: 'active' as const,
  permissions: {
    ...originalRole.permissions,
    prescriptions: ['create', 'read'],  // Sin firmar
    patients: ['read'],  // Solo lectura
  },
  securityLevel: 'medium' as const,
  requiresApproval: true,
  canDelegate: false,
  maxSessionDuration: 360  // 6 horas
};

const cloneResult = createRole(
  clonedRoleData,
  'USR-0001',
  'Admin Sistema'
);

if (cloneResult.success) {
  console.log(`✅ Rol clonado: ${cloneResult.roleId}`);
}
```

### 13. Comparar permisos entre roles

```typescript
function compareRoles(roleId1: string, roleId2: string) {
  const role1 = getRoleById(roleId1);
  const role2 = getRoleById(roleId2);
  
  if (!role1 || !role2) {
    console.error('Uno o ambos roles no encontrados');
    return;
  }
  
  console.log(`\nComparación: ${role1.name} vs ${role2.name}\n`);
  
  Object.keys(role1.permissions).forEach(module => {
    const perms1 = role1.permissions[module as keyof typeof role1.permissions] || [];
    const perms2 = role2.permissions[module as keyof typeof role2.permissions] || [];
    
    const onlyIn1 = perms1.filter(p => !perms2.includes(p));
    const onlyIn2 = perms2.filter(p => !perms1.includes(p));
    const shared = perms1.filter(p => perms2.includes(p));
    
    if (onlyIn1.length > 0 || onlyIn2.length > 0) {
      console.log(`Módulo: ${module}`);
      
      if (shared.length > 0) {
        console.log(`  Compartidos: ${shared.join(', ')}`);
      }
      
      if (onlyIn1.length > 0) {
        console.log(`  Solo en ${role1.name}: ${onlyIn1.join(', ')}`);
      }
      
      if (onlyIn2.length > 0) {
        console.log(`  Solo en ${role2.name}: ${onlyIn2.join(', ')}`);
      }
      
      console.log('');
    }
  });
}

// Uso
compareRoles('ROLE-002', 'ROLE-003');  // Médico vs Farmacéutico
```

### 14. Generar reporte de permisos

```typescript
function generatePermissionsReport() {
  const roles = getAllRoles();
  
  console.log('=== REPORTE DE PERMISOS POR ROL ===\n');
  
  roles.forEach(role => {
    const totalPerms = Object.values(role.permissions)
      .reduce((sum, perms) => sum + perms.length, 0);
    
    console.log(`${role.name} (${role.code})`);
    console.log(`  Usuarios: ${role.usersCount}`);
    console.log(`  Total permisos: ${totalPerms}`);
    console.log(`  Nivel seguridad: ${role.securityLevel}`);
    console.log(`  Requiere aprobación: ${role.requiresApproval ? 'Sí' : 'No'}`);
    console.log(`  Puede delegar: ${role.canDelegate ? 'Sí' : 'No'}`);
    
    // Contar por categoría
    let criticalCount = 0;
    Object.entries(role.permissions).forEach(([module, perms]) => {
      const modulePerms = AVAILABLE_PERMISSIONS[module] || [];
      perms.forEach(permCode => {
        const permDef = modulePerms.find(p => p.code === permCode);
        if (permDef?.securityImpact === 'critical') {
          criticalCount++;
        }
      });
    });
    
    console.log(`  Permisos críticos: ${criticalCount}`);
    console.log('');
  });
}

generatePermissionsReport();
```

### 15. Validar cumplimiento HIPAA

```typescript
function validateHIPAACompliance(roleId: string) {
  const role = getRoleById(roleId);
  
  if (!role) {
    console.error('Rol no encontrado');
    return;
  }
  
  console.log(`\n=== ANÁLISIS HIPAA: ${role.name} ===\n`);
  
  let hipaaRelevantPerms = 0;
  let requiresAudit = 0;
  const phiAccess = [];
  
  Object.entries(role.permissions).forEach(([module, perms]) => {
    const modulePerms = AVAILABLE_PERMISSIONS[module] || [];
    
    perms.forEach(permCode => {
      const permDef = modulePerms.find(p => p.code === permCode);
      
      if (permDef) {
        if (permDef.hipaaRelevant) {
          hipaaRelevantPerms++;
          phiAccess.push(`${module}.${permCode}`);
        }
        
        if (permDef.auditRequired) {
          requiresAudit++;
        }
      }
    });
  });
  
  console.log(`Permisos relevantes para HIPAA: ${hipaaRelevantPerms}`);
  console.log(`Permisos que requieren auditoría: ${requiresAudit}`);
  console.log(`\nAcceso a PHI detectado en:`);
  phiAccess.forEach(access => console.log(`  - ${access}`));
  
  // Recomendaciones
  console.log('\n📋 Recomendaciones:');
  
  if (hipaaRelevantPerms > 0) {
    console.log('  ✅ 2FA obligatorio para este rol');
    console.log('  ✅ Capacitación HIPAA requerida');
    console.log('  ✅ Auditoría de accesos mensual');
  }
  
  if (role.permissions.patients?.includes('export')) {
    console.log('  ⚠️ CRÍTICO: Puede exportar PHI - Requiere aprobación especial');
  }
  
  if (!role.canDelegate) {
    console.log('  ✅ No puede delegar - Cumple con responsabilidad individual');
  }
}

validateHIPAACompliance('ROLE-002');  // Analizar rol Médico
```

## 🎯 Mejores Prácticas

### 16. Patrón de uso en componentes React

```typescript
import { useEffect, useState } from 'react';
import { getAllRoles, updateRole, type RoleDefinition } from '../utils/rolesStore';

function RolesManagement() {
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadRoles();
  }, []);
  
  const loadRoles = () => {
    setLoading(true);
    try {
      const rolesData = getAllRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Error al cargar roles:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateRole = async (roleId: string, newPermissions: any) => {
    const result = updateRole(
      roleId,
      { permissions: newPermissions },
      'current-user-id',
      'Current User Name',
      'Actualización desde UI'
    );
    
    if (result.success) {
      // Recargar roles
      loadRoles();
      
      // Mostrar notificación
      toast.success('Rol actualizado');
    } else {
      toast.error(result.error);
    }
  };
  
  if (loading) return <div>Cargando roles...</div>;
  
  return (
    <div>
      {roles.map(role => (
        <RoleCard 
          key={role.id} 
          role={role} 
          onUpdate={handleUpdateRole}
        />
      ))}
    </div>
  );
}
```

---

## 📞 Soporte

Si tienes preguntas sobre el uso del rolesStore:

1. Consulta la documentación completa en `/SISTEMA_ROLES_PROFESIONAL.md`
2. Revisa los tests en `/PRUEBAS_ROLES.md`
3. Consulta el código fuente en `/utils/rolesStore.ts`

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0  
**Mantenedor**: ePrescription Dev Team
