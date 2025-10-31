import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, startWith, catchError, tap } from 'rxjs/operators';
import { PatientService } from './patient.service';
import { PatientSearchResult, SearchCriteria, SearchFilters, PatientData } from '../interfaces/patient.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientSearchService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  private searchCriteriaSubject = new BehaviorSubject<SearchCriteria>('name');
  private isSearchingSubject = new BehaviorSubject<boolean>(false);
  private searchErrorSubject = new BehaviorSubject<string | null>(null);

  public searchQuery$ = this.searchQuerySubject.asObservable();
  public searchCriteria$ = this.searchCriteriaSubject.asObservable();
  public isSearching$ = this.isSearchingSubject.asObservable();
  public searchError$ = this.searchErrorSubject.asObservable();

  // Debounced search results
  public searchResults$: Observable<PatientSearchResult>;

  constructor(private patientService: PatientService) {
    // Set up reactive search with debouncing and distinct values
    this.searchResults$ = combineLatest([
      this.searchQuery$.pipe(
        debounceTime(300), // Wait 300ms after user stops typing
        distinctUntilChanged() // Only emit when the value actually changes
      ),
      this.searchCriteria$.pipe(
        distinctUntilChanged()
      )
    ]).pipe(
      switchMap(([query, criteria]) => {
        if (!query || query.length < 2) {
          this.isSearchingSubject.next(false);
          return new Observable<PatientSearchResult>(observer => {
            observer.next({
              patients: [],
              totalCount: 0,
              hasMore: false
            });
          });
        }

        this.isSearchingSubject.next(true);
        this.searchErrorSubject.next(null); // Clear previous errors
        
        return this.patientService.searchPatients(query, criteria).pipe(
          map(result => {
            this.isSearchingSubject.next(false);
            this.searchErrorSubject.next(null);
            return result;
          }),
          catchError(error => {
            this.isSearchingSubject.next(false);
            const errorMessage = this.getErrorMessage(error);
            this.searchErrorSubject.next(errorMessage);
            
            // Return empty result on error
            return of({
              patients: [],
              totalCount: 0,
              hasMore: false
            });
          })
        );
      }),
      startWith({
        patients: [],
        totalCount: 0,
        hasMore: false
      })
    );
  }

  /**
   * Update search query
   */
  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query.trim());
  }

  /**
   * Update search criteria
   */
  setSearchCriteria(criteria: SearchCriteria): void {
    this.searchCriteriaSubject.next(criteria);
  }

  /**
   * Get current search query
   */
  getCurrentQuery(): string {
    return this.searchQuerySubject.value;
  }

  /**
   * Get current search criteria
   */
  getCurrentCriteria(): SearchCriteria {
    return this.searchCriteriaSubject.value;
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchQuerySubject.next('');
    this.isSearchingSubject.next(false);
  }

  /**
   * Validate search query
   */
  isValidQuery(query: string): boolean {
    return query.trim().length >= 2;
  }

  /**
   * Get search validation message
   */
  getValidationMessage(query: string): string {
    if (!query || query.trim().length === 0) {
      return 'Ingrese un término de búsqueda';
    }
    if (query.trim().length < 2) {
      return 'Ingrese al menos 2 caracteres para buscar';
    }
    return '';
  }

  /**
   * Perform immediate search (without debouncing)
   */
  searchImmediate(query: string, criteria?: SearchCriteria): Observable<PatientSearchResult> {
    const searchCriteria = criteria || this.getCurrentCriteria();
    
    if (!this.isValidQuery(query)) {
      return new Observable<PatientSearchResult>(observer => {
        observer.next({
          patients: [],
          totalCount: 0,
          hasMore: false
        });
      });
    }

    this.isSearchingSubject.next(true);
    this.searchErrorSubject.next(null);
    
    return this.patientService.searchPatients(query, searchCriteria).pipe(
      map(result => {
        this.isSearchingSubject.next(false);
        this.searchErrorSubject.next(null);
        return result;
      }),
      catchError(error => {
        this.isSearchingSubject.next(false);
        const errorMessage = this.getErrorMessage(error);
        this.searchErrorSubject.next(errorMessage);
        
        return of({
          patients: [],
          totalCount: 0,
          hasMore: false
        });
      })
    );
  }

  /**
   * Get search filters configuration
   */
  getSearchFilters(): SearchFilters {
    return {
      criteria: this.getCurrentCriteria(),
      query: this.getCurrentQuery(),
      minLength: 2
    };
  }

  /**
   * Set search filters
   */
  setSearchFilters(filters: Partial<SearchFilters>): void {
    if (filters.criteria) {
      this.setSearchCriteria(filters.criteria);
    }
    if (filters.query !== undefined) {
      this.setSearchQuery(filters.query);
    }
  }

  /**
   * Get available search criteria options
   */
  getSearchCriteriaOptions(): Array<{value: SearchCriteria, label: string}> {
    return [
      { value: 'name', label: 'Nombre' },
      { value: 'idNumber', label: 'Número de Identificación' },
      { value: 'phone', label: 'Teléfono' },
      { value: 'email', label: 'Correo Electrónico' }
    ];
  }

  /**
   * Get placeholder text for search input based on criteria
   */
  getSearchPlaceholder(): string {
    const criteria = this.getCurrentCriteria();
    const placeholders = {
      name: 'Buscar por nombre del paciente...',
      idNumber: 'Buscar por número de identificación...',
      phone: 'Buscar por número de teléfono...',
      email: 'Buscar por correo electrónico...'
    };
    return placeholders[criteria] || 'Buscar paciente...';
  }

  /**
   * Reset search service to initial state
   */
  reset(): void {
    this.searchQuerySubject.next('');
    this.searchCriteriaSubject.next('name');
    this.isSearchingSubject.next(false);
    this.searchErrorSubject.next(null);
  }

  /**
   * Get error message from error object
   */
  private getErrorMessage(error: any): string {
    if (error?.message) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Error al buscar pacientes. Por favor, intente nuevamente.';
  }

  /**
   * Clear current search error
   */
  clearError(): void {
    this.searchErrorSubject.next(null);
  }

  /**
   * Get current search error
   */
  getCurrentError(): string | null {
    return this.searchErrorSubject.value;
  }

  /**
   * Check if there's currently an error
   */
  hasError(): boolean {
    return this.searchErrorSubject.value !== null;
  }

  /**
   * Select patient from search results with validation
   */
  selectPatientFromSearch(patient: PatientData): Observable<PatientData> {
    return this.patientService.selectPatientFromSearch(patient).pipe(
      tap(() => {
        // Clear search after successful selection
        this.clearSearch();
      }),
      catchError(error => {
        const errorMessage = this.getErrorMessage(error);
        this.searchErrorSubject.next(`Error selecting patient: ${errorMessage}`);
        throw error;
      })
    );
  }

  /**
   * Select patient from recent patients list
   */
  selectPatientFromRecentList(patientId: string): Observable<PatientData> {
    return this.patientService.selectPatientFromRecentList(patientId).pipe(
      catchError(error => {
        const errorMessage = this.getErrorMessage(error);
        this.searchErrorSubject.next(`Error selecting patient: ${errorMessage}`);
        throw error;
      })
    );
  }

  /**
   * Validate if patient can be selected
   */
  canSelectPatient(patient: PatientData): boolean {
    return this.patientService.canSelectPatient(patient);
  }

  /**
   * Get patient selection validation errors
   */
  getPatientSelectionErrors(patient: PatientData): string[] {
    return this.patientService.getPatientSelectionErrors(patient);
  }

  /**
   * Check if patient data is complete for selection
   */
  isPatientDataComplete(patient: PatientData): boolean {
    const requiredFields = ['id', 'fullName', 'firstName', 'firstLastName', 'idNumber', 'birthDate', 'gender'];
    return requiredFields.every(field => {
      const value = patient[field as keyof PatientData];
      return value !== undefined && value !== null && String(value).trim() !== '';
    });
  }

  /**
   * Get missing required fields for patient
   */
  getMissingRequiredFields(patient: PatientData): string[] {
    const requiredFields = [
      { key: 'id', label: 'ID' },
      { key: 'fullName', label: 'Nombre completo' },
      { key: 'firstName', label: 'Primer nombre' },
      { key: 'firstLastName', label: 'Primer apellido' },
      { key: 'idNumber', label: 'Número de identificación' },
      { key: 'birthDate', label: 'Fecha de nacimiento' },
      { key: 'gender', label: 'Género' }
    ];

    return requiredFields
      .filter(field => {
        const value = patient[field.key as keyof PatientData];
        return value === undefined || value === null || String(value).trim() === '';
      })
      .map(field => field.label);
  }
}