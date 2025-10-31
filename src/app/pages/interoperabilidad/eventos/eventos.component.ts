import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Activity, Network, AlertTriangle, CheckCircle2, Search, RefreshCw, Inbox, Send, Clock, Info } from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';

interface HL7Event {
  id: string;
  timestamp: string;
  eventType: string;
  eventLabel: string;
  messageId: string;
  patientId: string;
  patientName: string;
  facility: string;
  sendingApp: string;
  receivingApp: string;
  status: string;
  direction: string;
  messageSize: string;
  processingTime: string;
}

@Component({
  selector: 'app-eventos-hl7',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      title="Registro HL7 Eventos" 
      description="Monitoreo de mensajes HL7 v2.x entrantes y salientes"
      [icon]="activityIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-indigo-600 via-purple-500 to-pink-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-indigo-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Total mensajes</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
                </div>
                <div class="p-3 bg-indigo-100 rounded-xl">
                  <lucide-icon [img]="activityIcon" class="w-8 h-8 text-indigo-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Entrantes</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.inbound }}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl">
                  <lucide-icon [img]="inboxIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-green-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Salientes</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.outbound }}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-xl">
                  <lucide-icon [img]="sendIcon" class="w-8 h-8 text-green-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-red-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Errores</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.errors }}</p>
                </div>
                <div class="p-3 bg-red-100 rounded-xl">
                  <lucide-icon [img]="alertIcon" class="w-8 h-8 text-red-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-purple-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Tiempo prom.</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.avgProcessingTime }}</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-xl">
                  <lucide-icon [img]="clockIcon" class="w-8 h-8 text-purple-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <div class="flex gap-4">
            <div class="flex-1 relative">
              <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
              <input
                type="text"
                placeholder="Buscar por paciente, mensaje o evento..."
                [(ngModel)]="searchTerm"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select 
              [(ngModel)]="directionFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las direcciones</option>
              <option value="inbound">Entrantes</option>
              <option value="outbound">Salientes</option>
            </select>
            <select 
              [(ngModel)]="statusFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="processed">Procesados</option>
              <option value="error">Errores</option>
            </select>
          </div>
        </div>
      </div>

      <!-- HL7 Events Table -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Log de Mensajes HL7</h2>
            <button 
              (click)="handleRefresh()"
              [disabled]="isRefreshing"
              class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <lucide-icon [img]="refreshIcon" [class]="'w-4 h-4 ' + (isRefreshing ? 'animate-spin' : '')"></lucide-icon>
              {{ isRefreshing ? 'Actualizando...' : 'Actualizar' }}
            </button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evento</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origen → Destino</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Mensaje</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamaño</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiempo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngFor="let event of filteredEvents">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ event.timestamp }}</td>
                <td class="px-6 py-4">
                  <div>
                    <p class="font-medium text-sm">{{ event.eventLabel }}</p>
                    <p class="text-xs text-gray-600 font-mono">{{ event.eventType }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <p>{{ event.patientName }}</p>
                    <p class="text-gray-600 font-mono text-xs">{{ event.patientId }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ' + 
                    (event.direction === 'inbound' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-green-100 text-green-700 border border-green-300')">
                    {{ event.direction === 'inbound' ? 'Entrante' : 'Saliente' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-xs">
                  <div class="flex items-center gap-1">
                    <span class="truncate max-w-24">{{ event.sendingApp }}</span>
                    <span>→</span>
                    <span class="truncate max-w-24">{{ event.receivingApp }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">{{ event.messageId }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ event.messageSize }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-300">
                    {{ event.processingTime }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ' + 
                    (event.status === 'processed' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300')">
                    {{ event.status === 'processed' ? 'Procesado' : 'Error' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Info Card -->
      <div class="bg-indigo-50 border border-indigo-200 rounded-lg">
        <div class="p-4">
          <div class="flex items-start gap-3">
            <lucide-icon [img]="infoIcon" class="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5"></lucide-icon>
            <div>
              <h4 class="font-medium text-indigo-900 mb-1">Protocolo HL7 v2.x</h4>
              <ul class="space-y-1 text-sm text-indigo-700">
                <li class="flex items-start gap-2">
                  <lucide-icon [img]="checkIcon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                  <span>Mensajería estándar para intercambio de información clínica</span>
                </li>
                <li class="flex items-start gap-2">
                  <lucide-icon [img]="checkIcon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                  <span>Soporta: ADT (admisiones), ORM (órdenes), ORU (resultados), RDE (farmacia)</span>
                </li>
                <li class="flex items-start gap-2">
                  <lucide-icon [img]="checkIcon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                  <span>Integración bidireccional con sistemas HIS, LIS y RIS</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      </div>
    </app-page-layout>
  `
})
export class EventosHl7Component {
  activityIcon = Activity;
  networkIcon = Network;
  alertIcon = AlertTriangle;
  checkIcon = CheckCircle2;
  searchIcon = Search;
  refreshIcon = RefreshCw;
  inboxIcon = Inbox;
  sendIcon = Send;
  clockIcon = Clock;
  infoIcon = Info;

  searchTerm = '';
  directionFilter = 'all';
  statusFilter = 'all';
  isRefreshing = false;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Interoperabilidad', route: '/interop' },
    { label: 'Registro HL7 Eventos' }
  ];

  mockHL7Events: HL7Event[] = [
    {
      id: "HL7-001",
      timestamp: "2024-10-01 14:35:22",
      eventType: "ADT^A01",
      eventLabel: "Admisión de paciente",
      messageId: "MSG-2024-10-01-001",
      patientId: "PAT-0012",
      patientName: "María González",
      facility: "Hospital General Central",
      sendingApp: "HIS Sistema",
      receivingApp: "ePrescription",
      status: "processed",
      direction: "inbound",
      messageSize: "2.4 KB",
      processingTime: "45 ms"
    },
    {
      id: "HL7-002",
      timestamp: "2024-10-01 14:28:15",
      eventType: "ORM^O01",
      eventLabel: "Nueva orden médica",
      messageId: "MSG-2024-10-01-002",
      patientId: "PAT-0045",
      patientName: "Carlos Ramírez",
      facility: "Hospital General Central",
      sendingApp: "ePrescription",
      receivingApp: "Sistema Farmacia",
      status: "processed",
      direction: "outbound",
      messageSize: "3.2 KB",
      processingTime: "52 ms"
    },
    {
      id: "HL7-003",
      timestamp: "2024-10-01 13:45:08",
      eventType: "ORU^R01",
      eventLabel: "Resultado de laboratorio",
      messageId: "MSG-2024-10-01-003",
      patientId: "PAT-0089",
      patientName: "Ana Herrera",
      facility: "Laboratorio Central",
      sendingApp: "LIS Sistema",
      receivingApp: "ePrescription",
      status: "processed",
      direction: "inbound",
      messageSize: "5.6 KB",
      processingTime: "78 ms"
    },
    {
      id: "HL7-004",
      timestamp: "2024-10-01 12:30:45",
      eventType: "ADT^A08",
      eventLabel: "Actualización de paciente",
      messageId: "MSG-2024-10-01-004",
      patientId: "PAT-0067",
      patientName: "Roberto Sánchez",
      facility: "Hospital General Central",
      sendingApp: "HIS Sistema",
      receivingApp: "ePrescription",
      status: "processed",
      direction: "inbound",
      messageSize: "2.1 KB",
      processingTime: "38 ms"
    },
    {
      id: "HL7-005",
      timestamp: "2024-10-01 11:15:30",
      eventType: "RDE^O11",
      eventLabel: "Codificación de farmacia",
      messageId: "MSG-2024-10-01-005",
      patientId: "PAT-0123",
      patientName: "Elena Martínez",
      facility: "Farmacia Central",
      sendingApp: "Sistema Farmacia",
      receivingApp: "ePrescription",
      status: "error",
      direction: "inbound",
      messageSize: "4.8 KB",
      processingTime: "125 ms"
    }
  ];

  get filteredEvents() {
    return this.mockHL7Events.filter(event => {
      const matchesSearch = 
        event.patientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.messageId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.eventLabel.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesDirection = this.directionFilter === 'all' || event.direction === this.directionFilter;
      const matchesStatus = this.statusFilter === 'all' || event.status === this.statusFilter;
      return matchesSearch && matchesDirection && matchesStatus;
    });
  }

  get stats() {
    return {
      total: this.mockHL7Events.length,
      inbound: this.mockHL7Events.filter(e => e.direction === 'inbound').length,
      outbound: this.mockHL7Events.filter(e => e.direction === 'outbound').length,
      errors: this.mockHL7Events.filter(e => e.status === 'error').length,
      avgProcessingTime: "60 ms"
    };
  }

  async handleRefresh() {
    this.isRefreshing = true;
    
    // Simular llamada al servidor HL7
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // En una implementación real, aquí recargarías los datos
    console.log('Eventos HL7 actualizados');
    
    this.isRefreshing = false;
  }
}