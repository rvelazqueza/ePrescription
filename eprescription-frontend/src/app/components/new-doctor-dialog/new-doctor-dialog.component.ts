import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, User, Phone, Mail, MapPin, GraduationCap, Shield, Clock, Settings, X, Plus, Save, Stethoscope, Award, Calendar, FileText, Building2 } from 'lucide-angular';

import { DialogComponent, DialogHeaderComponent, DialogTitleComponent, DialogContentComponent, DialogFooterComponent } from '../ui/dialog/dialog.component';
import { ButtonComponent } from '../ui/button/button.component';
import { InputComponent } from '../ui/input/input.component';
import { LabelComponent } from '../ui/label/label.component';
import { TextareaComponent } from '../ui/textarea/textarea.component';
import { SelectComponent, SelectOption } from '../ui/select/select.component';

export interface DoctorData {
  id?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  idType: string;
  idNumber: string;
  birthDate?: string;
  gender?: string;
  email: string;
  phone: string;
  officePhone?: string;
  address?: string;
  city?: string;
  country: string;
  specialty: string;
  subspecialties: string[];
  university?: string;
  graduationYear?: string;
  yearsOfExperience?: number;
  licenseNumber: string;
  licenseExpiry?: string;
  certifications: string[];
  schedule: Array<{days: string; hours: string}>;
  status: 'active' | 'inactive';
  certificationStatus: 'verified' | 'expired';
  isOnDuty: boolean;
  notes?: string;
  totalPrescriptions?: number;
  totalPatients?: number;
  monthlyPrescriptions?: number;
  lastActivity?: string;
  registrationDate?: string;
}

@Component({
  selector: 'app-new-doctor-dialog',
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
    <app-dialog [open]="open" (openChange)="onOpenChange($event)" contentClass="max-w-5xl">
      <app-dialog-header>
        <app-dialog-title>
          <div class="flex items-center gap-2">
            <lucide-icon [img]="stethoscopeIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
            Registrar nuevo médico
          </div>
        </app-dialog-title>
        <p class="text-sm text-gray-600 mt-2">
          Ingresa la información completa del nuevo médico. Los campos marcados con * son obligatorios.
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
              <lucide-icon [img]="tab.icon" class="w-3 h-3"></lucide-icon>
              <span class="hidden sm:inline">{{ tab.label }}</span>
            </button>
          </nav>
        </div>

        <form [formGroup]="doctorForm" (ngSubmit)="onSubmit()">
          <!-- Tab: Personal -->
          <div *ngIf="currentTab === 'personal'" class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Información personal</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <app-label>Nombres *</app-label>
                  <app-input
                    placeholder="Ej: Carlos Andrés"
                    formControlName="firstName"
                    [hasError]="isFieldInvalid('firstName')"
                  ></app-input>
                </div>
                <div>
                  <app-label>Apellidos *</app-label>
                  <app-input
                    placeholder="Ej: Martínez López"
                    formControlName="lastName"
                    [hasError]="isFieldInvalid('lastName')"
                  ></app-input>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <app-label>Tipo de documento</app-label>
                  <app-select
                    [options]="idTypeOptions"
                    formControlName="idType"
                  ></app-select>
                </div>
                <div>
                  <app-label>Número de documento</app-label>
                  <app-input
                    placeholder="Ej: 1234567890"
                    formControlName="idNumber"
                  ></app-input>
                </div>
                <div>
                  <app-label>Género</app-label>
                  <app-select
                    [options]="genderOptions"
                    placeholder="Seleccione"
                    formControlName="gender"
                  ></app-select>
                </div>
              </div>

              <div>
                <app-label>Fecha de nacimiento</app-label>
                <app-input
                  type="date"
                  formControlName="birthDate"
                ></app-input>
              </div>
            </div>
          </div>

          <!-- Tab: Contact -->
          <div *ngIf="currentTab === 'contact'" class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Información de contacto</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <app-label>Correo electrónico *</app-label>
                  <app-input
                    type="email"
                    placeholder="Ej: doctor@hospital.com"
                    formControlName="email"
                    [hasError]="isFieldInvalid('email')"
                  ></app-input>
                </div>
                <div>
                  <app-label>Teléfono personal *</app-label>
                  <app-input
                    placeholder="Ej: +506 8888-9999"
                    formControlName="phone"
                    [hasError]="isFieldInvalid('phone')"
                  ></app-input>
                </div>
              </div>

              <div class="mb-4">
                <app-label>Teléfono consultorio</app-label>
                <app-input
                  placeholder="Ej: +506 2222-3333"
                  formControlName="officePhone"
                ></app-input>
              </div>

              <div class="mb-4">
                <app-label>Dirección del consultorio</app-label>
                <app-input
                  placeholder="Ej: Cra 15 #85-23, Consultorio 402"
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

          <!-- Tab: Academic -->
          <div *ngIf="currentTab === 'academic'" class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Formación académica</h3>
              
              <div class="mb-4">
                <app-label>Especialidad principal *</app-label>
                <app-select
                  [options]="specialtyOptions"
                  placeholder="Seleccione la especialidad"
                  formControlName="specialty"
                  [hasError]="isFieldInvalid('specialty')"
                ></app-select>
              </div>

              <!-- Subespecialidades -->
              <div class="mb-4">
                <app-label>Subespecialidades</app-label>
                <div class="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Ej: Electrofisiología"
                    [(ngModel)]="newSubspecialty"
                    [ngModelOptions]="{standalone: true}"
                    (keyup.enter)="addSubspecialty()"
                    class="flex h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <app-button type="button" size="sm" (click)="addSubspecialty()">
                    <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
                  </app-button>
                </div>
                <div *ngIf="subspecialties.length > 0" class="flex flex-wrap gap-2">
                  <span
                    *ngFor="let sub of subspecialties; let i = index"
                    class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-300"
                  >
                    {{ sub }}
                    <button
                      type="button"
                      (click)="removeSubspecialty(i)"
                      class="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <lucide-icon [img]="xIcon" class="w-3 h-3"></lucide-icon>
                    </button>
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <app-label>Universidad</app-label>
                  <app-input
                    placeholder="Ej: Universidad de Costa Rica"
                    formControlName="university"
                  ></app-input>
                </div>
                <div>
                  <app-label>Año de graduación</app-label>
                  <app-input
                    type="number"
                    placeholder="Ej: 2008"
                    formControlName="graduationYear"
                  ></app-input>
                </div>
              </div>

              <div>
                <app-label>Años de experiencia</app-label>
                <app-input
                  type="number"
                  placeholder="Ej: 15"
                  formControlName="yearsOfExperience"
                ></app-input>
              </div>
            </div>
          </div>

          <!-- Tab: License -->
          <div *ngIf="currentTab === 'license'" class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Licencias y certificaciones</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <app-label>Número de licencia médica *</app-label>
                  <app-input
                    placeholder="Ej: MSP-2015-045678"
                    formControlName="licenseNumber"
                    [hasError]="isFieldInvalid('licenseNumber')"
                  ></app-input>
                </div>
                <div>
                  <app-label>Fecha de vencimiento</app-label>
                  <app-input
                    type="date"
                    formControlName="licenseExpiry"
                  ></app-input>
                </div>
              </div>

              <!-- Certificaciones -->
              <div>
                <app-label>Certificaciones adicionales</app-label>
                <div class="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Ej: Certificación en Electrofisiología Cardíaca - ACC 2018"
                    [(ngModel)]="newCertification"
                    [ngModelOptions]="{standalone: true}"
                    (keyup.enter)="addCertification()"
                    class="flex h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <app-button type="button" size="sm" (click)="addCertification()">
                    <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
                  </app-button>
                </div>
                <div *ngIf="certifications.length > 0" class="space-y-2">
                  <div 
                    *ngFor="let cert of certifications; let i = index"
                    class="flex items-center gap-2 p-2 bg-blue-50 rounded-md border border-blue-200"
                  >
                    <lucide-icon [img]="awardIcon" class="w-4 h-4 text-blue-600 flex-shrink-0"></lucide-icon>
                    <span class="text-sm flex-1">{{ cert }}</span>
                    <button
                      type="button"
                      (click)="removeCertification(i)"
                      class="hover:bg-blue-200 rounded-full p-1"
                    >
                      <lucide-icon [img]="xIcon" class="w-4 h-4 text-blue-800"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Schedule -->
          <div *ngIf="currentTab === 'schedule'" class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Horarios de atención</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <app-label>Días</app-label>
                  <input
                    type="text"
                    placeholder="Ej: Lunes - Viernes"
                    [(ngModel)]="newScheduleDays"
                    [ngModelOptions]="{standalone: true}"
                    class="flex h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <app-label>Horario</app-label>
                  <div class="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ej: 08:00 - 14:00"
                      [(ngModel)]="newScheduleHours"
                      [ngModelOptions]="{standalone: true}"
                      class="flex h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <app-button type="button" size="sm" (click)="addSchedule()">
                      <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
                    </app-button>
                  </div>
                </div>
              </div>

              <div *ngIf="schedules.length > 0">
                <app-label>Horarios configurados</app-label>
                <div class="space-y-2 mt-2">
                  <div 
                    *ngFor="let schedule of schedules; let i = index"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-md border"
                  >
                    <div class="flex items-center gap-3">
                      <lucide-icon [img]="clockIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                      <div>
                        <p class="text-sm">{{ schedule.days }}</p>
                        <p class="text-xs text-gray-500">{{ schedule.hours }}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      (click)="removeSchedule(i)"
                      class="hover:bg-gray-200 rounded-full p-1"
                    >
                      <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Config -->
          <div *ngIf="currentTab === 'config'" class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Configuración</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <app-label>Estado</app-label>
                  <app-select
                    [options]="statusOptions"
                    formControlName="status"
                  ></app-select>
                </div>
                <div>
                  <app-label>Estado de certificación</app-label>
                  <app-select
                    [options]="certificationStatusOptions"
                    formControlName="certificationStatus"
                  ></app-select>
                </div>
              </div>

              <div class="mb-4">
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    [(ngModel)]="isOnDuty"
                    [ngModelOptions]="{standalone: true}"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm font-medium text-gray-700">Médico de guardia</span>
                </label>
              </div>

              <div>
                <app-label>Notas adicionales</app-label>
                <app-textarea
                  placeholder="Información adicional sobre el médico..."
                  [rows]="4"
                  formControlName="notes"
                ></app-textarea>
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
              *ngIf="currentTab !== 'config'"
              type="button"
              (click)="nextTab()"
            >
              Siguiente
            </app-button>
            <app-button
              *ngIf="currentTab === 'config'"
              type="button"
              (click)="onSubmit()"
              [disabled]="isSubmitting"
            >
              <lucide-icon [img]="saveIcon" class="w-4 h-4 mr-2"></lucide-icon>
              {{ isSubmitting ? 'Guardando...' : 'Registrar Médico' }}
            </app-button>
          </div>
        </div>
      </app-dialog-footer>
    </app-dialog>
  `
})
export class NewDoctorDialogComponent implements OnInit {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() doctorCreated = new EventEmitter<DoctorData>();

  doctorForm: FormGroup;
  currentTab = 'personal';
  isSubmitting = false;

  // Dynamic arrays
  subspecialties: string[] = [];
  certifications: string[] = [];
  schedules: Array<{days: string; hours: string}> = [];
  
  // Form inputs
  newSubspecialty = '';
  newCertification = '';
  newScheduleDays = '';
  newScheduleHours = '';
  isOnDuty = false;

  // Icons
  userIcon = User;
  phoneIcon = Phone;
  mailIcon = Mail;
  mapPinIcon = MapPin;
  graduationCapIcon = GraduationCap;
  shieldIcon = Shield;
  clockIcon = Clock;
  settingsIcon = Settings;
  xIcon = X;
  plusIcon = Plus;
  saveIcon = Save;
  stethoscopeIcon = Stethoscope;
  awardIcon = Award;
  calendarIcon = Calendar;
  fileTextIcon = FileText;
  building2Icon = Building2;

  tabs = [
    { id: 'personal', label: 'Personal', icon: this.userIcon },
    { id: 'contact', label: 'Contacto', icon: this.phoneIcon },
    { id: 'academic', label: 'Formación', icon: this.graduationCapIcon },
    { id: 'license', label: 'Licencias', icon: this.shieldIcon },
    { id: 'schedule', label: 'Horarios', icon: this.clockIcon },
    { id: 'config', label: 'Config.', icon: this.settingsIcon }
  ];

  idTypeOptions: SelectOption[] = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'PA', label: 'Pasaporte' }
  ];

  genderOptions: SelectOption[] = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' }
  ];

  countryOptions: SelectOption[] = [
    { value: 'Costa Rica', label: 'Costa Rica' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Chile', label: 'Chile' },
    { value: 'México', label: 'México' },
    { value: 'España', label: 'España' }
  ];

  specialtyOptions: SelectOption[] = [
    { value: 'Cardiología', label: 'Cardiología' },
    { value: 'Pediatría', label: 'Pediatría' },
    { value: 'Medicina Interna', label: 'Medicina Interna' },
    { value: 'Ginecología y Obstetricia', label: 'Ginecología y Obstetricia' },
    { value: 'Ortopedia y Traumatología', label: 'Ortopedia y Traumatología' },
    { value: 'Neurología', label: 'Neurología' },
    { value: 'Psiquiatría', label: 'Psiquiatría' },
    { value: 'Dermatología', label: 'Dermatología' },
    { value: 'Anestesiología', label: 'Anestesiología' },
    { value: 'Radiología', label: 'Radiología' },
    { value: 'Cirugía General', label: 'Cirugía General' },
    { value: 'Medicina General', label: 'Medicina General' }
  ];

  statusOptions: SelectOption[] = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' }
  ];

  certificationStatusOptions: SelectOption[] = [
    { value: 'verified', label: 'Verificado' },
    { value: 'expired', label: 'Vencido' }
  ];

  constructor(private fb: FormBuilder) {
    this.doctorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      idType: ['CC'],
      idNumber: [''],
      birthDate: [''],
      gender: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      officePhone: [''],
      address: [''],
      city: [''],
      country: ['Costa Rica'],
      specialty: ['', Validators.required],
      university: [''],
      graduationYear: [''],
      yearsOfExperience: [''],
      licenseNumber: ['', Validators.required],
      licenseExpiry: [''],
      status: ['active'],
      certificationStatus: ['verified'],
      notes: ['']
    });
  }

  ngOnInit() {}

  onOpenChange(open: boolean) {
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
    const tabOrder = ['personal', 'contact', 'academic', 'license', 'schedule', 'config'];
    const currentIndex = tabOrder.indexOf(this.currentTab);
    if (currentIndex < tabOrder.length - 1) {
      this.currentTab = tabOrder[currentIndex + 1];
    }
  }

  previousTab() {
    const tabOrder = ['personal', 'contact', 'academic', 'license', 'schedule', 'config'];
    const currentIndex = tabOrder.indexOf(this.currentTab);
    if (currentIndex > 0) {
      this.currentTab = tabOrder[currentIndex - 1];
    }
  }

  addSubspecialty() {
    if (this.newSubspecialty.trim()) {
      this.subspecialties.push(this.newSubspecialty.trim());
      this.newSubspecialty = '';
    }
  }

  removeSubspecialty(index: number) {
    this.subspecialties.splice(index, 1);
  }

  addCertification() {
    if (this.newCertification.trim()) {
      this.certifications.push(this.newCertification.trim());
      this.newCertification = '';
    }
  }

  removeCertification(index: number) {
    this.certifications.splice(index, 1);
  }

  addSchedule() {
    if (this.newScheduleDays.trim() && this.newScheduleHours.trim()) {
      this.schedules.push({ 
        days: this.newScheduleDays.trim(), 
        hours: this.newScheduleHours.trim() 
      });
      this.newScheduleDays = '';
      this.newScheduleHours = '';
    }
  }

  removeSchedule(index: number) {
    this.schedules.splice(index, 1);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.doctorForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit() {
    if (this.doctorForm.valid) {
      this.isSubmitting = true;
      
      const formValue = this.doctorForm.value;
      const newDoctor: DoctorData = {
        id: `MD${Date.now()}`,
        ...formValue,
        fullName: `Dr. ${formValue.firstName} ${formValue.lastName}`,
        subspecialties: this.subspecialties,
        certifications: this.certifications,
        schedule: this.schedules,
        isOnDuty: this.isOnDuty,
        yearsOfExperience: parseInt(formValue.yearsOfExperience) || 0,
        totalPrescriptions: 0,
        totalPatients: 0,
        monthlyPrescriptions: 0,
        lastActivity: new Date().toLocaleDateString('es-ES'),
        registrationDate: new Date().toLocaleDateString('es-ES')
      };

      setTimeout(() => {
        this.doctorCreated.emit(newDoctor);
        this.isSubmitting = false;
        this.resetForm();
        this.openChange.emit(false);
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.doctorForm.controls).forEach(key => {
        this.doctorForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.resetForm();
    this.openChange.emit(false);
  }

  resetForm() {
    this.doctorForm.reset({
      idType: 'CC',
      country: 'Costa Rica',
      status: 'active',
      certificationStatus: 'verified'
    });
    this.currentTab = 'personal';
    this.subspecialties = [];
    this.certifications = [];
    this.schedules = [];
    this.newSubspecialty = '';
    this.newCertification = '';
    this.newScheduleDays = '';
    this.newScheduleHours = '';
    this.isOnDuty = false;
    this.isSubmitting = false;
  }
}