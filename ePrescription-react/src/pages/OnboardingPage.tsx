import { useState, useEffect } from "react";
import { 
  UserPlus, Mail, Phone, Shield, CheckCircle2, AlertCircle, 
  ArrowLeft, ArrowRight, Eye, EyeOff, FileText, Lock, Key, Building2,
  Stethoscope, AlertTriangle, Loader2, Upload, Users, Heart, Globe, Activity, Sparkles
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { authStore } from "../utils/authStore";
import { toast } from "sonner";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface OnboardingPageProps {
  onBack: () => void;
  onComplete: (email: string) => void;
}

// Tipos de perfil de usuario (homologado con RegistroUsuariosPage)
const PERFILES_USUARIO = [
  { value: "medico", label: "Médico", colegio: "Colegio de Médicos y Cirujanos de Costa Rica", requiereColegio: true },
  { value: "farmaceutico", label: "Farmacéutico / Regente Farmacéutico", colegio: "Colegio de Farmacéuticos de Costa Rica", requiereColegio: true },
  { value: "odontologo", label: "Odontólogo", colegio: "Colegio de Cirujanos Dentistas de Costa Rica", requiereColegio: true },
  { value: "enfermero", label: "Enfermero / Obstetra", colegio: "Colegio de Enfermeros de Costa Rica", requiereColegio: true },
  { value: "veterinario", label: "Médico Veterinario", colegio: "Colegio de Médicos Veterinarios de Costa Rica", requiereColegio: true },
  { value: "farmacia", label: "Farmacia", colegio: "N/A", requiereColegio: false },
  { value: "centro_medico", label: "Centro Médico", colegio: "N/A", requiereColegio: false },
  { value: "drogueria", label: "Droguería", colegio: "N/A", requiereColegio: false },
  { value: "laboratorio", label: "Laboratorio", colegio: "N/A", requiereColegio: false },
  { value: "funcionario", label: "Funcionario de Salud", colegio: "N/A", requiereColegio: false }
];

type TipoControlado = "estupefacientes" | "psicotropicos" | "antimicrobianos" | "ninguno";
type MetodoAutenticacion = "password" | "digital_signature" | "";

export function OnboardingPage({ onBack, onComplete }: OnboardingPageProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  
  // Paso 1: Tipo de perfil y medicamentos controlados
  const [perfilUsuario, setPerfilUsuario] = useState("");
  const [tipoMedicamentosControlados, setTipoMedicamentosControlados] = useState<TipoControlado>("ninguno");
  const [metodoAutenticacion, setMetodoAutenticacion] = useState<MetodoAutenticacion>("");
  
  // Paso 2: Validación profesional (si aplica)
  const [codigoProfesional, setCodigoProfesional] = useState("");
  const [validandoProfesional, setValidandoProfesional] = useState(false);
  const [profesionalValidado, setProfesionalValidado] = useState(false);
  const [datosValidados, setDatosValidados] = useState({
    nombreCompleto: "",
    cedula: "",
    estadoProfesional: ""
  });
  
  // Paso 3: Datos básicos y credenciales
  const [fullName, setFullName] = useState("");
  const [idType, setIdType] = useState<"Cédula" | "DIMEX" | "Pasaporte">("Cédula");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  
  // Paso 4: Verificación de contacto
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [phoneSent, setPhoneSent] = useState(false);
  
  // Paso 5: Configuración de autenticación
  const [configureMFA, setConfigureMFA] = useState<"now" | "later">("now");
  const [mfaMethod, setMfaMethod] = useState<"totp" | "sms" | "email" | "none">("totp");
  const [totpSecret, setTotpSecret] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [mfaConfigured, setMfaConfigured] = useState(false);
  const [digitalSignatureFile, setDigitalSignatureFile] = useState<File | null>(null);
  const [digitalSignaturePin, setDigitalSignaturePin] = useState("");
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Validar si necesita firma digital obligatoria
  const necesitaFirmaDigitalObligatoria = (): boolean => {
    return tipoMedicamentosControlados === "estupefacientes" || 
           tipoMedicamentosControlados === "psicotropicos";
  };

  // Auto-seleccionar método si es obligatorio
  useEffect(() => {
    if (necesitaFirmaDigitalObligatoria()) {
      setMetodoAutenticacion("digital_signature");
    }
  }, [tipoMedicamentosControlados]);

  // Validar fortaleza de contraseña
  const validatePasswordStrength = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 12) {
      return { valid: false, message: "Mínimo 12 caracteres" };
    }

    let characterTypes = 0;
    if (/[a-z]/.test(password)) characterTypes++;
    if (/[A-Z]/.test(password)) characterTypes++;
    if (/[0-9]/.test(password)) characterTypes++;
    if (/[^a-zA-Z0-9]/.test(password)) characterTypes++;

    if (characterTypes < 3) {
      return { valid: false, message: "Debe incluir al menos 3 tipos de caracteres" };
    }

    return { valid: true };
  };

  // Validar código profesional
  const validarCodigoProfesional = async () => {
    if (!codigoProfesional) {
      toast.error("Ingrese el código profesional");
      return;
    }

    setValidandoProfesional(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulación de respuesta exitosa
      setDatosValidados({
        nombreCompleto: "Dr. Juan Carlos Pérez González",
        cedula: "1-0234-0567",
        estadoProfesional: "activo"
      });
      setProfesionalValidado(true);
      toast.success("Código profesional validado correctamente");
    } catch (err) {
      toast.error("Error al validar código profesional");
    } finally {
      setValidandoProfesional(false);
    }
  };

  // Paso 1: Validar y continuar
  const handleStep1Continue = () => {
    setError(null);
    
    if (!perfilUsuario) {
      setError("Selecciona tu tipo de perfil");
      return;
    }
    
    if (tipoMedicamentosControlados !== "ninguno" && !metodoAutenticacion) {
      setError("Selecciona el método de autenticación");
      return;
    }

    if (necesitaFirmaDigitalObligatoria() && metodoAutenticacion !== "digital_signature") {
      setError("Para medicamentos estupefacientes o psicotrópicos es obligatorio usar Firma Digital");
      return;
    }
    
    const perfilSeleccionado = PERFILES_USUARIO.find(p => p.value === perfilUsuario);
    if (perfilSeleccionado?.requiereColegio) {
      setStep(2); // Ir a validación profesional
    } else {
      setStep(3); // Saltar a datos básicos
    }
  };

  // Paso 2: Validar y continuar
  const handleStep2Continue = () => {
    if (!profesionalValidado) {
      setError("Debe validar el código profesional");
      return;
    }
    
    if (datosValidados.estadoProfesional !== "activo") {
      setError("El profesional debe estar en estado activo");
      return;
    }
    
    setError(null);
    setStep(3);
  };

  // Paso 3: Validar y continuar
  const handleStep3Continue = () => {
    setError(null);
    
    // Validaciones
    if (!fullName.trim()) {
      setError("Ingresa tu nombre completo");
      return;
    }
    
    if (!idNumber.trim()) {
      setError("Ingresa tu número de identificación");
      return;
    }
    
    // Validar formato según tipo
    if (idType === "Cédula" && !/^\d-\d{4}-\d{4}$/.test(idNumber)) {
      setError("Formato de cédula inválido. Usa: 0-0000-0000");
      return;
    }
    
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresa un correo electrónico válido");
      return;
    }

    if (!phone.trim()) {
      setError("Ingresa tu teléfono");
      return;
    }
    
    if (metodoAutenticacion === "password") {
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }
      
      const validation = validatePasswordStrength(password);
      if (!validation.valid) {
        setError(validation.message || "Contraseña no válida");
        return;
      }
    }
    
    if (!termsAccepted || !privacyAccepted) {
      setError("Debes aceptar los términos y política de privacidad");
      return;
    }
    
    setStep(4);
  };

  // Paso 4: Enviar código de verificación
  const handleSendEmailCode = async () => {
    setError(null);
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setEmailSent(true);
      setSuccess("Código enviado a tu correo");
    } catch (err) {
      setError("Error al enviar código");
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneCode = async () => {
    setError(null);
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setPhoneSent(true);
      setSuccess("Código enviado a tu teléfono");
    } catch (err) {
      setError("Error al enviar código");
    } finally {
      setLoading(false);
    }
  };

  // Verificar códigos
  const handleVerifyEmail = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const result = await authStore.verifyEmail(emailCode);
      if (result.success) {
        setEmailVerified(true);
        setSuccess("Correo verificado");
      } else {
        setError(result.error || "Código incorrecto");
      }
    } catch (err) {
      setError("Error al verificar");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const result = await authStore.verifyPhone(phoneCode);
      if (result.success) {
        setPhoneVerified(true);
        setSuccess("Teléfono verificado");
      } else {
        setError(result.error || "Código incorrecto");
      }
    } catch (err) {
      setError("Error al verificar");
    } finally {
      setLoading(false);
    }
  };

  // Paso 5: Configurar autenticación
  const handleStep5Continue = () => {
    if (metodoAutenticacion === "digital_signature") {
      if (!digitalSignatureFile) {
        setError("Debe cargar el archivo de firma digital (.p12)");
        return;
      }
      if (!digitalSignaturePin || digitalSignaturePin.length < 4) {
        setError("Debe ingresar el PIN de la firma digital");
        return;
      }
    } else if (metodoAutenticacion === "password") {
      if (configureMFA === "now" && !mfaConfigured) {
        setError("Debe configurar el método de autenticación de dos factores");
        return;
      }
    }
    
    setError(null);
    setStep(6);
  };

  // Configurar MFA
  const handleConfigureMFA = () => {
    if (configureMFA === "later") {
      setStep(6);
      return;
    }
    
    // Generar secret TOTP (mock)
    const mockSecret = "JBSWY3DPEHPK3PXP"; // Base32 secret
    setTotpSecret(mockSecret);
  };

  const handleVerifyTOTP = async () => {
    setError(null);
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (totpCode === "123456" || /^\d{6}$/.test(totpCode)) {
        setMfaConfigured(true);
        setSuccess("MFA configurado exitosamente");
        setTimeout(() => setStep(6), 1000);
      } else {
        setError("Código incorrecto");
      }
    } catch (err) {
      setError("Error al verificar");
    } finally {
      setLoading(false);
    }
  };

  // Paso 6: Enviar solicitud
  const handleSubmitRegistration = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const result = await authStore.submitRegistration({
        fullName,
        idType,
        idNumber,
        email,
        phone: phone || undefined,
        preferredAuthMethod: metodoAutenticacion === "digital_signature" ? "digital_signature" : "password",
        emailVerified,
        phoneVerified,
        termsAccepted,
        privacyAccepted
      });
      
      if (result.success) {
        setSuccess("Solicitud enviada exitosamente");
        setTimeout(() => {
          onComplete(email);
        }, 2000);
      } else {
        setError("Error al enviar solicitud");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const getTotalSteps = () => {
    const perfilSeleccionado = PERFILES_USUARIO.find(p => p.value === perfilUsuario);
    return perfilSeleccionado?.requiereColegio ? 6 : 5;
  };

  const getCurrentStepNumber = () => {
    const perfilSeleccionado = PERFILES_USUARIO.find(p => p.value === perfilUsuario);
    if (!perfilSeleccionado?.requiereColegio && step > 2) {
      return step - 1;
    }
    return step;
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
        {/* Columna izquierda: Branding e información - 40% en lg, 35% en xl */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-[35%] bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 relative overflow-hidden">
          {/* Imagen de fondo con overlay */}
          <div className="absolute inset-0 opacity-20">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1753487050407-8e92c66d9af4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Medical Registration"
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
          <div className="relative z-10 flex flex-col justify-between p-8 xl:p-12 text-white">
            {/* Header con logo */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/30">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-white text-2xl">ePrescription</h1>
                  <p className="text-blue-100 text-sm">Registro de Usuario</p>
                </div>
              </div>

              <div className="space-y-6 max-w-md">
                <div>
                  <h2 className="text-3xl xl:text-4xl mb-3 leading-tight">
                    {step === 1 && "Únete al ecosistema de salud digital"}
                    {step === 2 && "Validación profesional certificada"}
                    {step === 3 && "Tus datos están seguros"}
                    {step === 4 && "Verificación de identidad"}
                    {step === 5 && "Seguridad de nivel hospitalario"}
                    {step === 6 && "Estás a un paso de comenzar"}
                  </h2>
                  <p className="text-blue-100 text-base leading-relaxed">
                    {step === 1 && "Selecciona tu perfil profesional y define el tipo de medicamentos que prescribirás o dispensarás."}
                    {step === 2 && "Validamos tu código profesional con el colegio correspondiente para garantizar la autenticidad."}
                    {step === 3 && "Proporciona tu información personal. Cumplimos con HIPAA, GDPR y normativas de privacidad."}
                    {step === 4 && "Verificamos tu correo y teléfono para proteger tu cuenta contra accesos no autorizados."}
                    {step === 5 && "Configura tu método de autenticación: contraseña con MFA o Firma Digital BCCR."}
                    {step === 6 && "Un administrador revisará tu solicitud. Te notificaremos cuando sea aprobada."}
                  </p>
                </div>

                {/* Características destacadas según el paso */}
                <div className="space-y-3">
                  {step === 1 && (
                    <>
                      <div className="flex items-start gap-2.5 group">
                        <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm mb-0.5">10+ perfiles profesionales</h3>
                          <p className="text-xs text-blue-100">Médicos, farmacéuticos, odontólogos y más</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 group">
                        <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm mb-0.5">Control de medicamentos</h3>
                          <p className="text-xs text-blue-100">Cumplimiento para estupefacientes y psicotrópicos</p>
                        </div>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div className="flex items-start gap-2.5 group">
                        <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm mb-0.5">Integración con colegios</h3>
                          <p className="text-xs text-blue-100">Validación automática con colegios profesionales</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 group">
                        <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm mb-0.5">Verificación en tiempo real</h3>
                          <p className="text-xs text-blue-100">Estado profesional validado instantáneamente</p>
                        </div>
                      </div>
                    </>
                  )}

                  {(step === 3 || step === 4) && (
                    <>
                      <div className="flex items-start gap-2.5 group">
                        <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm mb-0.5">Privacidad garantizada</h3>
                          <p className="text-xs text-blue-100">Datos cifrados y protegidos</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 group">
                        <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm mb-0.5">Cumplimiento normativo</h3>
                          <p className="text-xs text-blue-100">HIPAA, GDPR y normativas locales</p>
                        </div>
                      </div>
                    </>
                  )}

                  {step === 5 && (
                    <>
                      <div className="flex items-start gap-2.5 group">
                        <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm mb-0.5">MFA de nivel bancario</h3>
                          <p className="text-xs text-blue-100">Autenticación de dos factores</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 group">
                        <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                          <Key className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm mb-0.5">Firma Digital BCCR</h3>
                          <p className="text-xs text-blue-100">Certificados GAUDI para medicamentos controlados</p>
                        </div>
                      </div>
                    </>
                  )}

                  {step === 6 && (
                    <>
                      <div className="flex items-start gap-2.5 group">
                        <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm mb-0.5">Revisión profesional</h3>
                          <p className="text-xs text-blue-100">Revisión por equipo de seguridad</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 group">
                        <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm mb-0.5">Acceso inmediato</h3>
                          <p className="text-xs text-blue-100">Acceso completo una vez aprobado</p>
                        </div>
                      </div>
                    </>
                  )}
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

        {/* Columna derecha: Formulario de registro - 60% en lg, 65% en xl */}
        <div className="flex-1 lg:w-3/5 xl:w-[65%] flex flex-col p-6 sm:p-8 lg:p-10 xl:p-12 overflow-y-auto">
          <div className="w-full max-w-3xl mx-auto my-auto">
            {/* Logo móvil */}
            <div className="lg:hidden text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl mb-3 shadow-lg">
                <UserPlus className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-primary mb-1 text-xl">Solicitud de registro</h1>
              <p className="text-muted-foreground text-sm">
                {step === 1 && "Selecciona tu perfil"}
                {step === 2 && "Valida tu código"}
                {step === 3 && "Datos básicos"}
                {step === 4 && "Verificación"}
                {step === 5 && "Autenticación"}
                {step === 6 && "Confirmación"}
              </p>
            </div>

          {/* Progress indicator - Compacto y eficiente */}
          <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative">
              {Array.from({ length: getTotalSteps() }, (_, i) => i + 1).map((s) => (
                <div key={s} className="flex items-center flex-1 relative">
                  <div className={`relative flex flex-col items-center z-10 transition-all duration-300 ${
                    getCurrentStepNumber() >= s ? "scale-100" : "scale-95"
                  }`}>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      getCurrentStepNumber() >= s 
                        ? "bg-gradient-to-br from-blue-600 to-cyan-600 border-blue-500 text-white" 
                        : "bg-white border-border text-muted-foreground"
                    }`}>
                      {getCurrentStepNumber() > s ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{s}</span>
                      )}
                    </div>
                    {/* Mini label debajo */}
                    <span className={`absolute -bottom-5 text-xs whitespace-nowrap transition-all duration-300 ${
                      getCurrentStepNumber() >= s ? "text-primary font-medium" : "text-muted-foreground"
                    }`}>
                      Paso {s}
                    </span>
                  </div>
                  {s < getTotalSteps() && (
                    <div className="flex-1 h-1.5 mx-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-500 ease-out rounded-full ${
                        getCurrentStepNumber() > s 
                          ? "w-full bg-gradient-to-r from-blue-600 to-cyan-600" 
                          : "w-0 bg-border"
                      }`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-lg border-border/50 bg-white">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-xl">
                {step === 1 && "Perfil y medicamentos controlados"}
                {step === 2 && "Validación profesional"}
                {step === 3 && "Datos básicos y credenciales"}
                {step === 4 && "Verificación de contacto"}
                {step === 5 && "Configuración de autenticación"}
                {step === 6 && "Confirmación"}
              </CardTitle>
              <CardDescription className="text-sm">
                {step === 1 && "Define tu perfil y los medicamentos que prescribirás o dispensarás"}
                {step === 2 && "Valida tu código profesional con el colegio correspondiente"}
                {step === 3 && "Proporciona tu información personal y crea tus credenciales"}
                {step === 4 && "Verifica tu correo y teléfono para continuar"}
                {step === 5 && "Configura tu método de autenticación segura"}
                {step === 6 && "Tu solicitud será revisada por un administrador"}
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

            {/* PASO 1: Perfil y medicamentos controlados */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <Label htmlFor="perfilUsuario" className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-primary" />
                    Tipo de perfil de usuario
                  </Label>
                  <Select value={perfilUsuario} onValueChange={setPerfilUsuario}>
                    <SelectTrigger id="perfilUsuario" className="h-12 border-2 hover:border-primary/50 transition-colors">
                      <SelectValue placeholder="Seleccione su perfil..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PERFILES_USUARIO.map((perfil) => (
                        <SelectItem key={perfil.value} value={perfil.value}>
                          <div className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4" />
                            {perfil.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {perfilUsuario && (
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                      <p className="text-sm text-blue-900">
                        <strong className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4" />
                          Colegio profesional:
                        </strong>
                        <span className="ml-6 text-blue-700">
                          {PERFILES_USUARIO.find(p => p.value === perfilUsuario)?.colegio}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4 p-5 bg-gradient-to-br from-muted/40 to-muted/20 border-2 border-border/50 rounded-xl">
                  <Label className="flex items-center gap-2 text-base">
                    <Shield className="w-5 h-5 text-primary" />
                    ¿Prescribirás o dispensarás medicamentos controlados?
                  </Label>
                  <RadioGroup 
                    value={tipoMedicamentosControlados} 
                    onValueChange={(v) => setTipoMedicamentosControlados(v as TipoControlado)}
                    className="space-y-3"
                  >
                    <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl transition-all cursor-pointer ${
                      tipoMedicamentosControlados === "ninguno"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-white hover:border-primary/30 hover:shadow-sm"
                    }`}>
                      <RadioGroupItem value="ninguno" id="control-ninguno" />
                      <Label htmlFor="control-ninguno" className="flex-1 cursor-pointer">
                        <p className="font-medium">No, solo medicamentos de libre venta</p>
                        <p className="text-sm text-muted-foreground">Sin restricciones especiales</p>
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl transition-all cursor-pointer ${
                      tipoMedicamentosControlados === "antimicrobianos"
                        ? "border-blue-500 bg-blue-50/50 shadow-md"
                        : "border-border bg-white hover:border-blue-300 hover:shadow-sm"
                    }`}>
                      <RadioGroupItem value="antimicrobianos" id="control-antimicrobianos" />
                      <Label htmlFor="control-antimicrobianos" className="flex-1 cursor-pointer">
                        <p className="font-medium">Antimicrobianos (Antibióticos)</p>
                        <p className="text-sm text-muted-foreground">Requiere registro especial</p>
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl transition-all cursor-pointer ${
                      tipoMedicamentosControlados === "psicotropicos"
                        ? "border-orange-500 bg-orange-50 shadow-md"
                        : "border-orange-200 bg-orange-50/30 hover:border-orange-400 hover:shadow-sm"
                    }`}>
                      <RadioGroupItem value="psicotropicos" id="control-psicotropicos" />
                      <Label htmlFor="control-psicotropicos" className="flex-1 cursor-pointer">
                        <p className="font-medium flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          Psicotrópicos
                        </p>
                        <p className="text-sm text-orange-700">Requiere Firma Digital obligatoria</p>
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-3 p-4 border-2 rounded-xl transition-all cursor-pointer ${
                      tipoMedicamentosControlados === "estupefacientes"
                        ? "border-red-500 bg-red-50 shadow-md"
                        : "border-red-200 bg-red-50/30 hover:border-red-400 hover:shadow-sm"
                    }`}>
                      <RadioGroupItem value="estupefacientes" id="control-estupefacientes" />
                      <Label htmlFor="control-estupefacientes" className="flex-1 cursor-pointer">
                        <p className="font-medium flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          Estupefacientes
                        </p>
                        <p className="text-sm text-red-700">Requiere Firma Digital obligatoria</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {tipoMedicamentosControlados !== "ninguno" && (
                  <div className="space-y-3 p-4 bg-blue-50/50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900">Método de Autenticación Requerido</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          {necesitaFirmaDigitalObligatoria()
                            ? "Para estupefacientes y psicotrópicos es OBLIGATORIO usar Firma Digital BCCR."
                            : "Para antimicrobianos puedes usar Firma Digital o Usuario/Contraseña + MFA."}
                        </p>
                      </div>
                    </div>

                    {necesitaFirmaDigitalObligatoria() ? (
                      <Alert>
                        <Lock className="h-4 w-4" />
                        <AlertDescription>
                          La Firma Digital ha sido seleccionada automáticamente por requisitos de seguridad nacional.
                          Configurarás tu firma digital en los siguientes pasos.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <RadioGroup value={metodoAutenticacion} onValueChange={(v) => setMetodoAutenticacion(v as MetodoAutenticacion)}>
                        <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted/50">
                          <RadioGroupItem value="password" id="auth-password" />
                          <Label htmlFor="auth-password" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              <div>
                                <p>Usuario y Contraseña + MFA</p>
                                <p className="text-sm text-muted-foreground">Configurarás tus credenciales en los siguientes pasos</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-muted/50">
                          <RadioGroupItem value="digital_signature" id="auth-signature" />
                          <Label htmlFor="auth-signature" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              <div>
                                <p>Firma Digital BCCR (GAUDI)</p>
                                <p className="text-sm text-muted-foreground">Máxima seguridad, configurarás tu firma en los siguientes pasos</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-5">
                  <Button type="button" variant="outline" onClick={onBack} className="flex-1 h-11 hover:bg-muted">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={handleStep1Continue} className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all">
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* PASO 2: Validación profesional */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <AlertTitle className="text-blue-900">Validación con colegio profesional</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    Ingrese su código profesional para validar automáticamente sus datos con el{" "}
                    <strong>{PERFILES_USUARIO.find(p => p.value === perfilUsuario)?.colegio}</strong>
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="codigoProfesional" className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary" />
                    Código profesional
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="codigoProfesional"
                      value={codigoProfesional}
                      onChange={(e) => setCodigoProfesional(e.target.value.toUpperCase())}
                      placeholder="Ej: MED-12345"
                      disabled={profesionalValidado}
                      className="h-12 border-2 hover:border-primary/50 transition-colors"
                    />
                    <Button 
                      onClick={validarCodigoProfesional} 
                      disabled={validandoProfesional || profesionalValidado || !codigoProfesional}
                      className="h-12 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      {validandoProfesional && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {profesionalValidado ? <><CheckCircle2 className="w-4 h-4 mr-2" />Validado</> : "Validar"}
                    </Button>
                  </div>
                </div>

                {profesionalValidado && (
                  <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl space-y-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-green-900">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-medium text-lg">Datos validados exitosamente</h4>
                    </div>
                    <div className="grid gap-2 ml-2 pl-10 border-l-2 border-green-300">
                      <p className="text-sm"><span className="text-muted-foreground">Nombre:</span> <strong className="text-foreground">{datosValidados.nombreCompleto}</strong></p>
                      <p className="text-sm"><span className="text-muted-foreground">Cédula:</span> <strong className="text-foreground">{datosValidados.cedula}</strong></p>
                      <p className="text-sm"><span className="text-muted-foreground">Estado:</span> <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">{datosValidados.estadoProfesional}</Badge></p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-5">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 hover:bg-muted">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Atrás
                  </Button>
                  <Button onClick={handleStep2Continue} disabled={!profesionalValidado} className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all">
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* PASO 3: Datos básicos */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-primary" />
                    Nombre completo
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Juan Pérez Rodríguez"
                    required
                    className="h-12 border-2 hover:border-primary/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idType">Tipo de identificación</Label>
                    <Select value={idType} onValueChange={(v) => setIdType(v as typeof idType)}>
                      <SelectTrigger id="idType" className="h-12 border-2 hover:border-primary/50 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cédula">Cédula</SelectItem>
                        <SelectItem value="DIMEX">DIMEX</SelectItem>
                        <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idNumber">Número</Label>
                    <Input
                      id="idNumber"
                      value={idNumber}
                      onChange={(e) => {
                        if (idType === "Cédula") {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length > 1) value = value.slice(0, 1) + "-" + value.slice(1);
                          if (value.length > 6) value = value.slice(0, 6) + "-" + value.slice(6);
                          if (value.length > 11) value = value.slice(0, 11);
                          setIdNumber(value);
                        } else {
                          setIdNumber(e.target.value);
                        }
                      }}
                      placeholder={idType === "Cédula" ? "1-0234-0567" : "Número"}
                      required
                      className="h-12 border-2 hover:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu.correo@hospital.cr"
                    required
                    className="h-12 border-2 hover:border-primary/50 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" />
                    Teléfono móvil
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+506 8888-7777"
                    required
                    className="h-12 border-2 hover:border-primary/50 transition-colors"
                  />
                </div>

                {metodoAutenticacion === "password" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Mínimo 12 caracteres"
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repite tu contraseña"
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-3 pt-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    />
                    <div className="flex-1">
                      <label htmlFor="terms" className="text-sm cursor-pointer select-none">
                        Acepto los{" "}
                        <Button variant="link" className="px-0 h-auto">
                          <FileText className="w-3 h-3 mr-1" />
                          Términos y Condiciones de Uso
                        </Button>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="privacy" 
                      checked={privacyAccepted}
                      onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                    />
                    <div className="flex-1">
                      <label htmlFor="privacy" className="text-sm cursor-pointer select-none">
                        Acepto la{" "}
                        <Button variant="link" className="px-0 h-auto">
                          <FileText className="w-3 h-3 mr-1" />
                          Política de Privacidad y Protección de Datos
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>

                <Alert className="bg-blue-50/50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-sm text-blue-900">
                    <strong>Importante:</strong> ePrescription no recopila datos personales sensibles sin consentimiento explícito y cumple con normativas internacionales de privacidad.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3 pt-5">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      const perfilSeleccionado = PERFILES_USUARIO.find(p => p.value === perfilUsuario);
                      setStep(perfilSeleccionado?.requiereColegio ? 2 : 1);
                    }} 
                    className="flex-1 h-11 hover:bg-muted"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Atrás
                  </Button>
                  <Button onClick={handleStep3Continue} className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all">
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* PASO 4: Verificación de contacto */}
            {step === 4 && (
              <div className="space-y-5">
                {/* Verificar email */}
                <div className="space-y-3 p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <h4>Verificar correo electrónico</h4>
                      <p className="text-sm text-muted-foreground">{email}</p>
                    </div>
                    {emailVerified && <CheckCircle2 className="w-5 h-5 text-success" />}
                  </div>

                  {!emailVerified && (
                    <>
                      {!emailSent ? (
                        <Button 
                          onClick={handleSendEmailCode} 
                          disabled={loading}
                          variant="outline"
                          className="w-full"
                        >
                          Enviar código de verificación
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="emailCode">Código de verificación</Label>
                          <div className="flex gap-2">
                            <Input
                              id="emailCode"
                              value={emailCode}
                              onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                              placeholder="000000"
                              maxLength={6}
                              className="text-center"
                            />
                            <Button onClick={handleVerifyEmail} disabled={loading || emailCode.length !== 6}>
                              Verificar
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">El código expira en 15 minutos</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Verificar teléfono */}
                <div className="space-y-3 p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <h4>Verificar teléfono</h4>
                      <p className="text-sm text-muted-foreground">{phone}</p>
                    </div>
                    {phoneVerified && <CheckCircle2 className="w-5 h-5 text-success" />}
                  </div>

                  {!phoneVerified && (
                    <>
                      {!phoneSent ? (
                        <Button 
                          onClick={handleSendPhoneCode} 
                          disabled={loading}
                          variant="outline"
                          className="w-full"
                        >
                          Enviar código por SMS
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="phoneCode">Código de verificación</Label>
                          <div className="flex gap-2">
                            <Input
                              id="phoneCode"
                              value={phoneCode}
                              onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                              placeholder="000000"
                              maxLength={6}
                              className="text-center"
                            />
                            <Button onClick={handleVerifyPhone} disabled={loading || phoneCode.length !== 6}>
                              Verificar
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">El código expira en 5 minutos</p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Las verificaciones de correo y teléfono son obligatorias para garantizar la seguridad de tu cuenta.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3 pt-5">
                  <Button type="button" variant="outline" onClick={() => setStep(3)} className="flex-1 h-11 hover:bg-muted">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Atrás
                  </Button>
                  <Button 
                    onClick={() => setStep(5)} 
                    className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all"
                    disabled={!emailVerified || !phoneVerified}
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* PASO 5: Configuración de autenticación */}
            {step === 5 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                {metodoAutenticacion === "digital_signature" ? (
                  <>
                    <Alert className="bg-primary/5 border-primary/20">
                      <Shield className="h-4 w-4 text-primary" />
                      <AlertTitle>Firma Digital BCCR (GAUDI)</AlertTitle>
                      <AlertDescription>
                        Necesitas tu certificado digital (.p12) emitido por el Banco Central de Costa Rica
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label htmlFor="digital-signature-file">Archivo de firma digital (.p12)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="digital-signature-file"
                          type="file"
                          accept=".p12,.pfx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setDigitalSignatureFile(file);
                              toast.success(`Archivo "${file.name}" cargado`);
                            }
                          }}
                        />
                      </div>
                      {digitalSignatureFile && (
                        <p className="text-sm text-success">✓ {digitalSignatureFile.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="digital-signature-pin">PIN del certificado</Label>
                      <Input
                        id="digital-signature-pin"
                        type="password"
                        value={digitalSignaturePin}
                        onChange={(e) => setDigitalSignaturePin(e.target.value)}
                        placeholder="Ingrese el PIN de su firma digital"
                        maxLength={8}
                      />
                      <p className="text-xs text-muted-foreground">
                        El PIN es requerido para validar el certificado
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Alert className="bg-primary/5 border-primary/20">
                      <Shield className="h-4 w-4 text-primary" />
                      <AlertDescription>
                        <strong>Recomendado:</strong> Activa la autenticación de dos factores (MFA) para proteger tu cuenta contra accesos no autorizados.
                      </AlertDescription>
                    </Alert>

                    <RadioGroup value={configureMFA} onValueChange={(v) => setConfigureMFA(v as typeof configureMFA)}>
                      <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                        <RadioGroupItem value="now" id="mfa-now" />
                        <Label htmlFor="mfa-now" className="flex-1 cursor-pointer">
                          Configurar ahora (recomendado)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                        <RadioGroupItem value="later" id="mfa-later" />
                        <Label htmlFor="mfa-later" className="flex-1 cursor-pointer">
                          Configurar más tarde
                        </Label>
                      </div>
                    </RadioGroup>

                    {configureMFA === "now" && !totpSecret && (
                      <Button onClick={handleConfigureMFA} className="w-full">
                        Generar código QR para MFA
                      </Button>
                    )}

                    {totpSecret && !mfaConfigured && (
                      <div className="space-y-4 p-4 border border-border rounded-lg">
                        <div className="text-center">
                          <div className="inline-block p-4 bg-white border-2 border-border rounded-lg">
                            {/* Placeholder QR code */}
                            <div className="w-48 h-48 bg-muted flex items-center justify-center">
                              <p className="text-sm text-muted-foreground">QR Code</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Escanea con Google Authenticator o similar
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="totpCode">Código de verificación (6 dígitos)</Label>
                          <div className="flex gap-2">
                            <Input
                              id="totpCode"
                              value={totpCode}
                              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                              placeholder="000000"
                              maxLength={6}
                              className="text-center"
                            />
                            <Button onClick={handleVerifyTOTP} disabled={loading || totpCode.length !== 6}>
                              Verificar
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex gap-3 pt-5">
                  <Button type="button" variant="outline" onClick={() => setStep(4)} className="flex-1 h-11 hover:bg-muted">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Atrás
                  </Button>
                  <Button onClick={handleStep5Continue} className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all">
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* PASO 6: Confirmación */}
            {step === 6 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-900">Datos listos para enviar</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Tu solicitud será revisada por un administrador. Recibirás una notificación cuando sea aprobada.
                  </AlertDescription>
                </Alert>

                <div className="p-4 border border-border rounded-lg space-y-3">
                  <h4 className="font-medium">Resumen de tu solicitud</h4>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-muted-foreground">Perfil:</p>
                      <p className="font-medium">{PERFILES_USUARIO.find(p => p.value === perfilUsuario)?.label}</p>
                    </div>
                    {codigoProfesional && (
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-muted-foreground">Código profesional:</p>
                        <p className="font-medium">{codigoProfesional}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-muted-foreground">Nombre:</p>
                      <p className="font-medium">{fullName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-muted-foreground">Identificación:</p>
                      <p className="font-medium">{idType}: {idNumber}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-muted-foreground">Correo:</p>
                      <p className="font-medium">{email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-muted-foreground">Teléfono:</p>
                      <p className="font-medium">{phone}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-muted-foreground">Medicamentos:</p>
                      <p className="font-medium">
                        {tipoMedicamentosControlados === "ninguno" ? "No controlados" : tipoMedicamentosControlados}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-muted-foreground">Autenticación:</p>
                      <p className="font-medium">
                        {metodoAutenticacion === "digital_signature" ? "Firma Digital" : "Usuario/Contraseña + MFA"}
                      </p>
                    </div>
                  </div>
                </div>

                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-900">
                    <strong>Estado:</strong> Tu cuenta quedará en estado "Pendiente de aprobación" hasta que un administrador la revise y apruebe. Recibirás una notificación por correo electrónico cuando tu cuenta sea activada.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3 pt-5">
                  <Button type="button" variant="outline" onClick={() => setStep(5)} className="flex-1 h-11 hover:bg-muted">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Atrás
                  </Button>
                  <Button onClick={handleSubmitRegistration} className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md hover:shadow-lg transition-all" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Enviar solicitud
                  </Button>
                </div>
              </div>
            )}

            {/* Botón volver al login */}
            <div className="mt-5 pt-5 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-2">
                ¿Ya tienes una cuenta?
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
                className="w-full h-10 text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio de sesión
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer para móvil con badges */}
        <div className="lg:hidden mt-6 space-y-3">
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm shadow-sm">
              HL7
            </Badge>
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm shadow-sm">
              FHIR R4
            </Badge>
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm shadow-sm">
              HIPAA
            </Badge>
            <Badge variant="outline" className="bg-white/80 backdrop-blur-sm shadow-sm">
              FDA
            </Badge>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            © 2025 ePrescription. Sistema certificado.
          </p>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
