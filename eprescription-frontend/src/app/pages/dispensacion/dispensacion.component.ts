import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Pill, Search, CheckCircle, Clock, AlertTriangle } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-dispensacion',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BreadcrumbsComponent],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumbs -->
      <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>
      
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dispensación</h1>
        <p class="text-gray-600">Control de dispensación de medicamentos</p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <lucide-icon [img]="searchIcon" class="h-5 w-5 text-gray-400"></lucide-icon>
          </div>
          <input
            type="text"
            placeholder="Buscar por código de prescripción..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Prescripciones Pendientes</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicamentos</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngFor="let dispensacion of dispensaciones">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ dispensacion.codigo }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ dispensacion.paciente }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ dispensacion.medicamentos }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getEstadoClass(dispensacion.estado)" class="px-2 py-1 text-xs font-semibold rounded-full">
                    {{ dispensacion.estado }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-900">Dispensar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DispensacionComponent {
  searchIcon = Search;
  pillIcon = Pill;
  checkCircleIcon = CheckCircle;
  clockIcon = Clock;
  alertTriangleIcon = AlertTriangle;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dispensación' }
  ];

  dispensaciones = [
    { codigo: 'RX001', paciente: 'María González', medicamentos: 'Ibuprofeno 400mg', estado: 'pendiente' },
    { codigo: 'RX002', paciente: 'Juan Pérez', medicamentos: 'Atenolol 50mg', estado: 'dispensado' },
    { codigo: 'RX003', paciente: 'Ana López', medicamentos: 'Amoxicilina 500mg', estado: 'pendiente' }
  ];

  getEstadoClass(estado: string): string {
    const classes = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'dispensado': 'bg-green-100 text-green-800',
      'vencido': 'bg-red-100 text-red-800'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }
}