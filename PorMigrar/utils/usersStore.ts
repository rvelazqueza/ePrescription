/**
 * Users Store - Sistema dinámico de gestión de usuarios
 * 
 * Mantiene un store centralizado de usuarios que se sincroniza automáticamente
 * con la sesión multi-rol activa.
 * 
 * Cumplimiento: HIPAA, FDA 21 CFR Part 11, FHIR, ISO 27001
 */

export interface UserProfile {
  userId: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  primaryRole: string;        // Rol principal/por defecto
  assignedRoles: string[];    // Todos los roles asignados (multi-rol)
  specialty: string;
  status: string;
  lastLogin: string;
  loginCount: number;
  failedAttempts: number;
  createdDate: string;
  department: string;
  certifiedId: string | null;
  twoFactorEnabled: boolean;
}

// Tipo de callback para suscripciones
type UserChangeCallback = (userId: string, updatedUser: UserProfile) => void;

// Store en memoria de usuarios
let usersStore: Map<string, UserProfile> = new Map();

// Listeners para cambios en usuarios
let changeListeners: UserChangeCallback[] = [];

/**
 * Inicializa el store con datos de usuarios
 */
function initializeStore(): void {
  if (usersStore.size > 0) return; // Ya inicializado
  
  const initialUsers: UserProfile[] = [
    {
      userId: "USR-7890",
      username: "juan.perez",
      fullName: "Dr. Juan Pérez",
      email: "juan.perez@hospital.com",
      phone: "+506 8888-9999",
      primaryRole: "Médico",
      assignedRoles: ["Médico", "Médico Jefe", "Farmacéutico"],  // Multi-rol
      specialty: "Medicina General",
      status: "active",
      lastLogin: "2025-10-08 09:30",
      loginCount: 567,
      failedAttempts: 0,
      createdDate: "2023-02-10",
      department: "Consulta Externa",
      certifiedId: "MED-123456",
      twoFactorEnabled: true
    },
    {
      userId: "USR-0023",
      username: "carlos.martinez",
      fullName: "Dr. Carlos Andrés Martínez López",
      email: "carlos.martinez@hospital.com",
      phone: "+1 555-0123",
      primaryRole: "Médico",
      assignedRoles: ["Médico"],
      specialty: "Medicina Interna",
      status: "active",
      lastLogin: "2024-10-01 14:35",
      loginCount: 1247,
      failedAttempts: 0,
      createdDate: "2023-01-15",
      department: "Consulta Externa",
      certifiedId: "MED-12345",
      twoFactorEnabled: true
    },
    {
      userId: "USR-0045",
      username: "ana.garcia",
      fullName: "Farmacéutica Ana María García Pérez",
      email: "ana.garcia@hospital.com",
      phone: "+1 555-0124",
      primaryRole: "Farmacéutico",
      assignedRoles: ["Farmacéutico"],
      specialty: "Farmacia Clínica",
      status: "active",
      lastLogin: "2024-10-01 14:28",
      loginCount: 892,
      failedAttempts: 0,
      createdDate: "2023-03-22",
      department: "Farmacia Central",
      certifiedId: "FARM-67890",
      twoFactorEnabled: true
    },
    {
      userId: "USR-0001",
      username: "admin.sistema",
      fullName: "Administrador del Sistema",
      email: "admin@hospital.com",
      phone: "+1 555-0100",
      primaryRole: "Administrador",
      assignedRoles: ["Administrador", "Doctor", "Farmacéutico", "Enfermera"],  // Multi-rol para demos
      specialty: "TI",
      status: "active",
      lastLogin: "2024-10-01 13:45",
      loginCount: 3456,
      failedAttempts: 0,
      createdDate: "2022-06-01",
      department: "Sistemas",
      certifiedId: "ADMIN-001",
      twoFactorEnabled: true
    },
    {
      userId: "USR-0067",
      username: "jose.torres",
      fullName: "Dr. José Luis Torres Mendoza",
      email: "jose.torres@hospital.com",
      phone: "+1 555-0125",
      primaryRole: "Médico",
      assignedRoles: ["Médico"],
      specialty: "Cardiología",
      status: "active",
      lastLogin: "2024-10-01 13:12",
      loginCount: 756,
      failedAttempts: 0,
      createdDate: "2023-05-10",
      department: "Cardiología",
      certifiedId: "MED-54321",
      twoFactorEnabled: false
    },
    {
      userId: "USR-0089",
      username: "laura.ramirez",
      fullName: "Dra. Laura Sofía Ramírez Gómez",
      email: "laura.ramirez@hospital.com",
      phone: "+1 555-0126",
      primaryRole: "Médico Jefe",
      assignedRoles: ["Médico Jefe"],
      specialty: "Medicina Familiar",
      status: "active",
      lastLogin: "2024-10-01 12:45",
      loginCount: 2134,
      failedAttempts: 0,
      createdDate: "2022-09-18",
      department: "Dirección Médica",
      certifiedId: "MED-98765",
      twoFactorEnabled: true
    },
    {
      userId: "USR-0156",
      username: "usuario.bloqueado",
      fullName: "Usuario Test Bloqueado",
      email: "bloqueado@hospital.com",
      phone: "+1 555-0127",
      primaryRole: "Médico",
      assignedRoles: ["Médico"],
      specialty: "General",
      status: "blocked",
      lastLogin: "2024-09-25 08:30",
      loginCount: 45,
      failedAttempts: 5,
      createdDate: "2024-08-01",
      department: "Consulta Externa",
      certifiedId: "MED-00000",
      twoFactorEnabled: false
    },
    {
      userId: "USR-0178",
      username: "pedro.silva",
      fullName: "Lic. Pedro Silva Morales",
      email: "pedro.silva@hospital.com",
      phone: "+1 555-0128",
      primaryRole: "Administrativo",
      assignedRoles: ["Administrativo"],
      specialty: "Admisiones",
      status: "inactive",
      lastLogin: "2024-08-15 16:20",
      loginCount: 234,
      failedAttempts: 0,
      createdDate: "2023-11-05",
      department: "Administración",
      certifiedId: null,
      twoFactorEnabled: false
    }
  ];
  
  // Cargar usuarios en el store
  initialUsers.forEach(user => {
    usersStore.set(user.userId, user);
  });
  
  console.log(`✅ Users Store inicializado con ${usersStore.size} usuarios`);
}

/**
 * Obtiene todos los usuarios
 */
export function getAllUsers(): UserProfile[] {
  initializeStore();
  return Array.from(usersStore.values());
}

/**
 * Obtiene usuario por ID
 */
export function getUserById(userId: string): UserProfile | undefined {
  initializeStore();
  return usersStore.get(userId);
}

/**
 * Obtiene usuario por username
 */
export function getUserByUsername(username: string): UserProfile | undefined {
  initializeStore();
  return Array.from(usersStore.values()).find(
    user => user.username.toLowerCase() === username.toLowerCase()
  );
}

/**
 * Actualiza un usuario y notifica a los listeners
 */
export function updateUser(userId: string, updates: Partial<UserProfile>): UserProfile | null {
  initializeStore();
  
  const user = usersStore.get(userId);
  if (!user) {
    console.error(`❌ Usuario ${userId} no encontrado`);
    return null;
  }
  
  // Validaciones básicas
  if (updates.assignedRoles) {
    // Asegurar que el rol primario esté en los roles asignados
    if (updates.primaryRole && !updates.assignedRoles.includes(updates.primaryRole)) {
      console.error('❌ El rol primario debe estar en la lista de roles asignados');
      return null;
    }
    
    // Si cambian los roles asignados, verificar que el primario siga ahí
    if (!updates.primaryRole && !updates.assignedRoles.includes(user.primaryRole)) {
      // Auto-ajustar: usar el primer rol asignado como primario
      updates.primaryRole = updates.assignedRoles[0];
      console.warn(`⚠️ Rol primario ajustado a '${updates.primaryRole}'`);
    }
  }
  
  // Actualizar usuario
  const updatedUser: UserProfile = {
    ...user,
    ...updates,
  };
  
  usersStore.set(userId, updatedUser);
  
  // Notificar a todos los listeners
  notifyListeners(userId, updatedUser);
  
  console.log(`✅ Usuario ${userId} actualizado`);
  
  return updatedUser;
}

/**
 * Crea un nuevo usuario
 */
export function createUser(newUser: UserProfile): UserProfile {
  initializeStore();
  
  // Validar que no exista
  if (usersStore.has(newUser.userId)) {
    throw new Error(`Usuario ${newUser.userId} ya existe`);
  }
  
  // Validar que el rol primario esté en los roles asignados
  if (!newUser.assignedRoles.includes(newUser.primaryRole)) {
    newUser.assignedRoles.push(newUser.primaryRole);
  }
  
  usersStore.set(newUser.userId, newUser);
  
  console.log(`✅ Usuario ${newUser.userId} creado`);
  
  return newUser;
}

/**
 * Elimina un usuario
 */
export function deleteUser(userId: string): boolean {
  initializeStore();
  
  const deleted = usersStore.delete(userId);
  
  if (deleted) {
    console.log(`✅ Usuario ${userId} eliminado`);
  }
  
  return deleted;
}

/**
 * Suscribe un callback para cambios en usuarios
 */
export function subscribeToUserChanges(callback: UserChangeCallback): () => void {
  changeListeners.push(callback);
  
  // Retornar función de cleanup
  return () => {
    changeListeners = changeListeners.filter(cb => cb !== callback);
  };
}

/**
 * Notifica a todos los listeners sobre un cambio
 */
function notifyListeners(userId: string, updatedUser: UserProfile): void {
  changeListeners.forEach(listener => {
    try {
      listener(userId, updatedUser);
    } catch (error) {
      console.error('Error en listener de cambio de usuario:', error);
    }
  });
}

/**
 * Actualiza los roles de un usuario (helper específico para roles)
 */
export function updateUserRoles(
  userId: string,
  assignedRoles: string[],
  primaryRole?: string
): UserProfile | null {
  const user = getUserById(userId);
  if (!user) return null;
  
  const updates: Partial<UserProfile> = {
    assignedRoles,
  };
  
  // Si se proporciona un nuevo rol primario, usarlo
  if (primaryRole) {
    updates.primaryRole = primaryRole;
  } else if (!assignedRoles.includes(user.primaryRole)) {
    // Si el rol primario actual ya no está en los roles asignados, usar el primero
    updates.primaryRole = assignedRoles[0];
  }
  
  return updateUser(userId, updates);
}

/**
 * Audita cambios en usuarios
 */
export function auditUserChange(
  userId: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ROLE_CHANGE' | 'STATUS_CHANGE',
  details: any,
  modifiedBy: string
): void {
  const auditRecord = {
    timestamp: new Date().toISOString(),
    userId,
    action,
    details,
    modifiedBy,
    sessionId: `AUDIT-${Date.now()}`,
  };
  
  // En producción: enviar a backend para almacenamiento persistente
  console.log('🔍 AUDITORÍA - Cambio de Usuario:', auditRecord);
}

/**
 * Resetea el store (útil para testing)
 */
export function resetStore(): void {
  usersStore.clear();
  changeListeners = [];
  initializeStore();
}
