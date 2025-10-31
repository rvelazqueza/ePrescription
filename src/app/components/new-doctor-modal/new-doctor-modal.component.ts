import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, UserCheck, Save, X, User, GraduationCap, Award, Clock, Shield, ArrowRight, ArrowLeft, Plus, Mail, Phone, Stethoscope, FileText, MapPin, Calendar, Settings } from 'lucide-angular';

interface FormTab {
  id: string;
  label: string;
  shortLabel: string;
  icon: any;
}

interface Schedule {
  days: string;
  hours: string;
}

@Component({
  selector: 'app-new-doctor-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule],
  templateUrl: './new-doctor-modal.component.html',
  styleUrls: ['./new-doctor-modal.component.css']
})
export class NewDoctorModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() doctorCreated = new EventEmitter<any>();

  // Icons
  userCheckIcon = UserCheck;
  saveIcon = Save;
  xIcon = X;
  userIcon = User;
  graduationCapIcon = GraduationCap;
  awardIcon = Award;
  clockIcon = Clock;
  shieldIcon = Shield;
  arrowRightIcon = ArrowRight;
  arrowLeftIcon = ArrowLeft;
  plusIcon = Plus;
  mailIcon = Mail;
  phoneIcon = Phone;
  stethoscopeIcon = Stethoscope;
  fileTextIcon = FileText;
  mapPinIcon = MapPin;
  calendarIcon = Calendar;
  settingsIcon = Settings;

  // Form and state
  doctorForm!: FormGroup;
  activeTab = 'personal';
  isSubmitting = false;
  currentYear = new Date().getFullYear();

  // Dynamic arrays
  subspecialties: string[] = [];
  certifications: string[] = [];
  schedules: Schedule[] = [];

  // Temporary input values
  newSubspecialty = '';
  newCertification = '';
  newScheduleDays = '';
  newScheduleHours = '';

  // Form tabs configuration
  formTabs: FormTab[] = [
    { id: 'personal', label: 'Información Personal', shortLabel: 'Personal', icon: User },
    { id: 'contacto', label: 'Información de Contacto', shortLabel: 'Contacto', icon: MapPin },
    { id: 'formacion', label: 'Formación Académica', shortLabel: 'Formación', icon: GraduationCap },
    { id: 'licencias', label: 'Licencias y Certificaciones', shortLabel: 'Licencias', icon: Award },
    { id: 'horarios', label: 'Horarios de Atención', shortLabel: 'Horarios', icon: Calendar },
    { id: 'config', label: 'Configuración y Permisos', shortLabel: 'Config', icon: Settings }
  ];

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  private initializeForm() {
    this.doctorForm = this.fb.group({
      // Personal Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      documentType: ['CC', [Validators.required]],
      documentNumber: ['', [Validators.required]],
      birthDate: [''],
      gender: [''],

      // Contact Information
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      officePhone: [''],
      address: [''],
      city: [''],
      country: ['Colombia'],

      // Formation Information
      university: [''],
      graduationYear: ['', [Validators.min(1950), Validators.max(this.currentYear)]],
      specialty: ['', [Validators.required]],

      // License Information
      licenseNumber: ['', [Validators.required]],
      licenseExpiry: [''],
      licenseIssuer: [''],

      // Configuration
      canPrescribe: [true],
      canPrescribeControlled: [false],
      canViewOtherPrescriptions: [false],
      canApproveUsers: [false],
      canManagePatients: [true],
      canAccessReports: [false],
      isActive: [true],
      isOnDuty: [false]
    });
  }

  // Tab navigation methods
  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  goToTab(tabId: string) {
    this.activeTab = tabId;
  }

  getTabClasses(tabId: string): string {
    const baseClasses = 'whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors';

    if (this.activeTab === tabId) {
      return `${baseClasses} border-blue-500 text-blue-600`;
    }

    return `${baseClasses} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`;
  }

  getTabValidationStatus(tabId: string): 'success' | 'error' | 'none' {
    switch (tabId) {
      case 'personal':
        const personalFields = ['firstName', 'lastName', 'documentNumber'];
        const hasPersonalErrors = personalFields.some(field => this.isFieldInvalid(field));
        const hasPersonalValues = personalFields.every(field => this.doctorForm.get(field)?.value);

        if (hasPersonalErrors) return 'error';
        if (hasPersonalValues) return 'success';
        return 'none';

      case 'contacto':
        const contactFields = ['email', 'phone'];
        const hasContactErrors = contactFields.some(field => this.isFieldInvalid(field));
        const hasContactValues = contactFields.every(field => this.doctorForm.get(field)?.value);

        if (hasContactErrors) return 'error';
        if (hasContactValues) return 'success';
        return 'none';

      case 'formacion':
        const formationFields = ['specialty'];
        const hasFormationErrors = formationFields.some(field => this.isFieldInvalid(field));
        const hasFormationValues = formationFields.every(field => this.doctorForm.get(field)?.value);

        if (hasFormationErrors) return 'error';
        if (hasFormationValues) return 'success';
        return 'none';

      case 'licencias':
        const licenseFields = ['licenseNumber'];
        const hasLicenseErrors = licenseFields.some(field => this.isFieldInvalid(field));
        const hasLicenseValues = licenseFields.every(field => this.doctorForm.get(field)?.value);

        if (hasLicenseErrors) return 'error';
        if (hasLicenseValues) return 'success';
        return 'none';

      default:
        return 'none';
    }
  }

  // Form validation methods
  isFieldInvalid(fieldName: string): boolean {
    const field = this.doctorForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.doctorForm.get(fieldName);
    return !!(field && field.valid && (field.dirty || field.touched));
  }



  onSubmit() {
    if (this.doctorForm.valid) {
      this.isSubmitting = true;

      const doctorData = {
        ...this.doctorForm.value,
        subspecialties: this.subspecialties,
        certifications: this.certifications,
        schedules: this.schedules,
        fullName: `Dr. ${this.doctorForm.value.firstName} ${this.doctorForm.value.lastName}`,
        createdAt: new Date().toISOString()
      };

      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.doctorCreated.emit(doctorData);
        this.onClose();
      }, 1500);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched();

      // Find first invalid tab and navigate to it
      const firstInvalidTab = this.findFirstInvalidTab();
      if (firstInvalidTab) {
        this.setActiveTab(firstInvalidTab);
      }
    }
  }

  private findFirstInvalidTab(): string | null {
    const personalFields = ['firstName', 'lastName', 'documentNumber'];
    const contactFields = ['email', 'phone'];
    const formationFields = ['specialty'];
    const licenseFields = ['licenseNumber'];

    if (personalFields.some(field => this.isFieldInvalid(field))) {
      return 'personal';
    }

    if (contactFields.some(field => this.isFieldInvalid(field))) {
      return 'contacto';
    }

    if (formationFields.some(field => this.isFieldInvalid(field))) {
      return 'formacion';
    }

    if (licenseFields.some(field => this.isFieldInvalid(field))) {
      return 'licencias';
    }

    return null;
  }

  // Dynamic array management methods
  addSubspecialty() {
    if (this.newSubspecialty.trim() && !this.subspecialties.includes(this.newSubspecialty.trim())) {
      this.subspecialties.push(this.newSubspecialty.trim());
      this.newSubspecialty = '';
    }
  }

  removeSubspecialty(index: number) {
    this.subspecialties.splice(index, 1);
  }

  addCertification() {
    if (this.newCertification.trim() && !this.certifications.includes(this.newCertification.trim())) {
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

  private markFormGroupTouched() {
    Object.keys(this.doctorForm.controls).forEach(field => {
      const control = this.doctorForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}