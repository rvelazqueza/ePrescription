import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, AlertTriangle, Shield, Search, Filter, FilterX, Eye, Download, CheckCircle2, XCircle, Clock, User, FileText, Pill, AlertCircle, Info, Ban, ShieldAlert, Bell, BellOff, X } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { RoleDemoService } from '../../../services/role-demo.service';
import { Subscription } from 'rxjs';

interface AlertaClinica {
  id: string;
  type: 'interaction' | 'allergy' | 'contraindication' | 'duplicate' | 'dose';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'resolved';
  patientId: string;
  patientName: string;
  prescriptionId: string;
  medicine1: string;
  medicine2: string | null;
  description: string;
  recommendation: string;
  doctorId: string;
  doctorName: string;
  createdDate: string;
  createdTime: string;
  acknowledgedBy: string | null;
  acknowledgedDate: string | null;
  action: 'pending' | 'modified' | 'cancelled' | 'accepted_risk';
  clinicalEvidence: string;
  references: string[];
}

@Component({
  selector: 'app-bandeja-alertas',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, BreadcrumbsComponent, PageHeaderComponent, RoleSuggestionModalComponent],
  template: `
    <div class="space-y-6" (click)="cerrarModalDetalles()">
      <!-- Breadcrumbs -->
      <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>
      
      <!-- Page Header -->
      <app-page-header 
        title="Bandeja de Alertas Clínicas (CDS)" 
        description="Sistema de Soporte a la Decisión Clínica en tiempo real"
        [icon]="alertTriangleIcon"
        [actionButton]="true">
        <div slot="action" class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30">
          <div class="text-right">
            <p class="text-xs text-white/80">Total alertas</p>
            <p class="text-2xl font-bold text-white">{{ alertas.length }}</p>
          </div>
        </div>
      </app-page-header>

      <!-- Tarjetas de estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div class="bg-white rounded-lg shadow border-l-4 border-l-orange-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Total alertas</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
            <div class="p-3 bg-orange-100 rounded-lg">
              <lucide-icon [img]="bellIcon" class="w-8 h-8 text-orange-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-red-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Activas</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.active }}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-lg">
              <lucide-icon [img]="alertTriangleIcon" class="w-8 h-8 text-red-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-red-600 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Críticas</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.critical }}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-lg">
              <lucide-icon [img]="shieldAlertIcon" class="w-8 h-8 text-red-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-orange-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Alta prioridad</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.high }}</p>
            </div>
            <div class="p-3 bg-orange-100 rounded-lg">
              <lucide-icon [img]="alertCircleIcon" class="w-8 h-8 text-orange-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-yellow-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Pendientes</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.pending }}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-lg">
              <lucide-icon [img]="clockIcon" class="w-8 h-8 text-yellow-600"></lucide-icon>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow border-l-4 border-l-green-500 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 font-medium">Resueltas</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.resolved }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-lg">
              <lucide-icon [img]="checkCircle2Icon" class="w-8 h-8 text-green-600"></lucide-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Búsqueda y filtros -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid gap-4 md:grid-cols-4">
          <div class="relative">
            <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
            <input 
              type="text" 
              [(ngModel)]="terminoBusqueda"
              (input)="filtrarAlertas()"
              placeholder="Buscar por paciente, ID, medicamento o médico..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
          </div>
          
          <select 
            [(ngModel)]="filtroSeveridad"
            (change)="filtrarAlertas()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Todas las severidades</option>
            <option value="critical">Críticas</option>
            <option value="high">Altas</option>
            <option value="medium">Medias</option>
            <option value="low">Bajas</option>
          </select>
          
          <select 
            [(ngModel)]="filtroEstado"
            (change)="filtrarAlertas()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="resolved">Resueltas</option>
          </select>
          
          <select 
            [(ngModel)]="filtroTipo"
            (change)="filtrarAlertas()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            <option value="interaction">Interacción</option>
            <option value="allergy">Alergia</option>
            <option value="contraindication">Contraindicación</option>
            <option value="duplicate">Duplicidad</option>
            <option value="dose">Dosis</option>
          </select>
        </div>
        
        <div *ngIf="hayFiltrosActivos()" class="mt-4">
          <button 
            (click)="limpiarFiltros()"
            class="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <lucide-icon [img]="filterXIcon" class="w-4 h-4"></lucide-icon>
            Limpiar filtros
          </button>
        </div>
      </div>

      <!-- Tabla de alertas -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-orange-100 rounded-lg">
                <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-orange-600"></lucide-icon>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Alertas Clínicas Activas</h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ alertasFiltradas.length }} alerta{{ alertasFiltradas.length !== 1 ? 's' : '' }} encontrada{{ alertasFiltradas.length !== 1 ? 's' : '' }} • Doble clic para ver detalles
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="px-3 py-2 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 flex items-center gap-2">
                <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
                Exportar
              </button>
            </div>
          </div>
        </div>
        
        <div *ngIf="alertasFiltradas.length === 0" class="text-center py-12">
          <lucide-icon [img]="checkCircle2Icon" class="w-16 h-16 text-green-400 mx-auto mb-4"></lucide-icon>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay alertas activas</h3>
          <p class="text-gray-600">Todas las alertas han sido resueltas o no hay alertas que coincidan con los filtros.</p>
        </div>

        <div *ngIf="alertasFiltradas.length > 0" class="overflow-x-auto" style="max-height: 500px; overflow-y: auto;">
          <table class="w-full min-w-[1200px]">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severidad</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamento(s)</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let alerta of alertasFiltradas" 
                  class="hover:bg-orange-50/50 cursor-pointer transition-all"
                  (dblclick)="verDetalleAlerta(alerta)"
                  title="Doble clic para ver detalles">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-900">{{ alerta.createdDate }}</span>
                    <span class="text-xs text-gray-600">{{ alerta.createdTime }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getTipoBadgeClass(alerta.type)" class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full">
                    <lucide-icon [img]="getTipoIcon(alerta.type)" class="w-3 h-3 mr-1"></lucide-icon>
                    {{ getTipoTexto(alerta.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getSeveridadBadgeClass(alerta.severity)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getSeveridadTexto(alerta.severity) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p class="font-medium text-gray-900">{{ alerta.patientName }}</p>
                    <p class="text-xs text-gray-600">{{ alerta.patientId }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="max-w-xs">
                    <p class="text-sm text-gray-900">{{ alerta.medicine1 }}</p>
                    <p *ngIf="alerta.medicine2" class="text-xs text-gray-600 mt-1">+ {{ alerta.medicine2 }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-gray-900 max-w-md">{{ alerta.description }}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p class="text-sm text-gray-900">{{ alerta.doctorName }}</p>
                    <p class="text-xs text-gray-600">{{ alerta.doctorId }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span [class]="getEstadoBadgeClass(alerta.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getEstadoTexto(alerta.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    (click)="verDetalleAlerta(alerta); $event.stopPropagation()"
                    class="inline-flex items-center px-3 py-2 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                  >
                    <lucide-icon [img]="eyeIcon" class="w-4 h-4 mr-2"></lucide-icon>
                    Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Información de ayuda -->
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-red-100 rounded-lg flex-shrink-0">
            <lucide-icon [img]="shieldIcon" class="w-5 h-5 text-red-600"></lucide-icon>
          </div>
          <div>
            <h4 class="font-medium text-red-900 mb-1">Sistema de Soporte a la Decisión Clínica (CDS)</h4>
            <ul class="text-sm text-red-700 space-y-1">
              <li>• <strong>Alertas críticas:</strong> Bloquean la prescripción hasta ser resueltas por el médico</li>
              <li>• <strong>Alertas altas:</strong> Requieren confirmación explícita del prescriptor</li>
              <li>• <strong>Todas las interacciones</strong> quedan registradas con trazabilidad completa</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal lateral derecho para detalles de alerta -->
    <div 
      *ngIf="alertaSeleccionada"
      class="fixed inset-0 z-50 overflow-hidden"
      (click)="cerrarModalDetalles()"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <!-- Panel lateral -->
      <div class="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col"
           (click)="$event.stopPropagation()">
        
        <!-- Header del modal -->
        <div class="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-white flex-shrink-0">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5"></lucide-icon>
                <h2 class="text-lg font-semibold">Detalles de la Alerta Clínica</h2>
              </div>
              <p class="text-red-100 text-sm mt-1">Revisa la información completa y toma una decisión clínica informada</p>
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
          
            <!-- Información de la alerta -->
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-red-700">ID de alerta</span>
                </div>
                <span [class]="getSeveridadBadgeClass(alertaSeleccionada.severity)" class="px-3 py-1 text-xs font-semibold rounded-full">
                  {{ getSeveridadTexto(alertaSeleccionada.severity) }}
                </span>
              </div>
              <p class="text-sm text-red-900 font-medium">{{ alertaSeleccionada.id }}</p>
              <p class="text-xs text-red-700 mt-1">{{ alertaSeleccionada.createdDate }} {{ alertaSeleccionada.createdTime }}</p>
            </div>

            <!-- Información del Paciente -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <lucide-icon [img]="userIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
                <h3 class="text-lg font-semibold text-gray-900">Paciente</h3>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-600">Nombre</p>
                    <p class="font-semibold text-gray-900">{{ alertaSeleccionada.patientName }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">ID Paciente</p>
                    <p class="font-semibold text-gray-900">{{ alertaSeleccionada.patientId }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Medicamentos involucrados -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <lucide-icon [img]="pillIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
                <h3 class="text-lg font-semibold text-gray-900">Medicamentos involucrados</h3>
              </div>
              
              <div class="space-y-3">
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600">Medicamento 1</p>
                  <p class="font-semibold text-gray-900">{{ alertaSeleccionada.medicine1 }}</p>
                </div>
                <div *ngIf="alertaSeleccionada.medicine2" class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600">Medicamento 2</p>
                  <p class="font-semibold text-gray-900">{{ alertaSeleccionada.medicine2 }}</p>
                </div>
              </div>
            </div>

            <!-- Descripción clínica -->
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 class="font-medium text-red-900 mb-2">
                {{ getTipoTexto(alertaSeleccionada.type) }} {{ getSeveridadTexto(alertaSeleccionada.severity).toLowerCase() }}: {{ alertaSeleccionada.description.split(':')[0] }}
              </h4>
              <p class="text-red-700 text-sm">{{ alertaSeleccionada.clinicalEvidence }}</p>
            </div>

            <!-- Recomendación -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="font-medium text-blue-900 mb-2">Recomendación</h4>
              <p class="text-blue-700 text-sm">{{ alertaSeleccionada.recommendation }}</p>
            </div>

            <!-- Referencias bibliográficas -->
            <div *ngIf="alertaSeleccionada.references && alertaSeleccionada.references.length > 0">
              <h4 class="font-medium text-gray-900 mb-2">Referencias bibliográficas</h4>
              <p class="text-gray-700 text-sm">{{ alertaSeleccionada.references.join(', ') }}</p>
            </div>

            <!-- Médico prescriptor -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <lucide-icon [img]="userIcon" class="w-5 h-5 text-gray-600"></lucide-icon>
                <h3 class="text-lg font-semibold text-gray-900">Médico prescriptor</h3>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-600">Nombre</p>
                    <p class="font-semibold text-gray-900">{{ alertaSeleccionada.doctorName }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">ID Médico</p>
                    <p class="font-semibold text-gray-900">{{ alertaSeleccionada.doctorId }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Resolución de la alerta -->
            <div *ngIf="alertaSeleccionada.status === 'active'">
              <h4 class="font-medium text-gray-900 mb-3">Resolución de la alerta</h4>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Acción tomada *</label>
                  <select 
                    [(ngModel)]="accionSeleccionada"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Selecciona una acción...</option>
                    <option value="modified">Modificar prescripción</option>
                    <option value="cancelled">Cancelar medicamento</option>
                    <option value="accepted_risk">Aceptar riesgo con justificación</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Justificación clínica *</label>
                  <textarea 
                    [(ngModel)]="justificacionClinica"
                    rows="3"
                    placeholder="Describe la justificación médica para la decisión tomada..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer con botones de acción -->
        <div class="border-t border-gray-200 px-6 py-4 bg-gray-50 flex-shrink-0">
          <div class="flex gap-3">
            <button 
              (click)="cerrarModalDetalles()"
              class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Cerrar
            </button>
            <button 
              *ngIf="alertaSeleccionada.status === 'active'"
              (click)="resolverAlerta()"
              [disabled]="!accionSeleccionada || !justificacionClinica"
              class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <lucide-icon [img]="fileTextIcon" class="w-4 h-4"></lucide-icon>
              Resolver alerta
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Suggestion Modal -->
    <app-role-suggestion-modal
      [isOpen]="showRoleSuggestionModal()"
      [suggestedRole]="'Médico'"
      [pageName]="'alertas-bandeja'"
      (dismiss)="onRoleSuggestionDismiss()"
      (roleChanged)="onRoleChanged()"
    ></app-role-suggestion-modal>
  `
})
export class BandejaAlertasComponent implements OnInit, OnDestroy {
  // Iconos
  alertTriangleIcon = AlertTriangle;
  shieldIcon = Shield;
  searchIcon = Search;
  filterIcon = Filter;
  filterXIcon = FilterX;
  eyeIcon = Eye;
  downloadIcon = Download;
  checkCircle2Icon = CheckCircle2;
  xCircleIcon = XCircle;
  clockIcon = Clock;
  userIcon = User;
  fileTextIcon = FileText;
  pillIcon = Pill;
  alertCircleIcon = AlertCircle;
  infoIcon = Info;
  banIcon = Ban;
  shieldAlertIcon = ShieldAlert;
  bellIcon = Bell;
  bellOffIcon = BellOff;
  xIcon = X;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Alertas clínicas', route: '/alertas' },
    { label: 'Bandeja de alertas' }
  ];

  // Datos
  alertas: AlertaClinica[] = [
    {
      id: "ALT-001",
      type: "interaction",
      severity: "critical",
      status: "active",
      patientId: "PAT-0012",
      patientName: "María González Rodríguez",
      prescriptionId: "RX-2024-0156",
      medicine1: "Warfarina 5mg",
      medicine2: "Ácido acetilsalicílico 100mg",
      description: "Interacción medicamentosa severa: Riesgo aumentado de sangrado",
      recommendation: "Evitar combinación. Considerar alternativa antiagregante o ajustar dosis con monitoreo INR estricto",
      doctorId: "DOC-003",
      doctorName: "Dra. Isabel Moreno Castro",
      createdDate: "2024-09-30",
      createdTime: "14:25",
      acknowledgedBy: null,
      acknowledgedDate: null,
      action: "pending",
      clinicalEvidence: "Aumento del riesgo de hemorragia gastrointestinal y sangrado en SNC",
      references: ["FDA Drug Safety Communication 2014", "Micromedex DrugReax"]
    },
    {
      id: "ALT-002",
      type: "allergy",
      severity: "critical",
      status: "active",
      patientId: "PAT-0045",
      patientName: "Carlos Ramírez López",
      prescriptionId: "RX-2024-0178",
      medicine1: "Amoxicilina 500mg",
      medicine2: null,
      description: "Alergia registrada: Paciente alérgico a penicilinas",
      recommendation: "Contraindicación absoluta. Usar alternativa: Macrólidos o Quinolonas según indicación",
      doctorId: "DOC-001",
      doctorName: "Dr. Carlos Andrés Martínez López",
      createdDate: "2024-09-30",
      createdTime: "11:15",
      acknowledgedBy: null,
      acknowledgedDate: null,
      action: "pending",
      clinicalEvidence: "Historial de reacción anafiláctica previa a penicilina (2022-03-15)",
      references: ["Historia clínica electrónica"]
    },
    {
      id: "ALT-003",
      type: "contraindication",
      severity: "high",
      status: "active",
      patientId: "PAT-0089",
      patientName: "Ana Patricia Herrera",
      prescriptionId: "RX-2024-0165",
      medicine1: "Ibuprofeno 400mg",
      medicine2: null,
      description: "Contraindicación por condición médica: Insuficiencia renal crónica estadio 3",
      recommendation: "Evitar AINEs. Considerar paracetamol o analgésicos alternativos",
      doctorId: "DOC-005",
      doctorName: "Dr. Miguel Ángel Ruiz Sánchez",
      createdDate: "2024-09-30",
      createdTime: "09:45",
      acknowledgedBy: "DOC-005",
      acknowledgedDate: "2024-09-30 10:00",
      action: "modified",
      clinicalEvidence: "TFG estimado: 45 ml/min/1.73m²",
      references: ["Guías KDIGO 2024"]
    },
    {
      id: "ALT-004",
      type: "duplicate",
      severity: "medium",
      status: "active",
      patientId: "PAT-0067",
      patientName: "Roberto Sánchez Díaz",
      prescriptionId: "RX-2024-0182",
      medicine1: "Atorvastatina 20mg",
      medicine2: "Simvastatina 40mg",
      description: "Duplicidad terapéutica: Dos estatinas prescritas simultáneamente",
      recommendation: "Mantener solo una estatina. Suspender medicamento duplicado",
      doctorId: "DOC-002",
      doctorName: "Dra. Laura Sofía Ramírez Gómez",
      createdDate: "2024-09-29",
      createdTime: "16:30",
      acknowledgedBy: "DOC-002",
      acknowledgedDate: "2024-09-29 17:00",
      action: "cancelled",
      clinicalEvidence: "Mismo mecanismo de acción y clase terapéutica",
      references: ["Guías ACC/AHA Colesterol 2024"]
    },
    {
      id: "ALT-005",
      type: "dose",
      severity: "high",
      status: "active",
      patientId: "PAT-0123",
      patientName: "Elena Martínez Vega",
      prescriptionId: "RX-2024-0190",
      medicine1: "Metformina 850mg",
      medicine2: null,
      description: "Dosis máxima excedida: 3 tabletas c/8h (7650mg/día) supera dosis máxima de 3000mg/día",
      recommendation: "Ajustar a dosis máxima permitida: 1000mg c/8h o 850mg c/8h",
      doctorId: "DOC-004",
      doctorName: "Dr. José Luis Torres Mendoza",
      createdDate: "2024-09-29",
      createdTime: "14:00",
      acknowledgedBy: null,
      acknowledgedDate: null,
      action: "pending",
      clinicalEvidence: "Dosis máxima FDA: 2550mg/día. Dosis máxima práctica: 3000mg/día",
      references: ["FDA Label Metformin 2024", "UpToDate"]
    },
    {
      id: "ALT-006",
      type: "interaction",
      severity: "medium",
      status: "resolved",
      patientId: "PAT-0034",
      patientName: "Pedro Jiménez Castro",
      prescriptionId: "RX-2024-0145",
      medicine1: "Enalapril 10mg",
      medicine2: "Espironolactona 25mg",
      description: "Interacción medicamentosa moderada: Riesgo de hiperpotasemia",
      recommendation: "Monitorear niveles de potasio sérico. Considerar reducir dosis o suspender espironolactona",
      doctorId: "DOC-003",
      doctorName: "Dra. Isabel Moreno Castro",
      createdDate: "2024-09-28",
      createdTime: "10:20",
      acknowledgedBy: "DOC-003",
      acknowledgedDate: "2024-09-28 11:00",
      action: "accepted_risk",
      clinicalEvidence: "Potasio basal: 4.2 mEq/L. Función renal normal",
      references: ["Micromedex", "Lexicomp"]
    }
  ];

  // Filtros
  terminoBusqueda = '';
  filtroSeveridad = '';
  filtroEstado = '';
  filtroTipo = '';
  alertasFiltradas: AlertaClinica[] = [];

  // Modal
  alertaSeleccionada: AlertaClinica | null = null;
  accionSeleccionada = '';
  justificacionClinica = '';

  // Estadísticas
  stats = {
    total: 0,
    active: 0,
    critical: 0,
    high: 0,
    pending: 0,
    resolved: 0
  };

  // Role suggestion modal
  showRoleSuggestionModal = signal(false);
  private roleSubscriptions = new Subscription();

  constructor(private roleDemoService: RoleDemoService) {}

  ngOnInit() {
    this.calcularEstadisticas();
    this.filtrarAlertas();
    this.checkRoleSuggestion();
    this.subscribeToRoleChanges();
  }

  ngOnDestroy(): void {
    this.roleSubscriptions.unsubscribe();
  }

  calcularEstadisticas() {
    this.stats = {
      total: this.alertas.length,
      active: this.alertas.filter(a => a.status === 'active').length,
      critical: this.alertas.filter(a => a.severity === 'critical' && a.status === 'active').length,
      high: this.alertas.filter(a => a.severity === 'high' && a.status === 'active').length,
      pending: this.alertas.filter(a => a.action === 'pending').length,
      resolved: this.alertas.filter(a => a.status === 'resolved').length
    };
  }

  filtrarAlertas() {
    this.alertasFiltradas = this.alertas.filter(alerta => {
      const matchesSearch = 
        alerta.patientName.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        alerta.id.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        alerta.medicine1.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        alerta.doctorName.toLowerCase().includes(this.terminoBusqueda.toLowerCase());
      
      const matchesSeverity = !this.filtroSeveridad || alerta.severity === this.filtroSeveridad;
      const matchesStatus = !this.filtroEstado || alerta.status === this.filtroEstado;
      const matchesType = !this.filtroTipo || alerta.type === this.filtroTipo;
      
      return matchesSearch && matchesSeverity && matchesStatus && matchesType;
    });
  }

  hayFiltrosActivos(): boolean {
    return !!(this.terminoBusqueda || this.filtroSeveridad || this.filtroEstado || this.filtroTipo);
  }

  limpiarFiltros() {
    this.terminoBusqueda = '';
    this.filtroSeveridad = '';
    this.filtroEstado = '';
    this.filtroTipo = '';
    this.filtrarAlertas();
  }

  verDetalleAlerta(alerta: AlertaClinica) {
    this.alertaSeleccionada = alerta;
    this.accionSeleccionada = '';
    this.justificacionClinica = '';
  }

  cerrarModalDetalles() {
    this.alertaSeleccionada = null;
    this.accionSeleccionada = '';
    this.justificacionClinica = '';
  }

  resolverAlerta() {
    if (this.alertaSeleccionada && this.accionSeleccionada && this.justificacionClinica) {
      // Actualizar la alerta
      const index = this.alertas.findIndex(a => a.id === this.alertaSeleccionada!.id);
      if (index !== -1) {
        this.alertas[index] = {
          ...this.alertas[index],
          status: 'resolved',
          action: this.accionSeleccionada as any,
          acknowledgedBy: 'Usuario actual',
          acknowledgedDate: new Date().toISOString()
        };
      }
      
      this.calcularEstadisticas();
      this.filtrarAlertas();
      this.cerrarModalDetalles();
      
      // Aquí podrías mostrar un toast de éxito
      console.log('Alerta resuelta correctamente');
    }
  }

  getSeveridadBadgeClass(severity: string): string {
    const classes = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return classes[severity as keyof typeof classes] || classes.medium;
  }

  getSeveridadTexto(severity: string): string {
    const textos = {
      critical: 'Crítica',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    };
    return textos[severity as keyof typeof textos] || severity;
  }

  getTipoBadgeClass(type: string): string {
    return 'bg-purple-100 text-purple-700 border-purple-300';
  }

  getTipoTexto(type: string): string {
    const textos = {
      interaction: 'Interacción',
      allergy: 'Alergia',
      contraindication: 'Contraindicación',
      duplicate: 'Duplicidad',
      dose: 'Dosis'
    };
    return textos[type as keyof typeof textos] || type;
  }

  getTipoIcon(type: string): any {
    const iconos = {
      interaction: this.shieldAlertIcon,
      allergy: this.banIcon,
      contraindication: this.xCircleIcon,
      duplicate: this.alertCircleIcon,
      dose: this.pillIcon
    };
    return iconos[type as keyof typeof iconos] || this.alertTriangleIcon;
  }

  getEstadoBadgeClass(status: string): string {
    const classes = {
      active: 'bg-orange-100 text-orange-700 border-orange-300',
      resolved: 'bg-green-100 text-green-700 border-green-300'
    };
    return classes[status as keyof typeof classes] || classes.active;
  }

  getEstadoTexto(status: string): string {
    const textos = {
      active: 'Activa',
      resolved: 'Resuelta'
    };
    return textos[status as keyof typeof textos] || status;
  }

  // Role suggestion methods
  private checkRoleSuggestion(): void {
    const currentSession = this.roleDemoService.getCurrentSession();
    console.log('🔧 BandejaAlertas - checkRoleSuggestion - currentRole:', currentSession.activeRole);
    
    if (currentSession.activeRole !== 'Médico' && 
        currentSession.activeRole !== 'Administrador') {
      console.log('🔧 BandejaAlertas - Showing role suggestion modal for role:', currentSession.activeRole);
      this.showRoleSuggestionModal.set(true);
    } else {
      console.log('🔧 BandejaAlertas - Not showing modal, user has appropriate role');
      this.showRoleSuggestionModal.set(false);
    }
  }

  private subscribeToRoleChanges(): void {
    this.roleSubscriptions.add(
      this.roleDemoService.currentSession$.subscribe(session => {
        console.log('🔧 BandejaAlertas - Role changed to:', session.activeRole);
        this.checkRoleSuggestion();
      })
    );
  }

  onRoleSuggestionDismiss(): void {
    console.log('🔧 BandejaAlertas - Role suggestion dismissed');
    this.showRoleSuggestionModal.set(false);
  }

  onRoleChanged(): void {
    console.log('🔧 BandejaAlertas - Role changed, closing modal');
    this.showRoleSuggestionModal.set(false);
  }
}