import { useState, useEffect } from "react";
import { PrescriptionPage } from "../components/PrescriptionPage";
import { DraftPreviewPanel } from "../components/DraftPreviewPanel";
import { EmittedPrescriptionPanel } from "../components/EmittedPrescriptionPanel";
import { UniversalPrescriptionPanel } from "../components/UniversalPrescriptionPanel";
import { DispensationManagementDialog, type DispensationRecord as DispensationDialogRecord } from "../components/DispensationManagementDialog";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { TablePagination } from "../components/TablePagination";
import { ExportButtons } from "../components/ExportButtons";
import { usePagination } from "../utils/usePagination";
import { normalizedIncludes } from "../utils/searchUtils";
import { DraftsAPI } from "../utils/draftsStore";
import { EmittedPrescriptionsAPI, type DispensationRecord } from "../utils/emittedPrescriptionsStore";
import { printPrescriptionPDF, downloadPrescriptionPDF } from "../utils/pdfGenerator";
import { toast } from "sonner@2.0.3";
import { 
  FileEdit, 
  Search, 
  Calendar, 
  User, 
  Pill, 
  Clock, 
  Edit3, 
  Copy, 
  Trash2, 
  Filter,
  FileText,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  Eye,
  FileCheck,
  Printer,
  Download,
  Ban,
  FilterX,
  SearchX,
  BarChart3,
  Package
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
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

interface PatientData {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  idType: string;
  idNumber: string;
  birthDate: string;
  age: number;
  gender: "M" | "F";
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  insuranceProvider: string;
  insuranceNumber: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  weight: string;
  height: string;
  bmi: string;
  occupation: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  clinicalNotes: string;
}

interface NuevaRecetaPageProps {
  draftId?: string;
  onBack?: () => void;
  onNavigateToDrafts?: () => void;
  onNavigateToEmitted?: () => void;
  patientData?: PatientData;
}

export function NuevaRecetaPage({ draftId, onBack, onNavigateToDrafts, onNavigateToEmitted, patientData }: NuevaRecetaPageProps) {
  return <PrescriptionPage draftId={draftId} onBack={onBack} onNavigateToDrafts={onNavigateToDrafts} onNavigateToEmitted={onNavigateToEmitted} patientData={patientData} />;
}

// Datos mock de borradores
const mockDrafts = [
  {
    id: "1",
    prescriptionNumber: "RX-2025-009847",
    patientName: "María Elena González Rodríguez",
    patientId: "CC-52.841.963",
    createdDate: "27/09/2025",
    lastModified: "27/09/2025 10:32",
    medicinesCount: 3,
    status: "draft",
    age: 45,
    gender: "F"
  },
  {
    id: "2",
    prescriptionNumber: "RX-2025-009846",
    patientName: "Juan Carlos Martínez López",
    patientId: "CC-43.729.541",
    createdDate: "26/09/2025",
    lastModified: "27/09/2025 09:15",
    medicinesCount: 2,
    status: "draft",
    age: 62,
    gender: "M"
  },
  {
    id: "3",
    prescriptionNumber: "RX-2025-009845",
    patientName: "Ana Patricia Rojas Fernández",
    patientId: "CC-38.615.892",
    createdDate: "26/09/2025",
    lastModified: "26/09/2025 16:45",
    medicinesCount: 5,
    status: "draft",
    age: 38,
    gender: "F"
  },
  {
    id: "4",
    prescriptionNumber: "RX-2025-009844",
    patientName: "Roberto José Sánchez Mora",
    patientId: "CC-51.428.967",
    createdDate: "25/09/2025",
    lastModified: "25/09/2025 14:20",
    medicinesCount: 1,
    status: "draft",
    age: 51,
    gender: "M"
  },
  {
    id: "5",
    prescriptionNumber: "RX-2025-009843",
    patientName: "Laura Sofía Díaz Ramírez",
    patientId: "CC-29.847.563",
    createdDate: "25/09/2025",
    lastModified: "25/09/2025 11:30",
    medicinesCount: 4,
    status: "draft",
    age: 29,
    gender: "F"
  }
];

interface BorradoresPageProps {
  onEditDraft?: (draftId: string) => void;
}

export function BorradoresPage({ onEditDraft }: BorradoresPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [drafts, setDrafts] = useState(mockDrafts);
  const [selectedDraft, setSelectedDraft] = useState<typeof mockDrafts[0] | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicatedDraftId, setDuplicatedDraftId] = useState<string | null>(null);
  const [highlightedDraftId, setHighlightedDraftId] = useState<string | null>(null);

  // Cargar borradores desde el API al montar el componente
  useEffect(() => {
    loadDrafts();
  }, []);

  // Función para cargar borradores desde el API
  const loadDrafts = () => {
    const allDrafts = DraftsAPI.getAllDrafts();
    // Convertir a formato esperado por la UI
    const formattedDrafts = allDrafts.map(({ id, data }) => ({
      id: id,
      prescriptionNumber: data.prescription.prescriptionNumber,
      patientName: `${data.prescription.patientName} ${data.prescription.patientFirstLastName} ${data.prescription.patientSecondLastName}`,
      patientId: data.prescription.patientId,
      createdDate: data.prescription.issueDate,
      lastModified: `${data.prescription.issueDate} ${data.prescription.issueTime}`,
      medicinesCount: data.medicines.length,
      status: data.prescription.status,
      age: data.prescription.patientAge,
      gender: data.prescription.patientGender === "Masculino" ? "M" : "F",
      // NUEVO: Incluir los medicamentos reales del borrador
      medicines: data.medicines.map(med => ({
        name: med.name,
        dose: med.dose,
        frequency: med.frequency,
        duration: med.duration
      }))
    }));
    setDrafts(formattedDrafts);
  };

  // Filtrar borradores
  const filteredDrafts = drafts.filter(draft => {
    const matchesSearch = 
      normalizedIncludes(draft.patientName, searchTerm) ||
      normalizedIncludes(draft.prescriptionNumber, searchTerm) ||
      normalizedIncludes(draft.patientId, searchTerm);
    
    return matchesSearch;
  });

  const handleDoubleClick = (draft: typeof mockDrafts[0]) => {
    setSelectedDraft(draft);
    setIsPreviewOpen(true);
  };

  const handleEdit = (id: string) => {
    if (onEditDraft) {
      onEditDraft(id);
    }
  };

  // Función para generar nuevo número de receta
  const generateNewPrescriptionNumber = () => {
    const currentYear = new Date().getFullYear();
    const maxNumber = Math.max(
      ...drafts.map(d => {
        const match = d.prescriptionNumber.match(/RX-(\d{4})-(\d+)/);
        return match ? parseInt(match[2]) : 0;
      })
    );
    const newNumber = (maxNumber + 1).toString().padStart(6, '0');
    return `RX-${currentYear}-${newNumber}`;
  };

  // Función para duplicar borrador
  const handleDuplicate = (id: string) => {
    // Obtener el borrador original del API
    const originalDraftData = DraftsAPI.getDraft(id);
    if (!originalDraftData) return;

    // Generar nuevo ID y número de receta
    const newId = DraftsAPI.generateDraftId();
    const newPrescriptionNumber = generateNewPrescriptionNumber();

    // Crear nuevo borrador duplicado con la data del API
    const duplicatedDraftData = {
      prescription: {
        ...originalDraftData.prescription,
        prescriptionNumber: newPrescriptionNumber,
        issueDate: new Date().toLocaleDateString('es-ES'),
        issueTime: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        status: "draft" as const
      },
      medicines: [...originalDraftData.medicines] // Copiar medicamentos
    };

    // Guardar en el API
    DraftsAPI.saveDraft(newId, duplicatedDraftData);

    // Recargar la lista desde el API
    loadDrafts();
    
    // Guardar el ID del borrador duplicado para el diálogo
    setDuplicatedDraftId(newId);
    
    // Resaltar el borrador duplicado
    setHighlightedDraftId(newId);
    setTimeout(() => setHighlightedDraftId(null), 5000);
    
    // Cerrar el panel de vista previa si está abierto
    setIsPreviewOpen(false);
    
    // Mostrar diálogo de confirmación
    setShowDuplicateDialog(true);

    // Mostrar toast de éxito con información detallada
    toast.success('Borrador duplicado exitosamente', {
      description: (
        <div className="space-y-1">
          <p className="font-medium">Nuevo borrador: {newPrescriptionNumber}</p>
          <p className="text-xs">Original: {originalDraftData.prescription.prescriptionNumber}</p>
          <p className="text-xs">Paciente: {originalDraftData.prescription.patientName}</p>
          <p className="text-xs">{originalDraftData.medicines.length} medicamento(s) copiado(s)</p>
        </div>
      ),
      duration: 5000,
    });
  };

  const handleDelete = (id: string) => {
    // Eliminar del API
    const deleted = DraftsAPI.deleteDraft(id);
    
    if (deleted) {
      // Actualizar la lista local
      setDrafts(prevDrafts => prevDrafts.filter(d => d.id !== id));
      toast.success('Borrador eliminado', {
        description: 'El borrador ha sido eliminado correctamente.',
        duration: 3000,
      });
    } else {
      toast.error('Error al eliminar', {
        description: 'No se pudo eliminar el borrador.',
        duration: 3000,
      });
    }
  };

  const handleView = (draft: typeof mockDrafts[0]) => {
    setSelectedDraft(draft);
    setIsPreviewOpen(true);
  };

  // Manejar la acción después de duplicar
  const handleEditDuplicated = () => {
    if (duplicatedDraftId && onEditDraft) {
      setShowDuplicateDialog(false);
      onEditDraft(duplicatedDraftId);
    }
  };

  const handleStayInList = () => {
    setShowDuplicateDialog(false);
    setDuplicatedDraftId(null);
  };

  // Obtener información del borrador duplicado para mostrar en el diálogo
  const duplicatedDraft = duplicatedDraftId ? drafts.find(d => d.id === duplicatedDraftId) : null;

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative h-40 rounded-lg overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdW1lbnRzJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3NTkyNjgwNDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Borradores de prescripciones"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-orange-500/60 flex items-center px-8">
          <div>
            <h2 className="text-white text-2xl mb-1">Mis Borradores</h2>
            <p className="text-white/90">Prescripciones guardadas pendientes de finalizar</p>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Borradores</p>
                <p className="text-2xl font-semibold text-gray-900">{drafts.length}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileEdit className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoy</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {drafts.filter(d => d.createdDate === "27/09/2025").length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pacientes Únicos</p>
                <p className="text-2xl font-semibold text-gray-900">{drafts.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Medicamentos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {drafts.reduce((sum, d) => sum + d.medicinesCount, 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Pill className="w-6 h-6 text-green-600" />
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
                placeholder="Buscar por paciente, número de receta o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filtrar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los borradores</SelectItem>
                  <SelectItem value="today">Creados hoy</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de borradores */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>Borradores de Prescripciones</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredDrafts.length} borrador{filteredDrafts.length !== 1 ? 'es' : ''} encontrado{filteredDrafts.length !== 1 ? 's' : ''} • Doble clic para vista rápida
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredDrafts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <FileEdit className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg text-gray-900 mb-2">No hay borradores</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? "No se encontraron borradores que coincidan con tu búsqueda."
                  : "No tienes prescripciones guardadas como borrador."
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número de Receta</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Edad/Sexo</TableHead>
                  <TableHead>Medicamentos</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead>Última Modificación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrafts.map((draft) => (
                  <TableRow 
                    key={draft.id} 
                    className={`hover:bg-orange-50/50 cursor-pointer transition-all ${
                      highlightedDraftId === draft.id 
                        ? 'bg-green-100 border-l-4 border-l-green-500 animate-pulse' 
                        : ''
                    }`}
                    onDoubleClick={() => handleDoubleClick(draft)}
                    title="Doble clic para ver detalles"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className={`w-4 h-4 ${highlightedDraftId === draft.id ? 'text-green-600' : 'text-orange-600'}`} />
                        <div className="flex flex-col">
                          <span className="font-medium">{draft.prescriptionNumber}</span>
                          {highlightedDraftId === draft.id && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 w-fit text-xs mt-1">
                              <Copy className="w-3 h-3 mr-1" />
                              Recién duplicado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{draft.patientName}</p>
                        <p className="text-xs text-gray-500">{draft.patientId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{draft.age} años / {draft.gender}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Pill className="w-4 h-4 text-primary" />
                        <span>{draft.medicinesCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{draft.createdDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{draft.lastModified}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Borrador
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(draft.id)}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Continuar editando
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleView(draft)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(draft.id)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicar borrador
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(draft.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar borrador
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Información sobre borradores</h4>
              <p className="text-sm text-blue-800">
                Los borradores se guardan automáticamente cada vez que realiza cambios. Haz doble clic en cualquier fila para ver detalles rápidos, o usa "Continuar editando" para edición completa. Los borradores no son válidos para dispensación hasta que sean finalizados y firmados digitalmente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de vista previa */}
      <DraftPreviewPanel
        draft={selectedDraft}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />

      {/* Diálogo de confirmación después de duplicar */}
      <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <AlertDialogTitle>Borrador duplicado exitosamente</AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription>
              <div className="space-y-4">
                <p>Se ha creado una copia del borrador con un nuevo número de receta. El borrador duplicado aparece ahora al inicio de la lista.</p>
                
                {duplicatedDraft && (
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-orange-600" />
                      <p className="font-medium text-orange-900">Nuevo borrador creado</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-orange-800">
                      <div>
                        <span className="font-medium">Número:</span> {duplicatedDraft.prescriptionNumber}
                      </div>
                      <div>
                        <span className="font-medium">Paciente:</span> {duplicatedDraft.patientName}
                      </div>
                      <div>
                        <span className="font-medium">Medicamentos:</span> {duplicatedDraft.medicinesCount}
                      </div>
                      <div>
                        <span className="font-medium">Creado:</span> {duplicatedDraft.createdDate}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">¿Qué deseas hacer?</p>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <Edit3 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                      <span><strong>Continuar editando:</strong> Abre el borrador duplicado para realizar modificaciones inmediatas.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                      <span><strong>Permanecer en la lista:</strong> Quédate en la vista de borradores para revisar o duplicar otros.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleStayInList}>
              Permanecer en la lista
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleEditDuplicated}
              className="bg-primary hover:bg-primary/90"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Continuar editando
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Datos mock de recetas emitidas
// Nota: Fecha actual del sistema es 19/11/2025
const mockEmittedPrescriptions = [
  {
    id: "101",
    prescriptionNumber: "RX-2025-009842",
    patientName: "Carlos Andrés Pérez Gutiérrez",
    patientId: "CC-41.523.789",
    emittedDate: "01/10/2025",
    emittedTime: "09:45 a.m.",
    validUntil: "15/10/2025", // VENCIDA - debería mostrar estado "Vencida"
    medicinesCount: 3,
    dispensationStatus: "emitted" as const,
    age: 52,
    gender: "M" as const,
    doctorName: "Dr. Carlos Andrés Martínez López",
    doctorId: "DOC-001",
    qrCode: "QR-RX-2025-009842",
    token: "VRF-2025-9842-X8K4"
  },
  {
    id: "102",
    prescriptionNumber: "RX-2025-009841",
    patientName: "Sandra Milena Torres Vargas",
    patientId: "CC-52.367.941",
    emittedDate: "01/10/2025",
    emittedTime: "08:30 a.m.",
    validUntil: "15/10/2025", // VENCIDA - pero parcialmente dispensada, debería mostrar "Vencida"
    medicinesCount: 2,
    dispensationStatus: "partially_dispensed" as const,
    age: 38,
    gender: "F" as const,
    doctorName: "Dra. María Elena Rodríguez Silva",
    doctorId: "DOC-002",
    qrCode: "QR-RX-2025-009841",
    token: "VRF-2025-9841-M2P5"
  },
  {
    id: "103",
    prescriptionNumber: "RX-2025-009840",
    patientName: "Diego Fernando Ramírez Castro",
    patientId: "CC-38.941.652",
    emittedDate: "30/09/2025",
    emittedTime: "04:15 p.m.",
    validUntil: "14/10/2025", // VENCIDA - pero completamente dispensada, mantiene estado "Completamente dispensada"
    medicinesCount: 5,
    dispensationStatus: "fully_dispensed" as const,
    age: 65,
    gender: "M" as const,
    doctorName: "Dr. Carlos Andrés Martínez López",
    doctorId: "DOC-001",
    qrCode: "QR-RX-2025-009840",
    token: "VRF-2025-9840-N7R3"
  },
  {
    id: "104",
    prescriptionNumber: "RX-2025-009839",
    patientName: "Patricia Elena Gómez Suárez",
    patientId: "CC-45.789.123",
    emittedDate: "30/09/2025",
    emittedTime: "02:20 p.m.",
    validUntil: "14/10/2025", // VENCIDA - debería mostrar estado "Vencida"
    medicinesCount: 1,
    dispensationStatus: "emitted" as const,
    age: 28,
    gender: "F" as const,
    doctorName: "Dr. Jorge Enrique Salazar Ramírez",
    doctorId: "DOC-003",
    qrCode: "QR-RX-2025-009839",
    token: "VRF-2025-9839-Q1W9"
  },
  {
    id: "105",
    prescriptionNumber: "RX-2025-009838",
    patientName: "Javier Alejandro Ruiz Moreno",
    patientId: "CC-50.124.897",
    emittedDate: "05/11/2025",
    emittedTime: "11:10 a.m.",
    validUntil: "19/11/2025", // VIGENTE - último día de validez
    medicinesCount: 4,
    dispensationStatus: "partially_dispensed" as const,
    age: 47,
    gender: "M" as const,
    doctorName: "Dr. Carlos Andrés Martínez López",
    doctorId: "DOC-001",
    qrCode: "QR-RX-2025-009838",
    token: "VRF-2025-9838-P5T7"
  },
  {
    id: "106",
    prescriptionNumber: "RX-2025-009837",
    patientName: "Andrea Carolina Ospina León",
    patientId: "CC-39.654.321",
    emittedDate: "28/09/2025",
    emittedTime: "10:00 a.m.",
    validUntil: "12/10/2025", // VENCIDA - pero anulada, mantiene estado "Anulada"
    medicinesCount: 2,
    dispensationStatus: "cancelled" as const,
    age: 33,
    gender: "F" as const,
    doctorName: "Dra. María Elena Rodríguez Silva",
    doctorId: "DOC-002",
    qrCode: "QR-RX-2025-009837",
    token: "VRF-2025-9837-H3L8"
  },
  {
    id: "107",
    prescriptionNumber: "RX-2025-009843",
    patientName: "Roberto Luis Fernández Mora",
    patientId: "CC-47.258.963",
    emittedDate: "10/11/2025",
    emittedTime: "03:30 p.m.",
    validUntil: "24/11/2025", // VIGENTE
    medicinesCount: 2,
    dispensationStatus: "fully_dispensed" as const, // CORREGIDO: Todos los medicamentos están dispensados
    age: 41,
    gender: "M" as const,
    doctorName: "Dr. Carlos Andrés Martínez López",
    doctorId: "DOC-001",
    qrCode: "QR-RX-2025-009843",
    token: "VRF-2025-9843-K7M2"
  },
  {
    id: "108",
    prescriptionNumber: "RX-2025-009844",
    patientName: "María Fernanda Castro Díaz",
    patientId: "CC-38.147.852",
    emittedDate: "12/11/2025",
    emittedTime: "09:15 a.m.",
    validUntil: "26/11/2025", // VIGENTE
    medicinesCount: 4,
    dispensationStatus: "emitted" as const,
    age: 35,
    gender: "F" as const,
    doctorName: "Dra. María Elena Rodríguez Silva",
    doctorId: "DOC-002",
    qrCode: "QR-RX-2025-009844",
    token: "VRF-2025-9844-P9L4"
  },
  // ========== RECETAS NUEVAS PARA PRUEBAS DE FLUJO COMPLETO ==========
  {
    id: "109",
    prescriptionNumber: "RX-2025-009850",
    patientName: "Laura Patricia Morales García",
    patientId: "CC-35.789.456",
    emittedDate: "15/11/2025",
    emittedTime: "09:15 a.m.",
    validUntil: "29/11/2025", // VIGENTE
    medicinesCount: 2,
    dispensationStatus: "emitted" as const,
    age: 29,
    gender: "F" as const,
    doctorName: "Dra. María Elena Rodríguez Silva",
    doctorId: "DOC-002",
    qrCode: "QR-RX-2025-009850",
    token: "VRF-2025-9850-A1B2"
  },
  {
    id: "110",
    prescriptionNumber: "RX-2025-009851",
    patientName: "Miguel Ángel Santos Jiménez",
    patientId: "CC-42.963.147",
    emittedDate: "16/11/2025",
    emittedTime: "02:30 p.m.",
    validUntil: "30/11/2025", // VIGENTE
    medicinesCount: 3,
    dispensationStatus: "emitted" as const,
    age: 55,
    gender: "M" as const,
    doctorName: "Dr. Carlos Andrés Martínez López",
    doctorId: "DOC-001",
    qrCode: "QR-RX-2025-009851",
    token: "VRF-2025-9851-C3D4"
  },
  {
    id: "111",
    prescriptionNumber: "RX-2025-009852",
    patientName: "Carolina Vásquez Pérez",
    patientId: "CC-38.147.258",
    emittedDate: "17/11/2025",
    emittedTime: "10:45 a.m.",
    validUntil: "01/12/2025", // VIGENTE
    medicinesCount: 3,
    dispensationStatus: "emitted" as const,
    age: 34,
    gender: "F" as const,
    doctorName: "Dr. Jorge Enrique Salazar Ramírez",
    doctorId: "DOC-003",
    qrCode: "QR-RX-2025-009852",
    token: "VRF-2025-9852-E5F6"
  },
  {
    id: "112",
    prescriptionNumber: "RX-2025-009853",
    patientName: "Andrés Felipe Gómez Castro",
    patientId: "CC-29.852.741",
    emittedDate: "18/11/2025",
    emittedTime: "04:20 p.m.",
    validUntil: "02/12/2025", // VIGENTE
    medicinesCount: 1,
    dispensationStatus: "emitted" as const,
    age: 22,
    gender: "M" as const,
    doctorName: "Dra. María Elena Rodríguez Silva",
    doctorId: "DOC-002",
    qrCode: "QR-RX-2025-009853",
    token: "VRF-2025-9853-G7H8"
  }
];

interface EmitidasPageProps {
  doctorId?: string | null;
  onClearFilter?: () => void;
}

export function EmitidasPage({ doctorId, onClearFilter }: EmitidasPageProps = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [originFilter, setOriginFilter] = useState<"all" | "manual" | "ai-assisted">("all"); // NUEVO filtro de origen
  const [prescriptions, setPrescriptions] = useState(mockEmittedPrescriptions);
  const [selectedPrescription, setSelectedPrescription] = useState<typeof mockEmittedPrescriptions[0] | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  // NUEVO: Estados para gestión de dispensación
  const [showDispensationDialog, setShowDispensationDialog] = useState(false);
  const [dispensationPrescription, setDispensationPrescription] = useState<typeof mockEmittedPrescriptions[0] | null>(null);

  // Función auxiliar para parsear fechas en formato DD/MM/YYYY
  const parseDate = (dateString: string): Date => {
    const parts = dateString.split('/');
    // Formato DD/MM/YYYY
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Los meses en JS van de 0-11
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date(dateString);
  };

  // Función para calcular el estado real de la receta considerando vencimiento
  const calculateRealStatus = (prescription: any): string => {
    // Convertir validUntil a fecha
    const validUntilDate = parseDate(prescription.validUntil);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Si la receta está vencida y no está completamente dispensada ni anulada, cambiar a "expired"
    if (validUntilDate < today && 
        prescription.dispensationStatus !== 'fully_dispensed' && 
        prescription.dispensationStatus !== 'cancelled') {
      return 'expired';
    }
    
    return prescription.dispensationStatus;
  };

  // Cargar recetas desde el API al montar el componente
  useEffect(() => {
    loadPrescriptions();
    
    // NUEVO: Escuchar evento de nueva receta emitida
    const handlePrescriptionEmitted = () => {
      console.log('Nueva receta emitida, recargando lista...');
      loadPrescriptions();
    };
    
    window.addEventListener('prescription-emitted', handlePrescriptionEmitted);
    
    return () => {
      window.removeEventListener('prescription-emitted', handlePrescriptionEmitted);
    };
  }, []);

  // Función para cargar recetas desde el API
  const loadPrescriptions = () => {
    const allPrescriptions = EmittedPrescriptionsAPI.getAllPrescriptions();
    // Convertir a formato esperado por la UI
    const formattedPrescriptions = allPrescriptions.map(({ prescriptionNumber, data }) => {
      // Calcular fecha de validez (14 días desde emisión)
      const issueDate = new Date(data.emittedAt);
      const validUntil = new Date(issueDate);
      validUntil.setDate(validUntil.getDate() + 14);
      
      return {
        id: prescriptionNumber,
        prescriptionNumber: prescriptionNumber,
        patientName: `${data.prescription.patientName} ${data.prescription.patientFirstLastName} ${data.prescription.patientSecondLastName}`,
        patientId: data.prescription.patientId,
        doctorId: data.prescription.doctorLicense,
        doctorName: data.prescription.doctorName,
        issueDate: data.prescription.issueDate,
        emittedDate: data.prescription.issueDate,
        emittedTime: data.prescription.issueTime,
        validUntil: validUntil.toLocaleDateString('es-ES'),
        dispensationStatus: data.dispensationStatus || "emitted" as const,
        medicinesCount: data.medicines.length,
        medicalCenter: data.prescription.medicalCenter,
        signatureStatus: "signed" as const,
        qrCode: data.prescription.qrCode || "",
        origin: data.origin,
        aiMetadata: data.aiMetadata,
        fullData: data // Guardar datos completos para dispensación
      };
    });
    // CORRECCIÓN: Solo usar recetas del API, sin mezclar con mocks
    setPrescriptions(formattedPrescriptions);
  };

  // Filtrar recetas
  const filteredPrescriptions = prescriptions.filter(rx => {
    const matchesSearch = 
      normalizedIncludes(rx.patientName, searchTerm) ||
      normalizedIncludes(rx.prescriptionNumber, searchTerm) ||
      normalizedIncludes(rx.patientId, searchTerm);
    
    // Calcular el estado real de la receta (considerando vencimiento)
    const realStatus = calculateRealStatus(rx);
    const matchesStatus = statusFilter === "all" || realStatus === statusFilter;
    
    const matchesDoctor = !doctorId || rx.doctorId === doctorId;
    
    // NUEVO: Filtro por origen
    const matchesOrigin = originFilter === "all" || (rx as any).origin === originFilter;
    
    return matchesSearch && matchesStatus && matchesDoctor && matchesOrigin;
  });

  // Estadísticas (usando estado real calculado)
  const stats = {
    total: prescriptions.length,
    emitted: prescriptions.filter(rx => calculateRealStatus(rx) === 'emitted').length,
    partiallyDispensed: prescriptions.filter(rx => calculateRealStatus(rx) === 'partially_dispensed').length,
    fullyDispensed: prescriptions.filter(rx => calculateRealStatus(rx) === 'fully_dispensed').length,
    cancelled: prescriptions.filter(rx => calculateRealStatus(rx) === 'cancelled').length,
    expired: prescriptions.filter(rx => calculateRealStatus(rx) === 'expired').length,
    totalMedicines: prescriptions.reduce((sum, rx) => sum + rx.medicinesCount, 0),
    // NUEVO: Estadísticas por origen
    manual: prescriptions.filter(rx => (rx as any).origin === 'manual').length,
    aiAssisted: prescriptions.filter(rx => (rx as any).origin === 'ai-assisted').length
  };

  const handleDoubleClick = (prescription: typeof mockEmittedPrescriptions[0]) => {
    setSelectedPrescription(prescription);
    setIsPreviewOpen(true);
  };

  const handleView = (prescription: typeof mockEmittedPrescriptions[0]) => {
    setSelectedPrescription(prescription);
    setIsPreviewOpen(true);
  };

  const handlePrint = (id: string) => {
    // Buscar la prescripción por ID
    const prescription = prescriptions.find(rx => rx.id === id);
    
    if (prescription) {
      // Obtener datos completos de la prescripción desde el store
      const fullPrescriptionData = EmittedPrescriptionsAPI.getPrescription(prescription.prescriptionNumber);
      
      if (fullPrescriptionData) {
        // Generar ventana de impresión
        printPrescriptionPDF(fullPrescriptionData);
        
        toast.success('Reimprimiendo receta', {
          description: `Se abrirá una nueva ventana con la receta ${prescription.prescriptionNumber} lista para imprimir`,
          duration: 3000,
        });
      } else {
        toast.error('No se pudo cargar la receta', {
          description: 'Los datos completos de la receta no están disponibles',
          duration: 3000,
        });
      }
    } else {
      toast.error('Receta no encontrada', {
        description: 'No se pudo encontrar la receta solicitada',
        duration: 3000,
      });
    }
  };

  const handleExport = (id: string) => {
    // Buscar la prescripción por ID
    const prescription = prescriptions.find(rx => rx.id === id);
    
    if (prescription) {
      // Obtener datos completos de la prescripción desde el store
      const fullPrescriptionData = EmittedPrescriptionsAPI.getPrescription(prescription.prescriptionNumber);
      
      if (fullPrescriptionData) {
        // Generar y descargar PDF automáticamente
        downloadPrescriptionPDF(fullPrescriptionData);
        
        toast.success('Exportando PDF', {
          description: `Se abrirá el diálogo de impresión. Seleccione "Guardar como PDF" para descargar la receta ${prescription.prescriptionNumber}`,
          duration: 4000,
        });
      } else {
        toast.error('No se pudo cargar la receta', {
          description: 'Los datos completos de la receta no están disponibles',
          duration: 3000,
        });
      }
    } else {
      toast.error('Receta no encontrada', {
        description: 'No se pudo encontrar la receta solicitada',
        duration: 3000,
      });
    }
  };

  const handleCancel = (id: string) => {
    toast.success('Receta anulada', {
      description: `La receta ha sido anulada correctamente.`,
      duration: 3000,
    });
  };

  // NUEVO: Abrir diálogo de gestión de dispensación
  const handleManageDispensation = (id: string) => {
    const prescription = prescriptions.find(rx => rx.id === id);
    if (prescription) {
      setDispensationPrescription(prescription);
      setShowDispensationDialog(true);
    }
  };

  // NUEVO: Confirmar actualización de dispensación
  const handleConfirmDispensation = (record: DispensationDialogRecord) => {
    if (!dispensationPrescription) return;

    const statusBefore = dispensationPrescription.dispensationStatus;

    // Crear registro para el store
    const storeRecord: DispensationRecord = {
      timestamp: record.lastUpdated,
      pharmacy: record.medicines[0]?.pharmacy || '',
      pharmacist: record.updatedBy,
      notes: record.notes,
      medicinesDispensed: record.medicines.map(med => ({
        medicineId: med.medicineId,
        quantityDispensed: med.dispensedQuantity,
        totalQuantity: med.totalQuantity
      })),
      statusBefore: statusBefore as any,
      statusAfter: record.status as any
    };

    // Actualizar en el store
    const success = EmittedPrescriptionsAPI.updateDispensationStatus(
      dispensationPrescription.prescriptionNumber,
      record.status,
      storeRecord
    );

    if (success) {
      // Recargar datos
      loadPrescriptions();
      
      toast.success('Dispensación actualizada', {
        description: `Estado actualizado exitosamente para receta ${dispensationPrescription.prescriptionNumber}`,
        duration: 4000
      });
    } else {
      toast.error('Error al actualizar', {
        description: 'No se pudo actualizar el estado de dispensación',
        duration: 3000
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      emitted: { label: "Emitida", className: "bg-blue-100 text-blue-700 border-blue-300" },
      partially_dispensed: { label: "Parcialmente dispensada", className: "bg-yellow-100 text-yellow-700 border-yellow-300" },
      fully_dispensed: { label: "Completamente dispensada", className: "bg-green-100 text-green-700 border-green-300" },
      cancelled: { label: "Anulada", className: "bg-red-100 text-red-700 border-red-300" },
      expired: { label: "Vencida", className: "bg-gray-100 text-gray-700 border-gray-300" }
    };
    return config[status] || config.emitted;
  };

  // Obtener nombre del médico filtrado
  const filteredDoctorName = doctorId 
    ? prescriptions.find(rx => rx.doctorId === doctorId)?.doctorName 
    : null;

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <FileCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-white">Recetas Emitidas</h1>
                  <p className="text-blue-100 text-sm">
                    Prescripciones firmadas digitalmente y listas para dispensación
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-blue-100 text-xs mb-1">Total de recetas</p>
                <p className="text-white font-semibold text-3xl">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emitidas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.emitted}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Parcialmente</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.partiallyDispensed}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.fullyDispensed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Anuladas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.cancelled}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencidas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.expired}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NUEVO: Estadísticas por origen */}
        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Manuales</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.manual}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <span className="text-2xl">✍️</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">IA-Asistidas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.aiAssisted}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
                <span className="text-2xl">🤖</span>
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
                placeholder="Buscar por paciente, número de receta o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Estado de dispensación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="emitted">Emitidas</SelectItem>
                  <SelectItem value="partially_dispensed">Parcialmente dispensadas</SelectItem>
                  <SelectItem value="fully_dispensed">Completamente dispensadas</SelectItem>
                  <SelectItem value="cancelled">Anuladas</SelectItem>
                  <SelectItem value="expired">Vencidas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por fecha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las fechas</SelectItem>
                  <SelectItem value="today">Hoy</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mes</SelectItem>
                </SelectContent>
              </Select>

              {/* NUEVO: Filtro por origen */}
              <Select value={originFilter} onValueChange={(value: any) => setOriginFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Origen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los orígenes</SelectItem>
                  <SelectItem value="manual">
                    <span className="flex items-center gap-2">
                      ✍️ Manual
                    </span>
                  </SelectItem>
                  <SelectItem value="ai-assisted">
                    <span className="flex items-center gap-2">
                      🤖 IA-Asistida
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badge de filtro activo por médico */}
      {doctorId && filteredDoctorName && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Filtrando por médico
                  </p>
                  <p className="text-sm text-blue-700">
                    {filteredDoctorName}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (onClearFilter) {
                    onClearFilter();
                  }
                }}
                className="bg-white hover:bg-blue-100 border-blue-300"
              >
                <FilterX className="w-4 h-4 mr-2" />
                Limpiar filtro
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de recetas emitidas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recetas Emitidas</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {filteredPrescriptions.length} receta{filteredPrescriptions.length !== 1 ? 's' : ''} encontrada{filteredPrescriptions.length !== 1 ? 's' : ''} • Doble clic para vista rápida
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPrescriptions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No se encontraron recetas</h3>
              <p className="text-sm text-gray-600">
                No hay recetas emitidas que coincidan con los filtros seleccionados.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número de Receta</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Fecha de emisión</TableHead>
                  <TableHead>Válida hasta</TableHead>
                  <TableHead className="text-center">Medicamentos</TableHead>
                  <TableHead className="text-center">Origen</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.map((rx) => {
                  const realStatus = calculateRealStatus(rx);
                  const statusBadge = getStatusBadge(realStatus);
                  return (
                    <TableRow 
                      key={rx.id} 
                      className="hover:bg-blue-50/50 cursor-pointer"
                      onDoubleClick={() => handleDoubleClick(rx)}
                      title="Doble clic para ver detalles"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <FileCheck className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{rx.prescriptionNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{rx.patientName}</p>
                          <p className="text-sm text-gray-600">{rx.patientId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{rx.emittedDate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{rx.validUntil}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {rx.medicinesCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {(rx as any).origin === 'ai-assisted' ? (
                          <Badge variant="outline" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-300">
                            <span className="mr-1">🤖</span>
                            IA Asistida
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                            Manual
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusBadge.className}>
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleView(rx)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrint(rx.id)}>
                              <Printer className="w-4 h-4 mr-2" />
                              Reimprimir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport(rx.id)}>
                              <Download className="w-4 h-4 mr-2" />
                              Exportar PDF
                            </DropdownMenuItem>
                            {(rx.dispensationStatus === 'emitted' || rx.dispensationStatus === 'partially_dispensed') && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleManageDispensation(rx.id)}
                                  className="text-blue-600 focus:text-blue-600 font-medium"
                                >
                                  <Package className="w-4 h-4 mr-2" />
                                  Gestionar dispensación
                                </DropdownMenuItem>
                              </>
                            )}
                            {rx.dispensationStatus === 'emitted' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleCancel(rx.id)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Ban className="w-4 h-4 mr-2" />
                                  Anular receta
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Información sobre recetas emitidas</h4>
              <p className="text-sm text-blue-800">
                Las recetas emitidas están firmadas digitalmente y tienen validez legal. Haz doble clic en cualquier fila para ver detalles completos. Puedes reimprimir, exportar a PDF o anular recetas según los permisos configurados. Las recetas tienen una validez de 14 días desde su emisión según normativa vigente. <strong>Las recetas que superan su fecha de vencimiento son marcadas automáticamente como "Vencidas"</strong> y no pueden ser dispensadas, excepto aquellas que ya fueron completamente dispensadas o anuladas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel de vista previa */}
      <EmittedPrescriptionPanel
        prescription={selectedPrescription}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onPrint={handlePrint}
        onExport={handleExport}
        onCancel={handleCancel}
      />

      {/* NUEVO: Diálogo de gestión de dispensación */}
      {dispensationPrescription && (dispensationPrescription as any).fullData && (
        <DispensationManagementDialog
          open={showDispensationDialog}
          onOpenChange={setShowDispensationDialog}
          prescriptionNumber={dispensationPrescription.prescriptionNumber}
          patientName={dispensationPrescription.patientName}
          emittedDate={dispensationPrescription.emittedDate}
          currentStatus={dispensationPrescription.dispensationStatus}
          medicines={(dispensationPrescription as any).fullData.medicines.map((med: any) => ({
            id: med.id,
            genericName: med.genericName,
            commercialName: med.commercialName,
            concentration: med.concentration,
            quantity: med.quantity
          }))}
          onConfirm={handleConfirmDispensation}
        />
      )}
    </div>
  );
}

export function BuscarRecetaPage() {
  // Estados para búsqueda
  const [searchMode, setSearchMode] = useState<"quick" | "advanced">("quick");
  const [quickSearch, setQuickSearch] = useState("");
  
  // Filtros avanzados
  const [prescriptionNumber, setPrescriptionNumber] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [medicineFilter, setMedicineFilter] = useState("");

  // Estados de resultados
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Combinar datos de borradores y recetas emitidas
  const allPrescriptions = [
    ...mockDrafts.map(d => ({
      ...d,
      status: "draft" as const,
      date: d.lastModified.split(' ')[0],
      time: d.lastModified.split(' ').slice(1).join(' '),
      doctorName: "Dr. Carlos Alberto Mendoza Herrera"
    })),
    ...mockEmittedPrescriptions.map(e => ({
      ...e,
      date: e.emittedDate,
      time: e.emittedTime,
      status: e.dispensationStatus
    }))
  ];

  // Función de búsqueda rápida
  const handleQuickSearch = () => {
    if (!quickSearch.trim()) {
      toast.error('Por favor ingresa un criterio de búsqueda');
      return;
    }

    const results = allPrescriptions.filter(rx => 
      normalizedIncludes(rx.patientName, quickSearch) ||
      normalizedIncludes(rx.prescriptionNumber, quickSearch) ||
      normalizedIncludes(rx.patientId, quickSearch)
    );

    setSearchResults(results);
    setHasSearched(true);

    toast.success('Búsqueda completada', {
      description: `Se encontraron ${results.length} resultado(s)`,
      duration: 3000,
    });
  };

  // Función de búsqueda avanzada
  const handleAdvancedSearch = () => {
    let results = [...allPrescriptions];

    if (prescriptionNumber) {
      results = results.filter(rx => 
        normalizedIncludes(rx.prescriptionNumber, prescriptionNumber)
      );
    }

    if (patientName) {
      results = results.filter(rx => 
        normalizedIncludes(rx.patientName, patientName)
      );
    }

    if (patientId) {
      results = results.filter(rx => 
        normalizedIncludes(rx.patientId, patientId)
      );
    }

    if (doctorName) {
      results = results.filter(rx => 
        normalizedIncludes(rx.doctorName, doctorName)
      );
    }

    if (statusFilter !== "all") {
      results = results.filter(rx => rx.status === statusFilter);
    }

    if (dateFrom) {
      // Filtro de fecha (simplificado para el ejemplo)
      results = results.filter(rx => rx.date >= dateFrom);
    }

    if (dateTo) {
      results = results.filter(rx => rx.date <= dateTo);
    }

    if (medicineFilter) {
      // Este filtro sería más complejo en producción
      results = results.filter(rx => rx.medicinesCount > 0);
    }

    setSearchResults(results);
    setHasSearched(true);

    toast.success('Búsqueda avanzada completada', {
      description: `Se encontraron ${results.length} resultado(s)`,
      duration: 3000,
    });
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setQuickSearch("");
    setPrescriptionNumber("");
    setPatientName("");
    setPatientId("");
    setDoctorName("");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setMedicineFilter("");
    setSearchResults([]);
    setHasSearched(false);
  };

  // Doble clic para ver detalles
  const handleDoubleClick = (prescription: any) => {
    setSelectedPrescription(prescription);
    setIsPreviewOpen(true);
  };

  const handleView = (prescription: any) => {
    setSelectedPrescription(prescription);
    setIsPreviewOpen(true);
  };

  // Estadísticas de búsqueda
  const searchStats = hasSearched ? {
    total: searchResults.length,
    drafts: searchResults.filter(r => r.status === 'draft').length,
    emitted: searchResults.filter(r => r.status === 'emitted').length,
    partiallyDispensed: searchResults.filter(r => r.status === 'partially_dispensed').length,
    fullyDispensed: searchResults.filter(r => r.status === 'fully_dispensed').length,
    cancelled: searchResults.filter(r => r.status === 'cancelled').length
  } : null;

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      draft: { label: "Borrador", className: "bg-orange-100 text-orange-700 border-orange-300" },
      emitted: { label: "Emitida", className: "bg-blue-100 text-blue-700 border-blue-300" },
      partially_dispensed: { label: "Parcialmente dispensada", className: "bg-yellow-100 text-yellow-700 border-yellow-300" },
      fully_dispensed: { label: "Completamente dispensada", className: "bg-green-100 text-green-700 border-green-300" },
      cancelled: { label: "Anulada", className: "bg-red-100 text-red-700 border-red-300" }
    };
    return config[status] || config.draft;
  };

  const handleExport = () => {
    toast.success('Exportando resultados', {
      description: 'Generando archivo con los resultados de búsqueda...',
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-white">Buscar Receta</h1>
                  <p className="text-purple-100 text-sm">
                    Búsqueda avanzada de prescripciones en todo el sistema
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-purple-100 text-xs mb-1">Prescripciones totales</p>
                <p className="text-white font-semibold text-3xl">{allPrescriptions.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de búsqueda */}
      <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as "quick" | "advanced")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quick">Búsqueda Rápida</TabsTrigger>
          <TabsTrigger value="advanced">Búsqueda Avanzada</TabsTrigger>
        </TabsList>

        {/* Búsqueda rápida */}
        <TabsContent value="quick">
          <Card>
            <CardHeader>
              <CardTitle>Búsqueda Rápida</CardTitle>
              <p className="text-sm text-gray-600">
                Busca por número de receta, nombre del paciente o identificación
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Ingresa número de receta, nombre del paciente o ID..."
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
                    className="pl-11 h-12"
                  />
                </div>
                <Button 
                  onClick={handleQuickSearch} 
                  className="bg-primary hover:bg-primary/90 px-8"
                  size="lg"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
                {hasSearched && (
                  <Button 
                    onClick={handleClearSearch} 
                    variant="outline"
                    size="lg"
                  >
                    <FilterX className="w-4 h-4 mr-2" />
                    Limpiar
                  </Button>
                )}
              </div>

              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-purple-900 mb-1">Consejos de búsqueda</h4>
                    <ul className="text-sm text-purple-800 space-y-1">
                      <li>• Puedes buscar por número de receta completo o parcial (ej: "RX-2025-009847")</li>
                      <li>• Ingresa el nombre completo o parcial del paciente (ej: "María González")</li>
                      <li>• Busca por número de identificación del paciente (ej: "CC-52.841.963")</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Búsqueda avanzada */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Búsqueda Avanzada</CardTitle>
              <p className="text-sm text-gray-600">
                Combina múltiples criterios para encontrar recetas específicas
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Número de Receta</label>
                    <Input
                      placeholder="RX-2025-XXXXXX"
                      value={prescriptionNumber}
                      onChange={(e) => setPrescriptionNumber(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Estado de la Receta</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="draft">Borradores</SelectItem>
                        <SelectItem value="emitted">Emitidas</SelectItem>
                        <SelectItem value="partially_dispensed">Parcialmente dispensadas</SelectItem>
                        <SelectItem value="fully_dispensed">Completamente dispensadas</SelectItem>
                        <SelectItem value="cancelled">Anuladas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Nombre del Paciente</label>
                    <Input
                      placeholder="Nombre completo del paciente"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Identificación del Paciente</label>
                    <Input
                      placeholder="CC, TI, CE, etc."
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Médico Prescriptor</label>
                    <Input
                      placeholder="Nombre del médico"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Medicamento</label>
                    <Input
                      placeholder="Nombre del medicamento"
                      value={medicineFilter}
                      onChange={(e) => setMedicineFilter(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Fecha Desde</label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Fecha Hasta</label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleAdvancedSearch} 
                    className="bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar con filtros
                  </Button>
                  <Button 
                    onClick={handleClearSearch} 
                    variant="outline"
                    size="lg"
                  >
                    <FilterX className="w-4 h-4 mr-2" />
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Estadísticas de resultados */}
      {hasSearched && searchStats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{searchStats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Borradores</p>
                <p className="text-2xl font-semibold text-gray-900">{searchStats.drafts}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Emitidas</p>
                <p className="text-2xl font-semibold text-gray-900">{searchStats.emitted}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Parciales</p>
                <p className="text-2xl font-semibold text-gray-900">{searchStats.partiallyDispensed}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Completas</p>
                <p className="text-2xl font-semibold text-gray-900">{searchStats.fullyDispensed}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Anuladas</p>
                <p className="text-2xl font-semibold text-gray-900">{searchStats.cancelled}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resultados de búsqueda */}
      {hasSearched && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resultados de Búsqueda</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {searchResults.length} receta{searchResults.length !== 1 ? 's' : ''} encontrada{searchResults.length !== 1 ? 's' : ''} • Doble clic para vista rápida
                </p>
              </div>
              {searchResults.length > 0 && (
                <Button onClick={handleExport} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar resultados
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <SearchX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
                <p className="text-sm text-gray-600 mb-4">
                  No hay recetas que coincidan con los criterios de búsqueda.
                </p>
                <Button onClick={handleClearSearch} variant="outline">
                  <FilterX className="w-4 h-4 mr-2" />
                  Limpiar búsqueda
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número de Receta</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Médico</TableHead>
                    <TableHead className="text-center">Medicamentos</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((rx) => {
                    const statusBadge = getStatusBadge(rx.status);
                    const isDraft = rx.status === 'draft';
                    return (
                      <TableRow 
                        key={rx.id} 
                        className="hover:bg-purple-50/50 cursor-pointer"
                        onDoubleClick={() => handleDoubleClick(rx)}
                        title="Doble clic para ver detalles"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {isDraft ? (
                              <FileEdit className="w-4 h-4 text-orange-600" />
                            ) : (
                              <FileCheck className="w-4 h-4 text-blue-600" />
                            )}
                            <span className="font-medium">{rx.prescriptionNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{rx.patientName}</p>
                            <p className="text-sm text-gray-600">{rx.patientId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{rx.date}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{rx.doctorName}</p>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {rx.medicinesCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusBadge.className}>
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleView(rx)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Información inicial */}
      {!hasSearched && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-900 mb-1">¿Cómo usar el buscador?</h4>
                <div className="text-sm text-purple-800 space-y-2">
                  <p>
                    <strong>Búsqueda rápida:</strong> Ideal para encontrar una receta específica cuando conoces el número, nombre del paciente o identificación.
                  </p>
                  <p>
                    <strong>Búsqueda avanzada:</strong> Combina múltiples criterios para búsquedas más específicas. Puedes filtrar por médico, estado, rango de fechas y más.
                  </p>
                  <p className="pt-2">
                    💡 <strong>Tip:</strong> Los resultados incluyen tanto borradores como recetas emitidas. Haz doble clic en cualquier resultado para ver los detalles completos.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Panel de vista previa universal */}
      <UniversalPrescriptionPanel
        prescription={selectedPrescription}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onEdit={(id) => {
          toast.info('Redirigiendo a edición...', { duration: 2000 });
          setIsPreviewOpen(false);
        }}
        onDuplicate={(id) => {
          toast.success('Duplicando receta...', { duration: 2000 });
          setIsPreviewOpen(false);
        }}
        onDelete={(id) => {
          toast.success('Borrador eliminado', { duration: 2000 });
          setIsPreviewOpen(false);
        }}
        onPrint={(id) => {
          toast.success('Imprimiendo receta...', { duration: 2000 });
        }}
        onExport={(id) => {
          toast.success('Exportando PDF...', { duration: 2000 });
        }}
        onCancel={(id) => {
          toast.success('Receta anulada', { duration: 2000 });
          setIsPreviewOpen(false);
        }}
      />
    </div>
  );
}

interface DuplicarRecetaPageProps {
  onNavigate?: (route: string) => void;
  onEditDraft?: (draftId: string) => void;
}

export function DuplicarRecetaPage({ onNavigate, onEditDraft }: DuplicarRecetaPageProps) {
  // Estados para búsqueda
  const [searchMode, setSearchMode] = useState<"quick" | "advanced">("quick");
  const [quickSearch, setQuickSearch] = useState("");
  
  // Filtros avanzados
  const [prescriptionNumber, setPrescriptionNumber] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Estados de resultados y duplicación
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicatedPrescription, setDuplicatedPrescription] = useState<any | null>(null);

  // Combinar datos disponibles para duplicar (borradores y recetas emitidas)
  const availablePrescriptions = [
    ...mockDrafts.map(d => ({
      ...d,
      status: "draft" as const,
      date: d.lastModified.split(' ')[0],
      time: d.lastModified.split(' ').slice(1).join(' '),
      doctorName: "Dr. Carlos Alberto Mendoza Herrera"
    })),
    ...mockEmittedPrescriptions.filter(e => 
      e.dispensationStatus !== 'cancelled' // No permitir duplicar recetas anuladas
    ).map(e => ({
      ...e,
      date: e.emittedDate,
      time: e.emittedTime,
      status: e.dispensationStatus
    }))
  ];

  // Función de búsqueda rápida
  const handleQuickSearch = () => {
    if (!quickSearch.trim()) {
      toast.error('Por favor ingresa un criterio de búsqueda');
      return;
    }

    const results = availablePrescriptions.filter(rx => 
      normalizedIncludes(rx.patientName, quickSearch) ||
      normalizedIncludes(rx.prescriptionNumber, quickSearch) ||
      normalizedIncludes(rx.patientId, quickSearch)
    );

    setSearchResults(results);
    setHasSearched(true);

    toast.success('Búsqueda completada', {
      description: `Se encontraron ${results.length} receta(s) disponible(s) para duplicar`,
      duration: 3000,
    });
  };

  // Función de búsqueda avanzada
  const handleAdvancedSearch = () => {
    let results = [...availablePrescriptions];

    if (prescriptionNumber) {
      results = results.filter(rx => 
        normalizedIncludes(rx.prescriptionNumber, prescriptionNumber)
      );
    }

    if (patientName) {
      results = results.filter(rx => 
        normalizedIncludes(rx.patientName, patientName)
      );
    }

    if (patientId) {
      results = results.filter(rx => 
        normalizedIncludes(rx.patientId, patientId)
      );
    }

    if (statusFilter !== "all") {
      results = results.filter(rx => rx.status === statusFilter);
    }

    if (dateFrom) {
      results = results.filter(rx => rx.date >= dateFrom);
    }

    if (dateTo) {
      results = results.filter(rx => rx.date <= dateTo);
    }

    setSearchResults(results);
    setHasSearched(true);

    toast.success('Búsqueda avanzada completada', {
      description: `Se encontraron ${results.length} receta(s) disponible(s) para duplicar`,
      duration: 3000,
    });
  };

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setQuickSearch("");
    setPrescriptionNumber("");
    setPatientName("");
    setPatientId("");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
    setSearchResults([]);
    setHasSearched(false);
  };

  // Función para duplicar receta
  const handleDuplicate = (prescription: any) => {
    // Generar nuevo número de receta
    const currentNumbers = mockDrafts.map(d => 
      parseInt(d.prescriptionNumber.split('-').pop() || '0')
    );
    const nextNumber = Math.max(...currentNumbers) + 1;
    const newPrescriptionNumber = `RX-2025-${String(nextNumber).padStart(6, '0')}`;

    // Crear nuevo borrador duplicado
    const newDraft = {
      id: String(Date.now()),
      prescriptionNumber: newPrescriptionNumber,
      patientName: prescription.patientName,
      patientId: prescription.patientId,
      lastModified: `${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
      medicinesCount: prescription.medicinesCount,
      createdDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      createdTime: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true }),
      age: prescription.age,
      gender: prescription.gender,
      doctorName: prescription.doctorName || "Dr. Carlos Alberto Mendoza Herrera",
      status: "draft",
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      originalPrescription: prescription.prescriptionNumber
    };

    setDuplicatedPrescription(newDraft);
    setShowDuplicateDialog(true);

    toast.success('Receta duplicada exitosamente', {
      description: `Se creó el borrador ${newPrescriptionNumber}`,
      duration: 4000,
    });
  };

  // Ver detalles de receta
  const handleView = (prescription: any) => {
    setSelectedPrescription(prescription);
    setIsPreviewOpen(true);
  };

  // Doble clic para ver detalles
  const handleDoubleClick = (prescription: any) => {
    setSelectedPrescription(prescription);
    setIsPreviewOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      draft: { label: "Borrador", className: "bg-orange-100 text-orange-700 border-orange-300" },
      emitted: { label: "Emitida", className: "bg-blue-100 text-blue-700 border-blue-300" },
      partially_dispensed: { label: "Parcialmente dispensada", className: "bg-yellow-100 text-yellow-700 border-yellow-300" },
      fully_dispensed: { label: "Completamente dispensada", className: "bg-green-100 text-green-700 border-green-300" }
    };
    return config[status] || config.draft;
  };

  // Estadísticas de búsqueda
  const searchStats = hasSearched ? {
    total: searchResults.length,
    drafts: searchResults.filter(r => r.status === 'draft').length,
    emitted: searchResults.filter(r => r.status === 'emitted').length,
    dispensed: searchResults.filter(r => r.status === 'partially_dispensed' || r.status === 'fully_dispensed').length
  } : null;

  return (
    <div className="space-y-6">
      {/* Header visual */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-teal-500 to-cyan-700 rounded-lg shadow-lg">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Copy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-white">Duplicar Receta</h1>
                  <p className="text-cyan-100 text-sm">
                    Crea nuevas prescripciones basadas en recetas existentes
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-cyan-100 text-xs mb-1">Recetas disponibles</p>
                <p className="text-white font-semibold text-3xl">{availablePrescriptions.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner informativo */}
      <Card className="bg-cyan-50 border-cyan-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Copy className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-cyan-900 mb-2">Duplicación de recetas para tratamientos recurrentes</h4>
              <div className="text-sm text-cyan-800 space-y-2">
                <p>
                  La duplicación de recetas permite crear rápidamente nuevas prescripciones basadas en tratamientos previos, ideal para:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Renovación de tratamientos crónicos</li>
                  <li>Prescripciones recurrentes para el mismo paciente</li>
                  <li>Esquemas terapéuticos similares</li>
                  <li>Ahorro de tiempo en prescripciones frecuentes</li>
                </ul>
                <p className="pt-2">
                  💡 <strong>Importante:</strong> El nuevo borrador mantiene todos los medicamentos y datos del paciente. Se genera un nuevo número de receta y puedes modificar cualquier dato antes de emitir.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de búsqueda */}
      <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as "quick" | "advanced")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quick">Búsqueda Rápida</TabsTrigger>
          <TabsTrigger value="advanced">Búsqueda Avanzada</TabsTrigger>
        </TabsList>

        {/* Búsqueda rápida */}
        <TabsContent value="quick">
          <Card>
            <CardHeader>
              <CardTitle>Búsqueda Rápida</CardTitle>
              <p className="text-sm text-gray-600">
                Busca la receta que deseas duplicar por número, paciente o identificación
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Número de receta, nombre del paciente o ID..."
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
                    className="pl-11 h-12"
                  />
                </div>
                <Button 
                  onClick={handleQuickSearch} 
                  className="bg-cyan-600 hover:bg-cyan-700 px-8"
                  size="lg"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
                {hasSearched && (
                  <Button 
                    onClick={handleClearSearch} 
                    variant="outline"
                    size="lg"
                  >
                    <FilterX className="w-4 h-4 mr-2" />
                    Limpiar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Búsqueda avanzada */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Búsqueda Avanzada</CardTitle>
              <p className="text-sm text-gray-600">
                Usa múltiples criterios para encontrar la receta que deseas duplicar
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Número de Receta</label>
                    <Input
                      placeholder="RX-2025-XXXXXX"
                      value={prescriptionNumber}
                      onChange={(e) => setPrescriptionNumber(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Estado de la Receta</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="draft">Borradores</SelectItem>
                        <SelectItem value="emitted">Emitidas</SelectItem>
                        <SelectItem value="partially_dispensed">Parcialmente dispensadas</SelectItem>
                        <SelectItem value="fully_dispensed">Completamente dispensadas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Nombre del Paciente</label>
                    <Input
                      placeholder="Nombre completo del paciente"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Identificación del Paciente</label>
                    <Input
                      placeholder="CC, TI, CE, etc."
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Fecha Desde</label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Fecha Hasta</label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleAdvancedSearch} 
                    className="bg-cyan-600 hover:bg-cyan-700"
                    size="lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar con filtros
                  </Button>
                  <Button 
                    onClick={handleClearSearch} 
                    variant="outline"
                    size="lg"
                  >
                    <FilterX className="w-4 h-4 mr-2" />
                    Limpiar filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Estadísticas de resultados */}
      {hasSearched && searchStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total encontrado</p>
                <p className="text-2xl font-semibold text-gray-900">{searchStats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Borradores</p>
                <p className="text-2xl font-semibold text-gray-900">{searchStats.drafts}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Emitidas</p>
                <p className="text-2xl font-semibold text-gray-900">{searchStats.emitted}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Dispensadas</p>
                <p className="text-2xl font-semibold text-gray-900">{searchStats.dispensed}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resultados de búsqueda */}
      {hasSearched && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resultados - Selecciona una receta para duplicar</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {searchResults.length} receta(s) disponible(s) • Doble clic para vista previa
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <SearchX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">No se encontraron recetas</h3>
                <p className="text-sm text-gray-600 mb-4">
                  No hay recetas que coincidan con los criterios de búsqueda.
                </p>
                <Button onClick={handleClearSearch} variant="outline">
                  <FilterX className="w-4 h-4 mr-2" />
                  Limpiar búsqueda
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número de Receta</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-center">Medicamentos</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((rx) => {
                    const statusBadge = getStatusBadge(rx.status);
                    const isDraft = rx.status === 'draft';
                    return (
                      <TableRow 
                        key={rx.id} 
                        className="hover:bg-cyan-50/50 cursor-pointer"
                        onDoubleClick={() => handleDoubleClick(rx)}
                        title="Doble clic para ver detalles"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {isDraft ? (
                              <FileEdit className="w-4 h-4 text-orange-600" />
                            ) : (
                              <FileCheck className="w-4 h-4 text-blue-600" />
                            )}
                            <span className="font-medium">{rx.prescriptionNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{rx.patientName}</p>
                            <p className="text-sm text-gray-600">{rx.patientId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{rx.date}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {rx.medicinesCount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusBadge.className}>
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleView(rx);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-cyan-600 hover:bg-cyan-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicate(rx);
                              }}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Información inicial */}
      {!hasSearched && (
        <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200">
          <CardContent className="p-8">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="font-medium text-cyan-900 mb-3">Comienza buscando una receta para duplicar</h3>
              <p className="text-sm text-cyan-800 mb-4">
                Usa la búsqueda rápida o avanzada para encontrar la receta que deseas duplicar. Puedes duplicar tanto borradores como recetas ya emitidas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mt-6">
                <div className="p-4 bg-white/60 rounded-lg border border-cyan-200">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-cyan-700 font-semibold">1</span>
                  </div>
                  <p className="text-sm font-medium text-cyan-900 mb-1">Buscar receta</p>
                  <p className="text-xs text-cyan-700">Encuentra la prescripción original usando cualquier criterio</p>
                </div>
                <div className="p-4 bg-white/60 rounded-lg border border-cyan-200">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-cyan-700 font-semibold">2</span>
                  </div>
                  <p className="text-sm font-medium text-cyan-900 mb-1">Vista previa y duplicar</p>
                  <p className="text-xs text-cyan-700">Revisa los detalles y confirma la duplicación</p>
                </div>
                <div className="p-4 bg-white/60 rounded-lg border border-cyan-200">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-cyan-700 font-semibold">3</span>
                  </div>
                  <p className="text-sm font-medium text-cyan-900 mb-1">Editar y emitir</p>
                  <p className="text-xs text-cyan-700">Modifica el nuevo borrador según sea necesario</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Panel de vista previa con énfasis en duplicar */}
      <UniversalPrescriptionPanel
        prescription={selectedPrescription}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDuplicate={(id) => {
          const prescriptionToDuplicate = searchResults.find(rx => rx.id === id);
          if (prescriptionToDuplicate) {
            handleDuplicate(prescriptionToDuplicate);
            setIsPreviewOpen(false);
          }
        }}
        onPrint={(id) => {
          toast.success('Imprimiendo receta...', { duration: 2000 });
        }}
        onExport={(id) => {
          toast.success('Exportando PDF...', { duration: 2000 });
        }}
      />

      {/* Diálogo de confirmación después de duplicar */}
      <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-cyan-100 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <AlertDialogTitle>Receta duplicada exitosamente</AlertDialogTitle>
              </div>
            </div>
            <AlertDialogDescription>
              <div className="space-y-4">
                <p>Se ha creado un nuevo borrador basado en la receta seleccionada. El borrador contiene toda la información del paciente y los medicamentos prescritos.</p>
                
                {duplicatedPrescription && (
                  <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FileEdit className="w-5 h-5 text-cyan-600" />
                      <p className="font-medium text-cyan-900">Nuevo borrador creado</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-cyan-800">
                      <div>
                        <span className="font-medium">Número:</span> {duplicatedPrescription.prescriptionNumber}
                      </div>
                      <div>
                        <span className="font-medium">Paciente:</span> {duplicatedPrescription.patientName}
                      </div>
                      <div>
                        <span className="font-medium">Medicamentos:</span> {duplicatedPrescription.medicinesCount}
                      </div>
                      <div>
                        <span className="font-medium">Creado:</span> {duplicatedPrescription.createdTime}
                      </div>
                      {duplicatedPrescription.originalPrescription && (
                        <div className="col-span-2">
                          <span className="font-medium">Duplicado de:</span> {duplicatedPrescription.originalPrescription}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-2">¿Qué deseas hacer ahora?</p>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <Edit3 className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                      <span><strong>Editar ahora:</strong> Abre el nuevo borrador para revisar y modificar la información antes de emitir.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileEdit className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                      <span><strong>Ver borradores:</strong> Navega a la lista de borradores donde encontrarás el nuevo borrador al inicio.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Copy className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                      <span><strong>Duplicar otra:</strong> Continúa en esta página para duplicar más recetas.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={() => setShowDuplicateDialog(false)}>
              Duplicar otra receta
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowDuplicateDialog(false);
                if (onNavigate) {
                  onNavigate('/prescripciones/borradores');
                  toast.success('Navegando a lista de borradores...', { duration: 2000 });
                } else {
                  toast.info('Navegación no disponible', { duration: 2000 });
                }
              }}
              className="bg-gray-600 hover:bg-gray-700"
            >
              <FileEdit className="w-4 h-4 mr-2" />
              Ver lista de borradores
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => {
                setShowDuplicateDialog(false);
                if (duplicatedPrescription && onEditDraft) {
                  // El ID del borrador duplicado está en duplicatedPrescription.id
                  onEditDraft(duplicatedPrescription.id);
                  toast.success('Abriendo borrador para edición...', { duration: 2000 });
                } else {
                  toast.error('No se pudo abrir el borrador', { duration: 2000 });
                }
              }}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Editar borrador ahora
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}