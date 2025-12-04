import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { LucideAngularModule, QrCode } from 'lucide-angular';

interface SignedPrescription {
  id: string;
  patientName: string;
  doctorName: string;
  signedDate: string;
  signedTime: string;
  qrCode: string;
  qrUrl: string;
  token: string;
  certificateId: string;
  signatureHash: string;
  status: string;
  validUntil: string;
}

@Component({
  selector: 'app-generar-qr',
  standalone: true,
  imports: [CommonModule, FormsModule, PageLayoutComponent, LucideAngularModule],
  template: `
    <app-page-layout 
      title="Generar/Ver Código QR" 
      description="Códigos de verificación para dispensación en farmacia"
      [icon]="qrCodeIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-green-600 via-emerald-500 to-teal-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

        <!-- Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-green-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">QR generados</p>
                  <p class="text-3xl font-bold text-gray-900">{{stats.qrGenerated}}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-xl">
                  <lucide-icon [img]="qrCodeIcon" class="w-8 h-8 text-green-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Verificados</p>
                  <p class="text-3xl font-bold text-gray-900">{{stats.verified}}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl">
                  <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <p class="text-sm text-gray-600">Pendientes</p>
                  <p class="text-3xl font-bold text-gray-900">{{stats.pending}}</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-xl">
                  <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla de recetas -->

      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Recetas con Código QR</h2>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Receta</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de firma</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código QR</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Válido hasta</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let prescription of signedPrescriptions">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">{{prescription.id}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{prescription.patientName}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{prescription.doctorName}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <p>{{prescription.signedDate}}</p>
                      <p class="text-gray-600">{{prescription.signedTime}}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <span class="font-mono text-xs">{{prescription.qrCode.substring(0, 20)}}...</span>
                      <button (click)="copyToClipboard(prescription.qrCode)" 
                              class="p-1 text-gray-400 hover:text-gray-600">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                      </button>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-300 font-mono">
                      {{prescription.token}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{prescription.validUntil}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button (click)="openQRDialog(prescription)" 
                            class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      Ver QR
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal de QR -->
      <div *ngIf="isQRDialogOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-900">Código QR de Verificación</h3>
            </div>
            <p class="text-sm text-gray-600 mb-6">
              Receta {{selectedPrescription?.id}} - {{selectedPrescription?.patientName}}
            </p>

            <div class="space-y-6">
              <div class="flex justify-center">
                <div class="bg-white border-4 border-green-600 rounded-lg p-6 shadow-lg">
                  <div class="w-64 h-64 bg-gray-100 rounded flex items-center justify-center">
                    <div class="text-center">
                      <svg class="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                      </svg>
                      <p class="text-sm text-gray-500">Código QR</p>
                      <p class="text-xs text-gray-400 mt-1">{{selectedPrescription?.qrCode}}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-center">
                <p class="text-sm text-gray-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Escanea este código QR para verificar la receta en farmacia
                </p>
              </div>

              <div class="space-y-3">
                <div>
                  <label class="text-sm text-gray-600">Código QR</label>
                  <div class="flex items-center gap-2 mt-1">
                    <input [value]="selectedPrescription?.qrCode" readonly 
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm bg-gray-50">
                    <button (click)="copyToClipboard(selectedPrescription?.qrCode || '')" 
                            class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="text-sm text-gray-600">Token de verificación</label>
                  <div class="flex items-center gap-2 mt-1">
                    <input [value]="selectedPrescription?.token" readonly 
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm bg-gray-50">
                    <button (click)="copyToClipboard(selectedPrescription?.token || '')" 
                            class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="text-sm text-gray-600">URL de verificación</label>
                  <div class="flex items-center gap-2 mt-1">
                    <input [value]="selectedPrescription?.qrUrl" readonly 
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50">
                    <button (click)="copyToClipboard(selectedPrescription?.qrUrl || '')" 
                            class="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm text-gray-600">Hash de firma</label>
                    <p class="text-xs font-mono mt-1 break-all">{{selectedPrescription?.signatureHash}}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600">Válido hasta</label>
                    <p class="mt-1">{{selectedPrescription?.validUntil}}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button (click)="closeQRDialog()" 
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Cerrar
              </button>
              <button (click)="downloadQR()" 
                      class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Descargar QR
              </button>
            </div>
          </div>
        </div>
      </div>

      </div>
    </app-page-layout>
  `
})
export class GenerarQRComponent {
  qrCodeIcon = QrCode;
  
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Firma y verificación', route: '/firma' },
    { label: 'Generar/ver QR' }
  ];

  signedPrescriptions: SignedPrescription[] = [
    {
      id: "RX-2024-0192",
      patientName: "Elena Martínez",
      doctorName: "Dr. Carlos Martínez",
      signedDate: "2024-10-01",
      signedTime: "08:30",
      qrCode: "QR-2024-0192-A3B5C7D9E1F2",
      qrUrl: "https://eprescription.hospital.com/verify/QR-2024-0192-A3B5C7D9E1F2",
      token: "VERIFY-0192-2024",
      certificateId: "CERT-DR-MARTINEZ-2024",
      signatureHash: "SHA256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      status: "signed",
      validUntil: "2024-11-01"
    },
    {
      id: "RX-2024-0195",
      patientName: "Roberto Sánchez",
      doctorName: "Farmacéutica Ana García",
      signedDate: "2024-10-01",
      signedTime: "11:20",
      qrCode: "QR-2024-0195-B4C6D8E0F2G4",
      qrUrl: "https://eprescription.hospital.com/verify/QR-2024-0195-B4C6D8E0F2G4",
      token: "VERIFY-0195-2024",
      certificateId: "CERT-FARMACIA-2024",
      signatureHash: "SHA256:p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1",
      status: "signed",
      validUntil: "2024-10-15"
    }
  ];

  selectedPrescription: SignedPrescription | null = null;
  isQRDialogOpen = false;

  get stats() {
    return {
      qrGenerated: this.signedPrescriptions.length,
      verified: 45,
      pending: 3
    };
  }

  openQRDialog(prescription: SignedPrescription) {
    this.selectedPrescription = prescription;
    this.isQRDialogOpen = true;
  }

  closeQRDialog() {
    this.isQRDialogOpen = false;
    this.selectedPrescription = null;
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copiado al portapapeles');
    });
  }

  downloadQR() {
    if (this.selectedPrescription) {
      alert(`Descargando QR de la receta ${this.selectedPrescription.id}`);
    }
  }
}