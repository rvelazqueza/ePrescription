import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Doctor, SearchFilters, SearchMode } from '../interfaces/doctor.interface';

@Injectable({
  providedIn: 'root'
})
export class DoctorSearchService {

  private searchFiltersSubject = new BehaviorSubject<SearchFilters>({
    quickSearch: '',
    nameFilter: '',
    specialtyFilter: '',
    statusFilter: 'all',
    certificationFilter: 'all',
    licenseFilter: '',
    universityFilter: '',
    minExperience: null,
    maxExperience: null
  });

  private searchModeSubject = new BehaviorSubject<SearchMode>({ mode: 'quick' });
  private doctorsSubject = new BehaviorSubject<Doctor[]>([]);
  private searchResultsCountSubject = new BehaviorSubject<number>(0);

  // Cached observables for performance
  searchFilters$ = this.searchFiltersSubject.asObservable().pipe(shareReplay(1));
  searchMode$ = this.searchModeSubject.asObservable().pipe(shareReplay(1));
  doctors$ = this.doctorsSubject.asObservable().pipe(shareReplay(1));
  searchResultsCount$ = this.searchResultsCountSubject.asObservable().pipe(shareReplay(1));

  // Cached filtered results
  private filteredDoctorsCache = new Map<string, Doctor[]>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    // Set up real-time filtering with debouncing
    this.setupRealTimeFiltering();
  }

  updateSearchFilters(filters: Partial<SearchFilters>): void {
    const currentFilters = this.searchFiltersSubject.value;
    this.searchFiltersSubject.next({ ...currentFilters, ...filters });
  }

  setDoctors(doctors: Doctor[]): void {
    this.doctorsSubject.next(doctors);
  }

  updateSearchMode(mode: SearchMode): void {
    this.searchModeSubject.next(mode);
  }

  clearFilters(): void {
    this.searchFiltersSubject.next({
      quickSearch: '',
      nameFilter: '',
      specialtyFilter: '',
      statusFilter: 'all',
      certificationFilter: 'all',
      licenseFilter: '',
      universityFilter: '',
      minExperience: null,
      maxExperience: null
    });
    // Clear cache when filters are cleared
    this.clearCache();
  }

  clearCache(): void {
    this.filteredDoctorsCache.clear();
  }

  filterDoctors(doctors: Doctor[]): Observable<Doctor[]> {
    return this.searchFilters$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(filters => this.applyFilters(doctors, filters))
    );
  }

  searchDoctorsRealTime(doctors: Doctor[], searchTerm: string): Doctor[] {
    if (!searchTerm.trim()) {
      return doctors;
    }

    const term = searchTerm.toLowerCase().trim();
    
    return doctors.filter(doctor => 
      doctor.fullName.toLowerCase().includes(term) ||
      doctor.firstName.toLowerCase().includes(term) ||
      doctor.lastName.toLowerCase().includes(term) ||
      doctor.specialty.toLowerCase().includes(term) ||
      doctor.subspecialties.some(sub => sub.toLowerCase().includes(term)) ||
      doctor.licenseNumber.toLowerCase().includes(term) ||
      doctor.email.toLowerCase().includes(term) ||
      doctor.phone.includes(term) ||
      doctor.university.toLowerCase().includes(term)
    );
  }

  private applyFilters(doctors: Doctor[], filters: SearchFilters): Doctor[] {
    if (!doctors || doctors.length === 0) {
      return [];
    }

    // Create cache key for memoization
    const cacheKey = JSON.stringify({ doctorsLength: doctors.length, filters });
    
    // Check cache first
    if (this.filteredDoctorsCache.has(cacheKey)) {
      return this.filteredDoctorsCache.get(cacheKey)!;
    }

    const filtered = doctors.filter(doctor => {
      // Quick search filter - if present, it takes precedence
      if (filters.quickSearch && filters.quickSearch.trim()) {
        return this.matchesQuickSearch(doctor, filters.quickSearch);
      }

      // Advanced filters - only apply if quick search is empty
      return this.matchesAdvancedFilters(doctor, filters);
    });

    // Cache the result
    this.filteredDoctorsCache.set(cacheKey, filtered);
    
    // Clean cache periodically
    setTimeout(() => {
      this.filteredDoctorsCache.delete(cacheKey);
    }, this.cacheTimeout);

    return filtered;
  }

  private matchesQuickSearch(doctor: Doctor, searchTerm: string): boolean {
    const term = searchTerm.toLowerCase().trim();
    
    return doctor.fullName.toLowerCase().includes(term) ||
           doctor.firstName.toLowerCase().includes(term) ||
           doctor.lastName.toLowerCase().includes(term) ||
           doctor.specialty.toLowerCase().includes(term) ||
           doctor.subspecialties.some(sub => sub.toLowerCase().includes(term)) ||
           doctor.licenseNumber.toLowerCase().includes(term) ||
           doctor.email.toLowerCase().includes(term) ||
           doctor.phone.includes(term) ||
           (doctor.officePhone && doctor.officePhone.includes(term)) ||
           doctor.university.toLowerCase().includes(term) ||
           doctor.city.toLowerCase().includes(term) ||
           doctor.country.toLowerCase().includes(term);
  }

  private matchesAdvancedFilters(doctor: Doctor, filters: SearchFilters): boolean {
    // Name filter
    if (filters.nameFilter && filters.nameFilter.trim() && 
        !doctor.fullName.toLowerCase().includes(filters.nameFilter.toLowerCase().trim())) {
      return false;
    }

    // Specialty filter - exact match or includes subspecialties
    if (filters.specialtyFilter && filters.specialtyFilter.trim()) {
      const specialtyMatch = doctor.specialty.toLowerCase() === filters.specialtyFilter.toLowerCase() ||
                           doctor.subspecialties.some(sub => 
                             sub.toLowerCase().includes(filters.specialtyFilter.toLowerCase())
                           );
      if (!specialtyMatch) {
        return false;
      }
    }

    // Status filter
    if (filters.statusFilter !== 'all' && doctor.status !== filters.statusFilter) {
      return false;
    }

    // Certification filter
    if (filters.certificationFilter !== 'all' && 
        doctor.certificationStatus !== filters.certificationFilter) {
      return false;
    }

    // License filter
    if (filters.licenseFilter && filters.licenseFilter.trim() && 
        !doctor.licenseNumber.toLowerCase().includes(filters.licenseFilter.toLowerCase().trim())) {
      return false;
    }

    // University filter
    if (filters.universityFilter && filters.universityFilter.trim() && 
        !doctor.university.toLowerCase().includes(filters.universityFilter.toLowerCase().trim())) {
      return false;
    }

    // Experience range filter
    if (filters.minExperience !== null && filters.minExperience >= 0 && 
        doctor.yearsOfExperience < filters.minExperience) {
      return false;
    }

    if (filters.maxExperience !== null && filters.maxExperience >= 0 && 
        doctor.yearsOfExperience > filters.maxExperience) {
      return false;
    }

    // Validate experience range logic
    if (filters.minExperience !== null && filters.maxExperience !== null && 
        filters.minExperience > filters.maxExperience) {
      return false;
    }

    return true;
  }

  getFilteredCount(doctors: Doctor[], filters: SearchFilters): number {
    return this.applyFilters(doctors, filters).length;
  }

  getUniqueSpecialties(doctors: Doctor[]): string[] {
    const specialties = new Set<string>();
    doctors.forEach(doctor => {
      specialties.add(doctor.specialty);
      doctor.subspecialties.forEach(sub => specialties.add(sub));
    });
    return Array.from(specialties).sort();
  }

  getUniqueUniversities(doctors: Doctor[]): string[] {
    const universities = new Set(doctors.map(doctor => doctor.university));
    return Array.from(universities).sort();
  }

  private setupRealTimeFiltering(): void {
    // Combine doctors and filters for real-time filtering with optimized debouncing
    combineLatest([
      this.doctors$,
      this.searchFilters$.pipe(
        debounceTime(150), // Reduced debounce time for better UX
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
    ]).pipe(
      map(([doctors, filters]) => this.applyFilters(doctors, filters)),
      tap(filteredDoctors => {
        this.searchResultsCountSubject.next(filteredDoctors.length);
      }),
      shareReplay(1) // Cache the latest result
    ).subscribe();
  }

  getFilteredDoctorsRealTime(): Observable<Doctor[]> {
    return combineLatest([
      this.doctors$,
      this.searchFilters$.pipe(
        debounceTime(150), // Optimized debounce time
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
    ]).pipe(
      map(([doctors, filters]) => this.applyFilters(doctors, filters)),
      shareReplay(1) // Cache for multiple subscribers
    );
  }

  searchWithCombinedFilters(doctors: Doctor[], filters: SearchFilters): Doctor[] {
    return this.applyFilters(doctors, filters);
  }

  getAdvancedSearchSuggestions(doctors: Doctor[], field: keyof Doctor): string[] {
    const suggestions = new Set<string>();
    
    doctors.forEach(doctor => {
      const value = doctor[field];
      if (typeof value === 'string' && value.trim()) {
        suggestions.add(value);
      } else if (Array.isArray(value)) {
        value.forEach(item => {
          if (typeof item === 'string' && item.trim()) {
            suggestions.add(item);
          }
        });
      }
    });
    
    return Array.from(suggestions).sort();
  }

  sortDoctors(doctors: Doctor[], sortBy: string, sortOrder: 'asc' | 'desc' = 'asc'): Doctor[] {
    return [...doctors].sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (sortBy) {
        case 'name':
          valueA = a.fullName.toLowerCase();
          valueB = b.fullName.toLowerCase();
          break;
        case 'specialty':
          valueA = a.specialty.toLowerCase();
          valueB = b.specialty.toLowerCase();
          break;
        case 'experience':
          valueA = a.yearsOfExperience;
          valueB = b.yearsOfExperience;
          break;
        case 'prescriptions':
          valueA = a.totalPrescriptions;
          valueB = b.totalPrescriptions;
          break;
        case 'lastActivity':
          valueA = new Date(a.lastActivity);
          valueB = new Date(b.lastActivity);
          break;
        default:
          return 0;
      }

      if (valueA < valueB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}