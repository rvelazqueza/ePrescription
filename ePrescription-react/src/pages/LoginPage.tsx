import { useState } from "react";
import { Eye, EyeOff, Shield, KeyRound, AlertCircle, CheckCircle2, Info, Activity, Lock, Users, Globe, Sparkles, Heart, Stethoscope } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Checkbox } from "../components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { authStore } from "../utils/authStore";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface LoginPageProps {
  onLoginSuccess: (userId: string, requiresMFA: boolean) => void;
  onNavigateToRegister: () => void;
  onNavigateToRecovery: () => void;
}

export function LoginPage({ onLoginSuccess, onNavigateToRegister, onNavigateToRecovery }: LoginPageProps) {
  const [authMethod, setAuthMethod] = useState<"password" | "gaudi">("password");
  
  // Password login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  
  // GAUDI login state
  const [cedula, setCedula] = useState("");
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Detectar Caps Lock
  const handleKeyPress = (e: React.KeyboardEvent) => {
    setCapsLockOn(e.getModifierState("CapsLock"));
  };

  // Login con usuario y contraseña
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const result = await authStore.login(username, password);
      
      if (result.success && result.userId) {
        setSuccess("Credenciales verificadas");
        setTimeout(() => {
          onLoginSuccess(result.userId!, result.requiresMFA || false);
        }, 500);
      } else {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Login con firma digital GAUDI
  const handleGaudiLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validar formato de cédula
    if (!/^\d-\d{4}-\d{4}$/.test(cedula)) {
      setError("Ingresa una cédula válida con formato: 0-0000-0000");
      return;
    }
    
    setLoading(true);

    try {
      // Simulación: en producción aquí se invocaría el componente GAUDI oficial
      // y se validaría la firma digital con el BCCR
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSignatureData = "mock-signature-data";
      const result = await authStore.validateGaudiSignature(cedula, mockSignatureData);
      
      if (result.success && result.userId) {
        setSuccess("Firma digital verificada exitosamente");
        setTimeout(() => {
          onLoginSuccess(result.userId!, false); // GAUDI no requiere MFA adicional
        }, 800);
      } else {
        setError(result.error || "No se pudo verificar la firma digital");
      }
    } catch (err) {
      setError("Error al procesar la firma digital. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo con gradiente médico profesional */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
      
      {/* Patrón de grid médico sutil */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgzNywgOTksIDE5NSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />
      
      {/* Círculos decorativos médicos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-300/5 to-cyan-300/5 rounded-full blur-3xl" />

      {/* Contenedor principal con dos columnas */}
      <div className="relative min-h-screen flex">
        {/* Columna izquierda: Branding e información */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 relative overflow-hidden">
          {/* Imagen de fondo con overlay */}
          <div className="absolute inset-0 opacity-20">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1758691461888-b74515208d7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Medical Technology"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Overlay oscuro para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-800/50 to-cyan-900/40" />
          
          {/* Patrón de cruz médica sutil */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 20 L30 40 M20 30 L40 30' stroke='white' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }} />
          </div>

          {/* Contenido */}
          <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white">
            {/* Header con logo */}
            <div>
              <div className="flex items-center gap-3 mb-12">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-2 ring-white/30">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-white text-3xl">ePrescription</h1>
                  <p className="text-blue-100 text-sm">Sistema Hospitalario</p>
                </div>
              </div>

              <div className="space-y-8 max-w-md">
                <div>
                  <h2 className="text-4xl xl:text-5xl mb-4 leading-tight">
                    Prescripción médica digital profesional
                  </h2>
                  <p className="text-blue-100 text-lg">
                    Sistema integral de gestión de recetas electrónicas con los más altos estándares internacionales de seguridad y cumplimiento normativo.
                  </p>
                </div>

                {/* Características destacadas */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 group">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Máxima seguridad</h3>
                      <p className="text-sm text-blue-100">Cumplimiento HIPAA, GDPR y normativas locales</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Interoperabilidad total</h3>
                      <p className="text-sm text-blue-100">Integración HL7, FHIR y sistemas hospitalarios</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 group">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Estándares internacionales</h3>
                      <p className="text-sm text-blue-100">Certificado FDA, OMS y autoridades sanitarias</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer con badges */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                  HL7 Compatible
                </Badge>
                <Badge variant="outline" className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                  FHIR R4
                </Badge>
                <Badge variant="outline" className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                  HIPAA Compliant
                </Badge>
                <Badge variant="outline" className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                  FDA Certified
                </Badge>
              </div>
              <p className="text-xs text-blue-200">
                © 2025 ePrescription. Sistema certificado bajo normativas internacionales.
              </p>
            </div>
          </div>
        </div>

        {/* Columna derecha: Formulario de login */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Logo móvil */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl mb-4 shadow-lg">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-primary mb-2">ePrescription</h1>
              <p className="text-muted-foreground">Sistema Hospitalario de Recetas Médicas</p>
            </div>

            {/* Tarjeta de login moderna */}
            <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-white/95">
              <CardHeader className="space-y-3 pb-6">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">Bienvenido</CardTitle>
                  <CardDescription className="text-base">
                    Accede a tu cuenta de forma segura
                  </CardDescription>
                </div>
                
                {/* Indicador de seguridad */}
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span className="text-green-700">Conexión segura SSL/TLS</span>
                </div>
              </CardHeader>
          
              <CardContent className="pt-0">
                <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as "password" | "gaudi")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 h-auto p-1 bg-muted/50">
                    <TabsTrigger 
                      value="password" 
                      className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span className="hidden sm:inline">Usuario y Contraseña</span>
                      <span className="sm:hidden">Contraseña</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="gaudi" 
                      className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm py-3"
                    >
                      <Shield className="w-4 h-4" />
                      <span className="hidden sm:inline">Firma Digital</span>
                      <span className="sm:hidden">GAUDI</span>
                    </TabsTrigger>
                  </TabsList>

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

              {/* Tab 1: Usuario y Contraseña */}
              <TabsContent value="password" className="space-y-4 mt-0">
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuario o correo electrónico</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="tu.correo@hospital.cr"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyPress}
                        onKeyUp={handleKeyPress}
                        autoComplete="current-password"
                        disabled={loading}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {capsLockOn && (
                      <p className="text-sm text-warning flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Bloq Mayús está activado
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        disabled={loading}
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm text-muted-foreground cursor-pointer select-none"
                      >
                        Recordar usuario
                      </label>
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 h-auto"
                      onClick={onNavigateToRecovery}
                      disabled={loading}
                    >
                      Olvidé mi contraseña
                    </Button>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verificando...
                      </div>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Iniciar sesión
                      </>
                    )}
                  </Button>

                  <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm text-blue-900">
                      <strong className="font-semibold">Modo Demo:</strong> Usa cualquier correo de la lista y contraseña <code className="bg-blue-200/50 px-1.5 py-0.5 rounded font-mono text-xs">Demo123!</code>
                    </AlertDescription>
                  </Alert>
                </form>
              </TabsContent>

              {/* Tab 2: Firma Digital GAUDI */}
              <TabsContent value="gaudi" className="space-y-4 mt-0">
                <form onSubmit={handleGaudiLogin} className="space-y-4">
                  <Alert className="bg-primary/5 border-primary/20">
                    <Shield className="h-4 w-4 text-primary" />
                    <AlertDescription>
                      La Firma Digital del BCCR (GAUDI) es el método más seguro de autenticación para el sector salud costarricense.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="cedula">Número de cédula</Label>
                    <Input
                      id="cedula"
                      type="text"
                      placeholder="0-0000-0000"
                      value={cedula}
                      onChange={(e) => {
                        // Auto-formatear cédula
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length > 1) value = value.slice(0, 1) + "-" + value.slice(1);
                        if (value.length > 6) value = value.slice(0, 6) + "-" + value.slice(6);
                        if (value.length > 11) value = value.slice(0, 11);
                        setCedula(value);
                      }}
                      disabled={loading}
                      required
                      maxLength={11}
                    />
                    <p className="text-sm text-muted-foreground">
                      Formato: 1-0234-0567
                    </p>
                  </div>

                  <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
                    <h4 className="flex items-center gap-2 text-foreground">
                      <Info className="w-4 h-4" />
                      Instrucciones
                    </h4>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Conecta tu lector de tarjetas</li>
                      <li>Inserta tu tarjeta de Firma Digital</li>
                      <li>Haz clic en "Continuar con GAUDI"</li>
                      <li>Ingresa tu PIN de seguridad cuando se solicite</li>
                    </ol>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full gap-2 h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verificando firma digital...
                      </div>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Continuar con GAUDI
                      </>
                    )}
                  </Button>

                  <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm text-blue-900">
                      <strong className="font-semibold">Modo Demo:</strong> Usa cédula <code className="bg-blue-200/50 px-1.5 py-0.5 rounded font-mono text-xs">1-0456-0789</code> para simular firma digital vinculada.
                    </AlertDescription>
                  </Alert>
                </form>
              </TabsContent>

              {/* Footer links */}
              <div className="mt-8 pt-6 border-t border-border text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  ¿No tienes una cuenta?{" "}
                  <Button
                    variant="link"
                    className="px-1 h-auto text-blue-600 hover:text-blue-700"
                    onClick={onNavigateToRegister}
                    disabled={loading}
                  >
                    Solicitar registro
                  </Button>
                </p>
                <p className="text-sm text-muted-foreground">
                  ¿Necesitas ayuda?{" "}
                  <Button
                    variant="link"
                    className="px-1 h-auto text-blue-600 hover:text-blue-700"
                    disabled={loading}
                  >
                    Soporte técnico
                  </Button>
                </p>
              </div>
            </Tabs>
          </CardContent>
        </Card>

            {/* Footer de seguridad y certificaciones */}
            <div className="mt-8 space-y-4">
              {/* Badges de certificación */}
              <div className="flex flex-wrap justify-center gap-2 lg:hidden">
                <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                  HL7 Compatible
                </Badge>
                <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                  FHIR R4
                </Badge>
                <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                  HIPAA
                </Badge>
              </div>

              {/* Información de seguridad */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  <span>Certificado bajo normativas HL7, FDA y OMS</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Conforme a OWASP ASVS y NIST 800-63B
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
