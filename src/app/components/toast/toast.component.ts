import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-angular';
import { ToastService, Toast } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div
        *ngFor="let toast of toasts; trackBy: trackByToastId"
        class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden toast-enter"
        [ngClass]="getToastClasses(toast)"
        [@slideIn]>
        
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <lucide-icon 
                [img]="getToastIcon(toast.type)" 
                class="w-5 h-5"
                [ngClass]="getIconClasses(toast.type)"
                [strokeWidth]="2">
              </lucide-icon>
            </div>
            
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">{{ toast.title }}</p>
              <p *ngIf="toast.message" class="mt-1 text-sm text-gray-500">{{ toast.message }}</p>
            </div>
            
            <div class="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                (click)="removeToast(toast.id)"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span class="sr-only">Cerrar</span>
                <lucide-icon 
                  [img]="closeIcon" 
                  class="w-5 h-5"
                  [strokeWidth]="2">
                </lucide-icon>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Progress bar for auto-dismiss -->
        <div 
          *ngIf="toast.duration && toast.duration > 0"
          class="h-1 bg-gray-200">
          <div 
            class="h-full transition-all ease-linear"
            [ngClass]="getProgressBarClasses(toast.type)"
            [style.animation]="'shrink ' + toast.duration + 'ms linear'">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes shrink {
      from { width: 100%; }
      to { width: 0%; }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription?: Subscription;

  // Icons
  checkIcon = CheckCircle;
  errorIcon = XCircle;
  warningIcon = AlertTriangle;
  infoIcon = Info;
  closeIcon = X;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  trackByToastId(index: number, toast: Toast): string {
    return toast.id;
  }

  removeToast(id: string): void {
    this.toastService.removeToast(id);
  }

  getToastIcon(type: string): any {
    switch (type) {
      case 'success':
        return this.checkIcon;
      case 'error':
        return this.errorIcon;
      case 'warning':
        return this.warningIcon;
      case 'info':
        return this.infoIcon;
      default:
        return this.infoIcon;
    }
  }

  getToastClasses(toast: Toast): string {
    const baseClasses = 'border-l-4';
    switch (toast.type) {
      case 'success':
        return `${baseClasses} border-l-green-500`;
      case 'error':
        return `${baseClasses} border-l-red-500`;
      case 'warning':
        return `${baseClasses} border-l-orange-500`;
      case 'info':
        return `${baseClasses} border-l-blue-500`;
      default:
        return `${baseClasses} border-l-gray-500`;
    }
  }

  getIconClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-orange-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  }

  getProgressBarClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-orange-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  }
}