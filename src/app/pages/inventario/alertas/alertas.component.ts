import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Search, Filter, AlertTriangle, CheckCircle, Clock, Package, ArrowUpDown, X, Eye, PackageCheck, Info, FileText, Building2, Calendar, DollarSign, Calculator, Truck, Loader2 } from 'lucide-angular';
import { Subject, takeUntil, Subscription } from 'rxjs';
import { InventoryMockService } from '../../../services/inventory-mock.service';
import { StockAlert } from '../../../interfaces/inventory.interface';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';


interface AlertStats {
  activeAlerts: number;
  highPriority: number;
  resolvedToday: number;
  affectedMedicines: number;
}

interface AlertFilters {
  searchTerm: string;
  priority: string;
  status: string;
  pharmacy: string;
}

interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent, RoleSuggestionModalComponent],
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css']
})
export class AlertasComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Make Math available in template
  readonly Math = Math;

  // Icons
  readonly SearchIcon = Search;
  readonly FilterIcon = Filter;
  readonly AlertTriangleIcon = AlertTriangle;
  readonly CheckCircleIcon = CheckCircle;
  readonly ClockIcon = Clock;
  readonly PackageIcon = Package;
  readonly ArrowUpDownIcon = ArrowUpDown;
  readonly XIcon = X;
  readonly EyeIcon = Eye;
  readonly PackageCheckIcon = PackageCheck;
  readonly InfoIcon = Info;
  readonly FileTextIcon = FileText;
  readonly Building2Icon = Building2;
  readonly CalendarIcon = Calendar;
  readonly DollarSignIcon = DollarSign;
  readonly CalculatorIcon = Calculator;
  readonly TruckIcon = Truck;
  readonly Loader2Icon = Loader2;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inventario', route: '/inventario' },
    { label: 'Alertas de Stock Bajo' }
  ];

  // Data
  alerts: StockAlert[] = [];
  filteredAlerts: StockAlert[] = [];
  stats: AlertStats = {
    activeAlerts: 0,
    highPriority: 0,
    resolvedToday: 0,
    affectedMedicines: 0
  };

  // Filters
  filters: AlertFilters = {
    searchTerm: '',
    priority: '',
    status: '',
    pharmacy: ''
  };

  // Loading state
  isLoading = true;

  // Sorting
  sortConfig: SortConfig = { field: 'priority', direction: 'desc' };

  // Modal state
  selectedAlert: StockAlert | null = null;
  isModalOpen = false;

  // Order form modal state
  isOrderModalOpen = false;
  orderingAlert: StockAlert | null = null;
  isSubmittingOrder = false;

  // Order form data
  orderForm = {
    quantity: '',
    supplier: '',
    estimatedCost: '',
    urgency: 'normal' as 'normal' | 'urgent' | 'emergency',
    deliveryDate: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    notes: '',
    purchaseJustification: ''
  };

  // Suppliers catalog
  suppliers = [
    'Distribuidora MedPharma',
    'Farmacéutica Nacional S.A.',
    'Laboratorios Andinos',
    'Droguería La Salud',
    'Comercial Farmacéutica Internacional',
    'Otro (Especificar en notas)'
  ];

  // Filter options
  priorityOptions = [
    { value: '', label: 'Todas las prioridades' },
    { value: 'critical', label: 'Crítica' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' }
  ];

  statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'out', label: 'Agotado' },
    { value: 'critical', label: 'Crítico' },
    { value: 'low', label: 'Bajo' }
  ];

  // Role suggestion modal
  showRoleSuggestionModal = signal(false);
  private roleSubscriptions = new Subscription();

  constructor(
    private inventoryService: InventoryMockService,
    private router: Router,
    private roleDemoService: RoleDemoService
  ) {}

  ngOnInit(): void {
    this.loadAlerts();
    this.handleNavigationContext();
    this.checkRoleSuggestion();
    this.subscribeToRoleChanges();
  }

  private handleNavigationContext(): void {
    // Check if we have navigation context
    const context = sessionStorage.getItem('navigationContext');
    if (context) {
      const navContext = JSON.parse(context);
      sessionStorage.removeItem('navigationContext'); // Clear after use
      
      if (navContext.medicineId) {
        // Filter to show alerts for the specific medicine
        this.filters.searchTerm = navContext.medicineId;
        setTimeout(() => {
          this.applyFilters();
          
          // Find and select the alert if it exists
          const alert = this.filteredAlerts.find(a => a.medicineId === navContext.medicineId);
          if (alert) {
            this.openAlertModal(alert);
          }
        }, 100);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.roleSubscriptions.unsubscribe();
  }

  private loadAlerts(): void {
    this.isLoading = true;
    
    this.inventoryService.getStockAlerts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (alerts) => {
          this.alerts = alerts;
          this.filteredAlerts = [...alerts];
          this.calculateStats();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading alerts:', error);
          this.isLoading = false;
        }
      });
  }

  private calculateStats(): void {
    const criticalAlerts = this.alerts.filter(alert => alert.priority === 'critical');
    const highPriorityAlerts = this.alerts.filter(alert => alert.priority === 'high');
    
    this.stats = {
      activeAlerts: this.alerts.length,
      highPriority: criticalAlerts.length + highPriorityAlerts.length,
      resolvedToday: Math.floor(Math.random() * 5), // Mock data - simulates resolved alerts today
      affectedMedicines: new Set(this.alerts.map(alert => alert.medicineId)).size
    };
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = this.alerts.filter(alert => {
      const matchesSearch = !this.filters.searchTerm || 
        alert.medicineName.toLowerCase().includes(this.filters.searchTerm.toLowerCase()) ||
        alert.category.toLowerCase().includes(this.filters.searchTerm.toLowerCase()) ||
        alert.location.toLowerCase().includes(this.filters.searchTerm.toLowerCase());

      const matchesPriority = !this.filters.priority || alert.priority === this.filters.priority;
      const matchesStatus = !this.filters.status || alert.status === this.filters.status;

      return matchesSearch && matchesPriority && matchesStatus;
    });

    // Apply sorting
    filtered = this.sortAlerts(filtered);
    this.filteredAlerts = filtered;
  }

  private sortAlerts(alerts: StockAlert[]): StockAlert[] {
    return [...alerts].sort((a, b) => {
      let aValue: any = a[this.sortConfig.field as keyof StockAlert];
      let bValue: any = b[this.sortConfig.field as keyof StockAlert];

      // Handle priority sorting with custom order
      if (this.sortConfig.field === 'priority') {
        const priorityOrder = { 'critical': 3, 'high': 2, 'medium': 1 };
        aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
        bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
      }

      // Handle status sorting with custom order
      if (this.sortConfig.field === 'status') {
        const statusOrder = { 'out': 3, 'critical': 2, 'low': 1 };
        aValue = statusOrder[a.status as keyof typeof statusOrder];
        bValue = statusOrder[b.status as keyof typeof statusOrder];
      }

      if (aValue < bValue) {
        return this.sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'out':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'critical':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'low':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'critical':
        return 'Crítica';
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      default:
        return priority;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'out':
        return 'Agotado';
      case 'critical':
        return 'Crítico';
      case 'low':
        return 'Bajo';
      default:
        return status;
    }
  }

  generateOrder(alert: StockAlert): void {
    this.orderingAlert = alert;
    this.initializeOrderForm(alert);
    this.isOrderModalOpen = true;
  }

  private initializeOrderForm(alert: StockAlert): void {
    // Initialize form with alert data
    this.orderForm.quantity = alert.suggestedOrder.toString();
    this.orderForm.supplier = alert.supplier || '';
    
    // Generate automatic justification
    let justification = '';
    if (alert.priority === 'critical') {
      justification = `URGENTE: Medicamento agotado. ${alert.affectedPrescriptions} recetas afectadas. Demanda estimada: ${alert.estimatedDemand} unidades/día.`;
    } else if (alert.priority === 'high') {
      justification = `Stock crítico (${alert.currentStock} unidades). Por debajo del mínimo requerido (${alert.minStock} unidades). Demanda estimada: ${alert.estimatedDemand} unidades/día.`;
    } else {
      justification = `Reposición preventiva. Stock actual: ${alert.currentStock} unidades. Stock mínimo: ${alert.minStock} unidades.`;
    }
    this.orderForm.purchaseJustification = justification;
    
    // Set urgency based on priority
    if (alert.priority === 'critical') {
      this.orderForm.urgency = 'emergency';
    } else if (alert.priority === 'high') {
      this.orderForm.urgency = 'urgent';
    } else {
      this.orderForm.urgency = 'normal';
    }
  }

  ignoreAlert(alert: StockAlert): void {
    // In a real application, this would call a service to ignore the alert
    console.log('Ignoring alert:', alert.id);
    
    // Remove from both arrays
    this.filteredAlerts = this.filteredAlerts.filter(a => a.id !== alert.id);
    this.alerts = this.alerts.filter(a => a.id !== alert.id);
    
    // Update statistics in real-time
    this.calculateStats();
    
    // Show feedback (in a real app, this would be a toast notification)
    console.log(`Alert ignored: ${alert.medicineName}`);
  }

  viewInStock(alert: StockAlert): void {
    // Navigate to stock view with context
    sessionStorage.setItem('navigationContext', JSON.stringify({ medicineId: alert.medicineId }));
    this.router.navigate(['/inventario/stock']);
  }

  markAllAsRead(): void {
    // In a real application, this would call a service to process all alerts (generate orders for all)
    console.log('Processing all alerts');
    
    const alertCount = this.alerts.length;
    
    // Simulate generating orders for all alerts
    this.alerts.forEach(alert => {
      const orderData = {
        medicineId: alert.medicineId,
        medicineName: alert.medicineName,
        suggestedQuantity: alert.suggestedOrder,
        supplier: alert.supplier,
        priority: alert.priority
      };
      console.log('Bulk order generated:', orderData);
    });
    
    // Clear all alerts
    this.filteredAlerts = [];
    this.alerts = [];
    
    // Update statistics in real-time
    this.calculateStats();
    
    // Show feedback (in a real app, this would be a toast notification)
    console.log(`${alertCount} purchase orders generated successfully`);
  }

  getActiveAlertsCount(): number {
    return this.filteredAlerts.length;
  }

  clearFilters(): void {
    this.filters = {
      searchTerm: '',
      priority: '',
      status: '',
      pharmacy: ''
    };
    this.applyFilters();
  }

  trackByAlertId(_index: number, alert: StockAlert): string {
    return alert.id;
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('es-ES');
  }

  getAlertUrgencyLevel(alert: StockAlert): string {
    if (alert.status === 'out') {
      return 'URGENTE - Sin stock disponible';
    } else if (alert.priority === 'critical') {
      return 'CRÍTICO - Stock muy bajo';
    } else if (alert.priority === 'high') {
      return 'ALTO - Requiere atención';
    } else {
      return 'MEDIO - Monitorear';
    }
  }

  getStockDeficit(alert: StockAlert): number {
    return Math.max(0, alert.minStock - alert.currentStock);
  }

  getStockPercentage(alert: StockAlert): number {
    if (alert.minStock === 0) return 0;
    return Math.round((alert.currentStock / alert.minStock) * 100);
  }

  // Sorting methods
  sortBy(field: string): void {
    if (this.sortConfig.field === field) {
      this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortConfig.field = field;
      this.sortConfig.direction = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(field: string): string {
    if (this.sortConfig.field !== field) return '';
    return this.sortConfig.direction === 'asc' ? '↑' : '↓';
  }

  // Modal methods
  openAlertModal(alert: StockAlert): void {
    this.selectedAlert = alert;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.selectedAlert = null;
    this.isModalOpen = false;
  }

  onAlertDoubleClick(alert: StockAlert): void {
    this.openAlertModal(alert);
  }

  // Order form methods
  closeOrderModal(): void {
    this.isOrderModalOpen = false;
    this.orderingAlert = null;
    this.resetOrderForm();
  }

  private resetOrderForm(): void {
    this.orderForm = {
      quantity: '',
      supplier: '',
      estimatedCost: '',
      urgency: 'normal',
      deliveryDate: '',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      notes: '',
      purchaseJustification: ''
    };
    this.isSubmittingOrder = false;
  }

  calculateTotalCost(): string {
    if (this.orderForm.quantity && this.orderForm.estimatedCost) {
      const total = parseFloat(this.orderForm.quantity) * parseFloat(this.orderForm.estimatedCost);
      return total.toFixed(2);
    }
    return '0.00';
  }

  getUrgencyConfig(urgency: string) {
    const configs = {
      normal: {
        label: 'Normal',
        description: 'Entrega estándar (15-30 días)',
        className: 'bg-blue-100 text-blue-700 border-blue-300'
      },
      urgent: {
        label: 'Urgente',
        description: 'Entrega prioritaria (5-10 días)',
        className: 'bg-orange-100 text-orange-700 border-orange-300'
      },
      emergency: {
        label: 'Emergencia',
        description: 'Entrega inmediata (1-3 días) - Auto-aprobación',
        className: 'bg-red-100 text-red-700 border-red-300'
      }
    };
    return configs[urgency as keyof typeof configs] || configs.normal;
  }

  validateOrderForm(): boolean {
    if (!this.orderForm.quantity || parseFloat(this.orderForm.quantity) <= 0) {
      console.error('La cantidad a ordenar debe ser mayor a 0');
      return false;
    }

    if (!this.orderForm.supplier) {
      console.error('Debe seleccionar un proveedor');
      return false;
    }

    if (this.orderForm.estimatedCost && parseFloat(this.orderForm.estimatedCost) < 0) {
      console.error('El costo estimado no puede ser negativo');
      return false;
    }

    if (!this.orderForm.deliveryDate) {
      console.error('Debe especificar una fecha estimada de entrega');
      return false;
    }

    // Validate delivery date is in the future
    const selectedDate = new Date(this.orderForm.deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      console.error('La fecha de entrega debe ser igual o posterior a hoy');
      return false;
    }

    return true;
  }

  async submitOrder(): Promise<void> {
    if (!this.orderingAlert || !this.validateOrderForm()) return;

    this.isSubmittingOrder = true;

    try {
      // Simulate async processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate unique order ID
      const orderId = `ORD-${Date.now()}`;
      const currentDate = new Date().toLocaleDateString('es-ES');

      // Create purchase order
      const newOrder = {
        id: orderId,
        medicineId: this.orderingAlert.medicineId,
        medicineName: this.orderingAlert.medicineName,
        presentation: this.orderingAlert.presentation,
        category: this.orderingAlert.category,
        quantity: parseFloat(this.orderForm.quantity),
        supplier: this.orderForm.supplier,
        estimatedUnitCost: this.orderForm.estimatedCost ? parseFloat(this.orderForm.estimatedCost) : 0,
        estimatedTotalCost: this.orderForm.estimatedCost ? parseFloat(this.calculateTotalCost()) : 0,
        urgency: this.orderForm.urgency,
        deliveryDate: this.orderForm.deliveryDate,
        contactPerson: this.orderForm.contactPerson,
        contactPhone: this.orderForm.contactPhone,
        contactEmail: this.orderForm.contactEmail,
        notes: this.orderForm.notes,
        purchaseJustification: this.orderForm.purchaseJustification,
        alertId: this.orderingAlert.id,
        currentStock: this.orderingAlert.currentStock,
        minStock: this.orderingAlert.minStock,
        affectedPrescriptions: this.orderingAlert.affectedPrescriptions,
        status: 'pending',
        createdDate: currentDate,
        createdBy: 'Usuario actual',
        approvalStatus: this.orderForm.urgency === 'emergency' ? 'auto-approved' : 'pending-approval',
        location: this.orderingAlert.location
      };

      console.log('Nueva orden de inventario:', newOrder);

      // Remove alert from lists (resolved by generating order)
      this.filteredAlerts = this.filteredAlerts.filter(a => a.id !== this.orderingAlert!.id);
      this.alerts = this.alerts.filter(a => a.id !== this.orderingAlert!.id);
      
      // Update statistics
      this.calculateStats();

      // Show success message
      const urgencyLabels = {
        normal: 'Normal',
        urgent: 'Urgente',
        emergency: 'Emergencia'
      };

      console.log(`¡Orden de compra generada exitosamente!
        Orden: ${orderId}
        ${this.orderForm.quantity} unidades de ${this.orderingAlert.medicineName}
        Urgencia: ${urgencyLabels[this.orderForm.urgency]}
        ${this.orderForm.urgency === 'emergency' ? '⚡ Auto-aprobada por emergencia' : ''}`);

      this.closeOrderModal();
    } catch (error) {
      console.error('Error al generar orden de compra:', error);
    } finally {
      this.isSubmittingOrder = false;
    }
  }

  // Role suggestion methods
  private checkRoleSuggestion(): void {
    const currentSession = this.roleDemoService.getCurrentSession();
    console.log('🔧 Alertas - checkRoleSuggestion - currentRole:', currentSession.activeRole);
    
    if (currentSession.activeRole !== 'Farmacéutico' && 
        currentSession.activeRole !== 'Administrador') {
      console.log('🔧 Alertas - Showing role suggestion modal for role:', currentSession.activeRole);
      this.showRoleSuggestionModal.set(true);
    } else {
      console.log('🔧 Alertas - Not showing modal, user has appropriate role');
      this.showRoleSuggestionModal.set(false);
    }
  }

  private subscribeToRoleChanges(): void {
    this.roleSubscriptions.add(
      this.roleDemoService.currentSession$.subscribe(session => {
        console.log('🔧 Alertas - Role changed to:', session.activeRole);
        this.checkRoleSuggestion();
      })
    );
  }

  onRoleSuggestionDismiss(): void {
    console.log('🔧 Alertas - Role suggestion dismissed');
    this.showRoleSuggestionModal.set(false);
  }

  onRoleChanged(): void {
    console.log('🔧 Alertas - Role changed, closing modal');
    this.showRoleSuggestionModal.set(false);
  }
}