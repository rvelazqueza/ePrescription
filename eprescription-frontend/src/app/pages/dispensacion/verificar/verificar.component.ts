import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { 
  LucideAngularModule, 
  ShieldCheck, 
  QrCode, 
  Key, 
  Scan, 
  Camera, 
  Hash,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  Pill,
  X,
  ArrowRight,
  Printer,
  Download,
  XCircle,
  AlertCircle,
  ShieldX
} from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';
import { RoleSuggestionService } from '../../../services/role-suggestion.service';
import { RoleChangeModalService } from '../../../services/role-change-modal.service';

interface VerificationResult {
  prescriptionNumber: string;
  qrCode?: string;
  token?: string;
  patientName: string;
  patientId: string;
  emittedDate: string;
  emittedTime: string;
  validUntil: string;
  medicinesCount: number;
  dispensationStatus: 'emitted' | 'partially_dispensed' | 'fully_dispensed' | 'cancelled' | 'expired';
  age: number;
  gender: 'M' | 'F';
  doctorName: string;
  verificationStatus: 'valid' | 'expired' | 'cancelled' | 'already_dispensed' | 'invalid';
  verifiedAt?: string;
}

interface RecentVerification extends VerificationResult {
  verifiedAt: string;
}

@Component({
  selector: 'app-verificar-receta',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, BreadcrumbsComponent, RoleSuggestionModalComponent],
  templateUrl: './verificar.component.html',
  styleUrls: ['./verificar.component.css']
})
export class VerificarRecetaComponent implements OnInit, OnDestroy {
  // Icons
  shieldCheckIcon = ShieldCheck;
  qrCodeIcon = QrCode;
  keyIcon = Key;
  scanIcon = Scan;
  cameraIcon = Camera;
  hashIcon = Hash;
  checkCircle2Icon = CheckCircle2;
  alertTriangleIcon = AlertTriangle;
  clockIcon = Clock;
  userIcon = User;
  calendarIcon = Calendar;
  pillIcon = Pill;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dispensación', route: '/dispensacion' },
    { label: 'Verificar Receta' }
  ];
  xIcon = X;
  arrowRightIcon = ArrowRight;
  printerIcon = Printer;
  downloadIcon = Download;
  xCircleIcon = XCircle;
  alertCircleIcon = AlertCircle;
  shieldXIcon = ShieldX;

  // State
  verificationMethod = signal<'qr' | 'token'>('qr');
  qrInput = '';
  tokenInput = '';
  isScanning = signal(false);
  verificationResult = signal<VerificationResult | null>(null);
  isResultOpen = signal(false);
  recentVerifications = signal<RecentVerification[]>([]);
  
  // Role suggestion modal state
  showRoleSuggestionModal = signal(false);
  private subscriptions = new Subscription();
  private readonly PAGE_NAME = 'verificar-receta';

  constructor(
    private roleDemoService: RoleDemoService,
    private roleSuggestionService: RoleSuggestionService,
    private roleChangeModalService: RoleChangeModalService
  ) {}

  // Mock data
  mockPrescriptions: VerificationResult[] = [
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
      verificationStatus: "expired"
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

  ngOnInit() {
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

  /**
   * Método para cambiar de rol manualmente usando el modal de confirmación
   */
  changeToPharmacistRole() {
    const currentSession = this.roleDemoService.getCurrentSession();
    this.roleChangeModalService.openRoleChangeModal(
      currentSession.activeRole, 
      'Farmacéutico', 
      'dispensacion-verificar'
    );
  }

  setVerificationMethod(method: 'qr' | 'token') {
    this.verificationMethod.set(method);
  }

  startQRScan() {
    this.isScanning.set(true);
    
    // Simular escaneo después de 2 segundos
    setTimeout(() => {
      this.isScanning.set(false);
      const mockQR = "QR-9847-A3F2";
      this.qrInput = mockQR;
      this.verifyByQR(mockQR);
    }, 2000);
  }

  stopScanning() {
    this.isScanning.set(false);
  }

  verifyByQR(qrCode?: string) {
    const codeToVerify = qrCode || this.qrInput;
    
    if (!codeToVerify.trim()) {
      alert('Por favor ingresa o escanea un código QR');
      return;
    }

    // Buscar receta por QR
    const prescription = this.mockPrescriptions.find(
      p => p.qrCode?.toLowerCase() === codeToVerify.toLowerCase()
    );

    if (prescription) {
      this.verificationResult.set(prescription);
      this.isResultOpen.set(true);
      this.addToRecentVerifications(prescription);
    } else {
      const invalidResult: VerificationResult = {
        prescriptionNumber: "Desconocido",
        qrCode: codeToVerify,
        patientName: "No identificado",
        patientId: "---",
        emittedDate: "---",
        emittedTime: "---",
        validUntil: "---",
        medicinesCount: 0,
        dispensationStatus: "cancelled",
        age: 0,
        gender: "M",
        doctorName: "---",
        verificationStatus: "invalid"
      };
      
      this.verificationResult.set(invalidResult);
      this.isResultOpen.set(true);
    }
  }

  verifyByToken() {
    if (!this.tokenInput.trim()) {
      alert('Por favor ingresa un token de verificación');
      return;
    }

    // Buscar receta por token
    const prescription = this.mockPrescriptions.find(
      p => p.token?.toLowerCase() === this.tokenInput.toLowerCase()
    );

    if (prescription) {
      this.verificationResult.set(prescription);
      this.isResultOpen.set(true);
      this.addToRecentVerifications(prescription);
    } else {
      const invalidResult: VerificationResult = {
        prescriptionNumber: "Desconocido",
        token: this.tokenInput,
        patientName: "No identificado",
        patientId: "---",
        emittedDate: "---",
        emittedTime: "---",
        validUntil: "---",
        medicinesCount: 0,
        dispensationStatus: "cancelled",
        age: 0,
        gender: "M",
        doctorName: "---",
        verificationStatus: "invalid"
      };
      
      this.verificationResult.set(invalidResult);
      this.isResultOpen.set(true);
    }
  }

  onTokenInput(event: any) {
    this.tokenInput = event.target.value.toUpperCase();
  }

  useExampleToken(token: string | undefined) {
    if (token) {
      this.tokenInput = token;
      this.verifyByToken();
    }
  }

  addToRecentVerifications(prescription: VerificationResult) {
    const verification: RecentVerification = {
      ...prescription,
      verifiedAt: new Date().toLocaleString('es-ES'),
    };
    
    const current = this.recentVerifications();
    const filtered = current.filter(v => v.prescriptionNumber !== prescription.prescriptionNumber);
    this.recentVerifications.set([verification, ...filtered].slice(0, 5));
  }

  viewRecentVerification(verification: RecentVerification) {
    this.verificationResult.set(verification);
    this.isResultOpen.set(true);
  }

  closeResult() {
    this.isResultOpen.set(false);
  }

  proceedToDispensation(prescriptionNumber: string) {
    alert(`Redirigiendo a dispensación para ${prescriptionNumber}`);
    this.closeResult();
  }

  printPrescription(prescriptionNumber: string) {
    alert(`Imprimiendo receta ${prescriptionNumber}`);
  }

  canDispense(result: VerificationResult): boolean {
    return result.verificationStatus === 'valid';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      valid: "Válida",
      expired: "Vencida",
      cancelled: "Anulada",
      already_dispensed: "Ya dispensada",
      invalid: "No válida"
    };
    return labels[status] || "Desconocido";
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      valid: "bg-green-100 text-green-700 border-green-300",
      expired: "bg-red-100 text-red-700 border-red-300",
      cancelled: "bg-red-100 text-red-700 border-red-300",
      already_dispensed: "bg-orange-100 text-orange-700 border-orange-300",
      invalid: "bg-red-100 text-red-700 border-red-300"
    };
    return classes[status] || classes['invalid'];
  }

  getStatusContainerClass(status: string): string {
    const classes: Record<string, string> = {
      valid: "bg-green-50 border-green-200",
      expired: "bg-red-50 border-red-200",
      cancelled: "bg-red-50 border-red-200",
      already_dispensed: "bg-orange-50 border-orange-200",
      invalid: "bg-red-50 border-red-200"
    };
    return classes[status] || classes['invalid'];
  }

  getStatusIcon(status: string) {
    const icons: Record<string, any> = {
      valid: CheckCircle2,
      expired: AlertCircle,
      cancelled: XCircle,
      already_dispensed: AlertTriangle,
      invalid: ShieldX
    };
    return icons[status] || ShieldX;
  }

  getStatusIconClass(status: string): string {
    const classes: Record<string, string> = {
      valid: "text-green-900",
      expired: "text-red-900",
      cancelled: "text-red-900",
      already_dispensed: "text-orange-900",
      invalid: "text-red-900"
    };
    return classes[status] || classes['invalid'];
  }

  getStatusTextClass(status: string): string {
    const classes: Record<string, string> = {
      valid: "text-green-900",
      expired: "text-red-900",
      cancelled: "text-red-900",
      already_dispensed: "text-orange-900",
      invalid: "text-red-900"
    };
    return classes[status] || classes['invalid'];
  }

  getStatusDescriptionClass(status: string): string {
    const classes: Record<string, string> = {
      valid: "text-green-900/80",
      expired: "text-red-900/80",
      cancelled: "text-red-900/80",
      already_dispensed: "text-orange-900/80",
      invalid: "text-red-900/80"
    };
    return classes[status] || classes['invalid'];
  }

  getStatusDescription(status: string): string {
    const descriptions: Record<string, string> = {
      valid: "La receta es válida y puede ser dispensada",
      expired: "La receta ha expirado su período de validez",
      cancelled: "Esta receta fue anulada por el médico prescriptor",
      already_dispensed: "Esta receta ya fue completamente dispensada",
      invalid: "No se pudo verificar la autenticidad de esta receta"
    };
    return descriptions[status] || descriptions['invalid'];
  }

  getCannotDispenseReason(status: string): string {
    const reasons: Record<string, string> = {
      expired: "Esta receta ha expirado su período de validez y no puede ser dispensada.",
      cancelled: "Esta receta fue anulada por el médico y no puede ser dispensada.",
      already_dispensed: "Esta receta ya fue completamente dispensada anteriormente.",
      invalid: "No se pudo verificar la autenticidad de esta receta."
    };
    return reasons[status] || "No se puede dispensar esta receta.";
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-ES');
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  getMedicines(result: VerificationResult) {
    // Medicamentos de ejemplo
    const medicines = [
      { name: "Ibuprofeno", dose: "400 mg", quantity: "15 tabletas", dispensed: result.dispensationStatus === 'fully_dispensed' },
      { name: "Amoxicilina", dose: "500 mg", quantity: "14 cápsulas", dispensed: result.dispensationStatus === 'fully_dispensed' },
      { name: "Omeprazol", dose: "20 mg", quantity: "14 tabletas", dispensed: false }
    ];
    return medicines.slice(0, result.medicinesCount);
  }

  getStatusHeaderClass(status: string): string {
    const classes: Record<string, string> = {
      valid: "bg-gradient-to-r from-green-600 to-green-700",
      expired: "bg-gradient-to-r from-red-600 to-red-700",
      cancelled: "bg-gradient-to-r from-red-600 to-red-700",
      already_dispensed: "bg-gradient-to-r from-orange-600 to-orange-700",
      invalid: "bg-gradient-to-r from-red-600 to-red-700"
    };
    return classes[status] || classes['invalid'];
  }

  getStatusHeaderTextClass(status: string): string {
    const classes: Record<string, string> = {
      valid: "text-green-100",
      expired: "text-red-100",
      cancelled: "text-red-100",
      already_dispensed: "text-orange-100",
      invalid: "text-red-100"
    };
    return classes[status] || classes['invalid'];
  }
}