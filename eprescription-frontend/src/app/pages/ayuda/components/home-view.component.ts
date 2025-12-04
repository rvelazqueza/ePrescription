import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  LucideAngularModule, 
  BookOpen,
  Star,
  HelpCircle,
  Video,
  BookMarked,
  MessageSquare,
  ChevronRight,
  Eye,
  Clock,
  GraduationCap,
  TrendingUp,
  PlayCircle,
  Lightbulb,
  Phone,
  Mail,
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
  Pill
} from 'lucide-angular';
import { 
  type KnowledgeArticle, 
  type FAQ, 
  type HelpCategory 
} from '../../../services/help.service';

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6">
      <!-- Categorías principales -->
      <div class="bg-white border border-gray-200 shadow-sm rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div class="flex items-center gap-2 mb-2">
            <div class="bg-indigo-600 text-white p-2 rounded-lg">
              <lucide-icon [img]="bookOpenIcon" class="w-5 h-5"></lucide-icon>
            </div>
            <h2 class="text-xl font-semibold">Explora por categoría</h2>
          </div>
          <p class="text-gray-600">
            Encuentra ayuda organizada por módulos del sistema
          </p>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              *ngFor="let category of categories"
              (click)="selectCategory.emit(category)"
              class="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
            >
              <div class="bg-indigo-100 text-indigo-600 p-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <lucide-icon [img]="getIcon(category.icon)" class="w-5 h-5"></lucide-icon>
              </div>
              <div class="flex-1">
                <h4 class="font-medium group-hover:text-indigo-600 transition-colors">
                  {{ category.label }}
                </h4>
                <p class="text-sm text-gray-600 mt-1">
                  {{ category.description }}
                </p>
              </div>
              <lucide-icon [img]="chevronRightIcon" class="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors"></lucide-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Artículos destacados -->
      <div class="bg-white border border-gray-200 shadow-sm rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <div class="flex items-center gap-2 mb-2">
            <div class="bg-amber-600 text-white p-2 rounded-lg">
              <lucide-icon [img]="starIcon" class="w-5 h-5"></lucide-icon>
            </div>
            <h2 class="text-xl font-semibold">Guías destacadas</h2>
          </div>
          <p class="text-gray-600">
            Los artículos más útiles y completos
          </p>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              *ngFor="let article of featuredArticles"
              (click)="selectArticle.emit(article.id)"
              class="border border-gray-200 rounded-lg p-4 hover:border-amber-300 hover:bg-amber-50 cursor-pointer transition-all group"
            >
              <div class="flex items-start justify-between mb-2">
                <span class="bg-amber-100 text-amber-700 border border-amber-300 px-2 py-1 rounded-full text-xs">
                  {{ getCategoryLabel(article.category) }}
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
                <div class="flex items-center gap-3 text-xs text-gray-600">
                  <div class="flex items-center gap-1">
                    <lucide-icon [img]="clockIcon" class="w-3 h-3"></lucide-icon>
                    {{ article.estimatedTime }}
                  </div>
                  <div class="flex items-center gap-1">
                    <lucide-icon [img]="graduationCapIcon" class="w-3 h-3"></lucide-icon>
                    {{ getDifficultyLabel(article.difficulty) }}
                  </div>
                </div>
                <lucide-icon [img]="chevronRightIcon" class="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors"></lucide-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQs populares -->
      <div class="bg-white border border-gray-200 shadow-sm rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div class="flex items-center gap-2 mb-2">
            <div class="bg-emerald-600 text-white p-2 rounded-lg">
              <lucide-icon [img]="helpCircleIcon" class="w-5 h-5"></lucide-icon>
            </div>
            <h2 class="text-xl font-semibold">Preguntas frecuentes</h2>
          </div>
          <p class="text-gray-600">
            Las respuestas que más buscan nuestros usuarios
          </p>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div
              *ngFor="let faq of popularFAQs"
              (click)="selectFAQ.emit(faq.id)"
              class="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer transition-all group"
            >
              <div class="flex items-start gap-3">
                <div class="bg-emerald-100 text-emerald-600 p-2 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors flex-shrink-0">
                  <lucide-icon [img]="helpCircleIcon" class="w-4 h-4"></lucide-icon>
                </div>
                <div class="flex-1">
                  <h4 class="font-medium mb-1 group-hover:text-emerald-600 transition-colors">
                    {{ faq.question }}
                  </h4>
                  <p class="text-sm text-gray-600 line-clamp-2">
                    {{ faq.answer }}
                  </p>
                  <div class="flex items-center gap-3 mt-2 text-xs text-gray-600">
                    <span class="border border-gray-300 px-2 py-1 rounded-full text-xs">
                      {{ getCategoryLabel(faq.category) }}
                    </span>
                    <div class="flex items-center gap-1">
                      <lucide-icon [img]="trendingUpIcon" class="w-3 h-3"></lucide-icon>
                      {{ faq.popularity }} vistas
                    </div>
                  </div>
                </div>
                <lucide-icon [img]="chevronRightIcon" class="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors flex-shrink-0"></lucide-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recursos adicionales -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          (click)="setView.emit('videos')"
          class="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg"
        >
          <div class="p-6">
            <div class="flex flex-col items-center text-center">
              <div class="bg-blue-600 text-white p-4 rounded-xl mb-4">
                <lucide-icon [img]="videoIcon" class="w-8 h-8"></lucide-icon>
              </div>
              <h3 class="font-medium mb-2">Video tutoriales</h3>
              <p class="text-sm text-gray-600 mb-4">
                Aprende visualmente con nuestros videos paso a paso
              </p>
              <button 
                (click)="$event.stopPropagation(); setView.emit('videos')"
                class="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center gap-2"
              >
                <lucide-icon [img]="playCircleIcon" class="w-4 h-4"></lucide-icon>
                Ver videos
              </button>
            </div>
          </div>
        </div>

        <div 
          (click)="setView.emit('glossary')"
          class="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg"
        >
          <div class="p-6">
            <div class="flex flex-col items-center text-center">
              <div class="bg-purple-600 text-white p-4 rounded-xl mb-4">
                <lucide-icon [img]="bookMarkedIcon" class="w-8 h-8"></lucide-icon>
              </div>
              <h3 class="font-medium mb-2">Glosario médico</h3>
              <p class="text-sm text-gray-600 mb-4">
                Definiciones de términos técnicos y acrónimos
              </p>
              <button 
                (click)="$event.stopPropagation(); setView.emit('glossary')"
                class="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center gap-2"
              >
                <lucide-icon [img]="bookMarkedIcon" class="w-4 h-4"></lucide-icon>
                Ver glosario
              </button>
            </div>
          </div>
        </div>

        <div 
          (click)="setView.emit('contact')"
          class="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg"
        >
          <div class="p-6">
            <div class="flex flex-col items-center text-center">
              <div class="bg-rose-600 text-white p-4 rounded-xl mb-4">
                <lucide-icon [img]="messageSquareIcon" class="w-8 h-8"></lucide-icon>
              </div>
              <h3 class="font-medium mb-2">Contactar soporte</h3>
              <p class="text-sm text-gray-600 mb-4">
                ¿No encuentras lo que buscas? Escríbenos
              </p>
              <button 
                (click)="$event.stopPropagation(); setView.emit('contact')"
                class="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center gap-2"
              >
                <lucide-icon [img]="messageSquareIcon" class="w-4 h-4"></lucide-icon>
                Enviar mensaje
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Información de contacto -->
      <div class="border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <lucide-icon [img]="lightbulbIcon" class="h-4 w-4 text-blue-600 mt-0.5"></lucide-icon>
          <div class="text-blue-900">
            <p class="font-medium">¿Necesitas ayuda personalizada?</p>
            <p class="text-sm mt-1">Nuestro equipo de soporte está disponible de lunes a viernes de 8:00 AM a 6:00 PM.</p>
            <div class="flex gap-4 mt-2 text-sm">
              <a 
                href="tel:+50622223333" 
                class="flex items-center gap-1 text-blue-700 hover:text-blue-900 hover:underline transition-colors"
              >
                <lucide-icon [img]="phoneIcon" class="w-3 h-3"></lucide-icon>
                +506 2222-3333
              </a>
              <a 
                href="mailto:soporte&#64;eprescription.cr?subject=Solicitud de soporte - ePrescription"
                class="flex items-center gap-1 text-blue-700 hover:text-blue-900 hover:underline transition-colors"
              >
                <lucide-icon [img]="mailIcon" class="w-3 h-3"></lucide-icon>
                soporte&#64;eprescription.cr
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeViewComponent {
  @Input() categories: Array<{ value: HelpCategory; label: string; description: string; icon: string }> = [];
  @Input() featuredArticles: KnowledgeArticle[] = [];
  @Input() popularFAQs: FAQ[] = [];

  @Output() selectCategory = new EventEmitter<{ value: HelpCategory; label: string; description: string; icon: string }>();
  @Output() selectArticle = new EventEmitter<string>();
  @Output() selectFAQ = new EventEmitter<string>();
  @Output() setView = new EventEmitter<string>();

  // Icons
  bookOpenIcon = BookOpen;
  starIcon = Star;
  helpCircleIcon = HelpCircle;
  videoIcon = Video;
  bookMarkedIcon = BookMarked;
  messageSquareIcon = MessageSquare;
  chevronRightIcon = ChevronRight;
  eyeIcon = Eye;
  clockIcon = Clock;
  graduationCapIcon = GraduationCap;
  trendingUpIcon = TrendingUp;
  playCircleIcon = PlayCircle;
  lightbulbIcon = Lightbulb;
  phoneIcon = Phone;
  mailIcon = Mail;
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
  pillIcon = Pill;

  getIcon(iconName: string): any {
    const iconMap: { [key: string]: any } = {
      'FileText': this.fileTextIcon,
      'Pill': this.pillIcon,
      'Users': this.usersIcon,
      'Package': this.packageIcon,
      'Shield': this.shieldIcon,
      'BarChart': this.barChartIcon,
      'ShieldCheck': this.shieldCheckIcon,
      'Network': this.networkIcon,
      'AlertTriangle': this.alertTriangleIcon,
      'Settings': this.settingsIcon,
      'Info': this.infoIcon
    };
    return iconMap[iconName] || this.infoIcon;
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

  getDifficultyLabel(difficulty: string): string {
    const difficultyMap: { [key: string]: string } = {
      'beginner': 'Básico',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado'
    };
    return difficultyMap[difficulty] || 'Básico';
  }
}