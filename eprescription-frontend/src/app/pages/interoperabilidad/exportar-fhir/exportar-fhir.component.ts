import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Upload, Send, CheckCircle2, XCircle, Clock, Info, Download } from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';

interface FHIRExport {
  id: string;
  prescriptionId: string;
  patientName: string;
  doctorName: string;
  exportDate: string;
  exportTime: string;
  resourceType: string;
  version: string;
  format: string;
  size: string;
  status: 'completed' | 'failed';
  destination: string;
  responseCode: string;
}

@Component({
  selector: 'app-exportar-fhir',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      title="Exportar Receta (FHIR)" 
      description="Exportación de recetas en formato HL7 FHIR a sistemas externos"
      [icon]="uploadIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-green-600 via-emerald-500 to-teal-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-green-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Total exportaciones</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-xl">
                  <lucide-icon [img]="sendIcon" class="w-8 h-8 text-green-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Exitosas</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.completed }}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl">
                  <lucide-icon [img]="checkIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-red-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Fallidas</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.failed }}</p>
                </div>
                <div class="p-3 bg-red-100 rounded-xl">
                  <lucide-icon [img]="xCircleIcon" class="w-8 h-8 text-red-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-purple-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Hoy</p>
                  <p class="text-3xl font-bold text-gray-900">{{ stats.today }}</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-xl">
                  <lucide-icon [img]="clockIcon" class="w-8 h-8 text-purple-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Export Form and Preview -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Export Form -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Nueva Exportación FHIR</h2>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Receta a exportar</label>
              <select 
                [(ngModel)]="selectedPrescription"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona una receta...</option>
                <option value="RX-2024-0198">RX-2024-0198 - María González</option>
                <option value="RX-2024-0199">RX-2024-0199 - Carlos Ramírez</option>
                <option value="RX-2024-0200">RX-2024-0200 - Ana Herrera</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sistema destino</label>
              <select 
                [(ngModel)]="destination"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona el destino...</option>
                <option value="nacional">Sistema Nacional de Recetas</option>
                <option value="farmacias">Red de Farmacias Nacional</option>
                <option value="seguro">Sistema de Aseguradoras</option>
                <option value="his">HIS Hospital Regional</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Formato</label>
              <select 
                [(ngModel)]="format"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="JSON">JSON (recomendado)</option>
                <option value="XML">XML</option>
              </select>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div class="flex items-start gap-2">
                <lucide-icon [img]="infoIcon" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></lucide-icon>
                <div class="text-sm text-blue-900">
                  <p class="font-medium mb-1">Exportación FHIR MedicationRequest</p>
                  <p class="text-blue-700">Incluye: paciente, médico, medicamentos, dosis, firma digital y código QR</p>
                </div>
              </div>
            </div>

            <button 
              (click)="handleExport()"
              [disabled]="isExporting || !selectedPrescription || !destination"
              class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <lucide-icon [img]="uploadIcon" [class]="'w-4 h-4 ' + (isExporting ? 'animate-spin' : '')"></lucide-icon>
              {{ isExporting ? 'Exportando a FHIR...' : 'Exportar receta' }}
            </button>
          </div>
        </div>

        <!-- JSON Preview -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Preview JSON FHIR</h2>
          </div>
          <div class="p-6">
            <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
              <pre>{{ jsonPreview }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Export History -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Historial de Exportaciones</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha/Hora</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receta</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destino</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Formato</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamaño</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Respuesta</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngFor="let exp of exports">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm">
                    <p>{{ exp.exportDate }}</p>
                    <p class="text-gray-600">{{ exp.exportTime }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">{{ exp.prescriptionId }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ exp.patientName }}</td>
                <td class="px-6 py-4 text-sm">{{ exp.destination }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                    {{ exp.format }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ exp.size }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ' + 
                    (exp.status === 'completed' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300')">
                    {{ exp.status === 'completed' ? 'Exitosa' : 'Fallida' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ' + 
                    (exp.responseCode.includes('200') ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300')">
                    {{ exp.responseCode }}
                  </span>
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
export class ExportarFhirComponent {
  uploadIcon = Upload;
  sendIcon = Send;
  checkIcon = CheckCircle2;
  xCircleIcon = XCircle;
  clockIcon = Clock;
  infoIcon = Info;
  downloadIcon = Download;

  selectedPrescription = '';
  destination = '';
  format = 'JSON';
  isExporting = false;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Interoperabilidad', route: '/interop' },
    { label: 'Exportar Receta (FHIR)' }
  ];

  exports: FHIRExport[] = [
    {
      id: "EXP-001",
      prescriptionId: "RX-2024-0192",
      patientName: "Elena Martínez",
      doctorName: "Dr. Carlos Martínez",
      exportDate: "2024-10-01",
      exportTime: "08:35",
      resourceType: "MedicationRequest",
      version: "FHIR R4",
      format: "JSON",
      size: "12.4 KB",
      status: "completed",
      destination: "Sistema Nacional de Recetas",
      responseCode: "200 OK"
    },
    {
      id: "EXP-002",
      prescriptionId: "RX-2024-0195",
      patientName: "Roberto Sánchez",
      doctorName: "Dra. Laura Ramírez",
      exportDate: "2024-10-01",
      exportTime: "11:22",
      resourceType: "MedicationRequest",
      version: "FHIR R4",
      format: "JSON",
      size: "14.8 KB",
      status: "completed",
      destination: "Red de Farmacias Nacional",
      responseCode: "200 OK"
    },
    {
      id: "EXP-003",
      prescriptionId: "RX-2024-0178",
      patientName: "Carlos Ramírez",
      doctorName: "Dr. Carlos Martínez",
      exportDate: "2024-09-30",
      exportTime: "16:45",
      resourceType: "MedicationRequest",
      version: "FHIR R4",
      format: "JSON",
      size: "11.2 KB",
      status: "failed",
      destination: "Sistema Nacional de Recetas",
      responseCode: "500 Error"
    }
  ];

  get stats() {
    return {
      total: this.exports.length,
      completed: this.exports.filter(e => e.status === 'completed').length,
      failed: this.exports.filter(e => e.status === 'failed').length,
      today: this.exports.filter(e => e.exportDate === '2024-10-01').length
    };
  }

  get jsonPreview() {
    return `{
  "resourceType": "MedicationRequest",
  "id": "rx-2024-0198",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2024-10-01T14:35:00Z"
  },
  "status": "active",
  "intent": "order",
  "medicationCodeableConcept": {
    "coding": [{
      "system": "http://snomed.info/sct",
      "code": "387517004",
      "display": "Paracetamol 500mg"
    }]
  },
  "subject": {
    "reference": "Patient/pat-0012",
    "display": "María González"
  },
  "requester": {
    "reference": "Practitioner/doc-001",
    "display": "Dr. Carlos Martínez"
  },
  "dosageInstruction": [{
    "text": "1 tableta cada 8 horas",
    "timing": {
      "repeat": {
        "frequency": 1,
        "period": 8,
        "periodUnit": "h"
      }
    }
  }]
}`;
  }

  async handleExport() {
    if (!this.selectedPrescription || !this.destination) {
      return;
    }

    this.isExporting = true;

    try {
      // Simular exportación
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Crear nuevo registro de exportación
      const newExport: FHIRExport = {
        id: `EXP-${String(this.exports.length + 1).padStart(3, '0')}`,
        prescriptionId: this.selectedPrescription,
        patientName: this.getPrescriptionData(this.selectedPrescription).patient,
        doctorName: this.getPrescriptionData(this.selectedPrescription).doctor,
        exportDate: new Date().toISOString().split('T')[0],
        exportTime: new Date().toTimeString().slice(0, 5),
        resourceType: "MedicationRequest",
        version: "FHIR R4",
        format: this.format,
        size: "12.4 KB",
        status: "completed",
        destination: this.getDestinationName(this.destination),
        responseCode: "200 OK"
      };

      // Agregar al historial
      this.exports = [newExport, ...this.exports];

      // Limpiar formulario
      this.selectedPrescription = '';
      this.destination = '';

    } catch (error) {
      console.error('Error en exportación:', error);
    } finally {
      this.isExporting = false;
    }
  }

  private getPrescriptionData(prescriptionId: string) {
    const data: Record<string, { patient: string; doctor: string }> = {
      "RX-2024-0198": { patient: "María González", doctor: "Dr. Carlos Martínez" },
      "RX-2024-0199": { patient: "Carlos Ramírez", doctor: "Dra. Laura Ramírez" },
      "RX-2024-0200": { patient: "Ana Herrera", doctor: "Dr. Roberto Sánchez" }
    };
    return data[prescriptionId] || data["RX-2024-0198"];
  }

  private getDestinationName(destination: string): string {
    const names: Record<string, string> = {
      "nacional": "Sistema Nacional de Recetas",
      "farmacias": "Red de Farmacias Nacional",
      "seguro": "Sistema de Aseguradoras",
      "his": "HIS Hospital Regional"
    };
    return names[destination] || destination;
  }
}