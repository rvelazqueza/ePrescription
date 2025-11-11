import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, UserPlus, RotateCcw, Calendar, Phone, Mail, MapPin, Heart, AlertTriangle, Pill } from 'lucide-angular';
import { PatientData } from '../../interfaces/patient.interface';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-patient-selection-section',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <!-- Estado vacío cuando no hay paciente seleccionado -->
    <div *ngIf="!selectedPatient" class="bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-4 sm:p-6 mb-6 transition-all duration-200 hover:bg-blue-55">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mx-auto sm:mx-0">
            <lucide-icon [img]="userIcon" class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"></lucide-icon>
          </div>
          <div class="min-w-0 flex-1 text-center sm:text-left">
            <h3 class="text-base sm:text-lg font-semibold text-blue-900 mb-1">Seleccione un paciente</h3>
            <p class="text-xs sm:text-sm text-blue-700 leading-relaxed">Debe seleccionar un paciente antes de poder prescribir medicamentos</p>
          </div>
        </div>
        <button 
          type="button"
          class="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md w-full sm:w-auto whitespace-nowrap text-sm sm:text-base"
          (click)="onSelectPatient()"
        >
          <lucide-icon [img]="userPlusIcon" class="w-4 h-4"></lucide-icon>
          <span class="hidden xs:inline">Seleccionar Paciente</span>
          <span class="xs:hidden">Seleccionar</span>
        </button>
      </div>
    </div>

    <!-- Información del paciente seleccionado -->
    <div *ngIf="selectedPatient" class="space-y-4 mb-6">
      <!-- Tarjeta principal del paciente con borde verde -->
      <div class="bg-white border-l-4 border-green-500 rounded-lg p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <lucide-icon [img]="userIcon" class="w-5 h-5 text-green-600"></lucide-icon>
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-medium text-gray-600">Paciente seleccionado:</span>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  <div class="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Activo
                </span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">{{ selectedPatient.fullName }}</h3>
              <p class="text-sm text-gray-600">
                {{ selectedPatient.idType }} {{ selectedPatient.idNumber }} • {{ selectedPatient.age }} años • Tipo de sangre: {{ selectedPatient.bloodType || 'O+' }}
              </p>
            </div>
          </div>
          <button 
            type="button"
            class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium"
            (click)="onChangePatient()"
          >
            Cambiar paciente
          </button>
        </div>
      </div>

      <!-- Alertas médicas del paciente con borde rojo -->
      <div *ngIf="hasPatientAlerts()" class="bg-white border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-red-600"></lucide-icon>
          <h4 class="text-base font-semibold text-red-900">Alertas médicas del paciente</h4>
        </div>
        
        <div class="space-y-4">
          <!-- Alergias conocidas -->
          <div *ngIf="selectedPatient.allergies.length > 0">
            <div class="flex items-center gap-2 mb-2">
              <lucide-icon [img]="alertTriangleIcon" class="w-4 h-4 text-orange-600"></lucide-icon>
              <h5 class="text-sm font-medium text-orange-900">Alergias conocidas:</h5>
            </div>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let allergy of selectedPatient.allergies" 
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                {{ allergy }}
              </span>
            </div>
          </div>
          
          <!-- Condiciones crónicas -->
          <div *ngIf="selectedPatient.chronicConditions.length > 0">
            <div class="flex items-center gap-2 mb-2">
              <lucide-icon [img]="heartIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
              <h5 class="text-sm font-medium text-blue-900">Condiciones crónicas:</h5>
            </div>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let condition of selectedPatient.chronicConditions" 
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                {{ condition }}
              </span>
            </div>
          </div>
          
          <!-- Medicación actual -->
          <div *ngIf="selectedPatient.currentMedications.length > 0">
            <div class="flex items-center gap-2 mb-2">
              <lucide-icon [img]="pillIcon" class="w-4 h-4 text-purple-600"></lucide-icon>
              <h5 class="text-sm font-medium text-purple-900">Medicación actual:</h5>
            </div>
            <div class="flex flex-wrap gap-2">
              <span *ngFor="let medication of selectedPatient.currentMedications" 
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                {{ medication }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./patient-selection-section.component.css']
})
export class PatientSelectionSectionComponent implements OnChanges {
  @Input() selectedPatient: PatientData | null = null;
  @Output() selectPatient = new EventEmitter<void>();
  @Output() changePatient = new EventEmitter<void>();

  private previousPatient: PatientData | null = null;

  // Icons
  userIcon = User;
  userPlusIcon = UserPlus;
  rotateCcwIcon = RotateCcw;
  calendarIcon = Calendar;
  phoneIcon = Phone;
  mailIcon = Mail;
  mapPinIcon = MapPin;
  heartIcon = Heart;
  alertTriangleIcon = AlertTriangle;
  pillIcon = Pill;

  constructor(private notificationService: NotificationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPatient']) {
      const currentPatient = changes['selectedPatient'].currentValue;
      const previousPatient = changes['selectedPatient'].previousValue;

      // Show success notification when a patient is selected
      if (currentPatient && !previousPatient) {
        this.notificationService.showPatientSelected(currentPatient.fullName);
        this.checkPatientDataCompleteness(currentPatient);
      }
      // Show notification when patient is changed
      else if (currentPatient && previousPatient && currentPatient.id !== previousPatient.id) {
        this.notificationService.showSuccess(
          `Paciente cambiado a "${currentPatient.fullName}"`,
          'Paciente Actualizado'
        );
        this.checkPatientDataCompleteness(currentPatient);
      }

      this.previousPatient = currentPatient;
    }
  }

  onSelectPatient(): void {
    this.selectPatient.emit();
  }

  onChangePatient(): void {
    this.changePatient.emit();
  }

  private checkPatientDataCompleteness(patient: PatientData): void {
    // Check if patient is inactive
    if (patient.status === 'inactive') {
      this.notificationService.showInactivePatientWarning(patient.fullName);
      return;
    }

    // Check for missing required fields
    const requiredFields = [
      { key: 'phone', label: 'Teléfono' },
      { key: 'email', label: 'Correo electrónico' },
      { key: 'address', label: 'Dirección' },
      { key: 'insuranceProvider', label: 'Proveedor de seguro' }
    ];

    const missingFields = requiredFields
      .filter(field => {
        const value = patient[field.key as keyof PatientData];
        return !value || String(value).trim() === '';
      })
      .map(field => field.label);

    if (missingFields.length > 0) {
      this.notificationService.showIncompleteDataWarning(missingFields);
    }
  }

  hasPatientAlerts(): boolean {
    if (!this.selectedPatient) return false;
    
    return this.selectedPatient.allergies.length > 0 || 
           this.selectedPatient.chronicConditions.length > 0 || 
           (this.selectedPatient.currentMedications && this.selectedPatient.currentMedications.length > 0);
  }
}