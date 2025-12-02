import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LucideAngularModule, Search, FileText, Calendar, User, Pill, Filter, Eye, Download, Clock, ChevronLeft, ChevronRight, X, UserCheck, Stethoscope, AlertTriangle, CheckCircle, XCircle, Info, Copy, Trash2, QrCode, Key, Printer, Ban, Edit } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';
import { RoleSuggestionService } from '../../../services/role-suggestion.service';
import { PrescripcionesService, PrescriptionDto, SearchPrescriptionsParams } from '../../../services/prescripciones.service';

interface Receta {
  id: string;
  paciente: {
    nombre: string;
    cedula: string;
    edad: number;
    genero: 'M' | 'F';
  };
  medico: {
    nombre: string;
    especialidad: string;
    codigoMedico: string;
    firmaDigital: boolean;
  };
  diagnostico: string;
  fecha: string;
  fechaVencimiento: string;
  estado: 'borrador' | 'emitida' | 'dispensada' | 'parcialmente-dispensada' | 'vencida' | 'anulada';
  medicamentos: {
    nombre: string;
    dosis: string;
    cantidad: number;
    frecuencia: string;
    duracion: string;
    estado?: 'dispensado' | 'pendiente';
  }[];
  farmacia?: string | null;
  fechaDispensacion?: string | null;
  fechaModificacion?: string;
}

@Component({
  selector: 'app-buscar-prescripcion',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, BreadcrumbsComponent, PageHeaderComponent, RoleSuggestionModalComponent],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumbs -->
      <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>
      
      <!-- Page Header -->
      <app-page-header 
        title="Buscar Receta" 
        description="Búsqueda avanzada de prescripciones en todo el sistema"
        [icon]="searchIcon">
        <div slot="action" class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30">
          <div class="text-right">
            <p class="text-xs text-white/80">Prescripciones totales</p>
            <p class="text-2xl font-bold text-white">{{ totalPrescripciones }}</p>
          </div>
        </div>
      </app-page-header>

      <!-- Tabs de Búsqueda -->
      <div class="bg-white rounded-lg shadow border border-gray-200">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex">
            <button 
              (click)="tiposBusqueda = 'rapida'"
              [class]="tiposBusqueda === 'rapida' 
                ? 'border-purple-500 text-purple-600 bg-purple-50' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="w-1/2 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors">
              Búsqueda Rápida
            </button>
            <button 
              (click)="tiposBusqueda = 'avanzada'"
              [class]="tiposBusqueda === 'avanzada' 
                ? 'border-purple-500 text-purple-600 bg-purple-50' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="w-1/2 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors">
              Búsqueda Avanzada
            </button>
          </nav>
        </div>

        <!-- Búsqueda Rápida -->
        <div *ngIf="tiposBusqueda === 'rapida'" class="p-6">
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Búsqueda Rápida</h3>
              <p class="text-sm text-gray-600 mb-4">Busca por número de receta, nombre del paciente o identificación</p>
            </div>
            
            <div class="flex gap-3">
              <div class="flex-1 relative">
                <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
                <input 
                  type="text" 
                  [(ngModel)]="busquedaRapida"
                  (input)="realizarBusquedaRapida()"
                  placeholder="RX-2025-009847"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
              </div>
              <button 
                (click)="realizarBusquedaRapida()"
                class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <lucide-icon [img]="searchIcon" class="w-4 h-4"></lucide-icon>
                Buscar
              </button>
              <button 
                (click)="limpiarBusqueda()"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors"
              >
                Limpiar
              </button>
            </div>

            <!-- Consejos de búsqueda rápida -->
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div class="flex items-start">
                <lucide-icon [img]="infoIcon" class="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0"></lucide-icon>
                <div>
                  <h4 class="text-sm font-medium text-purple-900 mb-1">Consejos de búsqueda</h4>
                  <ul class="text-sm text-purple-700 space-y-1">
                    <li>• Puedes buscar por número de receta completo o parcial (ej: "RX-2025-009847")</li>
                    <li>• Ingresa el nombre completo o parcial del paciente (ej: "María González")</li>
                    <li>• Busca por número de identificación del paciente (ej: "CC-52.841.963")</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Búsqueda Avanzada -->
        <div *ngIf="tiposBusqueda === 'avanzada'" class="p-6">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Búsqueda Avanzada</h3>
              <p class="text-sm text-gray-600 mb-4">Combina múltiples criterios para encontrar recetas específicas</p>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Número de Receta</label>
                <input 
                  type="text" 
                  [(ngModel)]="filtrosAvanzados.numeroReceta"
                  placeholder="RX-2025-XXXXXX"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Estado de la Receta</label>
                <select 
                  [(ngModel)]="filtrosAvanzados.estado"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Todos los estados</option>
                  <option value="borrador">Borrador</option>
                  <option value="emitida">Emitida</option>
                  <option value="dispensada">Dispensada</option>
                  <option value="parcialmente-dispensada">Parcialmente dispensada</option>
                  <option value="vencida">Vencida</option>
                  <option value="anulada">Anulada</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Paciente</label>
                <input 
                  type="text" 
                  [(ngModel)]="filtrosAvanzados.nombrePaciente"
                  placeholder="Nombre completo del paciente"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Identificación del Paciente</label>
                <input 
                  type="text" 
                  [(ngModel)]="filtrosAvanzados.cedulaPaciente"
                  placeholder="CC, TI, CE, etc."
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Médico Prescriptor</label>
                <input 
                  type="text" 
                  [(ngModel)]="filtrosAvanzados.medico"
                  placeholder="Nombre del médico"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Medicamento</label>
                <input 
                  type="text" 
                  [(ngModel)]="filtrosAvanzados.medicamento"
                  placeholder="Nombre del medicamento"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Desde</label>
                <input 
                  type="date" 
                  [(ngModel)]="filtrosAvanzados.fechaDesde"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Hasta</label>
                <input 
                  type="date" 
                  [(ngModel)]="filtrosAvanzados.fechaHasta"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
              </div>
            </div>

            <div class="flex gap-3">
              <button 
                (click)="realizarBusquedaAvanzada()"
                class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <lucide-icon [img]="searchIcon" class="w-4 h-4"></lucide-icon>
                Buscar con filtros
              </button>
              <button 
                (click)="limpiarFiltros()"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors"
              >
                Limpiar filtros
              </button>
            </div>

            <!-- Información sobre búsqueda avanzada -->
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div class="flex items-start">
                <lucide-icon [img]="infoIcon" class="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0"></lucide-icon>
                <div>
                  <h4 class="text-sm font-medium text-purple-900 mb-1">¿Cómo usar el buscador?</h4>
                  <div class="text-sm text-purple-700 space-y-1">
                    <p><strong>Búsqueda rápida:</strong> Ideal para encontrar una receta específica cuando conoces el número, nombre del paciente o identificación.</p>
                    <p><strong>Búsqueda avanzada:</strong> Combina múltiples criterios para búsquedas más específicas. Puedes filtrar por médico, estado, rango de fechas y más.</p>
                    <p class="flex items-center gap-1 mt-2">
                      <lucide-icon [img]="alertTriangleIcon" class="w-3 h-3"></lucide-icon>
                      <strong>Tip:</strong> Los resultados incluyen tanto borradores como recetas emitidas. Haz doble clic en cualquier resultado para ver los detalles completos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas de resultados -->
      <div *ngIf="mostrarResultados" class="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div class="bg-white rounded-lg shadow border-l-4 border-l-gray-500 p-4">
          <div class="text-center">
            <p class="text-sm text-gray-600 font-medium">Total</p>
            <p class="text-2xl font-bold text-gray-900">{{ contarPorEstado('total') }}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-orange-500 p-4">
          <div class="text-center">
            <p class="text-sm text-gray-600 font-medium">Borradores</p>
            <p class="text-2xl font-bold text-orange-600">{{ contarPorEstado('borrador') }}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-blue-500 p-4">
          <div class="text-center">
            <p class="text-sm text-gray-600 font-medium">Emitidas</p>
            <p class="text-2xl font-bold text-blue-600">{{ contarPorEstado('emitida') }}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-yellow-500 p-4">
          <div class="text-center">
            <p class="text-sm text-gray-600 font-medium">Parciales</p>
            <p class="text-2xl font-bold text-yellow-600">{{ contarPorEstado('parcialmente-dispensada') }}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-green-500 p-4">
          <div class="text-center">
            <p class="text-sm text-gray-600 font-medium">Completas</p>
            <p class="text-2xl font-bold text-green-600">{{ contarPorEstado('dispensada') }}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-red-500 p-4">
          <div class="text-center">
            <p class="text-sm text-gray-600 font-medium">Anuladas</p>
            <p class="text-2xl font-bold text-red-600">{{ contarPorEstado('anulada') }}</p>
          </div>
        </div>
      </div>

      <!-- Resultados de Búsqueda -->
      <div *ngIf="mostrarResultados" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-purple-100 rounded-lg">
                <lucide-icon [img]="searchIcon" class="w-5 h-5 text-purple-600"></lucide-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Resultados de Búsqueda</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ recetasFiltradas.length }} receta{{ recetasFiltradas.length !== 1 ? 's' : '' }} encontrada{{ recetasFiltradas.length !== 1 ? 's' : '' }} • Doble clic para vista rápida
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <button 
                (click)="exportarResultados()"
                [disabled]="recetasFiltradas.length === 0"
                class="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
                Exportar resultados
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="recetasFiltradas.length === 0" class="p-12 text-center">
          <div class="flex justify-center mb-4">
            <div class="p-4 bg-gray-100 rounded-full">
              <lucide-icon [img]="searchIcon" class="w-12 h-12 text-gray-400"></lucide-icon>
            </div>
          </div>
          <h3 class="text-lg text-gray-900 mb-2">No se encontraron recetas</h3>
          <p class="text-gray-600">
            No hay recetas que coincidan con los criterios de búsqueda especificados.
          </p>
        </div>

        <div *ngIf="recetasFiltradas.length > 0" class="overflow-x-auto" style="max-height: 500px; overflow-y: auto;">
          <table class="w-full min-w-[1200px]">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Receta</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamentos</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let receta of recetasPaginadas" 
                  class="hover:bg-purple-50/50 cursor-pointer transition-all"
                  (dblclick)="verReceta(receta)"
                  title="Doble clic para ver detalles">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <lucide-icon [img]="fileTextIcon" class="w-4 h-4 text-purple-600"></lucide-icon>
                    <span class="font-medium">{{ receta.id }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p class="font-medium text-gray-900">{{ receta.paciente.nombre }}</p>
                    <p class="text-xs text-gray-500">{{ receta.paciente.cedula }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <lucide-icon [img]="calendarIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                    <span class="text-sm">{{ receta.fecha }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ receta.medico.nombre }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <lucide-icon [img]="pillIcon" class="w-4 h-4 text-purple-600"></lucide-icon>
                    <span>{{ receta.medicamentos.length }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getEstadoClass(receta.estado)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getEstadoTexto(receta.estado) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    (click)="verReceta(receta); $event.stopPropagation()"
                    class="text-purple-600 hover:text-purple-900 flex items-center gap-1"
                  >
                    <lucide-icon [img]="eyeIcon" class="w-4 h-4"></lucide-icon>
                    Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div *ngIf="recetasFiltradas.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Mostrando {{ (paginaActual - 1) * elementosPorPagina + 1 }} a {{ Math.min(paginaActual * elementosPorPagina, recetasFiltradas.length) }} de {{ recetasFiltradas.length }} recetas
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
                    ? 'px-3 py-2 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-md'
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
    </div>

    <!-- Modal lateral derecho para detalles de receta -->
    <div 
      *ngIf="recetaSeleccionada"
      class="fixed inset-0 z-50 overflow-hidden"
      (click)="cerrarModalDetalles()"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <!-- Panel lateral -->
      <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col"
           (click)="$event.stopPropagation()">
        
        <!-- Header del modal -->
        <div [class]="recetaSeleccionada.estado === 'borrador' 
          ? 'bg-gradient-to-r from-orange-600 to-orange-700' 
          : 'bg-gradient-to-r from-blue-600 to-blue-700'" 
          class="px-6 py-4 text-white flex-shrink-0">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <lucide-icon [img]="fileTextIcon" class="w-5 h-5"></lucide-icon>
                <h2 class="text-lg font-semibold">{{ recetaSeleccionada.estado === 'borrador' ? 'Borrador de Receta' : 'Receta' }}</h2>
              </div>
              <p [class]="recetaSeleccionada.estado === 'borrador' ? 'text-orange-100' : 'text-blue-100'" class="text-sm mt-1">{{ recetaSeleccionada.id }}</p>
            </div>
            <button 
              (click)="cerrarModalDetalles()"
              class="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
            </button>
          </div>
        </div>

        <!-- Contenido del modal con scroll -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-6 space-y-6">
          
          <!-- Estado de la receta -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <lucide-icon [img]="fileTextIcon" class="w-4 h-4 text-gray-600"></lucide-icon>
                <span class="text-sm font-medium text-gray-700">Estado de la receta</span>
              </div>
              <span [class]="getEstadoClass(recetaSeleccionada.estado)" 
                    class="px-3 py-1 text-xs font-semibold rounded-full">
                {{ getEstadoTexto(recetaSeleccionada.estado) }}
              </span>
            </div>
            <div *ngIf="recetaSeleccionada.estado === 'borrador'" class="mt-2">
              <p class="text-xs text-gray-600">Última modificación: {{ recetaSeleccionada.fechaModificacion }}</p>
            </div>
            <div *ngIf="recetaSeleccionada.estado !== 'borrador'" class="mt-2">
              <p class="text-xs text-gray-600">Emitida: {{ recetaSeleccionada.fecha }}</p>
            </div>
          </div>

          <!-- Información del Paciente -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <lucide-icon [img]="userIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
              <h3 class="text-lg font-semibold text-gray-900">Información del Paciente</h3>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p class="text-sm text-gray-600">Nombre completo</p>
                <p class="font-semibold text-gray-900">{{ recetaSeleccionada.paciente.nombre }}</p>
              </div>
              
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <p class="text-xs text-gray-600">Identificación</p>
                  <p class="text-sm font-medium text-gray-900">{{ recetaSeleccionada.paciente.cedula }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600">Edad</p>
                  <p class="text-sm font-medium text-gray-900">{{ recetaSeleccionada.paciente.edad }} años</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600">Sexo</p>
                  <p class="text-sm font-medium text-gray-900">{{ recetaSeleccionada.paciente.genero === 'M' ? 'Masculino' : 'Femenino' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Médico Prescriptor -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <lucide-icon [img]="stethoscopeIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
              <h3 class="text-lg font-semibold text-gray-900">Médico Prescriptor</h3>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p class="font-semibold text-gray-900">{{ recetaSeleccionada.medico.nombre }}</p>
                <p class="text-sm text-gray-600">{{ recetaSeleccionada.medico.especialidad }}</p>
              </div>
              
              <div class="flex items-center gap-4">
                <div *ngIf="recetaSeleccionada.estado === 'borrador'" class="flex items-center gap-2">
                  <lucide-icon [img]="alertTriangleIcon" class="w-4 h-4 text-orange-600"></lucide-icon>
                  <span class="text-xs text-orange-700 font-medium">Pendiente de firma digital</span>
                </div>
                <div *ngIf="recetaSeleccionada.estado !== 'borrador'" class="flex items-center gap-2">
                  <lucide-icon [img]="userCheckIcon" class="w-4 h-4 text-green-600"></lucide-icon>
                  <span class="text-xs text-green-700 font-medium">Firma digital verificada</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Medicamentos -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <lucide-icon [img]="pillIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
                <h3 class="text-lg font-semibold text-gray-900">Medicamentos</h3>
              </div>
              <span class="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                {{ recetaSeleccionada.medicamentos.length }} medicamento{{ recetaSeleccionada.medicamentos.length !== 1 ? 's' : '' }} prescrito{{ recetaSeleccionada.medicamentos.length !== 1 ? 's' : '' }}
              </span>
            </div>
            
            <div class="space-y-3">
              <div *ngFor="let medicamento of recetaSeleccionada.medicamentos" 
                   [class]="recetaSeleccionada.estado === 'borrador' 
                     ? 'bg-gray-50 rounded-lg p-4 border-l-4 border-l-orange-500' 
                     : 'bg-gray-50 rounded-lg p-4 border-l-4 border-l-purple-500'">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 mb-2">{{ medicamento.nombre }}</h4>
                    
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p class="text-gray-600">Dosis: <span class="font-medium text-gray-900">{{ medicamento.dosis }}</span></p>
                        <p class="text-gray-600">Frecuencia: <span class="font-medium text-gray-900">{{ medicamento.frecuencia }}</span></p>
                      </div>
                      <div>
                        <p class="text-gray-600">Duración: <span class="font-medium text-gray-900">{{ medicamento.duracion }}</span></p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="ml-4 text-right">
                    <span *ngIf="recetaSeleccionada.estado === 'borrador'" 
                          class="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                      <lucide-icon [img]="clockIcon" class="w-3 h-3 mr-1"></lucide-icon>
                      Borrador
                    </span>
                    <span *ngIf="medicamento.estado === 'dispensado'" 
                          class="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      <lucide-icon [img]="checkCircleIcon" class="w-3 h-3 mr-1"></lucide-icon>
                      Dispensado
                    </span>
                    <span *ngIf="recetaSeleccionada.estado !== 'borrador' && (!medicamento.estado || medicamento.estado === 'pendiente')" 
                          class="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      <lucide-icon [img]="clockIcon" class="w-3 h-3 mr-1"></lucide-icon>
                      Pendiente
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fechas -->
          <div *ngIf="recetaSeleccionada.estado === 'borrador'" class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <lucide-icon [img]="clockIcon" class="w-4 h-4 text-gray-600"></lucide-icon>
              <span class="text-sm font-medium text-gray-700">Última modificación</span>
            </div>
            <p class="text-sm text-gray-900">{{ recetaSeleccionada.fechaModificacion }}</p>
          </div>

          <div *ngIf="recetaSeleccionada.estado !== 'borrador'" class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="calendarIcon" class="w-4 h-4 text-gray-600"></lucide-icon>
                <span class="text-sm font-medium text-gray-700">Fecha de emisión</span>
              </div>
              <p class="text-sm text-gray-900">{{ recetaSeleccionada.fecha }}</p>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="clockIcon" class="w-4 h-4 text-gray-600"></lucide-icon>
                <span class="text-sm font-medium text-gray-700">Válida hasta</span>
              </div>
              <p class="text-sm text-gray-900">{{ recetaSeleccionada.fechaVencimiento }}</p>
            </div>
          </div>

          <!-- Verificación de Autenticidad (solo para recetas emitidas) -->
          <div *ngIf="recetaSeleccionada.estado !== 'borrador'">
            <div class="flex items-center gap-2 mb-3">
              <lucide-icon [img]="checkCircleIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
              <h3 class="text-lg font-semibold text-gray-900">Verificación de Autenticidad</h3>
            </div>
            
            <!-- Código QR -->
            <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-4">
              <div class="flex items-start gap-3">
                <div class="p-3 bg-cyan-100 rounded-lg">
                  <lucide-icon [img]="qrCodeIcon" class="w-8 h-8 text-cyan-600"></lucide-icon>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <lucide-icon [img]="qrCodeIcon" class="w-4 h-4 text-cyan-600"></lucide-icon>
                    <span class="text-sm font-medium text-cyan-800">Código QR</span>
                  </div>
                  <p class="text-sm font-semibold text-cyan-900 mb-1">QR-{{ recetaSeleccionada.id }}</p>
                  <p class="text-xs text-cyan-700">Escanee este código para verificar la receta</p>
                </div>
              </div>
            </div>

            <!-- Token de verificación -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <div class="p-3 bg-blue-100 rounded-lg">
                  <lucide-icon [img]="keyIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <lucide-icon [img]="keyIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                    <span class="text-sm font-medium text-blue-800">Token de verificación</span>
                  </div>
                  <p class="text-sm font-semibold text-blue-900 mb-1">VRF-{{ recetaSeleccionada.id.split('-')[1] }}-{{ recetaSeleccionada.id.split('-')[2] }}-X8K4</p>
                  <p class="text-xs text-blue-700">Use este token para verificación manual</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <!-- Footer con botones de acción -->
        <div class="border-t border-gray-200 px-6 py-4 bg-gray-50 flex-shrink-0">
          <!-- Botones para Borradores -->
          <div *ngIf="recetaSeleccionada.estado === 'borrador'" class="space-y-3">
            <button 
              (click)="continuarEditando(recetaSeleccionada)"
              class="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <lucide-icon [img]="editIcon" class="w-4 h-4"></lucide-icon>
              Continuar editando
            </button>
            
            <div class="grid grid-cols-2 gap-3">
              <button 
                (click)="duplicarReceta(recetaSeleccionada)"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <lucide-icon [img]="copyIcon" class="w-4 h-4"></lucide-icon>
                Duplicar
              </button>
              
              <button 
                (click)="eliminarBorrador(recetaSeleccionada)"
                class="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <lucide-icon [img]="trash2Icon" class="w-4 h-4"></lucide-icon>
                Eliminar borrador
              </button>
            </div>
          </div>

          <!-- Botones para Recetas Emitidas -->
          <div *ngIf="recetaSeleccionada.estado !== 'borrador'" class="space-y-3">
            <button 
              (click)="reimprimirReceta(recetaSeleccionada)"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <lucide-icon [img]="printerIcon" class="w-4 h-4"></lucide-icon>
              Reimprimir receta
            </button>
            
            <div class="grid grid-cols-2 gap-3">
              <button 
                (click)="exportarPDF(recetaSeleccionada)"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
                Exportar PDF
              </button>
              
              <button 
                (click)="duplicarReceta(recetaSeleccionada)"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <lucide-icon [img]="copyIcon" class="w-4 h-4"></lucide-icon>
                Duplicar
              </button>
            </div>
            
            <button 
              *ngIf="recetaSeleccionada.estado === 'emitida'"
              (click)="anularReceta(recetaSeleccionada)"
              class="w-full bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <lucide-icon [img]="banIcon" class="w-4 h-4"></lucide-icon>
              Anular receta
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sistema de Notificaciones Toast -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div 
        *ngFor="let notificacion of notificaciones" 
        [class]="getNotificacionClass(notificacion.tipo)"
        class="min-w-80 p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out"
        [class.translate-x-full]="!notificacion.visible"
        [class.translate-x-0]="notificacion.visible"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <lucide-icon 
              [img]="getNotificacionIcon(notificacion.tipo)" 
              class="w-5 h-5 flex-shrink-0">
            </lucide-icon>
            <p class="text-sm font-medium">{{ notificacion.mensaje }}</p>
          </div>
          <button 
            (click)="cerrarNotificacion(notificacion.id)"
            class="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de sugerencia de rol -->
    <app-role-suggestion-modal
      [isOpen]="showRoleSuggestionModal()"
      [suggestedRole]="'Médico'"
      (dismiss)="onRoleSuggestionDismiss()"
      (roleChanged)="onRoleChanged()"
    ></app-role-suggestion-modal>
  `
})
export class BuscarPrescripcionComponent implements OnInit, OnDestroy {
  searchIcon = Search;
  fileTextIcon = FileText;
  calendarIcon = Calendar;
  userIcon = User;
  pillIcon = Pill;
  filterIcon = Filter;
  eyeIcon = Eye;
  downloadIcon = Download;
  clockIcon = Clock;
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;
  xIcon = X;
  userCheckIcon = UserCheck;
  stethoscopeIcon = Stethoscope;
  alertTriangleIcon = AlertTriangle;
  checkCircleIcon = CheckCircle;
  xCircleIcon = XCircle;
  infoIcon = Info;
  copyIcon = Copy;
  trash2Icon = Trash2;
  qrCodeIcon = QrCode;
  keyIcon = Key;
  printerIcon = Printer;
  banIcon = Ban;
  editIcon = Edit;

  // Control de tabs
  tiposBusqueda: 'rapida' | 'avanzada' = 'rapida';
  
  // Búsqueda rápida
  busquedaRapida = '';
  
  // Filtros avanzados
  filtrosAvanzados = {
    numeroReceta: '',
    estado: '',
    nombrePaciente: '',
    cedulaPaciente: '',
    medico: '',
    medicamento: '',
    fechaDesde: '',
    fechaHasta: ''
  };

  // Control de resultados
  mostrarResultados = false;
  recetasFiltradas: Receta[] = [];
  recetaSeleccionada: Receta | null = null;

  // Sistema de notificaciones
  notificaciones: Array<{
    id: number;
    mensaje: string;
    tipo: 'success' | 'error' | 'info';
    visible: boolean;
  }> = [];

  // Role suggestion modal state
  showRoleSuggestionModal = signal(false);
  private subscriptions = new Subscription();

  // Paginación
  paginaActual = 1;
  elementosPorPagina = 10;
  totalPaginas = 0;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Prescripciones', route: '/prescripciones' },
    { label: 'Buscar Receta' }
  ];

  // Datos de ejemplo (combinando borradores y recetas emitidas)
  todasLasRecetas: Receta[] = [
    // Borradores
    {
      id: 'RX-2025-009847',
      paciente: {
        nombre: 'María Elena González Rodríguez',
        cedula: 'CC-52.841.963',
        edad: 45,
        genero: 'F'
      },
      medico: {
        nombre: 'Dr. Carlos Alberto Mendoza Herrera',
        especialidad: 'Medicina Interna',
        codigoMedico: 'MED-001',
        firmaDigital: false
      },
      diagnostico: 'Hipertensión arterial esencial (I10)',
      fecha: '27/09/2025',
      fechaVencimiento: '',
      estado: 'borrador',
      medicamentos: [
        {
          nombre: 'Losartán 50mg',
          dosis: '50mg',
          cantidad: 30,
          frecuencia: 'Cada 12 horas',
          duracion: '30 días'
        },
        {
          nombre: 'Amlodipino 5mg',
          dosis: '5mg',
          cantidad: 30,
          frecuencia: 'Una vez al día',
          duracion: '30 días'
        },
        {
          nombre: 'Hidroclorotiazida 25mg',
          dosis: '25mg',
          cantidad: 30,
          frecuencia: 'Una vez al día',
          duracion: '30 días'
        }
      ],
      fechaModificacion: '27/09/2025'
    },
    {
      id: 'RX-2025-009846',
      paciente: {
        nombre: 'Juan Carlos Martínez López',
        cedula: 'CC-43.729.541',
        edad: 38,
        genero: 'M'
      },
      medico: {
        nombre: 'Dr. Carlos Alberto Mendoza Herrera',
        especialidad: 'Medicina Interna',
        codigoMedico: 'MED-001',
        firmaDigital: false
      },
      diagnostico: 'Diabetes mellitus tipo 2 (E11.9)',
      fecha: '27/09/2025',
      fechaVencimiento: '',
      estado: 'borrador',
      medicamentos: [
        {
          nombre: 'Metformina 850mg',
          dosis: '850mg',
          cantidad: 60,
          frecuencia: 'Cada 12 horas',
          duracion: '30 días'
        },
        {
          nombre: 'Glibenclamida 5mg',
          dosis: '5mg',
          cantidad: 30,
          frecuencia: 'Una vez al día',
          duracion: '30 días'
        }
      ],
      fechaModificacion: '27/09/2025'
    },
    // Recetas emitidas
    {
      id: 'RX-2025-009842',
      paciente: {
        nombre: 'Carlos Andrés Pérez Gutiérrez',
        cedula: 'CC-41.523.789',
        edad: 52,
        genero: 'M'
      },
      medico: {
        nombre: 'Dr. Carlos Andrés Martínez López',
        especialidad: 'Cardiología',
        codigoMedico: 'MED-002',
        firmaDigital: true
      },
      diagnostico: 'Hipertensión arterial esencial (I10)',
      fecha: '01/10/2025',
      fechaVencimiento: '15/10/2025',
      estado: 'emitida',
      medicamentos: [
        {
          nombre: 'Enalapril 10mg',
          dosis: '10mg',
          cantidad: 30,
          frecuencia: 'Cada 12 horas',
          duracion: '30 días',
          estado: 'pendiente'
        },
        {
          nombre: 'Atenolol 50mg',
          dosis: '50mg',
          cantidad: 30,
          frecuencia: 'Una vez al día',
          duracion: '30 días',
          estado: 'pendiente'
        },
        {
          nombre: 'Aspirina 100mg',
          dosis: '100mg',
          cantidad: 30,
          frecuencia: 'Una vez al día',
          duracion: '30 días',
          estado: 'pendiente'
        }
      ]
    },
    {
      id: 'RX-2025-009841',
      paciente: {
        nombre: 'Sandra Milena Torres Vargas',
        cedula: 'CC-38.947.256',
        edad: 41,
        genero: 'F'
      },
      medico: {
        nombre: 'Dra. María Elena Rodríguez Silva',
        especialidad: 'Medicina General',
        codigoMedico: 'MED-003',
        firmaDigital: true
      },
      diagnostico: 'Infección del tracto urinario (N39.0)',
      fecha: '01/10/2025',
      fechaVencimiento: '15/10/2025',
      estado: 'parcialmente-dispensada',
      medicamentos: [
        {
          nombre: 'Ciprofloxacina 500mg',
          dosis: '500mg',
          cantidad: 14,
          frecuencia: 'Cada 12 horas',
          duracion: '7 días',
          estado: 'dispensado'
        },
        {
          nombre: 'Fenazopiridina 200mg',
          dosis: '200mg',
          cantidad: 21,
          frecuencia: 'Cada 8 horas',
          duracion: '7 días',
          estado: 'pendiente'
        },
        {
          nombre: 'Ibuprofeno 400mg',
          dosis: '400mg',
          cantidad: 20,
          frecuencia: 'Cada 8 horas',
          duracion: '5 días',
          estado: 'pendiente'
        }
      ],
      farmacia: 'Farmacia San José',
      fechaDispensacion: '02/10/2025'
    },
    {
      id: 'RX-2025-009840',
      paciente: {
        nombre: 'Roberto José Sánchez Mora',
        cedula: 'CC-29.847.563',
        edad: 35,
        genero: 'M'
      },
      medico: {
        nombre: 'Dr. Carlos Alberto Mendoza Herrera',
        especialidad: 'Medicina Interna',
        codigoMedico: 'MED-001',
        firmaDigital: true
      },
      diagnostico: 'Gastritis aguda (K29.0)',
      fecha: '30/09/2025',
      fechaVencimiento: '14/10/2025',
      estado: 'dispensada',
      medicamentos: [
        {
          nombre: 'Omeprazol 20mg',
          dosis: '20mg',
          cantidad: 30,
          frecuencia: 'Una vez al día',
          duracion: '30 días',
          estado: 'dispensado'
        }
      ],
      farmacia: 'Farmacia Central',
      fechaDispensacion: '01/10/2025'
    },
    {
      id: 'RX-2025-009839',
      paciente: {
        nombre: 'Laura Sofía Díaz Ramírez',
        cedula: 'CC-47.258.963',
        edad: 28,
        genero: 'F'
      },
      medico: {
        nombre: 'Dra. Ana Patricia Morales Vega',
        especialidad: 'Ginecología',
        codigoMedico: 'MED-004',
        firmaDigital: true
      },
      diagnostico: 'Infección vaginal por hongos (B37.3)',
      fecha: '29/09/2025',
      fechaVencimiento: '13/10/2025',
      estado: 'vencida',
      medicamentos: [
        {
          nombre: 'Fluconazol 150mg',
          dosis: '150mg',
          cantidad: 1,
          frecuencia: 'Dosis única',
          duracion: '1 día',
          estado: 'pendiente'
        }
      ]
    }
  ];

  get totalPrescripciones(): number {
    return this.todasLasRecetas.length;
  }

  get recetasPaginadas(): Receta[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.recetasFiltradas.slice(inicio, fin);
  }

  constructor(
    private roleDemoService: RoleDemoService,
    private roleSuggestionService: RoleSuggestionService,
    private prescripcionesService: PrescripcionesService
  ) {
    this.calcularPaginacion();
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

    // Cargar todas las prescripciones del backend
    this.cargarTodasLasPrescripciones();
  }

  /**
   * Cargar todas las prescripciones del backend
   */
  private cargarTodasLasPrescripciones() {
    const params: SearchPrescriptionsParams = {
      pageSize: 100 // Máximo permitido por el backend
    };

    this.prescripcionesService.getPrescripciones(params).subscribe({
      next: async (response) => {
        if (response.items && response.items.length > 0) {
          await this.mapPrescriptionsToRecetas(response.items);
        }
      },
      error: (error) => {
        console.error('Error cargando prescripciones:', error);
        this.mostrarNotificacion('Error al cargar las recetas', 'error');
      }
    });
  }

  /**
   * Mapear prescripciones del backend a la interfaz local
   */
  private async mapPrescriptionsToRecetas(prescriptions: PrescriptionDto[]) {
    const recetas: Receta[] = [];

    for (const p of prescriptions) {
      try {
        const receta: Receta = {
          id: p.prescriptionNumber || p.id,
          paciente: {
            nombre: p.patientName || 'Paciente no encontrado',
            cedula: p.patientIdNumber || 'N/A',
            edad: p.patientAge || 0,
            genero: (p.patientGender === 'M' || p.patientGender === 'Male') ? 'M' : 'F'
          },
          diagnostico: p.diagnoses && p.diagnoses.length > 0 
            ? `${p.diagnoses[0].description} (${p.diagnoses[0].cie10Code})`
            : 'Sin diagnóstico',
          medicamentos: p.medications && p.medications.length > 0 
            ? p.medications.map(m => ({
                nombre: m.medication?.name || `Medicamento ${m.medicationId.substring(0, 8)}`,
                dosis: m.dosage,
                cantidad: m.quantity,
                frecuencia: m.frequency,
                duracion: `${m.durationDays} días`,
                estado: 'pendiente' as const
              }))
            : [],
          medico: {
            nombre: p.doctorName || 'Médico',
            especialidad: p.doctorSpecialty || 'N/A',
            codigoMedico: p.doctorLicenseNumber || p.doctorId || 'N/A',
            firmaDigital: true
          },
          fecha: p.prescriptionDate,
          fechaVencimiento: p.expirationDate || '',
          estado: this.mapStatus(p.status),
          fechaModificacion: p.updatedAt || p.prescriptionDate
        };

        recetas.push(receta);
      } catch (error) {
        console.error(`Error mapeando prescripción ${p.id}:`, error);
      }
    }

    this.todasLasRecetas = recetas;
    this.calcularPaginacion();
  }

  /**
   * Mapear estado del backend al frontend
   */
  private mapStatus(backendStatus: string): 'borrador' | 'emitida' | 'dispensada' | 'parcialmente-dispensada' | 'vencida' | 'anulada' {
    const statusMap: { [key: string]: 'borrador' | 'emitida' | 'dispensada' | 'parcialmente-dispensada' | 'vencida' | 'anulada' } = {
      'draft': 'borrador',
      'active': 'emitida',
      'dispensed': 'dispensada',
      'expired': 'vencida',
      'cancelled': 'anulada'
    };

    return statusMap[backendStatus] || 'emitida';
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

  realizarBusquedaRapida() {
    if (!this.busquedaRapida.trim()) {
      this.mostrarResultados = false;
      return;
    }

    const termino = this.busquedaRapida.toLowerCase().trim();
    this.recetasFiltradas = this.todasLasRecetas.filter(receta => 
      receta.id.toLowerCase().includes(termino) ||
      receta.paciente.nombre.toLowerCase().includes(termino) ||
      receta.paciente.cedula.toLowerCase().includes(termino)
    );

    this.mostrarResultados = true;
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  realizarBusquedaAvanzada() {
    // Filtrar datos locales (ya cargados del backend)
    this.recetasFiltradas = this.todasLasRecetas.filter(receta => {
      const cumpleNumero = !this.filtrosAvanzados.numeroReceta || 
        receta.id.toLowerCase().includes(this.filtrosAvanzados.numeroReceta.toLowerCase());
      
      const cumpleEstado = !this.filtrosAvanzados.estado || receta.estado === this.filtrosAvanzados.estado;
      
      const cumpleNombrePaciente = !this.filtrosAvanzados.nombrePaciente || 
        receta.paciente.nombre.toLowerCase().includes(this.filtrosAvanzados.nombrePaciente.toLowerCase());
      
      const cumpleCedulaPaciente = !this.filtrosAvanzados.cedulaPaciente || 
        receta.paciente.cedula.toLowerCase().includes(this.filtrosAvanzados.cedulaPaciente.toLowerCase());
      
      const cumpleMedico = !this.filtrosAvanzados.medico || 
        receta.medico.nombre.toLowerCase().includes(this.filtrosAvanzados.medico.toLowerCase());
      
      const cumpleMedicamento = !this.filtrosAvanzados.medicamento || 
        receta.medicamentos.some(med => med.nombre.toLowerCase().includes(this.filtrosAvanzados.medicamento.toLowerCase()));

      // Filtros de fecha
      const cumpleFechaDesde = !this.filtrosAvanzados.fechaDesde || receta.fecha >= this.filtrosAvanzados.fechaDesde;
      const cumpleFechaHasta = !this.filtrosAvanzados.fechaHasta || receta.fecha <= this.filtrosAvanzados.fechaHasta;

      return cumpleNumero && cumpleEstado && cumpleNombrePaciente && cumpleCedulaPaciente && cumpleMedico && cumpleMedicamento && cumpleFechaDesde && cumpleFechaHasta;
    });

    this.mostrarResultados = true;
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  limpiarBusqueda() {
    this.busquedaRapida = '';
    this.mostrarResultados = false;
    this.recetasFiltradas = [];
  }

  limpiarFiltros() {
    this.filtrosAvanzados = {
      numeroReceta: '',
      estado: '',
      nombrePaciente: '',
      cedulaPaciente: '',
      medico: '',
      medicamento: '',
      fechaDesde: '',
      fechaHasta: ''
    };
    this.mostrarResultados = false;
    this.recetasFiltradas = [];
  }

  contarPorEstado(estado: string): number {
    if (estado === 'total') {
      return this.recetasFiltradas.length;
    }
    return this.recetasFiltradas.filter(r => r.estado === estado).length;
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'borrador':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'emitida':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dispensada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'parcialmente-dispensada':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'vencida':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'anulada':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'borrador':
        return 'Borrador';
      case 'emitida':
        return 'Emitida';
      case 'dispensada':
        return 'Dispensada';
      case 'parcialmente-dispensada':
        return 'Parcialmente dispensada';
      case 'vencida':
        return 'Vencida';
      case 'anulada':
        return 'Anulada';
      default:
        return estado;
    }
  }

  verReceta(receta: Receta) {
    this.recetaSeleccionada = receta;
  }

  cerrarModalDetalles() {
    this.recetaSeleccionada = null;
  }

  continuarEditando(receta: Receta) {
    console.log('Continuar editando borrador:', receta.id);
    // Aquí iría la navegación al editor de recetas
    this.mostrarNotificacion(`Redirigiendo al editor para continuar con el borrador ${receta.id}`, 'info');
  }

  reimprimirReceta(receta: Receta) {
    // Guardar los datos de la receta en sessionStorage para que el componente de impresión los use
    sessionStorage.setItem('recetaParaImprimir', JSON.stringify({
      id: receta.id,
      paciente: receta.paciente,
      medicamentos: receta.medicamentos,
      medico: receta.medico,
      diagnostico: receta.diagnostico,
      fecha: receta.fecha,
      fechaVencimiento: receta.fechaVencimiento
    }));
    
    // Abrir nueva pestaña con la vista de impresión
    const url = `/prescripciones/imprimir/${receta.id}`;
    window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  }

  duplicarReceta(receta: Receta) {
    // Generar nuevo ID
    const timestamp = Date.now();
    const nuevoId = `RX-2025-${timestamp.toString().slice(-6)}`;
    
    // Crear nueva receta como borrador
    const nuevaReceta: Receta = {
      id: nuevoId,
      paciente: { ...receta.paciente },
      medico: { 
        ...receta.medico, 
        firmaDigital: false 
      },
      diagnostico: receta.diagnostico,
      fecha: new Date().toLocaleDateString('es-ES'),
      fechaVencimiento: '',
      estado: 'borrador',
      medicamentos: receta.medicamentos.map(med => ({
        nombre: med.nombre,
        dosis: med.dosis,
        cantidad: med.cantidad,
        frecuencia: med.frecuencia,
        duracion: med.duracion
      })),
      fechaModificacion: new Date().toLocaleDateString('es-ES')
    };

    // Agregar a las listas
    this.todasLasRecetas.unshift(nuevaReceta);
    
    if (this.mostrarResultados) {
      this.recetasFiltradas.unshift(nuevaReceta);
      this.paginaActual = 1;
      this.calcularPaginacion();
    }

    console.log('Nueva receta creada:', nuevoId);
    this.mostrarNotificacion(`Receta duplicada exitosamente: ${nuevoId}`, 'success');
    this.cerrarModalDetalles();
  }

  eliminarBorrador(receta: Receta) {
    if (confirm(`¿Estás seguro de que deseas eliminar el borrador ${receta.id}?\n\nEsta acción no se puede deshacer.`)) {
      // Eliminar de la lista principal
      const indiceGeneral = this.todasLasRecetas.findIndex(r => r.id === receta.id);
      if (indiceGeneral > -1) {
        this.todasLasRecetas.splice(indiceGeneral, 1);
      }

      // Eliminar de los resultados filtrados si existe
      if (this.mostrarResultados) {
        const indiceFiltrado = this.recetasFiltradas.findIndex(r => r.id === receta.id);
        if (indiceFiltrado > -1) {
          this.recetasFiltradas.splice(indiceFiltrado, 1);
          this.calcularPaginacion();
        }
      }

      console.log('Borrador eliminado:', receta.id);
      this.mostrarNotificacion(`Borrador ${receta.id} eliminado correctamente`, 'error');
      this.cerrarModalDetalles();
    }
  }

  exportarPDF(receta: Receta) {
    // Guardar los datos de la receta en sessionStorage para que el componente de impresión los use
    sessionStorage.setItem('recetaParaImprimir', JSON.stringify({
      id: receta.id,
      paciente: receta.paciente,
      medicamentos: receta.medicamentos,
      medico: receta.medico,
      diagnostico: receta.diagnostico,
      fecha: receta.fecha,
      fechaVencimiento: receta.fechaVencimiento
    }));
    
    // Abrir nueva pestaña con auto-impresión
    const url = `/prescripciones/imprimir/${receta.id}?autoprint=true`;
    window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  }

  anularReceta(receta: Receta) {
    if (confirm(`¿Estás seguro de que deseas anular la receta ${receta.id}?\n\nEsta acción cambiará el estado de la receta a "anulada" y no podrá ser dispensada.`)) {
      // Actualizar estado en la lista principal
      const indiceGeneral = this.todasLasRecetas.findIndex(r => r.id === receta.id);
      if (indiceGeneral > -1) {
        this.todasLasRecetas[indiceGeneral].estado = 'anulada';
      }

      // Actualizar en los resultados filtrados si existe
      if (this.mostrarResultados) {
        const indiceFiltrado = this.recetasFiltradas.findIndex(r => r.id === receta.id);
        if (indiceFiltrado > -1) {
          this.recetasFiltradas[indiceFiltrado].estado = 'anulada';
        }
      }

      console.log('Receta anulada:', receta.id);
      this.mostrarNotificacion(`Receta ${receta.id} anulada correctamente`, 'error');
      this.cerrarModalDetalles();
    }
  }

  private generarNuevoId(): string {
    const año = new Date().getFullYear();
    const numeroAleatorio = Math.floor(Math.random() * 900000) + 100000; // 6 dígitos
    return `RX-${año}-${numeroAleatorio.toString().padStart(6, '0')}`;
  }

  exportarResultados() {
    console.log('Exportando resultados:', this.recetasFiltradas);
    this.mostrarNotificacion(`Exportando ${this.recetasFiltradas.length} recetas a Excel...`, 'info');
  }

  // Paginación
  calcularPaginacion() {
    this.totalPaginas = Math.ceil(this.recetasFiltradas.length / this.elementosPorPagina);
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

  // Método Math para el template
  Math = Math;

  // Sistema de notificaciones
  private contadorNotificaciones = 0;

  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'info' = 'info') {
    const id = ++this.contadorNotificaciones;
    const notificacion = {
      id,
      mensaje,
      tipo,
      visible: false
    };

    this.notificaciones.push(notificacion);

    // Mostrar con animación
    setTimeout(() => {
      const index = this.notificaciones.findIndex(n => n.id === id);
      if (index > -1) {
        this.notificaciones[index].visible = true;
      }
    }, 100);

    // Auto-cerrar después de 4 segundos
    setTimeout(() => {
      this.cerrarNotificacion(id);
    }, 4000);
  }

  cerrarNotificacion(id: number) {
    const index = this.notificaciones.findIndex(n => n.id === id);
    if (index > -1) {
      this.notificaciones[index].visible = false;
      // Remover después de la animación
      setTimeout(() => {
        const finalIndex = this.notificaciones.findIndex(n => n.id === id);
        if (finalIndex > -1) {
          this.notificaciones.splice(finalIndex, 1);
        }
      }, 300);
    }
  }

  getNotificacionClass(tipo: 'success' | 'error' | 'info'): string {
    switch (tipo) {
      case 'success':
        return 'bg-green-50 border border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border border-red-200 text-red-800';
      case 'info':
      default:
        return 'bg-blue-50 border border-blue-200 text-blue-800';
    }
  }

  getNotificacionIcon(tipo: 'success' | 'error' | 'info') {
    switch (tipo) {
      case 'success':
        return this.checkCircleIcon;
      case 'error':
        return this.xCircleIcon;
      case 'info':
      default:
        return this.infoIcon;
    }
  }
}
