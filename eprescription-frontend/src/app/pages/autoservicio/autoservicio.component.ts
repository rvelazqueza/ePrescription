import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { 
  LucideAngularModule, 
  UserCog,
  KeyRound, 
  User, 
  MessageSquare, 
  Shield, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Send,
  Save,
  Clock,
  MessageCircle,
  FileText,
  CheckCheck,
  AlertTriangle,
  Info,
  Lock,
  ArrowLeft,
  RefreshCw,
  ChevronRight,
  HelpCircle
} from 'lucide-angular';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';
import { BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs.component';
import { AutoservicioService } from '../../services/autoservicio.service';
import { NotificationService } from '../../services/notification.service';
import { 
  UserProfile, 
  PasswordChangeRequest, 
  PasswordStrength,
  MessagingStats,
  Conversation,
  Message,
  MessageTopic
} from '../../interfaces/autoservicio.interface';

@Component({
  selector: 'app-autoservicio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    PageLayoutComponent
  ],
  template: `
    <app-page-layout 
      [breadcrumbItems]="breadcrumbs"
      [title]="'Autoservicio del Usuario'"
      [description]="'Gestiona tu cuenta de forma autónoma, actualiza tus datos personales y comunícate con la administración del sistema'"
      [icon]="userCogIcon"
      [headerGradient]="'from-blue-600 to-cyan-600'"
      [showMedicalIcons]="true">
      <div class="space-y-6">
        <!-- Alert de seguridad -->
        <div class="border border-blue-200 bg-blue-50 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <lucide-icon [img]="shieldIcon" class="h-5 w-5 text-blue-600 mt-0.5"></lucide-icon>
            <div class="text-blue-900">
              <strong>Seguridad garantizada:</strong> Todas las operaciones están protegidas con cifrado de extremo a extremo y cumplen con estándares internacionales de seguridad médica.
            </div>
          </div>
        </div>

        <!-- Tabs principales -->
        <div class="space-y-6">
          <div class="grid w-full grid-cols-3 h-auto p-1 bg-white border border-gray-200 shadow-sm rounded-lg">
            <button 
              (click)="onTabChange('password')"
              [class]="'flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all ' + (activeTab === 'password' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' : 'text-gray-600 hover:bg-gray-50')"
            >
              <lucide-icon [img]="keyRoundIcon" class="w-4 h-4"></lucide-icon>
              <span class="hidden sm:inline">Cambiar contraseña</span>
              <span class="sm:hidden">Contraseña</span>
            </button>
            <button 
              (click)="onTabChange('profile')"
              [class]="'flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all ' + (activeTab === 'profile' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' : 'text-gray-600 hover:bg-gray-50')"
            >
              <lucide-icon [img]="userIcon" class="w-4 h-4"></lucide-icon>
              <span class="hidden sm:inline">Actualizar datos</span>
              <span class="sm:hidden">Datos</span>
            </button>
            <button 
              (click)="onTabChange('messages')"
              [class]="'flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all ' + (activeTab === 'messages' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' : 'text-gray-600 hover:bg-gray-50')"
            >
              <lucide-icon [img]="messageSquareIcon" class="w-4 h-4"></lucide-icon>
              <span class="hidden sm:inline">Mensajería</span>
              <span class="sm:hidden">Mensajes</span>
            </button>
          </div>

          <!-- TAB 1: Cambiar contraseña -->
          <div *ngIf="activeTab === 'password'" class="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div class="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
              <div class="flex items-center gap-3">
                <div class="bg-blue-600 text-white p-2 rounded-lg">
                  <lucide-icon [img]="keyRoundIcon" class="w-5 h-5"></lucide-icon>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">Cambiar contraseña</h2>
                  <p class="text-gray-600">Mínimo 12 caracteres con 3 tipos de caracteres según <strong>NIST 800-63B</strong></p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" class="space-y-6">
                <!-- Error/Success Messages -->
                <div *ngIf="passwordError" class="border border-red-200 bg-red-50 rounded-lg p-4">
                  <div class="flex items-start gap-3">
                    <lucide-icon [img]="alertCircleIcon" class="h-5 w-5 text-red-600 mt-0.5"></lucide-icon>
                    <div class="text-red-900">{{ passwordError }}</div>
                  </div>
                </div>

                <div *ngIf="passwordSuccess" class="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div class="flex items-start gap-3">
                    <lucide-icon [img]="checkCircle2Icon" class="h-5 w-5 text-green-600 mt-0.5"></lucide-icon>
                    <div class="text-green-900">
                      <strong>¡Contraseña actualizada!</strong> Tus sesiones se cerrarán en todos los dispositivos.
                    </div>
                  </div>
                </div>

                <!-- Current Password -->
                <div class="space-y-2">
                  <label for="current-password" class="block text-sm font-medium text-gray-700">Contraseña actual</label>
                  <div class="relative">
                    <input
                      id="current-password"
                      [type]="showCurrentPassword ? 'text' : 'password'"
                      formControlName="currentPassword"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      required
                    />
                    <button
                      type="button"
                      (click)="showCurrentPassword = !showCurrentPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <lucide-icon [img]="showCurrentPassword ? eyeOffIcon : eyeIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </div>

                <hr class="border-gray-200">

                <!-- New Password -->
                <div class="space-y-2">
                  <label for="new-password" class="block text-sm font-medium text-gray-700">Nueva contraseña</label>
                  <div class="relative">
                    <input
                      id="new-password"
                      [type]="showNewPassword ? 'text' : 'password'"
                      formControlName="newPassword"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      placeholder="Mínimo 12 caracteres"
                      required
                    />
                    <button
                      type="button"
                      (click)="showNewPassword = !showNewPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <lucide-icon [img]="showNewPassword ? eyeOffIcon : eyeIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>

                  <!-- Password Strength Indicator -->
                  <div *ngIf="passwordForm.get('newPassword')?.value" class="space-y-1">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-gray-500">Fortaleza</span>
                      <span [class]="'font-medium ' + getPasswordStrengthClass()">
                        {{ getPasswordStrengthLabel() }}
                      </span>
                    </div>
                    <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        [class]="'h-full transition-all ' + getPasswordStrengthColor()"
                        [style.width.%]="getPasswordStrength()"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- Confirm Password -->
                <div class="space-y-2">
                  <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirmar nueva contraseña</label>
                  <div class="relative">
                    <input
                      id="confirm-password"
                      [type]="showConfirmPassword ? 'text' : 'password'"
                      formControlName="confirmPassword"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      placeholder="Repite tu nueva contraseña"
                      required
                    />
                    <button
                      type="button"
                      (click)="showConfirmPassword = !showConfirmPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <lucide-icon [img]="showConfirmPassword ? eyeOffIcon : eyeIcon" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </div>

                <!-- Security Requirements -->
                <div class="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-5 space-y-3">
                  <div class="flex items-center gap-2 mb-2">
                    <lucide-icon [img]="shieldIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
                    <p class="text-sm font-medium text-blue-900">Requisitos de seguridad:</p>
                  </div>
                  <ul class="text-sm space-y-2">
                    <li class="flex items-start gap-2">
                      <lucide-icon 
                        [img]="checkCircle2Icon" 
                        [class]="'w-4 h-4 mt-0.5 flex-shrink-0 transition-colors ' + (isPasswordLengthValid() ? 'text-green-600' : 'text-gray-400')"
                      ></lucide-icon>
                      <span [class]="isPasswordLengthValid() ? 'text-green-600 font-medium' : 'text-gray-500'">
                        Mínimo 12 caracteres
                      </span>
                    </li>
                    <li class="flex items-start gap-2">
                      <lucide-icon 
                        [img]="checkCircle2Icon" 
                        [class]="'w-4 h-4 mt-0.5 flex-shrink-0 transition-colors ' + (isPasswordComplexityValid() ? 'text-green-600' : 'text-gray-400')"
                      ></lucide-icon>
                      <span [class]="isPasswordComplexityValid() ? 'text-green-600 font-medium' : 'text-gray-500'">
                        Incluir mayúsculas, minúsculas y números
                      </span>
                    </li>
                    <li class="flex items-start gap-2">
                      <lucide-icon 
                        [img]="checkCircle2Icon" 
                        [class]="'w-4 h-4 mt-0.5 flex-shrink-0 transition-colors ' + (isPasswordSymbolValid() ? 'text-green-600' : 'text-gray-400')"
                      ></lucide-icon>
                      <span [class]="isPasswordSymbolValid() ? 'text-green-600 font-medium' : 'text-gray-500'">
                        Al menos un símbolo especial (!&#64;#$%^&*)
                      </span>
                    </li>
                  </ul>
                </div>

                <!-- Security Alert -->
                <div class="border border-gray-200 bg-gray-50 rounded-lg p-4">
                  <div class="flex items-start gap-3">
                    <lucide-icon [img]="shieldIcon" class="h-5 w-5 text-gray-600 mt-0.5"></lucide-icon>
                    <div class="text-gray-700 text-sm">
                      Por seguridad, al cambiar tu contraseña se cerrarán todas tus sesiones activas en todos los dispositivos.
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  [disabled]="passwordForm.invalid || isPasswordLoading"
                  class="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div *ngIf="isPasswordLoading" class="flex items-center justify-center gap-2">
                    <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Actualizando contraseña...
                  </div>
                  <div *ngIf="!isPasswordLoading" class="flex items-center justify-center gap-2">
                    <lucide-icon [img]="checkCircle2Icon" class="w-5 h-5"></lucide-icon>
                    Cambiar contraseña
                  </div>
                </button>
              </form>
            </div>
          </div>

          <!-- TAB 2: Actualizar datos -->
          <div *ngIf="activeTab === 'profile'" class="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div class="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6">
              <div class="flex items-center gap-3">
                <div class="bg-purple-600 text-white p-2 rounded-lg">
                  <lucide-icon [img]="userIcon" class="w-5 h-5"></lucide-icon>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">Actualizar datos personales</h2>
                  <p class="text-gray-600">Modifica tu información de contacto. Los cambios requieren <strong>autenticación adicional</strong> por seguridad.</p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()" class="space-y-6">
                <!-- Security Alert -->
                <div class="border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4">
                  <div class="flex items-start gap-3">
                    <lucide-icon [img]="lockIcon" class="h-5 w-5 text-orange-600 mt-0.5"></lucide-icon>
                    <div class="text-orange-900">
                      <strong>Autenticación requerida:</strong> Por tratarse de datos sensibles, necesitarás confirmar con tu contraseña o firma digital.
                    </div>
                  </div>
                </div>

                <!-- Email -->
                <div class="space-y-2">
                  <label for="email" class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <lucide-icon [img]="mailIcon" class="w-4 h-4"></lucide-icon>
                    Correo electrónico *
                  </label>
                  <input
                    id="email"
                    type="email"
                    formControlName="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p class="text-xs text-gray-500">
                    Se enviará un código de verificación al nuevo correo
                  </p>
                </div>

                <!-- Phone -->
                <div class="space-y-2">
                  <label for="phone" class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <lucide-icon [img]="phoneIcon" class="w-4 h-4"></lucide-icon>
                    Teléfono *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    formControlName="phone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+506 1234-5678"
                    required
                  />
                </div>

                <!-- Address -->
                <div class="space-y-2">
                  <label for="address" class="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <lucide-icon [img]="mapPinIcon" class="w-4 h-4"></lucide-icon>
                    Dirección
                  </label>
                  <textarea
                    id="address"
                    formControlName="address"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                <!-- Audit Info -->
                <div class="border border-gray-200 bg-gray-50 rounded-lg p-4">
                  <div class="flex items-start gap-3">
                    <lucide-icon [img]="infoIcon" class="h-5 w-5 text-gray-600 mt-0.5"></lucide-icon>
                    <div class="text-gray-700 text-sm">
                      Todos los cambios quedan registrados en el log de auditoría según normativa HIPAA y FDA 21 CFR Part 11.
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  [disabled]="profileForm.invalid || isProfileLoading"
                  class="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div *ngIf="!isProfileLoading" class="flex items-center justify-center gap-2">
                    <lucide-icon [img]="checkCircle2Icon" class="w-5 h-5"></lucide-icon>
                    Guardar cambios
                  </div>
                  <div *ngIf="isProfileLoading" class="flex items-center justify-center gap-2">
                    <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Guardando...
                  </div>
                </button>
              </form>
            </div>
          </div>

          <!-- TAB 3: Mensajería -->
          <div *ngIf="activeTab === 'messages'" class="space-y-6">
            <!-- Stats cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="bg-gradient-to-br from-blue-50 to-cyan-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">Conversaciones</p>
                    <p class="text-3xl font-semibold text-blue-600">{{ messagingStats.totalConversations }}</p>
                  </div>
                  <div class="bg-blue-600 text-white p-3 rounded-xl">
                    <lucide-icon [img]="messageCircleIcon" class="w-6 h-6"></lucide-icon>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-green-50 to-emerald-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">Activas</p>
                    <p class="text-3xl font-semibold text-green-600">{{ messagingStats.activeConversations }}</p>
                  </div>
                  <div class="bg-green-600 text-white p-3 rounded-xl">
                    <lucide-icon [img]="checkCheckIcon" class="w-6 h-6"></lucide-icon>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-orange-50 to-amber-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">Sin leer</p>
                    <p class="text-3xl font-semibold text-orange-600">{{ messagingStats.unreadMessages }}</p>
                  </div>
                  <div class="bg-orange-600 text-white p-3 rounded-xl">
                    <lucide-icon [img]="alertCircleIcon" class="w-6 h-6"></lucide-icon>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-slate-50 to-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-600">Borradores</p>
                    <p class="text-3xl font-semibold text-slate-700">{{ messagingStats.draftMessages }}</p>
                  </div>
                  <div class="bg-slate-600 text-white p-3 rounded-xl">
                    <lucide-icon [img]="fileTextIcon" class="w-6 h-6"></lucide-icon>
                  </div>
                </div>
              </div>
            </div>

            <!-- Vista de lista de conversaciones -->
            <div *ngIf="messagingView === 'list'" class="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div class="border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="bg-emerald-600 text-white p-2 rounded-lg">
                      <lucide-icon [img]="messageSquareIcon" class="w-5 h-5"></lucide-icon>
                    </div>
                    <div>
                      <h2 class="text-xl font-semibold text-gray-900">Mis conversaciones</h2>
                      <p class="text-gray-600">Comunicación <strong>segura y cifrada</strong> con la administración</p>
                    </div>
                  </div>
                  <button 
                    (click)="createNewMessage()"
                    class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                  >
                    <lucide-icon [img]="sendIcon" class="w-4 h-4"></lucide-icon>
                    Nuevo mensaje
                  </button>
                </div>

                <!-- Tabs de filtro -->
                <div class="flex gap-1 bg-white rounded-lg p-1 border border-gray-200">
                  <button 
                    (click)="setMessageFilter('all')"
                    [class]="'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ' + (messageFilter === 'all' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50')"
                  >
                    Todas
                    <span [class]="'text-xs px-2 py-1 rounded-full ' + (messageFilter === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700')">
                      {{ getFilteredConversationsCount('all') }}
                    </span>
                  </button>
                  <button 
                    (click)="setMessageFilter('active')"
                    [class]="'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ' + (messageFilter === 'active' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50')"
                  >
                    Activas
                    <span [class]="'text-xs px-2 py-1 rounded-full ' + (messageFilter === 'active' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700')">
                      {{ getFilteredConversationsCount('active') }}
                    </span>
                  </button>
                  <button 
                    (click)="setMessageFilter('closed')"
                    [class]="'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ' + (messageFilter === 'closed' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50')"
                  >
                    Cerradas
                    <span [class]="'text-xs px-2 py-1 rounded-full ' + (messageFilter === 'closed' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700')">
                      {{ getFilteredConversationsCount('closed') }}
                    </span>
                  </button>
                </div>
              </div>
              
              <div class="p-6">
                <!-- Lista de conversaciones -->
                <div *ngIf="filteredConversations.length > 0; else noConversations" class="space-y-4">
                  <div 
                    *ngFor="let conversation of filteredConversations" 
                    class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    (click)="openConversation(conversation)"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                          <h3 class="font-medium text-gray-900">{{ conversation.subject }}</h3>
                          <span 
                            [class]="'px-2 py-1 rounded-full text-xs font-medium ' + getTopicBadgeClass(conversation.topic)"
                          >
                            {{ conversation.topic.label }}
                          </span>
                          <span 
                            *ngIf="conversation.unreadCount > 0"
                            class="bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                          >
                            {{ conversation.unreadCount }}
                          </span>
                        </div>
                        <p class="text-sm text-gray-600 mb-2">
                          {{ conversation.lastMessage?.content | slice:0:100 }}{{ (conversation.lastMessage?.content?.length || 0) > 100 ? '...' : '' }}
                        </p>
                        <div class="flex items-center gap-4 text-xs text-gray-500">
                          <span>{{ conversation.updatedAt | date:'short' }}</span>
                          <span [class]="'px-2 py-1 rounded-full ' + getStatusBadgeClass(conversation.status)">
                            {{ getStatusLabel(conversation.status) }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <lucide-icon [img]="chevronRightIcon" class="w-5 h-5 text-gray-400"></lucide-icon>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Estado vacío -->
                <ng-template #noConversations>
                  <div class="text-center py-12">
                    <lucide-icon [img]="messageSquareIcon" class="w-16 h-16 text-gray-400 mx-auto mb-4"></lucide-icon>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">
                      {{ getEmptyStateTitle() }}
                    </h3>
                    <p class="text-gray-600 mb-6">
                      {{ getEmptyStateMessage() }}
                    </p>
                    <button 
                      *ngIf="messageFilter === 'all' || messageFilter === 'active'"
                      (click)="createNewMessage()"
                      class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg transition-all inline-flex items-center gap-2"
                    >
                      <lucide-icon [img]="sendIcon" class="w-4 h-4"></lucide-icon>
                      Enviar primer mensaje
                    </button>
                  </div>
                </ng-template>
              </div>
            </div>

            <!-- Vista de nuevo mensaje -->
            <div *ngIf="messagingView === 'new'" class="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div class="border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6">
                <div class="flex items-center gap-4">
                  <button 
                    (click)="backToMessagesList()"
                    class="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <lucide-icon [img]="arrowLeftIcon" class="w-4 h-4"></lucide-icon>
                    Volver
                  </button>
                  <div>
                    <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <lucide-icon [img]="sendIcon" class="w-5 h-5"></lucide-icon>
                      Nuevo mensaje
                    </h2>
                    <p class="text-gray-600">Envía un mensaje <strong>seguro y cifrado</strong> a la administración</p>
                  </div>
                </div>
              </div>
              
              <div class="p-6">
                <form [formGroup]="newMessageForm" class="space-y-6">
                  <!-- Tópico -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Tópico</label>
                    <select 
                      formControlName="topic"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option *ngFor="let topic of messageTopics" [value]="topic.value">
                        {{ topic.label }} - {{ topic.description }}
                      </option>
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
                      placeholder="Título del mensaje"
                    />
                  </div>

                  <!-- Contenido -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">Mensaje *</label>
                    <textarea
                      formControlName="content"
                      rows="8"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Escribe tu mensaje..."
                    ></textarea>
                  </div>

                  <!-- Botones -->
                  <div class="flex gap-3">
                    <button
                      type="button"
                      (click)="sendMessage('draft')"
                      [disabled]="isMessageLoading"
                      class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <lucide-icon [img]="saveIcon" class="w-4 h-4"></lucide-icon>
                      Guardar borrador
                    </button>
                    <button
                      type="button"
                      (click)="sendMessage('sent')"
                      [disabled]="isMessageLoading"
                      class="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <div *ngIf="isMessageLoading" class="flex items-center gap-2">
                        <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Enviando mensaje...
                      </div>
                      <div *ngIf="!isMessageLoading" class="flex items-center gap-2">
                        <lucide-icon [img]="sendIcon" class="w-5 h-5"></lucide-icon>
                        Enviar mensaje
                      </div>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Vista de conversación -->
            <div *ngIf="messagingView === 'conversation'" class="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div class="border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50 p-6">
                <div class="flex items-center gap-4">
                  <button 
                    (click)="backToMessagesList()"
                    class="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <lucide-icon [img]="arrowLeftIcon" class="w-4 h-4"></lucide-icon>
                    Volver
                  </button>
                  <div class="flex-1">
                    <h2 class="text-xl font-semibold text-gray-900">{{ selectedConversation?.subject }}</h2>
                    <div class="flex items-center gap-2 text-gray-600">
                      <span>{{ conversationMessages.length }} mensaje{{ conversationMessages.length !== 1 ? 's' : '' }}</span>
                      <span>·</span>
                      <span 
                        [class]="'px-2 py-1 rounded-full text-xs font-medium ' + getStatusBadgeClass(selectedConversation?.status || '')"
                      >
                        {{ getStatusLabel(selectedConversation?.status || '') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="p-6 space-y-6">
                <!-- Mensajes -->
                <div class="space-y-4 max-h-[500px] overflow-y-auto">
                  <div 
                    *ngFor="let message of conversationMessages" 
                    [class]="'border rounded-lg p-4 ' + (message.fromUserId === 'user-001' ? 'bg-blue-50 border-blue-200 ml-8' : 'bg-gray-50 border-gray-200 mr-8')"
                  >
                    <div class="flex items-start justify-between mb-2">
                      <div>
                        <p class="font-medium">{{ message.fromUserName }}</p>
                        <p class="text-xs text-gray-500">
                          {{ message.createdAt | date:'dd/MM/yyyy HH:mm' }}
                        </p>
                      </div>
                      <span 
                        [class]="'px-2 py-1 rounded-full text-xs font-medium ' + (message.fromUserId === 'user-001' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800')"
                      >
                        {{ message.fromUserId === 'user-001' ? 'Tú' : 'Admin' }}
                      </span>
                    </div>
                    <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
                  </div>

                  <!-- Estado vacío de mensajes -->
                  <div *ngIf="conversationMessages.length === 0" class="text-center py-8">
                    <lucide-icon [img]="messageSquareIcon" class="w-12 h-12 text-gray-400 mx-auto mb-4"></lucide-icon>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No hay mensajes</h3>
                    <p class="text-gray-600">Esta conversación aún no tiene mensajes</p>
                  </div>
                </div>

                <!-- Responder -->
                <div *ngIf="selectedConversation?.status === 'active'" class="space-y-4 border-t border-gray-200 pt-6">
                  <h3 class="font-medium text-gray-900">Responder</h3>
                  <form [formGroup]="replyForm" (ngSubmit)="sendReply()" class="space-y-4">
                    <textarea
                      formControlName="content"
                      rows="4"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Escribe tu respuesta..."
                    ></textarea>
                    
                    <button
                      type="submit"
                      [disabled]="replyForm.invalid || isReplyLoading"
                      class="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <div *ngIf="isReplyLoading" class="flex items-center gap-2">
                        <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Enviando...
                      </div>
                      <div *ngIf="!isReplyLoading" class="flex items-center gap-2">
                        <lucide-icon [img]="sendIcon" class="w-4 h-4"></lucide-icon>
                        Enviar respuesta
                      </div>
                    </button>
                  </form>
                </div>

                <!-- Conversación cerrada -->
                <div *ngIf="selectedConversation?.status !== 'active'" class="border-t border-gray-200 pt-6">
                  <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <lucide-icon [img]="lockIcon" class="w-8 h-8 text-gray-400 mx-auto mb-2"></lucide-icon>
                    <p class="text-gray-600 font-medium">Conversación cerrada</p>
                    <p class="text-sm text-gray-500">No se pueden enviar más mensajes en esta conversación</p>
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
export class AutoservicioComponent implements OnInit, OnDestroy {
  // Breadcrumbs
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Autoservicio', route: '/autoservicio' }
  ];

  // Tab state
  activeTab: 'password' | 'profile' | 'messages' = 'password';

  // Forms
  passwordForm!: FormGroup;
  profileForm!: FormGroup;

  // Password visibility
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  // Loading states
  isPasswordLoading = false;
  isProfileLoading = false;

  // Error/Success states
  passwordError: string | null = null;
  passwordSuccess = false;

  // Messaging stats
  messagingStats: MessagingStats = {
    totalConversations: 0,
    activeConversations: 0,
    unreadMessages: 0,
    draftMessages: 0
  };

  // Messaging data
  conversations: Conversation[] = [];
  messages: Message[] = [];
  
  // Messaging view state
  messagingView: 'list' | 'new' | 'conversation' = 'list';
  selectedConversation: Conversation | null = null;
  
  // Messaging filter state
  messageFilter: 'all' | 'active' | 'closed' = 'all';
  filteredConversations: Conversation[] = [];
  
  // New message form
  newMessageForm!: FormGroup;
  messageTopics: MessageTopic[] = [];
  isMessageLoading = false;
  
  // Conversation view
  conversationMessages: Message[] = [];
  replyForm!: FormGroup;
  isReplyLoading = false;

  // Icons
  userCogIcon = UserCog;
  keyRoundIcon = KeyRound;
  userIcon = User;
  messageSquareIcon = MessageSquare;
  shieldIcon = Shield;
  checkCircle2Icon = CheckCircle2;
  alertCircleIcon = AlertCircle;
  eyeIcon = Eye;
  eyeOffIcon = EyeOff;
  mailIcon = Mail;
  phoneIcon = Phone;
  mapPinIcon = MapPin;
  sendIcon = Send;
  saveIcon = Save;
  clockIcon = Clock;
  messageCircleIcon = MessageCircle;
  fileTextIcon = FileText;
  checkCheckIcon = CheckCheck;
  alertTriangleIcon = AlertTriangle;
  infoIcon = Info;
  lockIcon = Lock;
  arrowLeftIcon = ArrowLeft;
  refreshCwIcon = RefreshCw;
  chevronRightIcon = ChevronRight;
  helpCircleIcon = HelpCircle;

  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private autoservicioService: AutoservicioService,
    private notificationService: NotificationService
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    this.loadUserProfile();
    this.loadMessagingData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private initializeForms() {
    // Password form
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(12)]],
      confirmPassword: ['', [Validators.required]]
    });

    // Profile form
    this.profileForm = this.fb.group({
      email: ['dr.martinez@hospital.cr', [Validators.required, Validators.email]],
      phone: ['+506 8888-7777', [Validators.required]],
      address: ['San José, Costa Rica']
    });

    // New message form
    this.newMessageForm = this.fb.group({
      topic: ['consulta-general', [Validators.required]],
      subject: ['', [Validators.required]],
      content: ['', [Validators.required]],
      priority: ['normal', [Validators.required]]
    });

    // Reply form
    this.replyForm = this.fb.group({
      content: ['', [Validators.required]]
    });
  }

  private loadUserProfile() {
    // Simular carga de datos del usuario
    // En producción, esto vendría del servicio
  }

  private loadMessagingData() {
    const userId = 'user-001'; // En producción, obtener del contexto de usuario actual
    
    // Cargar tópicos de mensajes
    this.messageTopics = this.autoservicioService.getMessageTopics();
    
    // Cargar estadísticas de mensajería
    this.messagingStats = this.autoservicioService.getMessagingStats(userId);
    
    // Cargar conversaciones
    this.subscription.add(
      this.autoservicioService.getConversations(userId).subscribe(conversations => {
        this.conversations = conversations;
        this.filterConversations();
      })
    );
    
    // Cargar mensajes
    this.subscription.add(
      this.autoservicioService.messages$.subscribe(messages => {
        this.messages = messages;
      })
    );
  }

  // Método para recargar datos cuando se cambia a la pestaña de mensajería
  onTabChange(tab: 'password' | 'profile' | 'messages') {
    this.activeTab = tab;
    if (tab === 'messages') {
      // Recargar datos de mensajería desde localStorage para obtener los últimos cambios
      this.autoservicioService.reloadMessagingData();
      this.loadMessagingData();
    }
  }

  // Password methods
  onChangePassword() {
    if (this.passwordForm.invalid) {
      return;
    }

    this.passwordError = null;
    this.passwordSuccess = false;

    const formValue = this.passwordForm.value;

    // Validations
    if (formValue.newPassword !== formValue.confirmPassword) {
      this.passwordError = 'Las contraseñas no coinciden';
      return;
    }

    if (formValue.currentPassword === formValue.newPassword) {
      this.passwordError = 'La nueva contraseña debe ser diferente a la actual';
      return;
    }

    if (!this.isPasswordValid(formValue.newPassword)) {
      this.passwordError = 'La contraseña no cumple con los requisitos de seguridad';
      return;
    }

    this.isPasswordLoading = true;

    // Simular cambio de contraseña
    setTimeout(() => {
      this.isPasswordLoading = false;
      this.passwordSuccess = true;
      this.passwordForm.reset();
      
      this.notificationService.showSuccess(
        'Contraseña actualizada exitosamente',
        'Por seguridad, se cerrarán todas tus sesiones activas. Cambio registrado en auditoría.'
      );

      // Reset success after 3 seconds
      setTimeout(() => {
        this.passwordSuccess = false;
      }, 3000);
    }, 1500);
  }

  onUpdateProfile() {
    if (this.profileForm.invalid) {
      return;
    }

    this.isProfileLoading = true;

    // Simular actualización de perfil
    setTimeout(() => {
      this.isProfileLoading = false;
      
      this.notificationService.showSuccess(
        'Datos actualizados correctamente',
        'Los cambios han sido registrados en auditoría según normativa HIPAA.'
      );
    }, 1500);
  }

  // Password validation methods
  getPasswordStrength(): number {
    const password = this.passwordForm.get('newPassword')?.value || '';
    let strength = 0;

    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
    if (password.length >= 16) strength += 10;

    return Math.min(strength, 100);
  }

  getPasswordStrengthLabel(): string {
    const strength = this.getPasswordStrength();
    if (strength < 50) return 'Débil';
    if (strength < 70) return 'Media';
    if (strength < 90) return 'Fuerte';
    return 'Muy fuerte';
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength < 50) return 'text-red-600';
    if (strength < 70) return 'text-orange-600';
    if (strength < 90) return 'text-blue-600';
    return 'text-green-600';
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    if (strength < 50) return 'bg-red-500';
    if (strength < 70) return 'bg-orange-500';
    if (strength < 90) return 'bg-blue-500';
    return 'bg-green-500';
  }

  isPasswordLengthValid(): boolean {
    const password = this.passwordForm.get('newPassword')?.value || '';
    return password.length >= 12;
  }

  isPasswordComplexityValid(): boolean {
    const password = this.passwordForm.get('newPassword')?.value || '';
    return /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password);
  }

  isPasswordSymbolValid(): boolean {
    const password = this.passwordForm.get('newPassword')?.value || '';
    return /[^a-zA-Z0-9]/.test(password);
  }

  private isPasswordValid(password: string): boolean {
    return this.isPasswordLengthValid() && 
           this.isPasswordComplexityValid() && 
           this.isPasswordSymbolValid();
  }

  // Messaging methods
  createNewMessage() {
    this.messagingView = 'new';
    this.newMessageForm.reset({
      topic: 'consulta-general',
      subject: '',
      content: '',
      priority: 'normal'
    });
  }

  openConversation(conversation: Conversation) {
    this.selectedConversation = conversation;
    this.messagingView = 'conversation';
    this.loadConversationMessages(conversation.id);
  }

  loadConversationMessages(conversationId: string) {
    this.subscription.add(
      this.autoservicioService.getConversationMessages(conversationId).subscribe(messages => {
        this.conversationMessages = messages;
      })
    );
  }

  backToMessagesList() {
    this.messagingView = 'list';
    this.selectedConversation = null;
    this.conversationMessages = [];
    this.replyForm.reset();
  }

  async sendMessage(status: 'draft' | 'sent') {
    if (this.newMessageForm.invalid) {
      this.notificationService.showValidationError('Por favor completa todos los campos requeridos');
      return;
    }

    const formValue = this.newMessageForm.value;
    if (!formValue.subject.trim() || !formValue.content.trim()) {
      this.notificationService.showValidationError('El asunto y el contenido son obligatorios');
      return;
    }

    this.isMessageLoading = true;

    try {
      const userId = 'user-001';
      const topic = this.messageTopics.find(t => t.value === formValue.topic);
      
      await this.autoservicioService.sendMessage({
        topic: topic!,
        subject: formValue.subject,
        content: formValue.content,
        fromUserId: userId,
        fromUserName: 'Dr. Juan Pérez',
        priority: formValue.priority,
        status: status
      }).toPromise();

      const message = status === 'draft' ? 'Borrador guardado' : 'Mensaje enviado';
      this.notificationService.showSuccess(message);
      
      // Recargar datos y volver a la lista
      this.loadMessagingData();
      this.backToMessagesList();
      
    } catch (error) {
      this.notificationService.showError('Error al enviar mensaje');
    } finally {
      this.isMessageLoading = false;
    }
  }

  async sendReply() {
    if (this.replyForm.invalid || !this.selectedConversation) {
      return;
    }

    const replyContent = this.replyForm.get('content')?.value;
    if (!replyContent.trim()) {
      this.notificationService.showValidationError('El contenido de la respuesta es obligatorio');
      return;
    }

    this.isReplyLoading = true;

    try {
      const userId = 'user-001';
      
      await this.autoservicioService.sendMessage({
        topic: this.selectedConversation.topic,
        subject: `Re: ${this.selectedConversation.subject}`,
        content: replyContent,
        fromUserId: userId,
        fromUserName: 'Dr. Juan Pérez',
        priority: 'normal',
        status: 'sent',
        conversationId: this.selectedConversation.id
      }).toPromise();

      this.notificationService.showSuccess('Respuesta enviada correctamente');
      
      // Recargar mensajes de la conversación
      this.loadConversationMessages(this.selectedConversation.id);
      this.replyForm.reset();
      
    } catch (error) {
      this.notificationService.showError('Error al enviar respuesta');
    } finally {
      this.isReplyLoading = false;
    }
  }

  getTopicBadgeClass(topic: MessageTopic): string {
    const topicClasses: Record<string, string> = {
      'consulta-general': 'bg-blue-100 text-blue-800',
      'soporte-tecnico': 'bg-red-100 text-red-800',
      'solicitud-permisos': 'bg-yellow-100 text-yellow-800',
      'reporte-problema': 'bg-orange-100 text-orange-800',
      'sugerencia-mejora': 'bg-green-100 text-green-800'
    };
    return topicClasses[topic.value] || 'bg-gray-100 text-gray-800';
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: Record<string, string> = {
      'active': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800',
      'archived': 'bg-yellow-100 text-yellow-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const statusLabels: Record<string, string> = {
      'active': 'Activa',
      'closed': 'Cerrada',
      'archived': 'Archivada'
    };
    return statusLabels[status] || status;
  }

  // Messaging filter methods
  setMessageFilter(filter: 'all' | 'active' | 'closed') {
    this.messageFilter = filter;
    this.filterConversations();
  }

  filterConversations() {
    switch (this.messageFilter) {
      case 'active':
        this.filteredConversations = this.conversations.filter(c => c.status === 'active');
        break;
      case 'closed':
        this.filteredConversations = this.conversations.filter(c => c.status === 'closed' || c.status === 'archived');
        break;
      default:
        this.filteredConversations = this.conversations;
        break;
    }
  }

  getFilteredConversationsCount(filter: 'all' | 'active' | 'closed'): number {
    switch (filter) {
      case 'active':
        return this.conversations.filter(c => c.status === 'active').length;
      case 'closed':
        return this.conversations.filter(c => c.status === 'closed' || c.status === 'archived').length;
      default:
        return this.conversations.length;
    }
  }

  getEmptyStateTitle(): string {
    switch (this.messageFilter) {
      case 'active':
        return 'No hay conversaciones activas';
      case 'closed':
        return 'No hay conversaciones cerradas';
      default:
        return 'No hay conversaciones';
    }
  }

  getEmptyStateMessage(): string {
    switch (this.messageFilter) {
      case 'active':
        return 'No tienes conversaciones activas en este momento';
      case 'closed':
        return 'No tienes conversaciones cerradas o archivadas';
      default:
        return 'Aún no tienes conversaciones con la administración';
    }
  }
}