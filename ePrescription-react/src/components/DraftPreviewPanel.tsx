import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  X, 
  Edit3, 
  Copy, 
  Trash2, 
  User, 
  Calendar, 
  Clock, 
  Pill,
  FileText,
  AlertCircle
} from "lucide-react";
import { MedicineClassificationAPI } from "../utils/medicineClassificationStore";
import { BookletUtils } from "../utils/prescriptionBookletsStore";

interface DraftData {
  id: string;
  prescriptionNumber: string;
  patientName: string;
  patientId: string;
  createdDate: string;
  lastModified: string;
  medicinesCount: number;
  status: string;
  age: number;
  gender: string;
  medicines?: Array<{
    name: string;
    dose: string;
    frequency: string;
    duration: string;
  }>;
}

interface DraftPreviewPanelProps {
  draft: DraftData | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DraftPreviewPanel({ 
  draft, 
  isOpen, 
  onClose, 
  onEdit, 
  onDuplicate, 
  onDelete 
}: DraftPreviewPanelProps) {
  
  if (!draft) return null;

  const handleEdit = () => {
    onEdit(draft.id);
  };

  const handleDuplicate = () => {
    onDuplicate(draft.id);
  };

  const handleDelete = () => {
    if (confirm('¿Está seguro de que desea eliminar este borrador?')) {
      onDelete(draft.id);
      onClose();
    }
  };

  // ACTUALIZADO: Usar los medicamentos reales del borrador si están disponibles
  const displayMedicines = draft.medicines && draft.medicines.length > 0 
    ? draft.medicines 
    : [];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Vista Previa de Borrador
              </SheetTitle>
              <SheetDescription>
                {draft.prescriptionNumber}
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Estado del borrador */}
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">Borrador sin finalizar</p>
                <p className="text-xs text-orange-700">Último cambio: {draft.lastModified}</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
              Borrador
            </Badge>
          </div>

          {/* Información del paciente */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Información del Paciente
            </h3>
            <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div>
                <p className="text-sm text-gray-600">Nombre completo</p>
                <p className="font-medium text-gray-900">{draft.patientName}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div>
                  <p className="text-xs text-gray-600">Identificación</p>
                  <p className="text-sm font-medium">{draft.patientId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Edad</p>
                  <p className="text-sm font-medium">{draft.age} años</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Sexo</p>
                  <p className="text-sm font-medium">{draft.gender === 'M' ? 'Masculino' : 'Femenino'}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Medicamentos prescritos */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Medicamentos ({draft.medicinesCount})
            </h3>
            <div className="space-y-3">
              {displayMedicines.map((medicine, index) => {
                const medicineInfo = MedicineClassificationAPI.getMedicineInfo(medicine.name);
                const category = medicineInfo?.categoryLabel || "Receta Libre";
                const bookletType = medicineInfo?.bookletType || "libre";
                
                return (
                  <div 
                    key={index} 
                    className="p-4 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-900">{medicine.name}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${BookletUtils.getBookletTypeColor(bookletType)}`}
                      >
                        {category}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="text-xs text-gray-500">Dosis:</span> {medicine.dose}
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Frecuencia:</span> {medicine.frequency}
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs text-gray-500">Duración:</span> {medicine.duration}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Información de fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                <p className="text-xs">Fecha de creación</p>
              </div>
              <p className="text-sm font-medium text-gray-900">{draft.createdDate}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                <p className="text-xs">Última modificación</p>
              </div>
              <p className="text-sm font-medium text-gray-900">{draft.lastModified}</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={handleEdit}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Edit3 className="w-4 h-4" />
              Continuar editando
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleDuplicate}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Duplicar
              </Button>
              
              <Button 
                onClick={handleDelete}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}