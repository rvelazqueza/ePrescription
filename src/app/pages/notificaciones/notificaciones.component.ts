import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-angular';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Notificaciones</h1>
          <p class="text-gray-600">Centro de notificaciones del sistema</p>
        </div>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
          Marcar todas como leídas
        </button>
      </div>

      <div class="space-y-4">
        <div *ngFor="let notificacion of notificaciones" 
             [class]="getNotificationClass(notificacion.tipo, notificacion.leida)"
             class="bg-white border rounded-lg p-4 shadow-sm">
          <div class="flex items-start justify-between">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <lucide-icon [img]="getNotificationIcon(notificacion.tipo)" 
                           [class]="getIconClass(notificacion.tipo)"
                           class="w-5 h-5"></lucide-icon>
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900">{{ notificacion.titulo }}</h4>
                <p class="text-sm text-gray-600 mt-1">{{ notificacion.mensaje }}</p>
                <p class="text-xs text-gray-500 mt-2">{{ notificacion.fecha }}</p>
              </div>
            </div>
            <button class="text-gray-400 hover:text-gray-600">
              <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="notificaciones.length === 0" class="text-center py-12">
        <lucide-icon [img]="bellIcon" class="w-16 h-16 mx-auto text-gray-400 mb-4"></lucide-icon>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay notificaciones</h3>
        <p class="text-gray-500">Todas las notificaciones aparecerán aquí</p>
      </div>
    </div>
  `
})
export class NotificacionesComponent {
  bellIcon = Bell;
  checkCircleIcon = CheckCircle;
  alertTriangleIcon = AlertTriangle;
  infoIcon = Info;
  xIcon = X;

  notificaciones = [
    {
      id: 1,
      tipo: 'success',
      titulo: 'Prescripción completada',
      mensaje: 'La prescripción RX001 ha sido firmada digitalmente',
      fecha: 'Hace 5 minutos',
      leida: false
    },
    {
      id: 2,
      tipo: 'warning',
      titulo: 'Stock bajo',
      mensaje: 'El medicamento Ibuprofeno 400mg tiene stock bajo',
      fecha: 'Hace 1 hora',
      leida: false
    },
    {
      id: 3,
      tipo: 'info',
      titulo: 'Actualización del sistema',
      mensaje: 'Nueva versión disponible con mejoras de seguridad',
      fecha: 'Hace 2 horas',
      leida: true
    }
  ];

  getNotificationIcon(tipo: string): any {
    const icons = {
      'success': this.checkCircleIcon,
      'warning': this.alertTriangleIcon,
      'error': this.alertTriangleIcon,
      'info': this.infoIcon
    };
    return icons[tipo as keyof typeof icons] || this.infoIcon;
  }

  getIconClass(tipo: string): string {
    const classes = {
      'success': 'text-green-600',
      'warning': 'text-yellow-600',
      'error': 'text-red-600',
      'info': 'text-blue-600'
    };
    return classes[tipo as keyof typeof classes] || 'text-gray-600';
  }

  getNotificationClass(tipo: string, leida: boolean): string {
    const baseClass = leida ? 'opacity-60' : '';
    const borderClass = {
      'success': 'border-l-4 border-l-green-500',
      'warning': 'border-l-4 border-l-yellow-500',
      'error': 'border-l-4 border-l-red-500',
      'info': 'border-l-4 border-l-blue-500'
    };
    return `${baseClass} ${borderClass[tipo as keyof typeof borderClass] || ''}`;
  }
}