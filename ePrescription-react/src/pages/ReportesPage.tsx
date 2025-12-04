import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { TablePagination } from "../components/TablePagination";
import { ExportButtons } from "../components/ExportButtons";
import { usePagination } from "../utils/usePagination";
import { normalizedIncludes } from "../utils/searchUtils";
import { toast } from "sonner@2.0.3";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  FileText,
  Search,
  Filter,
  FilterX,
  Eye,
  Users,
  Pill,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  DollarSign,
  TrendingDown,
  User,
  Building2,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  FileClock,
  Stethoscope,
  ShoppingCart,
  PieChart
} from "lucide-react";

// Datos mock de actividad por médico
const mockDoctorActivity = [
  {
    id: "DOC-001",
    doctorName: "Dr. Carlos Andrés Martínez López",
    specialty: "Medicina Interna",
    department: "Consulta Externa",
    period: "Septiembre 2024",
    totalPrescriptions: 156,
    activePrescriptions: 142,
    dispensedPrescriptions: 128,
    pendingPrescriptions: 14,
    rejectedPrescriptions: 12,
    averagePerDay: 5.2,
    mostPrescribedMedicine: "Paracetamol 500mg",
    totalPatients: 98,
    criticalAlerts: 3,
    moderateAlerts: 12,
    totalCost: 8456.32,
    workingDays: 30
  },
  {
    id: "DOC-002",
    doctorName: "Dra. Laura Sofía Ramírez Gómez",
    specialty: "Medicina Familiar",
    department: "Dirección Médica",
    period: "Septiembre 2024",
    totalPrescriptions: 234,
    activePrescriptions: 198,
    dispensedPrescriptions: 187,
    pendingPrescriptions: 11,
    rejectedPrescriptions: 25,
    averagePerDay: 7.8,
    mostPrescribedMedicine: "Losartán 50mg",
    totalPatients: 145,
    criticalAlerts: 5,
    moderateAlerts: 18,
    totalCost: 12678.45,
    workingDays: 30
  },
  {
    id: "DOC-003",
    doctorName: "Dra. Isabel Moreno Castro",
    specialty: "Cardiología",
    department: "Cardiología",
    period: "Septiembre 2024",
    totalPrescriptions: 189,
    activePrescriptions: 167,
    dispensedPrescriptions: 156,
    pendingPrescriptions: 11,
    rejectedPrescriptions: 18,
    averagePerDay: 6.3,
    mostPrescribedMedicine: "Atorvastatina 20mg",
    totalPatients: 112,
    criticalAlerts: 7,
    moderateAlerts: 24,
    totalCost: 15234.78,
    workingDays: 30
  },
  {
    id: "DOC-004",
    doctorName: "Dr. José Luis Torres Mendoza",
    specialty: "Endocrinología",
    department: "Medicina Especializada",
    period: "Septiembre 2024",
    totalPrescriptions: 198,
    activePrescriptions: 176,
    dispensedPrescriptions: 165,
    pendingPrescriptions: 11,
    rejectedPrescriptions: 20,
    averagePerDay: 6.6,
    mostPrescribedMedicine: "Metformina 850mg",
    totalPatients: 124,
    criticalAlerts: 4,
    moderateAlerts: 16,
    totalCost: 9876.54,
    workingDays: 30
  },
  {
    id: "DOC-005",
    doctorName: "Dr. Miguel Ángel Ruiz Sánchez",
    specialty: "Medicina General",
    department: "Urgencias",
    period: "Septiembre 2024",
    totalPrescriptions: 312,
    activePrescriptions: 278,
    dispensedPrescriptions: 261,
    pendingPrescriptions: 17,
    rejectedPrescriptions: 29,
    averagePerDay: 10.4,
    mostPrescribedMedicine: "Ibuprofeno 400mg",
    totalPatients: 198,
    criticalAlerts: 8,
    moderateAlerts: 31,
    totalCost: 11234.89,
    workingDays: 30
  }
];

// Datos mock de actividad de farmacia
const mockPharmacyActivity = [
  {
    id: "PHARM-001",
    date: "2024-10-01",
    totalDispensations: 45,
    totalPrescriptions: 52,
    pendingPrescriptions: 7,
    rejectedPrescriptions: 3,
    verificationTime: "4.2 min",
    dispensationTime: "6.8 min",
    stockAdjustments: 5,
    lowStockAlerts: 12,
    totalValue: 2345.67,
    pharmacist: "Ana García",
    shift: "Mañana"
  },
  {
    id: "PHARM-002",
    date: "2024-10-01",
    totalDispensations: 38,
    totalPrescriptions: 42,
    pendingPrescriptions: 4,
    rejectedPrescriptions: 2,
    verificationTime: "3.9 min",
    dispensationTime: "6.2 min",
    stockAdjustments: 3,
    lowStockAlerts: 8,
    totalValue: 1987.34,
    pharmacist: "Luis Fernández",
    shift: "Tarde"
  },
  {
    id: "PHARM-003",
    date: "2024-09-30",
    totalDispensations: 52,
    totalPrescriptions: 58,
    pendingPrescriptions: 6,
    rejectedPrescriptions: 4,
    verificationTime: "4.5 min",
    dispensationTime: "7.1 min",
    stockAdjustments: 7,
    lowStockAlerts: 15,
    totalValue: 2876.45,
    pharmacist: "Ana García",
    shift: "Mañana"
  },
  {
    id: "PHARM-004",
    date: "2024-09-30",
    totalDispensations: 41,
    totalPrescriptions: 47,
    pendingPrescriptions: 6,
    rejectedPrescriptions: 3,
    verificationTime: "4.1 min",
    dispensationTime: "6.5 min",
    stockAdjustments: 4,
    lowStockAlerts: 10,
    totalValue: 2156.78,
    pharmacist: "Luis Fernández",
    shift: "Tarde"
  },
  {
    id: "PHARM-005",
    date: "2024-09-29",
    totalDispensations: 47,
    totalPrescriptions: 53,
    pendingPrescriptions: 6,
    rejectedPrescriptions: 2,
    verificationTime: "3.8 min",
    dispensationTime: "6.0 min",
    stockAdjustments: 6,
    lowStockAlerts: 11,
    totalValue: 2543.21,
    pharmacist: "Ana García",
    shift: "Mañana"
  }
];

// Datos mock de reportes disponibles
const mockReportTemplates = [
  {
    id: "REP-001",
    name: "Reporte Mensual de Prescripciones",
    category: "Prescripciones",
    description: "Estadísticas completas de prescripciones emitidas por período",
    frequency: "Mensual",
    format: ["PDF", "Excel", "CSV"],
    lastGenerated: "2024-09-30",
    estimatedTime: "2-3 min",
    size: "2.4 MB"
  },
  {
    id: "REP-002",
    name: "Actividad por Médico",
    category: "Médicos",
    description: "Análisis detallado de prescripciones por médico",
    frequency: "Mensual",
    format: ["PDF", "Excel"],
    lastGenerated: "2024-09-30",
    estimatedTime: "3-4 min",
    size: "1.8 MB"
  },
  {
    id: "REP-003",
    name: "Inventario y Stock",
    category: "Farmacia",
    description: "Estado actual de inventario, alertas y movimientos",
    frequency: "Semanal",
    format: ["PDF", "Excel"],
    lastGenerated: "2024-10-01",
    estimatedTime: "1-2 min",
    size: "1.2 MB"
  },
  {
    id: "REP-004",
    name: "Dispensaciones de Farmacia",
    category: "Farmacia",
    description: "Reporte completo de dispensaciones realizadas",
    frequency: "Diario",
    format: ["PDF", "Excel", "CSV"],
    lastGenerated: "2024-10-01",
    estimatedTime: "1-2 min",
    size: "950 KB"
  },
  {
    id: "REP-005",
    name: "Alertas Clínicas (CDS)",
    category: "Seguridad",
    description: "Registro de alertas clínicas y resoluciones",
    frequency: "Mensual",
    format: ["PDF", "Excel"],
    lastGenerated: "2024-09-30",
    estimatedTime: "2-3 min",
    size: "1.5 MB"
  },
  {
    id: "REP-006",
    name: "Medicamentos Más Prescritos",
    category: "Analítica",
    description: "Top de medicamentos por frecuencia de prescripción",
    frequency: "Mensual",
    format: ["PDF", "Excel"],
    lastGenerated: "2024-09-30",
    estimatedTime: "1-2 min",
    size: "800 KB"
  },
  {
    id: "REP-007",
    name: "Auditoría de Accesos",
    category: "Seguridad",
    description: "Log de auditoría completo según normativas HIPAA",
    frequency: "Mensual",
    format: ["PDF", "CSV"],
    lastGenerated: "2024-09-30",
    estimatedTime: "3-5 min",
    size: "3.2 MB"
  },
  {
    id: "REP-008",
    name: "Costos de Medicamentos",
    category: "Financiero",
    description: "Análisis de costos por medicamento y total",
    frequency: "Mensual",
    format: ["PDF", "Excel"],
    lastGenerated: "2024-09-30",
    estimatedTime: "2-3 min",
    size: "1.6 MB"
  }
];

// PÁGINA 1: ACTIVIDAD POR MÉDICO
export function ActividadMedicoPage() {
  const [doctors, setDoctors] = useState(mockDoctorActivity);
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("current_month");
  const [selectedDoctor, setSelectedDoctor] = useState<typeof mockDoctorActivity[0] | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  const filteredDoctors = doctors.filter(doctor =>
    normalizedIncludes(doctor.doctorName, searchTerm) ||
    normalizedIncludes(doctor.specialty, searchTerm) ||
    normalizedIncludes(doctor.department, searchTerm)
  );

  const totalStats = {
    prescriptions: doctors.reduce((sum, d) => sum + d.totalPrescriptions, 0),
    patients: doctors.reduce((sum, d) => sum + d.totalPatients, 0),
    dispensed: doctors.reduce((sum, d) => sum + d.dispensedPrescriptions, 0),
    totalCost: doctors.reduce((sum, d) => sum + d.totalCost, 0),
    averagePerDoctor: doctors.reduce((sum, d) => sum + d.totalPrescriptions, 0) / doctors.length
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Actividad por Médico</h1>
              <p className="text-blue-100 text-sm">Análisis estadístico de prescripciones por profesional</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total recetas</p>
                <p className="text-2xl font-semibold">{totalStats.prescriptions}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pacientes</p>
                <p className="text-2xl font-semibold">{totalStats.patients}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dispensadas</p>
                <p className="text-2xl font-semibold">{totalStats.dispensed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Promedio/médico</p>
                <p className="text-2xl font-semibold">{totalStats.averagePerDoctor.toFixed(0)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-cyan-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Costo total</p>
                <p className="text-xl font-semibold">${totalStats.totalCost.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por médico, especialidad o departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current_month">Mes actual</SelectItem>
                <SelectItem value="last_month">Mes anterior</SelectItem>
                <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
                <SelectItem value="year_to_date">Año en curso</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estadísticas por Médico</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Médico</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead className="text-right">Total recetas</TableHead>
                <TableHead className="text-right">Dispensadas</TableHead>
                <TableHead className="text-right">Rechazadas</TableHead>
                <TableHead className="text-right">Promedio/día</TableHead>
                <TableHead className="text-right">Pacientes</TableHead>
                <TableHead className="text-right">Alertas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{doctor.doctorName}</p>
                        <p className="text-sm text-gray-600">{doctor.department}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold">{doctor.totalPrescriptions}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-semibold text-green-600">{doctor.dispensedPrescriptions}</span>
                      <span className="text-xs text-gray-600">
                        {((doctor.dispensedPrescriptions / doctor.totalPrescriptions) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-red-600">{doctor.rejectedPrescriptions}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                      {doctor.averagePerDay.toFixed(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{doctor.totalPatients}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      {doctor.criticalAlerts > 0 && (
                        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 text-xs">
                          {doctor.criticalAlerts} críticas
                        </Badge>
                      )}
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs">
                        {doctor.moderateAlerts} moderadas
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedDoctor(doctor);
                      setIsDetailsPanelOpen(true);
                    }}>
                      <Eye className="w-4 h-4 mr-2" />
                      Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedDoctor && (
        <DoctorActivityDialog
          doctor={selectedDoctor}
          open={isDetailsPanelOpen}
          onOpenChange={setIsDetailsPanelOpen}
        />
      )}
    </div>
  );
}

// PÁGINA 2: ACTIVIDAD DE FARMACIA
export function ActividadFarmaciaPage() {
  const [activity, setActivity] = useState(mockPharmacyActivity);
  const [dateFilter, setDateFilter] = useState("today");
  const [shiftFilter, setShiftFilter] = useState("all");

  const filteredActivity = activity.filter(item => {
    const matchesShift = shiftFilter === "all" || item.shift === shiftFilter;
    return matchesShift;
  });

  const stats = {
    totalDispensations: activity.reduce((sum, a) => sum + a.totalDispensations, 0),
    totalValue: activity.reduce((sum, a) => sum + a.totalValue, 0),
    pending: activity.reduce((sum, a) => sum + a.pendingPrescriptions, 0),
    avgTime: "6.5 min",
    stockAdjustments: activity.reduce((sum, a) => sum + a.stockAdjustments, 0)
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Actividad de Farmacia</h1>
              <p className="text-green-100 text-sm">Monitoreo de dispensaciones y operaciones farmacéuticas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dispensaciones</p>
                <p className="text-2xl font-semibold">{stats.totalDispensations}</p>
              </div>
              <Package className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor total</p>
                <p className="text-xl font-semibold">${stats.totalValue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-semibold">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tiempo promedio</p>
                <p className="text-2xl font-semibold">{stats.avgTime}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-cyan-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ajustes stock</p>
                <p className="text-2xl font-semibold">{stats.stockAdjustments}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="yesterday">Ayer</SelectItem>
                <SelectItem value="last_7_days">Últimos 7 días</SelectItem>
                <SelectItem value="this_month">Este mes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={shiftFilter} onValueChange={setShiftFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los turnos</SelectItem>
                <SelectItem value="Mañana">Turno mañana</SelectItem>
                <SelectItem value="Tarde">Turno tarde</SelectItem>
                <SelectItem value="Noche">Turno noche</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="ml-auto">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Actividad Farmacéutica</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Farmacéutico</TableHead>
                <TableHead className="text-right">Dispensaciones</TableHead>
                <TableHead className="text-right">Rechazadas</TableHead>
                <TableHead className="text-right">Tiempo verificación</TableHead>
                <TableHead className="text-right">Tiempo dispensación</TableHead>
                <TableHead className="text-right">Ajustes stock</TableHead>
                <TableHead className="text-right">Valor total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivity.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      item.shift === "Mañana" ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
                      item.shift === "Tarde" ? "bg-blue-100 text-blue-700 border-blue-300" :
                      "bg-purple-100 text-purple-700 border-purple-300"
                    }>
                      {item.shift}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.pharmacist}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-semibold">{item.totalDispensations}</span>
                      <span className="text-xs text-gray-600">de {item.totalPrescriptions}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-red-600">{item.rejectedPrescriptions}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                      {item.verificationTime}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      {item.dispensationTime}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.stockAdjustments}</TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold">${item.totalValue.toFixed(2)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// PÁGINA 3: EXPORTAR REPORTES
export function ExportarReportesPage() {
  const [templates, setTemplates] = useState(mockReportTemplates);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof mockReportTemplates[0] | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("PDF");
  const [selectedPeriod, setSelectedPeriod] = useState("current_month");

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      normalizedIncludes(template.name, searchTerm) ||
      normalizedIncludes(template.description, searchTerm);
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(mockReportTemplates.map(t => t.category)));

  const handleExport = () => {
    if (!selectedTemplate) return;

    toast.success('Reporte en generación', {
      description: `El reporte "${selectedTemplate.name}" se está generando en formato ${selectedFormat}`,
      duration: 4000,
    });

    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <FileSpreadsheet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Exportaciones de Reportes</h1>
              <p className="text-purple-100 text-sm">Generación y descarga de reportes en múltiples formatos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reportes disponibles</p>
                <p className="text-2xl font-semibold">{templates.length}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Generados hoy</p>
                <p className="text-2xl font-semibold">12</p>
              </div>
              <FileClock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Formatos</p>
                <p className="text-2xl font-semibold">3</p>
              </div>
              <FileSpreadsheet className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Programados</p>
                <p className="text-2xl font-semibold">5</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar reportes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline" className="mt-2 bg-blue-100 text-blue-700 border-blue-300">
                      {template.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{template.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-600">Frecuencia</Label>
                  <p className="mt-1">{template.frequency}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Última generación</Label>
                  <p className="mt-1">{template.lastGenerated}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Tiempo estimado</Label>
                  <p className="mt-1">{template.estimatedTime}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Tamaño promedio</Label>
                  <p className="mt-1">{template.size}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-600">Formatos disponibles</Label>
                <div className="flex gap-2 mt-2">
                  {template.format.map((fmt) => (
                    <Badge key={fmt} variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      {fmt}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button className="w-full" onClick={() => {
                setSelectedTemplate(template);
                setIsExportDialogOpen(true);
              }}>
                <Download className="w-4 h-4 mr-2" />
                Generar reporte
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Generar Reporte: {selectedTemplate.name}</DialogTitle>
              <DialogDescription>{selectedTemplate.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div>
                <Label>Formato de exportación</Label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTemplate.format.map(fmt => (
                      <SelectItem key={fmt} value={fmt}>{fmt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Período</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current_month">Mes actual</SelectItem>
                    <SelectItem value="last_month">Mes anterior</SelectItem>
                    <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
                    <SelectItem value="year_to_date">Año en curso</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">Información del reporte</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Tiempo estimado: {selectedTemplate.estimatedTime}</li>
                      <li>• Tamaño aproximado: {selectedTemplate.size}</li>
                      <li>• El reporte se descargará automáticamente al completarse</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Generar y descargar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Componente auxiliar: Diálogo de detalles de médico
function DoctorActivityDialog({ 
  doctor, 
  open, 
  onOpenChange 
}: { 
  doctor: typeof mockDoctorActivity[0]; 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalles de Actividad: {doctor.doctorName}</DialogTitle>
          <DialogDescription>{doctor.specialty} - {doctor.department}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-semibold text-blue-600">{doctor.totalPrescriptions}</p>
              <p className="text-sm text-gray-600 mt-1">Total recetas</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-semibold text-green-600">{doctor.dispensedPrescriptions}</p>
              <p className="text-sm text-gray-600 mt-1">Dispensadas</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-semibold text-purple-600">{doctor.totalPatients}</p>
              <p className="text-sm text-gray-600 mt-1">Pacientes</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Promedio por día</Label>
              <p className="text-xl font-semibold mt-1">{doctor.averagePerDay.toFixed(1)} recetas</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Medicamento más prescrito</Label>
              <p className="font-medium mt-1">{doctor.mostPrescribedMedicine}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Días trabajados</Label>
              <p className="font-medium mt-1">{doctor.workingDays} días</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Costo total prescripciones</Label>
              <p className="text-xl font-semibold mt-1 text-cyan-600">${doctor.totalCost.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-3 block">Alertas clínicas</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-sm font-medium text-red-900">Alertas críticas</span>
                <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                  {doctor.criticalAlerts}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-sm font-medium text-yellow-900">Alertas moderadas</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                  {doctor.moderateAlerts}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-3 block">Estado de prescripciones</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Activas</span>
                <span className="font-semibold">{doctor.activePrescriptions}</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Pendientes</span>
                <span className="font-semibold text-orange-600">{doctor.pendingPrescriptions}</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">Rechazadas</span>
                <span className="font-semibold text-red-600">{doctor.rejectedPrescriptions}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cerrar</Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Exportar detalles
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
