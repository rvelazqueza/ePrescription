import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getAlertClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class AlertComponent {
  @Input() variant: 'default' | 'destructive' | 'success' = 'default';
  @Input() class?: string;

  getAlertClasses(): string {
    const baseClasses = 'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground';
    
    const variantClasses = {
      default: 'bg-background text-foreground',
      destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      success: 'border-green-500/50 text-green-700 bg-green-50 [&>svg]:text-green-600'
    };

    return `${baseClasses} ${variantClasses[this.variant]} ${this.class || ''}`;
  }
}

@Component({
  selector: 'app-alert-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'text-sm [&_p]:leading-relaxed ' + (class || '')">
      <ng-content></ng-content>
    </div>
  `
})
export class AlertDescriptionComponent {
  @Input() class?: string;
}