import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, FileText, Users, Search, AlertCircle, Wifi, RefreshCw } from 'lucide-angular';

export type EmptyStateType = 
  | 'no-patient-selected' 
  | 'no-prescriptions' 
  | 'no-search-results' 
  | 'patient-not-found'
  | 'connection-error'
  | 'data-error'
  | 'no-data';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="text-center py-12 px-6">
      <!-- Icon -->
      <div class="mb-6">
        <div class="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
          <lucide-icon 
            [img]="getIcon()" 
            class="w-12 h-12"
            [ngClass]="getIconColor()"
          ></lucide-icon>
        </div>
      </div>

      <!-- Title -->
      <h3 class="text-xl font-semibold text-gray-900 mb-3">
        {{ getTitle() }}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 mb-6 max-w-md mx-auto">
        {{ getDescription() }}
      </p>

      <!-- Action Button -->
      <div *ngIf="showAction" class="space-y-3">
        <button 
          *ngIf="primaryAction"
          (click)="onPrimaryAction()"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <lucide-icon [img]="getPrimaryActionIcon()" class="w-5 h-5"></lucide-icon>
          {{ primaryActionText }}
        </button>

        <button 
          *ngIf="secondaryAction"
          (click)="onSecondaryAction()"
          class="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
        >
          <lucide-icon [img]="getSecondaryActionIcon()" class="w-4 h-4"></lucide-icon>
          {{ secondaryActionText }}
        </button>
      </div>

      <!-- Additional Content -->
      <div *ngIf="showSuggestions" class="mt-8 text-left max-w-md mx-auto">
        <h4 class="text-sm font-medium text-gray-900 mb-3">Sugerencias:</h4>
        <ul class="text-sm text-gray-600 space-y-2">
          <li *ngFor="let suggestion of getSuggestions()" class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <span>{{ suggestion }}</span>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class EmptyStateComponent {
  @Input() type: EmptyStateType = 'no-data';
  @Input() title?: string;
  @Input() description?: string;
  @Input() primaryActionText?: string;
  @Input() secondaryActionText?: string;
  @Input() showAction: boolean = true;
  @Input() showSuggestions: boolean = false;
  @Input() customSuggestions?: string[];

  @Output() primaryAction = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();

  // Icons
  fileTextIcon = FileText;
  usersIcon = Users;
  searchIcon = Search;
  alertCircleIcon = AlertCircle;
  wifiIcon = Wifi;
  refreshCwIcon = RefreshCw;

  getIcon() {
    switch (this.type) {
      case 'no-patient-selected':
      case 'patient-not-found':
        return this.usersIcon;
      case 'no-prescriptions':
        return this.fileTextIcon;
      case 'no-search-results':
        return this.searchIcon;
      case 'connection-error':
        return this.wifiIcon;
      case 'data-error':
        return this.alertCircleIcon;
      default:
        return this.fileTextIcon;
    }
  }

  getIconColor(): string {
    switch (this.type) {
      case 'connection-error':
      case 'data-error':
        return 'text-red-500';
      case 'no-search-results':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
    }
  }

  getTitle(): string {
    if (this.title) return this.title;

    switch (this.type) {
      case 'no-patient-selected':
        return 'No hay paciente seleccionado';
      case 'patient-not-found':
        return 'Paciente no encontrado';
      case 'no-prescriptions':
        return 'No hay recetas registradas';
      case 'no-search-results':
        return 'No se encontraron resultados';
      case 'connection-error':
        return 'Error de conexión';
      case 'data-error':
        return 'Error al cargar datos';
      default:
        return 'No hay datos disponibles';
    }
  }

  getDescription(): string {
    if (this.description) return this.description;

    switch (this.type) {
      case 'no-patient-selected':
        return 'Seleccione un paciente desde la lista para ver su información detallada y gestionar sus recetas médicas.';
      case 'patient-not-found':
        return 'El paciente que está buscando no existe o ha sido eliminado del sistema. Verifique el ID del paciente.';
      case 'no-prescriptions':
        return 'Este paciente no tiene recetas médicas registradas. Puede crear la primera receta usando el botón de abajo.';
      case 'no-search-results':
        return 'No se encontraron recetas que coincidan con los criterios de búsqueda. Intente ajustar los filtros o términos de búsqueda.';
      case 'connection-error':
        return 'No se pudo conectar con el servidor. Verifique su conexión a internet e intente nuevamente.';
      case 'data-error':
        return 'Ocurrió un error al cargar la información. Por favor, intente recargar la página o contacte al soporte técnico.';
      default:
        return 'No hay información disponible en este momento.';
    }
  }

  getPrimaryActionIcon() {
    switch (this.type) {
      case 'no-patient-selected':
        return this.usersIcon;
      case 'no-prescriptions':
        return this.fileTextIcon;
      case 'connection-error':
      case 'data-error':
        return this.refreshCwIcon;
      default:
        return this.fileTextIcon;
    }
  }

  getSecondaryActionIcon() {
    return this.searchIcon;
  }

  getSuggestions(): string[] {
    if (this.customSuggestions) return this.customSuggestions;

    switch (this.type) {
      case 'no-patient-selected':
        return [
          'Use la lista de pacientes para seleccionar uno',
          'Busque por nombre o número de identificación',
          'Revise los pacientes recientes en el panel lateral'
        ];
      case 'patient-not-found':
        return [
          'Verifique que el ID del paciente sea correcto',
          'El paciente puede haber sido eliminado',
          'Contacte al administrador si el problema persiste'
        ];
      case 'no-prescriptions':
        return [
          'Cree la primera receta médica para este paciente',
          'Verifique que el paciente esté activo en el sistema',
          'Revise el historial médico antes de prescribir'
        ];
      case 'no-search-results':
        return [
          'Intente con términos de búsqueda más generales',
          'Verifique la ortografía de los términos',
          'Ajuste los filtros de fecha o estado',
          'Limpie todos los filtros para ver todos los resultados'
        ];
      case 'connection-error':
        return [
          'Verifique su conexión a internet',
          'Intente recargar la página',
          'Contacte al soporte técnico si el problema persiste'
        ];
      case 'data-error':
        return [
          'Intente recargar la página',
          'Verifique que tenga permisos para acceder a esta información',
          'Contacte al administrador del sistema'
        ];
      default:
        return [];
    }
  }

  onPrimaryAction(): void {
    this.primaryAction.emit();
  }

  onSecondaryAction(): void {
    this.secondaryAction.emit();
  }
}