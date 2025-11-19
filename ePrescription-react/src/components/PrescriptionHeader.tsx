import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { FileText, User, Calendar, Hash, Stethoscope, UserCheck, Shield, Clock, MapPin, Phone, Mail } from "lucide-react";

interface PrescriptionData {
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  patientFirstLastName: string;
  patientSecondLastName: string;
  patientGender: string;
  patientAge: number;
  doctorName: string;
  doctorCode: string;
  issueDate: string;
  issueTime: string;
  status: 'draft' | 'completed';
}

interface PrescriptionHeaderProps {
  prescription: PrescriptionData;
}

export function PrescriptionHeader({ prescription }: PrescriptionHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Receta Finalizada';
      case 'draft': return 'Borrador';
      default: return 'Sin estado';
    }
  };

  // Generar fecha y hora actual de prescripción
  const getCurrentPrescriptionDateTime = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    const displayHours = hours % 12 || 12;
    
    return `${day}/${month}/${year} ${displayHours}:${minutes} ${ampm}`;
  };

  const patientFullName = `${prescription.patientName} ${prescription.patientFirstLastName}${prescription.patientSecondLastName ? ' ' + prescription.patientSecondLastName : ''}`.trim();

  return (
    <div className="space-y-6">
      {/* Header principal con información crítica */}
      <Card className="border-l-4 border-l-primary shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Prescripción Médica Electrónica</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-sm text-gray-600">#{prescription.prescriptionNumber}</p>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">Certificada Digitalmente</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`${getStatusColor(prescription.status)} px-3 py-1 text-sm border`}>
                {getStatusText(prescription.status)}
              </Badge>
              <div className="text-right text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{getCurrentPrescriptionDateTime()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Información del paciente con avatar */}
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 border border-blue-100">
            <div className="flex items-start gap-6">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarImage src="/placeholder-avatar.png" />
                <AvatarFallback className="text-xl bg-primary/10 text-primary font-semibold">
                  {prescription.patientName[0]}{prescription.patientFirstLastName[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{patientFullName}</h2>
                  <div className="flex items-center gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{prescription.patientGender}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{prescription.patientAge} años</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">ID: {prescription.patientId}</span>
                    </div>
                  </div>
                </div>
                
                {/* Información médica adicional */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-blue-200">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Información del Médico</h4>
                    <div className="flex items-center space-x-2">
                      <Stethoscope className="w-4 h-4 text-primary" />
                      <span className="text-sm text-gray-600">{prescription.doctorName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">Código: {prescription.doctorCode}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Información de Contacto</h4>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">+57 (1) 234-5678</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">contacto@hospital.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}