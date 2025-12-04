import { Shield, Activity, Users, Clock, FileText, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MedicalHeaderProps {
  className?: string;
}

export function MedicalHeader({ className = "" }: MedicalHeaderProps) {
  const currentTime = new Date().toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-white border-b border-blue-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sistema Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Sistema de Prescripción Electrónica
                </h1>
                <p className="text-gray-600 mt-1">
                  Plataforma certificada para prescripciones médicas seguras y trazables
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Activity className="w-3 h-3 mr-1" />
                  Sistema Activo
                </Badge>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-white/60 backdrop-blur-sm border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recetas Hoy</p>
                      <p className="text-xl font-semibold text-gray-900">127</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 backdrop-blur-sm border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pacientes</p>
                      <p className="text-xl font-semibold text-gray-900">89</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 backdrop-blur-sm border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Alertas</p>
                      <p className="text-xl font-semibold text-gray-900">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Medical Image & Time */}
          <div className="space-y-4">
            <Card className="bg-white/60 backdrop-blur-sm border-blue-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1758573467057-955f803660a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcHJlc2NyaXB0aW9uJTIwcGhhcm1hY3l8ZW58MXx8fHwxNzU4ODgxMjk0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Medical Prescription"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-sm font-medium">Prescripción Segura</p>
                    <p className="text-xs opacity-90">Certificada digitalmente</p>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Hora actual</span>
                    </div>
                    <span className="font-semibold text-primary">{currentTime}</span>
                  </div>
                  <p className="text-xs text-gray-500 capitalize">{currentDate}</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Compliance Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Certificaciones</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  HL7 FHIR
                </Badge>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  FDA 21 CFR
                </Badge>
                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                  OMS Standards
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}