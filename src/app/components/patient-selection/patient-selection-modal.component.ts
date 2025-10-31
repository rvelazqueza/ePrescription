import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users, Search, Plus, X } from 'lucide-angular';
import { Subscription } from 'rxjs';

import { DialogComponent, DialogHeaderComponent, DialogTitleComponent, DialogContentComponent, DialogFooterComponent } from '../ui/dialog/dialog.component';
import { TabsComponent, TabsListComponent, TabsTriggerComponent, TabsContentComponent } from '../ui/tabs/tabs.component';
import { ButtonComponent } from '../ui/button/button.component';
import { NewPatientDialogComponent } from '../new-patient-dialog/new-patient-dialog.component';
import { PatientData } from '../../interfaces/patient.interface';
import { PatientService } from '../../services/patient.service';
import { NotificationService } from '../../services/notification.service';
import { RecentPatientsTabComponent } from './recent-patients-tab.component';
import { AdvancedSearchTabComponent } from './advanced-search-tab.component';
import { RecentPatient, PatientData as InterfacePatientData } from '../../interfaces/patient.interface';

@Component({
  selector: 'app-patient-selection-modal',
  standalone: true,
  styleUrls: ['./patient-selection-modal.component.css'],
  imports: [
    CommonModule,
    LucideAngularModule,
    DialogComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogContentComponent,
    DialogFooterComponent,
    TabsComponent,
    TabsListComponent,
    TabsTriggerComponent,
    TabsContentComponent,
    ButtonComponent,
    NewPatientDialogComponent,
    RecentPatientsTabComponent,
    AdvancedSearchTabComponent
  ],
  template: `
    <app-dialog [open]="isOpen" (openChange)="onOpenChange($event)" contentClass="w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
      <!-- Header fijo -->
      <app-dialog-header class="border-b border-gray-200 pb-4 px-6 flex-shrink-0">
        <app-dialog-title>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <lucide-icon [img]="usersIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900">Seleccionar Paciente</h2>
              <p class="text-sm text-gray-600 mt-1">Busque y seleccione el paciente para crear la prescripción médica</p>
            </div>
          </div>
        </app-dialog-title>
      </app-dialog-header>
      
      <!-- Contenido con scroll -->
      <div class="flex-1 flex flex-col min-h-0">
        <!-- Tabs Navigation - fijo -->
        <div class="px-6 pt-4 flex-shrink-0">
          <div class="flex border-b border-gray-200">
            <button 
              type="button"
              (click)="setActiveTab('recent')"
              class="tab-button flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 border-b-2 flex-1"
              [class.border-blue-500]="activeTab === 'recent'"
              [class.text-blue-600]="activeTab === 'recent'"
              [class.bg-blue-50]="activeTab === 'recent'"
              [class.border-transparent]="activeTab !== 'recent'"
              [class.text-gray-500]="activeTab !== 'recent'"
              [class.hover:text-gray-700]="activeTab !== 'recent'"
              [class.hover:border-gray-300]="activeTab !== 'recent'"
            >
              <lucide-icon [img]="usersIcon" class="w-4 h-4"></lucide-icon>
              <span>Pacientes Recientes ({{ recentPatientsCount }})</span>
            </button>
            <button 
              type="button"
              (click)="setActiveTab('search')"
              class="tab-button flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 border-b-2 flex-1"
              [class.border-blue-500]="activeTab === 'search'"
              [class.text-blue-600]="activeTab === 'search'"
              [class.bg-blue-50]="activeTab === 'search'"
              [class.border-transparent]="activeTab !== 'search'"
              [class.text-gray-500]="activeTab !== 'search'"
              [class.hover:text-gray-700]="activeTab !== 'search'"
              [class.hover:border-gray-300]="activeTab !== 'search'"
            >
              <lucide-icon [img]="searchIcon" class="w-4 h-4"></lucide-icon>
              <span>Búsqueda Avanzada</span>
            </button>
          </div>
        </div>

        <!-- Tab Content Container con scroll -->
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <!-- Info message -->
          <div *ngIf="activeTab === 'recent'" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <lucide-icon [img]="usersIcon" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"></lucide-icon>
            <div class="text-sm text-blue-800">
              <p class="font-medium">Estos son los pacientes que ha atendido recientemente. Haga clic para seleccionar.</p>
            </div>
          </div>

          <!-- Recent Patients Tab Content -->
          <div *ngIf="activeTab === 'recent'">
            <app-recent-patients-tab
              (patientSelected)="onRecentPatientSelected($event)"
            ></app-recent-patients-tab>
          </div>

          <!-- Advanced Search Tab Content -->
          <div *ngIf="activeTab === 'search'">
            <app-advanced-search-tab
              (patientSelected)="onSearchPatientSelected($event)"
            ></app-advanced-search-tab>
          </div>
        </div>
      </div>

      <!-- Footer fijo -->
      <app-dialog-footer class="border-t border-gray-200 bg-gray-50 px-6 py-4 flex-shrink-0">
        <div class="flex justify-between items-center w-full">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <lucide-icon [img]="usersIcon" class="w-4 h-4"></lucide-icon>
            <span>{{ totalPatients }} pacientes registrados en el sistema</span>
          </div>
          <div class="flex gap-3">
            <button 
              type="button"
              (click)="onCancel()"
              class="px-6 py-2.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
            >
              Cancelar
            </button>
            <button 
              type="button"
              (click)="onNewPatient()"
              class="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
              Nuevo Paciente
            </button>
          </div>
        </div>
      </app-dialog-footer>
    </app-dialog>

    <!-- New Patient Dialog -->
    <app-new-patient-dialog
      [open]="showNewPatientDialog"
      (openChange)="onNewPatientDialogChange($event)"
      (patientCreated)="onPatientCreated($event)"
    ></app-new-patient-dialog>
  `
})
export class PatientSelectionModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() patientSelected = new EventEmitter<PatientData>();
  @Output() newPatientRequested = new EventEmitter<void>();

  activeTab = 'recent';
  showNewPatientDialog = false;
  totalPatients = 0;
  recentPatientsCount = 3; // Número mostrado en la imagen
  
  private subscriptions = new Subscription();

  // Icons
  usersIcon = Users;
  searchIcon = Search;
  plusIcon = Plus;
  xIcon = X;

  constructor(
    private patientService: PatientService,
    private notificationService: NotificationService
  ) {}

  onOpenChange(open: boolean) {
    if (!open) {
      this.closeModal.emit();
    }
  }

  onTabChange(tab: string) {
    this.activeTab = tab;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  ngOnInit() {
    this.loadPatientCount();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadPatientCount() {
    // Load total patient count from service
    const countSub = this.patientService.getRecentPatients().subscribe({
      next: (patients) => {
        this.totalPatients = patients.length;
      },
      error: (error) => {
        console.error('Error loading patient count:', error);
        this.totalPatients = 0;
        this.notificationService.showLoadingError('del conteo de pacientes');
      }
    });
    this.subscriptions.add(countSub);
  }

  onNewPatient() {
    this.showNewPatientDialog = true;
  }

  onNewPatientDialogChange(open: boolean) {
    this.showNewPatientDialog = open;
  }

  onPatientCreated(patient: PatientData) {
    // Close the new patient dialog
    this.showNewPatientDialog = false;
    
    // Show success notification
    this.notificationService.showSuccess(
      `Paciente "${patient.fullName}" creado y seleccionado correctamente`,
      'Nuevo Paciente Creado'
    );
    
    // Automatically select the newly created patient
    this.patientSelected.emit(patient);
    
    // Close the main modal
    this.closeModal.emit();
    
    // Refresh patient count
    this.loadPatientCount();
  }

  onCancel() {
    this.closeModal.emit();
  }

  onRecentPatientSelected(patient: RecentPatient) {
    // Convert RecentPatient to PatientData by extracting base properties
    const patientData: PatientData = {
      id: patient.id,
      fullName: patient.fullName,
      firstName: patient.firstName,
      secondName: patient.secondName,
      firstLastName: patient.firstLastName,
      secondLastName: patient.secondLastName,
      idType: patient.idType,
      idNumber: patient.idNumber,
      birthDate: patient.birthDate,
      age: patient.age,
      gender: patient.gender,
      bloodType: patient.bloodType,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      city: patient.city,
      country: patient.country,
      occupation: patient.occupation,
      weight: patient.weight,
      height: patient.height,
      bmi: patient.bmi,
      insuranceProvider: patient.insuranceProvider,
      insuranceNumber: patient.insuranceNumber,
      insuranceType: patient.insuranceType,
      allergies: patient.allergies || [],
      chronicConditions: patient.chronicConditions || [],
      currentMedications: patient.currentMedications || [],
      clinicalNotes: patient.clinicalNotes,
      emergencyContact: patient.emergencyContact || {
        name: '',
        relationship: '',
        phone: ''
      },
      registrationDate: patient.registrationDate,
      status: patient.status
    };
    
    this.patientSelected.emit(patientData);
    this.closeModal.emit();
  }

  onSearchPatientSelected(patient: InterfacePatientData) {
    // Convert InterfacePatientData to NewPatientDialog PatientData
    const convertedPatient: PatientData = {
      id: patient.id,
      idType: patient.idType,
      idNumber: patient.idNumber,
      firstName: patient.firstName,
      secondName: patient.secondName,
      firstLastName: patient.firstLastName,
      secondLastName: patient.secondLastName,
      fullName: patient.fullName,
      birthDate: patient.birthDate,
      age: patient.age,
      gender: patient.gender,
      bloodType: patient.bloodType,
      occupation: patient.occupation,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      city: patient.city,
      country: patient.country,
      weight: patient.weight,
      height: patient.height,
      bmi: patient.bmi,
      allergies: patient.allergies || [],
      chronicConditions: patient.chronicConditions || [],
      currentMedications: patient.currentMedications || [],
      clinicalNotes: patient.clinicalNotes,
      insuranceProvider: patient.insuranceProvider,
      insuranceNumber: patient.insuranceNumber,
      insuranceType: patient.insuranceType,
      emergencyContact: patient.emergencyContact || {
        name: '',
        relationship: '',
        phone: ''
      },
      registrationDate: patient.registrationDate,
      status: patient.status
    };
    
    this.patientSelected.emit(convertedPatient);
    this.closeModal.emit();
  }
}