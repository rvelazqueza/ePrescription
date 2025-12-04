import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Service for managing pharmacy inventory
 * Integrates with backend API /api/inventory
 */
@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/api/inventory`;

  constructor(private http: HttpClient) {}

  /**
   * Get inventory by pharmacy ID
   */
  getByPharmacy(pharmacyId: string): Observable<InventoryListDto[]> {
    return this.http.get<InventoryListDto[]>(`${this.apiUrl}/pharmacy/${pharmacyId}`);
  }

  /**
   * Get inventory item by ID
   */
  getById(id: string): Observable<InventoryDto> {
    return this.http.get<InventoryDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Add stock to inventory
   */
  addStock(data: AddStockDto): Observable<InventoryDto> {
    return this.http.post<InventoryDto>(`${this.apiUrl}/add-stock`, data);
  }

  /**
   * Adjust stock in inventory
   */
  adjustStock(data: AdjustStockDto): Observable<InventoryDto> {
    return this.http.post<InventoryDto>(`${this.apiUrl}/adjust-stock`, data);
  }

  /**
   * Get low stock alerts for a pharmacy
   */
  getLowStockAlerts(pharmacyId: string): Observable<LowStockAlertDto[]> {
    return this.http.get<LowStockAlertDto[]>(`${this.apiUrl}/alerts/low-stock/${pharmacyId}`);
  }

  /**
   * Get expiring stock alerts for a pharmacy
   */
  getExpiringStockAlerts(pharmacyId: string): Observable<ExpiringStockAlertDto[]> {
    return this.http.get<ExpiringStockAlertDto[]>(`${this.apiUrl}/alerts/expiring/${pharmacyId}`);
  }

  /**
   * Search inventory with filters
   */
  search(filters: InventorySearchDto): Observable<InventoryListDto[]> {
    let params = new HttpParams();
    
    if (filters.pharmacyId) {
      params = params.set('pharmacyId', filters.pharmacyId);
    }
    if (filters.medicationId) {
      params = params.set('medicationId', filters.medicationId);
    }
    if (filters.batchNumber) {
      params = params.set('batchNumber', filters.batchNumber);
    }
    if (filters.isExpired !== undefined) {
      params = params.set('isExpired', filters.isExpired.toString());
    }
    if (filters.isLowStock !== undefined) {
      params = params.set('isLowStock', filters.isLowStock.toString());
    }
    if (filters.daysUntilExpiration) {
      params = params.set('daysUntilExpiration', filters.daysUntilExpiration.toString());
    }
    if (filters.pageNumber) {
      params = params.set('pageNumber', filters.pageNumber.toString());
    }
    if (filters.pageSize) {
      params = params.set('pageSize', filters.pageSize.toString());
    }

    return this.http.get<InventoryListDto[]>(`${this.apiUrl}/search`, { params });
  }

  // Temporary methods for backward compatibility with existing components
  getStockAdjustments(): Observable<any[]> {
    return of([]);
  }

  getAlerts(): Observable<any[]> {
    return of([]);
  }

  getInventoryItems(filters?: any): Observable<any[]> {
    return of([]);
  }

  getExpiringBatches(): Observable<any[]> {
    return of([]);
  }

  getStockItems(): Observable<any[]> {
    return of([]);
  }

  getBatches(): Observable<any[]> {
    return of([]);
  }

  getInventoryQueries(): Observable<any[]> {
    return of([]);
  }
}

// DTOs matching backend structure
export interface AddStockDto {
  pharmacyId: string;
  medicationId: string;
  batchNumber: string;
  quantity: number;
  expirationDate: Date;
  unitCost?: number;
}

export interface AdjustStockDto {
  inventoryId: string;
  quantityAdjustment: number;
  reason: string;
}

export interface InventoryDto {
  id: string;
  pharmacyId: string;
  medicationId: string;
  batchNumber: string;
  quantityAvailable: number;
  expirationDate: Date;
  unitCost?: number;
  createdAt: Date;
  updatedAt?: Date;
  pharmacy: PharmacyInventorySummaryDto;
  medication: MedicationInventorySummaryDto;
  isExpired: boolean;
  isLowStock: boolean;
  daysUntilExpiration: number;
}

export interface InventoryListDto {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  medicationId: string;
  medicationName: string;
  batchNumber: string;
  quantityAvailable: number;
  expirationDate: Date;
  unitCost?: number;
  isExpired: boolean;
  isLowStock: boolean;
  daysUntilExpiration: number;
  createdAt: Date;
}

export interface LowStockAlertDto {
  inventoryId: string;
  pharmacyId: string;
  pharmacyName: string;
  medicationId: string;
  medicationName: string;
  currentQuantity: number;
  minimumStockLevel: number;
  deficit: number;
  alertLevel: string;
  lastRestockDate?: Date;
}

export interface ExpiringStockAlertDto {
  inventoryId: string;
  pharmacyId: string;
  pharmacyName: string;
  medicationId: string;
  medicationName: string;
  batchNumber: string;
  quantityAvailable: number;
  expirationDate: Date;
  daysUntilExpiration: number;
  alertLevel: string;
}

export interface PharmacyInventorySummaryDto {
  id: string;
  pharmacyName: string;
  licenseNumber?: string;
}

export interface MedicationInventorySummaryDto {
  id: string;
  commercialName: string;
  genericName: string;
  presentation?: string;
}

export interface InventorySearchDto {
  pharmacyId?: string;
  medicationId?: string;
  batchNumber?: string;
  isExpired?: boolean;
  isLowStock?: boolean;
  daysUntilExpiration?: number;
  pageNumber?: number;
  pageSize?: number;
}


