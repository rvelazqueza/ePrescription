import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { LucideAngularModule, Users, UserCircle, FileText, Phone, Mail, Calendar, Activity, Heart, AlertTriangle, UserCheck, User, MapPin, Shield, Pill, Eye, ArrowRight, Plus, Edit, Stethoscope, Clock, CheckCircle, Upload, Download, Search, Filter, Image, FileImage } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';
import { RoleSuggestionService } from '../../../services/role-suggestion.service';

@Component({
  selector: 'app-perfil-paciente',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, BreadcrumbsComponent, RoleSuggestionModalComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilPacienteComponent implements OnInit, OnDestroy {
  // Icons
  usersIcon = Users;
  userCircleIcon = UserCircle;
  fileTextIcon = FileText;
  phoneIcon = Phone;
  mailIcon = Mail;
  calendarIcon = Calendar;
  activityIcon = Activity;
  heartIcon = Heart;
  alertTriangleIcon = AlertTriangle;
  userCheckIcon = UserCheck;
  userIcon = User;
  mapPinIcon = MapPin;
  shieldIcon = Shield;
  pillIcon = Pill;
  eyeIcon = Eye;
  arrowRightIcon = ArrowRight;
  plusIcon = Plus;
  editIcon = Edit;
  stethoscopeIcon = Stethoscope;
  clockIcon = Clock;
  checkCircleIcon = CheckCircle;
  uploadIcon = Upload;
  downloadIcon = Download;
  searchIcon = Search;
  filterIcon = Filter;
  imageIcon = Image;
  fileImageIcon = FileImage;

  // Tab state - simple
  activeTab = 'overview';

  // Breadcrumb items
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Pacientes', route: '/pacientes' },
    { label: 'Perfil del paciente' }
  ];

  // Role suggestion modal state
  showRoleSuggestionModal = signal(false);
  private subscriptions = new Subscription();

  constructor(
    private roleDemoService: RoleDemoService,
    private roleSuggestionService: RoleSuggestionService
  ) {}

  ngOnInit() {
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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private checkRoleSuggestion() {
    const currentSession = this.roleDemoService.getCurrentSession();
    
    console.log('🔍 Verificando rol en perfil paciente:', currentSession.activeRole);
    
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

  // Mock data - exactly from React original
  selectedPatient = {
    id: "PAT-001",
    fullName: "María Elena González Rodríguez",
    firstName: "María Elena",
    lastName: "González Rodríguez",
    idType: "CC",
    idNumber: "52.841.963",
    birthDate: "15/03/1980",
    age: 45,
    gender: "F",
    bloodType: "O+",
    phone: "+57 310 456-7890",
    email: "maria.gonzalez@email.com",
    address: "Calle 45 #23-67, Apto 301",
    city: "Bogotá",
    country: "Colombia",
    insuranceProvider: "Sanitas EPS",
    insuranceNumber: "SAN-2024-789456",
    allergies: ["Penicilina", "Sulfas", "Mariscos"],
    chronicConditions: ["Hipertensión arterial", "Diabetes tipo 2", "Hipotiroidismo"],
    currentMedications: [
      "Enalapril 10mg - 1 vez al día - Mañana",
      "Metformina 850mg - 2 veces al día - Desayuno y cena",
      "Levotiroxina 100mcg - 1 vez al día en ayunas"
    ],
    lastVisit: "27/09/2025",
    totalPrescriptions: 24,
    activePrescriptions: 2,
    registrationDate: "10/01/2020",
    status: "active",
    emergencyContact: {
      name: "Carlos González",
      relationship: "Esposo",
      phone: "+57 310 123-4567"
    },
    clinicalNotes: "Paciente con buena adherencia al tratamiento. Control periódico de glicemia y presión arterial. Última HbA1c: 6.5% (27/08/2025). Requiere seguimiento endocrinológico cada 3 meses.",
    weight: "68 kg",
    height: "1.65 m",
    bmi: "24.98",
    occupation: "Docente"
  };

  recentPrescriptions = [
    {
      id: "RX-001",
      prescriptionNumber: "RX-2025-001",
      date: "27/09/2025",
      doctor: {
        name: "Dr. Carlos Alberto Mendoza Herrera",
        specialty: "Medicina Interna"
      },
      medications: [
        { name: "Enalapril", dosage: "10mg" },
        { name: "Metformina", dosage: "850mg" }
      ],
      status: "dispensed",
      diagnosis: "Control HTA y Diabetes"
    },
    {
      id: "RX-002",
      prescriptionNumber: "RX-2025-002",
      date: "10/06/2025",
      doctor: {
        name: "Dra. Patricia Sánchez Vega",
        specialty: "Endocrinología"
      },
      medications: [
        { name: "Levotiroxina", dosage: "100mcg" }
      ],
      status: "dispensed",
      diagnosis: "Hipotiroidismo"
    },
    {
      id: "RX-003",
      prescriptionNumber: "RX-2025-003",
      date: "15/08/2025",
      doctor: {
        name: "Dr. Carlos Alberto Mendoza Herrera",
        specialty: "Medicina Interna"
      },
      medications: [
        { name: "Enalapril", dosage: "10mg" },
        { name: "Metformina", dosage: "850mg" }
      ],
      status: "expired",
      diagnosis: "Control de rutina"
    }
  ];

  // Timeline de eventos médicos - COMPLETO del archivo original
  timelineEvents = [
    {
      id: "evt-001",
      date: "27/09/2025",
      time: "10:30 a.m.",
      type: "prescription",
      title: "Nueva prescripción - Control HTA y Diabetes",
      description: "Renovación de medicamentos: Enalapril 10mg, Metformina 850mg. Paciente estable con buenos niveles de glicemia.",
      doctor: "Dr. Carlos Alberto Mendoza Herrera - Medicina Interna",
      status: "completed"
    },
    {
      id: "evt-002",
      date: "27/08/2025",
      time: "09:00 a.m.",
      type: "lab",
      title: "Resultados de laboratorio",
      description: "HbA1c: 6.5%, Glicemia en ayunas: 105 mg/dL, Perfil lipídico: valores normales. Control adecuado.",
      doctor: "Dr. Carlos Alberto Mendoza Herrera - Medicina Interna",
      status: "completed"
    },
    {
      id: "evt-003",
      date: "15/08/2025",
      time: "11:15 a.m.",
      type: "visit",
      title: "Control de rutina - Medicina Interna",
      description: "Paciente refiere buen estado general. PA: 125/80 mmHg. Peso estable. Se ordena laboratorio de control.",
      doctor: "Dr. Carlos Alberto Mendoza Herrera - Medicina Interna",
      status: "completed"
    },
    {
      id: "evt-004",
      date: "10/06/2025",
      time: "03:45 p.m.",
      type: "diagnosis",
      title: "Diagnóstico de Hipotiroidismo",
      description: "TSH elevada (8.5 mUI/L). Se inicia tratamiento con Levotiroxina 100mcg. Control en 6 semanas.",
      doctor: "Dra. Patricia Sánchez Vega - Endocrinología",
      status: "completed"
    },
    {
      id: "evt-005",
      date: "25/05/2025",
      time: "02:00 p.m.",
      type: "vaccination",
      title: "Vacunación - Influenza",
      description: "Vacuna contra influenza estacional 2025. Sin reacciones adversas.",
      doctor: "Enf. Laura Martínez - Vacunación",
      status: "completed"
    },
    {
      id: "evt-006",
      date: "18/03/2025",
      time: "10:00 a.m.",
      type: "allergy",
      title: "Registro de nueva alergia",
      description: "Paciente reporta reacción alérgica a mariscos (urticaria). Agregado a historial de alergias.",
      doctor: "Dr. Carlos Alberto Mendoza Herrera - Medicina Interna",
      status: "completed"
    }
  ];

  // Documentos clínicos - COMPLETO del archivo original
  clinicalDocuments = [
    {
      id: "DOC-001",
      name: "Hemograma completo - Septiembre 2025",
      type: "lab",
      category: "Laboratorio",
      date: "27/09/2025",
      uploadedBy: "Dr. Carlos Alberto Mendoza Herrera",
      size: "256 KB",
      format: "pdf",
      description: "Hemograma completo con recuento diferencial. Valores dentro de rangos normales."
    },
    {
      id: "DOC-002",
      name: "Radiografía de tórax - PA y lateral",
      type: "imaging",
      category: "Imagen diagnóstica",
      date: "20/09/2025",
      uploadedBy: "Dr. Roberto Jiménez - Radiología",
      size: "1.8 MB",
      format: "jpg",
      description: "Sin hallazgos patológicos. Campos pulmonares limpios. Silueta cardíaca normal."
    },
    {
      id: "DOC-003",
      name: "HbA1c y perfil lipídico - Agosto 2025",
      type: "lab",
      category: "Laboratorio",
      date: "27/08/2025",
      uploadedBy: "Dr. Carlos Alberto Mendoza Herrera",
      size: "198 KB",
      format: "pdf",
      description: "HbA1c: 6.5%, Colesterol total: 185 mg/dL, HDL: 52 mg/dL, LDL: 110 mg/dL"
    },
    {
      id: "DOC-004",
      name: "Informe consulta - Endocrinología",
      type: "report",
      category: "Informe médico",
      date: "15/08/2025",
      uploadedBy: "Dra. Patricia Sánchez Vega - Endocrinología",
      size: "142 KB",
      format: "pdf",
      description: "Evaluación de control tiroideo. Paciente con buen control de hipotiroidismo con Levotiroxina."
    },
    {
      id: "DOC-005",
      name: "Ecografía abdominal completa",
      type: "imaging",
      category: "Imagen diagnóstica",
      date: "10/07/2025",
      uploadedBy: "Dra. María Fernanda Castro - Radiología",
      size: "2.4 MB",
      format: "jpg",
      description: "Hígado, vesícula, páncreas, bazo y riñones sin alteraciones. Estudio normal."
    },
    {
      id: "DOC-006",
      name: "Consentimiento informado - Procedimiento",
      type: "consent",
      category: "Consentimiento",
      date: "05/07/2025",
      uploadedBy: "Dr. Carlos Alberto Mendoza Herrera",
      size: "325 KB",
      format: "pdf",
      description: "Consentimiento informado para realización de procedimiento diagnóstico."
    },
    {
      id: "DOC-007",
      name: "Perfil tiroideo completo - Junio 2025",
      type: "lab",
      category: "Laboratorio",
      date: "10/06/2025",
      uploadedBy: "Dra. Patricia Sánchez Vega - Endocrinología",
      size: "178 KB",
      format: "pdf",
      description: "TSH: 2.5 mUI/L, T4 libre: 1.2 ng/dL. Función tiroidea normalizada con tratamiento."
    },
    {
      id: "DOC-008",
      name: "Electrocardiograma de reposo",
      type: "exam",
      category: "Examen clínico",
      date: "28/05/2025",
      uploadedBy: "Dr. Jorge Luis Ramírez - Cardiología",
      size: "512 KB",
      format: "pdf",
      description: "ECG de 12 derivaciones. Ritmo sinusal normal. FC: 72 lpm. Sin alteraciones."
    },
    {
      id: "DOC-009",
      name: "Receta médica - Control mensual",
      type: "prescription",
      category: "Prescripción",
      date: "15/05/2025",
      uploadedBy: "Dr. Carlos Alberto Mendoza Herrera",
      size: "89 KB",
      format: "pdf",
      description: "Prescripción mensual: Enalapril 10mg, Metformina 850mg, Levotiroxina 100mcg"
    },
    {
      id: "DOC-010",
      name: "Certificado de vacunación - Influenza",
      type: "other",
      category: "Otro",
      date: "25/04/2025",
      uploadedBy: "Enf. Laura Martínez - Vacunación",
      size: "112 KB",
      format: "pdf",
      description: "Certificado de vacunación contra influenza estacional 2025"
    }
  ];

  // Simple getters for template
  get allergies() {
    return this.selectedPatient.allergies.map(allergy => ({ name: allergy }));
  }

  get chronicConditions() {
    return this.selectedPatient.chronicConditions.map(condition => ({ name: condition }));
  }

  // Simple methods
  getPatientInitials(): string {
    const names = this.selectedPatient.fullName.split(' ');
    return (names[0][0] + names[1][0]).toUpperCase();
  }

  getGenderText(gender: string): string {
    return gender === 'M' ? 'Masculino' : 'Femenino';
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  getTabButtonClass(tab: string): string {
    if (this.activeTab === tab) {
      return 'px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white';
    }
    return 'px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50';
  }

  getStandardTabClass(tab: string): string {
    const baseClasses = 'flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200';
    if (this.activeTab === tab) {
      return `${baseClasses} bg-white text-gray-900 shadow-sm`;
    }
    return `${baseClasses} text-gray-600 hover:text-gray-900 hover:bg-white/50`;
  }

  getPrescriptionStatusClass(status: string): string {
    switch (status) {
      case 'dispensed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPrescriptionStatusText(status: string): string {
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
        return 'Desconocido';
    }
  }

  // Helper methods for timeline events
  getEventTypeIcon(type: string): any {
    switch (type) {
      case 'prescription':
        return this.pillIcon;
      case 'lab':
        return this.fileTextIcon;
      case 'visit':
        return this.stethoscopeIcon;
      case 'diagnosis':
        return this.alertTriangleIcon;
      case 'vaccination':
        return this.shieldIcon;
      case 'allergy':
        return this.heartIcon;
      default:
        return this.activityIcon;
    }
  }

  getEventTypeColor(type: string): string {
    switch (type) {
      case 'prescription':
        return 'text-blue-600 bg-blue-100';
      case 'lab':
        return 'text-green-600 bg-green-100';
      case 'visit':
        return 'text-purple-600 bg-purple-100';
      case 'diagnosis':
        return 'text-red-600 bg-red-100';
      case 'vaccination':
        return 'text-indigo-600 bg-indigo-100';
      case 'allergy':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getEventTypeLabel(type: string): string {
    switch (type) {
      case 'prescription':
        return 'Prescripción';
      case 'lab':
        return 'Laboratorio';
      case 'visit':
        return 'Consulta';
      case 'diagnosis':
        return 'Diagnóstico';
      case 'vaccination':
        return 'Vacunación';
      case 'allergy':
        return 'Alergia';
      default:
        return 'Evento';
    }
  }

  // Helper methods for documents
  getDocumentTypeIcon(type: string): any {
    switch (type) {
      case 'lab':
        return this.fileTextIcon;
      case 'imaging':
        return this.fileImageIcon;
      case 'report':
        return this.fileTextIcon;
      case 'prescription':
        return this.pillIcon;
      case 'consent':
        return this.checkCircleIcon;
      case 'exam':
        return this.activityIcon;
      default:
        return this.fileTextIcon;
    }
  }

  getDocumentTypeColor(type: string): string {
    switch (type) {
      case 'lab':
        return 'text-green-600 bg-green-100';
      case 'imaging':
        return 'text-blue-600 bg-blue-100';
      case 'report':
        return 'text-purple-600 bg-purple-100';
      case 'prescription':
        return 'text-indigo-600 bg-indigo-100';
      case 'consent':
        return 'text-orange-600 bg-orange-100';
      case 'exam':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getFormatIcon(format: string): any {
    switch (format) {
      case 'pdf':
        return this.fileTextIcon;
      case 'jpg':
      case 'png':
        return this.imageIcon;
      default:
        return this.fileTextIcon;
    }
  }

  // Action methods - simple alerts
  onNewPrescription(): void {
    alert('Nueva receta - Funcionalidad será implementada próximamente');
  }

  onEditPatient(): void {
    alert('Editar perfil - Funcionalidad será implementada próximamente');
  }

  onViewAllPrescriptions(): void {
    alert('Ver todas las recetas - Funcionalidad será implementada próximamente');
  }

  onViewDocument(docId: string): void {
    const doc = this.clinicalDocuments.find(d => d.id === docId);
    if (doc) {
      alert(`Ver documento: ${doc.name}`);
    }
  }

  onDownloadDocument(docId: string): void {
    const doc = this.clinicalDocuments.find(d => d.id === docId);
    if (doc) {
      alert(`Descargar documento: ${doc.name}`);
    }
  }

  // Helper methods for document statistics
  getLabDocumentsCount(): number {
    return this.clinicalDocuments.filter(d => d.type === 'lab').length;
  }

  getImagingDocumentsCount(): number {
    return this.clinicalDocuments.filter(d => d.type === 'imaging').length;
  }

  getReportDocumentsCount(): number {
    return this.clinicalDocuments.filter(d => d.type === 'report').length;
  }

  getPrescriptionDocumentsCount(): number {
    return this.clinicalDocuments.filter(d => d.type === 'prescription').length;
  }
}