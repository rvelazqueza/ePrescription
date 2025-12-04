import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LucideAngularModule, BarChart3, Users, FileText, TrendingUp, CheckCircle2, DollarSign, Search, Download, Eye, Stethoscope, AlertTriangle } from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { RoleSuggestionService } from '../../../services/role-suggestion.service';
import { RoleDemoService } from '../../../services/role-demo.service';

interface DoctorActivity {
  id: string;
  doctorName: string;
  specialty: string;
  department: string;
  period: string;
  totalPrescriptions: number;
  activePrescriptions: number;
  dispensedPrescriptions: number;
  pendingPrescriptions: number;
  rejectedPrescriptions: number;
  averagePerDay: number;
  mostPrescribedMedicine: string;
  totalPatients: number;
  criticalAlerts: number;
  moderateAlerts: number;
  totalCost: number;
  workingDays: number;
}

@Component({
  selector: 'app-actividad-medico',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      title="Actividad por Médico" 
      description="Análisis estadístico de prescripciones por profesional"
      [icon]="barChart3Icon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-blue-600 via-indigo-500 to-purple-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

        <!-- Estadísticas principales -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Total recetas</p>
                  <p class="text-3xl font-bold text-gray-900">{{ totalStats.prescriptions }}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl">
                  <lucide-icon [img]="fileTextIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-green-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Pacientes</p>
                  <p class="text-3xl font-bold text-gray-900">{{ totalStats.patients }}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-xl">
                  <lucide-icon [img]="usersIcon" class="w-8 h-8 text-green-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-purple-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Dispensadas</p>
                  <p class="text-3xl font-bold text-gray-900">{{ totalStats.dispensed }}</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-xl">
                  <lucide-icon [img]="checkCircle2Icon" class="w-8 h-8 text-purple-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-orange-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Promedio/médico</p>
                  <p class="text-3xl font-bold text-gray-900">{{ totalStats.averagePerDoctor.toFixed(0) }}</p>
                </div>
                <div class="p-3 bg-orange-100 rounded-xl">
                  <lucide-icon [img]="trendingUpIcon" class="w-8 h-8 text-orange-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-cyan-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Costo total</p>
                  <p class="text-2xl font-bold text-gray-900">\${{ totalStats.totalCost.toFixed(2) }}</p>
                </div>
                <div class="p-3 bg-cyan-100 rounded-xl">
                  <lucide-icon [img]="dollarSignIcon" class="w-8 h-8 text-cyan-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Filtros y búsqueda -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <div class="flex gap-4">
            <div class="flex-1 relative">
              <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
              <input
                type="text"
                placeholder="Buscar por médico, especialidad o departamento..."
                [(ngModel)]="searchTerm"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select 
              [(ngModel)]="periodFilter"
              class="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="current_month">Mes actual</option>
              <option value="last_month">Mes anterior</option>
              <option value="last_3_months">Últimos 3 meses</option>
              <option value="year_to_date">Año en curso</option>
            </select>
            <button class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
              Exportar
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla de médicos -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Estadísticas por Médico</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Médico</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Especialidad</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total recetas</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Dispensadas</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rechazadas</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Promedio/día</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pacientes</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Alertas</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngFor="let doctor of filteredDoctors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <lucide-icon [img]="stethoscopeIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
                    </div>
                    <div>
                      <p class="font-medium">{{ doctor.doctorName }}</p>
                      <p class="text-sm text-gray-600">{{ doctor.department }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ doctor.specialty }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="font-semibold">{{ doctor.totalPrescriptions }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex flex-col items-end">
                    <span class="font-semibold text-green-600">{{ doctor.dispensedPrescriptions }}</span>
                    <span class="text-xs text-gray-600">
                      {{ ((doctor.dispensedPrescriptions / doctor.totalPrescriptions) * 100).toFixed(0) }}%
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="font-semibold text-red-600">{{ doctor.rejectedPrescriptions }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-300">
                    {{ doctor.averagePerDay.toFixed(1) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">{{ doctor.totalPatients }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex flex-col items-end gap-1">
                    <span *ngIf="doctor.criticalAlerts > 0" 
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-300">
                      {{ doctor.criticalAlerts }} críticas
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-300">
                      {{ doctor.moderateAlerts }} moderadas
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    (click)="openDoctorDetails(doctor)"
                    class="inline-flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    <lucide-icon [img]="eyeIcon" class="w-4 h-4"></lucide-icon>
                    Detalles
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal de detalles del médico -->
      <div *ngIf="selectedDoctor && isDetailsPanelOpen" 
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
           (click)="closeDetailsPanel()">
        <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
             (click)="$event.stopPropagation()">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold">Detalles de Actividad: {{ selectedDoctor.doctorName }}</h2>
            <p class="text-gray-600">{{ selectedDoctor.specialty }} - {{ selectedDoctor.department }}</p>
          </div>
          
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <p class="text-3xl font-semibold text-blue-600">{{ selectedDoctor.totalPrescriptions }}</p>
                <p class="text-sm text-gray-600 mt-1">Total recetas</p>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <p class="text-3xl font-semibold text-green-600">{{ selectedDoctor.dispensedPrescriptions }}</p>
                <p class="text-sm text-gray-600 mt-1">Dispensadas</p>
              </div>
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <p class="text-3xl font-semibold text-purple-600">{{ selectedDoctor.totalPatients }}</p>
                <p class="text-sm text-gray-600 mt-1">Pacientes</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-600">Promedio por día</label>
                <p class="text-xl font-semibold mt-1">{{ selectedDoctor.averagePerDay.toFixed(1) }} recetas</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">Medicamento más prescrito</label>
                <p class="font-medium mt-1">{{ selectedDoctor.mostPrescribedMedicine }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">Días trabajados</label>
                <p class="font-medium mt-1">{{ selectedDoctor.workingDays }} días</p>
              </div>
              <div>
                <label class="text-sm text-gray-600">Costo total prescripciones</label>
                <p class="text-xl font-semibold mt-1 text-cyan-600">\${{ selectedDoctor.totalCost.toFixed(2) }}</p>
              </div>
            </div>

            <div>
              <label class="text-sm text-gray-600 mb-3 block">Alertas clínicas</label>
              <div class="grid grid-cols-2 gap-3">
                <div class="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span class="text-sm font-medium text-red-900">Alertas críticas</span>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-300">
                    {{ selectedDoctor.criticalAlerts }}
                  </span>
                </div>
                <div class="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span class="text-sm font-medium text-yellow-900">Alertas moderadas</span>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-300">
                    {{ selectedDoctor.moderateAlerts }}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label class="text-sm text-gray-600 mb-3 block">Estado de prescripciones</label>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-2 border rounded">
                  <span class="text-sm">Activas</span>
                  <span class="font-semibold">{{ selectedDoctor.activePrescriptions }}</span>
                </div>
                <div class="flex items-center justify-between p-2 border rounded">
                  <span class="text-sm">Pendientes</span>
                  <span class="font-semibold text-orange-600">{{ selectedDoctor.pendingPrescriptions }}</span>
                </div>
                <div class="flex items-center justify-between p-2 border rounded">
                  <span class="text-sm">Rechazadas</span>
                  <span class="font-semibold text-red-600">{{ selectedDoctor.rejectedPrescriptions }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button 
              (click)="closeDetailsPanel()"
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cerrar
            </button>
            <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
              Exportar detalles
            </button>
          </div>
        </div>
      </div>

      </div>
    </app-page-layout>
  `
})
export class ActividadMedicoComponent implements OnInit, OnDestroy {
  barChart3Icon = BarChart3;
  usersIcon = Users;
  fileTextIcon = FileText;
  trendingUpIcon = TrendingUp;
  checkCircle2Icon = CheckCircle2;
  dollarSignIcon = DollarSign;
  searchIcon = Search;
  downloadIcon = Download;
  eyeIcon = Eye;
  stethoscopeIcon = Stethoscope;
  alertTriangleIcon = AlertTriangle;

  searchTerm = '';
  periodFilter = 'current_month';
  selectedDoctor: DoctorActivity | null = null;
  isDetailsPanelOpen = false;
  private roleSubscription?: Subscription;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Reportes y Analítica', route: '/reportes' },
    { label: 'Actividad por Médico' }
  ];

  // Datos mock de actividad por médico (basados en React)
  doctors: DoctorActivity[] = [
    {
      id: "DOC-001",
      doctorName: "Dr. Carlos Andrés Martínez López",
      specialty: "Medicina Interna",
      department: "Consulta Externa",
      period: "Septiembre 2024",
      totalPrescriptions: 156,
      activePrescriptions: 142,
      dispensedPrescriptions: 128,
      pendingPrescriptions: 14,
      rejectedPrescriptions: 12,
      averagePerDay: 5.2,
      mostPrescribedMedicine: "Paracetamol 500mg",
      totalPatients: 98,
      criticalAlerts: 3,
      moderateAlerts: 12,
      totalCost: 8456.32,
      workingDays: 30
    },
    {
      id: "DOC-002",
      doctorName: "Dra. Laura Sofía Ramírez Gómez",
      specialty: "Medicina Familiar",
      department: "Dirección Médica",
      period: "Septiembre 2024",
      totalPrescriptions: 234,
      activePrescriptions: 198,
      dispensedPrescriptions: 187,
      pendingPrescriptions: 11,
      rejectedPrescriptions: 25,
      averagePerDay: 7.8,
      mostPrescribedMedicine: "Losartán 50mg",
      totalPatients: 145,
      criticalAlerts: 5,
      moderateAlerts: 18,
      totalCost: 12678.45,
      workingDays: 30
    },
    {
      id: "DOC-003",
      doctorName: "Dra. Isabel Moreno Castro",
      specialty: "Cardiología",
      department: "Cardiología",
      period: "Septiembre 2024",
      totalPrescriptions: 189,
      activePrescriptions: 167,
      dispensedPrescriptions: 156,
      pendingPrescriptions: 11,
      rejectedPrescriptions: 18,
      averagePerDay: 6.3,
      mostPrescribedMedicine: "Atorvastatina 20mg",
      totalPatients: 112,
      criticalAlerts: 7,
      moderateAlerts: 24,
      totalCost: 15234.78,
      workingDays: 30
    },
    {
      id: "DOC-004",
      doctorName: "Dr. José Luis Torres Mendoza",
      specialty: "Endocrinología",
      department: "Medicina Especializada",
      period: "Septiembre 2024",
      totalPrescriptions: 198,
      activePrescriptions: 176,
      dispensedPrescriptions: 165,
      pendingPrescriptions: 11,
      rejectedPrescriptions: 20,
      averagePerDay: 6.6,
      mostPrescribedMedicine: "Metformina 850mg",
      totalPatients: 124,
      criticalAlerts: 4,
      moderateAlerts: 16,
      totalCost: 9876.54,
      workingDays: 30
    },
    {
      id: "DOC-005",
      doctorName: "Dr. Miguel Ángel Ruiz Sánchez",
      specialty: "Medicina General",
      department: "Urgencias",
      period: "Septiembre 2024",
      totalPrescriptions: 312,
      activePrescriptions: 278,
      dispensedPrescriptions: 261,
      pendingPrescriptions: 17,
      rejectedPrescriptions: 29,
      averagePerDay: 10.4,
      mostPrescribedMedicine: "Ibuprofeno 400mg",
      totalPatients: 198,
      criticalAlerts: 8,
      moderateAlerts: 31,
      totalCost: 11234.89,
      workingDays: 30
    }
  ];

  constructor(
    private roleSuggestionService: RoleSuggestionService,
    private roleDemoService: RoleDemoService
  ) {}

  ngOnInit() {
    // El modal de sugerencia de rol es manejado globalmente por el layout
    // No necesitamos lógica específica aquí
  }

  ngOnDestroy() {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

  get filteredDoctors(): DoctorActivity[] {
    return this.doctors.filter(doctor =>
      doctor.doctorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      doctor.department.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get totalStats() {
    return {
      prescriptions: this.doctors.reduce((sum, d) => sum + d.totalPrescriptions, 0),
      patients: this.doctors.reduce((sum, d) => sum + d.totalPatients, 0),
      dispensed: this.doctors.reduce((sum, d) => sum + d.dispensedPrescriptions, 0),
      totalCost: this.doctors.reduce((sum, d) => sum + d.totalCost, 0),
      averagePerDoctor: this.doctors.reduce((sum, d) => sum + d.totalPrescriptions, 0) / this.doctors.length
    };
  }

  openDoctorDetails(doctor: DoctorActivity) {
    this.selectedDoctor = doctor;
    this.isDetailsPanelOpen = true;
  }

  closeDetailsPanel() {
    this.isDetailsPanelOpen = false;
    this.selectedDoctor = null;
  }
}