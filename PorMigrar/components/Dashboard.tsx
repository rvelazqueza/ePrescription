import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { SystemBanner } from "./SystemBanner";
import { MedicalHeader } from "./MedicalHeader";
import { Activity, Users, FileText, Pill, TrendingUp, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Dashboard() {
  // Datos mock para el dashboard
  const recentPrescriptions = [
    { id: "RX-2025-009847", patient: "María Elena González", status: "Completada", time: "10:32 AM" },
    { id: "RX-2025-009846", patient: "Carlos Rodríguez López", status: "Borrador", time: "09:15 AM" },
    { id: "RX-2025-009845", patient: "Ana Sofía Martínez", status: "Completada", time: "08:45 AM" },
  ];

  const todayStats = {
    prescriptions: 127,
    patients: 89,
    medications: 234,
    alerts: 3
  };

  return (
    <div className="space-y-6">
      {/* System Banner */}
      <SystemBanner />
      
      {/* Medical Header */}
      <MedicalHeader />
      
      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        {/* Quick Actions */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm border border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Acciones Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-primary/20 hover:border-primary/40">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Nueva Prescripción</h3>
                    <p className="text-sm text-gray-600">Crear receta médica</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-green-200 hover:border-green-400">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Buscar Paciente</h3>
                    <p className="text-sm text-gray-600">Historial médico</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-purple-200 hover:border-purple-400">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Pill className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Inventario</h3>
                    <p className="text-sm text-gray-600">Medicamentos disponibles</p>
                  </div>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Prescripciones Hoy</p>
                  <p className="text-3xl font-bold text-blue-600">{todayStats.prescriptions}</p>
                  <p className="text-xs text-green-600 mt-1">+12% vs ayer</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-gradient-to-br from-green-50 to-white border border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pacientes Atendidos</p>
                  <p className="text-3xl font-bold text-green-600">{todayStats.patients}</p>
                  <p className="text-xs text-green-600 mt-1">+8% vs ayer</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-white border border-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Medicamentos</p>
                  <p className="text-3xl font-bold text-purple-600">{todayStats.medications}</p>
                  <p className="text-xs text-green-600 mt-1">+5% vs ayer</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Pill className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-gradient-to-br from-orange-50 to-white border border-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Alertas Pendientes</p>
                  <p className="text-3xl font-bold text-orange-600">{todayStats.alerts}</p>
                  <p className="text-xs text-orange-600 mt-1">Requiere atención</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span>Prescripciones Recientes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{prescription.patient}</p>
                      <p className="text-sm text-gray-600">{prescription.id}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={prescription.status === "Completada" ? "default" : "secondary"}
                        className={prescription.status === "Completada" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                      >
                        {prescription.status === "Completada" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {prescription.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{prescription.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-white/90 backdrop-blur-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Rendimiento del Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tiempo de respuesta</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">&lt; 100ms</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Disponibilidad</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">99.9%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sincronización HL7</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Activa</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Certificación Digital</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Válida</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}