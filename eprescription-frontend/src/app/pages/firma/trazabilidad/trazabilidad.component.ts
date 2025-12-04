import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { LucideAngularModule, Activity } from 'lucide-angular';

interface SignatureTrailItem {
  id: string;
  prescriptionId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  action: string;
  actionLabel: string;
  timestamp: string;
  certificateId: string | null;
  certificateIssuer: string | null;
  certificateValidFrom: string | null;
  certificateValidTo: string | null;
  signatureMethod: string;
  ipAddress: string;
  deviceInfo: string;
  qrGenerated: boolean;
  tokenGenerated: boolean;
  status: string;
}

@Component({
  selector: 'app-trazabilidad',
  standalone: true,
  imports: [CommonModule, FormsModule, PageLayoutComponent, LucideAngularModule],
  template: `
    <app-page-layout 
      title="Trazabilidad de Firmas" 
      description="Registro completo de firmas digitales y verificaciones"
      [icon]="activityIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-slate-600 via-gray-500 to-zinc-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

        <!-- Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-gray-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Total eventos</p>
                  <p class="text-3xl font-bold text-gray-900">{{stats.total}}</p>
                </div>
                <div class="p-3 bg-gray-100 rounded-xl">
                  <lucide-icon [img]="activityIcon" class="w-8 h-8 text-gray-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-green-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Firmas válidas</p>
                  <p class="text-3xl font-bold text-gray-900">{{stats.valid}}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-xl">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Verificaciones</p>
                  <p class="text-3xl font-bold text-gray-900">{{stats.verified}}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl">
                  <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-red-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Revocadas</p>
                  <p class="text-3xl font-bold text-gray-900">{{stats.revoked}}</p>
                </div>
                <div class="p-3 bg-red-100 rounded-xl">
                  <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6">
          <div class="flex gap-4">
            <div class="flex-1 relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input type="text" 
                     [(ngModel)]="searchTerm"
                     placeholder="Buscar por ID de receta, paciente o médico..."
                     class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <select [(ngModel)]="actionFilter" 
                    class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="all">Todas las acciones</option>
              <option value="signature_created">Firma creada</option>
              <option value="verification">Verificación</option>
              <option value="signature_revoked">Firma revocada</option>
            </select>
            <select [(ngModel)]="statusFilter" 
                    class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option value="all">Todos</option>
              <option value="valid">Válidas</option>
              <option value="verified">Verificadas</option>
              <option value="revoked">Revocadas</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Registro de Trazabilidad</h2>
          <button class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Exportar
          </button>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Receta</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let item of filteredTrail">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{item.timestamp}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">{{item.prescriptionId}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{item.patientName}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <p>{{item.doctorName}}</p>
                      <p class="text-gray-600 font-mono text-xs">{{item.doctorId}}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{item.actionLabel}}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{item.signatureMethod}}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatusBadgeClass(item.status)">
                      {{getStatusLabel(item.status)}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button (click)="openDetailDialog(item)" 
                            class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      Ver
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal de Detalles -->
      <div *ngIf="isDetailDialogOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
          <div class="mt-3">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-900">Detalles de Trazabilidad - {{selectedTrailItem?.prescriptionId}}</h3>
            </div>

            <div class="space-y-6" *ngIf="selectedTrailItem">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <h4 class="font-medium text-gray-900">Información General</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="text-sm text-gray-600">ID de Receta</label>
                      <p class="font-mono">{{selectedTrailItem.prescriptionId}}</p>
                    </div>
                    <div>
                      <label class="text-sm text-gray-600">Paciente</label>
                      <p>{{selectedTrailItem.patientName}}</p>
                    </div>
                    <div>
                      <label class="text-sm text-gray-600">Usuario</label>
                      <p>{{selectedTrailItem.doctorName}}</p>
                      <p class="text-xs text-gray-500 font-mono">{{selectedTrailItem.doctorId}}</p>
                    </div>
                    <div>
                      <label class="text-sm text-gray-600">Acción</label>
                      <p>{{selectedTrailItem.actionLabel}}</p>
                    </div>
                    <div>
                      <label class="text-sm text-gray-600">Timestamp</label>
                      <p class="font-mono text-sm">{{selectedTrailItem.timestamp}}</p>
                    </div>
                  </div>
                </div>

                <div class="space-y-4">
                  <h4 class="font-medium text-gray-900">Detalles Técnicos</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="text-sm text-gray-600">Método de Firma</label>
                      <p>{{selectedTrailItem.signatureMethod}}</p>
                    </div>
                    <div *ngIf="selectedTrailItem.certificateId">
                      <label class="text-sm text-gray-600">ID del Certificado</label>
                      <p class="font-mono text-sm">{{selectedTrailItem.certificateId}}</p>
                    </div>
                    <div *ngIf="selectedTrailItem.certificateIssuer">
                      <label class="text-sm text-gray-600">Emisor del Certificado</label>
                      <p class="text-sm">{{selectedTrailItem.certificateIssuer}}</p>
                    </div>
                    <div *ngIf="selectedTrailItem.certificateValidFrom && selectedTrailItem.certificateValidTo">
                      <label class="text-sm text-gray-600">Validez del Certificado</label>
                      <p class="text-sm">{{selectedTrailItem.certificateValidFrom}} - {{selectedTrailItem.certificateValidTo}}</p>
                    </div>
                    <div>
                      <label class="text-sm text-gray-600">Estado</label>
                      <span [class]="getStatusBadgeClass(selectedTrailItem.status)">
                        {{getStatusLabel(selectedTrailItem.status)}}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-t pt-4">
                <h4 class="font-medium text-gray-900 mb-3">Información de Sesión</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm text-gray-600">Dirección IP</label>
                    <p class="font-mono text-sm">{{selectedTrailItem.ipAddress}}</p>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600">Dispositivo</label>
                    <p class="text-sm">{{selectedTrailItem.deviceInfo}}</p>
                  </div>
                </div>
              </div>

              <div class="border-t pt-4" *ngIf="selectedTrailItem.qrGenerated || selectedTrailItem.tokenGenerated">
                <h4 class="font-medium text-gray-900 mb-3">Códigos Generados</h4>
                <div class="flex gap-4">
                  <div *ngIf="selectedTrailItem.qrGenerated" class="flex items-center gap-2 text-sm text-green-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Código QR generado</span>
                  </div>
                  <div *ngIf="selectedTrailItem.tokenGenerated" class="flex items-center gap-2 text-sm text-green-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Token de verificación generado</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end mt-6">
              <button (click)="closeDetailDialog()" 
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
export class TrazabilidadComponent {
  activityIcon = Activity;
  
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Firma y verificación', route: '/firma' },
    { label: 'Trazabilidad' }
  ];

  trail: SignatureTrailItem[] = [
    {
      id: "SIGN-001",
      prescriptionId: "RX-2024-0192",
      patientName: "Elena Martínez",
      doctorId: "DOC-001",
      doctorName: "Dr. Carlos Martínez",
      action: "signature_created",
      actionLabel: "Firma digital aplicada",
      timestamp: "2024-10-01 08:30:05",
      certificateId: "CERT-DR-MARTINEZ-2024",
      certificateIssuer: "Autoridad Certificadora Médica",
      certificateValidFrom: "2024-01-01",
      certificateValidTo: "2025-12-31",
      signatureMethod: "Digital Certificate RSA 2048",
      ipAddress: "192.168.1.45",
      deviceInfo: "Windows PC - Chrome 118.0",
      qrGenerated: true,
      tokenGenerated: true,
      status: "valid"
    },
    {
      id: "SIGN-002",
      prescriptionId: "RX-2024-0192",
      patientName: "Elena Martínez",
      doctorId: "PHARM-001",
      doctorName: "Farmacéutica Ana García",
      action: "verification",
      actionLabel: "Verificación en farmacia",
      timestamp: "2024-10-01 10:15:30",
      certificateId: null,
      certificateIssuer: null,
      certificateValidFrom: null,
      certificateValidTo: null,
      signatureMethod: "QR Code Verification",
      ipAddress: "192.168.1.78",
      deviceInfo: "Scanner QR - Farmacia Central",
      qrGenerated: false,
      tokenGenerated: false,
      status: "verified"
    },
    {
      id: "SIGN-003",
      prescriptionId: "RX-2024-0195",
      patientName: "Roberto Sánchez",
      doctorId: "DOC-002",
      doctorName: "Dra. Laura Ramírez",
      action: "signature_created",
      actionLabel: "Firma digital aplicada",
      timestamp: "2024-10-01 11:20:15",
      certificateId: "CERT-DRA-RAMIREZ-2024",
      certificateIssuer: "Autoridad Certificadora Médica",
      certificateValidFrom: "2024-01-01",
      certificateValidTo: "2025-12-31",
      signatureMethod: "Digital Certificate RSA 2048",
      ipAddress: "192.168.1.67",
      deviceInfo: "Windows PC - Edge 118.0",
      qrGenerated: true,
      tokenGenerated: true,
      status: "valid"
    },
    {
      id: "SIGN-004",
      prescriptionId: "RX-2024-0178",
      patientName: "Carlos Ramírez",
      doctorId: "DOC-001",
      doctorName: "Dr. Carlos Martínez",
      action: "signature_revoked",
      actionLabel: "Firma revocada",
      timestamp: "2024-09-30 16:45:00",
      certificateId: "CERT-DR-MARTINEZ-2024",
      certificateIssuer: "Autoridad Certificadora Médica",
      certificateValidFrom: "2024-01-01",
      certificateValidTo: "2025-12-31",
      signatureMethod: "Digital Certificate RSA 2048",
      ipAddress: "192.168.1.45",
      deviceInfo: "Windows PC - Chrome 118.0",
      qrGenerated: false,
      tokenGenerated: false,
      status: "revoked"
    }
  ];

  get stats() {
    return {
      total: this.trail.length,
      valid: this.trail.filter(t => t.status === 'valid').length,
      verified: this.trail.filter(t => t.status === 'verified').length,
      revoked: this.trail.filter(t => t.status === 'revoked').length
    };
  }


  searchTerm = '';
  actionFilter = 'all';
  statusFilter = 'all';
  selectedTrailItem: SignatureTrailItem | null = null;
  isDetailDialogOpen = false;

  get filteredTrail() {
    return this.trail.filter(item => {
      const matchesSearch = 
        item.prescriptionId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.patientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.doctorName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesAction = this.actionFilter === 'all' || item.action === this.actionFilter;
      const matchesStatus = this.statusFilter === 'all' || item.status === this.statusFilter;
      return matchesSearch && matchesAction && matchesStatus;
    });
  }



  getStatusBadgeClass(status: string): string {
    const classes = {
      valid: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300",
      verified: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300",
      revoked: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-300"
    };
    return classes[status as keyof typeof classes] || classes.valid;
  }

  getStatusLabel(status: string): string {
    const labels = {
      valid: "Válida",
      verified: "Verificada",
      revoked: "Revocada"
    };
    return labels[status as keyof typeof labels] || "Válida";
  }

  getActionIcon(action: string): string {
    switch (action) {
      case 'signature_created':
        return 'shield-check';
      case 'verification':
        return 'check-circle';
      case 'signature_revoked':
        return 'x-circle';
      default:
        return 'file-check';
    }
  }

  openDetailDialog(item: SignatureTrailItem) {
    this.selectedTrailItem = item;
    this.isDetailDialogOpen = true;
  }

  closeDetailDialog() {
    this.isDetailDialogOpen = false;
    this.selectedTrailItem = null;
  }
}