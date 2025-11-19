/**
 * rolesStore.ts
 * 
 * Sistema de gestión de roles y permisos para ePrescription
 * Cumple con estándares HIPAA, HL7 FHIR, FDA 21 CFR Part 11
 * 
 * Características:
 * - Control de acceso basado en roles (RBAC)
 * - Permisos granulares por módulo
 * - Auditoría completa de cambios
 * - Validaciones de seguridad
 * - Separación de funciones (SoD)
 */

export interface RolePermission {
  module: string;
  permissions: string[];
}

export interface RolePermissions {
  prescriptions: string[];
  patients: string[];
  users: string[];
  inventory: string[];
  reports: string[];
  security: string[];
  system: string[];
  audit: string[];
  interoperability: string[];
  clinical_alerts: string[];
}

// Rol Base - Inmutable, predefinido
export interface BaseRoleDefinition {
  id: string;
  name: string;
  code: string;
  type: 'base'; // Marca como rol base inmutable
  description: string;
  usersCount: number;
  directAssignments: number; // Usuarios con este rol exacto
  customRolesCount: number; // Número de roles personalizados derivados de este
  status: 'active' | 'inactive' | 'deprecated';
  permissions: RolePermissions;
  createdDate: string;
  lastModified: string;
  modifiedBy?: string;
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  requiresApproval: boolean;
  canDelegate: boolean;
  canBeCustomized: boolean; // Si se pueden crear versiones personalizadas
  maxSessionDuration?: number; // en minutos
}

// Rol Personalizado - Derivado de un rol base
export interface CustomRoleDefinition {
  id: string;
  name: string;
  code: string;
  type: 'custom'; // Marca como rol personalizado
  description: string;
  
  baseRoleId: string; // Rol base del que deriva
  baseRoleName: string;
  
  userId: string; // Usuario específico al que está asignado
  userName: string;
  userEmail: string;
  
  permissionAdjustments: {
    added: string[]; // Permisos agregados al rol base (formato: "module.permission")
    removed: string[]; // Permisos quitados del rol base (formato: "module.permission")
  };
  
  effectivePermissions: RolePermissions; // Calculado automáticamente
  
  justification: string; // Razón para la personalización (obligatorio)
  createdBy: string;
  createdByName: string;
  createdDate: string;
  
  approvalRequired: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedByName?: string;
  approvedDate?: string;
  rejectionReason?: string;
  
  validFrom: string;
  validUntil?: string; // null = permanente
  
  lastReviewed?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  
  status: 'active' | 'suspended' | 'expired' | 'revoked';
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  
  lastModified: string;
  modifiedBy?: string;
}

// Union type para ambos tipos de roles
export type RoleDefinition = BaseRoleDefinition | CustomRoleDefinition;

// Asignación de rol a usuario
export interface RoleAssignment {
  userId: string;
  userName: string;
  userEmail: string;
  roleType: 'base' | 'custom';
  roleId: string;
  roleName: string;
  assignedDate: string;
  assignedBy: string;
  assignedByName: string;
  expiresAt?: string;
}

export interface PermissionDefinition {
  code: string;
  name: string;
  description: string;
  category: 'read' | 'write' | 'delete' | 'special' | 'admin';
  requiresOtherPermissions?: string[]; // Permisos que debe tener primero
  conflictsWith?: string[]; // Permisos incompatibles (SoD)
  securityImpact: 'low' | 'medium' | 'high' | 'critical';
  hipaaRelevant: boolean;
  auditRequired: boolean;
}

export interface RoleAuditLog {
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

// Definición de permisos disponibles por módulo
export const AVAILABLE_PERMISSIONS: Record<string, PermissionDefinition[]> = {
  prescriptions: [
    {
      code: 'create',
      name: 'Crear recetas',
      description: 'Permite crear nuevas prescripciones médicas',
      category: 'write',
      securityImpact: 'high',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'read',
      name: 'Ver recetas',
      description: 'Permite visualizar prescripciones existentes',
      category: 'read',
      securityImpact: 'medium',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'update',
      name: 'Editar recetas',
      description: 'Permite modificar recetas no firmadas',
      category: 'write',
      requiresOtherPermissions: ['read'],
      securityImpact: 'high',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'delete',
      name: 'Eliminar recetas',
      description: 'Permite eliminar borradores de recetas',
      category: 'delete',
      requiresOtherPermissions: ['read', 'update'],
      securityImpact: 'high',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'sign',
      name: 'Firmar recetas',
      description: 'Permite firma digital de prescripciones',
      category: 'special',
      requiresOtherPermissions: ['create'],
      securityImpact: 'critical',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'approve',
      name: 'Aprobar recetas especiales',
      description: 'Permite aprobar prescripciones de medicamentos controlados',
      category: 'special',
      requiresOtherPermissions: ['read'],
      securityImpact: 'critical',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'review_all',
      name: 'Revisar todas las recetas',
      description: 'Permite acceder a todas las recetas del sistema',
      category: 'special',
      requiresOtherPermissions: ['read'],
      securityImpact: 'high',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'verify',
      name: 'Verificar recetas',
      description: 'Permite verificar autenticidad de prescripciones',
      category: 'read',
      securityImpact: 'medium',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'dispense',
      name: 'Dispensar medicamentos',
      description: 'Permite registrar dispensación de medicamentos',
      category: 'write',
      requiresOtherPermissions: ['verify'],
      conflictsWith: ['create', 'sign'], // SoD: quien dispensa no puede prescribir
      securityImpact: 'critical',
      hipaaRelevant: true,
      auditRequired: true
    }
  ],
  patients: [
    {
      code: 'create',
      name: 'Registrar pacientes',
      description: 'Permite crear nuevos registros de pacientes',
      category: 'write',
      securityImpact: 'high',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'read',
      name: 'Ver datos de pacientes',
      description: 'Permite visualizar información de pacientes (PHI)',
      category: 'read',
      securityImpact: 'critical',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'update',
      name: 'Actualizar pacientes',
      description: 'Permite modificar datos de pacientes',
      category: 'write',
      requiresOtherPermissions: ['read'],
      securityImpact: 'high',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'delete',
      name: 'Eliminar pacientes',
      description: 'Permite eliminar registros de pacientes (soft delete)',
      category: 'delete',
      requiresOtherPermissions: ['read'],
      securityImpact: 'critical',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'export',
      name: 'Exportar datos PHI',
      description: 'Permite exportar datos protegidos de pacientes',
      category: 'special',
      requiresOtherPermissions: ['read'],
      securityImpact: 'critical',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'merge',
      name: 'Fusionar registros',
      description: 'Permite fusionar registros duplicados de pacientes',
      category: 'special',
      requiresOtherPermissions: ['read', 'update'],
      securityImpact: 'high',
      hipaaRelevant: true,
      auditRequired: true
    }
  ],
  users: [
    {
      code: 'create',
      name: 'Crear usuarios',
      description: 'Permite crear nuevas cuentas de usuario',
      category: 'write',
      securityImpact: 'critical',
      hipaaRelevant: false,
      auditRequired: true
    },
    {
      code: 'read',
      name: 'Ver usuarios',
      description: 'Permite visualizar información de usuarios',
      category: 'read',
      securityImpact: 'medium',
      hipaaRelevant: false,
      auditRequired: true
    },
    {
      code: 'read_self',
      name: 'Ver perfil propio',
      description: 'Permite ver solo su propio perfil',
      category: 'read',
      securityImpact: 'low',
      hipaaRelevant: false,
      auditRequired: false
    },
    {
      code: 'update',
      name: 'Modificar usuarios',
      description: 'Permite editar información de usuarios',
      category: 'write',
      requiresOtherPermissions: ['read'],
      securityImpact: 'high',
      hipaaRelevant: false,
      auditRequired: true
    },
    {
      code: 'delete',
      name: 'Eliminar usuarios',
      description: 'Permite desactivar cuentas de usuario',
      category: 'delete',
      requiresOtherPermissions: ['read'],
      securityImpact: 'critical',
      hipaaRelevant: false,
      auditRequired: true
    },
    {
      code: 'manage_roles',
      name: 'Gestionar roles',
      description: 'Permite asignar y modificar roles de usuarios',
      category: 'admin',
      requiresOtherPermissions: ['read', 'update'],
      securityImpact: 'critical',
      hipaaRelevant: false,
      auditRequired: true
    },
    {
      code: 'reset_password',
      name: 'Restablecer contraseñas',
      description: 'Permite resetear contraseñas de usuarios',
      category: 'admin',
      requiresOtherPermissions: ['read'],
      securityImpact: 'high',
      hipaaRelevant: false,
      auditRequired: true
    },
    {
      code: 'manage_2fa',
      name: 'Gestionar 2FA',
      description: 'Permite habilitar/deshabilitar 2FA de usuarios',
      category: 'admin',
      requiresOtherPermissions: ['read'],
      securityImpact: 'high',
      hipaaRelevant: false,
      auditRequired: true
    }
  ],
  inventory: [
    {
      code: 'create',
      name: 'Registrar medicamentos',
      description: 'Permite agregar medicamentos al inventario',
      category: 'write',
      securityImpact: 'medium',
      hipaaRelevant: false,
      auditRequired: true
    },
    {
      code: 'read',
      name: 'Consultar inventario',
      description: 'Permite visualizar el stock de medicamentos',
      category: 'read',
      securityImpact: 'low',
      hipaaRelevant: false,
      auditRequired: false
    },
    {
      code: 'update',
      name: 'Actualizar stock',
      description: 'Permite modificar cantidades de inventario',
      category: 'write',
      requiresOtherPermissions: ['read'],
      securityImpact: 'high',
      hipaaRelevant: false,
      auditRequired: true
    },
    {
      code: 'delete',
      name: 'Eliminar medicamentos',
      description: 'Permite eliminar medicamentos del catálogo',
      category: 'delete',
      requiresOtherPermissions: ['read'],
      securityImpact: 'high',
      hipaaRelevant: false,
      auditRequired: true
    },
    {
      code: 'adjust',
      name: 'Ajustes de inventario',
      description: 'Permite realizar ajustes manuales de stock',
      category: 'special',
      requiresOtherPermissions: ['read', 'update'],
      securityImpact: 'high',
      hipaaRelevant: false,
      auditRequired: true
    },
    {
      code: 'transfer',
      name: 'Transferir entre farmacias',
      description: 'Permite transferir medicamentos entre ubicaciones',
      category: 'special',
      requiresOtherPermissions: ['read', 'update'],
      securityImpact: 'medium',
      hipaaRelevant: false,
      auditRequired: true
    }
  ],
  reports: [
    {
      code: 'read',
      name: 'Ver reportes',
      description: 'Permite visualizar reportes del sistema',
      category: 'read',
      securityImpact: 'medium',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'create',
      name: 'Crear reportes',
      description: 'Permite generar nuevos reportes',
      category: 'write',
      requiresOtherPermissions: ['read'],
      securityImpact: 'medium',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'export',
      name: 'Exportar reportes',
      description: 'Permite exportar reportes (PDF, CSV, Excel)',
      category: 'special',
      requiresOtherPermissions: ['read'],
      securityImpact: 'high',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'export_own',
      name: 'Exportar reportes propios',
      description: 'Permite exportar solo reportes personales',
      category: 'read',
      securityImpact: 'low',
      hipaaRelevant: false,
      auditRequired: false
    },
    {
      code: 'configure',
      name: 'Configurar reportes',
      description: 'Permite crear plantillas de reportes',
      category: 'admin',
      requiresOtherPermissions: ['read', 'create'],
      securityImpact: 'medium',
      hipaaRelevant: false,
      auditRequired: true
    }
  ],
  security: [
    {
      code: 'read',
      name: 'Ver configuración de seguridad',
      description: 'Permite visualizar parámetros de seguridad',
      category: 'read',
      securityImpact: 'high',
      hipaaRelevant: false,
      auditRequired: true
    },
    {
      code: 'read_self',
      name: 'Ver seguridad propia',
      description: 'Permite ver solo su configuración de seguridad',
      category: 'read',
      securityImpact: 'low',
      hipaaRelevant: false,
      auditRequired: false
    },
    {
      code: 'update',
      name: 'Modificar parámetros',
      description: 'Permite cambiar políticas de seguridad',
      category: 'admin',
      requiresOtherPermissions: ['read'],
      securityImpact: 'critical',
      hipaaRelevant: false,
      auditRequired: true
    },
    {
      code: 'audit',
      name: 'Auditoría de seguridad',
      description: 'Permite revisar logs de auditoría',
      category: 'read',
      securityImpact: 'high',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'manage',
      name: 'Gestión completa',
      description: 'Control total sobre seguridad del sistema',
      category: 'admin',
      requiresOtherPermissions: ['read', 'update', 'audit'],
      securityImpact: 'critical',
      hipaaRelevant: false,
      auditRequired: true
    }
  ],
  system: [
    {
      code: 'configure',
      name: 'Configurar sistema',
      description: 'Permite modificar configuraciones generales',
      category: 'admin',
      securityImpact: 'critical',
      hipaaRelevant: false,
      auditRequired: true
    },
    {
      code: 'backup',
      name: 'Realizar respaldos',
      description: 'Permite crear copias de seguridad',
      category: 'admin',
      securityImpact: 'critical',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'restore',
      name: 'Restaurar sistema',
      description: 'Permite restaurar desde respaldos',
      category: 'admin',
      requiresOtherPermissions: ['backup'],
      securityImpact: 'critical',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'maintenance',
      name: 'Modo mantenimiento',
      description: 'Permite activar modo mantenimiento',
      category: 'admin',
      securityImpact: 'high',
      hipaaRelevant: false,
      auditRequired: true
    }
  ],
  audit: [
    {
      code: 'read',
      name: 'Ver auditoría',
      description: 'Permite visualizar logs de auditoría',
      category: 'read',
      securityImpact: 'high',
      hipaaRelevant: true,
      auditRequired: false
    },
    {
      code: 'export',
      name: 'Exportar auditoría',
      description: 'Permite exportar registros de auditoría',
      category: 'special',
      requiresOtherPermissions: ['read'],
      securityImpact: 'critical',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'configure',
      name: 'Configurar auditoría',
      description: 'Permite configurar políticas de auditoría',
      category: 'admin',
      securityImpact: 'critical',
      hipaaRelevant: true,
      auditRequired: true
    }
  ],
  interoperability: [
    {
      code: 'read',
      name: 'Ver datos FHIR',
      description: 'Permite visualizar recursos HL7 FHIR',
      category: 'read',
      securityImpact: 'medium',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'export',
      name: 'Exportar FHIR',
      description: 'Permite exportar recursos en formato FHIR',
      category: 'special',
      requiresOtherPermissions: ['read'],
      securityImpact: 'high',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'import',
      name: 'Importar datos externos',
      description: 'Permite importar datos desde sistemas externos',
      category: 'write',
      securityImpact: 'critical',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'configure',
      name: 'Configurar integraciones',
      description: 'Permite configurar conexiones HL7/FHIR',
      category: 'admin',
      securityImpact: 'critical',
      hipaaRelevant: false,
      auditRequired: true
    }
  ],
  clinical_alerts: [
    {
      code: 'read',
      name: 'Ver alertas clínicas',
      description: 'Permite visualizar alertas e interacciones',
      category: 'read',
      securityImpact: 'medium',
      hipaaRelevant: true,
      auditRequired: false
    },
    {
      code: 'create',
      name: 'Crear alertas',
      description: 'Permite registrar nuevas alertas',
      category: 'write',
      securityImpact: 'high',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'configure',
      name: 'Configurar reglas',
      description: 'Permite configurar reglas de alertas',
      category: 'admin',
      securityImpact: 'high',
      hipaaRelevant: true,
      auditRequired: true
    },
    {
      code: 'override',
      name: 'Anular alertas',
      description: 'Permite anular alertas críticas (con justificación)',
      category: 'special',
      requiresOtherPermissions: ['read'],
      securityImpact: 'critical',
      hipaaRelevant: true,
      auditRequired: true
    }
  ]
};

// Roles BASE predefinidos del sistema (inmutables)
let baseRolesDatabase: BaseRoleDefinition[] = [
  {
    id: 'ROLE-001',
    name: 'Administrador',
    code: 'ADMIN',
    type: 'base',
    description: 'Acceso total al sistema. Gestión de usuarios, configuración y auditoría',
    usersCount: 2,
    directAssignments: 2,
    customRolesCount: 0,
    status: 'active',
    permissions: {
      prescriptions: ['create', 'read', 'update', 'delete', 'approve', 'review_all'],
      patients: ['create', 'read', 'update', 'delete', 'export', 'merge'],
      users: ['create', 'read', 'update', 'delete', 'manage_roles', 'reset_password', 'manage_2fa'],
      inventory: ['create', 'read', 'update', 'delete', 'adjust', 'transfer'],
      reports: ['create', 'read', 'export', 'configure'],
      security: ['read', 'update', 'audit', 'manage'],
      system: ['configure', 'backup', 'restore', 'maintenance'],
      audit: ['read', 'export', 'configure'],
      interoperability: ['read', 'export', 'import', 'configure'],
      clinical_alerts: ['read', 'create', 'configure', 'override']
    },
    createdDate: '2022-06-01',
    lastModified: '2024-09-15',
    securityLevel: 'critical',
    requiresApproval: true,
    canDelegate: false,
    canBeCustomized: true
  },
  {
    id: 'ROLE-002',
    name: 'Médico',
    code: 'DOCTOR',
    type: 'base',
    description: 'Profesional médico. Prescripción de recetas, acceso a historias clínicas',
    usersCount: 45,
    directAssignments: 42,
    customRolesCount: 3,
    status: 'active',
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
    },
    createdDate: '2022-06-01',
    lastModified: '2024-08-20',
    securityLevel: 'high',
    requiresApproval: false,
    canDelegate: true,
    canBeCustomized: true,
    maxSessionDuration: 480 // 8 horas
  },
  {
    id: 'ROLE-003',
    name: 'Farmacéutico',
    code: 'PHARMACIST',
    type: 'base',
    description: 'Profesional farmacéutico. Dispensación, verificación de recetas, gestión de inventario',
    usersCount: 12,
    directAssignments: 11,
    customRolesCount: 1,
    status: 'active',
    permissions: {
      prescriptions: ['read', 'verify', 'dispense'],
      patients: ['read'],
      users: ['read_self'],
      inventory: ['create', 'read', 'update', 'adjust', 'transfer'],
      reports: ['read', 'export_own'],
      security: ['read_self'],
      system: [],
      audit: [],
      interoperability: ['read'],
      clinical_alerts: ['read', 'create']
    },
    createdDate: '2022-06-01',
    lastModified: '2024-07-30',
    securityLevel: 'high',
    requiresApproval: false,
    canDelegate: false,
    canBeCustomized: true,
    maxSessionDuration: 600 // 10 horas
  },
  {
    id: 'ROLE-004',
    name: 'Médico Jefe',
    code: 'CHIEF_DOCTOR',
    type: 'base',
    description: 'Médico con funciones de supervisión. Aprobación de prescripciones especiales',
    usersCount: 5,
    directAssignments: 4,
    customRolesCount: 1,
    status: 'active',
    permissions: {
      prescriptions: ['create', 'read', 'update', 'sign', 'approve', 'review_all'],
      patients: ['create', 'read', 'update', 'export'],
      users: ['read'],
      inventory: ['read'],
      reports: ['read', 'export', 'configure'],
      security: ['read_self'],
      system: [],
      audit: ['read'],
      interoperability: ['read', 'export'],
      clinical_alerts: ['read', 'create', 'configure']
    },
    createdDate: '2022-06-01',
    lastModified: '2024-09-01',
    securityLevel: 'high',
    requiresApproval: false,
    canDelegate: true,
    canBeCustomized: true,
    maxSessionDuration: 720 // 12 horas
  },
  {
    id: 'ROLE-005',
    name: 'Administrativo',
    code: 'ADMIN_STAFF',
    type: 'base',
    description: 'Personal administrativo. Gestión de pacientes y reportes',
    usersCount: 18,
    directAssignments: 18,
    customRolesCount: 0,
    status: 'active',
    permissions: {
      prescriptions: ['read'],
      patients: ['create', 'read', 'update'],
      users: ['read_self'],
      inventory: [],
      reports: ['read', 'export'],
      security: ['read_self'],
      system: [],
      audit: [],
      interoperability: [],
      clinical_alerts: ['read']
    },
    createdDate: '2022-06-01',
    lastModified: '2024-06-15',
    securityLevel: 'medium',
    requiresApproval: false,
    canDelegate: false,
    canBeCustomized: true,
    maxSessionDuration: 480 // 8 horas
  }
];

// Roles PERSONALIZADOS (derivados de roles base)
let customRolesDatabase: CustomRoleDefinition[] = [
  // Ejemplo: Admin de Respaldo sin permisos de eliminación
  {
    id: 'CUSTOM-001',
    name: 'Admin Respaldo TI',
    code: 'ADMIN_BACKUP_IT',
    type: 'custom',
    description: 'Administrador de respaldo para soporte técnico nivel 2, sin acceso a funciones críticas de eliminación',
    
    baseRoleId: 'ROLE-001',
    baseRoleName: 'Administrador',
    
    userId: 'USR-0042',
    userName: 'Carlos Rojas Méndez',
    userEmail: 'carlos.rojas@hospital.com',
    
    permissionAdjustments: {
      removed: ['users.delete', 'system.restore'],
      added: []
    },
    
    effectivePermissions: {
      prescriptions: ['create', 'read', 'update', 'delete', 'approve', 'review_all'],
      patients: ['create', 'read', 'update', 'delete', 'export', 'merge'],
      users: ['create', 'read', 'update', 'manage_roles', 'reset_password', 'manage_2fa'], // Sin delete
      inventory: ['create', 'read', 'update', 'delete', 'adjust', 'transfer'],
      reports: ['create', 'read', 'export', 'configure'],
      security: ['read', 'update', 'audit', 'manage'],
      system: ['configure', 'backup', 'maintenance'], // Sin restore
      audit: ['read', 'export', 'configure'],
      interoperability: ['read', 'export', 'import', 'configure'],
      clinical_alerts: ['read', 'create', 'configure', 'override']
    },
    
    justification: 'Administrador de soporte técnico nivel 2. No requiere acceso a funciones críticas de eliminación de usuarios ni restauración del sistema para reducir superficie de riesgo.',
    createdBy: 'USR-0001',
    createdByName: 'Director de TI',
    createdDate: '2024-08-15',
    
    approvalRequired: false,
    approvalStatus: 'approved',
    approvedBy: 'USR-0001',
    approvedByName: 'Director de TI',
    approvedDate: '2024-08-15',
    
    validFrom: '2024-08-15',
    validUntil: undefined, // Permanente
    
    lastReviewed: '2024-10-01',
    reviewedBy: 'USR-0001',
    reviewedByName: 'Director de TI',
    
    status: 'active',
    securityLevel: 'critical',
    lastModified: '2024-10-01'
  },
  
  // Ejemplo: Médico Jefe de Emergencias con capacidad de anular alertas
  {
    id: 'CUSTOM-002',
    name: 'Médico Jefe ER',
    code: 'CHIEF_DOCTOR_ER',
    type: 'custom',
    description: 'Médico jefe de sala de emergencias con capacidad de anular alertas críticas en situaciones de vida o muerte',
    
    baseRoleId: 'ROLE-004',
    baseRoleName: 'Médico Jefe',
    
    userId: 'USR-0089',
    userName: 'Dra. Ana Vargas Solís',
    userEmail: 'ana.vargas@hospital.com',
    
    permissionAdjustments: {
      added: ['clinical_alerts.override'],
      removed: []
    },
    
    effectivePermissions: {
      prescriptions: ['create', 'read', 'update', 'sign', 'approve', 'review_all'],
      patients: ['create', 'read', 'update', 'export'],
      users: ['read'],
      inventory: ['read'],
      reports: ['read', 'export', 'configure'],
      security: ['read_self'],
      system: [],
      audit: ['read'],
      interoperability: ['read', 'export'],
      clinical_alerts: ['read', 'create', 'configure', 'override'] // Agregado override
    },
    
    justification: 'Médico jefe de sala de emergencias requiere capacidad de anular alertas clínicas en situaciones críticas de vida o muerte donde el juicio clínico prevalece sobre alertas automatizadas del sistema. Cada uso requiere justificación obligatoria y es auditado.',
    createdBy: 'USR-0001',
    createdByName: 'Director Médico',
    createdDate: '2024-09-10',
    
    approvalRequired: true,
    approvalStatus: 'approved',
    approvedBy: 'USR-0003',
    approvedByName: 'Director Médico y Oficial de Seguridad',
    approvedDate: '2024-09-10',
    
    validFrom: '2024-09-10',
    validUntil: undefined, // Permanente
    
    lastReviewed: '2024-10-05',
    reviewedBy: 'USR-0003',
    reviewedByName: 'Director Médico',
    
    status: 'active',
    securityLevel: 'critical',
    lastModified: '2024-10-05'
  },
  
  // Ejemplo: Farmacéutico de Investigación (no dispensa)
  {
    id: 'CUSTOM-003',
    name: 'Farmacéutico Investigador',
    code: 'PHARMACIST_RESEARCH',
    type: 'custom',
    description: 'Farmacéutico dedicado a investigación clínica, sin dispensación directa de medicamentos',
    
    baseRoleId: 'ROLE-003',
    baseRoleName: 'Farmacéutico',
    
    userId: 'USR-0123',
    userName: 'Lic. Marco Solís Castro',
    userEmail: 'marco.solis@hospital.com',
    
    permissionAdjustments: {
      added: ['reports.export', 'interoperability.export'],
      removed: ['prescriptions.dispense', 'inventory.adjust']
    },
    
    effectivePermissions: {
      prescriptions: ['read', 'verify'], // Sin dispense
      patients: ['read'],
      users: ['read_self'],
      inventory: ['create', 'read', 'update', 'transfer'], // Sin adjust
      reports: ['read', 'export_own', 'export'], // Agregado export
      security: ['read_self'],
      system: [],
      audit: [],
      interoperability: ['read', 'export'], // Agregado export
      clinical_alerts: ['read', 'create']
    },
    
    justification: 'Farmacéutico asignado al departamento de investigación clínica. No realiza dispensación directa de medicamentos pero requiere capacidad de exportar datos para estudios de investigación aprobados por comité de ética. Toda exportación es auditada.',
    createdBy: 'USR-0004',
    createdByName: 'Jefe de Farmacia',
    createdDate: '2024-07-20',
    
    approvalRequired: true,
    approvalStatus: 'approved',
    approvedBy: 'USR-0001',
    approvedByName: 'Director de Investigación',
    approvedDate: '2024-07-20',
    
    validFrom: '2024-07-20',
    validUntil: '2025-12-31', // Temporal hasta fin del proyecto
    
    lastReviewed: '2024-09-15',
    reviewedBy: 'USR-0004',
    reviewedByName: 'Jefe de Farmacia',
    
    status: 'active',
    securityLevel: 'high',
    lastModified: '2024-09-15'
  }
];

// Auditoría de roles
let rolesAuditLog: RoleAuditLog[] = [];

/**
 * Obtener todos los roles BASE (inmutables)
 */
export function getAllBaseRoles(): BaseRoleDefinition[] {
  return [...baseRolesDatabase];
}

/**
 * Obtener todos los roles PERSONALIZADOS
 */
export function getAllCustomRoles(): CustomRoleDefinition[] {
  return [...customRolesDatabase];
}

/**
 * Obtener TODOS los roles (base + personalizados)
 */
export function getAllRoles(): RoleDefinition[] {
  return [...baseRolesDatabase, ...customRolesDatabase];
}

/**
 * Obtener un rol por ID (busca en ambas bases de datos)
 */
export function getRoleById(roleId: string): RoleDefinition | null {
  const baseRole = baseRolesDatabase.find(r => r.id === roleId);
  if (baseRole) return baseRole;
  
  const customRole = customRolesDatabase.find(r => r.id === roleId);
  if (customRole) return customRole;
  
  return null;
}

/**
 * Obtener un rol BASE por ID
 */
export function getBaseRoleById(roleId: string): BaseRoleDefinition | null {
  return baseRolesDatabase.find(r => r.id === roleId) || null;
}

/**
 * Obtener roles personalizados de un usuario específico
 */
export function getCustomRolesByUserId(userId: string): CustomRoleDefinition[] {
  return customRolesDatabase.filter(r => r.userId === userId);
}

/**
 * Obtener roles personalizados derivados de un rol base
 */
export function getCustomRolesByBaseRole(baseRoleId: string): CustomRoleDefinition[] {
  return customRolesDatabase.filter(r => r.baseRoleId === baseRoleId);
}

/**
 * Calcular permisos efectivos de un rol personalizado
 */
function calculateEffectivePermissions(
  basePermissions: RolePermissions,
  adjustments: { added: string[]; removed: string[] }
): RolePermissions {
  const effective: RolePermissions = {
    prescriptions: [...basePermissions.prescriptions],
    patients: [...basePermissions.patients],
    users: [...basePermissions.users],
    inventory: [...basePermissions.inventory],
    reports: [...basePermissions.reports],
    security: [...basePermissions.security],
    system: [...basePermissions.system],
    audit: [...basePermissions.audit],
    interoperability: [...basePermissions.interoperability],
    clinical_alerts: [...basePermissions.clinical_alerts]
  };

  // Aplicar permisos quitados
  adjustments.removed.forEach(perm => {
    const [module, permCode] = perm.split('.');
    if (effective[module as keyof RolePermissions]) {
      effective[module as keyof RolePermissions] = effective[module as keyof RolePermissions].filter(
        p => p !== permCode
      );
    }
  });

  // Aplicar permisos agregados
  adjustments.added.forEach(perm => {
    const [module, permCode] = perm.split('.');
    if (effective[module as keyof RolePermissions]) {
      if (!effective[module as keyof RolePermissions].includes(permCode)) {
        effective[module as keyof RolePermissions].push(permCode);
      }
    }
  });

  return effective;
}

/**
 * Validar permisos antes de guardar (funciona para ambos tipos de roles)
 */
export function validateRolePermissions(permissions: RolePermissions): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validar dependencias de permisos
  Object.entries(permissions).forEach(([module, perms]) => {
    const modulePerms = AVAILABLE_PERMISSIONS[module] || [];
    
    perms.forEach(permCode => {
      const permDef = modulePerms.find(p => p.code === permCode);
      if (!permDef) return;

      // Verificar permisos requeridos
      if (permDef.requiresOtherPermissions) {
        permDef.requiresOtherPermissions.forEach(requiredPerm => {
          if (!perms.includes(requiredPerm)) {
            errors.push(
              `Permiso "${permDef.name}" requiere "${requiredPerm}" en módulo "${module}"`
            );
          }
        });
      }

      // Verificar conflictos (Separación de funciones - SoD)
      if (permDef.conflictsWith) {
        permDef.conflictsWith.forEach(conflictPerm => {
          if (perms.includes(conflictPerm)) {
            const conflictDef = modulePerms.find(p => p.code === conflictPerm);
            errors.push(
              `Conflicto de separación de funciones: "${permDef.name}" no puede coexistir con "${conflictDef?.name}" (HIPAA/SoD compliance)`
            );
          }
        });
      }

      // Advertencias para permisos críticos
      if (permDef.securityImpact === 'critical') {
        warnings.push(
          `Permiso crítico: "${permDef.name}" - Requiere aprobación especial`
        );
      }
    });
  });

  // Validar combinaciones peligrosas
  const hasDispense = permissions.prescriptions?.includes('dispense');
  const hasSign = permissions.prescriptions?.includes('sign');
  if (hasDispense && hasSign) {
    errors.push(
      'VIOLACIÓN SoD: Un rol no puede tener permisos de prescribir Y dispensar (FDA 21 CFR Part 11)'
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Actualizar rol BASE (solo metadata, NO permisos que son inmutables)
 */
export function updateBaseRole(
  roleId: string,
  updates: Partial<Omit<BaseRoleDefinition, 'permissions' | 'type'>>,
  performedBy: string,
  performedByName: string,
  reason?: string
): { success: boolean; error?: string; warnings?: string[] } {
  const roleIndex = baseRolesDatabase.findIndex(r => r.id === roleId);
  
  if (roleIndex === -1) {
    return { success: false, error: 'Rol base no encontrado' };
  }

  const currentRole = baseRolesDatabase[roleIndex];
  
  // NO permitir cambios en permisos para roles base
  if (updates.permissions) {
    return { success: false, error: 'Los permisos de roles base son inmutables. Cree un rol personalizado en su lugar.' };
  }

  const updatedRole = { ...currentRole, ...updates };

  // Registrar cambios en auditoría
  const changes: RoleAuditLog['changes'] = [];
  
  Object.keys(updates).forEach(key => {
    if ((currentRole as any)[key] !== (updates as any)[key]) {
      changes.push({
        field: key,
        oldValue: (currentRole as any)[key],
        newValue: (updates as any)[key]
      });
    }
  });

  // Actualizar rol
  baseRolesDatabase[roleIndex] = {
    ...updatedRole,
    lastModified: new Date().toISOString().split('T')[0],
    modifiedBy: performedByName
  };

  // Crear log de auditoría
  const auditEntry: RoleAuditLog = {
    id: `AUDIT-${Date.now()}`,
    roleId,
    roleName: currentRole.name,
    action: 'update',
    changes,
    performedBy,
    performedByName,
    timestamp: new Date().toISOString(),
    reason,
    approved: true
  };

  rolesAuditLog.push(auditEntry);

  return {
    success: true
  };
}

/**
 * Actualizar rol PERSONALIZADO
 */
export function updateCustomRole(
  roleId: string,
  updates: Partial<Omit<CustomRoleDefinition, 'id' | 'type' | 'baseRoleId' | 'baseRoleName'>>,
  performedBy: string,
  performedByName: string,
  reason?: string
): { success: boolean; error?: string; warnings?: string[] } {
  const roleIndex = customRolesDatabase.findIndex(r => r.id === roleId);
  
  if (roleIndex === -1) {
    return { success: false, error: 'Rol personalizado no encontrado' };
  }

  const currentRole = customRolesDatabase[roleIndex];
  const updatedRole = { ...currentRole, ...updates };

  // Recalcular permisos efectivos si cambiaron los ajustes
  if (updates.permissionAdjustments) {
    const baseRole = getBaseRoleById(currentRole.baseRoleId);
    if (!baseRole) {
      return { success: false, error: 'Rol base no encontrado' };
    }
    updatedRole.effectivePermissions = calculateEffectivePermissions(
      baseRole.permissions,
      updates.permissionAdjustments
    );
  }

  // Validar permisos efectivos
  const validation = validateRolePermissions(updatedRole.effectivePermissions);
  
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.join('; '),
      warnings: validation.warnings
    };
  }

  // Registrar cambios en auditoría
  const changes: RoleAuditLog['changes'] = [];
  
  Object.keys(updates).forEach(key => {
    if ((currentRole as any)[key] !== (updates as any)[key]) {
      changes.push({
        field: key,
        oldValue: (currentRole as any)[key],
        newValue: (updates as any)[key]
      });
    }
  });

  // Actualizar rol
  customRolesDatabase[roleIndex] = {
    ...updatedRole,
    lastModified: new Date().toISOString().split('T')[0],
    modifiedBy: performedByName
  };

  // Crear log de auditoría
  const auditEntry: RoleAuditLog = {
    id: `AUDIT-${Date.now()}`,
    roleId,
    roleName: currentRole.name,
    action: 'update',
    changes,
    performedBy,
    performedByName,
    timestamp: new Date().toISOString(),
    reason,
    approved: !updatedRole.approvalRequired || validation.warnings.length === 0
  };

  rolesAuditLog.push(auditEntry);

  return {
    success: true,
    warnings: validation.warnings
  };
}

// Función legacy para compatibilidad con código existente
export function updateRole(
  roleId: string,
  updates: Partial<{permissions: RolePermissions}>,
  performedBy: string,
  performedByName: string,
  reason?: string
): { success: boolean; error?: string; warnings?: string[] } {
  // Intentar actualizar como rol base primero
  const baseRole = getBaseRoleById(roleId);
  if (baseRole) {
    return updateBaseRole(roleId, updates, performedBy, performedByName, reason);
  }
  
  // Si no es base, intentar como personalizado
  const customRole = customRolesDatabase.find(r => r.id === roleId);
  if (customRole) {
    return updateCustomRole(roleId, updates, performedBy, performedByName, reason);
  }
  
  return { success: false, error: 'Rol no encontrado' };
}

/**
 * Crear nuevo rol PERSONALIZADO derivado de un rol base
 */
export function createCustomRole(
  baseRoleId: string,
  customRoleData: {
    name: string;
    description: string;
    userId: string;
    userName: string;
    userEmail: string;
    permissionAdjustments: {
      added: string[];
      removed: string[];
    };
    justification: string;
    validUntil?: string;
  },
  performedBy: string,
  performedByName: string
): { success: boolean; roleId?: string; error?: string; warnings?: string[] } {
  // Validar que existe el rol base
  const baseRole = getBaseRoleById(baseRoleId);
  if (!baseRole) {
    return { success: false, error: 'Rol base no encontrado' };
  }

  if (!baseRole.canBeCustomized) {
    return { success: false, error: 'Este rol base no permite personalización' };
  }

  // Validar justificación
  if (!customRoleData.justification || customRoleData.justification.trim().length < 20) {
    return { success: false, error: 'Debe proporcionar una justificación detallada (mínimo 20 caracteres)' };
  }

  // Calcular permisos efectivos
  const effectivePermissions = calculateEffectivePermissions(
    baseRole.permissions,
    customRoleData.permissionAdjustments
  );

  // Validar permisos efectivos
  const validation = validateRolePermissions(effectivePermissions);
  
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.join('; '),
      warnings: validation.warnings
    };
  }

  // Determinar si requiere aprobación (si hay permisos críticos agregados)
  const requiresApproval = customRoleData.permissionAdjustments.added.some(perm => {
    const [module, permCode] = perm.split('.');
    const modulePerms = AVAILABLE_PERMISSIONS[module] || [];
    const permDef = modulePerms.find(p => p.code === permCode);
    return permDef?.securityImpact === 'critical';
  });

  // Determinar nivel de seguridad
  const hasCriticalPerms = Object.values(effectivePermissions).some(perms => {
    return perms.some(permCode => {
      const modulePerms = Object.values(AVAILABLE_PERMISSIONS).flat();
      const permDef = modulePerms.find(p => p.code === permCode);
      return permDef?.securityImpact === 'critical';
    });
  });

  const securityLevel = hasCriticalPerms ? 'critical' : baseRole.securityLevel;

  // Generar código único
  const customCode = `${baseRole.code}_CUSTOM_${customRolesDatabase.length + 1}`;

  const newCustomRole: CustomRoleDefinition = {
    id: `CUSTOM-${String(customRolesDatabase.length + 1).padStart(3, '0')}`,
    name: customRoleData.name,
    code: customCode,
    type: 'custom',
    description: customRoleData.description,
    
    baseRoleId: baseRole.id,
    baseRoleName: baseRole.name,
    
    userId: customRoleData.userId,
    userName: customRoleData.userName,
    userEmail: customRoleData.userEmail,
    
    permissionAdjustments: customRoleData.permissionAdjustments,
    effectivePermissions,
    
    justification: customRoleData.justification,
    createdBy: performedBy,
    createdByName: performedByName,
    createdDate: new Date().toISOString().split('T')[0],
    
    approvalRequired: requiresApproval,
    approvalStatus: requiresApproval ? 'pending' : 'approved',
    approvedBy: requiresApproval ? undefined : performedBy,
    approvedByName: requiresApproval ? undefined : performedByName,
    approvedDate: requiresApproval ? undefined : new Date().toISOString().split('T')[0],
    
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: customRoleData.validUntil,
    
    status: requiresApproval ? 'suspended' : 'active', // Suspendido hasta aprobación
    securityLevel,
    lastModified: new Date().toISOString().split('T')[0]
  };

  customRolesDatabase.push(newCustomRole);

  // Incrementar contador en rol base
  const baseRoleIndex = baseRolesDatabase.findIndex(r => r.id === baseRoleId);
  if (baseRoleIndex !== -1) {
    baseRolesDatabase[baseRoleIndex].customRolesCount++;
  }

  // Auditoría
  const auditEntry: RoleAuditLog = {
    id: `AUDIT-${Date.now()}`,
    roleId: newCustomRole.id,
    roleName: newCustomRole.name,
    action: 'create',
    changes: [{ field: 'custom_role', oldValue: null, newValue: newCustomRole }],
    performedBy,
    performedByName,
    timestamp: new Date().toISOString(),
    reason: customRoleData.justification,
    approved: !requiresApproval
  };

  rolesAuditLog.push(auditEntry);

  return {
    success: true,
    roleId: newCustomRole.id,
    warnings: validation.warnings
  };
}

/**
 * Aprobar rol personalizado pendiente
 */
export function approveCustomRole(
  roleId: string,
  approvedBy: string,
  approvedByName: string
): { success: boolean; error?: string } {
  const roleIndex = customRolesDatabase.findIndex(r => r.id === roleId);
  
  if (roleIndex === -1) {
    return { success: false, error: 'Rol personalizado no encontrado' };
  }

  const role = customRolesDatabase[roleIndex];
  
  if (role.approvalStatus !== 'pending') {
    return { success: false, error: 'El rol no está pendiente de aprobación' };
  }

  customRolesDatabase[roleIndex] = {
    ...role,
    approvalStatus: 'approved',
    approvedBy,
    approvedByName,
    approvedDate: new Date().toISOString().split('T')[0],
    status: 'active',
    lastModified: new Date().toISOString().split('T')[0]
  };

  // Auditoría
  const auditEntry: RoleAuditLog = {
    id: `AUDIT-${Date.now()}`,
    roleId,
    roleName: role.name,
    action: 'update',
    changes: [{ field: 'approvalStatus', oldValue: 'pending', newValue: 'approved' }],
    performedBy: approvedBy,
    performedByName: approvedByName,
    timestamp: new Date().toISOString(),
    reason: 'Aprobación de rol personalizado',
    approved: true
  };

  rolesAuditLog.push(auditEntry);

  return { success: true };
}

/**
 * Rechazar rol personalizado pendiente
 */
export function rejectCustomRole(
  roleId: string,
  rejectedBy: string,
  rejectedByName: string,
  reason: string
): { success: boolean; error?: string } {
  const roleIndex = customRolesDatabase.findIndex(r => r.id === roleId);
  
  if (roleIndex === -1) {
    return { success: false, error: 'Rol personalizado no encontrado' };
  }

  const role = customRolesDatabase[roleIndex];
  
  if (role.approvalStatus !== 'pending') {
    return { success: false, error: 'El rol no está pendiente de aprobación' };
  }

  customRolesDatabase[roleIndex] = {
    ...role,
    approvalStatus: 'rejected',
    rejectionReason: reason,
    status: 'revoked',
    lastModified: new Date().toISOString().split('T')[0]
  };

  // Auditoría
  const auditEntry: RoleAuditLog = {
    id: `AUDIT-${Date.now()}`,
    roleId,
    roleName: role.name,
    action: 'update',
    changes: [{ field: 'approvalStatus', oldValue: 'pending', newValue: 'rejected' }],
    performedBy: rejectedBy,
    performedByName: rejectedByName,
    timestamp: new Date().toISOString(),
    reason,
    approved: false
  };

  rolesAuditLog.push(auditEntry);

  return { success: true };
}

/**
 * Revocar rol personalizado
 */
export function revokeCustomRole(
  roleId: string,
  revokedBy: string,
  revokedByName: string,
  reason: string
): { success: boolean; error?: string } {
  const roleIndex = customRolesDatabase.findIndex(r => r.id === roleId);
  
  if (roleIndex === -1) {
    return { success: false, error: 'Rol personalizado no encontrado' };
  }

  const role = customRolesDatabase[roleIndex];

  customRolesDatabase[roleIndex] = {
    ...role,
    status: 'revoked',
    lastModified: new Date().toISOString().split('T')[0]
  };

  // Auditoría
  const auditEntry: RoleAuditLog = {
    id: `AUDIT-${Date.now()}`,
    roleId,
    roleName: role.name,
    action: 'update',
    changes: [{ field: 'status', oldValue: role.status, newValue: 'revoked' }],
    performedBy: revokedBy,
    performedByName: revokedByName,
    timestamp: new Date().toISOString(),
    reason,
    approved: true
  };

  rolesAuditLog.push(auditEntry);

  return { success: true };
}

// Función legacy para compatibilidad (deprecada)
export function createRole(
  roleData: any,
  performedBy: string,
  performedByName: string
): { success: boolean; roleId?: string; error?: string; warnings?: string[] } {
  return {
    success: false,
    error: 'Esta función está deprecada. Use createCustomRole() para crear roles personalizados.'
  };
}

/**
 * Obtener log de auditoría de roles
 */
export function getRolesAuditLog(roleId?: string): RoleAuditLog[] {
  if (roleId) {
    return rolesAuditLog.filter(log => log.roleId === roleId);
  }
  return [...rolesAuditLog];
}

/**
 * Verificar si un usuario puede modificar un rol
 */
export function canModifyRole(userRole: string, targetRole: RoleDefinition): boolean {
  // Solo administradores pueden modificar roles
  if (userRole !== 'Administrador') {
    return false;
  }

  // No se puede modificar el rol de Administrador si eres el único admin
  if (targetRole.code === 'ADMIN' && targetRole.usersCount === 1) {
    return false;
  }

  return true;
}
