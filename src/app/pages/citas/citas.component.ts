import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Calendar, Plus, Search, Clock, User, Phone } from 'lucide-angular';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Citas Médicas</h1>
          <p class="text-gray-600">Gestión de citas y agenda médica</p>
        </div>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2">
          <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
          <span>Nueva Cita</span>
        </button>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <lucide-icon [img]="searchIcon" class="h-5 w-5 text-gray-400"></lucide-icon>
          </div>
          <input
            type="text"
            placeholder="Buscar citas por paciente o fecha..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Citas de Hoy</h3>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div *ngFor="let cita of citasHoy" class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div class="flex items-center space-x-4">
                    <div class="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <lucide-icon [img]="clockIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{{ cita.paciente }}</p>
                      <p class="text-sm text-gray-500">{{ cita.tipo }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-medium text-gray-900">{{ cita.hora }}</p>
                    <p class="text-sm text-gray-500">{{ cita.duracion }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Calendario</h3>
            </div>
            <div class="p-6">
              <div class="text-center">
                <lucide-icon [img]="calendarIcon" class="w-16 h-16 mx-auto text-gray-400 mb-4"></lucide-icon>
                <p class="text-gray-500">Vista de calendario próximamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CitasComponent {
  plusIcon = Plus;
  searchIcon = Search;
  calendarIcon = Calendar;
  clockIcon = Clock;
  userIcon = User;
  phoneIcon = Phone;

  citasHoy = [
    { paciente: 'María González', tipo: 'Control general', hora: '09:00', duracion: '30 min' },
    { paciente: 'Juan Pérez', tipo: 'Seguimiento', hora: '10:30', duracion: '45 min' },
    { paciente: 'Ana López', tipo: 'Primera consulta', hora: '14:00', duracion: '60 min' }
  ];
}