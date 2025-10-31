import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LucideAngularModule, FileText, Plus, User, Search, Calendar, Pill, Save, Send, AlertTriangle, CheckCircle, X, ArrowLeft } from 'lucide-angular';
import { AddMedicineDialogComponent, Medicine } from '../../../components/add-medicine-dialog/add-medicine-dialog.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PatientSelectionSectionComponent } from '../../../components/patient-selection/patient-selection-section.component';
import { PatientSelectionModalComponent } from '../../../components/patient-selection/patient-selection-modal.component';
import { NotificationContainerComponent } from '../../../components/ui/notification-container/notification-container.component';
import { RoleSuggestionModalComponent } from '../../../components/role-suggestion-modal/role-suggestion-modal.component';
import { PatientData } from '../../../interfaces/patient.interface';
import { PatientData as NewPatientDialogPatientData } from '../../../interfaces/patient.interface';
import { NotificationService } from '../../../services/notification.service';
import { RoleDemoService } from '../../../services/role-demo.service';
import { RoleSuggestionService } from '../../../services/role-suggestion.service';

interface Medicamento {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  administration: string;
  quantity: string;
  observations?: string;
}

interface Paciente {
  id: string;
  nombre: string;
  cedula: string;
  edad: number;
  alergias: string[];
}

@Component({
  selector: 'app-nueva-prescripcion',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, AddMedicineDialogComponent, PageLayoutComponent, PatientSelectionSectionComponent, PatientSelectionModalComponent, NotificationContainerComponent, RoleSuggestionModalComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Notification Container -->
      <app-notification-container></app-notification-container>

      <div class="space-y-6">
        <!-- Page Layout with Header -->
        <app-page-layout 
          [title]="pageTitle"
          [description]="pageDescription"
          [icon]="fileTextIcon"
          [breadcrumbItems]="breadcrumbItems"
          [hasActionButton]="esModoEdicionBorrador">
          
          <!-- Botón Volver a Borradores (solo en modo edición) -->
          <div *ngIf="esModoEdicionBorrador" slot="action" class="flex items-center gap-2">
            <button 
              (click)="volverABorradores()"
              class="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30 hover:bg-white/30 transition-colors flex items-center gap-2"
            >
              <lucide-icon [img]="arrowLeftIcon" class="w-4 h-4"></lucide-icon>
              Volver a Borradores
            </button>
          </div>
        </app-page-layout>

        <!-- Patient Selection Section -->
        <app-patient-selection-section
          [selectedPatient]="selectedPatient"
          (selectPatient)="openPatientSelectionModal()"
          (changePatient)="openPatientSelectionModal()"
        ></app-patient-selection-section>

        <!-- Tarjeta de Prescripción Médica Electrónica como en React -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <lucide-icon [img]="fileTextIcon" class="w-6 h-6 text-blue-600"></lucide-icon>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Prescripción Médica Electrónica</h2>
              <div class="flex items-center gap-4 text-sm text-gray-600">
                <span *ngIf="!esModoEdicionBorrador">#RX-2025-009847</span>
                <span *ngIf="esModoEdicionBorrador" class="flex items-center gap-2">
                  #{{ borradorId }}
                  <span class="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium border border-orange-200">
                    Borrador
                  </span>
                </span>
                <span class="flex items-center gap-1" *ngIf="!esModoEdicionBorrador">
                  <lucide-icon [img]="checkCircleIcon" class="w-4 h-4 text-green-600"></lucide-icon>
                  Certificada Digitalmente
                </span>
                <span class="flex items-center gap-1 text-orange-600" *ngIf="esModoEdicionBorrador">
                  <lucide-icon [img]="alertTriangleIcon" class="w-4 h-4"></lucide-icon>
                  Pendiente de finalizar
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Borrador</span>
            <span class="text-sm text-gray-500">10/10/2025 10:54 a.m.</span>
          </div>
        </div>

        <!-- Información del Paciente como en React -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-blue-600 font-semibold text-lg">{{ pacienteSeleccionado ? getInitials(pacienteSeleccionado.nombre) : 'MG' }}</span>
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-900">{{ pacienteSeleccionado?.nombre || 'María Elena González Rodríguez' }}</h3>
              <div class="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span class="flex items-center gap-1">
                  <lucide-icon [img]="userIcon" class="w-4 h-4"></lucide-icon>
                  Femenino
                </span>
                <span class="flex items-center gap-1">
                  <lucide-icon [img]="calendarIcon" class="w-4 h-4"></lucide-icon>
                  {{ pacienteSeleccionado?.edad || 45 }} años
                </span>
                <span class="flex items-center gap-1">
                  <lucide-icon [img]="userIcon" class="w-4 h-4"></lucide-icon>
                  ID: {{ pacienteSeleccionado?.cedula || 'CC-52.841.963' }}
                </span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6 mt-4">
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">Información del Médico</h4>
              <div class="space-y-1 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="userIcon" class="w-4 h-4"></lucide-icon>
                  <span>Dr. Carlos Alberto Mendoza Herrera</span>
                </div>
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="userIcon" class="w-4 h-4"></lucide-icon>
                  <span>Código RM-12345-COL</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-700 mb-2">Información de Contacto</h4>
              <div class="space-y-1 text-sm text-gray-600">
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="userIcon" class="w-4 h-4"></lucide-icon>
                  <span>+57 (1) 234-5678</span>
                </div>
                <div class="flex items-center gap-2">
                  <lucide-icon [img]="userIcon" class="w-4 h-4"></lucide-icon>
                  <span>contacto&#64;hospital.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de Medicamentos Prescritos como en React -->
        <div class="border-t border-gray-200 pt-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <lucide-icon [img]="pillIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
              <h3 class="text-lg font-semibold text-gray-900">Medicamentos Prescritos</h3>
              <span class="text-sm text-gray-500">Doble clic en cualquier fila para ver detalles y editar • {{ medicamentosMock.length }} medicamentos</span>
            </div>
            <div class="flex gap-2">
              <button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm">
                <lucide-icon [img]="fileTextIcon" class="w-4 h-4"></lucide-icon>
                Borrador
              </button>
              <button 
                (click)="agregarMedicamento()"
                [disabled]="!selectedPatient"
                [title]="!selectedPatient ? 'Debe seleccionar un paciente antes de agregar medicamentos' : ''"
                [class]="'px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ' + 
                        (selectedPatient ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed')"
              >
                <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
                Agregar Medicamento
              </button>
            </div>
          </div>

          <!-- Tabla de medicamentos como en React -->
          <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamento</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosis</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frecuencia</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vía de Administración</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let medicamento of medicamentosMock" class="hover:bg-gray-50 cursor-pointer" (dblclick)="editarMedicamento(medicamento)">
                  <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ medicamento.nombre }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ medicamento.cantidad }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ medicamento.dosis }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ medicamento.frecuencia }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ medicamento.via }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ medicamento.duracion }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Resumen de Medicamentos como en React -->
        <div class="mt-6 bg-green-50 rounded-lg p-4">
          <div class="flex items-center gap-2 mb-3">
            <lucide-icon [img]="checkCircleIcon" class="w-5 h-5 text-green-600"></lucide-icon>
            <h4 class="font-semibold text-green-900">Resumen de Medicamentos</h4>
            <span class="text-sm text-green-700">Vista rápida de los medicamentos prescritos</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div *ngFor="let medicamento of medicamentosMock" class="bg-white rounded-lg p-4 border border-green-200">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <lucide-icon [img]="pillIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                </div>
                <div>
                  <h5 class="font-semibold text-gray-900">{{ medicamento.nombre }}</h5>
                  <p class="text-sm text-gray-600">{{ medicamento.dosis }} • {{ medicamento.frecuencia }}</p>
                </div>
              </div>
              <div class="text-sm text-gray-600">
                <p>Duración: {{ medicamento.duracion }}</p>
              </div>
              <div class="mt-2">
                <span class="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">{{ medicamento.via }}</span>
              </div>
            </div>
          </div>
        </div>
        </div>

        <!-- Botones de acción como en React -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-orange-600">
            <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5"></lucide-icon>
            <span class="text-sm font-medium">Revise todos los medicamentos antes de finalizar</span>
          </div>
          <div class="flex gap-3">
            <button 
              (click)="esModoEdicionBorrador ? volverABorradores() : cancelar()"
              class="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
              {{ esModoEdicionBorrador ? 'Cancelar' : 'Cancelar' }}
            </button>
            <button 
              (click)="guardarCambios()"
              class="bg-blue-100 text-blue-700 px-6 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
            >
              <lucide-icon [img]="saveIcon" class="w-4 h-4"></lucide-icon>
              {{ esModoEdicionBorrador ? 'Guardar Cambios' : 'Guardar Cambios' }}
            </button>
            <button 
              (click)="verificarConDrugBank()"
              class="bg-blue-100 text-blue-700 px-6 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
            >
              <lucide-icon [img]="searchIcon" class="w-4 h-4"></lucide-icon>
              Verificar con DrugBank
            </button>
            <button 
              (click)="abrirModalFinalizar()"
              class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
            >
              <lucide-icon [img]="checkCircleIcon" class="w-4 h-4"></lucide-icon>
              Finalizar Prescripción
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>

    <!-- Modal Lateral Derecho para Agregar Medicamento -->
    <div *ngIf="showAddMedicineModal" class="fixed inset-0 z-50 overflow-hidden">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50" (click)="closeAddMedicineModal()"></div>
      
      <!-- Panel lateral derecho -->
      <div class="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div class="flex flex-col h-full">
          <!-- Header del modal -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Agregar Medicamento</h3>
            <button 
              (click)="closeAddMedicineModal()"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <lucide-icon [img]="xIcon" class="w-5 h-5 text-gray-500"></lucide-icon>
            </button>
          </div>
          
          <!-- Contenido del modal -->
          <div class="flex-1 overflow-y-auto p-6">
            <form class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Medicamento *</label>
                <select 
                  [(ngModel)]="nuevoMedicamento.nombre"
                  name="medicamento"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccione un medicamento</option>
                  <option value="Ibuprofeno">Ibuprofeno</option>
                  <option value="Amoxicilina">Amoxicilina</option>
                  <option value="Omeprazol">Omeprazol</option>
                  <option value="Paracetamol">Paracetamol</option>
                  <option value="Diclofenaco">Diclofenaco</option>
                  <option value="Enalapril">Enalapril</option>
                  <option value="Metformina">Metformina</option>
                  <option value="Losartán">Losartán</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Cantidad *</label>
                <input 
                  type="text" 
                  [(ngModel)]="nuevoMedicamento.cantidad"
                  name="cantidad"
                  placeholder="ej. 15 tabletas"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Dosis *</label>
                <input 
                  type="text" 
                  [(ngModel)]="nuevoMedicamento.dosis"
                  name="dosis"
                  placeholder="ej. 400 mg"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Frecuencia *</label>
                <select 
                  [(ngModel)]="nuevoMedicamento.frecuencia"
                  name="frecuencia"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccione la frecuencia</option>
                  <option value="1 vez al día">1 vez al día</option>
                  <option value="2 veces al día">2 veces al día</option>
                  <option value="3 veces al día">3 veces al día</option>
                  <option value="Cada 8 horas">Cada 8 horas</option>
                  <option value="Cada 12 horas">Cada 12 horas</option>
                  <option value="Según necesidad">Según necesidad</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Vía de Administración *</label>
                <select 
                  [(ngModel)]="nuevoMedicamento.via"
                  name="via"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccione la vía</option>
                  <option value="Oral">Oral</option>
                  <option value="Intramuscular">Intramuscular</option>
                  <option value="Intravenosa">Intravenosa</option>
                  <option value="Tópica">Tópica</option>
                  <option value="Sublingual">Sublingual</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Duración *</label>
                <input 
                  type="text" 
                  [(ngModel)]="nuevoMedicamento.duracion"
                  name="duracion"
                  placeholder="ej. 5 días"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
                <textarea 
                  [(ngModel)]="nuevoMedicamento.observaciones"
                  name="observaciones"
                  rows="3"
                  placeholder="Observaciones adicionales..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
            </form>
          </div>
          
          <!-- Footer del modal -->
          <div class="flex gap-3 p-6 border-t border-gray-200">
            <button 
              (click)="closeAddMedicineModal()"
              class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              (click)="agregarMedicamentoALista()"
              class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agregar Medicamento
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación Centrado para Finalizar -->
    <div *ngIf="showFinalizarModal" class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50" (click)="cerrarModalFinalizar()"></div>
      
      <!-- Modal centrado -->
      <div class="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-300 ease-in-out">
        <!-- Header del modal -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <lucide-icon [img]="checkCircleIcon" class="w-5 h-5 text-green-600"></lucide-icon>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Finalizar Prescripción</h3>
          </div>
          <button 
            (click)="cerrarModalFinalizar()"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <lucide-icon [img]="xIcon" class="w-5 h-5 text-gray-500"></lucide-icon>
          </button>
        </div>
        
        <!-- Contenido del modal -->
        <div class="p-6">
          <!-- Título y descripción -->
          <div class="text-center mb-6">
            <div class="flex items-center justify-center gap-2 mb-3">
              <lucide-icon [img]="checkCircleIcon" class="w-6 h-6 text-green-600"></lucide-icon>
              <h4 class="text-xl font-semibold text-green-600">Prescripción Finalizada y Firmada</h4>
            </div>
            <p class="text-gray-600">La receta ha sido emitida exitosamente y está lista para ser dispensada.</p>
          </div>

          <!-- Información de la receta -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div class="flex items-center justify-between mb-4">
              <span class="text-gray-700 font-medium">Número de Receta:</span>
              <span class="bg-green-600 text-white px-3 py-1 rounded-lg font-semibold">RX-2025-009844</span>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Paciente:</span>
                <p class="font-medium text-gray-900">María Elena González</p>
              </div>
              <div>
                <span class="text-gray-600">ID Paciente:</span>
                <p class="font-medium text-gray-900">CC-52.841.963</p>
              </div>
              <div>
                <span class="text-gray-600">Médico:</span>
                <p class="font-medium text-gray-900">Dr. Carlos Alberto Mendoza Herrera</p>
              </div>
              <div>
                <span class="text-gray-600">Medicamentos:</span>
                <p class="font-medium text-gray-900">3</p>
              </div>
              <div class="col-span-2">
                <span class="text-gray-600">Fecha y Hora:</span>
                <p class="font-medium text-gray-900">10/10/2025 - 11:48</p>
              </div>
            </div>
          </div>

          <!-- Firma Digital -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div class="flex items-center gap-2 mb-3">
              <lucide-icon [img]="checkCircleIcon" class="w-5 h-5 text-blue-600"></lucide-icon>
              <h5 class="font-medium text-blue-600">Firma Digital Aplicada</h5>
            </div>
            
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Token de firma:</span>
                <span class="font-medium text-gray-900">SIG-2025-XXXXXX</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Código QR:</span>
                <span class="font-medium text-gray-900">QR-RX-2025-009844</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Estado:</span>
                <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Emitida</span>
              </div>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="space-y-3 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <lucide-icon [img]="checkCircleIcon" class="w-4 h-4 text-green-600"></lucide-icon>
              <span>La receta ha sido registrada en el sistema de recetas emitidas</span>
            </div>
            <div class="flex items-center gap-2">
              <lucide-icon [img]="fileTextIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
              <span>Puede imprimir o enviar la receta al paciente</span>
            </div>
            <div class="flex items-center gap-2">
              <lucide-icon [img]="checkCircleIcon" class="w-4 h-4 text-purple-600"></lucide-icon>
              <span>La firma digital garantiza la autenticidad de la prescripción</span>
            </div>
          </div>
        </div>
        
        <!-- Footer del modal -->
        <div class="flex gap-3 p-6 border-t border-gray-200">
          <button 
            (click)="verRecetasEmitidas()"
            class="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <lucide-icon [img]="fileTextIcon" class="w-4 h-4"></lucide-icon>
            Ver Recetas Emitidas
          </button>
          <button 
            (click)="imprimirReceta()"
            class="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <lucide-icon [img]="fileTextIcon" class="w-4 h-4"></lucide-icon>
            Imprimir Receta
          </button>
          <button 
            (click)="nuevaPrescripcion()"
            class="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <lucide-icon [img]="plusIcon" class="w-4 h-4"></lucide-icon>
            Nueva Prescripción
          </button>
        </div>
      </div>
    </div>

    <!-- Patient Selection Modal -->
    <app-patient-selection-modal
      [isOpen]="showPatientSelectionModal"
      (closeModal)="closePatientSelectionModal()"
      (patientSelected)="onPatientSelected($event)"
    ></app-patient-selection-modal>

    <!-- Modal de Guardar Cambios -->
    <div *ngIf="showGuardarCambiosModal" class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 bg-black bg-opacity-50" (click)="cerrarModalGuardarCambios()"></div>
      <div class="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <lucide-icon [img]="checkCircleIcon" class="w-5 h-5 text-green-600"></lucide-icon>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Borrador Guardado Exitosamente</h3>
          </div>
          <button (click)="cerrarModalGuardarCambios()" class="p-2 hover:bg-gray-100 rounded-lg">
            <lucide-icon [img]="xIcon" class="w-5 h-5 text-gray-500"></lucide-icon>
          </button>
        </div>
        <div class="p-6 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <lucide-icon [img]="checkCircleIcon" class="w-8 h-8 text-green-600"></lucide-icon>
          </div>
          <h4 class="text-xl font-semibold text-gray-900 mb-2">Su receta ha sido guardada como borrador y puede continuarla más tarde.</h4>
          <div class="bg-green-50 rounded-lg p-4 text-left mt-4">
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">ID del Borrador:</span>
                <span class="font-medium text-green-800">draft-176011670135-17dii8vlo</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Paciente:</span>
                <span class="font-medium text-green-800">María Elena González</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Medicamentos:</span>
                <span class="font-medium text-green-800">{{ medicamentosMock.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Última actualización:</span>
                <span class="font-medium text-green-800">10/10/2025 11:18</span>
              </div>
            </div>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 text-left">
            <div class="flex items-start gap-2">
              <lucide-icon [img]="alertTriangleIcon" class="w-4 h-4 text-blue-600 mt-0.5"></lucide-icon>
              <div class="text-sm text-blue-800">
                <p class="font-medium">El borrador estará disponible en "Mis Borradores"</p>
                <p>Puede editar o finalizar el borrador en cualquier momento</p>
              </div>
            </div>
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 flex gap-3">
          <button (click)="irAMisBorradores()" class="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium">
            Ir a Mis Borradores
          </button>
          <button (click)="continuarEditando()" class="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-medium">
            Continuar Editando
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de sugerencia de rol -->
    <app-role-suggestion-modal
      [isOpen]="showRoleSuggestionModal()"
      [suggestedRole]="'Médico'"
      (dismiss)="onRoleSuggestionDismiss()"
      (roleChanged)="onRoleChanged()"
    ></app-role-suggestion-modal>
  `
})
export class NuevaPrescripcionComponent implements OnInit, OnDestroy {
  fileTextIcon = FileText;
  plusIcon = Plus;
  arrowLeftIcon = ArrowLeft;
  userIcon = User;
  searchIcon = Search;
  calendarIcon = Calendar;
  pillIcon = Pill;
  saveIcon = Save;
  sendIcon = Send;
  alertTriangleIcon = AlertTriangle;
  checkCircleIcon = CheckCircle;
  xIcon = X;

  busquedaPaciente = '';
  pacienteSeleccionado: Paciente | null = null;
  pacientesFiltrados: Paciente[] = [];
  alertas: string[] = [];
  showAddMedicineModal = false;
  showFinalizarModal = false;
  showBorradorModal = false;
  showDrugBankModal = false;
  showGuardarCambiosModal = false;
  drugBankResultados: string[] = [];

  // Patient selection properties
  selectedPatient: PatientData | null = null;
  showPatientSelectionModal = false;

  // Role suggestion modal state
  showRoleSuggestionModal = signal(false);
  private subscriptions = new Subscription();

  // Page configuration
  pageTitle = 'Nueva Receta Médica';
  pageDescription = 'Sistema de prescripción electrónica con alertas clínicas en tiempo real';
  
  // Modo borrador
  esModoEdicionBorrador = false;
  borradorId: string | null = null;
  
  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Prescripciones', route: '/prescripciones'},
    { label: 'Nueva receta' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private roleDemoService: RoleDemoService,
    private roleSuggestionService: RoleSuggestionService
  ) {}

  ngOnInit() {
    // Verificar si se debe mostrar el modal de sugerencia de rol
    this.checkRoleSuggestion();
    
    // Suscribirse a cambios de rol
    const roleSubscription = this.roleDemoService.currentSession$.subscribe(session => {
      if (session.activeRole === 'Médico') {
        this.showRoleSuggestionModal.set(false);
        this.roleSuggestionService.clearDismissedPages();
      }
    });
    
    this.subscriptions.add(roleSubscription);

    // Handle patient preselection from route parameters
    this.handlePatientPreselection();

    // Verificar inmediatamente si venimos de editar un borrador
    const borradorParam = this.route.snapshot.queryParamMap.get('borrador');
    console.log('Parámetro borrador detectado:', borradorParam);
    
    if (borradorParam) {
      console.log('Activando modo edición borrador para:', borradorParam);
      this.esModoEdicionBorrador = true;
      this.borradorId = borradorParam;
      this.configurarModoEdicionBorrador();
      this.cargarDatosBorrador(borradorParam);
    } else {
      console.log('Modo nueva receta normal');
    }

    // También suscribirse a cambios futuros
    const queryParamsSubscription = this.route.queryParams.subscribe(params => {
      console.log('Query params cambiaron:', params);
      if (params['borrador'] && !this.esModoEdicionBorrador) {
        this.esModoEdicionBorrador = true;
        this.borradorId = params['borrador'];
        this.configurarModoEdicionBorrador();
        this.cargarDatosBorrador(params['borrador']);
      }
    });
    
    this.subscriptions.add(queryParamsSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private checkRoleSuggestion() {
    const currentSession = this.roleDemoService.getCurrentSession();
    
    if (currentSession.activeRole !== 'Médico' && 
        currentSession.activeRole !== 'Administrador') {
      this.showRoleSuggestionModal.set(true);
    } else {
      this.showRoleSuggestionModal.set(false);
    }
  }

  onRoleSuggestionDismiss() {
    this.showRoleSuggestionModal.set(false);
  }

  onRoleChanged() {
    this.showRoleSuggestionModal.set(false);
    // El modal se cerrará automáticamente cuando cambie el rol
  }

  /**
   * Handle patient preselection from route parameters
   * Requirements: 3.1, 5.2
   */
  private handlePatientPreselection(): void {
    // Check for patient ID in route parameters
    const patientId = this.route.snapshot.params['patientId'];
    
    if (patientId) {
      console.log('Patient ID from route:', patientId);
      this.preselectPatientById(patientId);
    }
  }

  /**
   * Preselect patient by ID from route parameter
   * Requirements: 3.1, 5.2
   */
  private preselectPatientById(patientId: string): void {
    console.log('Preselecting patient with ID:', patientId);
    
    // Mock data for patient preselection - in production this would come from PatientService
    const mockPatients: { [key: string]: any } = {
      'PAT-001': {
        // Data for selectedPatient (modern interface)
        selectedPatient: {
          id: 'PAT-001',
          fullName: 'María Elena González Rodríguez',
          firstName: 'María Elena',
          firstLastName: 'González',
          secondLastName: 'Rodríguez',
          idType: 'CC',
          idNumber: '52.841.963',
          birthDate: '1978-03-15',
          age: 45,
          gender: 'F' as const,
          bloodType: 'O+',
          phone: '+57 310 456-7890',
          email: 'maria.gonzalez@email.com',
          address: 'Calle 123 #45-67',
          city: 'Bogotá',
          country: 'Colombia',
          status: 'active' as const,
          allergies: ['Penicilina', 'Sulfas', 'Mariscos'],
          chronicConditions: ['Hipertensión arterial', 'Diabetes tipo 2', 'Hipotiroidismo'],
          currentMedications: ['Losartán 50mg - 1 vez al día', 'Metformina 850mg - 2 veces al día', 'Levotiroxina 75mcg - 1 vez al día'],
          registrationDate: '2023-01-15'
        },
        // Data for pacienteSeleccionado (legacy interface)
        pacienteSeleccionado: {
          id: 'PAT-001',
          nombre: 'María Elena González Rodríguez',
          cedula: '52.841.963',
          edad: 45,
          alergias: ['Penicilina', 'Sulfas', 'Mariscos']
        }
      }
    };

    const patientData = mockPatients[patientId];
    if (patientData) {
      // Set both patient properties for compatibility
      this.selectedPatient = patientData.selectedPatient;
      this.pacienteSeleccionado = patientData.pacienteSeleccionado;
      
      // Update search field for legacy compatibility
      this.busquedaPaciente = patientData.pacienteSeleccionado.nombre;
      
      console.log('Patient preselected successfully:', this.selectedPatient);
      
      // Show success notification
      this.notificationService.showSuccess(
        'Paciente preseleccionado',
        `${patientData.selectedPatient.fullName} ha sido seleccionado automáticamente`
      );
    } else {
      console.warn('Patient not found with ID:', patientId);
      this.notificationService.showWarning(
        'Paciente no encontrado',
        'No se pudo preseleccionar el paciente. Por favor seleccione uno manualmente.'
      );
    }
  }

  configurarModoEdicionBorrador() {
    console.log('Configurando modo edición borrador...');
    this.pageTitle = 'Editar Borrador de Receta';
    this.pageDescription = 'Continúa editando tu prescripción guardada como borrador';
    this.breadcrumbItems = [
      { label: 'Prescripciones', route: '/prescripciones' },
      { label: 'Borradores', route: '/prescripciones/borradores' },
      { label: 'Editar borrador' }
    ];
    console.log('Título actualizado a:', this.pageTitle);
    console.log('esModoEdicionBorrador:', this.esModoEdicionBorrador);
  }

  cargarDatosBorrador(borradorId: string) {
    console.log('=== INICIANDO CARGA DE BORRADOR ===');
    console.log('ID del borrador:', borradorId);
    
    // Simular búsqueda del borrador específico por ID
    // En una aplicación real, esto sería una llamada al servicio
    const borradorEncontrado = this.buscarBorradorPorId(borradorId);
    
    if (borradorEncontrado) {
      // Cargar datos del paciente del borrador específico
      this.pacienteSeleccionado = {
        id: borradorEncontrado.paciente.cedula,
        nombre: borradorEncontrado.paciente.nombre,
        cedula: borradorEncontrado.paciente.cedula,
        edad: borradorEncontrado.paciente.edad,
        alergias: ['Penicilina'] // Esto vendría del borrador también
      };
      console.log('Paciente cargado:', this.pacienteSeleccionado);

      // Cargar medicamentos del borrador específico
      this.medicamentosMock = borradorEncontrado.medicamentos;
      console.log('Medicamentos cargados:', this.medicamentosMock);
      
      // También actualizar el campo de búsqueda de paciente
      this.busquedaPaciente = this.pacienteSeleccionado.nombre;
    } else {
      console.error('Borrador no encontrado:', borradorId);
    }
    
    console.log('=== CARGA DE BORRADOR COMPLETADA ===');
  }

  // Función auxiliar para buscar un borrador por ID
  // En una aplicación real, esto sería un servicio
  private buscarBorradorPorId(borradorId: string) {
    // Datos de muestra que coinciden con los borradores del componente de borradores
    const borradoresMock = [
      {
        id: 'BR-2025-001234',
        paciente: {
          nombre: 'María Elena González Rodríguez',
          cedula: 'CC-1.234.567',
          edad: 45,
          genero: 'F'
        },
        medicamentos: [
          {
            nombre: 'Enalapril',
            cantidad: '30 tabletas',
            dosis: '10mg',
            frecuencia: '2 veces al día',
            via: 'Oral',
            duracion: '30 días'
          },
          {
            nombre: 'Hidroclorotiazida',
            cantidad: '30 tabletas',
            dosis: '25mg',
            frecuencia: '1 vez al día',
            via: 'Oral',
            duracion: '30 días'
          }
        ]
      },
      {
        id: 'BR-2025-001235',
        paciente: {
          nombre: 'Juan Carlos Martínez López',
          cedula: 'CC-2.345.678',
          edad: 62,
          genero: 'M'
        },
        medicamentos: [
          {
            nombre: 'Metformina',
            cantidad: '60 tabletas',
            dosis: '850mg',
            frecuencia: '2 veces al día',
            via: 'Oral',
            duracion: '30 días'
          },
          {
            nombre: 'Glibenclamida',
            cantidad: '30 tabletas',
            dosis: '5mg',
            frecuencia: '1 vez al día',
            via: 'Oral',
            duracion: '30 días'
          }
        ]
      },
      {
        id: 'BR-2025-001236',
        paciente: {
          nombre: 'Ana Sofía López Vargas',
          cedula: 'CC-3.456.789',
          edad: 28,
          genero: 'F'
        },
        medicamentos: [
          {
            nombre: 'Sumatriptán',
            cantidad: '6 tabletas',
            dosis: '50mg',
            frecuencia: 'Según necesidad',
            via: 'Oral',
            duracion: '14 días'
          }
        ]
      }
    ];

    return borradoresMock.find(borrador => borrador.id === borradorId);
  }

  volverABorradores() {
    this.router.navigate(['/prescripciones/borradores']);
  }

  // Notificaciones superiores
  notificaciones: Array<{
    id: string;
    tipo: 'info' | 'success' | 'warning' | 'error';
    titulo: string;
    mensaje: string;
    visible: boolean;
  }> = [];

  // Autocompletado de diagnósticos
  mostrarSugerenciasDiagnostico = false;
  diagnosticosFiltrados: string[] = [];

  // Plantillas
  mostrarPlantillas = false;

  prescripcion = {
    diagnostico: '',
    fechaConsulta: new Date().toISOString().split('T')[0],
    observaciones: '',
    medicamentos: [] as Medicamento[]
  };

  // Nuevo medicamento para el modal
  nuevoMedicamento = {
    nombre: '',
    cantidad: '',
    dosis: '',
    frecuencia: '',
    via: '',
    duracion: '',
    observaciones: ''
  };

  // Datos mock como aparecen en la imagen de React
  medicamentosMock = [
    {
      nombre: 'Ibuprofeno',
      cantidad: '15 tabletas',
      dosis: '400 mg',
      frecuencia: '3 veces al día',
      via: 'Oral',
      duracion: '5 días'
    },
    {
      nombre: 'Amoxicilina',
      cantidad: '14 cápsulas',
      dosis: '500 mg',
      frecuencia: '2 veces al día',
      via: 'Oral',
      duracion: '7 días'
    },
    {
      nombre: 'Omeprazol',
      cantidad: '14 tabletas',
      dosis: '20 mg',
      frecuencia: '1 vez al día',
      via: 'Oral',
      duracion: '14 días'
    }
  ];

  // Plantillas de prescripciones comunes
  plantillasComunes = [
    {
      nombre: 'Hipertensión Arterial',
      diagnostico: 'Hipertensión arterial esencial (I10)',
      medicamentos: [
        {
          name: 'Enalapril',
          dose: '10mg',
          frequency: 'Dos veces al día (BID)',
          duration: '30 días',
          administration: 'Oral',
          quantity: '60',
          observations: 'Tomar con alimentos'
        },
        {
          name: 'Hidroclorotiazida',
          dose: '25mg',
          frequency: 'Una vez al día (QD)',
          duration: '30 días',
          administration: 'Oral',
          quantity: '30',
          observations: 'Tomar en la mañana'
        }
      ]
    },
    {
      nombre: 'Diabetes Tipo 2',
      diagnostico: 'Diabetes mellitus tipo 2 no insulinodependiente (E11.9)',
      medicamentos: [
        {
          name: 'Metformina',
          dose: '850mg',
          frequency: 'Dos veces al día (BID)',
          duration: '30 días',
          administration: 'Oral',
          quantity: '60',
          observations: 'Tomar con las comidas'
        }
      ]
    },
    {
      nombre: 'Infección Respiratoria',
      diagnostico: 'Infección respiratoria aguda del tracto superior (J06.9)',
      medicamentos: [
        {
          name: 'Amoxicilina',
          dose: '500mg',
          frequency: 'Cada 8 horas',
          duration: '7 días',
          administration: 'Oral',
          quantity: '21',
          observations: 'Completar todo el tratamiento'
        },
        {
          name: 'Paracetamol (Acetaminofén)',
          dose: '500mg',
          frequency: 'Cada 6 horas',
          duration: '5 días',
          administration: 'Oral',
          quantity: '20',
          observations: 'Según necesidad para fiebre o dolor'
        }
      ]
    }
  ];

  // Diagnósticos comunes para autocompletado
  diagnosticosComunes = [
    'Hipertensión arterial esencial (I10)',
    'Diabetes mellitus tipo 2 no insulinodependiente (E11.9)',
    'Infección respiratoria aguda del tracto superior (J06.9)',
    'Gastritis crónica atrófica (K29.40)',
    'Artritis reumatoide seropositiva (M05.9)',
    'Migraña sin aura, episódica (G43.009)',
    'Osteoartritis de rodilla bilateral (M17.0)',
    'Trastorno de ansiedad generalizada (F41.1)',
    'Hipotiroidismo primario (E03.9)',
    'Reflujo gastroesofágico con esofagitis (K21.0)',
    'Síndrome del túnel carpiano bilateral (G56.00)',
    'Hiperplasia benigna de próstata (N40)',
    'Asma bronquial (J45.9)',
    'Depresión mayor recurrente (F33.9)',
    'Fibromialgia (M79.3)',
    'Síndrome del intestino irritable (K58.9)',
    'Cefalea tensional episódica (G44.2)',
    'Dermatitis atópica (L20.9)',
    'Conjuntivitis alérgica (H10.1)',
    'Lumbalgia mecánica (M54.5)'
  ];

  pacientesDisponibles: Paciente[] = [
    {
      id: 'PAC-2025-001',
      nombre: 'María Elena González Pérez',
      cedula: 'CC-1.234.567',
      edad: 45,
      alergias: ['Penicilina', 'Mariscos', 'Sulfonamidas', 'Yodo']
    },
    {
      id: 'PAC-2025-002',
      nombre: 'Juan Carlos Rodríguez Mora',
      cedula: 'CC-2.345.678',
      edad: 32,
      alergias: []
    },
    {
      id: 'PAC-2025-003',
      nombre: 'Ana Sofía López Vargas',
      cedula: 'CC-3.456.789',
      edad: 28,
      alergias: ['Aspirina', 'AINEs']
    },
    {
      id: 'PAC-2025-004',
      nombre: 'Carlos Alberto Jiménez Castro',
      cedula: 'CC-4.567.890',
      edad: 58,
      alergias: ['Ibuprofeno', 'Latex', 'Contraste yodado']
    },
    {
      id: 'PAC-2025-005',
      nombre: 'Lucía Patricia Hernández Solís',
      cedula: 'CC-5.678.901',
      edad: 35,
      alergias: ['Penicilina', 'Amoxicilina']
    },
    {
      id: 'PAC-2025-006',
      nombre: 'Roberto José Quesada Fallas',
      cedula: 'CC-6.789.012',
      edad: 42,
      alergias: []
    },
    {
      id: 'PAC-2025-007',
      nombre: 'Carmen Elena Vargas Mora',
      cedula: 'CC-7.890.123',
      edad: 67,
      alergias: ['Sulfonamidas', 'Morfina']
    },
    {
      id: 'PAC-2025-008',
      nombre: 'Miguel Ángel Rojas Solís',
      cedula: 'CC-8.901.234',
      edad: 29,
      alergias: ['Mariscos', 'Frutos secos']
    },
    {
      id: 'PAC-2025-009',
      nombre: 'Patricia Morales Vega',
      cedula: 'CC-9.012.345',
      edad: 51,
      alergias: ['Codeína', 'Latex']
    },
    {
      id: 'PAC-2025-010',
      nombre: 'José Manuel Fernández Arias',
      cedula: 'CC-1.023.456',
      edad: 38,
      alergias: []
    },
    {
      id: 'PAC-2025-011',
      nombre: 'Silvia Beatriz Campos Núñez',
      cedula: 'CC-1.134.567',
      edad: 44,
      alergias: ['Penicilina', 'Sulfa']
    },
    {
      id: 'PAC-2025-012',
      nombre: 'Fernando Antonio Soto Ramírez',
      cedula: 'CC-1.245.678',
      edad: 62,
      alergias: ['Aspirina', 'Warfarina']
    }
  ];

  buscarPacientes() {
    if (this.busquedaPaciente.trim().length < 2) {
      this.pacientesFiltrados = [];
      return;
    }

    const termino = this.busquedaPaciente.toLowerCase();
    this.pacientesFiltrados = this.pacientesDisponibles.filter(paciente =>
      paciente.nombre.toLowerCase().includes(termino) ||
      paciente.cedula.includes(termino)
    );
  }

  seleccionarPaciente(paciente: Paciente) {
    this.pacienteSeleccionado = paciente;
    this.busquedaPaciente = paciente.nombre;
    this.pacientesFiltrados = [];
    this.verificarAlertas();
  }

  buscarDiagnosticos() {
    if (this.prescripcion.diagnostico.trim().length < 2) {
      this.diagnosticosFiltrados = [];
      return;
    }

    const termino = this.prescripcion.diagnostico.toLowerCase();
    this.diagnosticosFiltrados = this.diagnosticosComunes.filter(diagnostico =>
      diagnostico.toLowerCase().includes(termino)
    ).slice(0, 5); // Limitar a 5 sugerencias
  }

  seleccionarDiagnostico(diagnostico: string) {
    this.prescripcion.diagnostico = diagnostico;
    this.diagnosticosFiltrados = [];
    this.mostrarSugerenciasDiagnostico = false;
  }

  ocultarSugerenciasDiagnostico() {
    // Usar setTimeout para permitir que el click en la sugerencia se procese primero
    setTimeout(() => {
      this.mostrarSugerenciasDiagnostico = false;
    }, 200);
  }

  aplicarPlantilla(plantilla: any) {
    // Aplicar diagnóstico si no hay uno
    if (!this.prescripcion.diagnostico.trim()) {
      this.prescripcion.diagnostico = plantilla.diagnostico;
    }

    // Agregar medicamentos de la plantilla
    plantilla.medicamentos.forEach((medicamento: any) => {
      const nuevoMedicamento: Medicamento = {
        id: Date.now().toString() + Math.random(),
        name: medicamento.name,
        dose: medicamento.dose,
        frequency: medicamento.frequency,
        duration: medicamento.duration,
        administration: medicamento.administration,
        quantity: medicamento.quantity,
        observations: medicamento.observations
      };
      this.prescripcion.medicamentos.push(nuevoMedicamento);
    });

    this.mostrarPlantillas = false;
    this.verificarAlertas();
  }

  getInitials(nombre: string): string {
    return nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  editarMedicamento(medicamento: any) {
    console.log('Editar medicamento:', medicamento);
    // Aquí se abriría el modal de edición
  }

  agregarMedicamentoALista() {
    if (this.nuevoMedicamento.nombre && this.nuevoMedicamento.cantidad &&
      this.nuevoMedicamento.dosis && this.nuevoMedicamento.frecuencia &&
      this.nuevoMedicamento.via && this.nuevoMedicamento.duracion) {

      this.medicamentosMock.push({
        nombre: this.nuevoMedicamento.nombre,
        cantidad: this.nuevoMedicamento.cantidad,
        dosis: this.nuevoMedicamento.dosis,
        frecuencia: this.nuevoMedicamento.frecuencia,
        via: this.nuevoMedicamento.via,
        duracion: this.nuevoMedicamento.duracion
      });

      // Limpiar formulario
      this.nuevoMedicamento = {
        nombre: '',
        cantidad: '',
        dosis: '',
        frecuencia: '',
        via: '',
        duracion: '',
        observaciones: ''
      };

      // Cerrar modal
      this.closeAddMedicineModal();

      console.log('Medicamento agregado:', this.medicamentosMock);
    } else {
      alert('⚠️ Por favor complete todos los campos obligatorios');
    }
  }

  agregarMedicamento() {
    if (!this.selectedPatient) {
      this.notificationService.showNoPatientSelectedWarning();
      return;
    }
    this.showAddMedicineModal = true;
  }

  closeAddMedicineModal() {
    this.showAddMedicineModal = false;
  }

  onMedicineAdded(medicine: Medicine) {
    const nuevoMedicamento: Medicamento = {
      id: Date.now().toString(),
      name: medicine.name,
      dose: medicine.dose,
      frequency: medicine.frequency,
      duration: medicine.duration,
      administration: medicine.administration,
      quantity: medicine.quantity,
      observations: medicine.observations
    };
    this.prescripcion.medicamentos.push(nuevoMedicamento);
    this.verificarAlertas();
  }

  eliminarMedicamento(index: number) {
    this.prescripcion.medicamentos.splice(index, 1);
    this.verificarAlertas();
  }

  verificarAlertas() {
    this.alertas = [];

    if (this.pacienteSeleccionado && this.pacienteSeleccionado.alergias.length > 0) {
      this.prescripcion.medicamentos.forEach(med => {
        if (med.name.trim()) {
          this.pacienteSeleccionado!.alergias.forEach(alergia => {
            const medicamentoLower = med.name.toLowerCase();
            const alergiaLower = alergia.toLowerCase();

            // Verificaciones específicas de alergias
            if (medicamentoLower.includes(alergiaLower) ||
              (alergiaLower === 'penicilina' && (medicamentoLower.includes('amoxicilina') || medicamentoLower.includes('ampicilina'))) ||
              (alergiaLower === 'aspirina' && medicamentoLower.includes('ácido acetilsalicílico')) ||
              (alergiaLower === 'ibuprofeno' && medicamentoLower.includes('advil'))) {
              this.alertas.push(`⚠️ ALERTA: ${med.name} puede causar reacción alérgica (paciente alérgico a ${alergia})`);
            }
          });
        }
      });
    }

    // Verificar interacciones comunes
    const medicamentosNombres = this.prescripcion.medicamentos.map(m => m.name.toLowerCase());
    if (medicamentosNombres.includes('warfarina') && medicamentosNombres.includes('aspirina')) {
      this.alertas.push('⚠️ INTERACCIÓN: Warfarina + Aspirina puede aumentar riesgo de sangrado');
    }

    // Verificar edad del paciente
    if (this.pacienteSeleccionado && this.pacienteSeleccionado.edad >= 65) {
      this.prescripcion.medicamentos.forEach(med => {
        if (med.name.toLowerCase().includes('diazepam') || med.name.toLowerCase().includes('lorazepam')) {
          this.alertas.push('⚠️ PRECAUCIÓN: Benzodiacepinas en adultos mayores requieren dosis reducida');
        }
      });
    }
  }

  puedeCompletar(): boolean {
    return !!(
      this.pacienteSeleccionado &&
      this.prescripcion.diagnostico.trim() &&
      this.prescripcion.medicamentos.length > 0 &&
      this.prescripcion.medicamentos.every(med =>
        med.name.trim() && med.dose.trim() && med.frequency
      )
    );
  }

  guardarBorrador() {
    const borradorId = this.generarIdBorrador();

    console.log('Guardando borrador:', {
      id: borradorId,
      paciente: this.pacienteSeleccionado,
      prescripcion: this.prescripcion,
      medicamentos: this.medicamentosMock,
      fechaCreacion: new Date().toISOString()
    });

    // Simular guardado exitoso
    setTimeout(() => {
      alert(`💾 Borrador Guardado Exitosamente\n\n📋 ID: ${borradorId}\n👤 Paciente: María Elena González Rodríguez\n💊 Medicamentos: ${this.medicamentosMock.length}\n📅 Fecha: ${this.getFechaActual()}\n\n✅ El borrador se ha guardado correctamente y puede continuar editándolo más tarde.`);
    }, 500);
  }

  verificarConDrugBank() {
    console.log('Verificando medicamentos con DrugBank:', this.medicamentosMock);

    // Mostrar primera notificación (azul - consultando)
    this.mostrarNotificacion('info', 'Consultando DrugBank...', 'Verificando interacciones con base de datos externa');

    // Después de 2 segundos, mostrar segunda notificación (verde - completada)
    setTimeout(() => {
      this.cerrarTodasLasNotificaciones();
      this.mostrarNotificacion('success', 'Consulta completada: DrugBank', 'No se encontraron interacciones adicionales');
    }, 2000);
  }

  abrirModalFinalizar() {
    this.showFinalizarModal = true;
  }

  cerrarModalFinalizar() {
    this.showFinalizarModal = false;
  }

  confirmarFinalizacion() {
    const recetaId = this.generarIdReceta();

    console.log('Finalizando prescripción:', {
      id: recetaId,
      paciente: 'María Elena González Rodríguez',
      medico: 'Dr. Carlos Alberto Mendoza Herrera',
      medicamentos: this.medicamentosMock,
      fechaEmision: new Date().toISOString()
    });

    // Cerrar modal de confirmación
    this.showFinalizarModal = false;

    // Simular proceso de finalización
    setTimeout(() => {
      alert(`🎉 Prescripción Finalizada Exitosamente\n\n📋 Número de Receta: ${recetaId}\n👤 Paciente: María Elena González Rodríguez\n👨‍⚕️ Médico: Dr. Carlos Alberto Mendoza Herrera\n💊 Medicamentos: ${this.medicamentosMock.length}\n📅 Fecha de Emisión: ${this.getFechaActual()}\n🔐 Estado: Certificada Digitalmente\n\n✅ La prescripción ha sido emitida y enviada al sistema nacional de salud.\n📧 Se ha enviado una copia por correo electrónico al paciente.\n🏥 La receta está disponible en todas las farmacias autorizadas.`);

      // Simular navegación a la lista de recetas emitidas
      console.log('Navegando a recetas emitidas...');
    }, 1500);
  }

  completarPrescripcion() {
    // Método mantenido para compatibilidad
    this.abrirModalFinalizar();
  }

  // Nuevos métodos para los botones del modal
  verRecetasEmitidas() {
    this.showFinalizarModal = false;
    console.log('Navegando a Ver Recetas Emitidas...');
    // Aquí iría la navegación real a la página de recetas emitidas
  }

  imprimirReceta() {
    console.log('Imprimiendo receta RX-2025-009844...');
    // Aquí iría la lógica para imprimir la receta
    alert('📄 Preparando impresión de la receta RX-2025-009844...');
  }

  nuevaPrescripcion() {
    this.showFinalizarModal = false;
    // Limpiar el formulario para una nueva prescripción
    this.limpiarFormulario();
    console.log('Iniciando nueva prescripción...');
  }

  // Método para guardar cambios (nuevo)
  guardarCambios() {
    console.log('Guardando cambios como borrador...');

    // Mostrar notificación de guardado
    this.mostrarNotificacion('success', 'Borrador guardado exitosamente', 'Número de borrador: draft-176011670135-17dii8vlo');

    // Mostrar modal después de un breve delay
    setTimeout(() => {
      this.showGuardarCambiosModal = true;
    }, 1000);
  }

  cerrarModalGuardarCambios() {
    this.showGuardarCambiosModal = false;
  }

  cancelar() {
    if (this.esModoEdicionBorrador) {
      this.volverABorradores();
    } else {
      // Lógica para cancelar nueva receta
      this.router.navigate(['/prescripciones']);
    }
  }

  irAMisBorradores() {
    this.showGuardarCambiosModal = false;
    console.log('Navegando a Mis Borradores...');
    // Aquí iría la navegación real
  }

  continuarEditando() {
    this.showGuardarCambiosModal = false;
  }

  // Métodos para fechas
  getFechaActual(): string {
    return new Date().toLocaleDateString('es-CR');
  }

  getHoraActual(): string {
    return new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
  }

  generarIdBorrador(): string {
    return `BR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
  }

  generarIdReceta(): string {
    return `RX-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
  }

  // Métodos para notificaciones
  mostrarNotificacion(tipo: 'info' | 'success' | 'warning' | 'error', titulo: string, mensaje: string) {
    const id = Date.now().toString();
    const notificacion = {
      id,
      tipo,
      titulo,
      mensaje,
      visible: false
    };

    this.notificaciones.push(notificacion);

    // Mostrar con animación
    setTimeout(() => {
      const notif = this.notificaciones.find(n => n.id === id);
      if (notif) notif.visible = true;
    }, 100);

    // Auto-cerrar después de 4 segundos
    setTimeout(() => {
      this.cerrarNotificacion(id);
    }, 4000);
  }

  cerrarNotificacion(id: string) {
    const notif = this.notificaciones.find(n => n.id === id);
    if (notif) {
      notif.visible = false;
      setTimeout(() => {
        this.notificaciones = this.notificaciones.filter(n => n.id !== id);
      }, 300);
    }
  }

  cerrarTodasLasNotificaciones() {
    this.notificaciones.forEach(notif => {
      notif.visible = false;
    });
    setTimeout(() => {
      this.notificaciones = [];
    }, 300);
  }

  private limpiarFormulario() {
    this.pacienteSeleccionado = null;
    this.busquedaPaciente = '';
    this.pacientesFiltrados = [];
    this.prescripcion = {
      diagnostico: '',
      fechaConsulta: new Date().toISOString().split('T')[0],
      observaciones: '',
      medicamentos: []
    };
    this.alertas = [];
    // Reiniciar medicamentos mock para nueva prescripción
    this.medicamentosMock = [];
    // Clear patient selection
    this.selectedPatient = null;
  }

  // Patient selection methods
  openPatientSelectionModal(): void {
    this.showPatientSelectionModal = true;
  }

  closePatientSelectionModal(): void {
    this.showPatientSelectionModal = false;
  }

  onPatientSelected(patient: NewPatientDialogPatientData): void {
    // Convert NewPatientDialogPatientData to our PatientData interface
    this.selectedPatient = {
      id: patient.id || '',
      fullName: patient.fullName || `${patient.firstName} ${patient.firstLastName}`,
      firstName: patient.firstName,
      secondName: patient.secondName,
      firstLastName: patient.firstLastName,
      secondLastName: patient.secondLastName,
      idType: patient.idType,
      idNumber: patient.idNumber,
      birthDate: patient.birthDate,
      age: patient.age || 0,
      gender: patient.gender as 'M' | 'F',
      bloodType: patient.bloodType,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      city: patient.city,
      country: patient.country,
      occupation: patient.occupation,
      weight: patient.weight,
      height: patient.height,
      bmi: patient.bmi,
      insuranceProvider: patient.insuranceProvider,
      insuranceNumber: patient.insuranceNumber,
      insuranceType: patient.insuranceType,
      allergies: patient.allergies || [],
      chronicConditions: patient.chronicConditions || [],
      currentMedications: patient.currentMedications || [],
      clinicalNotes: patient.clinicalNotes,
      emergencyContact: {
        name: patient.emergencyContact?.name || '',
        relationship: patient.emergencyContact?.relationship || '',
        phone: patient.emergencyContact?.phone || ''
      },
      registrationDate: patient.registrationDate || new Date().toISOString(),
      status: 'active',
      lastVisit: undefined
    };

    // Also update the legacy pacienteSeleccionado for backward compatibility
    this.pacienteSeleccionado = {
      id: patient.id || '',
      nombre: patient.fullName || `${patient.firstName} ${patient.firstLastName}`,
      cedula: patient.idNumber,
      edad: patient.age || 0,
      alergias: patient.allergies || []
    };

    this.closePatientSelectionModal();
    
    // Show success notification
    this.mostrarNotificacion('success', 'Paciente Seleccionado', 
      `${patient.fullName} ha sido seleccionado para esta prescripción.`);
  }
}