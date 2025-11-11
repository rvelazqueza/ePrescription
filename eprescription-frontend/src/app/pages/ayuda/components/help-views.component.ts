import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, 
  ArrowLeft,
  FileText,
  HelpCircle,
  ChevronRight,
  Eye,
  Clock,
  GraduationCap,
  Star,
  Heart,
  Share2,
  Download,
  ThumbsUp,
  ThumbsDown,
  BookMarked,
  Search,
  Video,
  PlayCircle,
  MessageSquare,
  Phone,
  Mail,
  Send,
  Trash2,
  X,
  Check
} from 'lucide-angular';
import { 
  type KnowledgeArticle, 
  type FAQ, 
  type HelpCategory,
  type GlossaryTerm,
  type FavoriteItem,
  type RecentItem,
  type VideoTutorial,
  type SupportMessage,
  HelpService
} from '../../../services/help.service';
import { MessagingBridgeService } from '../../../services/messaging-bridge.service';
import { NotificationService } from '../../../services/notification.service';

// ============================================
// ARTICLE VIEW COMPONENT
// ============================================
@Component({
  selector: 'app-article-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <div class="bg-white border border-gray-200 shadow-sm rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <div class="flex items-center gap-4 mb-4">
            <button 
              (click)="back.emit()"
              class="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
            >
              <lucide-icon [img]="arrowLeftIcon" class="w-4 h-4"></lucide-icon>
              Volver
            </button>
          </div>
          <h1 class="text-2xl font-bold mb-2">{{ article.title }}</h1>
          <p class="text-gray-600 mb-4">{{ article.summary }}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="border border-gray-300 px-2 py-1 rounded-full text-xs">
              {{ getCategoryLabel(article.category) }}
            </span>
            <span class="border border-gray-300 px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <lucide-icon [img]="clockIcon" class="w-3 h-3"></lucide-icon>
              {{ article.estimatedTime }}
            </span>
            <span class="border border-gray-300 px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <lucide-icon [img]="graduationCapIcon" class="w-3 h-3"></lucide-icon>
              {{ getDifficultyLabel(article.difficulty) }}
            </span>
            <span class="border border-gray-300 px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <lucide-icon [img]="eyeIcon" class="w-3 h-3"></lucide-icon>
              {{ article.views }} vistas
            </span>
          </div>
          
          <!-- Acciones del artículo -->
          <div class="flex gap-2">
            <button 
              (click)="toggleFavorite.emit()"
              [class]="isFavorite ? 'bg-pink-100 text-pink-700 border-pink-300' : 'border-gray-300 hover:bg-gray-50'"
              class="flex items-center gap-2 px-3 py-1 border rounded-md text-sm"
            >
              <lucide-icon [img]="heartIcon" class="w-4 h-4"></lucide-icon>
              {{ isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos' }}
            </button>
            <button class="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              <lucide-icon [img]="share2Icon" class="w-4 h-4"></lucide-icon>
              Compartir
            </button>
            <button class="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
              Descargar
            </button>
          </div>
        </div>
        <div class="p-6">
          <!-- Video (si existe) -->
          <div *ngIf="article.videoUrl" class="mb-6 p-4 border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
            <div class="flex items-center gap-2 text-indigo-900 mb-2">
              <lucide-icon [img]="playCircleIcon" class="h-4 w-4 text-indigo-600"></lucide-icon>
              <strong>Video tutorial disponible:</strong>
            </div>
            <p class="text-indigo-900 text-sm mb-3">Este artículo incluye un video explicativo paso a paso.</p>
            <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2">
              <lucide-icon [img]="playCircleIcon" class="w-4 h-4"></lucide-icon>
              Ver video
            </button>
          </div>

          <!-- Contenido del artículo -->
          <div class="prose max-w-none">
            <div [innerHTML]="getFormattedContent()"></div>
          </div>

          <!-- Feedback -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <h3 class="font-medium mb-4">¿Te resultó útil este artículo?</h3>
            <div class="flex gap-2">
              <button 
                (click)="markHelpful.emit()"
                class="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
              >
                <lucide-icon [img]="thumbsUpIcon" class="w-4 h-4"></lucide-icon>
                Sí, útil
              </button>
              <button 
                (click)="markNotHelpful.emit()"
                class="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                <lucide-icon [img]="thumbsDownIcon" class="w-4 h-4"></lucide-icon>
                No útil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ArticleViewComponent {
  @Input() article!: KnowledgeArticle;
  @Input() isFavorite = false;

  @Output() back = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<void>();
  @Output() markHelpful = new EventEmitter<void>();
  @Output() markNotHelpful = new EventEmitter<void>();

  arrowLeftIcon = ArrowLeft;
  clockIcon = Clock;
  graduationCapIcon = GraduationCap;
  eyeIcon = Eye;
  heartIcon = Heart;
  share2Icon = Share2;
  downloadIcon = Download;
  playCircleIcon = PlayCircle;
  thumbsUpIcon = ThumbsUp;
  thumbsDownIcon = ThumbsDown;

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

  getDifficultyLabel(difficulty: string): string {
    const difficultyMap: { [key: string]: string } = {
      'beginner': 'Básico',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado'
    };
    return difficultyMap[difficulty] || 'Básico';
  }

  getFormattedContent(): string {
    return this.article.content.replace(/\n/g, '<br>').replace(/#{1,6}\s(.+)/g, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
  }
}

// ============================================
// FAQ DETAIL VIEW COMPONENT
// ============================================
@Component({
  selector: 'app-faq-detail-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-white border border-gray-200 shadow-sm rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div class="flex items-center gap-4 mb-4">
          <button 
            (click)="back.emit()"
            class="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <lucide-icon [img]="arrowLeftIcon" class="w-4 h-4"></lucide-icon>
            Volver
          </button>
        </div>
        <div class="flex items-start gap-3">
          <div class="bg-emerald-600 text-white p-3 rounded-full">
            <lucide-icon [img]="helpCircleIcon" class="w-6 h-6"></lucide-icon>
          </div>
          <div class="flex-1">
            <h1 class="text-2xl font-bold mb-2">{{ faq.question }}</h1>
            <div class="flex items-center gap-2">
              <span class="border border-gray-300 px-2 py-1 rounded-full text-xs">
                {{ getCategoryLabel(faq.category) }}
              </span>
              <span class="text-sm text-gray-600">{{ faq.popularity }} vistas</span>
            </div>
          </div>
        </div>
        
        <!-- Acciones -->
        <div class="flex gap-2 mt-4">
          <button 
            (click)="toggleFavorite.emit()"
            [class]="isFavorite ? 'bg-pink-100 text-pink-700 border-pink-300' : 'border-gray-300 hover:bg-gray-50'"
            class="flex items-center gap-2 px-3 py-1 border rounded-md text-sm"
          >
            <lucide-icon [img]="heartIcon" class="w-4 h-4"></lucide-icon>
            {{ isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos' }}
          </button>
          <button class="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            <lucide-icon [img]="share2Icon" class="w-4 h-4"></lucide-icon>
            Compartir
          </button>
        </div>
      </div>
      <div class="p-6">
        <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <p class="text-emerald-900">{{ faq.answer }}</p>
        </div>

        <!-- Palabras clave -->
        <div class="mb-6">
          <p class="text-sm text-gray-600 mb-2">Palabras clave:</p>
          <div class="flex flex-wrap gap-2">
            <span *ngFor="let tag of faq.tags" class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Feedback -->
        <div class="pt-6 border-t border-gray-200">
          <h3 class="font-medium mb-4">¿Respondió tu pregunta?</h3>
          <div class="flex gap-2">
            <button 
              (click)="markHelpful.emit()"
              class="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
            >
              <lucide-icon [img]="thumbsUpIcon" class="w-4 h-4"></lucide-icon>
              Sí
            </button>
            <button 
              (click)="markNotHelpful.emit()"
              class="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
            >
              <lucide-icon [img]="thumbsDownIcon" class="w-4 h-4"></lucide-icon>
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FAQDetailViewComponent {
  @Input() faq!: FAQ;
  @Input() isFavorite = false;

  @Output() back = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<void>();
  @Output() markHelpful = new EventEmitter<void>();
  @Output() markNotHelpful = new EventEmitter<void>();

  arrowLeftIcon = ArrowLeft;
  helpCircleIcon = HelpCircle;
  heartIcon = Heart;
  share2Icon = Share2;
  thumbsUpIcon = ThumbsUp;
  thumbsDownIcon = ThumbsDown;

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

// ============================================
// CATEGORY VIEW COMPONENT
// ============================================
@Component({
  selector: 'app-category-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-white border border-gray-200 shadow-sm rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center gap-4 mb-4">
          <button 
            (click)="back.emit()"
            class="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <lucide-icon [img]="arrowLeftIcon" class="w-4 h-4"></lucide-icon>
            Volver
          </button>
        </div>
        <h1 class="text-2xl font-bold mb-2">{{ category.label }}</h1>
        <p class="text-gray-600">{{ category.description }}</p>
      </div>
      <div class="p-6">
        <!-- Tabs -->
        <div class="border-b border-gray-200 mb-6">
          <nav class="-mb-px flex space-x-8">
            <button 
              (click)="activeTab = 'articles'"
              [class]="activeTab === 'articles' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
            >
              Artículos ({{ articles.length }})
            </button>
            <button 
              (click)="activeTab = 'faqs'"
              [class]="activeTab === 'faqs' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
            >
              FAQs ({{ faqs.length }})
            </button>
          </nav>
        </div>

        <!-- Articles Tab -->
        <div *ngIf="activeTab === 'articles'">
          <div *ngIf="articles.length === 0" class="text-center py-8 text-gray-600">
            <lucide-icon [img]="fileTextIcon" class="w-12 h-12 mx-auto mb-2 opacity-50"></lucide-icon>
            <p>No hay artículos en esta categoría</p>
          </div>
          <div *ngIf="articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              *ngFor="let article of articles"
              (click)="selectArticle.emit(article.id)"
              class="border border-gray-200 rounded-lg p-4 hover:border-amber-300 hover:bg-amber-50 cursor-pointer transition-all group"
            >
              <div class="flex items-start justify-between mb-2">
                <span class="bg-amber-100 text-amber-700 border border-amber-300 px-2 py-1 rounded-full text-xs">
                  {{ getDifficultyLabel(article.difficulty) }}
                </span>
                <div class="flex items-center gap-1 text-xs text-gray-600">
                  <lucide-icon [img]="eyeIcon" class="w-3 h-3"></lucide-icon>
                  {{ article.views }}
                </div>
              </div>
              <h4 class="font-medium mb-2 group-hover:text-amber-600 transition-colors">
                {{ article.title }}
              </h4>
              <p class="text-sm text-gray-600 mb-3">
                {{ article.summary }}
              </p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1 text-xs text-gray-600">
                  <lucide-icon [img]="clockIcon" class="w-3 h-3"></lucide-icon>
                  {{ article.estimatedTime }}
                </div>
                <lucide-icon [img]="chevronRightIcon" class="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors"></lucide-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQs Tab -->
        <div *ngIf="activeTab === 'faqs'">
          <div *ngIf="faqs.length === 0" class="text-center py-8 text-gray-600">
            <lucide-icon [img]="helpCircleIcon" class="w-12 h-12 mx-auto mb-2 opacity-50"></lucide-icon>
            <p>No hay FAQs en esta categoría</p>
          </div>
          <div *ngIf="faqs.length > 0" class="space-y-3">
            <div
              *ngFor="let faq of faqs"
              (click)="selectFAQ.emit(faq.id)"
              class="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer transition-all group"
            >
              <div class="flex items-start gap-3">
                <div class="bg-emerald-100 text-emerald-600 p-2 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <lucide-icon [img]="helpCircleIcon" class="w-4 h-4"></lucide-icon>
                </div>
                <div class="flex-1">
                  <h4 class="font-medium mb-1 group-hover:text-emerald-600 transition-colors">
                    {{ faq.question }}
                  </h4>
                  <p class="text-sm text-gray-600 line-clamp-2">
                    {{ faq.answer }}
                  </p>
                </div>
                <lucide-icon [img]="chevronRightIcon" class="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors"></lucide-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CategoryViewComponent {
  @Input() category!: { value: HelpCategory; label: string; description: string; icon: string };
  @Input() articles: KnowledgeArticle[] = [];
  @Input() faqs: FAQ[] = [];

  @Output() selectArticle = new EventEmitter<string>();
  @Output() selectFAQ = new EventEmitter<string>();
  @Output() back = new EventEmitter<void>();

  activeTab: 'articles' | 'faqs' = 'articles';

  arrowLeftIcon = ArrowLeft;
  fileTextIcon = FileText;
  helpCircleIcon = HelpCircle;
  eyeIcon = Eye;
  clockIcon = Clock;
  chevronRightIcon = ChevronRight;

  getDifficultyLabel(difficulty: string): string {
    const difficultyMap: { [key: string]: string } = {
      'beginner': 'Básico',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado'
    };
    return difficultyMap[difficulty] || 'Básico';
  }
}

// ============================================
// GLOSSARY VIEW COMPONENT
// ============================================
@Component({
  selector: 'app-glossary-view',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="bg-white border border-gray-200 shadow-sm rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <div class="flex items-center gap-4 mb-4">
          <button 
            (click)="back.emit()"
            class="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <lucide-icon [img]="arrowLeftIcon" class="w-4 h-4"></lucide-icon>
            Volver
          </button>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <lucide-icon [img]="bookMarkedIcon" class="w-6 h-6"></lucide-icon>
          <h1 class="text-2xl font-bold">Glosario de términos médicos y técnicos</h1>
        </div>
        <p class="text-gray-600">
          Definiciones de términos utilizados en ePrescription
        </p>
      </div>
      <div class="p-6 space-y-6">
        <!-- Buscador -->
        <div class="relative">
          <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
          <input
            [(ngModel)]="searchTerm"
            (ngModelChange)="filterTerms()"
            placeholder="Buscar término..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <!-- Lista de términos -->
        <div class="space-y-4">
          <div *ngFor="let term of filteredTerms" class="border border-gray-200 rounded-lg p-4">
            <h4 class="font-medium text-lg mb-2">{{ term.term }}</h4>
            <p class="text-sm text-gray-600 mb-3">{{ term.definition }}</p>
            <div *ngIf="term.relatedTerms.length > 0">
              <p class="text-xs text-gray-600 mb-1">Términos relacionados:</p>
              <div class="flex flex-wrap gap-1">
                <span *ngFor="let related of term.relatedTerms" class="border border-gray-300 px-2 py-1 rounded-full text-xs">
                  {{ related }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="filteredTerms.length === 0" class="text-center py-8 text-gray-600">
          <lucide-icon [img]="bookMarkedIcon" class="w-12 h-12 mx-auto mb-2 opacity-50"></lucide-icon>
          <p>No se encontraron términos</p>
        </div>
      </div>
    </div>
  `
})
export class GlossaryViewComponent {
  @Input() terms: GlossaryTerm[] = [];
  @Output() back = new EventEmitter<void>();

  searchTerm = '';
  filteredTerms: GlossaryTerm[] = [];

  arrowLeftIcon = ArrowLeft;
  bookMarkedIcon = BookMarked;
  searchIcon = Search;

  ngOnInit(): void {
    this.filteredTerms = this.terms;
  }

  filterTerms(): void {
    if (!this.searchTerm) {
      this.filteredTerms = this.terms;
    } else {
      const normalized = this.searchTerm.toLowerCase();
      this.filteredTerms = this.terms.filter(term =>
        term.term.toLowerCase().includes(normalized) ||
        term.definition.toLowerCase().includes(normalized)
      );
    }
  }
}

// ============================================
// VIDEOS VIEW COMPONENT
// ============================================
@Component({
  selector: 'app-videos-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-white border border-gray-200 shadow-sm rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div class="flex items-center gap-4 mb-4">
          <button 
            (click)="back.emit()"
            class="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <lucide-icon [img]="arrowLeftIcon" class="w-4 h-4"></lucide-icon>
            Volver
          </button>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <lucide-icon [img]="videoIcon" class="w-6 h-6"></lucide-icon>
          <h1 class="text-2xl font-bold">Biblioteca de videos tutoriales</h1>
        </div>
        <p class="text-gray-600">
          Aprende a usar ePrescription con nuestros tutoriales en video paso a paso
        </p>
      </div>
      <div class="p-6">
        <!-- Filtro por categoría -->
        <div class="mb-6">
          <label class="text-sm text-gray-600 mb-2 block">Filtrar por categoría:</label>
          <div class="flex flex-wrap gap-2">
            <button
              *ngFor="let cat of videoCategories"
              (click)="selectedVideoCategory = cat.value"
              [class]="selectedVideoCategory === cat.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              class="px-3 py-1 rounded-md text-sm transition-colors"
            >
              {{ cat.label }} ({{ cat.count }})
            </button>
          </div>
        </div>

        <!-- Grid de videos -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            *ngFor="let video of getFilteredVideos()"
            (click)="selectVideo(video)"
            class="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group"
          >
            <!-- Thumbnail -->
            <div class="relative aspect-video bg-gray-900">
              <img [src]="video.thumbnail" [alt]="video.title" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div class="bg-blue-600 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                  <lucide-icon [img]="playCircleIcon" class="w-8 h-8"></lucide-icon>
                </div>
              </div>
              <div class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {{ video.duration }}
              </div>
            </div>

            <!-- Info -->
            <div class="p-4">
              <h4 class="font-medium mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {{ video.title }}
              </h4>
              <p class="text-sm text-gray-600 line-clamp-2 mb-3">
                {{ video.description }}
              </p>
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <span [class]="getLevelBadgeClass(video.level)" class="px-2 py-1 rounded-full text-xs">
                    {{ getLevelLabel(video.level) }}
                  </span>
                </div>
                <div class="flex items-center gap-1 text-gray-600">
                  <lucide-icon [img]="eyeIcon" class="w-3 h-3"></lucide-icon>
                  {{ video.views.toLocaleString() }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal de video -->
        <div *ngIf="selectedVideoItem" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" (click)="closeVideoModal()">
          <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
            <!-- Video Player -->
            <div class="aspect-video bg-gray-900 relative">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center text-white">
                  <lucide-icon [img]="playCircleIcon" class="w-20 h-20 mx-auto mb-4 opacity-80"></lucide-icon>
                  <p class="text-lg mb-2">{{ selectedVideoItem.title }}</p>
                  <p class="text-sm opacity-75">Duración: {{ selectedVideoItem.duration }}</p>
                  <button class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 mx-auto">
                    <lucide-icon [img]="playCircleIcon" class="w-4 h-4"></lucide-icon>
                    Reproducir video
                  </button>
                </div>
              </div>
              <button 
                (click)="closeVideoModal()"
                class="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              >
                <lucide-icon [img]="xIcon" class="w-5 h-5"></lucide-icon>
              </button>
            </div>

            <!-- Video Info -->
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <h2 class="text-2xl font-bold mb-2">{{ selectedVideoItem.title }}</h2>
                  <p class="text-gray-600 mb-3">{{ selectedVideoItem.description }}</p>
                  <div class="flex flex-wrap gap-2">
                    <span [class]="getLevelBadgeClass(selectedVideoItem.level)" class="px-2 py-1 rounded-full text-xs">
                      {{ getLevelLabel(selectedVideoItem.level) }}
                    </span>
                    <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <lucide-icon [img]="eyeIcon" class="w-3 h-3"></lucide-icon>
                      {{ selectedVideoItem.views.toLocaleString() }} vistas
                    </span>
                    <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <lucide-icon [img]="clockIcon" class="w-3 h-3"></lucide-icon>
                      {{ selectedVideoItem.duration }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Tags -->
              <div class="border-t border-gray-200 pt-4">
                <p class="text-sm text-gray-600 mb-2">Temas relacionados:</p>
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let tag of selectedVideoItem.tags" class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Acciones -->
              <div class="flex gap-2 pt-4 border-t border-gray-200 mt-4">
                <button class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
                  Descargar transcripción
                </button>
                <button class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <lucide-icon [img]="share2Icon" class="w-4 h-4"></lucide-icon>
                  Compartir
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="videos.length === 0" class="text-center py-12 text-gray-600">
          <lucide-icon [img]="videoIcon" class="w-16 h-16 mx-auto mb-4 opacity-50"></lucide-icon>
          <p>No hay videos disponibles</p>
        </div>
      </div>
    </div>
  `
})
export class VideosViewComponent {
  @Input() videos: VideoTutorial[] = [];
  @Output() back = new EventEmitter<void>();

  selectedVideoItem: VideoTutorial | null = null;
  selectedVideoCategory = 'all';

  arrowLeftIcon = ArrowLeft;
  videoIcon = Video;
  playCircleIcon = PlayCircle;
  eyeIcon = Eye;
  clockIcon = Clock;
  downloadIcon = Download;
  share2Icon = Share2;
  xIcon = X;

  get videoCategories() {
    const categories = [
      { value: 'all', label: 'Todos los videos', count: this.videos.length },
      { value: 'general', label: 'General', count: this.videos.filter(v => v.category === 'general').length },
      { value: 'prescripciones', label: 'Prescripciones', count: this.videos.filter(v => v.category === 'prescripciones').length },
      { value: 'pacientes', label: 'Pacientes', count: this.videos.filter(v => v.category === 'pacientes').length },
      { value: 'dispensacion', label: 'Dispensación', count: this.videos.filter(v => v.category === 'dispensacion').length },
      { value: 'firma-digital', label: 'Firma Digital', count: this.videos.filter(v => v.category === 'firma-digital').length }
    ];
    return categories.filter(cat => cat.count > 0);
  }

  getFilteredVideos(): VideoTutorial[] {
    if (this.selectedVideoCategory === 'all') {
      return this.videos;
    }
    return this.videos.filter(video => video.category === this.selectedVideoCategory);
  }

  selectVideo(video: VideoTutorial): void {
    this.selectedVideoItem = video;
  }

  closeVideoModal(): void {
    this.selectedVideoItem = null;
  }

  getLevelLabel(level: string): string {
    const levelMap: { [key: string]: string } = {
      'beginner': 'Básico',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado'
    };
    return levelMap[level] || 'Básico';
  }

  getLevelBadgeClass(level: string): string {
    const classMap: { [key: string]: string } = {
      'beginner': 'bg-green-50 text-green-700 border border-green-300',
      'intermediate': 'bg-blue-50 text-blue-700 border border-blue-300',
      'advanced': 'bg-purple-50 text-purple-700 border border-purple-300'
    };
    return classMap[level] || 'bg-green-50 text-green-700 border border-green-300';
  }
}

// ============================================
// FAVORITES VIEW COMPONENT
// ============================================
@Component({
  selector: 'app-favorites-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-white border border-gray-200 shadow-sm rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center gap-4 mb-4">
          <button 
            (click)="back.emit()"
            class="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <lucide-icon [img]="arrowLeftIcon" class="w-4 h-4"></lucide-icon>
            Volver
          </button>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <lucide-icon [img]="heartIcon" class="w-6 h-6 text-pink-600"></lucide-icon>
          <h1 class="text-2xl font-bold">Mis Favoritos</h1>
        </div>
        <p class="text-gray-600">Artículos y FAQs que has marcado como favoritos</p>
      </div>
      <div class="p-6">
        <div *ngIf="items.length === 0" class="text-center py-12">
          <lucide-icon [img]="heartIcon" class="w-16 h-16 mx-auto text-gray-400 opacity-50 mb-4"></lucide-icon>
          <h3 class="font-medium mb-2">No tienes favoritos</h3>
          <p class="text-sm text-gray-600 mb-4">
            Marca artículos y FAQs como favoritos para acceder rápidamente
          </p>
          <button 
            (click)="back.emit()"
            class="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Explorar contenido
          </button>
        </div>

        <div *ngIf="items.length > 0" class="space-y-3">
          <div
            *ngFor="let item of items"
            class="border border-gray-200 rounded-lg p-4 hover:border-pink-300 hover:bg-pink-50 cursor-pointer transition-all group"
          >
            <div class="flex items-start gap-3">
              <div [class]="item.type === 'article' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'" class="p-2 rounded-full flex-shrink-0">
                <lucide-icon [img]="item.type === 'article' ? fileTextIcon : helpCircleIcon" class="w-4 h-4"></lucide-icon>
              </div>
              <div class="flex-1" (click)="item.type === 'article' ? selectArticle.emit(item.id) : selectFAQ.emit(item.id)">
                <h4 class="font-medium mb-1 group-hover:text-pink-600 transition-colors">
                  {{ item.title }}
                </h4>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <span class="border border-gray-300 px-2 py-1 rounded-full text-xs">
                    {{ getCategoryLabel(item.category) }}
                  </span>
                  <span class="text-xs">Agregado {{ formatDate(item.addedAt) }}</span>
                </div>
              </div>
              <button 
                (click)="remove.emit({ id: item.id, type: item.type })"
                class="p-1 text-gray-400 hover:text-red-600 transition-colors"
              >
                <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FavoritesViewComponent {
  @Input() items: FavoriteItem[] = [];

  @Output() selectArticle = new EventEmitter<string>();
  @Output() selectFAQ = new EventEmitter<string>();
  @Output() back = new EventEmitter<void>();
  @Output() remove = new EventEmitter<{ id: string; type: 'faq' | 'article' }>();

  arrowLeftIcon = ArrowLeft;
  heartIcon = Heart;
  fileTextIcon = FileText;
  helpCircleIcon = HelpCircle;
  xIcon = X;

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
      day: 'numeric', 
      month: 'short' 
    });
  }
}

// ============================================
// RECENTS VIEW COMPONENT
// ============================================
@Component({
  selector: 'app-recents-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-white border border-gray-200 shadow-sm rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center gap-4 mb-4">
          <button 
            (click)="back.emit()"
            class="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <lucide-icon [img]="arrowLeftIcon" class="w-4 h-4"></lucide-icon>
            Volver
          </button>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <lucide-icon [img]="clockIcon" class="w-6 h-6 text-blue-600"></lucide-icon>
            <h1 class="text-2xl font-bold">Vistos recientemente</h1>
          </div>
          <button 
            *ngIf="items.length > 0"
            (click)="clear.emit()"
            class="flex items-center gap-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded-md text-sm"
          >
            <lucide-icon [img]="trash2Icon" class="w-4 h-4"></lucide-icon>
            Limpiar historial
          </button>
        </div>
        <p class="text-gray-600 mt-2">Artículos y FAQs que has visitado recientemente</p>
      </div>
      <div class="p-6">
        <div *ngIf="items.length === 0" class="text-center py-12">
          <lucide-icon [img]="clockIcon" class="w-16 h-16 mx-auto text-gray-400 opacity-50 mb-4"></lucide-icon>
          <h3 class="font-medium mb-2">No hay elementos recientes</h3>
          <p class="text-sm text-gray-600 mb-4">
            Los artículos y FAQs que visites aparecerán aquí
          </p>
          <button 
            (click)="back.emit()"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Explorar contenido
          </button>
        </div>

        <div *ngIf="items.length > 0" class="space-y-3">
          <div
            *ngFor="let item of items"
            (click)="item.type === 'article' ? selectArticle.emit(item.id) : selectFAQ.emit(item.id)"
            class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group"
          >
            <div class="flex items-start gap-3">
              <div [class]="item.type === 'article' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'" class="p-2 rounded-full flex-shrink-0">
                <lucide-icon [img]="item.type === 'article' ? fileTextIcon : helpCircleIcon" class="w-4 h-4"></lucide-icon>
              </div>
              <div class="flex-1">
                <h4 class="font-medium mb-1 group-hover:text-blue-600 transition-colors">
                  {{ item.title }}
                </h4>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <span class="border border-gray-300 px-2 py-1 rounded-full text-xs">
                    {{ getCategoryLabel(item.category) }}
                  </span>
                  <span class="text-xs">Visto {{ formatDate(item.viewedAt) }}</span>
                </div>
              </div>
              <lucide-icon [img]="chevronRightIcon" class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0"></lucide-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RecentsViewComponent {
  @Input() items: RecentItem[] = [];

  @Output() selectArticle = new EventEmitter<string>();
  @Output() selectFAQ = new EventEmitter<string>();
  @Output() back = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();

  arrowLeftIcon = ArrowLeft;
  clockIcon = Clock;
  trash2Icon = Trash2;
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'hace unos minutos';
    if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  }
}

// ============================================
// CONTACT VIEW COMPONENT
// ============================================
@Component({
  selector: 'app-contact-view',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="bg-white border border-gray-200 shadow-sm rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div class="flex items-center gap-4 mb-4">
          <button 
            (click)="back.emit()"
            class="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <lucide-icon [img]="arrowLeftIcon" class="w-4 h-4"></lucide-icon>
            Volver
          </button>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <lucide-icon [img]="messageSquareIcon" class="w-6 h-6"></lucide-icon>
          <h1 class="text-2xl font-bold">Contactar Soporte</h1>
        </div>
        <p class="text-gray-600">
          ¿No encontraste lo que buscabas? Nuestro equipo está aquí para ayudarte
        </p>
      </div>
      <div class="p-6 space-y-6">
        <!-- Formulario de contacto -->
        <form (ngSubmit)="onSubmitMessage()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
              <input
                [(ngModel)]="contactForm.name"
                name="name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Tu nombre completo"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                [(ngModel)]="contactForm.email"
                name="email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="tu@email.com"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              [(ngModel)]="contactForm.category"
              name="category"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Selecciona una categoría (opcional)</option>
              <option value="prescripciones">Prescripciones</option>
              <option value="dispensacion">Dispensación</option>
              <option value="pacientes">Pacientes</option>
              <option value="inventario">Inventario</option>
              <option value="seguridad">Seguridad</option>
              <option value="reportes">Reportes</option>
              <option value="firma-digital">Firma Digital</option>
              <option value="interoperabilidad">Interoperabilidad</option>
              <option value="alertas">Alertas Clínicas</option>
              <option value="configuracion">Configuración</option>
              <option value="general">General</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Asunto *</label>
            <input
              [(ngModel)]="contactForm.subject"
              name="subject"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Describe brevemente tu consulta"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mensaje *</label>
            <textarea
              [(ngModel)]="contactForm.message"
              name="message"
              rows="5"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Describe tu problema o consulta en detalle..."
            ></textarea>
          </div>

          <!-- Mensaje de éxito -->
          <div *ngIf="showSuccessMessage" class="p-4 bg-green-50 border border-green-200 rounded-md">
            <div class="flex items-center gap-2 text-green-800">
              <lucide-icon [img]="checkIcon" class="w-5 h-5"></lucide-icon>
              <p class="font-medium">¡Mensaje enviado correctamente!</p>
            </div>
            <p class="text-sm text-green-700 mt-1">
              Tu mensaje ha sido enviado al sistema de autoservicio.
              <br>Puedes ver la respuesta en <strong>Autoservicio → Mensajería</strong>.
            </p>
          </div>

          <button
            type="submit"
            [disabled]="isSubmitting || !isFormValid()"
            class="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <div *ngIf="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <lucide-icon *ngIf="!isSubmitting" [img]="sendIcon" class="w-4 h-4"></lucide-icon>
            {{ isSubmitting ? 'Enviando...' : 'Enviar mensaje' }}
          </button>
        </form>

        <!-- Información de contacto directo -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="font-medium mb-4">Otras formas de contacto</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <lucide-icon [img]="phoneIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
              <div>
                <p class="font-medium text-gray-900">Teléfono</p>
                <p class="text-sm text-gray-600">+506 2222-3333</p>
                <p class="text-xs text-gray-500">Lun-Vie 8:00 AM - 6:00 PM</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg">
              <lucide-icon [img]="mailIcon" class="w-5 h-5 text-emerald-600"></lucide-icon>
              <div>
                <p class="font-medium text-gray-900">Email</p>
                <p class="text-sm text-gray-600">soporte&#64;eprescription.cr</p>
                <p class="text-xs text-gray-500">Respuesta en 24 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactViewComponent {
  @Output() back = new EventEmitter<void>();

  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
    category: '' as HelpCategory | ''
  };

  isSubmitting = false;
  showSuccessMessage = false;
  lastMessageId = '';

  arrowLeftIcon = ArrowLeft;
  messageSquareIcon = MessageSquare;
  sendIcon = Send;
  phoneIcon = Phone;
  mailIcon = Mail;
  checkIcon = Check;

  constructor(
    private helpService: HelpService,
    private messagingBridge: MessagingBridgeService,
    private notificationService: NotificationService
  ) {}

  isFormValid(): boolean {
    return !!(
      this.contactForm.name.trim() &&
      this.contactForm.email.trim() &&
      this.contactForm.subject.trim() &&
      this.contactForm.message.trim()
    );
  }

  async onSubmitMessage(): Promise<void> {
    if (!this.isFormValid() || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.showSuccessMessage = false;

    try {
      // Enviar mensaje al sistema de autoservicio
      await this.messagingBridge.sendHelpMessage({
        subject: this.contactForm.subject.trim(),
        content: `Mensaje de: ${this.contactForm.name.trim()} (${this.contactForm.email.trim()})\n\n${this.contactForm.message.trim()}`,
        category: this.contactForm.category as HelpCategory || 'general',
        priority: 'normal'
      }).toPromise();

      // También crear el mensaje en el sistema de ayuda (opcional, para mantener el registro)
      const messageData = {
        name: this.contactForm.name.trim(),
        email: this.contactForm.email.trim(),
        subject: this.contactForm.subject.trim(),
        message: this.contactForm.message.trim(),
        category: this.contactForm.category as HelpCategory || undefined
      };

      this.helpService.createSupportMessage(messageData).subscribe({
        next: (response) => {
          if (response.success) {
            this.lastMessageId = response.messageId;
          }
        },
        error: () => {
          // Error silencioso para el sistema de ayuda
        }
      });

      // Mostrar éxito
      this.showSuccessMessage = true;
      this.resetForm();
      
      this.notificationService.showSuccess(
        'Mensaje enviado correctamente',
        'Tu mensaje ha sido enviado al sistema de autoservicio. Puedes ver la respuesta en Autoservicio → Mensajería.'
      );
      
      // Ocultar mensaje de éxito después de 10 segundos
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 10000);

    } catch (error) {
      this.notificationService.showError(
        'Error al enviar mensaje',
        'No se pudo enviar tu mensaje. Por favor, inténtalo de nuevo.'
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  private resetForm(): void {
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: '',
      category: ''
    };
  }
}