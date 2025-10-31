import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, UserCheck, Save, X, User, Phone, Mail, MapPin, Heart, Shield, AlertTriangle, ArrowRight, ArrowLeft, Plus, Calendar, Activity, Pill } from 'lucide-angular';
import { PatientData } from '../../interfaces/patient.interface';

interface FormTab {
  id: string;
  label: string;
  shortLabel: string;
  icon: any;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

@Component({
  selector: 'app-new-patient-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule],
  templateUrl: './new-patient-modal.component.html',
  styleUrls: ['./new-patient-modal.component.css']
})
export class NewPatientModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() patientCreated = new EventEmitter<PatientData>();

  // Icons
  userCheckIcon = UserCheck;
  saveIcon = Save;
  xIcon = X;
  userIcon = User;
  phoneIcon = Phone;
  mailIcon = Mail;
  mapPinIcon = MapPin;
  heartIcon = Heart;
  shieldIcon = Shield;
  alertTriangleIcon = AlertTriangle;
  arrowRightIcon = ArrowRight;
  arrowLeftIcon = ArrowLeft;
  plusIcon = Plus;
  calendarIcon = Calendar;
  activityIcon = Activity;
  pillIcon = Pill;

  // Form and state
  patientForm!: FormGroup;
  activeTab = 'personal';
  isSubmitting = false;
  currentYear = new Date().getFullYear();

  // Dynamic arrays
  allergies: string[] = [];
  chronicConditions: string[] = [];
  currentMedications: string[] = [];

  // Temporary input values
  newAllergy = '';
  newCondition = '';
  newMedication = '';

  // Form tabs configuration
  formTabs: FormTab[] = [
    { id: 'personal', label: 'Información Personal', shortLabel: 'Personal', icon: User },
    { id: 'contacto', label: 'Información de Contacto', shortLabel: 'Contacto', icon: Phone },
    { id: 'medica', label: 'Información Médica', shortLabel: 'Médica', icon: Activity },
    { id: 'emergencia', label: 'Contacto de Emergencia', shortLabel: 'Emergencia', icon: AlertTriangle }
  ];

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  private initializeForm() {
    this.patientForm = this.fb.group({
      // Personal Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      secondName: [''],
      firstLastName: ['', [Validators.required, Validators.minLength(2)]],
      secondLastName: [''],
      idType: ['CC', [Validators.required]],
      idNumber: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      bloodType: [''],

      // Contact Information
      phone: ['', [Validators.required]],
      email: ['', [Validators.email]],
      address: [''],
      city: [''],
      country: ['Colombia'],

      // Medical Information
      weight: ['', [Validators.min(1), Validators.max(500)]],
      height: ['', [Validators.min(0.5), Validators.max(3)]],
      clinicalNotes: [''],

      // Emergency Contact
      emergencyName: [''],
      emergencyRelationship: [''],
      emergencyPhone: ['']
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
        const personalFields = ['firstName', 'firstLastName', 'idNumber', 'birthDate', 'gender'];
        const hasPersonalErrors = personalFields.some(field => this.isFieldInvalid(field));
        const hasPersonalValues = personalFields.every(field => this.patientForm.get(field)?.value);
        
        if (hasPersonalErrors) return 'error';
        if (hasPersonalValues) return 'success';
        return 'none';

      case 'contacto':
        const contactFields = ['phone'];
        const hasContactErrors = contactFields.some(field => this.isFieldInvalid(field));
        const hasContactValues = contactFields.every(field => this.patientForm.get(field)?.value);
        
        if (hasContactErrors) return 'error';
        if (hasContactValues) return 'success';
        return 'none';

      default:
        return 'none';
    }
  }

  // Form validation methods
  isFieldInvalid(fieldName: string): boolean {
    const field = this.patientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.patientForm.get(fieldName);
    return !!(field && field.valid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.isSubmitting = true;

      const formValue = this.patientForm.value;
      const patientData: PatientData = {
        id: `PAT-${Date.now()}`,
        fullName: this.buildFullName(formValue),
        firstName: formValue.firstName,
        secondName: formValue.secondName || '',
        firstLastName: formValue.firstLastName,
        secondLastName: formValue.secondLastName || '',
        idType: formValue.idType,
        idNumber: formValue.idNumber,
        birthDate: formValue.birthDate,
        age: this.calculateAge(formValue.birthDate),
        gender: formValue.gender,
        bloodType: formValue.bloodType || '',
        phone: formValue.phone,
        email: formValue.email || '',
        address: formValue.address || '',
        city: formValue.city || '',
        country: formValue.country,
        weight: formValue.weight || '',
        height: formValue.height || '',
        bmi: this.calculateBMI(formValue.weight, formValue.height),
        allergies: this.allergies,
        chronicConditions: this.chronicConditions,
        currentMedications: this.currentMedications,
        clinicalNotes: formValue.clinicalNotes || '',
        emergencyContact: {
          name: formValue.emergencyName || '',
          relationship: formValue.emergencyRelationship || '',
          phone: formValue.emergencyPhone || ''
        },
        registrationDate: new Date().toISOString().split('T')[0],
        lastVisit: '',
        status: 'active' as const,
        insuranceProvider: '',
        insuranceNumber: ''
      };

      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.patientCreated.emit(patientData);
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

  private buildFullName(formValue: any): string {
    const parts = [
      formValue.firstName,
      formValue.secondName,
      formValue.firstLastName,
      formValue.secondLastName
    ].filter(part => part && part.trim());
    
    return parts.join(' ');
  }

  private calculateAge(birthDate: string): number {
    if (!birthDate) return 0;
    
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return 0;
    }
  }

  private calculateBMI(weight: string, height: string): string {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    
    if (w > 0 && h > 0) {
      const bmi = w / (h * h);
      return bmi.toFixed(1);
    }
    
    return '';
  }

  private findFirstInvalidTab(): string | null {
    const personalFields = ['firstName', 'firstLastName', 'idNumber', 'birthDate', 'gender'];
    const contactFields = ['phone'];

    if (personalFields.some(field => this.isFieldInvalid(field))) {
      return 'personal';
    }
    
    if (contactFields.some(field => this.isFieldInvalid(field))) {
      return 'contacto';
    }

    return null;
  }

  // Dynamic array management methods
  addAllergy() {
    if (this.newAllergy.trim() && !this.allergies.includes(this.newAllergy.trim())) {
      this.allergies.push(this.newAllergy.trim());
      this.newAllergy = '';
    }
  }

  removeAllergy(index: number) {
    this.allergies.splice(index, 1);
  }

  addCondition() {
    if (this.newCondition.trim() && !this.chronicConditions.includes(this.newCondition.trim())) {
      this.chronicConditions.push(this.newCondition.trim());
      this.newCondition = '';
    }
  }

  removeCondition(index: number) {
    this.chronicConditions.splice(index, 1);
  }

  addMedication() {
    if (this.newMedication.trim() && !this.currentMedications.includes(this.newMedication.trim())) {
      this.currentMedications.push(this.newMedication.trim());
      this.newMedication = '';
    }
  }

  removeMedication(index: number) {
    this.currentMedications.splice(index, 1);
  }

  private markFormGroupTouched() {
    Object.keys(this.patientForm.controls).forEach(field => {
      const control = this.patientForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  // Utility methods
  getAge(): number {
    const birthDate = this.patientForm.get('birthDate')?.value;
    return this.calculateAge(birthDate);
  }

  getBMI(): string {
    const weight = this.patientForm.get('weight')?.value;
    const height = this.patientForm.get('height')?.value;
    return this.calculateBMI(weight, height);
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