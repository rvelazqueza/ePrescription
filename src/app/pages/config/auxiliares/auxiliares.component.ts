import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Database, FileText, CheckCircle2, Plus, Edit, Trash2, Search, Filter, Clock, Save, X, Info, AlertTriangle, XCircle } from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { SidePanelComponent } from '../../../components/ui/side-panel/side-panel.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../../components/ui/card/card.component';
import { NotificationService } from '../../../services/notification.service';

interface CatalogoAuxiliar {
  id: string;
  name: string;
  code: string;
  description: string;
  itemsCount: number;
  lastUpdated: string;
  status: 'active' | 'inactive';
}

interface Frequency {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  intervaloHoras: number;
  vecesAlDia: number;
  abreviatura: string;
  instrucciones: string;
  activa: boolean;
  categoria: 'Frecuente' | 'Especial' | 'PRN' | 'Única';
  orden: number;
  usuarioModificacion: string;
}

@Component({
  selector: 'app-auxiliares',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule, PageLayoutComponent, SidePanelComponent, CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent],
  template: `
    <app-page-layout 
      title="Catálogos Auxiliares" 
      description="Listas de valores y opciones del sistema"
      [icon]="databaseIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-teal-600 via-cyan-500 to-blue-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6">
        <!-- Estadísticas con nuevo diseño -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-teal-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Total catálogos</p>
                  <p class="text-3xl font-bold text-gray-900">{{ catalogos.length }}</p>
                </div>
                <div class="p-3 bg-teal-100 rounded-xl">
                  <lucide-icon [img]="databaseIcon" class="w-8 h-8 text-teal-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Total items</p>
                  <p class="text-3xl font-bold text-gray-900">{{ totalItems }}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl">
                  <lucide-icon [img]="fileTextIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-green-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Activos</p>
                  <p class="text-3xl font-bold text-gray-900">{{ catalogosActivos }}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-xl">
                  <lucide-icon [img]="checkCircle2Icon" class="w-8 h-8 text-green-600"></lucide-icon>
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
                placeholder="Buscar catálogos..."
                [(ngModel)]="searchTerm"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </app-card-content>
      </app-card>

      <!-- Tabla de catálogos -->
      <app-card>
        <app-card-header>
          <app-card-title>Catálogos del Sistema</app-card-title>
        </app-card-header>
        <app-card-content>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catálogo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última actualización</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let catalogo of filteredCatalogos" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">{{ catalogo.name }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-mono text-gray-900">{{ catalogo.code }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-600">{{ catalogo.description }}</div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-300">
                      {{ catalogo.itemsCount }} items
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm">{{ catalogo.lastUpdated }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                      Activo
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button 
                      (click)="openManageDialog(catalogo)"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                      <lucide-icon [img]="editIcon" class="w-4 h-4 mr-2"></lucide-icon>
                      Administrar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </app-card-content>
      </app-card>

      <!-- Panel lateral de administración -->
      <app-side-panel 
        [open]="isManageDialogOpen" 
        (openChange)="closeManageDialog()"
        [title]="'Administrar: ' + (selectedCatalog?.name || '')"
        [description]="selectedCatalog?.description || ''"
        [showFooter]="true"
        size="large">
        
        <div class="space-y-6" *ngIf="selectedCatalog">
          <!-- Header del catálogo -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-start justify-between">
              <div class="flex-1 grid grid-cols-2 gap-6">
                <div>
                  <label class="text-sm text-gray-600">Código del catálogo</label>
                  <p class="font-mono mt-1 text-sm font-medium">{{ selectedCatalog.code }}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Total de items</label>
                  <p class="mt-1">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-300">
                      {{ getItemsForCatalog(selectedCatalog.code).length }} items
                    </span>
                  </p>
                </div>
              </div>
              <div class="ml-4">
                <button 
                  (click)="openNewItemDialog()"
                  class="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
                  <lucide-icon [img]="plusIcon" class="w-4 h-4 mr-2"></lucide-icon>
                  {{ selectedCatalog.code === 'FREQUENCIES' ? 'Nueva frecuencia' : 'Nuevo item' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Tabla de frecuencias (solo para FREQUENCIES) -->
          <div *ngIf="selectedCatalog.code === 'FREQUENCIES'" class="border rounded-lg overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abreviatura</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Intervalo</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Veces/día</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let freq of mockFrequencies" class="hover:bg-gray-50">
                  <td class="px-4 py-3">
                    <span class="font-mono text-sm">{{ freq.codigo }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ freq.nombre }}</div>
                      <div class="text-xs text-gray-500 truncate max-w-xs">{{ freq.descripcion }}</div>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                      {{ freq.abreviatura }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span *ngIf="freq.intervaloHoras > 0" class="text-sm">{{ freq.intervaloHoras }}h</span>
                    <span *ngIf="freq.intervaloHoras === 0" class="text-xs text-gray-400">N/A</span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span *ngIf="freq.vecesAlDia > 0" class="text-sm">{{ freq.vecesAlDia }}x</span>
                    <span *ngIf="freq.vecesAlDia === 0" class="text-xs text-gray-400">N/A</span>
                  </td>
                  <td class="px-4 py-3">
                    <span [class]="getCategoryClass(freq.categoria)" 
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                      {{ freq.categoria }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span *ngIf="freq.activa" class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <lucide-icon [img]="checkCircle2Icon" class="w-3 h-3"></lucide-icon>
                      Activa
                    </span>
                    <span *ngIf="!freq.activa" class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      <lucide-icon [img]="xCircleIcon" class="w-3 h-3"></lucide-icon>
                      Inactiva
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex justify-end gap-1">
                      <button 
                        (click)="editFrequency(freq)"
                        class="text-blue-600 hover:text-blue-800 p-1"
                        title="Editar frecuencia">
                        <lucide-icon [img]="editIcon" class="w-4 h-4"></lucide-icon>
                      </button>
                      <button 
                        (click)="deleteFrequency(freq.id)"
                        class="text-red-600 hover:text-red-800 p-1"
                        title="Eliminar frecuencia">
                        <lucide-icon [img]="trash2Icon" class="w-4 h-4"></lucide-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Lista genérica para otros catálogos -->
          <div *ngIf="selectedCatalog.code !== 'FREQUENCIES'" class="border rounded-lg p-4 max-h-96 overflow-auto">
            <p class="text-sm text-gray-600 mb-3">Items del catálogo ({{ selectedCatalog.itemsCount }})</p>
            <div class="space-y-2">
              <div *ngFor="let item of getGenericItems(selectedCatalog.itemsCount); let idx = index" 
                   class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div class="flex items-center gap-3">
                  <span class="font-mono text-xs text-gray-500">#{{ idx + 1 }}</span>
                  <span class="text-sm">{{ item.name }}</span>
                </div>
                <div class="flex gap-2">
                  <button class="text-blue-600 hover:text-blue-800 p-1">
                    <lucide-icon [img]="editIcon" class="w-3 h-3"></lucide-icon>
                  </button>
                  <button class="text-red-600 hover:text-red-800 p-1">
                    <lucide-icon [img]="trash2Icon" class="w-3 h-3"></lucide-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer con botones -->
        <div slot="footer" class="flex justify-end gap-3">
          <button 
            (click)="closeManageDialog()"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
            Cerrar
          </button>
        </div>
      </app-side-panel>

      <!-- Modal de Nueva/Editar Frecuencia -->
      <app-side-panel 
        [open]="isNewFrequencyDialogOpen" 
        (openChange)="closeFrequencyDialog()"
        [title]="editingFrequency ? 'Editar frecuencia de dosificación' : 'Nueva frecuencia de dosificación'"
        [description]="editingFrequency ? 'Modifique los datos de la frecuencia de dosificación' : 'Complete los datos de la nueva frecuencia de dosificación'"
        [showFooter]="true"
        size="large">
        
        <div class="space-y-6 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <!-- Datos básicos -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Código <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                [(ngModel)]="frequencyForm.codigo"
                (input)="onCodigoChange($event)"
                placeholder="Ej: QD, BID, TID"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
              />
              <p class="text-xs text-gray-500">Código único de identificación (mayúsculas)</p>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Abreviatura <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                [(ngModel)]="frequencyForm.abreviatura"
                placeholder="Ej: c/8h, c/12h, PRN"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Nombre <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              [(ngModel)]="frequencyForm.nombre"
              placeholder="Ej: Tres veces al día, Una vez al día"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              [(ngModel)]="frequencyForm.descripcion"
              placeholder="Descripción detallada de la frecuencia..."
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Intervalo (horas)</label>
              <input
                type="number"
                min="0"
                [(ngModel)]="frequencyForm.intervaloHoras"
                placeholder="24"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500">0 para PRN o dosis única</p>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Veces al día</label>
              <input
                type="number"
                min="0"
                [(ngModel)]="frequencyForm.vecesAlDia"
                placeholder="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Orden</label>
              <input
                type="number"
                min="1"
                [(ngModel)]="frequencyForm.orden"
                placeholder="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500">Orden en listas</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Categoría</label>
              <select
                [(ngModel)]="frequencyForm.categoria"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="Frecuente">Frecuente</option>
                <option value="Especial">Especial</option>
                <option value="PRN">PRN (Según necesidad)</option>
                <option value="Única">Única</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Estado</label>
              <div class="flex items-center gap-3 h-10 px-3 border border-gray-300 rounded-lg">
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    [(ngModel)]="frequencyForm.activa"
                    class="sr-only"
                  />
                  <div class="relative">
                    <div [class]="frequencyForm.activa ? 'bg-teal-600' : 'bg-gray-200'" 
                         class="block w-10 h-6 rounded-full transition-colors"></div>
                    <div [class]="frequencyForm.activa ? 'translate-x-4' : 'translate-x-0'" 
                         class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
                  </div>
                </label>
                <span class="text-sm">
                  <span *ngIf="frequencyForm.activa" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    <lucide-icon [img]="checkCircle2Icon" class="h-3 w-3 mr-1"></lucide-icon>
                    Activa
                  </span>
                  <span *ngIf="!frequencyForm.activa" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    <lucide-icon [img]="xCircleIcon" class="h-3 w-3 mr-1"></lucide-icon>
                    Inactiva
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Instrucciones para el paciente</label>
            <textarea
              [(ngModel)]="frequencyForm.instrucciones"
              placeholder="Ej: Tomar una vez al día, preferiblemente a la misma hora"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            ></textarea>
            <p class="text-xs text-gray-500">Instrucciones que aparecerán en la receta para el paciente</p>
          </div>

          <!-- Vista previa -->
          <div class="bg-gray-50 rounded-lg p-4 space-y-2">
            <label class="text-sm text-gray-600 flex items-center gap-2">
              <lucide-icon [img]="infoIcon" class="w-4 h-4"></lucide-icon>
              Vista previa
            </label>
            <div class="bg-white rounded border p-3 space-y-1">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                  {{ frequencyForm.codigo || 'CODIGO' }}
                </span>
                <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                  {{ frequencyForm.abreviatura || 'c/Xh' }}
                </span>
                <span class="flex-1">{{ frequencyForm.nombre || 'Nombre de la frecuencia' }}</span>
                <span *ngIf="frequencyForm.activa" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Activa
                </span>
                <span *ngIf="!frequencyForm.activa" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  Inactiva
                </span>
              </div>
              <p *ngIf="frequencyForm.descripcion" class="text-sm text-gray-600">{{ frequencyForm.descripcion }}</p>
              <p *ngIf="frequencyForm.instrucciones" class="text-xs text-gray-500 italic">
                → {{ frequencyForm.instrucciones }}
              </p>
              <div class="flex gap-4 text-xs text-gray-500 pt-2 border-t">
                <span *ngIf="frequencyForm.intervaloHoras > 0">Intervalo: {{ frequencyForm.intervaloHoras }}h</span>
                <span *ngIf="frequencyForm.vecesAlDia > 0">Frecuencia: {{ frequencyForm.vecesAlDia }}x/día</span>
                <span>Categoría: {{ frequencyForm.categoria }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer con botones -->
        <div slot="footer" class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button 
            (click)="closeFrequencyDialog()"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
            <lucide-icon [img]="xIcon" class="w-4 h-4 mr-2"></lucide-icon>
            Cancelar
          </button>
          <button 
            (click)="saveFrequency()"
            class="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
            <lucide-icon [img]="saveIcon" class="w-4 h-4 mr-2"></lucide-icon>
            {{ editingFrequency ? 'Actualizar' : 'Guardar' }}
          </button>
        </div>
      </app-side-panel>
      </div>
    </app-page-layout>
  `
})
export class AuxiliaresComponent implements OnInit {
  // Iconos
  databaseIcon = Database;
  fileTextIcon = FileText;
  checkCircle2Icon = CheckCircle2;
  plusIcon = Plus;
  editIcon = Edit;
  trash2Icon = Trash2;
  searchIcon = Search;
  filterIcon = Filter;
  clockIcon = Clock;
  saveIcon = Save;
  xIcon = X;
  infoIcon = Info;
  alertTriangleIcon = AlertTriangle;
  xCircleIcon = XCircle;

  constructor(private notificationService: NotificationService) {}

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Configuración', route: '/config' },
    { label: 'Catálogos auxiliares', route: '/config/auxiliares' }
  ];

  // Estados del componente
  searchTerm = '';
  isManageDialogOpen = false;
  selectedCatalog: CatalogoAuxiliar | null = null;
  isNewItemDialogOpen = false;
  isNewFrequencyDialogOpen = false;
  editingFrequency: Frequency | null = null;

  // Formulario de nueva frecuencia
  frequencyForm = {
    codigo: '',
    nombre: '',
    descripcion: '',
    intervaloHoras: 0,
    vecesAlDia: 1,
    abreviatura: '',
    instrucciones: '',
    activa: true,
    categoria: 'Frecuente' as Frequency['categoria'],
    orden: 1
  };

  // Datos mock basados en el archivo React
  catalogos: CatalogoAuxiliar[] = [
    {
      id: "AUX-001",
      name: "Frecuencias de dosificación",
      code: "FREQUENCIES",
      description: "Intervalos de tiempo para administración de medicamentos",
      itemsCount: 12,
      lastUpdated: "2024-09-10",
      status: "active"
    },
    {
      id: "AUX-002",
      name: "Duraciones de tratamiento",
      code: "DURATIONS",
      description: "Períodos estándar de duración de tratamientos",
      itemsCount: 8,
      lastUpdated: "2024-08-15",
      status: "active"
    },
    {
      id: "AUX-003",
      name: "Indicaciones especiales",
      code: "INDICATIONS",
      description: "Indicaciones adicionales comunes para prescripciones",
      itemsCount: 15,
      lastUpdated: "2024-09-01",
      status: "active"
    },
    {
      id: "AUX-004",
      name: "Motivos de rechazo",
      code: "REJECTION_REASONS",
      description: "Razones por las que una receta puede ser rechazada",
      itemsCount: 10,
      lastUpdated: "2024-07-20",
      status: "active"
    },
    {
      id: "AUX-005",
      name: "Tipos de identificación",
      code: "ID_TYPES",
      description: "Documentos de identidad aceptados para pacientes",
      itemsCount: 6,
      lastUpdated: "2024-06-30",
      status: "active"
    },
    {
      id: "AUX-006",
      name: "Grupos sanguíneos",
      code: "BLOOD_TYPES",
      description: "Clasificación de tipos de sangre",
      itemsCount: 8,
      lastUpdated: "2024-05-15",
      status: "active"
    },
    {
      id: "AUX-007",
      name: "Tipos de alergia",
      code: "ALLERGY_TYPES",
      description: "Categorías de reacciones alérgicas",
      itemsCount: 12,
      lastUpdated: "2024-09-05",
      status: "active"
    }
  ];

  // Datos mock de frecuencias
  mockFrequencies: Frequency[] = [
    {
      id: "FREQ-001",
      codigo: "QD",
      nombre: "Una vez al día",
      descripcion: "Administrar una dosis cada 24 horas",
      intervaloHoras: 24,
      vecesAlDia: 1,
      abreviatura: "c/24h",
      instrucciones: "Tomar una vez al día, preferiblemente a la misma hora",
      activa: true,
      categoria: "Frecuente",
      orden: 1,
      usuarioModificacion: "Admin Sistema"
    },
    {
      id: "FREQ-002",
      codigo: "BID",
      nombre: "Dos veces al día",
      descripcion: "Administrar dos dosis diarias cada 12 horas",
      intervaloHoras: 12,
      vecesAlDia: 2,
      abreviatura: "c/12h",
      instrucciones: "Tomar dos veces al día, cada 12 horas",
      activa: true,
      categoria: "Frecuente",
      orden: 2,
      usuarioModificacion: "Admin Sistema"
    },
    {
      id: "FREQ-003",
      codigo: "TID",
      nombre: "Tres veces al día",
      descripcion: "Administrar tres dosis diarias cada 8 horas",
      intervaloHoras: 8,
      vecesAlDia: 3,
      abreviatura: "c/8h",
      instrucciones: "Tomar tres veces al día, cada 8 horas",
      activa: true,
      categoria: "Frecuente",
      orden: 3,
      usuarioModificacion: "Admin Sistema"
    },
    {
      id: "FREQ-004",
      codigo: "QID",
      nombre: "Cuatro veces al día",
      descripcion: "Administrar cuatro dosis diarias cada 6 horas",
      intervaloHoras: 6,
      vecesAlDia: 4,
      abreviatura: "c/6h",
      instrucciones: "Tomar cuatro veces al día, cada 6 horas",
      activa: true,
      categoria: "Frecuente",
      orden: 4,
      usuarioModificacion: "Admin Sistema"
    },
    {
      id: "FREQ-005",
      codigo: "Q4H",
      nombre: "Cada 4 horas",
      descripcion: "Administrar cada 4 horas (6 veces al día)",
      intervaloHoras: 4,
      vecesAlDia: 6,
      abreviatura: "c/4h",
      instrucciones: "Tomar cada 4 horas",
      activa: true,
      categoria: "Especial",
      orden: 5,
      usuarioModificacion: "Admin Sistema"
    },
    {
      id: "FREQ-006",
      codigo: "PRN",
      nombre: "Cuando sea necesario",
      descripcion: "Administrar según necesidad (Pro Re Nata)",
      intervaloHoras: 0,
      vecesAlDia: 0,
      abreviatura: "PRN",
      instrucciones: "Tomar según necesidad",
      activa: true,
      categoria: "PRN",
      orden: 6,
      usuarioModificacion: "Admin Sistema"
    }
  ];

  ngOnInit() {}

  get filteredCatalogos(): CatalogoAuxiliar[] {
    return this.catalogos.filter(catalogo => {
      const matchesSearch = !this.searchTerm || 
        catalogo.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        catalogo.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }

  get totalItems(): number {
    return this.catalogos.reduce((total, catalogo) => total + catalogo.itemsCount, 0);
  }

  get catalogosActivos(): number {
    return this.catalogos.filter(c => c.status === 'active').length;
  }

  openManageDialog(catalog: CatalogoAuxiliar): void {
    this.selectedCatalog = catalog;
    this.isManageDialogOpen = true;
  }

  closeManageDialog(): void {
    this.isManageDialogOpen = false;
    this.selectedCatalog = null;
  }

  openNewItemDialog(): void {
    if (this.selectedCatalog?.code === 'FREQUENCIES') {
      this.openNewFrequencyDialog();
    } else {
      this.isNewItemDialogOpen = true;
    }
  }

  openNewFrequencyDialog(): void {
    this.editingFrequency = null;
    this.resetFrequencyForm();
    this.isNewFrequencyDialogOpen = true;
  }

  closeFrequencyDialog(): void {
    this.isNewFrequencyDialogOpen = false;
    this.editingFrequency = null;
    this.resetFrequencyForm();
  }

  resetFrequencyForm(): void {
    this.frequencyForm = {
      codigo: '',
      nombre: '',
      descripcion: '',
      intervaloHoras: 0,
      vecesAlDia: 1,
      abreviatura: '',
      instrucciones: '',
      activa: true,
      categoria: 'Frecuente',
      orden: this.mockFrequencies.length + 1
    };
  }

  onCodigoChange(event: any): void {
    // Convertir a mayúsculas automáticamente
    const value = event.target.value.toUpperCase();
    this.frequencyForm.codigo = value;
  }

  editFrequency(frequency: Frequency): void {
    this.editingFrequency = frequency;
    this.frequencyForm = {
      codigo: frequency.codigo,
      nombre: frequency.nombre,
      descripcion: frequency.descripcion,
      intervaloHoras: frequency.intervaloHoras,
      vecesAlDia: frequency.vecesAlDia,
      abreviatura: frequency.abreviatura,
      instrucciones: frequency.instrucciones,
      activa: frequency.activa,
      categoria: frequency.categoria,
      orden: frequency.orden
    };
    this.isNewFrequencyDialogOpen = true;
  }

  saveFrequency(): void {
    // Validaciones
    if (!this.frequencyForm.codigo.trim()) {
      this.notificationService.showError('El código es obligatorio', 'Error de validación');
      return;
    }

    if (!this.frequencyForm.nombre.trim()) {
      this.notificationService.showError('El nombre es obligatorio', 'Error de validación');
      return;
    }

    if (!this.frequencyForm.abreviatura.trim()) {
      this.notificationService.showError('La abreviatura es obligatoria', 'Error de validación');
      return;
    }

    // Verificar código único (solo para nuevas frecuencias)
    if (!this.editingFrequency) {
      const existingFreq = this.mockFrequencies.find(f => f.codigo === this.frequencyForm.codigo);
      if (existingFreq) {
        this.notificationService.showError('Ya existe una frecuencia con este código', 'Error de validación');
        return;
      }
    }

    try {
      if (this.editingFrequency) {
        // Actualizar frecuencia existente
        const index = this.mockFrequencies.findIndex(f => f.id === this.editingFrequency!.id);
        if (index !== -1) {
          this.mockFrequencies[index] = {
            ...this.mockFrequencies[index],
            ...this.frequencyForm,
            usuarioModificacion: 'Admin Sistema'
          };
          this.notificationService.showSuccess(
            `${this.frequencyForm.nombre} ha sido actualizada correctamente`,
            'Frecuencia actualizada'
          );
        }
      } else {
        // Crear nueva frecuencia
        const newFrequency: Frequency = {
          id: `FREQ-${String(this.mockFrequencies.length + 1).padStart(3, '0')}`,
          ...this.frequencyForm,
          usuarioModificacion: 'Admin Sistema'
        };
        this.mockFrequencies.push(newFrequency);
        
        // Actualizar el conteo en el catálogo
        const catalogIndex = this.catalogos.findIndex(c => c.code === 'FREQUENCIES');
        if (catalogIndex !== -1) {
          this.catalogos[catalogIndex].itemsCount = this.mockFrequencies.length;
        }

        this.notificationService.showSuccess(
          `${this.frequencyForm.nombre} ha sido agregada al sistema`,
          'Frecuencia creada'
        );
      }

      this.closeFrequencyDialog();
    } catch (error) {
      this.notificationService.showError('No se pudo guardar la frecuencia', 'Error al guardar');
    }
  }

  deleteFrequency(id: string): void {
    const frequency = this.mockFrequencies.find(f => f.id === id);
    if (!frequency) return;

    if (confirm(`¿Está seguro que desea eliminar la frecuencia "${frequency.nombre}"? Esta acción no se puede deshacer.`)) {
      const index = this.mockFrequencies.findIndex(f => f.id === id);
      if (index !== -1) {
        this.mockFrequencies.splice(index, 1);
        
        // Actualizar el conteo en el catálogo
        const catalogIndex = this.catalogos.findIndex(c => c.code === 'FREQUENCIES');
        if (catalogIndex !== -1) {
          this.catalogos[catalogIndex].itemsCount = this.mockFrequencies.length;
        }

        this.notificationService.showSuccess(
          'Frecuencia eliminada correctamente',
          'Frecuencia eliminada'
        );
      }
    }
  }

  getItemsForCatalog(code: string): any[] {
    if (code === 'FREQUENCIES') {
      return this.mockFrequencies;
    }
    // Para otros catálogos, retornar array vacío por ahora
    return [];
  }

  getGenericItems(count: number): any[] {
    return Array.from({ length: Math.min(count, 10) }, (_, idx) => ({
      id: `ITEM-${idx + 1}`,
      name: `Item de ejemplo ${idx + 1}`,
      description: `Descripción del item ${idx + 1}`
    }));
  }

  getCategoryClass(categoria: string): string {
    const classes: { [key: string]: string } = {
      'Frecuente': 'bg-green-100 text-green-700 border-green-300',
      'Especial': 'bg-blue-100 text-blue-700 border-blue-300',
      'PRN': 'bg-amber-100 text-amber-700 border-amber-300',
      'Única': 'bg-purple-100 text-purple-700 border-purple-300'
    };
    return classes[categoria] || 'bg-gray-100 text-gray-700 border-gray-300';
  }

  getStatusClass(status: string): string {
    const classes = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getStatusDotClass(status: string): string {
    const classes = {
      'active': 'bg-green-500',
      'inactive': 'bg-gray-500'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-500';
  }

  getStatusLabel(status: string): string {
    const labels = {
      'active': 'Activo',
      'inactive': 'Inactivo'
    };
    return labels[status as keyof typeof labels] || 'Inactivo';
  }
}