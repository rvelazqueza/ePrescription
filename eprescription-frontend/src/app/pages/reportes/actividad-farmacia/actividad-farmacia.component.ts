import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LucideAngularModule, Activity, Package, DollarSign, Clock, TrendingDown, Download } from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { RoleSuggestionService } from '../../../services/role-suggestion.service';
import { RoleDemoService } from '../../../services/role-demo.service';

interface PharmacyActivity {
  id: string;
  date: string;
  totalDispensations: number;
  totalPrescriptions: number;
  pendingPrescriptions: number;
  rejectedPrescriptions: number;
  verificationTime: string;
  dispensationTime: string;
  stockAdjustments: number;
  lowStockAlerts: number;
  totalValue: number;
  pharmacist: string;
  shift: string;
}

@Component({
  selector: 'app-actividad-farmacia',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      title="Actividad de Farmacia" 
      description="Monitoreo de dispensaciones y operaciones farmacéuticas"
      [icon]="activityIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-green-600 via-emerald-500 to-teal-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

        <!-- Estadísticas principales -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-green-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Dispensaciones</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.totalDispensations }}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-xl">
                  <lucide-icon [img]="packageIcon" class="w-8 h-8 text-green-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Valor total</p>
                  <p class="text-2xl font-bold text-gray-900">\${{ stats.totalValue.toFixed(2) }}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl">
                  <lucide-icon [img]="dollarSignIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-orange-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Pendientes</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.pending }}</p>
                </div>
                <div class="p-3 bg-orange-100 rounded-xl">
                  <lucide-icon [img]="clockIcon" class="w-8 h-8 text-orange-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-purple-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Tiempo promedio</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.avgTime }}</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-xl">
                  <lucide-icon [img]="activityIcon" class="w-8 h-8 text-purple-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-cyan-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Ajustes stock</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.stockAdjustments }}</p>
                </div>
                <div class="p-3 bg-cyan-100 rounded-xl">
                  <lucide-icon [img]="trendingDownIcon" class="w-8 h-8 text-cyan-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <div class="flex gap-4">
            <select 
              [(ngModel)]="dateFilter"
              class="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Hoy</option>
              <option value="yesterday">Ayer</option>
              <option value="last_7_days">Últimos 7 días</option>
              <option value="this_month">Este mes</option>
            </select>
            <select 
              [(ngModel)]="shiftFilter"
              class="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los turnos</option>
              <option value="Mañana">Turno mañana</option>
              <option value="Tarde">Turno tarde</option>
              <option value="Noche">Turno noche</option>
            </select>
            <button class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 ml-auto">
              <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
              Exportar
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla de actividad farmacéutica -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Registro de Actividad Farmacéutica</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turno</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmacéutico</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Dispensaciones</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rechazadas</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tiempo verificación</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tiempo dispensación</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ajustes stock</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngFor="let item of filteredActivity">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ' + getShiftClass(item.shift)">
                    {{ item.shift }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.pharmacist }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex flex-col items-end">
                    <span class="font-semibold">{{ item.totalDispensations }}</span>
                    <span class="text-xs text-gray-600">de {{ item.totalPrescriptions }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-red-600">{{ item.rejectedPrescriptions }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-300">
                    {{ item.verificationTime }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                    {{ item.dispensationTime }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">{{ item.stockAdjustments }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="font-semibold">\${{ item.totalValue.toFixed(2) }}</span>
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
export class ActividadFarmaciaComponent implements OnInit, OnDestroy {
  activityIcon = Activity;
  packageIcon = Package;
  dollarSignIcon = DollarSign;
  clockIcon = Clock;
  trendingDownIcon = TrendingDown;
  downloadIcon = Download;

  dateFilter = 'today';
  shiftFilter = 'all';
  private roleSubscription?: Subscription;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Reportes y Analítica', route: '/reportes' },
    { label: 'Actividad de Farmacia' }
  ];

  // Datos mock de actividad de farmacia (basados en React)
  activity: PharmacyActivity[] = [
    {
      id: "PHARM-001",
      date: "2024-10-01",
      totalDispensations: 45,
      totalPrescriptions: 52,
      pendingPrescriptions: 7,
      rejectedPrescriptions: 3,
      verificationTime: "4.2 min",
      dispensationTime: "6.8 min",
      stockAdjustments: 5,
      lowStockAlerts: 12,
      totalValue: 2345.67,
      pharmacist: "Ana García",
      shift: "Mañana"
    },
    {
      id: "PHARM-002",
      date: "2024-10-01",
      totalDispensations: 38,
      totalPrescriptions: 42,
      pendingPrescriptions: 4,
      rejectedPrescriptions: 2,
      verificationTime: "3.9 min",
      dispensationTime: "6.2 min",
      stockAdjustments: 3,
      lowStockAlerts: 8,
      totalValue: 1987.34,
      pharmacist: "Luis Fernández",
      shift: "Tarde"
    },
    {
      id: "PHARM-003",
      date: "2024-09-30",
      totalDispensations: 52,
      totalPrescriptions: 58,
      pendingPrescriptions: 6,
      rejectedPrescriptions: 4,
      verificationTime: "4.5 min",
      dispensationTime: "7.1 min",
      stockAdjustments: 7,
      lowStockAlerts: 15,
      totalValue: 2876.45,
      pharmacist: "Ana García",
      shift: "Mañana"
    },
    {
      id: "PHARM-004",
      date: "2024-09-30",
      totalDispensations: 41,
      totalPrescriptions: 47,
      pendingPrescriptions: 6,
      rejectedPrescriptions: 3,
      verificationTime: "4.1 min",
      dispensationTime: "6.5 min",
      stockAdjustments: 4,
      lowStockAlerts: 10,
      totalValue: 2156.78,
      pharmacist: "Luis Fernández",
      shift: "Tarde"
    },
    {
      id: "PHARM-005",
      date: "2024-09-29",
      totalDispensations: 47,
      totalPrescriptions: 53,
      pendingPrescriptions: 6,
      rejectedPrescriptions: 2,
      verificationTime: "3.8 min",
      dispensationTime: "6.0 min",
      stockAdjustments: 6,
      lowStockAlerts: 11,
      totalValue: 2543.21,
      pharmacist: "Ana García",
      shift: "Mañana"
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

  get filteredActivity(): PharmacyActivity[] {
    return this.activity.filter(item => {
      const matchesShift = this.shiftFilter === 'all' || item.shift === this.shiftFilter;
      return matchesShift;
    });
  }

  get stats() {
    return {
      totalDispensations: this.activity.reduce((sum, a) => sum + a.totalDispensations, 0),
      totalValue: this.activity.reduce((sum, a) => sum + a.totalValue, 0),
      pending: this.activity.reduce((sum, a) => sum + a.pendingPrescriptions, 0),
      avgTime: "6.5 min",
      stockAdjustments: this.activity.reduce((sum, a) => sum + a.stockAdjustments, 0)
    };
  }

  getShiftClass(shift: string): string {
    switch (shift) {
      case 'Mañana':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Tarde':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Noche':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  }
}