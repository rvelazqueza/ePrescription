/**
 * Multi-Role Session Management
 * Sistema de roles múltiples con rol activo
 * 
 * Cumplimiento: HIPAA, FDA 21 CFR Part 11, FHIR, ISO 27001
 */

import { getUserById, subscribeToUserChanges, type UserProfile } from './usersStore';

export interface RolePermissions {
  prescriptions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    sign: boolean;
    approve: boolean;
    viewAll: boolean;
  };
  patients: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    export: boolean;
    viewSensitive: boolean;
  };
  users: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    manageRoles: boolean;
    approveRequests: boolean;
  };
  inventory: {
    create: boolean;
    read: boolean;
    update: boolean;
    adjust: boolean;
    approveOrders: boolean;
  };
  reports: {
    create: boolean;
    read: boolean;
    export: boolean;
    configure: boolean;
    viewAll: boolean;
  };
  security: {
    read: boolean;
    update: boolean;
    audit: boolean;
    manageSessions: boolean;
  };
  system: {
    configure: boolean;
    backup: boolean;
    restore: boolean;
    maintenance: boolean;
  };
}

export interface RoleChangeRecord {
  id: string;
  timestamp: string;
  previousRole: string;
  newRole: string;
  reason?: string;
  triggeredBy: 'user' | 'system' | 'context';
  route?: string;
  ipAddress?: string;
}

export interface MultiRoleSession {
  userId: string;
  username: string;
  fullName: string;
  primaryRole: string;      // Rol principal/por defecto
  assignedRoles: string[];  // Todos los roles asignados
  activeRole: string;       // Rol activo AHORA
  activeContext?: string;   // Contexto actual (ej: "Consulta", "Farmacia")
  effectivePermissions: RolePermissions;
  roleChangeHistory: RoleChangeRecord[];
  sessionId: string;
  createdAt: string;
  lastActivity: string;
}

// Definición de permisos por rol
const ROLE_PERMISSIONS: Record<string, RolePermissions> = {
  'Administrador': {
    prescriptions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      sign: false,
      approve: true,
      viewAll: true,
    },
    patients: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      viewSensitive: true,
    },
    users: {
      create: true,
      read: true,
      update: true,
      delete: true,
      manageRoles: true,
      approveRequests: true,
    },
    inventory: {
      create: true,
      read: true,
      update: true,
      adjust: true,
      approveOrders: true,
    },
    reports: {
      create: true,
      read: true,
      export: true,
      configure: true,
      viewAll: true,
    },
    security: {
      read: true,
      update: true,
      audit: true,
      manageSessions: true,
    },
    system: {
      configure: true,
      backup: true,
      restore: true,
      maintenance: true,
    },
  },
  
  'Médico': {
    prescriptions: {
      create: true,
      read: true,
      update: true,
      delete: false,
      sign: true,
      approve: false,
      viewAll: false,
    },
    patients: {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: false,
      viewSensitive: true,
    },
    users: {
      create: false,
      read: false,
      update: false,
      delete: false,
      manageRoles: false,
      approveRequests: false,
    },
    inventory: {
      create: false,
      read: true,
      update: false,
      adjust: false,
      approveOrders: false,
    },
    reports: {
      create: false,
      read: true,
      export: true,
      configure: false,
      viewAll: false,
    },
    security: {
      read: false,
      update: false,
      audit: false,
      manageSessions: false,
    },
    system: {
      configure: false,
      backup: false,
      restore: false,
      maintenance: false,
    },
  },
  
  'Médico Jefe': {
    prescriptions: {
      create: true,
      read: true,
      update: true,
      delete: false,
      sign: true,
      approve: true,
      viewAll: true,
    },
    patients: {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      viewSensitive: true,
    },
    users: {
      create: false,
      read: true,
      update: false,
      delete: false,
      manageRoles: false,
      approveRequests: false,
    },
    inventory: {
      create: false,
      read: true,
      update: false,
      adjust: false,
      approveOrders: false,
    },
    reports: {
      create: true,
      read: true,
      export: true,
      configure: true,
      viewAll: true,
    },
    security: {
      read: false,
      update: false,
      audit: false,
      manageSessions: false,
    },
    system: {
      configure: false,
      backup: false,
      restore: false,
      maintenance: false,
    },
  },
  
  'Farmacéutico': {
    prescriptions: {
      create: false,
      read: true,
      update: false,
      delete: false,
      sign: false,
      approve: false,
      viewAll: true,
    },
    patients: {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: false,
      viewSensitive: false,
    },
    users: {
      create: false,
      read: false,
      update: false,
      delete: false,
      manageRoles: false,
      approveRequests: false,
    },
    inventory: {
      create: true,
      read: true,
      update: true,
      adjust: true,
      approveOrders: false,
    },
    reports: {
      create: false,
      read: true,
      export: true,
      configure: false,
      viewAll: false,
    },
    security: {
      read: false,
      update: false,
      audit: false,
      manageSessions: false,
    },
    system: {
      configure: false,
      backup: false,
      restore: false,
      maintenance: false,
    },
  },
  
  'Administrativo': {
    prescriptions: {
      create: false,
      read: true,
      update: false,
      delete: false,
      sign: false,
      approve: false,
      viewAll: false,
    },
    patients: {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      viewSensitive: false,
    },
    users: {
      create: false,
      read: false,
      update: false,
      delete: false,
      manageRoles: false,
      approveRequests: false,
    },
    inventory: {
      create: false,
      read: true,
      update: false,
      adjust: false,
      approveOrders: false,
    },
    reports: {
      create: false,
      read: true,
      export: true,
      configure: false,
      viewAll: false,
    },
    security: {
      read: false,
      update: false,
      audit: false,
      manageSessions: false,
    },
    system: {
      configure: false,
      backup: false,
      restore: false,
      maintenance: false,
    },
  },
};

// Estado global de sesión (en producción: React Context o Zustand)
let currentSession: MultiRoleSession | null = null;

// Suscripción a cambios de usuario para sincronización automática
let unsubscribeUserChanges: (() => void) | null = null;

/**
 * Inicializa sesión multi-rol
 */
export function initializeSession(
  userId: string,
  username: string,
  fullName: string,
  primaryRole: string,
  assignedRoles: string[]
): MultiRoleSession {
  const sessionId = generateSessionId();
  const now = new Date().toISOString();
  
  currentSession = {
    userId,
    username,
    fullName,
    primaryRole,
    assignedRoles,
    activeRole: primaryRole, // Inicia con rol primario
    effectivePermissions: ROLE_PERMISSIONS[primaryRole],
    roleChangeHistory: [],
    sessionId,
    createdAt: now,
    lastActivity: now,
  };
  
  // Suscribirse a cambios en el perfil del usuario
  setupUserChangeListener();
  
  return currentSession;
}

/**
 * Sincroniza la sesión con los datos actualizados del usuario
 */
export function syncSessionWithUserProfile(): void {
  if (!currentSession) return;
  
  const userProfile = getUserById(currentSession.userId);
  if (!userProfile) return;
  
  // Actualizar roles asignados
  currentSession.assignedRoles = userProfile.assignedRoles;
  currentSession.primaryRole = userProfile.primaryRole;
  
  // Si el rol activo ya no está en los roles asignados, cambiar al primario
  if (!userProfile.assignedRoles.includes(currentSession.activeRole)) {
    console.warn(
      `⚠️ Rol activo '${currentSession.activeRole}' ya no está asignado. Cambiando a rol primario '${userProfile.primaryRole}'`
    );
    
    currentSession.activeRole = userProfile.primaryRole;
    currentSession.effectivePermissions = ROLE_PERMISSIONS[userProfile.primaryRole];
    
    // Registrar cambio automático
    const changeRecord: RoleChangeRecord = {
      id: generateChangeId(),
      timestamp: new Date().toISOString(),
      previousRole: currentSession.activeRole,
      newRole: userProfile.primaryRole,
      reason: 'Sincronización automática: rol removido de usuario',
      triggeredBy: 'system',
    };
    
    currentSession.roleChangeHistory.push(changeRecord);
  }
  
  console.log('✅ Sesión sincronizada con perfil de usuario actualizado');
}

/**
 * Configura el listener para cambios en el usuario activo
 */
function setupUserChangeListener(): void {
  // Limpiar listener anterior si existe
  if (unsubscribeUserChanges) {
    unsubscribeUserChanges();
  }
  
  // Suscribirse a cambios en usuarios
  unsubscribeUserChanges = subscribeToUserChanges((userId, updatedUser) => {
    // Solo sincronizar si es el usuario de la sesión activa
    if (currentSession && userId === currentSession.userId) {
      console.log('🔄 Detectado cambio en usuario activo, sincronizando sesión...');
      syncSessionWithUserProfile();
    }
  });
}

/**
 * Obtiene sesión actual
 */
export function getCurrentSession(): MultiRoleSession | null {
  return currentSession;
}

/**
 * Obtiene permisos del rol activo
 */
export function getEffectivePermissions(): RolePermissions | null {
  return currentSession?.effectivePermissions || null;
}

/**
 * Verifica si usuario tiene permiso específico
 */
export function hasPermission(module: keyof RolePermissions, action: string): boolean {
  if (!currentSession) return false;
  
  const permissions = currentSession.effectivePermissions[module] as any;
  return permissions?.[action] === true;
}

/**
 * Requiere permiso (lanza error si no tiene)
 */
export function requirePermission(module: keyof RolePermissions, action: string): void {
  if (!hasPermission(module, action)) {
    throw new Error(
      `Acción '${action}' en módulo '${module}' no permitida para rol '${currentSession?.activeRole}'`
    );
  }
}

/**
 * Cambia rol activo en sesión
 */
export function changeActiveRole(
  newRole: string,
  reason?: string,
  triggeredBy: 'user' | 'system' | 'context' = 'user',
  route?: string
): RoleChangeRecord {
  if (!currentSession) {
    throw new Error('No hay sesión activa');
  }
  
  // Validar que el rol está asignado
  if (!currentSession.assignedRoles.includes(newRole)) {
    throw new Error(`Rol '${newRole}' no está asignado a este usuario`);
  }
  
  // Validar rate limiting (máximo 10 cambios por hora)
  const recentChanges = currentSession.roleChangeHistory.filter(
    change => {
      const changeTime = new Date(change.timestamp).getTime();
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      return changeTime > oneHourAgo;
    }
  );
  
  if (recentChanges.length >= 10) {
    throw new Error('Demasiados cambios de rol en la última hora. Contacte soporte.');
  }
  
  // Crear registro de cambio
  const changeRecord: RoleChangeRecord = {
    id: generateChangeId(),
    timestamp: new Date().toISOString(),
    previousRole: currentSession.activeRole,
    newRole,
    reason,
    triggeredBy,
    route,
    ipAddress: getUserIP(), // Mock
  };
  
  // Actualizar sesión
  currentSession.activeRole = newRole;
  currentSession.effectivePermissions = ROLE_PERMISSIONS[newRole];
  currentSession.lastActivity = new Date().toISOString();
  currentSession.roleChangeHistory.push(changeRecord);
  
  // Auditoría (en producción: enviar a backend)
  auditRoleChange(changeRecord);
  
  return changeRecord;
}

/**
 * Obtiene sugerencia de rol según contexto/ruta
 */
export function getSuggestedRoleByRoute(route: string): string | null {
  if (!currentSession) return null;
  
  const contextMap: Record<string, string> = {
    '/prescripciones': 'Médico',
    '/dispensacion': 'Farmacéutico',
    '/inventario': 'Farmacéutico',
    '/seguridad': 'Administrador',
    '/reportes': 'Médico Jefe',
    '/pacientes': 'Médico',
    '/alertas': 'Médico',
  };
  
  for (const [routePattern, role] of Object.entries(contextMap)) {
    if (route.startsWith(routePattern)) {
      // Solo sugerir si el rol está asignado y no es el activo
      if (currentSession.assignedRoles.includes(role) && currentSession.activeRole !== role) {
        return role;
      }
      break;
    }
  }
  
  return null;
}

/**
 * Vuelve al rol primario
 */
export function resetToPrimaryRole(reason: string = 'Reset manual'): RoleChangeRecord | null {
  if (!currentSession) return null;
  
  if (currentSession.activeRole === currentSession.primaryRole) {
    return null; // Ya está en rol primario
  }
  
  return changeActiveRole(currentSession.primaryRole, reason, 'user');
}

/**
 * Obtiene historial de cambios de rol
 */
export function getRoleChangeHistory(): RoleChangeRecord[] {
  return currentSession?.roleChangeHistory || [];
}

/**
 * Obtiene roles asignados al usuario (siempre actualizado desde el store)
 */
export function getAssignedRoles(): string[] {
  if (!currentSession) return [];
  
  // Obtener datos actualizados del store
  const userProfile = getUserById(currentSession.userId);
  if (userProfile) {
    // Actualizar en memoria si hay cambios
    if (JSON.stringify(userProfile.assignedRoles) !== JSON.stringify(currentSession.assignedRoles)) {
      currentSession.assignedRoles = userProfile.assignedRoles;
    }
  }
  
  return currentSession.assignedRoles;
}

/**
 * Obtiene rol activo
 */
export function getActiveRole(): string | null {
  return currentSession?.activeRole || null;
}

/**
 * Obtiene rol primario
 */
export function getPrimaryRole(): string | null {
  return currentSession?.primaryRole || null;
}

/**
 * Verifica si usuario tiene rol específico asignado
 */
export function hasRoleAssigned(role: string): boolean {
  return currentSession?.assignedRoles.includes(role) || false;
}

/**
 * Cierra sesión
 */
export function closeSession(): void {
  // Limpiar listener de cambios de usuario
  if (unsubscribeUserChanges) {
    unsubscribeUserChanges();
    unsubscribeUserChanges = null;
  }
  
  currentSession = null;
}

/**
 * Actualiza última actividad
 */
export function updateLastActivity(): void {
  if (currentSession) {
    currentSession.lastActivity = new Date().toISOString();
  }
}

/**
 * Verifica timeout de inactividad (30 minutos)
 */
export function checkInactivityTimeout(): boolean {
  if (!currentSession) return false;
  
  const lastActivity = new Date(currentSession.lastActivity).getTime();
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;
  
  if (now - lastActivity > thirtyMinutes) {
    // Volver a rol primario por inactividad
    resetToPrimaryRole('Timeout por inactividad de 30 minutos');
    return true;
  }
  
  return false;
}

// ==================== HELPERS ====================

function generateSessionId(): string {
  return `SESS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateChangeId(): string {
  return `CHG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getUserIP(): string {
  // En producción: obtener de request
  return '192.168.1.100';
}

function auditRoleChange(change: RoleChangeRecord): void {
  // En producción: enviar a backend para auditoría
  console.log('🔐 AUDITORÍA - Cambio de Rol:', {
    userId: currentSession?.userId,
    username: currentSession?.username,
    sessionId: currentSession?.sessionId,
    change,
  });
}

// ==================== HELPERS PARA COMPATIBILIDAD ====================

/**
 * Obtiene lista de usuarios desde el store (para compatibilidad con código existente)
 * @deprecated Usar getUserById o getAllUsers desde usersStore directamente
 */
export function MOCK_MULTI_ROLE_USERS() {
  // Re-exportar desde usersStore para mantener compatibilidad
  const { getAllUsers } = require('./usersStore');
  return getAllUsers().map((user: UserProfile) => ({
    userId: user.userId,
    username: user.username,
    fullName: user.fullName,
    primaryRole: user.primaryRole,
    assignedRoles: user.assignedRoles,
    email: user.email,
    specialty: user.specialty,
  }));
}

/**
 * Obtiene permisos base de un rol (para configuración)
 */
export function getRoleBasePermissions(role: string): RolePermissions {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['Médico'];
}

/**
 * Lista de todos los roles disponibles
 */
export const AVAILABLE_ROLES = [
  {
    code: 'Administrador',
    name: 'Administrador',
    description: 'Acceso total al sistema',
    icon: '🛡️',
    color: 'red',
  },
  {
    code: 'Médico',
    name: 'Médico',
    description: 'Prescripción de recetas',
    icon: '🩺',
    color: 'green',
  },
  {
    code: 'Médico Jefe',
    name: 'Médico Jefe',
    description: 'Supervisión y aprobación',
    icon: '👨‍⚕️',
    color: 'blue',
  },
  {
    code: 'Farmacéutico',
    name: 'Farmacéutico',
    description: 'Dispensación e inventario',
    icon: '💊',
    color: 'orange',
  },
  {
    code: 'Administrativo',
    name: 'Administrativo',
    description: 'Gestión administrativa',
    icon: '📋',
    color: 'gray',
  },
];

/**
 * Obtiene información del rol
 */
export function getRoleInfo(roleCode: string) {
  return AVAILABLE_ROLES.find(r => r.code === roleCode);
}
