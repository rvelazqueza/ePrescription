import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, Search, Building2, MapPin, Phone, Filter, Eye, Edit } from 'lucide-angular';
import { Subject, takeUntil } from 'rxjs';
import { PharmacyMockService } from '../../services/pharmacy-mock.service';
import { Pharmacy } from '../../interfaces/pharmacy.interface';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs.component';

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
  selector: 'app-farmacias',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule, BreadcrumbsComponent],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumbs -->
      <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>
      
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Farmacias</h1>
          <p class="text-gray-600">Red de farmacias afiliadas</p>
        </div>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2">
          <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
          <span>Nueva Farmacia</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let farmacia of farmacias" class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <lucide-icon [img]="building2Icon" class="w-6 h-6 text-purple-600"></lucide-icon>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900">{{ farmacia.nombre }}</h3>
                <p class="text-sm text-gray-500">{{ farmacia.codigo }}</p>
              </div>
            </div>
            <span class="px-2 py-1 rounded-full text-xs font-medium" [class]="getStatusClass(farmacia.estado)">
              {{ getStatusLabel(farmacia.estado) }}
            </span>
          </div>
          
          <div class="space-y-2">
            <div class="flex items-center text-sm text-gray-600">
              <lucide-icon [img]="mapPinIcon" class="w-4 h-4 mr-2"></lucide-icon>
              {{ farmacia.direccionEspecifica }}
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <lucide-icon [img]="phoneIcon" class="w-4 h-4 mr-2"></lucide-icon>
              {{ farmacia.telefono }}
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-200 flex gap-2">
            <button class="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 flex items-center justify-center gap-1">
              <lucide-icon [img]="eyeIcon" class="w-3 h-3"></lucide-icon>
              Ver
            </button>
            <button class="flex-1 px-3 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100 flex items-center justify-center gap-1">
              <lucide-icon [img]="editIcon" class="w-3 h-3"></lucide-icon>
              Editar
            </button>
          </div>
        </div>
      </div>

      <div class="text-center mt-8">
        <a routerLink="/farmacias/lista" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          Ver todas las farmacias
        </a>
      </div>
    </div>
  `
})
export class FarmaciasComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  plusIcon = Plus;
  searchIcon = Search;
  building2Icon = Building2;
  mapPinIcon = MapPin;
  phoneIcon = Phone;
  filterIcon = Filter;
  eyeIcon = Eye;
  editIcon = Edit;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Farmacias Registradas' }
  ];

  farmacias: Pharmacy[] = [];

  constructor(private pharmacyService: PharmacyMockService) {}

  ngOnInit(): void {
    console.log('⚠️ COMPONENTE DEPRECATED - NO SE USA EN LA APLICACIÓN');
    console.log('✅ La vista real de farmacias está en: /inventario/farmacias');
    console.log('📁 Archivo: src/app/pages/inventario/farmacias/farmacias.component.ts');
    this.loadFarmacias();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadFarmacias(): void {
    this.pharmacyService.getPharmacies()
      .pipe(takeUntil(this.destroy$))
      .subscribe(farmacias => {
        this.farmacias = farmacias.slice(0, 6); // Show only first 6 for overview
      });
  }

  getStatusClass(estado: string): string {
    const classes = {
      'activa': 'bg-green-100 text-green-700',
      'inactiva': 'bg-gray-100 text-gray-700',
      'suspendida': 'bg-red-100 text-red-700'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-700';
  }

  getStatusLabel(estado: string): string {
    const labels = {
      'activa': 'Activa',
      'inactiva': 'Inactiva',
      'suspendida': 'Suspendida'
    };
    return labels[estado as keyof typeof labels] || 'Desconocido';
  }
}