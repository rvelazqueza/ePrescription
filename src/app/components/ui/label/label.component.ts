import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label [class]="getLabelClasses()">
      <ng-content></ng-content>
    </label>
  `
})
export class LabelComponent {
  @Input() class = '';

  getLabelClasses(): string {
    const baseClasses = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';
    return `${baseClasses} ${this.class}`;
  }
}