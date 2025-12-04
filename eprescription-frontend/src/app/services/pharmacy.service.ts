import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Service for managing pharmacies
 * Integrates with backend API /api/pharmacies
 */
@Injectable({
  providedIn: 'root'
})
export class PharmacyService {
  private apiUrl = `${environment.apiUrl}/api/pharmacies`;

  constructor(private http: HttpClient) {}

  /**
   * Get all pharmacies
   */
  getAll(): Observable<PharmacyDto[]> {
    return this.http.get<PharmacyDto[]>(this.apiUrl);
  }

  /**
   * Get pharmacy by ID
   */
  getById(id: string): Observable<PharmacyDto> {
    return this.http.get<PharmacyDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new pharmacy
   */
  create(pharmacy: CreatePharmacyDto): Observable<PharmacyDto> {
    return this.http.post<PharmacyDto>(this.apiUrl, pharmacy);
  }

  /**
   * Update pharmacy
   */
  update(id: string, pharmacy: UpdatePharmacyDto): Observable<PharmacyDto> {
    return this.http.put<PharmacyDto>(`${this.apiUrl}/${id}`, pharmacy);
  }

  /**
   * Delete pharmacy
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Search pharmacies with filters
   */
  search(filters: PharmacySearchFilters): Observable<PharmacyListDto[]> {
    let params = new HttpParams();
    
    if (filters.name) {
      params = params.set('name', filters.name);
    }
    if (filters.city) {
      params = params.set('city', filters.city);
    }
    if (filters.state) {
      params = params.set('state', filters.state);
    }
    if (filters.licenseNumber) {
      params = params.set('licenseNumber', filters.licenseNumber);
    }
    if (filters.isActive !== undefined) {
      params = params.set('isActive', filters.isActive.toString());
    }
    if (filters.pageNumber) {
      params = params.set('pageNumber', filters.pageNumber.toString());
    }
    if (filters.pageSize) {
      params = params.set('pageSize', filters.pageSize.toString());
    }

    return this.http.get<PharmacyListDto[]>(`${this.apiUrl}/search`, { params });
  }

  // Alias methods for backward compatibility with existing components
  // These methods map between the old Pharmacy interface and new PharmacyDto
  getPharmacies(): Observable<any[]> {
    return this.getAll();
  }

  createPharmacy(pharmacy: any): Observable<any> {
    return this.create(pharmacy);
  }

  updatePharmacy(id: string, pharmacy: any): Observable<any> {
    return this.update(id, pharmacy);
  }
}

// DTOs matching backend structure
export interface CreatePharmacyDto {
  licenseNumber: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
}

export interface UpdatePharmacyDto {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
}

export interface PharmacyDto {
  id: string;
  licenseNumber: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  fullAddress: string;
}

export interface PharmacyListDto {
  id: string;
  licenseNumber: string;
  name: string;
  city: string;
  state: string;
  phone: string;
  isActive: boolean;
}

export interface PharmacySearchFilters {
  name?: string;
  city?: string;
  state?: string;
  licenseNumber?: string;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
}
