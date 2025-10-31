import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Shield,
  Smartphone,
  Monitor,
  AlertCircle,
  LogOut,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-angular';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';

interface SesionUsuario {
  id: string;
  deviceName: string;
  ipAddress: string;
  location: string;
  userAgent: string;
  createdAt: string;
  lastActivity: string;
  expiresAt: string;
  trusted: boolean;
  isCurrentSession: boolean;
}

@Component({
  selector: 'app-mis-sesiones',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      [title]="'Mis sesiones'"
      [description]="'Administra tus sesiones activas y dispositivos de confianza'"
      [icon]="shieldIcon"
      [breadcrumbItems]="breadcrumbItems"
      [hasActionButton]="false"
      [headerGradient]="'from-blue-600 via-purple-500 to-indigo-600'">

      <!-- Content -->
      <div class="space-y-6">
        
        <!-- Alert de seguridad -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <lucide-icon [img]="shieldIcon" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></lucide-icon>
            <div>
              <h4 class="font-medium text-blue-900">Seguridad de tu cuenta:</h4>
              <p class="text-sm text-blue-800 mt-1">
                Si detectas actividad sospechosa o un dispositivo que no reconoces, cierra esa sesión inmediatamente y cambia tu contraseña.
              </p>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow border-l-4 border-l-blue-500 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium">Sesiones activas</p>
                <p class="text-3xl font-bold text-gray-900">{{ sesiones.length }}</p>
              </div>
              <div class="p-3 bg-blue-100 rounded-lg">
                <lucide-icon [img]="shieldIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow border-l-4 border-l-green-500 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium">Dispositivos de confianza</p>
                <p class="text-3xl font-bold text-gray-900">{{ getDispositivosConfianza() }}</p>
              </div>
              <div class="p-3 bg-green-100 rounded-lg">
                <lucide-icon [img]="checkCircle2Icon" class="w-8 h-8 text-green-600"></lucide-icon>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow border-l-4 border-l-orange-500 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 font-medium">Nuevos dispositivos</p>
                <p class="text-3xl font-bold text-gray-900">{{ getNuevosDispositivos() }}</p>
              </div>
              <div class="p-3 bg-orange-100 rounded-lg">
                <lucide-icon [img]="alertCircleIcon" class="w-8 h-8 text-orange-600"></lucide-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Sesión actual -->
        <div class="bg-white rounded-lg shadow-lg border border-blue-200">
          <div class="bg-blue-50 px-6 py-4 border-b border-blue-200 rounded-t-lg">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-blue-900">Sesión actual</h2>
                <p class="text-sm text-blue-700">Este dispositivo</p>
              </div>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                Activa
              </span>
            </div>
          </div>
          
          <div class="p-6" *ngIf="sesionActual">
            <div class="flex items-start gap-4">
              <div class="p-3 bg-blue-600 rounded-lg text-white">
                <lucide-icon [img]="getDeviceIcon(sesionActual.deviceName)" class="w-5 h-5"></lucide-icon>
              </div>
              <div class="flex-1 space-y-3">
                <h4 class="font-medium text-gray-900">{{ sesionActual.deviceName }}</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="mapPinIcon" class="w-4 h-4"></lucide-icon>
                    <span>{{ sesionActual.location }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="clockIcon" class="w-4 h-4"></lucide-icon>
                    <span>{{ getTimeSinceActivity(sesionActual.lastActivity) }}</span>
                  </div>
                  <div class="col-span-1 md:col-span-2">
                    <span class="font-medium">IP:</span> {{ sesionActual.ipAddress }}
                  </div>
                  <div class="col-span-1 md:col-span-2 text-xs text-gray-500">
                    {{ sesionActual.userAgent }}
                  </div>
                </div>
                <div class="flex items-center gap-2 pt-2" *ngIf="sesionActual.trusted">
                  <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 text-green-600"></lucide-icon>
                  <span class="text-sm text-green-700">Dispositivo de confianza</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
              <div class="text-sm text-gray-600">
                <p><span class="font-medium">Iniciada:</span> {{ formatDate(sesionActual.createdAt) }}</p>
                <p><span class="font-medium">Expira:</span> {{ formatDate(sesionActual.expiresAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Otras sesiones activas -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Otras sesiones activas</h2>
              <p class="text-sm text-gray-600">
                {{ otrasSesiones.length }} sesión{{ otrasSesiones.length !== 1 ? 'es' : '' }} en otro{{ otrasSesiones.length !== 1 ? 's' : '' }} dispositivo{{ otrasSesiones.length !== 1 ? 's' : '' }}
              </p>
            </div>
            <button 
              *ngIf="otrasSesiones.length > 0"
              (click)="showTerminateAllModal = true"
              class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-medium">
              <lucide-icon [img]="logOutIcon" class="w-4 h-4 mr-2"></lucide-icon>
              Cerrar todas
            </button>
          </div>
          
          <div class="p-6">
            <div *ngIf="otrasSesiones.length === 0" class="text-center py-8">
              <lucide-icon [img]="checkCircle2Icon" class="w-12 h-12 text-green-500 mx-auto mb-3"></lucide-icon>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No hay otras sesiones activas</h3>
              <p class="text-gray-600">No tienes otras sesiones activas en otros dispositivos.</p>
            </div>
            
            <div class="space-y-4" *ngIf="otrasSesiones.length > 0">
              <div 
                *ngFor="let session of otrasSesiones" 
                class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div class="flex items-start gap-4">
                  <div [class]="session.trusted ? 'p-3 bg-gray-100 text-gray-700 rounded-lg' : 'p-3 bg-orange-100 text-orange-600 rounded-lg'">
                    <lucide-icon [img]="getDeviceIcon(session.deviceName)" class="w-5 h-5"></lucide-icon>
                  </div>
                  <div class="flex-1 space-y-2">
                    <div class="flex items-center justify-between">
                      <h4 class="font-medium text-gray-900">{{ session.deviceName }}</h4>
                      <span *ngIf="session.trusted" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <lucide-icon [img]="checkCircle2Icon" class="w-3 h-3 mr-1"></lucide-icon>
                        Confiable
                      </span>
                      <span *ngIf="!session.trusted" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <lucide-icon [img]="alertCircleIcon" class="w-3 h-3 mr-1"></lucide-icon>
                        Nuevo
                      </span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div class="flex items-center gap-2">
                        <lucide-icon [img]="mapPinIcon" class="w-4 h-4"></lucide-icon>
                        <span>{{ session.location }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <lucide-icon [img]="clockIcon" class="w-4 h-4"></lucide-icon>
                        <span>{{ getTimeSinceActivity(session.lastActivity) }}</span>
                      </div>
                      <div class="col-span-1 md:col-span-2">
                        <span class="font-medium">IP:</span> {{ session.ipAddress }}
                      </div>
                      <div class="col-span-1 md:col-span-2 text-xs text-gray-500">
                        {{ session.userAgent }}
                      </div>
                    </div>
                    <div class="flex items-center justify-between pt-2 text-sm text-gray-600">
                      <div>
                        <p><span class="font-medium">Iniciada:</span> {{ formatDate(session.createdAt) }}</p>
                        <p><span class="font-medium">Expira:</span> {{ formatDate(session.expiresAt) }}</p>
                      </div>
                      <button
                        (click)="openTerminateModal(session)"
                        class="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <lucide-icon [img]="logOutIcon" class="w-4 h-4 mr-2"></lucide-icon>
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </div>

                <div *ngIf="!session.trusted" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <div class="flex items-start gap-2">
                    <lucide-icon [img]="alertTriangleIcon" class="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"></lucide-icon>
                    <div class="text-sm">
                      <p class="font-medium text-red-900">Dispositivo nuevo detectado.</p>
                      <p class="text-red-800 mt-1">Si no reconoces esta actividad, cierra esta sesión inmediatamente y cambia tu contraseña.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Información de seguridad -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Información de seguridad</h2>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex gap-3 p-4 bg-gray-50 rounded-lg">
              <lucide-icon [img]="shieldIcon" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></lucide-icon>
              <div class="space-y-1">
                <h4 class="font-medium text-gray-900">Dispositivos de confianza</h4>
                <p class="text-sm text-gray-600">
                  Los dispositivos marcados como confiables no requieren MFA durante 30 días. Puedes revocar esta confianza en cualquier momento cerrando la sesión.
                </p>
              </div>
            </div>

            <div class="flex gap-3 p-4 bg-gray-50 rounded-lg">
              <lucide-icon [img]="alertCircleIcon" class="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5"></lucide-icon>
              <div class="space-y-1">
                <h4 class="font-medium text-gray-900">Actividad sospechosa</h4>
                <p class="text-sm text-gray-600">
                  Siempre que detectes una sesión desde una ubicación o dispositivo que no reconoces, ciérrala inmediatamente y actualiza tu contraseña desde Configuración de Seguridad.
                </p>
              </div>
            </div>

            <div class="flex gap-3 p-4 bg-gray-50 rounded-lg">
              <lucide-icon [img]="clockIcon" class="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"></lucide-icon>
              <div class="space-y-1">
                <h4 class="font-medium text-gray-900">Expiración de sesiones</h4>
                <p class="text-sm text-gray-600">
                  Las sesiones inactivas expiran automáticamente después de 7 días. Las sesiones activas se renuevan automáticamente mientras uses el sistema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-page-layout>

    <!-- Modal: Cerrar sesión específica -->
    <div *ngIf="showTerminateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Cerrar sesión</h3>
          <p class="text-gray-600 mb-4">¿Confirmas que deseas cerrar esta sesión?</p>
          
          <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div class="flex items-start gap-2">
              <lucide-icon [img]="logOutIcon" class="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"></lucide-icon>
              <p class="text-sm text-red-800">
                Esta acción cerrará inmediatamente la sesión en el dispositivo seleccionado. El usuario deberá iniciar sesión nuevamente.
              </p>
            </div>
          </div>
          
          <div class="flex gap-3 justify-end">
            <button
              (click)="closeTerminateModal()"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Cancelar
            </button>
            <button
              (click)="terminateSession()"
              [disabled]="loading"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50">
              {{ loading ? 'Cerrando...' : 'Cerrar sesión' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Cerrar todas las sesiones -->
    <div *ngIf="showTerminateAllModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Cerrar todas las sesiones</h3>
          <p class="text-gray-600 mb-4">¿Confirmas que deseas cerrar todas las sesiones activas excepto la actual?</p>
          
          <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div class="flex items-start gap-2">
              <lucide-icon [img]="alertCircleIcon" class="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"></lucide-icon>
              <div class="text-sm text-red-800">
                <p class="font-medium">Precaución:</p>
                <p class="mt-1">
                  Esta acción cerrará inmediatamente {{ otrasSesiones.length }} sesión{{ otrasSesiones.length !== 1 ? 'es' : '' }} activa{{ otrasSesiones.length !== 1 ? 's' : '' }} en otros dispositivos. Deberás iniciar sesión nuevamente en cada uno.
                </p>
              </div>
            </div>
          </div>
          
          <div class="flex gap-3 justify-end">
            <button
              (click)="showTerminateAllModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Cancelar
            </button>
            <button
              (click)="terminateAllSessions()"
              [disabled]="loading"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50">
              {{ loading ? 'Cerrando...' : 'Cerrar todas las sesiones' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MisSesionesComponent implements OnInit {
  // Icons
  shieldIcon = Shield;
  smartphoneIcon = Smartphone;
  monitorIcon = Monitor;
  alertCircleIcon = AlertCircle;
  logOutIcon = LogOut;
  mapPinIcon = MapPin;
  clockIcon = Clock;
  checkCircle2Icon = CheckCircle2;
  xCircleIcon = XCircle;
  alertTriangleIcon = AlertTriangle;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Seguridad y usuarios', route: '/seguridad' },
    { label: 'Mis sesiones', route: '/seguridad/mis-sesiones' }
  ];

  // State
  showTerminateModal = false;
  showTerminateAllModal = false;
  selectedSession: SesionUsuario | null = null;
  loading = false;

  // Mock data - sesiones del usuario actual
  sesiones: SesionUsuario[] = [
    {
      id: "sess-001",
      deviceName: "Chrome en Windows 11",
      ipAddress: "192.168.1.100",
      location: "San José, Costa Rica",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0.0.0",
      createdAt: "2025-10-06T02:15:00Z",
      lastActivity: "2025-10-06T02:15:00Z",
      expiresAt: "2025-10-13T02:15:00Z",
      trusted: true,
      isCurrentSession: true
    },
    {
      id: "sess-002",
      deviceName: "Safari en iPhone 14",
      ipAddress: "192.168.1.105",
      location: "San José, Costa Rica",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/604.1",
      createdAt: "2025-10-05T08:20:00Z",
      lastActivity: "2025-10-05T08:20:00Z",
      expiresAt: "2025-11-04T06:20:00Z",
      trusted: true,
      isCurrentSession: false
    },
    {
      id: "sess-003",
      deviceName: "Firefox en Ubuntu 22.04",
      ipAddress: "201.194.23.45",
      location: "Heredia, Costa Rica",
      userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:119.0) Firefox/119.0",
      createdAt: "2025-10-06T00:00:00Z",
      lastActivity: "2025-10-06T00:00:00Z",
      expiresAt: "2025-10-06T12:00:00Z",
      trusted: false,
      isCurrentSession: false
    }
  ];

  get sesionActual(): SesionUsuario | undefined {
    return this.sesiones.find(s => s.isCurrentSession);
  }

  get otrasSesiones(): SesionUsuario[] {
    return this.sesiones.filter(s => !s.isCurrentSession);
  }

  ngOnInit() {
    // Initialize component
  }

  getDeviceIcon(deviceName: string) {
    if (deviceName.toLowerCase().includes('iphone') || deviceName.toLowerCase().includes('android')) {
      return this.smartphoneIcon;
    }
    return this.monitorIcon;
  }

  getDispositivosConfianza(): number {
    return this.sesiones.filter(s => s.trusted).length;
  }

  getNuevosDispositivos(): number {
    return this.sesiones.filter(s => !s.trusted).length;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-CR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTimeSinceActivity(dateString: string): string {
    const now = new Date();
    const activity = new Date(dateString);
    const diffMs = now.getTime() - activity.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Activa ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours}h`;

    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
  }

  openTerminateModal(session: SesionUsuario) {
    this.selectedSession = session;
    this.showTerminateModal = true;
  }

  closeTerminateModal() {
    this.showTerminateModal = false;
    this.selectedSession = null;
  }

  terminateSession() {
    if (!this.selectedSession) return;

    this.loading = true;

    // Simular llamada API
    setTimeout(() => {
      // Remover sesión de la lista
      this.sesiones = this.sesiones.filter(s => s.id !== this.selectedSession!.id);

      // Mostrar mensaje de éxito (aquí podrías usar un servicio de notificaciones)
      console.log('Sesión cerrada exitosamente');

      this.loading = false;
      this.closeTerminateModal();
    }, 1000);
  }

  terminateAllSessions() {
    this.loading = true;

    // Simular llamada API
    setTimeout(() => {
      // Mantener solo la sesión actual
      this.sesiones = this.sesiones.filter(s => s.isCurrentSession);

      // Mostrar mensaje de éxito
      console.log('Todas las sesiones cerradas exitosamente');

      this.loading = false;
      this.showTerminateAllModal = false;
    }, 1000);
  }
}