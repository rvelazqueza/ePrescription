import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule, FileText, User, Stethoscope, Pill, Shield, Printer, Download } from 'lucide-angular';

interface RecetaImpresion {
  id: string;
  paciente: {
    nombre: string;
    cedula: string;
    edad: number;
    genero: 'M' | 'F';
    tipoSangre: string;
    diagnostico: string;
    alertas?: string[];
  };
  medicamentos: {
    nombre: string;
    presentacion: string;
    dosis: string;
    frecuencia: string;
    via: string;
    duracion: string;
    cantidad: number;
  }[];
  medico: {
    nombre: string;
    especialidad: string;
    licencia: string;
    centroMedico: string;
  };
  firmaDigital: {
    codigo: string;
    token: string;
    fechaEmision: string;
    horaEmision: string;
  };
  notasClinicas?: string;
  fechaGeneracion: string;
}

@Component({
  selector: 'app-imprimir',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-white" *ngIf="receta">
      <!-- Header con botón de imprimir -->
      <div class="no-print bg-blue-600 text-white p-4 flex justify-between items-center">
        <div>
          <h1 class="text-xl font-bold">{{ receta.id }}</h1>
          <p class="text-blue-100">Vista de impresión</p>
        </div>
        <div class="flex gap-2">
          <button 
            (click)="imprimir()"
            class="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 flex items-center gap-2"
          >
            <lucide-icon [img]="printerIcon" class="w-4 h-4"></lucide-icon>
            Imprimir / Guardar PDF
          </button>
          <button 
            (click)="cerrar()"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-400"
          >
            Cerrar
          </button>
        </div>
      </div>

      <!-- Contenido de la receta -->
      <div class="max-w-4xl mx-auto p-8 print:p-0">
        
        <!-- Header del hospital -->
        <div class="text-center mb-6 border-b-2 border-blue-600 pb-4">
          <h1 class="text-2xl font-bold text-blue-800">{{ receta.medico.centroMedico }}</h1>
          <p class="text-sm text-gray-600">Sistema ePrescription v2.0</p>
          <p class="text-sm text-gray-600">Prescripción Electrónica Verificada</p>
          <div class="flex justify-between items-center mt-2">
            <span class="text-sm font-medium">N° {{ receta.id }}</span>
            <span class="text-sm text-gray-600">{{ receta.firmaDigital.fechaEmision }} {{ receta.firmaDigital.horaEmision }}</span>
          </div>
        </div>

        <!-- Información del paciente -->
        <div class="mb-6">
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <div class="flex items-center gap-2 mb-2">
              <lucide-icon [img]="userIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
              <h2 class="text-lg font-semibold text-blue-800">INFORMACIÓN DEL PACIENTE</h2>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-600">Nombre completo:</p>
              <p class="font-semibold">{{ receta.paciente.nombre }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Identificación:</p>
              <p class="font-semibold">{{ receta.paciente.cedula }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Edad:</p>
              <p class="font-semibold">{{ receta.paciente.edad }} años</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Sexo:</p>
              <p class="font-semibold">{{ receta.paciente.genero === 'M' ? 'Masculino' : 'Femenino' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Tipo de sangre:</p>
              <p class="font-semibold">{{ receta.paciente.tipoSangre }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Diagnóstico:</p>
              <p class="font-semibold">{{ receta.paciente.diagnostico }}</p>
            </div>
          </div>

          <!-- Alertas clínicas -->
          <div *ngIf="receta.paciente.alertas && receta.paciente.alertas.length > 0" class="mt-4">
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 class="text-sm font-semibold text-red-800 mb-2">⚠️ ALERTAS CLÍNICAS IMPORTANTES</h3>
              <div class="space-y-1">
                <p *ngFor="let alerta of receta.paciente.alertas" class="text-sm text-red-700">
                  <strong>{{ alerta.split(':')[0] }}:</strong> {{ alerta.split(':')[1] }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Medicamentos prescritos -->
        <div class="mb-6">
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <div class="flex items-center gap-2">
              <lucide-icon [img]="pillIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
              <h2 class="text-lg font-semibold text-blue-800">MEDICAMENTOS PRESCRITOS ({{ receta.medicamentos.length }})</h2>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300">
              <thead class="bg-blue-600 text-white">
                <tr>
                  <th class="border border-gray-300 px-3 py-2 text-left">#</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Medicamento</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Presentación</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Dosis</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Frecuencia</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Vía</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Duración</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let medicamento of receta.medicamentos; let i = index" class="hover:bg-gray-50">
                  <td class="border border-gray-300 px-3 py-2 font-medium">{{ i + 1 }}</td>
                  <td class="border border-gray-300 px-3 py-2 font-semibold">{{ medicamento.nombre }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ medicamento.presentacion }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ medicamento.dosis }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ medicamento.frecuencia }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ medicamento.via }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ medicamento.duracion }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-center">{{ medicamento.cantidad }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Indicaciones -->
          <div class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p class="text-sm text-yellow-800">
              <strong>Indicaciones:</strong> Tomar el ayunas con abundante agua • Suspender por genérico
            </p>
          </div>
        </div>

        <!-- Notas clínicas -->
        <div *ngIf="receta.notasClinicas" class="mb-6">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 class="text-sm font-semibold text-blue-800 mb-2">📋 Notas Clínicas:</h3>
            <p class="text-sm text-blue-700">{{ receta.notasClinicas }}</p>
          </div>
        </div>

        <!-- Información del médico prescriptor -->
        <div class="mb-6">
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <div class="flex items-center gap-2">
              <lucide-icon [img]="stethoscopeIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
              <h2 class="text-lg font-semibold text-blue-800">INFORMACIÓN DEL MÉDICO PRESCRIPTOR</h2>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-600">Nombre:</p>
              <p class="font-semibold">{{ receta.medico.nombre }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Licencia médica:</p>
              <p class="font-semibold">{{ receta.medico.licencia }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Especialidad:</p>
              <p class="font-semibold">{{ receta.medico.especialidad }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Centro médico:</p>
              <p class="font-semibold">{{ receta.medico.centroMedico }}</p>
            </div>
          </div>
        </div>

        <!-- Firma digital y seguridad -->
        <div class="mb-6">
          <div class="border-2 border-dashed border-gray-400 p-6 text-center">
            <div class="flex items-center justify-center gap-2 mb-4">
              <lucide-icon [img]="shieldIcon" class="w-6 h-6 text-blue-600"></lucide-icon>
              <h2 class="text-lg font-semibold text-blue-800">FIRMA DIGITAL Y SEGURIDAD</h2>
            </div>

            <div class="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 mb-4 inline-block">
              <div class="text-sm text-gray-600">[Código QR]</div>
              <div class="font-mono text-xs">{{ receta.firmaDigital.codigo }}</div>
            </div>

            <div class="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p class="text-gray-600">Token de firma:</p>
                <p class="font-mono">{{ receta.firmaDigital.token }}</p>
              </div>
              <div>
                <p class="text-gray-600">Fecha emisión:</p>
                <p class="font-semibold">{{ receta.firmaDigital.fechaEmision }} {{ receta.firmaDigital.horaEmision }}</p>
              </div>
            </div>

            <p class="text-xs text-gray-500 mt-4">
              Esta receta está protegida con firma digital y puede ser verificada en línea usando el código QR o el token de firma
            </p>
          </div>
        </div>

        <!-- Firmas -->
        <div class="grid grid-cols-2 gap-8 mb-6">
          <div class="text-center">
            <div class="border-t-2 border-gray-400 pt-2">
              <p class="font-semibold">{{ receta.medico.nombre }}</p>
              <p class="text-sm text-gray-600">Licencia: {{ receta.medico.licencia }}</p>
              <p class="text-sm text-gray-600">{{ receta.medico.especialidad }}</p>
            </div>
          </div>
          <div class="text-center">
            <div class="border-t-2 border-gray-400 pt-2">
              <p class="font-semibold">Sello del Centro Médico</p>
              <p class="text-sm text-gray-600">{{ receta.medico.centroMedico }}</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-xs text-gray-500 border-t pt-4">
          <p>Este documento es una prescripción médica electrónica generada por el sistema ePrescription v2.0</p>
          <p>Cumple con normativas FDA, OMS, HL7 FHIR y regulaciones internacionales de prescripción electrónica</p>
          <p>Documento generado el {{ receta.fechaGeneracion }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @media print {
      .no-print {
        display: none !important;
      }
      
      body {
        margin: 0;
        padding: 0;
      }
      
      .print\\:p-0 {
        padding: 0 !important;
      }
    }
  `]
})
export class ImprimirComponent implements OnInit {
  fileTextIcon = FileText;
  userIcon = User;
  stethoscopeIcon = Stethoscope;
  pillIcon = Pill;
  shieldIcon = Shield;
  printerIcon = Printer;
  downloadIcon = Download;

  receta: RecetaImpresion | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Obtener el ID de la receta de los parámetros de la URL
    const recetaId = this.route.snapshot.paramMap.get('id');
    if (recetaId) {
      this.cargarReceta(recetaId);
    }

    // Verificar si debe auto-imprimir
    const autoprint = this.route.snapshot.queryParamMap.get('autoprint');
    if (autoprint === 'true') {
      // Esperar un momento para que la página cargue completamente
      setTimeout(() => {
        this.imprimir();
      }, 1500);
    }
  }

  cargarReceta(id: string) {
    // Aquí normalmente harías una llamada al servicio para obtener los datos
    // Por ahora, usamos datos de muestra
    this.receta = {
      id: id,
      paciente: {
        nombre: 'Carlos Rodríguez Sánchez',
        cedula: 'Cédula Nacional: 1-0856-0432',
        edad: 45,
        genero: 'M',
        tipoSangre: 'O+',
        diagnostico: 'Hipertensión arterial leve',
        alertas: [
          'Alergia: Penicilina',
          'Condiciones crónicas: Hipertensión'
        ]
      },
      medicamentos: [
        {
          nombre: 'Losartán',
          presentacion: 'Tabletas 50 mg',
          dosis: '50 mg',
          frecuencia: 'Cada 24 horas',
          via: 'Oral',
          duracion: '30 días',
          cantidad: 30
        }
      ],
      medico: {
        nombre: 'Dra. María Fernández López',
        especialidad: 'Medicina Interna',
        licencia: 'MED-8542',
        centroMedico: 'Hospital San Juan de Dios'
      },
      firmaDigital: {
        codigo: 'QR-RX-2025-001234',
        token: 'SIG-2025-8432947',
        fechaEmision: '05/10/2025',
        horaEmision: '09:30'
      },
      notasClinicas: 'Control mensual de presión arterial',
      fechaGeneracion: new Date().toLocaleString()
    };
  }

  imprimir() {
    window.print();
  }

  cerrar() {
    window.close();
  }
}