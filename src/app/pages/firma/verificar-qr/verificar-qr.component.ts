import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { LucideAngularModule, ShieldCheck } from 'lucide-angular';

interface VerificationResult {
  valid: boolean;
  prescriptionId: string;
  patientName: string;
  doctorName: string;
  signedDate: string;
  medicines: string[];
  status: string;
  certificateId: string;
}

@Component({
  selector: 'app-verificar-qr',
  standalone: true,
  imports: [CommonModule, FormsModule, PageLayoutComponent, LucideAngularModule],
  template: `
    <app-page-layout 
      title="Verificación de QR/Token" 
      description="Validación de autenticidad de recetas firmadas"
      [icon]="shieldCheckIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-purple-600 via-violet-500 to-indigo-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Verificar Receta</h2>
          </div>
          <div class="p-6 space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Método de verificación</label>
              <select [(ngModel)]="verificationMethod" 
                      class="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                <option value="qr">
                  🔲 Código QR
                </option>
                <option value="token">
                  # Token alfanumérico
                </option>
              </select>
            </div>

            <div *ngIf="verificationMethod === 'qr'">
              <label class="block text-sm font-medium text-gray-700">Código QR de la receta</label>
              <input type="text" 
                     [(ngModel)]="qrInput"
                     placeholder="Escanea o ingresa el código QR completo"
                     class="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 font-mono">
              <p class="text-xs text-gray-600 mt-1">Ej: QR-2024-0192-A3B5C7D9E1F2</p>
            </div>

            <div *ngIf="verificationMethod === 'token'">
              <label class="block text-sm font-medium text-gray-700">Token de verificación</label>
              <input type="text" 
                     [(ngModel)]="tokenInput"
                     placeholder="Ingresa el token de 15 caracteres"
                     maxlength="17"
                     class="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 font-mono">
              <p class="text-xs text-gray-600 mt-1">Ej: VERIFY-0192-2024</p>
            </div>

            <button (click)="handleVerify()" 
                    class="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
              </svg>
              Verificar autenticidad
            </button>
          </div>
        </div>

        <div *ngIf="verificationResult" class="bg-green-50 border border-green-300 rounded-lg shadow-sm">
          <div class="px-6 py-4 border-b border-green-200">
            <h2 class="text-lg font-semibold text-green-900 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Receta Verificada
            </h2>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex items-center justify-center mb-4">
              <div class="p-4 bg-green-600 rounded-full">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>

            <div class="space-y-3">
              <div>
                <label class="text-sm text-gray-600">ID de receta</label>
                <p class="font-mono mt-1">{{verificationResult.prescriptionId}}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm text-gray-600">Paciente</label>
                  <p class="mt-1">{{verificationResult.patientName}}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Médico</label>
                  <p class="mt-1">{{verificationResult.doctorName}}</p>
                </div>
              </div>

              <div>
                <label class="text-sm text-gray-600">Fecha de firma</label>
                <p class="mt-1">{{verificationResult.signedDate}}</p>
              </div>

              <div>
                <label class="text-sm text-gray-600">Medicamentos prescritos</label>
                <ul class="mt-1 list-disc list-inside text-sm">
                  <li *ngFor="let med of verificationResult.medicines">{{med}}</li>
                </ul>
              </div>

              <div class="pt-3 border-t">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                  ✓ {{verificationResult.status}}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!verificationResult" class="bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
          <div class="p-6 text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Verificación de Recetas</h3>
            <p class="text-sm text-gray-600 mb-4">
              Ingresa un código QR o token para verificar la autenticidad de una receta firmada digitalmente.
            </p>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="text-sm text-blue-900 text-left">
                  <p class="font-medium mb-1">Métodos de verificación</p>
                  <ul class="text-blue-700 space-y-1">
                    <li>• <strong>Código QR:</strong> Escanea o ingresa el código completo</li>
                    <li>• <strong>Token:</strong> Ingresa el token alfanumérico de 15 caracteres</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </app-page-layout>
  `
})
export class VerificarQRComponent {
  shieldCheckIcon = ShieldCheck;
  
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Firma y verificación', route: '/firma' },
    { label: 'Verificación de QR/token' }
  ];

  verificationMethod: 'qr' | 'token' = 'qr';
  qrInput = '';
  tokenInput = '';
  verificationResult: VerificationResult | null = null;

  handleVerify() {
    const input = this.verificationMethod === 'qr' ? this.qrInput : this.tokenInput;
    
    if (!input) {
      alert('Ingresa el código QR o token para verificar');
      return;
    }

    // Simulación de verificación exitosa
    this.verificationResult = {
      valid: true,
      prescriptionId: "RX-2024-0192",
      patientName: "Elena Martínez",
      doctorName: "Dr. Carlos Martínez",
      signedDate: "2024-10-01 08:30",
      medicines: ["Paracetamol 500mg", "Ibuprofeno 400mg", "Omeprazol 20mg"],
      status: "Válida y no dispensada",
      certificateId: "CERT-DR-MARTINEZ-2024"
    };

    alert('La firma digital es válida y la receta es auténtica');
  }
}