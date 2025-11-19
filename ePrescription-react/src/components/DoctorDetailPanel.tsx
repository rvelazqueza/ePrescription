import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { EditDoctorDialog } from "./EditDoctorDialog";
import {
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  GraduationCap,
  FileText,
  Shield,
  Activity,
  Clock,
  Edit,
  UserX,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Briefcase,
  Users,
  TrendingUp,
  BarChart3,
  ClipboardList
} from "lucide-react";

interface DoctorDetailPanelProps {
  doctor: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id: string) => void;
  onViewPrescriptions?: (doctorId: string) => void;
}

export function DoctorDetailPanel({ doctor, isOpen, onClose, onEdit, onViewPrescriptions }: DoctorDetailPanelProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!doctor) return null;

  const stats = [
    { label: "Recetas emitidas", value: doctor.totalPrescriptions || 0, icon: FileText, color: "text-blue-600" },
    { label: "Pacientes atendidos", value: doctor.totalPatients || 0, icon: Users, color: "text-green-600" },
    { label: "Este mes", value: doctor.monthlyPrescriptions || 0, icon: TrendingUp, color: "text-purple-600" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <SheetTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl">{doctor.fullName}</h2>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
            </div>
          </SheetTitle>

          {/* Estado del médico */}
          <div className="flex items-center gap-2">
            <Badge
              variant={doctor.status === "active" ? "default" : "secondary"}
              className={
                doctor.status === "active"
                  ? "bg-green-100 text-green-800 border-green-300"
                  : "bg-gray-100 text-gray-800 border-gray-300"
              }
            >
              {doctor.status === "active" ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Activo
                </>
              ) : (
                <>
                  <UserX className="w-3 h-3 mr-1" />
                  Inactivo
                </>
              )}
            </Badge>

            {doctor.certificationStatus === "verified" && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                <Shield className="w-3 h-3 mr-1" />
                Certificado verificado
              </Badge>
            )}

            {doctor.isOnDuty && (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                <Activity className="w-3 h-3 mr-1" />
                En turno
              </Badge>
            )}
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-3">
                  <div className="flex flex-col items-center text-center">
                    <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-lg mt-1">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SheetHeader>

        <Separator className="my-6" />

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="professional">Profesional</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
          </TabsList>

          {/* Tab General */}
          <TabsContent value="general" className="space-y-4 mt-4">
            {/* Información de contacto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Información de contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm">{doctor.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="text-sm">{doctor.phone}</p>
                  </div>
                </div>

                {doctor.officePhone && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Teléfono consultorio</p>
                      <p className="text-sm">{doctor.officePhone}</p>
                    </div>
                  </div>
                )}

                {doctor.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Dirección consultorio</p>
                      <p className="text-sm">{doctor.address}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {doctor.city}, {doctor.country}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Horarios de atención */}
            {doctor.schedule && doctor.schedule.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Horarios de atención
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {doctor.schedule.map((schedule: any, index: number) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <span className="text-sm">{schedule.days}</span>
                        <span className="text-sm text-muted-foreground">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab Profesional */}
          <TabsContent value="professional" className="space-y-4 mt-4">
            {/* Información académica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Formación académica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Stethoscope className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Especialidad principal</p>
                    <p className="text-sm">{doctor.specialty}</p>
                  </div>
                </div>

                {doctor.subspecialties && doctor.subspecialties.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Subespecialidades</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {doctor.subspecialties.map((sub: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {sub}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {doctor.university && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Universidad</p>
                      <p className="text-sm">{doctor.university}</p>
                    </div>
                  </div>
                )}

                {doctor.graduationYear && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Año de graduación</p>
                      <p className="text-sm">{doctor.graduationYear}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Licencias y certificaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Licencias y certificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Número de licencia médica</p>
                    <p className="text-sm">{doctor.licenseNumber}</p>
                  </div>
                </div>

                {doctor.licenseExpiry && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Vencimiento de licencia</p>
                      <p className="text-sm">{doctor.licenseExpiry}</p>
                    </div>
                  </div>
                )}

                {doctor.certifications && doctor.certifications.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-2">Certificaciones adicionales</p>
                      <div className="space-y-2">
                        {doctor.certifications.map((cert: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                            <span className="text-xs">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Experiencia */}
            {doctor.yearsOfExperience && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Experiencia profesional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-lg text-purple-600">{doctor.yearsOfExperience}</span>
                    </div>
                    <div>
                      <p className="text-sm">Años de experiencia</p>
                      <p className="text-xs text-muted-foreground">En ejercicio profesional</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab Actividad */}
          <TabsContent value="activity" className="space-y-4 mt-4">
            {/* Estadísticas de prescripción */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Estadísticas de prescripción
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total de recetas emitidas</span>
                    <span className="text-sm">{doctor.totalPrescriptions || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Recetas este mes</span>
                    <span className="text-sm">{doctor.monthlyPrescriptions || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pacientes únicos</span>
                    <span className="text-sm">{doctor.totalPatients || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Promedio mensual</span>
                    <span className="text-sm">
                      {doctor.averageMonthlyPrescriptions || 0} recetas/mes
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información del sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Información del sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fecha de registro</span>
                  <span className="text-sm">{doctor.registrationDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Última actividad</span>
                  <span className="text-sm">{doctor.lastActivity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ID del sistema</span>
                  <span className="text-sm text-muted-foreground">{doctor.id}</span>
                </div>
              </CardContent>
            </Card>

            {/* Alertas o notas */}
            {doctor.notes && (
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <AlertTriangle className="w-4 h-4" />
                    Notas administrativas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-orange-900">{doctor.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Botones de acción */}
        <div className="mt-6 pt-6 border-t flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar médico
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              if (onViewPrescriptions) {
                onViewPrescriptions(doctor.id);
                onClose();
              }
            }}
          >
            <FileText className="w-4 h-4 mr-2" />
            Ver recetas
          </Button>
        </div>
      </SheetContent>

      {/* Diálogo de edición */}
      <EditDoctorDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        doctor={doctor}
      />
    </Sheet>
  );
}
