/**
 * Multi-Prescription Confirmation Dialog
 * 
 * Diálogo de confirmación cuando el asistente de IA sugiere medicamentos
 * que requieren múltiples recetas por restricciones de talonarios.
 * 
 * Muestra:
 * - Resumen del tratamiento completo
 * - Agrupación automática por categoría
 * - Número de recetas que se generarán
 * - Validación de disponibilidad de talonarios
 * - Opción de editar o confirmar
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent } from './ui/card';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Info,
  ShoppingCart,
  X,
  Edit3,
  Pill
} from 'lucide-react';
import {
  analyzeTreatment,
  checkBookletAvailability,
  formatMedicationDisplay,
  getCategoryBadgeColor,
  getCategoryIcon,
  type MultiPrescriptionMedication,
  type TreatmentAnalysis
} from '../utils/multiPrescriptionUtils';
import { BookletUtils, type BookletType } from '../utils/prescriptionBookletsStore';

interface MultiPrescriptionConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  medications: MultiPrescriptionMedication[];
  diagnosis: string;
  availableSlipsByType: Record<BookletType, number>;
  onConfirm: (analysis: TreatmentAnalysis) => void;
  onEdit: () => void;
  onPurchaseBooklets: () => void;
}

export function MultiPrescriptionConfirmationDialog({
  isOpen,
  onClose,
  medications,
  diagnosis,
  availableSlipsByType,
  onConfirm,
  onEdit,
  onPurchaseBooklets
}: MultiPrescriptionConfirmationDialogProps) {
  
  // Analizar tratamiento
  const analysis = analyzeTreatment(medications);
  const availability = checkBookletAvailability(analysis, availableSlipsByType);

  const handleConfirm = () => {
    if (availability.hasEnough) {
      onConfirm(analysis);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-6 h-6 text-blue-600" />
            Tratamiento Completo Sugerido
          </DialogTitle>
          <DialogDescription>
            <div className="mt-2 space-y-1">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-gray-700">Diagnóstico:</span>
                <span className="text-gray-900">{diagnosis}</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-blue-900">{analysis.summary}</span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Advertencias del análisis */}
        {analysis.warnings.length > 0 && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-900">
              <strong>Separación Automática Requerida:</strong>
              <ul className="mt-2 space-y-1 ml-4 list-disc text-sm">
                {analysis.warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Errores si los hay */}
        {analysis.errors.length > 0 && (
          <Alert className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-900">
              <strong>Errores:</strong>
              <ul className="mt-2 space-y-1 ml-4 list-disc text-sm">
                {analysis.errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Verificación de disponibilidad de talonarios */}
        {!availability.hasEnough && (
          <Alert className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-900">
              <strong>⚠️ Talonarios Insuficientes</strong>
              <div className="mt-2 space-y-2">
                {availability.missing.map((missing, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Badge className="bg-red-600">
                      {BookletUtils.getBookletTypeLabel(missing.bookletType)}
                    </Badge>
                    <span>
                      Necesitas {missing.needed} {missing.needed === 1 ? 'boleta' : 'boletas'}, 
                      solo tienes {missing.available} disponible{missing.available !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
                <Button
                  onClick={onPurchaseBooklets}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Comprar Talonarios
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Recetas a generar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              Recetas que se Generarán ({analysis.totalPrescriptions})
            </h3>
            <span className="text-sm text-gray-600">
              {medications.length} medicamento{medications.length !== 1 ? 's' : ''} en total
            </span>
          </div>

          {analysis.groups.map((group, groupIdx) => (
            <Card key={groupIdx} className="border-l-4" style={{
              borderLeftColor: group.category === 'Estupefacientes' ? '#dc2626' :
                              group.category === 'Psicotrópicos' ? '#ea580c' :
                              group.category === 'Antimicrobianos' ? '#2563eb' : '#16a34a'
            }}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCategoryIcon(group.category)}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">
                          Receta {groupIdx + 1}
                        </h4>
                        <Badge className={getCategoryBadgeColor(group.category)}>
                          {group.displayLabel}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Talonario: {BookletUtils.getBookletTypeLabel(group.bookletType)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {group.medications.length} med{group.medications.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {/* Medicamentos del grupo */}
                <div className="space-y-2">
                  {group.medications.map((med, medIdx) => (
                    <div 
                      key={med.id}
                      className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white border-2 border-gray-300 text-xs font-semibold text-gray-700">
                        {medIdx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          <Pill className="w-4 h-4 text-blue-600" />
                          {med.name}
                        </div>
                        <div className="text-sm text-gray-700 mt-1">
                          <div className="flex flex-wrap gap-x-3 gap-y-1">
                            <span>💊 {med.dosage}</span>
                            <span>⏰ {med.frequency}</span>
                            <span>📅 {med.duration}</span>
                          </div>
                          {med.instructions && (
                            <div className="mt-1 text-gray-600 italic">
                              📝 {med.instructions}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info adicional */}
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900 text-sm">
            <strong>📋 Proceso Automático:</strong>
            <ul className="mt-2 space-y-1 ml-4 list-disc">
              <li>El sistema asignará automáticamente los talonarios correctos</li>
              <li>Cada receta tendrá su número de boleta único</li>
              <li>Todas las recetas quedarán vinculadas al mismo diagnóstico</li>
              <li>Podrás imprimir todas las recetas juntas o por separado</li>
            </ul>
          </AlertDescription>
        </Alert>

        <DialogFooter className="flex gap-2">
          <Button
            onClick={onClose}
            variant="outline"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          
          <Button
            onClick={onEdit}
            variant="outline"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Editar Manualmente
          </Button>
          
          <Button
            onClick={handleConfirm}
            disabled={!availability.hasEnough || !analysis.isValid}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Confirmar y Generar {analysis.totalPrescriptions} Receta{analysis.totalPrescriptions !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
