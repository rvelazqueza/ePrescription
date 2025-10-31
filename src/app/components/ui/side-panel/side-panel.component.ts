import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <!-- Overlay -->
    <div 
      *ngIf="open" 
      class="fixed inset-0 z-50 bg-black/50 transition-opacity"
      (click)="onOverlayClick()"
    ></div>

    <!-- Panel -->
    <div 
      *ngIf="open"
      class="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl transition-transform transform"
      [class.translate-x-0]="open"
      [class.translate-x-full]="!open"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
          <p *ngIf="description" class="text-sm text-gray-600 mt-1">{{ description }}</p>
        </div>
        <button 
          (click)="onClose()"
          class="rounded-md p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <lucide-icon [img]="xIcon" class="w-5 h-5 text-gray-400"></lucide-icon>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <ng-content></ng-content>
      </div>

      <!-- Footer -->
      <div *ngIf="showFooter" class="border-t border-gray-200 p-6">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `
})
export class SidePanelComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() description = '';
  @Input() showFooter = false;
  @Output() openChange = new EventEmitter<boolean>();

  xIcon = X;

  onClose() {
    this.openChange.emit(false);
  }

  onOverlayClick() {
    this.onClose();
  }
}