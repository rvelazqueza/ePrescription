import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  LucideAngularModule, 
  Shield, 
  Users, 
  Settings, 
  Lock, 
  Activity,
  Key,
  Ban,
  Monitor,
  ChevronRight,
  AlertTriangle,
  CheckCircle2
} from 'lucide-angular';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';
import { BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs.component';

interface SecurityModule {
  id: string;
  title: string;
  description: string;
  icon: any;
  route: string;
  gradient: string;
  stats?: {
    primary: number;
    secondary?: number;
    label: string;
    sublabel?: string;
  };
}

@Component({
  selector: 'app-seguridad',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      [title]="'Seguridad y Usuarios'"
      [description]="'Centro de control de seguridad y gestión de usuarios del sistema'"
      [icon]="shieldIcon"
      [breadcrumbItems]="breadcrumbItems"
      [hasActionButton]="true"
      [headerGradient]="'from-indigo-600 via-purple-600 to-blue-600'">
      
      <!-- Action Button -->
      <div slot="action" class="flex gap-2">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
          <lucide-icon [img]="checkCircle2Icon" class="w-3 h-3 mr-1"></lucide-icon>
          HIPAA/FDA Compliant
        </span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
          <lucide-icon [img]="shieldIcon" class="w-3 h-3 mr-1"></lucide-icon>
          Sistema Seguro
        </span>
      </div>

      <!-- Content -->
      <div class="space-y-6">
        
        <!-- Security Overview Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-lg border-l-4 border-blue-500">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Total usuarios</p>
                  <p class="text-2xl font-semibold">{{ overviewStats.totalUsers }}</p>
                </div>
                <lucide-icon [img]="usersIcon" class="w-8 h-8 text-blue-500"></lucide-icon>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg border-l-4 border-green-500">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Sesiones activas</p>
                  <p class="text-2xl font-semibold">{{ overviewStats.activeSessions }}</p>
                </div>
                <lucide-icon [img]="activityIcon" class="w-8 h-8 text-green-500"></lucide-icon>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg border-l-4 border-purple-500">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Roles configurados</p>
                  <p class="text-2xl font-semibold">{{ overviewStats.totalRoles }}</p>
                </div>
                <lucide-icon [img]="shieldIcon" class="w-8 h-8 text-purple-500"></lucide-icon>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg border-l-4 border-red-500">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Usuarios bloqueados</p>
                  <p class="text-2xl font-semibold">{{ overviewStats.blockedUsers }}</p>
                </div>
                <lucide-icon [img]="lockIcon" class="w-8 h-8 text-red-500"></lucide-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Modules Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            *ngFor="let module of securityModules" 
            class="group cursor-pointer overflow-hidden hover:shadow-xl transition-all border border-gray-200 rounded-lg bg-white"
            (click)="navigateToModule(module.route)">
            
            <!-- Header with gradient -->
            <div [class]="'h-3 bg-gradient-to-r ' + module.gradient"></div>
            
            <!-- Content -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div [class]="'p-3 bg-gradient-to-br ' + module.gradient + ' rounded-lg'">
                  <lucide-icon [img]="module.icon" class="w-6 h-6 text-white"></lucide-icon>
                </div>
                <lucide-icon [img]="chevronRightIcon" class="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></lucide-icon>
              </div>
              
              <div class="space-y-3">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {{ module.title }}
                  </h3>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    {{ module.description }}
                  </p>
                </div>
                
                <!-- Stats if available -->
                <div *ngIf="module.stats" class="pt-3 border-t border-gray-100">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-2xl font-bold text-gray-900">{{ module.stats.primary }}</p>
                      <p class="text-xs text-gray-600">{{ module.stats.label }}</p>
                    </div>
                    <div *ngIf="module.stats.secondary !== undefined" class="text-right">
                      <p class="text-lg font-semibold text-gray-700">{{ module.stats.secondary }}</p>
                      <p class="text-xs text-gray-500">{{ module.stats.sublabel }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Status -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900 flex items-center">
              <lucide-icon [img]="shieldIcon" class="w-5 h-5 mr-2 text-green-600"></lucide-icon>
              Estado de Seguridad del Sistema
            </h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div *ngFor="let status of securityStatus" class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="status.icon" [class]="'w-5 h-5 text-' + status.color + '-600'"></lucide-icon>
                    <span class="text-sm text-gray-700">{{ status.label }}</span>
                  </div>
                  <span [class]="'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-' + status.color + '-100 text-' + status.color + '-800 border border-' + status.color + '-200'">
                    {{ status.status }}
                  </span>
                </div>
                <div class="space-y-1">
                  <div class="flex items-center justify-between text-xs text-gray-600">
                    <span>Nivel de seguridad</span>
                    <span>{{ status.level }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div [class]="'bg-' + status.color + '-500 h-2 rounded-full transition-all duration-300'" 
                         [style.width.%]="status.level"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-page-layout>
  `
})
export class SeguridadComponent implements OnInit {
  // Icons
  shieldIcon = Shield;
  usersIcon = Users;
  settingsIcon = Settings;
  lockIcon = Lock;
  activityIcon = Activity;
  keyIcon = Key;
  banIcon = Ban;
  monitorIcon = Monitor;
  chevronRightIcon = ChevronRight;
  alertTriangleIcon = AlertTriangle;
  checkCircle2Icon = CheckCircle2;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Seguridad y usuarios', route: '/seguridad' }
  ];

  // Overview stats
  overviewStats = {
    totalUsers: 8,
    activeSessions: 5,
    totalRoles: 8,
    blockedUsers: 1
  };

  // Security modules
  securityModules: SecurityModule[] = [
    {
      id: 'usuarios',
      title: 'Usuarios',
      description: 'Gestión completa de usuarios del sistema, perfiles y credenciales de acceso',
      icon: this.usersIcon,
      route: '/seguridad/usuarios',
      gradient: 'from-red-500 to-red-600',
      stats: {
        primary: 8,
        secondary: 6,
        label: 'usuarios totales',
        sublabel: 'activos'
      }
    },
    {
      id: 'roles',
      title: 'Roles y Permisos',
      description: 'Sistema híbrido RBAC con roles base y personalizados para control granular',
      icon: this.shieldIcon,
      route: '/seguridad/roles',
      gradient: 'from-blue-500 to-indigo-600',
      stats: {
        primary: 8,
        secondary: 3,
        label: 'roles totales',
        sublabel: 'personalizados'
      }
    },
    {
      id: 'parametros',
      title: 'Parámetros de Seguridad',
      description: 'Configuración de políticas de contraseñas, sesiones y cumplimiento HIPAA',
      icon: this.settingsIcon,
      route: '/seguridad/parametros',
      gradient: 'from-green-500 to-emerald-600',
      stats: {
        primary: 12,
        label: 'políticas activas'
      }
    },
    {
      id: 'bloqueos',
      title: 'Bloqueos/Desbloqueos',
      description: 'Gestión de usuarios bloqueados por seguridad y herramientas de desbloqueo',
      icon: this.banIcon,
      route: '/seguridad/bloqueos',
      gradient: 'from-orange-500 to-amber-600',
      stats: {
        primary: 1,
        secondary: 0,
        label: 'usuarios bloqueados',
        sublabel: 'hoy'
      }
    },
    {
      id: 'sesiones',
      title: 'Sesiones de Usuario',
      description: 'Monitoreo en tiempo real de sesiones activas y control de accesos',
      icon: this.activityIcon,
      route: '/seguridad/sesiones',
      gradient: 'from-cyan-500 to-blue-600',
      stats: {
        primary: 5,
        secondary: 5,
        label: 'sesiones activas',
        sublabel: 'usuarios únicos'
      }
    }
  ];

  // Security status
  securityStatus = [
    {
      label: 'Autenticación',
      status: 'Seguro',
      level: 95,
      color: 'green',
      icon: this.keyIcon
    },
    {
      label: 'Autorización',
      status: 'Óptimo',
      level: 98,
      color: 'green',
      icon: this.shieldIcon
    },
    {
      label: 'Auditoría',
      status: 'Activo',
      level: 100,
      color: 'blue',
      icon: this.monitorIcon
    },
    {
      label: 'Cumplimiento',
      status: 'HIPAA OK',
      level: 100,
      color: 'green',
      icon: this.checkCircle2Icon
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialize component
  }

  navigateToModule(route: string) {
    this.router.navigate([route]);
  }
}