import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number; // in milliseconds, 0 means persistent
  dismissible?: boolean;
  actionText?: string;
  actionHandler?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private defaultDuration = 5000; // 5 seconds
  private notificationId = 0;

  constructor() {}

  /**
   * Show a success notification
   */
  showSuccess(message: string, title?: string, options?: Partial<Notification>): string {
    return this.addNotification({
      type: 'success',
      title,
      message,
      duration: this.defaultDuration,
      dismissible: true,
      ...options
    });
  }

  /**
   * Show an error notification
   */
  showError(message: string, title?: string, options?: Partial<Notification>): string {
    return this.addNotification({
      type: 'error',
      title,
      message,
      duration: 0, // Persistent by default for errors
      dismissible: true,
      ...options
    });
  }

  /**
   * Show a warning notification
   */
  showWarning(message: string, title?: string, options?: Partial<Notification>): string {
    return this.addNotification({
      type: 'warning',
      title,
      message,
      duration: this.defaultDuration,
      dismissible: true,
      ...options
    });
  }

  /**
   * Show an info notification
   */
  showInfo(message: string, title?: string, options?: Partial<Notification>): string {
    return this.addNotification({
      type: 'info',
      title,
      message,
      duration: this.defaultDuration,
      dismissible: true,
      ...options
    });
  }

  /**
   * Show a notification for patient selection success
   */
  showPatientSelected(patientName: string): string {
    return this.showSuccess(
      `Paciente "${patientName}" seleccionado correctamente`,
      'Paciente Seleccionado',
      { duration: 3000 }
    );
  }

  /**
   * Show a notification for patient selection error
   */
  showPatientSelectionError(error: string): string {
    return this.showError(
      error,
      'Error al Seleccionar Paciente',
      { 
        actionText: 'Reintentar',
        actionHandler: () => {
          // This will be handled by the component
        }
      }
    );
  }

  /**
   * Show a notification for validation errors
   */
  showValidationError(message: string): string {
    return this.showWarning(
      message,
      'Error de Validación',
      { duration: 4000 }
    );
  }

  /**
   * Show a notification for search errors
   */
  showSearchError(error: string): string {
    return this.showError(
      error,
      'Error en la Búsqueda',
      {
        actionText: 'Reintentar',
        actionHandler: () => {
          // This will be handled by the component
        }
      }
    );
  }

  /**
   * Show a notification for patient data loading errors
   */
  showLoadingError(context: string): string {
    return this.showError(
      `No se pudo cargar la información ${context}. Por favor, inténtelo de nuevo.`,
      'Error de Carga',
      {
        actionText: 'Reintentar',
        actionHandler: () => {
          // This will be handled by the component
        }
      }
    );
  }

  /**
   * Show a notification for incomplete patient data
   */
  showIncompleteDataWarning(missingFields: string[]): string {
    const fieldsText = missingFields.join(', ');
    return this.showWarning(
      `El perfil del paciente tiene información incompleta: ${fieldsText}`,
      'Información Incompleta',
      {
        duration: 6000,
        actionText: 'Completar Perfil',
        actionHandler: () => {
          // This will be handled by the component
        }
      }
    );
  }

  /**
   * Show a notification for inactive patient
   */
  showInactivePatientWarning(patientName: string): string {
    return this.showWarning(
      `El paciente "${patientName}" está inactivo en el sistema`,
      'Paciente Inactivo',
      {
        duration: 0, // Persistent
        actionText: 'Reactivar',
        actionHandler: () => {
          // This will be handled by the component
        }
      }
    );
  }

  /**
   * Show a notification when no patient is selected for medication
   */
  showNoPatientSelectedWarning(): string {
    return this.showWarning(
      'Debe seleccionar un paciente antes de agregar medicamentos',
      'Paciente Requerido',
      { duration: 4000 }
    );
  }

  /**
   * Add a custom notification
   */
  addNotification(notification: Omit<Notification, 'id'>): string {
    const id = this.generateId();
    const newNotification: Notification = {
      id,
      ...notification
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, newNotification]);

    // Auto-dismiss if duration is set
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        this.dismissNotification(id);
      }, newNotification.duration);
    }

    return id;
  }

  /**
   * Dismiss a notification by ID
   */
  dismissNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(updatedNotifications);
  }

  /**
   * Dismiss all notifications
   */
  dismissAll(): void {
    this.notificationsSubject.next([]);
  }

  /**
   * Dismiss all notifications of a specific type
   */
  dismissByType(type: Notification['type']): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.type !== type);
    this.notificationsSubject.next(updatedNotifications);
  }

  /**
   * Get current notifications
   */
  getCurrentNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  /**
   * Check if there are any notifications
   */
  hasNotifications(): boolean {
    return this.notificationsSubject.value.length > 0;
  }

  /**
   * Check if there are any notifications of a specific type
   */
  hasNotificationsOfType(type: Notification['type']): boolean {
    return this.notificationsSubject.value.some(n => n.type === type);
  }

  /**
   * Generate unique ID for notifications
   */
  private generateId(): string {
    return `notification-${++this.notificationId}-${Date.now()}`;
  }
}