import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  X, 
  User, 
  Calendar, 
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertTriangle,
  Pill,
  FileText,
  Activity,
  Clock,
  UserCircle,
  ShieldAlert,
  Stethoscope,
  Eye,
  Edit,
  FileCheck
} from "lucide-react";

interface PatientData {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  idType: string;
  idNumber: string;
  birthDate: string;
  age: number;
  gender: "M" | "F";
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  lastVisit: string;
  totalPrescriptions: number;
  activePrescriptions: number;
  registrationDate: string;
  status: "active" | "inactive";
}

interface PatientDetailPanelProps {
  patient: PatientData | null;
  isOpen: boolean;
  onClose: () => void;
  onViewProfile?: (patientId: string) => void;
  onViewPrescriptions?: (patientId: string) => void;
  onEdit?: (patientId: string) => void;
}

export function PatientDetailPanel({ 
  patient, 
  isOpen, 
  onClose,
  onViewProfile,
  onViewPrescriptions,
  onEdit
}: PatientDetailPanelProps) {
  
  if (!patient) return null;

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(patient.id);
      onClose();
    }
  };

  const handleViewPrescriptions = () => {
    if (onViewPrescriptions) {
      onViewPrescriptions(patient.id);
      onClose();
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(patient.id);
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-blue-600" />
                Vista Rápida del Paciente
              </SheetTitle>
              <SheetDescription>
                {patient.idType} {patient.idNumber}
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
          {/* Información personal */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{patient.fullName}</h3>
                  <p className="text-sm text-gray-600">{patient.idType} {patient.idNumber}</p>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={patient.status === 'active' 
                  ? 'bg-green-100 text-green-700 border-green-300' 
                  : 'bg-gray-100 text-gray-700 border-gray-300'
                }
              >
                {patient.status === 'active' ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-600">Edad</p>
                <p className="text-sm font-medium">{patient.age} años</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Sexo</p>
                <p className="text-sm font-medium">{patient.gender === 'M' ? 'Masculino' : 'Femenino'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Fecha de nacimiento</p>
                <p className="text-sm font-medium">{patient.birthDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Tipo de sangre</p>
                <p className="text-sm font-medium">{patient.bloodType}</p>
              </div>
            </div>
          </div>

          {/* Información de contacto */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Información de Contacto
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Teléfono</p>
                  <p className="text-sm font-medium">{patient.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="text-sm font-medium">{patient.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-4 h-4 text-gray-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-600">Dirección</p>
                  <p className="text-sm font-medium">{patient.address}</p>
                  <p className="text-xs text-gray-600 mt-1">{patient.city}, {patient.country}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información del seguro */}
          {patient.insuranceProvider && (
            <>
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Seguro Médico
                </h3>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{patient.insuranceProvider}</p>
                  <p className="text-xs text-gray-600 mt-1">Póliza: {patient.insuranceNumber}</p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Alergias */}
          {patient.allergies.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Alergias Conocidas
              </h3>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="space-y-2">
                  {patient.allergies.map((allergy, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                      <p className="text-sm text-red-900 font-medium">{allergy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Condiciones crónicas */}
          {patient.chronicConditions.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-orange-600" />
                Condiciones Crónicas
              </h3>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="space-y-2">
                  {patient.chronicConditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <p className="text-sm text-orange-900">{condition}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Medicación actual */}
          {patient.currentMedications.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Pill className="w-4 h-4 text-blue-600" />
                Medicación Actual
              </h3>
              <div className="space-y-2">
                {patient.currentMedications.map((medication, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900">{medication}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Estadísticas de prescripciones */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Historial de Prescripciones
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <p className="text-xs text-gray-600">Total recetas</p>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{patient.totalPrescriptions}</p>
              </div>

              <div className="p-3 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-100">
                <div className="flex items-center gap-2 mb-1">
                  <FileCheck className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-gray-600">Recetas activas</p>
                </div>
                <p className="text-2xl font-semibold text-gray-900">{patient.activePrescriptions}</p>
              </div>
            </div>

            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Última visita</p>
                  <p className="text-sm font-medium">{patient.lastVisit}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-600">Registrado desde</p>
                  <p className="text-sm font-medium">{patient.registrationDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-2 pt-4">
            <Button 
              onClick={handleViewProfile}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Eye className="w-4 h-4" />
              Ver perfil completo
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={handleViewPrescriptions}
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Ver recetas
              </Button>
              
              <Button 
                onClick={handleEdit}
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}