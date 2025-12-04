import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { 
  LucideAngularModule, 
  FileText, 
  Users, 
  Pill, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  LayoutDashboard, 
  Stethoscope,
  PackageCheck,
  FileCheck,
  AlertCircle,
  XCircle,
  UserCheck,
  Bell,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Eye,
  RefreshCw,
  ChevronRight,
  ArrowRight,
  Info,
  Database,
  Zap,
  CheckCircle,
  ExternalLink,
  Settings
} from 'lucide-angular';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';
import { BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs.component';
import { RoleDemoService, UserRole, RoleSession } from '../../services/role-demo.service';
import { PrescripcionesService } from '../../services/prescripciones.service';
import { PatientService } from '../../services/patient.service';
import { DispensationService } from '../../services/dispensation.service';
import { InventoryService } from '../../services/inventory.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      [title]="getDynamicTitle()"
      [description]="pageDescription"
      [icon]="layoutDashboardIcon"
      [breadcrumbItems]="breadcrumbItems"
      [hasActionButton]="true">
      
      <!-- Header Badges -->
      <div slot="action" class="flex gap-2 flex-wrap">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-colors">
          <lucide-icon [img]="shieldCheckIcon" class="w-3 h-3 mr-1"></lucide-icon>
          HL7 FHIR
        </span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-colors">
          <lucide-icon [img]="checkCircleIcon" class="w-3 h-3 mr-1"></lucide-icon>
          FDA Compliant
        </span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-colors">
          <lucide-icon [img]="stethoscopeIcon" class="w-3 h-3 mr-1"></lucide-icon>
          OMS Standards
        </span>
        <span *ngIf="unreadNotifications >= 0" 
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white border border-red-400 cursor-pointer hover:bg-red-600 transition-colors shadow-lg"
              (click)="navigateTo('/notificaciones/lista')"
              title="Ver notificaciones pendientes">
          <lucide-icon [img]="bellIcon" class="w-3 h-3 mr-1 animate-pulse"></lucide-icon>
          {{ unreadNotifications }} notificaciones
        </span>
      </div>
      
      <!-- Dashboard Content -->
      <div class="space-y-6">
        
        <!-- Selector de Rol para Demostraciones -->
        <div class="bg-white rounded-lg shadow-lg border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white">
          <div class="p-4">
            <div class="flex items-center justify-between gap-4 flex-wrap">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <lucide-icon [img]="eyeIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">Modo Demostración</h3>
                  <p class="text-xs text-gray-600">
                    Cambia de rol para ver el dashboard desde diferentes perspectivas
                  </p>
                </div>
              </div>
              
              <div class="flex items-center gap-3">
                <span *ngIf="currentSession.isDemoMode" 
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-300">
                  <lucide-icon [img]="refreshCwIcon" class="w-3 h-3 mr-1"></lucide-icon>
                  Vista dinámica activa
                </span>
                
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-600">Ver como:</span>
                  <select 
                    [(ngModel)]="selectedRole"
                    (ngModelChange)="onRoleSelectionChange()"
                    class="border border-blue-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option *ngFor="let role of availableRoles" [value]="role">{{ role }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- KPIs Principales según rol -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div *ngFor="let kpi of getCurrentKPIs(); let i = index" 
               class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 group"
               [style.border-left-color]="getKPIBorderColor(kpi.trend)"
               (click)="navigateTo(kpi.route)">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">{{ kpi.label }}</p>
                  <p class="text-3xl font-bold text-gray-900">{{ kpi.value }}</p>
                  <div class="flex items-center gap-1 text-xs">
                    <lucide-icon [img]="getTrendIcon(kpi.trend)" 
                                 [class]="'w-3 h-3 ' + getTrendColor(kpi.trend)"></lucide-icon>
                    <span [class]="getTrendColor(kpi.trend)">{{ kpi.change }}</span>
                    <span class="text-gray-500 ml-1">vs ayer</span>
                  </div>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <lucide-icon [img]="kpi.icon" class="w-8 h-8 text-blue-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones Rápidas según rol -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900 flex items-center">
              <lucide-icon [img]="zapIcon" class="w-5 h-5 mr-2 text-blue-600"></lucide-icon>
              Acciones Rápidas
            </h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div *ngFor="let action of getCurrentQuickActions()" 
                   class="group cursor-pointer overflow-hidden hover:shadow-lg transition-all border border-gray-200 rounded-lg"
                   (click)="navigateTo(action.route)">
                <div [class]="'h-2 bg-gradient-to-r ' + action.gradient"></div>
                <div class="p-4">
                  <div class="flex items-center gap-3">
                    <div [class]="'p-3 bg-gradient-to-br ' + action.gradient + ' rounded-lg'">
                      <lucide-icon [img]="action.icon" class="w-6 h-6 text-white"></lucide-icon>
                    </div>
                    <div class="flex-1">
                      <h3 class="text-sm font-medium group-hover:text-blue-600 transition-colors">{{ action.title }}</h3>
                      <p class="text-xs text-gray-600">{{ action.description }}</p>
                    </div>
                    <lucide-icon [img]="chevronRightIcon" class="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></lucide-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actividad Reciente e Insights -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Actividad Reciente -->
          <div class="bg-white rounded-lg shadow-lg">
            <div class="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900 flex items-center">
                <lucide-icon [img]="clockIcon" class="w-5 h-5 mr-2 text-gray-600"></lucide-icon>
                Actividad Reciente
              </h2>
              <button 
                class="text-sm text-blue-600 hover:text-blue-700 flex items-center transition-colors"
                (click)="navigateTo(getActivityRoute())">
                Ver todo
                <lucide-icon [img]="arrowRightIcon" class="w-4 h-4 ml-1"></lucide-icon>
              </button>
            </div>
            <div class="p-6">
              <div class="space-y-3">
                <div *ngFor="let activity of getCurrentRecentActivity()" 
                     class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                     (click)="navigateTo(activity.route)">
                  <div [class]="'p-2 rounded-lg ' + getActivityStatusBg(activity.status)">
                    <lucide-icon [img]="activity.icon" [class]="'w-4 h-4 ' + getActivityStatusColor(activity.status)"></lucide-icon>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-sm group-hover:text-blue-600 transition-colors truncate">
                        {{ activity.title }}
                      </p>
                      <span class="text-xs text-gray-500 whitespace-nowrap">
                        {{ activity.time }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-600 truncate">
                      {{ activity.subtitle }}
                    </p>
                    <p class="text-xs text-gray-500 font-mono mt-0.5">
                      {{ activity.id }}
                    </p>
                  </div>
                  <lucide-icon [img]="externalLinkIcon" class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <!-- Insights y Recomendaciones -->
          <div class="bg-white rounded-lg shadow-lg">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900 flex items-center">
                <lucide-icon [img]="barChart3Icon" class="w-5 h-5 mr-2 text-blue-600"></lucide-icon>
                Insights y Recomendaciones
              </h2>
            </div>
            <div class="p-6">
              <div class="space-y-3">
                <div *ngFor="let insight of getCurrentInsights()" 
                     [class]="'p-4 rounded-lg border-l-4 ' + getInsightBg(insight.type)"
                     [style.border-left-color]="getInsightBorderColor(insight.type)">
                  <div class="flex items-start gap-3">
                    <lucide-icon [img]="infoIcon" [class]="'w-5 h-5 mt-0.5 ' + getInsightIconColor(insight.type)"></lucide-icon>
                    <div class="flex-1 space-y-2">
                      <h4 class="text-sm font-medium text-gray-900">{{ insight.title }}</h4>
                      <p class="text-xs text-gray-600 leading-relaxed">
                        {{ insight.description }}
                      </p>
                      <button 
                        class="text-xs text-blue-600 hover:text-blue-700 flex items-center transition-colors"
                        (click)="navigateTo(insight.route)">
                        {{ insight.action }}
                        <lucide-icon [img]="arrowRightIcon" class="w-3 h-3 ml-1"></lucide-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado del Sistema -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 flex items-center">
              <lucide-icon [img]="activityIcon" class="w-5 h-5 mr-2 text-green-600"></lucide-icon>
              Estado del Sistema
            </h2>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Operativo
            </span>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div *ngFor="let metric of systemMetrics" class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <lucide-icon [img]="metric.icon" [class]="'w-5 h-5 text-' + metric.color + '-600'"></lucide-icon>
                    <span class="text-sm text-gray-700">{{ metric.label }}</span>
                  </div>
                  <span [class]="'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-' + metric.color + '-100 text-' + metric.color + '-800 border border-' + metric.color + '-200'">
                    {{ metric.status }}
                  </span>
                </div>
                <div class="space-y-1">
                  <div class="flex items-center justify-between text-xs text-gray-600">
                    <span>Salud del servicio</span>
                    <span>{{ metric.health }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div [class]="'bg-' + metric.color + '-500 h-2 rounded-full transition-all duration-300'" 
                         [style.width.%]="metric.health"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </app-page-layout>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  currentSession: RoleSession = {
    activeRole: 'Médico',
    isDemoMode: false,
    assignedRoles: ['Médico', 'Médico Jefe', 'Farmacéutico', 'Enfermera', 'Administrador'],
    fullName: 'Dr. Juan Pérez'
  };
  
  unreadNotifications = 3;
  availableRoles: UserRole[] = ['Médico', 'Médico Jefe', 'Farmacéutico', 'Enfermera', 'Administrador'];
  selectedRole: UserRole = 'Médico';
  
  // Loading states
  isLoadingKPIs = false;
  isLoadingActivity = false;
  
  // Real data from backend
  realKPIs: any[] = [];
  realActivity: any[] = [];

  // Icons
  fileTextIcon = FileText;
  usersIcon = Users;
  pillIcon = Pill;
  activityIcon = Activity;
  trendingUpIcon = TrendingUp;
  trendingDownIcon = TrendingDown;
  layoutDashboardIcon = LayoutDashboard;
  stethoscopeIcon = Stethoscope;
  packageCheckIcon = PackageCheck;
  fileCheckIcon = FileCheck;
  alertCircleIcon = AlertCircle;
  xCircleIcon = XCircle;
  userCheckIcon = UserCheck;
  bellIcon = Bell;
  clipboardListIcon = ClipboardList;
  barChart3Icon = BarChart3;
  shieldCheckIcon = ShieldCheck;
  clockIcon = Clock;
  alertTriangleIcon = AlertTriangle;
  eyeIcon = Eye;
  refreshCwIcon = RefreshCw;
  chevronRightIcon = ChevronRight;
  arrowRightIcon = ArrowRight;
  infoIcon = Info;
  databaseIcon = Database;
  zapIcon = Zap;
  checkCircleIcon = CheckCircle;
  externalLinkIcon = ExternalLink;
  settingsIcon = Settings;

  // Page configuration
  pageDescription = 'Sistema Hospitalario de Prescripción Electrónica';

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Dashboard'}
  ];

  // System metrics (loaded from backend)
  systemMetrics: any[] = [];
  systemMetricsLoading = true;

  constructor(
    private router: Router,
    private roleDemoService: RoleDemoService,
    private prescripcionesService: PrescripcionesService,
    private patientService: PatientService,
    private dispensationService: DispensationService,
    private inventoryService: InventoryService,
    private dashboardService: DashboardService
  ) {
    // Inicializar inmediatamente con el estado actual del servicio
    const currentServiceSession = this.roleDemoService.getCurrentSession();
    this.currentSession = { ...currentServiceSession };
    this.selectedRole = this.currentSession.activeRole;
  }

  ngOnInit(): void {
    // Subscribe to role changes
    this.subscription.add(
      this.roleDemoService.currentSession$.subscribe(session => {
        this.currentSession = session;
        this.selectedRole = session.activeRole;
        // Reload dashboard data when role changes
        this.loadDashboardData();
      })
    );
    
    // Initial load
    this.loadDashboardData();
    this.loadSystemMetrics();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getDynamicTitle(): string {
    return `Dashboard - ${this.currentSession.activeRole}`;
  }

  handleRoleChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newRole = target.value as UserRole;
    this.selectedRole = newRole;
    this.roleDemoService.changeRole(newRole);
  }

  onRoleSelectionChange(): void {
    this.roleDemoService.changeRole(this.selectedRole);
  }

  // Navigation methods
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getActivityRoute(): string {
    switch (this.currentSession.activeRole) {
      case 'Médico':
      case 'Médico Jefe':
        return '/prescripciones/emitidas';
      case 'Farmacéutico':
        return '/dispensacion/registrar';
      case 'Enfermera':
        return '/pacientes/lista';
      case 'Administrador':
        return '/auditoria/log';
      default:
        return '/dashboard';
    }
  }

  /**
   * Load dashboard data from backend
   * Uses existing endpoints to calculate KPIs and recent activity
   */
  loadDashboardData(): void {
    const role = this.currentSession.activeRole;
    
    switch (role) {
      case 'Médico':
      case 'Médico Jefe':
        this.loadMedicoData();
        break;
      case 'Farmacéutico':
        this.loadFarmaceuticoData();
        break;
      case 'Enfermera':
        this.loadEnfermeraData();
        break;
      case 'Administrador':
        this.loadAdministradorData();
        break;
    }
  }

  /**
   * Load data for Médico role
   */
  private loadMedicoData(): void {
    this.isLoadingKPIs = true;
    this.isLoadingActivity = true;
    
    const today = new Date().toISOString().split('T')[0];
    
    forkJoin({
      // KPI: Recetas emitidas hoy
      recetasHoy: this.prescripcionesService.getPrescripciones({
        status: 'active',
        startDate: today,
        pageSize: 1
      }).pipe(
        map(response => response.totalCount || 0),
        catchError(() => [0])
      ),
      
      // KPI: Borradores pendientes
      borradores: this.prescripcionesService.getPrescripciones({
        status: 'draft',
        pageSize: 1
      }).pipe(
        map(response => response.totalCount || 0),
        catchError(() => [0])
      ),
      
      // KPI: Total pacientes en sistema
      pacientes: this.patientService.getAllPatients().pipe(
        map(patients => patients.length || 0),
        catchError(() => [0])
      ),
      
      // Actividad reciente: Últimas 4 prescripciones
      recentPrescriptions: this.prescripcionesService.getPrescripciones({
        status: 'active',
        pageSize: 4
      }).pipe(
        map(response => response.items || []),
        catchError(() => [[]])
      )
    }).subscribe({
      next: (data) => {
        // Build KPIs with real data
        this.realKPIs = [
          { 
            label: 'Recetas hoy', 
            value: data.recetasHoy, 
            change: 'N/A', // TODO: Calculate vs yesterday
            trend: 'neutral', 
            icon: this.fileTextIcon, 
            route: '/prescripciones/emitidas' 
          },
          { 
            label: 'Pacientes atendidos', 
            value: data.pacientes, 
            change: 'N/A', 
            trend: 'neutral', 
            icon: this.usersIcon, 
            route: '/pacientes/lista' 
          },
          { 
            label: 'Borradores pendientes', 
            value: data.borradores, 
            change: '0', 
            trend: 'neutral', 
            icon: this.clockIcon, 
            route: '/prescripciones/borradores' 
          },
          { 
            label: 'Alertas clínicas', 
            value: 0, // TODO: Implement alerts endpoint
            change: 'N/A', 
            trend: 'neutral', 
            icon: this.alertTriangleIcon, 
            route: '/alertas/bandeja' 
          }
        ];
        
        // Build recent activity with real data
        this.realActivity = data.recentPrescriptions.map((prescription: any) => ({
          id: prescription.prescriptionNumber || 'N/A',
          title: 'Receta emitida',
          subtitle: `Paciente ID: ${prescription.patientId || 'N/A'}`,
          time: this.formatTime(prescription.createdAt),
          status: 'success',
          icon: this.fileCheckIcon,
          route: '/prescripciones/emitidas'
        }));
        
        this.isLoadingKPIs = false;
        this.isLoadingActivity = false;
      },
      error: (error) => {
        console.error('Error loading médico dashboard data:', error);
        this.isLoadingKPIs = false;
        this.isLoadingActivity = false;
        // Keep mock data on error
      }
    });
  }

  /**
   * Load data for Farmacéutico role
   */
  private loadFarmaceuticoData(): void {
    this.isLoadingKPIs = true;
    this.isLoadingActivity = true;
    
    const today = new Date().toISOString().split('T')[0];
    
    forkJoin({
      // KPI: Dispensaciones hoy
      dispensacionesHoy: this.dispensationService.search({
        startDate: new Date(today),
        pageSize: 100
      }).pipe(
        map(dispensations => dispensations.length || 0),
        catchError(() => [0])
      ),
      
      // KPI: Stock bajo (TODO: Implement with pharmacy context)
      stockBajo: of(0), // Requires pharmacyId - will implement when pharmacy context is available
      
      // KPI: Recetas verificadas (todas las dispensaciones)
      recetasVerificadas: this.dispensationService.search({
        pageSize: 100
      }).pipe(
        map(dispensations => dispensations.length || 0),
        catchError(() => [0])
      ),
      
      // Actividad reciente: Últimas 4 dispensaciones
      recentDispensations: this.dispensationService.search({
        pageSize: 4
      }).pipe(
        map(dispensations => dispensations || []),
        catchError(() => [[]])
      )
    }).subscribe({
      next: (data) => {
        // Build KPIs with real data
        this.realKPIs = [
          { 
            label: 'Dispensaciones hoy', 
            value: data.dispensacionesHoy, 
            change: 'N/A', 
            trend: 'neutral', 
            icon: this.packageCheckIcon, 
            route: '/dispensacion/registrar' 
          },
          { 
            label: 'Recetas verificadas', 
            value: data.recetasVerificadas, 
            change: 'N/A', 
            trend: 'neutral', 
            icon: this.fileCheckIcon, 
            route: '/dispensacion/verificar' 
          },
          { 
            label: 'Stock bajo', 
            value: data.stockBajo, 
            change: 'N/A', 
            trend: data.stockBajo > 0 ? 'up' : 'neutral', 
            icon: this.alertCircleIcon, 
            route: '/inventario/alertas' 
          },
          { 
            label: 'Rechazos', 
            value: 0, // TODO: Implement rejections tracking
            change: 'N/A', 
            trend: 'neutral', 
            icon: this.xCircleIcon, 
            route: '/dispensacion/rechazos' 
          }
        ];
        
        // Build recent activity with real data
        this.realActivity = data.recentDispensations.map((dispensation: any) => ({
          id: dispensation.id || 'N/A',
          title: 'Dispensación registrada',
          subtitle: `Prescripción: ${dispensation.prescriptionNumber || dispensation.prescriptionId || 'N/A'}`,
          time: this.formatTime(dispensation.dispensationDate || dispensation.createdAt),
          status: 'success',
          icon: this.packageCheckIcon,
          route: '/dispensacion/registrar'
        }));
        
        this.isLoadingKPIs = false;
        this.isLoadingActivity = false;
      },
      error: (error) => {
        console.error('Error loading farmacéutico dashboard data:', error);
        this.isLoadingKPIs = false;
        this.isLoadingActivity = false;
        // Keep mock data on error
      }
    });
  }

  /**
   * Load data for Enfermera role
   */
  private loadEnfermeraData(): void {
    this.isLoadingKPIs = true;
    this.isLoadingActivity = true;
    
    const today = new Date().toISOString().split('T')[0];
    
    forkJoin({
      // KPI: Pacientes registrados hoy (aproximado)
      pacientesHoy: this.patientService.getRecentPatients().pipe(
        map(patients => {
          const todayPatients = patients.filter(p => {
            const regDate = new Date(p.registrationDate);
            const todayDate = new Date(today);
            return regDate.toDateString() === todayDate.toDateString();
          });
          return todayPatients.length;
        }),
        catchError(() => [0])
      ),
      
      // KPI: Total pacientes
      totalPacientes: this.patientService.getAllPatients().pipe(
        map(patients => patients.length || 0),
        catchError(() => [0])
      ),
      
      // Actividad reciente: Últimos 4 pacientes
      recentPatients: this.patientService.getRecentPatients().pipe(
        map(patients => patients.slice(0, 4)),
        catchError(() => [[]])
      )
    }).subscribe({
      next: (data) => {
        // Build KPIs with real data
        this.realKPIs = [
          { 
            label: 'Pacientes registrados', 
            value: data.pacientesHoy, 
            change: 'N/A', 
            trend: 'neutral', 
            icon: this.userCheckIcon, 
            route: '/pacientes/lista' 
          },
          { 
            label: 'Total pacientes', 
            value: data.totalPacientes, 
            change: 'N/A', 
            trend: 'neutral', 
            icon: this.usersIcon, 
            route: '/pacientes/lista' 
          },
          { 
            label: 'Medicamentos administrados', 
            value: 0, // TODO: Implement medication administration tracking
            change: 'N/A', 
            trend: 'neutral', 
            icon: this.pillIcon, 
            route: '/dispensacion/registrar' 
          },
          { 
            label: 'Alertas pendientes', 
            value: 0, // TODO: Implement alerts
            change: 'N/A', 
            trend: 'neutral', 
            icon: this.bellIcon, 
            route: '/alertas/bandeja' 
          }
        ];
        
        // Build recent activity with real data
        this.realActivity = data.recentPatients.map((patient: any) => ({
          id: patient.id || patient.patientId || 'N/A',
          title: 'Paciente registrado',
          subtitle: patient.fullName || `${patient.firstName || ''} ${patient.firstLastName || ''}`.trim() || 'N/A',
          time: this.formatTime(patient.registrationDate || patient.createdAt),
          status: 'success',
          icon: this.userCheckIcon,
          route: '/pacientes/lista'
        }));
        
        this.isLoadingKPIs = false;
        this.isLoadingActivity = false;
      },
      error: (error) => {
        console.error('Error loading enfermera dashboard data:', error);
        this.isLoadingKPIs = false;
        this.isLoadingActivity = false;
        // Keep mock data on error
      }
    });
  }

  /**
   * Load data for Administrador role
   */
  private loadAdministradorData(): void {
    this.isLoadingKPIs = true;
    this.isLoadingActivity = true;
    
    const today = new Date().toISOString().split('T')[0];
    
    forkJoin({
      // KPI: Recetas totales hoy
      recetasHoy: this.prescripcionesService.getPrescripciones({
        status: 'active',
        startDate: today,
        pageSize: 1
      }).pipe(
        map(response => response.totalCount || 0),
        catchError(() => [0])
      ),
      
      // KPI: Total pacientes
      totalPacientes: this.patientService.getAllPatients().pipe(
        map(patients => patients.length || 0),
        catchError(() => [0])
      ),
      
      // Actividad reciente: Últimas 4 prescripciones (todas las activas)
      recentPrescriptions: this.prescripcionesService.getPrescripciones({
        status: 'active',
        pageSize: 4
      }).pipe(
        map(response => response.items || []),
        catchError(() => [[]])
      )
    }).subscribe({
      next: (data) => {
        // Build KPIs with real data
        this.realKPIs = [
          { 
            label: 'Usuarios activos', 
            value: 0, // TODO: Implement user management endpoint
            change: 'N/A', 
            trend: 'neutral', 
            icon: this.usersIcon, 
            route: '/seguridad/usuarios' 
          },
          { 
            label: 'Recetas totales (hoy)', 
            value: data.recetasHoy, 
            change: 'N/A', 
            trend: 'neutral', 
            icon: this.fileTextIcon, 
            route: '/reportes/actividad-medico' 
          },
          { 
            label: 'Total pacientes', 
            value: data.totalPacientes, 
            change: 'N/A', 
            trend: 'neutral', 
            icon: this.usersIcon, 
            route: '/pacientes/lista' 
          },
          { 
            label: 'Incidencias', 
            value: 0, // TODO: Implement incidents tracking
            change: 'N/A', 
            trend: 'neutral', 
            icon: this.alertTriangleIcon, 
            route: '/auditoria/log' 
          }
        ];
        
        // Build recent activity with real data
        this.realActivity = data.recentPrescriptions.map((prescription: any) => ({
          id: prescription.prescriptionNumber || 'N/A',
          title: 'Receta emitida',
          subtitle: `Paciente ID: ${prescription.patientId || 'N/A'}`,
          time: this.formatTime(prescription.createdAt),
          status: 'info',
          icon: this.fileTextIcon,
          route: '/prescripciones/emitidas'
        }));
        
        this.isLoadingKPIs = false;
        this.isLoadingActivity = false;
      },
      error: (error) => {
        console.error('Error loading administrador dashboard data:', error);
        this.isLoadingKPIs = false;
        this.isLoadingActivity = false;
        // Keep mock data on error
      }
    });
  }

  /**
   * Format timestamp to relative time
   */
  private formatTime(timestamp: string | Date | undefined): string {
    if (!timestamp) return 'N/A';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Ahora';
      if (diffMins < 60) return `Hace ${diffMins} min`;
      if (diffHours < 24) return `Hace ${diffHours}h`;
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} días`;
      
      // Format as date
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short' 
      });
    } catch (error) {
      return 'N/A';
    }
  }

  // KPIs dinámicos según rol
  getCurrentKPIs() {
    // Return real data if available, otherwise fallback to mock
    if (this.realKPIs.length > 0) {
      return this.realKPIs;
    }
    
    // Fallback to mock data
    switch (this.currentSession.activeRole) {
      case 'Médico':
      case 'Médico Jefe':
        return [
          { label: 'Recetas hoy', value: 24, change: '+12%', trend: 'up', icon: this.fileTextIcon, route: '/prescripciones/emitidas' },
          { label: 'Pacientes atendidos', value: 18, change: '+8%', trend: 'up', icon: this.usersIcon, route: '/pacientes/lista' },
          { label: 'Borradores pendientes', value: 3, change: '0', trend: 'neutral', icon: this.clockIcon, route: '/prescripciones/borradores' },
          { label: 'Alertas clínicas', value: 2, change: '-50%', trend: 'down', icon: this.alertTriangleIcon, route: '/alertas/bandeja' }
        ];
      case 'Farmacéutico':
        return [
          { label: 'Dispensaciones hoy', value: 67, change: '+15%', trend: 'up', icon: this.packageCheckIcon, route: '/dispensacion/registrar' },
          { label: 'Recetas verificadas', value: 89, change: '+10%', trend: 'up', icon: this.fileCheckIcon, route: '/dispensacion/verificar' },
          { label: 'Stock bajo', value: 12, change: '+3', trend: 'up', icon: this.alertCircleIcon, route: '/inventario/alertas' },
          { label: 'Rechazos', value: 3, change: '-2', trend: 'down', icon: this.xCircleIcon, route: '/dispensacion/rechazos' }
        ];
      case 'Enfermera':
        return [
          { label: 'Pacientes registrados', value: 31, change: '+5%', trend: 'up', icon: this.userCheckIcon, route: '/pacientes/lista' },
          { label: 'Medicamentos administrados', value: 156, change: '+7%', trend: 'up', icon: this.pillIcon, route: '/dispensacion/registrar' },
          { label: 'Signos vitales tomados', value: 89, change: '+12%', trend: 'up', icon: this.activityIcon, route: '/pacientes/lista' },
          { label: 'Alertas pendientes', value: 4, change: '0', trend: 'neutral', icon: this.bellIcon, route: '/alertas/bandeja' }
        ];
      case 'Administrador':
        return [
          { label: 'Usuarios activos', value: 245, change: '+3%', trend: 'up', icon: this.usersIcon, route: '/seguridad/usuarios' },
          { label: 'Recetas totales (hoy)', value: 487, change: '+18%', trend: 'up', icon: this.fileTextIcon, route: '/reportes/actividad-medico' },
          { label: 'Aprobaciones pendientes', value: 7, change: '+2', trend: 'up', icon: this.clipboardListIcon, route: '/seguridad/aprobaciones' },
          { label: 'Incidencias', value: 1, change: '-3', trend: 'down', icon: this.alertTriangleIcon, route: '/auditoria/log' }
        ];
      default:
        return [];
    }
  }

  // Acciones rápidas según rol
  getCurrentQuickActions() {
    switch (this.currentSession.activeRole) {
      case 'Médico':
      case 'Médico Jefe':
        return [
          { title: 'Nueva Prescripción', description: 'Crear receta médica', icon: this.fileTextIcon, route: '/prescripciones/nueva', gradient: 'from-blue-600 to-blue-700' },
          { title: 'Buscar Paciente', description: 'Historial clínico', icon: this.usersIcon, route: '/pacientes/lista', gradient: 'from-green-600 to-green-700' },
          { title: 'Mis Borradores', description: '3 pendientes', icon: this.clockIcon, route: '/prescripciones/borradores', gradient: 'from-amber-600 to-amber-700' },
          { title: 'Ver Alertas', description: 'Interacciones detectadas', icon: this.alertTriangleIcon, route: '/alertas/bandeja', gradient: 'from-red-600 to-red-700' }
        ];
      case 'Farmacéutico':
        return [
          { title: 'Verificar Receta', description: 'Validar prescripción', icon: this.fileCheckIcon, route: '/dispensacion/verificar', gradient: 'from-blue-600 to-blue-700' },
          { title: 'Dispensar', description: 'Registrar entrega', icon: this.packageCheckIcon, route: '/dispensacion/registrar', gradient: 'from-green-600 to-green-700' },
          { title: 'Inventario', description: 'Stock de medicamentos', icon: this.pillIcon, route: '/inventario/stock', gradient: 'from-purple-600 to-purple-700' },
          { title: 'Alertas Stock', description: '12 productos bajos', icon: this.alertCircleIcon, route: '/inventario/alertas', gradient: 'from-amber-600 to-amber-700' }
        ];
      case 'Enfermera':
        return [
          { title: 'Registrar Paciente', description: 'Nuevo ingreso', icon: this.userCheckIcon, route: '/pacientes/lista', gradient: 'from-blue-600 to-blue-700' },
          { title: 'Administrar Medicamentos', description: 'Registro de dosis', icon: this.pillIcon, route: '/dispensacion/registrar', gradient: 'from-green-600 to-green-700' },
          { title: 'Ver Pacientes', description: 'Historial y signos', icon: this.usersIcon, route: '/pacientes/lista', gradient: 'from-purple-600 to-purple-700' },
          { title: 'Alertas', description: 'Notificaciones clínicas', icon: this.bellIcon, route: '/alertas/bandeja', gradient: 'from-amber-600 to-amber-700' }
        ];
      case 'Administrador':
        return [
          { title: 'Gestión Usuarios', description: 'Administrar accesos', icon: this.usersIcon, route: '/seguridad/usuarios', gradient: 'from-blue-600 to-blue-700' },
          { title: 'Aprobaciones', description: '7 pendientes', icon: this.clipboardListIcon, route: '/seguridad/aprobaciones', gradient: 'from-green-600 to-green-700' },
          { title: 'Reportes', description: 'Analytics y estadísticas', icon: this.barChart3Icon, route: '/reportes/actividad-medico', gradient: 'from-purple-600 to-purple-700' },
          { title: 'Auditoría', description: 'Log de actividades', icon: this.shieldCheckIcon, route: '/auditoria/log', gradient: 'from-amber-600 to-amber-700' }
        ];
      default:
        return [];
    }
  }

  // Actividad reciente según rol
  getCurrentRecentActivity() {
    // Return real data if available, otherwise fallback to mock
    if (this.realActivity.length > 0) {
      return this.realActivity;
    }
    
    // Fallback to mock data
    switch (this.currentSession.activeRole) {
      case 'Médico':
      case 'Médico Jefe':
        return [
          { id: 'RX-2024-0245', title: 'Receta emitida', subtitle: 'María González - Paracetamol 500mg', time: '10:32 AM', status: 'success', icon: this.fileCheckIcon, route: '/prescripciones/emitidas' },
          { id: 'DRAFT-089', title: 'Borrador guardado', subtitle: 'Carlos Ramírez - Múltiples medicamentos', time: '09:15 AM', status: 'warning', icon: this.clockIcon, route: '/prescripciones/borradores' },
          { id: 'RX-2024-0243', title: 'Receta emitida', subtitle: 'Ana Martínez - Amoxicilina 500mg', time: '08:45 AM', status: 'success', icon: this.fileCheckIcon, route: '/prescripciones/emitidas' },
          { id: 'ALERT-012', title: 'Alerta clínica', subtitle: 'Interacción: Warfarina + Aspirina', time: '08:30 AM', status: 'alert', icon: this.alertTriangleIcon, route: '/alertas/bandeja' }
        ];
      case 'Farmacéutico':
        return [
          { id: 'DISP-456', title: 'Dispensación registrada', subtitle: 'RX-2024-0245 - Paracetamol 500mg', time: '11:20 AM', status: 'success', icon: this.packageCheckIcon, route: '/dispensacion/registrar' },
          { id: 'VER-789', title: 'Receta verificada', subtitle: 'RX-2024-0244 - Omeprazol 20mg', time: '10:45 AM', status: 'success', icon: this.fileCheckIcon, route: '/dispensacion/verificar' },
          { id: 'STOCK-034', title: 'Alerta de stock bajo', subtitle: 'Ibuprofeno 400mg - 25 unidades', time: '09:30 AM', status: 'warning', icon: this.alertCircleIcon, route: '/inventario/alertas' },
          { id: 'REJ-012', title: 'Receta rechazada', subtitle: 'RX-2024-0230 - Medicamento no disponible', time: '08:15 AM', status: 'alert', icon: this.xCircleIcon, route: '/dispensacion/rechazos' }
        ];
      case 'Enfermera':
        return [
          { id: 'PAT-567', title: 'Paciente registrado', subtitle: 'José Luis Fernández - Consulta externa', time: '11:00 AM', status: 'success', icon: this.userCheckIcon, route: '/pacientes/lista' },
          { id: 'MED-890', title: 'Medicamento administrado', subtitle: 'RX-2024-0245 - Paracetamol IV', time: '10:30 AM', status: 'success', icon: this.pillIcon, route: '/dispensacion/registrar' },
          { id: 'VITAL-234', title: 'Signos vitales tomados', subtitle: 'María González - PA: 120/80 mmHg', time: '09:45 AM', status: 'info', icon: this.activityIcon, route: '/pacientes/lista' },
          { id: 'ALERT-045', title: 'Alerta de medicación', subtitle: 'Paciente requiere dosis pendiente', time: '08:50 AM', status: 'warning', icon: this.bellIcon, route: '/alertas/bandeja' }
        ];
      case 'Administrador':
        return [
          { id: 'USER-234', title: 'Usuario aprobado', subtitle: 'Dr. Luis Hernández - Cardiología', time: '10:50 AM', status: 'success', icon: this.userCheckIcon, route: '/seguridad/aprobaciones' },
          { id: 'REP-456', title: 'Reporte generado', subtitle: 'Actividad médica - Octubre 2024', time: '09:30 AM', status: 'info', icon: this.barChart3Icon, route: '/reportes/exportar' },
          { id: 'AUDIT-789', title: 'Acceso no autorizado', subtitle: 'Intento de login fallido - usuario123', time: '08:45 AM', status: 'alert', icon: this.shieldCheckIcon, route: '/auditoria/log' },
          { id: 'CONFIG-012', title: 'Configuración actualizada', subtitle: 'Políticas de recetas modificadas', time: '08:00 AM', status: 'info', icon: this.settingsIcon, route: '/config/politicas' }
        ];
      default:
        return [];
    }
  }

  // Insights clínicos
  // TODO: Implement real insights with backend logic
  // Currently using mock data - requires complex business logic and analytics
  getCurrentInsights() {
    switch (this.currentSession.activeRole) {
      case 'Médico':
      case 'Médico Jefe':
        return [
          { title: 'Patrón de prescripción', description: 'Tus recetas más comunes esta semana son analgésicos (35%) y antibióticos (28%)', type: 'info', action: 'Ver detalles', route: '/reportes/actividad-medico' },
          { title: 'Alertas de interacciones', description: '2 interacciones detectadas requieren revisión. Warfarina + Aspirina en paciente García', type: 'warning', action: 'Revisar ahora', route: '/alertas/bandeja' },
          { title: 'Eficiencia clínica', description: 'Tiempo promedio por receta: 3.2 min (12% mejor que el promedio)', type: 'success', action: 'Ver métricas', route: '/reportes/actividad-medico' }
        ];
      case 'Farmacéutico':
        return [
          { title: 'Stock crítico', description: '12 medicamentos requieren reabastecimiento urgente. Ibuprofeno y Amoxicilina prioritarios', type: 'warning', action: 'Ver inventario', route: '/inventario/alertas' },
          { title: 'Eficiencia de dispensación', description: 'Tiempo promedio de verificación: 2.1 min (15% mejor que meta)', type: 'success', action: 'Ver estadísticas', route: '/reportes/actividad-farmacia' },
          { title: 'Vencimientos próximos', description: '8 lotes vencen en los próximos 30 días. Total: $12,500', type: 'info', action: 'Ver lotes', route: '/inventario/lotes' }
        ];
      case 'Enfermera':
        return [
          { title: 'Carga de trabajo', description: '31 pacientes registrados hoy. 8% más que promedio semanal', type: 'info', action: 'Ver pacientes', route: '/pacientes/lista' },
          { title: 'Medicaciones pendientes', description: '4 pacientes tienen dosis programadas en las próximas 2 horas', type: 'warning', action: 'Ver agenda', route: '/dispensacion/registrar' },
          { title: 'Cumplimiento protocolos', description: 'Signos vitales registrados: 98% de pacientes (Excelente)', type: 'success', action: 'Ver detalles', route: '/pacientes/lista' }
        ];
      case 'Administrador':
        return [
          { title: 'Crecimiento del sistema', description: 'Incremento de 18% en recetas vs mes anterior. Considerar escalabilidad', type: 'info', action: 'Ver métricas', route: '/reportes/actividad-medico' },
          { title: 'Seguridad', description: '7 usuarios pendientes de aprobación. 1 intento de acceso no autorizado detectado', type: 'warning', action: 'Revisar seguridad', route: '/seguridad/aprobaciones' },
          { title: 'Cumplimiento normativo', description: 'Sistema 100% conforme con HL7 FHIR, FDA y OMS. Última auditoría: Aprobada', type: 'success', action: 'Ver auditoría', route: '/auditoria/log' }
        ];
      default:
        return [];
    }
  }

  // Helper methods for styling
  getKPIBorderColor(trend: string): string {
    switch (trend) {
      case 'up': return '#10b981'; // green-500
      case 'down': return '#ef4444'; // red-500
      default: return '#6b7280'; // gray-500
    }
  }

  getTrendIcon(trend: string) {
    switch (trend) {
      case 'up': return this.trendingUpIcon;
      case 'down': return this.trendingDownIcon;
      default: return this.activityIcon;
    }
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getActivityStatusBg(status: string): string {
    switch (status) {
      case 'success': return 'bg-green-100';
      case 'warning': return 'bg-amber-100';
      case 'alert': return 'bg-red-100';
      default: return 'bg-blue-100';
    }
  }

  getActivityStatusColor(status: string): string {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-amber-600';
      case 'alert': return 'text-red-600';
      default: return 'text-blue-600';
    }
  }

  getInsightBg(type: string): string {
    switch (type) {
      case 'success': return 'bg-green-50';
      case 'warning': return 'bg-amber-50';
      case 'alert': return 'bg-red-50';
      default: return 'bg-blue-50';
    }
  }

  getInsightBorderColor(type: string): string {
    switch (type) {
      case 'success': return '#10b981'; // green-500
      case 'warning': return '#f59e0b'; // amber-500
      case 'alert': return '#ef4444'; // red-500
      default: return '#3b82f6'; // blue-500
    }
  }

  getInsightIconColor(type: string): string {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-amber-600';
      case 'alert': return 'text-red-600';
      default: return 'text-blue-600';
    }
  }

  /**
   * Load system health metrics from backend
   */
  private loadSystemMetrics(): void {
    this.systemMetricsLoading = true;
    
    this.dashboardService.getSystemMetrics().subscribe({
      next: (metrics) => {
        this.systemMetrics = metrics.map(metric => ({
          ...metric,
          icon: this.getIconForMetric(metric.label)
        }));
        this.systemMetricsLoading = false;
      },
      error: (error) => {
        console.error('Error loading system metrics:', error);
        this.systemMetricsLoading = false;
        // Keep empty array or show error state
      }
    });
  }

  /**
   * Get appropriate icon for each metric
   */
  private getIconForMetric(label: string): any {
    switch (label) {
      case 'Base de datos':
        return this.databaseIcon;
      case 'API Sistema':
        return this.zapIcon;
      case 'Memoria Sistema':
        return this.shieldCheckIcon;
      case 'Tiempo de respuesta':
        return this.trendingUpIcon;
      default:
        return this.zapIcon;
    }
  }
}