import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound, Eye, EyeOff, Shield, Stethoscope } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { authStore } from "../utils/authStore";

interface PasswordRecoveryPageProps {
  onBack: () => void;
  token?: string; // Si viene con token, muestra formulario de reset
}

export function PasswordRecoveryPage({ onBack, token }: PasswordRecoveryPageProps) {
  const [step, setStep] = useState<"request" | "sent" | "reset" | "success">(token ? "reset" : "request");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState(token || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Función para simular clic en link del email
  const handleSimulateEmailLink = () => {
    // Generar token mock válido (más de 20 caracteres)
    const mockToken = `recovery_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    setResetToken(mockToken);
    setStep("reset");
  };

  // Validar fortaleza de contraseña
  const validatePasswordStrength = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 12) {
      return { valid: false, message: "La contraseña debe tener al menos 12 caracteres" };
    }

    let characterTypes = 0;
    if (/[a-z]/.test(password)) characterTypes++;
    if (/[A-Z]/.test(password)) characterTypes++;
    if (/[0-9]/.test(password)) characterTypes++;
    if (/[^a-zA-Z0-9]/.test(password)) characterTypes++;

    if (characterTypes < 3) {
      return { 
        valid: false, 
        message: "Debe incluir al menos 3 tipos: minúsculas, mayúsculas, números y símbolos" 
      };
    }

    // Verificar contraseñas comunes (mock - en producción usar API de breach database)
    const commonPasswords = ["password123", "qwerty123456", "admin123456"];
    if (commonPasswords.some(cp => password.toLowerCase().includes(cp.toLowerCase()))) {
      return { 
        valid: false, 
        message: "Esta contraseña es demasiado común. Elige una más segura." 
      };
    }

    return { valid: true };
  };

  // Solicitar recuperación
  const handleRequestRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await authStore.initiatePasswordRecovery(email);
      
      // Siempre muestra éxito (no revelar si el correo existe)
      setStep("sent");
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Resetear contraseña
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validar coincidencia
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Validar fortaleza
    const validation = validatePasswordStrength(newPassword);
    if (!validation.valid) {
      setError(validation.message || "Contraseña no válida");
      return;
    }

    setLoading(true);

    try {
      const result = await authStore.resetPassword(resetToken, newPassword);
      
      if (result.success) {
        // Cambiar a pantalla de éxito en lugar de redirect automático
        setStep("success");
      } else {
        setError(result.error || "Error al actualizar contraseña");
      }
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Calcular fortaleza visual
  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 8) return { strength: 25, label: "Muy débil", color: "bg-destructive" };
    if (password.length < 12) return { strength: 50, label: "Débil", color: "bg-warning" };
    
    let score = 50;
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^a-zA-Z0-9]/.test(password)) score += 10;
    if (password.length >= 16) score += 10;
    
    if (score < 70) return { strength: score, label: "Regular", color: "bg-warning" };
    if (score < 90) return { strength: score, label: "Buena", color: "bg-success" };
    return { strength: 100, label: "Excelente", color: "bg-success" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

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
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-2xl animate-float ${
              step === "success" 
                ? "bg-gradient-to-br from-green-600 to-emerald-600" 
                : "bg-gradient-to-br from-blue-600 to-cyan-600"
            }`}>
              {step === "success" ? (
                <CheckCircle2 className="w-10 h-10 text-white" />
              ) : (
                <KeyRound className="w-10 h-10 text-white" />
              )}
            </div>
            <h1 className="text-primary mb-2">{step === "success" ? "Cambio exitoso" : "Recuperar contraseña"}</h1>
            <p className="text-muted-foreground text-lg">
              {step === "request" && "Te ayudaremos a recuperar el acceso"}
              {step === "sent" && "Revisa tu correo electrónico"}
              {step === "reset" && "Crea una nueva contraseña segura"}
              {step === "success" && "Ahora puedes iniciar sesión"}
            </p>
          </div>

          <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-white/95 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* PASO 1: Solicitar recuperación */}
          {step === "request" && (
            <>
              <CardHeader className="space-y-3 pb-6">
                <CardTitle className="text-2xl">Solicitar recuperación</CardTitle>
                <CardDescription className="text-base">
                  Ingresa tu correo electrónico registrado
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleRequestRecovery} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu.correo@hospital.cr"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                        className="pl-10"
                        autoFocus
                      />
                    </div>
                  </div>

                  <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm text-blue-900">
                      Por seguridad, si el correo está registrado, te enviaremos un enlace para restablecer tu contraseña. El enlace será válido por 15 minutos.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </div>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar enlace de recuperación
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full gap-2"
                    onClick={onBack}
                    disabled={loading}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al inicio de sesión
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* PASO 2: Enlace enviado */}
          {step === "sent" && (
            <>
              <CardHeader className="space-y-3 pb-6">
                <CardTitle className="text-2xl">Revisa tu correo</CardTitle>
                <CardDescription className="text-base">
                  Enviamos las instrucciones a tu email
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Alert className="mb-6 border-success/50 bg-success/5 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success">
                    Si el correo está registrado en nuestro sistema, recibirás un enlace para restablecer tu contraseña.
                  </AlertDescription>
                </Alert>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-8 text-center space-y-4 shadow-inner">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-float">
                    <Mail className="w-10 h-10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl">Revisa tu bandeja de entrada</h3>
                    <p className="text-sm text-muted-foreground">
                      Hemos enviado un correo a <strong className="text-foreground">{email}</strong> con un enlace para restablecer tu contraseña.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm pt-4">
                    <div className="flex items-center gap-2 text-warning">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Expira en <strong>15 min</strong></span>
                    </div>
                    <div className="w-px h-4 bg-border" />
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <AlertCircle className="w-4 h-4" />
                      <span>Revisa spam</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {/* BOTÓN DEMO: Simular clic en link del email */}
                  <Button
                    type="button"
                    className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
                    onClick={handleSimulateEmailLink}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    🔗 Simular clic en link del email (DEMO)
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11"
                    onClick={() => setStep("request")}
                    disabled={loading}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Solicitar otro enlace
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full gap-2"
                    onClick={onBack}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al inicio de sesión
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* PASO 3: Crear nueva contraseña */}
          {step === "reset" && (
            <>
              <CardHeader className="space-y-3 pb-6">
                <CardTitle className="text-2xl">Crear nueva contraseña</CardTitle>
                <CardDescription className="text-base">
                  Tu contraseña debe cumplir con nuestros requisitos de seguridad
                </CardDescription>
              </CardHeader>
              
              <CardContent>
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

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva contraseña</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Mínimo 12 caracteres"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={loading}
                        required
                        className="pr-10"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={loading}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {/* Indicador de fortaleza */}
                    {newPassword && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Fortaleza</span>
                          <span className={`font-medium ${
                            passwordStrength.strength < 50 ? "text-destructive" :
                            passwordStrength.strength < 70 ? "text-warning" :
                            "text-success"
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repite tu contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Requisitos */}
                  <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                    <p className="text-sm">Requisitos de contraseña:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${newPassword.length >= 12 ? "text-success" : "text-muted-foreground"}`} />
                        Mínimo 12 caracteres
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${(/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)) ? "text-success" : "text-muted-foreground"}`} />
                        Incluir mayúsculas, minúsculas y números
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${/[^a-zA-Z0-9]/.test(newPassword) ? "text-success" : "text-muted-foreground"}`} />
                        Al menos un símbolo especial (!@#$%^&*)
                      </li>
                    </ul>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      Al restablecer tu contraseña, se cerrarán todas tus sesiones activas por seguridad.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Actualizando...
                      </div>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Actualizar contraseña
                      </>
                    )}
                  </Button>
                </form>

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
            </>
          )}

          {/* PASO 4: Confirmación de éxito */}
          {step === "success" && (
            <>
              <CardHeader className="space-y-3 pb-6">
                <CardTitle className="text-2xl">¡Cambio completado con éxito!</CardTitle>
                <CardDescription className="text-base">
                  Por seguridad, cerramos todas tus sesiones activas
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-8 text-center space-y-6 shadow-inner">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-float">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl text-green-900">Tu cuenta está protegida</h3>
                    <p className="text-sm text-green-800 leading-relaxed">
                      Deberás iniciar sesión nuevamente usando tu nueva contraseña. 
                      Esto garantiza que solo tú tengas acceso a tu cuenta.
                    </p>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium text-green-900">Medidas de seguridad aplicadas:</p>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                        Contraseña actualizada correctamente
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                        Todas las sesiones cerradas
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                        Notificación enviada a tu correo
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                        Registro en auditoría de seguridad
                      </li>
                    </ul>
                  </div>
                </div>

                <Alert className="mt-6 bg-blue-50 border-blue-200">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-sm text-blue-900">
                    <strong>Recomendación de seguridad:</strong> Si no solicitaste este cambio, 
                    contacta de inmediato al administrador del sistema.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={onBack}
                  className="w-full h-12 mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all" 
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Continuar al inicio de sesión
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Serás redirigido a la pantalla de login donde podrás usar tu nueva contraseña
                </p>
              </CardContent>
            </>
          )}
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
              <span>Conforme a políticas de seguridad OWASP y NIST 800-63B</span>
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
