import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { TablePagination } from "../components/TablePagination";
import { ExportButtons } from "../components/ExportButtons";
import { usePagination } from "../utils/usePagination";
import { normalizedIncludes } from "../utils/searchUtils";
import { toast } from "sonner@2.0.3";
import {
  AlertTriangle,
  Shield,
  ListChecks,
  Search,
  Filter,
  FilterX,
  Eye,
  Edit,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  FileText,
  Pill,
  AlertCircle,
  Info,
  Ban,
  ChevronRight,
  Download,
  TrendingUp,
  Activity,
  Settings,
  Save,
  X as XIcon,
  ShieldAlert,
  Bell,
  BellOff
} from "lucide-react";

// Datos mock de alertas clínicas activas
const mockAlerts = [
  {
    id: "ALT-001",
    type: "interaction",
    severity: "critical",
    status: "active",
    patientId: "PAT-0012",
    patientName: "María González Rodríguez",
    prescriptionId: "RX-2024-0156",
    medicine1: "Warfarina 5mg",
    medicine2: "Ácido acetilsalicílico 100mg",
    description: "Interacción medicamentosa severa: Riesgo aumentado de sangrado",
    recommendation: "Evitar combinación. Considerar alternativa antiagregante o ajustar dosis con monitoreo INR estricto",
    doctorId: "DOC-003",
    doctorName: "Dra. Isabel Moreno Castro",
    createdDate: "2024-09-30",
    createdTime: "14:25",
    acknowledgedBy: null,
    acknowledgedDate: null,
    action: "pending",
    clinicalEvidence: "Aumento del riesgo de hemorragia gastrointestinal y sangrado en SNC",
    references: ["FDA Drug Safety Communication 2014", "Micromedex DrugReax"]
  },
  {
    id: "ALT-002",
    type: "allergy",
    severity: "critical",
    status: "active",
    patientId: "PAT-0045",
    patientName: "Carlos Ramírez López",
    prescriptionId: "RX-2024-0178",
    medicine1: "Amoxicilina 500mg",
    medicine2: null,
    description: "Alergia registrada: Paciente alérgico a penicilinas",
    recommendation: "Contraindicación absoluta. Usar alternativa: Macrólidos o Quinolonas según indicación",
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Andrés Martínez López",
    createdDate: "2024-09-30",
    createdTime: "11:15",
    acknowledgedBy: null,
    acknowledgedDate: null,
    action: "pending",
    clinicalEvidence: "Historial de reacción anafiláctica previa a penicilina (2022-03-15)",
    references: ["Historia clínica electrónica"]
  },
  {
    id: "ALT-003",
    type: "contraindication",
    severity: "high",
    status: "active",
    patientId: "PAT-0089",
    patientName: "Ana Patricia Herrera",
    prescriptionId: "RX-2024-0165",
    medicine1: "Ibuprofeno 400mg",
    medicine2: null,
    description: "Contraindicación por condición médica: Insuficiencia renal crónica estadio 3",
    recommendation: "Evitar AINEs. Considerar paracetamol o analgésicos alternativos",
    doctorId: "DOC-005",
    doctorName: "Dr. Miguel Ángel Ruiz Sánchez",
    createdDate: "2024-09-30",
    createdTime: "09:45",
    acknowledgedBy: "DOC-005",
    acknowledgedDate: "2024-09-30 10:00",
    action: "modified",
    clinicalEvidence: "TFG estimado: 45 ml/min/1.73m²",
    references: ["Guías KDIGO 2024"]
  },
  {
    id: "ALT-004",
    type: "duplicate",
    severity: "medium",
    status: "active",
    patientId: "PAT-0067",
    patientName: "Roberto Sánchez Díaz",
    prescriptionId: "RX-2024-0182",
    medicine1: "Atorvastatina 20mg",
    medicine2: "Simvastatina 40mg",
    description: "Duplicidad terapéutica: Dos estatinas prescritas simultáneamente",
    recommendation: "Mantener solo una estatina. Suspender medicamento duplicado",
    doctorId: "DOC-002",
    doctorName: "Dra. Laura Sofía Ramírez Gómez",
    createdDate: "2024-09-29",
    createdTime: "16:30",
    acknowledgedBy: "DOC-002",
    acknowledgedDate: "2024-09-29 17:00",
    action: "cancelled",
    clinicalEvidence: "Mismo mecanismo de acción y clase terapéutica",
    references: ["Guías ACC/AHA Colesterol 2024"]
  },
  {
    id: "ALT-005",
    type: "dose",
    severity: "high",
    status: "active",
    patientId: "PAT-0123",
    patientName: "Elena Martínez Vega",
    prescriptionId: "RX-2024-0190",
    medicine1: "Metformina 850mg",
    medicine2: null,
    description: "Dosis máxima excedida: 3 tabletas c/8h (7650mg/día) supera dosis máxima de 3000mg/día",
    recommendation: "Ajustar a dosis máxima permitida: 1000mg c/8h o 850mg c/8h",
    doctorId: "DOC-004",
    doctorName: "Dr. José Luis Torres Mendoza",
    createdDate: "2024-09-29",
    createdTime: "14:00",
    acknowledgedBy: null,
    acknowledgedDate: null,
    action: "pending",
    clinicalEvidence: "Dosis máxima FDA: 2550mg/día. Dosis máxima práctica: 3000mg/día",
    references: ["FDA Label Metformin 2024", "UpToDate"]
  },
  {
    id: "ALT-006",
    type: "interaction",
    severity: "medium",
    status: "resolved",
    patientId: "PAT-0034",
    patientName: "Pedro Jiménez Castro",
    prescriptionId: "RX-2024-0145",
    medicine1: "Enalapril 10mg",
    medicine2: "Espironolactona 25mg",
    description: "Interacción medicamentosa moderada: Riesgo de hiperpotasemia",
    recommendation: "Monitorear niveles de potasio sérico. Considerar reducir dosis o suspender espironolactona",
    doctorId: "DOC-003",
    doctorName: "Dra. Isabel Moreno Castro",
    createdDate: "2024-09-28",
    createdTime: "10:20",
    acknowledgedBy: "DOC-003",
    acknowledgedDate: "2024-09-28 11:00",
    action: "accepted_risk",
    clinicalEvidence: "Potasio basal: 4.2 mEq/L. Función renal normal",
    references: ["Micromedex", "Lexicomp"]
  }
];

// Datos mock de reglas de interacciones
const mockInteractionRules = [
  {
    id: "RULE-001",
    name: "Warfarina + Antiagregantes plaquetarios",
    medicine1: "Warfarina",
    medicine2: "Ácido acetilsalicílico, Clopidogrel",
    severity: "critical",
    mechanism: "Efecto aditivo anticoagulante/antiagregante",
    clinicalEffect: "Riesgo aumentado de sangrado mayor",
    recommendation: "Evitar combinación o usar con extrema precaución y monitoreo INR frecuente",
    status: "active",
    evidenceLevel: "A",
    references: "FDA, Micromedex, Lexicomp",
    lastUpdated: "2024-09-15"
  },
  {
    id: "RULE-002",
    name: "IECAs + Espironolactona",
    medicine1: "Enalapril, Lisinopril, Ramipril",
    medicine2: "Espironolactona",
    severity: "high",
    mechanism: "Ambos aumentan potasio sérico",
    clinicalEffect: "Hiperpotasemia",
    recommendation: "Monitorear potasio sérico regularmente. Considerar ajuste de dosis",
    status: "active",
    evidenceLevel: "A",
    references: "UpToDate, ACC/AHA Guidelines",
    lastUpdated: "2024-08-20"
  },
  {
    id: "RULE-003",
    name: "AINEs + IECAs",
    medicine1: "Ibuprofeno, Naproxeno, Diclofenaco",
    medicine2: "Enalapril, Lisinopril, Losartán",
    severity: "high",
    mechanism: "Los AINEs reducen la eficacia de IECAs/ARA-II",
    clinicalEffect: "Disminución del efecto antihipertensivo y riesgo de deterioro de función renal",
    recommendation: "Evitar uso prolongado de AINEs. Monitorear presión arterial y función renal",
    status: "active",
    evidenceLevel: "A",
    references: "JNC-8, ESC/ESH Guidelines",
    lastUpdated: "2024-09-01"
  },
  {
    id: "RULE-004",
    name: "Metformina + Contraste yodado",
    medicine1: "Metformina",
    medicine2: "Contraste yodado (IV)",
    severity: "critical",
    mechanism: "Riesgo de acidosis láctica en caso de deterioro de función renal",
    clinicalEffect: "Acidosis láctica",
    recommendation: "Suspender metformina 48h antes y después del procedimiento con contraste. Verificar función renal",
    status: "active",
    evidenceLevel: "A",
    references: "FDA, ADA Guidelines",
    lastUpdated: "2024-07-10"
  },
  {
    id: "RULE-005",
    name: "Estatinas + Gemfibrozil",
    medicine1: "Atorvastatina, Simvastatina, Rosuvastatina",
    medicine2: "Gemfibrozil",
    severity: "critical",
    mechanism: "Gemfibrozil inhibe metabolismo de estatinas",
    clinicalEffect: "Riesgo severo de rabdomiólisis",
    recommendation: "Contraindicación absoluta. Usar fenofibrato en lugar de gemfibrozil si se requiere fibrato",
    status: "active",
    evidenceLevel: "A",
    references: "FDA Black Box Warning, ACC/AHA",
    lastUpdated: "2024-06-25"
  }
];

// Datos mock de tipos de alertas configurables
const mockAlertTypes = [
  {
    id: "TYPE-001",
    code: "INTERACTION_CRITICAL",
    name: "Interacción medicamentosa crítica",
    description: "Combinación de medicamentos con riesgo severo para la vida del paciente",
    severity: "critical",
    behavior: "block",
    requiresAcknowledgment: true,
    requiresJustification: true,
    notifyPharmacy: true,
    autoLog: true,
    status: "active",
    examples: "Warfarina + AAS, Estatinas + Gemfibrozil",
    lastModified: "2024-09-15",
    modifiedBy: "Admin"
  },
  {
    id: "TYPE-002",
    code: "ALLERGY_ABSOLUTE",
    name: "Alergia registrada",
    description: "Medicamento al que el paciente tiene alergia documentada",
    severity: "critical",
    behavior: "block",
    requiresAcknowledgment: true,
    requiresJustification: true,
    notifyPharmacy: true,
    autoLog: true,
    status: "active",
    examples: "Penicilina en paciente alérgico a beta-lactámicos",
    lastModified: "2024-09-10",
    modifiedBy: "Admin"
  },
  {
    id: "TYPE-003",
    code: "CONTRAINDICATION",
    name: "Contraindicación por condición médica",
    description: "Medicamento contraindicado por condición del paciente",
    severity: "high",
    behavior: "warn",
    requiresAcknowledgment: true,
    requiresJustification: true,
    notifyPharmacy: false,
    autoLog: true,
    status: "active",
    examples: "AINEs en insuficiencia renal, Beta-bloqueadores en asma severa",
    lastModified: "2024-08-20",
    modifiedBy: "Admin"
  },
  {
    id: "TYPE-004",
    code: "DUPLICATE_THERAPY",
    name: "Duplicidad terapéutica",
    description: "Dos o más medicamentos de la misma clase terapéutica",
    severity: "medium",
    behavior: "warn",
    requiresAcknowledgment: true,
    requiresJustification: false,
    notifyPharmacy: false,
    autoLog: true,
    status: "active",
    examples: "Dos estatinas, Dos IECAs, Dos IBP",
    lastModified: "2024-07-15",
    modifiedBy: "Admin"
  },
  {
    id: "TYPE-005",
    code: "DOSE_MAX_EXCEEDED",
    name: "Dosis máxima excedida",
    description: "La dosis prescrita supera el límite máximo permitido",
    severity: "high",
    behavior: "warn",
    requiresAcknowledgment: true,
    requiresJustification: true,
    notifyPharmacy: true,
    autoLog: true,
    status: "active",
    examples: "Metformina >3000mg/día, Paracetamol >4g/día",
    lastModified: "2024-09-01",
    modifiedBy: "Admin"
  },
  {
    id: "TYPE-006",
    code: "INTERACTION_MODERATE",
    name: "Interacción medicamentosa moderada",
    description: "Combinación que requiere monitoreo sin riesgo inmediato severo",
    severity: "medium",
    behavior: "info",
    requiresAcknowledgment: false,
    requiresJustification: false,
    notifyPharmacy: false,
    autoLog: true,
    status: "active",
    examples: "Levotiroxina + Hierro, Digoxina + Diuréticos",
    lastModified: "2024-06-30",
    modifiedBy: "Admin"
  },
  {
    id: "TYPE-007",
    code: "AGE_PEDIATRIC",
    name: "Alerta pediátrica",
    description: "Medicamento o dosis no adecuada para edad pediátrica",
    severity: "high",
    behavior: "warn",
    requiresAcknowledgment: true,
    requiresJustification: true,
    notifyPharmacy: true,
    autoLog: true,
    status: "active",
    examples: "Aspirina en menores de 12 años, Fluoroquinolonas en niños",
    lastModified: "2024-08-10",
    modifiedBy: "Admin"
  },
  {
    id: "TYPE-008",
    code: "PREGNANCY_RISK",
    name: "Riesgo en embarazo",
    description: "Medicamento categoría D o X en paciente embarazada",
    severity: "critical",
    behavior: "block",
    requiresAcknowledgment: true,
    requiresJustification: true,
    notifyPharmacy: true,
    autoLog: true,
    status: "active",
    examples: "Warfarina, Estatinas, IECAs en embarazo",
    lastModified: "2024-09-05",
    modifiedBy: "Admin"
  }
];

// Componente: Bandeja de alertas clínicas
export function BandejaAlertasPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState<typeof mockAlerts[0] | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  // Filtrar alertas
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      normalizedIncludes(alert.patientName, searchTerm) ||
      normalizedIncludes(alert.id, searchTerm) ||
      normalizedIncludes(alert.medicine1, searchTerm) ||
      normalizedIncludes(alert.doctorName, searchTerm);
    
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    const matchesType = typeFilter === "all" || alert.type === typeFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesType;
  });

  // Estadísticas
  const stats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    critical: alerts.filter(a => a.severity === 'critical' && a.status === 'active').length,
    high: alerts.filter(a => a.severity === 'high' && a.status === 'active').length,
    pending: alerts.filter(a => a.action === 'pending').length,
    resolved: alerts.filter(a => a.status === 'resolved').length
  };

  const getSeverityBadge = (severity: string) => {
    const config = {
      critical: { label: "Crítica", className: "bg-red-100 text-red-700 border-red-300" },
      high: { label: "Alta", className: "bg-orange-100 text-orange-700 border-orange-300" },
      medium: { label: "Media", className: "bg-yellow-100 text-yellow-700 border-yellow-300" },
      low: { label: "Baja", className: "bg-blue-100 text-blue-700 border-blue-300" }
    };
    return config[severity as keyof typeof config] || config.medium;
  };

  const getTypeBadge = (type: string) => {
    const config = {
      interaction: { label: "Interacción", icon: ShieldAlert },
      allergy: { label: "Alergia", icon: Ban },
      contraindication: { label: "Contraindicación", icon: XCircle },
      duplicate: { label: "Duplicidad", icon: AlertCircle },
      dose: { label: "Dosis", icon: Pill }
    };
    return config[type as keyof typeof config] || { label: type, icon: AlertTriangle };
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: "Activa", className: "bg-orange-100 text-orange-700 border-orange-300" },
      resolved: { label: "Resuelta", className: "bg-green-100 text-green-700 border-green-300" }
    };
    return config[status as keyof typeof config] || config.active;
  };

  const handleDoubleClick = (alert: typeof mockAlerts[0]) => {
    setSelectedAlert(alert);
    setIsDetailsPanelOpen(true);
  };

  const handleResolveAlert = (alertId: string, action: string) => {
    setAlerts(alerts.map(a => 
      a.id === alertId ? { ...a, status: 'resolved' as const, action, acknowledgedBy: 'Usuario actual', acknowledgedDate: new Date().toISOString() } : a
    ));
    toast.success('Alerta resuelta', {
      description: 'La alerta ha sido procesada correctamente',
      duration: 4000,
    });
    setIsDetailsPanelOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-500 to-red-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Bandeja de Alertas Clínicas (CDS)</h1>
              <p className="text-red-100 text-sm">
                Sistema de Soporte a la Decisión Clínica en tiempo real
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total alertas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Bell className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
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
                <p className="text-sm text-gray-600">Críticas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.critical}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alta prioridad</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.high}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resueltas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.resolved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
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
                placeholder="Buscar por paciente, ID, medicamento o médico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Severidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="critical">Críticas</SelectItem>
                  <SelectItem value="high">Altas</SelectItem>
                  <SelectItem value="medium">Medias</SelectItem>
                  <SelectItem value="low">Bajas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="resolved">Resueltas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="interaction">Interacción</SelectItem>
                  <SelectItem value="allergy">Alergia</SelectItem>
                  <SelectItem value="contraindication">Contraindicación</SelectItem>
                  <SelectItem value="duplicate">Duplicidad</SelectItem>
                  <SelectItem value="dose">Dosis</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm || severityFilter !== "all" || statusFilter !== "all" || typeFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSeverityFilter("all");
                    setStatusFilter("all");
                    setTypeFilter("all");
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

      {/* Tabla de alertas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Alertas Clínicas Activas</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {filteredAlerts.length} alerta{filteredAlerts.length !== 1 ? 's' : ''} encontrada{filteredAlerts.length !== 1 ? 's' : ''} • Doble clic para ver detalles
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No hay alertas activas</h3>
              <p className="text-sm text-gray-600">
                Todas las alertas han sido resueltas o no hay alertas que coincidan con los filtros.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Medicamento(s)</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Médico</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => {
                    const severityBadge = getSeverityBadge(alert.severity);
                    const typeBadge = getTypeBadge(alert.type);
                    const statusBadge = getStatusBadge(alert.status);
                    const TypeIcon = typeBadge.icon;

                    return (
                      <TableRow
                        key={alert.id}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onDoubleClick={() => handleDoubleClick(alert)}
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-900">{alert.createdDate}</span>
                            <span className="text-xs text-gray-600">{alert.createdTime}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {typeBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={severityBadge.className}>
                            {severityBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{alert.patientName}</p>
                            <p className="text-xs text-gray-600">{alert.patientId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-900">{alert.medicine1}</p>
                            {alert.medicine2 && (
                              <p className="text-xs text-gray-600 mt-1">+ {alert.medicine2}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-900 max-w-md truncate">
                            {alert.description}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm text-gray-900">{alert.doctorName}</p>
                            <p className="text-xs text-gray-600">{alert.doctorId}</p>
                          </div>
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
                              setSelectedAlert(alert);
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
          )}
        </CardContent>
      </Card>

      {/* Información de ayuda */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg flex-shrink-0">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-red-900 mb-1">Sistema de Soporte a la Decisión Clínica (CDS)</h4>
              <ul className="space-y-1 text-sm text-red-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Alertas críticas: Bloquean la prescripción hasta ser resueltas por el médico</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Alertas altas: Requieren confirmación explícita del prescriptor</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Todas las interacciones quedan registradas con trazabilidad completa</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de detalles */}
      {selectedAlert && (
        <AlertDetailDialog
          alert={selectedAlert}
          open={isDetailsPanelOpen}
          onOpenChange={setIsDetailsPanelOpen}
          onResolve={handleResolveAlert}
        />
      )}
    </div>
  );
}

// Componente: Reglas e interacciones
export function ReglasAlertasPage() {
  const [rules, setRules] = useState(mockInteractionRules);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRule, setSelectedRule] = useState<typeof mockInteractionRules[0] | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [isNewRuleDialogOpen, setIsNewRuleDialogOpen] = useState(false);

  // Filtrar reglas
  const filteredRules = rules.filter(rule => {
    const matchesSearch = 
      normalizedIncludes(rule.name, searchTerm) ||
      normalizedIncludes(rule.medicine1, searchTerm) ||
      normalizedIncludes(rule.medicine2, searchTerm);
    
    const matchesSeverity = severityFilter === "all" || rule.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || rule.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Estadísticas
  const stats = {
    total: rules.length,
    active: rules.filter(r => r.status === 'active').length,
    critical: rules.filter(r => r.severity === 'critical').length,
    high: rules.filter(r => r.severity === 'high').length,
    evidenceA: rules.filter(r => r.evidenceLevel === 'A').length
  };

  const getSeverityBadge = (severity: string) => {
    const config = {
      critical: { label: "Crítica", className: "bg-red-100 text-red-700 border-red-300" },
      high: { label: "Alta", className: "bg-orange-100 text-orange-700 border-orange-300" },
      medium: { label: "Media", className: "bg-yellow-100 text-yellow-700 border-yellow-300" }
    };
    return config[severity as keyof typeof config] || config.medium;
  };

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white">Reglas e Interacciones</h1>
                <p className="text-blue-100 text-sm">
                  Base de conocimiento de interacciones medicamentosas
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <Button
                onClick={() => setIsNewRuleDialogOpen(true)}
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nueva regla
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total reglas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
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
                <p className="text-sm text-gray-600">Críticas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.critical}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alta severidad</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.high}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Evidencia A</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.evidenceA}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
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
                placeholder="Buscar por nombre de regla o medicamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Severidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="critical">Críticas</SelectItem>
                  <SelectItem value="high">Altas</SelectItem>
                  <SelectItem value="medium">Medias</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="inactive">Inactivas</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm || severityFilter !== "all" || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSeverityFilter("all");
                    setStatusFilter("all");
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

      {/* Tabla de reglas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reglas de Interacciones</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {filteredRules.length} regla{filteredRules.length !== 1 ? 's' : ''} encontrada{filteredRules.length !== 1 ? 's' : ''} • Doble clic para editar
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre de la regla</TableHead>
                  <TableHead>Medicamento 1</TableHead>
                  <TableHead>Medicamento 2</TableHead>
                  <TableHead>Severidad</TableHead>
                  <TableHead>Efecto clínico</TableHead>
                  <TableHead className="text-center">Evidencia</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => {
                  const severityBadge = getSeverityBadge(rule.severity);
                  return (
                    <TableRow
                      key={rule.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onDoubleClick={() => {
                        setSelectedRule(rule);
                        setIsDetailsPanelOpen(true);
                      }}
                    >
                      <TableCell>
                        <p className="font-medium text-gray-900">{rule.name}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-900">{rule.medicine1}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-900">{rule.medicine2}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={severityBadge.className}>
                          {severityBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-900 max-w-md truncate">
                          {rule.clinicalEffect}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                          Nivel {rule.evidenceLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={
                          rule.status === 'active' 
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        }>
                          {rule.status === 'active' ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRule(rule);
                            setIsDetailsPanelOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
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

      {/* Nueva regla dialog */}
      <NewRuleDialog
        open={isNewRuleDialogOpen}
        onOpenChange={setIsNewRuleDialogOpen}
      />

      {/* Panel de detalles de regla */}
      {selectedRule && (
        <RuleDetailDialog
          rule={selectedRule}
          open={isDetailsPanelOpen}
          onOpenChange={setIsDetailsPanelOpen}
        />
      )}
    </div>
  );
}

// Componente: Tipos de alertas
export function TiposAlertasPage() {
  const [alertTypes, setAlertTypes] = useState(mockAlertTypes);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [behaviorFilter, setBehaviorFilter] = useState("all");
  const [selectedType, setSelectedType] = useState<typeof mockAlertTypes[0] | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  // Filtrar tipos
  const filteredTypes = alertTypes.filter(type => {
    const matchesSearch = 
      normalizedIncludes(type.name, searchTerm) ||
      normalizedIncludes(type.code, searchTerm) ||
      normalizedIncludes(type.description, searchTerm);
    
    const matchesSeverity = severityFilter === "all" || type.severity === severityFilter;
    const matchesBehavior = behaviorFilter === "all" || type.behavior === behaviorFilter;
    
    return matchesSearch && matchesSeverity && matchesBehavior;
  });

  // Estadísticas
  const stats = {
    total: alertTypes.length,
    active: alertTypes.filter(t => t.status === 'active').length,
    block: alertTypes.filter(t => t.behavior === 'block').length,
    warn: alertTypes.filter(t => t.behavior === 'warn').length,
    critical: alertTypes.filter(t => t.severity === 'critical').length
  };

  const getSeverityBadge = (severity: string) => {
    const config = {
      critical: { label: "Crítica", className: "bg-red-100 text-red-700 border-red-300" },
      high: { label: "Alta", className: "bg-orange-100 text-orange-700 border-orange-300" },
      medium: { label: "Media", className: "bg-yellow-100 text-yellow-700 border-yellow-300" }
    };
    return config[severity as keyof typeof config] || config.medium;
  };

  const getBehaviorBadge = (behavior: string) => {
    const config = {
      block: { label: "Bloquea", className: "bg-red-100 text-red-700 border-red-300" },
      warn: { label: "Advierte", className: "bg-orange-100 text-orange-700 border-orange-300" },
      info: { label: "Informa", className: "bg-blue-100 text-blue-700 border-blue-300" }
    };
    return config[behavior as keyof typeof config] || config.info;
  };

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <ListChecks className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Tipos de Alertas</h1>
              <p className="text-purple-100 text-sm">
                Configuración de categorías y comportamiento de alertas clínicas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total tipos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <ListChecks className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
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
                <p className="text-sm text-gray-600">Bloquean</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.block}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Ban className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Advierten</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.warn}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
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
                <ShieldAlert className="w-6 h-6 text-red-600" />
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
                placeholder="Buscar por nombre, código o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Severidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                </SelectContent>
              </Select>

              <Select value={behaviorFilter} onValueChange={setBehaviorFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Comportamiento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="block">Bloquea</SelectItem>
                  <SelectItem value="warn">Advierte</SelectItem>
                  <SelectItem value="info">Informa</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm || severityFilter !== "all" || behaviorFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSeverityFilter("all");
                    setBehaviorFilter("all");
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

      {/* Tabla de tipos de alertas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tipos de Alertas Configuradas</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {filteredTypes.length} tipo{filteredTypes.length !== 1 ? 's' : ''} encontrado{filteredTypes.length !== 1 ? 's' : ''} • Doble clic para configurar
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Severidad</TableHead>
                  <TableHead>Comportamiento</TableHead>
                  <TableHead className="text-center">Requiere aceptación</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTypes.map((type) => {
                  const severityBadge = getSeverityBadge(type.severity);
                  const behaviorBadge = getBehaviorBadge(type.behavior);
                  return (
                    <TableRow
                      key={type.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onDoubleClick={() => {
                        setSelectedType(type);
                        setIsDetailsPanelOpen(true);
                      }}
                    >
                      <TableCell>
                        <span className="font-mono text-sm">{type.code}</span>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-gray-900">{type.name}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-900 max-w-md truncate">
                          {type.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={severityBadge.className}>
                          {severityBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={behaviorBadge.className}>
                          {behaviorBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {type.requiresAcknowledgment ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={
                          type.status === 'active' 
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "bg-gray-100 text-gray-700 border-gray-300"
                        }>
                          {type.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedType(type);
                            setIsDetailsPanelOpen(true);
                          }}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Configurar
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

      {/* Panel de configuración */}
      {selectedType && (
        <AlertTypeConfigDialog
          alertType={selectedType}
          open={isDetailsPanelOpen}
          onOpenChange={setIsDetailsPanelOpen}
        />
      )}
    </div>
  );
}

// Componente auxiliar: Diálogo de detalles de alerta
function AlertDetailDialog({ 
  alert, 
  open, 
  onOpenChange,
  onResolve
}: { 
  alert: typeof mockAlerts[0]; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onResolve: (alertId: string, action: string) => void;
}) {
  const [action, setAction] = useState("");
  const [justification, setJustification] = useState("");

  const getSeverityBadge = (severity: string) => {
    const config = {
      critical: { label: "Crítica", className: "bg-red-100 text-red-700 border-red-300" },
      high: { label: "Alta", className: "bg-orange-100 text-orange-700 border-orange-300" },
      medium: { label: "Media", className: "bg-yellow-100 text-yellow-700 border-yellow-300" }
    };
    return config[severity as keyof typeof config] || config.medium;
  };

  const handleSubmit = () => {
    if (!action) {
      toast.error('Selecciona una acción', {
        description: 'Debes seleccionar cómo resolver la alerta',
      });
      return;
    }

    if (alert.severity === 'critical' && !justification) {
      toast.error('Justificación requerida', {
        description: 'Las alertas críticas requieren justificación',
      });
      return;
    }

    onResolve(alert.id, action);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Detalles de la Alerta Clínica
          </DialogTitle>
          <DialogDescription>
            Revisa la información completa y toma una decisión clínica informada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información de la alerta */}
          <div>
            <h4 className="font-medium mb-3">Información de la alerta</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-gray-600">ID de alerta</Label>
                <p className="font-mono text-sm mt-1">{alert.id}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Severidad</Label>
                <div className="mt-2">
                  <Badge variant="outline" className={getSeverityBadge(alert.severity).className}>
                    {getSeverityBadge(alert.severity).label}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Fecha y hora</Label>
                <p className="mt-1">{alert.createdDate} {alert.createdTime}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Paciente */}
          <div>
            <h4 className="font-medium mb-3">Paciente</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Nombre</Label>
                <p className="font-medium mt-1">{alert.patientName}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">ID Paciente</Label>
                <p className="font-mono text-sm mt-1">{alert.patientId}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Medicamentos involucrados */}
          <div>
            <h4 className="font-medium mb-3">Medicamentos involucrados</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Medicamento 1</Label>
                <p className="font-medium mt-1">{alert.medicine1}</p>
              </div>
              {alert.medicine2 && (
                <div>
                  <Label className="text-sm text-gray-600">Medicamento 2</Label>
                  <p className="font-medium mt-1">{alert.medicine2}</p>
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Descripción clínica */}
          <div>
            <h4 className="font-medium mb-3">Descripción clínica</h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-900 font-medium mb-2">{alert.description}</p>
              <p className="text-sm text-red-700">{alert.clinicalEvidence}</p>
            </div>
          </div>

          {/* Recomendación */}
          <div>
            <h4 className="font-medium mb-3">Recomendación</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900">{alert.recommendation}</p>
            </div>
          </div>

          {/* Referencias */}
          <div>
            <Label className="text-sm text-gray-600">Referencias bibliográficas</Label>
            <p className="text-sm mt-1">{alert.references}</p>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Médico prescriptor */}
          <div>
            <h4 className="font-medium mb-3">Médico prescriptor</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Nombre</Label>
                <p className="mt-1">{alert.doctorName}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">ID Médico</Label>
                <p className="font-mono text-sm mt-1">{alert.doctorId}</p>
              </div>
            </div>
          </div>

          {alert.status === 'active' && (
            <>
              <div className="h-px bg-gray-200" />

              {/* Resolución */}
              <div>
                <h4 className="font-medium mb-3">Resolución de la alerta</h4>
                <div className="space-y-4">
                  <div>
                    <Label>Acción tomada *</Label>
                    <Select value={action} onValueChange={setAction}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una acción..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cancelled">Cancelar prescripción</SelectItem>
                        <SelectItem value="modified">Modificar medicamento/dosis</SelectItem>
                        <SelectItem value="accepted_risk">Aceptar riesgo con justificación</SelectItem>
                        <SelectItem value="consultation">Solicitar interconsulta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Justificación clínica {alert.severity === 'critical' && '*'}</Label>
                    <Textarea
                      placeholder="Describe la justificación médica para la decisión tomada..."
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          {alert.status === 'active' && (
            <Button onClick={handleSubmit}>
              <Save className="w-4 h-4 mr-2" />
              Resolver alerta
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente auxiliar: Diálogo de nueva regla
function NewRuleDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
}) {
  const [name, setName] = useState("");
  const [medicine1, setMedicine1] = useState("");
  const [medicine2, setMedicine2] = useState("");
  const [severity, setSeverity] = useState("medium");

  const handleSubmit = () => {
    if (!name || !medicine1 || !medicine2) {
      toast.error('Campos incompletos', {
        description: 'Completa todos los campos obligatorios',
      });
      return;
    }

    toast.success('Regla creada', {
      description: `La regla "${name}" ha sido registrada`,
      duration: 4000,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nueva Regla de Interacción</DialogTitle>
          <DialogDescription>
            Registra una nueva regla de interacción medicamentosa
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>Nombre de la regla *</Label>
            <Input
              placeholder="Ej: Warfarina + Antiagregantes"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Medicamento 1 *</Label>
              <Input
                placeholder="Ej: Warfarina"
                value={medicine1}
                onChange={(e) => setMedicine1(e.target.value)}
              />
            </div>
            <div>
              <Label>Medicamento 2 *</Label>
              <Input
                placeholder="Ej: Ácido acetilsalicílico"
                value={medicine2}
                onChange={(e) => setMedicine2(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Severidad *</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Crítica</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Crear regla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente auxiliar: Diálogo de edición de regla
function EditRuleDialog({ 
  rule,
  open, 
  onOpenChange 
}: { 
  rule: typeof mockInteractionRules[0];
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
}) {
  const [name, setName] = useState(rule.name);
  const [medicine1, setMedicine1] = useState(rule.medicine1);
  const [medicine2, setMedicine2] = useState(rule.medicine2);
  const [severity, setSeverity] = useState(rule.severity);
  const [mechanism, setMechanism] = useState(rule.mechanism);
  const [clinicalEffect, setClinicalEffect] = useState(rule.clinicalEffect);
  const [recommendation, setRecommendation] = useState(rule.recommendation);
  const [evidenceLevel, setEvidenceLevel] = useState(rule.evidenceLevel);
  const [references, setReferences] = useState(rule.references);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reinicializar valores cuando cambia la regla
  useState(() => {
    if (open) {
      setName(rule.name);
      setMedicine1(rule.medicine1);
      setMedicine2(rule.medicine2);
      setSeverity(rule.severity);
      setMechanism(rule.mechanism);
      setClinicalEffect(rule.clinicalEffect);
      setRecommendation(rule.recommendation);
      setEvidenceLevel(rule.evidenceLevel);
      setReferences(rule.references);
    }
  });

  const handleSubmit = async () => {
    if (!name || !medicine1 || !medicine2 || !mechanism || !clinicalEffect || !recommendation) {
      toast.error('Campos incompletos', {
        description: 'Completa todos los campos obligatorios marcados con *',
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular procesamiento asíncrono (en producción, aquí iría la llamada a la API)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedRule = {
        ...rule,
        name,
        medicine1,
        medicine2,
        severity,
        mechanism,
        clinicalEffect,
        recommendation,
        evidenceLevel,
        references,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      console.log('Regla actualizada:', updatedRule);

      toast.success('Regla actualizada exitosamente', {
        description: `La regla "${name}" ha sido modificada correctamente`,
        duration: 4000,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error al actualizar regla:', error);
      toast.error('Error al actualizar la regla', {
        description: 'Ocurrió un problema al procesar los cambios. Por favor, intente nuevamente.',
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (isSubmitting) return;
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-primary" />
            Editar Regla de Interacción
          </DialogTitle>
          <DialogDescription>
            Modifica los datos de la regla de interacción medicamentosa. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Información de identificación */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <Label className="text-sm font-medium text-blue-900">Identificador</Label>
            </div>
            <p className="font-mono text-sm text-blue-700">{rule.id}</p>
          </div>

          {/* Nombre de la regla */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la regla *</Label>
            <Input
              id="name"
              placeholder="Ej: Warfarina + Antiagregantes plaquetarios"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-600">
              Nombre descriptivo de la interacción
            </p>
          </div>

          {/* Medicamentos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medicine1">Medicamento(s) 1 *</Label>
              <Input
                id="medicine1"
                placeholder="Ej: Warfarina"
                value={medicine1}
                onChange={(e) => setMedicine1(e.target.value)}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-600">
                Primer medicamento o grupo de medicamentos
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicine2">Medicamento(s) 2 *</Label>
              <Input
                id="medicine2"
                placeholder="Ej: Ácido acetilsalicílico, Clopidogrel"
                value={medicine2}
                onChange={(e) => setMedicine2(e.target.value)}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-600">
                Segundo medicamento o grupo de medicamentos
              </p>
            </div>
          </div>

          {/* Severidad */}
          <div className="space-y-2">
            <Label htmlFor="severity">Severidad *</Label>
            <Select value={severity} onValueChange={setSeverity} disabled={isSubmitting}>
              <SelectTrigger id="severity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                    <span>Crítica</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-600" />
                    <span>Alta</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-600" />
                    <span>Media</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mecanismo de interacción */}
          <div className="space-y-2">
            <Label htmlFor="mechanism">Mecanismo de interacción *</Label>
            <Textarea
              id="mechanism"
              placeholder="Describe cómo se produce la interacción a nivel farmacológico..."
              value={mechanism}
              onChange={(e) => setMechanism(e.target.value)}
              rows={2}
              className="resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-600">
              Explicación farmacológica de la interacción
            </p>
          </div>

          {/* Efecto clínico */}
          <div className="space-y-2">
            <Label htmlFor="clinicalEffect">Efecto clínico *</Label>
            <Textarea
              id="clinicalEffect"
              placeholder="Describe las consecuencias clínicas de la interacción..."
              value={clinicalEffect}
              onChange={(e) => setClinicalEffect(e.target.value)}
              rows={2}
              className="resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-600">
              Manifestaciones clínicas y riesgos para el paciente
            </p>
          </div>

          {/* Recomendación */}
          <div className="space-y-2">
            <Label htmlFor="recommendation">Recomendación *</Label>
            <Textarea
              id="recommendation"
              placeholder="Indica las acciones recomendadas ante esta interacción..."
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              rows={3}
              className="resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-600">
              Guía de manejo clínico y alternativas terapéuticas
            </p>
          </div>

          {/* Nivel de evidencia y referencias */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="evidenceLevel">Nivel de evidencia</Label>
              <Select value={evidenceLevel} onValueChange={setEvidenceLevel} disabled={isSubmitting}>
                <SelectTrigger id="evidenceLevel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Nivel A - Evidencia sólida</SelectItem>
                  <SelectItem value="B">Nivel B - Evidencia moderada</SelectItem>
                  <SelectItem value="C">Nivel C - Evidencia limitada</SelectItem>
                  <SelectItem value="D">Nivel D - Opinión de expertos</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600">
                Calidad de la evidencia científica
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="references">Referencias bibliográficas</Label>
              <Input
                id="references"
                placeholder="Ej: FDA, Micromedex, Lexicomp"
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-600">
                Fuentes de información científica
              </p>
            </div>
          </div>

          {/* Información de última actualización */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Última actualización: {rule.lastUpdated}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Guardando cambios...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente auxiliar: Diálogo de detalles de regla
function RuleDetailDialog({ 
  rule, 
  open, 
  onOpenChange 
}: { 
  rule: typeof mockInteractionRules[0]; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles de la Regla</DialogTitle>
            <DialogDescription>
              Información completa de la regla de interacción
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Nombre de la regla</Label>
                <p className="font-medium mt-1">{rule.name}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">ID</Label>
                <p className="font-mono text-sm mt-1">{rule.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Medicamento(s) 1</Label>
                <p className="mt-1">{rule.medicine1}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Medicamento(s) 2</Label>
                <p className="mt-1">{rule.medicine2}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Mecanismo de interacción</Label>
              <p className="mt-1">{rule.mechanism}</p>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Efecto clínico</Label>
              <p className="mt-1 text-red-700 font-medium">{rule.clinicalEffect}</p>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Recomendación</Label>
              <p className="mt-1">{rule.recommendation}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Nivel de evidencia</Label>
                <p className="mt-1">Nivel {rule.evidenceLevel}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Referencias</Label>
                <p className="text-sm mt-1">{rule.references}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button onClick={handleEditClick}>
              <Edit className="w-4 h-4 mr-2" />
              Editar regla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditRuleDialog 
        rule={rule}
        open={isEditDialogOpen}
        onOpenChange={handleEditDialogClose}
      />
    </>
  );
}

// Componente auxiliar: Diálogo de configuración de tipo de alerta
function AlertTypeConfigDialog({ 
  alertType, 
  open, 
  onOpenChange 
}: { 
  alertType: typeof mockAlertTypes[0]; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
}) {
  const [requiresAck, setRequiresAck] = useState(alertType.requiresAcknowledgment);
  const [requiresJust, setRequiresJust] = useState(alertType.requiresJustification);
  const [notifyPharmacy, setNotifyPharmacy] = useState(alertType.notifyPharmacy);
  const [autoLog, setAutoLog] = useState(alertType.autoLog);

  const handleSave = () => {
    toast.success('Configuración guardada', {
      description: `Tipo de alerta "${alertType.name}" actualizado`,
      duration: 4000,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurar Tipo de Alerta</DialogTitle>
          <DialogDescription>
            Ajusta el comportamiento de este tipo de alerta clínica
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h4 className="font-medium mb-3">Información básica</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Código</Label>
                <p className="font-mono text-sm mt-1">{alertType.code}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Nombre</Label>
                <p className="font-medium mt-1">{alertType.name}</p>
              </div>
            </div>
            <div className="mt-3">
              <Label className="text-sm text-gray-600">Descripción</Label>
              <p className="text-sm mt-1">{alertType.description}</p>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          <div>
            <h4 className="font-medium mb-3">Configuración de comportamiento</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Requiere aceptación del médico</Label>
                  <p className="text-sm text-gray-600">El médico debe confirmar que revisó la alerta</p>
                </div>
                <Switch checked={requiresAck} onCheckedChange={setRequiresAck} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Requiere justificación clínica</Label>
                  <p className="text-sm text-gray-600">El médico debe justificar su decisión por escrito</p>
                </div>
                <Switch checked={requiresJust} onCheckedChange={setRequiresJust} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificar a farmacia</Label>
                  <p className="text-sm text-gray-600">Enviar notificación automática al servicio de farmacia</p>
                </div>
                <Switch checked={notifyPharmacy} onCheckedChange={setNotifyPharmacy} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Registro automático en auditoría</Label>
                  <p className="text-sm text-gray-600">Guardar todas las alertas de este tipo en el log</p>
                </div>
                <Switch checked={autoLog} onCheckedChange={setAutoLog} />
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          <div>
            <Label className="text-sm text-gray-600">Ejemplos</Label>
            <p className="text-sm mt-1 text-gray-700">{alertType.examples}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Guardar configuración
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
