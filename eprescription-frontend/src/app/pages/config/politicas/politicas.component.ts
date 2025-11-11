import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Settings, CheckCircle2, XCircle, Edit, Trash2, Plus, Save, X, AlertTriangle, Database, Clock, Info, Shield } from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { DialogComponent, DialogHeaderComponent, DialogTitleComponent, DialogContentComponent, DialogFooterComponent } from '../../../components/ui/dialog/dialog.component';
import { SidePanelComponent } from '../../../components/ui/side-panel/side-panel.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../../components/ui/card/card.component';
import { NotificationService } from '../../../services/notification.service';

interface Politica {
  id: string;
  name: string;
  value: string;
  unit: string;
  description: string;
  category: string;
  status: 'active' | 'inactive';
  lastModified: string;
}

@Component({
  selector: 'app-politicas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule, PageLayoutComponent, DialogComponent, DialogHeaderComponent, DialogTitleComponent, DialogContentComponent, DialogFooterComponent, CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, SidePanelComponent],
  template: `
    <app-page-layout 
      title="Políticas de Recetas" 
      description="Configuración de reglas y límites del sistema de prescripciones"
      [icon]="settingsIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-indigo-600 via-purple-500 to-pink-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6">
        <!-- Estadísticas con nuevo diseño -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-indigo-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Total políticas</p>
                  <p class="text-3xl font-bold text-gray-900">{{ politicas.length }}</p>
                </div>
                <div class="p-3 bg-indigo-100 rounded-xl">
                  <lucide-icon [img]="settingsIcon" class="w-8 h-8 text-indigo-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-green-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Activas</p>
                  <p class="text-3xl font-bold text-gray-900">{{ politicasActivas }}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-xl">
                  <lucide-icon [img]="checkCircle2Icon" class="w-8 h-8 text-green-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-purple-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Categorías</p>
                  <p class="text-3xl font-bold text-gray-900">{{ categorias.length }}</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-xl">
                  <lucide-icon [img]="databaseIcon" class="w-8 h-8 text-purple-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-orange-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Modificadas (mes)</p>
                  <p class="text-3xl font-bold text-gray-900">3</p>
                </div>
                <div class="p-3 bg-orange-100 rounded-xl">
                  <lucide-icon [img]="clockIcon" class="w-8 h-8 text-orange-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Barra de búsqueda y filtros -->
      <app-card>
        <app-card-content class="p-6">
          <div class="flex gap-4">
            <div class="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar política..."
                [(ngModel)]="searchTerm"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select [(ngModel)]="categoryFilter" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-48">
              <option value="">Todas las categorías</option>
              <option *ngFor="let categoria of categorias" [value]="categoria">{{ categoria }}</option>
            </select>
          </div>
        </app-card-content>
      </app-card>

      <!-- Tabla de políticas -->
      <app-card>
        <app-card-header>
          <app-card-title>Políticas Configuradas</app-card-title>
        </app-card-header>
        <app-card-content>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Política</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última modificación</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let politica of filteredPoliticas" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">{{ politica.name }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <span *ngIf="politica.unit === 'boolean'" 
                            [class]="politica.value === 'true' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border">
                        {{ politica.value === 'true' ? 'Sí' : 'No' }}
                      </span>
                      <span *ngIf="politica.unit !== 'boolean'" class="font-semibold">
                        {{ politica.value }} {{ politica.unit }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span [class]="getCategoryClass(politica.category)" 
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border">
                      {{ politica.category }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-600 max-w-xs truncate">{{ politica.description }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm">{{ politica.lastModified }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                      Activa
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button 
                      (click)="openEditDialog(politica)"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <lucide-icon [img]="editIcon" class="w-4 h-4 mr-2"></lucide-icon>
                      Editar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </app-card-content>
      </app-card>

      <!-- Información del sistema -->
      <app-card class="border-indigo-200 bg-indigo-50">
        <app-card-content class="p-4">
          <div class="flex items-start gap-3">
            <lucide-icon [img]="infoIcon" class="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5"></lucide-icon>
            <div>
              <h4 class="font-medium text-indigo-900 mb-1">Políticas del Sistema</h4>
              <ul class="space-y-1 text-sm text-indigo-700">
                <li class="flex items-start gap-2">
                  <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                  <span>Las políticas afectan el comportamiento global del sistema de prescripciones</span>
                </li>
                <li class="flex items-start gap-2">
                  <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                  <span>Cambios en políticas críticas requieren confirmación del administrador</span>
                </li>
                <li class="flex items-start gap-2">
                  <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                  <span>Todas las modificaciones quedan registradas en log de auditoría</span>
                </li>
              </ul>
            </div>
          </div>
        </app-card-content>
      </app-card>

      <!-- Panel lateral de edición -->
      <app-side-panel 
        [open]="isEditDialogOpen" 
        (openChange)="closeEditDialog()"
        [title]="'Editar Política: ' + (selectedPolitica?.name || '')"
        [description]="selectedPolitica?.description || ''"
        [showFooter]="true">
        
        <div class="space-y-6" *ngIf="selectedPolitica">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <input 
              type="text" 
              [value]="selectedPolitica.category" 
              disabled 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Valor actual</label>
            <div *ngIf="selectedPolitica.unit === 'boolean'" class="mt-2">
              <label class="inline-flex items-center">
                <input 
                  type="checkbox" 
                  [checked]="selectedPolitica.value === 'true'"
                  [(ngModel)]="editFormData.booleanValue"
                  class="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span class="ml-2 text-sm text-gray-700">Activado</span>
              </label>
            </div>
            <div *ngIf="selectedPolitica.unit !== 'boolean'" class="flex gap-2 mt-2">
              <input 
                type="number" 
                [(ngModel)]="editFormData.numericValue"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <input 
                type="text" 
                [value]="selectedPolitica.unit" 
                disabled 
                class="w-32 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>

          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <lucide-icon [img]="shieldIcon" class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"></lucide-icon>
              <div class="text-sm text-yellow-900">
                <p class="font-medium mb-1">Advertencia</p>
                <p class="text-yellow-700">
                  Modificar esta política afectará el comportamiento del sistema. Los cambios se aplicarán inmediatamente.
                </p>
              </div>
            </div>
          </div>

          <!-- Vista previa del cambio -->
          <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <lucide-icon [img]="infoIcon" class="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5"></lucide-icon>
              <div class="text-sm">
                <p class="font-medium text-indigo-900 mb-1">Vista previa del cambio</p>
                <div class="text-indigo-700">
                  <p><strong>Valor actual:</strong> {{ getDisplayValue(selectedPolitica) }}</p>
                  <p><strong>Nuevo valor:</strong> {{ getNewDisplayValue() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer con botones -->
        <div slot="footer" class="flex justify-end gap-3">
          <button 
            (click)="closeEditDialog()"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancelar
          </button>
          <button 
            (click)="savePolicy()"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center gap-2">
            <lucide-icon [img]="saveIcon" class="w-4 h-4"></lucide-icon>
            Guardar cambios
          </button>
        </div>
      </app-side-panel>
      </div>
    </app-page-layout>
  `
})
export class PoliticasComponent implements OnInit {
  // Iconos
  settingsIcon = Settings;
  checkCircle2Icon = CheckCircle2;
  xCircleIcon = XCircle;
  editIcon = Edit;
  trash2Icon = Trash2;
  plusIcon = Plus;
  saveIcon = Save;
  xIcon = X;
  alertTriangleIcon = AlertTriangle;
  databaseIcon = Database;
  clockIcon = Clock;
  infoIcon = Info;
  shieldIcon = Shield;

  constructor(private notificationService: NotificationService) {}

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Configuración', route: '/config' },
    { label: 'Políticas de recetas', route: '/config/politicas' }
  ];

  // Estados del componente
  searchTerm = '';
  categoryFilter = '';
  isEditDialogOpen = false;
  selectedPolitica: Politica | null = null;
  editFormData = {
    booleanValue: false,
    numericValue: 0
  };

  // Datos
  politicas: Politica[] = [
    {
      id: "POL-001",
      name: "Vigencia de recetas",
      value: "30",
      unit: "días",
      description: "Tiempo máximo de validez de una receta desde su emisión",
      category: "Temporal",
      status: "active",
      lastModified: "2024-09-15"
    },
    {
      id: "POL-002",
      name: "Máximo de medicamentos por receta",
      value: "5",
      unit: "medicamentos",
      description: "Cantidad máxima de medicamentos que puede contener una receta",
      category: "Límites",
      status: "active",
      lastModified: "2024-08-20"
    },
    {
      id: "POL-003",
      name: "Requiere diagnóstico obligatorio",
      value: "true",
      unit: "boolean",
      description: "Si es obligatorio incluir diagnóstico en toda receta",
      category: "Validación",
      status: "active",
      lastModified: "2024-07-10"
    },
    {
      id: "POL-004",
      name: "Permitir prescripción de controlados",
      value: "true",
      unit: "boolean",
      description: "Habilita la prescripción de medicamentos controlados",
      category: "Permisos",
      status: "active",
      lastModified: "2024-09-01"
    },
    {
      id: "POL-005",
      name: "Duración máxima de tratamiento",
      value: "90",
      unit: "días",
      description: "Duración máxima permitida para un tratamiento continuo",
      category: "Temporal",
      status: "active",
      lastModified: "2024-06-15"
    },
    {
      id: "POL-006",
      name: "Requiere firma digital obligatoria",
      value: "true",
      unit: "boolean",
      description: "Si todas las recetas deben ser firmadas digitalmente",
      category: "Seguridad",
      status: "active",
      lastModified: "2024-09-20"
    },
    {
      id: "POL-007",
      name: "Alertas clínicas bloqueantes",
      value: "true",
      unit: "boolean",
      description: "Si las alertas críticas bloquean la emisión de recetas",
      category: "Seguridad",
      status: "active",
      lastModified: "2024-08-30"
    },
    {
      id: "POL-008",
      name: "Dispensación parcial permitida",
      value: "true",
      unit: "boolean",
      description: "Permite dispensar parcialmente una receta en farmacia",
      category: "Farmacia",
      status: "active",
      lastModified: "2024-07-25"
    }
  ];

  ngOnInit() {}

  get filteredPoliticas(): Politica[] {
    return this.politicas.filter(politica => {
      const matchesSearch = !this.searchTerm || 
        politica.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.categoryFilter || politica.category === this.categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }

  get politicasActivas(): number {
    return this.politicas.filter(p => p.status === 'active').length;
  }

  get politicasInactivas(): number {
    return this.politicas.filter(p => p.status === 'inactive').length;
  }

  get categorias(): string[] {
    return [...new Set(this.politicas.map(p => p.category))];
  }

  getCategoryClass(category: string): string {
    const classes: { [key: string]: string } = {
      'Temporal': 'bg-blue-100 text-blue-700 border-blue-300',
      'Límites': 'bg-orange-100 text-orange-700 border-orange-300',
      'Validación': 'bg-green-100 text-green-700 border-green-300',
      'Permisos': 'bg-purple-100 text-purple-700 border-purple-300',
      'Seguridad': 'bg-red-100 text-red-700 border-red-300',
      'Farmacia': 'bg-teal-100 text-teal-700 border-teal-300'
    };
    return classes[category] || 'bg-gray-100 text-gray-700 border-gray-300';
  }

  getStatusClass(status: string): string {
    const classes = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getStatusIcon(status: string): any {
    const icons = {
      'active': this.checkCircle2Icon,
      'inactive': this.xCircleIcon
    };
    return icons[status as keyof typeof icons] || this.xCircleIcon;
  }

  getStatusLabel(status: string): string {
    const labels = {
      'active': 'Activa',
      'inactive': 'Inactiva'
    };
    return labels[status as keyof typeof labels] || 'Inactiva';
  }

  openEditDialog(politica: Politica): void {
    this.selectedPolitica = politica;
    
    // Inicializar el formulario con los valores actuales
    if (politica.unit === 'boolean') {
      this.editFormData.booleanValue = politica.value === 'true';
    } else {
      this.editFormData.numericValue = parseInt(politica.value) || 0;
    }
    
    this.isEditDialogOpen = true;
  }

  closeEditDialog(): void {
    this.isEditDialogOpen = false;
    this.selectedPolitica = null;
  }

  getDisplayValue(politica: Politica): string {
    if (politica.unit === 'boolean') {
      return politica.value === 'true' ? 'Sí' : 'No';
    }
    return `${politica.value} ${politica.unit}`;
  }

  getNewDisplayValue(): string {
    if (!this.selectedPolitica) return '';
    
    if (this.selectedPolitica.unit === 'boolean') {
      return this.editFormData.booleanValue ? 'Sí' : 'No';
    }
    return `${this.editFormData.numericValue} ${this.selectedPolitica.unit}`;
  }

  savePolicy(): void {
    if (!this.selectedPolitica) return;
    
    // Actualizar el valor en la política
    const updatedValue = this.selectedPolitica.unit === 'boolean' 
      ? this.editFormData.booleanValue.toString()
      : this.editFormData.numericValue.toString();
    
    // Encontrar y actualizar la política en el array
    const index = this.politicas.findIndex(p => p.id === this.selectedPolitica!.id);
    if (index !== -1) {
      this.politicas[index] = {
        ...this.politicas[index],
        value: updatedValue,
        lastModified: new Date().toISOString().split('T')[0]
      };
    }
    
    // Simular guardado exitoso
    this.notificationService.showSuccess(
      'La configuración ha sido guardada correctamente',
      'Política actualizada'
    );
    
    this.closeEditDialog();
  }
}