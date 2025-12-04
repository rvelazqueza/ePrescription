import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
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
  FileEdit,
  Edit3,
  Copy,
  Trash2,
  QrCode,
  Key
} from "lucide-react";
import { downloadPrescriptionPDF, printPrescriptionPDF } from "../utils/pdfGenerator";
import { EmittedPrescriptionsAPI } from "../utils/emittedPrescriptionsStore";
import { toast } from "sonner@2.0.3";

interface UniversalPrescriptionData {
  id: string;
  prescriptionNumber: string;
  patientName: string;
  patientId: string;
  date: string;
  time?: string;
  medicinesCount: number;
  status: "draft" | "emitted" | "partially_dispensed" | "fully_dispensed" | "cancelled";
  age: number;
  gender: string;
  doctorName: string;
  validUntil?: string;
  qrCode?: string;
  token?: string;
}

interface UniversalPrescriptionPanelProps {
  prescription: UniversalPrescriptionData | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPrint?: (id: string) => void;
  onExport?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const statusConfig = {
  draft: {
    label: "Borrador",
    color: "bg-orange-100 text-orange-700 border-orange-300",
    icon: FileEdit,
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
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
    icon: AlertCircle,
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

export function UniversalPrescriptionPanel({ 
  prescription, 
  isOpen, 
  onClose,
  onEdit,
  onDuplicate,
  onDelete,
  onPrint,
  onExport,
  onCancel
}: UniversalPrescriptionPanelProps) {
  
  if (!prescription) return null;

  const statusInfo = statusConfig[prescription.status];
  const StatusIcon = statusInfo.icon;
  const isDraft = prescription.status === 'draft';
  const isEmitted = prescription.status === 'emitted';
  const isCancelled = prescription.status === 'cancelled';

  // Función para exportar PDF
  const handleExport = () => {
    // Solo permitir exportar recetas emitidas (no borradores)
    if (isDraft) {
      toast.error("No se puede exportar un borrador", {
        description: "Solo las recetas emitidas pueden ser exportadas como PDF",
        duration: 3000
      });
      return;
    }

    // Obtener datos completos de la prescripción desde el store
    const fullPrescriptionData = EmittedPrescriptionsAPI.getPrescription(prescription.prescriptionNumber);
    
    if (fullPrescriptionData) {
      try {
        // Generar y descargar PDF automáticamente
        downloadPrescriptionPDF(fullPrescriptionData);
        
        // Mostrar confirmación
        toast.success("Exportando PDF", {
          description: "Se ha abierto el diálogo de impresión. Seleccione 'Guardar como PDF' para descargar el archivo",
          duration: 4000
        });
      } catch (error) {
        console.error("Error al exportar PDF:", error);
        toast.error("Error al exportar", {
          description: "Ocurrió un error al generar el PDF",
          duration: 3000
        });
      }
    } else {
      toast.error("No se pudo cargar la receta", {
        description: "Los datos completos de la receta no están disponibles en el sistema",
        duration: 3000
      });
    }
  };

  // Función para imprimir/reimprimir receta
  const handlePrint = () => {
    // Solo permitir imprimir recetas emitidas (no borradores)
    if (isDraft) {
      toast.error("No se puede imprimir un borrador", {
        description: "Solo las recetas emitidas pueden ser impresas",
        duration: 3000
      });
      return;
    }

    // Obtener datos completos de la prescripción desde el store
    const fullPrescriptionData = EmittedPrescriptionsAPI.getPrescription(prescription.prescriptionNumber);
    
    if (fullPrescriptionData) {
      try {
        // Generar ventana de impresión
        printPrescriptionPDF(fullPrescriptionData);
        
        // Mostrar confirmación
        toast.success(isEmitted ? "Imprimiendo receta" : "Reimprimiendo receta", {
          description: "Se ha abierto una nueva ventana con la receta lista para imprimir",
          duration: 3000
        });
      } catch (error) {
        console.error("Error al imprimir receta:", error);
        toast.error("Error al imprimir", {
          description: "Ocurrió un error al generar la ventana de impresión",
          duration: 3000
        });
      }
    } else {
      toast.error("No se pudo cargar la receta", {
        description: "Los datos completos de la receta no están disponibles en el sistema",
        duration: 3000
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <StatusIcon className="w-5 h-5" />
                {isDraft ? 'Borrador de Receta' : 'Receta'}
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
                <p className="text-xs text-gray-700">
                  {isDraft ? `Última modificación: ${prescription.date} ${prescription.time || ''}` : `Emitida: ${prescription.date} ${prescription.time || ''}`}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={statusInfo.color}>
              {statusInfo.label}
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

          {/* Médico prescriptor */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Médico Prescriptor
            </h3>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{prescription.doctorName}</p>
              {!isDraft && (
                <p className="text-xs text-gray-600 mt-1">Firma digital verificada</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Medicamentos */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Medicamentos
            </h3>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-center">
                <p className="text-3xl font-semibold text-purple-900">{prescription.medicinesCount}</p>
                <p className="text-sm text-purple-700 mt-1">medicamento{prescription.medicinesCount !== 1 ? 's' : ''} prescrito{prescription.medicinesCount !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información de fechas */}
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                <p className="text-xs">{isDraft ? 'Última modificación' : 'Fecha de emisión'}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">{prescription.date}</p>
            </div>
            
            {prescription.validUntil && !isDraft && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <p className="text-xs">Válida hasta</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{prescription.validUntil}</p>
              </div>
            )}
          </div>

          {/* Código QR y Token de seguridad - Solo para recetas emitidas */}
          {!isDraft && (prescription.qrCode || prescription.token) && (
            <>
              <Separator />
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Verificación de Autenticidad
                </h3>
                <div className="space-y-3">
                  {prescription.qrCode && (
                    <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg border border-cyan-300">
                          <QrCode className="w-8 h-8 text-cyan-700" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <QrCode className="w-4 h-4 text-cyan-700" />
                            <p className="text-xs text-cyan-800 font-medium">Código QR</p>
                          </div>
                          <p className="text-sm font-mono font-semibold text-cyan-900">{prescription.qrCode}</p>
                          <p className="text-xs text-cyan-700 mt-1">Escanee este código para verificar la receta</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {prescription.token && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-lg border border-blue-300">
                          <Key className="w-6 h-6 text-blue-700" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Key className="w-4 h-4 text-blue-700" />
                            <p className="text-xs text-blue-800 font-medium">Token de verificación</p>
                          </div>
                          <p className="text-sm font-mono font-semibold text-blue-900">{prescription.token}</p>
                          <p className="text-xs text-blue-700 mt-1">Use este token para verificación manual</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Botones de acción */}
          <div className="space-y-3 pt-4">
            {isDraft && onEdit && (
              <Button 
                onClick={() => onEdit(prescription.id)}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
                size="lg"
              >
                <Edit3 className="w-4 h-4" />
                Continuar editando
              </Button>
            )}

            {!isDraft && !isCancelled && (
              <Button 
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
                size="lg"
              >
                <Printer className="w-4 h-4" />
                Reimprimir receta
              </Button>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              {!isDraft && !isCancelled && (
                <Button 
                  onClick={handleExport}
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar PDF
                </Button>
              )}

              {onDuplicate && (
                <Button 
                  onClick={() => onDuplicate(prescription.id)}
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicar
                </Button>
              )}
            </div>

            {isDraft && onDelete && (
              <Button 
                onClick={() => onDelete(prescription.id)}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar borrador
              </Button>
            )}

            {isEmitted && onCancel && (
              <Button 
                onClick={() => onCancel(prescription.id)}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Ban className="w-4 h-4" />
                Anular receta
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
