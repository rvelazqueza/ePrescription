import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, AlertTriangle, AlertCircle, CheckCircle, X, Info } from 'lucide-angular';
import { ValidationResult, ValidationError, ValidationWarning, PatientDataCompleteness } from '../../services/patient-validation.service';

@Component({
  selector: 'app-validation-alert',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <!-- Validation Errors -->
    <div *ngIf="validation && validation.errors.length > 0" 
         class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div class="flex items-start gap-3">
        <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"></lucide-icon>
        <div class="flex-1">
          <h4 class="text-red-900 font-semibold mb-2">
            {{ validation.errors.length === 1 ? 'Error crítico encontrado' : validation.errors.length + ' errores críticos encontrados' }}
          </h4>
          <ul class="space-y-1 text-sm text-red-800">
            <li *ngFor="let error of validation.errors" class="flex items-start gap-2">
              <div class="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                <strong>{{ getFieldDisplayName(error.field) }}:</strong> {{ error.message }}
              </span>
            </li>
          </ul>
        </div>
        <button 
          *ngIf="dismissible"
          (click)="onDismiss()"
          class="text-red-400 hover:text-red-600 transition-colors"
        >
          <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
        </button>
      </div>
    </div>

    <!-- Validation Warnings -->
    <div *ngIf="validation && validation.warnings.length > 0 && showWarnings" 
         class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div class="flex items-start gap-3">
        <lucide-icon [img]="alertCircleIcon" class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"></lucide-icon>
        <div class="flex-1">
          <h4 class="text-yellow-900 font-semibold mb-2">
            {{ validation.warnings.length === 1 ? 'Advertencia' : validation.warnings.length + ' advertencias' }}
          </h4>
          <ul class="space-y-2 text-sm text-yellow-800">
            <li *ngFor="let warning of validation.warnings" class="space-y-1">
              <div class="flex items-start gap-2">
                <div class="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  <strong>{{ getFieldDisplayName(warning.field) }}:</strong> {{ warning.message }}
                </span>
              </div>
              <div *ngIf="warning.suggestion" class="ml-3.5 text-xs text-yellow-700 italic">
                💡 {{ warning.suggestion }}
              </div>
            </li>
          </ul>
        </div>
        <button 
          *ngIf="dismissible"
          (click)="onDismissWarnings()"
          class="text-yellow-400 hover:text-yellow-600 transition-colors"
        >
          <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
        </button>
      </div>
    </div>

    <!-- Success State -->
    <div *ngIf="validation && validation.isValid && validation.warnings.length === 0 && showSuccess" 
         class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <div class="flex items-center gap-3">
        <lucide-icon [img]="checkCircleIcon" class="w-5 h-5 text-green-600"></lucide-icon>
        <div class="flex-1">
          <h4 class="text-green-900 font-semibold">Datos válidos</h4>
          <p class="text-sm text-green-800">Toda la información del paciente está completa y es válida.</p>
        </div>
        <button 
          *ngIf="dismissible"
          (click)="onDismiss()"
          class="text-green-400 hover:text-green-600 transition-colors"
        >
          <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
        </button>
      </div>
    </div>

    <!-- Data Completeness -->
    <div *ngIf="completeness && showCompleteness" 
         class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div class="flex items-start gap-3">
        <lucide-icon [img]="infoIcon" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"></lucide-icon>
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-blue-900 font-semibold">Completitud de datos</h4>
            <span class="text-sm font-medium text-blue-800">{{ completeness.completionPercentage }}%</span>
          </div>
          
          <!-- Progress bar -->
          <div class="w-full bg-blue-200 rounded-full h-2 mb-3">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              [style.width.%]="completeness.completionPercentage"
            ></div>
          </div>

          <!-- Critical missing fields -->
          <div *ngIf="completeness.criticalMissing.length > 0" class="mb-3">
            <p class="text-sm font-medium text-red-800 mb-1">Campos críticos faltantes:</p>
            <div class="flex flex-wrap gap-1">
              <span 
                *ngFor="let field of completeness.criticalMissing" 
                class="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded border border-red-300"
              >
                {{ getFieldDisplayName(field) }}
              </span>
            </div>
          </div>

          <!-- Recommended missing fields -->
          <div *ngIf="completeness.recommendedFields.length > 0 && showRecommended">
            <p class="text-sm font-medium text-blue-800 mb-1">Campos recomendados:</p>
            <div class="flex flex-wrap gap-1">
              <span 
                *ngFor="let field of completeness.recommendedFields" 
                class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded border border-blue-300"
              >
                {{ getFieldDisplayName(field) }}
              </span>
            </div>
          </div>

          <!-- Action button -->
          <div *ngIf="completeness.completionPercentage < 100 && showCompleteAction" class="mt-3">
            <button 
              (click)="onCompleteData()"
              class="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
            >
              Completar información
            </button>
          </div>
        </div>
        <button 
          *ngIf="dismissible"
          (click)="onDismissCompleteness()"
          class="text-blue-400 hover:text-blue-600 transition-colors"
        >
          <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
        </button>
      </div>
    </div>

    <!-- Compact Summary -->
    <div *ngIf="compact && (validation || completeness)" 
         class="flex items-center gap-2 text-sm">
      <!-- Validation status -->
      <div *ngIf="validation" class="flex items-center gap-1">
        <lucide-icon 
          [img]="validation.isValid ? checkCircleIcon : (validation.errors.length > 0 ? alertTriangleIcon : alertCircleIcon)"
          class="w-4 h-4"
          [ngClass]="{
            'text-green-600': validation.isValid && validation.warnings.length === 0,
            'text-red-600': validation.errors.length > 0,
            'text-yellow-600': validation.errors.length === 0 && validation.warnings.length > 0
          }"
        ></lucide-icon>
        <span 
          [ngClass]="{
            'text-green-800': validation.isValid && validation.warnings.length === 0,
            'text-red-800': validation.errors.length > 0,
            'text-yellow-800': validation.errors.length === 0 && validation.warnings.length > 0
          }"
        >
          {{ getValidationSummary() }}
        </span>
      </div>

      <!-- Completeness status -->
      <div *ngIf="completeness" class="flex items-center gap-1 text-blue-800">
        <lucide-icon [img]="infoIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
        <span>{{ completeness.completionPercentage }}% completo</span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ValidationAlertComponent {
  @Input() validation?: ValidationResult;
  @Input() completeness?: PatientDataCompleteness;
  @Input() showWarnings: boolean = true;
  @Input() showSuccess: boolean = false;
  @Input() showCompleteness: boolean = true;
  @Input() showRecommended: boolean = true;
  @Input() showCompleteAction: boolean = true;
  @Input() dismissible: boolean = false;
  @Input() compact: boolean = false;

  @Output() dismiss = new EventEmitter<void>();
  @Output() dismissWarnings = new EventEmitter<void>();
  @Output() dismissCompleteness = new EventEmitter<void>();
  @Output() completeData = new EventEmitter<void>();

  // Icons
  alertTriangleIcon = AlertTriangle;
  alertCircleIcon = AlertCircle;
  checkCircleIcon = CheckCircle;
  xIcon = X;
  infoIcon = Info;

  onDismiss(): void {
    this.dismiss.emit();
  }

  onDismissWarnings(): void {
    this.dismissWarnings.emit();
  }

  onDismissCompleteness(): void {
    this.dismissCompleteness.emit();
  }

  onCompleteData(): void {
    this.completeData.emit();
  }

  getFieldDisplayName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      'fullName': 'Nombre completo',
      'idNumber': 'Número de identificación',
      'idType': 'Tipo de identificación',
      'birthDate': 'Fecha de nacimiento',
      'gender': 'Género',
      'phone': 'Teléfono',
      'email': 'Correo electrónico',
      'address': 'Dirección',
      'city': 'Ciudad',
      'bloodType': 'Tipo de sangre',
      'allergies': 'Alergias',
      'chronicConditions': 'Condiciones crónicas',
      'currentMedications': 'Medicamentos actuales',
      'emergencyContact': 'Contacto de emergencia',
      'insuranceProvider': 'Proveedor de seguro',
      'insuranceNumber': 'Número de seguro'
    };

    return fieldNames[field] || field;
  }

  getValidationSummary(): string {
    if (!this.validation) return '';

    if (this.validation.isValid && this.validation.warnings.length === 0) {
      return 'Datos válidos';
    }

    const parts: string[] = [];
    
    if (this.validation.errors.length > 0) {
      parts.push(`${this.validation.errors.length} error(es)`);
    }
    
    if (this.validation.warnings.length > 0) {
      parts.push(`${this.validation.warnings.length} advertencia(s)`);
    }

    return parts.join(', ');
  }
}