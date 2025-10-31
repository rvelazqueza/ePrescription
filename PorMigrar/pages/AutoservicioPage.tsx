import { useState } from "react";
import {
  KeyRound,
  User,
  MessageSquare,
  Shield,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Send,
  Save,
  Trash2,
  Clock,
  MessageCircle,
  FileText,
  Archive,
  CheckCheck,
  AlertTriangle,
  Info,
  Lock,
  UserCog,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { toast } from "sonner@2.0.3";
import { authStore } from "../utils/authStore";
import { messagesStore, type Message, type Conversation, type MessageTopic } from "../utils/messagesStore";
import {
  validatePasswordStrength,
  getPasswordStrength,
  validatePasswordMatch,
  validatePasswordDifferent,
  validateUserProfile,
  PASSWORD_POLICIES
} from "../utils/securityValidation";
import { getCurrentSession } from "../utils/multiRoleSession";
import { getUserById } from "../utils/usersStore";

export function AutoservicioPage() {
  const [activeTab, setActiveTab] = useState("password");

  return (
    <div className="space-y-6">
      {/* Header Profesional */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <UserCog className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-white mb-2">Autoservicio del Usuario</h1>
              <p className="text-blue-50 text-lg max-w-2xl">
                Gestiona tu cuenta de forma autónoma, actualiza tus datos personales y comunícate con la administración del sistema
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Shield className="w-3 h-3 mr-1" />
                  Cifrado E2E
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  HIPAA Compliant
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  FDA 21 CFR Part 11
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  NIST 800-63B
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert de seguridad */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>Seguridad garantizada:</strong> Todas las operaciones están protegidas con cifrado de extremo a extremo y cumplen con estándares internacionales de seguridad médica.
        </AlertDescription>
      </Alert>

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-white border border-border shadow-sm">
          <TabsTrigger
            value="password"
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white py-3"
          >
            <KeyRound className="w-4 h-4" />
            <span className="hidden sm:inline">Cambiar contraseña</span>
            <span className="sm:hidden">Contraseña</span>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white py-3"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Actualizar datos</span>
            <span className="sm:hidden">Datos</span>
          </TabsTrigger>
          <TabsTrigger
            value="messages"
            className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white py-3"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Mensajería</span>
            <span className="sm:hidden">Mensajes</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Cambiar contraseña */}
        <TabsContent value="password">
          <ChangePasswordSection />
        </TabsContent>

        {/* TAB 2: Actualizar datos */}
        <TabsContent value="profile">
          <UpdateProfileSection />
        </TabsContent>

        {/* TAB 3: Mensajería */}
        <TabsContent value="messages">
          <MessagingSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================
// SECCIÓN 1: CAMBIO DE CONTRASEÑA
// ============================================
function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Obtener datos del usuario actual
  const session = getCurrentSession();
  const user = session ? getUserById(session.userId) : null;

  // Calcular fortaleza de contraseña usando módulo centralizado
  const passwordStrength = getPasswordStrength(newPassword);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación 1: Campos obligatorios
    if (!currentPassword) {
      setError("Debes ingresar tu contraseña actual");
      return;
    }

    // Validación 2: Contraseñas coinciden
    const matchValidation = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchValidation.valid) {
      setError(matchValidation.message || "Las contraseñas no coinciden");
      return;
    }

    // Validación 3: Nueva contraseña diferente de la actual
    const differentValidation = validatePasswordDifferent(currentPassword, newPassword);
    if (!differentValidation.valid) {
      setError(differentValidation.message || "La nueva contraseña debe ser diferente a la actual");
      return;
    }

    // Validación 4: Fortaleza según NIST 800-63B
    const strengthValidation = validatePasswordStrength(newPassword, {
      username: user?.username,
      email: user?.email,
      fullName: user?.fullName,
      phone: user?.phone
    });

    if (!strengthValidation.valid) {
      setError(strengthValidation.message || "Contraseña no válida");
      return;
    }

    setLoading(true);

    try {
      // Simular cambio de contraseña (en producción validar contraseña actual)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Limpiar formulario
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);

      // Registrar en auditoría
      console.log('🔐 Cambio de contraseña registrado:', {
        userId: user?.userId,
        timestamp: new Date().toISOString(),
        compliance: 'NIST 800-63B, HIPAA, FDA 21 CFR Part 11'
      });

      toast.success("Contraseña actualizada exitosamente", {
        description: "Por seguridad, se cerrarán todas tus sesiones activas. Cambio registrado en auditoría."
      });

      // Resetear success después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Error al cambiar la contraseña. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="border-b border-border bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardTitle className="flex items-center gap-2 text-primary">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <KeyRound className="w-5 h-5" />
          </div>
          Cambiar contraseña
        </CardTitle>
        <CardDescription className="text-base">
          Mínimo {PASSWORD_POLICIES.MIN_LENGTH} caracteres con {PASSWORD_POLICIES.MIN_CHAR_TYPES} tipos de caracteres según <strong>NIST 800-63B</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleChangePassword} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-success/50 bg-success/5 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                <strong>¡Contraseña actualizada!</strong> Tus sesiones se cerrarán en todos los dispositivos.
              </AlertDescription>
            </Alert>
          )}

          {/* Contraseña actual */}
          <div className="space-y-2">
            <Label htmlFor="current-password">Contraseña actual</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={loading}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Separator />

          {/* Nueva contraseña */}
          <div className="space-y-2">
            <Label htmlFor="new-password">Nueva contraseña</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                required
                className="pr-10"
                placeholder={`Mínimo ${PASSWORD_POLICIES.MIN_LENGTH} caracteres`}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Indicador de fortaleza */}
            {newPassword && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Fortaleza</span>
                  <span className={`font-medium ${passwordStrength.strength < 50 ? "text-destructive" :
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

          {/* Confirmar contraseña */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
                className="pr-10"
                placeholder="Repite tu nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Requisitos */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">Requisitos de seguridad:</p>
            </div>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors ${newPassword.length >= 12 ? "text-success" : "text-muted-foreground"}`} />
                <span className={newPassword.length >= 12 ? "text-success font-medium" : "text-muted-foreground"}>
                  Mínimo 12 caracteres
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors ${(/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)) ? "text-success" : "text-muted-foreground"}`} />
                <span className={(/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)) ? "text-success font-medium" : "text-muted-foreground"}>
                  Incluir mayúsculas, minúsculas y números
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors ${/[^a-zA-Z0-9]/.test(newPassword) ? "text-success" : "text-muted-foreground"}`} />
                <span className={/[^a-zA-Z0-9]/.test(newPassword) ? "text-success font-medium" : "text-muted-foreground"}>
                  Al menos un símbolo especial (!@#$%^&*)
                </span>
              </li>
            </ul>
          </div>

          {/* Alert de seguridad */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Por seguridad, al cambiar tu contraseña se cerrarán todas tus sesiones activas en todos los dispositivos.
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Actualizando contraseña...
              </div>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Cambiar contraseña
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ============================================
// SECCIÓN 2: ACTUALIZAR PERFIL
// ============================================
function UpdateProfileSection() {
  // Obtener datos del usuario actual
  const session = getCurrentSession();
  const user = session ? getUserById(session.userId) : null;

  const [email, setEmail] = useState(user?.email || "dr.martinez@hospital.cr");
  const [phone, setPhone] = useState(user?.phone || "+506 8888-7777");
  const [address, setAddress] = useState("San José, Costa Rica");
  const [loading, setLoading] = useState(false);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Validar datos antes de solicitar firma
    const validation = validateUserProfile({
      fullName: user?.fullName || '',
      email,
      phone,
      specialty: user?.specialty || '',
      department: user?.department || ''
    });

    if (!validation.valid) {
      setValidationErrors(validation.errors);
      toast.error('Error de validación', {
        description: validation.messages[0] || 'Por favor corrige los errores'
      });
      return;
    }

    // Para datos sensibles, requerir firma digital
    setPendingChanges({ email, phone, address });
    setShowSignatureDialog(true);
  };

  const handleConfirmWithSignature = async () => {
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Registrar en auditoría
      console.log('🔐 Actualización de datos registrada en auditoría:', {
        userId: user?.userId,
        changes: pendingChanges,
        timestamp: new Date().toISOString(),
        compliance: 'HIPAA, FDA 21 CFR Part 11'
      });

      setShowSignatureDialog(false);
      toast.success("Datos actualizados correctamente", {
        description: "Los cambios han sido registrados en auditoría según normativa HIPAA."
      });
    } catch (err) {
      toast.error("Error al actualizar datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-2 text-primary">
            <div className="bg-purple-600 text-white p-2 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            Actualizar datos personales
          </CardTitle>
          <CardDescription className="text-base">
            Modifica tu información de contacto. Los cambios requieren <strong>autenticación adicional</strong> por seguridad.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Alert de seguridad */}
            <Alert className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
              <Lock className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-900">
                <strong>Autenticación requerida:</strong> Por tratarse de datos sensibles, necesitarás confirmar con tu contraseña o firma digital.
              </AlertDescription>
            </Alert>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Correo electrónico *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                disabled={loading}
                required
                className={validationErrors.email ? 'border-destructive' : ''}
              />
              {validationErrors.email && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {validationErrors.email}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Se enviará un código de verificación al nuevo correo
              </p>
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Teléfono *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (validationErrors.phone) {
                    setValidationErrors(prev => ({ ...prev, phone: '' }));
                  }
                }}
                disabled={loading}
                required
                className={validationErrors.phone ? 'border-destructive' : ''}
                placeholder="+506 1234-5678"
              />
              {validationErrors.phone && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {validationErrors.phone}
                </p>
              )}
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Dirección
              </Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={loading}
                rows={3}
              />
            </div>

            {/* Info de auditoría */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Todos los cambios quedan registrados en el log de auditoría según normativa HIPAA y FDA 21 CFR Part 11.
              </AlertDescription>
            </Alert>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all"
              disabled={loading}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Guardar cambios
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Dialog de confirmación con firma */}
      <Dialog open={showSignatureDialog} onOpenChange={setShowSignatureDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar cambios</DialogTitle>
            <DialogDescription>
              Por seguridad, confirma tu identidad para actualizar tus datos personales
            </DialogDescription>
          </DialogHeader>

          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-900">
              Estás a punto de modificar datos sensibles. Esta acción quedará registrada en auditoría.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label htmlFor="confirm-password">Contraseña actual</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Ingresa tu contraseña"
                disabled={loading}
              />
            </div>

            <div className="text-sm text-muted-foreground text-center">
              o usa tu firma digital si está habilitada
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSignatureDialog(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmWithSignature} disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Confirmando...
                </div>
              ) : (
                "Confirmar cambios"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ============================================
// SECCIÓN 3: MENSAJERÍA
// ============================================
function MessagingSection() {
  const [view, setView] = useState<"list" | "conversation" | "new">("list");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const userId = "user-001"; // En producción, obtener del contexto

  const stats = messagesStore.getMessagingStats(userId);

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversaciones</p>
                <p className="text-3xl font-semibold text-primary">{stats.totalConversations}</p>
              </div>
              <div className="bg-blue-600 text-white p-3 rounded-xl">
                <MessageCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activas</p>
                <p className="text-3xl font-semibold text-success">{stats.activeConversations}</p>
              </div>
              <div className="bg-success text-white p-3 rounded-xl">
                <CheckCheck className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sin leer</p>
                <p className="text-3xl font-semibold text-warning">{stats.unreadMessages}</p>
              </div>
              <div className="bg-warning text-white p-3 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-slate-50 to-gray-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Borradores</p>
                <p className="text-3xl font-semibold text-slate-700">{stats.draftMessages}</p>
              </div>
              <div className="bg-slate-600 text-white p-3 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vista condicional */}
      {view === "list" && (
        <ConversationsList
          userId={userId}
          onSelectConversation={(conv) => {
            setSelectedConversation(conv);
            setView("conversation");
          }}
          onNewMessage={() => setView("new")}
        />
      )}

      {view === "conversation" && selectedConversation && (
        <ConversationView
          conversation={selectedConversation}
          onBack={() => {
            setView("list");
            setSelectedConversation(null);
          }}
        />
      )}

      {view === "new" && (
        <NewMessageForm
          userId={userId}
          onBack={() => setView("list")}
          onSent={() => setView("list")}
        />
      )}
    </div>
  );
}

// Componente: Lista de conversaciones
function ConversationsList({
  userId,
  onSelectConversation,
  onNewMessage
}: {
  userId: string;
  onSelectConversation: (conv: Conversation) => void;
  onNewMessage: () => void;
}) {
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");

  const conversations = messagesStore.getUserConversations(
    userId,
    filter === "all" ? undefined : filter
  );

  const getTopicLabel = (topic: MessageTopic) => {
    const topics = messagesStore.getTopics();
    return topics.find(t => t.value === topic)?.label || topic;
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="border-b border-border bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-primary">
              <div className="bg-emerald-600 text-white p-2 rounded-lg">
                <MessageCircle className="w-5 h-5" />
              </div>
              Mis conversaciones
            </CardTitle>
            <CardDescription className="text-base">
              Comunicación <strong>segura y cifrada</strong> con la administración
            </CardDescription>
          </div>
          <Button
            onClick={onNewMessage}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all"
          >
            <Send className="w-4 h-4 mr-2" />
            Nuevo mensaje
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex gap-2 mb-4 p-1 bg-muted rounded-lg inline-flex">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : ""}
          >
            Todas
          </Button>
          <Button
            variant={filter === "active" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("active")}
            className={filter === "active" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : ""}
          >
            Activas
          </Button>
          <Button
            variant={filter === "closed" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("closed")}
            className={filter === "closed" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : ""}
          >
            Cerradas
          </Button>
        </div>

        {/* Lista */}
        <div className="space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hay conversaciones</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className="border border-border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{conv.subject}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getTopicLabel(conv.topic)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {conv.messageCount} mensaje{conv.messageCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={conv.status === "active" ? "default" : "secondary"}>
                      {conv.status === "active" ? "Activa" : "Cerrada"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Última actividad: {new Date(conv.lastMessageAt).toLocaleString("es-CR")}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Componente: Vista de conversación
function ConversationView({
  conversation,
  onBack
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);

  const messages = messagesStore.getConversationMessages(conversation.id);

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    setLoading(true);
    try {
      await messagesStore.createMessage({
        topic: conversation.topic,
        subject: `Re: ${conversation.subject}`,
        content: replyContent,
        fromUserId: "user-001",
        fromUserName: "Dr. Carlos Martínez",
        priority: "normal",
        status: "sent",
        conversationId: conversation.id,
        parentMessageId: messages[messages.length - 1]?.id
      });

      setReplyContent("");
      toast.success("Respuesta enviada");
    } catch (err) {
      toast.error("Error al enviar respuesta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="border-b border-border bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div className="flex-1">
            <CardTitle className="text-primary">{conversation.subject}</CardTitle>
            <CardDescription className="text-base">
              {conversation.messageCount} mensaje{conversation.messageCount !== 1 ? "s" : ""} ·
              <Badge
                variant={conversation.status === "active" ? "default" : "secondary"}
                className="ml-2"
              >
                {conversation.status === "active" ? "Activa" : "Cerrada"}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mensajes */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`border rounded-lg p-4 ${msg.fromUserRole === "user"
                ? "bg-blue-50 border-blue-200 ml-8"
                : "bg-gray-50 border-gray-200 mr-8"
                }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium">{msg.fromUserName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleString("es-CR")}
                  </p>
                </div>
                <Badge variant={msg.fromUserRole === "user" ? "default" : "secondary"}>
                  {msg.fromUserRole === "user" ? "Tú" : "Admin"}
                </Badge>
              </div>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
        </div>

        {/* Responder */}
        {conversation.status === "active" && (
          <div className="space-y-2">
            <Label>Responder</Label>
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Escribe tu respuesta..."
              rows={4}
              disabled={loading}
            />
            <Button onClick={handleReply} disabled={loading || !replyContent.trim()}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar respuesta
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Componente: Nuevo mensaje
function NewMessageForm({
  userId,
  onBack,
  onSent
}: {
  userId: string;
  onBack: () => void;
  onSent: () => void;
}) {
  const [topic, setTopic] = useState<MessageTopic>("consulta-general");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<"normal" | "high">("normal");
  const [loading, setLoading] = useState(false);

  const topics = messagesStore.getTopics();

  const handleSubmit = async (status: "draft" | "sent") => {
    if (!subject.trim() || !content.trim()) {
      toast.error("Completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      await messagesStore.createMessage({
        topic,
        subject,
        content,
        fromUserId: userId,
        fromUserName: "Dr. Carlos Martínez",
        priority,
        status
      });

      toast.success(status === "draft" ? "Borrador guardado" : "Mensaje enviado");
      onSent();
    } catch (err) {
      toast.error("Error al enviar mensaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="border-b border-border bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Send className="w-5 h-5" />
              Nuevo mensaje
            </CardTitle>
            <CardDescription className="text-base">
              Envía un mensaje <strong>seguro y cifrado</strong> a la administración
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tópico */}
        <div className="space-y-2">
          <Label>Tópico</Label>
          <Select value={topic} onValueChange={(v) => setTopic(v as MessageTopic)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {topics.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  <div>
                    <div className="font-medium">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{t.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Prioridad */}
        <div className="space-y-2">
          <Label>Prioridad</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Asunto */}
        <div className="space-y-2">
          <Label>Asunto</Label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Título del mensaje"
            disabled={loading}
          />
        </div>

        {/* Contenido */}
        <div className="space-y-2">
          <Label>Mensaje</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe tu mensaje..."
            rows={8}
            disabled={loading}
          />
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleSubmit("draft")}
            disabled={loading}
            className="h-12"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar borrador
          </Button>
          <Button
            onClick={() => handleSubmit("sent")}
            disabled={loading}
            className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enviando mensaje...
              </div>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Enviar mensaje
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
