import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LucideAngularModule, FileText, Edit, Search, Calendar, User, Trash2, Send, Eye, Clock, Pill, AlertTriangle, ChevronLeft, ChevronRight, Info, MoreVertical, X, UserCheck, Stethoscope, Copy, CheckCircle, Loader2 } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';
import { RoleSuggestionService } from '../../../services/role-suggestion.service';
import { PrescripcionesService, PrescriptionDto } from '../../../services/prescripciones.service';
import { PatientService } from '../../../services/patient.service';

interface Borrador {
  id: string;
  paciente: {
    nombre: string;
    cedula: string;
    edad: number;
    genero: 'M' | 'F';
  };
  diagnostico: string;
  medicamentos: {
    nombre: string;
    dosis: string;
    cantidad: number;
    frecuencia: string;
    duracion: string;
  }[];
  fechaCreacion: string;
  fechaModificacion: string;
  medico: {
    nombre: string;
    especialidad: string;
    codigoMedico: string;
    firmaDigital: boolean;
  };
}

@Component({
  selector: 'app-borradores',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, BreadcrumbsComponent, PageHeaderComponent, RoleSuggestionModalComponent],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumbs -->
      <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>
      
      <!-- Page Header -->
      <app-page-header 
        title="Mis Borradores" 
        description="Prescripciones guardadas pendientes de finalizar"
        [icon]="editIcon">
      </app-page-header>

      <!-- Estadísticas rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow border-l-4 border-l-orange-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Total Borradores</p>
              <p class="text-3xl font-bold text-gray-900">{{ borradores.length }}</p>
            </div>
            <div class="p-3 bg-orange-100 rounded-lg">
              <lucide-icon [img]="editIcon" class="w-8 h-8 text-orange-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-blue-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Hoy</p>
              <p class="text-3xl font-bold text-gray-900">{{ borradoresHoy }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-lg">
              <lucide-icon [img]="calendarIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-purple-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Pacientes Únicos</p>
              <p class="text-3xl font-bold text-gray-900">{{ pacientesUnicos }}</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-lg">
              <lucide-icon [img]="userIcon" class="w-8 h-8 text-purple-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-green-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Medicamentos</p>
              <p class="text-3xl font-bold text-gray-900">{{ totalMedicamentos }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-lg">
              <lucide-icon [img]="pillIcon" class="w-8 h-8 text-green-600"></lucide-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Búsqueda y filtros -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
            <input
              type="text"
              [(ngModel)]="terminoBusqueda"
              (input)="filtrarBorradores()"
              placeholder="Buscar por paciente, número de receta o ID..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div class="flex gap-2">
            <select 
              [(ngModel)]="filtroFecha"
              (change)="filtrarBorradores()"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Todas las fechas</option>
              <option value="hoy">Creados hoy</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mes</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tabla de borradores -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-orange-100 rounded-lg">
                <lucide-icon [img]="fileTextIcon" class="w-5 h-5 text-orange-600"></lucide-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Borradores de Prescripciones</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ borradoresFiltrados.length }} borrador{{ borradoresFiltrados.length !== 1 ? 'es' : '' }} encontrado{{ borradoresFiltrados.length !== 1 ? 's' : '' }} • Doble clic para vista rápida
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-0">
          <!-- Estado de carga -->
          <div *ngIf="isLoading" class="p-12 text-center">
            <div class="flex justify-center mb-4">
              <div class="p-4 bg-orange-100 rounded-full animate-pulse">
                <lucide-icon [img]="loaderIcon" class="w-12 h-12 text-orange-600 animate-spin"></lucide-icon>
              </div>
            </div>
            <h3 class="text-lg text-gray-900 mb-2">Cargando borradores...</h3>
            <p class="text-gray-600">Por favor espera mientras cargamos tus prescripciones.</p>
          </div>

          <!-- Estado de error -->
          <div *ngIf="error && !isLoading" class="p-12 text-center">
            <div class="flex justify-center mb-4">
              <div class="p-4 bg-red-100 rounded-full">
                <lucide-icon [img]="alertTriangleIcon" class="w-12 h-12 text-red-600"></lucide-icon>
              </div>
            </div>
            <h3 class="text-lg text-gray-900 mb-2">Error al cargar borradores</h3>
            <p class="text-gray-600 mb-4">{{ error }}</p>
            <button 
              (click)="loadDrafts()"
              class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Reintentar
            </button>
          </div>

          <!-- Sin resultados -->
          <div *ngIf="!isLoading && !error && borradoresFiltrados.length === 0" class="p-12 text-center">
            <div class="flex justify-center mb-4">
              <div class="p-4 bg-gray-100 rounded-full">
                <lucide-icon [img]="editIcon" class="w-12 h-12 text-gray-400"></lucide-icon>
              </div>
            </div>
            <h3 class="text-lg text-gray-900 mb-2">No hay borradores</h3>
            <p class="text-gray-600">
              {{ terminoBusqueda 
                ? "No se encontraron borradores que coincidan con tu búsqueda."
                : "No tienes prescripciones guardadas como borrador."
              }}
            </p>
          </div>

          <div *ngIf="!isLoading && !error && borradoresFiltrados.length > 0" class="overflow-x-auto" style="max-height: 500px; overflow-y: auto;">
            <table class="w-full min-w-[1200px]">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Receta</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad/Sexo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamentos</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Modificación</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let borrador of borradoresPaginados" 
                    class="hover:bg-orange-50/50 cursor-pointer transition-all"
                    (dblclick)="verBorrador(borrador)"
                    title="Doble clic para ver detalles">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <lucide-icon [img]="fileTextIcon" class="w-4 h-4 text-orange-600"></lucide-icon>
                      <div class="flex flex-col">
                        <span class="font-medium">{{ borrador.id }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p class="font-medium text-gray-900">{{ borrador.paciente.nombre }}</p>
                      <p class="text-xs text-gray-500">{{ borrador.paciente.cedula }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <lucide-icon [img]="userIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                      <span class="text-sm">{{ borrador.paciente.edad }} años / {{ borrador.paciente.genero }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <lucide-icon [img]="pillIcon" class="w-4 h-4 text-purple-600"></lucide-icon>
                      <span>{{ borrador.medicamentos.length }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <lucide-icon [img]="calendarIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                      <span class="text-sm">{{ borrador.fechaCreacion }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <lucide-icon [img]="clockIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                      <span class="text-sm">{{ borrador.fechaModificacion }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800 border-orange-200">
                      <lucide-icon [img]="alertTriangleIcon" class="w-3 h-3 mr-1"></lucide-icon>
                      Borrador
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="relative">
                      <button 
                        (click)="toggleAccionesModal(borrador.id); $event.stopPropagation()"
                        class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        title="Más acciones"
                      >
                        <lucide-icon [img]="moreVerticalIcon" class="w-5 h-5"></lucide-icon>
                      </button>
                      
                      <!-- Modal de acciones -->
                      <div 
                        *ngIf="modalAccionesAbierto === borrador.id"
                        (click)="$event.stopPropagation()"
                        class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                      >
                        <div class="py-2">
                          <div class="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                            Acciones
                          </div>
                          
                          <button 
                            (click)="verBorrador(borrador); cerrarModalAcciones()"
                            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                          >
                            <lucide-icon [img]="eyeIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                            Ver detalles
                          </button>
                          
                          <button 
                            (click)="editarBorrador(borrador); cerrarModalAcciones()"
                            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                          >
                            <lucide-icon [img]="editIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                            Continuar editando
                          </button>
                          
                          <button 
                            (click)="duplicarBorrador(borrador); cerrarModalAcciones()"
                            class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                          >
                            <lucide-icon [img]="copyIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                            Duplicar borrador
                          </button>
                          
                          <div class="border-t border-gray-100 mt-1 pt-1">
                            <button 
                              (click)="eliminarBorrador(borrador); cerrarModalAcciones()"
                              class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                            >
                              <lucide-icon [img]="trash2Icon" class="w-4 h-4 text-red-500"></lucide-icon>
                              Eliminar borrador
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Paginación -->
        <div *ngIf="!isLoading && !error && borradoresFiltrados.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Mostrando {{ (paginaActual - 1) * elementosPorPagina + 1 }} a {{ Math.min(paginaActual * elementosPorPagina, borradoresFiltrados.length) }} de {{ borradoresFiltrados.length }} borradores
            </div>
            <div class="flex items-center space-x-2">
              <button 
                (click)="cambiarPagina(paginaActual - 1)"
                [disabled]="paginaActual === 1"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                <lucide-icon [img]="chevronLeftIcon" class="w-4 h-4"></lucide-icon>
                Anterior
              </button>
              
              <div class="flex space-x-1">
                <button 
                  *ngFor="let pagina of getPaginas()"
                  (click)="cambiarPagina(pagina)"
                  [class]="pagina === paginaActual 
                    ? 'px-3 py-2 text-sm font-medium text-white bg-orange-600 border border-orange-600 rounded-md'
                    : 'px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50'">
                  {{ pagina }}
                </button>
              </div>
              
              <button 
                (click)="cambiarPagina(paginaActual + 1)"
                [disabled]="paginaActual === totalPaginas"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                Siguiente
                <lucide-icon [img]="chevronRightIcon" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Información sobre borradores -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <lucide-icon [img]="infoIcon" class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"></lucide-icon>
          <div>
            <h4 class="text-sm font-medium text-blue-900 mb-1">Información sobre borradores</h4>
            <p class="text-sm text-blue-700">
              Los borradores se guardan automáticamente cada vez que realizas cambios. Haz doble clic en cualquier fila para ver detalles rápidos, o usa "Continuar editando" para edición completa. Los borradores no son válidos para dispensación hasta que sean finalizados y firmados digitalmente.
            </p>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal lateral derecho para detalles de borrador -->
    <div 
      *ngIf="borradorSeleccionado"
      class="fixed inset-0 z-50 overflow-hidden"
      (click)="cerrarModalDetalles()"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <!-- Panel lateral -->
      <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col"
           (click)="$event.stopPropagation()">
        
        <!-- Header del modal -->
        <div class="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 text-white flex-shrink-0">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <lucide-icon [img]="editIcon" class="w-5 h-5"></lucide-icon>
                <h2 class="text-lg font-semibold">Borrador de Receta</h2>
              </div>
              <p class="text-orange-100 text-sm mt-1">{{ borradorSeleccionado.id }}</p>
            </div>
            <button 
              (click)="cerrarModalDetalles()"
              class="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
            </button>
          </div>
        </div>

        <!-- Contenido del modal con scroll -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-6 space-y-6">
          
          <!-- Estado del borrador -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-4 h-4 text-gray-600"></lucide-icon>
                <span class="text-sm font-medium text-gray-700">Estado del borrador</span>
              </div>
              <span class="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border-orange-200">
                <lucide-icon [img]="alertTriangleIcon" class="w-3 h-3 mr-1 inline"></lucide-icon>
                Borrador
              </span>
            </div>
          </div>

          <!-- Información del Paciente -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <lucide-icon [img]="userIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
              <h3 class="text-lg font-semibold text-gray-900">Información del Paciente</h3>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p class="text-sm text-gray-600">Nombre completo</p>
                <p class="font-semibold text-gray-900">{{ borradorSeleccionado.paciente.nombre }}</p>
              </div>
              
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <p class="text-xs text-gray-600">Identificación</p>
                  <p class="text-sm font-medium text-gray-900">{{ borradorSeleccionado.paciente.cedula }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600">Edad</p>
                  <p class="text-sm font-medium text-gray-900">{{ borradorSeleccionado.paciente.edad }} años</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600">Sexo</p>
                  <p class="text-sm font-medium text-gray-900">{{ borradorSeleccionado.paciente.genero === 'M' ? 'Masculino' : 'Femenino' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Médico Prescriptor -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <lucide-icon [img]="stethoscopeIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
              <h3 class="text-lg font-semibold text-gray-900">Médico Prescriptor</h3>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p class="font-semibold text-gray-900">{{ borradorSeleccionado.medico.nombre }}</p>
                <p class="text-sm text-gray-600">{{ borradorSeleccionado.medico.especialidad }}</p>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="alertTriangleIcon" class="w-4 h-4 text-orange-600"></lucide-icon>
                  <span class="text-xs text-orange-700 font-medium">Pendiente de firma digital</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Diagnóstico -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <lucide-icon [img]="fileTextIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
              <h3 class="text-lg font-semibold text-gray-900">Diagnóstico</h3>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-900">{{ borradorSeleccionado.diagnostico }}</p>
            </div>
          </div>

          <!-- Medicamentos -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <lucide-icon [img]="pillIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
                <h3 class="text-lg font-semibold text-gray-900">Medicamentos ({{ borradorSeleccionado.medicamentos.length }})</h3>
              </div>
            </div>
            
            <div class="space-y-3">
              <div *ngFor="let medicamento of borradorSeleccionado.medicamentos" 
                   class="bg-gray-50 rounded-lg p-4 border-l-4 border-l-orange-500">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 mb-2">{{ medicamento.nombre }}</h4>
                    
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p class="text-gray-600">Dosis: <span class="font-medium text-gray-900">{{ medicamento.dosis }}</span></p>
                        <p class="text-gray-600">Frecuencia: <span class="font-medium text-gray-900">{{ medicamento.frecuencia }}</span></p>
                      </div>
                      <div>
                        <p class="text-gray-600">Duración: <span class="font-medium text-gray-900">{{ medicamento.duracion }}</span></p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="ml-4 text-right">
                    <span class="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                      <lucide-icon [img]="clockIcon" class="w-3 h-3 mr-1"></lucide-icon>
                      Borrador
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fechas -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="calendarIcon" class="w-4 h-4 text-gray-600"></lucide-icon>
                <span class="text-sm font-medium text-gray-700">Fecha de creación</span>
              </div>
              <p class="text-sm text-gray-900">{{ borradorSeleccionado.fechaCreacion }}</p>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="clockIcon" class="w-4 h-4 text-gray-600"></lucide-icon>
                <span class="text-sm font-medium text-gray-700">Última modificación</span>
              </div>
              <p class="text-sm text-gray-900">{{ borradorSeleccionado.fechaModificacion }}</p>
            </div>
          </div>
          </div>
        </div>

        <!-- Footer con botones de acción -->
        <div class="border-t border-gray-200 px-6 py-4 bg-gray-50 space-y-3 flex-shrink-0">
          <button 
            (click)="editarBorrador(borradorSeleccionado)"
            class="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <lucide-icon [img]="editIcon" class="w-4 h-4"></lucide-icon>
            Continuar editando
          </button>
          
          <button 
            (click)="completarBorrador(borradorSeleccionado)"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <lucide-icon [img]="sendIcon" class="w-4 h-4"></lucide-icon>
            Finalizar y emitir
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Duplicar Borrador -->
    <div 
      *ngIf="modalDuplicarAbierto"
      class="fixed inset-0 z-50 overflow-y-auto"
      (click)="cerrarModalDuplicar()"
    >
      <!-- Overlay -->
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <!-- Modal -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
             (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <lucide-icon [img]="checkCircleIcon" class="h-6 w-6 text-green-600"></lucide-icon>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Borrador duplicado exitosamente
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Se ha creado una copia del borrador con un nuevo número de receta. El borrador duplicado aparece ahora al inicio de la lista.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Información del nuevo borrador -->
          <div *ngIf="borradorDuplicado" class="px-4 pb-4 sm:px-6">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <lucide-icon [img]="fileTextIcon" class="w-4 h-4 text-green-600 mr-2"></lucide-icon>
                <span class="text-sm font-medium text-green-800">Nuevo borrador creado</span>
              </div>
              <div class="text-sm text-green-700 space-y-1">
                <p><strong>Número:</strong> {{ borradorDuplicado.id }}</p>
                <p><strong>Original:</strong> {{ borradorOriginal?.id }}</p>
                <p><strong>Paciente:</strong> {{ borradorDuplicado.paciente.nombre }}</p>
                <p><strong>{{ borradorDuplicado.medicamentos.length }} medicamento(s) copiado(s)</strong></p>
              </div>
            </div>
          </div>

          <!-- Pregunta sobre qué hacer -->
          <div class="px-4 pb-4 sm:px-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-blue-800 mb-2 flex items-center">
                <lucide-icon [img]="infoIcon" class="w-4 h-4 mr-2"></lucide-icon>
                ¿Qué deseas hacer?
              </h4>
              <div class="space-y-2 text-sm text-blue-700">
                <div class="flex items-center">
                  <lucide-icon [img]="editIcon" class="w-4 h-4 mr-2"></lucide-icon>
                  <span><strong>Continuar editando:</strong> Abre el borrador duplicado para realizar modificaciones inmediatas.</span>
                </div>
                <div class="flex items-center">
                  <lucide-icon [img]="eyeIcon" class="w-4 h-4 mr-2"></lucide-icon>
                  <span><strong>Permanecer en la lista:</strong> Quédate en la vista de borradores para revisar o duplicar otros.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
            <button 
              (click)="continuarEditandoDuplicado()"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              <lucide-icon [img]="editIcon" class="w-4 h-4 mr-2"></lucide-icon>
              Continuar editando
            </button>
            <button 
              (click)="cerrarModalDuplicar()"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Permanecer en la lista
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Eliminar Borrador -->
    <div 
      *ngIf="modalEliminarAbierto"
      class="fixed inset-0 z-50 overflow-y-auto"
      (click)="cerrarModalEliminar()"
    >
      <!-- Overlay -->
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <!-- Modal -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
             (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <lucide-icon [img]="trash2Icon" class="h-6 w-6 text-red-600"></lucide-icon>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Eliminar borrador
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    ¿Estás seguro de que deseas eliminar este borrador? Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Información del borrador a eliminar -->
          <div *ngIf="borradorAEliminar" class="px-4 pb-4 sm:px-6">
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="text-sm text-red-700 space-y-1">
                <p><strong>Número:</strong> {{ borradorAEliminar.id }}</p>
                <p><strong>Paciente:</strong> {{ borradorAEliminar.paciente.nombre }}</p>
                <p><strong>Medicamentos:</strong> {{ borradorAEliminar.medicamentos.length }}</p>
                <p><strong>Creado:</strong> {{ borradorAEliminar.fechaCreacion }}</p>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
            <button 
              (click)="confirmarEliminarBorrador()"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
              <lucide-icon [img]="trash2Icon" class="w-4 h-4 mr-2"></lucide-icon>
              Eliminar borrador
            </button>
            <button 
              (click)="cerrarModalEliminar()"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de sugerencia de rol -->
    <app-role-suggestion-modal
      [isOpen]="showRoleSuggestionModal()"
      [suggestedRole]="'Médico'"
      (dismiss)="onRoleSuggestionDismiss()"
      (roleChanged)="onRoleChanged()"
    ></app-role-suggestion-modal>
  `
})
export class BorradoresComponent implements OnInit, OnDestroy {
  fileTextIcon = FileText;
  editIcon = Edit;
  searchIcon = Search;
  calendarIcon = Calendar;
  userIcon = User;
  trash2Icon = Trash2;
  sendIcon = Send;
  eyeIcon = Eye;
  clockIcon = Clock;
  pillIcon = Pill;
  alertTriangleIcon = AlertTriangle;
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;
  infoIcon = Info;
  moreVerticalIcon = MoreVertical;
  xIcon = X;
  userCheckIcon = UserCheck;
  stethoscopeIcon = Stethoscope;
  copyIcon = Copy;
  checkCircleIcon = CheckCircle;
  loaderIcon = Loader2;

  terminoBusqueda = '';
  filtroFecha = '';
  borradoresFiltrados: Borrador[] = [];
  borradoresPaginados: Borrador[] = [];
  
  // Estados de carga
  isLoading = false;
  error: string | null = null;
  
  // Modal de acciones
  modalAccionesAbierto: string | null = null;
  
  // Modal de detalles
  borradorSeleccionado: Borrador | null = null;
  
  // Modal de duplicar
  modalDuplicarAbierto = false;
  borradorDuplicado: Borrador | null = null;
  borradorOriginal: Borrador | null = null;
  
  // Modal de eliminar
  modalEliminarAbierto = false;
  borradorAEliminar: Borrador | null = null;

  // Paginación
  paginaActual = 1;
  elementosPorPagina = 10;
  totalPaginas = 0;

  // Estadísticas
  borradoresHoy = 0;
  borradoresEstaSemana = 0;
  pacientesUnicos = 0;
  totalMedicamentos = 0;

  // Role suggestion modal state
  showRoleSuggestionModal = signal(false);
  private subscriptions = new Subscription();

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Prescripciones', route: '/prescripciones' },
    { label: 'Borradores'}
  ];

  // Datos reales (sin mock)
  borradores: Borrador[] = [];

  constructor(
    private router: Router,
    private roleDemoService: RoleDemoService,
    private roleSuggestionService: RoleSuggestionService,
    private prescripcionesService: PrescripcionesService,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    // Verificar si se debe mostrar el modal de sugerencia de rol
    this.checkRoleSuggestion();
    
    // Suscribirse a cambios de rol
    const roleSubscription = this.roleDemoService.currentSession$.subscribe(session => {
      if (session.activeRole === 'Médico') {
        this.showRoleSuggestionModal.set(false);
        this.roleSuggestionService.clearDismissedPages();
      }
    });
    
    this.subscriptions.add(roleSubscription);
    
    // Cargar borradores desde el backend
    this.loadDrafts();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private checkRoleSuggestion() {
    const currentSession = this.roleDemoService.getCurrentSession();
    
    if (currentSession.activeRole !== 'Médico' && 
        currentSession.activeRole !== 'Administrador') {
      this.showRoleSuggestionModal.set(true);
    } else {
      this.showRoleSuggestionModal.set(false);
    }
  }

  onRoleSuggestionDismiss() {
    this.showRoleSuggestionModal.set(false);
  }

  onRoleChanged() {
    this.showRoleSuggestionModal.set(false);
    // El modal se cerrará automáticamente cuando cambie el rol
  }

  /**
   * Cargar borradores desde el backend
   */
  loadDrafts() {
    this.isLoading = true;
    this.error = null;

    this.prescripcionesService.getPrescripciones({ status: 'draft' }).subscribe({
      next: (response) => {
        // El API retorna un objeto paginado con items[]
        const prescriptions = response.items || [];
        this.borradores = this.mapPrescriptionsToBorradores(prescriptions);
        this.borradoresFiltrados = [...this.borradores];
        this.calcularEstadisticas();
        this.actualizarPaginacion();
        this.isLoading = false;
        console.log(`Loaded ${this.borradores.length} drafts from backend`);
      },
      error: (error) => {
        this.error = 'Error al cargar los borradores. Por favor, intenta de nuevo.';
        this.isLoading = false;
        console.error('Error loading drafts:', error);
      }
    });
  }

  /**
   * Mapear PrescriptionDto[] a Borrador[]
   */
  private mapPrescriptionsToBorradores(prescriptions: PrescriptionDto[]): Borrador[] {
    return prescriptions.map(prescription => this.mapPrescriptionToBorrador(prescription));
  }

  /**
   * Mapear un PrescriptionDto a Borrador
   */
  private mapPrescriptionToBorrador(prescription: PrescriptionDto): Borrador {
    // Obtener el diagnóstico principal
    const diagnosticoPrincipal = prescription.diagnoses.find(d => d.isPrimary);
    const diagnostico = diagnosticoPrincipal 
      ? `${diagnosticoPrincipal.description} (${diagnosticoPrincipal.cie10Code})`
      : prescription.diagnoses[0]?.description || 'Sin diagnóstico';

    return {
      id: prescription.prescriptionNumber,
      paciente: {
        nombre: 'Cargando...', // Se cargará con una llamada adicional si es necesario
        cedula: prescription.patientId,
        edad: 0, // Se cargará con una llamada adicional si es necesario
        genero: 'M' // Se cargará con una llamada adicional si es necesario
      },
      diagnostico: diagnostico,
      medicamentos: prescription.medications.map(med => ({
        nombre: med.medicationName,
        dosis: med.dosage,
        cantidad: med.duration, // Asumiendo que duration es la cantidad de días
        frecuencia: med.frequency,
        duracion: `${med.duration} días`
      })),
      fechaCreacion: this.formatDate(prescription.createdAt),
      fechaModificacion: this.formatDate(prescription.updatedAt),
      medico: {
        nombre: 'Cargando...', // Se cargará con una llamada adicional si es necesario
        especialidad: 'Cargando...',
        codigoMedico: prescription.doctorId,
        firmaDigital: prescription.status === 'issued' || prescription.status === 'dispensed'
      }
    };
  }

  /**
   * Formatear fecha ISO a formato local
   */
  private formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calcularEstadisticas() {
    const hoy = '27/09/2025';
    this.borradoresHoy = this.borradores.filter(b => b.fechaCreacion === hoy).length;
    this.pacientesUnicos = new Set(this.borradores.map(b => b.paciente.cedula)).size;
    this.totalMedicamentos = this.borradores.reduce((total, b) => total + (b.medicamentos?.length || 0), 0);

    // Calcular borradores de esta semana
    const inicioSemana = new Date();
    inicioSemana.setDate(inicioSemana.getDate() - 7);
    this.borradoresEstaSemana = this.borradores.filter(borrador => {
      const fechaBorrador = new Date(borrador.fechaCreacion);
      return fechaBorrador >= inicioSemana;
    }).length;
  }

  filtrarBorradores() {
    let filtrados = [...this.borradores];

    // Filtrar por término de búsqueda
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase();
      filtrados = filtrados.filter(borrador =>
        borrador.id.toLowerCase().includes(termino) ||
        borrador.paciente.nombre.toLowerCase().includes(termino) ||
        borrador.paciente.cedula.includes(termino) ||
        borrador.diagnostico.toLowerCase().includes(termino)
      );
    }

    // Filtrar por fecha
    if (this.filtroFecha) {
      const hoy = new Date();
      filtrados = filtrados.filter(borrador => {
        const fechaBorrador = new Date(borrador.fechaCreacion);

        switch (this.filtroFecha) {
          case 'hoy':
            return fechaBorrador.toDateString() === hoy.toDateString();
          case 'semana':
            const inicioSemana = new Date(hoy);
            inicioSemana.setDate(hoy.getDate() - 7);
            return fechaBorrador >= inicioSemana;
          case 'mes':
            const inicioMes = new Date(hoy);
            inicioMes.setDate(hoy.getDate() - 30);
            return fechaBorrador >= inicioMes;
          default:
            return true;
        }
      });
    }

    this.borradoresFiltrados = filtrados;
    this.paginaActual = 1; // Resetear a la primera página al filtrar
    this.actualizarPaginacion();
  }



  verBorrador(borrador: Borrador) {
    this.borradorSeleccionado = borrador;
    this.cerrarModalAcciones();
  }

  cerrarModalDetalles() {
    this.borradorSeleccionado = null;
  }

  toggleAccionesModal(borradorId: string) {
    this.modalAccionesAbierto = this.modalAccionesAbierto === borradorId ? null : borradorId;
  }

  cerrarModalAcciones() {
    this.modalAccionesAbierto = null;
  }

  editarBorrador(borrador: Borrador) {
    // Navegar a nueva receta con parámetros del borrador
    this.router.navigate(['/prescripciones/nueva'], {
      queryParams: { borrador: borrador.id }
    });
  }

  completarBorrador(borrador: Borrador) {
    if (confirm(`¿Está seguro de que desea completar y emitir la prescripción ${borrador.id}?`)) {
      console.log('Completar borrador:', borrador);
      // Aquí iría la lógica para completar el borrador
      alert('Prescripción completada y emitida exitosamente');
    }
  }



  // Métodos de paginación
  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(this.borradoresFiltrados.length / this.elementosPorPagina);
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.borradoresPaginados = this.borradoresFiltrados.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
    }
  }

  getPaginas(): number[] {
    const paginas: number[] = [];
    const maxPaginas = 5; // Mostrar máximo 5 números de página

    let inicio = Math.max(1, this.paginaActual - Math.floor(maxPaginas / 2));
    let fin = Math.min(this.totalPaginas, inicio + maxPaginas - 1);

    // Ajustar el inicio si estamos cerca del final
    if (fin - inicio < maxPaginas - 1) {
      inicio = Math.max(1, fin - maxPaginas + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  // Método auxiliar para Math.min en el template
  Math = Math;

  duplicarBorrador(borrador: Borrador) {
    // Obtener la prescripción original del backend para duplicarla
    this.prescripcionesService.getPrescriptionById(borrador.id).subscribe({
      next: (originalPrescription) => {
        // Crear DTO para nueva prescripción (copia)
        const newPrescriptionDto = {
          patientId: originalPrescription.patientId,
          doctorId: originalPrescription.doctorId,
          diagnoses: originalPrescription.diagnoses,
          medications: originalPrescription.medications,
          notes: originalPrescription.notes ? `Copia de ${borrador.id} - ${originalPrescription.notes}` : `Copia de ${borrador.id}`
        };

        // Crear nueva prescripción en el backend
        this.prescripcionesService.createPrescripcion(newPrescriptionDto).subscribe({
          next: (newPrescription) => {
            // Mapear la nueva prescripción a Borrador
            const borradorDuplicado = this.mapPrescriptionToBorrador(newPrescription);
            
            // Agregar al inicio de la lista
            this.borradores.unshift(borradorDuplicado);
            
            // Actualizar datos para el modal
            this.borradorOriginal = borrador;
            this.borradorDuplicado = borradorDuplicado;
            
            // Refiltrar y repaginar
            this.filtrarBorradores();
            
            // Mostrar modal de confirmación
            this.modalDuplicarAbierto = true;
            
            console.log('Borrador duplicado:', borradorDuplicado);
          },
          error: (error) => {
            console.error('Error al duplicar borrador:', error);
            alert('Error al duplicar el borrador. Por favor, intenta de nuevo.');
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener borrador original:', error);
        alert('Error al obtener el borrador original. Por favor, intenta de nuevo.');
      }
    });
  }

  eliminarBorrador(borrador: Borrador) {
    this.borradorAEliminar = borrador;
    this.modalEliminarAbierto = true;
  }

  // Métodos para el modal de duplicar
  cerrarModalDuplicar() {
    this.modalDuplicarAbierto = false;
    this.borradorDuplicado = null;
    this.borradorOriginal = null;
  }

  continuarEditandoDuplicado() {
    if (this.borradorDuplicado) {
      this.editarBorrador(this.borradorDuplicado);
    }
    this.cerrarModalDuplicar();
  }

  // Métodos para el modal de eliminar
  cerrarModalEliminar() {
    this.modalEliminarAbierto = false;
    this.borradorAEliminar = null;
  }

  confirmarEliminarBorrador() {
    if (this.borradorAEliminar) {
      const borradorId = this.borradorAEliminar.id;
      
      // Llamar al servicio para eliminar del backend
      this.prescripcionesService.deletePrescripcion(borradorId).subscribe({
        next: () => {
          // Eliminar del array local
          this.borradores = this.borradores.filter(b => b.id !== borradorId);
          
          // Refiltrar y repaginar
          this.filtrarBorradores();
          
          console.log('Borrador eliminado:', borradorId);
        },
        error: (error) => {
          console.error('Error al eliminar borrador:', error);
          alert('Error al eliminar el borrador. Por favor, intenta de nuevo.');
        }
      });
    }
    this.cerrarModalEliminar();
  }

}