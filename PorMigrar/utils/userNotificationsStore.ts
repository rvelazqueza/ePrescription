/**
 * Store de notificaciones de usuario
 * Gestiona las notificaciones personales del usuario activo (recetas, alertas, dispensaciones, etc.)
 * NOTA: Este store es diferente de notificationsStore.ts que maneja notificaciones del sistema
 */

export interface UserNotification {
  id: string;
  type: 'prescription' | 'dispensation' | 'alert' | 'system' | 'approval' | 'rejection' | 'expiration';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  icon?: string;
  actionUrl?: string; // Ruta a la que navegar al hacer clic
  metadata?: {
    prescriptionId?: string;
    patientName?: string;
    medicineId?: string;
    pharmacyId?: string;
    doctorId?: string;
    [key: string]: string | undefined;
  };
}

// Datos iniciales de notificaciones del usuario
const initialNotifications: UserNotification[] = [
  {
    id: 'NOTIF-001',
    type: 'prescription',
    title: 'Receta emitida correctamente',
    message: 'La receta RX-2024-0245 para el paciente María González ha sido emitida y está lista para dispensar',
    timestamp: '2024-10-14 14:30',
    isRead: false,
    priority: 'medium',
    actionUrl: '/prescripciones/emitidas',
    metadata: {
      prescriptionId: 'RX-2024-0245',
      patientName: 'María González'
    }
  },
  {
    id: 'NOTIF-002',
    type: 'dispensation',
    title: 'Medicamento dispensado',
    message: 'La Farmacia Central ha dispensado la receta RX-2024-0243 del paciente Carlos Ramírez',
    timestamp: '2024-10-14 13:15',
    isRead: false,
    priority: 'low',
    actionUrl: '/prescripciones/emitidas',
    metadata: {
      prescriptionId: 'RX-2024-0243',
      patientName: 'Carlos Ramírez',
      pharmacyId: 'FARM-001'
    }
  },
  {
    id: 'NOTIF-003',
    type: 'alert',
    title: 'Alerta de interacción medicamentosa',
    message: 'Se detectó una posible interacción entre Warfarina y Aspirina en receta RX-2024-0240',
    timestamp: '2024-10-14 11:45',
    isRead: false,
    priority: 'high',
    actionUrl: '/alertas/bandeja',
    metadata: {
      prescriptionId: 'RX-2024-0240'
    }
  },
  {
    id: 'NOTIF-004',
    type: 'expiration',
    title: 'Receta próxima a vencer',
    message: 'La receta RX-2024-0235 del paciente Ana Martínez vencerá en 3 días',
    timestamp: '2024-10-14 10:00',
    isRead: true,
    priority: 'medium',
    actionUrl: '/prescripciones/emitidas',
    metadata: {
      prescriptionId: 'RX-2024-0235',
      patientName: 'Ana Martínez'
    }
  },
  {
    id: 'NOTIF-005',
    type: 'system',
    title: 'Actualización del sistema',
    message: 'Nueva versión 2.1.0 disponible con mejoras en firma digital y reportes',
    timestamp: '2024-10-14 09:00',
    isRead: true,
    priority: 'low',
    actionUrl: '/documentacion'
  },
  {
    id: 'NOTIF-006',
    type: 'approval',
    title: 'Usuario aprobado',
    message: 'El usuario Dr. Luis Hernández (MED-789456) ha sido aprobado y activado en el sistema',
    timestamp: '2024-10-13 16:30',
    isRead: true,
    priority: 'low',
    actionUrl: '/seguridad/usuarios'
  },
  {
    id: 'NOTIF-007',
    type: 'rejection',
    title: 'Receta rechazada por farmacia',
    message: 'La receta RX-2024-0230 fue rechazada por Farmacia Sur. Motivo: Medicamento no disponible',
    timestamp: '2024-10-13 15:00',
    isRead: true,
    priority: 'high',
    actionUrl: '/dispensacion/rechazos',
    metadata: {
      prescriptionId: 'RX-2024-0230',
      pharmacyId: 'FARM-003'
    }
  }
];

// Store en memoria
let userNotifications: UserNotification[] = [...initialNotifications];

/**
 * Obtiene todas las notificaciones del usuario
 */
export function getAllUserNotifications(): UserNotification[] {
  return [...userNotifications].sort((a, b) => {
    // Ordenar por: no leídas primero, luego por fecha más reciente
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
}

/**
 * Obtiene notificaciones no leídas
 */
export function getUnreadNotifications(): UserNotification[] {
  return userNotifications.filter(n => !n.isRead).sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Obtiene el conteo de notificaciones no leídas
 */
export function getUnreadCount(): number {
  return userNotifications.filter(n => !n.isRead).length;
}

/**
 * Obtiene notificaciones por prioridad
 */
export function getNotificationsByPriority(priority: 'high' | 'medium' | 'low'): UserNotification[] {
  return userNotifications.filter(n => n.priority === priority);
}

/**
 * Obtiene notificaciones por tipo
 */
export function getNotificationsByType(type: UserNotification['type']): UserNotification[] {
  return userNotifications.filter(n => n.type === type);
}

/**
 * Marca una notificación como leída
 */
export function markAsRead(id: string): UserNotification | null {
  const notification = userNotifications.find(n => n.id === id);
  if (!notification) {
    return null;
  }

  notification.isRead = true;
  return notification;
}

/**
 * Marca todas las notificaciones como leídas
 */
export function markAllAsRead(): number {
  const unreadCount = getUnreadCount();
  userNotifications = userNotifications.map(n => ({ ...n, isRead: true }));
  return unreadCount;
}

/**
 * Marca una notificación como no leída
 */
export function markAsUnread(id: string): UserNotification | null {
  const notification = userNotifications.find(n => n.id === id);
  if (!notification) {
    return null;
  }

  notification.isRead = false;
  return notification;
}

/**
 * Elimina una notificación
 */
export function deleteNotification(id: string): boolean {
  const initialLength = userNotifications.length;
  userNotifications = userNotifications.filter(n => n.id !== id);
  return userNotifications.length < initialLength;
}

/**
 * Elimina todas las notificaciones leídas
 */
export function deleteAllReadNotifications(): number {
  const readCount = userNotifications.filter(n => n.isRead).length;
  userNotifications = userNotifications.filter(n => !n.isRead);
  return readCount;
}

/**
 * Agrega una nueva notificación
 */
export function addUserNotification(
  notification: Omit<UserNotification, 'id' | 'timestamp' | 'isRead'>
): UserNotification {
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newNotification: UserNotification = {
    ...notification,
    id: `NOTIF-${String(userNotifications.length + 1).padStart(3, '0')}`,
    timestamp,
    isRead: false
  };

  userNotifications = [newNotification, ...userNotifications];
  return newNotification;
}

/**
 * Limpia todas las notificaciones
 */
export function clearAllNotifications(): void {
  userNotifications = [];
}

/**
 * Obtiene una notificación por ID
 */
export function getNotificationById(id: string): UserNotification | undefined {
  return userNotifications.find(n => n.id === id);
}

/**
 * Obtiene notificaciones recientes (últimas N)
 */
export function getRecentNotifications(limit: number = 5): UserNotification[] {
  return getAllUserNotifications().slice(0, limit);
}
