import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LucideAngularModule, Building2, MapPin, Phone, Users, FileText, Clock, Plus, Search, Eye, Edit, X, ChevronLeft, ChevronRight, Filter, Download, MoreVertical, Ban, Send, Info, CheckCircle, AlertCircle, XCircle } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';
import { RoleSuggestionService } from '../../../services/role-suggestion.service';

interface CentroMedico {
  id: string;
  codigo: string;
  nombre: string;
  tipo: 'Hospital' | 'Clínica' | 'Centro de Salud' | 'Consultorio';
  ubicacion: string;
  telefono: string;
  responsable: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

interface AsignacionCentro {
  id: string;
  centroMedico: string;
  codigo: string;
  cargo: string;
  horario: string;
  principal: boolean;
  estado: 'APROBADA' | 'PENDIENTE' | 'RECHAZADA';
  fechaSolicitud: string;
  fechaRespuesta?: string;
}

@Component({
  selector: 'app-centros-medicos',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, BreadcrumbsComponent, PageHeaderComponent, RoleSuggestionModalComponent],
  templateUrl: './centros.component.html',
  styleUrls: ['./centros.component.css']
})
export class CentrosMedicosComponent implements OnInit, OnDestroy {
  // Icons
  building2Icon = Building2;
  mapPinIcon = MapPin;
  phoneIcon = Phone;
  usersIcon = Users;
  fileTextIcon = FileText;
  clockIcon = Clock;
  plusIcon = Plus;
  searchIcon = Search;
  eyeIcon = Eye;
  editIcon = Edit;
  xIcon = X;
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;
  filterIcon = Filter;
  downloadIcon = Download;
  moreVerticalIcon = MoreVertical;
  banIcon = Ban;
  sendIcon = Send;
  infoIcon = Info;
  checkCircleIcon = CheckCircle;
  alertCircleIcon = AlertCircle;
  xCircleIcon = XCircle;

  // Estado de la aplicación
  tabActiva: 'asignaciones' | 'disponibles' = 'asignaciones';
  mostrarMayusculas = false;
  
  // Filtros y búsqueda
  busqueda = '';
  filtroTipo = '';
  filtroEstado = '';
  filtroEstadoAsignacion = '';
  
  // Paginación
  paginaActual = 1;
  elementosPorPagina = 10;
  
  // Modales
  asignacionSeleccionada: AsignacionCentro | null = null;
  centroSeleccionado: CentroMedico | null = null;
  mostrarModalCancelar = false;
  asignacionACancelar: AsignacionCentro | null = null;
  motivoCancelacion = '';
  mostrarModalSolicitar = false;
  centroParaSolicitud: CentroMedico | null = null;
  modalAccionesCentroAbierto: string | null = null;
  modalAccionesAsignacionAbierto: string | null = null;
  
  // Datos del formulario de solicitud
  solicitudData = {
    cargo: '',
    horario: '',
    centroPrincipal: false,
    observaciones: ''
  };

  // Role suggestion modal state
  showRoleSuggestionModal = signal(false);
  private subscriptions = new Subscription();

  // Arrays filtrados
  asignacionesFiltradas: AsignacionCentro[] = [];
  centrosFiltrados: CentroMedico[] = [];

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Prescripciones', route: '/prescripciones' },
    { label: 'Centros Médicos'}
  ];

  // Datos de mis asignaciones
  misAsignaciones: AsignacionCentro[] = [
    {
      id: 'ASG-001',
      centroMedico: 'Hospital San Juan de Dios',
      codigo: 'HSJD-2024',
      cargo: 'Médico Especialista',
      horario: 'Lunes a Viernes, 8:00 AM - 4:00 PM',
      principal: true,
      estado: 'APROBADA',
      fechaSolicitud: '9/14/2024',
      fechaRespuesta: '9/15/2024'
    },
    {
      id: 'ASG-002',
      centroMedico: 'Clínica Bíblica',
      codigo: 'CB-2024',
      cargo: 'Médico Consultor',
      horario: 'Martes y Jueves, 2:00 PM - 6:00 PM',
      principal: false,
      estado: 'APROBADA',
      fechaSolicitud: '9/19/2024',
      fechaRespuesta: '9/20/2024'
    },
    {
      id: 'ASG-003',
      centroMedico: 'CAIS Moravia',
      codigo: 'CAIS-MOR-2024',
      cargo: 'Médico de Guardia',
      horario: 'Fines de semana',
      principal: false,
      estado: 'PENDIENTE',
      fechaSolicitud: '10/4/2024'
    }
  ];

  // Datos de centros disponibles
  centrosDisponibles: CentroMedico[] = [
    {
      id: 'CM-001',
      codigo: 'HSJD-2024',
      nombre: 'Hospital San Juan de Dios',
      tipo: 'Hospital',
      ubicacion: 'San José, San José',
      telefono: '2257-6202',
      responsable: 'Dr. Carlos Rodríguez Mora',
      estado: 'ACTIVO'
    },
    {
      id: 'CM-002',
      codigo: 'CB-2024',
      nombre: 'Clínica Bíblica',
      tipo: 'Clínica',
      ubicacion: 'San José, San José',
      telefono: '2522-1000',
      responsable: 'Dra. Ana María Solís',
      estado: 'ACTIVO'
    },
    {
      id: 'CM-003',
      codigo: 'CAIS-MOR-2024',
      nombre: 'CAIS Moravia',
      tipo: 'Centro de Salud',
      ubicacion: 'Moravia, San José',
      telefono: '2240-5678',
      responsable: 'Dr. Roberto Jiménez Castro',
      estado: 'ACTIVO'
    },
    {
      id: 'CM-004',
      codigo: 'CONS-PER-2024',
      nombre: 'Consultorio Dr. Pérez',
      tipo: 'Consultorio',
      ubicacion: 'Escazú, San José',
      telefono: '2228-9876',
      responsable: 'Dr. Juan Pérez González',
      estado: 'ACTIVO'
    }
  ];

  constructor(
    private roleDemoService: RoleDemoService,
    private roleSuggestionService: RoleSuggestionService
  ) {
    this.filtrarDatos();
  }

  ngOnInit() {
    // Verificar si se debe mostrar el modal de sugerencia de rol
    this.checkRoleSuggestion();
    
    // Suscribirse a cambios de rol
    const roleSubscription = this.roleDemoService.currentSession$.subscribe(session => {
      if (session.activeRole === 'Médico') {
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
    
    if (currentSession.activeRole !== 'Médico' && 
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

  // Computed properties para paginación
  get totalPaginas(): number {
    const total = this.tabActiva === 'asignaciones' 
      ? this.asignacionesFiltradas.length 
      : this.centrosFiltrados.length;
    return Math.ceil(total / this.elementosPorPagina);
  }

  get asignacionesPaginadas(): AsignacionCentro[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.asignacionesFiltradas.slice(inicio, fin);
  }

  get centrosPaginados(): CentroMedico[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.centrosFiltrados.slice(inicio, fin);
  }

  // Métodos de filtrado
  filtrarDatos() {
    this.paginaActual = 1;
    
    if (this.tabActiva === 'asignaciones') {
      this.asignacionesFiltradas = this.misAsignaciones.filter(asignacion => {
        const cumpleBusqueda = !this.busqueda || 
          asignacion.centroMedico.toLowerCase().includes(this.busqueda.toLowerCase()) ||
          asignacion.codigo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
          asignacion.cargo.toLowerCase().includes(this.busqueda.toLowerCase());
        
        const cumpleEstado = !this.filtroEstadoAsignacion || asignacion.estado === this.filtroEstadoAsignacion;

        return cumpleBusqueda && cumpleEstado;
      });
    } else {
      this.centrosFiltrados = this.centrosDisponibles.filter(centro => {
        const cumpleBusqueda = !this.busqueda || 
          centro.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
          centro.codigo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
          centro.ubicacion.toLowerCase().includes(this.busqueda.toLowerCase()) ||
          centro.responsable.toLowerCase().includes(this.busqueda.toLowerCase());
        
        const cumpleTipo = !this.filtroTipo || centro.tipo === this.filtroTipo;
        const cumpleEstado = !this.filtroEstado || centro.estado === this.filtroEstado;

        return cumpleBusqueda && cumpleTipo && cumpleEstado;
      });
    }
  }

  // Métodos de conteo para estadísticas
  contarAsignacionesPorEstado(estado: string): number {
    return this.misAsignaciones.filter(a => a.estado === estado).length;
  }

  contarCentrosPorEstado(estado: string): number {
    return this.centrosDisponibles.filter(c => c.estado === estado).length;
  }

  contarCentrosPrincipales(): number {
    return this.misAsignaciones.filter(a => a.principal && a.estado === 'APROBADA').length;
  }

  getCentroPrincipal(): AsignacionCentro | undefined {
    return this.misAsignaciones.find(a => a.principal && a.estado === 'APROBADA');
  }

  // Métodos de estilo
  getTipoClass(tipo: string): string {
    switch (tipo) {
      case 'Hospital':
        return 'bg-red-100 text-red-800';
      case 'Clínica':
        return 'bg-purple-100 text-purple-800';
      case 'Centro de Salud':
        return 'bg-teal-100 text-teal-800';
      case 'Consultorio':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getEstadoCentroClass(estado: string): string {
    return estado === 'ACTIVO' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }

  getEstadoAsignacionClass(estado: string): string {
    switch (estado) {
      case 'APROBADA':
        return 'bg-green-100 text-green-800';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'RECHAZADA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Métodos de navegación y paginación
  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  cambiarElementosPorPagina() {
    this.paginaActual = 1;
  }

  toggleMayusculas() {
    this.mostrarMayusculas = !this.mostrarMayusculas;
  }

  // Métodos de modales - Detalle de asignación
  verDetalleAsignacion(asignacion: AsignacionCentro) {
    this.asignacionSeleccionada = asignacion;
  }

  cerrarModalDetalle() {
    this.asignacionSeleccionada = null;
  }

  // Métodos de modales - Detalle de centro médico
  verDetalleCentro(centro: CentroMedico) {
    this.centroSeleccionado = centro;
  }

  cerrarModalDetalleCentro() {
    this.centroSeleccionado = null;
  }

  // Métodos para modal de acciones de centro
  toggleAccionesCentroModal(centroId: string) {
    this.modalAccionesCentroAbierto = this.modalAccionesCentroAbierto === centroId ? null : centroId;
  }

  cerrarModalAccionesCentro() {
    this.modalAccionesCentroAbierto = null;
  }

  // Métodos para modal de acciones de asignación
  toggleAccionesAsignacionModal(asignacionId: string) {
    this.modalAccionesAsignacionAbierto = this.modalAccionesAsignacionAbierto === asignacionId ? null : asignacionId;
  }

  cerrarModalAccionesAsignacion() {
    this.modalAccionesAsignacionAbierto = null;
  }

  // Métodos de modales - Cancelar asignación
  cancelarAsignacion(asignacion: AsignacionCentro) {
    this.asignacionACancelar = asignacion;
    this.mostrarModalCancelar = true;
    this.motivoCancelacion = '';
  }

  cerrarModalCancelar() {
    this.mostrarModalCancelar = false;
    this.asignacionACancelar = null;
    this.motivoCancelacion = '';
  }

  confirmarCancelacion() {
    if (this.asignacionACancelar && this.motivoCancelacion.trim()) {
      // Eliminar la asignación de la lista
      const index = this.misAsignaciones.findIndex(a => a.id === this.asignacionACancelar!.id);
      if (index > -1) {
        this.misAsignaciones.splice(index, 1);
        this.filtrarDatos();
      }
      
      console.log('Asignación cancelada:', this.asignacionACancelar, 'Motivo:', this.motivoCancelacion);
      this.cerrarModalCancelar();
      
      // Mostrar mensaje de éxito
      alert('Asignación cancelada exitosamente');
    }
  }

  // Métodos de modales - Solicitar asignación
  abrirModalSolicitar() {
    this.centroParaSolicitud = null;
    this.mostrarModalSolicitar = true;
    this.limpiarFormularioSolicitud();
  }

  solicitarAsignacion(centro: CentroMedico) {
    this.centroParaSolicitud = centro;
    this.mostrarModalSolicitar = true;
    this.limpiarFormularioSolicitud();
  }

  cerrarModalSolicitar() {
    this.mostrarModalSolicitar = false;
    this.centroParaSolicitud = null;
    this.limpiarFormularioSolicitud();
  }

  limpiarFormularioSolicitud() {
    this.solicitudData = {
      cargo: '',
      horario: '',
      centroPrincipal: false,
      observaciones: ''
    };
  }

  enviarSolicitud() {
    if (this.centroParaSolicitud && this.solicitudData.cargo.trim() && this.solicitudData.horario.trim()) {
      // Crear nueva asignación pendiente
      const nuevaAsignacion: AsignacionCentro = {
        id: `ASG-${Date.now()}`,
        centroMedico: this.centroParaSolicitud.nombre,
        codigo: this.centroParaSolicitud.codigo,
        cargo: this.solicitudData.cargo,
        horario: this.solicitudData.horario,
        principal: this.solicitudData.centroPrincipal,
        estado: 'PENDIENTE',
        fechaSolicitud: new Date().toLocaleDateString('es-ES')
      };

      this.misAsignaciones.push(nuevaAsignacion);
      this.filtrarDatos();
      
      console.log('Solicitud enviada:', nuevaAsignacion);
      this.cerrarModalSolicitar();
      
      // Mostrar mensaje de éxito
      alert('Solicitud enviada exitosamente. Será revisada por el centro médico.');
    }
  }

  // Método de exportación
  exportarDatos() {
    const datos = this.tabActiva === 'asignaciones' ? this.asignacionesFiltradas : this.centrosFiltrados;
    console.log('Exportando datos:', datos);
    alert(`Exportando ${datos.length} registros a Excel...`);
  }

  // Método Math para el template
  Math = Math;
}