import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Search, 
  Filter, 
  X, 
  FileText, 
  User, 
  Calendar, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  QrCode,
  Pill,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export interface PrescriptionForSelection {
  prescriptionNumber: string;
  qrCode: string;
  token: string;
  patientName: string;
  patientId: string;
  emittedDate: string;
  emittedTime: string;
  validUntil: string;
  medicinesCount: number;
  dispensationStatus: "emitted" | "partially_dispensed" | "fully_dispensed" | "cancelled";
  age: number;
  gender: "M" | "F";
  doctorName: string;
  verificationStatus: "valid" | "expired" | "already_dispensed" | "cancelled";
  priority?: "normal" | "urgent" | "controlled";
  institution?: string;
}

interface PrescriptionSelectorProps {
  prescriptions: PrescriptionForSelection[];
  onSelectPrescription: (prescription: PrescriptionForSelection) => void;
  onCancel?: () => void;
}

const getStatusConfig = (status: PrescriptionForSelection["dispensationStatus"]) => {
  switch (status) {
    case "emitted":
      return {
        label: "Emitida - Pendiente",
        className: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Clock
      };
    case "partially_dispensed":
      return {
        label: "Dispensación Parcial",
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: AlertTriangle
      };
    case "fully_dispensed":
      return {
        label: "Dispensada Completamente",
        className: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle2
      };
    case "cancelled":
      return {
        label: "Cancelada",
        className: "bg-gray-50 text-gray-700 border-gray-200",
        icon: XCircle
      };
  }
};

const getVerificationConfig = (status: PrescriptionForSelection["verificationStatus"]) => {
  switch (status) {
    case "valid":
      return {
        label: "Válida",
        className: "bg-green-100 text-green-800 border-green-300",
        canDispense: true
      };
    case "expired":
      return {
        label: "Vencida",
        className: "bg-red-100 text-red-800 border-red-300",
        canDispense: false
      };
    case "already_dispensed":
      return {
        label: "Ya dispensada",
        className: "bg-gray-100 text-gray-800 border-gray-300",
        canDispense: false
      };
    case "cancelled":
      return {
        label: "Cancelada",
        className: "bg-gray-100 text-gray-800 border-gray-300",
        canDispense: false
      };
  }
};

const getPriorityConfig = (priority?: string) => {
  switch (priority) {
    case "urgent":
      return {
        label: "Urgente",
        className: "bg-red-100 text-red-800 border-red-300"
      };
    case "controlled":
      return {
        label: "Controlado",
        className: "bg-orange-100 text-orange-800 border-orange-300"
      };
    default:
      return {
        label: "Normal",
        className: "bg-blue-100 text-blue-800 border-blue-300"
      };
  }
};

export function PrescriptionSelector({
  prescriptions,
  onSelectPrescription,
  onCancel
}: PrescriptionSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    verification: "all",
    dateFrom: "",
    dateTo: "",
    doctor: "all",
    priority: "all"
  });
  const [showFilters, setShowFilters] = useState(false);

  // Obtener lista única de médicos para el filtro
  const uniqueDoctors = Array.from(new Set(prescriptions.map(p => p.doctorName)));

  // Función de búsqueda normalizada
  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Filtrar prescripciones
  const filteredPrescriptions = prescriptions.filter(prescription => {
    // Búsqueda por texto
    if (searchTerm) {
      const normalizedSearch = normalizeString(searchTerm);
      const searchableText = normalizeString(
        `${prescription.prescriptionNumber} ${prescription.patientName} ${prescription.patientId} ${prescription.qrCode} ${prescription.token}`
      );
      
      if (!searchableText.includes(normalizedSearch)) {
        return false;
      }
    }

    // Filtro por estado de dispensación
    if (filters.status !== "all" && prescription.dispensationStatus !== filters.status) {
      return false;
    }

    // Filtro por verificación
    if (filters.verification !== "all" && prescription.verificationStatus !== filters.verification) {
      return false;
    }

    // Filtro por médico
    if (filters.doctor !== "all" && prescription.doctorName !== filters.doctor) {
      return false;
    }

    // Filtro por prioridad
    if (filters.priority !== "all" && (prescription.priority || "normal") !== filters.priority) {
      return false;
    }

    // Filtro por fecha desde
    if (filters.dateFrom) {
      const prescriptionDate = prescription.emittedDate.split('/').reverse().join('-');
      if (prescriptionDate < filters.dateFrom) {
        return false;
      }
    }

    // Filtro por fecha hasta
    if (filters.dateTo) {
      const prescriptionDate = prescription.emittedDate.split('/').reverse().join('-');
      if (prescriptionDate > filters.dateTo) {
        return false;
      }
    }

    return true;
  });

  // Ordenar: primero válidas y pendientes, luego por fecha más reciente
  const sortedPrescriptions = [...filteredPrescriptions].sort((a, b) => {
    // Prioridad a recetas válidas
    if (a.verificationStatus === "valid" && b.verificationStatus !== "valid") return -1;
    if (a.verificationStatus !== "valid" && b.verificationStatus === "valid") return 1;
    
    // Prioridad a recetas emitidas
    if (a.dispensationStatus === "emitted" && b.dispensationStatus !== "emitted") return -1;
    if (a.dispensationStatus !== "emitted" && b.dispensationStatus === "emitted") return 1;

    // Ordenar por fecha (más reciente primero)
    const dateA = a.emittedDate.split('/').reverse().join('');
    const dateB = b.emittedDate.split('/').reverse().join('');
    return dateB.localeCompare(dateA);
  });

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      verification: "all",
      dateFrom: "",
      dateTo: "",
      doctor: "all",
      priority: "all"
    });
    setSearchTerm("");
    toast.info("Filtros limpiados");
  };

  const handleSelectPrescription = (prescription: PrescriptionForSelection) => {
    const verificationConfig = getVerificationConfig(prescription.verificationStatus);
    
    if (!verificationConfig.canDispense) {
      toast.error("Receta no disponible para dispensación", {
        description: `Esta receta está marcada como: ${verificationConfig.label}`,
        duration: 4000
      });
      return;
    }

    onSelectPrescription(prescription);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== "all" && value !== "").length;

  return (
    <div className="space-y-6">
      {/* Header del selector */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">Paso 1: Seleccionar Receta a Dispensar</h3>
              <p className="text-sm text-blue-700 mt-1">
                Busque y seleccione la receta médica que desea dispensar. Solo se muestran recetas emitidas y verificadas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Barra de búsqueda y filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Buscar Receta
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="default" className="ml-1 bg-primary">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Búsqueda principal */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por número de receta, paciente, cédula, QR o token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Panel de filtros avanzados */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="space-y-2">
                <Label className="text-xs">Estado de Dispensación</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="emitted">Emitida - Pendiente</SelectItem>
                    <SelectItem value="partially_dispensed">Parcialmente Dispensada</SelectItem>
                    <SelectItem value="fully_dispensed">Completamente Dispensada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Estado de Verificación</Label>
                <Select value={filters.verification} onValueChange={(value) => setFilters({...filters, verification: value})}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="valid">Válida</SelectItem>
                    <SelectItem value="expired">Vencida</SelectItem>
                    <SelectItem value="already_dispensed">Ya Dispensada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Médico Prescriptor</Label>
                <Select value={filters.doctor} onValueChange={(value) => setFilters({...filters, doctor: value})}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {uniqueDoctors.map(doctor => (
                      <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Fecha Desde</Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Fecha Hasta</Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Prioridad</Label>
                <Select value={filters.priority} onValueChange={(value) => setFilters({...filters, priority: value})}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="controlled">Controlado</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-3 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          )}

          {/* Contador de resultados */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {sortedPrescriptions.length} {sortedPrescriptions.length === 1 ? 'receta encontrada' : 'recetas encontradas'}
              {searchTerm && ` para "${searchTerm}"`}
            </span>
            {sortedPrescriptions.length > 0 && (
              <span className="text-xs">
                {sortedPrescriptions.filter(p => p.verificationStatus === "valid").length} disponible(s) para dispensar
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de recetas */}
      <div className="space-y-3">
        {sortedPrescriptions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No se encontraron recetas con los criterios especificados</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="mt-4"
              >
                Limpiar filtros de búsqueda
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedPrescriptions.map((prescription) => {
            const statusConfig = getStatusConfig(prescription.dispensationStatus);
            const verificationConfig = getVerificationConfig(prescription.verificationStatus);
            const priorityConfig = getPriorityConfig(prescription.priority);
            const StatusIcon = statusConfig.icon;

            return (
              <Card 
                key={prescription.prescriptionNumber}
                className={`transition-all duration-200 hover:shadow-md ${
                  verificationConfig.canDispense 
                    ? 'hover:border-primary cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => handleSelectPrescription(prescription)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Información principal */}
                    <div className="flex-1 space-y-3">
                      {/* Header con número y badges */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="font-semibold text-lg text-gray-900">
                            {prescription.prescriptionNumber}
                          </span>
                        </div>
                        <Badge variant="outline" className={verificationConfig.className}>
                          {verificationConfig.label}
                        </Badge>
                        <Badge variant="outline" className={statusConfig.className}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                        {prescription.priority && prescription.priority !== "normal" && (
                          <Badge variant="outline" className={priorityConfig.className}>
                            {priorityConfig.label}
                          </Badge>
                        )}
                      </div>

                      {/* Información del paciente */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <User className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{prescription.patientName}</p>
                            <p className="text-xs text-gray-500">
                              {prescription.patientId} • {prescription.age} años • {prescription.gender === 'M' ? 'Masculino' : 'Femenino'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Pill className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm">{prescription.medicinesCount} medicamento{prescription.medicinesCount !== 1 ? 's' : ''} prescrito{prescription.medicinesCount !== 1 ? 's' : ''}</p>
                            <p className="text-xs text-gray-500">Médico: {prescription.doctorName}</p>
                          </div>
                        </div>
                      </div>

                      {/* Fechas y verificación */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Emitida: {prescription.emittedDate} {prescription.emittedTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Válida hasta: {prescription.validUntil}</span>
                        </div>
                        {prescription.institution && (
                          <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {prescription.institution}
                          </div>
                        )}
                      </div>

                      {/* Información de QR/Token */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <QrCode className="w-3 h-3" />
                          <span>QR: {prescription.qrCode}</span>
                        </div>
                        <div>
                          Token: {prescription.token}
                        </div>
                      </div>
                    </div>

                    {/* Botón de acción */}
                    <div className="flex flex-col items-end gap-2">
                      {verificationConfig.canDispense ? (
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPrescription(prescription);
                          }}
                        >
                          Seleccionar
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      ) : (
                        <Button 
                          variant="outline"
                          disabled
                          className="cursor-not-allowed"
                        >
                          No disponible
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Botón cancelar (opcional) */}
      {onCancel && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
            <X className="w-4 h-4" />
            Cancelar Dispensación
          </Button>
        </div>
      )}
    </div>
  );
}
