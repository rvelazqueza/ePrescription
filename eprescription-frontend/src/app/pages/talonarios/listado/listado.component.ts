import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Receipt, Calendar, CheckCircle, Clock, AlertCircle, Search, Download, Package, FileText, ChevronLeft, ChevronRight, Info, ChevronDown } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { SimpleDropdownComponent } from '../../../components/ui/simple-dropdown/simple-dropdown.component';

interface Talonario {
  id: string;
  tipo: 'receta' | 'despacho';
  subTipo?: 'antimicrobiano' | 'estupefaciente' | 'psicotropico' | 'normal';
  codigoInicio: string;
  codigoFin: string;
  cantidad: number;
  estado: 'activo' | 'agotado' | 'vencido';
  fechaAdquisicion: string;
  fechaVencimiento: string;
  disponibles: number;
  usados: number;
  precio: number;
  numeroFactura: string;
  metodoPago: string;
}

@Component({
  selector: 'app-listado-talonarios',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, BreadcrumbsComponent, PageHeaderComponent, SimpleDropdownComponent],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumbs -->
      <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>
      
      <!-- Page Header -->
      <app-page-header 
        title="Mis Talonarios" 
        description="Gestión y seguimiento de talonarios para recetas y despacho de medicamentos controlados"
        [icon]="receiptIcon"
        [actionButton]="true">
        <div slot="action" class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30">
          <div class="text-right">
            <p class="text-xs text-white/80">Total de talonarios</p>
            <p class="text-2xl font-bold text-white">{{ talonarios.length }}</p>
          </div>
        </div>
      </app-page-header>

      <!-- Estadísticas rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow border-l-4 border-l-blue-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Talonarios Activos</p>
              <p class="text-3xl font-bold text-gray-900">{{ talonariosActivos }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-lg">
              <lucide-icon [img]="packageIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-green-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Disponibles</p>
              <p class="text-3xl font-bold text-gray-900">{{ totalDisponibles }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-lg">
              <lucide-icon [img]="checkCircleIcon" class="w-8 h-8 text-green-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-yellow-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Utilizados</p>
              <p class="text-3xl font-bold text-gray-900">{{ totalUtilizados }}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-lg">
              <lucide-icon [img]="fileTextIcon" class="w-8 h-8 text-yellow-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-red-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Compras este mes</p>
              <p class="text-3xl font-bold text-gray-900">3</p>
            </div>
            <div class="p-3 bg-red-100 rounded-lg">
              <lucide-icon [img]="receiptIcon" class="w-8 h-8 text-red-600"></lucide-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid gap-4 md:grid-cols-4">
          <div class="relative">
            <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
            <input 
              type="text" 
              [(ngModel)]="terminoBusqueda"
              (input)="filtrarTalonarios()"
              placeholder="Buscar por ID, código, factura..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          
          <select 
            [(ngModel)]="filtroTipo"
            (change)="filtrarTalonarios()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            <option value="receta">Receta</option>
            <option value="despacho">Despacho</option>
          </select>
          
          <select 
            [(ngModel)]="filtroEstado"
            (change)="filtrarTalonarios()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="agotado">Agotado</option>
            <option value="vencido">Vencido</option>
          </select>

          <button 
            (click)="toggleMayusculas()"
            class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
            {{ showUppercase ? 'Normal' : 'MAYÚSCULAS' }}
          </button>
        </div>
      </div>

      <!-- Tabla de talonarios -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <lucide-icon [img]="receiptIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Mis Talonarios</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ talonariosFiltrados.length }} talonario{{ talonariosFiltrados.length !== 1 ? 's' : '' }} encontrado{{ talonariosFiltrados.length !== 1 ? 's' : '' }}
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <app-simple-dropdown 
                [(isOpen)]="isExportDropdownOpen"
                triggerClass="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2">
                <div slot="trigger">
                  <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
                  Exportar
                  <lucide-icon [img]="chevronDownIcon" class="w-4 h-4"></lucide-icon>
                </div>
                <div slot="content">
                  <button 
                    (click)="exportarExcel()"
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                    <lucide-icon [img]="fileTextIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                    Exportar a Excel
                  </button>
                  <button 
                    (click)="exportarPDF()"
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                    <lucide-icon [img]="downloadIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                    Exportar a PDF
                  </button>
                  <button 
                    (click)="exportarCSV()"
                    class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                    <lucide-icon [img]="fileTextIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                    Exportar a CSV
                  </button>
                </div>
              </app-simple-dropdown>
            </div>
          </div>
        </div>
        
        <div *ngIf="talonariosFiltrados.length === 0" class="text-center py-12">
          <lucide-icon [img]="packageIcon" class="w-16 h-16 text-gray-300 mx-auto mb-4"></lucide-icon>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron talonarios</h3>
          <p class="text-gray-600">No hay talonarios que coincidan con los filtros aplicados</p>
        </div>

        <div *ngIf="talonariosFiltrados.length > 0" class="overflow-x-auto" style="max-height: 500px; overflow-y: auto;">
          <table class="w-full min-w-[1000px]">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código Inicio</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código Fin</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponibles</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usados</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">F. Adquisición</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">F. Vencimiento</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let talonario of talonariosPaginados" 
                  class="hover:bg-blue-50/50 transition-all">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <lucide-icon [img]="receiptIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                    <span class="font-medium">{{ transformText(talonario.id) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getTipoBadgeClass(talonario.tipo, talonario.subTipo)" 
                        class="px-2 py-1 text-xs font-semibold rounded-full">
                    {{ transformText(getTipoTexto(talonario.tipo, talonario.subTipo)) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm">{{ transformText(talonario.codigoInicio) }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm">{{ transformText(talonario.codigoFin) }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm">{{ talonario.cantidad }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-green-600 font-medium">{{ talonario.disponibles }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-gray-600">{{ talonario.usados }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getEstadoBadgeClass(talonario.estado)" 
                        class="px-2 py-1 text-xs font-semibold rounded-full">
                    {{ transformText(getEstadoTexto(talonario.estado)) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <lucide-icon [img]="calendarIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                    <span class="text-sm">{{ formatDate(talonario.fechaAdquisicion) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <lucide-icon [img]="clockIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                    <span class="text-sm">{{ formatDate(talonario.fechaVencimiento) }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div *ngIf="talonariosFiltrados.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Mostrando {{ (paginaActual - 1) * elementosPorPagina + 1 }} a {{ Math.min(paginaActual * elementosPorPagina, talonariosFiltrados.length) }} de {{ talonariosFiltrados.length }} talonarios
            </div>
            <div class="flex items-center space-x-2">
              <button 
                (click)="cambiarPagina(paginaActual - 1)"
                [disabled]="paginaActual === 1"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                <lucide-icon [img]="chevronLeftIcon" class="w-4 h-4"></lucide-icon>
                Anterior
              </button>
              
              <div class="flex space-x-1">
                <button 
                  *ngFor="let pagina of getPaginas()"
                  (click)="cambiarPagina(pagina)"
                  [class]="pagina === paginaActual 
                    ? 'px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md'
                    : 'px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50'">
                  {{ pagina }}
                </button>
              </div>
              
              <button 
                (click)="cambiarPagina(paginaActual + 1)"
                [disabled]="paginaActual === totalPaginas"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                Siguiente
                <lucide-icon [img]="chevronRightIcon" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Información sobre talonarios -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <lucide-icon [img]="infoIcon" class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"></lucide-icon>
          <div>
            <h4 class="text-sm font-medium text-blue-900 mb-1">Información sobre talonarios</h4>
            <p class="text-sm text-blue-700">
              Los talonarios tienen una validez de 12 meses desde su adquisición. Haz doble clic en cualquier fila para ver detalles completos. 
              Puedes exportar la información a PDF según necesites. Los talonarios vencidos no pueden utilizarse para nuevas recetas.
            </p>
          </div>
        </div>
      </div>
    </div>


  `
})
export class ListadoTalonariosComponent {
  receiptIcon = Receipt;
  calendarIcon = Calendar;
  checkCircleIcon = CheckCircle;
  clockIcon = Clock;
  alertCircleIcon = AlertCircle;
  searchIcon = Search;
  downloadIcon = Download;
  packageIcon = Package;
  fileTextIcon = FileText;
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;
  infoIcon = Info;
  chevronDownIcon = ChevronDown;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Talonarios', route: '/talonarios' },
    { label: 'Mis Talonarios' }
  ];

  terminoBusqueda = '';
  filtroTipo = '';
  filtroEstado = '';
  showUppercase = false;
  isExportDropdownOpen = false;

  // Paginación
  paginaActual = 1;
  elementosPorPagina = 10;

  talonarios: Talonario[] = [
    {
      id: 'TAL-001',
      tipo: 'receta',
      subTipo: 'antimicrobiano',
      codigoInicio: 'ANT-2024-001',
      codigoFin: 'ANT-2024-050',
      cantidad: 50,
      estado: 'activo',
      fechaAdquisicion: '2024-01-15',
      fechaVencimiento: '2025-01-15',
      disponibles: 28,
      usados: 22,
      precio: 2500,
      numeroFactura: 'FACT-2024-0015',
      metodoPago: 'Tarjeta de crédito'
    },
    {
      id: 'TAL-002',
      tipo: 'receta',
      subTipo: 'estupefaciente',
      codigoInicio: 'EST-2024-001',
      codigoFin: 'EST-2024-030',
      cantidad: 30,
      estado: 'activo',
      fechaAdquisicion: '2024-02-10',
      fechaVencimiento: '2025-02-10',
      disponibles: 15,
      usados: 15,
      precio: 3500,
      numeroFactura: 'FACT-2024-0042',
      metodoPago: 'Transferencia bancaria'
    },
    {
      id: 'TAL-003',
      tipo: 'receta',
      subTipo: 'normal',
      codigoInicio: 'REC-2024-001',
      codigoFin: 'REC-2024-100',
      cantidad: 100,
      estado: 'activo',
      fechaAdquisicion: '2024-03-05',
      fechaVencimiento: '2025-03-05',
      disponibles: 65,
      usados: 35,
      precio: 1500,
      numeroFactura: 'FACT-2024-0089',
      metodoPago: 'Tarjeta de débito'
    },
    {
      id: 'TAL-004',
      tipo: 'despacho',
      codigoInicio: 'DESP-2024-001',
      codigoFin: 'DESP-2024-150',
      cantidad: 150,
      estado: 'activo',
      fechaAdquisicion: '2024-03-20',
      fechaVencimiento: '2025-03-20',
      disponibles: 98,
      usados: 52,
      precio: 1000,
      numeroFactura: 'FACT-2024-0105',
      metodoPago: 'Tarjeta de crédito'
    },
    {
      id: 'TAL-005',
      tipo: 'receta',
      subTipo: 'psicotropico',
      codigoInicio: 'PSI-2023-050',
      codigoFin: 'PSI-2023-090',
      cantidad: 40,
      estado: 'agotado',
      fechaAdquisicion: '2023-11-10',
      fechaVencimiento: '2024-11-10',
      disponibles: 0,
      usados: 40,
      precio: 3000,
      numeroFactura: 'FACT-2023-0845',
      metodoPago: 'Transferencia bancaria'
    }
  ];

  talonariosFiltrados: Talonario[] = [...this.talonarios];

  get talonariosActivos(): number {
    return this.talonarios.filter(t => t.estado === 'activo').length;
  }

  get totalDisponibles(): number {
    return this.talonarios.reduce((sum, t) => sum + t.disponibles, 0);
  }

  get totalUtilizados(): number {
    return this.talonarios.reduce((sum, t) => sum + t.usados, 0);
  }

  get totalPaginas(): number {
    return Math.ceil(this.talonariosFiltrados.length / this.elementosPorPagina);
  }

  get talonariosPaginados(): Talonario[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.talonariosFiltrados.slice(inicio, fin);
  }

  Math = Math;

  filtrarTalonarios() {
    this.talonariosFiltrados = this.talonarios.filter(talonario => {
      const matchesSearch = !this.terminoBusqueda ||
        talonario.id.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        talonario.codigoInicio.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        talonario.codigoFin.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        talonario.numeroFactura.toLowerCase().includes(this.terminoBusqueda.toLowerCase());

      const matchesTipo = !this.filtroTipo || talonario.tipo === this.filtroTipo;
      const matchesEstado = !this.filtroEstado || talonario.estado === this.filtroEstado;

      return matchesSearch && matchesTipo && matchesEstado;
    });

    this.paginaActual = 1; // Reset a primera página
  }

  toggleMayusculas() {
    this.showUppercase = !this.showUppercase;
  }

  transformText(text: string): string {
    return this.showUppercase ? text.toUpperCase() : text;
  }

  getTipoBadgeClass(tipo: string, subTipo?: string): string {
    if (tipo === 'receta') {
      const colors = {
        'antimicrobiano': 'bg-blue-100 text-blue-800',
        'estupefaciente': 'bg-purple-100 text-purple-800',
        'psicotropico': 'bg-pink-100 text-pink-800',
        'normal': 'bg-gray-100 text-gray-800'
      };
      return colors[subTipo as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    }
    return 'bg-teal-100 text-teal-800';
  }

  getTipoTexto(tipo: string, subTipo?: string): string {
    if (tipo === 'receta') {
      return subTipo ? subTipo.toUpperCase() : 'RECETA';
    }
    return 'DESPACHO';
  }

  getEstadoBadgeClass(estado: string): string {
    const variants = {
      'activo': 'bg-green-100 text-green-800',
      'agotado': 'bg-red-100 text-red-800',
      'vencido': 'bg-gray-100 text-gray-800'
    };
    return variants[estado as keyof typeof variants];
  }

  getEstadoTexto(estado: string): string {
    return estado.toUpperCase();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }



  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  getPaginas(): number[] {
    const paginas: number[] = [];
    const maxPaginas = 5;
    let inicio = Math.max(1, this.paginaActual - Math.floor(maxPaginas / 2));
    let fin = Math.min(this.totalPaginas, inicio + maxPaginas - 1);

    if (fin - inicio < maxPaginas - 1) {
      inicio = Math.max(1, fin - maxPaginas + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }



  // Métodos de exportación
  exportarExcel() {
    this.isExportDropdownOpen = false;
    console.log('Exportando a Excel...');
    // Aquí implementarías la lógica para exportar a Excel
  }

  exportarPDF() {
    this.isExportDropdownOpen = false;
    console.log('Exportando a PDF...');
    // Aquí implementarías la lógica para exportar a PDF
  }

  exportarCSV() {
    this.isExportDropdownOpen = false;
    console.log('Exportando a CSV...');
    // Aquí implementarías la lógica para exportar a CSV
  }

}