import { Component, Input, Output, EventEmitter, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" (click)="onOverlayClick($event)">
      <div 
        #dialogContent
        class="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
        [class]="contentClass"
        (click)="$event.stopPropagation()"
      >
        <ng-content></ng-content>
        <button 
          *ngIf="showCloseButton"
          (click)="onClose()"
          class="absolute top-4 right-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          <lucide-icon [img]="xIcon" class="h-4 w-4"></lucide-icon>
          <span class="sr-only">Cerrar</span>
        </button>
      </div>
    </div>
  `
})
export class DialogComponent {
  @Input() set open(value: boolean) {
    console.log('DialogComponent - open property changed to:', value);
    this._open = value;
  }
  get open(): boolean {
    return this._open;
  }
  private _open = false;
  
  @Input() contentClass = '';
  @Input() showCloseButton = true;
  @Output() openChange = new EventEmitter<boolean>();

  xIcon = X;

  onClose() {
    this.openChange.emit(false);
  }

  onOverlayClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}

@Component({
  selector: 'app-dialog-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-2 text-center sm:text-left p-6 pb-0">
      <ng-content></ng-content>
    </div>
  `
})
export class DialogHeaderComponent {}

@Component({
  selector: 'app-dialog-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-lg font-semibold leading-none">
      <ng-content></ng-content>
    </h2>
  `
})
export class DialogTitleComponent {}

@Component({
  selector: 'app-dialog-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <ng-content></ng-content>
    </div>
  `
})
export class DialogContentComponent {}

@Component({
  selector: 'app-dialog-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end p-6 pt-0">
      <ng-content></ng-content>
    </div>
  `
})
export class DialogFooterComponent {}