import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Package, Search, Filter, Eye, Edit, Trash2, AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-angular';
import { Subject, takeUntil, Subscription } from 'rxjs';
import { InventoryMockService } from '../../../services/inventory-mock.service';
import { InventoryItem } from '../../../interfaces/inventory.interface';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';


interface StockStats {
  adequate: number;
  low: number;
  critical: number;
  out: number;
  overstocked: number;
  total: number;
}

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent, RoleSuggestionModalComponent],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Icons
  packageIcon = Package;
  searchIcon = Search;
  filterIcon = Filter;
  eyeIcon = Eye;
  editIcon = Edit;
  trashIcon = Trash2;
  alertTriangleIcon = AlertTriangle;
  checkCircleIcon = CheckCircle;
  xCircleIcon = XCircle;
  clockIcon = Clock;
  trendingUpIcon = TrendingUp;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inventario', route: '/inventario' },
    { label: 'Stock de Medicamentos' }
  ];

  // Reactive data
  inventoryItems = signal<InventoryItem[]>([]);
  searchTerm = signal<string>('');
  selectedStatus = signal<string>('all');
  selectedCategory = signal<string>('all');
  selectedLocation = signal<string>('all');
  
  // Computed properties
  filteredItems = computed(() => {
    const items = this.inventoryItems();
    const search = this.searchTerm().toLowerCase();
    const status = this.selectedStatus();
    const category = this.selectedCategory();
    const location = this.selectedLocation();

    return items.filter(item => {
      const matchesSearch = !search || 
        item.medicineName.toLowerCase().includes(search) ||
        item.medicineId.toLowerCase().includes(search) ||
        item.activeSubstance.toLowerCase().includes(search) ||
        item.location.toLowerCase().includes(search);
      
      const matchesStatus = status === 'all' || item.status === status;
      const matchesCategory = category === 'all' || item.category === category;
      const matchesLocation = location === 'all' || item.location.includes(location);

      return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
    });
  });

  stockStats = computed((): StockStats => {
    const items = this.inventoryItems();
    return {
      adequate: items.filter(item => item.status === 'adequate').length,
      low: items.filter(item => item.status === 'low').length,
      critical: items.filter(item => item.status === 'critical').length,
      out: items.filter(item => item.status === 'out').length,
      overstocked: items.filter(item => item.status === 'overstocked').length,
      total: items.length
    };
  });

  // Filter options
  categories = computed(() => {
    const items = this.inventoryItems();
    const uniqueCategories = [...new Set(items.map(item => item.category))];
    return uniqueCategories.sort();
  });

  locations = computed(() => {
    const items = this.inventoryItems();
    const uniqueLocations = [...new Set(items.map(item => item.location.split('-')[0]))];
    return uniqueLocations.sort();
  });

  // Selected item for details
  selectedItem = signal<InventoryItem | null>(null);
  showDetailsPanel = signal<boolean>(false);

  // Role suggestion modal
  showRoleSuggestionModal = signal(false);
  private roleSubscriptions = new Subscription();

  constructor(
    private inventoryService: InventoryMockService,
    private roleDemoService: RoleDemoService
  ) {}

  ngOnInit(): void {
    this.loadInventoryData();
    this.handleNavigationContext();
    this.checkRoleSuggestion();
    this.subscribeToRoleChanges();
  }

  private handleNavigationContext(): void {
    // Check if we have navigation context (e.g., from alerts or other views)
    const context = sessionStorage.getItem('navigationContext');
    if (context) {
      const navContext = JSON.parse(context);
      sessionStorage.removeItem('navigationContext'); // Clear after use
      
      if (navContext.medicineId) {
        // Filter to show the specific medicine
        this.searchTerm.set(navContext.medicineId);
        
        // Find and select the item if it exists
        setTimeout(() => {
          const item = this.inventoryItems().find(i => i.medicineId === navContext.medicineId);
          if (item) {
            this.onViewDetails(item);
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



  private loadInventoryData(): void {
    this.inventoryService.getInventoryItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.inventoryItems.set(items);
      });
  }

  // Filter methods
  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onStatusFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus.set(target.value);
  }

  onCategoryFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory.set(target.value);
  }

  onLocationFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedLocation.set(target.value);
  }

  // Table actions
  onRowDoubleClick(item: InventoryItem): void {
    this.selectedItem.set(item);
    this.showDetailsPanel.set(true);
  }

  onViewDetails(item: InventoryItem): void {
    this.selectedItem.set(item);
    this.showDetailsPanel.set(true);
  }

  onEditItem(item: InventoryItem): void {
    // TODO: Implement edit functionality
    console.log('Edit item:', item);
  }

  onDeleteItem(item: InventoryItem): void {
    // TODO: Implement delete functionality
    console.log('Delete item:', item);
  }

  closeDetailsPanel(): void {
    this.showDetailsPanel.set(false);
    this.selectedItem.set(null);
  }

  // Utility methods
  getStatusBadgeClass(status: string): string {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';
    
    switch (status) {
      case 'adequate':
        return `${baseClasses} bg-green-100 text-green-700 border-green-300`;
      case 'low':
        return `${baseClasses} bg-yellow-100 text-yellow-700 border-yellow-300`;
      case 'critical':
        return `${baseClasses} bg-orange-100 text-orange-700 border-orange-300`;
      case 'out':
        return `${baseClasses} bg-red-100 text-red-700 border-red-300`;
      case 'overstocked':
        return `${baseClasses} bg-blue-100 text-blue-700 border-blue-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 border-gray-300`;
    }
  }

  getStatusIcon(status: string) {
    switch (status) {
      case 'adequate':
        return this.checkCircleIcon;
      case 'low':
      case 'critical':
        return this.alertTriangleIcon;
      case 'out':
        return this.xCircleIcon;
      case 'overstocked':
        return this.clockIcon;
      default:
        return this.packageIcon;
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'adequate':
        return 'Adecuado';
      case 'low':
        return 'Bajo';
      case 'critical':
        return 'Crítico';
      case 'out':
        return 'Agotado';
      case 'overstocked':
        return 'Sobre Stock';
      default:
        return status;
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC'
    }).format(value);
  }

  formatDate(dateString: string): string {
    if (!dateString || dateString === '-') return '-';
    return new Date(dateString).toLocaleDateString('es-CR');
  }

  getTotalValue(): string {
    const total = this.inventoryItems().reduce((sum, item) => sum + item.totalValue, 0);
    return this.formatCurrency(total);
  }

  // TrackBy functions for performance
  trackByItem(index: number, item: InventoryItem): string {
    return item.id;
  }

  trackByCategory(index: number, category: string): string {
    return category;
  }

  trackByLocation(index: number, location: string): string {
    return location;
  }

  // Role suggestion methods
  private checkRoleSuggestion(): void {
    const currentSession = this.roleDemoService.getCurrentSession();
    console.log('🔧 Stock - checkRoleSuggestion - currentRole:', currentSession.activeRole);
    
    if (currentSession.activeRole !== 'Farmacéutico' && 
        currentSession.activeRole !== 'Administrador') {
      console.log('🔧 Stock - Showing role suggestion modal for role:', currentSession.activeRole);
      this.showRoleSuggestionModal.set(true);
    } else {
      console.log('🔧 Stock - Not showing modal, user has appropriate role');
      this.showRoleSuggestionModal.set(false);
    }
  }

  private subscribeToRoleChanges(): void {
    this.roleSubscriptions.add(
      this.roleDemoService.currentSession$.subscribe(session => {
        console.log('🔧 Stock - Role changed to:', session.activeRole);
        this.checkRoleSuggestion();
      })
    );
  }

  onRoleSuggestionDismiss(): void {
    console.log('🔧 Stock - Role suggestion dismissed');
    this.showRoleSuggestionModal.set(false);
  }

  onRoleChanged(): void {
    console.log('🔧 Stock - Role changed, closing modal');
    this.showRoleSuggestionModal.set(false);
  }
}