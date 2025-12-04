import { useState, useEffect } from "react";
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
import { toast } from "sonner@2.0.3";
import { 
  getAllFrequencies, 
  addFrequency, 
  updateFrequency, 
  deleteFrequency,
  toggleFrequencyStatus,
  type Frequency 
} from "../utils/frequenciesStore";
import {
  Settings,
  Database,
  Hash,
  CheckCircle2,
  Save,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Info,
  Shield,
  Clock,
  FileText,
  Bell,
  X,
  AlertTriangle,
  XCircle
} from "lucide-react";

// Datos mock de políticas de recetas
const mockPolicies = [
  {
    id: "POL-001",
    name: "Vigencia de recetas",
    value: "30",
    unit: "días",
    description: "Tiempo máximo de validez de una receta desde su emisión",
    category: "Temporal",
    status: "active",
    lastModified: "2024-09-15"
  },
  {
    id: "POL-002",
    name: "Máximo de medicamentos por receta",
    value: "5",
    unit: "medicamentos",
    description: "Cantidad máxima de medicamentos que puede contener una receta",
    category: "Límites",
    status: "active",
    lastModified: "2024-08-20"
  },
  {
    id: "POL-003",
    name: "Requiere diagnóstico obligatorio",
    value: "true",
    unit: "boolean",
    description: "Si es obligatorio incluir diagnóstico en toda receta",
    category: "Validación",
    status: "active",
    lastModified: "2024-07-10"
  },
  {
    id: "POL-004",
    name: "Permitir prescripción de controlados",
    value: "true",
    unit: "boolean",
    description: "Habilita la prescripción de medicamentos controlados",
    category: "Permisos",
    status: "active",
    lastModified: "2024-09-01"
  },
  {
    id: "POL-005",
    name: "Duración máxima de tratamiento",
    value: "90",
    unit: "días",
    description: "Duración máxima permitida para un tratamiento continuo",
    category: "Temporal",
    status: "active",
    lastModified: "2024-06-15"
  },
  {
    id: "POL-006",
    name: "Requiere firma digital obligatoria",
    value: "true",
    unit: "boolean",
    description: "Si todas las recetas deben ser firmadas digitalmente",
    category: "Seguridad",
    status: "active",
    lastModified: "2024-09-20"
  },
  {
    id: "POL-007",
    name: "Alertas clínicas bloqueantes",
    value: "true",
    unit: "boolean",
    description: "Si las alertas críticas bloquean la emisión de recetas",
    category: "Seguridad",
    status: "active",
    lastModified: "2024-08-30"
  },
  {
    id: "POL-008",
    name: "Dispensación parcial permitida",
    value: "true",
    unit: "boolean",
    description: "Permite dispensar parcialmente una receta en farmacia",
    category: "Farmacia",
    status: "active",
    lastModified: "2024-07-25"
  }
];

// Datos mock de catálogos auxiliares
const mockAuxiliaryCatalogs = [
  {
    id: "AUX-001",
    name: "Frecuencias de dosificación",
    code: "FREQUENCIES",
    description: "Intervalos de tiempo para administración de medicamentos",
    itemsCount: 12,
    lastUpdated: "2024-09-10",
    status: "active"
  },
  {
    id: "AUX-002",
    name: "Duraciones de tratamiento",
    code: "DURATIONS",
    description: "Períodos estándar de duración de tratamientos",
    itemsCount: 8,
    lastUpdated: "2024-08-15",
    status: "active"
  },
  {
    id: "AUX-003",
    name: "Indicaciones especiales",
    code: "INDICATIONS",
    description: "Indicaciones adicionales comunes para prescripciones",
    itemsCount: 15,
    lastUpdated: "2024-09-01",
    status: "active"
  },
  {
    id: "AUX-004",
    name: "Motivos de rechazo",
    code: "REJECTION_REASONS",
    description: "Razones por las que una receta puede ser rechazada",
    itemsCount: 10,
    lastUpdated: "2024-07-20",
    status: "active"
  },
  {
    id: "AUX-005",
    name: "Tipos de identificación",
    code: "ID_TYPES",
    description: "Documentos de identidad aceptados para pacientes",
    itemsCount: 6,
    lastUpdated: "2024-06-30",
    status: "active"
  },
  {
    id: "AUX-006",
    name: "Grupos sanguíneos",
    code: "BLOOD_TYPES",
    description: "Clasificación de tipos de sangre",
    itemsCount: 8,
    lastUpdated: "2024-05-15",
    status: "active"
  },
  {
    id: "AUX-007",
    name: "Tipos de alergia",
    code: "ALLERGY_TYPES",
    description: "Categorías de reacciones alérgicas",
    itemsCount: 12,
    lastUpdated: "2024-09-05",
    status: "active"
  }
];

// Datos mock de configuración de numeración
const mockNumberingConfig = {
  prescriptions: {
    prefix: "RX",
    year: "2024",
    sequence: 201,
    format: "RX-YYYY-NNNN",
    example: "RX-2024-0201",
    resetAnnually: true,
    paddingZeros: 4
  },
  patients: {
    prefix: "PAT",
    year: "",
    sequence: 125,
    format: "PAT-NNNN",
    example: "PAT-0125",
    resetAnnually: false,
    paddingZeros: 4
  },
  doctors: {
    prefix: "DOC",
    year: "",
    sequence: 46,
    format: "DOC-NNN",
    example: "DOC-046",
    resetAnnually: false,
    paddingZeros: 3
  },
  inventory: {
    prefix: "INV",
    year: "",
    sequence: 9,
    format: "INV-NNN",
    example: "INV-009",
    resetAnnually: false,
    paddingZeros: 3
  }
};

// PÁGINA 1: POLÍTICAS DE RECETAS
export function PoliticasPage() {
  const [policies, setPolicies] = useState(mockPolicies);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedPolicy, setSelectedPolicy] = useState<typeof mockPolicies[0] | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || policy.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(mockPolicies.map(p => p.category)));

  const handleSavePolicy = () => {
    toast.success('Política actualizada', {
      description: 'La configuración ha sido guardada correctamente',
      duration: 4000,
    });
    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Políticas de Recetas</h1>
              <p className="text-purple-100 text-sm">Configuración de reglas y límites del sistema de prescripciones</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total políticas</p>
                <p className="text-2xl font-semibold">{policies.length}</p>
              </div>
              <Settings className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activas</p>
                <p className="text-2xl font-semibold">{policies.filter(p => p.status === 'active').length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categorías</p>
                <p className="text-2xl font-semibold">{categories.length}</p>
              </div>
              <Database className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Modificadas (mes)</p>
                <p className="text-2xl font-semibold">3</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Buscar política..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
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

      <Card>
        <CardHeader>
          <CardTitle>Políticas Configuradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Política</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Última modificación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {policy.unit === "boolean" ? (
                        <Badge variant="outline" className={
                          policy.value === "true" 
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "bg-red-100 text-red-700 border-red-300"
                        }>
                          {policy.value === "true" ? "Sí" : "No"}
                        </Badge>
                      ) : (
                        <span className="font-semibold">{policy.value} {policy.unit}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                      {policy.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                    {policy.description}
                  </TableCell>
                  <TableCell className="text-sm">{policy.lastModified}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      Activa
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedPolicy(policy);
                      setIsEditDialogOpen(true);
                    }}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-indigo-200 bg-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-indigo-900 mb-1">Políticas del Sistema</h4>
              <ul className="space-y-1 text-sm text-indigo-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Las políticas afectan el comportamiento global del sistema de prescripciones</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Cambios en políticas críticas requieren confirmación del administrador</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Todas las modificaciones quedan registradas en log de auditoría</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedPolicy && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Política: {selectedPolicy.name}</DialogTitle>
              <DialogDescription>{selectedPolicy.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label>Categoría</Label>
                <Input value={selectedPolicy.category} disabled className="mt-2" />
              </div>

              <div>
                <Label>Valor actual</Label>
                {selectedPolicy.unit === "boolean" ? (
                  <div className="mt-2">
                    <Switch defaultChecked={selectedPolicy.value === "true"} />
                  </div>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Input defaultValue={selectedPolicy.value} type="number" />
                    <Input value={selectedPolicy.unit} disabled className="w-32" />
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-900">
                    <p className="font-medium mb-1">Advertencia</p>
                    <p className="text-yellow-700">
                      Modificar esta política afectará el comportamiento del sistema. Los cambios se aplicarán inmediatamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSavePolicy}>
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// PÁGINA 2: CATÁLOGOS AUXILIARES
export function AuxiliaresPage() {
  const [catalogs, setCatalogs] = useState(mockAuxiliaryCatalogs);
  const [selectedCatalog, setSelectedCatalog] = useState<typeof mockAuxiliaryCatalogs[0] | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [frequencies, setFrequencies] = useState<Frequency[]>([]);
  const [isNewFrequencyDialogOpen, setIsNewFrequencyDialogOpen] = useState(false);
  const [editingFrequency, setEditingFrequency] = useState<Frequency | null>(null);
  const [deleteFrequencyId, setDeleteFrequencyId] = useState<string | null>(null);

  // Cargar frecuencias cuando se abre el dialog de Frecuencias
  useEffect(() => {
    if (isViewDialogOpen && selectedCatalog?.code === 'FREQUENCIES') {
      loadFrequencies();
    }
  }, [isViewDialogOpen, selectedCatalog]);

  const loadFrequencies = () => {
    const allFrequencies = getAllFrequencies();
    setFrequencies(allFrequencies);
    // Actualizar el conteo en el catálogo
    setCatalogs(prev => prev.map(cat => 
      cat.code === 'FREQUENCIES' 
        ? { ...cat, itemsCount: allFrequencies.length }
        : cat
    ));
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Catálogos Auxiliares</h1>
              <p className="text-teal-100 text-sm">Listas de valores y opciones del sistema</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-teal-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total catálogos</p>
                <p className="text-2xl font-semibold">{catalogs.length}</p>
              </div>
              <Database className="w-8 h-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total items</p>
                <p className="text-2xl font-semibold">{catalogs.reduce((sum, c) => sum + c.itemsCount, 0)}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-semibold">{catalogs.filter(c => c.status === 'active').length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catálogos del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Catálogo</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead>Última actualización</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {catalogs.map((catalog) => (
                <TableRow key={catalog.id}>
                  <TableCell className="font-medium">{catalog.name}</TableCell>
                  <TableCell className="font-mono text-sm">{catalog.code}</TableCell>
                  <TableCell className="text-sm text-gray-600">{catalog.description}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                      {catalog.itemsCount} items
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{catalog.lastUpdated}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      Activo
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedCatalog(catalog);
                      setIsViewDialogOpen(true);
                    }}>
                      <Edit className="w-4 h-4 mr-2" />
                      Administrar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedCatalog && selectedCatalog.code === 'FREQUENCIES' ? (
        <FrequenciesManagementDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          catalog={selectedCatalog}
          frequencies={frequencies}
          onRefresh={loadFrequencies}
          onNewFrequency={() => {
            setEditingFrequency(null);
            setIsNewFrequencyDialogOpen(true);
          }}
          onEditFrequency={(freq) => {
            setEditingFrequency(freq);
            setIsNewFrequencyDialogOpen(true);
          }}
          onDeleteFrequency={(id) => setDeleteFrequencyId(id)}
        />
      ) : selectedCatalog && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Administrar: {selectedCatalog.name}</DialogTitle>
              <DialogDescription>{selectedCatalog.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm text-gray-600">Código del catálogo</Label>
                  <p className="font-mono mt-1">{selectedCatalog.code}</p>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo item
                </Button>
              </div>

              <div className="border rounded-lg p-4 max-h-96 overflow-auto">
                <p className="text-sm text-gray-600 mb-3">Items del catálogo ({selectedCatalog.itemsCount})</p>
                <div className="space-y-2">
                  {Array.from({length: Math.min(selectedCatalog.itemsCount, 10)}).map((_, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-gray-500">#{idx + 1}</span>
                        <span className="text-sm">Item de ejemplo {idx + 1}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Cerrar
              </Button>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog para Nueva/Editar Frecuencia */}
      <FrequencyFormDialog
        open={isNewFrequencyDialogOpen}
        onOpenChange={setIsNewFrequencyDialogOpen}
        frequency={editingFrequency}
        onSuccess={() => {
          loadFrequencies();
          setIsNewFrequencyDialogOpen(false);
          setEditingFrequency(null);
        }}
      />

      {/* Dialog de confirmación para eliminar */}
      <Dialog open={!!deleteFrequencyId} onOpenChange={() => setDeleteFrequencyId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar esta frecuencia de dosificación? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteFrequencyId(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteFrequencyId) {
                  const success = deleteFrequency(deleteFrequencyId);
                  if (success) {
                    toast.success('Frecuencia eliminada correctamente');
                    loadFrequencies();
                  } else {
                    toast.error('No se pudo eliminar la frecuencia');
                  }
                  setDeleteFrequencyId(null);
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================
// COMPONENTES AUXILIARES PARA FRECUENCIAS
// ============================================

interface FrequenciesManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalog: typeof mockAuxiliaryCatalogs[0];
  frequencies: Frequency[];
  onRefresh: () => void;
  onNewFrequency: () => void;
  onEditFrequency: (freq: Frequency) => void;
  onDeleteFrequency: (id: string) => void;
}

function FrequenciesManagementDialog({
  open,
  onOpenChange,
  catalog,
  frequencies,
  onRefresh,
  onNewFrequency,
  onEditFrequency,
  onDeleteFrequency
}: FrequenciesManagementDialogProps) {
  const handleToggleStatus = (id: string) => {
    const updated = toggleFrequencyStatus(id);
    if (updated) {
      toast.success(
        updated.activa ? 'Frecuencia activada' : 'Frecuencia desactivada'
      );
      onRefresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Administrar: {catalog.name}
          </DialogTitle>
          <DialogDescription>{catalog.description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4 py-4">
          <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
            <div>
              <Label className="text-sm text-muted-foreground">Código del catálogo</Label>
              <p className="font-mono mt-1">{catalog.code}</p>
            </div>
            <div className="text-right">
              <Label className="text-sm text-muted-foreground">Total de frecuencias</Label>
              <p className="mt-1">
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  {frequencies.length} frecuencias
                </Badge>
              </p>
            </div>
            <Button size="sm" onClick={onNewFrequency}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva frecuencia
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Abreviatura</TableHead>
                  <TableHead className="text-center">Intervalo</TableHead>
                  <TableHead className="text-center">Veces/día</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {frequencies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="w-12 h-12 text-muted-foreground/50" />
                        <p>No hay frecuencias registradas</p>
                        <Button size="sm" variant="outline" onClick={onNewFrequency}>
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar primera frecuencia
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  frequencies.map((freq) => (
                    <TableRow key={freq.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{freq.codigo}</TableCell>
                      <TableCell>
                        <div>
                          <div>{freq.nombre}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {freq.descripcion}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {freq.abreviatura}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {freq.intervaloHoras > 0 ? (
                          <span className="text-sm">{freq.intervaloHoras}h</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {freq.vecesAlDia > 0 ? (
                          <span className="text-sm">{freq.vecesAlDia}x</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            freq.categoria === 'Frecuente' 
                              ? 'bg-green-100 text-green-700 border-green-300'
                              : freq.categoria === 'Especial'
                              ? 'bg-blue-100 text-blue-700 border-blue-300'
                              : freq.categoria === 'PRN'
                              ? 'bg-amber-100 text-amber-700 border-amber-300'
                              : 'bg-purple-100 text-purple-700 border-purple-300'
                          }
                        >
                          {freq.categoria}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleToggleStatus(freq.id)}
                          className="w-full"
                        >
                          {freq.activa ? (
                            <Badge className="gap-1 bg-success cursor-pointer hover:opacity-80">
                              <CheckCircle2 className="w-3 h-3" />
                              Activa
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1 cursor-pointer hover:opacity-80">
                              <XCircle className="w-3 h-3" />
                              Inactiva
                            </Badge>
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onEditFrequency(freq)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => onDeleteFrequency(freq.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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

interface FrequencyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  frequency: Frequency | null;
  onSuccess: () => void;
}

function FrequencyFormDialog({
  open,
  onOpenChange,
  frequency,
  onSuccess
}: FrequencyFormDialogProps) {
  const isEditing = !!frequency;
  
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    intervaloHoras: 0,
    vecesAlDia: 1,
    abreviatura: '',
    instrucciones: '',
    activa: true,
    categoria: 'Frecuente' as Frequency['categoria'],
    orden: 1,
    usuarioModificacion: 'Admin Sistema'
  });

  // Cargar datos al editar
  useEffect(() => {
    if (frequency) {
      setFormData({
        codigo: frequency.codigo,
        nombre: frequency.nombre,
        descripcion: frequency.descripcion,
        intervaloHoras: frequency.intervaloHoras,
        vecesAlDia: frequency.vecesAlDia,
        abreviatura: frequency.abreviatura,
        instrucciones: frequency.instrucciones,
        activa: frequency.activa,
        categoria: frequency.categoria,
        orden: frequency.orden,
        usuarioModificacion: frequency.usuarioModificacion
      });
    } else {
      // Resetear formulario
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        intervaloHoras: 0,
        vecesAlDia: 1,
        abreviatura: '',
        instrucciones: '',
        activa: true,
        categoria: 'Frecuente',
        orden: 1,
        usuarioModificacion: 'Admin Sistema'
      });
    }
  }, [frequency, open]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Validaciones
    if (!formData.codigo.trim()) {
      toast.error('Error de validación', {
        description: 'El código es obligatorio'
      });
      return;
    }

    if (!formData.nombre.trim()) {
      toast.error('Error de validación', {
        description: 'El nombre es obligatorio'
      });
      return;
    }

    if (!formData.abreviatura.trim()) {
      toast.error('Error de validación', {
        description: 'La abreviatura es obligatoria'
      });
      return;
    }

    try {
      if (isEditing && frequency) {
        // Actualizar frecuencia existente
        const updated = updateFrequency(frequency.id, formData);
        if (updated) {
          toast.success('Frecuencia actualizada', {
            description: `${formData.nombre} ha sido actualizada correctamente`
          });
          onSuccess();
        } else {
          toast.error('Error al actualizar la frecuencia');
        }
      } else {
        // Crear nueva frecuencia
        const newFrequency = addFrequency(formData);
        toast.success('Frecuencia creada', {
          description: `${formData.nombre} ha sido agregada al sistema`
        });
        onSuccess();
      }
    } catch (error) {
      toast.error('Error al guardar', {
        description: 'No se pudo guardar la frecuencia'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {isEditing ? 'Editar frecuencia de dosificación' : 'Nueva frecuencia de dosificación'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifique los datos de la frecuencia de dosificación'
              : 'Complete los datos de la nueva frecuencia de dosificación'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Datos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">
                Código <span className="text-red-500">*</span>
              </Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleInputChange('codigo', e.target.value.toUpperCase())}
                placeholder="Ej: QD, BID, TID"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Código único de identificación (mayúsculas)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="abreviatura">
                Abreviatura <span className="text-red-500">*</span>
              </Label>
              <Input
                id="abreviatura"
                value={formData.abreviatura}
                onChange={(e) => handleInputChange('abreviatura', e.target.value)}
                placeholder="Ej: c/8h, c/12h, PRN"
                className="font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Ej: Tres veces al día, Una vez al día"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              placeholder="Descripción detallada de la frecuencia..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="intervaloHoras">Intervalo (horas)</Label>
              <Input
                id="intervaloHoras"
                type="number"
                min="0"
                value={formData.intervaloHoras}
                onChange={(e) => handleInputChange('intervaloHoras', parseInt(e.target.value) || 0)}
                placeholder="24"
              />
              <p className="text-xs text-muted-foreground">
                0 para PRN o dosis única
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vecesAlDia">Veces al día</Label>
              <Input
                id="vecesAlDia"
                type="number"
                min="0"
                value={formData.vecesAlDia}
                onChange={(e) => handleInputChange('vecesAlDia', parseInt(e.target.value) || 0)}
                placeholder="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orden">Orden</Label>
              <Input
                id="orden"
                type="number"
                min="1"
                value={formData.orden}
                onChange={(e) => handleInputChange('orden', parseInt(e.target.value) || 1)}
                placeholder="1"
              />
              <p className="text-xs text-muted-foreground">
                Orden en listas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select 
                value={formData.categoria} 
                onValueChange={(value) => handleInputChange('categoria', value)}
              >
                <SelectTrigger id="categoria">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frecuente">Frecuente</SelectItem>
                  <SelectItem value="Especial">Especial</SelectItem>
                  <SelectItem value="PRN">PRN (Según necesidad)</SelectItem>
                  <SelectItem value="Única">Única</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activa">Estado</Label>
              <div className="flex items-center gap-3 h-10 px-3 border rounded-md">
                <Switch
                  id="activa"
                  checked={formData.activa}
                  onCheckedChange={(checked) => handleInputChange('activa', checked)}
                />
                <span className="text-sm">
                  {formData.activa ? (
                    <Badge className="bg-success">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Activa
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactiva
                    </Badge>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instrucciones">Instrucciones para el paciente</Label>
            <Textarea
              id="instrucciones"
              value={formData.instrucciones}
              onChange={(e) => handleInputChange('instrucciones', e.target.value)}
              placeholder="Ej: Tomar una vez al día, preferiblemente a la misma hora"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Instrucciones que aparecerán en la receta para el paciente
            </p>
          </div>

          {/* Vista previa */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Info className="w-4 h-4" />
              Vista previa
            </Label>
            <div className="bg-background rounded border p-3 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">{formData.codigo || 'CODIGO'}</Badge>
                <Badge variant="outline" className="font-mono">{formData.abreviatura || 'c/Xh'}</Badge>
                <span className="flex-1">{formData.nombre || 'Nombre de la frecuencia'}</span>
                {formData.activa ? (
                  <Badge className="bg-success text-xs">Activa</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">Inactiva</Badge>
                )}
              </div>
              {formData.descripcion && (
                <p className="text-sm text-muted-foreground">{formData.descripcion}</p>
              )}
              {formData.instrucciones && (
                <p className="text-xs text-muted-foreground italic">
                  → {formData.instrucciones}
                </p>
              )}
              <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t">
                {formData.intervaloHoras > 0 && (
                  <span>Intervalo: {formData.intervaloHoras}h</span>
                )}
                {formData.vecesAlDia > 0 && (
                  <span>Frecuencia: {formData.vecesAlDia}x/día</span>
                )}
                <span>Categoría: {formData.categoria}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// PÁGINA 3: NUMERACIÓN DE RECETAS
export function NumeracionPage() {
  const [config, setConfig] = useState(mockNumberingConfig);
  const [selectedType, setSelectedType] = useState<keyof typeof mockNumberingConfig>("prescriptions");

  const handleSave = () => {
    toast.success('Configuración guardada', {
      description: 'La numeración ha sido actualizada correctamente',
      duration: 4000,
    });
  };

  const handleReset = (type: keyof typeof mockNumberingConfig) => {
    toast.success('Secuencia reiniciada', {
      description: `El contador de ${type} ha sido reiniciado a 1`,
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-500 to-red-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <Hash className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-white">Numeración de Recetas</h1>
              <p className="text-purple-100 text-sm">Configuración de secuencias y formatos de numeración</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(config).map(([key, value]) => (
          <Card key={key} className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-gray-600 capitalize">{key}</p>
                <p className="text-xl font-mono font-semibold mt-1">{value.example}</p>
                <p className="text-xs text-gray-500 mt-1">Siguiente: {value.sequence + 1}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(config).map(([key, value]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="capitalize">{key}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prefijo</Label>
                  <Input value={value.prefix} className="mt-2 font-mono" />
                </div>
                <div>
                  <Label>Secuencia actual</Label>
                  <Input value={value.sequence} type="number" className="mt-2 font-mono" />
                </div>
              </div>

              <div>
                <Label>Formato</Label>
                <Input value={value.format} disabled className="mt-2 font-mono bg-gray-50" />
                <p className="text-xs text-gray-600 mt-1">
                  YYYY = Año, NNNN = Secuencia con {value.paddingZeros} dígitos
                </p>
              </div>

              <div>
                <Label>Ejemplo de numeración</Label>
                <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="font-mono font-semibold text-purple-900">{value.example}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm">Reiniciar anualmente</Label>
                  <p className="text-xs text-gray-600">El 1 de enero se resetea a 1</p>
                </div>
                <Switch defaultChecked={value.resetAnnually} />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => handleReset(key as keyof typeof mockNumberingConfig)}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reiniciar secuencia
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-purple-900 mb-1">Configuración de Numeración</h4>
              <ul className="space-y-1 text-sm text-purple-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>La numeración es secuencial y no permite duplicados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Reiniciar la secuencia afectará la numeración de nuevos registros</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Los registros existentes conservan su numeración original</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
