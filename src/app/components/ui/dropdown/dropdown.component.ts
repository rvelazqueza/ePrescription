import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block text-left">
      <div>
        <button
          type="button"
          (click)="toggleDropdown()"
          [class]="triggerClass"
          [attr.aria-expanded]="isOpen"
          aria-haspopup="true"
        >
          <ng-content select="[slot=trigger]"></ng-content>
        </button>
      </div>

      <div
        *ngIf="isOpen"
        class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
        role="menu"
        aria-orientation="vertical"
      >
        <div class="py-1" role="none">
          <ng-content select="[slot=content]"></ng-content>
        </div>
      </div>
    </div>
  `
})
export class DropdownComponent {
  @Input() triggerClass = '';
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  constructor(private elementRef: ElementRef) {}

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
}

@Component({
  selector: 'app-dropdown-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      [class]="'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ' + (class || '')"
      role="menuitem"
      (click)="onClick()"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class DropdownItemComponent {
  @Input() class?: string;
  @Output() click = new EventEmitter<void>();

  onClick(): void {
    this.click.emit();
  }
}