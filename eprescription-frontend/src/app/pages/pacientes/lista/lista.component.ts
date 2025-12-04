import { Component, OnInit, OnDestroy, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Users, Search, Filter, Plus, Eye, Edit, Trash2, AlertTriangle, Heart, Pill, FileText, Download, UserPlus, X, Phone, Mail, MapPin, Calendar, Activity, Stethoscope, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-angular';
import { PatientService } from '../../../services/patient.service';
import { PatientData } from '../../../interfaces/patient.interface';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { PatientSelectionModalComponent } from '../../../components/patient-selection/patient-selection-modal.component';
import { NewPatientDialogComponent } from '../../../components/new-patient-dialog/new-patient-dialog.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { RoleDemoService } from '../../../services/role-demo.service';
import { RoleSuggestionService } from '../../../services/role-suggestion.service';

interface PatientStats {
  total: number;
  active: number;
  inactive: number;
  withAllergies: number;
  withConditions: number;
  averageAge: number;
}

@Component({
  selector: 'app-lista-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule, PatientSelectionModalComponent, NewPatientDialogComponent, RoleSuggestionModalComponent, BreadcrumbsComponent],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaPacientesComponent implements OnInit, OnDestroy {
  // Icons
  usersIcon = Users;

  // Breadcrumb items
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Pacientes' }
  ];
  searchIcon = Search;
  filterIcon = Filter;
  plusIcon = Plus;
  eyeIcon = Eye;
  editIcon = Edit;
  trashIcon = Trash2;
  alertIcon = AlertTriangle;
  heartIcon = Heart;
  pillIcon = Pill;
  fileTextIcon = FileText;
  downloadIcon = Download;
  userPlusIcon = UserPlus;
  xIcon = X;
  phoneIcon = Phone;
  mailIcon = Mail;
  mapPinIcon = MapPin;
  calendarIcon = Calendar;
  activityIcon = Activity;
  stethoscopeIcon = Stethoscope;
  moreVerticalIcon = MoreVertical;
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;

  // Component state
  activeTab: 'quick' | 'advanced' = 'quick';
  patients: PatientData[] = [];
  filteredPatients: PatientData[] = [];
  selectedPatient: PatientData | null = null;
  showPatientModal = false;
  loading = false;

  // Modal de acciones
  modalAccionesAbierto: string | null = null;

  // Modal de exportar
  showExportModal = false;

  // Modal de nuevo paciente
  showNewPatientModal = false;
  newPatientForm!: FormGroup;

  // Search and filters
  quickSearchForm!: FormGroup;
  advancedSearchForm!: FormGroup;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  // Statistics
  stats: PatientStats = {
    total: 0,
    active: 0,
    inactive: 0,
    withAllergies: 0,
    withConditions: 0,
    averageAge: 0
  };

  private destroy$ = new Subject<void>();

  // Role suggestion modal state
  showRoleSuggestionModal = signal(false);
  private roleSubscriptions = new Subscription();

  constructor(
    private patientService: PatientService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private roleDemoService: RoleDemoService,
    private roleSuggestionService: RoleSuggestionService
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    console.log('🚀 Lista pacientes ngOnInit iniciado');
    this.loadPatients();
    this.setupSearchSubscriptions();
    
    // Verificar si se debe mostrar el modal de sugerencia de rol
    console.log('🔍 Llamando checkRoleSuggestion desde ngOnInit');
    this.checkRoleSuggestion();
    console.log('📊 Estado del modal después de checkRoleSuggestion:', this.showRoleSuggestionModal());
    
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
    
    this.roleSubscriptions.add(roleSubscription);
    console.log('✅ Lista pacientes ngOnInit completado');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.roleSubscriptions.unsubscribe();
  }

  private checkRoleSuggestion() {
    const currentSession = this.roleDemoService.getCurrentSession();
    
    console.log('🔍 Verificando rol en lista pacientes:', currentSession.activeRole);
    
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
    console.log('🚫 onRoleSuggestionDismiss llamado - cerrando modal');
    this.showRoleSuggestionModal.set(false);
    console.log('🎯 Estado del modal después de dismiss:', this.showRoleSuggestionModal());
  }

  onRoleChanged() {
    console.log('🔄 onRoleChanged llamado - cerrando modal');
    this.showRoleSuggestionModal.set(false);
    console.log('🎯 Estado del modal después de role change:', this.showRoleSuggestionModal());
    // El modal se cerrará automáticamente cuando cambie el rol
  }



  private initializeForms() {
    this.quickSearchForm = this.fb.group({
      query: ['']
    });

    this.advancedSearchForm = this.fb.group({
      patientName: [''],
      identification: [''],
      gender: [''],
      state: [''],
      ageFrom: [''],
      ageTo: [''],
      allergies: [''],
      chronicConditions: ['']
    });

    this.newPatientForm = this.fb.group({
      firstName: ['', Validators.required],
      firstLastName: ['', Validators.required],
      idType: ['CC', Validators.required],
      idNumber: ['', Validators.required],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['']
    });
  }

  private setupSearchSubscriptions() {
    // Quick search
    this.quickSearchForm.get('query')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        this.performQuickSearch(query);
      });

    // Advanced search form changes
    this.advancedSearchForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.activeTab === 'advanced') {
          this.performAdvancedSearch();
        }
      });
  }

  loadPatients() {
    this.loading = true;
    this.patientService.getAllPatients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (patients) => {
          this.patients = patients;
          this.filteredPatients = [...patients];
          this.calculateStats();
          this.updatePagination();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading patients:', error);
          this.loading = false;
        }
      });
  }

  private calculateStats() {
    this.stats = {
      total: this.patients.length,
      active: this.patients.filter(p => p.status === 'active').length,
      inactive: this.patients.filter(p => p.status === 'inactive').length,
      withAllergies: this.patients.filter(p => p.allergies.length > 0).length,
      withConditions: this.patients.filter(p => p.chronicConditions.length > 0).length,
      averageAge: Math.round(this.patients.reduce((sum, p) => sum + p.age, 0) / this.patients.length) || 0
    };
  }

  switchTab(tab: 'quick' | 'advanced') {
    this.activeTab = tab;
    this.currentPage = 1;

    if (tab === 'quick') {
      this.performQuickSearch(this.quickSearchForm.get('query')?.value || '');
    } else {
      this.performAdvancedSearch();
    }
  }

  performQuickSearch(query: string) {
    if (!query || query.trim().length === 0) {
      this.filteredPatients = [...this.patients];
    } else {
      const searchTerm = query.toLowerCase().trim();
      this.filteredPatients = this.patients.filter(patient =>
        patient.fullName.toLowerCase().includes(searchTerm) ||
        patient.idNumber.includes(searchTerm) ||
        patient.phone.includes(searchTerm) ||
        patient.email?.toLowerCase().includes(searchTerm)
      );
    }
    this.updatePagination();
  }

  performAdvancedSearch() {
    const filters = this.advancedSearchForm.value;

    this.filteredPatients = this.patients.filter(patient => {
      // Name filter
      if (filters.patientName && !patient.fullName.toLowerCase().includes(filters.patientName.toLowerCase())) {
        return false;
      }

      // Identification filter
      if (filters.identification && !patient.idNumber.includes(filters.identification)) {
        return false;
      }

      // Gender filter
      if (filters.gender && filters.gender !== 'Todos' && patient.gender !== filters.gender) {
        return false;
      }

      // State filter
      if (filters.state && filters.state !== 'Todos los estados' && patient.status !== filters.state) {
        return false;
      }

      // Age range filter
      if (filters.ageFrom && patient.age < parseInt(filters.ageFrom)) {
        return false;
      }

      if (filters.ageTo && patient.age > parseInt(filters.ageTo)) {
        return false;
      }

      // Allergies filter
      if (filters.allergies && filters.allergies !== 'Todos') {
        if (filters.allergies === 'Con alergias' && patient.allergies.length === 0) {
          return false;
        }
        if (filters.allergies === 'Sin alergias' && patient.allergies.length > 0) {
          return false;
        }
      }

      // Chronic conditions filter
      if (filters.chronicConditions && filters.chronicConditions !== 'Todos') {
        if (filters.chronicConditions === 'Con condiciones' && patient.chronicConditions.length === 0) {
          return false;
        }
        if (filters.chronicConditions === 'Sin condiciones' && patient.chronicConditions.length > 0) {
          return false;
        }
      }

      return true;
    });

    this.updatePagination();
  }

  clearAdvancedFilters() {
    this.advancedSearchForm.reset({
      patientName: '',
      identification: '',
      gender: '',
      state: '',
      ageFrom: '',
      ageTo: '',
      allergies: '',
      chronicConditions: ''
    });
    this.performAdvancedSearch();
  }

  private updatePagination() {
    this.totalPages = Math.ceil(this.filteredPatients.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  get paginatedPatients(): PatientData[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredPatients.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, this.currentPage - halfVisible);
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  viewPatient(patient: PatientData) {
    // Cerrar otros modales
    this.showNewPatientModal = false;
    this.showExportModal = false;
    this.modalAccionesAbierto = null;

    // Navigate to patient profile with patient ID
    // Requirements: 3.1, 3.2
    this.router.navigate(['/pacientes/perfil', patient.id]);
  }

  /**
   * Navigate to patient prescriptions
   * Requirements: 3.1, 3.2
   */
  viewPatientPrescriptions(patient: PatientData) {
    // Cerrar otros modales
    this.showNewPatientModal = false;
    this.showExportModal = false;
    this.modalAccionesAbierto = null;

    // Navigate to patient prescriptions with patient ID
    this.router.navigate(['/pacientes/recetas', patient.id]);
  }

  /**
   * Navigate to new prescription with patient preselected
   * Requirements: 3.1, 5.2
   */
  createPrescriptionForPatient(patient: PatientData) {
    // Cerrar otros modales
    this.showNewPatientModal = false;
    this.showExportModal = false;
    this.modalAccionesAbierto = null;

    // Navigate to new prescription with patient ID
    this.router.navigate(['/prescripciones/nueva', patient.id]);
  }

  editPatient(patient: PatientData) {
    // TODO: Implement edit functionality
    console.log('Edit patient:', patient);
  }

  closePatientModal() {
    this.showPatientModal = false;
    this.selectedPatient = null;
  }

  exportPatients() {
    console.log('Función exportPatients() llamada');
    // Cerrar otros modales
    this.showNewPatientModal = false;
    this.showPatientModal = false;
    this.modalAccionesAbierto = null;

    // Toggle del modal de exportar
    this.showExportModal = !this.showExportModal;
    console.log('Estado showExportModal:', this.showExportModal);
  }

  closeExportModal() {
    this.showExportModal = false;
  }

  exportToPDF() {
    console.log('Exportar a PDF - Pacientes:', this.filteredPatients.length);
    // Aquí iría la lógica real de exportación a PDF
    this.closeExportModal();
  }

  exportToCSV() {
    console.log('Exportar a CSV - Pacientes:', this.filteredPatients.length);
    // Aquí iría la lógica real de exportación a CSV
    this.closeExportModal();
  }

  exportToExcel() {
    console.log('Exportar a Excel - Pacientes:', this.filteredPatients.length);
    // Aquí iría la lógica real de exportación a Excel
    this.closeExportModal();
  }

  // Métodos del modal de nuevo paciente
  createNewPatient() {
    console.log('🔥 createNewPatient() EJECUTADO');
    console.log('Estado inicial showNewPatientModal:', this.showNewPatientModal);

    // CREAR MODAL DIRECTAMENTE EN EL DOM (FUNCIONA)
    this.createDirectDOMModal();

    // Cerrar otros modales
    this.showPatientModal = false;
    this.showExportModal = false;
    this.modalAccionesAbierto = null;
    this.selectedPatient = null;
    console.log('✅ Otros modales cerrados');

    // También actualizar el estado Angular por si acaso
    this.showNewPatientModal = true;
    console.log('✅ Modal abierto, nuevo estado:', this.showNewPatientModal);
  }

  closeNewPatientModal() {
    this.showNewPatientModal = false;
    this.newPatientForm.reset();
  }

  onNewPatientModalChange(open: boolean) {
    console.log('Modal state changed to:', open);
    this.showNewPatientModal = open;
  }

  onPatientCreated(patient: PatientData) {
    console.log('Nuevo paciente creado:', patient);
    
    // Agregar a la lista
    this.patients.unshift(patient);
    this.filterPatients();
    this.calculateStats();

    // Cerrar modal
    this.showNewPatientModal = false;
    
    // Mostrar mensaje de éxito
    alert(`Paciente ${patient.fullName} registrado exitosamente`);
  }

  onSubmitNewPatient() {
    if (this.newPatientForm.valid) {
      const formValue = this.newPatientForm.value;

      // Calcular edad
      const birthDate = new Date(formValue.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      // Crear nuevo paciente
      const newPatient: PatientData = {
        id: `PAT-${Date.now()}`,
        fullName: `${formValue.firstName} ${formValue.firstLastName}`,
        firstName: formValue.firstName,
        secondName: '',
        firstLastName: formValue.firstLastName,
        secondLastName: '',
        idType: formValue.idType,
        idNumber: formValue.idNumber,
        birthDate: formValue.birthDate,
        age: age,
        gender: formValue.gender as 'M' | 'F',
        bloodType: '',
        phone: formValue.phone,
        email: formValue.email || '',
        address: '',
        city: '',
        country: 'Costa Rica',
        occupation: '',
        weight: '0',
        height: '0',
        bmi: '0',
        insuranceProvider: '',
        insuranceNumber: '',
        insuranceType: '',
        allergies: [],
        chronicConditions: [],
        currentMedications: [],
        clinicalNotes: '',
        emergencyContact: {
          name: '',
          relationship: '',
          phone: ''
        },
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'active',
        lastVisit: new Date().toISOString().split('T')[0]
      };

      // Agregar a la lista
      this.patients.unshift(newPatient);
      this.filterPatients();
      this.calculateStats();

      // Cerrar modal
      this.closeNewPatientModal();

      console.log('Nuevo paciente creado:', newPatient);
    }
  }

  private filterPatients() {
    if (this.activeTab === 'quick') {
      this.performQuickSearch(this.quickSearchForm.get('query')?.value || '');
    } else {
      this.performAdvancedSearch();
    }
  }

  getPatientAge(birthDate: string): string {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    return `${age} años`;
  }

  getGenderLabel(gender: 'M' | 'F'): string {
    return gender === 'M' ? 'Masculino' : 'Femenino';
  }

  getStatusLabel(status: string): string {
    return status === 'active' ? 'Activo' : 'Inactivo';
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  }

  getAllergyCount(allergies: string[]): number {
    return allergies.length;
  }

  getConditionCount(conditions: string[]): number {
    return conditions.length;
  }

  getMedicationCount(medications: string[]): number {
    return medications.length;
  }

  getPrescriptionCount(patientId: string): number {
    // Mock prescription count - consistent based on patient ID
    // Simple hash function to generate consistent numbers
    let hash = 0;
    for (let i = 0; i < patientId.length; i++) {
      const char = patientId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    // Return a number between 1 and 50
    return Math.abs(hash % 50) + 1;
  }

  // Helper function for template
  Math = Math;

  // Métodos para el modal de acciones
  toggleAccionesModal(patientId: string) {
    this.modalAccionesAbierto = this.modalAccionesAbierto === patientId ? null : patientId;
  }

  cerrarModalAcciones() {
    this.modalAccionesAbierto = null;
    // No cerrar automáticamente el modal de exportar aquí
  }

  private createDirectDOMModal() {
    // Eliminar modal anterior si existe
    const existingModal = document.getElementById('direct-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Crear modal directamente en el DOM
    const modal = document.createElement('div');
    modal.id = 'direct-modal';
    modal.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background-color: rgba(0, 0, 0, 0.8) !important;
      z-index: 9999999 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 20px !important;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background-color: white !important;
      border-radius: 8px !important;
      padding: 0 !important;
      max-width: 1200px !important;
      width: 100% !important;
      max-height: 90vh !important;
      overflow-y: auto !important;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
    `;

    content.innerHTML = `
      <!-- Header -->
      <div style="padding: 24px 24px 0 24px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 20px; height: 20px; color: #2563eb;">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: #111827;">Registrar nuevo paciente</h2>
          </div>
          <button id="close-direct-modal" style="
            background: none; border: none; font-size: 20px; cursor: pointer; color: #6b7280; padding: 4px;
          ">×</button>
        </div>
        <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280;">
          Complete la información del paciente. Los campos marcados con * son obligatorios.
        </p>
        
        <!-- Tabs Navigation -->
        <div style="border-bottom: 1px solid #e5e7eb; margin-bottom: 0;">
          <nav style="display: flex; gap: 32px;">
            <button id="tab-personal" class="tab-btn active" style="
              padding: 8px 4px; border: none; background: none; cursor: pointer; font-weight: 500; font-size: 14px;
              border-bottom: 2px solid #2563eb; color: #2563eb; display: flex; align-items: center; gap: 8px;
            ">
              <div style="width: 16px; height: 16px;">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
              </div>
              Personal
            </button>
            <button id="tab-contact" class="tab-btn" style="
              padding: 8px 4px; border: none; background: none; cursor: pointer; font-weight: 500; font-size: 14px;
              border-bottom: 2px solid transparent; color: #6b7280; display: flex; align-items: center; gap: 8px;
            ">
              <div style="width: 16px; height: 16px;">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
              </div>
              Contacto
            </button>
            <button id="tab-medical" class="tab-btn" style="
              padding: 8px 4px; border: none; background: none; cursor: pointer; font-weight: 500; font-size: 14px;
              border-bottom: 2px solid transparent; color: #6b7280; display: flex; align-items: center; gap: 8px;
            ">
              <div style="width: 16px; height: 16px;">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              Médica
            </button>
            <button id="tab-emergency" class="tab-btn" style="
              padding: 8px 4px; border: none; background: none; cursor: pointer; font-weight: 500; font-size: 14px;
              border-bottom: 2px solid transparent; color: #6b7280; display: flex; align-items: center; gap: 8px;
            ">
              <div style="width: 16px; height: 16px;">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
              </div>
              Emergencia
            </button>
          </nav>
        </div>
      </div>

      <!-- Content -->
      <div style="padding: 24px;">
        <!-- Tab Personal -->
        <div id="content-personal" class="tab-content" style="display: block;">
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
            <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 500; color: #111827;">Información personal</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 16px; margin-bottom: 16px;">
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Tipo de documento *</label>
                <select id="idType" required style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="PA">Pasaporte</option>
                  <option value="RC">Registro Civil</option>
                </select>
              </div>
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Número de documento *</label>
                <input type="text" id="idNumber" placeholder="Ej: 1234567890" required style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Primer nombre *</label>
                <input type="text" id="firstName" placeholder="Ej: María" required style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
              </div>
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Segundo nombre</label>
                <input type="text" id="secondName" placeholder="Ej: Elena" style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Primer apellido *</label>
                <input type="text" id="firstLastName" placeholder="Ej: González" required style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
              </div>
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Segundo apellido</label>
                <input type="text" id="secondLastName" placeholder="Ej: Rodríguez" style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Fecha de nacimiento *</label>
                <input type="date" id="birthDate" required style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
                <div id="age-display" style="font-size: 12px; color: #6b7280; margin-top: 4px;"></div>
              </div>
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Género *</label>
                <select id="gender" required style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
                  <option value="">Seleccione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Tipo de sangre</label>
                <select id="bloodType" style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
                  <option value="">Seleccione</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Contact -->
        <div id="content-contact" class="tab-content" style="display: none;">
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
            <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 500; color: #111827;">Información de contacto</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Teléfono *</label>
                <input type="tel" id="phone" placeholder="Ej: +506 8888-9999" required style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
              </div>
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Correo electrónico</label>
                <input type="email" id="email" placeholder="Ej: paciente@email.com" style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
              </div>
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Dirección de residencia</label>
              <input type="text" id="address" placeholder="Ej: Calle 45 #23-67, Apto 301" style="
                width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
              ">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Ciudad</label>
                <input type="text" id="city" placeholder="Ej: San José" style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
              </div>
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">País</label>
                <select id="country" style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Chile">Chile</option>
                  <option value="México">México</option>
                  <option value="Perú">Perú</option>
                  <option value="España">España</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Medical -->
        <div id="content-medical" class="tab-content" style="display: none;">
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
            <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 500; color: #111827;">Información médica</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px;">
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Peso (kg)</label>
                <input type="number" id="weight" step="0.1" placeholder="Ej: 70.5" style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
              </div>
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Altura (m)</label>
                <input type="number" id="height" step="0.01" placeholder="Ej: 1.75" style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
              </div>
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">IMC</label>
                <div id="bmi-display" style="
                  height: 36px; display: flex; align-items: center; padding: 0 12px; border: 1px solid #d1d5db; 
                  border-radius: 6px; background-color: #f9fafb; font-size: 14px;
                ">---</div>
              </div>
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Notas clínicas adicionales</label>
              <textarea id="clinicalNotes" rows="4" placeholder="Información médica relevante, antecedentes familiares, observaciones..." style="
                width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; resize: vertical;
              "></textarea>
            </div>
          </div>
        </div>

        <!-- Tab Emergency -->
        <div id="content-emergency" class="tab-content" style="display: none;">
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
            <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 500; color: #111827;">Contacto de emergencia</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Nombre completo</label>
                <input type="text" id="emergencyName" placeholder="Nombre del contacto" style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
              </div>
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Relación</label>
                <input type="text" id="emergencyRelationship" placeholder="Esposo, Madre, etc." style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
              </div>
              <div>
                <label style="display: block; margin-bottom: 4px; font-size: 14px; font-weight: 500; color: #374151;">Teléfono</label>
                <input type="tel" id="emergencyPhone" placeholder="+506 8888-9999" style="
                  width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
                ">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="display: flex; justify-content: space-between; padding: 24px; border-top: 1px solid #e5e7eb;">
        <button id="prev-btn" style="
          padding: 8px 16px; background-color: transparent; color: #374151; border: 1px solid #d1d5db; 
          border-radius: 6px; cursor: pointer; font-size: 14px; display: none;
        ">Anterior</button>
        <div style="display: flex; gap: 8px; margin-left: auto;">
          <button id="cancel-btn" style="
            padding: 8px 16px; background-color: transparent; color: #374151; border: 1px solid #d1d5db; 
            border-radius: 6px; cursor: pointer; font-size: 14px;
          ">Cancelar</button>
          <button id="next-btn" style="
            padding: 8px 16px; background-color: #2563eb; color: white; border: none; 
            border-radius: 6px; cursor: pointer; font-size: 14px;
          ">Siguiente</button>
          <button id="submit-btn" style="
            padding: 8px 16px; background-color: #2563eb; color: white; border: none; 
            border-radius: 6px; cursor: pointer; font-size: 14px; display: none;
          ">
            <svg style="width: 16px; height: 16px; margin-right: 8px; display: inline;" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            Registrar Paciente
          </button>
        </div>
      </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Agregar eventos
    const closeBtn = document.getElementById('close-direct-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const submitBtn = document.getElementById('submit-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    // Tabs
    const tabPersonal = document.getElementById('tab-personal');
    const tabContact = document.getElementById('tab-contact');
    const tabMedical = document.getElementById('tab-medical');
    const tabEmergency = document.getElementById('tab-emergency');

    let currentTab = 'personal';

    const closeModal = () => {
      modal.remove();
      this.showNewPatientModal = false;
    };

    const switchTab = (tabId: string) => {
      // Ocultar todos los contenidos
      document.querySelectorAll('.tab-content').forEach(content => {
        (content as HTMLElement).style.display = 'none';
      });

      // Resetear estilos de tabs
      document.querySelectorAll('.tab-btn').forEach(btn => {
        (btn as HTMLElement).style.borderBottom = '2px solid transparent';
        (btn as HTMLElement).style.color = '#6b7280';
      });

      // Mostrar contenido activo
      const activeContent = document.getElementById('content-' + tabId);
      if (activeContent) {
        activeContent.style.display = 'block';
      }

      // Activar tab
      const activeTab = document.getElementById('tab-' + tabId);
      if (activeTab) {
        activeTab.style.borderBottom = '2px solid #2563eb';
        activeTab.style.color = '#2563eb';
      }

      currentTab = tabId;

      // Actualizar botones de navegación
      const prevButton = document.getElementById('prev-btn');
      const nextButton = document.getElementById('next-btn');
      const submitButton = document.getElementById('submit-btn');

      if (prevButton && nextButton && submitButton) {
        if (tabId === 'personal') {
          prevButton.style.display = 'none';
          nextButton.style.display = 'inline-block';
          submitButton.style.display = 'none';
        } else if (tabId === 'contact') {
          prevButton.style.display = 'inline-block';
          nextButton.style.display = 'inline-block';
          submitButton.style.display = 'none';
        } else if (tabId === 'medical') {
          prevButton.style.display = 'inline-block';
          nextButton.style.display = 'inline-block';
          submitButton.style.display = 'none';
        } else if (tabId === 'emergency') {
          prevButton.style.display = 'inline-block';
          nextButton.style.display = 'none';
          submitButton.style.display = 'inline-block';
        }
      }
    };

    // Event listeners para tabs
    tabPersonal?.addEventListener('click', () => switchTab('personal'));
    tabContact?.addEventListener('click', () => switchTab('contact'));
    tabMedical?.addEventListener('click', () => switchTab('medical'));
    tabEmergency?.addEventListener('click', () => switchTab('emergency'));

    // Event listeners para navegación
    nextBtn?.addEventListener('click', () => {
      if (currentTab === 'personal') switchTab('contact');
      else if (currentTab === 'contact') switchTab('medical');
      else if (currentTab === 'medical') switchTab('emergency');
    });

    prevBtn?.addEventListener('click', () => {
      if (currentTab === 'contact') switchTab('personal');
      else if (currentTab === 'medical') switchTab('contact');
      else if (currentTab === 'emergency') switchTab('medical');
    });

    // Event listeners para cerrar y enviar
    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    submitBtn?.addEventListener('click', () => {
      this.handleFormSubmit();
      closeModal();
    });

    // Calcular edad automáticamente
    const birthDateInput = document.getElementById('birthDate') as HTMLInputElement;
    const ageDisplay = document.getElementById('age-display');
    
    birthDateInput?.addEventListener('change', () => {
      if (birthDateInput.value && ageDisplay) {
        const birthDate = new Date(birthDateInput.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        ageDisplay.textContent = 'Edad: ' + age + ' años';
      }
    });

    // Calcular IMC automáticamente
    const weightInput = document.getElementById('weight') as HTMLInputElement;
    const heightInput = document.getElementById('height') as HTMLInputElement;
    const bmiDisplay = document.getElementById('bmi-display');

    const calculateBMI = () => {
      if (weightInput?.value && heightInput?.value && bmiDisplay) {
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);
        if (weight > 0 && height > 0) {
          const bmi = weight / (height * height);
          bmiDisplay.textContent = bmi.toFixed(1);
        }
      }
    };

    weightInput?.addEventListener('input', calculateBMI);
    heightInput?.addEventListener('input', calculateBMI);

    console.log('🚀 Modal DOM directo creado con tabs funcionales');
  }

  private handleFormSubmit() {
    // Datos del tab Personal
    const firstName = (document.getElementById('firstName') as HTMLInputElement)?.value;
    const secondName = (document.getElementById('secondName') as HTMLInputElement)?.value;
    const firstLastName = (document.getElementById('firstLastName') as HTMLInputElement)?.value;
    const secondLastName = (document.getElementById('secondLastName') as HTMLInputElement)?.value;
    const idType = (document.getElementById('idType') as HTMLSelectElement)?.value;
    const idNumber = (document.getElementById('idNumber') as HTMLInputElement)?.value;
    const birthDate = (document.getElementById('birthDate') as HTMLInputElement)?.value;
    const gender = (document.getElementById('gender') as HTMLSelectElement)?.value;
    const bloodType = (document.getElementById('bloodType') as HTMLSelectElement)?.value;

    // Datos del tab Contacto
    const phone = (document.getElementById('phone') as HTMLInputElement)?.value;
    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    const address = (document.getElementById('address') as HTMLInputElement)?.value;
    const city = (document.getElementById('city') as HTMLInputElement)?.value;
    const country = (document.getElementById('country') as HTMLSelectElement)?.value;

    // Datos del tab Médico
    const weight = (document.getElementById('weight') as HTMLInputElement)?.value;
    const height = (document.getElementById('height') as HTMLInputElement)?.value;
    const clinicalNotes = (document.getElementById('clinicalNotes') as HTMLTextAreaElement)?.value;

    // Datos del tab Emergencia
    const emergencyName = (document.getElementById('emergencyName') as HTMLInputElement)?.value;
    const emergencyRelationship = (document.getElementById('emergencyRelationship') as HTMLInputElement)?.value;
    const emergencyPhone = (document.getElementById('emergencyPhone') as HTMLInputElement)?.value;

    if (!firstName || !firstLastName || !idType || !idNumber || !birthDate || !gender || !phone) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }

    // Calcular edad
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    // Calcular IMC si hay peso y altura
    let bmi = '';
    if (weight && height) {
      const weightNum = parseFloat(weight);
      const heightNum = parseFloat(height);
      if (weightNum > 0 && heightNum > 0) {
        bmi = (weightNum / (heightNum * heightNum)).toFixed(1);
      }
    }

    // Crear nuevo paciente
    const newPatient: PatientData = {
      id: 'PAT-' + Date.now(),
      fullName: (firstName + ' ' + (secondName || '') + ' ' + firstLastName + ' ' + (secondLastName || '')).replace(/\s+/g, ' ').trim(),
      firstName: firstName,
      secondName: secondName || '',
      firstLastName: firstLastName,
      secondLastName: secondLastName || '',
      idType: idType,
      idNumber: idNumber,
      birthDate: birthDate,
      age: age,
      gender: gender as 'M' | 'F',
      bloodType: bloodType || '',
      phone: phone,
      email: email || '',
      address: address || '',
      city: city || '',
      country: country || 'Costa Rica',
      occupation: '',
      weight: weight || '0',
      height: height || '0',
      bmi: bmi || '0',
      insuranceProvider: '',
      insuranceNumber: '',
      insuranceType: '',
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      clinicalNotes: clinicalNotes || '',
      emergencyContact: {
        name: emergencyName || '',
        relationship: emergencyRelationship || '',
        phone: emergencyPhone || ''
      },
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'active',
      lastVisit: new Date().toISOString().split('T')[0]
    };

    // Agregar a la lista
    this.patients.unshift(newPatient);
    this.filterPatients();
    this.calculateStats();

    alert('¡Paciente ' + firstName + ' ' + firstLastName + ' registrado exitosamente!');
    console.log('Nuevo paciente creado:', newPatient);
  }

}