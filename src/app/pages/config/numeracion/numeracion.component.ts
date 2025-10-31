import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Hash, Settings, Plus, Edit, Trash2, RefreshCw, CheckCircle2, XCircle, AlertTriangle, Save, Info } from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../../components/ui/card/card.component';
import { NotificationService } from '../../../services/notification.service';

interface ConfiguracionNumeracion {
  type: string;
  name: string;
  prefix: string;
  year: string;
  sequence: number;
  format: string;
  example: string;
  resetAnnually: boolean;
  paddingZeros: number;
  description: string;
}

@Component({
  selector: 'app-numeracion',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule, PageLayoutComponent, CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent],
  template: `
    <app-page-layout 
      title="Numeración de Recetas" 
      description="Configuración de secuencias y formatos de numeración"
      [icon]="hashIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-purple-600 via-pink-500 to-red-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6">
        <!-- Estadísticas con diseño estándar -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div *ngFor="let config of configuraciones" 
               class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-purple-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600 capitalize">{{ config.name }}</p>
                  <p class="text-3xl font-bold text-gray-900">{{ config.example }}</p>
                  <div class="flex items-center gap-1 text-xs">
                    <span class="text-gray-500">Siguiente: {{ config.sequence + 1 }}</span>
                  </div>
                </div>
                <div class="p-3 bg-purple-100 rounded-xl">
                  <lucide-icon [img]="hashIcon" class="w-8 h-8 text-purple-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Configuraciones detalladas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <app-card *ngFor="let config of configuraciones">
          <app-card-header>
            <app-card-title class="capitalize">{{ config.name }}</app-card-title>
          </app-card-header>
          <app-card-content class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Prefijo</label>
                <input 
                  type="text" 
                  [value]="config.prefix" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  (input)="updateConfig(config.type, 'prefix', $event)"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Secuencia actual</label>
                <input 
                  type="number" 
                  [value]="config.sequence" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  (input)="updateConfig(config.type, 'sequence', $event)"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Formato</label>
              <input 
                type="text" 
                [value]="config.format" 
                disabled 
                class="w-full px-3 py-2 border border-gray-300 rounded-md font-mono bg-gray-50"
              />
              <p class="text-xs text-gray-600 mt-1">
                YYYY = Año, NNNN = Secuencia con {{ config.paddingZeros }} dígitos
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ejemplo de numeración</label>
              <div class="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p class="font-mono font-semibold text-purple-900">{{ config.example }}</p>
              </div>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <label class="text-sm font-medium text-gray-700">Reiniciar anualmente</label>
                <p class="text-xs text-gray-600">El 1 de enero se resetea a 1</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  [checked]="config.resetAnnually" 
                  class="sr-only peer"
                  (change)="updateConfig(config.type, 'resetAnnually', $event)"
                />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div class="flex gap-2">
              <button 
                class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                (click)="resetSequence(config.type)"
              >
                <lucide-icon [img]="refreshCwIcon" class="w-4 h-4"></lucide-icon>
                Reiniciar secuencia
              </button>
              <button 
                class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
                (click)="saveConfig(config.type)"
              >
                <lucide-icon [img]="saveIcon" class="w-4 h-4"></lucide-icon>
                Guardar
              </button>
            </div>
          </app-card-content>
        </app-card>
      </div>

      <!-- Información adicional -->
      <app-card class="border-purple-200 bg-purple-50">
        <app-card-content class="p-4">
          <div class="flex items-start gap-3">
            <lucide-icon [img]="infoIcon" class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"></lucide-icon>
            <div>
              <h4 class="font-medium text-purple-900 mb-1">Configuración de Numeración</h4>
              <ul class="space-y-1 text-sm text-purple-700">
                <li class="flex items-start gap-2">
                  <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                  <span>La numeración es secuencial y no permite duplicados</span>
                </li>
                <li class="flex items-start gap-2">
                  <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                  <span>Reiniciar la secuencia afectará la numeración de nuevos registros</span>
                </li>
                <li class="flex items-start gap-2">
                  <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                  <span>Los registros existentes conservan su numeración original</span>
                </li>
              </ul>
            </div>
          </div>
        </app-card-content>
      </app-card>
      
      </div>
    </app-page-layout>
  `
})
export class NumeracionComponent implements OnInit {
  // Iconos
  hashIcon = Hash;
  settingsIcon = Settings;
  plusIcon = Plus;
  editIcon = Edit;
  trash2Icon = Trash2;
  refreshCwIcon = RefreshCw;
  checkCircle2Icon = CheckCircle2;
  xCircleIcon = XCircle;
  alertTriangleIcon = AlertTriangle;
  saveIcon = Save;
  infoIcon = Info;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Configuración', route: '/config' },
    { label: 'Numeración de recetas', route: '/config/numeracion' }
  ];

  // Datos mock basados en el archivo de React
  configuraciones: ConfiguracionNumeracion[] = [
    {
      type: "prescriptions",
      name: "Prescriptions",
      prefix: "RX",
      year: "2024",
      sequence: 201,
      format: "RX-YYYY-NNNN",
      example: "RX-2024-0201",
      resetAnnually: true,
      paddingZeros: 4,
      description: "Numeración para prescripciones médicas"
    },
    {
      type: "patients",
      name: "Patients",
      prefix: "PAT",
      year: "",
      sequence: 125,
      format: "PAT-NNNN",
      example: "PAT-0125",
      resetAnnually: false,
      paddingZeros: 4,
      description: "Numeración para pacientes"
    },
    {
      type: "doctors",
      name: "Doctors",
      prefix: "DOC",
      year: "",
      sequence: 46,
      format: "DOC-NNN",
      example: "DOC-046",
      resetAnnually: false,
      paddingZeros: 3,
      description: "Numeración para doctores"
    },
    {
      type: "inventory",
      name: "Inventory",
      prefix: "INV",
      year: "",
      sequence: 9,
      format: "INV-NNN",
      example: "INV-009",
      resetAnnually: false,
      paddingZeros: 3,
      description: "Numeración para inventario"
    }
  ];

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {}

  updateConfig(type: string, field: string, event: any) {
    const config = this.configuraciones.find(c => c.type === type);
    if (config) {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      (config as any)[field] = field === 'sequence' ? parseInt(value) || 0 : value;
      
      // Actualizar el ejemplo cuando cambie el prefijo o secuencia
      if (field === 'prefix' || field === 'sequence') {
        this.updateExample(config);
      }
    }
  }

  updateExample(config: ConfiguracionNumeracion) {
    const paddedSequence = config.sequence.toString().padStart(config.paddingZeros, '0');
    if (config.year) {
      config.example = `${config.prefix}-${config.year}-${paddedSequence}`;
    } else {
      config.example = `${config.prefix}-${paddedSequence}`;
    }
  }

  resetSequence(type: string) {
    const config = this.configuraciones.find(c => c.type === type);
    if (config) {
      config.sequence = 1;
      this.updateExample(config);
      this.notificationService.showSuccess(
        'Secuencia reiniciada',
        `El contador de ${config.name} ha sido reiniciado a 1`
      );
    }
  }

  saveConfig(type: string) {
    const config = this.configuraciones.find(c => c.type === type);
    if (config) {
      this.notificationService.showSuccess(
        'Configuración guardada',
        'La numeración ha sido actualizada correctamente'
      );
    }
  }
}