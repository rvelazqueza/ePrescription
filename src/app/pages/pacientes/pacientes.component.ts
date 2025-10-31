import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LucideAngularModule, Plus, Search, Users, Phone, Mail, Edit, FileText, MessageSquare } from 'lucide-angular';
import { NewPatientDialogComponent } from '../../components/new-patient-dialog/new-patient-dialog.component';
import { PatientData } from '../../interfaces/patient.interface';
import { EditPatientDialogComponent } from '../../components/edit-patient-dialog/edit-patient-dialog.component';
import { ContactPatientDialogComponent, PatientContactInfo } from '../../components/contact-patient-dialog/contact-patient-dialog.component';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';
import { RoleSuggestionModalComponent } from '../../components/role-suggestion-modal/role-suggestion-modal.component';
import { BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs.component';
import { RoleDemoService } from '../../services/role-demo.service';
import { RoleSuggestionService } from '../../services/role-suggestion.service';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, NewPatientDialogComponent, EditPatientDialogComponent, ContactPatientDialogComponent, PageLayoutComponent, RoleSuggestionModalComponent],
  template: `
    <app-page-layout 
      [title]="pageTitle"
      [description]="getPageDescription()"
      [icon]="usersIcon"
      [breadcrumbItems]="breadcrumbItems"
      [hasActionButton]="true">
      
      <button 
        slot="action"
        (click)="openNewPatientDialog()"
        class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors backdrop-blur-sm"
      >
        <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
        <span>Nuevo Paciente</span>
      </button>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <lucide-icon [img]="searchIcon" class="h-5 w-5 text-gray-400"></lucide-icon>
          </div>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="filterPatients()"
            placeholder="Buscar pacientes por nombre, cédula o teléfono..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div *ngIf="filteredPacientes.length === 0 && searchTerm" class="text-center py-8">
        <lucide-icon [img]="usersIcon" class="w-12 h-12 mx-auto text-gray-400 mb-3"></lucide-icon>
        <p class="text-gray-500">No se encontraron pacientes que coincidan con "{{ searchTerm }}"</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let paciente of filteredPacientes" class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <lucide-icon [img]="usersIcon" class="w-6 h-6 text-blue-600"></lucide-icon>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900">{{ paciente.fullName || paciente.nombre }}</h3>
              <p class="text-sm text-gray-500">{{ paciente.idNumber || paciente.cedula }}</p>
              <p *ngIf="paciente.age" class="text-xs text-gray-400">{{ paciente.age }} años</p>
            </div>
          </div>
          
          <div class="mt-4 space-y-2">
            <div class="flex items-center text-sm text-gray-600">
              <lucide-icon [img]="phoneIcon" class="w-4 h-4 mr-2"></lucide-icon>
              {{ paciente.phone || paciente.telefono }}
            </div>
            <div *ngIf="paciente.email" class="flex items-center text-sm text-gray-600">
              <lucide-icon [img]="mailIcon" class="w-4 h-4 mr-2"></lucide-icon>
              {{ paciente.email }}
            </div>
            <div *ngIf="paciente.allergies && paciente.allergies.length > 0" class="flex items-center text-sm text-red-600">
              <span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              {{ paciente.allergies.length }} alergia(s)
            </div>
          </div>
          
          <div class="mt-4 flex space-x-2">
            <button 
              (click)="editPatient(paciente)"
              class="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-100 flex items-center justify-center gap-1"
            >
              <lucide-icon [img]="editIcon" class="w-4 h-4"></lucide-icon>
              Editar
            </button>
            <button 
              (click)="contactPatient(paciente)"
              class="flex-1 bg-purple-50 text-purple-700 px-3 py-2 rounded text-sm hover:bg-purple-100 flex items-center justify-center gap-1"
            >
              <lucide-icon [img]="messageSquareIcon" class="w-4 h-4"></lucide-icon>
              Contactar
            </button>
            <button class="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-100 flex items-center justify-center gap-1">
              <lucide-icon [img]="fileTextIcon" class="w-4 h-4"></lucide-icon>
              Receta
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="pacientes.length === 0" class="text-center py-12">
        <lucide-icon [img]="usersIcon" class="w-16 h-16 mx-auto text-gray-400 mb-4"></lucide-icon>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay pacientes registrados</h3>
        <p class="text-gray-500 mb-4">Comience agregando su primer paciente al sistema</p>
        <button 
          (click)="openNewPatientDialog()"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 mx-auto"
        >
          <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
          <span>Registrar Primer Paciente</span>
        </button>
      </div>
    </app-page-layout>

    <!-- New Patient Dialog -->
    <app-new-patient-dialog
      [open]="showNewPatientDialog"
      (openChange)="showNewPatientDialog = $event"
      (patientCreated)="onPatientCreated($event)"
    ></app-new-patient-dialog>

    <!-- Edit Patient Dialog -->
    <app-edit-patient-dialog
      [open]="showEditPatientDialog"
      [patient]="selectedPatient"
      (openChange)="showEditPatientDialog = $event"
      (patientUpdated)="onPatientUpdated($event)"
    ></app-edit-patient-dialog>

    <!-- Contact Patient Dialog -->
    <app-contact-patient-dialog
      [open]="showContactPatientDialog"
      [patient]="selectedPatientContact"
      (openChange)="showContactPatientDialog = $event"
    ></app-contact-patient-dialog>

    <!-- Role Suggestion Modal -->
    <app-role-suggestion-modal
      [isOpen]="showRoleSuggestionModal()"
      [suggestedRole]="'Médico'"
      [pageName]="'pacientes-lista'"
      (dismiss)="onRoleSuggestionDismiss()"
      (roleChanged)="onRoleChanged()"
    ></app-role-suggestion-modal>
  `
})
export class PacientesComponent implements OnInit, OnDestroy {
  plusIcon = Plus;
  searchIcon = Search;
  usersIcon = Users;
  phoneIcon = Phone;
  mailIcon = Mail;
  editIcon = Edit;
  fileTextIcon = FileText;
  messageSquareIcon = MessageSquare;

  // Page configuration
  pageTitle = 'Gestión de Pacientes';
  
  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Pacientes' }
  ];

  getPageDescription(): string {
    return `Administración y registro de pacientes del sistema (${this.pacientes.length} registrados)`;
  }

  showNewPatientDialog = false;
  showEditPatientDialog = false;
  showContactPatientDialog = false;
  searchTerm = '';
  filteredPacientes: any[] = [];
  selectedPatient: PatientData | null = null;
  selectedPatientContact: PatientContactInfo | null = null;

  // Role suggestion modal state
  showRoleSuggestionModal = signal(false);
  private subscriptions = new Subscription();

  pacientes: any[] = [
    {
      nombre: 'María González Pérez',
      fullName: 'María Elena González Pérez',
      cedula: '1-1234-5678',
      idNumber: '1-1234-5678',
      telefono: '+506 8888-9999',
      phone: '+506 8888-9999',
      email: 'maria.gonzalez@email.com',
      age: 34,
      allergies: ['Penicilina']
    },
    {
      nombre: 'Juan Carlos Rodríguez',
      fullName: 'Juan Carlos Rodríguez López',
      cedula: '2-2345-6789',
      idNumber: '2-2345-6789',
      telefono: '+506 7777-8888',
      phone: '+506 7777-8888',
      email: 'juan.rodriguez@email.com',
      age: 45,
      allergies: []
    },
    {
      nombre: 'Ana Sofía López',
      fullName: 'Ana Sofía López Jiménez',
      cedula: '3-3456-7890',
      idNumber: '3-3456-7890',
      telefono: '+506 6666-7777',
      phone: '+506 6666-7777',
      email: 'ana.lopez@email.com',
      age: 28,
      allergies: ['Ibuprofeno', 'Mariscos']
    }
  ];

  constructor(
    private roleDemoService: RoleDemoService,
    private roleSuggestionService: RoleSuggestionService
  ) {
    this.filteredPacientes = [...this.pacientes];
  }

  ngOnInit() {
    console.log('🚀 Inicializando componente de pacientes');
    
    // Verificar si se debe mostrar el modal de sugerencia de rol
    setTimeout(() => {
      this.checkRoleSuggestion();
    }, 500); // Pequeño delay para asegurar que los servicios estén listos
    
    // Suscribirse a cambios de rol
    const roleSubscription = this.roleDemoService.currentSession$.subscribe(session => {
      console.log('🔄 Cambio de rol detectado:', session.activeRole);
      if (session.activeRole === 'Médico' || session.activeRole === 'Administrador') {
        this.showRoleSuggestionModal.set(false);
        this.roleSuggestionService.clearDismissedPages();
      } else {
        // Verificar si debe mostrar el modal para otros roles
        this.checkRoleSuggestion();
      }
    });
    
    this.subscriptions.add(roleSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private checkRoleSuggestion() {
    const currentSession = this.roleDemoService.getCurrentSession();
    
    console.log('🔍 Verificando rol en pacientes:', currentSession.activeRole);
    
    // Mostrar modal para todos los roles excepto Médico y Administrador
    // Médico Jefe también debe ver el modal para sugerir cambio a Médico
    if (currentSession.activeRole !== 'Médico' && 
        currentSession.activeRole !== 'Administrador') {
      console.log('✅ Mostrando modal de sugerencia de rol para:', currentSession.activeRole);
      this.showRoleSuggestionModal.set(true);
    } else {
      console.log('❌ No mostrando modal para rol:', currentSession.activeRole);
      this.showRoleSuggestionModal.set(false);
    }
  }

  onRoleSuggestionDismiss() {
    console.log('❌ Modal de sugerencia descartado');
    this.showRoleSuggestionModal.set(false);
  }

  onRoleChanged() {
    console.log('✅ Rol cambiado, cerrando modal');
    this.showRoleSuggestionModal.set(false);
    // El modal se cerrará automáticamente cuando cambie el rol
  }

  // Método de debug - puedes llamarlo desde la consola del navegador
  debugModalState() {
    const currentSession = this.roleDemoService.getCurrentSession();
    console.log('🐛 Estado del modal de sugerencia:');
    console.log('- Rol actual:', currentSession.activeRole);
    console.log('- Modal visible:', this.showRoleSuggestionModal());
    console.log('- Debe mostrar modal:', currentSession.activeRole !== 'Médico' && currentSession.activeRole !== 'Administrador');
    return {
      currentRole: currentSession.activeRole,
      modalVisible: this.showRoleSuggestionModal(),
      shouldShow: currentSession.activeRole !== 'Médico' && currentSession.activeRole !== 'Administrador'
    };
  }

  openNewPatientDialog() {
    this.showNewPatientDialog = true;
  }

  onPatientCreated(patient: PatientData) {
    this.pacientes.unshift(patient);
    this.filterPatients();
    console.log('Nuevo paciente agregado:', patient);
  }

  onPatientUpdated(patient: PatientData) {
    const index = this.pacientes.findIndex(p => p.id === patient.id);
    if (index !== -1) {
      this.pacientes[index] = patient;
      this.filterPatients();
      console.log('Paciente actualizado:', patient);
    }
  }

  editPatient(paciente: any) {
    // Convertir el formato del paciente al formato esperado por el diálogo
    this.selectedPatient = {
      id: paciente.id || `PAT-${Date.now()}`,
      fullName: paciente.fullName || paciente.nombre || '',
      idType: 'CC',
      idNumber: paciente.idNumber || paciente.cedula,
      firstName: paciente.fullName?.split(' ')[0] || paciente.nombre?.split(' ')[0] || '',
      firstLastName: paciente.fullName?.split(' ').slice(-1)[0] || paciente.nombre?.split(' ').slice(-1)[0] || '',
      birthDate: '',
      age: 0,
      gender: 'M' as 'M' | 'F',
      phone: paciente.phone || paciente.telefono,
      email: paciente.email,
      country: 'Costa Rica',
      allergies: paciente.allergies || [],
      chronicConditions: paciente.chronicConditions || [],
      currentMedications: paciente.currentMedications || [],
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      },
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'active' as 'active' | 'inactive'
    };
    this.showEditPatientDialog = true;
  }

  contactPatient(paciente: any) {
    this.selectedPatientContact = {
      id: paciente.id || `PAT-${Date.now()}`,
      fullName: paciente.fullName || paciente.nombre,
      phone: paciente.phone || paciente.telefono,
      email: paciente.email || '',
      address: paciente.address || 'Dirección no especificada',
      city: paciente.city || 'San José',
      country: paciente.country || 'Costa Rica',
      emergencyContact: {
        name: 'Contacto de emergencia',
        relationship: 'Familiar',
        phone: '+506 0000-0000'
      }
    };
    this.showContactPatientDialog = true;
  }

  filterPatients() {
    if (!this.searchTerm.trim()) {
      this.filteredPacientes = [...this.pacientes];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredPacientes = this.pacientes.filter(paciente => 
      (paciente.fullName || paciente.nombre).toLowerCase().includes(term) ||
      (paciente.idNumber || paciente.cedula).toLowerCase().includes(term) ||
      (paciente.phone || paciente.telefono).toLowerCase().includes(term) ||
      (paciente.email || '').toLowerCase().includes(term)
    );
  }
}