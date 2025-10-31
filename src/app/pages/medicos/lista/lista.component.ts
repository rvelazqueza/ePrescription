import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LucideAngularModule, Stethoscope, Search, Filter, Plus, Edit, Eye, Users, Info, RefreshCw, Trash2, MoreVertical, X } from 'lucide-angular';

// Import shared components
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { DoctorStatsCardsComponent } from '../../../components/doctor-stats-cards/doctor-stats-cards.component';
import { DoctorSearchTabsComponent, SearchFilters } from '../../../components/doctor-search-tabs/doctor-search-tabs.component';
import { DoctorDetailPanelComponent } from '../../../components/doctor-detail-panel/doctor-detail-panel.component';
import { ToastComponent } from '../../../components/toast/toast.component';
import { NewDoctorModalComponent } from '../../../components/new-doctor-modal/new-doctor-modal.component';

// Import services and interfaces
import { DoctorMockService } from '../../../services/doctor-mock.service';
import { DoctorSearchService } from '../../../services/doctor-search.service';
import { ToastService } from '../../../services/toast.service';
import { Doctor } from '../../../interfaces/doctor.interface';

@Component({
  selector: 'app-lista-medicos',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule,
    BreadcrumbsComponent,
    PageHeaderComponent,
    DoctorStatsCardsComponent,
    DoctorSearchTabsComponent,
    DoctorDetailPanelComponent,
    ToastComponent,
    NewDoctorModalComponent
  ],
  templateUrl: './lista.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListaMedicosComponent implements OnInit, OnDestroy {
  @ViewChild('searchTabs') searchTabs!: DoctorSearchTabsComponent;
  
  private destroy$ = new Subject<void>();

  // Icons
  stethoscopeIcon = Stethoscope;
  searchIcon = Search;
  filterIcon = Filter;
  plusIcon = Plus;
  editIcon = Edit;
  eyeIcon = Eye;
  usersIcon = Users;
  infoIcon = Info;
  refreshIcon = RefreshCw;
  trashIcon = Trash2;
  moreVerticalIcon = MoreVertical;
  xIcon = X;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Médicos', route: '/medicos' },
    { label: 'Listado de Médicos'}
  ];

  // Modal state
  modalAccionesAbierto: string | null = null;

  // Data
  allDoctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  searchResultsCount: number | null = null;
  
  // State
  isLoading = true;
  
  // Detail panel state
  selectedDoctor: Doctor | null = null;
  isDetailPanelVisible = false;
  
  // Modal state
  isNewDoctorModalVisible = false;
  currentFilters: SearchFilters = {
    quickSearch: '',
    nameFilter: '',
    specialtyFilter: '',
    statusFilter: 'all',
    certificationFilter: 'all',
    licenseFilter: '',
    universityFilter: '',
    minExperience: null,
    maxExperience: null
  };

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(
    private doctorMockService: DoctorMockService,
    private doctorSearchService: DoctorSearchService,
    private toastService: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.setupRealTimeSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDoctors(): void {
    this.isLoading = true;
    this.doctorMockService.getDoctors().subscribe({
      next: (doctors) => {
        this.allDoctors = doctors;
        this.filteredDoctors = [...doctors];
        
        // Set doctors in search service for real-time filtering
        this.doctorSearchService.setDoctors(doctors);
        
        this.updatePagination();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.toastService.error('Error', 'No se pudieron cargar los médicos. Por favor, intente nuevamente.');
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private setupRealTimeSearch(): void {
    // Subscribe to real-time filtered results with proper cleanup
    this.doctorSearchService.getFilteredDoctorsRealTime().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (filteredDoctors) => {
        this.filteredDoctors = filteredDoctors;
        this.searchResultsCount = filteredDoctors.length;
        this.currentPage = 1;
        this.updatePagination();
        
        // Update search tabs with results count
        if (this.searchTabs) {
          this.searchTabs.updateSearchResultsCount(this.searchResultsCount);
        }
        
        // Trigger change detection for OnPush strategy
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error in real-time search:', error);
      }
    });

    // Subscribe to search results count updates with proper cleanup
    this.doctorSearchService.searchResultsCount$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(count => {
      this.searchResultsCount = count;
      this.cdr.markForCheck();
    });
  }

  onFiltersChanged(filters: SearchFilters): void {
    this.currentFilters = filters;
    // The real-time filtering is now handled by the search service
    // No need to manually apply filters here as the service subscription will handle it
  }

  clearAllFilters(): void {
    this.currentFilters = {
      quickSearch: '',
      nameFilter: '',
      specialtyFilter: '',
      statusFilter: 'all',
      certificationFilter: 'all',
      licenseFilter: '',
      universityFilter: '',
      minExperience: null,
      maxExperience: null
    };
    
    // Clear filters in search service
    this.doctorSearchService.clearFilters();
    this.searchResultsCount = null;
    this.currentPage = 1;
  }

  // Doctor actions
  onNewDoctor = (): void => {
    this.isNewDoctorModalVisible = true;
    this.cdr.detectChanges();
  };

  onCloseNewDoctorModal = (): void => {
    this.isNewDoctorModalVisible = false;
    this.cdr.detectChanges();
  };

  onDoctorCreated = (doctorData: any): void => {
    // Add the new doctor to the list
    const newDoctor: Doctor = {
      id: Date.now().toString(),
      ...doctorData,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorData.fullName)}&background=3b82f6&color=fff`,
      status: 'active',
      experience: 0,
      patientsCount: 0,
      consultationsToday: 0,
      nextAppointment: null,
      rating: 0,
      reviewsCount: 0,
      certifications: [],
      schedules: [],
      subspecialties: []
    };

    this.allDoctors = [newDoctor, ...this.allDoctors];
    this.filteredDoctors = [...this.allDoctors];
    
    this.toastService.success(
      'Médico creado',
      `${doctorData.fullName} ha sido registrado exitosamente`,
      4000
    );

    this.cdr.detectChanges();
  };

  onViewDoctor(doctor: Doctor): void {
    this.selectedDoctor = doctor;
    this.isDetailPanelVisible = true;
  }

  onEditDoctor(doctor: Doctor): void {
    this.router.navigate(['/medicos/editar', doctor.id]);
  }

  onDeleteDoctor(doctor: Doctor): void {
    if (confirm(`¿Está seguro de que desea eliminar al médico ${doctor.fullName}?`)) {
      this.doctorMockService.deleteDoctor(doctor.id).subscribe({
        next: (success) => {
          if (success) {
            this.loadDoctors();
            this.toastService.success('Éxito', `El médico ${doctor.fullName} ha sido eliminado correctamente.`);
          }
        },
        error: (error) => {
          console.error('Error deleting doctor:', error);
          this.toastService.error('Error', 'No se pudo eliminar el médico. Por favor, intente nuevamente.');
        }
      });
    }
  }

  onDoctorDoubleClick(doctor: Doctor): void {
    this.onViewDoctor(doctor);
  }

  onCloseDetailPanel(): void {
    this.isDetailPanelVisible = false;
    this.selectedDoctor = null;
  }

  // Utility methods
  trackByDoctorId(index: number, doctor: Doctor): string {
    return doctor.id;
  }

  getDoctorInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  getDoctorAvatarClass(doctor: Doctor): string {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    const index = doctor.id.charCodeAt(doctor.id.length - 1) % colors.length;
    return colors[index];
  }

  getLicenseExpiryClass(expiryDate: string): string {
    const [day, month, year] = expiryDate.split('/').map(Number);
    const expiry = new Date(year, month - 1, day);
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);

    if (expiry <= now) {
      return 'text-red-600 font-medium';
    } else if (expiry <= threeMonthsFromNow) {
      return 'text-orange-600 font-medium';
    }
    return 'text-gray-500';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusDotClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-400';
      case 'inactive':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
  }

  // Pagination methods
  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredDoctors.length / this.itemsPerPage);
  }

  getDisplayRange(): { start: number; end: number } {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredDoctors.length);
    return { start, end };
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Modal actions methods
  toggleAccionesModal(doctorId: string): void {
    this.modalAccionesAbierto = this.modalAccionesAbierto === doctorId ? null : doctorId;
  }

  cerrarModalAcciones(): void {
    this.modalAccionesAbierto = null;
  }
}