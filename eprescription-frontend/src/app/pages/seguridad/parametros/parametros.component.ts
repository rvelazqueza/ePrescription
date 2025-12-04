import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  Settings, 
  Shield, 
  Key, 
  Clock, 
  Save,
  AlertTriangle,
  CheckCircle2,
  Lock
} from 'lucide-angular';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-parametros-seguridad',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      [title]="'Parámetros de Seguridad'"
      [description]="'Políticas de contraseñas y sesiones según HIPAA'"
      [icon]="settingsIcon"
      [breadcrumbItems]="breadcrumbItems"
      [hasActionButton]="false"
      [headerGradient]="'from-green-600 via-emerald-500 to-teal-600'">

      <!-- Content -->
      <div class="space-y-6">
        
        <!-- Main Grid: Two Columns -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Left Column: Políticas de Contraseñas -->
          <div class="bg-white rounded-lg shadow-lg">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center gap-3">
                <lucide-icon [img]="keyIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
                <h2 class="text-lg font-semibold text-gray-900">Políticas de Contraseñas</h2>
              </div>
            </div>
            
            <div class="p-6 space-y-4">
              <!-- Longitud mínima -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Longitud mínima de contraseña
                </label>
                <input
                  type="number"
                  [(ngModel)]="passwordMinLength"
                  min="6"
                  max="20"
                  class="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p class="text-xs text-gray-600 mt-1">Mínimo 8 caracteres recomendado</p>
              </div>

              <!-- Expiración -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Expiración de contraseña (días)
                </label>
                <input
                  type="number"
                  [(ngModel)]="passwordExpireDays"
                  min="30"
                  max="365"
                  class="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p class="text-xs text-gray-600 mt-1">Recomendado: 90 días</p>
              </div>

              <!-- Requisitos de caracteres -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Requiere mayúsculas</label>
                    <p class="text-xs text-gray-600">Al menos una letra mayúscula</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" [(ngModel)]="requireUppercase" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Requiere minúsculas</label>
                    <p class="text-xs text-gray-600">Al menos una letra minúscula</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" [(ngModel)]="requireLowercase" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Requiere números</label>
                    <p class="text-xs text-gray-600">Al menos un dígito</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" [(ngModel)]="requireNumbers" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Requiere caracteres especiales</label>
                    <p class="text-xs text-gray-600">Al menos un símbolo (!&#64;#$%)</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" [(ngModel)]="requireSpecialChars" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Control de Sesiones -->
          <div class="bg-white rounded-lg shadow-lg">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center gap-3">
                <lucide-icon [img]="lockIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
                <h2 class="text-lg font-semibold text-gray-900">Control de Sesiones</h2>
              </div>
            </div>
            
            <div class="p-6 space-y-4">
              <!-- Tiempo de inactividad -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tiempo de inactividad (minutos)
                </label>
                <input
                  type="number"
                  [(ngModel)]="sessionTimeout"
                  min="5"
                  max="120"
                  class="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p class="text-xs text-gray-600 mt-1">Cierre de sesión automático</p>
              </div>

              <!-- Máximo de intentos fallidos -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de intentos fallidos
                </label>
                <input
                  type="number"
                  [(ngModel)]="maxFailedAttempts"
                  min="3"
                  max="10"
                  class="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p class="text-xs text-gray-600 mt-1">Antes de bloquear la cuenta</p>
              </div>

              <!-- Duración de bloqueo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Duración de bloqueo (minutos)
                </label>
                <input
                  type="number"
                  [(ngModel)]="lockoutDuration"
                  min="5"
                  max="1440"
                  class="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p class="text-xs text-gray-600 mt-1">Tiempo de bloqueo temporal</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuración de Seguridad Avanzada -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center gap-3">
              <lucide-icon [img]="shieldIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
              <h2 class="text-lg font-semibold text-gray-900">Configuración de Seguridad Avanzada</h2>
            </div>
          </div>
          
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <label class="text-sm font-medium text-gray-700">Requerir autenticación de dos factores (2FA)</label>
                  <p class="text-xs text-gray-600">Obligatorio para todos los usuarios</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" [(ngModel)]="require2FA" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <label class="text-sm font-medium text-gray-700">Permitir "Recordar sesión"</label>
                  <p class="text-xs text-gray-600">Los usuarios pueden mantener sesión activa por 30 días</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" [(ngModel)]="allowRememberMe" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <label class="text-sm font-medium text-gray-700">Registrar todos los accesos</label>
                  <p class="text-xs text-gray-600">Log completo de auditoría (cumplimiento HIPAA)</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" [(ngModel)]="logAllAccess" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
          <button 
            (click)="cancelChanges()"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Cancelar
          </button>
          <button 
            (click)="saveConfiguration()"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <lucide-icon [img]="saveIcon" class="w-4 h-4 mr-2"></lucide-icon>
            Guardar configuración
          </button>
        </div>
      </div>
    </app-page-layout>
  `
})
export class ParametrosSeguridadComponent implements OnInit {
  // Icons
  settingsIcon = Settings;
  shieldIcon = Shield;
  keyIcon = Key;
  clockIcon = Clock;
  saveIcon = Save;
  alertTriangleIcon = AlertTriangle;
  checkCircle2Icon = CheckCircle2;
  lockIcon = Lock;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Seguridad y usuarios', route: '/seguridad' },
    { label: 'Parámetros de seguridad', route: '/seguridad/parametros' }
  ];

  // Password policy settings
  passwordMinLength = 8;
  passwordExpireDays = 90;
  requireUppercase = true;
  requireLowercase = true;
  requireNumbers = true;
  requireSpecialChars = true;

  // Session settings
  sessionTimeout = 30;
  maxFailedAttempts = 3;
  lockoutDuration = 30;

  // Advanced security settings
  require2FA = false;
  allowRememberMe = true;
  logAllAccess = true;

  ngOnInit() {
    // Initialize component
  }

  saveConfiguration() {
    console.log('Saving security configuration...');
    // Implementar lógica para guardar configuración
    alert('Configuración guardada exitosamente');
  }

  cancelChanges() {
    console.log('Canceling changes...');
    // Implementar lógica para cancelar cambios
  }
}