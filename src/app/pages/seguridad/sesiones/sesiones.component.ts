import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  Activity, 
  Users, 
  Clock, 
  User,
  Monitor,
  MapPin,
  XCircle,
  Download,
  ExternalLink
} from 'lucide-angular';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';

interface SesionActiva {
  id: string;
  userId: string;
  userName: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  loginTime: string;
  lastActivity: string;
  duration: string;
  status: 'active' | 'idle';
}

@Component({
  selector: 'app-sesiones',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      [title]="'Sesiones Activas'"
      [description]="'Monitoreo en tiempo real de accesos al sistema'"
      [icon]="activityIcon"
      [breadcrumbItems]="breadcrumbItems"
      [hasActionButton]="false"
      [headerGradient]="'from-cyan-600 via-blue-500 to-indigo-600'">

      <!-- Content -->
      <div class="space-y-6">
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow-lg border-l-4 border-cyan-500">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Sesiones activas</p>
                  <p class="text-2xl font-semibold">{{ sesionesActivas.length }}</p>
                </div>
                <lucide-icon [img]="activityIcon" class="w-8 h-8 text-cyan-500"></lucide-icon>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg border-l-4 border-blue-500">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Usuarios únicos</p>
                  <p class="text-2xl font-semibold">{{ getUniqueUsersCount() }}</p>
                </div>
                <lucide-icon [img]="usersIcon" class="w-8 h-8 text-blue-500"></lucide-icon>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg border-l-4 border-purple-500">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Promedio duración</p>
                  <p class="text-2xl font-semibold">6.3h</p>
                </div>
                <lucide-icon [img]="clockIcon" class="w-8 h-8 text-purple-500"></lucide-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Sessions Table -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Sesiones Activas en el Sistema</h2>
            <button class="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <lucide-icon [img]="downloadIcon" class="w-4 h-4 mr-2"></lucide-icon>
              Exportar
            </button>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación/IP</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dispositivo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio de sesión</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última actividad</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let session of sesionesActivas" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                        <lucide-icon [img]="userIcon" class="w-5 h-5 text-cyan-600"></lucide-icon>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">{{ session.userName }}</p>
                        <p class="text-sm text-gray-600">{{ session.userId }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm">
                      <div class="flex items-center gap-1">
                        <lucide-icon [img]="mapPinIcon" class="w-3 h-3 text-gray-400"></lucide-icon>
                        <span class="text-gray-900">{{ session.location }}</span>
                      </div>
                      <div class="flex items-center gap-1 text-gray-600 mt-1">
                        <lucide-icon [img]="monitorIcon" class="w-3 h-3"></lucide-icon>
                        <span>{{ session.ipAddress }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm">
                      <p class="text-gray-900">{{ session.device }}</p>
                      <p class="text-gray-600">{{ session.browser }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm">
                      <p class="text-gray-900">{{ getDatePart(session.loginTime) }}</p>
                      <p class="text-gray-600">{{ getTimePart(session.loginTime) }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm">
                      <p class="text-gray-900">{{ getDatePart(session.lastActivity) }}</p>
                      <p class="text-gray-600">{{ getTimePart(session.lastActivity) }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {{ session.duration }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      Activa
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      (click)="terminateSession(session)"
                      class="inline-flex items-center px-3 py-1 border border-red-300 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500">
                      <lucide-icon [img]="xCircleIcon" class="w-4 h-4 mr-1"></lucide-icon>
                      Cerrar
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
export class SesionesComponent implements OnInit {
  // Icons
  activityIcon = Activity;
  usersIcon = Users;
  clockIcon = Clock;
  userIcon = User;
  monitorIcon = Monitor;
  mapPinIcon = MapPin;
  xCircleIcon = XCircle;
  downloadIcon = Download;
  externalLinkIcon = ExternalLink;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Seguridad y usuarios', route: '/seguridad' },
    { label: 'Sesiones de usuario', route: '/seguridad/sesiones' }
  ];

  // Mock data - sesiones activas
  sesionesActivas: SesionActiva[] = [
    {
      id: "SESS-45678-ABC",
      userId: "USR-0023",
      userName: "Dr. Carlos Martínez",
      ipAddress: "192.168.1.45",
      location: "Consultorio 3B",
      device: "Windows PC",
      browser: "Chrome 118.0",
      loginTime: "2024-10-01 08:00:15",
      lastActivity: "2024-10-01 14:35:22",
      duration: "6h 35m",
      status: "active"
    },
    {
      id: "SESS-45679-DEF",
      userId: "USR-0045",
      userName: "Farmacéutica Ana García",
      ipAddress: "192.168.1.78",
      location: "Farmacia Central",
      device: "Windows PC",
      browser: "Firefox 119.0",
      loginTime: "2024-10-01 07:30:00",
      lastActivity: "2024-10-01 14:28:15",
      duration: "6h 58m",
      status: "active"
    },
    {
      id: "SESS-45680-GHI",
      userId: "USR-0001",
      userName: "Admin Sistema",
      ipAddress: "192.168.1.10",
      location: "Administración",
      device: "Windows Server",
      browser: "Edge 118.0",
      loginTime: "2024-10-01 06:00:00",
      lastActivity: "2024-10-01 13:45:08",
      duration: "7h 45m",
      status: "active"
    },
    {
      id: "SESS-45681-JKL",
      userId: "USR-0067",
      userName: "Dr. José Torres",
      ipAddress: "192.168.1.56",
      location: "Consultorio 5A",
      device: "MacBook Pro",
      browser: "Safari 17.0",
      loginTime: "2024-10-01 09:00:45",
      lastActivity: "2024-10-01 13:12:45",
      duration: "4h 12m",
      status: "active"
    },
    {
      id: "SESS-45682-MNO",
      userId: "USR-0089",
      userName: "Dra. Laura Ramírez",
      ipAddress: "192.168.1.67",
      location: "Consultorio Principal",
      device: "Windows PC",
      browser: "Chrome 118.0",
      loginTime: "2024-10-01 07:00:30",
      lastActivity: "2024-10-01 12:45:12",
      duration: "5h 44m",
      status: "active"
    }
  ];

  ngOnInit() {
    // Initialize component
  }

  getUniqueUsersCount(): number {
    const uniqueUsers = new Set(this.sesionesActivas.map(s => s.userId));
    return uniqueUsers.size;
  }

  getDatePart(dateTime: string): string {
    return dateTime.split(' ')[0];
  }

  getTimePart(dateTime: string): string {
    return dateTime.split(' ')[1];
  }

  terminateSession(session: SesionActiva) {
    console.log('Terminating session:', session);
    
    // Remover sesión de la lista
    this.sesionesActivas = this.sesionesActivas.filter(s => s.id !== session.id);
    
    // Mostrar mensaje de éxito
    alert(`Sesión de ${session.userName} ha sido cerrada exitosamente`);
  }
}