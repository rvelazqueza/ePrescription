import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Shield,
  Lock,
  Key,
  Smartphone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileSignature,
  Clock,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { TipoReceta } from "./EnhancedMedicinePanel";

interface DigitalSignatureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (signatureData: SignatureData) => void;
  tipoReceta: TipoReceta;
  prescriptionNumber: string;
  patientName: string;
  medicineCount: number;
}

export interface SignatureData {
  metodo: "firma_digital" | "doble_factor";
  timestamp: string;
  certificadoDigital?: string;
  codigoVerificacion?: string;
  dispositivoAutenticacion?: string;
  ipAddress?: string;
}

type SignatureStep = "seleccion" | "firma_digital" | "doble_factor" | "verificando" | "completado";

export function DigitalSignatureDialog({
  isOpen,
  onClose,
  onSign,
  tipoReceta,
  prescriptionNumber,
  patientName,
  medicineCount
}: DigitalSignatureDialogProps) {
  const [currentStep, setCurrentStep] = useState<SignatureStep>("seleccion");
  const [selectedMethod, setSelectedMethod] = useState<"firma_digital" | "doble_factor" | null>(null);
  
  // Firma Digital
  const [certificatFile, setCertificatFile] = useState<File | null>(null);
  const [certificatePassword, setCertificatePassword] = useState("");
  
  // Doble Factor
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeExpiry, setCodeExpiry] = useState(300); // 5 minutos

  // Progreso
  const [progress, setProgress] = useState(0);

  // Determinar métodos permitidos según tipo de receta
  const metodosFirmaPermitidos = () => {
    if (tipoReceta === "estupefacientes" || tipoReceta === "psicotropicos") {
      return ["firma_digital"]; // Solo firma digital
    }
    if (tipoReceta === "antimicrobianos") {
      return ["firma_digital", "doble_factor"]; // Ambos métodos
    }
    return []; // Receta libre no requiere firma especial
  };

  const metodosPermitidos = metodosFirmaPermitidos();

  // Iniciar proceso de firma digital
  const handleStartFirmaDigital = () => {
    if (!certificatFile) {
      toast.error("Debe seleccionar un certificado digital");
      return;
    }
    if (!certificatePassword) {
      toast.error("Debe ingresar la contraseña del certificado");
      return;
    }

    setCurrentStep("verificando");
    setProgress(20);

    // Simular verificación del certificado
    setTimeout(() => {
      setProgress(50);
      setTimeout(() => {
        setProgress(80);
        setTimeout(() => {
          setProgress(100);
          setCurrentStep("completado");
          
          const signatureData: SignatureData = {
            metodo: "firma_digital",
            timestamp: new Date().toISOString(),
            certificadoDigital: certificatFile.name,
            ipAddress: "192.168.1.100" // En producción obtener IP real
          };
          
          toast.success("Receta firmada digitalmente con éxito");
          onSign(signatureData);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  // Enviar código de verificación
  const handleSendVerificationCode = () => {
    if (!phoneNumber && !email) {
      toast.error("Debe ingresar al menos un método de contacto");
      return;
    }

    setCodeSent(true);
    setCodeExpiry(300);
    
    // Simular envío de código
    toast.success(
      `Código de verificación enviado a ${phoneNumber || email}`,
      {
        description: "El código expirará en 5 minutos"
      }
    );

    // Iniciar temporizador
    const interval = setInterval(() => {
      setCodeExpiry(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Verificar código de doble factor
  const handleVerifyCode = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Ingrese un código de 6 dígitos");
      return;
    }

    setCurrentStep("verificando");
    setProgress(30);

    // Simular verificación
    setTimeout(() => {
      setProgress(70);
      setTimeout(() => {
        setProgress(100);
        setCurrentStep("completado");
        
        const signatureData: SignatureData = {
          metodo: "doble_factor",
          timestamp: new Date().toISOString(),
          codigoVerificacion: verificationCode,
          dispositivoAutenticacion: phoneNumber || email,
          ipAddress: "192.168.1.100"
        };
        
        toast.success("Receta autenticada con éxito mediante doble factor");
        onSign(signatureData);
      }, 1000);
    }, 1500);
  };

  // Formato de tiempo restante
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    // Resetear estado
    setCurrentStep("seleccion");
    setSelectedMethod(null);
    setCertificatFile(null);
    setCertificatePassword("");
    setPhoneNumber("");
    setEmail("");
    setVerificationCode("");
    setCodeSent(false);
    setProgress(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="w-5 h-5" />
            Firma y Autenticación de Receta
          </DialogTitle>
          <DialogDescription>
            Receta {prescriptionNumber} - {patientName} ({medicineCount} medicamento{medicineCount > 1 ? 's' : ''})
          </DialogDescription>
        </DialogHeader>

        {/* Información del tipo de receta */}
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4" />
          <AlertTitle>Tipo de Receta: {tipoReceta.toUpperCase()}</AlertTitle>
          <AlertDescription>
            {tipoReceta === "estupefacientes" || tipoReceta === "psicotropicos" ? (
              <p>Requiere <strong>firma digital obligatoria</strong> según normativa de medicamentos controlados.</p>
            ) : tipoReceta === "antimicrobianos" ? (
              <p>Requiere <strong>firma digital</strong> o <strong>doble factor de autenticación</strong> según normativa de antimicrobianos.</p>
            ) : (
              <p>Receta libre - No requiere firma especial.</p>
            )}
          </AlertDescription>
        </Alert>

        {/* Paso 1: Selección de método */}
        {currentStep === "seleccion" && (
          <div className="space-y-4 py-4">
            <h4 className="font-medium">Seleccione el método de autenticación:</h4>
            
            <div className="grid gap-4">
              {/* Firma Digital */}
              {metodosPermitidos.includes("firma_digital") && (
                <button
                  onClick={() => {
                    setSelectedMethod("firma_digital");
                    setCurrentStep("firma_digital");
                  }}
                  className="p-4 border-2 rounded-lg hover:border-primary hover:bg-accent transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Lock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium">Firma Digital</h5>
                      <p className="text-sm text-muted-foreground">
                        Utilice su certificado digital para firmar la receta de forma segura y con validez legal.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">Máxima Seguridad</Badge>
                        {(tipoReceta === "estupefacientes" || tipoReceta === "psicotropicos") && (
                          <Badge className="bg-red-100 text-red-800">Obligatorio</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )}

              {/* Doble Factor */}
              {metodosPermitidos.includes("doble_factor") && (
                <button
                  onClick={() => {
                    setSelectedMethod("doble_factor");
                    setCurrentStep("doble_factor");
                  }}
                  className="p-4 border-2 rounded-lg hover:border-primary hover:bg-accent transition-colors text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Smartphone className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium">Doble Factor de Autenticación</h5>
                      <p className="text-sm text-muted-foreground">
                        Reciba un código de verificación por SMS o email para autenticar la receta.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">Rápido y Seguro</Badge>
                        {tipoReceta === "antimicrobianos" && (
                          <Badge className="bg-blue-100 text-blue-800">Permitido</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Paso 2: Firma Digital */}
        {currentStep === "firma_digital" && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Lock className="w-5 h-5" />
              <h4 className="font-medium">Firma Digital</h4>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Seleccione su certificado digital (.p12, .pfx) e ingrese la contraseña correspondiente.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certificate">Certificado Digital *</Label>
                <Input
                  id="certificate"
                  type="file"
                  accept=".p12,.pfx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCertificatFile(e.target.files[0]);
                    }
                  }}
                />
                {certificatFile && (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {certificatFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña del Certificado *</Label>
                <Input
                  id="password"
                  type="password"
                  value={certificatePassword}
                  onChange={(e) => setCertificatePassword(e.target.value)}
                  placeholder="Ingrese la contraseña..."
                />
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Su contraseña es procesada de forma segura y no se almacena en nuestros servidores.
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("seleccion")}
                className="flex-1"
              >
                Atrás
              </Button>
              <Button
                onClick={handleStartFirmaDigital}
                className="flex-1"
                disabled={!certificatFile || !certificatePassword}
              >
                <Lock className="w-4 h-4 mr-2" />
                Firmar Receta
              </Button>
            </div>
          </div>
        )}

        {/* Paso 3: Doble Factor */}
        {currentStep === "doble_factor" && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 text-green-600">
              <Smartphone className="w-5 h-5" />
              <h4 className="font-medium">Autenticación de Doble Factor</h4>
            </div>

            {!codeSent ? (
              <>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Ingrese su número de teléfono o email para recibir un código de verificación.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Número de Teléfono</Label>
                    <div className="flex gap-2">
                      <Smartphone className="w-5 h-5 text-muted-foreground mt-2" />
                      <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+506 8888-8888"
                      />
                    </div>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    - O -
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <div className="flex gap-2">
                      <Mail className="w-5 h-5 text-muted-foreground mt-2" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="medico@ejemplo.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("seleccion")}
                    className="flex-1"
                  >
                    Atrás
                  </Button>
                  <Button
                    onClick={handleSendVerificationCode}
                    className="flex-1"
                    disabled={!phoneNumber && !email}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Enviar Código
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Código Enviado</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Se ha enviado un código de verificación a {phoneNumber || email}
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Código de Verificación</Label>
                    <Input
                      id="code"
                      type="text"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="text-center text-2xl tracking-widest"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Tiempo restante:</span>
                    <Badge variant={codeExpiry < 60 ? "destructive" : "outline"}>
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(codeExpiry)}
                    </Badge>
                  </div>

                  {codeExpiry === 0 && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        El código ha expirado. Por favor, solicite uno nuevo.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCodeSent(false);
                      setVerificationCode("");
                    }}
                    className="flex-1"
                  >
                    Reenviar Código
                  </Button>
                  <Button
                    onClick={handleVerifyCode}
                    className="flex-1"
                    disabled={verificationCode.length !== 6 || codeExpiry === 0}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Verificar
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Paso 4: Verificando */}
        {currentStep === "verificando" && (
          <div className="space-y-4 py-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h4 className="font-medium mb-2">Verificando...</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedMethod === "firma_digital" 
                  ? "Validando certificado digital y generando firma electrónica..."
                  : "Verificando código de autenticación..."}
              </p>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground mt-2">{progress}%</p>
            </div>
          </div>
        )}

        {/* Paso 5: Completado */}
        {currentStep === "completado" && (
          <div className="space-y-4 py-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-medium mb-2">¡Receta Firmada Exitosamente!</h4>
              <p className="text-sm text-muted-foreground">
                La receta ha sido autenticada y está lista para ser emitida.
              </p>
            </div>

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <ul className="space-y-1 text-sm">
                  <li>✓ Método: {selectedMethod === "firma_digital" ? "Firma Digital" : "Doble Factor"}</li>
                  <li>✓ Timestamp: {new Date().toLocaleString()}</li>
                  <li>✓ Estado: Validado y firmado</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Button onClick={handleClose} className="w-full">
              Continuar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}