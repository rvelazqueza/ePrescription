import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    LucideAngularModule,
    Building2,
    Search,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Eye
} from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';

interface UnidadMedica {
    id: string;
    codigo: string;
    nombre: string;
    tipo: string;
    capacidad: number;
    estado: 'Activa' | 'Inactiva';
    fechaCreacion: string;
}

@Component({
    selector: 'app-unidades-medicas',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule, PageLayoutComponent],
    template: `
    <app-page-layout 
      title="Unidades Médicas" 
      description="Departamentos y servicios del hospital"
      [icon]="building2Icon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-cyan-600 via-blue-500 to-indigo-600"
      [hasActionButton]="true">
      
      <button 
        slot="action"
        (click)="abrirModalNueva()"
        class="bg-white text-cyan-600 hover:bg-cyan-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
      >
        <lucide-icon [img]="plusIcon" class="w-5 h-5"></lucide-icon>
        Nueva unidad
      </button>
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

      <!-- Tabla principal -->
      <div class="mt-6 bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Unidades Registradas</h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ filteredUnidades.length }} unidad{{ filteredUnidades.length !== 1 ? 'es' : '' }} • Doble clic para editar
            </p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let unidad of filteredUnidades" 
                  class="cursor-pointer hover:bg-gray-50 transition-colors"
                  (dblclick)="editarUnidad(unidad)">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-gray-900">
                  {{ unidad.codigo }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ unidad.nombre }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-300">
                    {{ unidad.tipo }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {{ unidad.capacidad }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                    {{ unidad.estado }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    (click)="editarUnidad(unidad)"
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

    <!-- Modal Nueva Unidad -->
    <div *ngIf="mostrarModalNueva" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="p-2 bg-cyan-100 rounded-lg">
                <lucide-icon [img]="building2Icon" class="w-5 h-5 text-cyan-600"></lucide-icon>
              </div>
              <h3 class="text-lg font-medium text-gray-900">Nueva Unidad Médica</h3>
            </div>
            <button (click)="cerrarModalNueva()" class="text-gray-400 hover:text-gray-600">
              <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
            </button>
          </div>
          
          <p class="text-sm text-gray-600 mb-4">Agregue una nueva unidad, departamento o servicio médico al sistema</p>
          
          <form [formGroup]="formNuevaUnidad" (ngSubmit)="guardarNuevaUnidad()">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Código de unidad <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="codigo"
                    placeholder="Ej: CONSUL-EXT, URGENCIAS"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono"
                    maxlength="30"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Código único de identificación (máx. 30 caracteres)
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de unidad <span class="text-red-500">*</span>
                  </label>
                  <select formControlName="tipo" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                    <option value="Ambulatoria">Ambulatoria</option>
                    <option value="Urgencias">Urgencias</option>
                    <option value="Hospitalización">Hospitalización</option>
                    <option value="Farmacia">Farmacia</option>
                    <option value="Laboratorio">Laboratorio</option>
                    <option value="Radiología">Radiología</option>
                    <option value="Quirófano">Quirófano</option>
                    <option value="UCI">UCI</option>
                    <option value="Pediatría">Pediatría</option>
                    <option value="Obstetricia">Obstetricia</option>
                    <option value="Rehabilitación">Rehabilitación</option>
                    <option value="Administración">Administración</option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1">
                    Categoría o tipo de servicio
                  </p>
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la unidad <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="nombre"
                    placeholder="Ej: Consulta Externa, Urgencias, Laboratorio Clínico"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Nombre completo del departamento o servicio
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Capacidad de atención <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    formControlName="capacidad"
                    min="1"
                    max="1000"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Capacidad de atención simultánea (pacientes/camas)
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Estado inicial</label>
                  <select formControlName="estado" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                    <option value="Activa">Activa</option>
                    <option value="Inactiva">Inactiva</option>
                  </select>
                </div>
              </div>

              <!-- Información adicional -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex gap-3">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <lucide-icon [img]="building2Icon" class="w-4 h-4 text-blue-600"></lucide-icon>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-medium text-blue-900 mb-1">
                      Información importante
                    </h4>
                    <ul class="text-sm text-blue-800 space-y-1">
                      <li>• El código debe ser único en el sistema</li>
                      <li>• Use códigos descriptivos y fáciles de identificar</li>
                      <li>• La capacidad determina límites de atención simultánea</li>
                      <li>• Las unidades inactivas no aparecen en selecciones</li>
                      <li>• Se pueden asociar médicos y equipos a cada unidad</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Preview de la unidad -->
              <div class="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-cyan-50 to-blue-50">
                <h4 class="text-sm font-medium mb-3 flex items-center gap-2">
                  <lucide-icon [img]="eyeIcon" class="w-4 h-4 text-cyan-600"></lucide-icon>
                  Vista previa de la unidad
                </h4>
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span class="text-gray-600">Código:</span>
                    <p class="font-mono font-semibold">{{ formNuevaUnidad.get('codigo')?.value || '(sin código)' }}</p>
                  </div>
                  <div>
                    <span class="text-gray-600">Tipo:</span>
                    <p class="font-medium">{{ formNuevaUnidad.get('tipo')?.value }}</p>
                  </div>
                  <div class="col-span-2">
                    <span class="text-gray-600">Nombre:</span>
                    <p class="font-medium">{{ formNuevaUnidad.get('nombre')?.value || '(sin nombre)' }}</p>
                  </div>
                  <div>
                    <span class="text-gray-600">Capacidad:</span>
                    <p class="font-medium">{{ formNuevaUnidad.get('capacidad')?.value }} {{ formNuevaUnidad.get('capacidad')?.value === 1 ? 'paciente' : 'pacientes' }}</p>
                  </div>
                  <div>
                    <span class="text-gray-600">Estado:</span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                          [class]="formNuevaUnidad.get('estado')?.value === 'Activa' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 text-gray-700 border border-gray-300'">
                      {{ formNuevaUnidad.get('estado')?.value }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                (click)="cerrarModalNueva()"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2"
              >
                <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="!formNuevaUnidad.valid"
                class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
                Agregar unidad médica
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Panel lateral de edición -->
    <div *ngIf="mostrarPanelEdicion" class="fixed inset-0 z-50">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black bg-opacity-50" (click)="cerrarPanelEdicion()"></div>
      
      <!-- Panel lateral -->
      <div class="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl flex flex-col z-50"
           (click)="$event.stopPropagation()">
        
        <!-- Header del modal -->
        <div class="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 text-white flex-shrink-0">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <lucide-icon [img]="building2Icon" class="w-5 h-5"></lucide-icon>
                <h2 class="text-lg font-semibold">Editar Unidad Médica</h2>
              </div>
              <p class="text-cyan-100 text-sm mt-1">Modifique la información de la unidad médica</p>
            </div>
            <button 
              (click)="cerrarPanelEdicion()"
              class="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
            </button>
          </div>
        </div>

        <!-- Contenido del modal con scroll -->
        <div class="flex-1 overflow-y-auto">
          <form [formGroup]="formEditarUnidad" (ngSubmit)="guardarCambios()" class="p-6 space-y-6">
            <div class="space-y-4">
              <div class="pb-2 border-b">
                <h3 class="font-medium text-gray-900">Información de la unidad</h3>
                <p class="text-sm text-gray-600">Datos principales de la unidad médica</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">ID de la unidad</label>
                  <input
                    type="text"
                    [value]="unidadSeleccionada?.id"
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
                    placeholder="Ej: CONSUL-EXT"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select formControlName="estado" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
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
                    placeholder="Ej: Consulta Externa"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de unidad</label>
                  <select formControlName="tipo" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                    <option value="Ambulatoria">Ambulatoria</option>
                    <option value="Urgencias">Urgencias</option>
                    <option value="Hospitalización">Hospitalización</option>
                    <option value="Farmacia">Farmacia</option>
                    <option value="Laboratorio">Laboratorio</option>
                    <option value="Radiología">Radiología</option>
                    <option value="Quirófano">Quirófano</option>
                    <option value="UCI">UCI</option>
                    <option value="Pediatría">Pediatría</option>
                    <option value="Obstetricia">Obstetricia</option>
                    <option value="Rehabilitación">Rehabilitación</option>
                    <option value="Administración">Administración</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
                  <input
                    type="number"
                    formControlName="capacidad"
                    min="1"
                    max="1000"
                    placeholder="Número de personas"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <p class="text-xs text-gray-500 mt-1">Capacidad máxima de la unidad (1-1000 personas)</p>
                </div>
              </div>
            </div>

            <!-- Indicador de cambios -->
            <div *ngIf="formEditarUnidad.dirty" class="bg-amber-50 border border-amber-200 rounded-lg p-3">
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
              (click)="cerrarPanelEdicion()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
              Cancelar
            </button>
            <button
              type="submit"
              (click)="guardarCambios()"
              [disabled]="!formEditarUnidad.valid || !formEditarUnidad.dirty"
              class="px-4 py-2 text-sm font-medium text-white bg-cyan-600 border border-transparent rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
export class UnidadesMedicasComponent implements OnInit {
    // Icons
    building2Icon = Building2;
    searchIcon = Search;
    plusIcon = Plus;
    editIcon = Edit;
    trash2Icon = Trash2;
    saveIcon = Save;
    xIcon = X;
    checkCircle2Icon = CheckCircle2;
    xCircleIcon = XCircle;
    alertTriangleIcon = AlertTriangle;
    eyeIcon = Eye;

    // Breadcrumbs
    breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Catálogos clínicos', route: '/catalogos' },
        { label: 'Unidades médicas', route: '/catalogos/unidades' }
    ];

    // Data
    searchTerm = '';
    mostrarModalNueva = false;
    mostrarPanelEdicion = false;
    unidadSeleccionada: UnidadMedica | null = null;

    // Forms
    formNuevaUnidad: FormGroup;
    formEditarUnidad: FormGroup;

    unidades: UnidadMedica[] = [
        {
            id: 'UNI-001',
            codigo: 'CONSUL-EXT',
            nombre: 'Consulta Externa',
            tipo: 'Ambulatoria',
            capacidad: 20,
            estado: 'Activa',
            fechaCreacion: '2024-01-15'
        },
        {
            id: 'UNI-002',
            codigo: 'URGENCIAS',
            nombre: 'Urgencias',
            tipo: 'Urgencias',
            capacidad: 15,
            estado: 'Activa',
            fechaCreacion: '2024-01-15'
        },
        {
            id: 'UNI-003',
            codigo: 'HOSP-MED',
            nombre: 'Hospitalización Medicina',
            tipo: 'Hospitalización',
            capacidad: 30,
            estado: 'Activa',
            fechaCreacion: '2024-01-15'
        },
        {
            id: 'UNI-004',
            codigo: 'FARM-CENT',
            nombre: 'Farmacia Central',
            tipo: 'Farmacia',
            capacidad: 10,
            estado: 'Activa',
            fechaCreacion: '2024-01-15'
        },
        {
            id: 'UNI-005',
            codigo: 'LAB-CLIN',
            nombre: 'Laboratorio Clínico',
            tipo: 'Laboratorio',
            capacidad: 8,
            estado: 'Activa',
            fechaCreacion: '2024-01-15'
        }
    ];

    constructor(private fb: FormBuilder) {
        this.formNuevaUnidad = this.fb.group({
            codigo: ['', [Validators.required, Validators.maxLength(30)]],
            nombre: ['', [Validators.required, Validators.maxLength(100)]],
            tipo: ['Ambulatoria', Validators.required],
            capacidad: [10, [Validators.required, Validators.min(1), Validators.max(1000)]],
            estado: ['Activa', Validators.required]
        });

        this.formEditarUnidad = this.fb.group({
            codigo: ['', [Validators.required, Validators.maxLength(30)]],
            nombre: ['', [Validators.required, Validators.maxLength(100)]],
            tipo: ['Ambulatoria', Validators.required],
            capacidad: [10, [Validators.required, Validators.min(1), Validators.max(1000)]],
            estado: ['Activa', Validators.required]
        });
    }

    ngOnInit() {
        // Initialize component
    }

    get filteredUnidades() {
        if (!this.searchTerm) {
            return this.unidades;
        }
        return this.unidades.filter(unidad =>
            unidad.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            unidad.codigo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            unidad.tipo.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

    abrirModalNueva() {
        this.mostrarModalNueva = true;
        this.formNuevaUnidad.reset({
            codigo: '',
            nombre: '',
            tipo: 'Ambulatoria',
            capacidad: 10,
            estado: 'Activa'
        });
    }

    cerrarModalNueva() {
        this.mostrarModalNueva = false;
        this.formNuevaUnidad.reset();
    }

    guardarNuevaUnidad() {
        if (this.formNuevaUnidad.valid) {
            const formData = this.formNuevaUnidad.value;
            
            // Verificar si el código ya existe
            const codigoExiste = this.unidades.some(unidad => 
                unidad.codigo.toLowerCase() === formData.codigo.toLowerCase()
            );
            
            if (codigoExiste) {
                alert('Ya existe una unidad médica con este código');
                return;
            }

            const nuevaUnidad: UnidadMedica = {
                id: `UNI-${(this.unidades.length + 1).toString().padStart(3, '0')}`,
                codigo: formData.codigo.toUpperCase(),
                nombre: formData.nombre,
                tipo: formData.tipo,
                capacidad: formData.capacidad,
                estado: formData.estado,
                fechaCreacion: new Date().toISOString().split('T')[0]
            };

            this.unidades.push(nuevaUnidad);
            this.cerrarModalNueva();
            
            // Simular notificación de éxito
            console.log(`Unidad médica agregada: ${nuevaUnidad.nombre}`);
        }
    }

    editarUnidad(unidad: UnidadMedica) {
        this.unidadSeleccionada = unidad;
        this.mostrarPanelEdicion = true;
        
        this.formEditarUnidad.patchValue({
            codigo: unidad.codigo,
            nombre: unidad.nombre,
            tipo: unidad.tipo,
            capacidad: unidad.capacidad,
            estado: unidad.estado
        });
    }

    cerrarPanelEdicion() {
        if (this.formEditarUnidad.dirty) {
            if (confirm('¿Desea descartar los cambios realizados?')) {
                this.mostrarPanelEdicion = false;
                this.unidadSeleccionada = null;
                this.formEditarUnidad.reset();
            }
        } else {
            this.mostrarPanelEdicion = false;
            this.unidadSeleccionada = null;
            this.formEditarUnidad.reset();
        }
    }

    guardarCambios() {
        if (this.formEditarUnidad.valid && this.unidadSeleccionada) {
            const formData = this.formEditarUnidad.value;
            
            // Verificar si el código ya existe en otra unidad
            const codigoExiste = this.unidades.some(unidad => 
                unidad.id !== this.unidadSeleccionada!.id && 
                unidad.codigo.toLowerCase() === formData.codigo.toLowerCase()
            );
            
            if (codigoExiste) {
                alert('Ya existe otra unidad médica con este código');
                return;
            }

            const index = this.unidades.findIndex(u => u.id === this.unidadSeleccionada!.id);
            if (index > -1) {
                this.unidades[index] = {
                    ...this.unidadSeleccionada,
                    codigo: formData.codigo.toUpperCase(),
                    nombre: formData.nombre,
                    tipo: formData.tipo,
                    capacidad: formData.capacidad,
                    estado: formData.estado
                };
            }

            this.cerrarPanelEdicion();
            
            // Simular notificación de éxito
            console.log(`Unidad médica actualizada: ${formData.nombre}`);
        }
    }
}