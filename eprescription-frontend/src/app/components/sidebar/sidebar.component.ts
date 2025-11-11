import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Home, FileText, Users, UserCheck, Building2, Package, BarChart3, Settings, Stethoscope, Activity, ChevronDown, ChevronRight, Pill, Shield, Calendar, Bell, HelpCircle, Receipt, AlertTriangle, ShieldCheck, Network, FileCheck, BookOpen, LayoutDashboard, Menu, X, UserCog } from 'lucide-angular';

interface MenuItem {
  title: string;
  icon: any;
  route?: string;
  children?: MenuItem[];
  badge?: string;
  isExpanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div [class]="'flex h-full flex-col bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-xl transition-all duration-300 ' + (isCollapsed ? 'w-16' : 'w-64')">
      <!-- Header -->
      <div class="flex items-center gap-3 px-4 py-5 border-b border-white/20">
        <!-- Hamburger Button -->
        <button 
          (click)="toggleSidebar()"
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          <lucide-icon [img]="isCollapsed ? menuIcon : xIcon" class="h-5 w-5 text-white"></lucide-icon>
        </button>
        
        <!-- Logo and Title (hidden when collapsed) -->
        <div *ngIf="!isCollapsed" class="flex items-center gap-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <lucide-icon [img]="stethoscopeIcon" class="h-5 w-5 text-white"></lucide-icon>
          </div>
          <div>
            <h1 class="font-bold text-sm">ePrescription</h1>
            <p class="text-xs text-white/80">Sistema Médico</p>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        <div *ngFor="let item of menuItems" class="space-y-1">
          <!-- Menu Item with Children (Accordion) -->
          <div *ngIf="item.children && item.children.length > 0">
            <button
              (click)="toggleExpanded(item)"
              [class]="'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 group text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md ' + (isCollapsed ? 'justify-center' : '')"
              [title]="isCollapsed ? item.title : ''"
            >
              <lucide-icon [img]="item.icon" class="h-5 w-5 transition-transform group-hover:scale-110 flex-shrink-0"></lucide-icon>
              <span *ngIf="!isCollapsed" class="font-medium flex-1 text-left">{{ item.title }}</span>
              <span *ngIf="item.badge && !isCollapsed" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{{ item.badge }}</span>
              <span *ngIf="item.badge && isCollapsed" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{{ item.badge }}</span>
              <lucide-icon 
                *ngIf="!isCollapsed"
                [img]="item.isExpanded ? chevronDownIcon : chevronRightIcon" 
                class="h-4 w-4 transition-transform duration-200">
              </lucide-icon>
            </button>
            
            <!-- Submenu (only show when not collapsed and expanded) -->
            <div 
              *ngIf="item.isExpanded && !isCollapsed" 
              class="ml-4 mt-1 space-y-1 border-l border-white/20 pl-4"
            >
              <a
                *ngFor="let child of item.children"
                [routerLink]="child.route"
                routerLinkActive="bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30"
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 group text-white/70 hover:bg-white/10 hover:text-white"
              >
                <lucide-icon [img]="child.icon" class="h-4 w-4 transition-transform group-hover:scale-110"></lucide-icon>
                <span class="font-medium">{{ child.title }}</span>
                <span *ngIf="child.badge" class="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">{{ child.badge }}</span>
              </a>
            </div>
          </div>

          <!-- Simple Menu Item -->
          <a
            *ngIf="!item.children || item.children.length === 0"
            [routerLink]="item.route"
            routerLinkActive="bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30"
            [class]="'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 group text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md relative ' + (isCollapsed ? 'justify-center' : '')"
            [title]="isCollapsed ? item.title : ''"
          >
            <lucide-icon [img]="item.icon" class="h-5 w-5 transition-transform group-hover:scale-110 flex-shrink-0"></lucide-icon>
            <span *ngIf="!isCollapsed" class="font-medium">{{ item.title }}</span>
            <span *ngIf="item.badge && !isCollapsed" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-auto">{{ item.badge }}</span>
            <span *ngIf="item.badge && isCollapsed" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{{ item.badge }}</span>
          </a>
        </div>
      </nav>
      
      <!-- Footer -->
      <div class="px-4 py-4 border-t border-white/20">
        <div *ngIf="!isCollapsed" class="text-xs text-white/60 text-center">
          <p>Cumplimiento normativo:</p>
          <div class="flex justify-center gap-2 mt-1">
            <span class="bg-white/20 px-2 py-1 rounded text-xs">HL7</span>
            <span class="bg-white/20 px-2 py-1 rounded text-xs">FDA</span>
            <span class="bg-white/20 px-2 py-1 rounded text-xs">OMS</span>
          </div>
        </div>
        <div *ngIf="isCollapsed" class="flex justify-center">
          <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <lucide-icon [img]="shieldCheckIcon" class="h-4 w-4 text-white/60"></lucide-icon>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SidebarComponent {
  // Sidebar state
  isCollapsed = false;

  // Icons
  homeIcon = Home;
  layoutDashboardIcon = LayoutDashboard;
  fileTextIcon = FileText;
  usersIcon = Users;
  userCheckIcon = UserCheck;
  building2Icon = Building2;
  packageIcon = Package;
  barChart3Icon = BarChart3;
  settingsIcon = Settings;
  stethoscopeIcon = Stethoscope;
  activityIcon = Activity;
  chevronDownIcon = ChevronDown;
  chevronRightIcon = ChevronRight;
  pillIcon = Pill;
  shieldIcon = Shield;
  calendarIcon = Calendar;
  bellIcon = Bell;
  helpCircleIcon = HelpCircle;
  receiptIcon = Receipt;
  alertTriangleIcon = AlertTriangle;
  shieldCheckIcon = ShieldCheck;
  networkIcon = Network;
  fileCheckIcon = FileCheck;
  bookOpenIcon = BookOpen;
  menuIcon = Menu;
  xIcon = X;
  userCogIcon = UserCog;

  menuItems: MenuItem[] = [
    {
      title: 'Inicio',
      icon: this.layoutDashboardIcon,
      route: '/dashboard'
    },
    {
      title: 'Prescripciones',
      icon: this.fileTextIcon,
      isExpanded: false,
      children: [
        { title: 'Nueva receta', icon: this.fileTextIcon, route: '/prescripciones/nueva' },
        { title: 'Mis borradores', icon: this.fileTextIcon, route: '/prescripciones/borradores' },
        { title: 'Recetas emitidas', icon: this.fileTextIcon, route: '/prescripciones/emitidas' },
        { title: 'Buscar receta', icon: this.fileTextIcon, route: '/prescripciones/buscar' },
        { title: 'Duplicar receta', icon: this.fileTextIcon, route: '/prescripciones/duplicar' },
        { title: 'Centros médicos', icon: this.building2Icon, route: '/prescripciones/centros' }
      ]
    },
    {
      title: 'Dispensación',
      icon: this.pillIcon,
      isExpanded: false,
      children: [
        { title: 'Verificar receta (QR/Token)', icon: this.shieldCheckIcon, route: '/dispensacion/verificar' },
        { title: 'Registrar dispensación', icon: this.pillIcon, route: '/dispensacion/registrar' },
        { title: 'Rechazos y motivos', icon: this.alertTriangleIcon, route: '/dispensacion/rechazos' }
      ]
    },
    {
      title: 'Pacientes',
      icon: this.usersIcon,
      isExpanded: false,
      children: [
        { title: 'Listado de pacientes', icon: this.usersIcon, route: '/pacientes/lista' },
        { title: 'Perfil del paciente', icon: this.userCheckIcon, route: '/pacientes/perfil' },
        { title: 'Recetas del paciente', icon: this.fileTextIcon, route: '/pacientes/recetas' }
      ]
    },
    {
      title: 'Médicos',
      icon: this.stethoscopeIcon,
      isExpanded: false,
      children: [
        { title: 'Listado de médicos', icon: this.stethoscopeIcon, route: '/medicos/lista' },
        { title: 'Alta/Edición de médico', icon: this.userCheckIcon, route: '/medicos/editar' }
      ]
    },
    {
      title: 'Farmacia e Inventario',
      icon: this.packageIcon,
      isExpanded: false,
      children: [
        { title: 'Stock de medicamentos', icon: this.packageIcon, route: '/inventario/stock' },
        { title: 'Farmacias registradas', icon: this.building2Icon, route: '/inventario/farmacias' },
        { title: 'Consulta de inventario', icon: this.packageIcon, route: '/inventario/consulta' },
        { title: 'Alertas de stock bajo', icon: this.alertTriangleIcon, route: '/inventario/alertas', badge: '3' },
        { title: 'Ajustes de stock', icon: this.settingsIcon, route: '/inventario/ajustes' },
        { title: 'Lotes y vencimientos', icon: this.calendarIcon, route: '/inventario/lotes' }
      ]
    },
    {
      title: 'Talonarios',
      icon: this.receiptIcon,
      isExpanded: false,
      children: [
        { title: 'Comprar talonarios', icon: this.receiptIcon, route: '/talonarios/comprar' },
        { title: 'Mis talonarios', icon: this.receiptIcon, route: '/talonarios/listado' }
      ]
    },
    {
      title: 'Alertas clínicas (CDS)',
      icon: this.alertTriangleIcon,
      isExpanded: false,
      children: [
        { title: 'Bandeja de alertas', icon: this.bellIcon, route: '/alertas/bandeja' },
        { title: 'Reglas e interacciones', icon: this.settingsIcon, route: '/alertas/reglas' },
        { title: 'Tipos de alertas', icon: this.alertTriangleIcon, route: '/alertas/configuracion' }
      ]
    },
    {
      title: 'Firma y verificación',
      icon: this.shieldCheckIcon,
      isExpanded: false,
      children: [
        { title: 'Firmar receta', icon: this.shieldCheckIcon, route: '/firma/firmar-receta' },
        { title: 'Generar/Ver QR', icon: this.shieldCheckIcon, route: '/firma/generar-qr' },
        { title: 'Verificación de QR/Token', icon: this.shieldCheckIcon, route: '/firma/verificar-qr' },
        { title: 'Trazabilidad de firmas', icon: this.fileCheckIcon, route: '/firma/trazabilidad' }
      ]
    },
    {
      title: 'Reportes y analítica',
      icon: this.barChart3Icon,
      isExpanded: false,
      children: [
        { title: 'Actividad por médico', icon: this.stethoscopeIcon, route: '/reportes/actividad-medico' },
        { title: 'Actividad de farmacia', icon: this.building2Icon, route: '/reportes/actividad-farmacia' },
        { title: 'Exportaciones (CSV/Excel)', icon: this.fileCheckIcon, route: '/reportes/exportar' }
      ]
    },
    {
      title: 'Interoperabilidad',
      icon: this.networkIcon,
      isExpanded: false,
      children: [
        { title: 'IDs FHIR', icon: this.networkIcon, route: '/interop/fhir-ids' },
        { title: 'Exportar receta (FHIR)', icon: this.fileCheckIcon, route: '/interop/exportar' },
        { title: 'Importar datos externos', icon: this.networkIcon, route: '/interop/importar' },
        { title: 'Registro HL7 eventos', icon: this.fileCheckIcon, route: '/interop/eventos' }
      ]
    },
    {
      title: 'Seguridad y usuarios',
      icon: this.shieldIcon,
      isExpanded: false,
      children: [
        { title: 'Usuarios', icon: this.usersIcon, route: '/seguridad/usuarios' },
        { title: 'Registro de usuarios', icon: this.userCheckIcon, route: '/seguridad/usuarios/registro' },
        { title: 'Aprobación de usuarios', icon: this.shieldCheckIcon, route: '/seguridad/aprobaciones' },
        { title: 'Roles y permisos', icon: this.shieldIcon, route: '/seguridad/roles' },
        { title: 'Parámetros de seguridad', icon: this.settingsIcon, route: '/seguridad/parametros' },
        { title: 'Bloqueos/Desbloqueos', icon: this.alertTriangleIcon, route: '/seguridad/bloqueos' },
        { title: 'Sesiones de usuario', icon: this.activityIcon, route: '/seguridad/sesiones' },
        { title: 'Mis sesiones activas', icon: this.activityIcon, route: '/seguridad/mis-sesiones' }
      ]
    },
    {
      title: 'Auditoría y cumplimiento',
      icon: this.fileCheckIcon,
      isExpanded: false,
      children: [
        { title: 'Log auditoría', icon: this.fileCheckIcon, route: '/auditoria/log-auditoria' }
      ]
    },
    {
      title: 'Catálogos clínicos',
      icon: this.bookOpenIcon,
      isExpanded: false,
      children: [
        { title: 'Medicamentos', icon: this.pillIcon, route: '/catalogos/medicamentos' },
        { title: 'Vías de administración', icon: this.settingsIcon, route: '/catalogos/vias' },
        { title: 'Especialidades', icon: this.stethoscopeIcon, route: '/catalogos/especialidades' },
        { title: 'Unidades médicas', icon: this.building2Icon, route: '/catalogos/unidades' },
        { title: 'Interacciones', icon: this.alertTriangleIcon, route: '/catalogos/interacciones' },
        { title: 'Tipos de alertas', icon: this.bellIcon, route: '/catalogos/tipos-alertas' },
        { title: 'Países', icon: this.homeIcon, route: '/catalogos/paises' }
      ]
    },
    {
      title: 'Notificaciones',
      icon: this.bellIcon,
      isExpanded: false,
      children: [
        { title: 'Listado de notificaciones', icon: this.bellIcon, route: '/notificaciones/lista' },
        { title: 'Nueva notificación', icon: this.bellIcon, route: '/notificaciones/nueva' }
      ]
    },
    {
      title: 'Configuración',
      icon: this.settingsIcon,
      isExpanded: false,
      children: [
        { title: 'Políticas de recetas', icon: this.fileTextIcon, route: '/config/politicas' },
        { title: 'Catálogos auxiliares', icon: this.bookOpenIcon, route: '/config/auxiliares' },
        { title: 'Numeración de recetas', icon: this.settingsIcon, route: '/config/numeracion' }
      ]
    },
    {
      title: 'Ayuda',
      icon: this.helpCircleIcon,
      route: '/ayuda'
    },
    {
      title: 'Autoservicio',
      icon: this.userCogIcon,
      route: '/autoservicio'
    },
    {
      title: 'Documentación',
      icon: this.bookOpenIcon,
      route: '/documentacion'
    }

  ];

  toggleExpanded(item: MenuItem) {
    // Si está colapsado, no permitir expandir submenús
    if (this.isCollapsed) {
      return;
    }

    item.isExpanded = !item.isExpanded;

    // Opcional: cerrar otros acordeones cuando se abre uno
    // this.menuItems.forEach(menuItem => {
    //   if (menuItem !== item && menuItem.children) {
    //     menuItem.isExpanded = false;
    //   }
    // });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;

    // Cerrar todos los submenús cuando se colapsa
    if (this.isCollapsed) {
      this.menuItems.forEach(item => {
        if (item.children) {
          item.isExpanded = false;
        }
      });
    }
  }
}