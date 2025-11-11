import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  LucideAngularModule, 
  ArrowLeft,
  Search,
  FileText,
  HelpCircle,
  ChevronRight
} from 'lucide-angular';
import { type SearchResult, type HelpCategory } from '../../../services/help.service';

@Component({
  selector: 'app-search-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-white border border-gray-200 shadow-sm rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center gap-4">
          <button 
            (click)="back.emit()"
            class="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <lucide-icon [img]="arrowLeftIcon" class="w-4 h-4"></lucide-icon>
            Volver
          </button>
          <div class="flex-1">
            <h2 class="text-xl font-semibold">
              Resultados de búsqueda para: "{{ query }}"
            </h2>
            <p class="text-gray-600">
              {{ results.length }} resultado{{ results.length !== 1 ? 's' : '' }} encontrado{{ results.length !== 1 ? 's' : '' }}
            </p>
          </div>
        </div>
      </div>
      <div class="p-6">
        <div *ngIf="results.length === 0" class="text-center py-12">
          <lucide-icon [img]="searchIcon" class="w-16 h-16 mx-auto text-gray-400 opacity-50 mb-4"></lucide-icon>
          <h3 class="font-medium mb-2">No se encontraron resultados</h3>
          <p class="text-sm text-gray-600 mb-4">
            Intenta con otras palabras clave o navega por categorías
          </p>
          <button 
            (click)="back.emit()"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Volver al inicio
          </button>
        </div>

        <div *ngIf="results.length > 0" class="space-y-3">
          <div
            *ngFor="let result of results"
            (click)="result.type === 'article' ? selectArticle.emit(result.id) : selectFAQ.emit(result.id)"
            class="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all group"
          >
            <div class="flex items-start gap-3">
              <div [class]="result.type === 'article' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'" class="p-2 rounded-full flex-shrink-0">
                <lucide-icon [img]="result.type === 'article' ? fileTextIcon : helpCircleIcon" class="w-4 h-4"></lucide-icon>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="font-medium group-hover:text-indigo-600 transition-colors">
                    {{ result.title }}
                  </h4>
                  <span class="border border-gray-300 px-2 py-1 rounded-full text-xs">
                    {{ getCategoryLabel(result.category) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600">
                  {{ result.snippet }}
                </p>
              </div>
              <lucide-icon [img]="chevronRightIcon" class="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0"></lucide-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SearchViewComponent {
  @Input() results: SearchResult[] = [];
  @Input() query = '';

  @Output() selectArticle = new EventEmitter<string>();
  @Output() selectFAQ = new EventEmitter<string>();
  @Output() back = new EventEmitter<void>();

  arrowLeftIcon = ArrowLeft;
  searchIcon = Search;
  fileTextIcon = FileText;
  helpCircleIcon = HelpCircle;
  chevronRightIcon = ChevronRight;

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
}