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
  Activity
} from "lucide-react";
import { printPrescriptionPDF, downloadPrescriptionPDF } from "../utils/pdfGenerator";
import { EmittedPrescriptionsAPI } from "../utils/emittedPrescriptionsStore";
import { toast } from "sonner@2.0.3";

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
  medicines?: Array<{
    name: string;
    dose: string;
    frequency: string;
    duration: string;
    dispensed?: boolean;
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
  
  if (!prescription) return null;

  const statusInfo = statusConfig[prescription.dispensationStatus];
  const StatusIcon = statusInfo.icon;

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

  // Medicamentos de ejemplo
  const exampleMedicines = prescription.medicines || [
    { name: "Ibuprofeno", dose: "400 mg", frequency: "3 veces al día", duration: "5 días", dispensed: true },
    { name: "Amoxicilina", dose: "500 mg", frequency: "2 veces al día", duration: "7 días", dispensed: true },
    { name: "Omeprazol", dose: "20 mg", frequency: "1 vez al día", duration: "14 días", dispensed: false }
  ].slice(0, prescription.medicinesCount);

  // Verificar si la receta está vencida
  const isExpired = prescription.validUntil 
    ? new Date(prescription.validUntil.split('/').reverse().join('-')) < new Date()
    : false;

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

          <Separator />

          {/* Medicamentos prescritos */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Medicamentos ({prescription.medicinesCount})
            </h3>
            <div className="space-y-3">
              {exampleMedicines.map((medicine, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${
                    medicine.dispensed 
                      ? 'bg-gradient-to-r from-green-50 to-white border-green-200' 
                      : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-gray-900">{medicine.name}</p>
                    {medicine.dispensed && (
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
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
              ))}
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