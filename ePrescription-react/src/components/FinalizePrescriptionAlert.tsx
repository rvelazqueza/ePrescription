import { AlertCircle, Package, ShoppingCart, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { PrescriptionBookletsAPI, BookletUtils, type BookletType } from "../utils/prescriptionBookletsStore";

interface FinalizePrescriptionAlertProps {
  doctorId: string;
  hasPatient: boolean;
  medicineCount: number;
  medicines: Array<{ name: string; category?: string }>;
  onOpenBookletPurchase: () => void;
}

export function FinalizePrescriptionAlert({
  doctorId,
  hasPatient,
  medicineCount,
  medicines,
  onOpenBookletPurchase
}: FinalizePrescriptionAlertProps) {
  const totalAvailableSlips = PrescriptionBookletsAPI.getDoctorAvailableSlips(doctorId);
  const slipsByType = PrescriptionBookletsAPI.getDoctorAvailableSlipsByType(doctorId);

  // Si todo está correcto, no mostrar nada
  if (hasPatient && medicineCount > 0 && totalAvailableSlips > 0) {
    return null;
  }

  // Determinar qué categorías de talonarios se necesitan basado en los medicamentos
  const getRequiredBookletTypes = (): BookletType[] => {
    const uniqueCategories = new Set(medicines.map(m => m.category).filter(Boolean));
    const required: BookletType[] = [];
    
    uniqueCategories.forEach(cat => {
      if (cat === "Estupefaciente") required.push("estupefaciente");
      else if (cat === "Psicotrópico") required.push("psicotropico");
      else if (cat === "Antimicrobiano") required.push("antimicrobiano");
      else required.push("libre");
    });
    
    return required.length > 0 ? required : ["libre"];
  };

  const requiredTypes = medicineCount > 0 ? getRequiredBookletTypes() : [];
  const missingTypes = requiredTypes.filter(type => !slipsByType[type] || slipsByType[type] === 0);

  return (
    <Alert variant="destructive" className="border-orange-300 bg-orange-50">
      <AlertCircle className="h-5 w-5 text-orange-600" />
      <AlertTitle className="text-orange-900 font-semibold">
        No se puede finalizar la prescripción
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <div className="text-sm text-orange-800">
          {!hasPatient && (
            <div className="flex items-start gap-2 mb-2">
              <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Debe seleccionar un paciente antes de finalizar</span>
            </div>
          )}
          
          {medicineCount === 0 && (
            <div className="flex items-start gap-2 mb-2">
              <Package className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Debe agregar al menos un medicamento a la receta</span>
            </div>
          )}
          
          {totalAvailableSlips === 0 && (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <ShoppingCart className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Sin boletas disponibles</p>
                  <p className="text-xs mt-1">
                    No tiene talonarios de recetas disponibles para emitir prescripciones.
                  </p>
                </div>
              </div>
              <Button 
                size="sm"
                onClick={onOpenBookletPurchase}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Comprar Talonarios
              </Button>
            </div>
          )}
          
          {totalAvailableSlips > 0 && missingTypes.length > 0 && medicineCount > 0 && (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Faltan talonarios específicos</p>
                  <p className="text-xs mt-1">
                    Tiene boletas disponibles ({totalAvailableSlips}), pero necesita talonarios específicos para los medicamentos seleccionados:
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {missingTypes.map(type => (
                      <Badge 
                        key={type}
                        variant="outline" 
                        className={BookletUtils.getBookletTypeColor(type)}
                      >
                        {BookletUtils.getBookletTypeLabel(type)}: 0 boletas
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button 
                size="sm"
                onClick={onOpenBookletPurchase}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Comprar Talonarios Faltantes
              </Button>
            </div>
          )}
        </div>

        {/* Mostrar resumen de boletas disponibles por tipo */}
        {totalAvailableSlips > 0 && (
          <div className="pt-3 border-t border-orange-200">
            <p className="text-xs font-medium text-orange-900 mb-2">Boletas disponibles por tipo:</p>
            <div className="flex flex-wrap gap-1">
              {(["estupefaciente", "psicotropico", "antimicrobiano", "libre"] as BookletType[]).map(type => {
                const count = slipsByType[type] || 0;
                return (
                  <Badge 
                    key={type}
                    variant="outline" 
                    className={`text-xs ${count > 0 ? BookletUtils.getBookletTypeColor(type) : 'bg-gray-100 text-gray-500 border-gray-300'}`}
                  >
                    {BookletUtils.getBookletTypeLabel(type)}: {count}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
