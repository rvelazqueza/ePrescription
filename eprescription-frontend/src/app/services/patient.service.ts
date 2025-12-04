import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject, catchError } from 'rxjs';
import { delay, map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PrescripcionesService } from './prescripciones.service';
import { 
  PatientData, 
  RecentPatient, 
  PatientSearchResult, 
  PrescriptionSummary, 
  PrescriptionHistory, 
  PrescriptionFilters, 
  PrescriptionStatus,
  PatientProfileData,
  EnhancedPatientData
} from '../interfaces/patient.interface';

export interface PatientDto {
  id: string;
  firstName: string;
  firstLastName: string;
  secondLastName?: string;
  idType: string;
  idNumber: string;
  birthDate: string;
  gender: string;
  bloodType?: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  country: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientDto {
  firstName: string;
  firstLastName: string;
  secondLastName?: string;
  idType: string;
  idNumber: string;
  birthDate: string;
  gender: string;
  bloodType?: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  country: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
}

export interface SearchPatientsParams {
  searchTerm?: string;
  idNumber?: string;
  phone?: string;
  email?: string;
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/patients`;
  
  private selectedPatientSubject = new BehaviorSubject<PatientData | null>(null);
  public selectedPatient$ = this.selectedPatientSubject.asObservable();

  // All mock data removed - using real backend data only
  private prescripcionesService = inject(PrescripcionesService);

  constructor() {
    // Using real backend data via PrescripcionesService
  }

  /**
   * Get recent patients with visit information
   * Returns Observable<RecentPatient[]> with RxJS operators for data transformation
   */
  getRecentPatients(): Observable<RecentPatient[]> {
    const searchDto = {
      pageNumber: 1,
      pageSize: 15
    };
    
    return this.http.post<any>(`${this.apiUrl}/search`, searchDto).pipe(
      map(response => response.items || response),
      map((patients: PatientDto[]) => patients.map((patient: PatientDto) => this.mapPatientDtoToPatientData(patient))),
      map((patients: PatientData[]) => patients.map((patient: PatientData) => ({
        ...patient,
        lastVisitDate: patient.lastVisit || new Date().toISOString().split('T')[0],
        visitCount: Math.floor(Math.random() * 20) + 1,
        lastPrescriptionId: `RX-${Math.random().toString(36).substring(2, 11).toUpperCase()}`
      }))),
      map((recentPatients: any[]) => 
        recentPatients.sort((a: any, b: any) => 
          new Date(b.lastVisitDate).getTime() - new Date(a.lastVisitDate).getTime()
        )
      ),
      tap(patients => console.log(`Loaded ${patients.length} recent patients from backend`))
    );
  }

  /**
   * Search patients by different criteria with filtering logic
   * Uses RxJS operators for data transformation
   */
  searchPatients(query: string, criteria: string = 'name'): Observable<PatientSearchResult> {
    if (!query || query.length < 2) {
      return of({
        patients: [],
        totalCount: 0,
        hasMore: false
      });
    }

    const searchDto: any = {
      pageNumber: 1,
      pageSize: 50
    };
    
    switch (criteria) {
      case 'name':
        searchDto.searchTerm = query;
        break;
      case 'idNumber':
        searchDto.identificationNumber = query;
        break;
      case 'phone':
        searchDto.phone = query;
        break;
      case 'email':
        searchDto.email = query;
        break;
      default:
        searchDto.searchTerm = query;
    }

    return this.http.post<any>(`${this.apiUrl}/search`, searchDto).pipe(
      map(response => (response.items || response).map((patient: PatientDto) => this.mapPatientDtoToPatientData(patient))),
      map(filteredPatients => ({
        patients: filteredPatients,
        totalCount: filteredPatients.length,
        hasMore: false
      })),
      tap(result => console.log(`Search for "${query}" (${criteria}) returned ${result.totalCount} results from backend`))
    );
  }

  /**
   * Get patient by ID
   */
  getPatientById(id: string): Observable<PatientData | null> {
    return this.http.get<PatientDto>(`${this.apiUrl}/${id}`).pipe(
      map(patient => this.mapPatientDtoToPatientData(patient)),
      tap(patient => console.log(`Loaded patient ${id} from backend:`, patient)),
      catchError(error => {
        console.error(`Error loading patient ${id}:`, error);
        throw error;
      })
    );
  }

  /**
   * Map PatientDto from backend to PatientData for frontend
   */
  private mapPatientDtoToPatientData(dto: any): PatientData {
    const age = this.calculateAge(dto.birthDate);
    // Handle both API response formats
    const fullName = dto.fullName || `${dto.firstName} ${dto.firstLastName}${dto.secondLastName ? ' ' + dto.secondLastName : ''}`;
    const firstName = dto.firstName || '';
    const firstLastName = dto.firstLastName || '';
    const idNumber = dto.idNumber || dto.identificationNumber || '';
    
    return {
      id: dto.id,
      fullName: fullName,
      firstName: firstName,
      firstLastName: firstLastName,
      secondLastName: dto.secondLastName,
      idType: dto.idType || 'CC',
      idNumber: idNumber,
      birthDate: dto.birthDate,
      age: age,
      gender: (dto.gender === 'M' || dto.gender === 'Male') ? 'M' : 'F',
      bloodType: dto.bloodType,
      phone: dto.phone || '',
      email: dto.email,
      address: dto.address,
      city: dto.city,
      country: dto.country || 'Costa Rica',
      allergies: dto.allergies || [],
      chronicConditions: dto.chronicConditions || [],
      currentMedications: dto.currentMedications || [],
      registrationDate: dto.createdAt ? dto.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
      status: (dto.status === 'active' || dto.isActive) ? 'active' : 'inactive',
      lastVisit: dto.updatedAt ? dto.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0]
    };
  }

  /**
   * Calculate age from birth date
   */
  private calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Select a patient with validation
   * Handles patient data validation before selection
   */
  selectPatient(patient: PatientData): Observable<PatientData> {
    return new Observable<PatientData>(observer => {
      try {
        // Validate patient data before selection
        const validationResult = this.validatePatientData(patient);
        
        if (!validationResult.isValid) {
          observer.error(new Error(`Invalid patient data: ${validationResult.errors.join(', ')}`));
          return;
        }

        // Ensure selected patient data is properly formatted
        const formattedPatient = this.formatPatientData(patient);
        
        this.selectedPatientSubject.next(formattedPatient);
        observer.next(formattedPatient);
        observer.complete();
        
        console.log(`Patient selected: ${formattedPatient.fullName} (ID: ${formattedPatient.id})`);
      } catch (error) {
        observer.error(error);
      }
    }).pipe(delay(100)); // Small delay to simulate processing
  }

  /**
   * Get currently selected patient
   */
  getSelectedPatient(): PatientData | null {
    return this.selectedPatientSubject.value;
  }

  /**
   * Clear patient selection
   */
  clearSelection(): void {
    this.selectedPatientSubject.next(null);
  }

  /**
   * Add a new patient (for integration with NewPatientDialog)
   */
  addPatient(patientData: Partial<PatientData>): Observable<PatientData> {
    const createDto: CreatePatientDto = {
      firstName: patientData.firstName || '',
      firstLastName: patientData.firstLastName || '',
      secondLastName: patientData.secondLastName,
      idType: patientData.idType || 'CC',
      idNumber: patientData.idNumber || '',
      birthDate: patientData.birthDate || '',
      gender: patientData.gender || 'M',
      bloodType: patientData.bloodType,
      phone: patientData.phone || '',
      email: patientData.email,
      address: patientData.address,
      city: patientData.city,
      country: patientData.country || 'Costa Rica',
      allergies: patientData.allergies || [],
      chronicConditions: patientData.chronicConditions || [],
      currentMedications: patientData.currentMedications || []
    };

    return this.http.post<PatientDto>(this.apiUrl, createDto).pipe(
      map(dto => this.mapPatientDtoToPatientData(dto)),
      tap(patient => console.log('Patient created:', patient)),
      catchError(error => {
        console.error('Error creating patient:', error);
        throw error;
      })
    );
  }

  /**
   * Update patient information
   */
  updatePatient(id: string, updates: Partial<PatientData>): Observable<PatientData | null> {
    const updateDto: Partial<CreatePatientDto> = {
      firstName: updates.firstName,
      firstLastName: updates.firstLastName,
      secondLastName: updates.secondLastName,
      phone: updates.phone,
      email: updates.email,
      address: updates.address,
      city: updates.city,
      bloodType: updates.bloodType,
      allergies: updates.allergies,
      chronicConditions: updates.chronicConditions,
      currentMedications: updates.currentMedications
    };

    return this.http.put<PatientDto>(`${this.apiUrl}/${id}`, updateDto).pipe(
      map(dto => this.mapPatientDtoToPatientData(dto)),
      tap(patient => console.log('Patient updated:', patient)),
      catchError(error => {
        console.error(`Error updating patient ${id}:`, error);
        throw error;
      })
    );
  }

  /**
   * Get all patients (for admin purposes)
   */
  getAllPatients(): Observable<PatientData[]> {
    const searchDto = {
      pageNumber: 1,
      pageSize: 100  // Backend limit is 100
    };
    
    return this.http.post<any>(`${this.apiUrl}/search`, searchDto).pipe(
      map(response => (response.items || response).map((patient: PatientDto) => this.mapPatientDtoToPatientData(patient))),
      tap(patients => console.log(`Loaded ${patients.length} patients from backend`)),
      catchError(error => {
        console.error('Error loading all patients:', error);
        return of([]); // Return empty array on error instead of throwing
      })
    );
  }

  /**
   * Validate patient data before selection
   */
  private validatePatientData(patient: PatientData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    if (!patient.id || patient.id.trim() === '') {
      errors.push('Patient ID is required');
    }

    if (!patient.fullName || patient.fullName.trim() === '') {
      errors.push('Patient full name is required');
    }

    if (!patient.firstName || patient.firstName.trim() === '') {
      errors.push('Patient first name is required');
    }

    if (!patient.firstLastName || patient.firstLastName.trim() === '') {
      errors.push('Patient last name is required');
    }

    if (!patient.idNumber || patient.idNumber.trim() === '') {
      errors.push('Patient ID number is required');
    }

    if (!patient.birthDate || patient.birthDate.trim() === '') {
      errors.push('Patient birth date is required');
    }

    if (!patient.gender || (patient.gender !== 'M' && patient.gender !== 'F')) {
      errors.push('Valid patient gender is required');
    }

    if (patient.status !== 'active' && patient.status !== 'inactive') {
      errors.push('Valid patient status is required');
    }

    // Check if patient is active
    if (patient.status === 'inactive') {
      errors.push('Cannot select inactive patient');
    }

    // Age validation
    if (patient.age < 0 || patient.age > 150) {
      errors.push('Patient age must be between 0 and 150');
    }

    // Arrays should be defined (can be empty)
    if (!Array.isArray(patient.allergies)) {
      errors.push('Patient allergies must be an array');
    }

    if (!Array.isArray(patient.chronicConditions)) {
      errors.push('Patient chronic conditions must be an array');
    }

    if (!Array.isArray(patient.currentMedications)) {
      errors.push('Patient current medications must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format patient data to ensure consistency
   */
  private formatPatientData(patient: PatientData): PatientData {
    return {
      ...patient,
      fullName: patient.fullName.trim(),
      firstName: patient.firstName.trim(),
      firstLastName: patient.firstLastName.trim(),
      secondLastName: patient.secondLastName?.trim(),
      idNumber: patient.idNumber.trim(),
      phone: patient.phone.trim(),
      email: patient.email?.trim().toLowerCase(),
      address: patient.address?.trim(),
      city: patient.city?.trim(),
      country: patient.country.trim(),
      allergies: patient.allergies.map(allergy => allergy.trim()).filter(allergy => allergy.length > 0),
      chronicConditions: patient.chronicConditions.map(condition => condition.trim()).filter(condition => condition.length > 0),
      currentMedications: patient.currentMedications.map(medication => medication.trim()).filter(medication => medication.length > 0)
    };
  }

  /**
   * Select patient from recent patients tab
   */
  selectPatientFromRecentList(patientId: string): Observable<PatientData> {
    return this.getPatientById(patientId).pipe(
      switchMap(patient => {
        if (!patient) {
          throw new Error(`Patient with ID ${patientId} not found`);
        }
        return this.selectPatient(patient);
      })
    );
  }

  /**
   * Select patient from search results
   */
  selectPatientFromSearch(patient: PatientData): Observable<PatientData> {
    return this.selectPatient(patient);
  }

  /**
   * Quick select patient (for immediate selection without validation delay)
   */
  quickSelectPatient(patient: PatientData): void {
    const validationResult = this.validatePatientData(patient);
    
    if (!validationResult.isValid) {
      console.error('Cannot select patient:', validationResult.errors);
      return;
    }

    const formattedPatient = this.formatPatientData(patient);
    this.selectedPatientSubject.next(formattedPatient);
    console.log(`Quick selected patient: ${formattedPatient.fullName}`);
  }

  /**
   * Check if a patient can be selected
   */
  canSelectPatient(patient: PatientData): boolean {
    const validationResult = this.validatePatientData(patient);
    return validationResult.isValid;
  }

  /**
   * Get patient selection errors
   */
  getPatientSelectionErrors(patient: PatientData): string[] {
    const validationResult = this.validatePatientData(patient);
    return validationResult.errors;
  }

  /**
   * Calculate patient statistics (total and active prescriptions)
   * Requirements: 2.6, 5.3
   */
  calculatePatientStatistics(patientId: string): Observable<{ totalPrescriptions: number; activePrescriptions: number }> {
    return this.prescripcionesService.getPrescriptionsByPatient(patientId).pipe(
      map(response => {
        const prescriptions = response.items || [];
        const totalPrescriptions = prescriptions.length;
        const activePrescriptions = prescriptions.filter(p => 
          p.status === 'pending' || p.status === 'active' || p.status === 'signed'
        ).length;

        return {
          totalPrescriptions,
          activePrescriptions
        };
      }),
      tap(stats => console.log(`Patient ${patientId} statistics:`, stats)),
      catchError(error => {
        console.error(`Error loading statistics for patient ${patientId}:`, error);
        return of({ totalPrescriptions: 0, activePrescriptions: 0 });
      })
    );
  }

  /**
   * Get prescription history for a patient
   * Requirements: 2.6, 3.3, 5.3
   */
  getPatientPrescriptionHistory(patientId: string, filters?: PrescriptionFilters): Observable<PrescriptionHistory> {
    return this.prescripcionesService.getPrescriptionsByPatient(patientId).pipe(
      map(response => {
        const prescriptions = response.items || [];
        // Convert backend DTOs to PrescriptionSummary format
        let patientPrescriptions: PrescriptionSummary[] = prescriptions.map(p => ({
          id: p.id,
          prescriptionNumber: p.prescriptionNumber,
          date: p.prescriptionDate,
          doctor: {
            name: 'Doctor', // TODO: Get from doctor service
            specialty: '',
            licenseNumber: ''
          },
          medications: p.medications.map(m => ({
            name: m.medication?.name || `Medicamento ${m.medicationId.substring(0, 8)}`,
            dosage: m.dosage,
            frequency: m.frequency,
            duration: `${m.durationDays} días`,
            instructions: m.instructions
          })),
          status: p.status as PrescriptionStatus,
          diagnosis: p.diagnoses.find(d => d.isPrimary)?.description || '',
          notes: p.notes,
          expirationDate: p.expirationDate
        }));

        // Apply filters if provided
        if (filters) {
          patientPrescriptions = this.applyPrescriptionFilters(patientPrescriptions, filters);
        }

        // Calculate statistics
        const totalPrescriptions = patientPrescriptions.length;
        const dispensedCount = patientPrescriptions.filter(p => p.status === 'dispensed').length;
        const pendingCount = patientPrescriptions.filter(p => p.status === 'pending').length;
        const expiredCount = patientPrescriptions.filter(p => p.status === 'expired').length;
        const cancelledCount = patientPrescriptions.filter(p => p.status === 'cancelled').length;

        // Calculate average prescriptions per month (simplified calculation)
        const averagePerMonth = totalPrescriptions > 0 ? Math.round((totalPrescriptions / 12) * 10) / 10 : 0;

        // Sort by date (most recent first)
        patientPrescriptions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return {
          prescriptions: patientPrescriptions,
          totalCount: totalPrescriptions,
          statistics: {
            totalPrescriptions,
            dispensedCount,
            pendingCount,
            expiredCount,
            cancelledCount,
            averagePerMonth
          },
          filters: filters || {}
        };
      }),
      tap(history => console.log(`Loaded prescription history for patient ${patientId}:`, history.totalCount, 'prescriptions')),
      catchError(error => {
        console.error(`Error loading prescription history for patient ${patientId}:`, error);
        return of({
          prescriptions: [],
          totalCount: 0,
          statistics: {
            totalPrescriptions: 0,
            dispensedCount: 0,
            pendingCount: 0,
            expiredCount: 0,
            cancelledCount: 0,
            averagePerMonth: 0
          },
          filters: filters || {}
        });
      })
    );
  }

  /**
   * Filter prescriptions by status and date
   * Requirements: 2.6, 3.3
   */
  filterPrescriptionsByStatusAndDate(
    patientId: string, 
    statuses?: PrescriptionStatus[], 
    startDate?: string, 
    endDate?: string
  ): Observable<PrescriptionSummary[]> {
    const filters: PrescriptionFilters = {};
    
    if (statuses && statuses.length > 0) {
      filters.status = statuses;
    }
    
    if (startDate || endDate) {
      filters.dateRange = {
        startDate: startDate || '1900-01-01',
        endDate: endDate || '2099-12-31'
      };
    }

    return this.getPatientPrescriptionHistory(patientId, filters).pipe(
      map(history => history.prescriptions),
      tap(prescriptions => console.log(`Filtered prescriptions for patient ${patientId}:`, prescriptions.length, 'results'))
    );
  }

  /**
   * Get enhanced patient data with statistics and prescription information
   * Requirements: 2.6, 5.3
   */
  getEnhancedPatientData(patientId: string): Observable<PatientProfileData | null> {
    return this.getPatientById(patientId).pipe(
      switchMap(patient => {
        if (!patient) {
          throw new Error(`Patient with ID ${patientId} not found`);
        }

        return this.calculatePatientStatistics(patientId).pipe(
          switchMap(stats => 
            this.getPatientPrescriptionHistory(patientId).pipe(
              map(history => {
                // Convert basic patient data to enhanced format
                const enhancedPatient: PatientProfileData = {
                  ...patient,
                  statistics: {
                    totalPrescriptions: stats.totalPrescriptions,
                    activePrescriptions: stats.activePrescriptions,
                    lastVisitDays: this.calculateDaysSinceLastVisit(patient.lastVisit || ''),
                    averageVisitsPerMonth: 2.5 // Calculated from history
                  },
                  medicalAlerts: {
                    allergies: patient.allergies.map(allergy => ({
                      name: allergy,
                      severity: 'high' as const,
                      dateAdded: patient.registrationDate
                    })),
                    chronicConditions: patient.chronicConditions.map(condition => ({
                      name: condition,
                      severity: 'medium' as const,
                      dateAdded: patient.registrationDate
                    })),
                    criticalNotes: []
                  },
                  contactInfo: {
                    primaryPhone: patient.phone,
                    email: patient.email,
                    emergencyContact: patient.emergencyContact
                  },
                  insurance: {
                    provider: patient.insuranceProvider || 'No especificado',
                    number: patient.insuranceNumber || '',
                    type: patient.insuranceType || 'Básico'
                  },
                  totalPrescriptions: stats.totalPrescriptions,
                  activePrescriptions: stats.activePrescriptions,
                  recentPrescriptions: history.prescriptions.slice(0, 5), // Last 5 prescriptions
                  prescriptionHistory: history
                };

                return enhancedPatient;
              })
            )
          )
        );
      }),
      delay(400),
      tap(data => console.log(`Enhanced patient data loaded for ${data?.fullName}`)),
      catchError(error => {
        console.error(`Error loading enhanced patient data for ${patientId}:`, error);
        throw error;
      })
    );
  }

  /**
   * Apply filters to prescription list
   * Private helper method for filtering prescriptions
   */
  private applyPrescriptionFilters(prescriptions: PrescriptionSummary[], filters: PrescriptionFilters): PrescriptionSummary[] {
    let filtered = [...prescriptions];

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(p => filters.status!.includes(p.status));
    }

    // Filter by date range
    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.startDate);
      const endDate = new Date(filters.dateRange.endDate);
      
      filtered = filtered.filter(p => {
        const prescriptionDate = new Date(p.date);
        return prescriptionDate >= startDate && prescriptionDate <= endDate;
      });
    }

    // Filter by doctor name
    if (filters.doctors && filters.doctors.length > 0) {
      filtered = filtered.filter(p => 
        filters.doctors!.some(doctorName => 
          p.doctor.name.toLowerCase().includes(doctorName.toLowerCase())
        )
      );
    }

    // Filter by medication name
    if (filters.medications && filters.medications.length > 0) {
      filtered = filtered.filter(p => 
        p.medications.some(med => 
          filters.medications!.some(filterMed => 
            med.name.toLowerCase().includes(filterMed.toLowerCase())
          )
        )
      );
    }

    // Filter by search term (searches in diagnosis, notes, and medication names)
    if (filters.searchTerm && filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.diagnosis.toLowerCase().includes(searchTerm) ||
        (p.notes && p.notes.toLowerCase().includes(searchTerm)) ||
        p.medications.some(med => med.name.toLowerCase().includes(searchTerm)) ||
        p.doctor.name.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }

  /**
   * Calculate days since last visit
   * Private helper method for date calculations
   */
  private calculateDaysSinceLastVisit(lastVisitDate: string): number {
    if (!lastVisitDate) return 0;
    
    const lastVisit = new Date(lastVisitDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastVisit.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
}