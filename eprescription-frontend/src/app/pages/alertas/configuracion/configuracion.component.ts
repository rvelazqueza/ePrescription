import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Settings, Shield, Search, Filter, FilterX, Eye, Download, CheckCircle2, XCircle, Clock, User, FileText, Pill, AlertCircle, Info, Ban, ShieldAlert, Bell, BellOff, X, Edit, Trash2, ToggleLeft, ToggleRight, MoreVertical, Save } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';
import { Subscription } from 'rxjs';

interface TipoAlerta {
  id: string;
  code: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  behavior: 'block' | 'warn' | 'info';
  requiresAcknowledgment: boolean;
  requiresJustification: boolean;
  notifyPharmacy: boolean;
  autoLog: boolean;
  status: 'active' | 'inactive';
  examples: string;
  lastModified: string;
  modifiedBy: string;
}

@Component({
  selector: 'app-configuracion-alertas',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, BreadcrumbsComponent, PageHeaderComponent, RoleSuggestionModalComponent],
  template: `
    <div class="space-y-6" (click)="cerrarModalAcciones()">
      <!-- Breadcrumbs -->
      <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>
      
      <!-- Page Header -->
      <app-page-header 
        title="Configuración de Tipos de Alertas" 
        description="Gestión y configuración de comportamientos del sistema de alertas clínicas"
        [icon]="settingsIcon"
        [actionButton]="true">
        <div slot="action" class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30">
          <div class="text-right">
            <p class="text-xs text-white/80">Tipos configurados</p>
            <p class="text-2xl font-bold text-white">{{ tiposAlertas.length }}</p>
          </div>
        </div>
      </app-page-header>

      <!-- Tarjetas de estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow border-l-4 border-l-purple-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Total tipos</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-lg">
              <lucide-icon [img]="settingsIcon" class="w-8 h-8 text-purple-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-green-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Activos</p>
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
              <p class="text-sm text-gray-600 font-medium">Bloquean</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.blocking }}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-lg">
              <lucide-icon [img]="banIcon" class="w-8 h-8 text-red-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-yellow-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Requieren justificación</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.requireJustification }}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-lg">
              <lucide-icon [img]="fileTextIcon" class="w-8 h-8 text-yellow-600"></lucide-icon>
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
              (input)="filtrarTipos()"
              placeholder="Buscar por nombre o código..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
          </div>
          
          <select 
            [(ngModel)]="filtroSeveridad"
            (change)="filtrarTipos()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todas las severidades</option>
            <option value="critical">Críticas</option>
            <option value="high">Altas</option>
            <option value="medium">Medias</option>
            <option value="low">Bajas</option>
          </select>
          
          <select 
            [(ngModel)]="filtroComportamiento"
            (change)="filtrarTipos()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos los comportamientos</option>
            <option value="block">Bloquean</option>
            <option value="warn">Advierten</option>
            <option value="info">Informan</option>
          </select>
          
          <select 
            [(ngModel)]="filtroEstado"
            (change)="filtrarTipos()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
        
        <div *ngIf="hayFiltrosActivos()" class="mt-4">
          <button 
            (click)="limpiarFiltros()"
            class="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <lucide-icon [img]="filterXIcon" class="w-4 h-4"></lucide-icon>
            Limpiar filtros
          </button>
        </div>
      </div>

      <!-- Tabla de tipos de alertas -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-purple-100 rounded-lg">
                <lucide-icon [img]="settingsIcon" class="w-5 h-5 text-purple-600"></lucide-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Tipos de Alertas Configurados</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ tiposFiltrados.length }} tipo{{ tiposFiltrados.length !== 1 ? 's' : '' }} encontrado{{ tiposFiltrados.length !== 1 ? 's' : '' }} • Doble clic para ver detalles
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center gap-2">
                <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
                Exportar
              </button>
            </div>
          </div>
        </div>
        
        <div *ngIf="tiposFiltrados.length === 0" class="text-center py-12">
          <lucide-icon [img]="settingsIcon" class="w-16 h-16 text-gray-300 mx-auto mb-4"></lucide-icon>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay tipos configurados</h3>
          <p class="text-gray-600">No se encontraron tipos con los filtros aplicados o no hay tipos configurados.</p>
        </div>

        <div *ngIf="tiposFiltrados.length > 0" class="overflow-x-auto" style="max-height: 500px; overflow-y: auto;">
          <table class="w-full min-w-[1400px]">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severidad</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comportamiento</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Requiere confirmación</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Requiere justificación</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Notifica farmacia</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let tipo of tiposFiltrados" 
                  class="hover:bg-purple-50/50 cursor-pointer transition-all"
                  (dblclick)="verDetalleTipo(tipo)"
                  title="Doble clic para ver detalles">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <lucide-icon [img]="getComportamientoIcon(tipo.behavior)" class="w-4 h-4" [class]="getComportamientoIconClass(tipo.behavior)"></lucide-icon>
                    <span class="font-mono text-sm text-gray-900">{{ tipo.code }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="max-w-xs">
                    <p class="font-medium text-gray-900">{{ tipo.name }}</p>
                    <p class="text-xs text-gray-600 mt-1">{{ tipo.description }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getSeveridadBadgeClass(tipo.severity)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getSeveridadTexto(tipo.severity) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getComportamientoBadgeClass(tipo.behavior)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getComportamientoTexto(tipo.behavior) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <lucide-icon 
                    [img]="tipo.requiresAcknowledgment ? checkCircle2Icon : xCircleIcon" 
                    [class]="tipo.requiresAcknowledgment ? 'w-5 h-5 text-green-600' : 'w-5 h-5 text-gray-400'"
                  ></lucide-icon>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <lucide-icon 
                    [img]="tipo.requiresJustification ? checkCircle2Icon : xCircleIcon" 
                    [class]="tipo.requiresJustification ? 'w-5 h-5 text-green-600' : 'w-5 h-5 text-gray-400'"
                  ></lucide-icon>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <lucide-icon 
                    [img]="tipo.notifyPharmacy ? checkCircle2Icon : xCircleIcon" 
                    [class]="tipo.notifyPharmacy ? 'w-5 h-5 text-green-600' : 'w-5 h-5 text-gray-400'"
                  ></lucide-icon>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span [class]="getEstadoBadgeClass(tipo.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getEstadoTexto(tipo.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="relative">
                    <button 
                      (click)="toggleAccionesModal(tipo.id); $event.stopPropagation()"
                      class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                      title="Más acciones"
                    >
                      <lucide-icon [img]="moreVerticalIcon" class="w-5 h-5"></lucide-icon>
                    </button>
                    
                    <!-- Modal de acciones -->
                    <div 
                      *ngIf="modalAccionesAbierto === tipo.id"
                      (click)="$event.stopPropagation()"
                      class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <div class="py-2">
                        <div class="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                          Acciones
                        </div>
                        
                        <button 
                          (click)="verDetalleTipo(tipo); cerrarModalAcciones()"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <lucide-icon [img]="eyeIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                          Ver detalles
                        </button>
                        
                        <button 
                          (click)="editarTipo(tipo); cerrarModalAcciones()"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <lucide-icon [img]="editIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                          Editar configuración
                        </button>
                        
                        <div class="border-t border-gray-100 mt-1 pt-1">
                          <button 
                            (click)="toggleEstado(tipo); cerrarModalAcciones()"
                            class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                            [class]="tipo.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'"
                          >
                            <lucide-icon [img]="tipo.status === 'active' ? banIcon : checkCircle2Icon" class="w-4 h-4"></lucide-icon>
                            {{ tipo.status === 'active' ? 'Desactivar' : 'Activar' }}
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
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-purple-100 rounded-lg flex-shrink-0">
            <lucide-icon [img]="infoIcon" class="w-5 h-5 text-purple-600"></lucide-icon>
          </div>
          <div>
            <h4 class="font-medium text-purple-900 mb-1">Configuración de Tipos de Alertas</h4>
            <ul class="text-sm text-purple-700 space-y-1">
              <li>• <strong>Bloquear:</strong> Impide continuar hasta resolver la alerta</li>
              <li>• <strong>Advertir:</strong> Muestra advertencia pero permite continuar</li>
              <li>• <strong>Informar:</strong> Solo muestra información sin interrumpir el flujo</li>
              <li>• Los cambios en la configuración afectan inmediatamente a nuevas prescripciones</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Editar Tipo de Alerta -->
    <div 
      *ngIf="modalEditarTipoAbierto"
      class="fixed inset-0 z-50 overflow-y-auto"
      (click)="cerrarModalEditarTipo()"
    >
      <!-- Overlay -->
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <!-- Modal -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
             (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="bg-purple-600 px-6 py-4 text-white">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg leading-6 font-medium">Editar Tipo de Alerta</h3>
                <p class="text-purple-100 text-sm mt-1">Modifica la configuración del tipo de alerta clínica</p>
              </div>
              <button 
                (click)="cerrarModalEditarTipo()"
                class="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
          </div>

          <!-- Contenido -->
          <div class="px-6 py-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Código del tipo *</label>
              <input 
                type="text" 
                [(ngModel)]="tipoEditando.code"
                placeholder="Ej: INTERACTION_CRITICAL"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del tipo *</label>
              <input 
                type="text" 
                [(ngModel)]="tipoEditando.name"
                placeholder="Ej: Interacción medicamentosa crítica"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
              <textarea 
                [(ngModel)]="tipoEditando.description"
                rows="2"
                placeholder="Describe el tipo de alerta..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Severidad *</label>
                <select 
                  [(ngModel)]="tipoEditando.severity"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="critical">Crítica</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Comportamiento *</label>
                <select 
                  [(ngModel)]="tipoEditando.behavior"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="block">Bloquear</option>
                  <option value="warn">Advertir</option>
                  <option value="info">Informar</option>
                </select>
              </div>
            </div>
            
            <div class="space-y-3">
              <h4 class="font-medium text-gray-900">Configuración de comportamiento</h4>
              
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="font-medium text-gray-900">Requiere confirmación</p>
                  <p class="text-sm text-gray-600">El usuario debe confirmar que ha visto la alerta</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="tipoEditando.requiresAcknowledgment"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="font-medium text-gray-900">Requiere justificación</p>
                  <p class="text-sm text-gray-600">El usuario debe proporcionar una justificación clínica</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="tipoEditando.requiresJustification"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="font-medium text-gray-900">Notificar a farmacia</p>
                  <p class="text-sm text-gray-600">Envía notificación automática a la farmacia</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="tipoEditando.notifyPharmacy"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="font-medium text-gray-900">Registro automático</p>
                  <p class="text-sm text-gray-600">Registra automáticamente en el historial del paciente</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="tipoEditando.autoLog"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ejemplos de uso</label>
              <textarea 
                [(ngModel)]="tipoEditando.examples"
                rows="2"
                placeholder="Proporciona ejemplos de cuándo se aplica esta alerta..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 flex gap-3">
            <button 
              (click)="cerrarModalEditarTipo()"
              class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              (click)="guardarCambiosTipo()"
              [disabled]="!esFormularioEditarTipoValido()"
              class="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <lucide-icon [img]="saveIcon" class="w-4 h-4"></lucide-icon>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal lateral derecho para detalles de tipo -->
    <div 
      *ngIf="tipoSeleccionado"
      class="fixed inset-0 z-50 overflow-hidden"
      (click)="cerrarModalDetalles()"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <!-- Panel lateral -->
      <div class="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col"
           (click)="$event.stopPropagation()">
        
        <!-- Header del modal -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 text-white flex-shrink-0">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <lucide-icon [img]="settingsIcon" class="w-5 h-5"></lucide-icon>
                <h2 class="text-lg font-semibold">Configuración del Tipo de Alerta</h2>
              </div>
              <p class="text-purple-100 text-sm mt-1">{{ tipoSeleccionado.name }}</p>
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
          
            <!-- Estado del tipo -->
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="settingsIcon" class="w-4 h-4 text-gray-600"></lucide-icon>
                  <span class="text-sm font-medium text-gray-700">Estado del tipo</span>
                </div>
                <span [class]="getEstadoBadgeClass(tipoSeleccionado.status)" 
                      class="px-3 py-1 text-xs font-semibold rounded-full">
                  {{ getEstadoTexto(tipoSeleccionado.status) }}
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
                  <p class="text-sm text-gray-600">Código del tipo</p>
                  <p class="font-mono text-sm font-semibold text-gray-900">{{ tipoSeleccionado.code }}</p>
                </div>
                
                <div>
                  <p class="text-sm text-gray-600">Descripción</p>
                  <p class="text-sm text-gray-900">{{ tipoSeleccionado.description }}</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-600">Severidad</p>
                    <span [class]="getSeveridadBadgeClass(tipoSeleccionado.severity)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getSeveridadTexto(tipoSeleccionado.severity) }}
                    </span>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Comportamiento</p>
                    <span [class]="getComportamientoBadgeClass(tipoSeleccionado.behavior)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getComportamientoTexto(tipoSeleccionado.behavior) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Configuración de comportamiento -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <lucide-icon [img]="settingsIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
                <h3 class="text-lg font-semibold text-gray-900">Configuración de comportamiento</h3>
              </div>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p class="font-medium text-gray-900">Requiere confirmación</p>
                    <p class="text-sm text-gray-600">El usuario debe confirmar que ha visto la alerta</p>
                  </div>
                  <lucide-icon 
                    [img]="tipoSeleccionado.requiresAcknowledgment ? checkCircle2Icon : xCircleIcon" 
                    [class]="tipoSeleccionado.requiresAcknowledgment ? 'w-6 h-6 text-green-600' : 'w-6 h-6 text-gray-400'"
                  ></lucide-icon>
                </div>
                
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p class="font-medium text-gray-900">Requiere justificación</p>
                    <p class="text-sm text-gray-600">El usuario debe proporcionar una justificación clínica</p>
                  </div>
                  <lucide-icon 
                    [img]="tipoSeleccionado.requiresJustification ? checkCircle2Icon : xCircleIcon" 
                    [class]="tipoSeleccionado.requiresJustification ? 'w-6 h-6 text-green-600' : 'w-6 h-6 text-gray-400'"
                  ></lucide-icon>
                </div>
                
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p class="font-medium text-gray-900">Notificar a farmacia</p>
                    <p class="text-sm text-gray-600">Envía notificación automática a la farmacia</p>
                  </div>
                  <lucide-icon 
                    [img]="tipoSeleccionado.notifyPharmacy ? checkCircle2Icon : xCircleIcon" 
                    [class]="tipoSeleccionado.notifyPharmacy ? 'w-6 h-6 text-green-600' : 'w-6 h-6 text-gray-400'"
                  ></lucide-icon>
                </div>
                
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p class="font-medium text-gray-900">Registro automático</p>
                    <p class="text-sm text-gray-600">Registra automáticamente en el historial del paciente</p>
                  </div>
                  <lucide-icon 
                    [img]="tipoSeleccionado.autoLog ? checkCircle2Icon : xCircleIcon" 
                    [class]="tipoSeleccionado.autoLog ? 'w-6 h-6 text-green-600' : 'w-6 h-6 text-gray-400'"
                  ></lucide-icon>
                </div>
              </div>
            </div>

            <!-- Ejemplos -->
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Ejemplos de uso</h4>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p class="text-blue-800 text-sm">{{ tipoSeleccionado.examples }}</p>
              </div>
            </div>

            <!-- Información de modificación -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-2">Información de modificación</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-600">Última modificación</p>
                  <p class="text-gray-900">{{ tipoSeleccionado.lastModified }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Modificado por</p>
                  <p class="text-gray-900">{{ tipoSeleccionado.modifiedBy }}</p>
                </div>
              </div>
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
              (click)="editarTipo(tipoSeleccionado); cerrarModalDetalles()"
              class="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <lucide-icon [img]="editIcon" class="w-4 h-4"></lucide-icon>
              Editar configuración
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Suggestion Modal -->
    <app-role-suggestion-modal
      [isOpen]="showRoleSuggestionModal()"
      [suggestedRole]="'Médico'"
      [pageName]="'alertas-configuracion'"
      (dismiss)="onRoleSuggestionDismiss()"
      (roleChanged)="onRoleChanged()"
    ></app-role-suggestion-modal>
  `
})
export class ConfiguracionAlertasComponent implements OnInit, OnDestroy {
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
  editIcon = Edit;
  trash2Icon = Trash2;
  toggleLeftIcon = ToggleLeft;
  toggleRightIcon = ToggleRight;
  moreVerticalIcon = MoreVertical;
  saveIcon = Save;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Alertas clínicas', route: '/alertas' },
    { label: 'Tipos de alertas' }
  ];

  // Datos
  tiposAlertas: TipoAlerta[] = [
    {
      id: "TYPE-001",
      code: "INTERACTION_CRITICAL",
      name: "Interacción medicamentosa crítica",
      description: "Combinación de medicamentos con riesgo severo para la vida del paciente",
      severity: "critical",
      behavior: "block",
      requiresAcknowledgment: true,
      requiresJustification: true,
      notifyPharmacy: true,
      autoLog: true,
      status: "active",
      examples: "Warfarina + AAS, Estatinas + Gemfibrozil",
      lastModified: "2024-09-15",
      modifiedBy: "Admin"
    },
    {
      id: "TYPE-002",
      code: "ALLERGY_ABSOLUTE",
      name: "Alergia registrada",
      description: "Medicamento al que el paciente tiene alergia documentada",
      severity: "critical",
      behavior: "block",
      requiresAcknowledgment: true,
      requiresJustification: true,
      notifyPharmacy: true,
      autoLog: true,
      status: "active",
      examples: "Penicilina en paciente alérgico a beta-lactámicos",
      lastModified: "2024-09-10",
      modifiedBy: "Admin"
    },
    {
      id: "TYPE-003",
      code: "CONTRAINDICATION",
      name: "Contraindicación por condición médica",
      description: "Medicamento contraindicado por condición del paciente",
      severity: "high",
      behavior: "warn",
      requiresAcknowledgment: true,
      requiresJustification: true,
      notifyPharmacy: false,
      autoLog: true,
      status: "active",
      examples: "AINEs en insuficiencia renal, Beta-bloqueadores en asma severa",
      lastModified: "2024-08-20",
      modifiedBy: "Admin"
    },
    {
      id: "TYPE-004",
      code: "DUPLICATE_THERAPY",
      name: "Duplicidad terapéutica",
      description: "Dos o más medicamentos de la misma clase terapéutica",
      severity: "medium",
      behavior: "warn",
      requiresAcknowledgment: true,
      requiresJustification: false,
      notifyPharmacy: false,
      autoLog: true,
      status: "active",
      examples: "Dos estatinas, Dos IECAs, Dos IBP",
      lastModified: "2024-07-15",
      modifiedBy: "Admin"
    },
    {
      id: "TYPE-005",
      code: "DOSE_MAX_EXCEEDED",
      name: "Dosis máxima excedida",
      description: "La dosis prescrita supera el límite máximo permitido",
      severity: "high",
      behavior: "warn",
      requiresAcknowledgment: true,
      requiresJustification: true,
      notifyPharmacy: true,
      autoLog: true,
      status: "active",
      examples: "Metformina >3000mg/día, Paracetamol >4g/día",
      lastModified: "2024-09-01",
      modifiedBy: "Admin"
    },
    {
      id: "TYPE-006",
      code: "INTERACTION_MODERATE",
      name: "Interacción medicamentosa moderada",
      description: "Combinación que requiere monitoreo sin riesgo inmediato severo",
      severity: "medium",
      behavior: "info",
      requiresAcknowledgment: false,
      requiresJustification: false,
      notifyPharmacy: false,
      autoLog: true,
      status: "active",
      examples: "Levotiroxina + Hierro, Digoxina + Diuréticos",
      lastModified: "2024-06-30",
      modifiedBy: "Admin"
    },
    {
      id: "TYPE-007",
      code: "AGE_PEDIATRIC",
      name: "Alerta pediátrica",
      description: "Medicamento o dosis no adecuada para edad pediátrica",
      severity: "high",
      behavior: "warn",
      requiresAcknowledgment: true,
      requiresJustification: true,
      notifyPharmacy: true,
      autoLog: true,
      status: "active",
      examples: "Aspirina en menores de 12 años, Fluoroquinolonas en niños",
      lastModified: "2024-08-10",
      modifiedBy: "Admin"
    },
    {
      id: "TYPE-008",
      code: "PREGNANCY_RISK",
      name: "Riesgo en embarazo",
      description: "Medicamento categoría D o X en paciente embarazada",
      severity: "critical",
      behavior: "block",
      requiresAcknowledgment: true,
      requiresJustification: true,
      notifyPharmacy: true,
      autoLog: true,
      status: "active",
      examples: "Warfarina, Estatinas, IECAs en embarazo",
      lastModified: "2024-09-05",
      modifiedBy: "Admin"
    }
  ];

  // Filtros
  terminoBusqueda = '';
  filtroSeveridad = '';
  filtroComportamiento = '';
  filtroEstado = '';
  tiposFiltrados: TipoAlerta[] = [];

  // Modales
  tipoSeleccionado: TipoAlerta | null = null;
  modalAccionesAbierto: string | null = null;
  modalEditarTipoAbierto = false;
  
  // Tipo en edición
  tipoEditando: Partial<TipoAlerta> = {};
  tipoOriginalId = '';

  // Estadísticas
  stats = {
    total: 0,
    active: 0,
    blocking: 0,
    requireJustification: 0
  };

  // Role suggestion modal
  showRoleSuggestionModal = signal(false);
  private roleSubscriptions = new Subscription();

  constructor(private roleDemoService: RoleDemoService) {}

  ngOnInit() {
    this.calcularEstadisticas();
    this.filtrarTipos();
    this.checkRoleSuggestion();
    this.subscribeToRoleChanges();
  }

  ngOnDestroy(): void {
    this.roleSubscriptions.unsubscribe();
  }

  calcularEstadisticas() {
    this.stats = {
      total: this.tiposAlertas.length,
      active: this.tiposAlertas.filter(t => t.status === 'active').length,
      blocking: this.tiposAlertas.filter(t => t.behavior === 'block' && t.status === 'active').length,
      requireJustification: this.tiposAlertas.filter(t => t.requiresJustification && t.status === 'active').length
    };
  }

  filtrarTipos() {
    this.tiposFiltrados = this.tiposAlertas.filter(tipo => {
      const matchesSearch = 
        tipo.name.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        tipo.code.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        tipo.description.toLowerCase().includes(this.terminoBusqueda.toLowerCase());
      
      const matchesSeverity = !this.filtroSeveridad || tipo.severity === this.filtroSeveridad;
      const matchesBehavior = !this.filtroComportamiento || tipo.behavior === this.filtroComportamiento;
      const matchesStatus = !this.filtroEstado || tipo.status === this.filtroEstado;
      
      return matchesSearch && matchesSeverity && matchesBehavior && matchesStatus;
    });
  }

  hayFiltrosActivos(): boolean {
    return !!(this.terminoBusqueda || this.filtroSeveridad || this.filtroComportamiento || this.filtroEstado);
  }

  limpiarFiltros() {
    this.terminoBusqueda = '';
    this.filtroSeveridad = '';
    this.filtroComportamiento = '';
    this.filtroEstado = '';
    this.filtrarTipos();
  }

  verDetalleTipo(tipo: TipoAlerta) {
    this.tipoSeleccionado = tipo;
  }

  editarTipo(tipo: TipoAlerta) {
    this.tipoOriginalId = tipo.id;
    this.tipoEditando = { ...tipo };
    this.modalEditarTipoAbierto = true;
  }

  toggleEstado(tipo: TipoAlerta) {
    const index = this.tiposAlertas.findIndex(t => t.id === tipo.id);
    if (index !== -1) {
      this.tiposAlertas[index].status = this.tiposAlertas[index].status === 'active' ? 'inactive' : 'active';
      this.calcularEstadisticas();
      this.filtrarTipos();
    }
  }

  cerrarModalDetalles() {
    this.tipoSeleccionado = null;
  }

  toggleAccionesModal(tipoId: string) {
    this.modalAccionesAbierto = this.modalAccionesAbierto === tipoId ? null : tipoId;
  }

  cerrarModalAcciones() {
    this.modalAccionesAbierto = null;
  }

  cerrarModalEditarTipo() {
    this.modalEditarTipoAbierto = false;
    this.tipoEditando = {};
    this.tipoOriginalId = '';
  }

  esFormularioEditarTipoValido(): boolean {
    return !!(
      this.tipoEditando.code &&
      this.tipoEditando.name &&
      this.tipoEditando.description &&
      this.tipoEditando.severity &&
      this.tipoEditando.behavior
    );
  }

  guardarCambiosTipo() {
    if (this.esFormularioEditarTipoValido() && this.tipoOriginalId) {
      const index = this.tiposAlertas.findIndex(t => t.id === this.tipoOriginalId);
      if (index !== -1) {
        this.tiposAlertas[index] = {
          ...this.tiposAlertas[index],
          code: this.tipoEditando.code!,
          name: this.tipoEditando.name!,
          description: this.tipoEditando.description!,
          severity: this.tipoEditando.severity as any,
          behavior: this.tipoEditando.behavior as any,
          requiresAcknowledgment: this.tipoEditando.requiresAcknowledgment || false,
          requiresJustification: this.tipoEditando.requiresJustification || false,
          notifyPharmacy: this.tipoEditando.notifyPharmacy || false,
          autoLog: this.tipoEditando.autoLog || false,
          examples: this.tipoEditando.examples || '',
          lastModified: new Date().toISOString().split('T')[0],
          modifiedBy: 'Usuario actual'
        };

        this.calcularEstadisticas();
        this.filtrarTipos();
        this.cerrarModalEditarTipo();
        
        // Aquí podrías mostrar un toast de éxito
        console.log('Tipo actualizado:', this.tiposAlertas[index]);
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

  getComportamientoBadgeClass(behavior: string): string {
    const classes = {
      block: 'bg-red-100 text-red-700 border-red-300',
      warn: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      info: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return classes[behavior as keyof typeof classes] || classes.info;
  }

  getComportamientoTexto(behavior: string): string {
    const textos = {
      block: 'Bloquear',
      warn: 'Advertir',
      info: 'Informar'
    };
    return textos[behavior as keyof typeof textos] || behavior;
  }

  getComportamientoIcon(behavior: string): any {
    const iconos = {
      block: this.banIcon,
      warn: this.alertCircleIcon,
      info: this.infoIcon
    };
    return iconos[behavior as keyof typeof iconos] || this.infoIcon;
  }

  getComportamientoIconClass(behavior: string): string {
    const classes = {
      block: 'text-red-600',
      warn: 'text-yellow-600',
      info: 'text-blue-600'
    };
    return classes[behavior as keyof typeof classes] || 'text-blue-600';
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
      active: 'Activo',
      inactive: 'Inactivo'
    };
    return textos[status as keyof typeof textos] || status;
  }

  // Role suggestion methods
  private checkRoleSuggestion(): void {
    const currentSession = this.roleDemoService.getCurrentSession();
    console.log('🔧 ConfiguracionAlertas - checkRoleSuggestion - currentRole:', currentSession.activeRole);
    
    if (currentSession.activeRole !== 'Médico' && 
        currentSession.activeRole !== 'Administrador') {
      console.log('🔧 ConfiguracionAlertas - Showing role suggestion modal for role:', currentSession.activeRole);
      this.showRoleSuggestionModal.set(true);
    } else {
      console.log('🔧 ConfiguracionAlertas - Not showing modal, user has appropriate role');
      this.showRoleSuggestionModal.set(false);
    }
  }

  private subscribeToRoleChanges(): void {
    this.roleSubscriptions.add(
      this.roleDemoService.currentSession$.subscribe(session => {
        console.log('🔧 ConfiguracionAlertas - Role changed to:', session.activeRole);
        this.checkRoleSuggestion();
      })
    );
  }

  onRoleSuggestionDismiss(): void {
    console.log('🔧 ConfiguracionAlertas - Role suggestion dismissed');
    this.showRoleSuggestionModal.set(false);
  }

  onRoleChanged(): void {
    console.log('🔧 ConfiguracionAlertas - Role changed, closing modal');
    this.showRoleSuggestionModal.set(false);
  }
}