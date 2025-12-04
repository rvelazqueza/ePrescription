import { CheckCircle2, Mail, Clock, ArrowLeft, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";

interface RegistrationSuccessPageProps {
  email: string;
  onBackToLogin: () => void;
}

export function RegistrationSuccessPage({ email, onBackToLogin }: RegistrationSuccessPageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo con gradiente médico profesional */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
      
      {/* Patrón de grid médico sutil */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgzNywgOTksIDE5NSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />
      
      {/* Círculos decorativos médicos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-300/5 to-cyan-300/5 rounded-full blur-3xl" />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Icono de éxito */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-2xl animate-in zoom-in duration-500">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-success mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">¡Solicitud enviada!</h1>
            <p className="text-muted-foreground text-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">Tu registro está en proceso de revisión</p>
          </div>

          <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-white/95 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-2xl">Solicitud en revisión</CardTitle>
              <CardDescription className="text-base">
                Te notificaremos cuando tu cuenta sea aprobada
              </CardDescription>
            </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Confirmación de envío */}
            <Alert className="border-success/50 bg-gradient-to-r from-green-50 to-emerald-50 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                Hemos recibido tu solicitud de registro exitosamente
              </AlertDescription>
            </Alert>

            {/* Información del proceso */}
            <div className="bg-gradient-to-br from-muted/30 to-muted/50 border border-border rounded-xl p-6 space-y-6 shadow-inner">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl text-white shadow-lg flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4>Correo de confirmación enviado</h4>
                  <p className="text-sm text-muted-foreground">
                    Enviamos un correo a <strong className="text-foreground">{email}</strong> confirmando que recibimos tu solicitud.
                  </p>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl text-white shadow-lg flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4>Tiempo de revisión</h4>
                  <p className="text-sm text-muted-foreground">
                    Un administrador revisará tu solicitud. Este proceso toma aproximadamente <strong className="text-foreground">1-2 días hábiles</strong>.
                  </p>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white shadow-lg flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4>Notificación de aprobación</h4>
                  <p className="text-sm text-muted-foreground">
                    Una vez aprobada tu cuenta, recibirás un correo con instrucciones para acceder al sistema.
                  </p>
                </div>
              </div>
            </div>

            {/* Próximos pasos */}
            <div className="space-y-4">
              <h4 className="text-lg">Próximos pasos</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3 items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg">
                    1
                  </span>
                  <span className="flex-1 pt-1 text-muted-foreground">
                    Revisa tu correo electrónico (incluyendo spam) para confirmar que recibimos tu solicitud
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg">
                    2
                  </span>
                  <span className="flex-1 pt-1 text-muted-foreground">
                    Espera la notificación de aprobación (1-2 días hábiles)
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg">
                    3
                  </span>
                  <span className="flex-1 pt-1 text-muted-foreground">
                    Una vez aprobada, podrás iniciar sesión con las credenciales que configuraste
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg">
                    4
                  </span>
                  <span className="flex-1 pt-1 text-muted-foreground">
                    Si no configuraste MFA durante el registro, el sistema te pedirá hacerlo en tu primer acceso
                  </span>
                </li>
              </ol>
            </div>

            {/* Información de contacto */}
            <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <FileText className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-900">
                <strong className="font-semibold">¿Necesitas ayuda?</strong><br/>
                Si tienes preguntas sobre tu solicitud, contacta a soporte técnico en{" "}
                <a href="mailto:soporte@eprescription.cr" className="text-primary hover:underline font-medium">
                  soporte@eprescription.cr
                </a>
              </AlertDescription>
            </Alert>

            {/* Botón para volver */}
            <Button 
              onClick={onBackToLogin} 
              className="w-full gap-2 h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="w-3 h-3" />
            <span>ePrescription - Sistema Hospitalario de Recetas Médicas</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Certificado bajo normativas HL7, FDA y OMS
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
