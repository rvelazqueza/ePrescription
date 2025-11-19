import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { TablePagination } from "../components/TablePagination";
import { ExportButtons } from "../components/ExportButtons";
import { usePagination } from "../utils/usePagination";
import { normalizedIncludes } from "../utils/searchUtils";
import { toast } from "sonner@2.0.3";
import {
  FileCheck,
  Search,
  Filter,
  FilterX,
  Eye,
  Download,
  AlertTriangle,
  CheckCircle2,
  User,
  Lock,
  Edit,
  Trash2,
  FileText,
  Database,
  Activity,
  Shield,
  Clock,
  MapPin,
  Monitor,
  Info,
  TrendingUp,
  Users,
  RefreshCw
} from "lucide-react";

// Datos mock de log de auditoría
const mockAuditLogs = [
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
    userRole: null,
    action: "LOGIN_FAILED",
    actionLabel: "Intento de login fallido",
    resource: "Autenticación",
    resourceId: null,
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
    sessionId: null,
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

export function LogAuditoriaPage() {
  const [logs, setLogs] = useState(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<typeof mockAuditLogs[0] | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  // Filtrar logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actionLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);
    
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === "today") {
      matchesDate = log.timestamp.startsWith("2024-10-01");
    }
    
    return matchesSearch && matchesAction && matchesSeverity && matchesStatus && matchesDate;
  });

  // Obtener acciones únicas
  const uniqueActions = Array.from(new Set(mockAuditLogs.map(l => l.action)));

  // Estadísticas
  const stats = {
    total: logs.length,
    today: logs.filter(l => l.timestamp.startsWith("2024-10-01")).length,
    success: logs.filter(l => l.status === 'success').length,
    failed: logs.filter(l => l.status === 'failed').length,
    critical: logs.filter(l => l.severity === 'critical').length,
    warning: logs.filter(l => l.severity === 'warning').length
  };

  const getSeverityBadge = (severity: string) => {
    const config = {
      critical: { label: "Crítico", className: "bg-red-100 text-red-700 border-red-300" },
      warning: { label: "Advertencia", className: "bg-orange-100 text-orange-700 border-orange-300" },
      info: { label: "Info", className: "bg-blue-100 text-blue-700 border-blue-300" }
    };
    return config[severity as keyof typeof config] || config.info;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      success: { label: "Exitoso", className: "bg-green-100 text-green-700 border-green-300" },
      failed: { label: "Fallido", className: "bg-red-100 text-red-700 border-red-300" }
    };
    return config[status as keyof typeof config] || config.success;
  };

  const handleDoubleClick = (log: typeof mockAuditLogs[0]) => {
    setSelectedLog(log);
    setIsDetailsPanelOpen(true);
  };

  const handleExport = () => {
    toast.success('Exportación iniciada', {
      description: 'El reporte de auditoría se está generando en formato PDF',
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Log de Auditoría</h1>
              <p className="text-purple-100 text-sm">
                Registro inmutable de todas las operaciones del sistema
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total eventos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoy</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.today}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Exitosos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.success}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fallidos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.failed}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Críticos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.critical}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Advertencias</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.warning}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda y filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por usuario, acción, ID, IP o detalles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Acción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las acciones</SelectItem>
                  {uniqueActions.map(action => (
                    <SelectItem key={action} value={action}>
                      {action.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Severidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="warning">Advertencia</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="success">Exitoso</SelectItem>
                  <SelectItem value="failed">Fallido</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Fecha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm || actionFilter !== "all" || severityFilter !== "all" || statusFilter !== "all" || dateFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setActionFilter("all");
                    setSeverityFilter("all");
                    setStatusFilter("all");
                    setDateFilter("all");
                  }}
                >
                  <FilterX className="w-4 h-4 mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registro de Eventos del Sistema</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {filteredLogs.length} evento{filteredLogs.length !== 1 ? 's' : ''} encontrado{filteredLogs.length !== 1 ? 's' : ''} • Doble clic para ver detalles completos
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead>Detalles</TableHead>
                  <TableHead>Ubicación/IP</TableHead>
                  <TableHead className="text-center">Severidad</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const severityBadge = getSeverityBadge(log.severity);
                  const statusBadge = getStatusBadge(log.status);
                  return (
                    <TableRow
                      key={log.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onDoubleClick={() => handleDoubleClick(log)}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">{log.timestamp.split(' ')[0]}</span>
                          <span className="text-xs text-gray-600">{log.timestamp.split(' ')[1]}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900">{log.userName}</p>
                            <p className="text-xs text-gray-600">{log.userRole || 'N/A'}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{log.actionLabel}</p>
                          <p className="text-xs text-gray-600 font-mono">{log.action}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm text-gray-900">{log.resource}</p>
                          {log.resourceId && (
                            <p className="text-xs text-gray-600 font-mono">{log.resourceId}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-900 max-w-md truncate">
                          {log.details}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-xs">
                          <div className="flex items-center gap-1 text-gray-900">
                            <MapPin className="w-3 h-3" />
                            <span>{log.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 mt-1">
                            <Monitor className="w-3 h-3" />
                            <span>{log.ipAddress}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={severityBadge.className}>
                          {severityBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={statusBadge.className}>
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedLog(log);
                            setIsDetailsPanelOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Información de cumplimiento */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-purple-900 mb-1">Cumplimiento Normativo</h4>
              <ul className="space-y-1 text-sm text-purple-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Cumple con HIPAA Audit Controls: Registro inmutable de todos los accesos a información de salud</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Retención de logs por 7 años según normativas internacionales de salud</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Incluye timestamp, usuario, acción, recurso, IP y user agent para investigaciones legales</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Registro de accesos a datos de pacientes para auditorías de privacidad</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de detalles */}
      {selectedLog && (
        <AuditLogDetailDialog
          log={selectedLog}
          open={isDetailsPanelOpen}
          onOpenChange={setIsDetailsPanelOpen}
        />
      )}
    </div>
  );
}

// Componente auxiliar: Diálogo de detalles de log
function AuditLogDetailDialog({ 
  log, 
  open, 
  onOpenChange 
}: { 
  log: typeof mockAuditLogs[0]; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
}) {
  const getSeverityBadge = (severity: string) => {
    const config = {
      critical: { label: "Crítico", className: "bg-red-100 text-red-700 border-red-300" },
      warning: { label: "Advertencia", className: "bg-orange-100 text-orange-700 border-orange-300" },
      info: { label: "Info", className: "bg-blue-100 text-blue-700 border-blue-300" }
    };
    return config[severity as keyof typeof config] || config.info;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      success: { label: "Exitoso", className: "bg-green-100 text-green-700 border-green-300" },
      failed: { label: "Fallido", className: "bg-red-100 text-red-700 border-red-300" }
    };
    return config[status as keyof typeof config] || config.success;
  };

  let parsedChanges;
  try {
    parsedChanges = JSON.parse(log.changes);
  } catch {
    parsedChanges = {};
  }

  const handleExportEvent = () => {
    // Generar PDF del evento de auditoría
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Error al exportar', {
        description: 'Por favor, habilite las ventanas emergentes para exportar',
      });
      return;
    }

    const severityLabel = getSeverityBadge(log.severity).label;
    const statusLabel = getStatusBadge(log.status).label;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Evento de Auditoría - ${log.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
            padding: 40px; 
            line-height: 1.6;
            color: #1a202c;
          }
          .header {
            border-bottom: 3px solid #7c3aed;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #7c3aed;
            font-size: 24px;
            margin-bottom: 8px;
          }
          .header .subtitle {
            color: #64748b;
            font-size: 14px;
          }
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          .section-title {
            color: #475569;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 15px;
          }
          .info-grid.cols-3 {
            grid-template-columns: repeat(3, 1fr);
          }
          .info-item {
            padding: 12px;
            background: #f8fafc;
            border-radius: 6px;
            border-left: 3px solid #7c3aed;
          }
          .info-label {
            color: #64748b;
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .info-value {
            color: #1a202c;
            font-size: 14px;
          }
          .info-value.mono {
            font-family: 'Courier New', monospace;
            font-size: 13px;
          }
          .details-box {
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            padding: 15px;
            margin-top: 10px;
          }
          .changes-box {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 6px;
            padding: 15px;
            margin-top: 10px;
          }
          .changes-box pre {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #1e40af;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            margin-top: 4px;
          }
          .badge-success {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #6ee7b7;
          }
          .badge-failed {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fca5a5;
          }
          .badge-critical {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fca5a5;
          }
          .badge-warning {
            background: #fed7aa;
            color: #9a3412;
            border: 1px solid #fdba74;
          }
          .badge-info {
            background: #dbeafe;
            color: #1e40af;
            border: 1px solid #93c5fd;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
            text-align: center;
          }
          @media print {
            body { padding: 20px; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Evento de Auditoría</h1>
          <div class="subtitle">Registro completo del evento ${log.id}</div>
          <div class="subtitle">Generado: ${new Date().toLocaleString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}</div>
        </div>

        <div class="section">
          <div class="section-title">Información del evento</div>
          <div class="info-grid cols-3">
            <div class="info-item">
              <div class="info-label">ID de auditoría</div>
              <div class="info-value mono">${log.id}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Timestamp</div>
              <div class="info-value">${log.timestamp}</div>
            </div>
            <div class="info-item">
              <div class="info-label">ID de sesión</div>
              <div class="info-value mono">${log.sessionId || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Usuario</div>
          <div class="info-grid cols-3">
            <div class="info-item">
              <div class="info-label">Nombre</div>
              <div class="info-value">${log.userName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">ID de usuario</div>
              <div class="info-value mono">${log.userId}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Rol</div>
              <div class="info-value">${log.userRole || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Acción realizada</div>
          <div class="info-grid cols-3">
            <div class="info-item">
              <div class="info-label">Acción</div>
              <div class="info-value">${log.actionLabel}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Código de acción</div>
              <div class="info-value mono">${log.action}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Estado</div>
              <div class="info-value">
                <span class="badge badge-${log.status}">${statusLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Recurso afectado</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Tipo de recurso</div>
              <div class="info-value">${log.resource}</div>
            </div>
            <div class="info-item">
              <div class="info-label">ID del recurso</div>
              <div class="info-value mono">${log.resourceId || 'N/A'}</div>
            </div>
            ${log.affectedPatient ? `
            <div class="info-item" style="grid-column: 1 / -1;">
              <div class="info-label">Paciente afectado</div>
              <div class="info-value">${log.affectedPatient}</div>
            </div>
            ` : ''}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Detalles del evento</div>
          <div class="details-box">
            ${log.details}
          </div>
        </div>

        ${Object.keys(parsedChanges).length > 0 ? `
        <div class="section">
          <div class="section-title">Cambios registrados</div>
          <div class="changes-box">
            <pre>${JSON.stringify(parsedChanges, null, 2)}</pre>
          </div>
        </div>
        ` : ''}

        <div class="section">
          <div class="section-title">Información técnica</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Dirección IP</div>
              <div class="info-value mono">${log.ipAddress}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Ubicación</div>
              <div class="info-value">${log.location}</div>
            </div>
            <div class="info-item" style="grid-column: 1 / -1;">
              <div class="info-label">User Agent</div>
              <div class="info-value mono" style="font-size: 11px; word-break: break-all;">${log.userAgent}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Severidad</div>
              <div class="info-value">
                <span class="badge badge-${log.severity}">${severityLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <strong>ePrescription - Sistema Hospitalario de Recetas Médicas</strong><br>
          Este documento es un registro oficial del sistema de auditoría y debe ser tratado de forma confidencial.<br>
          Cumple con normativas HL7, FDA y OMS para registros de auditoría en sistemas de salud.
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    toast.success('Exportación iniciada', {
      description: 'El evento de auditoría se está generando en PDF',
      duration: 3000,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-purple-600" />
            Detalles del Evento de Auditoría
          </DialogTitle>
          <DialogDescription>
            Información completa del registro de auditoría
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información básica */}
          <div>
            <h4 className="font-medium mb-3">Información del evento</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-gray-600">ID de auditoría</Label>
                <p className="font-mono text-sm mt-1">{log.id}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Timestamp</Label>
                <p className="mt-1">{log.timestamp}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">ID de sesión</Label>
                <p className="font-mono text-sm mt-1">{log.sessionId || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Usuario */}
          <div>
            <h4 className="font-medium mb-3">Usuario</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Nombre</Label>
                <p className="font-medium mt-1">{log.userName}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">ID de usuario</Label>
                <p className="font-mono text-sm mt-1">{log.userId}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Rol</Label>
                <p className="mt-1">{log.userRole || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Acción */}
          <div>
            <h4 className="font-medium mb-3">Acción realizada</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Acción</Label>
                <p className="font-medium mt-1">{log.actionLabel}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Código de acción</Label>
                <p className="font-mono text-sm mt-1">{log.action}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Estado</Label>
                <div className="mt-2">
                  <Badge variant="outline" className={getStatusBadge(log.status).className}>
                    {getStatusBadge(log.status).label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Recurso */}
          <div>
            <h4 className="font-medium mb-3">Recurso afectado</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Tipo de recurso</Label>
                <p className="mt-1">{log.resource}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">ID del recurso</Label>
                <p className="font-mono text-sm mt-1">{log.resourceId || 'N/A'}</p>
              </div>
              {log.affectedPatient && (
                <div className="col-span-2">
                  <Label className="text-sm text-gray-600">Paciente afectado</Label>
                  <p className="font-medium mt-1">{log.affectedPatient}</p>
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Detalles */}
          <div>
            <h4 className="font-medium mb-3">Detalles del evento</h4>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-900">{log.details}</p>
            </div>
          </div>

          {/* Cambios */}
          {Object.keys(parsedChanges).length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Cambios registrados</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <pre className="text-xs text-blue-900 whitespace-pre-wrap font-mono">
                  {JSON.stringify(parsedChanges, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="h-px bg-gray-200" />

          {/* Información técnica */}
          <div>
            <h4 className="font-medium mb-3">Información técnica</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Dirección IP</Label>
                <p className="font-mono text-sm mt-1">{log.ipAddress}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Ubicación</Label>
                <p className="mt-1">{log.location}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-sm text-gray-600">User Agent</Label>
                <p className="text-xs text-gray-700 mt-1 font-mono break-all">{log.userAgent}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Severidad</Label>
                <div className="mt-2">
                  <Badge variant="outline" className={getSeverityBadge(log.severity).className}>
                    {getSeverityBadge(log.severity).label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button variant="outline" onClick={handleExportEvent}>
            <Download className="w-4 h-4 mr-2" />
            Exportar evento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
