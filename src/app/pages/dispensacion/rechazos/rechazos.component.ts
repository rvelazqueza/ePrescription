import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LucideAngularModule, AlertTriangle, XCircle, FileText, Plus, User, Search, Filter, FilterX, Eye, Download, Calendar, Clock, Mail, Printer, Info, X, ChevronLeft, ChevronRight } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';
import { RoleSuggestionService } from '../../../services/role-suggestion.service';

@Component({
  selector: 'app-rechazos-dispensacion',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, BreadcrumbsComponent, RoleSuggestionModalComponent],
  template: `
    <!-- Breadcrumbs -->
    <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>
    
    <div class="space-y-6">
      <!-- Header visual -->
      <div class="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-red-700 rounded-lg shadow-lg">
        <div class="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div class="relative p-8">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center space-x-3 mb-2">
                <div class="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <lucide-icon [img]="alertTriangleIcon" class="w-8 h-8 text-white"></lucide-icon>
                </div>
                <div>
                  <h1 class="text-white text-2xl font-bold">Rechazos y Motivos</h1>
                  <p class="text-red-100 text-sm">
                    Sistema de trazabilidad de rechazos de dispensación
                  </p>
                </div>
              </div>
            </div>
            <div class="hidden md:block">
              <div class="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <div class="text-center">
                  <div class="text-2xl font-bold text-white">{{ rejections.length }}</div>
                  <div class="text-xs text-red-100">Total rechazos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Banner informativo -->
      <div class="bg-red-50 border border-red-200 rounded-lg">
        <div class="p-6">
          <div class="flex items-start space-x-3">
            <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"></lucide-icon>
            <div>
              <h4 class="font-medium text-red-900 mb-2">Sistema de trazabilidad de rechazos</h4>
              <div class="text-sm text-red-800 space-y-2">
                <p>
                  Documenta todos los rechazos de dispensación para garantizar seguridad del paciente, cumplimiento normativo y análisis de causas raíz.
                </p>
                <ul class="list-disc list-inside space-y-1 ml-2">
                  <li>Motivos estandarizados según normativas HL7, FDA y OMS</li>
                  <li>Notificación automática a médicos prescriptores</li>
                  <li>Trazabilidad completa para auditorías</li>
                  <li>Análisis estadístico para mejora continua</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas por categoría -->
      <div class="grid grid-cols-5 gap-4">
        <div class="bg-white rounded-lg p-6 border-l-4 border-l-gray-500 shadow-sm">
          <div class="flex flex-col items-center text-center">
            <lucide-icon [img]="fileTextIcon" class="w-8 h-8 text-gray-500 mb-2"></lucide-icon>
            <p class="text-sm text-gray-600 mb-1">Total</p>
            <p class="text-3xl font-bold text-gray-900">5</p>
          </div>
        </div>
        
        <div class="bg-white rounded-lg p-6 border-l-4 border-l-red-500 shadow-sm">
          <div class="flex flex-col items-center text-center">
            <lucide-icon [img]="alertTriangleIcon" class="w-8 h-8 text-red-500 mb-2"></lucide-icon>
            <p class="text-sm text-red-600 mb-1">Médicos</p>
            <p class="text-3xl font-bold text-red-900">2</p>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 border-l-4 border-l-orange-500 shadow-sm">
          <div class="flex flex-col items-center text-center">
            <lucide-icon [img]="fileTextIcon" class="w-8 h-8 text-orange-500 mb-2"></lucide-icon>
            <p class="text-sm text-orange-600 mb-1">Administrativos</p>
            <p class="text-3xl font-bold text-orange-900">1</p>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 border-l-4 border-l-yellow-500 shadow-sm">
          <div class="flex flex-col items-center text-center">
            <lucide-icon [img]="xCircleIcon" class="w-8 h-8 text-yellow-500 mb-2"></lucide-icon>
            <p class="text-sm text-yellow-600 mb-1">Farmacéuticos</p>
            <p class="text-3xl font-bold text-yellow-900">1</p>
          </div>
        </div>

        <div class="bg-white rounded-lg p-6 border-l-4 border-l-blue-500 shadow-sm">
          <div class="flex flex-col items-center text-center">
            <lucide-icon [img]="userIcon" class="w-8 h-8 text-blue-500 mb-2"></lucide-icon>
            <p class="text-sm text-blue-600 mb-1">Paciente</p>
            <p class="text-3xl font-bold text-blue-900">1</p>
          </div>
        </div>
      </div>



      <!-- Métodos de búsqueda -->
      <div class="bg-white rounded-lg shadow border border-gray-200">
        <!-- Tabs -->
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex">
            <button
              (click)="setSearchMethod('registrar')"
              [class]="searchMethod === 'registrar' 
                ? 'border-red-500 text-red-600 bg-red-50 w-1/2 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 w-1/2 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors'"
            >
              <div class="flex items-center justify-center gap-2">
                <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
                Registrar rechazo
              </div>
            </button>
            <button
              (click)="setSearchMethod('historial')"
              [class]="searchMethod === 'historial' 
                ? 'border-red-500 text-red-600 bg-red-50 w-1/2 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 w-1/2 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors'"
            >
              <div class="flex items-center justify-center gap-2">
                <lucide-icon [img]="fileTextIcon" class="w-4 h-4"></lucide-icon>
                Historial de rechazos
              </div>
            </button>
          </nav>
        </div>

        <!-- Contenido de tabs -->
        <div class="p-6">
          <!-- Registrar rechazo -->
          <div *ngIf="searchMethod === 'registrar'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">1. Buscar receta a rechazar</h3>
              <p class="text-sm text-gray-600">
                Ingresa el número de receta que deseas rechazar
              </p>
            </div>

            <div class="space-y-3">
              <div class="flex gap-3">
                <div class="flex-1 relative">
                  <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"></lucide-icon>
                  <input
                    type="text"
                    placeholder="Número de receta (ej: RX-2025-009847)"
                    [(ngModel)]="quickSearchInput"
                    class="pl-11 h-12 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <button 
                  (click)="searchPrescription()"
                  class="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>

          <!-- Historial de rechazos -->
          <div *ngIf="searchMethod === 'historial'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtros de búsqueda</h3>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-2 block">Categoría</label>
                  <select [(ngModel)]="categoryFilter" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    <option value="all">Todas las categorías</option>
                    <option value="farmaceutico">Farmacéutico</option>
                    <option value="medico">Médico</option>
                    <option value="administrativo">Administrativo</option>
                    <option value="paciente">Paciente</option>
                  </select>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-700 mb-2 block">Buscar</label>
                  <div class="relative">
                    <input
                      type="text"
                      [(ngModel)]="searchFilter"
                      placeholder="Receta o paciente..."
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-700 mb-2 block">Desde</label>
                  <input
                    type="date"
                    [(ngModel)]="dateFromFilter"
                    placeholder="mm/dd/yyyy"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-700 mb-2 block">Hasta</label>
                  <input
                    type="date"
                    [(ngModel)]="dateToFilter"
                    placeholder="mm/dd/yyyy"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  (click)="applyFilters()"
                  class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <lucide-icon [img]="filterIcon" class="w-4 h-4"></lucide-icon>
                  Aplicar filtros
                </button>
                <button
                  (click)="clearFilters()"
                  class="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <lucide-icon [img]="filterXIcon" class="w-4 h-4"></lucide-icon>
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Historial de rechazos -->
      <div *ngIf="searchMethod === 'historial'" class="bg-white rounded-lg shadow-lg">
        <div class="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-1">Historial de rechazos</h3>
            <p class="text-sm text-gray-600">
              {{rejections.length}} rechazo(s) registrado(s)
            </p>
          </div>
          <button class="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
            <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
            Exportar
          </button>
        </div>
        <div class="p-6">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receta</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  *ngFor="let rejection of currentRejections"
                  class="cursor-pointer hover:bg-gray-50" 
                  (dblclick)="viewRejectionDetails(rejection.id)"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <lucide-icon [img]="calendarIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{rejection.date}}</p>
                        <p class="text-xs text-gray-500">{{rejection.time}}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{rejection.prescriptionNumber}}</p>
                      <p class="text-xs text-gray-500">{{rejection.doctorName}}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{rejection.patientName}}</p>
                      <p class="text-xs text-gray-500">{{rejection.patientId}}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [ngClass]="getCategoryBadgeClass(rejection.category)" class="px-2 py-1 text-xs font-medium rounded-full border">
                      {{rejection.category}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{rejection.reason}}</p>
                      <p class="text-xs text-gray-500">{{rejection.reasonCode}}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [ngClass]="getStatusBadgeClass(rejection.status)" class="px-2 py-1 text-xs font-medium rounded-full border">
                      {{rejection.status}}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button (click)="viewRejectionDetails(rejection.id)" class="text-gray-400 hover:text-gray-600">
                      <lucide-icon [img]="eyeIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginación -->
          <div *ngIf="totalPages > 1" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Mostrando {{startIndex + 1}} a {{Math.min(endIndex, rejections.length)}} de {{rejections.length}} rechazos
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  (click)="previousPage()"
                  [disabled]="currentPage === 1"
                  class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                  <lucide-icon [img]="chevronLeftIcon" class="w-4 h-4"></lucide-icon>
                  Anterior
                </button>
                
                <div class="flex space-x-1">
                  <button 
                    *ngFor="let pagina of getPageNumbers()"
                    (click)="goToPage(pagina)"
                    [class]="pagina === currentPage 
                      ? 'px-3 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-md'
                      : 'px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50'">
                    {{ pagina }}
                  </button>
                </div>
                
                <button 
                  (click)="nextPage()"
                  [disabled]="currentPage === totalPages"
                  class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                  Siguiente
                  <lucide-icon [img]="chevronRightIcon" class="w-4 h-4"></lucide-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal lateral derecho para detalles del rechazo -->
    <div 
      *ngIf="showModal" 
      class="fixed inset-0 z-50 overflow-hidden"
      (click)="closeModal()"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <!-- Panel lateral -->
      <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col"
           (click)="$event.stopPropagation()">
        
        <!-- Header del modal -->
        <div class="bg-red-600 px-6 py-4 text-white flex-shrink-0">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <lucide-icon [img]="xCircleIcon" class="w-5 h-5"></lucide-icon>
                <h2 class="text-lg font-semibold">Detalle de Rechazo</h2>
              </div>
              <p class="text-red-100 text-sm mt-1">RX-2025-009842</p>
            </div>
            <button 
              (click)="closeModal()"
              class="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
            </button>
          </div>
        </div>

        <!-- Contenido del modal con scroll -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-6 space-y-6">

            <!-- Motivo farmacéutico -->
            <div class="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-orange-600"></lucide-icon>
                  <h3 class="font-medium text-orange-900">Motivo farmacéutico</h3>
                </div>
                <span class="px-2 py-1 text-xs font-medium rounded-md bg-orange-100 text-orange-700 border border-orange-300">
                  FAR-001
                </span>
              </div>
              <p class="font-medium text-orange-900 mb-1">Medicamento fuera de stock</p>
              <p class="text-sm text-orange-800">Stock disponibilidad o aspectos farmacéuticos</p>
            </div>

            <!-- Requiere acción -->
            <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div class="flex items-start gap-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"></lucide-icon>
                <div>
                  <p class="font-medium text-yellow-900">Requiere acción</p>
                  <p class="text-sm text-yellow-800 mt-1">
                    Este rechazo requiere seguimiento o acción adicional por parte del médico prescriptor.
                  </p>
                </div>
              </div>
            </div>

            <!-- Información del paciente -->
            <div>
              <h3 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <lucide-icon [img]="userIcon" class="w-4 h-4"></lucide-icon>
                Información del Paciente
              </h3>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-600">Nombre completo</p>
                  <p class="font-medium text-gray-900">Carlos Andrés Pérez Morales</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Identificación</p>
                  <p class="font-medium text-gray-900">CC-43.654.789</p>
                </div>
              </div>
            </div>

            <!-- Información de la receta -->
            <div>
              <h3 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <lucide-icon [img]="fileTextIcon" class="w-4 h-4"></lucide-icon>
                Información de la Receta
              </h3>
              <div class="space-y-3">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-600">Médico prescriptor</p>
                    <p class="font-medium text-gray-900">Dr. Carlos Alberto Mendoza Herrera</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Medicamentos</p>
                    <p class="font-medium text-gray-900">2 prescrito(s)</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <lucide-icon [img]="calendarIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
                  <div>
                    <p class="text-sm text-gray-600">Fecha de emisión</p>
                    <p class="font-medium text-gray-900">27/09/2025</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detalles del rechazo -->
            <div>
              <h3 class="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <lucide-icon [img]="fileTextIcon" class="w-4 h-4"></lucide-icon>
                Detalles del Rechazo
              </h3>
              <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p class="text-sm text-gray-900">
                  El medicamento Atorvastatina 40mg no está disponible en inventario actual. Se agotó el lote anterior y el nuevo pedido está programado para el 02/10/2025. Se recomienda al paciente consultar con el médico para alternativa temporal o esperar reabastecimiento.
                </p>
              </div>

              <div class="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <div class="flex items-center space-x-2 text-gray-600 mb-1">
                    <lucide-icon [img]="calendarIcon" class="w-4 h-4"></lucide-icon>
                    <p class="text-xs">Fecha de rechazo</p>
                  </div>
                  <p class="text-sm font-medium text-gray-900">28/09/2025</p>
                </div>
                <div>
                  <div class="flex items-center space-x-2 text-gray-600 mb-1">
                    <lucide-icon [img]="clockIcon" class="w-4 h-4"></lucide-icon>
                    <p class="text-xs">Hora</p>
                  </div>
                  <p class="text-sm font-medium text-gray-900">03:45 p.m.</p>
                </div>
              </div>

              <div class="mt-3">
                <p class="text-xs text-gray-600 mb-1">Rechazado por</p>
                <p class="text-sm font-medium text-gray-900">Farm. Ana María Castillo</p>
                <p class="text-xs text-gray-600 mt-1">Químico Farmacéutico</p>
              </div>
            </div>

            <!-- Estado de notificación -->
            <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-start gap-3">
                <lucide-icon [img]="mailIcon" class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"></lucide-icon>
                <div>
                  <p class="font-medium text-green-900">Notificación enviada al médico</p>
                  <p class="text-sm text-green-800 mt-1">
                    El médico prescriptor ha sido notificado del rechazo de esta receta.
                  </p>
                </div>
              </div>
            </div>

            <!-- Información normativa -->
            <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-start gap-2">
                <lucide-icon [img]="infoIcon" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"></lucide-icon>
                <div>
                  <p class="font-medium text-blue-900">Cumplimiento normativo</p>
                  <p class="text-sm text-blue-800 mt-1">
                    Este rechazo ha sido registrado según las normativas vigentes (HL7, FDA, OMS) y forma parte del sistema de trazabilidad y auditoría.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="bg-gray-50 px-6 py-4 flex-shrink-0">
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-2">
              <button 
                class="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
              >
                <lucide-icon [img]="printerIcon" class="w-4 h-4"></lucide-icon>
                Imprimir
              </button>
              
              <button 
                class="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
              >
                <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de sugerencia de rol -->
    <app-role-suggestion-modal
      [isOpen]="showRoleSuggestionModal()"
      (dismiss)="onRoleSuggestionDismiss()"
      (roleChanged)="onRoleChanged()"
    ></app-role-suggestion-modal>
  `
})
export class RechazosDispensacionComponent implements OnInit, OnDestroy {
  // Iconos
  alertTriangleIcon = AlertTriangle;
  xCircleIcon = XCircle;
  fileTextIcon = FileText;
  userIcon = User;
  searchIcon = Search;
  plusIcon = Plus;
  filterIcon = Filter;
  filterXIcon = FilterX;
  eyeIcon = Eye;
  downloadIcon = Download;
  calendarIcon = Calendar;
  clockIcon = Clock;
  mailIcon = Mail;
  printerIcon = Printer;
  infoIcon = Info;
  xIcon = X;
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dispensación', route: '/dispensacion' },
    { label: 'Rechazos' }
  ];

  // Role suggestion modal state
  showRoleSuggestionModal = signal(false);
  private subscriptions = new Subscription();
  private readonly PAGE_NAME = 'rechazos-dispensacion';

  constructor(
    private roleDemoService: RoleDemoService,
    private roleSuggestionService: RoleSuggestionService
  ) {}

  // Datos mock
  rejections = [
    {
      id: '1',
      date: '28/09/2025',
      time: '03:45 p.m.',
      prescriptionNumber: 'RX-2025-009842',
      doctorName: 'Dr. Carlos Alberto Mendoza Herrera',
      patientName: 'Carlos Andrés Pérez Morales',
      patientId: 'CC-43.654.789',
      category: 'Farmacéutico',
      reason: 'Medicamento fuera de stock',
      reasonCode: 'FAR-001',
      status: 'Req. acción'
    },
    {
      id: '2',
      date: '27/09/2025',
      time: '11:20 a.m.',
      prescriptionNumber: 'RX-2025-009838',
      doctorName: 'Dra. Patricia Sánchez Vega',
      patientName: 'María José Ramírez Silva',
      patientId: 'CC-52.987.456',
      category: 'Médico',
      reason: 'Interacción medicamentosa peligrosa',
      reasonCode: 'MED-002',
      status: 'Notificado'
    },
    {
      id: '3',
      date: '26/09/2025',
      time: '09:15 a.m.',
      prescriptionNumber: 'RX-2025-009835',
      doctorName: 'Dr. Roberto Jiménez Ortiz',
      patientName: 'Jorge Luis Martínez Castro',
      patientId: 'CC-38.741.963',
      category: 'Administrativo',
      reason: 'Receta vencida',
      reasonCode: 'ADM-001',
      status: 'Notificado'
    },
    {
      id: '4',
      date: '25/09/2025',
      time: '02:30 p.m.',
      prescriptionNumber: 'RX-2025-009830',
      doctorName: 'Dr. Carlos Alberto Mendoza Herrera',
      patientName: 'Sofía Elena Vargas Díaz',
      patientId: 'CC-41.852.741',
      category: 'Paciente',
      reason: 'Paciente rechaza el medicamento',
      reasonCode: 'PAC-001',
      status: 'Notificado'
    },
    {
      id: '5',
      date: '24/09/2025',
      time: '04:50 p.m.',
      prescriptionNumber: 'RX-2025-009828',
      doctorName: 'Dra. Laura Fernández Torres',
      patientName: 'Diego Fernando Ruiz López',
      patientId: 'CC-45.963.852',
      category: 'Médico',
      reason: 'Alergia conocida al medicamento',
      reasonCode: 'MED-004',
      status: 'Notificado'
    },
    {
      id: '6',
      date: '23/09/2025',
      time: '01:15 p.m.',
      prescriptionNumber: 'RX-2025-009820',
      doctorName: 'Dr. Miguel Ángel Rodríguez',
      patientName: 'Ana Lucía Moreno Vega',
      patientId: 'CC-29.876.543',
      category: 'Farmacéutico',
      reason: 'Dosis incorrecta prescrita',
      reasonCode: 'FAR-003',
      status: 'Req. acción'
    },
    {
      id: '7',
      date: '22/09/2025',
      time: '10:45 a.m.',
      prescriptionNumber: 'RX-2025-009815',
      doctorName: 'Dra. Carmen Isabel López',
      patientName: 'Pedro Antonio Silva Ruiz',
      patientId: 'CC-51.234.876',
      category: 'Administrativo',
      reason: 'Firma digital inválida',
      reasonCode: 'ADM-003',
      status: 'Notificado'
    }
  ];

  // Estados básicos
  searchMethod: 'registrar' | 'historial' = 'historial';
  quickSearchInput: string = '';
  categoryFilter: string = 'all';
  searchFilter: string = '';
  dateFromFilter: string = '';
  dateToFilter: string = '';
  showModal: boolean = false;
  
  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  
  // Propiedades calculadas
  get totalPages(): number {
    return Math.ceil(this.rejections.length / this.itemsPerPage);
  }
  
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }
  
  get endIndex(): number {
    return this.startIndex + this.itemsPerPage;
  }
  
  get currentRejections() {
    return this.rejections.slice(this.startIndex, this.endIndex);
  }

  ngOnInit() {
    // Verificar si se debe mostrar el modal de sugerencia de rol
    this.checkRoleSuggestion();
    
    // Suscribirse a cambios de rol
    const roleSubscription = this.roleDemoService.currentSession$.subscribe(session => {
      if (session.activeRole === 'Farmacéutico') {
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
    
    if (currentSession.activeRole !== 'Farmacéutico' && 
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

  setSearchMethod(method: 'registrar' | 'historial') {
    this.searchMethod = method;
  }

  searchPrescription() {
    console.log('Buscando receta:', this.quickSearchInput);
  }

  applyFilters() {
    console.log('Aplicando filtros');
  }

  clearFilters() {
    this.categoryFilter = 'all';
    this.searchFilter = '';
    this.dateFromFilter = '';
    this.dateToFilter = '';
  }

  viewRejectionDetails(id: string) {
    this.showModal = true;
    console.log('Ver detalles del rechazo:', id);
  }

  closeModal() {
    this.showModal = false;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let end = Math.min(this.totalPages, start + maxPages - 1);
    
    if (end - start < maxPages - 1) {
      start = Math.max(1, end - maxPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getCategoryBadgeClass(category: string): string {
    const classes: { [key: string]: string } = {
      'Farmacéutico': 'bg-orange-100 text-orange-700 border-orange-300',
      'Médico': 'bg-red-100 text-red-700 border-red-300',
      'Administrativo': 'bg-blue-100 text-blue-700 border-blue-300',
      'Paciente': 'bg-purple-100 text-purple-700 border-purple-300'
    };
    return classes[category] || classes['Farmacéutico'];
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Notificado': 'bg-green-100 text-green-700 border-green-300',
      'Req. acción': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Resuelto': 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return classes[status] || classes['Notificado'];
  }

  Math = Math;
}