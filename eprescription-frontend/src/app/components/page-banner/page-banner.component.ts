import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-page-banner',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="relative overflow-hidden rounded-xl mb-8 card" [ngClass]="gradientClass">
      <div class="absolute inset-0 bg-gradient-to-r opacity-90"></div>
      <div class="relative mobile-container py-8 md:py-12">
        <div class="mobile-banner-content">
          <div class="mobile-banner-info">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <lucide-icon 
                  [img]="icon" 
                  class="w-6 h-6 md:w-8 md:h-8 text-white"
                  [strokeWidth]="2">
                </lucide-icon>
              </div>
            </div>
            <div class="text-white">
              <h1 class="mobile-heading-responsive font-bold mb-2 text-white">{{ title }}</h1>
              <p class="mobile-text-responsive text-white/90 max-w-2xl" *ngIf="description">
                {{ description }}
              </p>
            </div>
          </div>
          
          <div *ngIf="actionButton" class="flex-shrink-0 w-full md:w-auto">
            <button 
              type="button"
              (click)="onActionClick()"
              class="btn-primary bg-white text-medical-neutral-900 hover:bg-medical-neutral-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full md:w-auto justify-center">
              <lucide-icon 
                [img]="actionButton.icon" 
                class="w-5 h-5 mr-2"
                [strokeWidth]="2">
              </lucide-icon>
              {{ actionButton.text }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
      <div class="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
    </div>
  `,
  styles: []
})
export class PageBannerComponent {
  @Input() icon: any;
  @Input() title: string = '';
  @Input() description?: string;
  @Input() gradient: 'blue' | 'green' | 'purple' | 'orange' = 'blue';
  @Input() actionButton?: {
    text: string;
    icon: any;
    action: () => void;
  };

  get gradientClass(): string {
    const gradients = {
      blue: 'bg-gradient-to-r from-medical-primary-600 to-medical-primary-700',
      green: 'bg-gradient-to-r from-medical-success-600 to-medical-success-700',
      purple: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      orange: 'bg-gradient-to-r from-medical-warning-600 to-medical-error-600'
    };
    return gradients[this.gradient];
  }

  onActionClick(): void {
    if (this.actionButton?.action) {
      this.actionButton.action();
    }
  }
}