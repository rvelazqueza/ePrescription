import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Search, AlertTriangle, Info, Pill, User, Phone, Mail, FileText, Loader2 } from 'lucide-angular';
import { Observable, Subscription } from 'rxjs';

import { ButtonComponent } from '../ui/button/button.component';
import { ErrorMessageComponent } from '../ui/error-message/error-message.component';
import { PatientSearchService } from '../../services/patient-search.service';
import { PatientData as InterfacePatientData, PatientSearchResult, SearchCriteria } from '../../interfaces/patient.interface';

@Component({
  selector: 'app-advanced-search-tab',
  standalone: true,
  styleUrls: ['./advanced-search-tab.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    ButtonComponent,
    ErrorMessageComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Search Form -->
      <form [formGroup]="searchForm" class="space-y-4">
        <!-- Search Form Container -->
        <div class="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
          <!-- Search Criteria Dropdown -->
          <div class="space-y-2 mb-3 sm:mb-4">
            <label for="searchCriteria" class="block text-xs sm:text-sm font-semibold text-gray-700">
              Buscar por:
            </label>
            <select
              id="searchCriteria"
              formControlName="searchCriteria"
              class="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-white text-sm sm:text-base"
            >
              <option *ngFor="let option of searchCriteriaOptions" [value]="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Search Input -->
          <div class="space-y-2">
            <label for="searchQuery" class="block text-xs sm:text-sm font-semibold text-gray-700">
              Término de búsqueda:
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <lucide-icon [img]="searchIcon" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"></lucide-icon>
              </div>
              <input
                id="searchQuery"
                type="text"
                formControlName="searchQuery"
                [placeholder]="getSearchPlaceholder()"
                class="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-white text-sm sm:text-base"
                [class.border-red-300]="searchForm.get('searchQuery')?.invalid && searchForm.get('searchQuery')?.touched"
                [class.focus:ring-red-200]="searchForm.get('searchQuery')?.invalid && searchForm.get('searchQuery')?.touched"
                [class.focus:border-red-500]="searchForm.get('searchQuery')?.invalid && searchForm.get('searchQuery')?.touched"
              />
              <!-- Loading indicator -->
              <div *ngIf="isSearching$ | async" class="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center">
                <lucide-icon [img]="loaderIcon" class="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 animate-spin"></lucide-icon>
              </div>
            </div>
            
            <!-- Validation Messages -->
            <div *ngIf="searchForm.get('searchQuery')?.invalid && searchForm.get('searchQuery')?.touched" class="flex items-start gap-2 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
              <lucide-icon [img]="alertIcon" class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5"></lucide-icon>
              <div>
                <div *ngIf="searchForm.get('searchQuery')?.errors?.['required']">
                  El término de búsqueda es requerido
                </div>
                <div *ngIf="searchForm.get('searchQuery')?.errors?.['minlength']">
                  Ingrese al menos 2 caracteres para buscar
                </div>
              </div>
            </div>
            
            <!-- Helper Text -->
            <div *ngIf="searchForm.get('searchQuery')?.valid || !searchForm.get('searchQuery')?.touched" class="flex items-start gap-2 text-xs sm:text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md p-2">
              <lucide-icon [img]="infoIcon" class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5"></lucide-icon>
              <span>Ingrese al menos 2 caracteres para iniciar la búsqueda</span>
            </div>
          </div>
        </div>
      </form>

      <!-- Search Results -->
      <div class="space-y-4">
        <!-- Loading State -->
        <div *ngIf="isSearching$ | async" class="text-center py-8">
          <lucide-icon [img]="loaderIcon" class="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin"></lucide-icon>
          <p class="text-gray-500">Buscando pacientes...</p>
        </div>

        <!-- Error State -->
        <app-error-message
          *ngIf="(searchError$ | async) as error"
          [message]="error"
          title="Error en la búsqueda"
          type="error"
          actionText="Intentar nuevamente"
          [actionHandler]="retrySearch.bind(this)"
          [dismissible]="true"
        ></app-error-message>

        <!-- Search Results -->
        <div *ngIf="!(isSearching$ | async) && !(searchError$ | async) && (searchResults$ | async) as results">
          <!-- Results Found -->
          <div *ngIf="results.patients.length > 0" class="space-y-3">
            <div class="text-sm text-gray-600 mb-4">
              {{ results.totalCount }} paciente{{ results.totalCount !== 1 ? 's' : '' }} encontrado{{ results.totalCount !== 1 ? 's' : '' }}
              <span *ngIf="results.hasMore" class="text-blue-600">(mostrando primeros {{ results.patients.length }})</span>
            </div>
            
            <div 
              *ngFor="let patient of results.patients; trackBy: trackByPatientId"
              class="bg-white border border-gray-200 rounded-lg p-3 sm:p-5 hover:shadow-lg hover:border-green-200 transition-all duration-200 cursor-pointer group"
            >
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <!-- Patient Info -->
                <div class="flex-1 min-w-0">
                  <!-- Patient Header -->
                  <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors duration-200">
                      <lucide-icon [img]="userIcon" class="w-4 h-4 sm:w-5 sm:h-5 text-green-600"></lucide-icon>
                    </div>
                    <div class="min-w-0 flex-1">
                      <h3 class="text-base sm:text-lg font-semibold text-gray-900 truncate group-hover:text-green-900 transition-colors duration-200">
                        {{ patient.fullName }}
                      </h3>
                      <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1">
                        <span class="font-medium">{{ patient.idType }} {{ patient.idNumber }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Patient Details Grid -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm mb-3 sm:mb-4">
                    <div class="flex items-center gap-2 text-gray-600">
                      <div class="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span class="text-xs font-semibold text-gray-600">{{ patient.age }}</span>
                      </div>
                      <span class="truncate">{{ patient.age }} años • {{ patient.gender === 'M' ? 'M' : 'F' }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600" *ngIf="patient.phone">
                      <lucide-icon [img]="phoneIcon" class="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0"></lucide-icon>
                      <span class="truncate">{{ patient.phone }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600" *ngIf="patient.email">
                      <lucide-icon [img]="mailIcon" class="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0"></lucide-icon>
                      <span class="truncate">{{ patient.email }}</span>
                    </div>
                  </div>

                  <!-- Medical Alerts Indicators -->
                  <div class="flex flex-wrap gap-1 sm:gap-2" *ngIf="hasAnyAlerts(patient)">
                    <!-- Allergies Indicator -->
                    <div 
                      *ngIf="patient.allergies.length > 0"
                      class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-full text-xs font-medium shadow-sm"
                    >
                      <lucide-icon [img]="alertIcon" class="w-2.5 h-2.5 sm:w-3 sm:h-3"></lucide-icon>
                      <span>{{ patient.allergies.length }} alergia{{ patient.allergies.length !== 1 ? 's' : '' }}</span>
                    </div>

                    <!-- Chronic Conditions Indicator -->
                    <div 
                      *ngIf="patient.chronicConditions.length > 0"
                      class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-orange-50 border border-orange-200 text-orange-700 rounded-full text-xs font-medium shadow-sm"
                    >
                      <lucide-icon [img]="infoIcon" class="w-2.5 h-2.5 sm:w-3 sm:h-3"></lucide-icon>
                      <span>{{ patient.chronicConditions.length }} condición{{ patient.chronicConditions.length !== 1 ? 'es' : '' }}</span>
                    </div>

                    <!-- Current Medications Indicator -->
                    <div 
                      *ngIf="patient.currentMedications.length > 0"
                      class="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-medium shadow-sm"
                    >
                      <lucide-icon [img]="pillIcon" class="w-2.5 h-2.5 sm:w-3 sm:h-3"></lucide-icon>
                      <span>{{ patient.currentMedications.length }} medicamento{{ patient.currentMedications.length !== 1 ? 's' : '' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Select Button -->
                <div class="flex-shrink-0 w-full sm:w-auto">
                  <app-button 
                    variant="default" 
                    size="sm"
                    (click)="selectPatient(patient)"
                    class="bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 px-3 sm:px-4 py-2 font-medium shadow-sm hover:shadow-md w-full sm:w-auto text-sm whitespace-nowrap"
                  >
                    Seleccionar
                  </app-button>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results Found -->
          <div *ngIf="results.patients.length === 0 && hasSearched" class="text-center py-8">
            <lucide-icon [img]="searchIcon" class="w-12 h-12 text-gray-400 mx-auto mb-4"></lucide-icon>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron pacientes</h3>
            <p class="text-gray-500 mb-4">
              No hay pacientes que coincidan con "{{ currentSearchQuery }}"
            </p>
            <div class="text-sm text-gray-400">
              <p>Sugerencias:</p>
              <ul class="mt-2 space-y-1">
                <li>• Verifique la ortografía del término de búsqueda</li>
                <li>• Intente con un criterio de búsqueda diferente</li>
                <li>• Use menos caracteres o términos más generales</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Initial State -->
        <div *ngIf="!(isSearching$ | async) && !hasSearched" class="text-center py-8">
          <lucide-icon [img]="searchIcon" class="w-12 h-12 text-gray-400 mx-auto mb-4"></lucide-icon>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Búsqueda Avanzada</h3>
          <p class="text-gray-500">
            Seleccione un criterio de búsqueda e ingrese al menos 2 caracteres para encontrar pacientes
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdvancedSearchTabComponent implements OnInit, OnDestroy {
  @Output() patientSelected = new EventEmitter<InterfacePatientData>();

  searchForm!: FormGroup;
  searchResults$: Observable<PatientSearchResult>;
  isSearching$: Observable<boolean>;
  searchError$: Observable<string | null>;
  
  hasSearched = false;
  currentSearchQuery = '';
  
  private subscriptions = new Subscription();

  // Search criteria options
  searchCriteriaOptions = [
    { value: 'name' as SearchCriteria, label: 'Nombre' },
    { value: 'idNumber' as SearchCriteria, label: 'Número de Identificación' },
    { value: 'phone' as SearchCriteria, label: 'Teléfono' },
    { value: 'email' as SearchCriteria, label: 'Correo Electrónico' }
  ];

  // Icons
  searchIcon = Search;
  alertIcon = AlertTriangle;
  infoIcon = Info;
  pillIcon = Pill;
  userIcon = User;
  phoneIcon = Phone;
  mailIcon = Mail;
  fileIcon = FileText;
  loaderIcon = Loader2;

  constructor(
    private fb: FormBuilder,
    private patientSearchService: PatientSearchService
  ) {
    this.initializeForm();
    this.searchResults$ = this.patientSearchService.searchResults$;
    this.isSearching$ = this.patientSearchService.isSearching$;
    this.searchError$ = this.patientSearchService.searchError$;
  }

  ngOnInit() {
    this.setupFormSubscriptions();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    // Reset search service when component is destroyed
    this.patientSearchService.reset();
  }

  private initializeForm() {
    this.searchForm = this.fb.group({
      searchCriteria: ['name', [Validators.required]],
      searchQuery: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  private setupFormSubscriptions() {
    // Subscribe to search criteria changes
    const criteriaSubscription = this.searchForm.get('searchCriteria')?.valueChanges.subscribe({
      next: (criteria: SearchCriteria) => {
        this.patientSearchService.setSearchCriteria(criteria);
        // Clear error when criteria changes
        this.patientSearchService.clearError();
      },
      error: (error) => {
        console.error('Error in criteria subscription:', error);
      }
    });
    if (criteriaSubscription) {
      this.subscriptions.add(criteriaSubscription);
    }

    // Subscribe to search query changes with error handling
    const querySubscription = this.searchForm.get('searchQuery')?.valueChanges.subscribe({
      next: (query: string) => {
        this.currentSearchQuery = query;
        
        // Clear error when user starts typing
        if (query !== this.patientSearchService.getCurrentQuery()) {
          this.patientSearchService.clearError();
        }
        
        if (query && query.length >= 2) {
          this.hasSearched = true;
          this.patientSearchService.setSearchQuery(query);
        } else if (query.length === 0) {
          this.hasSearched = false;
          this.patientSearchService.clearSearch();
        }
      },
      error: (error) => {
        console.error('Error in query subscription:', error);
      }
    });
    if (querySubscription) {
      this.subscriptions.add(querySubscription);
    }
  }

  getSearchPlaceholder(): string {
    return this.patientSearchService.getSearchPlaceholder();
  }

  selectPatient(patient: InterfacePatientData) {
    this.patientSelected.emit(patient);
  }

  trackByPatientId(_index: number, patient: InterfacePatientData): string {
    return patient.id;
  }

  hasAnyAlerts(patient: InterfacePatientData): boolean {
    return patient.allergies.length > 0 || 
           patient.chronicConditions.length > 0 || 
           patient.currentMedications.length > 0;
  }

  retrySearch(): void {
    const currentQuery = this.searchForm.get('searchQuery')?.value;
    if (currentQuery && currentQuery.length >= 2) {
      this.patientSearchService.clearError();
      this.patientSearchService.setSearchQuery(currentQuery);
    }
  }

  clearSearch(): void {
    this.searchForm.get('searchQuery')?.setValue('');
    this.hasSearched = false;
    this.currentSearchQuery = '';
    this.patientSearchService.clearSearch();
  }

  isSearchQueryValid(): boolean {
    const queryControl = this.searchForm.get('searchQuery');
    return queryControl ? queryControl.valid : false;
  }

  getSearchQueryError(): string {
    const queryControl = this.searchForm.get('searchQuery');
    if (queryControl?.errors && queryControl.touched) {
      if (queryControl.errors['required']) {
        return 'El término de búsqueda es requerido';
      }
      if (queryControl.errors['minlength']) {
        return 'Ingrese al menos 2 caracteres para buscar';
      }
    }
    return '';
  }
}