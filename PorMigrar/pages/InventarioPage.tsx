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
import { normalizedIncludes } from "../utils/searchUtils";
import { toast } from "sonner@2.0.3";
import { NewInventoryOrderDialog } from "../components/NewInventoryOrderDialog";
import {
  Package,
  AlertCircle,
  Settings,
  Calendar,
  Search,
  Filter,
  FilterX,
  Plus,
  Minus,
  Edit,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Pill,
  BoxIcon,
  ArrowUpCircle,
  ArrowDownCircle,
  RotateCcw,
  Eye,
  Download,
  Archive,
  XCircle,
  PackageCheck,
  FileText,
  Building2,
  User,
  Save,
  Info,
  Shield
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// Datos mock de inventario
const mockInventoryItems = [
  {
    id: "INV-001",
    medicineId: "MED-1001",
    medicineName: "Paracetamol 500mg",
    presentation: "Tabletas",
    category: "Analgésicos",
    currentStock: 1250,
    minStock: 500,
    maxStock: 3000,
    reorderPoint: 750,
    unitCost: 0.15,
    totalValue: 187.5,
    location: "A-01-03",
    supplier: "Farmacéutica Nacional S.A.",
    lastRestockDate: "2024-09-15",
    lastMovementDate: "2024-09-28",
    status: "adequate",
    activeSubstance: "Paracetamol",
    averageConsumption: 150,
    daysOfStock: 8.3,
    batches: 3,
    nearestExpiry: "2025-03-15"
  },
  {
    id: "INV-002",
    medicineId: "MED-1002",
    medicineName: "Amoxicilina 500mg",
    presentation: "Cápsulas",
    category: "Antibióticos",
    currentStock: 320,
    minStock: 400,
    maxStock: 2000,
    reorderPoint: 600,
    unitCost: 0.45,
    totalValue: 144,
    location: "A-02-01",
    supplier: "Laboratorios Andinos",
    lastRestockDate: "2024-09-10",
    lastMovementDate: "2024-09-30",
    status: "low",
    activeSubstance: "Amoxicilina",
    averageConsumption: 80,
    daysOfStock: 4,
    batches: 2,
    nearestExpiry: "2025-06-20"
  },
  {
    id: "INV-003",
    medicineId: "MED-1003",
    medicineName: "Omeprazol 20mg",
    presentation: "Cápsulas",
    category: "Antiulcerosos",
    currentStock: 0,
    minStock: 300,
    maxStock: 1500,
    reorderPoint: 450,
    unitCost: 0.25,
    totalValue: 0,
    location: "A-03-02",
    supplier: "Distribuidora MedPharma",
    lastRestockDate: "2024-08-20",
    lastMovementDate: "2024-09-29",
    status: "out",
    activeSubstance: "Omeprazol",
    averageConsumption: 60,
    daysOfStock: 0,
    batches: 0,
    nearestExpiry: "-"
  },
  {
    id: "INV-004",
    medicineId: "MED-1004",
    medicineName: "Ibuprofeno 400mg",
    presentation: "Tabletas",
    category: "Antiinflamatorios",
    currentStock: 2800,
    minStock: 600,
    maxStock: 3500,
    reorderPoint: 900,
    unitCost: 0.18,
    totalValue: 504,
    location: "A-01-05",
    supplier: "Farmacéutica Nacional S.A.",
    lastRestockDate: "2024-09-25",
    lastMovementDate: "2024-09-30",
    status: "adequate",
    activeSubstance: "Ibuprofeno",
    averageConsumption: 120,
    daysOfStock: 23.3,
    batches: 4,
    nearestExpiry: "2025-08-10"
  },
  {
    id: "INV-005",
    medicineId: "MED-1005",
    medicineName: "Losartán 50mg",
    presentation: "Tabletas",
    category: "Antihipertensivos",
    currentStock: 580,
    minStock: 500,
    maxStock: 2500,
    reorderPoint: 750,
    unitCost: 0.32,
    totalValue: 185.6,
    location: "B-01-02",
    supplier: "Laboratorios Andinos",
    lastRestockDate: "2024-09-18",
    lastMovementDate: "2024-09-30",
    status: "adequate",
    activeSubstance: "Losartán potásico",
    averageConsumption: 90,
    daysOfStock: 6.4,
    batches: 2,
    nearestExpiry: "2025-04-25"
  },
  {
    id: "INV-006",
    medicineId: "MED-1006",
    medicineName: "Metformina 850mg",
    presentation: "Tabletas",
    category: "Antidiabéticos",
    currentStock: 250,
    minStock: 800,
    maxStock: 4000,
    reorderPoint: 1200,
    unitCost: 0.22,
    totalValue: 55,
    location: "B-02-01",
    supplier: "Distribuidora MedPharma",
    lastRestockDate: "2024-08-15",
    lastMovementDate: "2024-09-30",
    status: "critical",
    activeSubstance: "Metformina HCl",
    averageConsumption: 180,
    daysOfStock: 1.4,
    batches: 1,
    nearestExpiry: "2024-12-30"
  },
  {
    id: "INV-007",
    medicineId: "MED-1007",
    medicineName: "Atorvastatina 20mg",
    presentation: "Tabletas",
    category: "Hipolipemiantes",
    currentStock: 1450,
    minStock: 400,
    maxStock: 2000,
    reorderPoint: 600,
    unitCost: 0.38,
    totalValue: 551,
    location: "B-01-04",
    supplier: "Laboratorios Andinos",
    lastRestockDate: "2024-09-22",
    lastMovementDate: "2024-09-29",
    status: "adequate",
    activeSubstance: "Atorvastatina cálcica",
    averageConsumption: 70,
    daysOfStock: 20.7,
    batches: 3,
    nearestExpiry: "2025-07-18"
  },
  {
    id: "INV-008",
    medicineId: "MED-1008",
    medicineName: "Levotiroxina 100mcg",
    presentation: "Tabletas",
    category: "Hormonas tiroideas",
    currentStock: 3200,
    minStock: 300,
    maxStock: 3500,
    reorderPoint: 450,
    unitCost: 0.28,
    totalValue: 896,
    location: "C-01-01",
    supplier: "Farmacéutica Nacional S.A.",
    lastRestockDate: "2024-09-20",
    lastMovementDate: "2024-09-30",
    status: "overstocked",
    activeSubstance: "Levotiroxina sódica",
    averageConsumption: 50,
    daysOfStock: 64,
    batches: 5,
    nearestExpiry: "2025-11-05"
  }
];

// Datos mock de alertas de stock
const mockStockAlerts = [
  {
    id: "ALERT-001",
    medicineId: "MED-1003",
    medicineName: "Omeprazol 20mg",
    presentation: "Cápsulas",
    currentStock: 0,
    minStock: 300,
    status: "out",
    priority: "critical",
    daysWithoutStock: 2,
    affectedPrescriptions: 8,
    estimatedDemand: 60,
    suggestedOrder: 900,
    lastRestockDate: "2024-08-20",
    supplier: "Distribuidora MedPharma",
    location: "A-03-02",
    category: "Antiulcerosos"
  },
  {
    id: "ALERT-002",
    medicineId: "MED-1006",
    medicineName: "Metformina 850mg",
    presentation: "Tabletas",
    currentStock: 250,
    minStock: 800,
    status: "critical",
    priority: "high",
    daysWithoutStock: 0,
    affectedPrescriptions: 0,
    estimatedDemand: 180,
    suggestedOrder: 2000,
    lastRestockDate: "2024-08-15",
    supplier: "Distribuidora MedPharma",
    location: "B-02-01",
    category: "Antidiabéticos"
  },
  {
    id: "ALERT-003",
    medicineId: "MED-1002",
    medicineName: "Amoxicilina 500mg",
    presentation: "Cápsulas",
    currentStock: 320,
    minStock: 400,
    status: "low",
    priority: "medium",
    daysWithoutStock: 0,
    affectedPrescriptions: 0,
    estimatedDemand: 80,
    suggestedOrder: 1000,
    lastRestockDate: "2024-09-10",
    supplier: "Laboratorios Andinos",
    location: "A-02-01",
    category: "Antibióticos"
  }
];

// Datos mock de ajustes de stock
const mockStockAdjustments = [
  {
    id: "ADJ-001",
    date: "2024-09-30",
    time: "14:30",
    type: "entry",
    medicineId: "MED-1001",
    medicineName: "Paracetamol 500mg",
    presentation: "Tabletas",
    quantity: 500,
    reason: "Compra regular",
    previousStock: 750,
    newStock: 1250,
    unitCost: 0.15,
    totalValue: 75,
    responsible: "Ana García",
    documentNumber: "FC-2024-0589",
    supplier: "Farmacéutica Nacional S.A.",
    batch: "LOT-2024-089",
    expiryDate: "2025-03-15",
    notes: "Entrega completa según orden de compra OC-589",
    status: "approved"
  },
  {
    id: "ADJ-002",
    date: "2024-09-29",
    time: "16:45",
    type: "exit",
    medicineId: "MED-1003",
    medicineName: "Omeprazol 20mg",
    presentation: "Cápsulas",
    quantity: 150,
    reason: "Dispensación farmacia",
    previousStock: 150,
    newStock: 0,
    unitCost: 0.25,
    totalValue: 37.5,
    responsible: "Carlos Méndez",
    documentNumber: "DISP-2024-1234",
    supplier: "-",
    batch: "LOT-2023-456",
    expiryDate: "2025-06-20",
    notes: "Stock agotado - generar orden de compra urgente",
    status: "approved"
  },
  {
    id: "ADJ-003",
    date: "2024-09-28",
    time: "10:15",
    type: "adjustment",
    medicineId: "MED-1004",
    medicineName: "Ibuprofeno 400mg",
    presentation: "Tabletas",
    quantity: -50,
    reason: "Vencimiento",
    previousStock: 2850,
    newStock: 2800,
    unitCost: 0.18,
    totalValue: -9,
    responsible: "Ana García",
    documentNumber: "AJ-2024-045",
    supplier: "-",
    batch: "LOT-2022-789",
    expiryDate: "2024-09-25",
    notes: "Producto vencido - destrucción según protocolo sanitario",
    status: "approved"
  },
  {
    id: "ADJ-004",
    date: "2024-09-27",
    time: "11:00",
    type: "entry",
    medicineId: "MED-1007",
    medicineName: "Atorvastatina 20mg",
    presentation: "Tabletas",
    quantity: 1000,
    reason: "Compra urgente",
    previousStock: 450,
    newStock: 1450,
    unitCost: 0.38,
    totalValue: 380,
    responsible: "Luis Fernández",
    documentNumber: "FC-2024-0601",
    supplier: "Laboratorios Andinos",
    batch: "LOT-2024-112",
    expiryDate: "2025-07-18",
    notes: "Orden urgente por stock bajo",
    status: "approved"
  },
  {
    id: "ADJ-005",
    date: "2024-09-26",
    time: "09:30",
    type: "adjustment",
    medicineId: "MED-1002",
    medicineName: "Amoxicilina 500mg",
    presentation: "Cápsulas",
    quantity: -30,
    reason: "Devolución proveedor",
    previousStock: 350,
    newStock: 320,
    unitCost: 0.45,
    totalValue: -13.5,
    responsible: "Ana García",
    documentNumber: "DEV-2024-023",
    supplier: "Laboratorios Andinos",
    batch: "LOT-2024-067",
    expiryDate: "2025-06-20",
    notes: "Producto con defecto de fabricación - reembolso gestionado",
    status: "approved"
  }
];

// Datos mock de lotes
const mockBatches = [
  {
    id: "BATCH-001",
    batchNumber: "LOT-2024-089",
    medicineId: "MED-1001",
    medicineName: "Paracetamol 500mg",
    presentation: "Tabletas",
    supplier: "Farmacéutica Nacional S.A.",
    manufacturingDate: "2024-03-15",
    expiryDate: "2025-03-15",
    quantity: 500,
    remainingQuantity: 450,
    location: "A-01-03",
    status: "active",
    daysToExpiry: 166,
    unitCost: 0.15,
    totalValue: 67.5,
    entryDate: "2024-09-30",
    documentNumber: "FC-2024-0589"
  },
  {
    id: "BATCH-002",
    batchNumber: "LOT-2023-456",
    medicineId: "MED-1002",
    medicineName: "Amoxicilina 500mg",
    presentation: "Cápsulas",
    supplier: "Laboratorios Andinos",
    manufacturingDate: "2023-12-20",
    expiryDate: "2025-06-20",
    quantity: 500,
    remainingQuantity: 320,
    location: "A-02-01",
    status: "active",
    daysToExpiry: 263,
    unitCost: 0.45,
    totalValue: 144,
    entryDate: "2024-09-10",
    documentNumber: "FC-2024-0512"
  },
  {
    id: "BATCH-003",
    batchNumber: "LOT-2024-034",
    medicineId: "MED-1005",
    medicineName: "Losartán 50mg",
    presentation: "Tabletas",
    supplier: "Laboratorios Andinos",
    manufacturingDate: "2024-01-25",
    expiryDate: "2025-04-25",
    quantity: 600,
    remainingQuantity: 580,
    location: "B-01-02",
    status: "active",
    daysToExpiry: 207,
    unitCost: 0.32,
    totalValue: 185.6,
    entryDate: "2024-09-18",
    documentNumber: "FC-2024-0575"
  },
  {
    id: "BATCH-004",
    batchNumber: "LOT-2022-789",
    medicineId: "MED-1004",
    medicineName: "Ibuprofeno 400mg",
    presentation: "Tabletas",
    supplier: "Farmacéutica Nacional S.A.",
    manufacturingDate: "2022-09-25",
    expiryDate: "2024-09-25",
    quantity: 200,
    remainingQuantity: 0,
    location: "A-01-05",
    status: "expired",
    daysToExpiry: -6,
    unitCost: 0.18,
    totalValue: 0,
    entryDate: "2023-02-10",
    documentNumber: "FC-2023-0145"
  },
  {
    id: "BATCH-005",
    batchNumber: "LOT-2024-156",
    medicineId: "MED-1006",
    medicineName: "Metformina 850mg",
    presentation: "Tabletas",
    supplier: "Distribuidora MedPharma",
    manufacturingDate: "2023-12-30",
    expiryDate: "2024-12-30",
    quantity: 500,
    remainingQuantity: 250,
    location: "B-02-01",
    status: "near_expiry",
    daysToExpiry: 91,
    unitCost: 0.22,
    totalValue: 55,
    entryDate: "2024-08-15",
    documentNumber: "FC-2024-0456"
  },
  {
    id: "BATCH-006",
    batchNumber: "LOT-2024-112",
    medicineId: "MED-1007",
    medicineName: "Atorvastatina 20mg",
    presentation: "Tabletas",
    supplier: "Laboratorios Andinos",
    manufacturingDate: "2024-01-18",
    expiryDate: "2025-07-18",
    quantity: 1000,
    remainingQuantity: 1000,
    location: "B-01-04",
    status: "active",
    daysToExpiry: 291,
    unitCost: 0.38,
    totalValue: 380,
    entryDate: "2024-09-27",
    documentNumber: "FC-2024-0601"
  },
  {
    id: "BATCH-007",
    batchNumber: "LOT-2023-998",
    medicineId: "MED-1008",
    medicineName: "Levotiroxina 100mcg",
    presentation: "Tabletas",
    supplier: "Farmacéutica Nacional S.A.",
    manufacturingDate: "2023-11-05",
    expiryDate: "2025-11-05",
    quantity: 800,
    remainingQuantity: 750,
    location: "C-01-01",
    status: "active",
    daysToExpiry: 401,
    unitCost: 0.28,
    totalValue: 210,
    entryDate: "2024-09-20",
    documentNumber: "FC-2024-0580"
  },
  {
    id: "BATCH-008",
    batchNumber: "LOT-2024-201",
    medicineId: "MED-1004",
    medicineName: "Ibuprofeno 400mg",
    presentation: "Tabletas",
    supplier: "Farmacéutica Nacional S.A.",
    manufacturingDate: "2024-02-10",
    expiryDate: "2025-08-10",
    quantity: 1000,
    remainingQuantity: 850,
    location: "A-01-05",
    status: "active",
    daysToExpiry: 314,
    unitCost: 0.18,
    totalValue: 153,
    entryDate: "2024-09-25",
    documentNumber: "FC-2024-0595"
  }
];

// Componente: Stock de medicamentos
export function StockPage() {
  const [inventory, setInventory] = useState(mockInventoryItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<typeof mockInventoryItems[0] | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [isAddStockDialogOpen, setIsAddStockDialogOpen] = useState(false);
  const [isRemoveStockDialogOpen, setIsRemoveStockDialogOpen] = useState(false);

  // Filtrar inventario
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      normalizedIncludes(item.medicineName, searchTerm) ||
      normalizedIncludes(item.id, searchTerm) ||
      normalizedIncludes(item.activeSubstance, searchTerm) ||
      normalizedIncludes(item.location, searchTerm);
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Obtener categorías únicas
  const uniqueCategories = Array.from(new Set(mockInventoryItems.map(i => i.category)));

  // Estadísticas
  const stats = {
    total: inventory.length,
    adequate: inventory.filter(i => i.status === 'adequate').length,
    low: inventory.filter(i => i.status === 'low').length,
    critical: inventory.filter(i => i.status === 'critical').length,
    out: inventory.filter(i => i.status === 'out').length,
    overstocked: inventory.filter(i => i.status === 'overstocked').length,
    totalValue: inventory.reduce((sum, i) => sum + i.totalValue, 0)
  };

  const getStatusBadge = (status: string) => {
    const config = {
      adequate: { label: "Adecuado", className: "bg-green-100 text-green-700 border-green-300" },
      low: { label: "Stock bajo", className: "bg-yellow-100 text-yellow-700 border-yellow-300" },
      critical: { label: "Crítico", className: "bg-orange-100 text-orange-700 border-orange-300" },
      out: { label: "Agotado", className: "bg-red-100 text-red-700 border-red-300" },
      overstocked: { label: "Sobre stock", className: "bg-blue-100 text-blue-700 border-blue-300" }
    };
    return config[status as keyof typeof config] || config.adequate;
  };

  const handleDoubleClick = (item: typeof mockInventoryItems[0]) => {
    setSelectedItem(item);
    setIsDetailsPanelOpen(true);
  };

  const handleAddStock = () => {
    if (selectedItem) {
      setIsDetailsPanelOpen(false);
      setIsAddStockDialogOpen(true);
    }
  };

  const handleRemoveStock = () => {
    if (selectedItem) {
      setIsDetailsPanelOpen(false);
      setIsRemoveStockDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Stock de Medicamentos</h1>
              <p className="text-purple-100 text-sm">
                Control en tiempo real del inventario farmacéutico
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
                <p className="text-sm text-gray-600">Total productos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Adecuados</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.adequate}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock bajo</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.low}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Críticos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.critical}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Agotados</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.out}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor total</p>
                <p className="text-xl font-semibold text-gray-900">${stats.totalValue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
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
                placeholder="Buscar por nombre, ID, principio activo o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="adequate">Adecuado</SelectItem>
                  <SelectItem value="low">Stock bajo</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="out">Agotado</SelectItem>
                  <SelectItem value="overstocked">Sobre stock</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
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

      {/* Tabla de inventario */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inventario de Medicamentos</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {filteredInventory.length} producto{filteredInventory.length !== 1 ? 's' : ''} encontrado{filteredInventory.length !== 1 ? 's' : ''} • Doble clic para ver detalles
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInventory.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No se encontraron productos</h3>
              <p className="text-sm text-gray-600">
                No hay productos que coincidan con los filtros seleccionados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicamento</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead className="text-right">Stock actual</TableHead>
                    <TableHead className="text-right">Min/Max</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-right">Días stock</TableHead>
                    <TableHead className="text-right">Valor total</TableHead>
                    <TableHead>Último movimiento</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const statusBadge = getStatusBadge(item.status);
                    return (
                      <TableRow
                        key={item.id}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onDoubleClick={() => handleDoubleClick(item)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <Pill className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.medicineName}</p>
                              <p className="text-sm text-gray-600">{item.presentation} • {item.category}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <BoxIcon className="w-4 h-4 text-gray-400" />
                            <span className="font-mono text-sm">{item.location}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-gray-900">{item.currentStock}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col text-sm">
                            <span className="text-gray-600">Min: {item.minStock}</span>
                            <span className="text-gray-600">Max: {item.maxStock}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={statusBadge.className}>
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`font-semibold ${
                            item.daysOfStock < 3 ? 'text-red-600' :
                            item.daysOfStock < 7 ? 'text-orange-600' :
                            'text-green-600'
                          }`}>
                            {item.daysOfStock > 0 ? item.daysOfStock.toFixed(1) : '0'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-gray-900">
                            ${item.totalValue.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span className="text-gray-900">{item.lastMovementDate}</span>
                            <span className="text-gray-600 text-xs">{item.batches} lote{item.batches !== 1 ? 's' : ''}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
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

      {/* Panel de detalles */}
      {selectedItem && (
        <Dialog open={isDetailsPanelOpen} onOpenChange={setIsDetailsPanelOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Detalles del producto
              </DialogTitle>
              <DialogDescription>
                Información completa del inventario de {selectedItem.medicineName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Información básica */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">ID Producto</Label>
                  <p className="font-mono text-sm mt-1">{selectedItem.id}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Medicamento</Label>
                  <p className="font-medium mt-1">{selectedItem.medicineName}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Principio activo</Label>
                  <p className="mt-1">{selectedItem.activeSubstance}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Presentación</Label>
                  <p className="mt-1">{selectedItem.presentation}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Categoría</Label>
                  <p className="mt-1">{selectedItem.category}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Ubicación</Label>
                  <p className="font-mono mt-1">{selectedItem.location}</p>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Stock y valores */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Stock actual</Label>
                  <p className="text-2xl font-semibold mt-1 text-purple-600">{selectedItem.currentStock}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Stock mínimo</Label>
                  <p className="text-2xl font-semibold mt-1 text-orange-600">{selectedItem.minStock}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Stock máximo</Label>
                  <p className="text-2xl font-semibold mt-1 text-blue-600">{selectedItem.maxStock}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Costo unitario</Label>
                  <p className="font-semibold mt-1">${selectedItem.unitCost.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Valor total</Label>
                  <p className="font-semibold mt-1">${selectedItem.totalValue.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Días de stock</Label>
                  <p className={`font-semibold mt-1 ${
                    selectedItem.daysOfStock < 3 ? 'text-red-600' :
                    selectedItem.daysOfStock < 7 ? 'text-orange-600' :
                    'text-green-600'
                  }`}>
                    {selectedItem.daysOfStock > 0 ? selectedItem.daysOfStock.toFixed(1) : '0'} días
                  </p>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Proveedor y movimientos */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Proveedor</Label>
                  <p className="mt-1">{selectedItem.supplier}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Consumo promedio</Label>
                  <p className="mt-1">{selectedItem.averageConsumption} unidades/día</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Última reposición</Label>
                  <p className="mt-1">{selectedItem.lastRestockDate}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Último movimiento</Label>
                  <p className="mt-1">{selectedItem.lastMovementDate}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Lotes activos</Label>
                  <p className="mt-1">{selectedItem.batches} lote{selectedItem.batches !== 1 ? 's' : ''}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Vencimiento más próximo</Label>
                  <p className="mt-1">{selectedItem.nearestExpiry}</p>
                </div>
              </div>

              {/* Estado */}
              <div>
                <Label className="text-sm text-gray-600">Estado del inventario</Label>
                <div className="mt-2">
                  <Badge variant="outline" className={getStatusBadge(selectedItem.status).className}>
                    {getStatusBadge(selectedItem.status).label}
                  </Badge>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsDetailsPanelOpen(false)}>
                Cerrar
              </Button>
              <Button variant="outline" onClick={handleRemoveStock} className="text-red-600 border-red-300 hover:bg-red-50">
                <Minus className="w-4 h-4 mr-2" />
                Dar salida
              </Button>
              <Button onClick={handleAddStock}>
                <Plus className="w-4 h-4 mr-2" />
                Ingresar stock
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo de agregar stock */}
      <AddStockDialog
        open={isAddStockDialogOpen}
        onOpenChange={setIsAddStockDialogOpen}
        medicine={selectedItem}
        onSuccess={() => {
          setIsAddStockDialogOpen(false);
          setSelectedItem(null);
        }}
      />

      {/* Diálogo de dar salida */}
      <RemoveStockDialog
        open={isRemoveStockDialogOpen}
        onOpenChange={setIsRemoveStockDialogOpen}
        medicine={selectedItem}
        onSuccess={() => {
          setIsRemoveStockDialogOpen(false);
          setSelectedItem(null);
        }}
      />
    </div>
  );
}

// Componente: Alertas de stock bajo
export function AlertasStockPage() {
  const [alerts, setAlerts] = useState(mockStockAlerts);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState<typeof mockStockAlerts[0] | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [orderingAlert, setOrderingAlert] = useState<typeof mockStockAlerts[0] | null>(null);

  // Filtrar alertas
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = priorityFilter === "all" || alert.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  });

  // Estadísticas
  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.priority === 'critical').length,
    high: alerts.filter(a => a.priority === 'high').length,
    medium: alerts.filter(a => a.priority === 'medium').length,
    affectedPrescriptions: alerts.reduce((sum, a) => sum + a.affectedPrescriptions, 0)
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      critical: { label: "Crítica", className: "bg-red-100 text-red-700 border-red-300" },
      high: { label: "Alta", className: "bg-orange-100 text-orange-700 border-orange-300" },
      medium: { label: "Media", className: "bg-yellow-100 text-yellow-700 border-yellow-300" }
    };
    return config[priority as keyof typeof config] || config.medium;
  };

  const handleDoubleClick = (alert: typeof mockStockAlerts[0]) => {
    setSelectedAlert(alert);
    setIsDetailsPanelOpen(true);
  };

  const handleGenerateOrder = (alert: typeof mockStockAlerts[0]) => {
    setOrderingAlert(alert);
    setIsNewOrderDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-orange-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Alertas de Stock Bajo</h1>
              <p className="text-red-100 text-sm">
                Monitoreo de medicamentos con stock crítico o agotado
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total alertas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
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
                <XCircle className="w-6 h-6 text-red-600" />
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
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recetas afectadas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.affectedPrescriptions}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
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
                placeholder="Buscar por medicamento, ID o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm || priorityFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setPriorityFilter("all");
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
              <CardTitle>Alertas Activas</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {filteredAlerts.length} alerta{filteredAlerts.length !== 1 ? 's' : ''} activa{filteredAlerts.length !== 1 ? 's' : ''} • Doble clic para ver detalles
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No hay alertas activas</h3>
              <p className="text-sm text-gray-600">
                Todos los medicamentos tienen stock adecuado.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicamento</TableHead>
                    <TableHead className="text-center">Prioridad</TableHead>
                    <TableHead className="text-right">Stock actual</TableHead>
                    <TableHead className="text-right">Stock mínimo</TableHead>
                    <TableHead className="text-right">Demanda diaria</TableHead>
                    <TableHead className="text-right">Orden sugerida</TableHead>
                    <TableHead className="text-center">Recetas afectadas</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => {
                    const priorityBadge = getPriorityBadge(alert.priority);
                    return (
                      <TableRow
                        key={alert.id}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onDoubleClick={() => handleDoubleClick(alert)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              alert.status === 'out' ? 'bg-red-100' :
                              alert.status === 'critical' ? 'bg-orange-100' :
                              'bg-yellow-100'
                            }`}>
                              <AlertCircle className={`w-5 h-5 ${
                                alert.status === 'out' ? 'text-red-600' :
                                alert.status === 'critical' ? 'text-orange-600' :
                                'text-yellow-600'
                              }`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{alert.medicineName}</p>
                              <p className="text-sm text-gray-600">{alert.presentation} • {alert.category}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={priorityBadge.className}>
                            {priorityBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`font-semibold ${
                            alert.currentStock === 0 ? 'text-red-600' :
                            'text-orange-600'
                          }`}>
                            {alert.currentStock}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-gray-600">{alert.minStock}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-gray-900">{alert.estimatedDemand}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-blue-600">{alert.suggestedOrder}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {alert.affectedPrescriptions > 0 ? (
                            <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
                              {alert.affectedPrescriptions}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleGenerateOrder(alert)}
                          >
                            <PackageCheck className="w-4 h-4 mr-2" />
                            Ordenar
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
              <Info className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-red-900 mb-1">Gestión de alertas de stock</h4>
              <ul className="space-y-1 text-sm text-red-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Las alertas se generan automáticamente cuando el stock está por debajo del mínimo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Críticas: medicamentos agotados con recetas pendientes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Alta: stock por debajo del 50% del mínimo requerido</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de nueva orden de compra */}
      <NewInventoryOrderDialog
        open={isNewOrderDialogOpen}
        onOpenChange={setIsNewOrderDialogOpen}
        alert={orderingAlert}
        onOrderCreated={(order) => {
          console.log("Orden creada:", order);
          // Aquí se podría actualizar el estado o hacer una petición al backend
        }}
      />

      {/* Panel de detalles de alerta */}
      {selectedAlert && (
        <Dialog open={isDetailsPanelOpen} onOpenChange={setIsDetailsPanelOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Detalles de la alerta
              </DialogTitle>
              <DialogDescription>
                Información completa sobre la alerta de stock bajo
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Información del medicamento */}
              <div>
                <h4 className="font-medium mb-3">Medicamento</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Nombre</Label>
                    <p className="font-medium mt-1">{selectedAlert.medicineName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Presentación</Label>
                    <p className="mt-1">{selectedAlert.presentation}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Categoría</Label>
                    <p className="mt-1">{selectedAlert.category}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Ubicación</Label>
                    <p className="font-mono mt-1">{selectedAlert.location}</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Información de stock */}
              <div>
                <h4 className="font-medium mb-3">Estado del stock</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Stock actual</Label>
                    <p className="text-2xl font-semibold mt-1 text-red-600">{selectedAlert.currentStock}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Stock mínimo</Label>
                    <p className="text-2xl font-semibold mt-1 text-gray-600">{selectedAlert.minStock}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Déficit</Label>
                    <p className="text-2xl font-semibold mt-1 text-orange-600">
                      {selectedAlert.minStock - selectedAlert.currentStock}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Análisis y recomendaciones */}
              <div>
                <h4 className="font-medium mb-3">Análisis y recomendaciones</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Demanda estimada diaria</Label>
                    <p className="font-semibold mt-1">{selectedAlert.estimatedDemand} unidades</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Orden sugerida</Label>
                    <p className="font-semibold mt-1 text-blue-600">{selectedAlert.suggestedOrder} unidades</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Prioridad</Label>
                    <div className="mt-2">
                      <Badge variant="outline" className={getPriorityBadge(selectedAlert.priority).className}>
                        {getPriorityBadge(selectedAlert.priority).label}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Recetas afectadas</Label>
                    <p className="font-semibold mt-1 text-red-600">
                      {selectedAlert.affectedPrescriptions} {selectedAlert.affectedPrescriptions === 1 ? 'receta' : 'recetas'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Información del proveedor */}
              <div>
                <h4 className="font-medium mb-3">Proveedor</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Nombre</Label>
                    <p className="mt-1">{selectedAlert.supplier}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Última reposición</Label>
                    <p className="mt-1">{selectedAlert.lastRestockDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsPanelOpen(false)}>
                Cerrar
              </Button>
              <Button onClick={() => {
                handleGenerateOrder(selectedAlert);
                setIsDetailsPanelOpen(false);
              }}>
                <PackageCheck className="w-4 h-4 mr-2" />
                Generar orden de compra
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Componente: Ajustes de stock
export function AjustesStockPage() {
  const [adjustments, setAdjustments] = useState(mockStockAdjustments);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedAdjustment, setSelectedAdjustment] = useState<typeof mockStockAdjustments[0] | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [isNewAdjustmentDialogOpen, setIsNewAdjustmentDialogOpen] = useState(false);

  // Filtrar ajustes
  const filteredAdjustments = adjustments.filter(adj => {
    const matchesSearch = 
      adj.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adj.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adj.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adj.responsible.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || adj.type === typeFilter;
    
    let matchesDate = true;
    if (dateFilter === "today") {
      matchesDate = adj.date === "2024-09-30";
    } else if (dateFilter === "week") {
      // Simplificado para el ejemplo
      matchesDate = true;
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  // Estadísticas
  const stats = {
    total: adjustments.length,
    entries: adjustments.filter(a => a.type === 'entry').length,
    exits: adjustments.filter(a => a.type === 'exit').length,
    adjustments: adjustments.filter(a => a.type === 'adjustment').length,
    totalValue: adjustments.reduce((sum, a) => sum + a.totalValue, 0)
  };

  const getTypeBadge = (type: string) => {
    const config = {
      entry: { label: "Entrada", icon: ArrowUpCircle, className: "bg-green-100 text-green-700 border-green-300" },
      exit: { label: "Salida", icon: ArrowDownCircle, className: "bg-blue-100 text-blue-700 border-blue-300" },
      adjustment: { label: "Ajuste", icon: RotateCcw, className: "bg-orange-100 text-orange-700 border-orange-300" }
    };
    return config[type as keyof typeof config] || config.adjustment;
  };

  const handleDoubleClick = (adjustment: typeof mockStockAdjustments[0]) => {
    setSelectedAdjustment(adjustment);
    setIsDetailsPanelOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white">Ajustes de Stock</h1>
                <p className="text-orange-100 text-sm">
                  Registro y trazabilidad de movimientos de inventario
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <Button
                onClick={() => setIsNewAdjustmentDialogOpen(true)}
                className="bg-white text-orange-600 hover:bg-orange-50 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nuevo ajuste
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total movimientos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entradas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.entries}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ArrowUpCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Salidas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.exits}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ArrowDownCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ajustes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.adjustments}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <RotateCcw className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor total</p>
                <p className="text-xl font-semibold text-gray-900">${Math.abs(stats.totalValue).toFixed(2)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botón móvil */}
      <div className="block md:hidden">
        <Button
          onClick={() => setIsNewAdjustmentDialogOpen(true)}
          className="w-full"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo ajuste
        </Button>
      </div>

      {/* Búsqueda y filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por medicamento, ID, documento o responsable..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="entry">Entradas</SelectItem>
                  <SelectItem value="exit">Salidas</SelectItem>
                  <SelectItem value="adjustment">Ajustes</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Fecha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm || typeFilter !== "all" || dateFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("all");
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

      {/* Tabla de ajustes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historial de Movimientos</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {filteredAdjustments.length} movimiento{filteredAdjustments.length !== 1 ? 's' : ''} encontrado{filteredAdjustments.length !== 1 ? 's' : ''} • Doble clic para ver detalles
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAdjustments.length === 0 ? (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No se encontraron movimientos</h3>
              <p className="text-sm text-gray-600">
                No hay movimientos que coincidan con los filtros seleccionados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha y hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Medicamento</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead className="text-right">Stock anterior</TableHead>
                    <TableHead className="text-right">Stock nuevo</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdjustments.map((adjustment) => {
                    const typeBadge = getTypeBadge(adjustment.type);
                    const TypeIcon = typeBadge.icon;
                    return (
                      <TableRow
                        key={adjustment.id}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onDoubleClick={() => handleDoubleClick(adjustment)}
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-gray-900">{adjustment.date}</span>
                            <span className="text-sm text-gray-600">{adjustment.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={typeBadge.className}>
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {typeBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{adjustment.medicineName}</p>
                            <p className="text-sm text-gray-600">{adjustment.presentation}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`font-semibold ${
                            adjustment.quantity > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {adjustment.quantity > 0 ? '+' : ''}{adjustment.quantity}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{adjustment.reason}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-gray-600">{adjustment.previousStock}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-gray-900">{adjustment.newStock}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{adjustment.responsible}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAdjustment(adjustment);
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

      {/* Panel de detalles */}
      {selectedAdjustment && (
        <Dialog open={isDetailsPanelOpen} onOpenChange={setIsDetailsPanelOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Detalles del movimiento
              </DialogTitle>
              <DialogDescription>
                Información completa del ajuste de inventario
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Información general */}
              <div>
                <h4 className="font-medium mb-3">Información general</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">ID de movimiento</Label>
                    <p className="font-mono text-sm mt-1">{selectedAdjustment.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Fecha</Label>
                    <p className="mt-1">{selectedAdjustment.date}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Hora</Label>
                    <p className="mt-1">{selectedAdjustment.time}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Tipo de movimiento</Label>
                    <div className="mt-2">
                      <Badge variant="outline" className={getTypeBadge(selectedAdjustment.type).className}>
                        {getTypeBadge(selectedAdjustment.type).label}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Documento</Label>
                    <p className="font-mono text-sm mt-1">{selectedAdjustment.documentNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Estado</Label>
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        {selectedAdjustment.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Información del medicamento */}
              <div>
                <h4 className="font-medium mb-3">Medicamento</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Nombre</Label>
                    <p className="font-medium mt-1">{selectedAdjustment.medicineName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Presentación</Label>
                    <p className="mt-1">{selectedAdjustment.presentation}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Lote</Label>
                    <p className="font-mono text-sm mt-1">{selectedAdjustment.batch}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Vencimiento</Label>
                    <p className="mt-1">{selectedAdjustment.expiryDate}</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Detalles del ajuste */}
              <div>
                <h4 className="font-medium mb-3">Detalles del ajuste</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Cantidad</Label>
                    <p className={`text-2xl font-semibold mt-1 ${
                      selectedAdjustment.quantity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedAdjustment.quantity > 0 ? '+' : ''}{selectedAdjustment.quantity}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Stock anterior</Label>
                    <p className="text-2xl font-semibold mt-1 text-gray-600">{selectedAdjustment.previousStock}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Stock nuevo</Label>
                    <p className="text-2xl font-semibold mt-1 text-purple-600">{selectedAdjustment.newStock}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label className="text-sm text-gray-600">Costo unitario</Label>
                    <p className="font-semibold mt-1">${selectedAdjustment.unitCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Valor total</Label>
                    <p className="font-semibold mt-1">${Math.abs(selectedAdjustment.totalValue).toFixed(2)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Motivo</Label>
                    <p className="mt-1">{selectedAdjustment.reason}</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Responsable y proveedor */}
              <div>
                <h4 className="font-medium mb-3">Responsable y proveedor</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Responsable del ajuste</Label>
                    <p className="mt-1">{selectedAdjustment.responsible}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Proveedor</Label>
                    <p className="mt-1">{selectedAdjustment.supplier || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {selectedAdjustment.notes && (
                <>
                  <div className="h-px bg-gray-200" />
                  <div>
                    <Label className="text-sm text-gray-600">Notas</Label>
                    <p className="mt-2 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {selectedAdjustment.notes}
                    </p>
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsPanelOpen(false)}>
                Cerrar
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Descargar PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo de nuevo ajuste */}
      <NewAdjustmentDialog
        open={isNewAdjustmentDialogOpen}
        onOpenChange={setIsNewAdjustmentDialogOpen}
      />
    </div>
  );
}

// Componente: Lotes y vencimientos
export function LotesPage() {
  const [batches, setBatches] = useState(mockBatches);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expiryFilter, setExpiryFilter] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState<typeof mockBatches[0] | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  // Filtrar lotes
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = 
      batch.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || batch.status === statusFilter;
    
    let matchesExpiry = true;
    if (expiryFilter === "expired") {
      matchesExpiry = batch.daysToExpiry < 0;
    } else if (expiryFilter === "near_expiry") {
      matchesExpiry = batch.daysToExpiry >= 0 && batch.daysToExpiry <= 90;
    } else if (expiryFilter === "active") {
      matchesExpiry = batch.daysToExpiry > 90;
    }
    
    return matchesSearch && matchesStatus && matchesExpiry;
  });

  // Estadísticas
  const stats = {
    total: batches.length,
    active: batches.filter(b => b.status === 'active').length,
    nearExpiry: batches.filter(b => b.status === 'near_expiry').length,
    expired: batches.filter(b => b.status === 'expired').length,
    totalValue: batches.filter(b => b.status !== 'expired').reduce((sum, b) => sum + b.totalValue, 0)
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: "Activo", className: "bg-green-100 text-green-700 border-green-300" },
      near_expiry: { label: "Próximo a vencer", className: "bg-yellow-100 text-yellow-700 border-yellow-300" },
      expired: { label: "Vencido", className: "bg-red-100 text-red-700 border-red-300" }
    };
    return config[status as keyof typeof config] || config.active;
  };

  const handleDoubleClick = (batch: typeof mockBatches[0]) => {
    setSelectedBatch(batch);
    setIsDetailsPanelOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Lotes y Vencimientos</h1>
              <p className="text-blue-100 text-sm">
                Control de lotes con trazabilidad y alertas de vencimiento
              </p>
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
                <p className="text-sm text-gray-600">Total lotes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Archive className="w-6 h-6 text-blue-600" />
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

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Por vencer</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.nearExpiry}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencidos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.expired}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor activo</p>
                <p className="text-xl font-semibold text-gray-900">${stats.totalValue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
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
                placeholder="Buscar por medicamento, lote o proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="near_expiry">Por vencer</SelectItem>
                  <SelectItem value="expired">Vencidos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={expiryFilter} onValueChange={setExpiryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Vencimiento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Más de 90 días</SelectItem>
                  <SelectItem value="near_expiry">Próximos 90 días</SelectItem>
                  <SelectItem value="expired">Vencidos</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm || statusFilter !== "all" || expiryFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setExpiryFilter("all");
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

      {/* Tabla de lotes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lotes Registrados</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {filteredBatches.length} lote{filteredBatches.length !== 1 ? 's' : ''} encontrado{filteredBatches.length !== 1 ? 's' : ''} • Doble clic para ver detalles
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBatches.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No se encontraron lotes</h3>
              <p className="text-sm text-gray-600">
                No hay lotes que coincidan con los filtros seleccionados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lote</TableHead>
                    <TableHead>Medicamento</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead>Fabricación</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead className="text-right">Días restantes</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatches.map((batch) => {
                    const statusBadge = getStatusBadge(batch.status);
                    return (
                      <TableRow
                        key={batch.id}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onDoubleClick={() => handleDoubleClick(batch)}
                      >
                        <TableCell>
                          <div>
                            <p className="font-mono text-sm font-medium">{batch.batchNumber}</p>
                            <p className="text-xs text-gray-600">{batch.location}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{batch.medicineName}</p>
                            <p className="text-sm text-gray-600">{batch.presentation}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{batch.remainingQuantity}</span>
                            <span className="text-xs text-gray-600">de {batch.quantity}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{batch.manufacturingDate}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-900">{batch.expiryDate}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`font-semibold ${
                            batch.daysToExpiry < 0 ? 'text-red-600' :
                            batch.daysToExpiry <= 90 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {batch.daysToExpiry < 0 ? 
                              `${Math.abs(batch.daysToExpiry)} días atrás` : 
                              `${batch.daysToExpiry} días`
                            }
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={statusBadge.className}>
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-gray-900">
                            ${batch.totalValue.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBatch(batch);
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
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Control de lotes y cumplimiento normativo</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Trazabilidad completa de cada lote según regulaciones sanitarias</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Alertas automáticas 90 días antes del vencimiento</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Registro de lotes vencidos para auditoría y destrucción controlada</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de detalles de lote */}
      {selectedBatch && (
        <Dialog open={isDetailsPanelOpen} onOpenChange={setIsDetailsPanelOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-blue-600" />
                Detalles del lote
              </DialogTitle>
              <DialogDescription>
                Información completa del lote {selectedBatch.batchNumber}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Información del lote */}
              <div>
                <h4 className="font-medium mb-3">Información del lote</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Número de lote</Label>
                    <p className="font-mono font-medium mt-1">{selectedBatch.batchNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">ID interno</Label>
                    <p className="font-mono text-sm mt-1">{selectedBatch.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Ubicación</Label>
                    <p className="font-mono mt-1">{selectedBatch.location}</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Medicamento */}
              <div>
                <h4 className="font-medium mb-3">Medicamento</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Nombre</Label>
                    <p className="font-medium mt-1">{selectedBatch.medicineName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Presentación</Label>
                    <p className="mt-1">{selectedBatch.presentation}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Proveedor</Label>
                    <p className="mt-1">{selectedBatch.supplier}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Documento de ingreso</Label>
                    <p className="font-mono text-sm mt-1">{selectedBatch.documentNumber}</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Fechas */}
              <div>
                <h4 className="font-medium mb-3">Fechas</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Fabricación</Label>
                    <p className="mt-1">{selectedBatch.manufacturingDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Vencimiento</Label>
                    <p className={`font-semibold mt-1 ${
                      selectedBatch.daysToExpiry < 0 ? 'text-red-600' :
                      selectedBatch.daysToExpiry <= 90 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {selectedBatch.expiryDate}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Ingreso al sistema</Label>
                    <p className="mt-1">{selectedBatch.entryDate}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="text-sm text-gray-600">Días hasta vencimiento</Label>
                  <p className={`text-2xl font-semibold mt-1 ${
                    selectedBatch.daysToExpiry < 0 ? 'text-red-600' :
                    selectedBatch.daysToExpiry <= 90 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {selectedBatch.daysToExpiry < 0 ? 
                      `Vencido hace ${Math.abs(selectedBatch.daysToExpiry)} días` : 
                      `${selectedBatch.daysToExpiry} días restantes`
                    }
                  </p>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Stock y valores */}
              <div>
                <h4 className="font-medium mb-3">Stock y valores</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Cantidad inicial</Label>
                    <p className="text-2xl font-semibold mt-1 text-gray-600">{selectedBatch.quantity}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Stock actual</Label>
                    <p className="text-2xl font-semibold mt-1 text-blue-600">{selectedBatch.remainingQuantity}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Costo unitario</Label>
                    <p className="font-semibold mt-1">${selectedBatch.unitCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Valor total</Label>
                    <p className="font-semibold mt-1">${selectedBatch.totalValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Estado */}
              <div>
                <Label className="text-sm text-gray-600">Estado del lote</Label>
                <div className="mt-2">
                  <Badge variant="outline" className={getStatusBadge(selectedBatch.status).className}>
                    {getStatusBadge(selectedBatch.status).label}
                  </Badge>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailsPanelOpen(false)}>
                Cerrar
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar trazabilidad
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Componente auxiliar: Diálogo para agregar stock
function AddStockDialog({ 
  open, 
  onOpenChange, 
  medicine,
  onSuccess 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  medicine: any;
  onSuccess: () => void;
}) {
  const [quantity, setQuantity] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!quantity || !batchNumber || !expiryDate) {
      toast.error('Error de validación', {
        description: 'Completa todos los campos obligatorios',
      });
      return;
    }

    toast.success('Stock agregado exitosamente', {
      description: `Se agregaron ${quantity} unidades de ${medicine?.medicineName}`,
      duration: 4000,
    });

    onSuccess();
  };

  if (!medicine) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            Ingresar stock
          </DialogTitle>
          <DialogDescription>
            Registrar entrada de inventario para {medicine.medicineName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Cantidad *</Label>
              <Input
                type="number"
                placeholder="Ej: 500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>
            <div>
              <Label>Número de lote *</Label>
              <Input
                placeholder="Ej: LOT-2024-123"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha de vencimiento *</Label>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Documento de ingreso</Label>
              <Input
                placeholder="Ej: FC-2024-0589"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Notas adicionales</Label>
            <Textarea
              placeholder="Información adicional sobre el ingreso..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Guardar ingreso
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente auxiliar: Diálogo para dar salida
function RemoveStockDialog({ 
  open, 
  onOpenChange, 
  medicine,
  onSuccess 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  medicine: any;
  onSuccess: () => void;
}) {
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("dispensacion");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!quantity) {
      toast.error('Error de validación', {
        description: 'Ingresa la cantidad a dar de salida',
      });
      return;
    }

    toast.success('Salida registrada exitosamente', {
      description: `Se registró salida de ${quantity} unidades de ${medicine?.medicineName}`,
      duration: 4000,
    });

    onSuccess();
  };

  if (!medicine) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Minus className="w-5 h-5 text-red-600" />
            Dar salida de stock
          </DialogTitle>
          <DialogDescription>
            Registrar salida de inventario para {medicine.medicineName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Cantidad *</Label>
              <Input
                type="number"
                placeholder="Ej: 50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                max={medicine.currentStock}
              />
              <p className="text-xs text-gray-600 mt-1">
                Stock disponible: {medicine.currentStock}
              </p>
            </div>
            <div>
              <Label>Motivo *</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dispensacion">Dispensación farmacia</SelectItem>
                  <SelectItem value="vencimiento">Vencimiento</SelectItem>
                  <SelectItem value="devolucio n">Devolución</SelectItem>
                  <SelectItem value="merma">Merma</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Notas adicionales</Label>
            <Textarea
              placeholder="Información adicional sobre la salida..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="destructive">
            <Save className="w-4 h-4 mr-2" />
            Registrar salida
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente auxiliar: Diálogo para nuevo ajuste
function NewAdjustmentDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
}) {
  const [type, setType] = useState("entry");
  const [medicine, setMedicine] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!medicine || !quantity || !reason) {
      toast.error('Error de validación', {
        description: 'Completa todos los campos obligatorios',
      });
      return;
    }

    toast.success('Ajuste registrado exitosamente', {
      description: `Ajuste de ${quantity} unidades registrado correctamente`,
      duration: 4000,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-600" />
            Nuevo ajuste de inventario
          </DialogTitle>
          <DialogDescription>
            Registrar un nuevo movimiento de inventario
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>Tipo de movimiento *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entrada</SelectItem>
                <SelectItem value="exit">Salida</SelectItem>
                <SelectItem value="adjustment">Ajuste</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Medicamento *</Label>
            <Select value={medicine} onValueChange={setMedicine}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un medicamento" />
              </SelectTrigger>
              <SelectContent>
                {mockInventoryItems.map(item => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.medicineName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Cantidad *</Label>
              <Input
                type="number"
                placeholder="Ej: 100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <Label>Motivo *</Label>
              <Input
                placeholder="Ej: Compra regular"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Notas adicionales</Label>
            <Textarea
              placeholder="Información adicional sobre el ajuste..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Registrar ajuste
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
