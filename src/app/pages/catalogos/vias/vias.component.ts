import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    LucideAngularModule,
    Route,
    Search,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    CheckCircle2,
    XCircle,
    AlertTriangle
} from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';

interface ViaAdministracion {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    estado: 'Activa' | 'Inactiva';
    fechaCreacion: string;
}

@Component({
    selector: 'app-vias-administracion',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule, PageLayoutComponent],
    template: `
    <app-page-layout 
      title="Vías de Administración" 
      description="Rutas de administración de medicamentos"
      [icon]="routeIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-green-600 via-emerald-500 to-teal-600"
      [hasActionButton]="true">
      
      <button 
        slot="action"
        (click)="abrirModalNueva()"
        class="bg-white text-green-600 hover:bg-green-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
      >
        <lucide-icon [img]="plusIcon" class="w-5 h-5"></lucide-icon>
        Nueva vía
      </button>
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

      <!-- Tabla principal -->
      <div class="mt-6 bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Vías de Administración Registradas</h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ filteredVias.length }} vía{{ filteredVias.length !== 1 ? 's' : '' }} encontrada{{ filteredVias.length !== 1 ? 's' : '' }} • Doble clic para editar
            </p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let via of filteredVias" 
                  class="cursor-pointer hover:bg-gray-50 transition-colors"
                  (dblclick)="editarVia(via)">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-gray-900">
                  {{ via.codigo }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ via.nombre }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ via.descripcion }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                    {{ via.estado }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    (click)="editarVia(via)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <lucide-icon [img]="editIcon" class="w-4 h-4 mr-2"></lucide-icon>
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Nueva Vía -->
    <div *ngIf="mostrarModalNueva" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <lucide-icon [img]="routeIcon" class="w-5 h-5 text-green-600"></lucide-icon>
              <h3 class="text-lg font-medium text-gray-900">Nueva Vía de Administración</h3>
            </div>
            <button (click)="cerrarModalNueva()" class="text-gray-400 hover:text-gray-600">
              <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
            </button>
          </div>
          
          <p class="text-sm text-gray-600 mb-4">Agregue una nueva vía de administración al catálogo</p>
          
          <form [formGroup]="formNuevaVia" (ngSubmit)="guardarNuevaVia()">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Código <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="codigo"
                    placeholder="Ej: VO"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select formControlName="estado" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="Activa">Activa</option>
                    <option value="Inactiva">Inactiva</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="nombre"
                  placeholder="Ej: Vía oral"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  formControlName="descripcion"
                  placeholder="Descripción de la vía de administración"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                (click)="cerrarModalNueva()"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="!formNuevaVia.valid"
                class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
                Agregar vía
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Panel lateral de edición -->
    <div *ngIf="mostrarModalEditar" class="fixed inset-0 z-50">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black bg-opacity-50" (click)="cerrarModalEditar()"></div>
      
      <!-- Panel lateral -->
      <div class="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl flex flex-col z-50"
           (click)="$event.stopPropagation()">
        
        <!-- Header del modal -->
        <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-white flex-shrink-0">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <lucide-icon [img]="routeIcon" class="w-5 h-5"></lucide-icon>
                <h2 class="text-lg font-semibold">Editar Vía de Administración</h2>
              </div>
              <p class="text-green-100 text-sm mt-1">Modifique la información de la vía de administración</p>
            </div>
            <button 
              (click)="cerrarModalEditar()"
              class="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
            </button>
          </div>
        </div>

        <!-- Contenido del modal con scroll -->
        <div class="flex-1 overflow-y-auto">
          <form [formGroup]="formEditarVia" (ngSubmit)="guardarCambios()" class="p-6 space-y-6">
            <div class="space-y-4">
              <div class="pb-2 border-b">
                <h3 class="font-medium text-gray-900">Información de la vía</h3>
                <p class="text-sm text-gray-600">Datos principales de la vía de administración</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">ID de la vía</label>
                  <input
                    type="text"
                    [value]="viaSeleccionada?.id"
                    disabled
                    class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Código <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="codigo"
                    placeholder="Ej: VO"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select formControlName="estado" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option value="Activa">Activa</option>
                    <option value="Inactiva">Inactiva</option>
                  </select>
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="nombre"
                    placeholder="Ej: Vía oral"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    formControlName="descripcion"
                    placeholder="Descripción de la vía de administración"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Indicador de cambios -->
            <div *ngIf="formEditarVia.dirty" class="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div class="flex items-center gap-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-4 h-4 text-amber-600"></lucide-icon>
                <p class="text-sm text-amber-800">
                  Hay cambios sin guardar. Recuerde guardar antes de cerrar.
                </p>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer del modal -->
        <div class="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div class="flex justify-end gap-3">
            <button
              type="button"
              (click)="cerrarModalEditar()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
              Cancelar
            </button>
            <button
              type="submit"
              (click)="guardarCambios()"
              [disabled]="!formEditarVia.valid || !formEditarVia.dirty"
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <lucide-icon [img]="saveIcon" class="w-4 h-4"></lucide-icon>
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
      </div>
    </app-page-layout>
  `
})
export class ViasAdministracionComponent implements OnInit {
    // Icons
    routeIcon = Route;
    searchIcon = Search;
    plusIcon = Plus;
    editIcon = Edit;
    trash2Icon = Trash2;
    saveIcon = Save;
    xIcon = X;
    checkCircle2Icon = CheckCircle2;
    xCircleIcon = XCircle;
    alertTriangleIcon = AlertTriangle;

    // Breadcrumbs
    breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Catálogos clínicos', route: '/catalogos' },
        { label: 'Vías de administración', route: '/catalogos/vias' }
    ];

    // Data
    searchTerm = '';
    mostrarModalNueva = false;
    mostrarModalEditar = false;
    viaSeleccionada: ViaAdministracion | null = null;

    // Forms
    formNuevaVia: FormGroup;
    formEditarVia: FormGroup;

    vias: ViaAdministracion[] = [
        {
            id: 'VIA-001',
            codigo: 'VO',
            nombre: 'Vía oral',
            descripcion: 'Administración por boca',
            estado: 'Activa',
            fechaCreacion: '2024-01-15'
        },
        {
            id: 'VIA-002',
            codigo: 'IV',
            nombre: 'Vía intravenosa',
            descripcion: 'Administración directa al torrente sanguíneo',
            estado: 'Activa',
            fechaCreacion: '2024-01-15'
        },
        {
            id: 'VIA-003',
            codigo: 'IM',
            nombre: 'Vía intramuscular',
            descripcion: 'Inyección en músculo',
            estado: 'Activa',
            fechaCreacion: '2024-01-15'
        },
        {
            id: 'VIA-004',
            codigo: 'SC',
            nombre: 'Vía subcutánea',
            descripcion: 'Inyección bajo la piel',
            estado: 'Activa',
            fechaCreacion: '2024-01-15'
        },
        {
            id: 'VIA-005',
            codigo: 'TOP',
            nombre: 'Tópica',
            descripcion: 'Aplicación sobre la piel',
            estado: 'Activa',
            fechaCreacion: '2024-01-15'
        }
    ];

    constructor(private fb: FormBuilder) {
        this.formNuevaVia = this.fb.group({
            codigo: ['', [Validators.required, Validators.maxLength(10)]],
            nombre: ['', [Validators.required, Validators.maxLength(100)]],
            descripcion: ['', Validators.maxLength(255)],
            estado: ['Activa', Validators.required]
        });

        this.formEditarVia = this.fb.group({
            codigo: ['', [Validators.required, Validators.maxLength(10)]],
            nombre: ['', [Validators.required, Validators.maxLength(100)]],
            descripcion: ['', Validators.maxLength(255)],
            estado: ['Activa', Validators.required]
        });
    }

    ngOnInit() {
        // Initialize component
    }

    get filteredVias() {
        if (!this.searchTerm) {
            return this.vias;
        }
        return this.vias.filter(via =>
            via.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            via.codigo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            via.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

    abrirModalNueva() {
        this.mostrarModalNueva = true;
        this.formNuevaVia.reset({
            codigo: '',
            nombre: '',
            descripcion: '',
            estado: 'Activa'
        });
    }

    cerrarModalNueva() {
        this.mostrarModalNueva = false;
        this.formNuevaVia.reset();
    }

    guardarNuevaVia() {
        if (this.formNuevaVia.valid) {
            const formData = this.formNuevaVia.value;
            
            // Verificar si el código ya existe
            const codigoExiste = this.vias.some(via => 
                via.codigo.toLowerCase() === formData.codigo.toLowerCase()
            );
            
            if (codigoExiste) {
                alert('Ya existe una vía con este código');
                return;
            }

            const nuevaVia: ViaAdministracion = {
                id: `VIA-${(this.vias.length + 1).toString().padStart(3, '0')}`,
                codigo: formData.codigo.toUpperCase(),
                nombre: formData.nombre,
                descripcion: formData.descripcion || '',
                estado: formData.estado,
                fechaCreacion: new Date().toISOString().split('T')[0]
            };

            this.vias.push(nuevaVia);
            this.cerrarModalNueva();
            
            // Simular notificación de éxito
            console.log(`Vía agregada: ${nuevaVia.nombre}`);
        }
    }

    editarVia(via: ViaAdministracion) {
        this.viaSeleccionada = via;
        this.mostrarModalEditar = true;
        
        this.formEditarVia.patchValue({
            codigo: via.codigo,
            nombre: via.nombre,
            descripcion: via.descripcion,
            estado: via.estado
        });
    }

    cerrarModalEditar() {
        this.mostrarModalEditar = false;
        this.viaSeleccionada = null;
        this.formEditarVia.reset();
    }

    guardarCambios() {
        if (this.formEditarVia.valid && this.viaSeleccionada) {
            const formData = this.formEditarVia.value;
            
            // Verificar si el código ya existe en otra vía
            const codigoExiste = this.vias.some(via => 
                via.id !== this.viaSeleccionada!.id && 
                via.codigo.toLowerCase() === formData.codigo.toLowerCase()
            );
            
            if (codigoExiste) {
                alert('Ya existe otra vía con este código');
                return;
            }

            const index = this.vias.findIndex(v => v.id === this.viaSeleccionada!.id);
            if (index > -1) {
                this.vias[index] = {
                    ...this.viaSeleccionada,
                    codigo: formData.codigo.toUpperCase(),
                    nombre: formData.nombre,
                    descripcion: formData.descripcion || '',
                    estado: formData.estado
                };
            }

            this.cerrarModalEditar();
            
            // Simular notificación de éxito
            console.log(`Vía actualizada: ${formData.nombre}`);
        }
    }
}