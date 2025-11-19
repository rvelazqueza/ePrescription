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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { PageBanner } from "../components/PageBanner";
import { ExportButtons } from "../components/ExportButtons";
import { TablePagination } from "../components/TablePagination";
import {
  Receipt,
  Search,
  ShoppingCart,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  FileText,
  Package,
  Building2,
  User,
  Calendar,
  DollarSign,
  Download,
  Eye,
  Plus,
  Wallet,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { normalizeSearchText } from "../utils/searchUtils";
import { usePagination } from "../utils/usePagination";
import { toast } from "sonner";
import { Separator } from "../components/ui/separator";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

// Tipos de datos
interface Talonario {
  id: string;
  tipo: "receta" | "despacho";
  subTipo?: "antimicrobiano" | "estupefaciente" | "psicotropico" | "normal";
  codigoInicio: string;
  codigoFin: string;
  cantidad: number;
  estado: "activo" | "agotado" | "vencido";
  fechaAdquisicion: string;
  fechaVencimiento: string;
  disponibles: number;
  usados: number;
  precio: number;
  numeroFactura: string;
  metodoPago: string;
}

interface CompraHistorial {
  id: string;
  fecha: string;
  numeroOrden: string;
  tipo: "receta" | "despacho";
  subTipo?: "antimicrobiano" | "estupefaciente" | "psicotropico" | "normal";
  cantidad: number;
  precioUnitario: number;
  total: number;
  estado: "completado" | "pendiente" | "rechazado";
  metodoPago: string;
  numeroFactura?: string;
  profesional: {
    nombre: string;
    codigo: string;
    colegio: string;
    estado: "activo" | "inactivo" | "suspendido";
  };
}

// Configuración parametrizable del sistema
const LIMITES_TALONARIOS = {
  receta: {
    antimicrobiano: 5,
    estupefaciente: 3,
    psicotropico: 4,
    normal: 10
  },
  despacho: {
    normal: 15
  }
};

const PRECIOS_TALONARIOS = {
  receta: {
    antimicrobiano: 2500,
    estupefaciente: 3500,
    psicotropico: 3000,
    normal: 1500
  },
  despacho: {
    normal: 1000
  }
};

// Datos de ejemplo - Mis Talonarios (incluye información del profesional actual)
// Sincronizado con talonariosGeneralData para el Dr. Juan Pérez González (MED-12345)
const talonariosData: Array<Talonario & { profesional: { nombre: string; codigo: string; especialidad: string } }> = [
  {
    id: "TAL-001",
    tipo: "receta",
    subTipo: "antimicrobiano",
    codigoInicio: "ANT-2024-001",
    codigoFin: "ANT-2024-050",
    cantidad: 50,
    estado: "activo",
    fechaAdquisicion: "2024-01-15",
    fechaVencimiento: "2025-01-15",
    disponibles: 28,
    usados: 22,
    precio: 2500,
    numeroFactura: "FACT-2024-0015",
    metodoPago: "Tarjeta de crédito",
    profesional: {
      nombre: "Dr. Juan Pérez González",
      codigo: "MED-12345",
      especialidad: "Medicina General"
    }
  },
  {
    id: "TAL-002",
    tipo: "receta",
    subTipo: "estupefaciente",
    codigoInicio: "EST-2024-001",
    codigoFin: "EST-2024-030",
    cantidad: 30,
    estado: "activo",
    fechaAdquisicion: "2024-02-10",
    fechaVencimiento: "2025-02-10",
    disponibles: 15,
    usados: 15,
    precio: 3500,
    numeroFactura: "FACT-2024-0042",
    metodoPago: "Transferencia bancaria",
    profesional: {
      nombre: "Dr. Juan Pérez González",
      codigo: "MED-12345",
      especialidad: "Medicina General"
    }
  }
];

const comprasHistorialData: CompraHistorial[] = [
  {
    id: "COMP-001",
    fecha: "2024-10-05 14:30:00",
    numeroOrden: "ORD-2024-1523",
    tipo: "receta",
    subTipo: "antimicrobiano",
    cantidad: 2,
    precioUnitario: 2500,
    total: 5000,
    estado: "completado",
    metodoPago: "Tarjeta de crédito VISA ****1234",
    numeroFactura: "FACT-2024-1523",
    profesional: {
      nombre: "Dr. Carlos Méndez Solís",
      codigo: "MED-12345",
      colegio: "Colegio de Médicos y Cirujanos de Costa Rica",
      estado: "activo"
    }
  },
  {
    id: "COMP-002",
    fecha: "2024-10-04 10:15:00",
    numeroOrden: "ORD-2024-1498",
    tipo: "receta",
    subTipo: "normal",
    cantidad: 5,
    precioUnitario: 1500,
    total: 7500,
    estado: "completado",
    metodoPago: "Transferencia SINPE Móvil",
    numeroFactura: "FACT-2024-1498",
    profesional: {
      nombre: "Dra. María Rodríguez Castro",
      codigo: "MED-67890",
      colegio: "Colegio de Médicos y Cirujanos de Costa Rica",
      estado: "activo"
    }
  },
  {
    id: "COMP-003",
    fecha: "2024-10-03 16:45:00",
    numeroOrden: "ORD-2024-1475",
    tipo: "despacho",
    cantidad: 10,
    precioUnitario: 1000,
    total: 10000,
    estado: "completado",
    metodoPago: "Tarjeta de débito BAC ****5678",
    numeroFactura: "FACT-2024-1475",
    profesional: {
      nombre: "Farm. Ana Gutiérrez Mora",
      codigo: "FARM-24680",
      colegio: "Colegio de Farmacéuticos de Costa Rica",
      estado: "activo"
    }
  }
];

// Datos expandidos para listado general (incluye múltiples profesionales)
const talonariosGeneralData: Array<Talonario & { profesional: { nombre: string; codigo: string; especialidad: string } }> = [
  {
    id: "TAL-001",
    tipo: "receta",
    subTipo: "antimicrobiano",
    codigoInicio: "ANT-2024-001",
    codigoFin: "ANT-2024-050",
    cantidad: 50,
    estado: "activo",
    fechaAdquisicion: "2024-01-15",
    fechaVencimiento: "2025-01-15",
    disponibles: 28,
    usados: 22,
    precio: 2500,
    numeroFactura: "FACT-2024-0015",
    metodoPago: "Tarjeta de crédito",
    profesional: {
      nombre: "Dr. Juan Pérez González",
      codigo: "MED-12345",
      especialidad: "Medicina General"
    }
  },
  {
    id: "TAL-002",
    tipo: "receta",
    subTipo: "estupefaciente",
    codigoInicio: "EST-2024-001",
    codigoFin: "EST-2024-030",
    cantidad: 30,
    estado: "activo",
    fechaAdquisicion: "2024-02-10",
    fechaVencimiento: "2025-02-10",
    disponibles: 15,
    usados: 15,
    precio: 3500,
    numeroFactura: "FACT-2024-0042",
    metodoPago: "Transferencia bancaria",
    profesional: {
      nombre: "Dr. Juan Pérez González",
      codigo: "MED-12345",
      especialidad: "Medicina General"
    }
  },
  {
    id: "TAL-006",
    tipo: "receta",
    subTipo: "antimicrobiano",
    codigoInicio: "ANT-2024-051",
    codigoFin: "ANT-2024-100",
    cantidad: 50,
    estado: "activo",
    fechaAdquisicion: "2024-03-01",
    fechaVencimiento: "2025-03-01",
    disponibles: 42,
    usados: 8,
    precio: 2500,
    numeroFactura: "FACT-2024-0156",
    metodoPago: "Tarjeta de crédito",
    profesional: {
      nombre: "Dra. María Rodríguez Castro",
      codigo: "MED-67890",
      especialidad: "Pediatría"
    }
  },
  {
    id: "TAL-007",
    tipo: "receta",
    subTipo: "normal",
    codigoInicio: "REC-2024-101",
    codigoFin: "REC-2024-200",
    cantidad: 100,
    estado: "activo",
    fechaAdquisicion: "2024-03-10",
    fechaVencimiento: "2025-03-10",
    disponibles: 85,
    usados: 15,
    precio: 1500,
    numeroFactura: "FACT-2024-0178",
    metodoPago: "SINPE Móvil",
    profesional: {
      nombre: "Dr. Carlos Méndez Solís",
      codigo: "MED-24680",
      especialidad: "Cardiología"
    }
  },
  {
    id: "TAL-008",
    tipo: "despacho",
    subTipo: "normal",
    codigoInicio: "DESP-2024-151",
    codigoFin: "DESP-2024-300",
    cantidad: 150,
    estado: "activo",
    fechaAdquisicion: "2024-04-05",
    fechaVencimiento: "2025-04-05",
    disponibles: 120,
    usados: 30,
    precio: 1000,
    numeroFactura: "FACT-2024-0205",
    metodoPago: "Tarjeta de débito",
    profesional: {
      nombre: "Farm. Ana Gutiérrez Mora",
      codigo: "FARM-13579",
      especialidad: "Farmacia Clínica"
    }
  },
  {
    id: "TAL-009",
    tipo: "receta",
    subTipo: "psicotropico",
    codigoInicio: "PSI-2024-001",
    codigoFin: "PSI-2024-040",
    cantidad: 40,
    estado: "activo",
    fechaAdquisicion: "2024-04-15",
    fechaVencimiento: "2025-04-15",
    disponibles: 30,
    usados: 10,
    precio: 3000,
    numeroFactura: "FACT-2024-0234",
    metodoPago: "Transferencia bancaria",
    profesional: {
      nombre: "Dra. Laura Fernández Vega",
      codigo: "MED-98765",
      especialidad: "Psiquiatría"
    }
  },
  {
    id: "TAL-010",
    tipo: "receta",
    subTipo: "estupefaciente",
    codigoInicio: "EST-2024-031",
    codigoFin: "EST-2024-060",
    cantidad: 30,
    estado: "activo",
    fechaAdquisicion: "2024-05-01",
    fechaVencimiento: "2025-05-01",
    disponibles: 25,
    usados: 5,
    precio: 3500,
    numeroFactura: "FACT-2024-0267",
    metodoPago: "Tarjeta de crédito",
    profesional: {
      nombre: "Dr. Roberto Jiménez Mora",
      codigo: "MED-11223",
      especialidad: "Anestesiología"
    }
  },
  {
    id: "TAL-011",
    tipo: "receta",
    subTipo: "normal",
    codigoInicio: "REC-2024-201",
    codigoFin: "REC-2024-300",
    cantidad: 100,
    estado: "agotado",
    fechaAdquisicion: "2024-01-20",
    fechaVencimiento: "2025-01-20",
    disponibles: 0,
    usados: 100,
    precio: 1500,
    numeroFactura: "FACT-2024-0045",
    metodoPago: "SINPE Móvil",
    profesional: {
      nombre: "Dra. María Rodríguez Castro",
      codigo: "MED-67890",
      especialidad: "Pediatría"
    }
  },
  {
    id: "TAL-012",
    tipo: "despacho",
    subTipo: "normal",
    codigoInicio: "DESP-2024-301",
    codigoFin: "DESP-2024-450",
    cantidad: 150,
    estado: "activo",
    fechaAdquisicion: "2024-05-10",
    fechaVencimiento: "2025-05-10",
    disponibles: 135,
    usados: 15,
    precio: 1000,
    numeroFactura: "FACT-2024-0289",
    metodoPago: "Transferencia bancaria",
    profesional: {
      nombre: "Farm. Pedro Vargas Solís",
      codigo: "FARM-24680",
      especialidad: "Farmacia Hospitalaria"
    }
  }
];

// Componente principal
export function ComprarTalonariosPage() {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showHistorialDialog, setShowHistorialDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<CompraHistorial | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<string>("todos");
  const [selectedEstado, setSelectedEstado] = useState<string>("todos");
  const [showUppercase, setShowUppercase] = useState(false);
  const [validatingProfessional, setValidatingProfessional] = useState(false);
  const [professionalValidated, setProfessionalValidated] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [vistaFiltro, setVistaFiltro] = useState<"todos" | "mis">("mis");

  // Formulario de compra
  const [formData, setFormData] = useState({
    tipo: "receta" as "receta" | "despacho",
    subTipo: "" as string,
    cantidad: 1,
    codigoProfesional: "",
    colegioProfesional: "",
    nombreProfesional: "",
    estadoProfesional: "" as "activo" | "inactivo" | "suspendido" | "",
    metodoPago: "",
    numeroTarjeta: "",
    nombreTitular: "",
    fechaExpiracion: "",
    cvv: "",
    sinpeMovil: "",
    numeroTransferencia: ""
  });

  const [currentOrder, setCurrentOrder] = useState<CompraHistorial | null>(null);

  // Obtener datos según vista seleccionada
  const getDataSource = () => {
    if (vistaFiltro === "mis") {
      return talonariosData;
    }
    return talonariosGeneralData;
  };

  // Filtrado
  const filteredTalonarios = getDataSource().filter((item: any) => {
    const normalizedSearch = normalizeSearchText(searchTerm);
    
    const matchesSearch =
      normalizedSearch === "" ||
      normalizeSearchText(item.id).includes(normalizedSearch) ||
      normalizeSearchText(item.codigoInicio).includes(normalizedSearch) ||
      normalizeSearchText(item.codigoFin).includes(normalizedSearch) ||
      normalizeSearchText(item.numeroFactura).includes(normalizedSearch) ||
      normalizeSearchText(item.tipo).includes(normalizedSearch) ||
      (item.subTipo && normalizeSearchText(item.subTipo).includes(normalizedSearch)) ||
      (item.profesional && normalizeSearchText(item.profesional.nombre).includes(normalizedSearch));

    const matchesTipo = selectedTipo === "todos" || item.tipo === selectedTipo;
    const matchesEstado = selectedEstado === "todos" || item.estado === selectedEstado;

    return matchesSearch && matchesTipo && matchesEstado;
  });

  // Paginación
  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData,
    goToPage,
    changePageSize,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(filteredTalonarios, 10);

  // Calcular precio total
  const calcularPrecioTotal = (): number => {
    if (!formData.tipo) return 0;
    
    if (formData.tipo === "receta" && formData.subTipo) {
      const precio = PRECIOS_TALONARIOS.receta[formData.subTipo as keyof typeof PRECIOS_TALONARIOS.receta] || 0;
      return precio * formData.cantidad;
    }
    
    if (formData.tipo === "despacho") {
      return PRECIOS_TALONARIOS.despacho.normal * formData.cantidad;
    }
    
    return 0;
  };

  // Obtener límite de cantidad
  const obtenerLimiteCantidad = (): number => {
    if (formData.tipo === "receta" && formData.subTipo) {
      return LIMITES_TALONARIOS.receta[formData.subTipo as keyof typeof LIMITES_TALONARIOS.receta] || 1;
    }
    if (formData.tipo === "despacho") {
      return LIMITES_TALONARIOS.despacho.normal;
    }
    return 1;
  };

  // Validar código profesional con colegio (simulado)
  const validarCodigoProfesional = async () => {
    setValidatingProfessional(true);
    
    // Simulación de llamada a API de colegio profesional
    setTimeout(() => {
      // Simulación de respuesta exitosa
      setFormData({
        ...formData,
        nombreProfesional: "Dr. Juan Pérez González",
        estadoProfesional: "activo"
      });
      setProfessionalValidated(true);
      setValidatingProfessional(false);
      toast.success("Código profesional validado correctamente");
    }, 1500);
  };

  // Procesar pago
  const procesarPago = async () => {
    if (!formData.metodoPago) {
      toast.error("Debe seleccionar un método de pago");
      return;
    }

    if (formData.metodoPago === "tarjeta" && (!formData.numeroTarjeta || !formData.nombreTitular || !formData.fechaExpiracion || !formData.cvv)) {
      toast.error("Complete todos los datos de la tarjeta");
      return;
    }

    if (formData.metodoPago === "sinpe" && !formData.sinpeMovil) {
      toast.error("Ingrese el número de SINPE Móvil");
      return;
    }

    setProcessingPayment(true);

    // Simulación de procesamiento de pago
    setTimeout(() => {
      const nuevaCompra: CompraHistorial = {
        id: `COMP-${String(comprasHistorialData.length + 1).padStart(3, "0")}`,
        fecha: new Date().toISOString().replace("T", " ").substring(0, 19),
        numeroOrden: `ORD-2024-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        tipo: formData.tipo,
        subTipo: formData.subTipo as any,
        cantidad: formData.cantidad,
        precioUnitario: calcularPrecioTotal() / formData.cantidad,
        total: calcularPrecioTotal(),
        estado: "completado",
        metodoPago: formData.metodoPago === "tarjeta" 
          ? `Tarjeta ****${formData.numeroTarjeta.slice(-4)}`
          : formData.metodoPago === "sinpe"
          ? `SINPE Móvil ${formData.sinpeMovil}`
          : `Transferencia ${formData.numeroTransferencia}`,
        numeroFactura: `FACT-2024-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        profesional: {
          nombre: formData.nombreProfesional,
          codigo: formData.codigoProfesional,
          colegio: formData.colegioProfesional,
          estado: formData.estadoProfesional
        }
      };

      setCurrentOrder(nuevaCompra);
      setProcessingPayment(false);
      setShowPaymentDialog(false);
      setShowInvoiceDialog(true);
      toast.success("Compra realizada exitosamente");
    }, 2000);
  };

  // Reiniciar formulario
  const reiniciarFormulario = () => {
    setFormData({
      tipo: "receta",
      subTipo: "",
      cantidad: 1,
      codigoProfesional: "",
      colegioProfesional: "",
      nombreProfesional: "",
      estadoProfesional: "",
      metodoPago: "",
      numeroTarjeta: "",
      nombreTitular: "",
      fechaExpiracion: "",
      cvv: "",
      sinpeMovil: "",
      numeroTransferencia: ""
    });
    setProfessionalValidated(false);
    setShowNewDialog(false);
    setShowPaymentDialog(false);
  };

  // Renderizar badge de estado
  const renderEstadoBadge = (estado: string) => {
    const variants = {
      activo: "bg-green-100 text-green-800",
      agotado: "bg-red-100 text-red-800",
      vencido: "bg-gray-100 text-gray-800"
    };
    return (
      <Badge className={variants[estado as keyof typeof variants]}>
        {estado.toUpperCase()}
      </Badge>
    );
  };

  // Renderizar badge de tipo
  const renderTipoBadge = (tipo: string, subTipo?: string) => {
    if (tipo === "receta") {
      const colors = {
        antimicrobiano: "bg-blue-100 text-blue-800",
        estupefaciente: "bg-purple-100 text-purple-800",
        psicotropico: "bg-pink-100 text-pink-800",
        normal: "bg-gray-100 text-gray-800"
      };
      return (
        <Badge className={subTipo ? colors[subTipo as keyof typeof colors] : "bg-gray-100 text-gray-800"}>
          {subTipo ? subTipo.toUpperCase() : "RECETA"}
        </Badge>
      );
    }
    return (
      <Badge className="bg-teal-100 text-teal-800">
        DESPACHO
      </Badge>
    );
  };

  const transformText = (text: string) => showUppercase ? text.toUpperCase() : text;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <PageBanner
        icon={Receipt}
        title="Compra de Talonarios"
        description="Gestión y adquisición de talonarios para recetas y despacho de medicamentos controlados"
      />

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Talonarios Activos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getDataSource().filter((t: any) => t.estado === "activo").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {vistaFiltro === "todos" ? "En todo el sistema" : "En uso actualmente"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Disponibles</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getDataSource().reduce((sum: number, t: any) => sum + t.disponibles, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Talonarios sin usar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Utilizados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getDataSource().reduce((sum: number, t: any) => sum + t.usados, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total emitidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">
              {vistaFiltro === "todos" ? "Total Profesionales" : "Compras este mes"}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vistaFiltro === "todos" 
                ? new Set(talonariosGeneralData.map(t => t.profesional.codigo)).size
                : comprasHistorialData.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {vistaFiltro === "todos" ? "Con talonarios activos" : "Octubre 2024"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {vistaFiltro === "todos" ? "Todos los Talonarios" : "Mis Talonarios"}
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={() => setShowHistorialDialog(true)} variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Historial de Compras
              </Button>
              <Button onClick={() => setShowNewDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Comprar Talonarios
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Tabs de filtrado de vista */}
            <Tabs value={vistaFiltro} onValueChange={(value) => {
              setVistaFiltro(value as "todos" | "mis");
              setSearchTerm("");
            }}>
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="mis">
                  <User className="w-4 h-4 mr-2" />
                  Mis Talonarios
                </TabsTrigger>
                <TabsTrigger value="todos">
                  <Package className="w-4 h-4 mr-2" />
                  Todos los Talonarios
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Búsqueda y filtros */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={vistaFiltro === "todos" ? "Buscar por ID, código, profesional, factura..." : "Buscar por ID, código, factura..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="receta">Receta</SelectItem>
                  <SelectItem value="despacho">Despacho</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="agotado">Agotado</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowUppercase(!showUppercase)}
                className="whitespace-nowrap"
              >
                {showUppercase ? "Normal" : "MAYÚSCULAS"}
              </Button>
            </div>

            {/* Exportación */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Mostrando {paginatedData.length} de {filteredTalonarios.length} talonario(s)
                {vistaFiltro === "todos" && (
                  <span className="ml-2 text-blue-600">
                    · Vista completa del sistema
                  </span>
                )}
              </p>
              <ExportButtons
                data={filteredTalonarios}
                filename={vistaFiltro === "todos" ? "todos-talonarios" : "mis-talonarios"}
                pdfTitle={vistaFiltro === "todos" ? "Todos los Talonarios - Sistema ePrescription" : "Mis Talonarios"}
              />
            </div>

            {/* Tabla */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Profesional</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Código Inicio</TableHead>
                    <TableHead>Código Fin</TableHead>
                    <TableHead>Cantidad Total</TableHead>
                    <TableHead>Disponibles</TableHead>
                    <TableHead>Usados</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>F. Adquisición</TableHead>
                    <TableHead>F. Vencimiento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{transformText(item.id)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.profesional?.nombre}</span>
                            <span className="text-xs text-muted-foreground">{item.profesional?.codigo}</span>
                            <span className="text-xs text-muted-foreground">{item.profesional?.especialidad}</span>
                          </div>
                        </TableCell>
                        <TableCell>{renderTipoBadge(item.tipo, item.subTipo)}</TableCell>
                        <TableCell>{transformText(item.codigoInicio)}</TableCell>
                        <TableCell>{transformText(item.codigoFin)}</TableCell>
                        <TableCell>{item.cantidad}</TableCell>
                        <TableCell>
                          <span className="text-green-600 font-medium">{item.disponibles}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">{item.usados}</span>
                        </TableCell>
                        <TableCell>{renderEstadoBadge(item.estado)}</TableCell>
                        <TableCell>{new Date(item.fechaAdquisicion).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(item.fechaVencimiento).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No se encontraron talonarios</p>
                      </TableCell>
                    </TableRow>
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
              onPageSizeChange={changePageSize}
              onFirstPage={goToFirstPage}
              onLastPage={goToLastPage}
              onNextPage={goToNextPage}
              onPreviousPage={goToPreviousPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialog: Nueva Compra */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comprar Talonarios</DialogTitle>
            <DialogDescription>
              Complete la información para adquirir talonarios. El sistema validará su código profesional con el colegio correspondiente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Datos del profesional */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <h4 className="font-medium">Datos del Profesional</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="colegio">Colegio Profesional *</Label>
                  <Select
                    value={formData.colegioProfesional}
                    onValueChange={(value) => setFormData({ ...formData, colegioProfesional: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medicos">Colegio de Médicos y Cirujanos</SelectItem>
                      <SelectItem value="farmaceuticos">Colegio de Farmacéuticos</SelectItem>
                      <SelectItem value="veterinarios">Colegio de Médicos Veterinarios</SelectItem>
                      <SelectItem value="enfermeros">Colegio de Enfermeros</SelectItem>
                      <SelectItem value="odontologos">Colegio de Cirujanos Dentistas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo">Código Profesional *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="codigo"
                      placeholder="MED-12345"
                      value={formData.codigoProfesional}
                      onChange={(e) => setFormData({ ...formData, codigoProfesional: e.target.value })}
                      disabled={professionalValidated}
                    />
                    <Button
                      onClick={validarCodigoProfesional}
                      disabled={!formData.codigoProfesional || !formData.colegioProfesional || professionalValidated || validatingProfessional}
                      size="sm"
                    >
                      {validatingProfessional ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : professionalValidated ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {professionalValidated && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Código Validado</AlertTitle>
                  <AlertDescription>
                    <strong>{formData.nombreProfesional}</strong><br />
                    Estado: <Badge className="bg-green-100 text-green-800">{formData.estadoProfesional?.toUpperCase()}</Badge>
                  </AlertDescription>
                </Alert>
              )}

              {professionalValidated && formData.estadoProfesional !== "activo" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Código No Activo</AlertTitle>
                  <AlertDescription>
                    El código profesional no está en estado activo. No puede realizar compras de talonarios.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Tipo de talonario */}
            {professionalValidated && formData.estadoProfesional === "activo" && (
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  <h4 className="font-medium">Tipo de Talonario</h4>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Uso del Talonario *</Label>
                    <RadioGroup
                      value={formData.tipo}
                      onValueChange={(value: "receta" | "despacho") => 
                        setFormData({ ...formData, tipo: value, subTipo: "", cantidad: 1 })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="receta" id="receta" />
                        <Label htmlFor="receta">Receta médica</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="despacho" id="despacho" />
                        <Label htmlFor="despacho">Despacho de farmacia</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.tipo === "receta" && (
                    <div className="space-y-2">
                      <Label>Tipo de Receta *</Label>
                      <RadioGroup
                        value={formData.subTipo}
                        onValueChange={(value) => setFormData({ ...formData, subTipo: value, cantidad: 1 })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="normal" />
                          <Label htmlFor="normal">Normal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="antimicrobiano" id="antimicrobiano" />
                          <Label htmlFor="antimicrobiano">Antimicrobiano</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="estupefaciente" id="estupefaciente" />
                          <Label htmlFor="estupefaciente">Estupefaciente</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="psicotropico" id="psicotropico" />
                          <Label htmlFor="psicotropico">Psicotrópico</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {(formData.tipo === "despacho" || (formData.tipo === "receta" && formData.subTipo)) && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cantidad">
                          Cantidad de Talonarios * (Máximo: {obtenerLimiteCantidad()})
                        </Label>
                        <Input
                          id="cantidad"
                          type="number"
                          min="1"
                          max={obtenerLimiteCantidad()}
                          value={formData.cantidad}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            cantidad: Math.min(parseInt(e.target.value) || 1, obtenerLimiteCantidad()) 
                          })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Límite regulado por tipo de receta según normativa vigente
                        </p>
                      </div>

                      {formData.cantidad > obtenerLimiteCantidad() && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Cantidad Excedida</AlertTitle>
                          <AlertDescription>
                            La cantidad solicitada supera el límite permitido de {obtenerLimiteCantidad()} talonarios
                          </AlertDescription>
                        </Alert>
                      )}

                      <Separator />

                      {/* Resumen de precio */}
                      <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Precio unitario:</span>
                          <span className="font-medium">₡{(calcularPrecioTotal() / formData.cantidad).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Cantidad:</span>
                          <span className="font-medium">×{formData.cantidad}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between text-lg">
                          <span className="font-semibold">Total a pagar:</span>
                          <span className="font-bold text-primary">₡{calcularPrecioTotal().toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={reiniciarFormulario}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setShowNewDialog(false);
                setShowPaymentDialog(true);
              }}
              disabled={
                !professionalValidated ||
                formData.estadoProfesional !== "activo" ||
                !formData.tipo ||
                (formData.tipo === "receta" && !formData.subTipo) ||
                formData.cantidad < 1 ||
                formData.cantidad > obtenerLimiteCantidad()
              }
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Continuar al Pago
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Método de Pago */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Método de Pago</DialogTitle>
            <DialogDescription>
              Seleccione su método de pago preferido para completar la transacción
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Resumen de compra */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h4 className="font-medium">Resumen de Compra</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Tipo:</span>
                  <span>{formData.tipo === "receta" ? `Receta - ${formData.subTipo}` : "Despacho"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cantidad:</span>
                  <span>{formData.cantidad} talonarios</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₡{calcularPrecioTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="space-y-4">
              <Label>Seleccione Método de Pago *</Label>
              <RadioGroup
                value={formData.metodoPago}
                onValueChange={(value) => setFormData({ ...formData, metodoPago: value })}
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="tarjeta" id="tarjeta" />
                  <Label htmlFor="tarjeta" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Tarjeta de Crédito/Débito</span>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="sinpe" id="sinpe" />
                  <Label htmlFor="sinpe" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      <span>SINPE Móvil</span>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value="transferencia" id="transferencia" />
                  <Label htmlFor="transferencia" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>Transferencia Bancaria</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Formulario de tarjeta */}
            {formData.metodoPago === "tarjeta" && (
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium">Datos de la Tarjeta</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="numeroTarjeta">Número de Tarjeta *</Label>
                    <Input
                      id="numeroTarjeta"
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                      value={formData.numeroTarjeta}
                      onChange={(e) => setFormData({ ...formData, numeroTarjeta: e.target.value.replace(/\s/g, "") })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nombreTitular">Nombre del Titular *</Label>
                    <Input
                      id="nombreTitular"
                      placeholder="Como aparece en la tarjeta"
                      value={formData.nombreTitular}
                      onChange={(e) => setFormData({ ...formData, nombreTitular: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fechaExpiracion">Fecha de Expiración *</Label>
                      <Input
                        id="fechaExpiracion"
                        placeholder="MM/AA"
                        maxLength={5}
                        value={formData.fechaExpiracion}
                        onChange={(e) => setFormData({ ...formData, fechaExpiracion: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SINPE Móvil */}
            {formData.metodoPago === "sinpe" && (
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium">SINPE Móvil</h4>
                <div className="space-y-2">
                  <Label htmlFor="sinpeMovil">Número de Teléfono *</Label>
                  <Input
                    id="sinpeMovil"
                    placeholder="8888-8888"
                    value={formData.sinpeMovil}
                    onChange={(e) => setFormData({ ...formData, sinpeMovil: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Transferencia */}
            {formData.metodoPago === "transferencia" && (
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium">Transferencia Bancaria</h4>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Información Bancaria</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><strong>Banco:</strong> Banco Nacional de Costa Rica</p>
                      <p><strong>Cuenta:</strong> CR12 0151 0000 1234 5678 90</p>
                      <p><strong>Titular:</strong> Colegio de Médicos y Cirujanos</p>
                      <p><strong>Monto:</strong> ₡{calcularPrecioTotal().toLocaleString()}</p>
                    </div>
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Label htmlFor="numeroTransferencia">Número de Confirmación *</Label>
                  <Input
                    id="numeroTransferencia"
                    placeholder="Ingrese el número de confirmación"
                    value={formData.numeroTransferencia}
                    onChange={(e) => setFormData({ ...formData, numeroTransferencia: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPaymentDialog(false);
                setShowNewDialog(true);
              }}
            >
              Atrás
            </Button>
            <Button onClick={procesarPago} disabled={processingPayment}>
              {processingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Pagar ₡{calcularPrecioTotal().toLocaleString()}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Factura */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Factura Electrónica</DialogTitle>
            <DialogDescription>
              Compra completada exitosamente. Puede descargar su factura en formato PDF.
            </DialogDescription>
          </DialogHeader>

          {currentOrder && (
            <div className="space-y-6 py-4">
              {/* Encabezado de factura */}
              <div className="text-center space-y-2 pb-4 border-b">
                <h3 className="text-2xl font-bold">ePrescription</h3>
                <p className="text-sm text-muted-foreground">Sistema de Recetas Electrónicas</p>
                <p className="text-sm text-muted-foreground">Cédula Jurídica: 3-101-123456</p>
                <p className="text-sm text-muted-foreground">Tel: 2222-3333 | Email: facturas@eprescription.cr</p>
              </div>

              {/* Datos de la factura */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold">Datos del Profesional</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Nombre:</strong> {currentOrder.profesional.nombre}</p>
                    <p><strong>Código:</strong> {currentOrder.profesional.codigo}</p>
                    <p><strong>Colegio:</strong> {currentOrder.profesional.colegio}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Datos de la Compra</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Factura N°:</strong> {currentOrder.numeroFactura}</p>
                    <p><strong>Orden N°:</strong> {currentOrder.numeroOrden}</p>
                    <p><strong>Fecha:</strong> {new Date(currentOrder.fecha).toLocaleString()}</p>
                    <p><strong>Método de Pago:</strong> {currentOrder.metodoPago}</p>
                  </div>
                </div>
              </div>

              {/* Detalle de productos */}
              <div className="space-y-2">
                <h4 className="font-semibold">Detalle de Productos</h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descripción</TableHead>
                        <TableHead className="text-right">Cantidad</TableHead>
                        <TableHead className="text-right">Precio Unit.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          Talonario {currentOrder.tipo === "receta" ? `Receta - ${currentOrder.subTipo}` : "Despacho"}
                        </TableCell>
                        <TableCell className="text-right">{currentOrder.cantidad}</TableCell>
                        <TableCell className="text-right">₡{currentOrder.precioUnitario.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">₡{currentOrder.total.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Totales */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₡{currentOrder.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>IVA (13%):</span>
                  <span>₡{(currentOrder.total * 0.13).toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₡{(currentOrder.total * 1.13).toLocaleString()}</span>
                </div>
              </div>

              {/* Información adicional */}
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Compra Confirmada</AlertTitle>
                <AlertDescription>
                  Los talonarios estarán disponibles en su cuenta en un plazo máximo de 24 horas hábiles.
                  Recibirá una notificación por correo electrónico cuando estén listos para usar.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowInvoiceDialog(false);
              reiniciarFormulario();
            }}>
              Cerrar
            </Button>
            <Button onClick={() => toast.success("Factura descargada en formato PDF")}>
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Historial */}
      <Dialog open={showHistorialDialog} onOpenChange={setShowHistorialDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Historial de Compras</DialogTitle>
            <DialogDescription>
              Registro completo de todas sus compras de talonarios
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>N° Orden</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Método Pago</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Factura</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comprasHistorialData.map((compra) => (
                    <TableRow key={compra.id}>
                      <TableCell>{new Date(compra.fecha).toLocaleString()}</TableCell>
                      <TableCell>{compra.numeroOrden}</TableCell>
                      <TableCell>{renderTipoBadge(compra.tipo, compra.subTipo)}</TableCell>
                      <TableCell>{compra.cantidad}</TableCell>
                      <TableCell>₡{compra.total.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{compra.metodoPago}</TableCell>
                      <TableCell>
                        <Badge className={
                          compra.estado === "completado" ? "bg-green-100 text-green-800" :
                          compra.estado === "pendiente" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }>
                          {compra.estado.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedInvoice(compra);
                            setCurrentOrder(compra);
                            setShowHistorialDialog(false);
                            setShowInvoiceDialog(true);
                          }}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowHistorialDialog(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ListadoTalonariosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<string>("todos");
  const [selectedEstado, setSelectedEstado] = useState<string>("todos");
  const [selectedProfesional, setSelectedProfesional] = useState<string>("todos");
  const [showUppercase, setShowUppercase] = useState(false);

  // Filtrado
  const filteredTalonarios = talonariosGeneralData.filter((item) => {
    const normalizedSearch = normalizeSearchText(searchTerm);
    
    const matchesSearch =
      normalizedSearch === "" ||
      normalizeSearchText(item.id).includes(normalizedSearch) ||
      normalizeSearchText(item.codigoInicio).includes(normalizedSearch) ||
      normalizeSearchText(item.codigoFin).includes(normalizedSearch) ||
      normalizeSearchText(item.numeroFactura).includes(normalizedSearch) ||
      normalizeSearchText(item.profesional.nombre).includes(normalizedSearch) ||
      normalizeSearchText(item.profesional.codigo).includes(normalizedSearch) ||
      normalizeSearchText(item.tipo).includes(normalizedSearch) ||
      (item.subTipo && normalizeSearchText(item.subTipo).includes(normalizedSearch));

    // Filtro de tipo mejorado para incluir subtipos
    let matchesTipo = true;
    if (selectedTipo !== "todos") {
      if (selectedTipo === "receta" || selectedTipo === "despacho") {
        matchesTipo = item.tipo === selectedTipo;
      } else if (selectedTipo === "antimicrobiano" || selectedTipo === "estupefaciente" || 
                 selectedTipo === "psicotropico" || selectedTipo === "normal") {
        matchesTipo = item.subTipo === selectedTipo;
      }
    }
    
    const matchesEstado = selectedEstado === "todos" || item.estado === selectedEstado;
    const matchesProfesional = selectedProfesional === "todos" || item.profesional.codigo === selectedProfesional;

    return matchesSearch && matchesTipo && matchesEstado && matchesProfesional;
  });

  // Paginación
  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData,
    goToPage,
    changePageSize,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(filteredTalonarios, 10);

  // Obtener lista única de profesionales
  const profesionales = Array.from(new Set(talonariosGeneralData.map(t => t.profesional.codigo)))
    .map(codigo => {
      const tal = talonariosGeneralData.find(t => t.profesional.codigo === codigo);
      return { codigo, nombre: tal?.profesional.nombre || "" };
    });

  // Renderizar badge de estado
  const renderEstadoBadge = (estado: string) => {
    const variants = {
      activo: "bg-green-100 text-green-800",
      agotado: "bg-red-100 text-red-800",
      vencido: "bg-gray-100 text-gray-800"
    };
    return (
      <Badge className={variants[estado as keyof typeof variants]}>
        {estado.toUpperCase()}
      </Badge>
    );
  };

  // Renderizar badge de tipo
  const renderTipoBadge = (tipo: string, subTipo?: string) => {
    if (tipo === "receta") {
      const colors = {
        antimicrobiano: "bg-blue-100 text-blue-800",
        estupefaciente: "bg-purple-100 text-purple-800",
        psicotropico: "bg-pink-100 text-pink-800",
        normal: "bg-gray-100 text-gray-800"
      };
      return (
        <Badge className={subTipo ? colors[subTipo as keyof typeof colors] : "bg-gray-100 text-gray-800"}>
          {subTipo ? subTipo.toUpperCase() : "RECETA"}
        </Badge>
      );
    }
    return (
      <Badge className="bg-teal-100 text-teal-800">
        DESPACHO
      </Badge>
    );
  };

  const transformText = (text: string) => showUppercase ? text.toUpperCase() : text;

  // Calcular estadísticas globales
  const totalTalonarios = talonariosGeneralData.length;
  const totalActivos = talonariosGeneralData.filter(t => t.estado === "activo").length;
  const totalDisponibles = talonariosGeneralData.reduce((sum, t) => sum + t.disponibles, 0);
  const totalUsados = talonariosGeneralData.reduce((sum, t) => sum + t.usados, 0);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <PageBanner
        icon={Receipt}
        title="Listado General de Talonarios"
        description="Vista administrativa de todos los talonarios del sistema con información de profesionales asignados"
      />

      {/* Estadísticas globales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Talonarios</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTalonarios}</div>
            <p className="text-xs text-muted-foreground">En el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Activos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActivos}</div>
            <p className="text-xs text-muted-foreground">En uso actualmente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Disponibles</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDisponibles}</div>
            <p className="text-xs text-muted-foreground">Sin usar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Utilizados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsados}</div>
            <p className="text-xs text-muted-foreground">Total emitidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla principal */}
      <Card>
        <CardHeader>
          <CardTitle>Listado Completo de Talonarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Búsqueda y filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por ID, código, profesional, factura..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedProfesional} onValueChange={setSelectedProfesional}>
                <SelectTrigger>
                  <SelectValue placeholder="Profesional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los profesionales</SelectItem>
                  {profesionales.map(prof => (
                    <SelectItem key={prof.codigo} value={prof.codigo}>
                      {prof.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="receta">Receta (Todos)</SelectItem>
                  <SelectItem value="normal">Receta Normal</SelectItem>
                  <SelectItem value="antimicrobiano">Receta Antimicrobiano</SelectItem>
                  <SelectItem value="estupefaciente">Receta Estupefaciente</SelectItem>
                  <SelectItem value="psicotropico">Receta Psicotrópico</SelectItem>
                  <SelectItem value="despacho">Despacho</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="agotado">Agotado</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Exportación */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Mostrando {paginatedData.length} de {filteredTalonarios.length} talonario(s)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowUppercase(!showUppercase)}
                  size="sm"
                >
                  {showUppercase ? "Normal" : "MAYÚSCULAS"}
                </Button>
                <ExportButtons
                  data={filteredTalonarios}
                  filename="listado-talonarios"
                  pdfTitle="Listado General de Talonarios"
                />
              </div>
            </div>

            {/* Tabla */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Profesional</TableHead>
                    <TableHead>Especialidad</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Código Inicio</TableHead>
                    <TableHead>Código Fin</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Disponibles</TableHead>
                    <TableHead>Usados</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>F. Vencimiento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{transformText(item.id)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{transformText(item.profesional.nombre)}</span>
                            <span className="text-xs text-muted-foreground">{transformText(item.profesional.codigo)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{transformText(item.profesional.especialidad)}</TableCell>
                        <TableCell>{renderTipoBadge(item.tipo, item.subTipo)}</TableCell>
                        <TableCell>{transformText(item.codigoInicio)}</TableCell>
                        <TableCell>{transformText(item.codigoFin)}</TableCell>
                        <TableCell>{item.cantidad}</TableCell>
                        <TableCell>
                          <span className="text-green-600 font-medium">{item.disponibles}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">{item.usados}</span>
                        </TableCell>
                        <TableCell>{renderEstadoBadge(item.estado)}</TableCell>
                        <TableCell>{new Date(item.fechaVencimiento).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No se encontraron talonarios</p>
                      </TableCell>
                    </TableRow>
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
              onPageSizeChange={changePageSize}
              onFirstPage={goToFirstPage}
              onLastPage={goToLastPage}
              onNextPage={goToNextPage}
              onPreviousPage={goToPreviousPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
