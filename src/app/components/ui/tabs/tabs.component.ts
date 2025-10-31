import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="class || ''">
      <ng-content></ng-content>
    </div>
  `
})
export class TabsComponent {
  @Input() value?: string;
  @Input() class?: string;
  @Output() valueChange = new EventEmitter<string>();

  onValueChange(newValue: string): void {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }
}

@Component({
  selector: 'app-tabs-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ' + (class || '')">
      <ng-content></ng-content>
    </div>
  `
})
export class TabsListComponent {
  @Input() class?: string;
}

@Component({
  selector: 'app-tabs-trigger',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      [class]="getTriggerClasses()"
      (click)="onClick()"
      [disabled]="disabled"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class TabsTriggerComponent {
  @Input() value!: string;
  @Input() disabled = false;
  @Input() class?: string;
  @Input() isActive = false;

  getTriggerClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    const activeClasses = this.isActive ? 'bg-background text-foreground shadow-sm' : 'hover:bg-background/80';
    return `${baseClasses} ${activeClasses} ${this.class || ''}`;
  }

  onClick(): void {
    // This will be handled by parent component
  }
}

@Component({
  selector: 'app-tabs-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="isActive"
      [class]="'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' + (class || '')"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class TabsContentComponent {
  @Input() value!: string;
  @Input() isActive = false;
  @Input() class?: string;
}