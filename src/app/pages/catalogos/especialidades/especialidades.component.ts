import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    LucideAngularModule,
    Stethoscope,
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

interface Especialidad {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    medicos: number;
    estado: 'Activa' | 'Inactiva';
    fechaCreacion: string;
}

@Component({
    selector: 'app-especialidades',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule, PageLayoutComponent],
    template: `
    <app-page-layout 
      title="Especialidades Médicas" 
      description="Catálogo de especialidades profesionales"
      [icon]="stethoscopeIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-purple-600 via-violet-500 to-indigo-600"
      [hasActionButton]="true">
      
      <button 
        slot="action"
        (click)="abrirModalNueva()"
        class="bg-white text-purple-600 hover:bg-purple-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
      >
        <lucide-icon [img]="plusIcon" class="w-5 h-5"></lucide-icon>
        Nueva especialidad
      </button>
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

      <!-- Tabla principal -->
      <div class="mt-6 bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Especialidades Registradas</h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ filteredEspecialidades.length }} especialidad{{ filteredEspecialidades.length !== 1 ? 'es' : '' }} • Doble clic para editar
            </p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidad</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Médicos</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let especialidad of filteredEspecialidades" 
                  class="cursor-pointer hover:bg-gray-50 transition-colors"
                  (dblclick)="editarEspecialidad(especialidad)">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-gray-900">
                  {{ especialidad.codigo }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ especialidad.nombre }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ especialidad.descripcion }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-300">
                    {{ especialidad.medicos }} médicos
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                    {{ especialidad.estado }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <button 
                    (click)="editarEspecialidad(especialidad)"
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

    <!-- Modal Nueva Especialidad -->
    <div *ngIf="mostrarModalNueva" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="p-2 bg-purple-100 rounded-lg">
                <lucide-icon [img]="stethoscopeIcon" class="w-5 h-5 text-purple-600"></lucide-icon>
              </div>
              <h3 class="text-lg font-medium text-gray-900">Nueva Especialidad Médica</h3>
            </div>
            <button (click)="cerrarModalNueva()" class="text-gray-400 hover:text-gray-600">
              <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
            </button>
          </div>
          
          <p class="text-sm text-gray-600 mb-4">Agregue una nueva especialidad médica al catálogo del sistema</p>
          
          <form [formGroup]="formNuevaEspecialidad" (ngSubmit)="guardarNuevaEspecialidad()">
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Código de especialidad <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="codigo"
                    placeholder="Ej: GASTRO, NEURO, DERMATO"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                    maxlength="20"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Código único que identifica la especialidad (máx. 20 caracteres)
                  </p>
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la especialidad <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="nombre"
                    placeholder="Ej: Gastroenterología, Neurología"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    formControlName="descripcion"
                    placeholder="Descripción de la especialidad médica"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  ></textarea>
                  <p class="text-xs text-gray-500 mt-1">
                    Breve descripción del área de especialización
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Estado inicial</label>
                  <select formControlName="estado" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="Activa">
                      <div class="flex items-center gap-2">
                        <span>Activa</span>
                      </div>
                    </option>
                    <option value="Inactiva">
                      <div class="flex items-center gap-2">
                        <span>Inactiva</span>
                      </div>
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Médicos asignados</label>
                  <input
                    value="0 médicos (nueva especialidad)"
                    disabled
                    class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              <!-- Información adicional -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex gap-3">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <lucide-icon [img]="stethoscopeIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                    </div>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-medium text-blue-900 mb-1">
                      Información importante
                    </h4>
                    <ul class="text-sm text-blue-800 space-y-1">
                      <li>• El código debe ser único en el sistema</li>
                      <li>• Use códigos cortos y descriptivos (ej: CARDIO, DERMATO)</li>
                      <li>• La especialidad podrá asignarse a médicos desde el módulo de Médicos</li>
                      <li>• Puede cambiar el estado a Inactiva para ocultar la especialidad</li>
                    </ul>
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
                [disabled]="!formNuevaEspecialidad.valid"
                class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
                Agregar especialidad
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
        <div class="bg-gradient-to-r from-purple-600 to-violet-600 px-6 py-4 text-white flex-shrink-0">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <lucide-icon [img]="stethoscopeIcon" class="w-5 h-5"></lucide-icon>
                <h2 class="text-lg font-semibold">Editar Especialidad Médica</h2>
              </div>
              <p class="text-purple-100 text-sm mt-1">Modifique la información de la especialidad médica</p>
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
          <form [formGroup]="formEditarEspecialidad" (ngSubmit)="guardarCambios()" class="p-6 space-y-6">
            <div class="space-y-4">
              <div class="pb-2 border-b">
                <h3 class="font-medium text-gray-900">Información de la especialidad</h3>
                <p class="text-sm text-gray-600">Datos principales de la especialidad médica</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">ID de la especialidad</label>
                  <input
                    type="text"
                    [value]="especialidadSeleccionada?.id"
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
                    placeholder="Ej: MED-INT"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select formControlName="estado" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
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
                    placeholder="Ej: Medicina Interna"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    formControlName="descripcion"
                    placeholder="Descripción de la especialidad"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad de médicos</label>
                  <input
                    type="text"
                    [value]="especialidadSeleccionada?.medicos + ' médicos registrados'"
                    disabled
                    class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                  <p class="text-xs text-gray-500 mt-1">Este campo es de solo lectura</p>
                </div>
              </div>
            </div>

            <!-- Indicador de cambios -->
            <div *ngIf="formEditarEspecialidad.dirty" class="bg-amber-50 border border-amber-200 rounded-lg p-3">
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
              [disabled]="!formEditarEspecialidad.valid || !formEditarEspecialidad.dirty"
              class="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
export class EspecialidadesComponent implements OnInit {
    // Icons
    stethoscopeIcon = Stethoscope;
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
        { label: 'Especialidades', route: '/catalogos/especialidades' }
    ];

    // Data
    searchTerm = '';
    mostrarModalNueva = false;
    mostrarPanelEdicion = false;
    especialidadSeleccionada: Especialidad | null = null;

    // Forms
    formNuevaEspecialidad: FormGroup;
    formEditarEspecialidad: FormGroup;

    especialidades: Especialidad[] = [
        {
            id: 'ESP-001',
            codigo: 'MED-INT',
            nombre: 'Medicina Interna',
            descripcion: 'Diagnóstico y tratamiento de enfermedades del adulto',
            medicos: 12,
            estado: 'Activa',
            fechaCreacion: '2024-01-15'
        },
        {
            id: 'ESP-002',
            codigo: 'CARDIO',
            nombre: 'Cardiología',
            descripcion: 'Especialidad del corazón y sistema cardiovascular',
            medicos: 8,
            estado: 'Activa',
            fechaCreacion: '2024-01-15'
        },
        {
            id: 'ESP-003',
            codigo: 'ENDOCR',
            nombre: 'Endocrinología',
            descripcion: 'Especialidad de hormonas y metabolismo',
            medicos: 6,
            estado: 'Activa',
            fechaCreacion: '2024-01-15'
        },
        {
            id: 'ESP-004',
            codigo: 'MED-FAM',
            nombre: 'Medicina Familiar',
            descripcion: 'Atención integral de la familia',
            medicos: 15,
            estado: 'Activa',
            fechaCreacion: '2024-01-15'
        },
        {
            id: 'ESP-005',
            codigo: 'PEDIATR',
            nombre: 'Pediatría',
            descripcion: 'Atención médica de niños y adolescentes',
            medicos: 10,
            estado: 'Activa',
            fechaCreacion: '2024-01-15'
        }
    ];

    constructor(private fb: FormBuilder) {
        this.formNuevaEspecialidad = this.fb.group({
            codigo: ['', [Validators.required, Validators.maxLength(20)]],
            nombre: ['', [Validators.required, Validators.maxLength(100)]],
            descripcion: ['', Validators.maxLength(255)],
            estado: ['Activa', Validators.required]
        });

        this.formEditarEspecialidad = this.fb.group({
            codigo: ['', [Validators.required, Validators.maxLength(20)]],
            nombre: ['', [Validators.required, Validators.maxLength(100)]],
            descripcion: ['', Validators.maxLength(255)],
            estado: ['Activa', Validators.required]
        });
    }

    ngOnInit() {
        // Initialize component
    }

    get filteredEspecialidades() {
        if (!this.searchTerm) {
            return this.especialidades;
        }
        return this.especialidades.filter(esp =>
            esp.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            esp.codigo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            esp.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

    abrirModalNueva() {
        this.mostrarModalNueva = true;
        this.formNuevaEspecialidad.reset({
            codigo: '',
            nombre: '',
            descripcion: '',
            estado: 'Activa'
        });
    }

    cerrarModalNueva() {
        this.mostrarModalNueva = false;
        this.formNuevaEspecialidad.reset();
    }

    guardarNuevaEspecialidad() {
        if (this.formNuevaEspecialidad.valid) {
            const formData = this.formNuevaEspecialidad.value;
            
            // Verificar si el código ya existe
            const codigoExiste = this.especialidades.some(esp => 
                esp.codigo.toLowerCase() === formData.codigo.toLowerCase()
            );
            
            if (codigoExiste) {
                alert('Ya existe una especialidad con este código');
                return;
            }

            const nuevaEspecialidad: Especialidad = {
                id: `ESP-${(this.especialidades.length + 1).toString().padStart(3, '0')}`,
                codigo: formData.codigo.toUpperCase(),
                nombre: formData.nombre,
                descripcion: formData.descripcion || '',
                medicos: 0,
                estado: formData.estado,
                fechaCreacion: new Date().toISOString().split('T')[0]
            };

            this.especialidades.push(nuevaEspecialidad);
            this.cerrarModalNueva();
            
            // Simular notificación de éxito
            console.log(`Especialidad agregada: ${nuevaEspecialidad.nombre}`);
        }
    }

    editarEspecialidad(especialidad: Especialidad) {
        this.especialidadSeleccionada = especialidad;
        this.mostrarPanelEdicion = true;
        
        this.formEditarEspecialidad.patchValue({
            codigo: especialidad.codigo,
            nombre: especialidad.nombre,
            descripcion: especialidad.descripcion,
            estado: especialidad.estado
        });
    }

    cerrarPanelEdicion() {
        if (this.formEditarEspecialidad.dirty) {
            if (confirm('¿Desea descartar los cambios realizados?')) {
                this.mostrarPanelEdicion = false;
                this.especialidadSeleccionada = null;
                this.formEditarEspecialidad.reset();
            }
        } else {
            this.mostrarPanelEdicion = false;
            this.especialidadSeleccionada = null;
            this.formEditarEspecialidad.reset();
        }
    }

    guardarCambios() {
        if (this.formEditarEspecialidad.valid && this.especialidadSeleccionada) {
            const formData = this.formEditarEspecialidad.value;
            
            // Verificar si el código ya existe en otra especialidad
            const codigoExiste = this.especialidades.some(esp => 
                esp.id !== this.especialidadSeleccionada!.id && 
                esp.codigo.toLowerCase() === formData.codigo.toLowerCase()
            );
            
            if (codigoExiste) {
                alert('Ya existe otra especialidad con este código');
                return;
            }

            const index = this.especialidades.findIndex(e => e.id === this.especialidadSeleccionada!.id);
            if (index > -1) {
                this.especialidades[index] = {
                    ...this.especialidadSeleccionada,
                    codigo: formData.codigo.toUpperCase(),
                    nombre: formData.nombre,
                    descripcion: formData.descripcion || '',
                    estado: formData.estado
                };
            }

            this.cerrarPanelEdicion();
            
            // Simular notificación de éxito
            console.log(`Especialidad actualizada: ${formData.nombre}`);
        }
    }
}