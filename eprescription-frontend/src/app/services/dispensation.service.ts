import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Service for managing medication dispensations
 * Integrates with backend API /api/dispensations
 */
@Injectable({
  providedIn: 'root'
})
export class DispensationService {
  private apiUrl = `${environment.apiUrl}/api/dispensations`;

  constructor(private http: HttpClient) {}

  /**
   * Register a new dispensation
   */
  register(data: RegisterDispensationDto): Observable<DispensationDto> {
    return this.http.post<DispensationDto>(`${this.apiUrl}/register`, data);
  }

  /**
   * Verify a dispensation
   */
  verify(id: string, data: VerifyDispensationDto): Observable<DispensationDto> {
    return this.http.put<DispensationDto>(`${this.apiUrl}/${id}/verify`, data);
  }

  /**
   * Get dispensation by ID
   */
  getById(id: string): Observable<DispensationDto> {
    return this.http.get<DispensationDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get dispensations by prescription ID
   */
  getByPrescription(prescriptionId: string): Observable<DispensationListDto[]> {
    return this.http.get<DispensationListDto[]>(`${this.apiUrl}/prescription/${prescriptionId}`);
  }

  /**
   * Get dispensations by pharmacy ID
   */
  getByPharmacy(pharmacyId: string): Observable<DispensationListDto[]> {
    return this.http.get<DispensationListDto[]>(`${this.apiUrl}/pharmacy/${pharmacyId}`);
  }

  /**
   * Search dispensations with filters
   */
  search(filters: DispensationSearchFilters): Observable<DispensationListDto[]> {
    let params = new HttpParams();
    
    if (filters.pharmacyId) {
      params = params.set('pharmacyId', filters.pharmacyId);
    }
    if (filters.prescriptionId) {
      params = params.set('prescriptionId', filters.prescriptionId);
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate.toISOString());
    }
    if (filters.endDate) {
      params = params.set('endDate', filters.endDate.toISOString());
    }
    if (filters.pageNumber) {
      params = params.set('pageNumber', filters.pageNumber.toString());
    }
    if (filters.pageSize) {
      params = params.set('pageSize', filters.pageSize.toString());
    }

    return this.http.get<DispensationListDto[]>(`${this.apiUrl}/search`, { params });
  }
}

// DTOs matching backend structure
export interface RegisterDispensationDto {
  prescriptionId: string;
  pharmacyId: string;
  pharmacistId?: string;
  notes?: string;
  items: RegisterDispensationItemDto[];
}

export interface RegisterDispensationItemDto {
  prescriptionMedicationId: string;
  inventoryId: string;
  quantityDispensed: number;
  batchNumber?: string;
  expirationDate?: Date;
}

export interface VerifyDispensationDto {
  dispensationId: string;
  status: string; // pending, verified, completed, rejected
  notes?: string;
}

export interface DispensationDto {
  id: string;
  prescriptionId: string;
  pharmacyId: string;
  pharmacistId?: string;
  dispensationDate: Date;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
  prescription: PrescriptionSummaryDto;
  pharmacy: PharmacySummaryDto;
  pharmacist?: UserSummaryDto;
  items: DispensationItemDto[];
}

export interface DispensationItemDto {
  id: string;
  dispensationId: string;
  prescriptionMedicationId: string;
  inventoryId: string;
  quantityDispensed: number;
  batchNumber?: string;
  expirationDate?: Date;
  createdAt: Date;
  prescriptionMedication: PrescriptionMedicationSummaryDto;
  inventory: InventorySummaryDto;
}

export interface DispensationListDto {
  id: string;
  prescriptionId: string;
  prescriptionNumber: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacistId?: string;
  pharmacistUsername?: string;
  dispensationDate: Date;
  status: string;
  itemsCount: number;
  createdAt: Date;
}

export interface PrescriptionSummaryDto {
  id: string;
  prescriptionNumber: string;
  prescriptionDate: Date;
  status: string;
  patientName?: string;
  doctorName?: string;
}

export interface PharmacySummaryDto {
  id: string;
  pharmacyName: string;
  licenseNumber?: string;
  phone?: string;
}

export interface PrescriptionMedicationSummaryDto {
  id: string;
  medicationId: string;
  medicationName: string;
  quantity: number;
  dosage: string;
  frequency: string;
}

export interface InventorySummaryDto {
  id: string;
  medicationId: string;
  medicationName: string;
  batchNumber: string;
  quantityAvailable: number;
  expirationDate: Date;
}

export interface UserSummaryDto {
  id: string;
  username: string;
  email: string;
}

export interface DispensationSearchFilters {
  pharmacyId?: string;
  prescriptionId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  pageNumber?: number;
  pageSize?: number;
}
