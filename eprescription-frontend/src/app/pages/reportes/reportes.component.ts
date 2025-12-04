import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, BarChart3, Download, Calendar, TrendingUp, FileText, Users, Activity, FileSpreadsheet } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, BreadcrumbsComponent],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumbs -->
      <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>
      
      <!-- Header con gradiente mejorado -->
      <div class="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-lg shadow-lg">
        <div class="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div class="relative p-8">
          <div class="flex items-center space-x-3">
            <div class="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <lucide-icon [img]="barChart3Icon" class="w-8 h-8 text-white"></lucide-icon>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">Reportes y Analítica</h1>
              <p class="text-blue-100 text-sm">Análisis y estadísticas del sistema de prescripciones</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas principales -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow border-l-4 border-l-purple-500">
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Reportes disponibles</p>
                <p class="text-2xl font-semibold">8</p>
              </div>
              <lucide-icon [img]="fileTextIcon" class="w-8 h-8 text-purple-500"></lucide-icon>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow border-l-4 border-l-blue-500">
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Generados hoy</p>
                <p class="text-2xl font-semibold">12</p>
              </div>
              <lucide-icon [img]="trendingUpIcon" class="w-8 h-8 text-blue-500"></lucide-icon>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow border-l-4 border-l-green-500">
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Formatos</p>
                <p class="text-2xl font-semibold">3</p>
              </div>
              <lucide-icon [img]="fileSpreadsheetIcon" class="w-8 h-8 text-green-500"></lucide-icon>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow border-l-4 border-l-orange-500">
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Programados</p>
                <p class="text-2xl font-semibold">5</p>
              </div>
              <lucide-icon [img]="calendarIcon" class="w-8 h-8 text-orange-500"></lucide-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Opciones de reportes principales -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a 
          routerLink="/reportes/actividad-medico"
          class="group bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300 overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <lucide-icon [img]="usersIcon" class="w-6 h-6 text-blue-600"></lucide-icon>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Actividad por Médico</h3>
                <p class="text-sm text-gray-500">Análisis estadístico de prescripciones por profesional</p>
              </div>
            </div>
            <div class="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full inline-block">
              Requiere rol: Médico Jefe
            </div>
          </div>
        </a>

        <a 
          routerLink="/reportes/actividad-farmacia"
          class="group bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-green-300 overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <lucide-icon [img]="activityIcon" class="w-6 h-6 text-green-600"></lucide-icon>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Actividad de Farmacia</h3>
                <p class="text-sm text-gray-500">Monitoreo de dispensaciones y operaciones farmacéuticas</p>
              </div>
            </div>
            <div class="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full inline-block">
              Requiere rol: Farmacéutico
            </div>
          </div>
        </a>

        <a 
          routerLink="/reportes/exportar"
          class="group bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-purple-300 overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <lucide-icon [img]="fileSpreadsheetIcon" class="w-6 h-6 text-purple-600"></lucide-icon>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Exportaciones</h3>
                <p class="text-sm text-gray-500">Generación y descarga de reportes en múltiples formatos</p>
              </div>
            </div>
            <div class="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full inline-block">
              Requiere rol: Administrador
            </div>
          </div>
        </a>
      </div>

      <!-- Reportes rápidos -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Reportes Rápidos</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let reporte of reportesRapidos" 
                 class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-gray-900">{{ reporte.titulo }}</h3>
                  <p class="text-sm text-gray-500">{{ reporte.descripcion }}</p>
                </div>
                <button class="bg-blue-50 text-blue-700 px-3 py-2 rounded-md text-sm hover:bg-blue-100 transition-colors flex items-center gap-1">
                  <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
                  <span class="hidden sm:inline">Generar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReportesComponent {
  barChart3Icon = BarChart3;
  downloadIcon = Download;
  calendarIcon = Calendar;
  trendingUpIcon = TrendingUp;
  fileTextIcon = FileText;
  fileSpreadsheetIcon = FileSpreadsheet;
  usersIcon = Users;
  activityIcon = Activity;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Reportes y Analítica' }
  ];

  reportesRapidos = [
    { titulo: 'Prescripciones Hoy', descripcion: 'Resumen del día actual' },
    { titulo: 'Medicamentos Populares', descripcion: 'Top 10 esta semana' },
    { titulo: 'Alertas Activas', descripcion: 'Interacciones detectadas' },
    { titulo: 'Pacientes Atendidos', descripcion: 'Estadísticas mensuales' },
    { titulo: 'Stock Bajo', descripcion: 'Medicamentos por agotar' },
    { titulo: 'Cumplimiento HL7', descripcion: 'Estado de integración' }
  ];
}