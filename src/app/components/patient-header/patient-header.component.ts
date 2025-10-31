import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, FileText, Plus, Edit, Activity, AlertTriangle, Phone, Mail, MapPin, Calendar } from 'lucide-angular';
import { PatientData } from '../../interfaces/patient.interface';

interface PatientStats {
  totalPrescriptions: number;
  activePrescriptions: number;
  medicalAlerts: number;
}

@Component({
  selector: 'app-patient-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div class="p-6">
        <!-- Header principal del paciente -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <!-- Información del paciente -->
          <div class="flex items-start gap-4">
            <!-- Avatar del paciente -->
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-lg">
                {{ getPatientInitials() }}
              </div>
            </div>

            <!-- Información básica -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-2xl font-bold text-gray-900 truncate">
                  {{ patient.fullName }}
                </h1>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [ngClass]="getStatusBadgeClass()">
                  {{ getStatusText() }}
                </span>
              </div>

              <!-- Información de contacto compacta -->
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div class="flex items-center gap-1">
                  <lucide-icon [img]="userIcon" class="w-4 h-4" aria-hidden="true"></lucide-icon>
                  <span>{{ patient.idType }} {{ patient.idNumber }}</span>
                </div>
                
                <div class="flex items-center gap-1" *ngIf="patient.phone">
                  <lucide-icon [img]="phoneIcon" class="w-4 h-4" aria-hidden="true"></lucide-icon>
                  <span>{{ patient.phone }}</span>
                </div>
                
                <div class="flex items-center gap-1" *ngIf="patient.email">
                  <lucide-icon [img]="mailIcon" class="w-4 h-4" aria-hidden="true"></lucide-icon>
                  <span>{{ patient.email }}</span>
                </div>
                
                <div class="flex items-center gap-1" *ngIf="patient.birthDate">
                  <lucide-icon [img]="calendarIcon" class="w-4 h-4" aria-hidden="true"></lucide-icon>
                  <span>{{ calculateAge() }} años</span>
                </div>
              </div>

              <!-- Alertas médicas importantes -->
              <div class="flex flex-wrap gap-2 mt-3" *ngIf="hasImportantAlerts()">
                <span *ngFor="let allergy of patient.allergies.slice(0, 2)" 
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                  <lucide-icon [img]="alertTriangleIcon" class="w-3 h-3 mr-1" aria-hidden="true"></lucide-icon>
                  Alergia: {{ allergy }}
                </span>
                <span *ngIf="patient.allergies.length > 2" 
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  +{{ patient.allergies.length - 2 }} alergias más
                </span>
              </div>
            </div>
          </div>

          <!-- Acciones principales -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              (click)="newPrescription.emit()"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              <lucide-icon [img]="plusIcon" class="w-4 h-4 mr-2" aria-hidden="true"></lucide-icon>
              Nueva Receta
            </button>
            
            <button 
              (click)="editPatient.emit()"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              <lucide-icon [img]="editIcon" class="w-4 h-4 mr-2" aria-hidden="true"></lucide-icon>
              Editar Paciente
            </button>
          </div>
        </div>

        <!-- Estadísticas del paciente -->
        <div *ngIf="showStats && stats" class="mt-6 pt-6 border-t border-gray-200">
          <div class="grid grid-cols-3 gap-6">
            <div class="text-center">
              <div class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                <lucide-icon [img]="fileTextIcon" class="w-6 h-6 text-blue-600" aria-hidden="true"></lucide-icon>
              </div>
              <div class="text-2xl font-semibold text-gray-900">{{ stats.totalPrescriptions }}</div>
              <div class="text-sm text-gray-600">Total Recetas</div>
            </div>
            
            <div class="text-center">
              <div class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                <lucide-icon [img]="activityIcon" class="w-6 h-6 text-green-600" aria-hidden="true"></lucide-icon>
              </div>
              <div class="text-2xl font-semibold text-gray-900">{{ stats.activePrescriptions }}</div>
              <div class="text-sm text-gray-600">Activas</div>
            </div>
            
            <div class="text-center">
              <div class="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-6 h-6 text-orange-600" aria-hidden="true"></lucide-icon>
              </div>
              <div class="text-2xl font-semibold text-gray-900">{{ stats.medicalAlerts }}</div>
              <div class="text-sm text-gray-600">Alertas Médicas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `]
})
export class PatientHeaderComponent {
  @Input() patient!: PatientData;
  @Input() avatarUrl?: string;
  @Input() showStats = false;
  @Input() stats?: PatientStats;

  @Output() newPrescription = new EventEmitter<void>();
  @Output() editPatient = new EventEmitter<void>();
  @Output() viewPrescriptions = new EventEmitter<void>();

  // Icons
  userIcon = User;
  fileTextIcon = FileText;
  plusIcon = Plus;
  editIcon = Edit;
  activityIcon = Activity;
  alertTriangleIcon = AlertTriangle;
  phoneIcon = Phone;
  mailIcon = Mail;
  mapPinIcon = MapPin;
  calendarIcon = Calendar;

  getPatientInitials(): string {
    if (!this.patient?.fullName) return 'P';
    
    const names = this.patient.fullName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  getStatusBadgeClass(): string {
    switch (this.patient?.status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(): string {
    switch (this.patient?.status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
  }

  calculateAge(): number {
    if (!this.patient?.birthDate) return 0;
    
    try {
      const today = new Date();
      const birth = new Date(this.patient.birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return 0;
    }
  }

  hasImportantAlerts(): boolean {
    return (this.patient?.allergies?.length || 0) > 0 || (this.patient?.chronicConditions?.length || 0) > 0;
  }
}