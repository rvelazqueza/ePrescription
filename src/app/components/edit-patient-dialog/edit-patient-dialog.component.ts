import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, User, Phone, Mail, MapPin, Heart, Shield, AlertTriangle, Activity, FileText, Plus, X, Save, UserCircle, Pill } from 'lucide-angular';

import { DialogComponent, DialogHeaderComponent, DialogTitleComponent, DialogContentComponent, DialogFooterComponent } from '../ui/dialog/dialog.component';
import { ButtonComponent } from '../ui/button/button.component';
import { InputComponent } from '../ui/input/input.component';
import { LabelComponent } from '../ui/label/label.component';
import { TextareaComponent } from '../ui/textarea/textarea.component';
import { SelectComponent, SelectOption } from '../ui/select/select.component';
import { PatientData } from '../../interfaces/patient.interface';

@Component({
  selector: 'app-edit-patient-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LucideAngularModule,
    DialogComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogContentComponent,
    DialogFooterComponent,
    ButtonComponent,
    InputComponent,
    LabelComponent,
    TextareaComponent,
    SelectComponent
  ],
  template: `
    <app-dialog [open]="open" (openChange)="onOpenChange($event)" contentClass="max-w-4xl">
      <app-dialog-header>
        <app-dialog-title>
          <div class="flex items-center gap-2">
            <lucide-icon [img]="userCircleIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
            Editar perfil del paciente
          </div>
        </app-dialog-title>
        <p class="text-sm text-gray-600 mt-2">
          ID: {{ patient?.id }} • Actualice la información médica y personal del paciente
        </p>
      </app-dialog-header>
      
      <app-dialog-content>
        <!-- Tabs Navigation -->
        <div class="border-b border-gray-200 mb-6">
          <nav class="flex space-x-8">
            <button
              *ngFor="let tab of tabs"
              (click)="activeTab = tab.id"
              [class]="getTabClass(tab.id)"
              class="py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2"
            >
              <lucide-icon [img]="tab.icon" class="w-4 h-4"></lucide-icon>
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <form [formGroup]="patientForm" (ngSubmit)="onSubmit()">
          <!-- Tab: Personal -->
          <div *ngIf="activeTab === 'personal'" class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Datos personales</h3>
              
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <app-label>Nombres <span class="text-red-500">*</span></app-label>
                  <app-input
                    placeholder="Nombres del paciente"
                    formControlName="firstName"
                    [hasError]="isFieldInvalid('firstName')"
                  ></app-input>
                  <div *ngIf="isFieldInvalid('firstName')" class="text-xs text-red-600 mt-1">
                    El nombre es requerido
                  </div>
                </div>
                <div>
                  <app-label>Apellidos <span class="text-red-500">*</span></app-label>
                  <app-input
                    placeholder="Apellidos del paciente"
                    formControlName="firstLastName"
                    [hasError]="isFieldInvalid('firstLastName')"
                  ></app-input>
                  <div *ngIf="isFieldInvalid('firstLastName')" class="text-xs text-red-600 mt-1">
                    Los apellidos son requeridos
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <app-label>Tipo de identificación</app-label>
                  <app-select
                    [options]="idTypeOptions"
                    formControlName="idType"
                  ></app-select>
                </div>
                <div>
                  <app-label>Número de identificación <span class="text-red-500">*</span></app-label>
                  <app-input
                    placeholder="Número de documento"
                    formControlName="idNumber"
                    [hasError]="isFieldInvalid('idNumber')"
                  ></app-input>
                </div>
                <div>
                  <app-label>Fecha de nacimiento <span class="text-red-500">*</span></app-label>
                  <app-input
                    type="date"
                    formControlName="birthDate"
                    [hasError]="isFieldInvalid('birthDate')"
                  ></app-input>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <app-label>Sexo</app-label>
                  <app-select
                    [options]="genderOptions"
                    formControlName="gender"
                  ></app-select>
                </div>
                <div>
                  <app-label>Tipo de sangre</app-label>
                  <app-select
                    [options]="bloodTypeOptions"
                    formControlName="bloodType"
                  ></app-select>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Contact -->
          <div *ngIf="activeTab === 'contact'" class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <lucide-icon [img]="phoneIcon" class="w-4 h-4"></lucide-icon>
                Información de contacto
              </h3>
              
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <app-label>Teléfono</app-label>
                  <app-input
                    placeholder="+506 8888-9999"
                    formControlName="phone"
                    [hasError]="isFieldInvalid('phone')"
                  ></app-input>
                </div>
                <div>
                  <app-label>Email</app-label>
                  <app-input
                    type="email"
                    placeholder="paciente@email.com"
                    formControlName="email"
                    [hasError]="isFieldInvalid('email')"
                  ></app-input>
                </div>
              </div>

              <div class="mb-4">
                <app-label>Dirección</app-label>
                <app-input
                  placeholder="Calle 45 #23-67, Apto 301"
                  formControlName="address"
                ></app-input>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <app-label>Ciudad</app-label>
                  <app-input
                    placeholder="San José"
                    formControlName="city"
                  ></app-input>
                </div>
                <div>
                  <app-label>País</app-label>
                  <app-select
                    [options]="countryOptions"
                    formControlName="country"
                  ></app-select>
                </div>
              </div>
            </div>

            <!-- Seguro médico -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <lucide-icon [img]="shieldIcon" class="w-4 h-4"></lucide-icon>
                Seguro médico
              </h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <app-label>Proveedor de seguro</app-label>
                  <app-input
                    placeholder="CCSS, INS, etc."
                    formControlName="insuranceProvider"
                  ></app-input>
                </div>
                <div>
                  <app-label>Número de póliza</app-label>
                  <app-input
                    placeholder="POL-2024-789456"
                    formControlName="insuranceNumber"
                  ></app-input>
                </div>
              </div>
            </div>

            <!-- Contacto de emergencia -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-4 h-4"></lucide-icon>
                Contacto de emergencia
              </h3>
              
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <app-label>Nombre completo</app-label>
                  <app-input
                    placeholder="Nombre del contacto"
                    formControlName="emergencyName"
                  ></app-input>
                </div>
                <div>
                  <app-label>Relación</app-label>
                  <app-input
                    placeholder="Esposo, Madre, etc."
                    formControlName="emergencyRelationship"
                  ></app-input>
                </div>
                <div>
                  <app-label>Teléfono</app-label>
                  <app-input
                    placeholder="+506 8888-9999"
                    formControlName="emergencyPhone"
                  ></app-input>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Medical -->
          <div *ngIf="activeTab === 'medical'" class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <lucide-icon [img]="activityIcon" class="w-4 h-4"></lucide-icon>
                Datos antropométricos
              </h3>
              
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <app-label>Peso (kg)</app-label>
                  <app-input
                    type="number"
                    step="0.1"
                    placeholder="68"
                    formControlName="weight"
                  ></app-input>
                </div>
                <div>
                  <app-label>Altura (m)</app-label>
                  <app-input
                    type="number"
                    step="0.01"
                    placeholder="1.65"
                    formControlName="height"
                  ></app-input>
                </div>
                <div>
                  <app-label>IMC (calculado)</app-label>
                  <div class="h-9 px-3 py-2 bg-gray-50 rounded-md border flex items-center">
                    <span class="font-medium">{{ getBMI() || 'N/A' }}</span>
                  </div>
                </div>
              </div>

              <!-- Medicación actual -->
              <div class="mb-6">
                <app-label>Medicación actual</app-label>
                <div class="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Ej: Enalapril 10mg - 1 vez al día - Mañana"
                    [(ngModel)]="newMedication"
                    [ngModelOptions]="{standalone: true}"
                    (keyup.enter)="addMedication()"
                    class="flex h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <app-button type="button" size="sm" (click)="addMedication()">
                    <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
                  </app-button>
                </div>
                <div class="space-y-2">
                  <div 
                    *ngFor="let medication of currentMedications; let i = index"
                    class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div class="flex items-center gap-2">
                      <lucide-icon [img]="pillIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                      <span class="text-sm">{{ medication }}</span>
                    </div>
                    <button
                      type="button"
                      (click)="removeMedication(i)"
                      class="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full p-1"
                    >
                      <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Conditions -->
          <div *ngIf="activeTab === 'conditions'" class="space-y-6">
            <!-- Alergias -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-4 h-4 text-red-600"></lucide-icon>
                Alergias conocidas
              </h3>
              
              <div class="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Ej: Penicilina"
                  [(ngModel)]="newAllergy"
                  [ngModelOptions]="{standalone: true}"
                  (keyup.enter)="addAllergy()"
                  class="flex h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <app-button type="button" size="sm" (click)="addAllergy()">
                  <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
                </app-button>
              </div>

              <div class="space-y-2">
                <div 
                  *ngFor="let allergy of allergies; let i = index"
                  class="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span class="text-sm font-medium text-red-900">{{ allergy }}</span>
                  </div>
                  <button
                    type="button"
                    (click)="removeAllergy(i)"
                    class="text-red-600 hover:text-red-700 hover:bg-red-100 rounded-full p-1"
                  >
                    <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
              </div>
            </div>

            <!-- Condiciones crónicas -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <lucide-icon [img]="heartIcon" class="w-4 h-4 text-orange-600"></lucide-icon>
                Condiciones crónicas
              </h3>
              
              <div class="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Ej: Hipertensión arterial"
                  [(ngModel)]="newCondition"
                  [ngModelOptions]="{standalone: true}"
                  (keyup.enter)="addCondition()"
                  class="flex h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                <app-button type="button" size="sm" (click)="addCondition()">
                  <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
                </app-button>
              </div>

              <div class="space-y-2">
                <div 
                  *ngFor="let condition of chronicConditions; let i = index"
                  class="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="activityIcon" class="w-4 h-4 text-orange-600"></lucide-icon>
                    <span class="text-sm font-medium text-orange-900">{{ condition }}</span>
                  </div>
                  <button
                    type="button"
                    (click)="removeCondition(i)"
                    class="text-orange-600 hover:text-orange-700 hover:bg-orange-100 rounded-full p-1"
                  >
                    <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Notes -->
          <div *ngIf="activeTab === 'notes'" class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <lucide-icon [img]="fileTextIcon" class="w-4 h-4"></lucide-icon>
                Notas clínicas
              </h3>
              
              <app-textarea
                placeholder="Ingrese observaciones clínicas, antecedentes relevantes, indicaciones especiales, seguimiento requerido, etc."
                [rows]="12"
                formControlName="clinicalNotes"
              ></app-textarea>
              <p class="text-xs text-gray-500 mt-2">
                Incluya información relevante para la atención médica del paciente
              </p>
            </div>
          </div>
        </form>
      </app-dialog-content>

      <app-dialog-footer>
        <div class="flex justify-end gap-2 w-full">
          <app-button variant="outline" type="button" (click)="onCancel()">
            Cancelar
          </app-button>
          <app-button type="button" (click)="onSubmit()" [disabled]="isSubmitting">
            <lucide-icon [img]="saveIcon" class="w-4 h-4 mr-2"></lucide-icon>
            {{ isSubmitting ? 'Guardando...' : 'Guardar cambios' }}
          </app-button>
        </div>
      </app-dialog-footer>
    </app-dialog>
  `
})
export class EditPatientDialogComponent implements OnInit, OnChanges {
  @Input() open = false;
  @Input() patient: PatientData | null = null;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() patientUpdated = new EventEmitter<PatientData>();

  patientForm: FormGroup;
  activeTab = 'personal';
  isSubmitting = false;

  // Dynamic arrays
  allergies: string[] = [];
  chronicConditions: string[] = [];
  currentMedications: string[] = [];
  newAllergy = '';
  newCondition = '';
  newMedication = '';

  // Icons
  userIcon = User;
  phoneIcon = Phone;
  mailIcon = Mail;
  mapPinIcon = MapPin;
  heartIcon = Heart;
  shieldIcon = Shield;
  alertTriangleIcon = AlertTriangle;
  activityIcon = Activity;
  fileTextIcon = FileText;
  plusIcon = Plus;
  xIcon = X;
  saveIcon = Save;
  userCircleIcon = UserCircle;
  pillIcon = Pill;

  tabs = [
    { id: 'personal', label: 'Personal', icon: this.userIcon },
    { id: 'contact', label: 'Contacto', icon: this.phoneIcon },
    { id: 'medical', label: 'Médico', icon: this.activityIcon },
    { id: 'conditions', label: 'Condiciones', icon: this.heartIcon },
    { id: 'notes', label: 'Notas', icon: this.fileTextIcon }
  ];

  idTypeOptions: SelectOption[] = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'PA', label: 'Pasaporte' },
    { value: 'RC', label: 'Registro Civil' }
  ];

  genderOptions: SelectOption[] = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' }
  ];

  bloodTypeOptions: SelectOption[] = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  countryOptions: SelectOption[] = [
    { value: 'Costa Rica', label: 'Costa Rica' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Chile', label: 'Chile' },
    { value: 'México', label: 'México' },
    { value: 'Perú', label: 'Perú' },
    { value: 'España', label: 'España' }
  ];

  constructor(private fb: FormBuilder) {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      firstLastName: ['', Validators.required],
      idType: ['CC'],
      idNumber: ['', Validators.required],
      birthDate: ['', Validators.required],
      gender: [''],
      bloodType: [''],
      phone: [''],
      email: ['', [Validators.email]],
      address: [''],
      city: [''],
      country: ['Costa Rica'],
      weight: [''],
      height: [''],
      clinicalNotes: [''],
      insuranceProvider: [''],
      insuranceNumber: [''],
      emergencyName: [''],
      emergencyRelationship: [''],
      emergencyPhone: ['']
    });
  }

  ngOnInit() {
    if (this.patient) {
      this.loadPatientData();
    }
  }

  ngOnChanges() {
    if (this.patient) {
      this.loadPatientData();
    }
  }

  loadPatientData() {
    if (!this.patient) return;

    this.patientForm.patchValue({
      firstName: this.patient.firstName,
      firstLastName: this.patient.firstLastName,
      idType: this.patient.idType || 'CC',
      idNumber: this.patient.idNumber,
      birthDate: this.patient.birthDate,
      gender: this.patient.gender,
      bloodType: this.patient.bloodType,
      phone: this.patient.phone,
      email: this.patient.email,
      address: this.patient.address,
      city: this.patient.city,
      country: this.patient.country || 'Costa Rica',
      weight: this.patient.weight,
      height: this.patient.height,
      clinicalNotes: this.patient.clinicalNotes,
      insuranceProvider: this.patient.insuranceProvider,
      insuranceNumber: this.patient.insuranceNumber,
      emergencyName: this.patient.emergencyContact?.name,
      emergencyRelationship: this.patient.emergencyContact?.relationship,
      emergencyPhone: this.patient.emergencyContact?.phone
    });

    this.allergies = [...(this.patient.allergies || [])];
    this.chronicConditions = [...(this.patient.chronicConditions || [])];
    this.currentMedications = [...(this.patient.currentMedications || [])];
  }

  onOpenChange(open: boolean) {
    if (!open) {
      this.resetForm();
    }
    this.openChange.emit(open);
  }

  getTabClass(tabId: string): string {
    return this.activeTab === tabId
      ? 'border-blue-500 text-blue-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  }

  getBMI(): string {
    const weight = parseFloat(this.patientForm.get('weight')?.value || '0');
    const height = parseFloat(this.patientForm.get('height')?.value || '0');
    
    if (weight > 0 && height > 0) {
      const bmi = weight / (height * height);
      return bmi.toFixed(1);
    }
    
    return '';
  }

  addAllergy() {
    if (this.newAllergy.trim()) {
      this.allergies.push(this.newAllergy.trim());
      this.newAllergy = '';
    }
  }

  removeAllergy(index: number) {
    this.allergies.splice(index, 1);
  }

  addCondition() {
    if (this.newCondition.trim()) {
      this.chronicConditions.push(this.newCondition.trim());
      this.newCondition = '';
    }
  }

  removeCondition(index: number) {
    this.chronicConditions.splice(index, 1);
  }

  addMedication() {
    if (this.newMedication.trim()) {
      this.currentMedications.push(this.newMedication.trim());
      this.newMedication = '';
    }
  }

  removeMedication(index: number) {
    this.currentMedications.splice(index, 1);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.patientForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit() {
    if (this.patientForm.valid && this.patient) {
      this.isSubmitting = true;
      
      const formValue = this.patientForm.value;
      const updatedPatient: PatientData = {
        ...this.patient,
        ...formValue,
        fullName: `${formValue.firstName} ${formValue.firstLastName}`.trim(),
        bmi: this.getBMI(),
        allergies: this.allergies,
        chronicConditions: this.chronicConditions,
        currentMedications: this.currentMedications,
        emergencyContact: {
          name: formValue.emergencyName,
          relationship: formValue.emergencyRelationship,
          phone: formValue.emergencyPhone
        }
      };

      setTimeout(() => {
        this.patientUpdated.emit(updatedPatient);
        this.isSubmitting = false;
        this.resetForm();
        this.openChange.emit(false);
      }, 1000);
    } else {
      Object.keys(this.patientForm.controls).forEach(key => {
        this.patientForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.resetForm();
    this.openChange.emit(false);
  }

  resetForm() {
    this.patientForm.reset({
      idType: 'CC',
      country: 'Costa Rica'
    });
    this.activeTab = 'personal';
    this.allergies = [];
    this.chronicConditions = [];
    this.currentMedications = [];
    this.newAllergy = '';
    this.newCondition = '';
    this.newMedication = '';
    this.isSubmitting = false;
  }
}