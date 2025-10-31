import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LucideAngularModule,
  Globe,
  Plus,
  Search,
  Edit,
  X,
  Save,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FilterX
} from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';

interface Pais {
  id: string;
  codigo: string;
  nombre: string;
  region: string;
  codigoTelefonico: string;
  estado: 'active' | 'inactive';
}

@Component({
  selector: 'app-paises',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      title="Catálogo de Países" 
      description="Países y regiones del sistema"
      [icon]="globeIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-teal-600 via-cyan-500 to-blue-600"
      [hasActionButton]="true">
      
      <button 
        slot="action"
        (click)="abrirModalNuevo()"
        class="bg-white text-teal-600 hover:bg-teal-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
      >
        <lucide-icon [img]="plusIcon" class="w-5 h-5"></lucide-icon>
        Nuevo país
      </button>
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

      <!-- Tabla principal -->
      <div class="mt-6 bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Países Registrados</h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ paises.length }} país{{ paises.length !== 1 ? 'es' : '' }} • Doble clic para editar
            </p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Región</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código telefónico</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let pais of paises" 
                  class="cursor-pointer hover:bg-gray-50 transition-colors"
                  (dblclick)="editarPais(pais)">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-gray-900">
                  {{ pais.codigo }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ pais.nombre }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [ngClass]="{
                          'bg-blue-100 text-blue-700 border border-blue-300': pais.region === 'América Latina',
                          'bg-green-100 text-green-700 border border-green-300': pais.region === 'América del Norte',
                          'bg-purple-100 text-purple-700 border border-purple-300': pais.region === 'Europa',
                          'bg-orange-100 text-orange-700 border border-orange-300': pais.region === 'Asia',
                          'bg-yellow-100 text-yellow-700 border border-yellow-300': pais.region === 'África',
                          'bg-pink-100 text-pink-700 border border-pink-300': pais.region === 'Oceanía'
                        }">
                    {{ pais.region }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {{ pais.codigoTelefonico }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [ngClass]="{
                          'bg-green-100 text-green-700 border border-green-300': pais.estado === 'active',
                          'bg-red-100 text-red-700 border border-red-300': pais.estado === 'inactive'
                        }">
                    {{ pais.estado === 'active' ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    (click)="editarPais(pais); $event.stopPropagation()"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <lucide-icon [img]="editIcon" class="w-4 h-4 mr-2"></lucide-icon>
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Nuevo País -->
      <div *ngIf="mostrarModalNuevo" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black bg-opacity-50" (click)="cerrarModalNuevo()"></div>
        
        <!-- Modal centrado -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl" (click)="$event.stopPropagation()">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div class="flex items-center gap-2">
                <lucide-icon [img]="globeIcon" class="w-5 h-5 text-teal-600"></lucide-icon>
                <h3 class="text-lg font-semibold text-gray-900">Nuevo País</h3>
              </div>
              <button (click)="cerrarModalNuevo()" class="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100">
                <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
              </button>
            </div>
            
            <!-- Contenido -->
            <div class="px-6 py-4">
              <p class="text-sm text-gray-600 mb-6">Agregue un nuevo país al catálogo del sistema</p>
              
              <form [formGroup]="formNuevo" (ngSubmit)="guardarNuevoPais()" class="space-y-6">
            <p class="text-sm text-gray-600">Agregue un nuevo país al catálogo del sistema</p>
            
            <div class="space-y-4">
              <div class="pb-2 border-b">
                <h4 class="font-medium text-gray-900">Información del país</h4>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Código ISO <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="codigo"
                    placeholder="Ej: MX"
                    maxlength="2"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono uppercase"
                  />
                  <p class="text-xs text-gray-500 mt-1">Código ISO 3166-1 alpha-2 (2 letras)</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select formControlName="estado" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>

                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del país <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    formControlName="nombre"
                    placeholder="Ej: México"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Región geográfica</label>
                  <select formControlName="region" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option value="América Latina">América Latina</option>
                    <option value="América del Norte">América del Norte</option>
                    <option value="Europa">Europa</option>
                    <option value="Asia">Asia</option>
                    <option value="África">África</option>
                    <option value="Oceanía">Oceanía</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Código telefónico</label>
                  <input
                    type="text"
                    formControlName="codigoTelefonico"
                    placeholder="Ej: +52"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
                  />
                  <p class="text-xs text-gray-500 mt-1">Incluir el símbolo + (Ej: +52)</p>
                </div>
              </div>

              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex gap-2">
                  <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></lucide-icon>
                  <div>
                    <p class="text-sm font-medium text-blue-900">Estándar ISO 3166-1</p>
                    <p class="text-sm text-blue-700 mt-1">
                      Los códigos de país siguen el estándar internacional ISO 3166-1 alpha-2. Utilice códigos oficiales de dos letras.
                    </p>
                  </div>
                </div>
              </div>
            </div>

              </form>
            </div>
            
            <!-- Footer -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div class="flex justify-end gap-3">
                <button
                  type="button"
                  (click)="cerrarModalNuevo()"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  (click)="guardarNuevoPais()"
                  [disabled]="!formNuevo.valid"
                  class="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
                  Agregar país
                </button>
              </div>
            </div>
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
          <div class="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4 text-white flex-shrink-0">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="globeIcon" class="w-5 h-5"></lucide-icon>
                  <h2 class="text-lg font-semibold">Editar País</h2>
                </div>
                <p class="text-teal-100 text-sm mt-1">Modifique la información del país en el sistema</p>
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
            <form [formGroup]="formEdicion" (ngSubmit)="guardarEdicion()" class="p-6 space-y-6">
                <div class="space-y-4">
                  <div class="pb-2 border-b">
                    <h3 class="font-medium text-gray-900">Información del país</h3>
                    <p class="text-sm text-gray-600">Datos principales del país</p>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-1">ID del país</label>
                      <input
                        type="text"
                        [value]="paisSeleccionado?.id"
                        disabled
                        class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Código ISO <span class="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        formControlName="codigo"
                        maxlength="2"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono uppercase"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <select formControlName="estado" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                      </select>
                    </div>

                    <div class="col-span-2">
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Nombre <span class="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        formControlName="nombre"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Región</label>
                      <select formControlName="region" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                        <option value="América Latina">América Latina</option>
                        <option value="América del Norte">América del Norte</option>
                        <option value="Europa">Europa</option>
                        <option value="Asia">Asia</option>
                        <option value="África">África</option>
                        <option value="Oceanía">Oceanía</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Código telefónico</label>
                      <input
                        type="text"
                        formControlName="codigoTelefonico"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono"
                      />
                    </div>
                  </div>
                </div>

                <!-- Indicador de cambios -->
                <div *ngIf="tienesCambios" class="bg-amber-50 border border-amber-200 rounded-lg p-3">
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
                (click)="guardarEdicion()"
                [disabled]="!formEdicion.valid || !tienesCambios"
                class="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <lucide-icon [img]="saveIcon" class="w-4 h-4"></lucide-icon>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </app-page-layout>
  `
})
export class PaisesComponent implements OnInit {
  // Iconos
  globeIcon = Globe;
  plusIcon = Plus;
  searchIcon = Search;
  editIcon = Edit;
  xIcon = X;
  saveIcon = Save;
  checkCircle2Icon = CheckCircle2;
  xCircleIcon = XCircle;
  alertTriangleIcon = AlertTriangle;
  filterXIcon = FilterX;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Catálogos clínicos', route: '/catalogos' },
    { label: 'Países', route: '/catalogos/paises' }
  ];

  // Datos
  paises: Pais[] = [
    { id: "COUNTRY-001", codigo: "MX", nombre: "México", region: "América Latina", codigoTelefonico: "+52", estado: "active" },
    { id: "COUNTRY-002", codigo: "US", nombre: "Estados Unidos", region: "América del Norte", codigoTelefonico: "+1", estado: "active" },
    { id: "COUNTRY-003", codigo: "CO", nombre: "Colombia", region: "América Latina", codigoTelefonico: "+57", estado: "active" },
    { id: "COUNTRY-004", codigo: "AR", nombre: "Argentina", region: "América Latina", codigoTelefonico: "+54", estado: "active" },
    { id: "COUNTRY-005", codigo: "ES", nombre: "España", region: "Europa", codigoTelefonico: "+34", estado: "active" }
  ];

  // Estados de modales
  mostrarModalNuevo = false;
  mostrarPanelEdicion = false;
  paisSeleccionado: Pais | null = null;
  tienesCambios = false;

  // Formularios
  formNuevo: FormGroup;
  formEdicion: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formNuevo = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      nombre: ['', Validators.required],
      region: ['América Latina', Validators.required],
      codigoTelefonico: [''],
      estado: ['active', Validators.required]
    });

    this.formEdicion = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      nombre: ['', Validators.required],
      region: ['', Validators.required],
      codigoTelefonico: [''],
      estado: ['active', Validators.required]
    });
  }

  ngOnInit() {
    // Detectar cambios en el formulario de edición
    this.formEdicion.valueChanges.subscribe(() => {
      this.tienesCambios = this.formEdicion.dirty;
    });
  }

  abrirModalNuevo() {
    this.mostrarModalNuevo = true;
    this.formNuevo.reset({
      codigo: '',
      nombre: '',
      region: 'América Latina',
      codigoTelefonico: '',
      estado: 'active'
    });
  }

  cerrarModalNuevo() {
    this.mostrarModalNuevo = false;
    this.formNuevo.reset();
  }

  guardarNuevoPais() {
    if (this.formNuevo.valid) {
      const formData = this.formNuevo.value;
      
      // Validar código único
      const codigoExiste = this.paises.some(p => p.codigo.toUpperCase() === formData.codigo.toUpperCase());
      if (codigoExiste) {
        alert(`El código ISO "${formData.codigo}" ya está registrado`);
        return;
      }

      // Generar ID único
      const nuevoId = `COUNTRY-${(this.paises.length + 1).toString().padStart(3, '0')}`;

      const nuevoPais: Pais = {
        id: nuevoId,
        codigo: formData.codigo.toUpperCase(),
        nombre: formData.nombre,
        region: formData.region,
        codigoTelefonico: formData.codigoTelefonico,
        estado: formData.estado
      };

      this.paises.push(nuevoPais);
      this.cerrarModalNuevo();
      
      // Simular notificación de éxito
      console.log(`País agregado: ${nuevoPais.nombre} ha sido agregado al catálogo`);
    }
  }

  editarPais(pais: Pais) {
    this.paisSeleccionado = pais;
    this.mostrarPanelEdicion = true;
    this.tienesCambios = false;
    
    this.formEdicion.patchValue({
      codigo: pais.codigo,
      nombre: pais.nombre,
      region: pais.region,
      codigoTelefonico: pais.codigoTelefonico,
      estado: pais.estado
    });
    
    this.formEdicion.markAsPristine();
  }

  cerrarPanelEdicion() {
    if (this.tienesCambios) {
      if (confirm('¿Desea descartar los cambios realizados?')) {
        this.mostrarPanelEdicion = false;
        this.paisSeleccionado = null;
        this.tienesCambios = false;
        this.formEdicion.reset();
      }
    } else {
      this.mostrarPanelEdicion = false;
      this.paisSeleccionado = null;
      this.formEdicion.reset();
    }
  }

  guardarEdicion() {
    if (this.formEdicion.valid && this.paisSeleccionado) {
      const formData = this.formEdicion.value;
      
      // Actualizar el país en la lista
      const index = this.paises.findIndex(p => p.id === this.paisSeleccionado!.id);
      if (index !== -1) {
        this.paises[index] = {
          ...this.paisSeleccionado,
          codigo: formData.codigo.toUpperCase(),
          nombre: formData.nombre,
          region: formData.region,
          codigoTelefonico: formData.codigoTelefonico,
          estado: formData.estado
        };
      }

      this.cerrarPanelEdicion();
      
      // Simular notificación de éxito
      console.log(`País actualizado: ${formData.nombre} ha sido actualizado correctamente`);
    }
  }
}