import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  X, 
  User, 
  Calendar, 
  Clock, 
  Pill,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Printer,
  Download
} from "lucide-react";

interface VerificationResultData {
  prescriptionNumber: string;
  patientName: string;
  patientId: string;
  emittedDate: string;
  emittedTime: string;
  validUntil: string;
  medicinesCount: number;
  dispensationStatus: "emitted" | "partially_dispensed" | "fully_dispensed" | "cancelled" | "expired";
  age: number;
  gender: string;
  doctorName: string;
  verificationStatus: "valid" | "expired" | "cancelled" | "already_dispensed" | "invalid";
  qrCode?: string;
  token?: string;
  medicines?: Array<{
    name: string;
    dose: string;
    quantity: string;
    dispensed?: boolean;
  }>;
}

interface VerificationResultPanelProps {
  result: VerificationResultData | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToDispensation?: (prescriptionNumber: string) => void;
  onPrint?: (prescriptionNumber: string) => void;
  onNavigate?: (route: string) => void;
}

const verificationStatusConfig = {
  valid: {
    label: "Receta válida",
    color: "bg-green-100 text-green-700 border-green-300",
    icon: CheckCircle2,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-900",
    description: "La receta es válida y puede ser dispensada"
  },
  expired: {
    label: "Receta vencida",
    color: "bg-red-100 text-red-700 border-red-300",
    icon: AlertCircle,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-900",
    description: "La receta ha expirado su período de validez"
  },
  cancelled: {
    label: "Receta anulada",
    color: "bg-red-100 text-red-700 border-red-300",
    icon: XCircle,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-900",
    description: "Esta receta fue anulada por el médico prescriptor"
  },
  already_dispensed: {
    label: "Ya dispensada",
    color: "bg-orange-100 text-orange-700 border-orange-300",
    icon: AlertTriangle,
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-900",
    description: "Esta receta ya fue completamente dispensada"
  },
  invalid: {
    label: "Receta inválida",
    color: "bg-red-100 text-red-700 border-red-300",
    icon: ShieldX,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-900",
    description: "No se pudo verificar la autenticidad de esta receta"
  }
};

export function VerificationResultPanel({ 
  result, 
  isOpen, 
  onClose,
  onProceedToDispensation,
  onPrint,
  onNavigate
}: VerificationResultPanelProps) {
  
  if (!result) return null;

  const statusInfo = verificationStatusConfig[result.verificationStatus];
  const StatusIcon = statusInfo.icon;
  const canDispense = result.verificationStatus === 'valid';

  const handleProceedToDispensation = () => {
    if (onNavigate) {
      // Navegar a la página de registro de dispensación
      onNavigate("/dispensacion/registrar");
      onClose();
    } else if (onProceedToDispensation) {
      // Fallback a la función antigua si existe
      onProceedToDispensation(result.prescriptionNumber);
      onClose();
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint(result.prescriptionNumber);
    }
  };

  // Medicamentos de ejemplo
  const medicines = result.medicines || [
    { name: "Ibuprofeno", dose: "400 mg", quantity: "15 tabletas", dispensed: result.dispensationStatus === 'fully_dispensed' },
    { name: "Amoxicilina", dose: "500 mg", quantity: "14 cápsulas", dispensed: result.dispensationStatus === 'fully_dispensed' },
    { name: "Omeprazol", dose: "20 mg", quantity: "14 tabletas", dispensed: false }
  ].slice(0, result.medicinesCount);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                Resultado de Verificación
              </SheetTitle>
              <SheetDescription>
                {result.prescriptionNumber}
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
          {/* Estado de verificación */}
          <div className={`flex items-start justify-between p-4 ${statusInfo.bgColor} rounded-lg border ${statusInfo.borderColor}`}>
            <div className="flex items-start space-x-3 flex-1">
              <StatusIcon className={`w-6 h-6 mt-0.5 flex-shrink-0 ${statusInfo.textColor}`} />
              <div>
                <p className={`font-semibold ${statusInfo.textColor}`}>{statusInfo.label}</p>
                <p className={`text-sm mt-1 ${statusInfo.textColor}/80`}>
                  {statusInfo.description}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
          </div>

          {/* Información de verificación */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">Datos de verificación</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {result.qrCode && (
                <div>
                  <p className="text-blue-600 font-medium">Código QR</p>
                  <p className="text-blue-800 font-mono">{result.qrCode}</p>
                </div>
              )}
              {result.token && (
                <div>
                  <p className="text-blue-600 font-medium">Token</p>
                  <p className="text-blue-800 font-mono">{result.token}</p>
                </div>
              )}
              <div>
                <p className="text-blue-600 font-medium">Fecha de verificación</p>
                <p className="text-blue-800">{new Date().toLocaleDateString('es-ES')}</p>
              </div>
              <div>
                <p className="text-blue-600 font-medium">Hora</p>
                <p className="text-blue-800">{new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>

          {/* Información del paciente */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Información del Paciente
            </h3>
            <div className="space-y-2 p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
              <div>
                <p className="text-sm text-gray-600">Nombre completo</p>
                <p className="font-medium text-gray-900">{result.patientName}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div>
                  <p className="text-xs text-gray-600">Identificación</p>
                  <p className="text-sm font-medium">{result.patientId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Edad</p>
                  <p className="text-sm font-medium">{result.age} años</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Sexo</p>
                  <p className="text-sm font-medium">{result.gender === 'M' ? 'Masculino' : 'Femenino'}</p>
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
              <p className="text-sm font-medium text-gray-900">{result.doctorName}</p>
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <p className="text-xs text-gray-600">Firma digital verificada</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Medicamentos prescritos */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Medicamentos prescritos ({result.medicinesCount})
            </h3>
            <div className="space-y-2">
              {medicines.map((medicine, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border ${
                    medicine.dispensed 
                      ? 'bg-gradient-to-r from-green-50 to-white border-green-200' 
                      : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{medicine.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {medicine.dose} • {medicine.quantity}
                      </p>
                    </div>
                    {medicine.dispensed && (
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Dispensado
                      </Badge>
                    )}
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
              <p className="text-sm font-medium text-gray-900">{result.emittedDate}</p>
            </div>
            <div className={`p-3 rounded-lg ${result.verificationStatus === 'expired' ? 'bg-red-50' : 'bg-gray-50'}`}>
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                <p className="text-xs">Válida hasta</p>
              </div>
              <p className={`text-sm font-medium ${result.verificationStatus === 'expired' ? 'text-red-900' : 'text-gray-900'}`}>
                {result.validUntil}
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3 pt-4">
            {canDispense ? (
              <>
                <Button 
                  onClick={handleProceedToDispensation}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <ArrowRight className="w-4 h-4" />
                  Proceder a dispensación
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={handlePrint}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Exportar
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-900">No se puede dispensar</p>
                    <p className="text-sm text-yellow-800 mt-1">
                      {result.verificationStatus === 'expired' && 'Esta receta ha expirado su período de validez y no puede ser dispensada.'}
                      {result.verificationStatus === 'cancelled' && 'Esta receta fue anulada por el médico y no puede ser dispensada.'}
                      {result.verificationStatus === 'already_dispensed' && 'Esta receta ya fue completamente dispensada anteriormente.'}
                      {result.verificationStatus === 'invalid' && 'No se pudo verificar la autenticidad de esta receta.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}