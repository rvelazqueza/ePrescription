import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LucideAngularModule, Pill, Plus, Search, Filter, CheckCircle2, FileCheck, X, Clock } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';
import { RoleSuggestionService } from '../../../services/role-suggestion.service';

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
    private roleSuggestionService: RoleSuggestionService
  ) {}

  // Prescription selection state
  searchText = '';
  showFilters = false;
  
  // Mock data for prescription selection
  mockPrescriptionsForSelection: PrescriptionForSelection[] = [
    {
      prescriptionNumber: "RX-2025-009847",
      qrCode: "QR-9847-A3F2",
      token: "VRF-2025-9847-X8K4",
      patientName: "María Elena González Rodríguez",
      patientId: "CC-52.841.963",
      emittedDate: "27/09/2025",
      emittedTime: "10:32 a.m.",
      validUntil: "11/10/2025",
      medicinesCount: 3,
      dispensationStatus: "emitted",
      age: 45,
      gender: "F",
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      verificationStatus: "valid"
    },
    {
      prescriptionNumber: "RX-2025-009846",
      qrCode: "QR-9846-B7H9",
      token: "VRF-2025-9846-M2P5",
      patientName: "Juan Carlos Martínez López",
      patientId: "CC-41.523.789",
      emittedDate: "20/09/2025",
      emittedTime: "02:15 p.m.",
      validUntil: "04/10/2025",
      medicinesCount: 2,
      dispensationStatus: "emitted",
      age: 52,
      gender: "M",
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      verificationStatus: "valid"
    },
    {
      prescriptionNumber: "RX-2025-009845",
      qrCode: "QR-9845-C4J1",
      token: "VRF-2025-9845-N7R3",
      patientName: "Ana Patricia Ruiz Sánchez",
      patientId: "CC-39.654.321",
      emittedDate: "25/09/2025",
      emittedTime: "11:20 a.m.",
      validUntil: "09/10/2025",
      medicinesCount: 4,
      dispensationStatus: "fully_dispensed",
      age: 33,
      gender: "F",
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      verificationStatus: "already_dispensed"
    },
    {
      prescriptionNumber: "RX-2025-009844",
      qrCode: "QR-9844-D8K6",
      token: "VRF-2025-9844-Q1W9",
      patientName: "Roberto Antonio Silva Gómez",
      patientId: "CC-45.789.123",
      emittedDate: "28/09/2025",
      emittedTime: "09:00 a.m.",
      validUntil: "12/10/2025",
      medicinesCount: 1,
      dispensationStatus: "cancelled",
      age: 28,
      gender: "M",
      doctorName: "Dr. Carlos Alberto Mendoza Herrera",
      verificationStatus: "cancelled"
    }
  ];

  prescriptionData: PrescriptionData = {
    prescriptionNumber: "RX-2025-009847",
    patientId: "CC-52.841.963",
    patientName: "María Elena González Rodríguez",
    patientFirstLastName: "González",
    patientSecondLastName: "Rodríguez",
    patientGender: "Femenino",
    patientAge: 45,
    doctorName: "Dr. Carlos Alberto Mendoza Herrera",
    doctorCode: "RM-12345-COL",
    issueDate: "27/09/2025",
    issueTime: "10:32 a.m.",
    status: "draft"
  };

  medicines: Medicine[] = [
    {
      id: "1",
      name: "Ibuprofeno",
      quantity: "15 tabletas",
      dose: "400 mg",
      frequency: "3 veces al día",
      administration: "Oral",
      duration: "5 días",
      observations: ""
    },
    {
      id: "2",
      name: "Amoxicilina",
      quantity: "14 cápsulas",
      dose: "500 mg",
      frequency: "2 veces al día",
      administration: "Oral",
      duration: "7 días",
      observations: ""
    },
    {
      id: "3",
      name: "Omeprazol",
      quantity: "14 tabletas",
      dose: "20 mg",
      frequency: "1 vez al día",
      administration: "Oral",
      duration: "14 días",
      observations: ""
    }
  ];

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

    if (confirm('¿Está seguro de que desea completar la dispensación? Esta acción no se puede deshacer.')) {
      // Lógica para completar dispensación
      this.prescriptionData.status = 'completed';
      this.showSuccessMessage('Dispensación completada exitosamente');
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
    this.currentStep = 'dispense';
    
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
      doctorCode: "RM-12345-COL",
      issueDate: prescription.emittedDate,
      issueTime: prescription.emittedTime,
      status: "draft"
    };
    
    this.showSuccessMessage(`Receta seleccionada: ${prescription.prescriptionNumber} - ${prescription.patientName}`);
  }

  handleBackToSelection(): void {
    this.currentStep = 'select';
    this.selectedPrescription = null;
    // Reset dispensation data
    this.medicines = [
      {
        id: "1",
        name: "Ibuprofeno",
        quantity: "15 tabletas",
        dose: "400 mg",
        frequency: "3 veces al día",
        administration: "Oral",
        duration: "5 días",
        observations: ""
      },
      {
        id: "2",
        name: "Amoxicilina",
        quantity: "14 cápsulas",
        dose: "500 mg",
        frequency: "2 veces al día",
        administration: "Oral",
        duration: "7 días",
        observations: ""
      },
      {
        id: "3",
        name: "Omeprazol",
        quantity: "14 tabletas",
        dose: "20 mg",
        frequency: "1 vez al día",
        administration: "Oral",
        duration: "14 días",
        observations: ""
      }
    ];
  }

  // Prescription selection methods
  get filteredPrescriptions(): PrescriptionForSelection[] {
    return this.mockPrescriptionsForSelection.filter(prescription => {
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