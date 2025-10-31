import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Building, Plus, Search, Download, Eye, Edit, CheckCircle, XCircle, MapPin, DollarSign, Phone, Mail, Filter, Users, AlertCircle, ChevronLeft, ChevronRight, Trash2 } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { PharmacyMockService } from '../../../services/pharmacy-mock.service';
import { Pharmacy } from '../../../interfaces/pharmacy.interface';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';

import { PharmacyDetailModalComponent } from '../../../components/pharmacy-detail-modal/pharmacy-detail-modal.component';
import { PharmacyFormModalComponent } from '../../../components/pharmacy-form-modal/pharmacy-form-modal.component';
import { 
  provinciasCostaRica, 
  getCantonesByProvincia, 
  getDistritosByCanton,
  getFullLocation,
  Provincia,
  Canton,
  Distrito
} from '../../../utils/costa-rica-data';

/**
 * ⚠️ COMPONENTE DEPRECATED - NO SE USA EN LA APLICACIÓN
 * 
 * La vista real de farmacias está en:
 * - Archivo: src/app/pages/inventario/farmacias/farmacias.component.ts
 * - URL: http://localhost:4200/inventario/farmacias
 * 
 * Este componente se mantiene solo por compatibilidad pero NO se usa.
 */
@Component({
  selector: 'app-farmacias-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, BreadcrumbsComponent, PharmacyDetailModalComponent, PharmacyFormModalComponent],
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class FarmaciasListaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Icons
  buildingIcon = Building;
  plusIcon = Plus;
  searchIcon = Search;
  downloadIcon = Download;
  eyeIcon = Eye;
  editIcon = Edit;
  checkCircleIcon = CheckCircle;
  xCircleIcon = XCircle;
  mapPinIcon = MapPin;
  dollarSignIcon = DollarSign;
  phoneIcon = Phone;
  mailIcon = Mail;
  filterIcon = Filter;
  usersIcon = Users;
  alertCircleIcon = AlertCircle;
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;
  trashIcon = Trash2;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Farmacias'}
  ];

  // Geographic data
  provincias = provinciasCostaRica;

  // Filter properties
  searchTerm = '';
  selectedProvince = '';
  selectedStatus = '';

  // Data
  pharmacies: Pharmacy[] = [];
  filteredPharmacies: Pharmacy[] = [];

  // Modal states
  showDetailModal = false;
  showFormModal = false;
  isEditMode = false;
  selectedPharmacy: Pharmacy | null = null;

  // Loading and pagination
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 10;
  paginatedPharmacies: Pharmacy[] = [];

  constructor(private pharmacyService: PharmacyMockService) {}

  ngOnInit(): void {
    console.log('⚠️ COMPONENTE DEPRECATED - NO SE USA EN LA APLICACIÓN');
    console.log('✅ La vista real de farmacias está en: /inventario/farmacias');
    console.log('📁 Archivo: src/app/pages/inventario/farmacias/farmacias.component.ts');
    this.loadPharmacies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPharmacies(): void {
    this.isLoading = true;
    this.pharmacyService.getPharmacies()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pharmacies => {
        this.pharmacies = pharmacies;
        this.applyFilters();
        this.isLoading = false;
      });
  }

  applyFilters(): void {
    this.filteredPharmacies = this.pharmacies.filter(pharmacy => {
      const matchesSearch = this.searchTerm === '' || 
        this.normalizeText(pharmacy.codigo).includes(this.normalizeText(this.searchTerm)) ||
        this.normalizeText(pharmacy.nombre).includes(this.normalizeText(this.searchTerm)) ||
        this.normalizeText(pharmacy.direccionEspecifica).includes(this.normalizeText(this.searchTerm)) ||
        this.normalizeText(pharmacy.telefono).includes(this.normalizeText(this.searchTerm)) ||
        this.normalizeText(pharmacy.email).includes(this.normalizeText(this.searchTerm)) ||
        this.normalizeText(pharmacy.responsable).includes(this.normalizeText(this.searchTerm));

      const matchesProvince = this.selectedProvince === '' || pharmacy.provinciaId === this.selectedProvince;
      const matchesStatus = this.selectedStatus === '' || pharmacy.estado === this.selectedStatus;

      return matchesSearch && matchesProvince && matchesStatus;
    });
    
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPharmacies = this.filteredPharmacies.slice(startIndex, endIndex);
  }

  private normalizeText(text: string): string {
    return text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onProvinceChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  getTotalPharmacies(): number {
    return this.pharmacies.length;
  }

  getActivePharmacies(): number {
    return this.pharmacies.filter(p => p.estado === 'activa').length;
  }

  getInactivePharmacies(): number {
    return this.pharmacies.filter(p => p.estado === 'inactiva').length;
  }

  getSuspendedPharmacies(): number {
    return this.pharmacies.filter(p => p.estado === 'suspendida').length;
  }

  getProvinceCount(): number {
    const provinces = new Set(this.pharmacies.map(p => p.provinciaId));
    return provinces.size;
  }

  getStatusClass(estado: string): string {
    const classes = {
      'activa': 'bg-green-100 text-green-700 border-green-300',
      'inactiva': 'bg-gray-100 text-gray-700 border-gray-300',
      'suspendida': 'bg-red-100 text-red-700 border-red-300'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-700 border-gray-300';
  }

  getStatusLabel(estado: string): string {
    const labels = {
      'activa': 'Activa',
      'inactiva': 'Inactiva',
      'suspendida': 'Suspendida'
    };
    return labels[estado as keyof typeof labels] || 'Desconocido';
  }

  getFullLocationForPharmacy(pharmacy: Pharmacy): string {
    return getFullLocation(pharmacy.provinciaId, pharmacy.cantonId, pharmacy.distritoId);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  openNewPharmacyModal(): void {
    this.selectedPharmacy = null;
    this.isEditMode = false;
    this.showFormModal = true;
  }

  viewPharmacyDetails(pharmacy: Pharmacy): void {
    this.selectedPharmacy = pharmacy;
    this.showDetailModal = true;
  }

  editPharmacy(pharmacy: Pharmacy): void {
    this.selectedPharmacy = pharmacy;
    this.isEditMode = true;
    this.showFormModal = true;
  }

  onCloseDetailModal(): void {
    this.showDetailModal = false;
    this.selectedPharmacy = null;
  }

  onCloseFormModal(): void {
    this.showFormModal = false;
    this.selectedPharmacy = null;
    this.isEditMode = false;
  }

  onEditFromDetail(pharmacy: Pharmacy): void {
    this.showDetailModal = false;
    this.editPharmacy(pharmacy);
  }

  onSavePharmacy(formData: any): void {
    if (this.isEditMode && this.selectedPharmacy) {
      // Update existing pharmacy
      this.pharmacyService.updatePharmacy(this.selectedPharmacy.id, {
        ...formData,
        fechaRegistro: this.selectedPharmacy.fechaRegistro
      }).pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadPharmacies();
        this.onCloseFormModal();
        // TODO: Show success message
        console.log('Farmacia actualizada exitosamente');
      });
    } else {
      // Create new pharmacy
      this.pharmacyService.createPharmacy({
        ...formData,
        fechaRegistro: new Date().toISOString().split('T')[0]
      }).pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadPharmacies();
        this.onCloseFormModal();
        // TODO: Show success message
        console.log('Farmacia registrada exitosamente');
      });
    }
  }

  exportPharmacies(): void {
    const exportData = this.filteredPharmacies.map(pharmacy => ({
      'Código': pharmacy.codigo,
      'Nombre': pharmacy.nombre,
      'Ubicación': this.getFullLocationForPharmacy(pharmacy),
      'Dirección': pharmacy.direccionEspecifica,
      'Teléfono': pharmacy.telefono,
      'Email': pharmacy.email,
      'Responsable': pharmacy.responsable,
      'Estado': pharmacy.estado,
      'Fecha Registro': pharmacy.fechaRegistro
    }));

    // TODO: Implement actual export functionality
    console.log('Exportar farmacias:', exportData);
  }

  deletePharmacy(pharmacy: Pharmacy): void {
    if (confirm(`¿Está seguro de eliminar la farmacia ${pharmacy.nombre}?`)) {
      // TODO: Implement delete functionality
      console.log('Eliminar farmacia:', pharmacy);
    }
  }

  hasActiveFilters(): boolean {
    return this.searchTerm !== '' || this.selectedProvince !== '' || this.selectedStatus !== '';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedProvince = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  getStatusBadgeClass(estado: string): string {
    const classes = {
      'activa': 'bg-green-100 text-green-800 border-green-200',
      'inactiva': 'bg-gray-100 text-gray-800 border-gray-200',
      'suspendida': 'bg-red-100 text-red-800 border-red-200'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  getStatusDotClass(estado: string): string {
    const classes = {
      'activa': 'bg-green-400',
      'inactiva': 'bg-gray-400',
      'suspendida': 'bg-red-400'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-400';
  }

  // Pagination methods
  get totalPages(): number {
    return Math.ceil(this.filteredPharmacies.length / this.itemsPerPage);
  }

  hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  previousPage(): void {
    if (this.hasPreviousPage()) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getVisiblePages(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const visiblePages: number[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          visiblePages.push(i);
        }
        visiblePages.push(-1); // Ellipsis
        visiblePages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        visiblePages.push(1);
        visiblePages.push(-1); // Ellipsis
        for (let i = totalPages - 4; i <= totalPages; i++) {
          visiblePages.push(i);
        }
      } else {
        visiblePages.push(1);
        visiblePages.push(-1); // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          visiblePages.push(i);
        }
        visiblePages.push(-1); // Ellipsis
        visiblePages.push(totalPages);
      }
    }

    return visiblePages;
  }

  onItemsPerPageChange(event: any): void {
    this.itemsPerPage = parseInt(event.target.value);
    this.currentPage = 1;
    this.updatePagination();
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.filteredPharmacies.length);
  }

  // Utility methods for enhanced functionality
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  isRecentPharmacy(dateString: string): boolean {
    const pharmacyDate = new Date(dateString);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return pharmacyDate >= thirtyDaysAgo;
  }

  getStatusDescription(estado: string): string {
    switch (estado) {
      case 'activa':
        return 'Farmacia activa y operativa';
      case 'inactiva':
        return 'Farmacia temporalmente inactiva';
      case 'suspendida':
        return 'Farmacia suspendida por autoridades';
      default:
        return 'Estado de farmacia desconocido';
    }
  }

  // TrackBy functions for performance
  trackByPharmacyId(index: number, item: Pharmacy): string {
    return item.id;
  }
}