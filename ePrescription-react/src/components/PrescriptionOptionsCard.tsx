import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  FileText, 
  RefreshCw, 
  Sparkles, 
  Clock, 
  Pill,
  AlertTriangle,
  Info,
  Calendar,
  User
} from "lucide-react";

interface LastPrescription {
  prescriptionNumber: string;
  issueDate: string;
  daysAgo: number;
  medicinesCount: number;
  medicinesSummary: string[];
}

interface PrescriptionOptionsCardProps {
  patientName: string;
  lastPrescription?: LastPrescription;
  onNewPrescription: () => void;
  onRepeatLastPrescription: () => void;
  onUseAIAssistant: () => void;
}

export function PrescriptionOptionsCard({
  patientName,
  lastPrescription,
  onNewPrescription,
  onRepeatLastPrescription,
  onUseAIAssistant
}: PrescriptionOptionsCardProps) {
  return (
    <div className="space-y-4">
      {/* Historial de Prescripciones (si existe) */}
      {lastPrescription && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <CardTitle className="text-base text-amber-900">Historial de Prescripciones</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Última receta:</p>
                <p className="font-medium text-amber-900">{lastPrescription.prescriptionNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fecha emisión:</p>
                <p className="font-medium text-amber-900">{lastPrescription.issueDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Antigüedad:</p>
                <Badge variant="outline" className="border-amber-500 text-amber-700">
                  <Calendar className="w-3 h-3 mr-1" />
                  Hace {lastPrescription.daysAgo} días
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Medicamentos:</p>
                <Badge variant="outline" className="border-amber-500 text-amber-700">
                  <Pill className="w-3 h-3 mr-1" />
                  {lastPrescription.medicinesCount} medicamento{lastPrescription.medicinesCount !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>

            {/* Resumen de medicamentos */}
            <div className="bg-white rounded-lg p-3 border border-amber-200">
              <p className="text-xs text-muted-foreground mb-2">Medicamentos prescritos:</p>
              <ul className="text-xs space-y-1">
                {lastPrescription.medicinesSummary.map((med, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="text-amber-900">{med}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Opciones de Prescripción */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Opción 1: Nueva Prescripción */}
        <Card className="border-2 hover:border-blue-400 transition-all cursor-pointer group">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <Badge variant="outline" className="text-xs">Manual</Badge>
            </div>
            <CardTitle className="text-lg">Nueva Prescripción</CardTitle>
            <CardDescription className="text-sm">
              Agregar uno o más medicamentos de una sola vez con formulario rápido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={onNewPrescription}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Pill className="w-4 h-4 mr-2" />
              Agregar Medicamentos
            </Button>
            <ul className="mt-3 text-xs text-muted-foreground space-y-1">
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5" />
                <span>Formulario organizado por categorías</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5" />
                <span>Agregar múltiples medicamentos</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5" />
                <span>Generación automática de recetas</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Opción 2: Repetir Última Receta (solo si existe) */}
        {lastPrescription && (
          <Card className="border-2 hover:border-amber-400 transition-all cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                  <RefreshCw className="w-6 h-6 text-amber-600" />
                </div>
                <Badge variant="outline" className="text-xs border-amber-500 text-amber-700">
                  Paciente Crónico
                </Badge>
              </div>
              <CardTitle className="text-lg">Repetir Última Receta</CardTitle>
              <CardDescription className="text-sm">
                Copiar medicamentos de la receta anterior para revisión y ajustes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={onRepeatLastPrescription}
                variant="outline"
                className="w-full border-amber-500 text-amber-700 hover:bg-amber-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Repetir y Revisar
              </Button>
              <Alert className="mt-3 py-2 border-amber-200 bg-amber-50">
                <AlertTriangle className="h-3 w-3 text-amber-600" />
                <AlertDescription className="text-xs">
                  Se copiarán {lastPrescription.medicinesCount} medicamento{lastPrescription.medicinesCount !== 1 ? 's' : ''} para su revisión médica obligatoria
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Opción 3: Asistente IA */}
        <Card className="border-2 hover:border-purple-400 transition-all cursor-pointer group">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <Badge variant="outline" className="text-xs border-purple-500 text-purple-700 bg-purple-50">
                IA
              </Badge>
            </div>
            <CardTitle className="text-lg">Asistente IA</CardTitle>
            <CardDescription className="text-sm">
              Obtener sugerencias de medicamentos basadas en descripción clínica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={onUseAIAssistant}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Usar Asistente IA
            </Button>
            <ul className="mt-3 text-xs text-muted-foreground space-y-1">
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5" />
                <span>Análisis NLP de síntomas</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5" />
                <span>Sugerencias CIE-10</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5" />
                <span>Revisión y modificación</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Si no hay última receta, agregar un card informativo */}
        {!lastPrescription && (
          <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Info className="w-6 h-6 text-gray-500" />
                </div>
              </div>
              <CardTitle className="text-lg text-gray-600">Primera Prescripción</CardTitle>
              <CardDescription className="text-sm">
                Este paciente no tiene recetas previas en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="border-gray-200 bg-white">
                <Info className="h-4 w-4 text-gray-500" />
                <AlertDescription className="text-xs text-gray-600">
                  La opción "Repetir última receta" estará disponible después de emitir la primera prescripción
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
