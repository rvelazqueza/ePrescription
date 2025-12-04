import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AlertTriangle, ArrowRight, Eye } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Medicine } from "./MedicineTable";

interface ReplaceMedicineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReplace: (medicineIdToReplace: string) => void;
  onViewDetails: (medicine: Medicine) => void;
  newMedicineName: string;
  category: string;
  existingMedicines: Medicine[];
  limit: number;
}

export function ReplaceMedicineDialog({
  isOpen,
  onClose,
  onReplace,
  onViewDetails,
  newMedicineName,
  category,
  existingMedicines,
  limit
}: ReplaceMedicineDialogProps) {
  
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Límite de Medicamentos Alcanzado</DialogTitle>
              <DialogDescription>
                Solo se permite {limit} medicamento(s) de {category} por receta
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Alerta normativa */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-900">
              <strong>Normativa:</strong> Las recetas de <Badge variant="outline" className={`${getCategoryColor(category)} mx-1`}>
                {category}
              </Badge> tienen un límite de {limit} medicamento(s) por prescripción.
            </AlertDescription>
          </Alert>

          {/* Medicamentos actuales */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              Medicamentos Actuales ({existingMedicines.length}/{limit})
            </h4>
            <div className="space-y-2">
              {existingMedicines.map((medicine) => (
                <div 
                  key={medicine.id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{medicine.name}</div>
                    <div className="text-sm text-gray-600">
                      {medicine.dose} • {medicine.frequency} • {medicine.duration}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onViewDetails(medicine);
                        onClose();
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onReplace(medicine.id);
                        onClose();
                      }}
                      className="text-amber-700 hover:text-amber-800 hover:bg-amber-50 border-amber-300"
                    >
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Reemplazar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nuevo medicamento */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Medicamento a Agregar</h4>
            <div className="flex items-center gap-2">
              <span className="font-medium text-green-800">{newMedicineName}</span>
              <Badge variant="outline" className={getCategoryColor(category)}>
                {category}
              </Badge>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">¿Qué desea hacer?</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>
                  <strong>Reemplazar:</strong> Haga clic en "Reemplazar" junto al medicamento que 
                  desea cambiar por {newMedicineName}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">✓</span>
                <span>
                  <strong>Ver detalles:</strong> Revise la información completa antes de decidir
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-0.5">✓</span>
                <span>
                  <strong>Cancelar:</strong> Mantenga los medicamentos actuales
                </span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Mantener Actuales
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
