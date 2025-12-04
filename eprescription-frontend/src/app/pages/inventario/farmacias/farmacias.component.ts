import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Building2, MapPin, Phone, Mail, Plus, Edit, Eye, Search, Download, Filter, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Trash2, MoreVertical, Printer } from 'lucide-angular';
import { PharmacyService } from '../../../services/pharmacy.service';
import { Pharmacy } from '../../../interfaces/pharmacy.interface';
import { PharmacyDetailModalComponent } from '../../../components/pharmacy-detail-modal/pharmacy-detail-modal.component';
import { PharmacyFormModalComponent } from '../../../components/pharmacy-form-modal/pharmacy-form-modal.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { RoleDemoService } from '../../../services/role-demo.service';
import { Subscription } from 'rxjs';
import { 
  provinciasCostaRica, 
  getFullLocation
} from '../../../utils/costa-rica-data';

/**
 * ✅ VISTA PRINCIPAL DE FARMACIAS REGISTRADAS
 * 
 * Esta es la vista que se usa realmente en la aplicación:
 * - URL: http://localhost:4200/inventario/farmacias
 * - Título: "Farmacias Registradas"
 * - Sección: Inventario
 * 
 * NOTA: Hay otros componentes de farmacias en /pages/farmacias/ pero NO se usan.
 */
@Component({
  selector: 'app-farmacias-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PharmacyDetailModalComponent, PharmacyFormModalComponent, RoleSuggestionModalComponent, PageLayoutComponent],
  template: `
    <app-page-layout 
      title="Farmacias Registradas" 
      description="Gestión y consulta de farmacias del sistema ePrescription en Costa Rica"
      [icon]="building2Icon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-blue-600 to-purple-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6" (click)="cerrarModalAcciones()">

        <!-- Loading state -->
        <div *ngIf="isLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-2 text-gray-600">Cargando farmacias...</span>
        </div>

        <!-- Cards de estadísticas de farmacias -->
        <div *ngIf="!isLoading" 
             class="grid grid-cols-2 md:grid-cols-5 gap-4 fade-in-scale"
             role="region" 
             aria-label="Estadísticas de farmacias del sistema">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500 stagger-animation" 
               style="--stagger-delay: 0"
               role="group"
               [attr.aria-label]="'Total de farmacias: ' + getTotalPharmacies()">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Total farmacias</p>
                  <p class="text-3xl font-bold text-gray-900" 
                     aria-label="Número total de farmacias">{{ getTotalPharmacies() }}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl" aria-hidden="true">
                  <lucide-icon [img]="building2Icon" class="w-8 h-8 text-blue-600" aria-hidden="true"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-green-500 stagger-animation" style="--stagger-delay: 1">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Activas</p>
                  <p class="text-3xl font-bold text-gray-900">{{ getActivePharmacies() }}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-xl">
                  <lucide-icon [img]="checkCircleIcon" class="w-8 h-8 text-green-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-gray-500 stagger-animation" style="--stagger-delay: 2">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Inactivas</p>
                  <p class="text-3xl font-bold text-gray-900">{{ getInactivePharmacies() }}</p>
                </div>
                <div class="p-3 bg-gray-100 rounded-xl">
                  <lucide-icon [img]="xCircleIcon" class="w-8 h-8 text-gray-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-yellow-500 stagger-animation" style="--stagger-delay: 3">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Suspendidas</p>
                  <p class="text-3xl font-bold text-gray-900">{{ getSuspendedPharmacies() }}</p>
                </div>
                <div class="p-3 bg-yellow-100 rounded-xl">
                  <lucide-icon [img]="alertCircleIcon" class="w-8 h-8 text-yellow-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-purple-500 stagger-animation" style="--stagger-delay: 4">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Provincias</p>
                  <p class="text-3xl font-bold text-gray-900">{{ getProvinceCount() }}</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-xl">
                  <lucide-icon [img]="mapPinIcon" class="w-8 h-8 text-purple-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Filtros y búsqueda -->
      <div *ngIf="!isLoading" class="filter-container rounded-lg shadow p-6 slide-in-right">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <lucide-icon [img]="building2Icon" class="w-5 h-5 text-blue-600"></lucide-icon>
            <h3 class="text-lg font-semibold text-gray-900">Listado de Farmacias</h3>
            <span class="text-sm text-gray-600 ml-2">
              ({{ filteredPharmacies.length }} farmacia{{ filteredPharmacies.length !== 1 ? 's' : '' }} encontrada{{ filteredPharmacies.length !== 1 ? 's' : '' }})
            </span>
          </div>
          <button 
            (click)="openNewPharmacyModal()"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <lucide-icon [img]="plusIcon" class="w-4 h-4 mr-2"></lucide-icon>
            Nueva Farmacia
          </button>
        </div>
        
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1">
            <div class="relative">
              <lucide-icon [img]="searchIcon" 
                           class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
                           aria-hidden="true"></lucide-icon>
              <input 
                type="text" 
                id="pharmacy-search"
                placeholder="Buscar por código, nombre, dirección, teléfono..."
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearchChange()"
                class="filter-input w-full pl-10 pr-4 py-2 rounded-lg focus-visible"
                aria-label="Buscar farmacias"
                autocomplete="off"
              >
            </div>
          </div>
          
          <select 
            [(ngModel)]="selectedProvince"
            (ngModelChange)="onProvinceChange()"
            class="filter-select px-3 py-2 rounded-lg lg:w-48 focus-visible"
            aria-label="Filtrar por provincia"
          >
            <option value="">Todas las provincias</option>
            <option *ngFor="let provincia of provincias" [value]="provincia.id">
              {{ provincia.nombre }}
            </option>
          </select>
          
          <select 
            [(ngModel)]="selectedStatus"
            (ngModelChange)="onStatusChange()"
            class="filter-select px-3 py-2 rounded-lg lg:w-48 focus-visible"
            aria-label="Filtrar por estado de farmacia"
          >
            <option value="">Todos los estados</option>
            <option value="activa">Activas</option>
            <option value="inactiva">Inactivas</option>
            <option value="suspendida">Suspendidas</option>
          </select>

          <button 
            (click)="exportPharmacies()"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
            Exportar
          </button>
          
          <button 
            *ngIf="hasActiveFilters()"
            (click)="clearFilters()"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <lucide-icon [img]="filterIcon" class="w-4 h-4"></lucide-icon>
            Limpiar
          </button>
        </div>
      </div>

      <!-- Lista de farmacias -->
      <div *ngIf="!isLoading" class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Estado vacío -->
        <div *ngIf="filteredPharmacies.length === 0" class="text-center py-12">
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-8">
            <lucide-icon [img]="building2Icon" class="w-16 h-16 text-gray-400 mx-auto mb-4"></lucide-icon>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              {{ hasActiveFilters() ? 'No se encontraron farmacias' : 'No hay farmacias registradas' }}
            </h3>
            <p class="text-gray-600 mb-6">
              {{ hasActiveFilters() ? 'Intenta ajustar los filtros de búsqueda' : 'No hay farmacias registradas en el sistema' }}
            </p>
            <div class="flex justify-center gap-3">
              <button 
                (click)="openNewPharmacyModal()"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Registrar primera farmacia
              </button>
              <button 
                *ngIf="hasActiveFilters()"
                (click)="clearFilters()"
                class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        <!-- Tabla de farmacias estilo estándar con scroll horizontal -->
        <div *ngIf="filteredPharmacies.length > 0" class="overflow-x-auto" style="max-width: 100vw;">
          <table class="w-full min-w-[1400px]" 
                 role="table" 
                 aria-label="Tabla de farmacias registradas">
            <thead class="bg-gray-50 sticky top-0">
              <tr role="row">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" 
                    role="columnheader" 
                    scope="col">Código</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" 
                    role="columnheader" 
                    scope="col">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" 
                    role="columnheader" 
                    scope="col">Ubicación</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" 
                    role="columnheader" 
                    scope="col">Dirección Específica</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" 
                    role="columnheader" 
                    scope="col">Teléfono</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" 
                    role="columnheader" 
                    scope="col">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" 
                    role="columnheader" 
                    scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200" role="rowgroup">
              <tr *ngFor="let pharmacy of paginatedPharmacies; let i = index; trackBy: trackByPharmacyId" 
                  class="hover:bg-blue-50/50 cursor-pointer transition-all"
                  role="row"
                  (click)="viewPharmacyDetails(pharmacy)"
                  (keydown.enter)="viewPharmacyDetails(pharmacy)"
                  (keydown.space)="viewPharmacyDetails(pharmacy); $event.preventDefault()"
                  tabindex="0"
                  [attr.aria-label]="'Farmacia ' + pharmacy.nombre + ' código ' + pharmacy.codigo">
                
                <!-- Código -->
                <td class="px-6 py-4 whitespace-nowrap" role="gridcell">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <lucide-icon [img]="building2Icon" class="w-4 h-4 text-blue-600" aria-hidden="true"></lucide-icon>
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-blue-600">{{ pharmacy.codigo }}</div>
                      <div class="text-xs text-gray-500" *ngIf="isRecentPharmacy(pharmacy.fechaRegistro)">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Reciente
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Nombre -->
                <td class="px-6 py-4 whitespace-nowrap" role="gridcell">
                  <div class="text-sm font-medium text-gray-900">{{ pharmacy.nombre }}</div>
                </td>

                <!-- Ubicación -->
                <td class="px-6 py-4" role="gridcell">
                  <div class="flex items-center gap-1">
                    <lucide-icon [img]="mapPinIcon" class="w-4 h-4 text-gray-400" aria-hidden="true"></lucide-icon>
                    <span class="text-sm text-gray-900">{{ getFullLocationForPharmacy(pharmacy) }}</span>
                  </div>
                </td>

                <!-- Dirección Específica -->
                <td class="px-6 py-4" role="gridcell">
                  <div class="text-sm text-gray-900 max-w-xs">
                    {{ pharmacy.direccionEspecifica }}
                  </div>
                </td>

                <!-- Teléfono -->
                <td class="px-6 py-4 whitespace-nowrap" role="gridcell">
                  <div class="flex items-center gap-1">
                    <lucide-icon [img]="phoneIcon" class="w-4 h-4 text-gray-400" aria-hidden="true"></lucide-icon>
                    <span class="text-sm text-gray-900">{{ pharmacy.telefono }}</span>
                  </div>
                </td>

                <!-- Estado -->
                <td class="px-6 py-4 whitespace-nowrap" role="gridcell">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [ngClass]="getStatusBadgeClass(pharmacy.estado)"
                        role="status"
                        [attr.aria-label]="getStatusDescription(pharmacy.estado)">
                    {{ getStatusLabel(pharmacy.estado) }}
                  </span>
                  <div class="text-xs text-gray-500 mt-1">
                    Registrada: {{ formatDate(pharmacy.fechaRegistro) }}
                  </div>
                </td>

                <!-- Acciones con dropdown estilo recetas emitidas -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" role="gridcell">
                  <div class="relative">
                    <button 
                      (click)="toggleAccionesModal(pharmacy.id); $event.stopPropagation()"
                      class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                      title="Más acciones"
                    >
                      <lucide-icon [img]="moreVerticalIcon" class="w-5 h-5"></lucide-icon>
                    </button>
                    
                    <!-- Modal de acciones -->
                    <div 
                      *ngIf="modalAccionesAbierto === pharmacy.id"
                      (click)="$event.stopPropagation()"
                      class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <div class="py-2">
                        <div class="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                          Acciones
                        </div>
                        
                        <button 
                          (click)="viewPharmacyDetails(pharmacy); cerrarModalAcciones()"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <lucide-icon [img]="eyeIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                          Ver detalles
                        </button>
                        
                        <button 
                          (click)="printPharmacy(pharmacy); cerrarModalAcciones()"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <lucide-icon [img]="printerIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                          Imprimir información
                        </button>
                        
                        <button 
                          (click)="editPharmacy(pharmacy); cerrarModalAcciones()"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <lucide-icon [img]="editIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                          Editar farmacia
                        </button>
                        
                        <div class="border-t border-gray-100 mt-1 pt-1">
                          <button 
                            (click)="deletePharmacy(pharmacy); cerrarModalAcciones()"
                            class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                          >
                            <lucide-icon [img]="trash2Icon" class="w-4 h-4 text-red-500"></lucide-icon>
                            Eliminar farmacia
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
        <div *ngIf="filteredPharmacies.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-sm text-gray-700">
              Mostrando 
              <span class="font-medium">{{ getStartIndex() }}</span> 
              a 
              <span class="font-medium">{{ getEndIndex() }}</span> 
              de 
              <span class="font-medium">{{ filteredPharmacies.length }}</span> 
              resultados
            </div>
            
            <div class="flex items-center gap-4">
              <!-- Items per page selector -->
              <div class="flex items-center gap-2 text-sm text-gray-700">
                <span>Mostrar:</span>
                <select 
                  [value]="itemsPerPage"
                  (change)="onItemsPerPageChange($event)"
                  class="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>

              <!-- Pagination controls -->
              <div class="flex gap-1">
                <button 
                  class="pagination-button p-2 border border-gray-300 text-gray-500 rounded disabled:opacity-50 disabled:cursor-not-allowed focus-visible"
                  [disabled]="!hasPreviousPage()"
                  (click)="previousPage()"
                  title="Página anterior"
                >
                  <lucide-icon [img]="chevronLeftIcon" class="w-4 h-4"></lucide-icon>
                </button>
                
                <button 
                  *ngFor="let page of getVisiblePages()" 
                  class="pagination-button px-3 py-2 rounded focus-visible"
                  [ngClass]="page === currentPage 
                    ? 'active' 
                    : 'border border-gray-300 text-gray-700'"
                  (click)="goToPage(page)"
                >
                  {{ page }}
                </button>
                
                <button 
                  class="pagination-button p-2 border border-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed focus-visible"
                  [disabled]="!hasNextPage()"
                  (click)="nextPage()"
                  title="Página siguiente"
                >
                  <lucide-icon [img]="chevronRightIcon" class="w-4 h-4"></lucide-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

        <!-- Modals -->
        <app-pharmacy-detail-modal
          [isOpen]="showDetailModal"
          [pharmacy]="selectedPharmacy"
          (closeModal)="onCloseDetailModal()"
          (editPharmacyEvent)="onEditFromDetail($event)">
        </app-pharmacy-detail-modal>

        <app-pharmacy-form-modal
          [isOpen]="showFormModal"
          [pharmacy]="selectedPharmacy"
          [isEditMode]="isEditMode"
          (closeModal)="onCloseFormModal()"
          (savePharmacy)="onSavePharmacy($event)">
        </app-pharmacy-form-modal>

        <!-- Role Suggestion Modal -->
        <app-role-suggestion-modal
          [isOpen]="showRoleSuggestionModal()"
          [suggestedRole]="'Farmacéutico'"
          [pageName]="'inventario-farmacias'"
          (dismiss)="onRoleSuggestionDismiss()"
          (roleChanged)="onRoleChanged()"
        ></app-role-suggestion-modal>

      </div>
    </app-page-layout>
  `,
  styles: [`
    /* Estilos específicos para la vista de farmacias homologada con recetas */

    /* Animaciones para las cards de estadísticas */
    .fade-in-scale {
      animation: fadeInScale 0.6s ease-out;
    }

    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .stagger-animation {
      opacity: 0;
      animation: staggerFadeIn 0.5s ease-out forwards;
      animation-delay: calc(var(--stagger-delay) * 0.1s);
    }

    @keyframes staggerFadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Animación para el contenedor de filtros */
    .slide-in-right {
      animation: slideInRight 0.4s ease-out;
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Estilos para las cards de estadísticas */
    .stat-card {
      transition: all 0.3s ease;
      border: 1px solid #e5e7eb;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .stat-icon {
      transition: transform 0.2s ease;
    }

    .stat-card:hover .stat-icon {
      transform: scale(1.1);
    }

    /* Estilos específicos para cada tipo de estadística */
    .stat-total:hover {
      border-color: #3b82f6;
    }

    .stat-active:hover {
      border-color: #10b981;
    }

    .stat-inactive:hover {
      border-color: #6b7280;
    }

    .stat-suspended:hover {
      border-color: #f59e0b;
    }

    .stat-provinces:hover {
      border-color: #8b5cf6;
    }

    /* Estilos para el contenedor de filtros */
    .filter-container {
      background: white;
      border: 1px solid #e5e7eb;
    }

    /* Estilos para inputs y selects de filtros */
    .filter-input {
      border: 1px solid #d1d5db;
      transition: all 0.2s ease;
    }

    .filter-input:focus {
      outline: none;
      ring: 2px;
      ring-color: #3b82f6;
      border-color: #3b82f6;
    }

    .filter-select {
      border: 1px solid #d1d5db;
      transition: all 0.2s ease;
    }

    .filter-select:focus {
      outline: none;
      ring: 2px;
      ring-color: #3b82f6;
      border-color: #3b82f6;
    }

    /* Estilos para la paginación */
    .pagination-button {
      transition: all 0.2s ease;
    }

    .pagination-button:hover:not(:disabled) {
      background-color: #f3f4f6;
    }

    .pagination-button.active {
      background-color: #3b82f6;
      color: white;
    }

    .pagination-button.active:hover {
      background-color: #2563eb;
    }

    /* Estilos para focus visible (accesibilidad) */
    .focus-visible:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    /* Estados de hover mejorados */
    .hover\\:bg-blue-50\\/50:hover {
      background-color: rgba(239, 246, 255, 0.5);
    }

    /* Estilos para el estado de carga */
    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    /* Mejoras de accesibilidad */
    @media (prefers-reduced-motion: reduce) {
      .fade-in-scale,
      .stagger-animation,
      .slide-in-right,
      .stat-card,
      .stat-icon,
      .filter-input,
      .filter-select,
      .pagination-button {
        animation: none;
        transition: none;
      }
    }
  `]
})
export class FarmaciasInventarioComponent implements OnInit, OnDestroy {
  // Icons
  building2Icon = Building2;
  mapPinIcon = MapPin;
  phoneIcon = Phone;
  mailIcon = Mail;
  plusIcon = Plus;
  editIcon = Edit;
  eyeIcon = Eye;
  searchIcon = Search;
  downloadIcon = Download;
  filterIcon = Filter;
  checkCircleIcon = CheckCircle;
  xCircleIcon = XCircle;
  alertCircleIcon = AlertCircle;
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;
  trash2Icon = Trash2;
  moreVerticalIcon = MoreVertical;
  printerIcon = Printer;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inventario', route: '/inventario' },
    { label: 'Farmacias Registradas' }
  ];

  // Geographic data
  provincias = provinciasCostaRica;

  // Filter properties
  searchTerm = '';
  selectedProvince = '';
  selectedStatus = '';

  // Data
  pharmacies: Pharmacy[] = [];
  filteredPharmacies: Pharmacy[] = [];

  // Modal states
  showDetailModal = false;
  showFormModal = false;
  isEditMode = false;
  selectedPharmacy: Pharmacy | null = null;
  modalAccionesAbierto: string | null = null;

  // Loading and pagination
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 10;
  paginatedPharmacies: Pharmacy[] = [];

  // Role suggestion modal
  showRoleSuggestionModal = signal(false);
  private subscriptions = new Subscription();

  constructor(
    private pharmacyService: PharmacyService,
    private roleDemoService: RoleDemoService
  ) {}

  ngOnInit(): void {
    console.log('✅ VISTA PRINCIPAL DE FARMACIAS REGISTRADAS - COMPONENTE ACTIVO');
    console.log('🌐 URL: http://localhost:4200/inventario/farmacias');
    console.log('📍 Esta es la vista que se usa realmente en la aplicación');
    this.loadPharmacies();
    this.checkRoleSuggestion();
    this.subscribeToRoleChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadPharmacies(): void {
    this.isLoading = true;
    this.pharmacyService.getPharmacies()
      .subscribe((pharmacies: Pharmacy[]) => {
        this.pharmacies = pharmacies;
        this.applyFilters();
        this.isLoading = false;
      });
  }

  applyFilters(): void {
    this.filteredPharmacies = this.pharmacies.filter(pharmacy => {
      const matchesSearch = this.searchTerm === '' || 
        this.normalizeText(pharmacy.codigo).includes(this.normalizeText(this.searchTerm)) ||
        this.normalizeText(pharmacy.nombre).includes(this.normalizeText(this.searchTerm)) ||
        this.normalizeText(pharmacy.direccionEspecifica).includes(this.normalizeText(this.searchTerm)) ||
        this.normalizeText(pharmacy.telefono).includes(this.normalizeText(this.searchTerm));

      const matchesProvince = this.selectedProvince === '' || pharmacy.provinciaId === this.selectedProvince;
      const matchesStatus = this.selectedStatus === '' || pharmacy.estado === this.selectedStatus;

      return matchesSearch && matchesProvince && matchesStatus;
    });
    
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPharmacies = this.filteredPharmacies.slice(startIndex, endIndex);
  }

  private normalizeText(text: string): string {
    return text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onProvinceChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  getTotalPharmacies(): number {
    return this.pharmacies.length;
  }

  getActivePharmacies(): number {
    return this.pharmacies.filter(p => p.estado === 'activa').length;
  }

  getInactivePharmacies(): number {
    return this.pharmacies.filter(p => p.estado === 'inactiva').length;
  }

  getSuspendedPharmacies(): number {
    return this.pharmacies.filter(p => p.estado === 'suspendida').length;
  }

  getProvinceCount(): number {
    const provinces = new Set(this.pharmacies.map(p => p.provinciaId));
    return provinces.size;
  }

  getFullLocationForPharmacy(pharmacy: Pharmacy): string {
    return getFullLocation(pharmacy.provinciaId, pharmacy.cantonId, pharmacy.distritoId);
  }

  openNewPharmacyModal(): void {
    this.selectedPharmacy = null;
    this.isEditMode = false;
    this.showFormModal = true;
  }

  viewPharmacyDetails(pharmacy: Pharmacy): void {
    this.selectedPharmacy = pharmacy;
    this.showDetailModal = true;
  }

  editPharmacy(pharmacy: Pharmacy): void {
    this.selectedPharmacy = pharmacy;
    this.isEditMode = true;
    this.showFormModal = true;
  }

  deletePharmacy(pharmacy: Pharmacy): void {
    if (confirm(`¿Está seguro de eliminar la farmacia ${pharmacy.nombre}?`)) {
      // Simular eliminación del array local
      const index = this.pharmacies.findIndex(p => p.id === pharmacy.id);
      if (index > -1) {
        this.pharmacies.splice(index, 1);
        this.applyFilters();
        console.log(`Farmacia ${pharmacy.nombre} eliminada del sistema`);
      }
    }
  }

  printPharmacy(pharmacy: Pharmacy): void {
    console.log(`Imprimiendo información de farmacia ${pharmacy.nombre}`);
    alert(`Imprimiendo información de ${pharmacy.nombre}`);
  }

  onCloseDetailModal(): void {
    this.showDetailModal = false;
    this.selectedPharmacy = null;
  }

  onCloseFormModal(): void {
    this.showFormModal = false;
    this.selectedPharmacy = null;
    this.isEditMode = false;
  }

  onEditFromDetail(pharmacy: Pharmacy): void {
    this.showDetailModal = false;
    this.editPharmacy(pharmacy);
  }

  onSavePharmacy(formData: any): void {
    if (this.isEditMode && this.selectedPharmacy) {
      // Update existing pharmacy
      const index = this.pharmacies.findIndex(p => p.id === this.selectedPharmacy!.id);
      if (index > -1) {
        this.pharmacies[index] = {
          ...this.pharmacies[index],
          ...formData
        };
        this.applyFilters();
        console.log('Farmacia actualizada exitosamente');
      }
    } else {
      // Create new pharmacy
      const newPharmacy: Pharmacy = {
        id: `FARM-${Date.now()}`,
        ...formData,
        fechaRegistro: new Date().toISOString().split('T')[0]
      };
      this.pharmacies.push(newPharmacy);
      this.applyFilters();
      console.log('Farmacia registrada exitosamente');
    }
    this.onCloseFormModal();
  }

  toggleAccionesModal(pharmacyId: string): void {
    this.modalAccionesAbierto = this.modalAccionesAbierto === pharmacyId ? null : pharmacyId;
  }

  cerrarModalAcciones(): void {
    this.modalAccionesAbierto = null;
  }

  exportPharmacies(): void {
    const exportData = this.filteredPharmacies.map(pharmacy => ({
      'Código': pharmacy.codigo,
      'Nombre': pharmacy.nombre,
      'Ubicación': this.getFullLocationForPharmacy(pharmacy),
      'Dirección': pharmacy.direccionEspecifica,
      'Teléfono': pharmacy.telefono,
      'Email': pharmacy.email,
      'Responsable': pharmacy.responsable,
      'Estado': pharmacy.estado,
      'Fecha Registro': pharmacy.fechaRegistro
    }));

    console.log('Exportar farmacias:', exportData);
    alert('Funcionalidad de exportación será implementada próximamente.');
  }

  hasActiveFilters(): boolean {
    return this.searchTerm !== '' || this.selectedProvince !== '' || this.selectedStatus !== '';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedProvince = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  getStatusBadgeClass(estado: string): string {
    const classes = {
      'activa': 'bg-green-100 text-green-800 border-green-200',
      'inactiva': 'bg-gray-100 text-gray-800 border-gray-200',
      'suspendida': 'bg-red-100 text-red-800 border-red-200'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  getStatusLabel(estado: string): string {
    const labels = {
      'activa': 'Activa',
      'inactiva': 'Inactiva',
      'suspendida': 'Suspendida'
    };
    return labels[estado as keyof typeof labels] || 'Desconocido';
  }

  getStatusDescription(estado: string): string {
    switch (estado) {
      case 'activa':
        return 'Farmacia activa y operativa';
      case 'inactiva':
        return 'Farmacia temporalmente inactiva';
      case 'suspendida':
        return 'Farmacia suspendida por autoridades';
      default:
        return 'Estado de farmacia desconocido';
    }
  }

  // Pagination methods
  get totalPages(): number {
    return Math.ceil(this.filteredPharmacies.length / this.itemsPerPage);
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  previousPage(): void {
    if (this.hasPreviousPage()) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getVisiblePages(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const visiblePages: number[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          visiblePages.push(i);
        }
        visiblePages.push(-1); // Ellipsis
        visiblePages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        visiblePages.push(1);
        visiblePages.push(-1); // Ellipsis
        for (let i = totalPages - 4; i <= totalPages; i++) {
          visiblePages.push(i);
        }
      } else {
        visiblePages.push(1);
        visiblePages.push(-1); // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          visiblePages.push(i);
        }
        visiblePages.push(-1); // Ellipsis
        visiblePages.push(totalPages);
      }
    }

    return visiblePages;
  }

  onItemsPerPageChange(event: any): void {
    this.itemsPerPage = parseInt(event.target.value);
    this.currentPage = 1;
    this.updatePagination();
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.filteredPharmacies.length);
  }

  // Utility methods for enhanced functionality
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  isRecentPharmacy(dateString: string): boolean {
    const pharmacyDate = new Date(dateString);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return pharmacyDate >= thirtyDaysAgo;
  }

  // TrackBy functions for performance
  trackByPharmacyId(index: number, item: Pharmacy): string {
    return item.id;
  }

  // Role suggestion methods
  private checkRoleSuggestion(): void {
    const currentSession = this.roleDemoService.getCurrentSession();
    console.log('🔧 FarmaciasInventario - checkRoleSuggestion - currentRole:', currentSession.activeRole);
    
    if (currentSession.activeRole !== 'Farmacéutico' && 
        currentSession.activeRole !== 'Administrador') {
      console.log('🔧 FarmaciasInventario - Showing role suggestion modal for role:', currentSession.activeRole);
      this.showRoleSuggestionModal.set(true);
    } else {
      console.log('🔧 FarmaciasInventario - Not showing modal, user has appropriate role');
      this.showRoleSuggestionModal.set(false);
    }
  }

  private subscribeToRoleChanges(): void {
    this.subscriptions.add(
      this.roleDemoService.currentSession$.subscribe(session => {
        console.log('🔧 FarmaciasInventario - Role changed to:', session.activeRole);
        this.checkRoleSuggestion();
      })
    );
  }

  onRoleSuggestionDismiss(): void {
    console.log('🔧 FarmaciasInventario - Role suggestion dismissed');
    this.showRoleSuggestionModal.set(false);
  }

  onRoleChanged(): void {
    console.log('🔧 FarmaciasInventario - Role changed, closing modal');
    this.showRoleSuggestionModal.set(false);
  }
}