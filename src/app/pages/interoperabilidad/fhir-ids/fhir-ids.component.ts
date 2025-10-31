import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Network, Copy, Eye, Search, RefreshCw, Database, User, Building2, Hash, Server, Clock, Shield, CheckCircle2, Info, Globe, Code, Download } from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';

interface FHIRResource {
  id: string;
  resourceType: string;
  internalId: string;
  fhirId: string;
  name: string;
  status: string;
  lastSync: string;
  version: string;
  system: string;
}

@Component({
  selector: 'app-fhir-ids',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      title="IDs FHIR (Fast Healthcare Interoperability Resources)" 
      description="Mapeo de identificadores para interoperabilidad estándar HL7 FHIR"
      [icon]="networkIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-cyan-600 via-blue-500 to-indigo-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-cyan-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Total recursos</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
                </div>
                <div class="p-3 bg-cyan-100 rounded-xl">
                  <lucide-icon [img]="databaseIcon" class="w-8 h-8 text-cyan-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Pacientes</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.patients }}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl">
                  <lucide-icon [img]="userIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-purple-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Profesionales</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.practitioners }}</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-xl">
                  <lucide-icon [img]="userIcon" class="w-8 h-8 text-purple-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-green-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Medicamentos</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.medications }}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-xl">
                  <lucide-icon [img]="databaseIcon" class="w-8 h-8 text-green-600"></lucide-icon>
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
                placeholder="Buscar por nombre, ID interno o ID FHIR..."
                [(ngModel)]="searchTerm"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select 
              [(ngModel)]="resourceFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los recursos</option>
              <option *ngFor="let type of resourceTypes" [value]="type">{{ type }}</option>
            </select>
            <button class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <lucide-icon [img]="refreshIcon" class="w-4 h-4"></lucide-icon>
              Sincronizar
            </button>
          </div>
        </div>
      </div>

      <!-- FHIR Resources Table -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Recursos FHIR Registrados</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de recurso</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Interno</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID FHIR</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Versión</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última sync</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr 
                *ngFor="let item of filteredIds" 
                (dblclick)="openDetailsModal(item)"
                class="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                title="Doble clic para ver detalles"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700 border border-cyan-300">
                    {{ item.resourceType }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{{ item.internalId }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span class="font-mono text-xs truncate max-w-xs">{{ item.fhirId }}</span>
                    <button 
                      (click)="copyToClipboard(item.fhirId)"
                      class="text-gray-400 hover:text-gray-600"
                    >
                      <lucide-icon [img]="copyIcon" class="w-3 h-3"></lucide-icon>
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-300">
                    {{ item.version }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.lastSync }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    (click)="openDetailsModal(item)"
                    class="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50"
                  >
                    <lucide-icon [img]="eyeIcon" class="w-4 h-4"></lucide-icon>
                    Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Info Card -->
      <div class="bg-cyan-50 border border-cyan-200 rounded-lg">
        <div class="p-4">
          <div class="flex items-start gap-3">
            <lucide-icon [img]="infoIcon" class="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5"></lucide-icon>
            <div>
              <h4 class="font-medium text-cyan-900 mb-1">Estándar HL7 FHIR R4</h4>
              <ul class="space-y-1 text-sm text-cyan-700">
                <li class="flex items-start gap-2">
                  <lucide-icon [img]="checkIcon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                  <span>Identificadores únicos globales (UUID) para cada recurso</span>
                </li>
                <li class="flex items-start gap-2">
                  <lucide-icon [img]="checkIcon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                  <span>Sincronización bidireccional con sistemas externos compatibles FHIR</span>
                </li>
                <li class="flex items-start gap-2">
                  <lucide-icon [img]="checkIcon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                  <span>Cumple con normativas de interoperabilidad HL7 International</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Modal -->
      <div *ngIf="selectedId && isDetailsPanelOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="closeSyncTooltip()">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto m-4" (click)="$event.stopPropagation()">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <lucide-icon [img]="networkIcon" class="w-5 h-5 text-cyan-600"></lucide-icon>
                <h2 class="text-xl font-semibold">Detalles del Recurso FHIR - {{ selectedId.id }}</h2>
              </div>
              <button 
                (click)="closeDetailsModal()"
                class="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <p class="text-gray-600 mt-1">Información completa del recurso HL7 FHIR y datos de interoperabilidad</p>
          </div>

          <div class="p-6 space-y-6">
            <!-- Main Info -->
            <div class="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <div class="p-2 bg-white rounded-lg shadow-sm">
                  <lucide-icon [img]="getResourceIcon(selectedId.resourceType)" class="w-5 h-5 text-cyan-600"></lucide-icon>
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-slate-900">{{ selectedId.name }}</h3>
                  <p class="text-sm text-slate-600 mt-1">
                    Tipo de recurso: <span class="font-mono">{{ selectedId.resourceType }}</span>
                  </p>
                </div>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                  {{ selectedId.status === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
            </div>

            <!-- Identifiers -->
            <div class="bg-white border border-gray-200 rounded-lg">
              <div class="p-4 border-b border-gray-200">
                <h3 class="flex items-center gap-2 text-base font-medium">
                  <lucide-icon [img]="hashIcon" class="w-4 h-4 text-cyan-600"></lucide-icon>
                  Identificadores
                </h3>
              </div>
              <div class="p-4 space-y-4">
                <div>
                  <label class="text-sm text-gray-600">ID FHIR (UUID Global)</label>
                  <div class="flex items-center gap-2 mt-1">
                    <code class="flex-1 bg-slate-100 px-3 py-2 rounded text-sm font-mono break-all">
                      {{ selectedId.fhirId }}
                    </code>
                    <button 
                      (click)="copyToClipboard(selectedId.fhirId)"
                      class="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                    >
                      <lucide-icon [img]="copyIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </div>
                <div>
                  <label class="text-sm text-gray-600">ID Interno del Sistema</label>
                  <div class="flex items-center gap-2 mt-1">
                    <code class="flex-1 bg-slate-100 px-3 py-2 rounded text-sm font-mono">
                      {{ selectedId.internalId }}
                    </code>
                    <button 
                      (click)="copyToClipboard(selectedId.internalId)"
                      class="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                    >
                      <lucide-icon [img]="copyIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Technical Info -->
            <div class="bg-white border border-gray-200 rounded-lg">
              <div class="p-4 border-b border-gray-200">
                <h3 class="flex items-center gap-2 text-base font-medium">
                  <lucide-icon [img]="serverIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                  Información Técnica
                </h3>
              </div>
              <div class="p-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm text-gray-600">Versión FHIR</label>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-300">
                        {{ selectedId.version }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600">Sistema de origen</label>
                    <p class="text-sm mt-1">{{ selectedId.system }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600">Última sincronización</label>
                    <p class="flex items-center gap-2 mt-1">
                      <lucide-icon [img]="clockIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                      {{ selectedId.lastSync }}
                    </p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600">Estado del recurso</label>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300 mt-1">
                      {{ selectedId.status === 'active' ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Endpoints FHIR -->
            <div class="bg-white border border-gray-200 rounded-lg">
              <div class="p-4 border-b border-gray-200">
                <h3 class="flex items-center gap-2 text-base font-medium">
                  <lucide-icon [img]="globeIcon" class="w-4 h-4 text-purple-600"></lucide-icon>
                  Endpoints de Acceso FHIR
                </h3>
              </div>
              <div class="p-4 space-y-3">
                <div>
                  <label class="text-sm text-gray-600">GET (Consulta individual)</label>
                  <div class="flex items-center gap-2 mt-1">
                    <code class="flex-1 bg-slate-100 px-3 py-2 rounded text-xs font-mono break-all">
                      https://fhir.eprescription.health/api/{{ selectedId.resourceType }}/{{ selectedId.internalId }}
                    </code>
                    <button 
                      (click)="copyToClipboard('https://fhir.eprescription.health/api/' + selectedId.resourceType + '/' + selectedId.internalId)"
                      class="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                    >
                      <lucide-icon [img]="copyIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </div>
                <div>
                  <label class="text-sm text-gray-600">SEARCH (Búsqueda por tipo)</label>
                  <div class="flex items-center gap-2 mt-1">
                    <code class="flex-1 bg-slate-100 px-3 py-2 rounded text-xs font-mono break-all">
                      https://fhir.eprescription.health/api/{{ selectedId.resourceType }}?_id={{ selectedId.internalId }}
                    </code>
                    <button 
                      (click)="copyToClipboard('https://fhir.eprescription.health/api/' + selectedId.resourceType + '?_id=' + selectedId.internalId)"
                      class="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                    >
                      <lucide-icon [img]="copyIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ejemplo de Estructura JSON FHIR -->
            <div class="bg-white border border-gray-200 rounded-lg">
              <div class="p-4 border-b border-gray-200">
                <h3 class="flex items-center gap-2 text-base font-medium">
                  <lucide-icon [img]="codeIcon" class="w-4 h-4 text-green-600"></lucide-icon>
                  Estructura JSON FHIR (Ejemplo)
                </h3>
              </div>
              <div class="p-4">
                <div class="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                  <pre class="text-xs font-mono">{{ getFHIRExample(selectedId) }}</pre>
                </div>
                <div class="mt-3 flex gap-2">
                  <button
                    (click)="copyToClipboard(getFHIRExample(selectedId))"
                    class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                  >
                    <lucide-icon [img]="copyIcon" class="w-4 h-4"></lucide-icon>
                    Copiar JSON
                  </button>
                  <button
                    class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                  >
                    <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
                    Exportar Recurso
                  </button>
                </div>
              </div>
            </div>

            <!-- Información de Estándares -->
            <div class="rounded-lg p-4 border bg-cyan-50 border-cyan-200">
              <div class="flex items-start gap-3">
                <lucide-icon [img]="shieldIcon" class="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5"></lucide-icon>
                <div class="text-sm text-cyan-900">
                  <p class="font-medium mb-2">Cumplimiento de Estándares HL7 FHIR R4</p>
                  <ul class="space-y-1 text-cyan-700">
                    <li class="flex items-start gap-2">
                      <lucide-icon [img]="checkIcon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                      <span>Recurso compatible con HL7 FHIR R4 (Fast Healthcare Interoperability Resources)</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <lucide-icon [img]="checkIcon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                      <span>Identificador UUID único global siguiendo RFC 4122</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <lucide-icon [img]="checkIcon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                      <span>Compatible con sistemas de interoperabilidad nacional e internacional</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <lucide-icon [img]="checkIcon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                      <span>Sincronización bidireccional con repositorios FHIR externos</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6 border-t border-gray-200 flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <lucide-icon [img]="clockIcon" class="w-4 h-4"></lucide-icon>
              Última sincronización: {{ selectedId.lastSync }}
            </div>
            <div class="flex gap-2">
              <div class="relative">
                <button 
                  (click)="handleSyncClick()"
                  class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <lucide-icon [img]="refreshIcon" class="w-4 h-4 mr-2 inline"></lucide-icon>
                  Sincronizar
                </button>
                
                <!-- Sync Tooltip -->
                <div *ngIf="showSyncTooltip" class="absolute bottom-full right-0 mb-2 w-80 bg-blue-600 text-white rounded-lg shadow-lg z-50">
                  <div class="p-4">
                    <div class="flex items-start gap-3">
                      <lucide-icon [img]="infoIcon" class="w-5 h-5 text-blue-200 flex-shrink-0 mt-0.5"></lucide-icon>
                      <div>
                        <h4 class="font-medium text-white mb-1">Sincronización</h4>
                        <p class="text-blue-100 text-sm">Esta función sincronizaría el recurso con sistemas externos</p>
                      </div>
                    </div>
                  </div>
                  <!-- Arrow -->
                  <div class="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-600"></div>
                </div>
              </div>
              <button 
                (click)="closeDetailsModal()"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      </div>
    </app-page-layout>
  `
})
export class FhirIdsComponent {
  networkIcon = Network;
  copyIcon = Copy;
  eyeIcon = Eye;
  searchIcon = Search;
  refreshIcon = RefreshCw;
  databaseIcon = Database;
  userIcon = User;
  buildingIcon = Building2;
  hashIcon = Hash;
  serverIcon = Server;
  clockIcon = Clock;
  shieldIcon = Shield;
  checkIcon = CheckCircle2;
  infoIcon = Info;
  globeIcon = Globe;
  codeIcon = Code;
  downloadIcon = Download;

  searchTerm = '';
  resourceFilter = 'all';
  selectedId: FHIRResource | null = null;
  isDetailsPanelOpen = false;
  showSyncTooltip = false;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Interoperabilidad', route: '/interop' },
    { label: 'IDs FHIR' }
  ];

  mockFHIRIds: FHIRResource[] = [
    {
      id: "FHIR-001",
      resourceType: "Patient",
      internalId: "PAT-0012",
      fhirId: "urn:uuid:a8d5f7e9-3c2b-4d6e-8f1a-9b7c3d4e5f6a",
      name: "María Elena González Rodríguez",
      status: "active",
      lastSync: "2024-10-01 08:30",
      version: "R4",
      system: "ePrescription Hospital"
    },
    {
      id: "FHIR-002",
      resourceType: "Practitioner",
      internalId: "DOC-001",
      fhirId: "urn:uuid:b9e6g8f0-4d3c-5e7f-9g2b-0c8d4e5f6g7h",
      name: "Dr. Carlos Andrés Martínez López",
      status: "active",
      lastSync: "2024-10-01 07:15",
      version: "R4",
      system: "ePrescription Hospital"
    },
    {
      id: "FHIR-003",
      resourceType: "MedicationRequest",
      internalId: "RX-2024-0192",
      fhirId: "urn:uuid:c0f7h9g1-5e4d-6f8g-0h3c-1d9e5f6g7h8i",
      name: "Receta - Elena Martínez",
      status: "active",
      lastSync: "2024-10-01 08:30",
      version: "R4",
      system: "ePrescription Hospital"
    },
    {
      id: "FHIR-004",
      resourceType: "Medication",
      internalId: "MED-1001",
      fhirId: "urn:uuid:d1g8i0h2-6f5e-7g9h-1i4d-2e0f6g7h8i9j",
      name: "Paracetamol 500mg",
      status: "active",
      lastSync: "2024-09-30 14:20",
      version: "R4",
      system: "ePrescription Hospital"
    },
    {
      id: "FHIR-005",
      resourceType: "Organization",
      internalId: "ORG-001",
      fhirId: "urn:uuid:e2h9j1i3-7g6f-8h0i-2j5e-3f1g7h8i9j0k",
      name: "Hospital General Central",
      status: "active",
      lastSync: "2024-09-28 10:00",
      version: "R4",
      system: "ePrescription Hospital"
    }
  ];

  get filteredIds() {
    return this.mockFHIRIds.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.fhirId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.internalId.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesResource = this.resourceFilter === 'all' || item.resourceType === this.resourceFilter;
      return matchesSearch && matchesResource;
    });
  }

  get resourceTypes() {
    return Array.from(new Set(this.mockFHIRIds.map(i => i.resourceType)));
  }

  get stats() {
    return {
      total: this.mockFHIRIds.length,
      patients: this.mockFHIRIds.filter(i => i.resourceType === 'Patient').length,
      practitioners: this.mockFHIRIds.filter(i => i.resourceType === 'Practitioner').length,
      medications: this.mockFHIRIds.filter(i => i.resourceType === 'Medication' || i.resourceType === 'MedicationRequest').length
    };
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    // En una implementación real, aquí mostrarías un toast de confirmación
  }

  openDetailsModal(item: FHIRResource) {
    this.selectedId = item;
    this.isDetailsPanelOpen = true;
  }

  closeDetailsModal() {
    this.isDetailsPanelOpen = false;
    this.selectedId = null;
  }

  getResourceIcon(resourceType: string) {
    switch (resourceType) {
      case 'Patient': return this.userIcon;
      case 'Practitioner': return this.userIcon;
      case 'Organization': return this.buildingIcon;
      default: return this.databaseIcon;
    }
  }

  getFHIRExample(resource: FHIRResource): string {
    const baseExample = {
      resourceType: resource.resourceType,
      id: resource.internalId,
      meta: {
        versionId: "1",
        lastUpdated: `${resource.lastSync}:00.000Z`,
        profile: [
          `http://hl7.org/fhir/StructureDefinition/${resource.resourceType}`
        ]
      },
      identifier: [
        {
          system: "urn:ietf:rfc:3986",
          value: resource.fhirId
        },
        {
          system: "https://eprescription.health/fhir/identifier",
          value: resource.internalId
        }
      ],
      status: resource.status
    };

    // Agregar campos específicos según el tipo de recurso
    let specificFields = {};
    
    switch (resource.resourceType) {
      case 'Patient':
        specificFields = {
          name: [
            {
              use: "official",
              text: resource.name
            }
          ],
          gender: "female",
          birthDate: "1985-03-15"
        };
        break;
      case 'Practitioner':
        specificFields = {
          name: [
            {
              use: "official",
              text: resource.name
            }
          ],
          qualification: [
            {
              code: {
                coding: [
                  {
                    system: "http://terminology.hl7.org/CodeSystem/v2-0360",
                    code: "MD",
                    display: "Doctor of Medicine"
                  }
                ]
              }
            }
          ]
        };
        break;
      case 'Medication':
        specificFields = {
          code: {
            coding: [
              {
                system: "http://www.nlm.nih.gov/research/umls/rxnorm",
                code: "161",
                display: resource.name
              }
            ]
          }
        };
        break;
      case 'MedicationRequest':
        specificFields = {
          intent: "order",
          medicationCodeableConcept: {
            coding: [
              {
                system: "http://snomed.info/sct",
                code: "387517004",
                display: "Paracetamol 500mg"
              }
            ]
          },
          subject: {
            reference: "Patient/pat-0012",
            display: "María González"
          }
        };
        break;
      case 'Organization':
        specificFields = {
          name: resource.name,
          type: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/organization-type",
                  code: "prov",
                  display: "Healthcare Provider"
                }
              ]
            }
          ]
        };
        break;
    }

    const fullExample = { ...baseExample, ...specificFields };
    return JSON.stringify(fullExample, null, 2);
  }

  handleSyncClick() {
    this.showSyncTooltip = true;
    
    // Ocultar el tooltip después de 3 segundos
    setTimeout(() => {
      this.showSyncTooltip = false;
    }, 3000);
  }

  closeSyncTooltip() {
    this.showSyncTooltip = false;
  }
}