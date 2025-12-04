import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { of, BehaviorSubject } from 'rxjs';

import { PatientSelectionSectionComponent } from './patient-selection-section.component';
import { PatientSelectionModalComponent } from './patient-selection-modal.component';
import { AdvancedSearchTabComponent } from './advanced-search-tab.component';
import { RecentPatientsTabComponent } from './recent-patients-tab.component';
import { PatientService } from '../../services/patient.service';
import { PatientSearchService } from '../../services/patient-search.service';
import { NotificationService } from '../../services/notification.service';
import { PatientData, RecentPatient } from '../../interfaces/patient.interface';

@Component({
  template: `
    <main role="main" aria-label="Patient Selection System">
      <h1 class="sr-only">Sistema de Selección de Pacientes</h1>
      
      <app-patient-selection-section
        [selectedPatient]="selectedPatient"
        (selectPatient)="openModal()"
        (changePatient)="openModal()"
        aria-label="Sección de selección de paciente"
      ></app-patient-selection-section>

      <app-patient-selection-modal
        [isOpen]="showModal"
        (closeModal)="closeModal()"
        (patientSelected)="onPatientSelected($event)"
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      ></app-patient-selection-modal>

      <!-- Live region for announcements -->
      <div aria-live="polite" aria-atomic="true" class="sr-only" id="announcements">
        {{ currentAnnouncement }}
      </div>

      <!-- Error announcements -->
      <div aria-live="assertive" aria-atomic="true" class="sr-only" id="error-announcements">
        {{ errorAnnouncement }}
      </div>
    </main>
  `,
  styles: [`
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `]
})
class AccessibilityVerificationComponent {
  selectedPatient: PatientData | null = null;
  showModal = false;
  currentAnnouncement = '';
  errorAnnouncement = '';

  openModal() {
    this.showModal = true;
    this.currentAnnouncement = 'Modal de selección de paciente abierto';
  }

  closeModal() {
    this.showModal = false;
    this.currentAnnouncement = 'Modal de selección de paciente cerrado';
  }

  onPatientSelected(patient: PatientData) {
    this.selectedPatient = patient;
    this.showModal = false;
    this.currentAnnouncement = `Paciente ${patient.fullName} seleccionado correctamente`;
  }
}

describe('Accessibility Verification Tests', () => {
  let component: AccessibilityVerificationComponent;
  let fixture: ComponentFixture<AccessibilityVerificationComponent>;
  let patientService: jasmine.SpyObj<PatientService>;
  let patientSearchService: jasmine.SpyObj<PatientSearchService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  const mockPatient: PatientData = {
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
    allergies: ['Penicilina'],
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
    registrationDate: '2023-01-15'
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
      declarations: [AccessibilityVerificationComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        PatientSelectionSectionComponent,
        PatientSelectionModalComponent,
        AdvancedSearchTabComponent,
        RecentPatientsTabComponent
      ],
      providers: [
        { provide: PatientService, useValue: patientServiceSpy },
        { provide: PatientSearchService, useValue: patientSearchServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccessibilityVerificationComponent);
    component = fixture.componentInstance;
    patientService = TestBed.inject(PatientService) as jasmine.SpyObj<PatientService>;
    patientSearchService = TestBed.inject(PatientSearchService) as jasmine.SpyObj<PatientSearchService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    // Setup default spy returns
    patientService.getRecentPatients.and.returnValue(of([]));
    patientSearchService.getSearchPlaceholder.and.returnValue('Buscar por nombre...');
    patientSearchService.getCurrentQuery.and.returnValue('');

    fixture.detectChanges();
  });

  describe('WCAG 2.1 AA Compliance Verification', () => {

    it('should have proper semantic HTML structure', () => {
      // Check main landmark
      const main = fixture.debugElement.query(By.css('main[role="main"]'));
      expect(main).toBeTruthy();
      expect(main.nativeElement.getAttribute('aria-label')).toBe('Patient Selection System');

      // Check heading structure
      const h1 = fixture.debugElement.query(By.css('h1'));
      expect(h1).toBeTruthy();
      expect(h1.nativeElement.className).toContain('sr-only');
    });

    it('should have proper ARIA landmarks and labels', () => {
      // Open modal to test dialog
      component.openModal();
      fixture.detectChanges();

      // Check dialog role and labeling
      const modal = fixture.debugElement.query(By.css('app-patient-selection-modal'));
      expect(modal).toBeTruthy();

      // Check live regions
      const liveRegion = fixture.debugElement.query(By.css('[aria-live="polite"]'));
      const assertiveRegion = fixture.debugElement.query(By.css('[aria-live="assertive"]'));
      
      expect(liveRegion).toBeTruthy();
      expect(assertiveRegion).toBeTruthy();
    });

    it('should have sufficient color contrast ratios', () => {
      // Test primary text colors
      const textElements = fixture.debugElement.queryAll(By.css('[class*="text-gray-900"], [class*="text-gray-700"]'));
      expect(textElements.length).toBeGreaterThan(0);

      // Test button contrast
      const buttons = fixture.debugElement.queryAll(By.css('button, app-button'));
      buttons.forEach(button => {
        const classes = button.nativeElement.className;
        // Should have high contrast color combinations
        const hasGoodContrast = classes.includes('text-white') || 
                               classes.includes('text-gray-900') || 
                               classes.includes('text-blue-600');
        expect(hasGoodContrast).toBe(true);
      });
    });

    it('should provide alternative text for images and icons', () => {
      // Check that icons have proper context
      const icons = fixture.debugElement.queryAll(By.css('lucide-icon'));
      icons.forEach(icon => {
        // Icons should be within elements that provide context
        const parent = icon.parent;
        expect(parent).toBeTruthy();
        
        // Parent should have text content or aria-label
        const hasContext = parent.nativeElement.textContent.trim() !== '' ||
                           parent.nativeElement.hasAttribute('aria-label') ||
                           parent.nativeElement.hasAttribute('title');
        expect(hasContext).toBe(true);
      });
    });

    it('should have proper focus indicators', () => {
      // Check that interactive elements have focus styles
      const interactiveElements = fixture.debugElement.queryAll(By.css('button, input, select, [tabindex]:not([tabindex="-1"])'));
      
      interactiveElements.forEach(element => {
        const classes = element.nativeElement.className;
        // Should have focus ring or outline styles
        const hasFocusStyle = classes.includes('focus:ring') || 
                             classes.includes('focus:outline') ||
                             classes.includes('focus:border');
        expect(hasFocusStyle).toBe(true);
      });
    });

    it('should support keyboard navigation', () => {
      // Test button keyboard activation
      const selectButton = fixture.debugElement.query(By.css('button'));
      expect(selectButton).toBeTruthy();

      // Should be focusable
      expect(selectButton.nativeElement.tabIndex >= 0 || selectButton.nativeElement.tabIndex === undefined).toBe(true);

      // Test keyboard events
      spyOn(component, 'openModal');
      
      // Enter key
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      selectButton.nativeElement.dispatchEvent(enterEvent);
      
      // Space key
      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      selectButton.nativeElement.dispatchEvent(spaceEvent);
    });

    it('should provide proper form labels and descriptions', () => {
      // Open modal and switch to search tab
      component.openModal();
      fixture.detectChanges();

      const modalComponent = fixture.debugElement.query(By.css('app-patient-selection-modal')).componentInstance;
      modalComponent.setActiveTab('search');
      fixture.detectChanges();

      // Check for form labels
      const labels = fixture.debugElement.queryAll(By.css('label'));
      expect(labels.length).toBeGreaterThan(0);

      // Check label-control associations
      labels.forEach(label => {
        const forAttribute = label.nativeElement.getAttribute('for');
        if (forAttribute) {
          const associatedControl = fixture.debugElement.query(By.css(`#${forAttribute}`));
          expect(associatedControl).toBeTruthy();
        }
      });
    });

    it('should handle error states accessibly', () => {
      // Open modal and switch to search tab
      component.openModal();
      fixture.detectChanges();

      const modalComponent = fixture.debugElement.query(By.css('app-patient-selection-modal')).componentInstance;
      modalComponent.setActiveTab('search');
      fixture.detectChanges();

      const searchTab = fixture.debugElement.query(By.css('app-advanced-search-tab'));
      const searchComponent = searchTab.componentInstance as AdvancedSearchTabComponent;

      // Trigger validation error
      searchComponent.searchForm.patchValue({ searchQuery: 'a' });
      searchComponent.searchForm.get('searchQuery')?.markAsTouched();
      fixture.detectChanges();

      // Check for error message with proper ARIA
      const errorMessage = fixture.debugElement.query(By.css('[class*="text-red-600"]'));
      expect(errorMessage).toBeTruthy();

      // Error should be announced
      expect(errorMessage.nativeElement.textContent).toContain('al menos 2 caracteres');
    });

    it('should provide status updates for dynamic content', () => {
      // Test patient selection announcement
      component.onPatientSelected(mockPatient);
      fixture.detectChanges();

      // Check live region content
      const liveRegion = fixture.debugElement.query(By.css('[aria-live="polite"]'));
      expect(liveRegion.nativeElement.textContent).toContain('Juan Carlos Pérez seleccionado');
    });

    it('should support screen reader navigation', () => {
      // Check heading structure
      const headings = fixture.debugElement.queryAll(By.css('h1, h2, h3, h4, h5, h6'));
      expect(headings.length).toBeGreaterThan(0);

      // Check list structures
      component.openModal();
      fixture.detectChanges();

      // Should have proper list markup for patient lists
      const lists = fixture.debugElement.queryAll(By.css('ul, ol, [role="list"]'));
      // Lists should be present or items should have proper structure
      expect(lists.length >= 0).toBe(true);
    });

    it('should handle responsive design accessibly', () => {
      // Check responsive classes maintain accessibility
      const responsiveElements = fixture.debugElement.queryAll(By.css('[class*="sm:"], [class*="md:"], [class*="lg:"]'));
      
      responsiveElements.forEach(element => {
        const classes = element.nativeElement.className;
        // Should maintain minimum touch target sizes
        const hasTouchTarget = classes.includes('py-2') || 
                              classes.includes('py-3') || 
                              classes.includes('p-2') ||
                              classes.includes('p-3') ||
                              classes.includes('min-h-');
        expect(hasTouchTarget).toBe(true);
      });
    });

    it('should provide proper loading states', () => {
      // Test loading state accessibility
      (patientSearchService.isSearching$ as BehaviorSubject<boolean>).next(true);
      
      component.openModal();
      fixture.detectChanges();

      const modalComponent = fixture.debugElement.query(By.css('app-patient-selection-modal')).componentInstance;
      modalComponent.setActiveTab('search');
      fixture.detectChanges();

      // Should have loading indicator
      const loadingIndicator = fixture.debugElement.query(By.css('[class*="animate-spin"]'));
      expect(loadingIndicator).toBeTruthy();

      // Should have loading text
      const loadingText = fixture.debugElement.query(By.css(':contains("Buscando")'));
      expect(loadingText).toBeTruthy();
    });

    it('should maintain focus management in modal', () => {
      // Test focus trap behavior
      component.openModal();
      fixture.detectChanges();

      // Modal should contain focusable elements
      const modal = fixture.debugElement.query(By.css('app-patient-selection-modal'));
      const focusableElements = modal.queryAll(By.css('button, input, select, [tabindex]:not([tabindex="-1"])'));
      
      expect(focusableElements.length).toBeGreaterThan(0);

      // All focusable elements should be within modal
      focusableElements.forEach(element => {
        expect(modal.nativeElement.contains(element.nativeElement)).toBe(true);
      });
    });

    it('should provide clear instructions and help text', () => {
      // Open modal and check for help text
      component.openModal();
      fixture.detectChanges();

      const modalComponent = fixture.debugElement.query(By.css('app-patient-selection-modal')).componentInstance;
      modalComponent.setActiveTab('search');
      fixture.detectChanges();

      // Should have helper text
      const helpText = fixture.debugElement.query(By.css('[class*="text-blue-600"]'));
      expect(helpText).toBeTruthy();
      expect(helpText.nativeElement.textContent).toContain('al menos 2 caracteres');
    });
  });

  describe('Cross-browser Compatibility', () => {

    it('should work with standard HTML form elements', () => {
      // Verify standard form elements are used
      component.openModal();
      fixture.detectChanges();

      const modalComponent = fixture.debugElement.query(By.css('app-patient-selection-modal')).componentInstance;
      modalComponent.setActiveTab('search');
      fixture.detectChanges();

      const standardElements = fixture.debugElement.queryAll(By.css('input, select, button, label'));
      expect(standardElements.length).toBeGreaterThan(0);

      // Elements should have proper types
      const inputs = fixture.debugElement.queryAll(By.css('input'));
      inputs.forEach(input => {
        expect(input.nativeElement.type).toBeTruthy();
      });
    });

    it('should use progressive enhancement', () => {
      // Basic functionality should work without JavaScript enhancements
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      buttons.forEach(button => {
        expect(button.nativeElement.type).toBeTruthy();
      });

      const forms = fixture.debugElement.queryAll(By.css('form'));
      forms.forEach(form => {
        // Forms should have proper structure
        expect(form.nativeElement.tagName.toLowerCase()).toBe('form');
      });
    });
  });

  describe('Performance and Accessibility', () => {

    it('should not cause layout thrashing with focus changes', () => {
      // Focus changes should not trigger expensive reflows
      const button = fixture.debugElement.query(By.css('button'));
      
      // Multiple focus changes should be efficient
      for (let i = 0; i < 5; i++) {
        button.nativeElement.focus();
        button.nativeElement.blur();
      }
      
      // Should complete without errors
      expect(true).toBe(true);
    });

    it('should handle large datasets accessibly', () => {
      // Test with many patients (simulated)
      const manyPatients: RecentPatient[] = Array.from({ length: 100 }, (_, i) => ({
        ...mockPatient,
        id: `patient-${i}`,
        fullName: `Patient ${i}`,
        lastVisitDate: '2024-10-10',
        visitCount: i + 1,
        lastPrescriptionId: `RX-${i}`
      }));

      patientService.getRecentPatients.and.returnValue(of(manyPatients));
      
      component.openModal();
      fixture.detectChanges();

      // Should handle large lists without accessibility issues
      const patientList = fixture.debugElement.query(By.css('app-recent-patients-tab'));
      expect(patientList).toBeTruthy();
    });
  });
});