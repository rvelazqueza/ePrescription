import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Settings, User, Shield, Bell } from 'lucide-angular';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Configuración</h1>
        <p class="text-gray-600">Ajustes del sistema y preferencias</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div *ngFor="let seccion of secciones" class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <lucide-icon [img]="seccion.icono" class="w-6 h-6 text-gray-600"></lucide-icon>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900">{{ seccion.titulo }}</h3>
              <p class="text-sm text-gray-500">{{ seccion.descripcion }}</p>
            </div>
          </div>
          
          <div class="mt-4">
            <button class="w-full bg-gray-50 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100">
              Configurar
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfigComponent {
  settingsIcon = Settings;
  userIcon = User;
  shieldIcon = Shield;
  bellIcon = Bell;

  secciones = [
    { titulo: 'Perfil de Usuario', descripcion: 'Información personal y credenciales', icono: this.userIcon },
    { titulo: 'Seguridad', descripcion: 'Configuración de seguridad y permisos', icono: this.shieldIcon },
    { titulo: 'Notificaciones', descripcion: 'Preferencias de notificaciones', icono: this.bellIcon },
    { titulo: 'Sistema', descripcion: 'Configuración general del sistema', icono: this.settingsIcon }
  ];
}