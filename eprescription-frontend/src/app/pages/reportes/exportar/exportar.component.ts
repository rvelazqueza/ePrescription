import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LucideAngularModule, FileSpreadsheet, FileText, FileClock, Calendar, Download, Search } from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { RoleSuggestionService } from '../../../services/role-suggestion.service';
import { RoleDemoService } from '../../../services/role-demo.service';

interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  frequency: string;
  format: string[];
  lastGenerated: string;
  estimatedTime: string;
  size: string;
}

@Component({
  selector: 'app-exportar',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      title="Exportaciones de Reportes" 
      description="Generación y descarga de reportes en múltiples formatos"
      [icon]="fileSpreadsheetIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-purple-600 via-violet-500 to-indigo-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

        <!-- Estadísticas principales -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-purple-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Reportes disponibles</p>
                  <p class="text-3xl font-bold text-gray-900">{{ templates.length }}</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-xl">
                  <lucide-icon [img]="fileTextIcon" class="w-8 h-8 text-purple-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Generados hoy</p>
                  <p class="text-3xl font-bold text-gray-900">12</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl">
                  <lucide-icon [img]="fileClockIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-green-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Formatos</p>
                  <p class="text-3xl font-bold text-gray-900">3</p>
                </div>
                <div class="p-3 bg-green-100 rounded-xl">
                  <lucide-icon [img]="fileSpreadsheetIcon" class="w-8 h-8 text-green-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-orange-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Programados</p>
                  <p class="text-3xl font-bold text-gray-900">5</p>
                </div>
                <div class="p-3 bg-orange-100 rounded-xl">
                  <lucide-icon [img]="calendarIcon" class="w-8 h-8 text-orange-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Filtros y búsqueda -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <div class="flex gap-4">
            <div class="flex-1 relative">
              <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
              <input
                type="text"
                placeholder="Buscar reportes..."
                [(ngModel)]="searchTerm"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select 
              [(ngModel)]="categoryFilter"
              class="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las categorías</option>
              <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Grid de reportes disponibles -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div *ngFor="let template of filteredTemplates" 
             class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-start gap-3">
                <div class="p-2 bg-purple-100 rounded-lg">
                  <lucide-icon [img]="fileTextIcon" class="w-6 h-6 text-purple-600"></lucide-icon>
                </div>
                <div>
                  <h3 class="text-lg font-semibold">{{ template.name }}</h3>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-300 mt-2">
                    {{ template.category }}
                  </span>
                </div>
              </div>
            </div>
            
            <p class="text-sm text-gray-600 mb-4">{{ template.description }}</p>
            
            <div class="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <label class="text-gray-600">Frecuencia</label>
                <p class="mt-1">{{ template.frequency }}</p>
              </div>
              <div>
                <label class="text-gray-600">Última generación</label>
                <p class="mt-1">{{ template.lastGenerated }}</p>
              </div>
              <div>
                <label class="text-gray-600">Tiempo estimado</label>
                <p class="mt-1">{{ template.estimatedTime }}</p>
              </div>
              <div>
                <label class="text-gray-600">Tamaño promedio</label>
                <p class="mt-1">{{ template.size }}</p>
              </div>
            </div>

            <div class="mb-4">
              <label class="text-sm text-gray-600">Formatos disponibles</label>
              <div class="flex gap-2 mt-2">
                <span *ngFor="let fmt of template.format" 
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                  {{ fmt }}
                </span>
              </div>
            </div>

            <button 
              (click)="openExportDialog(template)"
              class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
              Generar reporte
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de exportación -->
      <div *ngIf="selectedTemplate && isExportDialogOpen" 
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
           (click)="closeExportDialog()">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
             (click)="$event.stopPropagation()">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold">Generar Reporte: {{ selectedTemplate.name }}</h2>
            <p class="text-gray-600">{{ selectedTemplate.description }}</p>
          </div>
          
          <div class="p-6 space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Formato de exportación</label>
              <select 
                [(ngModel)]="selectedFormat"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option *ngFor="let fmt of selectedTemplate.format" [value]="fmt">{{ fmt }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <select 
                [(ngModel)]="selectedPeriod"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="current_month">Mes actual</option>
                <option value="last_month">Mes anterior</option>
                <option value="last_3_months">Últimos 3 meses</option>
                <option value="year_to_date">Año en curso</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start gap-2">
                <lucide-icon [img]="fileTextIcon" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></lucide-icon>
                <div class="text-sm">
                  <p class="font-medium text-blue-900 mb-1">Información del reporte</p>
                  <ul class="space-y-1 text-blue-700">
                    <li>• Tiempo estimado: {{ selectedTemplate.estimatedTime }}</li>
                    <li>• Tamaño aproximado: {{ selectedTemplate.size }}</li>
                    <li>• El reporte se descargará automáticamente al completarse</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button 
              (click)="closeExportDialog()"
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button 
              (click)="handleExport()"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
              Generar y descargar
            </button>
          </div>
        </div>
      </div>

      </div>
    </app-page-layout>
  `
})
export class ExportarComponent implements OnInit, OnDestroy {
  fileSpreadsheetIcon = FileSpreadsheet;
  fileTextIcon = FileText;
  fileClockIcon = FileClock;
  calendarIcon = Calendar;
  downloadIcon = Download;
  searchIcon = Search;

  searchTerm = '';
  categoryFilter = 'all';
  isExportDialogOpen = false;
  selectedTemplate: ReportTemplate | null = null;
  selectedFormat = 'PDF';
  selectedPeriod = 'current_month';
  private roleSubscription?: Subscription;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Reportes y Analítica', route: '/reportes' },
    { label: 'Exportaciones' }
  ];

  // Datos mock de reportes disponibles (basados en React)
  templates: ReportTemplate[] = [
    {
      id: "REP-001",
      name: "Reporte Mensual de Prescripciones",
      category: "Prescripciones",
      description: "Estadísticas completas de prescripciones emitidas por período",
      frequency: "Mensual",
      format: ["PDF", "Excel", "CSV"],
      lastGenerated: "2024-09-30",
      estimatedTime: "2-3 min",
      size: "2.4 MB"
    },
    {
      id: "REP-002",
      name: "Actividad por Médico",
      category: "Médicos",
      description: "Análisis detallado de prescripciones por médico",
      frequency: "Mensual",
      format: ["PDF", "Excel"],
      lastGenerated: "2024-09-30",
      estimatedTime: "3-4 min",
      size: "1.8 MB"
    },
    {
      id: "REP-003",
      name: "Inventario y Stock",
      category: "Farmacia",
      description: "Estado actual de inventario, alertas y movimientos",
      frequency: "Semanal",
      format: ["PDF", "Excel"],
      lastGenerated: "2024-10-01",
      estimatedTime: "1-2 min",
      size: "1.2 MB"
    },
    {
      id: "REP-004",
      name: "Dispensaciones de Farmacia",
      category: "Farmacia",
      description: "Reporte completo de dispensaciones realizadas",
      frequency: "Diario",
      format: ["PDF", "Excel", "CSV"],
      lastGenerated: "2024-10-01",
      estimatedTime: "1-2 min",
      size: "950 KB"
    },
    {
      id: "REP-005",
      name: "Alertas Clínicas (CDS)",
      category: "Seguridad",
      description: "Registro de alertas clínicas y resoluciones",
      frequency: "Mensual",
      format: ["PDF", "Excel"],
      lastGenerated: "2024-09-30",
      estimatedTime: "2-3 min",
      size: "1.5 MB"
    },
    {
      id: "REP-006",
      name: "Medicamentos Más Prescritos",
      category: "Analítica",
      description: "Top de medicamentos por frecuencia de prescripción",
      frequency: "Mensual",
      format: ["PDF", "Excel"],
      lastGenerated: "2024-09-30",
      estimatedTime: "1-2 min",
      size: "800 KB"
    },
    {
      id: "REP-007",
      name: "Auditoría de Accesos",
      category: "Seguridad",
      description: "Log de auditoría completo según normativas HIPAA",
      frequency: "Mensual",
      format: ["PDF", "CSV"],
      lastGenerated: "2024-09-30",
      estimatedTime: "3-5 min",
      size: "3.2 MB"
    },
    {
      id: "REP-008",
      name: "Costos de Medicamentos",
      category: "Financiero",
      description: "Análisis de costos por medicamento y total",
      frequency: "Mensual",
      format: ["PDF", "Excel"],
      lastGenerated: "2024-09-30",
      estimatedTime: "2-3 min",
      size: "1.6 MB"
    }
  ];

  constructor(
    private roleSuggestionService: RoleSuggestionService,
    private roleDemoService: RoleDemoService
  ) {}

  ngOnInit() {
    // El modal de sugerencia de rol es manejado globalmente por el layout
    // No necesitamos lógica específica aquí
  }

  ngOnDestroy() {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }

  get filteredTemplates(): ReportTemplate[] {
    return this.templates.filter(template => {
      const matchesSearch = 
        template.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.categoryFilter === 'all' || template.category === this.categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }

  get categories(): string[] {
    return Array.from(new Set(this.templates.map(t => t.category)));
  }

  openExportDialog(template: ReportTemplate) {
    this.selectedTemplate = template;
    this.selectedFormat = template.format[0]; // Seleccionar el primer formato disponible
    this.isExportDialogOpen = true;
  }

  closeExportDialog() {
    this.isExportDialogOpen = false;
    this.selectedTemplate = null;
  }

  handleExport() {
    if (!this.selectedTemplate) return;

    // Simular generación de reporte
    alert(`Reporte "${this.selectedTemplate.name}" se está generando en formato ${this.selectedFormat}`);
    
    this.closeExportDialog();
  }
}