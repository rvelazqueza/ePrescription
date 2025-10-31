import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LucideAngularModule, Search, FileText, Calendar, User, Pill, Filter, Eye, Download, Clock, ChevronLeft, ChevronRight, X, UserCheck, Stethoscope, AlertTriangle, CheckCircle, XCircle, Info, Copy, Trash2, QrCode, Key, Printer, Ban, Edit, FileCheck, ArrowRight, MoreVertical } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';
import { RoleSuggestionService } from '../../../services/role-suggestion.service';

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
  selector: 'app-duplicar-prescripcion',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, BreadcrumbsComponent, PageHeaderComponent, RoleSuggestionModalComponent],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumbs -->
      <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>
      
      <!-- Page Header -->
      <app-page-header 
        title="Duplicar Receta" 
        description="Crea nuevas prescripciones basadas en recetas existentes"
        [icon]="copyIcon">
        <div slot="action" class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30">
          <div class="text-right">
            <p class="text-xs text-white/80">Recetas disponibles</p>
            <p class="text-2xl font-bold text-white">{{ recetasDisponibles }}</p>
          </div>
        </div>
      </app-page-header>

      <!-- Información sobre duplicación -->
      <div class="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg shadow border border-teal-200 p-6">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-teal-100 rounded-lg">
                <lucide-icon [img]="copyIcon" class="w-6 h-6 text-teal-600"></lucide-icon>
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">Duplicación de recetas para tratamientos recurrentes</h2>
                <p class="text-gray-600 text-sm mt-1">La duplicación de recetas permite crear rápidamente nuevas prescripciones basadas en tratamientos previos, ideal para:</p>
              </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4 mb-4">
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span class="text-sm text-gray-700">Renovación de tratamientos crónicos</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span class="text-sm text-gray-700">Prescripciones recurrentes para el mismo paciente</span>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span class="text-sm text-gray-700">Esquemas terapéuticos similares</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span class="text-sm text-gray-700">Ahorro de tiempo en prescripciones frecuentes</span>
                </div>
              </div>
            </div>

            <div class="bg-teal-100/50 rounded-lg p-4 border border-teal-200">
              <div class="flex items-start gap-3">
                <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0"></lucide-icon>
                <div>
                  <p class="text-sm font-medium text-teal-800 mb-1">Importante:</p>
                  <p class="text-sm text-teal-700">El nuevo borrador mantiene todos los medicamentos y datos del paciente. Se genera un nuevo número de receta y puedes modificar cualquier dato antes de emitir.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs de Búsqueda -->
      <div class="bg-white rounded-lg shadow border border-gray-200">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex">
            <button 
              (click)="tiposBusqueda = 'rapida'"
              [class]="tiposBusqueda === 'rapida' 
                ? 'border-teal-500 text-teal-600 bg-teal-50' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="w-1/2 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors">
              Búsqueda Rápida
            </button>
            <button 
              (click)="tiposBusqueda = 'avanzada'"
              [class]="tiposBusqueda === 'avanzada' 
                ? 'border-teal-500 text-teal-600 bg-teal-50' 
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
              <p class="text-sm text-gray-600 mb-4">Busca la receta que deseas duplicar por número, paciente o identificación</p>
            </div>
            
            <div class="flex gap-3">
              <div class="flex-1 relative">
                <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
                <input 
                  type="text" 
                  [(ngModel)]="busquedaRapida"
                  (input)="realizarBusquedaRapida()"
                  placeholder="Número de receta, nombre del paciente o ID..."
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
              </div>
              <button 
                (click)="realizarBusquedaRapida()"
                class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <lucide-icon [img]="searchIcon" class="w-4 h-4"></lucide-icon>
                Buscar
              </button>
            </div>
          </div>
        </div>

        <!-- Búsqueda Avanzada -->
        <div *ngIf="tiposBusqueda === 'avanzada'" class="p-6">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Búsqueda Avanzada</h3>
              <p class="text-sm text-gray-600 mb-4">Usa múltiples criterios para encontrar la receta que deseas duplicar. Puedes duplicar tanto borradores como recetas ya emitidas.</p>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Número de Receta</label>
                <input 
                  type="text" 
                  [(ngModel)]="filtrosAvanzados.numeroReceta"
                  placeholder="RX-2025-XXXXXX"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Estado de la Receta</label>
                <select 
                  [(ngModel)]="filtrosAvanzados.estado"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Todos los estados</option>
                  <option value="borrador">Borrador</option>
                  <option value="emitida">Emitida</option>
                  <option value="dispensada">Dispensada</option>
                  <option value="parcialmente-dispensada">Parcialmente dispensada</option>
                  <option value="vencida">Vencida</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Paciente</label>
                <input 
                  type="text" 
                  [(ngModel)]="filtrosAvanzados.nombrePaciente"
                  placeholder="Nombre completo del paciente"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Identificación del Paciente</label>
                <input 
                  type="text" 
                  [(ngModel)]="filtrosAvanzados.cedulaPaciente"
                  placeholder="CC, TI, CE, etc."
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Desde</label>
                <input 
                  type="date" 
                  [(ngModel)]="filtrosAvanzados.fechaDesde"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Hasta</label>
                <input 
                  type="date" 
                  [(ngModel)]="filtrosAvanzados.fechaHasta"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
              </div>
            </div>

            <div class="flex gap-3">
              <button 
                (click)="realizarBusquedaAvanzada()"
                class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
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
          </div>
        </div>
      </div>

      <!-- Estado inicial sin búsqueda -->
      <div *ngIf="!mostrarResultados" class="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-12 text-center border border-teal-100">
        <div class="flex justify-center mb-6">
          <div class="p-4 bg-teal-100 rounded-full">
            <lucide-icon [img]="searchIcon" class="w-12 h-12 text-teal-600"></lucide-icon>
          </div>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-3">Comienza buscando una receta para duplicar</h3>
        <p class="text-gray-600 mb-6 max-w-md mx-auto">
          Usa la búsqueda rápida o avanzada para encontrar la receta que deseas duplicar. Puedes duplicar tanto borradores como recetas ya emitidas.
        </p>
        
        <!-- Pasos del proceso -->
        <div class="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div class="text-center">
            <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span class="text-lg font-bold text-teal-600">1</span>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Buscar receta</h4>
            <p class="text-sm text-gray-600">Encuentra la prescripción original usando cualquier criterio</p>
          </div>
          
          <div class="text-center">
            <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span class="text-lg font-bold text-teal-600">2</span>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Vista previa y duplicar</h4>
            <p class="text-sm text-gray-600">Revisa los detalles y confirma la duplicación</p>
          </div>
          
          <div class="text-center">
            <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span class="text-lg font-bold text-teal-600">3</span>
            </div>
            <h4 class="font-semibold text-gray-900 mb-2">Editar y emitir</h4>
            <p class="text-sm text-gray-600">Modifica el nuevo borrador según sea necesario</p>
          </div>
        </div>
      </div>

      <!-- Resultados de Búsqueda -->
      <div *ngIf="mostrarResultados" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-teal-100 rounded-lg">
                <lucide-icon [img]="searchIcon" class="w-5 h-5 text-teal-600"></lucide-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Recetas Disponibles para Duplicar</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ recetasFiltradas.length }} receta{{ recetasFiltradas.length !== 1 ? 's' : '' }} encontrada{{ recetasFiltradas.length !== 1 ? 's' : '' }} • Doble clic para ver detalles o usa el menú de acciones
                </p>
              </div>
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
                  class="hover:bg-teal-50/50 transition-all cursor-pointer"
                  (dblclick)="verReceta(receta)"
                  title="Doble clic para ver detalles">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <lucide-icon [img]="fileTextIcon" class="w-4 h-4 text-teal-600"></lucide-icon>
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
                    <lucide-icon [img]="pillIcon" class="w-4 h-4 text-teal-600"></lucide-icon>
                    <span>{{ receta.medicamentos.length }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getEstadoClass(receta.estado)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getEstadoTexto(receta.estado) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="relative">
                    <button 
                      (click)="toggleAccionesModal(receta.id); $event.stopPropagation()"
                      class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                      title="Más acciones"
                    >
                      <lucide-icon [img]="moreVerticalIcon" class="w-5 h-5"></lucide-icon>
                    </button>
                    
                    <!-- Modal de acciones -->
                    <div 
                      *ngIf="modalAccionesAbierto === receta.id"
                      (click)="$event.stopPropagation()"
                      class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <div class="py-2">
                        <div class="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                          Acciones
                        </div>
                        
                        <button 
                          (click)="verReceta(receta); cerrarModalAcciones()"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <lucide-icon [img]="eyeIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                          Ver detalles
                        </button>
                        
                        <button 
                          (click)="duplicarReceta(receta); cerrarModalAcciones()"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <lucide-icon [img]="copyIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                          Duplicar receta
                        </button>
                        
                        <div *ngIf="receta.estado !== 'borrador'" class="border-t border-gray-100 mt-1 pt-1">
                          <button 
                            (click)="reimprimirReceta(receta); cerrarModalAcciones()"
                            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                          >
                            <lucide-icon [img]="printerIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                            Reimprimir
                          </button>
                          
                          <button 
                            (click)="exportarPDF(receta); cerrarModalAcciones()"
                            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                          >
                            <lucide-icon [img]="downloadIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                            Exportar PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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
                    ? 'px-3 py-2 text-sm font-medium text-white bg-teal-600 border border-teal-600 rounded-md'
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
              <span class="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-full">
                {{ recetaSeleccionada.medicamentos.length }} medicamento{{ recetaSeleccionada.medicamentos.length !== 1 ? 's' : '' }} prescrito{{ recetaSeleccionada.medicamentos.length !== 1 ? 's' : '' }}
              </span>
            </div>
            
            <div class="space-y-3">
              <div *ngFor="let medicamento of recetaSeleccionada.medicamentos" 
                   class="bg-gray-50 rounded-lg p-4 border-l-4 border-l-teal-500">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 mb-2">{{ medicamento.nombre }}</h4>
                    
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p class="text-gray-600">Dosis: <span class="font-medium text-gray-900">{{ medicamento.dosis }}</span></p>
                        <p class="text-gray-600">Frecuencia: <span class="font-medium text-gray-900">{{ medicamento.frecuencia }}</span></p>
                      </div>
                      <div>
                        <p class="text-gray-600">Cantidad: <span class="font-medium text-gray-900">{{ medicamento.cantidad }}</span></p>
                        <p class="text-gray-600">Duración: <span class="font-medium text-gray-900">{{ medicamento.duracion }}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fechas importantes -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="calendarIcon" class="w-4 h-4 text-gray-600"></lucide-icon>
                <span class="text-sm font-medium text-gray-700">Fecha de emisión</span>
              </div>
              <p class="text-sm font-semibold text-gray-900">{{ recetaSeleccionada.fecha }}</p>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="clockIcon" class="w-4 h-4 text-gray-600"></lucide-icon>
                <span class="text-sm font-medium text-gray-700">Válida hasta</span>
              </div>
              <p class="text-sm font-semibold text-gray-900">{{ recetaSeleccionada.fechaVencimiento }}</p>
            </div>
          </div>

          <!-- Verificación de Autenticidad (solo para recetas emitidas) -->
          <div *ngIf="recetaSeleccionada.estado !== 'borrador'">
            <div class="flex items-center gap-2 mb-3">
              <lucide-icon [img]="qrCodeIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
              <h3 class="text-lg font-semibold text-gray-900">Verificación de Autenticidad</h3>
            </div>
            
            <!-- Código QR -->
            <div class="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-4">
              <div class="flex items-start gap-4">
                <div class="p-3 bg-cyan-100 rounded-lg">
                  <lucide-icon [img]="qrCodeIcon" class="w-8 h-8 text-cyan-600"></lucide-icon>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <lucide-icon [img]="qrCodeIcon" class="w-4 h-4 text-cyan-600"></lucide-icon>
                    <span class="text-sm font-medium text-cyan-900">Código QR</span>
                  </div>
                  <p class="font-mono text-sm font-semibold text-cyan-800 mb-1">QR-{{ recetaSeleccionada.id.replace('RX-', 'RX-') }}</p>
                  <p class="text-xs text-cyan-700">Escanee este código para verificar la receta</p>
                </div>
              </div>
            </div>

            <!-- Token de verificación -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start gap-4">
                <div class="p-3 bg-blue-100 rounded-lg">
                  <lucide-icon [img]="keyIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <lucide-icon [img]="keyIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                    <span class="text-sm font-medium text-blue-900">Token de verificación</span>
                  </div>
                  <p class="font-mono text-sm font-semibold text-blue-800 mb-1">VRF-{{ recetaSeleccionada.id.replace('RX-2025-', '2025-') }}-X8K4</p>
                  <p class="text-xs text-blue-700">Use este token para verificación manual</p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <!-- Footer del modal con acciones -->
        <div class="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <!-- Solo botón duplicar para borradores -->
          <div *ngIf="recetaSeleccionada.estado === 'borrador'" class="space-y-3">
            <button 
              (click)="duplicarReceta(recetaSeleccionada)"
              class="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <lucide-icon [img]="copyIcon" class="w-4 h-4"></lucide-icon>
              Duplicar
            </button>
          </div>

          <!-- Botones para recetas emitidas -->
          <div *ngIf="recetaSeleccionada.estado !== 'borrador'" class="space-y-3">
            <!-- Reimprimir receta (botón principal) -->
            <button 
              (click)="reimprimirReceta(recetaSeleccionada)"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <lucide-icon [img]="printerIcon" class="w-4 h-4"></lucide-icon>
              Reimprimir receta
            </button>

            <!-- Botones secundarios -->
            <div class="grid grid-cols-2 gap-3">
              <button 
                (click)="exportarPDF(recetaSeleccionada)"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
                Exportar PDF
              </button>
              
              <button 
                (click)="duplicarReceta(recetaSeleccionada)"
                class="bg-teal-100 hover:bg-teal-200 text-teal-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <lucide-icon [img]="copyIcon" class="w-4 h-4"></lucide-icon>
                Duplicar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación de duplicación -->
    <div 
      *ngIf="mostrarModalDuplicacion"
      class="fixed inset-0 z-50 overflow-y-auto"
      (click)="cerrarModalDuplicacion()"
    >
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all"
             (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 rounded-t-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-white/20 rounded-lg">
                  <lucide-icon [img]="copyIcon" class="w-5 h-5 text-white"></lucide-icon>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white">Duplicar Receta</h3>
                  <p class="text-teal-100 text-sm">Crear nueva prescripción basada en receta existente</p>
                </div>
              </div>
              <button 
                (click)="cerrarModalDuplicacion()"
                class="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <lucide-icon [img]="xIcon" class="w-5 h-5 text-white"></lucide-icon>
              </button>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-6">
            <div class="space-y-4">
              <!-- Información de la receta a duplicar -->
              <div class="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <lucide-icon [img]="infoIcon" class="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0"></lucide-icon>
                  <div>
                    <h4 class="text-sm font-medium text-teal-900 mb-2">Receta a duplicar:</h4>
                    <div class="text-sm text-teal-800 space-y-1">
                      <p><strong>Número:</strong> {{ recetaParaDuplicar?.id }}</p>
                      <p><strong>Paciente:</strong> {{ recetaParaDuplicar?.paciente?.nombre }}</p>
                      <p><strong>Medicamentos:</strong> {{ recetaParaDuplicar?.medicamentos?.length }} prescrito{{ (recetaParaDuplicar?.medicamentos?.length || 0) !== 1 ? 's' : '' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Información sobre el proceso -->
              <div class="space-y-3">
                <h4 class="font-medium text-gray-900">¿Qué sucederá al duplicar?</h4>
                <div class="space-y-2 text-sm text-gray-600">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span>Se creará un nuevo borrador con todos los medicamentos y datos del paciente</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span>Se asignará un nuevo número de receta automáticamente</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-teal-500 rounded-full"></div>
                    <span>Podrás modificar cualquier información antes de emitir la receta</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer con acciones -->
          <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div class="space-y-3">
              <!-- Botón principal: Editar borrador ahora -->
              <button 
                (click)="confirmarDuplicacion()"
                class="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <lucide-icon [img]="editIcon" class="w-4 h-4"></lucide-icon>
                Editar borrador ahora
              </button>

              <!-- Botones secundarios -->
              <div class="grid grid-cols-2 gap-3">
                <button 
                  (click)="duplicarOtraReceta()"
                  class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <lucide-icon [img]="searchIcon" class="w-4 h-4"></lucide-icon>
                  Duplicar otra receta
                </button>
                
                <button 
                  (click)="verListaBorradores()"
                  class="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <lucide-icon [img]="fileCheckIcon" class="w-4 h-4"></lucide-icon>
                  Ver lista de borradores
                </button>
              </div>
            </div>
          </div>
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
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DuplicarPrescripcionComponent implements OnInit, OnDestroy {
  // Math para usar en el template
  Math = Math;
  
  // Icons
  copyIcon = Copy;
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
  trashIcon = Trash2;
  qrCodeIcon = QrCode;
  keyIcon = Key;
  printerIcon = Printer;
  banIcon = Ban;
  editIcon = Edit;
  fileCheckIcon = FileCheck;
  arrowRightIcon = ArrowRight;
  moreVerticalIcon = MoreVertical;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Prescripciones', route: '/prescripciones' },
    { label: 'Duplicar Receta', route: '/prescripciones/duplicar' }
  ];

  // Estado del componente
  tiposBusqueda: 'rapida' | 'avanzada' = 'rapida';
  busquedaRapida = '';
  mostrarResultados = false;
  recetaSeleccionada: Receta | null = null;
  mostrarModalDuplicacion = false;
  recetaParaDuplicar: Receta | null = null;
  recetasDisponibles = 12;
  modalAccionesAbierto: string | null = null;

  // Filtros avanzados
  filtrosAvanzados = {
    numeroReceta: '',
    estado: '',
    nombrePaciente: '',
    cedulaPaciente: '',
    fechaDesde: '',
    fechaHasta: ''
  };

  // Paginación
  paginaActual = 1;
  elementosPorPagina = 10;
  totalPaginas = 0;

  // Datos de ejemplo
  recetas: Receta[] = [
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
        especialidad: 'Medicina Interna',
        codigoMedico: 'MED-2025-001',
        firmaDigital: true
      },
      diagnostico: 'Hipertensión arterial',
      fecha: '01/10/2025',
      fechaVencimiento: '15/10/2025',
      estado: 'emitida',
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
          nombre: 'Atorvastatina 20mg',
          dosis: '20mg',
          cantidad: 30,
          frecuencia: 'Una vez al día',
          duracion: '30 días'
        }
      ]
    },
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
        especialidad: 'Medicina General',
        codigoMedico: 'MED-2025-002',
        firmaDigital: false
      },
      diagnostico: 'Diabetes tipo 2',
      fecha: '27/09/2025',
      fechaModificacion: '27/09/2025',
      fechaVencimiento: '11/10/2025',
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
        },
        {
          nombre: 'Ácido Acetilsalicílico 100mg',
          dosis: '100mg',
          cantidad: 30,
          frecuencia: 'Una vez al día',
          duracion: '30 días'
        }
      ]
    },
    {
      id: 'RX-2025-009841',
      paciente: {
        nombre: 'Ana Patricia Rojas Fernández',
        cedula: 'CC-38.615.892',
        edad: 38,
        genero: 'F'
      },
      medico: {
        nombre: 'Dr. Jorge Enrique Salazar Ramírez',
        especialidad: 'Pediatría',
        codigoMedico: 'MED-2025-003',
        firmaDigital: true
      },
      diagnostico: 'Infección respiratoria',
      fecha: '30/09/2025',
      fechaVencimiento: '14/10/2025',
      estado: 'dispensada',
      medicamentos: [
        {
          nombre: 'Amoxicilina 500mg',
          dosis: '500mg',
          cantidad: 21,
          frecuencia: 'Cada 8 horas',
          duracion: '7 días'
        },
        {
          nombre: 'Acetaminofén 500mg',
          dosis: '500mg',
          cantidad: 20,
          frecuencia: 'Cada 6 horas',
          duracion: '5 días'
        }
      ]
    },
    {
      id: 'RX-2025-009840',
      paciente: {
        nombre: 'Roberto José Sánchez Mora',
        cedula: 'CC-51.428.967',
        edad: 51,
        genero: 'M'
      },
      medico: {
        nombre: 'Dra. Patricia Elena Gómez Suárez',
        especialidad: 'Endocrinología',
        codigoMedico: 'MED-2025-004',
        firmaDigital: true
      },
      diagnostico: 'Diabetes mellitus tipo 2',
      fecha: '29/09/2025',
      fechaVencimiento: '13/10/2025',
      estado: 'emitida',
      medicamentos: [
        {
          nombre: 'Metformina 850mg',
          dosis: '850mg',
          cantidad: 60,
          frecuencia: 'Cada 12 horas',
          duracion: '30 días'
        }
      ]
    },
    {
      id: 'RX-2025-009839',
      paciente: {
        nombre: 'Laura Sofía Díaz Ramírez',
        cedula: 'CC-29.847.563',
        edad: 29,
        genero: 'F'
      },
      medico: {
        nombre: 'Dr. Miguel Ángel Torres Vega',
        especialidad: 'Ginecología',
        codigoMedico: 'MED-2025-005',
        firmaDigital: false
      },
      diagnostico: 'Control prenatal',
      fecha: '28/09/2025',
      fechaModificacion: '28/09/2025',
      fechaVencimiento: '12/10/2025',
      estado: 'borrador',
      medicamentos: [
        {
          nombre: 'Ácido Fólico 5mg',
          dosis: '5mg',
          cantidad: 30,
          frecuencia: 'Una vez al día',
          duracion: '30 días'
        },
        {
          nombre: 'Hierro 65mg',
          dosis: '65mg',
          cantidad: 30,
          frecuencia: 'Una vez al día',
          duracion: '30 días'
        }
      ]
    },
    {
      id: 'RX-2025-009838',
      paciente: {
        nombre: 'José Manuel Herrera Castro',
        cedula: 'CC-47.392.156',
        edad: 67,
        genero: 'M'
      },
      medico: {
        nombre: 'Dr. Fernando José Ruiz Morales',
        especialidad: 'Cardiología',
        codigoMedico: 'MED-2025-006',
        firmaDigital: true
      },
      diagnostico: 'Hipertensión arterial y dislipidemia',
      fecha: '27/09/2025',
      fechaVencimiento: '11/10/2025',
      estado: 'parcialmente-dispensada',
      medicamentos: [
        {
          nombre: 'Enalapril 10mg',
          dosis: '10mg',
          cantidad: 30,
          frecuencia: 'Cada 12 horas',
          duracion: '30 días'
        },
        {
          nombre: 'Simvastatina 20mg',
          dosis: '20mg',
          cantidad: 30,
          frecuencia: 'Una vez al día',
          duracion: '30 días'
        }
      ]
    },
    {
      id: 'RX-2025-009837',
      paciente: {
        nombre: 'Carmen Rosa Jiménez López',
        cedula: 'CC-33.756.428',
        edad: 42,
        genero: 'F'
      },
      medico: {
        nombre: 'Dra. Sandra Milena Vargas Peña',
        especialidad: 'Medicina General',
        codigoMedico: 'MED-2025-007',
        firmaDigital: true
      },
      diagnostico: 'Gastritis crónica',
      fecha: '26/09/2025',
      fechaVencimiento: '10/10/2025',
      estado: 'emitida',
      medicamentos: [
        {
          nombre: 'Omeprazol 20mg',
          dosis: '20mg',
          cantidad: 30,
          frecuencia: 'Una vez al día',
          duracion: '30 días'
        },
        {
          nombre: 'Sucralfato 1g',
          dosis: '1g',
          cantidad: 60,
          frecuencia: 'Cada 6 horas',
          duracion: '15 días'
        }
      ]
    },
    {
      id: 'RX-2025-009836',
      paciente: {
        nombre: 'Diego Alejandro Moreno Silva',
        cedula: 'CC-42.189.375',
        edad: 35,
        genero: 'M'
      },
      medico: {
        nombre: 'Dr. Andrés Felipe Cortés Rojas',
        especialidad: 'Dermatología',
        codigoMedico: 'MED-2025-008',
        firmaDigital: true
      },
      diagnostico: 'Dermatitis atópica',
      fecha: '25/09/2025',
      fechaVencimiento: '09/10/2025',
      estado: 'dispensada',
      medicamentos: [
        {
          nombre: 'Hidrocortisona 1% crema',
          dosis: '1%',
          cantidad: 2,
          frecuencia: 'Cada 12 horas',
          duracion: '14 días'
        },
        {
          nombre: 'Cetirizina 10mg',
          dosis: '10mg',
          cantidad: 14,
          frecuencia: 'Una vez al día',
          duracion: '14 días'
        }
      ]
    },
    {
      id: 'RX-2025-009835',
      paciente: {
        nombre: 'Beatriz Elena Ramírez Ortega',
        cedula: 'CC-36.524.891',
        edad: 58,
        genero: 'F'
      },
      medico: {
        nombre: 'Dr. Luis Carlos Mendoza Herrera',
        especialidad: 'Reumatología',
        codigoMedico: 'MED-2025-009',
        firmaDigital: false
      },
      diagnostico: 'Artritis reumatoide',
      fecha: '24/09/2025',
      fechaModificacion: '24/09/2025',
      fechaVencimiento: '08/10/2025',
      estado: 'borrador',
      medicamentos: [
        {
          nombre: 'Metotrexato 15mg',
          dosis: '15mg',
          cantidad: 4,
          frecuencia: 'Una vez por semana',
          duracion: '4 semanas'
        },
        {
          nombre: 'Ácido Fólico 5mg',
          dosis: '5mg',
          cantidad: 28,
          frecuencia: 'Una vez al día',
          duracion: '28 días'
        }
      ]
    },
    {
      id: 'RX-2025-009834',
      paciente: {
        nombre: 'Andrés Mauricio Castillo Pérez',
        cedula: 'CC-45.678.123',
        edad: 28,
        genero: 'M'
      },
      medico: {
        nombre: 'Dra. Claudia Patricia Rojas Vega',
        especialidad: 'Medicina Deportiva',
        codigoMedico: 'MED-2025-010',
        firmaDigital: true
      },
      diagnostico: 'Lesión muscular',
      fecha: '23/09/2025',
      fechaVencimiento: '07/10/2025',
      estado: 'emitida',
      medicamentos: [
        {
          nombre: 'Ibuprofeno 600mg',
          dosis: '600mg',
          cantidad: 20,
          frecuencia: 'Cada 8 horas',
          duracion: '7 días'
        },
        {
          nombre: 'Relajante muscular',
          dosis: '10mg',
          cantidad: 14,
          frecuencia: 'Cada 12 horas',
          duracion: '7 días'
        }
      ]
    },
    {
      id: 'RX-2025-009833',
      paciente: {
        nombre: 'Gabriela Fernanda Soto Morales',
        cedula: 'CC-39.456.789',
        edad: 31,
        genero: 'F'
      },
      medico: {
        nombre: 'Dr. Ricardo Javier Herrera Sánchez',
        especialidad: 'Neurología',
        codigoMedico: 'MED-2025-011',
        firmaDigital: true
      },
      diagnostico: 'Migraña crónica',
      fecha: '22/09/2025',
      fechaVencimiento: '06/10/2025',
      estado: 'vencida',
      medicamentos: [
        {
          nombre: 'Sumatriptán 50mg',
          dosis: '50mg',
          cantidad: 6,
          frecuencia: 'Según necesidad',
          duracion: '30 días'
        },
        {
          nombre: 'Propranolol 40mg',
          dosis: '40mg',
          cantidad: 60,
          frecuencia: 'Cada 12 horas',
          duracion: '30 días'
        }
      ]
    },
    {
      id: 'RX-2025-009832',
      paciente: {
        nombre: 'Esteban Alejandro Vargas Cruz',
        cedula: 'CC-41.234.567',
        edad: 44,
        genero: 'M'
      },
      medico: {
        nombre: 'Dra. María Fernanda López Díaz',
        especialidad: 'Psiquiatría',
        codigoMedico: 'MED-2025-012',
        firmaDigital: false
      },
      diagnostico: 'Trastorno de ansiedad',
      fecha: '21/09/2025',
      fechaModificacion: '21/09/2025',
      fechaVencimiento: '05/10/2025',
      estado: 'borrador',
      medicamentos: [
        {
          nombre: 'Sertralina 50mg',
          dosis: '50mg',
          cantidad: 30,
          frecuencia: 'Una vez al día',
          duracion: '30 días'
        }
      ]
    }
  ];

  recetasFiltradas: Receta[] = [];
  recetasPaginadas: Receta[] = [];

  // Role suggestion modal state
  showRoleSuggestionModal = signal(false);
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private roleDemoService: RoleDemoService,
    private roleSuggestionService: RoleSuggestionService
  ) {
    // Cerrar menú de acciones al hacer clic fuera
    document.addEventListener('click', (event) => {
      if (this.modalAccionesAbierto) {
        this.modalAccionesAbierto = null;
      }
    });
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

  realizarBusquedaRapida() {
    if (!this.busquedaRapida.trim()) {
      this.mostrarResultados = false;
      return;
    }

    const termino = this.busquedaRapida.toLowerCase();
    this.recetasFiltradas = this.recetas.filter(receta => 
      receta.id.toLowerCase().includes(termino) ||
      receta.paciente.nombre.toLowerCase().includes(termino) ||
      receta.paciente.cedula.toLowerCase().includes(termino)
    );

    this.mostrarResultados = true;
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  realizarBusquedaAvanzada() {
    this.recetasFiltradas = this.recetas.filter(receta => {
      const cumpleNumero = !this.filtrosAvanzados.numeroReceta || 
        receta.id.toLowerCase().includes(this.filtrosAvanzados.numeroReceta.toLowerCase());
      
      const cumpleEstado = !this.filtrosAvanzados.estado || 
        receta.estado === this.filtrosAvanzados.estado;
      
      const cumpleNombre = !this.filtrosAvanzados.nombrePaciente || 
        receta.paciente.nombre.toLowerCase().includes(this.filtrosAvanzados.nombrePaciente.toLowerCase());
      
      const cumpleCedula = !this.filtrosAvanzados.cedulaPaciente || 
        receta.paciente.cedula.toLowerCase().includes(this.filtrosAvanzados.cedulaPaciente.toLowerCase());

      return cumpleNumero && cumpleEstado && cumpleNombre && cumpleCedula;
    });

    this.mostrarResultados = true;
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  limpiarFiltros() {
    this.filtrosAvanzados = {
      numeroReceta: '',
      estado: '',
      nombrePaciente: '',
      cedulaPaciente: '',
      fechaDesde: '',
      fechaHasta: ''
    };
    this.mostrarResultados = false;
  }

  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(this.recetasFiltradas.length / this.elementosPorPagina);
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.recetasPaginadas = this.recetasFiltradas.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
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

  verReceta(receta: Receta) {
    this.recetaSeleccionada = receta;
  }

  cerrarModalDetalles() {
    this.recetaSeleccionada = null;
  }

  duplicarReceta(receta: Receta) {
    this.recetaParaDuplicar = receta;
    this.mostrarModalDuplicacion = true;
    this.cerrarModalDetalles();
  }

  cerrarModalDuplicacion() {
    this.mostrarModalDuplicacion = false;
    this.recetaParaDuplicar = null;
  }

  confirmarDuplicacion() {
    // Simular creación de borrador
    console.log('Duplicando receta:', this.recetaParaDuplicar?.id);
    
    // Cerrar modal
    this.cerrarModalDuplicacion();
    
    // Navegar a editar nueva receta
    this.router.navigate(['/prescripciones/nueva']);
  }

  duplicarOtraReceta() {
    this.cerrarModalDuplicacion();
  }

  verListaBorradores() {
    this.cerrarModalDuplicacion();
    this.router.navigate(['/prescripciones/borradores']);
  }

  reimprimirReceta(receta: Receta) {
    // Abrir nueva pestaña con la vista de impresión (sin layout)
    const url = `/prescripciones/imprimir/${receta.id}`;
    window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  }

  exportarPDF(receta: Receta) {
    // Abrir nueva pestaña con auto-impresión para generar PDF (sin layout)
    const url = `/prescripciones/imprimir/${receta.id}?autoprint=true`;
    window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  }

  toggleAccionesModal(recetaId: string) {
    this.modalAccionesAbierto = this.modalAccionesAbierto === recetaId ? null : recetaId;
  }

  cerrarModalAcciones() {
    this.modalAccionesAbierto = null;
  }

  getEstadoClass(estado: string): string {
    const clases = {
      'borrador': 'bg-orange-100 text-orange-800',
      'emitida': 'bg-blue-100 text-blue-800',
      'dispensada': 'bg-green-100 text-green-800',
      'parcialmente-dispensada': 'bg-yellow-100 text-yellow-800',
      'vencida': 'bg-red-100 text-red-800',
      'anulada': 'bg-gray-100 text-gray-800'
    };
    return clases[estado as keyof typeof clases] || 'bg-gray-100 text-gray-800';
  }

  getEstadoTexto(estado: string): string {
    const textos = {
      'borrador': 'Borrador',
      'emitida': 'Emitida',
      'dispensada': 'Dispensada',
      'parcialmente-dispensada': 'Parcialmente dispensada',
      'vencida': 'Vencida',
      'anulada': 'Anulada'
    };
    return textos[estado as keyof typeof textos] || estado;
  }
}