import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { HomeViewComponent } from './components/home-view.component';
import { SearchViewComponent } from './components/search-view.component';
import { BreadcrumbsComponent, type BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs.component';
import { 
  ArticleViewComponent,
  FAQDetailViewComponent,
  CategoryViewComponent,
  GlossaryViewComponent,
  VideosViewComponent,
  FavoritesViewComponent,
  RecentsViewComponent,
  ContactViewComponent
} from './components/help-views.component';
import { 
  LucideAngularModule, 
  HelpCircle, 
  BookOpen, 
  Video, 
  MessageSquare, 
  Phone, 
  Mail, 
  Search,
  Sparkles,
  Heart,
  History,
  BookMarked,
  ArrowLeft,
  FileText,
  Users,
  Package,
  Shield,
  BarChart,
  ShieldCheck,
  Network,
  AlertTriangle,
  Settings,
  Info,
  ChevronRight,
  Star,
  Eye,
  Clock,
  GraduationCap,
  TrendingUp,
  PlayCircle,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Pill,
  Home
} from 'lucide-angular';
import { 
  HelpService, 
  type FAQ, 
  type KnowledgeArticle, 
  type SearchResult,
  type HelpCategory,
  type GlossaryTerm,
  type FavoriteItem,
  type RecentItem,
  type VideoTutorial,
  type HelpStats,
  type SupportMessage
} from '../../services/help.service';

type ViewType = "home" | "search" | "article" | "faq-detail" | "category" | "glossary" | "videos" | "favorites" | "recents" | "contact";

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    LucideAngularModule,
    BreadcrumbsComponent,
    HomeViewComponent,
    SearchViewComponent,
    ArticleViewComponent,
    FAQDetailViewComponent,
    CategoryViewComponent,
    GlossaryViewComponent,
    VideosViewComponent,
    FavoritesViewComponent,
    RecentsViewComponent,
    ContactViewComponent
  ],
  template: `
    <div class="space-y-6">
      <!-- Header Principal -->
      <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-8 text-white shadow-lg">
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-4">
            <div class="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <lucide-icon [img]="helpCircleIcon" class="w-8 h-8"></lucide-icon>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white mb-2">Centro de Ayuda y Soporte</h1>
              <p class="text-indigo-50 text-lg max-w-2xl">
                Encuentra respuestas, guías paso a paso, tutoriales y toda la información que necesitas para usar ePrescription
              </p>
              <div class="flex flex-wrap gap-2 mt-4">
                <span class="bg-white/20 text-white border border-white/30 hover:bg-white/30 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <lucide-icon [img]="bookOpenIcon" class="w-3 h-3"></lucide-icon>
                  {{ stats.totalArticles }} Artículos
                </span>
                <span class="bg-white/20 text-white border border-white/30 hover:bg-white/30 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <lucide-icon [img]="helpCircleIcon" class="w-3 h-3"></lucide-icon>
                  {{ stats.totalFAQs }} FAQs
                </span>
                <span class="bg-white/20 text-white border border-white/30 hover:bg-white/30 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <lucide-icon [img]="bookMarkedIcon" class="w-3 h-3"></lucide-icon>
                  {{ stats.totalGlossaryTerms }} Términos
                </span>
                <span class="bg-white/20 text-white border border-white/30 hover:bg-white/30 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <lucide-icon [img]="thumbsUpIcon" class="w-3 h-3"></lucide-icon>
                  {{ stats.avgHelpfulRate }}% Útil
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navegación rápida -->
      <div class="flex flex-wrap gap-3">
        <button
          (click)="setView('favorites')"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors"
        >
          <lucide-icon [img]="heartIcon" class="w-4 h-4"></lucide-icon>
          Favoritos <span *ngIf="favorites.length > 0" class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">({{ favorites.length }})</span>
        </button>
        <button
          (click)="setView('recents')"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
        >
          <lucide-icon [img]="historyIcon" class="w-4 h-4"></lucide-icon>
          Recientes <span *ngIf="recents.length > 0" class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">({{ recents.length }})</span>
        </button>
        <button
          (click)="setView('glossary')"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
        >
          <lucide-icon [img]="bookMarkedIcon" class="w-4 h-4"></lucide-icon>
          Glosario
        </button>
        <button
          (click)="setView('contact')"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
        >
          <lucide-icon [img]="messageSquareIcon" class="w-4 h-4"></lucide-icon>
          Contactar soporte
        </button>
      </div>

      <!-- Barra de búsqueda principal -->
      <div class="bg-white border-2 border-indigo-200 shadow-lg rounded-lg">
        <div class="p-6">
          <div class="flex gap-2">
            <div class="flex-1 relative">
              <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></lucide-icon>
              <input
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchQueryChange()"
                (keydown.enter)="handleSearch()"
                placeholder="Busca tu pregunta aquí... (Ej: ¿Cómo crear una receta?)"
                class="w-full pl-10 pr-4 h-12 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <lucide-icon 
                *ngIf="searchQuery" 
                [img]="sparklesIcon" 
                class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500 animate-pulse"
              ></lucide-icon>
            </div>
            <button 
              (click)="handleSearch()" 
              [disabled]="searching || !searchQuery.trim()"
              class="h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <div *ngIf="searching" class="flex items-center gap-2">
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Buscando...
              </div>
              <div *ngIf="!searching" class="flex items-center gap-2">
                <lucide-icon [img]="searchIcon" class="w-4 h-4"></lucide-icon>
                Buscar
              </div>
            </button>
          </div>

          <!-- Sugerencias de IA -->
          <div *ngIf="aiSuggestions.length > 0" class="mt-3 space-y-2">
            <p class="text-sm text-gray-600 flex items-center gap-1">
              <lucide-icon [img]="sparklesIcon" class="w-3 h-3 text-purple-500"></lucide-icon>
              Sugerencias de búsqueda:
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                *ngFor="let suggestion of aiSuggestions"
                (click)="selectSuggestion(suggestion)"
                class="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Breadcrumbs usando el componente existente -->
      <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>

      <!-- Vista condicional -->
      <div [ngSwitch]="currentView">
        <!-- Home View -->
        <div *ngSwitchCase="'home'">
          <app-home-view 
            [categories]="categories"
            [featuredArticles]="featuredArticles"
            [popularFAQs]="popularFAQs"
            (selectCategory)="handleSelectCategory($event)"
            (selectArticle)="handleSelectArticle($event)"
            (selectFAQ)="handleSelectFAQ($event)"
            (setView)="handleSetView($event)"
          ></app-home-view>
        </div>

        <!-- Search View -->
        <div *ngSwitchCase="'search'">
          <app-search-view
            [results]="searchResults"
            [query]="searchQuery"
            (selectArticle)="handleSelectArticle($event)"
            (selectFAQ)="handleSelectFAQ($event)"
            (back)="handleBack()"
          ></app-search-view>
        </div>

        <!-- Article View -->
        <div *ngSwitchCase="'article'">
          <app-article-view
            *ngIf="selectedArticle"
            [article]="selectedArticle"
            [isFavorite]="isArticleFavorite(selectedArticle.id)"
            (back)="handleBack()"
            (toggleFavorite)="toggleArticleFavorite(selectedArticle.id)"
            (markHelpful)="markAsHelpful(selectedArticle.id, 'article')"
            (markNotHelpful)="markAsNotHelpful(selectedArticle.id, 'article')"
          ></app-article-view>
        </div>

        <!-- FAQ Detail View -->
        <div *ngSwitchCase="'faq-detail'">
          <app-faq-detail-view
            *ngIf="selectedFAQ"
            [faq]="selectedFAQ"
            [isFavorite]="isFAQFavorite(selectedFAQ.id)"
            (back)="handleBack()"
            (toggleFavorite)="toggleFAQFavorite(selectedFAQ.id)"
            (markHelpful)="markAsHelpful(selectedFAQ.id, 'faq')"
            (markNotHelpful)="markAsNotHelpful(selectedFAQ.id, 'faq')"
          ></app-faq-detail-view>
        </div>

        <!-- Category View -->
        <div *ngSwitchCase="'category'">
          <app-category-view
            *ngIf="selectedCategory"
            [category]="selectedCategory"
            [articles]="getArticlesByCategory(selectedCategory.value)"
            [faqs]="getFAQsByCategory(selectedCategory.value)"
            (selectArticle)="handleSelectArticle($event)"
            (selectFAQ)="handleSelectFAQ($event)"
            (back)="handleBack()"
          ></app-category-view>
        </div>

        <!-- Glossary View -->
        <div *ngSwitchCase="'glossary'">
          <app-glossary-view
            [terms]="glossaryTerms"
            (back)="handleBack()"
          ></app-glossary-view>
        </div>

        <!-- Videos View -->
        <div *ngSwitchCase="'videos'">
          <app-videos-view
            [videos]="videos"
            (back)="handleBack()"
          ></app-videos-view>
        </div>

        <!-- Favorites View -->
        <div *ngSwitchCase="'favorites'">
          <app-favorites-view
            [items]="favorites"
            (selectArticle)="handleSelectArticle($event)"
            (selectFAQ)="handleSelectFAQ($event)"
            (back)="handleBack()"
            (remove)="removeFavorite($event.id, $event.type)"
          ></app-favorites-view>
        </div>

        <!-- Recents View -->
        <div *ngSwitchCase="'recents'">
          <app-recents-view
            [items]="recents"
            (selectArticle)="handleSelectArticle($event)"
            (selectFAQ)="handleSelectFAQ($event)"
            (back)="handleBack()"
            (clear)="clearRecents()"
          ></app-recents-view>
        </div>

        <!-- Contact View -->
        <div *ngSwitchCase="'contact'">
          <app-contact-view
            (back)="handleBack()"
          ></app-contact-view>
        </div>
      </div>
    </div>
  `
})
export class AyudaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Icons
  helpCircleIcon = HelpCircle;
  bookOpenIcon = BookOpen;
  videoIcon = Video;
  messageSquareIcon = MessageSquare;
  phoneIcon = Phone;
  mailIcon = Mail;
  searchIcon = Search;
  sparklesIcon = Sparkles;
  heartIcon = Heart;
  historyIcon = History;
  bookMarkedIcon = BookMarked;
  arrowLeftIcon = ArrowLeft;
  fileTextIcon = FileText;
  usersIcon = Users;
  packageIcon = Package;
  shieldIcon = Shield;
  barChartIcon = BarChart;
  shieldCheckIcon = ShieldCheck;
  networkIcon = Network;
  alertTriangleIcon = AlertTriangle;
  settingsIcon = Settings;
  infoIcon = Info;
  chevronRightIcon = ChevronRight;
  starIcon = Star;
  eyeIcon = Eye;
  clockIcon = Clock;
  graduationCapIcon = GraduationCap;
  trendingUpIcon = TrendingUp;
  playCircleIcon = PlayCircle;
  lightbulbIcon = Lightbulb;
  thumbsUpIcon = ThumbsUp;
  thumbsDownIcon = ThumbsDown;
  pillIcon = Pill;
  homeIcon = Home;

  // State
  currentView: ViewType = "home";
  searchQuery = "";
  searchResults: SearchResult[] = [];
  searching = false;
  selectedArticle: KnowledgeArticle | null = null;
  selectedFAQ: FAQ | null = null;
  selectedCategory: { value: HelpCategory; label: string; description: string; icon: string } | null = null;
  aiSuggestions: string[] = [];
  favorites: FavoriteItem[] = [];
  recents: RecentItem[] = [];
  supportMessages: SupportMessage[] = [];
  breadcrumbItems: BreadcrumbItem[] = [];

  // Data
  stats: HelpStats;
  categories: Array<{ value: HelpCategory; label: string; description: string; icon: string }> = [];
  featuredArticles: KnowledgeArticle[] = [];
  popularFAQs: FAQ[] = [];
  glossaryTerms: GlossaryTerm[] = [];
  videos: VideoTutorial[] = [];

  constructor(private helpService: HelpService) {
    this.stats = this.helpService.getHelpStats();
    this.categories = this.helpService.getCategories();
    this.featuredArticles = this.helpService.getFeaturedArticles();
    this.popularFAQs = this.helpService.getPopularFAQs(8);
    this.glossaryTerms = this.helpService.getGlossaryTerms();
    this.videos = this.helpService.getAllVideos();
    this.updateBreadcrumbs();
  }

  ngOnInit(): void {
    // Suscribirse a favoritos y recientes
    this.helpService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe(favorites => this.favorites = favorites);

    this.helpService.recents$
      .pipe(takeUntil(this.destroy$))
      .subscribe(recents => this.recents = recents);

    this.helpService.supportMessages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => this.supportMessages = messages);

    // Configurar búsqueda con debounce para sugerencias
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        if (query.length > 2) {
          this.helpService.getAISuggestions(query)
            .pipe(takeUntil(this.destroy$))
            .subscribe(suggestions => this.aiSuggestions = suggestions);
        } else {
          this.aiSuggestions = [];
        }
      });

    // Observar cambios en searchQuery para sugerencias
    this.searchSubject.next(this.searchQuery);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Métodos de navegación
  setView(view: ViewType): void {
    this.currentView = view;
    this.updateBreadcrumbs();
  }

  handleSetView(view: string): void {
    this.setView(view as ViewType);
  }

  handleBack(): void {
    this.currentView = "home";
    this.selectedArticle = null;
    this.selectedFAQ = null;
    this.selectedCategory = null;
    this.updateBreadcrumbs();
  }

  private updateBreadcrumbs(): void {
    // Siempre incluir "Centro de Ayuda" como base
    this.breadcrumbItems = [
      { label: 'Centro de Ayuda', route: '/ayuda' }
    ];
    
    switch (this.currentView) {
      case 'home':
        // Solo mostrar "Centro de Ayuda" en home
        break;
        
      case 'search':
        this.breadcrumbItems.push(
          { label: 'Búsqueda' },
          { label: `"${this.searchQuery}"` }
        );
        break;
      
      case 'article':
        if (this.selectedArticle) {
          const categoryLabel = this.getCategoryLabel(this.selectedArticle.category);
          this.breadcrumbItems.push(
            { label: categoryLabel },
            { label: this.selectedArticle.title }
          );
        }
        break;
      
      case 'faq-detail':
        if (this.selectedFAQ) {
          const categoryLabel = this.getCategoryLabel(this.selectedFAQ.category);
          this.breadcrumbItems.push(
            { label: categoryLabel },
            { label: this.selectedFAQ.question }
          );
        }
        break;
      
      case 'category':
        if (this.selectedCategory) {
          this.breadcrumbItems.push(
            { label: this.selectedCategory.label }
          );
        }
        break;
      
      case 'glossary':
        this.breadcrumbItems.push(
          { label: 'Glosario' }
        );
        break;
      
      case 'videos':
        this.breadcrumbItems.push(
          { label: 'Videos Tutoriales' }
        );
        break;
      
      case 'favorites':
        this.breadcrumbItems.push(
          { label: 'Favoritos' }
        );
        break;
      
      case 'recents':
        this.breadcrumbItems.push(
          { label: 'Recientes' }
        );
        break;
      
      case 'contact':
        this.breadcrumbItems.push(
          { label: 'Contactar Soporte' }
        );
        break;
    }
  }

  private getCategoryLabel(category: HelpCategory): string {
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

  private handleSelectCategoryByValue(categoryValue: HelpCategory): void {
    const category = this.categories.find(c => c.value === categoryValue);
    if (category) {
      this.handleSelectCategory(category);
    }
  }

  // Métodos de búsqueda
  handleSearch(): void {
    if (!this.searchQuery.trim()) return;

    this.searching = true;
    this.currentView = "search";

    this.helpService.search(this.searchQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          this.searchResults = results;
          this.searching = false;
        },
        error: () => {
          this.searching = false;
        }
      });
  }

  selectSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.handleSearch();
  }

  onSearchQueryChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  // Métodos de selección
  handleSelectArticle(articleId: string): void {
    const article = this.helpService.getArticleById(articleId);
    if (article) {
      this.selectedArticle = article;
      this.currentView = "article";
      this.updateBreadcrumbs();
      this.helpService.addRecent(articleId, "article");
    }
  }

  handleSelectFAQ(faqId: string): void {
    const faq = this.helpService.getFAQById(faqId);
    if (faq) {
      this.selectedFAQ = faq;
      this.currentView = "faq-detail";
      this.updateBreadcrumbs();
      this.helpService.addRecent(faqId, "faq");
    }
  }

  handleSelectCategory(category: { value: HelpCategory; label: string; description: string; icon: string }): void {
    this.selectedCategory = category;
    this.currentView = "category";
    this.updateBreadcrumbs();
  }

  // Métodos de datos
  getArticlesByCategory(category: HelpCategory): KnowledgeArticle[] {
    return this.helpService.getArticlesByCategory(category);
  }

  getFAQsByCategory(category: HelpCategory): FAQ[] {
    return this.helpService.getFAQsByCategory(category);
  }

  // Métodos de favoritos
  isArticleFavorite(id: string): boolean {
    return this.helpService.isFavorite(id, "article");
  }

  isFAQFavorite(id: string): boolean {
    return this.helpService.isFavorite(id, "faq");
  }

  toggleArticleFavorite(id: string): void {
    if (this.isArticleFavorite(id)) {
      this.helpService.removeFavorite(id, "article");
    } else {
      this.helpService.addFavorite(id, "article");
    }
  }

  toggleFAQFavorite(id: string): void {
    if (this.isFAQFavorite(id)) {
      this.helpService.removeFavorite(id, "faq");
    } else {
      this.helpService.addFavorite(id, "faq");
    }
  }

  removeFavorite(id: string, type: "faq" | "article"): void {
    this.helpService.removeFavorite(id, type);
  }

  // Métodos de recientes
  clearRecents(): void {
    this.helpService.clearRecents();
  }

  // Métodos de feedback
  markAsHelpful(id: string, type: "faq" | "article"): void {
    this.helpService.markAsHelpful(id, type)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  markAsNotHelpful(id: string, type: "faq" | "article"): void {
    this.helpService.markAsNotHelpful(id, type)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  // Métodos de mensajes de soporte (para uso en otras vistas)
  getSupportMessages(): SupportMessage[] {
    return this.supportMessages;
  }

  getSupportMessagesByStatus(status: SupportMessage['status']): SupportMessage[] {
    return this.helpService.getSupportMessagesByStatus(status);
  }

  getSupportStats() {
    return this.helpService.getSupportStats();
  }
}