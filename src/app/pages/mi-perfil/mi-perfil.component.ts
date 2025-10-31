import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
    LucideAngularModule,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Shield,
    Lock,
    Camera,
    Save,
    Eye,
    EyeOff,
    Key,
    Smartphone,
    CheckCircle,
    AlertCircle,
    Upload,
    AlertTriangle,
    Edit,
    X
} from 'lucide-angular';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';
import { BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs.component';

interface UserProfile {
    userId: string;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    specialty: string;
    department: string;
    certifiedId?: string;
    status: 'active' | 'inactive';
    assignedRoles: string[];
    lastLogin: string;
    loginCount: number;
    createdDate: string;
    failedAttempts: number;
    twoFactorEnabled?: boolean;
}

@Component({
    selector: 'app-mi-perfil',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
    template: `
    <app-page-layout 
      [title]="'Mi Perfil'"
      [description]="'Gestiona tu información personal y configuración de seguridad - ' + user.fullName"
      [icon]="userIcon"
      [breadcrumbItems]="breadcrumbItems"
      [hasActionButton]="true"
      [headerGradient]="'from-blue-600 via-indigo-600 to-purple-600'">
      
      <!-- Header Badge -->
      <div slot="action" class="flex gap-2 flex-wrap">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
          <lucide-icon [img]="shieldIcon" class="w-3 h-3 mr-1"></lucide-icon>
          Usuario ID: {{ user.userId }}
        </span>
      </div>
      
      <!-- Content -->
      <div class="space-y-6">
        
        <!-- Tabs Navigation -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                *ngFor="let tab of tabs"
                (click)="activeTab = tab.id"
                [class]="getTabClasses(tab.id)"
                type="button">
                <lucide-icon [img]="tab.icon" class="w-4 h-4 mr-2"></lucide-icon>
                {{ tab.label }}
              </button>
            </nav>
          </div>
        </div>

        <!-- Tab Content: Información Personal -->
        <div *ngIf="activeTab === 'informacion'" class="space-y-6">
          <!-- Información Personal Card -->
          <div class="bg-white rounded-lg shadow-lg">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">Información Personal</h2>
                  <p class="text-sm text-gray-600">Actualiza tu información de perfil y datos de contacto</p>
                </div>
                <div class="flex gap-2">
                  <button
                    *ngIf="!isEditing"
                    (click)="startEditing()"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <lucide-icon [img]="editIcon" class="w-4 h-4 mr-2"></lucide-icon>
                    Editar Perfil
                  </button>
                  <div *ngIf="isEditing" class="flex gap-2">
                    <button
                      (click)="cancelEditing()"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                      <lucide-icon [img]="xIcon" class="w-4 h-4 mr-2"></lucide-icon>
                      Cancelar
                    </button>
                    <button
                      (click)="saveChanges()"
                      [disabled]="isSaving"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                      <lucide-icon [img]="saveIcon" class="w-4 h-4 mr-2"></lucide-icon>
                      {{ isSaving ? 'Guardando...' : 'Guardar cambios' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="p-6 space-y-6">
              <!-- Foto de perfil -->
              <div class="flex items-center gap-6">
                <div class="relative">
                  <div class="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    <img *ngIf="profilePhoto" [src]="profilePhoto" alt="Perfil" class="w-full h-full object-cover" />
                    <lucide-icon *ngIf="!profilePhoto" [img]="userIcon" class="w-12 h-12 text-blue-600"></lucide-icon>
                  </div>
                  <button
                    (click)="fileInput.click()"
                    class="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <lucide-icon [img]="cameraIcon" class="w-4 h-4"></lucide-icon>
                  </button>
                  <input
                    #fileInput
                    type="file"
                    accept="image/*"
                    (change)="onPhotoUpload($event)"
                    class="hidden" />
                </div>
                <div>
                  <h3 class="font-medium mb-1">{{ user.fullName }}</h3>
                  <p class="text-sm text-gray-600 mb-2">{{ user.specialty }}</p>
                  <p class="text-xs text-gray-500 flex items-center">
                    <lucide-icon [img]="uploadIcon" class="w-3 h-3 mr-1"></lucide-icon>
                    Máximo 5MB - JPG, PNG o GIF
                  </p>
                </div>
              </div>

              <div class="border-t border-gray-200 pt-6"></div>

              <!-- Información básica -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Nombre completo *</label>
                  <div class="relative">
                    <lucide-icon [img]="userIcon" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
                    <input
                      type="text"
                      [(ngModel)]="editedData.fullName"
                      [disabled]="!isEditing"
                      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Usuario</label>
                  <input
                    type="text"
                    [value]="user.username"
                    disabled
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500" />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Correo electrónico *</label>
                  <div class="relative">
                    <lucide-icon [img]="mailIcon" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
                    <input
                      type="email"
                      [(ngModel)]="editedData.email"
                      [disabled]="!isEditing"
                      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Teléfono *</label>
                  <div class="relative">
                    <lucide-icon [img]="phoneIcon" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
                    <input
                      type="tel"
                      [(ngModel)]="editedData.phone"
                      [disabled]="!isEditing"
                      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Especialidad</label>
                  <div class="relative">
                    <lucide-icon [img]="briefcaseIcon" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
                    <input
                      type="text"
                      [(ngModel)]="editedData.specialty"
                      [disabled]="!isEditing"
                      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Departamento</label>
                  <div class="relative">
                    <lucide-icon [img]="mapPinIcon" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
                    <input
                      type="text"
                      [(ngModel)]="editedData.department"
                      [disabled]="!isEditing"
                      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Cédula profesional</label>
                  <input
                    type="text"
                    [value]="user.certifiedId || 'No especificada'"
                    disabled
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500" />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Estado de cuenta</label>
                  <div class="flex items-center gap-2">
                    <span [class]="'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + (user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')">
                      {{ user.status === 'active' ? 'Activa' : 'Inactiva' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Roles asignados -->
              <div class="space-y-3">
                <label class="block text-sm font-medium text-gray-700">Roles asignados</label>
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let role of user.assignedRoles" 
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {{ role }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Información de la cuenta -->
          <div class="bg-white rounded-lg shadow-lg">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Información de la cuenta</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Último inicio de sesión</p>
                  <p class="font-medium">{{ user.lastLogin }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Total de inicios de sesión</p>
                  <p class="font-medium">{{ user.loginCount.toLocaleString() }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Cuenta creada</p>
                  <p class="font-medium">{{ user.createdDate }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Intentos fallidos</p>
                  <p class="font-medium">{{ user.failedAttempts }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Content: Seguridad -->
        <div *ngIf="activeTab === 'seguridad'" class="space-y-6">
          <!-- Alert de políticas -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start">
              <lucide-icon [img]="shieldIcon" class="w-5 h-5 text-blue-600 mt-0.5 mr-3"></lucide-icon>
              <div>
                <h3 class="text-sm font-medium text-blue-900">Políticas NIST 800-63B</h3>
                <p class="text-sm text-blue-700 mt-1">
                  Las contraseñas deben tener mínimo 8 caracteres e incluir al menos 3 tipos de caracteres (minúsculas, mayúsculas, números, símbolos).
                </p>
              </div>
            </div>
          </div>

          <!-- Cambiar contraseña -->
          <div class="bg-white rounded-lg shadow-lg">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Cambiar contraseña</h2>
              <p class="text-sm text-gray-600">Actualiza tu contraseña regularmente para mantener tu cuenta segura</p>
            </div>
            <div class="p-6 space-y-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Contraseña actual *</label>
                <div class="relative">
                  <lucide-icon [img]="lockIcon" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
                  <input
                    [type]="showCurrentPassword ? 'text' : 'password'"
                    [(ngModel)]="currentPassword"
                    placeholder="Ingresa tu contraseña actual"
                    class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  <button
                    type="button"
                    (click)="showCurrentPassword = !showCurrentPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <lucide-icon [img]="showCurrentPassword ? eyeOffIcon : eyeIcon" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Nueva contraseña *</label>
                <div class="relative">
                  <lucide-icon [img]="keyIcon" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
                  <input
                    [type]="showNewPassword ? 'text' : 'password'"
                    [(ngModel)]="newPassword"
                    placeholder="Mínimo 8 caracteres"
                    class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  <button
                    type="button"
                    (click)="showNewPassword = !showNewPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <lucide-icon [img]="showNewPassword ? eyeOffIcon : eyeIcon" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
                
                <!-- Indicador de fortaleza -->
                <div *ngIf="newPassword" class="space-y-1">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-600">Fortaleza de la contraseña</span>
                    <span [class]="'font-medium ' + getPasswordStrengthColor()">
                      {{ getPasswordStrengthLabel() }}
                    </span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      [class]="'h-full transition-all duration-300 ' + getPasswordStrengthBg()"
                      [style.width.%]="getPasswordStrength()">
                    </div>
                  </div>
                  <p class="text-xs text-gray-500">
                    Incluye mayúsculas, minúsculas, números y símbolos especiales
                  </p>
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Confirmar nueva contraseña *</label>
                <div class="relative">
                  <lucide-icon [img]="keyIcon" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
                  <input
                    [type]="showConfirmPassword ? 'text' : 'password'"
                    [(ngModel)]="confirmPassword"
                    placeholder="Repite la nueva contraseña"
                    class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  <button
                    type="button"
                    (click)="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <lucide-icon [img]="showConfirmPassword ? eyeOffIcon : eyeIcon" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
              </div>

              <button
                (click)="changePassword()"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <lucide-icon [img]="lockIcon" class="w-4 h-4 mr-2"></lucide-icon>
                Cambiar contraseña
              </button>
            </div>
          </div>

          <!-- Autenticación de dos factores -->
          <div class="bg-white rounded-lg shadow-lg">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Autenticación de dos factores (2FA)</h2>
              <p class="text-sm text-gray-600">Agrega una capa adicional de seguridad a tu cuenta</p>
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div class="flex items-center gap-3">
                  <div [class]="'p-2 rounded-lg ' + (twoFactorEnabled ? 'bg-green-100' : 'bg-gray-100')">
                    <lucide-icon [img]="smartphoneIcon" [class]="'w-5 h-5 ' + (twoFactorEnabled ? 'text-green-600' : 'text-gray-400')"></lucide-icon>
                  </div>
                  <div>
                    <p class="font-medium">
                      {{ twoFactorEnabled ? 'Autenticación habilitada' : 'Autenticación deshabilitada' }}
                    </p>
                    <p class="text-sm text-gray-600">
                      {{ twoFactorEnabled 
                        ? 'Tu cuenta está protegida con verificación en dos pasos'
                        : 'Habilita 2FA para mayor seguridad'
                      }}
                    </p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    [(ngModel)]="twoFactorEnabled"
                    (change)="toggle2FA()"
                    class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div *ngIf="twoFactorEnabled" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <lucide-icon [img]="checkCircleIcon" class="w-5 h-5 text-green-600 mt-0.5"></lucide-icon>
                <div>
                  <p class="text-sm font-medium text-green-900">Autenticación de dos factores activa</p>
                  <p class="text-sm text-green-700 mt-1">
                    Se te solicitará un código de verificación cada vez que inicies sesión desde un nuevo dispositivo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sesiones activas -->
          <div class="bg-white rounded-lg shadow-lg">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Sesiones activas</h2>
              <p class="text-sm text-gray-600">Gestiona dónde has iniciado sesión</p>
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-green-100 rounded-lg">
                    <lucide-icon [img]="checkCircleIcon" class="w-5 h-5 text-green-600"></lucide-icon>
                  </div>
                  <div>
                    <p class="font-medium">Sesión actual</p>
                    <p class="text-sm text-gray-600">Chrome en Windows • Ahora</p>
                  </div>
                </div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  Activa
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Content: Preferencias -->
        <div *ngIf="activeTab === 'preferencias'" class="space-y-6">
          <div class="bg-white rounded-lg shadow-lg">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Preferencias del sistema</h2>
              <p class="text-sm text-gray-600">Personaliza tu experiencia en la plataforma</p>
            </div>
            <div class="p-6 space-y-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium">Notificaciones por correo</p>
                  <p class="text-sm text-gray-600">Recibe actualizaciones importantes por email</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    [(ngModel)]="emailNotifications"
                    class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div class="border-t border-gray-200 pt-6"></div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium">Notificaciones push</p>
                  <p class="text-sm text-gray-600">Recibe notificaciones en tiempo real</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    [(ngModel)]="pushNotifications"
                    class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div class="border-t border-gray-200 pt-6"></div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium">Alertas de seguridad</p>
                  <p class="text-sm text-gray-600">Notificaciones sobre actividad sospechosa</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    [(ngModel)]="securityAlerts"
                    class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-page-layout>
  `
})
export class MiPerfilComponent implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    // Icons
    userIcon = User;
    mailIcon = Mail;
    phoneIcon = Phone;
    mapPinIcon = MapPin;
    briefcaseIcon = Briefcase;
    shieldIcon = Shield;
    lockIcon = Lock;
    cameraIcon = Camera;
    saveIcon = Save;
    eyeIcon = Eye;
    eyeOffIcon = EyeOff;
    keyIcon = Key;
    smartphoneIcon = Smartphone;
    checkCircleIcon = CheckCircle;
    alertCircleIcon = AlertCircle;
    uploadIcon = Upload;
    alertTriangleIcon = AlertTriangle;
    editIcon = Edit;
    xIcon = X;

    // Page configuration
    breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Dashboard', route: '/dashboard' },
        { label: 'Mi Perfil' }
    ];

    // Tabs configuration
    tabs = [
        { id: 'informacion', label: 'Información Personal', icon: this.userIcon },
        { id: 'seguridad', label: 'Seguridad', icon: this.shieldIcon },
        { id: 'preferencias', label: 'Preferencias', icon: this.briefcaseIcon }
    ];

    activeTab = 'informacion';

    // User data (mock data - in real app would come from service)
    user: UserProfile = {
        userId: 'USR-2024-001',
        username: 'dr.juan.perez',
        fullName: 'Dr. Juan Pérez García',
        email: 'juan.perez@hospital.com',
        phone: '+52 55 1234 5678',
        specialty: 'Cardiología',
        department: 'Medicina Interna',
        certifiedId: '12345678',
        status: 'active',
        assignedRoles: ['Médico', 'Médico Jefe'],
        lastLogin: '29 Oct 2024, 08:30 AM',
        loginCount: 1247,
        createdDate: '15 Ene 2023',
        failedAttempts: 0,
        twoFactorEnabled: false
    };

    // Form states
    isEditing = false;
    isSaving = false;
    profilePhoto: string | null = null;

    // Password change states
    showCurrentPassword = false;
    showNewPassword = false;
    showConfirmPassword = false;
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';

    // Edited data
    editedData = {
        fullName: '',
        email: '',
        phone: '',
        specialty: '',
        department: ''
    };

    // Security settings
    twoFactorEnabled = false;

    // Preferences
    emailNotifications = true;
    pushNotifications = true;
    securityAlerts = true;

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.initializeEditedData();
        this.twoFactorEnabled = this.user.twoFactorEnabled || false;
    }

    initializeEditedData(): void {
        this.editedData = {
            fullName: this.user.fullName,
            email: this.user.email,
            phone: this.user.phone,
            specialty: this.user.specialty,
            department: this.user.department
        };
    }

    getTabClasses(tabId: string): string {
        const baseClasses = 'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors';
        if (this.activeTab === tabId) {
            return `${baseClasses} border-blue-500 text-blue-600`;
        }
        return `${baseClasses} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`;
    }

    startEditing(): void {
        this.isEditing = true;
    }

    cancelEditing(): void {
        this.isEditing = false;
        this.initializeEditedData();
    }

    saveChanges(): void {
        if (!this.validateProfile()) {
            return;
        }

        this.isSaving = true;

        // Simulate API call
        setTimeout(() => {
            // Update user data
            this.user.fullName = this.editedData.fullName;
            this.user.email = this.editedData.email;
            this.user.phone = this.editedData.phone;
            this.user.specialty = this.editedData.specialty;
            this.user.department = this.editedData.department;

            this.showSuccessMessage('Perfil actualizado exitosamente');
            this.isEditing = false;
            this.isSaving = false;
        }, 1500);
    }

    validateProfile(): boolean {
        if (!this.editedData.fullName.trim()) {
            this.showErrorMessage('El nombre completo es obligatorio');
            return false;
        }

        if (!this.editedData.email.trim()) {
            this.showErrorMessage('El correo electrónico es obligatorio');
            return false;
        }

        if (!this.editedData.phone.trim()) {
            this.showErrorMessage('El teléfono es obligatorio');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.editedData.email)) {
            this.showErrorMessage('El formato del correo electrónico no es válido');
            return false;
        }

        return true;
    }

    onPhotoUpload(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showErrorMessage('Por favor seleccione una imagen válida');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.showErrorMessage('La imagen no debe exceder 5MB');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                this.profilePhoto = reader.result as string;
                this.showSuccessMessage('Foto de perfil actualizada. Los cambios se guardarán al hacer clic en "Guardar cambios"');
            };
            reader.readAsDataURL(file);
        }
    }

    changePassword(): void {
        if (!this.validatePasswordChange()) {
            return;
        }

        // Simulate API call
        setTimeout(() => {
            this.showSuccessMessage('Contraseña actualizada exitosamente. Por seguridad, se cerrarán todas tus sesiones activas');
            this.currentPassword = '';
            this.newPassword = '';
            this.confirmPassword = '';
        }, 1000);
    }

    validatePasswordChange(): boolean {
        if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
            this.showErrorMessage('Todos los campos son obligatorios');
            return false;
        }

        if (this.newPassword !== this.confirmPassword) {
            this.showErrorMessage('Las contraseñas no coinciden');
            return false;
        }

        if (this.currentPassword === this.newPassword) {
            this.showErrorMessage('La nueva contraseña debe ser diferente de la actual');
            return false;
        }

        if (this.getPasswordStrength() < 60) {
            this.showErrorMessage('La contraseña no cumple con las políticas de seguridad');
            return false;
        }

        return true;
    }

    getPasswordStrength(): number {
        if (!this.newPassword) return 0;

        let strength = 0;
        const password = this.newPassword;

        // Length check
        if (password.length >= 8) strength += 25;
        if (password.length >= 12) strength += 15;

        // Character variety
        if (/[a-z]/.test(password)) strength += 15;
        if (/[A-Z]/.test(password)) strength += 15;
        if (/[0-9]/.test(password)) strength += 15;
        if (/[^A-Za-z0-9]/.test(password)) strength += 15;

        return Math.min(strength, 100);
    }

    getPasswordStrengthLabel(): string {
        const strength = this.getPasswordStrength();
        if (strength < 40) return 'Débil';
        if (strength < 60) return 'Regular';
        if (strength < 80) return 'Buena';
        return 'Excelente';
    }

    getPasswordStrengthColor(): string {
        const strength = this.getPasswordStrength();
        if (strength < 40) return 'text-red-600';
        if (strength < 60) return 'text-yellow-600';
        if (strength < 80) return 'text-blue-600';
        return 'text-green-600';
    }

    getPasswordStrengthBg(): string {
        const strength = this.getPasswordStrength();
        if (strength < 40) return 'bg-red-500';
        if (strength < 60) return 'bg-yellow-500';
        if (strength < 80) return 'bg-blue-500';
        return 'bg-green-500';
    }

    toggle2FA(): void {
        if (this.twoFactorEnabled) {
            this.showSuccessMessage('Autenticación de dos factores habilitada. Tu cuenta ahora está más segura');
        } else {
            this.showInfoMessage('Autenticación de dos factores deshabilitada. Puedes habilitarla nuevamente cuando lo desees');
        }
    }

    private showSuccessMessage(message: string): void {
        // In a real app, you would use a toast service
        console.log('✅ Success:', message);
        alert(message);
    }

    private showErrorMessage(message: string): void {
        // In a real app, you would use a toast service
        console.log('❌ Error:', message);
        alert(message);
    }

    private showInfoMessage(message: string): void {
        // In a real app, you would use a toast service
        console.log('ℹ️ Info:', message);
        alert(message);
    }
}