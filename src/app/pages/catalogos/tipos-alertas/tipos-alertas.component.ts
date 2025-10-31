import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LucideAngularModule,
  AlertTriangle,
  Plus,
  Search,
  Edit,
  X,
  Save,
  CheckCircle2,
  XCircle,
  ListChecks,
  FilterX
} from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';

interface TipoAlerta {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  severidad: 'critical' | 'warning' | 'info';
  autoDisparo: boolean;
  requiereJustificacion: boolean;
  estado: 'active' | 'inactive';
}

@Component({
  selector: 'app-tipos-alertas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      title="Tipos de Alertas" 
      description="Configuración de tipos de alertas clínicas del sistema"
      [icon]="listChecksIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-red-600 via-orange-500 to-amber-600"
      [hasActionButton]="true">
      
      <button 
        slot="action"
        (click)="abrirModalNuevo()"
        class="bg-white text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
      >
        <lucide-icon [img]="plusIcon" class="w-5 h-5"></lucide-icon>
        Nuevo tipo de alerta
      </button>
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

      <!-- Tabla principal -->
      <div class="mt-6 bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Tipos de Alertas Registrados</h2>
            <p class="text-sm text-gray-600 mt-1">
              {{ tiposAlertas.length }} tipo{{ tiposAlertas.length !== 1 ? 's' : '' }} de alerta • Doble clic para editar
            </p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severidad</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Auto-disparo</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Requiere justificación</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let alerta of tiposAlertas" 
                  class="cursor-pointer hover:bg-gray-50 transition-colors"
                  (dblclick)="editarTipoAlerta(alerta)">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold text-gray-900">
                  {{ alerta.codigo }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ alerta.nombre }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-300">
                    {{ alerta.categoria }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getSeverityBadgeClass(alerta.severidad)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border">
                    {{ getSeverityLabel(alerta.severidad) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <lucide-icon 
                    [img]="alerta.autoDisparo ? checkCircle2Icon : xCircleIcon" 
                    [class]="alerta.autoDisparo ? 'w-5 h-5 text-green-600' : 'w-5 h-5 text-gray-400'">
                  </lucide-icon>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <lucide-icon 
                    [img]="alerta.requiereJustificacion ? checkCircle2Icon : xCircleIcon" 
                    [class]="alerta.requiereJustificacion ? 'w-5 h-5 text-green-600' : 'w-5 h-5 text-gray-400'">
                  </lucide-icon>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    (click)="editarTipoAlerta(alerta)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
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

      <!-- Modal de nuevo tipo de alerta -->
      <div *ngIf="mostrarModalNuevo" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
          <div class="flex items-center justify-between pb-4 border-b">
            <div class="flex items-center gap-2">
              <lucide-icon [img]="listChecksIcon" class="w-5 h-5 text-red-600"></lucide-icon>
              <h3 class="text-lg font-semibold text-gray-900">Nuevo Tipo de Alerta</h3>
            </div>
            <button (click)="cerrarModalNuevo()" class="text-gray-400 hover:text-gray-600">
              <lucide-icon [img]="xIcon" class="w-6 h-6"></lucide-icon>
            </button>
          </div>

          <form [formGroup]="formularioNuevo" (ngSubmit)="guardarNuevo()" class="mt-6">
            <div class="space-y-6">
              <!-- Información básica -->
              <div class="space-y-4">
                <div class="pb-2 border-b">
                  <h4 class="font-medium text-gray-900">Información básica</h4>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Código <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      formControlName="codigo"
                      placeholder="Ej: INTER-DRUG"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono"
                      style="text-transform: uppercase"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select formControlName="estado" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option value="active">Activa</option>
                      <option value="inactive">Inactiva</option>
                    </select>
                  </div>

                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Nombre <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      formControlName="nombre"
                      placeholder="Ej: Interacción medicamentosa"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select formControlName="categoria" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option value="Farmacológica">Farmacológica</option>
                      <option value="Seguridad">Seguridad</option>
                      <option value="Dosificación">Dosificación</option>
                      <option value="Contraindicación">Contraindicación</option>
                      <option value="Alergia">Alergia</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Severidad</label>
                    <select formControlName="severidad" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option value="critical">Crítico</option>
                      <option value="warning">Advertencia</option>
                      <option value="info">Información</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Configuración de comportamiento -->
              <div class="space-y-4">
                <div class="pb-2 border-b">
                  <h4 class="font-medium text-gray-900">Configuración de comportamiento</h4>
                </div>

                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 border rounded-lg">
                    <div class="flex-1">
                      <label class="block text-sm font-medium text-gray-700">Auto-disparo automático</label>
                      <p class="text-sm text-gray-600">
                        La alerta se dispara automáticamente cuando se detecta la condición
                      </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" formControlName="autoDisparo" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between p-4 border rounded-lg">
                    <div class="flex-1">
                      <label class="block text-sm font-medium text-gray-700">Requiere justificación médica</label>
                      <p class="text-sm text-gray-600">
                        El médico debe justificar su decisión si continúa con la acción
                      </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" formControlName="requiereJustificacion" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                type="button"
                (click)="cerrarModalNuevo()"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="!formularioNuevo.valid"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
                Agregar tipo de alerta
              </button>
            </div>
          </form>
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
          <div class="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4 text-white flex-shrink-0">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="listChecksIcon" class="w-5 h-5"></lucide-icon>
                  <h2 class="text-lg font-semibold">Editar Tipo de Alerta</h2>
                </div>
                <p class="text-red-100 text-sm mt-1">Modifique la configuración del tipo de alerta clínica</p>
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
            <form [formGroup]="formularioEdicion" (ngSubmit)="guardarEdicion()" class="p-6 space-y-6">
              <!-- Información básica -->
              <div class="space-y-4">
                <div class="pb-2 border-b">
                  <h3 class="font-medium text-gray-900">Información básica</h3>
                  <p class="text-sm text-gray-600">Datos principales del tipo de alerta</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">ID del tipo de alerta</label>
                    <input
                      type="text"
                      [value]="tipoAlertaSeleccionado?.id"
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
                      placeholder="Ej: INTER-DRUG"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select formControlName="estado" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option value="active">Activa</option>
                      <option value="inactive">Inactiva</option>
                    </select>
                  </div>

                  <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Nombre <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      formControlName="nombre"
                      placeholder="Ej: Interacción medicamentosa"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select formControlName="categoria" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option value="Farmacológica">Farmacológica</option>
                      <option value="Seguridad">Seguridad</option>
                      <option value="Dosificación">Dosificación</option>
                      <option value="Contraindicación">Contraindicación</option>
                      <option value="Alergia">Alergia</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Severidad</label>
                    <select formControlName="severidad" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option value="critical">Crítico</option>
                      <option value="warning">Advertencia</option>
                      <option value="info">Información</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Configuración de comportamiento -->
              <div class="space-y-4">
                <div class="pb-2 border-b">
                  <h3 class="font-medium text-gray-900">Configuración de comportamiento</h3>
                  <p class="text-sm text-gray-600">Opciones de activación y respuesta de la alerta</p>
                </div>

                <div class="space-y-4">
                  <div class="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div class="flex-1">
                      <label class="block text-sm font-medium text-gray-700">Auto-disparo automático</label>
                      <p class="text-sm text-gray-600">
                        La alerta se dispara automáticamente cuando se detecta la condición
                      </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" formControlName="autoDisparo" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div class="flex-1">
                      <label class="block text-sm font-medium text-gray-700">Requiere justificación médica</label>
                      <p class="text-sm text-gray-600">
                        El médico debe justificar su decisión si continúa con la acción
                      </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" formControlName="requiereJustificacion" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Indicador de cambios -->
              <div *ngIf="hayCambios" class="bg-amber-50 border border-amber-200 rounded-lg p-3">
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
                [disabled]="!formularioEdicion.valid || !hayCambios"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
export class TiposAlertasComponent implements OnInit {
  // Iconos
  listChecksIcon = ListChecks;
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
    { label: 'Tipos de alertas', route: '/catalogos/tipos-alertas' }
  ];

  // Datos
  tiposAlertas: TipoAlerta[] = [
    { id: "ALT-001", codigo: "INTER-DRUG", nombre: "Interacción medicamentosa", categoria: "Farmacológica", severidad: "critical", autoDisparo: true, requiereJustificacion: true, estado: "active" },
    { id: "ALT-002", codigo: "ALLERGY", nombre: "Alergia conocida", categoria: "Seguridad", severidad: "critical", autoDisparo: true, requiereJustificacion: false, estado: "active" },
    { id: "ALT-003", codigo: "DOSE-HIGH", nombre: "Dosis alta", categoria: "Dosificación", severidad: "warning", autoDisparo: true, requiereJustificacion: true, estado: "active" },
    { id: "ALT-004", codigo: "RENAL-ADJUST", nombre: "Ajuste por función renal", categoria: "Contraindicación", severidad: "warning", autoDisparo: true, requiereJustificacion: false, estado: "active" },
    { id: "ALT-005", codigo: "PREGNANCY", nombre: "Riesgo en embarazo", categoria: "Seguridad", severidad: "info", autoDisparo: true, requiereJustificacion: true, estado: "active" }
  ];

  // Estados del componente
  mostrarModalNuevo = false;
  mostrarPanelEdicion = false;
  tipoAlertaSeleccionado: TipoAlerta | null = null;
  hayCambios = false;

  // Formularios
  formularioNuevo!: FormGroup;
  formularioEdicion!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.inicializarFormularios();
  }

  inicializarFormularios() {
    this.formularioNuevo = this.fb.group({
      codigo: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      categoria: ['Farmacológica', [Validators.required]],
      severidad: ['warning', [Validators.required]],
      autoDisparo: [true],
      requiereJustificacion: [false],
      estado: ['active', [Validators.required]]
    });

    this.formularioEdicion = this.fb.group({
      codigo: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      severidad: ['', [Validators.required]],
      autoDisparo: [false],
      requiereJustificacion: [false],
      estado: ['', [Validators.required]]
    });

    // Detectar cambios en el formulario de edición
    this.formularioEdicion.valueChanges.subscribe(() => {
      this.hayCambios = this.formularioEdicion.dirty;
    });
  }

  // Métodos para obtener clases y etiquetas de severidad
  getSeverityBadgeClass(severity: string): string {
    const classes = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      warning: 'bg-orange-100 text-orange-700 border-orange-300',
      info: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return classes[severity as keyof typeof classes] || classes.info;
  }

  getSeverityLabel(severity: string): string {
    const labels = {
      critical: 'Crítico',
      warning: 'Advertencia',
      info: 'Información'
    };
    return labels[severity as keyof typeof labels] || 'Información';
  }

  // Métodos del modal de nuevo tipo de alerta
  abrirModalNuevo() {
    this.mostrarModalNuevo = true;
    this.formularioNuevo.reset({
      codigo: '',
      nombre: '',
      categoria: 'Farmacológica',
      severidad: 'warning',
      autoDisparo: true,
      requiereJustificacion: false,
      estado: 'active'
    });
  }

  cerrarModalNuevo() {
    this.mostrarModalNuevo = false;
    this.formularioNuevo.reset();
  }

  guardarNuevo() {
    if (this.formularioNuevo.valid) {
      const nuevoTipoAlerta: TipoAlerta = {
        id: `ALT-${(this.tiposAlertas.length + 1).toString().padStart(3, '0')}`,
        ...this.formularioNuevo.value
      };

      this.tiposAlertas.push(nuevoTipoAlerta);
      this.cerrarModalNuevo();
      
      // Simular notificación de éxito
      console.log('Tipo de alerta agregado:', nuevoTipoAlerta.nombre);
    }
  }

  // Métodos del panel de edición
  editarTipoAlerta(tipoAlerta: TipoAlerta) {
    this.tipoAlertaSeleccionado = tipoAlerta;
    this.formularioEdicion.patchValue({
      codigo: tipoAlerta.codigo,
      nombre: tipoAlerta.nombre,
      categoria: tipoAlerta.categoria,
      severidad: tipoAlerta.severidad,
      autoDisparo: tipoAlerta.autoDisparo,
      requiereJustificacion: tipoAlerta.requiereJustificacion,
      estado: tipoAlerta.estado
    });
    this.formularioEdicion.markAsPristine();
    this.hayCambios = false;
    this.mostrarPanelEdicion = true;
  }

  cerrarPanelEdicion() {
    if (this.hayCambios) {
      if (confirm('¿Desea descartar los cambios realizados?')) {
        this.mostrarPanelEdicion = false;
        this.tipoAlertaSeleccionado = null;
        this.hayCambios = false;
        this.formularioEdicion.reset();
      }
    } else {
      this.mostrarPanelEdicion = false;
      this.tipoAlertaSeleccionado = null;
      this.formularioEdicion.reset();
    }
  }

  guardarEdicion() {
    if (this.formularioEdicion.valid && this.tipoAlertaSeleccionado) {
      const index = this.tiposAlertas.findIndex(t => t.id === this.tipoAlertaSeleccionado!.id);
      if (index !== -1) {
        this.tiposAlertas[index] = {
          ...this.tipoAlertaSeleccionado,
          ...this.formularioEdicion.value
        };
      }

      this.cerrarPanelEdicion();
      
      // Simular notificación de éxito
      console.log('Tipo de alerta actualizado:', this.tipoAlertaSeleccionado.nombre);
    }
  }
}