import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Bell, Plus, Save, X, AlertTriangle, Users, User, Mail, MessageSquare, Smartphone, Settings, Send, FileText, Upload, TestTube2, CheckCircle2, XCircle, Clock, Copy, AlertCircle } from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-nueva-notificacion',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, LucideAngularModule, PageLayoutComponent],
  template: `
    <app-page-layout 
      [title]="pageTitle" 
      [description]="pageDescription"
      [icon]="isEditMode ? bellIcon : plusIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-green-600 via-emerald-500 to-teal-600"
      [hasActionButton]="true">
      
      <button 
        slot="action"
        (click)="volver()"
        class="bg-white text-green-600 hover:bg-green-50 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
        <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
        Cancelar
      </button>
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

      <!-- Formulario mejorado -->
      <div class="bg-white rounded-lg shadow mt-6">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Información de la notificación</h2>
          <p class="text-sm text-gray-600 mt-1">
            {{ isEditMode ? 'Modifique los datos de la notificación' : 'Complete los datos para crear la nueva notificación' }}
          </p>
        </div>

        <form [formGroup]="formNotificacion" (ngSubmit)="guardarNotificacion()" class="p-6 space-y-6">
          <!-- Sección: Datos Generales -->
          <div class="space-y-4">
            <div class="pb-2 border-b">
              <h3 class="font-medium text-gray-900 flex items-center gap-2">
                <lucide-icon [img]="settingsIcon" class="w-4 h-4 text-green-600"></lucide-icon>
                Datos Generales
              </h3>
              <p class="text-sm text-gray-600">Información básica de la notificación</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Código / ID <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="codigo"
                  placeholder="Ej: NOTIF-001"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p class="text-xs text-gray-500">Código único de identificación</p>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Nombre o título de notificación <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="nombre"
                  placeholder="Ej: Confirmación de receta emitida"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                formControlName="descripcion"
                placeholder="Descripción detallada de la notificación..."
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Tipo de destinatario</label>
                <select formControlName="tipoDestinatario" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="interno">Interno</option>
                  <option value="externo">Externo</option>
                  <option value="ambos">Ambos</option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Categoría o módulo</label>
                <select formControlName="categoria" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="Usuarios">Usuarios</option>
                  <option value="Prescripciones">Prescripciones</option>
                  <option value="Dispensación">Dispensación</option>
                  <option value="Inventario">Inventario</option>
                  <option value="Reportes">Reportes</option>
                  <option value="Seguridad">Seguridad</option>
                  <option value="Sistema">Sistema</option>
                  <option value="Alertas">Alertas</option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Estado</label>
                <div class="relative">
                  <select formControlName="estado" class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white">
                    <option value="activa">✓ Activa</option>
                    <option value="inactiva">✗ Inactiva</option>
                    <option value="programada">⏰ Programada</option>
                    <option value="pausada">⚠ Pausada</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <lucide-icon [img]="getEstadoIcon(formNotificacion.get('estado')?.value)" 
                                 [class]="getEstadoIconClass(formNotificacion.get('estado')?.value)"
                                 class="w-4 h-4"></lucide-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sección: Canales de Envío -->
          <div class="space-y-4">
            <div class="pb-2 border-b">
              <h3 class="font-medium text-gray-900 flex items-center gap-2">
                <lucide-icon [img]="sendIcon" class="w-4 h-4 text-green-600"></lucide-icon>
                Canales de Envío
              </h3>
              <p class="text-sm text-gray-600">Seleccione los canales por los que se enviará la notificación</p>
            </div>

            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700">
                Canales habilitados <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div class="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="channel-email" 
                    [checked]="selectedChannels.includes('Correo')"
                    (change)="onChannelChange('Correo', $event)"
                    class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500">
                  <label for="channel-email" class="text-sm flex items-center gap-2 cursor-pointer">
                    <lucide-icon [img]="mailIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                    Correo
                  </label>
                </div>

                <div class="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="channel-internal" 
                    [checked]="selectedChannels.includes('Interna')"
                    (change)="onChannelChange('Interna', $event)"
                    class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500">
                  <label for="channel-internal" class="text-sm flex items-center gap-2 cursor-pointer">
                    <lucide-icon [img]="bellIcon" class="w-4 h-4 text-purple-600"></lucide-icon>
                    Interna
                  </label>
                </div>

                <div class="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="channel-sms" 
                    [checked]="selectedChannels.includes('SMS')"
                    (change)="onChannelChange('SMS', $event)"
                    class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500">
                  <label for="channel-sms" class="text-sm flex items-center gap-2 cursor-pointer">
                    <lucide-icon [img]="messageSquareIcon" class="w-4 h-4 text-green-600"></lucide-icon>
                    SMS
                  </label>
                </div>

                <div class="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="channel-whatsapp" 
                    [checked]="selectedChannels.includes('WhatsApp')"
                    (change)="onChannelChange('WhatsApp', $event)"
                    class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500">
                  <label for="channel-whatsapp" class="text-sm flex items-center gap-2 cursor-pointer">
                    <lucide-icon [img]="messageSquareIcon" class="w-4 h-4 text-green-500"></lucide-icon>
                    WhatsApp
                  </label>
                </div>

                <div class="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="channel-push" 
                    [checked]="selectedChannels.includes('Push')"
                    (change)="onChannelChange('Push', $event)"
                    class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500">
                  <label for="channel-push" class="text-sm flex items-center gap-2 cursor-pointer">
                    <lucide-icon [img]="smartphoneIcon" class="w-4 h-4 text-orange-600"></lucide-icon>
                    Push
                  </label>
                </div>
              </div>
              <p class="text-xs text-gray-500">Debe seleccionar al menos un canal de envío</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Asunto</label>
                <input
                  type="text"
                  formControlName="asunto"
                  placeholder="Asunto de la notificación"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Prioridad</label>
                <div class="relative">
                  <select formControlName="prioridad" class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white">
                    <option value="alta">🔴 Alta</option>
                    <option value="media">🟡 Media</option>
                    <option value="baja">⚪ Baja</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <div [class]="getPrioridadIndicatorClass(formNotificacion.get('prioridad')?.value)"
                         class="w-3 h-3 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <label class="block text-sm font-medium text-gray-700">Cuerpo del mensaje</label>
                <lucide-icon [img]="fileTextIcon" class="w-4 h-4 text-gray-400"></lucide-icon>
              </div>
              <textarea
                formControlName="cuerpoMensaje"
                placeholder="Contenido del mensaje..."
                rows="5"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Sección: Personalización del Contenido -->
          <div class="space-y-4">
            <div class="pb-2 border-b">
              <h3 class="font-medium text-gray-900 flex items-center gap-2">
                <lucide-icon [img]="fileTextIcon" class="w-4 h-4 text-green-600"></lucide-icon>
                Personalización del Contenido
              </h3>
              <p class="text-sm text-gray-600">Variables dinámicas y archivos adjuntos</p>
            </div>

            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700">Variables dinámicas disponibles</label>
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let variable of availableVariables" 
                        (click)="copyVariable(variable)"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 transition-colors font-mono">
                    {{ variable }}
                  </span>
                </div>
                <p class="text-sm text-gray-500 mt-3">
                  Haga clic en una variable para copiarla al portapapeles
                </p>
              </div>
            </div>

            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700">Adjuntos permitidos</label>
              <div class="flex gap-3">
                <button
                  type="button"
                  (click)="triggerFileUpload()"
                  class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <lucide-icon [img]="uploadIcon" class="w-4 h-4"></lucide-icon>
                  Seleccionar archivo
                </button>
                <input
                  #fileInput
                  type="file"
                  class="hidden"
                  (change)="onFileSelected($event)"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                <div *ngIf="selectedFile" class="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                  <lucide-icon [img]="fileTextIcon" class="w-4 h-4 text-green-600"></lucide-icon>
                  <span class="text-sm text-green-800">{{ selectedFile.name }}</span>
                  <button
                    (click)="removeFile()"
                    class="text-green-400 hover:text-green-600"
                  >
                    <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-500">
                Formatos permitidos: PDF, DOC, DOCX, JPG, PNG (máx. 5MB)
              </p>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex gap-2">
              <lucide-icon [img]="alertTriangleIcon" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></lucide-icon>
              <div>
                <p class="text-sm font-medium text-blue-900">Información importante</p>
                <p class="text-sm text-blue-700 mt-1">
                  Las notificaciones se enviarán inmediatamente a los usuarios seleccionados y aparecerán en su centro de notificaciones.
                </p>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              (click)="probarEnvio()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <lucide-icon [img]="testTube2Icon" class="w-4 h-4"></lucide-icon>
              Probar envío
            </button>

            <button
              type="submit"
              [disabled]="!isFormValid()"
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <lucide-icon [img]="saveIcon" class="w-4 h-4"></lucide-icon>
              {{ isEditMode ? 'Guardar cambios' : 'Crear notificación' }}
            </button>
          </div>
        </form>
      </div>
      </div>
    </app-page-layout>
  `
})
export class NuevaNotificacionComponent implements OnInit {
  // Iconos
  bellIcon = Bell;
  plusIcon = Plus;
  saveIcon = Save;
  xIcon = X;
  alertTriangleIcon = AlertTriangle;
  usersIcon = Users;
  userIcon = User;
  mailIcon = Mail;
  messageSquareIcon = MessageSquare;
  smartphoneIcon = Smartphone;
  settingsIcon = Settings;
  sendIcon = Send;
  fileTextIcon = FileText;
  uploadIcon = Upload;
  testTube2Icon = TestTube2;
  checkCircle2Icon = CheckCircle2;
  xCircleIcon = XCircle;
  clockIcon = Clock;
  copyIcon = Copy;
  alertCircleIcon = AlertCircle;

  // Estado del componente
  isEditMode = false;
  editingId: string | null = null;

  // Breadcrumbs
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Notificaciones', route: '/notificaciones' },
    { label: 'Listado de notificaciones', route: '/notificaciones/lista' },
    { label: 'Nueva notificación', route: '/notificaciones/nueva' }
  ];

  // Formulario
  formNotificacion: FormGroup;
  selectedChannels: string[] = ['Correo', 'Interna'];
  selectedFile: File | null = null;

  // Variables dinámicas disponibles
  availableVariables = [
    '{nombre_usuario}',
    '{email}',
    '{fecha_actual}',
    '{hora_actual}',
    '{nombre_sistema}',
    '{url_acceso}',
    '{codigo_verificacion}',
    '{nombre_medico}',
    '{numero_receta}'
  ];

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.formNotificacion = this.fb.group({
      codigo: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      tipoDestinatario: ['interno', Validators.required],
      categoria: ['Prescripciones', Validators.required],
      prioridad: ['media', Validators.required],
      estado: ['activa', Validators.required],
      asunto: [''],
      cuerpoMensaje: [''],
      usuarioModificacion: ['Administrador Sistema']
    });
  }

  ngOnInit() {
    // Verificar si estamos en modo edición
    this.route.queryParams.subscribe((params: any) => {
      if (params['edit'] && params['mode'] === 'edit') {
        this.isEditMode = true;
        this.editingId = params['edit'];
        this.loadNotificationData(params['edit']);
        this.updateBreadcrumbs();
      } else {
        // Modo nueva: limpiar todo y poner valores por defecto
        this.resetForm();
      }
    });
  }

  private resetForm(): void {
    this.formNotificacion.patchValue({
      codigo: '',
      nombre: '',
      descripcion: '',
      tipoDestinatario: 'interno',
      categoria: 'Prescripciones',
      prioridad: 'media',
      estado: 'activa',
      asunto: '',
      cuerpoMensaje: '',
      usuarioModificacion: 'Administrador Sistema'
    });
    this.selectedChannels = ['Correo', 'Interna'];
    this.selectedFile = null;
  }

  private updateBreadcrumbs(): void {
    if (this.isEditMode) {
      this.breadcrumbItems[this.breadcrumbItems.length - 1] = {
        label: 'Editar notificación',
        route: '/notificaciones/nueva'
      };
    }
  }

  private loadNotificationData(id: string): void {
    // En una aplicación real, esto vendría de un servicio
    // Por ahora simulamos la carga de datos
    const mockData = {
      codigo: 'NOTIF-TEST-001',
      nombre: 'Notificación de prueba',
      descripcion: 'Esta es una notificación de prueba para editar',
      tipoDestinatario: 'interno',
      categoria: 'Sistema',
      prioridad: 'media',
      estado: 'activa',
      asunto: 'Asunto de prueba',
      cuerpoMensaje: 'Este es el cuerpo del mensaje de prueba',
      usuarioModificacion: 'Administrador Sistema'
    };

    this.formNotificacion.patchValue(mockData);
    this.selectedChannels = ['Correo', 'Interna'];
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Editar Notificación' : 'Nueva Notificación';
  }

  get pageDescription(): string {
    return this.isEditMode 
      ? 'Modificar la configuración de la notificación existente'
      : 'Crear y enviar notificación a usuarios del sistema';
  }

  onChannelChange(channel: string, event: any): void {
    if (event.target.checked) {
      if (!this.selectedChannels.includes(channel)) {
        this.selectedChannels = [...this.selectedChannels, channel];
      }
    } else {
      this.selectedChannels = this.selectedChannels.filter(c => c !== channel);
    }
  }

  copyVariable(variable: string): void {
    navigator.clipboard.writeText(variable).then(() => {
      this.notificationService.showSuccess(
        `Variable ${variable} copiada al portapapeles`,
        'Variable Copiada'
      );
    });
  }

  triggerFileUpload(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.notificationService.showSuccess(
        `Archivo "${file.name}" cargado correctamente`,
        'Archivo Cargado'
      );
    }
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  probarEnvio(): void {
    this.notificationService.showInfo(
      'Enviando notificación de prueba...',
      'Prueba de Envío'
    );
    
    setTimeout(() => {
      this.notificationService.showSuccess(
        'Notificación de prueba enviada correctamente',
        'Prueba Exitosa'
      );
    }, 1500);
  }

  isFormValid(): boolean {
    const formValid = this.formNotificacion.get('codigo')?.value?.trim() &&
                     this.formNotificacion.get('nombre')?.value?.trim() &&
                     this.selectedChannels.length > 0;
    return !!formValid;
  }

  getEstadoIcon(estado: string): any {
    const icons = {
      'activa': this.checkCircle2Icon,
      'inactiva': this.xCircleIcon,
      'programada': this.clockIcon,
      'pausada': this.alertCircleIcon
    };
    return icons[estado as keyof typeof icons] || this.checkCircle2Icon;
  }

  getEstadoIconClass(estado: string): string {
    const classes = {
      'activa': 'text-green-600',
      'inactiva': 'text-gray-400',
      'programada': 'text-blue-600',
      'pausada': 'text-amber-600'
    };
    return classes[estado as keyof typeof classes] || 'text-green-600';
  }

  getPrioridadIndicatorClass(prioridad: string): string {
    const classes = {
      'alta': 'bg-red-500',
      'media': 'bg-yellow-500',
      'baja': 'bg-gray-300'
    };
    return classes[prioridad as keyof typeof classes] || 'bg-yellow-500';
  }

  guardarNotificacion() {
    // Validaciones
    if (!this.formNotificacion.get('codigo')?.value?.trim()) {
      this.notificationService.showWarning(
        'Debe ingresar un código para la notificación',
        'Código Requerido'
      );
      return;
    }

    if (!this.formNotificacion.get('nombre')?.value?.trim()) {
      this.notificationService.showWarning(
        'Debe ingresar un nombre para la notificación',
        'Nombre Requerido'
      );
      return;
    }

    if (this.selectedChannels.length === 0) {
      this.notificationService.showWarning(
        'Debe seleccionar al menos un canal de envío',
        'Canal Requerido'
      );
      return;
    }

    try {
      const formData = this.formNotificacion.value;
      
      if (this.isEditMode && this.editingId) {
        // Actualizar notificación existente
        const updatedData = {
          ...formData,
          codigo: formData.codigo.toUpperCase(),
          canales: this.selectedChannels,
          canalPrincipal: this.selectedChannels[0],
          ultimaModificacion: new Date().toISOString()
        };
        
        console.log('Notificación actualizada:', updatedData);
        
        this.notificationService.showSuccess(
          `${formData.nombre} ha sido actualizada exitosamente`,
          'Notificación Actualizada'
        );
      } else {
        // Crear nueva notificación
        const newNotification = {
          ...formData,
          id: Date.now().toString(),
          codigo: formData.codigo.toUpperCase(),
          canales: this.selectedChannels,
          canalPrincipal: this.selectedChannels[0],
          ultimaModificacion: new Date().toISOString(),
          totalEnvios: 0,
          exitosos: 0,
          fallidos: 0
        };
        
        console.log('Nueva notificación creada:', newNotification);
        
        this.notificationService.showSuccess(
          `${formData.nombre} ha sido agregada al sistema`,
          'Notificación Creada'
        );
        
        // Limpiar formulario después de crear
        this.resetForm();
      }

      // Navegar de vuelta después de 1 segundo
      setTimeout(() => {
        this.router.navigate(['/notificaciones/lista'], {
          queryParams: this.isEditMode ? { edited: 'true' } : {}
        });
      }, 1000);
    } catch (error) {
      this.notificationService.showWarning(
        'No se pudo guardar la notificación',
        'Error al Guardar'
      );
    }
  }

  volver() {
    if (this.formNotificacion.dirty) {
      // Mostrar notificación de confirmación con botón de acción
      this.notificationService.showWarning(
        '¿Desea descartar los cambios realizados? Los cambios no guardados se perderán.',
        'Confirmar Descarte',
        {
          duration: 0, // Persistente hasta que el usuario actúe
          actionText: 'Descartar',
          actionHandler: () => {
            this.notificationService.showInfo(
              'Los cambios han sido descartados',
              'Cambios Descartados'
            );
            this.router.navigate(['/notificaciones/lista']);
          }
        }
      );
    } else {
      this.router.navigate(['/notificaciones/lista']);
    }
  }
}