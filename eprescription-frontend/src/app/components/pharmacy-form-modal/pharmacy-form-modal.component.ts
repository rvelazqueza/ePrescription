import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, Building, MapPin, Phone, Mail, User, Save } from 'lucide-angular';
import { Pharmacy } from '../../interfaces/pharmacy.interface';
import { 
  provinciasCostaRica, 
  getCantonesByProvincia, 
  getDistritosByCanton,
  Provincia,
  Canton,
  Distrito
} from '../../utils/costa-rica-data';

interface PharmacyFormData {
  codigo: string;
  nombre: string;
  provinciaId: string;
  cantonId: string;
  distritoId: string;
  direccionEspecifica: string;
  telefono: string;
  email: string;
  responsable: string;
  cedulaResponsable: string;
  estado: 'activa' | 'inactiva' | 'suspendida';
  horario: string;
  observaciones: string;
}

@Component({
  selector: 'app-pharmacy-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 overflow-y-auto" (click)="onBackdropClick($event)">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <!-- Modal -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="bg-white/20 p-2 rounded-lg">
                  <lucide-icon [img]="buildingIcon" class="w-6 h-6 text-white"></lucide-icon>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white">
                    {{ isEditMode ? 'Editar Farmacia' : 'Registrar Nueva Farmacia' }}
                  </h3>
                  <p class="text-blue-100 text-sm">
                    Complete la información de la farmacia. Los campos marcados con * son obligatorios.
                  </p>
                </div>
              </div>
              <button 
                (click)="close()"
                class="text-white hover:text-blue-200 p-1 rounded-lg hover:bg-white/10 transition-colors">
                <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="px-6 py-6 max-h-[70vh] overflow-y-auto">
            <form (ngSubmit)="onSubmit()" #pharmacyForm="ngForm">
              <div class="space-y-6">
                <!-- Basic Information -->
                <div class="space-y-4">
                  <h4 class="flex items-center gap-2 text-lg font-medium text-gray-900">
                    <lucide-icon [img]="buildingIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
                    Información Básica
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Código *</label>
                      <input
                        type="text"
                        [(ngModel)]="formData.codigo"
                        name="codigo"
                        required
                        placeholder="FARM-XXX"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        [class.border-red-300]="pharmacyForm.submitted && !formData.codigo">
                    </div>
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Estado *</label>
                      <select
                        [(ngModel)]="formData.estado"
                        name="estado"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="activa">Activa</option>
                        <option value="inactiva">Inactiva</option>
                        <option value="suspendida">Suspendida</option>
                      </select>
                    </div>
                    <div class="col-span-2 space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Nombre de la Farmacia *</label>
                      <input
                        type="text"
                        [(ngModel)]="formData.nombre"
                        name="nombre"
                        required
                        placeholder="Ej: Farmacia Central"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        [class.border-red-300]="pharmacyForm.submitted && !formData.nombre">
                    </div>
                  </div>
                </div>

                <!-- Geographic Location -->
                <div class="space-y-4">
                  <h4 class="flex items-center gap-2 text-lg font-medium text-gray-900">
                    <lucide-icon [img]="mapPinIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
                    Ubicación Geográfica
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Provincia *</label>
                      <select
                        [(ngModel)]="formData.provinciaId"
                        name="provinciaId"
                        required
                        (ngModelChange)="onProvinceChange()"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        [class.border-red-300]="pharmacyForm.submitted && !formData.provinciaId">
                        <option value="">Seleccione...</option>
                        <option *ngFor="let provincia of provincias" [value]="provincia.id">
                          {{ provincia.nombre }}
                        </option>
                      </select>
                    </div>
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Cantón *</label>
                      <select
                        [(ngModel)]="formData.cantonId"
                        name="cantonId"
                        required
                        (ngModelChange)="onCantonChange()"
                        [disabled]="!formData.provinciaId"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        [class.border-red-300]="pharmacyForm.submitted && !formData.cantonId">
                        <option value="">Seleccione...</option>
                        <option *ngFor="let canton of availableCantones" [value]="canton.id">
                          {{ canton.nombre }}
                        </option>
                      </select>
                    </div>
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Distrito *</label>
                      <select
                        [(ngModel)]="formData.distritoId"
                        name="distritoId"
                        required
                        [disabled]="!formData.cantonId"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        [class.border-red-300]="pharmacyForm.submitted && !formData.distritoId">
                        <option value="">Seleccione...</option>
                        <option *ngFor="let distrito of availableDistritos" [value]="distrito.id">
                          {{ distrito.nombre }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Dirección Específica *</label>
                    <textarea
                      [(ngModel)]="formData.direccionEspecifica"
                      name="direccionEspecifica"
                      required
                      rows="3"
                      placeholder="Ej: Avenida Central, 200 metros norte de..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      [class.border-red-300]="pharmacyForm.submitted && !formData.direccionEspecifica">
                    </textarea>
                  </div>
                </div>

                <!-- Contact Information -->
                <div class="space-y-4">
                  <h4 class="flex items-center gap-2 text-lg font-medium text-gray-900">
                    <lucide-icon [img]="phoneIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
                    Información de Contacto
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Teléfono *</label>
                      <input
                        type="tel"
                        [(ngModel)]="formData.telefono"
                        name="telefono"
                        required
                        placeholder="2222-3344"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        [class.border-red-300]="pharmacyForm.submitted && !formData.telefono">
                    </div>
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Email *</label>
                      <input
                        type="email"
                        [(ngModel)]="formData.email"
                        name="email"
                        required
                        placeholder="farmacia@ejemplo.cr"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        [class.border-red-300]="pharmacyForm.submitted && !formData.email">
                    </div>
                  </div>
                </div>

                <!-- Responsible Person -->
                <div class="space-y-4">
                  <h4 class="flex items-center gap-2 text-lg font-medium text-gray-900">
                    <lucide-icon [img]="userIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
                    Regente Farmacéutico
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Nombre Completo *</label>
                      <input
                        type="text"
                        [(ngModel)]="formData.responsable"
                        name="responsable"
                        required
                        placeholder="Dr. Juan Pérez Rodríguez"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        [class.border-red-300]="pharmacyForm.submitted && !formData.responsable">
                    </div>
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Cédula *</label>
                      <input
                        type="text"
                        [(ngModel)]="formData.cedulaResponsable"
                        name="cedulaResponsable"
                        required
                        placeholder="1-0234-0567"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        [class.border-red-300]="pharmacyForm.submitted && !formData.cedulaResponsable">
                    </div>
                  </div>
                </div>

                <!-- Additional Information -->
                <div class="space-y-4">
                  <h4 class="text-lg font-medium text-gray-900">Información Adicional</h4>
                  <div class="space-y-4">
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Horario de Atención</label>
                      <textarea
                        [(ngModel)]="formData.horario"
                        name="horario"
                        rows="2"
                        placeholder="Lunes a Viernes: 7:00 AM - 8:00 PM, Sábados: 8:00 AM - 6:00 PM"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      </textarea>
                    </div>
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700">Observaciones</label>
                      <textarea
                        [(ngModel)]="formData.observaciones"
                        name="observaciones"
                        rows="3"
                        placeholder="Información adicional sobre la farmacia..."
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      </textarea>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button 
              type="button"
              (click)="close()"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button 
              type="submit"
              (click)="onSubmit()"
              [disabled]="isSubmitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
              <lucide-icon [img]="saveIcon" class="w-4 h-4"></lucide-icon>
              {{ isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Registrar') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .border-red-300 {
      border-color: #fca5a5;
    }
  `]
})
export class PharmacyFormModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() pharmacy: Pharmacy | null = null;
  @Input() isEditMode = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() savePharmacy = new EventEmitter<PharmacyFormData>();

  // Icons
  buildingIcon = Building;
  xIcon = X;
  mapPinIcon = MapPin;
  phoneIcon = Phone;
  mailIcon = Mail;
  userIcon = User;
  saveIcon = Save;

  // Geographic data
  provincias = provinciasCostaRica;
  availableCantones: Canton[] = [];
  availableDistritos: Distrito[] = [];

  // Form state
  isSubmitting = false;
  formData: PharmacyFormData = {
    codigo: '',
    nombre: '',
    provinciaId: '',
    cantonId: '',
    distritoId: '',
    direccionEspecifica: '',
    telefono: '',
    email: '',
    responsable: '',
    cedulaResponsable: '',
    estado: 'activa',
    horario: '',
    observaciones: ''
  };

  ngOnInit(): void {
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pharmacy'] && this.pharmacy) {
      this.loadPharmacyData();
    } else if (changes['isOpen'] && this.isOpen && !this.pharmacy) {
      this.resetForm();
    }
  }

  private loadPharmacyData(): void {
    if (this.pharmacy) {
      this.formData = {
        codigo: this.pharmacy.codigo,
        nombre: this.pharmacy.nombre,
        provinciaId: this.pharmacy.provinciaId,
        cantonId: this.pharmacy.cantonId,
        distritoId: this.pharmacy.distritoId,
        direccionEspecifica: this.pharmacy.direccionEspecifica,
        telefono: this.pharmacy.telefono,
        email: this.pharmacy.email,
        responsable: this.pharmacy.responsable,
        cedulaResponsable: this.pharmacy.cedulaResponsable,
        estado: this.pharmacy.estado,
        horario: this.pharmacy.horario,
        observaciones: this.pharmacy.observaciones
      };
      
      // Load dependent dropdowns
      this.onProvinceChange();
      this.onCantonChange();
    }
  }

  private resetForm(): void {
    this.formData = {
      codigo: '',
      nombre: '',
      provinciaId: '',
      cantonId: '',
      distritoId: '',
      direccionEspecifica: '',
      telefono: '',
      email: '',
      responsable: '',
      cedulaResponsable: '',
      estado: 'activa',
      horario: '',
      observaciones: ''
    };
    this.availableCantones = [];
    this.availableDistritos = [];
  }

  onProvinceChange(): void {
    this.availableCantones = getCantonesByProvincia(this.formData.provinciaId);
    this.formData.cantonId = '';
    this.formData.distritoId = '';
    this.availableDistritos = [];
  }

  onCantonChange(): void {
    this.availableDistritos = getDistritosByCanton(this.formData.provinciaId, this.formData.cantonId);
    this.formData.distritoId = '';
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.isSubmitting = true;
      this.savePharmacy.emit(this.formData);
    }
  }

  private isFormValid(): boolean {
    return !!(
      this.formData.codigo &&
      this.formData.nombre &&
      this.formData.provinciaId &&
      this.formData.cantonId &&
      this.formData.distritoId &&
      this.formData.direccionEspecifica &&
      this.formData.telefono &&
      this.formData.email &&
      this.formData.responsable &&
      this.formData.cedulaResponsable
    );
  }

  close(): void {
    this.isSubmitting = false;
    this.closeModal.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}