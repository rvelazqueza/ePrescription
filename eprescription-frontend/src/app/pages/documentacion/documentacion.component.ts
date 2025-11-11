import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';
import { BreadcrumbItem } from '../../components/breadcrumbs/breadcrumbs.component';
import {
    LucideAngularModule,
    BookOpen,
    FileText,
    Download,
    Eye,
    Info,
    ExternalLink,
    Clock,
    Calendar,
    CheckCircle,
    AlertCircle,
    Copy
} from 'lucide-angular';

@Component({
    selector: 'app-documentacion',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        PageLayoutComponent,
        LucideAngularModule
    ],
    template: `
    <app-page-layout 
      [title]="pageTitle"
      [description]="pageDescription"
      [icon]="BookOpen"
      [breadcrumbItems]="breadcrumbItems"
      [headerGradient]="'from-blue-600 to-indigo-700'"
    >

      <!-- Tabs de documentos -->
      <div class="w-full">
        <div class="flex border-b border-gray-200">
          <button 
            *ngFor="let tab of tabs" 
            (click)="selectTab(tab.id)"
            [class]="'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ' + 
                    (activeTab === tab.id 
                      ? 'text-blue-600 border-blue-600' 
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300')"
          >
            <lucide-icon [img]="tab.icon" class="w-4 h-4"></lucide-icon>
            {{ tab.title }}
          </button>
        </div>

        <!-- Tab Content -->
        <div class="mt-6">
          
          <!-- Tab 0: Manuales de Usuario -->
          <div *ngIf="activeTab === 'user-manuals'" class="space-y-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg">
              <div class="bg-blue-100/50 p-6 rounded-t-lg">
                <h2 class="flex items-center gap-2 text-xl font-semibold">
                  <lucide-icon [img]="BookOpen" class="w-5 h-5 text-blue-600"></lucide-icon>
                  Manuales de Usuario - Sistema ePrescription
                </h2>
                <p class="text-gray-600 mt-2">
                  Documentación completa organizada por módulos para usuarios finales.
                  Incluye guías paso a paso, casos de uso prácticos y mejores prácticas.
                </p>
              </div>
              <div class="p-6 space-y-4">
                <!-- Índice General -->
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-medium flex items-center gap-2">
                      📚 Índice General
                    </h3>
                    <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded border border-green-200">Inicio aquí</span>
                  </div>
                  <p class="text-sm mb-4">
                    Documento maestro con navegación completa a todos los módulos del sistema.
                    Ideal para nuevos usuarios.
                  </p>
                  <div class="flex gap-2">
                    <button 
                      (click)="openGeneralIndex()"
                      class="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                    >
                      <lucide-icon [img]="ExternalLink" class="w-4 h-4"></lucide-icon>
                      Abrir Índice General
                    </button>
                    <button 
                      (click)="downloadDocument('general-index')"
                      class="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-sm rounded hover:bg-gray-50 transition-colors"
                    >
                      <lucide-icon [img]="Download" class="w-4 h-4"></lucide-icon>
                      Descargar
                    </button>
                  </div>
                </div>

                <!-- Manuales por Módulo -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div *ngFor="let module of modules" class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="text-base font-medium flex items-center gap-2">
                        {{ module.emoji }} {{ module.title }}
                      </h4>
                      <span [class]="'text-xs px-2 py-1 rounded border ' + module.badgeClass">{{ module.status }}</span>
                    </div>
                    <p class="text-sm text-gray-600 mb-3">{{ module.description }}</p>
                    <button 
                      (click)="downloadModuleManual(module.id)"
                      [disabled]="!module.available"
                      [class]="'flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors w-full justify-center ' + 
                              (module.available 
                                ? 'bg-white border border-gray-300 hover:bg-gray-50' 
                                : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed')"
                    >
                      <lucide-icon [img]="FileText" class="w-4 h-4"></lucide-icon>
                      {{ module.available ? 'Descargar Manual' : 'En desarrollo' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 1: Manual de Login -->
          <div *ngIf="activeTab === 'login-manual'" class="space-y-6">
            <div class="bg-green-50 border border-green-200 rounded-lg">
              <div class="bg-green-100/50 p-6 rounded-t-lg">
                <h2 class="flex items-center gap-2 text-xl font-semibold">
                  <lucide-icon [img]="FileText" class="w-5 h-5 text-green-600"></lucide-icon>
                  Manual de Usuario - Sistema de Autenticación
                </h2>
                <p class="text-gray-600 mt-2">
                  Guía completa para activar y desactivar la pantalla de login.
                  Incluye instrucciones paso a paso, usuarios de prueba y mejores prácticas de seguridad.
                </p>
                <div class="flex gap-2 mt-3">
                  <span class="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">Versión 1.2</span>
                  <span class="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">14 Enero 2025</span>
                  <span class="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200">~10 min lectura</span>
                  <span class="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded border border-orange-200">Manual de Usuario</span>
                </div>
              </div>
              <div class="p-6">
                <div class="w-full">
                  <div class="flex border-b border-gray-200">
                    <button 
                      *ngFor="let subtab of loginSubtabs" 
                      (click)="selectLoginSubtab(subtab.id)"
                      [class]="'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ' + 
                              (activeLoginSubtab === subtab.id 
                                ? 'text-blue-600 border-blue-600' 
                                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300')"
                    >
                      <lucide-icon [img]="subtab.icon" class="w-4 h-4"></lucide-icon>
                      {{ subtab.title }}
                    </button>
                  </div>

                  <!-- Preview -->
                  <div *ngIf="activeLoginSubtab === 'preview'" class="mt-4 space-y-4">
                    <div class="h-[600px] w-full rounded-md border p-6 overflow-auto">
                      <div class="prose prose-sm max-w-none">
                        <pre class="whitespace-pre-wrap font-mono text-sm">{{ manualLoginContent }}</pre>
                      </div>
                    </div>
                  </div>

                  <!-- Metadata -->
                  <div *ngIf="activeLoginSubtab === 'metadata'" class="mt-4 space-y-4">
                    <div class="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 class="text-lg font-medium mb-4">Información del Documento</h3>
                      <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <p class="text-sm text-gray-600">Nombre del archivo</p>
                            <p class="font-mono">MANUAL_LOGIN_AUTENTICACION.md</p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-600">Tamaño</p>
                            <p>{{ (manualLoginContent.length / 1024).toFixed(2) }} KB</p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-600">Formato</p>
                            <p>Markdown (.md)</p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-600">Líneas</p>
                            <p>{{ manualLoginContent.split('\\n').length }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Download -->
                  <div *ngIf="activeLoginSubtab === 'download'" class="mt-4 space-y-4">
                    <div class="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 class="text-lg font-medium mb-2">Opciones de Descarga</h3>
                      <p class="text-gray-600 mb-4">Descarga el manual en el formato que prefieras</p>
                      <div class="space-y-3">
                        <button 
                          (click)="downloadAsMarkdown('login-manual')"
                          class="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <lucide-icon [img]="Download" class="w-4 h-4"></lucide-icon>
                          Descargar como Markdown (.md)
                          <span class="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Recomendado</span>
                        </button>

                        <button 
                          (click)="downloadAsText('login-manual')"
                          class="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <lucide-icon [img]="Download" class="w-4 h-4"></lucide-icon>
                          Descargar como Texto Plano (.txt)
                        </button>

                        <button 
                          (click)="copyToClipboard('login-manual')"
                          class="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <lucide-icon [img]="Copy" class="w-4 h-4"></lucide-icon>
                          Copiar al portapapeles
                        </button>
                      </div>
                    </div>

                    <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 class="text-lg font-medium flex items-center gap-2 mb-4">
                        <lucide-icon [img]="CheckCircle" class="w-5 h-5 text-green-600"></lucide-icon>
                        Inicio Rápido
                      </h3>
                      <p class="text-sm mb-3">
                        <strong>Para desactivar el login ahora mismo:</strong>
                      </p>
                      <ol class="text-sm space-y-2 list-decimal list-inside">
                        <li>Abre el archivo <code class="bg-gray-100 px-1 py-0.5 rounded">/App.tsx</code></li>
                        <li>Busca la línea 23 aproximadamente</li>
                        <li>Cambia <code class="bg-gray-100 px-1 py-0.5 rounded">useState(false)</code> a <code class="bg-green-100 px-1 py-0.5 rounded">useState(true)</code></li>
                        <li>Guarda el archivo</li>
                        <li>Recarga el navegador</li>
                      </ol>
                      <p class="text-sm mt-3 text-gray-600">
                        ✅ ¡Accederás directamente al dashboard sin login!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: Políticas de Roles -->
          <div *ngIf="activeTab === 'roles-policies'" class="space-y-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg">
              <div class="bg-blue-100/50 p-6 rounded-t-lg">
                <h2 class="flex items-center gap-2 text-xl font-semibold">
                  <lucide-icon [img]="FileText" class="w-5 h-5 text-blue-600"></lucide-icon>
                  Políticas de Restricción de Roles Personalizados
                </h2>
                <p class="text-gray-600 mt-2">
                  Documento técnico completo sobre el sistema de roles personalizados,
                  fundamentos legales (HIPAA, FDA, FHIR) y opciones de implementación.
                </p>
                <div class="flex gap-2 mt-3">
                  <span class="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">Versión 1.0</span>
                  <span class="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">2025-10-10</span>
                  <span class="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200">~15 min lectura</span>
                </div>
              </div>
              <div class="p-6">
                <div class="w-full">
                  <div class="flex border-b border-gray-200">
                    <button 
                      *ngFor="let subtab of rolesSubtabs" 
                      (click)="selectRolesSubtab(subtab.id)"
                      [class]="'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ' + 
                              (activeRolesSubtab === subtab.id 
                                ? 'text-blue-600 border-blue-600' 
                                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300')"
                    >
                      <lucide-icon [img]="subtab.icon" class="w-4 h-4"></lucide-icon>
                      {{ subtab.title }}
                    </button>
                  </div>

                  <!-- Preview -->
                  <div *ngIf="activeRolesSubtab === 'preview'" class="mt-4 space-y-4">
                    <div class="h-[600px] w-full rounded-md border p-6 overflow-auto">
                      <div class="prose prose-sm max-w-none">
                        <pre class="whitespace-pre-wrap font-mono text-sm">{{ politicasRolesContent }}</pre>
                      </div>
                    </div>
                  </div>

                  <!-- Metadata -->
                  <div *ngIf="activeRolesSubtab === 'metadata'" class="mt-4 space-y-4">
                    <div class="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 class="text-lg font-medium mb-4">Información del Documento</h3>
                      <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <p class="text-sm text-gray-600">Nombre del archivo</p>
                            <p class="font-mono">POLITICAS_ROLES_PERSONALIZADOS.md</p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-600">Tamaño</p>
                            <p>{{ (politicasRolesContent.length / 1024).toFixed(2) }} KB</p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-600">Formato</p>
                            <p>Markdown (.md)</p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-600">Líneas</p>
                            <p>{{ politicasRolesContent.split('\\n').length }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Download -->
                  <div *ngIf="activeRolesSubtab === 'download'" class="mt-4 space-y-4">
                    <div class="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 class="text-lg font-medium mb-2">Opciones de Descarga</h3>
                      <p class="text-gray-600 mb-4">Descarga el documento en el formato que prefieras</p>
                      <div class="space-y-3">
                        <button 
                          (click)="downloadAsMarkdown('roles-policies')"
                          class="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <lucide-icon [img]="Download" class="w-4 h-4"></lucide-icon>
                          Descargar como Markdown (.md)
                          <span class="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Recomendado</span>
                        </button>

                        <button 
                          (click)="downloadAsText('roles-policies')"
                          class="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <lucide-icon [img]="Download" class="w-4 h-4"></lucide-icon>
                          Descargar como Texto Plano (.txt)
                        </button>

                        <button 
                          (click)="copyToClipboard('roles-policies')"
                          class="w-full flex items-center justify-start gap-2 px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <lucide-icon [img]="Copy" class="w-4 h-4"></lucide-icon>
                          Copiar al portapapeles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </app-page-layout>
    `,
    styleUrls: ['./documentacion.component.css']
})
export class DocumentacionComponent implements OnInit {
    // Icons
    BookOpen = BookOpen;
    FileText = FileText;
    Download = Download;
    Eye = Eye;
    Info = Info;
    ExternalLink = ExternalLink;
    Clock = Clock;
    Calendar = Calendar;
    CheckCircle = CheckCircle;
    AlertCircle = AlertCircle;
    Copy = Copy;

    // Page properties
    pageTitle = 'Centro de Documentación';
    pageDescription = 'Documentación técnica y políticas del sistema ePrescription';

    // Tab management
    activeTab = 'user-manuals';
    activeLoginSubtab = 'preview';
    activeRolesSubtab = 'preview';

    breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Documentación técnica', route: '/documentacion' }
    ];

    tabs = [
        {
            id: 'user-manuals',
            title: 'Manuales de Usuario',
            icon: this.BookOpen
        },
        {
            id: 'login-manual',
            title: 'Manual de Login',
            icon: this.FileText
        },
        {
            id: 'roles-policies',
            title: 'Políticas de Roles',
            icon: this.FileText
        }
    ];

    loginSubtabs = [
        {
            id: 'preview',
            title: 'Vista Previa',
            icon: this.FileText
        },
        {
            id: 'metadata',
            title: 'Información',
            icon: this.CheckCircle
        },
        {
            id: 'download',
            title: 'Descargar',
            icon: this.Download
        }
    ];

    rolesSubtabs = [
        {
            id: 'preview',
            title: 'Vista Previa',
            icon: this.FileText
        },
        {
            id: 'metadata',
            title: 'Información',
            icon: this.CheckCircle
        },
        {
            id: 'download',
            title: 'Descargar',
            icon: this.Download
        }
    ];
    modules = [
        {
            id: 'dashboard',
            title: 'Módulo 1: Dashboard',
            emoji: '📊',
            description: 'Navegación, KPIs, acciones rápidas y selector multi-rol',
            status: 'Todos',
            badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
            available: true
        },
        {
            id: 'prescripciones',
            title: 'Módulo 2: Prescripciones',
            emoji: '💊',
            description: 'Crear recetas, borradores, emisión y gestión completa',
            status: 'Disponible',
            badgeClass: 'bg-green-50 text-green-700 border-green-200',
            available: true
        },
        {
            id: 'dispensacion',
            title: 'Módulo 3: Dispensación',
            emoji: '🏥',
            description: 'Verificar recetas, registrar dispensación y rechazos',
            status: 'Farmacia',
            badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
            available: true
        },
        {
            id: 'pacientes',
            title: 'Módulo 4: Pacientes',
            emoji: '👥',
            description: 'Gestión de pacientes, perfiles y historial médico',
            status: 'Próximamente',
            badgeClass: 'bg-gray-50 text-gray-600 border-gray-200',
            available: false
        },
        {
            id: 'medicos',
            title: 'Módulo 5: Médicos',
            emoji: '👨‍⚕️',
            description: 'Directorio de médicos, estadísticas y gestión',
            status: 'Próximamente',
            badgeClass: 'bg-gray-50 text-gray-600 border-gray-200',
            available: false
        },
        {
            id: 'inventario',
            title: 'Módulo 6: Inventario',
            emoji: '📦',
            description: 'Stock, lotes, vencimientos y farmacias',
            status: 'Próximamente',
            badgeClass: 'bg-gray-50 text-gray-600 border-gray-200',
            available: false
        }
    ];
    // Contenido de los documentos (copiado del archivo React)
    manualLoginContent = `# 🔐 Manual de Usuario - Sistema de Autenticación

## 📖 Guía Rápida: Activar/Desactivar Pantalla de Login

Esta guía explica cómo configurar el sistema ePrescription para acceder directamente al dashboard sin pasar por la pantalla de autenticación, útil para desarrollo y pruebas.

---

## 🎯 Opción 1: Desactivar Login (Acceso Directo)

### ¿Cuándo usar esto?
- Durante desarrollo y pruebas
- Cuando necesitas acceso rápido sin autenticación
- Para demostraciones del sistema
- En entornos de desarrollo local

### Pasos para desactivar el login:

1. **Abrir el archivo App.tsx**
   - Ubicación: \`/App.tsx\`
   - Línea aproximada: 23

2. **Buscar la línea de autenticación:**
   \`\`\`typescript
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   \`\`\`

3. **Cambiar \`false\` por \`true\`:**
   \`\`\`typescript
   const [isAuthenticated, setIsAuthenticated] = useState(true); // ✅ Acceso directo
   \`\`\`

4. **Guardar el archivo**
   - El sistema se recargará automáticamente
   - Accederás directamente al dashboard
   - No se mostrará la pantalla de login

### Resultado:
✅ El sistema iniciará directamente en el dashboard  
✅ No se solicitará usuario ni contraseña  
✅ Tendrás acceso completo a todas las funcionalidades  

⚠️ **Importante:** Esta configuración es SOLO para desarrollo. En producción siempre debe estar en \`false\`.

---

## 👤 Usuarios de Prueba (cuando login está activado)

### Administrador
\`\`\`
Usuario: admin@eprescription.com
Contraseña: admin123
Rol: Administrador del sistema
\`\`\`

### Médico
\`\`\`
Usuario: dr.juanperez@hospital.com
Contraseña: medico123
Rol: Médico prescriptor
\`\`\`

### Farmacéutico
\`\`\`
Usuario: ana.garcia@farmacia.com
Contraseña: farmacia123
Rol: Farmacéutico dispensador
\`\`\`

**Última actualización:** 14 de enero de 2025  
**Autor:** Sistema ePrescription  
**Categoría:** Manual de Usuario  
**Nivel:** Básico  
**Tiempo de lectura:** ~10 minutos`;
    politicasRolesContent = `# 📋 Políticas de Restricción de Roles Personalizados

## 🎯 Resumen Ejecutivo

El sistema ePrescription implementa un **modelo de roles personalizados con asignación específica por usuario**, basado en principios de seguridad de HIPAA, FDA 21 CFR Part 11 y estándares HL7 FHIR.

**Estado actual:**
- ✅ 3 roles personalizados creados
- ⚠️ Problema: Roles NO se muestran al editar otros usuarios
- 🔍 Causa: Filtrado restrictivo basado en \`userId\`

---

## 📊 Roles Personalizados Actuales

### 1. Admin Respaldo TI
\`\`\`typescript
ID: CUSTOM-001
Usuario asignado: USR-0042 (Carlos Rojas Méndez)
Basado en: Administrador (ROLE-001)
Permisos removidos:
  - users.delete (No puede eliminar usuarios)
  - system.restore (No puede restaurar sistema)
Justificación: "Administrador de soporte técnico nivel 2. No requiere 
                acceso a funciones críticas de eliminación"
Estado: Activo, Permanente
\`\`\`

### 2. Médico Jefe ER
\`\`\`typescript
ID: CUSTOM-002
Usuario asignado: USR-0089 (Dra. Ana Vargas Solís)
Basado en: Médico Jefe (ROLE-004)
Permisos agregados:
  - clinical_alerts.override (Puede anular alertas críticas)
Justificación: "Médico jefe de sala de emergencias requiere capacidad 
                de anular alertas en situaciones de vida o muerte"
Estado: Activo, Permanente
Requiere aprobación: SÍ (Aprobado por Director Médico)
\`\`\`

---

## 🚀 Tres Opciones de Implementación

### Opción A: **Mantener Modelo Actual (Exclusivo)**

**Política:** Roles personalizados son SIEMPRE específicos de un usuario.

✅ **Pros:**
- Cumplimiento total de regulaciones
- Máxima seguridad
- No requiere cambios de código

❌ **Contras:**
- Requiere crear rol nuevo para cada usuario
- Más trabajo administrativo

---

**Fecha:** 2025-10-10  
**Versión:** 1.0  
**Autor:** Sistema ePrescription  
**Referencias:** HIPAA, FDA 21 CFR Part 11, HL7 FHIR R4, ISO 27001, NIST 800-53`;

    ngOnInit(): void {
        // Inicialización del componente
    }

    selectTab(tabId: string): void {
        this.activeTab = tabId;
    }

    selectLoginSubtab(subtabId: string): void {
        this.activeLoginSubtab = subtabId;
    }

    selectRolesSubtab(subtabId: string): void {
        this.activeRolesSubtab = subtabId;
    }
    downloadAsMarkdown(documentId: string): void {
        let content = '';
        let filename = '';

        if (documentId === 'login-manual') {
            content = this.manualLoginContent;
            filename = 'MANUAL_LOGIN_AUTENTICACION.md';
        } else if (documentId === 'roles-policies') {
            content = this.politicasRolesContent;
            filename = 'POLITICAS_ROLES_PERSONALIZADOS.md';
        }

        this.downloadFile(filename, content, 'text/markdown');
        this.showToast('Descarga iniciada');
    }

    downloadAsText(documentId: string): void {
        let content = '';
        let filename = '';

        if (documentId === 'login-manual') {
            content = this.manualLoginContent;
            filename = 'MANUAL_LOGIN_AUTENTICACION.txt';
        } else if (documentId === 'roles-policies') {
            content = this.politicasRolesContent;
            filename = 'POLITICAS_ROLES_PERSONALIZADOS.txt';
        }

        this.downloadFile(filename, content, 'text/plain');
        this.showToast('Descarga iniciada');
    }

    copyToClipboard(documentId: string): void {
        let content = '';

        if (documentId === 'login-manual') {
            content = this.manualLoginContent;
        } else if (documentId === 'roles-policies') {
            content = this.politicasRolesContent;
        }

        navigator.clipboard.writeText(content).then(() => {
            this.showToast('Documentación copiada al portapapeles');
        }).catch(() => {
            this.showToast('Error al copiar al portapapeles');
        });
    }

    private downloadFile(filename: string, content: string, mimeType: string): void {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    private showToast(message: string): void {
        alert(message);
    }
    downloadModuleManual(moduleId: string): void {
        if (!this.modules.find(m => m.id === moduleId)?.available) {
            return;
        }

        const moduleNames = {
            'dashboard': 'MANUAL_01_DASHBOARD.md',
            'prescripciones': 'MANUAL_02_PRESCRIPCIONES.md',
            'dispensacion': 'MANUAL_03_DISPENSACION.md'
        };

        const fileName = moduleNames[moduleId as keyof typeof moduleNames] || `MANUAL_${moduleId}.md`;

        const content = `# Manual ${moduleId.charAt(0).toUpperCase() + moduleId.slice(1)}

Este es el manual del módulo ${moduleId}.

## Contenido

- Introducción
- Funcionalidades principales
- Casos de uso
- Mejores prácticas

*Documento generado el ${new Date().toLocaleDateString()}*`;

        this.downloadFile(fileName, content, 'text/markdown');
        this.showToast('Descargando manual...');
    }

    openGeneralIndex(): void {
        window.open('https://raw.githubusercontent.com/user/repo/main/docs/INDICE_GENERAL_USUARIO.md', '_blank');
        this.showToast('Abriendo índice general...');
    }

    downloadDocument(documentId: string): void {
        if (documentId === 'general-index') {
            const content = `# Índice General - Sistema ePrescription

## Módulos Disponibles

1. Dashboard
2. Prescripciones  
3. Dispensación
4. Pacientes
5. Médicos
6. Inventario

*Documento maestro generado el ${new Date().toLocaleDateString()}*`;

            this.downloadFile('INDICE_GENERAL_USUARIO.md', content, 'text/markdown');
            this.showToast('Descarga iniciada');
        }
    }
}