import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Phone, Mail, MessageSquare, MapPin, Copy, User, Calendar, Clock, AlertTriangle, CheckCircle2, PhoneCall, Send, History, UserCircle, Home, Building2, Globe, Shield } from 'lucide-angular';

import { DialogComponent, DialogHeaderComponent, DialogTitleComponent, DialogContentComponent, DialogFooterComponent } from '../ui/dialog/dialog.component';
import { ButtonComponent } from '../ui/button/button.component';
import { InputComponent } from '../ui/input/input.component';
import { LabelComponent } from '../ui/label/label.component';
import { TextareaComponent } from '../ui/textarea/textarea.component';
import { SelectComponent, SelectOption } from '../ui/select/select.component';

export interface PatientContactInfo {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

interface ContactRecord {
  id: string;
  date: string;
  time: string;
  type: "call" | "email" | "sms" | "in-person";
  reason: string;
  notes: string;
  status: "completed" | "pending" | "failed";
  createdBy: string;
}

@Component({
  selector: 'app-contact-patient-dialog',
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
            <lucide-icon [img]="phoneIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
            Gestión de Contacto del Paciente
          </div>
        </app-dialog-title>
        <p class="text-sm text-gray-600 mt-2">
          Información de contacto, comunicaciones y registro de interacciones
        </p>
      </app-dialog-header>
      
      <app-dialog-content>
        <!-- Header del paciente -->
        <div class="border-l-4 border-l-blue-600 bg-blue-50 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-100 rounded-lg">
              <lucide-icon [img]="userIcon" class="w-6 h-6 text-blue-600"></lucide-icon>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ patient?.fullName }}</h3>
              <p class="text-sm text-gray-600">ID: {{ patient?.id }}</p>
            </div>
          </div>
        </div>

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
              <span *ngIf="tab.id === 'history'" class="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {{ contactHistory.length }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Tab: Información de Contacto -->
        <div *ngIf="activeTab === 'info'" class="space-y-6">
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <lucide-icon [img]="phoneIcon" class="w-5 h-5"></lucide-icon>
              Datos de Contacto Principal
            </h3>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <app-label class="text-sm text-gray-600 flex items-center gap-2">
                  <lucide-icon [img]="phoneIcon" class="w-4 h-4"></lucide-icon>
                  Teléfono
                </app-label>
                <div class="flex gap-2 mt-1">
                  <input
                    type="text"
                    [value]="patient?.phone"
                    readonly
                    class="flex h-9 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-1 text-sm"
                  />
                  <app-button variant="outline" size="sm" (click)="copyPhone()">
                    <lucide-icon [img]="copyIcon" class="w-4 h-4"></lucide-icon>
                  </app-button>
                </div>
              </div>

              <div>
                <app-label class="text-sm text-gray-600 flex items-center gap-2">
                  <lucide-icon [img]="mailIcon" class="w-4 h-4"></lucide-icon>
                  Email
                </app-label>
                <div class="flex gap-2 mt-1">
                  <input
                    type="text"
                    [value]="patient?.email"
                    readonly
                    class="flex h-9 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-1 text-sm"
                  />
                  <app-button variant="outline" size="sm" (click)="copyEmail()">
                    <lucide-icon [img]="copyIcon" class="w-4 h-4"></lucide-icon>
                  </app-button>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4">
              <app-label class="text-sm text-gray-600 flex items-center gap-2">
                <lucide-icon [img]="mapPinIcon" class="w-4 h-4"></lucide-icon>
                Dirección Completa
              </app-label>
              <div class="mt-2 space-y-2">
                <div class="flex gap-2">
                  <input
                    type="text"
                    [value]="patient?.address"
                    readonly
                    class="flex h-9 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-1 text-sm"
                  />
                  <app-button variant="outline" size="sm" (click)="copyAddress()">
                    <lucide-icon [img]="copyIcon" class="w-4 h-4"></lucide-icon>
                  </app-button>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="building2Icon" class="w-4 h-4 text-gray-500"></lucide-icon>
                    <span class="text-sm text-gray-700">{{ patient?.city }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="globeIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                    <span class="text-sm text-gray-700">{{ patient?.country }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contacto de emergencia -->
          <div class="border-l-4 border-l-red-500 bg-red-50 rounded-lg p-6">
            <h3 class="text-lg font-medium text-red-900 mb-4 flex items-center gap-2">
              <lucide-icon [img]="shieldIcon" class="w-5 h-5"></lucide-icon>
              Contacto de Emergencia
            </h3>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-red-900">{{ patient?.emergencyContact?.name }}</p>
                  <p class="text-sm text-red-700">{{ patient?.emergencyContact?.relationship }}</p>
                </div>
                <span class="bg-red-100 text-red-800 border border-red-300 px-2 py-1 text-xs rounded-full">
                  Contacto de emergencia
                </span>
              </div>
              
              <div class="border-t border-red-200 pt-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="phoneIcon" class="w-4 h-4 text-red-700"></lucide-icon>
                    <span class="text-sm font-medium text-red-900">
                      {{ patient?.emergencyContact?.phone }}
                    </span>
                  </div>
                  <div class="flex gap-2">
                    <app-button variant="outline" size="sm" (click)="copyEmergencyPhone()">
                      <lucide-icon [img]="copyIcon" class="w-4 h-4"></lucide-icon>
                    </app-button>
                    <app-button size="sm" (click)="callEmergency()">
                      <lucide-icon [img]="phoneIcon" class="w-4 h-4 mr-2"></lucide-icon>
                      Llamar
                    </app-button>
                  </div>
                </div>
              </div>
              
              <p class="text-xs text-gray-600 italic">
                ⚠️ Usar solo en caso de emergencia médica o cuando no sea posible contactar al paciente directamente
              </p>
            </div>
          </div>
        </div>

        <!-- Tab: Contacto Rápido -->
        <div *ngIf="activeTab === 'quick'" class="space-y-6">
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Acciones de Contacto Rápido</h3>
            <p class="text-sm text-gray-600 mb-4">Inicie comunicación directa con el paciente</p>
            
            <div class="space-y-3">
              <app-button
                (click)="handleCall()"
                class="w-full justify-start bg-blue-600 hover:bg-blue-700"
              >
                <lucide-icon [img]="phoneIcon" class="w-5 h-5 mr-3"></lucide-icon>
                <div class="text-left">
                  <p class="font-semibold">Llamar al paciente</p>
                  <p class="text-xs opacity-90">{{ patient?.phone }}</p>
                </div>
              </app-button>

              <app-button
                (click)="handleEmail()"
                variant="outline"
                class="w-full justify-start border-purple-300 hover:bg-purple-50"
              >
                <lucide-icon [img]="mailIcon" class="w-5 h-5 mr-3 text-purple-600"></lucide-icon>
                <div class="text-left">
                  <p class="font-semibold">Enviar email</p>
                  <p class="text-xs text-gray-600">{{ patient?.email }}</p>
                </div>
              </app-button>

              <app-button
                (click)="handleSMS()"
                variant="outline"
                class="w-full justify-start border-green-300 hover:bg-green-50"
              >
                <lucide-icon [img]="messageSquareIcon" class="w-5 h-5 mr-3 text-green-600"></lucide-icon>
                <div class="text-left">
                  <p class="font-semibold">Enviar SMS</p>
                  <p class="text-xs text-gray-600">{{ patient?.phone }}</p>
                </div>
              </app-button>

              <app-button
                (click)="openLocation()"
                variant="outline"
                class="w-full justify-start border-orange-300 hover:bg-orange-50"
              >
                <lucide-icon [img]="mapPinIcon" class="w-5 h-5 mr-3 text-orange-600"></lucide-icon>
                <div class="text-left">
                  <p class="font-semibold">Ver ubicación</p>
                  <p class="text-xs text-gray-600">{{ patient?.address }}</p>
                </div>
              </app-button>
            </div>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex gap-3">
              <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></lucide-icon>
              <div class="text-sm text-blue-900">
                <p class="font-semibold mb-1">Recordatorio importante</p>
                <p>
                  Todas las comunicaciones con pacientes deben registrarse en el historial
                  para mantener la trazabilidad y cumplir con normativas de protección de datos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Registrar Contacto -->
        <div *ngIf="activeTab === 'register'" class="space-y-6">
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Registrar Nueva Comunicación</h3>
            <p class="text-sm text-gray-600 mb-4">Complete el formulario para documentar la interacción con el paciente</p>
            
            <form [formGroup]="contactForm" class="space-y-4">
              <div>
                <app-label>Tipo de contacto *</app-label>
                <app-select
                  [options]="contactTypeOptions"
                  formControlName="contactType"
                ></app-select>
              </div>

              <div>
                <app-label>Motivo del contacto *</app-label>
                <app-input
                  placeholder="Ej: Recordatorio de cita, consulta telefónica, seguimiento..."
                  formControlName="contactReason"
                ></app-input>
              </div>

              <div>
                <app-label>Notas y observaciones</app-label>
                <app-textarea
                  placeholder="Describa los detalles de la comunicación, temas tratados, acuerdos realizados..."
                  [rows]="4"
                  formControlName="contactNotes"
                ></app-textarea>
              </div>

              <div class="flex gap-2 pt-4">
                <app-button
                  type="button"
                  (click)="submitContact()"
                  [disabled]="isSubmitting"
                  class="flex-1"
                >
                  <lucide-icon [img]="isSubmitting ? clockIcon : checkCircle2Icon" class="w-4 h-4 mr-2"></lucide-icon>
                  {{ isSubmitting ? 'Guardando...' : 'Registrar Contacto' }}
                </app-button>
                <app-button
                  variant="outline"
                  type="button"
                  (click)="clearContactForm()"
                  [disabled]="isSubmitting"
                >
                  Limpiar
                </app-button>
              </div>
            </form>
          </div>
        </div>

        <!-- Tab: Historial -->
        <div *ngIf="activeTab === 'history'" class="space-y-6">
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <lucide-icon [img]="historyIcon" class="w-5 h-5"></lucide-icon>
              Historial de Comunicaciones
            </h3>
            <p class="text-sm text-gray-600 mb-4">Registro completo de todas las interacciones con el paciente</p>
            
            <div *ngIf="contactHistory.length === 0" class="text-center py-8 text-gray-500">
              <lucide-icon [img]="historyIcon" class="w-12 h-12 mx-auto mb-3 opacity-50"></lucide-icon>
              <p>No hay registros de contacto</p>
            </div>

            <div *ngIf="contactHistory.length > 0" class="space-y-3">
              <div 
                *ngFor="let contact of contactHistory"
                class="border-l-4 border-l-blue-500 bg-white border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-start justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span [class]="getContactTypeClass(contact.type)" class="px-2 py-1 text-xs font-semibold rounded-full flex items-center border">
                      <lucide-icon [img]="getContactTypeIcon(contact.type)" class="w-3 h-3 mr-1"></lucide-icon>
                      {{ getContactTypeLabel(contact.type) }}
                    </span>
                    <lucide-icon [img]="getStatusIcon(contact.status)" class="w-4 h-4"></lucide-icon>
                  </div>
                  <div class="text-xs text-gray-600 text-right">
                    <div class="flex items-center gap-1">
                      <lucide-icon [img]="calendarIcon" class="w-3 h-3"></lucide-icon>
                      {{ contact.date }}
                    </div>
                    <div class="flex items-center gap-1">
                      <lucide-icon [img]="clockIcon" class="w-3 h-3"></lucide-icon>
                      {{ contact.time }}
                    </div>
                  </div>
                </div>
                <h4 class="font-semibold text-gray-900 mb-1">{{ contact.reason }}</h4>
                <p *ngIf="contact.notes" class="text-sm text-gray-700 mb-2">{{ contact.notes }}</p>
                <div class="flex items-center gap-2 text-xs text-gray-600">
                  <lucide-icon [img]="userIcon" class="w-3 h-3"></lucide-icon>
                  <span>Registrado por: {{ contact.createdBy }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </app-dialog-content>

      <app-dialog-footer>
        <div class="flex justify-end gap-2">
          <app-button variant="outline" (click)="onClose()">
            Cerrar
          </app-button>
        </div>
      </app-dialog-footer>
    </app-dialog>
  `
})
export class ContactPatientDialogComponent implements OnInit {
  @Input() open = false;
  @Input() patient: PatientContactInfo | null = null;
  @Output() openChange = new EventEmitter<boolean>();

  contactForm: FormGroup;
  activeTab = 'info';
  isSubmitting = false;

  // Icons
  phoneIcon = Phone;
  mailIcon = Mail;
  messageSquareIcon = MessageSquare;
  mapPinIcon = MapPin;
  copyIcon = Copy;
  userIcon = User;
  calendarIcon = Calendar;
  clockIcon = Clock;
  alertTriangleIcon = AlertTriangle;
  checkCircle2Icon = CheckCircle2;
  phoneCallIcon = PhoneCall;
  sendIcon = Send;
  historyIcon = History;
  userCircleIcon = UserCircle;
  homeIcon = Home;
  building2Icon = Building2;
  globeIcon = Globe;
  shieldIcon = Shield;

  tabs = [
    { id: 'info', label: 'Información', icon: this.phoneIcon },
    { id: 'quick', label: 'Contacto Rápido', icon: this.phoneCallIcon },
    { id: 'register', label: 'Registrar', icon: this.sendIcon },
    { id: 'history', label: 'Historial', icon: this.historyIcon }
  ];

  contactTypeOptions: SelectOption[] = [
    { value: 'call', label: 'Llamada telefónica' },
    { value: 'email', label: 'Correo electrónico' },
    { value: 'sms', label: 'Mensaje SMS' },
    { value: 'in-person', label: 'Presencial' }
  ];

  contactHistory: ContactRecord[] = [
    {
      id: '1',
      date: '27/09/2025',
      time: '10:30 AM',
      type: 'call',
      reason: 'Recordatorio de cita médica',
      notes: 'Paciente confirmó asistencia para control de diabetes el 30/09/2025',
      status: 'completed',
      createdBy: 'Dr. Carlos Mendoza'
    },
    {
      id: '2',
      date: '20/09/2025',
      time: '03:15 PM',
      type: 'email',
      reason: 'Envío de resultados de laboratorio',
      notes: 'Enviados resultados de HbA1c. Paciente notificada.',
      status: 'completed',
      createdBy: 'Dra. Ana Martínez'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      contactType: ['call', Validators.required],
      contactReason: ['', Validators.required],
      contactNotes: ['']
    });
  }

  ngOnInit() {}

  onOpenChange(open: boolean) {
    this.openChange.emit(open);
  }

  onClose() {
    this.openChange.emit(false);
  }

  getTabClass(tabId: string): string {
    return this.activeTab === tabId
      ? 'border-blue-500 text-blue-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  }

  // Contact actions
  copyPhone() {
    if (this.patient?.phone) {
      navigator.clipboard.writeText(this.patient.phone);
      console.log('Teléfono copiado:', this.patient.phone);
    }
  }

  copyEmail() {
    if (this.patient?.email) {
      navigator.clipboard.writeText(this.patient.email);
      console.log('Email copiado:', this.patient.email);
    }
  }

  copyAddress() {
    if (this.patient) {
      const fullAddress = `${this.patient.address}, ${this.patient.city}, ${this.patient.country}`;
      navigator.clipboard.writeText(fullAddress);
      console.log('Dirección copiada:', fullAddress);
    }
  }

  copyEmergencyPhone() {
    if (this.patient?.emergencyContact?.phone) {
      navigator.clipboard.writeText(this.patient.emergencyContact.phone);
      console.log('Teléfono de emergencia copiado');
    }
  }

  handleCall() {
    console.log('Iniciando llamada a:', this.patient?.phone);
  }

  handleEmail() {
    if (this.patient?.email) {
      window.location.href = `mailto:${this.patient.email}`;
    }
  }

  handleSMS() {
    console.log('Preparando SMS para:', this.patient?.phone);
  }

  openLocation() {
    if (this.patient) {
      const fullAddress = `${this.patient.address}, ${this.patient.city}, ${this.patient.country}`;
      window.open(`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`, '_blank');
    }
  }

  callEmergency() {
    console.log('Llamando a contacto de emergencia:', this.patient?.emergencyContact?.phone);
  }

  submitContact() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      
      const newContact: ContactRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('es-ES'),
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        type: this.contactForm.value.contactType,
        reason: this.contactForm.value.contactReason,
        notes: this.contactForm.value.contactNotes,
        status: 'completed',
        createdBy: 'Dr. Usuario Actual'
      };

      setTimeout(() => {
        this.contactHistory.unshift(newContact);
        this.isSubmitting = false;
        this.clearContactForm();
        this.activeTab = 'history';
        console.log('Contacto registrado:', newContact);
      }, 1000);
    }
  }

  clearContactForm() {
    this.contactForm.reset({
      contactType: 'call'
    });
  }

  getContactTypeLabel(type: string): string {
    const labels = {
      'call': 'Llamada',
      'email': 'Email',
      'sms': 'SMS',
      'in-person': 'Presencial'
    };
    return labels[type as keyof typeof labels] || type;
  }

  getContactTypeIcon(type: string): any {
    const icons = {
      'call': this.phoneIcon,
      'email': this.mailIcon,
      'sms': this.messageSquareIcon,
      'in-person': this.userCircleIcon
    };
    return icons[type as keyof typeof icons] || this.phoneIcon;
  }

  getContactTypeClass(type: string): string {
    const classes = {
      'call': 'bg-blue-100 text-blue-800 border-blue-300',
      'email': 'bg-purple-100 text-purple-800 border-purple-300',
      'sms': 'bg-green-100 text-green-800 border-green-300',
      'in-person': 'bg-orange-100 text-orange-800 border-orange-300'
    };
    return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800 border-gray-300';
  }

  getStatusIcon(status: string): any {
    const icons = {
      'completed': this.checkCircle2Icon,
      'pending': this.clockIcon,
      'failed': this.alertTriangleIcon
    };
    return icons[status as keyof typeof icons] || this.clockIcon;
  }
}