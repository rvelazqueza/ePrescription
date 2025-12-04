import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Prescripcion {
  id: string;
  fecha: string;
  paciente: {
    id: string;
    nombre: string;
    cedula: string;
  };
  medico: {
    id: string;
    nombre: string;
    especialidad: string;
  };
  medicamentos: Array<{
    id: string;
    nombre: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
  }>;
  estado: 'borrador' | 'firmada' | 'dispensada' | 'cancelada';
  observaciones?: string;
}

export interface CreatePrescriptionDto {
  patientId: string;
  doctorId: string;
  diagnoses: Array<{
    cie10Code: string;
    description: string;
    isPrimary: boolean;
  }>;
  medications: Array<{
    medicationId: string;
    dosage: string;
    frequency: string;
    duration: number;
    administrationRouteId: string;
    quantity: number;
    instructions?: string;
    aiSuggested?: boolean;
  }>;
  notes?: string;
}

export interface PrescriptionDto {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  patientIdNumber: string;
  patientAge: number;
  patientGender: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorLicenseNumber: string;
  prescriptionDate: string;
  expirationDate: string;
  status: string;
  diagnoses: Array<{
    cie10Code: string;
    description: string;
    isPrimary: boolean;
  }>;
  medications: Array<{
    id: string;
    medicationId: string;
    dosage: string;
    frequency: string;
    durationDays: number;
    administrationRouteId: string;
    quantity: number;
    instructions?: string;
    aiSuggested: boolean;
    medication?: {
      id: string;
      name: string;
      genericName?: string;
      presentation?: string;
      concentration?: string;
    };
    administrationRoute?: {
      id: string;
      name: string;
      description?: string;
    };
  }>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchPrescriptionsParams {
  patientId?: string;
  doctorId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface PaginatedPrescriptionResponse {
  items: PrescriptionDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PrescripcionesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/prescriptions`;
  
  private prescripcionesSubject = new BehaviorSubject<Prescripcion[]>([]);
  public prescripciones$ = this.prescripcionesSubject.asObservable();

  constructor() {}

  /**
   * Get all prescriptions with optional filters
   */
  getPrescripciones(params?: SearchPrescriptionsParams): Observable<PaginatedPrescriptionResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.patientId) httpParams = httpParams.set('patientId', params.patientId);
      if (params.doctorId) httpParams = httpParams.set('doctorId', params.doctorId);
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.startDate) httpParams = httpParams.set('startDate', params.startDate);
      if (params.endDate) httpParams = httpParams.set('endDate', params.endDate);
      if (params.pageNumber) httpParams = httpParams.set('page', params.pageNumber.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }

    return this.http.get<PaginatedPrescriptionResponse>(`${this.apiUrl}/search`, { params: httpParams }).pipe(
      tap(response => console.log(`Loaded ${response.items.length} prescriptions from backend (total: ${response.totalCount})`)),
      catchError(error => {
        console.error('Error loading prescriptions:', error);
        return of({ items: [], totalCount: 0, page: 1, pageSize: 10, totalPages: 0, hasNextPage: false, hasPreviousPage: false });
      })
    );
  }

  /**
   * Get prescription by ID
   */
  getPrescriptionById(id: string): Observable<PrescriptionDto> {
    return this.http.get<PrescriptionDto>(`${this.apiUrl}/${id}`).pipe(
      tap(prescription => console.log(`Loaded prescription ${id}:`, prescription)),
      catchError(error => {
        console.error(`Error loading prescription ${id}:`, error);
        throw error;
      })
    );
  }

  /**
   * Create new prescription
   */
  createPrescripcion(prescription: CreatePrescriptionDto): Observable<PrescriptionDto> {
    return this.http.post<PrescriptionDto>(this.apiUrl, prescription).pipe(
      tap(newPrescription => {
        console.log('Prescription created:', newPrescription);
      }),
      catchError(error => {
        console.error('Error creating prescription:', error);
        throw error;
      })
    );
  }

  /**
   * Update prescription
   */
  updatePrescripcion(id: string, updates: Partial<CreatePrescriptionDto>): Observable<PrescriptionDto> {
    return this.http.put<PrescriptionDto>(`${this.apiUrl}/${id}`, updates).pipe(
      tap(updated => {
        console.log('Prescription updated:', updated);
      }),
      catchError(error => {
        console.error(`Error updating prescription ${id}:`, error);
        throw error;
      })
    );
  }

  /**
   * Delete prescription
   */
  deletePrescripcion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        console.log(`Prescription ${id} deleted`);
      }),
      catchError(error => {
        console.error(`Error deleting prescription ${id}:`, error);
        throw error;
      })
    );
  }

  /**
   * Search prescriptions with filters
   */
  searchPrescriptions(params: SearchPrescriptionsParams): Observable<PaginatedPrescriptionResponse> {
    return this.getPrescripciones(params);
  }

  /**
   * Get prescriptions by patient ID
   */
  getPrescriptionsByPatient(patientId: string): Observable<PaginatedPrescriptionResponse> {
    return this.getPrescripciones({ patientId });
  }

  /**
   * Get prescriptions by doctor ID
   */
  getPrescriptionsByDoctor(doctorId: string): Observable<PaginatedPrescriptionResponse> {
    return this.getPrescripciones({ doctorId });
  }

  /**
   * Get prescription by QR code
   */
  getPrescriptionByQR(qrCode: string): Observable<PrescriptionDto> {
    return this.http.get<PrescriptionDto>(`${this.apiUrl}/qr/${qrCode}`).pipe(
      tap(prescription => console.log(`Loaded prescription by QR ${qrCode}:`, prescription)),
      catchError(error => {
        console.error(`Error loading prescription by QR ${qrCode}:`, error);
        throw error;
      })
    );
  }

  /**
   * Duplicate a prescription
   */
  duplicarPrescripcion(id: string): Observable<PrescriptionDto> {
    return this.http.post<PrescriptionDto>(`${this.apiUrl}/${id}/duplicate`, {}).pipe(
      tap(duplicated => {
        console.log(`Prescription ${id} duplicated:`, duplicated);
      }),
      catchError(error => {
        console.error(`Error duplicating prescription ${id}:`, error);
        throw error;
      })
    );
  }

  /**
   * Cancel a prescription
   */
  anularPrescripcion(id: string, reason?: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/cancel`, { reason }).pipe(
      tap(() => {
        console.log(`Prescription ${id} cancelled`);
      }),
      catchError(error => {
        console.error(`Error cancelling prescription ${id}:`, error);
        throw error;
      })
    );
  }

  /**
   * Delete a draft prescription
   */
  eliminarBorrador(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/draft`).pipe(
      tap(() => {
        console.log(`Draft prescription ${id} deleted`);
      }),
      catchError(error => {
        console.error(`Error deleting draft prescription ${id}:`, error);
        throw error;
      })
    );
  }
}