import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, AlertTriangle, Info, Pill, Calendar, User, Phone } from 'lucide-angular';
import { Subscription } from 'rxjs';

import { ButtonComponent } from '../ui/button/button.component';
import { ErrorMessageComponent } from '../ui/error-message/error-message.component';
import { PatientService } from '../../services/patient.service';
import { RecentPatient } from '../../interfaces/patient.interface';

@Component({
  selector: 'app-recent-patients-tab',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ButtonComponent,
    ErrorMessageComponent
  ],
  template: `
    <div class="space-y-4">
      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-500">Cargando pacientes recientes...</p>
      </div>

      <!-- Error State -->
      <app-error-message
        *ngIf="error && !isLoading"
        [message]="error"
        title="Error al cargar pacientes"
        type="error"
        actionText="Reintentar"
        [actionHandler]="loadRecentPatients.bind(this)"
        [dismissible]="true"
      ></app-error-message>

      <!-- Recent Patients List -->
      <div *ngIf="!isLoading && !error && recentPatients.length > 0" class="space-y-4">
        <div 
          *ngFor="let patient of recentPatients; trackBy: trackByPatientId"
          class="bg-white border-l-4 border-l-red-500 rounded-xl p-5 hover:shadow-lg transition-all duration-200 cursor-pointer group border border-gray-100 hover:border-gray-200"
        >
          <div class="flex items-start justify-between">
            <!-- Patient Info -->
            <div class="flex-1 min-w-0">
              <!-- Patient Header -->
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <lucide-icon [img]="userIcon" class="w-5 h-5 text-pink-600"></lucide-icon>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-lg font-semibold text-gray-900">{{ patient.fullName }}</h3>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      <lucide-icon [img]="calendarIcon" class="w-3 h-3 mr-1"></lucide-icon>
                      Reciente
                    </span>
                  </div>
                  <div class="flex items-center gap-4 text-sm text-gray-600">
                    <span class="flex items-center gap-1">
                      <span class="font-medium">{{ patient.idType }}</span>
                      {{ patient.idNumber }}
                    </span>
                    <span class="flex items-center gap-1">
                      <lucide-icon [img]="calendarIcon" class="w-3 h-3"></lucide-icon>
                      {{ patient.age }} años
                    </span>
                    <span class="flex items-center gap-1">
                      <span>{{ patient.gender === 'M' ? '♂' : '♀' }}</span>
                      {{ patient.gender === 'M' ? 'Masculino' : 'Femenino' }}
                    </span>
                    <span class="flex items-center gap-1" *ngIf="patient.bloodType">
                      <span class="text-red-600">🩸</span>
                      {{ patient.bloodType }}
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Contact Info -->
              <div class="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div class="flex items-center gap-1" *ngIf="patient.phone">
                  <lucide-icon [img]="phoneIcon" class="w-4 h-4 text-green-600"></lucide-icon>
                  <span>{{ patient.phone }}</span>
                </div>
                <div class="flex items-center gap-1" *ngIf="patient.city">
                  <span>📍</span>
                  <span>{{ patient.city }}</span>
                </div>
              </div>

              <!-- Medical Alerts -->
              <div class="space-y-3" *ngIf="hasAnyAlerts(patient)">
                <!-- Allergies -->
                <div *ngIf="patient.allergies.length > 0" class="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div class="flex items-center gap-2 mb-2">
                    <lucide-icon [img]="alertIcon" class="w-4 h-4 text-red-600"></lucide-icon>
                    <span class="text-sm font-medium text-red-800">Alergias:</span>
                  </div>
                  <p class="text-sm text-red-700">{{ patient.allergies.join(', ') }}</p>
                </div>

                <!-- Chronic Conditions -->
                <div *ngIf="patient.chronicConditions.length > 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div class="flex items-center gap-2 mb-2">
                    <lucide-icon [img]="infoIcon" class="w-4 h-4 text-yellow-600"></lucide-icon>
                    <span class="text-sm font-medium text-yellow-800">Condiciones:</span>
                  </div>
                  <p class="text-sm text-yellow-700">{{ patient.chronicConditions.join(', ') }}</p>
                </div>
              </div>

              <!-- Current Medications -->
              <div *ngIf="patient.currentMedications.length > 0" class="mt-3">
                <div class="flex items-center gap-2 text-sm text-blue-700">
                  <lucide-icon [img]="pillIcon" class="w-4 h-4"></lucide-icon>
                  <span class="font-medium">{{ patient.currentMedications.length }} medicamento(s) activo(s)</span>
                </div>
              </div>
            </div>

            <!-- Select Button -->
            <div class="flex-shrink-0 ml-4">
              <button 
                type="button"
                (click)="selectPatient(patient)"
                class="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
              >
                Seleccionar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && !error && recentPatients.length === 0" class="text-center py-8">
        <lucide-icon [img]="userIcon" class="w-12 h-12 text-gray-400 mx-auto mb-4"></lucide-icon>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay pacientes recientes</h3>
        <p class="text-gray-500">Los pacientes atendidos recientemente aparecerán aquí</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class RecentPatientsTabComponent implements OnInit, OnDestroy {
  @Output() patientSelected = new EventEmitter<RecentPatient>();

  recentPatients: RecentPatient[] = [];
  isLoading = false;
  error: string | null = null;
  
  private subscriptions = new Subscription();

  // Icons
  userIcon = User;
  alertIcon = AlertTriangle;
  infoIcon = Info;
  pillIcon = Pill;
  calendarIcon = Calendar;
  phoneIcon = Phone;

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.loadRecentPatients();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadRecentPatients() {
    this.isLoading = true;
    this.error = null;

    const subscription = this.patientService.getRecentPatients().subscribe({
      next: (patients) => {
        this.recentPatients = patients;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading recent patients:', error);
        this.error = 'No se pudieron cargar los pacientes recientes. Por favor, inténtelo de nuevo.';
        this.isLoading = false;
      }
    });

    this.subscriptions.add(subscription);
  }

  selectPatient(patient: RecentPatient) {
    this.patientSelected.emit(patient);
  }

  trackByPatientId(_index: number, patient: RecentPatient): string {
    return patient.id;
  }

  hasAnyAlerts(patient: RecentPatient): boolean {
    return patient.allergies.length > 0 || 
           patient.chronicConditions.length > 0 || 
           patient.currentMedications.length > 0;
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        return 'Ayer';
      } else if (diffDays <= 7) {
        return `Hace ${diffDays} días`;
      } else if (diffDays <= 30) {
        const weeks = Math.floor(diffDays / 7);
        return `Hace ${weeks} semana${weeks !== 1 ? 's' : ''}`;
      } else {
        return date.toLocaleDateString('es-CO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    } catch (error) {
      return dateString;
    }
  }
}