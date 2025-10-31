import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule, Plus, Search, Filter, FileText, Calendar, User, Edit, Eye, X, CheckCircle, Clock, AlertTriangle, FileEdit, Pill, BarChart, Copy } from 'lucide-angular';

@Component({
  selector: 'app-prescripciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <!-- Header visual -->
      <div class="relative h-40 rounded-lg overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-500/60 flex items-center px-8">
          <div>
            <h2 class="text-white text-2xl mb-1">Prescripciones Médicas</h2>
            <p class="text-white/90">Centro de gestión de recetas y prescripciones</p>
          </div>
        </div>
      </div>

      <!-- Estadísticas rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow border-l-4 border-l-blue-500 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Prescripciones</p>
              <p class="text-2xl font-semibold text-gray-900">{{ totalPrescripciones }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-lg">
              <lucide-icon [img]="fileTextIcon" class="w-6 h-6 text-blue-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-orange-500 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Borradores</p>
              <p class="text-2xl font-semibold text-gray-900">{{ totalBorradores }}</p>
            </div>
            <div class="p-3 bg-orange-100 rounded-lg">
              <lucide-icon [img]="fileEditIcon" class="w-6 h-6 text-orange-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-green-500 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Emitidas Hoy</p>
              <p class="text-2xl font-semibold text-gray-900">{{ emitidas }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-lg">
              <lucide-icon [img]="checkCircleIcon" class="w-6 h-6 text-green-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-purple-500 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Medicamentos</p>
              <p class="text-2xl font-semibold text-gray-900">{{ totalMedicamentos }}</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-lg">
              <lucide-icon [img]="pillIcon" class="w-6 h-6 text-purple-600"></lucide-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer" 
             (click)="navigateToNewPrescription()">
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-blue-100 rounded-lg">
              <lucide-icon [img]="plusIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Nueva Receta</h3>
              <p class="text-sm text-gray-600">Crear una nueva prescripción médica</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
             (click)="navigateToDrafts()">
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-orange-100 rounded-lg">
              <lucide-icon [img]="fileEditIcon" class="w-8 h-8 text-orange-600"></lucide-icon>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Mis Borradores</h3>
              <p class="text-sm text-gray-600">{{ totalBorradores }} borrador{{ totalBorradores !== 1 ? 'es' : '' }} pendiente{{ totalBorradores !== 1 ? 's' : '' }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
             (click)="navigateToEmitted()">
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-green-100 rounded-lg">
              <lucide-icon [img]="checkCircleIcon" class="w-8 h-8 text-green-600"></lucide-icon>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Recetas Emitidas</h3>
              <p class="text-sm text-gray-600">Ver historial de prescripciones</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
             (click)="navigateToDuplicate()">
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-teal-100 rounded-lg">
              <lucide-icon [img]="copyIcon" class="w-8 h-8 text-teal-600"></lucide-icon>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Duplicar Receta</h3>
              <p class="text-sm text-gray-600">Crear prescripción basada en receta existente</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Búsqueda y filtros -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="filterPrescriptions()"
              placeholder="Buscar por paciente, número de receta o ID..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div class="flex gap-2">
            <select 
              [(ngModel)]="statusFilter"
              (change)="filterPrescriptions()"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="borrador">Borradores</option>
              <option value="emitida">Emitidas</option>
              <option value="dispensada">Dispensadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tabla de prescripciones recientes -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <lucide-icon [img]="fileTextIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Prescripciones Recientes</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ filteredPrescripciones.length }} prescripción{{ filteredPrescripciones.length !== 1 ? 'es' : '' }} encontrada{{ filteredPrescripciones.length !== 1 ? 's' : '' }}
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2">
                <lucide-icon [img]="barChartIcon" class="w-4 h-4"></lucide-icon>
                Reportes
              </button>
            </div>
          </div>
        </div>
        
        <div class="p-0">
          <div *ngIf="filteredPrescripciones.length === 0" class="p-12 text-center">
            <div class="flex justify-center mb-4">
              <div class="p-4 bg-gray-100 rounded-full">
                <lucide-icon [img]="fileTextIcon" class="w-12 h-12 text-gray-400"></lucide-icon>
              </div>
            </div>
            <h3 class="text-lg text-gray-900 mb-2">No hay prescripciones</h3>
            <p class="text-gray-600">
              {{ searchTerm 
                ? "No se encontraron prescripciones que coincidan con tu búsqueda."
                : "No tienes prescripciones registradas aún."
              }}
            </p>
          </div>

          <div *ngIf="filteredPrescripciones.length > 0" class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Receta</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad/Sexo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamentos</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let prescripcion of filteredPrescripciones" 
                    class="hover:bg-blue-50/50 cursor-pointer transition-all"
                    (dblclick)="viewPrescription(prescripcion)">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <lucide-icon [img]="fileTextIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                      <div class="flex flex-col">
                        <span class="font-medium">{{ prescripcion.id }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p class="font-medium text-gray-900">{{ prescripcion.paciente.nombre }}</p>
                      <p class="text-xs text-gray-500">{{ prescripcion.paciente.cedula }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <lucide-icon [img]="userIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                      <span class="text-sm">{{ prescripcion.paciente.edad }} años / {{ prescripcion.paciente.genero }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <lucide-icon [img]="pillIcon" class="w-4 h-4 text-purple-600"></lucide-icon>
                      <span>{{ prescripcion.medicamentos.length }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <lucide-icon [img]="calendarIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                      <span class="text-sm">{{ prescripcion.fecha }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getEstadoClass(prescripcion.estado)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      <lucide-icon 
                        [img]="getEstadoIcon(prescripcion.estado)" 
                        class="w-3 h-3 mr-1">
                      </lucide-icon>
                      {{ getEstadoTexto(prescripcion.estado) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end gap-2">
                      <button 
                        (click)="viewPrescription(prescripcion)"
                        class="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <lucide-icon [img]="eyeIcon" class="w-4 h-4"></lucide-icon>
                        Ver
                      </button>
                      <button 
                        *ngIf="prescripcion.estado === 'borrador'"
                        (click)="editPrescription(prescripcion)"
                        class="text-green-600 hover:text-green-900 flex items-center gap-1"
                      >
                        <lucide-icon [img]="editIcon" class="w-4 h-4"></lucide-icon>
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Información adicional -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div class="flex items-start space-x-3">
          <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-blue-600 mt-0.5"></lucide-icon>
          <div>
            <h4 class="font-medium text-blue-900 mb-1">Centro de Prescripciones</h4>
            <p class="text-sm text-blue-800">
              Desde aquí puedes gestionar todas tus prescripciones médicas. Haz doble clic en cualquier fila para ver detalles rápidos. 
              Los borradores pueden editarse hasta que sean finalizados y firmados digitalmente.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PrescripcionesComponent {
  plusIcon = Plus;
  searchIcon = Search;
  filterIcon = Filter;
  fileTextIcon = FileText;
  fileEditIcon = FileEdit;
  calendarIcon = Calendar;
  userIcon = User;
  editIcon = Edit;
  eyeIcon = Eye;
  xIcon = X;
  checkCircleIcon = CheckCircle;
  clockIcon = Clock;
  alertTriangleIcon = AlertTriangle;
  pillIcon = Pill;
  barChartIcon = BarChart;
  copyIcon = Copy;

  searchTerm = '';
  statusFilter = '';
  filteredPrescripciones: any[] = [];
  
  // Estadísticas
  totalPrescripciones = 0;
  totalBorradores = 0;
  emitidas = 0;
  totalMedicamentos = 0;

  prescripciones = [
    {
      id: 'RX-2025-009847',
      fecha: '27/09/2025',
      paciente: { 
        nombre: 'María Elena González Rodríguez', 
        cedula: 'CC-52.841.963',
        edad: 45,
        genero: 'F'
      },
      medico: { nombre: 'Dr. Carlos Andrés Martínez López', especialidad: 'Medicina General' },
      medicamentos: [
        { nombre: 'Ibuprofeno 400mg' }, 
        { nombre: 'Omeprazol 20mg' },
        { nombre: 'Paracetamol 500mg' }
      ],
      estado: 'emitida'
    },
    {
      id: 'RX-2025-009846',
      fecha: '26/09/2025',
      paciente: { 
        nombre: 'Juan Carlos Martínez López', 
        cedula: 'CC-43.729.541',
        edad: 62,
        genero: 'M'
      },
      medico: { nombre: 'Dra. María Elena Rodríguez Silva', especialidad: 'Cardiología' },
      medicamentos: [
        { nombre: 'Atenolol 50mg' },
        { nombre: 'Aspirina 100mg' }
      ],
      estado: 'dispensada'
    },
    {
      id: 'RX-2025-009845',
      fecha: '26/09/2025',
      paciente: { 
        nombre: 'Ana Patricia Rojas Fernández', 
        cedula: 'CC-38.615.892',
        edad: 38,
        genero: 'F'
      },
      medico: { nombre: 'Dr. Jorge Enrique Salazar Ramírez', especialidad: 'Pediatría' },
      medicamentos: [
        { nombre: 'Amoxicilina 500mg' },
        { nombre: 'Acetaminofén 500mg' },
        { nombre: 'Loratadina 10mg' },
        { nombre: 'Vitamina C 500mg' },
        { nombre: 'Probióticos' }
      ],
      estado: 'borrador'
    },
    {
      id: 'RX-2025-009844',
      fecha: '25/09/2025',
      paciente: { 
        nombre: 'Roberto José Sánchez Mora', 
        cedula: 'CC-51.428.967',
        edad: 51,
        genero: 'M'
      },
      medico: { nombre: 'Dr. Carlos Andrés Martínez López', especialidad: 'Medicina General' },
      medicamentos: [
        { nombre: 'Metformina 850mg' }
      ],
      estado: 'emitida'
    },
    {
      id: 'RX-2025-009843',
      fecha: '25/09/2025',
      paciente: { 
        nombre: 'Laura Sofía Díaz Ramírez', 
        cedula: 'CC-29.847.563',
        edad: 29,
        genero: 'F'
      },
      medico: { nombre: 'Dra. Patricia Elena Gómez Suárez', especialidad: 'Ginecología' },
      medicamentos: [
        { nombre: 'Ácido Fólico 5mg' },
        { nombre: 'Hierro 65mg' },
        { nombre: 'Vitamina D3 1000UI' },
        { nombre: 'Calcio 600mg' }
      ],
      estado: 'borrador'
    }
  ];

  constructor(private router: Router) {
    this.filteredPrescripciones = [...this.prescripciones];
    this.calcularEstadisticas();
  }

  calcularEstadisticas() {
    this.totalPrescripciones = this.prescripciones.length;
    this.totalBorradores = this.prescripciones.filter(p => p.estado === 'borrador').length;
    this.emitidas = this.prescripciones.filter(p => 
      p.estado === 'emitida' && p.fecha === '27/09/2025'
    ).length;
    this.totalMedicamentos = this.prescripciones.reduce((total, p) => 
      total + p.medicamentos.length, 0
    );
  }

  navigateToNewPrescription() {
    this.router.navigate(['/prescripciones/nueva']);
  }

  navigateToDrafts() {
    this.router.navigate(['/prescripciones/borradores']);
  }

  navigateToEmitted() {
    this.router.navigate(['/prescripciones/emitidas']);
  }

  navigateToDuplicate() {
    this.router.navigate(['/prescripciones/duplicar']);
  }

  viewPrescription(prescripcion: any) {
    console.log('Ver prescripción:', prescripcion);
  }

  editPrescription(prescripcion: any) {
    console.log('Editar prescripción:', prescripcion);
  }

  filterPrescriptions() {
    let filtered = [...this.prescripciones];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.id.toLowerCase().includes(term) ||
        p.paciente.nombre.toLowerCase().includes(term) ||
        p.paciente.cedula.toLowerCase().includes(term) ||
        p.medico.nombre.toLowerCase().includes(term)
      );
    }

    if (this.statusFilter) {
      filtered = filtered.filter(p => p.estado === this.statusFilter);
    }

    this.filteredPrescripciones = filtered;
  }

  getEstadoClass(estado: string): string {
    const classes = {
      'borrador': 'bg-orange-100 text-orange-800 border-orange-200',
      'emitida': 'bg-blue-100 text-blue-800 border-blue-200',
      'dispensada': 'bg-green-100 text-green-800 border-green-200',
      'cancelada': 'bg-red-100 text-red-800 border-red-200'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  getEstadoIcon(estado: string): any {
    const icons = {
      'borrador': this.alertTriangleIcon,
      'emitida': this.checkCircleIcon,
      'dispensada': this.checkCircleIcon,
      'cancelada': this.xIcon
    };
    return icons[estado as keyof typeof icons] || this.clockIcon;
  }

  getEstadoTexto(estado: string): string {
    const textos = {
      'borrador': 'Borrador',
      'emitida': 'Emitida',
      'dispensada': 'Dispensada',
      'cancelada': 'Cancelada'
    };
    return textos[estado as keyof typeof textos] || estado;
  }
}