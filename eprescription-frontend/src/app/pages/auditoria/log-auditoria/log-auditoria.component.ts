
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  FileCheck,
  Search,
  FilterX,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle2,
  User,
  Database,
  Clock,
  Shield,
  MapPin,
  Monitor,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-angular';
import { BreadcrumbItem } from '../../../components/breadcrumbs/breadcrumbs.component';
import { PageLayoutComponent } from '../../../components/page-layout/page-layout.component';

// Interface for audit logs
interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  actionLabel: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  status: 'success' | 'failed';
  severity: 'critical' | 'warning' | 'info';
  details: string;
  changes: string;
  sessionId: string;
  affectedPatient: string | null;
}

// Datos mock de log de auditoría
const mockAuditLogs: AuditLog[] = [
  {
    id: "AUD-001",
    timestamp: "2024-10-01 14:35:22",
    userId: "USR-0023",
    userName: "Dr. Carlos Martínez",
    userRole: "Médico",
    action: "CREATE_PRESCRIPTION",
    actionLabel: "Crear receta",
    resource: "Receta",
    resourceId: "RX-2024-0198",
    ipAddress: "192.168.1.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    location: "Consultorio 3B",
    status: "success",
    severity: "info",
    details: "Receta creada para paciente María González (PAT-0012) con 3 medicamentos",
    changes: JSON.stringify({
      patient: "María González",
      medicines: ["Paracetamol 500mg", "Ibuprofeno 400mg", "Omeprazol 20mg"]
    }),
    sessionId: "SESS-45678-ABC",
    affectedPatient: "María González (PAT-0012)"
  },
  {
    id: "AUD-002",
    timestamp: "2024-10-01 14:28:15",
    userId: "USR-0045",
    userName: "Farmacéutica Ana García",
    userRole: "Farmacéutico",
    action: "VERIFY_PRESCRIPTION",
    actionLabel: "Verificar receta",
    resource: "Receta",
    resourceId: "RX-2024-0195",
    ipAddress: "192.168.1.78",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    location: "Farmacia Central",
    status: "success",
    severity: "info",
    details: "Receta verificada mediante QR. Dispensación autorizada",
    changes: JSON.stringify({
      verificationMethod: "QR",
      qrCode: "QR-2024-0195-HASH123",
      authorized: true
    }),
    sessionId: "SESS-45679-DEF",
    affectedPatient: "Roberto Sánchez (PAT-0067)"
  },
  {
    id: "AUD-003",
    timestamp: "2024-10-01 13:45:08",
    userId: "USR-0001",
    userName: "Admin Sistema",
    userRole: "Administrador",
    action: "MODIFY_USER",
    actionLabel: "Modificar usuario",
    resource: "Usuario",
    resourceId: "USR-0089",
    ipAddress: "192.168.1.10",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    location: "Administración",
    status: "success",
    severity: "warning",
    details: "Modificación de permisos de usuario Laura Ramírez",
    changes: JSON.stringify({
      previousRole: "Médico",
      newRole: "Médico Jefe",
      addedPermissions: ["approve_prescriptions", "manage_doctors"]
    }),
    sessionId: "SESS-45680-GHI",
    affectedPatient: null
  },
  {
    id: "AUD-004",
    timestamp: "2024-10-01 13:12:45",
    userId: "USR-0067",
    userName: "Dr. José Torres",
    userRole: "Médico",
    action: "ACCESS_PATIENT_RECORD",
    actionLabel: "Acceso a historia clínica",
    resource: "Historia Clínica",
    resourceId: "HC-PAT-0089",
    ipAddress: "192.168.1.56",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    location: "Consultorio 5A",
    status: "success",
    severity: "info",
    details: "Consulta de historia clínica completa de paciente Ana Herrera",
    changes: JSON.stringify({
      sections: ["allergies", "medications", "conditions", "prescriptions"]
    }),
    sessionId: "SESS-45681-JKL",
    affectedPatient: "Ana Herrera (PAT-0089)"
  },
  {
    id: "AUD-005",
    timestamp: "2024-10-01 12:58:30",
    userId: "USR-0023",
    userName: "Dr. Carlos Martínez",
    userRole: "Médico",
    action: "DELETE_PRESCRIPTION_DRAFT",
    actionLabel: "Eliminar borrador",
    resource: "Borrador",
    resourceId: "DRAFT-2024-0456",
    ipAddress: "192.168.1.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    location: "Consultorio 3B",
    status: "success",
    severity: "warning",
    details: "Borrador de receta eliminado permanentemente",
    changes: JSON.stringify({
      draftDate: "2024-09-28",
      medicinesCount: 2
    }),
    sessionId: "SESS-45678-ABC",
    affectedPatient: "Pedro Jiménez (PAT-0034)"
  },
  {
    id: "AUD-006",
    timestamp: "2024-10-01 12:45:12",
    userId: "USR-0089",
    userName: "Dra. Laura Ramírez",
    userRole: "Médico Jefe",
    action: "APPROVE_CRITICAL_ALERT",
    actionLabel: "Aprobar alerta crítica",
    resource: "Alerta Clínica",
    resourceId: "ALT-001",
    ipAddress: "192.168.1.67",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    location: "Consultorio Principal",
    status: "success",
    severity: "critical",
    details: "Alerta de interacción Warfarina+AAS aprobada con justificación médica",
    changes: JSON.stringify({
      alert: "Interacción medicamentosa severa",
      decision: "accepted_risk",
      justification: "Beneficio terapéutico supera riesgo con monitoreo INR semanal"
    }),
    sessionId: "SESS-45682-MNO",
    affectedPatient: "María González (PAT-0012)"
  },
  {
    id: "AUD-007",
    timestamp: "2024-10-01 11:30:45",
    userId: "USR-0045",
    userName: "Farmacéutica Ana García",
    userRole: "Farmacéutico",
    action: "DISPENSE_MEDICINE",
    actionLabel: "Dispensar medicamento",
    resource: "Dispensación",
    resourceId: "DISP-2024-0234",
    ipAddress: "192.168.1.78",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    location: "Farmacia Central",
    status: "success",
    severity: "info",
    details: "Dispensación parcial de receta RX-2024-0178 (2 de 3 medicamentos)",
    changes: JSON.stringify({
      prescriptionId: "RX-2024-0178",
      dispensedMedicines: ["Amoxicilina 500mg", "Paracetamol 500mg"],
      pendingMedicines: ["Omeprazol 20mg - Stock agotado"]
    }),
    sessionId: "SESS-45679-DEF",
    affectedPatient: "Carlos Ramírez (PAT-0045)"
  },
  {
    id: "AUD-008",
    timestamp: "2024-10-01 10:15:20",
    userId: "USR-0012",
    userName: "Técnico Luis Fernández",
    userRole: "Técnico Farmacia",
    action: "ADJUST_INVENTORY",
    actionLabel: "Ajuste de inventario",
    resource: "Inventario",
    resourceId: "INV-002",
    ipAddress: "192.168.1.82",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    location: "Bodega de Medicamentos",
    status: "success",
    severity: "warning",
    details: "Ajuste de stock por vencimiento: Metformina 850mg (-50 unidades)",
    changes: JSON.stringify({
      medicine: "Metformina 850mg",
      adjustment: -50,
      reason: "Vencimiento",
      batch: "LOT-2023-789",
      expiryDate: "2024-09-30"
    }),
    sessionId: "SESS-45683-PQR",
    affectedPatient: null
  },
  {
    id: "AUD-009",
    timestamp: "2024-10-01 09:45:33",
    userId: "USR-0156",
    userName: "usuario.incorrecto",
    userRole: "N/A",
    action: "LOGIN_FAILED",
    actionLabel: "Intento de login fallido",
    resource: "Autenticación",
    resourceId: "",
    ipAddress: "203.45.67.89",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    location: "Ubicación desconocida",
    status: "failed",
    severity: "critical",
    details: "Intento de acceso con credenciales incorrectas (3er intento en 5 minutos)",
    changes: JSON.stringify({
      attemptNumber: 3,
      lockoutTriggered: true,
      blockDuration: "30 minutos"
    }),
    sessionId: "",
    affectedPatient: null
  },
  {
    id: "AUD-010",
    timestamp: "2024-10-01 09:12:18",
    userId: "USR-0001",
    userName: "Admin Sistema",
    userRole: "Administrador",
    action: "EXPORT_DATA",
    actionLabel: "Exportar datos",
    resource: "Reporte",
    resourceId: "REP-2024-0089",
    ipAddress: "192.168.1.10",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    location: "Administración",
    status: "success",
    severity: "warning",
    details: "Exportación de reporte mensual de prescripciones (Sep 2024)",
    changes: JSON.stringify({
      reportType: "monthly_prescriptions",
      period: "2024-09",
      recordsExported: 1247,
      format: "PDF"
    }),
    sessionId: "SESS-45680-GHI",
    affectedPatient: null
  },
  {
    id: "AUD-011",
    timestamp: "2024-10-01 08:30:05",
    userId: "USR-0023",
    userName: "Dr. Carlos Martínez",
    userRole: "Médico",
    action: "SIGN_PRESCRIPTION",
    actionLabel: "Firmar receta",
    resource: "Receta",
    resourceId: "RX-2024-0192",
    ipAddress: "192.168.1.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    location: "Consultorio 3B",
    status: "success",
    severity: "info",
    details: "Firma digital aplicada con certificado válido",
    changes: JSON.stringify({
      signatureMethod: "Digital Certificate",
      certificateId: "CERT-DR-MARTINEZ-2024",
      timestamp: "2024-10-01T08:30:05Z",
      qrGenerated: true
    }),
    sessionId: "SESS-45678-ABC",
    affectedPatient: "Elena Martínez (PAT-0123)"
  },
  {
    id: "AUD-012",
    timestamp: "2024-10-01 08:00:12",
    userId: "USR-0001",
    userName: "Admin Sistema",
    userRole: "Administrador",
    action: "BACKUP_DATABASE",
    actionLabel: "Respaldo de base de datos",
    resource: "Sistema",
    resourceId: "BACKUP-2024-10-01",
    ipAddress: "192.168.1.10",
    userAgent: "System Process",
    location: "Servidor Principal",
    status: "success",
    severity: "info",
    details: "Respaldo automático diario completado exitosamente",
    changes: JSON.stringify({
      backupSize: "2.4 GB",
      duration: "12 minutos",
      location: "Servidor de respaldos",
      encrypted: true
    }),
    sessionId: "SYSTEM",
    affectedPatient: null
  }
];

@Component({
  selector: 'app-log-auditoria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LucideAngularModule,
    PageLayoutComponent
  ],
  styleUrls: ['./log-auditoria.component.css'],
  template: `
    <app-page-layout 
      title="Log de Auditoría" 
      description="Registro inmutable de todas las operaciones del sistema"
      [icon]="fileCheckIcon"
      [breadcrumbItems]="breadcrumbItems"
      headerGradient="from-purple-600 via-purple-500 to-indigo-600">
      
      <!-- Dashboard Content -->
      <div class="space-y-6">

        <!-- Tarjetas de estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-purple-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Total eventos</p>
                  <p class="text-3xl font-bold text-gray-900">{{stats.total}}</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-xl">
                  <lucide-icon [img]="databaseIcon" class="w-8 h-8 text-purple-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-blue-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Hoy</p>
                  <p class="text-3xl font-bold text-gray-900">{{stats.today}}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-xl">
                  <lucide-icon [img]="clockIcon" class="w-8 h-8 text-blue-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-green-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Exitosos</p>
                  <p class="text-3xl font-bold text-gray-900">{{stats.success}}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-xl">
                  <lucide-icon [img]="checkCircle2Icon" class="w-8 h-8 text-green-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-red-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Fallidos</p>
                  <p class="text-3xl font-bold text-gray-900">{{stats.failed}}</p>
                </div>
                <div class="p-3 bg-red-100 rounded-xl">
                  <lucide-icon [img]="alertTriangleIcon" class="w-8 h-8 text-red-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-red-600">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Críticos</p>
                  <p class="text-3xl font-bold text-gray-900">{{stats.critical}}</p>
                </div>
                <div class="p-3 bg-red-100 rounded-xl">
                  <lucide-icon [img]="shieldIcon" class="w-8 h-8 text-red-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-orange-500">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="space-y-1 flex-1">
                  <p class="text-sm text-gray-600">Advertencias</p>
                  <p class="text-3xl font-bold text-gray-900">{{stats.warning}}</p>
                </div>
                <div class="p-3 bg-orange-100 rounded-xl">
                  <lucide-icon [img]="alertTriangleIcon" class="w-8 h-8 text-orange-600"></lucide-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

      <!-- Búsqueda y filtros -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <lucide-icon [img]="searchIcon" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
            <input
              type="text"
              placeholder="Buscar por usuario, acción, ID, IP o detalles..."
              [(ngModel)]="searchTerm"
              (ngModelChange)="onSearchChange()"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div class="flex gap-2 flex-wrap">
            <select [(ngModel)]="actionFilter" (ngModelChange)="onActionFilterChange()" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="all">Todas las acciones</option>
              <option *ngFor="let action of uniqueActions" [value]="action">
                {{getActionLabel(action)}}
              </option>
            </select>

            <select [(ngModel)]="severityFilter" (ngModelChange)="onSeverityFilterChange()" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="all">Todas</option>
              <option value="critical">Crítico</option>
              <option value="warning">Advertencia</option>
              <option value="info">Info</option>
            </select>

            <select [(ngModel)]="statusFilter" (ngModelChange)="onStatusFilterChange()" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="all">Todos</option>
              <option value="success">Exitoso</option>
              <option value="failed">Fallido</option>
            </select>

            <select [(ngModel)]="dateFilter" (ngModelChange)="onDateFilterChange()" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="all">Todas</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
            </select>

            <button
              *ngIf="hasActiveFilters()"
              (click)="clearFilters()"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <lucide-icon [img]="filterXIcon" class="w-4 h-4"></lucide-icon>
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla de logs -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Registro de Eventos del Sistema</h3>
              <p class="text-sm text-gray-600 mt-1">
                {{filteredLogs.length}} evento{{filteredLogs.length !== 1 ? 's' : ''}} encontrado{{filteredLogs.length !== 1 ? 's' : ''}} • Doble clic para ver detalles completos
              </p>
            </div>
            <div class="flex gap-2">
              <button
                (click)="handleExport()"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
                Exportar
              </button>
              <button
                (click)="refreshData()"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <lucide-icon [img]="refreshCwIcon" class="w-4 h-4"></lucide-icon>
                Actualizar
              </button>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recurso</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación/IP</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Severidad</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                *ngFor="let log of logsPaginados"
                class="cursor-pointer hover:bg-gray-50 transition-colors"
                (dblclick)="openDetailsModal(log)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-900">{{log.timestamp.split(' ')[0]}}</span>
                    <span class="text-xs text-gray-600">{{log.timestamp.split(' ')[1]}}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <lucide-icon [img]="userIcon" class="w-4 h-4 text-purple-600"></lucide-icon>
                    </div>
                    <div>
                      <p class="font-medium text-sm text-gray-900">{{log.userName}}</p>
                      <p class="text-xs text-gray-600">{{log.userRole || 'N/A'}}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p class="font-medium text-sm text-gray-900">{{log.actionLabel}}</p>
                    <p class="text-xs text-gray-600 font-mono">{{log.action}}</p>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p class="text-sm text-gray-900">{{log.resource}}</p>
                    <p *ngIf="log.resourceId" class="text-xs text-gray-600 font-mono">{{log.resourceId}}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-gray-900 max-w-md truncate">
                    {{log.details}}
                  </p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col text-xs">
                    <div class="flex items-center gap-1 text-gray-900">
                      <lucide-icon [img]="mapPinIcon" class="w-3 h-3"></lucide-icon>
                      <span>{{log.location}}</span>
                    </div>
                    <div class="flex items-center gap-1 text-gray-600 mt-1">
                      <lucide-icon [img]="monitorIcon" class="w-3 h-3"></lucide-icon>
                      <span>{{log.ipAddress}}</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span [class]="getSeverityBadgeClass(log.severity)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full border">
                    {{getSeverityLabel(log.severity)}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span [class]="getStatusBadgeClass(log.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full border">
                    {{getStatusLabel(log.status)}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    (click)="openDetailsModal(log)"
                    class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 ml-auto"
                  >
                    <lucide-icon [img]="eyeIcon" class="w-4 h-4"></lucide-icon>
                    Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div *ngIf="filteredLogs.length > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Mostrando {{ (paginaActual - 1) * elementosPorPagina + 1 }} a {{ Math.min(paginaActual * elementosPorPagina, filteredLogs.length) }} de {{ filteredLogs.length }} eventos
            </div>
            <div class="flex items-center space-x-2">
              <button 
                (click)="cambiarPagina(paginaActual - 1)"
                [disabled]="paginaActual === 1"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                <lucide-icon [img]="chevronLeftIcon" class="w-4 h-4"></lucide-icon>
                Anterior
              </button>
              
              <div class="flex space-x-1">
                <button 
                  *ngFor="let pagina of getPaginas()"
                  (click)="cambiarPagina(pagina)"
                  [class]="pagina === paginaActual 
                    ? 'px-3 py-2 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-md'
                    : 'px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50'">
                  {{ pagina }}
                </button>
              </div>
              
              <button 
                (click)="cambiarPagina(paginaActual + 1)"
                [disabled]="paginaActual === totalPaginas"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
                Siguiente
                <lucide-icon [img]="chevronRightIcon" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Información de cumplimiento -->
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-purple-100 rounded-lg flex-shrink-0">
            <lucide-icon [img]="shieldIcon" class="w-5 h-5 text-purple-600"></lucide-icon>
          </div>
          <div>
            <h4 class="font-medium text-purple-900 mb-1">Cumplimiento Normativo</h4>
            <ul class="space-y-1 text-sm text-purple-700">
              <li class="flex items-start gap-2">
                <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                <span>Cumple con HIPAA Audit Controls: Registro inmutable de todos los accesos a información de salud</span>
              </li>
              <li class="flex items-start gap-2">
                <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                <span>Retención de logs por 7 años según normativas internacionales de salud</span>
              </li>
              <li class="flex items-start gap-2">
                <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                <span>Incluye timestamp, usuario, acción, recurso, IP y user agent para investigaciones legales</span>
              </li>
              <li class="flex items-start gap-2">
                <lucide-icon [img]="checkCircle2Icon" class="w-4 h-4 mt-0.5 flex-shrink-0"></lucide-icon>
                <span>Registro de accesos a datos de pacientes para auditorías de privacidad</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Alerta de exportación -->
      <div 
        *ngIf="showExportAlert"
        class="fixed top-4 right-4 z-50 max-w-md w-full bg-green-800 border border-green-700 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <lucide-icon [img]="checkCircle2Icon" class="w-6 h-6 text-green-300"></lucide-icon>
            </div>
            <div class="ml-3 w-0 flex-1">
              <p class="text-sm font-medium text-green-100">
                Exportación iniciada
              </p>
              <p class="mt-1 text-sm text-green-200">
                El reporte de auditoría se está generando en formato PDF
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                (click)="showExportAlert = false"
                class="inline-flex text-green-300 hover:text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md p-1"
              >
                <lucide-icon [img]="xIcon" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de detalles -->
      <div *ngIf="selectedLog && isDetailsPanelOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <lucide-icon [img]="fileCheckIcon" class="w-5 h-5 text-purple-600"></lucide-icon>
                <h3 class="text-lg font-semibold text-gray-900">Detalles del Evento de Auditoría</h3>
              </div>
              <button (click)="closeDetailsModal()" class="text-gray-400 hover:text-gray-600">
                <lucide-icon [img]="xIcon" class="w-6 h-6"></lucide-icon>
              </button>
            </div>
            <p class="text-sm text-gray-600 mt-1">Información completa del registro de auditoría</p>
          </div>

          <div class="p-6 space-y-6">
            <!-- Información básica -->
            <div>
              <h4 class="font-medium mb-3">Información del evento</h4>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="text-sm text-gray-600">ID de auditoría</label>
                  <p class="font-mono text-sm mt-1">{{selectedLog.id}}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Timestamp</label>
                  <p class="mt-1">{{selectedLog.timestamp}}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">ID de sesión</label>
                  <p class="font-mono text-sm mt-1">{{selectedLog.sessionId || 'N/A'}}</p>
                </div>
              </div>
            </div>

            <div class="h-px bg-gray-200"></div>

            <!-- Usuario -->
            <div>
              <h4 class="font-medium mb-3">Usuario</h4>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="text-sm text-gray-600">Nombre</label>
                  <p class="font-medium mt-1">{{selectedLog.userName}}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">ID de usuario</label>
                  <p class="font-mono text-sm mt-1">{{selectedLog.userId}}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Rol</label>
                  <p class="mt-1">{{selectedLog.userRole || 'N/A'}}</p>
                </div>
              </div>
            </div>

            <div class="h-px bg-gray-200"></div>

            <!-- Acción -->
            <div>
              <h4 class="font-medium mb-3">Acción realizada</h4>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="text-sm text-gray-600">Acción</label>
                  <p class="font-medium mt-1">{{selectedLog.actionLabel}}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Código de acción</label>
                  <p class="font-mono text-sm mt-1">{{selectedLog.action}}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Estado</label>
                  <div class="mt-2">
                    <span [class]="getStatusBadgeClass(selectedLog.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full border">
                      {{getStatusLabel(selectedLog.status)}}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="h-px bg-gray-200"></div>

            <!-- Recurso -->
            <div>
              <h4 class="font-medium mb-3">Recurso afectado</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm text-gray-600">Tipo de recurso</label>
                  <p class="mt-1">{{selectedLog.resource}}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">ID del recurso</label>
                  <p class="font-mono text-sm mt-1">{{selectedLog.resourceId || 'N/A'}}</p>
                </div>
                <div *ngIf="selectedLog.affectedPatient" class="col-span-2">
                  <label class="text-sm text-gray-600">Paciente afectado</label>
                  <p class="font-medium mt-1">{{selectedLog.affectedPatient}}</p>
                </div>
              </div>
            </div>

            <div class="h-px bg-gray-200"></div>

            <!-- Detalles -->
            <div>
              <h4 class="font-medium mb-3">Detalles del evento</h4>
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p class="text-sm text-gray-900">{{selectedLog.details}}</p>
              </div>
            </div>

            <!-- Cambios -->
            <div *ngIf="hasChanges(selectedLog.changes)">
              <h4 class="font-medium mb-3">Cambios registrados</h4>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <pre class="text-xs text-blue-900 whitespace-pre-wrap font-mono">{{formatChanges(selectedLog.changes)}}</pre>
              </div>
            </div>

            <div class="h-px bg-gray-200"></div>

            <!-- Información técnica -->
            <div>
              <h4 class="font-medium mb-3">Información técnica</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm text-gray-600">Dirección IP</label>
                  <p class="font-mono text-sm mt-1">{{selectedLog.ipAddress}}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Ubicación</label>
                  <p class="mt-1">{{selectedLog.location}}</p>
                </div>
                <div class="col-span-2">
                  <label class="text-sm text-gray-600">User Agent</label>
                  <p class="text-xs text-gray-700 mt-1 font-mono break-all">{{selectedLog.userAgent}}</p>
                </div>
                <div>
                  <label class="text-sm text-gray-600">Severidad</label>
                  <div class="mt-2">
                    <span [class]="getSeverityBadgeClass(selectedLog.severity)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full border">
                      {{getSeverityLabel(selectedLog.severity)}}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
            <button
              (click)="closeDetailsModal()"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cerrar
            </button>
            <button
              (click)="exportEvent(selectedLog)"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <lucide-icon [img]="downloadIcon" class="w-4 h-4"></lucide-icon>
              Exportar evento
            </button>
          </div>
        </div>
      </div>

      </div>
    </app-page-layout>
  `
})
export class LogAuditoriaComponent implements OnInit {
  logs: AuditLog[] = mockAuditLogs;
  searchTerm = '';
  actionFilter = 'all';
  severityFilter = 'all';
  statusFilter = 'all';
  dateFilter = 'all';
  selectedLog: AuditLog | null = null;
  isDetailsPanelOpen = false;

  // Paginación
  paginaActual = 1;
  elementosPorPagina = 10;
  totalPaginas = 0;
  logsPaginados: AuditLog[] = [];
  filteredLogsCache: AuditLog[] = [];

  // Alerta de exportación
  showExportAlert = false;

  // Icons
  fileCheckIcon = FileCheck;
  searchIcon = Search;
  filterXIcon = FilterX;
  eyeIcon = Eye;
  downloadIcon = Download;
  alertTriangleIcon = AlertTriangle;
  checkCircle2Icon = CheckCircle2;
  userIcon = User;
  databaseIcon = Database;
  clockIcon = Clock;
  shieldIcon = Shield;
  mapPinIcon = MapPin;
  monitorIcon = Monitor;
  refreshCwIcon = RefreshCw;
  xIcon = X;
  chevronLeftIcon = ChevronLeft;
  chevronRightIcon = ChevronRight;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Auditoría y cumplimiento', route: '/auditoria' },
    { label: 'Log auditoría' }
  ];

  ngOnInit() {
    this.updateFilteredLogs();
  }

  get filteredLogs(): AuditLog[] {
    return this.filteredLogsCache;
  }

  private updateFilteredLogs(): void {
    this.filteredLogsCache = this.logs.filter(log => {
      const matchesSearch =
        log.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        log.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        log.actionLabel.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        log.ipAddress.includes(this.searchTerm);

      const matchesAction = this.actionFilter === 'all' || log.action === this.actionFilter;
      const matchesSeverity = this.severityFilter === 'all' || log.severity === this.severityFilter;
      const matchesStatus = this.statusFilter === 'all' || log.status === this.statusFilter;

      let matchesDate = true;
      if (this.dateFilter === 'today') {
        matchesDate = log.timestamp.startsWith('2024-10-01');
      }

      return matchesSearch && matchesAction && matchesSeverity && matchesStatus && matchesDate;
    });

    // Reset pagination when filters change
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  get uniqueActions(): string[] {
    return Array.from(new Set(mockAuditLogs.map(l => l.action)));
  }

  get stats() {
    return {
      total: this.logs.length,
      today: this.logs.filter(l => l.timestamp.startsWith('2024-10-01')).length,
      success: this.logs.filter(l => l.status === 'success').length,
      failed: this.logs.filter(l => l.status === 'failed').length,
      critical: this.logs.filter(l => l.severity === 'critical').length,
      warning: this.logs.filter(l => l.severity === 'warning').length
    };
  }

  getSeverityBadgeClass(severity: string): string {
    const config = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      warning: 'bg-orange-100 text-orange-700 border-orange-300',
      info: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return config[severity as keyof typeof config] || config.info;
  }

  getSeverityLabel(severity: string): string {
    const config = {
      critical: 'Crítico',
      warning: 'Advertencia',
      info: 'Info'
    };
    return config[severity as keyof typeof config] || 'Info';
  }

  getStatusBadgeClass(status: string): string {
    const config = {
      success: 'bg-green-100 text-green-700 border-green-300',
      failed: 'bg-red-100 text-red-700 border-red-300'
    };
    return config[status as keyof typeof config] || config.success;
  }

  getStatusLabel(status: string): string {
    const config = {
      success: 'Exitoso',
      failed: 'Fallido'
    };
    return config[status as keyof typeof config] || 'Exitoso';
  }

  hasActiveFilters(): boolean {
    return this.searchTerm !== '' ||
      this.actionFilter !== 'all' ||
      this.severityFilter !== 'all' ||
      this.statusFilter !== 'all' ||
      this.dateFilter !== 'all';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.actionFilter = 'all';
    this.severityFilter = 'all';
    this.statusFilter = 'all';
    this.dateFilter = 'all';
    this.updateFilteredLogs();
  }

  openDetailsModal(log: AuditLog): void {
    this.selectedLog = log;
    this.isDetailsPanelOpen = true;
  }

  closeDetailsModal(): void {
    this.selectedLog = null;
    this.isDetailsPanelOpen = false;
  }

  handleExport(): void {
    // Mostrar alerta verde
    this.showExportAlert = true;

    // Ocultar alerta después de 4 segundos
    setTimeout(() => {
      this.showExportAlert = false;
    }, 4000);
  }

  refreshData(): void {
    // Simular actualización de datos
    alert('Datos actualizados correctamente');
  }

  exportEvent(log: AuditLog): void {
    // Simular exportación de evento individual
    alert(`Exportando evento ${log.id} en formato PDF`);
  }

  getParsedChanges(changes: string): any {
    try {
      return JSON.parse(changes);
    } catch {
      return {};
    }
  }

  formatChanges(changes: string): string {
    try {
      const parsed = JSON.parse(changes);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return changes;
    }
  }

  getActionLabel(action: string): string {
    return action.replace(/_/g, ' ');
  }

  hasChanges(changes: string): boolean {
    try {
      const parsed = JSON.parse(changes);
      return Object.keys(parsed).length > 0;
    } catch {
      return false;
    }
  }

  // Métodos de paginación
  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(this.filteredLogsCache.length / this.elementosPorPagina);
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.logsPaginados = this.filteredLogsCache.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
    }
  }

  getPaginas(): number[] {
    const maxPaginas = 5; // Mostrar máximo 5 números de página
    let inicio = Math.max(1, this.paginaActual - Math.floor(maxPaginas / 2));
    let fin = Math.min(this.totalPaginas, inicio + maxPaginas - 1);

    // Ajustar el inicio si estamos cerca del final
    if (fin - inicio + 1 < maxPaginas) {
      inicio = Math.max(1, fin - maxPaginas + 1);
    }

    const paginas = [];
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  // Método Math para el template
  Math = Math;

  // Métodos para actualizar filtros
  onSearchChange(): void {
    this.updateFilteredLogs();
  }

  onActionFilterChange(): void {
    this.updateFilteredLogs();
  }

  onSeverityFilterChange(): void {
    this.updateFilteredLogs();
  }

  onStatusFilterChange(): void {
    this.updateFilteredLogs();
  }

  onDateFilterChange(): void {
    this.updateFilteredLogs();
  }
}