import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Bell, CheckCircle, AlertTriangle, Info, X, Plus, Search, Filter, Edit, Copy, Trash2, MoreVertical, Mail, MessageSquare, Smartphone, XCircle, Clock, Pause, Download, FileText, AlertCircle } from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { NotificationService } from '../../../services/notification.service';

interface Notificacion {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  tipoDestinatario: 'interno' | 'externo' | 'ambos';
  canalPrincipal: string;
  canales: string[];
  categoria: string;
  estado: 'activa' | 'inactiva' | 'programada' | 'pausada';
  prioridad: 'alta' | 'media' | 'baja';
  ultimaModificacion: string;
  usuarioModificacion: string;
  totalEnvios: number;
  exitosos: number;
  fallidos: number;
}

@Component({
  selector: 'app-lista-notificaciones',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      title="Administración de Notificaciones" 
      description="Gestione las notificaciones automáticas del sistema con configuración multicanal"
      [icon]="bellIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-blue-600 via-indigo-500 to-purple-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

      <!-- Barra de herramientas -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Búsqueda -->
          <div class="flex-1">
            <div class="relative">
              <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
              <input
                type="text"
                placeholder="Buscar por código, nombre o descripción..."
                [(ngModel)]="searchTerm"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex gap-2 flex-wrap">
            <div *ngIf="selectedNotifications.length > 0" class="flex gap-2">
              <button
                (click)="handleBulkActivate()"
                class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <lucide-icon [img]="checkCircleIcon" class="w-4 h-4"></lucide-icon>
                Activar ({{ selectedNotifications.length }})
              </button>
              <button
                (click)="handleBulkDeactivate()"
                class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <lucide-icon [img]="xCircleIcon" class="w-4 h-4"></lucide-icon>
                Desactivar ({{ selectedNotifications.length }})
              </button>
            </div>
            <button
              (click)="exportData()"
              class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
              Exportar
            </button>
            <button
              (click)="navigateToNew()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
              Nueva Notificación
            </button>
          </div>
        </div>

        <!-- Filtros -->
        <div class="mt-4 flex flex-wrap gap-3 items-center">
          <div class="flex items-center gap-2">
            <lucide-icon [img]="filterIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
            <span class="text-sm text-gray-600">Filtros:</span>
          </div>

          <select [(ngModel)]="filterEstado" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="todos">Todos</option>
            <option value="activa">Activas</option>
            <option value="inactiva">Inactivas</option>
            <option value="programada">Programadas</option>
            <option value="pausada">Pausadas</option>
          </select>

          <select [(ngModel)]="filterTipo" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="todos">Todos</option>
            <option value="interno">Interno</option>
            <option value="externo">Externo</option>
            <option value="ambos">Ambos</option>
          </select>

          <select [(ngModel)]="filterCanal" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="todos">Todos</option>
            <option value="correo">Correo</option>
            <option value="interna">Interna</option>
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="push">Push</option>
          </select>

          <select [(ngModel)]="filterCategoria" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="todos">Todas</option>
            <option value="prescripciones">Prescripciones</option>
            <option value="dispensacion">Dispensación</option>
            <option value="inventario">Inventario</option>
            <option value="usuarios">Usuarios</option>
            <option value="alertas">Alertas</option>
            <option value="firma">Firma</option>
            <option value="reportes">Reportes</option>
          </select>

          <select [(ngModel)]="filterPrioridad" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="todos">Todas</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>

          <button 
            *ngIf="activeFiltersCount > 0"
            (click)="clearFilters()"
            class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors">
            Limpiar filtros ({{ activeFiltersCount }})
          </button>
        </div>

        <!-- Resultados -->
        <div class="mt-3 text-sm text-gray-500">
          Mostrando {{ paginatedNotifications.length }} de {{ filteredNotifications.length }} notificaciones
        </div>
      </div>

      <!-- Tabla de notificaciones -->
      <div class="bg-white rounded-lg shadow">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    [checked]="paginatedNotifications.length > 0 && selectedNotifications.length === paginatedNotifications.length"
                    (change)="handleSelectAll($event)"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th 
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  (click)="handleSort('codigo')">
                  <div class="flex items-center gap-2">
                    Código
                    <span *ngIf="sortColumn === 'codigo'" class="text-xs">
                      {{ sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                  </div>
                </th>
                <th 
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  (click)="handleSort('nombre')">
                  <div class="flex items-center gap-2">
                    Nombre de la Notificación
                    <span *ngIf="sortColumn === 'nombre'" class="text-xs">
                      {{ sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                  </div>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Destinatario</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Canales</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th 
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  (click)="handleSort('ultimaModificacion')">
                  <div class="flex items-center gap-2">
                    Última Modificación
                    <span *ngIf="sortColumn === 'ultimaModificacion'" class="text-xs">
                      {{ sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                  </div>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estadísticas</th>
                <th class="w-24 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngIf="paginatedNotifications.length === 0">
                <td colspan="10" class="px-4 py-12 text-center text-gray-500">
                  <lucide-icon [img]="bellIcon" class="w-12 h-12 mx-auto mb-4 opacity-20"></lucide-icon>
                  <p>No se encontraron notificaciones</p>
                  <p class="text-sm mt-1">Intenta ajustar los filtros de búsqueda</p>
                </td>
              </tr>
              <tr *ngFor="let notif of paginatedNotifications" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-4">
                  <input
                    type="checkbox"
                    [checked]="selectedNotifications.includes(notif.id)"
                    (change)="handleSelectNotification(notif.id, $event)"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td class="px-4 py-4">
                  <code class="text-sm px-2 py-1 bg-gray-100 rounded">{{ notif.codigo }}</code>
                </td>
                <td class="px-4 py-4">
                  <div>
                    <div class="font-medium text-gray-900">{{ notif.nombre }}</div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">{{ notif.descripcion }}</div>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                    {{ notif.tipoDestinatario }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let canal of notif.canales" 
                          class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <lucide-icon [img]="getChannelIcon(canal)" class="w-3 h-3"></lucide-icon>
                      {{ canal }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <span [class]="getPriorityBadgeClass(notif.prioridad)" 
                        class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    <lucide-icon [img]="alertCircleIcon" class="w-3 h-3"></lucide-icon>
                    {{ getPriorityLabel(notif.prioridad) }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <span [class]="getEstadoBadgeClass(notif.estado)" 
                        class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    <lucide-icon [img]="getEstadoIcon(notif.estado)" class="w-3 h-3"></lucide-icon>
                    {{ getEstadoLabel(notif.estado) }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <div class="text-sm">
                    <div class="text-gray-900">{{ notif.ultimaModificacion }}</div>
                    <div class="text-gray-500 text-xs">{{ notif.usuarioModificacion }}</div>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="text-sm">
                    <div class="flex items-center gap-1">
                      <span class="text-gray-500">Total:</span>
                      <span class="text-gray-900">{{ notif.totalEnvios }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-xs mt-1">
                      <span class="text-green-600">✓ {{ notif.exitosos }}</span>
                      <span *ngIf="notif.fallidos > 0" class="text-red-600">✗ {{ notif.fallidos }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-4">
                  <div class="relative">
                    <button
                      (click)="toggleDropdown(notif.id)"
                      class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <lucide-icon [img]="moreVerticalIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                    <div *ngIf="openDropdown === notif.id" 
                         class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div class="py-1">
                        <button
                          (click)="editNotification(notif.id)"
                          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          <lucide-icon [img]="editIcon" class="w-4 h-4"></lucide-icon>
                          Editar
                        </button>
                        <button
                          (click)="duplicateNotification(notif)"
                          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          <lucide-icon [img]="copyIcon" class="w-4 h-4"></lucide-icon>
                          Duplicar
                        </button>
                        <button
                          (click)="toggleNotificationStatus(notif.id)"
                          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          <lucide-icon [img]="notif.estado === 'activa' ? xCircleIcon : checkCircleIcon" class="w-4 h-4"></lucide-icon>
                          {{ notif.estado === 'activa' ? 'Desactivar' : 'Activar' }}
                        </button>
                        <hr class="my-1">
                        <button
                          (click)="deleteNotification(notif.id)"
                          class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <lucide-icon [img]="trash2Icon" class="w-4 h-4"></lucide-icon>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div *ngIf="filteredNotifications.length > 0" class="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Registros por página:</span>
            <select [(ngModel)]="pageSize" (change)="onPageSizeChange()" class="border border-gray-300 rounded px-2 py-1 text-sm">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            <div class="flex gap-1">
              <button
                (click)="goToPage(currentPage - 1)"
                [disabled]="currentPage === 1"
                class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Anterior
              </button>
              <button
                (click)="goToPage(currentPage + 1)"
                [disabled]="currentPage === totalPages"
                class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </app-page-layout>
  `
})
export class ListaNotificacionesComponent implements OnInit {
  // Iconos
  bellIcon = Bell;
  checkCircleIcon = CheckCircle;
  alertTriangleIcon = AlertTriangle;
  infoIcon = Info;
  xIcon = X;
  plusIcon = Plus;
  searchIcon = Search;
  filterIcon = Filter;
  editIcon = Edit;
  copyIcon = Copy;
  trash2Icon = Trash2;
  moreVerticalIcon = MoreVertical;
  mailIcon = Mail;
  messageSquareIcon = MessageSquare;
  smartphoneIcon = Smartphone;
  xCircleIcon = XCircle;
  clockIcon = Clock;
  pauseIcon = Pause;
  downloadIcon = Download;
  fileTextIcon = FileText;
  alertCircleIcon = AlertCircle;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Notificaciones', route: '/notificaciones' },
    { label: 'Listado de notificaciones', route: '/notificaciones/lista' }
  ];

  // Filtros y búsqueda
  searchTerm = '';
  filterEstado = 'todos';
  filterTipo = 'todos';
  filterCanal = 'todos';
  filterCategoria = 'todos';
  filterPrioridad = 'todos';
  selectedNotifications: string[] = [];
  openDropdown: string | null = null;

  // Ordenamiento
  sortColumn: keyof Notificacion = 'ultimaModificacion';
  sortDirection: 'asc' | 'desc' = 'desc';

  // Paginación
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // Datos mock
  notificaciones: Notificacion[] = [
    {
      id: "1",
      codigo: "NOTIF-RX-001",
      nombre: "Nueva Receta Emitida",
      descripcion: "Notificación enviada al paciente cuando el médico emite una nueva receta electrónica",
      tipoDestinatario: "externo",
      canalPrincipal: "Correo",
      canales: ["Correo", "SMS", "Interna"],
      categoria: "Prescripciones",
      estado: "activa",
      prioridad: "alta",
      ultimaModificacion: "2024-10-05 14:23",
      usuarioModificacion: "Dr. Carlos Méndez",
      totalEnvios: 1245,
      exitosos: 1230,
      fallidos: 15
    },
    {
      id: "2",
      codigo: "NOTIF-DISP-001",
      nombre: "Dispensación Registrada",
      descripcion: "Notificación cuando se registra la dispensación de una receta en farmacia",
      tipoDestinatario: "ambos",
      canalPrincipal: "Interna",
      canales: ["Interna", "Correo"],
      categoria: "Dispensación",
      estado: "activa",
      prioridad: "media",
      ultimaModificacion: "2024-10-04 10:15",
      usuarioModificacion: "Adm. Sistema",
      totalEnvios: 892,
      exitosos: 890,
      fallidos: 2
    },
    {
      id: "3",
      codigo: "NOTIF-STOCK-001",
      nombre: "Alerta de Stock Bajo",
      descripcion: "Notificación crítica cuando un medicamento alcanza el nivel mínimo de stock",
      tipoDestinatario: "interno",
      canalPrincipal: "Interna",
      canales: ["Interna", "Correo", "WhatsApp"],
      categoria: "Inventario",
      estado: "activa",
      prioridad: "alta",
      ultimaModificacion: "2024-10-03 16:45",
      usuarioModificacion: "Lic. Ana Torres",
      totalEnvios: 156,
      exitosos: 156,
      fallidos: 0
    },
    {
      id: "4",
      codigo: "NOTIF-USER-001",
      nombre: "Bienvenida Nuevo Usuario",
      descripcion: "Mensaje de bienvenida enviado a usuarios recién registrados en el sistema",
      tipoDestinatario: "interno",
      canalPrincipal: "Correo",
      canales: ["Correo"],
      categoria: "Usuarios",
      estado: "activa",
      prioridad: "baja",
      ultimaModificacion: "2024-10-02 09:30",
      usuarioModificacion: "Adm. Sistema",
      totalEnvios: 43,
      exitosos: 43,
      fallidos: 0
    },
    {
      id: "5",
      codigo: "NOTIF-ALERT-001",
      nombre: "Alerta de Interacción Medicamentosa",
      descripcion: "Alerta crítica sobre posibles interacciones entre medicamentos prescritos",
      tipoDestinatario: "interno",
      canalPrincipal: "Interna",
      canales: ["Interna", "SMS"],
      categoria: "Alertas",
      estado: "activa",
      prioridad: "alta",
      ultimaModificacion: "2024-10-01 11:20",
      usuarioModificacion: "Dr. Luis Ramírez",
      totalEnvios: 78,
      exitosos: 75,
      fallidos: 3
    },
    {
      id: "6",
      codigo: "NOTIF-MAINT-001",
      nombre: "Mantenimiento Programado",
      descripcion: "Notificación sobre mantenimiento programado del sistema",
      tipoDestinatario: "interno",
      canalPrincipal: "Correo",
      canales: ["Correo", "Interna"],
      categoria: "Sistema",
      estado: "inactiva",
      prioridad: "media",
      ultimaModificacion: "2024-09-28 15:00",
      usuarioModificacion: "Adm. Sistema",
      totalEnvios: 5,
      exitosos: 5,
      fallidos: 0
    }
  ];

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Escuchar cambios en la URL para detectar si venimos de editar
    this.route.queryParams.subscribe(params => {
      if (params['edited']) {
        this.notificationService.showSuccess(
          'La notificación ha sido editada exitosamente',
          'Notificación Actualizada'
        );
      }
    });
  }

  // Propiedades computadas
  get filteredNotifications(): Notificacion[] {
    return this.notificaciones.filter(notif => {
      const searchNormalized = this.searchTerm.toLowerCase();
      const matchesSearch = !this.searchTerm ||
        notif.codigo.toLowerCase().includes(searchNormalized) ||
        notif.nombre.toLowerCase().includes(searchNormalized) ||
        notif.descripcion.toLowerCase().includes(searchNormalized);

      const matchesEstado = this.filterEstado === 'todos' || notif.estado === this.filterEstado;
      const matchesTipo = this.filterTipo === 'todos' || notif.tipoDestinatario === this.filterTipo;
      const matchesCanal = this.filterCanal === 'todos' || 
        notif.canales.some(c => c.toLowerCase() === this.filterCanal.toLowerCase());
      const matchesCategoria = this.filterCategoria === 'todos' || 
        notif.categoria.toLowerCase() === this.filterCategoria.toLowerCase();
      const matchesPrioridad = this.filterPrioridad === 'todos' || notif.prioridad === this.filterPrioridad;

      return matchesSearch && matchesEstado && matchesTipo && matchesCanal && matchesCategoria && matchesPrioridad;
    }).sort((a, b) => {
      let aValue = a[this.sortColumn];
      let bValue = b[this.sortColumn];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  get paginatedNotifications(): Notificacion[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.totalPages = Math.ceil(this.filteredNotifications.length / this.pageSize);
    return this.filteredNotifications.slice(startIndex, endIndex);
  }

  get activeFiltersCount(): number {
    return [
      this.searchTerm,
      this.filterEstado !== 'todos' ? this.filterEstado : null,
      this.filterTipo !== 'todos' ? this.filterTipo : null,
      this.filterCanal !== 'todos' ? this.filterCanal : null,
      this.filterCategoria !== 'todos' ? this.filterCategoria : null,
      this.filterPrioridad !== 'todos' ? this.filterPrioridad : null,
    ].filter(Boolean).length;
  }

  // Métodos de utilidad
  getChannelIcon(channel: string): any {
    const normalized = channel.toLowerCase();
    if (normalized.includes('correo') || normalized.includes('email')) {
      return this.mailIcon;
    }
    if (normalized.includes('sms') || normalized.includes('whatsapp')) {
      return this.messageSquareIcon;
    }
    if (normalized.includes('push') || normalized.includes('movil')) {
      return this.smartphoneIcon;
    }
    return this.bellIcon;
  }

  getPriorityBadgeClass(prioridad: string): string {
    const classes = {
      'alta': 'bg-red-100 text-red-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'baja': 'bg-gray-100 text-gray-800'
    };
    return classes[prioridad as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getPriorityLabel(prioridad: string): string {
    const labels = {
      'alta': 'Alta',
      'media': 'Media',
      'baja': 'Baja'
    };
    return labels[prioridad as keyof typeof labels] || 'Media';
  }

  getEstadoBadgeClass(estado: string): string {
    const classes = {
      'activa': 'bg-green-100 text-green-800',
      'inactiva': 'bg-gray-100 text-gray-800',
      'programada': 'bg-blue-100 text-blue-800',
      'pausada': 'bg-yellow-100 text-yellow-800'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getEstadoLabel(estado: string): string {
    const labels = {
      'activa': 'Activa',
      'inactiva': 'Inactiva',
      'programada': 'Programada',
      'pausada': 'Pausada'
    };
    return labels[estado as keyof typeof labels] || estado;
  }

  getEstadoIcon(estado: string): any {
    const icons = {
      'activa': this.checkCircleIcon,
      'inactiva': this.xCircleIcon,
      'programada': this.clockIcon,
      'pausada': this.pauseIcon
    };
    return icons[estado as keyof typeof icons] || this.checkCircleIcon;
  }

  // Métodos de acción
  handleSort(column: keyof Notificacion): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  handleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedNotifications = this.paginatedNotifications.map(n => n.id);
    } else {
      this.selectedNotifications = [];
    }
  }

  handleSelectNotification(id: string, event: any): void {
    if (event.target.checked) {
      this.selectedNotifications = [...this.selectedNotifications, id];
    } else {
      this.selectedNotifications = this.selectedNotifications.filter(nId => nId !== id);
    }
  }

  handleBulkActivate(): void {
    if (this.selectedNotifications.length === 0) {
      this.notificationService.showWarning(
        'Debe seleccionar al menos una notificación para activar',
        'Selección Requerida'
      );
      return;
    }
    this.selectedNotifications.forEach(id => {
      const notif = this.notificaciones.find(n => n.id === id);
      if (notif && notif.estado !== 'activa') {
        notif.estado = 'activa';
      }
    });
    this.notificationService.showSuccess(
      `${this.selectedNotifications.length} notificación${this.selectedNotifications.length > 1 ? 'es' : ''} activada${this.selectedNotifications.length > 1 ? 's' : ''} correctamente`,
      'Notificaciones Activadas'
    );
    this.selectedNotifications = [];
  }

  handleBulkDeactivate(): void {
    if (this.selectedNotifications.length === 0) {
      this.notificationService.showWarning(
        'Debe seleccionar al menos una notificación para desactivar',
        'Selección Requerida'
      );
      return;
    }
    this.selectedNotifications.forEach(id => {
      const notif = this.notificaciones.find(n => n.id === id);
      if (notif && notif.estado === 'activa') {
        notif.estado = 'inactiva';
      }
    });
    this.notificationService.showSuccess(
      `${this.selectedNotifications.length} notificación${this.selectedNotifications.length > 1 ? 'es' : ''} desactivada${this.selectedNotifications.length > 1 ? 's' : ''} correctamente`,
      'Notificaciones Desactivadas'
    );
    this.selectedNotifications = [];
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterEstado = 'todos';
    this.filterTipo = 'todos';
    this.filterCanal = 'todos';
    this.filterCategoria = 'todos';
    this.filterPrioridad = 'todos';
    this.currentPage = 1;
  }

  toggleDropdown(id: string): void {
    this.openDropdown = this.openDropdown === id ? null : id;
  }

  navigateToNew(): void {
    this.router.navigate(['/notificaciones/nueva']);
  }

  editNotification(id: string): void {
    this.openDropdown = null;
    this.router.navigate(['/notificaciones/nueva'], { 
      queryParams: { edit: id, mode: 'edit' }
    });
  }

  duplicateNotification(notif: Notificacion): void {
    this.openDropdown = null;
    const duplicated: Notificacion = {
      ...notif,
      id: Date.now().toString(),
      codigo: `${notif.codigo}-COPY`,
      nombre: `${notif.nombre} (Copia)`,
      ultimaModificacion: new Date().toLocaleString(),
      usuarioModificacion: 'Usuario Actual',
      totalEnvios: 0,
      exitosos: 0,
      fallidos: 0
    };
    this.notificaciones.unshift(duplicated);
    this.notificationService.showSuccess(
      `Notificación "${notif.nombre}" duplicada correctamente`,
      'Notificación Duplicada',
      { 
        actionText: 'Ver',
        actionHandler: () => this.editNotification(duplicated.id)
      }
    );
  }

  toggleNotificationStatus(id: string): void {
    this.openDropdown = null;
    const notif = this.notificaciones.find(n => n.id === id);
    if (notif) {
      const previousState = notif.estado;
      notif.estado = notif.estado === 'activa' ? 'inactiva' : 'activa';
      const action = notif.estado === 'activa' ? 'activada' : 'desactivada';
      
      this.notificationService.showSuccess(
        `Notificación "${notif.nombre}" ${action} correctamente`,
        `Notificación ${action.charAt(0).toUpperCase() + action.slice(1)}`,
        {
          actionText: 'Deshacer',
          actionHandler: () => {
            notif.estado = previousState;
            this.notificationService.showInfo('Cambio deshecho correctamente');
          }
        }
      );
    }
  }

  deleteNotification(id: string): void {
    this.openDropdown = null;
    const notif = this.notificaciones.find(n => n.id === id);
    if (!notif) return;

    // Mostrar notificación de confirmación con botón de acción
    this.notificationService.showWarning(
      `¿Está seguro de que desea eliminar "${notif.nombre}"? Esta acción no se puede deshacer.`,
      'Confirmar Eliminación',
      {
        duration: 0, // Persistente hasta que el usuario actúe
        actionText: 'Eliminar',
        actionHandler: () => {
          // Proceder con la eliminación
          const deletedNotif = { ...notif };
          this.notificaciones = this.notificaciones.filter(n => n.id !== id);
          
          this.notificationService.showSuccess(
            `Notificación "${deletedNotif.nombre}" eliminada correctamente`,
            'Notificación Eliminada',
            {
              actionText: 'Restaurar',
              actionHandler: () => {
                this.notificaciones.unshift(deletedNotif);
                this.notificationService.showInfo('Notificación restaurada correctamente');
              }
            }
          );
        }
      }
    );
  }

  exportData(): void {
    this.notificationService.showInfo(
      'La funcionalidad de exportación estará disponible próximamente',
      'Función en Desarrollo'
    );
  }

  // Métodos de paginación
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }
}