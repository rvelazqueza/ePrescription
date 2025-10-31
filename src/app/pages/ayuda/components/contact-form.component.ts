import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Send, MessageSquare, ArrowLeft } from 'lucide-angular';
import { MessagingBridgeService } from '../../../services/messaging-bridge.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div class="border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6">
        <div class="flex items-center gap-4">
          <button 
            (click)="onBack()"
            class="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <lucide-icon [img]="arrowLeftIcon" class="w-4 h-4"></lucide-icon>
            Volver
          </button>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <lucide-icon [img]="messageSquareIcon" class="w-5 h-5"></lucide-icon>
              Contactar Soporte
            </h2>
            <p class="text-gray-600">Envía tu consulta al equipo de soporte técnico</p>
          </div>
        </div>
      </div>
      
      <div class="p-6">
        <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Categoría -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Categoría</label>
            <select 
              formControlName="category"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="general">Consulta General</option>
              <option value="prescripciones">Prescripciones</option>
              <option value="dispensacion">Dispensación</option>
              <option value="pacientes">Pacientes</option>
              <option value="inventario">Inventario</option>
              <option value="seguridad">Seguridad</option>
              <option value="reportes">Reportes</option>
              <option value="firma-digital">Firma Digital</option>
              <option value="interoperabilidad">Interoperabilidad</option>
              <option value="alertas">Alertas Clínicas</option>
              <option value="configuracion">Configuración</option>
            </select>
          </div>

          <!-- Prioridad -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Prioridad</label>
            <select 
              formControlName="priority"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <!-- Asunto -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Asunto *</label>
            <input
              type="text"
              formControlName="subject"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe brevemente tu consulta"
            />
          </div>

          <!-- Mensaje -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Mensaje *</label>
            <textarea
              formControlName="content"
              rows="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe tu consulta o problema en detalle..."
            ></textarea>
          </div>

          <!-- Info -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <lucide-icon [img]="messageSquareIcon" class="h-5 w-5 text-blue-600 mt-0.5"></lucide-icon>
              <div class="text-blue-900 text-sm">
                <strong>Nota:</strong> Tu mensaje será enviado al sistema de autoservicio donde podrás hacer seguimiento de la respuesta.
              </div>
            </div>
          </div>

          <!-- Botón -->
          <button
            type="submit"
            [disabled]="contactForm.invalid || isLoading"
            class="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <div *ngIf="isLoading" class="flex items-center gap-2">
              <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Enviando mensaje...
            </div>
            <div *ngIf="!isLoading" class="flex items-center gap-2">
              <lucide-icon [img]="sendIcon" class="w-5 h-5"></lucide-icon>
              Enviar mensaje
            </div>
          </button>
        </form>
      </div>
    </div>
  `
})
export class ContactFormComponent {
  contactForm: FormGroup;
  isLoading = false;

  // Icons
  sendIcon = Send;
  messageSquareIcon = MessageSquare;
  arrowLeftIcon = ArrowLeft;

  constructor(
    private fb: FormBuilder,
    private messagingBridge: MessagingBridgeService,
    private notificationService: NotificationService
  ) {
    this.contactForm = this.fb.group({
      category: ['general', [Validators.required]],
      priority: ['normal', [Validators.required]],
      subject: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
  }

  async onSubmit() {
    if (this.contactForm.invalid) {
      this.notificationService.showValidationError('Por favor completa todos los campos requeridos');
      return;
    }

    this.isLoading = true;

    try {
      const formValue = this.contactForm.value;
      
      await this.messagingBridge.sendHelpMessage({
        subject: formValue.subject,
        content: formValue.content,
        category: formValue.category,
        priority: formValue.priority
      }).toPromise();

      this.notificationService.showSuccess(
        'Mensaje enviado correctamente',
        'Puedes ver la respuesta en Autoservicio → Mensajería'
      );

      // Limpiar formulario
      this.contactForm.reset({
        category: 'general',
        priority: 'normal',
        subject: '',
        content: ''
      });

    } catch (error) {
      this.notificationService.showError('Error al enviar mensaje');
    } finally {
      this.isLoading = false;
    }
  }

  onBack() {
    // Emitir evento para volver a la vista anterior
    // En una implementación real, esto sería manejado por el componente padre
    console.log('Volver a la vista anterior');
  }
}