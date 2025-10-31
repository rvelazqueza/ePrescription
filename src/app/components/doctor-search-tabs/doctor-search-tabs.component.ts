import { Component, EventEmitter, Output, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { LucideAngularModule, Search, Filter, X, Info, AlertTriangle } from 'lucide-angular';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { DoctorSearchService } from '../../services/doctor-search.service';
import { Doctor } from '../../interfaces/doctor.interface';

export interface SearchFilters {
  quickSearch: string;
  nameFilter: string;
  specialtyFilter: string;
  statusFilter: 'all' | 'active' | 'inactive';
  certificationFilter: 'all' | 'verified' | 'expired' | 'pending';
  licenseFilter: string;
  universityFilter: string;
  minExperience: number | null;
  maxExperience: number | null;
}

@Component({
  selector: 'app-doctor-search-tabs',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-lg shadow border border-gray-200">
      <!-- Tab Headers -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex" role="tablist" aria-label="Opciones de búsqueda">
          <button
            *ngFor="let tab of tabs"
            (click)="activeTab = tab.id"
            class="w-1/2 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            [ngClass]="{
              'border-blue-500 text-blue-600 bg-blue-50': activeTab === tab.id,
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== tab.id
            }"
            role="tab"
            [attr.aria-selected]="activeTab === tab.id"
            [attr.aria-controls]="tab.id + '-panel'"
            [attr.id]="tab.id + '-tab'">
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
        <!-- Búsqueda Rápida -->
        <div *ngIf="activeTab === 'quick'" class="p-6" role="tabpanel" id="quick-panel" aria-labelledby="quick-tab">
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Búsqueda Rápida</h3>
              <p class="text-sm text-gray-600 mb-4">Busca por nombre del médico, número de licencia o especialidad</p>
            </div>
            
            <div class="flex gap-3">
              <div class="flex-1 relative">
                <label for="quick-search-input" class="sr-only">Búsqueda rápida de médicos</label>
                <lucide-icon 
                  [img]="searchIcon" 
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  [strokeWidth]="2"
                  aria-hidden="true">
                </lucide-icon>
                <input
                  id="quick-search-input"
                  type="text"
                  [(ngModel)]="quickSearchValue"
                  (input)="onQuickSearchInput()"
                  placeholder="Dr. Juan Pérez, LIC-12345, Cardiología..."
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-describedby="quick-search-help">
              </div>
              <button 
                (click)="onQuickSearch()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <lucide-icon [img]="searchIcon" class="w-4 h-4"></lucide-icon>
                Buscar
              </button>
              <button 
                (click)="clearQuickSearch()"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors"
              >
                Limpiar
              </button>
            </div>

            <!-- Consejos de búsqueda rápida -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start">
                <lucide-icon [img]="infoIcon" class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"></lucide-icon>
                <div>
                  <h4 class="text-sm font-medium text-blue-900 mb-1">Consejos de búsqueda</h4>
                  <ul class="text-sm text-blue-700 space-y-1">
                    <li>• Puedes buscar por nombre completo o parcial del médico (ej: "Dr. Juan Pérez")</li>
                    <li>• Ingresa el número de licencia médica (ej: "LIC-12345")</li>
                    <li>• Busca por especialidad médica (ej: "Cardiología", "Pediatría")</li>
                    <li>• También puedes buscar por email o número de teléfono</li>
                  </ul>
                </div>
              </div>
            </div>

            <div *ngIf="searchResultsCount !== null" class="text-sm text-gray-600">
              <span class="font-medium">{{ searchResultsCount }}</span> médicos encontrados
            </div>
          </div>
        </div>

        <!-- Búsqueda Avanzada -->
        <div *ngIf="activeTab === 'advanced'" class="p-6" [formGroup]="advancedForm" role="tabpanel" id="advanced-panel" aria-labelledby="advanced-tab">
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Búsqueda Avanzada</h3>
              <p class="text-sm text-gray-600 mb-4">Combina múltiples criterios para encontrar médicos específicos</p>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Médico</label>
                <input
                  type="text"
                  formControlName="nameFilter"
                  placeholder="Nombre completo del médico"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                <select
                  formControlName="specialtyFilter"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Todas las especialidades</option>
                  <option *ngFor="let specialty of getUniqueSpecialties()" [value]="specialty">
                    {{ specialty }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Estado del Médico</label>
                <select
                  formControlName="statusFilter"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">Todos los estados</option>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Estado de Certificación</label>
                <select
                  formControlName="certificationFilter"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">Todas las certificaciones</option>
                  <option value="verified">Verificado</option>
                  <option value="expired">Expirado</option>
                  <option value="pending">Pendiente</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Número de Licencia</label>
                <input
                  type="text"
                  formControlName="licenseFilter"
                  placeholder="LIC-12345"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Universidad</label>
                <input
                  type="text"
                  formControlName="universityFilter"
                  placeholder="Universidad de graduación"
                  class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              </div>
            </div>

            <!-- Experience Range -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Años de Experiencia</label>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    formControlName="minExperience"
                    placeholder="Mínimo"
                    min="0"
                    class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <input
                    type="number"
                    formControlName="maxExperience"
                    placeholder="Máximo"
                    min="0"
                    class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <button 
                (click)="applyAdvancedFilters()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <lucide-icon [img]="searchIcon" class="w-4 h-4"></lucide-icon>
                Buscar con filtros
              </button>
              <button 
                (click)="clearAdvancedFilters()"
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors"
              >
                Limpiar filtros
              </button>
            </div>

            <!-- Información sobre búsqueda avanzada -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start">
                <lucide-icon [img]="infoIcon" class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"></lucide-icon>
                <div>
                  <h4 class="text-sm font-medium text-blue-900 mb-1">¿Cómo usar el buscador?</h4>
                  <div class="text-sm text-blue-700 space-y-1">
                    <p><strong>Búsqueda rápida:</strong> Ideal para encontrar un médico específico cuando conoces su nombre, licencia o especialidad.</p>
                    <p><strong>Búsqueda avanzada:</strong> Combina múltiples criterios para búsquedas más específicas. Puedes filtrar por estado, certificación, universidad y años de experiencia.</p>
                    <p class="flex items-center gap-1 mt-2">
                      <lucide-icon [img]="alertTriangleIcon" class="w-3 h-3"></lucide-icon>
                      <strong>Tip:</strong> Haz doble clic en cualquier resultado para ver los detalles completos del médico.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="searchResultsCount !== null" class="text-sm text-gray-600">
              <span class="font-medium">{{ searchResultsCount }}</span> médicos encontrados con los filtros aplicados
            </div>
          </div>
        </div>
    </div>
  `,
  styles: []
})
export class DoctorSearchTabsComponent implements OnInit, OnDestroy {
  @Input() doctors: Doctor[] = [];
  @Output() filtersChanged = new EventEmitter<SearchFilters>();
  @Output() searchResultsCountChanged = new EventEmitter<number>();

  private destroy$ = new Subject<void>();
  private quickSearchSubject = new Subject<string>();

  activeTab: 'quick' | 'advanced' = 'quick';
  quickSearchValue = '';
  searchResultsCount: number | null = null;
  advancedForm: FormGroup;

  // Icons
  searchIcon = Search;
  filterIcon = Filter;
  xIcon = X;
  infoIcon = Info;
  alertTriangleIcon = AlertTriangle;

  tabs = [
    { id: 'quick' as const, label: 'Búsqueda Rápida', icon: Search },
    { id: 'advanced' as const, label: 'Búsqueda Avanzada', icon: Filter }
  ];

  constructor(
    private fb: FormBuilder,
    private doctorSearchService: DoctorSearchService
  ) {
    this.advancedForm = this.fb.group({
      nameFilter: [''],
      specialtyFilter: [''],
      statusFilter: ['all'],
      certificationFilter: ['all'],
      licenseFilter: [''],
      universityFilter: [''],
      minExperience: [null],
      maxExperience: [null]
    });
  }

  ngOnInit(): void {
    // Subscribe to form changes for real-time filtering with optimized debouncing
    this.advancedForm.valueChanges.pipe(
      debounceTime(150), // Reduced debounce for better UX
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.activeTab === 'advanced') {
        this.applyAdvancedFilters();
      }
    });

    // Subscribe to quick search with optimized debouncing
    this.quickSearchSubject.pipe(
      debounceTime(150), // Reduced debounce for better UX
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.onQuickSearch();
    });

    // Subscribe to search results count from service
    this.doctorSearchService.searchResultsCount$.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(count => {
      this.searchResultsCount = count;
      this.searchResultsCountChanged.emit(count);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.quickSearchSubject.complete();
  }

  onQuickSearchInput(): void {
    // Emit to subject for debounced processing
    this.quickSearchSubject.next(this.quickSearchValue);
  }

  onQuickSearch(): void {
    const filters: SearchFilters = {
      quickSearch: this.quickSearchValue,
      nameFilter: '',
      specialtyFilter: '',
      statusFilter: 'all',
      certificationFilter: 'all',
      licenseFilter: '',
      universityFilter: '',
      minExperience: null,
      maxExperience: null
    };
    
    // Update search service filters for real-time processing
    this.doctorSearchService.updateSearchFilters(filters);
    this.filtersChanged.emit(filters);
  }

  clearQuickSearch(): void {
    this.quickSearchValue = '';
    this.quickSearchSubject.next('');
  }

  applyAdvancedFilters(): void {
    const formValue = this.advancedForm.value;
    const filters: SearchFilters = {
      quickSearch: '',
      nameFilter: formValue.nameFilter || '',
      specialtyFilter: formValue.specialtyFilter || '',
      statusFilter: formValue.statusFilter || 'all',
      certificationFilter: formValue.certificationFilter || 'all',
      licenseFilter: formValue.licenseFilter || '',
      universityFilter: formValue.universityFilter || '',
      minExperience: formValue.minExperience,
      maxExperience: formValue.maxExperience
    };
    
    // Update search service filters for real-time processing
    this.doctorSearchService.updateSearchFilters(filters);
    this.filtersChanged.emit(filters);
  }

  clearAdvancedFilters(): void {
    this.advancedForm.reset({
      nameFilter: '',
      specialtyFilter: '',
      statusFilter: 'all',
      certificationFilter: 'all',
      licenseFilter: '',
      universityFilter: '',
      minExperience: null,
      maxExperience: null
    });
    
    // Clear search service filters
    this.doctorSearchService.clearFilters();
    this.applyAdvancedFilters();
  }

  updateSearchResultsCount(count: number): void {
    this.searchResultsCount = count;
  }

  getUniqueSpecialties(): string[] {
    return this.doctorSearchService.getUniqueSpecialties(this.doctors);
  }

  getUniqueUniversities(): string[] {
    return this.doctorSearchService.getUniqueUniversities(this.doctors);
  }
}