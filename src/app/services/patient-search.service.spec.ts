import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PatientSearchService } from './patient-search.service';
import { PatientService } from './patient.service';
import { PatientSearchResult } from '../interfaces/patient.interface';

describe('PatientSearchService - Real-time Search', () => {
  let service: PatientSearchService;
  let patientServiceSpy: jasmine.SpyObj<PatientService>;

  const mockSearchResult: PatientSearchResult = {
    patients: [
      {
        id: '1',
        fullName: 'Test Patient',
        firstName: 'Test',
        firstLastName: 'Patient',
        idType: 'CC',
        idNumber: '12345678',
        birthDate: '1990-01-01',
        age: 34,
        gender: 'M',
        phone: '1234567890',
        country: 'Colombia',
        allergies: [],
        chronicConditions: [],
        currentMedications: [],
        registrationDate: '2024-01-01',
        status: 'active'
      }
    ],
    totalCount: 1,
    hasMore: false
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('PatientService', ['searchPatients']);

    TestBed.configureTestingModule({
      providers: [
        PatientSearchService,
        { provide: PatientService, useValue: spy }
      ]
    });

    service = TestBed.inject(PatientSearchService);
    patientServiceSpy = TestBed.inject(PatientService) as jasmine.SpyObj<PatientService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle search query changes with debouncing', (done) => {
    patientServiceSpy.searchPatients.and.returnValue(of(mockSearchResult));

    // Subscribe to search results
    service.searchResults$.subscribe(result => {
      if (result.patients.length > 0) {
        expect(result).toEqual(mockSearchResult);
        expect(patientServiceSpy.searchPatients).toHaveBeenCalledWith('test', 'name');
        done();
      }
    });

    // Set search query
    service.setSearchQuery('test');
  });

  it('should handle search criteria changes', (done) => {
    patientServiceSpy.searchPatients.and.returnValue(of(mockSearchResult));

    // Set search criteria first
    service.setSearchCriteria('idNumber');
    
    // Subscribe to search results
    service.searchResults$.subscribe(result => {
      if (result.patients.length > 0) {
        expect(patientServiceSpy.searchPatients).toHaveBeenCalledWith('12345', 'idNumber');
        done();
      }
    });

    // Set search query
    service.setSearchQuery('12345');
  });

  it('should handle search errors gracefully', (done) => {
    const errorMessage = 'Search failed';
    patientServiceSpy.searchPatients.and.returnValue(throwError(() => new Error(errorMessage)));

    // Subscribe to error state
    service.searchError$.subscribe(error => {
      if (error) {
        expect(error).toBe(errorMessage);
        done();
      }
    });

    // Trigger search that will fail
    service.setSearchQuery('test');
  });

  it('should clear search and reset state', () => {
    service.setSearchQuery('test');
    service.clearSearch();

    expect(service.getCurrentQuery()).toBe('');
    expect(service.getCurrentError()).toBeNull();
  });

  it('should validate search queries correctly', () => {
    expect(service.isValidQuery('')).toBeFalse();
    expect(service.isValidQuery('a')).toBeFalse();
    expect(service.isValidQuery('ab')).toBeTrue();
    expect(service.isValidQuery('test')).toBeTrue();
  });

  it('should provide appropriate validation messages', () => {
    expect(service.getValidationMessage('')).toBe('Ingrese un término de búsqueda');
    expect(service.getValidationMessage('a')).toBe('Ingrese al menos 2 caracteres para buscar');
    expect(service.getValidationMessage('test')).toBe('');
  });

  it('should return empty results for queries less than 2 characters', (done) => {
    service.searchResults$.subscribe(result => {
      expect(result.patients.length).toBe(0);
      expect(result.totalCount).toBe(0);
      done();
    });

    service.setSearchQuery('a');
  });

  it('should manage loading state correctly', (done) => {
    patientServiceSpy.searchPatients.and.returnValue(of(mockSearchResult));
    
    let loadingStates: boolean[] = [];
    
    service.isSearching$.subscribe(isSearching => {
      loadingStates.push(isSearching);
      
      // After we get false (search completed), check the states
      if (loadingStates.length >= 2 && !isSearching) {
        expect(loadingStates).toContain(true);  // Should have been true during search
        expect(loadingStates[loadingStates.length - 1]).toBeFalse(); // Should be false at the end
        done();
      }
    });

    service.setSearchQuery('test');
  });

  it('should reset service to initial state', () => {
    service.setSearchQuery('test');
    service.setSearchCriteria('phone');
    
    service.reset();
    
    expect(service.getCurrentQuery()).toBe('');
    expect(service.getCurrentCriteria()).toBe('name');
    expect(service.getCurrentError()).toBeNull();
  });
});