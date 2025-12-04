import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Filter, Calendar, User, TrendingUp, TrendingDown, RotateCcw, DollarSign, Plus, Eye, X, ChevronUp, ChevronDown, CheckCircle } from 'lucide-angular';
import { Subject, takeUntil, Subscription } from 'rxjs';
import { InventoryService } from '../../../services/inventory.service';
import { StockAdjustment } from '../../../interfaces/inventory.interface';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';


interface AdjustmentStats {
  totalEntries: number;
  totalExits: number;
  todayAdjustments: number;
  totalValue: number;
}

interface AdjustmentFilters {
  searchTerm: string;
  type: 'all' | 'entry' | 'exit' | 'adjustment';
  dateFrom: string;
  dateTo: string;
  responsible: string;
  status: 'all' | 'approved' | 'pending' | 'rejected';
}

interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-ajustes-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageHeaderComponent, BreadcrumbsComponent, RoleSuggestionModalComponent],
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.css']
})
export class AjustesStockComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Icons
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;
  readonly CalendarIcon = Calendar;
  readonly UserIcon = User;
  readonly TrendingUpIcon = TrendingUp;
  readonly TrendingDownIcon = TrendingDown;
  readonly RotateCcwIcon = RotateCcw;
  readonly DollarSignIcon = DollarSign;
  readonly PlusIcon = Plus;
  readonly EyeIcon = Eye;
  readonly XIcon = X;
  readonly ChevronUpIcon = ChevronUp;
  readonly ChevronDownIcon = ChevronDown;
  readonly CheckCircleIcon = CheckCircle;

  // Data
  adjustments: StockAdjustment[] = [];
  filteredAdjustments: StockAdjustment[] = [];
  stats: AdjustmentStats = {
    totalEntries: 0,
    totalExits: 0,
    todayAdjustments: 0,
    totalValue: 0
  };

  // Filters
  filters: AdjustmentFilters = {
    searchTerm: '',
    type: 'all',
    dateFrom: '',
    dateTo: '',
    responsible: '',
    status: 'all'
  };

  // UI State
  isLoading = true;
  showFilters = false;
  showDetailsModal = false;
  showNewAdjustmentModal = false;
  selectedAdjustment: StockAdjustment | null = null;

  // Sorting
  sortConfig: SortConfig = {
    column: 'date',
    direction: 'desc'
  };

  // New Adjustment Form
  newAdjustmentForm = {
    type: 'entry' as 'entry' | 'exit' | 'adjustment',
    medicineId: '',
    quantity: 0,
    reason: '',
    notes: '',
    documentNumber: '',
    supplier: '',
    batch: '',
    expiryDate: ''
  };

  // Form validation
  formErrors: { [key: string]: string } = {};
  isSubmitting = false;

  // Available medicines for selection
  availableMedicines: any[] = [];

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inventario', route: '/inventario' },
    { label: 'Ajustes de Stock' }
  ];

  // Filter options
  responsibleOptions: string[] = [];
  typeOptions = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'entry', label: 'Entradas' },
    { value: 'exit', label: 'Salidas' },
    { value: 'adjustment', label: 'Ajustes' }
  ];

  statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'approved', label: 'Aprobados' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'rejected', label: 'Rechazados' }
  ];

  // Role suggestion modal
  showRoleSuggestionModal = signal(false);
  private roleSubscriptions = new Subscription();

  constructor(
    private inventoryService: InventoryService,
    private roleDemoService: RoleDemoService
  ) {}

  ngOnInit(): void {
    this.loadAdjustments();
    this.checkRoleSuggestion();
    this.subscribeToRoleChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.roleSubscriptions.unsubscribe();
  }

  private loadAdjustments(): void {
    this.isLoading = true;
    
    this.inventoryService.getStockAdjustments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (adjustments) => {
          this.adjustments = adjustments;
          this.extractResponsibleOptions();
          this.calculateStats();
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading adjustments:', error);
          this.isLoading = false;
        }
      });
  }

  private extractResponsibleOptions(): void {
    const responsibles = [...new Set(this.adjustments.map(adj => adj.responsible))];
    this.responsibleOptions = responsibles.sort();
  }

  private calculateStats(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.stats = {
      totalEntries: this.adjustments.filter(adj => adj.type === 'entry').length,
      totalExits: this.adjustments.filter(adj => adj.type === 'exit').length,
      todayAdjustments: this.adjustments.filter(adj => adj.date === today).length,
      totalValue: this.adjustments.reduce((sum, adj) => sum + Math.abs(adj.totalValue), 0)
    };
  }

  applyFilters(): void {
    this.filteredAdjustments = this.adjustments.filter(adjustment => {
      // Search term filter
      if (this.filters.searchTerm) {
        const searchLower = this.filters.searchTerm.toLowerCase();
        const matchesSearch = 
          adjustment.medicineName.toLowerCase().includes(searchLower) ||
          adjustment.medicineId.toLowerCase().includes(searchLower) ||
          adjustment.responsible.toLowerCase().includes(searchLower) ||
          adjustment.reason.toLowerCase().includes(searchLower) ||
          adjustment.documentNumber.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Type filter
      if (this.filters.type !== 'all' && adjustment.type !== this.filters.type) {
        return false;
      }

      // Date range filter
      if (this.filters.dateFrom && adjustment.date < this.filters.dateFrom) {
        return false;
      }
      if (this.filters.dateTo && adjustment.date > this.filters.dateTo) {
        return false;
      }

      // Responsible filter
      if (this.filters.responsible && adjustment.responsible !== this.filters.responsible) {
        return false;
      }

      // Status filter
      if (this.filters.status !== 'all' && adjustment.status !== this.filters.status) {
        return false;
      }

      return true;
    });

    // Apply sorting
    this.applySorting();
  }

  clearFilters(): void {
    this.filters = {
      searchTerm: '',
      type: 'all',
      dateFrom: '',
      dateTo: '',
      responsible: '',
      status: 'all'
    };
    // Reset sorting to default (date descending)
    this.sortConfig = {
      column: 'date',
      direction: 'desc'
    };
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  sortBy(column: string): void {
    if (this.sortConfig.column === column) {
      // Toggle direction if same column
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new column with default direction
      this.sortConfig.column = column;
      this.sortConfig.direction = 'asc';
    }
    this.applySorting();
  }

  private applySorting(): void {
    this.filteredAdjustments.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (this.sortConfig.column) {
        case 'date':
          valueA = new Date(`${a.date}T${a.time}`);
          valueB = new Date(`${b.date}T${b.time}`);
          break;
        case 'type':
          valueA = a.type;
          valueB = b.type;
          break;
        case 'medicine':
          valueA = a.medicineName.toLowerCase();
          valueB = b.medicineName.toLowerCase();
          break;
        case 'quantity':
          valueA = a.quantity;
          valueB = b.quantity;
          break;
        case 'reason':
          valueA = a.reason.toLowerCase();
          valueB = b.reason.toLowerCase();
          break;
        case 'stock':
          valueA = a.newStock;
          valueB = b.newStock;
          break;
        case 'responsible':
          valueA = a.responsible.toLowerCase();
          valueB = b.responsible.toLowerCase();
          break;
        case 'status':
          valueA = a.status;
          valueB = b.status;
          break;
        case 'value':
          valueA = Math.abs(a.totalValue);
          valueB = Math.abs(b.totalValue);
          break;
        default:
          valueA = new Date(`${a.date}T${a.time}`);
          valueB = new Date(`${b.date}T${b.time}`);
      }

      let comparison = 0;
      if (valueA > valueB) {
        comparison = 1;
      } else if (valueA < valueB) {
        comparison = -1;
      }

      return this.sortConfig.direction === 'desc' ? comparison * -1 : comparison;
    });
  }

  getSortIcon(column: string): any {
    if (this.sortConfig.column !== column) {
      return null;
    }
    return this.sortConfig.direction === 'asc' ? this.ChevronUpIcon : this.ChevronDownIcon;
  }

  isSortedBy(column: string): boolean {
    return this.sortConfig.column === column;
  }

  getSortColumnLabel(): string {
    switch (this.sortConfig.column) {
      case 'date':
        return 'fecha';
      case 'type':
        return 'tipo';
      case 'medicine':
        return 'medicamento';
      case 'quantity':
        return 'cantidad';
      case 'reason':
        return 'motivo';
      case 'stock':
        return 'stock';
      case 'responsible':
        return 'responsable';
      case 'status':
        return 'estado';
      case 'value':
        return 'valor';
      default:
        return 'fecha';
    }
  }

  getTypeIcon(type: string): any {
    switch (type) {
      case 'entry':
        return this.TrendingUpIcon;
      case 'exit':
        return this.TrendingDownIcon;
      case 'adjustment':
        return this.RotateCcwIcon;
      default:
        return this.RotateCcwIcon;
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'entry':
        return 'Entrada';
      case 'exit':
        return 'Salida';
      case 'adjustment':
        return 'Ajuste';
      default:
        return type;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'approved':
        return 'Aprobado';
      case 'pending':
        return 'Pendiente';
      case 'rejected':
        return 'Rechazado';
      default:
        return status;
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(time: string): string {
    return time.substring(0, 5); // HH:MM format
  }

  formatQuantity(quantity: number): string {
    return quantity > 0 ? `+${quantity}` : quantity.toString();
  }

  getQuantityClass(quantity: number): string {
    if (quantity > 0) return 'text-green-600 font-medium';
    if (quantity < 0) return 'text-red-600 font-medium';
    return 'text-gray-600 font-medium';
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'entry':
        return 'text-green-600';
      case 'exit':
        return 'text-red-600';
      case 'adjustment':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  }

  formatStockChange(previousStock: number, newStock: number): string {
    return `${previousStock} → ${newStock}`;
  }

  getStockChangeClass(previousStock: number, newStock: number): string {
    if (newStock > previousStock) return 'text-green-600';
    if (newStock < previousStock) return 'text-red-600';
    return 'text-gray-600';
  }

  onAdjustmentClick(adjustment: StockAdjustment): void {
    this.viewAdjustmentDetails(adjustment);
  }

  viewAdjustmentDetails(adjustment: StockAdjustment, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedAdjustment = adjustment;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedAdjustment = null;
  }

  openNewAdjustmentModal(): void {
    this.resetForm();
    this.loadAvailableMedicines();
    this.showNewAdjustmentModal = true;
  }

  closeNewAdjustmentModal(): void {
    this.showNewAdjustmentModal = false;
    this.resetForm();
  }

  private resetForm(): void {
    this.newAdjustmentForm = {
      type: 'entry',
      medicineId: '',
      quantity: 0,
      reason: '',
      notes: '',
      documentNumber: '',
      supplier: '',
      batch: '',
      expiryDate: ''
    };
    this.formErrors = {};
    this.isSubmitting = false;
  }

  private loadAvailableMedicines(): void {
    // Get unique medicines from current inventory
    const uniqueMedicines = new Map();
    this.adjustments.forEach(adj => {
      if (!uniqueMedicines.has(adj.medicineId)) {
        uniqueMedicines.set(adj.medicineId, {
          id: adj.medicineId,
          name: adj.medicineName,
          presentation: adj.presentation
        });
      }
    });
    this.availableMedicines = Array.from(uniqueMedicines.values());
  }

  onMedicineChange(): void {
    // Clear medicine-related errors when selection changes
    delete this.formErrors['medicineId'];
  }

  validateForm(): boolean {
    this.formErrors = {};

    if (!this.newAdjustmentForm.medicineId) {
      this.formErrors['medicineId'] = 'Debe seleccionar un medicamento';
    }

    if (!this.newAdjustmentForm.quantity || this.newAdjustmentForm.quantity === 0) {
      this.formErrors['quantity'] = 'La cantidad debe ser mayor a 0';
    }

    if (!this.newAdjustmentForm.reason.trim()) {
      this.formErrors['reason'] = 'Debe especificar un motivo';
    }

    return Object.keys(this.formErrors).length === 0;
  }

  submitNewAdjustment(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    // Simulate API call
    setTimeout(() => {
      // Find selected medicine details
      const selectedMedicine = this.availableMedicines.find(med => med.id === this.newAdjustmentForm.medicineId);
      
      if (selectedMedicine) {
        // Create new adjustment object
        const newAdjustment: StockAdjustment = {
          id: `ADJ-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().substring(0, 5),
          type: this.newAdjustmentForm.type,
          medicineId: selectedMedicine.id,
          medicineName: selectedMedicine.name,
          presentation: selectedMedicine.presentation,
          quantity: this.newAdjustmentForm.type === 'exit' ? -Math.abs(this.newAdjustmentForm.quantity) : Math.abs(this.newAdjustmentForm.quantity),
          reason: this.newAdjustmentForm.reason,
          previousStock: Math.floor(Math.random() * 1000) + 100, // Mock previous stock
          newStock: 0, // Will be calculated
          unitCost: Math.random() * 2 + 0.1, // Mock unit cost
          totalValue: 0, // Will be calculated
          responsible: 'Usuario Actual', // In real app, get from auth service
          documentNumber: this.newAdjustmentForm.documentNumber || `DOC-${Date.now()}`,
          supplier: this.newAdjustmentForm.supplier || '-',
          batch: this.newAdjustmentForm.batch || `LOT-${Date.now()}`,
          expiryDate: this.newAdjustmentForm.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          notes: this.newAdjustmentForm.notes || '',
          status: 'approved'
        };

        // Calculate new stock and total value
        newAdjustment.newStock = newAdjustment.previousStock + newAdjustment.quantity;
        newAdjustment.totalValue = newAdjustment.quantity * newAdjustment.unitCost;

        // Add to arrays
        this.adjustments.unshift(newAdjustment);
        this.applyFilters();
        this.calculateStats();

        // Close modal and show success
        this.closeNewAdjustmentModal();
        console.log('Ajuste creado exitosamente:', newAdjustment);
        
        // In a real app, show toast notification here
      }

      this.isSubmitting = false;
    }, 1000);
  }

  exportAdjustments(): void {
    // TODO: Implement export functionality
    console.log('Exporting adjustments:', this.filteredAdjustments);
    
    // Placeholder for export functionality
    const csvContent = this.generateCSVContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ajustes-stock-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private generateCSVContent(): string {
    const headers = [
      'ID',
      'Fecha',
      'Hora',
      'Tipo',
      'Medicamento',
      'Presentación',
      'Cantidad',
      'Stock Anterior',
      'Stock Nuevo',
      'Motivo',
      'Responsable',
      'Documento',
      'Estado',
      'Valor Total'
    ];

    const rows = this.filteredAdjustments.map(adj => [
      adj.id,
      adj.date,
      adj.time,
      this.getTypeLabel(adj.type),
      adj.medicineName,
      adj.presentation,
      adj.quantity.toString(),
      adj.previousStock.toString(),
      adj.newStock.toString(),
      adj.reason,
      adj.responsible,
      adj.documentNumber,
      this.getStatusLabel(adj.status),
      adj.totalValue.toString()
    ]);

    return [headers, ...rows].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
  }

  trackByAdjustmentId(_index: number, adjustment: StockAdjustment): string {
    return adjustment.id;
  }

  // Role suggestion methods
  private checkRoleSuggestion(): void {
    const currentSession = this.roleDemoService.getCurrentSession();
    console.log('🔧 Ajustes - checkRoleSuggestion - currentRole:', currentSession.activeRole);
    
    if (currentSession.activeRole !== 'Farmacéutico' && 
        currentSession.activeRole !== 'Administrador') {
      console.log('🔧 Ajustes - Showing role suggestion modal for role:', currentSession.activeRole);
      this.showRoleSuggestionModal.set(true);
    } else {
      console.log('🔧 Ajustes - Not showing modal, user has appropriate role');
      this.showRoleSuggestionModal.set(false);
    }
  }

  private subscribeToRoleChanges(): void {
    this.roleSubscriptions.add(
      this.roleDemoService.currentSession$.subscribe(session => {
        console.log('🔧 Ajustes - Role changed to:', session.activeRole);
        this.checkRoleSuggestion();
      })
    );
  }

  onRoleSuggestionDismiss(): void {
    console.log('🔧 Ajustes - Role suggestion dismissed');
    this.showRoleSuggestionModal.set(false);
  }

  onRoleChanged(): void {
    console.log('🔧 Ajustes - Role changed, closing modal');
    this.showRoleSuggestionModal.set(false);
  }
}