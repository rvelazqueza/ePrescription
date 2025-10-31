import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Package, Search, AlertTriangle } from 'lucide-angular';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';
import { RoleSuggestionModalComponent } from '../../components/role-suggestion-modal/role-suggestion-modal.component';
import { BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs.component';
import { RoleDemoService } from '../../services/role-demo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PageLayoutComponent, RoleSuggestionModalComponent],
  template: `
    <app-page-layout 
      [title]="pageTitle"
      [description]="pageDescription"
      [icon]="packageIcon"
      [breadcrumbItems]="breadcrumbItems">
      
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicamento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr *ngFor="let item of inventario">
              <td class="px-6 py-4">{{ item.nombre }}</td>
              <td class="px-6 py-4">{{ item.stock }}</td>
              <td class="px-6 py-4">
                <span [class]="item.stock < 10 ? 'text-red-600' : 'text-green-600'">
                  {{ item.stock < 10 ? 'Stock Bajo' : 'Disponible' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Role Suggestion Modal -->
      <app-role-suggestion-modal
        [isOpen]="showRoleSuggestionModal()"
        [suggestedRole]="'Farmacéutico'"
        [pageName]="'inventario-principal'"
        (dismiss)="onRoleSuggestionDismiss()"
        (roleChanged)="onRoleChanged()"
      ></app-role-suggestion-modal>
    </app-page-layout>
  `
})
export class InventarioComponent implements OnInit, OnDestroy {
  packageIcon = Package;
  searchIcon = Search;
  alertTriangleIcon = AlertTriangle;

  // Page configuration
  pageTitle = 'Farmacia e Inventario';
  pageDescription = 'Control y gestión de medicamentos disponibles en el sistema';
  
  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inventario' }
  ];

  inventario = [
    { nombre: 'Ibuprofeno 400mg', stock: 150 },
    { nombre: 'Paracetamol 500mg', stock: 8 },
    { nombre: 'Omeprazol 20mg', stock: 75 }
  ];

  // Role suggestion modal
  showRoleSuggestionModal = signal(false);
  private subscriptions = new Subscription();

  constructor(private roleDemoService: RoleDemoService) {}

  ngOnInit(): void {
    this.checkRoleSuggestion();
    this.subscribeToRoleChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private checkRoleSuggestion(): void {
    const currentSession = this.roleDemoService.getCurrentSession();
    console.log('🔧 Inventario - checkRoleSuggestion - currentRole:', currentSession.activeRole);
    
    if (currentSession.activeRole !== 'Farmacéutico' && 
        currentSession.activeRole !== 'Administrador') {
      console.log('🔧 Inventario - Showing role suggestion modal for role:', currentSession.activeRole);
      this.showRoleSuggestionModal.set(true);
    } else {
      console.log('🔧 Inventario - Not showing modal, user has appropriate role');
      this.showRoleSuggestionModal.set(false);
    }
  }

  private subscribeToRoleChanges(): void {
    this.subscriptions.add(
      this.roleDemoService.currentSession$.subscribe(session => {
        console.log('🔧 Inventario - Role changed to:', session.activeRole);
        this.checkRoleSuggestion();
      })
    );
  }

  onRoleSuggestionDismiss(): void {
    console.log('🔧 Inventario - Role suggestion dismissed');
    this.showRoleSuggestionModal.set(false);
  }

  onRoleChanged(): void {
    console.log('🔧 Inventario - Role changed, closing modal');
    this.showRoleSuggestionModal.set(false);
  }
}