import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LucideAngularModule, FileText, Search, Filter, Download, Eye, User, Phone, Plus, FileCheck, Clock, AlertTriangle, FilterX, Pill, ChevronLeft, ChevronRight, Printer, Users } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';
import { RoleSuggestionService } from '../../../services/role-suggestion.service';

// Interfaces simples para datos mock
interface PatientData {
  id: string;
  fullName: string;
  idType: string;
  idNumber: string;
  phone: string;
  email?: string;
  status: 'active' | 'inactive';
  allergies: string[];
  chronicConditions: string[];
}

interface PrescriptionSummary {
  id: string;
  prescriptionNumber: string;
  date: string;
  doctor: {
    name: string;
    specialty: string;
    licenseNumber?: string;
  };
  diagnosis: string;
  medications: Array<{
    name: string;
    dosage: string;
  }>;
  status: string;
  dispensedDate?: string;
  expirationDate?: string;
}

@Component({
  selector: 'app-recetas-paciente',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    LucideAngularModule,
    BreadcrumbsComponent,
    RoleSuggestionModalComponent
  ],
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.css']
})
export class RecetasPacienteComponent implements OnInit, OnDestroy {
  // Icons
  fileTextIcon = FileText;
  searchIcon = Search;
  filterIcon = Filter;
  downloadIcon = Download;
  eyeIcon = Eye;
  userIcon = User;
  phoneIcon = Phone;
  plusIcon = Plus;
  fileCheckIcon = FileCheck;
  clockIcon = Clock;
  alertTriangleIcon = AlertTriangle;
  filterXIcon = FilterX;
  pillIcon = Pill;
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;
  printerIcon = Printer;
  usersIcon = Users;

  // Breadcrumb items
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Pacientes', route: '/pacientes' },
    { label: 'Recetas del Paciente' }
  ];

  // Component state - simplificado con datos mock
  selectedPatient: PatientData | null = null;
  isLoading = false;
  error: string | null = null;

  // Prescription data - datos mock
  prescriptions: PrescriptionSummary[] = [];
  
  // Filter properties
  searchTerm: string = '';
  statusFilter: string = 'all';
  dateFilter: string = 'all';
  doctorFilter: string = 'all';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // Available filter options
  availableDoctors: string[] = [];
  availableStatuses = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'dispensed', label: 'Dispensadas' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'expired', label: 'Vencidas' },
    { value: 'cancelled', label: 'Canceladas' }
  ];

  // Role suggestion modal state
  showRoleSuggestionModal = signal(false);
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private roleDemoService: RoleDemoService,
    private roleSuggestionService: RoleSuggestionService
  ) {}

  ngOnInit(): void {
    this.loadMockData();
    
    // Verificar si se debe mostrar el modal de sugerencia de rol
    this.checkRoleSuggestion();
    
    // Suscribirse a cambios de rol
    const roleSubscription = this.roleDemoService.currentSession$.subscribe(session => {
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private checkRoleSuggestion() {
    const currentSession = this.roleDemoService.getCurrentSession();
    
    console.log('🔍 Verificando rol en recetas paciente:', currentSession.activeRole);
    
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
    this.showRoleSuggestionModal.set(false);
  }

  onRoleChanged() {
    this.showRoleSuggestionModal.set(false);
    // El modal se cerrará automáticamente cuando cambie el rol
  }

  /**
   * Cargar datos mock exactos del archivo original de React
   */
  private loadMockData(): void {
    // Datos mock del paciente - exactos del archivo original
    this.selectedPatient = {
      id: 'PAT-001',
      fullName: 'María Elena González Rodríguez',
      idType: 'CC',
      idNumber: '52.841.963',
      phone: '+57 310 456-7890',
      email: 'maria.gonzalez@email.com',
      status: 'active',
      allergies: ['Penicilina', 'Sulfas', 'Mariscos'],
      chronicConditions: ['Hipertensión arterial', 'Diabetes tipo 2', 'Hipotiroidismo']
    };

    // Datos mock de recetas - expandidos con más datos del archivo original
    this.prescriptions = [
      {
        id: 'RX-001',
        prescriptionNumber: 'RX-2025-001',
        date: '2025-09-27',
        doctor: {
          name: 'Dr. Carlos Alberto Mendoza Herrera',
          specialty: 'Medicina Interna',
          licenseNumber: 'MSP-2015-001'
        },
        diagnosis: 'Control HTA y Diabetes - Renovación de medicamentos',
        medications: [
          { name: 'Enalapril', dosage: '10mg - 1 vez al día' },
          { name: 'Metformina', dosage: '850mg - 2 veces al día' }
        ],
        status: 'dispensed',
        dispensedDate: '2025-09-28',
        expirationDate: '2025-12-27'
      },
      {
        id: 'RX-002',
        prescriptionNumber: 'RX-2025-002',
        date: '2025-08-15',
        doctor: {
          name: 'Dr. Carlos Alberto Mendoza Herrera',
          specialty: 'Medicina Interna',
          licenseNumber: 'MSP-2015-001'
        },
        diagnosis: 'Control de rutina - Medicina Interna',
        medications: [
          { name: 'Enalapril', dosage: '10mg' },
          { name: 'Metformina', dosage: '850mg' }
        ],
        status: 'expired',
        expirationDate: '2025-09-15'
      },
      {
        id: 'RX-003',
        prescriptionNumber: 'RX-2025-003',
        date: '2025-06-10',
        doctor: {
          name: 'Dra. Patricia Sánchez Vega',
          specialty: 'Endocrinología',
          licenseNumber: 'MSP-2018-045'
        },
        diagnosis: 'Diagnóstico de Hipotiroidismo',
        medications: [
          { name: 'Levotiroxina', dosage: '100mcg - 1 vez al día en ayunas' }
        ],
        status: 'dispensed',
        dispensedDate: '2025-06-11',
        expirationDate: '2025-09-10'
      },
      {
        id: 'RX-004',
        prescriptionNumber: 'RX-2025-004',
        date: '2025-05-25',
        doctor: {
          name: 'Enf. Laura Martínez',
          specialty: 'Vacunación',
          licenseNumber: 'ENF-2020-123'
        },
        diagnosis: 'Vacunación - Influenza estacional 2025',
        medications: [
          { name: 'Vacuna Influenza', dosage: 'Dosis única' }
        ],
        status: 'dispensed',
        dispensedDate: '2025-05-25',
        expirationDate: '2025-05-25'
      },
      {
        id: 'RX-005',
        prescriptionNumber: 'RX-2025-005',
        date: '2025-03-20',
        doctor: {
          name: 'Dr. Carlos Alberto Mendoza Herrera',
          specialty: 'Medicina Interna',
          licenseNumber: 'MSP-2015-001'
        },
        diagnosis: 'Ajuste de medicación antihipertensiva',
        medications: [
          { name: 'Enalapril', dosage: '5mg - 1 vez al día' },
          { name: 'Metformina', dosage: '850mg - 2 veces al día' }
        ],
        status: 'expired',
        expirationDate: '2025-06-20'
      },
      {
        id: 'RX-006',
        prescriptionNumber: 'RX-2025-006',
        date: '2025-01-15',
        doctor: {
          name: 'Dr. Carlos Alberto Mendoza Herrera',
          specialty: 'Medicina Interna',
          licenseNumber: 'MSP-2015-001'
        },
        diagnosis: 'Control diabetes mellitus tipo 2',
        medications: [
          { name: 'Metformina', dosage: '850mg' },
          { name: 'Glibenclamida', dosage: '5mg' }
        ],
        status: 'expired',
        expirationDate: '2025-04-15'
      }
    ];

    // Extraer doctores únicos para filtros
    this.availableDoctors = [...new Set(this.prescriptions.map(p => p.doctor.name))];
  }

  /**
   * Get patient initials for avatar
   */
  getPatientInitials(): string {
    if (!this.selectedPatient?.fullName) return 'P';
    
    const names = this.selectedPatient.fullName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  // Computed properties
  get prescriptionStats(): any {
    return {
      total: this.prescriptions.length,
      dispensed: this.prescriptions.filter(p => p.status === 'dispensed').length,
      pending: this.prescriptions.filter(p => p.status === 'pending').length,
      expired: this.prescriptions.filter(p => p.status === 'expired').length,
      cancelled: this.prescriptions.filter(p => p.status === 'cancelled').length
    };
  }

  get paginatedPrescriptions(): PrescriptionSummary[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.prescriptions.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.prescriptions.length / this.itemsPerPage);
  }

  get totalPrescriptions(): number {
    return this.prescriptions.length;
  }

  // Filter methods
  hasActiveFilters(): boolean {
    return this.searchTerm !== '' || 
           this.statusFilter !== 'all' || 
           this.dateFilter !== 'all' || 
           this.doctorFilter !== 'all';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.dateFilter = 'all';
    this.doctorFilter = 'all';
    this.currentPage = 1;
  }

  onSearchChange(): void {
    // Implementar filtrado simple si es necesario
    this.currentPage = 1;
  }

  onStatusFilterChange(): void {
    this.currentPage = 1;
  }

  onDateFilterChange(): void {
    this.currentPage = 1;
  }

  onDoctorFilterChange(): void {
    this.currentPage = 1;
  }

  // Status methods
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'dispensed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'expired':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'dispensed':
        return 'Dispensada';
      case 'pending':
        return 'Pendiente';
      case 'expired':
        return 'Vencida';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Activa';
    }
  }

  getStatusDescription(status: string): string {
    switch (status) {
      case 'dispensed':
        return 'Receta dispensada en farmacia';
      case 'pending':
        return 'Receta pendiente de dispensar';
      case 'expired':
        return 'Receta vencida, no se puede dispensar';
      case 'cancelled':
        return 'Receta cancelada por el médico';
      default:
        return 'Estado de receta desconocido';
    }
  }

  // Navigation and action methods
  navigateToNewPrescription(): void {
    if (this.selectedPatient) {
      // Navegar a nueva receta con el paciente preseleccionado
      this.router.navigate(['/prescripciones/nueva', this.selectedPatient.id]);
    } else {
      // Navegar a nueva receta sin paciente preseleccionado
      this.router.navigate(['/prescripciones/nueva']);
    }
  }

  onEditPatient(): void {
    alert('Funcionalidad de edición de paciente será implementada próximamente.');
  }

  onViewAllPrescriptions(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  viewPrescriptionDetails(prescription: PrescriptionSummary): void {
    alert(`Ver detalles de la receta ${prescription.prescriptionNumber}\n\nDiagnóstico: ${prescription.diagnosis}\nMédico: ${prescription.doctor.name}\nFecha: ${prescription.date}`);
  }

  printPrescription(prescription: PrescriptionSummary): void {
    alert(`Imprimiendo receta ${prescription.prescriptionNumber}`);
  }

  exportPrescription(prescription: PrescriptionSummary): void {
    alert(`Exportando receta ${prescription.prescriptionNumber}`);
  }

  // Pagination methods
  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.totalPrescriptions);
  }

  getVisiblePages(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const visiblePages: number[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        visiblePages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          visiblePages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          visiblePages.push(i);
        }
      }
    }

    return visiblePages;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  onItemsPerPageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = +target.value;
    this.currentPage = 1;
  }

  // Utility methods
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  isRecentPrescription(dateString: string): boolean {
    const prescriptionDate = new Date(dateString);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return prescriptionDate >= thirtyDaysAgo;
  }

  retryLoading(): void {
    this.loadMockData();
  }

  navigateToPatientList(): void {
    alert('Navegando a la lista de pacientes...');
  }

  // TrackBy functions for performance
  trackByPrescriptionId(index: number, item: PrescriptionSummary): string {
    return item.id;
  }

  trackByDoctorName(index: number, item: string): string {
    return item;
  }

  trackByStatusValue(index: number, item: {value: any, label: string}): any {
    return item.value;
  }
}