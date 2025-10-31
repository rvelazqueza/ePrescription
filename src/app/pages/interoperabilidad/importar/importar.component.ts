import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Download, CheckCircle2, Network } from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';

@Component({
  selector: 'app-importar-datos',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      title="Importar Datos Externos" 
      description="Recepción e integración de recursos FHIR desde sistemas externos"
      [icon]="downloadIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-orange-600 via-amber-500 to-yellow-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

      <!-- Import Form and Validation -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Import Form -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Importación FHIR</h2>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de recurso</label>
              <select 
                [(ngModel)]="importType"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="patient">Paciente (Patient)</option>
                <option value="practitioner">Profesional (Practitioner)</option>
                <option value="medication">Medicamento (Medication)</option>
                <option value="observation">Observación (Observation)</option>
                <option value="condition">Condición (Condition)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Sistema origen</label>
              <select 
                [(ngModel)]="sourceSystem"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona el sistema origen...</option>
                <option value="his_regional">HIS Hospital Regional</option>
                <option value="laboratorio">Sistema de Laboratorio</option>
                <option value="radiologia">Sistema de Radiología</option>
                <option value="otro_hospital">Otro Hospital</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contenido FHIR (JSON)</label>
              <textarea
                placeholder="Pega aquí el JSON FHIR..."
                [(ngModel)]="fileContent"
                rows="12"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <button 
              (click)="handleImport()"
              class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
              Importar recurso
            </button>
          </div>
        </div>

        <!-- Validation and Mapping -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Validación y Mapeo</h2>
          </div>
          <div class="p-6 space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 class="font-medium text-blue-900 mb-2">Validaciones automáticas</h4>
              <ul class="space-y-2 text-sm text-blue-700">
                <li class="flex items-center gap-2">
                  <lucide-icon [img]="checkIcon" class="w-4 h-4"></lucide-icon>
                  <span>Validación de esquema FHIR R4</span>
                </li>
                <li class="flex items-center gap-2">
                  <lucide-icon [img]="checkIcon" class="w-4 h-4"></lucide-icon>
                  <span>Verificación de integridad referencial</span>
                </li>
                <li class="flex items-center gap-2">
                  <lucide-icon [img]="checkIcon" class="w-4 h-4"></lucide-icon>
                  <span>Detección de duplicados</span>
                </li>
                <li class="flex items-center gap-2">
                  <lucide-icon [img]="checkIcon" class="w-4 h-4"></lucide-icon>
                  <span>Mapeo automático de campos</span>
                </li>
              </ul>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Campos detectados</label>
              <div class="space-y-2 border rounded-lg p-3 max-h-64 overflow-auto">
                <div *ngFor="let field of detectedFields" class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm font-mono">{{ field.name }}</span>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                    ✓ Válido
                  </span>
                </div>
              </div>
            </div>

            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-start gap-2">
                <lucide-icon [img]="checkIcon" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"></lucide-icon>
                <div class="text-sm">
                  <p class="font-medium text-green-900 mb-1">Listo para importar</p>
                  <p class="text-green-700">El recurso pasó todas las validaciones</p>
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
export class ImportarDatosComponent {
  downloadIcon = Download;
  checkIcon = CheckCircle2;
  networkIcon = Network;

  importType = 'patient';
  sourceSystem = '';
  fileContent = '';

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Interoperabilidad', route: '/interop' },
    { label: 'Importar Datos Externos' }
  ];

  detectedFields = [
    { name: 'resourceType' },
    { name: 'id' },
    { name: 'meta.lastUpdated' },
    { name: 'identifier' }
  ];

  handleImport() {
    if (!this.sourceSystem || !this.fileContent) {
      // En una implementación real, mostrarías un toast de error
      console.log('Campos incompletos');
      return;
    }

    // En una implementación real, aquí procesarías la importación
    console.log('Importación iniciada');
  }
}