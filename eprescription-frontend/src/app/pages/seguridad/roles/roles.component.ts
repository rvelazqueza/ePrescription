import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  Shield, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  Star,
  Eye,
  Settings,
  Plus,
  MoreVertical,
  Edit,
  XCircle,
  Lock,
  Activity,
  Clock,
  Save,
  User
} from 'lucide-angular';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  usersCount: number;
  derivedCount: number;
  lastModified: string;
  status: 'active' | 'inactive' | 'pending';
  type: 'base' | 'custom';
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      [title]="'Roles y Permisos'"
      [description]="'Sistema Híbrido RBAC • Roles Base + Personalizados • HIPAA/FDA/FHIR Compliant'"
      [icon]="shieldIcon"
      [breadcrumbItems]="breadcrumbItems"
      [hasActionButton]="true"
      [headerGradient]="'from-blue-600 via-indigo-500 to-purple-600'"
      [showSecurityBadge]="true">

      <!-- Content -->
      <div class="space-y-6">
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Total roles</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.totalRoles }}</p>
                  <div class="flex items-center gap-1 text-xs">
                    <span class="text-gray-500">{{ stats.baseRoles }} base + {{ stats.customRoles }} personalizados</span>
                  </div>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl">
                  <lucide-icon [img]="shieldIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-green-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Roles activos</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.activeRoles }}</p>
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
                  <p class="text-sm text-gray-600">Total usuarios</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-xl">
                  <lucide-icon [img]="usersIcon" class="w-8 h-8 text-purple-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-orange-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Pendientes</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.pendingApprovals }}</p>
                  <div class="flex items-center gap-1 text-xs">
                    <span class="text-gray-500">Aprobación requerida</span>
                  </div>
                </div>
                <div class="p-3 bg-orange-100 rounded-xl">
                  <lucide-icon [img]="alertTriangleIcon" class="w-8 h-8 text-orange-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Gestión de Roles</h2>
            
            <!-- Tab Navigation -->
            <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button 
                *ngFor="let tab of tabs"
                (click)="activeTab = tab.id"
                [class]="getTabClass(tab.id)"
                class="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors">
                <lucide-icon [img]="tab.icon" class="w-4 h-4 mr-2"></lucide-icon>
                {{ tab.label }} ({{ tab.count }})
              </button>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <!-- Roles Base Tab -->
            <div *ngIf="activeTab === 'base'">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignaciones</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Derivados</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última modificación</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr *ngFor="let role of getBaseRoles()" class="hover:bg-gray-50">
                      <td class="px-6 py-4">
                        <div>
                          <p class="font-medium text-gray-900">{{ role.name }}</p>
                          <p class="text-sm text-gray-600">{{ role.description }}</p>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {{ role.usersCount }} directos
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                          {{ role.derivedCount }} personalizados
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ role.lastModified }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button 
                          (click)="openPermissionsModal(role)"
                          class="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          <lucide-icon [img]="eyeIcon" class="w-4 h-4 mr-1"></lucide-icon>
                          Ver permisos
                        </button>
                        <button 
                          (click)="createCustomRole(role)"
                          class="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                          <lucide-icon [img]="plusIcon" class="w-4 h-4 mr-1"></lucide-icon>
                          Crear personalizado
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Roles Personalizados Tab -->
            <div *ngIf="activeTab === 'custom'">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol Personalizado</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol Base</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ajustes</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vigencia</th>
                      <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr *ngFor="let role of getCustomRoles()" class="hover:bg-gray-50">
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                          <lucide-icon [img]="starIcon" class="w-4 h-4 text-purple-500"></lucide-icon>
                          <div>
                            <p class="font-medium text-gray-900">{{ role.name }}</p>
                            <p class="text-xs text-gray-500">{{ role.code }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="text-sm text-gray-900">{{ getBaseRoleName(role) }}</span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm">
                          <p class="text-gray-900">{{ getUserForRole(role) }}</p>
                          <p class="text-gray-500">{{ getUserEmailForRole(role) }}</p>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex flex-col gap-1">
                          <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                            -{{ getAdjustmentsCount(role) }} quitados
                          </span>
                          <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                            +{{ getAdditionsCount(role) }} agregados
                          </span>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          activo
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm">
                          <p class="text-gray-900">{{ getVigencia(role) }}</p>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right">
                        <div class="flex items-center gap-2">
                          <button 
                            (click)="openPermissionsModal(role)"
                            class="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600">
                            <lucide-icon [img]="eyeIcon" class="w-4 h-4"></lucide-icon>
                          </button>
                          <button 
                            *ngIf="role.status === 'active'"
                            (click)="removeRole(role)"
                            class="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700">
                            Remover
                          </button>
                          <span 
                            *ngIf="role.status === 'pending'"
                            class="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                            Pendiente
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Pendientes Tab -->
            <div *ngIf="activeTab === 'pending'">
              <div *ngIf="pendingRoles.length === 0" class="text-center py-12">
                <lucide-icon [img]="checkCircle2Icon" class="w-12 h-12 text-green-400 mx-auto mb-4"></lucide-icon>
                <h3 class="font-medium mb-2">No hay roles pendientes</h3>
                <p class="text-sm text-gray-600">Todos los roles personalizados han sido aprobados</p>
              </div>

              <div *ngIf="pendingRoles.length > 0" class="space-y-4">
                <div *ngFor="let pendingRole of pendingRoles" class="border border-orange-200 bg-orange-50 rounded-lg p-6">
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <lucide-icon [img]="alertTriangleIcon" class="w-6 h-6 text-orange-600"></lucide-icon>
                      <div>
                        <h3 class="font-semibold text-gray-900">{{ pendingRole.name }}</h3>
                        <p class="text-sm text-gray-600">Base: {{ pendingRole.baseRole }} • Usuario: {{ pendingRole.userName }}</p>
                      </div>
                    </div>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-300">
                      Pendiente de Aprobación
                    </span>
                  </div>

                  <div class="mb-4">
                    <h4 class="font-medium text-gray-900 mb-2">Ajustes de Permisos:</h4>
                    
                    <div *ngIf="pendingRole.permissionsAdded.length > 0" class="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-lg">➕</span>
                        <span class="font-medium text-green-800">Permisos Agregados:</span>
                      </div>
                      <ul class="text-sm text-green-700">
                        <li *ngFor="let permission of pendingRole.permissionsAdded">• {{ permission }}</li>
                      </ul>
                    </div>

                    <div *ngIf="pendingRole.permissionsRemoved.length > 0" class="mb-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-lg">➖</span>
                        <span class="font-medium text-red-800">Permisos Removidos:</span>
                      </div>
                      <ul class="text-sm text-red-700">
                        <li *ngFor="let permission of pendingRole.permissionsRemoved">• {{ permission }}</li>
                      </ul>
                    </div>
                  </div>

                  <div class="mb-4">
                    <h4 class="font-medium text-gray-900 mb-2">Justificación:</h4>
                    <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p class="text-sm text-gray-700">{{ pendingRole.justification }}</p>
                    </div>
                  </div>

                  <div class="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>Creado por: {{ pendingRole.createdBy }}</span>
                    <span>Fecha de solicitud: {{ pendingRole.createdDate }}</span>
                  </div>

                  <div class="flex gap-3">
                    <button 
                      (click)="approveRole(pendingRole)"
                      class="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 mr-2"></lucide-icon>
                      Aprobar Rol
                    </button>
                    <button 
                      (click)="rejectRole(pendingRole)"
                      class="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                      <lucide-icon [img]="xCircleIcon" class="w-4 h-4 mr-2"></lucide-icon>
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-page-layout>

    <!-- Modal de Permisos de Rol -->
    <div *ngIf="isPermissionsModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" (click)="closePermissionsModal()">
      <div class="relative top-10 mx-auto border w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 shadow-lg rounded-md bg-white flex flex-col max-h-[90vh]" (click)="$event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 pb-4 border-b border-gray-200 flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <lucide-icon [img]="shieldIcon" class="w-6 h-6 text-blue-600"></lucide-icon>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Configuración de Rol: {{ selectedRoleForPermissions?.name }}</h3>
              <p class="text-sm text-gray-600">{{ selectedRoleForPermissions?.description }} • Código: {{ selectedRoleForPermissions?.code }} • {{ selectedRoleForPermissions?.usersCount }} usuario{{ selectedRoleForPermissions?.usersCount !== 1 ? 's' : '' }}</p>
            </div>
          </div>
          <button (click)="closePermissionsModal()" class="text-gray-400 hover:text-gray-600">
            <lucide-icon [img]="xCircleIcon" class="w-6 h-6"></lucide-icon>
          </button>
        </div>

        <!-- Tabs -->
        <div class="px-6 pt-4 flex-shrink-0">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
              <button 
                (click)="activePermissionsTab = 'permissions'"
                [class]="getPermissionsTabClass('permissions')">
                <lucide-icon [img]="shieldIcon" class="w-4 h-4 mr-2"></lucide-icon>
                Permisos
              </button>
              <button 
                (click)="activePermissionsTab = 'security'"
                [class]="getPermissionsTabClass('security')">
                <lucide-icon [img]="lockIcon" class="w-4 h-4 mr-2"></lucide-icon>
                Seguridad
              </button>
              <button 
                (click)="activePermissionsTab = 'audit'"
                [class]="getPermissionsTabClass('audit')">
                <lucide-icon [img]="activityIcon" class="w-4 h-4 mr-2"></lucide-icon>
                Auditoría
              </button>
            </nav>
          </div>
        </div>

        <!-- Modal Content - Scrollable Area -->
        <div class="flex-1 overflow-y-auto px-6 py-6">
          
          <!-- TAB: Permisos -->
          <div *ngIf="activePermissionsTab === 'permissions'">
            
            <!-- Advertencias de seguridad -->
            <div class="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-yellow-600"></lucide-icon>
                <span class="font-medium text-gray-900">Advertencias de seguridad</span>
              </div>
              <ul class="text-sm text-yellow-700 space-y-1">
                <li>• ADVERTENCIA HIPAA: El permiso "Exportar PHI" permite exportar datos protegidos de salud. Requiere auditoría completa.</li>
                <li>• ADVERTENCIA: "Gestión total de seguridad" es un permiso crítico que permite control total del sistema.</li>
                <li>• ADVERTENCIA: El permiso "Restaurar sistema" puede sobrescribir datos. Requiere aprobación especial.</li>
              </ul>
            </div>

            <!-- Matriz de Permisos -->
            <div class="mb-6">
              <div class="flex items-center justify-between mb-4">
                <h4 class="font-medium flex items-center gap-2">
                  <lucide-icon [img]="checkCircle2Icon" class="w-5 h-5 text-blue-600"></lucide-icon>
                  Matriz de Permisos (RBAC Profesional)
                </h4>
                <div class="flex gap-2 text-xs">
                  <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">Lectura</span>
                  <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">Escritura</span>
                  <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">Eliminación</span>
                  <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">Especial</span>
                  <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700">Admin</span>
                </div>
              </div>

              <!-- Prescripciones -->
              <div class="border border-red-300 bg-red-50/30 rounded-lg p-4 mb-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="editIcon" class="w-5 h-5 text-red-600"></lucide-icon>
                    <div>
                      <label class="flex items-center gap-2 font-medium text-gray-900">
                        Prescripciones
                        <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 border-red-300">
                          CRÍTICO
                        </span>
                      </label>
                      <p class="text-xs text-gray-600 mt-0.5">Control de recetas médicas y prescripciones</p>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    6 de 9
                  </span>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Ver</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 border-blue-300">read</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Visualizar prescripciones</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Crear</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border-green-300">write</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Crear nuevas recetas</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Editar</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border-green-300">write</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Modificar recetas no firmadas</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-red-300 bg-red-50 rounded-lg">
                    <input type="checkbox" class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Eliminar</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 border-red-300">delete</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Eliminar borradores</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg">
                    <input type="checkbox" class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Firmar</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border-purple-300">special</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Firma digital de recetas</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Aprobar</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border-purple-300">special</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Aprobar prescripciones especiales</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pacientes -->
              <div class="border border-red-300 bg-red-50/30 rounded-lg p-4 mb-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="userIcon" class="w-5 h-5 text-red-600"></lucide-icon>
                    <div>
                      <label class="flex items-center gap-2 font-medium text-gray-900">
                        Pacientes
                        <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 border-red-300">
                          CRÍTICO
                        </span>
                      </label>
                      <p class="text-xs text-gray-600 mt-0.5">Acceso a datos protegidos de salud (PHI/HIPAA)</p>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    4 de 6
                  </span>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Ver</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 border-blue-300">read</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Visualizar datos PHI (HIPAA)</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Registrar</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border-green-300">write</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Crear registros de pacientes</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Actualizar</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border-green-300">write</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Modificar datos de pacientes</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg">
                    <input type="checkbox" class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Eliminar</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 border-red-300">delete</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Eliminar registros (soft delete)</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Exportar PHI</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border-purple-300">special</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Exportar datos protegidos</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg">
                    <input type="checkbox" class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Fusionar</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 border-orange-300">admin</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Fusionar registros duplicados</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Usuarios y Seguridad -->
              <div class="border border-red-300 bg-red-50/30 rounded-lg p-4 mb-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="usersIcon" class="w-5 h-5 text-red-600"></lucide-icon>
                    <div>
                      <label class="flex items-center gap-2 font-medium text-gray-900">
                        Usuarios y Seguridad
                        <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 border-red-300">
                          CRÍTICO
                        </span>
                      </label>
                      <p class="text-xs text-gray-600 mt-0.5">Gestión de cuentas y accesos al sistema</p>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    8 de 8
                  </span>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Ver usuarios</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 border-blue-300">read</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Visualizar usuarios del sistema</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Crear</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border-green-300">write</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Crear nuevas cuentas</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Modificar</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border-green-300">write</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Editar usuarios</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Eliminar</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 border-red-300">delete</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Desactivar cuentas</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Gestionar roles</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 border-orange-300">admin</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Asignar y modificar roles</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Reset password</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 border-orange-300">admin</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Restablecer contraseñas</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Gestionar 2FA</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 border-orange-300">admin</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Configurar autenticación 2FA</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Aprobar solicitudes</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border-purple-300">special</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Registro de nuevos usuarios</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Inventario -->
              <div class="border border-gray-200 rounded-lg p-4 mb-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="activityIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
                    <div>
                      <label class="font-medium text-gray-900">Inventario</label>
                      <p class="text-xs text-gray-600 mt-0.5">Control de stock y medicamentos</p>
                    </div>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    2 de 6
                  </span>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Consultar</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 border-blue-300">read</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Ver stock de medicamentos</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start gap-2 p-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg">
                    <input type="checkbox" class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Registrar</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border-green-300">write</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Agregar medicamentos</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg">
                    <input type="checkbox" class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Actualizar</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border-green-300">write</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Modificar cantidades</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg">
                    <input type="checkbox" class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Eliminar</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 border-red-300">delete</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Eliminar del catálogo</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-blue-500 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Ajustes</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border-purple-300">special</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Ajustes manuales de stock</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-2 p-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg">
                    <input type="checkbox" class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Transferir</label>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border-purple-300">special</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-1">Transferir entre farmacias</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: Seguridad -->
          <div *ngIf="activePermissionsTab === 'security'">
            <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <lucide-icon [img]="shieldIcon" class="w-5 h-5"></lucide-icon>
                Configuración de Seguridad del Rol
              </h4>
              
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label class="text-sm text-gray-600">Nivel de seguridad</label>
                  <div class="mt-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border-red-300">
                      ALTO (HIPAA Compliant)
                    </span>
                  </div>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Requiere aprobación</label>
                  <p class="mt-2 text-sm text-gray-900">Sí</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Puede delegar</label>
                  <p class="mt-2 text-sm text-gray-900">No</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Duración máxima de sesión</label>
                  <p class="mt-2 text-sm text-gray-900">480 minutos (8 horas)</p>
                </div>
              </div>

              <div class="h-px bg-gray-200 mb-6"></div>

              <div>
                <label class="font-medium mb-3 block">Cumplimiento normativo</label>
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 text-green-600"></lucide-icon>
                    <span class="text-sm">HIPAA - Health Insurance Portability and Accountability Act</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 text-green-600"></lucide-icon>
                    <span class="text-sm">HL7 FHIR R4 - Fast Healthcare Interoperability Resources</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 text-green-600"></lucide-icon>
                    <span class="text-sm">FDA 21 CFR Part 11 - Electronic Records and Signatures</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: Auditoría -->
          <div *ngIf="activePermissionsTab === 'audit'">
            
            <!-- Cuadro azul de Historial de cambios -->
            <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="activityIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
                <span class="font-medium text-blue-900">Historial de cambios</span>
              </div>
              <p class="text-sm text-blue-700">Última modificación: 2024-09-15 por Sistema</p>
            </div>

            <!-- Registro de auditoría -->
            <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <lucide-icon [img]="clockIcon" class="w-5 h-5"></lucide-icon>
                Registro de auditoría
              </h4>
              
              <div class="space-y-4">
                <div class="flex items-start gap-3 p-4 border rounded-lg">
                  <div class="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <span class="font-medium text-gray-900">Rol actualizado</span>
                      <span class="text-sm text-gray-500">2024-09-15</span>
                    </div>
                    <p class="text-sm text-gray-600">Modificación de permisos por Admin Sistema</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-3 p-4 border rounded-lg">
                  <div class="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <span class="font-medium text-gray-900">Rol creado</span>
                      <span class="text-sm text-gray-500">2022-06-01</span>
                    </div>
                    <p class="text-sm text-gray-600">Creación inicial del rol en el sistema</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end gap-3 p-6 pt-4 border-t border-gray-200 flex-shrink-0 bg-white">
          <button 
            (click)="closePermissionsModal()"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Cerrar
          </button>
          <button 
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <lucide-icon [img]="saveIcon" class="w-4 h-4 mr-2"></lucide-icon>
            Guardar cambios
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Crear Rol Personalizado -->
    <div *ngIf="isCreateCustomModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" (click)="closeCreateCustomModal()">
      <div class="relative top-10 mx-auto border w-11/12 md:w-3/4 lg:w-1/2 xl:w-2/5 shadow-lg rounded-md bg-white flex flex-col max-h-[90vh]" (click)="$event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 pb-4 border-b border-gray-200 flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <lucide-icon [img]="starIcon" class="w-6 h-6 text-purple-600"></lucide-icon>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Crear Rol Personalizado</h3>
              <p class="text-sm text-gray-600">Crear un rol derivado de "{{ selectedBaseRoleForCustom?.name }}" con permisos ajustados</p>
            </div>
          </div>
          <button (click)="closeCreateCustomModal()" class="text-gray-400 hover:text-gray-600">
            <lucide-icon [img]="xCircleIcon" class="w-6 h-6"></lucide-icon>
          </button>
        </div>

        <!-- Indicador de pasos -->
        <div class="px-6 pt-4">
          <div class="flex items-center gap-2">
            <div [class]="getStepClass(1)"></div>
            <div [class]="getStepClass(2)"></div>
            <div [class]="getStepClass(3)"></div>
            <div [class]="getStepClass(4)"></div>
          </div>
        </div>

        <!-- Modal Content - Scrollable Area -->
        <div class="flex-1 overflow-y-auto px-6 py-6">
          
          <!-- Paso 1: Información básica -->
          <div *ngIf="createCustomStep === 1" class="space-y-4">
            <h3 class="font-medium text-lg">Paso 1: Información Básica</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del rol personalizado *</label>
              <input
                type="text"
                [(ngModel)]="customRoleForm.name"
                placeholder="Ej: Médico Jefe ER"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea
                [(ngModel)]="customRoleForm.description"
                placeholder="Descripción opcional del rol personalizado..."
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none">
              </textarea>
            </div>

            <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                <span class="font-medium text-blue-800">Rol Base: {{ selectedBaseRoleForCustom?.name }}</span>
              </div>
              <p class="text-sm text-blue-700">
                Este rol personalizado heredará todos los permisos del rol base "{{ selectedBaseRoleForCustom?.name }}" y podrá agregar o quitar permisos específicos.
              </p>
            </div>
          </div>

          <!-- Paso 2: Selección de usuario -->
          <div *ngIf="createCustomStep === 2" class="space-y-4">
            <h3 class="font-medium text-lg">Paso 2: Seleccionar Usuario</h3>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ID de Usuario *</label>
                <input
                  type="text"
                  [(ngModel)]="customRoleForm.userId"
                  placeholder="USR-0089"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                <input
                  type="text"
                  [(ngModel)]="customRoleForm.userName"
                  placeholder="Dra. Ana Vargas"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email del Usuario *</label>
              <input
                type="email"
                [(ngModel)]="customRoleForm.userEmail"
                placeholder="ana.vargas@hospital.com"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                <span class="font-medium text-blue-800">Usuario objetivo</span>
              </div>
              <p class="text-sm text-blue-700">
                Este rol personalizado se creará específicamente para el usuario indicado y heredará los permisos del rol base "{{ selectedBaseRoleForCustom?.name }}". En el siguiente paso podrás ajustar los permisos.
              </p>
            </div>
          </div>

          <!-- Paso 3: Ajustar permisos -->
          <div *ngIf="createCustomStep === 3" class="space-y-4">
            <h3 class="font-medium text-lg">Paso 3: Ajustar Permisos</h3>
            <p class="text-sm text-gray-600">
              Selecciona los permisos que deseas agregar o quitar del rol base "{{ selectedBaseRoleForCustom?.name }}"
            </p>

            <!-- Tabs para agregar/quitar permisos -->
            <div class="flex gap-4 mb-4">
              <button class="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg border border-purple-200">
                <span class="text-lg">➕</span>
                <span class="font-medium">Agregar Permisos ({{ permissionsToAdd.length }})</span>
              </button>
              <button class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg border border-gray-200">
                <span class="text-lg">➖</span>
                <span class="font-medium">Quitar Permisos ({{ permissionsToRemove.length }})</span>
              </button>
            </div>

            <p class="text-sm text-gray-600 mb-4">
              Selecciona permisos adicionales que este usuario necesita más allá del rol base
            </p>

            <!-- Prescripciones -->
            <div class="border border-orange-300 bg-orange-50/30 rounded-lg p-4 mb-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="editIcon" class="w-5 h-5 text-orange-600"></lucide-icon>
                  <div>
                    <label class="flex items-center gap-2 font-medium text-gray-900">
                      Prescripciones
                      <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700 border-orange-300">
                        CRÍTICO
                      </span>
                    </label>
                    <p class="text-xs text-gray-600 mt-0.5">Control de recetas médicas y prescripciones</p>
                  </div>
                </div>
                <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  6 disponibles
                </span>
              </div>

              <div class="space-y-3">
                <div class="flex items-start gap-2 p-3 border rounded-lg" 
                     [class]="isPermissionSelected('prescriptions.sign') ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'">
                  <input 
                    type="checkbox" 
                    [checked]="isPermissionSelected('prescriptions.sign')"
                    (change)="togglePermissionToAdd('prescriptions.sign')"
                    class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <label class="text-sm font-medium">Firmar</label>
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border-purple-300">special</span>
                      <span class="text-xs text-gray-500">prescriptions.sign</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">Firma digital de recetas</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-2 p-3 border rounded-lg"
                     [class]="isPermissionSelected('prescriptions.verify') ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'">
                  <input 
                    type="checkbox" 
                    [checked]="isPermissionSelected('prescriptions.verify')"
                    (change)="togglePermissionToAdd('prescriptions.verify')"
                    class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <label class="text-sm font-medium">Verificar</label>
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 border-blue-300">read</span>
                      <span class="text-xs text-gray-500">prescriptions.verify</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">Verificar autenticidad</p>
                  </div>
                </div>

                <div class="flex items-start gap-2 p-3 border rounded-lg"
                     [class]="isPermissionSelected('prescriptions.dispense') ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'">
                  <input 
                    type="checkbox" 
                    [checked]="isPermissionSelected('prescriptions.dispense')"
                    (change)="togglePermissionToAdd('prescriptions.dispense')"
                    class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <label class="text-sm font-medium">Dispensar</label>
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border-purple-300">special</span>
                      <span class="text-xs text-gray-500">prescriptions.dispense</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">Registrar dispensación (SoD)</p>
                  </div>
                </div>

                <div class="flex items-start gap-2 p-3 border rounded-lg"
                     [class]="isPermissionSelected('prescriptions.approve') ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'">
                  <input 
                    type="checkbox" 
                    [checked]="isPermissionSelected('prescriptions.approve')"
                    (change)="togglePermissionToAdd('prescriptions.approve')"
                    class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <label class="text-sm font-medium">Aprobar</label>
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border-purple-300">special</span>
                      <span class="text-xs text-gray-500">prescriptions.approve</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">Aprobar prescripciones especiales</p>
                  </div>
                </div>

                <div class="flex items-start gap-2 p-3 border rounded-lg"
                     [class]="isPermissionSelected('prescriptions.delete') ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'">
                  <input 
                    type="checkbox" 
                    [checked]="isPermissionSelected('prescriptions.delete')"
                    (change)="togglePermissionToAdd('prescriptions.delete')"
                    class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <label class="text-sm font-medium">Eliminar</label>
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 border-red-300">delete</span>
                      <span class="text-xs text-gray-500">prescriptions.delete</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">Eliminar borradores</p>
                  </div>
                </div>

                <div class="flex items-start gap-2 p-3 border rounded-lg"
                     [class]="isPermissionSelected('prescriptions.review_all') ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'">
                  <input 
                    type="checkbox" 
                    [checked]="isPermissionSelected('prescriptions.review_all')"
                    (change)="togglePermissionToAdd('prescriptions.review_all')"
                    class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <label class="text-sm font-medium">Revisar todas</label>
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 border-orange-300">admin</span>
                      <span class="text-xs text-gray-500">prescriptions.review_all</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">Acceso a todas las recetas</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pacientes -->
            <div class="border border-orange-300 bg-orange-50/30 rounded-lg p-4 mb-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="userIcon" class="w-5 h-5 text-orange-600"></lucide-icon>
                  <div>
                    <label class="flex items-center gap-2 font-medium text-gray-900">
                      Pacientes
                      <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700 border-orange-300">
                        CRÍTICO
                      </span>
                    </label>
                    <p class="text-xs text-gray-600 mt-0.5">Acceso a datos protegidos de salud (PHI/HIPAA)</p>
                  </div>
                </div>
                <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  3 disponibles
                </span>
              </div>

              <div class="space-y-3">
                <div class="flex items-start gap-2 p-3 border rounded-lg"
                     [class]="isPermissionSelected('patients.export') ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'">
                  <input 
                    type="checkbox" 
                    [checked]="isPermissionSelected('patients.export')"
                    (change)="togglePermissionToAdd('patients.export')"
                    class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <label class="text-sm font-medium">Exportar PHI</label>
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 border-purple-300">special</span>
                      <span class="text-xs text-gray-500">patients.export</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">Exportar datos protegidos</p>
                  </div>
                </div>

                <div class="flex items-start gap-2 p-3 border rounded-lg"
                     [class]="isPermissionSelected('patients.delete') ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'">
                  <input 
                    type="checkbox" 
                    [checked]="isPermissionSelected('patients.delete')"
                    (change)="togglePermissionToAdd('patients.delete')"
                    class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <label class="text-sm font-medium">Eliminar</label>
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 border-red-300">delete</span>
                      <span class="text-xs text-gray-500">patients.delete</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">Eliminar registros (soft delete)</p>
                  </div>
                </div>

                <div class="flex items-start gap-2 p-3 border rounded-lg"
                     [class]="isPermissionSelected('patients.merge') ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'">
                  <input 
                    type="checkbox" 
                    [checked]="isPermissionSelected('patients.merge')"
                    (change)="togglePermissionToAdd('patients.merge')"
                    class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <label class="text-sm font-medium">Fusionar</label>
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 border-orange-300">admin</span>
                      <span class="text-xs text-gray-500">patients.merge</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">Fusionar registros duplicados</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Usuarios y Seguridad -->
            <div class="border border-orange-300 bg-orange-50/30 rounded-lg p-4 mb-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="usersIcon" class="w-5 h-5 text-orange-600"></lucide-icon>
                  <div>
                    <label class="flex items-center gap-2 font-medium text-gray-900">
                      Usuarios y Seguridad
                      <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700 border-orange-300">
                        CRÍTICO
                      </span>
                    </label>
                    <p class="text-xs text-gray-600 mt-0.5">Gestión de cuentas y accesos al sistema</p>
                  </div>
                </div>
                <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  4 disponibles
                </span>
              </div>

              <div class="space-y-3">
                <div class="flex items-start gap-2 p-3 border rounded-lg"
                     [class]="isPermissionSelected('users.manage_roles') ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'">
                  <input 
                    type="checkbox" 
                    [checked]="isPermissionSelected('users.manage_roles')"
                    (change)="togglePermissionToAdd('users.manage_roles')"
                    class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <label class="text-sm font-medium">Gestionar roles</label>
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 border-orange-300">admin</span>
                      <span class="text-xs text-gray-500">users.manage_roles</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">Asignar y modificar roles</p>
                  </div>
                </div>

                <div class="flex items-start gap-2 p-3 border rounded-lg"
                     [class]="isPermissionSelected('users.reset_password') ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'">
                  <input 
                    type="checkbox" 
                    [checked]="isPermissionSelected('users.reset_password')"
                    (change)="togglePermissionToAdd('users.reset_password')"
                    class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <label class="text-sm font-medium">Reset password</label>
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 border-orange-300">admin</span>
                      <span class="text-xs text-gray-500">users.reset_password</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">Restablecer contraseñas</p>
                  </div>
                </div>

                <div class="flex items-start gap-2 p-3 border rounded-lg"
                     [class]="isPermissionSelected('users.manage_2fa') ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'">
                  <input 
                    type="checkbox" 
                    [checked]="isPermissionSelected('users.manage_2fa')"
                    (change)="togglePermissionToAdd('users.manage_2fa')"
                    class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <label class="text-sm font-medium">Gestionar 2FA</label>
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 border-orange-300">admin</span>
                      <span class="text-xs text-gray-500">users.manage_2fa</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">Configurar autenticación 2FA</p>
                  </div>
                </div>

                <div class="flex items-start gap-2 p-3 border rounded-lg"
                     [class]="isPermissionSelected('users.delete') ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'">
                  <input 
                    type="checkbox" 
                    [checked]="isPermissionSelected('users.delete')"
                    (change)="togglePermissionToAdd('users.delete')"
                    class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <label class="text-sm font-medium">Eliminar</label>
                      <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 border-red-300">delete</span>
                      <span class="text-xs text-gray-500">users.delete</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">Desactivar cuentas</p>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="permissionsToAdd.length === 0 && permissionsToRemove.length === 0" class="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-4 h-4 text-orange-600"></lucide-icon>
                <span class="font-medium text-orange-800">Sin cambios de permisos</span>
              </div>
              <p class="text-sm text-orange-700">
                Debes agregar o quitar al menos un permiso para crear un rol personalizado. Si no necesitas cambios, asigna directamente el rol base al usuario.
              </p>
            </div>
          </div>

          <!-- Paso 4: Justificación y vigencia -->
          <div *ngIf="createCustomStep === 4" class="space-y-4">
            <h3 class="font-medium text-lg">Paso 4: Justificación y Vigencia</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Justificación * (mínimo 20 caracteres)</label>
              <textarea
                [(ngModel)]="customRoleForm.justification"
                placeholder="Descripción detallada de por qué este usuario necesita este rol personalizado...&#10;&#10;Ejemplo: Médico jefe de sala de emergencias requiere capacidad de anular alertas clínicas en situaciones críticas de vida o muerte donde el juicio clínico prevalece sobre alertas automatizadas del sistema."
                rows="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none">
              </textarea>
              <p class="text-xs text-gray-600 mt-1">
                Caracteres: {{ customRoleForm.justification.length }} / 20 mínimo
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Vigencia</label>
              <div class="flex items-center gap-4 mt-2">
                <div class="flex items-center gap-2">
                  <input
                    type="radio"
                    name="validity"
                    [(ngModel)]="customRoleForm.isPermanent"
                    [value]="true"
                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span class="text-sm">Permanente</span>
                </div>
                <div class="flex items-center gap-2">
                  <input
                    type="radio"
                    name="validity"
                    [(ngModel)]="customRoleForm.isPermanent"
                    [value]="false"
                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span class="text-sm">Temporal hasta:</span>
                </div>
              </div>
              <div *ngIf="!customRoleForm.isPermanent" class="mt-2">
                <input
                  type="date"
                  [(ngModel)]="customRoleForm.validUntil"
                  class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                <span class="font-medium text-blue-800">Información importante</span>
              </div>
              <p class="text-sm text-blue-700">
                <span *ngIf="permissionsToAdd.length > 0">⚠️ Este rol agrega permisos. Si incluye permisos críticos, requerirá aprobación antes de activarse.</span>
                <span *ngIf="permissionsToAdd.length === 0">✓ Este rol solo quita permisos. Se activará inmediatamente sin requerir aprobación.</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-between gap-3 p-6 pt-4 border-t border-gray-200 flex-shrink-0 bg-white">
          <div>
            <button 
              *ngIf="createCustomStep > 1"
              (click)="previousStep()"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Anterior
            </button>
          </div>
          <div class="flex gap-3">
            <button 
              (click)="closeCreateCustomModal()"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Cancelar
            </button>
            <button 
              *ngIf="createCustomStep < 4"
              (click)="nextStep()"
              class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Siguiente
            </button>
            <button 
              *ngIf="createCustomStep === 4"
              (click)="createCustomRoleSubmit()"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <lucide-icon [img]="plusIcon" class="w-4 h-4 mr-2"></lucide-icon>
              Crear Rol Personalizado
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RolesComponent implements OnInit {
  // Icons
  shieldIcon = Shield;
  usersIcon = Users;
  checkCircle2Icon = CheckCircle2;
  alertTriangleIcon = AlertTriangle;
  starIcon = Star;
  eyeIcon = Eye;
  settingsIcon = Settings;
  plusIcon = Plus;
  moreVerticalIcon = MoreVertical;
  editIcon = Edit;
  xCircleIcon = XCircle;
  lockIcon = Lock;
  activityIcon = Activity;
  clockIcon = Clock;
  saveIcon = Save;
  userIcon = User;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Seguridad y usuarios', route: '/seguridad' },
    { label: 'Roles y permisos', route: '/seguridad/roles' }
  ];

  // Active tab
  activeTab = 'base';

  // Tab configuration
  get tabs() {
    return [
      { id: 'base', label: 'Roles Base', icon: this.shieldIcon, count: this.getBaseRoles().length },
      { id: 'custom', label: 'Roles Personalizados', icon: this.starIcon, count: this.getCustomRoles().length },
      { id: 'pending', label: 'Pendientes', icon: this.alertTriangleIcon, count: this.pendingRoles.length }
    ];
  }

  // Roles pendientes de aprobación
  pendingRoles: any[] = [];

  // Mock data
  roles: Role[] = [
    // Roles Base
    {
      id: "ROLE-001",
      name: "Administrador",
      code: "ADMIN_BACKUP_IT",
      description: "Acceso total al sistema. Gestión de usuarios, configuración y auditoría",
      usersCount: 2,
      derivedCount: 0,
      lastModified: "2024-09-15",
      status: "active",
      type: "base"
    },
    {
      id: "ROLE-002",
      name: "Médico Jefe ER",
      code: "CHIEF_DOCTOR_ER",
      description: "Médico jefe de emergencias. Supervisión y aprobación de casos críticos",
      usersCount: 1,
      derivedCount: 2,
      lastModified: "2024-08-20",
      status: "active",
      type: "base"
    },
    {
      id: "ROLE-003",
      name: "Farmacéutico Investigador",
      code: "PHARMACIST_RESEARCH",
      description: "Farmacéutico especializado en investigación y desarrollo de protocolos",
      usersCount: 1,
      derivedCount: 2,
      lastModified: "2024-07-30",
      status: "active",
      type: "base"
    },
    {
      id: "ROLE-004",
      name: "Médico",
      code: "DOCTOR",
      description: "Profesional médico. Prescripción de recetas, acceso a historias clínicas",
      usersCount: 42,
      derivedCount: 3,
      lastModified: "2024-08-20",
      status: "active",
      type: "base"
    },
    {
      id: "ROLE-005",
      name: "Farmacéutico",
      code: "PHARMACIST",
      description: "Profesional farmacéutico. Dispensación, verificación de recetas, gestión de inventario",
      usersCount: 11,
      derivedCount: 1,
      lastModified: "2024-07-30",
      status: "active",
      type: "base"
    },
    // Roles Personalizados
    {
      id: "ROLE-CUSTOM-001",
      name: "Admin Personalizado TI",
      code: "ADMIN_BACKUP_IT",
      description: "Administrador con permisos específicos para TI y respaldos",
      usersCount: 1,
      derivedCount: 0,
      lastModified: "2024-10-01",
      status: "active",
      type: "custom"
    },
    {
      id: "ROLE-CUSTOM-002",
      name: "Médico Jefe ER",
      code: "CHIEF_DOCTOR_ER",
      description: "Médico jefe especializado en emergencias con permisos extendidos",
      usersCount: 1,
      derivedCount: 1,
      lastModified: "2024-09-28",
      status: "active",
      type: "custom"
    },
    {
      id: "ROLE-CUSTOM-003",
      name: "Farmacéutico Investigador",
      code: "PHARMACIST_RESEARCH",
      description: "Farmacéutico con permisos de investigación y análisis avanzado",
      usersCount: 1,
      derivedCount: 2,
      lastModified: "2024-09-15",
      status: "active",
      type: "custom"
    }
  ];

  ngOnInit() {
    // Initialize component
  }

  get stats() {
    const baseRoles = this.roles.filter(r => r.type === 'base').length;
    const customRoles = this.roles.filter(r => r.type === 'custom').length;
    return {
      totalRoles: this.roles.length,
      baseRoles,
      customRoles,
      activeRoles: this.roles.filter(r => r.status === 'active').length,
      totalUsers: this.roles.reduce((sum, r) => sum + r.usersCount, 0),
      pendingApprovals: 0
    };
  }

  getTabClass(tabId: string): string {
    return this.activeTab === tabId 
      ? 'bg-white text-blue-600 shadow-sm' 
      : 'text-gray-500 hover:text-gray-700';
  }

  getBaseRoles(): Role[] {
    return this.roles.filter(r => r.type === 'base');
  }

  getCustomRoles(): Role[] {
    return this.roles.filter(r => r.type === 'custom');
  }

  viewPermissions(role: Role) {
    console.log('Viewing permissions for role:', role);
    // Implementar lógica para ver permisos
  }

  createCustomRole(role: Role) {
    this.selectedBaseRoleForCustom = role;
    this.createCustomStep = 1;
    this.customRoleForm = {
      name: `${role.name} Personalizado`,
      description: '',
      userId: '',
      userName: '',
      userEmail: '',
      justification: '',
      validUntil: '',
      isPermanent: true
    };
    this.permissionsToAdd = [];
    this.permissionsToRemove = [];
    this.isCreateCustomModalOpen = true;
  }

  getBaseRoleName(role: Role): string {
    const baseRoleMap: { [key: string]: string } = {
      'ADMIN_BACKUP_IT': 'Administrador',
      'CHIEF_DOCTOR_ER': 'Médico Jefe',
      'PHARMACIST_RESEARCH': 'Farmacéutico'
    };
    return baseRoleMap[role.code] || 'Administrador';
  }

  getUserForRole(role: Role): string {
    const userMap: { [key: string]: string } = {
      'ADMIN_BACKUP_IT': 'Carlos Rojas Méndez',
      'CHIEF_DOCTOR_ER': 'Dra. Ana Vargas Solís',
      'PHARMACIST_RESEARCH': 'Lic. Marco Solís Castro'
    };
    return userMap[role.code] || 'Usuario Asignado';
  }

  getUserEmailForRole(role: Role): string {
    const emailMap: { [key: string]: string } = {
      'ADMIN_BACKUP_IT': 'carlos@hospital.com',
      'CHIEF_DOCTOR_ER': 'ana.vargas@hospital.com',
      'PHARMACIST_RESEARCH': 'marco.solis@hospital.com'
    };
    return emailMap[role.code] || 'usuario@hospital.com';
  }

  getAdjustmentsCount(role: Role): number {
    const adjustmentMap: { [key: string]: number } = {
      'ADMIN_BACKUP_IT': 2,
      'CHIEF_DOCTOR_ER': 1,
      'PHARMACIST_RESEARCH': 2
    };
    return adjustmentMap[role.code] || 0;
  }

  getAdditionsCount(role: Role): number {
    const additionMap: { [key: string]: number } = {
      'ADMIN_BACKUP_IT': 0,
      'CHIEF_DOCTOR_ER': 1,
      'PHARMACIST_RESEARCH': 2
    };
    return additionMap[role.code] || 0;
  }

  getVigencia(role: Role): string {
    const vigenciaMap: { [key: string]: string } = {
      'ADMIN_BACKUP_IT': 'Permanente',
      'CHIEF_DOCTOR_ER': 'Permanente',
      'PHARMACIST_RESEARCH': 'Hasta 2025-12-31'
    };
    return vigenciaMap[role.code] || 'Permanente';
  }

  viewDetails(role: Role) {
    console.log('Viewing details for role:', role);
    // Implementar lógica para ver detalles
  }

  removeRole(role: Role) {
    if (confirm(`¿Está seguro de eliminar el rol personalizado "${role.name}"? Esta acción no se puede deshacer.`)) {
      // Encontrar el índice del rol en la lista
      const index = this.roles.findIndex(r => r.id === role.id);
      
      if (index > -1) {
        // Eliminar el rol de la lista
        this.roles.splice(index, 1);
        alert(`Rol "${role.name}" eliminado exitosamente`);
      }
    }
  }

  // Modal de permisos
  isPermissionsModalOpen = false;
  selectedRoleForPermissions: Role | null = null;
  activePermissionsTab = 'permissions';

  // Modal de crear rol personalizado
  isCreateCustomModalOpen = false;
  selectedBaseRoleForCustom: Role | null = null;
  createCustomStep = 1;
  customRoleForm = {
    name: '',
    description: '',
    userId: '',
    userName: '',
    userEmail: '',
    justification: '',
    validUntil: '',
    isPermanent: true
  };
  permissionsToAdd: string[] = [];
  permissionsToRemove: string[] = [];

  openPermissionsModal(role: Role) {
    this.selectedRoleForPermissions = role;
    this.activePermissionsTab = 'permissions';
    this.isPermissionsModalOpen = true;
  }

  closePermissionsModal() {
    this.isPermissionsModalOpen = false;
    this.selectedRoleForPermissions = null;
  }

  getPermissionsTabClass(tab: string): string {
    return this.activePermissionsTab === tab 
      ? 'border-blue-600 text-blue-600 border-b-2 py-2 px-1 text-sm font-medium flex items-center'
      : 'border-transparent text-gray-500 hover:text-gray-700 py-2 px-1 text-sm font-medium cursor-pointer flex items-center';
  }

  closeCreateCustomModal() {
    this.isCreateCustomModalOpen = false;
    this.selectedBaseRoleForCustom = null;
  }

  nextStep() {
    if (this.createCustomStep < 4) {
      this.createCustomStep++;
    }
  }

  previousStep() {
    if (this.createCustomStep > 1) {
      this.createCustomStep--;
    }
  }

  getStepClass(step: number): string {
    return this.createCustomStep >= step ? 'flex-1 h-2 rounded bg-blue-500' : 'flex-1 h-2 rounded bg-gray-200';
  }

  togglePermissionToAdd(permission: string) {
    const index = this.permissionsToAdd.indexOf(permission);
    if (index > -1) {
      this.permissionsToAdd.splice(index, 1);
    } else {
      this.permissionsToAdd.push(permission);
    }
  }

  togglePermissionToRemove(permission: string) {
    const index = this.permissionsToRemove.indexOf(permission);
    if (index > -1) {
      this.permissionsToRemove.splice(index, 1);
    } else {
      this.permissionsToRemove.push(permission);
    }
  }

  isPermissionSelected(permission: string): boolean {
    return this.permissionsToAdd.includes(permission);
  }

  approveRole(pendingRole: any) {
    // Crear el rol personalizado aprobado
    const approvedRole: Role = {
      id: `ROLE-CUSTOM-${Date.now()}`,
      name: pendingRole.name,
      code: pendingRole.name.toUpperCase().replace(/\s+/g, '_'),
      description: `Rol personalizado derivado de ${pendingRole.baseRole}`,
      usersCount: 1,
      derivedCount: 0,
      lastModified: new Date().toISOString().split('T')[0],
      status: 'active',
      type: 'custom'
    };

    // Agregar a roles personalizados
    this.roles.push(approvedRole);

    // Remover de pendientes
    const index = this.pendingRoles.indexOf(pendingRole);
    if (index > -1) {
      this.pendingRoles.splice(index, 1);
    }

    alert(`Rol "${pendingRole.name}" aprobado exitosamente`);
  }

  rejectRole(pendingRole: any) {
    if (confirm(`¿Está seguro de rechazar el rol "${pendingRole.name}"? Esta acción no se puede deshacer.`)) {
      // Remover de pendientes (desaparece completamente)
      const index = this.pendingRoles.indexOf(pendingRole);
      if (index > -1) {
        this.pendingRoles.splice(index, 1);
      }

      alert(`Rol "${pendingRole.name}" rechazado`);
    }
  }

  createCustomRoleSubmit() {
    // Validaciones
    if (!this.customRoleForm.name.trim()) {
      alert('Debe proporcionar un nombre para el rol');
      return;
    }
    if (!this.customRoleForm.userId.trim() || !this.customRoleForm.userName.trim() || !this.customRoleForm.userEmail.trim()) {
      alert('Debe seleccionar un usuario');
      return;
    }
    if (this.permissionsToAdd.length === 0 && this.permissionsToRemove.length === 0) {
      alert('Debe agregar o quitar al menos un permiso');
      return;
    }
    if (!this.customRoleForm.justification.trim() || this.customRoleForm.justification.length < 20) {
      alert('Debe proporcionar una justificación detallada (mínimo 20 caracteres)');
      return;
    }

    // Crear el rol pendiente de aprobación
    const pendingRole = {
      id: `PENDING-${Date.now()}`,
      name: this.customRoleForm.name,
      baseRole: this.selectedBaseRoleForCustom?.name,
      userId: this.customRoleForm.userId,
      userName: this.customRoleForm.userName,
      userEmail: this.customRoleForm.userEmail,
      permissionsAdded: [...this.permissionsToAdd],
      permissionsRemoved: [...this.permissionsToRemove],
      justification: this.customRoleForm.justification,
      validUntil: this.customRoleForm.isPermanent ? null : this.customRoleForm.validUntil,
      createdBy: 'Administrador del Sistema',
      createdDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    // Agregar a roles pendientes
    this.pendingRoles.push(pendingRole);

    alert(`Rol personalizado "${this.customRoleForm.name}" enviado para aprobación`);
    this.closeCreateCustomModal();
  }
}