import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  Ban, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  CheckCircle2,
  User,
  Shield
} from 'lucide-angular';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';

interface UsuarioBloqueado {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  failedAttempts: number;
  lastAttempt: string;
  blockedSince: string;
}

@Component({
  selector: 'app-bloqueos',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      [title]="'Bloqueos y Desbloqueos'"
      [description]="'Gestión de usuarios bloqueados por seguridad'"
      [icon]="banIcon"
      [breadcrumbItems]="breadcrumbItems"
      [hasActionButton]="false"
      [headerGradient]="'from-orange-600 via-amber-500 to-yellow-600'">

      <!-- Content -->
      <div class="space-y-6">
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow-lg border-l-4 border-red-500">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Usuarios bloqueados</p>
                  <p class="text-2xl font-semibold">{{ usuariosBloqueados.length }}</p>
                </div>
                <lucide-icon [img]="lockIcon" class="w-8 h-8 text-red-500"></lucide-icon>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg border-l-4 border-orange-500">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Bloqueos hoy</p>
                  <p class="text-2xl font-semibold">1</p>
                </div>
                <lucide-icon [img]="alertTriangleIcon" class="w-8 h-8 text-orange-500"></lucide-icon>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg border-l-4 border-green-500">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Desbloqueos hoy</p>
                  <p class="text-2xl font-semibold">0</p>
                </div>
                <lucide-icon [img]="unlockIcon" class="w-8 h-8 text-green-500"></lucide-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Blocked Users Table -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Usuarios Bloqueados</h2>
          </div>
          
          <div class="p-6" *ngIf="usuariosBloqueados.length === 0">
            <div class="text-center py-12">
              <lucide-icon [img]="checkCircle2Icon" class="w-12 h-12 text-green-400 mx-auto mb-4"></lucide-icon>
              <h3 class="font-medium mb-2">No hay usuarios bloqueados</h3>
              <p class="text-sm text-gray-600">Todos los usuarios tienen acceso normal al sistema</p>
            </div>
          </div>

          <div class="overflow-x-auto" *ngIf="usuariosBloqueados.length > 0">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intentos fallidos</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último intento</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let user of usuariosBloqueados" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <lucide-icon [img]="lockIcon" class="w-5 h-5 text-red-600"></lucide-icon>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">{{ user.fullName }}</p>
                        <p class="text-sm text-gray-600">{{ '@' + user.username }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      {{ user.failedAttempts }} intentos
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ user.lastAttempt }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      (click)="unblockUser(user)"
                      class="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                      <lucide-icon [img]="unlockIcon" class="w-4 h-4 mr-1"></lucide-icon>
                      Desbloquear
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </app-page-layout>
  `
})
export class BloqueosComponent implements OnInit {
  // Icons
  banIcon = Ban;
  lockIcon = Lock;
  unlockIcon = Unlock;
  alertTriangleIcon = AlertTriangle;
  checkCircle2Icon = CheckCircle2;
  userIcon = User;
  shieldIcon = Shield;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Seguridad y usuarios', route: '/seguridad' },
    { label: 'Bloqueos/Desbloqueos', route: '/seguridad/bloqueos' }
  ];

  // Mock data - usuarios bloqueados
  usuariosBloqueados: UsuarioBloqueado[] = [
    {
      id: "USR-0156",
      username: "usuario.bloqueado",
      fullName: "Usuario Test Bloqueado",
      email: "bloqueado@hospital.com",
      role: "Médico",
      failedAttempts: 5,
      lastAttempt: "2024-09-25 08:30",
      blockedSince: "2024-09-25 08:30"
    }
  ];

  ngOnInit() {
    // Initialize component
  }

  unblockUser(user: UsuarioBloqueado) {
    console.log('Unblocking user:', user);
    
    // Remover usuario de la lista de bloqueados
    this.usuariosBloqueados = this.usuariosBloqueados.filter(u => u.id !== user.id);
    
    // Mostrar mensaje de éxito
    alert(`Usuario ${user.fullName} ha sido desbloqueado exitosamente`);
  }
}