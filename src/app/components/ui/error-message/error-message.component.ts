import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, AlertTriangle, AlertCircle, XCircle, Info } from 'lucide-angular';

export type ErrorType = 'error' | 'warning' | 'info' | 'validation';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div 
      *ngIf="message" 
      [class]="getContainerClasses()"
      role="alert"
      [attr.aria-live]="type === 'error' ? 'assertive' : 'polite'"
    >
      <div class="flex items-start gap-2">
        <!-- Icon -->
        <div class="flex-shrink-0 mt-0.5">
          <lucide-icon 
            [img]="getIcon()" 
            [class]="getIconClasses()"
          ></lucide-icon>
        </div>
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h3 *ngIf="title" [class]="getTitleClasses()">
            {{ title }}
          </h3>
          <p [class]="getMessageClasses()">
            {{ message }}
          </p>
          
          <!-- Action Button -->
          <button 
            *ngIf="actionText && actionHandler"
            type="button"
            (click)="actionHandler()"
            [class]="getActionClasses()"
          >
            {{ actionText }}
          </button>
        </div>
        
        <!-- Dismiss Button -->
        <button 
          *ngIf="dismissible"
          type="button"
          (click)="dismiss()"
          [class]="getDismissClasses()"
          aria-label="Cerrar mensaje"
        >
          <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
        </button>
      </div>
    </div>
  `
})
export class ErrorMessageComponent {
  @Input() message: string = '';
  @Input() title?: string;
  @Input() type: ErrorType = 'error';
  @Input() dismissible: boolean = false;
  @Input() actionText?: string;
  @Input() actionHandler?: () => void;

  // Icons
  alertTriangleIcon = AlertTriangle;
  alertCircleIcon = AlertCircle;
  xCircleIcon = XCircle;
  infoIcon = Info;
  xIcon = XCircle;

  getIcon() {
    switch (this.type) {
      case 'error':
        return this.xCircleIcon;
      case 'warning':
        return this.alertTriangleIcon;
      case 'validation':
        return this.alertCircleIcon;
      case 'info':
        return this.infoIcon;
      default:
        return this.alertCircleIcon;
    }
  }

  getContainerClasses(): string {
    const baseClasses = 'rounded-lg p-4 border';
    
    switch (this.type) {
      case 'error':
        return `${baseClasses} bg-red-50 border-red-200`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-200`;
      case 'validation':
        return `${baseClasses} bg-orange-50 border-orange-200`;
      case 'info':
        return `${baseClasses} bg-blue-50 border-blue-200`;
      default:
        return `${baseClasses} bg-red-50 border-red-200`;
    }
  }

  getIconClasses(): string {
    const baseClasses = 'w-5 h-5';
    
    switch (this.type) {
      case 'error':
        return `${baseClasses} text-red-500`;
      case 'warning':
        return `${baseClasses} text-yellow-500`;
      case 'validation':
        return `${baseClasses} text-orange-500`;
      case 'info':
        return `${baseClasses} text-blue-500`;
      default:
        return `${baseClasses} text-red-500`;
    }
  }

  getTitleClasses(): string {
    const baseClasses = 'font-medium mb-1';
    
    switch (this.type) {
      case 'error':
        return `${baseClasses} text-red-800`;
      case 'warning':
        return `${baseClasses} text-yellow-800`;
      case 'validation':
        return `${baseClasses} text-orange-800`;
      case 'info':
        return `${baseClasses} text-blue-800`;
      default:
        return `${baseClasses} text-red-800`;
    }
  }

  getMessageClasses(): string {
    const baseClasses = 'text-sm';
    
    switch (this.type) {
      case 'error':
        return `${baseClasses} text-red-700`;
      case 'warning':
        return `${baseClasses} text-yellow-700`;
      case 'validation':
        return `${baseClasses} text-orange-700`;
      case 'info':
        return `${baseClasses} text-blue-700`;
      default:
        return `${baseClasses} text-red-700`;
    }
  }

  getActionClasses(): string {
    const baseClasses = 'mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded';
    
    switch (this.type) {
      case 'error':
        return `${baseClasses} text-red-600 hover:text-red-800 focus:ring-red-500`;
      case 'warning':
        return `${baseClasses} text-yellow-600 hover:text-yellow-800 focus:ring-yellow-500`;
      case 'validation':
        return `${baseClasses} text-orange-600 hover:text-orange-800 focus:ring-orange-500`;
      case 'info':
        return `${baseClasses} text-blue-600 hover:text-blue-800 focus:ring-blue-500`;
      default:
        return `${baseClasses} text-red-600 hover:text-red-800 focus:ring-red-500`;
    }
  }

  getDismissClasses(): string {
    const baseClasses = 'flex-shrink-0 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (this.type) {
      case 'error':
        return `${baseClasses} text-red-400 hover:text-red-600 focus:ring-red-500`;
      case 'warning':
        return `${baseClasses} text-yellow-400 hover:text-yellow-600 focus:ring-yellow-500`;
      case 'validation':
        return `${baseClasses} text-orange-400 hover:text-orange-600 focus:ring-orange-500`;
      case 'info':
        return `${baseClasses} text-blue-400 hover:text-blue-600 focus:ring-blue-500`;
      default:
        return `${baseClasses} text-red-400 hover:text-red-600 focus:ring-red-500`;
    }
  }

  dismiss(): void {
    this.message = '';
  }
}