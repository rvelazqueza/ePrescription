import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Calendar, Package, AlertTriangle, Search, Filter, Eye, MapPin, DollarSign } from 'lucide-angular';
import { Subject, takeUntil, Subscription } from 'rxjs';
import { InventoryService } from '../../../services/inventory.service';
import { Batch } from '../../../interfaces/inventory.interface';
import { BatchDetailModalComponent } from '../../../components/batch-detail-modal/batch-detail-modal.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { BreadcrumbsComponent } from '../../../components/breadcrumbs/breadcrumbs.component';
import { RoleDemoService } from '../../../services/role-demo.service';


@Component({
  selector: 'app-lotes-vencimientos',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, BatchDetailModalComponent, RoleSuggestionModalComponent, BreadcrumbsComponent],
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.css']
})
export class LotesVencimientosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Icons
  calendarIcon = Calendar;
  packageIcon = Package;
  alertTriangleIcon = AlertTriangle;
  searchIcon = Search;
  filterIcon = Filter;
  eyeIcon = Eye;
  mapPinIcon = MapPin;
  dollarSignIcon = DollarSign;

  // Breadcrumbs
  breadcrumbItems = [
    { label: 'Inventario', route: '/inventario' },
    { label: 'Lotes y Vencimientos' }
  ];

  // Filter properties
  terminoBusqueda = '';
  filtroEstado = '';
  filtroMedicamento = '';
  fechaDesde = '';
  fechaHasta = '';

  // Data properties
  lotes: Batch[] = [];
  lotesFiltrados: Batch[] = [];
  medicamentosUnicos: string[] = [];

  // Statistics
  totalLotes = 0;
  lotesActivos = 0;
  lotesProximosVencer = 0;
  lotesVencidos = 0;
  valorTotal = 0;

  // Modal properties
  selectedBatch: Batch | null = null;
  isModalOpen = false;

  // Role suggestion modal
  showRoleSuggestionModal = signal(false);
  private roleSubscriptions = new Subscription();

  constructor(
    private inventoryService: InventoryService,
    private roleDemoService: RoleDemoService
  ) {}

  ngOnInit() {
    this.cargarLotes();
    this.checkRoleSuggestion();
    this.subscribeToRoleChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.roleSubscriptions.unsubscribe();
  }



  cargarLotes() {
    this.inventoryService.getBatches()
      .pipe(takeUntil(this.destroy$))
      .subscribe((lotes: any) => {
        this.lotes = lotes;
        this.lotesFiltrados = [...lotes];
        this.calcularEstadisticas();
        this.extraerMedicamentosUnicos();
      });
  }

  extraerMedicamentosUnicos() {
    const medicamentos = [...new Set(this.lotes.map(lote => lote.medicineName))];
    this.medicamentosUnicos = medicamentos.sort();
  }

  filtrarLotes() {
    let filtrados = [...this.lotes];

    // Filtrar por término de búsqueda
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase();
      filtrados = filtrados.filter(lote =>
        lote.medicineName.toLowerCase().includes(termino) ||
        lote.batchNumber.toLowerCase().includes(termino) ||
        lote.supplier.toLowerCase().includes(termino) ||
        lote.location.toLowerCase().includes(termino)
      );
    }

    // Filtrar por estado
    if (this.filtroEstado) {
      filtrados = filtrados.filter(lote => lote.status === this.filtroEstado);
    }

    // Filtrar por medicamento
    if (this.filtroMedicamento) {
      filtrados = filtrados.filter(lote => lote.medicineName === this.filtroMedicamento);
    }

    // Filtrar por rango de fechas de vencimiento
    if (this.fechaDesde) {
      filtrados = filtrados.filter(lote => lote.expiryDate >= this.fechaDesde);
    }

    if (this.fechaHasta) {
      filtrados = filtrados.filter(lote => lote.expiryDate <= this.fechaHasta);
    }

    this.lotesFiltrados = filtrados;
  }

  calcularEstadisticas() {
    this.totalLotes = this.lotes.length;
    this.lotesActivos = this.lotes.filter(l => l.status === 'active').length;
    this.lotesProximosVencer = this.lotes.filter(l => l.status === 'near_expiry').length;
    this.lotesVencidos = this.lotes.filter(l => l.status === 'expired').length;
    this.valorTotal = this.lotes.reduce((total, lote) => total + lote.totalValue, 0);
  }

  getEstadoClass(estado: string): string {
    const classes = {
      'active': 'bg-green-100 text-green-800 border border-green-200',
      'near_expiry': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'expired': 'bg-red-100 text-red-800 border border-red-200'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-800 border border-gray-200';
  }

  getEstadoTexto(estado: string): string {
    const textos = {
      'active': 'Activo',
      'near_expiry': 'Próximo a vencer',
      'expired': 'Vencido'
    };
    return textos[estado as keyof typeof textos] || estado;
  }

  getDiasVencimientoTexto(diasVencimiento: number): string {
    if (diasVencimiento < 0) {
      return `Vencido hace ${Math.abs(diasVencimiento)} días`;
    } else if (diasVencimiento === 0) {
      return 'Vence hoy';
    } else if (diasVencimiento <= 30) {
      return `${diasVencimiento} días restantes`;
    } else if (diasVencimiento <= 90) {
      return `${diasVencimiento} días restantes`;
    } else {
      return `${diasVencimiento} días restantes`;
    }
  }

  getDiasVencimientoClass(diasVencimiento: number): string {
    if (diasVencimiento < 0) {
      return 'text-red-600 font-semibold';
    } else if (diasVencimiento <= 30) {
      return 'text-red-500 font-medium';
    } else if (diasVencimiento <= 90) {
      return 'text-yellow-600 font-medium';
    } else {
      return 'text-green-600';
    }
  }

  getStockBarClass(remaining: number, total: number): string {
    const percentage = (remaining / total) * 100;
    if (percentage <= 20) {
      return 'bg-red-500';
    } else if (percentage <= 50) {
      return 'bg-yellow-500';
    } else {
      return 'bg-green-500';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  trackByLoteId(_index: number, lote: Batch): string {
    return lote.id;
  }

  verLote(lote: Batch) {
    this.selectedBatch = lote;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedBatch = null;
  }

  // Role suggestion methods
  private checkRoleSuggestion(): void {
    const currentSession = this.roleDemoService.getCurrentSession();
    console.log('🔧 Lotes - checkRoleSuggestion - currentRole:', currentSession.activeRole);
    
    if (currentSession.activeRole !== 'Farmacéutico' && 
        currentSession.activeRole !== 'Administrador') {
      console.log('🔧 Lotes - Showing role suggestion modal for role:', currentSession.activeRole);
      this.showRoleSuggestionModal.set(true);
    } else {
      console.log('🔧 Lotes - Not showing modal, user has appropriate role');
      this.showRoleSuggestionModal.set(false);
    }
  }

  private subscribeToRoleChanges(): void {
    this.roleSubscriptions.add(
      this.roleDemoService.currentSession$.subscribe(session => {
        console.log('🔧 Lotes - Role changed to:', session.activeRole);
        this.checkRoleSuggestion();
      })
    );
  }

  onRoleSuggestionDismiss(): void {
    console.log('🔧 Lotes - Role suggestion dismissed');
    this.showRoleSuggestionModal.set(false);
  }

  onRoleChanged(): void {
    console.log('🔧 Lotes - Role changed, closing modal');
    this.showRoleSuggestionModal.set(false);
  }
}