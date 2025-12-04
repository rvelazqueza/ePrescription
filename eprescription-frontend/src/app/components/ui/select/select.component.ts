import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule, ChevronDown, Check } from 'lucide-angular';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="relative">
      <button
        type="button"
        [disabled]="disabled"
        [class]="getSelectClasses()"
        (click)="toggleDropdown()"
        (blur)="onBlur()"
      >
        <span class="flex-1 text-left">
          {{ getDisplayValue() }}
        </span>
        <lucide-icon [img]="chevronDownIcon" class="h-4 w-4 opacity-50"></lucide-icon>
      </button>
      
      <div 
        *ngIf="isOpen" 
        class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
      >
        <div 
          *ngFor="let option of options"
          class="relative flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
          [class.bg-blue-50]="option.value === value"
          (click)="selectOption(option)"
        >
          <span class="flex-1">{{ option.label }}</span>
          <lucide-icon 
            *ngIf="option.value === value" 
            [img]="checkIcon" 
            class="h-4 w-4 text-blue-600"
          ></lucide-icon>
        </div>
        <div *ngIf="options.length === 0" class="px-3 py-2 text-sm text-gray-500">
          No hay opciones disponibles
        </div>
      </div>
    </div>
  `
})
export class SelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Seleccionar...';
  @Input() disabled = false;
  @Input() class = '';
  @Input() hasError = false;
  @Output() selectionChange = new EventEmitter<string>();

  value = '';
  isOpen = false;
  
  chevronDownIcon = ChevronDown;
  checkIcon = Check;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  toggleDropdown() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  selectOption(option: SelectOption) {
    this.value = option.value;
    this.isOpen = false;
    this.onChange(this.value);
    this.selectionChange.emit(this.value);
  }

  onBlur() {
    setTimeout(() => {
      this.isOpen = false;
      this.onTouched();
    }, 150);
  }

  getDisplayValue(): string {
    const selectedOption = this.options.find(opt => opt.value === this.value);
    return selectedOption ? selectedOption.label : this.placeholder;
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  getSelectClasses(): string {
    const baseClasses = 'flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50';
    
    const stateClasses = this.hasError 
      ? 'border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';

    return `${baseClasses} ${stateClasses} ${this.class}`;
  }
}