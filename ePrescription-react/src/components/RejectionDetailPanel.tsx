import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  X, 
  User, 
  Calendar, 
  Clock, 
  AlertTriangle,
  FileText,
  MessageSquare,
  ShieldAlert,
  FileCheck,
  XCircle,
  Info,
  Printer,
  Download,
  Mail
} from "lucide-react";

interface RejectionDetailData {
  id: string;
  prescriptionNumber: string;
  patientName: string;
  patientId: string;
  rejectionDate: string;
  rejectionTime: string;
  rejectedBy: string;
  rejectedByRole: string;
  category: "medical" | "administrative" | "pharmaceutical" | "patient";
  reason: string;
  reasonCode: string;
  detailedNotes: string;
  doctorName: string;
  medicinesCount: number;
  emittedDate: string;
  notificationSent: boolean;
  requiresAction: boolean;
}

interface RejectionDetailPanelProps {
  rejection: RejectionDetailData | null;
  isOpen: boolean;
  onClose: () => void;
  onPrint?: (id: string) => void;
  onNotifyDoctor?: (id: string) => void;
}

const categoryConfig = {
  medical: {
    label: "Motivo médico",
    color: "bg-red-100 text-red-700 border-red-300",
    icon: ShieldAlert,
    bgColor: "bg-red-50",
    description: "Relacionado con aspectos clínicos o terapéuticos"
  },
  administrative: {
    label: "Motivo administrativo",
    color: "bg-orange-100 text-orange-700 border-orange-300",
    icon: FileText,
    bgColor: "bg-orange-50",
    description: "Documentación o procedimientos administrativos"
  },
  pharmaceutical: {
    label: "Motivo farmacéutico",
    color: "bg-amber-100 text-amber-700 border-amber-300",
    icon: AlertTriangle,
    bgColor: "bg-amber-50",
    description: "Stock, disponibilidad o aspectos farmacéuticos"
  },
  patient: {
    label: "Motivo del paciente",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    icon: User,
    bgColor: "bg-blue-50",
    description: "Decisión o situación del paciente"
  }
};

export function RejectionDetailPanel({ 
  rejection, 
  isOpen, 
  onClose,
  onPrint,
  onNotifyDoctor
}: RejectionDetailPanelProps) {
  
  if (!rejection) return null;

  const categoryInfo = categoryConfig[rejection.category];
  const CategoryIcon = categoryInfo.icon;

  const handlePrint = () => {
    if (onPrint) {
      onPrint(rejection.id);
    }
  };

  const handleNotifyDoctor = () => {
    if (onNotifyDoctor) {
      onNotifyDoctor(rejection.id);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                Detalle de Rechazo
              </SheetTitle>
              <SheetDescription>
                {rejection.prescriptionNumber}
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
          {/* Categoría y motivo principal */}
          <div className={`p-4 ${categoryInfo.bgColor} rounded-lg border ${categoryInfo.color.split(' ').pop()}`}>
            <div className="flex items-start space-x-3">
              <CategoryIcon className={`w-6 h-6 mt-0.5 flex-shrink-0 ${categoryInfo.color.split(' ')[1]}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">{categoryInfo.label}</p>
                  <Badge variant="outline" className={categoryInfo.color}>
                    {rejection.reasonCode}
                  </Badge>
                </div>
                <p className="text-sm font-medium mb-1">{rejection.reason}</p>
                <p className="text-xs opacity-80">{categoryInfo.description}</p>
              </div>
            </div>
          </div>

          {/* Acciones requeridas */}
          {rejection.requiresAction && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-900">Requiere acción</p>
                  <p className="text-sm text-yellow-800 mt-1">
                    Este rechazo requiere seguimiento o acción adicional por parte del médico prescriptor.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Información del paciente */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Información del Paciente
            </h3>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
              <div>
                <p className="text-sm text-gray-600">Nombre completo</p>
                <p className="font-medium text-gray-900">{rejection.patientName}</p>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-600">Identificación</p>
                <p className="text-sm font-medium">{rejection.patientId}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información de la receta */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Información de la Receta
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Médico prescriptor</p>
                  <p className="text-sm font-medium text-gray-900">{rejection.doctorName}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Medicamentos</p>
                  <p className="text-sm font-medium text-gray-900">{rejection.medicinesCount} prescrito(s)</p>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <p className="text-xs">Fecha de emisión</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{rejection.emittedDate}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Detalles del rechazo */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Detalles del Rechazo
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{rejection.detailedNotes}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <p className="text-xs">Fecha de rechazo</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{rejection.rejectionDate}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <p className="text-xs">Hora</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{rejection.rejectionTime}</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Rechazado por</p>
                <p className="text-sm font-medium text-gray-900">{rejection.rejectedBy}</p>
                <p className="text-xs text-gray-600 mt-1">{rejection.rejectedByRole}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Estado de notificación */}
          <div className={`p-4 rounded-lg border ${
            rejection.notificationSent 
              ? 'bg-green-50 border-green-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-start gap-3">
              <Mail className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                rejection.notificationSent ? 'text-green-600' : 'text-gray-600'
              }`} />
              <div>
                <p className={`font-medium ${
                  rejection.notificationSent ? 'text-green-900' : 'text-gray-900'
                }`}>
                  {rejection.notificationSent 
                    ? 'Notificación enviada al médico' 
                    : 'Notificación pendiente'}
                </p>
                <p className={`text-sm mt-1 ${
                  rejection.notificationSent ? 'text-green-800' : 'text-gray-600'
                }`}>
                  {rejection.notificationSent 
                    ? 'El médico prescriptor ha sido notificado del rechazo de esta receta.' 
                    : 'El médico prescriptor aún no ha sido notificado.'}
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3 pt-4">
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

            {!rejection.notificationSent && (
              <Button 
                onClick={handleNotifyDoctor}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="w-4 h-4" />
                Notificar al médico
              </Button>
            )}
          </div>

          {/* Información normativa */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900">Cumplimiento normativo</p>
                <p className="text-sm text-blue-800 mt-1">
                  Este rechazo ha sido registrado según las normativas vigentes (HL7, FDA, OMS) y forma parte del sistema de trazabilidad y auditoría.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}