/**
 * Consulta de Inventario por Farmacia
 * Visualización de saldos de medicamentos por farmacia
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
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
import { PageBanner } from "../components/PageBanner";
import { ExportButtons } from "../components/ExportButtons";
import { TablePagination } from "../components/TablePagination";
import {
  Package,
  Search,
  MapPin,
  Phone,
  Building2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  FileText
} from "lucide-react";
import { normalizeSearchText } from "../utils/searchUtils";
import { usePagination } from "../utils/usePagination";
import { getFullLocation } from "../utils/costaRicaData";

interface InventarioFarmacia {
  id: string;
  medicamentoId: string;
  medicamentoNombre: string;
  medicamentoCodigo: string;
  presentacion: string;
  farmaciaId: string;
  farmaciaNombre: string;
  farmaciaCode: string;
  provinciaId: string;
  cantonId: string;
  distritoId: string;
  direccionEspecifica: string;
  telefono: string;
  stock: number;
  stockMinimo: number;
  stockMaximo: number;
  lote: string;
  fechaVencimiento: string;
  ultimaActualizacion: string;
}

// Datos de ejemplo (integrados con farmacias y medicamentos)
const inventarioData: InventarioFarmacia[] = [
  {
    id: "1",
    medicamentoId: "MED001",
    medicamentoNombre: "Paracetamol",
    medicamentoCodigo: "PAR-500MG",
    presentacion: "500mg Tabletas x 100",
    farmaciaId: "1",
    farmaciaNombre: "Farmacia Central",
    farmaciaCode: "FARM-001",
    provinciaId: "1",
    cantonId: "101",
    distritoId: "10103",
    direccionEspecifica: "Avenida Central, frente al Hospital San Juan de Dios",
    telefono: "2222-3344",
    stock: 5420,
    stockMinimo: 1000,
    stockMaximo: 10000,
    lote: "LOT-2024-0456",
    fechaVencimiento: "2025-12-31",
    ultimaActualizacion: "2024-10-05 14:30:00"
  },
  {
    id: "2",
    medicamentoId: "MED002",
    medicamentoNombre: "Ibuprofeno",
    medicamentoCodigo: "IBU-400MG",
    presentacion: "400mg Tabletas x 50",
    farmaciaId: "1",
    farmaciaNombre: "Farmacia Central",
    farmaciaCode: "FARM-001",
    provinciaId: "1",
    cantonId: "101",
    distritoId: "10103",
    direccionEspecifica: "Avenida Central, frente al Hospital San Juan de Dios",
    telefono: "2222-3344",
    stock: 750,
    stockMinimo: 500,
    stockMaximo: 5000,
    lote: "LOT-2024-0789",
    fechaVencimiento: "2025-08-15",
    ultimaActualizacion: "2024-10-05 15:20:00"
  },
  {
    id: "3",
    medicamentoId: "MED003",
    medicamentoNombre: "Amoxicilina",
    medicamentoCodigo: "AMX-500MG",
    presentacion: "500mg Cápsulas x 21",
    farmaciaId: "2",
    farmaciaNombre: "Farmacia San José",
    farmaciaCode: "FARM-002",
    provinciaId: "1",
    cantonId: "101",
    distritoId: "10102",
    direccionEspecifica: "Calle 5, Avenida 2, edificio azul, segundo piso",
    telefono: "2233-4455",
    stock: 320,
    stockMinimo: 200,
    stockMaximo: 2000,
    lote: "LOT-2024-1023",
    fechaVencimiento: "2025-06-30",
    ultimaActualizacion: "2024-10-05 16:45:00"
  },
  {
    id: "4",
    medicamentoId: "MED001",
    medicamentoNombre: "Paracetamol",
    medicamentoCodigo: "PAR-500MG",
    presentacion: "500mg Tabletas x 100",
    farmaciaId: "3",
    farmaciaNombre: "Farmacia Escazú",
    farmaciaCode: "FARM-003",
    provinciaId: "1",
    cantonId: "102",
    distritoId: "10201",
    direccionEspecifica: "Multiplaza Escazú, local 205",
    telefono: "2201-5566",
    stock: 2100,
    stockMinimo: 800,
    stockMaximo: 8000,
    lote: "LOT-2024-0456",
    fechaVencimiento: "2025-12-31",
    ultimaActualizacion: "2024-10-05 09:15:00"
  },
  {
    id: "5",
    medicamentoId: "MED004",
    medicamentoNombre: "Metformina",
    medicamentoCodigo: "MET-850MG",
    presentacion: "850mg Tabletas x 60",
    farmaciaId: "1",
    farmaciaNombre: "Farmacia Central",
    farmaciaCode: "FARM-001",
    provinciaId: "1",
    cantonId: "101",
    distritoId: "10103",
    direccionEspecifica: "Avenida Central, frente al Hospital San Juan de Dios",
    telefono: "2222-3344",
    stock: 150,
    stockMinimo: 300,
    stockMaximo: 3000,
    lote: "LOT-2024-1156",
    fechaVencimiento: "2025-10-20",
    ultimaActualizacion: "2024-10-05 11:00:00"
  },
  {
    id: "6",
    medicamentoId: "MED005",
    medicamentoNombre: "Losartán",
    medicamentoCodigo: "LOS-50MG",
    presentacion: "50mg Tabletas x 30",
    farmaciaId: "2",
    farmaciaNombre: "Farmacia San José",
    farmaciaCode: "FARM-002",
    provinciaId: "1",
    cantonId: "101",
    distritoId: "10102",
    direccionEspecifica: "Calle 5, Avenida 2, edificio azul, segundo piso",
    telefono: "2233-4455",
    stock: 890,
    stockMinimo: 400,
    stockMaximo: 4000,
    lote: "LOT-2024-1287",
    fechaVencimiento: "2025-11-15",
    ultimaActualizacion: "2024-10-05 13:30:00"
  },
  {
    id: "7",
    medicamentoId: "MED002",
    medicamentoNombre: "Ibuprofeno",
    medicamentoCodigo: "IBU-400MG",
    presentacion: "400mg Tabletas x 50",
    farmaciaId: "4",
    farmaciaNombre: "Farmacia Desamparados",
    farmaciaCode: "FARM-004",
    provinciaId: "1",
    cantonId: "103",
    distritoId: "10301",
    direccionEspecifica: "200 metros sur de la Iglesia, esquina opuesta al Banco Nacional",
    telefono: "2259-7788",
    stock: 45,
    stockMinimo: 500,
    stockMaximo: 5000,
    lote: "LOT-2024-0789",
    fechaVencimiento: "2025-08-15",
    ultimaActualizacion: "2024-10-05 10:20:00"
  },
  {
    id: "8",
    medicamentoId: "MED006",
    medicamentoNombre: "Atorvastatina",
    medicamentoCodigo: "ATO-20MG",
    presentacion: "20mg Tabletas x 30",
    farmaciaId: "5",
    farmaciaNombre: "Farmacia Alajuela Centro",
    farmaciaCode: "FARM-005",
    provinciaId: "2",
    cantonId: "201",
    distritoId: "20101",
    direccionEspecifica: "Avenida 3, entre calles 2 y 4, casa esquinera blanca",
    telefono: "2440-2233",
    stock: 1250,
    stockMinimo: 600,
    stockMaximo: 6000,
    lote: "LOT-2024-1398",
    fechaVencimiento: "2025-09-30",
    ultimaActualizacion: "2024-10-05 08:45:00"
  },
  {
    id: "9",
    medicamentoId: "MED003",
    medicamentoNombre: "Amoxicilina",
    medicamentoCodigo: "AMX-500MG",
    presentacion: "500mg Cápsulas x 21",
    farmaciaId: "6",
    farmaciaNombre: "Farmacia Cartago",
    farmaciaCode: "FARM-006",
    provinciaId: "3",
    cantonId: "301",
    distritoId: "30101",
    direccionEspecifica: "Costado este de las Ruinas, edificio colonial restaurado",
    telefono: "2591-3344",
    stock: 580,
    stockMinimo: 200,
    stockMaximo: 2000,
    lote: "LOT-2024-1023",
    fechaVencimiento: "2025-06-30",
    ultimaActualizacion: "2024-10-05 12:10:00"
  },
  {
    id: "10",
    medicamentoId: "MED007",
    medicamentoNombre: "Omeprazol",
    medicamentoCodigo: "OME-20MG",
    presentacion: "20mg Cápsulas x 30",
    farmaciaId: "7",
    farmaciaNombre: "Farmacia Heredia",
    farmaciaCode: "FARM-007",
    provinciaId: "4",
    cantonId: "401",
    distritoId: "40101",
    direccionEspecifica: "Frente al Parque Central, segundo local a mano derecha",
    telefono: "2237-5566",
    stock: 1820,
    stockMinimo: 800,
    stockMaximo: 8000,
    lote: "LOT-2024-1445",
    fechaVencimiento: "2025-12-15",
    ultimaActualizacion: "2024-10-05 14:55:00"
  },
  {
    id: "11",
    medicamentoId: "MED001",
    medicamentoNombre: "Paracetamol",
    medicamentoCodigo: "PAR-500MG",
    presentacion: "500mg Tabletas x 100",
    farmaciaId: "8",
    farmaciaNombre: "Farmacia Liberia",
    farmaciaCode: "FARM-008",
    provinciaId: "5",
    cantonId: "501",
    distritoId: "50101",
    direccionEspecifica: "Diagonal a la Catedral, 50 metros norte",
    telefono: "2666-4477",
    stock: 3200,
    stockMinimo: 1000,
    stockMaximo: 10000,
    lote: "LOT-2024-0456",
    fechaVencimiento: "2025-12-31",
    ultimaActualizacion: "2024-10-05 15:40:00"
  },
  {
    id: "12",
    medicamentoId: "MED008",
    medicamentoNombre: "Salbutamol Inhalador",
    medicamentoCodigo: "SAL-100MCG",
    presentacion: "100mcg Inhalador 200 dosis",
    farmaciaId: "9",
    farmaciaNombre: "Farmacia Puntarenas",
    farmaciaCode: "FARM-009",
    provinciaId: "6",
    cantonId: "601",
    distritoId: "60101",
    direccionEspecifica: "Paseo de los Turistas, local 12-A",
    telefono: "2661-5588",
    stock: 85,
    stockMinimo: 100,
    stockMaximo: 1000,
    lote: "LOT-2024-1567",
    fechaVencimiento: "2025-07-22",
    ultimaActualizacion: "2024-10-05 09:30:00"
  },
  {
    id: "13",
    medicamentoId: "MED004",
    medicamentoNombre: "Metformina",
    medicamentoCodigo: "MET-850MG",
    presentacion: "850mg Tabletas x 60",
    farmaciaId: "10",
    farmaciaNombre: "Farmacia Limón Puerto",
    farmaciaCode: "FARM-010",
    provinciaId: "7",
    cantonId: "701",
    distritoId: "70101",
    direccionEspecifica: "Avenida 2, frente al Mercado Municipal",
    telefono: "2758-6699",
    stock: 440,
    stockMinimo: 300,
    stockMaximo: 3000,
    lote: "LOT-2024-1156",
    fechaVencimiento: "2025-10-20",
    ultimaActualizacion: "2024-10-05 11:25:00"
  },
  {
    id: "14",
    medicamentoId: "MED005",
    medicamentoNombre: "Losartán",
    medicamentoCodigo: "LOS-50MG",
    presentacion: "50mg Tabletas x 30",
    farmaciaId: "3",
    farmaciaNombre: "Farmacia Escazú",
    farmaciaCode: "FARM-003",
    provinciaId: "1",
    cantonId: "102",
    distritoId: "10201",
    direccionEspecifica: "Multiplaza Escazú, local 205",
    telefono: "2201-5566",
    stock: 1550,
    stockMinimo: 400,
    stockMaximo: 4000,
    lote: "LOT-2024-1287",
    fechaVencimiento: "2025-11-15",
    ultimaActualizacion: "2024-10-05 16:00:00"
  },
  {
    id: "15",
    medicamentoId: "MED009",
    medicamentoNombre: "Insulina Glargina",
    medicamentoCodigo: "INS-100UI",
    presentacion: "100 UI/mL Pluma precargada",
    farmaciaId: "2",
    farmaciaNombre: "Farmacia San José",
    farmaciaCode: "FARM-002",
    provinciaId: "1",
    cantonId: "101",
    distritoId: "10102",
    direccionEspecifica: "Calle 5, Avenida 2, edificio azul, segundo piso",
    telefono: "2233-4455",
    stock: 125,
    stockMinimo: 50,
    stockMaximo: 500,
    lote: "LOT-2024-1678",
    fechaVencimiento: "2025-05-10",
    ultimaActualizacion: "2024-10-05 14:20:00"
  }
];

export function ConsultaInventarioPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFarmacia, setSelectedFarmacia] = useState<string>("todas");
  const [selectedProvincia, setSelectedProvincia] = useState<string>("todas");
  const [alertLevel, setAlertLevel] = useState<string>("todos");
  const [showUppercase, setShowUppercase] = useState(false);

  // Filtrado
  const filteredInventario = inventarioData.filter((item) => {
    const normalizedSearch = normalizeSearchText(searchTerm);
    
    const matchesSearch =
      normalizedSearch === "" ||
      normalizeSearchText(item.medicamentoNombre).includes(normalizedSearch) ||
      normalizeSearchText(item.medicamentoCodigo).includes(normalizedSearch) ||
      normalizeSearchText(item.farmaciaNombre).includes(normalizedSearch) ||
      normalizeSearchText(item.farmaciaCode).includes(normalizedSearch) ||
      normalizeSearchText(item.direccionEspecifica).includes(normalizedSearch) ||
      normalizeSearchText(item.telefono).includes(normalizedSearch) ||
      normalizeSearchText(item.presentacion).includes(normalizedSearch) ||
      normalizeSearchText(getFullLocation(item.provinciaId, item.cantonId, item.distritoId)).includes(normalizedSearch);

    const matchesFarmacia = selectedFarmacia === "todas" || item.farmaciaId === selectedFarmacia;
    const matchesProvincia = selectedProvincia === "todas" || item.provinciaId === selectedProvincia;
    
    let matchesAlert = true;
    if (alertLevel === "critico") {
      matchesAlert = item.stock < item.stockMinimo;
    } else if (alertLevel === "bajo") {
      matchesAlert = item.stock >= item.stockMinimo && item.stock < (item.stockMinimo * 1.5);
    } else if (alertLevel === "normal") {
      matchesAlert = item.stock >= (item.stockMinimo * 1.5);
    }

    return matchesSearch && matchesFarmacia && matchesProvincia && matchesAlert;
  });

  const {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedData,
    goToPage,
    changePageSize,
  } = usePagination(filteredInventario, 15);

  // Obtener lista única de farmacias
  const farmaciasUnicas = Array.from(
    new Map(
      inventarioData.map(item => [item.farmaciaId, { id: item.farmaciaId, nombre: item.farmaciaNombre, codigo: item.farmaciaCode }])
    ).values()
  );

  const getStockBadge = (item: InventarioFarmacia) => {
    if (item.stock < item.stockMinimo) {
      return <Badge className="bg-red-100 text-red-800 border-red-200"><AlertTriangle className="w-3 h-3 mr-1" />Crítico</Badge>;
    } else if (item.stock < item.stockMinimo * 1.5) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><AlertCircle className="w-3 h-3 mr-1" />Bajo</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" />Normal</Badge>;
    }
  };

  const formatText = (text: string) => {
    return showUppercase ? text.toUpperCase() : text;
  };

  const exportData = paginatedData.map((item) => ({
    "Código Medicamento": item.medicamentoCodigo,
    "Nombre Medicamento": item.medicamentoNombre,
    "Presentación": item.presentacion,
    "Código Farmacia": item.farmaciaCode,
    "Nombre Farmacia": item.farmaciaNombre,
    "Ubicación": getFullLocation(item.provinciaId, item.cantonId, item.distritoId),
    "Dirección": item.direccionEspecifica,
    "Teléfono": item.telefono,
    "Stock Actual": item.stock,
    "Stock Mínimo": item.stockMinimo,
    "Lote": item.lote,
    "Vencimiento": item.fechaVencimiento,
    "Última Actualización": item.ultimaActualizacion
  }));

  return (
    <div className="space-y-6">
      {/* Banner */}
      <PageBanner
        title="Consulta de Inventario por Farmacia"
        description="Visualización de saldos de medicamentos en todas las farmacias del sistema"
        icon={Package}
      />

      {/* Filtros y consulta */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Saldos de Medicamentos</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredInventario.length} registro{filteredInventario.length !== 1 ? "s" : ""} encontrado{filteredInventario.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button
              variant={showUppercase ? "default" : "outline"}
              size="sm"
              onClick={() => setShowUppercase(!showUppercase)}
            >
              <FileText className="w-4 h-4 mr-2" />
              {showUppercase ? "MAYÚSCULAS ON" : "Case Normal"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Búsqueda y filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por medicamento, farmacia, ubicación, teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedFarmacia} onValueChange={setSelectedFarmacia}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las farmacias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las farmacias</SelectItem>
                {farmaciasUnicas.map((farmacia) => (
                  <SelectItem key={farmacia.id} value={farmacia.id}>
                    {farmacia.codigo} - {farmacia.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={alertLevel} onValueChange={setAlertLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Nivel de stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los niveles</SelectItem>
                <SelectItem value="critico">Stock crítico</SelectItem>
                <SelectItem value="bajo">Stock bajo</SelectItem>
                <SelectItem value="normal">Stock normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Exportación */}
          <div className="flex justify-end">
            <ExportButtons data={exportData} filename="inventario_farmacias" />
          </div>

          {/* Tabla */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicamento</TableHead>
                  <TableHead>Presentación</TableHead>
                  <TableHead>Farmacia</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No se encontraron registros de inventario</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatText(item.medicamentoNombre)}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.medicamentoCodigo}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{formatText(item.presentacion)}</TableCell>
                      <TableCell>
                        <div className="flex items-start gap-1.5">
                          <Building2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm">{formatText(item.farmaciaNombre)}</p>
                            <p className="text-xs text-muted-foreground font-mono">{item.farmaciaCode}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-sm">
                            {formatText(getFullLocation(item.provinciaId, item.cantonId, item.distritoId))}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <span className="text-sm line-clamp-2">{formatText(item.direccionEspecifica)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm">{item.telefono}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="space-y-1">
                          <p className="font-mono">{item.stock.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            Min: {item.stockMinimo.toLocaleString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStockBadge(item)}</TableCell>
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
            totalItems={totalItems}
            onPageChange={goToPage}
            onPageSizeChange={changePageSize}
          />

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Registros</p>
                    <p className="text-2xl font-mono">{filteredInventario.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Crítico</p>
                    <p className="text-2xl font-mono text-red-600">
                      {filteredInventario.filter(i => i.stock < i.stockMinimo).length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Bajo</p>
                    <p className="text-2xl font-mono text-yellow-600">
                      {filteredInventario.filter(i => i.stock >= i.stockMinimo && i.stock < i.stockMinimo * 1.5).length}
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Normal</p>
                    <p className="text-2xl font-mono text-green-600">
                      {filteredInventario.filter(i => i.stock >= i.stockMinimo * 1.5).length}
                    </p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
