import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, AlertTriangle, User, X, UserCheck, Shield } from 'lucide-angular';
import { RoleDemoService, UserRole } from '../../services/role-demo.service';
import { RoleChangeModalService } from '../../services/role-change-modal.service';

@Component({
  selector: 'app-role-suggestion-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <!-- Modal Overlay -->
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <!-- Background overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50" (click)="onDismiss()"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 ease-in-out">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div [class]="'w-10 h-10 rounded-full flex items-center justify-center ' + getRoleColorClass(suggestedRole)">
              <lucide-icon [img]="getRoleIcon(suggestedRole)" class="w-5 h-5"></lucide-icon>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Sugerencia de Rol</h3>
          </div>
          <button 
            (click)="onDismiss()"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <lucide-icon [img]="xIcon" class="w-5 h-5 text-gray-500"></lucide-icon>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div class="text-center mb-6">
            <p class="text-gray-700 mb-4">
              {{ getRoleMessage(suggestedRole) }}
            </p>
            <div [class]="'inline-flex items-center gap-2 px-4 py-2 border rounded-lg ' + getRoleColorClass(suggestedRole)">
              <lucide-icon [img]="getRoleIcon(suggestedRole)" class="w-5 h-5"></lucide-icon>
              <span class="font-semibold">{{ getRoleDisplayName(suggestedRole) }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button 
              (click)="onDismiss()"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors font-medium"
            >
              Ahora no
            </button>
            <button 
              (click)="openRoleChangeConfirmation()"
              [class]="'flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium ' + getRoleButtonClass(suggestedRole)"
            >
              Cambiar a {{ getRoleDisplayName(suggestedRole) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .animate-in {
      animation: slideInFromTop 0.3s ease-out;
    }
    
    @keyframes slideInFromTop {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class RoleSuggestionModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() suggestedRole: UserRole = 'Farmacéutico';
  @Input() pageName = '';
  @Output() dismiss = new EventEmitter<void>();
  @Output() roleChanged = new EventEmitter<void>();

  currentRole: UserRole = 'Médico';

  // Icons
  alertTriangleIcon = AlertTriangle;
  userIcon = User;
  userCheckIcon = UserCheck;
  shieldIcon = Shield;
  xIcon = X;

  constructor(
    private roleDemoService: RoleDemoService,
    private roleChangeModalService: RoleChangeModalService
  ) {
    // Get current role
    const currentSession = this.roleDemoService.getCurrentSession();
    this.currentRole = currentSession.activeRole;
    console.log('🔧 RoleSuggestionModal constructor - currentRole:', this.currentRole);
  }

  ngOnInit() {
    console.log('🔧 RoleSuggestionModal ngOnInit - isOpen:', this.isOpen, 'suggestedRole:', this.suggestedRole, 'pageName:', this.pageName);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('🔧 RoleSuggestionModal ngOnChanges - isOpen:', this.isOpen, 'suggestedRole:', this.suggestedRole);
    console.log('🔧 Changes:', changes);
    
    if (changes['isOpen']) {
      console.log('🔧 isOpen changed from', changes['isOpen'].previousValue, 'to', changes['isOpen'].currentValue);
    }
    if (changes['pageName']) {
      console.log('🔧 pageName changed from', changes['pageName'].previousValue, 'to', changes['pageName'].currentValue);
    }
  }

  onDismiss(): void {
    console.log('🔧 RoleSuggestionModal onDismiss called');
    this.dismiss.emit();
  }

  openRoleChangeConfirmation(): void {
    // Usar el servicio global para abrir el modal de confirmación
    this.roleChangeModalService.openRoleChangeModal(
      this.currentRole, 
      this.suggestedRole, 
      `role-suggestion-${this.pageName}`
    );
    
    // Cerrar el modal de sugerencia
    this.dismiss.emit();
  }

  getRoleIcon(role: UserRole) {
    switch (role) {
      case 'Médico':
        return this.userIcon;
      case 'Farmacéutico':
        return this.userCheckIcon;
      case 'Administrador':
        return this.shieldIcon;
      case 'Médico Jefe':
        return this.userCheckIcon;
      default:
        return this.userIcon;
    }
  }

  getRoleColorClass(role: UserRole): string {
    switch (role) {
      case 'Médico':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Farmacéutico':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'Administrador':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Médico Jefe':
        return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  }

  getRoleButtonClass(role: UserRole): string {
    switch (role) {
      case 'Médico':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'Farmacéutico':
        return 'bg-green-600 hover:bg-green-700';
      case 'Administrador':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'Médico Jefe':
        return 'bg-indigo-600 hover:bg-indigo-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  }

  getRoleDisplayName(role: UserRole): string {
    return role;
  }

  getRoleMessage(role: UserRole): string {
    switch (role) {
      case 'Farmacéutico':
        return 'Esta sección está optimizada para farmacéuticos. ¿Te gustaría cambiar tu rol?';
      case 'Administrador':
        return 'Esta sección requiere permisos de administrador. ¿Te gustaría cambiar tu rol?';
      case 'Médico Jefe':
        return 'Esta sección está diseñada para médicos jefe con acceso a reportes. ¿Te gustaría cambiar tu rol?';
      case 'Médico':
        return 'Esta sección está optimizada para médicos. ¿Te gustaría cambiar tu rol?';
      default:
        return 'Esta sección requiere un rol específico. ¿Te gustaría cambiar tu rol?';
    }
  }
}