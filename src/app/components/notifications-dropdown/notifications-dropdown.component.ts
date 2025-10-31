import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { 
  LucideAngularModule, 
  Bell, 
  FileText, 
  Pill, 
  AlertTriangle, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock,
  MoreHorizontal,
  Check,
  Trash2,
  ExternalLink
} from 'lucide-angular';
import { UserNotificationsService, UserNotification } from '../../services/user-notifications.service';

@Component({
  selector: 'app-notifications-dropdown',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="w-80 max-h-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <!-- Header -->
      <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-900">Notificaciones</h3>
          <div class="flex items-center space-x-2">
            <span class="text-xs text-gray-500">{{ unreadCount }} sin leer</span>
            <button
              *ngIf="unreadCount > 0"
              (click)="markAllAsRead()"
              class="text-xs text-blue-600 hover:text-blue-700 font-medium"
              title="Marcar todas como leídas">
              Marcar todas
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="max-h-80 overflow-y-auto">
        <div *ngIf="notifications.length === 0" class="px-4 py-8 text-center">
          <lucide-icon [img]="bellIcon" class="w-8 h-8 text-gray-400 mx-auto mb-2"></lucide-icon>
          <p class="text-sm text-gray-500">No tienes notificaciones</p>
        </div>

        <div *ngFor="let notification of notifications; trackBy: trackByNotificationId" 
             class="border-b border-gray-100 last:border-b-0">
          <div 
            [class]="'px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer relative ' + (notification.isRead ? 'opacity-75' : '')"
            (click)="onNotificationClick(notification)">
            
            <!-- Unread indicator -->
            <div *ngIf="!notification.isRead" 
                 class="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
            
            <div [class]="'flex items-start space-x-3 ' + (notification.isRead ? '' : 'ml-2')">
              <!-- Icon -->
              <div [class]="'flex-shrink-0 p-2 rounded-lg ' + getNotificationBgColor(notification.priority)">
                <lucide-icon 
                  [img]="getNotificationIcon(notification.type)" 
                  [class]="'w-4 h-4 ' + getNotificationColor(notification.priority)">
                </lucide-icon>
              </div>
              
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <p [class]="'text-sm ' + (notification.isRead ? 'text-gray-600' : 'text-gray-900 font-medium')">
                      {{ notification.title }}
                    </p>
                    <p class="text-xs text-gray-500 mt-1 line-clamp-2">
                      {{ notification.message }}
                    </p>
                    <div class="flex items-center justify-between mt-2">
                      <span class="text-xs text-gray-400">{{ formatTimestamp(notification.timestamp) }}</span>
                      <span [class]="'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ' + getPriorityBadgeClasses(notification.priority)">
                        {{ getPriorityLabel(notification.priority) }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Actions -->
                  <div class="flex items-center space-x-1 ml-2">
                    <button
                      (click)="toggleReadStatus(notification, $event)"
                      [title]="notification.isRead ? 'Marcar como no leída' : 'Marcar como leída'"
                      class="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <lucide-icon [img]="checkIcon" class="w-3 h-3"></lucide-icon>
                    </button>
                    <button
                      (click)="deleteNotification(notification, $event)"
                      title="Eliminar notificación"
                      class="p-1 text-gray-400 hover:text-red-600 rounded">
                      <lucide-icon [img]="trash2Icon" class="w-3 h-3"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <button
            (click)="viewAllNotifications()"
            class="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
            Ver todas las notificaciones
            <lucide-icon [img]="externalLinkIcon" class="w-3 h-3 ml-1"></lucide-icon>
          </button>
          <button
            *ngIf="hasReadNotifications"
            (click)="deleteAllRead()"
            class="text-xs text-gray-500 hover:text-red-600">
            Limpiar leídas
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class NotificationsDropdownComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  notifications: UserNotification[] = [];
  unreadCount = 0;
  hasReadNotifications = false;
  
  private subscription = new Subscription();

  // Icons
  bellIcon = Bell;
  fileTextIcon = FileText;
  pillIcon = Pill;
  alertTriangleIcon = AlertTriangle;
  settingsIcon = Settings;
  checkCircleIcon = CheckCircle;
  xCircleIcon = XCircle;
  clockIcon = Clock;
  moreHorizontalIcon = MoreHorizontal;
  checkIcon = Check;
  trash2Icon = Trash2;
  externalLinkIcon = ExternalLink;

  constructor(
    private notificationsService: UserNotificationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to notifications
    this.subscription.add(
      this.notificationsService.notifications$.subscribe(notifications => {
        this.notifications = notifications.slice(0, 10); // Mostrar solo las 10 más recientes
        this.hasReadNotifications = notifications.some(n => n.isRead);
      })
    );

    // Subscribe to unread count
    this.subscription.add(
      this.notificationsService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  trackByNotificationId(index: number, notification: UserNotification): string {
    return notification.id;
  }

  onNotificationClick(notification: UserNotification): void {
    // Marcar como leída si no lo está
    if (!notification.isRead) {
      this.notificationsService.markAsRead(notification.id);
    }

    // Navegar a la URL de acción si existe
    if (notification.actionUrl) {
      this.router.navigate([notification.actionUrl]);
      this.close.emit();
    }
  }

  toggleReadStatus(notification: UserNotification, event: Event): void {
    event.stopPropagation();
    
    if (notification.isRead) {
      this.notificationsService.markAsUnread(notification.id);
    } else {
      this.notificationsService.markAsRead(notification.id);
    }
  }

  deleteNotification(notification: UserNotification, event: Event): void {
    event.stopPropagation();
    this.notificationsService.deleteNotification(notification.id);
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead();
  }

  deleteAllRead(): void {
    this.notificationsService.deleteAllReadNotifications();
  }

  viewAllNotifications(): void {
    this.router.navigate(['/notificaciones/lista']);
    this.close.emit();
  }

  getNotificationIcon(type: UserNotification['type']): any {
    switch (type) {
      case 'prescription':
        return this.fileTextIcon;
      case 'dispensation':
        return this.pillIcon;
      case 'alert':
        return this.alertTriangleIcon;
      case 'system':
        return this.settingsIcon;
      case 'approval':
        return this.checkCircleIcon;
      case 'rejection':
        return this.xCircleIcon;
      case 'expiration':
        return this.clockIcon;
      default:
        return this.bellIcon;
    }
  }

  getNotificationColor(priority: 'high' | 'medium' | 'low'): string {
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

  getNotificationBgColor(priority: 'high' | 'medium' | 'low'): string {
    switch (priority) {
      case 'high':
        return 'bg-red-50';
      case 'medium':
        return 'bg-yellow-50';
      case 'low':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  }

  getPriorityLabel(priority: 'high' | 'medium' | 'low'): string {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return 'Normal';
    }
  }

  getPriorityBadgeClasses(priority: 'high' | 'medium' | 'low'): string {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Ahora';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) { // 24 horas
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d`;
    }
  }
}