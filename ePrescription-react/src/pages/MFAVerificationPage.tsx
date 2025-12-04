import { useState } from "react";
import { Shield, Smartphone, Mail, Key, CheckCircle2, AlertCircle, ArrowLeft, Clock, Stethoscope } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { authStore } from "../utils/authStore";

interface MFAVerificationPageProps {
  userId: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

export function MFAVerificationPage({ userId, onVerificationSuccess, onBack }: MFAVerificationPageProps) {
  const [mfaMethod, setMfaMethod] = useState<"totp" | "sms" | "email">("totp");
  const [code, setCode] = useState("");
  const [trustDevice, setTrustDevice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Simulación de envío de código
  const handleSendCode = async (method: "sms" | "email") => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const destination = method === "sms" ? "+506 8888-7777" : "dr.martinez@hospital.cr";
      setSuccess(`Código enviado a ${destination}`);
      
      // Cooldown de 30 segundos
      setResendCooldown(30);
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError("Error al enviar el código. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Verificar código MFA
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (code.length !== 6) {
      setError("El código debe tener 6 dígitos");
      return;
    }

    setLoading(true);

    try {
      const result = await authStore.verifyMFA(userId, code, mfaMethod);
      
      if (result.success) {
        setSuccess("Verificación exitosa");
        setTimeout(() => {
          onVerificationSuccess();
        }, 800);
      } else {
        setError(result.error || "Código incorrecto");
        setCode(""); // Limpiar código incorrecto
      }
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit cuando se completan 6 dígitos
  const handleCodeChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setCode(digits);
    
    if (digits.length === 6) {
      // Auto-submit después de un pequeño delay
      setTimeout(() => {
        const form = document.getElementById("mfa-form") as HTMLFormElement;
        form?.requestSubmit();
      }, 300);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo con gradiente médico profesional */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
      
      {/* Patrón de grid médico sutil */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgzNywgOTksIDE5NSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />
      
      {/* Círculos decorativos médicos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-blue-300/5 to-cyan-300/5 rounded-full blur-3xl" />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo y título */}
          <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl mb-4 shadow-2xl animate-float">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-primary mb-2">Verificación de seguridad</h1>
            <p className="text-muted-foreground text-lg">Ingresa tu segundo factor de autenticación</p>
          </div>

          <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-white/95 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-2xl">Autenticación de dos factores (MFA)</CardTitle>
              <CardDescription className="text-base">
                Protege tu cuenta con una capa adicional de seguridad
              </CardDescription>
            </CardHeader>
          
          <CardContent className="pt-0">
            {/* Mensajes de error/éxito */}
            {error && (
              <Alert variant="destructive" className="mb-4 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-success/50 bg-success/5 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">{success}</AlertDescription>
              </Alert>
            )}

            <Tabs value={mfaMethod} onValueChange={(v) => setMfaMethod(v as typeof mfaMethod)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 h-auto p-1 bg-muted/50">
                <TabsTrigger 
                  value="totp" 
                  className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
                >
                  <Key className="w-4 h-4" />
                  App
                </TabsTrigger>
                <TabsTrigger 
                  value="sms" 
                  className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
                >
                  <Smartphone className="w-4 h-4" />
                  SMS
                </TabsTrigger>
                <TabsTrigger 
                  value="email" 
                  className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </TabsTrigger>
              </TabsList>

              <form id="mfa-form" onSubmit={handleVerifyCode} className="space-y-4">
                {/* TOTP (Authenticator App) */}
                <TabsContent value="totp" className="space-y-4 mt-0">
                  <Alert className="bg-primary/5 border-primary/20">
                    <Key className="h-4 w-4 text-primary" />
                    <AlertDescription>
                      Abre tu aplicación de autenticación (Google Authenticator, Microsoft Authenticator, Authy, etc.)
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="totp-code">Código de verificación</Label>
                    <Input
                      id="totp-code"
                      type="text"
                      inputMode="numeric"
                      placeholder="000000"
                      value={code}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      disabled={loading}
                      required
                      maxLength={6}
                      className="text-center text-2xl tracking-widest"
                      autoComplete="one-time-code"
                      autoFocus
                    />
                    <p className="text-sm text-muted-foreground text-center">
                      Ingresa el código de 6 dígitos de tu app
                    </p>
                  </div>
                </TabsContent>

                {/* SMS */}
                <TabsContent value="sms" className="space-y-4 mt-0">
                  <Alert className="bg-primary/5 border-primary/20">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <AlertDescription>
                      Enviaremos un código de verificación a tu teléfono móvil registrado
                    </AlertDescription>
                  </Alert>

                  <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
                    <Smartphone className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm">+506 8888-****</p>
                  </div>

                  {!success && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSendCode("sms")}
                      disabled={loading || resendCooldown > 0}
                    >
                      {resendCooldown > 0 ? (
                        <>
                          <Clock className="w-4 h-4 mr-2" />
                          Reenviar en {resendCooldown}s
                        </>
                      ) : (
                        "Enviar código por SMS"
                      )}
                    </Button>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="sms-code">Código de verificación</Label>
                    <Input
                      id="sms-code"
                      type="text"
                      inputMode="numeric"
                      placeholder="000000"
                      value={code}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      disabled={loading}
                      required
                      maxLength={6}
                      className="text-center text-2xl tracking-widest"
                      autoComplete="one-time-code"
                    />
                    <p className="text-sm text-muted-foreground text-center">
                      El código expira en 5 minutos
                    </p>
                  </div>
                </TabsContent>

                {/* Email */}
                <TabsContent value="email" className="space-y-4 mt-0">
                  <Alert className="bg-primary/5 border-primary/20">
                    <Mail className="h-4 w-4 text-primary" />
                    <AlertDescription>
                      Enviaremos un código de verificación a tu correo electrónico registrado
                    </AlertDescription>
                  </Alert>

                  <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
                    <Mail className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm">dr.martinez@hospital.cr</p>
                  </div>

                  {!success && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSendCode("email")}
                      disabled={loading || resendCooldown > 0}
                    >
                      {resendCooldown > 0 ? (
                        <>
                          <Clock className="w-4 h-4 mr-2" />
                          Reenviar en {resendCooldown}s
                        </>
                      ) : (
                        "Enviar código por Email"
                      )}
                    </Button>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email-code">Código de verificación</Label>
                    <Input
                      id="email-code"
                      type="text"
                      inputMode="numeric"
                      placeholder="000000"
                      value={code}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      disabled={loading}
                      required
                      maxLength={6}
                      className="text-center text-2xl tracking-widest"
                      autoComplete="one-time-code"
                    />
                    <p className="text-sm text-muted-foreground text-center">
                      El código expira en 15 minutos
                    </p>
                  </div>
                </TabsContent>

                {/* Opción de confiar en dispositivo */}
                <div className="flex items-start space-x-2 p-3 bg-muted/30 rounded-lg">
                  <Checkbox 
                    id="trust-device" 
                    checked={trustDevice}
                    onCheckedChange={(checked) => setTrustDevice(checked as boolean)}
                    disabled={loading}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="trust-device"
                      className="text-sm cursor-pointer select-none"
                    >
                      Confiar en este dispositivo por 30 días
                    </label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      No solicitar MFA en este navegador durante un mes
                    </p>
                  </div>
                </div>

                {/* Botón de verificar */}
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all" 
                  disabled={loading || code.length !== 6}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verificando...
                    </div>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Verificar código
                    </>
                  )}
                </Button>
              </form>
            </Tabs>

            {/* Ayuda */}
            <div className="mt-8 pt-6 border-t border-border">
              <Alert className="bg-blue-50/50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-900">
                  ¿No recibes el código? Verifica tu bandeja de spam o contacta a soporte técnico.
                </AlertDescription>
              </Alert>
            </div>

            {/* Botón volver */}
            <div className="mt-6">
              <Button
                type="button"
                variant="ghost"
                className="w-full gap-2 h-11"
                onClick={onBack}
                disabled={loading}
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesión
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer de seguridad y certificaciones */}
        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          {/* Badges de certificación */}
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm shadow-sm">
              HL7 Compatible
            </Badge>
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm shadow-sm">
              FHIR R4
            </Badge>
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm shadow-sm">
              HIPAA Compliant
            </Badge>
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm shadow-sm">
              FDA Certified
            </Badge>
          </div>

          {/* Información de seguridad */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>Conforme a OWASP ASVS y NIST 800-63B guidance</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Stethoscope className="w-3 h-3" />
              <span>ePrescription - Sistema Hospitalario de Recetas Médicas</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
