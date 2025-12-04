import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "../components/ui/sheet";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { toast } from "sonner@2.0.3";
import {
  BookOpen,
  Pill,
  Route,
  Stethoscope,
  Building2,
  AlertTriangle,
  ListChecks,
  Globe,
  Search,
  FilterX,
  Eye,
  Edit,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Save,
  Download,
  Upload,
  X
} from "lucide-react";

// Datos mock compartidos
const mockMedicines = [
  { id: "MED-1001", name: "Paracetamol", concentration: "500mg", presentation: "Tableta", atc: "N02BE01", status: "active" },
  { id: "MED-1002", name: "Amoxicilina", concentration: "500mg", presentation: "Cápsula", atc: "J01CA04", status: "active" },
  { id: "MED-1003", name: "Omeprazol", concentration: "20mg", presentation: "Cápsula", atc: "A02BC01", status: "active" },
  { id: "MED-1004", name: "Ibuprofeno", concentration: "400mg", presentation: "Tableta", atc: "M01AE01", status: "active" },
  { id: "MED-1005", name: "Losartán", concentration: "50mg", presentation: "Tableta", atc: "C09CA01", status: "active" }
];

const mockRoutes = [
  { id: "VIA-001", code: "VO", name: "Vía oral", description: "Administración por boca", status: "active" },
  { id: "VIA-002", code: "IV", name: "Vía intravenosa", description: "Administración directa al torrente sanguíneo", status: "active" },
  { id: "VIA-003", code: "IM", name: "Vía intramuscular", description: "Inyección en músculo", status: "active" },
  { id: "VIA-004", code: "SC", name: "Vía subcutánea", description: "Inyección bajo la piel", status: "active" },
  { id: "VIA-005", code: "TOP", name: "Tópica", description: "Aplicación sobre la piel", status: "active" }
];

const mockSpecialties = [
  { id: "ESP-001", code: "MED-INT", name: "Medicina Interna", description: "Diagnóstico y tratamiento de enfermedades del adulto", doctors: 12, status: "active" },
  { id: "ESP-002", code: "CARDIO", name: "Cardiología", description: "Especialidad del corazón y sistema cardiovascular", doctors: 8, status: "active" },
  { id: "ESP-003", code: "ENDOCR", name: "Endocrinología", description: "Especialidad de hormonas y metabolismo", doctors: 6, status: "active" },
  { id: "ESP-004", code: "MED-FAM", name: "Medicina Familiar", description: "Atención integral de la familia", doctors: 15, status: "active" },
  { id: "ESP-005", code: "PEDIATR", name: "Pediatría", description: "Atención médica de niños y adolescentes", doctors: 10, status: "active" }
];

const mockUnits = [
  { id: "UNI-001", code: "CONSUL-EXT", name: "Consulta Externa", type: "Ambulatoria", capacity: 20, status: "active" },
  { id: "UNI-002", code: "URGENCIAS", name: "Urgencias", type: "Urgencias", capacity: 15, status: "active" },
  { id: "UNI-003", code: "HOSP-MED", name: "Hospitalización Medicina", type: "Hospitalización", capacity: 30, status: "active" },
  { id: "UNI-004", code: "FARM-CENT", name: "Farmacia Central", type: "Farmacia", capacity: 10, status: "active" },
  { id: "UNI-005", code: "LAB-CLIN", name: "Laboratorio Clínico", type: "Laboratorio", capacity: 8, status: "active" }
];

const mockInteractions = [
  { id: "INT-001", drug1: "Warfarina", drug2: "Aspirina", severity: "critical", description: "Riesgo severo de hemorragia", recommendation: "Evitar combinación o ajustar dosis con monitoreo INR estricto", status: "active" },
  { id: "INT-002", drug1: "Atorvastatina", drug2: "Gemfibrozilo", severity: "warning", description: "Riesgo aumentado de miopatía", recommendation: "Considerar alternativas o monitorear función muscular", status: "active" },
  { id: "INT-003", drug1: "Metformina", drug2: "Contraste yodado", severity: "critical", description: "Riesgo de acidosis láctica", recommendation: "Suspender metformina 48h antes del estudio con contraste", status: "active" },
  { id: "INT-004", drug1: "IECA", drug2: "Espironolactona", severity: "warning", description: "Riesgo de hiperpotasemia", recommendation: "Monitoreo estricto de potasio sérico", status: "active" },
  { id: "INT-005", drug1: "Omeprazol", drug2: "Clopidogrel", severity: "info", description: "Reducción de eficacia antiagregante", recommendation: "Considerar pantoprazol como alternativa", status: "active" }
];

const mockAlertTypes = [
  { id: "ALT-001", code: "INTER-DRUG", name: "Interacción medicamentosa", category: "Farmacológica", severity: "critical", autoTrigger: true, requiresJustification: true, status: "active" },
  { id: "ALT-002", code: "ALLERGY", name: "Alergia conocida", category: "Seguridad", severity: "critical", autoTrigger: true, requiresJustification: false, status: "active" },
  { id: "ALT-003", code: "DOSE-HIGH", name: "Dosis alta", category: "Dosificación", severity: "warning", autoTrigger: true, requiresJustification: true, status: "active" },
  { id: "ALT-004", code: "RENAL-ADJUST", name: "Ajuste por función renal", category: "Contraindicación", severity: "warning", autoTrigger: true, requiresJustification: false, status: "active" },
  { id: "ALT-005", code: "PREGNANCY", name: "Riesgo en embarazo", category: "Seguridad", severity: "info", autoTrigger: true, requiresJustification: true, status: "active" }
];

const mockCountries = [
  { id: "COUNTRY-001", code: "MX", name: "México", region: "América Latina", phoneCode: "+52", status: "active" },
  { id: "COUNTRY-002", code: "US", name: "Estados Unidos", region: "América del Norte", phoneCode: "+1", status: "active" },
  { id: "COUNTRY-003", code: "CO", name: "Colombia", region: "América Latina", phoneCode: "+57", status: "active" },
  { id: "COUNTRY-004", code: "AR", name: "Argentina", region: "América Latina", phoneCode: "+54", status: "active" },
  { id: "COUNTRY-005", code: "ES", name: "España", region: "Europa", phoneCode: "+34", status: "active" }
];

// PÁGINA 1: MEDICAMENTOS
export function MedicamentosPage() {
  const [medicines, setMedicines] = useState(mockMedicines);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<typeof mockMedicines[0] | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

  const handleAddMedicine = (newMedicine: typeof mockMedicines[0]) => {
    setMedicines([...medicines, newMedicine]);
    setIsNewDialogOpen(false);
    toast.success('Medicamento agregado', {
      description: `${newMedicine.name} ha sido agregado al catálogo`,
    });
  };

  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.atc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDoubleClick = (medicine: typeof mockMedicines[0]) => {
    setSelectedMedicine(medicine);
    setIsEditPanelOpen(true);
  };

  const handleEditMedicine = (medicine: typeof mockMedicines[0]) => {
    setSelectedMedicine(medicine);
    setIsEditPanelOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <Pill className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white">Catálogo de Medicamentos</h1>
                <p className="text-blue-100 text-sm">Vademécum institucional con códigos ATC</p>
              </div>
            </div>
            <Button onClick={() => setIsNewDialogOpen(true)} className="bg-white text-blue-600 hover:bg-blue-50">
              <Plus className="w-5 h-5 mr-2" />
              Nuevo medicamento
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total medicamentos</p>
            <p className="text-2xl font-semibold">{medicines.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Activos</p>
            <p className="text-2xl font-semibold">{medicines.filter(m => m.status === 'active').length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Categorías ATC</p>
            <p className="text-2xl font-semibold">{new Set(medicines.map(m => m.atc[0])).size}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar medicamento o código ATC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Medicamentos Registrados</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {filteredMedicines.length} medicamento{filteredMedicines.length !== 1 ? 's' : ''} encontrado{filteredMedicines.length !== 1 ? 's' : ''} • Doble clic para editar
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicamento</TableHead>
                <TableHead>Concentración</TableHead>
                <TableHead>Presentación</TableHead>
                <TableHead>Código ATC</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicines.map((med) => (
                <TableRow 
                  key={med.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onDoubleClick={() => handleDoubleClick(med)}
                >
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell>{med.concentration}</TableCell>
                  <TableCell>{med.presentation}</TableCell>
                  <TableCell className="font-mono text-sm">{med.atc}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      Activo
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditMedicine(med)}>
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

      {/* Panel de edición */}
      {selectedMedicine && (
        <MedicineEditPanel
          medicine={selectedMedicine}
          open={isEditPanelOpen}
          onOpenChange={setIsEditPanelOpen}
          onSave={(updatedMedicine) => {
            setMedicines(medicines.map(m => 
              m.id === updatedMedicine.id ? updatedMedicine : m
            ));
            setIsEditPanelOpen(false);
            toast.success('Medicamento actualizado', {
              description: `${updatedMedicine.name} ha sido actualizado correctamente`,
            });
          }}
        />
      )}

      {/* Diálogo de nuevo medicamento */}
      <NewMedicineDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onAdd={handleAddMedicine}
        existingMedicines={medicines}
      />
    </div>
  );
}

// Componente auxiliar: Panel de edición de medicamento
function MedicineEditPanel({
  medicine,
  open,
  onOpenChange,
  onSave
}: {
  medicine: typeof mockMedicines[0];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (medicine: typeof mockMedicines[0]) => void;
}) {
  const [formData, setFormData] = useState(medicine);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Validaciones
    if (!formData.name.trim()) {
      toast.error('Error de validación', {
        description: 'El nombre del medicamento es obligatorio',
      });
      return;
    }

    if (!formData.concentration.trim()) {
      toast.error('Error de validación', {
        description: 'La concentración es obligatoria',
      });
      return;
    }

    if (!formData.atc.trim()) {
      toast.error('Error de validación', {
        description: 'El código ATC es obligatorio',
      });
      return;
    }

    onSave(formData);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('¿Desea descartar los cambios realizados?')) {
        setFormData(medicine);
        setHasChanges(false);
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            Editar Medicamento
          </SheetTitle>
          <SheetDescription>
            Modifique la información del medicamento en el vademécum institucional
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Información básica */}
          <div className="space-y-4">
            <div className="pb-2 border-b">
              <h3 className="font-medium text-gray-900">Información básica</h3>
              <p className="text-sm text-gray-600">Datos principales del medicamento</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="med-id">ID del medicamento</Label>
                <Input
                  id="med-id"
                  value={formData.id}
                  disabled
                  className="bg-gray-50 font-mono"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="med-name">
                  Nombre del medicamento <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="med-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Paracetamol"
                />
              </div>

              <div>
                <Label htmlFor="med-concentration">
                  Concentración <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="med-concentration"
                  value={formData.concentration}
                  onChange={(e) => handleInputChange('concentration', e.target.value)}
                  placeholder="Ej: 500mg"
                />
              </div>

              <div>
                <Label htmlFor="med-presentation">
                  Presentación <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.presentation}
                  onValueChange={(value) => handleInputChange('presentation', value)}
                >
                  <SelectTrigger id="med-presentation">
                    <SelectValue placeholder="Seleccione presentación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tableta">Tableta</SelectItem>
                    <SelectItem value="Cápsula">Cápsula</SelectItem>
                    <SelectItem value="Jarabe">Jarabe</SelectItem>
                    <SelectItem value="Suspensión">Suspensión</SelectItem>
                    <SelectItem value="Solución inyectable">Solución inyectable</SelectItem>
                    <SelectItem value="Ampolla">Ampolla</SelectItem>
                    <SelectItem value="Crema">Crema</SelectItem>
                    <SelectItem value="Ungüento">Ungüento</SelectItem>
                    <SelectItem value="Gel">Gel</SelectItem>
                    <SelectItem value="Supositorio">Supositorio</SelectItem>
                    <SelectItem value="Óvulo">Óvulo</SelectItem>
                    <SelectItem value="Parche">Parche</SelectItem>
                    <SelectItem value="Inhalador">Inhalador</SelectItem>
                    <SelectItem value="Gotas">Gotas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Código ATC */}
          <div className="space-y-4">
            <div className="pb-2 border-b">
              <h3 className="font-medium text-gray-900">Clasificación ATC</h3>
              <p className="text-sm text-gray-600">
                Sistema Anatómico Terapéutico Químico (ATC) de la OMS
              </p>
            </div>

            <div>
              <Label htmlFor="med-atc">
                Código ATC <span className="text-red-500">*</span>
              </Label>
              <Input
                id="med-atc"
                value={formData.atc}
                onChange={(e) => handleInputChange('atc', e.target.value.toUpperCase())}
                placeholder="Ej: N02BE01"
                className="font-mono"
                maxLength={7}
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato: 1 letra + 2 dígitos + 2 letras + 2 dígitos (Ej: N02BE01)
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Información del código ATC
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    El código ATC clasifica los medicamentos según el órgano o sistema sobre el que actúan y sus propiedades químicas, farmacológicas y terapéuticas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-4">
            <div className="pb-2 border-b">
              <h3 className="font-medium text-gray-900">Estado del medicamento</h3>
              <p className="text-sm text-gray-600">Control de disponibilidad en el sistema</p>
            </div>

            <div>
              <Label htmlFor="med-status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger id="med-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Activo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>Inactivo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="discontinued">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span>Descontinuado</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Indicador de cambios */}
          {hasChanges && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  Hay cambios sin guardar. Recuerde guardar antes de cerrar.
                </p>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Guardar cambios
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Componente auxiliar: Diálogo de nuevo medicamento
function NewMedicineDialog({
  open,
  onOpenChange,
  onAdd,
  existingMedicines
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (medicine: typeof mockMedicines[0]) => void;
  existingMedicines: typeof mockMedicines;
}) {
  const [formData, setFormData] = useState({
    name: '',
    concentration: '',
    presentation: 'Tableta',
    atc: '',
    status: 'active'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    // Validaciones
    if (!formData.name.trim()) {
      toast.error('Error de validación', {
        description: 'El nombre del medicamento es obligatorio',
      });
      return;
    }

    if (!formData.concentration.trim()) {
      toast.error('Error de validación', {
        description: 'La concentración es obligatoria',
      });
      return;
    }

    if (!formData.atc.trim()) {
      toast.error('Error de validación', {
        description: 'El código ATC es obligatorio',
      });
      return;
    }

    // Generar ID único
    const newId = `MED-${(existingMedicines.length + 1001).toString().padStart(4, '0')}`;
    
    const newMedicine = {
      id: newId,
      ...formData
    };

    onAdd(newMedicine);
    
    // Limpiar formulario
    setFormData({
      name: '',
      concentration: '',
      presentation: 'Tableta',
      atc: '',
      status: 'active'
    });
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      concentration: '',
      presentation: 'Tableta',
      atc: '',
      status: 'active'
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            Nuevo Medicamento
          </DialogTitle>
          <DialogDescription>
            Agregue un nuevo medicamento al vademécum institucional
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="pb-2 border-b">
              <h3 className="font-medium text-gray-900">Información básica</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="new-med-name">
                  Nombre del medicamento <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="new-med-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Paracetamol"
                />
              </div>

              <div>
                <Label htmlFor="new-med-concentration">
                  Concentración <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="new-med-concentration"
                  value={formData.concentration}
                  onChange={(e) => handleInputChange('concentration', e.target.value)}
                  placeholder="Ej: 500mg"
                />
              </div>

              <div>
                <Label htmlFor="new-med-presentation">
                  Presentación <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.presentation}
                  onValueChange={(value) => handleInputChange('presentation', value)}
                >
                  <SelectTrigger id="new-med-presentation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tableta">Tableta</SelectItem>
                    <SelectItem value="Cápsula">Cápsula</SelectItem>
                    <SelectItem value="Jarabe">Jarabe</SelectItem>
                    <SelectItem value="Suspensión">Suspensión</SelectItem>
                    <SelectItem value="Solución inyectable">Solución inyectable</SelectItem>
                    <SelectItem value="Ampolla">Ampolla</SelectItem>
                    <SelectItem value="Crema">Crema</SelectItem>
                    <SelectItem value="Ungüento">Ungüento</SelectItem>
                    <SelectItem value="Gel">Gel</SelectItem>
                    <SelectItem value="Supositorio">Supositorio</SelectItem>
                    <SelectItem value="Óvulo">Óvulo</SelectItem>
                    <SelectItem value="Parche">Parche</SelectItem>
                    <SelectItem value="Inhalador">Inhalador</SelectItem>
                    <SelectItem value="Gotas">Gotas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="new-med-atc">
                  Código ATC <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="new-med-atc"
                  value={formData.atc}
                  onChange={(e) => handleInputChange('atc', e.target.value.toUpperCase())}
                  placeholder="Ej: N02BE01"
                  className="font-mono"
                  maxLength={7}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formato: 1 letra + 2 dígitos + 2 letras + 2 dígitos
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar medicamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// PÁGINA 2: VÍAS DE ADMINISTRACIÓN
export function ViasPage() {
  const [routes, setRoutes] = useState(mockRoutes);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<typeof mockRoutes[0] | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  const handleAddRoute = (newRoute: typeof mockRoutes[0]) => {
    setRoutes([...routes, newRoute]);
    setIsNewDialogOpen(false);
    toast.success('Vía agregada', {
      description: `${newRoute.name} ha sido agregada al catálogo`,
    });
  };

  const filteredRoutes = routes.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDoubleClick = (route: typeof mockRoutes[0]) => {
    setSelectedRoute(route);
    setIsEditPanelOpen(true);
  };

  const handleEditRoute = (route: typeof mockRoutes[0]) => {
    setSelectedRoute(route);
    setIsEditPanelOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <Route className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white">Vías de Administración</h1>
                <p className="text-green-100 text-sm">Rutas de administración de medicamentos</p>
              </div>
            </div>
            <Button onClick={() => setIsNewDialogOpen(true)} className="bg-white text-green-600 hover:bg-green-50">
              <Plus className="w-5 h-5 mr-2" />
              Nueva vía
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Vías de Administración Registradas</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {filteredRoutes.length} vía{filteredRoutes.length !== 1 ? 's' : ''} encontrada{filteredRoutes.length !== 1 ? 's' : ''} • Doble clic para editar
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutes.map((route) => (
                <TableRow 
                  key={route.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onDoubleClick={() => handleDoubleClick(route)}
                >
                  <TableCell className="font-mono font-semibold">{route.code}</TableCell>
                  <TableCell className="font-medium">{route.name}</TableCell>
                  <TableCell className="text-sm text-gray-600">{route.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      Activa
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditRoute(route)}>
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

      {/* Panel de edición */}
      {selectedRoute && (
        <RouteEditPanel
          route={selectedRoute}
          open={isEditPanelOpen}
          onOpenChange={setIsEditPanelOpen}
          onSave={(updatedRoute) => {
            setRoutes(routes.map(r => 
              r.id === updatedRoute.id ? updatedRoute : r
            ));
            setIsEditPanelOpen(false);
            toast.success('Vía actualizada', {
              description: `${updatedRoute.name} ha sido actualizada correctamente`,
            });
          }}
        />
      )}

      {/* Diálogo de nueva vía */}
      <NewRouteDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onAdd={handleAddRoute}
        existingRoutes={routes}
      />
    </div>
  );
}

// Componente auxiliar: Panel de edición de vía
function RouteEditPanel({
  route,
  open,
  onOpenChange,
  onSave
}: {
  route: typeof mockRoutes[0];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (route: typeof mockRoutes[0]) => void;
}) {
  const [formData, setFormData] = useState(route);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Error de validación', {
        description: 'El código y nombre son obligatorios',
      });
      return;
    }
    onSave(formData);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('¿Desea descartar los cambios realizados?')) {
        setFormData(route);
        setHasChanges(false);
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Route className="w-5 h-5 text-green-600" />
            Editar Vía de Administración
          </SheetTitle>
          <SheetDescription>
            Modifique la información de la vía de administración
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-4">
            <div className="pb-2 border-b">
              <h3 className="font-medium text-gray-900">Información de la vía</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>ID de la vía</Label>
                <Input value={formData.id} disabled className="bg-gray-50 font-mono" />
              </div>

              <div>
                <Label>Código <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  placeholder="Ej: VO"
                  className="font-mono"
                />
              </div>

              <div>
                <Label>Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activa</SelectItem>
                    <SelectItem value="inactive">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label>Nombre <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Vía oral"
                />
              </div>

              <div className="col-span-2">
                <Label>Descripción</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descripción de la vía de administración"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {hasChanges && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  Hay cambios sin guardar. Recuerde guardar antes de cerrar.
                </p>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Guardar cambios
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Componente auxiliar: Diálogo de nueva vía
function NewRouteDialog({
  open,
  onOpenChange,
  onAdd,
  existingRoutes
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (route: typeof mockRoutes[0]) => void;
  existingRoutes: typeof mockRoutes;
}) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    status: 'active'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Error de validación', {
        description: 'El código y nombre son obligatorios',
      });
      return;
    }

    const newId = `VIA-${(existingRoutes.length + 1).toString().padStart(3, '0')}`;
    const newRoute = {
      id: newId,
      ...formData
    };

    onAdd(newRoute);
    setFormData({ code: '', name: '', description: '', status: 'active' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Route className="w-5 h-5 text-green-600" />
            Nueva Vía de Administración
          </DialogTitle>
          <DialogDescription>
            Agregue una nueva vía de administración al catálogo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Código <span className="text-red-500">*</span></Label>
              <Input
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                placeholder="Ej: VO"
                className="font-mono"
              />
            </div>

            <div>
              <Label>Estado</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activa</SelectItem>
                  <SelectItem value="inactive">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label>Nombre <span className="text-red-500">*</span></Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Vía oral"
              />
            </div>

            <div className="col-span-2">
              <Label>Descripción</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción de la vía de administración"
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { setFormData({ code: '', name: '', description: '', status: 'active' }); onOpenChange(false); }}>
            Cancelar
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar vía
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// PÁGINA 3: ESPECIALIDADES
export function EspecialidadesPage() {
  const [specialties, setSpecialties] = useState(mockSpecialties);
  const [selectedSpecialty, setSelectedSpecialty] = useState<typeof mockSpecialties[0] | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  const handleAddSpecialty = (newSpecialty: typeof mockSpecialties[0]) => {
    setSpecialties([...specialties, newSpecialty]);
    setIsNewDialogOpen(false);
    toast.success('Especialidad agregada', {
      description: `${newSpecialty.name} ha sido agregada al catálogo`,
    });
  };

  const handleDoubleClick = (specialty: typeof mockSpecialties[0]) => {
    setSelectedSpecialty(specialty);
    setIsEditPanelOpen(true);
  };

  const handleEditSpecialty = (specialty: typeof mockSpecialties[0]) => {
    setSelectedSpecialty(specialty);
    setIsEditPanelOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white">Especialidades Médicas</h1>
                <p className="text-purple-100 text-sm">Catálogo de especialidades profesionales</p>
              </div>
            </div>
            <Button onClick={() => setIsNewDialogOpen(true)} className="bg-white text-purple-600 hover:bg-purple-50">
              <Plus className="w-5 h-5 mr-2" />
              Nueva especialidad
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Especialidades Registradas</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {specialties.length} especialidad{specialties.length !== 1 ? 'es' : ''} • Doble clic para editar
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Especialidad</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Médicos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specialties.map((spec) => (
                <TableRow 
                  key={spec.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onDoubleClick={() => handleDoubleClick(spec)}
                >
                  <TableCell className="font-mono font-semibold">{spec.code}</TableCell>
                  <TableCell className="font-medium">{spec.name}</TableCell>
                  <TableCell className="text-sm text-gray-600">{spec.description}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                      {spec.doctors} médicos
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      Activa
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditSpecialty(spec)}>
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

      {/* Dialog para nueva especialidad */}
      <NewSpecialtyDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onAdd={handleAddSpecialty}
      />

      {/* Panel de edición */}
      {selectedSpecialty && (
        <SpecialtyEditPanel
          specialty={selectedSpecialty}
          open={isEditPanelOpen}
          onOpenChange={setIsEditPanelOpen}
          onSave={(updatedSpecialty) => {
            setSpecialties(specialties.map(s => 
              s.id === updatedSpecialty.id ? updatedSpecialty : s
            ));
            setIsEditPanelOpen(false);
            toast.success('Especialidad actualizada', {
              description: `${updatedSpecialty.name} ha sido actualizada correctamente`,
            });
          }}
        />
      )}
    </div>
  );
}

// Componente auxiliar: Dialog para nueva especialidad
function NewSpecialtyDialog({
  open,
  onOpenChange,
  onAdd
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (specialty: typeof mockSpecialties[0]) => void;
}) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    // Validaciones
    if (!formData.code.trim()) {
      toast.error('Código requerido', {
        description: 'Debe ingresar un código para la especialidad',
      });
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Nombre requerido', {
        description: 'Debe ingresar un nombre para la especialidad',
      });
      return;
    }

    // Crear nueva especialidad
    const newSpecialty = {
      id: `ESP-${String(Date.now()).slice(-3).padStart(3, '0')}`,
      code: formData.code.toUpperCase(),
      name: formData.name,
      description: formData.description,
      doctors: 0,
      status: formData.status
    };

    onAdd(newSpecialty);

    // Limpiar formulario
    setFormData({
      code: '',
      name: '',
      description: '',
      status: 'active'
    });
  };

  const handleCancel = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      status: 'active'
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Stethoscope className="w-5 h-5 text-purple-600" />
            </div>
            Nueva Especialidad Médica
          </DialogTitle>
          <DialogDescription>
            Agregue una nueva especialidad médica al catálogo del sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="new-code">
                Código de especialidad <span className="text-red-500">*</span>
              </Label>
              <Input
                id="new-code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                placeholder="Ej: GASTRO, NEURO, DERMATO"
                className="font-mono"
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Código único que identifica la especialidad (máx. 20 caracteres)
              </p>
            </div>

            <div className="col-span-2">
              <Label htmlFor="new-name">
                Nombre de la especialidad <span className="text-red-500">*</span>
              </Label>
              <Input
                id="new-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Gastroenterología, Neurología"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="new-description">Descripción</Label>
              <Textarea
                id="new-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción de la especialidad médica"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Breve descripción del área de especialización
              </p>
            </div>

            <div>
              <Label htmlFor="new-status">Estado inicial</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger id="new-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Activa</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-gray-400" />
                      <span>Inactiva</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Médicos asignados</Label>
              <Input
                value="0 médicos (nueva especialidad)"
                disabled
                className="bg-gray-50 text-gray-500"
              />
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 mb-1">
                  Información importante
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• El código debe ser único en el sistema</li>
                  <li>• Use códigos cortos y descriptivos (ej: CARDIO, DERMATO)</li>
                  <li>• La especialidad podrá asignarse a médicos desde el módulo de Médicos</li>
                  <li>• Puede cambiar el estado a Inactiva para ocultar la especialidad</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            onClick={handleAdd}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar especialidad
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente auxiliar: Panel de edición de especialidad
function SpecialtyEditPanel({
  specialty,
  open,
  onOpenChange,
  onSave
}: {
  specialty: typeof mockSpecialties[0];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (specialty: typeof mockSpecialties[0]) => void;
}) {
  const [formData, setFormData] = useState(specialty);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Error de validación', {
        description: 'El código y nombre son obligatorios',
      });
      return;
    }
    onSave(formData);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('¿Desea descartar los cambios realizados?')) {
        setFormData(specialty);
        setHasChanges(false);
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-purple-600" />
            Editar Especialidad Médica
          </SheetTitle>
          <SheetDescription>
            Modifique la información de la especialidad médica
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-4">
            <div className="pb-2 border-b">
              <h3 className="font-medium text-gray-900">Información de la especialidad</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>ID de la especialidad</Label>
                <Input value={formData.id} disabled className="bg-gray-50 font-mono" />
              </div>

              <div>
                <Label>Código <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  placeholder="Ej: MED-INT"
                  className="font-mono"
                />
              </div>

              <div>
                <Label>Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activa</SelectItem>
                    <SelectItem value="inactive">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label>Nombre <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Medicina Interna"
                />
              </div>

              <div className="col-span-2">
                <Label>Descripción</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descripción de la especialidad"
                  rows={3}
                />
              </div>

              <div className="col-span-2">
                <Label>Cantidad de médicos (solo lectura)</Label>
                <Input
                  value={`${formData.doctors} médicos registrados`}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
          </div>

          {hasChanges && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  Hay cambios sin guardar. Recuerde guardar antes de cerrar.
                </p>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Guardar cambios
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// PÁGINA 4: UNIDADES MÉDICAS
export function UnidadesPage() {
  const [units, setUnits] = useState(mockUnits);
  const [selectedUnit, setSelectedUnit] = useState<typeof mockUnits[0] | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  const handleAddUnit = (newUnit: typeof mockUnits[0]) => {
    setUnits([...units, newUnit]);
    setIsNewDialogOpen(false);
    toast.success('Unidad médica agregada', {
      description: `${newUnit.name} ha sido agregada al catálogo`,
    });
  };

  const handleDoubleClick = (unit: typeof mockUnits[0]) => {
    setSelectedUnit(unit);
    setIsEditPanelOpen(true);
  };

  const handleEditUnit = (unit: typeof mockUnits[0]) => {
    setSelectedUnit(unit);
    setIsEditPanelOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white">Unidades Médicas</h1>
                <p className="text-cyan-100 text-sm">Departamentos y servicios del hospital</p>
              </div>
            </div>
            <Button onClick={() => setIsNewDialogOpen(true)} className="bg-white text-cyan-600 hover:bg-cyan-50">
              <Plus className="w-5 h-5 mr-2" />
              Nueva unidad
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Unidades Registradas</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {units.length} unidad{units.length !== 1 ? 'es' : ''} • Doble clic para editar
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Capacidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow 
                  key={unit.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onDoubleClick={() => handleDoubleClick(unit)}
                >
                  <TableCell className="font-mono font-semibold">{unit.code}</TableCell>
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                      {unit.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{unit.capacity}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      Activa
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditUnit(unit)}>
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

      {/* Dialog para nueva unidad */}
      <NewUnitDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onAdd={handleAddUnit}
      />

      {/* Panel de edición */}
      {selectedUnit && (
        <UnitEditPanel
          unit={selectedUnit}
          open={isEditPanelOpen}
          onOpenChange={setIsEditPanelOpen}
          onSave={(updatedUnit) => {
            setUnits(units.map(u => 
              u.id === updatedUnit.id ? updatedUnit : u
            ));
            setIsEditPanelOpen(false);
            toast.success('Unidad actualizada', {
              description: `${updatedUnit.name} ha sido actualizada correctamente`,
            });
          }}
        />
      )}
    </div>
  );
}

// Componente auxiliar: Dialog para nueva unidad médica
function NewUnitDialog({
  open,
  onOpenChange,
  onAdd
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (unit: typeof mockUnits[0]) => void;
}) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'Ambulatoria' as string,
    capacity: 10,
    status: 'active' as 'active' | 'inactive'
  });

  const unitTypes = [
    'Ambulatoria',
    'Urgencias',
    'Hospitalización',
    'Farmacia',
    'Laboratorio',
    'Radiología',
    'Quirófano',
    'UCI',
    'Pediatría',
    'Obstetricia',
    'Rehabilitación',
    'Administración'
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    // Validaciones
    if (!formData.code.trim()) {
      toast.error('Código requerido', {
        description: 'Debe ingresar un código para la unidad médica',
      });
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Nombre requerido', {
        description: 'Debe ingresar un nombre para la unidad médica',
      });
      return;
    }

    if (formData.capacity < 1) {
      toast.error('Capacidad inválida', {
        description: 'La capacidad debe ser al menos 1',
      });
      return;
    }

    // Crear nueva unidad
    const newUnit = {
      id: `UNI-${String(Date.now()).slice(-3).padStart(3, '0')}`,
      code: formData.code.toUpperCase(),
      name: formData.name,
      type: formData.type,
      capacity: formData.capacity,
      status: formData.status
    };

    onAdd(newUnit);

    // Limpiar formulario
    setFormData({
      code: '',
      name: '',
      type: 'Ambulatoria',
      capacity: 10,
      status: 'active'
    });
  };

  const handleCancel = () => {
    setFormData({
      code: '',
      name: '',
      type: 'Ambulatoria',
      capacity: 10,
      status: 'active'
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Building2 className="w-5 h-5 text-cyan-600" />
            </div>
            Nueva Unidad Médica
          </DialogTitle>
          <DialogDescription>
            Agregue una nueva unidad, departamento o servicio médico al sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="new-unit-code">
                Código de unidad <span className="text-red-500">*</span>
              </Label>
              <Input
                id="new-unit-code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                placeholder="Ej: CONSUL-EXT, URGENCIAS"
                className="font-mono"
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Código único de identificación (máx. 30 caracteres)
              </p>
            </div>

            <div>
              <Label htmlFor="new-unit-type">
                Tipo de unidad <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger id="new-unit-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unitTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Categoría o tipo de servicio
              </p>
            </div>

            <div className="col-span-2">
              <Label htmlFor="new-unit-name">
                Nombre de la unidad <span className="text-red-500">*</span>
              </Label>
              <Input
                id="new-unit-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Consulta Externa, Urgencias, Laboratorio Clínico"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Nombre completo del departamento o servicio
              </p>
            </div>

            <div>
              <Label htmlFor="new-unit-capacity">
                Capacidad de atención <span className="text-red-500">*</span>
              </Label>
              <Input
                id="new-unit-capacity"
                type="number"
                min="1"
                max="1000"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Capacidad de atención simultánea (pacientes/camas)
              </p>
            </div>

            <div>
              <Label htmlFor="new-unit-status">Estado inicial</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger id="new-unit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Activa</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-gray-400" />
                      <span>Inactiva</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 mb-1">
                  Información importante
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• El código debe ser único en el sistema</li>
                  <li>• Use códigos descriptivos y fáciles de identificar</li>
                  <li>• La capacidad determina límites de atención simultánea</li>
                  <li>• Las unidades inactivas no aparecen en selecciones</li>
                  <li>• Se pueden asociar médicos y equipos a cada unidad</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Preview de la unidad */}
          <div className="border border-border rounded-lg p-4 bg-gradient-to-r from-cyan-50 to-blue-50">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-600" />
              Vista previa de la unidad
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Código:</span>
                <p className="font-mono font-semibold">{formData.code || '(sin código)'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tipo:</span>
                <p className="font-medium">{formData.type}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Nombre:</span>
                <p className="font-medium">{formData.name || '(sin nombre)'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Capacidad:</span>
                <p className="font-medium">{formData.capacity} {formData.capacity === 1 ? 'paciente' : 'pacientes'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Estado:</span>
                <Badge variant="outline" className={formData.status === 'active' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'}>
                  {formData.status === 'active' ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            onClick={handleAdd}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar unidad médica
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente auxiliar: Panel de edición de unidad
function UnitEditPanel({
  unit,
  open,
  onOpenChange,
  onSave
}: {
  unit: typeof mockUnits[0];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (unit: typeof mockUnits[0]) => void;
}) {
  const [formData, setFormData] = useState(unit);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Error de validación', {
        description: 'El código y nombre son obligatorios',
      });
      return;
    }
    onSave(formData);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('¿Desea descartar los cambios realizados?')) {
        setFormData(unit);
        setHasChanges(false);
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-600" />
            Editar Unidad Médica
          </SheetTitle>
          <SheetDescription>
            Modifique la información de la unidad médica
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-4">
            <div className="pb-2 border-b">
              <h3 className="font-medium text-gray-900">Información de la unidad</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>ID de la unidad</Label>
                <Input value={formData.id} disabled className="bg-gray-50 font-mono" />
              </div>

              <div>
                <Label>Código <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  placeholder="Ej: CONSUL-EXT"
                  className="font-mono"
                />
              </div>

              <div>
                <Label>Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activa</SelectItem>
                    <SelectItem value="inactive">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label>Nombre <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Consulta Externa"
                />
              </div>

              <div>
                <Label>Tipo de unidad</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ambulatoria">Ambulatoria</SelectItem>
                    <SelectItem value="Urgencias">Urgencias</SelectItem>
                    <SelectItem value="Hospitalización">Hospitalización</SelectItem>
                    <SelectItem value="Farmacia">Farmacia</SelectItem>
                    <SelectItem value="Laboratorio">Laboratorio</SelectItem>
                    <SelectItem value="Imagenología">Imagenología</SelectItem>
                    <SelectItem value="Quirófano">Quirófano</SelectItem>
                    <SelectItem value="UCI">UCI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Capacidad</Label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                  placeholder="Número de personas"
                />
              </div>
            </div>
          </div>

          {hasChanges && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  Hay cambios sin guardar. Recuerde guardar antes de cerrar.
                </p>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Guardar cambios
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// PÁGINA 5: INTERACCIONES
export function InteraccionesPage({ onNavigate }: { onNavigate?: (route: string) => void }) {
  const [interactions, setInteractions] = useState(mockInteractions);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedInteraction, setSelectedInteraction] = useState<typeof mockInteractions[0] | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  const handleAddInteraction = (newInteraction: typeof mockInteractions[0]) => {
    setInteractions([...interactions, newInteraction]);
    setIsNewDialogOpen(false);
    toast.success('Interacción agregada', {
      description: `Interacción entre ${newInteraction.drug1} y ${newInteraction.drug2} ha sido agregada`,
    });
  };

  const filteredInteractions = interactions.filter(i => {
    const matchesSearch = 
      i.drug1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.drug2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === "all" || i.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  const handleDoubleClick = (interaction: typeof mockInteractions[0]) => {
    setSelectedInteraction(interaction);
    setIsEditPanelOpen(true);
  };

  const handleEditInteraction = (interaction: typeof mockInteractions[0]) => {
    setSelectedInteraction(interaction);
    setIsEditPanelOpen(true);
  };

  const getSeverityBadge = (severity: string) => {
    const config = {
      critical: { label: "Crítico", className: "bg-red-100 text-red-700 border-red-300", icon: XCircle },
      warning: { label: "Advertencia", className: "bg-orange-100 text-orange-700 border-orange-300", icon: AlertTriangle },
      info: { label: "Información", className: "bg-blue-100 text-blue-700 border-blue-300", icon: CheckCircle2 }
    };
    return config[severity as keyof typeof config] || config.info;
  };

  const criticalCount = interactions.filter(i => i.severity === 'critical').length;
  const warningCount = interactions.filter(i => i.severity === 'warning').length;
  const infoCount = interactions.filter(i => i.severity === 'info').length;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white">Catálogo de Interacciones Medicamentosas</h1>
                <p className="text-orange-100 text-sm">Base de datos de interacciones farmacológicas</p>
              </div>
            </div>
            <Button onClick={() => setIsNewDialogOpen(true)} className="bg-white text-orange-600 hover:bg-orange-50">
              <Plus className="w-5 h-5 mr-2" />
              Nueva interacción
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Críticas</p>
                <p className="text-2xl font-semibold text-red-600">{criticalCount}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Advertencias</p>
                <p className="text-2xl font-semibold text-orange-600">{warningCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Informativas</p>
                <p className="text-2xl font-semibold text-blue-600">{infoCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por medicamento o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por severidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las severidades</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="warning">Advertencia</SelectItem>
                  <SelectItem value="info">Información</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(searchTerm || severityFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSeverityFilter("all");
                }}
              >
                <FilterX className="w-4 h-4 mr-2" />
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Interacciones Registradas</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {filteredInteractions.length} interacción{filteredInteractions.length !== 1 ? 'es' : ''} encontrada{filteredInteractions.length !== 1 ? 's' : ''} • Doble clic para editar
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicamento 1</TableHead>
                <TableHead>Medicamento 2</TableHead>
                <TableHead>Severidad</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInteractions.map((interaction) => {
                const severityBadge = getSeverityBadge(interaction.severity);
                const SeverityIcon = severityBadge.icon;
                
                return (
                  <TableRow 
                    key={interaction.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onDoubleClick={() => handleDoubleClick(interaction)}
                  >
                    <TableCell className="font-medium">{interaction.drug1}</TableCell>
                    <TableCell className="font-medium">{interaction.drug2}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={severityBadge.className}>
                        <SeverityIcon className="w-3 h-3 mr-1" />
                        {severityBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm max-w-md truncate">{interaction.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        Activa
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEditInteraction(interaction)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Panel de edición */}
      {selectedInteraction && (
        <InteractionEditPanel
          interaction={selectedInteraction}
          open={isEditPanelOpen}
          onOpenChange={setIsEditPanelOpen}
          onSave={(updatedInteraction) => {
            setInteractions(interactions.map(i => 
              i.id === updatedInteraction.id ? updatedInteraction : i
            ));
            setIsEditPanelOpen(false);
            toast.success('Interacción actualizada', {
              description: `Interacción entre ${updatedInteraction.drug1} y ${updatedInteraction.drug2} actualizada`,
            });
          }}
        />
      )}

      {/* Diálogo de nueva interacción */}
      <NewInteractionDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onAdd={handleAddInteraction}
        existingInteractions={interactions}
      />
    </div>
  );
}

// Componente auxiliar: Panel de edición de interacción
function InteractionEditPanel({
  interaction,
  open,
  onOpenChange,
  onSave
}: {
  interaction: typeof mockInteractions[0];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (interaction: typeof mockInteractions[0]) => void;
}) {
  const [formData, setFormData] = useState(interaction);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!formData.drug1.trim() || !formData.drug2.trim()) {
      toast.error('Error de validación', {
        description: 'Ambos medicamentos son obligatorios',
      });
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Error de validación', {
        description: 'La descripción de la interacción es obligatoria',
      });
      return;
    }

    onSave(formData);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('¿Desea descartar los cambios realizados?')) {
        setFormData(interaction);
        setHasChanges(false);
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Editar Interacción Medicamentosa
          </SheetTitle>
          <SheetDescription>
            Modifique la información de la interacción farmacológica
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-4">
            <div className="pb-2 border-b">
              <h3 className="font-medium text-gray-900">Información básica</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>ID de la interacción</Label>
                <Input value={formData.id} disabled className="bg-gray-50 font-mono" />
              </div>

              <div>
                <Label>Medicamento 1 <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.drug1}
                  onChange={(e) => handleInputChange('drug1', e.target.value)}
                  placeholder="Ej: Warfarina"
                />
              </div>

              <div>
                <Label>Medicamento 2 <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.drug2}
                  onChange={(e) => handleInputChange('drug2', e.target.value)}
                  placeholder="Ej: Aspirina"
                />
              </div>

              <div>
                <Label>Severidad <span className="text-red-500">*</span></Label>
                <Select value={formData.severity} onValueChange={(value) => handleInputChange('severity', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span>Crítico</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="warning">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span>Advertencia</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="info">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>Información</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activa</SelectItem>
                    <SelectItem value="inactive">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label>Descripción de la interacción <span className="text-red-500">*</span></Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describa el mecanismo y efectos de la interacción"
                  rows={3}
                />
              </div>

              <div className="col-span-2">
                <Label>Recomendación clínica</Label>
                <Textarea
                  value={formData.recommendation}
                  onChange={(e) => handleInputChange('recommendation', e.target.value)}
                  placeholder="Indique las recomendaciones de manejo clínico"
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-2">
              <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Información importante</p>
                <p className="text-sm text-blue-700 mt-1">
                  Esta interacción se utilizará en el sistema de alertas clínicas (CDS) para detectar automáticamente posibles interacciones durante la prescripción.
                </p>
              </div>
            </div>
          </div>

          {hasChanges && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  Hay cambios sin guardar. Recuerde guardar antes de cerrar.
                </p>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Guardar cambios
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Componente auxiliar: Diálogo de nueva interacción
function NewInteractionDialog({
  open,
  onOpenChange,
  onAdd,
  existingInteractions
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (interaction: typeof mockInteractions[0]) => void;
  existingInteractions: typeof mockInteractions;
}) {
  const [formData, setFormData] = useState({
    drug1: '',
    drug2: '',
    severity: 'warning' as 'critical' | 'warning' | 'info',
    description: '',
    recommendation: '',
    status: 'active'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (!formData.drug1.trim() || !formData.drug2.trim()) {
      toast.error('Error de validación', {
        description: 'Ambos medicamentos son obligatorios',
      });
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Error de validación', {
        description: 'La descripción de la interacción es obligatoria',
      });
      return;
    }

    const newId = `INT-${(existingInteractions.length + 1).toString().padStart(3, '0')}`;
    const newInteraction = {
      id: newId,
      ...formData
    };

    onAdd(newInteraction);
    setFormData({
      drug1: '',
      drug2: '',
      severity: 'warning',
      description: '',
      recommendation: '',
      status: 'active'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Nueva Interacción Medicamentosa
          </DialogTitle>
          <DialogDescription>
            Agregue una nueva interacción farmacológica al catálogo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="pb-2 border-b">
              <h3 className="font-medium text-gray-900">Información de la interacción</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Medicamento 1 <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.drug1}
                  onChange={(e) => handleInputChange('drug1', e.target.value)}
                  placeholder="Ej: Warfarina"
                />
              </div>

              <div>
                <Label>Medicamento 2 <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.drug2}
                  onChange={(e) => handleInputChange('drug2', e.target.value)}
                  placeholder="Ej: Aspirina"
                />
              </div>

              <div>
                <Label>Severidad <span className="text-red-500">*</span></Label>
                <Select value={formData.severity} onValueChange={(value) => handleInputChange('severity', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span>Crítico - Evitar combinación</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="warning">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span>Advertencia - Monitoreo requerido</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="info">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>Información - Considerar alternativas</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activa</SelectItem>
                    <SelectItem value="inactive">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label>Descripción de la interacción <span className="text-red-500">*</span></Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describa el mecanismo farmacológico y los efectos clínicos de la interacción"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Incluya el mecanismo de la interacción y sus consecuencias clínicas
                </p>
              </div>

              <div className="col-span-2">
                <Label>Recomendación clínica</Label>
                <Textarea
                  value={formData.recommendation}
                  onChange={(e) => handleInputChange('recommendation', e.target.value)}
                  placeholder="Indique las recomendaciones de manejo, ajustes de dosis o monitoreo necesario"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Proporcione guías claras sobre cómo manejar esta interacción en la práctica clínica
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">Integración con sistema CDS</p>
                <p className="text-sm text-orange-700 mt-1">
                  Esta interacción será utilizada por el sistema de soporte a decisiones clínicas (CDS) para generar alertas automáticas cuando se prescriban estos medicamentos en combinación.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => {
            setFormData({
              drug1: '',
              drug2: '',
              severity: 'warning',
              description: '',
              recommendation: '',
              status: 'active'
            });
            onOpenChange(false);
          }}>
            Cancelar
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar interacción
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// PÁGINA 6: TIPOS DE ALERTAS
export function TiposAlertasCatalogo() {
  const [alertTypes, setAlertTypes] = useState(mockAlertTypes);
  const [selectedAlertType, setSelectedAlertType] = useState<typeof mockAlertTypes[0] | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

  const handleDoubleClick = (alertType: typeof mockAlertTypes[0]) => {
    setSelectedAlertType(alertType);
    setIsEditPanelOpen(true);
  };

  const handleEditAlertType = (alertType: typeof mockAlertTypes[0]) => {
    setSelectedAlertType(alertType);
    setIsEditPanelOpen(true);
  };

  const getSeverityBadge = (severity: string) => {
    const config = {
      critical: { label: "Crítico", className: "bg-red-100 text-red-700 border-red-300" },
      warning: { label: "Advertencia", className: "bg-orange-100 text-orange-700 border-orange-300" },
      info: { label: "Información", className: "bg-blue-100 text-blue-700 border-blue-300" }
    };
    return config[severity as keyof typeof config] || config.info;
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-500 to-amber-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <ListChecks className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white">Tipos de Alertas</h1>
                <p className="text-red-100 text-sm">Configuración de tipos de alertas clínicas del sistema</p>
              </div>
            </div>
            <Button className="bg-white text-red-600 hover:bg-red-50">
              <Plus className="w-5 h-5 mr-2" />
              Nuevo tipo de alerta
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Tipos de Alertas Registrados</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {alertTypes.length} tipo{alertTypes.length !== 1 ? 's' : ''} de alerta • Doble clic para editar
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Severidad</TableHead>
                <TableHead>Auto-disparo</TableHead>
                <TableHead>Requiere justificación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertTypes.map((alert) => {
                const severityBadge = getSeverityBadge(alert.severity);
                return (
                  <TableRow 
                    key={alert.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onDoubleClick={() => handleDoubleClick(alert)}
                  >
                    <TableCell className="font-mono font-semibold">{alert.code}</TableCell>
                    <TableCell className="font-medium">{alert.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                        {alert.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={severityBadge.className}>
                        {severityBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {alert.autoTrigger ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      {alert.requiresJustification ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEditAlertType(alert)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Panel de edición */}
      {selectedAlertType && (
        <AlertTypeEditPanel
          alertType={selectedAlertType}
          open={isEditPanelOpen}
          onOpenChange={setIsEditPanelOpen}
          onSave={(updatedAlertType) => {
            setAlertTypes(alertTypes.map(a => 
              a.id === updatedAlertType.id ? updatedAlertType : a
            ));
            setIsEditPanelOpen(false);
            toast.success('Tipo de alerta actualizado', {
              description: `${updatedAlertType.name} ha sido actualizado correctamente`,
            });
          }}
        />
      )}
    </div>
  );
}

// Componente auxiliar: Panel de edición de tipo de alerta
function AlertTypeEditPanel({
  alertType,
  open,
  onOpenChange,
  onSave
}: {
  alertType: typeof mockAlertTypes[0];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (alertType: typeof mockAlertTypes[0]) => void;
}) {
  const [formData, setFormData] = useState(alertType);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Error de validación', {
        description: 'El código y nombre son obligatorios',
      });
      return;
    }
    onSave(formData);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('¿Desea descartar los cambios realizados?')) {
        setFormData(alertType);
        setHasChanges(false);
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-red-600" />
            Editar Tipo de Alerta
          </SheetTitle>
          <SheetDescription>
            Modifique la configuración del tipo de alerta clínica
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-4">
            <div className="pb-2 border-b">
              <h3 className="font-medium text-gray-900">Información básica</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>ID del tipo de alerta</Label>
                <Input value={formData.id} disabled className="bg-gray-50 font-mono" />
              </div>

              <div>
                <Label>Código <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  placeholder="Ej: INTER-DRUG"
                  className="font-mono"
                />
              </div>

              <div>
                <Label>Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activa</SelectItem>
                    <SelectItem value="inactive">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label>Nombre <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Interacción medicamentosa"
                />
              </div>

              <div>
                <Label>Categoría</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Farmacológica">Farmacológica</SelectItem>
                    <SelectItem value="Seguridad">Seguridad</SelectItem>
                    <SelectItem value="Dosificación">Dosificación</SelectItem>
                    <SelectItem value="Contraindicación">Contraindicación</SelectItem>
                    <SelectItem value="Alergia">Alergia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Severidad</Label>
                <Select value={formData.severity} onValueChange={(value) => handleInputChange('severity', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Crítico</SelectItem>
                    <SelectItem value="warning">Advertencia</SelectItem>
                    <SelectItem value="info">Información</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="pb-2 border-b">
              <h3 className="font-medium text-gray-900">Configuración de comportamiento</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <Label>Auto-disparo automático</Label>
                  <p className="text-sm text-gray-600">
                    La alerta se dispara automáticamente cuando se detecta la condición
                  </p>
                </div>
                <Switch
                  checked={formData.autoTrigger}
                  onCheckedChange={(checked) => handleInputChange('autoTrigger', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <Label>Requiere justificación médica</Label>
                  <p className="text-sm text-gray-600">
                    El médico debe justificar su decisión si continúa con la acción
                  </p>
                </div>
                <Switch
                  checked={formData.requiresJustification}
                  onCheckedChange={(checked) => handleInputChange('requiresJustification', checked)}
                />
              </div>
            </div>
          </div>

          {hasChanges && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  Hay cambios sin guardar. Recuerde guardar antes de cerrar.
                </p>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Guardar cambios
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// PÁGINA 7: PAÍSES
export function PaisesPage() {
  const [countries, setCountries] = useState(mockCountries);
  const [selectedCountry, setSelectedCountry] = useState<typeof mockCountries[0] | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  const handleAddCountry = (newCountry: typeof mockCountries[0]) => {
    setCountries([...countries, newCountry]);
    setIsNewDialogOpen(false);
    toast.success('País agregado', {
      description: `${newCountry.name} ha sido agregado al catálogo`,
    });
  };

  const handleDoubleClick = (country: typeof mockCountries[0]) => {
    setSelectedCountry(country);
    setIsEditPanelOpen(true);
  };

  const handleEditCountry = (country: typeof mockCountries[0]) => {
    setSelectedCountry(country);
    setIsEditPanelOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white">Catálogo de Países</h1>
                <p className="text-teal-100 text-sm">Países y regiones del sistema</p>
              </div>
            </div>
            <Button onClick={() => setIsNewDialogOpen(true)} className="bg-white text-teal-600 hover:bg-teal-50">
              <Plus className="w-5 h-5 mr-2" />
              Nuevo país
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Países Registrados</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {countries.length} país{countries.length !== 1 ? 'es' : ''} • Doble clic para editar
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Región</TableHead>
                <TableHead>Código telefónico</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countries.map((country) => (
                <TableRow 
                  key={country.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onDoubleClick={() => handleDoubleClick(country)}
                >
                  <TableCell className="font-mono font-semibold">{country.code}</TableCell>
                  <TableCell className="font-medium">{country.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                      {country.region}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">{country.phoneCode}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      Activo
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditCountry(country)}>
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

      {/* Panel de edición */}
      {selectedCountry && (
        <CountryEditPanel
          country={selectedCountry}
          open={isEditPanelOpen}
          onOpenChange={setIsEditPanelOpen}
          onSave={(updatedCountry) => {
            setCountries(countries.map(c => 
              c.id === updatedCountry.id ? updatedCountry : c
            ));
            setIsEditPanelOpen(false);
            toast.success('País actualizado', {
              description: `${updatedCountry.name} ha sido actualizado correctamente`,
            });
          }}
        />
      )}

      {/* Diálogo de nuevo país */}
      <NewCountryDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onAdd={handleAddCountry}
        existingCountries={countries}
      />
    </div>
  );
}

// Componente auxiliar: Panel de edición de país
function CountryEditPanel({
  country,
  open,
  onOpenChange,
  onSave
}: {
  country: typeof mockCountries[0];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (country: typeof mockCountries[0]) => void;
}) {
  const [formData, setFormData] = useState(country);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Error de validación', {
        description: 'El código y nombre son obligatorios',
      });
      return;
    }
    onSave(formData);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm('¿Desea descartar los cambios realizados?')) {
        setFormData(country);
        setHasChanges(false);
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-600" />
            Editar País
          </SheetTitle>
          <SheetDescription>
            Modifique la información del país en el sistema
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-4">
            <div className="pb-2 border-b">
              <h3 className="font-medium text-gray-900">Información del país</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>ID del país</Label>
                <Input value={formData.id} disabled className="bg-gray-50 font-mono" />
              </div>

              <div>
                <Label>Código ISO <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  placeholder="Ej: MX"
                  className="font-mono"
                  maxLength={2}
                />
              </div>

              <div>
                <Label>Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label>Nombre <span className="text-red-500">*</span></Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: México"
                />
              </div>

              <div>
                <Label>Región</Label>
                <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="América Latina">América Latina</SelectItem>
                    <SelectItem value="América del Norte">América del Norte</SelectItem>
                    <SelectItem value="Europa">Europa</SelectItem>
                    <SelectItem value="Asia">Asia</SelectItem>
                    <SelectItem value="África">África</SelectItem>
                    <SelectItem value="Oceanía">Oceanía</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Código telefónico</Label>
                <Input
                  value={formData.phoneCode}
                  onChange={(e) => handleInputChange('phoneCode', e.target.value)}
                  placeholder="Ej: +52"
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          {hasChanges && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  Hay cambios sin guardar. Recuerde guardar antes de cerrar.
                </p>
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Guardar cambios
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Componente auxiliar: Diálogo de nuevo país
function NewCountryDialog({
  open,
  onOpenChange,
  onAdd,
  existingCountries
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (country: typeof mockCountries[0]) => void;
  existingCountries: typeof mockCountries;
}) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    region: 'América Latina',
    phoneCode: '',
    status: 'active'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    // Validaciones
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Error de validación', {
        description: 'El código ISO y el nombre son obligatorios',
      });
      return;
    }

    if (formData.code.length !== 2) {
      toast.error('Error de validación', {
        description: 'El código ISO debe tener exactamente 2 caracteres',
      });
      return;
    }

    // Verificar si el código ya existe
    const codeExists = existingCountries.some(c => c.code.toUpperCase() === formData.code.toUpperCase());
    if (codeExists) {
      toast.error('Error de validación', {
        description: `El código ISO "${formData.code}" ya está registrado`,
      });
      return;
    }

    // Generar ID único
    const newId = `COUNTRY-${(existingCountries.length + 1).toString().padStart(3, '0')}`;
    
    const newCountry = {
      id: newId,
      ...formData,
      code: formData.code.toUpperCase()
    };

    onAdd(newCountry);
    
    // Limpiar formulario
    setFormData({
      code: '',
      name: '',
      region: 'América Latina',
      phoneCode: '',
      status: 'active'
    });
  };

  const handleCancel = () => {
    setFormData({
      code: '',
      name: '',
      region: 'América Latina',
      phoneCode: '',
      status: 'active'
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-600" />
            Nuevo País
          </DialogTitle>
          <DialogDescription>
            Agregue un nuevo país al catálogo del sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="pb-2 border-b">
              <h3 className="font-medium text-gray-900">Información del país</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-country-code">
                  Código ISO <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="new-country-code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  placeholder="Ej: MX"
                  className="font-mono"
                  maxLength={2}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Código ISO 3166-1 alpha-2 (2 letras)
                </p>
              </div>

              <div>
                <Label htmlFor="new-country-status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger id="new-country-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="new-country-name">
                  Nombre del país <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="new-country-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: México"
                />
              </div>

              <div>
                <Label htmlFor="new-country-region">
                  Región geográfica
                </Label>
                <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                  <SelectTrigger id="new-country-region">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="América Latina">América Latina</SelectItem>
                    <SelectItem value="América del Norte">América del Norte</SelectItem>
                    <SelectItem value="Europa">Europa</SelectItem>
                    <SelectItem value="Asia">Asia</SelectItem>
                    <SelectItem value="África">África</SelectItem>
                    <SelectItem value="Oceanía">Oceanía</SelectItem>
                    <SelectItem value="Medio Oriente">Medio Oriente</SelectItem>
                    <SelectItem value="Caribe">Caribe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="new-country-phone">
                  Código telefónico
                </Label>
                <Input
                  id="new-country-phone"
                  value={formData.phoneCode}
                  onChange={(e) => handleInputChange('phoneCode', e.target.value)}
                  placeholder="Ej: +52"
                  className="font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Incluir el símbolo +
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-2">
              <Globe className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Estándar ISO 3166-1</p>
                <p className="text-sm text-blue-700 mt-1">
                  Los códigos de país siguen el estándar internacional ISO 3166-1 alpha-2. Utilice códigos oficiales de dos letras mayúsculas.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar país
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
