import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PatientSelectionSectionComponent } from './patient-selection-section.component';
import { RecentPatientsTabComponent } from './recent-patients-tab.component';
import { AdvancedSearchTabComponent } from './advanced-search-tab.component';
import { PatientService } from '../../services/patient.service';
import { PatientSearchService } from '../../services/patient-search.service';
import { NotificationService } from '../../services/notification.service';
import { PatientData, RecentPatient } from '../../interfaces/patient.interface';
import { of, BehaviorSubject } from 'rxjs';

// Test component to test medical alerts display
@Component({
  template: `
    <app-patient-selection-section
      [selectedPatient]="selectedPatient"
      (selectPatient)="onSelectPatient()"
      (changePatient)="onChangePatient()"
    ></app-patient-selection-section>
  `
})
class TestMedicalAlertsComponent {
  selectedPatient: PatientData | null = null;

  onSelectPatient() {}
  onChangePatient() {}
}

describe('Medical Alerts Display Tests', () => {
  let component: TestMedicalAlertsComponent;
  let fixture: ComponentFixture<TestMedicalAlertsComponent>;
  let patientService: jasmine.SpyObj<PatientService>;
  let patientSearchService: jasmine.SpyObj<PatientSearchService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  // Mock patients with different medical alert scenarios
  const patientWithAllergies: PatientData = {
    id: '1',
    fullName: 'Juan Pérez Alérgico',
    firstName: 'Juan',
    secondName: '',
    firstLastName: 'Pérez',
    secondLastName: 'Alérgico',
    idType: 'CC',
    idNumber: '12345678',
    birthDate: '1980-05-15',
    age: 43,
    gender: 'M',
    bloodType: 'O+',
    phone: '+57 300 123 4567',
    email: 'juan.alergico@email.com',
    address: 'Calle 123 #45-67',
    city: 'Bogotá',
    country: 'Colombia',
    occupation: 'Ingeniero',
    weight: 75,
    height: 175,
    bmi: 24.5,
    allergies: ['Penicilina', 'Mariscos', 'Polen', 'Aspirina'],
    chronicConditions: [],
    currentMedications: [],
    clinicalNotes: 'Paciente con múltiples alergias',
    insuranceProvider: 'EPS Sura',
    insuranceNumber: 'EPS123456',
    insuranceType: 'Contributivo',
    emergencyContact: {
      name: 'María Pérez',
      relationship: 'Esposa',
      phone: '+57 300 987 6543'
    },
    registrationDate: '2023-01-15'
  };

  const patientWithChronicConditions: PatientData = {
    id: '2',
    fullName: 'Ana López Crónica',
    firstName: 'Ana',
    secondName: '',
    firstLastName: 'López',
    secondLastName: 'Crónica',
    idType: 'CC',
    idNumber: '87654321',
    birthDate: '1970-08-22',
    age: 53,
    gender: 'F',
    bloodType: 'A+',
    phone: '+57 310 456 7890',
    email: 'ana.cronica@email.com',
    address: 'Carrera 45 #12-34',
    city: 'Medellín',
    country: 'Colombia',
    occupation: 'Doctora',
    weight: 60,
    height: 165,
    bmi: 22.0,
    allergies: [],
    chronicConditions: ['Hipertensión Arterial', 'Diabetes Tipo 2', 'Artritis Reumatoide'],
    currentMedications: [],
    clinicalNotes: 'Paciente con múltiples condiciones crónicas',
    insuranceProvider: 'Compensar',
    insuranceNumber: 'COMP789012',
    insuranceType: 'Contributivo',
    emergencyContact: {
      name: 'Carlos López',
      relationship: 'Hermano',
      phone: '+57 310 123 4567'
    },
    registrationDate: '2023-03-20'
  };

  const patientWithMedications: PatientData = {
    id: '3',
    fullName: 'Carlos Ramírez Medicado',
    firstName: 'Carlos',
    secondName: '',
    firstLastName: 'Ramírez',
    secondLastName: 'Medicado',
    idType: 'CC',
    idNumber: '11223344',
    birthDate: '1975-12-03',
    age: 48,
    gender: 'M',
    bloodType: 'B+',
    phone: '+57 320 789 0123',
    email: 'carlos.medicado@email.com',
    address: 'Avenida 68 #23-45',
    city: 'Cali',
    country: 'Colombia',
    occupation: 'Contador',
    weight: 80,
    height: 180,
    bmi: 24.7,
    allergies: [],
    chronicConditions: [],
    currentMedications: ['Losartán 50mg', 'Metformina 850mg', 'Atorvastatina 20mg', 'Omeprazol 20mg'],
    clinicalNotes: 'Paciente con múltiples medicamentos',
    insuranceProvider: 'Nueva EPS',
    insuranceNumber: 'NEPS456789',
    insuranceType: 'Subsidiado',
    emergencyContact: {
      name: 'Lucía Ramírez',
      relationship: 'Esposa',
      phone: '+57 320 456 7890'
    },
    registrationDate: '2022-11-10'
  };

  const patientWithAllAlerts: PatientData = {
    id: '4',
    fullName: 'María González Completa',
    firstName: 'María',
    secondName: '',
    firstLastName: 'González',
    secondLastName: 'Completa',
    idType: 'CC',
    idNumber: '99887766',
    birthDate: '1965-06-15',
    age: 58,
    gender: 'F',
    bloodType: 'AB+',
    phone: '+57 350 111 2222',
    email: 'maria.completa@email.com',
    address: 'Calle Nueva #11-22',
    city: 'Barranquilla',
    country: 'Colombia',
    occupation: 'Profesora',
    weight: 65,
    height: 160,
    bmi: 25.4,
    allergies: ['Penicilina', 'Sulfonamidas'],
    chronicConditions: ['Hipertensión', 'Diabetes'],
    currentMedications: ['Enalapril 10mg', 'Glibenclamida 5mg'],
    clinicalNotes: 'Paciente con todas las alertas médicas',
    insuranceProvider: 'Sanitas',
    insuranceNumber: 'SAN123456',
    insuranceType: 'Contributivo',
    emergencyContact: {
      name: 'Pedro González',
      relationship: 'Esposo',
      phone: '+57 350 333 4444'
    },
    registrationDate: '2024-10-15'
  };

  const patientWithoutAlerts: PatientData = {
    id: '5',
    fullName: 'Luis Sánchez Sano',
    firstName: 'Luis',
    secondName: '',
    firstLastName: 'Sánchez',
    secondLastName: 'Sano',
    idType: 'CC',
    idNumber: '55443322',
    birthDate: '1995-03-10',
    age: 28,
    gender: 'M',
    bloodType: 'O-',
    phone: '+57 315 555 6666',
    email: 'luis.sano@email.com',
    address: 'Calle Salud #99-88',
    city: 'Bucaramanga',
    country: 'Colombia',
    occupation: 'Deportista',
    weight: 70,
    height: 178,
    bmi: 22.1,
    allergies: [],
    chronicConditions: [],
    currentMedications: [],
    clinicalNotes: 'Paciente sano sin alertas médicas',
    insuranceProvider: 'Famisanar',
    insuranceNumber: 'FAM987654',
    insuranceType: 'Contributivo',
    emergencyContact: {
      name: 'Ana Sánchez',
      relationship: 'Hermana',
      phone: '+57 315 777 8888'
    },
    registrationDate: '2024-01-20'
  };

  beforeEach(async () => {
    const patientServiceSpy = jasmine.createSpyObj('PatientService', ['getRecentPatients']);
    const patientSearchServiceSpy = jasmine.createSpyObj('PatientSearchService', [
      'setSearchCriteria',
      'setSearchQuery',
      'clearSearch',
      'clearError',
      'reset',
      'getSearchPlaceholder',
      'getCurrentQuery'
    ], {
      searchResults$: new BehaviorSubject({ patients: [], totalCount: 0, hasMore: false }),
      isSearching$: new BehaviorSubject(false),
      searchError$: new BehaviorSubject(null)
    });
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showPatientSelected',
      'showSuccess',
      'showInactivePatientWarning',
      'showIncompleteDataWarning',
      'showLoadingError'
    ]);

    await TestBed.configureTestingModule({
      declarations: [TestMedicalAlertsComponent],
      imports: [
        NoopAnimationsModule,
        PatientSelectionSectionComponent
      ],
      providers: [
        { provide: PatientService, useValue: patientServiceSpy },
        { provide: PatientSearchService, useValue: patientSearchServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestMedicalAlertsComponent);
    component = fixture.componentInstance;
    patientService = TestBed.inject(PatientService) as jasmine.SpyObj<PatientService>;
    patientSearchService = TestBed.inject(PatientSearchService) as jasmine.SpyObj<PatientSearchService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    fixture.detectChanges();
  });

  describe('12.2 Medical Alerts Display Tests', () => {

    it('should display allergies with proper warning styling', () => {
      // Set patient with allergies
      component.selectedPatient = patientWithAllergies;
      fixture.detectChanges();

      // Check if allergies section is displayed
      const allergiesSection = fixture.debugElement.query(By.css('[class*="text-red-700"]'));
      expect(allergiesSection).toBeTruthy();

      // Check for allergy badges
      const allergyBadges = fixture.debugElement.queryAll(By.css('[class*="bg-red-50"][class*="border-red-200"]'));
      expect(allergyBadges.length).toBe(patientWithAllergies.allergies.length);

      // Verify each allergy is displayed
      patientWithAllergies.allergies.forEach((allergy, index) => {
        const badge = allergyBadges[index];
        expect(badge.nativeElement.textContent.trim()).toContain(allergy);
      });

      // Check for warning icons in allergy badges
      const warningIcons = fixture.debugElement.queryAll(By.css('[class*="bg-red-50"] lucide-icon'));
      expect(warningIcons.length).toBeGreaterThan(0);

      // Verify red styling classes
      allergyBadges.forEach(badge => {
        const classes = badge.nativeElement.className;
        expect(classes).toContain('bg-red-50');
        expect(classes).toContain('border-red-200');
        expect(classes).toContain('text-red-800');
      });
    });

    it('should display chronic conditions with appropriate styling', () => {
      // Set patient with chronic conditions
      component.selectedPatient = patientWithChronicConditions;
      fixture.detectChanges();

      // Check if chronic conditions section is displayed
      const conditionsSection = fixture.debugElement.query(By.css('[class*="text-orange-700"]'));
      expect(conditionsSection).toBeTruthy();

      // Check for condition badges
      const conditionBadges = fixture.debugElement.queryAll(By.css('[class*="bg-orange-50"][class*="border-orange-200"]'));
      expect(conditionBadges.length).toBe(patientWithChronicConditions.chronicConditions.length);

      // Verify each condition is displayed
      patientWithChronicConditions.chronicConditions.forEach((condition, index) => {
        const badge = conditionBadges[index];
        expect(badge.nativeElement.textContent.trim()).toContain(condition);
      });

      // Check for info icons in condition badges
      const infoIcons = fixture.debugElement.queryAll(By.css('[class*="bg-orange-50"] lucide-icon'));
      expect(infoIcons.length).toBeGreaterThan(0);

      // Verify orange styling classes
      conditionBadges.forEach(badge => {
        const classes = badge.nativeElement.className;
        expect(classes).toContain('bg-orange-50');
        expect(classes).toContain('border-orange-200');
        expect(classes).toContain('text-orange-800');
      });
    });

    it('should display current medications with blue styling', () => {
      // Set patient with medications
      component.selectedPatient = patientWithMedications;
      fixture.detectChanges();

      // Check if medications section is displayed
      const medicationsSection = fixture.debugElement.query(By.css('[class*="text-blue-700"]'));
      expect(medicationsSection).toBeTruthy();

      // Check for medication badges
      const medicationBadges = fixture.debugElement.queryAll(By.css('[class*="bg-blue-50"][class*="border-blue-200"]'));
      expect(medicationBadges.length).toBe(patientWithMedications.currentMedications.length);

      // Verify each medication is displayed
      patientWithMedications.currentMedications.forEach((medication, index) => {
        const badge = medicationBadges[index];
        expect(badge.nativeElement.textContent.trim()).toContain(medication);
      });

      // Check for pill icons in medication badges
      const pillIcons = fixture.debugElement.queryAll(By.css('[class*="bg-blue-50"] lucide-icon'));
      expect(pillIcons.length).toBeGreaterThan(0);

      // Verify blue styling classes
      medicationBadges.forEach(badge => {
        const classes = badge.nativeElement.className;
        expect(classes).toContain('bg-blue-50');
        expect(classes).toContain('border-blue-200');
        expect(classes).toContain('text-blue-800');
      });
    });

    it('should display all medical alerts when patient has all types', () => {
      // Set patient with all types of alerts
      component.selectedPatient = patientWithAllAlerts;
      fixture.detectChanges();

      // Check for allergies section
      const allergyBadges = fixture.debugElement.queryAll(By.css('[class*="bg-red-50"]'));
      expect(allergyBadges.length).toBe(patientWithAllAlerts.allergies.length);

      // Check for chronic conditions section
      const conditionBadges = fixture.debugElement.queryAll(By.css('[class*="bg-orange-50"]'));
      expect(conditionBadges.length).toBe(patientWithAllAlerts.chronicConditions.length);

      // Check for medications section
      const medicationBadges = fixture.debugElement.queryAll(By.css('[class*="bg-blue-50"]'));
      expect(medicationBadges.length).toBe(patientWithAllAlerts.currentMedications.length);

      // Verify all sections have proper headers
      const alertsHeader = fixture.debugElement.query(By.css('[class*="text-amber-500"]'));
      expect(alertsHeader).toBeTruthy();
      expect(alertsHeader.nativeElement.textContent).toContain('Alertas Médicas');

      // Check section headers
      const sectionHeaders = fixture.debugElement.queryAll(By.css('[class*="uppercase"][class*="tracking-wide"]'));
      expect(sectionHeaders.length).toBe(3); // Alergias, Condiciones Crónicas, Medicamentos Actuales

      const headerTexts = sectionHeaders.map(header => header.nativeElement.textContent.trim());
      expect(headerTexts).toContain('Alergias');
      expect(headerTexts).toContain('Condiciones Crónicas');
      expect(headerTexts).toContain('Medicamentos Actuales');
    });

    it('should not display medical alerts section when patient has no alerts', () => {
      // Set patient without any alerts
      component.selectedPatient = patientWithoutAlerts;
      fixture.detectChanges();

      // Check that medical alerts section is not displayed
      const alertsSection = fixture.debugElement.query(By.css('[class*="text-amber-500"]'));
      expect(alertsSection).toBeFalsy();

      // Check that no alert badges are displayed
      const allergyBadges = fixture.debugElement.queryAll(By.css('[class*="bg-red-50"]'));
      const conditionBadges = fixture.debugElement.queryAll(By.css('[class*="bg-orange-50"]'));
      const medicationBadges = fixture.debugElement.queryAll(By.css('[class*="bg-blue-50"]'));

      expect(allergyBadges.length).toBe(0);
      expect(conditionBadges.length).toBe(0);
      expect(medicationBadges.length).toBe(0);

      // Verify hasPatientAlerts method returns false
      const patientSectionComponent = fixture.debugElement.query(By.css('app-patient-selection-section')).componentInstance;
      expect(patientSectionComponent.hasPatientAlerts()).toBe(false);
    });

    it('should test conditional rendering with *ngIf and *ngFor', () => {
      // Test *ngIf conditional rendering - no patient selected
      component.selectedPatient = null;
      fixture.detectChanges();

      // Should show empty state
      const emptyState = fixture.debugElement.query(By.css('[class*="border-dashed"]'));
      expect(emptyState).toBeTruthy();

      // Should not show patient info
      const patientInfo = fixture.debugElement.query(By.css('[class*="border-gray-200"]:not([class*="border-dashed"])'));
      expect(patientInfo).toBeFalsy();

      // Test *ngIf conditional rendering - patient selected
      component.selectedPatient = patientWithAllAlerts;
      fixture.detectChanges();

      // Should not show empty state
      const emptyStateAfter = fixture.debugElement.query(By.css('[class*="border-dashed"]'));
      expect(emptyStateAfter).toBeFalsy();

      // Should show patient info
      const patientInfoAfter = fixture.debugElement.query(By.css('[class*="border-gray-200"]:not([class*="border-dashed"])'));
      expect(patientInfoAfter).toBeTruthy();

      // Test *ngFor rendering for allergies
      const allergyElements = fixture.debugElement.queryAll(By.css('[class*="bg-red-50"] span:last-child'));
      expect(allergyElements.length).toBe(patientWithAllAlerts.allergies.length);
      
      allergyElements.forEach((element, index) => {
        expect(element.nativeElement.textContent.trim()).toBe(patientWithAllAlerts.allergies[index]);
      });

      // Test *ngFor rendering for chronic conditions
      const conditionElements = fixture.debugElement.queryAll(By.css('[class*="bg-orange-50"] span:last-child'));
      expect(conditionElements.length).toBe(patientWithAllAlerts.chronicConditions.length);
      
      conditionElements.forEach((element, index) => {
        expect(element.nativeElement.textContent.trim()).toBe(patientWithAllAlerts.chronicConditions[index]);
      });

      // Test *ngFor rendering for medications
      const medicationElements = fixture.debugElement.queryAll(By.css('[class*="bg-blue-50"] span:last-child'));
      expect(medicationElements.length).toBe(patientWithAllAlerts.currentMedications.length);
      
      medicationElements.forEach((element, index) => {
        expect(element.nativeElement.textContent.trim()).toBe(patientWithAllAlerts.currentMedications[index]);
      });
    });

    it('should handle empty arrays gracefully', () => {
      // Create patient with empty arrays
      const patientWithEmptyArrays: PatientData = {
        ...patientWithoutAlerts,
        allergies: [],
        chronicConditions: [],
        currentMedications: []
      };

      component.selectedPatient = patientWithEmptyArrays;
      fixture.detectChanges();

      // Verify no alert sections are displayed
      const allergySection = fixture.debugElement.query(By.css('[class*="text-red-700"]'));
      const conditionSection = fixture.debugElement.query(By.css('[class*="text-orange-700"]'));
      const medicationSection = fixture.debugElement.query(By.css('[class*="text-blue-700"]'));

      expect(allergySection).toBeFalsy();
      expect(conditionSection).toBeFalsy();
      expect(medicationSection).toBeFalsy();

      // Verify hasPatientAlerts returns false
      const patientSectionComponent = fixture.debugElement.query(By.css('app-patient-selection-section')).componentInstance;
      expect(patientSectionComponent.hasPatientAlerts()).toBe(false);
    });

    it('should display proper icons for each alert type', () => {
      component.selectedPatient = patientWithAllAlerts;
      fixture.detectChanges();

      // Check allergy warning icons
      const allergyBadges = fixture.debugElement.queryAll(By.css('[class*="bg-red-50"]'));
      allergyBadges.forEach(badge => {
        const icon = badge.query(By.css('lucide-icon'));
        expect(icon).toBeTruthy();
      });

      // Check chronic condition info icons
      const conditionBadges = fixture.debugElement.queryAll(By.css('[class*="bg-orange-50"]'));
      conditionBadges.forEach(badge => {
        const icon = badge.query(By.css('lucide-icon'));
        expect(icon).toBeTruthy();
      });

      // Check medication pill icons
      const medicationBadges = fixture.debugElement.queryAll(By.css('[class*="bg-blue-50"]'));
      medicationBadges.forEach(badge => {
        const icon = badge.query(By.css('lucide-icon'));
        expect(icon).toBeTruthy();
      });
    });

    it('should handle long medication names with proper truncation', () => {
      // Create patient with long medication names
      const patientWithLongMedications: PatientData = {
        ...patientWithMedications,
        currentMedications: [
          'Acetaminofén con Codeína 300mg/30mg tabletas recubiertas',
          'Hidroclorotiazida y Losartán potásico 25mg/100mg',
          'Atorvastatina cálcica trihidrato 20mg tabletas'
        ]
      };

      component.selectedPatient = patientWithLongMedications;
      fixture.detectChanges();

      // Check that medication badges are displayed
      const medicationBadges = fixture.debugElement.queryAll(By.css('[class*="bg-blue-50"]'));
      expect(medicationBadges.length).toBe(3);

      // Verify truncation classes are applied
      medicationBadges.forEach(badge => {
        const textSpan = badge.query(By.css('span:last-child'));
        expect(textSpan.nativeElement.className).toContain('truncate');
      });
    });

    it('should maintain responsive design for medical alerts', () => {
      component.selectedPatient = patientWithAllAlerts;
      fixture.detectChanges();

      // Check responsive classes on alert badges
      const allBadges = fixture.debugElement.queryAll(By.css('[class*="px-2"][class*="sm:px-3"]'));
      expect(allBadges.length).toBeGreaterThan(0);

      // Verify responsive text sizing
      const responsiveText = fixture.debugElement.queryAll(By.css('[class*="text-xs"][class*="font-medium"]'));
      expect(responsiveText.length).toBeGreaterThan(0);

      // Check responsive icon sizing
      const responsiveIcons = fixture.debugElement.queryAll(By.css('[class*="w-2.5"][class*="h-2.5"][class*="sm:w-3"][class*="sm:h-3"]'));
      expect(responsiveIcons.length).toBeGreaterThan(0);
    });
  });
});