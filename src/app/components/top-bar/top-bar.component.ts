import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LucideAngularModule, Bell, User, Search, ChevronDown, Settings, LogOut, Shield, Activity } from 'lucide-angular';
import { AuthService, User as AuthUser } from '../../services/auth.service';
import { RoleDemoService, UserRole } from '../../services/role-demo.service';
import { UserNotificationsService } from '../../services/user-notifications.service';
import { RoleChangeModalService } from '../../services/role-change-modal.service';
import { SimpleDropdownComponent } from '../ui/simple-dropdown/simple-dropdown.component';
import { NotificationsDropdownComponent } from '../notifications-dropdown/notifications-dropdown.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, SimpleDropdownComponent, NotificationsDropdownComponent, ClickOutsideDirective],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="flex items-center justify-between px-6 py-3">
        <!-- Barra de búsqueda a la izquierda -->
        <div class="flex items-center flex-1 max-w-md">
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <lucide-icon [img]="searchIcon" class="h-4 w-4 text-gray-400"></lucide-icon>
            </div>
            <input type="text" 
                   placeholder="Buscar paciente, receta, medicamento..." 
                   class="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
          </div>
        </div>
        
        <!-- Sección central y derecha -->
        <div class="flex items-center space-x-6">
          <!-- Badge Rol Actual -->
          <div class="flex items-center space-x-3">
            <span [class]="'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ' + getRoleBadgeClasses()">
              <lucide-icon [img]="getRoleIcon()" class="w-4 h-4 mr-1"></lucide-icon>
              {{ currentRole }}
            </span>
            
            <!-- Dropdown Cambiar rol -->
            <app-simple-dropdown 
              [(isOpen)]="isRoleDropdownOpen"
              triggerClass="flex items-center space-x-1 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors cursor-pointer border border-gray-300"
            >
              <div slot="trigger" class="flex items-center space-x-1">
                <span>Cambiar rol</span>
                <lucide-icon [img]="chevronDownIcon" class="h-4 w-4 text-gray-400"></lucide-icon>
              </div>

              <div slot="content">
                <button
                  (click)="openRoleChangeModal('Médico')"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                >
                  <lucide-icon [img]="userIcon" class="w-4 h-4 mr-3 text-green-600"></lucide-icon>
                  Médico
                </button>
                <button
                  (click)="openRoleChangeModal('Médico Jefe')"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                >
                  <lucide-icon [img]="shieldIcon" class="w-4 h-4 mr-3 text-indigo-600"></lucide-icon>
                  Médico Jefe
                </button>
                <button
                  (click)="openRoleChangeModal('Farmacéutico')"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                >
                  <lucide-icon [img]="activityIcon" class="w-4 h-4 mr-3 text-purple-600"></lucide-icon>
                  Farmacéutico
                </button>
                <button
                  (click)="openRoleChangeModal('Enfermera')"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                >
                  <lucide-icon [img]="userIcon" class="w-4 h-4 mr-3 text-pink-600"></lucide-icon>
                  Enfermera
                </button>
                <button
                  (click)="openRoleChangeModal('Administrador')"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
                >
                  <lucide-icon [img]="shieldIcon" class="w-4 h-4 mr-3 text-blue-600"></lucide-icon>
                  Administrador
                </button>
              </div>
            </app-simple-dropdown>
          </div>

          <!-- Notificaciones -->
          <div class="relative">
            <button 
              (click)="toggleNotifications()"
              class="relative p-2 text-gray-400 hover:text-gray-500 transition-colors"
              type="button">
              <lucide-icon [img]="bellIcon" class="h-5 w-5"></lucide-icon>
              <span 
                *ngIf="unreadCount > 0"
                class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full min-w-[20px] h-5">
                {{ unreadCount > 99 ? '99+' : unreadCount }}
              </span>
            </button>
            
            <!-- Notifications Dropdown -->
            <div 
              *ngIf="isNotificationsOpen"
              class="absolute right-0 mt-2 z-50">
              <app-notifications-dropdown
                [isOpen]="isNotificationsOpen"
                (close)="closeNotifications()">
              </app-notifications-dropdown>
            </div>
          </div>
          
          <!-- Información del médico -->
          <app-simple-dropdown 
            [(isOpen)]="isUserDropdownOpen"
            triggerClass="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div slot="trigger" class="flex items-center space-x-3">
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">Dr. Juan Pérez</div>
                <div class="text-xs text-gray-500">Cédula: MED 123456 | Código: USR-7890</div>
                <div class="text-xs text-gray-500">Medicina General</div>
              </div>
              <div class="flex-shrink-0">
                <div class="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <span class="text-white text-sm font-medium">JP</span>
                </div>
              </div>
            </div>

            <div slot="content">
              <!-- User Info Header -->
              <div class="px-4 py-3 border-b border-gray-100">
                <div class="flex items-center space-x-3">
                  <div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <span class="text-white font-medium">JP</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">Dr. Juan Pérez</p>
                    <p class="text-xs text-gray-500 truncate">juan.perez&#64;hospital.com</p>
                  </div>
                </div>
                <div class="mt-2 flex items-center space-x-2">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    <lucide-icon [img]="activityIcon" class="w-3 h-3 mr-1"></lucide-icon>
                    Activo
                  </span>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    <lucide-icon [img]="shieldIcon" class="w-3 h-3 mr-1"></lucide-icon>
                    Verificado
                  </span>
                </div>
              </div>

              <!-- Menu Items -->
              <button
                (click)="navigateToProfile()"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
              >
                <lucide-icon [img]="userIcon" class="w-4 h-4 mr-3 text-gray-400"></lucide-icon>
                Mi perfil
              </button>

              <button
                (click)="navigateToNotifications()"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-between"
              >
                <div class="flex items-center">
                  <lucide-icon [img]="bellIcon" class="w-4 h-4 mr-3 text-gray-400"></lucide-icon>
                  Notificaciones
                </div>
                <span *ngIf="unreadCount > 0" class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
              </button>

              <button
                (click)="navigateToSettings()"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center"
              >
                <lucide-icon [img]="settingsIcon" class="w-4 h-4 mr-3 text-gray-400"></lucide-icon>
                Configuración
              </button>

              <!-- Divider -->
              <div class="border-t border-gray-100 my-1"></div>

              <!-- Logout -->
              <button
                (click)="logout()"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center"
              >
                <lucide-icon [img]="logOutIcon" class="w-4 h-4 mr-3"></lucide-icon>
                Cerrar Sesión
              </button>
            </div>
          </app-simple-dropdown>
        </div>
      </div>
    </header>
  `
})
export class TopBarComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  currentUser: AuthUser | null = null;
  isUserDropdownOpen = false;
  isRoleDropdownOpen = false;
  isNotificationsOpen = false;
  currentRole: UserRole = 'Médico';
  unreadCount = 0;

  // Icons
  bellIcon = Bell;
  userIcon = User;
  searchIcon = Search;
  chevronDownIcon = ChevronDown;
  settingsIcon = Settings;
  logOutIcon = LogOut;
  shieldIcon = Shield;
  activityIcon = Activity;

  constructor(
    private authService: AuthService,
    private router: Router,
    private roleDemoService: RoleDemoService,
    private notificationsService: UserNotificationsService,
    private roleChangeModalService: RoleChangeModalService
  ) { }

  ngOnInit(): void {
    // Subscribe to user changes
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );

    // Subscribe to role changes
    this.subscription.add(
      this.roleDemoService.currentSession$.subscribe(session => {
        this.currentRole = session.activeRole;
      })
    );

    // Subscribe to notifications count
    this.subscription.add(
      this.notificationsService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getUserRole(): string {
    if (!this.currentUser) return '';

    // Determine role based on user data
    if (this.currentUser.email.includes('admin')) return 'Administrador';
    if (this.currentUser.fullName.includes('Dr.') || this.currentUser.fullName.includes('Dra.')) return 'Médico';
    return 'Usuario';
  }

  navigateToProfile(): void {
    this.isUserDropdownOpen = false;
    this.router.navigate(['/mi-perfil']);
  }

  navigateToNotifications(): void {
    this.isUserDropdownOpen = false;
    this.router.navigate(['/notificaciones/lista']);
  }

  navigateToSettings(): void {
    this.isUserDropdownOpen = false;
    this.router.navigate(['/autoservicio']);
  }

  toggleNotifications(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    // Cerrar otros dropdowns
    this.isUserDropdownOpen = false;
    this.isRoleDropdownOpen = false;
  }

  closeNotifications(): void {
    this.isNotificationsOpen = false;
  }

  logout(): void {
    this.isUserDropdownOpen = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openRoleChangeModal(newRole: UserRole): void {
    this.isRoleDropdownOpen = false;
    this.roleChangeModalService.openRoleChangeModal(this.currentRole, newRole, 'navbar');
  }

  getRoleBadgeClasses(): string {
    switch (this.currentRole) {
      case 'Médico':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Médico Jefe':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Farmacéutico':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Enfermera':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Administrador':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  getRoleIcon() {
    switch (this.currentRole) {
      case 'Médico':
        return this.userIcon;
      case 'Médico Jefe':
        return this.shieldIcon;
      case 'Farmacéutico':
        return this.activityIcon;
      case 'Enfermera':
        return this.userIcon;
      case 'Administrador':
        return this.shieldIcon;
      default:
        return this.userIcon;
    }
  }
}