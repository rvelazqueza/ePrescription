/**
 * Store de notificaciones
 * Gestiona el almacenamiento y persistencia de las notificaciones del sistema
 */

export interface Notification {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  tipoDestinatario: "interno" | "externo" | "ambos";
  canalPrincipal: string;
  canales: string[];
  categoria: string;
  estado: "activa" | "inactiva" | "programada" | "pausada";
  prioridad: "alta" | "media" | "baja";
  asunto?: string;
  cuerpoMensaje?: string;
  plantillaHTML?: string;
  destinatariosEspecificos?: string[];
  programacion?: {
    tipo: "inmediata" | "programada" | "recurrente";
    fechaHora?: string;
    frecuencia?: string;
  };
  ultimaModificacion: string;
  usuarioModificacion: string;
  totalEnvios: number;
  exitosos: number;
  fallidos: number;
  createdAt: string;
  updatedAt: string;
}

// Datos de ejemplo (mock data)
const initialNotifications: Notification[] = [
  {
    id: "1",
    codigo: "NOTIF-RX-001",
    nombre: "Nueva Receta Emitida",
    descripcion: "Notificación enviada al paciente cuando el médico emite una nueva receta electrónica",
    tipoDestinatario: "externo",
    canalPrincipal: "Correo",
    canales: ["Correo", "SMS", "Interna"],
    categoria: "Prescripciones",
    estado: "activa",
    prioridad: "alta",
    ultimaModificacion: "2024-10-05 14:23",
    usuarioModificacion: "Dr. Carlos Méndez",
    totalEnvios: 1245,
    exitosos: 1230,
    fallidos: 15,
    createdAt: "2024-09-15 10:00",
    updatedAt: "2024-10-05 14:23"
  },
  {
    id: "2",
    codigo: "NOTIF-DISP-001",
    nombre: "Dispensación Registrada",
    descripcion: "Notificación cuando se registra la dispensación de una receta en farmacia",
    tipoDestinatario: "ambos",
    canalPrincipal: "Interna",
    canales: ["Interna", "Correo"],
    categoria: "Dispensación",
    estado: "activa",
    prioridad: "media",
    ultimaModificacion: "2024-10-04 10:15",
    usuarioModificacion: "Adm. Sistema",
    totalEnvios: 892,
    exitosos: 890,
    fallidos: 2,
    createdAt: "2024-09-10 08:30",
    updatedAt: "2024-10-04 10:15"
  },
  {
    id: "3",
    codigo: "NOTIF-STOCK-001",
    nombre: "Alerta de Stock Bajo",
    descripcion: "Notificación crítica cuando un medicamento alcanza el nivel mínimo de stock",
    tipoDestinatario: "interno",
    canalPrincipal: "Interna",
    canales: ["Interna", "Correo", "WhatsApp"],
    categoria: "Inventario",
    estado: "activa",
    prioridad: "alta",
    ultimaModificacion: "2024-10-03 16:45",
    usuarioModificacion: "Lic. Ana Torres",
    totalEnvios: 156,
    exitosos: 156,
    fallidos: 0,
    createdAt: "2024-09-05 12:00",
    updatedAt: "2024-10-03 16:45"
  },
  {
    id: "4",
    codigo: "NOTIF-USER-001",
    nombre: "Bienvenida Nuevo Usuario",
    descripcion: "Mensaje de bienvenida enviado a usuarios recién registrados en el sistema",
    tipoDestinatario: "interno",
    canalPrincipal: "Correo",
    canales: ["Correo"],
    categoria: "Usuarios",
    estado: "activa",
    prioridad: "baja",
    ultimaModificacion: "2024-10-02 09:30",
    usuarioModificacion: "Adm. Sistema",
    totalEnvios: 43,
    exitosos: 43,
    fallidos: 0,
    createdAt: "2024-08-20 14:00",
    updatedAt: "2024-10-02 09:30"
  },
  {
    id: "5",
    codigo: "NOTIF-ALERT-001",
    nombre: "Alerta de Interacción Medicamentosa",
    descripcion: "Alerta crítica sobre posibles interacciones entre medicamentos prescritos",
    tipoDestinatario: "interno",
    canalPrincipal: "Interna",
    canales: ["Interna", "SMS"],
    categoria: "Alertas",
    estado: "activa",
    prioridad: "alta",
    ultimaModificacion: "2024-10-01 11:20",
    usuarioModificacion: "Dr. Luis Ramírez",
    totalEnvios: 78,
    exitosos: 75,
    fallidos: 3,
    createdAt: "2024-08-15 09:00",
    updatedAt: "2024-10-01 11:20"
  },
  {
    id: "6",
    codigo: "NOTIF-MAINT-001",
    nombre: "Mantenimiento Programado",
    descripcion: "Notificación sobre mantenimientos programados del sistema",
    tipoDestinatario: "interno",
    canalPrincipal: "Interna",
    canales: ["Interna", "Correo"],
    categoria: "Sistema",
    estado: "inactiva",
    prioridad: "media",
    ultimaModificacion: "2024-09-28 15:00",
    usuarioModificacion: "Adm. Sistema",
    totalEnvios: 5,
    exitosos: 5,
    fallidos: 0,
    createdAt: "2024-08-01 10:00",
    updatedAt: "2024-09-28 15:00"
  }
];

// Store en memoria
let notifications: Notification[] = [...initialNotifications];

/**
 * Obtiene todas las notificaciones
 */
export function getAllNotifications(): Notification[] {
  return [...notifications];
}

/**
 * Obtiene una notificación por ID
 */
export function getNotificationById(id: string): Notification | undefined {
  return notifications.find(n => n.id === id);
}

/**
 * Agrega una nueva notificación
 */
export function addNotification(notification: Omit<Notification, 'id' | 'totalEnvios' | 'exitosos' | 'fallidos' | 'createdAt' | 'updatedAt'>): Notification {
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const newNotification: Notification = {
    ...notification,
    id: `NOTIF-${Date.now()}`,
    totalEnvios: 0,
    exitosos: 0,
    fallidos: 0,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  
  notifications = [...notifications, newNotification];
  return newNotification;
}

/**
 * Actualiza una notificación existente
 */
export function updateNotification(id: string, updates: Partial<Notification>): Notification | null {
  const index = notifications.findIndex(n => n.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  notifications[index] = {
    ...notifications[index],
    ...updates,
    updatedAt: timestamp,
    ultimaModificacion: timestamp
  };
  
  return notifications[index];
}

/**
 * Elimina una notificación
 */
export function deleteNotification(id: string): boolean {
  const initialLength = notifications.length;
  notifications = notifications.filter(n => n.id !== id);
  return notifications.length < initialLength;
}

/**
 * Duplica una notificación
 */
export function duplicateNotification(id: string): Notification | null {
  const original = notifications.find(n => n.id === id);
  
  if (!original) {
    return null;
  }
  
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const duplicated: Notification = {
    ...original,
    id: `NOTIF-${Date.now()}`,
    codigo: `${original.codigo}-COPIA`,
    nombre: `${original.nombre} (Copia)`,
    estado: "inactiva",
    totalEnvios: 0,
    exitosos: 0,
    fallidos: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
    ultimaModificacion: timestamp
  };
  
  notifications = [...notifications, duplicated];
  return duplicated;
}

/**
 * Cambia el estado de una notificación
 */
export function toggleNotificationStatus(id: string): Notification | null {
  const notification = notifications.find(n => n.id === id);
  
  if (!notification) {
    return null;
  }
  
  const newStatus: Notification['estado'] = notification.estado === 'activa' ? 'inactiva' : 'activa';
  
  return updateNotification(id, { estado: newStatus });
}
