import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Pill, Plus, Search, Edit, Eye, X, Save, AlertTriangle, CheckCircle2, XCircle, MoreVertical, ChevronLeft, ChevronRight, Info } from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';

interface Medicamento {
  id: string;
  name: string;
  concentration: string;
  presentation: string;
  atc: string;
  status: 'active' | 'inactive' | 'discontinued';
}

@Component({
  selector: 'app-catalogos-medicamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      title="Catálogo de Medicamentos" 
      description="Vademécum institucional con códigos ATC"
      [icon]="pillIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-blue-600 via-indigo-500 to-purple-600"
      [hasActionButton]="true">
      
      <button 
        slot="action"
        (click)="abrirModalNuevo()"
        class="bg-white text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
      >
        <lucide-icon [img]="plusIcon" class="w-5 h-5"></lucide-icon>
        Nuevo medicamento
      </button>
      
      <!-- Dashboard Content -->
      <div class="space-y-6">
        <!-- Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Total medicamentos</p>
                  <p class="text-3xl font-bold text-gray-900">{{ medicamentos.length }}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl">
                  <lucide-icon [img]="pillIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-green-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Activos</p>
                  <p class="text-3xl font-bold text-gray-900">{{ medicamentosActivos }}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-xl">
                  <lucide-icon [img]="checkCircle2Icon" class="w-8 h-8 text-green-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-purple-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Categorías ATC</p>
                  <p class="text-3xl font-bold text-gray-900">{{ categoriasATC }}</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-xl">
                  <lucide-icon [img]="pillIcon" class="w-8 h-8 text-purple-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Búsqueda -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex gap-4">
          <div class="flex-1 relative">
            <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
            <input
              type="text"
              [(ngModel)]="terminoBusqueda"
              (input)="filtrarMedicamentos()"
              placeholder="Buscar medicamento o código ATC..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Tabla de medicamentos -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <lucide-icon [img]="pillIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Medicamentos Registrados</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ medicamentosFiltrados.length }} medicamento{{ medicamentosFiltrados.length !== 1 ? 's' : '' }} encontrado{{ medicamentosFiltrados.length !== 1 ? 's' : '' }} • Doble clic para editar
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-0">
          <div *ngIf="medicamentosFiltrados.length === 0" class="p-12 text-center">
            <div class="flex justify-center mb-4">
              <div class="p-4 bg-gray-100 rounded-full">
                <lucide-icon [img]="pillIcon" class="w-12 h-12 text-gray-400"></lucide-icon>
              </div>
            </div>
            <h3 class="text-lg text-gray-900 mb-2">No hay medicamentos</h3>
            <p class="text-gray-600">
              {{ terminoBusqueda 
                ? "No se encontraron medicamentos que coincidan con tu búsqueda."
                : "No hay medicamentos registrados en el catálogo."
              }}
            </p>
          </div>

          <div *ngIf="medicamentosFiltrados.length > 0" class="overflow-x-auto" style="max-height: 500px; overflow-y: auto;">
            <table class="w-full min-w-[1000px]">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamento</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concentración</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presentación</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código ATC</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let medicamento of medicamentosPaginados" 
                    class="hover:bg-blue-50/50 cursor-pointer transition-all"
                    (dblclick)="editarMedicamento(medicamento)"
                    title="Doble clic para editar">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <lucide-icon [img]="pillIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                      <span class="font-medium text-gray-900">{{ medicamento.name }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ medicamento.concentration }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ medicamento.presentation }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="font-mono text-sm text-gray-900">{{ medicamento.atc }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getEstadoClasses(medicamento.status)">
                      <lucide-icon [img]="getEstadoIcon(medicamento.status)" class="w-3 h-3 mr-1"></lucide-icon>
                      {{ getEstadoTexto(medicamento.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="relative">
                      <button 
                        (click)="toggleAccionesModal(medicamento.id); $event.stopPropagation()"
                        class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        title="Más acciones"
                      >
                        <lucide-icon [img]="moreVerticalIcon" class="w-5 h-5"></lucide-icon>
                      </button>
                      
                      <!-- Modal de acciones -->
                      <div 
                        *ngIf="modalAccionesAbierto === medicamento.id"
                        (click)="$event.stopPropagation()"
                        class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                      >
                        <div class="py-2">
                          <div class="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                            Acciones
                          </div>
                          
                          <button 
                            (click)="editarMedicamento(medicamento); cerrarModalAcciones()"
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
        <div *ngIf="medicamentosFiltrados.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Mostrando {{ (paginaActual - 1) * elementosPorPagina + 1 }} a {{ Math.min(paginaActual * elementosPorPagina, medicamentosFiltrados.length) }} de {{ medicamentosFiltrados.length }} medicamentos
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

      <!-- Información -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <lucide-icon [img]="infoIcon" class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"></lucide-icon>
          <div>
            <h4 class="text-sm font-medium text-blue-900 mb-1">Información del catálogo</h4>
            <p class="text-sm text-blue-700">
              El catálogo de medicamentos utiliza códigos ATC (Anatómico Terapéutico Químico) de la OMS para clasificar los medicamentos según el órgano o sistema sobre el que actúan y sus propiedades químicas, farmacológicas y terapéuticas.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de nuevo medicamento -->
    <div 
      *ngIf="modalNuevoAbierto"
      class="fixed inset-0 z-50 overflow-y-auto"
      (click)="cerrarModalNuevo()"
    >
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
             (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <lucide-icon [img]="pillIcon" class="w-5 h-5"></lucide-icon>
                <h2 class="text-lg font-semibold">Nuevo Medicamento</h2>
              </div>
              <button 
                (click)="cerrarModalNuevo()"
                class="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
            <p class="text-blue-100 text-sm mt-1">Agregue un nuevo medicamento al vademécum institucional</p>
          </div>

          <!-- Contenido -->
          <div class="p-6 space-y-6">
            <div class="space-y-4">
              <div class="pb-2 border-b">
                <h3 class="font-medium text-gray-900">Información básica</h3>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del medicamento <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="nuevoMedicamento.name"
                    placeholder="Ej: Paracetamol"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Concentración <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="nuevoMedicamento.concentration"
                    placeholder="Ej: 500mg"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Presentación <span class="text-red-500">*</span>
                  </label>
                  <select
                    [(ngModel)]="nuevoMedicamento.presentation"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Tableta">Tableta</option>
                    <option value="Cápsula">Cápsula</option>
                    <option value="Jarabe">Jarabe</option>
                    <option value="Suspensión">Suspensión</option>
                    <option value="Solución inyectable">Solución inyectable</option>
                    <option value="Ampolla">Ampolla</option>
                    <option value="Crema">Crema</option>
                    <option value="Ungüento">Ungüento</option>
                    <option value="Gel">Gel</option>
                    <option value="Supositorio">Supositorio</option>
                    <option value="Óvulo">Óvulo</option>
                    <option value="Parche">Parche</option>
                    <option value="Inhalador">Inhalador</option>
                    <option value="Gotas">Gotas</option>
                  </select>
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Código ATC <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="nuevoMedicamento.atc"
                    placeholder="Ej: N02BE01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    maxlength="7"
                    (input)="nuevoMedicamento.atc = nuevoMedicamento.atc.toUpperCase()"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Formato: 1 letra + 2 dígitos + 2 letras + 2 dígitos
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
              (click)="agregarMedicamento()"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
              Agregar medicamento
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal lateral de edición -->
    <div 
      *ngIf="medicamentoSeleccionado"
      class="fixed inset-0 z-50 overflow-hidden"
      (click)="cerrarModalEdicion()"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <!-- Panel lateral -->
      <div class="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col"
           (click)="$event.stopPropagation()">
        
        <!-- Header del modal -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white flex-shrink-0">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <lucide-icon [img]="pillIcon" class="w-5 h-5"></lucide-icon>
                <h2 class="text-lg font-semibold">Editar Medicamento</h2>
              </div>
              <p class="text-blue-100 text-sm mt-1">Modifique la información del medicamento en el vademécum institucional</p>
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
                <p class="text-sm text-gray-600">Datos principales del medicamento</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">ID del medicamento</label>
                  <input
                    type="text"
                    [value]="medicamentoSeleccionado.id"
                    disabled
                    class="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono"
                  />
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del medicamento <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="medicamentoEditando.name"
                    (input)="marcarCambios()"
                    placeholder="Ej: Paracetamol"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Concentración <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="medicamentoEditando.concentration"
                    (input)="marcarCambios()"
                    placeholder="Ej: 500mg"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Presentación <span class="text-red-500">*</span>
                  </label>
                  <select
                    [(ngModel)]="medicamentoEditando.presentation"
                    (change)="marcarCambios()"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Tableta">Tableta</option>
                    <option value="Cápsula">Cápsula</option>
                    <option value="Jarabe">Jarabe</option>
                    <option value="Suspensión">Suspensión</option>
                    <option value="Solución inyectable">Solución inyectable</option>
                    <option value="Ampolla">Ampolla</option>
                    <option value="Crema">Crema</option>
                    <option value="Ungüento">Ungüento</option>
                    <option value="Gel">Gel</option>
                    <option value="Supositorio">Supositorio</option>
                    <option value="Óvulo">Óvulo</option>
                    <option value="Parche">Parche</option>
                    <option value="Inhalador">Inhalador</option>
                    <option value="Gotas">Gotas</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Código ATC -->
            <div class="space-y-4">
              <div class="pb-2 border-b">
                <h3 class="font-medium text-gray-900">Clasificación ATC</h3>
                <p class="text-sm text-gray-600">
                  Sistema Anatómico Terapéutico Químico (ATC) de la OMS
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Código ATC <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  [(ngModel)]="medicamentoEditando.atc"
                  (input)="medicamentoEditando.atc = medicamentoEditando.atc.toUpperCase(); marcarCambios()"
                  placeholder="Ej: N02BE01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  maxlength="7"
                />
                <p class="text-xs text-gray-500 mt-1">
                  Formato: 1 letra + 2 dígitos + 2 letras + 2 dígitos (Ej: N02BE01)
                </p>
              </div>

              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex gap-2">
                  <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></lucide-icon>
                  <div>
                    <p class="text-sm font-medium text-blue-900">
                      Información del código ATC
                    </p>
                    <p class="text-sm text-blue-700 mt-1">
                      El código ATC clasifica los medicamentos según el órgano o sistema sobre el que actúan y sus propiedades químicas, farmacológicas y terapéuticas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado -->
            <div class="space-y-4">
              <div class="pb-2 border-b">
                <h3 class="font-medium text-gray-900">Estado del medicamento</h3>
                <p class="text-sm text-gray-600">Control de disponibilidad en el sistema</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  [(ngModel)]="medicamentoEditando.status"
                  (change)="marcarCambios()"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">
                    ✓ Activo
                  </option>
                  <option value="inactive">
                    ✗ Inactivo
                  </option>
                  <option value="discontinued">
                    ⚠ Descontinuado
                  </option>
                </select>
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
              class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
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
export class CatalogosMedicamentosComponent {
  // Iconos
  pillIcon = Pill;
  plusIcon = Plus;
  searchIcon = Search;
  editIcon = Edit;
  eyeIcon = Eye;
  xIcon = X;
  saveIcon = Save;
  alertTriangleIcon = AlertTriangle;
  checkCircle2Icon = CheckCircle2;
  xCircleIcon = XCircle;
  moreVerticalIcon = MoreVertical;
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;
  infoIcon = Info;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Catálogos clínicos', route: '/catalogos' },
    { label: 'Medicamentos', route: '/catalogos/medicamentos' }
  ];

  // Datos mock
  medicamentos: Medicamento[] = [
    { id: "MED-1001", name: "Paracetamol", concentration: "500mg", presentation: "Tableta", atc: "N02BE01", status: "active" },
    { id: "MED-1002", name: "Amoxicilina", concentration: "500mg", presentation: "Cápsula", atc: "J01CA04", status: "active" },
    { id: "MED-1003", name: "Omeprazol", concentration: "20mg", presentation: "Cápsula", atc: "A02BC01", status: "active" },
    { id: "MED-1004", name: "Ibuprofeno", concentration: "400mg", presentation: "Tableta", atc: "M01AE01", status: "active" },
    { id: "MED-1005", name: "Losartán", concentration: "50mg", presentation: "Tableta", atc: "C09CA01", status: "active" }
  ];

  // Estados del componente
  terminoBusqueda = '';
  medicamentosFiltrados: Medicamento[] = [];
  modalNuevoAbierto = false;
  medicamentoSeleccionado: Medicamento | null = null;
  medicamentoEditando: Medicamento = {} as Medicamento;
  hayCambios = false;
  modalAccionesAbierto: string | null = null;

  // Paginación
  paginaActual = 1;
  elementosPorPagina = 10;

  // Nuevo medicamento
  nuevoMedicamento: Omit<Medicamento, 'id'> = {
    name: '',
    concentration: '',
    presentation: 'Tableta',
    atc: '',
    status: 'active'
  };

  constructor() {
    this.filtrarMedicamentos();
  }

  // Getters computados
  get medicamentosActivos(): number {
    return this.medicamentos.filter(m => m.status === 'active').length;
  }

  get categoriasATC(): number {
    return new Set(this.medicamentos.map(m => m.atc[0])).size;
  }

  get totalPaginas(): number {
    return Math.ceil(this.medicamentosFiltrados.length / this.elementosPorPagina);
  }

  get medicamentosPaginados(): Medicamento[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.medicamentosFiltrados.slice(inicio, fin);
  }

  // Métodos de filtrado y búsqueda
  filtrarMedicamentos(): void {
    if (!this.terminoBusqueda.trim()) {
      this.medicamentosFiltrados = [...this.medicamentos];
    } else {
      const termino = this.terminoBusqueda.toLowerCase();
      this.medicamentosFiltrados = this.medicamentos.filter(m =>
        m.name.toLowerCase().includes(termino) ||
        m.atc.toLowerCase().includes(termino)
      );
    }
    this.paginaActual = 1;
  }

  // Métodos de paginación
  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  getPaginas(): number[] {
    const paginas: number[] = [];
    const inicio = Math.max(1, this.paginaActual - 2);
    const fin = Math.min(this.totalPaginas, this.paginaActual + 2);
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }

  // Métodos de estado
  getEstadoClasses(status: string): string {
    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-700 border-green-300`;
      case 'inactive':
        return `${baseClasses} bg-gray-100 text-gray-700 border-gray-300`;
      case 'discontinued':
        return `${baseClasses} bg-red-100 text-red-700 border-red-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 border-gray-300`;
    }
  }

  getEstadoIcon(status: string): any {
    switch (status) {
      case 'active':
        return this.checkCircle2Icon;
      case 'inactive':
        return this.xCircleIcon;
      case 'discontinued':
        return this.alertTriangleIcon;
      default:
        return this.xCircleIcon;
    }
  }

  getEstadoTexto(status: string): string {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'discontinued':
        return 'Descontinuado';
      default:
        return 'Desconocido';
    }
  }

  // Métodos de modal de acciones
  toggleAccionesModal(id: string): void {
    this.modalAccionesAbierto = this.modalAccionesAbierto === id ? null : id;
  }

  cerrarModalAcciones(): void {
    this.modalAccionesAbierto = null;
  }

  // Métodos de nuevo medicamento
  abrirModalNuevo(): void {
    this.modalNuevoAbierto = true;
    this.nuevoMedicamento = {
      name: '',
      concentration: '',
      presentation: 'Tableta',
      atc: '',
      status: 'active'
    };
  }

  cerrarModalNuevo(): void {
    this.modalNuevoAbierto = false;
  }

  agregarMedicamento(): void {
    // Validaciones
    if (!this.nuevoMedicamento.name.trim()) {
      alert('El nombre del medicamento es obligatorio');
      return;
    }

    if (!this.nuevoMedicamento.concentration.trim()) {
      alert('La concentración es obligatoria');
      return;
    }

    if (!this.nuevoMedicamento.atc.trim()) {
      alert('El código ATC es obligatorio');
      return;
    }

    // Generar ID único
    const newId = `MED-${(this.medicamentos.length + 1001).toString().padStart(4, '0')}`;
    
    const nuevoMed: Medicamento = {
      id: newId,
      ...this.nuevoMedicamento
    };

    this.medicamentos.push(nuevoMed);
    this.filtrarMedicamentos();
    this.cerrarModalNuevo();
    
    alert(`Medicamento ${nuevoMed.name} agregado correctamente`);
  }

  // Métodos de edición
  editarMedicamento(medicamento: Medicamento): void {
    this.medicamentoSeleccionado = medicamento;
    this.medicamentoEditando = { ...medicamento };
    this.hayCambios = false;
    this.cerrarModalAcciones();
  }

  cerrarModalEdicion(): void {
    if (this.hayCambios) {
      if (confirm('¿Desea descartar los cambios realizados?')) {
        this.medicamentoSeleccionado = null;
        this.hayCambios = false;
      }
    } else {
      this.medicamentoSeleccionado = null;
    }
  }

  marcarCambios(): void {
    this.hayCambios = true;
  }

  cancelarEdicion(): void {
    if (this.hayCambios) {
      if (confirm('¿Desea descartar los cambios realizados?')) {
        this.medicamentoSeleccionado = null;
        this.hayCambios = false;
      }
    } else {
      this.medicamentoSeleccionado = null;
    }
  }

  guardarCambios(): void {
    // Validaciones
    if (!this.medicamentoEditando.name.trim()) {
      alert('El nombre del medicamento es obligatorio');
      return;
    }

    if (!this.medicamentoEditando.concentration.trim()) {
      alert('La concentración es obligatoria');
      return;
    }

    if (!this.medicamentoEditando.atc.trim()) {
      alert('El código ATC es obligatorio');
      return;
    }

    // Actualizar medicamento
    const index = this.medicamentos.findIndex(m => m.id === this.medicamentoEditando.id);
    if (index !== -1) {
      this.medicamentos[index] = { ...this.medicamentoEditando };
      this.filtrarMedicamentos();
      this.medicamentoSeleccionado = null;
      this.hayCambios = false;
      
      alert(`Medicamento ${this.medicamentoEditando.name} actualizado correctamente`);
    }
  }

  // Método Math para el template
  Math = Math;
}