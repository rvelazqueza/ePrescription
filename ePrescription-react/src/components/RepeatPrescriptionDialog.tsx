import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2,
  FileText,
  Calendar,
  Pill,
  Activity
} from "lucide-react";
import { useState } from "react";

interface RepeatPrescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  prescriptionNumber: string;
  issueDate: string;
  medicinesCount: number;
  medicinesSummary: string[];
  patientName: string;
}

export function RepeatPrescriptionDialog({
  open,
  onOpenChange,
  onConfirm,
  prescriptionNumber,
  issueDate,
  medicinesCount,
  medicinesSummary,
  patientName
}: RepeatPrescriptionDialogProps) {
  const [verificationChecks, setVerificationChecks] = useState({
    clinicalConditions: false,
    allergies: false,
    dosageAdjustment: false,
    tolerance: false
  });

  const allChecksCompleted = Object.values(verificationChecks).every(v => v);

  const handleConfirm = () => {
    if (allChecksCompleted) {
      onConfirm();
      // Reset checks
      setVerificationChecks({
        clinicalConditions: false,
        allergies: false,
        dosageAdjustment: false,
        tolerance: false
      });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset checks
    setVerificationChecks({
      clinicalConditions: false,
      allergies: false,
      dosageAdjustment: false,
      tolerance: false
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Repetir Receta - Verificación Médica Obligatoria
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-4 mt-2">
              {/* Información del Paciente */}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Información de la Receta Original</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Paciente:</p>
                    <p className="font-medium text-blue-900">{patientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">N° Receta:</p>
                    <p className="font-medium text-blue-900">{prescriptionNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Fecha emisión:</p>
                    <Badge variant="outline" className="border-blue-500 text-blue-700">
                      <Calendar className="w-3 h-3 mr-1" />
                      {issueDate}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Medicamentos:</p>
                    <Badge variant="outline" className="border-blue-500 text-blue-700">
                      <Pill className="w-3 h-3 mr-1" />
                      {medicinesCount} medicamento{medicinesCount !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Lista de medicamentos a copiar */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-2">Medicamentos a copiar:</p>
                <ul className="space-y-2">
                  {medicinesSummary.map((med, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Pill className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{med}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Alerta de Seguridad */}
              <Alert className="border-amber-500 bg-amber-50">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <AlertDescription>
                  <strong className="text-amber-900">IMPORTANTE - Protocolo de Seguridad del Paciente</strong>
                  <p className="mt-2 text-sm text-amber-800">
                    Los medicamentos se copiarán en modo <strong>BORRADOR</strong> para su revisión médica obligatoria. 
                    Según normativas FDA 21 CFR Part 11 y OMS, debe verificar activamente cada prescripción antes de emitir, 
                    incluso si repite medicamentos previos.
                  </p>
                </AlertDescription>
              </Alert>

              {/* Checklist de Verificación Médica */}
              <div className="bg-white rounded-lg p-4 border-2 border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-5 h-5 text-red-600" />
                  <h4 className="font-medium text-red-900">Checklist de Verificación Médica</h4>
                  <Badge variant="outline" className="ml-auto border-red-500 text-red-700">
                    Obligatorio
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  Confirme que ha verificado cada uno de los siguientes aspectos clínicos:
                </p>

                <div className="space-y-3">
                  {/* Check 1 */}
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id="check-clinical"
                      checked={verificationChecks.clinicalConditions}
                      onCheckedChange={(checked) =>
                        setVerificationChecks(prev => ({ ...prev, clinicalConditions: checked as boolean }))
                      }
                      className="mt-1"
                    />
                    <label
                      htmlFor="check-clinical"
                      className="flex-1 cursor-pointer text-sm"
                    >
                      <strong className="text-gray-900">Condiciones clínicas del paciente</strong>
                      <p className="text-xs text-muted-foreground mt-1">
                        Verifiqué que las condiciones clínicas del paciente no han cambiado significativamente 
                        (función renal, función hepática, nuevas patologías)
                      </p>
                    </label>
                  </div>

                  {/* Check 2 */}
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id="check-allergies"
                      checked={verificationChecks.allergies}
                      onCheckedChange={(checked) =>
                        setVerificationChecks(prev => ({ ...prev, allergies: checked as boolean }))
                      }
                      className="mt-1"
                    />
                    <label
                      htmlFor="check-allergies"
                      className="flex-1 cursor-pointer text-sm"
                    >
                      <strong className="text-gray-900">Alergias y reacciones adversas</strong>
                      <p className="text-xs text-muted-foreground mt-1">
                        Verifiqué que no han aparecido nuevas alergias medicamentosas o reacciones adversas 
                        desde la última prescripción
                      </p>
                    </label>
                  </div>

                  {/* Check 3 */}
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id="check-dosage"
                      checked={verificationChecks.dosageAdjustment}
                      onCheckedChange={(checked) =>
                        setVerificationChecks(prev => ({ ...prev, dosageAdjustment: checked as boolean }))
                      }
                      className="mt-1"
                    />
                    <label
                      htmlFor="check-dosage"
                      className="flex-1 cursor-pointer text-sm"
                    >
                      <strong className="text-gray-900">Ajuste de dosis según evolución</strong>
                      <p className="text-xs text-muted-foreground mt-1">
                        Evalué si se requiere ajustar dosis según respuesta terapéutica, parámetros de laboratorio 
                        o evolución clínica (ej: HbA1c, presión arterial, INR)
                      </p>
                    </label>
                  </div>

                  {/* Check 4 */}
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id="check-tolerance"
                      checked={verificationChecks.tolerance}
                      onCheckedChange={(checked) =>
                        setVerificationChecks(prev => ({ ...prev, tolerance: checked as boolean }))
                      }
                      className="mt-1"
                    />
                    <label
                      htmlFor="check-tolerance"
                      className="flex-1 cursor-pointer text-sm"
                    >
                      <strong className="text-gray-900">Tolerancia y adherencia terapéutica</strong>
                      <p className="text-xs text-muted-foreground mt-1">
                        Confirmé que el paciente tolera bien la medicación actual y mantiene adherencia 
                        al tratamiento prescrito
                      </p>
                    </label>
                  </div>
                </div>

                {/* Indicador de progreso */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Verificaciones completadas:
                    </span>
                    <Badge 
                      variant={allChecksCompleted ? "default" : "outline"}
                      className={allChecksCompleted ? "bg-green-600" : ""}
                    >
                      {allChecksCompleted && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {Object.values(verificationChecks).filter(Boolean).length}/4
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <Alert className="border-blue-200 bg-blue-50">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-xs text-blue-800">
                  <strong>Después de confirmar:</strong> Los medicamentos se cargarán en la tabla de prescripción 
                  con el badge "RECETA REPETIDA". Podrá editar dosis, eliminar o agregar nuevos medicamentos 
                  antes de emitir la receta final.
                </AlertDescription>
              </Alert>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!allChecksCompleted}
            className={allChecksCompleted ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {allChecksCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Continuar y Revisar Medicamentos
              </>
            ) : (
              <>Complete todas las verificaciones</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
