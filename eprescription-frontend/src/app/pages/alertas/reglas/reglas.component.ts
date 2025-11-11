import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Settings, Shield, Search, Filter, FilterX, Eye, Download, CheckCircle2, XCircle, Clock, User, FileText, Pill, AlertCircle, Info, Ban, ShieldAlert, Bell, BellOff, X, Plus, Edit, Trash2, MoreVertical, Save } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';
import { Subscription } from 'rxjs';

interface ReglaInteraccion {
  id: string;
  name: string;
  medicine1: string;
  medicine2: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  mechanism: string;
  clinicalEffect: string;
  recommendation: string;
  status: 'active' | 'inactive';
  evidenceLevel: 'A' | 'B' | 'C';
  references: string;
  lastUpdated: string;
}

@Component({
  selector: 'app-reglas-alertas',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, BreadcrumbsComponent, PageHeaderComponent, RoleSuggestionModalComponent],
  template: `
    <div class="space-y-6" (click)="cerrarModalAcciones()">
      <!-- Breadcrumbs -->
      <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>
      
      <!-- Page Header -->
      <app-page-header 
        title="Reglas de Interacciones Medicamentosas" 
        description="Configuración y gestión de reglas del sistema de alertas clínicas"
        [icon]="settingsIcon"
        [actionButton]="true">
        <div slot="action" class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30">
          <div class="text-right">
            <p class="text-xs text-white/80">Reglas activas</p>
            <p class="text-2xl font-bold text-white">{{ stats.active }}</p>
          </div>
        </div>
      </app-page-header>

      <!-- Tarjetas de estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow border-l-4 border-l-blue-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Total reglas</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-lg">
              <lucide-icon [img]="settingsIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-green-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Activas</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.active }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-lg">
              <lucide-icon [img]="checkCircle2Icon" class="w-8 h-8 text-green-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-red-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Críticas</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.critical }}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-lg">
              <lucide-icon [img]="shieldAlertIcon" class="w-8 h-8 text-red-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-gray-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Inactivas</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.inactive }}</p>
            </div>
            <div class="p-3 bg-gray-100 rounded-lg">
              <lucide-icon [img]="xCircleIcon" class="w-8 h-8 text-gray-600"></lucide-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Búsqueda y filtros -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid gap-4 md:grid-cols-4">
          <div class="relative">
            <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
            <input 
              type="text" 
              [(ngModel)]="terminoBusqueda"
              (input)="filtrarReglas()"
              placeholder="Buscar por medicamento o nombre de regla..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          
          <select 
            [(ngModel)]="filtroSeveridad"
            (change)="filtrarReglas()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las severidades</option>
            <option value="critical">Críticas</option>
            <option value="high">Altas</option>
            <option value="medium">Medias</option>
            <option value="low">Bajas</option>
          </select>
          
          <select 
            [(ngModel)]="filtroEstado"
            (change)="filtrarReglas()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>
          
          <select 
            [(ngModel)]="filtroEvidencia"
            (change)="filtrarReglas()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los niveles</option>
            <option value="A">Evidencia A</option>
            <option value="B">Evidencia B</option>
            <option value="C">Evidencia C</option>
          </select>
        </div>
        
        <div class="mt-4 flex justify-between items-center">
          <div *ngIf="hayFiltrosActivos()">
            <button 
              (click)="limpiarFiltros()"
              class="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <lucide-icon [img]="filterXIcon" class="w-4 h-4"></lucide-icon>
              Limpiar filtros
            </button>
          </div>
          
          <button 
            (click)="abrirModalNuevaRegla()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
            Nueva regla
          </button>
        </div>
      </div>

      <!-- Tabla de reglas -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <lucide-icon [img]="settingsIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Reglas de Interacciones</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ reglasFiltradas.length }} regla{{ reglasFiltradas.length !== 1 ? 's' : '' }} encontrada{{ reglasFiltradas.length !== 1 ? 's' : '' }} • Doble clic para ver detalles
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2">
                <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
                Exportar
              </button>
            </div>
          </div>
        </div>
        
        <div *ngIf="reglasFiltradas.length === 0" class="text-center py-12">
          <lucide-icon [img]="settingsIcon" class="w-16 h-16 text-gray-300 mx-auto mb-4"></lucide-icon>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay reglas configuradas</h3>
          <p class="text-gray-600">No se encontraron reglas con los filtros aplicados o no hay reglas configuradas.</p>
        </div>

        <div *ngIf="reglasFiltradas.length > 0" class="overflow-x-auto" style="max-height: 500px; overflow-y: auto;">
          <table class="w-full min-w-[1200px]">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de la regla</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamentos</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severidad</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efecto clínico</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evidencia</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última actualización</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let regla of reglasFiltradas" 
                  class="hover:bg-blue-50/50 cursor-pointer transition-all"
                  (dblclick)="verDetalleRegla(regla)"
                  title="Doble clic para ver detalles">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <lucide-icon [img]="shieldIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                    <span class="font-medium text-gray-900">{{ regla.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="max-w-xs">
                    <p class="text-sm text-gray-900">{{ regla.medicine1 }}</p>
                    <p class="text-xs text-gray-600 mt-1">+ {{ regla.medicine2 }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getSeveridadBadgeClass(regla.severity)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getSeveridadTexto(regla.severity) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-gray-900 max-w-md">{{ regla.clinicalEffect }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getEvidenciaBadgeClass(regla.evidenceLevel)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    Nivel {{ regla.evidenceLevel }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span [class]="getEstadoBadgeClass(regla.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getEstadoTexto(regla.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">{{ regla.lastUpdated }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="relative">
                    <button 
                      (click)="toggleAccionesModal(regla.id); $event.stopPropagation()"
                      class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                      title="Más acciones"
                    >
                      <lucide-icon [img]="moreVerticalIcon" class="w-5 h-5"></lucide-icon>
                    </button>
                    
                    <!-- Modal de acciones -->
                    <div 
                      *ngIf="modalAccionesAbierto === regla.id"
                      (click)="$event.stopPropagation()"
                      class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <div class="py-2">
                        <div class="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                          Acciones
                        </div>
                        
                        <button 
                          (click)="verDetalleRegla(regla); cerrarModalAcciones()"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <lucide-icon [img]="eyeIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                          Ver detalles
                        </button>
                        
                        <button 
                          (click)="editarRegla(regla); cerrarModalAcciones()"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <lucide-icon [img]="editIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                          Editar regla
                        </button>
                        
                        <div class="border-t border-gray-100 mt-1 pt-1">
                          <button 
                            (click)="toggleEstadoRegla(regla); cerrarModalAcciones()"
                            class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                            [class]="regla.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'"
                          >
                            <lucide-icon [img]="regla.status === 'active' ? banIcon : checkCircle2Icon" class="w-4 h-4"></lucide-icon>
                            {{ regla.status === 'active' ? 'Desactivar' : 'Activar' }}
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
      </div>

      <!-- Información de ayuda -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <lucide-icon [img]="infoIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
          </div>
          <div>
            <h4 class="font-medium text-blue-900 mb-1">Gestión de Reglas de Interacciones</h4>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Las reglas definen qué combinaciones de medicamentos generan alertas automáticas</li>
              <li>• <strong>Nivel A:</strong> Evidencia sólida de estudios controlados</li>
              <li>• <strong>Nivel B:</strong> Evidencia de estudios observacionales</li>
              <li>• <strong>Nivel C:</strong> Opinión de expertos o reportes de casos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Nueva Regla -->
    <div 
      *ngIf="modalNuevaReglaAbierto"
      class="fixed inset-0 z-50 overflow-y-auto"
      (click)="cerrarModalNuevaRegla()"
    >
      <!-- Overlay -->
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <!-- Modal -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
             (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="bg-blue-600 px-6 py-4 text-white">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg leading-6 font-medium">Nueva Regla de Interacción</h3>
                <p class="text-blue-100 text-sm mt-1">Registra una nueva regla de interacción medicamentosa</p>
              </div>
              <button 
                (click)="cerrarModalNuevaRegla()"
                class="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
          </div>

          <!-- Contenido -->
          <div class="px-6 py-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la regla *</label>
              <input 
                type="text" 
                [(ngModel)]="nuevaRegla.name"
                placeholder="Ej: Warfarina + Antiagregantes"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Medicamento 1 *</label>
                <input 
                  type="text" 
                  [(ngModel)]="nuevaRegla.medicine1"
                  placeholder="Ej: Warfarina"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Medicamento 2 *</label>
                <input 
                  type="text" 
                  [(ngModel)]="nuevaRegla.medicine2"
                  placeholder="Ej: Ácido acetilsalicílico"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Severidad *</label>
                <select 
                  [(ngModel)]="nuevaRegla.severity"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona severidad</option>
                  <option value="critical">Crítica</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nivel de evidencia *</label>
                <select 
                  [(ngModel)]="nuevaRegla.evidenceLevel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona nivel</option>
                  <option value="A">Nivel A</option>
                  <option value="B">Nivel B</option>
                  <option value="C">Nivel C</option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mecanismo de interacción *</label>
              <textarea 
                [(ngModel)]="nuevaRegla.mechanism"
                rows="2"
                placeholder="Describe el mecanismo de la interacción..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Efecto clínico *</label>
              <textarea 
                [(ngModel)]="nuevaRegla.clinicalEffect"
                rows="2"
                placeholder="Describe el efecto clínico esperado..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Recomendación *</label>
              <textarea 
                [(ngModel)]="nuevaRegla.recommendation"
                rows="3"
                placeholder="Proporciona la recomendación clínica..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Referencias bibliográficas</label>
              <input 
                type="text" 
                [(ngModel)]="nuevaRegla.references"
                placeholder="Ej: FDA, Micromedx, Lexicomp"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 flex gap-3">
            <button 
              (click)="cerrarModalNuevaRegla()"
              class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              (click)="guardarNuevaRegla()"
              [disabled]="!esFormularioValido()"
              class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <lucide-icon [img]="saveIcon" class="w-4 h-4"></lucide-icon>
              Crear regla
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Editar Regla -->
    <div 
      *ngIf="modalEditarReglaAbierto"
      class="fixed inset-0 z-50 overflow-y-auto"
      (click)="cerrarModalEditarRegla()"
    >
      <!-- Overlay -->
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <!-- Modal -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
             (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="bg-blue-600 px-6 py-4 text-white">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg leading-6 font-medium">Editar Regla de Interacción</h3>
                <p class="text-blue-100 text-sm mt-1">Modifica los datos de la regla de interacción medicamentosa</p>
              </div>
              <button 
                (click)="cerrarModalEditarRegla()"
                class="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
          </div>

          <!-- Contenido -->
          <div class="px-6 py-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de la regla *</label>
              <input 
                type="text" 
                [(ngModel)]="reglaEditando.name"
                placeholder="Ej: Warfarina + Antiagregantes"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Medicamento 1 *</label>
                <input 
                  type="text" 
                  [(ngModel)]="reglaEditando.medicine1"
                  placeholder="Ej: Warfarina"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Medicamento 2 *</label>
                <input 
                  type="text" 
                  [(ngModel)]="reglaEditando.medicine2"
                  placeholder="Ej: Ácido acetilsalicílico"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Severidad *</label>
                <select 
                  [(ngModel)]="reglaEditando.severity"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="critical">Crítica</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nivel de evidencia *</label>
                <select 
                  [(ngModel)]="reglaEditando.evidenceLevel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="A">Nivel A</option>
                  <option value="B">Nivel B</option>
                  <option value="C">Nivel C</option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mecanismo de interacción *</label>
              <textarea 
                [(ngModel)]="reglaEditando.mechanism"
                rows="2"
                placeholder="Describe el mecanismo de la interacción..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Efecto clínico *</label>
              <textarea 
                [(ngModel)]="reglaEditando.clinicalEffect"
                rows="2"
                placeholder="Describe el efecto clínico esperado..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Recomendación *</label>
              <textarea 
                [(ngModel)]="reglaEditando.recommendation"
                rows="3"
                placeholder="Proporciona la recomendación clínica..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Referencias bibliográficas</label>
              <input 
                type="text" 
                [(ngModel)]="reglaEditando.references"
                placeholder="Ej: FDA, Micromedx, Lexicomp"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 flex gap-3">
            <button 
              (click)="cerrarModalEditarRegla()"
              class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              (click)="guardarCambiosRegla()"
              [disabled]="!esFormularioEditarValido()"
              class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <lucide-icon [img]="saveIcon" class="w-4 h-4"></lucide-icon>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal lateral derecho para detalles de regla -->
    <div 
      *ngIf="reglaSeleccionada"
      class="fixed inset-0 z-50 overflow-hidden"
      (click)="cerrarModalDetalles()"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <!-- Panel lateral -->
      <div class="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col"
           (click)="$event.stopPropagation()">
        
        <!-- Header del modal -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white flex-shrink-0">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <lucide-icon [img]="shieldIcon" class="w-5 h-5"></lucide-icon>
                <h2 class="text-lg font-semibold">Detalles de la Regla</h2>
              </div>
              <p class="text-blue-100 text-sm mt-1">{{ reglaSeleccionada.name }}</p>
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
          
            <!-- Estado de la regla -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="settingsIcon" class="w-4 h-4 text-gray-600"></lucide-icon>
                  <span class="text-sm font-medium text-gray-700">Estado de la regla</span>
                </div>
                <span [class]="getEstadoBadgeClass(reglaSeleccionada.status)" 
                      class="px-3 py-1 text-xs font-semibold rounded-full">
                  {{ getEstadoTexto(reglaSeleccionada.status) }}
                </span>
              </div>
            </div>

            <!-- Información básica -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <lucide-icon [img]="fileTextIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
                <h3 class="text-lg font-semibold text-gray-900">Información básica</h3>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p class="text-sm text-gray-600">ID de la regla</p>
                  <p class="font-semibold text-gray-900">{{ reglaSeleccionada.id }}</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-600">Severidad</p>
                    <span [class]="getSeveridadBadgeClass(reglaSeleccionada.severity)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getSeveridadTexto(reglaSeleccionada.severity) }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Nivel de evidencia</p>
                    <span [class]="getEvidenciaBadgeClass(reglaSeleccionada.evidenceLevel)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      Nivel {{ reglaSeleccionada.evidenceLevel }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Medicamentos involucrados -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <lucide-icon [img]="pillIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
                <h3 class="text-lg font-semibold text-gray-900">Medicamentos involucrados</h3>
              </div>
              
              <div class="space-y-3">
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600">Medicamento(s) 1</p>
                  <p class="font-semibold text-gray-900">{{ reglaSeleccionada.medicine1 }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600">Medicamento(s) 2</p>
                  <p class="font-semibold text-gray-900">{{ reglaSeleccionada.medicine2 }}</p>
                </div>
              </div>
            </div>

            <!-- Mecanismo de interacción -->
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Mecanismo de interacción</h4>
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-yellow-800 text-sm">{{ reglaSeleccionada.mechanism }}</p>
              </div>
            </div>

            <!-- Efecto clínico -->
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Efecto clínico</h4>
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-800 text-sm">{{ reglaSeleccionada.clinicalEffect }}</p>
              </div>
            </div>

            <!-- Recomendación -->
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Recomendación</h4>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p class="text-blue-800 text-sm">{{ reglaSeleccionada.recommendation }}</p>
              </div>
            </div>

            <!-- Referencias -->
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Referencias bibliográficas</h4>
              <p class="text-gray-700 text-sm">{{ reglaSeleccionada.references }}</p>
            </div>

            <!-- Información de actualización -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-2">Información de actualización</h4>
              <p class="text-sm text-gray-600">Última actualización: {{ reglaSeleccionada.lastUpdated }}</p>
            </div>
          </div>
        </div>

        <!-- Footer con botones de acción -->
        <div class="border-t border-gray-200 px-6 py-4 bg-gray-50 flex-shrink-0">
          <div class="flex gap-3">
            <button 
              (click)="cerrarModalDetalles()"
              class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Cerrar
            </button>
            <button 
              (click)="editarRegla(reglaSeleccionada); cerrarModalDetalles()"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <lucide-icon [img]="editIcon" class="w-4 h-4"></lucide-icon>
              Editar regla
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Suggestion Modal -->
    <app-role-suggestion-modal
      [isOpen]="showRoleSuggestionModal()"
      [suggestedRole]="'Médico'"
      [pageName]="'alertas-reglas'"
      (dismiss)="onRoleSuggestionDismiss()"
      (roleChanged)="onRoleChanged()"
    ></app-role-suggestion-modal>
  `
})
export class ReglasAlertasComponent implements OnInit, OnDestroy {
  // Iconos
  settingsIcon = Settings;
  shieldIcon = Shield;
  searchIcon = Search;
  filterIcon = Filter;
  filterXIcon = FilterX;
  eyeIcon = Eye;
  downloadIcon = Download;
  checkCircle2Icon = CheckCircle2;
  xCircleIcon = XCircle;
  clockIcon = Clock;
  userIcon = User;
  fileTextIcon = FileText;
  pillIcon = Pill;
  alertCircleIcon = AlertCircle;
  infoIcon = Info;
  banIcon = Ban;
  shieldAlertIcon = ShieldAlert;
  bellIcon = Bell;
  bellOffIcon = BellOff;
  xIcon = X;
  plusIcon = Plus;
  editIcon = Edit;
  trash2Icon = Trash2;
  moreVerticalIcon = MoreVertical;
  saveIcon = Save;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Alertas clínicas', route: '/alertas' },
    { label: 'Reglas e interacciones' }
  ];

  // Datos
  reglas: ReglaInteraccion[] = [
    {
      id: "RULE-001",
      name: "Warfarina + Antiagregantes plaquetarios",
      medicine1: "Warfarina",
      medicine2: "Ácido acetilsalicílico, Clopidogrel",
      severity: "critical",
      mechanism: "Efecto aditivo anticoagulante/antiagregante",
      clinicalEffect: "Riesgo aumentado de sangrado mayor",
      recommendation: "Evitar combinación o usar con extrema precaución y monitoreo INR frecuente",
      status: "active",
      evidenceLevel: "A",
      references: "FDA, Micromedex, Lexicomp",
      lastUpdated: "2024-09-15"
    },
    {
      id: "RULE-002",
      name: "IECAs + Espironolactona",
      medicine1: "Enalapril, Lisinopril, Ramipril",
      medicine2: "Espironolactona",
      severity: "high",
      mechanism: "Ambos aumentan potasio sérico",
      clinicalEffect: "Hiperpotasemia",
      recommendation: "Monitorear potasio sérico regularmente. Considerar ajuste de dosis",
      status: "active",
      evidenceLevel: "A",
      references: "UpToDate, ACC/AHA Guidelines",
      lastUpdated: "2024-08-20"
    },
    {
      id: "RULE-003",
      name: "AINEs + IECAs",
      medicine1: "Ibuprofeno, Naproxeno, Diclofenaco",
      medicine2: "Enalapril, Lisinopril, Losartán",
      severity: "high",
      mechanism: "Los AINEs reducen la eficacia de IECAs/ARA-II",
      clinicalEffect: "Disminución del efecto antihipertensivo y riesgo de deterioro de función renal",
      recommendation: "Evitar uso prolongado de AINEs. Monitorear presión arterial y función renal",
      status: "active",
      evidenceLevel: "A",
      references: "JNC-8, ESC/ESH Guidelines",
      lastUpdated: "2024-09-01"
    },
    {
      id: "RULE-004",
      name: "Metformina + Contraste yodado",
      medicine1: "Metformina",
      medicine2: "Contraste yodado (IV)",
      severity: "critical",
      mechanism: "Riesgo de acidosis láctica en caso de deterioro de función renal",
      clinicalEffect: "Acidosis láctica",
      recommendation: "Suspender metformina 48h antes y después del procedimiento con contraste. Verificar función renal",
      status: "active",
      evidenceLevel: "A",
      references: "FDA, ADA Guidelines",
      lastUpdated: "2024-07-10"
    },
    {
      id: "RULE-005",
      name: "Estatinas + Gemfibrozil",
      medicine1: "Atorvastatina, Simvastatina, Rosuvastatina",
      medicine2: "Gemfibrozil",
      severity: "critical",
      mechanism: "Gemfibrozil inhibe metabolismo de estatinas",
      clinicalEffect: "Riesgo severo de rabdomiólisis",
      recommendation: "Contraindicación absoluta. Usar fenofibrato en lugar de gemfibrozil si se requiere fibrato",
      status: "active",
      evidenceLevel: "A",
      references: "FDA Black Box Warning, ACC/AHA",
      lastUpdated: "2024-06-25"
    }
  ];

  // Filtros
  terminoBusqueda = '';
  filtroSeveridad = '';
  filtroEstado = '';
  filtroEvidencia = '';
  reglasFiltradas: ReglaInteraccion[] = [];

  // Modales
  reglaSeleccionada: ReglaInteraccion | null = null;
  modalAccionesAbierto: string | null = null;
  modalNuevaReglaAbierto = false;
  modalEditarReglaAbierto = false;
  
  // Nueva regla
  nuevaRegla: Partial<ReglaInteraccion> = {
    name: '',
    medicine1: '',
    medicine2: '',
    severity: 'medium',
    mechanism: '',
    clinicalEffect: '',
    recommendation: '',
    evidenceLevel: 'C',
    references: '',
    status: 'active'
  };

  // Regla en edición
  reglaEditando: Partial<ReglaInteraccion> = {};
  reglaOriginalId = '';

  // Estadísticas
  stats = {
    total: 0,
    active: 0,
    critical: 0,
    inactive: 0
  };

  // Role suggestion modal
  showRoleSuggestionModal = signal(false);
  private roleSubscriptions = new Subscription();

  constructor(private roleDemoService: RoleDemoService) {}

  ngOnInit() {
    this.calcularEstadisticas();
    this.filtrarReglas();
    this.checkRoleSuggestion();
    this.subscribeToRoleChanges();
  }

  ngOnDestroy(): void {
    this.roleSubscriptions.unsubscribe();
  }

  calcularEstadisticas() {
    this.stats = {
      total: this.reglas.length,
      active: this.reglas.filter(r => r.status === 'active').length,
      critical: this.reglas.filter(r => r.severity === 'critical' && r.status === 'active').length,
      inactive: this.reglas.filter(r => r.status === 'inactive').length
    };
  }

  filtrarReglas() {
    this.reglasFiltradas = this.reglas.filter(regla => {
      const matchesSearch = 
        regla.name.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        regla.medicine1.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        regla.medicine2.toLowerCase().includes(this.terminoBusqueda.toLowerCase());
      
      const matchesSeverity = !this.filtroSeveridad || regla.severity === this.filtroSeveridad;
      const matchesStatus = !this.filtroEstado || regla.status === this.filtroEstado;
      const matchesEvidence = !this.filtroEvidencia || regla.evidenceLevel === this.filtroEvidencia;
      
      return matchesSearch && matchesSeverity && matchesStatus && matchesEvidence;
    });
  }

  hayFiltrosActivos(): boolean {
    return !!(this.terminoBusqueda || this.filtroSeveridad || this.filtroEstado || this.filtroEvidencia);
  }

  limpiarFiltros() {
    this.terminoBusqueda = '';
    this.filtroSeveridad = '';
    this.filtroEstado = '';
    this.filtroEvidencia = '';
    this.filtrarReglas();
  }

  verDetalleRegla(regla: ReglaInteraccion) {
    this.reglaSeleccionada = regla;
  }

  editarRegla(regla: ReglaInteraccion) {
    this.reglaOriginalId = regla.id;
    this.reglaEditando = { ...regla };
    this.modalEditarReglaAbierto = true;
  }

  cerrarModalDetalles() {
    this.reglaSeleccionada = null;
  }

  toggleAccionesModal(reglaId: string) {
    this.modalAccionesAbierto = this.modalAccionesAbierto === reglaId ? null : reglaId;
  }

  cerrarModalAcciones() {
    this.modalAccionesAbierto = null;
  }

  abrirModalNuevaRegla() {
    this.modalNuevaReglaAbierto = true;
    this.resetearNuevaRegla();
  }

  cerrarModalNuevaRegla() {
    this.modalNuevaReglaAbierto = false;
    this.resetearNuevaRegla();
  }

  resetearNuevaRegla() {
    this.nuevaRegla = {
      name: '',
      medicine1: '',
      medicine2: '',
      severity: 'medium',
      mechanism: '',
      clinicalEffect: '',
      recommendation: '',
      evidenceLevel: 'C',
      references: '',
      status: 'active'
    };
  }

  esFormularioValido(): boolean {
    return !!(
      this.nuevaRegla.name &&
      this.nuevaRegla.medicine1 &&
      this.nuevaRegla.medicine2 &&
      this.nuevaRegla.severity &&
      this.nuevaRegla.mechanism &&
      this.nuevaRegla.clinicalEffect &&
      this.nuevaRegla.recommendation &&
      this.nuevaRegla.evidenceLevel
    );
  }

  guardarNuevaRegla() {
    if (this.esFormularioValido()) {
      const nuevaRegla: ReglaInteraccion = {
        id: `RULE-${String(this.reglas.length + 1).padStart(3, '0')}`,
        name: this.nuevaRegla.name!,
        medicine1: this.nuevaRegla.medicine1!,
        medicine2: this.nuevaRegla.medicine2!,
        severity: this.nuevaRegla.severity as any,
        mechanism: this.nuevaRegla.mechanism!,
        clinicalEffect: this.nuevaRegla.clinicalEffect!,
        recommendation: this.nuevaRegla.recommendation!,
        status: 'active',
        evidenceLevel: this.nuevaRegla.evidenceLevel as any,
        references: this.nuevaRegla.references || 'Sin referencias',
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      this.reglas.unshift(nuevaRegla);
      this.calcularEstadisticas();
      this.filtrarReglas();
      this.cerrarModalNuevaRegla();
      
      // Aquí podrías mostrar un toast de éxito
      console.log('Nueva regla creada:', nuevaRegla);
    }
  }

  toggleEstadoRegla(regla: ReglaInteraccion) {
    const index = this.reglas.findIndex(r => r.id === regla.id);
    if (index !== -1) {
      this.reglas[index].status = this.reglas[index].status === 'active' ? 'inactive' : 'active';
      this.reglas[index].lastUpdated = new Date().toISOString().split('T')[0];
      this.calcularEstadisticas();
      this.filtrarReglas();
    }
  }

  cerrarModalEditarRegla() {
    this.modalEditarReglaAbierto = false;
    this.reglaEditando = {};
    this.reglaOriginalId = '';
  }

  esFormularioEditarValido(): boolean {
    return !!(
      this.reglaEditando.name &&
      this.reglaEditando.medicine1 &&
      this.reglaEditando.medicine2 &&
      this.reglaEditando.severity &&
      this.reglaEditando.mechanism &&
      this.reglaEditando.clinicalEffect &&
      this.reglaEditando.recommendation &&
      this.reglaEditando.evidenceLevel
    );
  }

  guardarCambiosRegla() {
    if (this.esFormularioEditarValido() && this.reglaOriginalId) {
      const index = this.reglas.findIndex(r => r.id === this.reglaOriginalId);
      if (index !== -1) {
        this.reglas[index] = {
          ...this.reglas[index],
          name: this.reglaEditando.name!,
          medicine1: this.reglaEditando.medicine1!,
          medicine2: this.reglaEditando.medicine2!,
          severity: this.reglaEditando.severity as any,
          mechanism: this.reglaEditando.mechanism!,
          clinicalEffect: this.reglaEditando.clinicalEffect!,
          recommendation: this.reglaEditando.recommendation!,
          evidenceLevel: this.reglaEditando.evidenceLevel as any,
          references: this.reglaEditando.references || 'Sin referencias',
          lastUpdated: new Date().toISOString().split('T')[0]
        };

        this.calcularEstadisticas();
        this.filtrarReglas();
        this.cerrarModalEditarRegla();
        
        // Aquí podrías mostrar un toast de éxito
        console.log('Regla actualizada:', this.reglas[index]);
      }
    }
  }

  getSeveridadBadgeClass(severity: string): string {
    const classes = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return classes[severity as keyof typeof classes] || classes.medium;
  }

  getSeveridadTexto(severity: string): string {
    const textos = {
      critical: 'Crítica',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    };
    return textos[severity as keyof typeof textos] || severity;
  }

  getEstadoBadgeClass(status: string): string {
    const classes = {
      active: 'bg-green-100 text-green-700 border-green-300',
      inactive: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return classes[status as keyof typeof classes] || classes.active;
  }

  getEstadoTexto(status: string): string {
    const textos = {
      active: 'Activa',
      inactive: 'Inactiva'
    };
    return textos[status as keyof typeof textos] || status;
  }

  getEvidenciaBadgeClass(evidenceLevel: string): string {
    const classes = {
      A: 'bg-green-100 text-green-700 border-green-300',
      B: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      C: 'bg-orange-100 text-orange-700 border-orange-300'
    };
    return classes[evidenceLevel as keyof typeof classes] || classes.C;
  }

  // Role suggestion methods
  private checkRoleSuggestion(): void {
    const currentSession = this.roleDemoService.getCurrentSession();
    console.log('🔧 ReglasAlertas - checkRoleSuggestion - currentRole:', currentSession.activeRole);
    
    if (currentSession.activeRole !== 'Médico' && 
        currentSession.activeRole !== 'Administrador') {
      console.log('🔧 ReglasAlertas - Showing role suggestion modal for role:', currentSession.activeRole);
      this.showRoleSuggestionModal.set(true);
    } else {
      console.log('🔧 ReglasAlertas - Not showing modal, user has appropriate role');
      this.showRoleSuggestionModal.set(false);
    }
  }

  private subscribeToRoleChanges(): void {
    this.roleSubscriptions.add(
      this.roleDemoService.currentSession$.subscribe(session => {
        console.log('🔧 ReglasAlertas - Role changed to:', session.activeRole);
        this.checkRoleSuggestion();
      })
    );
  }

  onRoleSuggestionDismiss(): void {
    console.log('🔧 ReglasAlertas - Role suggestion dismissed');
    this.showRoleSuggestionModal.set(false);
  }

  onRoleChanged(): void {
    console.log('🔧 ReglasAlertas - Role changed, closing modal');
    this.showRoleSuggestionModal.set(false);
  }
}