import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, AlertTriangle, Plus, Search, Edit, X, Save, CheckCircle2, XCircle, MoreVertical, ChevronLeft, ChevronRight, Info, FilterX } from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';

interface Interaccion {
  id: string;
  drug1: string;
  drug2: string;
  severity: 'critical' | 'warning' | 'info';
  description: string;
  recommendation: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-catalogos-interacciones',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      title="Catálogo de Interacciones Medicamentosas" 
      description="Base de datos de interacciones farmacológicas"
      [icon]="alertTriangleIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-orange-600 via-red-500 to-pink-600"
      [hasActionButton]="true">
      
      <button 
        slot="action"
        (click)="abrirModalNuevo()"
        class="bg-white text-orange-600 hover:bg-orange-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
      >
        <lucide-icon [img]="plusIcon" class="w-5 h-5"></lucide-icon>
        Nueva interacción
      </button>
      
      <!-- Dashboard Content -->
      <div class="space-y-6">
        <!-- Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-red-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Críticas</p>
                  <p class="text-3xl font-bold text-gray-900">{{ interaccionesCriticas }}</p>
                </div>
                <div class="p-3 bg-red-100 rounded-xl">
                  <lucide-icon [img]="xCircleIcon" class="w-8 h-8 text-red-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-orange-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Advertencias</p>
                  <p class="text-3xl font-bold text-gray-900">{{ interaccionesAdvertencia }}</p>
                </div>
                <div class="p-3 bg-orange-100 rounded-xl">
                  <lucide-icon [img]="alertTriangleIcon" class="w-8 h-8 text-orange-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Informativas</p>
                  <p class="text-3xl font-bold text-gray-900">{{ interaccionesInfo }}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl">
                  <lucide-icon [img]="checkCircle2Icon" class="w-8 h-8 text-blue-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Búsqueda y filtros -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
            <input
              type="text"
              [(ngModel)]="terminoBusqueda"
              (input)="filtrarInteracciones()"
              placeholder="Buscar por medicamento o descripción..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div class="w-full md:w-64">
            <select
              [(ngModel)]="filtroSeveridad"
              (change)="filtrarInteracciones()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Todas las severidades</option>
              <option value="critical">Crítico</option>
              <option value="warning">Advertencia</option>
              <option value="info">Información</option>
            </select>
          </div>
          <button 
            *ngIf="terminoBusqueda || filtroSeveridad !== 'all'"
            (click)="limpiarFiltros()"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <lucide-icon [img]="filterXIcon" class="w-4 h-4"></lucide-icon>
            Limpiar filtros
          </button>
        </div>
      </div>

      <!-- Tabla de interacciones -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-orange-100 rounded-lg">
                <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-orange-600"></lucide-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Interacciones Registradas</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ interaccionesFiltradas.length }} interacción{{ interaccionesFiltradas.length !== 1 ? 'es' : '' }} encontrada{{ interaccionesFiltradas.length !== 1 ? 's' : '' }} • Doble clic para editar
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-0">
          <div *ngIf="interaccionesFiltradas.length === 0" class="p-12 text-center">
            <div class="flex justify-center mb-4">
              <div class="p-4 bg-gray-100 rounded-full">
                <lucide-icon [img]="alertTriangleIcon" class="w-12 h-12 text-gray-400"></lucide-icon>
              </div>
            </div>
            <h3 class="text-lg text-gray-900 mb-2">No hay interacciones</h3>
            <p class="text-gray-600">
              {{ terminoBusqueda || filtroSeveridad !== 'all'
                ? "No se encontraron interacciones que coincidan con los filtros aplicados."
                : "No hay interacciones registradas en el catálogo."
              }}
            </p>
          </div>

          <div *ngIf="interaccionesFiltradas.length > 0" class="overflow-x-auto" style="max-height: 500px; overflow-y: auto;">
            <table class="w-full min-w-[1200px]">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamento 1</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamento 2</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severidad</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let interaccion of interaccionesPaginadas" 
                    class="hover:bg-orange-50/50 cursor-pointer transition-all"
                    (dblclick)="editarInteraccion(interaccion)"
                    title="Doble clic para editar">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <lucide-icon [img]="alertTriangleIcon" class="w-4 h-4 text-orange-600"></lucide-icon>
                      <span class="font-medium text-gray-900">{{ interaccion.drug1 }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="font-medium text-gray-900">{{ interaccion.drug2 }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getSeveridadClasses(interaccion.severity)">
                      <lucide-icon [img]="getSeveridadIcon(interaccion.severity)" class="w-3 h-3 mr-1"></lucide-icon>
                      {{ getSeveridadTexto(interaccion.severity) }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 max-w-md">
                      <p class="truncate" [title]="interaccion.description">{{ interaccion.description }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getEstadoClasses(interaccion.status)">
                      <lucide-icon [img]="getEstadoIcon(interaccion.status)" class="w-3 h-3 mr-1"></lucide-icon>
                      {{ getEstadoTexto(interaccion.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="relative">
                      <button 
                        (click)="toggleAccionesModal(interaccion.id); $event.stopPropagation()"
                        class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        title="Más acciones"
                      >
                        <lucide-icon [img]="moreVerticalIcon" class="w-5 h-5"></lucide-icon>
                      </button>
                      
                      <!-- Modal de acciones -->
                      <div 
                        *ngIf="modalAccionesAbierto === interaccion.id"
                        (click)="$event.stopPropagation()"
                        class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                      >
                        <div class="py-2">
                          <div class="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                            Acciones
                          </div>
                          
                          <button 
                            (click)="editarInteraccion(interaccion); cerrarModalAcciones()"
                            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                          >
                            <lucide-icon [img]="editIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                            Editar
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Paginación -->
        <div *ngIf="interaccionesFiltradas.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Mostrando {{ (paginaActual - 1) * elementosPorPagina + 1 }} a {{ Math.min(paginaActual * elementosPorPagina, interaccionesFiltradas.length) }} de {{ interaccionesFiltradas.length }} interacciones
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
                    ? 'px-3 py-2 text-sm font-medium text-white bg-orange-600 border border-orange-600 rounded-md'
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

      <!-- Información -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <lucide-icon [img]="infoIcon" class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"></lucide-icon>
          <div>
            <h4 class="text-sm font-medium text-blue-900 mb-1">Información importante</h4>
            <p class="text-sm text-blue-700">
              Esta interacción se utilizará en el sistema de alertas clínicas (CDS) para detectar automáticamente posibles interacciones durante la prescripción.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de nueva interacción -->
    <div 
      *ngIf="modalNuevoAbierto"
      class="fixed inset-0 z-50 overflow-y-auto"
      (click)="cerrarModalNuevo()"
    >
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"
             (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5"></lucide-icon>
                <h2 class="text-lg font-semibold">Nueva Interacción Medicamentosa</h2>
              </div>
              <button 
                (click)="cerrarModalNuevo()"
                class="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
            <p class="text-orange-100 text-sm mt-1">Agregue una nueva interacción farmacológica al catálogo</p>
          </div>

          <!-- Contenido -->
          <div class="p-6 space-y-6">
            <div class="space-y-4">
              <div class="pb-2 border-b">
                <h3 class="font-medium text-gray-900">Información de la interacción</h3>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Medicamento 1 <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="nuevaInteraccion.drug1"
                    placeholder="Ej: Warfarina"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Medicamento 2 <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="nuevaInteraccion.drug2"
                    placeholder="Ej: Aspirina"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Severidad <span class="text-red-500">*</span>
                  </label>
                  <select
                    [(ngModel)]="nuevaInteraccion.severity"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="critical">🔴 Crítico - Evitar combinación</option>
                    <option value="warning">🟡 Advertencia - Monitoreo requerido</option>
                    <option value="info">🔵 Información - Considerar alternativas</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    [(ngModel)]="nuevaInteraccion.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="active">Activa</option>
                    <option value="inactive">Inactiva</option>
                  </select>
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Descripción de la interacción <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    [(ngModel)]="nuevaInteraccion.description"
                    placeholder="Describa el mecanismo farmacológico y los efectos clínicos de la interacción"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  ></textarea>
                  <p class="text-xs text-gray-500 mt-1">
                    Incluya el mecanismo de la interacción y sus consecuencias clínicas
                  </p>
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Recomendación clínica</label>
                  <textarea
                    [(ngModel)]="nuevaInteraccion.recommendation"
                    placeholder="Indique las recomendaciones de manejo, ajustes de dosis o monitoreo necesario"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  ></textarea>
                  <p class="text-xs text-gray-500 mt-1">
                    Proporcione guías claras sobre cómo manejar esta interacción en la práctica clínica
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div class="flex gap-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5"></lucide-icon>
                <div>
                  <p class="text-sm font-medium text-orange-900">Integración con sistema CDS</p>
                  <p class="text-sm text-orange-700 mt-1">
                    Esta interacción será utilizada por el sistema de soporte a decisiones clínicas (CDS) para generar alertas automáticas cuando se prescriban estos medicamentos en combinación.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button 
              (click)="cerrarModalNuevo()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button 
              (click)="agregarInteraccion()"
              class="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
              Agregar interacción
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal lateral de edición -->
    <div 
      *ngIf="interaccionSeleccionada"
      class="fixed inset-0 z-50 overflow-hidden"
      (click)="cerrarModalEdicion()"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <!-- Panel lateral -->
      <div class="absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col"
           (click)="$event.stopPropagation()">
        
        <!-- Header del modal -->
        <div class="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 text-white flex-shrink-0">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5"></lucide-icon>
                <h2 class="text-lg font-semibold">Editar Interacción Medicamentosa</h2>
              </div>
              <p class="text-orange-100 text-sm mt-1">Modifique la información de la interacción farmacológica</p>
            </div>
            <button 
              (click)="cerrarModalEdicion()"
              class="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
            </button>
          </div>
        </div>

        <!-- Contenido del modal con scroll -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-6 space-y-6">
            <!-- Información básica -->
            <div class="space-y-4">
              <div class="pb-2 border-b">
                <h3 class="font-medium text-gray-900">Información básica</h3>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">ID de la interacción</label>
                  <input
                    type="text"
                    [value]="interaccionSeleccionada.id"
                    disabled
                    class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Medicamento 1 <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="interaccionEditando.drug1"
                    (input)="marcarCambios()"
                    placeholder="Ej: Warfarina"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Medicamento 2 <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="interaccionEditando.drug2"
                    (input)="marcarCambios()"
                    placeholder="Ej: Aspirina"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Severidad <span class="text-red-500">*</span>
                  </label>
                  <select
                    [(ngModel)]="interaccionEditando.severity"
                    (change)="marcarCambios()"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="critical">🔴 Crítico</option>
                    <option value="warning">🟡 Advertencia</option>
                    <option value="info">🔵 Información</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    [(ngModel)]="interaccionEditando.status"
                    (change)="marcarCambios()"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="active">Activa</option>
                    <option value="inactive">Inactiva</option>
                  </select>
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Descripción de la interacción <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    [(ngModel)]="interaccionEditando.description"
                    (input)="marcarCambios()"
                    placeholder="Describa el mecanismo y efectos de la interacción"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  ></textarea>
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Recomendación clínica</label>
                  <textarea
                    [(ngModel)]="interaccionEditando.recommendation"
                    (input)="marcarCambios()"
                    placeholder="Indique las recomendaciones de manejo clínico"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex gap-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></lucide-icon>
                <div>
                  <p class="text-sm font-medium text-blue-900">Información importante</p>
                  <p class="text-sm text-blue-700 mt-1">
                    Esta interacción se utilizará en el sistema de alertas clínicas (CDS) para detectar automáticamente posibles interacciones durante la prescripción.
                  </p>
                </div>
              </div>
            </div>

            <!-- Indicador de cambios -->
            <div *ngIf="hayCambios" class="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div class="flex items-center gap-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-4 h-4 text-amber-600"></lucide-icon>
                <p class="text-sm text-amber-800">
                  Hay cambios sin guardar. Recuerde guardar antes de cerrar.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer con botones de acción -->
        <div class="border-t border-gray-200 px-6 py-4 bg-gray-50 space-y-3 flex-shrink-0">
          <div class="flex gap-2">
            <button 
              (click)="cancelarEdicion()"
              class="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-gray-300"
            >
              <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
              Cancelar
            </button>
            <button 
              (click)="guardarCambios()"
              [disabled]="!hayCambios"
              class="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <lucide-icon [img]="saveIcon" class="w-4 h-4"></lucide-icon>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
      </div>
    </app-page-layout>
  `
})
export class InteraccionesComponent {
  // Iconos
  alertTriangleIcon = AlertTriangle;
  plusIcon = Plus;
  searchIcon = Search;
  editIcon = Edit;
  xIcon = X;
  saveIcon = Save;
  checkCircle2Icon = CheckCircle2;
  xCircleIcon = XCircle;
  moreVerticalIcon = MoreVertical;
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;
  infoIcon = Info;
  filterXIcon = FilterX;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Catálogos clínicos', route: '/catalogos' },
    { label: 'Interacciones', route: '/catalogos/interacciones' }
  ];

  // Datos mock
  interacciones: Interaccion[] = [
    { id: "INT-001", drug1: "Warfarina", drug2: "Aspirina", severity: "critical", description: "Riesgo severo de hemorragia", recommendation: "Evitar combinación o ajustar dosis con monitoreo INR estricto", status: "active" },
    { id: "INT-002", drug1: "Atorvastatina", drug2: "Gemfibrozilo", severity: "warning", description: "Riesgo aumentado de miopatía", recommendation: "Considerar alternativas o monitorear función muscular", status: "active" },
    { id: "INT-003", drug1: "Metformina", drug2: "Contraste yodado", severity: "critical", description: "Riesgo de acidosis láctica", recommendation: "Suspender metformina 48h antes del estudio con contraste", status: "active" },
    { id: "INT-004", drug1: "IECA", drug2: "Espironolactona", severity: "warning", description: "Riesgo de hiperpotasemia", recommendation: "Monitoreo estricto de potasio sérico", status: "active" },
    { id: "INT-005", drug1: "Omeprazol", drug2: "Clopidogrel", severity: "info", description: "Reducción de eficacia antiagregante", recommendation: "Considerar pantoprazol como alternativa", status: "active" }
  ];

  // Estados del componente
  interaccionesFiltradas: Interaccion[] = [...this.interacciones];
  terminoBusqueda: string = '';
  filtroSeveridad: string = 'all';
  
  // Modales
  modalNuevoAbierto: boolean = false;
  modalAccionesAbierto: string | null = null;
  interaccionSeleccionada: Interaccion | null = null;
  interaccionEditando: Interaccion = {} as Interaccion;
  hayCambios: boolean = false;

  // Nueva interacción
  nuevaInteraccion: Omit<Interaccion, 'id'> = {
    drug1: '',
    drug2: '',
    severity: 'warning',
    description: '',
    recommendation: '',
    status: 'active'
  };

  // Paginación
  paginaActual: number = 1;
  elementosPorPagina: number = 10;

  // Propiedades calculadas
  get interaccionesCriticas(): number {
    return this.interacciones.filter(i => i.severity === 'critical').length;
  }

  get interaccionesAdvertencia(): number {
    return this.interacciones.filter(i => i.severity === 'warning').length;
  }

  get interaccionesInfo(): number {
    return this.interacciones.filter(i => i.severity === 'info').length;
  }

  get totalPaginas(): number {
    return Math.ceil(this.interaccionesFiltradas.length / this.elementosPorPagina);
  }

  get interaccionesPaginadas(): Interaccion[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.interaccionesFiltradas.slice(inicio, fin);
  }

  // Métodos de utilidad
  Math = Math;

  filtrarInteracciones(): void {
    this.interaccionesFiltradas = this.interacciones.filter(interaccion => {
      const coincideBusqueda = 
        interaccion.drug1.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        interaccion.drug2.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        interaccion.description.toLowerCase().includes(this.terminoBusqueda.toLowerCase());

      const coincideSeveridad = this.filtroSeveridad === 'all' || interaccion.severity === this.filtroSeveridad;

      return coincideBusqueda && coincideSeveridad;
    });

    this.paginaActual = 1;
  }

  limpiarFiltros(): void {
    this.terminoBusqueda = '';
    this.filtroSeveridad = 'all';
    this.filtrarInteracciones();
  }

  getSeveridadClasses(severity: string): string {
    const classes = {
      critical: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300',
      warning: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-300',
      info: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300'
    };
    return classes[severity as keyof typeof classes] || classes.info;
  }

  getSeveridadIcon(severity: string): any {
    const icons = {
      critical: this.xCircleIcon,
      warning: this.alertTriangleIcon,
      info: this.checkCircle2Icon
    };
    return icons[severity as keyof typeof icons] || icons.info;
  }

  getSeveridadTexto(severity: string): string {
    const textos = {
      critical: 'Crítico',
      warning: 'Advertencia',
      info: 'Información'
    };
    return textos[severity as keyof typeof textos] || 'Información';
  }

  getEstadoClasses(status: string): string {
    const classes = {
      active: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300',
      inactive: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300'
    };
    return classes[status as keyof typeof classes] || classes.active;
  }

  getEstadoIcon(status: string): any {
    const icons = {
      active: this.checkCircle2Icon,
      inactive: this.xCircleIcon
    };
    return icons[status as keyof typeof icons] || icons.active;
  }

  getEstadoTexto(status: string): string {
    const textos = {
      active: 'Activa',
      inactive: 'Inactiva'
    };
    return textos[status as keyof typeof textos] || 'Activa';
  }

  // Paginación
  cambiarPagina(pagina: number): void {
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

  // Modales
  toggleAccionesModal(interaccionId: string): void {
    this.modalAccionesAbierto = this.modalAccionesAbierto === interaccionId ? null : interaccionId;
  }

  cerrarModalAcciones(): void {
    this.modalAccionesAbierto = null;
  }

  abrirModalNuevo(): void {
    this.modalNuevoAbierto = true;
  }

  cerrarModalNuevo(): void {
    this.modalNuevoAbierto = false;
    this.nuevaInteraccion = {
      drug1: '',
      drug2: '',
      severity: 'warning',
      description: '',
      recommendation: '',
      status: 'active'
    };
  }

  agregarInteraccion(): void {
    if (!this.nuevaInteraccion.drug1.trim() || !this.nuevaInteraccion.drug2.trim()) {
      alert('Ambos medicamentos son obligatorios');
      return;
    }

    if (!this.nuevaInteraccion.description.trim()) {
      alert('La descripción de la interacción es obligatoria');
      return;
    }

    const nuevoId = `INT-${(this.interacciones.length + 1).toString().padStart(3, '0')}`;
    const nuevaInteraccion: Interaccion = {
      id: nuevoId,
      ...this.nuevaInteraccion
    };

    this.interacciones.push(nuevaInteraccion);
    this.filtrarInteracciones();
    this.cerrarModalNuevo();
    
    alert(`Interacción entre ${nuevaInteraccion.drug1} y ${nuevaInteraccion.drug2} agregada exitosamente`);
  }

  editarInteraccion(interaccion: Interaccion): void {
    this.interaccionSeleccionada = interaccion;
    this.interaccionEditando = { ...interaccion };
    this.hayCambios = false;
    this.cerrarModalAcciones();
  }

  cerrarModalEdicion(): void {
    if (this.hayCambios) {
      if (confirm('¿Desea descartar los cambios realizados?')) {
        this.interaccionSeleccionada = null;
        this.interaccionEditando = {} as Interaccion;
        this.hayCambios = false;
      }
    } else {
      this.interaccionSeleccionada = null;
      this.interaccionEditando = {} as Interaccion;
      this.hayCambios = false;
    }
  }

  marcarCambios(): void {
    this.hayCambios = true;
  }

  cancelarEdicion(): void {
    if (this.hayCambios) {
      if (confirm('¿Desea descartar los cambios realizados?')) {
        this.cerrarModalEdicion();
      }
    } else {
      this.cerrarModalEdicion();
    }
  }

  guardarCambios(): void {
    if (!this.interaccionEditando.drug1.trim() || !this.interaccionEditando.drug2.trim()) {
      alert('Ambos medicamentos son obligatorios');
      return;
    }

    if (!this.interaccionEditando.description.trim()) {
      alert('La descripción de la interacción es obligatoria');
      return;
    }

    const index = this.interacciones.findIndex(i => i.id === this.interaccionEditando.id);
    if (index !== -1) {
      this.interacciones[index] = { ...this.interaccionEditando };
      this.filtrarInteracciones();
      this.cerrarModalEdicion();
      
      alert(`Interacción entre ${this.interaccionEditando.drug1} y ${this.interaccionEditando.drug2} actualizada exitosamente`);
    }
  }
}