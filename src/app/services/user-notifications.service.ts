import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

@Injectable({
  providedIn: 'root'
})
export class UserNotificationsService {
  private notificationsSubject = new BehaviorSubject<UserNotification[]>(this.getInitialNotifications());
  
  // Observable público para que los componentes se suscriban
  public notifications$ = this.notificationsSubject.asObservable();
  
  // Observable para notificaciones no leídas
  public unreadNotifications$ = this.notifications$.pipe(
    map(notifications => notifications.filter(n => !n.isRead))
  );
  
  // Observable para el conteo de no leídas
  public unreadCount$ = this.unreadNotifications$.pipe(
    map(notifications => notifications.length)
  );

  constructor() {}

  /**
   * Datos iniciales de notificaciones del usuario
   */
  private getInitialNotifications(): UserNotification[] {
    const notifications: UserNotification[] = [
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

    return notifications.sort((a, b) => {
      // Ordenar por: no leídas primero, luego por fecha más reciente
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  /**
   * Obtiene todas las notificaciones del usuario
   */
  getAllNotifications(): UserNotification[] {
    return this.notificationsSubject.value;
  }

  /**
   * Obtiene notificaciones no leídas
   */
  getUnreadNotifications(): UserNotification[] {
    return this.notificationsSubject.value.filter(n => !n.isRead);
  }

  /**
   * Obtiene el conteo de notificaciones no leídas
   */
  getUnreadCount(): number {
    return this.getUnreadNotifications().length;
  }

  /**
   * Obtiene notificaciones por prioridad
   */
  getNotificationsByPriority(priority: 'high' | 'medium' | 'low'): UserNotification[] {
    return this.notificationsSubject.value.filter(n => n.priority === priority);
  }

  /**
   * Obtiene notificaciones por tipo
   */
  getNotificationsByType(type: UserNotification['type']): UserNotification[] {
    return this.notificationsSubject.value.filter(n => n.type === type);
  }

  /**
   * Marca una notificación como leída
   */
  markAsRead(id: string): UserNotification | null {
    const notifications = this.notificationsSubject.value;
    const notification = notifications.find(n => n.id === id);
    
    if (!notification) {
      return null;
    }
    
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    
    this.notificationsSubject.next(updatedNotifications);
    return { ...notification, isRead: true };
  }

  /**
   * Marca todas las notificaciones como leídas
   */
  markAllAsRead(): number {
    const notifications = this.notificationsSubject.value;
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    this.notificationsSubject.next(updatedNotifications);
    
    return unreadCount;
  }

  /**
   * Marca una notificación como no leída
   */
  markAsUnread(id: string): UserNotification | null {
    const notifications = this.notificationsSubject.value;
    const notification = notifications.find(n => n.id === id);
    
    if (!notification) {
      return null;
    }
    
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, isRead: false } : n
    );
    
    this.notificationsSubject.next(updatedNotifications);
    return { ...notification, isRead: false };
  }

  /**
   * Elimina una notificación
   */
  deleteNotification(id: string): boolean {
    const notifications = this.notificationsSubject.value;
    const initialLength = notifications.length;
    
    const updatedNotifications = notifications.filter(n => n.id !== id);
    this.notificationsSubject.next(updatedNotifications);
    
    return updatedNotifications.length < initialLength;
  }

  /**
   * Elimina todas las notificaciones leídas
   */
  deleteAllReadNotifications(): number {
    const notifications = this.notificationsSubject.value;
    const readCount = notifications.filter(n => n.isRead).length;
    
    const updatedNotifications = notifications.filter(n => !n.isRead);
    this.notificationsSubject.next(updatedNotifications);
    
    return readCount;
  }

  /**
   * Agrega una nueva notificación
   */
  addNotification(
    notification: Omit<UserNotification, 'id' | 'timestamp' | 'isRead'>
  ): UserNotification {
    const notifications = this.notificationsSubject.value;
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newNotification: UserNotification = {
      ...notification,
      id: `NOTIF-${String(notifications.length + 1).padStart(3, '0')}`,
      timestamp,
      isRead: false
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    this.notificationsSubject.next(updatedNotifications);
    
    return newNotification;
  }

  /**
   * Limpia todas las notificaciones
   */
  clearAllNotifications(): void {
    this.notificationsSubject.next([]);
  }

  /**
   * Obtiene una notificación por ID
   */
  getNotificationById(id: string): UserNotification | undefined {
    return this.notificationsSubject.value.find(n => n.id === id);
  }

  /**
   * Obtiene notificaciones recientes (últimas N)
   */
  getRecentNotifications(limit: number = 5): UserNotification[] {
    return this.notificationsSubject.value.slice(0, limit);
  }

  /**
   * Obtiene el icono según el tipo de notificación
   */
  getNotificationIcon(type: UserNotification['type']): string {
    switch (type) {
      case 'prescription':
        return 'FileText';
      case 'dispensation':
        return 'Pill';
      case 'alert':
        return 'AlertTriangle';
      case 'system':
        return 'Settings';
      case 'approval':
        return 'CheckCircle';
      case 'rejection':
        return 'XCircle';
      case 'expiration':
        return 'Clock';
      default:
        return 'Bell';
    }
  }

  /**
   * Obtiene el color según la prioridad
   */
  getPriorityColor(priority: 'high' | 'medium' | 'low'): string {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  }

  /**
   * Obtiene el color de fondo según la prioridad
   */
  getPriorityBgColor(priority: 'high' | 'medium' | 'low'): string {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  }
}