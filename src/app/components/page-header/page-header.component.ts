import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Stethoscope, ShieldCheck, Building2 } from 'lucide-angular';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div [class]="'bg-gradient-to-r text-white rounded-lg p-6 ' + (gradient || 'from-blue-600 to-purple-700')">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <lucide-icon [img]="icon" class="w-8 h-8 text-white"></lucide-icon>
          </div>
          <div>
            <h1 class="text-2xl font-bold">{{ title }}</h1>
            <p class="text-blue-100">{{ description }}</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <ng-content select="[slot=action]"></ng-content>
          
          <!-- Botón Crear Usuario específico -->
          <button *ngIf="showCreateUserButton" (click)="onCreateUserClick()" class="inline-flex items-center px-4 py-2 bg-white/10 text-white border border-white/30 rounded-lg hover:bg-white/20 transition-colors text-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            ¿Crear usuario?
          </button>
          
          <!-- Badge Sistema profesional de seguridad -->
          <span *ngIf="showSecurityBadge" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
            Sistema profesional de seguridad
          </span>
          
          <!-- Iconos médicos para páginas de seguridad y usuarios (SIN autoservicio) - EXCLUIR "Gestión de Usuarios" y "Parámetros de Seguridad" -->
          <div *ngIf="(showMedicalIcons || title.includes('Registro de usuarios') || (title.includes('Usuarios') && !title.includes('Gestión de Usuarios')) || (title.includes('Seguridad') && !title.includes('Parámetros de Seguridad'))) && !title.includes('Autoservicio')" class="flex items-center gap-4">
            <!-- Estetoscopio - Servicios Médicos (mismo del sidebar) -->
            <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200 cursor-pointer group" title="Servicios Médicos">
              <lucide-icon [img]="stethoscopeIcon" class="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-200"></lucide-icon>
            </div>
            
            <!-- Escudo de Seguridad (mismo del sidebar) -->
            <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200 cursor-pointer group" title="Seguridad y Protección">
              <lucide-icon [img]="shieldCheckIcon" class="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-200"></lucide-icon>
            </div>
            
            <!-- Edificio Médico (mismo del sidebar) -->
            <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200 cursor-pointer group" title="Centros Médicos">
              <lucide-icon [img]="building2Icon" class="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-200"></lucide-icon>
            </div>
          </div>
          
          <!-- Badges para Dashboard - Solo si no hay contenido proyectado -->
          <div *ngIf="title.includes('Dashboard') || description.includes('Prescripción Electrónica')" class="flex gap-2">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-colors">
              <lucide-icon [img]="shieldCheckIcon" class="w-3 h-3 mr-1"></lucide-icon>
              HL7 FHIR
            </span>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-colors">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              FDA Compliant
            </span>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-colors">
              <lucide-icon [img]="stethoscopeIcon" class="w-3 h-3 mr-1"></lucide-icon>
              OMS Standards
            </span>
            <span 
              (click)="navigateToNotifications()"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white border border-red-400 cursor-pointer hover:bg-red-600 transition-colors shadow-lg"
              title="Ver notificaciones pendientes">
              <svg class="w-3 h-3 mr-1 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              3 notificaciones
            </span>
          </div>
        </div>
      </div>

      <!-- Badges para Autoservicio - debajo del contenido principal -->
      <div *ngIf="title.includes('Autoservicio')" class="mt-4 flex flex-wrap gap-2">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
          Cifrado E2E
        </span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
          HIPAA Compliant
        </span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
          FDA 21 CFR Part 11
        </span>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
          NIST 800-63B
        </span>
      </div>
      
      <!-- Badges para Registro de usuarios - debajo del contenido principal -->
      <div *ngIf="title.includes('Registro de usuarios')" class="mt-6 flex flex-wrap gap-4">
        <div class="flex items-center gap-2 text-white/90">
          <div class="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span class="text-sm font-medium">Validación automática con colegios profesionales</span>
        </div>
        <div class="flex items-center gap-2 text-white/90">
          <div class="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.5-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <span class="text-sm font-medium">Cumplimiento normativo HL7, FDA y OMS</span>
        </div>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() icon: any;
  @Input() actionButton: boolean = false;
  @Input() gradient: string = '';
  @Input() showMedicalIcons: boolean = false;
  @Input() showCreateUserButton: boolean = false;
  @Input() createUserButtonClick: (() => void) | null = null;
  @Input() showSecurityBadge: boolean = false;

  // Iconos médicos (mismos del sidebar)
  stethoscopeIcon = Stethoscope;
  shieldCheckIcon = ShieldCheck;
  building2Icon = Building2;

  constructor(private router: Router) {}

  onCreateUserClick() {
    if (this.createUserButtonClick) {
      this.createUserButtonClick();
    }
  }

  navigateToNotifications() {
    this.router.navigate(['/notificaciones/lista']);
  }
}