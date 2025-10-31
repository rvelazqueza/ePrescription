import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  template: `
    <textarea
      [placeholder]="placeholder"
      [disabled]="disabled"
      [rows]="rows"
      [class]="getTextareaClasses()"
      [value]="value"
      (input)="onInput($event)"
      (blur)="onBlur()"
    ></textarea>
  `
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() rows = 3;
  @Input() class = '';
  @Input() hasError = false;

  value = '';
  
  private onChange = (value: string) => {};
  private onTouched = () => {};

  onInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur() {
    this.onTouched();
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

  getTextareaClasses(): string {
    const baseClasses = 'flex min-h-[60px] w-full rounded-md border px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 resize-none';
    
    const stateClasses = this.hasError 
      ? 'border-red-500 focus-visible:ring-red-500' 
      : 'border-gray-300 focus-visible:ring-blue-500 focus-visible:border-blue-500';

    return `${baseClasses} ${stateClasses} ${this.class}`;
  }
}