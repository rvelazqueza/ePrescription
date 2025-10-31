import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Network, FileText, Upload, Download, Activity } from 'lucide-angular';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-interoperabilidad',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, BreadcrumbsComponent],
  template: `
    <div class="space-y-6">
      <!-- Breadcrumbs -->
      <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>
      
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg p-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <lucide-icon [img]="networkIcon" class="w-8 h-8 text-white"></lucide-icon>
          </div>
          <div>
            <h1 class="text-2xl font-bold">Interoperabilidad</h1>
            <p class="text-blue-100">Integración con sistemas externos y estándares HL7 FHIR</p>
          </div>
        </div>
      </div>

      <!-- Opciones de interoperabilidad -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a 
          routerLink="/interop/fhir-ids"
          class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-blue-300"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <lucide-icon [img]="networkIcon" class="w-6 h-6 text-blue-600"></lucide-icon>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900">IDs FHIR</h3>
              <p class="text-sm text-gray-500">Gestión de identificadores FHIR</p>
            </div>
          </div>
        </a>

        <a 
          routerLink="/interop/exportar"
          class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-green-300"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <lucide-icon [img]="downloadIcon" class="w-6 h-6 text-green-600"></lucide-icon>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900">Exportar Receta (FHIR)</h3>
              <p class="text-sm text-gray-500">Exportar prescripciones en formato FHIR</p>
            </div>
          </div>
        </a>

        <a 
          routerLink="/interop/importar"
          class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-purple-300"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <lucide-icon [img]="uploadIcon" class="w-6 h-6 text-purple-600"></lucide-icon>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900">Importar Datos Externos</h3>
              <p class="text-sm text-gray-500">Importar datos desde sistemas externos</p>
            </div>
          </div>
        </a>

        <a 
          routerLink="/interop/eventos"
          class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-orange-300"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <lucide-icon [img]="activityIcon" class="w-6 h-6 text-orange-600"></lucide-icon>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900">Registro HL7 Eventos</h3>
              <p class="text-sm text-gray-500">Log de eventos y transacciones HL7</p>
            </div>
          </div>
        </a>

        <a 
          routerLink="/interop/configuracion"
          class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-indigo-300"
        >
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <lucide-icon [img]="fileTextIcon" class="w-6 h-6 text-indigo-600"></lucide-icon>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900">Configuración</h3>
              <p class="text-sm text-gray-500">Configurar endpoints y conexiones</p>
            </div>
          </div>
        </a>
      </div>

      <!-- Estado de conexiones -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Estado de Conexiones</h2>
        <div class="space-y-3">
          <div *ngFor="let conexion of estadoConexiones" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <div [class]="'w-3 h-3 rounded-full ' + (conexion.activa ? 'bg-green-500' : 'bg-red-500')"></div>
              <div>
                <h3 class="font-medium text-gray-900">{{ conexion.nombre }}</h3>
                <p class="text-sm text-gray-500">{{ conexion.descripcion }}</p>
              </div>
            </div>
            <div class="text-right">
              <span [class]="'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ' + 
                (conexion.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')">
                {{ conexion.estado }}
              </span>
              <p class="text-xs text-gray-500 mt-1">{{ conexion.ultimaConexion }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class InteroperabilidadComponent {
  networkIcon = Network;
  fileTextIcon = FileText;
  uploadIcon = Upload;
  downloadIcon = Download;
  activityIcon = Activity;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Interoperabilidad' }
  ];

  estadoConexiones = [
    {
      nombre: 'Servidor FHIR Nacional',
      descripcion: 'Conexión con el servidor FHIR del MINSA',
      activa: true,
      estado: 'Conectado',
      ultimaConexion: 'Hace 2 min'
    },
    {
      nombre: 'Sistema de Farmacias',
      descripcion: 'Integración con red de farmacias',
      activa: true,
      estado: 'Conectado',
      ultimaConexion: 'Hace 5 min'
    },
    {
      nombre: 'Base de Datos de Medicamentos',
      descripcion: 'Catálogo nacional de medicamentos',
      activa: false,
      estado: 'Desconectado',
      ultimaConexion: 'Hace 2 horas'
    },
    {
      nombre: 'Sistema de Auditoría',
      descripcion: 'Logs centralizados de auditoría',
      activa: true,
      estado: 'Conectado',
      ultimaConexion: 'Hace 1 min'
    }
  ];
}