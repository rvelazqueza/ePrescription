/**
 * Módulo de Farmacias Registradas
 * Gestión completa de farmacias con ubicación geográfica de Costa Rica
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { PageBanner } from "../components/PageBanner";
import { ExportButtons } from "../components/ExportButtons";
import { TablePagination } from "../components/TablePagination";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner@2.0.3";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle2,
  FileText,
  Globe,
  User,
  Clock,
  Package,
  Save,
  X
} from "lucide-react";
import { normalizeSearchText } from "../utils/searchUtils";
import { usePagination } from "../utils/usePagination";
import { 
  provinciasCostaRica, 
  getCantonesByProvincia, 
  getDistritosByCanton,
  getFullLocation 
} from "../utils/costaRicaData";

interface Farmacia {
  id: string;
  codigo: string;
  nombre: string;
  provinciaId: string;
  cantonId: string;
  distritoId: string;
  direccionEspecifica: string;
  telefono: string;
  email: string;
  responsable: string;
  cedulaResponsable: string;
  estado: "activa" | "inactiva" | "suspendida";
  fechaRegistro: string;
  horario: string;
  observaciones: string;
}

// Datos de ejemplo
const farmaciasData: Farmacia[] = [
  {
    id: "1",
    codigo: "FARM-001",
    nombre: "Farmacia Central",
    provinciaId: "1",
    cantonId: "101",
    distritoId: "10103",
    direccionEspecifica: "Avenida Central, frente al Hospital San Juan de Dios",
    telefono: "2222-3344",
    email: "central@farmacia.cr",
    responsable: "Dr. Carlos Méndez Rojas",
    cedulaResponsable: "1-0234-0567",
    estado: "activa",
    fechaRegistro: "2023-01-15",
    horario: "Lunes a Viernes: 7:00 AM - 8:00 PM, Sábados: 8:00 AM - 6:00 PM",
    observaciones: "Farmacia principal del sistema"
  },
  {
    id: "2",
    codigo: "FARM-002",
    nombre: "Farmacia San José",
    provinciaId: "1",
    cantonId: "101",
    distritoId: "10102",
    direccionEspecifica: "Calle 5, Avenida 2, edificio azul, segundo piso",
    telefono: "2233-4455",
    email: "sanjose@farmacia.cr",
    responsable: "Dra. María González Castro",
    cedulaResponsable: "1-0456-0789",
    estado: "activa",
    fechaRegistro: "2023-02-20",
    horario: "Lunes a Domingo: 24 horas",
    observaciones: "Servicio 24/7"
  },
  {
    id: "3",
    codigo: "FARM-003",
    nombre: "Farmacia Escazú",
    provinciaId: "1",
    cantonId: "102",
    distritoId: "10201",
    direccionEspecifica: "Multiplaza Escazú, local 205",
    telefono: "2201-5566",
    email: "escazu@farmacia.cr",
    responsable: "Dr. Roberto Jiménez Salas",
    cedulaResponsable: "1-0678-0901",
    estado: "activa",
    fechaRegistro: "2023-03-10",
    horario: "Lunes a Domingo: 9:00 AM - 9:00 PM",
    observaciones: ""
  },
  {
    id: "4",
    codigo: "FARM-004",
    nombre: "Farmacia Desamparados",
    provinciaId: "1",
    cantonId: "103",
    distritoId: "10301",
    direccionEspecifica: "200 metros sur de la Iglesia, esquina opuesta al Banco Nacional",
    telefono: "2259-7788",
    email: "desamparados@farmacia.cr",
    responsable: "Dra. Ana Soto Vargas",
    cedulaResponsable: "1-0890-1234",
    estado: "activa",
    fechaRegistro: "2023-04-05",
    horario: "Lunes a Sábado: 8:00 AM - 7:00 PM",
    observaciones: ""
  },
  {
    id: "5",
    codigo: "FARM-005",
    nombre: "Farmacia Alajuela Centro",
    provinciaId: "2",
    cantonId: "201",
    distritoId: "20101",
    direccionEspecifica: "Avenida 3, entre calles 2 y 4, casa esquinera blanca",
    telefono: "2440-2233",
    email: "alajuela@farmacia.cr",
    responsable: "Dr. Luis Fernández Mora",
    cedulaResponsable: "2-0123-4567",
    estado: "activa",
    fechaRegistro: "2023-05-12",
    horario: "Lunes a Viernes: 7:30 AM - 7:30 PM, Sábados: 8:00 AM - 5:00 PM",
    observaciones: ""
  },
  {
    id: "6",
    codigo: "FARM-006",
    nombre: "Farmacia Cartago",
    provinciaId: "3",
    cantonId: "301",
    distritoId: "30101",
    direccionEspecifica: "Costado este de las Ruinas, edificio colonial restaurado",
    telefono: "2591-3344",
    email: "cartago@farmacia.cr",
    responsable: "Dra. Patricia Ramírez Solano",
    cedulaResponsable: "3-0234-5678",
    estado: "activa",
    fechaRegistro: "2023-06-20",
    horario: "Lunes a Sábado: 8:00 AM - 6:00 PM",
    observaciones: ""
  },
  {
    id: "7",
    codigo: "FARM-007",
    nombre: "Farmacia Heredia",
    provinciaId: "4",
    cantonId: "401",
    distritoId: "40101",
    direccionEspecifica: "Frente al Parque Central, segundo local a mano derecha",
    telefono: "2237-5566",
    email: "heredia@farmacia.cr",
    responsable: "Dr. Sergio Villalobos Chaves",
    cedulaResponsable: "4-0345-6789",
    estado: "activa",
    fechaRegistro: "2023-07-08",
    horario: "Lunes a Viernes: 7:00 AM - 8:00 PM, Sábados: 8:00 AM - 6:00 PM, Domingos: 9:00 AM - 2:00 PM",
    observaciones: ""
  },
  {
    id: "8",
    codigo: "FARM-008",
    nombre: "Farmacia Liberia",
    provinciaId: "5",
    cantonId: "501",
    distritoId: "50101",
    direccionEspecifica: "Diagonal a la Catedral, 50 metros norte",
    telefono: "2666-4477",
    email: "liberia@farmacia.cr",
    responsable: "Dra. Carmen Araya Bolaños",
    cedulaResponsable: "5-0456-7890",
    estado: "activa",
    fechaRegistro: "2023-08-15",
    horario: "Lunes a Sábado: 8:00 AM - 7:00 PM",
    observaciones: ""
  },
  {
    id: "9",
    codigo: "FARM-009",
    nombre: "Farmacia Puntarenas",
    provinciaId: "6",
    cantonId: "601",
    distritoId: "60101",
    direccionEspecifica: "Paseo de los Turistas, local 12-A",
    telefono: "2661-5588",
    email: "puntarenas@farmacia.cr",
    responsable: "Dr. Fernando Mora Alfaro",
    cedulaResponsable: "6-0567-8901",
    estado: "activa",
    fechaRegistro: "2023-09-22",
    horario: "Lunes a Domingo: 8:00 AM - 8:00 PM",
    observaciones: ""
  },
  {
    id: "10",
    codigo: "FARM-010",
    nombre: "Farmacia Limón Puerto",
    provinciaId: "7",
    cantonId: "701",
    distritoId: "70101",
    direccionEspecifica: "Avenida 2, frente al Mercado Municipal",
    telefono: "2758-6699",
    email: "limon@farmacia.cr",
    responsable: "Dra. Gabriela Quesada Torres",
    cedulaResponsable: "7-0678-9012",
    estado: "activa",
    fechaRegistro: "2023-10-10",
    horario: "Lunes a Sábado: 7:00 AM - 6:00 PM",
    observaciones: ""
  },
  {
    id: "11",
    codigo: "FARM-011",
    nombre: "Farmacia Santa Ana",
    provinciaId: "1",
    cantonId: "108",
    distritoId: "10801",
    direccionEspecifica: "Lindora, Forum II, planta baja",
    telefono: "2282-7700",
    email: "santaana@farmacia.cr",
    responsable: "Dr. Andrés Solís Campos",
    cedulaResponsable: "1-0789-0123",
    estado: "suspendida",
    fechaRegistro: "2023-11-05",
    horario: "Lunes a Viernes: 8:00 AM - 6:00 PM",
    observaciones: "Suspendida temporalmente por inventario"
  }
];

export function FarmaciasListPage() {
  const [farmacias] = useState<Farmacia[]>(farmaciasData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState<string>("todos");
  const [selectedProvincia, setSelectedProvincia] = useState<string>("todas");
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedFarmacia, setSelectedFarmacia] = useState<Farmacia | null>(null);
  const [showUppercase, setShowUppercase] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    provinciaId: "",
    cantonId: "",
    distritoId: "",
    direccionEspecifica: "",
    telefono: "",
    email: "",
    responsable: "",
    cedulaResponsable: "",
    estado: "activa" as "activa" | "inactiva" | "suspendida",
    horario: "",
    observaciones: ""
  });

  // Filtrado
  const filteredFarmacias = farmacias.filter((farmacia) => {
    const normalizedSearch = normalizeSearchText(searchTerm);
    
    const matchesSearch =
      normalizedSearch === "" ||
      normalizeSearchText(farmacia.codigo).includes(normalizedSearch) ||
      normalizeSearchText(farmacia.nombre).includes(normalizedSearch) ||
      normalizeSearchText(farmacia.direccionEspecifica).includes(normalizedSearch) ||
      normalizeSearchText(farmacia.telefono).includes(normalizedSearch) ||
      normalizeSearchText(farmacia.email).includes(normalizedSearch) ||
      normalizeSearchText(farmacia.responsable).includes(normalizedSearch);

    const matchesEstado = selectedEstado === "todos" || farmacia.estado === selectedEstado;
    
    const matchesProvincia = selectedProvincia === "todas" || farmacia.provinciaId === selectedProvincia;

    return matchesSearch && matchesEstado && matchesProvincia;
  });

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changePageSize,
  } = usePagination(filteredFarmacias, 10);

  // Handlers
  const handleInputChange = (field: string, value: string) => {
    if (field === "provinciaId") {
      setFormData({ ...formData, provinciaId: value, cantonId: "", distritoId: "" });
    } else if (field === "cantonId") {
      setFormData({ ...formData, cantonId: value, distritoId: "" });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSaveNew = () => {
    if (!formData.codigo || !formData.nombre || !formData.provinciaId || !formData.cantonId || !formData.distritoId) {
      toast.error("Campos requeridos", {
        description: "Complete todos los campos obligatorios marcados con *",
      });
      return;
    }
    
    toast.success("Farmacia registrada", {
      description: `${formData.nombre} ha sido registrada exitosamente`,
    });
    setShowNewDialog(false);
    resetForm();
  };

  const handleSaveEdit = () => {
    toast.success("Farmacia actualizada", {
      description: `Los cambios han sido guardados exitosamente`,
    });
    setShowEditDialog(false);
    setSelectedFarmacia(null);
    resetForm();
  };

  const handleEdit = (farmacia: Farmacia) => {
    setSelectedFarmacia(farmacia);
    setFormData({
      codigo: farmacia.codigo,
      nombre: farmacia.nombre,
      provinciaId: farmacia.provinciaId,
      cantonId: farmacia.cantonId,
      distritoId: farmacia.distritoId,
      direccionEspecifica: farmacia.direccionEspecifica,
      telefono: farmacia.telefono,
      email: farmacia.email,
      responsable: farmacia.responsable,
      cedulaResponsable: farmacia.cedulaResponsable,
      estado: farmacia.estado,
      horario: farmacia.horario,
      observaciones: farmacia.observaciones
    });
    setShowEditDialog(true);
  };

  const handleViewDetail = (farmacia: Farmacia) => {
    setSelectedFarmacia(farmacia);
    setShowDetailDialog(true);
  };

  const handleDelete = (farmacia: Farmacia) => {
    if (confirm(`¿Está seguro de eliminar la farmacia ${farmacia.nombre}?`)) {
      toast.success("Farmacia eliminada", {
        description: `${farmacia.nombre} ha sido eliminada del sistema`,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      codigo: "",
      nombre: "",
      provinciaId: "",
      cantonId: "",
      distritoId: "",
      direccionEspecifica: "",
      telefono: "",
      email: "",
      responsable: "",
      cedulaResponsable: "",
      estado: "activa",
      horario: "",
      observaciones: ""
    });
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activa":
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" />Activa</Badge>;
      case "inactiva":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200"><AlertCircle className="w-3 h-3 mr-1" />Inactiva</Badge>;
      case "suspendida":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><AlertCircle className="w-3 h-3 mr-1" />Suspendida</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  const formatText = (text: string) => {
    return showUppercase ? text.toUpperCase() : text;
  };

  const exportData = paginatedData.map((f) => ({
    "Código": f.codigo,
    "Nombre": f.nombre,
    "Ubicación": getFullLocation(f.provinciaId, f.cantonId, f.distritoId),
    "Dirección": f.direccionEspecifica,
    "Teléfono": f.telefono,
    "Email": f.email,
    "Responsable": f.responsable,
    "Estado": f.estado,
    "Fecha Registro": f.fechaRegistro
  }));

  return (
    <div className="space-y-6">
      {/* Banner */}
      <PageBanner
        title="Farmacias Registradas"
        description="Gestión y consulta de farmacias del sistema ePrescription en Costa Rica"
        icon={Building2}
      />

      {/* Filtros y acciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Listado de Farmacias</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredFarmacias.length} farmacia{filteredFarmacias.length !== 1 ? "s" : ""} encontrada{filteredFarmacias.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showUppercase ? "default" : "outline"}
                size="sm"
                onClick={() => setShowUppercase(!showUppercase)}
              >
                <FileText className="w-4 h-4 mr-2" />
                {showUppercase ? "MAYÚSCULAS ON" : "Case Normal"}
              </Button>
              <Button onClick={() => setShowNewDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Farmacia
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Búsqueda y filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por código, nombre, dirección, teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedProvincia} onValueChange={setSelectedProvincia}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las provincias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las provincias</SelectItem>
                {provinciasCostaRica.map((provincia) => (
                  <SelectItem key={provincia.id} value={provincia.id}>
                    {provincia.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedEstado} onValueChange={setSelectedEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="activa">Activas</SelectItem>
                <SelectItem value="inactiva">Inactivas</SelectItem>
                <SelectItem value="suspendida">Suspendidas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Exportación */}
          <div className="flex justify-end">
            <ExportButtons data={exportData} filename="farmacias_registradas" />
          </div>

          {/* Tabla */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Dirección Específica</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No se encontraron farmacias</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((farmacia) => (
                    <TableRow key={farmacia.id}>
                      <TableCell>
                        <span className="font-mono">{formatText(farmacia.codigo)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-primary" />
                          <span>{formatText(farmacia.nombre)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-sm">
                            {formatText(getFullLocation(farmacia.provinciaId, farmacia.cantonId, farmacia.distritoId))}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <span className="text-sm line-clamp-2">
                          {formatText(farmacia.direccionEspecifica)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm">{farmacia.telefono}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getEstadoBadge(farmacia.estado)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(farmacia)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(farmacia)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(farmacia)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={goToPage}
            onNextPage={goToNextPage}
            onPreviousPage={goToPreviousPage}
            onPageSizeChange={changePageSize}
          />
        </CardContent>
      </Card>

      {/* Dialog Ver Detalles */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de Farmacia</DialogTitle>
            <DialogDescription>
              Información completa de la farmacia seleccionada
            </DialogDescription>
          </DialogHeader>

          {selectedFarmacia && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Código</Label>
                  <p className="font-mono">{selectedFarmacia.codigo}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estado</Label>
                  <div className="mt-1">{getEstadoBadge(selectedFarmacia.estado)}</div>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Nombre</Label>
                  <p>{selectedFarmacia.nombre}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Ubicación</Label>
                  <p>{getFullLocation(selectedFarmacia.provinciaId, selectedFarmacia.cantonId, selectedFarmacia.distritoId)}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Dirección Específica</Label>
                  <p>{selectedFarmacia.direccionEspecifica}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Teléfono</Label>
                  <p>{selectedFarmacia.telefono}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p>{selectedFarmacia.email}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Regente Farmacéutico</Label>
                  <p>{selectedFarmacia.responsable}</p>
                  <p className="text-sm text-muted-foreground">Cédula: {selectedFarmacia.cedulaResponsable}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Horario</Label>
                  <p>{selectedFarmacia.horario}</p>
                </div>
                {selectedFarmacia.observaciones && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Observaciones</Label>
                    <p>{selectedFarmacia.observaciones}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Nueva/Editar Farmacia */}
      <Dialog open={showNewDialog || showEditDialog} onOpenChange={(open) => {
        if (!open) {
          setShowNewDialog(false);
          setShowEditDialog(false);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{showNewDialog ? "Registrar Nueva Farmacia" : "Editar Farmacia"}</DialogTitle>
            <DialogDescription>
              Complete la información de la farmacia. Los campos marcados con * son obligatorios.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Información básica */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-primary">
                <Building2 className="w-4 h-4" />
                Información Básica
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Código *</Label>
                  <Input
                    placeholder="FARM-XXX"
                    value={formData.codigo}
                    onChange={(e) => handleInputChange("codigo", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado *</Label>
                  <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activa">Activa</SelectItem>
                      <SelectItem value="inactiva">Inactiva</SelectItem>
                      <SelectItem value="suspendida">Suspendida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Nombre de la Farmacia *</Label>
                  <Input
                    placeholder="Ej: Farmacia Central"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-primary">
                <MapPin className="w-4 h-4" />
                Ubicación Geográfica
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Provincia *</Label>
                  <Select value={formData.provinciaId} onValueChange={(value) => handleInputChange("provinciaId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {provinciasCostaRica.map((provincia) => (
                        <SelectItem key={provincia.id} value={provincia.id}>
                          {provincia.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cantón *</Label>
                  <Select 
                    value={formData.cantonId} 
                    onValueChange={(value) => handleInputChange("cantonId", value)}
                    disabled={!formData.provinciaId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getCantonesByProvincia(formData.provinciaId).map((canton) => (
                        <SelectItem key={canton.id} value={canton.id}>
                          {canton.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Distrito *</Label>
                  <Select 
                    value={formData.distritoId} 
                    onValueChange={(value) => handleInputChange("distritoId", value)}
                    disabled={!formData.cantonId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getDistritosByCanton(formData.provinciaId, formData.cantonId).map((distrito) => (
                        <SelectItem key={distrito.id} value={distrito.id}>
                          {distrito.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Dirección Específica *</Label>
                <Textarea
                  placeholder="Ej: Avenida Central, 200 metros norte de..."
                  value={formData.direccionEspecifica}
                  onChange={(e) => handleInputChange("direccionEspecifica", e.target.value)}
                />
              </div>
            </div>

            {/* Contacto */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-primary">
                <Phone className="w-4 h-4" />
                Información de Contacto
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Teléfono *</Label>
                  <Input
                    placeholder="2222-3344"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange("telefono", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="farmacia@ejemplo.cr"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Responsable */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-primary">
                <User className="w-4 h-4" />
                Regente Farmacéutico
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre Completo</Label>
                  <Input
                    placeholder="Dr. Nombre Apellidos"
                    value={formData.responsable}
                    onChange={(e) => handleInputChange("responsable", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cédula</Label>
                  <Input
                    placeholder="1-0234-0567"
                    value={formData.cedulaResponsable}
                    onChange={(e) => handleInputChange("cedulaResponsable", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Horario */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-primary">
                <Clock className="w-4 h-4" />
                Horario de Atención
              </h4>
              <div className="space-y-2">
                <Textarea
                  placeholder="Ej: Lunes a Viernes: 7:00 AM - 8:00 PM"
                  value={formData.horario}
                  onChange={(e) => handleInputChange("horario", e.target.value)}
                />
              </div>
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Textarea
                placeholder="Información adicional..."
                value={formData.observaciones}
                onChange={(e) => handleInputChange("observaciones", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowNewDialog(false);
                setShowEditDialog(false);
                resetForm();
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={showNewDialog ? handleSaveNew : handleSaveEdit}>
              <Save className="w-4 h-4 mr-2" />
              {showNewDialog ? "Registrar" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
