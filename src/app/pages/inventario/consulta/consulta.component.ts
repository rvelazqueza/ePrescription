import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Download, X, Building2, Package, AlertTriangle, Filter, Eye, CheckCircle, XCircle, TrendingUp, TrendingDown, MapPin, Phone, FileText } from 'lucide-angular';
import { Subject, takeUntil, Subscription } from 'rxjs';
import { InventoryQueryMockService } from '../../../services/inventory-query-mock.service';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { InventoryQuery } from '../../../interfaces/inventory.interface';
import { RoleDemoService } from '../../../services/role-demo.service';
import { getFullLocation } from '../../../utils/costa-rica-data';

interface StockLevel {
  id: string;
  label: string;
  value: string;
}

interface StatsCard {
  title: string;
  value: number;
  icon: any;
  color: string;
}

@Component({
  selector: 'app-consulta-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, BreadcrumbsComponent, RoleSuggestionModalComponent],
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaInventarioComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Icons
  searchIcon = Search;
  downloadIcon = Download;
  xIcon = X;
  building2Icon = Building2;
  packageIcon = Package;
  alertTriangleIcon = AlertTriangle;
  filterIcon = Filter;
  eyeIcon = Eye;
  checkCircleIcon = CheckCircle;
  xCircleIcon = XCircle;
  trendingUpIcon = TrendingUp;
  trendingDownIcon = TrendingDown;
  mapPinIcon = MapPin;
  phoneIcon = Phone;
  fileTextIcon = FileText;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inventario', route: '/inventario' },
    { label: 'Consulta de Inventario'}
  ];

  // Data properties
  searchTerm = '';
  selectedFarmacia = 'todas';
  selectedProvincia = 'todas';
  alertLevel = 'todos';
  showUppercase = false;
  
  // Inventory data
  inventoryQueries: InventoryQuery[] = [];
  filteredInventory: InventoryQuery[] = [];
  
  // Pagination
  currentPage = 1;
  pageSize = 15;
  totalPages = 1;
  paginatedData: InventoryQuery[] = [];

  // Stock levels for filtering
  stockLevels: StockLevel[] = [
    { id: 'todos', label: 'Todos los niveles', value: 'todos' },
    { id: 'critico', label: 'Stock crítico', value: 'critico' },
    { id: 'bajo', label: 'Stock bajo', value: 'bajo' },
    { id: 'normal', label: 'Stock normal', value: 'normal' }
  ];

  // Unique pharmacies for filter
  uniquePharmacies: { id: string; nombre: string; codigo: string; }[] = [];

  // Statistics
  statsCards: StatsCard[] = [];

  // Role suggestion modal
  showRoleSuggestionModal = signal(false);
  private roleSubscriptions = new Subscription();

  constructor(
    private inventoryQueryService: InventoryQueryMockService,
    private roleDemoService: RoleDemoService
  ) {}

  ngOnInit(): void {
    this.loadInventoryData();
    this.checkRoleSuggestion();
    this.subscribeToRoleChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.roleSubscriptions.unsubscribe();
  }

  private loadInventoryData(): void {
    this.inventoryQueryService.getInventoryQueries()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.inventoryQueries = data;
        this.extractUniquePharmacies();
        this.applyFilters();
        this.updateStatistics();
      });
  }

  private extractUniquePharmacies(): void {
    const pharmacyMap = new Map();
    this.inventoryQueries.forEach(item => {
      if (!pharmacyMap.has(item.farmaciaId)) {
        pharmacyMap.set(item.farmaciaId, {
          id: item.farmaciaId,
          nombre: item.farmaciaNombre,
          codigo: item.farmaciaCode
        });
      }
    });
    this.uniquePharmacies = Array.from(pharmacyMap.values());
  }

  private applyFilters(): void {
    this.filteredInventory = this.inventoryQueries.filter(item => {
      // Search term filter
      const searchMatch = !this.searchTerm.trim() || 
        this.normalizeText(item.medicamentoNombre).includes(this.normalizeText(this.searchTerm)) ||
        this.normalizeText(item.medicamentoCodigo).includes(this.normalizeText(this.searchTerm)) ||
        this.normalizeText(item.farmaciaNombre).includes(this.normalizeText(this.searchTerm)) ||
        this.normalizeText(item.farmaciaCode).includes(this.normalizeText(this.searchTerm)) ||
        this.normalizeText(item.direccionEspecifica).includes(this.normalizeText(this.searchTerm)) ||
        this.normalizeText(item.telefono).includes(this.normalizeText(this.searchTerm)) ||
        this.normalizeText(item.presentacion).includes(this.normalizeText(this.searchTerm)) ||
        this.normalizeText(getFullLocation(item.provinciaId, item.cantonId, item.distritoId)).includes(this.normalizeText(this.searchTerm));

      // Pharmacy filter
      const pharmacyMatch = this.selectedFarmacia === 'todas' || item.farmaciaId === this.selectedFarmacia;

      // Province filter
      const provinceMatch = this.selectedProvincia === 'todas' || item.provinciaId === this.selectedProvincia;

      // Alert level filter
      let alertMatch = true;
      if (this.alertLevel === 'critico') {
        alertMatch = item.stock < item.stockMinimo;
      } else if (this.alertLevel === 'bajo') {
        alertMatch = item.stock >= item.stockMinimo && item.stock < (item.stockMinimo * 1.5);
      } else if (this.alertLevel === 'normal') {
        alertMatch = item.stock >= (item.stockMinimo * 1.5);
      }

      return searchMatch && pharmacyMatch && provinceMatch && alertMatch;
    });

    this.updatePagination();
  }

  private normalizeText(text: string): string {
    return text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '');
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredInventory.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, Math.max(1, this.totalPages));
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredInventory.slice(startIndex, endIndex);
  }

  private updateStatistics(): void {
    const totalRecords = this.filteredInventory.length;
    const criticalStock = this.filteredInventory.filter(i => i.stock < i.stockMinimo).length;
    const lowStock = this.filteredInventory.filter(i => i.stock >= i.stockMinimo && i.stock < i.stockMinimo * 1.5).length;
    const normalStock = this.filteredInventory.filter(i => i.stock >= i.stockMinimo * 1.5).length;

    this.statsCards = [
      {
        title: 'Total Registros',
        value: totalRecords,
        icon: this.packageIcon,
        color: 'text-blue-600'
      },
      {
        title: 'Stock Crítico',
        value: criticalStock,
        icon: this.alertTriangleIcon,
        color: 'text-red-600'
      },
      {
        title: 'Stock Bajo',
        value: lowStock,
        icon: this.xCircleIcon,
        color: 'text-yellow-600'
      },
      {
        title: 'Stock Normal',
        value: normalStock,
        icon: this.checkCircleIcon,
        color: 'text-green-600'
      }
    ];
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
    this.updateStatistics();
  }

  onFarmaciaChange(): void {
    this.currentPage = 1;
    this.applyFilters();
    this.updateStatistics();
  }

  onAlertLevelChange(): void {
    this.currentPage = 1;
    this.applyFilters();
    this.updateStatistics();
  }

  toggleUppercase(): void {
    this.showUppercase = !this.showUppercase;
  }

  formatText(text: string): string {
    return this.showUppercase ? text.toUpperCase() : text;
  }

  getStockBadge(item: InventoryQuery): { class: string; label: string; icon: any } {
    if (item.stock < item.stockMinimo) {
      return {
        class: 'status-critical',
        label: 'Crítico',
        icon: this.alertTriangleIcon
      };
    } else if (item.stock < item.stockMinimo * 1.5) {
      return {
        class: 'status-low',
        label: 'Bajo',
        icon: this.xCircleIcon
      };
    } else {
      return {
        class: 'status-adequate',
        label: 'Normal',
        icon: this.checkCircleIcon
      };
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  changePageSize(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.updatePagination();
  }

  getFullLocation(provinciaId: string, cantonId: string, distritoId: string): string {
    return getFullLocation(provinciaId, cantonId, distritoId);
  }

  trackByItemId(index: number, item: InventoryQuery): string {
    return item.id;
  }

  exportReport(): void {
    const exportData = this.paginatedData.map(item => ({
      'Código Medicamento': item.medicamentoCodigo,
      'Nombre Medicamento': item.medicamentoNombre,
      'Presentación': item.presentacion,
      'Código Farmacia': item.farmaciaCode,
      'Nombre Farmacia': item.farmaciaNombre,
      'Ubicación': getFullLocation(item.provinciaId, item.cantonId, item.distritoId),
      'Dirección': item.direccionEspecifica,
      'Teléfono': item.telefono,
      'Stock Actual': item.stock,
      'Stock Mínimo': item.stockMinimo,
      'Lote': item.lote,
      'Vencimiento': item.fechaVencimiento,
      'Última Actualización': item.ultimaActualizacion
    }));

    // Convert to CSV
    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventario_farmacias_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Role suggestion methods
  private checkRoleSuggestion(): void {
    const currentSession = this.roleDemoService.getCurrentSession();
    console.log('🔧 ConsultaInventario - checkRoleSuggestion - currentRole:', currentSession.activeRole);
    
    if (currentSession.activeRole !== 'Farmacéutico' && 
        currentSession.activeRole !== 'Administrador') {
      console.log('🔧 ConsultaInventario - Showing role suggestion modal for role:', currentSession.activeRole);
      this.showRoleSuggestionModal.set(true);
    } else {
      console.log('🔧 ConsultaInventario - Not showing modal, user has appropriate role');
      this.showRoleSuggestionModal.set(false);
    }
  }

  private subscribeToRoleChanges(): void {
    this.roleSubscriptions.add(
      this.roleDemoService.currentSession$.subscribe(session => {
        console.log('🔧 ConsultaInventario - Role changed to:', session.activeRole);
        this.checkRoleSuggestion();
      })
    );
  }

  onRoleSuggestionDismiss(): void {
    console.log('🔧 ConsultaInventario - Role suggestion dismissed');
    this.showRoleSuggestionModal.set(false);
  }

  onRoleChanged(): void {
    console.log('🔧 ConsultaInventario - Role changed, closing modal');
    this.showRoleSuggestionModal.set(false);
  }
}