import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-angular';
import { Observable, Subscription } from 'rxjs';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

import { NotificationService, Notification } from '../../../services/notification.service';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div 
      class="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full"
      [@listAnimation]="notifications.length"
    >
      <div
        *ngFor="let notification of notifications; trackBy: trackByNotificationId"
        [class]="getNotificationClasses(notification)"
        [@slideIn]
        role="alert"
        [attr.aria-live]="notification.type === 'error' ? 'assertive' : 'polite'"
      >
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div class="flex-shrink-0 mt-0.5">
            <lucide-icon 
              [img]="getIcon(notification.type)" 
              [class]="getIconClasses(notification.type)"
            ></lucide-icon>
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h4 *ngIf="notification.title" [class]="getTitleClasses(notification.type)">
              {{ notification.title }}
            </h4>
            <p [class]="getMessageClasses(notification.type)">
              {{ notification.message }}
            </p>
            
            <!-- Action Button -->
            <button 
              *ngIf="notification.actionText && notification.actionHandler"
              type="button"
              (click)="handleAction(notification)"
              [class]="getActionClasses(notification.type)"
            >
              {{ notification.actionText }}
            </button>
          </div>
          
          <!-- Dismiss Button -->
          <button 
            *ngIf="notification.dismissible"
            type="button"
            (click)="dismiss(notification.id)"
            [class]="getDismissClasses(notification.type)"
            aria-label="Cerrar notificación"
          >
            <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
        
        <!-- Progress Bar for timed notifications -->
        <div 
          *ngIf="notification.duration && notification.duration > 0"
          class="mt-2 h-1 bg-black bg-opacity-10 rounded-full overflow-hidden"
        >
          <div 
            class="h-full bg-current animate-pulse"
            [style.animation-duration]="notification.duration + 'ms'"
          ></div>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ transform: 'translateX(100%)', opacity: 0 }),
          stagger(100, [
            animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class NotificationContainerComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription = new Subscription();

  // Icons
  checkIcon = CheckCircle;
  xCircleIcon = XCircle;
  alertIcon = AlertTriangle;
  infoIcon = Info;
  xIcon = X;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription.add(
      this.notificationService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getIcon(type: Notification['type']) {
    switch (type) {
      case 'success':
        return this.checkIcon;
      case 'error':
        return this.xCircleIcon;
      case 'warning':
        return this.alertIcon;
      case 'info':
        return this.infoIcon;
      default:
        return this.infoIcon;
    }
  }

  getNotificationClasses(notification: Notification): string {
    const baseClasses = 'rounded-lg p-4 shadow-lg border backdrop-blur-sm';
    
    switch (notification.type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-200 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-200 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-200 text-yellow-800`;
      case 'info':
        return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-200 text-gray-800`;
    }
  }

  getIconClasses(type: Notification['type']): string {
    const baseClasses = 'w-5 h-5';
    
    switch (type) {
      case 'success':
        return `${baseClasses} text-green-500`;
      case 'error':
        return `${baseClasses} text-red-500`;
      case 'warning':
        return `${baseClasses} text-yellow-500`;
      case 'info':
        return `${baseClasses} text-blue-500`;
      default:
        return `${baseClasses} text-gray-500`;
    }
  }

  getTitleClasses(type: Notification['type']): string {
    const baseClasses = 'font-medium text-sm mb-1';
    
    switch (type) {
      case 'success':
        return `${baseClasses} text-green-800`;
      case 'error':
        return `${baseClasses} text-red-800`;
      case 'warning':
        return `${baseClasses} text-yellow-800`;
      case 'info':
        return `${baseClasses} text-blue-800`;
      default:
        return `${baseClasses} text-gray-800`;
    }
  }

  getMessageClasses(type: Notification['type']): string {
    const baseClasses = 'text-sm';
    
    switch (type) {
      case 'success':
        return `${baseClasses} text-green-700`;
      case 'error':
        return `${baseClasses} text-red-700`;
      case 'warning':
        return `${baseClasses} text-yellow-700`;
      case 'info':
        return `${baseClasses} text-blue-700`;
      default:
        return `${baseClasses} text-gray-700`;
    }
  }

  getActionClasses(type: Notification['type']): string {
    const baseClasses = 'mt-2 text-xs font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded';
    
    switch (type) {
      case 'success':
        return `${baseClasses} text-green-600 hover:text-green-800 focus:ring-green-500`;
      case 'error':
        return `${baseClasses} text-red-600 hover:text-red-800 focus:ring-red-500`;
      case 'warning':
        return `${baseClasses} text-yellow-600 hover:text-yellow-800 focus:ring-yellow-500`;
      case 'info':
        return `${baseClasses} text-blue-600 hover:text-blue-800 focus:ring-blue-500`;
      default:
        return `${baseClasses} text-gray-600 hover:text-gray-800 focus:ring-gray-500`;
    }
  }

  getDismissClasses(type: Notification['type']): string {
    const baseClasses = 'flex-shrink-0 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-black hover:bg-opacity-10';
    
    switch (type) {
      case 'success':
        return `${baseClasses} text-green-400 hover:text-green-600 focus:ring-green-500`;
      case 'error':
        return `${baseClasses} text-red-400 hover:text-red-600 focus:ring-red-500`;
      case 'warning':
        return `${baseClasses} text-yellow-400 hover:text-yellow-600 focus:ring-yellow-500`;
      case 'info':
        return `${baseClasses} text-blue-400 hover:text-blue-600 focus:ring-blue-500`;
      default:
        return `${baseClasses} text-gray-400 hover:text-gray-600 focus:ring-gray-500`;
    }
  }

  dismiss(id: string): void {
    this.notificationService.dismissNotification(id);
  }

  handleAction(notification: Notification): void {
    if (notification.actionHandler) {
      notification.actionHandler();
    }
    // Optionally dismiss the notification after action
    this.dismiss(notification.id);
  }

  trackByNotificationId(_index: number, notification: Notification): string {
    return notification.id;
  }
}