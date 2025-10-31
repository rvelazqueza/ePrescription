import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, ArrowRight, User, Shield, Activity, UserCheck, Stethoscope, Check } from 'lucide-angular';
import { RoleDemoService, UserRole } from '../../services/role-demo.service';

interface RolePermission {
  text: string;
  granted: boolean;
}

@Component({
  selector: 'app-role-change-confirmation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <!-- Modal Overlay -->
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Background overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50" (click)="onCancel()"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-300 ease-in-out">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Confirmar Cambio de Rol</h2>
          <button 
            (click)="onCancel()"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <lucide-icon [img]="xIcon" class="w-5 h-5 text-gray-500"></lucide-icon>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- Subtitle -->
          <p class="text-sm text-gray-600">Este cambio quedará registrado en auditoría</p>

          <!-- Role Change Display -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <!-- Current Role -->
              <div class="text-center">
                <p class="text-sm text-gray-600 mb-2">Rol actual</p>
                <div class="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border">
                  <lucide-icon [img]="getRoleIcon(currentRole)" [class]="'w-5 h-5 ' + getRoleIconColor(currentRole)"></lucide-icon>
                  <span class="font-medium text-gray-900">{{ currentRole }}</span>
                </div>
              </div>

              <!-- Arrow -->
              <div class="px-4">
                <lucide-icon [img]="arrowRightIcon" class="w-5 h-5 text-gray-400"></lucide-icon>
              </div>

              <!-- New Role -->
              <div class="text-center">
                <p class="text-sm text-gray-600 mb-2">Nuevo rol</p>
                <div class="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border">
                  <lucide-icon [img]="getRoleIcon(newRole)" [class]="'w-5 h-5 ' + getRoleIconColor(newRole)"></lucide-icon>
                  <span class="font-medium text-gray-900">{{ newRole }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Permissions Section -->
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span class="text-blue-600 font-semibold text-sm">i</span>
              </div>
              <div class="flex-1">
                <h3 class="font-medium text-gray-900 mb-3">Los permisos cambiarán a:</h3>
                <div class="space-y-2">
                  <div *ngFor="let permission of getPermissionsForRole(newRole)" class="flex items-center gap-2">
                    <lucide-icon [img]="checkIcon" class="w-4 h-4 text-green-600"></lucide-icon>
                    <span class="text-sm text-gray-700">{{ permission.text }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reason Input -->
          <div>
            <label for="reason" class="block text-sm font-medium text-gray-700 mb-2">
              Razón del cambio (opcional)
            </label>
            <div class="relative">
              <textarea
                id="reason"
                [(ngModel)]="reason"
                rows="3"
                placeholder="Ej: Necesito dispensar medicamentos..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
              ></textarea>
              <div class="absolute bottom-2 right-2">
                <lucide-icon [img]="checkIcon" class="w-5 h-5 text-blue-500"></lucide-icon>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-1">Esta información se incluirá en el registro de auditoría</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex gap-3 p-6 border-t border-gray-200">
          <button 
            (click)="onCancel()"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors font-medium"
          >
            Cancelar
          </button>
          <button 
            (click)="onConfirm()"
            class="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <lucide-icon [img]="arrowRightIcon" class="w-4 h-4"></lucide-icon>
            Cambiar rol
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class RoleChangeConfirmationModalComponent {
  @Input() isOpen = false;
  @Input() currentRole: UserRole = 'Médico';
  @Input() newRole: UserRole = 'Farmacéutico';
  @Output() confirm = new EventEmitter<{ newRole: UserRole; reason: string }>();
  @Output() cancel = new EventEmitter<void>();

  reason = '';

  // Icons
  xIcon = X;
  arrowRightIcon = ArrowRight;
  userIcon = User;
  shieldIcon = Shield;
  activityIcon = Activity;
  userCheckIcon = UserCheck;
  stethoscopeIcon = Stethoscope;
  checkIcon = Check;

  constructor(private roleDemoService: RoleDemoService) {}

  onCancel(): void {
    this.reason = '';
    this.cancel.emit();
  }

  onConfirm(): void {
    this.confirm.emit({
      newRole: this.newRole,
      reason: this.reason.trim()
    });
    this.reason = '';
  }

  getRoleIcon(role: UserRole) {
    switch (role) {
      case 'Médico':
        return this.stethoscopeIcon;
      case 'Médico Jefe':
        return this.shieldIcon;
      case 'Farmacéutico':
        return this.activityIcon;
      case 'Enfermera':
        return this.userCheckIcon;
      case 'Administrador':
        return this.shieldIcon;
      default:
        return this.userIcon;
    }
  }

  getRoleIconColor(role: UserRole): string {
    switch (role) {
      case 'Médico':
        return 'text-green-600';
      case 'Médico Jefe':
        return 'text-indigo-600';
      case 'Farmacéutico':
        return 'text-purple-600';
      case 'Enfermera':
        return 'text-pink-600';
      case 'Administrador':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  }

  getPermissionsForRole(role: UserRole): RolePermission[] {
    switch (role) {
      case 'Médico':
        return [
          { text: 'Crear y firmar recetas', granted: true },
          { text: 'Ver pacientes', granted: true },
          { text: 'Consultar inventario', granted: true }
        ];
      case 'Médico Jefe':
        return [
          { text: 'Crear y firmar recetas', granted: true },
          { text: 'Ver pacientes', granted: true },
          { text: 'Consultar inventario', granted: true },
          { text: 'Acceso a reportes', granted: true },
          { text: 'Gestión de médicos', granted: true }
        ];
      case 'Farmacéutico':
        return [
          { text: 'Dispensar medicamentos', granted: true },
          { text: 'Verificar recetas', granted: true },
          { text: 'Gestionar inventario', granted: true },
          { text: 'Ver alertas de stock', granted: true }
        ];
      case 'Enfermera':
        return [
          { text: 'Ver pacientes', granted: true },
          { text: 'Consultar recetas', granted: true },
          { text: 'Registrar signos vitales', granted: true }
        ];
      case 'Administrador':
        return [
          { text: 'Gestión completa del sistema', granted: true },
          { text: 'Configuración de usuarios', granted: true },
          { text: 'Acceso a auditoría', granted: true },
          { text: 'Configuración de catálogos', granted: true }
        ];
      default:
        return [];
    }
  }
}