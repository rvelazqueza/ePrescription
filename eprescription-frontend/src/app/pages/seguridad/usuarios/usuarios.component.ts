import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  LucideAngularModule, 
  Users, 
  Shield, 
  Search, 
  Edit, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  User,
  AlertTriangle,
  Plus,
  Filter,
  Download,
  MoreVertical,
  Save,
  Activity,
  Clock,
  Star,
  Key
} from 'lucide-angular';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';

interface Usuario {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  lastLogin: string;
  status: 'active' | 'blocked' | 'inactive';
  twoFactorEnabled: boolean;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  styles: [`
    @keyframes slide-in-right {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .animate-slide-in-right {
      animation: slide-in-right 0.3s ease-out;
    }
  `],
  template: `
    <app-page-layout 
      [title]="'Gestión de Usuarios'"
      [description]="'Control de acceso y credenciales del sistema • HIPAA/FDA/FHIR Compliant'"
      [icon]="usersIcon"
      [breadcrumbItems]="breadcrumbItems"
      [hasActionButton]="true"
      [headerGradient]="'from-red-600 via-red-500 to-red-700'"
      [showCreateUserButton]="true"
      [createUserButtonClick]="createUserButtonClickHandler">

      <!-- Content -->
      <div class="space-y-6">

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="p-6">
            <div class="flex gap-4 flex-wrap">
              <div class="flex-1 min-w-[300px] relative">
                <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
                <input
                  type="text"
                  placeholder="Buscar por nombre, usuario o email..."
                  [(ngModel)]="searchTerm"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select 
                [(ngModel)]="roleFilter"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">Todos los roles</option>
                <option value="Administrador">Administrador</option>
                <option value="Médico">Médico</option>
                <option value="Farmacéutico">Farmacéutico</option>
                <option value="Médico Jefe">Médico Jefe</option>
                <option value="Administrativo">Administrativo</option>
              </select>
              
              <select 
                [(ngModel)]="statusFilter"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="blocked">Bloqueados</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Usuarios del Sistema</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email/Teléfono</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último acceso</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2FA</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let user of filteredUsers" class="hover:bg-gray-50 cursor-pointer" (dblclick)="editUser(user)">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <lucide-icon [img]="userIcon" class="w-5 h-5 text-red-600"></lucide-icon>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">{{ user.fullName }}</p>
                        <p class="text-sm text-gray-600">{{ '@' + user.username }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm">
                      <p class="text-gray-900">{{ user.email }}</p>
                      <p class="text-gray-600">{{ user.phone }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ user.department }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm">
                      <p class="text-gray-900">{{ getDatePart(user.lastLogin) }}</p>
                      <p class="text-gray-600">{{ getTimePart(user.lastLogin) }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <lucide-icon 
                      [img]="user.twoFactorEnabled ? checkCircle2Icon : xCircleIcon" 
                      [class]="user.twoFactorEnabled ? 'w-5 h-5 text-green-600' : 'w-5 h-5 text-gray-400'">
                    </lucide-icon>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatusBadgeClass(user.status)">
                      {{ getStatusText(user.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      (click)="editUser(user)"
                      class="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors">
                      <lucide-icon [img]="editIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </app-page-layout>

    <!-- Blue Alert - Top Right Corner -->
    <div *ngIf="showAlert" class="fixed top-4 right-4 z-50 max-w-sm">
      <div class="bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg border border-blue-600 animate-slide-in-right">
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-3">
            <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-white mt-0.5 flex-shrink-0"></lucide-icon>
            <p class="text-sm font-medium">{{ alertMessage }}</p>
          </div>
          <button (click)="hideAlert()" class="ml-3 text-white hover:text-blue-200 transition-colors">
            <lucide-icon [img]="xCircleIcon" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Edición de Usuario -->
    <div *ngIf="isEditModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" (click)="closeModal()">
      <div class="relative top-20 mx-auto border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white flex flex-col max-h-[80vh]" (click)="$event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-5 pb-4 border-b border-gray-200 flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <lucide-icon [img]="userIcon" class="w-6 h-6 text-red-600"></lucide-icon>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Editar Usuario</h3>
              <p class="text-sm text-gray-600">Gestión completa de usuario • ID: {{ selectedUser?.id }}</p>
            </div>
          </div>
          <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
            <lucide-icon [img]="xCircleIcon" class="w-6 h-6"></lucide-icon>
          </button>
        </div>

        <!-- Tabs -->
        <div class="px-5 pt-4 flex-shrink-0">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
              <button 
                (click)="setActiveTab('informacion')"
                [class]="getTabClass('informacion')">
                Información
              </button>
              <button 
                (click)="setActiveTab('rol')"
                [class]="getTabClass('rol')">
                Rol
              </button>
              <button 
                (click)="setActiveTab('permisos')"
                [class]="getTabClass('permisos')">
                Permisos
              </button>
              <button 
                (click)="setActiveTab('seguridad')"
                [class]="getTabClass('seguridad')">
                Seguridad
              </button>
              <button 
                (click)="setActiveTab('auditoria')"
                [class]="getTabClass('auditoria')">
                Auditoría
              </button>
            </nav>
          </div>
        </div>

        <!-- Modal Content - Scrollable Area -->
        <div class="flex-1 overflow-y-auto px-5 py-6">
          
          <!-- TAB: Información -->
          <div *ngIf="activeModalTab === 'informacion'">
            <!-- Card de Información de Seguridad -->
            <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
                <span class="font-medium text-gray-900">Los campos de identificación personal (nombre, cédula) no son editables por seguridad. Para cambios, contacte al administrador del sistema.</span>
              </div>
            </div>

            <!-- Información Personal -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre completo *</label>
                <input
                  type="text"
                  [(ngModel)]="editForm.fullName"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dr. Juan Pérez"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre de usuario</label>
                <input
                  type="text"
                  [value]="selectedUser?.username"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
                <p class="text-xs text-gray-500 mt-1">Los campos de identificación personal no son editables por seguridad</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  [(ngModel)]="editForm.email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="juan.perez{{ '@' }}hospital.com"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                <input
                  type="tel"
                  [(ngModel)]="editForm.phone"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+506 8888-9999"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                <select
                  [(ngModel)]="editForm.department"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="Consulta Externa">Consulta Externa</option>
                  <option value="Farmacia Central">Farmacia Central</option>
                  <option value="Sistemas">Sistemas</option>
                  <option value="Cardiología">Cardiología</option>
                  <option value="Dirección Médica">Dirección Médica</option>
                  <option value="Administración">Administración</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                <select
                  [(ngModel)]="editForm.role"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="Médico">Medicina General</option>
                  <option value="Farmacéutico">Farmacia Clínica</option>
                  <option value="Administrador">TI</option>
                  <option value="Médico Jefe">Medicina Familiar</option>
                  <option value="Administrativo">Admisiones</option>
                </select>
              </div>
            </div>

            <!-- Código profesional y fecha de creación -->
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Código profesional</label>
                <input
                  type="text"
                  value="MED-123456"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de creación</label>
                <input
                  type="text"
                  value="2023-02-10"
                  disabled
                  class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <!-- Estadísticas de Acceso -->
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Estadísticas de Acceso</h4>
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p class="text-lg font-semibold text-gray-900">567</p>
                  <p class="text-xs text-gray-600">Total de accesos</p>
                </div>
                <div>
                  <p class="text-lg font-semibold text-gray-900">0</p>
                  <p class="text-xs text-gray-600">Intentos fallidos</p>
                </div>
                <div>
                  <p class="text-lg font-semibold text-gray-900">2025-10-08 09:30</p>
                  <p class="text-xs text-gray-600">Último acceso</p>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: Rol -->
          <div *ngIf="activeModalTab === 'rol'">
            <!-- Sistema Multi-Rol -->
            <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="shieldIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
                <h4 class="text-sm font-medium text-gray-900">Sistema Multi-Rol:</h4>
              </div>
              <p class="text-sm text-gray-600">Puede asignar múltiples roles al usuario. El rol primario será el predeterminado al iniciar sesión.</p>
            </div>

            <!-- Rol Primario -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Rol Primario</h4>
              <p class="text-sm text-gray-600 mb-4">Rol predeterminado al iniciar sesión</p>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Rol primario *</label>
                <div class="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <lucide-icon [img]="userIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
                  <span class="font-medium text-gray-900">Médico</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">Solo se muestran roles asignados al usuario. Asigne roles primero en la sección inferior.</p>
              </div>
            </div>

            <!-- Roles Asignados -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Roles Asignados</h4>
              <p class="text-sm text-gray-600 mb-4">Todos los roles que el usuario puede utilizar (incluye el rol primario)</p>
              
              <div class="mb-4">
                <div class="flex items-center gap-2 mb-3">
                  <lucide-icon [img]="shieldIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
                  <span class="font-medium text-blue-600">Roles Base (5)</span>
                </div>
                
                <div class="space-y-3">
                  <div *ngFor="let role of availableRoles" class="flex items-center justify-between p-3 border rounded-lg" 
                       [class]="role.assigned ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'">
                    <div class="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        [checked]="role.assigned"
                        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="font-medium text-gray-900">{{ role.name }}</span>
                          <span *ngIf="role.isPrimary" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            <lucide-icon [img]="starIcon" class="w-3 h-3 mr-1"></lucide-icon>
                            Rol primario
                          </span>
                        </div>
                        <p class="text-sm text-gray-600">{{ role.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div class="flex items-center gap-2 mb-2">
                  <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
                  <span class="font-medium text-gray-900">No hay roles personalizados disponibles.</span>
                </div>
                <p class="text-sm text-gray-600">Puede crear roles personalizados desde la página de Roles y Permisos.</p>
              </div>

              <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div class="flex items-center gap-2 mb-2">
                  <lucide-icon [img]="shieldIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
                  <span class="font-medium text-gray-900">Multi-Rol:</span>
                </div>
                <p class="text-sm text-gray-600">El usuario podrá cambiar entre sus roles asignados durante la sesión sin necesidad de volver a autenticarse.</p>
              </div>
            </div>

            <!-- Estado del Usuario -->
            <div class="mt-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Estado del Usuario</h4>
              <p class="text-sm text-gray-600 mb-4">Gestión del estado de la cuenta</p>
              
              <!-- Estado Actual -->
              <div class="mb-4 p-4 border border-gray-200 rounded-lg">
                <span class="font-medium text-gray-900">Estado actual</span>
                <p class="text-sm text-gray-600">Usuario activo y operativo</p>
              </div>
              
              <!-- Botón para cambiar estado -->
              <button 
                (click)="toggleChangeStatusSection()"
                class="w-full p-3 border border-gray-300 rounded-lg text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                <span class="font-medium text-gray-900">Cambiar estado de usuario</span>
              </button>

              <!-- Sección expandible para cambiar estado -->
              <div *ngIf="showChangeStatusSection" class="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <!-- Nuevo Estado -->
                <div class="mb-4">
                  <h5 class="font-medium text-gray-900 mb-2">Nuevo estado</h5>
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="checkCircle2Icon" class="w-5 h-5 text-green-600"></lucide-icon>
                    <select 
                      [(ngModel)]="newUserStatus"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                      <option value="blocked">Bloqueado</option>
                    </select>
                  </div>
                </div>

                <!-- Justificación -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-900 mb-2">
                    Justificación (obligatorio) *
                  </label>
                  <textarea
                    [(ngModel)]="statusChangeJustification"
                    rows="3"
                    placeholder="Especifique la razón del cambio de estado..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none">
                  </textarea>
                </div>

                <!-- Botones de acción -->
                <div class="flex justify-end gap-3">
                  <button 
                    (click)="cancelStatusChange()"
                    class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Cancelar
                  </button>
                  <button 
                    (click)="confirmStatusChange()"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Confirmar cambio
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: Permisos -->
          <div *ngIf="activeModalTab === 'permisos'">
            <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="shieldIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
                <span class="font-medium text-gray-900">Permisos granulares por módulo.</span>
              </div>
              <p class="text-sm text-gray-600">Los permisos marcados se aplicarán al guardar. Cambios requieren justificación en auditoría.</p>
            </div>

            <!-- Prescripciones -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Prescripciones</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium text-gray-900">Crear recetas</span>
                    <p class="text-sm text-gray-600">Puede prescribir medicamentos</p>
                  </div>
                  <input type="checkbox" checked class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium text-gray-900">Firmar recetas</span>
                    <p class="text-sm text-gray-600">Firma digital de prescripciones</p>
                  </div>
                  <input type="checkbox" checked class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium text-gray-900">Aprobar recetas especiales</span>
                    <p class="text-sm text-gray-600">Medicamentos controlados</p>
                  </div>
                  <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium text-gray-900">Ver todas las recetas</span>
                    <p class="text-sm text-gray-600">Incluye recetas de otros médicos</p>
                  </div>
                  <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <!-- Pacientes -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Pacientes</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium text-gray-900">Crear pacientes</span>
                    <p class="text-sm text-gray-600">Registrar nuevos pacientes</p>
                  </div>
                  <input type="checkbox" checked class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium text-gray-900">Ver datos sensibles</span>
                    <p class="text-sm text-gray-600">PHI/Información médica protegida</p>
                  </div>
                  <input type="checkbox" checked class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium text-gray-900">Exportar datos</span>
                    <p class="text-sm text-gray-600">PDF/CSV/Excel</p>
                  </div>
                  <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <!-- Usuarios y Seguridad -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Usuarios y Seguridad</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium text-gray-900">Gestionar usuarios</span>
                    <p class="text-sm text-gray-600">Crear/editar/eliminar usuarios</p>
                  </div>
                  <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium text-gray-900">Gestionar roles</span>
                    <p class="text-sm text-gray-600">Asignar y configurar roles</p>
                  </div>
                  <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium text-gray-900">Aprobar solicitudes</span>
                    <p class="text-sm text-gray-600">Registro de nuevos usuarios</p>
                  </div>
                  <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <!-- Inventario -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Inventario</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium text-gray-900">Gestionar stock</span>
                    <p class="text-sm text-gray-600">Crear/editar medicamentos</p>
                  </div>
                  <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium text-gray-900">Ajustar inventario</span>
                    <p class="text-sm text-gray-600">Modificar cantidades de stock</p>
                  </div>
                  <input type="checkbox" class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: Seguridad -->
          <div *ngIf="activeModalTab === 'seguridad'" class="space-y-6">
            
            <!-- Autenticación Multi-Factor Card -->
            <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Autenticación Multi-Factor (2FA)</h4>
              <p class="text-sm text-gray-600 mb-4">Configuración de seguridad adicional</p>
              
              <div class="flex items-center justify-between">
                <div>
                  <span class="font-medium text-gray-900">2FA Habilitado</span>
                  <p class="text-sm text-gray-600">Usuario protegido con doble factor</p>
                </div>
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="checkCircle2Icon" class="w-5 h-5 text-green-600"></lucide-icon>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" [(ngModel)]="editForm.twoFactorEnabled" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Firma Digital Card -->
            <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">Firma Digital</h4>
              <p class="text-sm text-gray-600 mb-4">Vinculación con BCCR/GAUDI</p>
              
              <div class="mb-4">
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-medium text-gray-900">Estado de vinculación</span>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <lucide-icon [img]="checkCircle2Icon" class="w-3 h-3 mr-1"></lucide-icon>
                    Vinculada
                  </span>
                </div>
                <p class="text-sm text-gray-600">Firma digital vinculada y activa</p>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-sm font-medium text-gray-700">Certificado:</span>
                  <p class="text-sm text-gray-900">MED-123456</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-700">Vigencia:</span>
                  <p class="text-sm text-green-600">Válido hasta 2026-12-31</p>
                </div>
              </div>
            </div>

            <!-- Acciones de Seguridad Card -->
            <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Acciones de Seguridad</h4>
              
              <div class="space-y-3">
                <button class="w-full p-4 border border-gray-300 rounded-lg text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-3">
                  <lucide-icon [img]="keyIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
                  <span class="font-medium text-gray-900">Forzar cambio de contraseña en próximo acceso</span>
                </button>
                
                <button class="w-full p-4 border border-gray-300 rounded-lg text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-3">
                  <lucide-icon [img]="lockIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
                  <span class="font-medium text-gray-900">Resetear configuración 2FA</span>
                </button>
                
                <button class="w-full p-4 border border-red-300 rounded-lg text-left hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center gap-3">
                  <lucide-icon [img]="xCircleIcon" class="w-5 h-5 text-red-600"></lucide-icon>
                  <span class="font-medium text-red-600">Cerrar todas las sesiones activas</span>
                </button>
              </div>
            </div>
          </div>

          <!-- TAB: Auditoría -->
          <div *ngIf="activeModalTab === 'auditoria'">
            <div class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="activityIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
                <span class="font-medium text-gray-900">Registro completo de cambios en este usuario (últimos 30 días)</span>
              </div>
            </div>

            <div class="mb-8">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Historial de Cambios</h4>
              
              <div class="space-y-4">
                <div *ngFor="let audit of auditHistory" class="flex items-start gap-3 p-4 border rounded-lg">
                  <div class="p-2 bg-gray-100 rounded-lg">
                    <lucide-icon [img]="clockIcon" class="w-4 h-4 text-gray-600"></lucide-icon>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <span class="font-medium text-gray-900">{{ audit.action }}</span>
                      <span class="text-xs text-gray-500">{{ audit.user }}</span>
                    </div>
                    <p class="text-sm text-gray-600">{{ audit.description }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ audit.date }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actividad de Sesión -->
            <div>
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Actividad de Sesión</h4>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Sesiones activas:</span>
                  <span class="text-lg font-semibold text-gray-900">2</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Último acceso exitoso:</span>
                  <span class="text-lg font-semibold text-gray-900">2025-10-08 09:30</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Intentos fallidos (últimos 30 días):</span>
                  <span class="text-lg font-semibold text-gray-900">0</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Total de accesos:</span>
                  <span class="text-lg font-semibold text-gray-900">567</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer - Fixed at Bottom -->
        <div class="flex justify-end gap-3 p-5 pt-4 border-t border-gray-200 flex-shrink-0 bg-white">
          <button 
            (click)="closeModal()"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Cancelar
          </button>
          <button 
            (click)="saveUser()"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <lucide-icon [img]="saveIcon" class="w-4 h-4 mr-2"></lucide-icon>
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  `
})
export class UsuariosComponent implements OnInit {
  // Icons
  usersIcon = Users;
  shieldIcon = Shield;
  searchIcon = Search;
  editIcon = Edit;
  eyeIcon = Eye;
  checkCircle2Icon = CheckCircle2;
  xCircleIcon = XCircle;
  lockIcon = Lock;
  userIcon = User;
  alertTriangleIcon = AlertTriangle;
  plusIcon = Plus;
  filterIcon = Filter;
  downloadIcon = Download;
  moreVerticalIcon = MoreVertical;
  saveIcon = Save;
  activityIcon = Activity;
  clockIcon = Clock;
  starIcon = Star;
  keyIcon = Key;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Seguridad y usuarios', route: '/seguridad' },
    { label: 'Usuarios', route: '/seguridad/usuarios' }
  ];

  // Filters
  searchTerm = '';
  roleFilter = 'all';
  statusFilter = 'all';

  // Mock data
  usuarios: Usuario[] = [
    {
      id: "USR-7890",
      username: "juan.perez",
      fullName: "Dr. Juan Pérez",
      email: "juan.perez@hospital.com",
      phone: "+506 8888-9999",
      role: "Médico",
      department: "Consulta Externa",
      lastLogin: "2025-10-08 09:30",
      status: "active",
      twoFactorEnabled: true
    },
    {
      id: "USR-0023",
      username: "carlos.martinez",
      fullName: "Dr. Carlos Andrés Martínez López",
      email: "carlos.martinez@hospital.com",
      phone: "+1 555-0123",
      role: "Médico",
      department: "Consulta Externa",
      lastLogin: "2024-10-01 14:35",
      status: "active",
      twoFactorEnabled: true
    },
    {
      id: "USR-0045",
      username: "ana.garcia",
      fullName: "Farmacéutica Ana María García Pérez",
      email: "ana.garcia@hospital.com",
      phone: "+1 555-0124",
      role: "Farmacéutico",
      department: "Farmacia Central",
      lastLogin: "2024-10-01 14:28",
      status: "active",
      twoFactorEnabled: true
    },
    {
      id: "USR-0001",
      username: "admin.sistema",
      fullName: "Administrador del Sistema",
      email: "admin@hospital.com",
      phone: "+1 555-0100",
      role: "Administrador",
      department: "Sistemas",
      lastLogin: "2024-10-01 13:45",
      status: "active",
      twoFactorEnabled: true
    }
  ];

  // Alert state
  showAlert = false;
  alertMessage = '';

  // Handler para el botón de crear usuario
  createUserButtonClickHandler = () => {
    this.showCreateUserAlert();
  };

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialize component
  }

  navigateToRegistro() {
    this.router.navigate(['/seguridad/usuarios/registro']);
  }

  showCreateUserAlert() {
    this.alertMessage = 'Redirigiendo al formulario de registro de nuevo usuario...';
    this.showAlert = true;
    
    // Navigate to registration after showing alert
    setTimeout(() => {
      this.navigateToRegistro();
      this.hideAlert();
    }, 2000);
  }

  hideAlert() {
    this.showAlert = false;
    this.alertMessage = '';
  }

  get stats() {
    return {
      total: this.usuarios.length,
      active: this.usuarios.filter(u => u.status === 'active').length,
      blocked: this.usuarios.filter(u => u.status === 'blocked').length,
      with2FA: this.usuarios.filter(u => u.twoFactorEnabled).length
    };
  }

  get filteredUsers() {
    return this.usuarios.filter(user => {
      const matchesSearch = 
        user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = this.roleFilter === 'all' || user.role === this.roleFilter;
      const matchesStatus = this.statusFilter === 'all' || user.status === this.statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  getDatePart(dateTime: string): string {
    return dateTime.split(' ')[0];
  }

  getTimePart(dateTime: string): string {
    return dateTime.split(' ')[1];
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200';
      case 'blocked':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200';
      case 'inactive':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Activo';
      case 'blocked': return 'Bloqueado';
      case 'inactive': return 'Inactivo';
      default: return 'Desconocido';
    }
  }

  // Modal state
  isEditModalOpen = false;
  selectedUser: Usuario | null = null;
  activeModalTab = 'informacion';
  showChangeStatusSection = false;
  newUserStatus = 'active';
  statusChangeJustification = '';
  editForm = {
    fullName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    twoFactorEnabled: false,
    status: 'active' as 'active' | 'blocked' | 'inactive'
  };

  // Mock data para el modal
  auditHistory = [
    {
      action: 'Cambio de departamento',
      description: "De 'Consulta Externa' a 'Cardiología'",
      date: '2025-10-07 14:30',
      user: 'admin-001'
    },
    {
      action: 'Habilitación de 2FA',
      description: 'Autenticación de dos factores activada',
      date: '2025-10-05 09:15',
      user: 'admin-001'
    },
    {
      action: 'Cambio de rol',
      description: "De 'Médico' a 'Médico Jefe'",
      date: '2025-09-28 11:20',
      user: 'admin-002'
    },
    {
      action: 'Actualización de email',
      description: 'Email modificado',
      date: '2025-09-15 16:45',
      user: 'USR-0023'
    }
  ];

  userPermissions = {
    prescripciones: {
      crear: true,
      firmar: true,
      aprobar: false,
      verTodas: false
    },
    pacientes: {
      crear: true,
      verDatos: true
    }
  };

  availableRoles = [
    {
      id: 'admin',
      name: 'Administrador',
      description: 'Acceso total al sistema. Gestión de usuarios, configuración y auditoría',
      assigned: false
    },
    {
      id: 'medico',
      name: 'Médico',
      description: 'Profesional médico. Prescripción de recetas, acceso a historias clínicas',
      assigned: true,
      isPrimary: true
    },
    {
      id: 'farmaceutico',
      name: 'Farmacéutico',
      description: 'Profesional farmacéutico. Dispensación, verificación de recetas, gestión de inventario',
      assigned: true
    },
    {
      id: 'medico-jefe',
      name: 'Médico Jefe',
      description: 'Médico con funciones de supervisión. Aprobación de prescripciones especiales',
      assigned: true
    }
  ];

  editUser(user: Usuario) {
    this.selectedUser = user;
    this.activeModalTab = 'informacion';
    this.editForm = {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      twoFactorEnabled: user.twoFactorEnabled,
      status: user.status
    };
    this.isEditModalOpen = true;
  }

  setActiveTab(tab: string) {
    this.activeModalTab = tab;
  }

  getTabClass(tab: string): string {
    return this.activeModalTab === tab 
      ? 'border-blue-600 text-blue-600 border-b-2 py-2 px-1 text-sm font-medium'
      : 'border-transparent text-gray-500 hover:text-gray-700 py-2 px-1 text-sm font-medium cursor-pointer';
  }

  closeModal() {
    this.isEditModalOpen = false;
    this.selectedUser = null;
    this.showChangeStatusSection = false;
    this.statusChangeJustification = '';
  }

  toggleChangeStatusSection() {
    this.showChangeStatusSection = !this.showChangeStatusSection;
    if (this.showChangeStatusSection) {
      this.newUserStatus = this.selectedUser?.status || 'active';
      this.statusChangeJustification = '';
    }
  }

  cancelStatusChange() {
    this.showChangeStatusSection = false;
    this.statusChangeJustification = '';
  }

  confirmStatusChange() {
    if (!this.statusChangeJustification.trim()) {
      alert('La justificación es obligatoria para cambiar el estado del usuario');
      return;
    }

    if (this.selectedUser) {
      // Actualizar el estado del usuario
      this.selectedUser.status = this.newUserStatus as 'active' | 'blocked' | 'inactive';
      this.editForm.status = this.newUserStatus as 'active' | 'blocked' | 'inactive';
      
      // Actualizar en la lista principal
      const index = this.usuarios.findIndex(u => u.id === this.selectedUser!.id);
      if (index !== -1) {
        this.usuarios[index].status = this.newUserStatus as 'active' | 'blocked' | 'inactive';
      }

      alert(`Estado del usuario cambiado a: ${this.getStatusText(this.newUserStatus)}`);
      this.showChangeStatusSection = false;
      this.statusChangeJustification = '';
    }
  }

  saveUser() {
    if (this.selectedUser) {
      // Actualizar el usuario en la lista
      const index = this.usuarios.findIndex(u => u.id === this.selectedUser!.id);
      if (index !== -1) {
        this.usuarios[index] = {
          ...this.usuarios[index],
          ...this.editForm
        };
      }
      
      // Mostrar mensaje de éxito (en una implementación real usarías un servicio de notificaciones)
      alert(`Usuario ${this.editForm.fullName} actualizado exitosamente`);
      
      this.closeModal();
    }
  }
}