import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError, BehaviorSubject } from 'rxjs';

import { PatientSelectionSectionComponent } from './patient-selection-section.component';
import { PatientSelectionModalComponent } from './patient-selection-modal.component';
import { RecentPatientsTabComponent } from './recent-patients-tab.component';
import { AdvancedSearchTabComponent } from './advanced-search-tab.component';
import { NewPatientDialogComponent } from '../new-patient-dialog/new-patient-dialog.component';
import { PatientService } from '../../services/patient.service';
import { PatientSearchService } from '../../services/patient-search.service';
import { NotificationService } from '../../services/notification.service';
import { PatientData, RecentPatient, PatientSearchResult } from '../../interfaces/patient.interface';

// Test Host Component to simulate the prescripciones component
@Component({
  template: `
    <app-patient-selection-section
      [selectedPatient]="selectedPatient"
      (selectPatient)="openPatientSelectionModal()"
      (changePatient)="openPatientSelectionModal()"
    ></app-patient-selection-section>

    <app-patient-selection-modal
      [isOpen]="showPatientSelectionModal"
      (closeModal)="closePatientSelectionModal()"
      (patientSelected)="onPatientSelected($event)"
    ></app-patient-selection-modal>

    <!-- Medication Button for testing -->
    <button 
      id="add-medication-btn"
      [disabled]="!selectedPatient"
      [title]="!selectedPatient ? 'Debe seleccionar un paciente antes de agregar medicamentos' : ''"
    >
      Agregar Medicamento
    </button>
  `
})
class TestHostComponent {
  selectedPatient: PatientData | null = null;
  showPatientSelectionModal = false;

  openPatientSelectionModal() {
    this.showPatientSelectionModal = true;
  }

  closePatientSelectionModal() {
    this.showPatientSelectionModal = false;
  }

  onPatientSelected(patient: PatientData) {
    this.selectedPatient = patient;
    this.showPatientSelectionModal = false;
  }
}

describe('Patient Selection Integration Tests', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let patientService: jasmine.SpyObj<PatientService>;
  let patientSearchService: jasmine.SpyObj<PatientSearchService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  // Mock data
  const mockRecentPatients: RecentPatient[] = [
    {
      id: '1',
      fullName: 'Juan Carlos Pérez',
      firstName: 'Juan Carlos',
      secondName: '',
      firstLastName: 'Pérez',
      secondLastName: 'González',
      idType: 'CC',
      idNumber: '12345678',
      birthDate: '1980-05-15',
      age: 43,
      gender: 'M',
      bloodType: 'O+',
      phone: '+57 300 123 4567',
      email: 'juan.perez@email.com',
      address: 'Calle 123 #45-67',
      city: 'Bogotá',
      country: 'Colombia',
      occupation: 'Ingeniero',
      weight: 75,
      height: 175,
      bmi: 24.5,
      allergies: ['Penicilina', 'Mariscos'],
      chronicConditions: ['Hipertensión'],
      currentMedications: ['Losartán 50mg'],
      clinicalNotes: 'Paciente con hipertensión controlada',
      insuranceProvider: 'EPS Sura',
      insuranceNumber: 'EPS123456',
      insuranceType: 'Contributivo',
      emergencyContact: {
        name: 'María Pérez',
        relationship: 'Esposa',
        phone: '+57 300 987 6543'
      },
      registrationDate: '2023-01-15',
      lastVisitDate: '2024-10-10',
      visitCount: 5,
      lastPrescriptionId: 'RX-001'
    },
    {
      id: '2',
      fullName: 'Ana María López',
      firstName: 'Ana María',
      secondName: '',
      firstLastName: 'López',
      secondLastName: 'Martínez',
      idType: 'CC',
      idNumber: '87654321',
      birthDate: '1990-08-22',
      age: 33,
      gender: 'F',
      bloodType: 'A+',
      phone: '+57 310 456 7890',
      email: 'ana.lopez@email.com',
      address: 'Carrera 45 #12-34',
      city: 'Medellín',
      country: 'Colombia',
      occupation: 'Doctora',
      weight: 60,
      height: 165,
      bmi: 22.0,
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      clinicalNotes: 'Paciente sana',
      insuranceProvider: 'Compensar',
      insuranceNumber: 'COMP789012',
      insuranceType: 'Contributivo',
      emergencyContact: {
        name: 'Carlos López',
        relationship: 'Hermano',
        phone: '+57 310 123 4567'
      },
      registrationDate: '2023-03-20',
      lastVisitDate: '2024-10-08',
      visitCount: 3,
      lastPrescriptionId: 'RX-002'
    }
  ];

  const mockSearchResults: PatientSearchResult = {
    patients: [
      {
        id: '3',
        fullName: 'Carlos Eduardo Ramírez',
        firstName: 'Carlos Eduardo',
        secondName: '',
        firstLastName: 'Ramírez',
        secondLastName: 'Silva',
        idType: 'CC',
        idNumber: '11223344',
        birthDate: '1975-12-03',
        age: 48,
        gender: 'M',
        bloodType: 'B+',
        phone: '+57 320 789 0123',
        email: 'carlos.ramirez@email.com',
        address: 'Avenida 68 #23-45',
        city: 'Cali',
        country: 'Colombia',
        occupation: 'Contador',
        weight: 80,
        height: 180,
        bmi: 24.7,
        allergies: ['Aspirina'],
        chronicConditions: ['Diabetes Tipo 2'],
        currentMedications: ['Metformina 850mg'],
        clinicalNotes: 'Diabetes controlada con medicación',
        insuranceProvider: 'Nueva EPS',
        insuranceNumber: 'NEPS456789',
        insuranceType: 'Subsidiado',
        emergencyContact: {
          name: 'Lucía Ramírez',
          relationship: 'Esposa',
          phone: '+57 320 456 7890'
        },
        registrationDate: '2022-11-10'
      }
    ],
    totalCount: 1,
    hasMore: false
  };

  const mockNewPatient: PatientData = {
    id: '4',
    fullName: 'Nuevo Paciente Test',
    firstName: 'Nuevo',
    secondName: 'Paciente',
    firstLastName: 'Test',
    secondLastName: 'Usuario',
    idType: 'CC',
    idNumber: '99887766',
    birthDate: '1985-06-15',
    age: 38,
    gender: 'F',
    bloodType: 'AB+',
    phone: '+57 350 111 2222',
    email: 'nuevo.paciente@test.com',
    address: 'Calle Nueva #11-22',
    city: 'Barranquilla',
    country: 'Colombia',
    occupation: 'Profesora',
    weight: 65,
    height: 160,
    bmi: 25.4,
    allergies: [],
    chronicConditions: [],
    currentMedications: [],
    clinicalNotes: 'Paciente nuevo sin antecedentes',
    insuranceProvider: 'Sanitas',
    insuranceNumber: 'SAN123456',
    insuranceType: 'Contributivo',
    emergencyContact: {
      name: 'Pedro Test',
      relationship: 'Esposo',
      phone: '+57 350 333 4444'
    },
    registrationDate: '2024-10-15'
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
      searchResults$: new BehaviorSubject(mockSearchResults),
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
      declarations: [TestHostComponent],
      imports: [
        NoopAnimationsModule,
        PatientSelectionSectionComponent,
        PatientSelectionModalComponent,
        RecentPatientsTabComponent,
        AdvancedSearchTabComponent,
        NewPatientDialogComponent
      ],
      providers: [
        { provide: PatientService, useValue: patientServiceSpy },
        { provide: PatientSearchService, useValue: patientSearchServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    patientService = TestBed.inject(PatientService) as jasmine.SpyObj<PatientService>;
    patientSearchService = TestBed.inject(PatientSearchService) as jasmine.SpyObj<PatientSearchService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    // Setup default spy returns
    patientService.getRecentPatients.and.returnValue(of(mockRecentPatients));
    patientSearchService.getSearchPlaceholder.and.returnValue('Buscar por nombre...');
    patientSearchService.getCurrentQuery.and.returnValue('');

    fixture.detectChanges();
  });

  describe('12.1 Complete User Workflow Tests', () => {
    
    it('should complete the workflow: select patient from recent patients tab', fakeAsync(() => {
      // Initial state: no patient selected, medication button disabled
      expect(component.selectedPatient).toBeNull();
      const medicationBtn = fixture.debugElement.query(By.css('#add-medication-btn'));
      expect(medicationBtn.nativeElement.disabled).toBe(true);

      // Step 1: Click "Seleccionar Paciente" button
      const selectPatientBtn = fixture.debugElement.query(By.css('app-patient-selection-section button'));
      expect(selectPatientBtn.nativeElement.textContent.trim()).toContain('Seleccionar');
      
      selectPatientBtn.nativeElement.click();
      fixture.detectChanges();
      tick();

      // Step 2: Modal should open
      expect(component.showPatientSelectionModal).toBe(true);
      const modal = fixture.debugElement.query(By.css('app-patient-selection-modal'));
      expect(modal).toBeTruthy();

      // Step 3: Recent patients tab should be active by default
      const recentTab = fixture.debugElement.query(By.css('app-recent-patients-tab'));
      expect(recentTab).toBeTruthy();

      // Step 4: Select a patient from recent patients
      const patientCards = fixture.debugElement.queryAll(By.css('app-recent-patients-tab app-button'));
      expect(patientCards.length).toBeGreaterThan(0);
      
      // Simulate patient selection
      const recentPatientsComponent = recentTab.componentInstance as RecentPatientsTabComponent;
      recentPatientsComponent.patientSelected.emit(mockRecentPatients[0]);
      fixture.detectChanges();
      tick();

      // Step 5: Verify patient is selected and modal closes
      expect(component.selectedPatient).toBeTruthy();
      expect(component.selectedPatient?.fullName).toBe('Juan Carlos Pérez');
      expect(component.showPatientSelectionModal).toBe(false);

      // Step 6: Verify medication button is now enabled
      expect(medicationBtn.nativeElement.disabled).toBe(false);

      // Step 7: Verify notification was shown
      expect(notificationService.showPatientSelected).toHaveBeenCalledWith('Juan Carlos Pérez');
    }));

    it('should complete the workflow: advanced search and patient selection', fakeAsync(() => {
      // Step 1: Open modal
      const selectPatientBtn = fixture.debugElement.query(By.css('app-patient-selection-section button'));
      selectPatientBtn.nativeElement.click();
      fixture.detectChanges();
      tick();

      // Step 2: Switch to advanced search tab
      const modalComponent = fixture.debugElement.query(By.css('app-patient-selection-modal')).componentInstance;
      modalComponent.setActiveTab('search');
      fixture.detectChanges();
      tick();

      // Step 3: Verify advanced search tab is active
      const searchTab = fixture.debugElement.query(By.css('app-advanced-search-tab'));
      expect(searchTab).toBeTruthy();

      // Step 4: Perform search
      const searchComponent = searchTab.componentInstance as AdvancedSearchTabComponent;
      
      // Simulate form input
      searchComponent.searchForm.patchValue({
        searchCriteria: 'name',
        searchQuery: 'Carlos'
      });
      fixture.detectChanges();
      tick();

      // Step 5: Select patient from search results
      searchComponent.patientSelected.emit(mockSearchResults.patients[0]);
      fixture.detectChanges();
      tick();

      // Step 6: Verify patient selection
      expect(component.selectedPatient).toBeTruthy();
      expect(component.selectedPatient?.fullName).toBe('Carlos Eduardo Ramírez');
      expect(component.showPatientSelectionModal).toBe(false);

      // Step 7: Verify medication button is enabled
      const medicationBtn = fixture.debugElement.query(By.css('#add-medication-btn'));
      expect(medicationBtn.nativeElement.disabled).toBe(false);
    }));

    it('should complete the workflow: create new patient and automatic selection', fakeAsync(() => {
      // Step 1: Open modal
      const selectPatientBtn = fixture.debugElement.query(By.css('app-patient-selection-section button'));
      selectPatientBtn.nativeElement.click();
      fixture.detectChanges();
      tick();

      // Step 2: Click "Nuevo Paciente" button
      const modalComponent = fixture.debugElement.query(By.css('app-patient-selection-modal')).componentInstance;
      modalComponent.onNewPatient();
      fixture.detectChanges();
      tick();

      // Step 3: Verify new patient dialog opens
      expect(modalComponent.showNewPatientDialog).toBe(true);

      // Step 4: Simulate patient creation
      modalComponent.onPatientCreated(mockNewPatient);
      fixture.detectChanges();
      tick();

      // Step 5: Verify automatic selection and modal closure
      expect(component.selectedPatient).toBeTruthy();
      expect(component.selectedPatient?.fullName).toBe('Nuevo Paciente Test');
      expect(component.showPatientSelectionModal).toBe(false);
      expect(modalComponent.showNewPatientDialog).toBe(false);

      // Step 6: Verify success notification
      expect(notificationService.showSuccess).toHaveBeenCalledWith(
        'Paciente "Nuevo Paciente Test" creado y seleccionado correctamente',
        'Nuevo Paciente Creado'
      );

      // Step 7: Verify medication button is enabled
      const medicationBtn = fixture.debugElement.query(By.css('#add-medication-btn'));
      expect(medicationBtn.nativeElement.disabled).toBe(false);
    }));

    it('should complete the workflow: change selected patient', fakeAsync(() => {
      // Step 1: Start with a selected patient
      component.selectedPatient = mockRecentPatients[0];
      fixture.detectChanges();
      tick();

      // Step 2: Verify patient is displayed
      const patientSection = fixture.debugElement.query(By.css('app-patient-selection-section'));
      expect(patientSection.nativeElement.textContent).toContain('Juan Carlos Pérez');

      // Step 3: Click "Cambiar paciente" button
      const changePatientBtn = fixture.debugElement.query(By.css('app-patient-selection-section button'));
      expect(changePatientBtn.nativeElement.textContent.trim()).toContain('Cambiar');
      
      changePatientBtn.nativeElement.click();
      fixture.detectChanges();
      tick();

      // Step 4: Modal should open
      expect(component.showPatientSelectionModal).toBe(true);

      // Step 5: Select different patient
      const recentTab = fixture.debugElement.query(By.css('app-recent-patients-tab'));
      const recentPatientsComponent = recentTab.componentInstance as RecentPatientsTabComponent;
      recentPatientsComponent.patientSelected.emit(mockRecentPatients[1]);
      fixture.detectChanges();
      tick();

      // Step 6: Verify patient change
      expect(component.selectedPatient?.fullName).toBe('Ana María López');
      expect(component.showPatientSelectionModal).toBe(false);

      // Step 7: Verify change notification
      expect(notificationService.showSuccess).toHaveBeenCalledWith(
        'Paciente cambiado a "Ana María López"',
        'Paciente Actualizado'
      );

      // Step 8: Verify medication button remains enabled
      const medicationBtn = fixture.debugElement.query(By.css('#add-medication-btn'));
      expect(medicationBtn.nativeElement.disabled).toBe(false);
    }));

    it('should verify Angular lifecycle hooks work correctly', fakeAsync(() => {
      // Test OnInit lifecycle
      const recentTab = fixture.debugElement.query(By.css('app-recent-patients-tab'));
      const recentComponent = recentTab.componentInstance as RecentPatientsTabComponent;
      
      spyOn(recentComponent, 'ngOnInit').and.callThrough();
      spyOn(recentComponent, 'loadRecentPatients').and.callThrough();
      
      recentComponent.ngOnInit();
      expect(recentComponent.ngOnInit).toHaveBeenCalled();
      expect(recentComponent.loadRecentPatients).toHaveBeenCalled();

      // Test OnDestroy lifecycle
      spyOn(recentComponent, 'ngOnDestroy').and.callThrough();
      fixture.destroy();
      expect(recentComponent.ngOnDestroy).toHaveBeenCalled();

      // Test OnChanges lifecycle for patient selection section
      const patientSection = fixture.debugElement.query(By.css('app-patient-selection-section'));
      const sectionComponent = patientSection.componentInstance as PatientSelectionSectionComponent;
      
      spyOn(sectionComponent, 'ngOnChanges').and.callThrough();
      
      // Trigger change
      component.selectedPatient = mockRecentPatients[0];
      fixture.detectChanges();
      
      expect(sectionComponent.ngOnChanges).toHaveBeenCalled();
    }));

    it('should handle error states gracefully', fakeAsync(() => {
      // Test error in loading recent patients
      patientService.getRecentPatients.and.returnValue(throwError(() => new Error('Network error')));
      
      const selectPatientBtn = fixture.debugElement.query(By.css('app-patient-selection-section button'));
      selectPatientBtn.nativeElement.click();
      fixture.detectChanges();
      tick();

      const recentTab = fixture.debugElement.query(By.css('app-recent-patients-tab'));
      const recentComponent = recentTab.componentInstance as RecentPatientsTabComponent;
      
      recentComponent.loadRecentPatients();
      fixture.detectChanges();
      tick();

      expect(recentComponent.error).toBeTruthy();
      expect(recentComponent.isLoading).toBe(false);

      // Test search error handling
      const modalComponent = fixture.debugElement.query(By.css('app-patient-selection-modal')).componentInstance;
      modalComponent.setActiveTab('search');
      fixture.detectChanges();

      const searchTab = fixture.debugElement.query(By.css('app-advanced-search-tab'));
      const searchComponent = searchTab.componentInstance as AdvancedSearchTabComponent;
      
      // Simulate search error
      (patientSearchService.searchError$ as BehaviorSubject<string | null>).next('Search failed');
      fixture.detectChanges();
      tick();

      expect(searchComponent.searchError$).toBeTruthy();
    }));

    it('should validate form inputs correctly', fakeAsync(() => {
      // Open modal and switch to search tab
      const selectPatientBtn = fixture.debugElement.query(By.css('app-patient-selection-section button'));
      selectPatientBtn.nativeElement.click();
      fixture.detectChanges();

      const modalComponent = fixture.debugElement.query(By.css('app-patient-selection-modal')).componentInstance;
      modalComponent.setActiveTab('search');
      fixture.detectChanges();

      const searchTab = fixture.debugElement.query(By.css('app-advanced-search-tab'));
      const searchComponent = searchTab.componentInstance as AdvancedSearchTabComponent;

      // Test minimum character validation
      searchComponent.searchForm.patchValue({
        searchQuery: 'a' // Only 1 character
      });
      fixture.detectChanges();

      expect(searchComponent.searchForm.get('searchQuery')?.invalid).toBe(true);
      expect(searchComponent.searchForm.get('searchQuery')?.errors?.['minlength']).toBeTruthy();

      // Test valid input
      searchComponent.searchForm.patchValue({
        searchQuery: 'Carlos' // Valid length
      });
      fixture.detectChanges();

      expect(searchComponent.searchForm.get('searchQuery')?.valid).toBe(true);
    }));
  });
});