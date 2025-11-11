import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LucideAngularModule, FileText, CheckCircle, Search, Calendar, User, Eye, Download, QrCode, Filter, Pill, ChevronLeft, ChevronRight, Info, XCircle, Clock, MoreVertical, Printer, Ban, X, UserCheck, Stethoscope } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';
import { RoleSuggestionService } from '../../../services/role-suggestion.service';

interface RecetaEmitida {
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
    estado?: 'dispensado' | 'pendiente';
  }[];
  fechaEmision: string;
  fechaVencimiento: string;
  estado: 'emitida' | 'dispensada' | 'parcialmente-dispensada' | 'vencida' | 'anulada';
  farmacia?: string | null;
  fechaDispensacion?: string | null;
  fechaAnulacion?: string;
  motivoAnulacion?: string;
  medico: {
    nombre: string;
    especialidad: string;
    codigoMedico: string;
    firmaDigital: boolean;
  };
}

@Component({
  selector: 'app-emitidas',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, BreadcrumbsComponent, PageHeaderComponent, RoleSuggestionModalComponent],
  template: `
    <div class="space-y-6" (click)="cerrarModalAcciones()">
      <!-- Breadcrumbs -->
      <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>
      
      <!-- Page Header -->
      <app-page-header 
        title="Recetas Emitidas" 
        description="Prescripciones firmadas digitalmente y listas para dispensación"
        [icon]="checkCircleIcon"
        [actionButton]="true">
        <div slot="action" class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30">
          <div class="text-right">
            <p class="text-xs text-white/80">Total de recetas</p>
            <p class="text-2xl font-bold text-white">{{ recetas.length }}</p>
          </div>
        </div>
      </app-page-header>

      <!-- Estadísticas rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div class="bg-white rounded-lg shadow border-l-4 border-l-blue-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Emitidas</p>
              <p class="text-3xl font-bold text-gray-900">{{ recetasEmitidas }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-lg">
              <lucide-icon [img]="fileTextIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-yellow-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Parcialmente</p>
              <p class="text-3xl font-bold text-gray-900">{{ recetasParciales }}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-lg">
              <lucide-icon [img]="clockIcon" class="w-8 h-8 text-yellow-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-green-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Completadas</p>
              <p class="text-3xl font-bold text-gray-900">{{ recetasDispensadas }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-lg">
              <lucide-icon [img]="checkCircleIcon" class="w-8 h-8 text-green-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-red-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Anuladas</p>
              <p class="text-3xl font-bold text-gray-900">{{ recetasAnuladas }}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-lg">
              <lucide-icon [img]="xCircleIcon" class="w-8 h-8 text-red-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-purple-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Medicamentos</p>
              <p class="text-3xl font-bold text-gray-900">{{ totalMedicamentos }}</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-lg">
              <lucide-icon [img]="pillIcon" class="w-8 h-8 text-purple-600"></lucide-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid gap-4 md:grid-cols-4">
          <div class="relative">
            <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
            <input 
              type="text" 
              [(ngModel)]="terminoBusqueda"
              (input)="filtrarRecetas()"
              placeholder="Buscar por paciente, ID o diagnóstico..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
          </div>
          
          <select 
            [(ngModel)]="filtroEstado"
            (change)="filtrarRecetas()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="emitida">Emitida</option>
            <option value="dispensada">Dispensada</option>
            <option value="parcialmente-dispensada">Parcialmente Dispensada</option>
            <option value="vencida">Vencida</option>
            <option value="anulada">Anulada</option>
          </select>
          
          <input 
            type="date" 
            [(ngModel)]="fechaDesde"
            (change)="filtrarRecetas()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
          
          <input 
            type="date" 
            [(ngModel)]="fechaHasta"
            (change)="filtrarRecetas()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
        </div>
      </div>



      <!-- Tabla de recetas emitidas -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <lucide-icon [img]="checkCircleIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Recetas Emitidas</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ recetasFiltradas.length }} receta{{ recetasFiltradas.length !== 1 ? 's' : '' }} encontrada{{ recetasFiltradas.length !== 1 ? 's' : '' }} • Doble clic para vista rápida
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2">
                <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
                Exportar
              </button>
            </div>
          </div>
        </div>
        
        <div *ngIf="recetasFiltradas.length === 0" class="text-center py-12">
          <lucide-icon [img]="fileTextIcon" class="w-16 h-16 text-gray-300 mx-auto mb-4"></lucide-icon>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay recetas</h3>
          <p class="text-gray-600">No se encontraron recetas con los filtros aplicados</p>
        </div>

        <div *ngIf="recetasFiltradas.length > 0" class="overflow-x-auto" style="max-height: 500px; overflow-y: auto;">
          <table class="w-full min-w-[1200px]">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número de Receta</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de emisión</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Válida hasta</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamentos</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let receta of recetasPaginadas" 
                  class="hover:bg-blue-50/50 cursor-pointer transition-all"
                  (dblclick)="verReceta(receta)"
                  title="Doble clic para ver detalles">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <lucide-icon [img]="fileTextIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                    <span class="font-medium">{{ receta.id }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p class="font-medium text-gray-900">{{ receta.paciente.nombre }}</p>
                    <p class="text-xs text-gray-500">{{ receta.paciente.cedula }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <lucide-icon [img]="calendarIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                    <span class="text-sm">{{ receta.fechaEmision }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <lucide-icon [img]="clockIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                    <span class="text-sm">{{ receta.fechaVencimiento }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <lucide-icon [img]="pillIcon" class="w-4 h-4 text-purple-600"></lucide-icon>
                    <span>{{ receta.medicamentos.length }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getEstadoClass(receta.estado)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getEstadoTexto(receta.estado) }}
                  </span>
                  <div *ngIf="receta.farmacia" class="text-xs text-gray-500 mt-1">{{ receta.farmacia }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="relative">
                    <button 
                      (click)="toggleAccionesModal(receta.id); $event.stopPropagation()"
                      class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                      title="Más acciones"
                    >
                      <lucide-icon [img]="moreVerticalIcon" class="w-5 h-5"></lucide-icon>
                    </button>
                    
                    <!-- Modal de acciones -->
                    <div 
                      *ngIf="modalAccionesAbierto === receta.id"
                      (click)="$event.stopPropagation()"
                      class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                      <div class="py-2">
                        <div class="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                          Acciones
                        </div>
                        
                        <button 
                          (click)="verReceta(receta); cerrarModalAcciones()"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <lucide-icon [img]="eyeIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                          Ver detalles
                        </button>
                        
                        <button 
                          (click)="reimprimirReceta(receta); cerrarModalAcciones()"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <lucide-icon [img]="printerIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                          Reimprimir
                        </button>
                        
                        <button 
                          (click)="descargarReceta(receta); cerrarModalAcciones()"
                          class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <lucide-icon [img]="downloadIcon" class="w-4 h-4 text-gray-500"></lucide-icon>
                          Exportar PDF
                        </button>
                        
                        <div *ngIf="receta.estado === 'emitida'" class="border-t border-gray-100 mt-1 pt-1">
                          <button 
                            (click)="anularReceta(receta); cerrarModalAcciones()"
                            class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                          >
                            <lucide-icon [img]="banIcon" class="w-4 h-4 text-red-500"></lucide-icon>
                            Anular receta
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

        <!-- Paginación -->
        <div *ngIf="recetasFiltradas.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Mostrando {{ (paginaActual - 1) * elementosPorPagina + 1 }} a {{ Math.min(paginaActual * elementosPorPagina, recetasFiltradas.length) }} de {{ recetasFiltradas.length }} recetas
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
                    ? 'px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md'
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

      <!-- Información sobre recetas emitidas -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <lucide-icon [img]="infoIcon" class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"></lucide-icon>
          <div>
            <h4 class="text-sm font-medium text-blue-900 mb-1">Información sobre recetas emitidas</h4>
            <p class="text-sm text-blue-700">
              Las recetas emitidas son firmadas digitalmente y tienen validez legal. Haz doble clic en cualquier fila para ver detalles completos. Puedes reimprimir, exportar a PDF o anular recetas según los permisos configurados. Las recetas tienen una validez de 14 días desde su emisión según normativa vigente.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal lateral derecho para detalles de receta -->
    <div 
      *ngIf="recetaSeleccionada"
      class="fixed inset-0 z-50 overflow-hidden"
      (click)="cerrarModalDetalles()"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <!-- Panel lateral -->
      <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col"
           (click)="$event.stopPropagation()">
        
        <!-- Header del modal -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white flex-shrink-0">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <lucide-icon [img]="fileTextIcon" class="w-5 h-5"></lucide-icon>
                <h2 class="text-lg font-semibold">Receta Emitida</h2>
              </div>
              <p class="text-blue-100 text-sm mt-1">{{ recetaSeleccionada.id }}</p>
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
          
          <!-- Estado de la receta -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <lucide-icon [img]="fileTextIcon" class="w-4 h-4 text-gray-600"></lucide-icon>
                <span class="text-sm font-medium text-gray-700">Estado de la receta</span>
              </div>
              <span [class]="getEstadoClass(recetaSeleccionada.estado)" 
                    class="px-3 py-1 text-xs font-semibold rounded-full">
                {{ getEstadoTexto(recetaSeleccionada.estado) }}
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
                <p class="font-semibold text-gray-900">{{ recetaSeleccionada.paciente.nombre }}</p>
              </div>
              
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <p class="text-xs text-gray-600">Identificación</p>
                  <p class="text-sm font-medium text-gray-900">{{ recetaSeleccionada.paciente.cedula }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600">Edad</p>
                  <p class="text-sm font-medium text-gray-900">{{ recetaSeleccionada.paciente.edad }} años</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600">Sexo</p>
                  <p class="text-sm font-medium text-gray-900">{{ recetaSeleccionada.paciente.genero === 'M' ? 'Masculino' : 'Femenino' }}</p>
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
                <p class="font-semibold text-gray-900">{{ recetaSeleccionada.medico.nombre }}</p>
                <p class="text-sm text-gray-600">{{ recetaSeleccionada.medico.especialidad }}</p>
              </div>
              
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="userCheckIcon" class="w-4 h-4 text-green-600"></lucide-icon>
                  <span class="text-xs text-green-700 font-medium">Firma digital verificada</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Medicamentos -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <lucide-icon [img]="pillIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
                <h3 class="text-lg font-semibold text-gray-900">Medicamentos ({{ recetaSeleccionada.medicamentos.length }})</h3>
              </div>
            </div>
            
            <div class="space-y-3">
              <div *ngFor="let medicamento of recetaSeleccionada.medicamentos" 
                   class="bg-gray-50 rounded-lg p-4 border-l-4 border-l-purple-500">
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
                    <span *ngIf="medicamento.estado === 'dispensado'" 
                          class="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      <lucide-icon [img]="checkCircleIcon" class="w-3 h-3 mr-1"></lucide-icon>
                      Dispensado
                    </span>
                    <span *ngIf="!medicamento.estado || medicamento.estado === 'pendiente'" 
                          class="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      <lucide-icon [img]="clockIcon" class="w-3 h-3 mr-1"></lucide-icon>
                      Pendiente
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
                <span class="text-sm font-medium text-gray-700">Fecha de emisión</span>
              </div>
              <p class="text-sm text-gray-900">{{ recetaSeleccionada.fechaEmision }}</p>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <lucide-icon [img]="clockIcon" class="w-4 h-4 text-gray-600"></lucide-icon>
                <span class="text-sm font-medium text-gray-700">Válida hasta</span>
              </div>
              <p class="text-sm text-gray-900">{{ recetaSeleccionada.fechaVencimiento }}</p>
            </div>
          </div>
          </div>
        </div>

        <!-- Footer con botón de acción -->
        <div class="border-t border-gray-200 px-6 py-4 bg-gray-50 flex-shrink-0">
          <button 
            (click)="reimprimirReceta(recetaSeleccionada)"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <lucide-icon [img]="printerIcon" class="w-4 h-4"></lucide-icon>
            Reimprimir receta
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Anular Receta -->
    <div 
      *ngIf="modalAnularAbierto"
      class="fixed inset-0 z-50 overflow-y-auto"
      (click)="cerrarModalAnular()"
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
                <lucide-icon [img]="banIcon" class="h-6 w-6 text-red-600"></lucide-icon>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  Anular receta médica
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    ¿Estás seguro de que deseas anular esta receta? Esta acción cambiará el estado de la receta a "anulada" y no podrá ser dispensada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Información de la receta a anular -->
          <div *ngIf="recetaAAnular" class="px-4 pb-4 sm:px-6">
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="text-sm text-red-700 space-y-1">
                <p><strong>Número:</strong> {{ recetaAAnular.id }}</p>
                <p><strong>Paciente:</strong> {{ recetaAAnular.paciente.nombre }}</p>
                <p><strong>Cédula:</strong> {{ recetaAAnular.paciente.cedula }}</p>
                <p><strong>Medicamentos:</strong> {{ recetaAAnular.medicamentos.length }}</p>
                <p><strong>Fecha de emisión:</strong> {{ recetaAAnular.fechaEmision }}</p>
                <p><strong>Estado actual:</strong> 
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-1">
                    Emitida
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Advertencia -->
          <div class="px-4 pb-4 sm:px-6">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-start">
                <lucide-icon [img]="infoIcon" class="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0"></lucide-icon>
                <div class="text-sm text-yellow-700">
                  <p class="font-medium mb-1">Importante:</p>
                  <ul class="list-disc list-inside space-y-1">
                    <li>La receta anulada no podrá ser dispensada en ninguna farmacia</li>
                    <li>Esta acción no se puede deshacer</li>
                    <li>Se generará un registro de auditoría de la anulación</li>
                    <li>El paciente deberá solicitar una nueva receta si la necesita</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
            <button 
              (click)="confirmarAnularReceta()"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
              <lucide-icon [img]="banIcon" class="w-4 h-4 mr-2"></lucide-icon>
              Anular receta
            </button>
            <button 
              (click)="cerrarModalAnular()"
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
export class EmitidasComponent implements OnInit, OnDestroy {
  fileTextIcon = FileText;
  checkCircleIcon = CheckCircle;
  searchIcon = Search;
  calendarIcon = Calendar;
  userIcon = User;
  eyeIcon = Eye;
  downloadIcon = Download;
  qrCodeIcon = QrCode;
  filterIcon = Filter;
  pillIcon = Pill;
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;
  infoIcon = Info;
  xCircleIcon = XCircle;
  clockIcon = Clock;
  moreVerticalIcon = MoreVertical;
  printerIcon = Printer;
  banIcon = Ban;
  xIcon = X;
  userCheckIcon = UserCheck;
  stethoscopeIcon = Stethoscope;

  terminoBusqueda = '';
  filtroEstado = '';
  fechaDesde = '';
  fechaHasta = '';
  recetasFiltradas: RecetaEmitida[] = [];
  recetasPaginadas: RecetaEmitida[] = [];

  // Modal de acciones
  modalAccionesAbierto: string | null = null;

  // Modal de detalles
  recetaSeleccionada: RecetaEmitida | null = null;
  
  // Modal de anular
  modalAnularAbierto = false;
  recetaAAnular: RecetaEmitida | null = null;

  // Paginación
  paginaActual = 1;
  elementosPorPagina = 10;
  totalPaginas = 0;

  // Estadísticas
  recetasEmitidas = 0;
  recetasDispensadas = 0;
  recetasParciales = 0;
  recetasAnuladas = 0;
  recetasVencidas = 0;
  recetasEsteMes = 0;
  totalMedicamentos = 0;

  // Role suggestion modal state
  showRoleSuggestionModal = signal(false);
  private subscriptions = new Subscription();

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Prescripciones', route: '/prescripciones' },
    { label: 'Recetas Emitidas'}
  ];

  recetas: RecetaEmitida[] = [
    {
      id: 'RX-2025-001234',
      paciente: {
        nombre: 'Carlos Rodríguez Sánchez',
        cedula: '1-0856-0432',
        edad: 45,
        genero: 'M'
      },
      diagnostico: 'Hipertensión arterial esencial (I10)',
      fechaEmision: '01/10/2025',
      fechaVencimiento: '15/10/2025',
      estado: 'emitida',
      medicamentos: [
        {
          nombre: 'Ibuprofeno',
          dosis: '400 mg',
          cantidad: 30,
          frecuencia: '3 veces al día',
          duracion: '5 días',
          estado: 'dispensado'
        }
      ],
      farmacia: null,
      fechaDispensacion: null,
      medico: {
        nombre: 'Dra. María Fernández López',
        especialidad: 'Medicina Interna',
        codigoMedico: 'MED-12345',
        firmaDigital: true
      }
    },
    {
      id: 'RX-2025-001235',
      paciente: {
        nombre: 'Ana García Mora',
        cedula: '2-0654-0821',
        edad: 32,
        genero: 'F'
      },
      diagnostico: 'Diabetes mellitus tipo 2 no insulinodependiente (E11.9)',
      fechaEmision: '15/01/2025',
      fechaVencimiento: '15/04/2025',
      estado: 'emitida',
      medicamentos: [
        {
          nombre: 'Metformina',
          dosis: '850mg',
          cantidad: 60,
          frecuencia: '2 veces al día',
          duracion: '30 días',
          estado: 'pendiente'
        },
        {
          nombre: 'Glibenclamida',
          dosis: '5mg',
          cantidad: 30,
          frecuencia: '1 vez al día',
          duracion: '30 días',
          estado: 'pendiente'
        }
      ],
      farmacia: null,
      fechaDispensacion: null,
      medico: {
        nombre: 'Dr. José Martínez Ruiz',
        especialidad: 'Endocrinología',
        codigoMedico: 'MED-67890',
        firmaDigital: true
      }
    },
    {
      id: 'RX-2025-009842',
      paciente: {
        nombre: 'Carlos Andrés Pérez Gutiérrez',
        cedula: '41.523.789',
        edad: 28,
        genero: 'M'
      },
      diagnostico: 'Migraña sin aura, episódica (G43.009)',
      fechaEmision: '01/10/2025',
      fechaVencimiento: '15/10/2025',
      estado: 'emitida',
      medicamentos: [
        {
          nombre: 'Sumatriptán',
          dosis: '50mg',
          cantidad: 6,
          frecuencia: 'Según necesidad',
          duracion: '14 días',
          estado: 'pendiente'
        }
      ],
      farmacia: null,
      fechaDispensacion: null,
      medico: {
        nombre: 'Dra. María Fernández López',
        especialidad: 'Neurología',
        codigoMedico: 'MED-12345',
        firmaDigital: true
      }
    },
    {
      id: 'RX-2025-009841',
      paciente: {
        nombre: 'Sandra Milena Torres Vargas',
        cedula: '52.367.941',
        edad: 35,
        genero: 'F'
      },
      diagnostico: 'Infección respiratoria aguda del tracto superior (J06.9)',
      fechaEmision: '01/10/2025',
      fechaVencimiento: '15/10/2025',
      estado: 'dispensada',
      medicamentos: [
        {
          nombre: 'Amoxicilina',
          dosis: '500mg',
          cantidad: 21,
          frecuencia: '3 veces al día',
          duracion: '7 días',
          estado: 'dispensado'
        },
        {
          nombre: 'Acetaminofén',
          dosis: '500mg',
          cantidad: 20,
          frecuencia: 'Cada 6 horas',
          duracion: '5 días',
          estado: 'dispensado'
        }
      ],
      farmacia: 'Farmacia Sucre',
      fechaDispensacion: '02/10/2025',
      medico: {
        nombre: 'Dra. María Fernández López',
        especialidad: 'Medicina General',
        codigoMedico: 'MED-12345',
        firmaDigital: true
      }
    },
    {
      id: 'RX-2025-009840',
      paciente: {
        nombre: 'Diego Fernando Ramírez Castro',
        cedula: '38.941.652',
        edad: 42,
        genero: 'M'
      },
      diagnostico: 'Hipertensión arterial esencial (I10)',
      fechaEmision: '30/09/2025',
      fechaVencimiento: '14/10/2025',
      estado: 'emitida',
      medicamentos: [
        {
          nombre: 'Enalapril',
          dosis: '10mg',
          cantidad: 30,
          frecuencia: '2 veces al día',
          duracion: '30 días',
          estado: 'pendiente'
        },
        {
          nombre: 'Hidroclorotiazida',
          dosis: '25mg',
          cantidad: 30,
          frecuencia: '1 vez al día',
          duracion: '30 días',
          estado: 'pendiente'
        }
      ],
      farmacia: null,
      fechaDispensacion: null,
      medico: {
        nombre: 'Dr. José Martínez Ruiz',
        especialidad: 'Cardiología',
        codigoMedico: 'MED-67890',
        firmaDigital: true
      }
    }
  ];

  constructor(
    private router: Router,
    private roleDemoService: RoleDemoService,
    private roleSuggestionService: RoleSuggestionService
  ) {
    this.recetasFiltradas = [...this.recetas];
    this.calcularEstadisticas();
    this.actualizarPaginacion();
  }

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

  filtrarRecetas() {
    let filtradas = [...this.recetas];

    // Filtrar por término de búsqueda
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase();
      filtradas = filtradas.filter(receta =>
        receta.id.toLowerCase().includes(termino) ||
        receta.paciente.nombre.toLowerCase().includes(termino) ||
        receta.paciente.cedula.includes(termino) ||
        receta.diagnostico.toLowerCase().includes(termino)
      );
    }

    // Filtrar por estado
    if (this.filtroEstado) {
      filtradas = filtradas.filter(receta => receta.estado === this.filtroEstado);
    }

    // Filtrar por rango de fechas
    if (this.fechaDesde) {
      filtradas = filtradas.filter(receta => receta.fechaEmision >= this.fechaDesde);
    }

    if (this.fechaHasta) {
      filtradas = filtradas.filter(receta => receta.fechaEmision <= this.fechaHasta);
    }

    this.recetasFiltradas = filtradas;
    this.paginaActual = 1; // Resetear a la primera página al filtrar
    this.actualizarPaginacion();
  }

  calcularEstadisticas() {
    this.recetasEmitidas = this.recetas.filter(r => r.estado === 'emitida').length;
    this.recetasDispensadas = this.recetas.filter(r => r.estado === 'dispensada').length;
    this.recetasParciales = this.recetas.filter(r => r.estado === 'parcialmente-dispensada').length;
    this.recetasAnuladas = this.recetas.filter(r => r.estado === 'anulada').length;
    this.recetasVencidas = this.recetas.filter(r => r.estado === 'vencida').length;

    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.recetasEsteMes = this.recetas.filter(receta => {
      const fechaReceta = new Date(receta.fechaEmision);
      return fechaReceta >= inicioMes;
    }).length;

    this.totalMedicamentos = this.recetas.reduce((total, receta) =>
      total + (receta.medicamentos?.length || 0), 0
    );
  }

  getEstadoClass(estado: string): string {
    const classes = {
      'emitida': 'bg-blue-100 text-blue-800',
      'dispensada': 'bg-green-100 text-green-800',
      'parcialmente-dispensada': 'bg-yellow-100 text-yellow-800',
      'vencida': 'bg-red-100 text-red-800',
      'anulada': 'bg-red-100 text-red-800 border border-red-200'
    };
    return classes[estado as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getEstadoTexto(estado: string): string {
    const textos = {
      'emitida': 'Emitida',
      'dispensada': 'Dispensada',
      'parcialmente-dispensada': 'Parcial',
      'vencida': 'Vencida',
      'anulada': 'Anulada'
    };
    return textos[estado as keyof typeof textos] || estado;
  }

  getDiasVencimiento(fechaVencimiento: string): string {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    if (diferencia < 0) {
      return `Vencida hace ${Math.abs(diferencia)} días`;
    } else if (diferencia === 0) {
      return 'Vence hoy';
    } else {
      return `${diferencia} días restantes`;
    }
  }

  getDiasVencimientoClass(fechaVencimiento: string): string {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = Math.ceil((vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    if (diferencia < 0) {
      return 'text-red-600';
    } else if (diferencia <= 7) {
      return 'text-yellow-600';
    } else {
      return 'text-green-600';
    }
  }

  verReceta(receta: RecetaEmitida) {
    this.recetaSeleccionada = receta;
    this.cerrarModalAcciones();
  }

  cerrarModalDetalles() {
    this.recetaSeleccionada = null;
  }

  verQR(receta: RecetaEmitida) {
    console.log('Ver QR:', receta);
    // Aquí iría la lógica para mostrar el código QR
    const qrCode = `QR-${receta.id}`;
    alert(`Código QR generado: ${qrCode}\n\nReceta: ${receta.id}\nPaciente: ${receta.paciente.nombre}`);
  }



  // Métodos para el modal de acciones
  toggleAccionesModal(recetaId: string) {
    this.modalAccionesAbierto = this.modalAccionesAbierto === recetaId ? null : recetaId;
  }

  cerrarModalAcciones() {
    this.modalAccionesAbierto = null;
  }

  reimprimirReceta(receta: RecetaEmitida) {
    // Abrir nueva pestaña con la vista de impresión (sin layout)
    const url = `/prescripciones/imprimir/${receta.id}`;
    window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  }

  descargarReceta(receta: RecetaEmitida) {
    // Abrir nueva pestaña con auto-impresión (sin layout)
    const url = `/prescripciones/imprimir/${receta.id}?autoprint=true`;
    window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  }





  // Métodos de paginación
  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(this.recetasFiltradas.length / this.elementosPorPagina);
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.recetasPaginadas = this.recetasFiltradas.slice(inicio, fin);
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

  // Métodos para anular receta
  anularReceta(receta: RecetaEmitida) {
    // Solo permitir anular recetas en estado "emitida"
    if (receta.estado !== 'emitida') {
      console.warn('Solo se pueden anular recetas en estado "emitida"');
      return;
    }
    
    this.recetaAAnular = receta;
    this.modalAnularAbierto = true;
  }

  cerrarModalAnular() {
    this.modalAnularAbierto = false;
    this.recetaAAnular = null;
  }

  confirmarAnularReceta() {
    if (this.recetaAAnular) {
      // Cambiar el estado de la receta a "anulada"
      const index = this.recetas.findIndex(r => r.id === this.recetaAAnular!.id);
      if (index > -1) {
        // Crear una nueva receta con estado anulado
        this.recetas[index] = {
          ...this.recetas[index],
          estado: 'anulada' as any, // Agregamos 'anulada' como estado válido
          fechaAnulacion: new Date().toLocaleDateString('es-ES'),
          motivoAnulacion: 'Anulada por el médico prescriptor'
        };
        
        // Refiltrar y recalcular estadísticas
        this.filtrarRecetas();
        this.calcularEstadisticas();
        
        console.log('Receta anulada:', this.recetaAAnular);
      }
    }
    this.cerrarModalAnular();
  }
}