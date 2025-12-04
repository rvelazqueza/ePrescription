import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { 
  X, 
  Printer, 
  Download, 
  Ban, 
  User, 
  Calendar, 
  Clock, 
  Pill,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Brain,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  AlertTriangle as WarningIcon,
  Info
} from "lucide-react";
import { printPrescriptionPDF, downloadPrescriptionPDF } from "../utils/pdfGenerator";
import { EmittedPrescriptionsAPI, type AIAssistanceMetadata } from "../utils/emittedPrescriptionsStore";
import { MedicineClassificationAPI } from "../utils/medicineClassificationStore";
import { toast } from "sonner@2.0.3";
import { useState, useEffect } from "react";

interface EmittedPrescriptionData {
  id: string;
  prescriptionNumber: string;
  patientName: string;
  patientId: string;
  emittedDate: string;
  emittedTime: string;
  medicinesCount: number;
  dispensationStatus: "emitted" | "partially_dispensed" | "fully_dispensed" | "cancelled";
  age: number;
  gender: string;
  doctorName: string;
  validUntil: string;
  origin?: 'manual' | 'ai-assisted'; // NUEVO
  aiMetadata?: AIAssistanceMetadata; // NUEVO
  medicines?: Array<{
    name: string;
    dose: string;
    frequency: string;
    duration: string;
    dispensed?: boolean;
    category?: 'narcotics' | 'psychotropics' | 'antimicrobials' | 'controlled' | 'free';
  }>;
}

interface EmittedPrescriptionPanelProps {
  prescription: EmittedPrescriptionData | null;
  isOpen: boolean;
  onClose: () => void;
  onPrint: (id: string) => void;
  onExport: (id: string) => void;
  onCancel?: (id: string) => void;
}

const statusConfig = {
  emitted: {
    label: "Emitida",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    icon: FileCheck,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  partially_dispensed: {
    label: "Parcialmente dispensada",
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    icon: Activity,
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  },
  fully_dispensed: {
    label: "Completamente dispensada",
    color: "bg-green-100 text-green-700 border-green-300",
    icon: CheckCircle2,
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  cancelled: {
    label: "Anulada",
    color: "bg-red-100 text-red-700 border-red-300",
    icon: Ban,
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  }
};

export function EmittedPrescriptionPanel({ 
  prescription, 
  isOpen, 
  onClose, 
  onPrint, 
  onExport,
  onCancel
}: EmittedPrescriptionPanelProps) {
  const [isAIDetailsOpen, setIsAIDetailsOpen] = useState(false);
  const [fullPrescriptionData, setFullPrescriptionData] = useState<any>(null);
  
  // Cargar datos completos desde el store cuando se abre el panel
  useEffect(() => {
    if (isOpen && prescription?.prescriptionNumber) {
      const fullData = EmittedPrescriptionsAPI.getPrescription(prescription.prescriptionNumber);
      if (fullData) {
        setFullPrescriptionData(fullData);
      }
    }
  }, [isOpen, prescription?.prescriptionNumber]);

  if (!prescription) return null;

  const statusInfo = statusConfig[prescription.dispensationStatus];
  const StatusIcon = statusInfo.icon;
  const isAIAssisted = fullPrescriptionData?.origin === 'ai-assisted' || prescription.origin === 'ai-assisted';
  const aiMetadata = fullPrescriptionData?.aiMetadata || prescription.aiMetadata;

  const handlePrint = () => {
    // Obtener datos completos de la prescripción desde el store
    const fullPrescriptionData = EmittedPrescriptionsAPI.getPrescription(prescription.prescriptionNumber);
    
    if (fullPrescriptionData) {
      // Generar ventana de impresión
      printPrescriptionPDF(fullPrescriptionData);
      
      // Mostrar confirmación
      toast.success("Reimprimiendo receta", {
        description: "Se abrirá una nueva ventana con la receta lista para imprimir",
        duration: 3000
      });
    } else {
      // Si no se encuentra en el store, llamar al callback original
      toast.error("No se pudo cargar la receta", {
        description: "Intente nuevamente más tarde",
        duration: 3000
      });
      onPrint(prescription.id);
    }
  };

  const handleExport = () => {
    // Obtener datos completos de la prescripción desde el store
    const fullPrescriptionData = EmittedPrescriptionsAPI.getPrescription(prescription.prescriptionNumber);
    
    if (fullPrescriptionData) {
      // Generar y descargar PDF automáticamente
      downloadPrescriptionPDF(fullPrescriptionData);
      
      // Mostrar confirmación
      toast.success("Exportando PDF", {
        description: "Se abrirá el diálogo de impresión. Seleccione 'Guardar como PDF' para descargar el archivo",
        duration: 4000
      });
    } else {
      // Si no se encuentra en el store, llamar al callback original
      toast.error("No se pudo cargar la receta", {
        description: "Intente nuevamente más tarde",
        duration: 3000
      });
      onExport(prescription.id);
    }
  };

  const handleCancel = () => {
    if (onCancel && confirm('¿Está seguro de que desea anular esta receta? Esta acción no se puede deshacer.')) {
      onCancel(prescription.id);
      onClose();
    }
  };

  // Obtener medicamentos reales desde el store o usar los del objeto prescription
  const realMedicines = fullPrescriptionData?.medicines || prescription.medicines || [];
  
  // Mapear los medicamentos a un formato simplificado para el display
  const exampleMedicines = realMedicines.map((med: any) => ({
    name: med.genericName || med.name,
    dose: med.dose,
    frequency: med.frequency,
    duration: med.duration,
    dispensed: med.dispensationStatus === 'dispensed',
    category: med.category
  }));

  // Verificar si la receta está vencida
  const isExpired = prescription.validUntil 
    ? new Date(prescription.validUntil.split('/').reverse().join('-')) < new Date()
    : false;

  // Función helper para obtener categoría del medicamento
  const getMedicineCategory = (medicineName: string): 'narcotics' | 'psychotropics' | 'antimicrobials' | 'controlled' | 'free' | null => {
    const info = MedicineClassificationAPI.getMedicineInfo(medicineName);
    if (!info) return null;
    
    return info.category as 'narcotics' | 'psychotropics' | 'antimicrobials' | 'controlled' | 'free';
  };

  // Función helper para obtener el texto de la categoría
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      narcotics: '⚠️ Estupefaciente',
      psychotropics: '🧠 Psicotrópico',
      antimicrobials: '💊 Antimicrobiano',
      controlled: '🔒 Controlado',
      free: '✓ Libre'
    };
    return labels[category] || category;
  };

  // Función helper para obtener el color de la categoría
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      narcotics: 'bg-red-100 text-red-800 border-red-300',
      psychotropics: 'bg-orange-100 text-orange-800 border-orange-300',
      antimicrobials: 'bg-blue-100 text-blue-800 border-blue-300',
      controlled: 'bg-purple-100 text-purple-800 border-purple-300',
      free: 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                Receta Emitida
              </SheetTitle>
              <SheetDescription>
                {prescription.prescriptionNumber}
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
          {/* Estado de la receta */}
          <div className={`flex items-center justify-between p-4 ${statusInfo.bgColor} rounded-lg border ${statusInfo.borderColor}`}>
            <div className="flex items-center space-x-2">
              <StatusIcon className="w-5 h-5 text-gray-700" />
              <div>
                <p className="font-medium text-gray-900">Estado de la receta</p>
                <p className="text-xs text-gray-700">Emitida: {prescription.emittedDate} {prescription.emittedTime}</p>
              </div>
            </div>
            <Badge variant="outline" className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
          </div>

          {/* Alerta de vencimiento */}
          {isExpired && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-900">Receta vencida</p>
                <p className="text-xs text-red-700">Validez expiró el {prescription.validUntil}</p>
              </div>
            </div>
          )}

          {/* Información del paciente */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Información del Paciente
            </h3>
            <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div>
                <p className="text-sm text-gray-600">Nombre completo</p>
                <p className="font-medium text-gray-900">{prescription.patientName}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div>
                  <p className="text-xs text-gray-600">Identificación</p>
                  <p className="text-sm font-medium">{prescription.patientId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Edad</p>
                  <p className="text-sm font-medium">{prescription.age} años</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Sexo</p>
                  <p className="text-sm font-medium">{prescription.gender === 'M' ? 'Masculino' : 'Femenino'}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Badge de origen (Manual / IA-Asistida) */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-700">Origen de la prescripción</span>
            <Badge 
              variant="outline" 
              className={isAIAssisted 
                ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-300" 
                : "bg-gray-100 text-gray-700 border-gray-300"
              }
            >
              {isAIAssisted ? (
                <>
                  <Brain className="w-3 h-3 mr-1" />
                  IA-Asistida
                </>
              ) : (
                <>
                  ✍️ Manual
                </>
              )}
            </Badge>
          </div>

          {/* Médico prescriptor */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Médico Prescriptor
            </h3>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{prescription.doctorName}</p>
              <p className="text-xs text-gray-600 mt-1">Firma digital verificada</p>
            </div>
          </div>

          {/* Detalles de Asistencia IA - Sección colapsable */}
          {isAIAssisted && aiMetadata && (
            <>
              <Separator />
              <Collapsible open={isAIDetailsOpen} onOpenChange={setIsAIDetailsOpen}>
                <div className="border-2 border-purple-200 rounded-lg overflow-hidden">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <h3 className="font-medium text-purple-900">Detalles de Asistencia IA</h3>
                      </div>
                      {isAIDetailsOpen ? (
                        <ChevronUp className="w-5 h-5 text-purple-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="p-4 space-y-4 bg-white">
                      {/* Modelo y confianza */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Brain className="w-4 h-4 text-blue-600" />
                            <p className="text-xs text-blue-700">Modelo usado</p>
                          </div>
                          <p className="text-sm font-medium text-blue-900">{aiMetadata.modelUsed}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="w-4 h-4 text-green-600" />
                            <p className="text-xs text-green-700">Confianza</p>
                          </div>
                          <p className="text-sm font-medium text-green-900">
                            {(aiMetadata.confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      {/* Diagnóstico sugerido */}
                      {aiMetadata.suggestedDiagnosisCIE10 && (
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                          <p className="text-xs text-purple-700 mb-1">Diagnóstico CIE-10 sugerido</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono bg-white border-purple-300 text-purple-700">
                              {aiMetadata.suggestedDiagnosisCIE10}
                            </Badge>
                            <p className="text-sm text-purple-900">{aiMetadata.suggestedDiagnosisDescription}</p>
                          </div>
                        </div>
                      )}

                      {/* Descripción clínica procesada */}
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-700 mb-1">Descripción clínica procesada por NLP</p>
                        <p className="text-sm text-gray-900 italic">"{aiMetadata.clinicalDescriptionProcessed}"</p>
                      </div>

                      {/* Métricas de sugerencias */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 bg-blue-50 rounded border border-blue-100 text-center">
                          <p className="text-lg font-semibold text-blue-700">{aiMetadata.medicationsSuggested}</p>
                          <p className="text-xs text-blue-600">Sugeridos</p>
                        </div>
                        <div className="p-2 bg-green-50 rounded border border-green-100 text-center">
                          <p className="text-lg font-semibold text-green-700">{aiMetadata.medicationsAccepted}</p>
                          <p className="text-xs text-green-600">Aceptados</p>
                        </div>
                        <div className="p-2 bg-yellow-50 rounded border border-yellow-100 text-center">
                          <p className="text-lg font-semibold text-yellow-700">{aiMetadata.medicationsModified}</p>
                          <p className="text-xs text-yellow-600">Modificados</p>
                        </div>
                      </div>

                      {/* Interacciones y contraindicaciones */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-cyan-50 rounded border border-cyan-100">
                          <span className="text-sm text-cyan-900">Interacciones detectadas</span>
                          <Badge variant="outline" className="bg-cyan-100 text-cyan-700 border-cyan-300">
                            {aiMetadata.interactionsDetected}
                          </Badge>
                        </div>
                        {aiMetadata.contraindicationsDetected.length > 0 && (
                          <div className="p-2 bg-orange-50 rounded border border-orange-200">
                            <div className="flex items-center gap-2 mb-1">
                              <WarningIcon className="w-4 h-4 text-orange-600" />
                              <span className="text-sm font-medium text-orange-900">Contraindicaciones detectadas</span>
                            </div>
                            <ul className="text-xs text-orange-700 ml-6 list-disc">
                              {aiMetadata.contraindicationsDetected.map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Feedback del usuario */}
                      {aiMetadata.userFeedback && (
                        <div className={`p-3 rounded-lg border ${
                          aiMetadata.userFeedback === 'helpful' 
                            ? 'bg-green-50 border-green-200'
                            : aiMetadata.userFeedback === 'neutral'
                              ? 'bg-gray-50 border-gray-200'
                              : 'bg-red-50 border-red-200'
                        }`}>
                          <p className="text-xs text-gray-700 mb-1">Feedback del médico</p>
                          <p className="text-sm font-medium">
                            {aiMetadata.userFeedback === 'helpful' && '👍 Útil'}
                            {aiMetadata.userFeedback === 'neutral' && '😐 Neutral'}
                            {aiMetadata.userFeedback === 'not-helpful' && '👎 No útil'}
                          </p>
                        </div>
                      )}

                      {/* Timestamp de procesamiento */}
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Procesado por IA: {new Date(aiMetadata.nlpProcessingTimestamp).toLocaleString('es-CR')}
                        </p>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </>
          )}

          <Separator />

          {/* Medicamentos prescritos */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Medicamentos ({prescription.medicinesCount})
            </h3>
            <div className="space-y-3">
              {exampleMedicines.map((medicine, index) => {
                const category = medicine.category || getMedicineCategory(medicine.name);
                
                return (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border ${
                      medicine.dispensed 
                        ? 'bg-gradient-to-r from-green-50 to-white border-green-200' 
                        : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-900">{medicine.name}</p>
                          {category && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getCategoryColor(category)}`}
                            >
                              {getCategoryLabel(category)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {medicine.dispensed && (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs ml-2">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Dispensado
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
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
                <p className="text-xs">Fecha de emisión</p>
              </div>
              <p className="text-sm font-medium text-gray-900">{prescription.emittedDate}</p>
            </div>
            <div className={`p-3 rounded-lg ${isExpired ? 'bg-red-50' : 'bg-gray-50'}`}>
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                <p className="text-xs">Válida hasta</p>
              </div>
              <p className={`text-sm font-medium ${isExpired ? 'text-red-900' : 'text-gray-900'}`}>
                {prescription.validUntil}
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Printer className="w-4 h-4" />
              Reimprimir receta
            </Button>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleExport}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar PDF
              </Button>
              
              {onCancel && prescription.dispensationStatus === 'emitted' && !isExpired && (
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Ban className="w-4 h-4" />
                  Anular
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}