import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import {
  X,
  Receipt,
  Calendar,
  Package,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  CreditCard
} from "lucide-react";
import { PrescriptionBookletsAPI, BookletUtils, type PrescriptionBooklet } from "../utils/prescriptionBookletsStore";

interface BookletDetailPanelProps {
  booklet: PrescriptionBooklet | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookletDetailPanel({
  booklet,
  isOpen,
  onClose
}: BookletDetailPanelProps) {
  if (!booklet) return null;

  const usagePercentage = (booklet.usedSlips / booklet.totalSlips) * 100;
  const availablePercentage = (booklet.availableSlips / booklet.totalSlips) * 100;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:w-[700px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                Detalle del Talonario
              </SheetTitle>
              <SheetDescription>
                {booklet.bookletNumber}
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
          {/* Información general del talonario */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {booklet.bookletNumber}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {booklet.doctorName}
                </p>
                <p className="text-xs text-gray-500">
                  Licencia: {booklet.doctorLicense}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`${BookletUtils.getBookletTypeColor(booklet.bookletType)} font-medium`}
              >
                {BookletUtils.getBookletTypeLabel(booklet.bookletType)}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white/70 rounded-lg">
                <Package className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <p className="text-2xl font-bold text-gray-900">{booklet.totalSlips}</p>
                <p className="text-xs text-gray-600">Total boletas</p>
              </div>
              <div className="text-center p-3 bg-white/70 rounded-lg">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <p className="text-2xl font-bold text-green-600">{booklet.availableSlips}</p>
                <p className="text-xs text-gray-600">Disponibles</p>
              </div>
              <div className="text-center p-3 bg-white/70 rounded-lg">
                <FileText className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                <p className="text-2xl font-bold text-gray-600">{booklet.usedSlips}</p>
                <p className="text-xs text-gray-600">Usadas</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Progreso de uso */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Progreso de Uso
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Boletas utilizadas</span>
                  <span className="font-medium text-gray-900">
                    {booklet.usedSlips} / {booklet.totalSlips} ({usagePercentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Boletas disponibles</span>
                  <span className="font-medium text-green-600">
                    {booklet.availableSlips} / {booklet.totalSlips} ({availablePercentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={availablePercentage} className="h-2 bg-gray-200" indicatorClassName="bg-green-500" />
              </div>
            </div>

            {/* Alertas de estado */}
            <div className="mt-4 space-y-2">
              {booklet.availableSlips === 0 && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Talonario agotado</p>
                    <p className="text-xs text-red-700 mt-1">
                      No quedan boletas disponibles en este talonario
                    </p>
                  </div>
                </div>
              )}
              {booklet.availableSlips > 0 && booklet.availableSlips <= 10 && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-900">Inventario bajo</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Quedan pocas boletas disponibles. Considere comprar más talonarios.
                    </p>
                  </div>
                </div>
              )}
              {booklet.status === "active" && booklet.availableSlips > 10 && (
                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Talonario activo</p>
                    <p className="text-xs text-green-700 mt-1">
                      Inventario suficiente para continuar emitiendo recetas
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Información de fechas */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Información de Compra
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Fecha de compra</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(booklet.purchaseDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Estado</p>
                <Badge className={
                  booklet.status === "active" ? "bg-green-100 text-green-800 border-green-300" :
                  booklet.status === "completed" ? "bg-blue-100 text-blue-800 border-blue-300" :
                  "bg-gray-100 text-gray-800 border-gray-300"
                }>
                  {booklet.status === "active" ? "Activo" :
                   booklet.status === "completed" ? "Completado" :
                   "Cancelado"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reglas del talonario */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reglas de Prescripción
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo de talonario:</span>
                  <span className="font-medium">
                    {BookletUtils.getBookletTypeLabel(booklet.bookletType)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Medicamentos por receta:</span>
                  <span className="font-medium">
                    {BookletUtils.getMedicationLimit(booklet.bookletType) === "Sin límite" 
                      ? "Sin límite" 
                      : `Máximo ${BookletUtils.getMedicationLimit(booklet.bookletType)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Una receta equivale a:</span>
                  <span className="font-medium">1 boleta</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Lista de boletas (primeras 10) */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Boletas ({booklet.slips.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {booklet.slips.slice(0, 20).map((slip) => (
                <div
                  key={slip.fullSlipNumber}
                  className={`p-3 rounded-lg border ${
                    slip.status === "available"
                      ? "bg-green-50 border-green-200"
                      : slip.status === "used"
                      ? "bg-gray-50 border-gray-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {slip.fullSlipNumber}
                      </p>
                      {slip.prescriptionNumber && (
                        <p className="text-xs text-gray-600 mt-1">
                          Receta: {slip.prescriptionNumber}
                        </p>
                      )}
                      {slip.usedDate && (
                        <p className="text-xs text-gray-500">
                          Usado: {new Date(slip.usedDate).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        slip.status === "available"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : slip.status === "used"
                          ? "bg-gray-100 text-gray-700 border-gray-300"
                          : "bg-red-100 text-red-700 border-red-300"
                      }
                    >
                      {slip.status === "available" ? "Disponible" :
                       slip.status === "used" ? "Usada" : "Cancelada"}
                    </Badge>
                  </div>
                </div>
              ))}
              {booklet.slips.length > 20 && (
                <p className="text-center text-sm text-gray-500 py-2">
                  ... y {booklet.slips.length - 20} boletas más
                </p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
