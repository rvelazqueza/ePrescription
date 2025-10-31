import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X, Building, MapPin, Phone, Mail, User, Clock, FileText, CheckCircle, AlertCircle, XCircle, Calendar, Download, Edit } from 'lucide-angular';
import { Pharmacy } from '../../interfaces/pharmacy.interface';
import { getFullLocation } from '../../utils/costa-rica-data';

@Component({
  selector: 'app-pharmacy-detail-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <!-- Modal Backdrop -->
    <div *ngIf="isOpen" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
         (click)="onBackdropClick($event)">
      
      <!-- Modal Content -->
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
           style="border: 1px solid #e5e7eb !important; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;"
           (click)="$event.stopPropagation()" *ngIf="pharmacy">
        
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 rounded-t-xl text-white" 
             style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #1d4ed8 100%); border: none !important; border-bottom: none !important;">
          <div class="flex items-center gap-3">
            <div class="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <lucide-icon [img]="buildingIcon" class="w-6 h-6 text-white"></lucide-icon>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">Detalles de Farmacia</h2>
              <p class="text-sm text-white/90">Información completa de {{ pharmacy.nombre }}</p>
            </div>
          </div>
          <button 
            (click)="close()"
            class="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Cerrar">
            <lucide-icon [img]="xIcon" class="w-5 h-5 text-white"></lucide-icon>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-6">
          
          <!-- Información básica -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <lucide-icon [img]="fileTextIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
              Información Básica
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-500">Código</label>
                <p class="text-sm font-semibold text-gray-900 font-mono">{{ pharmacy.codigo }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Estado</label>
                <div class="mt-1">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [ngClass]="getStatusBadgeClass(pharmacy.estado)">
                    <span class="w-2 h-2 rounded-full mr-1.5" [ngClass]="getStatusDotClass(pharmacy.estado)"></span>
                    {{ getStatusLabel(pharmacy.estado) }}
                  </span>
                </div>
              </div>
              <div class="col-span-2">
                <label class="text-sm font-medium text-gray-500">Nombre</label>
                <p class="text-lg font-semibold text-gray-900">{{ pharmacy.nombre }}</p>
              </div>
            </div>
          </div>

          <!-- Ubicación -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <lucide-icon [img]="mapPinIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
              Ubicación Geográfica
            </h3>
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-500">Ubicación</label>
                <p class="text-sm text-gray-900 flex items-center gap-1">
                  <lucide-icon [img]="mapPinIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                  {{ getFullLocationForPharmacy(pharmacy) }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Dirección Específica</label>
                <p class="text-sm text-gray-900">{{ pharmacy.direccionEspecifica }}</p>
              </div>
            </div>
          </div>

          <!-- Información de contacto -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <lucide-icon [img]="phoneIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
              Información de Contacto
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-500">Teléfono</label>
                <p class="text-sm text-gray-900 flex items-center gap-1">
                  <lucide-icon [img]="phoneIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                  {{ pharmacy.telefono }}
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Email</label>
                <p class="text-sm text-gray-900 flex items-center gap-1">
                  <lucide-icon [img]="mailIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                  {{ pharmacy.email }}
                </p>
              </div>
            </div>
          </div>

          <!-- Regente farmacéutico -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <lucide-icon [img]="userIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
              Regente Farmacéutico
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-gray-500">Nombre Completo</label>
                <p class="text-sm font-semibold text-gray-900">{{ pharmacy.responsable }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Cédula</label>
                <p class="text-sm text-gray-900 font-mono">{{ pharmacy.cedulaResponsable }}</p>
              </div>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <lucide-icon [img]="clockIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
              Información Adicional
            </h3>
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-500">Horario de Atención</label>
                <p class="text-sm text-gray-900">{{ pharmacy.horario }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-500">Fecha de Registro</label>
                <p class="text-sm text-gray-900 flex items-center gap-1">
                  <lucide-icon [img]="calendarIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                  {{ formatDate(pharmacy.fechaRegistro) }}
                </p>
              </div>
              <div *ngIf="pharmacy.observaciones">
                <label class="text-sm font-medium text-gray-500">Observaciones</label>
                <p class="text-sm text-gray-900">{{ pharmacy.observaciones }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button 
            (click)="exportPharmacyInfo()"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
            Exportar información
          </button>
          <div class="flex gap-3">
            <button 
              (click)="editPharmacy()"
              class="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-sm">
              <lucide-icon [img]="editIcon" class="w-4 h-4"></lucide-icon>
              Editar
            </button>
            <button 
              (click)="close()"
              class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class PharmacyDetailModalComponent {
  @Input() isOpen = false;
  @Input() pharmacy: Pharmacy | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() editPharmacyEvent = new EventEmitter<Pharmacy>();

  // Icons
  buildingIcon = Building;
  xIcon = X;
  mapPinIcon = MapPin;
  phoneIcon = Phone;
  mailIcon = Mail;
  userIcon = User;
  clockIcon = Clock;
  fileTextIcon = FileText;
  checkCircleIcon = CheckCircle;
  alertCircleIcon = AlertCircle;
  xCircleIcon = XCircle;
  calendarIcon = Calendar;
  downloadIcon = Download;
  editIcon = Edit;

  close(): void {
    this.closeModal.emit();
  }

  editPharmacy(): void {
    if (this.pharmacy) {
      this.editPharmacyEvent.emit(this.pharmacy);
    }
  }

  exportPharmacyInfo(): void {
    if (this.pharmacy) {
      // TODO: Implement export functionality
      console.log('Exportar información de farmacia:', this.pharmacy);
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  getFullLocationForPharmacy(pharmacy: Pharmacy): string {
    return getFullLocation(pharmacy.provinciaId, pharmacy.cantonId, pharmacy.distritoId);
  }

  getStatusBadgeClass(estado: string): string {
    const classes = {
      'activa': 'bg-green-100 text-green-800 border-green-200',
      'inactiva': 'bg-gray-100 text-gray-800 border-gray-200',
      'suspendida': 'bg-red-100 text-red-800 border-red-200'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  getStatusDotClass(estado: string): string {
    const classes = {
      'activa': 'bg-green-400',
      'inactiva': 'bg-gray-400',
      'suspendida': 'bg-red-400'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-400';
  }

  getStatusLabel(estado: string): string {
    const labels = {
      'activa': 'Activa',
      'inactiva': 'Inactiva',
      'suspendida': 'Suspendida'
    };
    return labels[estado as keyof typeof labels] || 'Desconocido';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}