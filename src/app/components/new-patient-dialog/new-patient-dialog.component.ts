import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, User, Phone, Mail, MapPin, Heart, Shield, AlertTriangle, Users, Calendar, X, Plus, Save, FileText, Activity, Pill, Stethoscope } from 'lucide-angular';

import { DialogComponent, DialogHeaderComponent, DialogTitleComponent, DialogContentComponent, DialogFooterComponent } from '../ui/dialog/dialog.component';
import { ButtonComponent } from '../ui/button/button.component';
import { InputComponent } from '../ui/input/input.component';
import { LabelComponent } from '../ui/label/label.component';
import { TextareaComponent } from '../ui/textarea/textarea.component';
import { SelectComponent, SelectOption } from '../ui/select/select.component';
import { PatientData } from '../../interfaces/patient.interface';

@Component({
  selector: 'app-new-patient-dialog',
  standalone: true,
  styleUrls: ['./new-patient-dialog.component.css'],
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
    <app-dialog [open]="open" (openChange)="onOpenChange($event)" contentClass="max-w-5xl">
      <app-dialog-header>
        <app-dialog-title>
          <div class="flex items-center gap-2">
            <lucide-icon [img]="userIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
            Registrar nuevo paciente
          </div>
        </app-dialog-title>
        <p class="text-sm text-gray-600 mt-2">
          Complete la información del paciente. Los campos marcados con * son obligatorios.
        </p>
      </app-dialog-header>
      
      <app-dialog-content>
        <!-- Tabs Navigation -->
        <div class="border-b border-gray-200 mb-6">
          <nav class="flex space-x-8">
            <button
              *ngFor="let tab of tabs"
              (click)="currentTab = tab.id"
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
          <div *ngIf="currentTab === 'personal'" class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Información personal</h3>
              
              <!-- Identificación -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <app-label>Tipo de documento *</app-label>
                  <app-select
                    [options]="idTypeOptions"
                    formControlName="idType"
                    [hasError]="isFieldInvalid('idType')"
                  ></app-select>
                </div>
                <div class="md:col-span-2">
                  <app-label>Número de documento *</app-label>
                  <app-input
                    placeholder="Ej: 1234567890"
                    formControlName="idNumber"
                    [hasError]="isFieldInvalid('idNumber')"
                  ></app-input>
                </div>
              </div>

              <!-- Nombres -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <app-label>Primer nombre *</app-label>
                  <app-input
                    placeholder="Ej: María"
                    formControlName="firstName"
                    [hasError]="isFieldInvalid('firstName')"
                  ></app-input>
                </div>
                <div>
                  <app-label>Segundo nombre</app-label>
                  <app-input
                    placeholder="Ej: Elena"
                    formControlName="secondName"
                  ></app-input>
                </div>
              </div>

              <!-- Apellidos -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <app-label>Primer apellido *</app-label>
                  <app-input
                    placeholder="Ej: González"
                    formControlName="firstLastName"
                    [hasError]="isFieldInvalid('firstLastName')"
                  ></app-input>
                </div>
                <div>
                  <app-label>Segundo apellido</app-label>
                  <app-input
                    placeholder="Ej: Rodríguez"
                    formControlName="secondLastName"
                  ></app-input>
                </div>
              </div>

              <!-- Fecha, género, sangre -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <app-label>Fecha de nacimiento *</app-label>
                  <app-input
                    type="date"
                    formControlName="birthDate"
                    [hasError]="isFieldInvalid('birthDate')"
                  ></app-input>
                  <div *ngIf="getAge() > 0" class="text-xs text-gray-500 mt-1">
                    Edad: {{ getAge() }} años
                  </div>
                </div>
                <div>
                  <app-label>Género *</app-label>
                  <app-select
                    [options]="genderOptions"
                    placeholder="Seleccione"
                    formControlName="gender"
                    [hasError]="isFieldInvalid('gender')"
                  ></app-select>
                </div>
                <div>
                  <app-label>Tipo de sangre</app-label>
                  <app-select
                    [options]="bloodTypeOptions"
                    placeholder="Seleccione"
                    formControlName="bloodType"
                  ></app-select>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Contact -->
          <div *ngIf="currentTab === 'contact'" class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Información de contacto</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <app-label>Teléfono *</app-label>
                  <app-input
                    placeholder="Ej: +506 8888-9999"
                    formControlName="phone"
                    [hasError]="isFieldInvalid('phone')"
                  ></app-input>
                </div>
                <div>
                  <app-label>Correo electrónico</app-label>
                  <app-input
                    type="email"
                    placeholder="Ej: paciente@email.com"
                    formControlName="email"
                    [hasError]="isFieldInvalid('email')"
                  ></app-input>
                </div>
              </div>

              <div class="mb-4">
                <app-label>Dirección de residencia</app-label>
                <app-input
                  placeholder="Ej: Calle 45 #23-67, Apto 301"
                  formControlName="address"
                ></app-input>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <app-label>Ciudad</app-label>
                  <app-input
                    placeholder="Ej: San José"
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
          </div>

          <!-- Tab: Medical -->
          <div *ngIf="currentTab === 'medical'" class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Información médica</h3>
              
              <!-- Peso y altura -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <app-label>Peso (kg)</app-label>
                  <app-input
                    type="number"
                    step="0.1"
                    placeholder="Ej: 70.5"
                    formControlName="weight"
                  ></app-input>
                </div>
                <div>
                  <app-label>Altura (m)</app-label>
                  <app-input
                    type="number"
                    step="0.01"
                    placeholder="Ej: 1.75"
                    formControlName="height"
                  ></app-input>
                </div>
                <div>
                  <app-label>IMC</app-label>
                  <div class="h-9 flex items-center px-3 border rounded-md bg-gray-50">
                    <span class="text-sm">{{ getBMI() || '---' }}</span>
                  </div>
                </div>
              </div>

              <!-- Alergias -->
              <div class="mb-6">
                <app-label>Alergias conocidas</app-label>
                <div class="flex gap-2 mb-2">
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
                <div *ngIf="allergies.length > 0" class="flex flex-wrap gap-2">
                  <span
                    *ngFor="let allergy of allergies; let i = index"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                  >
                    {{ allergy }}
                    <button
                      type="button"
                      (click)="removeAllergy(i)"
                      class="ml-1 hover:bg-red-200 rounded-full p-0.5"
                    >
                      <lucide-icon [img]="xIcon" class="w-3 h-3"></lucide-icon>
                    </button>
                  </span>
                </div>
              </div>

              <!-- Notas clínicas -->
              <div>
                <app-label>Notas clínicas adicionales</app-label>
                <app-textarea
                  placeholder="Información médica relevante, antecedentes familiares, observaciones..."
                  [rows]="4"
                  formControlName="clinicalNotes"
                ></app-textarea>
              </div>
            </div>
          </div>

          <!-- Tab: Emergency -->
          <div *ngIf="currentTab === 'emergency'" class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Contacto de emergencia</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </form>
      </app-dialog-content>

      <app-dialog-footer>
        <div class="flex justify-between w-full">
          <app-button
            *ngIf="currentTab !== 'personal'"
            variant="outline"
            type="button"
            (click)="previousTab()"
          >
            Anterior
          </app-button>
          <div class="flex gap-2 ml-auto">
            <app-button variant="outline" type="button" (click)="onCancel()">
              Cancelar
            </app-button>
            <app-button
              *ngIf="currentTab !== 'emergency'"
              type="button"
              (click)="nextTab()"
            >
              Siguiente
            </app-button>
            <app-button
              *ngIf="currentTab === 'emergency'"
              type="button"
              (click)="onSubmit()"
              [disabled]="isSubmitting"
            >
              <lucide-icon [img]="saveIcon" class="w-4 h-4 mr-2"></lucide-icon>
              {{ isSubmitting ? 'Guardando...' : 'Registrar Paciente' }}
            </app-button>
          </div>
        </div>
      </app-dialog-footer>
    </app-dialog>
  `
})
export class NewPatientDialogComponent implements OnInit {
  @Input() set open(value: boolean) {
    console.log('NewPatientDialogComponent - open property changed to:', value);
    console.log('NewPatientDialogComponent - previous value was:', this._open);
    this._open = value;
    console.log('NewPatientDialogComponent - new internal value:', this._open);
  }
  get open(): boolean {
    return this._open;
  }
  public _open = false;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() patientCreated = new EventEmitter<PatientData>();

  patientForm: FormGroup;
  currentTab = 'personal';
  isSubmitting = false;

  // Form arrays for dynamic fields
  allergies: string[] = [];
  newAllergy = '';

  // Icons
  userIcon = User;
  phoneIcon = Phone;
  mailIcon = Mail;
  mapPinIcon = MapPin;
  heartIcon = Heart;
  shieldIcon = Shield;
  alertTriangleIcon = AlertTriangle;
  usersIcon = Users;
  calendarIcon = Calendar;
  xIcon = X;
  plusIcon = Plus;
  saveIcon = Save;
  fileTextIcon = FileText;
  activityIcon = Activity;
  pillIcon = Pill;
  stethoscopeIcon = Stethoscope;

  tabs = [
    { id: 'personal', label: 'Personal', icon: this.userIcon },
    { id: 'contact', label: 'Contacto', icon: this.phoneIcon },
    { id: 'medical', label: 'Médica', icon: this.activityIcon },
    { id: 'emergency', label: 'Emergencia', icon: this.alertTriangleIcon }
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
      idType: ['CC', Validators.required],
      idNumber: ['', Validators.required],
      firstName: ['', Validators.required],
      secondName: [''],
      firstLastName: ['', Validators.required],
      secondLastName: [''],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      bloodType: [''],
      occupation: [''],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      address: [''],
      city: [''],
      country: ['Costa Rica'],
      weight: [''],
      height: [''],
      clinicalNotes: [''],
      emergencyName: [''],
      emergencyRelationship: [''],
      emergencyPhone: ['']
    });
  }

  ngOnInit() { }

  onOpenChange(open: boolean) {
    console.log('NewPatientDialogComponent - onOpenChange called with:', open);
    if (!open) {
      this.resetForm();
    }
    this.openChange.emit(open);
  }

  getTabClass(tabId: string): string {
    return this.currentTab === tabId
      ? 'border-blue-500 text-blue-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  }

  nextTab() {
    const tabOrder = ['personal', 'contact', 'medical', 'emergency'];
    const currentIndex = tabOrder.indexOf(this.currentTab);
    if (currentIndex < tabOrder.length - 1) {
      this.currentTab = tabOrder[currentIndex + 1];
    }
  }

  previousTab() {
    const tabOrder = ['personal', 'contact', 'medical', 'emergency'];
    const currentIndex = tabOrder.indexOf(this.currentTab);
    if (currentIndex > 0) {
      this.currentTab = tabOrder[currentIndex - 1];
    }
  }

  getAge(): number {
    const birthDate = this.patientForm.get('birthDate')?.value;
    if (!birthDate) return 0;

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.patientForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.isSubmitting = true;

      const formValue = this.patientForm.value;
      const newPatient: PatientData = {
        id: `PAT-${Date.now()}`,
        ...formValue,
        fullName: `${formValue.firstName} ${formValue.secondName || ''} ${formValue.firstLastName} ${formValue.secondLastName || ''}`.replace(/\s+/g, ' ').trim(),
        age: this.getAge(),
        bmi: this.getBMI(),
        allergies: this.allergies,
        chronicConditions: [],
        currentMedications: [],
        emergencyContact: {
          name: formValue.emergencyName || '',
          relationship: formValue.emergencyRelationship || '',
          phone: formValue.emergencyPhone || ''
        },
        registrationDate: new Date().toLocaleDateString('es-ES'),
        status: 'active' as 'active' | 'inactive'
      };

      setTimeout(() => {
        this.patientCreated.emit(newPatient);
        this.isSubmitting = false;
        this.resetForm();
        this.openChange.emit(false);
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
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
    this.currentTab = 'personal';
    this.allergies = [];
    this.newAllergy = '';
    this.isSubmitting = false;
  }
}