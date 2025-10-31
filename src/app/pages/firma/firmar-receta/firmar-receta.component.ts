import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { LucideAngularModule, PenTool } from 'lucide-angular';

interface PrescriptionToSign {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  createdDate: string;
  createdTime: string;
  medicinesCount: number;
  medicines: string[];
  status: string;
  diagnosis: string;
}

@Component({
  selector: 'app-firmar-receta',
  standalone: true,
  imports: [CommonModule, FormsModule, PageLayoutComponent, LucideAngularModule],
  template: `
    <app-page-layout 
      title="Firma Digital de Recetas" 
      description="Firma electrónica avanzada con certificado digital"
      [icon]="penToolIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-blue-600 via-indigo-500 to-purple-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

        <!-- Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Pendientes de firma</p>
                  <p class="text-3xl font-bold text-gray-900">{{stats.pendingSignatures}}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl">
                  <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-green-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Firmadas hoy</p>
                  <p class="text-3xl font-bold text-gray-900">{{stats.signedToday}}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-xl">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-purple-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Certificado válido</p>
                  <p class="text-3xl font-bold text-gray-900">{{stats.certificateValidDays}}d</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-xl">
                  <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Recetas Pendientes de Firma</h2>
        </div>
        <div class="p-6">
          <div *ngIf="prescriptions.length === 0" class="text-center py-12">
            <svg class="w-12 h-12 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="font-medium mb-2">No hay recetas pendientes</h3>
            <p class="text-sm text-gray-600">Todas las recetas han sido firmadas</p>
          </div>
          
          <div *ngIf="prescriptions.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Receta</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamentos</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnóstico</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let prescription of prescriptions">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">{{prescription.id}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{prescription.patientName}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{prescription.doctorName}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <p>{{prescription.createdDate}}</p>
                      <p class="text-gray-600">{{prescription.createdTime}}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                      {{prescription.medicinesCount}} medicamento{{prescription.medicinesCount !== 1 ? 's' : ''}}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{{prescription.diagnosis}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button (click)="openSignDialog(prescription)" 
                            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                      Firmar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-lg">
        <div class="p-4">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h4 class="font-medium text-blue-900 mb-1">Firma Electrónica Avanzada</h4>
              <ul class="space-y-1 text-sm text-blue-700">
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Equivalencia legal con firma manuscrita según normativas internacionales</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Certificado digital emitido por autoridad certificadora autorizada</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Genera código QR único y token de verificación para farmacia</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de firma -->
      <div *ngIf="isSignDialogOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-900">Firmar Receta Digitalmente</h3>
            </div>
            <p class="text-sm text-gray-600 mb-6">
              Receta {{selectedPrescription?.id}} para {{selectedPrescription?.patientName}}
            </p>

            <div class="space-y-6">
              <div class="bg-gray-50 border rounded-lg p-4">
                <h4 class="font-medium mb-3">Detalles de la receta</h4>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label class="text-gray-600">Paciente</label>
                    <p class="mt-1">{{selectedPrescription?.patientName}}</p>
                  </div>
                  <div>
                    <label class="text-gray-600">Médico</label>
                    <p class="mt-1">{{selectedPrescription?.doctorName}}</p>
                  </div>
                  <div class="col-span-2">
                    <label class="text-gray-600">Medicamentos</label>
                    <ul class="mt-1 list-disc list-inside">
                      <li *ngFor="let med of selectedPrescription?.medicines">{{med}}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">PIN de seguridad *</label>
                <input type="password" 
                       [(ngModel)]="pin"
                       placeholder="Ingresa tu PIN de 6 dígitos"
                       maxlength="6"
                       class="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Contraseña del certificado digital *</label>
                <input type="password" 
                       [(ngModel)]="certificatePassword"
                       placeholder="Contraseña de tu certificado"
                       class="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              </div>

              <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div class="flex items-start gap-2">
                  <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <div class="text-sm text-blue-900">
                    <p class="font-medium mb-1">Tu certificado digital</p>
                    <p class="text-blue-700">CERT-DR-MARTINEZ-2024</p>
                    <p class="text-blue-700 text-xs mt-1">Válido hasta: 31/12/2025</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button (click)="closeSignDialog()" 
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Cancelar
              </button>
              <button (click)="handleSign()" 
                      class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Firmar digitalmente
              </button>
            </div>
          </div>
        </div>
      </div>

      </div>
    </app-page-layout>
  `
})
export class FirmarRecetaComponent {
  penToolIcon = PenTool;
  
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Firma y verificación', route: '/firma' },
    { label: 'Firmar recetas' }
  ];

  prescriptions: PrescriptionToSign[] = [
    {
      id: "RX-2024-0198",
      patientId: "PAT-0012",
      patientName: "María González",
      doctorId: "DOC-003",
      doctorName: "Dra. Isabel Moreno",
      createdDate: "2024-10-01",
      createdTime: "14:35",
      medicinesCount: 3,
      medicines: ["Paracetamol 500mg", "Ibuprofeno 400mg", "Omeprazol 20mg"],
      status: "pending_signature",
      diagnosis: "Gastritis aguda con cefalea tensional"
    },
    {
      id: "RX-2024-0199",
      patientId: "PAT-0045",
      patientName: "Carlos Ramírez",
      doctorId: "DOC-001",
      doctorName: "Dr. Carlos Martínez",
      createdDate: "2024-10-01",
      createdTime: "15:12",
      medicinesCount: 2,
      medicines: ["Losartán 50mg", "Atorvastatina 20mg"],
      status: "pending_signature",
      diagnosis: "Hipertensión arterial esencial"
    },
    {
      id: "RX-2024-0200",
      patientId: "PAT-0089",
      patientName: "Ana Herrera",
      doctorId: "DOC-005",
      doctorName: "Dr. Miguel Ruiz",
      createdDate: "2024-10-01",
      createdTime: "15:45",
      medicinesCount: 1,
      medicines: ["Paracetamol 500mg"],
      status: "pending_signature",
      diagnosis: "Dolor lumbar agudo"
    }
  ];

  selectedPrescription: PrescriptionToSign | null = null;
  isSignDialogOpen = false;
  pin = "";
  certificatePassword = "";

  get stats() {
    return {
      pendingSignatures: this.prescriptions.length,
      signedToday: 12,
      certificateValidDays: 365
    };
  }

  openSignDialog(prescription: PrescriptionToSign) {
    this.selectedPrescription = prescription;
    this.isSignDialogOpen = true;
  }

  closeSignDialog() {
    this.isSignDialogOpen = false;
    this.selectedPrescription = null;
    this.pin = "";
    this.certificatePassword = "";
  }

  handleSign() {
    if (!this.pin || !this.certificatePassword) {
      alert('Debes ingresar el PIN y la contraseña del certificado');
      return;
    }

    if (this.selectedPrescription) {
      // Simular firma exitosa
      alert(`Receta ${this.selectedPrescription.id} firmada digitalmente. QR generado.`);
      
      // Remover de la lista
      this.prescriptions = this.prescriptions.filter(p => p.id !== this.selectedPrescription?.id);
      this.closeSignDialog();
    }
  }
}