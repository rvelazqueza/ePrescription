import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LucideAngularModule, Pill, Plus, Search, Filter, CheckCircle2, FileCheck, X, Clock } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';
import { RoleSuggestionService } from '../../../services/role-suggestion.service';
import { PrescripcionesService } from '../../../services/prescripciones.service';
import { DispensationService } from '../../../services/dispensation.service';

export interface Medicine {
  id: string;
  name: string;
  quantity: string;
  dose: string;
  frequency: string;
  administration: string;
  duration: string;
  observations: string;
}

export interface PrescriptionData {
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  patientFirstLastName: string;
  patientSecondLastName: string;
  patientGender: string;
  patientAge: number;
  doctorName: string;
  doctorCode: string;
  issueDate: string;
  issueTime: string;
  status: 'draft' | 'completed';
}

export interface PrescriptionForSelection {
  prescriptionNumber: string;
  qrCode: string;
  token: string;
  patientName: string;
  patientId: string;
  emittedDate: string;
  emittedTime: string;
  validUntil: string;
  medicinesCount: number;
  dispensationStatus: 'emitted' | 'fully_dispensed' | 'cancelled';
  age: number;
  gender: 'M' | 'F';
  doctorName: string;
  verificationStatus: 'valid' | 'expired' | 'already_dispensed' | 'cancelled' | 'invalid';
}

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, BreadcrumbsComponent, RoleSuggestionModalComponent],
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarDispensacionComponent implements OnInit, OnDestroy {
  pillIcon = Pill;
  plusIcon = Plus;
  searchIcon = Search;
  filterIcon = Filter;
  checkCircle2Icon = CheckCircle2;
  fileCheckIcon = FileCheck;
  xIcon = X;
  clockIcon = Clock;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dispensación', route: '/dispensacion' },
    { label: 'Registrar Dispensación' }
  ];

  // Stepper state
  currentStep: 'select' | 'dispense' = 'select';
  selectedPrescription: PrescriptionForSelection | null = null;

  // Role suggestion modal state
  showRoleSuggestionModal = signal(false);
  private subscriptions = new Subscription();
  private readonly PAGE_NAME = 'registrar-dispensacion';

  constructor(
    private roleDemoService: RoleDemoService,
    private roleSuggestionService: RoleSuggestionService,
    private prescripcionesService: PrescripcionesService,
    private dispensationService: DispensationService
  ) {}

  // Prescription selection state
  searchText = '';
  showFilters = false;
  
  // Loading and error states
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  
  // Data from backend
  prescriptionsForSelection: PrescriptionForSelection[] = [];

  prescriptionData: PrescriptionData = {
    prescriptionNumber: "",
    patientId: "",
    patientName: "",
    patientFirstLastName: "",
    patientSecondLastName: "",
    patientGender: "",
    patientAge: 0,
    doctorName: "",
    doctorCode: "",
    issueDate: "",
    issueTime: "",
    status: "draft"
  };

  medicines: Medicine[] = [];

  // Modal state
  showMedicineModal = false;
  isEditMode = false;
  currentMedicine: Medicine = this.getEmptyMedicine();

  ngOnInit(): void {
    // Verificar si se debe mostrar el modal de sugerencia de rol
    this.checkRoleSuggestion();
    
    // Suscribirse a cambios de rol
    const roleSubscription = this.roleDemoService.currentSession$.subscribe(session => {
      if (session.activeRole === 'Farmacéutico') {
        this.showRoleSuggestionModal.set(false);
        this.roleSuggestionService.clearDismissedPages();
      }
    });
    
    this.subscriptions.add(roleSubscription);
    
    // Cargar prescripciones disponibles desde el backend
    this.loadAvailablePrescriptions();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private checkRoleSuggestion() {
    const currentSession = this.roleDemoService.getCurrentSession();
    
    if (currentSession.activeRole !== 'Farmacéutico' && 
        currentSession.activeRole !== 'Enfermera' && 
        currentSession.activeRole !== 'Administrador') {
      this.showRoleSuggestionModal.set(true);
    } else {
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

  getPatientInitials(): string {
    const names = this.prescriptionData.patientName.split(' ');
    return names.length >= 2 ? 
      (names[0][0] + names[1][0]).toUpperCase() : 
      names[0][0].toUpperCase();
  }

  trackByMedicineId(_index: number, medicine: Medicine): string {
    return medicine.id;
  }

  openAddMedicineModal(): void {
    this.isEditMode = false;
    this.currentMedicine = this.getEmptyMedicine();
    this.showMedicineModal = true;
  }

  openEditMedicineModal(medicine: Medicine): void {
    this.isEditMode = true;
    this.currentMedicine = { ...medicine };
    this.showMedicineModal = true;
  }

  closeMedicineModal(): void {
    this.showMedicineModal = false;
    this.currentMedicine = this.getEmptyMedicine();
  }

  saveMedicine(): void {
    if (this.isEditMode) {
      // Editar medicamento existente
      const index = this.medicines.findIndex(m => m.id === this.currentMedicine.id);
      if (index !== -1) {
        this.medicines[index] = { ...this.currentMedicine };
      }
    } else {
      // Agregar nuevo medicamento
      const newMedicine: Medicine = {
        ...this.currentMedicine,
        id: Date.now().toString()
      };
      this.medicines.push(newMedicine);
    }
    
    this.closeMedicineModal();
    this.showSuccessMessage(this.isEditMode ? 'Medicamento actualizado' : 'Medicamento agregado');
  }

  deleteMedicine(): void {
    if (this.isEditMode && this.currentMedicine.id) {
      const index = this.medicines.findIndex(m => m.id === this.currentMedicine.id);
      if (index !== -1) {
        this.medicines.splice(index, 1);
        this.closeMedicineModal();
        this.showSuccessMessage('Medicamento eliminado');
      }
    }
  }

  cancelDispensation(): void {
    if (confirm('¿Está seguro de que desea cancelar la dispensación? Se perderán todos los cambios no guardados.')) {
      // Lógica para cancelar dispensación
      this.showInfoMessage('Dispensación cancelada');
    }
  }

  saveDraft(): void {
    // Lógica para guardar borrador
    this.showSuccessMessage('Borrador guardado correctamente');
  }

  completeDispensation(): void {
    if (this.medicines.length === 0) {
      this.showErrorMessage('Debe agregar al menos un medicamento para completar la dispensación');
      return;
    }

    if (!this.selectedPrescription) {
      this.showErrorMessage('No hay prescripción seleccionada');
      return;
    }

    if (confirm('¿Está seguro de que desea completar la dispensación? Esta acción no se puede deshacer.')) {
      this.isLoading.set(true);
      
      // Preparar datos de dispensación para el backend
      const dispensationData = {
        prescriptionId: this.selectedPrescription.token,
        dispensedItems: this.medicines.map(med => ({
          medicationId: med.id,
          medicationName: med.name,
          quantityDispensed: parseInt(med.quantity) || 0,
          dosage: med.dose,
          frequency: med.frequency,
          route: med.administration,
          duration: parseInt(med.duration) || 0,
          instructions: med.observations
        })),
        notes: 'Dispensación completada desde el sistema',
        dispensedDate: new Date().toISOString()
      };

      // Registrar dispensación en el backend
      this.dispensationService.register(dispensationData as any).subscribe({
        next: (response: any) => {
          this.prescriptionData.status = 'completed';
          this.isLoading.set(false);
          this.showSuccessMessage('Dispensación completada exitosamente');
          
          // Volver a la selección de prescripciones
          setTimeout(() => {
            this.handleBackToSelection();
            this.loadAvailablePrescriptions();
          }, 2000);
        },
        error: (error: any) => {
          console.error('Error al completar dispensación:', error);
          this.errorMessage.set('No se pudo completar la dispensación');
          this.isLoading.set(false);
          this.showErrorMessage('Error al completar la dispensación. Por favor intente nuevamente.');
        }
      });
    }
  }

  private getEmptyMedicine(): Medicine {
    return {
      id: '',
      name: '',
      quantity: '',
      dose: '',
      frequency: '',
      administration: '',
      duration: '',
      observations: ''
    };
  }

  private showSuccessMessage(message: string): void {
    // Implementar notificación de éxito
    console.log('Success:', message);
  }

  private showErrorMessage(message: string): void {
    // Implementar notificación de error
    console.log('Error:', message);
  }

  private showInfoMessage(message: string): void {
    // Implementar notificación informativa
    console.log('Info:', message);
  }

  // Stepper methods
  handleSelectPrescription(prescription: PrescriptionForSelection): void {
    this.selectedPrescription = prescription;
    this.isLoading.set(true);
    
    // Cargar detalles completos de la prescripción desde el backend
    this.prescripcionesService.getPrescriptionById(prescription.token).subscribe({
      next: (fullPrescription: any) => {
        // Update prescription data for the dispensation step
        this.prescriptionData = {
          prescriptionNumber: prescription.prescriptionNumber,
          patientId: prescription.patientId,
          patientName: prescription.patientName,
          patientFirstLastName: prescription.patientName.split(' ')[1] || '',
          patientSecondLastName: prescription.patientName.split(' ')[2] || '',
          patientGender: prescription.gender === 'M' ? 'Masculino' : 'Femenino',
          patientAge: prescription.age,
          doctorName: prescription.doctorName,
          doctorCode: fullPrescription.doctor?.licenseNumber || "---",
          issueDate: prescription.emittedDate,
          issueTime: prescription.emittedTime,
          status: "draft"
        };
        
        // Cargar medicamentos de la prescripción
        this.medicines = fullPrescription.medications?.map((med: any, index: number) => ({
          id: (index + 1).toString(),
          name: med.medicationName || med.name || '',
          quantity: `${med.quantity || 0} ${med.unit || 'unidades'}`,
          dose: med.dosage || '',
          frequency: med.frequency || '',
          administration: med.route || 'Oral',
          duration: `${med.duration || 0} días`,
          observations: med.instructions || ''
        })) || [];
        
        this.currentStep = 'dispense';
        this.isLoading.set(false);
        this.showSuccessMessage(`Receta seleccionada: ${prescription.prescriptionNumber} - ${prescription.patientName}`);
      },
      error: (error: any) => {
        console.error('Error al cargar detalles de prescripción:', error);
        this.errorMessage.set('No se pudieron cargar los detalles de la prescripción');
        this.isLoading.set(false);
      }
    });
  }

  handleBackToSelection(): void {
    this.currentStep = 'select';
    this.selectedPrescription = null;
    // Reset dispensation data
    this.medicines = [];
    this.prescriptionData = {
      prescriptionNumber: "",
      patientId: "",
      patientName: "",
      patientFirstLastName: "",
      patientSecondLastName: "",
      patientGender: "",
      patientAge: 0,
      doctorName: "",
      doctorCode: "",
      issueDate: "",
      issueTime: "",
      status: "draft"
    };
  }

  /**
   * Carga las prescripciones disponibles desde el backend
   */
  private loadAvailablePrescriptions(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Obtener prescripciones con estado "Emitted" (disponibles para dispensar)
    this.prescripcionesService.getPrescripciones({ status: 'Emitted' }).subscribe({
      next: (response) => {
        const prescriptions = response.items || [];
        this.prescriptionsForSelection = prescriptions.map(p => this.mapPrescriptionToSelection(p));
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error al cargar prescripciones:', error);
        this.errorMessage.set('No se pudieron cargar las prescripciones disponibles');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Mapea una prescripción del backend al formato PrescriptionForSelection
   */
  private mapPrescriptionToSelection(prescription: any): PrescriptionForSelection {
    // Determinar el estado de verificación
    let verificationStatus: 'valid' | 'expired' | 'already_dispensed' | 'cancelled' | 'invalid' = 'valid';
    
    // Usar valores en minúsculas que coinciden con el backend
    if (prescription.status === 'cancelled') {
      verificationStatus = 'cancelled';
    } else if (prescription.status === 'dispensed') {
      verificationStatus = 'already_dispensed';
    } else if (prescription.validUntil && new Date(prescription.validUntil) < new Date()) {
      verificationStatus = 'expired';
    }

    // Mapear el estado de dispensación
    let dispensationStatus: 'emitted' | 'fully_dispensed' | 'cancelled' = 'emitted';
    if (prescription.status === 'dispensed') {
      dispensationStatus = 'fully_dispensed';
    } else if (prescription.status === 'cancelled') {
      dispensationStatus = 'cancelled';
    }

    return {
      prescriptionNumber: prescription.prescriptionNumber || prescription.id,
      qrCode: prescription.qrCode || '',
      token: prescription.id,
      patientName: prescription.patientName || `${prescription.patient?.firstName || ''} ${prescription.patient?.lastName || ''}`.trim(),
      patientId: prescription.patient?.identificationNumber || '---',
      emittedDate: prescription.prescriptionDate ? new Date(prescription.prescriptionDate).toLocaleDateString('es-ES') : '---',
      emittedTime: prescription.prescriptionDate ? new Date(prescription.prescriptionDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '---',
      validUntil: prescription.validUntil ? new Date(prescription.validUntil).toLocaleDateString('es-ES') : '---',
      medicinesCount: prescription.medications?.length || 0,
      dispensationStatus: dispensationStatus,
      age: this.calculateAge(prescription.patient?.dateOfBirth),
      gender: prescription.patient?.gender === 'Male' ? 'M' : 'F',
      doctorName: prescription.doctorName || `${prescription.doctor?.firstName || ''} ${prescription.doctor?.lastName || ''}`.trim(),
      verificationStatus: verificationStatus
    };
  }

  /**
   * Calcula la edad a partir de la fecha de nacimiento
   */
  private calculateAge(dateOfBirth: string | undefined): number {
    if (!dateOfBirth) return 0;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Prescription selection methods
  get filteredPrescriptions(): PrescriptionForSelection[] {
    return this.prescriptionsForSelection.filter(prescription => {
      const searchLower = this.searchText.toLowerCase();
      return prescription.prescriptionNumber.toLowerCase().includes(searchLower) ||
             prescription.patientName.toLowerCase().includes(searchLower) ||
             prescription.patientId.toLowerCase().includes(searchLower);
    });
  }

  get availablePrescriptionsCount(): number {
    return this.filteredPrescriptions.filter(p => p.verificationStatus === 'valid').length;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  getStatusBadge(status: string): { label: string; className: string } {
    const config: Record<string, { label: string; className: string }> = {
      valid: { label: "Válida", className: "bg-green-100 text-green-700 border-green-300" },
      expired: { label: "Vencida", className: "bg-red-100 text-red-700 border-red-300" },
      cancelled: { label: "Anulada", className: "bg-red-100 text-red-700 border-red-300" },
      already_dispensed: { label: "Ya dispensada", className: "bg-orange-100 text-orange-700 border-orange-300" },
      invalid: { label: "No válida", className: "bg-red-100 text-red-700 border-red-300" }
    };
    return config[status] || config['invalid'];
  }

  canSelectPrescription(prescription: PrescriptionForSelection): boolean {
    return prescription.verificationStatus === 'valid';
  }
}