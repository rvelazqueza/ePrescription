import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AlertTriangle, FileText, Plus } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface CategoryConflictDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNewPrescription: () => void;
  newMedicineName: string;
  newCategory: string;
  currentCategory: string;
}

export function CategoryConflictDialog({
  isOpen,
  onClose,
  onCreateNewPrescription,
  newMedicineName,
  newCategory,
  currentCategory
}: CategoryConflictDialogProps) {
  
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      "Estupefacientes": "bg-red-100 text-red-800 border-red-300",
      "Psicotrópicos": "bg-orange-100 text-orange-800 border-orange-300",
      "Antimicrobianos": "bg-purple-100 text-purple-800 border-purple-300",
      "Controlados": "bg-blue-100 text-blue-800 border-blue-300",
      "Libre": "bg-green-100 text-green-800 border-green-300"
    };
    return colorMap[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Conflicto de Categoría de Medicamentos</DialogTitle>
              <DialogDescription>
                No se pueden mezclar medicamentos de diferentes categorías en la misma receta
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Explicación del problema */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-900">
              <strong>Normativa de Medicamentos Controlados:</strong> Cada receta debe contener 
              medicamentos de una sola categoría. No se pueden mezclar estupefacientes, 
              psicotrópicos, antimicrobianos o medicamentos libres en la misma prescripción.
            </AlertDescription>
          </Alert>

          {/* Información actual */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Receta Actual</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-800">Tipo de receta:</span>
              <Badge variant="outline" className={getCategoryColor(currentCategory)}>
                {currentCategory}
              </Badge>
            </div>
          </div>

          {/* Medicamento que intenta agregar */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Plus className="h-5 w-5 text-orange-600" />
              <h4 className="font-semibold text-orange-900">Medicamento a Agregar</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-orange-800">{newMedicineName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-orange-800">Categoría:</span>
                <Badge variant="outline" className={getCategoryColor(newCategory)}>
                  {newCategory}
                </Badge>
              </div>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">¿Qué puede hacer?</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>
                  <strong>Crear nueva receta:</strong> Finalice la receta actual y cree una nueva 
                  para {newMedicineName}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span>
                  <strong>Cancelar:</strong> Continúe trabajando en la receta actual sin agregar 
                  {' '}{newMedicineName}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={() => {
              onCreateNewPrescription();
              onClose();
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Nueva Receta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
