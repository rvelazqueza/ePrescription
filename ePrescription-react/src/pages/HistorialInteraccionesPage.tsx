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
import { PageBanner } from "../components/PageBanner";
import { usePagination } from "../utils/usePagination";
import { normalizedIncludes } from "../utils/searchUtils";
import { InteractionsHistoryAPI, type InteractionHistoryRecord } from "../utils/interactionsHistoryStore";
import { getSeverityLabel, getSeverityColor } from "../utils/drugInteractionsDatabase";
import {
  Activity,
  Ban,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Search,
  FilterX,
  Eye,
  User
} from "lucide-react";

export function HistorialInteraccionesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [decisionFilter, setDecisionFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<InteractionHistoryRecord | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  // Obtener historial completo
  const allHistory = InteractionsHistoryAPI.getAll();

  // Filtrar historial
  const filteredHistory = allHistory.filter(record => {
    const matchesSearch =
      normalizedIncludes(record.interaction.drug1, searchTerm) ||
      normalizedIncludes(record.interaction.drug2, searchTerm) ||
      normalizedIncludes(record.patientName, searchTerm) ||
      normalizedIncludes(record.doctorName, searchTerm) ||
      normalizedIncludes(record.prescriptionNumber || "", searchTerm);

    const matchesSeverity =
      severityFilter === "all" || record.interaction.interaction.severity === severityFilter;

    const matchesDecision =
      decisionFilter === "all" || record.userDecision === decisionFilter;

    return matchesSearch && matchesSeverity && matchesDecision;
  });

  // Paginación
  const { currentPage, totalPages, paginatedData, handlePageChange, resetToFirstPage } =
    usePagination(filteredHistory, 10);

  const stats = InteractionsHistoryAPI.getStatistics();

  const handleDoubleClick = (record: InteractionHistoryRecord) => {
    setSelectedRecord(record);
    setIsDetailsPanelOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Banner */}
      <PageBanner
        icon={Activity}
        title="Historial de Interacciones Medicamentosas"
        description="Registro completo de todas las interacciones detectadas en el sistema con trazabilidad total"
        gradient="from-purple-600 via-indigo-500 to-blue-600"
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Activity className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Ban className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-700">{stats.bySeverity.critical}</p>
                <p className="text-sm text-gray-600">Críticas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">{stats.bySeverity.severe}</p>
                <p className="text-sm text-gray-600">Severas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{stats.byDecision.modified}</p>
                <p className="text-sm text-gray-600">Modificadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShieldAlert className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{stats.blockedPercentage}%</p>
                <p className="text-sm text-gray-600">Bloqueadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de historial */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Historial Completo de Interacciones</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {filteredHistory.length} registro(s) encontrado(s)
              </p>
            </div>
            <ExportButtons
              data={filteredHistory}
              filename="historial_interacciones"
              pdfTitle="Historial de Interacciones Medicamentosas"
            />
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  resetToFirstPage();
                }}
                className="pl-10"
              />
            </div>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las severidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las severidades</SelectItem>
                <SelectItem value="critical">Críticas</SelectItem>
                <SelectItem value="severe">Severas</SelectItem>
                <SelectItem value="moderate">Moderadas</SelectItem>
                <SelectItem value="mild">Leves</SelectItem>
              </SelectContent>
            </Select>

            <Select value={decisionFilter} onValueChange={setDecisionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las decisiones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las decisiones</SelectItem>
                <SelectItem value="blocked">Bloqueadas</SelectItem>
                <SelectItem value="accepted">Aceptadas</SelectItem>
                <SelectItem value="modified">Modificadas</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || severityFilter !== "all" || decisionFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSeverityFilter("all");
                  setDecisionFilter("all");
                  resetToFirstPage();
                }}
              >
                <FilterX className="w-4 h-4 mr-2" />
                Limpiar Filtros
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Interacción</TableHead>
                  <TableHead>Severidad</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Médico</TableHead>
                  <TableHead>Decisión</TableHead>
                  <TableHead>Fuente</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <AlertCircle className="w-8 h-8" />
                        <p>No se encontraron registros</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((record) => (
                    <TableRow
                      key={record.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onDoubleClick={() => handleDoubleClick(record)}
                    >
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">
                            {new Date(record.timestamp).toLocaleDateString("es-ES")}
                          </p>
                          <p className="text-gray-500">
                            {new Date(record.timestamp).toLocaleTimeString("es-ES")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {record.interaction.drug1} ↔ {record.interaction.drug2}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {record.prescriptionNumber || "Sin receta"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getSeverityColor(
                            record.interaction.interaction.severity
                          )}
                        >
                          {getSeverityLabel(record.interaction.interaction.severity)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{record.patientName}</p>
                          <p className="text-gray-500 text-xs">{record.patientId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{record.doctorName}</p>
                          <p className="text-gray-500 text-xs">{record.doctorId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            record.userDecision === "blocked"
                              ? "bg-red-100 text-red-700 border-red-300"
                              : record.userDecision === "accepted"
                              ? "bg-green-100 text-green-700 border-green-300"
                              : record.userDecision === "modified"
                              ? "bg-blue-100 text-blue-700 border-blue-300"
                              : "bg-yellow-100 text-yellow-700 border-yellow-300"
                          }
                        >
                          {record.userDecision === "blocked"
                            ? "Bloqueada"
                            : record.userDecision === "accepted"
                            ? "Aceptada"
                            : record.userDecision === "modified"
                            ? "Modificada"
                            : "Pendiente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {record.externalSource || "Internal"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDoubleClick(record)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredHistory.length > 10 && (
            <div className="mt-4">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panel de detalles */}
      <InteractionHistoryDetailPanel
        record={selectedRecord}
        open={isDetailsPanelOpen}
        onOpenChange={setIsDetailsPanelOpen}
      />
    </div>
  );
}

// Panel de detalles de interacción
interface InteractionHistoryDetailPanelProps {
  record: InteractionHistoryRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function InteractionHistoryDetailPanel({
  record,
  open,
  onOpenChange
}: InteractionHistoryDetailPanelProps) {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-purple-600" />
            Detalles de Interacción - {record.id}
          </DialogTitle>
          <DialogDescription>
            Información completa de la interacción detectada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información general */}
          <div>
            <h3 className="font-medium text-lg mb-3">Información General</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Fecha y Hora</Label>
                <p className="mt-1">
                  {new Date(record.timestamp).toLocaleString("es-ES")}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Número de Receta</Label>
                <p className="mt-1 font-mono">{record.prescriptionNumber || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Centro Médico</Label>
                <p className="mt-1">{record.medicalCenter}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">ID de Sesión</Label>
                <p className="mt-1 font-mono text-sm">{record.sessionId || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Interacción */}
          <div className={`p-4 rounded-lg border-2 ${getSeverityColor(record.interaction.interaction.severity)}`}>
            <h3 className="font-medium text-lg mb-3">Detalles de Interacción</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-gray-600">Medicamentos</Label>
                <p className="mt-1 font-bold text-lg">
                  {record.interaction.drug1} ↔ {record.interaction.drug2}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Severidad</Label>
                <div className="mt-1">
                  <Badge className={getSeverityColor(record.interaction.interaction.severity)}>
                    {getSeverityLabel(record.interaction.interaction.severity)}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Descripción</Label>
                <p className="mt-1">{record.interaction.interaction.description}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Efecto Clínico</Label>
                <p className="mt-1">{record.interaction.interaction.clinicalEffect}</p>
              </div>
              <div className="bg-white/50 p-3 rounded border-l-4 border-current">
                <Label className="text-sm text-gray-600">Recomendación</Label>
                <p className="mt-1 font-medium">{record.interaction.interaction.recommendation}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Referencias</Label>
                <p className="mt-1 text-sm">{record.interaction.interaction.references}</p>
              </div>
            </div>
          </div>

          {/* Paciente y Médico */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Paciente
              </h3>
              <div className="space-y-2">
                <div>
                  <Label className="text-sm text-gray-600">Nombre</Label>
                  <p className="mt-1">{record.patientName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">ID</Label>
                  <p className="mt-1 font-mono text-sm">{record.patientId}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-green-600" />
                Médico
              </h3>
              <div className="space-y-2">
                <div>
                  <Label className="text-sm text-gray-600">Nombre</Label>
                  <p className="mt-1">{record.doctorName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Licencia</Label>
                  <p className="mt-1 font-mono text-sm">{record.doctorId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decisión y Notas */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">Decisión del Médico</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-gray-600">Acción Tomada</Label>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={
                      record.userDecision === "blocked"
                        ? "bg-red-100 text-red-700 border-red-300"
                        : record.userDecision === "accepted"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : record.userDecision === "modified"
                        ? "bg-blue-100 text-blue-700 border-blue-300"
                        : "bg-yellow-100 text-yellow-700 border-yellow-300"
                    }
                  >
                    {record.userDecision === "blocked"
                      ? "Prescripción Bloqueada"
                      : record.userDecision === "accepted"
                      ? "Riesgo Aceptado"
                      : record.userDecision === "modified"
                      ? "Medicamentos Modificados"
                      : "Decisión Pendiente"}
                  </Badge>
                </div>
              </div>
              {record.notes && (
                <div>
                  <Label className="text-sm text-gray-600">Notas del Médico</Label>
                  <p className="mt-1 text-sm bg-white p-3 rounded border">
                    {record.notes}
                  </p>
                </div>
              )}
              <div>
                <Label className="text-sm text-gray-600">Fuente de Datos</Label>
                <div className="mt-1">
                  <Badge variant="outline">
                    {record.externalSource || "Base de Datos Interna"}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
