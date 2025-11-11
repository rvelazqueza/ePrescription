import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  UserCheck, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Mail, 
  Phone, 
  Shield, 
  FileText, 
  Eye 
} from 'lucide-angular';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';

interface RegistrationRequest {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  idType: string;
  idNumber: string;
  preferredAuthMethod: 'password' | 'digital-signature';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  riskScore: number;
}

@Component({
  selector: 'app-aprobaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      [title]="'Aprobación de usuarios'"
      [description]="'Revisa y gestiona las solicitudes de registro al sistema'"
      [icon]="userCheckIcon"
      [breadcrumbItems]="breadcrumbItems"
      [headerGradient]="'from-blue-600 via-blue-500 to-blue-700'">

      <!-- Content -->
      <div class="space-y-6">
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-orange-500 p-6">
            <div class="flex items-center justify-between">
              <div class="space-y-1 flex-1">
                <p class="text-sm text-gray-600">Solicitudes pendientes</p>
                <p class="text-3xl font-bold text-gray-900">{{ pendingCount }}</p>
              </div>
              <div class="p-3 bg-orange-100 rounded-xl">
                <lucide-icon [img]="clockIcon" class="w-8 h-8 text-orange-600"></lucide-icon>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-green-500 p-6">
            <div class="flex items-center justify-between">
              <div class="space-y-1 flex-1">
                <p class="text-sm text-gray-600">Aprobadas (últimos 7 días)</p>
                <p class="text-3xl font-bold text-gray-900">{{ approvedCount }}</p>
              </div>
              <div class="p-3 bg-green-100 rounded-xl">
                <lucide-icon [img]="checkCircle2Icon" class="w-8 h-8 text-green-600"></lucide-icon>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-red-500 p-6">
            <div class="flex items-center justify-between">
              <div class="space-y-1 flex-1">
                <p class="text-sm text-gray-600">Rechazadas (últimos 7 días)</p>
                <p class="text-3xl font-bold text-gray-900">{{ rejectedCount }}</p>
              </div>
              <div class="p-3 bg-red-100 rounded-xl">
                <lucide-icon [img]="xCircleIcon" class="w-8 h-8 text-red-600"></lucide-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="p-6">
            <div class="flex gap-4 flex-wrap">
              <div class="flex-1 min-w-[300px] relative">
                <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
                <input
                  type="text"
                  placeholder="Buscar por nombre, correo o identificación..."
                  [(ngModel)]="searchTerm"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select 
                [(ngModel)]="statusFilter"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">Todas las solicitudes</option>
                <option value="pending">Pendientes</option>
                <option value="approved">Aprobadas</option>
                <option value="rejected">Rechazadas</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8 px-6">
              <button 
                *ngFor="let tab of tabs"
                (click)="setActiveTab(tab.key)"
                [class]="getTabClass(tab.key)">
                {{ tab.label }}
                <span *ngIf="tab.count > 0" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {{ tab.count }}
                </span>
              </button>
            </nav>
          </div>

          <!-- Solicitudes de registro -->
          <div class="p-6">
            <div class="mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Solicitudes de registro</h2>
              <p class="text-sm text-gray-600">
                {{ filteredRequests.length }} solicitud{{ filteredRequests.length !== 1 ? 'es' : '' }} encontrada{{ filteredRequests.length !== 1 ? 's' : '' }}
              </p>
            </div>

            <div *ngIf="filteredRequests.length === 0" class="text-center py-8">
              <lucide-icon [img]="alertCircleIcon" class="w-12 h-12 text-gray-400 mx-auto mb-4"></lucide-icon>
              <p class="text-gray-500">No hay solicitudes {{ activeTab !== 'all' ? getTabLabel(activeTab) : '' }} en este momento.</p>
            </div>

            <div *ngIf="filteredRequests.length > 0" class="space-y-4">
              <div *ngFor="let request of filteredRequests" class="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1 space-y-3">
                    <div class="flex items-center gap-3">
                      <h4 class="font-semibold text-gray-900">{{ request.fullName }}</h4>
                      <span [class]="getStatusBadgeClass(request.status)">
                        {{ getStatusText(request.status) }}
                      </span>
                      <span [class]="getRiskBadgeClass(request.riskScore)">
                        {{ getRiskText(request.riskScore) }}
                      </span>
                    </div>

                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div class="flex items-center gap-2 text-gray-600">
                        <lucide-icon [img]="fileTextIcon" class="w-4 h-4"></lucide-icon>
                        {{ request.idType }} {{ request.idNumber }}
                      </div>
                      <div class="flex items-center gap-2 text-gray-600">
                        <lucide-icon [img]="mailIcon" class="w-4 h-4"></lucide-icon>
                        {{ request.email }}
                        <lucide-icon *ngIf="request.emailVerified" [img]="checkCircle2Icon" class="w-4 h-4 text-green-600"></lucide-icon>
                      </div>
                      <div *ngIf="request.phone" class="flex items-center gap-2 text-gray-600">
                        <lucide-icon [img]="phoneIcon" class="w-4 h-4"></lucide-icon>
                        {{ request.phone }}
                        <lucide-icon *ngIf="request.phoneVerified" [img]="checkCircle2Icon" class="w-4 h-4 text-green-600"></lucide-icon>
                      </div>
                      <div class="flex items-center gap-2 text-gray-600">
                        <lucide-icon [img]="shieldIcon" class="w-4 h-4"></lucide-icon>
                        {{ request.preferredAuthMethod === 'password' ? 'Usuario + Contraseña' : 'Firma Digital BCCR' }}
                      </div>
                      <div class="flex items-center gap-2 text-gray-600 col-span-2">
                        <lucide-icon [img]="clockIcon" class="w-4 h-4"></lucide-icon>
                        Enviada: {{ formatDate(request.submittedAt) }}
                      </div>
                      <div *ngIf="request.reviewedAt" class="flex items-center gap-2 text-gray-600 col-span-2">
                        <lucide-icon [img]="request.status === 'approved' ? checkCircle2Icon : xCircleIcon" class="w-4 h-4"></lucide-icon>
                        {{ request.status === 'approved' ? 'Aprobada' : 'Rechazada' }}: {{ formatDate(request.reviewedAt) }}
                      </div>
                      <div *ngIf="request.rejectionReason" class="col-span-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p class="text-sm text-red-800"><strong>Motivo de rechazo:</strong> {{ request.rejectionReason }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col gap-2">
                    <button
                      (click)="viewDetails(request)"
                      class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <lucide-icon [img]="eyeIcon" class="w-4 h-4 mr-2"></lucide-icon>
                      Ver detalles
                    </button>
                    <button
                      *ngIf="request.status === 'pending'"
                      (click)="approveRequest(request)"
                      class="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                      <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 mr-2"></lucide-icon>
                      Aprobar
                    </button>
                    <button
                      *ngIf="request.status === 'pending'"
                      (click)="rejectRequest(request)"
                      class="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                      <lucide-icon [img]="xCircleIcon" class="w-4 h-4 mr-2"></lucide-icon>
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-page-layout>

    <!-- Modal: Ver detalles -->
    <div *ngIf="showDetailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" (click)="closeDetailModal()">
      <div class="relative top-20 mx-auto border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white flex flex-col max-h-[80vh]" (click)="$event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-5 pb-4 border-b border-gray-200 flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <lucide-icon [img]="userCheckIcon" class="w-6 h-6 text-blue-600"></lucide-icon>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Detalles de la solicitud</h3>
              <p class="text-sm text-gray-600">Información completa del solicitante</p>
            </div>
          </div>
          <button (click)="closeDetailModal()" class="text-gray-400 hover:text-gray-600">
            <lucide-icon [img]="xCircleIcon" class="w-6 h-6"></lucide-icon>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="flex-1 overflow-y-auto px-5 py-6" *ngIf="selectedRequest">
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nombre completo</label>
                <p class="mt-1 text-gray-900">{{ selectedRequest.fullName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Identificación</label>
                <p class="mt-1 text-gray-900">{{ selectedRequest.idType }} {{ selectedRequest.idNumber }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Correo electrónico</label>
                <p class="mt-1 flex items-center gap-2 text-gray-900">
                  {{ selectedRequest.email }}
                  <lucide-icon *ngIf="selectedRequest.emailVerified" [img]="checkCircle2Icon" class="w-4 h-4 text-green-600"></lucide-icon>
                </p>
              </div>
              <div *ngIf="selectedRequest.phone">
                <label class="block text-sm font-medium text-gray-700">Teléfono</label>
                <p class="mt-1 flex items-center gap-2 text-gray-900">
                  {{ selectedRequest.phone }}
                  <lucide-icon *ngIf="selectedRequest.phoneVerified" [img]="checkCircle2Icon" class="w-4 h-4 text-green-600"></lucide-icon>
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Método de autenticación</label>
                <p class="mt-1 text-gray-900">{{ selectedRequest.preferredAuthMethod === 'password' ? 'Usuario y Contraseña' : 'Firma Digital BCCR' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Puntuación de riesgo</label>
                <p class="mt-1">
                  <span [class]="getRiskBadgeClass(selectedRequest.riskScore)">
                    {{ getRiskText(selectedRequest.riskScore) }}
                  </span>
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Fecha de solicitud</label>
                <p class="mt-1 text-gray-900">{{ formatDate(selectedRequest.submittedAt) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Estado</label>
                <p class="mt-1">
                  <span [class]="getStatusBadgeClass(selectedRequest.status)">
                    {{ getStatusText(selectedRequest.status) }}
                  </span>
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Verificaciones</label>
              <div class="flex flex-wrap gap-2">
                <span [class]="selectedRequest.emailVerified ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800' : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'">
                  <lucide-icon [img]="selectedRequest.emailVerified ? checkCircle2Icon : xCircleIcon" class="w-3 h-3 mr-1"></lucide-icon>
                  Email {{ selectedRequest.emailVerified ? 'verificado' : 'no verificado' }}
                </span>
                <span [class]="selectedRequest.phoneVerified ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800' : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'">
                  <lucide-icon [img]="selectedRequest.phoneVerified ? checkCircle2Icon : xCircleIcon" class="w-3 h-3 mr-1"></lucide-icon>
                  Teléfono {{ selectedRequest.phoneVerified ? 'verificado' : 'no verificado' }}
                </span>
                <span [class]="selectedRequest.termsAccepted ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800' : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'">
                  <lucide-icon [img]="selectedRequest.termsAccepted ? checkCircle2Icon : xCircleIcon" class="w-3 h-3 mr-1"></lucide-icon>
                  Términos aceptados
                </span>
                <span [class]="selectedRequest.privacyAccepted ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800' : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'">
                  <lucide-icon [img]="selectedRequest.privacyAccepted ? checkCircle2Icon : xCircleIcon" class="w-3 h-3 mr-1"></lucide-icon>
                  Privacidad aceptada
                </span>
              </div>
            </div>

            <div *ngIf="selectedRequest.reviewedAt" [class]="selectedRequest.status === 'approved' ? 'p-4 bg-green-50 border border-green-200 rounded-lg' : 'p-4 bg-red-50 border border-red-200 rounded-lg'">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="alertCircleIcon" class="w-4 h-4"></lucide-icon>
                <span class="font-medium">
                  Revisada por <strong>Administrador</strong> el {{ formatDate(selectedRequest.reviewedAt) }}
                </span>
              </div>
              <p *ngIf="selectedRequest.rejectionReason" class="text-sm">
                <strong>Motivo:</strong> {{ selectedRequest.rejectionReason }}
              </p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end gap-3 p-5 pt-4 border-t border-gray-200 flex-shrink-0">
          <button 
            (click)="closeDetailModal()"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Cerrar
          </button>
          <button
            *ngIf="selectedRequest?.status === 'pending'"
            (click)="approveFromModal()"
            class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
            <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 mr-2"></lucide-icon>
            Aprobar
          </button>
          <button
            *ngIf="selectedRequest?.status === 'pending'"
            (click)="rejectFromModal()"
            class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
            <lucide-icon [img]="xCircleIcon" class="w-4 h-4 mr-2"></lucide-icon>
            Rechazar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Aprobar -->
    <div *ngIf="showApproveModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" (click)="closeApproveModal()">
      <div class="relative top-20 mx-auto border w-11/12 md:w-2/3 lg:w-1/2 max-w-2xl shadow-lg rounded-md bg-white" (click)="$event.stopPropagation()">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <lucide-icon [img]="checkCircle2Icon" class="w-6 h-6 text-green-600"></lucide-icon>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Aprobar solicitud</h3>
              <p class="text-sm text-gray-600">¿Confirmas que deseas aprobar esta solicitud de registro?</p>
            </div>
          </div>
          
          <div *ngIf="selectedRequest" class="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
            <div class="flex items-center gap-2 mb-2">
              <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 text-green-600"></lucide-icon>
              <span class="text-sm text-green-800">
                Se enviará un correo a <strong>{{ selectedRequest.email }}</strong> notificando que su cuenta ha sido aprobada y puede acceder al sistema.
              </span>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button 
              (click)="closeApproveModal()"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Cancelar
            </button>
            <button 
              (click)="confirmApprove()"
              class="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              Confirmar aprobación
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Rechazar -->
    <div *ngIf="showRejectModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" (click)="closeRejectModal()">
      <div class="relative top-20 mx-auto border w-11/12 md:w-2/3 lg:w-1/2 max-w-2xl shadow-lg rounded-md bg-white" (click)="$event.stopPropagation()">
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <lucide-icon [img]="xCircleIcon" class="w-6 h-6 text-red-600"></lucide-icon>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Rechazar solicitud</h3>
              <p class="text-sm text-gray-600">Proporciona un motivo claro del rechazo</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Motivo del rechazo *</label>
              <textarea
                [(ngModel)]="rejectionReason"
                rows="4"
                placeholder="Ejemplo: Documentación incompleta - No se pudo verificar número de colegiado"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none">
              </textarea>
              <p class="text-xs text-gray-500 mt-1">Este mensaje será enviado al solicitante</p>
            </div>

            <div *ngIf="selectedRequest" class="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center gap-2">
                <lucide-icon [img]="xCircleIcon" class="w-4 h-4 text-red-600"></lucide-icon>
                <span class="text-sm text-red-800">
                  Se enviará un correo a <strong>{{ selectedRequest.email }}</strong> con el motivo del rechazo.
                </span>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button 
              (click)="closeRejectModal()"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Cancelar
            </button>
            <button 
              (click)="confirmReject()"
              [disabled]="!rejectionReason.trim()"
              class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
              Confirmar rechazo
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AprobacionesComponent implements OnInit {
  // Icons
  userCheckIcon = UserCheck;
  searchIcon = Search;
  filterIcon = Filter;
  clockIcon = Clock;
  checkCircle2Icon = CheckCircle2;
  xCircleIcon = XCircle;
  alertCircleIcon = AlertCircle;
  mailIcon = Mail;
  phoneIcon = Phone;
  shieldIcon = Shield;
  fileTextIcon = FileText;
  eyeIcon = Eye;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Seguridad y usuarios', route: '/seguridad' },
    { label: 'Aprobación de usuarios', route: '/seguridad/aprobaciones' }
  ];

  // Filters
  searchTerm = '';
  statusFilter = 'pending';
  activeTab = 'pending';

  // Modal states
  showDetailModal = false;
  showApproveModal = false;
  showRejectModal = false;
  selectedRequest: RegistrationRequest | null = null;
  rejectionReason = '';

  // Mock data
  registrationRequests: RegistrationRequest[] = [
    {
      id: 'REQ-001',
      fullName: 'Dr. Luis Hernández Quesada',
      email: 'luis.hernandez@medico.cr',
      phone: '+506 8666-5555',
      idType: 'Cédula',
      idNumber: '1-0678-0901',
      preferredAuthMethod: 'password',
      status: 'pending',
      submittedAt: '2025-10-05 10:45',
      emailVerified: true,
      phoneVerified: true,
      termsAccepted: true,
      privacyAccepted: true,
      riskScore: 0.2
    },
    {
      id: 'REQ-002',
      fullName: 'Dra. María Céspedes Mora',
      email: 'maria.cespedes@clinica.cr',
      phone: '+506 8555-4444',
      idType: 'Cédula',
      idNumber: '1-0789-0123',
      preferredAuthMethod: 'digital-signature',
      status: 'pending',
      submittedAt: '2025-10-06 03:30',
      emailVerified: true,
      phoneVerified: false,
      termsAccepted: true,
      privacyAccepted: true,
      riskScore: 0.4
    },
    {
      id: 'REQ-003',
      fullName: 'Dr. Carlos Rodríguez Vega',
      email: 'carlos.rodriguez@hospital.cr',
      phone: '+506 8777-6666',
      idType: 'Cédula',
      idNumber: '1-0890-1234',
      preferredAuthMethod: 'password',
      status: 'approved',
      submittedAt: '2025-10-03 14:20',
      reviewedAt: '2025-10-04 09:15',
      reviewedBy: 'admin-001',
      emailVerified: true,
      phoneVerified: true,
      termsAccepted: true,
      privacyAccepted: true,
      riskScore: 0.1
    },
    {
      id: 'REQ-004',
      fullName: 'Dra. Ana Jiménez Castro',
      email: 'ana.jimenez@medico.cr',
      phone: '+506 8999-8888',
      idType: 'Cédula',
      idNumber: '1-0901-2345',
      preferredAuthMethod: 'digital-signature',
      status: 'rejected',
      submittedAt: '2025-10-02 16:45',
      reviewedAt: '2025-10-03 11:30',
      reviewedBy: 'admin-001',
      rejectionReason: 'Documentación incompleta - No se pudo verificar número de colegiado',
      emailVerified: false,
      phoneVerified: false,
      termsAccepted: true,
      privacyAccepted: true,
      riskScore: 0.8
    }
  ];

  constructor() {}

  ngOnInit() {
    // Initialize component
  }

  get tabs() {
    return [
      { key: 'all', label: 'Todas', count: this.registrationRequests.length },
      { key: 'pending', label: 'Pendientes', count: this.pendingCount },
      { key: 'approved', label: 'Aprobadas', count: this.approvedCount },
      { key: 'rejected', label: 'Rechazadas', count: this.rejectedCount }
    ];
  }

  get pendingCount() {
    return this.registrationRequests.filter(r => r.status === 'pending').length;
  }

  get approvedCount() {
    return this.registrationRequests.filter(r => r.status === 'approved').length;
  }

  get rejectedCount() {
    return this.registrationRequests.filter(r => r.status === 'rejected').length;
  }

  get filteredRequests() {
    return this.registrationRequests.filter(request => {
      const matchesStatus = this.activeTab === 'all' || request.status === this.activeTab;
      const matchesSearch = 
        request.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        request.idNumber.includes(this.searchTerm);
      return matchesStatus && matchesSearch;
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.statusFilter = tab;
  }

  getTabClass(tab: string): string {
    return this.activeTab === tab 
      ? 'border-blue-600 text-blue-600 border-b-2 py-4 px-1 text-sm font-medium'
      : 'border-transparent text-gray-500 hover:text-gray-700 py-4 px-1 text-sm font-medium cursor-pointer';
  }

  getTabLabel(tab: string): string {
    switch (tab) {
      case 'pending': return 'pendientes';
      case 'approved': return 'aprobadas';
      case 'rejected': return 'rechazadas';
      default: return '';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200';
      case 'approved':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200';
      case 'rejected':
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200';
      default:
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobada';
      case 'rejected': return 'Rechazada';
      default: return 'Desconocido';
    }
  }

  getRiskBadgeClass(score: number): string {
    if (score < 0.3) {
      return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200';
    } else if (score < 0.6) {
      return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200';
    } else {
      return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200';
    }
  }

  getRiskText(score: number): string {
    if (score < 0.3) return 'Bajo riesgo';
    if (score < 0.6) return 'Riesgo medio';
    return 'Alto riesgo';
  }

  formatDate(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleString('es-CR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Modal methods
  viewDetails(request: RegistrationRequest) {
    this.selectedRequest = request;
    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedRequest = null;
  }

  approveRequest(request: RegistrationRequest) {
    this.selectedRequest = request;
    this.showApproveModal = true;
  }

  approveFromModal() {
    this.closeDetailModal();
    this.showApproveModal = true;
  }

  closeApproveModal() {
    this.showApproveModal = false;
    this.selectedRequest = null;
  }

  confirmApprove() {
    if (this.selectedRequest) {
      // Update request status
      this.selectedRequest.status = 'approved';
      this.selectedRequest.reviewedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
      this.selectedRequest.reviewedBy = 'admin-001';
      
      // Update in array
      const index = this.registrationRequests.findIndex(r => r.id === this.selectedRequest!.id);
      if (index !== -1) {
        this.registrationRequests[index] = { ...this.selectedRequest };
      }

      alert(`Solicitud aprobada. Se ha enviado un correo de notificación a ${this.selectedRequest.email}`);
      this.closeApproveModal();
    }
  }

  rejectRequest(request: RegistrationRequest) {
    this.selectedRequest = request;
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  rejectFromModal() {
    this.closeDetailModal();
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.selectedRequest = null;
    this.rejectionReason = '';
  }

  confirmReject() {
    if (this.selectedRequest && this.rejectionReason.trim()) {
      // Update request status
      this.selectedRequest.status = 'rejected';
      this.selectedRequest.reviewedAt = new Date().toISOString().slice(0, 16).replace('T', ' ');
      this.selectedRequest.reviewedBy = 'admin-001';
      this.selectedRequest.rejectionReason = this.rejectionReason;
      
      // Update in array
      const index = this.registrationRequests.findIndex(r => r.id === this.selectedRequest!.id);
      if (index !== -1) {
        this.registrationRequests[index] = { ...this.selectedRequest };
      }

      alert(`Solicitud rechazada. Se ha enviado un correo de notificación a ${this.selectedRequest.email}`);
      this.closeRejectModal();
    }
  }
}