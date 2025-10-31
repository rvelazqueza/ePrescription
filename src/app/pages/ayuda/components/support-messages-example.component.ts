import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { 
  LucideAngularModule, 
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Pause,
  Filter,
  Search,
  Eye,
  Trash2
} from 'lucide-angular';
import { 
  HelpService, 
  type SupportMessage,
  type HelpCategory
} from '../../../services/help.service';

@Component({
  selector: 'app-support-messages-example',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <!-- Header con estadísticas -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold flex items-center gap-2">
            <lucide-icon [img]="messageSquareIcon" class="w-6 h-6"></lucide-icon>
            Mensajes de Soporte
          </h2>
          <div class="flex gap-2">
            <button 
              (click)="filterStatus = 'all'; loadMessages()"
              [class]="filterStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
              class="px-3 py-1 rounded-md text-sm"
            >
              Todos ({{ stats.total }})
            </button>
            <button 
              (click)="filterStatus = 'pending'; loadMessages()"
              [class]="filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'"
              class="px-3 py-1 rounded-md text-sm"
            >
              Pendientes ({{ stats.pending }})
            </button>
            <button 
              (click)="filterStatus = 'in-progress'; loadMessages()"
              [class]="filterStatus === 'in-progress' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
              class="px-3 py-1 rounded-md text-sm"
            >
              En Proceso ({{ stats.inProgress }})
            </button>
            <button 
              (click)="filterStatus = 'resolved'; loadMessages()"
              [class]="filterStatus === 'resolved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'"
              class="px-3 py-1 rounded-md text-sm"
            >
              Resueltos ({{ stats.resolved }})
            </button>
          </div>
        </div>

        <!-- Estadísticas por prioridad -->
        <div class="grid grid-cols-4 gap-4 mb-4">
          <div class="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <div class="text-red-600 font-bold text-lg">{{ stats.byPriority.urgent }}</div>
            <div class="text-red-700 text-sm">Urgente</div>
          </div>
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
            <div class="text-orange-600 font-bold text-lg">{{ stats.byPriority.high }}</div>
            <div class="text-orange-700 text-sm">Alta</div>
          </div>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <div class="text-yellow-600 font-bold text-lg">{{ stats.byPriority.medium }}</div>
            <div class="text-yellow-700 text-sm">Media</div>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div class="text-green-600 font-bold text-lg">{{ stats.byPriority.low }}</div>
            <div class="text-green-700 text-sm">Baja</div>
          </div>
        </div>
      </div>

      <!-- Lista de mensajes -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b border-gray-200">
          <h3 class="font-medium">
            {{ filterStatus === 'all' ? 'Todos los mensajes' : getFilterTitle() }}
          </h3>
        </div>
        <div class="divide-y divide-gray-200">
          <div 
            *ngFor="let message of displayedMessages" 
            class="p-4 hover:bg-gray-50 cursor-pointer"
            (click)="selectMessage(message)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-medium">{{ message.subject }}</h4>
                  <span [class]="getStatusBadgeClass(message.status)" class="px-2 py-1 rounded-full text-xs">
                    {{ getStatusLabel(message.status) }}
                  </span>
                  <span [class]="getPriorityBadgeClass(message.priority)" class="px-2 py-1 rounded-full text-xs">
                    {{ getPriorityLabel(message.priority) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ message.name }} - {{ message.email }}</p>
                <p class="text-sm text-gray-700 line-clamp-2">{{ message.message }}</p>
                <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span class="flex items-center gap-1">
                    <lucide-icon [img]="clockIcon" class="w-3 h-3"></lucide-icon>
                    {{ formatDate(message.createdAt) }}
                  </span>
                  <span *ngIf="message.category" class="flex items-center gap-1">
                    <lucide-icon [img]="filterIcon" class="w-3 h-3"></lucide-icon>
                    {{ getCategoryLabel(message.category) }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2 ml-4">
                <button 
                  (click)="$event.stopPropagation(); viewMessage(message)"
                  class="p-1 text-gray-400 hover:text-blue-600"
                  title="Ver mensaje"
                >
                  <lucide-icon [img]="eyeIcon" class="w-4 h-4"></lucide-icon>
                </button>
                <button 
                  (click)="$event.stopPropagation(); deleteMessage(message.id)"
                  class="p-1 text-gray-400 hover:text-red-600"
                  title="Eliminar mensaje"
                >
                  <lucide-icon [img]="trash2Icon" class="w-4 h-4"></lucide-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="displayedMessages.length === 0" class="p-8 text-center text-gray-500">
          <lucide-icon [img]="messageSquareIcon" class="w-12 h-12 mx-auto mb-2 opacity-50"></lucide-icon>
          <p>No hay mensajes {{ filterStatus === 'all' ? '' : getFilterTitle().toLowerCase() }}</p>
        </div>
      </div>

      <!-- Modal de detalle del mensaje (simplificado) -->
      <div *ngIf="selectedMessage" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" (click)="closeModal()">
        <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-xl font-bold">{{ selectedMessage.subject }}</h3>
              <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
                <lucide-icon [img]="xCircleIcon" class="w-6 h-6"></lucide-icon>
              </button>
            </div>
            
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>De:</strong> {{ selectedMessage.name }}
                </div>
                <div>
                  <strong>Email:</strong> {{ selectedMessage.email }}
                </div>
                <div>
                  <strong>Estado:</strong> 
                  <span [class]="getStatusBadgeClass(selectedMessage.status)" class="ml-2 px-2 py-1 rounded-full text-xs">
                    {{ getStatusLabel(selectedMessage.status) }}
                  </span>
                </div>
                <div>
                  <strong>Prioridad:</strong>
                  <span [class]="getPriorityBadgeClass(selectedMessage.priority)" class="ml-2 px-2 py-1 rounded-full text-xs">
                    {{ getPriorityLabel(selectedMessage.priority) }}
                  </span>
                </div>
                <div>
                  <strong>Fecha:</strong> {{ formatDate(selectedMessage.createdAt) }}
                </div>
                <div *ngIf="selectedMessage.category">
                  <strong>Categoría:</strong> {{ getCategoryLabel(selectedMessage.category) }}
                </div>
              </div>
              
              <div>
                <strong>Mensaje:</strong>
                <div class="mt-2 p-3 bg-gray-50 rounded-md">
                  {{ selectedMessage.message }}
                </div>
              </div>

              <!-- Acciones -->
              <div class="flex gap-2 pt-4 border-t border-gray-200">
                <button 
                  (click)="updateStatus(selectedMessage.id, 'in-progress')"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Marcar en Proceso
                </button>
                <button 
                  (click)="updateStatus(selectedMessage.id, 'resolved')"
                  class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Marcar Resuelto
                </button>
                <button 
                  (click)="updateStatus(selectedMessage.id, 'closed')"
                  class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SupportMessagesExampleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  messages: SupportMessage[] = [];
  displayedMessages: SupportMessage[] = [];
  selectedMessage: SupportMessage | null = null;
  filterStatus: 'all' | SupportMessage['status'] = 'all';
  stats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    byPriority: {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    }
  };

  // Icons
  messageSquareIcon = MessageSquare;
  clockIcon = Clock;
  alertCircleIcon = AlertCircle;
  checkCircleIcon = CheckCircle;
  xCircleIcon = XCircle;
  pauseIcon = Pause;
  filterIcon = Filter;
  searchIcon = Search;
  eyeIcon = Eye;
  trash2Icon = Trash2;

  constructor(private helpService: HelpService) {}

  ngOnInit(): void {
    this.loadMessages();
    this.loadStats();

    // Suscribirse a cambios en los mensajes
    this.helpService.supportMessages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadMessages();
        this.loadStats();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMessages(): void {
    if (this.filterStatus === 'all') {
      this.displayedMessages = this.helpService.getSupportMessages();
    } else {
      this.displayedMessages = this.helpService.getSupportMessagesByStatus(this.filterStatus);
    }
  }

  loadStats(): void {
    this.stats = this.helpService.getSupportStats();
  }

  selectMessage(message: SupportMessage): void {
    this.selectedMessage = message;
  }

  closeModal(): void {
    this.selectedMessage = null;
  }

  viewMessage(message: SupportMessage): void {
    this.selectedMessage = message;
  }

  deleteMessage(messageId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      this.helpService.deleteSupportMessage(messageId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadMessages();
          this.loadStats();
        });
    }
  }

  updateStatus(messageId: string, status: SupportMessage['status']): void {
    this.helpService.updateSupportMessageStatus(messageId, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadMessages();
        this.loadStats();
        if (this.selectedMessage && this.selectedMessage.id === messageId) {
          this.selectedMessage = { ...this.selectedMessage, status };
        }
      });
  }

  getFilterTitle(): string {
    const titles: { [key: string]: string } = {
      'pending': 'Pendientes',
      'in-progress': 'En Proceso',
      'resolved': 'Resueltos',
      'closed': 'Cerrados'
    };
    return titles[this.filterStatus] || 'Todos';
  }

  getStatusLabel(status: SupportMessage['status']): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pendiente',
      'in-progress': 'En Proceso',
      'resolved': 'Resuelto',
      'closed': 'Cerrado'
    };
    return labels[status] || status;
  }

  getStatusBadgeClass(status: SupportMessage['status']): string {
    const classes: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'resolved': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getPriorityLabel(priority: SupportMessage['priority']): string {
    const labels: { [key: string]: string } = {
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta',
      'urgent': 'Urgente'
    };
    return labels[priority] || priority;
  }

  getPriorityBadgeClass(priority: SupportMessage['priority']): string {
    const classes: { [key: string]: string } = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800'
    };
    return classes[priority] || 'bg-gray-100 text-gray-800';
  }

  getCategoryLabel(category: HelpCategory): string {
    const categoryMap: { [key in HelpCategory]: string } = {
      'prescripciones': 'Prescripciones',
      'dispensacion': 'Dispensación',
      'pacientes': 'Pacientes',
      'inventario': 'Inventario',
      'seguridad': 'Seguridad',
      'reportes': 'Reportes',
      'firma-digital': 'Firma Digital',
      'interoperabilidad': 'Interoperabilidad',
      'alertas': 'Alertas Clínicas',
      'configuracion': 'Configuración',
      'general': 'General'
    };
    return categoryMap[category] || 'General';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}