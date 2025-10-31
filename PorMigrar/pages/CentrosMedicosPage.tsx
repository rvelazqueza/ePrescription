import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Textarea } from "../components/ui/textarea";
import { PageBanner } from "../components/PageBanner";
import { ExportButtons } from "../components/ExportButtons";
import { TablePagination } from "../components/TablePagination";
import {
  Building2,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  Calendar,
  Shield,
  Download,
  Eye,
  Send
} from "lucide-react";
import { normalizeSearchText } from "../utils/searchUtils";
import { usePagination } from "../utils/usePagination";
import { toast } from "sonner";

// Tipos de datos
interface CentroMedico {
  id: string;
  nombre: string;
  tipo: "hospital" | "clinica" | "centro_salud" | "consultorio" | "laboratorio";
  codigo: string;
  provincia: string;
  canton: string;
  distrito: string;
  direccion: string;
  telefono: string;
  email: string;
  responsable: string;
  estado: "activo" | "inactivo";
  licencia: string;
  fechaRegistro: string;
}

interface AsignacionCentro {
  id: string;
  centroMedico: CentroMedico;
  profesional: {
    nombre: string;
    codigo: string;
    especialidad: string;
  };
  estado: "pendiente" | "aprobada" | "rechazada" | "cancelada";
  fechaSolicitud: string;
  fechaRespuesta?: string;
  motivoRechazo?: string;
  motivoCancelacion?: string;
  cargo: string;
  horario: string;
  esPrincipal: boolean;
}

// Datos de ejemplo
const centrosMedicosData: CentroMedico[] = [
  {
    id: "CM-001",
    nombre: "Hospital San Juan de Dios",
    tipo: "hospital",
    codigo: "HSJD-2024",
    provincia: "San José",
    canton: "San José",
    distrito: "Hospital",
    direccion: "Paseo Colón, Calle 14",
    telefono: "2257-6282",
    email: "info@hsjd.sa.cr",
    responsable: "Dr. Carlos Rodríguez Mora",
    estado: "activo",
    licencia: "LIC-HOSP-001",
    fechaRegistro: "2024-01-15"
  },
  {
    id: "CM-002",
    nombre: "Clínica Bíblica",
    tipo: "clinica",
    codigo: "CB-2024",
    provincia: "San José",
    canton: "San José",
    distrito: "Catedral",
    direccion: "Avenida 14, Calle Central",
    telefono: "2522-1000",
    email: "contacto@clinicabiblica.com",
    responsable: "Dra. Ana María Solís",
    estado: "activo",
    licencia: "LIC-CLIN-002",
    fechaRegistro: "2024-02-10"
  },
  {
    id: "CM-003",
    nombre: "CAIS Moravia",
    tipo: "centro_salud",
    codigo: "CAIS-MOR-2024",
    provincia: "San José",
    canton: "Moravia",
    distrito: "San Vicente",
    direccion: "Frente al parque central",
    telefono: "2240-5678",
    email: "cais.moravia@ccss.sa.cr",
    responsable: "Dr. Roberto Jiménez Castro",
    estado: "activo",
    licencia: "LIC-CAIS-003",
    fechaRegistro: "2024-03-05"
  },
  {
    id: "CM-004",
    nombre: "Consultorio Dr. Pérez",
    tipo: "consultorio",
    codigo: "CONS-PER-2024",
    provincia: "San José",
    canton: "Escazú",
    distrito: "San Rafael",
    direccion: "Plaza Colonial, 2do piso",
    telefono: "2228-9876",
    email: "drperez@consultorio.com",
    responsable: "Dr. Juan Pérez González",
    estado: "activo",
    licencia: "LIC-CONS-004",
    fechaRegistro: "2024-04-20"
  }
];

const asignacionesData: AsignacionCentro[] = [
  {
    id: "ASG-001",
    centroMedico: centrosMedicosData[0],
    profesional: {
      nombre: "Dr. Carlos Méndez Solís",
      codigo: "MED-12345",
      especialidad: "Medicina Interna"
    },
    estado: "aprobada",
    fechaSolicitud: "2024-09-15",
    fechaRespuesta: "2024-09-16",
    cargo: "Médico Especialista",
    horario: "Lunes a Viernes, 8:00 AM - 4:00 PM",
    esPrincipal: true
  },
  {
    id: "ASG-002",
    centroMedico: centrosMedicosData[1],
    profesional: {
      nombre: "Dr. Carlos Méndez Solís",
      codigo: "MED-12345",
      especialidad: "Medicina Interna"
    },
    estado: "aprobada",
    fechaSolicitud: "2024-09-20",
    fechaRespuesta: "2024-09-21",
    cargo: "Médico Consultor",
    horario: "Martes y Jueves, 2:00 PM - 6:00 PM",
    esPrincipal: false
  },
  {
    id: "ASG-003",
    centroMedico: centrosMedicosData[2],
    profesional: {
      nombre: "Dr. Carlos Méndez Solís",
      codigo: "MED-12345",
      especialidad: "Medicina Interna"
    },
    estado: "pendiente",
    fechaSolicitud: "2024-10-05",
    cargo: "Médico de Guardia",
    horario: "Fines de semana",
    esPrincipal: false
  }
];

export function CentrosMedicosPage() {
  const [activeTab, setActiveTab] = useState<"mis-asignaciones" | "centros-disponibles">("mis-asignaciones");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState<string>("todos");
  const [selectedTipo, setSelectedTipo] = useState<string>("todos");
  const [showUppercase, setShowUppercase] = useState(false);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState<AsignacionCentro | null>(null);
  const [selectedCentro, setSelectedCentro] = useState<CentroMedico | null>(null);

  // Formulario de solicitud
  const [formData, setFormData] = useState({
    centroMedicoId: "",
    cargo: "",
    horario: "",
    esPrincipal: false,
    observaciones: ""
  });

  // Formulario de cancelación
  const [motivoCancelacion, setMotivoCancelacion] = useState("");

  // Filtrado de asignaciones
  const filteredAsignaciones = asignacionesData.filter((item) => {
    const normalizedSearch = normalizeSearchText(searchTerm);
    
    const matchesSearch =
      normalizedSearch === "" ||
      normalizeSearchText(item.centroMedico.nombre).includes(normalizedSearch) ||
      normalizeSearchText(item.centroMedico.codigo).includes(normalizedSearch) ||
      normalizeSearchText(item.cargo).includes(normalizedSearch);

    const matchesEstado = selectedEstado === "todos" || item.estado === selectedEstado;

    return matchesSearch && matchesEstado;
  });

  // Filtrado de centros médicos
  const filteredCentros = centrosMedicosData.filter((item) => {
    const normalizedSearch = normalizeSearchText(searchTerm);
    
    const matchesSearch =
      normalizedSearch === "" ||
      normalizeSearchText(item.nombre).includes(normalizedSearch) ||
      normalizeSearchText(item.codigo).includes(normalizedSearch) ||
      normalizeSearchText(item.provincia).includes(normalizedSearch) ||
      normalizeSearchText(item.canton).includes(normalizedSearch);

    const matchesTipo = selectedTipo === "todos" || item.tipo === selectedTipo;
    const matchesEstado = selectedEstado === "todos" || item.estado === selectedEstado;

    return matchesSearch && matchesTipo && matchesEstado;
  });

  // Paginación asignaciones
  const {
    currentPage: currentPageAsignaciones,
    pageSize: pageSizeAsignaciones,
    totalPages: totalPagesAsignaciones,
    paginatedData: paginatedAsignaciones,
    goToPage: goToPageAsignaciones,
    changePageSize: changePageSizeAsignaciones,
    goToFirstPage: goToFirstPageAsignaciones,
    goToLastPage: goToLastPageAsignaciones,
    goToNextPage: goToNextPageAsignaciones,
    goToPreviousPage: goToPreviousPageAsignaciones,
  } = usePagination(filteredAsignaciones, 10);

  // Paginación centros
  const {
    currentPage: currentPageCentros,
    pageSize: pageSizeCentros,
    totalPages: totalPagesCentros,
    paginatedData: paginatedCentros,
    goToPage: goToPageCentros,
    changePageSize: changePageSizeCentros,
    goToFirstPage: goToFirstPageCentros,
    goToLastPage: goToLastPageCentros,
    goToNextPage: goToNextPageCentros,
    goToPreviousPage: goToPreviousPageCentros,
  } = usePagination(filteredCentros, 10);

  // Solicitar asignación
  const handleSolicitarAsignacion = () => {
    if (!formData.centroMedicoId || !formData.cargo || !formData.horario) {
      toast.error("Complete todos los campos requeridos");
      return;
    }

    toast.success("Solicitud de asignación enviada correctamente");
    setShowNewRequestDialog(false);
    resetForm();
  };

  // Cancelar asignación
  const handleCancelarAsignacion = () => {
    if (!motivoCancelacion) {
      toast.error("Debe indicar el motivo de cancelación");
      return;
    }

    toast.success("Asignación cancelada exitosamente");
    setShowCancelDialog(false);
    setMotivoCancelacion("");
    setSelectedAsignacion(null);
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      centroMedicoId: "",
      cargo: "",
      horario: "",
      esPrincipal: false,
      observaciones: ""
    });
  };

  // Renderizar badge de estado
  const renderEstadoBadge = (estado: string) => {
    const variants = {
      aprobada: "bg-green-100 text-green-800",
      pendiente: "bg-yellow-100 text-yellow-800",
      rechazada: "bg-red-100 text-red-800",
      cancelada: "bg-gray-100 text-gray-800",
      activo: "bg-green-100 text-green-800",
      inactivo: "bg-gray-100 text-gray-800"
    };
    return (
      <Badge className={variants[estado as keyof typeof variants]}>
        {estado.toUpperCase()}
      </Badge>
    );
  };

  // Renderizar badge de tipo
  const renderTipoBadge = (tipo: string) => {
    const variants = {
      hospital: "bg-blue-100 text-blue-800",
      clinica: "bg-purple-100 text-purple-800",
      centro_salud: "bg-teal-100 text-teal-800",
      consultorio: "bg-orange-100 text-orange-800",
      laboratorio: "bg-pink-100 text-pink-800"
    };
    const labels = {
      hospital: "Hospital",
      clinica: "Clínica",
      centro_salud: "Centro de Salud",
      consultorio: "Consultorio",
      laboratorio: "Laboratorio"
    };
    return (
      <Badge className={variants[tipo as keyof typeof variants]}>
        {labels[tipo as keyof typeof labels]}
      </Badge>
    );
  };

  const transformText = (text: string) => showUppercase ? text.toUpperCase() : text;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <PageBanner
        icon={Building2}
        title="Centros Médicos y Asignaciones"
        description="Gestione sus asignaciones a centros médicos y consulte centros disponibles para generar recetas"
      />

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Asignaciones Activas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {asignacionesData.filter(a => a.estado === "aprobada").length}
            </div>
            <p className="text-xs text-muted-foreground">Centros donde puede prescribir</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Solicitudes Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {asignacionesData.filter(a => a.estado === "pendiente").length}
            </div>
            <p className="text-xs text-muted-foreground">En revisión</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Centro Principal</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              {asignacionesData.find(a => a.esPrincipal)?.centroMedico.nombre.substring(0, 20) || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Centros Disponibles</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{centrosMedicosData.length}</div>
            <p className="text-xs text-muted-foreground">En el sistema</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestión de Centros Médicos</CardTitle>
            <Button onClick={() => setShowNewRequestDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Solicitar Asignación
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex space-x-2 border-b">
              <Button
                variant={activeTab === "mis-asignaciones" ? "default" : "ghost"}
                onClick={() => setActiveTab("mis-asignaciones")}
                className="rounded-b-none"
              >
                Mis Asignaciones
              </Button>
              <Button
                variant={activeTab === "centros-disponibles" ? "default" : "ghost"}
                onClick={() => setActiveTab("centros-disponibles")}
                className="rounded-b-none"
              >
                Centros Disponibles
              </Button>
            </div>

            {/* Búsqueda y filtros */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {activeTab === "centros-disponibles" && (
                <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="clinica">Clínica</SelectItem>
                    <SelectItem value="centro_salud">Centro de Salud</SelectItem>
                    <SelectItem value="consultorio">Consultorio</SelectItem>
                    <SelectItem value="laboratorio">Laboratorio</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  {activeTab === "mis-asignaciones" ? (
                    <>
                      <SelectItem value="aprobada">Aprobada</SelectItem>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="rechazada">Rechazada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowUppercase(!showUppercase)}
              >
                {showUppercase ? "Normal" : "MAYÚSCULAS"}
              </Button>
            </div>

            {/* Tabla de Mis Asignaciones */}
            {activeTab === "mis-asignaciones" && (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {paginatedAsignaciones.length} de {filteredAsignaciones.length} asignación(es)
                  </p>
                  <ExportButtons
                    data={filteredAsignaciones}
                    filename="mis-asignaciones"
                    pdfTitle="Mis Asignaciones a Centros Médicos"
                  />
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Centro Médico</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Horario</TableHead>
                        <TableHead>Principal</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>F. Solicitud</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedAsignaciones.length > 0 ? (
                        paginatedAsignaciones.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{transformText(item.centroMedico.nombre)}</TableCell>
                            <TableCell>{transformText(item.centroMedico.codigo)}</TableCell>
                            <TableCell>{transformText(item.cargo)}</TableCell>
                            <TableCell className="text-sm">{transformText(item.horario)}</TableCell>
                            <TableCell>
                              {item.esPrincipal && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Principal
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{renderEstadoBadge(item.estado)}</TableCell>
                            <TableCell>{new Date(item.fechaSolicitud).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedAsignacion(item);
                                    setShowDetailDialog(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {item.estado === "aprobada" && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedAsignacion(item);
                                      setShowCancelDialog(true);
                                    }}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No se encontraron asignaciones</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <TablePagination
                  currentPage={currentPageAsignaciones}
                  totalPages={totalPagesAsignaciones}
                  pageSize={pageSizeAsignaciones}
                  totalItems={filteredAsignaciones.length}
                  onPageChange={goToPageAsignaciones}
                  onPageSizeChange={changePageSizeAsignaciones}
                />
              </>
            )}

            {/* Tabla de Centros Disponibles */}
            {activeTab === "centros-disponibles" && (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {paginatedCentros.length} de {filteredCentros.length} centro(s)
                  </p>
                  <ExportButtons
                    data={filteredCentros}
                    filename="centros-medicos"
                    pdfTitle="Centros Médicos Disponibles"
                  />
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Responsable</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedCentros.length > 0 ? (
                        paginatedCentros.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{transformText(item.nombre)}</TableCell>
                            <TableCell>{renderTipoBadge(item.tipo)}</TableCell>
                            <TableCell>{transformText(item.codigo)}</TableCell>
                            <TableCell className="text-sm">
                              {transformText(`${item.canton}, ${item.provincia}`)}
                            </TableCell>
                            <TableCell>{item.telefono}</TableCell>
                            <TableCell className="text-sm">{transformText(item.responsable)}</TableCell>
                            <TableCell>{renderEstadoBadge(item.estado)}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedCentro(item);
                                  setFormData({ ...formData, centroMedicoId: item.id });
                                  setShowNewRequestDialog(true);
                                }}
                                disabled={item.estado === "inactivo"}
                              >
                                <Send className="w-4 h-4 mr-1" />
                                Solicitar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No se encontraron centros médicos</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <TablePagination
                  currentPage={currentPageCentros}
                  totalPages={totalPagesCentros}
                  pageSize={pageSizeCentros}
                  totalItems={filteredCentros.length}
                  onPageChange={goToPageCentros}
                  onPageSizeChange={changePageSizeCentros}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog: Nueva Solicitud */}
      <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Solicitar Asignación a Centro Médico</DialogTitle>
            <DialogDescription>
              Complete la información para solicitar su asignación. La solicitud será revisada por el centro médico.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedCentro && (
              <Alert>
                <Building2 className="h-4 w-4" />
                <AlertTitle>Centro Seleccionado</AlertTitle>
                <AlertDescription>
                  <p className="font-medium">{selectedCentro.nombre}</p>
                  <p className="text-sm">{selectedCentro.direccion}</p>
                  <p className="text-sm">{selectedCentro.canton}, {selectedCentro.provincia}</p>
                </AlertDescription>
              </Alert>
            )}

            {!selectedCentro && (
              <div className="space-y-2">
                <Label htmlFor="centro">Centro Médico *</Label>
                <Select
                  value={formData.centroMedicoId}
                  onValueChange={(value) => setFormData({ ...formData, centroMedicoId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un centro..." />
                  </SelectTrigger>
                  <SelectContent>
                    {centrosMedicosData
                      .filter(c => c.estado === "activo")
                      .map((centro) => (
                        <SelectItem key={centro.id} value={centro.id}>
                          {centro.nombre} - {centro.canton}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo/Función *</Label>
              <Input
                id="cargo"
                placeholder="Ej: Médico Especialista, Médico de Guardia..."
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horario">Horario *</Label>
              <Input
                id="horario"
                placeholder="Ej: Lunes a Viernes, 8:00 AM - 4:00 PM"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="principal"
                checked={formData.esPrincipal}
                onChange={(e) => setFormData({ ...formData, esPrincipal: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="principal" className="cursor-pointer">
                Establecer como centro médico principal
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                placeholder="Información adicional..."
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowNewRequestDialog(false);
                setSelectedCentro(null);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSolicitarAsignacion}>
              <Send className="w-4 h-4 mr-2" />
              Enviar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Cancelar Asignación */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Asignación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea cancelar su asignación a{" "}
              <strong>{selectedAsignacion?.centroMedico.nombre}</strong>?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2 my-4">
            <Label htmlFor="motivo">Motivo de Cancelación *</Label>
            <Textarea
              id="motivo"
              placeholder="Indique el motivo de la cancelación..."
              value={motivoCancelacion}
              onChange={(e) => setMotivoCancelacion(e.target.value)}
              rows={4}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowCancelDialog(false);
              setMotivoCancelacion("");
              setSelectedAsignacion(null);
            }}>
              No, mantener
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelarAsignacion}>
              Sí, cancelar asignación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog: Detalle de Asignación */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle de Asignación</DialogTitle>
            <DialogDescription>
              Información completa de su asignación al centro médico
            </DialogDescription>
          </DialogHeader>

          {selectedAsignacion && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Centro Médico</h4>
                  <p className="font-medium">{selectedAsignacion.centroMedico.nombre}</p>
                  <p className="text-sm">{selectedAsignacion.centroMedico.codigo}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Estado</h4>
                  {renderEstadoBadge(selectedAsignacion.estado)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Cargo</h4>
                  <p>{selectedAsignacion.cargo}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Horario</h4>
                  <p>{selectedAsignacion.horario}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Ubicación</h4>
                <p>{selectedAsignacion.centroMedico.direccion}</p>
                <p className="text-sm">{selectedAsignacion.centroMedico.distrito}, {selectedAsignacion.centroMedico.canton}, {selectedAsignacion.centroMedico.provincia}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Fecha de Solicitud</h4>
                  <p>{new Date(selectedAsignacion.fechaSolicitud).toLocaleDateString()}</p>
                </div>
                {selectedAsignacion.fechaRespuesta && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Fecha de Respuesta</h4>
                    <p>{new Date(selectedAsignacion.fechaRespuesta).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {selectedAsignacion.motivoRechazo && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Motivo de Rechazo</AlertTitle>
                  <AlertDescription>{selectedAsignacion.motivoRechazo}</AlertDescription>
                </Alert>
              )}

              {selectedAsignacion.motivoCancelacion && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Motivo de Cancelación</AlertTitle>
                  <AlertDescription>{selectedAsignacion.motivoCancelacion}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowDetailDialog(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
